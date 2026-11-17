#!/usr/bin/env node
// Motus command line. Node >= 22, built-ins only.
import path from 'node:path';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs, MotusError, readJson, writeJson, exists, mkdirp, clock, cliPath, ROOT } from '../lib/util.mjs';

const [cmd, ...rest] = process.argv.slice(2);
// flags that never take a value: `motus validate --json ./project` must keep ./project as the positional
const BOOLEANS = ['json', 'quiet', 'force', 'draft', 'open', 'stop', 'posters', 'loops', 'sheet', 'dark', 'full', 'all', 'global', 'matte', 'mono'];
const { pos, flags } = parseArgs(rest, { booleans: BOOLEANS });
const asJson = !!flags.json;
const SELF = fileURLToPath(import.meta.url);

const print = (obj, human) => { process.stdout.write((asJson || !human ? JSON.stringify(obj, null, 2) : human(obj)) + '\n'); };
const log = (msg) => { if (!flags.quiet) process.stderr.write(`[motus] ${msg}\n`); };
const need = (v, what, usage) => { if (!v) throw new MotusError(`Missing ${what}.`, `Usage: motus ${usage}`); return v; };
const num = (v, d) => (v === undefined || v === true ? d : Number(v));

const HELP = `Motus: edit talking-head video in a chosen style.

The app (what a person uses):
  motus app [--open] [--workspace dir] [--port n] [--stop]   start the Motus app: drop a video, review, render
  motus next [--agent name] [--timeout seconds]  agent: wait for the app's next job (plan a video, revise after notes)
  motus say <project> "what you are doing"        agent: show a progress line in the app
  motus done <project> [--summary text] [--error text]   agent: finish the current job

The engine, step by step:
  motus doctor                                   check this machine
  motus styles                                   list installed style packs
  motus init <video> [--style id] [--mode raw|locked] [--project dir] [--force]
  motus ingest <project> [--transcript file] [--language en] [--prompt "names, terms"]
  motus sheet <project> [--from s --to s --fps n] | [--at t1,t2,...]
  motus conform <project> [--no-matte]
  motus capture <url> --out <project>/assets/name.png [--find "text"] [--width 1200] [--scale 2] [--selector css] [--dark] [--clip x,y,w,h] [--full]
  motus logo <brand> --out <project>/assets/logos/name.png [--domain site.com] [--mono] [--icon simple-icons-name] [--colour #hex]   a brand's mark for a graphic
  motus validate <project>
  motus stills <project> [--posters] [--loops] [--force] [--scene id --option id] [--at t1,t2] [--sheet] [--every s]
  motus studio <project> [--port n] [--open] [--stop]
  motus wait <project> [--timeout seconds]
  motus ack <project> [scene ...] [--reply "what changed"]     mark the user's notes as addressed after revising
  motus render <project> [--draft] [--range a,b] [--out file] [--workers n]

Add --json to any command for machine-readable output.`;

async function project(dir) { const { loadProject } = await import('../lib/project.mjs'); return loadProject(need(dir, 'the project folder', `${cmd} <project>`)); }

