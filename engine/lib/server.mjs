// Studio server: serves the review interface, the stage, the style pack and the project,
// stores the user's decisions and runs renders. Local only (127.0.0.1), node:http only.
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import { spawn } from 'node:child_process';
import { ENGINE, STYLES, readJson, writeJson, exists, mkdirp, MotusError } from './util.mjs';
import { loadProject, listFiles } from './project.mjs';
import { loadPlan, validateEdit, resolveDoc, reviewModel, hashOf } from './plan.mjs';
import { agentStatus, APP_FILE, pidAlive, reveal } from './workspace.mjs';

const BIN = path.join(ENGINE, 'bin', 'motus.mjs');

/** The Studio server for a project: the running one, or a new detached one. Returns { url, pid }. */
export async function ensureStudio(p, { port = 0 } = {}) {
  const info = p.path('review', 'server.json');
  const alive = async () => {
    const s = await readJson(info, null).catch(() => null);
    if (!s) return null;
    try { const r = await fetch(`${s.url}api/ping`, { signal: AbortSignal.timeout(800) }); const j = await r.json(); return j.ok && j.project === p.dir ? s : null; } catch { return null; }
  };
  let s = await alive();
  if (s) return s;
  await mkdirp(p.path('review'));
  await fs.rm(info, { force: true });
  const logFile = fss.openSync(p.path('review', 'server.log'), 'a');
  const child = spawn(process.execPath, [BIN, '_serve', p.dir, '--port', String(port)], { detached: true, stdio: ['ignore', logFile, logFile], windowsHide: true });
  child.unref();
  fss.closeSync(logFile);
  for (let i = 0; i < 60 && !s; i++) { await new Promise((r) => setTimeout(r, 150)); s = await alive(); }
  if (!s) throw new MotusError('Studio did not start.', `See ${p.path('review', 'server.log')}`);
  return s;
}

/** The Motus app that made this project, if it is running: Studio links back to it. */
async function appOf(projectDir) {
  const a = await readJson(path.join(path.dirname(projectDir), APP_FILE), null).catch(() => null);
  return a && pidAlive(a.pid) ? { url: a.url } : null;
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8',
};

