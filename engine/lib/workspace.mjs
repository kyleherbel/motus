// The Motus app's workspace: one folder holding every project the app made, plus two small
// state files the app and the agent share.
//
//   <workspace>/.motus-app.json     where the app server listens (written by `motus app`)
//   <workspace>/.motus-agent.json   what the agent session is doing (written by next / say / done)
//   <workspace>/<project>/review/app.json   per project: the ingest the app ran, and the agent's current job
//
// The agent is whatever AI session said "go" (Claude Code, Codex). It loops on `motus next`,
// which hands it one job at a time: plan a freshly ingested video, or revise after Studio notes.
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import { spawn } from 'node:child_process';
import { ROOT, readJson, writeJson, exists, cliPath, MotusError } from './util.mjs';
import { loadProject, listFiles } from './project.mjs';

export const AGENT_FILE = '.motus-agent.json';
export const APP_FILE = '.motus-app.json';
const WAITING_FRESH_MS = 20000;          // `next` beats every 5 s while it waits
const WORKING_FRESH_MS = 45 * 60000;     // a planning job can run long between `say` lines
const IDLE_FRESH_MS = 3 * 60000;         // between `done` and the next `next`

/** Where the app keeps projects: $MOTUS_HOME, else ~/Movies/Motus on a Mac, ~/Videos/Motus on Windows, else ~/Motus. */
export function defaultWorkspace() {
  if (process.env.MOTUS_HOME) return path.resolve(process.env.MOTUS_HOME);
  const videos = path.join(os.homedir(), process.platform === 'win32' ? 'Videos' : 'Movies');
  return fss.existsSync(videos) ? path.join(videos, 'Motus') : path.join(os.homedir(), 'Motus');
}

export const appState = (p) => readJson(p.path('review', 'app.json'), {});
export async function patchAppState(p, fn) {
  const file = p.path('review', 'app.json');
  const cur = await readJson(file, {});
  const next = fn(cur) || cur;
  await writeJson(file, next);
  return next;
}

/** Show a file in Finder (or the system's file manager). */
export function reveal(file) {
  if (process.platform === 'win32') {
    // Explorer parses its own command line: the path is quoted after "/select," (Node would quote the whole
    // argument, which Explorer does not understand), so the arguments go through verbatim
    spawn('explorer.exe', [`/select,"${path.resolve(file)}"`], { detached: true, stdio: 'ignore', windowsVerbatimArguments: true }).on('error', () => {}).unref();
    return;
  }
  const [cmd, args] = process.platform === 'darwin' ? ['open', ['-R', file]] : ['xdg-open', [path.dirname(file)]];
  spawn(cmd, args, { detached: true, stdio: 'ignore' }).on('error', () => {}).unref();
}

/** Open a URL in the default browser. */
export function openUrl(url) {
  // Windows: `start` is a cmd built-in; its first quoted argument is a window title, so an empty one
  // (Node passes '' as "") goes first. windowsHide keeps cmd's own console window from flashing up.
  const [cmd, args] = process.platform === 'darwin' ? ['open', [url]] : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : ['xdg-open', [url]];
  spawn(cmd, args, { detached: true, stdio: 'ignore', windowsHide: true }).on('error', () => {}).unref();
}

export const pidAlive = (pid) => { if (!pid) return false; try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };

// ------------------------------------------------------------------ the agent's state

export async function readAgent(ws) { return readJson(path.join(ws, AGENT_FILE), null).catch(() => null); }
export async function writeAgent(ws, data) { await writeJson(path.join(ws, AGENT_FILE), { ...data, at: new Date().toISOString() }); }

/** Is an agent session connected, and what is it doing? */
export async function agentStatus(ws) {
  const a = await readAgent(ws);
  if (!a?.at) return { connected: false, state: 'none', name: null };
  const age = Date.now() - Date.parse(a.at);
  const limit = a.state === 'waiting' ? WAITING_FRESH_MS : a.state === 'working' ? WORKING_FRESH_MS : IDLE_FRESH_MS;
  return { connected: age < limit, state: a.state, name: a.name || null, project: a.project || null, kind: a.kind || null, activity: a.activity || '', age };
}

