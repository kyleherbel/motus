// The presenter (research/presenter.md). Two framings of one camera frame, cut against each other:
//   panel : a rounded footage panel at the bottom (top corners only, runs off the frame; no stroke,
//           shadow or glow) showing the room, with the person cut out and drawn over it unclipped, so
//           the head rises above the panel top and arms may pass its sides [P05-P11]
//   full  : the 9:16 footage fills the frame at the base framing; a push-in may follow [P13, P15-P19]
// The panel is cut from the wide view of the source (the whole camera frame) when the project has
// one; a 9:16-only source gives a closer crop and a warning.
import { W, H, layout, presenter as P } from './tokens.js';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const eyeDistOf = (f, fallback) => f?.eyeDist || (f?.faceW ? f.faceW * 0.42 : fallback);

/** Scale and offset of the panel footage (frame px). */
export function panelFraming(doc, hasWide) {
  const pn = layout.panel;
  const wide = hasWide && doc.wide;
  const src = wide ? { w: doc.wide.width, h: doc.wide.height, f: doc.wide.framing } : { w: W, h: H, f: doc.framing };
  const f = src.f || { eyeX: src.w / 2, eyeY: src.h * 0.35 };
  const ideal = P.panel.eyeDist / eyeDistOf(f, src.w * (wide ? 0.045 : 0.15));
  const cover = Math.max(pn.w / src.w, (H - pn.y) / src.h);
  const s = Math.max(cover, ideal);
  const tx = clamp(P.panel.eyeX - f.eyeX * s, pn.x + pn.w - src.w * s, pn.x);
  // the eye line where the reference keeps it, unless the head would then rise more than the reference's;
  // then lower it (within the measured eye-line range)
  let eyeLine = pn.y + P.panel.eyeLineBelowTop;
  if (f.headTopY != null) {
    const headAbove = pn.y - (eyeLine - (f.eyeY - f.headTopY) * s);
    if (headAbove > P.panel.headAbove) eyeLine = Math.min(pn.y + P.panel.eyeLineRange[1], eyeLine + headAbove - P.panel.headAbove);
  }
  const ty = clamp(eyeLine - f.eyeY * s, H - src.h * s, pn.y);
  return { wide: !!wide, s, tx, ty, enlarged: s / ideal };
}

/** Scale and offset of the full-height footage (frame px), before any push-in. */
export function fullFraming(doc) {
  const f = doc.framing || { eyeX: W / 2, eyeY: H * 0.34 };
  const want = P.full.eyeDist / eyeDistOf(f, 150);
  const s = clamp(want, 1, P.full.maxScale);
  const tx = clamp(P.full.eyeX - f.eyeX * s, W - W * s, 0);
  const ty = clamp(P.full.eyeY - f.eyeY * s, H - H * s, 0);
  return { s, tx, ty, short: want > P.full.maxScale };
}

export function buildPresenter(S) {
  const { kit, env, doc } = S; const { h } = kit;
  const pn = layout.panel;
  const hasWide = !!env.footage.hasWide;
  const pf = panelFraming(doc, hasWide);
  const ff = fullFraming(doc);
  if (!pf.wide && doc.width) S.warn('no wide view of the source: the panel shows a closer crop than the style. Start the project from the horizontal recording to fix it.');
  if (ff.short) S.warn('the speaker is small in the 9:16 footage: the full-height shot is enlarged to the limit and still frames them smaller than the style.');

  const view = (opt) => { const c = env.footage.view(opt); Object.assign(c.style, { position: 'absolute', left: '0', top: '0', transformOrigin: '0 0' }); return c; };
  const T = (x, y, s) => `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${s.toFixed(5)})`;

  // ---- panel: footage clipped to the rounded rectangle
  const pv = view({ wide: pf.wide });
  pv.style.transform = T(pf.tx - pn.x, pf.ty - pn.y, pf.s);
  const panel = h('div.nc-panel', { style: { position: 'absolute', left: `${pn.x}px`, top: `${pn.y}px`, width: `${pn.w}px`, height: `${H - pn.y + 4}px`, overflow: 'hidden', borderRadius: `${pn.r}px ${pn.r}px 0 0`, background: '#000', display: 'none' } }, pv);
  // ---- the person, cut out and drawn over the panel and the graphics, never clipped
  const cv = view({ wide: pf.wide, matte: true, lo: P.matteEdge[0], hi: P.matteEdge[1] });
  cv.style.transform = T(pf.tx, pf.ty, pf.s);
  const cutout = h('div.nc-cutout', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, overflow: 'hidden', pointerEvents: 'none', display: 'none' } }, cv);

  // ---- full height
  const fv = view({});
  const full = h('div.nc-full', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, overflow: 'hidden', background: '#000', display: 'none' } }, fv);

  let shown = null, lastZoom = null;
  return {
    panel, cutout, full, framing: { panel: pf, full: ff },
    /** mode: 'dark' | 'light' (panel) | 'full'. zoom: push-in factor about the measured fixed point (1 = base). */
    seek(t, mode, zoom = 1) {
      const want = mode === 'full' ? 'full' : 'panel';
      if (want !== shown) {
        panel.style.display = cutout.style.display = want === 'panel' ? '' : 'none';
        full.style.display = want === 'full' ? '' : 'none';
        shown = want; lastZoom = null;
      }
      if (want === 'full' && zoom !== lastZoom) {
        const [ox, oy] = P.push.origin;
        fv.style.transform = T(ox * (1 - zoom) + zoom * ff.tx, oy * (1 - zoom) + zoom * ff.ty, zoom * ff.s);
        lastZoom = zoom;
      }
    },
  };
}
