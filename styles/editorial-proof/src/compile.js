// Turns the resolved document (scenes with their picked options) into one composition:
// grounds, presenter, element instances with their lifetimes, captions and sound events.
//
// How layouts change (research/motion.md, 338 transitions):
//   into dark focus from the split or the presenter : hard cut, then the stage settles from 115 % over 36 frames
//   into the light split                            : hard cut, the card eases down 61 px into place while fading up
//   into white                                      : hard cut, heading builds, card fades up from 94.6 % after 5 frames
//   white -> dark focus with the same card          : no cut: the ground cross-fades over 14 frames and the card travels
//   to or from the full-frame presenter             : hard cut, nothing moves
//   same layout, new card                           : hard swap
import { W, H, layout, motion, sound, soundSpacing, colours, curves, F } from './tokens.js';
import { buildGrounds } from './canvas.js';
import { buildPresenter } from './presenter.js';
import { buildCaptions } from './captions.js';
import { byType, layouts } from './elements/index.js';

const MODE_SHORT = { 'light-split': 'light', 'dark-focus': 'dark', white: 'white', 'presenter-full': 'full' };

function makeContext(doc, env) {
  let n = 0;
  const audio = [];
  const warnings = [];
  const kit = env.kit;
  const S = {
    doc, env, kit, C: colours(doc.look),
    E: { emph: kit.cubicBezier(...curves.emphasized), settle: kit.cubicBezier(...curves.settle), incard: kit.cubicBezier(...curves.incard) },
    uid: () => ++n,
    wordTime: (i) => (doc.words[i] ? doc.words[i].start : 0),
    sfx: (t, key, gainOffset = 0) => { const s = sound[key]; if (s && t > -0.05 && t < doc.duration) audio.push({ t: Math.max(0, t + (s.offset || 0)), sfx: s.sfx, gainDb: s.gainDb + gainOffset, key }); },
    warn: (m) => { if (!warnings.includes(m)) { warnings.push(m); console.warn(`[editorial-proof] ${m}`); } },
    /** A stable, pleasant colour for a name (monogram tiles when no logo is supplied). */
    tint: (name) => `hsl(${Math.round(((kit.hash(String(name)) % 997) * 137.508) % 360)} 58% 46%)`,
    isDark: (hex) => { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return false; const v = parseInt(m[1], 16); return (0.299 * (v >> 16) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255)) < 140; },
    audio, warnings,
  };
  return S;
}

/** Where the card sits, given the layout and what shares it. */
function cardRect(mode, sceneSlots, prefH) {
  const c = layout.card;
  if (mode === 'light-split') {
    if (sceneSlots.title) return { x: c.x + 1, y: layout.light.cardUnderTitle.y, w: c.w - 2, h: layout.light.cardUnderTitle.h };
    const maxH = sceneSlots.chips ? layout.light.cardWithChips.h : layout.light.card.h;
    return { x: c.x, y: layout.light.card.y, w: c.w, h: Math.min(maxH, prefH ?? maxH) };
  }
  if (mode === 'dark-focus') {
    const maxH = sceneSlots.chips ? layout.dark.card.h : layout.dark.slot.h;
    const hgt = Math.min(maxH, prefH ?? layout.dark.card.h);
    const y = sceneSlots.chips ? layout.dark.card.y : Math.round(Math.max(layout.dark.slot.y, layout.dark.centreY - hgt / 2));
    return { x: c.x, y, w: c.w, h: hgt };
  }
  if (sceneSlots.heading) { const k = layout.white.card; return { x: k.x, y: k.y, w: k.w, h: Math.min(k.h, prefH ?? k.h) }; }
  return { x: c.x, y: layout.white.focusCard.y, w: c.w, h: Math.min(layout.white.focusCard.h + 180, prefH ?? layout.white.focusCard.h) };
}
const maxCardH = (mode, sceneSlots) => (mode === 'dark-focus' ? (sceneSlots.chips ? layout.dark.card.h : layout.dark.slot.h)
  : mode === 'white' ? (sceneSlots.heading ? layout.white.card.h : layout.white.focusCard.h + 180)
    : sceneSlots.title ? layout.light.cardUnderTitle.h : sceneSlots.chips ? layout.light.cardWithChips.h : layout.light.card.h);