// ------------------------------------------------------------------ projects

/** Project folders directly inside the workspace, oldest first. */
export async function listProjects(ws) {
  let dirs = [];
  try { dirs = await fs.readdir(ws, { withFileTypes: true }); } catch { return []; }
  const out = [];
  for (const d of dirs) {
    if (!d.isDirectory() || d.name.startsWith('.')) continue;
    const dir = path.join(ws, d.name);
    if (await exists(path.join(dir, 'project.json'))) out.push(dir);
  }
  const created = await Promise.all(out.map(async (dir) => (await readJson(path.join(dir, 'project.json'), {})).created || ''));
  return out.map((dir, i) => [dir, created[i]]).sort((a, b) => String(a[1]).localeCompare(String(b[1]))).map(([dir]) => dir);
}

const seenOf = async (p) => Number(await fs.readFile(p.path('review', '.seen'), 'utf8').catch(() => '0')) || 0;
const numOf = (f) => Number.parseInt(f, 10);
async function submissions(p) {
  return (await listFiles(p.path('review', 'submissions'), /^\d+\.json$/)).sort((a, b) => numOf(a) - numOf(b));
}

/**
 * Where one project stands, in the words the app shows. stage is one of:
 * listening (the app is ingesting) · waiting (a job is queued for the agent) · planning (the agent is on it)
 * · review (a plan exists) · rendered (a final video exists) · error (something stopped; `error` says what).
 */
export async function projectSummary(dir, agent) {
  const p = await loadProject(dir);
  const app = await appState(p);
  const hasPlan = await exists(p.path('plan', 'edit.json'));
  const final = await exists(p.path('renders', 'final.mp4'));
  const understanding = await readJson(p.path('analysis', 'understanding.json'), null).catch(() => null);
  const seen = await seenOf(p);
  const unseenNotes = [];
  for (const f of await submissions(p)) {
    if (numOf(f) <= seen) continue;
    const sub = await readJson(p.path('review', 'submissions', f), null).catch(() => null);
    if (sub?.action === 'notes') unseenNotes.push(numOf(f));
  }
  const job = app.job || null;
  const agentOnIt = !!(agent?.connected && agent.state === 'working' && agent.project === p.dir);
  const s = p.json.source || {};

  let stage, error = null;
  const ing = app.ingest || {};
  if (ing.state === 'running' && !pidAlive(ing.pid)) { stage = 'error'; error = { message: 'Listening stopped before it finished.', fix: 'Press Try again.' }; }
  else if (ing.state === 'running') stage = 'listening';
  else if (ing.state === 'error') { stage = 'error'; error = { message: ing.error || 'Listening failed.', fix: ing.fix || '' }; }
  else if (job?.state === 'failed') { stage = 'error'; error = { message: job.error || 'The agent could not finish.', fix: 'Press Try again, or tell the agent in your chat.' }; }
  else if (!p.done('ingest')) stage = 'new';
  else if (job?.kind === 'plan' && job.state === 'claimed') stage = 'planning';
  else if (job?.kind === 'plan' && job.state === 'queued') stage = 'waiting';
  else if (!hasPlan && job?.kind === 'plan' && job.state === 'done') { stage = 'error'; error = { message: 'The agent finished without writing a plan.', fix: 'Press Try again.' }; }
  else if (!hasPlan) stage = 'waiting';
  else if (final) stage = 'rendered';
  else stage = 'review';

  const revising = unseenNotes.length > 0 || (job?.kind === 'notes' && job.state === 'claimed');
  return {
    id: path.basename(p.dir), dir: p.dir, name: p.json.name, created: p.json.created,
    style: p.json.style, mode: p.json.mode,
    source: { file: path.basename(s.path || ''), width: s.width, height: s.height, duration: s.duration, bytes: s.bytes },
    output: p.done('conform') ? { duration: p.json.stages.conform.duration } : null,
    stage, error, revising,
    activity: stage === 'listening' ? (ing.activity || 'Starting') : (job?.state === 'claimed' ? (job.activity || '') : ''),
    agentOnIt, job, summary: app.planSummary || null,
    topic: understanding?.topic || null,
    final: final ? p.path('renders', 'final.mp4') : null,
    notes: p.json.notes || [],
  };
}

