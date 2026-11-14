// The small parts explanatory graphics are made of (research/explain-look.md R18-R25, explain-motion.md
// D02-D11): badges that land on an object, tags, icon and logo tiles, line-icon glyphs, and lines that draw
// with a traveller on the tip. Everything here is original and generic: simple geometric glyphs in the
// reference's family (single weight, round caps, no fill), never a traced icon and never a product's mark.
// All motion is a pure function of the time handed in.
import { colour, fonts, explain as X } from './tokens.js';
import { expoInOut, setStyle } from './common.js';

const NS = 'http://www.w3.org/2000/svg';
const lin = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Line glyphs on a 24 x 24 box. Each is a list of path data; `dots` are filled circles [cx, cy, r]. */
export const GLYPHS = {
  check: { d: ['M5 12.6l4.6 4.6L19 7.4'] },
  cross: { d: ['M6.5 6.5l11 11', 'M17.5 6.5l-11 11'] },
  lock: { d: ['M7.5 11V8.2a4.5 4.5 0 0 1 9 0V11', 'M5.5 11h13v9.5h-13z'], dots: [[12, 15.6, 1.1]] },
  unlock: { d: ['M7.5 11V8.2a4.5 4.5 0 0 1 8.7-1.7', 'M5.5 11h13v9.5h-13z'], dots: [[12, 15.6, 1.1]] },
  offline: { d: ['M3 9.2a13.5 13.5 0 0 1 18 0', 'M6.3 12.7a8.6 8.6 0 0 1 11.4 0', 'M9.5 16.1a3.9 3.9 0 0 1 5 0', 'M4.5 4.5l15 15'], dots: [[12, 19.4, 1]] },
  refresh: { d: ['M19.5 12a7.5 7.5 0 1 1-2.2-5.3', 'M19.6 4.2v4.2h-4.2'] },
  document: { d: ['M7 3.5h6.5l3.5 3.5v13.5H7z', 'M13.5 3.5V7H17', 'M9.8 12h4.4', 'M9.8 15.5h4.4'] },
  picture: { d: ['M4 5.5h16v13H4z', 'M4 16l4.6-4.6 3.6 3.6 2.6-2.6L20 17.6'], dots: [[15.8, 9.3, 1.2]] },
  chart: { d: ['M5.5 19.5V11', 'M10 19.5V5', 'M14.5 19.5v-6', 'M19 19.5V8.5'] },
  person: { d: ['M12 11.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2z', 'M5 20a7 7 0 0 1 14 0'] },
  phone: { d: ['M7.5 2.5h9v19h-9z', 'M11 18.4h2'] },
  clock: { d: ['M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z', 'M12 7.4V12l3.2 2'] },
  folder: { d: ['M3.5 6.5h6l2 2.2h9v10.8h-17z'] },
  play: { d: ['M8.5 5.5l10 6.5-10 6.5z'] },
  mic: { d: ['M12 14.5a3 3 0 0 0 3-3V6.5a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z', 'M6.5 11.5a5.5 5.5 0 0 0 11 0', 'M12 17v3.5'] },
  mail: { d: ['M3.5 6h17v12h-17z', 'M3.5 6.5l8.5 6.5 8.5-6.5'] },
  link: { d: ['M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1', 'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'] },
  code: { d: ['M8.5 7.5L4 12l4.5 4.5', 'M15.5 7.5L20 12l-4.5 4.5'] },
  search: { d: ['M10.8 17.1a6.3 6.3 0 1 0 0-12.6 6.3 6.3 0 0 0 0 12.6z', 'M15.4 15.4l4.6 4.6'] },
  star: { d: ['M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z'] },
};
export const GLYPH_NAMES = Object.keys(GLYPHS);

/** A line glyph as an svg of `size` px. stroke: line weight in output px. */
export function glyph(name, size, stroke, color) {
  const g = GLYPHS[name] || GLYPHS.check;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('width', String(size)); svg.setAttribute('height', String(size));
  Object.assign(svg.style, { display: 'block', overflow: 'visible' });
  const sw = (stroke * 24) / size;
  for (const d of g.d) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', color); p.setAttribute('stroke-width', sw.toFixed(3));
    p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
    svg.append(p);
  }
  for (const [cx, cy, r] of g.dots || []) {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', Math.max(r, sw * 0.6)); c.setAttribute('fill', color);
    svg.append(c);
  }
  return svg;
}

export const BADGE_KINDS = ['check', 'cross', 'lock', 'unlock', 'offline'];

