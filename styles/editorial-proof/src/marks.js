// The few fixed marks the style puts on a proof: highlight, outline box, marker strike,
// big-number tile, spotlight. Each returns { el, seek(t) } and is positioned in the
// coordinate space of the element it is appended to.
import { motion, fonts, type, expo } from './tokens.js';
import { roundRectPath, drawOnPath } from './anim.js';

/** An exponential approach normalised to land exactly on 1 at `cap`. */
const approach = (t, t0, tau, cap) => Math.min(1, expo(t, t0, tau) / (1 - Math.exp(-cap / tau)));

/**
 * A flat highlight box behind a phrase. rects: one {x,y,w,h} per text line.
 * tone: 'accent' | 'red' ; surface: 'light' | 'dark' (dark pages get a darker box that adds light).
 */
export function highlight(S, { rects, t0, tone = 'accent', surface = 'light', pad = 7, heightRatio = 1 }) {
  const { kit, C } = S; const { h } = kit;
  const colour = tone === 'red' ? C.redSoft : surface === 'dark' ? C.highlightDark : C.highlight;
  const el = h('div.ep-hl', { style: { position: 'absolute', left: '0', top: '0', pointerEvents: 'none' } });
  const total = rects.reduce((n, r) => n + r.w, 0) || 1;
  let acc = 0;
  const bars = rects.map((r) => {
    const hh = r.h * heightRatio;
    const bar = h('div', { style: { position: 'absolute', left: `${r.x - pad}px`, top: `${r.y + (r.h - hh) / 2}px`, width: '0px', height: `${hh}px`, borderRadius: '6px', background: colour, mixBlendMode: surface === 'dark' ? 'screen' : 'multiply' } });
    el.append(bar);
    const seg = { bar, w: r.w + pad * 2, from: acc / total, to: (acc + r.w) / total };
    acc += r.w;
    return seg;
  });
  return {
    el, t0,
    seek(t) {
      const p = approach(t, t0, motion.highlight.tau, motion.highlight.cap);     // one continuous sweep across wrapped lines
      el.style.display = t >= t0 ? '' : 'none';
      for (const b of bars) b.bar.style.width = `${b.w * kit.clamp((p - b.from) / Math.max(1e-6, b.to - b.from))}px`;
    },
  };
}

/**
 * A bright rounded outline around a control or a single token. rect is the target; the box sits `gap` px clear of it.
 * It is traced, not popped: the stroke starts at the top-left corner and runs clockwise on the highlight's
 * curve, about half the perimeter on its first frame and closed by frame 5 (research/explain.md X03).
 */
export function outlineBox(S, { rect, t0, tone = 'accent', gap = 10, width = 5, radius = 16 }) {
  const { kit, C } = S; const { h } = kit;
  const colour = tone === 'red' ? '#E5484D' : tone === 'orange' ? '#F59F1F' : C.callout;
  const W = rect.w + gap * 2, H = rect.h + gap * 2;
  const el = h('div.ep-outline', { style: { position: 'absolute', left: `${rect.x - gap}px`, top: `${rect.y - gap}px`, width: `${W}px`, height: `${H}px`, pointerEvents: 'none' } });
  const { d, len } = roundRectPath(width / 2, width / 2, W - width, H - width, radius);
  const stroke = drawOnPath(S, { d, len, w: W, h: H, t0, colour, width });
  el.append(stroke.el);
  return {
    el, t0,
    seek(t) {
      el.style.display = t >= t0 ? '' : 'none';
      stroke.seek(t);
    },
  };
}

/**
 * A tapered marker stroke across a price, a logo or a name, rising 7 degrees to the right,
 * drawn left to right. rect is what it crosses out.
 */