// ------------------------------------------------------------------ jobs for the agent

const EDIT_SKILL = path.join(ROOT, 'skills', 'edit', 'SKILL.md');
const BIN = path.join(ROOT, 'engine', 'bin', 'motus.mjs');
const q = cliPath;

function planInstructions(p, setup, resumed) {
  const cli = `node ${q(BIN)}`;
  return [
    resumed ? 'This job was started before and not finished. Look at what already exists in the project and carry on from there.' : null,
    `Read ${EDIT_SKILL} if you have not read it in this session.`,
    `The user created this project in the Motus app and it is already ingested. Style "${setup.style}" and mode "${setup.mode}" are set: do not ask about them.${setup.prompt ? ` Names the user wants spelled right: ${setup.prompt}.` : ''}`,
    'Do steps 4 to 7 of that skill: understand the video and write analysis/understanding.json, cut (raw mode only) and conform, plan and validate, then review your own stills.',
    'The user is watching the Motus app, not the chat. Do not ask questions in the chat and do not open Studio yourself.',
    `Post short progress lines the app shows the user, in plain words, as you go: ${cli} say ${q(p.dir)} "Reading the transcript"`,
    `When the plan validates and you have checked the stills: ${cli} done ${q(p.dir)} --summary "<one plain sentence about the edit>"`,
    `If you cannot finish: ${cli} done ${q(p.dir)} --error "<what went wrong, in plain words>"`,
    `Then run ${cli} next again.`,
  ].filter(Boolean);
}

function notesInstructions(p, sub, resumed) {
  const cli = `node ${q(BIN)}`;
  return [
    resumed ? 'This job was started before and not finished. Check which notes are already addressed (motus ack moves them into history) and do the rest.' : null,
    `The user sent notes from Studio. Revise the plan as step 8 of ${EDIT_SKILL} says for "action": "notes": change the scenes that have a note${sub.note?.trim() ? ' and act on the overall note' : ''}, validate, run motus stills ${q(p.dir)} --posters, and look at the result.`,
    'Leave locked scenes alone.',
    `Then file the notes as addressed: ${cli} ack ${q(p.dir)} ${(sub.withNotes || []).join(' ')}${sub.note?.trim() ? ' --global' : ''} --reply "<what you changed, in one plain sentence>"`,
    `Post progress as you go: ${cli} say ${q(p.dir)} "Revising scene 4"`,
    `When done: ${cli} done ${q(p.dir)} --summary "<one plain sentence>"`,
    `Then run ${cli} next again.`,
  ].filter(Boolean);
}

