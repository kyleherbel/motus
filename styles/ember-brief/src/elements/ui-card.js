// An app screen redrawn in the house style, never a screenshot (research/graphics.md G13-G15, colour.md C14,
// C16, motion.md M16, M17): a dark card on the column with an optional title and 1 to 6 rows. A row is
//   a text row         label, and an optional value in the muted cream at the right
//   a toggle row       label and a pill toggle, off or on
//   a placeholder row  grey bars where the words do not matter (no label); it may carry a toggle
// The card arrives whole through the shared blur entrance: in the reference the rows are not staggered
// inside it (clip29@635, clip31@82, clip34@816, clip37@156: every row clears on the same frame).
//   toggle   a row's toggle flips at a word; without `row` every toggle flips, in reading order [M16]
//   select   a raised fill appears behind a row (the one in use); a later select moves it
//   outline  an accent box points at a row, or at the whole card without `row` [G13]
//   click    a pointer glides to a row and clicks it: its toggle flips, or the row is selected when it has
//            none. The pointer arrives on the word and stays where it clicked (research/explain-composites.md
//            K10, K11: clip37@440-448, clip34@870-890)
// Up to 3 rows are drawn at the size of a settings card with one setting in view (clip29@680, clip34@898);
// 4 to 6 rows at the size of a list (clip31@150, clip37@540).
// Write generic labels. Never copy a product's interface, names or marks.
import { layout, motion, fonts, colour } from '../tokens.js';
import { place, setStyle, textAt, fitCap, measureText, fontFor, expoInOut } from '../common.js';
import { card } from '../card.js';

// TOKENS (research/graphics.md G13, G14, G15; frame px on the 1000 px card)
export const UI = {
  inset: 34,                      // a row's box sits 34 px inside the card edge [G14: clip29@680 row 74..1006]
  textX: 70,                      // text box left; the ink starts about 4 px further in [clip29@680 label ink at card + 74]
  endX: 70,                       // toggles and values end 70 px inside the card edge [clip29@680: track ends 36 px inside the row]
  gap: 36,                        // least space between a label and what sits at the right; by eye
  radius: 24,                     // the row box and its outline [G13: median 25.1 on rows; G15: row radius 23]
  stroke: 5,                      // outline stroke [G13: median 4.8]
  raise: [17, 17, 17],            // a selected row is 17 levels above the card fill [clip29@680 #2D2F33 on #1C1F22, clip34@898 #282828 on #171717]
  // 66.6 px text (cap 46.6 at weight 500), baseline 111 under the card's outer edge, first row 45 under the baseline
  // [clip29@680; title text is 67, 75 and 61 px in clip29, 34, 37]. Weight 500 by stem width: 6.9 px at 67 px text and
  // 8.4 px at 75 px, where the 600 labels beside them measure 8.4 px at 68 px [clip29@680, clip34@898]
  title: { cap: 46.6, top: 64.4, gap: 45, weight: 500 },
  pad: 40,                        // under the last row, and over the first one without a title [clip29@680]
  large: {                        // 1 to 3 rows [clip29@680, clip34@898]
    row: 148, cap: 47.8, weight: fonts.weight.caption,         // 68 px text at weight 600 [clip29@680; clip34@898: 65 px]
    toggle: { w: 150, h: 82, knob: 66 },                       // [G15: clip29@680; the knob measures 66 px]
    bars: { h: 22, gap: 16, w: [[280, 173], [320, 198]] },     // two bars a row, the second dimmer [clip34@898]
  },
  list: {                         // 4 to 6 rows [clip31@150, clip37@540, clip37@395]
    row: 126, cap: 35.9, weight: fonts.weight.light,           // 51.8 px text [clip37@540: 52; clip31@150: 54]; pitch 124 to 131, and 126 lets 5 rows sit under a heading
    toggle: { w: 112, h: 62, knob: 50 },                       // [G15: clip29@1085: 112 x 62, knob 50; clip37@640: 110 x 62]
    bars: { h: 30, w: [0.96, 0.83, 0.72, 0.59] },              // one bar a row, shares of the free width [clip34@590]
  },
  bar: { a: [28, 28, 28], b: [15, 15, 15] },                   // levels above the card fill [clip34@590 #3C3831 on #1F1C19; clip34@898 #343434, #262626 on #171717]; a was [29, 28, 24], neutral in the release palette [C26]
  // letter-spacing in em, from the width of whole lines set again at the same x-height: light text -0.015
  // [clip34@1000 and clip29@780: 9 lines within 1 px]; the 500 title -0.02 [clip29@680 -0.019, clip34@898 -0.023];
  // 600 labels -0.03 [clip29@680 -0.033, clip34@898 -0.027]
  track: { light: -0.015, title: -0.02, label: -0.03 },
  flip: motion.toggle * 1.5,      // 3 frames [verified]; was measured as 4 on one instance:        // knob travel and track colour on the move curve: 4 %, 88 %, 100 % at +0, +2, +4 frames [M17: clip29@653-657]
  selectFade: 3 / 30,             // [M17: clip34@879-882]
  // the pointer [K10, K11]: a plain arrow 44 x 64 px, white with a dark rim; it glides 8 frames on expo.inOut and
  // lands 2 frames after the word's onset (clip37@440-446); the click presses it to 0.86 for 3 frames and the
  // control answers on the landing frame. Its first glide starts 150 px right of and 190 px below the target
  cursor: { w: 44, h: 64, glide: 8 / 30, lead: 6 / 30, press: 3 / 30, pressTo: 0.86, from: [150, 190] },
};

