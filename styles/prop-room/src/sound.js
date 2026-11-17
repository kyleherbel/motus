// Prop Room sound: which effect plays when, and how loud, on the output timeline (research/audio.md A17-A25).
//
// The music bed is not here: it is the manifest's `beds` (style.head.json), under every frame from the top of the
// track with no fades and no ducking [A10, A12, A13]. This file places the effects:
//
//   density      about 2 loud effects per 10 s, the later corpus clips (1.8; the early ones 5.5) [A25]; under the
//                pulse-free pad bed (or no bed) about 3, the extra ones booms [A19]
//   spacing      loud effects start at least 0.65 s apart (the late clips' 5th percentile), except the boom that
//                follows a swell [A18, A25]
//   textures     a prop's action carries a texture for as long as it lasts: the reel texture while a part spins
//                (until its `stop`, or the cut), the printer texture while a sheet moves out of a slot [A22]
//   pulses       a ring pulse carries an effect 43 % of the time, the strongest tie measured (ping, swell or boom)
//   cuts         about 1 cut in 7 carries an effect [A21], and only a cut where the whole frame changes (a layout
//                change, or a new full-frame graphic). It depends on the bed: under a drum bed 12 % of cuts, mostly
//                swells; under the pad bed 24 %, mostly booms (booms sit where the bed has no bass [A19]). A boom
//                starts on the cut (-5 ms), a swell 17 ms after it, a ping 21 ms after it
//   swell+boom   one swell in three (37 %) brings a boom 0.33 s after its start [A18]
//   other beats  a grow, recolor, fill, fade, pop, badge or typing event carries the effects measured on it, at the
//                measured share (4-20 %); events with no measured tie (moves, slides, draws, swaps) carry none
//   opening      one video in five (4/19) opens with a long swell from frame 3 [A23]
//   close        nothing at the call to action: no effect in the closing speaker scene [A24]
//
// Choices use S.kit.hash (deterministic: the same document gives the same events). Every number below is a token
// with its source; "this build" means measured for the sound build in corpus/_study/<source>/_build/sound/
// (ties.py: effect onsets against the explain-study graphic events, the 0.25 s window [-100, +150] ms).
import { F } from './tokens.js';

