// A designed document card for a quotable claim when no page can be captured: an optional
// eyebrow and heading over one paragraph, set like a README or a repository "About" panel at
// the reference's reading size (graphics G07: body line pitch 48-94 px in cards, median 62 px).
// Measured on clip39@1194 (About panel: heading + 4 lines) and @420 (5 lines, highlight):
//   chrome      65 px (shared cardFrame) when a url is given
//   body        regular sans, 46.5 px on a 69.75 px pitch (16 px / 24 px at 2.9x), ink #2A292E,
//               52 px from the card's left edge; shrinks towards the 62 px median, then further,
//               until the paragraph fits the card; a paragraph of 3 lines or fewer grows up to
//               the 94 px pitch at the top of the measured range (62.7 px type)
//   heading     same size, semibold, cap top 31 px under the chrome; first body baseline 1.52
//               pitches under the heading baseline (1.2 pitches under the chrome without one)
//   highlight   flat box from 0.97 em above the baseline to 0.19 em below, one per line,
//               7 px past the words (box 431-485 on a baseline at 476)
// Every mark sits on rectangles computed from the measured text, so it lands exactly on the words.
import { cardFrame } from '../card.js';
import { highlight, outlineBox, numberTile } from '../marks.js';
import { fonts, F } from '../tokens.js';

// ---- TOKENS (card px, 894 wide)
const G = {
  padX: 52, padR: 50,                       // text 145-929 on a card at 93-987
  size: 46.5, lineRatio: 1.5, minPitch: 44, median: 62,
  maxPitch: 94, growLines: 3,               // short paragraphs zoom in to the top of the measured range (research/graphics.md G07)
  ink: '#2A292E', weight: 400, headWeight: 600,
  asc: 0.75,                                // baseline under the line's ascender top (em)
  capTop: 31,                               // heading cap top under the chrome (354 - 323)
  headToBody: 1.52, chromeToBody: 1.2, noChromeTop: 40, bottom: 0.7,   // in pitches; bottom: 49 px after the last baseline
  eyebrow: { size: 24, weight: 700, tracking: 0.07, ink: '#8F8F8F', gap: 22 },   // the grey caps label of designed docs (clip37@740 "DELIVERY")
  hl: { above: 0.97, below: 0.19 },
  mono: 0.9,                                // mono is set 10 % smaller for the same measure
};

const norm = (s) => String(s || '').toLowerCase();

function layoutText(params, kit, w, maxH, chromeH) {
  const fam = params.mono ? fonts.mono : fonts.sans;
  const words = String(params.text).trim().split(/\s+/);
  const width = w - G.padX - G.padR;
  const tryPitch = (P) => {
    const z = (P / G.lineRatio) * (params.mono ? G.mono : 1);
    const font = `${G.weight} ${z}px ${fam}`;
    const lines = kit.wrap(words, width, font).map((l) => l.join(' '));
    const ez = P / G.lineRatio;                                  // the sans size the spacing is built on
    let y = chromeH ? chromeH : G.noChromeTop - G.capTop;        // where the heading's cap top is measured from
    const eyebrowBase = params.eyebrow ? y + G.capTop + G.eyebrow.size * 0.72 : null;
    if (params.eyebrow) y = eyebrowBase + G.eyebrow.gap - G.capTop;
    const headBase = params.heading ? y + G.capTop * (ez / G.size) + ez * 0.7275 : null;
    const first = headBase !== null ? headBase + G.headToBody * P : (params.eyebrow ? eyebrowBase + G.chromeToBody * P * 0.85 : (chromeH ? chromeH : G.noChromeTop * 0.4) + G.chromeToBody * P);
    const h = first + (lines.length - 1) * P + G.bottom * P;
    return { P, z, ez, font, lines, eyebrowBase, headBase, first, h };
  };
  let P = G.size * G.lineRatio;
  let L = tryPitch(P);
  if (L.h <= maxH && L.lines.length <= G.growLines) {
    // a short claim: take the largest pitch that keeps it within growLines lines and the slot
    for (let Q = G.maxPitch; Q > P; Q -= 1) {
      const T = tryPitch(Q);
      if (T.h <= maxH && T.lines.length <= G.growLines) return T;
    }
    return L;
  }
  while (L.h > maxH && P > G.minPitch) { P -= 0.5; L = tryPitch(P); }
  return L;
}

