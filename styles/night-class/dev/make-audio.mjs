#!/usr/bin/env node
/**
 * make-audio.mjs: the Night Class sound, synthesised from code.
 *
 * Writes the effects named in style.head.json "sfx" to assets/sfx/<name>.wav (48 kHz, stereo, 16-bit) and the
 * two bed files to assets/music/bed-a.m4a (bed A: six loops of 7.385 s) and bed-a2.m4a (the late loop, 14.77 s,
 * two passes). Everything is original synthesis (seeded noise, oscillators, filters). The targets (durations,
 * envelopes, bands, widths, the bed's tempo, register and loop length) are the measured style in
 * research/audio.md (A06-A24); no reference audio is read, sampled or copied, and the bed's notes are an original
 * progression in the measured register, not a transcription.
 *
 * Contract, every effect: no DC, short end fades, true peak under -1 dBTP, loudest 50 ms window at -20 dBFS RMS,
 * so tokens.sound gainDb alone places it under the voice; an effect whose picture change lands later than its
 * start (lead in tokens.sound) peaks or stops exactly there. Beds: mono, energy 40-250 Hz, mid RMS -20 dBFS.
 *
 *   node styles/night-class/dev/make-audio.mjs                  # everything
 *   node styles/night-class/dev/make-audio.mjs --only swell,riser
 *
 * Deterministic: the same bytes on every run (no clock, no Math.random). Node 22+, built-ins only; the beds
 * need ffmpeg on PATH for the AAC encode.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STYLE = path.resolve(HERE, '..');
const SFX_DIR = path.join(STYLE, 'assets', 'sfx');
const MUSIC_DIR = path.join(STYLE, 'assets', 'music');
const SR = 48000;
const TAU = 2 * Math.PI;

// ------------------------------------------------------------------------------------------- basics
const ns = (sec) => Math.round(sec * SR);
const dbg = (db) => Math.pow(10, db / 20);
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const midiHz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const fnOf = (v) => (typeof v === 'function' ? v : () => v);

/** mulberry32: a small seeded generator, uniform in [0, 1). */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Gaussian white noise, unit variance, from a seed. */
function noise(n, seed) {
  const r = rng(seed);
  const y = new Float64Array(n);
  for (let i = 0; i < n; i += 2) {
    const u = Math.max(r(), 1e-12), v = r();
    const m = Math.sqrt(-2 * Math.log(u));
    y[i] = m * Math.cos(TAU * v);
    if (i + 1 < n) y[i + 1] = m * Math.sin(TAU * v);
  }
  return y;
}

/** Envelope through [t, dB] points, linear in dB between them (so segments are exponential); <= -90 dB is silence. */
function envDb(n, pts) {
  const y = new Float64Array(n);
  const last = pts.length - 1;
  let j = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let d;
    if (t <= pts[0][0]) d = pts[0][1];
    else if (t >= pts[last][0]) d = pts[last][1];
    else {
      while (t >= pts[j + 1][0]) j++;
      const [t0, d0] = pts[j], [t1, d1] = pts[j + 1];
      d = d0 + ((d1 - d0) * (t - t0)) / (t1 - t0);
    }
    y[i] = d <= -90 ? 0 : dbg(d);
  }
  return y;
}

/** Sine (or its h-th harmonic, phase-locked) with a fixed or time-varying frequency. */
function sine(n, f, { phase = 0, h = 1 } = {}) {
  const ff = fnOf(f);
  const y = new Float64Array(n);
  let p = phase;
  for (let i = 0; i < n; i++) {
    y[i] = Math.sin(h * p);
    p += (TAU * ff(i / SR)) / SR;
  }
  return y;
}

/** The accumulated phase of sine() at sample k (to place a zero crossing on an exact sample). */
function phaseAt(f, k) {
  const ff = fnOf(f);
  let p = 0;
  for (let i = 0; i < k; i++) p += (TAU * ff(i / SR)) / SR;
  return p;
}

/**
 * Topology-preserving state-variable filter (Zavalishin), stable under fast modulation.
 * mode lp | hp | bp (unity gain at the centre). f and q: numbers or functions of time in seconds.
 */
