#!/usr/bin/env node
/**
 * make-audio.mjs: the Editorial Proof sound, synthesised from code.
 *
 * Writes the eleven effects named in style.head.json "sfx" to assets/sfx/<name>.wav (48 kHz, stereo, 16-bit)
 * and the two beds named in "beds" to assets/music/bed-a.m4a and bed-b.m4a (AAC 160k, 100 s seamless loops).
 * Everything is original synthesis (seeded noise, oscillators, filters). The targets (durations, envelopes,
 * centroids, widths, bed spectrum and tempo) are the measured style in research/audio.md (A01-A28);
 * no reference audio is read, sampled or copied.
 *
 * Contract, every effect: no DC, short end fades, true peak under -1 dBTP, loudest 50 ms window at -20 dBFS RMS,
 * so tokens.sound gainDb alone places it under the voice. The cut file's tick lands exactly at 0.550 s (the
 * engine starts it 0.55 s before the cut). Beds: mid (L+R)/2 RMS -20 dBFS, low-passed at 3.5 kHz, energy
 * mostly 60-500 Hz, wide stereo, static, loop sample-exactly (the engine loops them to length).
 *
 *   node styles/editorial-proof/dev/make-audio.mjs                    # everything
 *   node styles/editorial-proof/dev/make-audio.mjs --only cut,pop     # some of it (names: the sfx, bed-a, bed-b)
 *   node styles/editorial-proof/dev/make-audio.mjs --wav-dir <dir>    # also keep the bed masters as WAV there
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

/** Opening / interstitial riser, 0.85 s: a low swell peaking at 0.25 s, then a bright band sweeping up to a peak at 0.69 s. */
function riser() {
  const n = ns(0.9);
  // low swell: 52 -> 44 Hz with locked 2nd/3rd harmonics, plus a dark noise body
  const fb = (t) => 52 - 8 * clamp01(t / 0.45);
  const eb = envDb(n, [[0, -40], [0.1, -10], [0.22, -0.5], [0.27, 0], [0.33, -3], [0.45, -24], [0.55, -95]]);
  const boom = mul(sum([sine(n, fb), 1], [sine(n, fb, { h: 2 }), 0.3], [sine(n, fb, { h: 3 }), 0.12]), eb);
  const bodyEnv = envDb(n, [[0, -30], [0.12, -6], [0.22, 0], [0.3, -2], [0.42, -20], [0.52, -95]]);
  const body = (seed) => mul(sum([svf(svf(noise(n, seed), 'lp', 900, 0.7), 'hp', 90), 1], [svf(noise(n, seed + 50), 'hp', 5000), 0.1]), bodyEnv);
  const bm = body(101), bs = body(102);
  // bright sweep: band centre 1.2 kHz -> 9 kHz by the peak at 0.69 s, falling back to 3 kHz in the release
  const fc = (t) => (t < 0.69 ? 1200 * Math.pow(9000 / 1200, clamp01((t - 0.25) / 0.44)) : 9000 * Math.pow(3000 / 9000, clamp01((t - 0.69) / 0.12)));
  const es = envDb(n, [[0.22, -95], [0.3, -36], [0.45, -18], [0.6, -6], [0.69, 0], [0.73, -7], [0.8, -28], [0.86, -95]]);
  const sw = (seed) => mul(svf(svf(noise(n, seed), 'bp', fc, 1.1), 'hp', 500), es);
  const sm = sw(103), ss = sw(104);
  const fg = (t) => 700 * Math.pow(2, clamp01((t - 0.3) / 0.39));
  const glide = mul(sum([sine(n, fg), 1], [sine(n, fg, { h: 2 }), 0.5], [sine(n, fg, { h: 3 }), 0.3]), es);
  // air from the first frame: a hump with the swell, a dip, then up into the sweep's peak
  const eh = envDb(n, [[0, -19], [0.05, -16], [0.15, -12], [0.25, -11], [0.32, -13], [0.42, -19], [0.5, -15], [0.58, -8], [0.66, -2], [0.7, -6], [0.75, -30], [0.8, -95]]);
  const air = (seed) => mul(svf(noise(n, seed), 'hp', 6000), eh);
  const mid = sum([boom, 0.22], [bm, 0.2], [sm, 0.16], [glide, 0.14], [air(105), 0.05]);
  const side = sum([bs, 0.11], [ss, 0.09], [air(106), 0.05]);
  return stereo(mid, side);
}

