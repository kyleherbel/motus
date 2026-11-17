// A model or option picker that lands on a choice (research/explain.md X53, X61, X69, X72; motion.md M14, M22).
// Device: picker_lands.
//
// Anatomy: a composer with a short request and a picker pill (icon, current option, chevron) beside the send
// button. The dropdown below it opens (fades in, visible at 0.8 contrast on its first frame [M15]) with the current
// option ticked. On a pick the selection jumps one option per step, a step every 4 frames (3-5 measured), each a
// one-frame swap of highlight, tick and pill label while the old row fades for one frame [X61, X69,
// clip15@518-529, clip19@526-538]; it lands on the beat word, where the pill lands from 1.26x and a ring pulse
// grows from it [M14, M22, X72]. With `pointer`, the one arrow pointer enters, the highlight follows the row under
// it, and the landing is its click [X66-X68]. Option names come from the plan; icons are neutral glyphs.
import { F, fonts, colour, motion } from '../tokens.js';
import { setStyle, clamp01, sansFont, measureText, partAt, applyPart } from '../common.js';
import { UI, uiFrame, line, accentOf, pointerTrack, makePointer, makeRing, glyph, beatsOf, ICONS } from './window.js';

// TOKENS (research/explain.md X61, X69; motion.md M14; measured on clip19@491, a composer with an open model dropdown)
export const PICK = {
  comp: { h: 190, textX: 34, textBase: 62, text: 32 },                 // composer 190 px; request 32 px [clip19@491]
  pill: { h: 64, right: 109, bottom: 21, icon: 34, label: 30, padL: 18, padR: 50, fill: '#F0F0EE' },   // [clip19@491]
  send: { d: 66, right: 17, bottom: 21, fill: '#1C1A1A' },             // dark round send [clip19@491]
  drop: { w: 768, over: 11, gap: 35, pad: 30, rowH: 113, rowH1: 84, inset: 18, radius: 20,   // dropdown [clip19@491]
    icon: 46, iconX: 40, textX: 112, label: 33, labelBase: 50, sub: 24, subBase: 87, tick: 23, tickIn: 45, hl: '#F0F0EE' },
  step: F(4),                // one option every 3-5 frames [X61, X69: clip19 3, clip15 5]
  minStep: F(2),             // crowded words compress the steps to no less than 2 frames (by eye)
  fadeOld: 0.4,              // the old row keeps its highlight at 40 % for one frame [clip15@518, by eye level]
  landFrom: 1.26,            // the chosen option lands from 1.26x [M14, M22, X69]
};