function svf(x, mode, f, q = Math.SQRT1_2, step = 8) {
  const ff = fnOf(f), qq = fnOf(q);
  const y = new Float64Array(x.length);
  let ic1 = 0, ic2 = 0, a1 = 0, a2 = 0, a3 = 0, k = 1;
  for (let i = 0; i < x.length; i++) {
    if (i % step === 0) {
      const fc = Math.min(Math.max(ff(i / SR), 5), SR * 0.45);
      const g = Math.tan((Math.PI * fc) / SR);
      k = 1 / qq(i / SR);
      a1 = 1 / (1 + g * (g + k));
      a2 = g * a1;
      a3 = g * a2;
    }
    const v3 = x[i] - ic2;
    const v1 = a1 * ic1 + a2 * v3;
    const v2 = ic2 + a2 * ic1 + a3 * v3;
    ic1 = 2 * v1 - ic1;
    ic2 = 2 * v2 - ic2;
    y[i] = mode === 'lp' ? v2 : mode === 'bp' ? k * v1 : x[i] - k * v1 - v2;
  }
  return y;
}
/** Fourth-order Butterworth low- or high-pass (two SVF stages). */
const butter4 = (x, mode, f) => svf(svf(x, mode, f, 0.5412), mode, f, 1.3066);

function mul(a, b) {
  const y = new Float64Array(a.length);
  for (let i = 0; i < a.length; i++) y[i] = a[i] * b[i];
  return y;
}
/** Sum of [signal, gain] pairs (all the same length). */
function sum(...parts) {
  const y = new Float64Array(parts[0][0].length);
  for (const [x, g] of parts) for (let i = 0; i < y.length; i++) y[i] += x[i] * g;
  return y;
}
/** Mid/side to left/right. */
function stereo(mid, side, w = 1) {
  const L = new Float64Array(mid.length), R = new Float64Array(mid.length);
  for (let i = 0; i < mid.length; i++) { L[i] = mid[i] + w * side[i]; R[i] = mid[i] - w * side[i]; }
  return { L, R };
}
const mono = (x) => ({ L: x, R: Float64Array.from(x) });
function addInto(dst, src, at = 0, g = 1) {
  for (let i = 0; i < src.length && at + i < dst.length; i++) if (at + i >= 0) dst[at + i] += src[i] * g;
}

// ------------------------------------------------------------------------------------- finishing
/** Peak of the 4x oversampled signal (windowed-sinc interpolation), linear. */
function truePeak(x) {
  const P = 4, H = 16;
  let peak = 0;
  for (let i = 0; i < x.length; i++) peak = Math.max(peak, Math.abs(x[i]));
  for (let k = 1; k < P; k++) {
    const fr = k / P, ker = [];
    for (let j = -H + 1; j <= H; j++) {
      const t = fr - j, w = 0.42 + 0.5 * Math.cos((Math.PI * t) / H) + 0.08 * Math.cos((2 * Math.PI * t) / H);
      ker.push((t === 0 ? 1 : Math.sin(Math.PI * t) / (Math.PI * t)) * w);
    }
    for (let i = 0; i < x.length; i++) {
      let s = 0;
      for (let j = -H + 1, m = 0; j <= H; j++, m++) { const n = i + j; if (n >= 0 && n < x.length) s += x[n] * ker[m]; }
      if (Math.abs(s) > peak) peak = Math.abs(s);
    }
  }
  return peak;
}

/** Loudest 50 ms window: RMS over both channels, linear. */
function loudest50(L, R) {
  const w = ns(0.05), n = L.length;
  let acc = 0, best = 0;
  for (let i = 0; i < n; i++) {
    acc += (L[i] * L[i] + R[i] * R[i]) / 2;
    if (i >= w) acc -= (L[i - w] * L[i - w] + R[i - w] * R[i - w]) / 2;
    if (i >= w - 1 || i === n - 1) best = Math.max(best, acc / Math.min(w, i + 1));
  }
  return Math.sqrt(best);
}