// TOKENS (research/audio.md A18-A25; dev/make-audio.mjs report; _build/sound/ties.py)
// Per-file gain (dB): each file is normalised to -20 dBFS over its loudest 50 ms; this gain puts its family at the
// measured level under a -14.1 LUFS master [A01]: swells and pings at their median 16.3-19 kHz peak (-48.1, -47.2
// dB) [A18, A20], booms at their median 25-70 Hz peak (-24.4 dB) [A19], textures on the plateau of the two corpus
// cases (16.3-19 kHz p90 -47.5 reels, -53.3 printer) [A22]. Regenerate with `node styles/prop-room/dev/make-audio.mjs`.
const GAIN = {
  'swell-1': -4, 'swell-2': -4.5, 'swell-3': -3.2, 'swell-4': -3.6,
  'boom-1': -6.1, 'boom-2': -6.2, 'boom-3': -6, 'boom-4': -5.9,
  'ping-1': -19, 'ping-2': -20.8, 'ping-3': -18.8, 'ping-4': -20,
  'reel-10': -1.8, 'reel-18': -2.4, 'reel-32': -2.1,
  'printer-10': -0.4, 'printer-18': -2.2, 'printer-32': -1.4,
};
// Variants per family, weighted toward the one built on the medians (the first): the others cover p10-p90 [A18-A20]
const VARIANTS = {
  swell: [['swell-1', 4], ['swell-2', 3], ['swell-3', 2], ['swell-4', 1]],
  boom: [['boom-1', 4], ['boom-2', 3], ['boom-3', 1], ['boom-4', 2]],
  ping: [['ping-1', 4], ['ping-2', 3], ['ping-3', 2], ['ping-4', 1]],
};
// Textures: [length of the steady part (s), file]; the one closest to the action plays [A22]
const TEXTURES = {
  reel: [[1.0, 'reel-10'], [1.8, 'reel-18'], [3.2, 'reel-32']],
  printer: [[1.0, 'printer-10'], [1.8, 'printer-18'], [3.2, 'printer-32']],
};
// loud effects per second: about 2 per 10 s [A25]; the pad-bed clips add about 1 boom per 10 s (booms 3.7 per 10 s
// there against 0.6 under a drum bed, the other effects alike) [A19; this build]
const RATE = { beat: 0.2, pad: 0.3 };
const MIN_GAP = 0.65;          // s between loud effect starts: late clips p5 0.65, p10 0.81 (n 39) [this build]
// cuts carrying an effect, and what sits on them (share of cuts; hits have no family here) with its start after the
// cut frame (median offsets): 1 in 7 overall (54/361) [A21], split by the bed: the five pad-bed clips (88 cuts) and
// the other fourteen (279 cuts) [this build]
const ON_CUTS = {
  pad: { share: 0.24, kinds: [['boom', 0.205, -0.005], ['swell', 0.034, 0.017], ['ping', 0.034, 0.021]] },
  beat: { share: 0.12, kinds: [['swell', 0.05, 0.017], ['ping', 0.029, 0.021], ['boom', 0.022, -0.005]] },
};
const PAD_BEDS = ['c'];        // the style's pulse-free bed (style.head.json); no bed counts as no bass too
const PAIR = { share: 0.37, after: 0.327 };   // a boom 0.33 s after the start of one swell in three (22/60) [A18]
const OPENING = { share: 4 / 19, at: F(3), files: ['swell-4', 'swell-3'] };   // frames 0-9, 0.95-2.0 s long [A23]
// Graphic events and the effects they carry: per event, the share that carries each kind (kept when it is at least
// twice the chance share for that kind and seen 3+ times) [this build]
const TIES = {
  pulse: [['ping', 9 / 54], ['swell', 7 / 54], ['boom', 7 / 54]],
  grow: [['boom', 6 / 40], ['swell', 3 / 40], ['ping', 3 / 40]],
  recolor: [['ping', 3 / 15]],
  fill: [['boom', 6 / 73], ['ping', 6 / 73]],
  fade: [['boom', 5 / 58], ['ping', 4 / 58]],
  pop: [['ping', 13 / 197]],
  badge: [['boom', 8 / 98]],
  type: [['swell', 3 / 69]],
};
// Motus beats -> the measured event groups (the explain study's event types, X_events.csv)
const GROUP = {
  'prop/pulse': 'pulse', 'prop/recolor': 'recolor', 'prop/fill': 'fill', 'prop/badge': 'badge',
  'value-bar/fill': 'fill', 'value-bar/flag': 'badge', 'big-number/change': 'fill',
  'item-set/add': 'pop', 'item-stack/add': 'pop', 'item-stack/mark': 'badge', 'checklist/tick': 'badge',
  'code-window/mark': 'badge', 'file-drop/drop': 'badge', 'picker/pick': 'badge', 'picker/open': 'pop',
  'window/status': 'badge', 'window/result': 'pop', 'key-caps/result': 'pop', 'title-card/word': 'pop',
  'prompt/type': 'type', 'prompt/answer': 'type',
};
const SHOW = { grow: 'grow', pop: 'pop', land: 'pop', fade: 'fade' };   // prop `show` by its `how`
// a prop part's motion time, as src/elements/prop.js draws it: move 14 frames, `slow` 32, a show 12 [X03, X20, M10]
const MOVE = F(14), SLOW = F(32), SHOW_DUR = F(12);
const MERGE = 0.8;             // motions closer than this form one action (by eye: one spoken clause)
const PRINTS = /sheet|paper|page|receipt|ticket|strip|print/i;          // parts that come out of a slot
const PRINTERS = /printer|shredder|receipt|register|till|fax/i;         // props whose moving parts are a mechanism

/**
 * The sound events of one video: [{ t, sfx, gainDb }] on the output timeline.
 * S: the style context (S.kit.hash, S.doc: its duration and audio.music.bed); scenes: the resolved scenes;
 * instances: the composition's element instances after their beats are timed (reads it.tIn, it.tOut, it.def.type,
 * it.beats, it.spec only). Compile calls it once and returns the result as `audio`.
 */
