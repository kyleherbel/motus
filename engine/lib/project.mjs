// A project is one video being edited: a folder with project.json and the stage outputs.
import path from 'node:path';
import fs from 'node:fs/promises';
import { run, readJson, writeJson, exists, mkdirp, slug, parseRational, fpsOf, standardRate, MotusError } from './util.mjs';
import { loadStyle } from './styles.mjs';

/** ffprobe a video into the facts every later stage needs. */
export async function probe(video) {
  if (!(await exists(video))) throw new MotusError(`No such file: ${video}`, 'Give the full path to the video file.');
  const { stdout } = await run('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', video], { fix: 'ffprobe could not read this file: give a video file (mp4, mov, mkv, webm) that plays.' });
  const info = JSON.parse(stdout);
  const v = (info.streams || []).find((s) => s.codec_type === 'video');
  const a = (info.streams || []).find((s) => s.codec_type === 'audio');
  if (!v) throw new MotusError(`${path.basename(video)} has no video stream.`, 'Give a video file (mp4, mov, mkv, webm).');
  const rate = parseRational(v.avg_frame_rate && v.avg_frame_rate !== '0/0' ? v.avg_frame_rate : v.r_frame_rate);
  const rotation = Number(v.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ?? v.tags?.rotate ?? 0);
  const swap = Math.abs(rotation) % 180 === 90;
  const width = swap ? v.height : v.width, height = swap ? v.width : v.height;
  const duration = Number(v.duration ?? info.format?.duration ?? 0);
  return {
    width, height, rotation, fps: rate, duration,
    frames: Number(v.nb_frames) || Math.round(duration * fpsOf(rate)),
    vcodec: v.codec_name, pixFmt: v.pix_fmt, hasAudio: !!a, acodec: a?.codec_name ?? null,
    sampleRate: a ? Number(a.sample_rate) : null, bytes: Number(info.format?.size ?? 0),
    aspect: width / height,
  };
}

/** Create the project folder for a video. */
export async function initProject({ video, style, mode = 'raw', dir, root = process.cwd(), force = false }) {
  video = path.resolve(video);
  const info = await probe(video);
  const styleInfo = style ? await loadStyle(style) : null;            // fail early on a bad id
  if (!['raw', 'locked'].includes(mode)) throw new MotusError(`Unknown mode "${mode}".`, 'Use --mode raw (cut silences and retakes) or --mode locked (keep every frame).');
  const name = slug(path.basename(video, path.extname(video)));
  const pdir = path.resolve(dir || path.join(root, 'motus-projects', name));
  if ((await exists(path.join(pdir, 'project.json'))) && !force) {
    throw new MotusError(`A project already exists at ${pdir}`, 'Continue with it, pass --project <other dir>, or pass --force to start over.');
  }
  for (const d of ['analysis', 'plan', 'conform', 'assets', 'review', 'renders']) await mkdirp(path.join(pdir, d));
  const notes = [];
  const wantsWide = !!styleInfo?.manifest?.footage?.wide;
  if (Math.abs(info.aspect - 9 / 16) > 0.02) notes.push(`Source is ${info.width}x${info.height}, not 9:16; the 9:16 picture is cropped around the speaker at conform${wantsWide && info.aspect >= 1 ? ', and the whole frame is kept as the wide view this style frames its panel from' : ''}.`);
  else if (wantsWide) notes.push(`This style frames its presenter panel from a shot wider than 9:16. With a 9:16 source the panel shows a closer crop than the style was measured with; if a horizontal recording of the same take exists, start the project from it instead.`);
  if (!info.hasAudio) notes.push('Source has no audio stream: there is nothing to transcribe.');
  // a variable-frame-rate source reports an odd average rate; deliver at the nearest standard rate
  const outFps = standardRate(info.fps);
  if (outFps[0] !== info.fps[0] || outFps[1] !== info.fps[1]) notes.push(`Source frame rate ${info.fps.join('/')} is variable or non-standard; the edit is delivered at ${outFps.join('/')}.`);
  const json = {
    motus: 1, name, created: new Date().toISOString(),
    source: { path: video, ...info },
    style: style || null, mode,
    output: { width: 1080, height: 1920, fps: outFps },
    stages: {}, notes,
  };
  await writeJson(path.join(pdir, 'project.json'), json);
  return loadProject(pdir);
}

export async function loadProject(dir) {
  dir = path.resolve(dir);
  const file = path.join(dir, 'project.json');
  if (!(await exists(file))) throw new MotusError(`No Motus project at ${dir}`, 'Create one with: motus init <video>');
  const json = await readJson(file);
  const p = {
    dir, json,
    path: (...rel) => path.join(dir, ...rel),
    fps: fpsOf(json.output.fps),
    async save() { await writeJson(file, this.json); },
    async mark(stage, data = {}) { this.json.stages[stage] = { at: new Date().toISOString(), ...data }; await this.save(); },
    done(stage) { return !!this.json.stages[stage]; },
    async need(stage, cmd) {
      if (!this.done(stage)) throw new MotusError(`This project has not been through "${stage}" yet.`, `Run: motus ${cmd || stage} ${dir}`);
    },
  };
  return p;
}

export async function listFiles(dir, re) {
  try { return (await fs.readdir(dir)).filter((f) => !re || re.test(f)).sort(); } catch { return []; }
}
