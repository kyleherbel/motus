// Motion devices for designed explanation cards, measured in the second study of the reference
// (research/explain.md, X01-X16). Every function is pure in t: the same t gives the same values.
import { F } from './tokens.js';

// ---- TOKENS (research/explain.md)
export const X = {
  draw: { tau: F(2.0), cap: F(9) },          // X03: outline and connector draw-on, perimeter 40/62/75/85/91/94/97/98/100 % on frames 1-9 (clip15@874-882)
  type: { prompt: 1.6, code: 3.5, sub: 1.2 },// X04: characters per frame (prompts 1.5-1.7, code 3-4, sub-lines ~1.2)
  caret: { period: F(16), on: F(9) },        // X04: block caret blinking before and after typing (by eye)
  row: { fade: F(2.5), rise: 12, settle: F(5), stagger: F(3) },   // X05: rows fade 2-3 f, settle 10-15 px; bulk lists 2-4 f apart
  chip: { fade: F(5), rise: 10, from: 0.9 }, // X07: a label chip pops in ~5 f, rising 10 px from 0.9
  flip: { fade: F(2) },                      // X06: a status swaps in 1 f and fades its new face in over 2 f
  light: { in: F(6), out: F(5), lead: F(2), idle: 0.42 },   // X08: idle items ~40 %, the named one lights over 6 f, the last one releases 2 f earlier
  arrive: { fade: F(2), settle: F(6), dx: 20, dy: -28, rot: 8, scale: 1.25 },   // X09: drops arrive offset and tilted, stamps oversize, settle in 4-6 f, no bounce
  fly: { dur: F(16) },                       // X10: travel to a slot, 90 % by 8 f, settled by 16 f
  dots: { dur: F(8), period: F(9) },         // X11: "thinking" dots before a reply, 6-10 f
  scroll: { dur: F(8), blur: 10 },           // X12: the next phase scrolls the last one up and out in 6-8 f with heavy vertical blur
  packet: { trip: F(10), rest: F(8), r: 7 }, // X13: a glowing dot loops along a connector, ~8-10 f a trip, the whole time
  stagger: F(5),                             // X14: cascades 3-6 f apart (median 5.5 f)
  hop: { dy: 16, dur: F(9) },                // X15: an actor hops 16 px as its finding appears
  count: { dur: F(12) },                     // X16: per-row count-ups, ease-out
};

// the converge travel measured on clip37@264-280 (per-frame dx 14, 60, 72, 50, 36, 24, 18, 16, 11, 10, 7, 5, 3, 2, 2, 1 of 331 px)
const FLY = [0, 0.042, 0.224, 0.441, 0.592, 0.701, 0.773, 0.828, 0.876, 0.909, 0.94, 0.961, 0.976, 0.985, 0.991, 0.997, 1];

const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);

/** Exponential approach landing exactly on 1 at `cap` (seconds after t0). */
export function approach(t, t0, tau, cap) {
  if (t <= t0) return 0;
  return Math.min(1, (1 - Math.exp(-(t - t0) / tau)) / (1 - Math.exp(-cap / tau)));
}

/** Draw-on progress of a stroke (outline, connector, tick): half the length on the first frame. */
export const drawn = (t, t0) => approach(t, t0, X.draw.tau, X.draw.cap);

/** Travel progress 0..1 on the measured converge curve, stretched to `dur`. */
export function flyEase(t, t0, dur = X.fly.dur) {
  if (t <= t0) return 0;
  const u = clamp((t - t0) / dur) * (FLY.length - 1);
  const i = Math.floor(u);
  if (i >= FLY.length - 1) return 1;
  return FLY[i] + (FLY[i + 1] - FLY[i]) * (u - i);
}

/** Speed of the fly curve (fraction per frame) at t, for motion blur. */
export function flySpeed(t, t0, dur = X.fly.dur) {
  const d = F(1);
  return (flyEase(t, t0, dur) - flyEase(t - d, t0, dur));
}

/**
 * Where a travelling token is at t. from/to: {x, y, s}. path: 'straight' | 'arc' | 'elbow'.
 * Returns { x, y, s, blur } with blur in px proportional to speed (blur only when travel is fast).
 */
