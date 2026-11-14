#!/usr/bin/env node
/**
 * make-audio.mjs: the Ember Brief music bed, synthesised from code.
 *
 * Writes assets/music/bed-a.m4a (48 kHz, stereo, AAC): one original track that plays from its start under
 * the whole video. The style has no sound effects (research/audio.md A22, A28), so this is its only sound.
 *
 * Everything is original synthesis (band-limited oscillators, seeded noise, filters). The targets are the
 * measured role of the reference bed (research/audio.md A14-A20, A27): 90 BPM, a hard start 48 ms in, a
 * drumless stereo pad for 16 beats, a mono sub-and-soft-kick body from beat 16, a 4-beat break at beat 28,
 * the full beat with eighth-note hats from beat 32, an 8-beat harmonic loop, and the level of each section
 * relative to the others. No reference audio is read, sampled or copied. The chords, the bass line and the
 * kick pattern are original choices in the measured register; they are not a transcription.
 *
 *   node styles/ember-brief/dev/make-audio.mjs
 *
 * Deterministic: the same samples on every run (no clock, no Math.random). Node 22+, built-ins only; needs
 * ffmpeg on PATH for the AAC encode. Prints the section levels it reached so they can be checked against A14.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(HERE, '..', 'assets', 'music');
const SR = 48000, TAU = 2 * Math.PI;

// ---- the measured frame (research/audio.md)
const BPM = 90, BEAT = 60 / BPM;               // [A17]
const LEAD = 0.048;                            // the bed starts 48 ms into the file, with no fade-in [A15]
const BEATS = 144;                             // 96 s: longer than any video the style is for [S19]
const SEC = { intro: [0, 16], body: [16, 28], brk: [28, 32], full: [32, BEATS] };   // [A18]
// level of each section relative to the body, set so the K-weighted loudness of the sections steps as measured:
// -37.4 / -33.2 / -36.3 / -32.9 LUFS in the reference mix, i.e. -4.2 / 0 / -3.1 / +0.3 LU re the body [A14]
const LEVEL = { intro: -5.85, body: 0, brk: -4.85, full: 0.35 };
const BODY_RMS_DBFS = -20;                     // the engine expects beds at about -20 dBFS RMS

const N = Math.round((LEAD + BEATS * BEAT) * SR);
const at = (beat) => Math.round((LEAD + beat * BEAT) * SR);
const dbg = (db) => Math.pow(10, db / 20);
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

/** mulberry32: a small seeded generator, uniform in [0, 1). */
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** One-pole-pair state-variable low-pass or band-pass with a cutoff that may change over time (Zavalishin). */
function svf(x, mode, f, q = Math.SQRT1_2) {
  const y = new Float64Array(x.length);
  const ff = typeof f === 'function' ? f : () => f;
  let ic1 = 0, ic2 = 0, a1 = 0, a2 = 0, a3 = 0;
  const k = 1 / q;
  for (let i = 0; i < x.length; i++) {
    if (i % 16 === 0) { const g = Math.tan((Math.PI * Math.min(Math.max(ff(i / SR), 10), SR * 0.45)) / SR); a1 = 1 / (1 + g * (g + k)); a2 = g * a1; a3 = g * a2; }
    const v3 = x[i] - ic2, v1 = a1 * ic1 + a2 * v3, v2 = ic2 + a2 * ic1 + a3 * v3;
    ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2;
    y[i] = mode === 'lp' ? v2 : mode === 'bp' ? k * v1 : x[i] - k * v1 - v2;
  }
  return y;
}

/** A saw without aliasing (polyBLEP), added into dst from sample a to b under an attack/release envelope. */
function saw(dst, a, b, f, gain, phase0, attack = 0.12, release = 0.25) {
  const dt = f / SR;
  let p = phase0 % 1;
  const A = attack * SR, R = release * SR;
  for (let i = a; i < b && i < dst.length; i++) {
    let v = 2 * p - 1;
    if (p < dt) { const t = p / dt; v -= t + t - t * t - 1; } else if (p > 1 - dt) { const t = (p - 1) / dt; v -= t * t + t + t + 1; }
    const e = Math.min(1, (i - a) / A, (b - i) / R);
    dst[i] += v * gain * e;
    p += dt; if (p >= 1) p -= 1;
  }
}

// ---- the harmony: an 8-beat loop of four chords, two beats each (an original progression) [A18: 8-beat loop]
const CHORDS = [
  { bass: 36, pad: [51, 55, 58] },   // C2 under E-flat, G, B-flat
  { bass: 32, pad: [51, 55, 60] },   // A-flat1 under E-flat, G, C
  { bass: 34, pad: [50, 53, 58] },   // B-flat1 under D, F, B-flat
  { bass: 31, pad: [50, 55, 58] },   // G1 under D, G, B-flat
];
const chordAt = (beat) => CHORDS[Math.floor(beat / 2) % CHORDS.length];
const inSec = (beat, s) => beat >= SEC[s][0] && beat < SEC[s][1];

