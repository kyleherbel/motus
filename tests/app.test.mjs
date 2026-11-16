import { tmpDir, hasBinary } from './helpers.mjs';
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { claimJob, nextJob, say, done, agentStatus, projectSummary, listProjects, writeAgent } from '../engine/lib/workspace.mjs';
import { createAppServer, friendlyIngest, safeName } from '../engine/lib/app.mjs';
import { loadProject } from '../engine/lib/project.mjs';

/** A project folder with just enough in it for the workspace code (no video needed). */
function fakeProject(ws, name, { stages = {}, app = null, plan = false, final = false, created } = {}) {
  const dir = path.join(ws, name);
  for (const d of ['analysis', 'plan', 'review', 'renders']) fs.mkdirSync(path.join(dir, d), { recursive: true });
  fs.writeFileSync(path.join(dir, 'project.json'), JSON.stringify({
    motus: 1, name, created: created || new Date().toISOString(), style: 'minimal', mode: 'raw',
    source: { path: path.join(dir, 'take.mp4'), width: 1920, height: 1080, duration: 12, bytes: 1000 },
    output: { width: 1080, height: 1920, fps: [30, 1] }, stages, notes: [],
  }));
  if (app) fs.writeFileSync(path.join(dir, 'review', 'app.json'), JSON.stringify(app));
  if (plan) fs.writeFileSync(path.join(dir, 'plan', 'edit.json'), '{}');
  if (final) fs.writeFileSync(path.join(dir, 'renders', 'final.mp4'), '');
  return dir;
}
const readApp = (dir) => JSON.parse(fs.readFileSync(path.join(dir, 'review', 'app.json'), 'utf8'));
const ingested = { ingest: { at: '2026-11-13T10:00:00Z' } };

describe('the agent job queue', () => {
  test('a queued plan job is claimed once; asking again hands it back as resumed', async () => {
    const ws = tmpDir();
    try {
      const dir = fakeProject(ws, 'take', { stages: ingested, app: { job: { kind: 'plan', state: 'queued', prompt: 'OpenReply' } } });
      const job = await claimJob(ws);
      assert.equal(job.job, 'plan');
      assert.equal(job.project, dir);
      assert.equal(job.resumed, false);
      assert.deepEqual(job.setup, { style: 'minimal', mode: 'raw', prompt: 'OpenReply' });
      assert.ok(job.instructions.some((l) => l.includes(' done ') && l.includes(dir)));
      assert.equal(readApp(dir).job.state, 'claimed');
      // the agent came back for work without finishing: the job is still its job
      const again = await claimJob(ws);
      assert.equal(again.resumed, true);
      await done(dir, { summary: 'A 14-scene cut.' });
      assert.equal(readApp(dir).job.state, 'done');
      assert.equal(readApp(dir).job.summary, 'A 14-scene cut.');
      assert.equal(await claimJob(ws), null);
    } finally { fs.rmSync(ws, { recursive: true, force: true }); }
  });

  test('notes sent from Studio become a notes job; render submissions are skipped', async () => {
    const ws = tmpDir();
    try {
      const dir = fakeProject(ws, 'take', { stages: ingested, plan: true });
      const subs = path.join(dir, 'review', 'submissions');
      fs.mkdirSync(subs);
      fs.writeFileSync(path.join(subs, '001.json'), JSON.stringify({ n: 1, action: 'render' }));
      fs.writeFileSync(path.join(subs, '002.json'), JSON.stringify({ n: 2, action: 'notes', note: '', withNotes: ['s04'], scenes: [{ id: 's03', note: '' }, { id: 's04', say: 'hello', pick: 'a', locked: false, note: 'Move it up' }] }));
      const job = await claimJob(ws);
      assert.equal(job.job, 'notes');
      assert.deepEqual(job.notes.scenes.map((s) => s.id), ['s04']);
      assert.ok(job.instructions.some((l) => l.includes(' ack ') && l.includes('s04')));
      assert.equal(fs.readFileSync(path.join(dir, 'review', '.seen'), 'utf8'), '2');
      assert.deepEqual([readApp(dir).job.kind, readApp(dir).job.n, readApp(dir).job.state], ['notes', 2, 'claimed']);
    } finally { fs.rmSync(ws, { recursive: true, force: true }); }
  });

  test('next waits, beats the agent file, and returns idle at the timeout', async () => {
    const ws = tmpDir();
    try {
      const r = await nextJob(ws, { name: 'Claude', timeout: 0.3, poll: 50 });
      assert.equal(r.idle, true);
      const a = await agentStatus(ws);
      assert.equal(a.connected, true);
      assert.equal(a.state, 'waiting');
      assert.equal(a.name, 'Claude');
    } finally { fs.rmSync(ws, { recursive: true, force: true }); }
  });

  test('say shows progress on the project and marks the agent as working there', async () => {
    const ws = tmpDir();
    try {
      const dir = fakeProject(ws, 'take', { stages: ingested, app: { job: { kind: 'plan', state: 'queued' } } });
      await nextJob(ws, { name: 'Codex', timeout: 1, poll: 50 });
      await say(dir, 'Reading the transcript');
      const a = await agentStatus(ws);
      assert.deepEqual([a.state, a.project, a.activity, a.name], ['working', dir, 'Reading the transcript', 'Codex']);
      const s = await projectSummary(dir, a);
      assert.deepEqual([s.stage, s.activity, s.agentOnIt], ['planning', 'Reading the transcript', true]);
    } finally { fs.rmSync(ws, { recursive: true, force: true }); }
  });

  test('an agent file that went quiet reads as not connected', async () => {
    const ws = tmpDir();
    try {
      await writeAgent(ws, { state: 'waiting', name: 'Claude' });
      const file = path.join(ws, '.motus-agent.json');
      const a = JSON.parse(fs.readFileSync(file, 'utf8'));
      a.at = new Date(Date.now() - 60000).toISOString();
      fs.writeFileSync(file, JSON.stringify(a));
      assert.equal((await agentStatus(ws)).connected, false);
      assert.equal((await agentStatus(tmpDir())).connected, false);
    } finally { fs.rmSync(ws, { recursive: true, force: true }); }
  });
});

