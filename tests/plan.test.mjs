import { mkWords, minimalManifest, fakeProject, tmpDir } from './helpers.mjs';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { validateEdit, sceneTimes, resolveDoc, resolveAudio, reviewModel, hashOf } from '../engine/lib/plan.mjs';
import { loadStyle } from '../engine/lib/styles.mjs';

const WORDS = mkWords('So here is the thing about editing video it takes forever honestly'.split(' '));   // 12 words, 0.2-3.74 s
const FPS = [30000, 1001];
const TIMELINE = { fps: FPS, frames: 120, duration: (120 * 1001) / 30000 };
const fpsOf = (r) => r[0] / r[1];

const opt = (id, layout, text, beats) => ({
  id, label: `Option ${id}`, why: 'because', layout,
  slots: text === null ? {} : { card: { type: 'note', key: 'n', text, ...(beats ? { beats } : {}) } },
});
function base() {
  return {
    motus: 1, style: 'minimal',
    look: { accent: 'lime' },
    captions: { fixes: { 2: 'IS' }, emphasis: { 3: 'accent' }, breaks: [4], hide: [[10, 11]] },
    scenes: [
      { id: 's01', words: [0, 3], role: 'hook', options: [opt('a', 'split', 'Hello'), opt('b', 'full', 'Big')], pick: 'b' },
      { id: 's02', words: [4, 7], role: 'body', options: [opt('a', 'split', 'Two'), opt('b', 'full', null)] },
      { id: 's03', words: [8, 11], role: 'cta', single: true, options: [opt('a', 'split', 'End', [{ at: 9, do: 'flash' }, { at: { rel: 0.2 }, do: 'flash' }])] },
    ],
    audio: { sfx: true },
  };
}
const check = (edit, { words = WORDS, manifest = minimalManifest(), projectDir, timeline = TIMELINE } = {}) => validateEdit(edit, { words, manifest, projectDir, timeline });
const paths = (list) => list.map((e) => e.path);
/** Mutate a fresh base plan, validate, and return the errors. */
const errorsOf = (mutate, o) => { const e = base(); mutate(e); return check(e, o).errors; };
const hasError = (errs, p, re) => errs.some((e) => e.path === p && (!re || re.test(`${e.message} ${e.fix || ''}`)));

