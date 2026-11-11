// The presenter: in the light split he sits in a stroked panel at the bottom with his
// head rising above its top edge (that part is the matte cut-out); in presenter-full
// he fills the frame. The switch between the two is always a hard cut.
import { W, H, layout, presenter as P } from './tokens.js';
import { glintRing } from './card.js';

/**
 * Scale and offset that put a face of the source footage where the reference keeps it.
 * framing: { eyeX, eyeY, faceW, headTopY } in footage pixels (medians over the clip), or null.
 */
export function framingFor(framing, mode) {
  const f = framing || { eyeX: W / 2, eyeY: H * 0.36, faceW: 380, headTopY: H * 0.17 };
  if (mode === 'full') {
    const s = Math.min(P.maxScale, Math.max(1, P.full.faceW / f.faceW));
    const tx = Math.min(0, Math.max(W - W * s, P.full.eyeX - f.eyeX * s));
    const ty = Math.min(0, Math.max(H - H * s, P.full.eyeY - f.eyeY * s));
    return { s, tx, ty };
  }
  const pn = layout.light.panel;
  const inL = pn.x + pn.stroke, inR = pn.x + pn.w - pn.stroke;
  const cover = (inR - inL) / W;                              // the footage must span the panel
  const ideal = P.split.faceW / f.faceW;
  let s = Math.max(cover, ideal);
  const place = (sc) => Math.min(inL, Math.max(inR - W * sc, P.split.eyeX - f.eyeX * sc));
  // A tight, off-centre source cannot be centred at cover scale: enlarge a little until the face
  // sits inside the sway envelope measured on the reference (530 +- 55 px), up to +25 %.
  for (let k = 0; k < 25 && Math.abs(place(s) + f.eyeX * s - P.split.eyeX) > 55 && s < Math.max(cover, ideal) * 1.25; k++) s *= 1.01;
  const tx = place(s);
  const headTop = f.headTopY ?? f.eyeY - f.faceW * 0.95;
  let ty = P.split.hairTop - headTop * s;                     // the hair line decides the rise above the panel
  ty = Math.max(H - H * s, Math.min(pn.y, ty));
  return { s, tx, ty };
}

export function buildPresenter(S) {
  const { kit, C, env, doc } = S; const { h } = kit;
  const pn = layout.light.panel;
  const split = framingFor(doc.framing, 'split');
  const full = framingFor(doc.framing, 'full');

  const view = (opt) => { const c = env.footage.view(opt); Object.assign(c.style, { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, transformOrigin: '0 0' }); return c; };
  const panelView = view(); const fullView = view();

  // --- split
  const inner = { x: pn.x + pn.stroke, y: pn.y + pn.stroke, w: pn.w - 2 * pn.stroke, h: H - pn.y - pn.stroke + 40 };
  panelView.style.transform = `translate(${split.tx - inner.x}px, ${split.ty - inner.y}px) scale(${split.s})`;
  const panelInner = h('div', { style: { position: 'absolute', left: `${inner.x}px`, top: `${inner.y}px`, width: `${inner.w}px`, height: `${inner.h}px`, overflow: 'hidden', borderRadius: `${pn.innerRadius}px ${pn.innerRadius}px 0 0`, background: '#000' } }, panelView);
  // the ring: lit from the top-left, shaded on the right (three measured tones), then a travelling glint
  const panelFrame = h('div', { style: { position: 'absolute', left: `${pn.x}px`, top: `${pn.y}px`, width: `${pn.w}px`, height: `${H - pn.y + 60}px`, borderRadius: `${pn.outerRadius}px ${pn.outerRadius}px 0 0`, background: `linear-gradient(97deg, ${C.panel[0]} 0%, ${C.panel[0]} 38%, ${C.panel[2]} 100%)` } },
    h('div', { style: { position: 'absolute', left: `${pn.stroke / 2}px`, top: `${pn.stroke * 0.66}px`, right: '0', bottom: '0', borderRadius: `${pn.outerRadius - 8}px ${pn.outerRadius - 8}px 0 0`, background: `linear-gradient(97deg, ${C.panel[1]} 0%, ${C.panel[1]} 45%, ${C.panel[2]} 100%)` } }));
  const ring = glintRing(S, { w: pn.w, h: (H - pn.y) * 2 + 200, radius: pn.outerRadius, inset: pn.stroke / 2, thickness: 14, colour: C.glintHot });
  Object.assign(ring.el.style, { left: `${pn.x}px`, top: `${pn.y}px` });
  // the head above the panel: person only, clipped at the panel's inner top edge so it meets the footage inside
  // the cut-out: person only, shown above the panel's inner top edge (+12 px so it meets the footage inside)
  // and outside the panel's sides, where shoulders may spill; everything else is the footage itself
  const cutLayer = (clip) => {
    const v = view({ matte: true, lo: P.matteEdge[0], hi: P.matteEdge[1] });
    v.style.transform = `translate(${split.tx}px, ${split.ty}px) scale(${split.s})`;
    return h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, clipPath: clip, filter: 'blur(0.6px)' } }, v);
  };
  const cutTop = cutLayer(`inset(0 0 ${H - (inner.y + 12)}px 0)`);
  const cutSides = cutLayer(`polygon(0 ${inner.y + 12}px, ${inner.x}px ${inner.y + 12}px, ${inner.x}px ${H}px, 0 ${H}px, 0 ${inner.y + 12}px, ${inner.x + inner.w}px ${inner.y + 12}px, ${W}px ${inner.y + 12}px, ${W}px ${H}px, ${inner.x + inner.w}px ${H}px, ${inner.x + inner.w}px ${inner.y + 12}px)`);
  const splitEl = h('div.ep-presenter-split', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px` } }, panelFrame, ring.el, panelInner, cutSides, cutTop);

  // --- full
  fullView.style.transform = `translate(${full.tx}px, ${full.ty}px) scale(${full.s})`;
  const fullEl = h('div.ep-presenter-full', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, overflow: 'hidden', background: '#000' } }, fullView);

  const el = h('div.ep-presenter', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px` } }, fullEl, splitEl);
  let shown = null;
  return {
    el, split, full,
    /** mode: 'light-split' | 'presenter-full' | anything else hides the presenter */
    seek(t, mode) {
      const want = mode === 'light-split' ? 'split' : mode === 'presenter-full' ? 'full' : 'none';
      if (want !== shown) {
        splitEl.style.display = want === 'split' ? '' : 'none';
        fullEl.style.display = want === 'full' ? '' : 'none';
        shown = want;
      }
      if (want === 'split') ring.seek(t);
    },
  };
}