/**
 * A badge: a disc that states a new state of the object it lands on [R21, R22, X18].
 *   check           a flat accent disc with a cream check, stroke a tenth of the disc
 *   cross           a red ring with a cross: the one non-accent mark, for "do not" and "blocked"
 *   lock, unlock    an accent disc with a dark line glyph
 *   offline         a dark disc with a thin light ring and a struck signal glyph
 * Returns an element of d x d px with its centre as transform origin.
 */
export function badgeNode(S, kind, d = X.badge.size) {
  const { h } = S.kit;
  const base = { position: 'absolute', left: '0', top: '0', width: `${d}px`, height: `${d}px`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: '50% 50%' };
  if (kind === 'cross') {
    const ring = d * 0.086;
    return h('div', { style: { ...base, boxShadow: `inset 0 0 0 ${ring.toFixed(1)}px ${X.badge.cross}`, background: 'rgba(18,19,22,0.55)' } }, glyph('cross', d * 0.62, ring, X.badge.cross));
  }
  if (kind === 'offline') return h('div', { style: { ...base, background: colour.card.fill, boxShadow: `inset 0 0 0 ${Math.max(3, d * 0.021).toFixed(1)}px ${colour.muted}` } }, glyph('offline', d * 0.56, d * 0.057, colour.cream));
  if (kind === 'lock' || kind === 'unlock') return h('div', { style: { ...base, background: colour.accent } }, glyph(kind, d * 0.56, d * 0.053, '#191A1D'));
  return h('div', { style: { ...base, background: colour.accent } }, glyph('check', d * 0.7, d * X.badge.check, colour.cream));
}

/** A tag: a short text on an accent chip (a price, a count) or, with `stamp`, in an accent outline (a one-word stamp) [R25]. */
export function tagNode(S, text, { stamp = false, cap = 62 } = {}) {
  const size = cap / fonts.capAt(fonts.weight.heavy);
  const padX = cap * 0.62, hgt = cap * 2.3;
  return S.kit.h('div', { text: String(text), style: { position: 'absolute', left: '0', top: '0', height: `${hgt.toFixed(1)}px`, padding: `0 ${padX.toFixed(1)}px`, borderRadius: `${(hgt * 0.26).toFixed(1)}px`, whiteSpace: 'nowrap',
    font: `${fonts.weight.heavy} ${size.toFixed(2)}px/${hgt.toFixed(1)}px ${fonts.sans}`, letterSpacing: '-0.03em', transformOrigin: '50% 50%',
    color: stamp ? colour.accent : '#191A1D', background: stamp ? colour.card.fill : colour.accent, boxShadow: stamp ? `inset 0 0 0 8px ${colour.accent}` : 'none' } });
}

/** A badge landing [D09]: in place, scale 0.55 to 1 on expo.inOut over 10 frames, opaque within 3, blur clearing last. a = seconds since it started. */
export function popAt(el, a, place = '') {
  const B = X.badge;
  if (el._shown === undefined) el._shown = el.style.display === 'none' ? '' : el.style.display;   // keep the node's own display (a badge is a flex box)
  setStyle(el, 'display', a <= 0 ? 'none' : el._shown);
  if (a <= 0) return;
  const u = lin(a / B.dur), p = expoInOut(u);
  setStyle(el, 'opacity', a >= B.fade ? '1' : (a / B.fade).toFixed(3));
  setStyle(el, 'transform', `${place} scale(${(B.from + (1 - B.from) * p).toFixed(4)})`.trim());
  const b = u < 1 ? B.blur * Math.sin(Math.PI * u) : 0;
  setStyle(el, 'filter', b > 0.05 ? `blur(${b.toFixed(2)}px)` : '');
}

/** A tag or short label arriving inside a picture [D11]: the chip entrance, a 22 px rise from scale 0.65. */
export function tagAt(el, a, place = '') {
  const T = X.tag;
  if (el._shown === undefined) el._shown = el.style.display === 'none' ? '' : el.style.display;   // keep the node's own display (a badge is a flex box)
  setStyle(el, 'display', a <= 0 ? 'none' : el._shown);
  if (a <= 0) return;
  const u = lin(a / T.dur), p = expoInOut(u);
  setStyle(el, 'opacity', u >= 0.3 ? '1' : (u / 0.3).toFixed(3));
  setStyle(el, 'transform', `${place} translateY(${(T.rise * (1 - p)).toFixed(2)}px) scale(${(T.from + (1 - T.from) * p).toFixed(4)})`.trim());
  const b = u < 1 ? T.blur * Math.sin(Math.PI * u) : 0;
  setStyle(el, 'filter', b > 0.05 ? `blur(${b.toFixed(2)}px)` : '');
}

