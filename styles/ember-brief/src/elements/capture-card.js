// A captured page (a post, a repository, an article, a docs page) as a plain rounded card on the column
// (research/graphics.md G05-G13, colour.md C12, C13, C19, motion.md M13). The capture is the user's file,
// never redrawn: it keeps its own paper and ink, is cropped to one block of the page at reading size, and
// stays still inside the card. No browser chrome, no device frame, no stroke.
//   highlight  an accent (magenta) bar wipes in from the left over the words the speaker is saying: one per capture
//              as a rule, three at most [G10]
//   outline    an accent box points at a row or a region [G13]
//   pop        a dark chip with an accent glyph pops out beside a row and counts up to the exact figure the
//              page shows for it, overhanging the card's edge (research/explain-composites.md K12: clip39@164-178,
//              a repository's "3.2k stars" outlined while a chip counts to "3,183")
// Marks are placed by phrase when the capture came from `motus capture --find` (its .json records where
// each phrase sits), or by a rectangle given as fractions of the picture.
import { layout, motion, fonts, colour, F } from '../tokens.js';
import { place, setStyle, expoInOut, enterAt, applyState, parseFigure, formatFigure, measureText, fontFor } from '../common.js';
import { card, CARD } from '../card.js';
import { glyph, GLYPH_NAMES } from '../marks.js';

// TOKENS (research/graphics.md G09, G13; verified)
const G = {
  // a bar runs from 35 px above the x-height line to 15 px below the baseline on text with a 28 px x-height: in terms of
  // the text's own box that is 1.28 x its height, centred 0.41 of the way down it; corner radius 0.15 x the bar's height
  bar: { grow: 1.28, centre: 0.41, padX: 6, radius: 0.15 },
  outline: { stroke: 5, radius: 24, pad: 10, fade: motion.toggle },
  // the chip [K12]: 150 px tall, radius 34, near-black with the cards' shadow; an accent glyph 64 px and the figure in the
  // heavy weight at cap 66, 52 px in from the left, 26 px apart; it stands 60 px right of the row it belongs to and may
  // overhang the card by 16 px. It arrives with the figures' entrance and counts from 0 over 14 frames, fast at first
  // (clip39@164-178: 21, 855, 2,704, 2,993, 3,153, 3,171, 3,178, 3,181, 3,183)
  pop: { h: 150, radius: 34, glyph: 64, cap: 66, padX: 52, gap: 26, from: 60, overhang: 16, count: F(14), fill: '#141518' },
};

const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
const hex = (c) => c.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16));
const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
const MARK = { find: 'string?', x: 'number?', y: 'number?', w: 'number?', h: 'number?' };
const POP = { ...MARK, value: { type: 'string', maxChars: 9 }, glyph: `enum?:${GLYPH_NAMES.join('|')}` };