/** Cut, 0.6 s: a sub riser building for 0.55 s and stopping on the cut, with a short tick peaking at exactly 0.550 s. */
function cut() {
  const n = ns(0.6), tc = 0.55, kc = ns(tc);
  // sub: 38 -> 46 Hz, rising 22 dB from 0.05 s, peaking about 58 ms before the cut, 12 dB down 7 ms after it
  const fs_ = (t) => 38 + 8 * clamp01(t / tc);
  const p0 = -(phaseAt(fs_, kc) % TAU); // a zero crossing exactly on the cut, so the stop does not click
  const esub = envDb(n, [[0, -95], [0.02, -26], [0.05, -22], [0.2, -14], [0.35, -7], [0.49, 0], [0.55, -0.8], [0.557, -14], [0.566, -40], [0.58, -95]]);
  const sub = mul(sum([sine(n, fs_, { phase: p0 }), 1], [sine(n, fs_, { phase: p0, h: 2 }), 0.14]), esub);
  // the build: a noise band rising into the cut over the last 120 ms, gone within a few ms after it
  const fcb = (t) => 1500 * Math.pow(4, clamp01((t - 0.43) / 0.12));
  const eb = envDb(n, [[0.4, -95], [0.43, -36], [0.5, -16], [0.535, -6], [0.55, 0], [0.552, -8], [0.558, -40], [0.565, -95]]);
  const bm = mul(svf(noise(n, 201), 'bp', fcb, 0.8), eb);
  const bs = mul(svf(noise(n, 202), 'bp', fcb, 0.8), eb);
  // the tick: bright noise from 46 ms before the cut, peak on the cut, 6 ms decay; plus a struck transient on the cut
  const et = envDb(n, [[0.502, -95], [0.506, -30], [0.53, -14], [0.546, -3], [0.55, 0], [0.553, -10], [0.56, -42], [0.57, -95]]);
  const tm = mul(svf(noise(n, 203), 'hp', 3000), et);
  const ts = mul(svf(noise(n, 204), 'hp', 3000), et);
  const strike = new Float64Array(n);
  for (let i = kc; i < n; i++) {
    const t = (i - kc) / SR;
    strike[i] = (Math.sin(TAU * 3100 * t) * 0.6 + Math.sin(TAU * 6900 * t) * 0.4) * Math.exp(-t / 0.0035);
  }
  const mid = sum([sub, 0.5], [bm, 0.2], [tm, 0.24], [strike, 0.28]);
  const side = sum([bs, 0.12], [ts, 0.16]);
  return stereo(mid, side);
}

/** Soft swish, 0.36 s: low-mid noise (centroid 900 -> 560 Hz), peak at 0.165 s, very wide. Card settling in. */
function softswish() {
  const n = ns(0.46);
  const fc = (t) => 720 * Math.pow(470 / 720, clamp01(t / 0.4));
  const e = envDb(n, [[0, -36], [0.05, -12], [0.1, -4], [0.165, 0], [0.21, -0.8], [0.26, -2.8], [0.31, -6], [0.36, -11], [0.4, -20], [0.45, -45]]);
  const band = (seed) => mul(svf(svf(svf(noise(n, seed), 'bp', fc, 1.1), 'lp', 1300), 'hp', 260), e);
  return stereo(band(301), band(302), 0.85);
}

/** Swish, 0.30 s: airy noise above 1.5 kHz rising slowly to a peak at 0.265 s, 35 ms release. Highlight sweeps. */
function swish() {
  const n = ns(0.34);
  const fc = (t) => 3500 * Math.pow(9000 / 3500, clamp01(t / 0.265));
  const e = envDb(n, [[0, -30], [0.02, -10], [0.08, -6], [0.18, -3], [0.265, 0], [0.285, -6], [0.3, -20], [0.315, -40], [0.33, -95]]);
  const air = (seed) => {
    const x = butter4(noise(n, seed), 'hp', 1500);
    return mul(sum([x, 0.3], [svf(x, 'bp', fc, 1.6), 1.2]), e);
  };
  return stereo(air(401), air(402), 0.56);
}

