// A code-drawn prop that acts the sentence out (research/explain.md X01-X05, X13-X25; colour.md C19-C25).
// Half of the reference's picture time is one object with events on it: a sheet slides out of a printer, a lid
// lifts, reels spin, a tank drains, a badge lands [X01, X02]. Prop Room draws the object itself as an SVG with
// named parts (ids), so beats can move them. The SVG is either one of the pack's props (`name`, from
// styles/prop-room/props/) or one the planning agent writes for the video into the project (`src`), following
// the drawing standard in styles/prop-room/props/STANDARD.md.
//
// Anatomy [X03-X05]: the prop is on screen on the cut (the scene entrance scales it in), events follow about
// 12 frames apart while the clause is spoken, and it keeps acting until the cut. Parts that a `show` beat
// reveals start hidden; parts a `draw` beat draws start undrawn. Nothing overshoots or bounces [X29].
// Look [X24, X25, C19, C22, C23]: one hero prop centred on x 540, 0.68 of the frame wide, its centre near y 600
// in the panel and y 750 full frame; a hard anti-aliased edge; a soft warm shadow below, none above; lit from
// the top (drawn into the SVG).
//
// What the SVG may declare (STANDARD.md):
//   root  data-shadow="rest|float|none"   rest: an object on the plate [X25]; float: a device hovering [C19]
//         data-ring="#hex"                  pulse ring colour for every part
//   part  data-pivot="x y"                  rotate/scale origin, viewBox units (default: the part's centre)
//         data-fill="slide"                 a fill moves the part inside its parent's clip instead of scaling it
//         data-level="0..1"                 the level shown before any fill beat; data-axis="x" fills left to right
//         data-drawn="0..1"                 the share of its strokes drawn before any draw beat
//         data-base                         on a shape inside a part: the fill a `recolor` beat changes
//         data-ring="#hex"                  pulse ring colour for this part
import { F, colour, motion, layout, fonts } from '../tokens.js';
import { place, clamp01, measureText } from '../common.js';
import { plateIsDark } from '../plate.js';

// TOKENS (research/explain.md X11, X17-X20, X24, X25, X03 event durations; colour.md C19, C22; motion.md M15, M21)
const SIZE = { s: 0.44, m: 0.68, l: 0.85 };   // hero width share of 1080: median 0.68, range 0.44-0.85 [X24]
const HCAP = { split: 637, full: 880 };        // a tall hero's height: median of the tall B-unit heroes (X_prop_look.csv) [X24]; scaled with the size share
const CY = { split: 600, full: 750 };          // hero centre y: panel median 600, full frame 750 [X24]
// shadows as SVG filters, in screen px (converted to prop units at build) [C19, C22, X25]
const SHADOW = {
  // an object resting on the plate: 0.8 of the plate at the contact, half recovered by 20-30 px, gone by 60-100 px
  // [X25], warm [C22]. One Gaussian, dy 22, sigma 22, #5E3430 at 0.33: renders 0.83 at 2 px, 0.92 at 26 px, 0.99 at
  // 62 px; a joint fit to clip05@700 (printer) and clip13@20 (tank) gives the same curve within 6 levels
  rest: { erode: 0, dy: 22, sigma: 22, color: '#5E3430', alpha: 0.33 },
  // a floating device: box-shadow 0 68px 102px -36px rgba(94,52,48,0.53) (spread -36 = erode 36) [C19]
  // 0.53 of the plate's luma at full weight = #5E3430 at 0.71 on a plate of luma 240; checked against clip03@330:
  // contact 0.62, 0.73 at 30 px, 0.85 at 60 px, 0.94 at 100 px below the fare device
  float: { erode: 36, dy: 68, sigma: 51, color: '#5E3430', alpha: 0.71 },
};
// on a saturated field the shadow drops to 0.15-0.2 opacity: 0.18 / 0.53 of the floating value [colour.md prop_look,
// apply_to_user_picture 6]
const FIELD_SHADOW = 0.34;
// a lid lifting off (clip01@136-148, measured): rises by about its own height and shrinks to 0.45 on an ease-in
// (displacement grows with the square of time, rms 1 px), fading out over its last 5 frames; 12 frames in all
const AWAY = { dur: F(12), rise: 1.0, shrink: 0.55, fadeAt: F(7) };
const DUR = {
  show: motion.prop.dur,            // 12 frames on the entrance curve [M10-M14]
  hide: F(6),                       // a plain fade-out (by eye; the measured lift-off is AWAY)
  move: F(14),                      // move event 14 frames [X03 event durations]
  slow: F(32),                      // lower into a slot / roll along a track: 300 px in 32 frames [X20]
  fill: motion.count.dur,           // fills 27 frames ease-in-out [X08, X10]
  draw: F(13),                      // path draw 13 frames, ease-out tip [X19, X03]
  sweep: F(27),                     // clock wedge or track sweep, steady ~27 frames [X11]
  recolor: F(4),                    // recolour 4 frames [X03, X10 "within 1-4 frames"]
  badge: motion.badge.dur,          // 6 frames from 1.25 [X18]
};
const CURVE = { slow: [0.53, 0.13, 0.31, 1], draw: [0.215, 0.61, 0.355, 1], sweep: [0.42, 0, 0.58, 1] };   // [X20, X19, X11]
const SPIN_UP = F(6);               // reels spin up over 6 frames [M21]
// a pulse ring: from the part's edge out to 1.40x on an exponential ease-out (time constant 5.8 frames), 6 px
// thinning to 3 px, fading out over 11 frames, in the part's own hue (clip05@608-617 measured) [X17]
const RING = { grow: 0.40, tau: F(5.8), dur: F(11), w0: 6, w1: 3 };
// badges: red cross #EF3A4C, 72 px on an item's top-right corner or 220 px over the prop, white glyph strokes
// 0.1 of the diameter, a glow of its own hue below (clip02@505, clip14@640 measured); land from 1.25 [X18]
const BADGE = {
  red: '#EF3A4C', green: '#13904C',            // red measured; green = the reference accent green [colour.md materials]
  d: { s: 72, l: 220 }, stroke: 0.1, arm: 0.17,
  text: { s: 40, l: 72 },                      // label badge type size (by eye)
};

