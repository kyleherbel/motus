// Spoken captions (research/type.md T03-T17, T29; layout.md L05-L09; motion.md M12):
//   one centred line of two words, on a translucent dark plate; one word alone only at the end of a
//   sentence; never three, never wrapped, never shrunk [T05-T07]
//   a group appears on the frame its first word starts and stays until the next one replaces it, with
//   no gap and no animation: hard cuts only [T08, T12, M12]
//   the word being spoken is in the accent (magenta), from the frame it starts to the frame it ends; everything else is
//   white [T09-T11]
//   baseline 984 in the split layout and 1504 in the full layout; the caption glides between the two with
//   the layout change and stays sharp [T04, T13, L21]
//   no caption under the opening title [T17, L09, H03]
import { CX, layout, type, fonts, colour } from './tokens.js';
import { measureText, setStyle } from './common.js';

// A pair wider than this is shown as two single words. The widest caption in the reference is 704 px [L06];
// the reference never needed the fallback, so the limit itself is a guess (research/type.md, T05).
const MAX_INK = 760;

const SENTENCE_END = /[.!?]["'”’)\]]*$/;

/** The text a word shows: transcript casing, sentence punctuation removed, apostrophes, hyphens, digits and % kept [T14, T15]. */
export function captionText(w) {
  return String(w.w).trim().replace(/[“”"]/g, '').replace(/[.,!?;:]+(?=$|["'”’)\]]+$)/g, '').replace(/[)\]]+$/, '').replace(/^[(\[]+/, '').trim();
}

/** Group words into captions: pairs counted from the first word of each sentence. Returns [{ words, show, hide }]. */
export function captionGroups(doc, hiddenAt = () => false) {
  const breaks = new Set(doc.captions?.breaks || []);
  const hide = doc.captions?.hide || [];
  const hidden = (i) => hide.some(([a, b]) => i >= a && i <= b);
  const groups = [];
  let cur = null;
  for (const w of doc.words) {
    const text = captionText(w);
    if (!text || hidden(w.i)) { cur = null; groups.push({ gap: true, start: w.start }); continue; }
    if (!cur || cur.words.length >= 2 || cur.closed || breaks.has(w.i)) { cur = { words: [], closed: false }; groups.push(cur); }
    cur.words.push({ i: w.i, text, start: w.start, end: w.end });
    if (SENTENCE_END.test(String(w.w).trim())) cur.closed = true;
  }
  const out = [];
  groups.forEach((g, k) => {
    if (g.gap) return;
    const next = groups[k + 1];
    out.push({ words: g.words, show: g.words[0].start, hide: next ? (next.gap ? next.start : next.words[0].start) : doc.duration + 1 });
  });
  return out;
}

export function buildCaptions(S) {
  const { kit, doc } = S; const { h } = kit;
  const size = type.caption.size;
  const font = `${fonts.weight.caption} ${size}px ${fonts.sans}`;
  const widthOf = (text) => measureText(text, font, type.caption.tracking);

  // split a pair that would not fit into two single words
  const groups = [];
  for (const g of captionGroups(doc)) {
    const text = g.words.map((w) => w.text).join(' ');
    if (g.words.length === 2 && widthOf(text) > MAX_INK) {
      groups.push({ words: [g.words[0]], show: g.show, hide: g.words[1].start }, { words: [g.words[1]], show: g.words[1].start, hide: g.hide });
      S.warn(`caption "${text}" is wider than ${MAX_INK} px and is shown one word at a time`);
    } else groups.push(g);
  }

  const PL = layout.caption.pill;
  const el = h('div.eb-captions', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0', pointerEvents: 'none' } });
  const pillRGB = colour.pill.fill.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16)).join(',');
  const nodes = groups.map((g) => {
    const spans = g.words.map((w, k) => h('span', { text: w.text + (k < g.words.length - 1 ? ' ' : ''), style: { whiteSpace: 'pre' } }));
    // the plate is the text box plus 26 px each side; the text box, with its tracking, is centred on the axis [L06, L07]
    const line = h('div', { style: { position: 'relative', top: `${(PL.above - size * fonts.M.base).toFixed(2)}px`, whiteSpace: 'nowrap', font: font.replace('px ', 'px/1 '), letterSpacing: `${type.caption.tracking}em`, color: colour.captionWhite } }, ...spans);
    const node = h('div.eb-cap', { style: { position: 'absolute', left: `${CX}px`, top: `${-PL.above}px`, height: `${PL.above + PL.below}px`, padding: `0 ${PL.padX}px`, boxSizing: 'content-box',
      transform: 'translateX(-50%)', borderRadius: `${PL.radius}px`, background: `rgba(${pillRGB},${colour.pill.alpha})`, display: 'none' } }, line);
    el.append(node);
    return { g, node, spans, on: false, active: -2 };
  });

  return {
    el, groups,
    /** p: 0 = split layout, 1 = full layout (and anything between while the layout changes). hidden: no caption at all. */
    seek(t, p, hidden) {
      const base = layout.caption.baseline.split + (layout.caption.baseline.full - layout.caption.baseline.split) * p;
      setStyle(el, 'transform', `translateY(${base.toFixed(2)}px)`);
      for (const n of nodes) {
        const on = !hidden && t >= n.g.show && t < n.g.hide;
        if (n.on !== on) { n.node.style.display = on ? 'block' : 'none'; n.on = on; }
        if (!on) continue;
        const active = n.g.words.findIndex((w) => t >= w.start && t < w.end);
        if (n.active !== active) { n.spans.forEach((s, k) => { s.style.color = k === active ? colour.accent : ''; }); n.active = active; }
      }
    },
  };
}
