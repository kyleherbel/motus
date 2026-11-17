// The ground (research/layout.md L08, colour.md C02, motion.md M11): a drafting sheet that never stops drifting.
//   grid  a radial gradient, a 27 px grid with every fifth line heavier, ruler ticks with numbers at both edges,
//         two large dashed construction circles and a 45 degree line; the whole sheet scrolls up 15 px per second
//   soft  the same gradient with soft glows and no grid, behind built objects
// Drawn in code from a recipe. The drift is a pure function of t.
import { W, H, fonts, ground as G } from './tokens.js';
import { setStyle, full } from './common.js';

const NS = 'http://www.w3.org/2000/svg';
const node = (tag, attrs, text) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (text != null) n.textContent = text; return n; };

export function buildGround(S) {
  const { h } = S.kit;
  const T = S.theme;
  const base = `radial-gradient(120% 70% at 55% 12%, ${T.top} 0%, ${T.mid} 48%, ${T.low} 100%)`;
  const vignette = () => h('div', { style: full({ background: 'radial-gradient(90% 75% at 50% 45%, transparent 55%, rgba(0,0,0,0.28) 100%)' }) });

  const svg = node('svg', { width: W, height: H });
  Object.assign(svg.style, { position: 'absolute', left: '0', top: '0' });
  const sheet = node('g', {});
  const P = G.period, rows = P / G.cell;
  const line = (i) => (i % G.major === 0 ? G.heavy : G.minor);
  for (let i = 0; i <= W / G.cell; i++) sheet.append(node('line', { x1: i * G.cell, x2: i * G.cell, y1: 0, y2: P * 3, stroke: '#fff', 'stroke-width': line(i).w, opacity: line(i).o }));
  for (let k = 0; k < 3; k++) {
    const g = node('g', { transform: `translate(0 ${k * P})` });
    for (let i = 0; i < rows; i++) g.append(node('line', { x1: 0, x2: W, y1: i * G.cell, y2: i * G.cell, stroke: '#fff', 'stroke-width': line(i).w, opacity: line(i).o }));
    for (let i = 0; i < 10; i++) {
      const y = i * 135;
      g.append(node('line', { x1: 30, x2: 52, y1: y, y2: y, stroke: '#fff', 'stroke-width': 2, opacity: 0.45 }), node('line', { x1: W - 52, x2: W - 30, y1: y, y2: y, stroke: '#fff', 'stroke-width': 2, opacity: 0.45 }));
      if (i % 2 === 0) for (const x of [12, W - 44]) g.append(node('text', { x, y: y - 8, fill: '#fff', opacity: 0.5, 'font-family': fonts.mono, 'font-size': 15 }, String(150 + i * 5)));
    }
    g.append(
      node('circle', { cx: 980, cy: 420, r: 690, fill: 'none', stroke: '#fff', 'stroke-width': 1.5, 'stroke-dasharray': '34 12', opacity: 0.22 }),
      node('circle', { cx: 60, cy: 1180, r: 420, fill: 'none', stroke: '#fff', 'stroke-width': 1.5, 'stroke-dasharray': '6 10', opacity: 0.2 }),
      node('line', { x1: 690, y1: 130, x2: 1010, y2: 450, stroke: '#fff', 'stroke-width': 1.5, opacity: 0.2 }),
      node('text', { x: 712, y: 170, fill: '#fff', opacity: 0.42, 'font-family': fonts.mono, 'font-size': 15 }, 'R10'),
      node('text', { x: 455, y: 452, fill: '#fff', opacity: 0.42, 'font-family': fonts.mono, 'font-size': 15 }, '45°'),
    );
    sheet.append(g);
  }
  svg.append(sheet);
  const grid = h('div.oc-ground', { style: full({ background: base, display: 'none' }) }, svg, vignette());

  const glows = `radial-gradient(50% 30% at 20% 30%, ${T.top}aa, transparent 70%), radial-gradient(60% 34% at 85% 62%, ${T.top}66, transparent 70%), radial-gradient(70% 40% at 30% 95%, ${T.dark}99, transparent 75%)`;
  const soft = h('div.oc-ground-soft', { style: full({ background: base, display: 'none' }) }, h('div', { style: full({ background: glows }) }), vignette());

  return {
    grid, soft,
    /** which: 'grid' | 'soft' | 'none' */
    seek(t, which) {
      setStyle(grid, 'display', which === 'grid' ? '' : 'none');
      setStyle(soft, 'display', which === 'soft' ? '' : 'none');
      if (which === 'grid') sheet.setAttribute('transform', `translate(0 ${(-((t * G.driftPerS) % P)).toFixed(2)})`);
    },
  };
}
