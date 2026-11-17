// Value bars: usage, limit and score rows that fill to a value (research/explain.md X10, X11; numbers.json
// build_spec.value_bar, score_bars; type.md T25).
//   usage   a white card of rows: the label left and the value right on one baseline, a full-width rounded bar under
//           them. Bars fill on cubic-bezier(0.65, 0, 0.35, 1) over 30 frames (26-35), the curve starting about 2 frames
//           after the cut, every frame showing a new value; at the limit the bar and its value turn red on one frame and the
//           consequence (a "limit reached" flag) follows on the next beat; a drain is the same curve reversed [X10].
//   score   a score card: label left, a thin bar, the value right, bars filling fast on the entrance ease-out (97 %
//           in about 8 frames) staggered 4 frames (3-5), then an optional total counting up the same way [X11, X09].
// Nothing overshoots and no bar reverses mid-fill [X29].
import { F, colour, fonts } from '../tokens.js';
import { place, setStyle, clamp01, sansFont, partAt, applyPart, measureText, snapper } from '../common.js';
import { card, CARD } from '../card.js';

// TOKENS (research/explain.md X10, X11; colour.md accents; type.md T25)
// usage card, measured on clip10@0 (panel, 3 rows, card 933 px) and clip13@700-726 (full, 1 row, the same card at 0.8)
const U = {
  pad: 51,          // card edge to bar ends (clip10@0: card x 73-1006, bars 124-956) [X10]
  label: 40,        // label and value size: cap 29 px (clip10@0 y 498-527) [T25]
  barGap: 30,       // label baseline to bar top (527 -> 557) [X10]
  barH: 30,         // bar height, fully rounded (557-586) [X10]
  pitch: 146,       // baseline to baseline (527, 673, 819) [X10]
  title: 42,        // heading size [T25 headings median 42]
  titleGap: 102,    // title baseline to the first label baseline (clip10@0 subtitle 425 -> 527) [X10]
  flagGap: 16,      // bar bottom to the limit flag (clip13@726: 13 px at 0.8) [X10]
  flagH: 70,        // flag height (56 at 0.8) and its text size; radius by eye
  flagText: 30,
};
// score card, measured on clip05@548 (full, 5 rows, card 856 px wide), scaled 1.3x to fill the 914 px card (by eye)
const SC = 1.3;
const R = {
  label: 27 * SC,   // cap 20 px (y 613-633) [T25]
  barH: 18 * SC,    // 616-633 [X11]
  pitch: 60 * SC,   // 616, 676, 736, 796, 856 [X11]
  barX: 0.39,       // bar from 39 % of the card's inner width (x 441 of 148-918) to 85 % (by eye: track end hidden at 100 %)
  barW: 0.47,
  total: 58 * SC,   // the total's digit height (clip05@548 "73") [X09]
};
const TRACK = '#ECEEF2';                 // unfilled track on a white card (clip13@700, x 580-846) [X10]
const FILL = '#357CEF';                  // default bar colour: the first accent that is not a third-party brand colour [colour.md accents, C18 by V]
const RED = ['#E76543', '#E44A49'];      // the bar at its limit: a left-to-right gradient (clip13@726 x 126 -> 786) [X10]
const RED_TEXT = '#CD535B';              // the value at its limit (clip13@714-726) [X10]
const FLAG = '#E2494C';                  // the "limit reached" flag (clip13@726) [X10]
const LIMIT = 0.92;                      // a bar turns red when it passes 92 % of the maximum: orange at 90 %, red at 93 % (clip13@713-714) [X10]
const LEAD = F(2);                       // the fill's curve starts 2 frames after the cut (fits: clip13@693 +2.25, clip10@0 +0.25..+7) [X10]
const FILL_DUR = F(30);                  // and runs 30 frames (fits 26.0-33.5; clip13 29.5) [X10]
const DRAIN_DUR = F(35);                 // a drain runs the same curve over 35 frames (clip10@738-773 fits 35.0, 35.25) [X10]
const SCORE_LEAD = F(4);                 // score bars start 4 frames after the card (clip05@524 -> 528) [X11]
const SCORE_DUR = F(14);                 // on the entrance ease: 97 % by frame 6.9 (measured 6-8) [X11]
const SCORE_STAGGER = F(4);              // 3-5 frames between rows [X11]
const TOTAL_DUR = F(9);                  // a score total counts on the ease-out in 6-10 frames (clip05@541-547) [X09]

