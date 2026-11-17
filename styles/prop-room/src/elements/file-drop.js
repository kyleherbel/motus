// Things dropping into a composer or a drop slot (research/explain.md X20, X51, X53, X59-X61, X72).
// Device: drop_into_composer.
//
// Anatomy: the empty composer (or a dashed drop slot in a card) is on screen on the cut. On the beat word the items
// (file chips, images, docs, folders, links) fall in from above one after another, about 4 frames apart, each
// landing from larger into its attachment chip on the entrance curve (visibly settled by frame 4) [X59-X61]; each
// landing is marked by a ring pulse [X72]. The first landing wakes the composer: its outline and send button take
// the accent colour [clip02@384]. Labels come from the plan; icons are neutral glyphs.
import { F, fonts, colour, motion } from '../tokens.js';
import { setStyle, clamp01, sansFont, measureText } from '../common.js';
import { UI, uiFrame, line, accentOf, makeRing, glyph, beatsOf } from './window.js';
import { PROMPT, sendButton, composerFoot } from './prompt.js';

// TOKENS (research/explain.md X59-X61, X72; clip14@460-494, clip02@363-384, clip07@481-494)
export const DROP = {
  stagger: F(4),                  // items dropping into a composer arrive about 4 frames apart [X61]
  settle: F(4),                   // a drop is visibly settled 4 frames in (drop_in median 4 frames) [X59]
  // drops into composers enter as slides from above (first offset median 18 px, p90 156 px) or land from larger;
  // here a 120 px fall from above landing from 1.165x [X59 land median], untilting 4 degrees (fall and tilt by eye)
  // [top10_devices.drop_into_composer; clip14@463-472]
  fall: 120, from: 1.165, tilt: -4,
  head: 140,                      // room above the composer for the fall (by eye)
  comp: { h: 300, pad: 32, hint: 36, hintGap: 64 },   // composer with a chip row, a hint line and the foot (by eye; foot from [clip16@520])
  chip: { h: 84, r: 18, icon: 56, gap: 14, label: 28, meta: 22, padL: 14, padR: 24, fill: '#F3F2EF', maxW: 330 },   // attachment chips (by eye)
  slot: { h: 340, inset: 36, dash: 4, label: 34, icon: 64 },   // a dashed drop slot inside a card (by eye)
  idle: '#D8D6D2',                // the send button before anything is attached (by eye) [clip02@363]
  outline: 3,                     // the composer's accent outline once woken [clip02@384, by eye width]
};
const KINDS = 'file|image|doc|folder|link';

