import { tmpDir, hasBinary } from './helpers.mjs';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { mixInto, writeWav, decode, dbToGain, loudnormFilter, RATE, CH } from '../engine/lib/audio.mjs';

describe('mixInto', () => {
  test('places a sound sample-accurately with gain, adding to what is there', () => {
    const dst = new Float32Array(10 * CH).fill(0.1);
    mixInto(dst, Float32Array.from([1, -1, 0.5, -0.5]), 3 / RATE, 0.5);
    assert.deepEqual([...dst].map((x) => +x.toFixed(3)), [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.6, -0.4, 0.35, -0.15, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]);
  });
  test('a sound running past the end is cut at the end', () => {
    const dst = new Float32Array(4 * CH);
    mixInto(dst, new Float32Array(10 * CH).fill(1), 2 / RATE);
    assert.deepEqual([...dst], [0, 0, 0, 0, 1, 1, 1, 1]);
  });
  test('a sound starting before 0 is trimmed, not delayed', () => {
    const dst = new Float32Array(4 * CH);
    mixInto(dst, Float32Array.from([1, 1, 2, 2, 3, 3, 4, 4]), -2 / RATE);
    assert.deepEqual([...dst], [3, 3, 4, 4, 0, 0, 0, 0]);
  });
  test('a sound wholly outside the buffer changes nothing', () => {
    const dst = new Float32Array(4 * CH);
    mixInto(dst, new Float32Array(4).fill(1), 10);
    mixInto(dst, new Float32Array(4).fill(1), -10);
    assert.deepEqual([...dst], new Array(8).fill(0));
  });
  test('dbToGain', () => {
    assert.equal(dbToGain(0), 1);
    assert.ok(Math.abs(dbToGain(-6) - 0.501187) < 1e-6);
  });
});

describe('writeWav', () => {
  test('writes a 32-bit float stereo 48 kHz WAV header and data', async () => {
    const dir = tmpDir();
    try {
      const file = path.join(dir, 'a b.wav');
      const s = Float32Array.from([0, 0.5, -0.5, 1, 0.25, -1]);
      await writeWav(file, s);
      const buf = fs.readFileSync(file);
      assert.equal(buf.toString('ascii', 0, 4), 'RIFF');
      assert.equal(buf.readUInt32LE(4), buf.length - 8);
      assert.equal(buf.toString('ascii', 8, 16), 'WAVEfmt ');
      assert.equal(buf.readUInt16LE(20), 3);              // IEEE float
      assert.equal(buf.readUInt16LE(22), CH);
      assert.equal(buf.readUInt32LE(24), RATE);
      assert.equal(buf.readUInt32LE(28), RATE * CH * 4);
      assert.equal(buf.readUInt16LE(32), CH * 4);
      assert.equal(buf.readUInt16LE(34), 32);
      assert.equal(buf.toString('ascii', 36, 40), 'data');
      assert.equal(buf.readUInt32LE(40), s.length * 4);
      assert.deepEqual([...new Float32Array(buf.buffer.slice(buf.byteOffset + 44, buf.byteOffset + buf.length))], [...s]);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });

  test('ffmpeg reads it back sample for sample', { skip: !hasBinary('ffmpeg') && 'needs ffmpeg' }, async () => {
    const dir = tmpDir();
    try {
      const file = path.join(dir, 'round trip ü.wav');
      const s = new Float32Array(480 * CH);
      for (let i = 0; i < s.length; i++) s[i] = Math.sin(i / 7) * 0.5;
      await writeWav(file, s);
      const back = await decode(file);
      assert.equal(back.length, s.length);
      for (let i = 0; i < s.length; i++) assert.ok(Math.abs(back[i] - s[i]) < 1e-6, `sample ${i}`);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
});

describe('loudnormFilter', () => {
  const m = { i: -20.1, tp: -4.2, lra: 6.3, thresh: -30.5, offset: 0.4 };
  test('a linear loudnorm pass with the measured values', () => {
    const f = loudnormFilter(m);
    assert.match(f, /^loudnorm=I=-14:TP=-2:LRA=11:measured_I=-20.1:measured_TP=-4.2:measured_LRA=6.3:measured_thresh=-30.5:offset=0.4:linear=true/);
  });
  test('target LRA rises above a wide source LRA but stays within what ffmpeg accepts', () => {
    assert.match(loudnormFilter({ ...m, lra: 14.2 }), /:LRA=16:/);
    assert.match(loudnormFilter({ ...m, lra: 62 }), /:LRA=50:/);
    assert.match(loudnormFilter({ ...m, lra: NaN }), /:LRA=11:/);
  });
});
