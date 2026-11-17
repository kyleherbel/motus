// The closing keyword (research/type.md T19-T24; hook.md H16-H24; layout.md L18; verification "Closing keyword").
// One word, upper case, in a bold serif, wrapped as “WORD" (curly opening quote, straight closing quote), white
// with a large soft black shadow, centred on x 540 with its baseline at 1448.5. It cuts in complete on the frame
// its word is spoken (+1 frame) and holds unchanged to the last frame; captions keep running above it.
// Cap height clamp(158 - 6 * letters, 109, 140): longer words are set smaller [T21; V].
import { CX, F, layout, type, fonts, colour } from '../tokens.js';

export default {
  type: 'comment-keyword',
  label: 'Comment keyword',
  slots: ['keyword'],
  layouts: ['speaker'],
  params: {
    word: 'word',                                                   // the spoken keyword, the word after "comment" [H23]
    text: { type: 'string', optional: true, maxChars: 12, maxWords: 1 },   // only to correct the transcript's spelling
  },
  beats: {},
  build(ctx) {
    const { S, params } = ctx;
    const K = type.keyword, KS = K.shadow;
    const raw = (params.text || (S.doc.words[params.word]?.w ?? '')).replace(/[^\p{L}\p{N}'’-]/gu, '');
    const word = raw.toUpperCase();
    const letters = word.length;
    const cap = Math.min(K.capMax, Math.max(K.capMin, K.capA - K.capB * letters));
    const size = cap / fonts.serifM.cap;
    const text = `${K.open}${word}${K.close}`;
    const top = layout.keyword.baseline - size * fonts.serifM.base;
    const style = (extra) => ({ position: 'absolute', left: `${CX}px`, top: `${top.toFixed(2)}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
      font: `700 ${size.toFixed(2)}px/1 ${fonts.serif}`, ...extra });
    const shadow = S.kit.h('div', { text, style: style({ color: `rgba(0,0,0,${KS.alpha})`, WebkitTextStroke: `${2 * KS.spread}px rgba(0,0,0,${KS.alpha})`,
      filter: `blur(${KS.sigma}px)`, transform: `translateX(-50%) translate(${KS.dx}px, ${KS.dy}px)` }) });
    const line = S.kit.h('div', { text, style: style({ color: colour.white }) });
    const el = S.kit.h('div.pr-keyword', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', display: 'none' } }, shadow, line);
    const tOn = S.wordTime(params.word) + F(1);   // +1 frame after the spoken onset (median) [H19, S15; V]
    if (letters > 8) S.warn(`comment-keyword "${word}" has ${letters} letters; the reference keywords are short nouns of 3-6 letters [H23]`);
    let shown = null;
    return {
      el, ownEntrance: true,
      seek(t) { const on = t >= tOn; if (on !== shown) { el.style.display = on ? '' : 'none'; shown = on; } },
    };
  },
};