/** Whoosh, 0.62 s: noise under a low-pass falling 6 kHz -> 450 Hz (falling centroid), peak at 0.2 s, sub boom 0.1-0.4 s. Card slides. */
function whoosh() {
  const n = ns(0.7);
  const fc = (t) => 4200 * Math.pow(250 / 4200, clamp01(t / 0.6));
  const e = envDb(n, [[0, -36], [0.06, -14], [0.14, -4], [0.2, 0], [0.26, -1], [0.34, -5], [0.44, -11], [0.54, -17], [0.62, -26], [0.68, -60]]);
  const air = (seed) => mul(svf(svf(svf(noise(n, seed), 'lp', fc, 0.9), 'lp', (t) => fc(t) * 1.6), 'hp', 150), e);
  const fb = (t) => 58 - 16 * clamp01((t - 0.1) / 0.4);
  const eb = envDb(n, [[0.08, -95], [0.12, -20], [0.2, -4], [0.25, 0], [0.33, -3], [0.42, -16], [0.52, -95]]);
  const boom = mul(sum([sine(n, fb), 1], [sine(n, fb, { h: 2 }), 0.25]), eb);
  const eh = envDb(n, [[0, -40], [0.08, -12], [0.19, 0], [0.3, -8], [0.42, -14], [0.52, -19], [0.6, -26], [0.68, -95]]);
  const hf = (seed) => mul(svf(noise(n, seed), 'hp', 4500), eh);
  return stereo(sum([air(501), 0.5], [boom, 0.32], [hf(503), 0.035]), sum([air(502), 0.5], [hf(504), 0.035]));
}

/** Swell, 0.33 s: bright mono noise whose band rises 1 -> 7 kHz to a peak at 0.22 s, with a faint tonal sheen. Number landing. */
function swell() {
  const n = ns(0.4);
  const fc = (t) => (t < 0.2 ? 1500 * Math.pow(7000 / 1500, clamp01(t / 0.2)) : 7000 - 2000 * clamp01((t - 0.2) / 0.13));
  const e = envDb(n, [[0, -34], [0.03, -22], [0.12, -9], [0.18, -2.5], [0.22, 0], [0.25, -2.5], [0.29, -8], [0.33, -14], [0.36, -22], [0.385, -40], [0.4, -95]]);
  const x = mul(svf(svf(noise(n, 601), 'bp', fc, 0.9), 'hp', 600), e);
  const sheen = mul(sum([sine(n, 3300), 1], [sine(n, 4950), 0.7]), e);
  return mono(sum([x, 1], [sheen, 0.08]));
}

/** Counter, 0.8 s: a tonal shimmer of short blips (16 a second, pitch rolling upward) over sustained partials 2-10 kHz. Rolling digits. */
function counter() {
  const n = ns(0.86);
  const mid = new Float64Array(n), side = new Float64Array(n);
  const r = rng(701);
  let t = 0.004, k = 0;
  const blips = [];
  while (t < 0.74) { blips.push(t); t += 0.0625 * (0.85 + 0.3 * r()); k++; }
  blips.push(0.775); // the last digit lands
  blips.forEach((tb, i) => {
    const last = i === blips.length - 1;
    const f = 2200 * Math.pow(3400 / 2200, tb / 0.775) * (i % 2 ? 1.03 : 1);
    const a = (last ? 1.25 : 0.7 + 0.2 * r()) * Math.min(1, 0.35 + tb / 0.25);
    const len = ns(last ? 0.08 : 0.05), at = ns(tb);
    const tone = new Float64Array(len);
    for (let j = 0; j < len; j++) {
      const u = j / SR, env = Math.min(1, u / 0.002) * Math.exp(-u / (last ? 0.022 : 0.014));
      tone[j] = (Math.sin(TAU * f * u) + 0.5 * Math.sin(TAU * f * 1.5 * u) + 0.25 * Math.sin(TAU * f * 2.76 * u)) * env * a;
    }
    addInto(mid, tone, at, 1);
    addInto(side, tone, at, i % 2 ? 0.5 : -0.5);
  });
  const sw = envDb(n, [[0, -30], [0.15, -8], [0.4, 0], [0.7, -2], [0.8, -10], [0.85, -95]]);
  const trem = (t2) => 0.65 + 0.35 * Math.cos(TAU * 16 * t2);
  const shimmer = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const u = i / SR;
    shimmer[i] = (Math.sin(TAU * 2400 * u) + 0.6 * Math.sin(TAU * 4800 * u + 1) + 0.4 * Math.sin(TAU * 7200 * u + 2) + 0.25 * Math.sin(TAU * 9600 * u + 3)) * sw[i] * trem(u);
  }
  const sparkle = mul(svf(svf(noise(n, 702), 'hp', 2500), 'lp', 10000), sum([sw, 0.25], [mid.map(Math.abs), 1.4]));
  return stereo(sum([mid, 1], [shimmer, 0.12], [sparkle, 0.25]), side);
}