export function strike(S, { rect, t0, outline = false }) {
  const { kit, C } = S;
  const over = 15, len = rect.w + over * 2;
  const mid = Math.max(10, Math.min(18, len * 0.04 + 8)), end = mid * 0.6;
  const hgt = mid + 6;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', len); svg.setAttribute('height', hgt); svg.setAttribute('viewBox', `0 0 ${len} ${hgt}`);
  Object.assign(svg.style, { position: 'absolute', left: `${rect.x - over}px`, top: `${rect.y + rect.h / 2 - hgt / 2}px`, overflow: 'visible', transform: 'rotate(-7deg)', transformOrigin: '50% 50%', pointerEvents: 'none' });
  const cy = hgt / 2;
  const d = `M0 ${cy} C${len * 0.2} ${cy - end / 2 - 1} ${len * 0.35} ${cy - mid / 2} ${len * 0.5} ${cy - mid / 2} C${len * 0.7} ${cy - mid / 2} ${len * 0.85} ${cy - end / 2} ${len} ${cy} C${len * 0.85} ${cy + end / 2} ${len * 0.7} ${cy + mid / 2} ${len * 0.5} ${cy + mid / 2} C${len * 0.35} ${cy + mid / 2} ${len * 0.2} ${cy + end / 2 + 1} 0 ${cy}Z`;
  const id = `ep-strike-${S.uid()}`;
  svg.innerHTML = `<defs><clipPath id="${id}"><rect x="-4" y="-10" width="0" height="${hgt + 20}"/></clipPath></defs><g clip-path="url(#${id})"><path d="${d}" fill="${C.red}" ${outline ? 'stroke="#FFFFFF" stroke-width="3" paint-order="stroke"' : ''}/></g>`;
  const clip = svg.querySelector('rect');
  return {
    el: svg, t0,
    seek(t) {
      const p = approach(t, t0, motion.strike.tau, motion.strike.cap);
      svg.style.display = t >= t0 ? '' : 'none';
      clip.setAttribute('width', String((len + 8) * p));
    },
  };
}

/** A thin typographic strikethrough for rows of a designed list. */
export function lineThrough(S, { rect, t0 }) {
  const { kit, C } = S; const { h } = kit;
  const el = h('div', { style: { position: 'absolute', left: `${rect.x - 4}px`, top: `${rect.y + rect.h * 0.52}px`, width: '0px', height: '3px', borderRadius: '2px', background: C.redText, pointerEvents: 'none' } });
  return { el, t0, seek(t) { const p = approach(t, t0, motion.strike.tau, motion.strike.cap); el.style.display = t >= t0 ? '' : 'none'; el.style.width = `${(rect.w + 8) * p}px`; } };
}

/** Parse "24.3k", "$1,000+", "42%" into the parts a rolling counter needs. */
export function parseFigure(value) {
  const m = String(value).match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
  if (!m) return { prefix: '', number: null, suffix: '', text: String(value) };
  const raw = m[2]; const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return { prefix: m[1], number: Number(raw.replace(/,/g, '')), suffix: m[3], decimals, commas: raw.includes(','), text: String(value) };
}
export function formatFigure(f, x) {
  if (f.number === null) return f.text;
  let s = x.toFixed(f.decimals);
  if (f.commas) { const [a, b] = s.split('.'); s = a.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (b ? `.${b}` : ''); }
  return `${f.prefix}${s}${f.suffix}`;
}

/**
 * The big number: digits roll up decelerating over 16 frames in white, the dark plate fades in
 * under them during the last third, and as the count lands the digits take the accent gradient.
 * Centred on (cx, cy). It leaves after `hold`.
 */
