// A number as the card's subject, when there is no page to put it on (graphics G16-G18, colour
// C26, motion "big number"). Three skins, as measured:
//   dark   slate tile, 1-2 px #3A6077 edge, radius 27, hugging the digits (clip39@108: 706x278
//          at 188,596; digit cap 114 px 50 px under the tile top, label ascender 41 px under the
//          digit baseline, label baseline 37 px above the tile bottom, 48 px sides)
//   white  white tile, radius 34, 1 px #E4E4E6 edge, flat accent digits, grey label (clip22@258)
//   bare   no plate: gradient digits and label floating on the dark canvas (clip40@318: "$500"
//          cap 172 px; clip20@480: "5,220,123" cap 110 px under an "openverse" source line,
//          665 px... the digits fill at most 710 px)
// Motion (tokens motion.number, clip39@63-85): the digits roll up like an odometer in white,
// decelerating over 16 frames; the plate fades in over 4 frames from frame 8; as the count lands
// the digits take the six-stop accent gradient over 6 frames.
import { parseFigure, formatFigure } from '../marks.js';
import { fonts, type, motion } from '../tokens.js';

// Where the baseline sits in a line-height-1 box of Motus Inter (hhea ascender 969, descender 242 per 1000).
const ASC = type.ascent.sans;

// ---- TOKENS WANTED in tokens.js (layout.number); numberTile() in marks.js draws a taller tile
// (padding 36/50/40, label 60 px) than these measurements: kept here until the shared one can take them.
const T = {
  tile: { padTop: 50, gap: 41, padBottom: 37, padBottomBare: 50, side: 48, minW: 380, maxDigitsW: 610, size: 210, min: 96 },
  bare: { maxDigitsW: 710, size: 236, min: 110, pad: 24 },        // "$500" cap 172 (size 236); "5,220,123" 707 px wide
  label: { size: 48, weight: 700, tracking: -0.02, ascent: 0.757, maxW: 760 },   // "a month", "in API credits every month": 47-48 px
  source: { size: 44, weight: 700, tracking: -0.02, gap: 65 },   // "openverse" line: its baseline 65 px over the digits' cap top
  dark: { fill: '#343842', edge: '#3A6077', edgeW: 1.5, radius: 27, shadow: '0 24px 60px rgba(0,0,0,0.45)' },
  white: { fill: '#FDFDFD', edge: '#E4E4E6', edgeW: 1, radius: 34, shadow: '0 8px 24px rgba(0,0,0,0.14)', digits: '#0083FC', label: '#76767A', roll: '#131416' },
};

function geometry(params, S, mode) {
  const { kit } = S;
  const skin = params.skin || (mode === 'dark' ? 'dark' : 'white');
  const bare = skin === 'bare';
  const fig = parseFigure(params.value);
  const tr = type.number.tracking;
  const dFont = (z) => `${type.number.weight} ${z}px ${fonts.sans}`;
  const B = bare ? T.bare : T.tile;
  // tabular figures all take the advance of 0, which the canvas measures for us
  const tab = fig.text.replace(/\d/g, '0');
  const size = kit.fitSize(tab, B.maxDigitsW, dFont, B.size, B.min, tr);
  const cap = size * type.capRatio.sans;
  const digitsW = kit.measure(tab, dFont(size), tr * size);
  const lFont = (z) => `${T.label.weight} ${z}px ${fonts.sans}`;
  const lSize = params.label ? kit.fitSize(params.label, T.label.maxW, lFont, T.label.size, 30, T.label.tracking) : 0;
  const labelW = params.label ? kit.measure(params.label, lFont(lSize), T.label.tracking * lSize) : 0;
  const sFont = (z) => `${T.source.weight} ${z}px ${fonts.sans}`;
  const sSize = params.source ? kit.fitSize(params.source, T.label.maxW, sFont, T.source.size, 28, T.source.tracking) : 0;
  // vertical stack, from the top of the plate (or of the bare block)
  const top = bare ? T.bare.pad : T.tile.padTop;
  const sourceBase = params.source ? top + sSize * 0.73 : null;           // cap-height line
  const capTop = params.source ? sourceBase + T.source.gap : top;
  const base = capTop + cap;
  const labelBase = params.label ? base + T.tile.gap + lSize * T.label.ascent : null;
  const bottom = (labelBase ?? base) + (bare ? T.bare.pad : params.label ? T.tile.padBottom : T.tile.padBottomBare);
  const w = Math.max(T.tile.minW, Math.max(digitsW, labelW) + 2 * T.tile.side);
  return { skin, bare, fig, size, cap, digitsW, lSize, sSize, sourceBase, capTop, base, labelBase, h: bottom, w, tr };
}

