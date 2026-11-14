// One picture or one clip the user supplies, given the reference's placement, framing and motion
// (research/graphics.md G22, G25, G27; type.md T28; colour.md C14, C15).
//
// The reference fills the field with illustrations of the thing being talked about, or of an object that stands
// for the idea (research/explain.md X03). The style ships no art and imitates none: this element shows the user's
// own file. A still cut-out (a file with transparency) with shading in it is printed in the house look, cream
// dots on the dark ground with one accent part where the file has a coloured one (research/explain-look.md
// R01-R13). A cut-out made of a few flat colours is the reference's other kind of picture, the flat vector mark
// [R01, R16], or is already printed: it is shown as it is. `look` overrides either way. The file itself decides
// how it sits:
//   on the field   a cut-out (a file with transparency) sits directly on the dots, as the reference's
//                  halftone illustrations do. A file with an opaque dark ground also sits on the field,
//                  and its edges fade into it, as the reference's opaque illustrations do.
//   picture card   an opaque picture or a clip on a plain rounded card: its own aspect, the capture radius,
//                  one soft shadow, and a thin stroke only when the picture is dark.
//   item card      a cut-out on the raised dark card (the reference's one-mark-per-item card), with the
//                  soft shadow that card's marks cast.
// `frame` picks between the field and a card; left out, a picture with a light opaque ground and every
// clip go on a card and everything else goes on the field. A clip plays once from its first frame when
// the picture arrives and holds its last frame.
// An optional upper-case label sits above the picture. Once it has arrived the picture is still [M20]: 14 held
// cut-outs measured on every frame keep a scale of 1.0000; the 3 that grow in the reference are moving clips,
// and a clip the user supplies plays as it is.
//
// The picture is an anchor. Things then land on it, each on the word that states it (research/explain.md X01,
// X07, X18; explain-look.md R21, R22, R25, R31; explain-motion.md D09, D11):
//   badge   a disc that states a new state of the object: on the top-right corner of the object's upper part,
//           or over its middle when it cancels or completes it. A later badge in the same place takes over.
//   tag     a short text: a price or a count on an accent chip over the bottom-left corner, or a one-word stamp
//   chip    a cream name tile (a short name, or the user's own mark) over the top-left corner, or centred
//           between two things at the top
//   bubble  a dark speech bubble beside the top of the picture: three waiting dots, or bars while it talks.
//           A later bubble beat changes its state.
// Two beats on the same word follow one another 6 frames apart [X10]. Nothing else moves [X24].
import { CX, F, layout, fonts, type, colour, motion, explain as X } from '../tokens.js';
import { place, measureText, fontFor, sizeForCap, enterAt, applyState, setStyle } from '../common.js';
import { card } from '../card.js';
import { loadMedia, mediaView } from '../media.js';
import { printCutout } from '../halftone.js';
import { badgeNode, tagNode, popAt, tagAt, BADGE_KINDS } from '../marks.js';

// TOKENS (research/graphics.md G04, G05, G22, G27; type.md T28)
export const P = {
  bare: {
    maxW: 1000,                         // the column [G04]; the widest illustration ink is 965 px (clip30@1000)
    maxH: { split: 770, full: 1292 },   // tallest illustration ink in split: 771 px, y 55..826 (clip34@410) [G22]; full: the tallest capture card [G05]
    feather: 40,                        // an opaque ground fades into the field over 36 to 48 px (clip32@720, clip32@800) [G22]
  },
  paper: {
    maxH: { split: 800, full: 1292 },   // a card ends by y 840 in split (clip35@480) [G27]; radius 28 is card.js (clip39@560: 27.75)
    darkStroke: '#1E1F22',              // a dark capture carries a 2 px stroke of luma about 30 (clip30@1480: #201F1C) [G12; low; release palette C26]
  },
  // a cut-out on the raised dark card (clip35@480, @550, @610): card 40..1040 x 40..840, corner radius 53.25
  // (CSS 54 reads 53.25 with the same fit), marks 634 x 432 and 420 x 584, and under the mark one soft black
  // shadow: alpha 0.46 and 0.38, sigma 24 px, 16 and 18 px down
  item: { w: 1000, h: 800, radius: 54, inner: { w: 634, h: 584 }, shadow: 'drop-shadow(0 17px 24px rgba(0,0,0,0.42))' },
  label: {
    gap: 58,                            // label baseline to the picture's top edge: 59 and 57 px (clip29@405) [T28]
    // The shipped font grows its capitals with weight (its MVAR table): 0.709 em at weight 800, not the 0.676 of
    // the lightest master that fonts.M.cap holds. The label is sized from 0.709 so its capitals are 51.0 px
    // (clip29@405: cap top 114.0, baseline 165.0).
    capEm: 0.709,
    tracking: 0.061,                    // at that size: 6 letters 299 px wide, 5 letters 249 px (clip29@405). T28 gives 0.06 to 0.09
  },
  darkBelow: 56,                        // by eye: an opaque ground darker than this (luma, 0-255) can sit on the field (field 19, dark cards 31 to 40)
  softAbove: 2,                         // by eye: a still enlarged more than this is reported as soft
  flatShare: 0.9,                       // by eye: a cut-out whose 3 commonest colours hold this share is flat art and is not screened [R01, R16]
};