// ---- pad: three detuned saws per note, detuned differently left and right so it is wide [A20, A27]
const padL = new Float64Array(N), padR = new Float64Array(N);
{
  const r = rng(90);
  const cents = (c) => Math.pow(2, c / 1200);
  for (let b = 0; b < BEATS; b += 2) {
    const c = chordAt(b);
    const a = at(b), e = at(b + 2) + Math.round(0.2 * SR);
    for (const note of c.pad) {
      for (const [dl, dr] of [[-9, -5], [-2, 2], [5, 9]]) {
        saw(padL, a, e, hz(note) * cents(dl), 0.16, r());
        saw(padR, a, e, hz(note) * cents(dr), 0.16, r());
      }
    }
    // the bass note an octave up, so the pad has a floor near 100 Hz before the sub arrives [A19: intro peaks 73-110 Hz]
    for (const [dl, dr] of [[-6, -2], [2, 6]]) {
      saw(padL, a, e, hz(c.bass + 12) * cents(dl), 0.3, r());
      saw(padR, a, e, hz(c.bass + 12) * cents(dr), 0.3, r());
    }
  }
}
// the low-pass: opens from 400 Hz to 3 kHz over the intro, sits near 500 Hz under the drums, opens again in the break [A27]
const cutoff = (t) => {
  const beat = (t - LEAD) / BEAT;
  if (beat < 16) return 400 * Math.pow(3000 / 400, Math.max(0, beat) / 16);
  if (beat < 28) return 850;
  if (beat < 32) return 850 * Math.pow(2400 / 850, (beat - 28) / 4);
  return 900;
};
let pL = svf(padL, 'lp', cutoff, 0.8), pR = svf(padR, 'lp', cutoff, 0.8);
// hard start: nothing before the lead, then the pad at once (2 ms so there is no click) [A15]
for (let i = 0; i < N; i++) { const g = i < at(0) ? 0 : Math.min(1, (i - at(0)) / (0.002 * SR)); pL[i] *= g; pR[i] *= g; }

// ---- sub and soft kick: mono, from beat 16, out for the break [A18, A19, A27]
const low = new Float64Array(N);
{
  // the kick pattern over two beats: an original syncopation
  const KICK = [0, 0.75, 1.5];
  let ph = 0;
  for (let b = 16; b < BEATS; b += 2) {
    if (inSec(b, 'brk')) continue;
    const f = hz(chordAt(b).bass);
    const a = at(b), e = at(b + 2);
    for (let i = a; i < e && i < N; i++) {
      const env = Math.min(1, (i - a) / (0.03 * SR), (e - i) / (0.06 * SR));
      low[i] += (Math.sin(ph) * 0.26 + Math.sin(2 * ph) * 0.2) * env;   // the sub and its octave
      ph += (TAU * f) / SR;
    }
    for (const k of KICK) {
      const s = at(b + k);
      let kp = 0;
      for (let i = 0; i < 0.4 * SR && s + i < N; i++) {
        const t = i / SR;
        const kf = 50 + 60 * Math.exp(-t / 0.02);            // sweeps 110 -> 50 Hz in about 60 ms
        kp += (TAU * kf) / SR;
        low[s + i] += Math.sin(kp) * 0.6 * Math.min(1, t / 0.003) * Math.exp(-t / 0.075);   // about 150 ms decay
      }
    }
  }
}

// ---- hats on eighth notes and a held tone near 300 Hz, from beat 32 [A18, A20, A27]
const hatM = new Float64Array(N), hatS = new Float64Array(N), tone = new Float64Array(N), toneS = new Float64Array(N);
{
  const r = rng(32), r2 = rng(33);
  const nz = new Float64Array(N), nz2 = new Float64Array(N);
  for (let i = at(32); i < N; i++) { nz[i] = r() * 2 - 1; nz2[i] = r2() * 2 - 1; }
  const band = svf(svf(nz, 'bp', 9800, 0.9), 'hp', 6000, 0.7), band2 = svf(svf(nz2, 'bp', 9800, 0.9), 'hp', 6000, 0.7);
  for (let e8 = 64; e8 < BEATS * 2; e8++) {
    const b = e8 / 2;
    if ((b % 32) >= 30) continue;                              // two beats of air at the end of every 32
    const s = at(b), acc = e8 % 2 === 0 ? 1 : 0.6;
    for (let i = 0; i < 0.25 * SR && s + i < N; i++) {
      const t = i / SR, env = Math.min(1, t / 0.005) * Math.exp(-t / 0.022) * acc;   // 5 ms attack, about 50 ms decay
      hatM[s + i] += band[s + i] * env; hatS[s + i] += band2[s + i] * env * 0.12;   // side about 11 dB under mid
    }
  }
  const f = hz(63);                                            // E-flat 4, 311 Hz
  for (let i = at(32); i < N; i++) {
    const t = (i - at(32)) / SR, env = Math.min(1, t / 1.5);
    tone[i] = Math.sin(TAU * f * t) * env; toneS[i] = Math.sin(TAU * f * 1.003 * t + 1) * env * 0.6;
  }
}