export function soundEvents(S, scenes, instances) {
  const duration = S.doc?.duration ?? (scenes.length ? scenes[scenes.length - 1].end : 0);
  if (!scenes.length || !(duration > 0)) return [];
  const id = scenes.map((s) => `${s.id}@${(+s.start).toFixed(2)}`).join(',');
  const u = (key) => (S.kit.hash(`${id}|${key}`) >>> 0) / 4294967296;
  const layoutOf = (sc) => sc?.option?.layout || 'split';
  const music = S.doc?.audio?.music;
  const bedKind = !music || PAD_BEDS.includes(music.bed) ? 'pad' : 'beat';

  // nothing in the closing call to action [A24]
  const last = scenes[scenes.length - 1];
  const closeAt = layoutOf(last) === 'speaker' || last.role === 'cta' ? last.start : duration;
  const inside = (t) => t >= 0 && t < closeAt - 0.05 && t < duration - 0.05;

  const cand = [];   // { t, kind, file?, prio, key }
  // ---- textures: spins and printing, as long as the action [A22]
  for (const it of instances) {
    if (it.def?.type !== 'prop') continue;
    const name = `${it.spec?.name || ''} ${it.spec?.src || ''}`;
    const spans = { reel: [], printer: [] };
    for (const b of it.beats || []) {
      if (b.do === 'spin' && !b.stop) {
        const stop = (it.beats || []).find((c) => c.do === 'spin' && c.stop && c.part === b.part && c.t > b.t);
        spans.reel.push([b.t, Math.min(stop ? stop.t : it.tOut, it.tOut)]);
      }
      const printing = PRINTS.test(b.part || '') || PRINTERS.test(name);
      if (printing && b.do === 'move') spans.printer.push([b.t, b.t + (b.ease === 'slow' ? SLOW : MOVE)]);
      if (printing && b.do === 'show' && (b.how || 'slide') === 'slide') spans.printer.push([b.t, b.t + SHOW_DUR]);
    }
    for (const [kind, list] of Object.entries(spans)) {
      list.sort((a, b) => a[0] - b[0]);
      const merged = [];
      for (const s of list) { const m = merged[merged.length - 1]; if (m && s[0] <= m[1] + MERGE) m[1] = Math.max(m[1], s[1]); else merged.push([...s]); }
      for (const [a, b] of merged) {
        const len = Math.min(b, it.tOut + 0.3) - a;
        if (!(len > 0.2) || !inside(a)) continue;
        const file = TEXTURES[kind].reduce((best, v) => (Math.abs(v[0] - len) < Math.abs(best[0] - len) ? v : best))[1];
        cand.push({ t: a, kind, file, prio: 1, key: `tex/${kind}/${a.toFixed(3)}` });
      }
    }
  }
  // ---- the opening swell, in one video of five [A23]
  if (u('opening') < OPENING.share) cand.push({ t: OPENING.at, kind: 'swell', file: OPENING.files[u('opening/file') < 0.5 ? 0 : 1], prio: 2, key: 'opening' });
  // ---- graphic events: ring pulses first, then the other measured ties
  for (const it of instances) {
    const type = it.def?.type;
    if (!type || type === 'comment-keyword') continue;
    for (const b of it.beats || []) {
      const group = type === 'prop' && b.do === 'show' ? SHOW[b.how || 'slide'] : GROUP[`${type}/${b.do}`];
      const ties = group && TIES[group];
      if (!ties || !inside(b.t)) continue;
      const key = `beat/${type}/${b.do}/${b.part ?? b.item ?? ''}/${b.t.toFixed(3)}`;
      let x = u(key);
      for (const [kind, share] of ties) {
        if (x < share) { cand.push({ t: b.t, kind, prio: group === 'pulse' ? 3 : 5, key }); break; }
        x -= share;
      }
    }
  }
  // ---- whole-frame cuts, about 1 in 7 [A21]
  const cuts = [];
  for (let k = 1; k < scenes.length; k++) {
    const sc = scenes[k], prev = scenes[k - 1], at = sc.start;
    const fresh = instances.some((it) => Math.abs(it.tIn - at) < 1e-6 && it.def?.type !== 'comment-keyword');
    const changed = layoutOf(sc) !== layoutOf(prev);
    if (!changed && !fresh) continue;   // the same picture continues: no cut
    const whole = changed || layoutOf(sc) === 'full';   // a new split graphic changes only the panel
    cuts.push({ at, whole });
  }
  const oc = ON_CUTS[bedKind];
  const want = Math.round(cuts.length * oc.share);
  const wholeCuts = cuts.filter((c) => c.whole && inside(c.at)).sort((a, b) => u(`cut/${a.at.toFixed(3)}`) - u(`cut/${b.at.toFixed(3)}`));
  const total = oc.kinds.reduce((s, [, n]) => s + n, 0);
  for (const c of wholeCuts.slice(0, want)) {
    let x = u(`cut/kind/${c.at.toFixed(3)}`) * total;
    const [kind, , off] = oc.kinds.find(([, n]) => (x -= n) < 0) || oc.kinds[0];
    cand.push({ t: Math.max(0, c.at + off), kind, prio: 4, key: `cut/${c.at.toFixed(3)}` });
  }

  // ---- choose: by priority, then by hash; keep the budget and the spacing
  const budget = Math.max(1, Math.round(duration * RATE[bedKind]));
  cand.sort((a, b) => a.prio - b.prio || u(a.key) - u(b.key));
  const chosen = [];
  const free = (t, except) => chosen.every((e) => e === except || Math.abs(e.t - t) >= MIN_GAP);
  for (const c of cand) {
    if (chosen.length >= budget) break;
    if (!free(c.t)) continue;
    chosen.push(c);
    const tb = c.t + PAIR.after;
    if (c.kind === 'swell' && chosen.length < budget && u(`pair/${c.key}`) < PAIR.share && inside(tb) && free(tb, c)) {
      chosen.push({ t: tb, kind: 'boom', key: `pair/${c.key}` });
    }
  }
  // ---- the files, in time order: a weighted variant, never the same file twice running
  chosen.sort((a, b) => a.t - b.t);
  const lastOf = {};
  return chosen.map((c) => {
    let sfx = c.file;
    if (!sfx) {
      const list = VARIANTS[c.kind], sum = list.reduce((s, [, w]) => s + w, 0);
      let x = u(`variant/${c.key}`) * sum, i = list.findIndex(([, w]) => (x -= w) < 0);
      if (i < 0) i = 0;
      if (list[i][0] === lastOf[c.kind]) i = (i + 1) % list.length;
      sfx = list[i][0];
    }
    lastOf[c.kind] = sfx;
    return { t: Math.round(c.t * 1000) / 1000, sfx, gainDb: GAIN[sfx] };
  });
}