const hexOk = (c) => /^#[0-9a-f]{6}$/i.test(c || '');

/** Event starts land on the frame grid, so a fast ease starts from its first value on a whole frame (a 6-frame land
 *  started half a frame late would show 1.09x instead of 1.25x on its first frame); seek adds 0.1 ms so an event
 *  that starts on a frame counts as started there despite float error. A shared helper would do. */

export default {
  type: 'value-bar',
  label: 'Value bars',
  slots: ['graphic'],
  params: {
    kind: 'enum?:usage|score',
    title: { type: 'string', optional: true, maxChars: 24, maxWords: 4 },
    rows: { type: 'array', min: 1, max: 5, of: {
      label: { type: 'string', maxChars: 22, maxWords: 4 },
      to: 'number',
      from: { type: 'number', optional: true },
    } },
    max: { type: 'number', optional: true, min: 1 },          // the limit (default 100)
    suffix: { type: 'string', optional: true, maxChars: 8 },   // "% used", "/100", " GB"
    total: { type: 'number', optional: true },                 // score cards: the total that counts up after the bars
    totalLabel: { type: 'string', optional: true, maxChars: 14, maxWords: 2 },
    color: { type: 'string', optional: true, maxChars: 7 },    // the subject's colour (#RRGGBB)
  },
  beats: {
    fill: { row: { type: 'number', optional: true, min: 0, max: 4 }, to: 'number' },   // a row (or every row) fills or drains [X10]
    flag: { text: { type: 'string', maxChars: 24, maxWords: 4 } },                       // the consequence at the limit [X10]
  },
  build(ctx) {
    const { S, params } = ctx;
    const { h } = S.kit;
    const snap = snapper(S), tIn = snap(ctx.tIn);
    const beats = ctx.beats.map((b) => ({ ...b, t: snap(b.t) }));
    const score = params.kind === 'score';
    const rows = (params.rows || []).slice(0, 5);
    const max = params.max || 100;
    const suffix = params.suffix ?? (score ? '' : '%');
    const base = hexOk(params.color) ? params.color : FILL;
    const flagBeat = !score && beats.find((b) => b.do === 'flag');
    const hasTotal = score && typeof params.total === 'number';

    // ---- geometry (card-local px)
    const w = CARD.mainW, inner = w - 2 * U.pad;
    const cap = fonts.M.cap;
    let y = U.pad;
    let titleBase = null;
    if (params.title) { titleBase = y + U.title * cap; y = titleBase + (score ? R.pitch * 1.15 : U.titleGap) - (score ? R.label : U.label) * cap; }   // score: header to first row by eye (clip05@548)
    const layoutRows = rows.map((r, k) => {
      if (score) { const top = y + k * R.pitch; return { base: top + R.label * cap + (R.barH - R.label * cap) / 2, barTop: top, barH: R.barH }; }
      const b = y + U.label * cap + k * U.pitch;
      return { base: b, barTop: b + U.barGap, barH: U.barH };
    });
    const last = layoutRows[layoutRows.length - 1];
    let bottom = last ? last.barTop + last.barH : y;
    let flagTop = null, totalBase = null;
    if (flagBeat) { flagTop = bottom + U.flagGap; bottom = flagTop + U.flagH; }
    if (hasTotal) { totalBase = bottom + R.pitch * 0.55 + R.total; bottom = totalBase; }
    const hgt = bottom + U.pad;
    const box = place(ctx, w, hgt);
    const s = box.s;

    const c = card(S, { x: 0, y: 0, w, h: hgt });
    const wrap = h('div.pr-value-bar', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${w}px`, height: `${hgt}px`,
      transform: s < 0.999 ? `scale(${s})` : '', transformOrigin: '0 0' } }, c.el);
    const el = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, wrap);
    const txt = (text, x, base, size, weight, col, align = 'left', extra = {}) => {
      const tf = align === 'right' ? 'translateX(-100%)' : align === 'center' ? 'translateX(-50%)' : '';
      return h('div', { text, style: { position: 'absolute', left: `${x}px`, top: `${(base - size * fonts.M.base).toFixed(2)}px`, transform: tf, whiteSpace: 'nowrap',
        font: sansFont(size, weight), letterSpacing: `${(-0.01 * size).toFixed(2)}px`, color: col, fontVariantNumeric: 'tabular-nums', ...extra } });
    };
    if (params.title) c.el.append(txt(params.title, U.pad, titleBase, U.title, fonts.weight.heavy, colour.ink));

    // ---- score columns: labels, then the bars, then the values; a long label pushes the bars right and, past the
    // point where the bars would be shorter than 30 % of the card, the labels are set smaller
    let sLabel = R.label, colX = U.pad + inner * R.barX, colW = inner * R.barW;
    if (score) {
      const gap = 28;
      const valW = measureText(`${max}${suffix}`, sansFont(R.label, fonts.weight.heavy)) + gap;
      const labW = Math.max(...rows.map((r) => measureText(r.label, sansFont(R.label, fonts.weight.label)))) + gap;
      const minBar = inner * 0.3;
      if (inner - labW - valW < minBar) sLabel = R.label * Math.max(0.6, (inner - valW - minBar) / labW);
      const lw = Math.max(...rows.map((r) => measureText(r.label, sansFont(sLabel, fonts.weight.label)))) + gap;
      colX = U.pad + Math.max(inner * R.barX, lw);
      colW = Math.min(inner * R.barW, U.pad + inner - valW - colX);
    }
    // ---- rows
    const R0 = rows.map((r, k) => {
      const L = layoutRows[k];
      const size = score ? R.label : U.label;
      const label = txt(r.label, U.pad, L.base, score ? sLabel : size, score ? fonts.weight.label : fonts.weight.body, colour.ink);
      const barX = score ? colX : U.pad, barW = score ? colW : inner;
      const track = h('div', { style: { position: 'absolute', left: `${barX}px`, top: `${L.barTop}px`, width: `${barW}px`, height: `${L.barH}px`, borderRadius: `${L.barH / 2}px`, background: TRACK, overflow: 'hidden' } });
      const fill = h('div', { style: { position: 'absolute', left: '0', top: '0', height: '100%', width: '0px', borderRadius: `${L.barH / 2}px`, background: base } });
      track.append(fill);
      const value = txt('', w - U.pad, L.base, size, score ? fonts.weight.heavy : fonts.weight.body, score ? colour.ink : colour.inkSoft, 'right');   // values are semibold (clip10@0, by eye)
      c.el.append(label, track, value);
      return { r, fill, value, barW, k };
    });

    // ---- fills: each row runs a list of segments [t0, dur, from, to, ease] from its own fill beats
    const fillDur = score ? SCORE_DUR : FILL_DUR;
    const ease = score ? S.E.out : S.E.inOut;
    const t0 = snap(tIn + (score ? SCORE_LEAD : LEAD));
    const segs = R0.map((row) => {
      const out = [];
      let cur = row.r.from ?? 0;
      const own = beats.filter((b) => b.do === 'fill' && (b.row == null || b.row === row.k));
      // the row's own value first (unless a fill beat owns the first move), then each fill beat in turn
      if (typeof row.r.to === 'number') {
        const st = score ? snap(t0 + row.k * SCORE_STAGGER) : t0;
        if (!own.length || own[0].t > st + fillDur * 0.5) { out.push({ t: st, d: fillDur, a: cur, b: row.r.to }); cur = row.r.to; }
      }
      for (const b of own) {
        const st = score && b.row == null ? snap(b.t + row.k * SCORE_STAGGER) : b.t;
        out.push({ t: st, d: b.to < cur && !score ? DRAIN_DUR : fillDur, a: cur, b: b.to }); cur = b.to;
      }
      return out;
    });
    // a move starts from wherever the bar is when it starts, so overlapping beats never make it jump
    const valueAt = (k, t) => {
      let cur = null;
      for (const sg of segs[k]) {
        if (t < sg.t) break;
        const a = cur ? cur.a + (cur.b - cur.a) * ease(clamp01((sg.t - cur.t) / cur.d)) : sg.a;
        cur = { t: sg.t, d: sg.d, a, b: sg.b };
      }
      return cur ? cur.a + (cur.b - cur.a) * ease(clamp01((t - cur.t) / cur.d)) : rows[k].from ?? 0;
    };

    // ---- the flag at the limit, and the score total
    let flag = null;
    if (flagBeat) {
      const fw = measureText(flagBeat.text, sansFont(U.flagText, fonts.weight.heavy)) + 2 * 22;
      flag = h('div', { style: { position: 'absolute', left: `${U.pad}px`, top: `${flagTop}px`, width: `${fw.toFixed(1)}px`, height: `${U.flagH}px`, borderRadius: '14px', background: FLAG } },
        txt(flagBeat.text, 22, U.flagH / 2 + U.flagText * cap / 2, U.flagText, fonts.weight.heavy, colour.white));
      c.el.append(flag);
    }
    let totalEl = null, totalT0 = 0;
    if (hasTotal) {
      if (params.totalLabel) c.el.append(txt(params.totalLabel, U.pad, totalBase, R.label * 1.15, fonts.weight.heavy, colour.ink));
      c.el.append(h('div', { style: { position: 'absolute', left: `${U.pad}px`, right: `${U.pad}px`, top: `${(totalBase - R.total - R.pitch * 0.3).toFixed(1)}px`, height: '2px', background: colour.line } }));
      // the total, with "/max" set small and grey after it when the plan gives a maximum ("73/100", clip05@548)
      const outOf = params.max ? `/${params.max}` : '';
      const outSize = R.label * 1.15;
      const outW = outOf ? measureText(outOf, sansFont(outSize, fonts.weight.body)) : 0;
      totalEl = txt('', w - U.pad - outW, totalBase, R.total / cap, fonts.weight.display, base, 'right', { letterSpacing: `${(-0.03 * R.total / cap).toFixed(2)}px` });
      c.el.append(totalEl);
      if (outOf) c.el.append(txt(outOf, w - U.pad, totalBase, outSize, fonts.weight.body, colour.inkSoft, 'right'));
      const lastStart = Math.max(...segs.map((sg) => (sg[0] ? sg[0].t : t0)));
      totalT0 = snap(lastStart + SCORE_STAGGER);   // the total starts as the last bar settles (clip05@541) [X09]
    }

    return {
      el, box,
      seek(t) {
        t += 1e-4;
        for (const row of R0) {
          const v = valueAt(row.k, t);
          const f = clamp01(v / max);
          setStyle(row.fill, 'width', `${(f * row.barW).toFixed(2)}px`);
          setStyle(row.fill, 'minWidth', f > 0.0005 ? `${Math.min(row.barW, rows.length ? (score ? R.barH : U.barH) : 0)}px` : '0px');
          const red = !score && f >= LIMIT;
          // the red state is one gradient across the whole track, so the bar's colour does not slide as it grows
          setStyle(row.fill, 'background', red ? `linear-gradient(to right, ${RED[0]}, ${RED[1]}) 0 0 / ${row.barW}px 100% no-repeat` : base);
          const str = `${Math.round(v)}${suffix}`;
          if (row.value._t !== str) { row.value.textContent = str; row.value._t = str; }
          setStyle(row.value, 'color', red ? RED_TEXT : score ? colour.ink : colour.inkSoft);
        }
        if (flag) applyPart(flag, partAt(S, t - flagBeat.t, 'grow'), 'left center');
        if (totalEl) {
          const p = S.E.out(clamp01((t - totalT0) / TOTAL_DUR));
          const str = `${Math.round(params.total * p)}`;
          if (totalEl._t !== str) { totalEl.textContent = str; totalEl._t = str; }
        }
      },
    };
  },
};
