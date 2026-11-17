// A short text card whose words come in one at a time (research/explain.md X53 "a thing named", X61, X75;
// devices medallion_title and name_sign). A title is never typed letter by letter [X75, X78].
//
// kind 'title' (medallion_title, clip07@378-400): a serif title under an optional medallion. Each word appears
// at its final place, at 0.7 contrast on its first frame and full on the next, rising from 24 px below on the
// house ease-out over 12 frames (24, 13, 7, 4, 2, 1, 0 px); words 4 frames apart (385, 389, 393, 397), the first
// 7 frames after the cut [X61, X75]. Measured: cap height 69 px (98 px serif), lines 104 px apart, centred on
// x 540, ink #121413; the medallion a white decagon 483 x 492 px with a 12 px tinted rim, 44 px above the
// first cap line.
// kind 'sign' (name_sign, clip12@121-184): a red marquee board with bulbs round its edge hanging on two
// strings; the name's words are dim until each is spoken, then light white with a glow on one frame, on the
// word's onset (-2..+2 frames) [X75]. Board 904 x 647 px (x 87-991, y 284-931); each line of the name fills
// the board's width in a heavy condensed sans.
import { F, CX, fonts, colour, motion } from '../tokens.js';
import { place, setStyle, clamp01, measureText } from '../common.js';
import { plateIsDark } from '../plate.js';
import { hexOr } from './ui-kit.js';

// TOKENS (research/explain.md X61, X75; measured clip07@378-400 and clip12@119-168 unless marked)
const T = {
  size: 98, pitch: 104,          // cap 69 px / PT Serif cap 0.700; baselines 763 and 866 (clip07@400)
  maxW: 920,                     // a line's width before it wraps (by eye; the reference line is 649 px)
  ink: '#121413',                // calibrated title ink (clip07@400)
  rise: 24, riseDur: motion.prop.dur,   // 24 px below on the first frame, the house ease over 12 frames (clip07@385-394)
  first: 0.7,                    // contrast on the first frame (clip07@385, @389)
  lead: F(7),                    // first word 7 frames after the cut (378 -> 385)
  gap: motion.prop.stagger,      // words 4 frames apart [X61]
  medal: { w: 483, h: 492, rim: 12, rimColour: '#BDD1CA', gap: 44 },   // clip07@400 (rim tint is the plate's hue there; by eye in general)
};
// the reference titles are a regular-weight serif; the pack ships PT Serif Bold only, so titles use it (owner's
// decision 2026-11-16: no second serif file)
const SERIF = fonts.serif;
const SIGN = {
  w: 904, h: 647, radius: 22,               // board (clip12@165); radius by eye
  y: 284,                                   // the board hangs low in the panel: top y 284, bottom 931 (clip12@165)
  top: '#CD102C', bottom: '#B90121',        // board gradient, calibrated (clip12@129)
  rim: 'rgba(90,0,12,0.45)', rimW: 6,        // the darker edge (by eye)
  dim: '#900019',                            // unlit letters, calibrated (clip12@129)
  glow: '0 0 8px rgba(255,236,225,0.95), 0 0 26px rgba(255,170,140,0.9), 0 0 60px rgba(255,115,90,0.6)',   // lit letters: a wide warm halo (by eye on clip12@165)
  pad: { x: 45, y: 118 }, lineGap: 0.2,      // name 815 px wide in the 904 board; caps 205 + 145 px, 56 px apart, in 407 px (clip12@165)
  condense: 0.66, weight: 900,               // Inter has no condensed width: heavy weight squeezed horizontally (by eye)
  bulb: { d: 26, pitch: 70, lit: '#FFF4C4', off: '#B8975A', halo: '0 0 14px 5px rgba(255,236,170,0.7)', chase: 3 },   // clip12@147-165; chase by eye
  string: { w: 3, colour: '#4A4D55', at: 0.13 },   // strings at 13 % in from each side (clip12@126)
  lead: F(9),                                // without beats, the first word lights 9 frames after the cut (121 -> 130)
};

