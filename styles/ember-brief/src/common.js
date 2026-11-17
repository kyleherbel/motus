// Helpers shared by the composition and the elements.
import { CX, layout, motion, fonts, colour } from './tokens.js';

/** GSAP's expo.inOut: flat at both ends, nearly all of the change in the middle fifth. The reference's tweens use it [verified]. */
export const expoInOut = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2);

export const setStyle = (el, key, v) => { if (el['_' + key] !== v) { el.style[key] = v; el['_' + key] = v; } };
const lin = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/**
 * The entrance every graphic uses [M03, M04; verified]: one tween of 10 frames on expo.inOut carries the rise and
 * the scale, the opacity is up within the first 3 frames, and a Gaussian blur pulses to its peak and clears.
 * a = seconds since it started. k: { from, scaleFrom, blur } overrides for a kind of thing (motion.enter.presets).
 * Returns { o, blur, dy, s }.
 */
export function enterAt(S, a, k = {}) {
  const E = motion.enter;
  const from = k.from ?? E.from, s0 = k.scaleFrom ?? E.scaleFrom;
  if (a >= E.blur.span) return { o: 1, blur: 0, dy: 0, s: 1 };
  if (a <= 0) return { o: 0, blur: 0, dy: from, s: s0 };
  const p = expoInOut(a / E.dur);
  return { o: lin(a / E.fade), blur: (k.blur ?? E.blur.peak) * Math.sin(Math.PI * (a / E.blur.span)), dy: from * (1 - p), s: s0 + (1 - s0) * p };
}

/**
 * The exit [M05; verified]: the blur rises first and holds, then it fades while it accelerates upward by 64 px,
 * at full size. a = seconds since the exit started. Returns { o, blur, dy, s }.
 */
export function exitAt(S, a) {
  const X = motion.exit;
  if (a <= 0) return { o: 1, blur: 0, dy: 0, s: 1 };
  const f = lin((a - X.fade.t0) / X.fade.dur), u = lin(a / X.dur);
  return { o: 1 - f * f, blur: X.blur.peak * lin(a / X.blur.rise), dy: X.rise.to * u * u * u, s: 1 };
}

/** Apply { o, blur, dy, s } to a wrapper. Nothing is written when nothing changed. */
export function applyState(el, st, origin) {
  setStyle(el, 'opacity', st.o >= 0.999 ? '' : st.o.toFixed(3));
  setStyle(el, 'filter', st.blur > 0.05 ? `blur(${st.blur.toFixed(2)}px)` : '');
  const moved = Math.abs(st.dy) > 0.05 || Math.abs(st.s - 1) > 0.0002;
  setStyle(el, 'transform', moved ? `translateY(${st.dy.toFixed(2)}px) scale(${st.s.toFixed(4)})` : '');
  if (origin && el._origin !== origin) { el.style.transformOrigin = origin; el._origin = origin; }
}

/**
 * Where a w x h graphic sits: centred on the axis and centred vertically in its slot, which is shorter under
 * a section heading [L11, L12, L20]. A graphic taller than the slot is scaled down to fit and a warning is
 * recorded: in the reference a graphic taller than 880 px always goes to the full layout [L13].
 */
export function place(ctx, w, h) {
  const sl = layout.slot[ctx.mode] || layout.slot.split;
  const top = ctx.headed ? sl.headed.top : sl.top;
  const room = sl.bottom - top;
  let s = 1;
  if (h > room) { s = room / h; ctx.S.warn(`${ctx.params.type}: ${Math.round(h)} px is taller than the ${ctx.mode} slot (${room} px); it was scaled to ${Math.round(s * 100)} %. Use the full layout or less content.`); }
  if (w * s > layout.column.w + 40) s = (layout.column.w + 40) / w;
  const cy = ctx.headed ? sl.headed.cy : sl.cy;
  const hh = h * s, ww = w * s;
  const y = Math.max(top, Math.min(sl.bottom - hh, cy - hh / 2));
  return { x: CX - ww / 2, y, w: ww, h: hh, s };
}

/** A text node in the house sans with its baseline at y and its cap height `cap` (frame px). */
export function textAt(S, { text, x = CX, y, cap, weight = fonts.weight.heavy, colour: c = colour.cream, align = 'center', tracking = 0, upper = false, style = {} }) {
  const size = cap / fonts.capAt(weight);
  const tf = align === 'center' ? 'translateX(-50%)' : align === 'right' ? 'translateX(-100%)' : 'none';
  return S.kit.h('div', { text: upper ? String(text).toUpperCase() : text, style: { position: 'absolute', left: `${x}px`, top: `${y - size * fonts.M.base}px`, transform: tf, whiteSpace: 'nowrap',
    font: `${weight} ${size.toFixed(2)}px/1 ${fonts.sans}`, letterSpacing: `${tracking}em`, color: c, ...style } });
}

/** Font size (px) that gives a cap height at a weight (the cap height per em changes with the weight). */
export const sizeForCap = (cap, weight = fonts.weight.heavy) => cap / fonts.capAt(weight);

/**
 * Width of text as the page lays it out. Measured in the DOM so letter-spacing and the variable weight apply.
 * Deterministic for given fonts.
 */
let probe = null;
const cache = new Map();
export function measureText(text, font, trackingEm = 0) {
  const key = `${font}|${trackingEm}|${text}`;
  if (cache.has(key)) return cache.get(key);
  if (!probe) {
    probe = document.createElement('span');
    Object.assign(probe.style, { position: 'absolute', left: '-100000px', top: '0', whiteSpace: 'pre', visibility: 'hidden', fontKerning: 'normal' });
    document.body.append(probe);
  }
  probe.style.font = font; probe.style.letterSpacing = `${trackingEm}em`; probe.textContent = text;
  const w = probe.getBoundingClientRect().width;
  cache.set(key, w);
  return w;
}

/** The CSS font string for a cap height and weight. */
export const fontFor = (cap, weight) => `${weight} ${sizeForCap(cap, weight).toFixed(2)}px ${fonts.sans}`;

/** Largest cap height (not above `cap`) at which `text` is no wider than maxW. */
export function fitCap(text, cap, weight, maxW, tracking = 0, min = 20) {
  const w = measureText(text, fontFor(cap, weight), tracking);
  return w <= maxW ? cap : Math.max(min, cap * (maxW / w));
}

/** A spoken figure split for counting: "$154,778+" -> { pre: '$', num: 154778, post: '+', dec: 0, commas: true } [X16, X17]. */
export function parseFigure(s) {
  const m = /^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/.exec(String(s).trim());
  if (!m) return null;
  const digits = m[2];
  return { pre: m[1], num: Number(digits.replace(/,/g, '')), post: m[3], dec: (digits.split('.')[1] || '').length, commas: digits.includes(',') };
}
/** The figure at value v, written the way the spoken figure is written (same decimals, same thousands commas). */
export const formatFigure = (f, v) => {
  let s = v.toFixed(f.dec);
  if (f.commas) { const [a, b] = s.split('.'); s = a.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (b ? `.${b}` : ''); }
  return `${f.pre}${s}${f.post}`;
};