// TOKENS for what lands on the picture (research/explain.md X10, X18, X27; explain-look.md R21, R22, R25, R31;
// explain-motion.md D09, D11). Measured on settled reference frames, clip@frame per line. "The object" is the
// opaque part of a cut-out, or the card when the picture sits on one. Its upper (lower) part is the top (bottom)
// 15 % of its height: the head of the microphone in clip30@1600, the lid of the laptop in clip30@1480 (by eye).
export const A = {
  band: 0.15,
  safe: { l: 16, r: 1064, col: [40, 1040] },   // nothing leaves the frame's safe sides [L25]; a chip stays on the column [L10]
  badge: {
    // a disc on a corner grows with what it lands on: 192 px on a lid 739 px wide (clip30@1480), 104 on a head
    // 162 wide (clip30@1600), 147 on a stack 262 wide (clip32@930). d = 96 + 0.134 x the width of the object's
    // upper part fits them within +3, +13 and -16 px (a fixed 150 px: 42, 46, 3); kept inside explain.badge.sizeRange
    size: { c: 96, k: 0.134 },
    centre: 198,                        // the cross over the thing it cancels: ring 198 x 200 px (clip38@740)
    // the disc's centre sits right of and below the top-right corner of the object's upper part: 17.5 and 18.5 px
    // (clip30@1480: corner 910, 525; disc 927.5, 543.5), 15 and 29 px (clip30@1600: corner 633, 75; disc 648, 104).
    // The check on the stack sits on its top sheet instead, 195 px left of that corner (clip32@930): not built
    out: 20,
    // on a card the disc sits inside the corner: 88 px on a card 329 px wide, its centre 47 px in and 40 px down
    // (clip34@340, 3 cards)
    card: { share: 0.267, in: 0.53, down: 0.45 },
    min: 88, share: 0.45,               // 88: the smallest disc measured (clip34@340). share of the object's shorter side: by eye
    offline: { ring: 4 / 192, slash: 13 / 192 },   // of the disc (clip30@1480: ring 4 px #DFDDD9 at its core, stroke 12 to 14 px)
    // the glyph's drawn size and stroke, of the disc. marks.js draws these three 10 to 27 % smaller than measured:
    // the check is 84 x 66 px on a 147 px disc (clip32@930), the cross 100 x 102 px with 18.5 px arms on 198
    // (clip38@740), the signal 102 x 94 px on 192 (clip30@1480). The padlock (38 x 44 on 104, clip30@1600) fits as drawn
    glyph: { check: [0.80, 0.10], cross: [0.90, 0.093], offline: [0.63, 0.057] },
  },
  tag: {
    // the price chip (clip30@1480): 270 x 180 px, corner radius 38 (profile fit, rmse 0.4 px), capitals 97 px
    // (the 0 is 100 px tall), text ink 163 px wide, fill the accent, ink #1B1A15. Its left edge is 18 px left of
    // the bottom-left corner of the object's lower part and its bottom edge 44 px under the object (clip30@1430, @1480)
    // (padX runs to the text's layout box: 51.3 px, 2.2 px outside its ink on each side)
    chip: { cap: 97, h: 180 / 97, padX: 51.3 / 97, radius: 38 / 180, left: -18, below: 44 },
    // the stamp (clip38@1180, one bespoke scene): 330 x 140 px, an 8 px accent outline on #1B1A15, cream text whose
    // ink is 192 x 53 px with its ascenders (capitals 52 px). It stands at 83 % of the width and 42 % of the height
    // of the scene it stamps. Its corners are stepped pixels there; the build rounds them like the price chip (by eye)
    stamp: { cap: 52, h: 140, padX: 66.2, radius: 38 / 180, fill: colour.card.frame, u: 0.83, v: 0.42 },   // padX to the text's layout box (69 px to its ink)
    maxW: 330, minCap: 52,              // a longer price is set smaller, never wider than the stamp nor smaller than its capitals (by eye)
    widest: 485,                        // by eye: no tag is wider than half the column; 8 wide capitals are then set smaller still
    tracking: -0.03,                    // tagNode's
  },
  chip: {
    // the wordmark tile (clip30@1000, @1220, @1480, @1600): 232 x 116 px every time, the small name tile of the
    // chips element (its numbers, measured on the same tile at clip30@980 and clip32@1000), with the chips' soft
    // shadow. Corner radius 33: 32.5 by the corner's profile and 33.7 by the tile's area on clip30@1480 (chips.js: 34.8)
    h: 116, padX: 35, padPic: 36, cap: 45, radius: 33, pic: 60, picGap: 18, ink: colour.field,
    shadow: '0 14px 44px rgba(0,0,0,0.54)',
    // over the top-left corner: the tile's left edge 22 px left of the object and its top 80 px above it, so 36 px
    // of it lie on the picture (clip30@1480: tile 56..288 x 446..562, object from 78, 526)
    corner: { left: -22, top: -80 },
    between: { top: 6 },                // centred between two things, its top 6 px under the object's top (clip30@1000: 262 against 256)
    maxW: 485, minCap: 26,              // by eye: half the column less the chips' gap; a longer name is set smaller
    mark: { w: 170, pad: 31 },          // a mark alone: its ink is 170 x 60 px, 32 and 30 px from the tile's sides (clip30@1000, @1480, @1600)
  },
  bubble: {
    // clip30@735: a pill 256 x 142 px with a 3 px outline #DCDBD9 on #211F1B and a tail at the bottom left
    // (it leaves the body 39 px in, turns at 35, 139.5 and ends in a tip 44.5 px in and 26 px under the body).
    // 30 px right of the object and 45 px under its top (radio 394..657 x 102..782)
    w: 256, h: 142, stroke: 3, outline: '#DADBDE', fill: colour.card.fill, gap: 30, down: 45,   // outline: #DCDBD9 measured; release palette [C26]
    path: 'M71 1.5H185A69.5 69.5 0 0 1 185 140.5H83.5L44.5 167.5L35 139.5L38.9 133A69.5 69.5 0 0 1 71 1.5Z',
    // three dots of 26 px, 56 px apart, #696863 (release palette #67686B [C26]); one after another each brightens to the cream and falls back
    // in about 11 frames, 3.25 frames apart, every 22 frames; the first round starts 3.5 frames after the bubble
    // (clip30@712-754, two rounds: the first dot peaks on 721.75 and 743.75)
    dot: { d: 26, pitch: 56, dim: '#67686B', pulse: F(11), lag: F(3.25), every: F(22), first: F(3.5) },
    // seven accent bars 13 px wide, 23 px apart, 36 to 68 px tall in steps of 4; a new set every 1.9 frames
    // (7 sets on frames 756-768), each set the one three sets before it moved one bar to the left
    bar: { n: 7, w: 13, pitch: 23, min: 36, step: 4, steps: 9, every: F(2) },
  },
};

