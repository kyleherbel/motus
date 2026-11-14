// A script or document card (research/graphics.md G10, colour.md C22; verified). A dark card about 560 x 820
// px with a soft top-lit gradient, an italic serif heading ('Script', 'Video Script'), sections (Hook / Body /
// CTA) on a dotted connector with small square markers, and grey placeholder lines. It is live while it holds:
//   - the words of a section can type in as the speaker says them, with a caret (say: [first, last] word)
//   - a section's lines turn bright cobalt with a bloom when it is talked about (beat 'highlight')
// Variant frame 'glow': a light border with a soft white glow (the newest reels). The body is never invented
// text: placeholder lines, or the speaker's own words. It rises into place; the composition then creeps larger
// while it holds.
import { colour, fonts, type, F } from '../tokens.js';
import { ENTER, CAMERA_BEATS, centred, entrance, riseIn, setStyle } from '../common.js';
import { measureText, typer } from '../text.js';

// TOKENS (research/graphics.md G10; colour.md C16, C22, C28; verified)
const G = {
  w: 560, h: 820, radius: 14, pad: 58, markerX: 26, headTop: 44, sectionGap: 22, labelGap: 18,
  fill: 'linear-gradient(180deg, #252526 0%, #19191A 34%, #121213 100%)',
  frame: { plain: 'inset 0 0 0 1.5px rgba(255,255,255,0.16)', glow: 'inset 0 0 0 2.5px rgba(236,236,236,0.92)' },
  outer: { plain: '0 18px 40px rgba(0,0,0,0.55)', glow: '0 0 28px rgba(255,255,255,0.26), 0 0 7px rgba(255,255,255,0.35), 0 18px 40px rgba(0,0,0,0.5)' },
  bar: { h: 10, pitch: 21, colour: '#4A4A4B', minFrac: 0.55 },
  lit: '#1956FD', bloom: '0 0 14px rgba(43,99,255,0.9), 0 0 3px rgba(84,129,255,0.9)', bloomIn: 0.5,
  label: { size: 26, colour: '#FFFFFF', dim: '#A8A8A8', rule: 'rgba(255,255,255,0.14)' },
  marker: { size: 11, colour: '#5C5C5D', dot: '#3E3E3F' },
  say: { size: 27, lead: 1.18, colour: '#FFFFFF', caret: 3 },
};

