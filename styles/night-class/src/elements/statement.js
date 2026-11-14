// A short statement: a white phrase centred in the field with a thick cobalt underline, before the numbers or
// chart that explain it (research/graphics.md G13, low confidence: 13 units in 5 clips). Serif words between
// asterisks. Its words build in like a title's (each sliding in from the right as it fades up, one every 2
// frames), the underline draws from its left end with a glow, and the camera settles and drifts over it [M07, M16].
import { CX, colour, fonts, motion, layout, F } from '../tokens.js';
import { parseRich, faces, units as toUnits, measureText } from '../text.js';
import { ENTER, CAMERA_BEATS, entrance, setStyle, ink } from '../common.js';

// TOKENS (research/graphics.md G13; motion.md M07; glow colour colour.md C28)
const G = { size: 92, underline: { w: 665, h: 14, gap: 16 }, cy: 720, maxW: 880, glow: '0 0 18px rgba(22,76,225,0.6)' };

export default {
  type: 'statement',
  label: 'Statement',
  slots: ['graphic'],
  params: {
    text: { type: 'string', maxChars: 30, maxWords: 6 },
    underline: 'boolean?',            // default true
    ...ENTER,
  },
  beats: { ...CAMERA_BEATS },

  build(ctx) {
    const { S, params: p, mode, tIn } = ctx; const { kit } = S; const { h } = kit;
    const segs = parseRich(p.text);
    let size = G.size;
    const widthAt = (sz) => { const f = faces(sz, 800); return toUnits(segs).reduce((n, u) => n + measureText(u.text, u.serif ? f.serif : f.sans, u.serif ? -0.01 : -0.03), 0); };
    while (size > 48 && widthAt(size) > G.maxW) size -= 2;
    const f = faces(size, 800);
    const us = toUnits(segs);
    let x = 0;
    for (const u of us) { u.x = x; u.w = measureText(u.text, u.serif ? f.serif : f.sans, u.serif ? -0.01 : -0.03); x += u.w; }
    const w = x, left = CX - w / 2, base = G.cy + size * fonts.sansM.cap / 2;
    const root = h('div.nc-statement', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
    const { t0, settled } = entrance(ctx);
    const start = t0 + F(2);
    us.forEach((u, k) => {
      const fs = u.serif ? f.serifSize : size, b = u.serif ? fonts.serifM.base : fonts.sansM.base;
      u.el = h('span', { text: u.text, style: { position: 'absolute', left: `${left + u.x}px`, top: `${base - fs * b}px`, whiteSpace: 'pre', font: u.serif ? f.serif.replace(/px /, 'px/1 ') : `800 ${size}px/1 ${fonts.sans}`,
        letterSpacing: u.serif ? '-0.01em' : '-0.03em', color: ink(mode), opacity: '0' } });
      u.t = start + k * motion.title.unit;
      root.append(u.el);
    });
    const uw = Math.min(G.underline.w, w + 40);
    const under = h('div', { style: { position: 'absolute', left: `${CX - uw / 2}px`, top: `${base + G.underline.gap}px`, width: `${uw}px`, height: `${G.underline.h}px`, background: colour.cobalt, boxShadow: G.glow } });
    if (p.underline !== false) root.append(under);
    const underAt = start + us.length * motion.title.unit;
    return {
      el: root, ticks: [], box: { x: left, y: base - size, w, h: size + G.underline.gap + G.underline.h },
      seek(t) {
        for (const u of us) {
          const on = settled || t >= u.t;
          const e = settled ? 1 : on ? S.E.titleUnit(kit.clamp((t - u.t) / motion.title.unitDur)) : 0;
          setStyle(u.el, 'opacity', String(e));
          setStyle(u.el, 'transform', e < 0.999 ? `translateX(${(motion.title.unitDx * (1 - e)).toFixed(2)}px)` : 'none');
        }
        const q = settled ? 1 : S.E.bar(kit.clamp((t - underAt) / motion.title.barDur));
        setStyle(under, 'clipPath', q >= 1 ? 'none' : `inset(0 ${(uw * (1 - q)).toFixed(2)}px 0 0)`);
      },
    };
  },
};
