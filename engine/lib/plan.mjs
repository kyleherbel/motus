// The edit document: load, validate against the style manifest, and resolve into
// what the stage draws. See docs/ARCHITECTURE.md section 4.
import path from 'node:path';
import crypto from 'node:crypto';
import fss from 'node:fs';
import { readJson, MotusError } from './util.mjs';
import { loadStyle } from './styles.mjs';

const COMMON_ELEMENT_FIELDS = new Set(['type', 'key', 'beats']);
const COMMON_OPTION_FIELDS = new Set(['id', 'label', 'why', 'layout', 'slots', 'presenter', 'sfx']);
const SCENE_FIELDS = new Set(['id', 'words', 'start', 'role', 'options', 'pick', 'note', 'single', 'say']);
const TOP_FIELDS = new Set(['motus', 'style', 'look', 'captions', 'scenes', 'audio', 'notes']);

export const hashOf = (x) => crypto.createHash('sha1').update(JSON.stringify(x)).digest('hex').slice(0, 12);

export async function loadPlan(project) {
  await project.need('conform', 'conform');
  // MOTUS_EDIT points at another plan file: used by style fixtures and tests, never by a real edit.
  const editPath = process.env.MOTUS_EDIT ? path.resolve(process.env.MOTUS_EDIT) : project.path('plan', 'edit.json');
  const edit = await readJson(editPath, null);
  if (!edit) throw new MotusError(`No edit plan at ${editPath}`, 'Write plan/edit.json (see the style\'s STYLE.md and examples/), then run: motus validate');
  const timeline = await readJson(project.path('conform', 'timeline.json'));
  const words = (await readJson(project.path('conform', 'words.json'))).words;
  const state = await readJson(project.path('review', 'state.json'), { scenes: {}, look: {}, note: '' });
  const style = await loadStyle(edit.style || project.json.style);
  return { edit, timeline, words, state, style, project };
}

// ---------------------------------------------------------------- param specs

function normSpec(spec) {
  if (typeof spec === 'string') {
    let s = spec, optional = false;
    if (s.includes('?')) { optional = true; s = s.replace('?', ''); }
    if (s.startsWith('enum:')) return { type: 'enum', values: s.slice(5).split('|'), optional };
    return { type: s, optional };
  }
  if (spec && typeof spec === 'object' && !spec.type) return { type: 'object', fields: spec, optional: false };
  return { optional: false, ...spec };
}

