// "This one is faster / cheaper / better than that one": two contestants as two stacked dark cards
// (research/explain.md X16, X17, X21; explain-motion.md D15, D16, D28; measured on clip35@742-925, the
// one race card, and on clip35@246-262 for the dim). Each card has a name with an optional tile (the
// user's own mark, a glyph or initials), one big value and an optional second value.
//
// Two ways to show it, chosen by the plan's beats:
//   plain   no `race` beat: both values are shown as written. For a comparison whose numbers are not timings.
//   race    a `race` beat: both values start at zero and run. Both timers run linearly from the same frame;
//           the winner (the smaller value) stops hard at its value and is outlined on the same frame; the
//           other one is fast-forwarded to its own value on an ease-in curve over 17 frames and gets a grey
//           outline on the frame it stops. The second value of each card steps up as its progress lands and
//           stays muted until the `second` beat. With `progress` each card carries a 10 x 10 mosaic (full
//           layout: the pair is 1106 px tall) or a bar that fills so that its last part lands when its timer
//           stops.
// The final values are always the plan's, which are the speaker's numbers; the running values between zero
// and them are the only unspoken numbers on screen [X17].
//   count   the figure of `count` counts up above the cards and the mosaics arrive (the items both were given)
//   race    the timers start
//   win     the winner is outlined in the accent within one frame. In a race its timer stops on this word
//           (the timers then run at whatever rate lands it there; the reference runs 12 units a second, and
//           without a `win` beat the race runs at that rate). In plain mode the other card dims to 0.30. In a
//           race it does not: the reference keeps the slower card at full strength, because its number is the
//           point, and only marks it with a grey outline when it stops
//   second  the second values light up
// The reference card shows two products' marks, names and a mosaic of photographs: none of that is drawn here.
// The mosaic is 100 plain tiles that light up: it shows progress, whatever the count above says.
import { F, motion, fonts, colour, explain } from '../tokens.js';
import { place, enterAt, applyState, setStyle, expoInOut, measureText, fontFor, sizeForCap, fitCap } from '../common.js';
import { loadMedia } from '../media.js';
import { tileNode, GLYPH_NAMES } from '../marks.js';

