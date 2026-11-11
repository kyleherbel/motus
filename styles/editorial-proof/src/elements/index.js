// Every element the style can draw. To add one: write src/elements/<type>.js (default export
// { type, label, slots, params, beats, prepare?, prefer?, build }), add its file name to NAMES,
// then run `node styles/editorial-proof/build-manifest.mjs`.
//
// Elements load one by one so that a missing or broken element is reported and skipped
// instead of taking the whole style down.
const NAMES = [
  'hook-title', 'source-card', 'price-list', 'logo-chips', 'section-heading', 'name-label', 'comment-cta',
  'compare-panels', 'terminal', 'steps-card', 'text-card', 'media-card', 'logo-card', 'big-number', 'rank-list', 'logo-grid',
];

const loaded = await Promise.all(NAMES.map(async (name) => {
  try {
    const mod = await import(`./${name}.js`);
    return mod.default;
  } catch (e) {
    const missing = /Cannot find module|Failed to fetch|ERR_MODULE_NOT_FOUND|404/.test(String(e && (e.code || e.message)));
    if (!missing) console.warn(`[editorial-proof] element "${name}" failed to load: ${e && e.message}`);
    return null;
  }
}));

export const elements = loaded.filter(Boolean);
export const byType = Object.fromEntries(elements.map((e) => [e.type, e]));

/** Layouts and the slots each one offers. Elements declare which slot kinds they fill. */
export const layouts = {
  'light-split': { label: 'Split', presenter: 'panel', slots: ['title', 'card', 'chips'] },
  'dark-focus': { label: 'Dark focus', presenter: 'hidden', slots: ['card', 'chips'] },
  white: { label: 'White', presenter: 'hidden', slots: ['heading', 'card', 'name', 'chips'] },
  'presenter-full': { label: 'Presenter', presenter: 'full', slots: ['cta'] },
};
