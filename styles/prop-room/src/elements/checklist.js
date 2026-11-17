// A list whose rows tick off one by one (research/explain.md X51-X53, X55, X61, X72, X77).
// Device: ticks_down_list.
//
// Anatomy: a card or window with an optional heading and up to six rows, each with a status mark and a label.
// On the beat word the rows tick in order, about 5 frames apart [X61]: the mark becomes a filled green circle
// whose check grows in from about half size on the entrance curve [X72]. With `reveal`, the rows are not there on
// the cut: each appears with a spinning pending mark and ticks when the next one appears, the way an agent's steps
// arrive [clip07@520-538, clip02@421-446]. The end state (every row ticked) differs from the anchor [X77].
import { F, fonts, colour, motion } from '../tokens.js';
import { setStyle, clamp01, partAt, applyPart } from '../common.js';
import { UI, uiFrame, line, accentOf, tickMark, beatsOf } from './window.js';

// TOKENS (research/explain.md X59, X61, X72; motion.md M21; clip07@520-538, clip05@91-125)
export const CHECK = {
  stagger: F(5),              // list rows about 5 frames apart [X61; clip05 rows flip every 5-6 frames]
  rowH: 104, gap: 0,          // row pitch (by eye) [clip07@538 scaled to the 914 px card]
  mark: 48, markX: 52,        // status mark 48 px, its centre 52 px in from the card edge (by eye)
  label: 40, labelX: 108,     // label 40 px, 108 px in (by eye) [T25]
  heading: { size: 56, top: 50, after: 34 },   // a heading over the rows (by eye) [T25 headings]
  pad: 34,                    // padding above and below the rows (by eye)
  ring: '#CFCDC8', ringW: 3.5,   // the pending mark: a grey ring (by eye) [clip07@520]
  arc: 0.28,                  // the spinner's gap: a quarter of the ring cut out (by eye)
  checkFrom: 0.48,            // the tick grows from about half size [X72]
  rise: 13,                   // a revealed row rises 13 px as it appears [X59 small rise median]
};

const SPIN = (c, w) => `<svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="${(24 - w / 2).toFixed(2)}" fill="none" stroke="${CHECK.ring}" stroke-width="${w}"/>`
  + `<circle cx="24" cy="24" r="${(24 - w / 2).toFixed(2)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${(2 * Math.PI * (24 - w / 2) * CHECK.arc).toFixed(2)} 999"/></svg>`;