/** One struck mode set: [freq, amplitude, decay seconds] partials plus a 1.5 ms noise exciter. */
function strike(n, at, modes, seed, exciter = 0.3, exLen = 0.0015) {
  const y = new Float64Array(n);
  const r = rng(seed);
  for (const [f, a, tau] of modes) {
    const ph = r() * TAU;
    for (let i = ns(at); i < n; i++) {
      const u = (i - ns(at)) / SR;
      if (u > tau * 9) break;
      y[i] += a * Math.sin(TAU * f * u + ph) * Math.exp(-u / tau) * Math.min(1, u / 0.0006);
    }
  }
  const ex = svf(noise(ns(exLen), seed + 1), 'hp', 2000);
  for (let j = 0; j < ex.length; j++) ex[j] *= exciter * Math.sin((Math.PI * j) / ex.length);
  addInto(y, ex, ns(at));
  return y;
}

/** Click, 0.17 s: a tonal double click (press, then a brighter release 46 ms later), mono. Chips and outlines. */
function click() {
  const n = ns(0.18);
  const press = strike(n, 0, [[1400, 0.6, 0.018], [3900, 0.3, 0.014]], 801);
  const release = strike(n, 0.046, [[1750, 0.8, 0.03], [4600, 0.4, 0.034], [8200, 0.15, 0.012]], 803);
  return mono(sum([press, 0.6], [release, 1]));
}

/** Hit, 0.33 s: noise whose band falls 10 kHz -> 1.2 kHz, peak 50 ms in, with a short falling body. CTA verb. */
function hit() {
  const n = ns(0.37);
  const fc = (t) => 10000 * Math.pow(800 / 10000, clamp01(t / 0.31));
  const e = envDb(n, [[0, -30], [0.012, -8], [0.03, -2], [0.05, 0], [0.09, -3], [0.15, -6], [0.22, -10], [0.29, -14], [0.33, -19], [0.36, -28], [0.37, -95]]);
  const band = (seed) => mul(svf(svf(noise(n, seed), 'bp', fc, 1), 'hp', 300), e);
  const body = mul(sine(n, (t) => 240 * Math.pow(0.5, clamp01(t / 0.15))), envDb(n, [[0, -40], [0.008, 0], [0.06, -8], [0.14, -24], [0.2, -95]]));
  const air = mul(svf(noise(n, 903), 'bp', (t) => 12000 * Math.pow(4500 / 12000, clamp01(t / 0.33)), 0.8), envDb(n, [[0, -30], [0.012, -8], [0.05, -3], [0.15, -5], [0.25, -9], [0.33, -15], [0.36, -26], [0.37, -95]]));
  return stereo(sum([band(901), 1], [body, 0.3], [air, 0.34]), band(902), 0.32);
}

/** Pop, 0.07 s: a bright 1 ms-scale burst over a quick downward pitch drop, mono. CTA keyword, the loudest accent. */
function pop() {
  const n = ns(0.09);
  const burst = mul(svf(noise(n, 1001), 'hp', 3000), envDb(n, [[0, -20], [0.0004, 0], [0.005, -7], [0.02, -17], [0.045, -32], [0.06, -95]]));
  const fdrop = (t) => 820 * Math.pow(260 / 820, clamp01(t / 0.035));
  const body = mul(sine(n, fdrop), envDb(n, [[0, -30], [0.0015, 0], [0.02, -6], [0.045, -20], [0.07, -50], [0.08, -95]]));
  const thump = mul(sine(n, 180), envDb(n, [[0, -30], [0.002, 0], [0.03, -10], [0.07, -30], [0.085, -95]]));
  return mono(sum([burst, 0.5], [body, 0.5], [thump, 0.2]));
}

