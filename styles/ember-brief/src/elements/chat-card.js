// A short conversation with an assistant, redrawn in the house style (research/graphics.md G14; colour.md C14;
// motion.md M16): a dark card on the column, an optional header strip with the chat's name, and 1 to 3 messages.
// The user's message sits at the right in a raised bubble; the assistant's reply is plain cream text at the
// left (clip31@610). Nobody carries a sender label in the reference: the side says who speaks.
// The card and the first message arrive together through the shared blur entrance. Each later message comes
// through the same blur inside the card: 5 frames after the one before (clip36@906-915), or on the word given
// by a `next` beat (clip31@561, @575).
//   next  the next message that is not on screen yet arrives at this word
// Messages are the speaker's own words or a real exchange. Never invent a quote. Never draw a product's mark.
import { layout, fonts, colour } from '../tokens.js';
import { place, textAt, measureText, fontFor, fitCap, enterAt, applyState } from '../common.js';
import { card } from '../card.js';
import { UI, lift } from './ui-card.js';
import { wrapText } from './prompt-box.js';

// TOKENS (research/graphics.md G14; frame px on the 1000 px card; clip31@610 unless noted)
const G = {
  text: { cap: 35.4, lead: 62, weight: fonts.weight.light, track: UI.track.light },   // 51 px text at weight 400 [clip31@610: 49 px, pitch 60 to 62; clip36@1020: 53 px, pitch 63]
  head: { h: 118, base: 79.5 },   // header strip and the baseline of its text; a 2 px divider under it
  padX: 54,                       // header text and reply text, from the card edge
  top: 38,                        // header strip (or card top) to the first message
  gap: 49,                        // between messages; a reply's box ends 5 px under its last baseline [clip36@1020: 76]
  descent: 5,
  bottom: 40,                     // last message to the card bottom
  bubble: { right: 46, padX: 36, padTop: 31, padBottom: 33.6, radius: 33, maxW: 850,   // [radius 32.8; one line 100 px tall; clip36@1020: 852 wide, 43 from the edge]
    raise: [17, 17, 17] },        // 17 levels above the card fill [#282828 on #171717; clip36@1020: 19; clip39@700: 14]
  lag: 5 / 30,                    // a message follows the one before by 5 frames [clip36@906-915]
};

export default {
  type: 'chat-card',
  label: 'Chat card',
  slots: ['graphic'],
  params: {
    title: { type: 'string', optional: true, maxChars: 30 },   // the chat's name, in the header strip
    messages: { type: 'array', min: 1, max: 3, of: {
      from: 'enum:user|assistant',                               // user: bubble at the right; assistant: plain text at the left
      text: { type: 'string', maxChars: 70 },                    // 2 lines as a rule (about 31 characters a line in a bubble, 36 in a reply), 3 at most
    } },
  },
  beats: { next: {} },

  build(ctx) {
    const { S, params: p, beats, tIn } = ctx; const { h } = S.kit;
    const W = layout.column.w, T = G.text, B = G.bubble;
    const font = fontFor(T.cap, T.weight);
    const msgs = (p.messages || []).slice(0, 3);

    // ---- measure, top to bottom
    let y = (p.title ? G.head.h : 0) + G.top;
    const laid = msgs.map((m) => {
      const user = m.from === 'user';
      const lines = wrapText(m.text, font, user ? B.maxW - B.padX * 2 : W - G.padX * 2, T.track);
      if (lines.length > 3) S.warn(`chat-card: a message runs to ${lines.length} lines; keep it to 3`);
      const textH = T.cap + (lines.length - 1) * T.lead;
      const hh = user ? B.padTop + textH + B.padBottom : textH + G.descent;
      const w = user ? Math.ceil(Math.max(...lines.map((s) => measureText(s, font, T.track)))) + B.padX * 2 : W - G.padX * 2;
      const it = { user, lines, x: user ? W - B.right - w : G.padX, y, w, h: hh };
      y += hh + G.gap;
      return it;
    });
    const H = Math.round(y - G.gap + G.bottom);
    const box = place(ctx, W, H);
    const root = h('div.eb-chat', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${W}px`, height: `${H}px`, transformOrigin: '0 0', transform: box.s === 1 ? 'none' : `scale(${box.s})` } });
    const el = card(S, { x: 0, y: 0, w: W, h: H, kind: 'dark' });
    root.append(el);

    if (p.title) {
      const cap = fitCap(p.title, T.cap, T.weight, W - G.padX * 2, T.track);
      el.append(textAt(S, { text: p.title, x: G.padX, y: G.head.base, cap, weight: T.weight, align: 'left', tracking: T.track }),
        h('div', { style: { position: 'absolute', left: '0', top: `${G.head.h}px`, width: `${W}px`, height: '2px', background: colour.card.stroke } }));
    }

    // ---- messages: each in its own wrapper so it can arrive on its own
    const nexts = beats.filter((b) => b.do === 'next').map((b) => b.t);
    let prev = tIn;
    const parts = laid.map((m, k) => {
      const wrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, transformOrigin: `${m.x + m.w / 2}px ${m.y + m.h / 2}px` } });
      const tx = m.user ? m.x + B.padX : m.x, ty = m.y + (m.user ? B.padTop : 0) + T.cap;
      if (m.user) wrap.append(h('div', { style: { position: 'absolute', left: `${m.x}px`, top: `${m.y}px`, width: `${m.w}px`, height: `${m.h}px`, borderRadius: `${B.radius}px`, background: lift(colour.card.fill, B.raise) } }));
      m.lines.forEach((s, i) => wrap.append(textAt(S, { text: s, x: tx, y: ty + i * T.lead, cap: T.cap, weight: T.weight, align: 'left', tracking: T.track })));
      el.append(wrap);
      const t0 = k === 0 ? tIn : Math.max(prev, nexts.length ? nexts.shift() : prev + G.lag);
      prev = t0;
      return { wrap, t0 };
    });
    if (nexts.length) S.warn(`chat-card: ${nexts.length} "next" beat(s) have no message left to show`);

    return {
      el: root, box: { x: box.x, y: box.y, w: box.w, h: box.h },
      seek(t) {
        // the first message rides the card's own entrance
        for (let k = 1; k < parts.length; k++) applyState(parts[k].wrap, enterAt(S, t - parts[k].t0));
      },
    };
  },
};
