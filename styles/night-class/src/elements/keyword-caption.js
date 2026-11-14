// The closing keyword over the full-height presenter (research/hook.md H21): a large italic serif
// keyword in curly quotes with a small 'Comment' above it, cut in as the keyword is said and held to
// the last frame while normal captions continue below. Seen in 6 of 31 calls to action
// (2026-10-24 to 11-05); the panel lockup (cta-lockup) is the default.
import { CX, colour, fonts, layout } from '../tokens.js';
import { textAt } from '../common.js';
import { measureText } from '../text.js';

// TOKENS (research/hook.md H21: keyword box about 137 px tall, 2x a one-word caption)
const G = { size: 140, base: 1190, comment: { size: 40, gap: 26 } };

export default {
  type: 'keyword-caption',
  label: 'Closing keyword',
  slots: ['keyword'],
  params: {
    keyword: { type: 'string', maxChars: 14, maxWords: 1 },
    at: 'word?',                    // the spoken keyword; default the scene start
  },
  beats: {},

  build(ctx) {
    const { S, params: p, tIn } = ctx; const { h } = S.kit;
    const kw = p.keyword.trim().replace(/^["“]|["”]$/g, '');
    const word = kw.charAt(0).toUpperCase() + kw.slice(1);
    let size = G.size;
    while (size > 80 && measureText(`“${word}”`, `italic 400 ${size}px ${fonts.serif}`, 0) > layout.caption.maxW + 100) size -= 2;
    const at = Math.max(tIn, p.at !== undefined ? S.wordTime(p.at) : tIn);
    const el = h('div.nc-keyword', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0', display: 'none' } },
      textAt(S, { text: 'Comment', y: G.base - size * fonts.serifM.cap - G.comment.gap, size: G.comment.size, colour: colour.ink.dark }),
      textAt(S, { text: `“${word}”`, y: G.base, size, serif: true, colour: colour.ink.dark, tracking: -0.01 }));
    let shown = null;
    return { el, ticks: [], seek(t) { const on = t >= at; if (on !== shown) { el.style.display = on ? '' : 'none'; shown = on; } } };
  },
};
