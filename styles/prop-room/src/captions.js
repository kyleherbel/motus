// Spoken captions (research/type.md T01-T18, T24; layout.md L14-L19; motion.md M03, M04; structure.md S08):
//   one centred line of 1-3 words, mostly 2, about 9 characters: a group always ends after . , ? ! and is
//   otherwise filled greedily while it stays at 14 characters or less [T05, T07-T09]
//   a group appears whole on the frame its first word starts and is replaced on one frame: no animation [T10, T11]
//   every layout cut starts a new group, so the cut and the caption change share a frame [S08, M03]
//   Inter wght 730, opsz 26, 76 px, -1 px tracking, white, transcript case and punctuation, no emphasis [T01-T04, T12, T13, T18]
//   a plate that hugs the ink, radius 19, dark grey [T14-T16; V]; a hard black glyph shadow [T17; V]
//   baseline 975 across the seam in the split, 1276 in every other layout [L14-L16; V]
import { CX, layout, type, fonts, colour } from './tokens.js';
import { measureText, inkExtent, setStyle } from './common.js';

const SENTENCE_PUNCT = /[.,?!]["'”’)\]]*$/;
const VARIATION = `"opsz" ${fonts.caption.opsz}, "wght" ${fonts.caption.weight}`;
const FONT = `${fonts.caption.weight} ${fonts.caption.size}px/1 ${fonts.sans}`;

/** The text a word shows: the transcript's own text, trimmed, with quotation marks dropped [T12, T13]. */
export const captionText = (w) => String(w.w).trim().replace(/[“”"]/g, '');

/**
 * Group words into captions. sceneStarts: Map of the first word of each scene to the scene's cut time; a scene's
 * first word always opens a group, shown from the cut frame [S08, M03]. Returns [{ words, show, hide }].
 */
export function captionGroups(doc, sceneStarts = new Map()) {
  const G = type.group;
  const breaks = new Set([...(doc.captions?.breaks || []), ...sceneStarts.keys()]);
  const hide = doc.captions?.hide || [];
  const hidden = (i) => hide.some(([a, b]) => i >= a && i <= b);
  const raw = [];
  let cur = null;
  for (const w of doc.words) {
    const text = captionText(w);
    if (hidden(w.i)) { cur = null; raw.push({ gap: true, start: w.start }); continue; }
    if (!text) continue;   // a word fixed to "" (an ASR word split in two) leaves no hole: the group runs on
    // the transcript splits hyphenated words ("free", "-to", "-download"): a token that starts with a hyphen joins
    // the word before it, in the same group [T13]
    if (text.startsWith('-') && cur && cur.words.length && !breaks.has(w.i)) {
      const last = cur.words[cur.words.length - 1];
      last.text += text; last.end = w.end;
      if (SENTENCE_PUNCT.test(text)) cur.closed = true;
      continue;
    }
    const len = cur ? cur.words.map((x) => x.text).join(' ').length + 1 + text.length : 0;
    if (!cur || cur.closed || breaks.has(w.i) || cur.words.length >= G.maxWords || len > G.softChars) { cur = { words: [], closed: false }; raw.push(cur); }
    cur.words.push({ i: w.i, text, start: w.start, end: w.end });
    if (SENTENCE_PUNCT.test(text)) cur.closed = true;
  }
  const showOf = (g) => sceneStarts.get(g.words[0].i) ?? g.words[0].start;
  const out = [];
  raw.forEach((g, k) => {
    if (g.gap) return;
    const next = raw[k + 1];
    out.push({ words: g.words, show: k === 0 ? 0 : showOf(g), hide: next ? (next.gap ? next.start : showOf(next)) : doc.duration + 1 });
  });
  return out;
}

export function buildCaptions(S, sceneStarts) {
  const { kit, doc } = S; const { h } = kit;
  const T = type.plate, GS = type.glyphShadow;
  const track = fonts.caption.trackingPx;

  // a group whose plate would be wider than the widest the reference shows is shown a word at a time [L17]
  const plateW = (text) => { const ink = inkExtent(text, FONT, track); return ink.right - ink.left + T.padL + T.padR; };
  const groups = [];
  for (const g of captionGroups(doc, sceneStarts)) {
    const text = g.words.map((w) => w.text).join(' ');
    if (g.words.length > 1 && plateW(text) > layout.caption.plateMaxW) {
      g.words.forEach((w, k) => groups.push({ words: [w], show: w.start, hide: k < g.words.length - 1 ? g.words[k + 1].start : g.hide }));
      S.warn(`caption "${text}" is wider than ${layout.caption.plateMaxW} px and is shown one word at a time`);
    } else groups.push(g);
  }

  const el = h('div.pr-captions', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0', pointerEvents: 'none' } });
  const textStyle = (extra) => ({ position: 'absolute', left: '0', top: '0', whiteSpace: 'pre', font: FONT, fontVariationSettings: VARIATION, letterSpacing: `${track}px`, ...extra });
  const nodes = groups.map((g) => {
    const text = g.words.map((w) => w.text).join(' ');
    const ink = inkExtent(text, FONT, track);
    const adv = measureText(text, FONT, track, VARIATION);
    const pw = ink.right - ink.left + T.padL + T.padR;
    const left = CX - pw / 2;                         // the plate is centred on x 540 [L17]
    const originX = left + T.padL - ink.left;          // where the text's own origin goes
    const top = -(ink.up + T.padT), bottom = ink.down + T.padB;   // relative to the baseline
    const lineTop = -fonts.caption.size * fonts.M.base;           // a line-height-1 box with its baseline at 0
    const plate = h('div', { style: { position: 'absolute', left: `${left.toFixed(2)}px`, top: `${top.toFixed(2)}px`, width: `${pw.toFixed(2)}px`, height: `${(bottom - top).toFixed(2)}px`,
      borderRadius: `${T.radius}px`, background: colour.captionPlate } });
    // the glyph shadow: the same text, black, grown by the spread, blurred, offset [T17]
    const shadow = h('div', { text, style: textStyle({ left: `${(originX + GS.dx).toFixed(2)}px`, top: `${(lineTop + GS.dy).toFixed(2)}px`, color: '#000',
      WebkitTextStroke: `${2 * GS.spread}px #000`, filter: `blur(${GS.sigma}px)` }) });
    const line = h('div', { text, style: textStyle({ left: `${originX.toFixed(2)}px`, top: `${lineTop.toFixed(2)}px`, color: colour.white }) });
    const node = h('div.pr-cap', { style: { position: 'absolute', left: '0', top: '0', display: 'none' } }, plate, shadow, line);
    el.append(node);
    return { g, node, on: false, adv };
  });

  return {
    el, groups,
    /** where: 'split' | 'low'. hidden: no caption at all. */
    seek(t, where, hidden = false) {
      const base = where === 'split' ? layout.caption.baseline.split : layout.caption.baseline.low;
      setStyle(el, 'transform', `translateY(${base}px)`);
      for (const n of nodes) {
        const on = !hidden && t >= n.g.show && t < n.g.hide;
        if (n.on !== on) { n.node.style.display = on ? 'block' : 'none'; n.on = on; }
      }
    },
  };
}
