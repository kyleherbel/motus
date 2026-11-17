// The shared card and window (research/graphics.md G15-G17; explain.md X73, X74; colour.md C17, C20; verification
// "Card and prop shadows"). Interfaces are rebuilt, simplified UI: white rounded cards with ink text on a plate.
//   card     #FFFFFF, corner radius 31 (25-33), a shadow only below: 0 31px 41px -27px rgba(0,0,0,0.43) [G16; V]
//   window   a card with a title bar 4.5 dot-diameters tall over a hairline, and three traffic lights 13.5 px
//            across at a 1.88-diameter pitch, the red one's centre 2.07 diameters from the left edge [G17, X74]
// The main card is 914 px wide, 84 px in from each side [G16; V].
import { colour } from './tokens.js';

export const CARD = {
  radius: 31,                 // [G16 corrected by V]
  mainW: 914, inset: 84,      // [G16; V]
  dot: 13.5, pitch: 1.88, firstDot: 2.07, bar: 4.5,   // [G17, X74]
};

/** A white card at (x, y, w, h). kind 'card' | 'window'; dot: traffic-light diameter. Returns { el, body, bodyTop }. */
export function card(S, { x, y, w, h, kind = 'card', radius = CARD.radius, fill = colour.card, shadow = colour.shadow.card, title = '', dot = CARD.dot }) {
  const { h: hh } = S.kit;
  const el = hh('div.pr-card', { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, borderRadius: `${radius}px`,
    background: fill, boxShadow: shadow, overflow: 'hidden' } });
  let top = 0;
  if (kind === 'window') {
    // one dot size per video, 13.5 px median (12-18.8): terminals and large windows use bigger dots [X74]
    const d = dot, barH = CARD.bar * d;
    const bar = hh('div', { style: { position: 'absolute', left: '0', top: '0', width: '100%', height: `${barH}px`, borderBottom: `1px solid ${colour.line}` } });
    colour.traffic.forEach((c, k) => bar.append(hh('div', { style: { position: 'absolute', left: `${(CARD.firstDot + k * CARD.pitch) * d - d / 2}px`, top: `${barH / 2 - d / 2}px`,
      width: `${d}px`, height: `${d}px`, borderRadius: '50%', background: c } })));
    if (title) bar.append(hh('div', { text: title, style: { position: 'absolute', left: '0', right: '0', top: `${barH / 2 - 11}px`, textAlign: 'center',
      font: `500 20px/22px ${'"PR Inter", Inter, sans-serif'}`, color: colour.inkSoft, whiteSpace: 'nowrap' } }));
    el.append(bar);
    top = barH;
  }
  const body = hh('div', { style: { position: 'absolute', left: '0', top: `${top}px`, width: '100%', height: `${h - top}px` } });
  el.append(body);
  return { el, body, bodyTop: top };
}
