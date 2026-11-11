#!/usr/bin/env node
// Computes the numbers of STYLE.md section 12 (self-review checklist) for a project's plan,
// using the agent's picks (or the user's picks from review/state.json with --state).
//   node styles/editorial-proof/dev/check-plan.mjs <project> [--state] [--json]
import path from 'node:path';
import fs from 'node:fs/promises';

const args = process.argv.slice(2);
const dir = path.resolve(args.find((a) => !a.startsWith('--')) || '.');
const useState = args.includes('--state');
const read = async (rel, fallback) => { try { return JSON.parse(await fs.readFile(path.join(dir, rel), 'utf8')); } catch { return fallback; } };
const edit = process.env.MOTUS_EDIT ? JSON.parse(await fs.readFile(process.env.MOTUS_EDIT, 'utf8')) : await read('plan/edit.json');
const timeline = await read('conform/timeline.json');
const words = (await read('conform/words.json')).words;
const state = useState ? await read('review/state.json', { scenes: {} }) : { scenes: {} };
if (!edit || !timeline || !words) { console.error('Need plan/edit.json, conform/timeline.json and conform/words.json.'); process.exit(1); }

const fps = timeline.fps[0] / timeline.fps[1];
const dur = timeline.duration;
const F = (s) => Math.round(s * fps * 1000) / 1000 * (30 / fps);   // seconds -> frames at 30
const starts = edit.scenes.map((sc, k) => (k === 0 ? 0 : words[sc.words[0]].start));
const scenes = edit.scenes.map((sc, k) => {
  const pick = state.scenes?.[sc.id]?.pick || sc.pick || sc.options[0].id;
  const op = sc.options.find((o) => o.id === pick) || sc.options[0];
  const t0 = starts[k], t1 = k + 1 < starts.length ? starts[k + 1] : dur;
  const card = op.slots?.card || null;
  return { id: sc.id, layout: op.layout, t0, t1, len: t1 - t0, card, slots: op.slots || {}, options: sc.options.length, single: !!sc.single, sc, op };
});

