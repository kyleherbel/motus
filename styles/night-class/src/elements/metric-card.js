// A stat card: a small dark card with a label ('Revenue'), a big white figure that rolls up to the number the
// speaker says, and optionally a line that draws in beside it, green and glowing for growth (research/graphics.md
// G04 number clauses, G14; motion.md M19; colour.md C23). The figure must be the speaker's own number; the line is
// a shape (up or down) only when the speaker describes growth or a drop, never invented data points.
// It works alone or in the 'side' slot next to a phone or capture.
import { colour, fonts } from '../tokens.js';
import { ENTER, CAMERA_BEATS, centred, entrance, setStyle } from '../common.js';

// TOKENS (research/graphics.md G14; colour.md C23, C28; verified)
const G = {
  w: 440, h: 360, wSide: 400, radius: 14, pad: 34,
  fill: 'linear-gradient(180deg, #1C1C1D 0%, #0F0F10 100%)', frame: 'inset 0 0 0 1.5px rgba(255,255,255,0.2)', outer: '0 16px 36px rgba(0,0,0,0.55)',
  label: { size: 24, colour: '#D8D8D8' }, value: { size: 62 },
  chart: { axis: 'rgba(255,255,255,0.28)', up: '#22C40E', down: '#1956FD', width: 4.5, glow: 'drop-shadow(0 0 6px rgba(40,220,20,0.7))', glowDown: 'drop-shadow(0 0 6px rgba(43,99,255,0.7))' },
  roll: 1.2, draw: 1.4, enter: 0.9,
};

/** "$154,778" -> { pre: '$', num: 154778, post: '', dec: 0, commas: true } */
function parseFigure(s) {
  const m = /^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/.exec(String(s).trim());
  if (!m) return null;
  const digits = m[2];
  return { pre: m[1], num: Number(digits.replace(/,/g, '')), post: m[3], dec: (digits.split('.')[1] || '').length, commas: digits.includes(',') || Number(digits.replace(/,/g, '')) >= 10000 };
}
const fmt = (f, v) => {
  let s = v.toFixed(f.dec);
  if (f.commas) { const [a, b] = s.split('.'); s = a.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (b ? `.${b}` : ''); }
  return `${f.pre}${s}${f.post}`;
};

export default {
  type: 'metric-card',
  label: 'Stat card',
  slots: ['graphic', 'side'],
  hold: 'zoom',
  params: {
    label: { type: 'string', maxChars: 22, maxWords: 4 },           // "Revenue", "Followers"
    value: { type: 'string', maxChars: 14 },                       // as said: "$154,778", "100K", "1.5%"
    from: { type: 'number', optional: true },                      // where the roll starts (default 0)
    trend: 'enum?:up|down|none',                                   // default none
    at: 'word?',                                                   // the word that says the number; the roll lands on it
    ...ENTER,
  },
  beats: { ...CAMERA_BEATS },

  build(ctx) {
    const { S, params: p, tIn, cx, slot } = ctx; const { kit } = S; const { h } = kit;
    const w = slot === 'side' ? G.wSide : G.w;
    const hh = p.trend && p.trend !== 'none' ? G.h : 200;
    const box = centred(w, hh, undefined, cx);
    const root = h('div.nc-metric', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${w}px`, height: `${hh}px`, borderRadius: `${G.radius}px`, background: G.fill, boxShadow: `${G.frame}, ${G.outer}`, willChange: 'transform, opacity' } });
    root.append(h('div', { text: p.label, style: { position: 'absolute', left: `${G.pad}px`, top: `${G.pad}px`, font: `700 ${G.label.size}px/1 ${fonts.sans}`, color: G.label.colour } }));
    const value = h('div', { text: p.value, style: { position: 'absolute', left: `${G.pad}px`, top: `${G.pad + G.label.size + 14}px`, font: `800 ${G.value.size}px/1 ${fonts.sans}`, letterSpacing: '-0.025em', color: '#FFFFFF', whiteSpace: 'nowrap' } });
    root.append(value);
    const fig = parseFigure(p.value);
    if (!fig) S.warn(`metric-card: "${p.value}" has no number to roll; it is shown as written`);
    let path = null, len = 0;
    if (p.trend && p.trend !== 'none') {
      const ns = 'http://www.w3.org/2000/svg';
      const cw = w - G.pad * 2, ch = hh - (G.pad + G.label.size + 14 + G.value.size + 22) - G.pad;
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('width', String(cw)); svg.setAttribute('height', String(ch)); svg.setAttribute('viewBox', `0 0 ${cw} ${ch}`);
      Object.assign(svg.style, { position: 'absolute', left: `${G.pad}px`, top: `${hh - G.pad - ch}px`, overflow: 'visible' });
      const axis = document.createElementNS(ns, 'path');
      axis.setAttribute('d', `M0 0V${ch}H${cw}`); axis.setAttribute('fill', 'none'); axis.setAttribute('stroke', G.chart.axis); axis.setAttribute('stroke-width', '2');
      // a fixed, gently uneven rise (or fall): a shape, not data
      const up = p.trend === 'up';
      const ys = up ? [0.92, 0.82, 0.86, 0.6, 0.48, 0.18, 0.06] : [0.08, 0.2, 0.16, 0.42, 0.55, 0.8, 0.92];
      const pts = ys.map((v, i) => [10 + (cw - 20) * (i / (ys.length - 1)), ch * v]);
      path = document.createElementNS(ns, 'path');
      path.setAttribute('d', `M${pts.map((q) => q.map((x) => x.toFixed(1)).join(' ')).join('L')}`);
      path.setAttribute('fill', 'none'); path.setAttribute('stroke', up ? G.chart.up : G.chart.down); path.setAttribute('stroke-width', String(G.chart.width)); path.setAttribute('stroke-linejoin', 'round'); path.setAttribute('stroke-linecap', 'round');
      path.style.filter = up ? G.chart.glow : G.chart.glowDown;
      len = pts.slice(1).reduce((n, q, i) => n + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
      path.setAttribute('stroke-dasharray', `${len} ${len}`);
      svg.append(axis, path);
      root.append(svg);
    }
    const { t0, settled } = entrance(ctx);
    // the roll lands on the spoken number (or runs right after the card arrives)
    const land = p.at !== undefined ? Math.max(tIn + 0.3, S.wordTime(p.at) + 0.3) : tIn + G.roll;
    const rollStart = land - G.roll;
    return {
      el: root, ticks: [land], box,
      seek(t) {
        const q = settled ? 1 : S.E.slide(kit.clamp((t - t0) / G.enter));
        setStyle(root, 'transform', q < 0.9999 ? `translateY(${(90 * (1 - q)).toFixed(2)}px) scale(${(0.9 + 0.1 * q).toFixed(4)})` : 'none');
        setStyle(root, 'opacity', String(Math.min(1, settled ? 1 : (t - t0) / 0.2)));
        if (fig) {
          const r = settled && land <= tIn ? 1 : S.E.house(kit.clamp((t - rollStart) / G.roll));
          const from = p.from ?? 0;
          const txt = r >= 1 ? p.value : fmt(fig, from + (fig.num - from) * r);
          if (value.textContent !== txt) value.textContent = txt;
        }
        if (path) {
          const d = settled ? 1 : S.E.slide(kit.clamp((t - t0 - 0.15) / G.draw));
          setStyle(path, 'strokeDashoffset', (len * (1 - d)).toFixed(2));
        }
      },
    };
  },
};