export function flyAt(t, t0, from, to, { dur = X.fly.dur, path = 'arc', lift = 0.22 } = {}) {
  const p = flyEase(t, t0, dur);
  let x = from.x + (to.x - from.x) * p, y = from.y + (to.y - from.y) * p;
  const dx = to.x - from.x, dy = to.y - from.y;
  if (path === 'arc') {
    // bow sideways off the straight line, most at mid-travel
    const len = Math.hypot(dx, dy) || 1;
    const bow = Math.sin(Math.PI * p) * len * lift;
    x += (-dy / len) * bow; y += (dx / len) * bow;
  } else if (path === 'elbow') {
    const q = clamp(p * 1.6);
    const r = clamp((p - 0.45) / 0.55);
    x = from.x + dx * q; y = from.y + dy * r;
  }
  const s = (from.s ?? 1) + ((to.s ?? 1) - (from.s ?? 1)) * p;
  const pxPerFrame = Math.hypot(dx, dy) * flySpeed(t, t0, dur);
  const blur = pxPerFrame > 40 ? Math.min(6, (pxPerFrame - 40) * 0.05) : 0;
  return { x, y, s, p, blur };
}

/**
 * An arrival with weight: from an offset, tilt or oversize to rest in `settle`, no bounce.
 * kind: 'drop' (offset + tilt), 'stamp' (oversize + slight tilt), 'rise' (row: up 12 px), 'pop' (chip: 0.9 + 10 px).
 * Returns { o, x, y, r, s } to apply as opacity and transform.
 */
export function arrive(t, t0, kind = 'rise') {
  if (t < t0) return { o: 0, x: 0, y: 0, r: 0, s: 1 };
  const age = t - t0;
  if (kind === 'drop' || kind === 'stamp') {
    const o = 0.3 + 0.7 * clamp(age / X.arrive.fade);
    const q = 1 - approach(t, t0, X.arrive.settle / 3, X.arrive.settle);
    if (kind === 'drop') return { o, x: X.arrive.dx * q, y: X.arrive.dy * q, r: X.arrive.rot * q, s: 1 };
    return { o: 0.6 + 0.4 * clamp(age / X.arrive.fade), x: -10 * q, y: -10 * q, r: 4.5 * q, s: 1 + (X.arrive.scale - 1) * q };
  }
  if (kind === 'pop') {
    const p = approach(t, t0, X.chip.fade / 3, X.chip.fade);
    return { o: clamp(age / (X.chip.fade * 0.8)), x: 0, y: X.chip.rise * (1 - p), r: 0, s: X.chip.from + (1 - X.chip.from) * p };
  }
  const p = approach(t, t0, X.row.settle / 3, X.row.settle);
  return { o: clamp(age / X.row.fade), x: 0, y: X.row.rise * (1 - p), r: 0, s: 1 };
}

/** Apply an arrive() result to an element (transform origin is the caller's choice). */
export function applyArrive(el, a, extra = '') {
  el.style.opacity = a.o >= 1 ? '' : a.o.toFixed(3);
  const tf = `${extra}${a.x || a.y ? ` translate(${a.x.toFixed(2)}px, ${a.y.toFixed(2)}px)` : ''}${a.r ? ` rotate(${a.r.toFixed(2)}deg)` : ''}${a.s !== 1 ? ` scale(${a.s.toFixed(4)})` : ''}`.trim();
  el.style.transform = tf || 'none';
}

/** How much of `text` is typed at t, starting at t0 at `rate` characters per frame. */
export function typedAt(text, t, t0, rate = X.type.prompt) {
  if (t <= t0) return '';
  const n = Math.floor(((t - t0) * 30) * rate);
  return text.slice(0, Math.min(text.length, n));
}
/** When typing of `text` from t0 at `rate` is complete. */
export const typedEnd = (text, t0, rate = X.type.prompt) => t0 + (text.length / rate) / 30;

const normWord = (s) => String(s).toLowerCase().replace(/[^a-z0-9$%]/g, '');

/**
 * Word-synced typing (X04, 4 units in part C): each word of `text` lands with the same spoken word.
 * words: the transcript ({w, start}); from: index of the first spoken word to look at; t0: fallback start.
 * Returns the schedule [{ tok, t }]: words not found in the next few spoken words follow at `rate`.
 */
