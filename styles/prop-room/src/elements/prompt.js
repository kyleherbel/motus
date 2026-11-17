// A chat composer where a short request types and is sent (research/explain.md X51, X53, X62-X65, X68, X78).
// Device: prompt_typed_send.
//
// Anatomy: the empty composer is on screen on the cut with its caret, plus/at glyphs, a small label and the send
// button. On a word onset the request types at about 1.6 characters per frame, 1-2 every frame, never a mistake or
// a backspace; a slash-command chip, when the plan names a skill, types first in the accent colour [X62, X63, X78].
// The caret is a thin accent bar at the insertion point that blinks once typing stops. On the send word the button
// dips, then the card, and an accent band runs along the card's top edge [clip16@528-534]; optionally the one
// pointer enters and clicks send [X67, X68]. An answer, when given, streams in a card below at about 6.5
// characters per frame, faster than the user types [X65].
import { F, FPS, fonts, colour, motion } from '../tokens.js';
import { setStyle, clamp01, sansFont, measureText } from '../common.js';
import { UI, uiFrame, line, accentOf, pointerTrack, makePointer, beatsOf, POINTER } from './window.js';

// TOKENS (research/explain.md X62, X65; measured on clip16@480-534, a prompt card on a pale plate)
export const PROMPT = {
  size: 58, weight: 700, lineH: 70,       // request text: 58 px bold, 70 px line pitch [clip16@484, @520]
  x: 60, base: 101,                       // text origin 60 px in, first baseline 101 px under the card top [clip16@480-520]
  minLines: 2,                            // the card keeps room for two lines: 428 px tall [clip16@520]
  h2: 428,
  caret: { w: 4, up: 50, down: 10 },      // a 4 px accent bar from 50 px above the baseline to 10 below [clip16@480, @520]
  blink: F(8),                            // the caret blinks on 8, off 8 frames once typing stops (by eye) [X63]
  send: { d: 88, right: 44, bottom: 30 }, // send button 88 px across, 44 px in from the right, 30 up [clip16@520]
  foot: { base: 52, size: 30, glyph: 48, glyphColour: '#9D9D9D' },   // bottom row baseline 52 px up; label 30 px, glyphs 36 px tall [clip16@520]
  rate: motion.typing.charsPerFrame,      // 1.6 characters per frame [X62]
  stream: 6.5,                            // machine answers stream 5.2-8.0 characters per frame [X65]
  answer: { size: 40, lineH: 54, pad: 44, gap: 24, after: F(6) },   // answer card below; sizes and delay by eye
  // the send press: the button dips to 0.8 for 2 frames, then the card to 0.97 for 2, then an accent band 4-8 px
  // thick runs along the top edge [clip16@528-534]
  press: { button: 0.8, card: 0.97, band: [4, 8] },
  chipTint: 0.12,                         // the slash chip's pale accent fill (by eye)
  from: { x: 260, y: 70 },                // the pointer enters from the right to the send button [clip16@522-526]
};

const ARROW_UP = '<svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path d="M24 35 V13 M14 22.5 L24 12.5 L34 22.5" fill="none" stroke="#FFFFFF" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** The round send button (accent fill, white up arrow), d px across. */
export function sendButton(S, d, fill) {
  return S.kit.h('div', { html: ARROW_UP, style: { position: 'absolute', width: `${d}px`, height: `${d}px`, borderRadius: '50%', background: fill, lineHeight: '0',
    boxShadow: `0 8px 18px -10px ${fill}` } });
}

/** The composer's foot: "+" and "@" glyphs at the left, a small grey label before the send button. */
export function composerFoot(S, { w, h, label }) {
  const P = PROMPT, base = h - P.foot.base, out = [];
  out.push(line(S, { text: '+', x: P.x - 8, y: base + 2, size: P.foot.glyph, weight: 400, color: P.foot.glyphColour }));
  out.push(line(S, { text: '@', x: P.x + 44, y: base + 4, size: P.foot.glyph * 0.92, weight: 500, color: P.foot.glyphColour }));
  if (label) out.push(line(S, { text: label, x: w - P.send.right - P.send.d - 26, y: base, size: P.foot.size, weight: 650, color: colour.inkSoft, align: 'right' }));
  return out;
}