/** Long, 1.6 s: an irregular train of soft key ticks (8-14 a second), swelling to a peak near 0.8 s. Typing in a card. */
function long() {
  const n = ns(1.64);
  const L = new Float64Array(n), R = new Float64Array(n);
  const r = rng(1101);
  const shape = envDb(n, [[0, -8], [0.35, -3], [0.8, 0], [1.2, -3], [1.5, -9], [1.62, -30]]);
  let t = 0.01, k = 0;
  while (t < 1.5) {
    const f = 1600 + 1000 * r();
    const tick = strike(n, t, [[f, 0.35, 0.006 + 0.005 * r()], [f * 2.37, 0.15, 0.004], [f * 4.1, 0.07, 0.003], [260 + 80 * r(), 0.2, 0.01]], 1200 + k, 0.7, 0.01);
    const g = dbg(-3 + 6 * r()) * shape[ns(t)];
    const pan = (r() - 0.5) * 0.7, th = ((pan + 1) * Math.PI) / 4;
    for (let i = 0; i < n; i++) { L[i] += tick[i] * g * Math.cos(th); R[i] += tick[i] * g * Math.sin(th); }
    const roll = r();
    t += roll < 0.12 ? 0.035 : roll > 0.93 ? 0.19 : 0.055 + 0.075 * r(); // the odd double tap and the odd pause
    k++;
  }
  // a faint flutter under the keys (the scroll half of the class), following the overall shape
  const fl = (seed) => mul(svf(svf(noise(n, seed), 'bp', 2200, 0.7), 'lp', 6000), shape);
  const a = fl(1190), b = fl(1191);
  for (let i = 0; i < n; i++) { L[i] += 0.012 * a[i]; R[i] += 0.012 * b[i]; }
  return { L: svf(L, 'lp', 7000), R: svf(R, 'lp', 7000) };
}

const EFFECTS = { riser, cut, softswish, swish, whoosh, swell, counter, click, hit, pop, long };
const FADES = { pop: { fadeIn: 0.0002, fadeOut: 0.008 }, click: { fadeIn: 0.0002, fadeOut: 0.01 }, cut: { fadeIn: 0.002, fadeOut: 0.02 } };

// -------------------------------------------------------------------------------------------- beds
const TABLE = 2048;
const SIN = Float64Array.from({ length: TABLE }, (_, i) => Math.sin((TAU * i) / TABLE));

/** One cycle of a warm, band-limited wave: partial k at k^-tilt, rolled off above `corner`, nothing above `top`. */
function waveTable(f0, { tilt = 1.2, corner = 900, top = 3300, seed = 1 } = {}) {
  const r = rng(seed);
  const t = new Float64Array(TABLE + 1);
  for (let k = 1; k * f0 < top; k++) {
    const a = Math.pow(k, -tilt) / (1 + Math.pow((k * f0) / corner, 2));
    const off = Math.floor(r() * TABLE);
    for (let i = 0; i < TABLE; i++) t[i] += a * SIN[(k * i + off) % TABLE];
  }
  let s = 0;
  for (let i = 0; i < TABLE; i++) s += t[i] * t[i];
  const g = 1 / Math.sqrt(s / TABLE);
  for (let i = 0; i < TABLE; i++) t[i] *= g;
  t[TABLE] = t[0];
  return t;
}

/**
 * A sustained note into a circular stereo buffer (whatever runs past the end wraps to the start, so the bed loops
 * seamlessly): `voices` detuned table oscillators spread across the field, raised-cosine attack and release,
 * a slow amplitude drift whose period divides the loop. Low notes use detune 0 / jitter 0: their voices then differ
 * by a fixed 45 degrees of phase only, which gives width without beating or mono cancellation.
 */