/** A decagon with flat top and bottom edges and points at the sides, filling w x h (clip07@400). */
function decagon(w, h) {
  const pts = [], k = Math.sin((2 * Math.PI) / 5);
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI * 2 * i) / 10;
    pts.push(`${(w / 2 + (w / 2) * Math.cos(a)).toFixed(1)},${(h / 2 + ((h / 2) * Math.sin(a)) / k).toFixed(1)}`);
  }
  return pts.join(' ');
}

/** Break words into the fewest lines that fit maxW, then even the lines out (the reference's two lines are 619 and 649 px). */
function balance(words, maxW, width) {
  const n = words.length;
  let lines = 1, x = 0;
  for (const w of words) { const ww = width(w); if (x && x + width(' ') + ww > maxW) { lines++; x = ww; } else x += (x ? width(' ') : 0) + ww; }
  lines = Math.min(lines, n, 4);
  let best = null;
  const rec = (i, left, acc) => {
    if (left === 1) { const l = [...acc, words.slice(i)]; const m = Math.max(...l.map((q) => width(q.join(' ')))); if (!best || m < best.m) best = { l, m }; return; }
    for (let j = i + 1; j <= n - left + 1; j++) rec(j, left - 1, [...acc, words.slice(i, j)]);
  };
  rec(0, lines, []);
  return best ? best.l : [words];
}

export default {
  type: 'title-card',
  label: 'Title card',
  slots: ['graphic'],
  params: {
    text: { type: 'string', maxChars: 40, maxWords: 7 },     // the title or the name
    kind: 'enum?:title|sign',                                 // a serif title (default) or a marquee name sign [X75]
    mark: { type: 'string', optional: true, maxChars: 2 },    // title: a monogram on a medallion above it
    accent: { type: 'string', optional: true, maxChars: 7 },  // sign: the board colour (#RRGGBB)
  },
  beats: {
    word: {},           // the next word comes in (title) or lights (sign), on its spoken word [X75]
  },
  build(ctx) {
    const { S, params, beats, tIn, mode } = ctx;
    const { h } = S.kit;
    const words = String(params.text || '').trim().split(/\s+/).filter(Boolean);
    const sign = params.kind === 'sign';
    const wb = beats.filter((b) => b.do === 'word').map((b) => b.t);
    const lead = sign ? SIGN.lead : T.lead;
    const at = words.map((_, i) => (i < wb.length ? wb[i] : (wb.length ? wb[wb.length - 1] : tIn + lead - T.gap) + (i - wb.length + 1) * T.gap));
    if (wb.length > words.length) S.warn(`title-card: ${wb.length} word beats for ${words.length} words`);
    const el = h('div.pr-title-card', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } });
    return sign ? buildSign(ctx, el, words, at) : buildTitle(ctx, el, words, at);
  },
};

