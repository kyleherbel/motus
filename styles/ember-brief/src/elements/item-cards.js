// "A photo, a screenshot, a receipt": one picture per noun (research/explain.md X20; explain-motion.md D09,
// D19; explain-look.md R05, R23, R24; measured on clip34@208-369, the one card row, and clip35@445-629, the
// one swap card). A picture is the user's own still or a line glyph from marks.js; a still with transparency
// is printed in the house look, cream dots on the card's own ground [R05]. An optional short label sits
// under the picture.
//   row    2 to 4 small dark cards side by side. The first arrives with the scene, each of the others on its
//          noun (`at`), through the standard blur entrance. The cards stay.
//            outline  every card's stroke turns accent, one card after another a frame apart, each within a frame
//            badge    a badge lands on the top-right corner of every card: the user's `mark` on a cream disc
//                     with an accent ring, or a check (or another kind) when there is no mark
//          The reference closes its row with both at once: a product's mark flies from above the row into each
//          card. The flight and the mark above the row are not built; give both beats the same word.
//   swap   one large card whose picture is replaced for each noun, in place. The reference morphs the outline
//          of one flat icon into the next over about 9 frames while the colours cross-fade, with no blur, slide
//          or cut [D19]. A morph between arbitrary pictures is not generic, so this is a 9-frame cross-fade
//          inside the same card; the card does not move. The first picture pops in 6 frames after the card with
//          the reference's small overshoot (clip35@453-465). The reference also tints the card per icon: not built.
import { F, motion, fonts, colour, explain } from '../tokens.js';
import { place, enterAt, applyState, setStyle, fitCap, sizeForCap } from '../common.js';
import { loadMedia } from '../media.js';
import { printCutout } from '../halftone.js';
import { glyph, badgeNode, popAt, GLYPH_NAMES, BADGE_KINDS } from '../marks.js';

// TOKENS (frame px; clip@frame per line)
const I = {
  row: {
    w: 330, h: 560, gap: 15,              // clip34@280: three cards x 30..360, 375..705, 720..1050, y 176..736
    radius: 30,                           // outer corner fit 28 to 30
    fill: '#16171A',                      // clip34@280: #191713; release palette [C26]
    stroke: { w: 3, c: '#27282B' },       // inside the box; the outline is this stroke in the accent (clip34@350: #2A2825; release palette [C26])
    pic: { w: 278, h: 440 },              // the pictures are 277 px wide and 173 to 418 tall, centred in the card. 440: by eye
    // a line glyph: its box 0.72 of the card's width (by eye: its ink is then about as wide as the reference's
    // pictures are tall), its stroke in the tiles' own proportion to the glyph, 0.044 / 0.46 [R24]
    glyph: { size: 0.72, stroke: explain.tile.stroke / explain.tile.glyph },
    narrow: 4,                            // by eye: four cards are scaled to the same total width (the reference row has three)
    label: { cap: 30, bottom: 46, gap: 30, weight: fonts.weight.caption },   // by eye: the reference sets no label in a card
    outlineGap: F(1),                     // clip34@313, 314, 315
    // the badge: 100 px across, a 5 px accent ring round a cream disc, the mark 58 px inside; its centre 48 px
    // left of the card's right edge and 40 px under its top (clip34@350). The three land a frame apart (clip34@312-314)
    badge: { d: 100, ring: 5, mark: 0.58, dx: 48, dy: 40, gap: F(1) },
  },
  swap: {
    w: 1000, h: 800,                      // clip35@466: x 40..1040, y 40..840
    radius: 54,                           // corner fit 53.3
    fill: '#1B1C1F',                      // the untinted card (clip35@466, @555: #1F1C19; release palette [C26])
    stroke: { w: 2, c: '#303134' },       // inside the box (#34312E measured; release palette [C26])
    pic: { w: 652, h: 604 },              // the widest and the tallest icon (clip35@492, @518)
    // a line glyph: its box 0.70 of the card's height (by eye: its ink then covers what the reference's flat icons
    // do, 420 to 650 px by 420 to 600), the stroke in the tiles' proportion [R24]
    glyph: { size: 0.70, stroke: explain.tile.stroke / explain.tile.glyph },
    shadow: 'drop-shadow(0 17px 24px rgba(0,0,0,0.42))',   // under the icon: black 0.42, sigma 24, 17 px down (clip35@480, @550)
    fade: explain.morph,                  // 9 frames [D19]
    every: F(27),                         // without a word: the reference's shortest interval (27, 27, 44 frames)
    lag: explain.event.follow,            // the first picture starts 6 frames after the card (clip35@447, @453)
    // its scale on each frame after that (clip35@453-465; the picture is 600 px wide at rest)
    pop: [[0, 0.227], [2, 0.75], [4, 0.997], [5, 1.063], [7, 1.033], [9, 1.0], [10, 0.973], [12, 1.0]],
    label: { cap: 45, bottom: 64, gap: 44, weight: fonts.weight.caption },   // by eye
  },
};