describe('validateEdit', () => {
  test('the base plan is valid with no warnings', () => {
    const r = check(base());
    assert.deepEqual(r.errors, []);
    assert.deepEqual(r.warnings, []);
  });

  test('every error carries a path and a message', () => {
    const errs = errorsOf((e) => { e.colour = 1; e.scenes[1].words = [5, 7]; e.scenes[0].options[0].layout = 'grid'; });
    assert.ok(errs.length >= 3);
    for (const x of errs) { assert.equal(typeof x.path, 'string'); assert.ok(x.message); }
  });

  test('unknown fields at every level are errors', () => {
    assert.ok(hasError(errorsOf((e) => { e.colour = 1; }), 'colour'));
    assert.ok(hasError(errorsOf((e) => { e.captions.colour = 1; }), 'captions.colour'));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].duration = 3; }), 'scenes[0](s01).duration'));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[0].colour = 'red'; }), 'scenes[0](s01).options[0](a).colour'));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[0].slots.card.colour = 'red'; }), 'scenes[0](s01).options[0](a).slots.card.colour', /Parameters: text/));
    assert.ok(hasError(errorsOf((e) => { e.audio.volume = 1; }), 'audio.volume'));
  });

  test('document header: version and style', () => {
    assert.ok(hasError(errorsOf((e) => { e.motus = 2; }), 'motus'));
    assert.ok(hasError(errorsOf((e) => { e.style = 'other'; }), 'style'));
  });

  test('look keys and choices come from the manifest', () => {
    assert.ok(hasError(errorsOf((e) => { e.look.size = 'big'; }), 'look.size'));
    assert.ok(hasError(errorsOf((e) => { e.look.accent = 'red'; }), 'look.accent', /blue, lime/));
  });

  test('captions: word indices, emphasis kinds, fixes, breaks, hide', () => {
    assert.ok(hasError(errorsOf((e) => { e.captions.emphasis = { 3: 'bold' }; }), 'captions.emphasis.3'));
    assert.ok(hasError(errorsOf((e) => { e.captions.emphasis = { 99: 'accent' }; }), 'captions.emphasis.99', /0-11/));
    assert.ok(hasError(errorsOf((e) => { e.captions.fixes = { 1: 5 }; }), 'captions.fixes.1'));
    assert.ok(hasError(errorsOf((e) => { e.captions.breaks = [50]; }), 'captions.breaks[0]'));
    assert.ok(hasError(errorsOf((e) => { e.captions.hide = [[5, 2]]; }), 'captions.hide[0]'));
    assert.ok(hasError(errorsOf((e) => { e.captions.hide = [[5, 20]]; }), 'captions.hide[0][1]'));
    // not lists: an error, not a crash
    assert.ok(hasError(errorsOf((e) => { e.captions.breaks = 4; }), 'captions.breaks'));
    assert.ok(hasError(errorsOf((e) => { e.captions.hide = { a: 1 }; }), 'captions.hide'));
  });

  test('scenes must be a non-empty list of objects with unique ids', () => {
    assert.ok(hasError(errorsOf((e) => { e.scenes = []; }), 'scenes'));
    assert.ok(hasError(errorsOf((e) => { delete e.scenes; }), 'scenes'));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].id = 'S 1'; }), 'scenes[0](S 1).id'));
    assert.ok(hasError(errorsOf((e) => { e.scenes[1].id = 's01'; }), 'scenes[1](s01).id', /twice/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[1] = 'nope'; }), 'scenes[1]'));
  });

  test('tiling: gaps, overlaps, first scene, last scene, reversed, past the end', () => {
    assert.ok(hasError(errorsOf((e) => { e.scenes[1].words = [5, 7]; }), 'scenes[1](s02).words', /should start at 4/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[1].words = [3, 7]; }), 'scenes[1](s02).words', /should start at 4/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].words = [1, 3]; }), 'scenes[0](s01).words', /first scene must start at word 0/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[2].words = [8, 10]; }), 'scenes', /runs to word 11/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[2].words = [11, 8]; }), 'scenes[2](s03).words', /comes after/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[2].words = [8, 12]; }), 'scenes[2](s03).words', /past the end/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[2].words = [8]; }), 'scenes[2](s03).words'));
    assert.ok(hasError(errorsOf((e) => { e.scenes[2].words = [8, 11.5]; }), 'scenes[2](s03).words'));
  });

  test('single-word scenes tile', () => {
    const e = base();
    const o = e.scenes[0].options;
    e.scenes = WORDS.map((w, k) => ({ id: `s${k}`, words: [k, k], options: o }));
    assert.deepEqual(check(e).errors, []);
  });

  test('a transcript with no words gives one error with a fix, not a cascade', () => {
    const e = base(); delete e.captions;
    const r = check(e, { words: [] });
    assert.equal(r.errors.length, 1);
    assert.equal(r.errors[0].path, 'scenes');
    assert.match(r.errors[0].fix, /transcript/);
  });

  test('options: count, single, ids, labels, pick', () => {
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options = []; }), 'scenes[0](s01).options'));
    assert.ok(hasError(errorsOf((e) => { const o = e.scenes[0].options[0]; e.scenes[0].options = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ ...o, id })); }), 'scenes[0](s01).options', /limit is 4/));
    const one = base(); one.scenes[1].options = [one.scenes[1].options[0]];
    assert.deepEqual(paths(check(one).warnings), ['scenes[1](s02).options']);
    one.scenes[1].single = true;
    assert.deepEqual(check(one).warnings, []);
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[1].id = 'a'; }), 'scenes[0](s01).options[1](a).id', /twice/));
    assert.ok(hasError(errorsOf((e) => { delete e.scenes[0].options[1].label; }), 'scenes[0](s01).options[1](b).label'));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].pick = 'z'; }), 'scenes[0](s01).pick', /a, b/));
  });

  test('layouts, slots and element types come from the manifest', () => {
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[0].layout = 'grid'; }), 'scenes[0](s01).options[0](a).layout', /split, full/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[0].slots.title = { type: 'note', text: 'x' }; }), 'scenes[0](s01).options[0](a).slots.title', /Slots: card/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[0].slots.card.type = 'ghost'; }), 'scenes[0](s01).options[0](a).slots.card.type', /Allowed here: note/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[0].slots = 'card'; }), 'scenes[0](s01).options[0](a).slots'));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[0].slots.card = 'note'; }), 'scenes[0](s01).options[0](a).slots.card'));
    // a slot may be emptied explicitly
    assert.deepEqual(errorsOf((e) => { e.scenes[0].options[0].slots.card = null; }), []);
    // the layout allows a type the manifest never defines
    const m = minimalManifest(); m.layouts.split.slots.card.push('ghost');
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[0].slots.card.type = 'ghost'; }, { manifest: m }), 'scenes[0](s01).options[0](a).slots.card.type', /does not define/));
    // required slots
    const r = minimalManifest(); r.layouts.full.required = ['card'];
    assert.ok(hasError(errorsOf(() => {}, { manifest: r }), 'scenes[1](s02).options[1](b).slots.card', /required/));
  });

  test('element parameters: required, types, text limits', () => {
    const P = 'scenes[0](s01).options[0](a).slots.card';
    assert.ok(hasError(errorsOf((e) => { delete e.scenes[0].options[0].slots.card.text; }), `${P}.text`, /required/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[0].slots.card.text = 7; }), `${P}.text`, /text/));
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[0].slots.card.text = 'x'.repeat(41); }), `${P}.text`, /41 characters.*at most 40/));
    assert.deepEqual(errorsOf((e) => { e.scenes[0].options[0].slots.card.text = 'é'.repeat(40); }), []);   // counted in characters, not bytes
    assert.ok(hasError(errorsOf((e) => { e.scenes[0].options[0].slots.card.key = 3; }), `${P}.key`));
    // the richer spec forms
    const m = minimalManifest();
    m.elements.note.params = {
      text: 'string', n: { type: 'number', min: 1, max: 3 }, on: 'boolean?', kind: 'enum:a|b', w: 'word', img: 'asset?',
      rows: { type: 'array', min: 1, max: 2, of: { name: 'string', price: 'string?' } }, words: { type: 'string', maxWords: 2 },
    };
    const el = (x) => errorsOf((e) => { e.scenes[0].options[0].slots.card = { type: 'note', text: 't', n: 2, kind: 'a', w: 1, rows: [{ name: 'x' }], words: 'a b', ...x }; }, { manifest: m })
      .filter((x) => x.path.startsWith(P));        // the other options use the plain note
    assert.deepEqual(el({}), []);
    assert.ok(hasError(el({ n: 5 }), `${P}.n`, /at most 3/));
    assert.ok(hasError(el({ n: '2' }), `${P}.n`));
    assert.ok(hasError(el({ on: 'yes' }), `${P}.on`));
    assert.ok(hasError(el({ kind: 'c' }), `${P}.kind`, /a, b/));
    assert.ok(hasError(el({ w: 12 }), `${P}.w`, /0 and 11/));
    assert.ok(hasError(el({ rows: [] }), `${P}.rows`, /at least 1/));
    assert.ok(hasError(el({ rows: [{ name: 'x', cost: 1 }] }), `${P}.rows[0].cost`, /not a known field/));
    assert.ok(hasError(el({ rows: [{}] }), `${P}.rows[0].name`, /required/));
    assert.ok(hasError(el({ words: 'a b c' }), `${P}.words`, /3 words/));
    assert.ok(hasError(el({ img: '../secret.png' }), `${P}.img`, /under assets/));
  });

  test('asset references must exist under assets/', () => {
    const dir = tmpDir();
    try {
      fs.mkdirSync(path.join(dir, 'assets'));
      fs.writeFileSync(path.join(dir, 'assets', 'shot one.png'), '');
      const m = minimalManifest(); m.elements.note.params.img = 'asset';
      const P = 'scenes[0](s01).options[0](a).slots.card.img';
      const el = (img) => errorsOf((e) => { e.scenes[0].options[0].slots.card.img = img; }, { manifest: m, projectDir: dir }).filter((x) => x.path === P);
      assert.deepEqual(el('assets/shot one.png'), []);
      assert.deepEqual(el('./assets/shot one.png'), []);
      assert.ok(hasError(el('assets/missing.png'), P, /file not found/));
      assert.ok(hasError(el('shot one.png'), P, /under assets/));
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });

  test('beats: kind, parameters, and anchoring inside their own scene', () => {
    const B = 'scenes[2](s03).options[0](a).slots.card.beats[0]';
    const beat = (b, o) => errorsOf((e) => { e.scenes[2].options[0].slots.card.beats = [b]; }, o);
    assert.deepEqual(beat({ at: 8, do: 'flash' }), []);
    assert.deepEqual(beat({ at: 11, do: 'flash' }), []);
    assert.ok(hasError(beat({ at: 9, do: 'spin' }), `${B}.do`, /Beats: flash/));
    assert.ok(hasError(beat({ at: 9, do: 'flash', speed: 2 }), `${B}.speed`));
    assert.ok(hasError(beat({ at: 7, do: 'flash' }), `${B}.at`, /outside this scene \(words 8-11\)/));
    assert.ok(hasError(beat({ at: 8.5, do: 'flash' }), `${B}.at`, /integer/));
    assert.ok(hasError(beat({ at: 'soon', do: 'flash' }), `${B}.at`));
    assert.ok(hasError(beat({ do: 'flash' }), `${B}.at`));
    assert.ok(hasError(beat({ at: { when: 1 }, do: 'flash' }), `${B}.at`));
    assert.ok(hasError(beat({ at: { rel: 0.1, x: 1 }, do: 'flash' }), `${B}.at.x`));
    assert.ok(hasError(beat('flash'), B));
    // timed beats: s03 runs from about 2.53 s to the end (4.004 s)
    assert.deepEqual(beat({ at: { rel: 0 }, do: 'flash' }), []);
    assert.deepEqual(beat({ at: { t: 3.9 }, do: 'flash' }), []);
    assert.ok(hasError(beat({ at: { t: 0.5 }, do: 'flash' }), `${B}.at`, /outside this scene/));
    assert.ok(hasError(beat({ at: { t: 4.5 }, do: 'flash' }), `${B}.at`, /outside this scene/));
    assert.ok(hasError(beat({ at: { rel: 5 }, do: 'flash' }), `${B}.at`, /outside this scene/));
    assert.ok(hasError(beat({ at: { rel: -0.5 }, do: 'flash' }), `${B}.at`, /outside this scene/));
    // without a timeline the times cannot be checked: no false errors
    assert.deepEqual(beat({ at: { t: 0.5 }, do: 'flash' }, { timeline: null }), []);
    // beats that are not a list
    assert.ok(hasError(errorsOf((e) => { e.scenes[2].options[0].slots.card.beats = { at: 9, do: 'flash' }; }), 'scenes[2](s03).options[0](a).slots.card.beats', /list/));
  });

  test('scene start override is checked', () => {
    assert.ok(hasError(errorsOf((e) => { e.scenes[1].start = 'soon'; }), 'scenes[1](s02).start'));
    assert.ok(hasError(errorsOf((e) => { e.scenes[1].start = 9; }), 'scenes[1](s02).start', /past the end/));
    const w = base(); w.scenes[0].start = 0.5;
    assert.deepEqual(paths(check(w).warnings), ['scenes[0](s01).start']);
    assert.deepEqual(errorsOf((e) => { e.scenes[1].start = 1.2; }), []);
  });

  test('audio fields', () => {
    assert.ok(hasError(errorsOf((e) => { e.audio.sfx = 'yes'; }), 'audio.sfx'));
    assert.ok(hasError(errorsOf((e) => { e.audio.bed = 'jazz'; }), 'audio.bed', /none/));
    assert.deepEqual(errorsOf((e) => { e.audio.bed = 'none'; }), []);
    assert.ok(hasError(errorsOf((e) => { e.audio.musicGainDb = -3; }), 'audio.musicGainDb'));
    assert.ok(hasError(errorsOf((e) => { e.audio.musicGainDb = 'loud'; }), 'audio.musicGainDb'));
    assert.deepEqual(errorsOf((e) => { e.audio.musicGainDb = -24; e.audio.music = null; }), []);
    assert.ok(hasError(errorsOf((e) => { e.audio.music = 'song.mp3'; }), 'audio.music', /under assets/));
    const m = minimalManifest(); m.beds = { calm: { src: 'assets/calm.wav' } };
    assert.deepEqual(errorsOf((e) => { e.audio.bed = 'calm'; }, { manifest: m }), []);
  });

  test('pacing warning for long scenes', () => {
    const e = base();
    e.scenes = [{ ...e.scenes[0], words: [0, 11] }];
    const r = check(e, { timeline: { fps: FPS, frames: 3000, duration: 100.1 } });
    assert.deepEqual(paths(r.warnings), ['scenes']);
  });
});

