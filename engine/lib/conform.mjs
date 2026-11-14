// Conform: turn the source + plan/cuts.json into the output timeline that everything
// downstream (plan, stage, renderer) shares.
import path from 'node:path';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import { run, readJson, writeJson, exists, mkdirp, onExit, MotusError } from './util.mjs';
import { matteVideo } from './vision.mjs';
import { hashOf } from './plan.mjs';
import { loadStyle } from './styles.mjs';

const OUT_W = 1080, OUT_H = 1920;
// The wide view: the whole source frame at half the output height (at most 16:9), packed as a column
// with its matte under it. Only for styles whose manifest asks for it ("footage": {"wide": true}).
const WIDE_H = OUT_H / 2, WIDE_MAX_W = 1706;
const even = (v) => Math.round(v / 2) * 2;

/**
 * The wide view of a source wider than 9:16 (aspect >= 1): its size, the ffmpeg filter that makes it, and
 * where the 9:16 output window (`crop`, source px) and the speaker (`framingMedian`, normalised) land in it.
 * Returns null for a portrait source. The window lets a style line the two views up exactly.
 */
export function wideBand(src, crop, framingMedian) {
  if (!src || !(src.width / src.height >= 1)) return null;
  const s = WIDE_H / src.height;
  const scaledW = even(src.width * s);
  const width = Math.min(scaledW, WIDE_MAX_W);
  const offX = even((scaledW - width) / 2);
  const sx = scaledW / src.width;
  const r = (v) => Math.round(v * 10) / 10;
  const c = crop || { x: 0, y: 0, w: src.width, h: src.height };
  const window = { x: r(c.x * sx - offX), y: r(c.y * s), w: r(c.w * sx), h: r(c.h * s) };
  let framing = null;
  if (framingMedian) {
    const m = framingMedian;
    const X = (v) => (v == null ? null : Math.round(v * src.width * sx - offX)), Y = (v) => (v == null ? null : Math.round(v * src.height * s));
    const L = (v) => (v == null ? null : Math.round(v * src.width * sx));
    framing = { eyeX: X(m.cx), eyeY: Y(m.eyeY), faceW: L(m.faceW), faceH: m.faceH == null ? null : Math.round(m.faceH * src.height * s), eyeDist: L(m.eyeDist), headTopY: Y(m.headTopY), chinY: Y(m.chinY), headW: L(m.headW) };
  }
  return { width, height: WIDE_H, window, framing, filter: `scale=${scaledW}:${WIDE_H}:flags=lanczos,crop=${width}:${WIDE_H}:${offX}:0` };
}

/**
 * The filter graph that packs the conformed pictures into one frame, in the order the stage reads them
 * (engine/runtime/kit/footage.js, packedLayout): footage | matte | wide over its matte. Inputs are numbered
 * in that order. f.colour / f.matte are applied to each input first, f.out to the packed frame.
 * Returns null when there is nothing to pack or convert (map the footage directly).
 */
export function packGraph({ hasMatte, wide, height }, f = {}) {
  const idx = { footage: 0 }; let k = 1;
  if (hasMatte) idx.matte = k++;
  if (wide) { idx.wide = k++; if (hasMatte) idx.wideMatte = k++; }
  const chains = [];
  const lab = (name, kind) => { const i = idx[name]; if (!f[kind]) return `[${i}:v]`; chains.push(`[${i}:v]${f[kind]}[p${i}]`); return `[p${i}]`; };
  const cols = [lab('footage', 'colour')];
  if (hasMatte) cols.push(lab('matte', 'matte'));
  if (wide) {
    const w = lab('wide', 'colour');
    chains.push(hasMatte ? `${w}${lab('wideMatte', 'matte')}vstack=inputs=2,pad=iw:${height}:0:0:black[wc]` : `${w}pad=iw:${height}:0:0:black[wc]`);
    cols.push('[wc]');
  }
  const out = f.out ? `,${f.out}` : '';
  if (cols.length === 1) return f.colour ? `[0:v]${f.colour}${out}[v]` : null;
  return `${chains.length ? `${chains.join(';')};` : ''}${cols.join('')}hstack=inputs=${cols.length}${out}[v]`;
}

