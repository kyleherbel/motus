// Every element the style can draw. To add one: write src/elements/<type>.js (default export
// { type, label, slots, layouts?, params, beats, prepare?, build }), add its file name to NAMES,
// then run `node styles/ember-brief/build-manifest.mjs`.
//
// Elements load one by one so that a missing or broken element is reported and skipped
// instead of taking the whole style down.
const NAMES = [
  'hook-title', 'comment-cta', 'section-heading',
  'capture-card', 'big-figure',
  'ui-card', 'prompt-box', 'chat-card',
  'chips', 'logo-tiles', 'icon-grid',
  'picture', 'before-after', 'phone-frame',
  'link', 'process', 'versus', 'item-cards', 'player',
  'hub', 'task-card',
];

const loaded = await Promise.all(NAMES.map(async (name) => {
  try {
    const mod = await import(`./${name}.js`);
    return mod.default;
  } catch (e) {
    const missing = /Cannot find module|Failed to fetch|ERR_MODULE_NOT_FOUND|404/.test(String(e && (e.code || e.message)));
    if (!missing) console.warn(`[ember-brief] element "${name}" failed to load: ${e && e.message}`);
    return null;
  }
}));

export const elements = loaded.filter(Boolean);
export const byType = Object.fromEntries(elements.map((e) => [e.type, e]));

/**
 * The two layouts and the slots each one offers (research/layout.md L01, L02; presenter.md P01).
 *   split  the field in the top half, the presenter in the bottom half. Every video opens and closes here.
 *   full   the field fills the frame and the presenter is off screen: for a graphic taller than 880 px [L13].
 * 'graphic' holds the one graphic on screen (the opening title and the call to action are graphics that only
 * exist in split); 'heading' holds the numbered section heading of a list video.
 */
export const layouts = {
  split: { label: 'Split', presenter: 'panel', slots: { graphic: true, heading: true } },
  full: { label: 'Full graphic', presenter: 'none', slots: { graphic: true, heading: true } },
};