function padNote(B, { t0, t1, att = 1.2, rel = 1.8, midi, gain = 1, spread = 0.8, detune = 4, jitter = 1, voices = 3, tilt, corner, seed, drift = 0.12, driftPeriod }) {
  const N = B.L.length;
  const f = midiHz(midi);
  const tab = waveTable(f, { tilt, corner, seed });
  const r = rng(seed * 7919 + 17);
  const s0 = ns(t0), s1 = ns(t1), sa = ns(att), sr = ns(rel), sEnd = s1 + sr;
  const P = ns(driftPeriod);
  const base = r() * TABLE, locked = detune === 0 && jitter === 0;
  for (let v = 0; v < voices; v++) {
    const pos = voices === 1 ? 0 : (v / (voices - 1)) * 2 - 1;
    const cents = pos * detune + (r() - 0.5) * 2 * jitter;
    const th = ((pos * spread + 1) * Math.PI) / 4;
    const gl = (Math.cos(th) * gain) / Math.sqrt(voices), gr = (Math.sin(th) * gain) / Math.sqrt(voices);
    const inc = (f * Math.pow(2, cents / 1200) * TABLE) / SR;
    // unison voices sit 45 degrees apart: width without the cancellation free phases would cause in mono
    let ph = locked ? (base + (v * TABLE) / 8) % TABLE : r() * TABLE;
    const dph = r() * TAU;
    let amp = 0;
    for (let i = s0; i < sEnd; i++) {
      if (((i - s0) & 31) === 0) {
        const k = i - s0;
        const e = k < sa ? 0.5 - 0.5 * Math.cos((Math.PI * k) / sa) : i < s1 ? 1 : 0.5 + 0.5 * Math.cos((Math.PI * (i - s1)) / sr);
        amp = e * (1 + drift * Math.sin((TAU * (((i % P) + P) % P)) / P + dph));
      }
      const k = ph | 0;
      const x = tab[k] + (tab[k + 1] - tab[k]) * (ph - k);
      ph += inc;
      if (ph >= TABLE) ph -= TABLE;
      const j = ((i % N) + N) % N;
      B.L[j] += x * amp * gl;
      B.R[j] += x * amp * gr;
    }
  }
}

/** A plucked or struck tone (partials with their own decays) into the circular buffer. */
function pluckNote(B, { t, midi, gain = 1, pan = 0, att = 0.008, partials, len }) {
  const N = B.L.length;
  const f = midiHz(midi);
  const th = ((pan + 1) * Math.PI) / 4, gl = Math.cos(th) * gain, gr = Math.sin(th) * gain;
  const s0 = ns(t), n = ns(len);
  for (let i = 0; i < n; i++) {
    const u = i / SR;
    let x = 0;
    for (const [h, a, tau] of partials) x += a * Math.sin(TAU * f * h * u) * Math.exp(-u / tau);
    x *= (u < att ? 0.5 - 0.5 * Math.cos((Math.PI * u) / att) : 1) * (i > n - 480 ? (n - i) / 480 : 1);
    const j = (s0 + i) % N;
    B.L[j] += x * gl;
    B.R[j] += x * gr;
  }
}

/** Run a causal filter chain as if the buffer looped forever (pre-rolled with its own end), so the loop stays seamless. */
function circular(x, chain) {
  const N = x.length, pre = Math.min(N, ns(4));
  const y = new Float64Array(N + pre);
  y.set(x.subarray(N - pre), 0);
  y.set(x, pre);
  return chain(y).slice(pre);
}

/** Shared bed finishing: 40 Hz high-pass, 3.5 kHz 4th-order low-pass, mid RMS -20 dBFS, peak check. */
function finishBed(B) {
  const chain = (y) => butter4(svf(y, 'hp', 40), 'lp', 3500);
  B.L = circular(B.L, chain);
  B.R = circular(B.R, chain);
  let m = 0;
  for (let i = 0; i < B.L.length; i++) { const v = (B.L[i] + B.R[i]) / 2; m += v * v; }
  const g = dbg(-20) / Math.sqrt(m / B.L.length);
  let pk = 0;
  for (let i = 0; i < B.L.length; i++) { B.L[i] *= g; B.R[i] *= g; pk = Math.max(pk, Math.abs(B.L[i]), Math.abs(B.R[i])); }
  if (20 * Math.log10(pk) > -3) throw new Error('bed sample peak over -3 dBFS');
  return B;
}

/** Wide, slowly breathing noise band (the air on top of a pad), circular. */
function airLayer(N, { lo, hi, seed, gain, period, corr = 0 }) {
  const band = (s) => circular(noise(N, s), (y) => svf(svf(y, 'hp', lo), 'lp', hi));
  const a = band(seed), b0 = band(seed + 1), c = Math.sqrt(1 - corr * corr);
  const b = a.map((v, i) => corr * v + c * b0[i]);
  const P = ns(period);
  const out = { L: new Float64Array(N), R: new Float64Array(N) };
  for (let i = 0; i < N; i++) {
    const w = gain * (0.75 + 0.25 * Math.sin((TAU * (i % P)) / P));
    out.L[i] = a[i] * w;
    out.R[i] = b[i] * w;
  }
  return out;
}

