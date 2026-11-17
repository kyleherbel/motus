// Helpers shared by the composition and the elements.
export const setStyle = (el, key, v) => { if (el['_' + key] !== v) { el.style[key] = v; el['_' + key] = v; } };
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const px = (v) => `${(+v).toFixed(2)}px`;

/** Value at time t of a tween from t0 over dur seconds, a -> b, through an easing function. Clamped. */
export const tw = (t, t0, dur, a, b, fn) => a + (b - a) * (t <= t0 ? 0 : t >= t0 + dur ? 1 : fn((t - t0) / dur));

export const full = (x) => ({ position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', ...x });

const hex = (c) => { const s = c.replace('#', ''); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); };
export const rgba = (c, a) => `rgba(${hex(c).join(',')},${a})`;
