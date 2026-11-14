// What the tool made: an image or a clip inside the card, or a stack of 2-3 strips, each with
// its own outline, its own label pill and its own appearance word (graphics G20, G27, rule R13,
// layout L15). Measured on the reference:
//   single      the card is the media: full dark slot 94..985 x 255..1275 (clip35@150, clip33@140)
//   two strips  254..757 and 772..1277, gap 14 (clip31@615)
//   three       256..587 / 600..932 / 944..1275, gaps 12-13 (clip36@700)
//   entrance    each strip slides in from beyond the right edge of the frame on the emphasised curve
//               over 20 frames (rmse 0.3 % of the travel, clip36@646-666), smeared along the motion;
//               strips land on their own words, 32-38 frames apart (clip36@616, 648, 686)
//   label pill  46-50 px tall, fully round, 18-20 px side padding, bold white 27 px,
//               #444444 on white (= black at 73 %) or the accent, 21 px in from the strip's
//               outer left edge and 22 px down (clip31@615, clip14@690)
// Video is frame-exact in renders: seek(t) sets currentTime and settled() resolves only once every
// visible clip has seeked to it and its frame has been copied onto the strip's canvas.
import { cardFrame } from '../card.js';
import { fonts, F, W } from '../tokens.js';

// ---- TOKENS WANTED in tokens.js (layout.media / motion.media): kept here until the shared file can take them.
const G = {
  gap: [0, 0, 14, 12],                  // by strip count: 2 -> 14 (clip31@615), 3 -> 12 (clip36@700)
  pill: { h: 48, padX: 20, x: 21, y: 22, size: 27, weight: 700, tracking: -0.005,       // "Frame by Frame remake": 342x48, text 302 wide
    dark: 'rgba(0,0,0,0.73)', blur: 6 },   // #444444 over the white strip; over footage it reads (38,28,28)
  fill: { dark: '#0B0C0E', light: '#F3F4F6' },   // behind a contained image (letterbox)
};
const M = {
  slide: { dur: F(20), shutter: 0.5 },  // emphasised curve; smear = half the frame's travel
  stagger: F(34),                        // default spacing when items carry no word (32 and 38 measured)
};
const VIDEO = /\.(mp4|m4v|mov|webm)$/i;

/** Where a w x h picture lands inside a box, for cover or contain. */
function placeIn(bw, bh, w, h, fit) {
  const s = fit === 'contain' ? Math.min(bw / w, bh / h) : Math.max(bw / w, bh / h);
  const dw = w * s, dh = h * s;
  return { x: (bw - dw) / 2, y: (bh - dh) / 2, w: dw, h: dh };
}

