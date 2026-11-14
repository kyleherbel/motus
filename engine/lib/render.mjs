// Frame-exact rendering: headless Chrome draws every frame of the stage, ffmpeg encodes.
import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import fss from 'node:fs';
import { run, readJson, writeJson, exists, mkdirp, onExit, MotusError } from './util.mjs';
import { Browser } from './cdp.mjs';
import { createStudioServer } from './server.mjs';
import { loadPlan, validateEdit, hashOf } from './plan.mjs';
import { ensureFrames } from './conform.mjs';
import { decode, writeWav, mixInto, dbToGain, measureLoudness, loudnormFilter, RATE, CH } from './audio.mjs';

const pad = (n) => String(n).padStart(6, '0');

/** Size and modification time of every file of a style pack, as one string (cheap change detection). */
async function styleFingerprint(dir) {
  const out = [];
  const walk = async (d) => {
    for (const e of await fs.readdir(d, { withFileTypes: true }).catch(() => [])) {
      if (e.name.startsWith('.') || e.name === 'research' || e.name === 'dev') continue;
      const f = path.join(d, e.name);
      if (e.isDirectory()) await walk(f);
      else { const st = await fs.stat(f); out.push(`${path.relative(dir, f)}:${st.size}:${Math.round(st.mtimeMs)}`); }
    }
  };
  await walk(dir);
  return out.sort().join('|');
}

async function checkedPlan(project) {
  const plan = await loadPlan(project);
  const { errors } = validateEdit(plan.edit, { words: plan.words, manifest: plan.style.manifest, projectDir: project.dir, timeline: plan.timeline });
  if (errors.length) {
    throw new MotusError(`The edit plan has ${errors.length} error(s):\n` + errors.slice(0, 8).map((e) => `  ${e.path}: ${e.message}`).join('\n'), 'Run: motus validate <project> and fix every error first.');
  }
  return plan;
}

/**
 * The output frames [f0, f1) for a render range in seconds (whole timeline when omitted).
 * Throws a MotusError for anything that is not two increasing finite numbers overlapping the timeline.
 */
export function frameSpan(range, timeline) {
  const fps = timeline.fps[0] / timeline.fps[1];
  if (range === undefined || range === null) return [0, timeline.frames];
  const fix = `Pass --range start,end in seconds on the output timeline, e.g. --range 0,${Math.min(3, timeline.duration).toFixed(1)} (the video is ${timeline.duration.toFixed(3)} s).`;
  if (!Array.isArray(range) || range.length !== 2 || !range.every(Number.isFinite)) throw new MotusError(`Not a render range: ${JSON.stringify(range)}.`, fix);
  const [ra, rb] = range;
  const f0 = Math.max(0, Math.round(ra * fps)), f1 = Math.min(timeline.frames, Math.round(rb * fps));
  if (f1 <= f0) throw new MotusError(`Nothing to render between ${ra} s and ${rb} s.`, fix);
  return [f0, f1];
}

/** The next free renders/draft-NN.mp4 name: one past the highest number, so a deleted draft is never overwritten into. */
export function nextDraftName(files) {
  const nums = files.map((f) => /^draft-(\d+)\.mp4$/.exec(f)).filter(Boolean).map((m) => Number(m[1]));
  return `draft-${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(2, '0')}.mp4`;
}

/** Start the local server and Chrome, hand out render pages, and always clean up. */
async function withStage(project, pages, fn, { scale = 1 } = {}) {
  const srv = await createStudioServer(project.dir, { port: 0 });
  let browser = null;
  try {
    browser = await Browser.launch();                // inside try: a failed launch must still close the server
    const list = [];
    for (let i = 0; i < pages; i++) {
      const page = await browser.newPage({ scale });
      await page.goto(`${srv.url}runtime/stage.html?mode=render`, { readyExpr: 'window.__motusReady === true', timeout: 90000 });
      list.push(page);
    }
    return await fn(list, srv);
  } finally {
    await browser?.close();
    await srv.close();
  }
}

/** Loudness of a float buffer through ffmpeg (writes a temp wav). */
async function loudnessOf(dir, samples, name) {
  const tmp = path.join(dir, name);
  await writeWav(tmp, samples);
  try { return await measureLoudness(tmp); } finally { await fs.rm(tmp, { force: true }); }
}

/**
 * The mix: voice brought to a reference level, sound effects at their designed levels under it,
 * one music source (looped to length) under everything. Returns the wav path.
 */
