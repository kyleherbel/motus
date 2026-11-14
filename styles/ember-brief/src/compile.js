// Turns the resolved document (scenes with their picked options) into one composition:
// the field, the presenter panel, element instances with their lifetimes, and the captions.
//
// How things change (research/motion.md, layout.md, structure.md):
//   a graphic arrives               through the blur entrance, starting on the scene's first word [M03, M04, S13]
//   a graphic leaves                through the blur exit; the next one starts on the same frame [M05, M06]
//   split <-> full                  an animated reflow, never a cut: the presenter panel slides 960 px and the
//                                   caption glides 520 px on one curve while the graphics swap [M07, M08, L21]
//   a section heading               stays in place across graphics and layout changes of its section [M23, S24]
//   the last element                holds to the last frame: no exit, no outro [H27, S08]
// There are no sound events: the style has no effects, and the bed is the engine's music track [A22, A26].
import { W, H, motion, curves } from './tokens.js';
import { buildField } from './field.js';
import { buildPresenter } from './presenter.js';
import { buildCaptions } from './captions.js';
import { byType, layouts } from './elements/index.js';
import { enterAt, exitAt, applyState, expoInOut } from './common.js';

function makeContext(doc, env) {
  let n = 0;
  const warnings = [];
  const kit = env.kit;
  const S = {
    doc, env, kit, uid: () => ++n,
    E: Object.fromEntries(Object.entries(curves).map(([k, v]) => [k, kit.cubicBezier(...v)])),
    wordTime: (i) => (doc.words[i] ? doc.words[i].start : 0),
    wordEnd: (i) => (doc.words[i] ? doc.words[i].end : 0),
    warn: (m) => { if (!warnings.includes(m)) { warnings.push(m); console.warn(`[ember-brief] ${m}`); } },
    warnings,
  };
  return S;
}

const full = (x) => ({ position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, ...x });

