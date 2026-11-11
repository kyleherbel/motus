// Person matte and face tracking through Apple Vision (macOS). The Swift helper is
// compiled on first use into the cache; on other systems these return "unavailable"
// and styles fall back to un-matted framing.
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { run, exists, mkdirp, ENGINE, CACHE, MotusError } from './util.mjs';

const SRC = path.join(ENGINE, 'swift', 'motus-vision.swift');

/** Path of the compiled helper, building it if needed; null when this machine cannot run it. */
export async function visionTool(log = () => {}) {
  if (process.platform !== 'darwin') return null;
  if (!(await exists(SRC))) return null;
  const hash = crypto.createHash('sha1').update(await fs.readFile(SRC)).digest('hex').slice(0, 10);
  const bin = path.join(CACHE, `motus-vision-${hash}`);
  if (await exists(bin)) return bin;
  await mkdirp(CACHE);
  log('compiling the vision helper (first run only)');
  // compile beside the target and rename: two processes compiling at once never run a half-written binary
  const tmp = `${bin}.${process.pid}.tmp`;
  try {
    await run('swiftc', ['-O', '-swift-version', '5', SRC, '-o', tmp]);
    await fs.rename(tmp, bin);
  } catch (e) {
    await fs.rm(tmp, { force: true }).catch(() => {});
    log(`vision helper unavailable: ${e.message.split('\n')[0]}`);
    return null;
  }
  return bin;
}

const med = (a) => { const s = a.filter((x) => Number.isFinite(x)).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };

/**
 * Sample the speaker's face over the video.
 * Returns { available, width, height, samples:[{t, face:{x,y,w,h}, eyeX, eyeY, headTopY, chinY}], median:{...} }
 * with every coordinate normalised to 0..1 of the source frame.
 */
export async function faceTrack(video, { n = 48, log = () => {} } = {}) {
  const bin = await visionTool(log);
  if (!bin) return { available: false, reason: process.platform === 'darwin' ? 'Swift toolchain not available' : 'Apple Vision is macOS only' };
  const { stdout } = await run(bin, ['faces', video, '--n', String(n), '--seg', 'balanced']);
  const j = JSON.parse(stdout.trim().split('\n').pop());
  const W = j.width, H = j.height;
  const samples = (j.samples || []).filter((s) => s.box).map((s) => ({
    t: s.t,
    face: { x: s.box[0] / W, y: s.box[1] / H, w: s.box[2] / W, h: s.box[3] / H },
    eyeX: s.eye_mid_x != null ? s.eye_mid_x / W : (s.box[0] + s.box[2] / 2) / W,
    eyeY: s.eye_line_y != null ? s.eye_line_y / H : (s.box[1] + s.box[3] * 0.4) / H,
    eyeDist: s.eye_dist != null ? s.eye_dist / W : null,
    headTopY: s.head_top_y != null ? s.head_top_y / H : null,
    chinY: s.chin_y != null ? s.chin_y / H : null,
    headSpan: s.head_span_at_eyes ? [s.head_span_at_eyes[0] / W, s.head_span_at_eyes[1] / W] : null,
  }));
  if (samples.length < Math.max(3, (j.sampled || 0) * 0.3)) return { available: false, reason: `a face was found in only ${samples.length} of ${j.sampled} sampled frames`, width: W, height: H };
  const median = {
    cx: med(samples.map((s) => s.eyeX)), eyeY: med(samples.map((s) => s.eyeY)),
    faceW: med(samples.map((s) => s.face.w)), faceH: med(samples.map((s) => s.face.h)),
    eyeDist: med(samples.map((s) => s.eyeDist)),
    headTopY: med(samples.map((s) => s.headTopY)), chinY: med(samples.map((s) => s.chinY)),
    headW: med(samples.map((s) => (s.headSpan ? s.headSpan[1] - s.headSpan[0] : NaN))),
    driftX: (() => { const xs = samples.map((s) => s.eyeX); return Math.max(...xs) - Math.min(...xs); })(),
    driftY: (() => { const ys = samples.map((s) => s.eyeY); return Math.max(...ys) - Math.min(...ys); })(),
  };
  return { available: true, width: W, height: H, sampled: j.sampled, found: samples.length, median, samples };
}

/**
 * Person matte for a whole video, written as a greyscale H.264 file with the same
 * frame count and size as the input. Returns { ok, frames, seconds } or { ok:false, reason }.
 */
export async function matteVideo(video, out, { width, height, rate, mode = 'person-accurate', log = () => {}, onProgress } = {}) {
  const bin = await visionTool(log);
  if (!bin) return { ok: false, reason: process.platform === 'darwin' ? 'Swift toolchain not available' : 'Apple Vision is macOS only' };
  const t0 = Date.now();
  return new Promise((resolve, reject) => {
    const tool = spawn(bin, ['matte', video, '--mode', mode, '--raw', '-'], { stdio: ['ignore', 'pipe', 'pipe'] });
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', `${width}x${height}`, '-framerate', rate, '-i', '-',
      // a light temporal + spatial clean-up, then encode; mattes are low-detail so this stays small
      '-vf', 'format=gray,gblur=sigma=1.2:steps=1,format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-g', '12', '-pix_fmt', 'yuv420p', '-color_range', 'tv', out], { stdio: ['pipe', 'ignore', 'pipe'] });
    let toolErr = '', ffErr = '', bytes = 0;
    tool.stdout.on('data', (c) => { bytes += c.length; onProgress?.(bytes / (width * height)); });
    tool.stdout.pipe(ff.stdin);
    tool.stderr.on('data', (c) => { toolErr += c; });
    ff.stderr.on('data', (c) => { ffErr += c; });
    ff.stdin.on('error', () => {});
    const kill = (p) => { try { p.kill('SIGKILL'); } catch { /* gone */ } };
    // one side failing to start must not leave the other running (ffmpeg would wait on stdin forever)
    tool.on('error', (e) => { kill(ff); reject(new MotusError(`Could not run the vision helper: ${e.message}`, 'Run: motus conform <project> --no-matte to continue without the person matte.')); });
    ff.on('error', (e) => { kill(tool); reject(new MotusError(`Could not run ffmpeg: ${e.message}`, 'Run: motus doctor')); });
    ff.on('close', (code) => {
      if (code !== 0) { kill(tool); return resolve({ ok: false, reason: `matte encode failed: ${(ffErr || toolErr).trim().split('\n').pop()}` }); }
      let stats = {};
      try { stats = JSON.parse(toolErr.trim().split('\n').filter((l) => l.startsWith('{')).pop() || '{}'); } catch { /* stats are optional */ }
      const frames = Math.round(bytes / (width * height));
      if (!frames) return resolve({ ok: false, reason: `the vision helper produced no frames: ${toolErr.trim().split('\n').pop()}` });
      resolve({ ok: true, frames, emptyFrames: stats.empty_frames ?? 0, seconds: (Date.now() - t0) / 1000, mode });
    });
  });
}
