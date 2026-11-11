// Spoken captions (research/type.md, 1,924 caption lines measured):
// one line of 1-4 words, centred once and filled from the left as each word is said;
// Inter 600 at 96 px; lower case except names; commas and full stops dropped;
// about a third of the lines carry one emphasised word (accent colour, usually in the
// italic serif); a line is swapped for the next in a single frame, with no exit.
import { W, CX, layout, type, fonts, motion, halving } from './tokens.js';

export const CAPTION_RULES = {
  maxWords: 4,
  maxChars: 18,
  maxGap: 0.10,            // a pause of 100 ms or more starts a new line (97 % in the reference)
  holdAfter: 8 / 30,       // a finished line stays about 8 frames unless the next one takes over
  maxHold: 18 / 30,
};

const LOWER_OK = new Set(['the', 'so', 'and', 'this', 'it', 'if', 'you', 'but', 'now', 'here', 'there', 'with', 'for', 'to', 'a', 'an', 'in', 'on', 'of', 'we', 'they', 'that', 'these', 'those', 'what', 'when', 'how', 'why', 'just', 'then', 'because', 'instead', 'all', 'my', 'your', 'our', 'is', 'are', 'can', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'have', 'has', 'not', 'no', 'yes', 'or', 'as', 'at', 'by', 'from', 'it\'s', 'that\'s', 'there\'s', 'here\'s', 'let\'s', 'don\'t', 'you\'re', 'they\'re', 'we\'re', 'which', 'who', 'while', 'once', 'every', 'each', 'most', 'some', 'one', 'two', 'three', 'also', 'even', 'well', 'okay', 'basically', 'pretty', 'go', 'get', 'make', 'think', 'imagine', 'stop', 'start', 'use', 'try', 'look', 'see', 'first', 'second', 'third', 'next', 'last', 'finally', 'today', 'right', 'like', 'maybe', 'after', 'before', 'until', 'since', 'although', 'though', 'however', 'plus', 'still', 'only', 'never', 'always', 'again', 'both', 'either', 'neither', 'whether', 'where', 'whatever', 'everything', 'anything', 'nothing', 'something', 'someone', 'anyone', 'everyone', 'people', 'he', 'she', 'his', 'her', 'their', 'its', 'us', 'them', 'me', 'was', 'were', 'be', 'been', 'being', 'had', 'having', 'than', 'into', 'out', 'up', 'down', 'over', 'under', 'about', 'between', 'through', 'during', 'without', 'within', 'against', 'among', 'around', 'another', 'other', 'many', 'much', 'more', 'less', 'few', 'several', 'any', 'such', 'very', 'really', 'actually', 'honestly', 'literally', 'simply', 'instead', 'meanwhile', 'otherwise', 'therefore', 'anyway']);

