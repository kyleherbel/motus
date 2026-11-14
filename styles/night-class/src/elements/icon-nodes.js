// Icon nodes: rounded periwinkle tiles with a label under each, alone, in a row or triangle, or in a ring
// around a cobalt hub; connector lines draw out from the hub, then each node scales in at its word and
// its label types in (research/graphics.md G15, motion.md M17, M18). The tile shows the user's icon
// when one is given, otherwise a plain generic glyph (the reference's own icon artwork is not copied).
import { CX, F, colour, fonts, motion, layout } from '../tokens.js';
import { ENTER, CAMERA_BEATS, entrance, scaleIn, setStyle } from '../common.js';

// TOKENS (research/graphics.md G15; tile and hub colours: colour.md C28)
const G = { tile: '#7D9CF2', glyph: 'rgba(255,255,255,0.92)', aspect: 1.15, radiusFrac: 0.1, width: { 1: 265, 2: 200, 3: 178, ring: 120 },
  hub: { d: 220, fill: '#123EB7' }, ring: 300, label: { size: 30, gap: 18, colour: '#FEFEFE' }, line: { w: 2, colour: '#5A5A5A' }, typeDur: F(10), stagger: F(6) };

const GLYPH = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="36" r="17" fill="currentColor"/><path d="M18 88c2-20 15-31 32-31s30 11 32 31z" fill="currentColor"/></svg>';

export default {
  type: 'icon-nodes',
  label: 'Icon nodes',
  slots: ['graphic'],
  hold: 'zoom',
  params: {
    nodes: { type: 'array', min: 1, max: 8, of: { label: { type: 'string', maxChars: 26, maxWords: 4 }, icon: 'asset?', at: 'word?' } },
    hub: { type: 'string', optional: true, maxChars: 16, maxWords: 3 },
    ...ENTER,
  },
  beats: { ...CAMERA_BEATS },

  build(ctx) {
    const { S, params: p, tIn } = ctx; const { kit } = S; const { h } = kit;
    const n = p.nodes.length;
    const ring = n >= 4 || !!p.hub;
    const tw = ring ? G.width.ring : G.width[n] || G.width[3];
    const th = Math.round(tw * G.aspect);
    const cy = layout.graphic.cy;
    // positions of tile centres
    const pos = ring
      ? p.nodes.map((_, i) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / n; return [CX + G.ring * Math.cos(a), cy + G.ring * Math.sin(a)]; })
      : n === 1 ? [[CX, cy - 30]]
        : n === 2 ? [[CX - 190, cy], [CX + 190, cy]]
          : [[CX - 230, cy - 170], [CX + 230, cy - 170], [CX, cy + 150]];
    const times = p.nodes.map((nd, i) => (nd.at !== undefined ? Math.max(tIn, S.wordTime(nd.at)) : tIn + 0.15 + i * G.stagger));
    const root = h('div.nc-nodes', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
    const lines = [];
    let hub = null;
    if (ring) {
      for (const [x, y] of pos) {
        const len = Math.hypot(x - CX, y - cy) - (p.hub ? G.hub.d / 2 : 0) - th / 2;
        const ang = Math.atan2(y - cy, x - CX);
        const l = h('div', { style: { position: 'absolute', left: `${CX + Math.cos(ang) * (p.hub ? G.hub.d / 2 : 0)}px`, top: `${cy + Math.sin(ang) * (p.hub ? G.hub.d / 2 : 0) - G.line.w / 2}px`, width: `${Math.max(0, len)}px`, height: `${G.line.w}px`, background: G.line.colour, transformOrigin: '0 50%', transform: `rotate(${ang}rad)` } });
        root.append(l); lines.push(l);
      }
      if (p.hub) {
        hub = h('div', { style: { position: 'absolute', left: `${CX - G.hub.d / 2}px`, top: `${cy - G.hub.d / 2}px`, width: `${G.hub.d}px`, height: `${G.hub.d}px`, borderRadius: '50%', background: G.hub.fill, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: colour.cobaltGlow } },
          h('div', { text: p.hub, style: { font: `800 30px/1.05 ${fonts.sans}`, color: colour.ink.dark, padding: '0 22px' } }));
        root.append(hub);
      }
    }
    const nodes = p.nodes.map((nd, i) => {
      const [x, y] = pos[i];
      const tile = h('div', { style: { position: 'absolute', left: `${x - tw / 2}px`, top: `${y - th / 2}px`, width: `${tw}px`, height: `${th}px`, borderRadius: `${tw * G.radiusFrac}px`, background: G.tile, overflow: 'hidden', transformOrigin: '50% 50%' } });
      if (nd.icon) tile.append(h('img', { src: S.env.projectUrl(nd.icon), style: { position: 'absolute', inset: '12%', width: '76%', height: '76%', objectFit: 'contain' } }));
      else { const g = h('div', { style: { position: 'absolute', inset: '16%', color: G.glyph } }); g.innerHTML = GLYPH; tile.append(g); }
      const size = ring ? 24 : n === 1 ? 34 : G.label.size;
      const label = h('div', { text: nd.label, style: { position: 'absolute', left: `${x}px`, top: `${y + th / 2 + G.label.gap}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap', font: `800 ${size}px/1 ${fonts.sans}`, letterSpacing: '-0.01em', color: G.label.colour } });
      root.append(tile, label);
      return { tile, label, t: times[i] };
    });
    const { t0, settled } = entrance(ctx);
    return {
      el: root, ticks: times.filter((t) => t > tIn + 0.05), box: { x: CX - 420, y: cy - 400, w: 840, h: 800 },
      seek(t) {
        if (hub) { const e = scaleIn(S, t, t0, settled); setStyle(hub, 'transform', `scale(${e.s.toFixed(4)})`); setStyle(hub, 'opacity', String(e.o)); }
        lines.forEach((l, i) => {
          const q = settled && times[i] <= tIn ? 1 : S.E.line(kit.clamp((t - (times[i] - motion.line.dur)) / motion.line.dur));
          setStyle(l, 'clipPath', q >= 1 ? 'none' : `inset(0 ${((1 - q) * 100).toFixed(2)}% 0 0)`);
        });
        nodes.forEach((nd) => {
          const early = settled && nd.t <= tIn;
          const on = early || t >= nd.t;
          setStyle(nd.tile, 'display', on ? '' : 'none'); setStyle(nd.label, 'display', on ? '' : 'none');
          if (!on) return;
          const e = scaleIn(S, t, nd.t, early);
          setStyle(nd.tile, 'transform', e.s < 0.9999 ? `scale(${e.s.toFixed(4)})` : 'none');
          setStyle(nd.tile, 'opacity', String(e.o));
          const q = early ? 1 : kit.clamp((t - nd.t - motion.scale.dur * 0.6) / G.typeDur);
          setStyle(nd.label, 'clipPath', q >= 1 ? 'none' : `inset(0 ${((1 - q) * 100).toFixed(2)}% 0 0)`);
        });
      },
    };
  },
};
