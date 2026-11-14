// "One of N in a series" (research/graphics.md G18, type.md T27, motion.md M16, M17, colour.md C14):
// the count as one big cream figure over a grid of N small dark tiles, with the current one, or the
// first K, in the accent colour.
//   total            N tiles under the figure "N"
//   current: k       tile k turns accent once the grid has landed
//   done: k          tiles 1 to k turn accent one after another and the figure reads "k of N"
// Up to 12 tiles arrive one by one in reading order, a frame apart, and the figure arrives with the last
// one; a larger grid arrives whole together with its figure. The accent comes on within 2 frames, with no
// blur. The figure does not count up: it is a small number, said once.
// The tiles are plain: the reference draws a line icon in each tile of an 11-tile grid and none in its
// 25-tile grid; the style ships no icons.
import { motion, fonts, colour, F } from '../tokens.js';
import { place, enterAt, applyState, setStyle, measureText, fontFor, sizeForCap } from '../common.js';

// TOKENS (research/graphics.md G18; measured on settled frames)
const G = {
  span: 960,                                // a full row runs x 60 to 1020 (clip34@1120) [G04]
  // tile side and gap: 140 and 24 with 6 across (clip34@1120), 84 and 12 in the 25-tile grid (clip38@1240);
  // the gap follows the side on the line through both: gap = 24 - (140 - side) * 12 / 56
  tileMax: 140, gapAt: [140, 24, 84, 12],
  // corner radius of the side: the accent tile's fit reads 34.3 on 140 (clip34@1120) and 20.3 on 84
  // (clip38@1240); the dark tiles' corners are a little tighter, 31.1 on 140
  radius: { dark: 0.226, accent: 0.236 },
  stroke: 2,                                // inside the tile's box, the dark cards' stroke colour (both clips)
  gridMaxH: 304,                            // by eye: the grid is never taller than the reference's two rows of 140
  // clip34@1120: digits 205.5 px tall, baseline 68.8 px above the grid (226.8 px digits in clip31@770 and
  // clip37@845, which set a label or a mark between figure and grid). The stems of "11" stand 101.6 px apart
  // at 205.5 and 112.0 at 226.8: tracking -0.04 on all three, tighter than type.figure.tracking
  figure: { cap: 205.5, gap: 69, maxW: 960, tracking: -0.04 },
  // " of " in "3 of 25" (clip38@1240, digits 107.5 px): light, muted, 0.48 of the digits' size, between plain
  // spaces that the digits' tracking does not pull in; the ink gaps are 20.5 px before and 19.5 px after, which
  // is 0.012 of the digits' size closer on the left and 0.024 wider on the right than the plain spaces give
  of: { size: 0.48, before: -0.012, after: 0.024 },
  // dark tiles: black 0.42, sigma 14 px, 6 px down (fit under two tiles of clip34@1120); scales with the side
  shadow: { y: 6, blur: 28, a: 0.42 },
  // the accent tile glows downward: accent 0.36, sigma 13 px, 21 px down, 8 px narrower each side
  // (fit below and beside the tile of clip34@1120; the 84 px tiles of clip38@1240 show none)
  glow: { y: 21, blur: 26, spread: -8, a: 0.36 },
  stagger: F(1),                            // tiles of one grid start 1.0 frame apart (clip34@1091-1102, clip37@786-796, clip31@706-716)
  staggerMax: 12,                           // by eye: above this the grid arrives whole (11 tiles are staggered, 25 are not)
  accentLag: F(5),                          // the accent comes on 5 frames after the last tile starts (clip37@797, clip31@720, clip38@1207)
  doneSweep: F(20),                         // by eye: the first K take at most this long to light up, one per stagger (clip38: 2.5 frames apart)
};