async function buildMix(project, plan, events, { from = 0, to, dir = project.path('renders') } = {}) {
  const { resolveAudio } = await import('./plan.mjs');
  const duration = plan.timeline.duration;
  const total = Math.ceil(duration * RATE) * CH;
  const mix = new Float32Array(total);
  const voice = await decode(project.path('conform', 'voice.wav'));
  // effects and bed are designed against a voice at -14.5 LUFS
  let voiceGain = 1;
  try { const m = await loudnessOf(dir, voice, 'voice-measure.wav'); if (Number.isFinite(m.i) && m.i > -50) voiceGain = Math.min(8, dbToGain(-14.5 - m.i)); } catch { /* keep the source level */ }
  mixInto(mix, voice, 0, voiceGain);
  const audio = resolveAudio(plan.edit, plan.style.manifest);
  if (audio.sfx) {
    const cache = new Map();
    for (const ev of events) {
      const rel = plan.style.manifest.sfx?.[ev.sfx];
      if (!rel) continue;
      if (!cache.has(ev.sfx)) cache.set(ev.sfx, await decode(path.join(plan.style.dir, rel)).catch(() => null));
      const buf = cache.get(ev.sfx);
      if (buf) mixInto(mix, buf, ev.t, dbToGain(ev.gainDb ?? -20));
    }
  }
  if (audio.music) {
    const file = audio.music.from === 'style' ? path.join(plan.style.dir, audio.music.file) : project.path(audio.music.file);
    if (await exists(file)) {
      const m = await decode(file);
      const g = dbToGain(audio.music.gainDb);
      // beds are normalised to -20 dBFS RMS; gainDb is relative to the voice reference
      // (an empty decode would make i % 0 = NaN and silence the whole mix)
      if (m.length >= CH) {
        const k = g * dbToGain(-14.5 + 20 - 3);
        // a style bed may fade out over the last seconds: a linear ramp on the music only, zero on the last sample
        const frames = total / CH, fo = Math.round(Math.min(duration, audio.music.fadeOut || 0) * RATE);
        for (let i = 0; i < total; i++) {
          const left = frames - Math.floor(i / CH);
          mix[i] += m[i % m.length] * (left < fo ? k * (left / fo) : k);
        }
      }
    }
  }
  // a few milliseconds of fade at the very end so the file does not click (interleaved: fade whole sample frames)
  const fade = Math.round(0.03 * RATE);
  for (let i = 0; i < fade && i * CH < total; i++) for (let c = 0; c < CH; c++) mix[total - (i + 1) * CH + c] *= i / fade;
  const a = Math.round(from * RATE) * CH, b = Math.min(total, Math.round((to ?? duration) * RATE) * CH);
  const out = path.join(dir, 'mix.wav');
  await writeWav(out, mix.subarray(a, b));
  return out;
}

