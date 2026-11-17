// Spoken captions (research/type.md T01-T06; layout.md L09; motion.md M08):
//   one centred line of 1-3 words (4 when the line stays at 15 characters or less); a group ends after
//   . , ! ? ; : and after a pause longer than 0.28 s, and is otherwise filled while it stays at 17 characters [T02]
//   the whole group holds its space from its first word; each word arrives on its own onset, going from a
//   blurred 35 % grey to sharp white in 3 frames, in place [T03, M08]
//   Outfit 800 at 92 px, white, lower case except names; no plate, a soft dark shadow [T01, T05, T06]
//   one word in about twelve is set in a brush script, tilted -4 degrees: emphasis kind "script" [T04]
//   the line is centred on y 1031 in the desk and behind layouts and on y 1405 everywhere else [L09]
import { fonts, type, colour, layout, motion } from './tokens.js';
import { setStyle, tw } from './common.js';

const PUNCT = /[.,!?;:]["'”’)\]]*$/;
const SENTENCE_END = /[.!?]["'”’)\]]*$/;
const strip = (w) => String(w).trim().replace(/[.,!?;:"“”]/g, '');

/**
 * The text each word shows [T05]: punctuation dropped; a capital that only marks the start of a sentence is
 * lowered. A word keeps its capital when it is "I", has a capital after its first letter (iPhone, MCP), or is
 * written with the same capital somewhere in the middle of a sentence (a name). A name spoken only once, at the
 * start of a sentence, is lowered: the plan can give it an inner capital or mark it with captions.fixes.
 */
export function captionTexts(words) {
  const mid = new Set();
  words.forEach((w, k) => { const t = strip(w.w); if (k > 0 && !SENTENCE_END.test(words[k - 1].w) && /^\p{Lu}/u.test(t)) mid.add(t.replace(/['’]s$/, '')); });
  const out = words.map((w, k) => {
    const t = strip(w.w);
    const opens = k === 0 || SENTENCE_END.test(words[k - 1].w);
    if (!opens || !/^\p{Lu}/u.test(t)) return t;
    if (/^I(['’]|$)/.test(t) || /.\p{Lu}/u.test(t) || mid.has(t.replace(/['’]s$/, ''))) return t;
    return t.toLowerCase();
  });
  // the transcript splits hyphenated words ("real", "-life"): a token that starts with a hyphen joins the word before it
  for (let k = 1; k < out.length; k++) {
    if (!out[k].startsWith('-')) continue;
    let j = k - 1;
    while (j > 0 && !out[j]) j--;
    if (out[j]) { out[j] += out[k]; out[k] = ''; }
  }
  return out;
}

/** Group words into caption lines. Returns [{ i0, i1, show, hide }] (word positions in doc.words, seconds). */
export function captionGroups(doc, texts, until = Infinity) {
  const G = type.group;
  const words = doc.words;
  const breaks = new Set(doc.captions?.breaks || []);
  const hidden = (i) => (doc.captions?.hide || []).some(([a, b]) => i >= a && i <= b);
  const raw = [];
  let cur = null;
  words.forEach((w, k) => {
    if (w.start >= until || hidden(w.i) || !texts[k]) { if (hidden(w.i) || w.start >= until) cur = null; return; }
    if (cur) {
      const prev = words[cur.i1];
      const chars = texts.slice(cur.i0, cur.i1 + 1).filter(Boolean).join(' ').length + 1 + texts[k].length;
      const n = cur.i1 - cur.i0 + 1;
      if (breaks.has(w.i) || PUNCT.test(prev.w) || w.start - prev.end > G.maxGap || chars > G.softChars || n >= (chars <= G.tinyChars ? G.tinyWords : G.maxWords)) cur = null;
    }
    if (!cur) { cur = { i0: k, i1: k }; raw.push(cur); } else cur.i1 = k;
  });
  return raw.map((g, n) => {
    const next = raw[n + 1];
    const end = Math.min(until, doc.duration + 1);
    return { ...g, show: words[g.i0].start, hide: Math.min(next ? words[next.i0].start : end, words[g.i1].end + G.hold, end) };
  });
}

/** until: seconds after which no caption shows (the closing ask replaces them). */
export function buildCaptions(S, until) {
  const { kit, doc } = S; const { h } = kit;
  const C = type.caption;
  const texts = captionTexts(doc.words);
  const groups = captionGroups(doc, texts, until);
  const el = h('div.oc-captions', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0', pointerEvents: 'none' } });
  const nodes = groups.map((g) => {
    const spans = [];
    for (let k = g.i0; k <= g.i1; k++) {
      if (!texts[k]) continue;
      const w = doc.words[k];
      const script = w.emph === 'script';
      const span = h('span', { text: texts[k], style: { display: 'inline-block', whiteSpace: 'nowrap', lineHeight: '1', color: colour.white, textShadow: colour.textShadow,
        fontFamily: script ? fonts.script : fonts.sans, fontWeight: script ? '400' : String(C.weight), fontSize: `${script ? C.scriptSize : C.size}px`, letterSpacing: `${script ? 1 : C.tracking}px`,
        transform: script ? `rotate(${C.scriptTilt}deg) translateY(2px)` : '' } });
      spans.push({ span, t: w.start });
    }
    const row = h('div.oc-cap', { style: { position: 'absolute', left: '0', top: '-70px', width: '1080px', height: '140px', display: 'none', justifyContent: 'center', alignItems: 'center', gap: `${C.gap}px` } }, ...spans.map((s) => s.span));
    el.append(row);
    return { g, row, spans, on: false };
  });

  return {
    el, groups,
    /** where: 'high' | 'low' */
    seek(t, where) {
      setStyle(el, 'transform', `translateY(${where === 'high' ? layout.caption.high : layout.caption.low}px)`);
      for (const n of nodes) {
        const on = t >= n.g.show && t < n.g.hide;
        if (n.on !== on) { n.row.style.display = on ? 'flex' : 'none'; n.on = on; }
        if (!on) continue;
        for (const s of n.spans) {
          const o = t < s.t ? 0 : tw(t, s.t, motion.word, type.word.from, 1, S.E.out);
          const b = t < s.t ? 0 : tw(t, s.t, motion.word, type.word.blur, 0, S.E.out);
          setStyle(s.span, 'opacity', o.toFixed(3));
          setStyle(s.span, 'filter', b > 0.2 ? `blur(${b.toFixed(2)}px)` : '');
        }
      }
    },
  };
}