export default {
  type: 'capture-card',
  label: 'Capture',
  slots: ['graphic'],
  params: {
    src: 'asset',                                           // png or jpg; from `motus capture` when marks go on text
    width: { type: 'number', optional: true, min: 500, max: 1040 },   // default the 1000 px column
  },
  beats: { highlight: MARK, outline: MARK, pop: POP },

  async prepare(params, S) {
    const img = new Image();
    img.src = S.env.projectUrl(params.src);
    await img.decode().catch(() => { throw new Error(`Could not load ${params.src}`); });
    let meta = null;
    try { const r = await fetch(S.env.projectUrl(`${params.src}.json`)); if (r.ok) meta = await r.json(); } catch { /* a plain screenshot has no sidecar */ }
    // the paper: the picture's own corner colour decides light or dark marks
    const c = document.createElement('canvas'); c.width = 8; c.height = 8;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, 8, 8);
    const px = g.getImageData(0, 0, 1, 1).data;
    return { img, meta, w: img.naturalWidth, h: img.naturalHeight, paper: [px[0], px[1], px[2]] };
  },

  build(ctx) {
    const { S, params: p, beats, data } = ctx; const { kit } = S; const { h } = kit;
    const w = p.width || layout.column.w;
    const k = w / data.w;
    const box = place(ctx, w, data.h * k);
    const root = card(S, { x: box.x, y: box.y, w: box.w, h: box.h, kind: 'paper', fill: `rgb(${data.paper.join(',')})` });
    const outer = h('div.eb-capture', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } }, root);
    const z = k * box.s;                                    // picture px -> frame px
    root.append(h('img', { src: data.img.src, style: { position: 'absolute', left: '0', top: '0', width: `${box.w}px`, height: `${box.h}px`, display: 'block' } }));
    const dark = (data.paper[0] * 0.2126 + data.paper[1] * 0.7152 + data.paper[2] * 0.0722) < 96;
    // the accent at partial opacity under the ink: multiply keeps dark ink dark on light paper, lighten keeps
    // light ink light on dark paper [C12, C13, G08]
    const barFill = mix(data.paper, hex(colour.accent), dark ? colour.highlight.dark : colour.highlight.light);

    const rectsOf = (b) => {
      if (b.find) {
        const f = (data.meta?.finds || []).find((x) => norm(x.text) === norm(b.find) && x.found);
        if (f) return f.rects.map((r) => ({ x: r.x * z, y: r.y * z, w: r.w * z, h: r.h * z }));
        S.warn(`capture-card: "${b.find}" was not found in ${p.src}; capture it with --find, or give x, y, w, h`);
        return [];
      }
      if ([b.x, b.y, b.w, b.h].every((v) => typeof v === 'number')) return [{ x: b.x * box.w, y: b.y * box.h, w: b.w * box.w, h: b.h * box.h }];
      return [];
    };

    const marks = [];
    for (const b of beats) {
      const rs = rectsOf(b);
      if (b.do === 'highlight') {
        rs.forEach((r, i) => {
          const hh = r.h * G.bar.grow;
          const el = h('div', { style: { position: 'absolute', left: `${(r.x - G.bar.padX).toFixed(1)}px`, top: `${(r.y + r.h * G.bar.centre - hh / 2).toFixed(1)}px`, width: `${(r.w + G.bar.padX * 2).toFixed(1)}px`, height: `${hh.toFixed(1)}px`,
            borderRadius: `${(hh * G.bar.radius).toFixed(1)}px`, background: barFill, mixBlendMode: dark ? 'lighten' : 'multiply', display: 'none' } });
          root.append(el);
          // a phrase that wraps runs line by line [G11]
          marks.push({ kind: 'bar', el, w: r.w + G.bar.padX * 2, rad: hh * G.bar.radius, t: b.t + motion.highlight.lag + i * motion.highlight.lineGap });
        });
      } else if (b.do === 'pop' && rs.length) {
        const P = G.pop;
        const r = rs[0];
        const fig = parseFigure(b.value);
        const font = fontFor(P.cap, fonts.weight.heavy);
        const tw = measureText(String(b.value), font, -0.04);
        const w = P.padX * 2 + P.glyph + P.gap + tw;
        const cy = box.y + r.y + r.h / 2;
        let x = box.x + r.x + r.w + P.from;
        x = Math.min(x, box.x + box.w + P.overhang - w);
        const chip = h('div', { style: { position: 'absolute', left: `${x.toFixed(1)}px`, top: `${(cy - P.h / 2).toFixed(1)}px`, width: `${w.toFixed(1)}px`, height: `${P.h}px`, borderRadius: `${P.radius}px`, background: P.fill, boxShadow: colour.shadow, display: 'none' } });
        const g = glyph(b.glyph || 'star', P.glyph, 0, colour.accent);
        g.querySelectorAll('path').forEach((q) => { q.setAttribute('fill', colour.accent); q.setAttribute('stroke', colour.accent); q.setAttribute('stroke-width', '1.2'); });
        Object.assign(g.style, { position: 'absolute', left: `${P.padX}px`, top: `${(P.h - P.glyph) / 2}px` });
        const txt = h('div', { text: String(b.value), style: { position: 'absolute', left: `${P.padX + P.glyph + P.gap}px`, top: `${(P.h / 2 + P.cap / 2 - (P.cap / fonts.capAt(fonts.weight.heavy)) * fonts.M.base).toFixed(1)}px`, whiteSpace: 'nowrap', font: font.replace('px ', 'px/1 '), letterSpacing: '-0.04em', color: colour.cream } });
        chip.append(g, txt);
        outer.append(chip);
        marks.push({ kind: 'pop', el: chip, txt, fig, value: String(b.value), t: b.t, origin: `${(x + w / 2).toFixed(1)}px ${cy.toFixed(1)}px` });
      } else if (b.do === 'outline' && rs.length) {
        const x0 = Math.min(...rs.map((r) => r.x)), y0 = Math.min(...rs.map((r) => r.y));
        const x1 = Math.max(...rs.map((r) => r.x + r.w)), y1 = Math.max(...rs.map((r) => r.y + r.h));
        const el = h('div', { style: { position: 'absolute', left: `${(x0 - G.outline.pad).toFixed(1)}px`, top: `${(y0 - G.outline.pad).toFixed(1)}px`, width: `${(x1 - x0 + G.outline.pad * 2).toFixed(1)}px`, height: `${(y1 - y0 + G.outline.pad * 2).toFixed(1)}px`,
          borderRadius: `${G.outline.radius}px`, boxShadow: `inset 0 0 0 ${G.outline.stroke}px ${colour.accent}`, display: 'none' } });
        root.append(el);
        marks.push({ kind: 'outline', el, t: b.t });
      }
    }

    return {
      el: outer, box,
      seek(t) {
        for (const m of marks) {
          const on = t >= m.t;
          setStyle(m.el, 'display', on ? '' : 'none');
          if (!on) continue;
          if (m.kind === 'pop') {
            applyState(m.el, enterAt(S, t - m.t, motion.enter.presets.figure), m.origin);
            const u = S.kit.clamp((t - m.t) / G.pop.count), e = 1 - Math.pow(1 - u, 4);
            const v = !m.fig || u >= 1 ? m.value : formatFigure(m.fig, m.fig.num * e);
            if (m.txt.textContent !== v) m.txt.textContent = v;
            continue;
          }
          if (m.kind === 'bar') {
            const e = expoInOut((t - m.t) / motion.highlight.wipe);
            setStyle(m.el, 'clipPath', e >= 0.9999 ? 'none' : `inset(0 ${(m.w * (1 - e)).toFixed(1)}px 0 0 round ${m.rad.toFixed(1)}px)`);
          } else setStyle(m.el, 'opacity', String(kit.clamp((t - m.t) / G.outline.fade)));
        }
      },
    };
  },
};
