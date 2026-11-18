// Helpers shared by the composition and the elements.
export const setStyle = (el, key, v) => { if (el['_' + key] !== v) { el.style[key] = v; el['_' + key] = v; } };
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const px = (v) => `${(+v).toFixed(2)}px`;

/** Value at time t of a tween from t0 over dur seconds, a -> b, through an easing function. Clamped. */
export const tw = (t, t0, dur, a, b, fn) => a + (b - a) * (t <= t0 ? 0 : t >= t0 + dur ? 1 : fn((t - t0) / dur));

export const full = (x) => ({ position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', ...x });

const hex = (c) => { const s = c.replace('#', ''); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); };
export const rgba = (c, a) => `rgba(${hex(c).join(',')},${a})`;

/** A cubic-bezier easing from four control values, through the engine kit (pure). */
export const bez = (kit, b) => kit.cubicBezier(b[0], b[1], b[2], b[3]);

/** Scale and offset that put a picture of size (w, h) with a face (eyeX, eyeY, faceW, in its own px) into a box
 * (bw x bh) so that the face is faceW wide with its eyes at (ex, ey) in box px, never uncovering the box. */
export function fitFace(w, h, f, bw, bh, want) {
  const cover = Math.max(bw / w, bh / h);
  const s = Math.min(Math.max(f && f.faceW ? want.faceW / f.faceW : cover, cover), Math.max(cover, want.maxScale || 1.5));
  const ex = f ? f.eyeX : w / 2, ey = f ? f.eyeY : h * 0.37;
  const tx = Math.min(0, Math.max(bw - w * s, want.eyeX - ex * s));
  const ty = Math.min(0, Math.max(bh - h * s, want.eyeY - ey * s));
  return { s, tx, ty };
}
