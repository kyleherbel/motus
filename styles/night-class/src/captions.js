// Spoken captions (research/type.md, 8,673 caption events measured):
// one word at a time by default, two or rarely three when short function words run together;
// one centred line, never wrapped; Inter 800; white on the dark field and on footage, black on the
// light field; no shadow, stroke, box or colour; cut in on the word and replaced on the same frame
// by the next caption, with no blank frame between words [T03-T11, T28, M03].
// The named concept the video teaches shows as one caption in the italic serif [T12];
// the call to action shows 'Comment "Keyword"' as one caption [T13].
import { CX, layout, type, fonts, colour, motion } from './tokens.js';
import { measureText } from './text.js';

export const CAPTION_RULES = {
  maxWords: 3,
  joinGap: 0.10,         // never join across a pause of 0.10 s or more (0.2 % joined at 0.10-0.20 s) [T08]
  joinLetters: 8,        // join when the pair is short: <= 8 letters ...
  joinDur: 0.30,         // ... or spoken in under 0.30 s [T08]
  maxLetters: 12,        // a group stays short (p90 11 letters) [T08]
};

// The commonest first words of a joined pair: the 171, you 53, this 47, to 46, is 42 [T08]. A short word that
// leans on the next one starts a pair; the pair is then short and quick.
const LEADS = new Set(['the', 'a', 'an', 'to', 'you', 'this', 'is', 'of', 'in', 'i', 'it', 'my', 'your', 'on', 'for', 'at', 'if']);

const letters = (s) => s.replace(/[^\p{L}\p{N}]/gu, '').length;
const core = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '');

/** The text a word shows: the transcript as said, '?' and '!' dropped, periods and commas kept [T11]. */
export function captionText(w) {
  return String(w.w).trim().replace(/[?!]+/g, '').replace(/\s+/g, ' ');
}

const titleCase = (s) => s.replace(/(^|[\s-])(\p{Ll})/gu, (m, a, b) => a + b.toUpperCase());

/** Group words into captions. Returns [{ words, text, kind: 'word'|'concept'|'cta', show, hide }]. */
export function captionGroups(doc) {
  const words = doc.words;
  const breaks = new Set(doc.captions?.breaks || []);
  const hidden = (i) => (doc.captions?.hide || []).some(([a, b]) => i >= a && i <= b);
  const groups = [];
  let cur = null;
  for (let k = 0; k < words.length; k++) {
    const w = words[k];
    const text = captionText(w);
    if (hidden(w.i) || !text) { cur = null; if (hidden(w.i)) groups.push({ gap: true, start: w.start }); continue; }
    const kind = w.emph === 'concept' ? 'concept' : w.emph === 'cta' ? 'cta' : 'word';
    const item = { i: w.i, text, raw: w.w, start: w.start, end: w.end };
    // the keyword reaches back to a 'comment' said just before it ("comment the word reply"): the caption
    // becomes 'Comment “Reply”' from the verb on, and the words between show no caption of their own [T13]
    if (kind === 'cta') {
      const back = groups.slice(-3).reverse().find((g) => !g.gap && core(g.words[0].raw) === 'comment' && w.start - g.words[0].start < 1.5);
      if (back) { groups.splice(groups.indexOf(back) + 1); back.words = [back.words[0], item]; back.kind = 'cta'; cur = back; continue; }
    }
    let join = false;
    if (cur && !breaks.has(w.i)) {
      const last = cur.words[cur.words.length - 1];
      if (kind === 'concept' && cur.kind === 'concept') join = true;                       // the whole name at once
      else if (kind === 'cta' && cur.words.length === 1 && core(last.raw) === 'comment') { join = true; cur.kind = 'cta'; }
      else if (kind === 'word' && cur.kind === 'word' && cur.words.length < CAPTION_RULES.maxWords) {
        const punct = /[.,;:?!]["'”’)]*$/.test(last.raw);
        const gap = w.start - last.end;
        const L = cur.words.reduce((n, x) => n + letters(x.text), 0) + letters(text);
        const dur = w.end - cur.words[0].start;
        // the group so far must be leaning words only ("the", "to the"), and the whole stays short and quick
        const leans = cur.words.every((x) => LEADS.has(core(x.raw)));
        join = !punct && leans && gap < CAPTION_RULES.joinGap && L <= CAPTION_RULES.maxLetters && (L <= CAPTION_RULES.joinLetters || dur < CAPTION_RULES.joinDur);
      }
    }
    if (!join) { cur = { words: [], kind }; groups.push(cur); }
    cur.words.push(item);
  }
  const out = [];
  groups.forEach((g, k) => {
    if (g.gap) return;
    let text = g.words.map((x) => x.text).join(' ');
    if (g.kind === 'concept') { text = titleCase(text.replace(/[,;:]+$/, '')); if (!/[.]$/.test(text)) text += '.'; }
    if (g.kind === 'cta') { const [c, ...rest] = g.words; text = `${titleCase(c.text.replace(/[.,]+$/, ''))} “${titleCase(rest.map((x) => x.text).join(' ').replace(/[.,;:]+$/, ''))}”`; }
    const next = groups[k + 1];
    const show = g.words[0].start + motion.captionDelay;
    const hide = next ? (next.gap ? next.start : next.words[0].start + motion.captionDelay) : doc.duration + 1;
    out.push({ words: g.words, kind: g.kind, text, show, hide });
  });
  return out;
}

export function buildCaptions(S) {
  const { kit, doc } = S; const { h } = kit;
  const groups = captionGroups(doc);
  const el = h('div.nc-captions', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0', pointerEvents: 'none' } });
  const T = type.caption, C = type.concept;
  const fontOf = (g, full) => (g.kind === 'concept'
    ? { family: fonts.serif, style: 'italic', weight: 400, size: full ? C.sizeFull : C.size, tracking: C.tracking, base: fonts.serifM.base }
    : { family: fonts.sans, style: 'normal', weight: T.weight, size: full ? T.sizeFull : T.size, tracking: T.tracking, base: fonts.sansM.base });
  // the size that fits the caption column (a single line, never wrapped)
  const fit = (g, f) => {
    let s = f.size;
    const w = (x) => measureText(g.text, `${f.style === 'italic' ? 'italic ' : ''}${f.weight} ${x}px ${f.family}`, f.tracking);
    while (s > f.size * 0.6 && w(s) > layout.caption.maxW) s -= 1;
    return s;
  };
  const nodes = groups.map((g) => {
    const node = h('div.nc-cap', { text: g.text, style: { position: 'absolute', left: `${CX}px`, top: '0', transform: 'translateX(-50%)', whiteSpace: 'nowrap', display: 'none' } });
    el.append(node);
    return { g, node, look: null };
  });
  return {
    el, groups,
    /** mode at time t: 'dark' | 'light' | 'full' */
    seek(t, mode) {
      for (const n of nodes) {
        const on = t >= n.g.show && t < n.g.hide;
        if (n.on !== on) { n.node.style.display = on ? 'block' : 'none'; n.on = on; }
        if (!on || n.look === mode) continue;
        const full = mode === 'full';
        const f = fontOf(n.g, full);
        const size = fit(n.g, f);
        Object.assign(n.node.style, {
          font: `${f.style === 'italic' ? 'italic ' : ''}${f.weight} ${size}px/1 ${f.family}`, letterSpacing: `${f.tracking}em`,
          top: `${layout.caption.baseline - size * f.base}px`,
          color: mode === 'light' ? colour.caption.light : colour.caption.dark,
        });
        n.look = mode;
      }
    },
  };
}
