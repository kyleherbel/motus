// Helpers shared by the interface elements item-stack, before-after, capture, code-window and key-caps
// (research/explain.md X70-X74; graphics.md G16, G17). Not an element: index.js never loads it by name.
// Could move into card.js; it lives here because builders do not edit the shared files.
//   window chrome   light bar (browser) or dark bar (editor, terminal) with the traffic lights in the house
//                   proportions [X74, G17], an optional title after the dots or a centred URL pill [X74]
//   ring pulse      a ring that grows outward from an element and fades, about 9 frames [X72]
import { colour, fonts, motion } from '../tokens.js';
import { CARD } from '../card.js';
import { setStyle, clamp01 } from '../common.js';

// TOKENS (research/explain.md X72-X74; colour.md C18; graphics.md G16, G17)
export const UI = {
  accent: '#E38056',            // the default prop accent, warm orange [C18]
  // light browser bar, clip01@840: bar 64 px (4.5 dot-diameters at 14.2 px), fill #F4F5F3, URL pill 324 x 34
  // white, centred, radius 17 [X74; measured clip01@840]
  bar: { light: '#F4F5F3', dark: '#171719', hairDark: '#2C2E31' },   // dark bar and hairline: clip03@967 [X74]
  pill: { w: 324, h: 34, fill: '#FDFDFD', text: '#8A8C90' },          // [X74 browser variant; measured clip01@840]
  bodyDark: '#1C1E22',          // editor body under a dark bar, clip03@967
  ring: { width: 4, grow: 70 },  // ring stroke px and growth px over its life (60-180 px) [X72 build_spec; by eye]
};

export const hexOr = (c, fb) => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : fb);
export const rgbaOf = (hex, a) => { const s = hex.replace('#', ''); return `rgba(${[0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)).join(',')},${a})`; };

/**
 * A window: a white (or dark) rounded card with a title bar 4.5 dot-diameters tall over a hairline, three
 * traffic lights, and either a grey title after the dots or a centred URL pill [X74, G17].
 * Returns { el, body, barH } where body is the content area under the bar (overflow hidden).
 */
export function windowChrome(S, { x, y, w, h, dark = false, title = '', url = '', radius = CARD.radius, fill, shadow = colour.shadow.card }) {
  const { h: hh } = S.kit;
  const d = CARD.dot, barH = CARD.bar * d;
  const el = hh('div.pr-win', { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, borderRadius: `${radius}px`,
    background: fill || (dark ? UI.bodyDark : colour.card), boxShadow: shadow, overflow: 'hidden' } });
  const bar = hh('div', { style: { position: 'absolute', left: '0', top: '0', width: '100%', height: `${barH}px`, background: dark ? UI.bar.dark : UI.bar.light,
    borderBottom: `1px solid ${dark ? UI.bar.hairDark : colour.line}`, boxSizing: 'border-box' } });
  colour.traffic.forEach((c, k) => bar.append(hh('div', { style: { position: 'absolute', left: `${(CARD.firstDot + k * CARD.pitch) * d - d / 2}px`, top: `${barH / 2 - d / 2}px`,
    width: `${d}px`, height: `${d}px`, borderRadius: '50%', background: c } })));
  if (url) {
    const pill = hh('div', { style: { position: 'absolute', left: `${w / 2 - UI.pill.w / 2}px`, top: `${barH / 2 - UI.pill.h / 2}px`, width: `${UI.pill.w}px`, height: `${UI.pill.h}px`,
      borderRadius: `${UI.pill.h / 2}px`, background: dark ? '#26282C' : UI.pill.fill, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' } },
    // a small padlock drawn from two boxes, then the address
    hh('div', { style: { position: 'relative', width: '11px', height: '13px' } },
      hh('div', { style: { position: 'absolute', left: '2px', top: '0', width: '7px', height: '8px', border: `2px solid ${UI.pill.text}`, borderBottom: 'none', borderRadius: '4px 4px 0 0', boxSizing: 'border-box' } }),
      hh('div', { style: { position: 'absolute', left: '0', top: '6px', width: '11px', height: '7px', borderRadius: '2px', background: UI.pill.text } })),
    hh('div', { text: url, style: { font: `500 19px/1 ${fonts.sans}`, color: UI.pill.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: `${UI.pill.w - 50}px` } }));
    bar.append(pill);
  } else if (title) {
    bar.append(hh('div', { text: title, style: { position: 'absolute', left: `${(CARD.firstDot + 2 * CARD.pitch) * d + d * 1.6}px`, top: `${barH / 2 - 11}px`,
      font: `500 20px/22px ${fonts.sans}`, color: dark ? '#9A9CA3' : colour.inkSoft, whiteSpace: 'nowrap' } }));
  }
  const body = hh('div', { style: { position: 'absolute', left: '0', top: `${barH}px`, width: '100%', height: `${h - barH}px`, overflow: 'hidden' } });
  el.append(body, bar);
  return { el, body, barH };
}

/**
 * A ring pulse around a rectangle (x, y, w, h, radius) in the parent's coordinates: it starts at the
 * element's edge, grows outward decelerating and fades over about 9 frames [X72]. seek(u): u = seconds since
 * the landing.
 */
export function ringPulse(S, { x, y, w, h, radius = 20, color = '#FFFFFF' }) {
  const el = S.kit.h('div', { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, borderRadius: `${radius}px`,
    border: `${UI.ring.width}px solid ${color}`, boxSizing: 'border-box', display: 'none', pointerEvents: 'none' } });
  return {
    el,
    seek(u) {
      const on = u >= 0 && u < motion.ring.dur;
      setStyle(el, 'display', on ? '' : 'none');
      if (!on) return;
      const p = S.E.out(clamp01(u / motion.ring.dur)), g = UI.ring.grow * p;
      setStyle(el, 'left', `${(x - g).toFixed(1)}px`); setStyle(el, 'top', `${(y - g).toFixed(1)}px`);
      setStyle(el, 'width', `${(w + 2 * g).toFixed(1)}px`); setStyle(el, 'height', `${(h + 2 * g).toFixed(1)}px`);
      setStyle(el, 'borderRadius', `${(radius + g).toFixed(1)}px`);
      setStyle(el, 'opacity', (1 - clamp01(u / motion.ring.dur)).toFixed(3));
    },
  };
}