const rgb = (hex) => hex.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16));
export const lift = (hex, d) => `rgb(${rgb(hex).map((v, i) => Math.min(255, v + d[i])).join(',')})`;
export const mixHex = (a, b, k) => { const A = rgb(a), B = rgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };

/** An accent outline box [G13]: stroke inside the rectangle, no fill. Hidden until seekOutline switches it on. */
export function outlineBox(S, { x, y, w, h: hh, radius = UI.radius }) {
  return S.kit.h('div', { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${hh}px`, borderRadius: `${radius}px`,
    boxShadow: `inset 0 0 0 ${UI.stroke}px ${colour.accent}`, display: 'none', pointerEvents: 'none' } });
}
/** Draw an outline that switches on at t0 within 2 frames, no blur [M17]. */
export function seekOutline(S, el, t, t0) {
  const on = t >= t0;
  setStyle(el, 'display', on ? '' : 'none');
  if (on) setStyle(el, 'opacity', S.kit.clamp((t - t0) / motion.toggle).toFixed(3));
}

const ROW = { type: 'number', optional: true, min: 1, max: 6 };

export default {
  type: 'ui-card',
  label: 'App screen card',
  slots: ['graphic'],
  params: {
    title: { type: 'string', optional: true, maxChars: 24 },   // one line
    rows: { type: 'array', min: 1, max: 6, of: {
      label: { type: 'string', optional: true, maxChars: 18 },   // one line; leave out for grey placeholder bars
      value: { type: 'string', optional: true, maxChars: 8 },    // text rows only: shown muted at the right
      toggle: 'enum?:off|on',                                    // the state the row starts in
    } },
  },
  beats: {
    toggle: { row: ROW },                                        // omit row to flip every toggle, in reading order
    select: { row: { ...ROW, optional: false } },
    outline: { row: ROW },                                       // omit row to box the whole card
    click: { row: { ...ROW, optional: false } },                 // a pointer clicks the row: its toggle flips, or it is selected
  },

  build(ctx) {
    const { S, params: p } = ctx; const { kit } = S; const { h } = kit;
    const beats = [...ctx.beats];
    const rows = (p.rows || []).slice(0, 6);
    const T = rows.length <= 3 ? UI.large : UI.list;
    const W = layout.column.w;
    const rowsTop = p.title ? UI.title.top + UI.title.cap + UI.title.gap : UI.pad;
    const H = rowsTop + rows.length * T.row + UI.pad;
    const box = place(ctx, W, H);
    const root = h('div.eb-ui', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${W}px`, height: `${H}px`, transformOrigin: '0 0', transform: box.s === 1 ? 'none' : `scale(${box.s})` } });
    const el = card(S, { x: 0, y: 0, w: W, h: H, kind: 'dark' });
    root.append(el);

    if (p.title) {
      const cap = fitCap(p.title, UI.title.cap, UI.title.weight, W - UI.textX * 2, UI.track.title);
      el.append(textAt(S, { text: p.title, x: UI.textX, y: UI.title.top + UI.title.cap, cap, weight: UI.title.weight, align: 'left', tracking: UI.track.title }));
    }

    const rowX = UI.inset, rowW = W - UI.inset * 2, endX = W - UI.endX;
    const spacing = T.weight === fonts.weight.light ? UI.track.light : UI.track.label;
    let nBars = 0;                                              // placeholder rows so far: their widths alternate
    const parts = rows.map((r, i) => {
      const y = rowsTop + i * T.row, cy = y + T.row / 2;
      const raised = h('div', { style: { position: 'absolute', left: `${rowX}px`, top: `${y}px`, width: `${rowW}px`, height: `${T.row}px`, borderRadius: `${UI.radius}px`, background: lift(colour.card.fill, UI.raise), display: 'none' } });
      el.append(raised);
      let rightX = endX, toggle = null;
      if (r.toggle) {
        const G = T.toggle, pad = (G.h - G.knob) / 2;
        const track = h('div', { style: { position: 'absolute', left: `${endX - G.w}px`, top: `${cy - G.h / 2}px`, width: `${G.w}px`, height: `${G.h}px`, borderRadius: `${G.h / 2}px` } });
        const knob = h('div', { style: { position: 'absolute', left: '0', top: `${pad}px`, width: `${G.knob}px`, height: `${G.knob}px`, borderRadius: '50%' } });
        track.append(knob); el.append(track);
        toggle = { track, knob, from: r.toggle === 'on' ? 1 : 0, x0: pad, x1: G.w - pad - G.knob, flips: [] };
        rightX = endX - G.w;
        if (r.value) S.warn(`ui-card: row ${i + 1} has a toggle, so its value "${r.value}" is not shown`);
      } else if (r.value && r.label) {
        const v = textAt(S, { text: r.value, x: endX, y: cy + T.cap / 2, cap: T.cap, weight: fonts.weight.light, colour: colour.muted, align: 'right', tracking: UI.track.light });
        el.append(v);
        rightX = endX - measureText(r.value, fontFor(T.cap, fonts.weight.light), UI.track.light);
      }
      if (r.value && !r.label) S.warn(`ui-card: row ${i + 1} has a value but no label; the value is not shown`);
      const room = rightX - UI.gap - UI.textX;
      if (r.label) {
        const cap = fitCap(r.label, T.cap, T.weight, room, spacing);
        if (cap < T.cap - 0.01) S.warn(`ui-card: "${r.label}" is too long for its row; it was set smaller`);
        el.append(textAt(S, { text: r.label, x: UI.textX, y: cy + cap / 2, cap, weight: T.weight, align: 'left', tracking: spacing }));
      } else {
        // placeholder bars: pill ends; widths follow a fixed pattern, so the same plan always draws the same card
        const B = T.bars, x = UI.textX + 4, k = nBars++;
        const bar = (bx, by, bw, bh, fill) => h('div', { style: { position: 'absolute', left: `${bx}px`, top: `${by}px`, width: `${Math.max(bh, bw)}px`, height: `${bh}px`, borderRadius: `${bh / 2}px`, background: fill } });
        if (T === UI.large) {
          const [a, b] = B.w[k % B.w.length], top = cy - (B.h * 2 + B.gap) / 2;
          el.append(bar(x, top, Math.min(a, room), B.h, lift(colour.card.fill, UI.bar.a)), bar(x, top + B.h + B.gap, Math.min(b, room), B.h, lift(colour.card.fill, UI.bar.b)));
        } else el.append(bar(x, cy - B.h / 2, (rightX - (r.toggle ? UI.gap : 0) - x) * B.w[k % B.w.length], B.h, lift(colour.card.fill, UI.bar.a)));
      }
      return { y, raised, toggle, selects: [] };
    });

    // ---- beats
    const rowOf = (b) => (Number.isInteger(b.row) && parts[b.row - 1] ? parts[b.row - 1] : null);
    const outlines = [];
    // a click lands 2 frames after its word and then acts as a toggle or a select on that frame [K10]
    const Cu = UI.cursor;
    const clicks = beats.filter((b) => b.do === 'click' && rowOf(b)).map((b) => {
      const r = rowOf(b);
      const land = b.t - Cu.lead + Cu.glide;
      const tx = r.toggle ? endX - T.toggle.w / 2 + 8 : Math.min(endX - 40, UI.textX + 420);
      return { t0: b.t - Cu.lead, land, x: tx, y: r.y + T.row / 2 + 6, r };
    });
    for (const c of clicks) {
      if (c.r.toggle) c.r.toggle.flips.push(c.land);
      else beats.push({ do: 'select', row: parts.indexOf(c.r) + 1, t: c.land });
    }
    beats.sort((a, b) => a.t - b.t);
    const selects = beats.filter((b) => b.do === 'select' && rowOf(b));
    for (const b of beats) {
      const r = rowOf(b);
      if (b.row !== undefined && !r) { S.warn(`ui-card: beat "${b.do}" names row ${b.row}, but the card has ${parts.length}`); continue; }
      if (b.do === 'toggle') {
        const hit = r ? [r] : parts.filter((x) => x.toggle);
        if (r && !r.toggle) { S.warn(`ui-card: row ${b.row} has no toggle to flip`); continue; }
        hit.forEach((x, k) => x.toggle.flips.push(b.t + k * motion.stagger));
      } else if (b.do === 'outline') {
        const o = outlineBox(S, r ? { x: rowX, y: r.y, w: rowW, h: T.row } : { x: 0, y: 0, w: W, h: H, radius: 30 });
        el.append(o); outlines.push({ el: o, t: b.t });
      }
    }
    selects.forEach((b, k) => rowOf(b).selects.push({ t0: b.t, t1: selects[k + 1] ? selects[k + 1].t : Infinity }));

    let cursor = null;
    if (clicks.length) {
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('width', String(Cu.w)); svg.setAttribute('height', String(Cu.h)); svg.setAttribute('viewBox', '0 0 22 32');
      Object.assign(svg.style, { position: 'absolute', left: '0', top: '0', overflow: 'visible', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))', transformOrigin: '0 0', display: 'none' });
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', 'M1.5 1.5 L1.5 25.5 L7.4 19.9 L11.3 29.2 L15.6 27.4 L11.8 18.4 L19.8 18.4 Z');
      path.setAttribute('fill', '#FFFFFF'); path.setAttribute('stroke', '#121316'); path.setAttribute('stroke-width', '1.6'); path.setAttribute('stroke-linejoin', 'round');
      svg.append(path); el.append(svg);
      cursor = svg;
    }
    const cursorAt = (t) => {
      if (t < clicks[0].t0) return null;
      let k = 0;
      while (k + 1 < clicks.length && t >= clicks[k + 1].t0) k++;
      const c = clicks[k];
      const from = k === 0 ? { x: c.x + Cu.from[0], y: c.y + Cu.from[1] } : { x: clicks[k - 1].x, y: clicks[k - 1].y };
      const u = kit.clamp((t - c.t0) / Cu.glide), e = expoInOut(u);
      const press = t >= c.land && t < c.land + Cu.press ? Cu.pressTo : 1;
      return { x: from.x + (c.x - from.x) * e, y: from.y + (c.y - from.y) * e, o: k === 0 ? Math.min(1, u / 0.3) : 1, s: press };
    };
    const C = colour.toggle;
    return {
      el: root, box: { x: box.x, y: box.y, w: box.w, h: box.h },
      seek(t) {
        for (const r of parts) {
          let o = 0;
          for (const s of r.selects) o = Math.max(o, Math.min(kit.clamp((t - s.t0) / UI.selectFade), 1 - kit.clamp((t - s.t1) / UI.selectFade)));
          setStyle(r.raised, 'display', o > 0 ? '' : 'none');
          if (o > 0) setStyle(r.raised, 'opacity', o.toFixed(3));
          const g = r.toggle;
          if (!g) continue;
          let v = g.from, state = g.from;
          for (const t0 of g.flips) { const e = S.E.move(kit.clamp((t - t0) / UI.flip)); state = 1 - state; v += (state - v) * e; }
          setStyle(g.track, 'background', mixHex(C.offTrack, C.onTrack, v));
          setStyle(g.knob, 'background', mixHex(C.offKnob, C.onKnob, v));
          setStyle(g.knob, 'transform', `translateX(${(g.x0 + (g.x1 - g.x0) * v).toFixed(2)}px)`);
        }
        for (const o of outlines) seekOutline(S, o.el, t, o.t);
        if (cursor) {
          const c = cursorAt(t);
          setStyle(cursor, 'display', c ? '' : 'none');
          if (c) {
            setStyle(cursor, 'transform', `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px) scale(${c.s})`);
            setStyle(cursor, 'opacity', c.o >= 1 ? '' : c.o.toFixed(3));
          }
        }
      },
    };
  },
};
