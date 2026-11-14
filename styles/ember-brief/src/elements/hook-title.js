// The opening (research/hook.md H01-H17, type.md T18-T22, motion.md M09-M11, layout.md L15):
// an illustration in the top 580 px of the field and a stacked upper-case title under it, two lines in
// the light weight then two (or one) in the heavy weight, all in the cream. It builds on one fixed
// timeline that is identical in every reference reel, holds perfectly still, and leaves as one block
// when the speaker starts the next clause. No caption shows while it is up.
//
// The picture is the user's: one still per video. The reference uses a 3D character scene on a
// near-black ground; the style ships none and never draws a third party's mascot or logo.
import { CX, layout, type, motion, fonts, colour } from '../tokens.js';
import { sizeForCap, measureText, fontFor, expoInOut, setStyle } from '../common.js';
import { loadMedia, placeIn } from '../media.js';

/**
 * The title as a fit-to-box [T19-T21, H09; verified]. Sizes: capL = 359.4 / (2 x 1.2377 + nH x 1.2120 x r), capH = r x capL.
 * A light line wider than 720 px shrinks the light pair and gives the height to the heavy pair; a line wider than
 * 905 px scales everything down. Boxes stack with the caps centred in each; the stack is centred on y 766.1.
 */
export function titleLayout(light, heavy, alone = false) {
  const T = type.title, L = layout.title;
  const nH = heavy.length, r = T.ratio * (nH === 1 ? 2 : 1);
  const widest = (lines, cap, weight, tracking) => Math.max(...lines.map((s) => measureText(s, fontFor(cap, weight), tracking)));
  let lc = L.stack / (light.length * T.lightBox + nH * T.heavyBox * r), hc = r * lc;
  const wl = widest(light, lc, fonts.weight.light, T.trackingLight);
  if (wl > L.lightMaxW) { lc *= L.lightMaxW / wl; hc = (L.stack - light.length * T.lightBox * lc) / (nH * T.heavyBox); }
  const w = Math.max(widest(light, lc, fonts.weight.light, T.trackingLight), widest(heavy, hc, fonts.weight.heavy, T.trackingHeavy));
  if (w > L.maxW) { lc *= L.maxW / w; hc *= L.maxW / w; }
  const total = light.length * T.lightBox * lc + nH * T.heavyBox * hc;
  let y = (alone ? L.cyAlone : L.cy) - total / 2;
  const top = y;
  const lines = [];
  for (const [list, cap, box, isHeavy] of [[light, lc, T.lightBox, false], [heavy, hc, T.heavyBox, true]]) {
    for (const text of list) { const bh = box * cap; lines.push({ text, heavy: isHeavy, cap, baseline: y + (bh - cap) / 2 + cap }); y += bh; }
  }
  return { lines, top, bottom: y };
}

export default {
  type: 'hook-title',
  label: 'Opening title',
  slots: ['graphic'],
  layouts: ['split'],
  ownEntrance: true,
  hidesCaptions: true,
  params: {
    light1: { type: 'string', maxChars: 16, maxWords: 2 },                    // the subject, light weight
    light2: { type: 'string', maxChars: 16, maxWords: 2 },
    heavy1: { type: 'string', maxChars: 14, maxWords: 2 },                    // the claim, heavy weight
    heavy2: { type: 'string', optional: true, maxChars: 14, maxWords: 2 },    // leave out for a one-word claim
    image: 'asset?',                                                          // the illustration (about 1.86:1; it is cropped to cover)
  },
  beats: {},

  async prepare(params, S) {
    return { image: params.image ? await loadMedia(S, params.image) : null };
  },

  build(ctx) {
    const { S, params: p, tIn, data, under } = ctx; const { kit } = S; const { h } = kit;
    const M = motion.title, I = layout.title.illustration;
    const up = (s) => String(s).trim().toUpperCase();
    const hasPicture = !!(data.image && data.image.kind === 'image');
    const lay = titleLayout([p.light1, p.light2].map(up), [p.heavy1, p.heavy2].filter(Boolean).map(up), !hasPicture);

    // ---- the illustration, under the dots of the field, fading into it along its bottom edge [H05]
    let pic = null;
    if (data.image && data.image.kind === 'image') {
      const box = placeIn(I.w, I.h, data.image.w, data.image.h, 'cover');
      const img = h('img', { src: data.image.url, style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px`, display: 'block' } });
      const mask = `linear-gradient(to bottom, #000 0px, #000 ${I.fadeFrom}px, rgba(0,0,0,0) ${I.h}px)`;
      pic = h('div', { style: { position: 'absolute', left: `${I.x}px`, top: `${I.y}px`, width: `${I.w}px`, height: `${I.h}px`, overflow: 'hidden', transformOrigin: '50% 50%', WebkitMaskImage: mask, maskImage: mask } }, img);
      under.append(pic);
    } else if (p.image) S.warn('hook-title: the illustration must be a still image');

    // ---- the lines
    const el = h('div.eb-hook', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
    const lines = lay.lines.map((ln, k) => {
      const size = sizeForCap(ln.cap, ln.heavy ? fonts.weight.heavy : fonts.weight.light);
      const node = h('div', { text: ln.text, style: { position: 'absolute', left: `${CX}px`, top: `${(ln.baseline - size * fonts.M.base).toFixed(2)}px`, whiteSpace: 'nowrap',
        font: `${ln.heavy ? fonts.weight.heavy : fonts.weight.light} ${size.toFixed(2)}px/1 ${fonts.sans}`, letterSpacing: `${ln.heavy ? type.title.trackingHeavy : type.title.trackingLight}em`,
        color: colour.cream } });
      el.append(node);
      return { ...ln, node, t0: tIn + M.start[Math.min(k, M.start.length - 1)], dir: ln.heavy ? 1 : -1 };
    });

    return {
      el, box: { x: 90, y: lay.top, w: 900, h: lay.bottom - lay.top },
      seek(t) {
        for (const ln of lines) {
          const p = expoInOut((t - ln.t0) / M.dur);
          setStyle(ln.node, 'opacity', p >= M.fadeBy ? '1' : (p / M.fadeBy).toFixed(3));
          setStyle(ln.node, 'transform', `translate(-50%, ${(ln.dir * M.slide * ln.cap * (1 - p)).toFixed(2)}px)`);
          const b = M.blurPeak * 4 * p * (1 - p);
          setStyle(ln.node, 'filter', b > 0.05 ? `blur(${b.toFixed(2)}px)` : '');
        }
        if (pic) {
          const I2 = M.illustration;
          const p = expoInOut((t - tIn - I2.start) / I2.dur);
          setStyle(pic, 'opacity', p >= I2.fadeBy ? '1' : (p / I2.fadeBy).toFixed(3));
          setStyle(pic, 'transform', p < 0.9999 ? `scale(${(I2.scale + (1 - I2.scale) * p).toFixed(4)})` : '');
          const b = I2.blurPeak * 4 * p * (1 - p);
          setStyle(pic, 'filter', b > 0.05 ? `blur(${b.toFixed(2)}px)` : '');
        }
      },
    };
  },
};
