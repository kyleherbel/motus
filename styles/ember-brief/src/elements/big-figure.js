// A spoken number as one big cream figure centred on the axis (research/graphics.md G17, type.md T27,
// motion.md M14, explain.md X16, X27). The digits count up to the value while the figure blurs in; separators
// and the suffix (+, x, %, K) stay in place during the count. A short label can sit under it.
// A picture of the thing counted can stand under the figure: the figure is above its picture in 4 of the
// reference's 5 pairs [R30]. With `fill` the picture is the quantity: it arrives as a dim grey version of itself
// and its full version rises from the bottom on the count's own progress value, so the level stands at the share
// of the number that has been counted [X16, D14]. When the number has its own word (`at`) the picture comes first
// and the figure arrives on that word, counting; otherwise both arrive together. A shaded cut-out is printed in
// the house look, as the picture element prints it; flat art and opaque pictures are shown as they are.
// The figure must be the speaker's own number. Never invent one.
import { CX, F, motion, fonts, type, colour, explain as X } from '../tokens.js';
import { parseFigure, formatFigure as fmt, place, textAt, fitCap, sizeForCap, expoInOut, enterAt, applyState, setStyle } from '../common.js';
import { loadMedia } from '../media.js';
import { roomOf, shapeOf, groundOf, flatOf, printHouse } from './picture.js';

// TOKENS (research/graphics.md G17, type.md T27, explain.md X16, explain-look.md R30, explain-motion.md D14; by eye where marked)
const G = {
  maxW: 900,                                    // the widest figure stays inside the column
  label: { cap: 38, gap: 54 },                  // by eye: a light caption line under the figure
  picture: {
    // boxes of the pictures that stand with a figure: 468 x 447 (clip29@620), 611 x 452 (clip33@400),
    // 517 x 452 (clip33@465), 700 x 585 (clip39@98): the median height and the largest width [R08, R30]
    h: 452, maxW: 700, minH: 120,
    // baseline of the figure to the top of the picture: 41 px (clip39@98) = explain.figureGap; 55 px when the
    // figure has commas, whose tails then end 30 px above the picture (clip33@400, @465) [R30]
    gap: X.figureGap, gapComma: 55,
    radius: 28,                                 // by eye: an opaque picture takes the capture radius
    clear: 61,                                  // under a section heading the figure starts 61 px under the slot's top (clip33@400: 231 against 170)
  },
  // the picture that fills (clip29@553-572, one unit): the level, as a share of the shape's height, against the
  // share of the number counted on the same frames: 0.02 / 0.00, 0.04 / 0.03, 0.17 / 0.17, 0.75 / 0.76, 0.95 / 0.96,
  // 0.97 / 0.99, 1 / 1. The level is the count's progress (within one 10 px row of dots) [D14].
  // Before the fill the shape is neutral: its inside reads 0.16 of the filled contrast, the whole shape with its
  // bright rim 0.49. A picture has no rim, so the dim version is set between the two (by eye)
  fill: { dim: 0.3 },
  // 13 number events start a median 0.8 frames before the onset of their number word (-7.2 to +5.2) and are
  // complete 11.2 frames after it [X16]
  lead: F(1),
};