const lin = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** A box on whole pixels, so that strokes and edges stay sharp (an odd height centres on a half pixel). */
const snap = (b) => (b.s === 1 ? { ...b, x: Math.round(b.x), y: Math.round(b.y) } : b);
const rgbOf = (c) => c.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16));

/** True when a still has transparent pixels on its border: a cut-out, which is printed in the house look. */
function isCutout(m) {
  if (!m || m.kind !== 'image') return false;
  try {
    const n = 32;
    const c = document.createElement('canvas'); c.width = n; c.height = n;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(m.img, 0, 0, n, n);
    const d = g.getImageData(0, 0, n, n).data;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (x > 0 && x < n - 1 && y > 0 && y < n - 1) continue;
      if (d[(y * n + x) * 4 + 3] < 128) return true;
    }
  } catch { /* a picture that cannot be read is shown as it is */ }
  return false;
}

/** The picture table as piecewise-linear scale. a = seconds since the pop started. */
function popScale(a) {
  const f = a * 30, T = I.swap.pop;
  if (f <= 0) return T[0][1];
  for (let k = 1; k < T.length; k++) if (f <= T[k][0]) return T[k - 1][1] + (T[k][1] - T[k - 1][1]) * ((f - T[k - 1][0]) / (T[k][0] - T[k - 1][0]));
  return 1;
}

const ITEM = {
  image: 'asset?',                                               // the user's still (png, jpg, webp). A cut-out on transparency is printed in the house look
  glyph: `enum?:${GLYPH_NAMES.join('|')}`,                       // or a line glyph
  label: { type: 'string', optional: true, maxChars: 13, maxWords: 2 },   // one line under the picture: 13 mixed-case characters are 263 px of a row card's 278
  at: 'word?',                                                   // the noun: the card arrives on it (row) or the picture changes on it (swap). The first item comes with the scene
};

