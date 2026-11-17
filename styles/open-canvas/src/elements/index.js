// Every element the style can draw. To add one: write src/elements/<type>.js (default export
// { type, label, slots, params, beats, prepare?, build }), add its file name to NAMES,
// then run `node styles/open-canvas/build-manifest.mjs`.
//
// Elements load one by one so that a missing or broken element is reported and skipped
// instead of taking the whole style down.
const NAMES = ['capture', 'hook-title', 'comment-cta', 'transfer', 'app-lock'];

const loaded = await Promise.all(NAMES.map(async (name) => {
  try {
    const mod = await import(`./${name}.js`);
    return mod.default;
  } catch (e) {
    const missing = /Cannot find module|Failed to fetch|ERR_MODULE_NOT_FOUND|404/.test(String(e && (e.code || e.message)));
    if (!missing) console.warn(`[open-canvas] element "${name}" failed to load: ${e && e.message}`);
    return null;
  }
}));

export const elements = loaded.filter(Boolean);
export const byType = Object.fromEntries(elements.map((e) => [e.type, e]));

/**
 * The six layouts and the slots each one offers (research/layout.md L01-L07).
 *   desk     the default: a capture in a window on the drafting ground, the speaker cut out below. Claim and proof.
 *   full     no speaker: one window, larger. "This is the thing."
 *   hero     one screen huge, its bottom melting to dark. A screen being used.
 *   behind   the screen fills the top behind the speaker. Lists of uses, one clip per item.
 *   graphic  one built object on a soft ground, no speaker. An idea no capture shows.
 *   face     the raw footage punched in, no furniture. Opinion, story, and always the closing ask.
 */
export const layouts = {
  desk: { label: 'Desk', presenter: 'cutout', slots: { window: true, title: true } },
  full: { label: 'Full window', presenter: 'none', slots: { window: true } },
  hero: { label: 'Hero screen', presenter: 'none', slots: { screen: true } },
  behind: { label: 'Screen behind', presenter: 'cutout', slots: { screen: true } },
  graphic: { label: 'Built object', presenter: 'none', slots: { object: true } },
  face: { label: 'Face', presenter: 'full', slots: { cta: true } },
};
