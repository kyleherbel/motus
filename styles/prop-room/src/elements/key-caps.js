// Keyboard keys that press on their words, and the result appears (research/explain.md X53 "steps", device
// key_caps_press; X68 the control answers on the press frame).
//
// Measured instance clip04@511-556 (panel): two key caps (⌘, V) above a composer bar. A key face is
// 187 x 167 px, white shading to #EFF5F7 at the foot, a 1 px grey rim, over a blue-grey base that shows
// 31 px below it; faces 35 px apart; the label is an 80 px heavy sans in #0D1A28. A press sinks the face 22 px
// on one frame and lights a soft accent glow around it (⌘ 522, V 528, 6 frames apart); the keys stay down
// and come up together on one frame 8 frames after the last press (536-537). The result lands 3 frames after
// the last press (531): here a pasted card grows out of the bar, and a ring pulses from it when it settles
// (543-552) [X72]. Keys light in shortcut order; nothing overshoots [X78].
import { F, fonts, colour, motion } from '../tokens.js';
import { place, setStyle, clamp01, sansFont, measureText } from '../common.js';
import { UI, hexOr, rgbaOf, ringPulse } from './ui-kit.js';

// TOKENS (research/explain.md X68, X72; measured clip04@511-556 unless marked)
const KEY = {
  w: 187, h: 167, base: 31, gap: 35, radius: 24, sink: 22,
  label: 80, ink: '#0D1A28',
  face: 'linear-gradient(to bottom, #FCFCFC 0%, #F7FAFB 45%, #EFF5F7 100%)', rim: '#DFE2E6',
  baseTop: '#D6DBE2', baseSide: '#AEB7C3',
  pad: 52,                    // a word label's side padding when it is wider than the face (by eye)
};
const BAR = { w: 900, h: 197, gapAbove: 95, radius: 26, text: 40, textLeft: 85, capTop: 49, send: 46 };   // composer bar x 90-989, y 486-683
const PASTE = { lineH: 40, size: 26, pad: 26, maxLines: 4, growFrom: 0.58, dur: F(6) };   // the pasted card grows in 531-537 [X59 grow, by eye size]
const TIME = {
  first: F(11),      // first press after the cut (511 -> 522)
  every: F(6),       // presses 6 frames apart (522 -> 528)
  result: F(3),      // result after the last press (528 -> 531)
  release: F(8),     // keys come up after the last press (528 -> 536)
  ring: F(12),       // the ring pulses when the result has settled (531 -> 543)
};
const GLOW = (accent) => `0 0 0 2px ${rgbaOf(accent, 0.35)}, 0 0 34px 8px ${rgbaOf(accent, 0.38)}`;   // by eye on clip04@524