export default {
  type: 'item-cards',
  label: 'Item cards',
  slots: ['graphic'],
  ownEntrance: true,
  params: {
    mode: 'enum?:row|swap',                                      // row (default): the cards stay side by side. swap: one card, one picture at a time
    items: { type: 'array', min: 2, max: 5, of: ITEM },          // row: 2 to 4. swap: 2 to 5
    mark: 'asset?',                                              // row: the user's own mark, carried by the badges
  },
  beats: {
    outline: {},                                                 // row: every card is outlined in the accent
    badge: { kind: `enum?:${BADGE_KINDS.join('|')}` },           // row: a badge lands on every card (default check; the mark when one is given)
  },

  async prepare(params, S) {
    const items = params.items || [];
    const media = await Promise.all(items.map((it) => (it.image ? loadMedia(S, it.image) : null)));
    return { media, cut: media.map(isCutout), mark: params.mark ? await loadMedia(S, params.mark) : null };
  },

  build(ctx) {
    const { S, params: p, tIn, tOut, beats, data } = ctx; const { h } = S.kit;
    const swap = p.mode === 'swap';
    let items = (p.items || []).map((it, i) => ({ ...it, m: data.media[i], cut: data.cut[i] }));
    if (!swap && items.length > 4) { S.warn('item-cards: a row holds at most 4 cards; the rest were left out'); items = items.slice(0, 4); }
    const n = items.length;
    if (!n) { S.warn('item-cards: no items'); return { el: h('div'), seek() {} }; }
    const T = swap ? I.swap : I.row;
    const hasLabel = items.some((it) => it.label);

    // a picture or a glyph, centred on (cx, cy) inside a parent; k scales the measured sizes
    const content = (it, cx, cy, maxW, maxH, k, ground, ink) => {
      const wrap = h('div', { style: { position: 'absolute', left: `${cx}px`, top: `${cy}px`, width: '0', height: '0', transformOrigin: '0 0' } });
      const m = it.m;
      if (m && m.kind === 'image') {
        const s = Math.min(maxW / m.w, maxH / m.h);
        const w = m.w * s, hh = m.h * s;
        let pic;
        if (it.cut) pic = printCutout(m.img, w, hh, { ground: rgbOf(ground) });
        else pic = h('img', { src: m.url });
        Object.assign(pic.style, { position: 'absolute', left: `${(-w / 2).toFixed(2)}px`, top: `${(-hh / 2).toFixed(2)}px`, width: `${w.toFixed(2)}px`, height: `${hh.toFixed(2)}px`, display: 'block', borderRadius: it.cut ? '' : `${Math.round(12 * k)}px` });
        wrap.append(pic);
        if (s > 2) S.warn(`item-cards: ${String(it.image).split('/').pop()} is enlarged ${s.toFixed(1)} times and will look soft; supply a larger file`);
      } else {
        if (m && m.kind === 'video') S.warn(`item-cards: ${String(it.image).split('/').pop()} is a clip; a card takes a still or a glyph`);
        const name = it.glyph || 'document';
        if (!it.glyph && !(m && m.kind === 'image')) S.warn('item-cards: an item has no image and no glyph; a document glyph is shown');
        const size = (swap ? T.h : T.w) * k * T.glyph.size;
        const g = glyph(name, size, size * T.glyph.stroke, ink);
        Object.assign(g.style, { position: 'absolute', left: `${(-size / 2).toFixed(2)}px`, top: `${(-size / 2).toFixed(2)}px` });
        wrap.append(g);
      }
      return wrap;
    };
    const labelNode = (text, cx, base, maxW, k) => {
      const Lb = T.label;
      const cap = fitCap(text, Lb.cap * k, Lb.weight, maxW, -0.02);
      const size = sizeForCap(cap, Lb.weight);
      return h('div', { text, style: { position: 'absolute', left: `${cx}px`, top: `${(base - size * fonts.M.base).toFixed(2)}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
        font: `${Lb.weight} ${size.toFixed(2)}px/1 ${fonts.sans}`, letterSpacing: '-0.02em', color: colour.cream } });
    };
    const cardNode = (x, y, w, hh, radius, shadow = true) => h('div.eb-item-card', { style: { position: 'absolute', left: `${x.toFixed(2)}px`, top: `${y}px`, width: `${w.toFixed(2)}px`, height: `${hh.toFixed(2)}px`, borderRadius: `${radius}px`,
      background: T.fill, boxShadow: `inset 0 0 0 ${T.stroke.w}px ${T.stroke.c}${shadow ? `, ${colour.shadow}` : ''}` } });

    // ------------------------------------------------------------------ swap: one card, one picture at a time
    if (swap) {
      const box = snap(place(ctx, T.w, T.h));
      const root = h('div.eb-item-swap', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${T.w}px`, height: `${T.h}px`, transformOrigin: '0 0', transform: box.s === 1 ? '' : `scale(${box.s})` } });
      const plate = cardNode(0, 0, T.w, T.h, T.radius);
      const cardWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${T.w}px`, height: `${T.h}px`, transformOrigin: '50% 50%' } }, plate);
      root.append(cardWrap);
      const Lb = T.label;
      const areaH = hasLabel ? T.h - Lb.bottom - Lb.cap - Lb.gap - 60 : T.h;
      const cy = hasLabel ? 60 + areaH / 2 : T.h / 2;
      let tPrev = null;
      const parts = items.map((it, i) => {
        const layer = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${T.w}px`, height: `${T.h}px` } });
        const pic = content(it, T.w / 2, cy, T.pic.w, Math.min(T.pic.h, areaH - 40), 1, T.fill, colour.accent);
        pic.style.filter = T.shadow;
        layer.append(pic);
        if (it.label) layer.append(labelNode(String(it.label).trim(), T.w / 2, T.h - Lb.bottom, T.w - 160, 1));
        plate.append(layer);
        const t0 = i === 0 ? tIn + T.lag : it.at !== undefined ? Math.max(tPrev + T.fade, S.wordTime(it.at)) : tPrev + T.every;
        tPrev = t0;
        return { layer, pic, t0 };
      });
      if (parts[n - 1].t0 > tOut - F(15)) S.warn('item-cards: the last picture arrives less than half a second before the scene ends; give the items words or use fewer');
      return {
        el: root, box: { x: box.x, y: box.y, w: box.w, h: box.h },
        seek(t) {
          applyState(cardWrap, enterAt(S, t - tIn));
          parts.forEach((part, i) => {
            const next = parts[i + 1];
            // a cross-fade: this picture comes up over 9 frames as the one before it goes [D19]
            const up = i === 0 ? (t >= part.t0 ? 1 : 0) : lin((t - part.t0) / T.fade);
            const down = next ? lin((t - next.t0) / T.fade) : 0;
            const o = up * (1 - down);
            setStyle(part.layer, 'display', o <= 0 ? 'none' : '');
            if (o <= 0) return;
            setStyle(part.layer, 'opacity', o >= 0.999 ? '' : o.toFixed(3));
            if (i === 0) { const s = popScale(t - part.t0); setStyle(part.pic, 'transform', Math.abs(s - 1) < 0.0005 ? '' : `scale(${s.toFixed(4)})`); }
          });
        },
      };
    }

    // ------------------------------------------------------------------ row: one card per noun
    const R = I.row;
    const k = n >= R.narrow ? (3 * R.w + 2 * R.gap - (n - 1) * R.gap) / (n * R.w) : 1;
    const cw = R.w * k, ch = R.h * k;
    const totalW = n * cw + (n - 1) * R.gap;
    const box = snap(place(ctx, totalW, ch));
    const root = h('div.eb-item-row', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${totalW}px`, height: `${ch}px`, transformOrigin: '0 0', transform: box.s === 1 ? '' : `scale(${box.s})` } });
    // the shadows lie under every card, so one card's shadow never darkens its neighbour (clip34@280: the strokes
    // between two cards read like the outer ones)
    const shadows = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0' } });
    root.append(shadows);
    const Lb = R.label;
    const padTop = 60 * k;
    const areaH = hasLabel ? ch - (Lb.bottom + Lb.cap + Lb.gap) * k - padTop : ch;
    const cy = hasLabel ? padTop + areaH / 2 : ch / 2;
    const markImg = data.mark && data.mark.kind === 'image' ? data.mark : null;
    const bOutline = beats.find((b) => b.do === 'outline'), bBadge = beats.find((b) => b.do === 'badge');
    let tPrev = null;
    const cards = items.map((it, i) => {
      const x = i * (cw + R.gap);
      const plate = cardNode(0, 0, cw, ch, R.radius * k, false);
      const shadow = h('div', { style: { position: 'absolute', left: `${x.toFixed(2)}px`, top: '0', width: `${cw.toFixed(2)}px`, height: `${ch.toFixed(2)}px`, borderRadius: `${R.radius * k}px`, boxShadow: colour.shadow, transformOrigin: '50% 50%' } });
      shadows.append(shadow);
      plate.append(content(it, cw / 2, cy, R.pic.w * k, Math.min(R.pic.h * k, areaH - (hasLabel ? 0 : 120 * k)), k, R.fill, colour.cream));
      if (it.label) plate.append(labelNode(String(it.label).trim(), cw / 2, ch - Lb.bottom * k, cw - 52 * k, k));
      const outline = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', borderRadius: 'inherit', boxShadow: `inset 0 0 0 ${R.stroke.w}px ${colour.accent}`, display: 'none' } });
      plate.append(outline);
      const wrap = h('div', { style: { position: 'absolute', left: `${x.toFixed(2)}px`, top: '0', width: `${cw.toFixed(2)}px`, height: `${ch.toFixed(2)}px`, transformOrigin: '50% 50%' } }, plate);
      // the badge sits over the corner, outside the card's own box
      let badge = null;
      if (bBadge) {
        const B = R.badge, d = B.d * k;
        if (markImg) {
          const ms = (d * B.mark) / Math.max(markImg.w, markImg.h);
          badge = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${d}px`, height: `${d}px`, borderRadius: '50%', background: colour.cream, boxShadow: `inset 0 0 0 ${(B.ring * k).toFixed(1)}px ${colour.accent}`, transformOrigin: '50% 50%' } },
            h('img', { src: markImg.url, style: { position: 'absolute', left: `${((d - markImg.w * ms) / 2).toFixed(2)}px`, top: `${((d - markImg.h * ms) / 2).toFixed(2)}px`, width: `${(markImg.w * ms).toFixed(2)}px`, height: `${(markImg.h * ms).toFixed(2)}px`, display: 'block' } }));
        } else badge = badgeNode(S, bBadge.kind || 'check', d);
        badge.style.display = 'none';
        wrap.append(badge);
      }
      root.append(wrap);
      // the first card is the anchor; the others arrive on their nouns, or 2 frames apart without one [X20, M16]
      const t0 = i === 0 ? tIn : it.at !== undefined ? Math.max(tIn, S.wordTime(it.at)) : tPrev + motion.stagger;
      tPrev = t0;
      return { wrap, shadow, outline, badge, t0, place: `translate(${(cw - (R.badge.dx + R.badge.d / 2) * k).toFixed(2)}px, ${((R.badge.dy - R.badge.d / 2) * k).toFixed(2)}px)` };
    });
    const tLast = cards[n - 1].t0 + motion.enter.dur;
    for (const b of [bOutline, bBadge]) if (b && b.t < tLast) S.warn(`item-cards: the ${b.do} beat comes before the last card has arrived`);

    return {
      el: root, box: { x: box.x, y: box.y, w: box.w, h: box.h },
      seek(t) {
        cards.forEach((c, i) => {
          const a = t - c.t0;
          setStyle(c.wrap, 'display', a < 0 ? 'none' : '');
          setStyle(c.shadow, 'display', a < 0 ? 'none' : '');
          if (a < 0) return;
          const st = enterAt(S, a);
          applyState(c.wrap, st); applyState(c.shadow, st);
          if (bOutline) setStyle(c.outline, 'display', t >= bOutline.t + i * R.outlineGap ? '' : 'none');
          if (c.badge) popAt(c.badge, t - bBadge.t - i * R.badge.gap, c.place);
        });
      },
    };
  },
};