/** A repeatable value in 0..1 for two whole numbers: the heights of the talking bars. */
const noise = (a, b) => { let x = (Math.imul(a, 374761393) + Math.imul(b, 668265263)) | 0; x = Math.imul(x ^ (x >>> 13), 1274126177); return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };
const clampTo = (v, lo, hi) => (hi < lo ? (lo + hi) / 2 : v < lo ? lo : v > hi ? hi : v);

/**
 * What a picture's border is made of: 'cutout' (some of it is transparent, so the picture has a shape of its
 * own), 'dark' or 'light' (opaque all round). Read once in prepare from a 48 x 48 copy of the picture, or of
 * a clip's first frame.
 */
export function groundOf(m) {
  if (m.kind !== 'image' && m.kind !== 'video') return 'light';
  try {
    const n = 48;
    const c = document.createElement('canvas'); c.width = n; c.height = n;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(m.kind === 'video' ? m.video : m.img, 0, 0, n, n);
    const d = g.getImageData(0, 0, n, n).data;
    let luma = 0, count = 0;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (x > 0 && x < n - 1 && y > 0 && y < n - 1) continue;
      const i = (y * n + x) * 4;
      if (d[i + 3] < 128) return 'cutout';
      luma += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; count++;
    }
    return luma / count < P.darkBelow ? 'dark' : 'light';
  } catch { return 'light'; }
}

/**
 * Is a picture made of a few flat colours (a vector mark, or a picture that is already screened) and not of
 * continuous tone? Read once in prepare from its middle at full size, so dots stay dots: true when 3 colours
 * hold 90 % of what is opaque (by eye; a shaded object has under a third there, a flat mark all of it).
 */
export function flatOf(m) {
  if (m.kind !== 'image') return false;
  try {
    const cw = Math.min(m.w, 1024), ch = Math.min(m.h, 1024);
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(m.img, (m.w - cw) / 2, (m.h - ch) / 2, cw, ch, 0, 0, cw, ch);
    const d = g.getImageData(0, 0, cw, ch).data;
    const bins = new Map(); let n = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) continue;
      const k = ((d[i] >> 4) << 8) | ((d[i + 1] >> 4) << 4) | (d[i + 2] >> 4);
      bins.set(k, (bins.get(k) || 0) + 1); n++;
    }
    if (!n) return false;
    const top = [...bins.values()].sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a + b, 0);
    return top / n >= P.flatShare;
  } catch { return false; }
}

/**
 * Where the object is inside a cut-out's frame, as shares of the picture: its ink box (l, t, r, b) and the outer
 * edges of its upper and lower parts (topL, topR, botL). Read once in prepare from a copy 512 px on its longer side.
 * A picture with no transparency is its own box.
 */
