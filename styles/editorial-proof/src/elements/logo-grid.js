// Names arriving one by one into a grid of tiles ("Unreal Engine, Unity, Godot, and even web").
// Measured frame by frame on clip36@285-365 (dark focus, 2x2):
//   card       the style's card, filled light grey (#E8EBEE), 28 px padding, 18 px gutters,
//              cells 410x474 (x 121-531 / 549-958, y 283-757 / 775-1249)
//   cut        every place is already there: an empty place is a dashed grey outline on the grey
//              card; the first name is already in (the cut lands 4.6 f into its arrival)
//   arrival    the place turns white in 2.5 f; the logo fades with it while it settles from
//              +31 px and 108.5 % (exponential, 3 f); 1 f later an accent outline draws itself
//              clockwise from the top-left corner (exponential, 2 f); the previous newest tile's
//              outline drops to 62 % as the next one starts
//   logos      centred, contained in 336x294
// Without a logo the tile shows an original monogram lockup: a tinted rounded square with the
// initial, the name under it. `build: "grow"` leaves out the empty places and re-flows the grid
// instead (earlier tiles move and resize on the emphasised curve, 24 f, as each name arrives).
import { cardFrame } from '../card.js';
import { fonts, type, F } from '../tokens.js';

// ---- TOKENS WANTED in tokens.js (layout.grid / motion.grid / colour): measured on clip36
const G = {
  pad: 28, gap: 18, cell: { w: 410, h: 474 },
  fill: '#E8EBEE',                      // the card (f340, clear of shadows)
  place: { fill: '#E9ECEE', dash: [5, 3.5], stroke: 2, colour: '#C2C5C9', inset: 1.5 },   // dashed empty place
  face: '#FDFDFD', radius: 15,
  outline: { w: 4, relaxed: 0.62 },     // core: the accent, ~4 px (x 548-552) with a soft halo; older tiles at 62 %
  shadow: '0 3px 24px rgba(46,46,46,0.25)',    // fitted to the darkening under and beside the tiles; colour neutralised (colour CR08)
  logo: { w: 336, h: 294 },             // the largest logo box seen (Unity 336 wide, Unreal 294 tall)
  mono: { tile: 150, radius: 34, letter: 84, name: 52, nameMin: 30, gap: 26 },
  growMax: 1.6,                         // how far a tile's content may enlarge while the grid has room
};
const M = {
  fade: F(2.5), fadeLead: F(0.5),
  settle: { tau: F(3), dy: 31, scale: 0.085 },
  outline: { delay: F(1), tau: F(2), cap: F(9) },
  relax: F(1),
  firstLead: F(4.6),                    // the first tile is 4.6 f into its arrival at the cut
  stagger: F(18),                       // default spacing when no word is given
  reflow: F(24),                        // grow mode: the reorder token (emphasised curve)
  reflowLead: F(8),                     // grow mode: the others start making room 8 f before the newcomer shows (75 % there)
};
const ASC = type.ascent.sans;           // baseline of Motus Inter in a line-height-1 box

/** Places for k tiles in a w x h area: rows of two, an odd last tile centred. */
function arrange(k, w, h) {
  const cols = k === 1 ? 1 : 2, rows = Math.ceil(k / cols);
  const cw = cols === 1 ? w : (w - G.gap) / 2, ch = (h - (rows - 1) * G.gap) / rows;
  const out = [];
  for (let i = 0; i < k; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const lastOdd = cols === 2 && k % 2 === 1 && i === k - 1;
    out.push({ x: lastOdd ? (w - cw) / 2 : c * (cw + G.gap), y: r * (ch + G.gap), w: cw, h: ch });
  }
  return out;
}

