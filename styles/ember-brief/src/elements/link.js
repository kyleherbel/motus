// A link: two things and the line between them, for "A connects to B", "A asks B and gets an answer",
// "A and B are in sync" and "A talks to B" (research/explain.md X19, X10; explain-motion.md D02-D08, D20;
// explain-look.md R18, R19, R21).
//
// A node is a cream tile holding the user's mark (a picture supplied for this video), a line glyph or the
// name's initials, with a short name beside it; when the two names do not fit beside the tiles they sit
// under them. The style ships no marks and draws none.
//
// The measured order [X19]: the first node arrives with the scene, the line draws on the verb, the second
// node arrives on its name, and a check disc lands on the middle of the line 7 frames later.
//   connect   the line draws from the first node to the second
//   check     the check disc lands on the line and the line takes the accent
//   send      a dot travels the line from one node to the other; when it arrives the target takes an
//             accent outline. Two sends are a request and its reply: the second runs back
// Three lines:
//   solid     a cream stroke that grows from the first node
//   dotted    accent dots that appear whole, with a dot that keeps travelling: "in sync"
//   waves     two still dotted sine waves, one accent and one cream: "talks to"
// Nothing here has an arrowhead [X31]. After its last event the picture is still, except the dotted line's dot.
import { CX, layout, motion, fonts, colour, explain as X, F } from '../tokens.js';
import { place, enterAt, setStyle, textAt, measureText, fontFor, fitCap } from '../common.js';
import { loadMedia } from '../media.js';
import { tileNode, badgeNode, linePath, drawProgress, travellerNode, GLYPH_NAMES } from '../marks.js';

// TOKENS (research/explain.md X10, X19; explain-motion.md D02, D04-D08, D10, D20; explain-look.md R18, R19, R21).
// Geometry is measured on clip35@1079 (the settled row) and clip30@960-1025 (the waves); x is frame px.
const G = {
  side: 161,                    // tile: x 46..206, y 319..479 (clip35@1079). Its radius is the shared 0.31 [R23]: 50 px against 46 read here
  name: {
    cap: 51, weight: fonts.weight.caption,   // cap top 372, baseline 423; stem 9 px = 0.18 of the cap height (clip35@1079)
    gap: 18,                    // tile to the name's text box: its ink starts 20.5 px (first node) and 19.5 px (second) from the tile
    rise: 1,                    // the capitals' middle sits 2.5 px over the tile's centre line (cap 372..423, tile centre 399.5); 1 lands there after the browser's baseline snap
    besideMin: 44,              // by eye: names beside their tiles are never set smaller than this
    toLine: 37.5,               // name's text box to the line's cap: ink to cap 40 px
  },
  line: {
    len: 228,                   // cap to cap, x 489..717; the stroke is the shared 10 px [R18, D02]
    toTile: 21.5,               // line cap to a tile: 717.5 -> 739
  },
  // the check disc [D10, R18, R21: clip35@1070-1079]: 75.6 px in the row's later, smaller state (x 0.938) = 81 px here.
  // It snaps on: nothing for 2 frames, then opaque and sharp at 0.57 of its size, 0.885 and 1.0 on frames 1072, 1073
  // and 1075 (an ease-out cubic over 3.5 frames fits the three states). The reference's disc passes 90 px on the way
  // and settles back over the next frames; that overshoot is not built [D12]
  disc: 81,
  cut: 4,                       // by eye: the line stops 4 px short of the disc. The reference's line meets its disc, which is in another colour
  snap: { lag: F(2), from: 0.57, dur: F(3.5) },
  checkAfter: F(7),             // after the second node starts [X10: clip35@1063, 1070]
  recolour: { lag: F(2), dur: F(1) },   // the line is cream on frame 1072 and in the new colour on 1073 [D10]
  // nodes arrive along the row: the first from the left, the second from the right, 60 px, through the standard
  // blur entrance (clip35@1027-1033: x 0 -> 45 with y still; clip35@1065-1072: centre x 884.5 -> 819.5)
  enter: { from: 60, scaleFrom: 0.94 },
  under: { gap: 30, pad: 56 },  // by eye: tile to the cap line of a name set under it; names keep 56 px between them
  maxW: layout.column.w,        // the row never leaves the column [L10]; the reference row is 989 px (x 46..1034)
  minCap: 36,                   // by eye: a name is never set smaller than this
  // send [D05, D06, D08]: the shared 21 px accent dot, the whole line in 26 frames. The curve is the reference's
  // connector between two cards (clip31@522-552: sine in-out over 28 to 32 frames, rmse 0.009 to 0.015)
  send: { dur: X.traveller.dur, pop: motion.toggle },
  // arrival [D08d: clip34@591-598]: the target's own edge takes the accent within 2 frames (level 0.07, 0.73, 1.0 on
  // frames 596-598). The reference's stroke reads 3.5 px on a 120 px bar; this is the style's outline, 5 px [G13]
  arrive: { stroke: 5, dur: motion.toggle },
  // dotted [D04, D07, R19: clip37@172-229]: the path appears whole within 2 frames; a dot with an accent core of
  // 17 px in a 4 px cream ring runs it, a new one every 16.5 frames, visible from 11 to 79 % of the path (fading in
  // to 28 %, out from 57 %). The reference's dot takes 33 frames over its 442 px (13.3 px a frame), so the next one
  // starts before it has gone; that time is kept here, whatever the length
  loop: { core: 17, ring: 4, life: F(33.2), every: F(16.5), appear: motion.toggle, in: [0.11, 0.28], out: [0.57, 0.79] },
  // waves [D20, R19: clip30@960-1025, fitted here to 85 dots, rmse 0.9 px]: each wave is one cycle
  //   y = a sin(2 pi u) sin(pi u) + tilt (1 - 2u), u across its own window,
  // drawn as dots whose diameter is 7.2 px x sqrt(sin(pi v)), v across its `size` window, 1.5 diameters apart.
  // They are revealed left to right on the line's own 12 frames (tip at 0.13, 0.88, 0.98, 1 on clip30@939-944)
  wave: {
    span: 338,                  // x 362..700
    dot: 7.2, minDot: 1.2, pitch: 1.5, minPitch: 4.5,
    accent: { from: 13.8, to: 327.4, a: 43.1, tilt: 2.42, size: [0, 338] },    // below the axis first
    cream: { from: 29.5, to: 339.9, a: -45.1, tilt: -3.4, size: [30, 356] },   // the mirror image, 14 px later; its dots grow later too
  },
};

