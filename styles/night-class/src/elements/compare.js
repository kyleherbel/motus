// Before and after (or any two sides): two small dark cards side by side, each under a cobalt label tab, each
// holding a short line; the second lands on its word (research/graphics.md G07 'CMP' units). Text is the
// speaker's own words.
import { CX, colour, fonts, layout } from '../tokens.js';
import { ENTER, CAMERA_BEATS, entrance, setStyle } from '../common.js';

// TOKENS (measured by eye on the reference: cards ~400 x 150, accent tabs ~150 x 46 over the card's top-left;
// tab colour and glow: research/colour.md [C28])
const G = { w: 420, h: 210, gap: 36, radius: 12, pad: 30, tab: { h: 54, padX: 22, size: 32 }, text: { size: 36, lead: 1.12 },
  fill: 'linear-gradient(180deg, #1D1D1E 0%, #111112 100%)', frame: 'inset 0 0 0 1.5px rgba(255,255,255,0.2)', outer: '0 14px 30px rgba(0,0,0,0.5)', enter: 0.8 };

export default {
  type: 'compare',
  label: 'Before and after',
  slots: ['graphic'],
  params: {
    left: { label: { type: 'string', maxChars: 14, maxWords: 2 }, text: { type: 'string', maxChars: 60, maxWords: 10 }, at: 'word?' },
    right: { label: { type: 'string', maxChars: 14, maxWords: 2 }, text: { type: 'string', maxChars: 60, maxWords: 10 }, at: 'word?' },
    ...ENTER,
  },
  beats: { ...CAMERA_BEATS },

  build(ctx) {
    const { S, params: p, tIn } = ctx; const { kit } = S; const { h } = kit;
    const y = Math.round(layout.graphic.cy - G.h / 2);
    const side = (spec, x) => {
      const card = h('div', { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${G.w}px`, height: `${G.h}px`, borderRadius: `${G.radius}px`, background: G.fill, boxShadow: `${G.frame}, ${G.outer}` } },
        h('div', { text: spec.text, style: { position: 'absolute', left: `${G.pad}px`, right: `${G.pad}px`, top: `${G.tab.h / 2 + 22}px`, font: `700 ${G.text.size}px/${G.text.lead} ${fonts.sans}`, color: '#FFFFFF', textAlign: 'center' } }));
      const tab = h('div', { text: spec.label, style: { position: 'absolute', left: `${x + 22}px`, top: `${y - G.tab.h / 2}px`, height: `${G.tab.h}px`, padding: `0 ${G.tab.padX}px`, display: 'flex', alignItems: 'center', borderRadius: '4px', background: colour.cobalt, boxShadow: '0 0 14px rgba(22,76,225,0.5)', font: `800 ${G.tab.size}px/1 ${fonts.sans}`, color: '#FFFFFF' } });
      const g = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0', willChange: 'transform, opacity' } }, card, tab);
      return { g, t: spec.at !== undefined ? Math.max(tIn, S.wordTime(spec.at)) : null };
    };
    const total = G.w * 2 + G.gap;
    const L = side(p.left, CX - total / 2), R = side(p.right, CX - total / 2 + G.w + G.gap);
    L.t ??= tIn; R.t ??= tIn + 0.5;
    const root = h('div.nc-compare', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } }, L.g, R.g);
    const { settled } = entrance(ctx);
    return {
      el: root, ticks: [R.t].filter((t) => t > tIn + 0.05), box: { x: CX - total / 2, y: y - G.tab.h / 2, w: total, h: G.h + G.tab.h / 2 },
      seek(t) {
        for (const [s, dir] of [[L, -1], [R, 1]]) {
          const early = settled && s.t <= tIn;
          const q = early ? 1 : t < s.t ? 0 : S.E.slide(kit.clamp((t - s.t) / G.enter));
          setStyle(s.g, 'display', q > 0 ? '' : 'none');
          setStyle(s.g, 'transform', q < 0.9999 ? `translateX(${(dir * 120 * (1 - q)).toFixed(2)}px)` : 'none');
          setStyle(s.g, 'opacity', String(Math.min(1, early ? 1 : (t - s.t) / 0.2)));
        }
      },
    };
  },
};