function send(res, code, body, headers = {}) {
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
  res.writeHead(code, { 'content-type': typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8', 'content-length': buf.length, 'cache-control': 'no-store', ...headers });
  res.end(buf);
}

async function sendFile(req, res, root, rel) {
  const file = path.resolve(root, '.' + path.posix.normalize('/' + rel));
  if (file !== root && !file.startsWith(root + path.sep)) return send(res, 403, 'forbidden');
  let st;
  try { st = await fs.stat(file); } catch { return send(res, 404, 'not found'); }
  if (st.isDirectory()) return send(res, 404, 'not found');
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const base = { 'content-type': type, 'accept-ranges': 'bytes', 'cache-control': 'no-store', 'last-modified': st.mtime.toUTCString() };
  const range = req.headers.range && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
  if (range) {
    let start = range[1] === '' ? Math.max(0, st.size - Number(range[2])) : Number(range[1]);
    let end = range[1] !== '' && range[2] !== '' ? Math.min(Number(range[2]), st.size - 1) : st.size - 1;
    if (start >= st.size || start > end) { res.writeHead(416, { 'content-range': `bytes */${st.size}` }); return res.end(); }
    res.writeHead(206, { ...base, 'content-range': `bytes ${start}-${end}/${st.size}`, 'content-length': end - start + 1 });
    if (req.method === 'HEAD') return res.end();
    return fss.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { ...base, 'content-length': st.size });
  if (req.method === 'HEAD') return res.end();
  fss.createReadStream(file).pipe(res);
}

const readBody = (req) => new Promise((resolve, reject) => {
  let s = '';
  req.on('data', (c) => { s += c; if (s.length > 4e6) { reject(new MotusError('Request too large')); req.destroy(); } });
  req.on('end', () => { try { resolve(s ? JSON.parse(s) : {}); } catch { reject(new MotusError('Body is not valid JSON')); } });
  req.on('error', reject);
});

export async function createStudioServer(projectDir, { port = 0, host = '127.0.0.1', loops: drawLoops = false } = {}) {
  drawLoops = drawLoops && !process.env.MOTUS_NO_LOOPS;     // only the user-facing Studio draws loops, never the render stage
  const ownOrigins = (p) => {
    const names = new Set(['localhost', '127.0.0.1', '[::1]', String(host).toLowerCase()]);
    const hosts = new Set([...names].map((n) => `${n}:${p}`));
    return { hosts, origins: new Set([...hosts].map((h) => `http://${h}`)) };
  };
  const project = await loadProject(projectDir);
  const clients = new Set();
  const emit = (type, data = {}) => { const msg = `data: ${JSON.stringify({ type, ...data })}\n\n`; for (const c of clients) c.write(msg); };
  const statePath = project.path('review', 'state.json');
  const getState = () => readJson(statePath, { scenes: {}, look: {}, note: '' });
  let render = { status: 'idle' };
  let lastActivity = Date.now();

  async function model() {
    const plan = await loadPlan(await loadProject(projectDir));
    const check = validateEdit(plan.edit, { words: plan.words, manifest: plan.style.manifest, projectDir: project.dir, timeline: plan.timeline });
    const m = reviewModel(plan);
    const posters = new Set(await listFiles(project.path('review', 'posters'), /\.jpg$/));
    const loops = new Set(await listFiles(project.path('review', 'loops'), /^[^.]+-[^.]+-[0-9a-f]+\.mp4$/));
    for (const sc of m.scenes) for (const o of sc.options) {
      const f = `${sc.id}-${o.id}-${sc.hash}`;
      o.poster = posters.has(`${f}.jpg`) ? `/project/review/posters/${f}.jpg` : null;
      o.loop = loops.has(`${f}.mp4`) ? `/project/review/loops/${f}.mp4` : null;
    }
    const final = (await exists(project.path('renders', 'final.mp4'))) ? '/project/renders/final.mp4' : null;
    return { ...m, problems: check.errors, warnings: check.warnings, render, final, hasMatte: !!plan.timeline.hasMatte, app: await appOf(project.dir), agent: await agentNow(), loopsBusy: !!loopRun };
  }

  /** The agent session as this project sees it: connected or not, and whether it is working here. */
  async function agentNow() {
    const a = await agentStatus(path.dirname(project.dir));
    const job = (await readJson(project.path('review', 'app.json'), {}).catch(() => ({}))).job || null;
    return { connected: a.connected, name: a.name, here: a.connected && a.state === 'working' && a.project === project.dir, activity: a.project === project.dir ? a.activity : '', job: job ? { kind: job.kind, state: job.state, summary: job.summary || '', error: job.error || '' } : null };
  }

  // state.json is read-modify-written: run one mutation at a time so concurrent requests cannot lose updates
  let queue = Promise.resolve();
  const serial = (fn) => (...args) => { const run = queue.then(() => fn(...args)); queue = run.catch(() => {}); return run; };

  async function putState(body) {
    const plan = await loadPlan(await loadProject(projectDir));
    const state = await getState();
    state.scenes ||= {}; state.look ||= {};
    if (body.scene) {
      const sc = plan.edit.scenes.find((s) => s.id === body.scene);
      if (!sc) throw new MotusError(`No scene "${body.scene}"`);
      const cur = state.scenes[sc.id] || {};
      const h = hashOf(sc.options);
      // the agent revised this scene since the user last decided: an old pick or lock no longer applies
      if (cur.hash && cur.hash !== h) { delete cur.pick; cur.locked = false; }
      if (body.pick !== undefined) {
        if (!sc.options.some((o) => o.id === body.pick)) throw new MotusError(`Scene ${sc.id} has no option "${body.pick}"`);
        cur.pick = body.pick;
      }
      if (body.locked !== undefined) cur.locked = !!body.locked;
      if (body.note !== undefined) cur.note = String(body.note).slice(0, 4000);
      cur.hash = h;
      cur.at = new Date().toISOString();
      state.scenes[sc.id] = cur;
    }
    if (body.lockAll !== undefined) {
      for (const sc of plan.edit.scenes) {
        const cur = state.scenes[sc.id] || {};
        cur.locked = !!body.lockAll; cur.hash = hashOf(sc.options); cur.pick ??= sc.pick || sc.options[0].id;
        state.scenes[sc.id] = cur;
      }
    }
    if (body.look) for (const [k, v] of Object.entries(body.look)) {
      const spec = plan.style.manifest.look?.[k];
      if (!spec || (spec.choices && !spec.choices.includes(v))) throw new MotusError(`Bad look choice ${k}=${v}`);
      state.look[k] = v;
    }
    if (body.note !== undefined && !body.scene) state.note = String(body.note).slice(0, 8000);
    await writeJson(statePath, state);
    emit('state');
    return model();
  }

  /** The agent has dealt with these scenes' notes: file them under history so the page shows them as addressed. */
  async function ack(body) {
    const state = await getState();
    state.scenes ||= {};
    const ids = body.all ? Object.keys(state.scenes) : (body.scenes || []);
    const done = [];
    for (const id of ids) {
      const cur = state.scenes[id];
      if (!cur || !cur.note || !cur.note.trim()) continue;
      (cur.history ||= []).push({ note: cur.note, at: cur.at || null, addressed: new Date().toISOString(), reply: body.replies?.[id] || '' });
      cur.note = ''; cur.locked = false;
      done.push(id);
    }
    if (body.all || body.global) { if (state.note && state.note.trim()) { (state.history ||= []).push({ note: state.note, addressed: new Date().toISOString(), reply: body.replies?.['*'] || '' }); state.note = ''; } }
    await writeJson(statePath, state);
    emit('state'); emit('plan');
    return { addressed: done };
  }

  async function submit(body) {
    if (body?.action !== 'notes' && body?.action !== 'render') throw new MotusError(`Unknown action "${body?.action}".`, 'Send {"action": "notes"} or {"action": "render"}.');
    const m = await model();
    const dir = project.path('review', 'submissions');
    await mkdirp(dir);
    const n = Math.max(0, ...(await listFiles(dir, /^\d+\.json$/)).map((f) => parseInt(f, 10) || 0)) + 1;
    const action = body.action;
    const sub = {
      n, action, at: new Date().toISOString(), look: m.look, note: m.note,
      locked: m.locked, total: m.total,
      scenes: m.scenes.map((s) => ({ id: s.id, say: s.say, pick: s.pick, pickLabel: s.options.find((o) => o.id === s.pick)?.label, recommended: s.recommended, locked: s.locked, note: s.note, revised: s.revised })),
    };
    sub.withNotes = sub.scenes.filter((s) => s.note.trim()).map((s) => s.id);
    sub.unlocked = sub.scenes.filter((s) => !s.locked).map((s) => s.id);
    await writeJson(path.join(dir, `${String(n).padStart(3, '0')}.json`), sub);
    emit('submitted', { n, action });
    if (action === 'render') startRender({ draft: !!body.draft });
    return sub;
  }

  const putStateSerial = serial(putState), ackSerial = serial(ack), submitSerial = serial(submit);

  function startRender(opt = {}) {
    if (render.status === 'running') return;
    render = { status: 'running', phase: 'starting', progress: 0, started: Date.now(), draft: !!opt.draft };
    emit('render', render);
    import('./render.mjs').then(async ({ renderProject }) => {
      const out = await renderProject(await loadProject(projectDir), {
        draft: !!opt.draft,
        onProgress: (p) => { render = { ...render, ...p }; emit('render', render); },
      });
      if (drawLoops && loopAgain) loopsSoon();
      render = { status: 'done', progress: 1, phase: 'done', file: out.file, url: `/project/${path.relative(project.dir, out.file).split(path.sep).join('/')}`, seconds: (Date.now() - render.started) / 1000, draft: !!opt.draft, info: out };
      emit('render', render);
    }).catch((e) => {
      render = { status: 'error', error: e.message, fix: e.fix || '' };
      emit('render', render);
    });
  }

  // Scene loops for the grid: drawn in the background by `motus stills --loops`, one run at a time,
  // again whenever the plan changes, never during a final render.
  let loopRun = null, loopAgain = false, loopTimer = null;
  function ensureLoops() {
    if (loopRun || render.status === 'running') { loopAgain = true; return; }
    loopAgain = false;
    const logFile = fss.openSync(project.path('review', 'loops.log'), 'a');
    loopRun = spawn(process.execPath, [BIN, 'stills', project.dir, '--loops', '--quiet'], { stdio: ['ignore', logFile, logFile], windowsHide: true });
    fss.closeSync(logFile);
    emit('state');
    const finish = () => { loopRun = null; emit('plan'); if (loopAgain) loopTimer = setTimeout(ensureLoops, 500); };
    loopRun.on('exit', finish);
    loopRun.on('error', finish);
  }
  const loopsSoon = () => { clearTimeout(loopTimer); loopTimer = setTimeout(ensureLoops, 1500); };

  // Tell open pages when the agent rewrites the plan.
  let debounce = null;
  const watchers = [];
  for (const dir of [project.path('plan'), project.path('review', 'posters'), project.path('review', 'loops')]) {
    await mkdirp(dir);
    try {
      watchers.push(fss.watch(dir, () => {
        clearTimeout(debounce); debounce = setTimeout(() => emit('plan'), 250);
        if (drawLoops && dir === project.path('plan')) loopsSoon();
      }));
    } catch { /* watching is a nicety */ }
  }
  if (drawLoops) loopsSoon();

  const server = http.createServer(async (req, res) => {
    lastActivity = Date.now();
    // Only pages served by this server may talk to it. The Host check stops DNS rebinding (a
    // site that points its own name at 127.0.0.1); writes must be JSON, which a cross-site form
    // or no-cors request cannot send without a preflight this server never approves.
    const own = ownOrigins(server.address().port);
    if (!own.hosts.has(String(req.headers.host || '').toLowerCase())) return send(res, 403, 'forbidden host');
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const json = String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json');
      const origin = req.headers.origin;
      if (!json || (origin && !own.origins.has(String(origin).toLowerCase()))) return send(res, 403, 'forbidden');
    }
    let url, p;
    try { url = new URL(req.url, 'http://x'); p = decodeURIComponent(url.pathname); } catch { return send(res, 400, 'bad request'); }
    try {
      if (p === '/api/events') {
        res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
        res.write(`data: ${JSON.stringify({ type: 'hello', render })}\n\n`);
        clients.add(res);
        req.on('close', () => clients.delete(res));
        return;
      }
      if (p === '/api/project' && req.method === 'GET') return send(res, 200, await model());
      if (p === '/api/resolved' && req.method === 'GET') {
        const plan = await loadPlan(await loadProject(projectDir));
        return send(res, 200, resolveDoc(plan, { scene: url.searchParams.get('scene') || undefined, option: url.searchParams.get('option') || undefined }));
      }
      if (p === '/api/state' && req.method === 'PUT') return send(res, 200, await putStateSerial(await readBody(req)));
      if (p === '/api/submit' && req.method === 'POST') return send(res, 200, await submitSerial(await readBody(req)));
      if (p === '/api/ack' && req.method === 'POST') return send(res, 200, await ackSerial(await readBody(req)));
      if (p === '/api/render' && req.method === 'GET') return send(res, 200, render);
      if (p === '/api/agent' && req.method === 'GET') return send(res, 200, { agent: await agentNow(), app: await appOf(project.dir) });
      if (p === '/api/reveal' && req.method === 'POST') {
        const file = project.path('renders', 'final.mp4');
        reveal((await exists(file)) ? file : project.dir);
        return send(res, 200, { ok: true });
      }
      if (p === '/api/ping') return send(res, 200, { ok: true, project: project.dir });
      if (p === '/' || p === '/index.html') return sendFile(req, res, path.join(ENGINE, 'studio'), 'index.html');
      if (p.startsWith('/studio/')) return sendFile(req, res, path.join(ENGINE, 'studio'), p.slice(8));
      if (p.startsWith('/runtime/')) return sendFile(req, res, path.join(ENGINE, 'runtime'), p.slice(9));
      if (p.startsWith('/assets/')) return sendFile(req, res, path.join(ENGINE, 'assets'), p.slice(8));
      if (p.startsWith('/styles/')) return sendFile(req, res, STYLES, p.slice(8));
      if (p.startsWith('/project/')) return sendFile(req, res, project.dir, p.slice(9));
      return send(res, 404, 'not found');
    } catch (e) {
      const code = e instanceof MotusError ? 400 : 500;
      if (!res.headersSent) send(res, code, { error: e.message, fix: e.fix || '' });
      else res.end();
    }
  });

  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); });
  const actual = server.address().port;
  return {
    server, port: actual, url: `http://${host === '127.0.0.1' ? 'localhost' : host}:${actual}/`,
    emit, idleFor: () => Date.now() - lastActivity, clients,
    close: () => new Promise((r) => { clearTimeout(loopTimer); try { loopRun?.kill(); } catch { /* gone */ } watchers.forEach((w) => w.close()); for (const c of clients) c.end(); server.close(r); }),
  };
}
