// Footage views. The engine owns the current frame; a style asks for views
// (canvases) and positions, scales and clips them with CSS.
//
// The source is "packed": several pictures side by side in one video frame, so one decode
// gives all of them and they can never drift apart.
//   footage     the 9:16 output picture, left (always)
//   matte       the person matte of the footage as greyscale, next to it (when the project has one)
//   wide        the whole source frame, scaled to half the output height, in a column on the right,
//               with its own matte under it (only when the style asks for it and the source is wider
//               than 9:16; see docs/ARCHITECTURE.md, "footage")

/**
 * Where each picture sits in the packed frame, in pixels.
 * info: { width, height, hasMatte, wide?: { width, height } } (width/height = the footage picture)
 */
export function packedLayout(info) {
  const W = info.width, H = info.height;
  const L = { footage: { x: 0, y: 0, w: W, h: H }, matte: info.hasMatte ? { x: W, y: 0, w: W, h: H } : null, wide: null, wideMatte: null };
  let x = info.hasMatte ? 2 * W : W;
  if (info.wide && info.wide.width > 0 && info.wide.height > 0) {
    const { width: ww, height: wh } = info.wide;
    L.wide = { x, y: 0, w: ww, h: wh };
    L.wideMatte = info.hasMatte ? { x, y: wh, w: ww, h: wh } : null;
    x += ww;
  }
  L.width = x; L.height = H;
  return L;
}

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = vec2((p.x+1.0)*0.5, 1.0-(p.y+1.0)*0.5); gl_Position = vec4(p,0.0,1.0); }`;
// cr / mr: the colour and matte rectangles in texture space (x, y, w, h); inset keeps linear
// filtering from reading across into the neighbouring picture
const FRAG = `precision mediump float; varying vec2 v; uniform sampler2D s; uniform vec2 edge; uniform vec4 cr; uniform vec4 mr; uniform vec2 inset;
void main(){
  vec2 c = clamp(cr.xy + v*cr.zw, cr.xy + inset, cr.xy + cr.zw - inset);
  vec2 m = clamp(mr.xy + v*mr.zw, mr.xy + inset, mr.xy + mr.zw - inset);
  vec3 col = texture2D(s, c).rgb;
  float a = smoothstep(edge.x, edge.y, texture2D(s, m).r);
  gl_FragColor = vec4(col*a, a);
}`;

class PlainView {
  constructor(f, rect) {
    this.f = f; this.r = rect;
    this.canvas = document.createElement('canvas');
    this.canvas.width = rect.w; this.canvas.height = rect.h;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
  }
  draw(src) { const r = this.r; this.ctx.drawImage(src, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h); }
}

class CutoutView {
  constructor(f, rect, matteRect, opt) {
    this.f = f; this.r = rect; this.m = matteRect;
    this.edge = [opt.lo ?? 0.25, opt.hi ?? 0.75];
    this.canvas = document.createElement('canvas');
    this.canvas.width = rect.w; this.canvas.height = rect.h;
    if (!matteRect) { this.ctx = this.canvas.getContext('2d'); return; }   // no matte: the cut-out is simply empty
    const gl = this.canvas.getContext('webgl', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false });
    this.gl = gl;
    if (!gl) { this.ctx = this.canvas.getContext('2d'); return; }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`Motus cut-out shader: ${gl.getShaderInfoLog(s)}`); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(`Motus cut-out shader: ${gl.getProgramInfoLog(prog)}`);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    for (const [k, v] of [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    const PW = f.layout.width, PH = f.layout.height;
    const n = (q) => [q.x / PW, q.y / PH, q.w / PW, q.h / PH];
    gl.uniform4f(gl.getUniformLocation(prog, 'cr'), ...n(rect));
    gl.uniform4f(gl.getUniformLocation(prog, 'mr'), ...n(matteRect));
    gl.uniform2f(gl.getUniformLocation(prog, 'inset'), 0.75 / PW, 0.75 / PH);
    this.uEdge = gl.getUniformLocation(prog, 'edge');
    gl.clearColor(0, 0, 0, 0);
  }
  draw(src) {
    const { r, gl } = this;
    if (!this.m) { this.ctx.clearRect(0, 0, r.w, r.h); return; }
    if (!gl) return this.draw2d(src);
    gl.viewport(0, 0, r.w, r.h);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.uniform2f(this.uEdge, this.edge[0], this.edge[1]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  draw2d(src) {                               // software fallback when WebGL is unavailable
    const { r, m, ctx } = this; const W = r.w, H = r.h;
    this._m ||= Object.assign(document.createElement('canvas'), { width: W, height: H }).getContext('2d', { willReadFrequently: true });
    this._m.drawImage(src, m.x, m.y, m.w, m.h, 0, 0, W, H);
    const md = this._m.getImageData(0, 0, W, H).data;
    ctx.drawImage(src, r.x, r.y, r.w, r.h, 0, 0, W, H);
    const img = ctx.getImageData(0, 0, W, H); const d = img.data;
    const [lo, hi] = this.edge;
    for (let i = 0; i < d.length; i += 4) {
      let a = (md[i] / 255 - lo) / (hi - lo); a = a < 0 ? 0 : a > 1 ? 1 : a; a = a * a * (3 - 2 * a);
      d[i + 3] = Math.round(a * 255);
    }
    ctx.putImageData(img, 0, 0);
  }
}

export class Footage {
  /** @param {{width:number,height:number,hasMatte:boolean,wide?:{width:number,height:number}|null}} info the footage picture size and what else is packed */
  constructor(info) {
    this.width = info.width; this.height = info.height; this.hasMatte = !!info.hasMatte;
    this.layout = packedLayout(info);
    /** true when a wide view of the whole source frame is available (see view({ wide: true })) */
    this.hasWide = !!this.layout.wide;
    this.views = []; this.src = null;
  }
  /**
   * A canvas showing the current frame. `matte: true` gives the person cut out on transparency
   * (empty when the project has no matte). lo/hi tighten the matte edge (smoothstep bounds, 0..1).
   * `wide: true` shows the wide view (doc.wide.width x doc.wide.height) instead of the 9:16 footage;
   * when the project has none it falls back to the footage, so check `hasWide` first.
   */
  view(opt = {}) {
    const L = this.layout;
    const wide = !!opt.wide && !!L.wide;
    const rect = wide ? L.wide : L.footage;
    const mrect = wide ? L.wideMatte : L.matte;
    const v = opt.matte ? new CutoutView(this, rect, mrect, opt) : new PlainView(this, rect);
    v.canvas.classList.add(opt.matte ? 'motus-cutout' : 'motus-footage');
    if (wide) v.canvas.classList.add('motus-wide');
    this.views.push(v);
    if (this.src) v.draw(this.src);
    return v.canvas;
  }
  /** Called by the stage whenever the frame changes. src: HTMLVideoElement | HTMLImageElement | ImageBitmap */
  present(src) { this.src = src; for (const v of this.views) v.draw(src); }
}
