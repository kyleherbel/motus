// Every element the style can draw. To add one: write src/elements/<type>.js (default export
// { type, label, slots, params, beats, prepare?, prefer?, build }), add its file name to NAMES,
// then run `node styles/night-class/build-manifest.mjs`.
//
// Elements load one by one so that a missing or broken element is reported and skipped
// instead of taking the whole style down.
const NAMES = [
  'title-lockup', 'cta-lockup',
  'step-rows', 'doc-card', 'capture', 'phone', 'metric-card', 'tier-bars', 'data-table', 'quote-card', 'compare',
  'line-chart', 'icon-nodes', 'statement', 'cta-pages',
  'push-in', 'keyword-caption',
];

const loaded = await Promise.all(NAMES.map(async (name) => {
  try {
    const mod = await import(`./${name}.js`);
    return mod.default;
  } catch (e) {
    const missing = /Cannot find module|Failed to fetch|ERR_MODULE_NOT_FOUND|404/.test(String(e && (e.code || e.message)));
    if (!missing) console.warn(`[night-class] element "${name}" failed to load: ${e && e.message}`);
    return null;
  }
}));

export const elements = loaded.filter(Boolean);
export const byType = Object.fromEntries(elements.map((e) => [e.type, e]));

/**
 * Layouts and the slots each one offers (research/layout.md L01, L21). The split layout comes with
 * a dark field (the default) or a light one; the full-height presenter carries only captions,
 * an optional push-in and the closing keyword.
 */
export const layouts = {
  dark: { label: 'Panel', presenter: 'panel', slots: ['title', 'graphic', 'side'] },
  light: { label: 'Panel, light', presenter: 'panel', slots: ['title', 'graphic', 'side'] },
  full: { label: 'Presenter', presenter: 'full', slots: ['camera', 'keyword'] },
};