const lin = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const sineInOut = (x) => 0.5 - 0.5 * Math.cos(Math.PI * lin(x));
const hex = (c) => c.match(/[0-9a-f]{2}/gi).map((v) => parseInt(v, 16));
const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
const NS = 'http://www.w3.org/2000/svg';

/** "Tidy Folder" -> "TF", "notes" -> "N" */
function initials(name) {
  const words = String(name || '').trim().split(/[\s\-_/.]+/).filter(Boolean);
  return words.slice(0, 2).map((w) => [...w][0].toUpperCase()).join('');
}

/** The dots of one wave: [x, y, diameter] with x from 0 to the span and y about the axis. */
function waveDots(W, k) {
  const dots = [];
  const at = (x) => {
    const u = lin((x - k.from) / (k.to - k.from));
    return k.a * Math.sin(2 * Math.PI * u) * Math.sin(Math.PI * u) + k.tilt * (1 - 2 * u);
  };
  let x = 2.5;
  while (x <= W.span - 1) {
    const d = Math.max(W.minDot, W.dot * Math.sqrt(Math.sin(Math.PI * lin((x - k.size[0]) / (k.size[1] - k.size[0])))));
    dots.push([x, at(x), d]);
    const slope = (at(x + 0.5) - at(x - 0.5));
    x += Math.max(W.minPitch, W.pitch * d) / Math.hypot(1, slope);
  }
  return dots;
}