export async function buildComposition(doc, env, root) {
  const S = makeContext(doc, env);
  const { kit } = S; const { h } = kit;
  const scenes = doc.scenes;
  const modeOf = (sc) => (layouts[sc.option.layout] ? sc.option.layout : 'split');

  // ---- layout runs
  const runs = [];
  for (const sc of scenes) {
    const last = runs[runs.length - 1];
    if (last && last.mode === modeOf(sc)) { last.end = sc.end; last.scenes.push(sc); }
    else runs.push({ mode: modeOf(sc), start: sc.start, end: sc.end, scenes: [sc] });
  }
  const runAt = (t) => runs.find((r) => t >= r.start && t < r.end) || (t < runs[0].start ? runs[0] : runs[runs.length - 1]);
  if (runs[0].mode !== 'split' || runs[runs.length - 1].mode !== 'split') S.warn('the reference opens and closes every video in the split layout');

  // ---- element instances: one per (slot, key) stretch of consecutive scenes. A graphic is re-made when the
  // layout changes (its slot moves); a heading stays through layout changes.
  const instances = [];
  const open = {};
  const sameKey = (a, b) => a && b && a.type === b.type && b.key !== undefined && a.key === b.key;
  scenes.forEach((sc, k) => {
    const prev = scenes[k - 1];
    const slots = sc.option.slots || {};
    for (const slot of Object.keys(layouts[modeOf(sc)].slots)) {
      const spec = slots[slot];
      const cur = open[slot];
      const sameRun = slot === 'heading' || (prev && modeOf(prev) === modeOf(sc));
      if (spec && cur && sameKey(cur.spec, spec) && cur.tOut === sc.start && sameRun) {
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

  // ---- layers, bottom to top: field colour, pictures that sit under the dots, the dots, presenter,
  // graphics, headings, captions [P05, H05]
  const field = buildField(S);
  const presenter = buildPresenter(S);
  const captions = buildCaptions(S);
  const under = h('div.eb-under', { style: full({}) });
  const graphics = h('div.eb-graphics', { style: full({}) });
  const headings = h('div.eb-headings', { style: full({}) });
  root.append(field.base, under, field.dots, presenter.el, graphics, headings, captions.el);

  const beatTime = (b, sc) => (typeof b.at === 'number' ? S.wordTime(b.at) : typeof b.at?.t === 'number' ? b.at.t : sc.start + (b.at?.rel ?? 0));
  const headingAt = (t) => instances.some((x) => x.slot === 'heading' && t >= x.tIn && t < x.tOut);
  const lastEnd = scenes[scenes.length - 1].end;
  for (const it of instances) {
    it.beats = it.rawBeats.map(({ b, sc }) => ({ ...b, t: beatTime(b, sc) })).sort((a, b) => a.t - b.t);
    it.last = it.tOut >= lastEnd - 1e-6;
    it.headed = it.slot !== 'heading' && headingAt(it.tIn + 1e-6);
    it.underEl = h('div', { style: full({ display: 'none' }) });
    it.built = it.def.build({ S, params: it.spec, mode: it.mode, slot: it.slot, tIn: it.tIn, tOut: it.tOut, beats: it.beats, data: it.data, scene: it.scene, headed: it.headed, last: it.last, under: it.underEl });
    const box = it.built.box || { x: 40, y: 0, w: 1000, h: 880 };
    it.origin = `${(box.x + box.w / 2).toFixed(1)}px ${(box.y + box.h / 2).toFixed(1)}px`;
    it.wrap = h(`div.eb-inst.eb-${it.slot}`, { style: full({ display: 'none' }) }, it.built.el);
    (it.slot === 'heading' ? headings : graphics).append(it.wrap);
    if (it.underEl.childNodes.length) under.append(it.underEl);
  }

  // ---- the layout change: 0 = split, 1 = full [M07, L21]
  const R = motion.reflow;
  const val = (mode) => (mode === 'full' ? 1 : 0);
  const reflow = (t) => {
    const run = runAt(t);
    const k = runs.indexOf(run);
    const to = val(run.mode);
    if (k === 0) return { p: to, u: 1 };
    const from = val(runs[k - 1].mode);
    const u = kit.clamp((t - run.start) / R.dur);
    return { p: from + (to - from) * expoInOut(u), u };
  };

  const seek = (t) => {
    field.seek(t);
    const { p, u } = reflow(t);
    presenter.seek(p, u);
    let hidden = false;
    for (const it of instances) {
      const until = it.last ? Infinity : it.tOut + motion.exit.dur;
      const on = t >= it.tIn && t < until;
      if (it.on !== on) { it.wrap.style.display = on ? '' : 'none'; it.underEl.style.display = on ? '' : 'none'; it.on = on; }
      if (!on) continue;
      if (it.def.hidesCaptions && t < it.tOut) hidden = true;
      // elements that build themselves part by part skip the shared entrance; every element shares the exit
      const a = it.def.ownEntrance ? { o: 1, blur: 0, dy: 0, s: 1 } : enterAt(S, t - it.tIn - (it.def.delay || 0), it.def.enter);
      const x = t >= it.tOut && !it.last ? exitAt(S, t - it.tOut) : null;
      const st = x ? { o: a.o * x.o, blur: Math.max(a.blur, x.blur), dy: a.dy + x.dy, s: a.s } : a;
      applyState(it.wrap, st, it.origin);
      if (it.underEl.parentNode) applyState(it.underEl, x ? { o: x.o, blur: x.blur, dy: x.dy, s: 1 } : { o: 1, blur: 0, dy: 0, s: 1 });
      it.built.seek(t);
    }
    captions.seek(t, p, hidden);
  };

  return {
    seek, audio: [], warnings: S.warnings,
    /** Resolves when everything drawn by the last seek is really on screen (elements that show video frames need a moment). */
    settled: () => Promise.all(instances.filter((it) => it.on && it.built.settled).map((it) => it.built.settled())),
    posterTime(id) {
      const sc = scenes.find((s) => s.id === id);
      if (!sc) return null;
      const span = sc.end - sc.start;
      return sc.start + Math.max(Math.min(span - F3, span * 0.8), Math.min(span * 0.5, 0.4));
    },
  };
}
const F3 = 0.1;
