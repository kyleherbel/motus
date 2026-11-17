// Audio for the final mix: decode anything to float PCM through ffmpeg, place sound
// effects sample-accurately, write WAV, measure and normalise loudness.
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import { run, MotusError } from './util.mjs';

export const RATE = 48000;
export const CH = 2;

/** Decode any audio file to interleaved stereo Float32 at 48 kHz. */
export function decode(file, { start, duration } = {}) {
  return new Promise((resolve, reject) => {
    const args = ['-v', 'error', ...(start ? ['-ss', String(start)] : []), ...(duration ? ['-t', String(duration)] : []), '-i', file, '-f', 'f32le', '-ac', String(CH), '-ar', String(RATE), '-'];
    const p = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });   // no console window under the detached Studio server
    const chunks = []; let err = '';
    p.stdout.on('data', (c) => chunks.push(c));
    p.stderr.on('data', (c) => { err += c; });
    p.on('error', (e) => reject(new MotusError(`Could not start ffmpeg: ${e.message}`)));
    p.on('close', (code) => {
      if (code !== 0) return reject(new MotusError(`Could not decode audio ${file}\n${err.trim().split('\n').slice(-3).join('\n')}`));
      const buf = Buffer.concat(chunks);
      const out = new Float32Array(buf.byteLength / 4);
      for (let i = 0; i < out.length; i++) out[i] = buf.readFloatLE(i * 4);
      resolve(out);
    });
  });
}

/** Write interleaved stereo Float32 as a 32-bit float WAV. */
export async function writeWav(file, samples) {
  const data = Buffer.alloc(samples.length * 4);
  for (let i = 0; i < samples.length; i++) data.writeFloatLE(samples[i], i * 4);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(CH, 22); h.writeUInt32LE(RATE, 24);
  h.writeUInt32LE(RATE * CH * 4, 28); h.writeUInt16LE(CH * 4, 32); h.writeUInt16LE(32, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  await fs.writeFile(file, Buffer.concat([h, data]));
}

export const dbToGain = (db) => 10 ** (db / 20);

/**
 * Add `src` into `dst` starting at second `t` with a linear gain. Both interleaved stereo.
 * A sound that starts before 0 (a whoosh leading into the first frame) is trimmed, not delayed.
 */
export function mixInto(dst, src, t, gain = 1) {
  const at = Math.round(t * RATE);
  const skip = at < 0 ? -at * CH : 0;
  const off = Math.max(0, at) * CH;
  const n = Math.min(src.length - skip, dst.length - off);
  for (let i = 0; i < n; i++) dst[off + i] += src[skip + i] * gain;
}

/** EBU R128 measurement of a file: { i, tp, lra, thresh, offset } */
export async function measureLoudness(file, target = { i: -14, tp: -2, lra: 11 }) {
  const { stderr } = await run('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', `loudnorm=I=${target.i}:TP=${target.tp}:LRA=${target.lra}:print_format=json`, '-f', 'null', '-']);
  const m = stderr.match(/\{[\s\S]*?"input_i"[\s\S]*?\}/);
  if (!m) throw new MotusError('Could not measure loudness.');
  const j = JSON.parse(m[0]);
  return { i: Number(j.input_i), tp: Number(j.input_tp), lra: Number(j.input_lra), thresh: Number(j.input_thresh), offset: Number(j.target_offset) };
}

/**
 * The ffmpeg audio filter that brings a measured mix to the delivery target with a
 * plain gain change where possible (linear mode), so quiet passages stay quiet.
 */
export function loudnormFilter(measured, target = { i: -14, tp: -2, lra: 11 }) {
  // linear mode needs target LRA >= source LRA; loudnorm accepts 1-50 (beyond that ffmpeg refuses to run)
  const lra = Math.min(50, Math.max(target.lra, Math.ceil(Number.isFinite(measured.lra) ? measured.lra : 0) + 1));
  return `loudnorm=I=${target.i}:TP=${target.tp}:LRA=${lra}:measured_I=${measured.i}:measured_TP=${measured.tp}:measured_LRA=${measured.lra}:measured_thresh=${measured.thresh}:offset=${measured.offset}:linear=true:print_format=summary`;
}
