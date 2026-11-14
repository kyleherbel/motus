// Loading and showing user-supplied pictures and clips. Captures are never redrawn: the user's file
// is shown inside the style's frame [G19, G20]. Video is frame-exact in renders: seek(t) sets
// currentTime and settled() resolves only once the frame is on the canvas.
const VIDEO = /\.(mp4|m4v|mov|webm)$/i;

export async function loadMedia(S, src) {
  const url = S.env.projectUrl(src);
  try {
    if (VIDEO.test(src)) {
      const v = document.createElement('video');
      Object.assign(v, { muted: true, playsInline: true, preload: 'auto', crossOrigin: 'anonymous' });
      v.src = url;
      await new Promise((res, rej) => { v.addEventListener('loadeddata', res, { once: true }); v.addEventListener('error', () => rej(new Error('load failed')), { once: true }); });
      return { kind: 'video', url, video: v, w: v.videoWidth || 16, h: v.videoHeight || 9, duration: v.duration || 0 };
    }
    const img = new Image(); img.crossOrigin = 'anonymous'; img.src = url;
    await img.decode();
    return { kind: 'image', url, img, w: img.naturalWidth || 1, h: img.naturalHeight || 1 };
  } catch {
    S.warn(`could not load ${src}`);
    return { kind: 'missing', url, w: 16, h: 9, name: String(src).split('/').pop() };
  }
}

/** Where a w x h picture lands inside a box, for cover or contain. */
export function placeIn(bw, bh, w, h, fit) {
  const s = fit === 'contain' ? Math.min(bw / w, bh / h) : Math.max(bw / w, bh / h);
  const dw = w * s, dh = h * s;
  return { x: (bw - dw) / 2, y: (bh - dh) / 2, w: dw, h: dh };
}

/**
 * A view of one loaded medium in a bw x bh box. opt: { fit, start (clip seconds at t0), loop, t0 }.
 * Returns { el, seek(t, visible), settled() }.
 */
export function mediaView(S, m, bw, bh, opt = {}) {
  const { h } = S.kit;
  const render = S.env.mode === 'render';
  const box = placeIn(bw, bh, m.w, m.h, opt.fit || 'cover');
  const pos = { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px`, display: 'block' };
  let el, canvas = null, g = null;
  if (m.kind === 'image') el = h('img', { src: m.url, style: pos });
  else if (m.kind === 'video' && render) {
    canvas = h('canvas', { width: String(Math.round(bw)), height: String(Math.round(bh)), style: { position: 'absolute', left: '0', top: '0', width: `${bw}px`, height: `${bh}px` } });
    g = canvas.getContext('2d'); el = canvas;
  } else if (m.kind === 'video') { el = m.video; Object.assign(el.style, pos, { objectFit: 'fill' }); }
  else el = h('div', { text: m.name || 'missing', style: { position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '600 26px/1 system-ui', color: '#777', background: '#111' } });

  const st = { want: null, shown: null, pending: null };
  const clipTime = (t) => {
    const dur = m.duration || 0;
    const t0 = Math.min(opt.start || 0, Math.max(0, dur - 0.001));
    let vt = t0 + Math.max(0, t - (opt.t0 || 0));
    if (opt.loop && dur > t0 + 0.05) vt = t0 + ((vt - t0) % (dur - t0));
    return Math.min(vt, Math.max(0, dur - 0.001)) + 0.0005;
  };
  const seekVideo = (vt) => {
    st.want = vt;
    if (st.shown === vt && !st.pending) return;
    const v = m.video;
    const run = async () => {
      while (st.shown !== st.want) {
        const target = st.want;
        if (Math.abs(v.currentTime - target) > 1e-6 || v.readyState < 2) {
          await new Promise((res) => { const done = () => { v.removeEventListener('seeked', done); v.removeEventListener('error', done); res(); }; v.addEventListener('seeked', done); v.addEventListener('error', done); v.currentTime = target; });
        }
        if (st.want === target) { g.clearRect(0, 0, canvas.width, canvas.height); g.drawImage(v, box.x, box.y, box.w, box.h); st.shown = target; }
      }
      st.pending = null;
    };
    if (!st.pending) st.pending = run();
  };
  let lastT = null;
  const follow = (t, vt, visible) => {
    const v = m.video;
    const playing = lastT !== null && t > lastT && t - lastT < 0.15;
    if (!visible || !playing) { if (!v.paused) v.pause(); if (visible && Math.abs(v.currentTime - vt) > 0.02) v.currentTime = vt; return; }
    if (Math.abs(v.currentTime - vt) > 0.25) v.currentTime = vt;
    if (v.paused) v.play().catch(() => {});
  };
  return {
    el,
    seek(t, visible) {
      if (m.kind === 'video') { const vt = clipTime(t); if (render) { if (visible) seekVideo(vt); } else follow(t, vt, visible); }
      lastT = t;
    },
    settled: () => st.pending || Promise.resolve(),
  };
}
