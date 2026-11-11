import './helpers.mjs';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { frameRanges, outputMap, retimeWords, sourceFrames } from '../engine/lib/conform.mjs';
import { MotusError } from '../engine/lib/util.mjs';

const NTSC = 30000 / 1001;

describe('sourceFrames', () => {
  test('whole frames without float loss at rational rates', () => {
    assert.equal(sourceFrames(4.004, NTSC), 120);            // 4.004 * 29.97002997 = 119.99999...
    assert.equal(sourceFrames((1001 * 1798) / 30000, NTSC), 1798);
    assert.equal(sourceFrames(4.02, 30), 120);
    assert.equal(sourceFrames(0, 30), 0);
  });
});

describe('frameRanges', () => {
  test('seconds snap to the nearest frame at 30000/1001; out is exclusive', () => {
    assert.deepEqual(frameRanges([{ in: 0.5, out: 2.0 }], NTSC, 300), [{ a: 15, b: 60 }]);
    assert.deepEqual(frameRanges([{ in: 0, out: 10.01 }], NTSC, 300), [{ a: 0, b: 300 }]);
  });
  test('touching ranges merge, ranges past the end clamp, tiny ranges drop', () => {
    assert.deepEqual(frameRanges([{ in: 0, out: 1 }, { in: 1, out: 2 }], 30, 300), [{ a: 0, b: 60 }]);
    assert.deepEqual(frameRanges([{ in: 9, out: 99 }], 30, 300), [{ a: 270, b: 300 }]);
    assert.deepEqual(frameRanges([{ in: 0, out: 1 }, { in: 1.5, out: 1.52 }, { in: 2, out: 3 }], 30, 300), [{ a: 0, b: 30 }, { a: 60, b: 90 }]);
  });
  test('overlaps, reversed ranges, bad shapes and keeping nothing are errors with a fix', () => {
    const bad = (cuts, re) => assert.throws(() => frameRanges(cuts, 30, 300), (e) => e instanceof MotusError && re.test(e.message) && !!e.fix);
    bad([{ in: 0, out: 2 }, { in: 1, out: 3 }], /starts before the previous range ends/);
    bad([{ in: 3, out: 1 }], /ends .* before it starts/);
    bad([{ start: 0, end: 1 }], /must be \{"in"/);
    bad([{ in: '0', out: 1 }], /must be \{"in"/);
    bad([], /non-empty/);
    bad({ in: 0, out: 1 }, /non-empty/);
    bad([{ in: 20, out: 30 }], /keep nothing/);
    bad([{ in: 1, out: 1.03 }], /keep nothing/);
  });
});

describe('outputMap and retimeWords', () => {
  // keep 1.0-2.0 s and 3.0-4.0 s of the source at 30 fps
  const map = outputMap(frameRanges([{ in: 1, out: 2 }, { in: 3, out: 4 }], 30, 300), 30);

  test('the map lays the kept ranges end to end', () => {
    assert.deepEqual(map, [
      { out: 0, in: 1, len: 1, outFrame: 0, inFrame: 30, frames: 30 },
      { out: 1, in: 3, len: 1, outFrame: 30, inFrame: 90, frames: 30 },
    ]);
  });

  test('kept words move to output time; words in removed ranges are dropped; indices are rebuilt', () => {
    const words = [
      { i: 0, w: 'gone', start: 0.2, end: 0.6, p: 1 },
      { i: 1, w: 'one', start: 1.2, end: 1.5, p: 0.9 },
      { i: 2, w: 'cut', start: 2.3, end: 2.7, p: 1 },
      { i: 3, w: 'two', start: 3.25, end: 3.5, p: 0.8 },
    ];
    assert.deepEqual(retimeWords(words, map), [
      { i: 0, w: 'one', start: 0.2, end: 0.5, p: 0.9, src: 1 },
      { i: 1, w: 'two', start: 1.25, end: 1.5, p: 0.8, src: 3 },
    ]);
  });

  test('a word across a cut belongs to the side with more of it, clipped to the range', () => {
    const [w] = retimeWords([{ i: 0, w: 'split', start: 1.9, end: 2.05, p: 1 }], map);
    assert.deepEqual([w.start, w.end], [0.9, 1]);
    const [v] = retimeWords([{ i: 0, w: 'late', start: 2.95, end: 3.2, p: 1 }], map);
    assert.deepEqual([v.start, v.end], [1, 1.2]);
  });

  test('a word mostly removed is dropped; one with 60 ms left survives', () => {
    assert.equal(retimeWords([{ i: 0, w: 'x', start: 1.97, end: 2.4, p: 1 }], map).length, 0);   // 30 ms of 430 kept
    assert.equal(retimeWords([{ i: 0, w: 'x', start: 1.93, end: 2.4, p: 1 }], map).length, 1);   // 70 ms kept
  });

  test('a zero-length word inside a kept range survives', () => {
    const out = retimeWords([{ i: 0, w: 'a', start: 1.5, end: 1.5, p: 1 }], map);
    assert.deepEqual(out, [{ i: 0, w: 'a', start: 0.5, end: 0.52, p: 1, src: 0 }]);
  });

  test('output words are ordered and never end before they start', () => {
    const words = [{ i: 0, w: 'a', start: 1.5, end: 1.9, p: 1 }, { i: 1, w: 'b', start: 1.4, end: 1.45, p: 1 }];
    const out = retimeWords(words, map);
    for (let k = 0; k < out.length; k++) {
      assert.ok(out[k].end >= out[k].start + 0.02 - 1e-9);
      if (k) assert.ok(out[k].start >= out[k - 1].start);
    }
  });

  test('no words in, no words out', () => {
    assert.deepEqual(retimeWords([], map), []);
  });
});