/** Exactly zero mean without steps: remove the mean as a Hann-shaped component (zero at both ends). */
function zeroMean(x) {
  const n = x.length;
  let s = 0, sw = 0;
  const w = (i) => 0.5 - 0.5 * Math.cos((TAU * (i + 0.5)) / n);
  for (let i = 0; i < n; i++) { s += x[i]; sw += w(i); }
  const m = s / sw;
  for (let i = 0; i < n; i++) x[i] -= m * w(i);
}

/** Gentle peak limiter for the odd transient: gain under `ceil` from a 1 ms look-ahead minimum, smoothed (2 ms). */
function limitPeaks(L, R, ceil) {
  const n = L.length, w = ns(0.001), g = new Float64Array(n).fill(1);
  for (let i = 0; i < n; i++) {
    const a = Math.max(Math.abs(L[i]), Math.abs(R[i]));
    if (a > ceil) for (let j = Math.max(0, i - w); j <= Math.min(n - 1, i + w); j++) g[j] = Math.min(g[j], ceil / a);
  }
  const s = ns(0.002), h = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let m = 0, z = 0;
    for (let j = -s; j <= s; j++) { const k = Math.min(n - 1, Math.max(0, i + j)), q = 0.5 + 0.5 * Math.cos((Math.PI * j) / (s + 1)); m += Math.min(g[k], 1) * q; z += q; }
    h[i] = Math.min(m / z, g[i]);
  }
  for (let i = 0; i < n; i++) { L[i] *= h[i]; R[i] *= h[i]; }
}

/** Fades, zero DC, -20 dBFS loudest 50 ms, true peak under -1 dBTP (limited if a transient demands it). Returns stats. */
function finishSfx({ L, R }, { fadeIn = 0.001, fadeOut = 0.012 } = {}) {
  for (const x of [L, R]) {
    const a = ns(fadeIn), b = ns(fadeOut), n = x.length;
    for (let i = 0; i < a; i++) x[i] *= 0.5 - 0.5 * Math.cos((Math.PI * i) / a);
    for (let i = 0; i < b; i++) x[n - 1 - i] *= 0.5 - 0.5 * Math.cos((Math.PI * i) / b);
    zeroMean(x);
  }
  let tp = 0, limited = 0;
  for (let pass = 0; pass < 8; pass++) {
    const g = dbg(-20) / loudest50(L, R);
    for (let i = 0; i < L.length; i++) { L[i] *= g; R[i] *= g; }
    tp = 20 * Math.log10(Math.max(truePeak(L), truePeak(R)));
    if (tp <= -1.2) break;
    limitPeaks(L, R, dbg(-1.6));
    limited++;
  }
  if (tp > -1.1) throw new Error(`true peak ${tp.toFixed(2)} dBTP stays over -1.1: reduce the transient`);
  return { tp, limited };
}

function writeWav(file, L, R) {
  const n = L.length;
  const b = Buffer.alloc(44 + n * 4);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 4, 4); b.write('WAVE', 8);
  b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(n * 4, 40);
  const q = (v) => Math.max(-32768, Math.min(32767, Math.round(v * 32768)));
  for (let i = 0; i < n; i++) { b.writeInt16LE(q(L[i]), 44 + 4 * i); b.writeInt16LE(q(R[i]), 46 + 4 * i); }
  fs.writeFileSync(file, b);
}

// ---------------------------------------------------------------------------------------- effects
// Each returns { L, R } before finishing. Times are seconds from the file start. Comments give the target.


// ---------------------------------------------------------------------------------------- effects
// Each returns { L, R } before finishing. Times are seconds from the file start.

/** Decorrelated pair from one recipe: L/R correlation about `corr`. */
function pair(make, seed, corr) {
  const a = make(seed), b = make(seed + 1), c = Math.sqrt(1 - corr * corr);
  return { L: a, R: a.map((v, i) => corr * v + c * b[i]) };
}

/**
 * K1 swell, 0.60 s: by energy a sub-bass swell (most energy 16-37 Hz) with an audible low-mid layer about 15 dB
 * down (125-500 Hz); rise 0.35 s, fall 0.25 s; L/R 0.9 [A17; verified].
 */