/** Columns, tile side and gap for n tiles: the largest tile that keeps the grid inside span x gridMaxH. */
export function gridFor(n) {
  const [s1, g1, s2, g2] = G.gapAt;
  const k = (g1 - g2) / (s1 - s2), c0 = g1 - k * s1;        // gap = k * side + c0
  let best = null;
  for (let cols = 1; cols <= n; cols++) {
    const rows = Math.ceil(n / cols);
    const side = Math.min(G.tileMax, (G.span - c0 * (cols - 1)) / (cols + k * (cols - 1)));
    const gap = Math.max(4, k * side + c0);
    const hh = rows * side + (rows - 1) * gap;
    if (hh > G.gridMaxH + 0.5) continue;
    if (rows > 1 && n - (rows - 1) * cols < cols / 2) continue;   // by eye: the last row is at least half full
    // the largest tile wins; on a tie fewer rows, then fewer columns (7 tiles make 4 + 3, not 6 + 1)
    if (!best || side > best.side + 0.01 || (side > best.side - 0.01 && rows < best.rows)) best = { cols, rows, side, gap, w: cols * side + (cols - 1) * gap, h: hh };
  }
  return best;
}

/** Side bearings of one glyph in px, from the canvas: the figure is centred on its ink, as the reference's is. */
let pen = null;
function bearings(ch, font) {
  pen = pen || document.createElement('canvas').getContext('2d');
  pen.font = font;
  const m = pen.measureText(ch);
  return { left: -m.actualBoundingBoxLeft, right: m.width - m.actualBoundingBoxRight };
}

const rgba = (hexc, a) => { const [r, g, b] = hexc.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16)); return `rgba(${r},${g},${b},${a})`; };