// ---- a quiet low floor under the drumless parts, as wide as the pad [A19, A20: 30-70 Hz side about equal to mid]
const floor = new Float64Array(N), floorS = new Float64Array(N);
{
  let p1 = 0, p2 = 0;
  for (let b = 0; b < BEATS; b += 2) {
    if (!(inSec(b, 'intro') || inSec(b, 'brk'))) continue;
    const f = hz(chordAt(b).bass), a = at(b), e = at(b + 2);
    for (let i = a; i < e && i < N; i++) {
      const env = Math.min(1, (i - a) / (0.08 * SR), (e - i) / (0.1 * SR));
      floor[i] = Math.sin(p1) * 0.07 * env; floorS[i] = Math.sin(p2) * 0.06 * env;
      p1 += (TAU * f) / SR; p2 += (TAU * f * 1.004) / SR;
    }
  }
}

// ---- mix: the pad is wide in the intro and the break and mono under the drums [A20]
const L = new Float64Array(N), R = new Float64Array(N);
for (let i = 0; i < N; i++) {
  const beat = (i / SR - LEAD) / BEAT;
  const m = (pL[i] + pR[i]) / 2, s = (pL[i] - pR[i]) / 2;
  // side 7 dB under mid in the intro and the break, 26 dB under in the body, 13.5 dB under in the full beat [A20]
  const wide = beat < 16 || (beat >= 28 && beat < 32) ? 0.44 : beat >= 32 ? 0.4 : 0.03;
  const padGain = beat >= 32 ? 0.6 : 1;
  const mid = m * padGain + low[i] + floor[i] + hatM[i] * 0.9 + tone[i] * 0.06;
  const side = s * wide * padGain + floorS[i] + hatS[i] * 0.9 + toneS[i] * 0.06;
  L[i] = mid + side; R[i] = mid - side;
}

// ---- level each section to its measured place relative to the body, with 60 ms ramps at the joins [A14]
const rms = (a, b) => { let n = 0; for (let i = a; i < b; i++) { const m = (L[i] + R[i]) / 2; n += m * m; } return Math.sqrt(n / Math.max(1, b - a)); };
const gains = Object.fromEntries(Object.entries(SEC).map(([k, [b0, b1]]) => [k, dbg(BODY_RMS_DBFS + LEVEL[k]) / rms(at(b0), Math.min(N, at(b1)))]));
const order = ['intro', 'body', 'brk', 'full'];
const ramp = Math.round(0.06 * SR);
for (let i = 0; i < N; i++) {
  const beat = (i / SR - LEAD) / BEAT;
  let k = order.findIndex((s) => beat < SEC[s][1]); if (k < 0) k = order.length - 1;
  let g = gains[order[k]];
  const next = order[k + 1];
  if (next) { const d = at(SEC[next][0]) - i; if (d < ramp) g = g + (gains[next] - g) * (1 - d / ramp); }
  L[i] *= g; R[i] *= g;
}
const report = Object.fromEntries(order.map((k) => [k, (20 * Math.log10(rms(at(SEC[k][0]), Math.min(N, at(SEC[k][1]))))).toFixed(2)]));
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));

// ---- write
function writeWav(file, l, r) {
  const buf = Buffer.alloc(44 + l.length * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + l.length * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(l.length * 4, 40);
  // triangular dither from a fixed seed, so the bytes repeat
  const d = rng(7);
  for (let i = 0; i < l.length; i++) {
    const q = (v) => Math.max(-32768, Math.min(32767, Math.round(v * 32767 + (d() - d()) * 0.5)));
    buf.writeInt16LE(q(l[i]), 44 + i * 4); buf.writeInt16LE(q(r[i]), 46 + i * 4);
  }
  fs.writeFileSync(file, buf);
}
fs.mkdirSync(OUT_DIR, { recursive: true });
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'eb-audio-')), 'bed-a.wav');
writeWav(tmp, L, R);
const out = path.join(OUT_DIR, 'bed-a.m4a');
const res = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', tmp, '-c:a', 'aac', '-b:a', '128k', '-ar', String(SR), '-ac', '2', '-map_metadata', '-1', '-fflags', '+bitexact', '-flags:a', '+bitexact', out], { encoding: 'utf8' });
if (res.status !== 0) throw new Error(`ffmpeg failed: ${res.stderr || res.error}`);
if (process.argv.includes('--keep-wav')) { fs.copyFileSync(tmp, path.join(OUT_DIR, 'bed-a.wav')); }
fs.rmSync(path.dirname(tmp), { recursive: true, force: true });
console.log(`bed-a.m4a: ${(N / SR).toFixed(2)} s, ${BEATS} beats at ${BPM} BPM, peak ${(20 * Math.log10(peak)).toFixed(1)} dBFS`);
console.log(`mid RMS by section (dBFS): ${JSON.stringify(report)}`);
