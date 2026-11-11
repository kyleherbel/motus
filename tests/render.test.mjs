import './helpers.mjs';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { frameSpan, nextDraftName } from '../engine/lib/render.mjs';
import { MotusError } from '../engine/lib/util.mjs';

const TL = { fps: [30000, 1001], frames: 120, duration: (120 * 1001) / 30000 };

describe('frameSpan', () => {
  test('the whole timeline by default', () => {
    assert.deepEqual(frameSpan(undefined, TL), [0, 120]);
  });
  test('a range in seconds becomes frames [f0, f1) at 30000/1001', () => {
    assert.deepEqual(frameSpan([1, 2], TL), [30, 60]);
    assert.deepEqual(frameSpan([0, 99], TL), [0, 120]);
    assert.deepEqual(frameSpan([-1, 0.5], TL), [0, 15]);
  });
  test('bad ranges are errors with a fix, never NaN frames', () => {
    for (const r of [[2], [NaN, 1], ['a', 'b'], [2, 1], [1, 1], [9, 10], 'x']) {
      assert.throws(() => frameSpan(r, TL), (e) => e instanceof MotusError && /--range/.test(e.fix), JSON.stringify(r));
    }
  });
});

describe('nextDraftName', () => {
  test('one past the highest draft, ignoring other files', () => {
    assert.equal(nextDraftName([]), 'draft-01.mp4');
    assert.equal(nextDraftName(['final.mp4', 'draft-01.mp4', 'draft-02.mp4']), 'draft-03.mp4');
    assert.equal(nextDraftName(['draft-02.mp4']), 'draft-03.mp4');           // draft-01 deleted: never overwrite draft-02
    assert.equal(nextDraftName(['draft-99.mp4']), 'draft-100.mp4');
    assert.equal(nextDraftName(['draft-01.mp4.part', 'x-draft-05.mp4']), 'draft-01.mp4');
  });
});