export default {
  type: 'doc-card',
  label: 'Document',
  slots: ['graphic', 'side'],
  hold: 'zoom',
  params: {
    title: { type: 'string', optional: true, maxChars: 24, maxWords: 3 },     // default "Script"
    sections: { type: 'array', min: 1, max: 4, of: {
      label: { type: 'string', maxChars: 14, maxWords: 2 },
      lines: { type: 'number', min: 0, max: 14 },
      say: { type: 'array', optional: true, min: 2, max: 2, of: 'word' },      // words typed in as they are said
    } },
    frame: 'enum?:plain|glow',
    ...ENTER,
  },
  beats: { highlight: { section: 'number' }, clear: {}, ...CAMERA_BEATS },

  build(ctx) {
    const { S, params: p, beats, cx } = ctx; const { kit } = S; const { h } = kit;
    const glow = p.frame === 'glow';
    const box = centred(G.w, G.h, undefined, cx);
    const root = h('div.nc-doc', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${G.w}px`, height: `${G.h}px`, borderRadius: `${G.radius}px`, background: G.fill,
      boxShadow: `${glow ? G.frame.glow : G.frame.plain}, ${glow ? G.outer.glow : G.outer.plain}`, willChange: 'transform, opacity' } });
    root.append(h('div', { text: p.title || 'Script', style: { position: 'absolute', left: '0', width: '100%', textAlign: 'center', top: `${G.headTop}px`, font: `italic 400 ${type.docTitle.size}px/1 ${fonts.serif}`, color: '#FFFFFF', letterSpacing: '-0.01em' } }));
    const rnd = kit.seeded(kit.hash(JSON.stringify(p.sections)));
    const inner = G.w - G.pad - 36;
    const words = S.doc.words;
    let y = G.headTop + type.docTitle.size + 40;
    const markers = [];
    const sections = p.sections.map((sc) => {
      const marker = h('div', { style: { position: 'absolute', left: `${G.markerX - G.marker.size / 2}px`, top: `${y + G.label.size / 2 - G.marker.size / 2}px`, width: `${G.marker.size}px`, height: `${G.marker.size}px`, borderRadius: '2px', background: G.marker.colour } });
      markers.push(y + G.label.size / 2);
      const lw = measureText(sc.label, `700 ${G.label.size}px ${fonts.sans}`, 0);
      const label = h('div', { text: sc.label, style: { position: 'absolute', left: `${G.pad}px`, top: `${y}px`, font: `700 ${G.label.size}px/1 ${fonts.sans}`, color: G.label.colour } });
      const rule = h('div', { style: { position: 'absolute', left: `${G.pad + lw + 14}px`, top: `${y + G.label.size / 2}px`, width: `${Math.max(0, inner - lw - 14)}px`, height: '1.5px', background: G.label.rule } });
      root.append(marker, label, rule);
      y += G.label.size + G.labelGap;
      // the speaker's own words, typed in as they are said; lines are laid out up front so nothing jumps
      let typed = null;
      if (sc.say) {
        const [a, b] = sc.say;
        const list = words.slice(a, b + 1).map((w) => ({ text: String(w.w).replace(/^[-–]/, ''), t: w.start, end: w.end }));
        const f = `800 ${G.say.size}px ${fonts.sans}`;
        const lines = [[]]; let lw2 = 0;
        for (const w of list) {
          const ww = measureText(`${w.text} `, f, -0.01);
          if (lw2 + ww > inner && lines[lines.length - 1].length) { lines.push([]); lw2 = 0; }
          lines[lines.length - 1].push(w); lw2 += ww;
        }
        const tw = [], lineEnd = [];
        lines.forEach((ln, li) => {
          let x = 0;
          for (const w of ln) {
            const yy = y + li * G.say.size * G.say.lead;
            const e = h('span', { text: w.text, style: { position: 'absolute', left: `${G.pad + x}px`, top: `${yy}px`, font: `800 ${G.say.size}px/1 ${fonts.sans}`, letterSpacing: '-0.01em', color: G.say.colour, whiteSpace: 'pre', display: 'none' } });
            tw.push({ el: e, text: w.text, t: w.t, end: w.end, x: G.pad + x, y: yy, line: li });
            root.append(e); x += measureText(`${w.text} `, f, -0.01);
          }
          lineEnd.push(G.pad + x);
        });
        // the rest of the line not yet typed shows as a grey bar after the caret
        const rest = h('div', { style: { position: 'absolute', height: `${Math.round(G.say.size * 0.42)}px`, borderRadius: '2px', background: G.bar.colour, display: 'none' } });
        const caret = h('div', { style: { position: 'absolute', width: `${G.say.caret}px`, height: `${G.say.size}px`, background: '#FFFFFF', display: 'none' } });
        root.append(rest, caret);
        typed = { ty: typer(S, tw, f, -0.01), lineEnd, rest, caret, end: list.length ? list[list.length - 1].end : 0 };
        y += lines.length * G.say.size * G.say.lead + 10;
      }
      const bars = [];
      for (let i = 0; i < sc.lines; i++) {
        const frac = i === sc.lines - 1 ? G.bar.minFrac + rnd() * 0.25 : 0.84 + rnd() * 0.16;
        const bar = h('div', { style: { position: 'absolute', left: `${G.pad}px`, top: `${y}px`, width: `${Math.round(inner * frac)}px`, height: `${G.bar.h}px`, borderRadius: '1px', background: G.bar.colour } });
        root.append(bar); bars.push(bar); y += G.bar.pitch;
      }
      y += G.sectionGap;
      return { label, bars, typed };
    });
    // the dotted connector between the section markers
    if (markers.length > 1) {
      const top = markers[0], bottom = markers[markers.length - 1];
      root.insertBefore(h('div', { style: { position: 'absolute', left: `${G.markerX - 1}px`, top: `${top}px`, width: '2px', height: `${bottom - top}px`, backgroundImage: `linear-gradient(${G.marker.dot} 50%, transparent 50%)`, backgroundSize: '2px 6px' } }), root.firstChild);
    }
    if (y > G.h - 16) S.warn('doc-card: too many lines for the card; some fall outside it');
    const { t0, settled } = entrance(ctx);
    const hl = beats.filter((b) => b.do === 'highlight' || b.do === 'clear');
    const ticks = [...hl.map((b) => b.t)];
    return {
      el: root, ticks, box,
      seek(t) {
        const e = riseIn(S, t, t0, settled);
        setStyle(root, 'transform', e.dy > 0.05 ? `translateY(${e.dy.toFixed(2)}px)` : 'none');
        setStyle(root, 'opacity', String(e.o));
        const cur = [...hl].reverse().find((b) => b.t <= t);
        const on = cur && cur.do === 'highlight' ? cur.section - 1 : -1;
        sections.forEach((sc, k) => {
          const lit = k === on;
          // a highlight lands with a bloom that settles to a steady glow
          const pulse = lit ? 1 + 0.8 * Math.max(0, 1 - (t - cur.t) / G.bloomIn) : 0;
          for (const b of sc.bars) {
            setStyle(b, 'background', lit ? G.lit : G.bar.colour);
            setStyle(b, 'boxShadow', lit ? `0 0 ${(14 * pulse).toFixed(1)}px rgba(43,99,255,0.9), 0 0 3px rgba(84,129,255,0.9)` : 'none');
          }
          setStyle(sc.label, 'color', on >= 0 && !lit ? G.label.dim : G.label.colour);
          if (sc.typed) {
            const T = sc.typed, c = T.ty.seek(t);
            const typing = c && !(c.done && t > T.end + 0.4);
            setStyle(T.caret, 'display', typing ? '' : 'none');
            setStyle(T.rest, 'display', c && !c.done ? '' : 'none');
            if (c) {
              setStyle(T.caret, 'left', `${(c.caretX + 3).toFixed(1)}px`); setStyle(T.caret, 'top', `${c.caretY}px`);
              const bx = c.caretX + 12, bw = Math.max(0, T.lineEnd[c.line] - bx - 8);
              setStyle(T.rest, 'left', `${bx.toFixed(1)}px`); setStyle(T.rest, 'top', `${(c.caretY + G.say.size * 0.3).toFixed(1)}px`); setStyle(T.rest, 'width', `${bw.toFixed(1)}px`);
            }
          }
        });
      },
    };
  },
};