export default {
  type: 'logo-grid',
  label: 'Logo grid',
  slots: ['card'],
  params: {
    items: { type: 'array', min: 2, max: 6, of: {
      name: { type: 'string', maxChars: 18 },   // "Godot": drawn under a monogram when there is no logo
      logo: 'asset?',                           // a full logo lockup (symbol + wordmark), shown alone, contained in the tile
      at: 'word?',                              // the word on which this tile arrives (default: one after another)
    } },
    build: 'enum?:slots|grow',                  // slots (default, as measured): empty places shown from the start; grow: the grid re-flows
  },
  beats: {},

  async prepare(params, S) {
    const load = async (src) => { if (!src) return null; const img = new Image(); img.src = S.env.projectUrl(src); await img.decode().catch(() => { throw new Error(`Could not load ${src}`); }); return { src: img.src, w: img.naturalWidth || 1, h: img.naturalHeight || 1 }; };
    return { imgs: await Promise.all(params.items.map((it) => load(it.logo))) };
  },

  prefer(params) {
    const n = params.items.length, rows = Math.ceil(n / (n === 1 ? 1 : 2));
    return { h: Math.round(2 * G.pad + rows * G.cell.h + (rows - 1) * G.gap) };
  },

  build(ctx) {
    const { S, params, rect, mode, tIn, data } = ctx; const { kit, C } = S; const { h } = kit;
    const card = cardFrame(S, { w: rect.w, h: rect.h, mode, tIn, fill: G.fill });
    const body = card.body;
    const n = params.items.length;
    const grow = params.build === 'grow';
    const aw = rect.w - 2 * G.pad, ah = card.bodyH - 2 * G.pad;
    const layouts = Array.from({ length: n + 1 }, (_, k) => (k ? arrange(k, aw, ah) : []));
    const finalPlaces = layouts[n];

    // ---- when each tile arrives
    const times = [];
    params.items.forEach((it, i) => {
      let t0 = it.at !== undefined ? S.wordTime(it.at) : i === 0 ? tIn - M.firstLead : times[i - 1] + M.stagger;
      if (i === 0 && it.at !== undefined && t0 <= tIn + F(2)) t0 = tIn - M.firstLead;
      if (i > 0 && t0 < times[i - 1] + F(4)) { S.warn(`logo-grid: "${it.name}" arrives less than 4 frames after the tile before it; it is held back`); t0 = times[i - 1] + F(4); }
      times.push(t0);
    });

    // ---- one tile per item
    const ns = 'http://www.w3.org/2000/svg';
    const rr = (w, hh, r, ins) => { const x = ins, y = ins, W = w - 2 * ins, H = hh - 2 * ins, q = Math.max(0, r - ins);
      return `M${x + q} ${y}H${x + W - q}A${q} ${q} 0 0 1 ${x + W} ${y + q}V${y + H - q}A${q} ${q} 0 0 1 ${x + W - q} ${y + H}H${x + q}A${q} ${q} 0 0 1 ${x} ${y + H - q}V${y + q}A${q} ${q} 0 0 1 ${x + q} ${y}Z`; };
    const perim = (w, hh, r, ins) => { const W = w - 2 * ins, H = hh - 2 * ins, q = Math.max(0, r - ins); return 2 * (W + H) - 8 * q + 2 * Math.PI * q; };

    const tiles = params.items.map((it, i) => {
      const wrap = h('div.ep-grid-cell', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0' } });
      // the empty place: dashed outline on the card's grey
      const place = document.createElementNS(ns, 'svg');
      Object.assign(place.style, { position: 'absolute', left: '0', top: '0', overflow: 'visible' });
      place.innerHTML = `<path fill="${G.place.fill}" stroke="${G.place.colour}" stroke-width="${G.place.stroke}" stroke-dasharray="${G.place.dash.join(' ')}"/>`;
      const face = h('div', { style: { position: 'absolute', left: '0', top: '0', borderRadius: `${G.radius}px`, background: G.face, boxShadow: G.shadow, opacity: '0' } });
      // the logo, or an original monogram lockup
      const img = data?.imgs?.[i] || null;
      let logo;
      if (img) {
        const s = Math.min(G.logo.w / img.w, G.logo.h / img.h);
        logo = h('img', { src: img.src, style: { position: 'absolute', left: `${-img.w * s / 2}px`, top: `${-img.h * s / 2}px`, width: `${img.w * s}px`, height: `${img.h * s}px`, objectFit: 'contain' } });
      } else {
        const m = G.mono;
        const font = (z) => `700 ${z}px ${fonts.sans}`;
        const nz = kit.fitSize(it.name, G.logo.w, font, m.name, m.nameMin, -0.02);
        const total = m.tile + m.gap + nz * 0.7275;
        const initial = (it.name.trim()[0] || '?').toUpperCase();
        logo = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0' } },
          h('div', { style: { position: 'absolute', left: `${-m.tile / 2}px`, top: `${-total / 2}px`, width: `${m.tile}px`, height: `${m.tile}px`, borderRadius: `${m.radius}px`, background: S.tint(it.name) } },
            h('div', { text: initial, style: { position: 'absolute', left: '0', top: `${m.tile / 2 + m.letter * 0.7275 / 2 - m.letter * ASC}px`, width: `${m.tile}px`, textAlign: 'center', font: `700 ${m.letter}px/1 ${fonts.sans}`, color: '#FFFFFF' } })),
          h('div', { text: it.name, style: { position: 'absolute', left: `${-G.logo.w / 2 - 20}px`, top: `${total / 2 - nz * ASC}px`, width: `${G.logo.w + 40}px`, textAlign: 'center', whiteSpace: 'nowrap', font: `700 ${nz}px/1 ${fonts.sans}`, letterSpacing: '-0.02em', color: C.ink } }));
      }
      const holder = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0', opacity: '0' } }, logo);
      // the accent outline that draws itself, with its soft halo
      const ring = document.createElementNS(ns, 'svg');
      Object.assign(ring.style, { position: 'absolute', left: '0', top: '0', overflow: 'visible', pointerEvents: 'none' });
      ring.innerHTML = `<g style="filter: blur(2.6px)" opacity="0.5"><path fill="none" stroke="${C.accent}" stroke-width="${G.outline.w + 3}"/></g><path fill="none" stroke="${C.accent}" stroke-width="${G.outline.w}"/>`;
      wrap.append(place, face, holder, ring);
      body.append(wrap);
      return { i, wrap, place, placePath: place.querySelector('path'), face, holder, ring, ringPaths: [...ring.querySelectorAll('path')], t0: times[i], size: '' };
    });
    const root = h('div', { style: { position: 'absolute', left: `${G.pad}px`, top: `${G.pad}px`, width: `${aw}px`, height: `${ah}px` } }, ...tiles.map((x) => x.wrap));
    body.append(root);

    /** Where tile i is at time t. */
    const placeAt = (i, t) => {
      if (!grow) return finalPlaces[i];
      // how many tiles have arrived, and how far the latest re-flow has gone
      let k = 0; for (let j = 0; j < n; j++) if (t >= times[j] - M.fadeLead - M.reflowLead) k = j + 1;
      k = Math.max(k, i + 1);
      const to = layouts[k][i];
      if (k <= 1 || i === k - 1) return to;
      const p = S.E.emph(kit.clamp((t - (times[k - 1] - M.fadeLead - M.reflowLead)) / M.reflow));
      const from = layouts[k - 1][i];
      return { x: from.x + (to.x - from.x) * p, y: from.y + (to.y - from.y) * p, w: from.w + (to.w - from.w) * p, h: from.h + (to.h - from.h) * p };
    };

    return {
      el: card.el, tone: 'light',
      seek(t) {
        card.seek(t);
        for (const T of tiles) {
          const visible = !grow || t >= T.t0 - M.fadeLead;
          T.wrap.style.display = visible ? '' : 'none';
          if (!visible) continue;
          const P = placeAt(T.i, t);
          const key = `${P.w.toFixed(2)}x${P.h.toFixed(2)}`;
          T.wrap.style.transform = `translate(${P.x.toFixed(2)}px, ${P.y.toFixed(2)}px)`;
          if (T.size !== key) {
            T.size = key;
            for (const svg of [T.place, T.ring]) { svg.setAttribute('width', P.w); svg.setAttribute('height', P.h); svg.setAttribute('viewBox', `0 0 ${P.w} ${P.h}`); }
            T.placePath.setAttribute('d', rr(P.w, P.h, G.radius, G.place.inset));
            const d = rr(P.w, P.h, G.radius, G.outline.w / 2);
            T.per = perim(P.w, P.h, G.radius, G.outline.w / 2);
            for (const p of T.ringPaths) { p.setAttribute('d', d); p.setAttribute('stroke-dasharray', `${T.per} ${T.per}`); }
            Object.assign(T.face.style, { width: `${P.w}px`, height: `${P.h}px` });
            T.holder.style.left = `${P.w / 2}px`; T.holder.style.top = `${P.h / 2}px`;
          }
          // arrival: white face and logo fade together, the logo settles, the outline draws
          const a = kit.clamp((t - (T.t0 - M.fadeLead)) / M.fade);
          T.face.style.opacity = String(a);
          T.place.style.display = a >= 1 || grow ? 'none' : '';
          T.holder.style.opacity = String(a);
          const age = Math.max(0, t - T.t0);
          const e = Math.exp(-age / M.settle.tau);
          const k = Math.min(grow ? G.growMax : 1, P.w / G.cell.w, P.h / G.cell.h);
          const dy = M.settle.dy * e;
          T.holder.style.transform = `translateY(${dy < 0.05 ? 0 : dy.toFixed(2)}px) scale(${(k * (1 + M.settle.scale * e)).toFixed(5)})`;
          const oa = t - T.t0 - M.outline.delay;
          const op = oa <= 0 ? 0 : Math.min(1, (1 - Math.exp(-oa / M.outline.tau)) / (1 - Math.exp(-M.outline.cap / M.outline.tau)));
          T.ring.style.display = op > 0 ? '' : 'none';
          for (const p of T.ringPaths) p.setAttribute('stroke-dashoffset', (T.per * (1 - op)).toFixed(2));
          // the newest tile keeps the full outline; older ones drop to 62 % as the next arrives
          const next = times[T.i + 1];
          const relax = next === undefined ? 0 : kit.clamp((t - (next - M.fadeLead - M.relax)) / M.relax);
          T.ring.style.opacity = String(1 - (1 - G.outline.relaxed) * relax);
        }
      },
    };
  },
};
