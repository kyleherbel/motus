// The name under an interstitial card: one bold line whose cap top sits 62 px below
// the card, arriving 18 frames after the cut.
import { CX, layout, type, fonts, motion, halving } from '../tokens.js';

export default {
  type: 'name-label',
  label: 'Name',
  slots: ['name'],
  params: {
    text: { type: 'string', maxChars: 18, maxWords: 3 },
    at: 'word?',                       // the word on which the name appears (default: 18 frames after the cut)
  },
  beats: {},

  build(ctx) {
    const { S, params, tIn, cardRect } = ctx; const { kit, C } = S; const { h } = kit;
    const font = (s) => `${type.name.weight} ${s}px ${fonts.sans}`;
    const size = kit.fitSize(params.text, layout.card.w, font, type.name.size, 60, type.name.tracking);
    const cap = size * type.capRatio.sans;
    const baseline = cardRect ? cardRect.y + cardRect.h + 62 + cap : layout.white.nameBaseline;
    const el = h('div.ep-name', { text: params.text, style: { position: 'absolute', left: `${CX}px`, top: `${baseline - size * type.ascent.sans}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap', font: `${type.name.weight} ${size}px/1 ${fonts.sans}`, letterSpacing: `${type.name.tracking}em`, color: C.ink } });
    const at = params.at !== undefined ? S.wordTime(params.at) : tIn + motion.heading.nameAt;
    const Mt = motion.title;
    return {
      el,
      seek(t) {
        const decay = halving(t, at, Mt.half);
        el.style.visibility = t >= at ? 'visible' : 'hidden';
        el.style.opacity = String(kit.prog(t, at, Mt.fade1, kit.ease.outCubic));
        el.style.filter = Mt.blur1 * decay > 0.25 ? `blur(${(Mt.blur1 * decay).toFixed(2)}px)` : 'none';
        el.style.transform = `translateX(-50%) translateY(${(Mt.rise1 * decay).toFixed(2)}px)`;
      },
    };
  },
};