export default {
  type: 'link',
  label: 'Link',
  slots: ['graphic'],
  ownEntrance: true,
  params: {
    nodes: { type: 'array', min: 2, max: 2, of: {
      name: { type: 'string', maxChars: 12, maxWords: 2 },   // two names of up to 9 letters together sit beside their tiles, as in the reference; longer ones go under
      image: 'asset?',                                       // the thing's own mark, supplied per video; a square png reads best
      glyph: `enum?:${GLYPH_NAMES.join('|')}`,               // a line icon when there is no mark; without either the tile shows the name's initials
      at: 'word?',                                           // second node only: the word that names it. It arrives on it [X19]. Default: with the first
    } },
    line: 'enum?:solid|dotted|waves',                        // solid (default): connects to. dotted: in sync. waves: talks to
    check: 'boolean?',                                       // the check disc. Default: on for a solid line with no send beat
  },
  beats: {
    connect: {},                                             // on the verb: the line draws
    check: {},                                               // default: 7 frames after the second node
    send: { from: 'enum?:a|b' },                             // default: from the first node, then back, in turn
  },

  async prepare(params, S) {
    return { images: await Promise.all((params.nodes || []).map((n) => (n && n.image ? loadMedia(S, n.image) : null))) };
  },

  build(ctx) {
    const { S, params: p, tIn, beats, data } = ctx; const { h } = S.kit;
    const style = p.line || 'solid';
    const nodes = (p.nodes || []).slice(0, 2);
    const names = nodes.map((n) => String((n && n.name) || '').trim());
    const N = G.name;
    const font = fontFor(N.cap, N.weight);
    const tw = names.map((s) => measureText(s, font));
    const lineLen = style === 'waves' ? G.wave.span : G.line.len;

    // ---- the row: tile, name, line, tile, name [clip35@1079]. Names that would push it out of the column are set
    // smaller, down to 44 px; past that they go under their tiles
    const fixedW = 2 * G.side + 2 * N.gap + N.toLine + lineLen + G.line.toTile;
    const k = Math.min(1, (G.maxW - fixedW) / (tw[0] + tw[1]));
    const under = k * N.cap < N.besideMin;
    const cap = under ? N.cap : N.cap * k;
    if (!under) { tw[0] *= k; tw[1] *= k; }
    const totalW = under ? 2 * G.side + lineLen + 2 * G.line.toTile : fixedW + tw[0] + tw[1];
    const totalH = under ? G.side + G.under.gap + N.cap : G.side;
    const box = place(ctx, totalW, totalH);
    const x0 = CX - totalW / 2, yT = box.y, cy = yT + G.side / 2;
    const xA = x0;
    const lineX = under ? xA + G.side + G.line.toTile : xA + G.side + N.gap + tw[0] + N.toLine;
    const xB = lineX + lineLen + G.line.toTile;
    const r = X.line.stroke / 2;
    const x1 = lineX + r, x2 = lineX + lineLen - r, mid = lineX + lineLen / 2;

    const root = h('div.eb-link', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });

    // ---- nodes
    const pitch = xB - xA;
    const node = (i, x) => {
      const n = nodes[i] || {};
      const img = data.images[i] && data.images[i].kind === 'image' ? data.images[i] : null;
      const tile = tileNode(S, { side: G.side, fill: 'cream', image: img, glyph: img ? null : n.glyph, initials: initials(names[i]) });
      Object.assign(tile.style, { left: `${x.toFixed(2)}px`, top: `${yT.toFixed(2)}px` });
      const ring = h('div', { style: { position: 'absolute', left: `${x.toFixed(2)}px`, top: `${yT.toFixed(2)}px`, width: `${G.side}px`, height: `${G.side}px`, borderRadius: `${(G.side * X.tile.radius).toFixed(1)}px`,
        boxShadow: `inset 0 0 0 ${G.arrive.stroke}px ${colour.accent}`, display: 'none' } });
      let label;
      if (under) {
        const c = fitCap(names[i], N.cap, N.weight, pitch - G.under.pad, 0, G.minCap);
        label = textAt(S, { text: names[i], x: x + G.side / 2, y: yT + G.side + G.under.gap + N.cap, cap: c, weight: N.weight });
      } else label = textAt(S, { text: names[i], x: x + G.side + N.gap, y: cy + cap / 2 - N.rise, cap, weight: N.weight, align: 'left' });
      const el = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0', transformOrigin: `${(x + G.side / 2).toFixed(1)}px ${cy.toFixed(1)}px`, display: 'none' } }, tile, label, ring);
      root.append(el);
      return { el, ring };
    };
    const A = node(0, xA), B = node(1, xB);

    // ---- beats
    const first = (name) => { const b = beats.find((x_) => x_.do === name); return b ? b.t : undefined; };
    let sends = beats.filter((b) => b.do === 'send');
    if (style === 'waves' && sends.length) { S.warn('link: waves are a still picture [D20]; send beats are ignored on them. Use a solid line for a request and a reply.'); sends = []; }
    let dir = 'b';
    sends = sends.map((b) => { dir = b.from || (dir === 'a' ? 'b' : 'a'); return { t: b.t, from: dir, end: b.t + G.send.dur }; });
    const tB = nodes[1] && nodes[1].at !== undefined ? Math.max(tIn, S.wordTime(nodes[1].at)) : tIn + motion.stagger;
    // the line: on its beat; with no beat a first send from the first node draws it under the dot [D05, D06]
    let tConnect = first('connect');
    const drawnBySend = tConnect === undefined && style === 'solid' && sends.length && sends[0].from === 'a' ? sends[0] : null;
    if (tConnect === undefined && !drawnBySend) tConnect = sends.length ? Math.max(tIn, sends[0].t - X.line.draw) : tIn + X.event.afterAnchor;
    const tDrawn = drawnBySend ? drawnBySend.end : tConnect + (style === 'dotted' ? G.loop.appear : X.line.draw);
    const beatCheck = first('check');
    const hasCheck = p.check !== undefined ? p.check : beatCheck !== undefined || (style === 'solid' && !sends.length);
    const tCheck = beatCheck !== undefined ? beatCheck : Math.max(tB + G.checkAfter, tDrawn);

    // ---- the line
    const cream = hex(colour.cream), accent = hex(colour.accent);
    let line = null, stroke = null, wave = null;
    if (style === 'waves') {
      const W = G.wave, pad = 6, hh = 2 * (Math.abs(W.cream.a) + pad);
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('width', String(W.span + 2 * pad)); svg.setAttribute('height', String(hh));
      Object.assign(svg.style, { position: 'absolute', left: '0', top: '0', display: 'block' });
      for (const [k, c] of [[W.cream, colour.cream], [W.accent, colour.accent]]) {
        for (const [x, y, d] of waveDots(W, k)) {
          const dot = document.createElementNS(NS, 'circle');
          dot.setAttribute('cx', (x + pad).toFixed(2)); dot.setAttribute('cy', (y + hh / 2).toFixed(2)); dot.setAttribute('r', (d / 2).toFixed(2)); dot.setAttribute('fill', c);
          svg.append(dot);
        }
      }
      wave = h('div', { style: { position: 'absolute', left: `${(lineX - pad).toFixed(2)}px`, top: `${(cy - hh / 2).toFixed(2)}px`, width: '0', height: `${hh}px`, overflow: 'hidden', display: 'none' } }, svg);
      wave.full = W.span + 2 * pad; wave.pad = pad;
      root.append(wave);
    } else {
      line = linePath(S, `M${x1.toFixed(2)} ${cy.toFixed(2)}L${x2.toFixed(2)} ${cy.toFixed(2)}`, style === 'dotted' ? { style: 'dotted' } : { style: 'solid', color: colour.cream });
      stroke = line.el.lastChild;
      line.draw(0);
      root.append(line.el);
    }

    // ---- travellers
    const dot = sends.length ? travellerNode(S) : null;
    if (dot) root.append(dot);
    const L = G.loop;
    const loopers = style === 'dotted' ? [0, 1].map(() => {
      const el = travellerNode(S, { size: L.core });
      el.style.boxShadow = `0 0 0 ${L.ring}px ${colour.cream}`;
      root.append(el);
      return el;
    }) : [];

    // ---- the check disc, and the cut it makes in the line [R18]
    // (the badge sits in a holder: hiding a badge by its own display would undo its centring)
    let disc = null;
    if (hasCheck) {
      const d = G.disc + 2 * G.cut;
      const mark = badgeNode(S, 'check', G.disc);
      Object.assign(mark.style, { left: `${G.cut}px`, top: `${G.cut}px` });
      disc = h('div', { style: { position: 'absolute', left: `${(mid - d / 2).toFixed(2)}px`, top: `${(cy - d / 2).toFixed(2)}px`, width: `${d}px`, height: `${d}px`, borderRadius: '50%', background: colour.field, display: 'none' } }, mark);
      root.append(disc);
    }

    const enter = (nd, a, side) => {
      setStyle(nd.el, 'display', a < 0 ? 'none' : '');
      if (a < 0) return;
      const st = enterAt(S, a, G.enter);
      setStyle(nd.el, 'opacity', st.o >= 0.999 ? '' : st.o.toFixed(3));
      setStyle(nd.el, 'filter', st.blur > 0.05 ? `blur(${st.blur.toFixed(2)}px)` : '');
      setStyle(nd.el, 'transform', st.dy > 0.05 || st.s < 0.9998 ? `translateX(${(side * st.dy).toFixed(2)}px) scale(${st.s.toFixed(4)})` : '');
    };
    const show = (el, k) => { setStyle(el, 'display', k <= 0 ? 'none' : ''); if (k > 0) setStyle(el, 'opacity', k >= 1 ? '' : k.toFixed(3)); };

    return {
      el: root, box: { x: x0, y: yT, w: totalW, h: totalH },
      seek(t) {
        enter(A, t - tIn, -1);
        enter(B, t - tB, 1);

        // the line
        if (wave) {
          const q = drawProgress(t - tConnect);
          setStyle(wave, 'display', q <= 0 ? 'none' : '');
          setStyle(wave, 'width', `${(q >= 1 ? wave.full : wave.pad + G.wave.span * q).toFixed(1)}px`);
        } else if (style === 'dotted') {
          const k = lin((t - tConnect) / L.appear);
          line.draw(k > 0 ? 1 : 0);
          setStyle(line.el, 'opacity', k >= 1 ? '' : k.toFixed(3));
        } else {
          line.draw(drawnBySend ? sineInOut((t - drawnBySend.t) / G.send.dur) : drawProgress(t - tConnect));
          const k = hasCheck ? lin((t - tCheck - G.recolour.lag) / G.recolour.dur) : 0;
          const c = k <= 0 ? colour.cream : k >= 1 ? colour.accent : mix(cream, accent, k);
          if (stroke._c !== c) { stroke.setAttribute('stroke', c); stroke._c = c; }
        }

        // the check
        if (disc) {
          const a = t - tCheck - G.snap.lag;
          const u = lin(a / G.snap.dur);
          const tf = a < 0 || u >= 1 ? '' : `scale(${(G.snap.from + (1 - G.snap.from) * (1 - Math.pow(1 - u, 3))).toFixed(4)})`;
          setStyle(disc, 'display', a < 0 ? 'none' : '');
          setStyle(disc, 'transform', tf);
        }

        // a send: the dot rides the line and its arrival lights the target
        let litA = 0, litB = 0;
        if (dot) {
          let on = false;
          for (const s of sends) {
            const a = t - s.t;
            if (a >= 0 && a < G.send.dur + G.send.pop) {
              const q = sineInOut(a / G.send.dur);
              const [x, y] = line.point(s.from === 'a' ? q : 1 - q);
              setStyle(dot, 'transform', `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`);
              setStyle(dot, 'opacity', Math.min(lin(a / G.send.pop), 1 - lin((a - G.send.dur) / G.send.pop)).toFixed(3));
              on = true;
            }
            const k = lin((t - s.end) / G.arrive.dur);
            if (s.from === 'a') litB = Math.max(litB, k); else litA = Math.max(litA, k);
          }
          setStyle(dot, 'display', on ? '' : 'none');
        }
        show(A.ring, litA); show(B.ring, litB);

        // in sync: the dot that keeps travelling
        if (loopers.length) {
          const a = t - tDrawn;
          const k0 = Math.floor(a / L.every);
          loopers.forEach((el, i) => {
            const k = k0 - i;
            const f = k < 0 || a < 0 ? -1 : (a - k * L.every) / L.life;
            const o = f < 0 || f > 1 ? 0 : Math.min(lin((f - L.in[0]) / (L.in[1] - L.in[0])), 1 - lin((f - L.out[0]) / (L.out[1] - L.out[0])));
            setStyle(el, 'display', o <= 0 ? 'none' : '');
            if (o > 0) {
              const [x, y] = line.point(f);
              setStyle(el, 'transform', `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`);
              setStyle(el, 'opacity', o.toFixed(3));
            }
          });
        }
      },
    };
  },
};
