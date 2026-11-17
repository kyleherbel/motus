// Turns the resolved document (scenes with their picked options) into one composition: the ground, the shots,
// the presenter and the captions.
//
// How things change (research/structure.md, motion.md):
//   every change is a hard cut on the word that opens the scene; there are no dissolves, wipes or slides [S03, S04]
//   motion lives in the 15 frames after a cut, then everything is held dead still between actions [M12]
//     desk     after a layout without the speaker, the footage rectangle is drawn on by the cursor [M01];
//              after another desk shot the speaker stays and the new window is dragged from 70 % to full [M02]
//     full     the window lands 14 % large and settles [M03]
//     hero, behind   the screen lands 5 % large and 46 px low and settles [M04]
//     graphic  the object lands 12 % large and settles [M04]
//     face     nothing moves
// A "shot" is one or more consecutive scenes in the same layout whose elements keep the same key: the picture
// stays on screen, nothing re-enters, and only its beats advance.
import { W, H, F, curves, layout, motion, palettes } from './tokens.js';
import { buildGround } from './ground.js';
import { buildPresenter } from './presenter.js';
import { buildCaptions } from './captions.js';
import { selFrame, cursor } from './parts.js';
import { byType, layouts } from './elements/index.js';
import { setStyle, tw, full, px } from './common.js';

function makeContext(doc, env) {
  let n = 0;
  const warnings = [];
  const kit = env.kit;
  return {
    doc, env, kit, uid: () => ++n,
    theme: palettes[doc.look?.palette] || palettes.mono,
    E: Object.fromEntries(Object.entries(curves).map(([k, v]) => [k, kit.cubicBezier(...v)])),
    wordTime: (i) => (doc.words[i] ? doc.words[i].start : 0),
    warn: (m) => { if (!warnings.includes(m)) { warnings.push(m); console.warn(`[open-canvas] ${m}`); } },
    warnings,
  };
}

const GROUND = { desk: 'grid', full: 'grid', hero: 'grid', behind: 'grid', graphic: 'soft', face: 'none' };
const PRESENTER = { desk: 'desk', behind: 'behind', face: 'face' };

