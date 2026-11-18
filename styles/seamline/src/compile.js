// Turns the resolved document (scenes with their picked options) into one composition: the presenter, the
// footage panels, the headline, the big word, the captions and the brand mark.
//
// How things change (research/motion.md M01-M03; structure.md S13-S15, S23):
//   every change is a hard cut, complete on its first frame: layouts, footage, captions, titles. No dissolve, wipe,
//   slide, flash or dip to black anywhere [M01-M03, S23]
//   a layout change lands on the first word of a sentence, or one frame before it [S13, S14]
//   inside a layout, footage changes on the word that names or shows the next thing (cut beats) [S15, G06]
// A "run" is consecutive scenes in one layout: the presenter's framing belongs to the run (the face push-in spans
// it). An "item" is one element in one slot; it continues into the next scene while the slot keeps the same key
// and type (the headline holds through the top panel's cuts and leaves at the next layout change [H12]).
import { W, H, F, layout, audio as audioTokens } from './tokens.js';
import { buildPresenter } from './presenter.js';
import { buildCaptions } from './captions.js';
import { byType, layouts } from './elements/index.js';
import { setStyle, full } from './common.js';

function makeContext(doc, env) {
  let n = 0;
  const warnings = [];
  return {
    doc, env, kit: env.kit, uid: () => ++n,
    wordTime: (i) => (doc.words[i] ? doc.words[i].start : 0),
    warn: (m) => { if (!warnings.includes(m)) { warnings.push(m); console.warn(`[seamline] ${m}`); } },
    warnings,
  };
}

const PRESENTER = { split: 'split', face: 'face', full: 'none', stack: 'none' };
const seam = layout.seam;
const BOX = {
  top: { x: 0, y: 0, w: W, h: seam },
  bottom: { x: 0, y: seam, w: W, h: H - seam },
  picture: { x: 0, y: 0, w: W, h: H },
  title: { x: 0, y: 0, w: W, h: H },
  word: { x: 0, y: 0, w: W, h: H },
  seam: { x: 0, y: 0, w: W, h: H },
};
// what sits over what, bottom to top: the presenter, then these
const LAYER = { top: 0, bottom: 0, picture: 0, title: 1, word: 2, seam: 4 };

export async function buildComposition(doc, env, root) {
  const S = makeContext(doc, env);
  const { kit } = S; const { h } = kit;
  const scenes = doc.scenes;
  const layoutOf = (sc) => (layouts[sc.option?.layout] ? sc.option.layout : 'split');
  if (layoutOf(scenes[0]) !== 'split' && layoutOf(scenes[0]) !== 'face') S.warn('the reference opens on the split in 26 of 30 videos [S11, H01]');

  // ---- runs and items
  const runs = [];
  for (const sc of scenes) {
    const lay = layoutOf(sc);
    const last = runs[runs.length - 1];
    if (last && last.layout === lay) { last.tOut = sc.end; last.scenes.push(sc); } else runs.push({ layout: lay, tIn: sc.start, tOut: sc.end, scenes: [sc] });
  }
  const items = [];
  for (const run of runs) {
    const open = {};
    for (const sc of run.scenes) {
      const slots = sc.option?.slots || {};
      for (const slot of Object.keys(slots)) if (!layouts[run.layout].slots[slot]) S.warn(`slot "${slot}" is not in the ${run.layout} layout (${sc.id})`);
      for (const slot of Object.keys(layouts[run.layout].slots)) {
        const spec = slots[slot];
        const prev = open[slot];
        if (spec && prev && spec.key !== undefined && prev.spec.key === spec.key && prev.spec.type === spec.type) {
          prev.tOut = sc.end; prev.raw.push(...(spec.beats || []).map((b) => ({ b, sc })));
          continue;
        }
        open[slot] = null;
        if (!spec) continue;
        const def = byType[spec.type];
        if (!def) { S.warn(`unknown element "${spec.type}" in ${sc.id}`); continue; }
        const it = { run, slot, spec, def, tIn: sc.start, tOut: sc.end, scene: sc, raw: (spec.beats || []).map((b) => ({ b, sc })) };
        open[slot] = it; items.push(it);
      }
    }
  }
  await Promise.all(items.map(async (it) => { it.data = it.def.prepare ? await it.def.prepare(it.spec, S, it.raw.map((r) => r.b)) : null; }));

  // ---- layers
  const presenter = buildPresenter(S);
  const layers = [0, 1, 2, 3, 4].map((k) => h(`div.sl-layer-${k}`, { style: full({ pointerEvents: 'none' }) }));
  const beatTime = (b, sc) => (typeof b.at === 'number' ? S.wordTime(b.at) : typeof b.at?.t === 'number' ? b.at.t : sc.start + (b.at?.rel ?? 0));
  const blocks = [];
  for (const it of items) {
    const box = BOX[it.slot];
    const beats = it.raw.map(({ b, sc }) => ({ ...b, t: beatTime(b, sc) })).sort((a, b) => a.t - b.t);
    it.built = it.def.build({ S, params: it.spec, layout: it.run.layout, slot: it.slot, box, tIn: it.tIn, tOut: it.tOut, beats, data: it.data, scene: it.scene });
    if (it.built.hideCaptions) blocks.push(...it.built.hideCaptions);
    it.wrap = h('div', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px`, overflow: 'hidden', display: 'none' } }, it.built.el);
    it.on = false;
    layers[LAYER[it.slot] ?? 0].append(it.wrap);
  }
  const captions = buildCaptions(S, blocks);
  layers[3].append(captions.el);
  root.append(presenter.el, ...layers);

  const runAt = (t) => runs.find((r) => t >= r.tIn && t < r.tOut) || (t < runs[0].tIn ? runs[0] : runs[runs.length - 1]);
  const seek = (t) => {
    const run = runAt(t);
    presenter.seek(PRESENTER[run.layout], (t - run.tIn) / Math.max(1e-3, run.tOut - run.tIn));
    for (const it of items) {
      const on = it.run === run && t >= it.tIn && t < it.tOut;
      if (it.on !== on) { setStyle(it.wrap, 'display', on ? '' : 'none'); if (!on) it.built.seek(t, false); it.on = on; }
      if (on) it.built.seek(t, true);
    }
    captions.seek(t);
  };

  return {
    seek, warnings: S.warnings,
    // the only effect: a low swell from frame 0, in about a third of the reference videos [A22]
    audio: doc.look?.opening === 'swell' ? [{ t: 0, sfx: 'swell', gainDb: audioTokens.swellDb }] : [],
    settled: () => Promise.all(items.filter((it) => it.on && it.built.settled).map((it) => it.built.settled())),
    posterTime(id) {
      const sc = scenes.find((s) => s.id === id);
      if (!sc) return null;
      const span = sc.end - sc.start;
      return sc.start + Math.min(span * 0.5, Math.max(F(8), span - F(3)));
    },
  };
}
