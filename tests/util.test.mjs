import { TESTS, ROOT, tmpDir } from './helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { parseArgs, parseRational, fpsOf, standardRate, clock, slug, readJson, writeJson, run, MotusError, STYLES, chromeCandidates, pythonCandidates, findPython } from '../engine/lib/util.mjs';
import { installHints } from '../engine/lib/doctor.mjs';

test('MOTUS_STYLES points the engine at the fixture styles', () => {
  assert.equal(STYLES, path.join(TESTS, 'fixtures', 'styles'));
});

test('parseArgs: positionals, values, =, --no-, booleans, --', () => {
  assert.deepEqual(parseArgs(['proj', '--draft', '--range', '0,2', '--out=a b.mp4', '--no-matte']),
    { pos: ['proj'], flags: { draft: true, range: '0,2', out: 'a b.mp4', matte: false } });
  // without knowing --json is boolean, it would swallow the project path
  assert.deepEqual(parseArgs(['--json', './my project']), { pos: [], flags: { json: './my project' } });
  assert.deepEqual(parseArgs(['--json', './my project'], { booleans: ['json'] }), { pos: ['./my project'], flags: { json: true } });
  // a negative number is a value, not a flag
  assert.deepEqual(parseArgs(['--at', '-1']).flags, { at: '-1' });
  // trailing flag, and everything after -- is positional
  assert.deepEqual(parseArgs(['a', '--quiet']), { pos: ['a'], flags: { quiet: true } });
  assert.deepEqual(parseArgs(['--', '--weird-name.mp4']), { pos: ['--weird-name.mp4'], flags: {} });
});

test('parseRational / fpsOf keep rational rates exact', () => {
  assert.deepEqual(parseRational('30000/1001'), [30000, 1001]);
  assert.deepEqual(parseRational('25'), [25, 1]);
  assert.ok(Math.abs(fpsOf([30000, 1001]) - 29.97002997) < 1e-8);
});

test('standardRate keeps broadcast rates and snaps variable-frame-rate averages', () => {
  assert.deepEqual(standardRate([30000, 1001]), [30000, 1001]);
  assert.deepEqual(standardRate([25, 1]), [25, 1]);
  assert.deepEqual(standardRate([120, 1]), [120, 1]);
  assert.deepEqual(standardRate([1800000, 60059]), [30000, 1001]);   // iPhone VFR average 29.971
  assert.deepEqual(standardRate([2997, 100]), [30000, 1001]);
  assert.deepEqual(standardRate([600, 20]), [30, 1]);
  assert.deepEqual(standardRate([0, 0]), [30, 1]);
  assert.deepEqual(standardRate([1000, 7]), [143, 1]);                // nothing standard nearby: whole fps
});

test('clock rounds before splitting minutes', () => {
  assert.equal(clock(83.4567), '1:23.46');
  assert.equal(clock(59.999), '1:00.00');
  assert.equal(clock(0), '0:00.00');
  assert.equal(clock(5, 0), '0:05');
});

test('slug handles unicode, punctuation and empty names', () => {
  assert.equal(slug('Café vidéo #1 (final)'), 'cafe-video-1-final');
  assert.equal(slug('日本語'), 'video');
  assert.equal(slug('a'.repeat(100)).length, 60);
  // names Windows reserves for devices never become a folder name
  assert.equal(slug('CON'), 'con-video');
  assert.equal(slug('com1'), 'com1-video');
  assert.equal(slug('console'), 'console');
});