/** Whole frames in `duration` seconds at `fps`; tolerant of float error (4.004 s at 30000/1001 is 120 frames, not 119). */
export const sourceFrames = (duration, fps) => Math.floor(duration * fps + 1e-6);

/** Kept ranges snapped to whole source frames, validated and merged. Returns [{a, b}] in frames, b exclusive. */
export function frameRanges(cuts, fps, totalFrames) {
  const shape = 'Write plan/cuts.json as a list of kept ranges, e.g. [{"in": 0.4, "out": 3.2}] (seconds on the source timeline); analysis/cuts.suggested.json is a valid starting point.';
  if (!Array.isArray(cuts) || !cuts.length) throw new MotusError('plan/cuts.json must be a non-empty list of {in, out} ranges (seconds).', shape);
  const out = [];
  for (const [k, c] of cuts.entries()) {
    if (!Number.isFinite(c?.in) || !Number.isFinite(c?.out)) throw new MotusError(`cuts[${k}] must be {"in": seconds, "out": seconds}.`, shape);
    if (c.out < c.in) throw new MotusError(`cuts[${k}] ends (${c.out} s) before it starts (${c.in} s).`, 'Swap in and out, or remove the range.');
    const a = Math.max(0, Math.round(c.in * fps)), b = Math.min(totalFrames, Math.round(c.out * fps));
    if (b - a < 2) continue;
    if (out.length && a < out[out.length - 1].b) throw new MotusError(`cuts[${k}] starts before the previous range ends.`, 'Ranges must be in order and must not overlap.');
    if (out.length && a === out[out.length - 1].b) out[out.length - 1].b = b; else out.push({ a, b });
  }
  if (!out.length) throw new MotusError('The cuts keep nothing: every range is shorter than two frames or past the end of the source.', `The source is ${(totalFrames / fps).toFixed(3)} s long. ${shape}`);
  return out;
}

/** Where each kept range lands on the output timeline: [{out, in, len (seconds), outFrame, inFrame, frames}]. */
export function outputMap(ranges, fps) {
  const map = []; let acc = 0;
  for (const r of ranges) { map.push({ out: acc / fps, in: r.a / fps, len: (r.b - r.a) / fps, outFrame: acc, inFrame: r.a, frames: r.b - r.a }); acc += r.b - r.a; }
  return map;
}

/**
 * Transcript words (source time) re-timed to the output timeline. A word belongs to the kept range it
 * overlaps most; it is dropped when less than 40 % of it (and under 60 ms) survives. Output words are
 * re-indexed 0..n-1 (`src` keeps the transcript index), ordered, and at least 20 ms long.
 */
export function retimeWords(transcriptWords, map) {
  const words = [];
  for (const w of transcriptWords) {
    const dur = Math.max(0.02, w.end - w.start);
    const we = w.start + dur;                               // a zero-length word still occupies 20 ms
    let m = null, best = 0;
    for (const x of map) { const ov = Math.min(we, x.in + x.len) - Math.max(w.start, x.in); if (ov > best) { best = ov; m = x; } }
    if (!m || (best < dur * 0.4 && best < 0.06)) continue;   // spoken in a removed range
    const start = m.out + Math.max(0, w.start - m.in);
    const end = m.out + Math.min(m.len, we - m.in);
    words.push({ i: words.length, w: w.w, start: +start.toFixed(3), end: +Math.max(end, start + 0.02).toFixed(3), p: w.p, src: w.i });
  }
  for (let k = 1; k < words.length; k++) {
    if (words[k].start < words[k - 1].start) words[k].start = words[k - 1].start;
    if (words[k].end < words[k].start + 0.02) words[k].end = +(words[k].start + 0.02).toFixed(3);
  }
  return words;
}

