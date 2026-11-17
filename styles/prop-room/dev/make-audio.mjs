#!/usr/bin/env node
/**
 * make-audio.mjs: every Prop Room sound, synthesised from code.
 *
 *   node styles/prop-room/dev/make-audio.mjs            write the files and print what they measure
 *   node styles/prop-room/dev/make-audio.mjs --check    measure the files already written, write nothing
 *
 * Writes
 *   assets/music/bed-a.m4a   drum-led bed, 130 BPM, bass-heavy, the bass changes every 8 beats   [A15, A16]
 *   assets/music/bed-b.m4a   drum-led bed, 118 BPM, a long low kick on every beat, held keys       [A15, A16]
 *   assets/music/bed-c.m4a   pulse-free pad with an occasional low note (5 of 19 reference beds)   [A16]
 *   assets/sfx/swell-N.wav   noise swell, about 0.7 s, flat above 12 kHz                          [A18]
 *   assets/sfx/boom-N.wav    sub boom, 47 Hz falling toward 35 Hz, about 0.375 s                   [A19]
 *   assets/sfx/ping-N.wav    high ping, partials 12-18 kHz, about 0.26 s                           [A20]
 *   assets/sfx/reel-LL.wav, printer-LL.wav   action textures for props (spinning reels, a printing mechanism), LL =
 *                            the steady part in tenths of a second (10, 18, 32), so src/sound.js can pick the one
 *                            that lasts as long as the action [A22]
 *
 * Every sound is original synthesis (seeded noise, oscillators, filters). No reference audio is read, sampled or
 * copied; the script aims only at the numbers the audio study measured (research/audio.md A04-A25), and the
 * notes, chords and drum patterns are original choices in the measured register, not a transcription.
 *
 * Conventions (shared with the engine, engine/lib/render.mjs):
 *   beds  dual mono (L = R) [A04], 48 kHz AAC, the mid RMS normalised to -20 dBFS; they start on the downbeat at
 *         sample 0 with no fade-in and play to the end with no fade-out [A12]; each is longer than the 47 s the
 *         style is made for, so it never loops under a normal video.
 *   sfx   dual mono 16-bit WAV at 48 kHz; the loudest 50 ms window normalised to -20 dBFS RMS (one reference level
 *         for every file); the per-event gain that puts each family at its measured level lives in src/sound.js.
 *
 * The report at the end measures every file the way the study measured the reference (same STFT sizes, bands and
 * thresholds: corpus/_study/<source>/audio/scripts 07, 09, 17, 21) and prints the gainDb each file needs; copy a
 * changed table into src/sound.js (GAIN) and the beds' gainDb into style.head.json. Some targets were measured for
 * this build from the study's own work files (corpus/_study/<source>/_build/sound/*.py; measurement only).
 *
 * Deterministic: no clock, no Math.random; the same bytes on every run with the same ffmpeg. Node 22+, built-ins
 * only, ffmpeg on PATH (AAC encode and EBU R128 measurement).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PACK = path.resolve(HERE, '..');
const SFX_DIR = path.join(PACK, 'assets', 'sfx');
const MUSIC_DIR = path.join(PACK, 'assets', 'music');
const SR = 48000, TAU = 2 * Math.PI;
const CHECK_ONLY = process.argv.includes('--check');

// ------------------------------------------------------------------ measured targets (research/audio.md)
// The levels are absolute dB in the reference masters (-14.1 LUFS), measured on the mono mix with the study's STFTs:
//   AVB  = 16.3-19 kHz, nfft 1024, hop 5 ms (the band the voice leaves empty above its 15.9 kHz low-pass) [A06, A17]
//   SUB  = 25-70 Hz, nfft 4096, hop 10 ms [A07, A19]
// An effect's span is where it stands 20 dB over the clip floor; at the medians that is 32.4 dB (swell), 33.8 dB
// (ping) under its AVB peak and 10.6 dB under its SUB peak (boom: peak 22.6 dB over a base, span at base + 12).
const TARGET = {
  swell: { dur: 728, attack: 228, decay: 378, avbPeak: -48.1, tilt: -0.2, flat: 0.2, pk: 12446, span: 32.4 },   // [A18] loud n=60
  boom: { dur: 375, attack: 125, decay: 210, subPeak: -24.4, f0: 46.9, f1: 35.2, span: 10.6 },                   // [A19] n=108
  ping: { dur: 258, attack: 48, decay: 175, avbPeak: -47.2, tilt: 2.6, flat: 0.03, pk: 13805, span: 33.8 },     // [A20] loud n=78
  // textures are steady, so their level is matched on the plateau (p90 of the AVB level over the event)
  reel: { dur: 1750, avbPeak: -44.2, avbP90: -47.5, span: 32.4 },      // clip01@397-449, the cassette reels [A22]
  printer: { dur: 3170, avbPeak: -49.1, avbP90: -53.3, span: 32.4 },   // clip01@657-751, the receipt printing [A22]
};
// Effect band shapes: band power re the AVB band (dB), measured for this build (corpus/_study/<source>/_build/
// sound/). Swells and pings (measure_shapes.py): median over the loud events (n 60, 78) within 20 ms of the AVB peak,
// the 0.6 s before subtracted in power; under 4 kHz the voice dominates and these are upper bounds. Textures
// (texture_shape.py): the rise of each band's 25th/50th percentile during the texture over the whole clip, in power,
// re the AVB median. null: the voice hides that band.
const FX_BANDS = [[25, 80], [80, 250], [250, 1000], [1000, 4000], [4000, 8000], [8000, 12000], [12000, 16000]];
const FX_SHAPE = {
  swell: [16.9, 23.5, 20.0, 15.8, 12.7, 9.2, 4.8],
  ping: [null, null, null, null, 8.1, 5.0, 2.6],
  reel: [null, 16, 24, null, 1, -2, 1],
  printer: [24, 26, 23, 13, 5, 3.5, 1.5],
};
// bed band shapes, dB re the 50-100 Hz band (median over frames of the band power, nfft 2048, hop 10 ms) [A15]
const BANDS = [[25, 50], [50, 100], [100, 200], [200, 400], [400, 800], [800, 1600], [1600, 3200], [3200, 6400], [6400, 12800], [12800, 20000]];
const SHAPE = {
  // bed A (130 BPM) and bed B (118 BPM), voice-reduced reconstructions [A15]
  a: [-35.4, -33.7, -39.7, -37.4, -42.0, -51.5, -53.7, -57.7, -61.2, -79.0].map((v) => +(v + 33.7).toFixed(1)),
  b: [-35.5, -37.7, -36.8, -33.3, -40.2, -44.3, -47.2, -49.4, -52.9, -64.7].map((v) => +(v + 37.7).toFixed(1)),
  // the pulse-free beds have no reconstruction: per-bin 10th percentile of clip04, 06 and 08 (minimum statistics;
  // the same method gives bed A's shape within 2 dB), measured for this build (_build/sound/measure_pad.py)
  c: [-7.1, 0, 11.2, 15.9, 14.3, 6.1, -1.1, -12.2, -19.4, -35.1],
};
const SUB_SHARE = { a: 0.42, b: 0.30 };   // energy under 80 Hz: 10^(-3.8/10), 10^(-5.3/10) [A15]
const BED_MID_RMS = -20;                  // the engine expects beds at -20 dBFS mid RMS (engine/lib/render.mjs)
const SFX_REF = -20;                      // every effect: loudest 50 ms at -20 dBFS RMS

// ------------------------------------------------------------------ small DSP kit
/** mulberry32: a seeded generator, uniform in [0, 1). */
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const dbg = (db) => Math.pow(10, db / 20);
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
const secs = (n) => Math.round(n * SR);
function white(n, seed) { const r = rng(seed), y = new Float64Array(n); for (let i = 0; i < n; i++) y[i] = r() * 2 - 1; return y; }
/** Pink noise (Paul Kellet's refined filter on seeded white noise). */
function pink(n, seed) {
  const w = white(n, seed), y = new Float64Array(n);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < n; i++) {
    const x = w[i];
    b0 = 0.99886 * b0 + x * 0.0555179; b1 = 0.99332 * b1 + x * 0.0750759; b2 = 0.96900 * b2 + x * 0.1538520;
    b3 = 0.86650 * b3 + x * 0.3104856; b4 = 0.55000 * b4 + x * 0.5329522; b5 = -0.7616 * b5 - x * 0.0168980;
    y[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + x * 0.5362) * 0.11; b6 = x * 0.115926;
  }
  return y;
}
/** State-variable filter (topology-preserving, Zavalishin): 'lp' | 'bp' | 'hp'; f in Hz or a function of time (s). */
function svf(x, mode, f, q = Math.SQRT1_2) {
  const y = new Float64Array(x.length);
  const ff = typeof f === 'function' ? f : () => f;
  const k = 1 / q;
  let ic1 = 0, ic2 = 0, a1 = 0, a2 = 0, a3 = 0;
  for (let i = 0; i < x.length; i++) {
    if (i % 16 === 0) { const g = Math.tan((Math.PI * Math.min(Math.max(ff(i / SR), 10), SR * 0.47)) / SR); a1 = 1 / (1 + g * (g + k)); a2 = g * a1; a3 = g * a2; }
    const v3 = x[i] - ic2, v1 = a1 * ic1 + a2 * v3, v2 = ic2 + a2 * ic1 + a3 * v3;
    ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2;
    y[i] = mode === 'lp' ? v2 : mode === 'bp' ? k * v1 : x[i] - k * v1 - v2;
  }
  return y;
}
const hp = (x, f, q) => svf(x, 'hp', f, q), lp = (x, f, q) => svf(x, 'lp', f, q), bp = (x, f, q) => svf(x, 'bp', f, q);
/** An envelope from [t (s), dB] breakpoints, straight lines in dB, -inf below -119 dB. */
function envDb(n, pts) {
  const y = new Float64Array(n);
  let k = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    while (k < pts.length - 2 && t > pts[k + 1][0]) k++;
    const [t0, d0] = pts[k], [t1, d1] = pts[Math.min(k + 1, pts.length - 1)];
    const d = t <= t0 ? d0 : t >= t1 ? d1 : d0 + ((d1 - d0) * (t - t0)) / (t1 - t0);
    y[i] = d <= -119 ? 0 : dbg(d);
  }
  return y;
}
const mul = (a, b) => a.map((v, i) => v * b[i]);
function addInto(dst, src, at = 0, g = 1) { for (let i = 0; i < src.length; i++) { const j = at + i; if (j >= 0 && j < dst.length) dst[j] += src[i] * g; } }
/** A band-limited saw (polyBLEP) at a fixed frequency, n samples, starting phase p0. */
function saw(n, f, p0 = 0) {
  const y = new Float64Array(n), dt = f / SR;
  let p = ((p0 % 1) + 1) % 1;
  for (let i = 0; i < n; i++) {
    let v = 2 * p - 1;
    if (p < dt) { const t = p / dt; v -= t + t - t * t - 1; } else if (p > 1 - dt) { const t = (p - 1) / dt; v -= t * t + t + t + 1; }
    y[i] = v; p += dt; if (p >= 1) p -= 1;
  }
  return y;
}
/** A sine whose frequency follows fOf(t) (Hz), so glides stay phase-continuous. */
function sineGlide(n, fOf, p0 = 0) { const y = new Float64Array(n); let p = p0; for (let i = 0; i < n; i++) { y[i] = Math.sin(p); p += (TAU * fOf(i / SR)) / SR; } return y; }