/** The next job for the agent, or null. Claims it (and marks it in the project) before returning. */
export async function claimJob(ws) {
  for (const dir of await listProjects(ws)) {
    let p;
    try { p = await loadProject(dir); } catch { continue; }
    const app = await appState(p);
    const job = app.job;
    // queued by the app, or claimed earlier by an agent that has since come back asking for work
    if (job && (job.state === 'queued' || job.state === 'claimed')) {
      const resumed = job.state === 'claimed';
      await patchAppState(p, (a) => { a.job = { ...a.job, state: 'claimed', claimed: new Date().toISOString(), activity: resumed ? 'Picking up where it left off' : 'Starting' }; });
      if (job.kind === 'plan') {
        const setup = { style: p.json.style, mode: p.json.mode, prompt: job.prompt || '' };
        return { job: 'plan', project: p.dir, name: p.json.name, resumed, setup, instructions: planInstructions(p, setup, resumed) };
      }
      if (job.kind === 'notes') {
        const sub = await readJson(p.path('review', 'submissions', `${String(job.n).padStart(3, '0')}.json`), null).catch(() => null);
        if (sub) return notesJob(p, sub, resumed);
        await patchAppState(p, (a) => { a.job = { ...a.job, state: 'done', ended: new Date().toISOString() }; });
      }
    }
    // notes sent from Studio since the agent last looked
    const seen = await seenOf(p);
    for (const f of await submissions(p)) {
      const n = numOf(f);
      if (n <= seen) continue;
      const sub = await readJson(p.path('review', 'submissions', f), null).catch(() => null);
      await fs.writeFile(p.path('review', '.seen'), String(n));
      if (sub?.action !== 'notes') continue;                    // renders run in Studio's own server
      await patchAppState(p, (a) => { a.job = { kind: 'notes', n, state: 'claimed', queued: sub.at, claimed: new Date().toISOString(), activity: 'Reading your notes' }; });
      return notesJob(p, sub, false);
    }
  }
  return null;
}

function notesJob(p, sub, resumed) {
  const scenes = (sub.scenes || []).filter((s) => s.note?.trim()).map((s) => ({ id: s.id, say: s.say, pick: s.pick, locked: s.locked, note: s.note }));
  return { job: 'notes', project: p.dir, name: p.json.name, resumed, notes: { overall: sub.note || '', scenes, look: sub.look }, instructions: notesInstructions(p, sub, resumed) };
}

/** Block until there is a job (or the timeout passes), beating the agent file so the app shows it as connected. */
export async function nextJob(ws, { name = 'the agent', timeout = 300, poll = 1000 } = {}) {
  if (!(await exists(ws))) throw new MotusError(`No Motus workspace at ${ws}`, 'Start the app first: motus app --open');
  const end = Date.now() + timeout * 1000;
  let beat = 0;
  for (;;) {
    if (Date.now() - beat > 5000) { await writeAgent(ws, { state: 'waiting', name }); beat = Date.now(); }
    const job = await claimJob(ws);
    if (job) {
      await writeAgent(ws, { state: 'working', name, project: job.project, kind: job.job, activity: 'Starting' });
      return job;
    }
    if (Date.now() >= end) return { idle: true, next: 'Nothing to do yet. Run motus next again.' };
    await new Promise((r) => setTimeout(r, poll));
  }
}

/** The agent says what it is doing, for the app to show. */
export async function say(dir, text) {
  const p = await loadProject(dir);
  const ws = path.dirname(p.dir);
  text = String(text || '').trim().slice(0, 200);
  const prev = await readAgent(ws);
  await writeAgent(ws, { state: 'working', name: prev?.name || null, project: p.dir, kind: prev?.kind || (await appState(p)).job?.kind || null, activity: text });
  await patchAppState(p, (a) => { if (a.job) a.job.activity = text; });
  return { ok: true };
}

/** The agent finished (or gave up on) its job for this project. */
export async function done(dir, { summary = '', error = '' } = {}) {
  const p = await loadProject(dir);
  const ws = path.dirname(p.dir);
  const prev = await readAgent(ws);
  const now = new Date().toISOString();
  await patchAppState(p, (a) => {
    a.job = { ...(a.job || { kind: 'plan' }), state: error ? 'failed' : 'done', ended: now, activity: '', ...(summary ? { summary: String(summary).slice(0, 400) } : {}), ...(error ? { error: String(error).slice(0, 600) } : {}) };
    if (a.job.kind === 'plan' && summary && !error) a.planSummary = a.job.summary;     // what the edit is; a notes job's summary is only about the revision
  });
  await writeAgent(ws, { state: 'idle', name: prev?.name || null });
  return { ok: true, next: 'Run motus next again.' };
}
