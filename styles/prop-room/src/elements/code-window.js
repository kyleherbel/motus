// A code editor or terminal window in which code arrives (research/explain.md X51, X53, X65; device
// code_types_in_window). The machine writes faster than a person: generated code streams 5-8 characters a
// frame or arrives as whole lines every 1.4-4 frames, and the pane scrolls at a constant speed once it is
// full [X65]; a command a person types runs at about 1.6 characters a frame [X62].
//
// Measured instance clip03@945-967 (panel): a dark window 890 x 643 (x 95-984, y 261-904), a near-black title
// bar with the traffic lights and a file tab, line numbers in grey, light code with a muted syntax palette;
// the first line 2 frames after the cut, then one whole line every 1-2 frames, each at 0.8 contrast on its
// first frame and full on the next. Lines 39.3 px apart, 15 px a character (a 25 px monospace).
// Text never has mistakes or backspacing [X78].
import { F, fonts, colour, motion } from '../tokens.js';
import { place, setStyle, clamp01 } from '../common.js';
import { UI, hexOr, windowChrome } from './ui-kit.js';

// TOKENS (research/explain.md X62, X65, X74; measured clip03@945-967 unless marked)
const WIN = { w: 890, h: { split: 643, full: 900 } };      // the most a window grows to; full-frame by eye
const CODE = {
  size: 25, pitch: 39.3,      // 15 px advance, x-height 14 px; lines 39.3 px apart
  numRight: 49, codeLeft: 76, // line numbers end 49 px in, code starts 76 px in
  firstBase: 52.5,            // first baseline under the title bar
  bottomPad: 30,              // by eye
};
const MONO = fonts.mono;   // JetBrains Mono, shipped (the reference's system monospace is not redistributable)
const SYN = {                 // calibrated core colours, clip03@967 (string and number colours by eye)
  plain: '#E7E8EB', num: '#626469', kw: '#B78DC8', type: '#D6C49A', fn: '#7FAFD6', lit: '#D9A46C', str: '#A9C98A', comment: '#6E7178',
};
const PACE = {
  lineEvery: F(1.43),         // 14 lines in 20 frames (clip03@947-966) [X65]
  lineFade: F(1),             // 0.8 contrast on the first frame, full on the next (clip03@947-950)
  stream: 6.5,                // characters a frame for streamed output, 5-8 [X65]
  typed: motion.typing.charsPerFrame,   // a typed command, 1.6 a frame [X62]
  afterCommand: F(3),         // output starts after the command (by eye)
  start: F(2),                // the first line 2 frames after the cut (clip03@947) [X55]
};
const MARK = { fill: 'rgba(252,107,0,0.16)', edge: '#FC6B00' };   // reading highlight, orange band (clip15@689-715, by eye)

const KW = new Set('export import from default function return const let var if else for while do switch case break continue new class extends interface type enum async await yield try catch finally throw in of as typeof instanceof null undefined this def lambda pass with elif None True False fn pub use mod impl struct let mut match'.split(' '));
const TYPES = new Set('string number boolean void any unknown never int float str bool dict list'.split(' '));

