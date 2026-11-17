// The presenter (research/presenter.md). The same footage in three framings; changes between them are hard cuts.
//   desk    the speaker cut out, popping up out of their own footage rectangle (x 100-992 from y 1334 down, in a
//           selection frame): the rectangle shows the room, the cut-out covers it and rises above its top edge,
//           head top at y 1110 [P01, L02]. After a layout without the speaker the rectangle is drawn on again:
//           it starts as a 214 px box at the bottom left and the cursor drags its top-right corner out [M01].
//   behind  the cut-out alone over a screen that fills the top of the frame [P02, L05]
//   face    the raw footage punched in about 1.3x on the face, no furniture [P03]
// Without a matte the cut-out is empty: desk still shows the speaker inside the rectangle (the head does not
// rise above it), and behind falls back to the rectangle.
import { W, H, layout, presenter as P, motion } from './tokens.js';
import { setStyle, tw, full } from './common.js';
import { selFrame, cursor } from './parts.js';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Scale and offset of the footage for the desk: head top at 1110, face centred, never leaving the rectangle uncovered. */
export function deskFraming(doc) {
  const B = layout.sourceBox, R = P.desk;
  const f = doc.framing || { eyeX: W / 2, eyeY: H * 0.37, headTopY: H * 0.19, faceW: R.faceW };
  const cover = Math.max(B.w / W, (H - B.y) / H);
  const s = clamp(f.faceW ? R.faceW / f.faceW : 1, Math.max(cover, 0.7), 1.25);
  const headTop = f.headTopY ?? f.eyeY - 0.18 * H;
  const tx = clamp(R.eyeX - f.eyeX * s, B.x + B.w - W * s, B.x);
  const ty = clamp(R.headTopY - headTop * s, H - H * s, B.y);
  return { s, tx, ty };
}

export function faceFraming(doc) {
  const R = P.face;
  const f = doc.framing || { eyeX: W / 2, eyeY: H * 0.37 };
  const s = R.punch;
  return { s, tx: clamp(R.eyeX - f.eyeX * s, W - W * s, 0), ty: clamp(R.eyeY - f.eyeY * s, H - H * s, 0) };
}

export function buildPresenter(S) {
  const { kit, env, doc } = S; const { h } = kit;
  const B = layout.sourceBox, B0 = layout.sourceBoxStart;
  const df = deskFraming(doc), ff = faceFraming(doc);
  const hasMatte = !!doc.hasMatte;
  const fit = (cv, fr, dx = 0, dy = 0) => Object.assign(cv.style, { position: 'absolute', left: '0', top: '0', transformOrigin: '0 0',
    transform: `translate(${(fr.tx + dx).toFixed(2)}px, ${(fr.ty + dy).toFixed(2)}px) scale(${fr.s.toFixed(5)})` });

  // the footage rectangle: a selection frame whose body shows the room
  const frame = selFrame(S);
  const room = env.footage.view();
  frame.body.append(room);
  const cut = env.footage.view({ matte: true });
  fit(cut, df);
  const cutWrap = h('div.oc-cutout', { style: full({ display: 'none' }) }, cut);
  const cur = cursor(S);
  const desk = h('div.oc-desk', { style: full({ display: 'none' }) }, frame.el);

  const faceCv = env.footage.view();
  fit(faceCv, ff);
  const face = h('div.oc-face', { style: full({ overflow: 'hidden', display: 'none' }) }, faceCv,
    h('div', { style: full({ background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,.45) 100%)' }) }));

  const el = h('div.oc-presenter', { style: full({}) }, face, desk, cutWrap, cur.el);
  return {
    el, framing: { desk: df, face: ff }, hasMatte,
    /** mode: 'desk' | 'behind' | 'face' | 'none'. a: seconds since the shot began. redraw: draw the rectangle on. */
    seek(mode, a = 0, redraw = false) {
      const box = mode === 'desk' || (mode === 'behind' && !hasMatte);
      setStyle(face, 'display', mode === 'face' ? '' : 'none');
      setStyle(desk, 'display', box ? '' : 'none');
      setStyle(cutWrap, 'display', (mode === 'desk' || mode === 'behind') && hasMatte ? '' : 'none');
      const drawing = box && redraw && a < motion.cursorLinger;
      setStyle(cur.el, 'display', drawing ? '' : 'none');
      if (!box) { setStyle(cutWrap, 'clipPath', ''); return; }
      const p = redraw ? tw(a, motion.boxDraw.hold, motion.boxDraw.dur, 0, 1, S.E.drag) : 1;
      const w = B0.w + (B.w - B0.w) * p;
      const top = B0.top + (B.y - B0.top) * p;
      frame.place(B.x, top, w, B.y + B.h - top, p > 0.6);
      fit(room, df, -B.x, -top);
      // while the rectangle is drawn on, the cut-out is revealed with it: nothing of the speaker shows beyond its right edge
      setStyle(cutWrap, 'clipPath', p < 0.999 ? `inset(${((top - B.y) * 1.6).toFixed(1)}px ${(W - B.x - w).toFixed(1)}px 0 0)` : '');
      if (drawing) cur.at(B.x + w - 4, top - 6);
    },
  };
}
