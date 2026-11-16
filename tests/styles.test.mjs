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

test('a manifest "order" lists that style first; the rest stay alphabetical', async () => {
  const { tmpDir } = await import('./helpers.mjs');
  const fs = await import('node:fs/promises'), path = await import('node:path');
  const dir = await tmpDir('motus-order-');
  for (const [id, name, order] of [['b-pack', 'Beta', undefined], ['a-pack', 'Alpha', undefined], ['z-pack', 'Zulu', 0]]) {
    await fs.mkdir(path.join(dir, id));
    await fs.writeFile(path.join(dir, id, 'style.json'), JSON.stringify({ id, name, version: '1', ...(order === undefined ? {} : { order }) }));
  }
  const { execFileSync } = await import('node:child_process');
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', `import('${new URL('../engine/lib/styles.mjs', import.meta.url).href}').then(async m=>console.log(JSON.stringify((await m.listStyles()).map(s=>s.id))))`], { env: { ...process.env, MOTUS_STYLES: dir } }).toString();
  assert.deepEqual(JSON.parse(out), ['z-pack', 'a-pack', 'b-pack']);
});

test('a manifest preview keeps only plain image or video file names inside the pack', async () => {
  const { tmpDir } = await import('./helpers.mjs');
  const fs = await import('node:fs/promises'), path = await import('node:path');
  const dir = tmpDir('motus-preview-');
  await fs.mkdir(path.join(dir, 'p-pack'));
  await fs.writeFile(path.join(dir, 'p-pack', 'style.json'), JSON.stringify({ id: 'p-pack', name: 'P', version: '1', preview: { video: '../escape.webm', poster: 'still.webp' } }));
  const { execFileSync } = await import('node:child_process');
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', `import('${new URL('../engine/lib/styles.mjs', import.meta.url).href}').then(async m=>console.log(JSON.stringify((await m.listStyles())[0].preview)))`], { env: { ...process.env, MOTUS_STYLES: dir } }).toString();
  assert.deepEqual(JSON.parse(out), { poster: 'still.webp' });
});
