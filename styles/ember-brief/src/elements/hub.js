// A hub: things that feed one card (research/explain-composites.md K01-K05). The reference's "your dashboards
// pull live data from all of your connected apps" (clip34@696-764) is a composite, not a card: a dark card sits in
// the lower part of the field, a row of app tiles sits above it, a thin grey line curves down from each tile into
// the top of the card, and accent dots run down the lines into it while the card's figure counts. It acts out
// "connects to many", "pulls from", "integrates with": the sources arrive, the lines join them to the one thing, and
// the flow is what the speaker says it does.
//   sources  1 to 5 tiles in one row, each holding the thing's own mark; a source with `at` arrives on its noun
//   target   the card they feed: its mark and name in a header row, then an optional figure and label
//   flow     on its word a dot runs down every line into the card, the lines 2 frames apart [K03]; with
//            dir "out" the dots run from the card up to the tiles: the one thing reaching out to many
//   outline  an accent box round the card, when it is the state that changed [K04]
//   check    a check disc lands on the card's top-right corner [X18]
// The figure counts across its own word (`at`), as a big figure does [X16].
import { CX, F, motion, fonts, colour, explain as X } from '../tokens.js';
import { place, enterAt, applyState, setStyle, textAt, fitCap, measureText, fontFor, expoInOut, parseFigure, formatFigure } from '../common.js';
import { card } from '../card.js';
import { loadMedia } from '../media.js';
import { badgeNode, popAt, linePath, tileNode, GLYPH_NAMES } from '../marks.js';
import { outlineBox, seekOutline } from './ui-card.js';

// TOKENS (research/explain-composites.md K01-K05; clip34@708-764, measured on native frames)
export const HUB = {
  tile: { side: 158, pitch: 260, radius: 0.25, mark: 0.55 },      // four settled tiles: 159 px, centres 150, 410, 670, 930 [K01]
  wire: { gap: 70, len: 230, spread: 0.72, stroke: 3, colour: '#4B4C50', bend: 0.55 },   // lines start 70 px under the tiles, end on the card top 230 px lower; ends 250..810 for starts 150..930 [K02]
  card: { h: 332, head: 104, mark: 64, nameCap: 38, figCap: 112, labelCap: 34, padX: 56 },  // the card's header row and its figure (clip34@764: header 104, figure cap 112) [K01]
  dot: 13, travel: F(14), lineGap: F(2),                           // dots 12 to 14 px, 14 frames down a line, the lines 2 frames apart (clip34@720-734) [K03]
  tileGap: F(2), lineAfter: F(10),                                 // tiles 2 frames apart after the card (698, 700, 702, 704); a line draws once its tile has settled [K02]
};

const hex = (c) => c.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16));