/** Split one line of code into coloured spans (a small generic highlighter, not a parser). */
function tokens(line) {
  const out = [];
  const re = /(\/\/.*$|#.*$)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?|`[^`]*`?)|(\b\d[\d_.]*\b|\btrue\b|\bfalse\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/g;
  let m;
  while ((m = re.exec(line))) {
    const [s, com, str, num, id, ws] = m;
    let c = SYN.plain;
    if (com) c = SYN.comment;
    else if (str) c = SYN.str;
    else if (num) c = SYN.lit;
    else if (id) {
      if (KW.has(id)) c = SYN.kw;
      else if (TYPES.has(id) || /^[A-Z]/.test(id)) c = SYN.type;
      else if (/^\s*\(/.test(line.slice(re.lastIndex))) c = SYN.fn;
    } else if (ws) c = null;
    out.push({ s, c });
  }
  return out;
}

export default {
  type: 'code-window',
  label: 'Code window',
  slots: ['graphic'],
  params: {
    lines: { type: 'array', min: 1, max: 40, of: { type: 'string', maxChars: 50 } },   // more lines than fit scroll at a constant speed [X65]
    file: { type: 'string', optional: true, maxChars: 30 },        // the file tab in an editor, the title in a terminal
    kind: 'enum?:editor|terminal',                                  // terminal: line 1 is a command typed, the rest is output
    pace: 'enum?:lines|stream',                                     // editor: whole lines (default) or streamed characters [X65]
    accent: { type: 'string', optional: true, maxChars: 7 },        // the terminal prompt and caret (#RRGGBB)
  },
  beats: {
    run: {},                                                        // the code starts arriving (default 2 frames after the cut)
    mark: { line: { type: 'number', min: 1, max: 40 } },            // a reading highlight lands on a line (clip15@689) [X65]
  },
  build(ctx) {
    const { S, params, beats, mode, tIn } = ctx;
    const { h } = S.kit;
    const term = params.kind === 'terminal';
    const pace = term ? 'stream' : params.pace || 'lines';
    const accent = hexOr(params.accent, '#5FD38D');
    const lines = (params.lines || []).map(String);
    // the window is as tall as its code (4 lines at least) up to the measured height; longer code scrolls
    const base0 = CODE.firstBase - (CODE.size * 0.86);   // top of the first line box (JetBrains Mono: baseline 0.86 em under the top of a line-height-1 box)
    const barH = 4.5 * 13.5;
    const need = barH + base0 + Math.max(4, lines.length) * CODE.pitch + CODE.bottomPad;
    const H = Math.min(WIN.h[mode === 'full' ? 'full' : 'split'], Math.ceil(need));
    const box = place(ctx, WIN.w, H);
    const el = h('div.pr-code-window', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${WIN.w}px`, height: `${H}px`,
      transform: box.s < 0.999 ? `scale(${box.s})` : '', transformOrigin: '0 0' } });
    const win = windowChrome(S, { x: 0, y: 0, w: WIN.w, h: H, dark: true, title: '' });
    el.append(win.el);
    // the file tab after the dots: a small accent icon and the name in grey (clip03@967)
    if (params.file) {
      const bar = win.el.lastChild;
      bar.append(h('div', { style: { position: 'absolute', left: '128px', top: `${win.barH / 2 - 19}px`, height: '38px', padding: '0 16px 0 12px', borderRadius: '9px',
        background: term ? 'transparent' : '#202226', display: 'flex', alignItems: 'center', gap: '10px' } },
      term ? null : h('div', { style: { width: '22px', height: '22px', borderRadius: '6px', background: '#6B6CEE' } }),
      h('div', { text: params.file, style: { font: `400 21px/1 ${MONO}`, color: '#B6B7BD', whiteSpace: 'nowrap' } })));
    }
    const bodyH = H - win.barH;
    const left = term ? 36 : CODE.codeLeft;
    const pane = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '100%' } });
    win.body.append(pane);
    const rows = lines.map((ln, i) => {
      const top = base0 + i * CODE.pitch;
      const row = h('div', { style: { position: 'absolute', left: '0', top: `${top.toFixed(1)}px`, width: '100%', height: `${CODE.pitch}px`, whiteSpace: 'pre',
        font: `400 ${CODE.size}px/${CODE.size}px ${MONO}`, visibility: 'hidden' } });
      if (!term) row.append(h('div', { text: String(i + 1), style: { position: 'absolute', right: `${WIN.w - CODE.numRight}px`, top: '0', color: SYN.num } }));
      const code = h('div', { style: { position: 'absolute', left: `${left}px`, top: '0' } });
      const spans = [];
      if (term && i === 0) { code.append(h('span', { text: '❯ ', style: { color: accent } })); }
      for (const tk of term ? [{ s: ln, c: i === 0 ? SYN.plain : '#C9CAD0' }] : tokens(ln)) {
        const sp = h('span', { text: tk.s, style: tk.c ? { color: tk.c } : {} });
        sp._full = tk.s; code.append(sp); spans.push(sp);
      }
      row.append(code);
      pane.append(row);
      return { row, code, spans, len: ln.length };
    });
    const caret = h('span', { style: { display: 'inline-block', width: '13px', height: `${CODE.size}px`, verticalAlign: 'top', background: accent } });
    const markEl = h('div', { style: { position: 'absolute', left: '0', width: '100%', height: `${CODE.pitch}px`, background: MARK.fill, boxShadow: `inset 0 1px 0 ${MARK.edge}, inset 0 -1px 0 ${MARK.edge}`, display: 'none' } });
    pane.prepend(markEl);

    // timeline: when each line starts and how many characters it shows at time t
    const run = beats.find((b) => b.do === 'run');
    const t0 = run ? run.t : tIn + PACE.start;
    const starts = [], ends = [];
    let tc = t0;
    lines.forEach((ln, i) => {
      if (pace === 'lines') { starts.push(t0 + i * PACE.lineEvery); ends.push(t0 + i * PACE.lineEvery); return; }
      const rate = term && i === 0 ? PACE.typed : PACE.stream;
      starts.push(tc);
      const dur = F(Math.max(1, ln.length) / rate);
      ends.push(tc + dur);
      tc += dur + (term && i === 0 ? PACE.afterCommand : 0);
    });
    const visRows = Math.max(1, Math.floor((bodyH - base0 - CODE.bottomPad) / CODE.pitch));
    const marks = beats.filter((b) => b.do === 'mark').map((b) => ({ t: b.t, line: b.line - 1 }));

    return {
      el, box,
      seek(t) {
        let progress = 0;   // continuous count of lines written, for the scroll
        rows.forEach((r, i) => {
          const a = t - starts[i];
          if (a < 0) { setStyle(r.row, 'visibility', 'hidden'); return; }
          setStyle(r.row, 'visibility', 'visible');
          if (pace === 'lines') {
            setStyle(r.row, 'opacity', a >= PACE.lineFade ? '' : '0.8');
            progress = Math.max(progress, i + clamp01(a / PACE.lineEvery));
          } else {
            const dur = ends[i] - starts[i];
            const shown = a >= dur ? r.len : Math.min(r.len, Math.floor((a / dur) * r.len) + 1);
            let left = shown;
            for (const sp of r.spans) { const take = Math.max(0, Math.min(sp._full.length, left)); const txt = sp._full.slice(0, take); if (sp.textContent !== txt) sp.textContent = txt; left -= take; }
            progress = Math.max(progress, i + clamp01(a / Math.max(dur, 1e-6)));
            // the block caret follows a typed command until its output starts [X63]
            if (term && i === 0) { const on = a < dur + PACE.afterCommand; if (on && caret.parentNode !== r.code) r.code.append(caret); if (!on && caret.parentNode) caret.remove(); }
          }
        });
        // constant-speed scroll once the pane is full [X65]
        const off = Math.max(0, progress - visRows) * CODE.pitch;
        setStyle(pane, 'transform', off > 0.05 ? `translateY(${(-off).toFixed(2)}px)` : '');
        let m = null;
        for (const mk of marks) if (t >= mk.t) m = mk;
        setStyle(markEl, 'display', m && m.line < rows.length ? '' : 'none');
        if (m) setStyle(markEl, 'top', `${(base0 + m.line * CODE.pitch - (CODE.pitch - CODE.size) / 2).toFixed(1)}px`);
      },
    };
  },
};
