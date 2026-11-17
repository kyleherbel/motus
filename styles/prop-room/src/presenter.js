// The presenter (research/presenter.md). Two fixed crops of the same footage per video, nothing else [P01, P04, P09]:
//   split  plain footage in the box x 0-1080, y 960-1920: a hard edge at the seam, no radius, stroke, shadow or
//          matte; the eye line at y 1275, the face centred on x 529, interocular 136.5 px, the head top about
//          48 px under the seam [P02-P08; V]
//   solo   the speaker full height, the same footage about 1.917x larger: eye line 689, face centre 542,
//          interocular 259.2 px. Used mid-video and, identically, for the close [P09-P12; V]
// Changes between them are hard cuts; neither crop ever moves, zooms or shakes [P17, M24].
//
// The split box is 9:8, wider than a 9:16 source can fill at the reference face size, so it is cut from the wide
// view of the source when the project has one (style.head.json footage.wide). The solo crop comes from the
// conformed 9:16 view.
import { layout, presenter as P } from './tokens.js';
import { setStyle } from './common.js';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * The scale that gives a face the reference size. The measures disagree on another face, so the fit is the
 * geometric mean of the ones the project has (eye distance, face width, eye line to chin) [P26].
 */
function idealScale(f, ref, fallback) {
  const r = [];
  if (f?.eyeDist) r.push(ref.eyeDist / f.eyeDist);
  if (f?.faceW) r.push(ref.faceBoxW / f.faceW);
  if (f?.chinY != null && f?.eyeY != null && f.chinY > f.eyeY && ref.eyeToChin) r.push(ref.eyeToChin / (f.chinY - f.eyeY));
  if (!r.length) return fallback;
  return Math.exp(r.reduce((n, x) => n + Math.log(x), 0) / r.length);
}

export function splitFraming(doc, hasWide) {
  const B = layout.box, R = P.split;
  const wide = hasWide && doc.wide;
  const src = wide ? { w: doc.wide.width, h: doc.wide.height, f: doc.wide.framing } : { w: 1080, h: 1920, f: doc.framing };
  const f = src.f || { eyeX: src.w / 2, eyeY: src.h * 0.4 };
  const ideal = idealScale(f, R, (R.eyeDist / (src.w * (wide ? 0.07 : 0.13))));
  const cover = Math.max(B.w / src.w, B.h / src.h);
  const s = Math.max(cover, ideal);
  // the eye line where the reference keeps it, moved only to keep the head top 26-68 px under the seam [P08]
  let eyeY = R.eyeY;
  if (f.headTopY != null) {
    const headTop = eyeY - (f.eyeY - f.headTopY) * s;
    if (headTop < layout.seam + R.headTop[0]) eyeY += layout.seam + R.headTop[0] - headTop;
    else if (headTop > layout.seam + R.headTop[1]) eyeY -= headTop - (layout.seam + R.headTop[1]);
  }
  const tx = clamp(R.eyeX - f.eyeX * s, B.w - src.w * s, 0);
  const ty = clamp(eyeY - B.y - f.eyeY * s, B.h - src.h * s, 0);
  return { wide: !!wide, s, tx, ty, enlarged: s > ideal * 1.02 };
}

export function soloFraming(doc) {
  const R = P.solo;
  const f = doc.framing || { eyeX: 540, eyeY: 760 };
  const ref = { eyeDist: R.eyeDist, faceBoxW: R.faceBoxW, eyeToChin: null };
  const s = Math.max(1, idealScale(f, ref, 1));
  const tx = clamp(R.eyeX - f.eyeX * s, 1080 - 1080 * s, 0);
  const ty = clamp(R.eyeY - f.eyeY * s, 1920 - 1920 * s, 0);
  return { s, tx, ty };
}

export function buildPresenter(S) {
  const { kit, env, doc } = S; const { h } = kit;
  const B = layout.box;
  const hasWide = !!env.footage.hasWide;
  const sf = splitFraming(doc, hasWide);
  if (!sf.wide && sf.enlarged) S.warn('no wide view of the source: the split shows the speaker larger than the style (the face fills more of the box). Start the project from the horizontal recording to fix it.');
  const of = soloFraming(doc);

  const place = (cv, fr) => Object.assign(cv.style, { position: 'absolute', left: '0', top: '0', transformOrigin: '0 0',
    transform: `translate(${fr.tx.toFixed(2)}px, ${fr.ty.toFixed(2)}px) scale(${fr.s.toFixed(5)})` });

  const splitCv = env.footage.view({ wide: sf.wide });
  place(splitCv, sf);
  const split = h('div.pr-split', { style: { position: 'absolute', left: `${B.x}px`, top: `${B.y}px`, width: `${B.w}px`, height: `${B.h}px`, overflow: 'hidden', display: 'none' } }, splitCv);

  const soloCv = env.footage.view({ wide: false });
  place(soloCv, of);
  const solo = h('div.pr-solo', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', overflow: 'hidden', display: 'none' } }, soloCv);

  const el = h('div.pr-presenter', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, solo, split);
  return {
    el, framing: { split: sf, solo: of },
    /** which: 'split' | 'solo' | 'none' */
    seek(which) {
      setStyle(split, 'display', which === 'split' ? '' : 'none');
      setStyle(solo, 'display', which === 'solo' ? '' : 'none');
    },
  };
}