/**
 * An icon or logo tile [R23, R24]: a rounded square, radius 0.31 of its side, in cream, dark or accent, holding
 * the user's mark (`image`: a loaded medium from media.js), a line glyph, or one or two initials.
 */
export function tileNode(S, { side = X.tile.side, fill = 'cream', image = null, glyph: name = null, initials = '' } = {}) {
  const { h } = S.kit;
  const bg = fill === 'dark' ? colour.card.fill : fill === 'accent' ? colour.accent : colour.cream;
  const ink = fill === 'cream' ? '#191A1D' : colour.cream;
  const el = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${side}px`, height: `${side}px`, borderRadius: `${(side * X.tile.radius).toFixed(1)}px`, background: bg, overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: '50% 50%', boxShadow: fill === 'dark' ? `inset 0 0 0 2px ${colour.card.stroke}` : 'none' } });
  if (image && image.kind === 'image') el.append(h('img', { src: image.url, style: { width: `${(side * 0.62).toFixed(1)}px`, height: `${(side * 0.62).toFixed(1)}px`, objectFit: 'contain', display: 'block' } }));
  else if (name && GLYPHS[name]) el.append(glyph(name, side * X.tile.glyph, side * X.tile.stroke, ink));
  else if (initials) el.append(h('div', { text: String(initials).slice(0, 2).toUpperCase(), style: { font: `${fonts.weight.heavy} ${(side * 0.4).toFixed(1)}px/1 ${fonts.sans}`, letterSpacing: '-0.03em', color: ink } }));
  return el;
}

/**
 * A line that draws [D02, D03, R18, R19]. `d` is svg path data in frame px. style: solid (accent, 10 px, round
 * caps), dashed (22 px on 8 px) or dotted (8 px dots on an 18 px pitch). The pattern is fixed in space and revealed
 * up to the tip. Returns { el, length, draw(p), point(p) }: draw shows the first share p of the path, point gives
 * the tip's position for a traveller.
 */
export function linePath(S, d, { style = 'solid', stroke, color = colour.accent } = {}) {
  const L = X.line;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '1080'); svg.setAttribute('height', '1920'); svg.setAttribute('viewBox', '0 0 1080 1920');
  Object.assign(svg.style, { position: 'absolute', left: '0', top: '0', overflow: 'visible', pointerEvents: 'none' });
  const mk = (w) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round'); p.setAttribute('stroke-width', String(w)); return p; };
  const w = stroke || (style === 'solid' ? L.stroke : style === 'dashed' ? L.dashStroke : L.dot[0]);
  const shown = mk(w); shown.setAttribute('stroke', color);
  if (style === 'dashed') shown.setAttribute('stroke-dasharray', `${L.dash[0] - w} ${L.dash[1] + w}`);
  if (style === 'dotted') shown.setAttribute('stroke-dasharray', `0.01 ${L.dot[1]}`);
  const length = shown.getTotalLength();
  // the reveal: a solid copy of the path in a mask, drawn up to the tip
  const id = `eb-line-${S.uid()}`;
  const mask = document.createElementNS(NS, 'mask'); mask.setAttribute('id', id); mask.setAttribute('maskUnits', 'userSpaceOnUse');
  mask.setAttribute('x', '-200'); mask.setAttribute('y', '-200'); mask.setAttribute('width', '1480'); mask.setAttribute('height', '2320');
  const reveal = mk(w + 6); reveal.setAttribute('stroke', '#fff'); reveal.setAttribute('stroke-dasharray', `${length} ${length + 40}`);
  mask.append(reveal);
  shown.setAttribute('mask', `url(#${id})`);
  svg.append(mask, shown);
  let last = null;
  return {
    el: svg, length,
    draw(p) {
      const q = lin(p);
      if (q === last) return;
      last = q;
      svg.style.display = q <= 0 ? 'none' : '';
      reveal.setAttribute('stroke-dashoffset', (length * (1 - q)).toFixed(2));
    },
    point(p) { const pt = shown.getPointAtLength(length * lin(p)); return [pt.x, pt.y]; },
  };
}

/** Progress of a line that draws over its fixed 12 frames on expo.inOut [D02]. a = seconds since it started. */
export const drawProgress = (a) => expoInOut(a / X.line.draw);

/** A traveller: the solid accent dot that sits on the tip of a drawn path, or a cream disc for a long route [D05]. */
export function travellerNode(S, { disc = false, size } = {}) {
  const d = size || (disc ? X.traveller.disc : X.traveller.dot);
  return S.kit.h('div', { style: { position: 'absolute', left: `${-d / 2}px`, top: `${-d / 2}px`, width: `${d}px`, height: `${d}px`, borderRadius: '50%', background: disc ? colour.cream : colour.accent, display: 'none' } });
}
