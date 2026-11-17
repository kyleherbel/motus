// A small original icon set for designed explanation cards (research/explain.md X12: flat,
// chunky, single-colour glyphs; grey while idle, coloured when named). Drawn here on a
// 24-unit grid as round-capped strokes, so they read at 22 px in a chip and at 90 px in a hero.
// No third-party marks: a product is shown by a supplied logo file or by its initial.

const P = {
  search: '<circle cx="10.5" cy="10.5" r="6.2"/><path d="M15.2 15.2l5 5"/>',
  chat: '<path d="M4 5.5h16v10.5H10.5L6 19.5V16H4z"/>',
  spark: '<path d="M12 3.2c.9 4.6 2.6 6.4 7.2 7.3-4.6.9-6.3 2.7-7.2 7.3-.9-4.6-2.6-6.4-7.2-7.3 4.6-.9 6.3-2.7 7.2-7.3z"/><path d="M18.6 16.4c.3 1.4.8 2 2.2 2.2-1.4.3-1.9.8-2.2 2.2-.3-1.4-.8-1.9-2.2-2.2 1.4-.2 1.9-.8 2.2-2.2z"/>',
  bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1-4.2 4-6 7.5-6s6.5 1.8 7.5 6"/>',
  users: '<circle cx="9" cy="8.5" r="3.4"/><path d="M2.8 19.5c.8-3.5 3.2-5 6.2-5s5.4 1.5 6.2 5"/><circle cx="16.6" cy="7.6" r="2.7"/><path d="M16.4 13.1c2.6.1 4.3 1.6 4.9 4.6"/>',
  cart: '<path d="M3 4h2.6l2.2 11h10.4l2-7.6H6.6"/><circle cx="9.2" cy="19.2" r="1.4"/><circle cx="16.6" cy="19.2" r="1.4"/>',
  chart: '<path d="M4 20V4M4 20h16M8.5 16v-5M13 16V8M17.5 16v-8"/>',
  trend: '<path d="M3.5 17.5l6-6 4 4 7-7.5"/><path d="M15 8h5.5v5.5"/>',
  star: '<path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M9 12h6M9 16h6"/>',
  code: '<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  mail: '<path d="M3.5 6h17v12h-17z"/><path d="M4 6.5l8 6 8-6"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  cross: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  megaphone: '<path d="M4 10v4h3l7 4.5v-13L7 10z"/><path d="M17.5 9.2a4 4 0 0 1 0 5.6M7.5 14.2l1.4 5.3"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.1"/>',
  dollar: '<path d="M12 3.5v17"/><path d="M16.5 7.4c-.8-1.4-2.4-2.2-4.5-2.2-2.6 0-4.3 1.3-4.3 3.2 0 4.6 9.1 2.3 9.1 7 0 2-1.8 3.4-4.6 3.4-2.3 0-4.1-.9-4.9-2.5"/>',
  store: '<path d="M4 9.5L5.5 4h13L20 9.5"/><path d="M4 9.5c0 1.6 1.2 2.6 2.7 2.6S9.3 11 9.3 9.5c0 1.6 1.2 2.6 2.7 2.6s2.7-1 2.7-2.6c0 1.6 1.2 2.6 2.7 2.6S20 11 20 9.5"/><path d="M5.5 12v8h13v-8"/>',
  phone: '<rect x="7" y="2.8" width="10" height="18.4" rx="2.4"/><path d="M10.6 17.8h2.8"/>',
  eye: '<path d="M2.5 12c2.4-4.4 5.6-6.6 9.5-6.6s7.1 2.2 9.5 6.6c-2.4 4.4-5.6 6.6-9.5 6.6S4.9 16.4 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  upload: '<path d="M12 16V4M6.5 9.5L12 4l5.5 5.5M4 20h16"/>',
  heart: '<path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>',
  agent: '<rect x="4.5" y="8" width="15" height="11.5" rx="3.4"/><path d="M12 4.2V8"/><circle cx="12" cy="3.6" r=".9"/><circle cx="9.3" cy="13.6" r="1.1"/><circle cx="14.7" cy="13.6" r="1.1"/>',
};

export const GLYPHS = Object.keys(P);

/** An inline SVG string for one glyph. `fill` paints the solid glyphs (spark, star, heart, bolt) as filled shapes. */
export function glyphSvg(name, size, colour, { weight = 2.2, solid = false } = {}) {
  const body = P[name] || P.spark;
  const fill = solid ? colour : 'none';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${colour}" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round" style="display:block">${body}</svg>`;
}

/** Glyphs that read better filled than outlined at small sizes. */
export const SOLID = new Set(['spark', 'star', 'heart', 'bolt']);