/** Notes per bar -> sustained note events, tying a pitch held across consecutive bars. */
function tie(bars) {
  const open = new Map(), events = [];
  bars.forEach(({ t, dur, notes }, bi) => {
    for (const [m, ev] of open) if (!notes.includes(m)) { events.push(ev); open.delete(m); }
    notes.forEach((m, vi) => {
      if (open.has(m) && Math.abs(open.get(m).t1 - t) < 1e-6) { open.get(m).t1 = t + dur; return; }
      if (open.has(m)) events.push(open.get(m));
      open.set(m, { midi: m, t0: t, t1: t + dur, role: vi === 0 ? 'bass' : vi === notes.length - 1 ? 'top' : 'mid', bi });
    });
  });
  for (const ev of open.values()) events.push(ev);
  return events;
}

/**
 * Bed A, "Warm pad": 96 BPM phrasing (2.5 s bars, 10 s phrases), pulseless. A sparse low drone until the full
 * chords enter at 3.4 s; nine full phrases; then the texture thins back to the drone, which wraps into the start.
 */
function bedA() {
  // 4688 AAC frames (100.01 s, 95.99 BPM): a whole number of codec frames, so the loop decodes sample-exact
  const N = 4688 * 1024, PH = N / SR / 10, BAR = PH / 4, OFF = 3.25;
  const B = { L: new Float64Array(N), R: new Float64Array(N) };
  const P1 = [[38, 45, 52, 54, 57, 64], [35, 42, 50, 54, 57, 61], [43, 50, 54, 57, 59, 66], [45, 52, 57, 59, 61, 64]]; // D(add9) Bm7 Gmaj9 A(add9)
  const P2 = [[38, 45, 52, 54, 57, 64], [42, 49, 52, 57, 61, 64], [43, 50, 54, 57, 59, 66], [45, 52, 57, 59, 61, 64]]; // D(add9) F#m7 Gmaj9 A(add9)
  const bars = [];
  for (let k = 0; k < 10; k++) {
    const P = k % 2 ? P2 : P1;
    const nb = k === 9 ? 2 : 4; // the last phrase keeps two bars, then breathes out into the drone
    for (let b = 0; b < nb; b++) bars.push({ t: OFF + k * PH + b * BAR, dur: BAR, notes: P[b] });
  }
  const look = { bass: { gain: 0.8, spread: 0.4, voices: 2, detune: 0, jitter: 0, drift: 0.03, tilt: 2.4, corner: 300 }, mid: { gain: 0.66, spread: 1, voices: 3, detune: 9, tilt: 1.05, corner: 1300 }, top: { gain: 0.34, spread: 0.5, voices: 3, detune: 9, tilt: 1.2, corner: 1600 } };
  tie(bars).forEach((ev, i) => {
    const last = ev.t1 > 96;
    padNote(B, { ...look[ev.role], midi: ev.midi, t0: ev.t0, t1: ev.t1, att: ev.t0 === OFF ? 0.6 : 1.3, rel: last ? 1.5 : 1.9, seed: 3000 + i, driftPeriod: 20 });
  });
  // the sparse texture: D and A low and narrow, a quiet fifth above, from the breath at the end through to 4.2 s
  for (const [m, g, spread] of [[38, 0.62, 0.3], [45, 0.48, 0.4], [57, 0.2, 0.7], [64, 0.12, 0.9]]) {
    padNote(B, { midi: m, t0: 97.4, t1: N / SR + OFF, att: 2.2, rel: 2.2, gain: g, spread, voices: 2, detune: m < 50 ? 0 : 3, jitter: m < 50 ? 0 : 1, tilt: 1.7, corner: 600, seed: 3900 + m, driftPeriod: 20 });
  }
  const air = airLayer(N, { lo: 900, hi: 3200, seed: 3990, gain: 0.03, period: N / SR / 10, corr: 0.8 });
  for (let i = 0; i < N; i++) { B.L[i] += air.L[i]; B.R[i] += air.R[i]; }
  return finishBed(B);
}

