import { tmpDir } from './helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { Browser } from '../engine/lib/cdp.mjs';
import { MotusError } from '../engine/lib/util.mjs';

// A "browser" that dies at once: launch must fail with a fix, and leave no profile folder behind.
test('a browser that exits during start is a MotusError and its profile is removed', { skip: process.platform === 'win32' && 'POSIX shell script' }, async () => {
  const dir = tmpDir();
  const saved = { chrome: process.env.MOTUS_CHROME, tmp: process.env.TMPDIR };
  try {
    const fake = path.join(dir, 'fake chrome');
    fs.writeFileSync(fake, '#!/bin/sh\necho "no display" >&2\nexit 3\n', { mode: 0o755 });
    const profiles = path.join(dir, 'tmp');
    fs.mkdirSync(profiles);
    process.env.MOTUS_CHROME = fake;
    process.env.TMPDIR = profiles;                         // os.tmpdir() reads it on every call
    await assert.rejects(Browser.launch(), (e) => e instanceof MotusError && /exited during start \(code 3\)/.test(e.message) && /no display/.test(e.message) && !!e.fix);
    assert.deepEqual(fs.readdirSync(profiles), []);
    // the exit/signal handlers are removed again once no browser is alive
    assert.equal(process.listeners('SIGTERM').filter((f) => f.name === 'exitOnSignal').length, 0);
    assert.equal(process.listeners('exit').filter((f) => f.name === 'runExitHooks').length, 0);
  } finally {
    if (saved.chrome === undefined) delete process.env.MOTUS_CHROME; else process.env.MOTUS_CHROME = saved.chrome;
    if (saved.tmp === undefined) delete process.env.TMPDIR; else process.env.TMPDIR = saved.tmp;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
