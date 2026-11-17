// Helpers shared by the composition and the elements.
import { CX, layout, fonts, colour, motion } from './tokens.js';

export const setStyle = (el, key, v) => { if (el['_' + key] !== v) { el.style[key] = v; el['_' + key] = v; } };
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Progress 0..1 of a tween that starts at t0 and lasts dur, through an easing function. */
export const prog = (t, t0, dur, fn) => (t <= t0 ? 0 : t >= t0 + dur ? 1 : fn((t - t0) / dur));

/**
 * A part entering during a hold [M10-M14, X59, X60]: kind is 'pop' | 'slide' | 'grow' | 'land' | 'fade'.
 * a = seconds since it started. Returns { o, dx, dy, s } for applyPart. Nothing overshoots [M16, X29].
 */
export function partAt(S, a, kind = 'slide', opt = {}) {
  if (a < 0) return { o: 0, dx: 0, dy: 0, s: 1 };
  if (kind === 'pop') return { o: 1, dx: 0, dy: 0, s: 1 };
  const P = motion.prop;
  const p = S.E.out(clamp01(a / (opt.dur ?? P.dur)));
  switch (kind) {
    case 'grow': { const s0 = opt.from ?? P.growFrom; return { o: 1, dx: 0, dy: 0, s: s0 + (1 - s0) * p }; }
    case 'land': { const s0 = opt.from ?? P.landFrom; return { o: 1, dx: 0, dy: 0, s: s0 + (1 - s0) * p }; }
    case 'fade': return { o: 0.8 + 0.2 * p, dx: 0, dy: 0, s: 1 };   // visible at 0.8 contrast on its first frame [M15]
    default: {                                                    // slide, mostly from below [M12]
      const d = opt.dist ?? P.slide, dir = opt.dir || 'up';
      const off = d * (1 - p);
      return { o: 1, dx: dir === 'left' ? off : dir === 'right' ? -off : 0, dy: dir === 'up' ? off : dir === 'down' ? -off : 0, s: 1 };
    }
  }
}

/** Apply { o, dx, dy, s } to an element (writes only what changed). */
export function applyPart(el, st, origin) {
  setStyle(el, 'opacity', st.o >= 0.999 ? '' : st.o <= 0 ? '0' : st.o.toFixed(3));
  const moved = Math.abs(st.dx) > 0.05 || Math.abs(st.dy) > 0.05 || Math.abs(st.s - 1) > 0.0002;
  setStyle(el, 'transform', moved ? `translate(${st.dx.toFixed(2)}px, ${st.dy.toFixed(2)}px) scale(${st.s.toFixed(4)})` : '');
  if (origin && el._origin !== origin) { el.style.transformOrigin = origin; el._origin = origin; }
}

/**
 * Where a w x h graphic sits: centred on x 540 and on the stage's centre line, inside the stage's margins
 * [L20-L22]. A graphic larger than the stage is scaled down to fit and a warning is recorded.
 */
export function place(ctx, w, h) {
  const st = layout.stage[ctx.mode === 'full' ? 'full' : 'split'];
  const roomW = 1080 - 2 * st.margin, roomH = st.bottom - st.top;
  let s = 1;
  if (h > roomH) s = roomH / h;
  if (w * s > roomW) s = roomW / w;
  if (s < 0.999) ctx.S.warn(`${ctx.params.type}: ${Math.round(w)}x${Math.round(h)} px does not fit the ${ctx.mode} stage; scaled to ${Math.round(s * 100)} %`);
  const ww = w * s, hh = h * s;
  const y = Math.max(st.top, Math.min(st.bottom - hh, st.cy - hh / 2));
  return { x: CX - ww / 2, y, w: ww, h: hh, s };
}

/** The CSS font string for Inter at a pixel size and weight, with the optical size the reference uses for captions. */
export const sansFont = (size, weight = fonts.weight.body) => `${weight} ${size.toFixed(2)}px/1 ${fonts.sans}`;

/** A text node in Inter with its baseline at y. */
export function textAt(S, { text, x = CX, y, size, weight = fonts.weight.body, colour: c = colour.ink, align = 'center', tracking = 0, style = {} }) {
  const tf = align === 'center' ? 'translateX(-50%)' : align === 'right' ? 'translateX(-100%)' : 'none';
  return S.kit.h('div', { text, style: { position: 'absolute', left: `${x}px`, top: `${(y - size * fonts.M.base).toFixed(2)}px`, transform: tf, whiteSpace: 'nowrap',
    font: sansFont(size, weight), letterSpacing: `${tracking}px`, color: c, ...style } });
}

/** Width of text as the page lays it out (DOM, so letter-spacing and variable weight apply). Deterministic. */
let probe = null;
const cache = new Map();
export function measureText(text, font, trackingPx = 0, variation = '') {
  const key = `${font}|${trackingPx}|${variation}|${text}`;
  if (cache.has(key)) return cache.get(key);
  if (!probe) {
    probe = document.createElement('span');
    Object.assign(probe.style, { position: 'absolute', left: '-100000px', top: '0', whiteSpace: 'pre', visibility: 'hidden', fontKerning: 'normal' });
    document.body.append(probe);
  }
  probe.style.font = font; probe.style.letterSpacing = `${trackingPx}px`; probe.style.fontVariationSettings = variation; probe.textContent = text;
  const w = probe.getBoundingClientRect().width;
  cache.set(key, w);
  return w;
}

/**
 * The ink box of a string relative to its origin on the baseline (px): left and right of the origin, up and down
 * from the baseline. Canvas measure of the same face, size and tracking (canvas cannot set the optical-size axis,
 * so widths can differ from the DOM's by about 1 %).
 */
let ctx2d = null;
const inkCache = new Map();
export function inkExtent(text, font, trackingPx = 0) {
  const key = `${font}|${trackingPx}|${text}`;
  if (inkCache.has(key)) return inkCache.get(key);
  if (!ctx2d) ctx2d = document.createElement('canvas').getContext('2d');
  ctx2d.font = font.replace(/\/1 /, ' ');
  ctx2d.letterSpacing = `${trackingPx}px`;
  const m = ctx2d.measureText(text);
  const r = { left: -m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight, up: m.actualBoundingBoxAscent, down: m.actualBoundingBoxDescent };
  inkCache.set(key, r);
  return r;
}

/** A deterministic choice in [0, 1) from a string (kit.hash is 32-bit). */
export const unit = (S, str) => (S.kit.hash(String(str)) >>> 0) / 4294967296;

/**
 * Round a time up to the start of the frame that first shows it, so an event timed between two frames starts on
 * the later one in preview, render and stills alike.
 */
export const snapper = (S) => { const f = S.env.fps; const fps = Array.isArray(f) ? f[0] / f[1] : f || 29.97; return (t) => Math.ceil(t * fps - 1e-3) / fps; };
