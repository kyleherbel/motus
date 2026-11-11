// Text measurement and caption grouping helpers.

let _ctx = null;
const ctx = () => (_ctx ||= document.createElement('canvas').getContext('2d'));

/** Width in px of `str` set in the CSS font shorthand `font` (e.g. "700 64px Inter"). */
export function measure(str, font, letterSpacingPx = 0) {
  const c = ctx();
  c.font = font;
  return c.measureText(str).width + letterSpacingPx * Math.max(0, [...str].length - 1);
}

/** Largest size in [min, max] (px, integer) at which `str` fits `maxWidth`. `fontAt(size)` returns the font shorthand. */
export function fitSize(str, maxWidth, fontAt, max, min = 12, letterSpacingEm = 0) {
  for (let s = max; s > min; s--) {
    if (measure(str, fontAt(s), letterSpacingEm * s) <= maxWidth) return s;
  }
  return min;
}

/** Greedy line breaking by measured width. Returns arrays of words. */
export function wrap(words, maxWidth, font, letterSpacingPx = 0) {
  const lines = [];
  let cur = [];
  for (const w of words) {
    const trial = [...cur, w].join(' ');
    if (cur.length && measure(trial, font, letterSpacingPx) > maxWidth) { lines.push(cur); cur = [w]; }
    else cur.push(w);
  }
  if (cur.length) lines.push(cur);
  return lines;
}

/**
 * Split spoken words into caption groups.
 * words: [{i, w, start, end}] on the output timeline.
 * opt: { maxWords, maxChars, maxGap, breaks:Set|Array of word indexes that must start a group,
 *        hide: [[i0,i1],...] ranges with no caption, punct: break after . ! ? , ; : when true }
 * Returns [{ i0, i1, start, end, words:[...] }]
 */
export function groupWords(words, opt = {}) {
  const { maxWords = 3, maxChars = 18, maxGap = 0.45, punct = true } = opt;
  const breaks = new Set(opt.breaks || []);
  const hidden = (i) => (opt.hide || []).some(([a, b]) => i >= a && i <= b);
  const groups = [];
  let cur = null;
  const close = () => { if (cur) { groups.push(cur); cur = null; } };
  for (let k = 0; k < words.length; k++) {
    const w = words[k];
    if (hidden(w.i)) { close(); continue; }
    const text = w.w;
    if (cur) {
      const chars = cur.words.reduce((n, x) => n + x.w.length + 1, 0) + text.length;
      const gap = w.start - cur.end;
      const prev = cur.words[cur.words.length - 1].w;
      const afterPunct = punct && /[.!?,;:]$/.test(prev);
      if (breaks.has(w.i) || cur.words.length >= maxWords || chars > maxChars || gap > maxGap || afterPunct) close();
    }
    if (!cur) cur = { i0: w.i, i1: w.i, start: w.start, end: w.end, words: [] };
    cur.words.push(w); cur.i1 = w.i; cur.end = w.end;
  }
  close();
  return groups;
}

/** Strip trailing/leading punctuation the way on-screen captions usually do. */
export function bare(word, keep = "'’$%#@&+-/") {
  const esc = keep.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  return word.replace(new RegExp(`^[^\\p{L}\\p{N}${esc}]+|[^\\p{L}\\p{N}${esc}]+$`, 'gu'), '');
}