describe('sceneTimes', () => {
  const fps = fpsOf(FPS);
  const onFrame = (t) => Math.abs(t * fps - Math.round(t * fps)) < 1e-6;

  test('starts on whole frames at 30000/1001, tile the timeline, lead the first word', () => {
    const e = base();
    const times = sceneTimes(e.scenes, WORDS, TIMELINE, 0.066);
    assert.equal(times[0].start, 0);
    assert.equal(times[times.length - 1].end, TIMELINE.duration);
    for (let k = 0; k < times.length; k++) {
      assert.ok(onFrame(times[k].start), `scene ${k} starts on a frame`);
      assert.ok(times[k].end > times[k].start);
      if (k) assert.equal(times[k].start, times[k - 1].end);
    }
    // s02 starts about 66 ms before its first word, never after it
    const w = WORDS[4].start;
    assert.ok(times[1].start <= w && times[1].start >= w - 0.066 - 1 / fps, `${times[1].start} vs ${w}`);
    // the stage draws frame n at n/fps: the frame where s02 begins is exactly its start
    const n = Math.round(times[1].start * fps);
    assert.ok(n / fps >= times[1].start && (n - 1) / fps < times[1].start);
  });

  test('never reaches back further than 0.2 s before the previous word ends', () => {
    const words = WORDS.map((w) => ({ ...w }));
    const times = sceneTimes(base().scenes, words, TIMELINE, 1.5);   // a huge lead
    assert.ok(times[1].start >= Math.min(words[3].end, words[4].start) - 0.2 - 1 / fps);
  });

  test('an explicit start is snapped; colliding starts are pushed two frames apart', () => {
    const e = base();
    e.scenes[1].start = 1.0;
    assert.equal(sceneTimes(e.scenes, WORDS, TIMELINE)[1].start, Math.round(1.0 * fps) / fps);
    const words = WORDS.map((w) => ({ ...w }));
    words[5].start = words[4].start; words[4].end = words[4].start + 0.01;
    const scenes = [{ words: [0, 3] }, { words: [4, 4] }, { words: [5, 11] }];
    const t = sceneTimes(scenes, words, TIMELINE);
    assert.equal(Math.round((t[2].start - t[1].start) * fps), 2);
  });

  test('one scene per word stays strictly increasing', () => {
    const scenes = WORDS.map((w, k) => ({ words: [k, k] }));
    const t = sceneTimes(scenes, WORDS, TIMELINE);
    for (let k = 1; k < t.length; k++) assert.ok(t[k].start > t[k - 1].start);
  });
});

