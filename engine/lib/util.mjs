// Shared node-side helpers. Built-ins only.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import os from 'node:os';

export const ENGINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT = path.resolve(ENGINE, '..');
export const STYLES = process.env.MOTUS_STYLES ? path.resolve(process.env.MOTUS_STYLES) : path.join(ROOT, 'styles');
/** Compiled helpers and other machine-local caches live outside the repo. */
export const CACHE = process.env.MOTUS_CACHE ? path.resolve(process.env.MOTUS_CACHE) : path.join(os.homedir(), '.cache', 'motus');
export const WIN = process.platform === 'win32';

/** An error the user or the agent can act on: `fix` says what to do next. */
export class MotusError extends Error {
  constructor(message, fix = '') { super(message); this.name = 'MotusError'; this.fix = fix; }
}

/**
 * Run a program and collect its output. Rejects with MotusError when the exit code is not in `ok`.
 * opt: { cwd, env, input, ok:[0], onLine(line, stream) }
 */
export function run(cmd, args = [], opt = {}) {
  return new Promise((resolve, reject) => {
    // windowsHide: the detached app and Studio servers have no console on Windows, so without it every
    // ffmpeg, Python or Node process they start would open a console window of its own
    const child = spawn(cmd, args, { cwd: opt.cwd, env: { ...process.env, ...(opt.env || {}) }, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    let stdout = '', stderr = '';
    const feed = (stream) => {
      let tail = '';
      return (buf) => {
        const s = buf.toString();
        if (stream === 'stdout') stdout += s; else stderr += s;
        if (!opt.onLine) return;
        const parts = (tail + s).split(/\r?\n|\r/);
        tail = parts.pop();
        for (const line of parts) opt.onLine(line, stream);
      };
    };
    child.stdout.on('data', feed('stdout'));
    child.stderr.on('data', feed('stderr'));
    child.on('error', (e) => reject(new MotusError(`Could not start ${cmd}: ${e.message}`, e.code === 'ENOENT' ? `Install ${cmd} and make sure it is on PATH (run: motus doctor).` : '')));
    child.on('close', (code) => {
      if ((opt.ok || [0]).includes(code)) return resolve({ code, stdout, stderr });
      const last = stderr.trim().split('\n').slice(-6).join('\n');
      reject(new MotusError(`${path.basename(cmd)} exited with code ${code}\n${last}`, opt.fix || 'Read the message above; run: motus doctor to check the tools this step needs.'));
    });
    if (opt.input != null) child.stdin.end(opt.input); else child.stdin.end();
  });
}

export const exists = (p) => fs.access(p).then(() => true, () => false);

// ---- cleanup that must happen even when the process is interrupted
const exitHooks = new Set();
function runExitHooks() { for (const fn of [...exitHooks]) { try { fn(); } catch { /* best effort */ } } exitHooks.clear(); }
function exitOnSignal(sig) { runExitHooks(); process.exit(128 + (os.constants.signals[sig] || 0)); }
/**
 * Run `fn` (synchronously) if the process exits or gets SIGINT/SIGTERM before the returned remover is
 * called: kills headless Chrome, removes render work folders. The signal handlers exist only while a
 * hook is registered, so a process without live resources keeps the default signal behaviour.
 */
export function onExit(fn) {
  if (!exitHooks.size) { process.on('exit', runExitHooks); process.on('SIGINT', exitOnSignal); process.on('SIGTERM', exitOnSignal); }
  exitHooks.add(fn);
  return () => {
    if (!exitHooks.delete(fn) || exitHooks.size) return;
    process.off('exit', runExitHooks); process.off('SIGINT', exitOnSignal); process.off('SIGTERM', exitOnSignal);
  };
}

export async function readJson(p, fallback) {
  try { return JSON.parse(await fs.readFile(p, 'utf8')); }
  catch (e) {
    if (e.code === 'ENOENT' && fallback !== undefined) return fallback;
    if (e instanceof SyntaxError) throw new MotusError(`${p} is not valid JSON: ${e.message}`, 'Fix the syntax error at the position given, then run the command again.');
    throw e;
  }
}

/**
 * fs.rename that rides out Windows file locks. On Windows a virus scanner or the search indexer briefly
 * opens a file that was just written, and a server reading the target holds it too: rename then fails
 * with EPERM, EACCES or EBUSY for a moment. Retry for up to about 4 s there; elsewhere this is fs.rename.
 */
export async function renameRetry(from, to) {
  for (let wait = 20; ; wait *= 2) {
    try { return await fs.rename(from, to); } catch (e) {
      if (!WIN || !['EPERM', 'EACCES', 'EBUSY'].includes(e.code) || wait > 2000) throw e;
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

let writeSeq = 0;
/** Atomic JSON write: a reader never sees a half-written file. */
export async function writeJson(p, obj) {
  await fs.mkdir(path.dirname(p), { recursive: true });
  const tmp = `${p}.${process.pid}.${Date.now()}.${++writeSeq}.tmp`;   // unique even for two writes in one millisecond
  await fs.writeFile(tmp, JSON.stringify(obj, null, 2) + '\n');
  try { await renameRetry(tmp, p); } catch (e) { await fs.rm(tmp, { force: true }).catch(() => {}); throw e; }
}

export const mkdirp = (p) => fs.mkdir(p, { recursive: true });

/** Names Windows reserves for devices, with or without an extension: "con", "nul.mp4", "com1". */
export const RESERVED_NAME = /^(con|prn|aux|nul|com\d|lpt\d)(\..*)?$/i;

export function slug(s) {
  const out = String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'video';
  return RESERVED_NAME.test(out) ? `${out}-video` : out;      // a folder named "con" cannot exist on Windows
}

/**
 * A path written into a command line the user or agent will run. On Windows it uses forward slashes,
 * which Node accepts and every shell (cmd, PowerShell, Git Bash) leaves alone; JSON quoting there would
 * double every backslash. Elsewhere: JSON quoting, as before.
 */
export const cliPath = (p) => JSON.stringify(WIN ? String(p).replace(/\\/g, '/') : String(p));

/** "30000/1001" -> [30000, 1001]; "30" -> [30, 1] */
export function parseRational(s) {
  const [a, b] = String(s).split('/').map(Number);
  return [a, b || 1];
}
export const fpsOf = (r) => r[0] / r[1];

const STANDARD_RATES = [[24000, 1001], [24, 1], [25, 1], [30000, 1001], [30, 1], [48, 1], [50, 1], [60000, 1001], [60, 1]];
/**
 * The delivery frame rate for a probed source rate. Exact broadcast rates (n/1, n/1001) are kept;
 * a variable-frame-rate phone clip reports an average such as 1800000/60059, which is snapped to
 * the nearest standard rate (within 5 %) or else rounded to whole frames per second.
 */
export function standardRate(r) {
  const [n, d] = r;
  if (!(n > 0) || !(d > 0)) return [30, 1];
  if (d === 1 || d === 1001) return [n, d];
  const f = n / d;
  let best = null;
  for (const c of STANDARD_RATES) if (!best || Math.abs(fpsOf(c) - f) < Math.abs(fpsOf(best) - f)) best = c;
  if (Math.abs(fpsOf(best) - f) / f <= 0.05) return [...best];
  return [Math.max(1, Math.round(f)), 1];
}

/** 83.4567 -> "1:23.46" */
export function clock(sec, digits = 2) {
  const q = 10 ** digits;
  const t = Math.round(Math.max(0, sec) * q) / q;                // round first: 59.999 is "1:00.00", not "0:60.00"
  const m = Math.floor(t / 60), s = t - m * 60;
  return `${m}:${s.toFixed(digits).padStart(digits ? digits + 3 : 2, '0')}`;
}

/** Where Chromium-family browsers install on each system, most preferred first. */
export function chromeCandidates(platform = process.platform, env = process.env) {
  if (platform === 'darwin') {
    return ['Google Chrome', 'Chromium', 'Microsoft Edge', 'Brave Browser', 'Google Chrome Canary'].map((n) => `/Applications/${n}.app/Contents/MacOS/${n}`);
  }
  if (platform === 'win32') {
    // Chrome installs machine-wide (Program Files) or per user (LocalAppData); Edge ships with Windows 10 and 11
    const roots = [env.PROGRAMFILES || 'C:\\Program Files', env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', env.LOCALAPPDATA].filter(Boolean);
    const apps = ['Google\\Chrome\\Application\\chrome.exe', 'Chromium\\Application\\chrome.exe', 'Microsoft\\Edge\\Application\\msedge.exe', 'BraveSoftware\\Brave-Browser\\Application\\brave.exe'];
    return apps.flatMap((a) => roots.map((r) => path.win32.join(r, a)));
  }
  return ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium', '/usr/bin/microsoft-edge', '/usr/bin/microsoft-edge-stable', '/usr/bin/brave-browser'];
}

/** Find a Chromium-family browser to drive headless. */
export function findChrome() {
  const env = process.env.MOTUS_CHROME;
  if (env && fss.existsSync(env)) return env;
  for (const p of chromeCandidates()) if (fss.existsSync(p)) return p;
  return null;
}

/** Minor versions tried by name after the default Python: faster-whisper's packages lag new Python releases. */
const PY_MINORS = ['3.13', '3.12', '3.11', '3.10'];

/**
 * The commands that may start Python 3, in the order tried. On Windows `python3` is usually the Microsoft
 * Store placeholder, so the `py` launcher (python.org installs) comes first, then `python`.
 * MOTUS_PYTHON is one program path and is used as it is (no splitting: it may contain spaces).
 */
export function pythonCandidates(platform = process.platform, env = process.env) {
  if (env.MOTUS_PYTHON) return [{ cmd: env.MOTUS_PYTHON, args: [] }];
  return platform === 'win32'
    ? [{ cmd: 'py', args: ['-3'] }, ...PY_MINORS.map((v) => ({ cmd: 'py', args: [`-${v}`] })), { cmd: 'python', args: [] }, { cmd: 'python3', args: [] }]
    : [{ cmd: 'python3', args: [] }, ...PY_MINORS.map((v) => ({ cmd: `python${v}`, args: [] })), { cmd: 'python', args: [] }];
}

const pyLabel = (c) => [c.cmd.includes(' ') ? JSON.stringify(c.cmd) : c.cmd, ...c.args].join(' ');
let pythonFound;
/**
 * The Python 3 to transcribe with: { cmd, args, label, version, whisper } where `label` is how to type it in
 * a shell (for fix messages). The first candidate that has faster-whisper wins; else the first that runs
 * (`whisper: false`); else the first candidate with `version: null`, so error messages still name it.
 * A machine with a brand-new default Python and an older one holding faster-whisper uses the older one.
 */
export function findPython() {
  pythonFound ||= (async () => {
    const list = pythonCandidates();
    const probe = 'import sys, importlib.util; print(".".join(map(str, sys.version_info[:3]))); print(importlib.util.find_spec("faster_whisper") is not None)';
    let first = null;
    for (const c of list) {
      try {
        const [version, whisper] = (await run(c.cmd, [...c.args, '-c', probe])).stdout.trim().split(/\r?\n/).slice(-2);
        if (!/^3\./.test(version)) continue;
        const found = { ...c, label: pyLabel(c), version, whisper: whisper === 'True' };
        if (found.whisper) return found;
        first ||= found;
      } catch { /* not this one */ }
    }
    return first || { ...list[0], label: pyLabel(list[0]), version: null, whisper: false };
  })();
  return pythonFound;
}

/**
 * Minimal argv parser: positionals + --flag value / --flag / --no-flag / --k=v.
 * `booleans` names flags that never take a value, so `--json ./project` keeps the project positional.
 * A lone `--` ends flag parsing.
 */
export function parseArgs(argv, { booleans = [] } = {}) {
  const pos = [], flags = {};
  const bool = new Set(booleans);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--') { pos.push(...argv.slice(i + 1)); break; }
    if (!a.startsWith('--')) { pos.push(a); continue; }
    const eq = a.indexOf('=');
    if (eq > 0) { flags[a.slice(2, eq)] = a.slice(eq + 1); continue; }
    const k = a.slice(2);
    if (k.startsWith('no-')) { flags[k.slice(3)] = false; continue; }
    const next = argv[i + 1];
    if (bool.has(k) || next === undefined || next.startsWith('--')) flags[k] = true;
    else { flags[k] = next; i++; }
  }
  return { pos, flags };
}
