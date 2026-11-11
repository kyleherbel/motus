// The grounds of the style (research/colour.md). Everything is synthesised here from
// the measured recipe; no pixels of the reference are used.
//   light : off-white base cooling to pale blue at the left, two soft palm-frond shadows
//           multiplied over it, fine monochrome grain; fronds and grain sway on a 5 s wave
//   dark  : a blurred, dimmed echo of the card itself, darker toward every edge
//   white : flat #FFFFFF, no grain
import { W, H } from './tokens.js';

const SLICE = 12;                         // px; the wave displaces the texture column by column

function noiseUrl(kit, seed, w, h, sd) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); const img = g.createImageData(w, h); const r = kit.seeded(seed);
  for (let i = 0; i < img.data.length; i += 4) {
    // sum of three uniforms: near-Gaussian, centred on mid-grey
    const n = (r() + r() + r() - 1.5) * 2;
    const v = 128 + n * sd * 3.2;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

/** A palm frond as SVG paths: a curved rib with tapering leaflets on both sides. */
function frond(kit, { ox, oy, tx, ty, bend, leaflets, len, width, seed }) {
  const r = kit.seeded(seed);
  const paths = [];
  const rib = (u) => { const mx = (ox + tx) / 2 + bend * (ty - oy) * 0.5, my = (oy + ty) / 2 - bend * (tx - ox) * 0.5; const a = 1 - u; return [a * a * ox + 2 * a * u * mx + u * u * tx, a * a * oy + 2 * a * u * my + u * u * ty]; };
  for (let i = 0; i < leaflets; i++) {
    const u = 0.08 + (0.9 * i) / leaflets;
    const [x, y] = rib(u); const [x2, y2] = rib(Math.min(1, u + 0.02));
    const dir = Math.atan2(y2 - y, x2 - x);
    for (const side of [-1, 1]) {
      const a = dir + side * (0.62 + r() * 0.22);
      const L = len * (1 - u * 0.55) * (0.85 + r() * 0.3), wd = width * (1 - u * 0.4) * (0.8 + r() * 0.4);
      const ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L;
      const nx = -Math.sin(a) * wd * 0.5, ny = Math.cos(a) * wd * 0.5;
      const mx = x + Math.cos(a) * L * 0.45, my = y + Math.sin(a) * L * 0.45;
      paths.push(`M${x.toFixed(1)} ${y.toFixed(1)}Q${(mx + nx).toFixed(1)} ${(my + ny).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}Q${(mx - nx).toFixed(1)} ${(my - ny).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}Z`);
    }
  }
  return paths.join('');
}

function frondUrl(kit, colour, spec, blur, opacity, pad) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H + pad * 2}" viewBox="0 ${-pad} ${W} ${H + pad * 2}"><defs><filter id="b" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs><path d="${frond(kit, spec)}" fill="${colour}" fill-opacity="${opacity}" filter="url(#b)"/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

/** A full-frame texture cut into vertical slices that a travelling sine wave moves up and down. */
function waveLayer(kit, image, { amp, wavelength, phase, period = 5, blend, size, pad = 24 }) {
  const { h } = kit;
  const el = h('div', { style: { position: 'absolute', left: '0', top: `${-pad}px`, width: `${W}px`, height: `${H + pad * 2}px`, mixBlendMode: blend, pointerEvents: 'none' } });
  const slices = [];
  for (let x = 0; x < W; x += SLICE) {
    const s = h('div', { style: { position: 'absolute', left: `${x}px`, top: '0', width: `${SLICE + 0.5}px`, height: `${H + pad * 2}px`, backgroundImage: image, backgroundPosition: `${-x}px 0`, backgroundSize: size || `${W}px ${H + pad * 2}px`, backgroundRepeat: 'repeat', willChange: 'transform' } });
    el.append(s); slices.push({ s, x: x + SLICE / 2 });
  }
  return {
    el,
    seek(t) { for (const { s, x } of slices) s.style.transform = `translateY(${(amp * Math.sin((2 * Math.PI * x) / wavelength - (2 * Math.PI * t) / period + phase)).toFixed(2)}px)`; },
  };
}

export function buildGrounds(S) {
  const { kit, C } = S; const { h } = kit;
  const full = { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px` };
  const pad = 24;

  // ---- light canvas
  const frondA = waveLayer(kit, frondUrl(kit, C.frond, { ox: -70, oy: -90, tx: 420, ty: 700, bend: -0.16, leaflets: 12, len: 330, width: 44, seed: 5 }, 6, 1, pad), { amp: 9, wavelength: 515, phase: 0.9, blend: 'multiply', pad });
  const frondB = waveLayer(kit, frondUrl(kit, C.frond, { ox: 1160, oy: 900, tx: 640, ty: 1230, bend: 0.12, leaflets: 9, len: 240, width: 40, seed: 9 }, 8, 0.45, pad), { amp: 13, wavelength: 795, phase: 2.53, blend: 'multiply', pad });
  const grain = waveLayer(kit, `url(${noiseUrl(kit, 7, 512, 512, 2.7)})`, { amp: 15.6, wavelength: 795, phase: 2.53, blend: 'soft-light', size: '512px 512px', pad });
  grain.el.style.filter = 'blur(0.6px)'; grain.el.style.opacity = '0.55';
  const light = h('div.ep-ground-light', { style: { ...full, background: C.canvas, overflow: 'hidden' } },
    h('div', { style: { ...full, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(20,30,40,0.018) 100%)' } }),
    frondA.el, frondB.el, grain.el);

  // ---- dark focus backdrop: the card's own light, enlarged and blurred until it is one even field at 0.43
  // gain (a white card gives mid-grey, a dark terminal gives near-black), then darkened toward every edge
  const echo = h('div', { style: { ...full, background: 'rgb(110,110,110)' } });
  const dark = h('div.ep-ground-dark', { style: { ...full, background: '#050506', overflow: 'hidden' } },
    echo,
    h('div', { style: { ...full, background: 'linear-gradient(180deg, rgba(0,0,0,0.34) 3%, rgba(0,0,0,0) 34%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.52) 98%)' } }),
    h('div', { style: { ...full, background: 'linear-gradient(90deg, rgba(0,0,0,0.31) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.31) 100%)' } }));

  const white = h('div.ep-ground-white', { style: { ...full, background: C.white } });
  const black = h('div.ep-ground-black', { style: { ...full, background: '#000' } });
  // isolate: the grounds re-order themselves with z-index and must not climb over the layers above
  const el = h('div.ep-grounds', { style: { ...full, isolation: 'isolate', overflow: 'hidden' } }, black, light, dark, white);
  const byMode = { 'light-split': light, 'dark-focus': dark, white, 'presenter-full': black };
  let lastEcho = '';

  return {
    el,
    /**
     * runs: mode runs in order; a run with fadeIn > 0 cross-fades over the previous ground.
     * echoOf(t): { x, y, w, h, tone } of the card currently in dark focus (tone 'light' | 'dark' | a css colour), or null.
     */
    seek(t, runs, echoOf) {
      const cur = runs.find((r) => t >= r.start && t < r.end) || (t < runs[0].start ? runs[0] : runs[runs.length - 1]);
      const idx = runs.indexOf(cur);
      const prev = idx > 0 ? runs[idx - 1] : null;
      const p = cur.fadeIn > 0 ? S.E.emph(kit.clamp((t - cur.start) / cur.fadeIn)) : 1;
      for (const [mode, node] of Object.entries(byMode)) {
        const isCur = mode === cur.mode, under = prev && mode === prev.mode && p < 1 && !isCur;
        node.style.display = isCur || under ? '' : 'none';
        node.style.opacity = isCur ? String(p) : '1';
        node.style.zIndex = isCur ? '2' : '1';
      }
      if (cur.mode === 'light-split' || (prev && prev.mode === 'light-split' && p < 1)) { frondA.seek(t); frondB.seek(t); grain.seek(t); }
      if (cur.mode === 'dark-focus') {
        const e = echoOf(t);
        const tone = e?.tone ?? 'light';
        // tone: 'light' | 'dark' | [r, g, b] average colour of the card's content
        const rgb = tone === 'dark' ? [18, 18, 20] : Array.isArray(tone) ? tone : [255, 255, 255];
        const colour = `rgb(${rgb.map((v) => Math.round(v * 0.43)).join(',')})`;
        if (colour !== lastEcho) { lastEcho = colour; echo.style.background = colour; }
      }
    },
  };
}