const CHEV = '<svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg"><path d="M6 9 L12 15 L18 9" fill="none" stroke="#8A8A90" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK = (c, s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 12.5 L9.5 18.5 L20.5 6" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ARROW_R = '<svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 24 H31.5 M25.5 18 L31.5 24 L25.5 30" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export default {
  type: 'picker',
  label: 'Picker',
  slots: ['graphic'],
  params: {
    options: { type: 'array', min: 2, max: 5, of: { label: { type: 'string', maxChars: 16 }, sub: { type: 'string', optional: true, maxChars: 26 }, icon: `enum?:${ICONS}` } },
    prompt: { type: 'string', optional: true, maxChars: 40 },        // the request in the composer
    selected: { type: 'number', optional: true, min: 0, max: 4 },    // the option ticked when it opens (default 0)
    pointer: 'boolean?',                                             // the pointer drives the highlight and clicks the choice
    accent: { type: 'string', optional: true, maxChars: 7 },         // the landing ring
  },
  beats: {
    open: {},                                                        // the dropdown opens (default: open on the cut)
    pick: { item: { type: 'number', min: 0, max: 4 } },              // the selection lands on this option on this word
  },
  build(ctx) {
    const { S, params, beats, tIn } = ctx;
    const { h } = S.kit;
    const P = PICK, D = P.drop;
    const acc = accentOf(params);
    const opts = (params.options || []).slice(0, 5);
    const W = UI.w;
    const sub = opts.some((o) => o.sub);
    const rowH = sub ? D.rowH : D.rowH1;
    const dropH = D.pad * 2 + opts.length * rowH;
    const dropX = W + D.over - D.w, dropY = P.comp.h + D.gap;
    const H = dropY + dropH;
    const fr = uiFrame(ctx, { w: W, h: H, kind: 'card' });
    fr.card.style.height = `${P.comp.h}px`;
    const comp = fr.card;

    // ---- the composer: request, pill, send
    if (params.prompt) comp.append(line(S, { text: params.prompt, x: P.comp.textX, y: P.comp.textBase, size: P.comp.text, weight: fonts.weight.label, color: colour.ink }));
    const send = h('div', { html: ARROW_R, style: { position: 'absolute', width: `${P.send.d}px`, height: `${P.send.d}px`, borderRadius: '50%', background: P.send.fill, lineHeight: '0',
      left: `${W - P.send.right - P.send.d}px`, top: `${P.comp.h - P.send.bottom - P.send.d}px` } });
    comp.append(send);
    const pillFont = sansFont(P.pill.label, fonts.weight.label);
    const pills = opts.map((o) => {
      const tw = measureText(o.label, pillFont);
      const pw = P.pill.padL + (o.icon ? P.pill.icon + 12 : 0) + tw + P.pill.padR;
      const el = h('div', { style: { position: 'absolute', height: `${P.pill.h}px`, width: `${pw}px`, borderRadius: `${P.pill.h / 2}px`, background: P.pill.fill,
        left: `${W - P.pill.right - pw}px`, top: `${P.comp.h - P.pill.bottom - P.pill.h}px`, display: 'none' } });
      let x = P.pill.padL;
      if (o.icon) { const g = glyph(S, o.icon, P.pill.icon, { letter: o.label }); Object.assign(g.style, { position: 'absolute', left: `${x}px`, top: `${(P.pill.h - P.pill.icon) / 2}px` }); el.append(g); x += P.pill.icon + 12; }
      el.append(line(S, { text: o.label, x, y: P.pill.h / 2 + (P.pill.label * fonts.M.cap) / 2, size: P.pill.label, weight: fonts.weight.label, color: colour.ink }));
      const ch = h('div', { html: CHEV, style: { position: 'absolute', left: `${pw - 40}px`, top: `${P.pill.h / 2 - 11}px`, lineHeight: '0' } });
      el.append(ch);
      comp.append(el);
      return { el, w: pw, box: { x: W - P.pill.right - pw, y: P.comp.h - P.pill.bottom - P.pill.h, w: pw, h: P.pill.h, r: P.pill.h / 2 } };
    });

    // ---- the dropdown
    const drop = h('div.pr-dropdown', { style: { position: 'absolute', left: `${dropX}px`, top: `${dropY}px`, width: `${D.w}px`, height: `${dropH}px`, borderRadius: '31px',
      background: colour.card, boxShadow: colour.shadow.card } });
    const rows = opts.map((o, i) => {
      const y = D.pad + i * rowH;
      const hl = h('div', { style: { position: 'absolute', left: `${D.inset}px`, top: `${y}px`, width: `${D.w - 2 * D.inset}px`, height: `${rowH}px`, borderRadius: `${D.radius}px`, background: D.hl, opacity: '0' } });
      drop.append(hl);
      if (o.icon) { const g = glyph(S, o.icon, D.icon, { letter: o.label }); Object.assign(g.style, { position: 'absolute', left: `${D.iconX}px`, top: `${y + (rowH - D.icon) / 2}px` }); drop.append(g); }
      const tx = o.icon ? D.textX : D.iconX;
      const lb = sub ? D.labelBase : (rowH + D.label * fonts.M.cap) / 2;
      drop.append(line(S, { text: o.label, x: tx, y: y + lb, size: D.label, weight: fonts.weight.label, color: colour.ink }));
      if (o.sub) drop.append(line(S, { text: o.sub, x: tx, y: y + D.subBase, size: D.sub, weight: fonts.weight.label, color: colour.inkSoft }));
      const tick = h('div', { html: CHECK(colour.ink, D.tick + 6), style: { position: 'absolute', left: `${D.w - D.tickIn - D.tick}px`, top: `${y + rowH / 2 - (D.tick + 6) / 2}px`, lineHeight: '0', display: 'none' } });
      drop.append(tick);
      return { hl, tick, y };
    });
    fr.wrap.insertBefore(drop, fr.over);
    const ring = makeRing(S, fr.over, acc);
    const pointer = makePointer(S);
    fr.over.append(pointer.el);

    // ---- times: the opening, then each pick's steps landing on its word
    const tOpen = beatsOf(beats, 'open')[0]?.t ?? null;
    const shown = tOpen ?? tIn;
    const picks = beatsOf(beats, 'pick');
    const sel0 = Math.max(0, Math.min(opts.length - 1, params.selected ?? 0));
    const rowAt = (i) => ({ x: dropX + D.w * 0.72, y: dropY + D.pad + i * rowH + rowH * 0.62 });   // the pointer's tip on a row (by eye) [clip19@491]
    let track = null;
    const steps = [];     // { t, i, land }
    if (params.pointer && picks.length) {
      // the pointer enters onto the current option, then travels to each pick and clicks it
      const stops = [{ t: Math.max(shown + F(4), picks[0].t - motion.pointer.click - motion.pointer.dur - F(2)), ...rowAt(sel0), click: false }];
      for (const p of picks) stops.push({ t: p.t, ...rowAt(p.item), click: true });
      track = pointerTrack(S, Math.max(tIn, shown), stops);
      picks.forEach((p, k) => steps.push({ t: track.times[k + 1], i: Math.min(opts.length - 1, p.item), land: true }));
    } else {
      let cur = sel0, prev = shown;
      for (const p of picks) {
        const to = Math.min(opts.length - 1, p.item);
        const n = Math.abs(to - cur);
        const dir = Math.sign(to - cur);
        const room = p.t - prev - F(1);
        const step = n > 0 ? Math.max(P.minStep, Math.min(P.step, room / n)) : P.step;
        for (let k = 1; k <= n; k++) steps.push({ t: p.t - (n - k) * step, i: cur + dir * k, land: k === n });
        if (n === 0) steps.push({ t: p.t, i: to, land: true });
        cur = to; prev = p.t;
      }
    }
    const lands = steps.filter((s) => s.land);

    const el = h('div.pr-picker', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, fr.wrap);
    return {
      el, box: fr.box,
      seek(t) {
        // the selection now and the one before it
        let sel = sel0, prevSel = null, tSel = -Infinity;
        for (const s of steps) if (t >= s.t) { prevSel = sel; sel = s.i; tSel = s.t; }
        let hover = null;
        const pt = track ? track.at(t) : null;
        if (pt) {
          pointer.seek(pt.x, pt.y, pt.show);
          // the highlight follows the row under the pointer's tip
          const k = Math.floor((pt.y - dropY - D.pad) / rowH);
          if (pt.show && k >= 0 && k < opts.length && pt.x > dropX && pt.x < dropX + D.w) hover = k;
        } else pointer.seek(0, 0, false);
        const open = t >= shown;
        // the dropdown fades in on its opening, 0.8 contrast on the first frame [M15]
        applyPart(drop, tOpen != null ? partAt(S, t - tOpen, 'fade', { dur: F(3) }) : { o: 1, dx: 0, dy: 0, s: 1 });
        setStyle(drop, 'display', open ? '' : 'none');
        const oneFrame = t - tSel < F(1);
        rows.forEach((r, i) => {
          const hl = track ? (hover ?? sel) === i : sel === i;
          const fading = !track && oneFrame && prevSel === i && prevSel !== sel;
          setStyle(r.hl, 'opacity', hl ? '1' : fading ? String(P.fadeOld) : '0');
          setStyle(r.tick, 'display', sel === i ? '' : 'none');
        });
        // the pill shows the selected option; it lands from 1.26x on a landing, with a ring pulse [M14, M22, X72]
        let land = null;
        for (const s of lands) if (t >= s.t) land = s;
        pills.forEach((p, i) => {
          setStyle(p.el, 'display', sel === i ? '' : 'none');
          if (sel === i) {
            const st = land && land.i === i ? partAt(S, t - land.t, 'land', { from: P.landFrom }) : { o: 1, dx: 0, dy: 0, s: 1 };
            applyPart(p.el, st, 'center');
          }
        });
        ring.seek(t, land ? land.t : null, land ? pills[land.i].box : null);
      },
    };
  },
};