export default {
  type: 'key-caps',
  label: 'Key caps press',
  slots: ['graphic'],
  params: {
    keys: { type: 'array', min: 1, max: 3, of: { type: 'string', maxChars: 6 } },   // '⌘', 'V', 'Enter'
    text: { type: 'string', optional: true, maxChars: 34 },        // the field under the keys (a composer bar)
    result: { type: 'string', optional: true, maxChars: 120 },     // what lands in it when the keys are pressed
    accent: { type: 'string', optional: true, maxChars: 7 },       // the glow, the send button and the ring (#RRGGBB)
  },
  beats: {
    press: {},          // the next key goes down (on its word) [X56]
    result: {},         // the result lands (default 3 frames after the last press)
  },
  build(ctx) {
    const { S, params, beats, tIn } = ctx;
    const { h } = S.kit;
    const accent = hexOr(params.accent, UI.accent);
    const keys = (params.keys || []).map(String);
    const lab = sansFont(KEY.label, fonts.weight.heavy);
    const widths = keys.map((k) => Math.max(KEY.w, Math.ceil(measureText(k, lab) + 2 * KEY.pad)));
    const rowW = widths.reduce((a, b) => a + b, 0) + KEY.gap * (keys.length - 1);
    const hasBar = params.text != null || params.result != null;
    const keysH = KEY.h + KEY.base;

    // the pasted card's lines, wrapped to the bar
    const pasteFont = sansFont(PASTE.size, 500);
    const pasteW = BAR.w - 2 * BAR.textLeft + 40;
    const plines = params.result ? S.kit.wrap(String(params.result).split(/\s+/), pasteW - 2 * PASTE.pad, pasteFont.replace('/1 ', ' ')).slice(0, PASTE.maxLines).map((l) => l.join(' ')) : [];
    const pasteH = plines.length ? plines.length * PASTE.lineH + 2 * PASTE.pad : 0;
    const barH1 = BAR.h + (pasteH ? pasteH + 24 : 0);
    const totalW = Math.max(rowW, hasBar ? BAR.w : 0);
    const totalH = keysH + (hasBar ? BAR.gapAbove + barH1 : 0);   // placed for the final state, so the grown bar stays above the seam
    const box = place(ctx, totalW, totalH);
    const el = h('div.pr-key-caps', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${totalW}px`, height: `${totalH}px`,
      transform: box.s < 0.999 ? `scale(${box.s})` : '', transformOrigin: '0 0' } });

    let x = (totalW - rowW) / 2;
    const caps = keys.map((k, i) => {
      const w = widths[i];
      const base = h('div', { style: { position: 'absolute', left: `${x}px`, top: `${KEY.base}px`, width: `${w}px`, height: `${KEY.h}px`, borderRadius: `${KEY.radius}px`,
        background: `linear-gradient(to bottom, ${KEY.baseTop} 0%, ${KEY.baseTop} 84%, ${KEY.baseSide} 86%, ${KEY.baseSide} 100%)`, boxShadow: '0 18px 28px -16px rgba(40,50,70,0.45)' } });
      const face = h('div', { style: { position: 'absolute', left: `${x}px`, top: '0', width: `${w}px`, height: `${KEY.h}px`, borderRadius: `${KEY.radius}px`, boxSizing: 'border-box',
        background: KEY.face, border: `1px solid ${KEY.rim}` } },
      h('div', { text: k, style: { position: 'absolute', left: '0', right: '0', top: `${(KEY.h / 2 + 5 - (KEY.label * fonts.M.cap) / 2 - KEY.label * (fonts.M.base - fonts.M.cap)).toFixed(1)}px`,
        textAlign: 'center', font: lab, color: KEY.ink, whiteSpace: 'nowrap' } }));
      el.append(base, face);
      x += w + KEY.gap;
      return { face };
    });

    // the composer bar and what lands in it
    let bar = null, paste = null, barText = null, ring = null;
    if (hasBar) {
      const by = keysH + BAR.gapAbove, bx = (totalW - BAR.w) / 2;
      bar = h('div', { style: { position: 'absolute', left: `${bx}px`, top: `${by}px`, width: `${BAR.w}px`, height: `${BAR.h}px`, borderRadius: `${BAR.radius}px`,
        background: colour.card, boxShadow: colour.shadow.card } });
      barText = h('div', { text: params.text || '', style: { position: 'absolute', left: `${BAR.textLeft}px`, top: `${BAR.capTop - BAR.text * (fonts.M.base - fonts.M.cap)}px`, whiteSpace: 'nowrap',
        font: sansFont(BAR.text, 500), color: colour.ink } });
      const plus = h('div', { text: '+', style: { position: 'absolute', left: '28px', bottom: '26px', width: `${BAR.send - 8}px`, height: `${BAR.send - 8}px`, borderRadius: '50%',
        boxShadow: `inset 0 0 0 1.5px ${colour.line}`, color: colour.inkSoft, font: `400 26px/${BAR.send - 8}px ${fonts.sans}`, textAlign: 'center' } });
      const send = h('div', { style: { position: 'absolute', right: '26px', bottom: '26px', width: `${BAR.send}px`, height: `${BAR.send}px`, borderRadius: '12px', background: accent } },
        h('div', { style: { position: 'absolute', left: '50%', top: '50%', width: '14px', height: '14px', borderLeft: '3px solid #FFF', borderTop: '3px solid #FFF', transform: 'translate(-50%,-30%) rotate(45deg)' } }));
      bar.append(barText, plus, send);
      if (plines.length) {
        paste = h('div', { style: { position: 'absolute', left: `${(BAR.w - pasteW) / 2}px`, top: '22px', width: `${pasteW}px`, height: `${pasteH}px`, borderRadius: '18px',
          background: '#F6F6F8', boxShadow: `inset 0 0 0 1.5px ${rgbaOf(accent, 0.45)}`, transformOrigin: '50% 100%', visibility: 'hidden' } },
        ...plines.map((ln, i) => h('div', { text: ln, style: { position: 'absolute', left: `${PASTE.pad}px`, top: `${PASTE.pad + i * PASTE.lineH + (PASTE.lineH - PASTE.size) / 2 - 2}px`,
          font: pasteFont, lineHeight: '1', color: colour.inkSoft, whiteSpace: 'nowrap' } })));
        bar.append(paste);
        ring = ringPulse(S, { x: bx, y: by, w: BAR.w, h: barH1, radius: BAR.radius, color: accent });
        el.append(ring.el);
      }
      el.append(bar);
    }

    // timeline: presses on beats, else from 11 frames after the cut, 6 apart; the result and the release follow
    const pb = beats.filter((b) => b.do === 'press').map((b) => b.t);
    const press = keys.map((_, i) => (i < pb.length ? pb[i] : (pb.length ? pb[pb.length - 1] : tIn + TIME.first - TIME.every) + (i - pb.length + 1) * TIME.every));
    if (pb.length > keys.length) S.warn(`key-caps: ${pb.length} press beats for ${keys.length} keys`);
    const last = Math.max(...press);
    const rb = beats.find((b) => b.do === 'result');
    const tRes = rb ? rb.t : last + TIME.result;
    const tUp = Math.max(last, tRes) + TIME.release;

    return {
      el, box,
      seek(t) {
        caps.forEach((c, i) => {
          const down = t >= press[i] && t < tUp;
          setStyle(c.face, 'transform', down ? `translateY(${KEY.sink}px)` : '');
          setStyle(c.face, 'boxShadow', down ? GLOW(accent) : '');
        });
        if (!bar) return;
        const a = t - tRes;
        if (paste) {
          const p = S.E.out(clamp01(a / PASTE.dur));
          setStyle(paste, 'visibility', a >= 0 ? 'visible' : 'hidden');
          setStyle(paste, 'transform', a >= 0 && p < 0.9995 ? `scale(${(PASTE.growFrom + (1 - PASTE.growFrom) * p).toFixed(4)})` : '');
          const hh = BAR.h + (barH1 - BAR.h) * (a >= 0 ? p : 0);
          setStyle(bar, 'height', `${hh.toFixed(2)}px`);
          setStyle(barText, 'transform', a >= 0 ? `translateY(${(hh - BAR.h).toFixed(2)}px)` : '');
          ring.seek(t - tRes - TIME.ring);
        }
      },
    };
  },
};
