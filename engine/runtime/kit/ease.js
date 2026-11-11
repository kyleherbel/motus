// Easing and interpolation. Everything here is a pure function of its inputs:
// a style's seek(t) must give the same pixels for the same t, every time.

export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, p) => a + (b - a) * p;
export const invLerp = (a, b, x) => (b === a ? (x >= b ? 1 : 0) : (x - a) / (b - a));
export const remap = (x, a, b, c, d) => lerp(c, d, clamp(invLerp(a, b, x)));

/** cubic-bezier(x1,y1,x2,y2) as a function p -> eased p, same definition as CSS. */
export function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t;
  const Y = (t) => ((ay * t + by) * t + cy) * t;
  const dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (p) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let t = p;
    for (let i = 0; i < 8; i++) {            // Newton
      const x = X(t) - p;
      if (Math.abs(x) < 1e-6) return Y(t);
      const d = dX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= x / d;
    }
    let lo = 0, hi = 1;                       // bisection fallback
    t = p;
    for (let i = 0; i < 32; i++) {
      const x = X(t);
      if (Math.abs(x - p) < 1e-6) break;
      if (x < p) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return Y(t);
  };
}

/**
 * Damped spring from 0 to 1 as a function of normalised time p in [0,1].
 * `settle` is the time (in units of the tween's duration) by which it is visually at rest;
 * `zeta` < 1 overshoots (0.5 = lively, 0.8 = one small overshoot), >= 1 never does.
 */
export function spring(zeta = 0.8, cycles = 1.5) {
  const w0 = (2 * Math.PI * cycles) / Math.sqrt(Math.max(1e-6, 1 - Math.min(zeta, 0.999) ** 2));
  return (p) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    if (zeta >= 1) return 1 - (1 + w0 * p) * Math.exp(-w0 * p);
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const env = Math.exp(-zeta * w0 * p);
    const v = 1 - env * (Math.cos(wd * p) + ((zeta * w0) / wd) * Math.sin(wd * p));
    // blend the tail to exactly 1 so the end state is clean
    const tail = clamp((p - 0.85) / 0.15);
    return v + (1 - v) * tail * tail;
  };
}

const pow = (n) => (p) => p ** n;
const outPow = (n) => (p) => 1 - (1 - p) ** n;
const inOutPow = (n) => (p) => (p < 0.5 ? 2 ** (n - 1) * p ** n : 1 - (-2 * p + 2) ** n / 2);

export const ease = {
  linear: (p) => p,
  inQuad: pow(2), outQuad: outPow(2), inOutQuad: inOutPow(2),
  inCubic: pow(3), outCubic: outPow(3), inOutCubic: inOutPow(3),
  inQuart: pow(4), outQuart: outPow(4), inOutQuart: inOutPow(4),
  inQuint: pow(5), outQuint: outPow(5), inOutQuint: inOutPow(5),
  inExpo: (p) => (p <= 0 ? 0 : 2 ** (10 * p - 10)),
  outExpo: (p) => (p >= 1 ? 1 : 1 - 2 ** (-10 * p)),
  inOutExpo: (p) => (p <= 0 ? 0 : p >= 1 ? 1 : p < 0.5 ? 2 ** (20 * p - 10) / 2 : (2 - 2 ** (-20 * p + 10)) / 2),
  outCirc: (p) => Math.sqrt(1 - (p - 1) ** 2),
  inOutSine: (p) => -(Math.cos(Math.PI * p) - 1) / 2,
  outBack: (s = 1.70158) => (p) => 1 + (s + 1) * (p - 1) ** 3 + s * (p - 1) ** 2,
  bezier: cubicBezier,
  spring,
};

/**
 * Value at time t of a tween that runs from t0 for `dur` seconds, going `from` -> `to`.
 * Clamped on both sides: before t0 it is `from`, after t0 + dur it is `to`.
 */
export function tween(t, t0, dur, from, to, fn = ease.outCubic) {
  if (dur <= 0) return t >= t0 ? to : from;
  const p = clamp((t - t0) / dur);
  return from + (to - from) * fn(p);
}

/** Progress 0..1 of [t0, t0 + dur], eased, clamped. */
export const prog = (t, t0, dur, fn = ease.linear) => (dur <= 0 ? (t >= t0 ? 1 : 0) : fn(clamp((t - t0) / dur)));

/** Seconds for n frames at 30 fps: style timings are measured in reference frames. */
export const F = (n) => n / 30;

/** Deterministic pseudo-random generator (mulberry32). seeded(7)() -> [0,1). */
export function seeded(seed = 1) {
  let a = (seed >>> 0) || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = a;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable 32-bit hash of a string, for per-item deterministic variation. */
export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
