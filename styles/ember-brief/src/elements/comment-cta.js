// The call to action (research/hook.md H22-H27, type.md T24, T25, layout.md L16, motion.md M15):
// the word "Comment" in the light weight and, under it, the keyword in upper case inside curly double
// quotes in the heavy weight. It starts on the first content word of the spoken call-to-action clause,
// "Comment" first, rising through a blur, and the keyword 0.21 s later, swinging in from the right with a
// 6 degree tilt. It holds to the last frame of the video: no fade-out, no end card.
// An optional small picture (the thing being offered) can sit under the keyword [H25; low].
import { CX, layout, motion, fonts, type, colour } from '../tokens.js';
import { textAt, fitCap, expoInOut, setStyle } from '../common.js';
import { loadMedia } from '../media.js';

// TOKENS (research/hook.md H25, by eye: seen in 2 of 11 reels)
const G = { picture: { top: 600, h: 220, maxW: 520, radius: 28 } };

export default {
  type: 'comment-cta',
  label: 'Comment call to action',
  slots: ['graphic'],
  layouts: ['split'],
  ownEntrance: true,
  params: {
    keyword: { type: 'string', maxChars: 10, maxWords: 1 },   // one word of 3 to 9 letters, as spoken
    at: 'word?',                                               // the first content word of the clause; default the scene start
    image: 'asset?',                                           // a small picture under the keyword
  },
  beats: {},

  async prepare(params, S) {
    return { image: params.image ? await loadMedia(S, params.image) : null };
  },

  build(ctx) {
    const { S, params: p, tIn, data } = ctx; const { h } = S.kit;
    const C = layout.cta;
    const t0 = Math.max(tIn, p.at !== undefined ? S.wordTime(p.at) : tIn);
    const word = `“${String(p.keyword).trim().replace(/^["“”']+|["“”']+$/g, '').toUpperCase()}”`;
    const labelCap = C.labelSize * fonts.capAt(fonts.weight.light), fullCap = C.keywordSize * fonts.capAt(fonts.weight.heavy);
    const cap = fitCap(word, fullCap, fonts.weight.heavy, C.keywordMaxW, type.cta.keywordTracking);
    const el = h('div.eb-cta', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
    const part = (node, cy) => { const w = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0', transformOrigin: `${CX}px ${cy}px` } }, node); el.append(w); return w; };
    const label = part(textAt(S, { text: 'Comment', y: C.labelBaseline, cap: labelCap, weight: fonts.weight.light, tracking: type.cta.labelTracking }), C.labelBaseline - labelCap / 2);
    // the keyword keeps its vertical centre when it is shrunk to fit [T25]
    const keyBase = C.keywordBaseline - fullCap / 2 + cap / 2;
    const key = part(textAt(S, { text: word, y: keyBase, cap, weight: fonts.weight.heavy, tracking: type.cta.keywordTracking }), keyBase - cap / 2);
    let pic = null;
    if (data.image && data.image.kind === 'image') {
      const s = Math.min(G.picture.h / data.image.h, G.picture.maxW / data.image.w);
      const w = data.image.w * s, hh = data.image.h * s;
      pic = part(h('img', { src: data.image.url, style: { position: 'absolute', left: `${CX - w / 2}px`, top: `${G.picture.top}px`, width: `${w}px`, height: `${hh}px`, borderRadius: `${G.picture.radius}px`, display: 'block' } }), G.picture.top + hh / 2);
    }
    const M = motion.cta;
    const tween = (node, a, kind) => {
      const u = Math.min(1, Math.max(0, a / M.dur)), p = expoInOut(u);
      setStyle(node, 'opacity', a <= 0 ? '0' : p >= M.fadeBy ? '1' : (p / M.fadeBy).toFixed(3));
      const peak = kind === 'label' ? M.labelBlur : M.keywordBlur;
      const b = peak * Math.sin(Math.PI * u);
      setStyle(node, 'filter', b > 0.05 ? `blur(${b.toFixed(2)}px)` : '');
      setStyle(node, 'transform', p >= 0.9999 ? '' : kind === 'label'
        ? `translateY(${(M.labelRise * (1 - p)).toFixed(2)}px) scale(${(M.labelScale + (1 - M.labelScale) * p).toFixed(4)})`
        : `translateX(${(M.keywordDx * (1 - p)).toFixed(2)}px) rotate(${(M.keywordTilt * (1 - p)).toFixed(3)}deg)`);
    };
    return {
      el, startAt: t0, box: { x: 78, y: C.labelBaseline - labelCap, w: 924, h: C.keywordBaseline - (C.labelBaseline - labelCap) },
      seek(t) {
        tween(label, t - t0, 'label');
        tween(key, t - t0 - M.keywordLag, 'keyword');
        if (pic) tween(pic, t - t0 - M.keywordLag, 'label');
      },
    };
  },
};