/**
 * Bed B, "Soft pulse": 115 BPM from 0.0 s (beat 25040 samples, 2.087 s bars, 8.35 s phrases). A round bass on
 * beats 1 and 3, a soft eighth-note pluck arpeggio and a low pad under it; 12 phrases, seamless.
 */
function bedB() {
  const BEAT = 25040 / SR, BAR = 4 * BEAT, PH = 4 * BAR, N = 12 * 4 * 4 * 25040;
  const B = { L: new Float64Array(N), R: new Float64Array(N) };
  const prog = [
    { bass: 38, pad: [53, 57, 60, 64], arp: [62, 65, 69, 72] }, // Dm9
    { bass: 43, pad: [53, 57, 58, 62], arp: [62, 65, 69, 70] }, // Gm9
    { bass: 41, pad: [55, 57, 60, 64], arp: [60, 65, 69, 72] }, // Fmaj9
    { bass: 36, pad: [52, 55, 57, 62], arp: [60, 64, 67, 74] }, // C6/9
  ];
  const patterns = [[0, 2, 1, 3, 0, 2, 1, 3], [0, 1, 2, 3, 2, 1, 0, 2]];
  const vel = [1, 0.55, 0.8, 0.55, 0.9, 0.55, 0.8, 0.6];
  const r = rng(4001);
  const padBars = [];
  for (let k = 0; k < 12; k++) {
    for (let b = 0; b < 4; b++) {
      const c = prog[b], t = k * PH + b * BAR;
      padBars.push({ t, dur: BAR, notes: c.pad });
      // bass: beat 1 long, beat 3 softer
      for (const [beat, g] of [[0, 1], [2, 0.6]]) {
        for (const [cents, pan] of [[-5, -0.5], [5, 0.5]]) {
          pluckNote(B, { t: t + beat * BEAT, midi: c.bass + cents / 100, gain: 0.42 * g, pan, att: 0.02, len: 2 * BEAT, partials: [[1, 1, 0.9], [2, 0.35, 0.5], [3, 0.12, 0.3]] });
        }
      }
      const pat = patterns[k % 2];
      for (let e = 0; e < 8; e++) {
        const m = c.arp[pat[e]];
        pluckNote(B, { t: t + (e * BEAT) / 2, midi: m, gain: 0.24 * vel[e] * (0.9 + 0.2 * r()), pan: e % 2 ? 0.45 : -0.45, att: 0.007, len: 0.9, partials: [[1, 1, 0.26], [2, 0.3, 0.14], [3, 0.2, 0.12], [4, 0.15, 0.08], [5, 0.1, 0.06], [6, 0.08, 0.05]] });
      }
    }
  }
  tie(padBars).forEach((ev, i) => padNote(B, { midi: ev.midi, t0: ev.t0, t1: ev.t1, att: 0.7, rel: 1.1, gain: 0.3, spread: 0.9, voices: 3, tilt: 1.2, corner: 1500, seed: 5000 + i, driftPeriod: (N / SR) / 5 }));
  return finishBed(B);
}

const BEDS = { 'bed-a': bedA, 'bed-b': bedB };

function encodeAac(L, R, out, wavDir) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'motus-audio-'));
  const wav = path.join(tmpDir, path.basename(out, '.m4a') + '.wav');
  writeWav(wav, L, R);
  const res = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', wav, '-c:a', 'aac', '-b:a', '160k', '-ar', String(SR), '-ac', '2',
    '-map_metadata', '-1', '-fflags', '+bitexact', '-flags:a', '+bitexact', '-movflags', '+faststart', out], { encoding: 'utf8' });
  if (wavDir) { fs.mkdirSync(wavDir, { recursive: true }); fs.copyFileSync(wav, path.join(wavDir, path.basename(wav))); }
  fs.rmSync(tmpDir, { recursive: true, force: true });
  if (res.status !== 0) throw new Error(`ffmpeg failed for ${out}: ${res.stderr || res.error}`);
}

// -------------------------------------------------------------------------------------------- main
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const only = opt('--only')?.split(',').map((s) => s.trim()).filter(Boolean);
const wavDir = opt('--wav-dir');
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
  encodeAac(B.L, B.R, file, wavDir);
  console.log(`${name.padEnd(10)} ${(B.L.length / SR).toFixed(3)} s  ${B.L.length} samples  -> ${path.relative(process.cwd(), file)}`);
}