export function shapeOf(m) {
  const whole = { l: 0, t: 0, r: 1, b: 1, topL: 0, topR: 1, botL: 0 };
  if (m.kind !== 'image') return whole;
  try {
    const k = Math.min(1, 512 / Math.max(m.w, m.h));
    const cw = Math.max(2, Math.round(m.w * k)), ch = Math.max(2, Math.round(m.h * k));
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(m.img, 0, 0, cw, ch);
    const d = g.getImageData(0, 0, cw, ch).data;
    const rows = [];
    for (let y = 0; y < ch; y++) {
      let x0 = -1, x1 = -1;
      for (let x = 0; x < cw; x++) if (d[(y * cw + x) * 4 + 3] >= 128) { if (x0 < 0) x0 = x; x1 = x; }
      if (x0 >= 0) rows.push([y, x0, x1 + 1]);
    }
    if (!rows.length) return whole;
    const t = rows[0][0], b = rows[rows.length - 1][0] + 1;
    const band = Math.max(1, (b - t) * A.band);
    const top = rows.filter((r) => r[0] < t + band), bottom = rows.filter((r) => r[0] >= b - band);
    return {
      l: Math.min(...rows.map((r) => r[1])) / cw, r: Math.max(...rows.map((r) => r[2])) / cw, t: t / ch, b: b / ch,
      topL: Math.min(...top.map((r) => r[1])) / cw, topR: Math.max(...top.map((r) => r[2])) / cw, botL: Math.min(...bottom.map((r) => r[1])) / cw,
    };
  } catch { return whole; }
}

/** Print a still cut-out in the house look at w x h frame px, on a ground of the colour it sits on [R05, R08, R09]: see halftone.js. */
export function printHouse(image, w, h, ground) {
  return printCutout(image, w, h, { ground });
}

/**
 * The small upper-case label over a graphic [T28]: heavy weight, cap height 51 px, tracked wide, cream, centred
 * on the axis. `top` is its cap top. A label wider than maxW is set smaller on the same baseline.
 */
