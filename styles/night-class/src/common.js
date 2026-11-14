// Helpers shared by the elements.
import { CX, layout, colour, motion, fonts } from './tokens.js';

/** Every graphic element takes `enter`: how it arrives when it replaces another graphic in the same panel run. */
export const ENTER = { enter: 'enum?:push|zoom|own|cut', hold: 'enum?:drift|still' };

/** Camera beats every graphic takes: push the view into a point of it (x, y as 0-1 of its box), and back out. */
export const CAMERA_BEATS = { focus: { x: 'number', y: 'number', scale: 'number?' }, unfocus: {} };

/** Ink for text on the field: white on the dark field and footage, near-black on the light field [C17, C18]. */
export const ink = (mode) => (mode === 'light' ? colour.ink.light : colour.ink.dark);

/** A box of w x h centred on the graphic area's centre line (x 540, y ~750) [L12]; cx moves it sideways (side slot). */
export function centred(w, h, cy = layout.graphic.cy, cx = CX) {
  const top = Math.max(layout.graphic.top - 150, Math.min(layout.caption.baseline - 60 - layout.graphic.minGapToCaption - h, cy - h / 2));
  return { x: Math.round(cx - w / 2), y: Math.round(top), w, h };
}

/**
 * Spotlights: a solid cobalt disc with a white ring and a cobalt glow that grows in over a detail of a capture or
 * phone to point at it (seen in the newest reels; colours: research/colour.md [C28]). beats: [{ t, do: 'spot', x, y, r }]
 * with x, y as 0-1 of the box.
 */
export function spotlights(S, beats, box, parent) {
  const { h } = S.kit;
  const spots = beats.filter((b) => b.do === 'spot').map((b) => {
    const r = b.r || 110;
    const el = h('div', { style: { position: 'absolute', left: `${(b.x ?? 0.5) * box.w - r}px`, top: `${(b.y ?? 0.5) * box.h - r}px`, width: `${r * 2}px`, height: `${r * 2}px`, borderRadius: '50%',
      background: 'radial-gradient(circle at 50% 42%, rgba(35,93,255,0.92) 0%, rgba(22,76,225,0.9) 70%, rgba(19,64,188,0.92) 100%)', boxShadow: 'inset 0 0 0 6px #FFFFFF, 0 0 40px rgba(33,92,255,0.8), 0 0 8px rgba(255,255,255,0.5)', display: 'none', transformOrigin: '50% 50%' } });
    parent.append(el);
    return { el, t: b.t, hold: b.hold };
  });
  return {
    ticks: spots.map((s) => s.t),
    seek(t) {
      // it grows in fast from a point, holds a moment, then fades out while still growing [seen in the newest reels]
      for (const s of spots) {
        const a = t - s.t;
        const on = a >= 0 && a < 1.15;
        setStyle(s.el, 'display', on ? '' : 'none');
        if (!on) continue;
        const grow = S.E.slide(S.kit.clamp(a / 0.3));
        const fade = S.kit.clamp((a - 0.75) / 0.4);
        setStyle(s.el, 'transform', `scale(${(0.15 + 0.85 * grow + 0.1 * fade).toFixed(4)})`);
        setStyle(s.el, 'opacity', String(1 - fade));
      }
    },
  };
}

/**
 * When an element's own entrance starts and whether it plays at all. A graphic pushed in as a strip,
 * one returning after a cut-in, or one entering by a plain cut is already built at tIn.
 */
export function entrance(ctx) {
  const settled = ctx.enter === 'push' || ctx.enter === 'cut' || ctx.returning;
  return { t0: ctx.tIn, settled };
}

/** 0..1 progress of an animation of `dur` starting at t0, through easing E (settled -> 1). */
export const prog = (S, t, t0, dur, E, settled = false) => (settled ? 1 : (E || ((x) => x))(S.kit.clamp((t - t0) / dur)));

/** Scale-in entrance [M14]: from 0.58 of size, opacity rising with the scale. Returns { s, o }. */
export function scaleIn(S, t, t0, settled) {
  const p = prog(S, t, t0, motion.scale.dur, S.E.scale, settled);
  return { s: motion.scale.from + (1 - motion.scale.from) * p, o: motion.scale.fade + (1 - motion.scale.fade) * p };
}

/** Rise entrance [M11, M26]: slides up into place on the slide curve, fading in over the first third. */
export function riseIn(S, t, t0, settled, dist = motion.slide.dist) {
  const p = prog(S, t, t0, motion.slide.dur, S.E.slide, settled);
  return { dy: dist * (1 - p), o: settled ? 1 : S.kit.clamp((t - t0) / (motion.slide.dur * 0.3)) };
}

/** A text node set in the sans or the serif with its baseline at y (frame px). */
export function textAt(S, { text, x = CX, y, size, serif = false, weight = 800, colour: c, align = 'center', tracking = -0.01, style = {} }) {
  const m = serif ? fonts.serifM : fonts.sansM;
  const tf = align === 'center' ? 'translateX(-50%)' : align === 'right' ? 'translateX(-100%)' : 'none';
  return S.kit.h('div', { text, style: { position: 'absolute', left: `${x}px`, top: `${y - size * m.base}px`, transform: tf, whiteSpace: 'nowrap',
    font: `${serif ? 'italic 400' : weight} ${size}px/1 ${serif ? fonts.serif : fonts.sans}`, letterSpacing: `${tracking}em`, color: c, ...style } });
}

export const setStyle = (el, key, v) => { if (el['_' + key] !== v) { el.style[key] = v; el['_' + key] = v; } };