function swell() {
  const n = ns(0.6);
  const env = envDb(n, [[0, -46], [0.18, -22], [0.3, -6], [0.35, 0], [0.42, -7], [0.52, -20], [0.6, -60]]);
  const f = (t) => 24 + 10 * clamp01(t / 0.35);
  const sub = mul(sum([sine(n, f), 1], [sine(n, f, { h: 2 }), 0.18]), env);
  const mid = pair((s) => mul(svf(svf(noise(n, s), 'hp', 125), 'lp', 500), env), 301, 0.9);
  return { L: sum([sub, 1], [mid.L, 0.33]), R: sum([sub, 1], [mid.R, 0.33]) };
}

/** K1 swoop, 85 ms: a sine gliding 530 -> 210 Hz over 50 ms, 25 ms attack, 55 ms decay, slightly wide [A18]. */
function swoop() {
  const n = ns(0.085);
  const f = (t) => 210 * Math.pow(530 / 210, 1 - clamp01(t / 0.05));
  const env = envDb(n, [[0, -40], [0.025, 0], [0.05, -6], [0.085, -45]]);
  const tone = mul(sum([sine(n, f), 1], [sine(n, f, { h: 2 }), 0.18]), env);
  const air = mul(svf(noise(n, 311), 'bp', 900, 1.2), env);
  const mid = sum([tone, 1], [air, 0.05]);
  return stereo(mid, mul(svf(noise(n, 312), 'bp', 700, 1), env), 0.06);
}

/** K1 cut thump, 0.564 s: a mono low thump (45-190 Hz, centroid ~105 Hz) starting on the cut [A19]. */
function thump() {
  const n = ns(0.564);
  const f = (t) => 48 + 52 * Math.exp(-t / 0.07);
  const env = envDb(n, [[0, -30], [0.012, -6], [0.06, 0], [0.18, -3], [0.4, -16], [0.564, -60]]);
  const body = mul(sum([sine(n, f), 1], [sine(n, f, { h: 2 }), 0.25]), env);
  const knock = mul(svf(svf(noise(n, 321), 'lp', 190), 'hp', 45), envDb(n, [[0, -20], [0.008, 0], [0.05, -18], [0.12, -60]]));
  return mono(sum([body, 1], [knock, 0.6]));
}

/**
 * The swell that stops dead, 0.54 s: a low swell (most energy 31-63 Hz) rising for 0.48 s and stopping in about
 * 60 ms at 0.48 s, often on a cut; shared by every kit, 1-4 per video [A20; verified].
 */
function riser() {
  const n = ns(0.54), stop = 0.48;
  const env = envDb(n, [[0, -44], [0.2, -22], [0.4, -6], [stop, 0], [stop + 0.02, -10], [stop + 0.06, -70], [0.54, -90]]);
  const f = (t) => 34 + 22 * clamp01(t / stop);
  const p0 = -(phaseAt(f, ns(stop + 0.06)) % TAU);
  const body = mul(sum([sine(n, f, { phase: p0 }), 1], [sine(n, f, { phase: p0, h: 2 }), 0.3], [sine(n, f, { phase: p0, h: 3 }), 0.1]), env);
  const air = pair((s) => mul(svf(svf(noise(n, s), 'hp', 60), 'lp', 400), env), 331, 0.75);
  return { L: sum([body, 1], [air.L, 0.12]), R: sum([body, 1], [air.R, 0.12]) };
}

