import { FIXTURE_STYLES } from './helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { listStyles, loadStyle } from '../engine/lib/styles.mjs';
import { MotusError } from '../engine/lib/util.mjs';

test('listStyles discovers the fixture pack', async () => {
  const list = await listStyles();
  const m = list.find((s) => s.id === 'minimal');
  assert.ok(m, 'minimal fixture style is listed');
  assert.equal(m.dir, path.join(FIXTURE_STYLES, 'minimal'));
  assert.equal(m.version, '0.0.1');
  assert.deepEqual(m.bestFor, ['engine tests']);
});

test('loadStyle returns the manifest', async () => {
  const s = await loadStyle('minimal');
  assert.equal(s.manifest.id, 'minimal');
  assert.ok(s.manifest.layouts.split);
});

test('loadStyle rejects unknown, missing and path-like ids with a fix', async () => {
  await assert.rejects(loadStyle('nope'), (e) => e instanceof MotusError && /Unknown style/.test(e.message) && /minimal/.test(e.fix));
  await assert.rejects(loadStyle(undefined), (e) => e instanceof MotusError && /No style chosen/.test(e.message) && /--style/.test(e.fix));
  await assert.rejects(loadStyle(null), MotusError);
  await assert.rejects(loadStyle('../styles/minimal'), (e) => e instanceof MotusError && /not a style id/.test(e.message));
});
