// A line of the script in a rounded dark box: the hook or the sentence being taught, typed in as it is said
// (research/graphics.md G07 'TXT' units, 4.8 % of graphic time). The text is the speaker's own words, taken
// from the transcript by word range. It sits in the middle of the field, or at the top in place of the title.
import { CX, colour, fonts, layout } from '../tokens.js';
import { ENTER, CAMERA_BEATS, entrance, riseIn, setStyle } from '../common.js';
import { measureText, typer } from '../text.js';

// TOKENS (measured by eye on the reference: box ~640 wide, 2 lines of ~34 px bold, radius ~14, a faint border)
const G = { maxW: 700, pad: { x: 30, y: 24 }, size: 34, lead: 1.18, radius: 16,
  fill: 'linear-gradient(180deg, #232324 0%, #18181A 100%)', frame: 'inset 0 0 0 1.5px rgba(255,255,255,0.16)', outer: '0 14px 34px rgba(0,0,0,0.5)', topY: 170 };

export default {
  type: 'quote-card',
  label: 'Script line',
  slots: ['graphic'],
  params: {
    say: { type: 'array', min: 2, max: 2, of: 'word' },          // first and last word of the line
    typed: 'boolean?',                                            // type it in as it is said (default true)
    place: 'enum?:middle|top',
    ...ENTER,
  },
  beats: { ...CAMERA_BEATS },

  build(ctx) {
    const { S, params: p, tIn } = ctx; const { kit } = S; const { h } = kit;
    const [a, b] = p.say;
    const list = S.doc.words.slice(a, b + 1).map((w) => ({ text: String(w.w).replace(/^[-–]/, ''), t: w.start, end: w.end }));
    const f = `800 ${G.size}px ${fonts.sans}`;
    const lines = [[]]; let lw = 0, maxLine = 0;
    for (const w of list) {
      const ww = measureText(`${w.text} `, f, -0.015);
      if (lw + ww > G.maxW - G.pad.x * 2 && lines[lines.length - 1].length) { maxLine = Math.max(maxLine, lw); lines.push([]); lw = 0; }
      lines[lines.length - 1].push({ ...w, x: lw }); lw += ww;
    }
    maxLine = Math.max(maxLine, lw);
    const w = Math.round(maxLine + G.pad.x * 2), hh = Math.round(lines.length * G.size * G.lead + G.pad.y * 2 - G.size * (G.lead - 1));
    const y0 = p.place === 'top' ? G.topY : Math.round(layout.graphic.cy - hh / 2 - 80);
    const root = h('div.nc-quote', { style: { position: 'absolute', left: `${CX - w / 2}px`, top: `${y0}px`, width: `${w}px`, height: `${hh}px`, borderRadius: `${G.radius}px`, background: G.fill, boxShadow: `${G.frame}, ${G.outer}`, willChange: 'transform, opacity' } });
    const typed = p.typed !== false;
    const tw = [];
    lines.forEach((ln, li) => ln.forEach((wd) => {
      const s = h('span', { text: wd.text, style: { position: 'absolute', left: `${G.pad.x + wd.x}px`, top: `${G.pad.y + li * G.size * G.lead}px`, font: `800 ${G.size}px/1 ${fonts.sans}`, letterSpacing: '-0.015em', color: '#FFFFFF', whiteSpace: 'pre' } });
      root.append(s); tw.push({ el: s, text: wd.text, t: Math.max(tIn, wd.t), end: Math.max(tIn + 0.1, wd.end), x: G.pad.x + wd.x, y: G.pad.y + li * G.size * G.lead, line: li });
    }));
    const ty = typer(S, tw, f, -0.015);
    const caret = h('div', { style: { position: 'absolute', width: '3px', height: `${G.size}px`, background: '#FFFFFF', display: 'none' } });
    root.append(caret);
    const endT = tw.length ? tw[tw.length - 1].end : tIn;
    const { t0, settled } = entrance(ctx);
    return {
      el: root, ticks: [], box: { x: CX - w / 2, y: y0, w, h: hh },
      seek(t) {
        const e = riseIn(S, t, t0, settled, 60);
        setStyle(root, 'transform', e.dy > 0.05 ? `translateY(${e.dy.toFixed(2)}px)` : 'none');
        setStyle(root, 'opacity', String(e.o));
        const c = ty.seek(t, !typed || settled);
        const on = typed && !settled && c && t < endT + 0.4;
        setStyle(caret, 'display', on ? '' : 'none');
        if (on) { setStyle(caret, 'left', `${(c.caretX + 3).toFixed(1)}px`); setStyle(caret, 'top', `${c.caretY}px`); }
      },
    };
  },
};
