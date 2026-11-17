// Turns the resolved document (scenes with their picked options) into one composition:
// plates, graphics, the presenter, captions and the closing keyword.
//
// How things change (research/layout.md, motion.md, structure.md):
//   every layout change and every new graphic   a hard cut on one frame, on the word onset that opens the scene,
//                                                on the same frame as a new caption group [L02, M01-M03, S07, S08]
//   a graphic arrives                           still arriving on its cut frame: its content scales from 0.85 to 1
//                                                on easeOutExpo over 15 frames, 0.88 on the cut frame [M05, M06; V]
//   a held graphic                              then pushes in at a constant 0.6 % per second, on 2 of 3 holds [M19; V]
//   a graphic leaves                            by the next cut: no exit animation [M28]
//   the plate                                   belongs to the graphic, is not scaled and never moves [C03, C13; V]
//   a split graphic                             is clipped at the seam: nothing crosses onto the speaker [G26, L09]
// Every instance keeps the same identity across consecutive scenes when its key and layout repeat: it stays on
// screen and only its beats advance.
import { W, H, F, motion, curves, layout } from './tokens.js';
import { buildPresenter } from './presenter.js';
import { buildCaptions } from './captions.js';
import { plateBackground } from './plate.js';
import { byType, layouts } from './elements/index.js';
import { setStyle, unit } from './common.js';
import { soundEvents } from './sound.js';

function makeContext(doc, env) {
  let n = 0;
  const warnings = [];
  const kit = env.kit;
  return {
    doc, env, kit, uid: () => ++n,
    E: Object.fromEntries(Object.entries(curves).map(([k, v]) => [k, kit.cubicBezier(...v)])),
    wordTime: (i) => (doc.words[i] ? doc.words[i].start : 0),
    wordEnd: (i) => (doc.words[i] ? doc.words[i].end : 0),
    warn: (m) => { if (!warnings.includes(m)) { warnings.push(m); console.warn(`[prop-room] ${m}`); } },
    warnings,
  };
}

const full = (x) => ({ position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, ...x });
const PRESENTER = { split: 'split', full: 'none', speaker: 'solo' };