function buildTitle(ctx, el, words, at) {
  const { S, params } = ctx;
  const { h } = S.kit;
  const font = `700 ${T.size}px/1 ${SERIF}`;
  const lines = balance(words, T.maxW, (str) => measureText(str, font));
  const medal = params.mark ? T.medal : null;
  const textH = (lines.length - 1) * T.pitch + T.size * 0.97;   // cap top of line 1 to the descenders of the last
  const H = (medal ? medal.h + medal.gap : 0) + textH;
  const W = Math.max(medal ? medal.w : 0, ...lines.map((ln) => measureText(ln.join(' '), font)));
  const box = place(ctx, W, H);
  const s = box.s;
  const ink = plateIsDark(params.plate, params.field) ? colour.white : T.ink;
  const inner = h('div', { style: { position: 'absolute', left: '0', top: `${box.y}px`, width: '1080px', height: `${H}px`, transform: s < 0.999 ? `scale(${s})` : '', transformOrigin: `${CX}px 0` } });
  el.append(inner);
  if (medal) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', medal.w); svg.setAttribute('height', medal.h); svg.setAttribute('viewBox', `0 0 ${medal.w} ${medal.h}`);
    Object.assign(svg.style, { position: 'absolute', left: `${CX - medal.w / 2}px`, top: '0', overflow: 'visible' });
    const poly = document.createElementNS(NS, 'polygon');
    const r = medal.rim / 2;
    poly.setAttribute('points', decagon(medal.w - medal.rim, medal.h - medal.rim));
    poly.setAttribute('transform', `translate(${r} ${r})`);
    Object.assign(poly.style, { fill: '#FFFFFF', stroke: T.medal.rimColour, strokeWidth: `${medal.rim}px`, strokeLinejoin: 'round' });
    svg.append(poly);
    inner.append(svg, h('div', { text: params.mark, style: { position: 'absolute', left: `${CX - medal.w / 2}px`, width: `${medal.w}px`, top: `${medal.h / 2 - 115}px`, textAlign: 'center',
      font: `700 230px/230px ${SERIF}`, color: T.ink } }));
  }
  const y0 = (medal ? medal.h + medal.gap : 0) - T.size * (fonts.serifM.base - fonts.serifM.cap);   // line box top so the cap line sits at y0 + gap
  const spans = [];
  let k = 0;
  lines.forEach((ln, li) => {
    const row = h('div', { style: { position: 'absolute', left: '0', width: '1080px', top: `${(y0 + li * T.pitch).toFixed(1)}px`, textAlign: 'center', font, color: ink, whiteSpace: 'nowrap' } });
    ln.forEach((w, wi) => {
      const sp = h('span', { text: w, style: { display: 'inline-block', opacity: '0' } });
      row.append(sp); if (wi < ln.length - 1) row.append(document.createTextNode(' '));
      spans.push({ sp, t: at[k++] });
    });
    inner.append(row);
  });
  return {
    el, box,
    seek(t) {
      for (const { sp, t: t0 } of spans) {
        const a = t - t0;
        if (a < 0) { setStyle(sp, 'opacity', '0'); setStyle(sp, 'transform', ''); continue; }
        setStyle(sp, 'opacity', a >= F(1) - 1e-6 ? '' : String(T.first));
        const d = T.rise * (1 - S.E.out(clamp01(a / T.riseDur)));
        setStyle(sp, 'transform', d > 0.05 ? `translateY(${d.toFixed(2)}px)` : '');
      }
    },
  };
}