export function syncTokens(text, words, from, t0, rate = X.type.prompt) {
  const toks = String(text).split(/(\s+)/).filter((x) => x.length);
  const out = [];
  let i = Math.max(0, from ?? 0);
  let t = t0;
  for (const tok of toks) {
    if (/^\s+$/.test(tok)) { out.push({ tok, t }); continue; }
    const want = normWord(tok);
    let hit = -1;
    for (let k = i; k < Math.min(words.length, i + 6); k++) if (normWord(words[k].w) === want && want) { hit = k; break; }
    if (hit >= 0) { t = Math.max(t, words[hit].start); i = hit + 1; }
    out.push({ tok, t });
    t += (tok.length / rate) / 30;
  }
  return out;
}
/** The text typed by t from a syncTokens schedule, each word in a burst of `burst` characters a frame. */
export function typedSync(sched, t, burst = 3) {
  let s = '';
  for (const { tok, t: ts } of sched) {
    if (t < ts) break;
    s += tok.slice(0, Math.max(0, Math.floor((t - ts) * 30 * burst) + 1));
  }
  return s;
}
/** When a syncTokens schedule has finished typing. */
export const syncEnd = (sched, burst = 3) => sched.reduce((e, { tok, t }) => Math.max(e, t + (tok.length / burst) / 30), 0);

/** A blinking block caret: visible or not at t (always on while typing). */
export function caretOn(t, typingFrom, typingTo) {
  if (t >= typingFrom && t <= typingTo) return true;
  const ph = ((t * 30) % (X.caret.period * 30)) / 30;
  return ph < X.caret.on;
}

/** Selection light 0..1 for an item lit at tOn and released at tOff (Infinity = stays lit). */
export function lit(t, tOn, tOff = Infinity) {
  const up = tOn === undefined || tOn === null ? 0 : approach(t, tOn, X.light.in / 3, X.light.in);
  const down = Number.isFinite(tOff) ? approach(t, tOff - X.light.lead, X.light.out / 3, X.light.out) : 0;
  return clamp(up * (1 - down));
}

/** Mix two hex colours. */
export function mix(a, b, p) {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * clamp(p))).join(',')})`;
}
function hex(c) { const v = parseInt(String(c).replace('#', '').slice(0, 6), 16); return [v >> 16, (v >> 8) & 255, v & 255]; }

/** A rounded-rect path starting at the top-left corner's end and running clockwise, with its length. */
export function roundRectPath(x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  const d = `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const len = 2 * (w + h) - 8 * r + 2 * Math.PI * r;
  return { d, len };
}

/**
 * A stroke that draws itself on (X03). Give it an SVG path `d` and its length, or a rect.
 * Returns { el (svg), seek(t), t0 }. The svg covers (0,0)-(w,h) of its parent.
 */
export function drawOnPath(S, { d, len, w, h, t0, colour, width = 5, glow = null, opacity = 1 }) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', w); svg.setAttribute('height', h); svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  Object.assign(svg.style, { position: 'absolute', left: '0', top: '0', overflow: 'visible', pointerEvents: 'none' });
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', colour);
  p.setAttribute('stroke-width', width); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
  p.setAttribute('stroke-dasharray', `${len} ${len + 2}`); p.setAttribute('stroke-opacity', opacity);
  if (glow) p.style.filter = `drop-shadow(0 0 6px ${glow})`;
  svg.append(p);
  return {
    el: svg, t0, len,
    seek(t) {
      const k = drawn(t, t0);
      svg.style.display = k > 0 ? '' : 'none';
      p.setAttribute('stroke-dashoffset', String(len * (1 - k)));
    },
  };
}

/** Pulsing "thinking" dots: returns the opacity of dot i (0..2) at t. */
export function dotPulse(t, i) {
  const ph = ((t * 30) / (X.dots.period * 30) - i / 3) % 1;
  return 0.35 + 0.65 * Math.max(0, Math.sin(Math.PI * ((ph + 1) % 1)));
}

/** Position 0..1 of a packet looping along a connector drawn at t0 (X13), or null between trips. */
export function packetAt(t, t0) {
  if (t < t0) return null;
  const cyc = X.packet.trip + X.packet.rest;
  const ph = (t - t0) % cyc;
  if (ph > X.packet.trip) return null;
  const u = ph / X.packet.trip;
  return u * u * (3 - 2 * u);
}