export default {
  type: 'media-card',
  label: 'Media',
  slots: ['card'],
  params: {
    items: { type: 'array', min: 1, max: 3, of: {
      src: 'asset',                                                  // an image (png, jpg, webp) or a clip (mp4, mov, webm)
      label: { type: 'string', optional: true, maxChars: 26, maxWords: 4 },   // pill top-left: "Original", "Kling 2.1", "Input"
      accent: 'boolean?',                                            // the pill takes the accent colour (the result, the "after")
      fit: 'enum?:cover|contain',                                    // cover (default) fills the strip; contain shows all of it
      start: { type: 'number', optional: true, min: 0 },             // clip: seconds into the file at the moment the strip lands
      loop: 'boolean?',                                              // clip: loop instead of holding the last frame
      at: 'word?',                                                   // the word on which this strip slides in
    } },
  },
  beats: {},

  async prepare(params, S) {
    const tone = (src, w, h) => {
      try {
        const c = document.createElement('canvas'); c.width = 8; c.height = 8;
        const g = c.getContext('2d', { willReadFrequently: true });
        g.drawImage(src, 0, 0, w, h, 0, 0, 8, 8);
        const d = g.getImageData(0, 0, 8, 8).data; const s = [0, 0, 0];
        for (let i = 0; i < d.length; i += 4) { s[0] += d[i]; s[1] += d[i + 1]; s[2] += d[i + 2]; }
        return s.map((v) => v / 64);
      } catch { return null; }
    };
    const items = await Promise.all(params.items.map(async (it, k) => {
      const url = S.env.projectUrl(it.src);
      try {
        if (VIDEO.test(it.src)) {
          const v = document.createElement('video');
          Object.assign(v, { muted: true, playsInline: true, preload: 'auto', crossOrigin: 'anonymous' });
          v.src = url;
          await new Promise((res, rej) => { v.addEventListener('loadeddata', res, { once: true }); v.addEventListener('error', () => rej(new Error('load failed')), { once: true }); });
          let rgb = null;
          if (k === 0) {
            const at = Math.min(it.start || 0, Math.max(0, v.duration - 0.05));
            if (Math.abs(v.currentTime - at) > 1e-4) await new Promise((res) => { v.addEventListener('seeked', res, { once: true }); v.currentTime = at; });
            rgb = tone(v, v.videoWidth, v.videoHeight);
          }
          return { kind: 'video', url, video: v, w: v.videoWidth || 16, h: v.videoHeight || 9, duration: v.duration || 0, rgb };
        }
        const img = new Image(); img.crossOrigin = 'anonymous'; img.src = url;
        await img.decode();
        return { kind: 'image', url, img, w: img.naturalWidth || 1, h: img.naturalHeight || 1, rgb: k === 0 ? tone(img, img.naturalWidth, img.naturalHeight) : null };
      } catch {
        S.warn(`media-card: could not load ${it.src}`);
        return { kind: 'missing', url, w: 16, h: 9, rgb: null };
      }
    }));
    return { items };
  },

  prefer(params, { data, maxH, w }) {
    // one item: the card hugs the media's shape; a stack always fills the slot
    if (params.items.length > 1) return { h: maxH };
    const m = data?.items?.[0];
    return { h: m ? Math.min(maxH, Math.round((w * m.h) / m.w)) : maxH };
  },

  build(ctx) {
    const { S, params, rect, mode, tIn, tOut, data, modeCut } = ctx; const { kit, C } = S; const { h } = kit;
    const render = S.env.mode === 'render';
    const n = params.items.length;
    const gap = G.gap[n] || 0;
    const sh = (rect.h - gap * (n - 1)) / n;
    const root = h('div.ep-media', { style: { position: 'absolute', left: '0', top: '0', width: `${rect.w}px`, height: `${rect.h}px` } });
    const fid = `ep-media-${S.uid()}`;
    const ns = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(ns, 'svg');
    defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
    Object.assign(defs.style, { position: 'absolute', left: '0', top: '0' });
    defs.innerHTML = params.items.map((_, i) => `<filter id="${fid}-${i}" filterUnits="userSpaceOnUse" x="-1200" y="-200" width="${rect.w + 2400}" height="${sh + 400}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0 0"/></filter>`).join('');
    root.append(defs);

    // when each strip lands: its word, else one after another from the scene start
    let prevAt = -Infinity;
    const strips = params.items.map((it, i) => {
      const m = data?.items?.[i] || { kind: 'missing', w: 16, h: 9 };
      let at = it.at !== undefined ? S.wordTime(it.at) - M.slide.dur * 0.3 : tIn + i * M.stagger;
      at = Math.max(at, tIn, prevAt + F(6));
      prevAt = at;
      const y = i * (sh + gap);
      const card = cardFrame(S, { w: rect.w, h: sh, mode, tIn: at, fill: it.fit === 'contain' ? (mode === 'dark' ? G.fill.dark : G.fill.light) : '#000' });
      const box = placeIn(rect.w, sh, m.w, m.h, it.fit || 'cover');
      let media = null, canvas = null, g2d = null;
      const pos = { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px` };
      if (m.kind === 'image') media = h('img', { src: m.url, style: { ...pos, display: 'block' } });
      else if (m.kind === 'video' && render) {
        canvas = h('canvas', { width: String(Math.round(rect.w)), height: String(Math.round(sh)), style: { position: 'absolute', left: '0', top: '0', width: `${rect.w}px`, height: `${sh}px` } });
        g2d = canvas.getContext('2d');
        media = canvas;
      } else if (m.kind === 'video') {
        media = m.video;
        Object.assign(media.style, pos, { display: 'block', objectFit: 'fill' });
      } else media = h('div', { text: it.src.split('/').pop(), style: { position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `600 28px/1 ${fonts.sans}`, color: '#8E8E8E', background: '#16171A' } });
      card.body.append(media);
      if (it.label) {
        const pill = h('div.ep-media-pill', { text: it.label, style: { position: 'absolute', left: `${G.pill.x}px`, top: `${G.pill.y}px`, height: `${G.pill.h}px`, padding: `0 ${G.pill.padX}px`, borderRadius: `${G.pill.h / 2}px`, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
          background: it.accent ? C.accent : G.pill.dark, color: it.accent ? C.onAccent : '#FFFFFF', font: `${G.pill.weight} ${G.pill.size}px/1 ${fonts.sans}`, letterSpacing: `${G.pill.tracking}em`,
          backdropFilter: it.accent ? 'none' : `blur(${G.pill.blur}px)`, boxShadow: it.accent ? '0 2px 8px rgba(0,0,0,0.12)' : 'none' } });
        card.el.insertBefore(pill, card.overlay);
      }
      const holder = h('div', { style: { position: 'absolute', left: '0', top: `${y}px`, width: `${rect.w}px`, height: `${sh}px`, willChange: 'transform' } }, card.el);
      root.append(holder);
      // the first strip arrives with the layout (the stage settles, or the light card slides down)
      // unless it replaces another card in the same layout: then it slides like the others
      const slides = i > 0 || at > tIn + 1e-3 || (!modeCut && tIn > 0);
      return { it, m, i, at, card, holder, media, box, canvas, g2d, slides, blur: defs.querySelectorAll('feGaussianBlur')[i], travel: W - rect.x + 8, want: null, shown: null, pending: null };
    });
    if (strips.length > 1 || strips[0].slides) for (const s of strips) if (s.slides) S.sfx(s.at, 'cardIn');

    /** Which moment of a clip a strip shows at output time t. */
    const clipTime = (s, t) => {
      const dur = s.m.duration || 0;
      const t0 = Math.min(s.it.start || 0, Math.max(0, dur - 0.001));
      const age = Math.max(0, t - (s.slides ? s.at : tIn));
      let vt = t0 + age;
      if (s.it.loop && dur > t0 + 0.05) vt = t0 + ((vt - t0) % (dur - t0));
      return Math.min(vt, Math.max(0, dur - 0.001)) + 0.0005;   // half a millisecond past a frame boundary, never past the end
    };
    const offset = (s, t) => (s.slides ? s.travel * (1 - S.E.emph(kit.clamp((t - s.at) / M.slide.dur))) : 0);

    // ---- render mode: seek, wait for 'seeked', copy the frame onto the canvas
    const draw = (s) => {
      const v = s.m.video;
      s.g2d.clearRect(0, 0, s.canvas.width, s.canvas.height);
      s.g2d.drawImage(v, s.box.x, s.box.y, s.box.w, s.box.h);
      s.shown = s.want;
    };
    const seekVideo = (s, vt) => {
      s.want = vt;
      if (s.shown === vt && !s.pending) return;
      const v = s.m.video;
      const run = async () => {
        while (s.shown !== s.want) {
          const target = s.want;
          if (Math.abs(v.currentTime - target) > 1e-6 || v.readyState < 2) {
            await new Promise((res) => {
              const done = () => { v.removeEventListener('seeked', done); v.removeEventListener('error', done); res(); };
              v.addEventListener('seeked', done); v.addEventListener('error', done);
              v.currentTime = target;
            });
          }
          if (s.want === target) { draw(s); s.shown = target; }
        }
        s.pending = null;
      };
      if (!s.pending) s.pending = run();
    };

    // ---- preview mode: let the clip play with the stage and only correct drift
    let lastT = null;
    const followVideo = (s, t, vt, visible) => {
      const v = s.m.video;
      const playing = lastT !== null && t > lastT && t - lastT < 0.15;
      if (!visible || !playing) {
        if (!v.paused) v.pause();
        if (visible && Math.abs(v.currentTime - vt) > 0.02) v.currentTime = vt;
        return;
      }
      if (Math.abs(v.currentTime - vt) > 0.25) v.currentTime = vt;
      if (v.paused) v.play().catch(() => {});
    };

    return {
      el: root,
      tone: data?.items?.[0]?.rgb || 'dark',
      seek(t) {
        for (const s of strips) {
          const visible = t >= tIn && t < tOut && (!s.slides || t >= s.at);
          s.holder.style.display = visible ? '' : 'none';
          if (s.m.kind === 'video') {
            const vt = clipTime(s, t);
            if (render) { if (visible) seekVideo(s, vt); } else followVideo(s, t, vt, visible);
          }
          if (!visible) continue;
          s.card.seek(t);
          const dx = offset(s, t);
          s.holder.style.transform = dx > 0.05 ? `translateX(${dx.toFixed(2)}px)` : 'none';
          // the picture smears along the motion (a shutter open for half the frame) inside a frame
          // whose outline stays sharp, as on the reference (clip36@649-652)
          const v = Math.abs(offset(s, t + F(0.5)) - offset(s, t - F(0.5)));
          const sigma = (M.slide.shutter * v) / Math.sqrt(12);
          s.blur.setAttribute('stdDeviation', `${sigma.toFixed(2)} 0`);
          s.media.style.filter = sigma > 0.3 ? `url(#${fid}-${s.i})` : 'none';
        }
        lastT = t;
      },
      settled() { return Promise.all(strips.map((s) => s.pending).filter(Boolean)); },
    };
  },
};
