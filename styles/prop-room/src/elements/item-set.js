// A counted set shown as exactly that many items (research/explain.md X09, X12, X16; numbers.json build_spec
// one_by_one, segment_fill; devices enumerate_pop, growing_list, grid_fill).
//   drop       the items drop in from above one per beat, about 11 frames apart, each on the entrance ease-out
//              (half-way in 2-3 frames, 90 % in 6-7, no overshoot), hanging on a dashed cord like ID badges
//              (clip12@212-262: starts 212, 224, 235, 245, 257; drops of 306-594 px) [X16]
//   segments   an empty ring of N segments on the cut; each segment fills on one frame, about 6 frames apart, and the
//              total sits in the hub (clip07@631-654: 636, 642, 648, 654) [X12]
//   grid       a grid of cells that fill about one a frame while the count runs linearly beside it: each unit of the
//              number is a visible cell (clip18@526-547, clip05@233-268) [X09, X12]
// The number of items is the spoken number [X12: 7 of 7]. `add` beats move the next item onto its word; the first
// item of a drop set is on the cut [X04], and items without a beat follow at the measured interval.
import { CX, F, colour, fonts, layout } from '../tokens.js';
import { place, setStyle, clamp01, sansFont, partAt, applyPart, unit, measureText, snapper } from '../common.js';
import { card } from '../card.js';
import { plateIsDark } from '../plate.js';

// TOKENS (research/explain.md X09, X12, X16; colour.md accents)
const DROP = { dist: 450, dur: F(20), gap: F(11) };   // 306-594 px; T 20 puts t50 at 2.0 and t90 at 6.6 frames; 11 frames apart [X16]
const BADGE = { w: 280, h: 340, head: 0.42, gap: 36, radius: 24, label: 40, sub: 28, tilt: 4 };   // by eye from clip12@262 (badges about 0.26 of the frame wide, tilted a few degrees)
const CORD = { w: 4, dash: 10, gapPx: 8 };            // the dashed lanyard (by eye, clip12@262)
const SEG = { r: 320, hub: 0.32, line: 5, gap: F(6), lead: F(5) };   // ring radius and hub (by eye, clip07@650); segments 6 frames apart, the first 5 after the cut [X12]
const GRID = { cols: 7, cell: 72, gapPx: 12, pad: 28, radius: 30, cellR: 14, per: F(1), lead: F(5), min: F(12), max: F(36) };   // clip18@526-547 (by eye); one cell a frame [X12], 12-36 frames in all [X09]
const GRID_CARD = '#1E1F24', GRID_CELL = '#3A3B42';  // the dark grid card and its empty cells (clip18@536, by eye)
const SEG_LINE = '#2B2B31';                           // the ring's outline (clip07@650, by eye)
const COUNT_CAP = 120;                                // the running count beside a grid (by eye; T25 display words 84-152 px)
const ACCENTS = ['#357CEF', '#ECAB44', '#2F85B5', '#F0574A', '#8E6CF0', '#1F9E7A'];   // colour.md accents ranked; the last two by eye
const hexOk = (c) => /^#[0-9a-f]{6}$/i.test(c || '');

/** Event starts land on the frame grid, so a fast ease starts from its first value on a whole frame (a 6-frame land
 *  started half a frame late would show 1.09x instead of 1.25x on its first frame); seek adds 0.1 ms so an event
 *  that starts on a frame counts as started there despite float error. A shared helper would do. */

