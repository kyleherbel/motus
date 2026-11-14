// Chips: one to six short labels in a centred row, or in wrapped rows when they do not fit
// (research/graphics.md G20, motion.md M16, colour.md C12, C15). Two families, one per element:
//   name   cream tiles with dark text, for the names of things (a platform, an app, a file type)
//   path   dark pills with cream text, for paths, URLs, commands and makers
// Each chip is a label with an optional small picture in front of it (the user's file). Chips that fit one
// row at one shared width take it, as the pair of platform tiles in the reference does; longer lists wrap,
// each chip as wide as its content. Each chip arrives through the standard blur entrance: in reading order
// 2 to 3 frames apart, or on the word that names it. The pair in the reference arrives within one frame
// (clip29@887); the stagger is the style's own [M16].
//   highlight  path pills only: the accent bar wipes under one label while the speaker reads it out
import { layout, motion, fonts, colour, F } from '../tokens.js';
import { place, enterAt, applyState, setStyle, measureText, fontFor, sizeForCap } from '../common.js';
import { loadMedia } from '../media.js';

// TOKENS (research/graphics.md G20; measured on settled frames, clip@frame given per line).
// Paddings run from the chip's edge to the text's layout box, which is 1 to 4 px wider than its ink.
const G = {
  gap: 30,                                  // between chips (clip29@920) and between stacked tiles (clip32@900)
  maxW: layout.column.w,                    // a row never leaves the column [G04]
  // one soft shadow, smaller than the cards': black 0.54, sigma 22 px, 14 px down (fit on clip29@920,
  // clip32@1000, clip35@120; rmse 0.02 of the field level)
  shadow: '0 14px 44px rgba(0,0,0,0.54)',
  weight: fonts.weight.caption,             // stems 0.19 of the cap height (clip35@120: 9.25 on 47.85 px)
  name: {
    ink: colour.field,                      // dark text on cream reads #13110B to #1D1C1C (clip38@1240, clip30@980, clip29@920)
    // two measured sizes. By eye: large when every chip fits one row at that size, as the pair of platform tiles does
    large: { h: 164, padX: 25, padPic: 28, cap: 68, radius: 30.5, pic: 80, picGap: 24 },   // clip29@920: 470 x 164, corner fit 32; the mark's ink sits 28 px in
    small: { h: 116, padX: 35, padPic: 36, cap: 45, radius: 34.8, pic: 60, picGap: 18 },   // clip32@1000: 390 x 116, corner fit 36.3; clip30@980: 232 x 116
  },
  // clip35@120: 446 x 122 with its stroke, radius half the height, cap height 47.85 (x-height 33 on clip38@340, clip29@1060)
  path: { h: 122, padX: 49, padPic: 38, cap: 48, pic: 72, picGap: 22, stroke: 2 },
  // the bar under a pill's label (clip38@360-398): 10 px beyond the text box (12 beyond its ink), from 4 px
  // under the cap line to 15.5 px under the baseline, radius 9; it wipes left to right on a sine ease in
  // 39 frames (rmse 0.016 of its length), or until the word given; never faster than 8 frames (by eye)
  bar: { padX: 10, top: 4, below: 15.5, radius: 9, dur: F(39), min: F(8) },
  minCap: 26,                               // by eye: a label is never shrunk below this
};

const hex = (c) => c.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16));
const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
const sine = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * x));