const commands = {
  async help() { process.stdout.write(HELP + '\n'); },

  async doctor() {
    const { doctor } = await import('../lib/doctor.mjs');
    const r = await doctor();
    print(r, (x) => x.checks.map((c) => `${c.ok ? 'ok  ' : c.required ? 'FAIL' : 'warn'}  ${c.name.padEnd(16)} ${c.detail}${c.ok || !c.fix ? '' : `\n      fix: ${c.fix}`}`).join('\n') + `\n\n${x.ready ? 'Ready.' : 'Not ready: fix the FAIL lines above.'}`);
    if (!r.ready) process.exitCode = 1;
  },

  async styles() {
    const { listStyles } = await import('../lib/styles.mjs');
    const list = await listStyles();
    print({ styles: list }, (x) => x.styles.length ? x.styles.map((s) => `${s.id.padEnd(22)} ${s.name} v${s.version}\n${' '.repeat(23)}${s.summary}${s.bestFor.length ? `\n${' '.repeat(23)}best for: ${s.bestFor.join(', ')}` : ''}`).join('\n\n') : 'No style packs installed.');
  },

  async init() {
    const { initProject } = await import('../lib/project.mjs');
    const p = await initProject({ video: need(pos[0], 'the video file', 'init <video>'), style: flags.style === true ? undefined : flags.style, mode: flags.mode || 'raw', dir: flags.project, force: !!flags.force });
    const s = p.json.source;
    print({ project: p.dir, name: p.json.name, style: p.json.style, mode: p.json.mode, source: s, notes: p.json.notes, next: `motus ingest ${cliPath(p.dir)}` },
      (x) => `Project: ${x.project}\nSource:  ${s.width}x${s.height}, ${(s.fps[0] / s.fps[1]).toFixed(2)} fps, ${clock(s.duration)} (${s.vcodec})\nStyle:   ${x.style || '(not chosen yet)'}   Mode: ${x.mode}${x.notes.length ? '\nNotes:   ' + x.notes.join('\n         ') : ''}\nNext:    ${x.next}`);
  },

  async ingest() {
    const p = await project(pos[0]);
    const { ingest } = await import('../lib/ingest.mjs');
    const r = await ingest(p, { transcript: flags.transcript, language: flags.language, model: flags.model, prompt: flags.prompt, log });
    print(r, (x) => `Ingested ${clock(x.duration)} · ${x.words} words (${x.wordsPerMinute} wpm, ${x.language})\nSilences: ${x.silences} (longest ${x.longestSilence.toFixed(2)} s) · retake candidates: ${x.retakeCandidates} · fillers/stutters: ${x.fillerCandidates}\nSuggested cuts keep ${x.suggestedCuts.keptSeconds} s in ${x.suggestedCuts.ranges} ranges (remove ${x.suggestedCuts.removedSeconds} s)\nRead next:\n  ${x.read.transcript}\n  ${x.read.sheets.join('\n  ')}`);
  },

  async sheet() {
    const p = await project(pos[0]);
    const { contactSheets, stillsAt } = await import('../lib/ingest.mjs');
    if (flags.at) return print({ stills: await stillsAt(p, String(flags.at).split(',').map(Number)) });
    const sheets = await contactSheets(p, { from: num(flags.from, 0), to: flags.to === undefined ? undefined : Number(flags.to), fps: flags.fps === undefined ? undefined : Number(flags.fps), prefix: flags.prefix || 'detail', outDir: p.path('analysis', 'sheets') });
    print({ sheets }, (x) => x.sheets.map((s) => `${s.file}  ${s.from}-${s.to}s @ ${s.fps} fps`).join('\n'));
  },

  async conform() {
    const p = await project(pos[0]);
    const { conform } = await import('../lib/conform.mjs');
    const r = await conform(p, { matte: flags.matte !== false, log });
    print(r, (x) => `Output timeline: ${clock(x.duration)} · ${x.frames} frames @ ${x.fps.toFixed(2)} fps · ${x.ranges} kept range(s), ${x.removed.toFixed(2)} s removed\nMatte: ${x.hasMatte ? 'yes' : `no (${x.matteReason})`}${x.wide ? `\nWide view: ${x.wide}` : ''}\nWords: ${x.words} (${x.wordsFile})\nNext: write plan/edit.json, then: motus validate ${cliPath(p.dir)}`);
  },

  async capture() {
    const { capture } = await import('../lib/capture.mjs');
    const r = await capture({ url: need(pos[0], 'the URL', 'capture <url> --out file'), out: need(flags.out, '--out', 'capture <url> --out file'), find: flags.find, width: num(flags.width, 1200), height: num(flags.height, 0), dark: !!flags.dark, clip: flags.clip, full: !!flags.full, selector: flags.selector, wait: num(flags.wait, 800), scale: num(flags.scale, 2) });
    print(r);
  },

  async logo() {
    const { fetchLogo } = await import('../lib/logo.mjs');
    const r = await fetchLogo({ brand: pos[0], domain: flags.domain, out: flags.out, mono: !!flags.mono, icon: flags.icon, colour: flags.colour });
    print(r, (x) => `${x.file}\n${x.source}${x.domain ? ` (${x.domain})` : ''}${x.w ? `, ${x.w}x${x.h}` : ''}${x.hex ? `, ${x.hex}` : ''}`);
  },

  async validate() {
    const p = await project(pos[0]);
    const { loadPlan, validateEdit } = await import('../lib/plan.mjs');
    const plan = await loadPlan(p);
    const r = validateEdit(plan.edit, { words: plan.words, manifest: plan.style.manifest, projectDir: p.dir, timeline: plan.timeline });
    const fmt = (list, tag) => list.map((e) => `${tag} ${e.path || '(document)'}: ${e.message}${e.fix ? `\n      fix: ${e.fix}` : ''}`).join('\n');
    print({ ok: r.errors.length === 0, ...r, scenes: plan.edit.scenes?.length || 0 },
      (x) => [fmt(x.errors, 'ERROR'), fmt(x.warnings, 'warn '), x.ok ? `Plan is valid: ${x.scenes} scenes${x.warnings.length ? `, ${x.warnings.length} warning(s)` : ''}.` : `${x.errors.length} error(s). Fix them and validate again.`].filter(Boolean).join('\n'));
    if (r.errors.length) process.exitCode = 1;
  },

  async resolve() {
    const p = await project(pos[0]);
    const { loadPlan, resolveDoc } = await import('../lib/plan.mjs');
    print(resolveDoc(await loadPlan(p), { scene: flags.scene, option: flags.option }));
  },

  async stills() {
    const p = await project(pos[0]);
    const { renderStills } = await import('../lib/render.mjs');
    const r = await renderStills(p, { posters: !!flags.posters, loops: !!flags.loops, force: !!flags.force, scene: flags.scene, option: flags.option, at: flags.at ? String(flags.at).split(',').map(Number) : undefined, sheet: !!flags.sheet, every: flags.every ? Number(flags.every) : undefined, log });
    print(r, (x) => (x.sheets?.length ? `Sheets:\n  ${x.sheets.join('\n  ')}\n` : '') + `Stills: ${x.stills.length} in ${x.dir}`);
  },

  async studio() {
    const p = await project(pos[0]);
    const info = p.path('review', 'server.json');
    const alive = async () => {
      const s = await readJson(info, null);
      if (!s) return null;
      try { const r = await fetch(`${s.url}api/ping`, { signal: AbortSignal.timeout(800) }); const j = await r.json(); return j.ok && j.project === p.dir ? s : null; } catch { return null; }
    };
    let s = await alive();
    if (flags.stop) {
      if (s) { try { process.kill(s.pid); } catch { /* already gone */ } }
      await fs.rm(info, { force: true });
      return print({ stopped: !!s });
    }
    if (!s) {
      const { ensureStudio } = await import('../lib/server.mjs');
      s = await ensureStudio(p, { port: num(flags.port, 0) });
    }
    if (flags.open) (await import('../lib/workspace.mjs')).openUrl(s.url);
    print({ url: s.url, pid: s.pid, project: p.dir, next: `motus wait ${cliPath(p.dir)}` }, (x) => `Studio is running: ${x.url}\nWait for the user's decisions with: ${x.next}`);
  },

  async _serve() {
    const { createStudioServer } = await import('../lib/server.mjs');
    const p = await project(pos[0]);
    const s = await createStudioServer(p.dir, { port: num(flags.port, 0), loops: true });
    await writeJson(p.path('review', 'server.json'), { url: s.url, port: s.port, pid: process.pid, started: new Date().toISOString() });
    process.stdout.write(`studio ${s.url}\n`);
    const idleLimit = num(flags.idle, 6 * 3600) * 1000;          // stop after six quiet hours
    setInterval(() => { if (s.idleFor() > idleLimit && s.clients.size === 0) process.exit(0); }, 60000).unref();
    process.on('SIGTERM', () => s.close().then(() => process.exit(0)));
  },

  async app() {
    const { defaultWorkspace, APP_FILE, openUrl } = await import('../lib/workspace.mjs');
    const ws = path.resolve(flags.workspace && flags.workspace !== true ? flags.workspace : defaultWorkspace());
    const info = path.join(ws, APP_FILE);
    const alive = async () => {
      const s = await readJson(info, null).catch(() => null);
      if (!s) return null;
      try { const r = await fetch(`${s.url}api/ping`, { signal: AbortSignal.timeout(800) }); const j = await r.json(); return j.ok && j.app && j.workspace === ws ? s : null; } catch { return null; }
    };
    let s = await alive();
    if (flags.stop) {
      if (s) { try { process.kill(s.pid); } catch { /* already gone */ } }
      await fs.rm(info, { force: true });
      return print({ stopped: !!s });
    }
    const { doctor } = await import('../lib/doctor.mjs');
    const check = await doctor();
    const failing = check.checks.filter((c) => c.required && !c.ok).map((c) => ({ name: c.name, detail: c.detail, fix: c.fix }));
    if (!s) {
      await mkdirp(ws);
      await fs.rm(info, { force: true });
      const logFile = fss.openSync(path.join(ws, '.motus-app.log'), 'a');
      // windowsHide: no console window for the server on Windows (util.run hides the programs it starts)
      const child = spawn(process.execPath, [SELF, '_app', ws, '--port', String(num(flags.port, 4700))], { detached: true, stdio: ['ignore', logFile, logFile], windowsHide: true });
      child.unref();
      for (let i = 0; i < 60 && !s; i++) { await new Promise((r) => setTimeout(r, 150)); s = await alive(); }
      if (!s) throw new MotusError('The Motus app did not start.', `See ${path.join(ws, '.motus-app.log')}`);
    }
    if (flags.open) openUrl(s.url);
    const next = `node ${cliPath(SELF)} next --agent "<your name>"`;
    print({ url: s.url, workspace: ws, ready: check.ready, failing, next, tell: `Motus is open at ${s.url}. Drop a video there. Keep this chat open: the planning work happens here in the background.` },
      (x) => `Motus is open: ${x.url}\nVideos are kept in: ${x.workspace}${x.failing.length ? `\n\nThis machine is missing ${x.failing.length} thing(s) Motus needs:\n${x.failing.map((f) => `  ${f.name}: ${f.fix}`).join('\n')}` : ''}\n\nNext, and again after every job: ${x.next}`);
  },

  async _app() {
    const { createAppServer, writeAppInfo } = await import('../lib/app.mjs');
    const ws = path.resolve(need(pos[0], 'the workspace folder', '_app <workspace>'));
    const s = await createAppServer(ws, { port: num(flags.port, 4700) });
    await writeAppInfo(ws, s);
    process.stdout.write(`app ${s.url}\n`);
    const idleLimit = num(flags.idle, 12 * 3600) * 1000;           // stop after twelve quiet hours (an open page keeps it busy)
    setInterval(() => { if (s.idleFor() > idleLimit) process.exit(0); }, 60000).unref();
    process.on('SIGTERM', () => s.close().then(() => process.exit(0)));
  },

  async next() {
    const { defaultWorkspace, nextJob } = await import('../lib/workspace.mjs');
    const ws = path.resolve(flags.workspace && flags.workspace !== true ? flags.workspace : defaultWorkspace());
    const r = await nextJob(ws, { name: flags.agent && flags.agent !== true ? String(flags.agent) : 'the agent', timeout: num(flags.timeout, 300) });
    print(r);
  },

  async say() {
    const { say } = await import('../lib/workspace.mjs');
    need(pos[0], 'the project folder', 'say <project> "what you are doing"');
    print(await say(pos[0], need(pos.slice(1).join(' '), 'what you are doing', 'say <project> "what you are doing"')));
  },

  async done() {
    const { done } = await import('../lib/workspace.mjs');
    need(pos[0], 'the project folder', 'done <project> [--summary text] [--error text]');
    print(await done(pos[0], { summary: flags.summary === true ? '' : flags.summary, error: flags.error === true ? '' : flags.error }));
  },

  async wait() {
    const p = await project(pos[0]);
    const dir = p.path('review', 'submissions');
    const seenFile = p.path('review', '.seen');
    const seen = Number(await fs.readFile(seenFile, 'utf8').catch(() => '0')) || 0;
    const deadline = flags.timeout ? Date.now() + Number(flags.timeout) * 1000 : Infinity;
    const { listFiles } = await import('../lib/project.mjs');
    const numOf = (f) => Number.parseInt(f, 10);                 // 001.json ... 999.json, 1000.json
    for (;;) {
      const files = (await listFiles(dir, /^\d+\.json$/)).sort((a, b) => numOf(a) - numOf(b));
      const fresh = files.filter((f) => numOf(f) > seen);
      if (fresh.length) {
        const last = fresh[fresh.length - 1];
        const sub = await readJson(path.join(dir, last));
        await fs.writeFile(seenFile, String(numOf(last)));
        if (sub.action === 'render') {                         // the user pressed Render: report how it ended
          const s = await readJson(p.path('review', 'server.json'), null);
          for (;;) {
            let r = null;
            try { r = await (await fetch(`${s.url}api/render`, { signal: AbortSignal.timeout(2000) })).json(); } catch { r = { status: 'error', error: 'Studio server is not reachable' }; }
            if (r.status === 'done' || r.status === 'error') { sub.render = r; break; }
            await new Promise((res) => setTimeout(res, 1500));
          }
        }
        return print(sub);
      }
      if (Date.now() > deadline) { print({ timeout: true }); process.exitCode = 3; return; }
      await new Promise((r) => setTimeout(r, 1000));
    }
  },

  async ack() {
    const p = await project(pos[0]);
    const scenes = pos.slice(1);
    const body = { scenes, all: !!flags.all || scenes.length === 0, global: !!flags.global, replies: flags.reply ? Object.fromEntries(scenes.map((s) => [s, String(flags.reply)])) : {} };
    const s = await readJson(p.path('review', 'server.json'), null);
    try {
      const r = await fetch(`${s.url}api/ack`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(3000) });
      return print(await r.json());
    } catch {
      const file = p.path('review', 'state.json');
      const state = await readJson(file, { scenes: {}, look: {}, note: '' });
      const done = [];
      for (const id of body.all ? Object.keys(state.scenes || {}) : scenes) {
        const cur = state.scenes?.[id];
        if (!cur?.note?.trim()) continue;
        (cur.history ||= []).push({ note: cur.note, addressed: new Date().toISOString(), reply: body.replies[id] || '' });
        cur.note = ''; cur.locked = false; done.push(id);
      }
      if (body.all || body.global) state.note = '';
      await writeJson(file, state);
      print({ addressed: done });
    }
  },

  async render() {
    const p = await project(pos[0]);
    const { renderProject } = await import('../lib/render.mjs');
    let last = '';
    const r = await renderProject(p, {
      draft: !!flags.draft, out: flags.out === true ? undefined : flags.out, workers: flags.workers ? Number(flags.workers) : undefined,
      range: flags.range ? String(flags.range).split(',').map(Number) : undefined,
      onProgress: (s) => { const line = `${s.phase} ${Math.round((s.progress || 0) * 100)}%`; if (line !== last) { last = line; log(line); } },
    });
    print(r, (x) => `Rendered ${x.file}\n${x.width}x${x.height} · ${x.fps.toFixed(2)} fps · ${clock(x.duration)} · ${(x.bytes / 1e6).toFixed(1)} MB · ${x.loudness ? `${x.loudness.i} LUFS, ${x.loudness.tp} dBTP · ` : ''}took ${x.seconds.toFixed(0)} s`);
  },
};

try {
  if (!cmd || cmd === '--help' || cmd === '-h') await commands.help();
  else if (!commands[cmd]) throw new MotusError(`Unknown command "${cmd}".`, 'Run: motus help');
  else await commands[cmd]();
} catch (e) {
  if (e instanceof MotusError) {
    if (asJson) process.stdout.write(JSON.stringify({ error: e.message, fix: e.fix }, null, 2) + '\n');
    else process.stderr.write(`motus: ${e.message}${e.fix ? `\n  fix: ${e.fix}` : ''}\n`);
    process.exitCode = 1;
  } else {
    // still one JSON object on stdout under --json, so an agent parsing it is never left with nothing
    if (asJson) process.stdout.write(JSON.stringify({ error: `unexpected failure: ${e?.message || e}`, fix: 'This is a Motus bug: report the command and the stack trace printed on stderr.' }, null, 2) + '\n');
    process.stderr.write(`motus: unexpected failure\n${e?.stack || e}\n`); process.exitCode = 70;
  }
}