// TOKENS (research/explain.md X21, explain-motion.md D15, D16; frame px, measured on clip35@760, @800, @900
// unless a line says otherwise). Positions inside a card are from the top-left corner of its fill.
const V = {
  w: 1000,                              // the fill is the column, x 40..1040
  gap: 26,                              // between the two fills: y 830 and 856
  radius: 36.5,                         // fit to the inner edge of the winner's outline
  fill: '#16171A',                      // both cards, before and after (#191713 measured; release palette [C26])
  stroke: { w: 2, c: '#1F2023' },       // outside the fill: #232321 at the top, #1E1B18 at the bottom: #21201D; release palette [C26]
  muted: '#A0A1A4',                     // names, values at zero, the second value: #A4A096 and #A6A197: #A5A197; release palette [C26]
  // the header: a mark 58 px tall with its top 26 px down, the name's ink 21 px right of it, cap height 37.5,
  // baseline 74 px down. Weight 600 by its stems
  head: { x: 32, top: 26, side: 58, gap: 21, cap: 37.5, base: 74, weight: fonts.weight.caption, tracking: -0.02 },
  // the big value: heavy, cap height 94 (digits 511..605), its text box 530 px in; a trailing unit of letters is set
  // at 0.49 of the size on the same baseline (the "s": x-height 32 px). Digits are proportional: the unit moves [D15]
  value: { cap: 94, tracking: -0.04, unit: 0.49, unitGap: 0.105, unitWeight: fonts.weight.caption },
  // the second value: weight 600 (stems 10.5 px on a 57 px cap), cap height 57 (669..726)
  second: { cap: 57, tracking: -0.031, weight: fonts.weight.caption },
  tall: { h: 540, valueX: 530, valueBase: 315, secondX: 530, secondBase: 437, maxW: 436 },
  // without a mosaic the card is not in the reference. By eye: the same header, the value under it at the left,
  // the second value on the same baseline at the right, the bar under both
  compact: { h: 262, hBar: 296, valueX: 30, valueBase: 216, secondRight: 968, maxW: 560, bar: { x: 32, y: 250, w: 936, h: 12 } },
  // the mosaic: 10 x 10 tiles on a 41.6 px pitch, 30 px in and 110 px down [D16]. The tiles are by eye: the
  // reference's are photographs with a 3 px outline; here a plain tile, dim until it lands
  mosaic: { x: 30, y: 110, n: 10, pitch: 41.6, tile: 37.6, radius: 6, off: '#717275', on: colour.cream },   // off: #737270 measured; release palette [C26]
  // the count above: heavy, cap height 149 (82..231), baseline 57 px above the upper fill
  count: { cap: 149, gap: 57, tracking: -0.04, maxW: 900 },
  outline: { w: 6 },                    // the winner: 6 px in the accent, hugging the fill (outer radius 42). On within one frame (clip35@857)
  done: { w: 3, c: '#4B4C4F' },         // the other card on the frame its timer stops (clip35@874: #4C4C4A; release palette [C26])
  light: F(3),                          // a value goes from muted to cream in 3 frames (clip35@815-818, @883-885)
  rate: explain.timer.rate,             // 12 units a second [D15, D28]
  rateRange: [5, 30],                   // by eye: outside this a running value is too slow or too fast to read as a timer
  forward: F(17),                       // the loser's fast-forward, power2.in (fitted 17.25 frames) [D15]
  // the winner's tiles follow quad.inOut over 1.083 of its race and the last one lands on the stop (fit: 45.5 frames
  // from 815.5 against a stop at 857). The loser's follow 6 frames behind at 0.67 of the rate (54 lit at the stop),
  // then catch up over the first half of the fast-forward (96 lit after 8 frames) and the last ones land one by one [D16]
  land: { stretch: 1.083, loserRate: 0.67, loserLag: F(6), catchUp: 0.5, catchTo: 0.96 },
  dim: { to: 0.30, dur: F(4) },         // plain mode: the rejected block drops to 0.30 in 4 frames (clip35@252-255: 236.6 to 82.2 on a field of 17)
  countLag: motion.stagger,             // the upper mosaic arrives 2 frames after the figure and the lower one 2 frames after that (clip35@766, @768, @770)
};

/**
 * "$1,204.50" -> { pre: '$', num: 1204.5, dec: 2, commas: true, post: '', unit: '', main: '$1,204.50' }.
 * A trailing unit of one to four letters ("17.0s", "3 min") is split off: it is set small. `main` is the
 * plan's own text without that unit, shown whenever the value is not running.
 */
function parseValue(s) {
  const str = String(s).trim();
  const m = /^([^\d]*?)(\d[\d,]*\.?\d*|\.\d+)(.*)$/.exec(str);
  if (!m) return null;
  const digits = m[2], rest = m[3];
  const unit = /^\s?[A-Za-z]{1,4}$/.test(rest) ? rest.trim() : '';
  return { pre: m[1], num: Number(digits.replace(/,/g, '')), dec: (digits.split('.')[1] || '').length, commas: digits.includes(','), post: unit ? '' : rest, unit, main: unit ? str.slice(0, str.length - rest.length) : str };
}
const fmt = (f, v) => {
  let s = v.toFixed(f.dec);
  if (f.commas) { const [a, b] = s.split('.'); s = a.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (b ? `.${b}` : ''); }
  return `${f.pre}${s}${f.post}`;
};
const lin = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** A box on whole pixels, so that strokes and edges stay sharp (an odd height centres on a half pixel). */
const snap = (b) => (b.s === 1 ? { ...b, x: Math.round(b.x), y: Math.round(b.y) } : b);
const quadInOut = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 2 * x * x : 1 - 2 * (1 - x) * (1 - x));
const sineInOut = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * x));
const hex = (c) => c.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16));
const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;

const SIDE = {
  name: { type: 'string', maxChars: 24 },                        // one line: 24 mixed-case characters are 575 px of the 857 beside a tile; a wider name is set smaller
  image: 'asset?',                                               // the contestant's own mark, on a small cream tile
  glyph: `enum?:${GLYPH_NAMES.join('|')}`,                       // or a line glyph on the tile
  initials: 'boolean?',                                          // or the name's initials on the tile. Without any of the three there is no tile
  value: { type: 'string', maxChars: 7 },                        // the speaker's number: "14.6s", "$40", "2 hr". A unit of up to 4 letters is set small. "1,204.5" is 412 px of the 436 beside a mosaic
  second: { type: 'string', optional: true, maxChars: 9 },       // a second number of the same contestant: "$0.0130" ("$1,000.00" is 364 px of 436)
};

