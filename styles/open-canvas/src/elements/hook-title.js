// The hook title (research/hook.md H01-H04; motion.md M09). Two lines over the first desk window: what the
// video claims. Line 1 arrives word by word, 5 frames apart from frame 3; line 2 sits in a dark box that opens
// from its centre over 6 frames from frame 9, then its text appears. The box wears the selection handles.
import { fonts, type, layout, motion } from '../tokens.js';
import { setStyle, tw, full } from '../common.js';

export default {
  type: 'hook-title',
  label: 'Hook title',
  slots: ['title'],
  params: {
    line1: { type: 'string', maxChars: 18, maxWords: 4 },         // 2-4 words [H03]
    line2: { type: 'string', maxChars: 22, maxWords: 4 },
  },
  beats: {},
  build(ctx) {
    const { S, params, tIn } = ctx;
    const { h } = S.kit;
    const T = type.title, M = motion.title, c = S.theme.sel;
    const sh = '0 4px 18px rgba(0,0,0,.45)';
    const words = params.line1.trim().split(/\s+/).map((w) => h('span', { text: w, style: { opacity: '0' } }));
    const line1 = h('div', { style: { position: 'absolute', left: '0', width: '1080px', top: `${layout.title.line1Y}px`, display: 'flex', justifyContent: 'center', gap: '20px',
      fontFamily: fonts.sans, fontWeight: '800', fontSize: `${T.size1}px`, letterSpacing: `${T.tracking}px`, color: '#fff', textShadow: sh, lineHeight: '1.1' } }, ...words);
    const text = h('span', { text: params.line2 });
    const plate = h('div', { style: { background: `${S.theme.dark}d0`, padding: '2px 20px 8px', fontFamily: fonts.sans, fontWeight: '800', fontSize: `${T.size2}px`, letterSpacing: `${T.tracking}px`, color: '#fff',
      lineHeight: '1.1', whiteSpace: 'nowrap', borderLeft: `4px solid ${c}`, borderRight: `4px solid ${c}` } }, text);
    const dot = (pos) => h('div', { style: { position: 'absolute', width: '22px', height: '22px', borderRadius: '50%', background: c, border: '3px solid #111', boxSizing: 'border-box', ...pos } });
    const boxed = h('div', { style: { position: 'relative' } }, plate, dot({ left: '-11px', bottom: '-24px' }), dot({ right: '-11px', top: '-24px' }));
    const line2 = h('div', { style: { position: 'absolute', left: '0', width: '1080px', top: `${layout.title.line2Y}px`, display: 'flex', justifyContent: 'center' } }, boxed);
    const el = h('div.oc-title', { style: full({}) }, line1, line2);
    return {
      el,
      seek(t) {
        const a = t - tIn;
        words.forEach((w, i) => { const t0 = M.first + i * M.step; setStyle(w, 'opacity', a < t0 ? '0' : tw(a, t0, M.word, 0.4, 1, S.E.out).toFixed(3)); });
        const open = tw(a, M.open[0], M.open[1], 0, 1, S.E.out);
        setStyle(boxed, 'opacity', a < M.open[0] ? '0' : '1');
        setStyle(boxed, 'clipPath', `inset(-30px ${(50 - 50 * open).toFixed(2)}% -30px ${(50 - 50 * open).toFixed(2)}%)`);
        setStyle(text, 'opacity', tw(a, M.text[0], M.text[1], 0, 1, S.E.out).toFixed(3));
      },
    };
  },
};