/** The text a word shows: sentence punctuation dropped, question marks kept, sentence-initial function words lower-cased. */
export function captionText(kit, w, prev) {
  let t = String(w.w).trim();
  const q = /\?["'”’)]*$/.test(t);
  t = kit.bare(t);
  if (!t) return '';
  if (q) t += '?';
  const startsSentence = !prev || /[.!?]["'”’)]*$/.test(prev.w);
  if (startsSentence && w.fixed !== true) {
    const lower = t.toLowerCase();
    if (LOWER_OK.has(lower.replace(/\?$/, ''))) t = lower;
  }
  return t;
}

/** Group words into caption lines. sceneBreaks: word indexes that must start a line. */
export function captionGroups(S, sceneBreaks = []) {
  const { kit, doc } = S;
  const breaks = new Set([...(doc.captions.breaks || []), ...sceneBreaks]);
  const hidden = (i) => (doc.captions.hide || []).some(([a, b]) => i >= a && i <= b);
  const groups = [];
  let cur = null;
  doc.words.forEach((w, k) => {
    const text = captionText(kit, w, doc.words[k - 1]);
    if (!text || hidden(w.i)) { if (hidden(w.i)) cur = null; return; }
    let start = !cur || breaks.has(w.i);
    if (cur && !start) {
      const prev = cur.words[cur.words.length - 1];
      const chars = cur.words.reduce((n, x) => n + x.text.length + 1, 0) + text.length;
      const afterPunct = /[.!?,;:]["'”’)]*$/.test(prev.raw);
      // an emphasised word likes to end its line (382 of 710 emphasised words sit last)
      const afterEmph = !!prev.emph && !w.emph && cur.words.length >= 2;
      if (cur.words.length >= CAPTION_RULES.maxWords || chars > CAPTION_RULES.maxChars || w.start - prev.end >= CAPTION_RULES.maxGap || afterPunct || afterEmph) start = true;
    }
    if (start) { cur = { words: [], start: w.start, end: w.end }; groups.push(cur); }
    cur.words.push({ i: w.i, text, raw: w.w, start: w.start, end: w.end, emph: w.emph });
    cur.end = w.end;
  });
  const delay = motion.captionWord.delay;
  groups.forEach((g, k) => {
    const next = groups[k + 1];
    g.show = g.start + delay;
    const natural = g.words[g.words.length - 1].start + delay + CAPTION_RULES.holdAfter;
    g.hide = next ? Math.min(next.start + delay, Math.max(natural, g.end + delay) + CAPTION_RULES.maxHold) : g.end + 0.4;
    if (next && next.start + delay - natural < 0.2) g.hide = next.start + delay;      // the next line takes over in one frame
  });
  return groups;
}

export function buildCaptions(S, sceneBreaks) {
  const { kit, C } = S; const { h } = kit;
  const groups = captionGroups(S, sceneBreaks);
  const el = h('div.ep-captions', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: '0', pointerEvents: 'none' } });
  const T = type.caption;
  const lineW = layout.card.w;
  const sansFont = (s) => `${T.weight} ${s}px ${fonts.sans}`;
  const serifFont = (s) => `italic ${T.serifWeight} ${s * T.serifScale}px ${fonts.serif}`;

  const nodes = groups.map((g) => {
    // measure the finished line to keep it inside the card column
    const widthAt = (s) => g.words.reduce((n, w, k) => n + kit.measure(w.text, w.emph && w.emph.includes('serif') ? serifFont(s) : sansFont(s), (w.emph && w.emph.includes('serif') ? T.serifTracking : T.tracking) * s) + (k ? s * 0.25 : 0), 0);
    let size = T.size;
    while (size > 56 && widthAt(size) > lineW) size -= 2;
    const line = h('div.ep-cap', { style: { position: 'absolute', left: `${CX}px`, top: '0', transform: 'translateX(-50%)', whiteSpace: 'nowrap', display: 'none', font: `${T.weight} ${size}px/1 ${fonts.sans}`, letterSpacing: `${T.tracking}em` } });
    const spans = g.words.map((w, k) => {
      const serif = !!w.emph && w.emph.includes('serif');
      const accent = !!w.emph && w.emph.includes('accent');
      const span = h('span', { text: w.text, style: { display: 'inline-block', marginRight: k < g.words.length - 1 ? '0.25em' : '0', willChange: 'transform, opacity, filter',
        ...(serif ? { fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: String(T.serifWeight), fontSize: `${T.serifScale}em`, letterSpacing: `${T.serifTracking}em`, lineHeight: '0' } : {}) } });
      line.append(span);
      return { span, w, accent, serif };
    });
    el.append(line);
    return { g, line, spans, size };
  });

  const baselineFor = (mode, scene) => {
    if (mode === 'dark-focus') return layout.dark.captionBaseline;
    if (mode === 'presenter-full') return layout.full.captionBaseline;
    if (mode === 'white') return scene?.option?.slots?.heading ? layout.white.captionBaseline : layout.white.focusCaptionBaseline;
    return layout.light.captionBaseline;
  };

  const M = motion.captionWord;
  return {
    el, groups,
    seek(t, sceneAt, suppressed) {
      for (const n of nodes) {
        // a line belongs to the scene its first word is spoken in and never outlives that scene:
        // the next layout has its own caption position
        n.scene ||= sceneAt(n.g.start + 0.02);              // scene starts are frame-rounded: allow half a frame and more
        const scene = n.scene;
        const on = t >= n.g.show && t < Math.min(n.g.hide, scene.end) && !suppressed(n.g, t);
        if (n.on !== on) { n.line.style.display = on ? 'block' : 'none'; n.on = on; }
        if (!on) continue;
        const mode = scene.option.layout;
        const surface = mode === 'dark-focus' ? 'dark' : mode === 'presenter-full' ? 'video' : 'light';
        n.line.style.top = `${baselineFor(mode, scene) - n.size * type.ascent.sans}px`;
        n.line.style.color = surface === 'dark' ? C.captionOnDark : surface === 'video' ? C.captionOnVideo : C.ink;
        n.line.style.textShadow = surface === 'video' ? '0 4px 22px rgba(0,0,0,0.42), 0 1px 3px rgba(0,0,0,0.35)' : surface === 'dark' ? '0 2px 12px rgba(0,0,0,0.28)' : 'none';
        for (const s of n.spans) {
          const t0 = s.w.start + M.delay;
          const shown = t >= t0;
          s.span.style.visibility = shown ? 'visible' : 'hidden';
          if (!shown) continue;
          // opacity eases up over 6.75 frames; the word rises 10 px and sharpens within three frames
          const fade = surface === 'light' ? M.fade : M.fade * 0.55;
          const o = kit.prog(t, t0, fade, kit.ease.outCubic);
          const dy = M.rise * (1 - kit.prog(t, t0, M.riseDur, kit.ease.outCubic));
          const blur = M.blur * halving(t, t0, M.blurHalf);
          s.span.style.opacity = String(0.22 + 0.78 * o);
          s.span.style.transform = dy > 0.05 ? `translateY(${dy.toFixed(2)}px)` : 'none';
          s.span.style.filter = blur > 0.25 ? `blur(${blur.toFixed(2)}px)` : 'none';
          s.span.style.color = s.accent ? (surface === 'light' ? C.accentText : s.serif ? C.accentSerifDark : C.accentTextDark) : '';
        }
      }
    },
  };
}
