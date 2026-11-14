// The numbered section heading of a list video (research/hook.md H18-H21, type.md T26, layout.md L18,
// structure.md S24): "N. Name" on one line at the top of the field, heavy weight, title case, cream.
// It arrives with the first sentence of its item (sharp about 13 frames after the first word), sliding
// down 40 px through the standard blur, and stays for the whole item, across graphics and layout changes.
// Seen in 3 of 11 reels (the list videos), 2 or 3 per reel. An app icon may sit between the number and the name.
import { CX, layout, motion, fonts, type, colour } from '../tokens.js';
import { fitCap, sizeForCap, measureText, fontFor } from '../common.js';
import { loadMedia } from '../media.js';

// TOKENS (research/hook.md H19: the icon is a rounded square of about 90 px, seen in one reel)
const G = { icon: 92, iconRadius: 20, iconGap: 18, maxW: 960 };

export default {
  type: 'section-heading',
  label: 'Section heading',
  slots: ['heading'],
  enter: { from: motion.heading.from },
  delay: motion.heading.lag,
  params: {
    n: { type: 'number', min: 1, max: 9 },
    name: { type: 'string', maxChars: 22, maxWords: 3 },      // the item's name, Title Case
    icon: 'asset?',                                           // the app's own icon, supplied per video
  },
  beats: {},

  async prepare(params, S) {
    return { icon: params.icon ? await loadMedia(S, params.icon) : null };
  },

  build(ctx) {
    const { S, params: p, data } = ctx; const { h } = S.kit;
    const HD = layout.heading;
    const num = `${p.n}.`;
    const hasIcon = data.icon && data.icon.kind === 'image';
    const tracking = type.heading.tracking;
    const whole = `${num} ${p.name}`;
    const cap = fitCap(whole, HD.size * fonts.capAt(fonts.weight.heavy), fonts.weight.heavy, G.maxW - (hasIcon ? G.icon + G.iconGap : 0), tracking);
    const size = sizeForCap(cap);
    const font = fontFor(cap, fonts.weight.heavy);
    const space = measureText(' ', font, tracking);
    const wNum = measureText(num, font, tracking), wName = measureText(p.name, font, tracking);
    const total = wNum + (hasIcon ? G.iconGap + G.icon + G.iconGap : space) + wName;
    const left = CX - total / 2;
    const top = HD.baseline - size * fonts.M.base;
    const txt = (text, x) => h('div', { text, style: { position: 'absolute', left: `${x.toFixed(2)}px`, top: `${top.toFixed(2)}px`, whiteSpace: 'nowrap', font: font.replace('px ', 'px/1 '), letterSpacing: `${tracking}em`, color: colour.cream } });
    const el = h('div.eb-heading', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } }, txt(num, left));
    let x = left + wNum;
    if (hasIcon) {
      x += G.iconGap;
      el.append(h('img', { src: data.icon.url, style: { position: 'absolute', left: `${x.toFixed(2)}px`, top: `${(HD.baseline - cap / 2 - G.icon / 2).toFixed(2)}px`, width: `${G.icon}px`, height: `${G.icon}px`, borderRadius: `${G.iconRadius}px`, objectFit: 'cover', display: 'block' } }));
      x += G.icon + G.iconGap;
    } else x += space;
    el.append(txt(p.name, x));
    return { el, box: { x: left, y: HD.baseline - cap, w: total, h: cap }, seek() {} };
  },
};
