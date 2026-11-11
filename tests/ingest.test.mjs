import { mkWords } from './helpers.mjs';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { suggestCuts, snapWordsToSpeech, findRetakes, chooseCrop, parseSilences, suppliedWords } from '../engine/lib/ingest.mjs';
import { MotusError } from '../engine/lib/util.mjs';

const sil = (start, end) => ({ start, end, dur: +(end - start).toFixed(3) });

describe('suggestCuts', () => {
  test('trims head and tail silence, tightens long pauses, keeps short ones', () => {
    const keep = suggestCuts([sil(0, 0.8), sil(2.0, 2.2), sil(3.0, 4.0), sil(6.0, 7.0)], 7.0);
    // head cut to 0.8-0.07, the 0.2 s pause stays, the 1 s pause keeps 70 ms handles, the tail goes
    assert.deepEqual(keep, [{ in: 0.73, out: 3.07 }, { in: 3.93, out: 6.07 }]);
  });

  test('no silences: keep everything', () => {
    assert.deepEqual(suggestCuts([], 5), [{ in: 0, out: 5 }]);
  });

  test('a file that is silence end to end keeps everything instead of nothing', () => {
    assert.deepEqual(suggestCuts([sil(0, 4)], 4), [{ in: 0, out: 4 }]);
  });

  test('ranges are ordered, non-overlapping and inside the source', () => {
    const silences = [sil(0, 0.3), sil(1, 1.5), sil(1.9, 2.6), sil(3.1, 3.5), sil(9.6, 10)];
    const keep = suggestCuts(silences, 10, { maxPause: 0.3, handle: 0.05 });
    for (let k = 0; k < keep.length; k++) {
      assert.ok(keep[k].out > keep[k].in);
      assert.ok(keep[k].in >= 0 && keep[k].out <= 10);
      if (k) assert.ok(keep[k].in >= keep[k - 1].out);
    }
  });

  test('a speech fragment shorter than minKeep between two long pauses is dropped', () => {
    assert.deepEqual(suggestCuts([sil(1, 2), sil(2.1, 3)], 4), [{ in: 0, out: 1.07 }, { in: 2.93, out: 4 }]);
  });
});

describe('snapWordsToSpeech', () => {
  test('a word starting in silence starts when the sound starts', () => {
    const [w] = snapWordsToSpeech([{ w: 'hi', start: 1.0, end: 1.9 }], [sil(0.8, 1.5)]);
    assert.deepEqual([w.start, w.end], [1.5, 1.9]);
  });
  test('a word ending in silence ends when the sound stops', () => {
    const [w] = snapWordsToSpeech([{ w: 'hi', start: 1.0, end: 1.9 }], [sil(1.4, 2.5)]);
    assert.deepEqual([w.start, w.end], [1.0, 1.4]);
  });
  test('a word wholly inside a silence moves to the nearer edge, keeping its length up to 0.3 s', () => {
    const [a] = snapWordsToSpeech([{ w: 'a', start: 1.1, end: 1.2 }], [sil(1.0, 3.0)]);
    assert.deepEqual([a.start, a.end], [0.9, 1.0]);
    const [b] = snapWordsToSpeech([{ w: 'b', start: 2.5, end: 2.95 }], [sil(1.0, 3.0)]);
    assert.deepEqual([b.start, b.end], [3.0, 3.3]);
  });
  test('short silences (under 0.15 s) are ignored', () => {
    const [w] = snapWordsToSpeech([{ w: 'x', start: 1.0, end: 1.5 }], [sil(0.95, 1.05)]);
    assert.deepEqual([w.start, w.end], [1.0, 1.5]);
  });
  test('words stay ordered, non-overlapping and at least minimum length', () => {
    const words = [{ w: 'a', start: 1.0, end: 1.6 }, { w: 'b', start: 1.0, end: 1.3 }, { w: 'c', start: 1.2, end: 1.2 }, { w: 'd', start: 0, end: 0.1 }];
    snapWordsToSpeech(words, [sil(0, 0.5)]);
    for (let k = 0; k < words.length; k++) {
      assert.ok(words[k].end > words[k].start, `word ${k} has length`);
      if (k) assert.ok(words[k].start >= words[k - 1].end - 1e-9, `word ${k} starts after word ${k - 1} ends`);
      assert.equal(words[k].start, +words[k].start.toFixed(3));
      assert.equal(words[k].end, +words[k].end.toFixed(3));
    }
  });
  test('no words, no silences', () => {
    assert.deepEqual(snapWordsToSpeech([], [sil(0, 1)]), []);
    assert.deepEqual(snapWordsToSpeech([{ w: 'a', start: 0.5, end: 0.8 }], []), [{ w: 'a', start: 0.5, end: 0.8 }]);
  });
});