export async function buildComposition(doc, env, root) {
  const S = makeContext(doc, env);
  const { kit } = S; const { h } = kit;
  const scenes = doc.scenes;
  const modeOf = (sc) => (layouts[sc.option?.layout] ? sc.option.layout : 'split');
  if (modeOf(scenes[0]) !== 'split') S.warn('every reference video opens on the split layout [L04, S02]');
  if (modeOf(scenes[scenes.length - 1]) !== 'speaker') S.warn('every reference video closes on the speaker layout with the keyword [S14]');

  // ---- element instances: one per (slot, key) stretch of consecutive scenes in the same layout
  const instances = [];
  const open = {};
  const sameKey = (a, b) => a && b && a.type === b.type && b.key !== undefined && a.key === b.key;
  scenes.forEach((sc, k) => {
    const prev = scenes[k - 1];
    const slots = sc.option?.slots || {};
    for (const slot of Object.keys(layouts[modeOf(sc)].slots)) {
      const spec = slots[slot];
      const cur = open[slot];
      if (spec && cur && sameKey(cur.spec, spec) && cur.tOut === sc.start && prev && modeOf(prev) === modeOf(sc)) {
        cur.tOut = sc.end; cur.scenes.push(sc); cur.rawBeats.push(...(spec.beats || []).map((b) => ({ b, sc })));
        continue;
      }
      delete open[slot];
      if (!spec) continue;
      const def = byType[spec.type];
      if (!def) { S.warn(`unknown element "${spec.type}" in ${sc.id}`); continue; }
      if (def.layouts && !def.layouts.includes(modeOf(sc))) S.warn(`${spec.type} belongs in the ${def.layouts.join(' or ')} layout (${sc.id})`);
      const inst = { slot, spec, def, scene: sc, scenes: [sc], mode: modeOf(sc), tIn: sc.start, tOut: sc.end, rawBeats: (spec.beats || []).map((b) => ({ b, sc })) };
      instances.push(inst); open[slot] = inst;
    }
    for (const slot of Object.keys(open)) if (!slots[slot]) delete open[slot];
  });

  await Promise.all(instances.map(async (it) => { it.data = it.def.prepare ? await it.def.prepare(it.spec, S) : null; }));

  // ---- layers, bottom to top: graphics (each on its own plate), presenter, captions, keyword
  const presenter = buildPresenter(S);
  const sceneStarts = new Map(scenes.map((sc) => [sc.words?.[0], sc.start]).filter(([w]) => w != null));
  const captions = buildCaptions(S, sceneStarts);
  const graphics = h('div.pr-graphics', { style: full({}) });
  const keywords = h('div.pr-keywords', { style: full({}) });
  root.append(graphics, presenter.el, captions.el, keywords);

  const beatTime = (b, sc) => (typeof b.at === 'number' ? S.wordTime(b.at) : typeof b.at?.t === 'number' ? b.at.t : sc.start + (b.at?.rel ?? 0));
  const M = motion.scene, PU = motion.push;
  for (const it of instances) {
    it.beats = it.rawBeats.map(({ b, sc }) => ({ ...b, t: beatTime(b, sc) })).sort((a, b) => a.t - b.t);
    it.seed = `${it.spec.key ?? ''}/${it.scene.id}/${it.slot}`;
    const area = it.mode === 'split' ? { w: W, h: layout.seam } : { w: W, h: H };
    it.built = it.def.build({ S, params: it.spec, mode: it.mode, slot: it.slot, tIn: it.tIn, tOut: it.tOut, beats: it.beats, data: it.data, scene: it.scene, seed: it.seed });
    const box = it.built.box || { x: 0, y: 0, w: area.w, h: area.h };
    if (it.slot === 'keyword') {
      it.wrap = h('div.pr-inst', { style: full({ display: 'none' }) }, it.built.el);
      keywords.append(it.wrap);
      continue;
    }
    // a split graphic is clipped at the seam; its plate fills the panel [L05, L07, G26]
    it.content = h('div.pr-content', { style: full({ transformOrigin: `${(box.x + box.w / 2).toFixed(1)}px ${(box.y + box.h / 2).toFixed(1)}px` }) }, it.built.el);
    const plate = h('div.pr-plate', { style: { position: 'absolute', left: '0', top: '0', width: `${area.w}px`, height: `${area.h}px`,
      background: plateBackground(S, it.spec.plate || 'pale', { w: area.w, h: area.h, seed: it.seed, field: it.spec.field }) } });
    const clip = h('div.pr-clip', { style: { position: 'absolute', left: '0', top: '0', width: `${area.w}px`, height: `${area.h}px`, overflow: 'hidden' } }, plate, it.content);
    it.wrap = h(`div.pr-inst.pr-${it.mode}`, { style: full({ display: 'none' }) }, clip);
    graphics.append(it.wrap);
    it.pushes = !it.built.still && unit(S, it.seed + '/push') < PU.share;
  }

  // sound events on the output timeline: sparse effects and textures that last a prop's action (research/audio.md)
  const audio = soundEvents(S, scenes, instances);

  const sceneAt = (t) => scenes.find((s) => t >= s.start && t < s.end) || (t < scenes[0].start ? scenes[0] : scenes[scenes.length - 1]);

  const seek = (t) => {
    const sc = sceneAt(t);
    const mode = modeOf(sc);
    presenter.seek(PRESENTER[mode]);
    for (const it of instances) {
      const on = t >= it.tIn && (t < it.tOut || (it.slot === 'keyword' && t >= it.tIn));
      if (it.on !== on) { it.wrap.style.display = on ? '' : 'none'; it.on = on; }
      if (!on) continue;
      if (it.content && !it.def.ownEntrance) {
        const a = t - it.tIn;
        const enter = M.from + (1 - M.from) * S.E.out(Math.min(1, Math.max(0, (a + M.lead) / M.dur)));
        const push = it.pushes && a > PU.after ? 1 + PU.ratePerS * (a - PU.after) : 1;
        const s = enter * push;
        setStyle(it.content, 'transform', Math.abs(s - 1) > 0.0002 ? `scale(${s.toFixed(5)})` : '');
      }
      it.built.seek(t);
    }
    captions.seek(t, mode === 'split' ? 'split' : 'low');
  };

  return {
    seek, audio, warnings: S.warnings,
    settled: () => Promise.all(instances.filter((it) => it.on && it.built.settled).map((it) => it.built.settled())),
    posterTime(id) {
      const sc = scenes.find((s) => s.id === id);
      if (!sc) return null;
      const span = sc.end - sc.start;
      return sc.start + Math.max(Math.min(span - F(3), span * 0.85), Math.min(span * 0.5, F(15)));
    },
  };
}
