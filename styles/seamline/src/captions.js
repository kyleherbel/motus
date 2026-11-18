// The running caption (research/type.md T01-T11; layout.md L15-L17; motion.md M04, M05).
//   one line of pixel capitals, white, centred on the seam: cap top y 945, baseline y 974 [T02, L15]; over the
//   full-frame face it drops to y 1440, below the chin (owner, 2026-11-18)
//   a group is about 2 words and at most 16 characters; it ends after . , ! ? : ; [T08]
//   it cuts in complete on the frame its first word starts and is replaced by the next group on the next word;
//   no fade, scale or word-by-word reveal [T09, T10, M04]
//   punctuation, apostrophes and digits are kept [T11]
//   look "caption": "shadow" (a hard 3 px drop shadow) or "plate" (a black plate at 0.7 hugging the words) [T05-T07]
// A caption gives way to a big word over the face and to a brand mark on the seam [T20, H19].
import { fonts, type, colour, layout } from './tokens.js';
import { setStyle } from './common.js';

const PUNCT = /[.,!?;:]["'”’)\]]*$/;
const ADV = 2 / 3;                       // Monocraft advance per em: a monospace, so a caption's width is its length
// where the baseline falls in a one-em line box: half the leading plus the ascent (hhea 1212 / -252 on 1080 units)
const BASE = (1 + 1212 / 1080 - 252 / 1080) / 2;

/** The text of each word: capitals; "-" fragments from the transcript join the word before. */
export function captionTexts(words) {
  const out = words.map((w) => String(w.w || '').trim().replace(/[“”"]/g, '').toUpperCase());
  for (let k = 1; k < out.length; k++) {
    if (!out[k].startsWith('-')) continue;
    let j = k - 1;
    while (j > 0 && !out[j]) j--;
    if (out[j]) { out[j] += out[k]; out[k] = ''; }
  }
  return out;
}

/** Group words into captions. Returns [{ i0, i1, text, show, hide }] (positions in doc.words, seconds). */
export function captionGroups(doc, texts) {
  const G = type.group;
  const words = doc.words;
  const breaks = new Set(doc.captions?.breaks || []);
  const hidden = (i) => (doc.captions?.hide || []).some(([a, b]) => i >= a && i <= b);
  const raw = [];
  let cur = null;
  words.forEach((w, k) => {
    if (hidden(w.i) || !texts[k]) { if (hidden(w.i)) cur = null; return; }
    if (cur) {
      const prev = words[cur.i1];
      const n = cur.words.length;
      const chars = cur.text.length + 1 + texts[k].length;
      // two words is the norm; a third or fourth only while the line stays at 10 characters [T08]
      if (breaks.has(w.i) || PUNCT.test(prev.w) || w.start - prev.end > 0.3 || chars > G.softChars || n >= G.maxWords || (n >= 2 && chars > 10)) cur = null;
    }
    if (!cur) { cur = { i0: k, i1: k, words: [k], text: texts[k] }; raw.push(cur); } else { cur.i1 = k; cur.words.push(k); cur.text += ' ' + texts[k]; }
  });
  return raw.map((g, n) => {
    const next = raw[n + 1];
    const end = doc.duration;
    const lastEnd = words[g.i1].end;
    const hide = next ? Math.min(words[next.i0].start, Math.max(lastEnd, words[g.i0].start + G.hold) + G.maxHold) : Math.min(end, lastEnd + G.hold);
    return { i0: g.i0, i1: g.i1, text: g.text, show: words[g.i0].start, hide };
  });
}

/** blocks: [[t0, t1]] during which no caption shows (a big word or a brand mark has the seam). */
export function buildCaptions(S, blocks = []) {
  const { kit, doc } = S; const { h } = kit;
  const C = type.caption, Pl = type.plate;
  const plate = (doc.look?.caption || 'shadow') === 'plate';
  const groups = captionGroups(doc, captionTexts(doc.words));
  const cap = layout.caption;
  const capH = C.size * 0.789;           // Monocraft's cap height per em (from the font file)
  const el = h('div.sl-captions', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', pointerEvents: 'none' } });
  const nodes = groups.map((g) => {
    const w = g.text.length * C.size * ADV;
    const left = cap.cx - w / 2;
    const text = h('div', { text: g.text, style: { position: 'absolute', left: `${left.toFixed(2)}px`, top: `${(cap.baseline - C.size * BASE).toFixed(2)}px`, width: `${(w + 2).toFixed(2)}px`, height: `${C.size}px`,
      font: `400 ${C.size}px/${C.size}px ${fonts.pixel}`, letterSpacing: `${C.tracking}px`, whiteSpace: 'pre', color: colour.white,
      textShadow: plate ? 'none' : colour.captionShadow } });
    const node = h('div.sl-cap', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', display: 'none' } });
    if (plate) {
      node.append(h('div', { style: { position: 'absolute', left: `${(left - Pl.padX).toFixed(2)}px`, top: `${(cap.capTop - Pl.padY).toFixed(2)}px`, width: `${(w + 2 * Pl.padX).toFixed(2)}px`,
        height: `${(capH + 2 * Pl.padY).toFixed(2)}px`, borderRadius: `${Pl.radius}px`, background: colour.plate } }));
    }
    node.append(text);
    el.append(node);
    return { g, node, text, on: false };
  });
  const blocked = (t) => blocks.some(([a, b]) => t >= a && t < b);
  return {
    el, groups,
    /** set the vertical position of the line's baseline once the font is known to sit where expected */
    nodes,
    /** layout: the run's layout; over the full-frame face the line sits lower, on the chest (owner) */
    seek(t, layout) {
      const dy = layout === 'face' ? cap.faceCy - cap.cy : 0;
      setStyle(el, 'transform', dy ? `translateY(${dy}px)` : '');
      const off = blocked(t);
      for (const n of nodes) {
        const on = !off && t >= n.g.show && t < n.g.hide;
        if (n.on !== on) { setStyle(n.node, 'display', on ? '' : 'none'); n.on = on; }
      }
    },
  };
}