function buildSign(ctx, el, words, at) {
  const { S, params, mode } = ctx;
  const { h } = S.kit;
  // in the panel the board hangs at its measured height; full-frame it is placed like any graphic
  const box = mode === 'split' ? { x: CX - SIGN.w / 2, y: SIGN.y, w: SIGN.w, h: SIGN.h, s: 1 } : place(ctx, SIGN.w, SIGN.h);
  const s = box.s;
  const accent = hexOr(params.accent, null);
  const inner = h('div', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${SIGN.w}px`, height: `${SIGN.h}px`, transform: s < 0.999 ? `scale(${s})` : '', transformOrigin: '0 0' } });
  el.append(inner);
  // strings up to the top of the stage
  const up = box.y / s + 4;
  for (const fx of [SIGN.string.at, 1 - SIGN.string.at]) inner.append(h('div', { style: { position: 'absolute', left: `${SIGN.w * fx - SIGN.string.w / 2}px`, top: `${-up}px`, width: `${SIGN.string.w}px`, height: `${up + 10}px`, background: SIGN.string.colour } }));
  const board = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${SIGN.w}px`, height: `${SIGN.h}px`, borderRadius: `${SIGN.radius}px`,
    background: accent ? `linear-gradient(to bottom, ${accent}, ${accent})` : `linear-gradient(to bottom, ${SIGN.top}, ${SIGN.bottom})`,
    boxShadow: `inset 0 0 0 ${SIGN.rimW}px ${SIGN.rim}, ${colour.shadow.prop}` } });
  inner.append(board);
  // bulbs round the edge, centred on it
  const B = SIGN.bulb, bulbs = [];
  const nx = Math.round((SIGN.w - 2 * SIGN.radius) / B.pitch), ny = Math.round((SIGN.h - 2 * SIGN.radius) / B.pitch);
  const along = [];
  for (let i = 0; i <= nx; i++) along.push([SIGN.radius + (i * (SIGN.w - 2 * SIGN.radius)) / nx, 0]);
  for (let i = 1; i <= ny; i++) along.push([SIGN.w, SIGN.radius + (i * (SIGN.h - 2 * SIGN.radius)) / ny]);
  for (let i = nx - 1; i >= 0; i--) along.push([SIGN.radius + (i * (SIGN.w - 2 * SIGN.radius)) / nx, SIGN.h]);
  for (let i = ny - 1; i >= 1; i--) along.push([0, SIGN.radius + (i * (SIGN.h - 2 * SIGN.radius)) / ny]);
  for (const [x, y] of along) { const b = h('div', { style: { position: 'absolute', left: `${x - B.d / 2}px`, top: `${y - B.d / 2}px`, width: `${B.d}px`, height: `${B.d}px`, borderRadius: '50%' } }); inner.append(b); bulbs.push(b); }
  // the name: lines that each fill the board's width
  const up8 = words.map((w) => w.toUpperCase());
  const lineWords = up8.length <= 2 ? up8.map((w) => [w]) : [up8.slice(0, Math.ceil(up8.length / 2)), up8.slice(Math.ceil(up8.length / 2))];
  const iw = SIGN.w - 2 * SIGN.pad.x, ih = SIGN.h - 2 * SIGN.pad.y;
  const unit = (txt) => measureText(txt, `${SIGN.weight} 100px/1 ${fonts.sans}`) * SIGN.condense / 100;   // width per px of size
  let sizes = lineWords.map((lw) => iw / unit(lw.join(' ')));
  const capSum = sizes.reduce((a, b) => a + b * fonts.M.cap, 0) + (sizes.length - 1) * SIGN.lineGap * Math.max(...sizes);
  if (capSum > ih) sizes = sizes.map((z) => (z * ih) / capSum);
  const totalCap = sizes.reduce((a, b) => a + b * fonts.M.cap, 0) + (sizes.length - 1) * SIGN.lineGap * Math.max(...sizes);
  let y = (SIGN.h - totalCap) / 2;
  const spans = [];
  let k = 0;
  lineWords.forEach((lw, li) => {
    const z = sizes[li];
    const row = h('div', { style: { position: 'absolute', left: `${SIGN.w / 2}px`, top: `${(y - z * (fonts.M.base - fonts.M.cap)).toFixed(1)}px`, whiteSpace: 'nowrap',
      transform: `translateX(-50%) scaleX(${SIGN.condense})`, font: `${SIGN.weight} ${z.toFixed(1)}px/1 ${fonts.sans}`, letterSpacing: '-0.01em' } });
    lw.forEach((w, wi) => {
      const sp = h('span', { text: w, style: { color: SIGN.dim } });
      row.append(sp); if (wi < lw.length - 1) row.append(document.createTextNode(' '));
      spans.push({ sp, t: at[k++] });
    });
    board.append(row);
    y += z * fonts.M.cap + SIGN.lineGap * Math.max(...sizes);
  });
  return {
    el, box,
    seek(t) {
      for (const { sp, t: t0 } of spans) {
        const lit = t >= t0;
        setStyle(sp, 'color', lit ? '#FFFFFF' : SIGN.dim);
        setStyle(sp, 'textShadow', lit ? SIGN.glow : '');
      }
      const step = Math.floor((t * 29.97 + 1e-6) / B.chase);   // bulbs chase one step every 3 frames (by eye)
      bulbs.forEach((b, i) => {
        const on = (i + step) % 3 !== 0;
        setStyle(b, 'background', on ? B.lit : B.off);
        setStyle(b, 'boxShadow', on ? B.halo : 'none');
      });
    },
  };
}
