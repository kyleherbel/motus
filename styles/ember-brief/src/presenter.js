// The presenter (research/presenter.md): plain footage in the bottom half of the frame, 0,960 to 1080,1920.
// No radius, stroke or shadow; the person is never cut out and never shown full height [P01-P04, P29].
// The top 80 px fade in over the field with a linear alpha ramp [P03, L04, C10]. The footage keeps one scale
// and position for the whole video: no punch-in, no push, no re-centring after a jump cut [P11, P19].
// For a full-height graphic the whole panel slides straight down out of the frame through a blur, and it
// returns the same way to the same place [P16, P17, L21].
//
// The panel is 9:8, wider than a 9:16 crop of the speaker can fill at the reference face size, so it is cut
// from the wide view of the source (the whole camera frame) when the project has one.
import { W, H, layout, presenter as P, motion } from './tokens.js';
import { setStyle } from './common.js';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
/**
 * How much to scale a speaker so the face is the reference's size. The reference gives its own speaker in several
 * measures (eye distance 123.4 px, Vision face box 316.5 px wide, eye line to chin 244 px) [P06, P07, P09, P26].
 * On another face they do not agree with each other, so the fit takes the geometric mean of the ones the
 * project has: no single landmark sets the size (research/presenter.md, fitting note).
 */
export function idealScale(f, fallbackEye) {
  const r = [];
  if (f?.eyeDist) r.push(P.eyeDist / f.eyeDist);
  if (f?.faceW) r.push(P.faceBoxW / f.faceW);
  if (f?.chinY != null && f?.eyeY != null && f.chinY > f.eyeY) r.push(P.eyeToChin / (f.chinY - f.eyeY));
  if (!r.length) return P.eyeDist / fallbackEye;
  return Math.exp(r.reduce((n, x) => n + Math.log(x), 0) / r.length);
}

/** Scale and offset of the footage inside the frame (frame px), and how far it was enlarged. */
export function panelFraming(doc, hasWide) {
  const pn = layout.panel;
  const wide = hasWide && doc.wide;
  const src = wide ? { w: doc.wide.width, h: doc.wide.height, f: doc.wide.framing } : { w: W, h: H, f: doc.framing };
  const f = src.f || { eyeX: src.w / 2, eyeY: src.h * 0.35 };
  const ideal = idealScale(f, src.w * (wide ? 0.045 : 0.14));
  const cover = Math.max(pn.w / src.w, pn.h / src.h);
  const s = Math.max(cover, ideal);
  const tx = clamp(P.eyeX - f.eyeX * s, pn.x + pn.w - src.w * s, pn.x);
  // the eye line where the reference keeps it, unless the head would then rise above the caption plate:
  // a speaker with tall hair gets the eye line lowered, not the caption moved [P09, P28]
  let eyeY = P.eyeY;
  if (f.headTopY != null) {
    const headTop = eyeY - (f.eyeY - f.headTopY) * s;
    if (headTop < P.headTop[0]) eyeY += P.headTop[0] - headTop;
  }
  const ty = clamp(eyeY - f.eyeY * s, pn.y + pn.h - src.h * s, pn.y);
  return { wide: !!wide, s, tx, ty, short: s > ideal * 1.02 };
}

export function buildPresenter(S) {
  const { kit, env, doc } = S; const { h } = kit;
  const pn = layout.panel;
  const hasWide = !!env.footage.hasWide;
  const pf = panelFraming(doc, hasWide);
  if (!pf.wide && pf.short) S.warn('no wide view of the source: the panel shows the speaker larger than the style (face over 280 px). Start the project from the horizontal recording to fix it.');

  const cv = env.footage.view({ wide: pf.wide });
  Object.assign(cv.style, { position: 'absolute', left: '0', top: '0', transformOrigin: '0 0',
    transform: `translate(${(pf.tx - pn.x).toFixed(2)}px, ${(pf.ty - pn.y).toFixed(2)}px) scale(${pf.s.toFixed(5)})` });
  const fadeH = layout.fade.to - layout.fade.from;
  const mask = `linear-gradient(to bottom, rgba(0,0,0,0) 0px, #000 ${fadeH}px)`;
  // the travel blur sits inside the fade: the footage blurs, the seam's ramp does not [verified]
  const soft = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${pn.w}px`, height: `${pn.h}px` } }, cv);
  const inner = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${pn.w}px`, height: `${pn.h}px`, overflow: 'hidden', WebkitMaskImage: mask, maskImage: mask } }, soft);
  const el = h('div.eb-presenter', { style: { position: 'absolute', left: `${pn.x}px`, top: `${pn.y}px`, width: `${pn.w}px`, height: `${pn.h}px` } }, inner);

  return {
    el, framing: pf,
    /** p: 0 = in place (split), 1 = off the bottom (full). u: 0..1 through the layout change in linear time (1 = at rest). */
    seek(p, u = 1) {
      const off = p >= 0.9995;
      setStyle(el, 'display', off ? 'none' : '');
      if (off) return;
      setStyle(el, 'transform', p > 0.0005 ? `translateY(${(p * pn.h).toFixed(2)}px)` : '');
      // blurred only while it travels: a half sine over the move, zero at both ends [P16, P17; verified]
      const b = u < 1 ? motion.reflow.panelBlur * Math.sin(Math.PI * u) : 0;
      setStyle(soft, 'filter', b > 0.3 ? `blur(${b.toFixed(2)}px)` : '');
    },
  };
}