export async function renderProject(project, opt = {}) {
  const t0 = Date.now();
  const onProgress = opt.onProgress || (() => {});
  const plan = await checkedPlan(project);
  const { timeline } = plan;
  const fps = timeline.fps[0] / timeline.fps[1];
  const [f0, f1] = frameSpan(opt.range, timeline);
  onProgress({ phase: 'preparing footage', progress: 0 });
  await ensureFrames(project, { onProgress: (p) => onProgress({ phase: 'preparing footage', progress: p * 0.08 }) });

  // A private work folder per render: two renders at once (Studio and the CLI) never share frames,
  // and a failed render leaves nothing behind.
  const work = project.path('renders', `.work-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const frameDir = path.join(work, 'frames');
  await mkdirp(frameDir);
  const offWork = onExit(() => fss.rmSync(work, { recursive: true, force: true }));   // also on Ctrl-C / kill
  try {
    const workers = Math.max(1, Math.min(Number(opt.workers) || Math.min(4, Math.max(1, Math.floor(os.cpus().length / 2))), f1 - f0));
    let done = 0, events = [];
    await withStage(project, workers, async (pages) => {
      events = await pages[0].eval('window.__motus.audio');
      const per = Math.ceil((f1 - f0) / workers);
      await Promise.all(pages.map(async (page, w) => {
        const a = f0 + w * per, b = Math.min(f1, a + per);
        for (let n = a; n < b; n++) {
          await page.eval(`window.__motus.seekFrame(${n})`);
          // Drafts capture at full size too and ffmpeg scales them down: Chrome rasterising at half scale (clip.scale
          // or a 0.5 device scale) gave different pixels from run to run on layers whose transform was animating,
          // so two renders of the same range were not identical. Full-size capture measured identical in 16 of 16.
          const buf = await page.screenshot({ format: 'jpeg', quality: opt.draft ? 88 : 96, clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 } });
          await fs.writeFile(path.join(frameDir, `${pad(n - f0 + 1)}.jpg`), buf);
          done++;
          if (done % 5 === 0 || done === f1 - f0) onProgress({ phase: 'drawing frames', progress: 0.08 + 0.8 * (done / (f1 - f0)), frame: done, frames: f1 - f0 });
        }
      }));
    });

    onProgress({ phase: 'mixing sound', progress: 0.89 });
    const mix = await buildMix(project, plan, events, { from: f0 / fps, to: f1 / fps, dir: work });
    // The delivered ceiling is -2 dBTP. AAC encoding adds up to about 0.5 dB of inter-sample
    // overshoot (a -2 target measured -1.8 after encoding), so the PCM is normalised to -3.
    const target = { i: -14, tp: -3, lra: 11 };
    const measured = await measureLoudness(mix, target);
    const af = Number.isFinite(measured.i) && measured.i > -60 ? loudnormFilter(measured, target) : 'anull';

    onProgress({ phase: 'encoding', progress: 0.92 });
    const renders = project.path('renders');
    let out = opt.out ? path.resolve(opt.out) : null;
    if (!out) {
      if (opt.draft || opt.range) out = path.join(renders, nextDraftName(await fs.readdir(renders)));
      else out = path.join(renders, 'final.mp4');
    }
    await mkdirp(path.dirname(out));
    const rate = `${timeline.fps[0]}/${timeline.fps[1]}`;
    await run('ffmpeg', ['-v', 'error', '-y',
      '-framerate', rate, '-start_number', '1', '-i', path.join(frameDir, '%06d.jpg'), '-i', mix,
      // setparams: ffmpeg 7 tags the stream from the frames and ignores -color_primaries/-color_trc on their own
      '-vf', `scale=${opt.draft ? '540:960' : '1080:1920'}:flags=lanczos:in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p,setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv`,
      '-c:v', 'libx264', '-preset', opt.draft ? 'veryfast' : 'slow', '-crf', opt.draft ? '23' : '15', '-profile:v', 'high', '-level', '4.2', '-bf', '2', '-g', String(Math.round(fps * 2)),
      '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
      '-af', `${af},aresample=${RATE}`, '-c:a', 'aac', '-b:a', '192k', '-ar', String(RATE), '-ac', '2',
      // an explicit length, not -shortest: ffmpeg 7's -shortest dropped the last video frame of every render
      '-r', rate, '-frames:v', String(f1 - f0), '-t', ((f1 - f0) / fps).toFixed(6), '-movflags', '+faststart', out]);

    let loudness = null;
    try { const m = await measureLoudness(out); loudness = { i: +m.i.toFixed(1), tp: +m.tp.toFixed(1), lra: +m.lra.toFixed(1) }; } catch { /* reporting only */ }
    const st = await fs.stat(out);
    const result = { file: out, width: opt.draft ? 540 : 1080, height: opt.draft ? 960 : 1920, fps, duration: (f1 - f0) / fps, frames: f1 - f0, bytes: st.size, loudness, sfxEvents: events.length, workers, seconds: (Date.now() - t0) / 1000, draft: !!opt.draft };
    if (opt.keepFrames) result.framesDir = frameDir;
    if (!opt.draft && !opt.range) await project.mark('render', { file: out, seconds: result.seconds });
    onProgress({ phase: 'done', progress: 1 });
    return result;
  } finally {
    offWork();
    if (opt.keepFrames) await fs.rm(path.join(work, 'mix.wav'), { force: true });
    else await fs.rm(work, { recursive: true, force: true });
  }
}

/**
 * Stills for the agent's own review and for Studio:
 *   posters: one representative frame per scene option  -> review/posters/<scene>-<option>-<hash>.jpg
 *   sheet:   the current cut as contact sheets          -> review/sheets/cut-NN.jpg
 *   scene+option: a strip through one option            -> review/sheets/<scene>-<option>.jpg
 *   at: full-resolution frames at given seconds         -> review/stills/t_*.jpg
 */
export async function renderStills(project, opt = {}) {
  const log = opt.log || (() => {});
  const plan = await checkedPlan(project);
  const fps = plan.timeline.fps[0] / plan.timeline.fps[1];
  // check the request before starting Chrome: a typo must not silently render the default pick
  if (opt.at && (!opt.at.length || !opt.at.every((t) => Number.isFinite(t) && t >= 0))) throw new MotusError(`Not a list of times: ${opt.at.join(',')}`, 'Pass --at with comma-separated seconds on the output timeline, e.g. --at 0.5,2,4.25');
  if (opt.every !== undefined && !(opt.every > 0)) throw new MotusError(`--every must be a positive number of seconds, got ${opt.every}.`, 'For example: --every 0.5');
  if (opt.scene || opt.option) {
    const sc = plan.edit.scenes.find((s) => s.id === opt.scene);
    if (!sc) throw new MotusError(`No scene "${opt.scene}".`, `Scenes: ${plan.edit.scenes.map((s) => s.id).join(', ')}. Use --scene <id> --option <id>.`);
    if (!sc.options.some((o) => o.id === opt.option)) throw new MotusError(`Scene ${sc.id} has no option "${opt.option}".`, `Options of ${sc.id}: ${sc.options.map((o) => o.id).join(', ')}. Use --scene ${sc.id} --option <id>.`);
  }
  await ensureFrames(project, {});
  const stills = [], sheets = [];
  const frameOf = (t) => Math.max(0, Math.min(plan.timeline.frames - 1, Math.round(t * fps)));

  await withStage(project, 1, async ([page]) => {
    const shot = async (file, t, clip) => {
      await page.eval(`window.__motus.seekFrame(${frameOf(t)})`);
      await mkdirp(path.dirname(file));
      await fs.writeFile(file, await page.screenshot({ format: 'jpeg', quality: 90, clip }));
      stills.push(file);
    };
    const half = { x: 0, y: 0, width: 1080, height: 1920, scale: 0.5 };
    const third = { x: 0, y: 0, width: 1080, height: 1920, scale: 1 / 3 };
    const force = async (scene, option) => page.eval(`window.__motus.rebuild(${JSON.stringify({ scene, option })})`);
    const scenes = await page.eval('window.__motus.scenes');

    if (opt.at) for (const t of opt.at) await shot(project.path('review', 'stills', `t_${t.toFixed(3).padStart(8, '0')}.jpg`), t);

    if (opt.posters) {
      const dir = project.path('review', 'posters');
      await mkdirp(dir);
      // A poster's name carries its scene's decision hash (Studio looks it up by that), but its
      // pixels also depend on the style's code, the captions and the look. When any of those
      // change, every poster is redrawn.
      const stampFile = path.join(dir, '.stamp');
      const stamp = hashOf({ style: await styleFingerprint(plan.style.dir), captions: plan.edit.captions || null, look: plan.edit.look || null });
      const fresh = !opt.force && (await fs.readFile(stampFile, 'utf8').catch(() => '')) === stamp;
      const keep = new Set(['.stamp']);
      for (const sc of plan.edit.scenes) {
        const h = hashOf(sc.options);
        for (const op of sc.options) {
          const file = path.join(dir, `${sc.id}-${op.id}-${h}.jpg`);
          keep.add(path.basename(file));
          if (fresh && await exists(file)) continue;
          await force(sc.id, op.id);
          const s = scenes.find((x) => x.id === sc.id);
          const t = (await page.eval(`window.__motus.posterTime(${JSON.stringify(sc.id)})`)) ?? (s.start + (s.end - s.start) * 0.72);
          await shot(file, t, half);
          log(`poster ${sc.id}-${op.id}`);
        }
      }
      for (const f of await fs.readdir(dir)) if (!keep.has(f)) await fs.rm(path.join(dir, f));
      await fs.writeFile(stampFile, stamp);
      await force(null, null);
    }

    // Loops: a short silent clip of every scene option, for Studio's scene grid. Same names and
    // freshness rule as the posters; the current picks are drawn first so the grid fills in order.
    if (opt.loops) {
      const dir = project.path('review', 'loops');
      await mkdirp(dir);
      const stampFile = path.join(dir, '.stamp');
      const stamp = hashOf({ style: await styleFingerprint(plan.style.dir), captions: plan.edit.captions || null, look: plan.edit.look || null, v: 1 });
      const fresh = !opt.force && (await fs.readFile(stampFile, 'utf8').catch(() => '')) === stamp;
      const keep = new Set(['.stamp']);
      const jobs = [];
      for (const sc of plan.edit.scenes) {
        const h = hashOf(sc.options);
        const picked = plan.state?.scenes?.[sc.id]?.pick || sc.pick || sc.options[0].id;
        for (const op of sc.options) {
          const file = path.join(dir, `${sc.id}-${op.id}-${h}.mp4`);
          keep.add(path.basename(file));
          jobs.push({ sc, op, file, first: op.id === picked });
        }
      }
      jobs.sort((a, b) => Number(b.first) - Number(a.first));
      for (const f of await fs.readdir(dir)) if (!keep.has(f)) await fs.rm(path.join(dir, f), { force: true });
      if (!fresh) await fs.writeFile(stampFile, '');            // half-redrawn: a crash leaves the set stale, not fresh
      const LOOP_FPS = 15;
      for (const { sc, op, file } of jobs) {
        if (fresh && await exists(file)) continue;
        const s = scenes.find((x) => x.id === sc.id);
        await force(sc.id, op.id);
        const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'motus-loop-'));
        const offTmp = onExit(() => fss.rmSync(tmp, { recursive: true, force: true }));
        try {
          const n = Math.max(2, Math.round((s.end - s.start) * LOOP_FPS));
          for (let i = 0; i < n; i++) {
            await page.eval(`window.__motus.seekFrame(${frameOf(s.start + i / LOOP_FPS)})`);
            await fs.writeFile(path.join(tmp, `${pad(i + 1)}.jpg`), await page.screenshot({ format: 'jpeg', quality: 82, clip: third }));
          }
          const part = `${file}.part.mp4`;
          await run('ffmpeg', ['-v', 'error', '-y', '-framerate', String(LOOP_FPS), '-start_number', '1', '-i', path.join(tmp, '%06d.jpg'),
            '-vf', 'scale=360:640:flags=bicubic,format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '27', '-movflags', '+faststart', '-an', part]);
          await fs.rename(part, file);                              // Studio never sees a half-written clip
          log(`loop ${sc.id}-${op.id}`);
        } finally {
          offTmp();
          await fs.rm(tmp, { recursive: true, force: true });
        }
      }
      await fs.writeFile(stampFile, stamp);
      await force(null, null);
    }

    const strip = async (name, times, labels) => {
      const sheetDir = project.path('review', 'sheets');
      const mine = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d{2,}\\.jpg$`);   // exactly this strip's pages
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'motus-strip-'));
      const offTmp = onExit(() => fss.rmSync(tmp, { recursive: true, force: true }));
      const cols = Math.min(6, times.length), per = cols * 4;
      try {
        for (let i = 0; i < times.length; i++) {
          await page.eval(`window.__motus.label(${JSON.stringify(labels[i])}); window.__motus.seekFrame(${frameOf(times[i])})`);
          await fs.writeFile(path.join(tmp, `${pad(i + 1)}.jpg`), await page.screenshot({ format: 'jpeg', quality: 88, clip: third }));
        }
        await page.eval(`window.__motus.label('')`);
        await mkdirp(sheetDir);
        for (const f of await fs.readdir(sheetDir)) if (mine.test(f)) await fs.rm(path.join(sheetDir, f));   // a shorter strip must not list stale pages
        await run('ffmpeg', ['-v', 'error', '-y', '-framerate', '1', '-start_number', '1', '-i', path.join(tmp, '%06d.jpg'), '-vf', `tile=${cols}x4:padding=6:margin=6:color=0x101010`, '-q:v', '3', '-fps_mode', 'passthrough', path.join(sheetDir, `${name}-%02d.jpg`)]);
      } finally {
        offTmp();
        await fs.rm(tmp, { recursive: true, force: true });
      }
      const made = (await fs.readdir(sheetDir)).filter((f) => mine.test(f)).sort().map((f) => path.join(sheetDir, f));
      const index = made.map((file, k) => ({ file, cells: labels.slice(k * per, (k + 1) * per) }));
      await writeJson(project.path('review', 'sheets', `${name}.json`), index);
      sheets.push(...made);
    };

    if (opt.scene && opt.option) {
      await force(opt.scene, opt.option);
      const s = scenes.find((x) => x.id === opt.scene);
      const n = Math.max(6, Math.min(24, Math.round((s.end - s.start) / (opt.every || 0.2))));
      const times = Array.from({ length: n }, (_, i) => s.start + ((s.end - s.start) * i) / (n - 1) - (i === n - 1 ? 1 / fps : 0));
      await strip(`${opt.scene}-${opt.option}`, times, times.map((t) => `${t.toFixed(2)}s`));
      await force(null, null);
    }

    if (opt.sheet) {
      const every = opt.every || 0.5;
      const times = [];
      for (let t = 0; t < plan.timeline.duration; t += every) times.push(t);
      const sceneAt = (t) => scenes.find((x) => t >= x.start && t < x.end)?.id || '';
      await strip('cut', times, times.map((t) => `${t.toFixed(1)}s ${sceneAt(t)}`));
    }
  });
  return { dir: project.path('review'), stills, sheets };
}