// ------------------------------------------------------------------ analysis (the study's measures, in JS)
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let b = n >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const a = -TAU / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k], ui = im[i + k], vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
}
/** Power STFT (Hann), as common.py stft_power: calls fn(powerSpectrum, frameIndex) per frame; returns the norm. */
function stft(x, n, hop, fn) {
  const win = new Float64Array(n); let ws = 0;
  for (let i = 0; i < n; i++) { win[i] = 0.5 - 0.5 * Math.cos((TAU * i) / (n - 1)); ws += win[i]; }
  const re = new Float64Array(n), im = new Float64Array(n), P = new Float64Array(n / 2 + 1);
  const frames = 1 + Math.floor((x.length - n) / hop);
  for (let f = 0; f < frames; f++) {
    for (let i = 0; i < n; i++) { re[i] = x[f * hop + i] * win[i]; im[i] = 0; }
    fft(re, im);
    for (let k = 0; k <= n / 2; k++) P[k] = re[k] * re[k] + im[k] * im[k];
    fn(P, f);
  }
  return (ws * ws) / 2;
}
const binOf = (f, n) => Math.round((f * n) / SR);
/** Band level series (dB, normalised as the study) for [lo, hi) bands. */
function bandSeries(x, n, hop, bands) {
  const out = bands.map(() => []);
  const ks = bands.map(([a, b]) => { const r = []; for (let k = 0; k <= n / 2; k++) { const f = (k * SR) / n; if (f >= a && f < b) r.push(k); } return r; });
  const norm = stft(x, n, hop, (P) => { ks.forEach((r, j) => { let s = 0; for (const k of r) s += P[k]; out[j].push(s); }); });
  return out.map((a) => a.map((s) => 10 * Math.log10(s / norm + 1e-14)));
}
const pct = (arr, p) => { const a = [...arr].sort((u, v) => u - v); const i = (a.length - 1) * p; const lo = Math.floor(i); return a[lo] + (a[Math.min(lo + 1, a.length - 1)] - a[lo]) * (i - lo); };
/** Span, attack and decay of an event in a dB series (step in ms) where it stands within `span` dB of its peak. */
function spanOf(series, stepMs, span) {
  let pk = 0; for (let i = 1; i < series.length; i++) if (series[i] > series[pk]) pk = i;
  const thr = series[pk] - span;
  let a = pk; while (a > 0 && series[a - 1] > thr) a--;
  let b = pk; while (b < series.length - 1 && series[b + 1] > thr) b++;
  return { peak: series[pk], dur: (b - a + 1) * stepMs, attack: (pk - a) * stepMs, decay: (b - pk) * stepMs, a, b, pk };
}
/** Spectral centroid of the whole signal (Hz), from the long-term power spectrum. */
function centroid(x, lo = 20) {
  let num = 0, den = 0;
  stft(x.length >= 8192 ? x : Float64Array.from({ length: 8192 }, (_, i) => x[i] || 0), 8192, 4096, (P) => { for (let k = 1; k < P.length; k++) { const f = (k * SR) / 8192; if (f < lo) continue; num += f * P[k]; den += P[k]; } });
  return num / (den || 1);
}
/** The AVB descriptors of 21_classify.py over the event span: tilt, flatness 12-19 kHz, peak frequency 12-22 kHz. */
function avbDescriptors(x, a, b) {
  const tilt = [], flat = [], mean = new Float64Array(513);
  let frames = 0;
  stft(x, 1024, 240, (P, f) => {
    if (f < a || f > b) return;
    let la = 0, lb = 0; for (let k = 0; k < P.length; k++) { const fr = (k * SR) / 1024; if (fr >= 16300 && fr < 17500) la += P[k]; else if (fr >= 17500 && fr < 19000) lb += P[k]; }
    tilt.push(10 * Math.log10((lb + 1e-20) / (la + 1e-20)));
    let lg = 0, ar = 0, m = 0; for (let k = 0; k < P.length; k++) { const fr = (k * SR) / 1024; if (fr >= 12000 && fr < 19000) { lg += Math.log(P[k] + 1e-16); ar += P[k] + 1e-16; m++; } }
    flat.push(Math.exp(lg / m) / (ar / m));
    for (let k = 0; k < P.length; k++) mean[k] += P[k]; frames++;
  });
  let pk = 0, pf = 0; for (let k = 0; k < mean.length; k++) { const fr = (k * SR) / 1024; if (fr >= 12000 && fr < 22000 && mean[k] > pk) { pk = mean[k]; pf = fr; } }
  return { tilt: tilt.reduce((s, v) => s + v, 0) / tilt.length, flat: pct(flat, 0.5), pk: pf };
}
/** Strongest frequency (Hz) 25-90 Hz in the first and last quarter of a boom (as 21_classify.py). */
function boomGlide(x, a, b) {
  const n = 4096, sel = []; for (let k = 0; k <= n / 2; k++) { const f = (k * SR) / n; if (f >= 25 && f < 90) sel.push(k); }
  const cols = []; stft(x, n, 480, (P, f) => { if (f >= a && f <= b) cols.push(sel.map((k) => P[k])); });
  const q = Math.max(1, Math.floor(cols.length / 4));
  const best = (cs) => { const s = sel.map((_, j) => cs.reduce((acc, c) => acc + c[j], 0)); let m = 0; for (let j = 1; j < s.length; j++) if (s[j] > s[m]) m = j; return (sel[m] * SR) / n; };
  return { f0: best(cols.slice(0, q)), f1: best(cols.slice(-q)) };
}
/** Loudest 50 ms RMS (dBFS) and sample peak (dBFS). */
function levels(x) {
  const w = secs(0.05); let s = 0, best = 0, peak = 0;
  for (let i = 0; i < x.length; i++) { s += x[i] * x[i]; if (i >= w) s -= x[i - w] * x[i - w]; if (i >= w - 1) best = Math.max(best, s / w); peak = Math.max(peak, Math.abs(x[i])); }
  if (x.length < w) best = s / w;
  return { rms50: 10 * Math.log10(best + 1e-20), peak: 20 * Math.log10(peak + 1e-20) };
}
/** EBU R128 integrated loudness and true peak of a file, through ffmpeg. */
function r128(file) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' });
  const tail = r.stderr.slice(r.stderr.lastIndexOf('Summary:'));
  return { i: parseFloat(/I:\s+(-?[\d.]+) LUFS/.exec(tail)?.[1]), lra: parseFloat(/LRA:\s+(-?[\d.]+) LU/.exec(tail)?.[1]), tp: parseFloat(/Peak:\s+(-?[\d.]+) dBFS/.exec(tail)?.[1]) };
}
/** Decode a file to mono float at 48 kHz (the left channel; the files are dual mono) and the side level. */
function decodeMono(file) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'f32le', '-ac', '2', '-ar', String(SR), '-'], { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error(`ffmpeg could not decode ${file}`);
  const buf = r.stdout, n = buf.length / 8, x = new Float64Array(n);
  let m = 0, s = 0;
  for (let i = 0; i < n; i++) { const l = buf.readFloatLE(i * 8), rr = buf.readFloatLE(i * 8 + 4); x[i] = (l + rr) / 2; m += x[i] * x[i]; s += ((l - rr) / 2) ** 2; }
  return { x, sideDb: 10 * Math.log10((s + 1e-30) / (m + 1e-30)) };
}

