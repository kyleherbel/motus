// A line chart: a grey curve with white dots on thin axes; the stretch being talked about turns cobalt
// with a glow; the line draws in point by point as it enters (research/graphics.md G14, motion.md
// M19). Values must be the speaker's own numbers or the shape they describe, never invented data.
import { CX, colour, fonts, layout } from '../tokens.js';
import { ENTER, CAMERA_BEATS, centred, entrance, setStyle } from '../common.js';

// TOKENS (research/graphics.md G14; highlight colour colour.md C28)
const G = { w: 746, h: 620, pad: { l: 70, r: 40, t: 40, b: 70 }, dot: 24, curve: { w: 4.5, colour: '#A8A8A8' }, axis: { w: 2, colour: '#6A6A6A' },
  lit: '#174DE4', glow: 'drop-shadow(0 0 10px rgba(23,77,228,0.85))', seg: 0.22, label: { size: 22, colour: '#8A8A8A' } };

export default {
  type: 'line-chart',
  label: 'Line chart',
  slots: ['graphic'],
  hold: 'zoom',
  params: {
    points: { type: 'array', min: 3, max: 12, of: 'number' },
    xLabel: { type: 'string', optional: true, maxChars: 24 },
    yLabel: { type: 'string', optional: true, maxChars: 24 },
    ...ENTER,
  },
  beats: { highlight: { from: 'number', to: 'number' }, clear: {}, ...CAMERA_BEATS },

  build(ctx) {
    const { S, params: p, beats } = ctx; const { kit } = S; const { h } = kit;
    const box = centred(G.w, G.h);
    const iw = G.w - G.pad.l - G.pad.r, ih = G.h - G.pad.t - G.pad.b;
    const lo = Math.min(...p.points), hi = Math.max(...p.points), span = hi - lo || 1;
    const P = p.points.map((v, i) => [G.pad.l + (iw * i) / (p.points.length - 1), G.pad.t + ih * (1 - (v - lo) / span)]);
    // Catmull-Rom segments as cubic Beziers
    const segs = P.slice(0, -1).map((a, i) => {
      const p0 = P[i - 1] || a, b = P[i + 1], p3 = P[i + 2] || b;
      const c1 = [a[0] + (b[0] - p0[0]) / 6, a[1] + (b[1] - p0[1]) / 6], c2 = [b[0] - (p3[0] - a[0]) / 6, b[1] - (p3[1] - a[1]) / 6];
      let len = 0, prev = a;
      for (let k = 1; k <= 24; k++) { const u = k / 24, m = 1 - u; const q = [m * m * m * a[0] + 3 * m * m * u * c1[0] + 3 * m * u * u * c2[0] + u * u * u * b[0], m * m * m * a[1] + 3 * m * m * u * c1[1] + 3 * m * u * u * c2[1] + u * u * u * b[1]]; len += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; }
      return { d: `M${a[0].toFixed(1)} ${a[1].toFixed(1)}C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`, len };
    });
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', String(G.w)); svg.setAttribute('height', String(G.h)); svg.setAttribute('viewBox', `0 0 ${G.w} ${G.h}`);
    Object.assign(svg.style, { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, overflow: 'visible' });
    const mk = (tag, attrs) => { const e = document.createElementNS(ns, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v)); svg.append(e); return e; };
    mk('path', { d: `M${G.pad.l} ${G.pad.t - 10}V${G.pad.t + ih}H${G.pad.l + iw + 10}`, fill: 'none', stroke: G.axis.colour, 'stroke-width': G.axis.w });
    const grey = segs.map((s) => mk('path', { d: s.d, fill: 'none', stroke: G.curve.colour, 'stroke-width': G.curve.w, 'stroke-linecap': 'round', 'stroke-dasharray': `${s.len} ${s.len}`, 'stroke-dashoffset': s.len }));
    const lit = segs.map((s) => mk('path', { d: s.d, fill: 'none', stroke: G.lit, 'stroke-width': G.curve.w + 1, 'stroke-linecap': 'round', style: `filter:${G.glow};display:none` }));
    const dots = P.map(([x, y]) => mk('circle', { cx: x, cy: y, r: G.dot / 2, fill: colour.ink.dark, style: 'display:none' }));
    const labels = [];
    if (p.xLabel) labels.push(h('div', { text: p.xLabel, style: { position: 'absolute', left: `${box.x + G.pad.l + iw / 2}px`, top: `${box.y + G.pad.t + ih + 24}px`, transform: 'translateX(-50%)', font: `600 ${G.label.size}px/1 ${fonts.sans}`, color: G.label.colour, whiteSpace: 'nowrap' } }));
    if (p.yLabel) labels.push(h('div', { text: p.yLabel, style: { position: 'absolute', left: `${box.x + G.pad.l - 34}px`, top: `${box.y + G.pad.t + ih / 2}px`, transform: 'translate(-50%, -50%) rotate(-90deg)', font: `600 ${G.label.size}px/1 ${fonts.sans}`, color: G.label.colour, whiteSpace: 'nowrap' } }));
    const root = h('div.nc-chart', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } }, svg, ...labels);
    const { t0, settled } = entrance(ctx);
    const hl = beats.filter((b) => b.do === 'highlight' || b.do === 'clear');
    return {
      el: root, ticks: hl.map((b) => b.t), box,
      seek(t) {
        segs.forEach((s, i) => {
          const q = settled ? 1 : kit.clamp((t - t0 - i * G.seg) / G.seg);
          setStyle(grey[i], 'strokeDashoffset', String((s.len * (1 - q)).toFixed(2)));
        });
        dots.forEach((d, i) => setStyle(d, 'display', settled || t >= t0 + i * G.seg ? '' : 'none'));
        const cur = [...hl].reverse().find((b) => b.t <= t);
        lit.forEach((r, i) => setStyle(r, 'display', cur && cur.do === 'highlight' && i + 1 >= cur.from && i + 1 < cur.to ? '' : 'none'));
      },
    };
  },
};
