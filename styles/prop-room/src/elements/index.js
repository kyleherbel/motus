// Every element the style can draw. To add one: write src/elements/<type>.js (default export
// { type, label, slots, layouts?, params, beats, prepare?, build }), add its file name to NAMES,
// then run `node styles/prop-room/build-manifest.mjs`.
//
// Elements load one by one so that a missing or broken element is reported and skipped
// instead of taking the whole style down.
import { PLATES } from '../plate.js';

const NAMES = [
  'comment-keyword',
  // pictures and figures (research/explain.md X01-X29)
  'counter', 'big-number', 'value-bar', 'item-set', 'name-reveal', 'stamp', 'prop', 'route',
  // interfaces and text cards (research/explain.md X51-X78)
  'window', 'prompt', 'picker', 'item-stack', 'before-after', 'file-drop', 'capture', 'code-window', 'checklist', 'key-caps', 'title-card',
];

const loaded = await Promise.all(NAMES.map(async (name) => {
  try {
    const mod = await import(`./${name}.js`);
    return mod.default;
  } catch (e) {
    const missing = /Cannot find module|Failed to fetch|ERR_MODULE_NOT_FOUND|404/.test(String(e && (e.code || e.message)));
    if (!missing) console.warn(`[prop-room] element "${name}" failed to load: ${e && e.message}`);
    return null;
  }
}));

/**
 * Every graphic sits on a plate chosen for it, not for the layout [C04, C13, G27]. The plate is declared once
 * here and added to every element that fills the graphic slot.
 */
export const plateParams = {
  plate: `enum?:${PLATES.join('|')}`,
  field: { type: 'string', optional: true, maxChars: 7 },   // a #RRGGBB colour for plate "field" [C11]
};

export const elements = loaded.filter(Boolean).map((e) => (e.slots.includes('graphic') ? { ...e, params: { ...(e.params || {}), ...plateParams } } : e));
export const byType = Object.fromEntries(elements.map((e) => [e.type, e]));

/**
 * The three layouts and the slots each one offers (research/layout.md L01, L12, L13; presenter.md P01).
 *   split    the graphic in the panel y 0-960 over the speaker. Every video opens here [L04, S02].
 *   full     the graphic fills the frame and the speaker is off screen.
 *   speaker  the speaker full height: short beats mid-video, and the close, where the keyword sits [S12-S15].
 */
export const layouts = {
  split: { label: 'Split', presenter: 'panel', slots: { graphic: true } },
  full: { label: 'Full picture', presenter: 'none', slots: { graphic: true } },
  speaker: { label: 'Speaker', presenter: 'full', slots: { keyword: true } },
};