/** K2 impact pair, 2.1 s: a sub swell gliding 39 -> 55 -> 37 Hz (attack 0.78 s, decay 1.14 s) with a stereo sub drop 55 -> 33 Hz over 1.4 s [A21]. */
function subdrop() {
  const n = ns(2.1);
  const fs1 = (t) => (t < 0.8 ? 39 + 16 * clamp01(t / 0.8) : 55 - 18 * clamp01((t - 0.8) / 1.2));
  const swl = mul(sum([sine(n, fs1), 1], [sine(n, fs1, { h: 2 }), 0.2]), envDb(n, [[0, -40], [0.78, 0], [1.3, -8], [1.92, -30], [2.1, -70]]));
  const fd = (t) => 55 * Math.pow(33 / 55, clamp01(t / 1.4));
  const dropEnv = envDb(n, [[0, -50], [0.075, -2], [0.5, -7], [1.4, -26], [1.6, -60]]);
  const dl = mul(sine(n, fd), dropEnv), dr = mul(sine(n, fd, { phase: 1.1 }), dropEnv);
  return { L: sum([swl, 0.7], [dl, 0.6]), R: sum([swl, 0.7], [dr, 0.6]) };
}

/** K2 tone, 0.82 s: a sine at 659 Hz (E5), 68 ms attack, exponential decay over 0.7 s [A22]. */
function tone() {
  const n = ns(0.82);
  const env = envDb(n, [[0, -50], [0.068, 0], [0.82, -42]]);
  return mono(mul(sum([sine(n, 659.3), 1], [sine(n, 1318.5), 0.08]), env));
}

/** K2 mid whoosh, 0.676 s: noise 129-743 Hz (centroid ~510 Hz), attack 0.282 s, decay 0.329 s [A22]. */
function midwhoosh() {
  const n = ns(0.676);
  const env = envDb(n, [[0, -46], [0.15, -20], [0.282, 0], [0.42, -10], [0.611, -36], [0.676, -70]]);
  const fc = (t) => 340 + 280 * clamp01(t / 0.282);
  return pair((s) => mul(svf(svf(svf(noise(n, s), 'bp', fc, 0.9), 'hp', 129), 'lp', 743), env), 341, 0.85);
}

/** K3 low whoosh, 0.364 s: noise 108-215 Hz (centroid ~141 Hz), rise 0.239 s, fall 0.115 s [A23]. */
function lowwhoosh() {
  const n = ns(0.364);
  const env = envDb(n, [[0, -44], [0.12, -18], [0.239, 0], [0.3, -10], [0.364, -48]]);
  return pair((s) => mul(svf(svf(noise(n, s), 'hp', 108), 'lp', 215), env), 351, 0.9);
}

const EFFECTS = { swell, swoop, thump, riser, subdrop, tone, midwhoosh, lowwhoosh };
const FADES = { swoop: { fadeIn: 0.0005, fadeOut: 0.004 }, riser: { fadeIn: 0.002, fadeOut: 0.004 } };

// ------------------------------------------------------------------------------------------- beds
// Bed A: 7.385 s loops of 8 beats (65 BPM, beat 0.923 s), mono, energy 40-250 Hz on sustained bass notes in the
// D1-Eb2 register; nothing above ~300 Hz [A07]. The progression is original: two beats each on D, Bb, Eb, A.
const LOOP = 7.3854, BEAT = LOOP / 8;

/** One sustained bass note with its octave, a soft attack, and a gentle swell on every beat (the 0.92 s pulse). */
function bassNote(N, t0, t1, hz, gain) {
  const a = ns(t0), b = Math.min(N, ns(t1 + 0.15));
  const y = new Float64Array(N);
  let p = 0;
  for (let i = a; i < b; i++) {
    const t = i / SR - t0, len = t1 - t0;
    const att = clamp01(t / 0.24), rel = clamp01((len + 0.15 - t) / 0.3);
    const beat = 0.82 + 0.18 * Math.exp(-((t % BEAT) / 0.25));
    const s = Math.sin(p) + 0.22 * Math.sin(2 * p) + 0.04 * Math.sin(3 * p);
    y[i] = s * gain * att * rel * beat;
    p += (TAU * hz) / SR;
  }
  return y;
}

function bedLoops(N, chords, loops) {
  const y = new Float64Array(N);
  const len = chords.reduce((s, c) => s + c[1], 0) * BEAT;
  for (let l = 0; l < loops; l++) {
    chords.forEach(([hz, beats], k) => {
      const t0 = l * len + chords.slice(0, k).reduce((s, c) => s + c[1], 0) * BEAT;
      addInto(y, bassNote(N, t0, t0 + beats * BEAT, hz, 1), 0, 1);
    });
  }
  return y;
}

