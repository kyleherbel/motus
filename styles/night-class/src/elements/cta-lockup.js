// The call to action in the title slot (research/hook.md H18-H20, type.md T23): line 1 'Comment'
// in the sans and the keyword in the italic serif inside curly quotes, line 2 the reward on the cobalt
// bar ('To Get The Doc'). It starts 2 frames after the spoken 'Comment' (usually with a cut to the
// field), line 2 a quarter second later, and it holds to the last frame [H19, H20].
import { F, type, motion } from '../tokens.js';
import { buildLockup } from '../lockup.js';

export default {
  type: 'cta-lockup',
  label: 'Comment call to action',
  slots: ['title'],
  params: {
    keyword: { type: 'string', maxChars: 16, maxWords: 1 },          // one word, as spoken (Title Case on screen)
    reward: { type: 'string', maxChars: 26, maxWords: 6 },           // "To Get The Doc", "To Get The Link"
    at: 'word?',                                                      // the spoken "Comment"; default the scene start
    deco: 'enum?:bar|underline|none',
  },
  beats: {},

  build(ctx) {
    const { S, params: p, mode, tIn } = ctx;
    const kw = p.keyword.trim().replace(/^["“]|["”]$/g, '');
    const word = kw.charAt(0).toUpperCase() + kw.slice(1);
    const startAt = Math.max(tIn, (p.at !== undefined ? S.wordTime(p.at) : tIn) + F(2));
    const lk = buildLockup(S, {
      lines: [`Comment *“${word}”*`, p.reward],
      size: type.cta.size, capTop: type.cta.capTop,
      deco: p.deco || 'bar', decoLine: 1,
      bar: type.cta.bar,
      build: 'word', start: startAt,
    }, mode);
    return { el: lk.el, startAt, ticks: [], seek(t) { lk.seek(t, false); } };
  },
};
