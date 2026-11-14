// Turns the resolved document (scenes with their picked options) into one composition:
// the field, the presenter, element instances with their lifetimes, captions and sound events.
//
// How things change (research/motion.md, layout.md, structure.md):
//   panel <-> full-height presenter     a hard cut on one frame, never animated [L18, M01, S06]
//   dark field <-> light field          a hard cut, usually behind a full-height cut-in [L22, M02]
//   a new graphic in the same panel run the outgoing and incoming graphic move left together as
//                                       one strip (or the new one makes its own entrance) [M13]
//   a graphic arriving with a cut       starts its own entrance on the cut frame [M25]
//   a title kept across a cut-in        is back complete on the first frame; a new one builds [M09]
import { W, H, CX, F, layout, motion, curves, kits, sound, soundSpacing, bed } from './tokens.js';
import { buildField } from './field.js';
import { buildPresenter } from './presenter.js';
import { buildCaptions } from './captions.js';
import { byType, layouts } from './elements/index.js';

const PANEL = new Set(['dark', 'light']);

function makeContext(doc, env) {
  let n = 0;
  const audio = [];
  const warnings = [];
  const kit = env.kit;
  const kitId = kits[doc.look?.kit] ? doc.look.kit : 'k1';
  const S = {
    doc, env, kit, kitId, uid: () => ++n,
    E: Object.fromEntries(Object.entries(curves).map(([k, v]) => [k, kit.cubicBezier(...v)])),
    wordTime: (i) => (doc.words[i] ? doc.words[i].start : 0),
    /** A sound event: `key` names a class in tokens.sound; the event is placed so the class's lead lands on t. */
    sfx: (t, key, gainOffset = 0) => {
      const s = sound[key]; if (!s) return;
      const at = t - (s.lead || 0);
      if (at > -0.05 && at < doc.duration) audio.push({ t: Math.max(0, at), sfx: key, gainDb: s.gainDb + gainOffset, key });
    },
    /** A sound by role in this video's kit: 'graphic' | 'cut' | 'transition' | 'tick'. */
    kitSfx: (t, role) => { const key = kits[kitId][role]; if (key) S.sfx(t, key); },
    warn: (m) => { if (!warnings.includes(m)) { warnings.push(m); console.warn(`[night-class] ${m}`); } },
    audio, warnings,
  };
  return S;
}

