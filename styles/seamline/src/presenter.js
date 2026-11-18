// The presenter (research/presenter.md). One locked camera, two framings of the same take, hard cuts between them.
//   split   the lower panel, y 960 to 1920, full width, no radius, stroke or shadow [P03, P04]. Framed from the
//           wide view (the whole camera frame at 960 px high) so the face is about 172 px wide with the eyes at
//           y 1213, x 519 [P05, P06]. It never moves inside a shot [P02, M18]. A face larger than that (a closer
//           camera) stays larger: the panel is never left uncovered. Without a wide view (a 9:16 source) the
//           9:16 footage is used and the face is larger still.
//   face    the full frame, the face about 343 px wide with the eyes at y 527, x 487 [P07-P10]. Every face shot
//           pushes in from 1.00 to 1.067 over the whole shot, ease-in-out about (501, 960) [P11, M16].
// The grade (research/colour.md C15-C19) is applied to these layers only; inserted footage stays as found [C14].
import { W, H, layout, presenter as P, grade } from './tokens.js';
import { setStyle, full, fitFace, bez } from './common.js';

let gradeN = 0;
function gradeFilter(h, look) {
  const g = grade[look];
  if (!g) return { svg: null, css: '' };
  const NS = 'http://www.w3.org/2000/svg';
  const id = `sl-grade-${++gradeN}`;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
  const filter = document.createElementNS(NS, 'filter');
  filter.setAttribute('id', id); filter.setAttribute('color-interpolation-filters', 'sRGB');
  const ct = document.createElementNS(NS, 'feComponentTransfer');
  for (const [ch, k] of [['feFuncR', 'r'], ['feFuncG', 'g'], ['feFuncB', 'b']]) {
    const f = document.createElementNS(NS, ch);
    f.setAttribute('type', 'table'); f.setAttribute('tableValues', g[k].join(' '));
    ct.append(f);
  }
  const sat = document.createElementNS(NS, 'feColorMatrix');
  sat.setAttribute('type', 'saturate'); sat.setAttribute('values', String(g.saturate));
  filter.append(sat, ct); svg.append(filter);
  return { svg, css: `url(#${id})` };
}

export function buildPresenter(S) {
  const { kit, env, doc } = S; const { h } = kit;
  const seam = layout.seam, ph = H - seam;
  const gf = gradeFilter(h, doc.look?.grade || 'graded');

  // split: the wide view when there is one, else the 9:16 footage
  const wide = env.footage.hasWide && doc.wide;
  const splitCv = wide ? env.footage.view({ wide: true }) : env.footage.view();
  const sw = wide ? doc.wide.width : W, sh = wide ? doc.wide.height : H;
  const sf = wide ? doc.wide.framing : doc.framing;
  const want = { faceW: P.split.faceW, eyeX: P.split.eyeX, eyeY: P.split.eyeY - seam, maxScale: P.split.maxScale };
  const fs = fitFace(sw, sh, sf, W, ph, want);
  if (!wide) S.warn('no wide view: the split panel is framed from the 9:16 footage, so the face is larger than the reference [P05]. Start the project from the horizontal recording.');
  Object.assign(splitCv.style, { position: 'absolute', left: '0', top: '0', transformOrigin: '0 0', width: `${sw}px`, height: `${sh}px`,
    transform: `translate(${fs.tx.toFixed(2)}px, ${fs.ty.toFixed(2)}px) scale(${fs.s.toFixed(5)})` });
  const split = h('div.sl-split-presenter', { style: { position: 'absolute', left: '0', top: `${seam}px`, width: `${W}px`, height: `${ph}px`, overflow: 'hidden', display: 'none', background: '#000', filter: gf.css } }, splitCv);

  // face: the 9:16 footage, full frame
  const faceCv = env.footage.view();
  const ff = fitFace(W, H, doc.framing, W, H, { faceW: P.face.faceW, eyeX: P.face.eyeX, eyeY: P.face.eyeY, maxScale: P.face.maxScale });
  Object.assign(faceCv.style, { position: 'absolute', left: '0', top: '0', transformOrigin: '0 0', width: `${W}px`, height: `${H}px`,
    transform: `translate(${ff.tx.toFixed(2)}px, ${ff.ty.toFixed(2)}px) scale(${ff.s.toFixed(5)})` });
  const push = h('div', { style: full({ transformOrigin: `${P.push.origin[0]}px ${P.push.origin[1]}px` }) }, faceCv);
  const face = h('div.sl-face-presenter', { style: full({ overflow: 'hidden', display: 'none', background: '#000', filter: gf.css }) }, push);
  const ease = bez(kit, P.push.ease);

  const el = h('div.sl-presenter', { style: full({ pointerEvents: 'none' }) }, face, split);
  if (gf.svg) el.append(gf.svg);
  return {
    el, framing: { split: fs, face: ff, wide: !!wide },
    /** mode: 'split' | 'face' | 'none'. p: progress through the shot, 0..1 (drives the face push-in). */
    seek(mode, p = 0) {
      setStyle(split, 'display', mode === 'split' ? '' : 'none');
      setStyle(face, 'display', mode === 'face' ? '' : 'none');
      if (mode === 'face') {
        const z = 1 + (P.push.to - 1) * ease(Math.min(1, Math.max(0, p)));
        setStyle(push, 'transform', z > 1.00001 ? `scale(${z.toFixed(5)})` : '');
      }
    },
  };
}