export async function buildComposition(doc, env, root) {
  const S = makeContext(doc, env);
  const { kit } = S; const { h } = kit;
  const scenes = doc.scenes;
  const layoutOf = (sc) => (layouts[sc.option?.layout] ? sc.option.layout : 'face');
  if (layoutOf(scenes[scenes.length - 1]) !== 'face') S.warn('the reference closes on the face layout with the ask [S08]');

  // ---- shots: consecutive scenes in one layout whose elements keep their keys
  const shots = [];
  for (const sc of scenes) {
    const lay = layoutOf(sc);
    const slots = sc.option?.slots || {};
    const names = Object.keys(slots).filter((s) => slots[s] && layouts[lay].slots[s]);
    const last = shots[shots.length - 1];
    const same = last && last.layout === lay && names.length && names.length === Object.keys(last.items).length
      && names.every((s) => last.items[s] && last.items[s].spec.type === slots[s].type && slots[s].key !== undefined && last.items[s].spec.key === slots[s].key);
    if (same) {
      last.tOut = sc.end; last.scenes.push(sc);
      for (const s of names) last.items[s].raw.push(...(slots[s].beats || []).map((b) => ({ b, sc })));
      continue;
    }
    const shot = { layout: lay, tIn: sc.start, tOut: sc.end, scenes: [sc], items: {}, prev: last || null };
    for (const s of names) {
      const def = byType[slots[s].type];
      if (!def) { S.warn(`unknown element "${slots[s].type}" in ${sc.id}`); continue; }
      shot.items[s] = { spec: slots[s], def, raw: (slots[s].beats || []).map((b) => ({ b, sc })) };
    }
    shots.push(shot);
  }
  const items = shots.flatMap((sh) => Object.values(sh.items));
  await Promise.all(items.map(async (it) => { it.data = it.def.prepare ? await it.def.prepare(it.spec, S, it.raw.map((r) => r.b)) : null; }));

  // ---- layers, bottom to top: ground, what sits under the speaker, the speaker, what sits over, captions
  const ground = buildGround(S);
  const presenter = buildPresenter(S);
  const under = h('div.oc-under', { style: full({}) });
  const over = h('div.oc-over', { style: full({}) });
  let captionsUntil = Infinity;

  const beatTime = (b, sc) => (typeof b.at === 'number' ? S.wordTime(b.at) : typeof b.at?.t === 'number' ? b.at.t : sc.start + (b.at?.rel ?? 0));
  const make = (shot, slot, box) => {
    const it = shot.items[slot];
    if (!it) return null;
    const beats = it.raw.map(({ b, sc }) => ({ ...b, t: beatTime(b, sc), untilT: typeof b.until === 'number' ? S.wordTime(b.until) : undefined })).sort((a, b) => a.t - b.t);
    it.built = it.def.build({ S, params: it.spec, layout: shot.layout, slot, box, tIn: shot.tIn, tOut: shot.tOut, beats, data: it.data, scene: shot.scenes[0] });
    if (it.built.captionsUntil != null) captionsUntil = Math.min(captionsUntil, it.built.captionsUntil);
    return it.built;
  };
  const seekItems = (shot, t) => { for (const it of Object.values(shot.items)) it.built?.seek(t); };

  for (const shot of shots) {
    const lay = shot.layout;
    const u = h(`div.oc-shot.oc-${lay}`, { style: full({ display: 'none' }) });
    const o = h(`div.oc-shot-over.oc-${lay}`, { style: full({ display: 'none' }) });
    shot.under = u; shot.over = o;
    under.append(u); over.append(o);
    shot.redraw = !shot.prev || shot.prev.layout !== 'desk';

    if (lay === 'desk') {
      const title = make(shot, 'title', { x: 0, y: 0, w: W, h: H });
      const slot = title ? layout.deskWindowTitled : layout.deskWindow;
      const win = make(shot, 'window', { x: 0, y: 0, w: slot.w, h: slot.h });
      if (title) u.append(title.el);
      if (win) {
        const frame = selFrame(S);
        const inner = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${slot.w}px`, height: `${slot.h}px`, transformOrigin: '0 0' } }, win.el);
        frame.body.append(inner);
        const cur = cursor(S);
        u.append(frame.el, cur.el);
        const grow = !shot.redraw;                    // the speaker stayed: the new window is dragged out [M02]
        const G = motion.windowGrow;
        shot.draw = (t, a) => {
          const g = grow ? tw(a, G.hold, G.dur, G.from, 1, S.E.settle) : 1;
          const w = slot.w * g, hh = slot.h * g, y = slot.y + slot.h - hh;
          frame.place(slot.x, y, w, hh);
          setStyle(inner, 'transform', g < 0.9999 ? `scale(${g.toFixed(5)})` : '');
          cur.at(slot.x + w - 4, grow ? y - 8 : y + hh / 2 + 6);
        };
      }
    } else if (lay === 'full') {
      const slot = layout.fullWindow;
      const win = make(shot, 'window', { x: 0, y: 0, w: slot.w, h: slot.h });
      const frame = selFrame(S);
      if (win) frame.body.append(win.el);
      frame.place(slot.x, slot.y, slot.w, slot.h);
      const cur = cursor(S);
      cur.at(slot.x + slot.w - 4, slot.y + slot.h - 4);
      const wrap = h('div', { style: full({ transformOrigin: `${W / 2}px ${slot.y + slot.h / 2}px` }) }, frame.el, cur.el);
      u.append(wrap);
      const M = motion.fullSettle;
      shot.draw = (t, a) => { const g = tw(a, 0, M.dur, M.from, 1, S.E.settle); setStyle(wrap, 'transform', g > 1.0001 ? `scale(${g.toFixed(5)})` : ''); };
    } else if (lay === 'hero' || lay === 'behind') {
      const slot = layout[lay];
      const scr = make(shot, 'screen', { x: 0, y: 0, w: slot.w, h: slot.h });
      const clip = h('div', { style: { position: 'absolute', inset: '0', borderRadius: `${slot.radius}px`, overflow: 'hidden', background: '#000' } }, scr ? scr.el : null);
      const dev = h('div', { style: { position: 'absolute', left: `${slot.x}px`, top: `${slot.y}px`, width: `${slot.w}px`, height: `${slot.h}px`, borderRadius: `${slot.radius}px`, transformOrigin: '50% 30%',
        boxShadow: `0 0 0 ${slot.ring}px rgba(255,255,255,.85), 0 30px 70px rgba(0,0,0,.45)` } }, clip);
      const T = S.theme;
      const melt = lay === 'hero' ? `linear-gradient(to bottom, transparent ${slot.melt[0]}%, ${T.dark}f2 ${slot.melt[1]}%)` : `linear-gradient(to bottom, transparent ${slot.melt[0]}%, ${T.dark}f0 ${slot.melt[1]}%, ${T.dark} 100%)`;
      u.append(dev, h('div', { style: full({ background: melt }) }));
      const M = motion.heroSettle;
      shot.draw = (t, a) => {
        const g = tw(a, 0, M.dur, M.from, 1, S.E.settle), ty = tw(a, 0, M.dur, M.rise, 0, S.E.settle);
        setStyle(dev, 'transform', g > 1.0001 || ty > 0.05 ? `translateY(${ty.toFixed(2)}px) scale(${g.toFixed(5)})` : '');
      };
    } else if (lay === 'graphic') {
      const obj = make(shot, 'object', { x: 0, y: 0, w: W, h: H });
      const wrap = h('div', { style: full({ transformOrigin: `${layout.graphicOrigin[0]}px ${layout.graphicOrigin[1]}px` }) }, obj ? obj.el : null);
      u.append(wrap);
      const M = motion.objectSettle;
      shot.draw = (t, a) => { const g = tw(a, 0, M.dur, M.from, 1, S.E.settle); setStyle(wrap, 'transform', g > 1.0001 ? `scale(${g.toFixed(5)})` : ''); };
    } else {
      const cta = make(shot, 'cta', { x: 0, y: 0, w: W, h: H });
      if (cta) o.append(cta.el);
    }
  }

  const captions = buildCaptions(S, captionsUntil);
  root.append(ground.grid, ground.soft, under, presenter.el, over, captions.el);

  const shotAt = (t) => shots.find((s) => t >= s.tIn && t < s.tOut) || (t < shots[0].tIn ? shots[0] : shots[shots.length - 1]);
  const seek = (t) => {
    const shot = shotAt(t);
    const a = Math.max(0, t - shot.tIn);
    for (const s of shots) { const on = s === shot; if (s.on !== on) { s.under.style.display = on ? '' : 'none'; s.over.style.display = on ? '' : 'none'; s.on = on; } }
    ground.seek(t, GROUND[shot.layout]);
    presenter.seek(PRESENTER[shot.layout] || 'none', a, shot.redraw);
    shot.draw?.(t, a);
    seekItems(shot, t);
    captions.seek(t, shot.layout === 'desk' || shot.layout === 'behind' ? 'high' : 'low');
  };

  return {
    seek, audio: [], warnings: S.warnings,       // voice only: the reference has no music and no sound effects [A01]
    settled: () => Promise.all(shots.filter((s) => s.on).flatMap((s) => Object.values(s.items)).filter((it) => it.built?.settled).map((it) => it.built.settled())),
    posterTime(id) {
      const sc = scenes.find((s) => s.id === id);
      if (!sc) return null;
      const span = sc.end - sc.start;
      return sc.start + Math.max(Math.min(span - F(3), span * 0.85), Math.min(span * 0.5, F(15)));
    },
  };
}