export default {
  type: 'icon-grid',
  label: 'Series grid',
  slots: ['graphic'],
  ownEntrance: true,
  params: {
    total: { type: 'number', min: 2, max: 60 },                    // N: how many there are in the series
    current: { type: 'number', optional: true, min: 1, max: 60 },  // "this is number k": that one tile in the accent colour
    done: { type: 'number', optional: true, min: 1, max: 60 },     // "k of N": the first k tiles in the accent colour. Not with current
  },
  beats: {},

  build(ctx) {
    const { S, params: p, tIn } = ctx; const { kit } = S; const { h } = kit;
    const n = Math.max(2, Math.min(60, Math.round(p.total)));
    let current = p.current, done = p.done;
    if (current !== undefined && done !== undefined) { S.warn('icon-grid: give current or done, not both; current was kept'); done = undefined; }
    if (current !== undefined && current > n) { S.warn(`icon-grid: current ${current} is past the total ${n}`); current = n; }
    if (done !== undefined && done > n) { S.warn(`icon-grid: done ${done} is past the total ${n}`); done = n; }

    const g = gridFor(n);
    const FG = G.figure;
    // ---- the figure
    const lead = done !== undefined ? String(done) : String(n);
    const tail = done !== undefined ? String(n) : '';
    const W8 = fonts.weight.heavy;
    const ofFont = (cap) => `${fonts.weight.light} ${(sizeForCap(cap, W8) * G.of.size).toFixed(2)}px ${fonts.sans}`;
    // the tracking that trails the first number is given back before " of "
    const ofMargins = (sz) => [(-FG.tracking + G.of.before) * sz, G.of.after * sz];
    const widthAt = (cap) => measureText(lead + tail, fontFor(cap, W8), FG.tracking) + (tail ? measureText(' of ', ofFont(cap)) + (G.of.before + G.of.after) * sizeForCap(cap, W8) : 0);
    let cap = FG.cap;
    if (widthAt(cap) > FG.maxW) cap *= FG.maxW / widthAt(cap);
    const size = sizeForCap(cap, W8);
    const total = cap + FG.gap + g.h;
    const box = place(ctx, G.span, total);
    const root = h('div.eb-icon-grid', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${G.span}px`, height: `${total}px`, transformOrigin: '0 0', transform: box.s === 1 ? '' : `scale(${box.s})` } });

    // centred on the ink: half of the tracking that trails the last digit is taken back, and so is half of the
    // difference between the first digit's left bearing and the last digit's right bearing (a "1" has 4 px and 18 px)
    const whole = lead + tail;
    const font = fontFor(cap, W8);
    const nudge = (FG.tracking * size) / 2 + (bearings(whole[whole.length - 1], font).right - bearings(whole[0], font).left) / 2;
    const fig = h('div', { style: { position: 'absolute', left: `${(G.span / 2 + nudge).toFixed(2)}px`, top: `${(cap - size * fonts.M.base).toFixed(2)}px`, transform: 'translateX(-50%)', whiteSpace: 'pre',
      font: `${W8} ${size.toFixed(2)}px/1 ${fonts.sans}`, letterSpacing: `${FG.tracking}em`, color: colour.cream } }, h('span', { text: lead }));
    if (tail) {
      const [ml, mr] = ofMargins(size);
      fig.append(h('span', { text: ' of ', style: { font: ofFont(cap).replace('px ', 'px/1 '), letterSpacing: '0', color: colour.muted, marginLeft: `${ml.toFixed(2)}px`, marginRight: `${mr.toFixed(2)}px` } }), h('span', { text: tail }));
    }
    const figWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${G.span}px`, height: `${cap}px`, transformOrigin: `${G.span / 2}px ${cap / 2}px` } }, fig);
    root.append(figWrap);

    // ---- the grid; a short last row is centred (6 + 5 in the reference)
    const k = g.side / G.tileMax;
    const shadow = `0 ${(G.shadow.y * k).toFixed(1)}px ${(G.shadow.blur * k).toFixed(1)}px rgba(0,0,0,${G.shadow.a})`;
    const glow = `0 ${(G.glow.y * k).toFixed(1)}px ${(G.glow.blur * k).toFixed(1)}px ${(G.glow.spread * k).toFixed(1)}px ${rgba(colour.accent, G.glow.a)}`;
    const radius = `${(g.side * G.radius.dark).toFixed(2)}px`, radiusOn = `${(g.side * G.radius.accent).toFixed(2)}px`;
    const staggered = n <= G.staggerMax;
    const y0 = cap + FG.gap, x0 = (G.span - g.w) / 2;
    const gridWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${G.span}px`, height: `${total}px`, transformOrigin: `${G.span / 2}px ${y0 + g.h / 2}px` } });
    root.append(gridWrap);
    const tLast = tIn + (staggered ? (n - 1) * G.stagger : 0);
    // the figure is half way in when the last tile is (clip34@1102): it starts a frame before that tile
    const tFig = Math.max(tIn, tLast - G.stagger);
    const lit = done !== undefined ? done : current !== undefined ? 1 : 0;
    const litGap = lit > 1 ? Math.min(motion.stagger, G.doneSweep / lit) : 0;
    const tiles = [];
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / g.cols), c = i % g.cols;
      const inRow = Math.min(g.cols, n - r * g.cols);
      const x = x0 + (g.w - (inRow * g.side + (inRow - 1) * g.gap)) / 2 + c * (g.side + g.gap);
      const y = y0 + r * (g.side + g.gap);
      const el = h('div.eb-grid-tile', { style: { position: 'absolute', left: `${x.toFixed(2)}px`, top: `${y.toFixed(2)}px`, width: `${g.side.toFixed(2)}px`, height: `${g.side.toFixed(2)}px`, borderRadius: radius,
        background: colour.card.fill, boxShadow: `inset 0 0 0 ${G.stroke}px ${colour.card.stroke}, ${shadow}` } });
      const order = done !== undefined ? (i < done ? i : -1) : i + 1 === current ? 0 : -1;
      let on = null;
      if (order >= 0) {
        on = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', borderRadius: radiusOn, background: colour.accent, boxShadow: glow, opacity: '0' } });
        el.append(on);
      }
      gridWrap.append(el);
      tiles.push({ el, t0: tIn + (staggered ? i * G.stagger : 0), on, tOn: order >= 0 ? tLast + G.accentLag + order * litGap : null });
    }

    return {
      el: root, box,
      seek(t) {
        applyState(figWrap, enterAt(S, t - tFig));
        if (!staggered) applyState(gridWrap, enterAt(S, t - tIn));
        for (const tile of tiles) {
          if (staggered) {
            const a = t - tile.t0;
            setStyle(tile.el, 'display', a < 0 ? 'none' : '');
            if (a < 0) continue;
            applyState(tile.el, enterAt(S, a, motion.enter.presets.tile));
          }
          // a state change inside a held graphic: 1 to 2 frames, no blur [M17]
          if (tile.on) setStyle(tile.on, 'opacity', String(kit.clamp((t - tile.tOn) / motion.toggle).toFixed(3)));
        }
      },
    };
  },
};