export default {
  type: 'text-card',
  label: 'Text card',
  slots: ['card'],
  params: {
    eyebrow: { type: 'string', optional: true, maxChars: 24, maxWords: 3 },   // grey caps label above ("README.md", "ROLLOUT")
    heading: { type: 'string', optional: true, maxChars: 32, maxWords: 5 },   // "About"
    text: { type: 'string', maxChars: 220 },                                  // the paragraph, word for word
    url: 'string?',                                                           // shows the browser chrome with this address
    counter: { type: 'string', optional: true, maxChars: 7 },                // "2/5" in numbered lists (needs url)
    mono: 'boolean?',                                                         // set the paragraph in mono (a code comment, a prompt)
  },
  beats: {
    highlight: { text: { type: 'string', maxChars: 80 }, tone: 'enum?:accent|red' },   // a phrase of the paragraph, swept left to right
    outline: { text: { type: 'string', maxChars: 40 }, tone: 'enum?:accent|orange|red' },   // a box round a short phrase (one line)
    number: { value: { type: 'string', maxChars: 9 }, label: { type: 'string', optional: true, maxChars: 22, maxWords: 3 } },   // the big number tile over the card
  },

  // the measuring kit is only handed to prepare(); keep it for prefer()
  async prepare(params, S) { return { kit: S.kit }; },

  prefer(params, { data, maxH, w }) {
    if (!data?.kit) return { h: maxH };
    return { h: Math.min(maxH, Math.ceil(layoutText(params, data.kit, w, maxH, params.url ? 65 : 0).h)) };
  },

  build(ctx) {
    const { S, params, rect, mode, tIn, beats } = ctx; const { kit, C } = S; const { h } = kit;
    const W = rect.w, H = rect.h;
    const card = cardFrame(S, { w: W, h: H, mode, tIn, chrome: params.url ? { url: params.url } : null, counter: params.counter || null });
    const root = card.body;
    const L = layoutText(params, kit, W, H, card.chromeH);
    const top = -card.chromeH;                                     // body coordinates start under the chrome
    const page = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${card.bodyH}px` } });
    root.append(page);
    // vertical centring when the card is taller than the text needs
    const dy = Math.max(0, (H - L.h) / 2);
    const Y = (y) => y + dy + top;

    if (params.eyebrow) page.append(h('div', { text: params.eyebrow.toUpperCase(), style: { position: 'absolute', left: `${G.padX}px`, top: `${Y(L.eyebrowBase) - G.eyebrow.size * 0.79}px`, font: `${G.eyebrow.weight} ${G.eyebrow.size}px/1 ${fonts.sans}`, letterSpacing: `${G.eyebrow.tracking}em`, color: G.eyebrow.ink, whiteSpace: 'nowrap' } }));
    if (params.heading) page.append(h('div', { text: params.heading, style: { position: 'absolute', left: `${G.padX}px`, top: `${Y(L.headBase) - L.ez * 0.79}px`, font: `${G.headWeight} ${L.ez}px/1 ${fonts.sans}`, letterSpacing: '-0.01em', color: G.ink, whiteSpace: 'nowrap' } }));
    const fam = params.mono ? fonts.mono : fonts.sans;
    const baseOff = params.mono ? 0.86 : 0.79;                     // baseline inside a line-height:1 box
    const lineEls = L.lines.map((line, i) => {
      const base = Y(L.first + i * L.P);
      const el = h('div', { text: line, style: { position: 'absolute', left: `${G.padX}px`, top: `${base - L.z * baseOff}px`, font: `${G.weight} ${L.z}px/1 ${fam}`, color: G.ink, whiteSpace: 'pre' } });
      return { el, base, line };
    });

    // ---- phrase -> one rectangle per line, from measured text
    const starts = []; let acc = 0;
    for (const l of L.lines) { starts.push(acc); acc += l.length + 1; }
    const full = L.lines.join(' ');
    const rectsFor = (phrase) => {
      const i = norm(full).indexOf(norm(phrase).replace(/\s+/g, ' ').trim());
      if (i < 0) { S.warn(`text-card: "${phrase}" is not in the paragraph`); return null; }
      const j = i + phrase.trim().replace(/\s+/g, ' ').length;
      const out = [];
      L.lines.forEach((line, k) => {
        const a = Math.max(i, starts[k]), b = Math.min(j, starts[k] + line.length);
        if (b <= a) return;
        const x0 = G.padX + kit.measure(line.slice(0, a - starts[k]), L.font);
        const x1 = G.padX + kit.measure(line.slice(0, b - starts[k]), L.font);
        const base = lineEls[k].base;
        out.push({ x: x0, y: base - G.hl.above * L.ez, w: x1 - x0, h: (G.hl.above + G.hl.below) * L.ez });
      });
      return out;
    };

    const marks = [];
    let tile = null;
    const dimmer = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, background: '#000', opacity: '0', pointerEvents: 'none' } });
    for (const b of beats) {
      if (b.do === 'highlight') { const rects = rectsFor(b.text); if (rects) { const m = highlight(S, { rects, t0: b.t, tone: b.tone || 'accent', surface: 'light' }); page.append(m.el); marks.push(m); S.sfx(b.t, 'highlight'); } }
      if (b.do === 'outline') {
        const rects = rectsFor(b.text);
        if (rects) {
          const r = rects.reduce((u, q) => ({ x: Math.min(u.x, q.x), y: Math.min(u.y, q.y), x2: Math.max(u.x2, q.x + q.w), y2: Math.max(u.y2, q.y + q.h) }), { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
          const m = outlineBox(S, { rect: { x: r.x, y: r.y, w: r.x2 - r.x, h: r.y2 - r.y }, t0: b.t, tone: b.tone || 'accent', gap: 6 });
          marks.push(m); page.append(m.el); S.sfx(b.t, 'highlight');
        }
      }
      if (b.do === 'number') { tile = numberTile(S, { value: b.value, label: b.label, cx: W / 2, cy: card.chromeH + card.bodyH / 2, t0: b.t, hold: Infinity, maxW: W - 120 }); S.sfx(b.t, 'number'); S.sfx(tile.landed, 'numberLand'); }
    }
    // text above the highlight boxes (the boxes multiply, but the order keeps them behind the words)
    for (const l of lineEls) page.append(l.el);
    card.overlay.append(dimmer);
    if (tile) card.overlay.append(tile.el);

    return {
      el: card.el,
      seek(t) {
        card.seek(t);
        for (const m of marks) m.seek(t);
        if (tile) { tile.seek(t); dimmer.style.opacity = String(0.5 * tile.dim(t)); }
      },
    };
  },
};