export default {
  type: 'item-set',
  label: 'Item set',
  slots: ['graphic'],
  params: {
    kind: 'enum?:drop|segments|grid',
    items: { type: 'array', optional: true, min: 1, max: 6, of: {                   // drop: one badge per item
      label: { type: 'string', maxChars: 10, maxWords: 2 },
      sub: { type: 'string', optional: true, maxChars: 14, maxWords: 3 },
    } },
    count: { type: 'number', optional: true, min: 1, max: 56 },                      // segments (2-12) and grid cells
    of: { type: 'number', optional: true, min: 1, max: 56 },                         // grid: the cells shown (default: rows of 7)
    label: { type: 'string', optional: true, maxChars: 10, maxWords: 2 },            // the hub text, or the word after the count
    color: { type: 'string', optional: true, maxChars: 7 },
  },
  beats: {
    add: {},                                                                         // the next item arrives on this word
  },
  build(ctx) {
    const { S, params, seed } = ctx;
    const { h } = S.kit;
    const snap = snapper(S), tIn = snap(ctx.tIn);
    const beats = ctx.beats.map((b) => ({ ...b, t: snap(b.t) }));
    const kind = params.kind || 'drop';
    const dark = plateIsDark(params.plate, params.field);
    const ink = dark ? colour.white : colour.ink;
    const cap = fonts.M.cap;
    const adds = beats.filter((b) => b.do === 'add').map((b) => b.t);
    const el = h('div.pr-item-set', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } });
    // item k's start: its beat, else the previous start plus the interval
    const starts = (n, first, gap, firstOnCut) => {
      const out = [];
      for (let k = 0; k < n; k++) {
        const b = firstOnCut ? (k === 0 ? null : adds[k - 1]) : adds[k];
        out.push(b != null ? Math.max(tIn, b) : k === 0 ? snap(first) : snap(out[k - 1] + gap));
      }
      return out;
    };

    if (kind === 'drop') {
      const items = (params.items || []).slice(0, 6);
      const n = items.length;
      if (!n) { S.warn('item-set drop: give `items`'); return { el, seek() {} }; }
      const perRow = n <= 3 ? n : n === 4 ? 2 : 3;
      const rowsN = Math.ceil(n / perRow);
      const W0 = perRow * BADGE.w + (perRow - 1) * BADGE.gap, H0 = rowsN * BADGE.h + (rowsN - 1) * BADGE.gap;
      const box = place(ctx, W0, H0);
      const s = box.s;
      const root = h('div', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${W0}px`, height: `${H0}px`, transform: s < 0.999 ? `scale(${s})` : '', transformOrigin: '0 0' } });
      const cords = h('div', { style: { position: 'absolute', left: '0', top: '0' } });
      root.append(cords);
      el.append(root);
      const T = starts(n, tIn, DROP.gap, true);
      const parts = items.map((it, k) => {
        const row = Math.floor(k / perRow), inRow = row === rowsN - 1 ? n - row * perRow : perRow;
        const rowW = inRow * BADGE.w + (inRow - 1) * BADGE.gap;
        const x = (W0 - rowW) / 2 + (k - row * perRow) * (BADGE.w + BADGE.gap), y = row * (BADGE.h + BADGE.gap);
        const tint = ACCENTS[k % ACCENTS.length];
        const tilt = (unit(S, `${seed}/tilt/${k}`) * 2 - 1) * BADGE.tilt;
        const c = card(S, { x: 0, y: 0, w: BADGE.w, h: BADGE.h, radius: BADGE.radius });
        const headH = BADGE.h * BADGE.head;
        c.el.prepend(h('div', { style: { position: 'absolute', left: '0', top: '0', width: '100%', height: `${headH}px`, background: tint } }));
        // the clip hole and a monogram disc on the band (drawn, not a picture)
        c.el.append(h('div', { style: { position: 'absolute', left: `${BADGE.w / 2 - 22}px`, top: '16px', width: '44px', height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.7)' } }));
        const d = 92;
        c.el.append(h('div', { text: it.label.slice(0, 1).toUpperCase(), style: { position: 'absolute', left: `${BADGE.w / 2 - d / 2}px`, top: `${headH - d * 0.62}px`, width: `${d}px`, height: `${d}px`,
          borderRadius: '50%', background: colour.white, color: tint, font: sansFont(52, fonts.weight.display), lineHeight: `${d}px`, textAlign: 'center', boxShadow: '0 6px 14px -6px rgba(0,0,0,0.35)' } }));
        const lb = headH + d * 0.38 + 26 + BADGE.label * cap;
        c.el.append(h('div', { text: it.label, style: { position: 'absolute', left: '0', width: '100%', top: `${(lb - BADGE.label * fonts.M.base).toFixed(1)}px`, textAlign: 'center',
          font: sansFont(BADGE.label, fonts.weight.display), letterSpacing: '-0.5px', color: colour.ink, whiteSpace: 'nowrap' } }));
        if (it.sub) c.el.append(h('div', { text: it.sub, style: { position: 'absolute', left: '0', width: '100%', top: `${(lb + 14 + BADGE.sub * cap - BADGE.sub * fonts.M.base).toFixed(1)}px`, textAlign: 'center',
          font: sansFont(BADGE.sub, fonts.weight.body), color: tint, whiteSpace: 'nowrap' } }));
        const holder = h('div', { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${BADGE.w}px`, height: `${BADGE.h}px`, transform: `rotate(${tilt.toFixed(2)}deg)`, transformOrigin: '50% 0' } }, c.el);
        const cordLen = 2200;
        const cord = h('div', { style: { position: 'absolute', left: `${x + BADGE.w / 2 - CORD.w / 2}px`, top: `${y - cordLen + 20}px`, width: `${CORD.w}px`, height: `${cordLen}px`,
          background: `repeating-linear-gradient(to bottom, ${tint} 0 ${CORD.dash}px, transparent ${CORD.dash}px ${CORD.dash + CORD.gapPx}px)`, transformOrigin: `50% ${cordLen - 20}px`, transform: `rotate(${tilt.toFixed(2)}deg)` } });
        const mover = h('div', { style: { position: 'absolute', left: '0', top: '0' } }, holder);
        const cmover = h('div', { style: { position: 'absolute', left: '0', top: '0' } }, cord);
        root.append(mover); cords.append(cmover);
        return { mover, cmover, t: T[k] };
      });
      return {
        el, box,
        seek(t) {
          t += 1e-4;
          for (const p of parts) {
            const a = t - p.t;
            const off = a < 0 ? 0 : DROP.dist * (1 - S.E.out(clamp01(a / DROP.dur)));
            const vis = a >= 0 ? 'visible' : 'hidden';
            for (const m of [p.mover, p.cmover]) { setStyle(m, 'visibility', vis); setStyle(m, 'transform', off > 0.05 ? `translateY(${(-off).toFixed(2)}px)` : ''); }
          }
        },
      };
    }

    if (kind === 'segments') {
      const n = Math.max(2, Math.min(12, Math.round(params.count || (params.items || []).length || 4)));
      const r = SEG.r, hub = r * SEG.hub;
      const box = place(ctx, 2 * r + 2 * SEG.line, 2 * r + 2 * SEG.line);
      const s = box.s;
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      const D = 2 * r + 2 * SEG.line;
      svg.setAttribute('viewBox', `${-D / 2} ${-D / 2} ${D} ${D}`);
      Object.assign(svg.style, { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px`, overflow: 'visible', filter: 'drop-shadow(0 18px 22px rgba(0,0,0,0.16))' });
      const mk = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); return e; };
      const line = dark ? 'rgba(255,255,255,0.85)' : SEG_LINE;
      svg.append(mk('circle', { cx: 0, cy: 0, r, fill: dark ? 'rgba(255,255,255,0.08)' : '#F7F6F4', stroke: line, 'stroke-width': SEG.line }));
      const tints = colour.plate.tints;
      const segs = [];
      for (let k = 0; k < n; k++) {
        const a0 = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * k) / n, a1 = a0 + (2 * Math.PI) / n;   // the first segment is centred at the top (clip07@636)
        const P = (rad, a) => `${(rad * Math.cos(a)).toFixed(2)} ${(rad * Math.sin(a)).toFixed(2)}`;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const d = `M ${P(hub, a0)} L ${P(r, a0)} A ${r} ${r} 0 ${large} 1 ${P(r, a1)} L ${P(hub, a1)} A ${hub} ${hub} 0 ${large} 0 ${P(hub, a0)} Z`;
        const fill = hexOk(params.color) ? params.color : tints[k % tints.length];
        const seg = mk('path', { d, fill, stroke: 'none', visibility: 'hidden' });
        svg.append(seg); segs.push(seg);
      }
      for (let k = 0; k < n; k++) {
        const a = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * k) / n;
        svg.append(mk('line', { x1: (hub * Math.cos(a)).toFixed(2), y1: (hub * Math.sin(a)).toFixed(2), x2: (r * Math.cos(a)).toFixed(2), y2: (r * Math.sin(a)).toFixed(2), stroke: line, 'stroke-width': SEG.line * 0.7 }));
      }
      svg.append(mk('circle', { cx: 0, cy: 0, r: r, fill: 'none', stroke: line, 'stroke-width': SEG.line }));
      svg.append(mk('circle', { cx: 0, cy: 0, r: hub, fill: '#FBFAF8', stroke: line, 'stroke-width': SEG.line }));
      el.append(svg);
      let lab = null;
      if (params.label) {
        const size = Math.min(56, (hub * 1.6) / (measureText(params.label, sansFont(100, fonts.weight.display)) / 100)) * s;   // inside the hub (by eye)
        lab = h('div', { text: params.label, style: { position: 'absolute', left: `${CX}px`, top: `${(box.y + box.h / 2 + size * cap / 2 - size * fonts.M.base).toFixed(1)}px`, transform: 'translateX(-50%)',
          font: sansFont(size, fonts.weight.display), letterSpacing: '-0.5px', color: colour.ink, whiteSpace: 'nowrap' } });
        el.append(lab);
      }
      const T = starts(n, tIn + SEG.lead, SEG.gap, false);
      const tLab = T[n - 1] - SEG.gap / 3;   // the hub total arrives with the last segments (clip07@650, between 648 and 654)
      return {
        el, box,
        seek(t) {
          t += 1e-4;
          segs.forEach((g, k) => { const v = t >= T[k] ? 'visible' : 'hidden'; if (g._v !== v) { g.setAttribute('visibility', v); g._v = v; } });
          if (lab) applyPart(lab, partAt(S, t - tLab, 'fade'));
        },
      };
    }

    // ---- grid
    const count = Math.max(1, Math.round(params.count || 7));
    const of = Math.max(count, Math.round(params.of || Math.ceil(count / GRID.cols) * GRID.cols));
    const cols = Math.min(GRID.cols, of), rowsN = Math.ceil(of / cols);
    const cCap = COUNT_CAP, cSize = cCap / cap;
    const lSize = cSize * 0.42;
    const headH = cCap + 56;
    // a tall grid sets its cells smaller so the count and the grid stay inside 0.92 of the stage (by eye)
    const stg = layout.stage[ctx.mode === 'full' ? 'full' : 'split'];
    const fitCell = ((stg.bottom - stg.top) * 0.92 - headH - 2 * GRID.pad - (rowsN - 1) * GRID.gapPx) / rowsN;
    const cell = Math.max(28, Math.min(GRID.cell, fitCell)), gapPx = GRID.gapPx * (cell / GRID.cell);
    const gw = cols * cell + (cols - 1) * gapPx + 2 * GRID.pad, gh = rowsN * cell + (rowsN - 1) * gapPx + 2 * GRID.pad;
    const box = place(ctx, gw, gh + headH);
    const s = box.s;
    const root = h('div', { style: { position: 'absolute', left: `${box.x + (box.w - gw * s) / 2}px`, top: `${box.y}px`, width: `${gw}px`, height: `${gh + headH}px`, transform: s < 0.999 ? `scale(${s})` : '', transformOrigin: '0 0' } });
    el.append(root);
    const fill = hexOk(params.color) ? params.color : ACCENTS[0];
    // the running count over the grid: the number and its word on one baseline
    const cnt = h('span', { style: { font: sansFont(cSize, fonts.weight.display), letterSpacing: `${(-0.04 * cSize).toFixed(1)}px`, fontVariantNumeric: 'tabular-nums' } });
    const line = h('div', { style: { position: 'absolute', left: `${gw / 2}px`, top: `${(cCap - cSize * fonts.M.base).toFixed(1)}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap', color: ink, lineHeight: '1' } }, cnt);
    if (params.label) line.append(h('span', { text: ` ${params.label}`, style: { font: sansFont(lSize, fonts.weight.display), marginLeft: '6px' } }));
    root.append(line);
    const g = h('div', { style: { position: 'absolute', left: '0', top: `${headH}px`, width: `${gw}px`, height: `${gh}px`, borderRadius: `${GRID.radius}px`, background: GRID_CARD, boxShadow: colour.shadow.card } });
    root.append(g);
    const cells = [];
    for (let k = 0; k < of; k++) {
      const cx = GRID.pad + (k % cols) * (cell + gapPx), cy = GRID.pad + Math.floor(k / cols) * (cell + gapPx);
      const c = h('div', { style: { position: 'absolute', left: `${cx}px`, top: `${cy}px`, width: `${cell}px`, height: `${cell}px`, borderRadius: `${GRID.cellR * (cell / GRID.cell)}px`, background: GRID_CELL } });
      g.append(c); cells.push(c);
    }
    const t0 = adds.length ? Math.max(tIn, adds[0]) : snap(tIn + GRID.lead);
    const dur = Math.max(GRID.min, Math.min(GRID.max, count * GRID.per));
    return {
      el, box,
      seek(t) {
        t += 1e-4;
        // linear: each unit of the number is a visible cell [X09]
        const p = clamp01((t - t0) / dur);
        const nOn = Math.floor(p * count + 1e-6);
        cells.forEach((c, k) => setStyle(c, 'background', k < nOn ? fill : GRID_CELL));
        const str = String(nOn);
        if (cnt._t !== str) { cnt.textContent = str; cnt._t = str; }
      },
    };
  },
};