describe('project stages in the app', () => {
  test('each stage reads from what is on disk', async () => {
    const ws = tmpDir();
    try {
      const t = (n) => new Date(Date.UTC(2026, 10, 13, 10, n)).toISOString();
      const stageOf = async (dir) => (await projectSummary(dir, { connected: false })).stage;
      assert.equal(await stageOf(fakeProject(ws, 'a', { created: t(1), app: { ingest: { state: 'running', pid: process.pid } } })), 'listening');
      assert.equal(await stageOf(fakeProject(ws, 'b', { created: t(2), app: { ingest: { state: 'running', pid: 2 ** 22 + 12345 } } })), 'error');
      assert.equal(await stageOf(fakeProject(ws, 'c', { created: t(3), app: { ingest: { state: 'error', error: 'No speech found.' } } })), 'error');
      assert.equal(await stageOf(fakeProject(ws, 'd', { created: t(4), stages: ingested, app: { job: { kind: 'plan', state: 'queued' } } })), 'waiting');
      assert.equal(await stageOf(fakeProject(ws, 'e', { created: t(5), stages: ingested, app: { job: { kind: 'plan', state: 'claimed' } } })), 'planning');
      assert.equal(await stageOf(fakeProject(ws, 'f', { created: t(6), stages: ingested, plan: true, app: { job: { kind: 'plan', state: 'done' } } })), 'review');
      assert.equal(await stageOf(fakeProject(ws, 'g', { created: t(7), stages: ingested, plan: true, final: true })), 'rendered');
      assert.equal(await stageOf(fakeProject(ws, 'h', { created: t(8), stages: ingested, app: { job: { kind: 'plan', state: 'done' } } })), 'error');
      assert.deepEqual((await listProjects(ws)).map((d) => path.basename(d)), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
    } finally { fs.rmSync(ws, { recursive: true, force: true }); }
  });

  test('ingest log lines become plain words', () => {
    assert.equal(friendlyIngest('[motus] audio'), 'Pulling out the sound');
    assert.match(friendlyIngest('[motus] transcript 40%'), /^Writing down every word \(40%\)/);
    assert.equal(friendlyIngest('something else'), null);
  });

  test('uploaded file names are made safe and keep their extension', () => {
    assert.equal(safeName('../../etc/My Take #1.MOV'), 'My Take 1.mov');
    assert.equal(safeName('take'), 'take.mp4');
  });
});

describe('the app server', () => {
  const stubIngest = (dir) => ({
    pid: process.pid,
    onLine: (fn) => setTimeout(() => fn('[motus] silences'), 5),
    done: new Promise((resolve) => setTimeout(async () => { try { const p = await loadProject(dir); await p.mark('ingest', { words: 3 }); } catch { /* test already cleaned up */ } resolve({ code: 0, stdout: '{}' }); }, 60)),
  });

  test('refuses writes without its header, and lists styles and projects', async () => {
    const ws = tmpDir();
    const s = await createAppServer(ws, { port: 0, runIngest: stubIngest });
    try {
      const st = await (await fetch(`${s.url}api/state`)).json();
      assert.deepEqual(st.styles.map((x) => x.id), ['minimal']);
      assert.deepEqual(st.projects, []);
      assert.equal(st.agent.connected, false);
      const r = await fetch(`${s.url}api/projects`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
      assert.equal(r.status, 403);
      const evil = await fetch(`${s.url}api/projects`, { method: 'POST', headers: { 'x-motus': '1', origin: 'http://evil.example' }, body: '{}' });
      assert.equal(evil.status, 403);
      const home = await fetch(s.url);
      assert.match(await home.text(), /Drop a video here/);
    } finally { await s.close(); fs.rmSync(ws, { recursive: true, force: true }); }
  });

  test('serves a style card preview, and only the files a pack declares as its preview', async () => {
    const ws = tmpDir();
    const s = await createAppServer(ws, { port: 0, runIngest: stubIngest });
    try {
      const st = await (await fetch(`${s.url}api/state`)).json();
      assert.deepEqual(st.styles[0].preview, { poster: '/style-preview/minimal/preview.webp' });
      const ok = await fetch(`${s.url}style-preview/minimal/preview.webp`);
      assert.equal(ok.status, 200);
      assert.equal(ok.headers.get('content-type'), 'image/webp');
      for (const bad of ['style-preview/minimal/style.json', 'style-preview/minimal/..%2Fminimal%2Fstyle.json', 'style-preview/nope/preview.webp']) assert.equal((await fetch(`${s.url}${bad}`)).status, 404, bad);
    } finally { await s.close(); fs.rmSync(ws, { recursive: true, force: true }); }
  });

  test('a dropped video becomes a project, is ingested, and queues a plan job for the agent', { skip: !hasBinary('ffmpeg') && 'needs ffmpeg' }, async () => {
    const ws = tmpDir();
    const src = path.join(tmpDir(), 'clip.mp4');
    spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'testsrc2=size=320x180:rate=30:duration=2', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=2', '-shortest', '-c:v', 'libx264', '-c:a', 'aac', src]);
    const s = await createAppServer(ws, { port: 0, runIngest: stubIngest });
    const H = { 'x-motus': '1' };
    try {
      const bad = await fetch(`${s.url}api/upload?name=notes.txt`, { method: 'PUT', headers: H, body: 'hello' });
      assert.equal(bad.status, 400);
      const up = await (await fetch(`${s.url}api/upload?name=${encodeURIComponent('My take.mp4')}`, { method: 'PUT', headers: H, body: fs.readFileSync(src) })).json();
      assert.match(up.upload, /^[0-9a-f]{16}$/);
      assert.deepEqual([up.probe.width, up.probe.height], [320, 180]);
      const created = await (await fetch(`${s.url}api/projects`, { method: 'POST', headers: { ...H, 'content-type': 'application/json' }, body: JSON.stringify({ upload: up.upload, style: 'minimal', mode: 'locked', prompt: 'OpenReply' }) })).json();
      assert.equal(created.id, 'my-take');
      assert.equal(created.mode, 'locked');
      assert.ok(fs.existsSync(path.join(ws, 'my-take', 'source', 'My take.mp4')));
      await new Promise((r) => setTimeout(r, 150));
      const st = await (await fetch(`${s.url}api/state`)).json();
      assert.equal(st.projects[0].stage, 'waiting');
      const job = await claimJob(ws);
      assert.deepEqual([job.job, job.setup.mode, job.setup.prompt], ['plan', 'locked', 'OpenReply']);
      // a second video with the same name gets its own folder
      const up2 = await (await fetch(`${s.url}api/upload?name=${encodeURIComponent('My take.mp4')}`, { method: 'PUT', headers: H, body: fs.readFileSync(src) })).json();
      const c2 = await (await fetch(`${s.url}api/projects`, { method: 'POST', headers: { ...H, 'content-type': 'application/json' }, body: JSON.stringify({ upload: up2.upload, style: 'minimal' }) })).json();
      assert.equal(c2.id, 'my-take-2');
    } finally { await s.close(); fs.rmSync(ws, { recursive: true, force: true }); fs.rmSync(path.dirname(src), { recursive: true, force: true }); }
  });
});
