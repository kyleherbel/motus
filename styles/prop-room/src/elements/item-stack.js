// Items stacking in one after another: rows or cards arrive into a list, each settling in about 4 frames,
// about 5 frames apart or on the words that name them (research/explain.md X51, X53, X59-X61; device
// items_stack_in). Repetition and accumulation read as a pile that grows while the clause is spoken.
//
// Anatomy [X55, X59-X61]: the first item (or `start` items) is the anchor on the cut; the rest arrive on `add`
// beats or, without beats, 5 frames apart from 2 frames after the cut. Each slides in from the side, the
// sides alternating (clip09@549-590: right, left, right), on the first visible frame 108 px from rest, then 44,
// 16, 5, 0: the house ease-out over 8 frames, so it is visibly settled in 4. No overshoot [X60, X78].
// A `mark` beat gives one item the accent outline (the "now playing" or chosen state, clip09@551-590).
// Rows are rebuilt generic UI: a white card (radius 20), an accent tile with a monogram, an optional dark tag
// pill, a bold title and a grey line under it [G15, C17, T25].
import { F, fonts, colour, motion } from '../tokens.js';
import { place, setStyle, clamp01, sansFont } from '../common.js';
import { UI, hexOr } from './ui-kit.js';

// TOKENS (research/explain.md X59-X61; measured clip09@545-592 unless marked)
const ROW = {
  w: 939,              // card width, x 70-1009 (clip09@573) [G16 914-939]
  h: 168,              // row height for a tile, a title and one line (the reference media rows are 224 with a third line; by eye)
  hMin: 112,           // rows shrink to this before the stack is scaled down (by eye)
  gap: 13,             // card bottom 517 to next top 530 (clip09@573)
  radius: 20,          // corner radius (clip09@573, by zoom)
  inset: 14,           // tile inset from the card edge (clip09@573)
  tileR: 6,            // tile corner radius (by eye)
  title: 32, meta: 26, // cap height 23 px -> 32 px Inter; grey line 26 px (clip09@573)
  tag: { h: 35, pad: 11, size: 22, r: 8, fill: '#2B2A2E' },   // tag pill (clip09@573)
  outline: 3,          // the marked item's accent outline px (clip09@573)
};
const SLIDE = { dist: 108, dur: F(8) };   // first visible 108 px from rest, settled in 4 frames (clip09@549-553, 566-570, 587-591) [X59]
const GROW = { from: 0.73, dur: F(8) };   // grows first visible at 0.73 for items_stack_in [X59 by device]
const VSLIDE = motion.prop.slide;         // vertical slides use the house 56 px [M12]

