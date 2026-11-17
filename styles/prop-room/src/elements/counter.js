// A counter that rolls to a spoken number (research/explain.md X07, X08, X09; type.md T25, T26).
// The figure is already moving about 5 frames before the number is spoken and lands about 7 frames after it;
// it rolls on cubic-bezier(0.65, 0, 0.35, 1) over 27 frames (12-35), every frame shows a new value, the suffix
// arrives on landing, and nothing overshoots [X07, X08, X29]. Large ranges (social counts) roll in log space [X09].
// The figure is a heavy grotesque with tight spacing: ink on light plates, white on dark ones [T26]. Its label (the
// unit or what is counted) sits under it in the same heavy face at about a quarter of the figure's height, and rises
// in as the figure lands (clip18@768-769 "MILLION" on landing, clip14@254-257, clip09@498 "real sounds") [T25].
// Measured on the reference counters: clip18@775 ($0 -> $100, panel), clip16@295 (0:15 -> 5:00, full),
// clip09@520 (odometer, panel), clip14@258 (400+, full).
import { CX, F, fonts, colour, motion, layout } from '../tokens.js';
import { place, measureText, sansFont, partAt, applyPart, snapper } from '../common.js';
import { plateIsDark } from '../plate.js';

// TOKENS (research/explain.md X07, X08; type.md T25, T26)
const LEAD = F(5);            // motion starts this long before the spoken number [X07]
const LAND = F(7);            // and lands this long after it [X07]
const CAP = { split: 265, full: 300 };   // digit height px: "0" 450-721 in the panel (clip18@775) [T25]; full by eye
                                         // (clip14@258 about 230, clip08@50 about 320)
const WEIGHT = 900;           // a heavy grotesque: Inter 900 gives the reference "0" its width, 0.813 vs 0.824 of the digit height (clip16@295) [T26]
const TRACK = 0;              // em, with tabular figures: the gap between two "0"s is 0.049 of the digit height (clip16@295: 7 px at 142;
                              // ours 0.043) [T26]
const LABEL_CAP = 0.24;       // label cap / digit height ("OVER" 64 px over 265 px, clip18@775) [T25]
const LABEL_GAP = 0.245;      // digit baseline to label cap top / digit height (721 -> 786, clip18@775) [T25]
const LABEL_TRACK = -0.01;    // em, the label is set tight too (clip09@520 "real sounds", by eye)
const LABEL_RISE = 22;        // px, the label rises in as the figure lands [X75]

/** Event starts land on the frame grid, so a fast ease starts from its first value on a whole frame (a 6-frame land
 *  started half a frame late would show 1.09x instead of 1.25x on its first frame); seek adds 0.1 ms so an event
 *  that starts on a frame counts as started there despite float error. A shared helper would do. */

/** Width of a string with tabular figures, as the counter draws it (measureText has no font-feature setting). */
let probe = null;
function tabularWidth(text, font) {
  if (!probe) {
    probe = document.createElement('span');
    Object.assign(probe.style, { position: 'absolute', left: '-100000px', top: '0', whiteSpace: 'pre', visibility: 'hidden', fontVariantNumeric: 'tabular-nums' });
    document.body.append(probe);
  }
  probe.style.font = font; probe.style.letterSpacing = `${TRACK}em`; probe.textContent = text;
  return probe.getBoundingClientRect().width;
}

const fmt = (v, decimals, sep) => {
  const s = v.toFixed(decimals);
  if (!sep) return s;
  const [i, d] = s.split('.');
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : '');
};