describe('resolveDoc and reviewModel', () => {
  async function plan(edit = base(), state = { scenes: {}, look: {}, note: '' }) {
    const style = await loadStyle('minimal');
    return { edit, state, words: WORDS, timeline: { ...TIMELINE, hasMatte: false }, style, project: fakeProject() };
  }

  test('resolves picks: user state, then the agent pick, then the first option', async () => {
    const doc = resolveDoc(await plan());
    assert.deepEqual(doc.scenes.map((s) => s.pick), ['b', 'a', 'a']);
    assert.equal(doc.scenes[0].option.layout, 'full');
    const p2 = await plan(base(), { scenes: { s01: { pick: 'a' }, s02: { pick: 'zz' } } });
    assert.deepEqual(resolveDoc(p2).scenes.map((s) => s.pick), ['a', 'a', 'a']);
  });

  test('force previews one option of one scene and ignores unknown options', async () => {
    const p = await plan();
    assert.deepEqual(resolveDoc(p, { scene: 's02', option: 'b' }).scenes.map((s) => s.pick), ['b', 'b', 'a']);
    assert.deepEqual(resolveDoc(p, { scene: 's02', option: 'zz' }).scenes.map((s) => s.pick), ['b', 'a', 'a']);
  });

  test('captions, words, look and timing in the resolved document', async () => {
    const e = base(); e.captions.fixes[1] = '';
    const doc = resolveDoc(await plan(e, { scenes: {}, look: { accent: 'blue' } }));
    assert.equal(doc.words[2].w, 'IS');
    assert.equal(doc.words[3].emph, 'accent');
    assert.equal(doc.scenes[0].say, 'So IS the');
    assert.deepEqual(doc.captions, { breaks: [4], hide: [[10, 11]] });
    assert.deepEqual(doc.look, { accent: 'blue' });                  // the user's choice beats the plan's
    assert.deepEqual(resolveDoc(await plan()).look, { accent: 'lime' });
    const none = base(); delete none.look;
    assert.deepEqual(resolveDoc(await plan(none)).look, { accent: 'blue' });   // manifest default
    assert.equal(doc.fps, 30000 / 1001);
    assert.deepEqual(doc.fpsRational, FPS);
    assert.equal(doc.frames, 120);
    assert.equal(doc.width, 1080);
    assert.equal(doc.scenes[2].end, TIMELINE.duration);
    assert.equal(JSON.parse(JSON.stringify(doc)).scenes[1].start, doc.scenes[1].start);   // exact through JSON
  });

  test('stale decisions: a revised scene is no longer decided or locked', async () => {
    const e = base();
    const st = { scenes: { s01: { pick: 'a', locked: true, note: 'shorter', hash: hashOf(e.scenes[0].options) }, s02: { pick: 'b', locked: true } } };
    let m = reviewModel(await plan(e, structuredClone(st)));
    assert.deepEqual([m.scenes[0].decided, m.scenes[0].locked, m.scenes[0].revised], [true, true, false]);
    assert.deepEqual([m.scenes[1].decided, m.scenes[1].locked, m.scenes[1].revised], [true, true, false]);   // no hash recorded: not stale
    assert.equal(m.locked, 2);
    // the agent revises s01's options after the user decided
    e.scenes[0].options[0].slots.card.text = 'Hello again';
    m = reviewModel(await plan(e, structuredClone(st)));
    assert.deepEqual([m.scenes[0].decided, m.scenes[0].locked, m.scenes[0].revised], [false, false, true]);
    assert.equal(m.scenes[0].pick, 'a');                    // the user's pick still names a live option
    assert.equal(m.scenes[0].note, 'shorter');
    assert.equal(m.locked, 1);
    // the picked option disappears: fall back to the agent's recommendation
    e.scenes[0].options = e.scenes[0].options.filter((o) => o.id !== 'a');
    e.scenes[0].pick = 'b';
    m = reviewModel(await plan(e, structuredClone(st)));
    assert.equal(m.scenes[0].pick, 'b');
    assert.equal(m.scenes[0].revised, true);
    assert.equal(m.scenes[0].recommended, 'b');
    assert.equal(m.total, 3);
  });
});

