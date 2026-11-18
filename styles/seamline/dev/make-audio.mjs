#!/usr/bin/env node
/**
 * make-audio.mjs: Seamline's music beds and its one sound effect, synthesised from code.
 *
 * Writes assets/music/bed-a.m4a, assets/music/bed-b.m4a (48 kHz stereo AAC) and assets/sfx/swell.wav.
 * Everything is original synthesis (band-limited oscillators, seeded noise, filters). No reference audio is read,
 * sampled or copied; the chords and patterns are original choices in the measured register.
 *
 * The measured role of the reference bed (research/audio.md A11-A20): a tonal, dark underscore (90 % of its energy
 * under about 1 kHz, little above 2.5 kHz), wide in stereo, at full level from the first frame (no fade-in), never
 * ducked, 10-13 LU under the voice; a steady pulse in 11 of 27 beds at 78-122 BPM (median 105), none in the rest;
 * a different track in nearly every video. So two beds:
 *   bed-a   105 BPM: a dark keys-and-pad progression over a soft sub pulse on every beat
 *   bed-b   drumless: a slower pad with a low drone note, for videos that want no pulse
 * The opening swell (A22): a low noise swell from frame 0 in 9-10 of 30 videos, peaking about 370 ms in and
 * 20 dB down about 600 ms later, 30-500 Hz with its centroid near 100 Hz, wide.
 *
 *   node styles/seamline/dev/make-audio.mjs
 *
 * Deterministic (no clock, no Math.random). Node 22+, built-ins only; needs ffmpeg on PATH for the AAC encode.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MUSIC = path.resolve(HERE, '..', 'assets', 'music');
const SFX = path.resolve(HERE, '..', 'assets', 'sfx');
const SR = 48000, TAU = 2 * Math.PI;
const BED_RMS_DBFS = -20;                       // the engine expects beds at about -20 dBFS RMS
const dbg = (db) => Math.pow(10, db / 20);
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
const cents = (c) => Math.pow(2, c / 1200);

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** State-variable filter (Zavalishin); f may be a function of time in seconds. */
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

/** A band-limited saw (polyBLEP) added into dst between samples a and b under an attack/release envelope. */
function saw(dst, a, b, f, gain, phase0, attack, release) {
  const dt = f / SR;
  let p = phase0 % 1;
  const A = attack * SR, R = release * SR;
  for (let i = Math.max(0, a); i < b && i < dst.length; i++) {
    let v = 2 * p - 1;
    if (p < dt) { const t = p / dt; v -= t + t - t * t - 1; } else if (p > 1 - dt) { const t = (p - 1) / dt; v -= t * t + t + t + 1; }
    const e = Math.min(1, (i - a) / A, (b - i) / R);
    dst[i] += v * gain * e;
    p += dt; if (p >= 1) p -= 1;
  }
}

/** A soft electric-piano-like tone: sine plus a little second partial, a quick attack and a long decay. */
function keys(dst, a, f, gain, decay = 1.6, len = 3) {
  const n = Math.round(len * SR);
  for (let i = 0; i < n && a + i < dst.length; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.006) * Math.exp(-t / decay);
    dst[a + i] += (Math.sin(TAU * f * t) + 0.18 * Math.sin(TAU * 2 * f * t + 0.3) * Math.exp(-t / 0.4)) * gain * env;
  }
}

function writeWav(file, chans) {
  const n = chans[0].length, C = chans.length;
  const buf = Buffer.alloc(44 + n * 2 * C);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2 * C, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(C, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2 * C, 28); buf.writeUInt16LE(2 * C, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2 * C, 40);
  const d = rng(7);
  for (let i = 0; i < n; i++) for (let c = 0; c < C; c++) {
    const v = Math.max(-32768, Math.min(32767, Math.round(chans[c][i] * 32767 + (d() - d()) * 0.5)));
    buf.writeInt16LE(v, 44 + (i * C + c) * 2);
  }
  fs.writeFileSync(file, buf);
}

function encode(L, R, name) {
  fs.mkdirSync(MUSIC, { recursive: true });
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sl-audio-')), `${name}.wav`);
  writeWav(tmp, [L, R]);
  const out = path.join(MUSIC, `${name}.m4a`);
  const res = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', tmp, '-c:a', 'aac', '-b:a', '160k', '-ar', String(SR), '-ac', '2', '-map_metadata', '-1', '-fflags', '+bitexact', '-flags:a', '+bitexact', out], { encoding: 'utf8' });
  if (res.status !== 0) throw new Error(`ffmpeg failed: ${res.stderr || res.error}`);
  fs.rmSync(path.dirname(tmp), { recursive: true, force: true });
}

