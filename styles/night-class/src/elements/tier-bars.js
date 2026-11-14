// Benchmark tiers: two to four labelled bars of falling width, each with a small label above ('Great',
// 'Average', 'Bad') and its value inside ('Above 1.5%'). Each tier lands on its word: the label appears, the bar
// wipes in from its left edge and the value types in (research/graphics.md G11; seen in the newest reels).
// Fills: white with dark text, grey, cobalt; values are the speaker's own.
import { colour, fonts, motion, layout } from '../tokens.js';
import { ENTER, CAMERA_BEATS, entrance, setStyle } from '../common.js';
import { measureText } from '../text.js';

// TOKENS (research/graphics.md G11: x 160, widths 760/593/424 (100/78/56 %), height ~120, pitch 280, fills
// #fefefe / #3a3a3e / the accent, radius 4-8; the accent fill and its glow are the release cobalt, colour.md C28)
const G = {
  x: 160, w: 760, fracs: [1, 0.78, 0.56, 0.42], h: 108, pitch: 230, radius: 6,
  fills: { white: '#FEFEFE', grey: '#3A3A3E', cobalt: '#164CDF', green: '#1A9D11' },
  ink: { white: '#0B0B0B', grey: '#FEFEFE', cobalt: '#FEFEFE', green: '#FEFEFE' },
  label: { size: 26, gap: 14, colour: '#D8D8D8' }, value: { size: 44, pad: 26 },
  wipe: 0.5, type: 0.35, cobaltGlow: '0 0 22px rgba(22,76,225,0.55)',
};

export default {
  type: 'tier-bars',
  label: 'Benchmark tiers',
  slots: ['graphic'],
  params: {
    tiers: { type: 'array', min: 2, max: 4, of: {
      label: { type: 'string', maxChars: 16, maxWords: 3 },          // "Great"
      value: { type: 'string', maxChars: 18, maxWords: 4 },          // "Above 1.5%"
      tone: 'enum?:white|grey|cobalt|green',                          // default white, grey, cobalt in order
      at: 'word?',
    } },
    ...ENTER,
  },
  beats: { ...CAMERA_BEATS },

  build(ctx) {
    const { S, params: p, tIn } = ctx; const { kit } = S; const { h } = kit;
    const n = p.tiers.length;
    const tones = ['white', 'grey', 'cobalt', 'cobalt'];
    const blockH = (n - 1) * G.pitch + G.label.size + G.label.gap + G.h;
    const top = Math.round(Math.max(layout.graphic.top - 20, layout.graphic.cy - blockH / 2));
    const root = h('div.nc-tiers', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
    const times = p.tiers.map((tr, k) => (tr.at !== undefined ? Math.max(tIn, S.wordTime(tr.at)) : tIn + 0.2 + k * 0.7));
    const tiers = p.tiers.map((tr, k) => {
      const tone = tr.tone || tones[k];
      const y = top + k * G.pitch;
      const w = Math.round(G.w * (G.fracs[k] ?? 0.4));
      const vw = measureText(tr.value, `800 ${G.value.size}px ${fonts.sans}`, -0.02) + G.value.pad * 2;
      const bw = Math.max(w, Math.round(vw));
      const label = h('div', { text: tr.label, style: { position: 'absolute', left: `${G.x}px`, top: `${y}px`, font: `700 ${G.label.size}px/1 ${fonts.sans}`, color: G.label.colour, display: 'none' } });
      const bar = h('div', { style: { position: 'absolute', left: `${G.x}px`, top: `${y + G.label.size + G.label.gap}px`, width: `${bw}px`, height: `${G.h}px`, borderRadius: `${G.radius}px`, background: G.fills[tone], boxShadow: tone === 'cobalt' ? G.cobaltGlow : 'none', display: 'none' } });
      const value = h('div', { text: '', style: { position: 'absolute', left: `${G.x + G.value.pad}px`, top: `${y + G.label.size + G.label.gap + (G.h - G.value.size) / 2}px`, font: `800 ${G.value.size}px/1 ${fonts.sans}`, letterSpacing: '-0.02em', color: G.ink[tone], whiteSpace: 'pre' } });
      root.append(label, bar, value);
      return { label, bar, value, text: tr.value, w: bw, t: times[k] };
    });
    const { settled } = entrance(ctx);
    return {
      el: root, ticks: times.filter((t) => t > tIn + 0.05), box: { x: G.x, y: top, w: G.w, h: blockH },
      seek(t) {
        for (const tr of tiers) {
          const early = settled && tr.t <= tIn;
          const on = early || t >= tr.t;
          setStyle(tr.label, 'display', on ? '' : 'none'); setStyle(tr.bar, 'display', on ? '' : 'none');
          const q = early ? 1 : S.E.wipe(kit.clamp((t - tr.t) / G.wipe));
          setStyle(tr.bar, 'clipPath', q >= 1 ? 'none' : `inset(0 ${(tr.w * (1 - q)).toFixed(1)}px 0 0)`);
          // the value types in once the bar is most of the way across
          const c = early ? tr.text.length : on ? Math.floor(tr.text.length * kit.clamp((t - tr.t - G.wipe * 0.5) / G.type)) : 0;
          const txt = tr.text.slice(0, c);
          if (tr.value.textContent !== txt) tr.value.textContent = txt;
        }
      },
    };
  },
};