describe('resolveAudio', () => {
  const m = { id: 'x', beds: { calm: { src: 'assets/calm.wav', gainDb: -26 }, drive: { src: 'assets/drive.wav' } } };
  test('style bed by default, named bed, none, project music wins', () => {
    assert.deepEqual(resolveAudio({}, m), { sfx: true, music: { from: 'style', file: 'assets/calm.wav', url: '/styles/x/assets/calm.wav', gainDb: -26, bed: 'calm' } });
    assert.equal(resolveAudio({ audio: { bed: 'drive' } }, m).music.gainDb, -24);
    assert.equal(resolveAudio({ audio: { bed: 'drive', musicGainDb: -30 } }, m).music.gainDb, -30);
    assert.equal(resolveAudio({ audio: { bed: 'none', sfx: false } }, m).music, null);
    assert.equal(resolveAudio({ audio: { sfx: false } }, m).sfx, false);
    assert.deepEqual(resolveAudio({ audio: { music: './assets/song.mp3', bed: 'drive' } }, m).music, { from: 'project', file: 'assets/song.mp3', url: '/project/assets/song.mp3', gainDb: -24, bed: null });
    assert.equal(resolveAudio({}, { id: 'y' }).music, null);
  });
  test('a bed with fadeOut carries it; a bed without has no such field', () => {
    const f = { id: 'z', beds: { a: { src: 'assets/a.m4a', gainDb: -17, fadeOut: 1 }, b: { src: 'assets/b.m4a' } } };
    assert.equal(resolveAudio({}, f).music.fadeOut, 1);
    assert.equal('fadeOut' in resolveAudio({ audio: { bed: 'b' } }, f).music, false);
    assert.equal('fadeOut' in resolveAudio({ audio: { music: 'assets/song.mp3' } }, f).music, false);
  });
});