export default {
  type: 'chips',
  label: 'Chips',
  slots: ['graphic'],
  ownEntrance: true,
  params: {
    kind: 'enum?:name|path',                // name (default): cream tiles. path: dark pills for paths, URLs, commands, makers
    chips: { type: 'array', min: 1, max: 6, of: {
      label: { type: 'string', maxChars: 24 },   // mixed case: 24 characters fill the column; up to 12 each sit two in a row, up to 7 three in a row; two names of up to 8 are set large
      image: 'asset?',                           // a small picture in front of the label (png with transparency reads best)
      at: 'word?',                               // the word that names it: the chip arrives on it. Default: 2 to 3 frames after the one before
    } },
  },
  beats: {
    highlight: { chip: { type: 'number', optional: true, min: 1, max: 6 }, until: 'word?' },   // which pill (default 1); the last word of the path as read out
  },

  async prepare(params, S) {
    return { images: await Promise.all((params.chips || []).map((c) => (c.image ? loadMedia(S, c.image) : null))) };
  },

  build(ctx) {
    const { S, params: p, tIn, beats, data } = ctx; const { h } = S.kit;
    const path = p.kind === 'path';
    const items = (p.chips || []).map((c, i) => ({ label: String(c.label).trim(), at: c.at, img: data.images[i] && data.images[i].kind === 'image' ? data.images[i] : null }));
    const n = items.length;

    // ---- measure at a size
    const measureAt = (Z) => {
      const font = fontFor(Z.cap, G.weight);
      const rows = items.map((it) => {
        const tw = measureText(it.label, font);
        const ps = it.img ? Math.min(Z.pic / it.img.w, Z.pic / it.img.h) : 0;
        const pw = it.img ? it.img.w * ps : 0, ph = it.img ? it.img.h * ps : 0;
        const padL = it.img ? Z.padPic : Z.padX;
        return { tw, pw, ph, padL, w: padL + (it.img ? pw + Z.picGap : 0) + tw + Z.padX };
      });
      return { Z, rows, w: Math.max(...rows.map((r) => r.w)) };
    };
    const oneRow = (mm) => n * mm.w + (n - 1) * G.gap <= G.maxW;     // every chip at the widest chip's width
    let m;
    if (path) m = measureAt(G.path);
    else {
      m = measureAt(G.name.large);
      if (!oneRow(m)) m = measureAt(G.name.small);
    }
    // a label too long for the column is shrunk, never clipped
    let shrink = 1;
    if (m.w > G.maxW) {
      const widest = m.rows.reduce((a, b) => (b.w > a.w ? b : a));
      const fixed = widest.w - widest.tw;
      shrink = Math.max(G.minCap / m.Z.cap, (G.maxW - fixed) / widest.tw);
      S.warn(`chips: "${items[m.rows.indexOf(widest)].label}" is too long for the column at the reference size; the labels were set at ${Math.round(shrink * 100)} %`);
      m = measureAt({ ...m.Z, cap: m.Z.cap * shrink });
    }
    const Z = m.Z;
    // ---- rows. Chips that fit one row at one shared width take it, as the reference pair does (470 and 470 px
    // around marks of 413 and 395 px). Otherwise each chip is as wide as its content and the rows wrap: the
    // fewest rows that fit, cut where the widest row is narrowest (by eye: the reference has no wrapped row).
    let widths, cuts;
    if (oneRow(m)) { widths = items.map(() => m.w); cuts = [n]; }
    else {
      widths = m.rows.map((r) => Math.min(r.w, G.maxW));
      const rowW = (a, b) => widths.slice(a, b).reduce((x, y) => x + y, 0) + (b - a - 1) * G.gap;
      let best = null;
      for (let rowsN = 1; rowsN <= n && !best; rowsN++) {
        const walk = (start, left, acc, widest) => {
          if (left === 1) {
            const w = rowW(start, n);
            if (w <= G.maxW && (!best || Math.max(widest, w) < best.widest)) best = { cuts: [...acc, n], widest: Math.max(widest, w) };
            return;
          }
          for (let end = start + 1; end <= n - (left - 1); end++) {
            const w = rowW(start, end);
            if (w > G.maxW) break;
            walk(end, left - 1, [...acc, end], Math.max(widest, w));
          }
        };
        walk(0, rowsN, [], 0);
      }
      cuts = best.cuts;
    }
    const rowsOf = cuts.map((end, r) => ({ from: r ? cuts[r - 1] : 0, to: end }));
    const widthOf = (row) => widths.slice(row.from, row.to).reduce((x, y) => x + y, 0) + (row.to - row.from - 1) * G.gap;
    const totalW = Math.max(...rowsOf.map(widthOf));
    const totalH = rowsOf.length * Z.h + (rowsOf.length - 1) * G.gap;
    const box = place(ctx, totalW, totalH);

    const root = h('div.eb-chips', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${totalW}px`, height: `${totalH}px`, transformOrigin: '0 0', transform: box.s === 1 ? '' : `scale(${box.s})` } });
    const size = sizeForCap(Z.cap, G.weight);
    const fillRgb = hex(colour.card.fill);
    const chips = [];
    let tPrev = null;
    items.forEach((it, i) => {
      const r = rowsOf.findIndex((row) => i >= row.from && i < row.to);
      const row = rowsOf[r];
      const cw = widths[i];
      const x = (totalW - widthOf(row)) / 2 + widths.slice(row.from, i).reduce((a, b) => a + b + G.gap, 0);
      const y = r * (Z.h + G.gap);
      const mm = m.rows[i];
      const el = h(`div.eb-chip.eb-chip-${path ? 'path' : 'name'}`, { style: { position: 'absolute', left: `${x.toFixed(2)}px`, top: `${y}px`, width: `${cw.toFixed(2)}px`, height: `${Z.h}px`, boxSizing: 'border-box',
        borderRadius: `${path ? Z.h / 2 : Z.radius}px`, background: path ? colour.card.fill : colour.cream,
        boxShadow: path ? `inset 0 0 0 ${G.path.stroke}px ${colour.card.stroke}, ${G.shadow}` : G.shadow } });
      // content is centred in the shared width
      const cx0 = (cw - mm.w) / 2 + mm.padL;
      const base = Z.h / 2 + Z.cap / 2;                     // caps centred on the chip (clip35@120, clip32@1000)
      let tx = cx0;
      if (it.img) {
        el.append(h('img', { src: it.img.url, style: { position: 'absolute', left: `${cx0.toFixed(2)}px`, top: `${(Z.h / 2 - mm.ph / 2).toFixed(2)}px`, width: `${mm.pw.toFixed(2)}px`, height: `${mm.ph.toFixed(2)}px`, display: 'block' } }));
        tx += mm.pw + Z.picGap;
      }
      const bar = path ? h('div', { style: { position: 'absolute', left: `${(tx - G.bar.padX).toFixed(2)}px`, top: `${(base - Z.cap + G.bar.top * shrink).toFixed(2)}px`, width: `${(mm.tw + G.bar.padX * 2).toFixed(2)}px`,
        height: `${(Z.cap - G.bar.top * shrink + G.bar.below * shrink).toFixed(2)}px`, borderRadius: `${G.bar.radius}px`, background: mix(fillRgb, hex(colour.accent), colour.highlight.dark), display: 'none' } }) : null;
      if (bar) el.append(bar);
      el.append(h('div', { text: it.label, style: { position: 'absolute', left: `${tx.toFixed(2)}px`, top: `${(base - size * fonts.M.base).toFixed(2)}px`, whiteSpace: 'nowrap',
        font: `${G.weight} ${size.toFixed(2)}px/1 ${fonts.sans}`, color: path ? colour.cream : G.name.ink } }));
      root.append(el);
      // on its word, or a stagger after the chip before it [M16]
      const t0 = it.at !== undefined ? Math.max(tIn, S.wordTime(it.at)) : tPrev === null ? tIn : tPrev + motion.stagger;
      tPrev = t0;
      chips.push({ el, t0, bar, barW: mm.tw + G.bar.padX * 2, hl: null });
    });

    for (const b of beats) {
      if (b.do !== 'highlight') continue;
      const ch = chips[(b.chip ?? 1) - 1];
      if (!path) { S.warn('chips: highlight belongs to path pills; the reference never marks a cream tile'); continue; }
      if (!ch) { S.warn(`chips: highlight names chip ${b.chip}, but there are ${n}`); continue; }
      const end = b.until !== undefined ? S.wordEnd(b.until) : b.t + G.bar.dur;
      ch.hl = { t: b.t, dur: Math.max(G.bar.min, end - b.t) };
    }

    return {
      el: root, box,
      seek(t) {
        for (const ch of chips) {
          const a = t - ch.t0;
          setStyle(ch.el, 'display', a < 0 ? 'none' : '');
          if (a < 0) continue;
          applyState(ch.el, enterAt(S, a, motion.enter.presets.chip));
          if (!ch.bar) continue;
          const on = ch.hl && t >= ch.hl.t;
          setStyle(ch.bar, 'display', on ? '' : 'none');
          if (!on) continue;
          const e = sine((t - ch.hl.t) / ch.hl.dur);
          setStyle(ch.bar, 'clipPath', e >= 0.9999 ? 'none' : `inset(0 ${(ch.barW * (1 - e)).toFixed(1)}px 0 0 round ${G.bar.radius}px)`);
        }
      },
    };
  },
};