describe('findRetakes', () => {
  test('a repeated phrase marks the first attempt as a false start', () => {
    const words = mkWords('so the thing is the so the thing is great'.split(' '));
    const r = findRetakes(words).filter((x) => x.kind === 'retake');
    assert.equal(r.length, 1);
    assert.deepEqual(r[0].drop, [0, 4]);
    assert.equal(r[0].keepFrom, 5);
    assert.equal(r[0].text, 'so the thing is the');
    assert.equal(r[0].repeats, 'so the thing is');
    assert.equal(r[0].start, words[0].start);
    assert.equal(r[0].end, words[5].start);
  });
  test('fillers and stutters, case and punctuation insensitive', () => {
    const words = mkWords(['Um,', 'the', 'The', 'plan', 'is', 'uh', 'simple.']);
    const r = findRetakes(words);
    assert.deepEqual(r.map((x) => [x.kind, x.drop]), [['filler', [0, 0]], ['stutter', [1, 1]], ['filler', [5, 5]]]);
    for (let k = 1; k < r.length; k++) assert.ok(r[k].start >= r[k - 1].start);
  });
  test('two-word repeats are not retakes; empty and single-word transcripts are fine', () => {
    assert.equal(findRetakes(mkWords('of the best of the rest'.split(' '))).filter((x) => x.kind === 'retake').length, 0);
    assert.deepEqual(findRetakes([]), []);
    assert.deepEqual(findRetakes(mkWords(['hello'])), []);
  });
});

describe('chooseCrop', () => {
  test('9:16 sources need no crop', () => {
    assert.equal(chooseCrop({ width: 1080, height: 1920, aspect: 1080 / 1920 }), null);
  });
  test('horizontal 4K: a full-height 9:16 window, centred, even sizes', () => {
    const c = chooseCrop({ width: 3840, height: 2160, aspect: 16 / 9 });
    assert.deepEqual(c, { x: 1312, y: 0, w: 1216, h: 2160 });
  });
  test('the window follows the face and stays inside the frame', () => {
    const src = { width: 1920, height: 1080, aspect: 16 / 9 };
    assert.equal(chooseCrop(src, { median: { cx: 0.25, eyeY: 0.4 } }).x, 176);
    const edge = chooseCrop(src, { median: { cx: 0.99, eyeY: 0.4 } });
    assert.equal(edge.x + edge.w, 1920);
    assert.equal(chooseCrop(src, { median: { cx: 0.01, eyeY: 0.4 } }).x, 0);
  });
  test('taller than 9:16: a full-width window', () => {
    const c = chooseCrop({ width: 1080, height: 2400, aspect: 1080 / 2400 });
    assert.deepEqual([c.w, c.h, c.x], [1080, 1920, 0]);
    assert.equal(c.y % 2, 0);
  });
});

describe('parseSilences', () => {
  test('reads silencedetect lines, including %g exponents and an unclosed trailing silence', () => {
    const log = [
      '[silencedetect @ 0x1] silence_start: 2.08333e-05',
      '[silencedetect @ 0x1] silence_end: 0.5 | silence_duration: 0.49998',
      'frame=  10 fps=0.0',
      '[silencedetect @ 0x1] silence_start: 1.25',
      '[silencedetect @ 0x1] silence_end: 1.75 | silence_duration: 0.5',
      '[silencedetect @ 0x1] silence_start: 3.5',
    ].join('\n');
    assert.deepEqual(parseSilences(log, 4), [sil(0, 0.5), sil(1.25, 1.75), sil(3.5, 4)]);
    assert.deepEqual(parseSilences(log), [sil(0, 0.5), sil(1.25, 1.75)]);
    assert.deepEqual(parseSilences('', 4), []);
  });
});

describe('suppliedWords', () => {
  test('accepts w/word/text, sorts by time and re-indexes', () => {
    const w = suppliedWords({ words: [{ word: ' two ', start: 1, end: 1.2, probability: 0.5 }, { w: 'one', start: 0.2, end: 0.5 }, { text: '', start: 2, end: 2.1 }] });
    assert.deepEqual(w, [{ i: 0, w: 'one', start: 0.2, end: 0.5, p: 1 }, { i: 1, w: 'two', start: 1, end: 1.2, p: 0.5 }]);
  });
  test('zero words is a valid (speechless) transcript', () => {
    assert.deepEqual(suppliedWords({ words: [] }), []);
  });
  test('missing timings or a missing words list are errors with a fix', () => {
    assert.throws(() => suppliedWords({ words: [{ w: 'a', start: 'x', end: 1 }] }, 't.json'), (e) => e instanceof MotusError && /word 0 \("a"\)/.test(e.message) && /start/.test(e.fix));
    assert.throws(() => suppliedWords({ text: 'hello' }), (e) => e instanceof MotusError && /words/.test(e.fix));
    assert.throws(() => suppliedWords({ words: [{ w: 'a', start: -1, end: 1 }] }), MotusError);
  });
});