export function labelNode(S, text, top, maxW = layout.column.w) {
  const str = String(text).trim().toUpperCase();
  const L = P.label;
  let size = type.label.cap / L.capEm;
  const wide = measureText(str, `${fonts.weight.heavy} ${size.toFixed(2)}px ${fonts.sans}`, L.tracking);
  if (wide > maxW) size *= maxW / wide;
  // the browser snaps a text baseline down to a whole pixel: aim half a pixel past the line so it lands on it
  return S.kit.h('div', { text: str, style: { position: 'absolute', left: `${CX}px`, top: `${(Math.round(top + type.label.cap) + 0.5 - size * fonts.M.base).toFixed(2)}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
    font: `${fonts.weight.heavy} ${size.toFixed(2)}px/1 ${fonts.sans}`, letterSpacing: `${L.tracking}em`, color: colour.cream } });
}
/** Height a label takes above its picture. */
export const LABEL_H = type.label.cap + P.label.gap;

/** Room for a graphic in its slot: shorter under a section heading [L11, L12]. */
export function roomOf(ctx) {
  const sl = layout.slot[ctx.mode] || layout.slot.split;
  return sl.bottom - (ctx.headed ? sl.headed.top : sl.top);
}

const NS = 'http://www.w3.org/2000/svg';
const at = (el, x, y, w, hh) => Object.assign(el.style, { position: 'absolute', left: `${x.toFixed(2)}px`, top: `${y.toFixed(2)}px`, width: `${w.toFixed(2)}px`, height: `${hh.toFixed(2)}px` });

/**
 * The cream name tile [R31]: the user's mark, a short name, or both. Returns { el, w }; the tile is A.chip.h tall.
 */
function nameTile(S, label, img) {
  const { h } = S.kit; const C = A.chip;
  const weight = fonts.weight.caption;
  let cap = C.cap;
  const ps = img ? Math.min(C.pic / img.h, (label ? C.pic : C.mark.w) / img.w) : 0;
  const pw = img ? img.w * ps : 0, ph = img ? img.h * ps : 0;
  const padL = img ? (label ? C.padPic : C.mark.pad) : C.padX, padR = label ? C.padX : C.mark.pad;
  const fixed = padL + pw + (img && label ? C.picGap : 0) + padR;
  let tw = label ? measureText(label, fontFor(cap, weight)) : 0;
  if (label && fixed + tw > C.maxW) {
    const k = Math.max(C.minCap / cap, (C.maxW - fixed) / tw);
    S.warn(`picture: the chip "${label}" is too long for the reference size; it was set at ${Math.round(k * 100)} %`);
    cap *= k; tw = measureText(label, fontFor(cap, weight));
  }
  const w = fixed + tw;
  const el = h('div.eb-picture-chip', { style: { position: 'absolute', left: '0', top: '0', width: `${w.toFixed(2)}px`, height: `${C.h}px`, borderRadius: `${C.radius}px`, background: colour.cream, boxShadow: C.shadow } });
  if (img) el.append(h('img', { src: img.url, style: { position: 'absolute', left: `${padL.toFixed(2)}px`, top: `${((C.h - ph) / 2).toFixed(2)}px`, width: `${pw.toFixed(2)}px`, height: `${ph.toFixed(2)}px`, display: 'block' } }));
  if (label) {
    const size = sizeForCap(cap, weight);
    el.append(h('div', { text: label, style: { position: 'absolute', left: `${(padL + pw + (img ? C.picGap : 0)).toFixed(2)}px`, top: `${(C.h / 2 + cap / 2 - size * fonts.M.base).toFixed(2)}px`, whiteSpace: 'nowrap',
      font: `${weight} ${size.toFixed(2)}px/1 ${fonts.sans}`, color: C.ink } }));
  }
  return { el, w };
}

/**
 * The speech bubble [R25]: a dark pill with a light outline and a tail, three dots inside it and, for the
 * talking state, seven accent bars. Returns { el, dots, bars, dotsWrap, barsWrap }.
 */
function bubbleNode(S) {
  const { h } = S.kit; const B = A.bubble;
  const el = h('div.eb-picture-bubble', { style: { position: 'absolute', left: '0', top: '0', width: `${B.w}px`, height: `${B.h}px` } });
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', String(B.w)); svg.setAttribute('height', String(B.h + 30)); svg.setAttribute('viewBox', `0 0 ${B.w} ${B.h + 30}`);
  Object.assign(svg.style, { position: 'absolute', left: '0', top: '0', overflow: 'visible' });
  const body = document.createElementNS(NS, 'path');
  body.setAttribute('d', B.path); body.setAttribute('fill', B.fill); body.setAttribute('stroke', B.outline); body.setAttribute('stroke-width', String(B.stroke)); body.setAttribute('stroke-linejoin', 'round');
  svg.append(body); el.append(svg);
  const cx = B.w / 2, cy = B.h / 2;
  const dotsWrap = h('div', { style: { position: 'absolute', left: '0', top: '0' } });
  const dots = [-1, 0, 1].map((k) => h('div', { style: { position: 'absolute', left: `${cx + k * B.dot.pitch - B.dot.d / 2}px`, top: `${cy - B.dot.d / 2}px`, width: `${B.dot.d}px`, height: `${B.dot.d}px`, borderRadius: '50%', background: B.dot.dim } }));
  dotsWrap.append(...dots);
  const barsWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', display: 'none' } });
  const bars = Array.from({ length: B.bar.n }, (_, i) => h('div', { style: { position: 'absolute', left: `${cx + (i - (B.bar.n - 1) / 2) * B.bar.pitch - B.bar.w / 2}px`, top: '0', width: `${B.bar.w}px`, height: '0', borderRadius: `${B.bar.w / 2}px`, background: colour.accent } }));
  barsWrap.append(...bars);
  el.append(dotsWrap, barsWrap);
  return { el, dots, bars, dotsWrap, barsWrap };
}
const hexToRgb = (c) => c.match(/[0-9a-f]{2}/gi).map((v) => parseInt(v, 16));
const mixHex = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;

/**
 * Everything that lands on the picture. obj: the object's box in frame px { l, t, r, b, topL, topR, botL, card }.
 * Returns the parts; each has seek(t).
 */
function annotations(ctx, obj, images) {
  const { S, beats, tOut } = ctx; const { h } = S.kit;
  const parts = [];
  const ow = obj.r - obj.l, oh = obj.b - obj.t;
  // nothing rises into a section heading's line, or out of the frame
  const minTop = ctx.headed ? (layout.slot[ctx.mode] || layout.slot.split).headed.top : A.safe.l;
  const wrapAt = (x, y, w, hh, child) => { const el = h('div', { style: {} }, child); at(el, x, y, w, hh); return el; };
  // beats on the same word follow one another [X10]
  let prev = null;
  const timed = beats.map((b) => { const t0 = prev !== null && b.t <= prev + 1e-6 ? prev + X.event.follow : b.t; prev = t0; return { b, t0 }; });
  const corner = timed.filter(({ b }) => b.do === 'badge' && b.place !== 'centre');
  const middle = timed.filter(({ b }) => b.do === 'badge' && b.place === 'centre');
  let bubble = null;

  for (const { b, t0 } of timed) {
    if (b.do === 'badge') {
      const centre = b.place === 'centre';
      const kind = BADGE_KINDS.includes(b.kind) ? b.kind : 'check';
      const [dMin, dMax] = X.badge.sizeRange;
      const wish = centre ? A.badge.centre : obj.card ? Math.min(dMax, A.badge.card.share * ow) : Math.max(dMin, Math.min(dMax, A.badge.size.c + A.badge.size.k * (obj.topR - obj.topL)));
      const d = Math.max(A.badge.min, Math.min(wish, A.badge.share * Math.min(ow, oh)));
      let cx, cy;
      if (centre) { cx = (obj.l + obj.r) / 2; cy = (obj.t + obj.b) / 2; }
      else if (obj.card) { cx = obj.r - A.badge.card.in * d; cy = obj.t + A.badge.card.down * d; }
      else { cx = obj.topR + A.badge.out; cy = obj.t + A.badge.out; }
      cx = clampTo(cx, A.safe.l + d / 2, A.safe.r - d / 2); cy = Math.max(cy, minTop + d / 2);
      const node = badgeNode(S, kind, d);
      const fit = A.badge.glyph[kind], svg = node.querySelector('svg');
      if (fit && svg) {
        svg.setAttribute('width', (d * fit[0]).toFixed(1)); svg.setAttribute('height', (d * fit[0]).toFixed(1));
        for (const path of svg.querySelectorAll('path')) path.setAttribute('stroke-width', ((fit[1] * 24) / fit[0]).toFixed(3));
      }
      if (kind === 'offline') {
        // the reference's no-signal disc has a light ring of 4 px on 192 and its stroke in the accent, 13 px on 192
        // (clip30@1480) [R22]; marks.js draws a muted ring and a cream stroke
        node.style.boxShadow = `inset 0 0 0 ${Math.max(3, d * A.badge.offline.ring).toFixed(1)}px ${A.bubble.outline}`;
        const slash = [...node.querySelectorAll('path')].pop();
        if (slash) { slash.setAttribute('stroke', colour.accent); slash.setAttribute('stroke-width', ((A.badge.offline.slash * 24) / fit[0]).toFixed(3)); }
      }
      // the wrapper pops, not the disc: popAt clears the display of what it is given, and the disc centres its glyph with it
      const el = wrapAt(cx - d / 2, cy - d / 2, d, d, node);
      // a later badge in the same place takes over once it is opaque
      const same = centre ? middle : corner;
      const next = same[same.findIndex((x) => x.b === b) + 1];
      const until = next ? next.t0 + X.badge.fade : Infinity;
      parts.push({ el, seek(t) { if (t >= until) setStyle(el, 'display', 'none'); else popAt(el, t - t0); } });
    } else if (b.do === 'tag') {
      const T = A.tag; const stamp = b.style === 'stamp';
      const text = String(b.text ?? '').trim();
      if (!text) { S.warn('picture: a tag needs its text'); continue; }
      const wide = (c) => measureText(text, fontFor(c, fonts.weight.heavy), T.tracking);
      let cap = stamp ? T.stamp.cap : T.chip.cap;
      if (!stamp && wide(cap) + 2 * T.chip.padX * cap > T.maxW) cap = Math.max(T.minCap, cap * T.maxW / (wide(cap) + 2 * T.chip.padX * cap));
      let hgt = stamp ? T.stamp.h : T.chip.h * cap, padX = stamp ? T.stamp.padX : T.chip.padX * cap;
      let w = wide(cap) + 2 * padX;
      if (w > T.widest) { const k = T.widest / w; cap *= k; hgt *= k; padX *= k; w = T.widest; }
      const node = tagNode(S, text, { stamp, cap });
      // tagNode's proportions are one general fit; the two tags the reference shows are set from their own numbers
      Object.assign(node.style, { height: `${hgt.toFixed(1)}px`, lineHeight: `${hgt.toFixed(1)}px`, padding: `0 ${padX.toFixed(1)}px`, borderRadius: `${(hgt * (stamp ? T.stamp.radius : T.chip.radius)).toFixed(1)}px`, boxSizing: 'border-box', width: `${w.toFixed(1)}px`, textAlign: 'center' });
      if (stamp) { node.style.background = T.stamp.fill; node.style.color = colour.cream; }   // the reference's stamp is cream text in the accent outline
      let x, y;
      if (stamp) { x = obj.l + T.stamp.u * ow - w / 2; y = obj.t + T.stamp.v * oh - hgt / 2; }
      else { x = obj.botL + T.chip.left; y = obj.b + T.chip.below - hgt; }
      x = clampTo(x, A.safe.l, A.safe.r - w);
      const el = wrapAt(x, y, w, hgt, node);
      parts.push({ el, seek(t) { tagAt(node, t - t0); } });
    } else if (b.do === 'chip') {
      const C = A.chip;
      const label = b.label ? String(b.label).trim() : '';
      const img = b.image && images.get(b.image) && images.get(b.image).kind === 'image' ? images.get(b.image) : null;
      if (b.image && !img) S.warn(`picture: the chip's mark ${String(b.image).split('/').pop()} could not be shown`);
      if (!label && !img) { S.warn('picture: a chip needs a label or a mark'); continue; }
      const tile = nameTile(S, label, img);
      let x, y;
      if (b.place === 'between') { x = (obj.l + obj.r) / 2 - tile.w / 2; y = obj.t + C.between.top; }
      else { x = obj.l + C.corner.left; y = obj.t + C.corner.top; }
      x = clampTo(x, A.safe.col[0], A.safe.col[1] - tile.w); y = Math.max(y, minTop);
      const el = wrapAt(x, y, tile.w, C.h, tile.el);
      parts.push({ el, seek(t) { const a = t - t0; setStyle(tile.el, 'display', a < 0 ? 'none' : ''); if (a >= 0) applyState(tile.el, enterAt(S, a, motion.enter.presets.chip), '50% 50%'); } });
    } else if (b.do === 'bubble') {
      const state = b.state === 'talking' ? 'talking' : 'waiting';
      if (bubble) { bubble.changes.push({ t0, state }); continue; }
      const B = A.bubble;
      const node = bubbleNode(S);
      const x = clampTo(obj.r + B.gap, A.safe.col[0], A.safe.col[1] - B.w), y = Math.max(minTop, obj.t + B.down);
      if (corner.length && x < obj.r) S.warn('picture: the bubble and a corner badge share the top-right corner; use one of them, or a narrower picture');
      const el = wrapAt(x, y, B.w, B.h, node.el);
      const changes = [{ t0, state }];
      const dim = hexToRgb(B.dot.dim), lit = hexToRgb(colour.cream);
      bubble = { changes };
      parts.push({ el, seek(t) {
        const a = t - t0;
        setStyle(node.el, 'display', a < 0 ? 'none' : '');
        if (a < 0) return;
        applyState(node.el, enterAt(S, a, motion.enter.presets.chip), '50% 50%');
        // the state now, and how far the swap from the one before has come [M17]
        let k = 0; while (k + 1 < changes.length && t >= changes[k + 1].t0) k++;
        const talking = changes[k].state === 'talking';
        const mix = k === 0 ? 1 : Math.min(1, (t - changes[k].t0) / motion.toggle);
        const showDots = !talking || (mix < 1 && changes[k - 1].state !== 'talking'), showBars = talking || (mix < 1 && changes[k - 1].state === 'talking');
        setStyle(node.dotsWrap, 'display', showDots ? '' : 'none'); setStyle(node.barsWrap, 'display', showBars ? '' : 'none');
        if (showDots) {
          setStyle(node.dotsWrap, 'opacity', talking ? (1 - mix).toFixed(3) : mix >= 1 ? '' : mix.toFixed(3));
          // the waiting dots [X24]: one round every 22 frames, counted from the bubble's own start, stopped by the exit
          const tt = Math.min(t, tOut) - t0 - B.dot.first;
          node.dots.forEach((dot, i) => {
            const u = (((tt - i * B.dot.lag) % B.dot.every) + B.dot.every) % B.dot.every / B.dot.pulse;
            const lv = tt >= i * B.dot.lag && u < 1 ? 0.5 - 0.5 * Math.cos(2 * Math.PI * u) : 0;
            setStyle(dot, 'background', lv <= 0.004 ? B.dot.dim : mixHex(dim, lit, lv));
          });
        }
        if (showBars) {
          setStyle(node.barsWrap, 'opacity', talking ? (mix >= 1 ? '' : mix.toFixed(3)) : (1 - mix).toFixed(3));
          const from = talking ? changes[k].t0 : changes[k - 1].t0;
          const n = Math.max(0, Math.floor((Math.min(t, tOut) - from) / B.bar.every + 1e-6));
          node.bars.forEach((bar, i) => {
            const hh = B.bar.min + B.bar.step * Math.floor(noise(n % 3, i + Math.floor(n / 3)) * B.bar.steps);
            setStyle(bar, 'height', `${hh}px`); setStyle(bar, 'top', `${(B.h - hh) / 2}px`);
          });
        }
      } });
    }
  }
  return parts;
}

export default {
  type: 'picture',
  label: 'Picture',
  slots: ['graphic'],
  params: {
    src: 'asset',                                   // png, jpg or webp; or a clip (mp4, mov, webm)
    frame: 'enum?:none|card',                       // none: on the field (needs transparency or a dark ground). card: a rounded card. Left out: the picture decides
    label: { type: 'string', optional: true, maxChars: 14, maxWords: 2 },   // set in upper case above the picture
    look: 'enum?:halftone|plain',                   // left out: a shaded still cut-out is printed as a house halftone, flat art is kept. halftone or plain: always
  },
  beats: {
    // each lands on the word that states it; the picture is there first [X01, X07]
    badge: { kind: 'enum:check|cross|lock|unlock|offline', place: 'enum?:corner|centre' },   // corner (default): the object's top-right corner. centre: it cancels or completes the object
    tag: { text: { type: 'string', maxChars: 8, maxWords: 1 }, style: 'enum?:chip|stamp' },    // chip (default): a price or a count, as said, on the bottom-left corner. stamp: one word in an outline
    chip: {
      label: { type: 'string', optional: true, maxChars: 12, maxWords: 2 },   // a short name; 12 characters make a tile about 430 px wide
      image: 'asset?',                                                        // the user's own mark, in front of the name or alone (a wide mark reads best alone)
      place: 'enum?:corner|between',                                          // corner (default): over the top-left corner. between: centred at the top, between two things
    },
    bubble: { state: 'enum?:waiting|talking' },     // waiting (default): three dots. talking: bars. The first beat brings the bubble, a later one changes it
  },

  async prepare(params, S) {
    const m = await loadMedia(S, params.src);
    // marks for chips: only the beats of the scene the picture arrives in are known here
    const images = new Map();
    await Promise.all((params.beats || []).filter((b) => b && b.do === 'chip' && b.image && !images.has(b.image)).map(async (b) => { images.set(b.image, null); images.set(b.image, await loadMedia(S, b.image)); }));
    const ground = groundOf(m);
    return { m, ground, shape: shapeOf(m), flat: ground === 'cutout' && flatOf(m), images };
  },

  build(ctx) {
    const { S, params: p, tIn, data, mode } = ctx; const { h } = S.kit;
    const { m, ground } = data;
    const name = String(p.src).split('/').pop();
    let frame = p.frame || (ground === 'light' || m.kind === 'video' ? 'card' : 'none');
    if (frame === 'none' && ground === 'light') { S.warn(`picture: ${name} has a light opaque ground, so it is shown on a card. Only a cut-out or a dark picture can sit on the field.`); frame = 'card'; }
    const kind = frame === 'none' ? 'bare' : ground === 'cutout' ? 'item' : 'paper';

    const label = p.label ? String(p.label).trim() : '';
    const head = label ? LABEL_H : 0;
    const key = mode === 'full' ? 'full' : 'split';
    const maxH = Math.min(roomOf(ctx), kind === 'bare' ? P.bare.maxH[key] : kind === 'item' ? P.item.h : P.paper.maxH[key]) - head;
    let w, hh;
    if (kind === 'item') { w = P.item.w; hh = maxH; }
    else { const s = Math.min(P.bare.maxW / m.w, maxH / m.h); w = m.w * s; hh = m.h * s; }
    const box = place(ctx, w, head + hh);
    const x = box.x, y = box.y + head;

    const root = h('div.eb-picture', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
    if (label) root.append(labelNode(S, label, box.y));

    // a still cut-out is printed in the house look: cream dots on a ground of the colour it sits on, the screen
    // made at the picture's size on the frame [R05, R09]
    const hex = (c) => c.match(/[0-9a-f]{2}/gi).map((v) => parseInt(v, 16));
    const screened = (pw, ph, ground2) => {
      if (m.kind !== 'image' || ground !== 'cutout' || p.look === 'plain' || (data.flat && p.look !== 'halftone')) return null;
      const c = printHouse(m.img, pw, ph, ground2);
      Object.assign(c.style, { position: 'absolute', left: '0', top: '0', width: `${pw.toFixed(2)}px`, height: `${ph.toFixed(2)}px`, display: 'block' });
      return { el: c, seek() {}, settled: () => Promise.resolve() };
    };
    let view;
    if (kind === 'item') {
      // the cut-out keeps its shape inside the card; the inner box shrinks with a shorter card
      const k = hh / P.item.h;
      const s = Math.min(P.item.inner.w / m.w, P.item.inner.h * k / m.h);
      const iw = m.w * s, ih = m.h * s;
      view = screened(iw, ih, hex(colour.card.raised)) || mediaView(S, m, iw, ih, { fit: 'contain', t0: tIn });
      const plate = card(S, { x, y, w, h: hh, kind: 'dark', fill: colour.card.raised });
      plate.style.borderRadius = `${P.item.radius}px`;
      plate.append(h('div', { style: { position: 'absolute', left: `${((w - iw) / 2).toFixed(2)}px`, top: `${((hh - ih) / 2).toFixed(2)}px`, width: `${iw.toFixed(2)}px`, height: `${ih.toFixed(2)}px`, filter: P.item.shadow } }, view.el));
      root.append(plate);
      if (m.kind === 'image' && s > P.softAbove) S.warn(`picture: ${name} is enlarged ${s.toFixed(1)} times and will look soft; supply a larger file`);
    } else {
      view = (kind === 'bare' && screened(w, hh, hex(colour.field))) || mediaView(S, m, w, hh, { fit: 'cover', t0: tIn });
      if (kind === 'paper') {
        const plate = card(S, { x, y, w, h: hh, kind: 'paper', fill: colour.field });
        plate.append(view.el);
        if (ground === 'dark') plate.append(h('div', { style: { position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', borderRadius: 'inherit', boxShadow: `inset 0 0 0 2px ${P.paper.darkStroke}` } }));
        root.append(plate);
      } else {
        const f = P.bare.feather;
        const ramp = (to) => `linear-gradient(to ${to}, rgba(0,0,0,0) 0px, #000 ${f}px, #000 calc(100% - ${f}px), rgba(0,0,0,0) 100%)`;
        const mask = ground === 'cutout' ? {} : { WebkitMaskImage: `${ramp('right')}, ${ramp('bottom')}`, maskImage: `${ramp('right')}, ${ramp('bottom')}`, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' };
        root.append(h('div', { style: { position: 'absolute', left: `${x.toFixed(2)}px`, top: `${y.toFixed(2)}px`, width: `${w.toFixed(2)}px`, height: `${hh.toFixed(2)}px`, overflow: 'hidden', ...mask } }, view.el));
      }
      if (m.kind === 'image' && w / m.w > P.softAbove) S.warn(`picture: ${name} is enlarged ${(w / m.w).toFixed(1)} times and will look soft; supply a larger file`);
    }

    // what lands on the picture [X18, R31]: the object is the card, or what is opaque in a cut-out
    const sh = kind === 'bare' && ground === 'cutout' ? data.shape : { l: 0, t: 0, r: 1, b: 1, topL: 0, topR: 1, botL: 0 };
    const obj = { l: x + sh.l * w, r: x + sh.r * w, t: y + sh.t * hh, b: y + sh.b * hh, topL: x + sh.topL * w, topR: x + sh.topR * w, botL: x + sh.botL * w, card: kind !== 'bare' };
    const notes = ctx.beats.length ? annotations(ctx, obj, data.images) : [];
    for (const n of notes) root.append(n.el);

    return {
      el: root, box: { x, y: box.y, w, h: head + hh },
      seek(t) { view.seek(t, true); for (const n of notes) n.seek(t); },
      settled: () => view.settled(),
    };
  },
};
