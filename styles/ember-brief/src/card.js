// The two card families (research/graphics.md G04, G05, G14; colour.md C14, C15):
//   paper  a captured page as a plain rounded card: the page's own background, radius 28, no stroke,
//          no browser chrome, one soft shadow below
//   dark   an app screen redrawn in the house style: dark grey fill, 2 px lighter stroke, radius 30
// Both sit on the 1000 px column (x 40 to 1040).
import { colour } from './tokens.js';

// TOKENS (research/graphics.md G05, G14; verified)
export const CARD = { paperRadius: 28, darkRadius: 30, stroke: 2, pad: 44 };

/** A positioned card. kind: 'paper' | 'dark'. Returns the element; children go inside it. */
export function card(S, { x, y, w, h: hh, kind = 'dark', fill, clip = true }) {
  const dark = kind === 'dark';
  return S.kit.h(`div.eb-card.eb-card-${kind}`, { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${hh}px`,
    borderRadius: `${dark ? CARD.darkRadius : CARD.paperRadius}px`, overflow: clip ? 'hidden' : 'visible', background: fill || (dark ? colour.card.fill : colour.paper),
    boxShadow: dark ? `inset 0 0 0 ${CARD.stroke}px ${colour.card.stroke}, ${colour.shadow}` : colour.shadow } });
}