test('chromeCandidates: Windows looks in Program Files and per-user LocalAppData, Chrome before Edge', () => {
  const env = { PROGRAMFILES: 'C:\\Program Files', 'PROGRAMFILES(X86)': 'C:\\Program Files (x86)', LOCALAPPDATA: 'C:\\Users\\Kim\\AppData\\Local' };
  const win = chromeCandidates('win32', env);
  assert.equal(win[0], 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');
  assert.ok(win.includes('C:\\Users\\Kim\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'));
  assert.ok(win.includes('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'));
  assert.ok(win.findIndex((p) => p.endsWith('chrome.exe')) < win.findIndex((p) => p.endsWith('msedge.exe')));
  assert.ok(chromeCandidates('win32', {}).every((p) => /^C:\\Program Files/.test(p)));   // no LocalAppData: defaults only
  assert.match(chromeCandidates('darwin')[0], /^\/Applications\/Google Chrome\.app/);
  assert.ok(chromeCandidates('linux').includes('/usr/bin/chromium'));
});

test('pythonCandidates: the py launcher first on Windows, python3 elsewhere, MOTUS_PYTHON alone and unsplit', () => {
  assert.deepEqual(pythonCandidates('win32', {}).map((c) => [c.cmd, ...c.args].join(' ')), ['py -3', 'py -3.13', 'py -3.12', 'py -3.11', 'py -3.10', 'python', 'python3']);
  assert.deepEqual(pythonCandidates('darwin', {}).map((c) => c.cmd), ['python3', 'python3.13', 'python3.12', 'python3.11', 'python3.10', 'python']);
  assert.deepEqual(pythonCandidates('win32', { MOTUS_PYTHON: 'C:\\Program Files\\Python312\\python.exe' }), [{ cmd: 'C:\\Program Files\\Python312\\python.exe', args: [] }]);
});

test('findPython reports a version and a label to type', { skip: !['python3', 'python', 'py'].some((c) => spawnSync(c, ['--version']).status === 0) && 'no Python on this machine' }, async () => {
  const py = await findPython();
  assert.match(py.version, /^3\./);
  assert.ok(py.label.length > 0);
  assert.equal(typeof py.whisper, 'boolean');
});

test('installHints name each system\'s installer', () => {
  assert.match(installHints('win32').ffmpeg, /winget install Gyan\.FFmpeg/);
  assert.match(installHints('win32').python, /winget install Python\.Python/);
  assert.match(installHints('darwin').ffmpeg, /brew install ffmpeg/);
  assert.match(installHints('linux').ffmpeg, /apt install ffmpeg/);
});

test('readJson / writeJson: atomic write, fallback, error with fix', async () => {
  const dir = tmpDir();
  try {
    const p = path.join(dir, 'sub dir ü', 'x.json');
    await Promise.all([writeJson(p, { a: 1 }), writeJson(p, { a: 2 })]);     // same millisecond, no tmp collision
    assert.ok([1, 2].includes((await readJson(p)).a));
    assert.deepEqual(fs.readdirSync(path.dirname(p)), ['x.json']);          // no tmp files left
    assert.equal(await readJson(path.join(dir, 'missing.json'), 'fb'), 'fb');
    fs.writeFileSync(path.join(dir, 'bad.json'), '{ "a": ');
    await assert.rejects(readJson(path.join(dir, 'bad.json')), (e) => e instanceof MotusError && /not valid JSON/.test(e.message) && !!e.fix);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('run: missing program and failing program give MotusErrors with a fix', async () => {
  await assert.rejects(run('motus-no-such-program-xyz'), (e) => e instanceof MotusError && /Install/.test(e.fix));
  await assert.rejects(run(process.execPath, ['-e', 'process.stderr.write("boom\\n"); process.exit(3)']), (e) => e instanceof MotusError && /code 3/.test(e.message) && /boom/.test(e.message) && !!e.fix);
  const r = await run(process.execPath, ['-e', 'process.exit(2)'], { ok: [0, 2] });
  assert.equal(r.code, 2);
  const lines = [];
  await run(process.execPath, ['-e', 'console.log("a\\nb"); console.error("c")'], { onLine: (l, s) => lines.push(`${s}:${l}`) });
  assert.deepEqual(lines.sort(), ['stderr:c', 'stdout:a', 'stdout:b']);
});

test('onExit: hooks run on SIGTERM (exit 143), removed hooks do not, no hooks keeps the default', { skip: process.platform === 'win32' && 'POSIX signals' }, () => {
  const dir = tmpDir();
  try {
    const util = JSON.stringify(pathToFileURL(path.join(ROOT, 'engine', 'lib', 'util.mjs')).href);
    const file = (n) => JSON.stringify(path.join(dir, n));
    const script = (body) => spawnSync(process.execPath, ['--input-type=module', '-e', `import { onExit } from ${util}; import fs from 'node:fs'; ${body} setTimeout(() => {}, 5000); process.kill(process.pid, 'SIGTERM');`], { encoding: 'utf8' });
    const r = script(`const off = onExit(() => fs.writeFileSync(${file('removed')}, 'x')); onExit(() => fs.writeFileSync(${file('ran')}, 'x')); off();`);
    assert.equal(r.status, 143, r.stderr);
    assert.ok(fs.existsSync(path.join(dir, 'ran')));
    assert.ok(!fs.existsSync(path.join(dir, 'removed')));
    const d = script(`const off = onExit(() => {}); off();`);
    assert.equal(d.signal, 'SIGTERM');                       // handlers removed: the process dies of the signal as usual
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
