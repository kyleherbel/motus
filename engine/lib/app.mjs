// The Motus app server: the page a user lands on after saying "go". It lists the projects in
// the workspace, takes a new video (dropped or chosen in the page), creates the project, runs
// ingest itself, then queues the planning job for the agent (`motus next`). Each project's
// review happens in that project's Studio server, which this server starts on demand.
// Local only (127.0.0.1), node:http only.
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { pipeline } from 'node:stream/promises';
import { ENGINE, readJson, writeJson, exists, mkdirp, slug, run, MotusError } from './util.mjs';
import { probe, initProject, loadProject } from './project.mjs';
import { listStyles, loadStyle } from './styles.mjs';
import { ensureStudio } from './server.mjs';
import { agentStatus, listProjects, projectSummary, patchAppState, appState, pidAlive, reveal, APP_FILE } from './workspace.mjs';

const BIN = path.join(ENGINE, 'bin', 'motus.mjs');
const VIDEO_EXT = /\.(mp4|mov|m4v|mkv|webm|avi|mts)$/i;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8' };

// Ingest log lines ("[motus] transcript 40%") in the words the page shows.
export function friendlyIngest(line) {
  const m = /^\[motus\]\s+(\S+)(?:\s+(\d+)%)?/.exec(String(line).trim());
  if (!m) return null;
  const pct = m[2] !== undefined ? ` (${m[2]}%)` : '';
  switch (m[1]) {
    case 'audio': return 'Pulling out the sound';
    case 'silences': return 'Finding the pauses';
    case 'framing': return 'Finding your face in the frame';
    case 'transcript': return `Writing down every word${pct}. The first time, this also downloads a 1.6 GB speech model`;
    case 'sheets': return 'Looking at the picture';
    default: return null;
  }
}

function send(res, code, body, headers = {}) {
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
  res.writeHead(code, { 'content-type': typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8', 'content-length': buf.length, 'cache-control': 'no-store', ...headers });
  res.end(buf);
}

async function sendFile(res, root, rel) {
  const file = path.resolve(root, '.' + path.posix.normalize('/' + rel));
  if (file !== root && !file.startsWith(root + path.sep)) return send(res, 403, 'forbidden');
  let st;
  try { st = await fs.stat(file); } catch { return send(res, 404, 'not found'); }
  if (st.isDirectory()) return send(res, 404, 'not found');
  res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'content-length': st.size, 'cache-control': 'no-store' });
  fss.createReadStream(file).pipe(res);
}

const readBody = (req) => new Promise((resolve, reject) => {
  let s = '';
  req.on('data', (c) => { s += c; if (s.length > 1e5) { reject(new MotusError('Request too large')); req.destroy(); } });
  req.on('end', () => { try { resolve(s ? JSON.parse(s) : {}); } catch { reject(new MotusError('Body is not valid JSON')); } });
  req.on('error', reject);
});

/** A file name that is safe on every system and keeps its extension. */
export function safeName(name) {
  const base = path.basename(String(name || 'video.mp4'));
  const ext = path.extname(base).toLowerCase().replace(/[^.a-z0-9]/g, '') || '.mp4';
  const stem = path.basename(base, path.extname(base)).replace(/[^\p{L}\p{N} ._-]/gu, '').trim().slice(0, 80) || 'video';
  return stem + ext;
}

/**
 * opt.runIngest(projectDir, prompt) -> child-like { pid, onLine(fn), done: Promise<{code, stdout}> }
 * is injectable so tests can create projects without transcribing.
 */