export default {
  type: 'versus',
  label: 'Versus cards',
  slots: ['graphic'],
  params: {
    a: SIDE,                                                     // the upper card
    b: SIDE,                                                     // the lower card
    progress: 'enum?:mosaic|bar',                                // race only: what fills while the timers run. mosaic needs the full layout
    count: { type: 'string', optional: true, maxChars: 7 },      // how many items both were given, as said: "40", "1,250"
  },
  beats: {
    count: {},                                                   // the count figure counts up and the mosaics arrive
    race: {},                                                    // the timers start (the verb)
    win: { side: 'enum?:a|b' },                                  // the comparative word. side: who wins in plain mode (default a); in a race the smaller value wins
    second: {},                                                  // the second values light up
  },

  async prepare(params, S) {
    return { marks: await Promise.all([params.a, params.b].map((s) => (s && s.image ? loadMedia(S, s.image) : null))) };
  },

  build(ctx) {
    const { S, params: p, tIn, tOut, beats, data } = ctx; const { kit } = S; const { h } = kit;
    const sides = [p.a || {}, p.b || {}];
    const beat = (name) => beats.find((b) => b.do === name);
    const bCount = beat('count'), bRace = beat('race'), bWin = beat('win'), bSecond = beat('second');
    const vals = sides.map((s) => parseValue(s.value)), secs = sides.map((s) => (s.second ? parseValue(s.second) : null));
    let racing = !!bRace;
    if (racing && (!vals[0] || !vals[1])) { S.warn('versus: a race needs a number in both values; they are shown as written'); racing = false; }
    if (!bRace && p.progress) S.warn('versus: progress belongs to a race; add a race beat or leave it out');
    const progress = racing ? p.progress : undefined;
    const tall = progress === 'mosaic';
    const L = tall ? V.tall : V.compact;
    const cardH = tall ? V.tall.h : progress === 'bar' ? V.compact.hBar : V.compact.h;
    const countText = p.count ? String(p.count).trim() : '';
    const countCap = countText ? fitCap(countText, V.count.cap, fonts.weight.heavy, V.count.maxW, V.count.tracking) : 0;
    const headH = countText ? V.count.cap + V.count.gap : 0;
    const total = headH + 2 * cardH + V.gap;
    const box = snap(place(ctx, V.w, total));
    const root = h('div.eb-versus', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${V.w}px`, height: `${total}px`, transformOrigin: '0 0', transform: box.s === 1 ? '' : `scale(${box.s})` } });

    // ---- who wins, and when
    let winner = bWin && bWin.side === 'b' ? 1 : 0;
    if (racing) {
      const small = vals[1].num < vals[0].num ? 1 : 0;
      if (bWin && bWin.side && vals[0].num !== vals[1].num && winner !== small) S.warn('versus: in a race the smaller value stops first, so it wins; the side given was ignored');
      if (vals[0].num !== vals[1].num || !bWin) winner = small;
    }
    const tRace = racing ? Math.max(tIn, bRace.t) : null;
    let tWin = bWin ? bWin.t : null;
    let rate = V.rate;
    if (racing) {
      const natural = vals[winner].num / V.rate;
      if (tWin === null || tWin <= tRace + F(2)) { if (tWin !== null) S.warn('versus: the win beat must come after the race beat; the race runs at 12 units a second'); tWin = tRace + Math.max(F(2), natural); }
      rate = vals[winner].num / (tWin - tRace);
      if (rate < V.rateRange[0] || rate > V.rateRange[1]) S.warn(`versus: the timers run at ${rate.toFixed(1)} units a second (the reference runs 12); a race beat ${natural.toFixed(1)} s before the win beat gives 12`);
    }
    const tied = racing && vals[0].num === vals[1].num;
    const tDone = racing ? (tied ? tWin : tWin + V.forward) : null;       // when the other timer stops
    const tSecond = bSecond ? bSecond.t : null;
    if (racing && tDone > tOut - F(20)) S.warn('versus: the race ends less than 20 frames before the scene does; move the beats earlier');

    // ---- the count above the cards [X16]
    let figure = null;
    const tCount = bCount ? Math.max(tIn, bCount.t) : null;
    if (countText) {
      const size = sizeForCap(countCap);
      const line = h('div', { style: { position: 'absolute', left: `${V.w / 2}px`, top: `${(V.count.cap - size * fonts.M.base).toFixed(2)}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
        font: `${fonts.weight.heavy} ${size.toFixed(2)}px/1 ${fonts.sans}`, letterSpacing: `${V.count.tracking}em`, color: colour.cream } });
      const wrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${V.w}px`, height: `${V.count.cap}px`, transformOrigin: `${V.w / 2}px ${V.count.cap / 2}px` } }, line);
      root.append(wrap);
      figure = { wrap, line, f: parseValue(countText), text: countText };
    }

    // ---- the two cards
    const shadows = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0' } });
    root.append(shadows);
    const dimRgb = hex(V.muted), creamRgb = hex(colour.cream);
    const cards = sides.map((s, k) => {
      const y = headH + k * (cardH + V.gap);
      const el = h('div.eb-versus-card', { style: { position: 'absolute', left: '0', top: `${y}px`, width: `${V.w}px`, height: `${cardH}px`, borderRadius: `${V.radius}px`, background: V.fill,
        boxShadow: `0 0 0 ${V.stroke.w}px ${V.stroke.c}` } });
      // both shadows lie under both cards: the lower card's shadow does not darken the upper one
      const shadow = h('div', { style: { position: 'absolute', left: '0', top: `${y}px`, width: `${V.w}px`, height: `${cardH}px`, borderRadius: `${V.radius}px`, boxShadow: colour.shadow } });
      shadows.append(shadow);
      root.append(el);
      const ring = (w, c) => { const o = h('div', { style: { position: 'absolute', left: `${-w}px`, top: `${-w}px`, width: `${V.w + 2 * w}px`, height: `${cardH + 2 * w}px`, borderRadius: `${V.radius + w}px`, boxShadow: `inset 0 0 0 ${w}px ${c}`, display: 'none', pointerEvents: 'none' } }); el.append(o); return o; };
      const outline = ring(V.outline.w, colour.accent), done = ring(V.done.w, V.done.c);

      // header: tile and name
      const H = V.head;
      const mark = data.marks[k];
      let x = H.x;
      const name = String(s.name || '').trim();
      // a mark that did not load falls back to the initials
      const tileOpt = mark && mark.kind === 'image' ? { image: mark } : s.glyph ? { glyph: s.glyph } : mark || s.initials ? { initials: name.split(/[\s\-_/.]+/).filter(Boolean).slice(0, 2).map((w) => [...w][0]).join('') } : null;
      if (tileOpt) {
        const tile = tileNode(S, { side: H.side, fill: 'cream', ...tileOpt });
        Object.assign(tile.style, { left: `${H.x}px`, top: `${H.top}px` });
        el.append(tile);
        x += H.side + H.gap;
      }
      const nameCap = fitCap(name, H.cap, H.weight, V.w - x - H.x, H.tracking);
      const nameSize = sizeForCap(nameCap, H.weight);
      el.append(h('div', { text: name, style: { position: 'absolute', left: `${x - 2}px`, top: `${(H.base - (H.cap - nameCap) / 2 - nameSize * fonts.M.base).toFixed(2)}px`, whiteSpace: 'nowrap',
        font: `${H.weight} ${nameSize.toFixed(2)}px/1 ${fonts.sans}`, letterSpacing: `${H.tracking}em`, color: V.muted } }));

      // the big value
      const f = vals[k];
      const shown = f ? f.main : String(s.value || '').trim();
      const unitW = f && f.unit ? measureText(f.unit, fontFor(V.value.cap, V.value.unitWeight)) * V.value.unit + V.value.unitGap * sizeForCap(V.value.cap) : 0;
      const room = L.maxW - unitW;
      const vCap = fitCap(shown, V.value.cap, fonts.weight.heavy, room, V.value.tracking);
      const vSize = sizeForCap(vCap);
      const vLine = h('div', { style: { position: 'absolute', left: `${L.valueX}px`, top: `${(L.valueBase - vSize * fonts.M.base).toFixed(2)}px`, whiteSpace: 'nowrap',
        font: `${fonts.weight.heavy} ${vSize.toFixed(2)}px/1 ${fonts.sans}`, letterSpacing: `${V.value.tracking}em`, color: colour.cream } });
      const vText = h('span', { text: shown });
      vLine.append(vText);
      if (f && f.unit) vLine.append(h('span', { text: f.unit, style: { fontSize: `${V.value.unit}em`, fontWeight: String(V.value.unitWeight), letterSpacing: '0', marginLeft: `${V.value.unitGap}em` } }));
      el.append(vLine);

      // the second value
      let sLine = null;
      const sf = secs[k];
      const sShown = s.second ? String(s.second).trim() : '';
      if (sShown) {
        const sCap = fitCap(sShown, V.second.cap, V.second.weight, tall ? L.maxW : V.w - L.maxW - 120, V.second.tracking);
        const sSize = sizeForCap(sCap, V.second.weight);
        const at = tall ? { left: `${L.secondX}px` } : { left: `${L.secondRight}px`, transform: 'translateX(-100%)' };
        sLine = h('div', { text: sShown, style: { position: 'absolute', ...at, top: `${((tall ? L.secondBase : L.valueBase) - sSize * fonts.M.base).toFixed(2)}px`, whiteSpace: 'nowrap',
          font: `${V.second.weight} ${sSize.toFixed(2)}px/1 ${fonts.sans}`, letterSpacing: `${V.second.tracking}em`, color: V.muted } });
        el.append(sLine);
      }

      // what fills: a mosaic or a bar
      let tiles = null, order = null, mosaic = null, bar = null;
      if (tall) {
        const M = V.mosaic, n = M.n * M.n, pad = (M.pitch - M.tile) / 2;
        mosaic = h('div', { style: { position: 'absolute', left: `${M.x}px`, top: `${M.y}px`, width: `${M.n * M.pitch}px`, height: `${M.n * M.pitch}px`, transformOrigin: '50% 50%' } });
        tiles = [];
        for (let i = 0; i < n; i++) {
          const tile = h('div', { style: { position: 'absolute', left: `${((i % M.n) * M.pitch + pad).toFixed(2)}px`, top: `${(Math.floor(i / M.n) * M.pitch + pad).toFixed(2)}px`, width: `${M.tile}px`, height: `${M.tile}px`, borderRadius: `${M.radius}px`, background: M.off } });
          mosaic.append(tile); tiles.push(tile);
        }
        el.append(mosaic);
        // a fixed shuffle per card: random order, never reading order [D16]
        const rnd = kit.seeded(977 + k * 131);
        order = tiles.map((_, i) => i);
        for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      } else if (progress === 'bar') {
        const B = V.compact.bar;
        const track = h('div', { style: { position: 'absolute', left: `${B.x}px`, top: `${B.y}px`, width: `${B.w}px`, height: `${B.h}px`, borderRadius: `${B.h / 2}px`, background: V.mosaic.off, overflow: 'hidden' } });
        bar = h('div', { style: { position: 'absolute', left: `${-B.w}px`, top: '0', width: `${B.w}px`, height: `${B.h}px`, borderRadius: `${B.h / 2}px`, background: V.mosaic.on } });
        track.append(bar); el.append(track);
      }
      return { el, shadow, outline, done, f, shown, vLine, vText, sf, sShown, sLine, tiles, order, mosaic, bar, lit: -1 };
    });

    // share of a card's progress that has landed at time t (0..1): the winner's last part lands on its stop,
    // the other one's on its own [D16]
    const N = 100;
    const span = racing ? tWin - tRace : 0;
    const curve = (t) => Math.floor(N * quadInOut((t - tRace - F(0.5)) / (V.land.stretch * span))) / N;
    const winnerShare = (t) => (t >= tWin ? 1 : curve(t));
    const share = (k, t) => {
      if (!racing) return 1;
      if (k === winner || tied) return winnerShare(t);
      if (t >= tDone) return 1;
      const behind = (u) => Math.floor(N * V.land.loserRate * curve(u - V.land.loserLag)) / N;
      if (t < tWin) return behind(t);
      const atStop = behind(tWin), v = (t - tWin) / V.forward;
      const s = v < V.land.catchUp ? atStop + (V.land.catchTo - atStop) * sineInOut(v / V.land.catchUp) : V.land.catchTo + (1 - V.land.catchTo) * ((v - V.land.catchUp) / (1 - V.land.catchUp));
      return Math.min(0.99, Math.floor(N * s) / N);
    };
    // the running value [D15]: both alike while racing, then the winner holds and the other accelerates to its own
    const running = (k, t) => {
      const f = cards[k].f;
      if (t < tRace) return 0;
      if (k === winner || tied) return t >= tWin ? f.num : rate * (t - tRace);
      if (t < tWin) return rate * (t - tRace);
      if (t >= tDone) return f.num;
      const u = (t - tWin) / V.forward;
      return vals[winner].num + (f.num - vals[winner].num) * u * u * u;
    };

    const tFig = tCount !== null ? tCount : tIn + motion.enter.fade * 0.4;
    return {
      el: root, box: { x: box.x, y: box.y, w: box.w, h: box.h },
      seek(t) {
        if (figure) {
          // with a count beat the figure arrives on it; otherwise it comes in with the cards. It counts as it arrives [X16]
          if (tCount !== null) { setStyle(figure.wrap, 'display', t < tCount ? 'none' : ''); applyState(figure.wrap, enterAt(S, t - tCount, motion.enter.presets.figure)); }
          const r = expoInOut(kit.clamp((t - tFig) / motion.countUp.dur));
          const txt = !figure.f || r >= 1 ? figure.text : fmt(figure.f, figure.f.num * r) + figure.f.unit;
          if (figure.line.textContent !== txt) figure.line.textContent = txt;
        }
        cards.forEach((c, k) => {
          if (c.mosaic && tCount !== null) {
            const a = t - tCount - (k + 1) * V.countLag;
            setStyle(c.mosaic, 'display', a < 0 ? 'none' : '');
            if (a >= 0) applyState(c.mosaic, enterAt(S, a, motion.enter.presets.tile));
          }
          const sh = share(k, t);
          if (racing) {
            const stopped = t >= (k === winner || tied ? tWin : tDone);
            const txt = stopped ? c.shown : fmt(c.f, running(k, t));
            if (c.vText.textContent !== txt) c.vText.textContent = txt;
            setStyle(c.vLine, 'color', mix(dimRgb, creamRgb, lin((t - tRace) / V.light)));
            if (c.sLine && c.sf) {
              const st = sh >= 1 ? c.sShown : fmt(c.sf, c.sf.num * sh) + c.sf.unit;
              if (c.sLine.textContent !== st) c.sLine.textContent = st;
            }
            if (c.tiles) {
              const lit = Math.round(sh * c.tiles.length);
              if (lit !== c.lit) { c.order.forEach((i, r) => setStyle(c.tiles[i], 'background', r < lit ? V.mosaic.on : V.mosaic.off)); c.lit = lit; }
            }
            if (c.bar) setStyle(c.bar, 'transform', `translateX(${(V.compact.bar.w * sh).toFixed(1)}px)`);
            if (k !== winner && !tied) setStyle(c.done, 'display', t >= tDone ? '' : 'none');
          } else if (tWin !== null && k !== winner) {
            // plain mode: the rejected block dims [X21]
            const o = 1 - (1 - V.dim.to) * lin((t - tWin) / V.dim.dur);
            setStyle(c.el, 'opacity', o >= 0.999 ? '' : o.toFixed(3));
            setStyle(c.shadow, 'opacity', o >= 0.999 ? '' : o.toFixed(3));
          }
          if (c.sLine) setStyle(c.sLine, 'color', tSecond === null ? V.muted : mix(dimRgb, creamRgb, lin((t - tSecond) / V.light)));
          if (k === winner) setStyle(c.outline, 'display', tWin !== null && t >= tWin ? '' : 'none');
        });
      },
    };
  },
};