const runs = [];
for (const s of scenes) { const r = runs[runs.length - 1]; if (r && r.layout === s.layout) { r.t1 = s.t1; r.scenes.push(s); } else runs.push({ layout: s.layout, t0: s.t0, t1: s.t1, scenes: [s] }); }
const share = (l) => scenes.filter((s) => s.layout === l).reduce((n, s) => n + s.len, 0) / dur;
const presenter = (l) => l === 'light-split' || l === 'presenter-full';
let longestAbsent = 0, cur = 0;
for (const s of scenes) { if (presenter(s.layout)) cur = 0; else { cur += s.len; longestAbsent = Math.max(longestAbsent, cur); } }
const lens = scenes.map((s) => F(s.len)).sort((a, b) => a - b);
const median = (a) => (a.length ? a[Math.floor(a.length / 2)] : 0);
const sentenceStarts = words.filter((w, i) => i > 0 && /[.!?]["'”’)]*$/.test(words[i - 1].w)).map((w) => w.i);
const sceneFirst = new Set(edit.scenes.map((s) => s.words[0]));
const cta = scenes[scenes.length - 1];
const covered = sentenceStarts.filter((i) => i < edit.scenes[edit.scenes.length - 1].words[0]).filter((i) => sceneFirst.has(i));
const before = sentenceStarts.filter((i) => i < edit.scenes[edit.scenes.length - 1].words[0]);
const punchIns = scenes.filter((s, k) => s.layout === 'presenter-full' && k < scenes.length - 1);
const cards = scenes.filter((s) => s.layout !== 'presenter-full');
const marked = cards.filter((s) => (s.card?.beats || []).length || (s.card?.rows || s.card?.items || []).some((r) => r.at !== undefined) || s.card?.left?.at !== undefined || s.card?.at !== undefined || s.card?.commands?.some((c) => c.at !== undefined));
const types = new Map(); for (const s of cards) if (s.card) types.set(s.card.type, (types.get(s.card.type) || 0) + 1);
const emph = Object.keys(edit.captions?.emphasis || {}).length;
const whiteToFull = runs.some((r, k) => k > 0 && r.layout === 'presenter-full' && runs[k - 1].layout === 'white');

const pass = (ok, warn) => (ok ? 'PASS' : warn ? 'CHECK' : 'FAIL');
const rows = [
  ['1 first scene', `${scenes[0].layout} + ${scenes[0].slots.title?.type || 'no title'}`, pass(scenes[0].layout === 'light-split' && scenes[0].slots.title)],
  ['2 hook run', `${F(runs[0].t1 - runs[0].t0).toFixed(0)} f, ${runs[0].scenes.length} scene(s)`, pass(F(runs[0].t1) >= 51 && F(runs[0].t1) <= 183)],
  ['4 last scene', `${cta.layout}, ${F(cta.len).toFixed(0)} f`, pass(cta.layout === 'presenter-full' && F(cta.len) >= 80 && F(cta.len) <= 167)],
  ['5 scenes per minute', (scenes.length / (dur / 60)).toFixed(1), pass(scenes.length / (dur / 60) >= 20 && scenes.length / (dur / 60) <= 32, scenes.length / (dur / 60) >= 15)],
  ['6 scene length median', `${median(lens).toFixed(0)} f (min ${lens[0].toFixed(0)}, max ${lens[lens.length - 1].toFixed(0)})`, pass(median(lens) >= 45 && median(lens) <= 75 && lens[0] >= 15 && lens[lens.length - 1] <= 233, lens[0] >= 15 && lens[lens.length - 1] <= 233)],
  ['7 layout changes per minute', ((runs.length - 1) / (dur / 60)).toFixed(1), pass((runs.length - 1) / (dur / 60) >= 10 && (runs.length - 1) / (dur / 60) <= 17, (runs.length - 1) / (dur / 60) >= 8)],
  ['8 sentence starts with a change', `${covered.length}/${before.length}`, pass(!before.length || covered.length / before.length >= 0.8, covered.length / before.length >= 0.7)],
  ['9 shares light/dark/full/white', ['light-split', 'dark-focus', 'presenter-full', 'white'].map((l) => `${(share(l) * 100).toFixed(0)}%`).join(' / '), pass(share('light-split') >= 0.3 && share('light-split') <= 0.5 && share('dark-focus') >= 0.3 && share('dark-focus') <= 0.5 && share('presenter-full') >= 0.08 && share('presenter-full') <= 0.23, true)],
  ['10 presenter visible', `${((share('light-split') + share('presenter-full')) * 100).toFixed(0)}%`, pass(share('light-split') + share('presenter-full') >= 0.39 && share('light-split') + share('presenter-full') <= 0.73)],
  ['11 longest without presenter', `${longestAbsent.toFixed(1)} s`, pass(longestAbsent <= 11, longestAbsent <= 12.6)],
  ['13 white -> presenter-full', whiteToFull ? 'yes' : 'no', pass(!whiteToFull)],
  ['14 punch-ins', `${punchIns.length} (${punchIns.map((s) => `${F(s.len).toFixed(0)} f`).join(', ')})`, pass(punchIns.length <= 2 && punchIns.every((s) => F(s.len) >= 17 && F(s.len) <= 78), punchIns.length <= 2)],
  ['15 cards in card layouts', `${cards.filter((s) => s.card).length}/${cards.length}`, pass(cards.every((s) => s.card))],
  ['17 cards with a beat', `${marked.length}/${cards.length}`, pass(marked.length / Math.max(1, cards.length) >= 0.7, marked.length / Math.max(1, cards.length) >= 0.6)],
  ['18 element types', [...types].map(([k, v]) => `${k} x${v}`).join(', '), pass(types.size >= 2 && [...types.values()].every((v) => v <= Math.ceil(cards.length / 2) + 1), types.size >= 2)],
  ['21 emphasised words', `${emph} of ${words.length} (about 1 in ${(words.length / Math.max(1, emph)).toFixed(1)})`, pass(emph / words.length >= 0.1 && emph / words.length <= 0.25, true)],
  ['23 options per scene', edit.scenes.map((s) => s.options.length).join(' '), pass(edit.scenes.every((s) => s.options.length >= 2 || s.single), true)],
];
if (args.includes('--json')) { console.log(JSON.stringify(rows.map(([check, value, verdict]) => ({ check, value, verdict })), null, 2)); process.exit(0); }
console.log(`${path.basename(dir)}: ${scenes.length} scenes, ${runs.length} runs, ${dur.toFixed(2)} s${useState ? ' (user picks)' : ' (agent picks)'}`);
for (const [c, v, r] of rows) console.log(`${r.padEnd(5)}  ${c.padEnd(34)} ${v}`);
console.log('\nScenes:'); for (const s of scenes) console.log(`  ${s.id} ${s.layout.padEnd(14)} ${s.t0.toFixed(2).padStart(6)}-${s.t1.toFixed(2).padStart(6)}  ${F(s.len).toFixed(0).padStart(4)} f  ${s.card ? s.card.type : (s.slots.cta ? 'cta' : '-')}`);
