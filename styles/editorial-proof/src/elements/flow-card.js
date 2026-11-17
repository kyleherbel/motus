// A chain of steps joined by connectors that draw themselves on, for causes and effects ("you rank,
// which leads to more customers"), two routes to one result, or one thing feeding several (research/
// explain.md: X03 draw-on, X05 arrivals, X08 light, X13 packet flow; part A device 14 "tree draws on",
// part C DV27 "packet flow" and DV07 "fly to slot").
//
//   waiting     by default every step is on screen from the first frames, greyed to 42 % with a grey
//               disc and a faint connector, so the card is full and attention can visibly move (X08)
//   arrival     each step lights on its word: the connector into it draws on from 3 f before, the tile
//               pops (0.9 -> 1, rising 10 px, 5 f) and its disc turns from grey to the accent over 6 f
//   packet      once a connector is drawn, a small glowing dot runs along it, 10 f a trip, every 18 f,
//               for as long as the card is up: the chain visibly carries something
//   light       a step's plate tints and a traced outline closes round it; the last lit step releases
//   check       a check disc pops at the step's right
// layouts      chain   steps stacked top to bottom
//              merge   all but the last side by side, all feeding the last
//              split   the first feeding all the others side by side
import { cardFrame } from '../card.js';
import { fonts, type, F } from '../tokens.js';
import { X, arrive, applyArrive, lit, mix, roundRectPath, drawOnPath, drawn, packetAt, approach } from '../anim.js';
import { glyphSvg, GLYPHS, SOLID } from '../glyphs.js';

// ---- TOKENS (card px, 894 wide). Mock type is large for the card (research/explain.md "Materials").
const G = {
  pad: 40,
  title: { size: 25, weight: 600, tracking: 0.143, baseline: 62, colour: '#76767A', band: 96 },   // the rank list's tracked caps label
  tile: { w: 660, h: 136, radius: 30, edge: '#E4E4E8', shadow: '0 14px 28px -14px rgba(0,0,0,0.22)' },
  disc: { d: 84, x: 26, idle: '#EFEFF2', glyph: 44, idleInk: '#A2A2AA' },
  label: { size: 46, min: 30, weight: 700, tracking: -0.02 },
  sub: { size: 30, weight: 500, ink: '#7C7C84' },
  wide: { h: 214, disc: 78, label: 40, labelMin: 28, sub: 26 },   // side-by-side tiles stack their disc over the label
  gap: 76,                                     // connector length between tiers
  side: 26,                                    // gap between side-by-side tiles
  line: { w: 5, ink: '#CFCFD6' },
  check: { d: 54 },
};