function finishBedMono(y, { fadeOut }) {
  const z = butter4(svf(y, 'hp', 30), 'lp', 140);   // most energy 30-110 Hz [A07; verified]
  const n = z.length, f = ns(fadeOut);
  for (let i = 0; i < f; i++) z[n - 1 - i] *= 0.5 - 0.5 * Math.cos((Math.PI * i) / f);
  let m = 0;
  for (let i = 0; i < n; i++) m += z[i] * z[i];
  const g = dbg(-20) / Math.sqrt(m / n);
  let pk = 0;
  for (let i = 0; i < n; i++) { z[i] *= g; pk = Math.max(pk, Math.abs(z[i])); }
  if (20 * Math.log10(pk) > -3) throw new Error('bed sample peak over -3 dBFS');
  return { L: z, R: Float64Array.from(z) };
}

/** Bed A: one block of six loops (44.31 s) and a 1.24 s fall at its end [A08, A09]. */
function bedA() {
  const N = ns(6 * LOOP + 1.3);
  const notes = [[36.71, 2], [58.27, 2], [38.89, 2], [55.0, 2]];   // D1, Bb1, Eb1, A1
  return finishBedMono(bedLoops(N, notes, 6), { fadeOut: 1.24 });
}

/** Bed A2: the late loop, 14.77 s (two bed-A loops on the same grid), two passes, running to the last frame [A10]. */
function bedA2() {
  const N = ns(4 * LOOP);
  const notes = [[36.71, 2], [58.27, 2], [38.89, 2], [55.0, 2], [41.2, 2], [58.27, 2], [77.78, 2], [73.42, 2]];   // ... E1, Bb1, Eb2, D2
  return finishBedMono(bedLoops(N, notes, 2), { fadeOut: 0.02 });
}

const BEDS = { 'bed-a': bedA, 'bed-a2': bedA2 };

function encodeAac(L, R, out) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'motus-audio-'));
  const wav = path.join(tmpDir, path.basename(out, '.m4a') + '.wav');
  writeWav(wav, L, R);
  const res = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', wav, '-c:a', 'aac', '-b:a', '128k', '-ar', String(SR), '-ac', '2',
    '-map_metadata', '-1', '-fflags', '+bitexact', '-flags:a', '+bitexact', '-movflags', '+faststart', out], { encoding: 'utf8' });
  fs.rmSync(tmpDir, { recursive: true, force: true });
  if (res.status !== 0) throw new Error(`ffmpeg failed for ${out}: ${res.stderr || res.error}`);
}

// -------------------------------------------------------------------------------------------- main
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const only = opt('--only')?.split(',').map((s) => s.trim()).filter(Boolean);
const want = (k) => !only || only.includes(k);
for (const k of only || []) if (!EFFECTS[k] && !BEDS[k]) throw new Error(`unknown name "${k}"; use ${[...Object.keys(EFFECTS), ...Object.keys(BEDS)].join(', ')}`);

fs.mkdirSync(SFX_DIR, { recursive: true });
fs.mkdirSync(MUSIC_DIR, { recursive: true });
for (const [name, make] of Object.entries(EFFECTS)) {
  if (!want(name)) continue;
  const s = make();
  const { tp, limited } = finishSfx(s, FADES[name]);
  const file = path.join(SFX_DIR, `${name}.wav`);
  writeWav(file, s.L, s.R);
  console.log(`${name.padEnd(10)} ${(s.L.length / SR).toFixed(3)} s  true peak ${tp.toFixed(1)} dBTP${limited ? ` (limited x${limited})` : ''}  -> ${path.relative(process.cwd(), file)}`);
}
for (const [name, make] of Object.entries(BEDS)) {
  if (!want(name)) continue;
  const B = make();
  const file = path.join(MUSIC_DIR, `${name}.m4a`);
  encodeAac(B.L, B.R, file);
  console.log(`${name.padEnd(10)} ${(B.L.length / SR).toFixed(3)} s  -> ${path.relative(process.cwd(), file)}`);
}