export default {
  type: 'hub',
  label: 'Hub',
  slots: ['graphic'],
  ownEntrance: true,
  params: {
    sources: { type: 'array', min: 1, max: 5, of: {
      image: 'asset?',                                         // the thing's own mark, supplied per video
      glyph: `enum?:${GLYPH_NAMES.join('|')}`,                 // a line icon when there is no mark
      name: { type: 'string', optional: true, maxChars: 24 },  // not drawn: initials stand in when there is no image or glyph
      at: 'word?',                                             // the noun that names it: the tile and its line arrive on it
    } },
    target: { name: { type: 'string', maxChars: 18 }, image: 'asset?', glyph: `enum?:${GLYPH_NAMES.join('|')}` },
    value: { type: 'string', optional: true, maxChars: 12 },   // a figure in the card, as said ("500+"), or a one-word state ("Proactive")
    label: { type: 'string', optional: true, maxChars: 24, maxWords: 4 },   // under the figure
    at: 'word?',                                               // the figure's number word: it counts across it
  },
  beats: { flow: { dir: 'enum?:in|out' }, outline: {}, check: {} },

  async prepare(params, S) {
    const srcs = params.sources || [];
    return {
      images: await Promise.all(srcs.map((s) => (s && s.image ? loadMedia(S, s.image) : null))),
      target: params.target && params.target.image ? await loadMedia(S, params.target.image) : null,
    };
  },

  build(ctx) {
    const { S, params: p, tIn, beats, data } = ctx; const { kit } = S; const { h } = kit;
    const srcs = (p.sources || []).slice(0, 5);
    const T = HUB.tile, Wr = HUB.wire, C = HUB.card;
    const n = srcs.length;
    const totalH = T.side + Wr.gap + Wr.len + C.h;
    const box = place(ctx, 1000, totalH);
    const s = box.s;
    const top = box.y;
    const yTile = top, yWire0 = top + (T.side + Wr.gap) * s, yCard = top + (T.side + Wr.gap + Wr.len) * s;
    const side = T.side * s, pitch = Math.min(T.pitch, n > 1 ? (1000 - T.side) / (n - 1) : T.pitch) * s;
    const xs = srcs.map((_, i) => CX + (i - (n - 1) / 2) * pitch);
    const root = h('div.eb-hub', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });

    // ---- the card [K01]
    const cw = 1000 * s, ch = C.h * s, cx0 = CX - cw / 2;
    const cardWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0', display: 'none' } });
    const el = card(S, { x: cx0, y: yCard, w: cw, h: ch, kind: 'dark', clip: false });
    cardWrap.append(el);
    const tg = p.target || {};
    const markSide = C.mark * s;
    const tImg = data.target && data.target.kind === 'image' ? data.target : null;
    const mark = tileNode(S, { side: markSide, fill: tImg ? 'cream' : 'accent', image: tImg, glyph: tImg ? null : tg.glyph || 'link', initials: '' });
    Object.assign(mark.style, { left: `${(C.padX * s).toFixed(1)}px`, top: `${((C.head * s - markSide) / 2).toFixed(1)}px` });
    el.append(mark);
    const nameX = C.padX * s + markSide + 26 * s;
    const nameCap = fitCap(tg.name || '', C.nameCap * s, fonts.weight.caption, cw - nameX - C.padX * s);
    el.append(textAt(S, { text: tg.name || '', x: nameX, y: C.head * s / 2 + nameCap / 2, cap: nameCap, weight: fonts.weight.caption, align: 'left', tracking: -0.02 }));
    el.append(h('div', { style: { position: 'absolute', left: '0', top: `${(C.head * s).toFixed(1)}px`, width: `${cw}px`, height: '2px', background: colour.card.stroke } }));
    let figEl = null, fig = null, figGroup = null;
    if (p.value) {
      fig = parseFigure(p.value);
      const room = ch - C.head * s;
      const figCap = C.figCap * s, labCap = C.labelCap * s;
      const block = figCap + (p.label ? 34 * s + labCap : 0);
      const yFig = C.head * s + (room - block) / 2 + figCap;
      figEl = textAt(S, { text: p.value, x: C.padX * s, y: yFig, cap: fitCap(p.value, figCap, fonts.weight.heavy, cw - C.padX * s * 2, -0.04), weight: fonts.weight.heavy, align: 'left', tracking: -0.04 });
      figGroup = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${cw}px`, height: `${ch}px`, transformOrigin: `${C.padX * s}px ${yFig}px` } }, figEl);
      if (p.label) figGroup.append(textAt(S, { text: p.label, x: C.padX * s, y: yFig + 34 * s + labCap, cap: labCap, weight: fonts.weight.light, colour: colour.muted, align: 'left', tracking: -0.015 }));
      el.append(figGroup);
    } else if (p.label) S.warn('hub: a label without a value is not shown');
    root.append(cardWrap);
    const outlines = beats.filter((b) => b.do === 'outline').map((b) => { const o = outlineBox(S, { x: 0, y: 0, w: cw, h: ch, radius: 30 }); el.append(o); return { el: o, t: b.t }; });
    const bCheck = beats.find((b) => b.do === 'check');
    let badge = null;
    if (bCheck) {
      const d = X.badge.size * s;
      badge = badgeNode(S, 'check', d);
      Object.assign(badge.style, { left: `${(cx0 + cw - d * 0.62).toFixed(1)}px`, top: `${(yCard - d * 0.38).toFixed(1)}px`, display: 'none' });
      root.append(badge);
    }

    // ---- sources, their lines and dots [K01-K03]
    let tPrev = tIn;
    const wires = srcs.map((src, i) => {
      const img = data.images[i] && data.images[i].kind === 'image' ? data.images[i] : null;
      const tile = tileNode(S, { side, fill: 'dark', image: img, glyph: img ? null : src.glyph, initials: img || src.glyph ? '' : String(src.name || '').slice(0, 2) });
      Object.assign(tile.style, { borderRadius: `${(side * T.radius).toFixed(1)}px`, boxShadow: `inset 0 0 0 2px ${colour.card.stroke}, 0 14px 44px rgba(0,0,0,0.5)` });
      const im = tile.querySelector('img');
      if (im) Object.assign(im.style, { width: `${(side * T.mark).toFixed(1)}px`, height: `${(side * T.mark).toFixed(1)}px` });
      const tileWrap = h('div', { style: { position: 'absolute', left: `${(xs[i] - side / 2).toFixed(1)}px`, top: `${yTile.toFixed(1)}px`, width: `${side.toFixed(1)}px`, height: `${side.toFixed(1)}px`, display: 'none' } }, tile);
      const x0 = xs[i], x1 = CX + (xs[i] - CX) * Wr.spread, y0 = yWire0, y1 = yCard + 1;
      const dy = y1 - y0;
      const d = `M${x0.toFixed(1)} ${y0.toFixed(1)} C${x0.toFixed(1)} ${(y0 + dy * Wr.bend).toFixed(1)} ${x1.toFixed(1)} ${(y1 - dy * Wr.bend).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
      const line = linePath(S, d, { style: 'solid', stroke: Wr.stroke * s, color: Wr.colour });
      const t0 = src.at !== undefined ? Math.max(tIn, S.wordTime(src.at)) : tPrev + HUB.tileGap;
      tPrev = t0;
      const dots = [];
      root.append(line.el, tileWrap);
      return { tile: tileWrap, line, t0, tLine: t0 + HUB.lineAfter, dots };
    });
    // flows: a dot down every line that has arrived, 2 frames apart [K03]
    for (const b of beats.filter((x) => x.do === 'flow')) {
      let k = 0;
      for (const w of wires) {
        const ts = Math.max(b.t + k * HUB.lineGap, w.tLine + X.line.draw * (b.dir === 'out' ? 1 : 0.6));
        const dot = h('div', { style: { position: 'absolute', left: `${(-HUB.dot * s / 2).toFixed(1)}px`, top: `${(-HUB.dot * s / 2).toFixed(1)}px`, width: `${(HUB.dot * s).toFixed(1)}px`, height: `${(HUB.dot * s).toFixed(1)}px`, borderRadius: '50%', background: colour.accent, display: 'none' } });
        root.append(dot);
        w.dots.push({ el: dot, t0: ts, out: b.dir === 'out' });
        k++;
      }
    }
    if (!wires.length) S.warn('hub: no sources');

    // ---- the figure counts across its word [X16]; with no word it is written as it arrives
    const tCount = p.at !== undefined ? Math.max(tIn, S.wordTime(p.at) - F(1)) : null;
    const origin = `${CX}px ${(yCard + ch / 2).toFixed(1)}px`;
    const tB = bCheck ? bCheck.t : null;

    return {
      el: root, box: { x: box.x, y: top, w: 1000 * s, h: totalH * s },
      seek(t) {
        const a = t - tIn;
        setStyle(cardWrap, 'display', a < 0 ? 'none' : '');
        if (a >= 0) applyState(cardWrap, enterAt(S, a, motion.enter.presets.card), origin);
        for (const w of wires) {
          const at = t - w.t0;
          setStyle(w.tile, 'display', at < 0 ? 'none' : '');
          if (at >= 0) applyState(w.tile, enterAt(S, at, motion.enter.presets.tile), '50% 50%');
          w.line.draw(expoInOut((t - w.tLine) / X.line.draw));
          for (const d of w.dots) {
            const u = (t - d.t0) / HUB.travel;
            const on = u >= 0 && u <= 1;
            setStyle(d.el, 'display', on ? '' : 'none');
            if (!on) continue;
            const q = expoInOut(u) * 0.985;
            const [x, y] = w.line.point(d.out ? 1 - q : q);
            setStyle(d.el, 'transform', `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`);
          }
        }
        // with a word, the figure arrives on it and counts as it arrives (clip29@555: the figure lands counting) [X16]
        if (figGroup && tCount !== null) {
          const af = t - tCount;
          setStyle(figGroup, 'display', af < 0 ? 'none' : '');
          if (af >= 0) applyState(figGroup, enterAt(S, af, motion.enter.presets.figure));
          if (fig) {
            const r = expoInOut(kit.clamp(af / motion.countUp.dur));
            const txt = r >= 1 ? p.value : formatFigure(fig, fig.num * r);
            if (figEl.textContent !== txt) figEl.textContent = txt;
          }
        }
        for (const o of outlines) seekOutline(S, o.el, t, o.t);
        if (badge) popAt(badge, t - tB);
      },
    };
  },
};