export async function buildComposition(doc, env, root) {
  const S = makeContext(doc, env);
  const { kit } = S; const { h } = kit;
  const scenes = doc.scenes;
  const sceneAt = (t) => scenes.find((s) => t >= s.start && t < s.end) || (t < scenes[0].start ? scenes[0] : scenes[scenes.length - 1]);
  const modeOf = (sc) => sc.option.layout;

  // ---- layout runs
  const runs = [];
  for (const sc of scenes) {
    const last = runs[runs.length - 1];
    if (last && last.mode === modeOf(sc)) { last.end = sc.end; last.scenes.push(sc); }
    else runs.push({ mode: modeOf(sc), start: sc.start, end: sc.end, scenes: [sc], k: runs.length });
  }
  const runAt = (t) => runs.find((r) => t >= r.start && t < r.end) || (t < runs[0].start ? runs[0] : runs[runs.length - 1]);

  // ---- element instances: one per (slot, key) stretch of consecutive scenes
  const instances = [];
  const open = {}, lastIn = {};
  scenes.forEach((sc, k) => {
    const prev = scenes[k - 1];
    const slots = sc.option.slots || {};
    for (const slot of layouts[modeOf(sc)]?.slots || []) {
      const spec = slots[slot];
      const cur = open[slot];
      const sameKey = (a, b) => a && b && a.type === b.type && b.key !== undefined && a.key === b.key;
      if (spec && cur && sameKey(cur.spec, spec) && cur.tOut === sc.start && modeOf(prev) === modeOf(sc)) {
        cur.tOut = sc.end; cur.scenes.push(sc); cur.rawBeats.push(...(spec.beats || []).map((b) => ({ b, sc })));
        continue;
      }
      if (cur) delete open[slot];
      if (!spec) continue;
      const def = byType[spec.type];
      if (!def) { S.warn(`unknown element "${spec.type}" in ${sc.id}`); continue; }
      const before = lastIn[slot];
      const inst = {
        slot, spec, def, scene: sc, scenes: [sc], mode: modeOf(sc), tIn: sc.start, tOut: sc.end,
        rawBeats: (spec.beats || []).map((b) => ({ b, sc })),
        modeCut: !prev || modeOf(prev) !== modeOf(sc),
        // the same element (same key) comes back after something else was on screen: it returns as it was
        returning: !!before && sameKey(before.spec, spec),
        replaces: before && before.tOut === sc.start && modeOf(prev) === modeOf(sc) ? before : null,
      };
      instances.push(inst); open[slot] = inst; lastIn[slot] = inst;
    }
    for (const slot of Object.keys(open)) if (!slots[slot] || open[slot].tOut !== sc.end) delete open[slot];
  });

  await Promise.all(instances.map(async (it) => { it.data = it.def.prepare ? await it.def.prepare(it.spec, S) : null; }));

  // ---- one group per run, so a cut shows or hides a whole layout at once
  const graphics = h('div.nc-graphics', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px` } });
  const titles = h('div.nc-titles', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px` } });
  for (const r of runs) {
    r.groupG = h(`div.nc-run.nc-run-${r.mode}`, { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, display: 'none' } });
    r.groupT = h(`div.nc-run-titles`, { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, display: 'none' } });
    graphics.append(r.groupG); titles.append(r.groupT);
  }

  const beatTime = (b, sc) => (typeof b.at === 'number' ? S.wordTime(b.at) : typeof b.at?.t === 'number' ? b.at.t : sc.start + (b.at?.rel ?? 0));
  for (const it of instances) {
    it.beats = it.rawBeats.map(({ b, sc }) => ({ ...b, t: beatTime(b, sc) })).sort((a, b) => a.t - b.t);
    it.run = runAt(it.tIn + 1e-6);
    // how a graphic arrives: with its own entrance on a cut or at the start, else pushed in as a strip
    const want = it.spec.enter;
    it.enter = it.slot !== 'graphic' ? 'own'
      : want === 'cut' ? 'cut'
        : it.replaces && !it.modeCut ? (want === 'own' || want === 'zoom' ? want : 'push')
          : 'own';
    if (it.enter === 'push') it.replaces.pushOutAt = it.tIn;
    if (it.enter === 'zoom') it.replaces.zoomOutAt = it.tIn;
    // a second graphic in the side slot sits to the right; the main graphic moves left to make room [G07 composites]
    it.cx = it.slot === 'side' ? layout.side.cx : CX;
    it.built = it.def.build({ S, params: it.spec, mode: it.mode, tIn: it.tIn, tOut: it.tOut, beats: it.beats, data: it.data, scene: it.scene,
      modeCut: it.modeCut, returning: it.returning, enter: it.enter, slot: it.slot, cx: it.cx });
    // the camera works about the graphic's own centre
    it.box = it.built.box || { x: it.cx - 465, y: 300, w: 930, h: 900 };
    it.origin = [it.box.x + it.box.w / 2, it.box.y + it.box.h / 2];
    it.wrap = h(`div.nc-inst.nc-${it.slot}`, { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, display: 'none', transformOrigin: `${it.origin[0].toFixed(1)}px ${it.origin[1].toFixed(1)}px` } }, it.built.el);
    (it.slot === 'title' ? it.run.groupT : it.run.groupG).append(it.wrap);
  }
  const visibleUntil = (it) => (it.pushOutAt !== undefined ? Math.min(it.run.end, it.pushOutAt + motion.push.dur)
    : it.zoomOutAt !== undefined ? Math.min(it.run.end, it.zoomOutAt + motion.camera.zoomIn.outDur) : it.tOut);
  // which side graphic shares the field with a main graphic, and when it arrived
  for (const it of instances) {
    if (it.slot !== 'graphic') continue;
    const side = instances.find((x) => x.slot === 'side' && x.run === it.run && x.tIn < visibleUntil(it) && x.tOut > it.tIn);
    if (side) { it.sideFrom = side.tIn <= it.tIn + 0.05 ? -Infinity : side.tIn; side.mainOf = it; }
  }
  // ---- the camera over each graphic (research/motion.md M14, M21, M24; verified)
  const CAM = motion.camera;
  for (const it of instances) {
    if (it.slot !== 'graphic' && it.slot !== 'side') continue;
    // focus keyframes: a beat pushes the view into a point of the graphic (x, y as 0-1 of its box) and another pulls back
    const keys = [{ t: -Infinity, s: 1, tx: 0, ty: 0 }];
    const [ox, oy] = it.origin;
    for (const b of it.beats) {
      if (b.do === 'focus' || b.do === 'zoom') {
        const sc = b.scale || (b.do === 'zoom' ? 2.3 : CAM.focus.scale);
        const px = it.box.x + (b.x ?? 0.5) * it.box.w, py = it.box.y + (b.y ?? (b.do === 'zoom' ? 0.4 : 0.5)) * it.box.h;
        keys.push({ t: b.t, s: sc, tx: CAM.focus.centre[0] - ox - sc * (px - ox), ty: CAM.focus.centre[1] - oy - sc * (py - oy) });
      } else if (b.do === 'unfocus') keys.push({ t: b.t, s: 1, tx: 0, ty: 0 });
    }
    it.focusKeys = keys;
  }
  const camera = (it, t) => {
    let s = 1, o = 1, tx = 0, ty = 0;
    if (it.slot !== 'graphic' && it.slot !== 'side') return { s, o, tx, ty };
    const still = it.spec.hold === 'still';
    // arriving: the view pulls back into place
    const set = it.enter === 'zoom' ? CAM.zoomIn : it.enter === 'push' ? CAM.pushSettle : it.enter === 'own' && !it.returning ? CAM.settle : null;
    if (set && !still) {
      const p = kit.clamp((t - it.tIn) / (set.dur));
      s *= set.from + (1 - set.from) * S.E.slide(p);
      if (it.enter === 'zoom') o *= kit.clamp(p * 3);
    }
    // leaving by a zoom: blows up and fades
    if (it.zoomOutAt !== undefined && t >= it.zoomOutAt) { const q = kit.clamp((t - it.zoomOutAt) / CAM.zoomIn.outDur); s *= 1 + (CAM.zoomIn.out - 1) * S.E.slide(q); o *= 1 - q; }
    // holding: a slow linear push-in, never growing a wide graphic past the frame's sides
    if (!still) {
      const from = it.tIn + (set ? set.dur * 0.55 : 0);
      const cap = Math.max(1, Math.min(CAM.drift.max, 1040 / it.box.w));
      if (t > from) s *= Math.min(cap, 1 + CAM.drift.rate * (t - from));
    }
    // focus beats
    const f = focusAt(it, t);
    s *= f.s; tx += f.tx; ty += f.ty;
    // a side graphic gives way while the camera pushes into the main one
    if (it.mainOf) o *= kit.clamp(1 - (focusAt(it.mainOf, t).s - 1.1) / 0.35);
    return { s, o, tx, ty };
  };
  function focusAt(it, t) {
    const k = it.focusKeys.reduce((n, key, i) => (t >= key.t ? i : n), 0);
    if (k === 0) return { s: 1, tx: 0, ty: 0 };
    const a = it.focusKeys[k - 1], b = it.focusKeys[k];
    const e = S.E.slide(kit.clamp((t - b.t) / CAM.focus.dur));
    return { s: a.s + (b.s - a.s) * e, tx: a.tx + (b.tx - a.tx) * e, ty: a.ty + (b.ty - a.ty) * e };
  }

  // ---- sound (research/audio.md): one kit per video, each sample at one gain
  const sentenceStart = (t) => { const w = [...doc.words].reverse().find((x) => x.end <= t + 0.05); return !w || /[.!?]["'”’)]*$/.test(w.w); };
  const firstFull = runs.find((r) => r.mode === 'full');
  runs.forEach((r, k) => {
    if (k === 0) return;
    // a thump on about a third of the cuts: cuts into the full-height presenter at a sentence start [A19]
    if (r.mode === 'full' && sentenceStart(r.start)) S.kitSfx(r.start, 'cut');
  });
  S.kitSfx(0.9, 'graphic');                                         // the kit's low swell under the opening [A14; verified]
  if (firstFull) S.kitSfx(firstFull.start, 'transition');           // a swell stopping dead on the first cut-in [A20]
  for (const it of instances) {
    if ((it.slot === 'graphic' || it.slot === 'side') && it.tIn > 0.05 && it.enter !== 'cut' && !it.returning) S.kitSfx(it.tIn, 'graphic');   // [A17, A22, A23]
    if (it.spec.type === 'cta-lockup' && it.built.startAt !== undefined) S.kitSfx(it.built.startAt, 'transition');    // a riser into the call to action [A20]
    for (const t of it.built.ticks || []) S.kitSfx(t, 'tick');
  }
  // the bed: enters at the top of its loop after the hook, one 6-loop block, then the late loop to the end [A06-A11]
  if (doc.look?.bed !== 'off' && !doc.audio?.music) {
    const after = scenes.find((s) => s.role !== 'hook' && s.start >= bed.minEntry);
    const entry = after ? after.start : Math.min(bed.entry, doc.duration * 0.25);
    const block = bed.loop * bed.block;
    if (S.kitId === 'k3') {
      // the whole-video variant: bed A restarted from the top of its loop after each block [A11; verified]
      for (let t = entry; t < doc.duration - 1; t += block + 1.0) S.audio.push({ t, sfx: 'bedA', gainDb: bed.gainDb, key: 'bed' });
    } else {
      // one block, a music-free stretch, then the second section from entry + 73.8 s to the end [A09, A10; verified]
      S.audio.push({ t: entry, sfx: 'bedA', gainDb: bed.gainDb, key: 'bed' });
      const lateAt = entry + bed.lateAfterEntry;
      if (lateAt < doc.duration - 3) S.audio.push({ t: lateAt, sfx: 'bedA2', gainDb: bed.gainDb, key: 'bed' });
    }
  }

  // ---- layers, bottom to top: field, graphics, panel, person cut-out, titles, full-height presenter, captions
  const field = buildField(S);
  const presenter = buildPresenter(S);
  const captions = buildCaptions(S);
  root.append(field.el, graphics, presenter.panel, presenter.cutout, titles, presenter.full, captions.el);
  const cameraAt = (t) => instances.find((x) => x.slot === 'camera' && t >= x.tIn && t < x.tOut);
  const keywordOn = (t) => instances.some((x) => x.slot === 'keyword' && t >= x.tIn && t < x.tOut);
  // the keyword element lives above the full-height presenter
  for (const it of instances) if (it.slot === 'keyword' || it.slot === 'camera') { it.run.groupG.remove(); presenter.full.append(it.run.groupG); }

  const seek = (t) => {
    const run = runAt(t);
    field.seek(run.mode);
    const cam = run.mode === 'full' ? cameraAt(t) : null;
    presenter.seek(t, run.mode, cam?.built.zoom ? cam.built.zoom(t) : 1);
    for (const r of runs) {
      const on = r === run;
      if (r.on !== on) { r.groupG.style.display = on ? '' : 'none'; r.groupT.style.display = on ? '' : 'none'; r.on = on; }
    }
    for (const it of instances) {
      const on = it.run === run && t >= it.tIn && t < visibleUntil(it);
      if (it.on !== on) { it.wrap.style.display = on ? '' : 'none'; it.on = on; }
      if (!on) continue;
      let dx = 0;
      if (it.enter === 'push') dx += motion.push.dist * (1 - S.E.push(kit.clamp((t - it.tIn) / motion.push.dur)));
      if (it.pushOutAt !== undefined && t >= it.pushOutAt) dx -= motion.push.dist * S.E.push(kit.clamp((t - it.pushOutAt) / motion.push.dur));
      if (it.sideFrom !== undefined) dx -= layout.side.shift * (it.sideFrom === -Infinity ? 1 : S.E.slide(kit.clamp((t - it.sideFrom) / motion.slide.dur)));
      if (it.slot === 'side' && !it.returning) dx += layout.side.enter * (1 - S.E.slide(kit.clamp((t - it.tIn) / motion.slide.dur)));
      const cam = camera(it, t);
      const X = dx + cam.tx, Y = cam.ty;
      const tf = [Math.abs(X) > 0.05 || Math.abs(Y) > 0.05 ? `translate(${X.toFixed(2)}px, ${Y.toFixed(2)}px)` : '', Math.abs(cam.s - 1) > 0.0001 ? `scale(${cam.s.toFixed(5)})` : ''].join(' ').trim() || 'none';
      const op = cam.o >= 0.999 ? '' : cam.o.toFixed(3);
      if (it.op !== op) { it.wrap.style.opacity = op; it.op = op; }
      if (it.tf !== tf) { it.wrap.style.transform = tf; it.tf = tf; }
      it.built.seek(t);
    }
    captions.seek(t, run.mode, keywordOn(t));
  };

  S.audio.sort((a, b) => a.t - b.t);
  // the same effect at least 0.35 s apart, any two at least 0.1 s apart (the bed and transitions excepted)
  const audio = [];
  const lastOf = {};
  for (const ev of S.audio) {
    const prev = audio[audio.length - 1];
    if (ev.key !== 'bed') {
      if (lastOf[ev.sfx] !== undefined && ev.t - lastOf[ev.sfx] < soundSpacing.same) continue;
      if (prev && prev.key !== 'bed' && ev.t - prev.t < soundSpacing.any && !['riser', 'thump', 'subdrop'].includes(ev.sfx)) continue;
    }
    audio.push({ t: ev.t, sfx: ev.sfx, gainDb: ev.gainDb, key: ev.key });
    lastOf[ev.sfx] = ev.t;
  }

  return {
    seek, audio: audio.map(({ t, sfx: s, gainDb }) => ({ t, sfx: s, gainDb })), warnings: S.warnings,
    /** Resolves when everything drawn by the last seek is really on screen (elements that show video frames need a moment). */
    settled: () => Promise.all(instances.filter((it) => it.on && it.built.settled).map((it) => it.built.settled())),
    posterTime(id) {
      const sc = scenes.find((s) => s.id === id);
      if (!sc) return null;
      const span = sc.end - sc.start;
      return sc.start + Math.max(Math.min(span - F(3), span * 0.8), Math.min(span * 0.5, 0.4));
    },
  };
}