// ------------------------------------------------------------------ writing
/** Dual-mono 16-bit WAV with seeded triangular dither, so the bytes repeat. */
function wavBytes(x, seed = 7) {
  const n = x.length, buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  const d = rng(seed);
  for (let i = 0; i < n; i++) { const v = Math.max(-32768, Math.min(32767, Math.round(x[i] * 32767 + (d() - d()) * 0.5))); buf.writeInt16LE(v, 44 + i * 4); buf.writeInt16LE(v, 46 + i * 4); }
  return buf;
}
/** Finish an effect: remove DC, a 2 ms start ramp (no click), a 5 ms end ramp, loudest 50 ms at -20 dBFS RMS. */
function finishSfx(x) {
  let m = 0; for (const v of x) m += v; m /= x.length;
  const y = x.map((v) => v - m);
  const a = secs(0.002), b = secs(0.005);
  for (let i = 0; i < a && i < y.length; i++) y[i] *= i / a;
  for (let i = 0; i < b && i < y.length; i++) y[y.length - 1 - i] *= i / b;
  const g = dbg(SFX_REF - levels(y).rms50);
  const z = y.map((v) => v * g);
  const pk = levels(z).peak;
  if (pk > -1) throw new Error(`effect peaks at ${pk.toFixed(1)} dBFS after normalising`);
  return z;
}
/** Finish a bed: DC-free, a 10 ms ramp only at the very end (the loop point), mid RMS at -20 dBFS. */
function finishBed(x) {
  let m = 0; for (const v of x) m += v; m /= x.length;
  let e = 0; const y = x.map((v) => { const u = v - m; e += u * u; return u; });
  const g = dbg(BED_MID_RMS) / Math.sqrt(e / y.length);
  const r = secs(0.01);
  for (let i = 0; i < y.length; i++) y[i] *= g * (i >= y.length - r ? (y.length - 1 - i) / r : 1);
  let pk = 0; for (const v of y) pk = Math.max(pk, Math.abs(v));
  if (pk > dbg(-1)) { const k = dbg(-1) / pk; for (let i = 0; i < y.length; i++) y[i] *= k; console.warn(`bed limited by ${(20 * Math.log10(k)).toFixed(1)} dB to keep its peak under -1 dBFS`); }
  return y;
}
function writeSfx(name, x) { const file = path.join(SFX_DIR, `${name}.wav`); fs.writeFileSync(file, wavBytes(x)); return file; }
function writeBed(name, x) {
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pr-audio-')), `${name}.wav`);
  fs.writeFileSync(tmp, wavBytes(x, 11));
  const out = path.join(MUSIC_DIR, `${name}.m4a`);
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', tmp, '-c:a', 'aac', '-b:a', '160k', '-aac_pns', '0', '-ar', String(SR), '-ac', '2', '-map_metadata', '-1', '-fflags', '+bitexact', '-flags:a', '+bitexact', out], { encoding: 'utf8' });
  fs.rmSync(path.dirname(tmp), { recursive: true, force: true });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr || r.error}`);
  return out;
}

// ================================================================== effects
/** One-pole low-pass (6 dB/oct): the gentle roll-offs the measured shapes call for. */
function lp1(x, f) { const a = Math.exp((-TAU * f) / SR), y = new Float64Array(x.length); let s = 0; for (let i = 0; i < x.length; i++) { s = (1 - a) * x[i] + a * s; y[i] = s; } return y; }
/** Brown noise (-6 dB/oct), leaky-integrated seeded white noise. */
function brown(n, seed) { const w = white(n, seed), y = new Float64Array(n); let s = 0; for (let i = 0; i < n; i++) { s = 0.996 * s + w[i] * 0.06; y[i] = s; } return y; }

// ---- noise swell [A18]: a full-band noise swell. Measured around its AVB peak the swell's band power stands
// 12-16k +4.8, 8-12k +9.2, 4-8k +12.7 dB over the AVB band (and at most 1-4k +15.8, 250-1000 +20, 80-250 +23.5):
// pink noise rolled off over 8 kHz. Flat across 16.3-19 kHz (tilt -0.2 dB); rises over about 0.23 s and falls over
// about 0.38 s. The study's suggested recipe (high-pass at 2 kHz) disagrees with these band levels, so it is not
// used. Its measured flatness (0.2 in 12-19 kHz) is not reached: smooth noise reads about 0.5, and the reference is
// SBR-reconstructed above 11-12 kHz, where fine spectral detail is not reliable [A05].
function swell(seed, { attack, hold, decay, open = 7000, lowDb = 0 }) {
  const n = secs(attack + hold + decay + 0.04), T = attack + hold + decay;
  // the event span is where it stands within ~32 dB of its AVB peak, so the AVB envelope starts and ends at -33 dB
  const e = envDb(n, [[0, -30], [attack * 0.5, -9], [attack, 0], [attack + hold, -0.6], [attack + hold + decay * 0.3, -8], [T, -27], [T + 0.04, -60]]);
  // brightness: a 2-pole low-pass opens from `open` Hz to the top over the attack and half closes over the decay
  const cut = (t) => (t < attack ? open * Math.pow(22000 / open, Math.pow(t / attack, 0.8)) : 22000 * Math.pow(0.6, Math.min(1, (t - attack - hold) / decay)));
  const hi = lp(lp1(lp1(pink(n, seed), 8000), 16000), cut, 0.55);
  const lo = lp(brown(n, seed + 1), 900, 0.6);
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) y[i] = (hi[i] + lo[i] * 0.55 * dbg(lowDb)) * e[i];
  return finishSfx(hp(y, 30, 0.7));
}
const SWELLS = [
  { attack: 0.31, hold: 0.08, decay: 0.50 },                        // the median: 0.73 s, attack 228 ms, decay 378 ms
  { attack: 0.13, hold: 0.03, decay: 0.27, open: 9000 },            // short (p10 0.29 s)
  { attack: 0.42, hold: 0.06, decay: 0.58, lowDb: 2 },              // long (1.0 s)
  { attack: 0.68, hold: 0.08, decay: 0.78, lowDb: 3 },              // the longest (p90 1.5 s; opening swells run 0.95-2.0 s [A23])
];

// ---- sub boom [A19]: a sine starting at 47 Hz and falling toward 35 Hz (38 % glide down; 47 Hz is also the
// median end), 2nd harmonic 12 dB under, kept under 80 Hz where the voice is high-passed [A07]. In the 25-70 Hz
// band it rises about 125 ms to its peak and falls about 210 ms back to 10.6 dB under it.
function boom(seed, { len, f0, f1, attackS, tau, h2 = -12 }) {
  const n = secs(len);
  const fOf = (t) => f1 + (f0 - f1) * Math.exp(-t / (len * 0.4));
  const s1 = sineGlide(n, fOf), s2 = sineGlide(n, (t) => 2 * fOf(t));
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const a = t < attackS ? Math.sin((Math.PI / 2) * (t / attackS)) ** 2 : Math.exp(-(t - attackS) / tau);
    y[i] = (s1[i] + s2[i] * dbg(h2)) * a * Math.min(1, (len - t) / 0.05);
  }
  return finishSfx(lp(y, 110, 0.7));
}
const BOOMS = [
  { len: 0.9, f0: 47, f1: 35, attackS: 0.22, tau: 0.17 },               // the median: 0.375 s, 47 -> 35 Hz
  { len: 0.6, f0: 47, f1: 45, attackS: 0.11, tau: 0.11 },               // short and nearly steady (62 % do not glide)
  { len: 1.45, f0: 47, f1: 35, attackS: 0.38, tau: 0.34 },               // long (p90 0.9 s)
  { len: 0.9, f0: 59, f1: 47, attackS: 0.18, tau: 0.17 },               // starts higher (p75 start 58.6 Hz)
];

// ---- high ping [A20]: stable partials. The strongest in 12-22 kHz near 13.8 kHz (12.3-18.2), a little more
// energy in 17.5-19 than in 16.3-17.5 kHz (tilt +2.6 dB), flatness under 0.1; under them the measured event lifts
// 4-8 kHz (+8 dB re AVB) and 8-12 kHz (+5), so each ping is a small inharmonic bell: a body near 3-6 kHz and the high
// partials. Attack about 48 ms, decay about 175 ms to the span threshold.
function ping(seed, { partials, attackS, decay }) {
  const len = attackS + decay * 1.7 + 0.02;
  const n = secs(len), y = new Float64Array(n), r = rng(seed);
  for (const [f, db, dmul = 1] of partials) {
    const p0 = r() * TAU, tau = (decay / 3.9) * dmul;   // -34 dB (the span threshold) after `decay` seconds
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const a = t < attackS ? Math.sin((Math.PI / 2) * (t / attackS)) ** 2 : Math.exp(-(t - attackS) / tau);
      y[i] += Math.sin(p0 + TAU * f * t) * dbg(db) * a;
    }
  }
  return finishSfx(y);
}
// partials [Hz, dB, decay multiplier]: body, an octave-ish partial, 8-12 kHz, the strongest high partial, the AVB pair
const PINGS = [
  { partials: [[3150, 7, 1.4], [6210, 9, 1.1], [10110, 6.5], [13805, 4.5], [16880, -2.6, 0.8], [18300, 0, 0.8]], attackS: 0.065, decay: 0.21 },   // the median
  { partials: [[2810, 6, 1.4], [5540, 8, 1.1], [9020, 6], [12330, 4.5], [16620, -2.2, 0.8], [17940, 0, 0.8]], attackS: 0.04, decay: 0.11 },     // short, low (p10)
  { partials: [[3470, 7, 1.4], [6840, 9, 1.1], [11140, 6.5], [15210, 3.5], [16950, -2.6, 0.8], [18420, 0, 0.8]], attackS: 0.07, decay: 0.32 },  // longer
  { partials: [[4150, 10, 1.4], [8180, 9, 1.1], [13330, 4], [16900, -1.6, 0.8], [18190, 2, 0.8]], attackS: 0.07, decay: 0.42 },                 // high (p90 18.2 kHz), long
];

// ---- action textures [A22]. Two cases in the corpus, measured for this build (_build/sound/measure_ref.py,
// texture_shape.py):
//   cassette reels spinning, clip01@397-449: 1.75 s, AVB peak -44.2 dB (p90 -47.5), flatness 0.54, a 0.4 s rise and
//   a 0.2 s fall, the AVB envelope weakly modulated near 17 and 30 Hz. A mid rumble (250-1000 Hz about +24 dB re AVB,
//   80-250 Hz +16) and an even hiss from 4 to 19 kHz (4-8k +1, 8-12k -2, 12-16k +1); nothing measurable in 1-4 kHz.
//   a receipt printing, clip01@657-751: 3.17 s, AVB peak -49.1 dB (p90 -53.3), a steady plateau with no modulation,
//   an abrupt start and a fluctuating 0.5 s tail. A motor low end (25-80 Hz +24, 80-250 Hz +26), mechanism mids
//   (250-1000 +23, 1-4k +13) and a hiss falling gently above 4 kHz (4-8k +5, 8-12k +3.5, 12-16k +1.5).
// Each is written at three lengths; src/sound.js picks the one closest to the action.
const TEX_LENGTHS = [1.0, 1.8, 3.2];

function reel(seed, len) {
  const tail = 0.2, n = secs(len + tail), r = rng(seed);
  const rise = Math.min(0.4, len * 0.3);
  const e = envDb(n, [[0, -28], [rise * 0.5, -8], [rise, -1], [len, 0], [len + tail * 0.4, -9], [len + tail, -45]]);
  // spin speed: up to speed over the rise, winding down in the tail (it scales the spoke and flutter rates)
  const speed = (t) => (t < rise ? 0.6 + 0.4 * (t / rise) : t < len ? 1 : Math.max(0.3, 1 - (t - len) / (tail * 1.2)));
  const mech = lp(lp(hp(hp(pink(n, seed), 170, 0.7), 170, 0.7), 900, 0.7), 900, 0.7);   // the transport rumble, 170-900 Hz
  const hiss = hp(hp(white(n, seed + 1), 3600, 0.7), 3600, 0.7);           // an even hiss from 4 kHz up
  const y = new Float64Array(n);
  let p1 = r() * TAU, p2 = r() * TAU, p3 = r() * TAU;
  for (let i = 0; i < n; i++) {
    const t = i / SR, s = speed(t);
    p1 += (TAU * 7 * s) / SR; p2 += (TAU * 16.8 * s) / SR; p3 += (TAU * 29.5 * s) / SR;   // spokes, flutter
    const am = 1 + 0.14 * Math.sin(p1) + 0.08 * Math.sin(p2) + 0.08 * Math.sin(p3);
    y[i] = (mech[i] * MIX_REEL.mech + hiss[i] * MIX_REEL.hiss) * am * e[i];
  }
  return finishSfx(hp(y, 40, 0.7));
}
const MIX_REEL = { mech: 1.0, hiss: 0.017 };

function printer(seed, len) {
  const tail = 0.45, n = secs(len + tail), r = rng(seed);
  const e = envDb(n, [[0, -40], [0.012, 0], [len, 0], [len + 0.02, -5], [len + tail, -45]]);
  const feed = lp1(hp(white(n, seed), 3500, 0.7), 14000);             // paper feed: an even hiss from 4 kHz, falling gently
  const buzz = new Float64Array(n); let ph = 0;                       // print head: a 245 Hz pulse train, 0.25-3 kHz
  for (let i = 0; i < n; i++) { ph += 245 / SR; if (ph >= 1) { ph -= 1; buzz[i] = 1; } }
  const head = lp(lp(hp(buzz, 240, 0.7), 1300, 0.7), 1300, 0.7);
  const ticks = new Float64Array(n), step = SR / 32;                  // line steps, kept under 4 kHz: the reference AVB is unmodulated
  for (let k = 0; k * step < secs(len); k++) { const at = Math.round(k * step + r() * 40); for (let j = 0; j < 90 && at + j < n; j++) ticks[at + j] += (r() * 2 - 1) * Math.exp(-j / 18); }
  const tk = lp(lp(hp(ticks, 700, 0.7), 3500, 0.7), 3500, 0.7);
  const motor = lp(lp(hp(pink(n, seed + 3), 28, 0.7), 260, 0.7), 260, 0.7);   // the motor: 28-260 Hz
  const flick = lp(white(n, seed + 5), 9, 0.7);                       // the tail fades out unevenly
  let fmax = 0; for (const v of flick) fmax = Math.max(fmax, Math.abs(v));
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR, run = t < len ? 1 : Math.max(0, 1 - (t - len) / 0.03);
    const wobble = t < len ? 1 : 0.55 + 0.45 * (flick[i] / fmax);
    y[i] = (feed[i] * MIX_PRINT.feed * wobble + (head[i] * MIX_PRINT.head + tk[i] * MIX_PRINT.ticks + motor[i] * MIX_PRINT.motor) * run) * e[i];
  }
  // three engage ticks at the start (the reference ticks just before printing, clip01@625-655), a low clunk at the stop
  for (const at of [0, 0.06, 0.11]) { const s = secs(at); for (let j = 0; j < 200 && s + j < n; j++) y[s + j] += (r() * 2 - 1) * MIX_PRINT.engage * Math.exp(-j / 30); }
  const s = secs(len); for (let j = 0; j < secs(0.08) && s + j < n; j++) y[s + j] += Math.sin((TAU * 70 * j) / SR) * MIX_PRINT.clunk * Math.exp(-j / secs(0.02));
  return finishSfx(hp(y, 25, 0.7));
}
const MIX_PRINT = { feed: 0.016, head: 2.0, ticks: 0.22, motor: 1.0, engage: 0.03, clunk: 0.3 };

// ================================================================== beds
/** A kick: a sine sweeping from f0 down to f1, amplitude decaying with tau, plus a 3 ms click. */
function kick(dst, at, { f0 = 150, f1 = 48, tauF = 0.03, tau = 0.16, len = 0.5, gain = 1, click = 0.15, seed = 1 }) {
  const n = secs(len), r = rng(seed); let p = 0;
  for (let i = 0; i < n && at + i < dst.length; i++) {
    const t = i / SR, f = f1 + (f0 - f1) * Math.exp(-t / tauF);
    p += (TAU * f) / SR;
    const a = Math.min(1, t / 0.0015) * Math.exp(-t / tau) * Math.min(1, (len - t) / 0.02);
    dst[at + i] += gain * (a * Math.sin(p) + (t < 0.004 ? click * (r() * 2 - 1) * (1 - t / 0.004) : 0));
  }
}
/** A hat or shaker: white noise band-limited to [lo, hi], decaying with tau. */
function hat(dst, at, { tau = 0.03, gain = 0.2, lo = 6000, hi = 12000, seed = 1, len = 0.25, att = 0.001 }) {
  const n = secs(len);
  const x = lp(hp(white(n, seed), lo, 0.7), hi, 0.7);
  for (let i = 0; i < n && at + i < dst.length; i++) { const t = i / SR; dst[at + i] += gain * x[i] * Math.min(1, t / att) * Math.exp(-t / tau) * Math.min(1, (len - t) / 0.01); }
}
/** Sidechain pump: 1 - depth at each beat, recovering with tau (the measured bed A bass dips on every beat). */
const pump = (t, beat, depth, tau) => { const x = ((t % beat) + beat) % beat; return 1 - depth * Math.exp(-x / tau); };
/** Held chord voices: detuned saws, each note for `len` samples from `a`, added into dst. */
function sawChord(dst, a, len, notes, { gain = 0.1, att = 0.03, rel = 0.08, det = [-0.07, 0.06] }) {
  for (const [k, note] of notes.entries()) for (const d of det) {
    const v = saw(len, hz(note + d), 0.13 * k + d);
    for (let i = 0; i < len && a + i < dst.length; i++) { const t = i / SR, env = Math.min(1, t / att, (len - i) / secs(rel)); dst[a + i] += v[i] * gain * env; }
  }
}

// ---- bed a: 130 BPM, four-on-the-floor kick, a held bass that pumps on every beat and changes every 8 beats,
// a dark hat on every off-beat (period 0.462 s), soft sixteenth shakers and a little air, held chords in 200-800 Hz
// [A15, A16; A_zoom_clip01_0-18_250.png shows the held bass blocks and the dips on every beat]
const MIX_A = { kick: 0.14, bass: 0.7, keys: 1.3, keysHi: 0.6, hat: 0.07, shaker: 0.08, air: 0.0042 };
function bedA() {
  const BPM = 130, B = 60 / BPM, BEATS = 128;                                 // 59.1 s
  const n = secs(BEATS * B), y = new Float64Array(n);
  // an original 32-beat cycle in F minor: bass C2 | A-flat1 | E-flat2 | F1, one note per 8 beats (65, 52, 78, 44 Hz)
  const PROG = [{ bass: 36, chord: [55, 58, 64] }, { bass: 32, chord: [60, 63, 67] }, { bass: 39, chord: [55, 58, 63] }, { bass: 29, chord: [56, 60, 63] }];
  const bass = new Float64Array(n), keys = new Float64Array(n);
  for (let blk = 0; blk < BEATS / 8; blk++) {
    const c = PROG[blk % 4], a = secs(blk * 8 * B), len = secs(8 * B);
    const f = hz(c.bass), s = saw(len, f), sub = sineGlide(len, () => f);
    for (let i = 0; i < len; i++) { const env = Math.min(1, i / secs(0.006), (len - i) / secs(0.03)); bass[a + i] += (s[i] * 0.5 + sub[i] * 0.8) * env; }
    sawChord(keys, a, len, c.chord, { gain: 0.1 });
  }
  const bassF = lp(lp(bass, 200, 0.8), 420, 0.7);
  const keysLo = lp(hp(keys, 180, 0.7), 900, 0.8), keysHi = lp(hp(keys, 900, 0.7), 4200, 0.7);
  const air = lp(lp1(hp(pink(n, 3), 1500, 0.7), 5000), 8500, 0.7);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    y[i] += bassF[i] * pump(t, B, 0.55, 0.11) * MIX_A.bass + (keysLo[i] * MIX_A.keys + keysHi[i] * MIX_A.keysHi) * pump(t, B, 0.45, 0.13) + air[i] * MIX_A.air * 40;
  }
  const SH = [1, 0.45, 0.7, 0.45];                                            // sixteenth accents
  for (let b = 0; b < BEATS; b++) {
    kick(y, secs(b * B), { f0: 150, f1: 55, tau: 0.12, len: 0.4, gain: MIX_A.kick, click: 0.25, seed: 100 + b });
    hat(y, secs((b + 0.5) * B), { tau: 0.03, gain: MIX_A.hat, lo: 5500, hi: 10500, seed: 300 + b });
    for (let s = 0; s < 4; s++) hat(y, secs((b + s / 4) * B + 0.004), { tau: 0.045, gain: MIX_A.shaker * SH[s], lo: 3500, hi: 9000, seed: 2000 + b * 4 + s, att: 0.006, len: 0.2 });
  }
  return finishBed(y);
}

// ---- bed b: 118 BPM, a long low kick on every beat whose pitch follows the bass (changing every 8 beats), held
// bright electric-piano chords strong in 200-400 Hz, an eighth-note pluck line in 0.5-2 kHz, bright hats and a
// ride that reach 20 kHz (bed B's cymbals fill above the voice's 15.9 kHz edge [A06]) [A15, A16]
const MIX_B = { kick: 1.3, keys: 2.2, keysHi: 5.5, pluck: 1.0, hat: 0.15, ride: 0.1, low: 0.26, lowHi: 0.42, air: 0.032 };
function bedB() {
  const BPM = 118, B = 60 / BPM, BEATS = 128;                                 // 65.1 s
  const n = secs(BEATS * B), y = new Float64Array(n);
  // an original cycle: F-sharp minor colours over F-sharp1 | D1 | A1 | E1
  const PROG = [{ bass: 30, chord: [57, 61, 64, 68], arp: [85, 88, 92, 93] }, { bass: 26, chord: [54, 57, 61, 64], arp: [81, 85, 88, 90] },
    { bass: 33, chord: [56, 61, 64, 68], arp: [85, 88, 92, 97] }, { bass: 28, chord: [56, 59, 62, 66], arp: [83, 86, 90, 92] }];
  const keys = new Float64Array(n), pl = new Float64Array(n), low = new Float64Array(n);
  for (let blk = 0; blk < BEATS / 8; blk++) {
    const c = PROG[blk % 4], a = secs(blk * 8 * B), len = secs(8 * B);
    for (const [k, note] of c.chord.entries()) {
      const f = hz(note), r = rng(500 + blk * 7 + k), p = [r() * TAU, r() * TAU, r() * TAU, r() * TAU];
      for (let i = 0; i < len; i++) {
        const t = i / SR, env = Math.min(1, t / 0.012, (len - i) / secs(0.1));
        // a tine-like voice: fundamental and partials 2, 3, 5 and 7 that fade over a second or two, a slow 4.6 Hz tremolo
        const tone = Math.sin(p[0] + TAU * f * t) + 0.6 * Math.exp(-t / 1.2) * Math.sin(p[1] + TAU * 2 * f * t)
          + 0.25 * Math.exp(-t / 0.9) * Math.sin(p[2] + TAU * 3.01 * f * t) + 0.2 * Math.exp(-t / 1.6) * Math.sin(p[3] + TAU * 5.02 * f * t)
          + 0.12 * Math.exp(-t / 1.0) * Math.sin(p[1] + TAU * 7.03 * f * t);
        keys[a + i] += tone * env * 0.16 * (1 + 0.12 * Math.sin(TAU * 4.6 * t + k));
      }
    }
    // the low voices: the bass note one and two octaves up, held, so 50-200 Hz is filled between kicks
    const fl = hz(c.bass + 12);
    for (let i = 0; i < len; i++) { const t = i / SR, env = Math.min(1, t / 0.02, (len - i) / secs(0.08)); low[a + i] += (Math.sin(TAU * fl * t) * MIX_B.low + Math.sin(TAU * 2 * fl * t) * MIX_B.lowHi) * env; }
    // the pluck line: eighth notes over the chord's upper tones, an original pattern
    const PAT = [0, 2, 1, 3, 2, 1, 3, 2, 0, 1, 2, 3, 1, 2, 0, 3];
    for (let e8 = 0; e8 < 16; e8++) {
      const f = hz(c.arp[PAT[e8]] - (e8 % 2 ? 12 : 0)), s = a + secs((e8 / 2) * B), ln = secs(0.3), r = rng(800 + blk * 16 + e8), p0 = r() * TAU;
      for (let i = 0; i < ln && s + i < n; i++) { const t = i / SR; pl[s + i] += (Math.sin(p0 + TAU * f * t) + 0.4 * Math.sin(TAU * 2 * f * t) * Math.exp(-t / 0.05) + 0.2 * Math.sin(TAU * 3 * f * t) * Math.exp(-t / 0.03)) * Math.min(1, t / 0.002) * Math.exp(-t / 0.11) * (e8 % 2 ? 0.7 : 1); }
    }
  }
  const keysLo = lp(hp(keys, 150, 0.7), 1000, 0.7), keysHi = lp(hp(keys, 1600, 0.7), 8000, 0.7);
  const air = lp(lp1(hp(pink(n, 5), 2000, 0.7), 8000), 11000, 0.7);
  const plF = lp(pl, 7000, 0.7), lowF = lp(low, 420, 0.7);
  for (let i = 0; i < n; i++) y[i] += keysLo[i] * MIX_B.keys + keysHi[i] * MIX_B.keysHi + plF[i] * MIX_B.pluck + lowF[i] + air[i] * MIX_B.air * 40;
  for (let b = 0; b < BEATS; b++) {
    const note = hz(PROG[Math.floor(b / 8) % 4].bass);
    kick(y, secs(b * B), { f0: 120, f1: note, tauF: 0.04, tau: 0.34, len: B - 0.005, gain: MIX_B.kick, click: 0.1, seed: 700 + b });
    hat(y, secs(b * B + B / 2), { tau: 0.04, gain: MIX_B.hat, lo: 7000, hi: 20000, seed: 900 + b });
    hat(y, secs(b * B), { tau: 0.025, gain: MIX_B.hat * 0.5, lo: 8000, hi: 20000, seed: 1100 + b });
    hat(y, secs(b * B), { tau: 0.35, gain: MIX_B.ride, lo: 4500, hi: 11000, seed: 1300 + b, len: B, att: 0.002 });   // ride wash
  }
  return finishBed(y);
}

// ---- bed c: pulse-free pad (clip04, 05, 06, 08, 10: no measurable pulse, held tones in 200-800 Hz, high held
// tones near 1.2-1.4 kHz, an occasional low note) [A16; A_zoom_clip04_0-12_2000.png]. Chord changes fall at
// irregular times, so no beat grid forms. Its band shape follows the min-statistics estimate of those clips. The low
// voice glides from root to root instead of overlapping, so two low tones never beat against each other (a beat
// in 25-100 Hz would read as a pulse).
const MIX_C = { pad: 1.0, bell: 0.05, low: 0.3, root: 0.022, air: 0.0017 };
function bedC() {
  const LEN = 62, n = secs(LEN), y = new Float64Array(n);
  // an original D-flat colour cycle, five voices each
  const CH = [[53, 56, 60, 63, 68], [53, 58, 61, 65, 72], [54, 58, 61, 65, 70], [56, 61, 63, 68, 70]];
  const ROOT = [37, 34, 30, 32];             // D-flat2 69 Hz, B-flat1 58 Hz, G-flat1 46 Hz, A-flat1 52 Hz
  const DUR = [6.3, 5.1, 7.2, 5.7, 6.6, 4.9, 6.9, 5.4, 6.1, 7.4];   // irregular: no pulse
  const pad = new Float64Array(n), bell = new Float64Array(n), low = new Float64Array(n);
  const changes = [];
  let t0 = 0, k = 0;
  while (t0 < LEN - 0.5) {
    const d = DUR[k % DUR.length], c = CH[k % CH.length];
    changes.push({ t: t0, f: hz(ROOT[k % ROOT.length]) });
    const a = secs(t0), len = Math.min(secs(d + 1.8), n - a);
    const att = k === 0 ? 0.08 : 1.4;
    sawChord(pad, a, len, c, { gain: 0.06, att, rel: 1.8, det: [-0.09, 0, 0.08] });
    if (k % 3 === 0) {                           // the occasional low note, off any grid, ending before the next chord
      const f = hz(ROOT[k % ROOT.length]), off = secs(0.6 + (k % 2) * 0.9), bl = Math.max(0, Math.min(secs(3.2), secs(d - 0.3) - off, n - a - off));
      for (let i = 0; i < bl; i++) { const t = i / SR, env = Math.min(1, t / 0.35) * Math.min(1, (bl - i) / secs(0.9)); low[a + off + i] += (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t)) * env; }
    }
    if (k % 3 !== 1) {                           // a high held tone two octaves above a chord tone
      const m = c[(k * 2) % c.length] + 24, f = hz(m > 90 ? m - 12 : m), off = secs(1.1 + (k % 4) * 0.5), bl = Math.max(0, Math.min(secs(2.2), n - a - off));
      for (let i = 0; i < bl; i++) { const t = i / SR, env = Math.min(1, t / 0.3) * Math.min(1, (bl - i) / secs(0.8)); bell[a + off + i] += Math.sin(TAU * f * t) * env; }
    }
    t0 += d; k++;
  }
  // the low root: one voice that glides to each new root over 1.2 s (its 2nd partial carries most of it)
  const fRoot = (t) => { let j = 0; while (j + 1 < changes.length && changes[j + 1].t <= t) j++; const c = changes[j], p = j ? changes[j - 1].f : c.f; const u = Math.min(1, (t - c.t) / 1.2); return p + (c.f - p) * (u * u * (3 - 2 * u)); };
  const r1 = sineGlide(n, fRoot), r2 = sineGlide(n, (t) => 2 * fRoot(t));
  // the pad's low-pass drifts slowly between 900 and 1400 Hz
  const padF = lp(hp(pad, 150, 0.7), (t) => 1150 + 250 * Math.sin((TAU * t) / 23), 0.7);
  const air = lp(lp1(hp(pink(n, 9), 3000, 0.7), 6000), 9000, 0.7);
  for (let i = 0; i < n; i++) y[i] = padF[i] * MIX_C.pad + bell[i] * MIX_C.bell + low[i] * MIX_C.low + (r1[i] * 0.5 + r2[i]) * MIX_C.root * Math.min(1, i / secs(0.08)) + air[i] * MIX_C.air * 40;
  return finishBed(y);
}

// ================================================================== build and report
const BEDS = [
  { id: 'a', label: 'Bass groove 130', make: bedA, bpm: 130 },
  { id: 'b', label: 'Kick and keys 118', make: bedB, bpm: 118 },
  { id: 'c', label: 'Pad, no beat', make: bedC, bpm: null },
];
const FX = [
  ...SWELLS.map((o, i) => ({ name: `swell-${i + 1}`, fam: 'swell', make: () => swell(40 + i * 3, o) })),
  ...BOOMS.map((o, i) => ({ name: `boom-${i + 1}`, fam: 'boom', make: () => boom(60 + i, o) })),
  ...PINGS.map((o, i) => ({ name: `ping-${i + 1}`, fam: 'ping', make: () => ping(80 + i, o) })),
  ...TEX_LENGTHS.map((L) => ({ name: `reel-${String(Math.round(L * 10)).padStart(2, '0')}`, fam: 'reel', make: () => reel(120 + L * 10, L) })),
  ...TEX_LENGTHS.map((L) => ({ name: `printer-${String(Math.round(L * 10)).padStart(2, '0')}`, fam: 'printer', make: () => printer(160 + L * 10, L) })),
];

// the engine's voice sits at -14.5 LUFS and the finished mix is brought to -14 LUFS (engine/lib/render.mjs); with a
// bed 16 LU under the voice the mix reads -14.39 before that step, so everything gains 0.4 dB; the reference
// masters sit at -14.1 [A01], 0.1 dB under ours. A level measured in the reference therefore needs
// gainDb = target - (file level) - 0.4 + 0.1.
const MIX_OFFSET = 0.3;
const BED_LU_UNDER = 16;                  // verified best estimate, range 13-25 LU [A14; V item 16]
const VOICE_REF = -14.5;

function reportFx(file, fam) {
  const { x, sideDb } = decodeMono(file);
  const T = TARGET[fam], out = { fam, file: path.basename(file), sideDb };
  const lv = levels(x); out.rms50 = lv.rms50; out.peakDbfs = lv.peak; out.lenMs = (x.length / SR) * 1000;
  out.centroid = centroid(x);
  if (fam === 'boom') {
    const [sub] = bandSeries(x, 4096, 480, [[25, 70]]);
    const s = spanOf(sub, 10, T.span);
    Object.assign(out, { dur: s.dur, attack: s.attack, decay: s.decay, level: s.peak, ...boomGlide(x, s.a, s.b) });
    out.gainDb = T.subPeak - s.peak - MIX_OFFSET;
  } else {
    const [avb] = bandSeries(x, 1024, 240, [[16300, 19000]]);
    const s = spanOf(avb, 5, T.span);
    Object.assign(out, { dur: s.dur, attack: s.attack, decay: s.decay, level: s.peak, ...avbDescriptors(x, s.a, s.b) });
    // band shape re AVB within 20 ms of the AVB peak (textures: over the plateau, median)
    const tex = !!T.avbP90;
    const bs = bandSeries(x, 1024, 240, [...FX_BANDS, [16300, 19000]]);
    const at = (arr) => { const w = tex ? arr.slice(s.a, s.b + 1) : arr.slice(Math.max(0, s.pk - 4), s.pk + 5); return 10 * Math.log10(pct(w.map((v) => 10 ** (v / 10)), 0.5)); };
    const ref = at(bs[bs.length - 1]);
    out.shape = bs.slice(0, -1).map((b) => at(b) - ref);
    if (tex) out.p90 = pct(avb.slice(s.a, s.b + 1), 0.9);
    // a steady texture is matched on its plateau (p90), the others on the peak
    out.gainDb = tex ? T.avbP90 - out.p90 - MIX_OFFSET : T.avbPeak - s.peak - MIX_OFFSET;
  }
  return out;
}

function reportBed(file, bed) {
  const { x, sideDb } = decodeMono(file);
  const L = r128(file);
  // octave bands, median over frames (as 09_bed_level.py)
  const series = bandSeries(x, 2048, 480, BANDS);
  const med = series.map((s) => 10 * Math.log10(pct(s.map((v) => 10 ** (v / 10)), 0.5)));
  const ref = med[1];
  // share of energy under 80 Hz (mean power, as the study's full-minus-sub figure)
  let sub = 0, tot = 0;
  stft(x, 2048, 480, (P) => { for (let k = 1; k < P.length; k++) { const f = (k * SR) / 2048; if (f < 25) continue; tot += P[k]; if (f < 80) sub += P[k]; } });
  // tempo: onset ACF of the 25-100 Hz level (as 07_bed_tempo.py)
  const [e] = bandSeries(x, 4096, 480, [[25, 100]]);
  const es = e.map((v, i) => (v + (e[i - 1] ?? v) + (e[i + 1] ?? v)) / 3);
  let o = es.map((v, i) => Math.max(0, v - (es[i - 1] ?? v)));
  const om = o.reduce((s, v) => s + v, 0) / o.length; o = o.map((v) => v - om);
  const ac0 = o.reduce((s, v) => s + v * v, 0);
  let best = { lag: 0, r: -1 };
  const acf = (lag) => { let s = 0; for (let i = 0; i + lag < o.length; i++) s += o[i] * o[i + lag]; return s / ac0; };
  const rs = []; for (let lag = 19; lag <= 451; lag++) rs[lag] = acf(lag);
  for (let lag = 20; lag <= 450; lag++) if (rs[lag] > rs[lag - 1] && rs[lag] >= rs[lag + 1] && rs[lag] > best.r) best = { lag, r: rs[lag] };
  const beatLag = bed.bpm ? Math.round(6000 / bed.bpm) : null;
  return {
    id: bed.id, file: path.basename(file), lenS: x.length / SR, sideDb, lufs: L.i, tp: L.tp,
    gainDb: VOICE_REF - BED_LU_UNDER - (L.i + (VOICE_REF + 20 - 3)),   // the engine adds (-14.5 + 20 - 3) dB to a bed
    subShare: sub / tot, shape: med.map((v) => v - ref), acfBest: best, acfBeat: beatLag ? acf(beatLag) : null,
  };
}

fs.mkdirSync(SFX_DIR, { recursive: true });
fs.mkdirSync(MUSIC_DIR, { recursive: true });
// --only <prefix,...> builds and reports only the files whose names start with one of the prefixes (for tuning)
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? process.argv[i + 1].split(',') : null; })();
const want = (name) => !ONLY || ONLY.some((p) => name.startsWith(p));
const fxFiles = FX.filter((f) => want(f.name)).map((f) => ({ ...f, file: CHECK_ONLY ? path.join(SFX_DIR, `${f.name}.wav`) : writeSfx(f.name, f.make()) }));
const bedFiles = BEDS.filter((b) => want(`bed-${b.id}`)).map((b) => ({ ...b, file: CHECK_ONLY ? path.join(MUSIC_DIR, `bed-${b.id}.m4a`) : writeBed(`bed-${b.id}`, b.make()) }));

const f1 = (v) => (v == null || Number.isNaN(v) ? '  -  ' : v.toFixed(1));
const gains = {};
console.log('\nEFFECTS (dur/attack/decay in ms over the study span; level = AVB peak dB, boom: 25-70 Hz peak dB, in the file)');
const byFam = {};
for (const f of fxFiles) {
  const r = reportFx(f.file, f.fam); (byFam[f.fam] ||= []).push(r); gains[f.name] = +r.gainDb.toFixed(1);
  const extra = f.fam === 'boom' ? `glide ${f1(r.f0)}->${f1(r.f1)} Hz` : `tilt ${f1(r.tilt)} dB, flat ${r.flat.toFixed(2)}, pk ${Math.round(r.pk)} Hz${r.p90 != null ? `, AVB p90 ${f1(r.p90)}` : ''}`;
  console.log(`  ${r.file.padEnd(15)} len ${Math.round(r.lenMs)} | dur ${r.dur} att ${r.attack} dec ${r.decay} | centroid ${Math.round(r.centroid)} Hz | ${extra} | file level ${f1(r.level)} -> gainDb ${f1(r.gainDb)} | side ${f1(r.sideDb)} dB, peak ${f1(r.peakDbfs)} dBFS`);
  if (r.shape) console.log(`  ${''.padEnd(15)} bands re AVB ${r.shape.map((v) => f1(v).padStart(6)).join('')}   target ${FX_SHAPE[f.fam].map((v) => f1(v).padStart(6)).join('')}`);
}
console.log(`  (bands: ${FX_BANDS.map(([a, b]) => `${a}-${b}`).join(', ')} Hz)`);
console.log('\n  family targets [A18-A22]:');
for (const [fam, T] of Object.entries(TARGET)) {
  const rs = byFam[fam] || []; if (!rs.length) continue;
  const med = (k) => pct(rs.map((r) => r[k]), 0.5);
  const tex = !!T.avbP90;
  const span = tex ? `durations ${rs.map((r) => r.dur).join(', ')} (the corpus cases ${T.dur})` : `dur ${Math.round(med('dur'))} (target ${T.dur}) att ${Math.round(med('attack'))} (${T.attack}) dec ${Math.round(med('decay'))} (${T.decay})`;
  console.log(`  ${fam.padEnd(8)} ${span} | centroid ${Math.round(med('centroid'))} Hz | at its gainDb: ${fam === 'boom' ? `25-70 Hz peak ${T.subPeak}` : tex ? `AVB p90 ${T.avbP90}` : `AVB peak ${T.avbPeak}`} dB`);
}
console.log(`\n  per-file gainDb for src/sound.js: ${JSON.stringify(gains).replace(/"([a-z0-9-]+)":/g, "'$1': ").replace(/,/g, ', ')}`);
console.log('\nBEDS (shape = octave bands re 50-100 Hz, median over frames; target from A15 / min-statistics)');
for (const f of bedFiles) {
  const r = reportBed(f.file, f);
  console.log(`  bed-${r.id}  ${r.lenS.toFixed(2)} s | ${f.bpm ? `${f.bpm} BPM: onset ACF best lag ${(r.acfBest.lag / 100).toFixed(2)} s (r ${r.acfBest.r.toFixed(2)}), at the beat r ${r.acfBeat.toFixed(2)}` : `no pulse: highest onset ACF peak ${r.acfBest.r.toFixed(2)} at ${(r.acfBest.lag / 100).toFixed(2)} s (pulse-free clips <= 0.08 in the mix)`}`);
  console.log(`         ${f1(r.lufs)} LUFS at -20 dBFS mid RMS, true peak ${f1(r.tp)} dBFS, side ${f1(r.sideDb)} dB | under 80 Hz ${(r.subShare * 100).toFixed(0)} %${SUB_SHARE[r.id] ? ` (target ${Math.round(SUB_SHARE[r.id] * 100)} %)` : ''} | gainDb ${f1(r.gainDb)} (bed ${BED_LU_UNDER} LU under the voice)`);
  console.log(`         shape  ${r.shape.map((v) => f1(v).padStart(6)).join('')}`);
  console.log(`         target ${SHAPE[r.id].map((v) => f1(v).padStart(6)).join('')}`);
}