export async function conform(project, opt = {}) {
  const log = opt.log || (() => {});
  await project.need('ingest', 'ingest');
  const src = project.json.source;
  const fpsR = project.json.output.fps, fps = fpsR[0] / fpsR[1], rate = `${fpsR[0]}/${fpsR[1]}`;
  const totalFrames = sourceFrames(src.duration, fps);

  const cutsPath = project.path('plan', 'cuts.json');
  if (!(await exists(cutsPath))) {
    if (project.json.mode === 'locked') await writeJson(cutsPath, [{ in: 0, out: +src.duration.toFixed(3) }]);
    else throw new MotusError('plan/cuts.json does not exist yet.', `Review analysis/cuts.suggested.json and analysis/retakes.json, then write the kept ranges to ${cutsPath} (copying the suggestion is fine).`);
  }
  const cuts = await readJson(cutsPath);
  const ranges = frameRanges(cuts, fps, totalFrames);
  const frames = ranges.reduce((n, r) => n + (r.b - r.a), 0);
  const duration = frames / fps;
  const dir = project.path('conform');
  await mkdirp(dir);

  // ---- does the style want the wide view? (a style declares it in its manifest: "footage": {"wide": true})
  const crop = project.json.crop;
  const framingSrc = await readJson(project.path('analysis', 'framing.json'), { available: false });
  const styleId = (await readJson(project.path('plan', 'edit.json'), null).catch(() => null))?.style || project.json.style;
  const manifest = styleId ? (await loadStyle(styleId).catch(() => null))?.manifest : null;
  const band = manifest?.footage?.wide ? wideBand(src, crop, framingSrc.available ? framingSrc.median : null) : null;
  const wideFile = path.join(dir, 'wide.mp4'), wideMatteFile = path.join(dir, 'wide-matte.mp4');

  // ---- picture: constant frame rate, 9:16 crop, kept frames only (and the wide view, from the same decode)
  log(`footage: ${ranges.length} range(s), ${frames} frames${band ? `, wide view ${band.width}x${band.height}` : ''}`);
  const sel = ranges.map((r) => `between(n\\,${r.a}\\,${r.b - 1})`).join('+');
  // tag the frames: ffmpeg 7 takes colour tags from the frames, ignoring -color_primaries/-color_trc
  const tag = 'setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709';
  const nineSixteen = [
    crop ? `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}` : null,
    `scale=${OUT_W}:${OUT_H}:force_original_aspect_ratio=increase:flags=lanczos`, `crop=${OUT_W}:${OUT_H}`,
  ].filter(Boolean).join(',');
  // start_time=0: frame n is source time n/fps even when the video stream starts after the audio
  // (or has negative timestamps from an edit list), so picture and voice cut at the same instant
  const head = `fps=${rate}:start_time=0`, keep = `select='${sel}',setpts=N/(${rate})/TB`;
  const enc = ['-fps_mode', 'cfr', '-r', rate, '-c:v', 'libx264', '-preset', 'fast', '-crf', '12', '-g', '12', '-pix_fmt', 'yuv420p',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709'];
  const footage = path.join(dir, 'footage.mp4');
  if (!band) {
    const vf = [head, nineSixteen, keep, 'format=yuv420p', tag].join(',');
    await run('ffmpeg', ['-v', 'error', '-y', '-i', src.path, '-an', '-vf', vf, ...enc, footage]);
    await Promise.all([wideFile, wideMatteFile].map((f) => fs.rm(f, { force: true })));
  } else {
    const graph = `[0:v]${head},${keep},split=2[a][b];[a]${nineSixteen},format=yuv420p,${tag}[f];[b]${band.filter},format=yuv420p,${tag}[w]`;
    await run('ffmpeg', ['-v', 'error', '-y', '-i', src.path, '-an', '-filter_complex', graph, '-map', '[f]', ...enc, footage, '-map', '[w]', ...enc, wideFile]);
  }
  const got = Number((await run('ffprobe', ['-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', footage])).stdout.trim());
  const outFrames = got || frames;

  // ---- voice: the same ranges, sample-accurate, with 8 ms fades at each join
  log('voice');
  const voice = path.join(dir, 'voice.wav');
  const parts = ranges.map((r, k) => {
    const s = r.a / fps, e = r.b / fps, d = e - s;
    return `[0:a]atrim=start=${s.toFixed(6)}:end=${e.toFixed(6)},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st=${Math.max(0, d - 0.008).toFixed(6)}:d=0.008[a${k}]`;
  });
  const graph = `${parts.join(';')};${ranges.map((_, k) => `[a${k}]`).join('')}concat=n=${ranges.length}:v=0:a=1[out]`;
  await run('ffmpeg', ['-v', 'error', '-y', '-i', project.path('analysis', 'audio.wav'), '-filter_complex', graph, '-map', '[out]', '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', voice]);

  // ---- words on the output timeline
  const transcript = await readJson(project.path('analysis', 'transcript.json'));
  const map = outputMap(ranges, fps);
  const words = retimeWords(transcript.words || [], map);
  await writeJson(path.join(dir, 'words.json'), { language: transcript.language, words });

  // ---- person matte
  let hasMatte = false, matteReason = 'disabled with --no-matte';
  const matte = path.join(dir, 'matte.mp4');
  if (opt.matte !== false) {
    log('person matte');
    let lastPct = -1;
    const m = await matteVideo(footage, matte, { width: OUT_W, height: OUT_H, rate, log, onProgress: (n) => { const pct = Math.floor((n / outFrames) * 10) * 10; if (pct > lastPct) { lastPct = pct; log(`matte ${pct}%`); } } });
    hasMatte = m.ok && Math.abs(m.frames - outFrames) <= 1;
    matteReason = m.ok ? (hasMatte ? '' : `matte has ${m.frames} frames, footage has ${outFrames}`) : m.reason;
    if (hasMatte && m.emptyFrames > outFrames * 0.2) { hasMatte = false; matteReason = `no person found in ${m.emptyFrames} of ${outFrames} frames`; }
    if (hasMatte && band) {
      log('person matte (wide view)');
      const w = await matteVideo(wideFile, wideMatteFile, { width: band.width, height: band.height, rate, log });
      if (!(w.ok && Math.abs(w.frames - outFrames) <= 1)) { hasMatte = false; matteReason = `wide view: ${w.ok ? `matte has ${w.frames} frames, footage has ${outFrames}` : w.reason}`; }
    }
  }
  if (!hasMatte) await Promise.all([matte, wideMatteFile].map((f) => fs.rm(f, { force: true })));

  // ---- preview proxy: [footage | matte | wide over wide matte] with the voice
  log('preview proxy');
  const packed = path.join(dir, 'packed.mp4');
  const inputs = [footage, ...(hasMatte ? [matte] : []), ...(band ? [wideFile, ...(hasMatte ? [wideMatteFile] : [])] : [])];
  const pargs = ['-v', 'error', '-y', ...inputs.flatMap((f) => ['-i', f]), '-i', voice];
  const pack = packGraph({ hasMatte, wide: !!band, height: OUT_H }, { out: 'format=yuv420p' });
  if (pack) pargs.push('-filter_complex', pack, '-map', '[v]', '-map', `${inputs.length}:a`);
  else pargs.push('-map', '0:v', '-map', `${inputs.length}:a`);
  pargs.push('-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-g', '8', '-bf', '0', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '-r', rate, packed);
  await run('ffmpeg', pargs);

  // ---- where the speaker sits in the output frame (for automatic framing)
  let framing = null;
  if (framingSrc.available) {
    const c = crop || { x: 0, y: 0, w: src.width, h: src.height };
    const sx = (v) => ((v * src.width - c.x) / c.w) * OUT_W, sy = (v) => ((v * src.height - c.y) / c.h) * OUT_H;
    const m = framingSrc.median;
    framing = {
      eyeX: Math.round(sx(m.cx)), eyeY: Math.round(sy(m.eyeY)),
      faceW: Math.round(((m.faceW * src.width) / c.w) * OUT_W), faceH: Math.round(((m.faceH * src.height) / c.h) * OUT_H),
      eyeDist: m.eyeDist != null ? Math.round(((m.eyeDist * src.width) / c.w) * OUT_W) : null,
      headTopY: m.headTopY != null ? Math.round(sy(m.headTopY)) : null, chinY: m.chinY != null ? Math.round(sy(m.chinY)) : null,
      headW: m.headW != null ? Math.round(((m.headW * src.width) / c.w) * OUT_W) : null,
    };
  }

  const wide = band ? { width: band.width, height: band.height, window: band.window, framing: band.framing } : null;
  const timeline = { fps: fpsR, frames: outFrames, duration: outFrames / fps, width: OUT_W, height: OUT_H, hasMatte, map, framing, wide, cutsHash: hashOf(cuts) };
  await writeJson(path.join(dir, 'timeline.json'), timeline);
  await fs.rm(path.join(dir, 'frames'), { recursive: true, force: true });       // stale stills from an earlier conform
  await project.mark('conform', { frames: outFrames, duration: timeline.duration, hasMatte, wide: !!wide });
  return {
    duration: timeline.duration, frames: outFrames, fps, ranges: ranges.length, removed: src.duration - duration,
    hasMatte, matteReason, words: words.length, wordsFile: path.join(dir, 'words.json'), framing,
    wide: wide ? `${wide.width}x${wide.height}` : (manifest?.footage?.wide ? `none (the source is ${src.width}x${src.height}; this style frames the panel from a wider shot: start the project from the horizontal recording)` : null),
  };
}

/** The packed footage as JPEG stills, one per output frame, for frame-exact rendering. Built once per conform. */
export async function ensureFrames(project, { onProgress } = {}) {
  await project.need('conform', 'conform');
  const dir = project.path('conform', 'frames');
  const timeline = await readJson(project.path('conform', 'timeline.json'));
  const stamp = path.join(dir, '.stamp');
  const want = `jpeg602:${timeline.cutsHash}:${timeline.frames}:${timeline.hasMatte}:${timeline.wide ? `${timeline.wide.width}x${timeline.wide.height}` : 'narrow'}`;   // bump the prefix when the extraction changes
  const stamped = async () => (await fs.readFile(stamp, 'utf8').catch(() => '')) === want;
  if (await stamped()) return dir;
  // Build into a private folder and rename it into place: two renders starting together (Studio and the
  // CLI) used to delete each other's frames half-way; an interrupted build leaves nothing behind.
  const tmp = project.path('conform', `.frames-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const off = onExit(() => fss.rmSync(tmp, { recursive: true, force: true }));
  try {
    await mkdirp(tmp);
    const c = (f) => project.path('conform', f);
    const inputs = [c('footage.mp4'), ...(timeline.hasMatte ? [c('matte.mp4')] : []), ...(timeline.wide ? [c('wide.mp4'), ...(timeline.hasMatte ? [c('wide-matte.mp4')] : [])] : [])];
    const args = ['-v', 'error', '-y', ...inputs.flatMap((f) => ['-i', f])];
    // Chrome decodes a JPEG as BT.601 full range (JFIF). The footage is BT.709 limited range, so convert the
    // matrix as well as the range; a plain format=yuvj420p kept the BT.709 values and shifted saturated
    // colours by up to ~40 levels against the preview (which plays the BT.709-tagged video correctly).
    const toJpeg = 'scale=in_color_matrix=bt709:in_range=tv:out_color_matrix=bt601:out_range=pc,format=yuvj420p';
    const graph = packGraph({ hasMatte: timeline.hasMatte, wide: !!timeline.wide, height: timeline.height }, { colour: toJpeg, matte: 'scale=in_range=tv:out_range=pc,format=yuvj420p', out: 'format=yuvj420p' });
    args.push('-filter_complex', graph, '-map', '[v]');
    args.push('-fps_mode', 'passthrough', '-q:v', '2', '-progress', 'pipe:2', path.join(tmp, '%06d.jpg'));
    await run('ffmpeg', args, { onLine: (line) => { const m = line.match(/^frame=\s*(\d+)/); if (m) onProgress?.(Math.min(1, Number(m[1]) / timeline.frames)); } });
    await fs.writeFile(path.join(tmp, '.stamp'), want);
    if (await stamped()) return dir;                         // another process finished the same frames first
    await fs.rm(dir, { recursive: true, force: true });
    try { await fs.rename(tmp, dir); } catch (e) { if (!(await stamped())) throw e; }
    return dir;
  } finally {
    off();
    await fs.rm(tmp, { recursive: true, force: true });
  }
}
