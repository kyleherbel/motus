// Motus app: the home page. Take a video (dropped or chosen), ask three things, create the
// project, then show every project's progress until it is ready to review in Studio.
// The server does the work; this page polls GET /api/state and draws it.

const $ = (s, root = document) => root.querySelector(s);
const POLL_MS = 1500;

function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) el.append(k instanceof Node ? k : document.createTextNode(String(k)));
  return el;
}
const setText = (el, t) => { if (el.textContent !== t) el.textContent = t; };
const clock = (s) => { if (!Number.isFinite(s)) return ''; const m = Math.floor(s / 60); return `${m}:${String(Math.round(s % 60)).padStart(2, '0')}`; };
const mb = (b) => (b >= 1e9 ? `${(b / 1e9).toFixed(1)} GB` : `${Math.round(b / 1e6)} MB`);

async function api(method, url, body) {
  const r = await fetch(url, { method, headers: { 'x-motus': '1', ...(body ? { 'content-type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(j.error || `Request failed (${r.status})`); e.fix = j.fix || ''; throw e; }
  return j;
}

const app = { state: null, online: true, setup: null };

// ------------------------------------------------------------------ the agent session

const agentName = (a) => a?.name && a.name !== 'the agent' ? a.name : 'Your AI session';

function paintAgent(s) {
  const a = s.agent;
  const el = $('#agent');
  el.dataset.on = String(!!a.connected);
  let text;
  if (!a.connected) text = 'No AI session connected';
  else if (a.state === 'working') {
    const p = s.projects.find((x) => x.dir === a.project);
    text = `${agentName(a)} is working${p ? ` on ${p.name}` : ''}`;
  } else text = `${agentName(a)} is connected`;
  setText($('#agent-text'), text);
  // the reminder matters only when something is waiting for the agent
  const needs = s.projects.some((p) => p.stage === 'waiting' || p.stage === 'planning' || p.revising);
  $('#no-agent').hidden = a.connected || !needs;
}

// ------------------------------------------------------------------ projects

const STAGES = {
  new: 'Starting', listening: 'Listening', waiting: 'Waiting', planning: 'Planning',
  review: 'Ready to review', rendered: 'Video ready', error: 'Stopped',
};
const cards = new Map();

function buildCard(p) {
  const c = { id: p.id };
  c.img = h('img', { alt: '', loading: 'lazy', src: `/api/thumb?project=${encodeURIComponent(p.id)}` });
  c.img.addEventListener('error', () => { c.img.hidden = true; });
  c.title = h('h3');
  c.chip = h('span', { class: 'chip' });
  c.meta = h('p', { class: 'meta mono' });
  c.activity = h('p', { class: 'activity' });
  c.err = h('p', { class: 'err', hidden: true });
  c.track = h('div', { class: 'track busy', hidden: true }, h('i'));
  c.actions = h('div', { class: 'actions' });
  c.el = h('article', { class: 'proj' },
    h('div', { class: 'thumb' }, c.img),
    h('div', { class: 'body' }, h('div', { class: 'title-row' }, c.title, c.chip), c.meta, c.activity, c.track, c.err, c.actions));
  c.actionSig = null;
  return c;
}

function styleName(id) { return app.state?.styles.find((s) => s.id === id)?.name || id || 'No style'; }

function describe(p, agent) {
  const who = agentName(agent);
  switch (p.stage) {
    case 'new':
    case 'listening': return { text: p.activity || 'Listening to your video', busy: true };
    case 'waiting': return agent.connected
      ? { text: `${who} will start planning in a moment.`, busy: true }
      : { text: 'Waiting for your AI session. Say "go" to it in Claude Code or Codex.', quiet: true };
    case 'planning': return { text: p.activity ? `${who}: ${p.activity}` : `${who} is planning the edit.`, busy: true };
    case 'review':
      if (p.revising) return { text: agent.connected ? `${who} is revising your notes${p.agentOnIt && p.activity ? `: ${p.activity}` : '.'}` : 'Your notes are waiting for your AI session. Say "go" to it.', busy: agent.connected };
      return { text: p.summary || p.topic || 'Pick an option for each scene, then render.', quiet: true };
    case 'rendered': return { text: p.summary || p.topic || 'The finished video is in the project folder.', quiet: true };
    default: return { text: '', quiet: true };
  }
}

function actionsFor(p) {
  const list = [];
  if (p.stage === 'review' || p.stage === 'rendered') list.push(['primary', 'Open Studio', () => openStudio(p)]);
  if (p.stage === 'rendered') list.push(['', 'Show in Finder', () => api('POST', '/api/reveal', { project: p.id }).catch(flashError)]);
  if (p.stage === 'error') list.push(['primary', 'Try again', () => api('POST', '/api/retry', { project: p.id }).then(refresh, flashError)]);
  return list;
}

function patchCard(c, p, agent) {
  c.el.dataset.stage = p.stage;
  setText(c.title, p.name);
  setText(c.chip, p.stage === 'review' && p.revising ? 'Revising' : STAGES[p.stage] || p.stage);
  const len = p.output?.duration ? `${clock(p.source?.duration)} → ${clock(p.output.duration)}` : clock(p.source?.duration);
  setText(c.meta, [styleName(p.style), len, p.mode === 'locked' ? 'every frame kept' : null].filter(Boolean).join(' · '));
  const d = describe(p, agent);
  setText(c.activity, d.text);
  c.activity.classList.toggle('quiet', !!d.quiet);
  c.track.hidden = !d.busy;
  c.err.hidden = p.stage !== 'error';
  if (p.stage === 'error') setText(c.err, [p.error?.message, p.error?.fix].filter(Boolean).join(' '));
  const acts = actionsFor(p);
  const sig = JSON.stringify(acts.map((a) => a[1]));
  if (sig !== c.actionSig) {
    c.actionSig = sig;
    c.actions.replaceChildren(...acts.map(([kind, label, fn]) => h('button', { class: `btn ${kind}`, type: 'button', onclick: fn }, label)));
  }
  c.p = p;
}

function paintProjects(s) {
  const root = $('#projects');
  const ids = new Set();
  let prev = null;
  for (const p of s.projects) {
    ids.add(p.id);
    let c = cards.get(p.id);
    if (!c) { c = buildCard(p); cards.set(p.id, c); }
    patchCard(c, p, s.agent);
    const want = prev ? prev.nextElementSibling : root.firstElementChild;
    if (want !== c.el) root.insertBefore(c.el, want);
    prev = c.el;
  }
  for (const [id, c] of cards) if (!ids.has(id)) { c.el.remove(); cards.delete(id); }
  $('#hero').hidden = s.projects.length > 0;
  $('#library').hidden = s.projects.length === 0;
}

async function openStudio(p) {
  try {
    const { url } = await api('POST', '/api/open', { project: p.id });
    location.href = url;
  } catch (e) { flashError(e); }
}

function flashError(e) { alertLine(`${e.message}${e.fix ? ` ${e.fix}` : ''}`); }
function alertLine(text) {
  const b = $('#conn');
  b.querySelector('h2').textContent = 'That did not work';
  b.querySelector('p').textContent = text;
  b.hidden = false;
  clearTimeout(alertLine.t);
  alertLine.t = setTimeout(() => { if (app.online) b.hidden = true; }, 8000);
}

// ------------------------------------------------------------------ polling

async function refresh() {
  try {
    const s = await api('GET', '/api/state');
    app.state = s;
    if (!app.online) { app.online = true; $('#conn').hidden = true; }
    paintAgent(s);
    paintProjects(s);
    if (app.setup) paintStyles();
  } catch {
    if (app.online) {
      app.online = false;
      const b = $('#conn');
      b.querySelector('h2').textContent = 'The Motus app stopped answering';
      b.querySelector('p').textContent = 'Ask your AI session to start Motus again (say "go"). This page reconnects by itself.';
      b.hidden = false;
    }
  }
}
function loop() { refresh().finally(() => setTimeout(loop, POLL_MS)); }

// ------------------------------------------------------------------ taking a video

function chooseFile() { $('#file').value = ''; $('#file').click(); }

function videoFrom(list) {
  for (const f of list || []) if (f.type.startsWith('video/') || /\.(mp4|mov|m4v|mkv|webm|avi|mts)$/i.test(f.name)) return f;
  return null;
}

function startSetup(file) {
  if (app.setup) return;
  const s = { file, upload: null, probe: null, xhr: null, style: null, error: null, done: false };
  app.setup = s;
  setText($('#setup-title'), file.name);
  setText($('#setup-facts'), mb(file.size));
  $('#prompt').value = '';
  $('#setup-error').hidden = true;
  $('#upload-fill').style.width = '0%';
  setText($('#upload-text'), 'Uploading 0%');
  for (const r of document.querySelectorAll('input[name="mode"]')) r.checked = r.value === 'raw';
  paintStyles(true);
  paintSetup();
  $('#setup').showModal();

  const xhr = new XMLHttpRequest();
  s.xhr = xhr;
  xhr.open('PUT', `/api/upload?name=${encodeURIComponent(file.name)}`);
  xhr.setRequestHeader('x-motus', '1');
  xhr.setRequestHeader('content-type', 'application/octet-stream');
  xhr.upload.onprogress = (e) => {
    if (!e.lengthComputable || app.setup !== s) return;
    const pct = Math.round((e.loaded / e.total) * 100);
    $('#upload-fill').style.width = `${pct}%`;
    setText($('#upload-text'), pct < 100 ? `Uploading ${pct}%` : 'Checking the video');
  };
  xhr.onload = () => {
    if (app.setup !== s) return;
    let j = {};
    try { j = JSON.parse(xhr.responseText); } catch { /* not JSON */ }
    if (xhr.status !== 200) { s.error = `${j.error || 'The upload failed.'} ${j.fix || ''}`.trim(); paintSetup(); return; }
    s.upload = j.upload; s.probe = j.probe; s.done = true;
    $('#upload-fill').style.width = '100%';
    setText($('#upload-text'), 'Uploaded');
    const pr = j.probe;
    setText($('#setup-facts'), `${pr.width}×${pr.height} · ${clock(pr.duration)} · ${mb(pr.bytes)}`);
    paintStyles(true);
    paintSetup();
  };
  xhr.onerror = () => { if (app.setup === s) { s.error = 'The upload stopped. Check that the Motus app is still running, then try again.'; paintSetup(); } };
  xhr.send(file);
}

function paintStyles(force = false) {
  const s = app.setup;
  const list = app.state?.styles || [];
  const root = $('#styles');
  const sig = JSON.stringify([list.map((x) => x.id), s?.probe?.aspect ?? null]);
  if (!force && root.dataset.sig === sig) return;
  root.dataset.sig = sig;
  const vertical = s?.probe ? s.probe.aspect < 1 : false;
  if (!s.style && list.length === 1) s.style = list[0].id;
  root.replaceChildren(...list.map((st) => h('label', { class: 'choice' },
    h('input', { type: 'radio', name: 'style', value: st.id, checked: s.style === st.id, onchange: () => { s.style = st.id; paintSetup(); } }),
    h('b', null, st.name),
    h('span', null, st.summary),
    st.bestFor?.length ? h('span', { class: 'best' }, `Best for: ${st.bestFor.join(', ')}`) : null,
    st.wide && vertical ? h('span', { class: 'warn' }, 'Works best from a horizontal recording. Yours is vertical, so the speaker panel shows a closer crop.') : null)));
}

function paintSetup() {
  const s = app.setup;
  if (!s) return;
  const err = $('#setup-error');
  err.hidden = !s.error;
  if (s.error) setText(err, s.error);
  const ready = s.done && s.style && !s.error;
  $('#start').disabled = !ready;
  setText($('#setup-hint'), s.error ? 'Cancel and drop the video again.' : !s.style ? 'Choose a look to continue.' : !s.done ? 'You can start as soon as the upload finishes.' : 'Ready. Motus listens first, then your AI session plans the edit.');
}

async function startEditing() {
  const s = app.setup;
  if (!s?.done || !s.style) return;
  $('#start').disabled = true;
  try {
    const mode = document.querySelector('input[name="mode"]:checked')?.value || 'raw';
    await api('POST', '/api/projects', { upload: s.upload, style: s.style, mode, prompt: $('#prompt').value.trim() });
    app.setup = null;
    $('#setup').close();
    refresh();
  } catch (e) {
    s.error = `${e.message}${e.fix ? ` ${e.fix}` : ''}`;
    paintSetup();
  }
}

function cancelSetup() {
  const s = app.setup;
  if (!s) return;
  app.setup = null;
  if (s.xhr && !s.done) s.xhr.abort();
  if (s.upload) api('DELETE', `/api/upload?id=${s.upload}`).catch(() => {});
  $('#setup').close();
}

// ------------------------------------------------------------------ start

for (const b of document.querySelectorAll('[data-choose]')) b.addEventListener('click', chooseFile);
$('#file').addEventListener('change', (e) => { const f = videoFrom(e.target.files); if (f) startSetup(f); });
$('#start').addEventListener('click', startEditing);
$('#cancel').addEventListener('click', cancelSetup);
$('#setup').addEventListener('cancel', (e) => { e.preventDefault(); cancelSetup(); });

let depth = 0;
const hasFiles = (e) => [...(e.dataTransfer?.types || [])].includes('Files');
window.addEventListener('dragenter', (e) => { if (!hasFiles(e) || app.setup) return; e.preventDefault(); depth++; $('#overlay').hidden = false; });
window.addEventListener('dragover', (e) => { if (hasFiles(e)) e.preventDefault(); });
window.addEventListener('dragleave', () => { depth = Math.max(0, depth - 1); if (!depth) $('#overlay').hidden = true; });
window.addEventListener('drop', (e) => {
  if (!hasFiles(e)) return;
  e.preventDefault();
  depth = 0; $('#overlay').hidden = true;
  if (app.setup) return;
  const f = videoFrom(e.dataTransfer.files);
  if (f) startSetup(f); else alertLine('That is not a video file. Drop an MP4, MOV, MKV or WebM file.');
});

loop();