/** Greedy word wrap with the page's own text measure. */
export function wrapText(text, font, maxW, tracking = 0) {
  const words = String(text).split(/\s+/).filter(Boolean), lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && measureText(next, font, tracking) > maxW) { lines.push(cur); cur = w; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Characters typed by time t for a span starting at t0: 1-2 every frame at `rate` per frame [X62]. */
export const typedAt = (t, t0, rate, total) => {
  if (t < t0) return 0;
  const f = Math.floor((t - t0) * FPS + 1e-4);
  return Math.min(total, Math.floor(rate * (f + 1)));
};

export default {
  type: 'prompt',
  label: 'Prompt',
  slots: ['graphic'],
  params: {
    text: { type: 'string', maxChars: 48 },                         // the request: short and plausible (median 21, p90 38 characters) [X62, X63]
    chip: { type: 'string', optional: true, maxChars: 12 },         // a slash-command chip typed first, "/name" [X63]
    label: { type: 'string', optional: true, maxChars: 16 },        // a small grey label beside send ("Ask first")
    answer: { type: 'string', optional: true, maxChars: 140 },      // a machine answer that streams after send [X65]
    kind: 'enum?:card|window',                                      // the composer alone, or inside a window
    title: { type: 'string', optional: true, maxChars: 30 },        // window title
    heading: { type: 'string', optional: true, maxChars: 26 },      // a question above the composer (window)
    pointer: 'boolean?',                                            // the pointer enters and clicks send [X67, X68]
    accent: { type: 'string', optional: true, maxChars: 7 },        // caret, chip and send colour
  },
  beats: {
    type: {},        // typing starts on this word (default: 2 frames after the cut) [X63]
    send: {},        // the send button fires on this word [X68]
    answer: {},      // the answer starts streaming (default: 6 frames after send) [X65]
  },
  build(ctx) {
    const { S, params, beats, tIn } = ctx;
    const { h } = S.kit;
    const P = PROMPT;
    const acc = accentOf(params);
    const W = UI.w;
    const font = sansFont(P.size, P.weight);
    const chip = params.chip ? (params.chip.startsWith('/') ? params.chip : `/${params.chip}`) : '';
    const full = (chip ? `${chip} ` : '') + (params.text || '');
    const win = params.kind === 'window';
    const inset = win ? 28 : 0;
    const cw = W - 2 * inset;                       // the composer's width (inset inside a window)
    const lines = wrapText(full, font, cw - 2 * P.x);
    if (lines.length > 3) S.warn(`prompt: "${params.text}" wraps to ${lines.length} lines; keep it to 3`);
    const L = Math.max(P.minLines, lines.length);
    const cH = P.h2 + (L - P.minLines) * P.lineH;

    // the window variant: title bar and a heading above the composer, which becomes an inset box
    const barH = win ? 60.75 : 0;
    const headH = win && params.heading ? 120 : 0;
    const ansFont = sansFont(P.answer.size, fonts.weight.label);
    const ansLines = params.answer ? wrapText(params.answer, ansFont, W - 2 * P.answer.pad) : [];
    const ansH = ansLines.length ? P.answer.pad * 2 + (ansLines.length - 1) * P.answer.lineH + P.answer.size * 0.8 : 0;
    const frameH = win ? barH + headH + cH + inset : cH;
    const totalH = frameH + (ansH ? P.answer.gap + ansH : 0);

    const fr = uiFrame(ctx, { w: W, h: totalH, kind: win ? 'window' : 'card', title: params.title || '' });
    // the uiFrame card spans the whole height; resize it to the composer frame and hang the answer card below
    fr.card.style.height = `${frameH}px`;
    const comp = win
      ? h('div', { style: { position: 'absolute', left: `${inset}px`, top: `${barH + headH}px`, width: `${cw}px`, height: `${cH}px`, borderRadius: '24px', boxShadow: `inset 0 0 0 2px ${colour.line}`, background: '#FFFFFF' } })
      : fr.card;
    if (win) {
      if (params.heading) fr.card.append(line(S, { text: params.heading, x: W / 2, y: barH + headH * 0.62, size: 50, weight: 650, color: colour.ink, align: 'center' }));
      fr.card.append(comp);
    }
    // request lines; the chip characters render in the accent colour on a pale accent pill once complete
    const lineEls = lines.map((s, i) => {
      const el = line(S, { text: '', x: P.x, y: P.base + i * P.lineH, size: P.size, weight: P.weight, color: colour.ink });
      comp.append(el);
      return el;
    });
    const caret = h('div', { style: { position: 'absolute', width: `${P.caret.w}px`, height: `${P.caret.up + P.caret.down}px`, background: acc, borderRadius: '1px' } });
    comp.append(caret);
    for (const el of composerFoot(S, { w: cw, h: cH, label: params.label })) comp.append(el);
    const send = sendButton(S, P.send.d, acc);
    Object.assign(send.style, { left: `${cw - P.send.right - P.send.d}px`, top: `${cH - P.send.bottom - P.send.d}px` });
    comp.append(send);
    const band = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '100%', height: '0', background: acc, display: 'none' } });
    comp.append(band);

    // the answer card
    let ans = null;
    if (ansLines.length) {
      ans = h('div', { style: { position: 'absolute', left: '0', top: `${frameH + P.answer.gap}px`, width: `${W}px`, height: `${ansH}px`, borderRadius: '31px', background: colour.card,
        boxShadow: colour.shadow.card, display: 'none' } });
      ans.lines = ansLines.map((s, i) => { const el = line(S, { text: '', x: P.answer.pad, y: P.answer.pad + P.answer.size * 0.75 + i * P.answer.lineH, size: P.answer.size, weight: fonts.weight.label, color: colour.ink }); ans.append(el); return el; });
      fr.wrap.insertBefore(ans, fr.over);
    }

    // ---- times
    const tType = beatsOf(beats, 'type')[0]?.t ?? tIn + POINTER.lead;
    const total = [...full].length;
    const tDone = tType + Math.ceil(total / P.rate) / FPS;
    let tSend = beatsOf(beats, 'send')[0]?.t ?? null;
    if (tSend != null && tSend < tDone) { S.warn('prompt: send comes before the request has finished typing; it waits'); tSend = tDone + F(2); }
    // the pointer clicks send [X67, X68]
    const sendC = { x: cw - P.send.right - P.send.d / 2 + (win ? inset : 0), y: cH - P.send.bottom - P.send.d / 2 + (win ? barH + headH : 0) };
    const track = params.pointer && tSend != null ? pointerTrack(S, tIn, [{ t: tSend, x: sendC.x + 14, y: sendC.y + 10, click: true, from: P.from }]) : null;
    if (track) tSend = track.times[0];
    const pointer = makePointer(S);
    fr.over.append(pointer.el);
    const tAns = beatsOf(beats, 'answer')[0]?.t ?? (tSend != null ? tSend + P.answer.after : null);

    // char index -> (line, offset), with the chip's span
    const starts = []; { let k = 0; for (const s of lines) { starts.push(k); k += [...s].length + 1; } }
    const chipLen = [...chip].length;
    const tint = `rgba(${[1, 3, 5].map((i) => parseInt(acc.slice(i, i + 2), 16)).join(',')},${P.chipTint})`;
    const renderLine = (el, s, from, n, chipDone) => {
      const key = `${n}|${chipDone}`;
      if (el._key === key) return;
      el._key = key;
      const shown = [...s].slice(0, n);
      const cut = Math.max(0, Math.min(shown.length, chipLen - from));
      el.textContent = '';
      if (cut > 0) {
        const c = h('span', { text: shown.slice(0, cut).join(''), style: { color: acc, background: chipDone ? tint : 'transparent', borderRadius: '10px', boxDecorationBreak: 'clone', padding: chipDone ? '0 4px' : '0', margin: chipDone ? '0 -4px' : '0' } });
        el.append(c);
      }
      if (shown.length > cut) el.append(document.createTextNode(shown.slice(cut).join('')));
    };

    const el = h('div.pr-prompt', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, fr.wrap);
    return {
      el, box: fr.box,
      seek(t) {
        const n = typedAt(t, tType, P.rate, total);
        const chipDone = n > chipLen;
        let li = 0, off = 0;
        lines.forEach((s, i) => {
          const len = [...s].length;
          const m = Math.max(0, Math.min(len, n - starts[i]));
          renderLine(lineEls[i], s, starts[i], m, chipDone);
          if (n >= starts[i] && (m > 0 || i === 0)) { li = i; off = m; }
        });
        // caret: at the insertion point; solid while typing, blinking after; gone once sent
        const sent = tSend != null && t >= tSend;
        const typing = t >= tType && n < total;
        const blinkOn = typing || t < tType || Math.floor((t - tDone) / P.blink) % 2 === 0;
        setStyle(caret, 'display', !sent && blinkOn ? '' : 'none');
        if (!sent) {
          const pre = [...lines[li] || ''].slice(0, off).join('');
          const x = P.x + (pre ? measureText(pre, font) : 0) + (pre ? 3 : 0);
          setStyle(caret, 'left', `${x.toFixed(2)}px`);
          setStyle(caret, 'top', `${(P.base + li * P.lineH - P.caret.up).toFixed(2)}px`);
        }
        // the send press [clip16@528-534]
        const u = sent ? t - tSend : -1;
        setStyle(send, 'transform', u >= 0 && u < F(4) ? `scale(${u < F(2) ? P.press.button : 0.9})` : '');
        const cardDip = u >= F(2) && u < F(4);
        setStyle(fr.wrap.firstChild, 'transform', cardDip ? `scale(${P.press.card})` : '');
        if (!fr.wrap.firstChild._o) { fr.wrap.firstChild.style.transformOrigin = `${W / 2}px ${frameH / 2}px`; fr.wrap.firstChild._o = 1; }
        const bandOn = u >= F(4);
        setStyle(band, 'display', bandOn ? '' : 'none');
        if (bandOn) setStyle(band, 'height', `${(P.press.band[0] + (P.press.band[1] - P.press.band[0]) * S.E.out(clamp01((u - F(4)) / F(3)))).toFixed(2)}px`);
        // the pointer
        if (track) { const pt = track.at(t); pointer.seek(pt.x, pt.y, pt.show); } else pointer.seek(0, 0, false);
        // the answer
        if (ans) {
          const on = tAns != null && t >= tAns - F(2);
          setStyle(ans, 'display', on ? '' : 'none');
          if (on) {
            const a = t - (tAns - F(2));
            const p = S.E.out(clamp01(a / motion.prop.dur));
            setStyle(ans, 'transform', p < 0.999 ? `translateY(${(13 * (1 - p)).toFixed(2)}px)` : '');   // a small rise of 13 px [X59]
            const k = typedAt(t, tAns, P.stream, ansLines.join(' ').length);
            let c = 0;
            ansLines.forEach((s, i) => { const m = Math.max(0, Math.min(s.length, k - c)); c += s.length + 1; const txt = s.slice(0, m); if (ans.lines[i]._t !== txt) { ans.lines[i].textContent = txt; ans.lines[i]._t = txt; } });
          }
        }
      },
    };
  },
};