export default {
  type: 'item-stack',
  label: 'Items stack in',
  slots: ['graphic'],
  params: {
    items: { type: 'array', min: 2, max: 6, of: {
      title: { type: 'string', maxChars: 26 },   // fits beside a 10-character tag at 32 px bold
      meta: { type: 'string', optional: true, maxChars: 40 },
      tag: { type: 'string', optional: true, maxChars: 10 },
    } },
    start: { type: 'number', optional: true, min: 0, max: 5 },    // items already there on the cut (default 1, the anchor) [X55]
    from: 'enum?:alternate|right|left|below|grow',                // how the rest arrive (default alternate) [X59]
    accent: { type: 'string', optional: true, maxChars: 7 },       // tile and outline colour (#RRGGBB) [C18]
  },
  beats: {
    add: {},                                                       // the next item arrives (on the word that names it) [X56, X61]
    mark: { item: { type: 'number', optional: true, min: 1, max: 6 } },   // outline item n (default: the newest) [clip09]
  },
  build(ctx) {
    const { S, params, beats, mode, tIn } = ctx;
    const { h } = S.kit;
    const items = params.items || [];
    const n = items.length;
    const accent = hexOr(params.accent, UI.accent);
    const start = Math.max(0, Math.min(n, Math.round(params.start ?? 1)));
    const how = params.from || 'alternate';

    // rows shrink before the whole stack is scaled down
    const room = mode === 'full' ? 1209 : 908;
    const rowH = Math.max(ROW.hMin, Math.min(ROW.h, (room - 40 + ROW.gap) / n - ROW.gap));
    const totalH = n * rowH + (n - 1) * ROW.gap;
    const box = place(ctx, ROW.w, totalH);
    const s = box.s;
    const el = h('div.pr-item-stack', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${ROW.w}px`, height: `${totalH}px`,
      transform: s < 0.999 ? `scale(${s})` : '', transformOrigin: '0 0' } });

    const k = rowH / ROW.h;   // inner scale when rows are compact
    const tile = rowH - 2 * ROW.inset;
    const rows = items.map((it, i) => {
      const y = i * (rowH + ROW.gap);
      const row = h('div', { style: { position: 'absolute', left: '0', top: `${y}px`, width: `${ROW.w}px`, height: `${rowH}px`, borderRadius: `${ROW.radius}px`,
        background: colour.card, boxShadow: colour.shadow.card } });
      const mono = (it.title || '?').trim().charAt(0).toUpperCase();
      row.append(h('div', { text: mono, style: { position: 'absolute', left: `${ROW.inset}px`, top: `${ROW.inset}px`, width: `${tile}px`, height: `${tile}px`, borderRadius: `${ROW.tileR}px`,
        background: accent, color: '#FFFFFF', font: sansFont(tile * 0.5, fonts.weight.display), display: 'flex', alignItems: 'center', justifyContent: 'center' } }));
      const tx = ROW.inset + tile + 22;
      const ts = ROW.title * Math.max(0.8, k), ms = ROW.meta * Math.max(0.8, k);
      const lineGap = it.meta ? ms * 1.55 : 0;
      const titleBase = rowH / 2 + (it.meta ? -lineGap / 2 : 0) + ts * fonts.M.cap / 2;
      const line = h('div', { style: { position: 'absolute', left: `${tx}px`, top: `${(titleBase - ts * fonts.M.base).toFixed(1)}px`, display: 'flex', alignItems: 'baseline', gap: '12px', whiteSpace: 'nowrap' } });
      if (it.tag) {
        const T = ROW.tag;
        line.append(h('div', { text: it.tag, style: { font: sansFont(T.size * Math.max(0.8, k), 700), lineHeight: '1', color: accent, background: T.fill, borderRadius: `${T.r}px`,
          padding: `${((T.h - T.size) / 2) * Math.max(0.8, k)}px ${T.pad}px`, transform: `translateY(${(ts * 0.06).toFixed(1)}px)` } }));
      }
      line.append(h('div', { text: it.title, style: { font: sansFont(ts, 700), letterSpacing: '-0.01em', color: colour.ink } }));
      row.append(line);
      if (it.meta) row.append(h('div', { text: it.meta, style: { position: 'absolute', left: `${tx}px`, top: `${(titleBase + lineGap - ms * fonts.M.base).toFixed(1)}px`, whiteSpace: 'nowrap',
        font: sansFont(ms, 500), color: colour.inkSoft } }));
      const ring = h('div', { style: { position: 'absolute', inset: '0', borderRadius: `${ROW.radius}px`, boxShadow: `inset 0 0 0 ${ROW.outline}px ${accent}`, display: 'none' } });
      row.append(ring);
      el.append(row);
      return { row, ring };
    });

    // arrival times: the anchor items on the cut, then `add` beats, then 5 frames apart [X55, X61]
    const adds = beats.filter((b) => b.do === 'add').map((b) => b.t);
    const arrive = items.map((_, i) => {
      if (i < start) return -Infinity;
      const j = i - start;
      if (j < adds.length) return Math.max(tIn, adds[j]);
      const base = adds.length ? Math.max(tIn, adds[adds.length - 1]) : tIn + F(2) - motion.eventGap.ui;
      return base + (j - adds.length + 1) * motion.eventGap.ui;
    });
    if (adds.length > n - start) S.warn(`item-stack: ${adds.length} add beats for ${n - start} items still to come; the extra beats do nothing`);
    const marks = beats.filter((b) => b.do === 'mark').map((b) => ({ t: b.t, item: b.item }));

    return {
      el, box,
      seek(t) {
        let newest = -1;
        rows.forEach((r, i) => {
          const a = t - arrive[i];
          if (a < 0) { setStyle(r.row, 'visibility', 'hidden'); return; }
          setStyle(r.row, 'visibility', 'visible');
          newest = i;
          let tf = '';
          if (Number.isFinite(a)) {
            const j = i - start;
            if (how === 'grow') {
              const p = S.E.out(clamp01(a / GROW.dur)), sc = GROW.from + (1 - GROW.from) * p;
              if (sc < 0.9995) tf = `scale(${sc.toFixed(4)})`;
            } else {
              const side = how === 'alternate' ? (j % 2 === 0 ? 'right' : 'left') : how;
              const p = S.E.out(clamp01(a / SLIDE.dur));
              const d = (side === 'below' ? VSLIDE : SLIDE.dist) * (1 - p);
              if (d > 0.05) tf = side === 'right' ? `translateX(${d.toFixed(2)}px)` : side === 'left' ? `translateX(${(-d).toFixed(2)}px)` : `translateY(${d.toFixed(2)}px)`;
            }
          }
          setStyle(r.row, 'transform', tf);
        });
        // the outline sits on the item the latest mark names (or the newest item at that mark)
        let marked = -1;
        for (const m of marks) if (t >= m.t) marked = m.item ? m.item - 1 : rows.reduce((acc, _, i) => (arrive[i] <= m.t ? i : acc), -1);
        rows.forEach((r, i) => setStyle(r.ring, 'display', i === marked && newest >= i ? '' : 'none'));
      },
    };
  },
};
