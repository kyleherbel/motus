// Logo chips: white tiles in a centred row just under the card, one per product named,
// each popping in on its spoken name and optionally crossed out with the red marker.
import { strike } from '../marks.js';
import { fonts, motion, F } from '../tokens.js';

const SIZES = {
  light: { 1: [442, 186, 0], 2: [330, 190, 28], 3: [264, 198, 28], 4: [190, 186, 26] },
  dark: { 1: [460, 275, 0], 2: [372, 266, 30], 3: [278, 240, 28], 4: [206, 214, 24] },
};

export default {
  type: 'logo-chips',
  label: 'Logo chips',
  slots: ['chips'],
  params: {
    items: { type: 'array', min: 1, max: 4, of: {
      name: { type: 'string', maxChars: 16 },
      logo: 'asset?',
      fill: { type: 'string', optional: true, maxChars: 9 },     // brand fill for the tile, e.g. "#111111"
      at: 'word?',                                                // the word on which the chip pops (default: staggered from the start)
      strikeAt: 'word?',                                          // the word on which it is crossed out
      strike: 'boolean?',                                         // crossed out shortly after it lands
    } },
  },
  beats: {},

  build(ctx) {
    const { S, params, rect, mode, tIn } = ctx; const { kit, C } = S; const { h } = kit;
    const dark = mode === 'dark';
    const n = params.items.length;
    const [cw, ch, gap] = SIZES[dark ? 'dark' : 'light'][n];
    const total = n * cw + (n - 1) * gap;
    const x0 = (rect.w - total) / 2;
    const el = h('div.ep-chips', { style: { position: 'absolute', left: '0', top: '0', width: `${rect.w}px`, height: `${ch}px` } });
    const chips = params.items.map((it, k) => {
      const fill = it.fill || C.chip;
      const onDarkFill = it.fill ? S.isDark(it.fill) : false;
      const logoSize = n >= 4 ? 64 : n === 3 ? 78 : 90;
      const big = dark && n <= 2;
      const logo = it.logo
        ? h('img', { src: S.env.projectUrl(it.logo), style: { maxWidth: big ? '78%' : `${logoSize * 1.9}px`, height: big ? '56%' : `${logoSize}px`, objectFit: 'contain' } })
        : h('div', { text: (it.name.trim()[0] || '?').toUpperCase(), style: { width: `${logoSize}px`, height: `${logoSize}px`, borderRadius: `${logoSize * 0.26}px`, background: S.tint(it.name), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 ${logoSize * 0.5}px/1 ${fonts.sans}` } });
      const label = big && it.logo ? null : h('div', { text: it.name, style: { font: `700 ${n >= 4 ? 26 : 30}px/1 ${fonts.sans}`, letterSpacing: '-0.015em', color: onDarkFill ? '#fff' : C.chipLabel, whiteSpace: 'nowrap' } });
      const tile = h('div', { style: { position: 'absolute', left: `${x0 + k * (cw + gap)}px`, top: '0', width: `${cw}px`, height: `${ch}px`, borderRadius: '20px', background: fill, boxShadow: dark ? '0 16px 36px rgba(0,0,0,0.45)' : '0 10px 25px rgba(38,38,38,0.12), 0 0 0 1px rgba(38,38,38,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', transformOrigin: '50% 60%' } }, logo, label);
      el.append(tile);
      const at = it.at !== undefined ? S.wordTime(it.at) : tIn + F(4) + k * F(7);
      const sAt = it.strikeAt !== undefined ? S.wordTime(it.strikeAt) : it.strike ? at + motion.chip.grow + motion.chip.hold : null;
      let mark = null;
      if (sAt !== null) {
        const sw = cw * 0.78;
        mark = strike(S, { rect: { x: (cw - sw) / 2, y: ch * 0.36, w: sw, h: ch * 0.2 }, t0: sAt, outline: dark || !!it.fill });
        tile.append(mark.el);
        S.sfx(sAt, 'strike');
      }
      S.sfx(at, 'chip');
      return { tile, at, mark };
    });
    return {
      el,
      seek(t) {
        for (const c of chips) {
          // lands opaque at 95.7 %, swells to 103.1 % over 9 frames, holds 4, relaxes to 100 % over 7
          const M = motion.chip;
          const up = kit.prog(t, c.at, M.grow, kit.ease.outCubic), down = kit.prog(t, c.at + M.grow + M.hold, M.relax, kit.ease.inOutCubic);
          const sc = M.from + (M.peak - M.from) * up - (M.peak - 1) * down;
          c.tile.style.display = t >= c.at ? 'flex' : 'none';
          c.tile.style.transform = `scale(${sc.toFixed(4)})`;
          c.mark?.seek(t);
        }
      },
    };
  },
};