const NS = 'http://www.w3.org/2000/svg';
const GEOM = 'path, line, polyline, polygon, circle, ellipse, rect';

/** Parse an SVG string, dropping anything that could run code, load from outside or style the page. */
function cleanSvg(text) {
  const doc = new DOMParser().parseFromString(String(text), 'image/svg+xml');
  const svg = doc.documentElement;
  if (!svg || svg.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror')) return null;
  svg.querySelectorAll('script, style, foreignObject, iframe, object, embed, image, a, animate, animateTransform, animateMotion, set').forEach((n) => n.remove());
  for (const n of [svg, ...svg.querySelectorAll('*')]) {
    for (const a of [...n.attributes]) {
      const v = a.value.trim().toLowerCase();
      if (a.name.startsWith('on') || ((a.name === 'href' || a.name === 'xlink:href') && !v.startsWith('#'))) n.removeAttribute(a.name);
    }
  }
  return svg;
}

/** Give every id in the SVG a per-instance prefix and rewrite the references, so two props on one page never
 * share a gradient or clip. Returns a map from the original id to its element. */
function scopeIds(svg, prefix) {
  const parts = new Map(), ren = new Map();
  for (const n of svg.querySelectorAll('[id]')) { parts.set(n.id, n); ren.set(n.id, prefix + n.id); n.id = prefix + n.id; }
  const fix = (v) => v.replace(/url\(\s*['"]?#([^'")\s]+)['"]?\s*\)/g, (m, id) => (ren.has(id) ? `url(#${ren.get(id)})` : m));
  for (const n of [svg, ...svg.querySelectorAll('*')]) {
    for (const a of [...n.attributes]) {
      if ((a.name === 'href' || a.name === 'xlink:href') && a.value.startsWith('#') && ren.has(a.value.slice(1))) n.setAttribute(a.name, '#' + ren.get(a.value.slice(1)));
      else if (a.value.includes('url(')) n.setAttribute(a.name, fix(a.value));
    }
  }
  return parts;
}

const hex6 = (c) => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : /^#[0-9a-f]{3}$/i.test(c || '') ? '#' + [...c.slice(1)].map((x) => x + x).join('') : null);
const rgbOf = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, p) => { const A = rgbOf(a), B = rgbOf(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(',')})`; };

export default {
  type: 'prop',
  label: 'Prop',
  slots: ['graphic'],
  params: {
    name: { type: 'string', optional: true, maxChars: 24 },     // a prop from the pack (props/<name>.svg)
    src: 'asset?',                                               // or an SVG the plan drew for this video
    size: 'enum?:s|m|l',
    flat: 'boolean?',                                            // flat icons and illustrations cast no shadow [C21]
  },
  beats: {
    show: { part: 'string', how: 'enum?:pop|slide|grow|land|fade', from: 'enum?:up|down|left|right', dist: 'number?' },   // a hidden part enters [M10-M14]
    hide: { part: 'string', how: 'enum?:fade|pop|away' },                                 // a part leaves (rare, and then it is the point) [X22]
    move: { part: 'string', dx: 'number?', dy: 'number?', scale: 'number?', sx: 'number?', sy: 'number?', rotate: 'number?', ease: 'enum?:out|inOut|slow' },   // a part travels (viewBox units); slow = into a slot or along a track [X20, X21]
    fill: { part: 'string', to: { type: 'number', min: 0, max: 1 }, from: { type: 'number', min: 0, max: 1, optional: true }, axis: 'enum?:x|y' },   // a level rises or drains [X10]
    draw: { part: 'string', to: { type: 'number', min: 0, max: 1, optional: true }, ease: 'enum?:out|sweep' },   // a stroke draws on: a route, a wedge [X11, X19]
    spin: { part: 'string', stop: 'boolean?', rate: { type: 'number', min: -4, max: 4, optional: true } },   // reels, wheels and hands [M21]
    swap: { part: 'string', to: 'string' },                                               // one state cuts to another [X69]
    recolor: { part: 'string', color: { type: 'string', maxChars: 7 } },                  // e.g. a bar turns red at its limit [X10]
    pulse: { part: 'string' },                                                            // a ring pulses out from a part [X17, X72]
    badge: { kind: 'enum:check|cross|text', text: { type: 'string', optional: true, maxChars: 10 }, big: 'boolean?', x: 'number?', y: 'number?', part: 'string?' },   // lands from 1.25 [X18]
  },
  async prepare(params, S) {
    const url = params.src ? S.env.projectUrl(params.src) : params.name ? S.env.styleUrl(`props/${params.name}.svg`) : null;
    if (!url) { S.warn('prop: give a `name` from the pack or a `src` SVG'); return { svg: null }; }
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const svg = cleanSvg(await res.text());
      if (!svg) throw new Error('not an SVG');
      return { svg };
    } catch (e) { S.warn(`prop: could not load ${params.src || params.name}: ${e.message}`); return { svg: null }; }
  },
  build(ctx) {
    const { S, params, beats, data, mode } = ctx;
    const { h } = S.kit;
    const label = params.name || params.src;
    const el = h('div.pr-prop', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } });
    const svg = data?.svg;
    if (!svg) return { el, seek() {} };
    const vb = (svg.getAttribute('viewBox') || '0 0 1000 1000').split(/[\s,]+/).map(Number);
    const vw = vb[2] || 1000, vh = vb[3] || 1000;
    if (vb[0] || vb[1]) S.warn(`prop ${label}: the viewBox should start at 0 0 (pivots are measured from there)`);

    // ---- size and place [X24]
    const key = mode === 'full' ? 'full' : 'split';
    const share = SIZE[params.size] || SIZE.m;
    let w0 = 1080 * share, h0 = (w0 * vh) / vw;
    const st = layout.stage[key];
    const cap = Math.min(HCAP[key] * (share / SIZE.m), st.bottom - st.top);
    if (h0 > cap) { w0 *= cap / h0; h0 = cap; }
    const fit = place(ctx, w0, h0);
    const box = { ...fit, y: Math.max(st.top, Math.min(st.bottom - fit.h, CY[key] - fit.h / 2)) };
    const k = box.w / vw;   // screen px per prop unit
    Object.assign(svg.style, { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px`, overflow: 'visible' });
    svg.setAttribute('width', box.w); svg.setAttribute('height', box.h);
    svg.removeAttribute('x'); svg.removeAttribute('y');
    el.append(svg);

    // ---- ids per instance, then everything drawn goes into one group that casts the shadow
    const parts = scopeIds(svg, `pr${S.uid()}_`);
    const part = (id) => (id ? parts.get(id) || null : null);
    const body = document.createElementNS(NS, 'g');
    for (const n of [...svg.childNodes]) if (!(n.nodeName === 'defs')) body.append(n);
    svg.append(body);
    // on a dark plate the warm shadow colour would be lighter than the plate: it goes black there
    const plateDark = plateIsDark(params.plate, params.field);
    const kind = params.flat ? 'none' : svg.getAttribute('data-shadow') || 'rest';
    const sh = SHADOW[kind];
    if (sh) {
      let defs = svg.querySelector('defs');
      if (!defs) { defs = document.createElementNS(NS, 'defs'); svg.prepend(defs); }
      const id = `pr${S.uid()}_shadow`, u = (px) => (px / k).toFixed(2);
      const f = document.createElementNS(NS, 'filter');
      // a generous region: moving parts travel outside the viewBox and must not be cut off by the filter
      Object.entries({ id, filterUnits: 'userSpaceOnUse', x: -vw * 0.6, y: -vh * 1.6, width: vw * 2.2, height: vh * 3.6, 'color-interpolation-filters': 'sRGB' }).forEach(([a, v]) => f.setAttribute(a, v));
      f.innerHTML = (sh.erode ? `<feMorphology in="SourceAlpha" operator="erode" radius="${u(sh.erode)}" result="a"/>` : '')
        + `<feOffset in="${sh.erode ? 'a' : 'SourceAlpha'}" dy="${u(sh.dy)}" result="o"/><feGaussianBlur in="o" stdDeviation="${u(sh.sigma)}" result="b"/>`
        + `<feFlood flood-color="${plateDark ? '#000000' : sh.color}" flood-opacity="${(sh.alpha * (params.plate === 'field' ? FIELD_SHADOW : 1)).toFixed(3)}"/><feComposite in2="b" operator="in" result="s"/>`
        + '<feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>';
      defs.append(f);
      body.setAttribute('filter', `url(#${id})`);
    }

    // ---- parts: free their transform attribute for CSS, set their origin
    const prep = (n) => {
      if (!n || n._prepped) return n;
      n._prepped = true;
      if (n.hasAttribute('transform')) {   // CSS transform would replace it: push it down onto a wrapper of the children
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('transform', n.getAttribute('transform')); n.removeAttribute('transform');
        if (n.nodeName === 'g') { for (const c of [...n.childNodes]) g.append(c); n.append(g); }
        else { n.replaceWith(g); g.append(n); g.id = n.id; n.removeAttribute('id'); n = g; n._prepped = true; }
      }
      const pv = (n.getAttribute('data-pivot') || '').split(/[\s,]+/).map(Number);
      if (pv.length === 2 && pv.every(Number.isFinite)) { n.style.transformBox = 'view-box'; n.style.transformOrigin = `${pv[0]}px ${pv[1]}px`; }
      else { n.style.transformBox = 'fill-box'; n.style.transformOrigin = 'center'; }
      return n;
    };
    const missing = new Set();
    const acts = beats.map((b) => {
      let n = part(b.part);
      if (n) { n = prep(n); parts.set(b.part, n); }
      if (b.do !== 'badge' && !n && !missing.has(b.part)) { missing.add(b.part); S.warn(`prop ${label}: no part "${b.part}"`); }
      return { ...b, n };
    });

    // ---- visibility: each part's timeline of show / hide / swap events
    const vis = new Map();
    const ev = (n, t, v) => { if (!n) return; if (!vis.has(n)) vis.set(n, []); vis.get(n).push({ t, v }); };
    for (const a of acts) {
      if (a.do === 'show') ev(a.n, a.t, 'visible');
      if (a.do === 'hide') ev(a.n, a.t + (a.how === 'pop' ? 0 : a.how === 'away' ? AWAY.dur : DUR.hide), 'hidden');
      if (a.do === 'swap') { ev(a.n, a.t, 'hidden'); const m = prep(part(a.to)); if (m) { parts.set(a.to, m); a.m = m; ev(m, a.t, 'visible'); } else S.warn(`prop ${label}: no part "${a.to}"`); }
    }
    for (const list of vis.values()) { list.sort((p, q) => p.t - q.t); list.initial = list[0].v === 'visible' ? 'hidden' : 'visible'; }

    // ---- fills, draws, recolours: per part, in time order
    const byPart = (kindName) => { const m = new Map(); for (const a of acts) if (a.do === kindName && a.n) { if (!m.has(a.n)) m.set(a.n, []); m.get(a.n).push(a); } return m; };
    const fills = byPart('fill'), draws = byPart('draw'), recolors = byPart('recolor');
    // a part with data-drawn shows that fraction of its strokes before any draw beat (0: hidden until drawn)
    const drawnOf = (n) => { const v = parseFloat(n.getAttribute('data-drawn')); return Number.isFinite(v) ? clamp01(v) : null; };
    for (const n of parts.values()) if (drawnOf(n) != null && !draws.has(n)) draws.set(n, []);
    const axisOf = (n) => fills.get(n)?.[0].axis || (n.getAttribute('data-axis') === 'x' ? 'x' : 'y');
    for (const [n, list] of fills) {
      const slide = n.getAttribute('data-fill') === 'slide';
      if (!slide && !n.hasAttribute('data-pivot')) n.style.transformOrigin = axisOf(n) === 'x' ? 'left center' : 'center bottom';
    }
    const levelOf = (n) => { const v = parseFloat(n.getAttribute('data-level')); return Number.isFinite(v) ? clamp01(v) : null; };
    const staticLevel = [...parts.values()].filter((n) => !fills.has(n) && levelOf(n) != null && prep(n));
    for (const [n] of recolors) {
      let tg = [...(n.matches('[data-base]') ? [n] : []), ...n.querySelectorAll('[data-base]')];
      if (!tg.length) tg = [n, ...n.querySelectorAll(GEOM)].filter((x) => hex6(x.getAttribute('fill')));
      n._tint = tg.map((x) => ({ x, c0: hex6(x.getAttribute('fill')) || '#000000' }));
    }

    // ---- badges: drawn into the SVG beside their part, so they travel, hide and clip with it. On a part a small
    // badge sits on its top-right corner and a big one on its centre; otherwise at (x, y) in prop units [X18]
    const el2 = (tag, attrs = {}) => { const n = document.createElementNS(NS, tag); for (const [a, v] of Object.entries(attrs)) n.setAttribute(a, v); return n; };
    for (const a of acts.filter((x) => x.do === 'badge')) {
      const size = a.big ? 'l' : 's', d = BADGE.d[size] / k;   // prop units
      const c = a.kind === 'check' ? BADGE.green : BADGE.red;
      a.host = part(a.part);
      a.outer = el2('g'); a.inner = el2('g');
      a.outer.style.transformBox = 'view-box';
      a.inner.style.transformBox = 'fill-box'; a.inner.style.transformOrigin = 'center'; a.inner.style.opacity = '0';
      let w = d, hh = d;
      if (a.kind === 'text') {
        const fs = BADGE.text[size], label = (a.text || '').toUpperCase();
        const tw = measureText(label, `${fonts.weight.display} ${fs}px/1 ${fonts.sans}`, fs * 0.02);
        hh = (fs * 1.72) / k; w = (tw + fs * 1.2) / k;
      }
      // a glow of the badge's own hue, a little below it (clip14@640: 0.40 at 4 px, 0.06 at 32 px, gone by ~48 px)
      const gid = `pr${S.uid()}_badge`, R = Math.max(w, hh) / 2 + 48 / k, r0 = Math.min(w, hh) / 2;
      const grad = el2('radialGradient', { id: gid, gradientUnits: 'userSpaceOnUse', cx: 0, cy: 4 / k, r: R });
      [[r0 / R, 0.45], [(r0 + 16 / k) / R, 0.18], [(r0 + 32 / k) / R, 0.05], [1, 0]].forEach(([o, op]) => grad.append(el2('stop', { offset: Math.min(1, o).toFixed(3), 'stop-color': c, 'stop-opacity': op })));
      a.inner.append(grad, el2('ellipse', { cx: 0, cy: 4 / k, rx: R + (w - Math.min(w, hh)) / 2, ry: R, fill: `url(#${gid})` }));
      a.inner.append(el2('rect', { x: -w / 2, y: -hh / 2, width: w, height: hh, rx: hh / 2, fill: c }));
      if (a.kind === 'text') {
        const fs = BADGE.text[size] / k, tx = el2('text', { x: 0, y: fs * (fonts.M.cap / 2), 'text-anchor': 'middle', fill: '#FFFFFF', 'font-size': fs, 'font-weight': fonts.weight.display, 'letter-spacing': fs * 0.02 });
        tx.style.fontFamily = fonts.sans; tx.textContent = (a.text || '').toUpperCase();
        a.inner.append(tx);
      } else {
        const r = BADGE.arm * d;
        const dd = a.kind === 'check' ? `M${-r} ${r * 0.05} L${-r * 0.3} ${r * 0.72} L${r} ${-r * 0.62}` : `M${-r} ${-r} L${r} ${r} M${r} ${-r} L${-r} ${r}`;
        a.inner.append(el2('path', { d: dd, fill: 'none', stroke: '#FFFFFF', 'stroke-width': BADGE.stroke * d, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
      }
      a.outer.append(a.inner);
      // on top of everything, but inside the host's clip if it has one (a sheet's badge goes into the slot with it)
      const clipped = a.host && a.host.parentElement.closest('[clip-path]');
      (clipped && body.contains(clipped) ? clipped : body).append(a.outer);
    }
    // pulses: one ring per beat, over the prop
    for (const a of acts.filter((x) => x.do === 'pulse' && x.n)) {
      a.ring = document.createElementNS(NS, 'circle');
      a.ring.setAttribute('fill', 'none');
      a.ring.style.visibility = 'hidden';
      a.ring.setAttribute('stroke', hex6(a.n.getAttribute('data-ring')) || hex6(svg.getAttribute('data-ring'))
        || (a.n.querySelector('[data-base]') && hex6(a.n.querySelector('[data-base]').getAttribute('fill')))
        || (plateDark ? '#FFFFFF' : colour.ink));
      svg.append(a.ring);
    }

    let laidOut = false;
    const bbox = new Map();
    const bb = (n) => { if (!bbox.has(n)) { let b; try { b = n.getBBox(); } catch { b = { x: 0, y: 0, width: 0, height: 0 }; } bbox.set(n, b); } return bbox.get(n); };
    const layoutOnce = () => {
      if (laidOut) return; laidOut = true;
      for (const a of acts) {
        if (a.do === 'pulse' && a.ring) { const b = bb(a.n); a.cx = b.x + b.width / 2; a.cy = b.y + b.height / 2; a.r0 = Math.max(b.width, b.height) / 2 + 4 / k; a.ring.setAttribute('cx', a.cx); a.ring.setAttribute('cy', a.cy); }
        if (a.do === 'badge' && a.outer) {
          let px = a.x ?? vw * 0.75, py = a.y ?? vh * 0.25;
          if (a.host && a.x == null && a.y == null) { const b = bb(a.host); px = a.big ? b.x + b.width / 2 : b.x + b.width; py = a.big ? b.y + b.height / 2 : b.y; }
          // position by a wrapper's attribute so the landing scale (CSS, about the badge's centre) stays separate
          const pos = el2('g', { transform: `translate(${px.toFixed(2)} ${py.toFixed(2)})` });
          a.outer.append(pos); pos.append(a.inner);
          if (a.host) {   // the outer group copies the host's transform about the host's own origin
            const pv = (a.host.getAttribute('data-pivot') || '').split(/[\s,]+/).map(Number), b = bb(a.host);
            const o = pv.length === 2 && pv.every(Number.isFinite) ? pv : [b.x + b.width / 2, b.y + b.height / 2];
            a.outer.style.transformOrigin = `${o[0]}px ${o[1]}px`;
          }
        }
      }
      for (const [n] of draws) {
        n._paths = [...(n.matches(GEOM) ? [n] : []), ...n.querySelectorAll(GEOM)].filter((p) => (p.getAttribute('stroke') || getComputedStyle(p).stroke) !== 'none')
          .map((p) => { let len = 0; try { len = p.getTotalLength(); } catch { /* not geometry */ } p.style.strokeDasharray = `${len.toFixed(2)} ${(len + 1).toFixed(2)}`; return { p, len }; });
        n._total = n._paths.reduce((x, y) => x + y.len, 0);
      }
      for (const n of [...fills.keys(), ...staticLevel]) bb(n);
    };

    const E = S.E, cb = S.kit.cubicBezier;
    const ease = { out: E.out, inOut: E.inOut, slow: cb(...CURVE.slow), draw: cb(...CURVE.draw), sweep: cb(...CURVE.sweep) };
    // a level (fill or draw) at time t from a part's beats in time order
    const levelAt = (list, t, start, dur, fn) => {
      let v = start;
      for (const a of list) {
        if (t < a.t) break;
        const from = a.from ?? v, to = a.to ?? 1;
        v = from + (to - from) * fn(clamp01((t - a.t) / dur(a)));
      }
      return v;
    };
    const fillLevel = (n, t) => {
      const list = fills.get(n);
      const start = list ? list[0].from ?? levelOf(n) ?? 0 : levelOf(n) ?? 1;
      return list ? levelAt(list, t, start, () => DUR.fill, E.inOut) : start;
    };

    return {
      el, box,
      seek(t) {
        layoutOnce();
        // compose every beat's effect per part from scratch: pure in t
        const st = new Map();
        const get = (n) => { if (!st.has(n)) st.set(n, { dx: 0, dy: 0, s: 1, sx: 1, sy: 1, r: 0, o: 1 }); return st.get(n); };
        for (const a of acts) {
          if (!a.n || a.do === 'badge') continue;
          const u = t - a.t, q = get(a.n);
          if (u < 0) continue;
          if (a.do === 'show') {
            const p = E.out(clamp01(u / DUR.show)), how = a.how || 'slide';
            if (how === 'slide') {
              const d = (a.dist ?? motion.prop.slide / k) * (1 - p), dir = a.from || 'down';
              if (dir === 'down') q.dy += d; else if (dir === 'up') q.dy -= d; else if (dir === 'left') q.dx -= d; else q.dx += d;
            } else if (how === 'grow') q.s *= motion.prop.growFrom + (1 - motion.prop.growFrom) * p;
            else if (how === 'land') q.s *= motion.prop.landFrom + (1 - motion.prop.landFrom) * p;
            else if (how === 'fade') q.o *= 0.8 + 0.2 * clamp01(u / F(3));   // 0.8 contrast on the first frame, full in ~3 frames [M15]
          } else if (a.do === 'hide') {
            if (a.how === 'away') {   // lifts off: rises by its own height and shrinks, accelerating, then fades
              const p = clamp01(u / AWAY.dur) ** 2;
              q.dy -= AWAY.rise * bb(a.n).height * p; q.s *= 1 - AWAY.shrink * p; q.o *= 1 - clamp01((u - AWAY.fadeAt) / (AWAY.dur - AWAY.fadeAt));
            } else if (a.how !== 'pop') q.o *= 1 - clamp01(u / DUR.hide);
          } else if (a.do === 'move') {
            const e = a.ease === 'slow' ? 'slow' : a.ease === 'inOut' ? 'inOut' : 'out';
            const p = ease[e](clamp01(u / (e === 'slow' ? DUR.slow : DUR.move)));
            q.dx += (a.dx || 0) * p; q.dy += (a.dy || 0) * p; q.r += (a.rotate || 0) * p;
            q.s *= 1 + ((a.scale ?? 1) - 1) * p; q.sx *= 1 + ((a.sx ?? 1) - 1) * p; q.sy *= 1 + ((a.sy ?? 1) - 1) * p;
          } else if (a.do === 'spin' && !a.stop) {
            const stop = acts.find((b) => b.do === 'spin' && b.n === a.n && b.stop && b.t > a.t);
            const x = Math.max(0, (stop ? Math.min(t, stop.t) : t) - a.t);
            // spin up over 6 frames to 14 degrees a frame, then constant [M21]
            q.r += (a.rate ?? 1) * motion.spin.degPerFrame * 29.97 * (x < SPIN_UP ? (x * x) / (2 * SPIN_UP) : x - SPIN_UP / 2);
          }
        }
        // levels: a slide fill moves the part inside its parent's clip; otherwise it scales from the bottom or left
        for (const n of [...fills.keys(), ...staticLevel]) {
          const v = fillLevel(n, t), q = get(n), axis = axisOf(n), b = bb(n);
          if (n.getAttribute('data-fill') === 'slide') { if (axis === 'x') q.dx -= (1 - v) * b.width; else q.dy += (1 - v) * b.height; }
          else if (axis === 'x') q.sx *= v; else q.sy *= v;
        }
        for (const [n, list] of draws) {
          // each draw goes from the level the previous one reached, on its own curve; the dash sits just before the
          // path's start at level 0 so a round cap never shows as a dot
          let lv = drawnOf(n) ?? 0;
          for (const a of list) { if (t < a.t) break; const sw = a.ease === 'sweep'; lv += ((a.to ?? 1) - lv) * ease[sw ? 'sweep' : 'draw'](clamp01((t - a.t) / (sw ? DUR.sweep : DUR.draw))); }
          // several strokes in one part draw one after another, in document order, as one route
          let left = lv * n._total;
          for (const { p, len } of n._paths) { const f = len ? clamp01(left / len) : 1; left -= len; p.style.strokeDashoffset = ((len + 0.5) * (1 - f)).toFixed(2); }
        }
        for (const [n, list] of recolors) {
          for (const tg of n._tint) {
            let c = tg.c0, out = null;
            for (const a of list) {
              const to = hex6(a.color); if (!to || t < a.t) continue;
              const p = clamp01((t - a.t) / DUR.recolor);
              out = p >= 1 ? to : mix(c, to, p); c = to;
            }
            const v = out || '';
            if (tg.x._fill !== v) { tg.x.style.fill = v; tg.x._fill = v; }
          }
        }
        for (const [n, list] of vis) {
          let v = list.initial;
          for (const e of list) if (t >= e.t) v = e.v;
          n.style.visibility = v;
        }
        const getVis = (n) => (vis.has(n) ? n.style.visibility : n.getAttribute('visibility') || 'visible');
        for (const [n, q] of st) {
          const moved = q.dx || q.dy || q.s !== 1 || q.sx !== 1 || q.sy !== 1 || q.r;
          const tf = moved ? `translate(${q.dx.toFixed(2)}px, ${q.dy.toFixed(2)}px) rotate(${q.r.toFixed(2)}deg) scale(${(q.s * q.sx).toFixed(4)}, ${(q.s * q.sy).toFixed(4)})` : '';
          if (n._tf !== tf) { n.style.transform = tf; n._tf = tf; }
          const o = q.o >= 0.999 ? '' : q.o.toFixed(3);
          if (n._o !== o) { n.style.opacity = o; n._o = o; }
        }
        for (const n of parts.values()) if (n._tf && !st.has(n)) { n.style.transform = ''; n._tf = ''; n.style.opacity = ''; n._o = ''; }
        // rings and badges
        for (const a of acts) {
          const u = t - a.t;
          if (a.do === 'pulse' && a.ring) {
            const on = u >= 0 && u < RING.dur;
            a.ring.style.visibility = on ? 'visible' : 'hidden';
            if (on) {
              a.ring.setAttribute('r', (a.r0 * (1 + RING.grow * (1 - Math.exp(-u / RING.tau)))).toFixed(2));
              a.ring.setAttribute('stroke-width', ((RING.w0 + (RING.w1 - RING.w0) * (u / RING.dur)) / k).toFixed(2));
              a.ring.style.opacity = (1 - u / RING.dur).toFixed(3);
            }
          } else if (a.do === 'badge' && a.outer) {
            const p = E.out(clamp01(u / DUR.badge)), sc = motion.badge.from + (1 - motion.badge.from) * p;
            const tf = u < 0 ? 'scale(0)' : `scale(${sc.toFixed(4)})`;
            if (a.inner._tf !== tf) { a.inner.style.transform = tf; a.inner.style.opacity = u < 0 ? '0' : ''; a.inner._tf = tf; }
            if (a.host) {   // ride with the host: its transform, its visibility and its opacity
              const tfh = a.host._tf || '', hid = getVis(a.host) === 'hidden', o = hid ? '0' : a.host._o || '';
              if (a.outer._tf !== tfh) { a.outer.style.transform = tfh; a.outer._tf = tfh; }
              if (a.outer._o !== o) { a.outer.style.opacity = o; a.outer._o = o; }
            }
          }
        }
      },
    };
  },
};
