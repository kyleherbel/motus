// The closing ask (research/hook.md H05-H07; motion.md M10; structure.md S08). On the bare face: a brush-script
// "comment" appears on the spoken verb, and the keyword lands under it in an accent box that draws left to right
// over 8 frames on the frame the keyword is spoken. Captions stop when the script word appears.
import { fonts, type, layout, motion } from '../tokens.js';
import { setStyle, tw, full } from '../common.js';

export default {
  type: 'comment-cta',
  label: 'Comment keyword',
  slots: ['cta'],
  params: {
    word: 'word',                                                   // the spoken keyword
    text: { type: 'string', optional: true, maxChars: 12, maxWords: 1 },   // only to correct the transcript's spelling
    verb: 'word?',                                                  // the spoken "comment"; found in the scene when omitted
  },
  beats: {},
  build(ctx) {
    const { S, params, scene } = ctx;
    const { h } = S.kit;
    const T = S.theme, C = type.cta;
    const words = S.doc.words;
    let verb = params.verb;
    if (verb == null) {
      for (let i = params.word - 1; i >= (scene.words?.[0] ?? 0); i--) if (/^comment/i.test(words[i]?.w || '')) { verb = i; break; }
    }
    const tWord = S.wordTime(params.word);
    const tVerb = verb != null ? S.wordTime(verb) : Math.max(scene.start, tWord - 0.5);
    const keyword = (params.text || words[params.word]?.w || '').replace(/[^\p{L}\p{N}'’-]/gu, '').toUpperCase();
    if (keyword.length > 9) S.warn(`comment-cta "${keyword}" has ${keyword.length} letters; the keyword is one short word [H06]`);

    const script = h('span', { text: 'comment', style: { fontFamily: fonts.script, fontSize: `${C.script}px`, color: '#fff', transform: 'rotate(-4deg)', textShadow: '0 5px 22px rgba(0,0,0,.6)', lineHeight: '1' } });
    const plate = h('div', { text: `“${keyword}”`, style: { background: T.accent, borderLeft: '4px solid #fff', borderRight: '4px solid #fff', padding: '0 26px 8px', fontFamily: fonts.sans, fontWeight: '800',
      fontSize: `${C.word}px`, letterSpacing: '-2px', color: T.accentInk, lineHeight: '1.12', whiteSpace: 'nowrap' } });
    const dot = (pos) => h('div', { style: { position: 'absolute', width: '22px', height: '22px', borderRadius: '50%', background: T.accent, border: '3px solid #fff', boxSizing: 'border-box', ...pos } });
    const d1 = dot({ left: '-11px', bottom: '-22px' }), d2 = dot({ right: '-11px', top: '-22px' });
    const boxed = h('div', { style: { position: 'relative', marginTop: '14px' } }, plate, d1, d2);
    const col = h('div', { style: { position: 'absolute', left: '0', width: '1080px', top: `${layout.cta.y}px`, display: 'flex', flexDirection: 'column', alignItems: 'center' } }, script, boxed);
    const el = h('div.oc-cta', { style: full({ display: 'none' }) }, col);
    return {
      el, captionsUntil: tVerb,
      seek(t) {
        setStyle(el, 'display', t >= tVerb ? '' : 'none');
        if (t < tVerb) return;
        setStyle(script, 'opacity', tw(t, tVerb, motion.word, 0.35, 1, S.E.out).toFixed(3));
        const p = tw(t, tWord, motion.cta.box, 0, 1, S.E.out);
        setStyle(boxed, 'opacity', t < tWord ? '0' : '1');
        setStyle(plate, 'clipPath', `inset(0 ${(100 - 100 * p).toFixed(2)}% 0 0)`);
        setStyle(d2, 'opacity', p > 0.98 ? '1' : '0');
      },
    };
  },
};