export async function createAppServer(ws, { port = 0, host = '127.0.0.1', runIngest = spawnIngest } = {}) {
  ws = path.resolve(ws);
  await mkdirp(ws);
  const uploads = path.join(ws, '.uploads');
  let lastActivity = Date.now();
  const styleCache = new Map();

  async function styles() {
    const out = [];
    for (const s of await listStyles()) {
      if (s.status === 'broken') continue;
      if (!styleCache.has(s.id)) {
        let wide = false;
        try { wide = !!(await loadStyle(s.id)).manifest.footage?.wide; } catch { /* listed, not loadable */ }
        styleCache.set(s.id, wide);
      }
      out.push({ id: s.id, name: s.name, version: s.version, summary: s.summary, bestFor: s.bestFor, status: s.status, wide: styleCache.get(s.id) });
    }
    return out;
  }

  async function state() {
    const agent = await agentStatus(ws);
    const projects = [];
    for (const dir of await listProjects(ws)) {
      try { projects.push(await projectSummary(dir, agent)); } catch (e) { projects.push({ id: path.basename(dir), dir, name: path.basename(dir), stage: 'error', error: { message: e.message, fix: e.fix || '' } }); }
    }
    return { workspace: ws, agent, styles: await styles(), projects: projects.reverse() };
  }

  const projectDir = (id) => {
    if (typeof id !== 'string' || !id || id.startsWith('.') || id.includes('/') || id.includes('\\')) throw new MotusError('That project does not exist.');
    return path.join(ws, id);
  };

  // ---------------------------------------------------------------- ingest, run by the app

  async function startIngest(p, prompt = '') {
    const child = runIngest(p.dir, prompt);
    await patchAppState(p, (a) => { a.ingest = { state: 'running', pid: child.pid, activity: 'Starting', started: new Date().toISOString() }; delete a.job; });
    let last = '';
    child.onLine(async (line) => {
      const text = friendlyIngest(line);
      if (!text || text === last) return;
      last = text;
      await patchAppState(p, (a) => { if (a.ingest?.state === 'running') a.ingest.activity = text; }).catch(() => {});
    });
    child.done.then(async ({ code, stdout }) => {
      if (code === 0) {
        await patchAppState(p, (a) => { a.ingest = { state: 'done', ended: new Date().toISOString() }; a.job = { kind: 'plan', state: 'queued', queued: new Date().toISOString(), prompt }; });
      } else {
        let err = {};
        try { err = JSON.parse(stdout); } catch { /* not JSON */ }
        await patchAppState(p, (a) => { a.ingest = { state: 'error', error: err.error || `Listening stopped (exit code ${code}).`, fix: err.fix || 'Press Try again.', ended: new Date().toISOString() }; });
      }
    }).catch(() => { /* the project folder was removed meanwhile */ });
  }

  // ---------------------------------------------------------------- requests

  async function upload(req, url) {
    await mkdirp(uploads);
    const name = safeName(url.searchParams.get('name'));
    if (!VIDEO_EXT.test(name)) throw new MotusError(`${name} does not look like a video file.`, 'Choose an MP4, MOV, MKV or WebM file.');
    const id = crypto.randomBytes(8).toString('hex');
    const dir = path.join(uploads, id);
    await mkdirp(dir);
    const file = path.join(dir, name);
    try {
      await pipeline(req, fss.createWriteStream(file));
      const info = await probe(file);
      if (!info.hasAudio) throw new MotusError(`${name} has no sound.`, 'Motus edits by what is said: choose a video with its sound.');
      return { upload: id, name, probe: { width: info.width, height: info.height, duration: info.duration, aspect: info.aspect, bytes: info.bytes } };
    } catch (e) {
      await fs.rm(dir, { recursive: true, force: true });
      throw e;
    }
  }

  async function create(body) {
    const id = String(body.upload || '');
    if (!/^[0-9a-f]{16}$/.test(id)) throw new MotusError('That upload is gone.', 'Drop the video again.');
    const dir = path.join(uploads, id);
    const files = await fs.readdir(dir).catch(() => []);
    if (!files.length) throw new MotusError('That upload is gone.', 'Drop the video again.');
    const name = files[0];
    const mode = body.mode === 'locked' ? 'locked' : 'raw';
    await loadStyle(body.style);
    let base = slug(path.basename(name, path.extname(name))), pdir = path.join(ws, base);
    for (let i = 2; await exists(pdir); i++) pdir = path.join(ws, `${base}-${i}`);
    await mkdirp(path.join(pdir, 'source'));
    const video = path.join(pdir, 'source', name);
    await fs.rename(path.join(dir, name), video);
    await fs.rm(dir, { recursive: true, force: true });
    const p = await initProject({ video, style: body.style, mode, dir: pdir });
    await startIngest(p, String(body.prompt || '').slice(0, 400));
    return projectSummary(p.dir, await agentStatus(ws));
  }

  async function retry(body) {
    const p = await loadProject(projectDir(body.project));
    const a = await appState(p);
    if (a.ingest?.state === 'error' || (a.ingest?.state === 'running' && !pidAlive(a.ingest.pid)) || !p.done('ingest')) {
      await startIngest(p, a.job?.prompt || '');
    } else if (a.job && (a.job.state === 'failed' || a.job.state === 'done')) {
      await patchAppState(p, (x) => { x.job = { kind: x.job.kind, n: x.job.n, prompt: x.job.prompt, state: 'queued', queued: new Date().toISOString() }; });
    } else if (!(await exists(p.path('plan', 'edit.json')))) {
      await patchAppState(p, (x) => { x.job = { kind: 'plan', state: 'queued', queued: new Date().toISOString(), prompt: x.job?.prompt || '' }; });
    }
    return projectSummary(p.dir, await agentStatus(ws));
  }

  async function thumb(res, id) {
    const p = await loadProject(projectDir(id));
    const out = p.path('review', 'app-thumb.jpg');
    if (!(await exists(out))) {
      const t = Math.min(2, (p.json.source.duration || 1) / 3);
      await run('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', p.json.source.path, '-frames:v', '1', '-vf', 'scale=480:-2', '-q:v', '4', out]).catch(() => null);
    }
    if (!(await exists(out))) return send(res, 404, 'no still');
    return sendFile(res, path.dirname(out), path.basename(out));
  }

  const server = http.createServer(async (req, res) => {
    lastActivity = Date.now();
    const own = new Set(['localhost', '127.0.0.1', '[::1]'].map((n) => `${n}:${server.address().port}`));
    if (!own.has(String(req.headers.host || '').toLowerCase())) return send(res, 403, 'forbidden host');
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // writes need a header a cross-site page cannot send without a preflight this server never approves
      const origin = req.headers.origin;
      if (req.headers['x-motus'] !== '1' || (origin && ![...own].some((h) => origin.toLowerCase() === `http://${h}`))) return send(res, 403, 'forbidden');
    }
    let url, p;
    try { url = new URL(req.url, 'http://x'); p = decodeURIComponent(url.pathname); } catch { return send(res, 400, 'bad request'); }
    try {
      if (p === '/api/ping') return send(res, 200, { ok: true, app: true, workspace: ws });
      if (p === '/api/state' && req.method === 'GET') return send(res, 200, await state());
      if (p === '/api/upload' && req.method === 'PUT') return send(res, 200, await upload(req, url));
      if (p === '/api/upload' && req.method === 'DELETE') {
        const id = url.searchParams.get('id') || '';
        if (/^[0-9a-f]{16}$/.test(id)) await fs.rm(path.join(uploads, id), { recursive: true, force: true });
        return send(res, 200, { ok: true });
      }
      if (p === '/api/projects' && req.method === 'POST') return send(res, 200, await create(await readBody(req)));
      if (p === '/api/retry' && req.method === 'POST') return send(res, 200, await retry(await readBody(req)));
      if (p === '/api/open' && req.method === 'POST') {
        const proj = await loadProject(projectDir((await readBody(req)).project));
        const s = await ensureStudio(proj);
        return send(res, 200, { url: s.url });
      }
      if (p === '/api/reveal' && req.method === 'POST') {
        const proj = await loadProject(projectDir((await readBody(req)).project));
        const final = proj.path('renders', 'final.mp4');
        reveal((await exists(final)) ? final : proj.dir);
        return send(res, 200, { ok: true });
      }
      if (p === '/api/thumb' && req.method === 'GET') return thumb(res, url.searchParams.get('project'));
      if (p === '/' || p === '/index.html') return sendFile(res, path.join(ENGINE, 'app'), 'index.html');
      if (p.startsWith('/app/')) return sendFile(res, path.join(ENGINE, 'app'), p.slice(5));
      if (p.startsWith('/assets/')) return sendFile(res, path.join(ENGINE, 'assets'), p.slice(8));
      return send(res, 404, 'not found');
    } catch (e) {
      const code = e instanceof MotusError ? 400 : 500;
      if (!res.headersSent) send(res, code, { error: e.message, fix: e.fix || '' });
      else res.end();
    }
  });
  server.requestTimeout = 0;                    // uploads of long takes can take a while

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  }).catch(async (e) => {
    if (e.code !== 'EADDRINUSE' || !port) throw e;
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, host, resolve); });   // the usual port is taken: any free one
  });
  const actual = server.address().port;
  return {
    server, port: actual, url: `http://localhost:${actual}/`, workspace: ws,
    idleFor: () => Date.now() - lastActivity,
    close: () => new Promise((r) => server.close(r)),
  };
}

/** Run `motus ingest` as a child process and report its log lines. */
export function spawnIngest(dir, prompt) {
  const args = [BIN, 'ingest', dir, '--json', ...(prompt ? ['--prompt', prompt] : [])];
  const child = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '', buf = '';
  const listeners = [];
  child.stdout.on('data', (d) => { stdout += d; });
  child.stderr.on('data', (d) => {
    buf += d;
    let i;
    while ((i = buf.indexOf('\n')) >= 0) { const line = buf.slice(0, i); buf = buf.slice(i + 1); for (const fn of listeners) fn(line); }
  });
  return {
    pid: child.pid,
    onLine: (fn) => listeners.push(fn),
    done: new Promise((resolve) => { child.on('close', (code) => resolve({ code, stdout })); child.on('error', (e) => resolve({ code: 1, stdout: JSON.stringify({ error: e.message }) })); }),
  };
}

export async function writeAppInfo(ws, s) {
  await writeJson(path.join(ws, APP_FILE), { url: s.url, port: s.port, pid: process.pid, started: new Date().toISOString() });
}