export default {
  type: 'big-figure',
  label: 'Big figure',
  slots: ['graphic'],
  ownEntrance: true,                                             // the picture can arrive before the figure
  params: {
    value: { type: 'string', maxChars: 10 },                     // as said: "40,000+", "300+", "15", "200x"
    unit: { type: 'string', optional: true, maxChars: 6, maxWords: 1 },   // a word unit set smaller beside it: "min"
    label: { type: 'string', optional: true, maxChars: 26, maxWords: 4 },
    image: 'asset?',                                             // a picture of the thing counted, under the figure (a cut-out reads best)
    fill: 'boolean?',                                            // the picture fills from the bottom as the figure counts (needs image)
    from: { type: 'number', optional: true },                    // where the count starts (default 0)
    at: 'word?',                                                 // the word that says the number: the count starts on it
  },
  beats: {},

  async prepare(params, S) {
    const image = params.image ? await loadMedia(S, params.image) : null;
    // a shaded still cut-out is printed as a house halftone [R01, R05]
    const screen = !!image && image.kind === 'image' && groundOf(image) === 'cutout' && !flatOf(image);
    return { image, shape: image ? shapeOf(image) : null, screen };
  },

  build(ctx) {
    const { S, params: p, tIn, data } = ctx; const { kit } = S; const { h } = kit;
    const T = type.figure;
    const text = String(p.value).trim();
    // the cap height is the room the figure has, or 1170 px / characters when that is smaller [T27; verified]
    const chars = text.length + (p.unit ? 1 + p.unit.length * 0.45 : 0);
    const alone = text.length <= 2 && !p.unit && !p.image && !p.label;
    const cap = fitCap(text, Math.min(alone ? T.roomShort : T.room, T.perChar / chars), fonts.weight.heavy, G.maxW, T.tracking);
    const hasPic = data.image && data.image.kind === 'image';
    if (p.fill && !hasPic) S.warn('big-figure: fill needs a still picture in image; the figure counts without it');
    // the figure, its label, then the picture [R30]
    const rest = cap + (p.label ? G.label.gap + G.label.cap : 0);
    const gap = hasPic ? (text.includes(',') ? G.picture.gapComma : G.picture.gap) : 0;
    // the picture is sized and placed by what is opaque in it, not by the empty margins of its file
    const sh = (hasPic && data.shape) || { l: 0, t: 0, r: 1, b: 1 };
    const inkW0 = hasPic ? (sh.r - sh.l) * data.image.w : 0, inkH0 = hasPic ? (sh.b - sh.t) * data.image.h : 0;
    const roomPic = Math.max(G.picture.minH, Math.min(G.picture.h, roomOf(ctx) - (ctx.headed ? G.picture.clear : 0) - rest - gap));
    const ps = hasPic ? Math.min(roomPic / inkH0, G.picture.maxW / inkW0) : 0;
    const picW = hasPic ? data.image.w * ps : 0, picH = hasPic ? data.image.h * ps : 0, inkH = inkH0 * ps;
    const total = rest + gap + inkH;
    const box = place(ctx, G.maxW, total);
    const root = h('div.eb-figure', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });

    const base = box.y + cap;
    const size = sizeForCap(cap);
    const words = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
    const line = h('div', { style: { position: 'absolute', left: `${CX}px`, top: `${(base - size * fonts.M.base).toFixed(2)}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
      font: `${fonts.weight.heavy} ${size.toFixed(2)}px/1 ${fonts.sans}`, letterSpacing: `${T.tracking}em`, color: colour.cream, fontVariantNumeric: text.length >= T.tabularFrom ? 'tabular-nums' : 'normal' } });
    const value = h('span', { text });
    line.append(value);
    if (p.unit) line.append(h('span', { text: ` ${p.unit}`, style: { fontSize: '0.45em', letterSpacing: '0' } }));
    words.append(line);
    if (p.label) words.append(textAt(S, { text: p.label, y: base + G.label.gap + G.label.cap, cap: G.label.cap, weight: fonts.weight.light }));
    root.append(words);

    let pic = null, full = null;
    const top = box.y + rest + gap - sh.t * picH;
    if (hasPic) {
      const printed = data.screen ? printHouse(data.image.img, picW, picH, colour.field.match(/[0-9a-f]{2}/gi).map((v) => parseInt(v, 16))) : null;
      const img = (extra) => {
        const css = { position: 'absolute', left: '0', top: '0', width: `${picW.toFixed(2)}px`, height: `${picH.toFixed(2)}px`, display: 'block', ...extra };
        if (!printed) return h('img', { src: data.image.url, style: { ...css, borderRadius: `${G.picture.radius}px` } });
        const c = document.createElement('canvas'); c.width = printed.width; c.height = printed.height;
        c.getContext('2d').drawImage(printed, 0, 0);
        Object.assign(c.style, css);
        return c;
      };
      pic = h('div', { style: { position: 'absolute', left: `${(CX - ((sh.l + sh.r) / 2) * picW).toFixed(2)}px`, top: `${top.toFixed(2)}px`, width: `${picW.toFixed(2)}px`, height: `${picH.toFixed(2)}px` } });
      if (p.fill) { full = img({}); pic.append(img({ opacity: String(G.fill.dim), filter: 'grayscale(1)' }), full); }
      else pic.append(img({}));
      root.append(pic);
    }

    const fig = parseFigure(text);
    if (!fig) S.warn(`big-figure: "${text}" has no number to count; it is shown as written`);
    // the count starts on the onset of the number word and runs 13 frames [X16, M14]. With no word it runs as
    // the figure arrives
    const D = motion.countUp.dur;
    const start = p.at !== undefined ? Math.max(tIn, S.wordTime(p.at) - G.lead) : tIn + motion.enter.fade * 0.4;
    // with a picture and a word of its own, the figure is the event: it arrives counting (clip29@547-568: the
    // shape from 547, the figure from 555)
    const tFig = hasPic && p.at !== undefined ? start : tIn;
    const figOrigin = `${CX}px ${(box.y + rest / 2).toFixed(1)}px`;
    const picOrigin = `${(((sh.l + sh.r) / 2) * 100).toFixed(1)}% ${(((sh.t + sh.b) / 2) * 100).toFixed(1)}%`;
    let shown = null;
    return {
      el: root, box: { x: box.x, y: box.y, w: box.w, h: total },
      seek(t) {
        const a = t - tFig;
        setStyle(words, 'display', a < 0 ? 'none' : '');
        if (a >= 0) applyState(words, enterAt(S, a, motion.enter.presets.figure), figOrigin);
        if (pic) applyState(pic, enterAt(S, t - tIn), picOrigin);
        const r = fig ? expoInOut(kit.clamp((t - start) / D)) : 1;   // the count crawls, jumps through the middle and lands softly [M14]
        if (full) {
          // the level runs over the object's own height
          const cut = (sh.t + (1 - r) * (sh.b - sh.t)) * picH;
          const v = r >= 1 ? 'none' : `inset(${cut.toFixed(1)}px 0 0 0)`;
          if (v !== shown) { full.style.clipPath = v; shown = v; }
        }
        if (!fig) return;
        const from = p.from ?? 0;
        const txt = r >= 1 ? text : fmt(fig, from + (fig.num - from) * r);
        if (value.textContent !== txt) value.textContent = txt;
      },
    };
  },
};