export default {
  type: 'checklist',
  label: 'Checklist',
  slots: ['graphic'],
  params: {
    items: { type: 'array', min: 2, max: 6, of: { label: { type: 'string', maxChars: 26 } } },
    heading: { type: 'string', optional: true, maxChars: 22 },
    kind: 'enum?:card|window',
    title: { type: 'string', optional: true, maxChars: 30 },
    reveal: 'boolean?',                                              // rows arrive one by one with a spinner [clip07@520-538]
    accent: { type: 'string', optional: true, maxChars: 7 },         // the tick colour (default: success green)
  },
  beats: {
    tick: { item: { type: 'number', optional: true, min: 0, max: 5 } },   // one row ticks on this word, or all the rest 5 frames apart
  },
  build(ctx) {
    const { S, params, beats, tIn } = ctx;
    const { h } = S.kit;
    const C = CHECK;
    const done = params.accent ? accentOf(params) : UI.done;
    const items = (params.items || []).slice(0, 6);
    const win = params.kind === 'window';
    const W = UI.w;
    const barH = win ? 60.75 : 0;
    let y = barH;
    let headBase = null;
    if (params.heading) { y += C.heading.top; headBase = y + C.heading.size * fonts.M.cap; y = headBase + C.heading.after; } else y += C.pad;
    const rowY = y;
    const H = Math.round(rowY + items.length * C.rowH + C.pad);
    const fr = uiFrame(ctx, { w: W, h: H, kind: win ? 'window' : 'card', title: params.title || '' });
    if (headBase != null) fr.card.append(line(S, { text: params.heading, x: C.markX - C.mark / 2, y: headBase, size: C.heading.size, weight: fonts.weight.display, color: colour.ink, tracking: -0.02 * C.heading.size }));

    const rows = items.map((it, i) => {
      const top = rowY + i * C.rowH;
      const el = h('div', { style: { position: 'absolute', left: '0', top: `${top}px`, width: `${W}px`, height: `${C.rowH}px` } });
      const pend = h('div', { html: SPIN(params.reveal ? done : C.ring, C.ringW), style: { position: 'absolute', left: `${C.markX - C.mark / 2}px`, top: `${(C.rowH - C.mark) / 2}px`, width: `${C.mark}px`, height: `${C.mark}px`, lineHeight: '0' } });
      if (!params.reveal) pend.firstChild.lastChild.remove();   // a plain grey ring when nothing spins
      const tick = tickMark(S, C.mark, done);
      Object.assign(tick.style, { position: 'absolute', left: `${C.markX - C.mark / 2}px`, top: `${(C.rowH - C.mark) / 2}px`, display: 'none', transformOrigin: 'center' });
      el.append(pend, tick, line(S, { text: it.label, x: C.labelX, y: C.rowH / 2 + (C.label * fonts.M.cap) / 2, size: C.label, weight: fonts.weight.body, color: colour.ink }));
      fr.card.append(el);
      return { el, pend, tick };
    });

    // ---- times: explicit rows on their words; a beat without an item ticks every remaining row, 5 frames apart
    const ticks = beatsOf(beats, 'tick');
    const tAt = new Array(items.length).fill(null);
    for (const b of ticks) if (b.item != null && b.item < items.length && tAt[b.item] == null) tAt[b.item] = b.t;
    // with no beat at all: the first row appears 2 frames after the cut [X55], or a plain list starts ticking 8 frames in (by eye)
    const rest = ticks.find((b) => b.item == null)?.t ?? (ticks.length ? null : tIn + (params.reveal ? F(2) + C.stagger : F(8)));
    if (rest != null) { let k = 0; items.forEach((_, i) => { if (tAt[i] == null) tAt[i] = rest + k++ * C.stagger; }); }
    // revealed rows appear when the row before ticks (the first one a stagger before its own tick) [clip07@520-532]
    const tShow = items.map((_, i) => {
      if (!params.reveal) return -Infinity;
      const prev = i > 0 ? tAt[i - 1] : null;
      const own = tAt[i] != null ? tAt[i] - C.stagger : null;
      return Math.max(tIn, prev ?? own ?? tIn);
    });

    const el = h('div.pr-checklist', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, fr.wrap);
    return {
      el, box: fr.box,
      seek(t) {
        rows.forEach((r, i) => {
          const shown = t >= tShow[i];
          setStyle(r.el, 'display', shown ? '' : 'none');
          if (!shown) return;
          if (params.reveal) applyPart(r.el, partAt(S, t - tShow[i], 'slide', { dist: C.rise }));
          const t0 = tAt[i];
          const ticked = t0 != null && t >= t0;
          setStyle(r.pend, 'display', ticked ? 'none' : '');
          setStyle(r.tick, 'display', ticked ? '' : 'none');
          if (!ticked && params.reveal) {
            // the spinner turns 14 degrees a frame [M21]
            const deg = (motion.spin.degPerFrame * 29.97 * Math.max(0, t - tShow[i])) % 360;
            setStyle(r.pend.firstChild, 'transform', `rotate(${(deg - 90).toFixed(1)}deg)`);
          }
          if (ticked) {
            // the filled tick replaces the ring on the tick frame and grows from about half size [X72]
            const s = C.checkFrom + (1 - C.checkFrom) * S.E.out(clamp01((t - t0) / motion.prop.dur));
            setStyle(r.tick, 'transform', s > 0.9998 ? '' : `scale(${s.toFixed(4)})`);
          }
        });
      },
    };
  },
};
