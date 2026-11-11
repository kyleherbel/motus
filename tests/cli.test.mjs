import { MOTUS, FIXTURE_STYLES, tmpDir } from './helpers.mjs';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function motus(args, env = {}) {
  const r = spawnSync(process.execPath, [MOTUS, ...args], { encoding: 'utf8', env: { ...process.env, MOTUS_STYLES: FIXTURE_STYLES, ...env }, timeout: 30000 });
  let json = null;
  try { json = JSON.parse(r.stdout); } catch { /* human output */ }
  return { code: r.status, stdout: r.stdout, stderr: r.stderr, json };
}

describe('motus CLI', () => {
  test('no command prints help', () => {
    const r = motus([]);
    assert.equal(r.code, 0);
    assert.match(r.stdout, /motus render <project>/);
  });

  test('an unknown command is a JSON error with a fix under --json', () => {
    const r = motus(['frobnicate', '--json']);
    assert.equal(r.code, 1);
    assert.deepEqual(r.json, { error: 'Unknown command "frobnicate".', fix: 'Run: motus help' });
  });

  test('styles --json lists the fixture pack', () => {
    const r = motus(['styles', '--json']);
    assert.equal(r.code, 0);
    assert.deepEqual(r.json.styles.map((s) => s.id), ['minimal']);
  });

  test('a broken style pack is listed as broken; the others still show', () => {
    const dir = tmpDir();
    try {
      fs.cpSync(path.join(FIXTURE_STYLES, 'minimal'), path.join(dir, 'minimal'), { recursive: true });
      fs.mkdirSync(path.join(dir, 'broken'));
      fs.writeFileSync(path.join(dir, 'broken', 'style.json'), '{ "id": "broken", ');
      const r = motus(['styles', '--json'], { MOTUS_STYLES: dir });
      assert.equal(r.code, 0, r.stderr);
      assert.deepEqual(r.json.styles.map((s) => [s.id, s.status]).sort(), [['broken', 'broken'], ['minimal', 'stable']]);
      assert.equal(motus(['styles'], { MOTUS_STYLES: dir }).code, 0);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });

  test('--json before the project path keeps the path (boolean flags take no value)', () => {
    const dir = tmpDir();
    try {
      const r = motus(['validate', '--json', dir]);
      assert.equal(r.code, 1);
      assert.match(r.json.error, /No Motus project at/);
      assert.ok(r.json.error.includes(dir.split(path.sep).pop()));
      assert.match(r.json.fix, /motus init/);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });

  test('missing arguments and missing files say how to fix them', () => {
    const a = motus(['init', '--json']);
    assert.equal(a.code, 1);
    assert.match(a.json.fix, /Usage: motus init <video>/);
    const dir = tmpDir();
    try {
      const b = motus(['init', path.join(dir, 'no such file.mp4'), '--json']);
      assert.equal(b.code, 1);
      assert.match(b.json.error, /No such file/);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
    const c = motus(['render', '--json']);
    assert.match(c.json.fix, /Usage: motus render <project>/);
  });
});
