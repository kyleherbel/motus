// Every element the style can draw. To add one: write src/elements/<type>.js (default export
// { type, label, slots, params, beats, prepare?, build }), add its file name to NAMES,
// then run `node styles/seamline/build-manifest.mjs`.
//
// Elements load one by one so that a missing or broken element is reported and skipped
// instead of taking the whole style down.
const NAMES = ['footage', 'headline', 'big-word', 'brand-mark'];

const loaded = await Promise.all(NAMES.map(async (name) => {
  try {
    const mod = await import(`./${name}.js`);
    return mod.default;
  } catch (e) {
    const missing = /Cannot find module|Failed to fetch|ERR_MODULE_NOT_FOUND|404/.test(String(e && (e.code || e.message)));
    if (!missing) console.warn(`[seamline] element "${name}" failed to load: ${e && e.message}`);
    return null;
  }
}));

export const elements = loaded.filter(Boolean);
export const byType = Object.fromEntries(elements.map((e) => [e.type, e]));

/**
 * The four layouts and their slots (research/layout.md L01-L10; structure.md S03-S06).
 *   split   the base, about 60 % of runtime: real footage in the top half (y 0-960), the speaker in the bottom half,
 *           a hard seam with the caption on it. The opening headline sits over the top half.
 *   face    the speaker full frame, pushing in: short inserts (about 1.3 s) on opinions, asides, one- or two-word
 *           sentences and the sign-off; the big word lives here.
 *   full    footage full frame: demos, results and examples that need the whole frame (about 15 %).
 *   stack   two pieces of footage, one over the other, no speaker: two things side by side (about 3 %).
 */
export const layouts = {
  split: { label: 'Split', presenter: 'split', slots: { top: true, title: true, seam: true } },
  face: { label: 'Face', presenter: 'face', slots: { word: true, seam: true } },
  full: { label: 'Full footage', presenter: 'none', slots: { picture: true, title: true, seam: true } },
  stack: { label: 'Stacked footage', presenter: 'none', slots: { top: true, bottom: true, seam: true } },
};