/** Scale to the bed level and report RMS, the share of energy below 1 kHz and the side level. */
function finish(L, R, name) {
  let m2 = 0, s2 = 0;
  for (let i = 0; i < L.length; i++) { const m = (L[i] + R[i]) / 2, s = (L[i] - R[i]) / 2; m2 += m * m; s2 += s * s; }
  const g = dbg(BED_RMS_DBFS) / Math.sqrt(m2 / L.length);
  let peak = 0;
  for (let i = 0; i < L.length; i++) { L[i] *= g; R[i] *= g; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
  if (peak > 0.89) { const k = 0.89 / peak; for (let i = 0; i < L.length; i++) { L[i] *= k; R[i] *= k; } }
  const mono = new Float64Array(L.length); for (let i = 0; i < L.length; i++) mono[i] = (L[i] + R[i]) / 2;
  const lo = svf(mono, 'lp', 1000, 0.7);
  let e = 0, el = 0; for (let i = 0; i < mono.length; i++) { e += mono[i] * mono[i]; el += lo[i] * lo[i]; }
  encode(L, R, name);
  console.log(`${name}.m4a: ${(L.length / SR).toFixed(1)} s, peak ${(20 * Math.log10(Math.min(peak, 0.89))).toFixed(1)} dBFS, below 1 kHz ${(100 * el / e).toFixed(0)} %, side ${(10 * Math.log10(s2 / m2)).toFixed(1)} dB re mid`);
}

// ---------------------------------------------------------------- bed-a: 105 BPM, keys and pad over a sub pulse
{
  const BPM = 105, BEAT = 60 / BPM, BEATS = 176;            // about 100 s; longer videos loop it
  const N = Math.round(BEATS * BEAT * SR);
  const at = (b) => Math.round(b * BEAT * SR);
  // an original minor progression, four beats a chord: F minor, D-flat, A-flat, E-flat over C
  const CH = [
    { bass: 29, pad: [56, 60, 63], top: [65, 68] },
    { bass: 25, pad: [56, 61, 65], top: [65, 68] },
    { bass: 32, pad: [56, 60, 63], top: [63, 67] },
    { bass: 24, pad: [55, 58, 63], top: [63, 67] },
  ];
  const chord = (b) => CH[Math.floor(b / 4) % CH.length];
  const pL = new Float64Array(N), pR = new Float64Array(N);
  const r = rng(105);
  for (let b = 0; b < BEATS; b += 4) {
    const c = chord(b), a = at(b), e = Math.min(N, at(b + 4) + Math.round(0.3 * SR));
    for (const note of c.pad) for (const [dl, dr] of [[-8, -3], [3, 8]]) {
      saw(pL, a, e, hz(note) * cents(dl), 0.1, r(), b === 0 ? 0.002 : 0.25, 0.35);   // full level from the first sample [A15]
      saw(pR, a, e, hz(note) * cents(dr), 0.1, r(), b === 0 ? 0.002 : 0.25, 0.35);
    }
  }
  const padL = svf(pL, 'lp', 900, 0.75), padR = svf(pR, 'lp', 900, 0.75);
  // keys: the chord's top notes on beats 1 and 3, a little wider than the pad
  const kL = new Float64Array(N), kR = new Float64Array(N);
  for (let b = 0; b < BEATS; b += 2) {
    const c = chord(b), n = c.top[(b / 2) % 2];
    keys(kL, at(b), hz(n) * cents(-4), 0.22); keys(kR, at(b) + Math.round(0.011 * SR), hz(n) * cents(4), 0.22);
  }
  // a soft sub pulse on every beat: a sine at the chord root, short and round, no click [A17]
  const low = new Float64Array(N);
  for (let b = 0; b < BEATS; b++) {
    const f = hz(chord(b).bass + 12), s = at(b);
    let ph = 0;
    for (let i = 0; i < 0.42 * SR && s + i < N; i++) {
      const t = i / SR, fk = f * (1 + 0.5 * Math.exp(-t / 0.03));
      ph += (TAU * fk) / SR;
      low[s + i] += Math.sin(ph) * 0.55 * Math.min(1, t / 0.008) * Math.exp(-t / 0.16);
    }
  }
  const L = new Float64Array(N), R = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const m = (padL[i] + padR[i]) / 2, s = (padL[i] - padR[i]) / 2;
    const km = (kL[i] + kR[i]) / 2, ks = (kL[i] - kR[i]) / 2;
    const mid = m + km * 0.5 + low[i], side = s * 1.1 + ks * 0.7;
    L[i] = mid + side; R[i] = mid - side;
  }
  const dark = (x) => svf(x, 'lp', 2500, 0.7);               // little above 2.5 kHz [A19]
  finish(dark(L), dark(R), 'bed-a');
}