export function numberTile(S, { value, label, cx, cy, t0, hold = motion.number.hold, skin = 'dark', maxW = 760 }) {
  const { kit, C } = S; const { h } = kit;
  const fig = parseFigure(value);
  const dark = skin !== 'white';
  const digitFont = (s) => `${type.number.weight} ${s}px ${fonts.sans}`;
  // a tile over a card: digit cap about 135 px (graphics G16: 132-148), cap top 50 px under the tile top,
  // label 48 px with its ascender 41 px under the digit baseline and its baseline 37 px above the tile bottom
  const size = kit.fitSize(fig.text, maxW - 96, digitFont, 186, 90, type.number.tracking);
  const padTop = 50 - 0.0665 * size;
  const base = { font: digitFont(size), letterSpacing: `${type.number.tracking}em`, lineHeight: '0.86', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' };
  // two stacked copies of the digits: white first, the accent version fades in over it
  const plain = h('div', { text: fig.text, style: { ...base, color: dark ? '#FFFFFF' : C.ink, textShadow: dark ? '0 2px 18px rgba(0,0,0,0.45)' : 'none' } });
  const tinted = h('div', { text: fig.text, style: { ...base, position: 'absolute', left: '0', top: '0',
    ...(dark ? { background: `linear-gradient(180deg, ${C.digits.map((c, i) => `${c} ${10 + i * 16}%`).join(', ')})`, webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 18px ${C.digitGlow})` } : { color: C.accent }) } });
  const digits = h('div', { style: { position: 'relative' } }, plain, tinted);
  const lab = label ? h('div', { text: label, style: { font: `700 48px/1 ${fonts.sans}`, letterSpacing: `${type.number.labelTracking}em`, color: dark ? C.tileLabel : '#76767A', marginTop: '22px', whiteSpace: 'nowrap' } }) : null;
  const plate = h('div', { style: { position: 'absolute', left: '0', top: '0', right: '0', bottom: '0', borderRadius: dark ? '27px' : '34px', background: dark ? C.tile : C.white, border: dark ? `1.5px solid ${C.tileEdge}` : '1px solid #E4E4E6', boxShadow: dark ? '0 24px 60px rgba(0,0,0,0.45)' : '0 20px 44px rgba(0,0,0,0.16)', backdropFilter: dark ? 'blur(14px)' : 'none' } });
  const content = h('div', { style: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' } }, digits, lab);
  const tile = h('div.ep-number', { style: { position: 'absolute', left: `${cx}px`, top: `${cy}px`, transform: 'translate(-50%, -50%)', padding: `${padTop.toFixed(1)}px 48px ${label ? 30 : (50 - 0.066 * size).toFixed(1)}px`, pointerEvents: 'none' } }, plate, content);
  const M = motion.number;
  const landed = t0 + M.count;
  const tOut = Number.isFinite(hold) ? landed + hold : Infinity;
  return {
    el: tile, t0, landed, tOut: tOut + M.out,
    /** 0..1: how strongly the card under the tile should be dimmed at time t */
    dim(t) { return t < t0 ? 0 : kit.prog(t, t0 + M.plateAt, M.plateFade, kit.ease.outCubic) * (1 - kit.prog(t, tOut, M.out, kit.ease.inCubic)); },
    seek(t) {
      const on = t >= t0 && t < tOut + M.out;
      tile.style.display = on ? '' : 'none';
      if (!on) return;
      const q = kit.prog(t, tOut, M.out, kit.ease.inCubic);
      const pin = kit.prog(t, t0, 4 / 30, kit.ease.outCubic);
      tile.style.opacity = String(pin * (1 - q));
      tile.style.transform = `translate(-50%, -50%) scale(${((0.94 + 0.06 * pin) * (1 - 0.05 * q)).toFixed(4)})`;
      const pp = kit.prog(t, t0 + M.plateAt, M.plateFade, kit.ease.outCubic);
      plate.style.opacity = String(pp);
      if (lab) lab.style.opacity = String(pp);
      tinted.style.opacity = String(kit.prog(t, landed, M.tint, kit.ease.outCubic));
      if (fig.number !== null) {
        const roll = kit.prog(t, t0, M.count, kit.ease.outQuart);
        const txt = roll >= 1 ? fig.text : formatFigure(fig, fig.number * roll);
        if (plain.textContent !== txt) { plain.textContent = txt; tinted.textContent = txt; }
      }
    },
  };
}

/** Dim a page and lift one block of it on a white plate. rect is the block, in the page's coordinates. */
export function spotlight(S, { rect, t0, w, h: H }) {
  const { kit } = S; const { h } = kit;
  const pad = 14;
  const scrim = h('div.ep-spot', { style: { position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${H}px`, background: 'rgba(0,0,0,0.46)', pointerEvents: 'none',
    clipPath: `polygon(evenodd, 0 0, ${w}px 0, ${w}px ${H}px, 0 ${H}px, 0 0, ${rect.x - pad}px ${rect.y - pad}px, ${rect.x - pad}px ${rect.y + rect.h + pad}px, ${rect.x + rect.w + pad}px ${rect.y + rect.h + pad}px, ${rect.x + rect.w + pad}px ${rect.y - pad}px, ${rect.x - pad}px ${rect.y - pad}px)` } });
  return { el: scrim, t0, seek(t) { const p = kit.prog(t, t0, 0.2, kit.ease.outCubic); scrim.style.display = t >= t0 ? '' : 'none'; scrim.style.opacity = String(p); } };
}