export default {
  type: 'file-drop',
  label: 'File drop',
  slots: ['graphic'],
  params: {
    items: { type: 'array', min: 1, max: 4, of: { label: { type: 'string', maxChars: 14 }, kind: `enum?:${KINDS}`, meta: { type: 'string', optional: true, maxChars: 12 } } },
    target: 'enum?:composer|slot',                                  // a chat composer (default) or a drop slot
    placeholder: { type: 'string', optional: true, maxChars: 30 },  // the composer's hint, or the slot's label
    accent: { type: 'string', optional: true, maxChars: 7 },
  },
  beats: {
    drop: { item: { type: 'number', optional: true, min: 0, max: 3 } },   // one item drops on this word, or all the rest 4 frames apart
  },
  build(ctx) {
    const { S, params, beats, tIn } = ctx;
    const { h } = S.kit;
    const C = DROP.chip;
    const acc = accentOf(params);
    const items = (params.items || []).slice(0, 4);
    const slot = params.target === 'slot';
    const W = UI.w;

    // ---- chips: measure, then lay out in rows (left in the composer, centred in the slot)
    const lf = sansFont(C.label, 650), mf = sansFont(C.meta, fonts.weight.label);
    const sizes = items.map((it) => Math.min(C.maxW, C.padL + C.icon + 14 + Math.max(measureText(it.label, lf), it.meta ? measureText(it.meta, mf) : 0) + C.padR));
    const innerX = slot ? DROP.slot.inset + 24 : DROP.comp.pad, innerW = W - 2 * innerX;
    const rowsOf = [];
    { let cur = [], w = 0; sizes.forEach((s, i) => { if (cur.length && w + C.gap + s > innerW) { rowsOf.push(cur); cur = []; w = 0; } w += (cur.length ? C.gap : 0) + s; cur.push(i); }); if (cur.length) rowsOf.push(cur); }
    const extra = (rowsOf.length - 1) * (C.h + 12);
    const compH = slot ? DROP.slot.h + 2 * DROP.slot.inset + extra : DROP.comp.h + extra;
    const H = DROP.head + compH;
    const fr = uiFrame(ctx, { w: W, h: H, kind: 'card' });
    const card = fr.card;
    Object.assign(card.style, { top: `${DROP.head}px`, height: `${compH}px` });
    const at = [];
    rowsOf.forEach((r, k) => {
      const rw = r.reduce((a, i) => a + sizes[i], 0) + (r.length - 1) * C.gap;
      let x = slot ? (W - rw) / 2 : innerX;
      const y = slot ? DROP.slot.inset + (DROP.slot.h + extra - (rowsOf.length * C.h + (rowsOf.length - 1) * 12)) / 2 + k * (C.h + 12) : DROP.comp.pad + k * (C.h + 12);
      for (const i of r) { at[i] = { x, y }; x += sizes[i] + C.gap; }
    });

    // ---- the target
    let send = null, zone = null, zoneLabel = null;
    if (slot) {
      zone = h('div', { style: { position: 'absolute', left: `${DROP.slot.inset}px`, top: `${DROP.slot.inset}px`, width: `${W - 2 * DROP.slot.inset}px`, height: `${DROP.slot.h + extra}px`,
        borderRadius: '24px', border: `${DROP.slot.dash}px dashed #CFCDC8`, boxSizing: 'border-box', background: '#FAFAF8' } });
      zoneLabel = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' } });
      const g = glyph(S, 'file', DROP.slot.icon, { color: '#B9B7B2' });
      Object.assign(g.style, { position: 'absolute', left: `${(W - 2 * DROP.slot.inset - DROP.slot.icon) / 2}px`, top: `${(DROP.slot.h + extra) / 2 - DROP.slot.icon - 6}px` });
      zoneLabel.append(g, line(S, { text: params.placeholder || 'Drop files here', x: (W - 2 * DROP.slot.inset) / 2, y: (DROP.slot.h + extra) / 2 + 48, size: DROP.slot.label, weight: fonts.weight.body, color: colour.inkSoft, align: 'center' }));
      zone.append(zoneLabel);
      card.append(zone);
    } else {
      const hintY = DROP.comp.pad + rowsOf.length * C.h + (rowsOf.length - 1) * 12 + DROP.comp.hintGap;
      card.append(line(S, { text: params.placeholder || 'Describe the task', x: PROMPT.x - 4, y: hintY, size: DROP.comp.hint, weight: fonts.weight.label, color: '#A3A19C' }));
      for (const e of composerFoot(S, { w: W, h: compH })) card.append(e);
      send = sendButton(S, PROMPT.send.d, DROP.idle);
      Object.assign(send.style, { left: `${W - PROMPT.send.right - PROMPT.send.d}px`, top: `${compH - PROMPT.send.bottom - PROMPT.send.d}px`, boxShadow: 'none' });
      card.append(send);
    }

    // ---- the chips (in the frame's overlay so they can fall in from above the card)
    const chips = items.map((it, i) => {
      const w = sizes[i];
      const el = h('div', { style: { position: 'absolute', left: `${at[i].x}px`, top: `${DROP.head + at[i].y}px`, width: `${w}px`, height: `${C.h}px`, borderRadius: `${C.r}px`,
        background: C.fill, boxShadow: '0 1px 0 rgba(0,0,0,0.04)', transformOrigin: 'center', display: 'none', overflow: 'hidden' } });
      const g = glyph(S, it.kind || 'file', C.icon, {});
      Object.assign(g.style, { position: 'absolute', left: `${C.padL}px`, top: `${(C.h - C.icon) / 2}px` });
      const tx = C.padL + C.icon + 14;
      el.append(g, line(S, { text: it.label, x: tx, y: it.meta ? 38 : C.h / 2 + (C.label * fonts.M.cap) / 2, size: C.label, weight: 650, color: colour.ink }));
      if (it.meta) el.append(line(S, { text: it.meta, x: tx, y: 66, size: C.meta, weight: fonts.weight.label, color: colour.inkSoft }));
      fr.over.insertBefore(el, fr.over.firstChild);
      return { el, box: { x: at[i].x, y: DROP.head + at[i].y, w, h: C.h, r: C.r }, ring: makeRing(S, fr.over, acc) };
    });

    // ---- times: explicit items on their words; a beat without an item drops every remaining item, 4 frames apart
    const drops = beatsOf(beats, 'drop');
    const tAt = new Array(items.length).fill(null);
    for (const b of drops) if (b.item != null && b.item < items.length && tAt[b.item] == null) tAt[b.item] = b.t;
    const rest = drops.find((b) => b.item == null)?.t ?? (drops.length ? null : tIn + F(2));
    if (rest != null) { let k = 0; items.forEach((_, i) => { if (tAt[i] == null) tAt[i] = rest + k++ * DROP.stagger; }); }
    items.forEach((_, i) => { if (tAt[i] == null) S.warn(`file-drop: item ${i} has no drop beat and never lands`); });
    const landed = tAt.filter((x) => x != null).map((x) => x + DROP.settle);
    const tWake = landed.length ? Math.min(...landed) : null;
    const tFirst = tWake != null ? tWake - DROP.settle : null;

    const el = h('div.pr-file-drop', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, fr.wrap);
    return {
      el, box: fr.box,
      seek(t) {
        chips.forEach((c, i) => {
          const t0 = tAt[i];
          const on = t0 != null && t >= t0;
          setStyle(c.el, 'display', on ? '' : 'none');
          if (on) {
            const p = S.E.out(clamp01((t - t0) / motion.prop.dur));
            const dy = -DROP.fall * (1 - p), s = DROP.from + (1 - DROP.from) * p, r = DROP.tilt * (1 - p);
            setStyle(c.el, 'transform', p > 0.9995 ? '' : `translate(0px, ${dy.toFixed(2)}px) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(4)})`);
            setStyle(c.el, 'boxShadow', p > 0.9995 ? '0 1px 0 rgba(0,0,0,0.04)' : `0 ${(18 * (1 - p)).toFixed(1)}px ${(30 * (1 - p)).toFixed(1)}px -12px rgba(0,0,0,${(0.35 * (1 - p)).toFixed(3)})`);
          }
          c.ring.seek(t, t0 != null ? t0 + DROP.settle : null, c.box);
        });
        const woke = tWake != null && t >= tWake;
        if (send) {
          setStyle(send, 'background', woke ? acc : DROP.idle);
          setStyle(card, 'boxShadow', woke ? `inset 0 0 0 ${DROP.outline}px ${acc}, ${colour.shadow.card}` : colour.shadow.card);
        }
        if (zone) {
          setStyle(zone, 'border', woke ? `${DROP.slot.dash}px solid ${acc}` : `${DROP.slot.dash}px dashed #CFCDC8`);
          // the slot's label gives way as the first item starts to fall
          setStyle(zoneLabel, 'display', tFirst != null && t >= tFirst ? 'none' : '');
        }
      },
    };
  },
};
