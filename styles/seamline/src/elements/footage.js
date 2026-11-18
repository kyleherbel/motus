// Real footage in a panel (research/graphics.md G01-G06, G17, G21; motion.md M01, M16, M19; explain.md).
//
// The style's main picture: the maker's launch film or demo, the speaker's own screen recording, a captured page
// or post, a photo of a named person, a sample the product made. It is never redrawn [G01-G03]. It fills its panel
// edge to edge (cover), with no card, radius, stroke or shadow [G04, C13]; the seam is a hard edge [L04].
//   fx, fy      the point of the picture that stays in view when the cover crop cuts it (0..1, default the centre)
//   zoom        extra magnification on top of cover, to crop to the part of an interface that matters; with
//               fit "contain", below 1 it leaves margin round a logo or a card
//   fit         "contain" shows the whole picture on black instead (a card or portrait on a plain ground) [L08]
//   start       a clip starts this many seconds in. A clip plays at its own speed with its own motion; the style
//               adds none [M19]. Its sound is never used [A21]
//   cut beat    a hard cut to the next shot in the same panel, on the word that names or shows it [G06, S15]
//   push        most stills hold dead still (69 % in full frame, 60 % in the top half). The rest push in: "ease"
//               goes 1.00 to 1.066 across the shot, in-out (the face's own preset); "drift" creeps 1.5 % a second
//               [G21, X24, verified]. Clips keep their own motion and are not pushed by default.
import { motion } from '../tokens.js';
import { setStyle } from '../common.js';
import { loadMedia, mediaView } from '../media.js';

const SHOT = {
  start: { type: 'number', optional: true, min: 0 },
  fx: { type: 'number', optional: true, min: 0, max: 1 },
  fy: { type: 'number', optional: true, min: 0, max: 1 },
  zoom: { type: 'number', optional: true, min: 0.25, max: 4 },
  fit: 'enum:cover|contain?',
  push: 'enum:none|ease|drift?',
};

/** Scale and offset of a w x h picture in a bw x bh box: cover (or contain) times zoom, with (fx, fy) kept in view. */
function frameShot(w, h, bw, bh, o) {
  const contain = o.fit === 'contain';
  const base = contain ? Math.min(bw / w, bh / h) : Math.max(bw / w, bh / h);
  const s = base * (contain ? (o.zoom || 1) : Math.max(1, o.zoom || 1));   // below 1 only shrinks a contained picture (a logo)
  const dw = w * s, dh = h * s;
  const fx = o.fx ?? 0.5, fy = o.fy ?? 0.5;
  const tx = dw <= bw ? (bw - dw) / 2 : Math.min(0, Math.max(bw - dw, bw / 2 - fx * dw));
  const ty = dh <= bh ? (bh - dh) / 2 : Math.min(0, Math.max(bh - dh, bh / 2 - fy * dh));
  return { s, tx, ty };
}

export default {
  type: 'footage',
  label: 'Real footage',
  slots: ['top', 'picture', 'bottom'],
  params: { src: 'asset', ...SHOT },
  beats: { cut: { src: 'asset', ...SHOT } },
  async prepare(params, S, rawBeats = []) {
    const srcs = [...new Set([params.src, ...rawBeats.filter((b) => b.do === 'cut').map((b) => b.src)])];
    const media = {};
    await Promise.all(srcs.map(async (src) => { media[src] = await loadMedia(S, src); }));
    return { media };
  },
  build(ctx) {
    const { S, params, beats, tIn, tOut, box, data } = ctx;
    const { h } = S.kit;
    const bw = box.w, bh = box.h;
    const el = h('div.sl-footage', { style: { position: 'absolute', left: '0', top: '0', width: `${bw}px`, height: `${bh}px`, overflow: 'hidden', background: '#000' } });
    const inOut = S.kit.cubicBezier(0.42, 0, 0.58, 1);

    const segs = [];
    const add = (t, o) => {
      const m = data.media[o.src];
      const mv = mediaView(S, m, m.w, m.h, { fit: 'cover', t0: t, start: o.start || 0 });
      const fr = frameShot(m.w, m.h, bw, bh, o);
      const layer = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${m.w}px`, height: `${m.h}px`, transformOrigin: '0 0' } }, mv.el);
      const wrap = h('div', { style: { position: 'absolute', inset: '0', display: 'none', transformOrigin: `${bw / 2}px ${bh / 2}px` } }, layer);
      setStyle(layer, 'transform', `translate(${fr.tx.toFixed(2)}px, ${fr.ty.toFixed(2)}px) scale(${fr.s.toFixed(5)})`);
      el.append(wrap);
      segs.push({ t, m, mv, wrap, push: o.push || 'none', on: null });
    };
    add(tIn, params);
    for (const b of beats) if (b.do === 'cut' && b.t > tIn) add(b.t, b);
    segs.forEach((s, k) => { s.end = k + 1 < segs.length ? segs[k + 1].t : tOut; });

    return {
      el,
      seek(t, visible = true) {
        let cur = segs[0];
        for (const s of segs) if (t >= s.t) cur = s;
        for (const s of segs) {
          const on = visible && s === cur;
          if (s.on !== on) { setStyle(s.wrap, 'display', on ? '' : 'none'); s.on = on; }
          s.mv.seek(t, on);
          if (!on || s.push === 'none') continue;
          const a = Math.max(0, t - s.t), span = Math.max(1e-3, s.end - s.t);
          const P = motion.stillPush;
          const z = s.push === 'ease' ? 1 + (P.ease - 1) * inOut(Math.min(1, a / span)) : Math.min(P.driftMax, 1 + P.driftPerS * a);
          setStyle(s.wrap, 'transform', z > 1.00001 ? `scale(${z.toFixed(5)})` : '');
        }
      },
      settled: () => Promise.all(segs.filter((s) => s.on).map((s) => s.mv.settled())),
    };
  },
};