function checkValue(value, rawSpec, where, ctx, errs) {
  const spec = normSpec(rawSpec);
  const err = (message, fix) => errs.push({ path: where, message, fix });
  if (value === undefined || value === null) { if (!spec.optional) err('is required', `Add ${where.split('.').pop()} (${describe(spec)}).`); return; }
  switch (spec.type) {
    case 'string':
      if (typeof value !== 'string') return err(`must be text, got ${typeof value}`);
      if (spec.maxChars && [...value].length > spec.maxChars) err(`is ${[...value].length} characters; the style allows at most ${spec.maxChars}`, 'Shorten it: the style\'s layout breaks beyond this length.');
      if (spec.minChars && [...value].length < spec.minChars) err(`is too short (min ${spec.minChars} characters)`);
      if (spec.maxWords && value.trim().split(/\s+/).length > spec.maxWords) err(`has ${value.trim().split(/\s+/).length} words; the style allows at most ${spec.maxWords}`);
      break;
    case 'number':
      if (typeof value !== 'number' || Number.isNaN(value)) return err(`must be a number, got ${JSON.stringify(value)}`);
      if (spec.min !== undefined && value < spec.min) err(`must be at least ${spec.min}`);
      if (spec.max !== undefined && value > spec.max) err(`must be at most ${spec.max}`);
      break;
    case 'boolean':
      if (typeof value !== 'boolean') err('must be true or false');
      break;
    case 'enum':
      if (!spec.values.includes(value)) err(`is "${value}"; allowed: ${spec.values.join(', ')}`);
      break;
    case 'word':
      if (!Number.isInteger(value) || value < 0 || value >= ctx.wordCount) err(`must be a word index between 0 and ${ctx.wordCount - 1}`);
      break;
    case 'asset': {
      if (typeof value !== 'string') return err('must be a path under the project\'s assets/ folder');
      const clean = value.replace(/^\.?\//, '');
      if (!clean.startsWith('assets/') || clean.includes('..')) return err(`"${value}" must be a path under assets/`, 'Put the file in the project\'s assets/ folder and reference it as "assets/<file>".');
      if (ctx.projectDir && !fss.existsSync(path.join(ctx.projectDir, clean))) err(`file not found: ${clean}`, 'Create or capture the asset first (motus capture …), or remove the reference.');
      break;
    }
    case 'array':
      if (!Array.isArray(value)) return err('must be a list');
      if (spec.min !== undefined && value.length < spec.min) err(`needs at least ${spec.min} item(s), has ${value.length}`);
      if (spec.max !== undefined && value.length > spec.max) err(`allows at most ${spec.max} item(s), has ${value.length}`);
      if (spec.of) value.forEach((v, i) => checkValue(v, spec.of, `${where}[${i}]`, ctx, errs));
      break;
    case 'object': {
      if (typeof value !== 'object' || Array.isArray(value)) return err('must be an object');
      const fields = spec.fields || {};
      for (const k of Object.keys(value)) if (!(k in fields)) errs.push({ path: `${where}.${k}`, message: 'is not a known field', fix: `Known fields: ${Object.keys(fields).join(', ') || '(none)'}.` });
      for (const [k, s] of Object.entries(fields)) checkValue(value[k], s, `${where}.${k}`, ctx, errs);
      break;
    }
    default:
      err(`style manifest uses an unknown param type "${spec.type}"`);
  }
}

function describe(spec) {
  if (spec.type === 'enum') return `one of ${spec.values.join(' | ')}`;
  if (spec.type === 'array') return 'a list';
  return spec.type;
}

// ---------------------------------------------------------------- validation

/**
 * Check an edit document. Returns { errors, warnings }, each [{path, message, fix}].
 * Errors mean the plan cannot be rendered as written.
 */
export function validateEdit(edit, { words, manifest, projectDir, timeline }) {
  const errors = [], warnings = [];
  const E = (path_, message, fix) => errors.push({ path: path_, message, fix });
  const Wn = (path_, message, fix) => warnings.push({ path: path_, message, fix });
  const ctx = { wordCount: words.length, projectDir };

  if (!edit || typeof edit !== 'object') { E('', 'edit.json must contain an object'); return { errors, warnings }; }
  for (const k of Object.keys(edit)) if (!TOP_FIELDS.has(k)) E(k, 'is not a known top-level field', `Known: ${[...TOP_FIELDS].join(', ')}.`);
  if (edit.motus !== 1) E('motus', 'must be 1 (the edit document version)');
  if (edit.style !== manifest.id) E('style', `is "${edit.style}" but the loaded style is "${manifest.id}"`);

  // look
  const lookSpec = manifest.look || {};
  for (const [k, v] of Object.entries(edit.look || {})) {
    if (!lookSpec[k]) E(`look.${k}`, 'is not a look option of this style', `Options: ${Object.keys(lookSpec).join(', ') || '(none)'}.`);
    else if (lookSpec[k].choices && !lookSpec[k].choices.includes(v)) E(`look.${k}`, `is "${v}"; choices: ${lookSpec[k].choices.join(', ')}`);
  }

  // captions
  const cap = edit.captions || {};
  const kinds = manifest.emphasis || [];
  const wordIndex = (s, where) => { const i = Number(s); if (!Number.isInteger(i) || i < 0 || i >= words.length) { E(where, `"${s}" is not a word index (0-${words.length - 1})`); return false; } return true; };
  for (const [i, kind] of Object.entries(cap.emphasis || {})) {
    if (wordIndex(i, `captions.emphasis.${i}`) && !kinds.includes(kind)) E(`captions.emphasis.${i}`, `"${kind}" is not an emphasis kind of this style`, `Kinds: ${kinds.join(', ')}.`);
  }
  for (const [i, text] of Object.entries(cap.fixes || {})) {
    if (wordIndex(i, `captions.fixes.${i}`) && typeof text !== 'string') E(`captions.fixes.${i}`, 'must be text (use "" to drop the word from captions)');
  }
  const list = (v, where, shape) => { if (v === undefined) return []; if (Array.isArray(v)) return v; E(where, `must be a list ${shape}`); return []; };
  list(cap.breaks, 'captions.breaks', 'of word indices').forEach((i, k) => wordIndex(i, `captions.breaks[${k}]`));
  list(cap.hide, 'captions.hide', 'of [firstWord, lastWord] ranges').forEach((r, k) => { if (!Array.isArray(r) || r.length !== 2 || r[0] > r[1]) E(`captions.hide[${k}]`, 'must be [firstWord, lastWord]'); else { wordIndex(r[0], `captions.hide[${k}][0]`); wordIndex(r[1], `captions.hide[${k}][1]`); } });
  for (const k of Object.keys(cap)) if (!['fixes', 'emphasis', 'breaks', 'hide'].includes(k)) E(`captions.${k}`, 'is not a known captions field');

  // scenes
  const scenes = edit.scenes;
  if (!Array.isArray(scenes) || !scenes.length) { E('scenes', 'must be a non-empty list'); return { errors, warnings }; }
  if (!words.length) {
    E('scenes', 'cannot be anchored: the conformed transcript has no words', 'Motus plans scenes on spoken words. Check that the kept ranges in plan/cuts.json contain speech (analysis/transcript.json), re-run motus ingest with --transcript <words.json> if the speech model missed it, then motus conform.');
    return { errors, warnings };
  }
  const ids = new Set();
  const timedBeats = [];                  // {t}/{rel} beats, checked against scene times once the tiling is known
  let expect = 0;
  scenes.forEach((sc, k) => {
    const sp = `scenes[${k}]${sc && sc.id ? `(${sc.id})` : ''}`;
    if (!sc || typeof sc !== 'object') return E(sp, 'must be an object');
    for (const f of Object.keys(sc)) if (!SCENE_FIELDS.has(f)) E(`${sp}.${f}`, 'is not a known scene field', `Known: ${[...SCENE_FIELDS].join(', ')}.`);
    if (!sc.id || typeof sc.id !== 'string' || !/^[a-z0-9][a-z0-9_-]*$/i.test(sc.id)) E(`${sp}.id`, 'must be a short id such as "s01"');
    else if (ids.has(sc.id)) E(`${sp}.id`, `"${sc.id}" is used twice`); else ids.add(sc.id);
    if (manifest.roles && sc.role && !manifest.roles.includes(sc.role)) Wn(`${sp}.role`, `"${sc.role}" is not one of the style's roles (${manifest.roles.join(', ')})`);

    // word range and tiling
    let w0 = null, w1 = null;
    if (!Array.isArray(sc.words) || sc.words.length !== 2 || !Number.isInteger(sc.words[0]) || !Number.isInteger(sc.words[1])) {
      E(`${sp}.words`, 'must be [firstWordIndex, lastWordIndex]');
    } else {
      [w0, w1] = sc.words;
      if (w0 > w1) E(`${sp}.words`, `first word ${w0} comes after last word ${w1}`);
      if (w1 >= words.length) E(`${sp}.words`, `last word ${w1} is past the end of the transcript (last index ${words.length - 1})`);
      if (w0 !== expect) {
        if (k === 0) E(`${sp}.words`, `starts at word ${w0}; the first scene must start at word 0`, 'Speech-free head and the first words belong to the first scene: start it at 0.');
        else E(`${sp}.words`, `starts at word ${w0} but the previous scene ended at word ${expect - 1}`, `Scenes must tile the transcript with no gaps or overlaps: this one should start at ${expect}.`);
      }
      expect = w1 + 1;
    }
    if (sc.start !== undefined) {
      if (typeof sc.start !== 'number' || !Number.isFinite(sc.start) || sc.start < 0) E(`${sp}.start`, 'must be a time in seconds on the output timeline (a number >= 0)');
      else if (k === 0) Wn(`${sp}.start`, 'is ignored: the first scene always starts at 0');
      else if (timeline && sc.start >= timeline.duration) E(`${sp}.start`, `${sc.start} s is past the end of the video (${timeline.duration.toFixed(3)} s)`);
    }

    // options
    if (!Array.isArray(sc.options) || !sc.options.length) return E(`${sp}.options`, 'must list at least one option');
    if (sc.options.length < 2 && !sc.single) Wn(`${sp}.options`, 'has only one option', 'Give 2-4 genuinely different treatments, or set "single": true if there is only one sensible treatment.');
    if (sc.options.length > 4) E(`${sp}.options`, `has ${sc.options.length} options; the limit is 4`);
    const oids = new Set();
    sc.options.forEach((op, j) => {
      const op_ = `${sp}.options[${j}]${op && op.id ? `(${op.id})` : ''}`;
      if (!op || typeof op !== 'object') return E(op_, 'must be an object');
      for (const f of Object.keys(op)) if (!COMMON_OPTION_FIELDS.has(f)) E(`${op_}.${f}`, 'is not a known option field', `Known: ${[...COMMON_OPTION_FIELDS].join(', ')}.`);
      if (!op.id || typeof op.id !== 'string') E(`${op_}.id`, 'is required ("a", "b", "c")'); else if (oids.has(op.id)) E(`${op_}.id`, `"${op.id}" is used twice in this scene`); else oids.add(op.id);
      if (!op.label || typeof op.label !== 'string') E(`${op_}.label`, 'is required: 2-4 words naming the treatment');
      else if (op.label.split(/\s+/).length > 6) Wn(`${op_}.label`, 'is long; keep it to 2-4 words');
      if (!op.why || typeof op.why !== 'string') Wn(`${op_}.why`, 'is missing: one line telling the user why this treatment fits');
      const layout = manifest.layouts?.[op.layout];
      if (!layout) return E(`${op_}.layout`, `"${op.layout}" is not a layout of this style`, `Layouts: ${Object.keys(manifest.layouts || {}).join(', ')}.`);
      const slots = op.slots || {};
      if (typeof slots !== 'object' || Array.isArray(slots)) return E(`${op_}.slots`, 'must be an object of slot -> element');
      for (const [slot, el] of Object.entries(slots)) {
        const sl = `${op_}.slots.${slot}`;
        const allowed = layout.slots?.[slot];
        if (!allowed) { E(sl, `is not a slot of layout "${op.layout}"`, `Slots: ${Object.keys(layout.slots || {}).join(', ') || '(none)'}.`); continue; }
        if (el === null) continue;
        if (!el || typeof el !== 'object') { E(sl, 'must be an element object'); continue; }
        if (!allowed.includes(el.type)) { E(`${sl}.type`, `"${el.type}" cannot go in slot "${slot}"`, `Allowed here: ${allowed.join(', ')}.`); continue; }
        const def = manifest.elements?.[el.type];
        if (!def) { E(`${sl}.type`, `the style manifest does not define element "${el.type}"`); continue; }
        const params = def.params || {};
        for (const f of Object.keys(el)) if (!COMMON_ELEMENT_FIELDS.has(f) && !(f in params)) E(`${sl}.${f}`, `is not a parameter of "${el.type}"`, `Parameters: ${Object.keys(params).join(', ') || '(none)'}.`);
        for (const [name, spec] of Object.entries(params)) checkValue(el[name], spec, `${sl}.${name}`, ctx, errors);
        if (el.key !== undefined && typeof el.key !== 'string') E(`${sl}.key`, 'must be text');
        list(el.beats, `${sl}.beats`, 'of {at, do} beats').forEach((b, bi) => {
          const bp = `${sl}.beats[${bi}]`;
          if (!b || typeof b !== 'object') return E(bp, 'must be an object');
          const bdef = def.beats?.[b.do];
          if (!bdef) return E(`${bp}.do`, `"${b.do}" is not a beat of "${el.type}"`, `Beats: ${Object.keys(def.beats || {}).join(', ') || '(none)'}.`);
          for (const f of Object.keys(b)) if (!['at', 'do'].includes(f) && !(f in bdef)) E(`${bp}.${f}`, `is not a parameter of beat "${b.do}"`, `Parameters: ${Object.keys(bdef).join(', ') || '(none)'}.`);
          for (const [name, spec] of Object.entries(bdef)) checkValue(b[name], spec, `${bp}.${name}`, ctx, errors);
          if (typeof b.at === 'number') {
            if (!Number.isInteger(b.at)) E(`${bp}.at`, 'a plain number is a word index and must be an integer', 'Use {"t": seconds} or {"rel": seconds} for times.');
            else if (w0 !== null && (b.at < w0 || b.at > w1)) E(`${bp}.at`, `word ${b.at} is outside this scene (words ${w0}-${w1})`, 'A beat must be anchored to a word spoken during its own scene.');
          } else if (!b.at || typeof b.at !== 'object' || (typeof b.at.t !== 'number' && typeof b.at.rel !== 'number')) {
            E(`${bp}.at`, 'must be a word index, {"t": seconds} or {"rel": seconds}');
          } else {
            for (const f of Object.keys(b.at)) if (f !== 't' && f !== 'rel') E(`${bp}.at.${f}`, 'is not a known field', 'Use {"t": seconds} or {"rel": seconds}.');
            timedBeats.push({ k, bp, at: b.at });
          }
        });
      }
      for (const [slot, allowed] of Object.entries(layout.slots || {})) {
        if (layout.required?.includes(slot) && !slots[slot]) E(`${op_}.slots.${slot}`, `is required by layout "${op.layout}"`, `Allowed elements: ${allowed.join(', ')}.`);
      }
    });
    if (sc.pick !== undefined && !oids.has(sc.pick)) E(`${sp}.pick`, `"${sc.pick}" is not one of this scene's options (${[...oids].join(', ')})`);
  });
  // audio
  const au = edit.audio || {};
  for (const k of Object.keys(au)) if (!['sfx', 'bed', 'music', 'musicGainDb'].includes(k)) E(`audio.${k}`, 'is not a known audio field', 'Known: sfx, bed, music, musicGainDb.');
  if (au.sfx !== undefined && typeof au.sfx !== 'boolean') E('audio.sfx', 'must be true or false');
  const beds = Object.keys(manifest.beds || {});
  if (au.bed !== undefined && au.bed !== 'none' && !beds.includes(au.bed)) E('audio.bed', `"${au.bed}" is not a music bed of this style`, `Use one of: ${[...beds, 'none'].join(', ')}.`);
  if (au.music !== undefined && au.music !== null) checkValue(au.music, 'asset', 'audio.music', ctx, errors);
  if (au.musicGainDb !== undefined && (typeof au.musicGainDb !== 'number' || au.musicGainDb > -6 || au.musicGainDb < -60)) E('audio.musicGainDb', 'must be a number between -60 and -6 (dB relative to the voice)');

  if (expect !== words.length && scenes.every((s) => Array.isArray(s.words))) {
    E('scenes', `the last scene ends at word ${expect - 1} but the transcript runs to word ${words.length - 1}`, 'Extend the last scene or add scenes so every word is covered.');
  }
  // {t}/{rel} beats must land inside their own scene (word beats are checked above)
  if (timeline && timedBeats.length && !errors.some((e) => /\.words$|^scenes$|\.start$/.test(e.path))) {
    const times = sceneTimes(scenes, words, timeline, manifest.timing?.sceneLead ?? 0.066);
    for (const { k, bp, at } of timedBeats) {
      const { start, end } = times[k];
      const t = typeof at.t === 'number' ? at.t : start + at.rel;
      if (!(t >= start - 1e-6 && t < end)) {
        E(`${bp}.at`, `${typeof at.t === 'number' ? `t ${at.t}` : `rel ${at.rel}`} s falls at ${t.toFixed(3)} s, outside this scene (${start.toFixed(3)}-${end.toFixed(3)} s)`, 'A beat must happen while its scene is on screen: use {"rel": seconds} from 0 up to the scene length, or a word index of this scene.');
      }
    }
  }
  if (timeline && scenes.length) {
    const perMin = scenes.length / (timeline.duration / 60);
    if (perMin < 6) Wn('scenes', `only ${scenes.length} scenes in ${timeline.duration.toFixed(1)} s`, 'Check the style\'s pacing rules: scenes are usually much shorter.');
  }
  return { errors, warnings };
}

// ---------------------------------------------------------------- resolve

/** Scene start times on the output timeline, snapped to frames. */
export function sceneTimes(scenes, words, timeline, lead = 0.066) {
  const fps = timeline.fps[0] / timeline.fps[1];
  const snap = (t) => Math.round(t * fps) / fps;
  const starts = scenes.map((sc, k) => {
    if (k === 0) return 0;
    if (typeof sc.start === 'number') return snap(sc.start);
    const w = words[sc.words[0]];
    const prev = words[sc.words[0] - 1];
    let t = w.start - lead;
    if (prev) t = Math.max(t, Math.min(prev.end, w.start) - 0.2);   // never drift far into the previous word
    return snap(Math.max(0, t));
  });
  for (let k = 1; k < starts.length; k++) if (starts[k] <= starts[k - 1]) starts[k] = snap(starts[k - 1] + 2 / fps);
  return scenes.map((sc, k) => ({ start: starts[k], end: k + 1 < starts.length ? starts[k + 1] : timeline.duration }));
}

/**
 * Merge the plan, the review state and the conformed timeline into the document a style compiles.
 * force: { scene, option } previews one specific option.
 */
export function resolveDoc({ edit, state, words, timeline, style, project }, force = {}) {
  const manifest = style.manifest;
  const cap = edit.captions || {};
  const outWords = words.map((w) => {
    const fix = cap.fixes?.[w.i];
    return { i: w.i, w: fix !== undefined ? fix : w.w, start: w.start, end: w.end, emph: cap.emphasis?.[w.i] || null, p: w.p };
  });
  const times = sceneTimes(edit.scenes, words, timeline, manifest.timing?.sceneLead ?? 0.066);
  const look = {};
  for (const [k, spec] of Object.entries(manifest.look || {})) look[k] = state.look?.[k] ?? edit.look?.[k] ?? spec.default;
  const scenes = edit.scenes.map((sc, k) => {
    const st = state.scenes?.[sc.id] || {};
    const ids = sc.options.map((o) => o.id);
    let pick = force.scene === sc.id && ids.includes(force.option) ? force.option
      : ids.includes(st.pick) ? st.pick : ids.includes(sc.pick) ? sc.pick : ids[0];
    const option = sc.options.find((o) => o.id === pick);
    return {
      id: sc.id, index: k, role: sc.role || null, words: sc.words, ...times[k],
      say: outWords.slice(sc.words[0], sc.words[1] + 1).map((w) => w.w).filter(Boolean).join(' '),
      option, pick,
    };
  });
  return {
    motus: 1, style: manifest.id, styleVersion: manifest.version,
    width: project.json.output.width, height: project.json.output.height,
    fps: timeline.fps[0] / timeline.fps[1], fpsRational: timeline.fps, frames: timeline.frames, duration: timeline.duration,
    hasMatte: !!timeline.hasMatte, framing: timeline.framing || null,
    look, words: outWords, captions: { breaks: cap.breaks || [], hide: cap.hide || [] },
    scenes, audio: resolveAudio(edit, manifest),
    sfx: manifest.sfx || {},
  };
}

/**
 * The sound of an edit: effects on or off, and one music source under the voice.
 * A file the user supplied (audio.music) wins; otherwise the style's own bed (audio.bed, default its first); "none" for no music.
 * Returns { sfx, music: {url, file, gainDb, bed} | null }: url for the stage, file relative to the style or project for the renderer.
 */
export function resolveAudio(edit, manifest) {
  const au = edit.audio || {};
  const beds = manifest.beds || {};
  let music = null;
  if (au.music) music = { from: 'project', file: String(au.music).replace(/^\.?\//, ''), url: `/project/${String(au.music).replace(/^\.?\//, '')}`, gainDb: au.musicGainDb ?? -24, bed: null };
  else if (au.bed !== 'none') {
    const id = au.bed && beds[au.bed] ? au.bed : Object.keys(beds)[0];
    if (id) music = { from: 'style', file: beds[id].src, url: `/styles/${manifest.id}/${beds[id].src}`, gainDb: au.musicGainDb ?? beds[id].gainDb ?? -24, bed: id };
  }
  return { sfx: au.sfx !== false, music };
}

/** What Studio shows: every scene with all its options, plus the user's state. */
export function reviewModel({ edit, state, words, timeline, style, project }) {
  const doc = resolveDoc({ edit, state, words, timeline, style, project });
  const scenes = edit.scenes.map((sc, k) => {
    const st = state.scenes?.[sc.id] || {};
    const h = hashOf(sc.options);
    const stale = st.hash && st.hash !== h;       // the agent revised this scene after the user decided
    return {
      id: sc.id, index: k, role: sc.role || null, start: doc.scenes[k].start, end: doc.scenes[k].end, say: doc.scenes[k].say,
      words: sc.words, single: !!sc.single, hash: h, revised: !!stale,
      options: sc.options.map((o) => ({ id: o.id, label: o.label, why: o.why || '', layout: o.layout, layoutLabel: style.manifest.layouts[o.layout]?.label || o.layout,
        elements: Object.values(o.slots || {}).filter(Boolean).map((e) => style.manifest.elements[e.type]?.label || e.type) })),
      recommended: sc.pick || sc.options[0].id,
      pick: doc.scenes[k].pick, decided: st.pick !== undefined && !stale, locked: !!st.locked && !stale, note: st.note || '',
      history: st.history || [],
    };
  });
  return {
    project: { name: project.json.name, dir: project.dir, mode: project.json.mode, source: path.basename(project.json.source.path) },
    style: { id: style.manifest.id, name: style.manifest.name, version: style.manifest.version, look: style.manifest.look || {} },
    duration: doc.duration, fps: doc.fps, frames: doc.frames, look: doc.look, note: state.note || '', history: state.history || [], scenes,
    locked: scenes.filter((s) => s.locked).length, total: scenes.length,
  };
}
