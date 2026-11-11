// Shared test setup. Import this FIRST in every test file: it points the engine at the fixture style
// packs before engine/lib/util.mjs reads MOTUS_STYLES at import time. No engine imports here.
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

export const TESTS = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(TESTS, '..');
export const FIXTURE_STYLES = path.join(TESTS, 'fixtures', 'styles');
export const MOTUS = path.join(ROOT, 'engine', 'bin', 'motus.mjs');

process.env.MOTUS_STYLES = FIXTURE_STYLES;
delete process.env.MOTUS_EDIT;

/** A fresh temporary directory; removed by the returned cleanup. */
export function tmpDir(prefix = 'motus-test-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

/** Words from a list of strings, `step` seconds apart, each `len` long, starting at `t0`. */
export function mkWords(list, { t0 = 0.2, step = 0.3, len = 0.24 } = {}) {
  return list.map((w, i) => ({ i, w, start: +(t0 + i * step).toFixed(3), end: +(t0 + i * step + len).toFixed(3), p: 0.99 }));
}

/** The minimal fixture manifest, read from disk (a deep copy each call, so tests may mutate it). */
export function minimalManifest() {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_STYLES, 'minimal', 'style.json'), 'utf8'));
}

/** A stand-in for loadProject() for pure functions that only read json/dir. */
export function fakeProject(dir = '/tmp/motus-fake') {
  return {
    dir,
    json: { name: 'fake', mode: 'raw', source: { path: path.join(dir, 'clip.mp4') }, output: { width: 1080, height: 1920, fps: [30000, 1001] } },
    path: (...rel) => path.join(dir, ...rel),
  };
}

/** Which ffmpeg/Chrome tools exist, for skipping tests that need them. */
export function hasBinary(cmd) {
  const dirs = (process.env.PATH || '').split(path.delimiter);
  return dirs.some((d) => { try { fs.accessSync(path.join(d, cmd), fs.constants.X_OK); return true; } catch { return false; } });
}
