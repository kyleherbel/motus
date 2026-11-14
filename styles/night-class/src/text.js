// Title text: bold sans with 1-3 words in the italic serif [T16]. Lines are written with the serif
// words between asterisks: "How To Write *Hooks*". A line written entirely between asterisks is set
// in the serif and may be larger than the other line [T16].
import { fonts, type } from './tokens.js';

/** "Stop *Writing* Hooks" -> [{text:'Stop ', serif:false}, {text:'Writing', serif:true}, {text:' Hooks', serif:false}] */
export function parseRich(line) {
  const out = [];
  String(line).split(/(\*[^*]+\*)/).forEach((part) => {
    if (!part) return;
    if (/^\*[^*]+\*$/.test(part)) out.push({ text: part.slice(1, -1), serif: true });
    else out.push({ text: part, serif: false });
  });
  return out;
}
export const plain = (line) => parseRich(line).map((s) => s.text).join('');
export const allSerif = (line) => { const r = parseRich(line).filter((s) => s.text.trim()); return r.length > 0 && r.every((s) => s.serif); };

/**
 * Font strings for a size: the serif is set so its cap height matches the sans [T16]
 * (Inter cap 0.7275 em, Instrument Serif cap 0.72 em).
 */
export function faces(size, weight = type.title.weight) {
  const serifSize = (size * fonts.sansM.cap) / fonts.serifM.cap;
  return {
    sans: `${weight} ${size}px ${fonts.sans}`, serif: `italic 400 ${serifSize}px ${fonts.serif}`,
    sansSize: size, serifSize,
  };
}

/**
 * Width of text as the page will lay it out. Measured in the DOM, not on a canvas: a canvas cannot apply
 * Inter's optical size ('opsz' 14), so it reads the narrower display cut. Deterministic for given fonts.
 */
let probe = null;
const cache = new Map();
export function measureText(text, font, trackingEm = 0) {
  const key = `${font}|${trackingEm}|${text}`;
  if (cache.has(key)) return cache.get(key);
  if (!probe) {
    probe = document.createElement('span');
    Object.assign(probe.style, { position: 'absolute', left: '-100000px', top: '0', whiteSpace: 'pre', visibility: 'hidden', fontVariationSettings: fonts.sansVariation, fontKerning: 'normal' });
    document.body.append(probe);
  }
  probe.style.font = font; probe.style.letterSpacing = `${trackingEm}em`; probe.textContent = text;
  const w = probe.getBoundingClientRect().width;
  cache.set(key, w);
  return w;
}

/** Width of a rich line at a size. */
export function richWidth(kit, segs, size, weight) {
  const f = faces(size, weight);
  return segs.reduce((n, s) => n + measureText(s.text, s.serif ? f.serif : f.sans, s.serif ? type.title.serifTracking : type.title.tracking), 0);
}

/**
 * Split a rich line into build units (words), keeping each word's face. Spaces stay attached to
 * the word before them so the units tile the line exactly.
 */
export function units(segs) {
  const out = [];
  for (const s of segs) {
    for (const m of s.text.matchAll(/\S+\s*|\s+/g)) {
      const t = m[0];
      if (!t.trim() && out.length) { out[out.length - 1].text += t; continue; }
      out.push({ text: t, serif: s.serif });
    }
  }
  return out;
}

/**
 * Typing spoken words letter by letter (the reference types character by character with a caret, and a grey bar
 * stands in for the rest of the line). words: [{ text, t, end, x, y, line }] already laid out; font as a CSS font
 * string. Returns { seek(t) -> { caretX, caretY, line, barX } } and sets each word span's clip.
 */
export function typer(S, words, font, trackingEm, maxPerWord = 0.38) {
  for (const w of words) {
    w.prefix = [0];
    for (let k = 1; k <= w.text.length; k++) w.prefix.push(measureText(w.text.slice(0, k), font, trackingEm));
    w.full = w.prefix[w.prefix.length - 1];
    w.dur = Math.max(0.06, Math.min(maxPerWord, (w.end ?? w.t + 0.25) - w.t));
  }
  return {
    seek(t, settled = false) {
      let last = null;
      for (const w of words) {
        const n = settled ? w.text.length : t < w.t ? 0 : Math.min(w.text.length, Math.ceil(w.text.length * (t - w.t) / w.dur));
        const vis = n > 0;
        if (w.shown !== n) {
          w.el.style.display = vis ? '' : 'none';
          w.el.style.clipPath = n >= w.text.length ? 'none' : `inset(-20% ${(w.full - w.prefix[n] + 0.5).toFixed(1)}px -40% -2px)`;
          w.shown = n;
        }
        if (vis) last = { w, n };
      }
      return last ? { caretX: last.w.x + last.w.prefix[last.n], caretY: last.w.y, line: last.w.line, done: last.w === words[words.length - 1] && last.n >= last.w.text.length } : null;
    },
  };
}
