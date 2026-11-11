// Footage views. The engine owns the current frame; a style asks for views
// (canvases) and positions, scales and clips them with CSS.
//
// The source is "packed": the colour picture on the left half and, when the project
// has a person matte, the matte as greyscale on the right half. One decode gives both,
// so colour and matte can never drift apart.

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = vec2((p.x+1.0)*0.5, 1.0-(p.y+1.0)*0.5); gl_Position = vec4(p,0.0,1.0); }`;
const FRAG = `precision mediump float; varying vec2 v; uniform sampler2D s; uniform vec2 edge; uniform float texW;
void main(){
  float lim = 0.5 - 0.75/texW;
  vec3 c = texture2D(s, vec2(min(v.x*0.5, lim), v.y)).rgb;
  float a = texture2D(s, vec2(max(0.5 + v.x*0.5, 0.5 + 0.75/texW), v.y)).r;
  a = smoothstep(edge.x, edge.y, a);
  gl_FragColor = vec4(c*a, a);
}`;

class PlainView {
  constructor(f) {
    this.f = f;
    this.canvas = document.createElement('canvas');
    this.canvas.width = f.width; this.canvas.height = f.height;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
  }
  draw(src) { this.ctx.drawImage(src, 0, 0, this.f.width, this.f.height, 0, 0, this.f.width, this.f.height); }
}

class CutoutView {
  constructor(f, opt) {
    this.f = f;
    this.edge = [opt.lo ?? 0.25, opt.hi ?? 0.75];
    this.canvas = document.createElement('canvas');
    this.canvas.width = f.width; this.canvas.height = f.height;
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
    this.uEdge = gl.getUniformLocation(prog, 'edge');
    this.uTexW = gl.getUniformLocation(prog, 'texW');
    gl.clearColor(0, 0, 0, 0);
  }
  draw(src) {
    const { f, gl } = this;
    if (!f.hasMatte) {                        // no matte in this project: the cutout is simply empty
      if (gl) { gl.clear(gl.COLOR_BUFFER_BIT); } else { this.ctx.clearRect(0, 0, f.width, f.height); }
      return;
    }
    if (!gl) return this.draw2d(src);
    gl.viewport(0, 0, f.width, f.height);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.uniform2f(this.uEdge, this.edge[0], this.edge[1]);
    gl.uniform1f(this.uTexW, f.width * 2);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  draw2d(src) {                               // software fallback when WebGL is unavailable
    const { f, ctx } = this; const W = f.width, H = f.height;
    this._m ||= Object.assign(document.createElement('canvas'), { width: W, height: H }).getContext('2d', { willReadFrequently: true });
    this._m.drawImage(src, W, 0, W, H, 0, 0, W, H);
    const m = this._m.getImageData(0, 0, W, H).data;
    ctx.drawImage(src, 0, 0, W, H, 0, 0, W, H);
    const img = ctx.getImageData(0, 0, W, H); const d = img.data;
    const [lo, hi] = this.edge;
    for (let i = 0; i < d.length; i += 4) {
      let a = (m[i] / 255 - lo) / (hi - lo); a = a < 0 ? 0 : a > 1 ? 1 : a; a = a * a * (3 - 2 * a);
      d[i + 3] = Math.round(a * 255);
    }
    ctx.putImageData(img, 0, 0);
  }
}

export class Footage {
  /** @param {{width:number,height:number,hasMatte:boolean}} info picture size (one half of the packed frame) */
  constructor(info) {
    this.width = info.width; this.height = info.height; this.hasMatte = !!info.hasMatte;
    this.views = []; this.src = null;
  }
  /**
   * A canvas showing the current frame. `matte: true` gives the person cut out on transparency
   * (empty when the project has no matte). lo/hi tighten the matte edge (smoothstep bounds, 0..1).
   */
  view(opt = {}) {
    const v = opt.matte ? new CutoutView(this, opt) : new PlainView(this);
    v.canvas.classList.add(opt.matte ? 'motus-cutout' : 'motus-footage');
    this.views.push(v);
    if (this.src) v.draw(this.src);
    return v.canvas;
  }
  /** Called by the stage whenever the frame changes. src: HTMLVideoElement | HTMLImageElement | ImageBitmap */
  present(src) { this.src = src; for (const v of this.views) v.draw(src); }
}
