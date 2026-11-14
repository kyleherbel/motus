// Logo tiles: one to six products, each as its own mark on a cream rounded square, in one centred row
// (research/graphics.md G21, motion.md M16, colour.md C15). The mark is a picture the user supplies for
// this video; the style ships no logos. A tile without a picture shows one or two initials of its name
// in the heavy weight. The tiles arrive one after another in reading order, 2 to 3 frames apart, each
// through the standard blur entrance, and then hold still.
// When the speaker lists the products, give each tile the word that names it (`at`): the tile then arrives on
// its noun, in its own place in the row, which is laid out for all the tiles from the start so nothing shifts
// (research/explain.md X20: 12 of 12 list items start within 3.2 frames of their noun, median +0.7).
// The reference never sets a label under a tile: a name that must be read belongs in `chips`.
import { layout, motion, fonts, type, colour } from '../tokens.js';
import { place, enterAt, applyState, setStyle, fitCap, sizeForCap } from '../common.js';
import { loadMedia } from '../media.js';

// TOKENS (research/graphics.md G21; measured on settled frames)
const G = {
  // clip33@112: three settled tiles of 150 px in a row. Single tiles beside other graphics read 130
  // (clip39@80), 136 (clip38@1030), 140 (clip35@230) and 161 (clip35@1060); the 128 px in G21 is the same
  // row at clip33@100, still arriving
  side: 150,
  radius: 0.286,                            // of the side; the corner fit reads 44.5 on 150 (0.297), 38.4 on 130, 41.5 on 140, 46.2 on 161
  gap: 60,                                  // clip33@112: pitch 210
  maxW: layout.column.w,                    // six tiles are scaled to the column (125 px tiles, 50 px gaps): by eye, the reference row has 3
  mark: 0.56,                               // the mark's longer side, of the tile's: 83 to 87 px in 150, 91 in 161, 78 in 140
  shadow: '0 14px 44px rgba(0,0,0,0.54)',   // black 0.52, sigma 19 px, 14 px down (fit on clip33@112): the chips' shadow
  initials: { cap: [0.36, 0.30], maxW: 0.64 },   // by eye: cap height of one letter and of two, of the side; a wide pair is fitted to maxW
};

/** "Tidy Folder" -> "TF", "notes" -> "N", "3D print" -> "3P" */
function initials(name) {
  const words = String(name || '').trim().split(/[\s\-_/.]+/).filter(Boolean);
  return words.slice(0, 2).map((w) => [...w][0].toUpperCase()).join('');
}

export default {
  type: 'logo-tiles',
  label: 'Logo tiles',
  slots: ['graphic'],
  ownEntrance: true,
  params: {
    tiles: { type: 'array', min: 1, max: 6, of: {
      image: 'asset?',                                        // the product's own mark, supplied per video; a square png or svg reads best
      name: { type: 'string', optional: true, maxChars: 24 }, // only its initials are shown, and only when there is no image
      at: 'word?',                                            // the noun that names it: the tile arrives on it. Default: 2 to 3 frames after the one before
    } },
  },
  beats: {},

  async prepare(params, S) {
    return { images: await Promise.all((params.tiles || []).map((t) => (t.image ? loadMedia(S, t.image) : null))) };
  },

  build(ctx) {
    const { S, params: p, tIn, data } = ctx; const { h } = S.kit;
    const tiles = p.tiles || [];
    const n = tiles.length;
    const natural = n * G.side + (n - 1) * G.gap;
    const k = Math.min(1, G.maxW / natural);
    const side = G.side * k, gap = G.gap * k;
    const totalW = n * side + (n - 1) * gap;
    const box = place(ctx, totalW, side);
    const root = h('div.eb-logo-tiles', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${totalW}px`, height: `${side}px`, transformOrigin: '0 0', transform: box.s === 1 ? '' : `scale(${box.s})` } });
    let tPrev = null;
    const parts = tiles.map((tile, i) => {
      const el = h('div.eb-logo-tile', { style: { position: 'absolute', left: `${(i * (side + gap)).toFixed(2)}px`, top: '0', width: `${side.toFixed(2)}px`, height: `${side.toFixed(2)}px`,
        borderRadius: `${(side * G.radius).toFixed(2)}px`, background: colour.cream, boxShadow: G.shadow } });
      const img = data.images[i] && data.images[i].kind === 'image' ? data.images[i] : null;
      if (img) {
        const s = (side * G.mark) / Math.max(img.w, img.h);
        const w = img.w * s, hh = img.h * s;
        el.append(h('img', { src: img.url, style: { position: 'absolute', left: `${((side - w) / 2).toFixed(2)}px`, top: `${((side - hh) / 2).toFixed(2)}px`, width: `${w.toFixed(2)}px`, height: `${hh.toFixed(2)}px`, display: 'block' } }));
      } else {
        const text = initials(tile.name);
        if (!text) S.warn(`logo-tiles: tile ${i + 1} has no image and no name; it is an empty tile`);
        else {
          const cap = fitCap(text, side * G.initials.cap[text.length > 1 ? 1 : 0], fonts.weight.heavy, side * G.initials.maxW, type.figure.tracking);
          const size = sizeForCap(cap, fonts.weight.heavy);
          // the tracking also trails the last letter: half of it is taken back so the ink is centred
          el.append(h('div', { text, style: { position: 'absolute', left: `${(side / 2 + (type.figure.tracking * size) / 2).toFixed(2)}px`, top: `${(side / 2 + cap / 2 - size * fonts.M.base).toFixed(2)}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
            font: `${fonts.weight.heavy} ${size.toFixed(2)}px/1 ${fonts.sans}`, letterSpacing: `${type.figure.tracking}em`, color: colour.field } }));
        }
      }
      root.append(el);
      // on its noun [X20], or in reading order after the tile before it [M16]: clip33@92-97 starts 2.0 and 2.1 frames apart
      const t0 = tile.at !== undefined ? Math.max(tIn, S.wordTime(tile.at)) : tPrev === null ? tIn : tPrev + motion.stagger;
      tPrev = t0;
      return { el, t0 };
    });

    return {
      el: root, box,
      seek(t) {
        for (const part of parts) {
          const a = t - part.t0;
          setStyle(part.el, 'display', a < 0 ? 'none' : '');
          if (a >= 0) applyState(part.el, enterAt(S, a, motion.enter.presets.tile));
        }
      },
    };
  },
};