export async function buildComposition(doc, env, root) {
  const S = makeContext(doc, env);
  const { kit } = S; const { h } = kit;
  const scenes = doc.scenes;
  const sceneAt = (t) => scenes.find((s) => t >= s.start && t < s.end) || (t < scenes[0].start ? scenes[0] : scenes[scenes.length - 1]);

  // ---- mode runs
  const runs = [];
  for (const sc of scenes) {
    const last = runs[runs.length - 1];
    if (last && last.mode === sc.option.layout) { last.end = sc.end; last.scenes.push(sc); }
    else runs.push({ mode: sc.option.layout, start: sc.start, end: sc.end, scenes: [sc], fadeIn: 0, k: runs.length });
  }
  const runAt = (t) => runs.find((r) => t >= r.start && t < r.end) || (t < runs[0].start ? runs[0] : runs[runs.length - 1]);

  // ---- element instances: one per (slot, key) stretch
  const instances = [];
  const open = {};
  scenes.forEach((sc, k) => {
    const prev = scenes[k - 1];
    const slots = sc.option.slots || {};
    for (const slot of layouts[sc.option.layout]?.slots || []) {
      const spec = slots[slot];
      const cur = open[slot];
      const sameKey = spec && cur && cur.spec.type === spec.type && spec.key !== undefined && cur.spec.key === spec.key && cur.tOut === sc.start;
      const sameMode = prev && prev.option.layout === sc.option.layout;
      const morph = sameKey && !sameMode && slot === 'card' && prev.option.layout === 'white' && sc.option.layout === 'dark-focus';
      if (sameKey && (sameMode || morph)) {
        cur.tOut = sc.end; cur.scenes.push(sc); cur.rawBeats.push(...(spec.beats || []).map((b) => ({ b, sc })));
        if (morph) { cur.morphAt = sc.start; cur.morphSlots = slots; }
        continue;
      }
      if (cur) delete open[slot];
      if (!spec) continue;
      const def = byType[spec.type];
      if (!def) { S.warn(`unknown element "${spec.type}" in ${sc.id}`); continue; }
      const inst = { slot, spec, def, scene: sc, scenes: [sc], mode: sc.option.layout, tIn: sc.start, tOut: sc.end, rawBeats: (spec.beats || []).map((b) => ({ b, sc })), sceneSlots: slots,
        modeCut: !!prev && prev.option.layout !== sc.option.layout, prevMode: prev ? prev.option.layout : null };
      instances.push(inst); open[slot] = inst;
    }
    for (const slot of Object.keys(open)) if (!slots[slot] || open[slot].tOut !== sc.end) delete open[slot];
  });
  // a white -> dark morph cross-fades the ground instead of cutting
  for (const it of instances) if (it.morphAt !== undefined) { const r = runs.find((x) => x.start === it.morphAt); if (r) { r.fadeIn = motion.morph.dur; r.morph = true; } }

  await Promise.all(instances.map(async (it) => { it.data = it.def.prepare ? await it.def.prepare(it.spec, S) : null; }));

  // ---- one group per mode run, so a whole run can settle as a stage
  const graphics = h('div.ep-graphics', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px` } });
  runs.forEach((r) => {
    r.group = h(`div.ep-run.ep-run-${MODE_SHORT[r.mode]}`, { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, transformOrigin: `${motion.stage.origin[0]}px ${motion.stage.origin[1]}px` } });
    graphics.append(r.group);
    const prev = runs[r.k - 1];
    r.settle = r.mode === 'dark-focus' && prev && (prev.mode === 'light-split' || prev.mode === 'presenter-full');
  });

  const beatTime = (b, sc) => (typeof b.at === 'number' ? S.wordTime(b.at) : typeof b.at?.t === 'number' ? b.at.t : sc.start + (b.at?.rel ?? 0));
  const rects = new Map();
  const order = [...instances].sort((a, b) => (a.slot === 'card' ? 0 : 1) - (b.slot === 'card' ? 0 : 1));
  for (const it of order) {
    const short = MODE_SHORT[it.mode];
    let rect = { x: 0, y: 0, w: W, h: H };
    if (it.slot === 'card') {
      // a card that travels from the interstitial into dark focus is built at its dark size
      const mode = it.morphAt !== undefined ? 'dark-focus' : it.mode;
      const slots = it.morphAt !== undefined ? it.morphSlots : it.sceneSlots;
      let maxH = maxCardH(mode, slots);
      if (it.morphAt !== undefined) maxH = Math.min(maxH, Math.floor((layout.white.card.h * layout.card.w) / layout.white.card.w));
      const pref = it.def.prefer ? it.def.prefer(it.spec, { data: it.data, mode: MODE_SHORT[mode], w: layout.card.w, maxH }) : null;
      rect = cardRect(mode, slots, pref ? Math.min(pref.h, maxH) : (it.morphAt !== undefined ? Math.min(maxH, layout.dark.card.h) : undefined));
      if (it.morphAt !== undefined) {
        const k = layout.white.card; const sc = k.w / rect.w;
        it.whiteRect = { x: k.x, y: k.y, w: k.w, h: rect.h * sc, scale: sc };
        for (const s of it.scenes) rects.set(s.id, s.start < it.morphAt ? it.whiteRect : rect);
      } else for (const s of it.scenes) rects.set(s.id, rect);
    }
    const cRect = rects.get(it.scene.id);
    if (it.slot === 'chips') {
      const gap = it.mode === 'dark-focus' ? layout.dark.chipsGap : layout.light.chipsGap;
      rect = { x: layout.card.x, y: cRect ? cRect.y + cRect.h + gap : (it.mode === 'dark-focus' ? layout.dark.chipRow.y : 767), w: layout.card.w, h: 280 };
    }
    it.rect = rect;
    it.beats = it.rawBeats.map(({ b, sc }) => ({ ...b, t: beatTime(b, sc) })).sort((a, b) => a.t - b.t);
    it.run = runs.find((r) => it.tIn >= r.start && it.tIn < r.end);
    const built = it.def.build({ S, params: it.spec, rect, mode: it.morphAt !== undefined ? 'dark' : short, tIn: it.tIn, tOut: it.tOut, beats: it.beats, data: it.data, scene: it.scene, cardRect: cRect, modeCut: it.modeCut });
    it.built = built;
    const placed = it.slot === 'card' || it.slot === 'chips';
    it.wrap = h(`div.ep-inst.ep-${it.slot}`, { style: { position: 'absolute', left: placed ? `${rect.x}px` : '0', top: placed ? `${rect.y}px` : '0', width: placed ? `${rect.w}px` : `${W}px`, height: placed ? `${rect.h}px` : `${H}px`, transformOrigin: placed ? '0 0' : '50% 50%' } }, built.el);
    // an instance that outlives its first run (the morphing card) lives above the run groups
    (it.morphAt !== undefined ? graphics : it.run.group).append(it.wrap);
    // how it arrives
    it.enter = it.slot !== 'card' ? 'none'
      : it.tIn <= 0 || !it.modeCut ? 'none'
        : it.mode === 'light-split' ? 'slide'
          : it.mode === 'white' ? 'white' : 'none';
    if (it.slot === 'card' && it.mode === 'white' && it.tIn > 0 && it.modeCut === false && it.sceneSlots.heading) it.enter = 'white';
  }

  // ---- a new card replacing another inside one dark or light run slide-pushes it out (motion.md M16,
  // re-seen in mid and newer reels by research/explain.md): one rigid strip, 22 f, horizontal blur
  for (const it of instances) {
    if (it.slot !== 'card' || it.tIn <= 0 || it.modeCut || it.enter !== 'none' || it.mode === 'white' || it.sceneSlots.title) continue;
    const pv = instances.find((x) => x !== it && x.slot === 'card' && x.run === it.run && Math.abs(x.tOut - it.tIn) < 1e-6);
    if (!pv || pv.sceneSlots.title || pv.morphAt !== undefined) continue;
    it.enter = 'push'; pv.pushOut = it.tIn;
  }

  // ---- sound, following the reference's placement rules (research/audio.md)
  S.sfx(F(0.75), 'open');
  const sentenceEnd = (t) => { const w = [...doc.words].reverse().find((x) => x.end <= t + 0.25); return !!w && /[.!?]$/.test(w.w) && t - w.end < 0.5; };
  runs.forEach((r, k) => {
    if (k === 0) return;
    const prev = runs[k - 1];
    if (r.morph) return;
    if (r.mode === 'white') S.sfx(r.start, 'interstitial');
    else if (prev.mode === 'white') { /* leaving an interstitial is silent */ } else if (sentenceEnd(r.start)) S.sfx(r.start, 'cut');
  });
  for (const it of instances) {
    if (it.slot !== 'card' || it.tIn <= 0) continue;
    if (it.enter === 'slide' || it.enter === 'push') S.sfx(it.tIn, 'cardSlide');
    else if (it.enter === 'white' || (it.run.settle && it.tIn === it.run.start)) S.sfx(it.tIn, 'cardIn');
  }
  S.sfx(doc.duration - 0.55, 'end');

  const grounds = buildGrounds(S);
  const presenter = buildPresenter(S);
  const captions = buildCaptions(S, scenes.map((s) => s.words[0]));
  const ctas = instances.filter((it) => it.spec.type === 'comment-cta');
  // from the CTA verb on, no caption line shows: lines that start later are its own words, and a
  // line still on screen when the verb lands is cut there (the verb takes the caption's place)
  const suppressed = (g, t) => ctas.some((c) => {
    const off = (c.built.captionsOffFrom ?? c.tIn) - 0.02;
    return (g.start >= off && g.start < c.tOut) || (t >= off && t < c.tOut);
  });

  const ns = 'http://www.w3.org/2000/svg';
  const pushFx = document.createElementNS(ns, 'svg');
  pushFx.setAttribute('width', '0'); pushFx.setAttribute('height', '0');
  Object.assign(pushFx.style, { position: 'absolute', left: '0', top: '0' });
  pushFx.innerHTML = '<filter id="ep-push-blur" x="-20%" y="-5%" width="140%" height="110%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0 0"/></filter>';
  const pushBlur = pushFx.querySelector('feGaussianBlur');
  const pushEase = kit.cubicBezier(...motion.push.curve);
  root.append(pushFx, grounds.el, presenter.el, graphics, captions.el);

  // the dark backdrop echoes whichever card is up
  const echoOf = (t) => { const it = instances.find((x) => x.slot === 'card' && t >= x.tIn && t < x.tOut && (x.mode === 'dark-focus' || x.morphAt !== undefined)); return it ? { tone: it.built.tone || it.def.tone || 'light' } : null; };

  const seek = (t) => {
    const run = runAt(t);
    grounds.seek(t, runs, echoOf);
    presenter.seek(t, run.mode);
    for (const r of runs) {
      const on = r === run;
      if (r.on !== on) { r.group.style.display = on ? '' : 'none'; r.on = on; }
      if (!on) continue;
      if (r.settle) {
        const p = S.E.settle(kit.clamp((t - r.start) / motion.stage.dur));
        const sc = motion.stage.from + (1 - motion.stage.from) * p;
        r.group.style.transform = sc === 1 ? 'none' : `scale(${sc.toFixed(5)})`;
      }
    }
    let pushSpeed = 0;
    for (const it of instances) {
      const leaving = it.pushOut !== undefined && t >= it.tOut && t < it.tOut + motion.push.dur;
      const on = (t >= it.tIn && t < it.tOut) || leaving;
      if (it.on !== on) { it.wrap.style.display = on ? '' : 'none'; it.on = on; }
      if (!on) continue;
      const age = t - it.tIn;
      if (it.morphAt !== undefined) {
        const p = S.E.emph(kit.clamp((t - it.morphAt) / motion.morph.dur));
        const a = it.whiteRect, b = it.rect;
        const sc = a.scale + (1 - a.scale) * p;
        it.wrap.style.transform = `translate(${((a.x - b.x) * (1 - p)).toFixed(2)}px, ${((a.y - b.y) * (1 - p)).toFixed(2)}px) scale(${sc.toFixed(5)})`;
        const fade = kit.prog(t, it.tIn + motion.whiteCard.delay, motion.whiteCard.fade, kit.ease.outCubic);
        it.wrap.style.opacity = String(it.tIn > 0 ? fade : 1);
      } else if (it.enter === 'slide' && !leaving) {
        const dy = motion.lightCard.dy * Math.exp(-age / motion.lightCard.tau);
        it.wrap.style.transform = Math.abs(dy) < 0.05 ? 'none' : `translateY(${dy.toFixed(2)}px)`;
        it.wrap.style.opacity = String(0.2 + 0.8 * kit.prog(t, it.tIn, motion.lightCard.fade, kit.ease.outCubic));
      } else if (it.enter === 'push' || leaving) {
        const t0 = leaving ? it.pushOut : it.tIn;
        const p = pushEase(kit.clamp((t - t0) / motion.push.dur));
        const p1 = pushEase(kit.clamp((t - F(1) - t0) / motion.push.dur));
        pushSpeed = Math.max(pushSpeed, (p - p1) * motion.push.travel);
        const x = leaving ? -motion.push.travel * p : motion.push.travel * (1 - p);
        it.wrap.style.transform = Math.abs(x) < 0.05 ? 'none' : `translateX(${x.toFixed(1)}px)`;
        it.wrap.style.filter = p > 0 && p < 1 ? 'url(#ep-push-blur)' : 'none';
        it.wrap.style.opacity = '';
      } else if (it.enter === 'white') {
        const p = kit.prog(t, it.tIn + motion.whiteCard.delay, motion.whiteCard.fade, kit.ease.linear);
        const grow = 1 - (1 - motion.whiteCard.fromScale) * Math.pow(0.77, Math.max(0, (age - motion.whiteCard.delay) * 30));
        it.wrap.style.opacity = String(p);
        it.wrap.style.transformOrigin = '50% 50%';
        it.wrap.style.transform = `scale(${Math.min(1, grow).toFixed(5)})`;
      }
      it.built.seek(t);
    }
    pushBlur.setAttribute('stdDeviation', `${(Math.min(60, pushSpeed * motion.push.blur)).toFixed(2)} 0`);
    // the dark backdrop echoes the card in focus, as drawn at this frame
    if (run.mode === 'dark-focus') grounds.echoLive(t, instances.find((x) => x.slot === 'card' && t >= x.tIn && t < x.tOut && (x.mode === 'dark-focus' || x.morphAt !== undefined)));
    else grounds.echoLive(t, null);
    captions.seek(t, sceneAt, suppressed);
  };

  S.audio.sort((a, b) => a.t - b.t);
  // keep the density the reference keeps: the same effect >= 0.35 s apart, any two >= 0.1 s (the CTA pair is designed)
  const audio = [];
  const lastOf = {};
  for (const ev of S.audio) {
    const prev = audio[audio.length - 1];
    if (lastOf[ev.sfx] !== undefined && ev.t - lastOf[ev.sfx] < soundSpacing.same) continue;
    if (prev && ev.t - prev.t < soundSpacing.any && !['cta', 'ctaVerb', 'cut', 'end'].includes(ev.key)) continue;
    audio.push({ t: ev.t, sfx: ev.sfx, gainDb: ev.gainDb });
    lastOf[ev.sfx] = ev.t;
  }

  return {
    seek, audio, warnings: S.warnings,
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