export default {
  type: 'counter',
  label: 'Counter',
  slots: ['graphic'],
  params: {
    to: 'number',
    from: { type: 'number', optional: true },
    word: { type: 'word', optional: true },                                       // the spoken number [X07]
    prefix: { type: 'string', optional: true, maxChars: 2 },                       // "$"
    suffix: { type: 'string', optional: true, maxChars: 8 },                       // "%", "+", "k", "/10"
    label: { type: 'string', optional: true, maxChars: 22, maxWords: 4 },   // set smaller when wider than the stage
  },
  beats: {},
  build(ctx) {
    const { S, params, mode } = ctx;
    const { h } = S.kit;
    const snap = snapper(S), tIn = snap(ctx.tIn);
    const to = params.to, from = params.from ?? 0;
    const decimals = (String(to).split('.')[1] || '').length;
    const sep = Math.abs(to) >= 10000;
    const logRoll = from > 0 && to / from >= 100;   // social counts roll in log space [X09]
    const tLand = params.word != null ? snap(S.wordTime(params.word) + LAND) : snap(tIn + F(2) + motion.count.dur);
    const t0 = Math.max(tIn, Math.min(tLand - motion.count.dur, params.word != null ? snap(S.wordTime(params.word) - LEAD) : tLand));
    const dur = Math.max(F(12), tLand - t0);

    const dark = plateIsDark(params.plate, params.field);
    const ink = dark ? colour.white : colour.ink;
    const st = layout.stage[mode === 'full' ? 'full' : 'split'];
    const room = 1080 - 2 * st.margin;
    // the widest value as it is drawn (tabular figures), and a figure too wide for the stage set smaller to fit
    const widest = `${params.prefix || ''}${fmt(Math.max(Math.abs(to), Math.abs(from)), decimals, sep)}${params.suffix || ''}`;
    const capFull = CAP[mode === 'full' ? 'full' : 'split'];
    const w0 = tabularWidth(widest, sansFont(capFull / fonts.M.cap, WEIGHT));
    const cap = w0 > room ? (capFull * room) / w0 : capFull;
    const size = cap / fonts.M.cap;
    const w = Math.min(room, w0);
    // the label: a quarter of the figure's height, shrunk to the stage width if it is long
    let lSize = (cap * LABEL_CAP) / fonts.M.cap;
    if (params.label) { const lw = measureText(params.label, sansFont(lSize, WEIGHT), LABEL_TRACK * lSize); if (lw > room) lSize *= room / lw; }
    const hgt = cap + (params.label ? cap * LABEL_GAP + lSize * fonts.M.cap : 0);
    const box = place(ctx, w, hgt);
    const s = box.s;
    const numBase = box.y + cap * s;
    const num = h('div', { style: { position: 'absolute', left: `${CX}px`, top: `${(numBase - size * s * fonts.M.base).toFixed(2)}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
      font: sansFont(size * s, WEIGHT), letterSpacing: `${TRACK}em`, color: ink, fontVariantNumeric: 'tabular-nums' } });
    const el = h('div.pr-counter', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, num);
    let label = null;
    if (params.label) {
      const ls = lSize * s;
      const lBase = numBase + (cap * LABEL_GAP) * s + ls * fonts.M.cap;
      const line = h('div', { text: params.label, style: { position: 'absolute', left: `${CX}px`, top: `${(lBase - ls * fonts.M.base).toFixed(2)}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
        font: sansFont(ls, WEIGHT), letterSpacing: `${LABEL_TRACK}em`, color: ink } });
      label = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, line);
      el.append(label);
    }
    return {
      el, box,
      seek(t) {
        t += 1e-4;
        const p = S.E.inOut(Math.min(1, Math.max(0, (t - t0) / dur)));
        const v = logRoll ? Math.exp(Math.log(from) + (Math.log(to) - Math.log(from)) * p) : from + (to - from) * p;
        const landed = t >= t0 + dur;
        const shown = landed ? to : Math.round(v * 10 ** decimals) / 10 ** decimals;
        const str = `${params.prefix || ''}${fmt(shown, decimals, sep)}${landed ? params.suffix || '' : ''}`;
        if (num._txt !== str) { num.textContent = str; num._txt = str; }
        if (label) applyPart(label, partAt(S, t - (t0 + dur), 'slide', { dist: LABEL_RISE }));
      },
    };
  },
};