export default {
  type: 'flow-card',
  label: 'Flow',
  slots: ['card'],
  params: {
    title: { type: 'string', optional: true, maxChars: 32, maxWords: 5 },
    layout: 'enum?:chain|merge|split',
    nodes: { type: 'array', min: 2, max: 5, of: {
      label: { type: 'string', maxChars: 22 },
      sub: { type: 'string', optional: true, maxChars: 30 },
      glyph: `enum?:${GLYPHS.join('|')}`,
      logo: 'asset?',                                      // a brand's mark (motus logo) instead of the glyph
      at: 'word?',                                         // lights on this word (otherwise 5 f after the one before)
    } },
    build: 'boolean?',                                     // steps appear one by one instead of waiting greyed from the start
  },
  beats: {
    light: { node: { type: 'number', min: 1, max: 5 } },
    check: { node: { type: 'number', min: 1, max: 5 } },
  },

  prefer(params) {
    const L = plan(params, 894);
    return { h: Math.round(L.h) };
  },

  build(ctx) {
    const { S, params, rect, mode, tIn, beats } = ctx; const { kit, C } = S; const { h } = kit;
    const W = rect.w;
    const card = cardFrame(S, { w: W, h: rect.h, mode, tIn });
    const body = card.body;
    const L = plan(params, W);
    const k = Math.min(1, card.bodyH / L.h);            // shrink everything when the slot is short
    const stage = h('div', { style: { position: 'absolute', left: `${(W - W * k) / 2}px`, top: `${(card.bodyH - L.h * k) / 2}px`, width: `${W}px`, height: `${L.h}px`, transformOrigin: '0 0', transform: k < 1 ? `scale(${k.toFixed(4)})` : 'none' } });
    body.append(stage);

    if (params.title) {
      const tr = G.title.tracking;
      const text = params.title.toUpperCase();
      const size = kit.fitSize(text, W - 80, (z) => `${G.title.weight} ${z}px ${fonts.sans}`, G.title.size, 16, tr);
      stage.append(h('div', { text, style: { position: 'absolute', left: '0', top: `${G.title.baseline - size * type.ascent.sans}px`, width: `${W}px`, textAlign: 'center', whiteSpace: 'nowrap', font: `${G.title.weight} ${size}px/1 ${fonts.sans}`, letterSpacing: `${tr}em`, textIndent: `${tr}em`, color: G.title.colour } }));
    }

    // ---- when each node lands
    let prev = tIn + F(6);
    const times = params.nodes.map((n, i) => {
      const own = typeof n.at === 'number' ? Math.max(tIn + F(2), S.wordTime(n.at)) : null;
      const t = own ?? (i === 0 ? prev : prev + X.stagger);
      prev = t;
      return t;
    });

    // ---- connectors (behind the tiles)
    const lines = [];
    const bases = [];
    const ghost = !params.build;
    const svgW = W, svgH = L.h;
    for (const e of L.edges) {
      const a = L.boxes[e.from], b = L.boxes[e.to];
      const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y;
      const my = (y1 + y2) / 2;
      const d = `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
      const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path'); tmp.setAttribute('d', d);
      const len = Math.hypot(x2 - x1, y2 - y1) * 1.12 + 2;
      const into = times[e.to], from = times[e.from];
      const t0 = Math.max(from + F(2), into - F(3));
      const stroke = drawOnPath(S, { d, len, w: svgW, h: svgH, t0, colour: ghost ? C.accent : G.line.ink, width: G.line.w });
      if (ghost) {
        const base = drawOnPath(S, { d, len, w: svgW, h: svgH, t0: tIn + F(4) + e.to * F(3), colour: '#E1E1E6', width: G.line.w });
        stage.append(base.el); bases.push(base);
      }
      const dot = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${X.packet.r * 2}px`, height: `${X.packet.r * 2}px`, borderRadius: '50%', background: C.accent, boxShadow: `0 0 12px 3px ${C.outlineGlow}`, display: 'none' } });
      stage.append(stroke.el, dot);
      lines.push({ stroke, dot, d, x1, y1, x2, y2, my, t0, start: t0 + F(6) + (lines.length % 2) * F(5) });
    }
    // a point on the cubic, for the packet
    const pointAt = (Ln, u) => {
      const { x1, y1, x2, y2, my } = Ln; const v = 1 - u;
      return { x: v * v * v * x1 + 3 * v * v * u * x1 + 3 * v * u * u * x2 + u * u * u * x2, y: v * v * v * y1 + 3 * v * v * u * my + 3 * v * u * u * my + u * u * u * y2 };
    };

    // ---- tiles
    const nodes = params.nodes.map((n, i) => {
      const box = L.boxes[i];
      const wide = box.wide;
      const tile = h('div.ep-flow-node', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px`, transformOrigin: '50% 50%' } });
      const plate = h('div', { style: { position: 'absolute', inset: '0', borderRadius: `${G.tile.radius}px`, background: '#FFFFFF', border: `2px solid ${G.tile.edge}`, boxSizing: 'border-box', boxShadow: G.tile.shadow } });
      const tint = h('div', { style: { position: 'absolute', inset: '0', borderRadius: `${G.tile.radius}px`, background: C.tint, opacity: '0' } });
      const { d, len } = roundRectPath(2, 2, box.w - 4, box.h - 4, G.tile.radius);
      const ring = drawOnPath(S, { d, len, w: box.w, h: box.h, t0: Infinity, colour: C.accent, width: 4 });
      const dd = wide ? G.wide.disc : G.disc.d;
      const glyph = n.glyph || 'spark';
      const disc = h('div', { html: n.logo ? `<img src="${S.env.projectUrl(n.logo)}" style="width:${Math.round(dd * 0.72)}px;height:${Math.round(dd * 0.72)}px;object-fit:contain;border-radius:22%;display:block">` : glyphSvg(glyph, Math.round(dd * 0.52), G.disc.idleInk, { solid: SOLID.has(glyph), weight: 2.2 }), style: { position: 'absolute', left: `${wide ? (box.w - dd) / 2 : G.disc.x}px`, top: `${wide ? 28 : (box.h - dd) / 2}px`, width: `${dd}px`, height: `${dd}px`, borderRadius: '50%', background: G.disc.idle, display: 'flex', alignItems: 'center', justifyContent: 'center' } });
      const lz0 = wide ? G.wide.label : G.label.size;
      const lMax = wide ? box.w - 36 : box.w - (G.disc.x + dd + 26) - (G.check.d + 30);
      const lFont = (z) => `${G.label.weight} ${z}px ${fonts.sans}`;
      const lz = kit.fitSize(n.label, lMax, lFont, lz0, wide ? G.wide.labelMin : G.label.min, G.label.tracking);
      const sz = wide ? G.wide.sub : G.sub.size;
      const hasSub = !!n.sub;
      let label, sub = null;
      if (wide) {
        const ly = 28 + dd + 22;
        label = h('div', { text: n.label, style: { position: 'absolute', left: '0', top: `${ly}px`, width: `${box.w}px`, textAlign: 'center', font: `${G.label.weight} ${lz}px/1.15 ${fonts.sans}`, letterSpacing: `${G.label.tracking}em`, color: C.ink, whiteSpace: 'nowrap' } });
        if (hasSub) sub = h('div', { text: n.sub, style: { position: 'absolute', left: '12px', top: `${ly + lz * 1.2 + 4}px`, width: `${box.w - 24}px`, textAlign: 'center', font: `${G.sub.weight} ${sz}px/1.2 ${fonts.sans}`, color: G.sub.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } });
      } else {
        const lx = G.disc.x + dd + 26;
        label = h('div', { text: n.label, style: { position: 'absolute', left: `${lx}px`, top: `${hasSub ? box.h / 2 - lz * 1.08 : box.h / 2 - lz * 0.6}px`, font: `${G.label.weight} ${lz}px/1.2 ${fonts.sans}`, letterSpacing: `${G.label.tracking}em`, color: C.ink, whiteSpace: 'nowrap' } });
        if (hasSub) sub = h('div', { text: n.sub, style: { position: 'absolute', left: `${lx}px`, top: `${box.h / 2 + 6}px`, maxWidth: `${lMax}px`, font: `${G.sub.weight} ${sz}px/1.2 ${fonts.sans}`, color: G.sub.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } });
      }
      const check = h('div', { html: glyphSvg('check', 32, '#FFFFFF', { weight: 3.2 }), style: { position: 'absolute', left: `${wide ? box.w - G.check.d - 16 : box.w - G.check.d - 26}px`, top: `${wide ? 16 : (box.h - G.check.d) / 2}px`, width: `${G.check.d}px`, height: `${G.check.d}px`, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: '0', transformOrigin: '50% 50%' } });
      tile.append(plate, tint, ring.el, disc, label, ...(sub ? [sub] : []), check);
      stage.append(tile);
      S.sfx(times[i], 'chip');
      return { i, tile, tint, ring, disc, check, glyph, logo: !!n.logo, t: times[i], litAt: null, offAt: Infinity, checkAt: Infinity };
    });

    // ---- beats
    let last = null;
    for (const b of [...beats].sort((a, c) => a.t - c.t)) {
      const n = nodes[b.node - 1];
      if (!n) { S.warn(`flow-card: node ${b.node} does not exist`); continue; }
      const t = Math.max(b.t, n.t + F(3));
      if (b.do === 'light') {
        if (last && last !== n) last.offAt = t;
        n.litAt = t; last = n;
        const box = L.boxes[n.i];
        const { d, len } = roundRectPath(2, 2, box.w - 4, box.h - 4, G.tile.radius);
        const fresh = drawOnPath(S, { d, len, w: box.w, h: box.h, t0: t, colour: C.accent, width: 4 });
        n.ring.el.replaceWith(fresh.el); n.ring = fresh;
        S.sfx(t, 'highlight');
      }
      if (b.do === 'check') { n.checkAt = t; S.sfx(t, 'check'); }
    }

    return {
      el: card.el,
      seek(t) {
        card.seek(t);
        for (const B of bases) B.seek(t);
        for (const Ln of lines) {
          Ln.stroke.seek(t);
          const u = drawn(t, Ln.t0) >= 0.98 ? packetAt(t, Ln.start) : null;
          if (u === null) { Ln.dot.style.display = 'none'; continue; }
          const p = pointAt(Ln, u);
          Ln.dot.style.display = '';
          Ln.dot.style.transform = `translate(${(p.x - X.packet.r).toFixed(1)}px, ${(p.y - X.packet.r).toFixed(1)}px)`;
          Ln.dot.style.opacity = String(Math.min(1, 4 * Math.min(u, 1 - u) + 0.15));
        }
        for (const n of nodes) {
          const shown = ghost ? tIn + F(3) + n.i * F(3) : n.t;
          n.tile.style.display = t >= shown ? '' : 'none';
          if (t < shown) continue;
          if (ghost) {
            // waiting greyed, then lit on its word with a small pop
            const w = arrive(t, shown, 'rise');
            const up = approach(t, n.t, X.light.in / 3, X.light.in);
            const pop = t >= n.t ? arrive(t, n.t, 'pop') : null;
            const o = w.o * (X.light.idle + (1 - X.light.idle) * up);
            const sc = pop ? 0.96 + 0.04 * (pop.s - 0.9) / 0.1 : 1;
            n.tile.style.opacity = o >= 0.999 ? '' : o.toFixed(3);
            n.tile.style.transform = `translateY(${(w.y + (pop ? pop.y * 0.4 : 0)).toFixed(2)}px)${sc !== 1 ? ` scale(${sc.toFixed(4)})` : ''}`;
          } else applyArrive(n.tile, arrive(t, n.t, 'pop'));
          const on = approach(t, n.t + F(2), X.light.in / 3, X.light.in);
          n.disc.style.background = n.logo ? '#FFFFFF' : mix(G.disc.idle, C.accent, on);
          if (n.logo) { n.disc.style.filter = on < 0.99 ? `grayscale(${(1 - on).toFixed(3)})` : 'none'; n.disc.style.boxShadow = '0 0 0 2px #E6E6EA'; }
          const svg = n.disc.querySelector('svg');
          if (svg) { const ink = on > 0.5 ? '#FFFFFF' : G.disc.idleInk; svg.setAttribute('stroke', ink); if (SOLID.has(n.glyph)) svg.setAttribute('fill', ink); }
          const glow = n.litAt === null ? 0 : lit(t, n.litAt, n.offAt);
          n.tint.style.opacity = glow.toFixed(3);
          n.ring.seek(t);
          n.ring.el.style.opacity = n.litAt === null ? '0' : String(1 - (Number.isFinite(n.offAt) ? approach(t, n.offAt - X.light.lead, X.light.out / 3, X.light.out) : 0));
          applyArrive(n.check, Number.isFinite(n.checkAt) ? arrive(t, n.checkAt, 'pop') : { o: 0, x: 0, y: 0, r: 0, s: 1 });
        }
      },
    };
  },
};

/** Tile boxes and connector edges for a layout, in card px. */
function plan(params, W) {
  const n = params.nodes.length;
  const layout = params.layout || 'chain';
  const top = params.title ? G.title.band : G.pad;
  const boxes = [], edges = [];
  const full = (y) => ({ x: (W - G.tile.w) / 2, y, w: G.tile.w, h: G.tile.h, wide: false });
  const row = (count, y) => {
    const w = (W - 2 * G.pad - (count - 1) * G.side) / count;
    return Array.from({ length: count }, (_, j) => ({ x: G.pad + j * (w + G.side), y, w, h: G.wide.h, wide: true }));
  };
  let y = top;
  if (layout === 'merge' && n >= 3) {
    const up = row(n - 1, y); boxes.push(...up); y += G.wide.h + G.gap;
    boxes.push(full(y)); y += G.tile.h;
    for (let j = 0; j < n - 1; j++) edges.push({ from: j, to: n - 1 });
  } else if (layout === 'split' && n >= 3) {
    boxes.push(full(y)); y += G.tile.h + G.gap;
    boxes.push(...row(n - 1, y)); y += G.wide.h;
    for (let j = 1; j < n; j++) edges.push({ from: 0, to: j });
  } else {
    for (let j = 0; j < n; j++) { boxes.push(full(y)); y += G.tile.h + (j < n - 1 ? G.gap : 0); if (j) edges.push({ from: j - 1, to: j }); }
  }
  return { boxes, edges, h: y + G.pad };
}