export default {
  type: 'big-number',
  label: 'Big number',
  slots: ['card'],
  params: {
    value: { type: 'string', maxChars: 10 },                                   // as it should read: "$500", "24.3k", "5,220,123", "99%"
    label: { type: 'string', optional: true, maxChars: 28, maxWords: 5 },      // what it counts, 1-3 words: "GitHub stars", "a month"
    source: { type: 'string', optional: true, maxChars: 24, maxWords: 4 },     // a small line over it: where the figure comes from
    skin: 'enum?:dark|white|bare',                                             // default: dark tile on dark focus, white tile elsewhere; bare = no plate
    at: 'word?',                                                               // the word on which the digits start to roll
  },
  beats: {},

  // measuring needs the kit, so the geometry is worked out here (the tile is the same size in both tile skins)
  async prepare(params, S) { return { h: geometry(params, S, 'dark').h }; },

  prefer(params, { data, maxH }) { return { h: Math.min(maxH, Math.ceil(data?.h ?? 300)) }; },

  build(ctx) {
    const { S, params, rect, mode, tIn } = ctx; const { kit, C } = S; const { h } = kit;
    const g = geometry(params, S, mode);
    const dark = g.skin !== 'white';
    const M = motion.number;
    const t0 = Math.max(tIn, params.at !== undefined ? S.wordTime(params.at) : tIn);
    const landed = t0 + M.count;
    S.sfx(t0, 'number'); S.sfx(landed, 'numberLand');

    // the block is centred in the rect the layout gives the card
    const bx = (rect.w - g.w) / 2, by = (rect.h - g.h) / 2;
    const root = h('div.ep-bignum', { style: { position: 'absolute', left: '0', top: '0', width: `${rect.w}px`, height: `${rect.h}px`, pointerEvents: 'none' } });
    const block = h('div', { style: { position: 'absolute', left: `${bx}px`, top: `${by}px`, width: `${g.w}px`, height: `${g.h}px`, transformOrigin: '50% 50%' } });
    root.append(block);

    let plate = null;
    if (!g.bare) {
      const P = dark ? T.dark : T.white;
      plate = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${g.w}px`, height: `${g.h}px`, boxSizing: 'border-box', borderRadius: `${P.radius}px`, background: P.fill, border: `${P.edgeW}px solid ${P.edge}`, boxShadow: P.shadow } });
      block.append(plate);
    }
    // digits: a plain copy that rolls, and a tinted copy that fades in over it once the count lands
    const line = (z) => ({ position: 'absolute', left: '0', width: `${g.w}px`, top: `${g.base - z * ASC}px`, textAlign: 'center', whiteSpace: 'nowrap' });
    const dStyle = { ...line(g.size), font: `${type.number.weight} ${g.size}px/1 ${fonts.sans}`, letterSpacing: `${g.tr}em`, fontVariantNumeric: 'tabular-nums' };   // tabular, as measured: "5,220,123" is 6.55 caps wide (proportional Inter: 5.9)
    // the six stops span the cap height (cap top sits at 6.25 % of a line-height-1 box, the baseline at 79 %)
    const capA = (ASC - type.capRatio.sans) * 100, capB = ASC * 100;
    const stops = C.digits.map((c, i) => `${c} ${(capA + (capB - capA) * i / (C.digits.length - 1)).toFixed(1)}%`).join(', ');
    const plain = h('div', { text: g.fig.text, style: { ...dStyle, color: dark ? '#FFFFFF' : T.white.roll, textShadow: dark ? '0 2px 18px rgba(0,0,0,0.45)' : 'none' } });
    const tinted = h('div', { text: g.fig.text, style: { ...dStyle, ...(dark
      ? { background: `linear-gradient(180deg, ${stops})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 18px ${C.digitGlow})` }
      : { color: C.accentName === 'blue' ? T.white.digits : C.accent }) } });
    block.append(plain, tinted);
    let lab = null, src = null;
    if (params.label) {
      lab = h('div', { text: params.label, style: { ...line(g.lSize), top: `${g.labelBase - g.lSize * ASC}px`, font: `${T.label.weight} ${g.lSize}px/1 ${fonts.sans}`, letterSpacing: `${T.label.tracking}em`, color: dark ? C.tileLabel : T.white.label } });
      block.append(lab);
    }
    if (params.source) {
      src = h('div', { text: params.source, style: { ...line(g.sSize), top: `${g.sourceBase - g.sSize * ASC}px`, font: `${T.source.weight} ${g.sSize}px/1 ${fonts.sans}`, letterSpacing: `${T.source.tracking}em`, color: dark ? '#FFFFFF' : C.ink } });
      block.append(src);
    }

    return {
      el: root,
      // no page under it: the dark ground takes a mid slate, the level the reference's backdrops sit at (40-70)
      tone: g.skin === 'white' ? 'light' : [110, 115, 125],
      seek(t) {
        const on = t >= t0;
        block.style.display = on ? '' : 'none';
        if (!on) return;
        const pin = kit.prog(t, t0, 4 / 30, kit.ease.outCubic);
        block.style.opacity = String(pin);
        block.style.transform = pin >= 1 ? 'none' : `scale(${(0.94 + 0.06 * pin).toFixed(4)})`;
        const pp = kit.prog(t, t0 + M.plateAt, M.plateFade, kit.ease.outCubic);
        if (plate) plate.style.opacity = String(pp);
        if (lab) lab.style.opacity = String(g.bare ? kit.prog(t, t0 + M.plateAt, M.plateFade + 4 / 30, kit.ease.outCubic) : pp);
        tinted.style.opacity = String(kit.prog(t, landed, M.tint, kit.ease.outCubic));
        if (g.fig.number !== null) {
          const roll = kit.prog(t, t0, M.count, kit.ease.outQuart);
          const txt = roll >= 1 ? g.fig.text : formatFigure(g.fig, g.fig.number * roll);
          if (plain.textContent !== txt) { plain.textContent = txt; tinted.textContent = txt; }
        }
      },
    };
  },
};
