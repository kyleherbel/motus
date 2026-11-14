// A prompt the viewer should copy (research/graphics.md G16, G14; colour.md C14): a dark card on the column,
// the prompt in cream in the light weight, wrapped here to at most 6 lines, a small muted plus at the lower
// left and an accent send button at the lower right.
// The text is never typed in the reference. It is on the card when the card arrives (clip29@690, clip35@926),
// or the card arrives empty and the whole text comes through a short blur at a word (clip34@952, clip38@833):
// give `at` for that.
//   outline  an accent box round the whole card [G13: clip34@482]
// The prompt is the speaker's own. Never invent one.
import { layout, fonts, colour } from '../tokens.js';
import { place, textAt, measureText, fontFor, enterAt, applyState } from '../common.js';
import { card } from '../card.js';
import { UI, outlineBox, seekOutline } from './ui-card.js';

// TOKENS (research/graphics.md G16; frame px on the 1000 px card; clip34@1000 unless noted)
export const PROMPT = {
  text: { cap: 44.4, lead: 75, weight: fonts.weight.light, track: UI.track.light },   // 64 px text at weight 400, line pitch 75 [clip29@780: 64 px, pitch 77]
  padX: 38,                       // text box left and right
  top: 46,                        // first line's cap top under the card top [clip29@780: 38]
  under: 41,                      // last baseline to the top of the send button [clip29@780: 53]
  send: { size: 80, radius: 22, right: 26, bottom: 24 },      // [G16: 80 px r 21 to 23, 26 px from the right edge]
  arrow: { stroke: 5, top: 27, bottom: 52, half: 11 },         // a white up arrow, round ends: stem 25 px, head 22 px wide and 11 px tall
  plus: { size: 26, stroke: 3, cx: 49.5 },                     // a muted plus, centred on the button's height
  maxLines: 6,
  textEnter: { from: 20, scaleFrom: 1 },                       // the late text rises about 20 px, at full size; by eye [clip34@952-961]
};

/** Greedy line breaking by measured width. */
export function wrapText(text, font, maxW, tracking = 0) {
  const lines = []; let cur = '';
  for (const w of String(text).trim().split(/\s+/)) {
    const trial = cur ? `${cur} ${w}` : w;
    if (cur && measureText(trial, font, tracking) > maxW) { lines.push(cur); cur = w; } else cur = trial;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** The accent send button with its white up arrow [G16]. */
function sendButton(S, { x, y }) {
  const B = PROMPT.send, A = PROMPT.arrow, c = B.size / 2, r = A.stroke / 2;
  return S.kit.h('div', { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${B.size}px`, height: `${B.size}px`, borderRadius: `${B.radius}px`, background: colour.accent },
    html: `<svg viewBox="0 0 ${B.size} ${B.size}" width="${B.size}" height="${B.size}" style="display:block"><path d="M${c} ${A.bottom - r}V${A.top + r + 0.5}M${c - A.half + r} ${A.top + A.half}L${c} ${A.top + r + 0.5}L${c + A.half - r} ${A.top + A.half}" fill="none" stroke="${colour.paper}" stroke-width="${A.stroke}" stroke-linecap="round" stroke-linejoin="round"/></svg>` });
}

export default {
  type: 'prompt-box',
  label: 'Prompt box',
  slots: ['graphic'],
  params: {
    text: { type: 'string', maxChars: 150 },                   // 26 to 30 characters a line, 6 lines
    at: 'word?',                                               // the word the text arrives on; default: with the card
  },
  beats: { outline: {} },

  build(ctx) {
    const { S, params: p, beats, tIn } = ctx; const { h } = S.kit;
    const G = PROMPT, W = layout.column.w;
    const font = fontFor(G.text.cap, G.text.weight);
    const lines = wrapText(p.text, font, W - G.padX * 2, G.text.track);
    if (lines.length > G.maxLines) S.warn(`prompt-box: the prompt runs to ${lines.length} lines; the reference shows up to ${G.maxLines} at this size. Shorten it.`);
    const lastBase = G.top + G.text.cap + (lines.length - 1) * G.text.lead;
    const H = Math.round(lastBase + G.under + G.send.size + G.send.bottom);
    const box = place(ctx, W, H);
    const root = h('div.eb-prompt', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${W}px`, height: `${H}px`, transformOrigin: '0 0', transform: box.s === 1 ? 'none' : `scale(${box.s})` } });
    const el = card(S, { x: 0, y: 0, w: W, h: H, kind: 'dark' });
    root.append(el);

    const text = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${lastBase + 20}px`, transformOrigin: `${W / 2}px ${(G.top + lastBase) / 2}px` } });
    lines.forEach((s, i) => text.append(textAt(S, { text: s, x: G.padX, y: G.top + G.text.cap + i * G.text.lead, cap: G.text.cap, weight: G.text.weight, align: 'left', tracking: G.text.track })));
    el.append(text);

    const by = H - G.send.bottom - G.send.size, cy = by + G.send.size / 2, P = G.plus;
    const arm = (w, hh) => h('div', { style: { position: 'absolute', left: `${P.cx - w / 2}px`, top: `${cy - hh / 2}px`, width: `${w}px`, height: `${hh}px`, borderRadius: `${P.stroke / 2}px`, background: colour.muted } });
    el.append(arm(P.size, P.stroke), arm(P.stroke, P.size), sendButton(S, { x: W - G.send.right - G.send.size, y: by }));

    const marks = beats.filter((b) => b.do === 'outline').map((b) => { const o = outlineBox(S, { x: 0, y: 0, w: W, h: H, radius: 30 }); el.append(o); return { el: o, t: b.t }; });
    let tText = p.at !== undefined ? Math.max(tIn, S.wordTime(p.at)) : tIn;
    if (tText >= ctx.tOut && !ctx.last) { S.warn('prompt-box: "at" names a word after this scene; the text is shown from the start'); tText = tIn; }
    const late = tText > tIn + 1e-6;
    return {
      el: root, box: { x: box.x, y: box.y, w: box.w, h: box.h },
      seek(t) {
        if (late) applyState(text, enterAt(S, t - tText, G.textEnter));
        for (const m of marks) seekOutline(S, m.el, t, m.t);
      },
    };
  },
};
