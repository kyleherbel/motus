// The plate behind a graphic (research/colour.md C04-C13; verification "Pale plate").
// The plate is chosen per graphic, not per layout: consecutive graphics rarely share one [C13, G27].
//   pale   a vertical gradient, top 12 levels lighter than the bottom, with one or two large pastel tints at
//          opposite edges; static (the verifier found the tint field still or under 2 px/s) [C05-C07; V]
//   white  flat #FFFFFF [C04]
//   dark   one of four near-blacks, lighter in the centre by 7-27 levels [C09]
//   field  one saturated colour for one sentence: the brand's or one the sentence names [C11]
// No grain, no vignette on light plates, no texture by default [C03, C29].
import { colour } from './tokens.js';
import { unit } from './common.js';

export const PLATES = ['pale', 'white', 'dark', 'navy', 'warm', 'teal', 'field'];

const hex = (h) => { const s = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); };
const rgba = (h, a) => `rgba(${hex(h).join(',')},${a})`;
const lift = (h, d) => '#' + hex(h).map((v) => Math.min(255, Math.round(v + d)).toString(16).padStart(2, '0')).join('');

const CORNER = { tl: [0, 0], tr: [1, 0], bl: [0, 1], br: [1, 1], ml: [0, 0.5], mr: [1, 0.5] };

/** CSS background for a plate of size w x h. seed: a stable string (the instance key) for the tint choice. */
export function plateBackground(S, kind = 'pale', { w, h, seed = '', field } = {}) {
  const P = colour.plate;
  switch (kind) {
    case 'white': return P.white;
    case 'dark': case 'navy': case 'warm': case 'teal': {
      const name = kind === 'dark' ? 'neutral' : kind;
      const base = P.dark[name];
      return `radial-gradient(ellipse 75% 60% at 50% 48%, ${lift(base, P.darkLift[name])} 0%, ${base} 100%)`;
    }
    case 'field': {
      const c = /^#[0-9a-f]{6}$/i.test(field || '') ? field : colour.fieldDefault;
      return c;
    }
    default: {
      const u = unit(S, seed);
      const pair = P.tintCorners[Math.floor(u * P.tintCorners.length)];
      const t1 = P.tints[Math.floor(unit(S, seed + '/a') * P.tints.length)];
      let t2 = P.tints[Math.floor(unit(S, seed + '/b') * P.tints.length)];
      if (t2 === t1) t2 = P.tints[(P.tints.indexOf(t1) + 2) % P.tints.length];
      const r1 = P.tintRadius[0] + (P.tintRadius[1] - P.tintRadius[0]) * unit(S, seed + '/r1');
      const r2 = P.tintRadius[0] + (P.tintRadius[1] - P.tintRadius[0]) * unit(S, seed + '/r2');
      // one or two tints; the 0.6 share and the 0.62 tint alpha below are by eye, to be settled in the fidelity loop
      const two = unit(S, seed + '/n') < 0.6;
      const blob = (c, corner, r) => { const [cx, cy] = CORNER[corner]; return `radial-gradient(circle ${r.toFixed(0)}px at ${(cx * w).toFixed(0)}px ${(cy * h).toFixed(0)}px, ${rgba(c, 0.62)} 0%, ${rgba(c, 0)} 100%)`; };
      const layers = [blob(t1, pair[0], r1)];
      if (two) layers.push(blob(t2, pair[1], r2));
      layers.push(`linear-gradient(to bottom, ${P.pale.top}, ${P.pale.bottom})`);
      return layers.join(', ');
    }
  }
}

/** Is text on this plate light (white) or dark (ink)? */
export const plateIsDark = (kind, field) => {
  if (['dark', 'navy', 'warm', 'teal'].includes(kind)) return true;
  if (kind === 'field') { const [r, g, b] = hex(/^#[0-9a-f]{6}$/i.test(field || '') ? field : colour.fieldDefault); return 0.2126 * r + 0.7152 * g + 0.0722 * b < 150; }
  return false;
};