// ---------------------------------------------------------------- bed-b: drumless pad with a low drone
{
  const N = Math.round(96 * SR);
  const CH = [[53, 56, 60, 63], [51, 56, 60, 63], [49, 53, 56, 60], [48, 51, 55, 60]];   // F minor 7, A-flat over E-flat, D-flat, C minor
  const SEG = 6;                                              // a chord every 6 s
  const pL = new Float64Array(N), pR = new Float64Array(N);
  const r = rng(96);
  for (let k = 0; k * SEG < 96; k++) {
    const c = CH[k % CH.length], a = Math.round(k * SEG * SR), e = Math.min(N, Math.round(((k + 1) * SEG + 1.2) * SR));
    for (const note of c) for (const [dl, dr] of [[-10, -4], [4, 10]]) {
      saw(pL, a, e, hz(note) * cents(dl), 0.09, r(), k === 0 ? 0.002 : 1.2, 1.4);
      saw(pR, a, e, hz(note) * cents(dr), 0.09, r(), k === 0 ? 0.002 : 1.2, 1.4);
    }
  }
  const cut = (t) => 700 + 250 * Math.sin((TAU * t) / 12);    // a slow breath in the filter
  const padL = svf(pL, 'lp', cut, 0.8), padR = svf(pR, 'lp', cut, 0.8);
  const L = new Float64Array(N), R = new Float64Array(N);
  let p1 = 0, p2 = 0;
  for (let i = 0; i < N; i++) {
    p1 += (TAU * hz(29)) / SR; p2 += (TAU * hz(29) * 1.003) / SR;   // a low F drone under it all
    const m = (padL[i] + padR[i]) / 2 + Math.sin(p1) * 0.12, s = (padL[i] - padR[i]) / 2 * 1.2 + Math.sin(p2) * 0.05;
    L[i] = m + s; R[i] = m - s;
  }
  finish(svf(L, 'lp', 2500, 0.7), svf(R, 'lp', 2500, 0.7), 'bed-b');
}

// ---------------------------------------------------------------- the opening swell [A22]
{
  const N = Math.round(1.4 * SR);
  const r1 = rng(22), r2 = rng(23);
  const nL = new Float64Array(N), nR = new Float64Array(N);
  for (let i = 0; i < N; i++) { nL[i] = r1() * 2 - 1; nR[i] = r2() * 2 - 1; }
  const band = (x) => svf(svf(x, 'lp', 260, 0.7), 'hp', 30, 0.7);   // energy 30-500 Hz, centroid near 100 Hz
  const bL = band(nL), bR = band(nR);
  const L = new Float64Array(N), R = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    // up to a peak at 370 ms, then down 20 dB over the next 600 ms (exponential)
    const env = t < 0.37 ? Math.pow(t / 0.37, 2) : Math.exp(-(t - 0.37) / (0.6 / Math.log(10)));
    const sub = Math.sin(TAU * 55 * t) * 0.35;
    L[i] = (bL[i] * 0.9 + sub) * env; R[i] = (bR[i] * 0.9 + sub) * env;
  }
  // loudest 50 ms at -20 dBFS RMS, so gainDb in the tokens is the level against the voice reference
  let best = 0; const w = Math.round(0.05 * SR);
  for (let a = 0; a + w < N; a += w / 2) { let s = 0; for (let i = a; i < a + w; i++) s += (L[i] * L[i] + R[i] * R[i]) / 2; best = Math.max(best, Math.sqrt(s / w)); }
  const g = dbg(-20) / best;
  for (let i = 0; i < N; i++) { L[i] *= g; R[i] *= g; }
  fs.mkdirSync(SFX, { recursive: true });
  writeWav(path.join(SFX, 'swell.wav'), [L, R]);
  console.log('swell.wav: 1.4 s, peak at 370 ms, -20 dB by 970 ms');
}
