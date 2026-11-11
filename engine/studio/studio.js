// Motus Studio: review an edit plan scene by scene, then render it.
//
// This file is the conductor. It owns the model (GET /api/project), sends every change
// to the server one at a time, listens to the server's event stream, and tells the
// parts of the page (monitor.js, scenes.js, notes.js, zones.js) to repaint.
import { $, h, icon, api, tc, plural, bytes, when, copyText, prefs, setText, setAttr, setHidden } from './lib.js';
import { createMonitor } from './monitor.js';
import { createScenes } from './scenes.js';
import { createNoteField } from './notes.js';
import { buildOverlay } from './zones.js';

const OVERALL_NOTE_MAX = 8000;        // the server keeps this many characters of the overall note
const LOST_AFTER_MS = 6000;           // how long the event stream may be down before Studio says so
const FLASH_MS = 6000;

const app = {
  model: null,
  current: null,                      // the scene the keyboard acts on
  filter: 'all',
  zones: !!prefs.get('zones', false),
  render: { status: 'idle' },
  online: true,
  planError: null,                    // the last GET /api/project failed for a reason other than the connection
  sent: null,                         // signature of the notes last sent to the agent
  renderSig: null,                    // pickSignature() of the plan the last finished render drew
  flash: null,                        // a short-lived status line
};

const el = {
  app: $('#app'), name: $('#p-name'), style: $('#p-style'), styleV: $('#p-style-v'), source: $('#p-source'), length: $('#p-length'),
  count: $('#p-count'), track: $('#p-track'), fill: $('#p-fill'), conn: $('#conn'),
  connBanner: $('#conn-banner'), planBanner: $('#plan-banner'), planBannerText: $('#plan-banner-text'),
  problems: $('#problems'), problemsTitle: $('#problems-title'), problemList: $('#problem-list'),
  look: $('#look'), overall: $('#overall'), filters: $('#filters'), final: $('#final'),
  barText: $('#bar-text'), barTrack: $('#bar-track'), barFill: $('#bar-fill'), lockAll: $('#lock-all'), primary: $('#primary'),
  zonesBtn: $('#zones'), help: $('#help'), helpBtn: $('#help-btn'),
};

let monitor, scenes, overall;
const sceneOf = (id) => app.model?.scenes.find((s) => s.id === id) || null;
const numberOf = (sc) => sc.index + 1;

// ------------------------------------------------------------------ talking to the server

let seq = 0, applied = 0;
function accept(model, n) {
  if (n < applied) return;            // an older answer arriving late
  applied = n;
  app.model = model;
  paint();
}

// Changes go to the server strictly one after another: it rewrites one state file per
// request, so two overlapping requests could lose one of the changes.
let queue = Promise.resolve();
function put(patch) {
  const run = async () => {
    const n = ++seq;
    try {
      const model = await api.state(patch);
      setOnline(true);
      accept(model, n);
      return model;
    } catch (e) {
      if (e.offline) setOnline(false);
      throw e;
    }
  };
  const p = queue.then(run, run);
  queue = p.catch(() => {});
  return p;
}

/** A change made by a button or key: failures are explained in the status line. */
async function change(patch, what) {
  try { await put(patch); return true; } catch (e) {
    if (!e.offline) flash(`${what} did not save: ${e.message}${e.fix ? ` ${e.fix}` : ''}`);
    return false;
  }
}

let refreshing = null, refreshAgain = false, refreshTimer = null;
function refresh() {
  if (refreshing) { refreshAgain = true; return refreshing; }
  refreshing = (async () => {
    do {
      refreshAgain = false;
      const n = ++seq;
      try {
        accept(await api.project(), n);
        setPlanError(null);
        setOnline(true);
        await syncPreviews();
      } catch (e) {
        if (e.offline) setOnline(false); else setPlanError(e);
      }
    } while (refreshAgain);
  })().finally(() => { refreshing = null; });
  return refreshing;
}
function refreshSoon() { clearTimeout(refreshTimer); refreshTimer = setTimeout(refresh, 80); }

// The monitor is reloaded only when the document it draws really changed: a pick, the
// look, or the plan. Posters arriving, notes and locks leave it alone.
let stageDoc = null;
async function syncPreviews() {
  let text;
  try { text = await api.resolvedText(); } catch { return false; }
  if (stageDoc === null) { stageDoc = text; monitor.load(); return false; }
  if (text === stageDoc) return false;
  stageDoc = text;
  monitor.reload();
  scenes.planChanged();
  return true;
}

// ------------------------------------------------------------------ connection

let pingTimer = null;
function setOnline(on) {
  if (app.online === on) return;
  app.online = on;
  setHidden(el.connBanner, on);
  setText(el.conn, on ? 'Live' : 'Offline');
  clearInterval(pingTimer);
  // While offline, keep knocking: the event stream may still look open after one failed request.
  if (!on) pingTimer = setInterval(() => { fetch('/api/ping', { cache: 'no-store' }).then((r) => { if (r.ok) setOnline(true); }, () => {}); }, 3000);
  else catchUp();
  paintBar();
}

/** Back after a gap: read everything that may have been missed, and save what could not be saved. */
function catchUp() {
  if (!scenes) return;
  refresh();
  retryNotes();
  api.render().then(setRender, () => {});
}

function setPlanError(e) {
  app.planError = e || null;
  setHidden(el.planBanner, !e);
  if (e) {
    setText(el.planBannerText, `${e.message}${e.fix ? ` ${e.fix}` : ''} ${app.model ? 'The page shows the last plan it could read and' : 'This page'} updates by itself when that is fixed.`);
    if (!app.model) setText(el.name, 'Waiting for the plan');
  }
  paintBar();
}

function connect() {
  let lostTimer = null, opened = false;
  const open = () => {
    const es = new EventSource('/api/events');
    es.onopen = () => {
      clearTimeout(lostTimer); lostTimer = null;
      setText(el.conn, 'Live');
      const blip = opened && app.online;   // the stream dropped and came back before Studio called it lost
      opened = true;
      setOnline(true);                     // catches up by itself when Studio had gone offline
      if (blip) catchUp();
    };
    es.onmessage = (ev) => {
      let d;
      try { d = JSON.parse(ev.data); } catch { return; }
      if (d.type === 'hello') { if (d.render) setRender(d.render); }
      else if (d.type === 'plan' || d.type === 'state') refreshSoon();
      else if (d.type === 'render') { const { type, ...r } = d; setRender(r); }
    };
    es.onerror = () => {
      if (app.online) setText(el.conn, 'Reconnecting');
      if (!lostTimer) lostTimer = setTimeout(() => setOnline(false), LOST_AFTER_MS);
      if (es.readyState === EventSource.CLOSED) { es.close(); setTimeout(open, 3000); }   // the browser gave up: keep trying ourselves
    };
  };
  open();
}

function retryNotes() { scenes.flushNotes(); overall.flush(); }

// ------------------------------------------------------------------ actions

function select(id, { scroll = false, seek = false } = {}) {
  if (!sceneOf(id)) return;
  if (app.current !== id) { app.current = id; paintSelection(); }
  if (scroll) scenes.reveal(id);
  if (seek) monitor.showScene(id);
}

async function pick(sceneId, optionId) {
  const sc = sceneOf(sceneId);
  if (!sc) return;
  if (sc.locked) { flash(`Scene ${numberOf(sc)} is locked. Unlock it to change the option.`); return; }
  if (!sc.options.some((o) => o.id === optionId)) return;
  select(sceneId);
  if (!(await change({ scene: sceneId, pick: optionId }, 'That pick'))) return;
  await syncPreviews();               // reloads the monitor if the picture changed
  await monitor.settled();
  monitor.showScene(sceneId, { loop: true, play: true });   // show the choice in context, straight away
}

async function lock(sceneId, locked) {
  const sc = sceneOf(sceneId);
  if (!sc) return;
  select(sceneId);
  // Locking records the option on screen as the person's own pick, so a later change of
  // the agent's recommendation cannot silently swap what was approved.
  await change(locked ? { scene: sceneId, pick: sc.pick, locked: true } : { scene: sceneId, locked: false }, locked ? 'That lock' : 'That unlock');
}

function play(sceneId) {
  select(sceneId);
  monitor.showScene(sceneId, { loop: true, play: true });
}

async function lockAll() {
  await flushNotes();
  await change({ lockAll: true }, 'Locking every scene');
}

async function setLook(key, value) {
  if (app.model.look[key] === value) return;
  if (await change({ look: { [key]: value } }, 'That look choice')) await syncPreviews();
}

function setFilter(name) {
  app.filter = name;
  for (const b of el.filters.querySelectorAll('button')) setAttr(b, 'aria-pressed', b.dataset.filter === name);
  paintScenes();
}

function setZones(on) {
  app.zones = !!on;
  prefs.set('zones', app.zones);
  setAttr(el.app, 'data-zones', app.zones ? 'on' : 'off');
  setAttr(el.zonesBtn, 'aria-pressed', app.zones);
}

const flushNotes = async () => (await Promise.all([scenes.flushNotes(), overall.flush()])).every(Boolean);

/** Everything the person has written, as one comparable string: unsaved typing included. */
function notesSignature() {
  const list = scenes.notes();
  const whole = overall.value().trim();
  return { count: list.length + (whole ? 1 : 0), sceneCount: list.length, text: JSON.stringify([whole, list]) };
}
function markSent() {
  clearFlash();
  app.sent = notesSignature().text;
  if (app.model) prefs.set(`sent:${app.model.project.dir}`, app.sent);
  paintBar();
}

async function sendNotes() {
  setAttr(el.primary, 'aria-busy', 'true');
  try {
    if (!(await flushNotes())) { flash('Your notes could not be saved, so nothing was sent. Check the connection and try again.'); return; }
    await api.submit('notes');
    markSent();
  } catch (e) {
    if (e.offline) setOnline(false); else flash(`The notes were not sent: ${e.message}${e.fix ? ` ${e.fix}` : ''}`);
  } finally { el.primary.removeAttribute('aria-busy'); }
}

async function renderFinal() {
  try {
    await flushNotes();
    setRender({ status: 'running', phase: 'starting', progress: 0 });
    await api.submit('render');
  } catch (e) {
    setRender({ status: 'idle' });
    if (e.offline) setOnline(false); else flash(`The render did not start: ${e.message}${e.fix ? ` ${e.fix}` : ''}`);
  }
}

/** What the primary button does right now. One function decides label, state and action. */
function primaryState() {
  const m = app.model;
  if (!m) return { label: 'Render final video', enabled: false, text: app.planError ? 'Studio cannot read the plan yet. This page updates by itself as soon as it can.' : 'Loading the plan.' };
  if (!m.total) return { label: 'Render final video', enabled: false, text: 'The plan has no scenes yet. This page updates by itself when the agent writes them.' };
  const r = app.render;
  const notes = notesSignature();
  const revised = m.scenes.filter((s) => s.revised).length;
  const allLocked = m.total > 0 && m.locked === m.total;

  if (!app.online) return { label: notes.count ? 'Send notes to the agent' : 'Render final video', enabled: false, text: 'Studio lost its connection. Run "motus studio" again to restore it; nothing is lost.' };
  if (r.status === 'running') {
    const pct = Math.round((r.progress || 0) * 100);
    return { label: 'Rendering', enabled: false, progress: pct, text: `Rendering: ${r.phase || 'starting'}, ${pct}%. The finished video appears on this page.` };
  }
  if (notes.count) {
    const n = notes.count;
    // Sent and unchanged since: nothing new to send, so the button rests until a note changes.
    if (app.sent === notes.text) return { label: 'Notes sent', enabled: false, text: 'Your notes went to the agent. This page updates by itself when revised options arrive.' };
    return {
      label: 'Send notes to the agent', enabled: true, action: sendNotes,
      text: `${n} ${plural(n, 'note')} ready. Send ${n === 1 ? 'it' : 'them'} and the agent revises the plan; this page then updates by itself.`,
    };
  }
  if (revised) return { label: 'Render final video', enabled: allLocked, action: renderFinal, text: `The agent updated ${revised} ${plural(revised, 'scene')}. Review ${revised === 1 ? 'it' : 'them'} again, then lock ${revised === 1 ? 'it' : 'them'}.` };
  if (m.problems.length) {
    const n = m.problems.length;
    return { label: 'Render final video', enabled: false, text: `The plan has ${n} ${plural(n, 'problem')} the agent must fix before it can render. ${n === 1 ? 'It is' : 'They are'} listed at the top; you can keep reviewing meanwhile.` };
  }
  if (allLocked) {
    if (r.status === 'error') return { label: 'Try the render again', enabled: true, action: renderFinal, text: 'The last render stopped. The reason is at the end of this page; sort it out, then try again.' };
    if (r.status === 'done' && app.renderSig === pickSignature(m)) return { label: 'Render again', enabled: true, action: renderFinal, text: 'Your final video is ready at the end of this page. To change it, unlock a scene, adjust it and render again.' };
    if (m.final) return { label: 'Render final video', enabled: true, action: renderFinal, text: 'Every scene is locked. The video at the end of this page is from an earlier render; render again to include any changes since.' };
    return { label: 'Render final video', enabled: true, action: renderFinal, text: 'Every scene is locked. Render the final video when you are ready.' };
  }
  return { label: 'Render final video', enabled: false, text: `${m.locked} of ${m.total} scenes locked. Lock the rest to render, or write a note where something should change.` };
}

function runPrimary() {
  const s = primaryState();
  if (s.enabled && s.action) s.action();
  else if (app.model) flash(s.text);
}

/** A short-lived line in the status area, for something that just happened (or could not). */
function flash(text) {
  clearTimeout(app.flash?.timer);
  app.flash = { text, timer: setTimeout(() => { app.flash = null; paintBar(); }, FLASH_MS) };
  paintBar();
}
function clearFlash() { clearTimeout(app.flash?.timer); app.flash = null; }

/** What a render draws: every scene's option and the look. A render is current while this is unchanged. */
const pickSignature = (m) => JSON.stringify([m.look, m.scenes.map((s) => [s.id, s.pick])]);

function setRender(r) {
  const before = app.render.status;
  app.render = r && r.status ? r : { status: 'idle' };
  if (app.render.status === 'done' && before !== 'done') app.renderSig = app.model ? pickSignature(app.model) : 'pending';
  if (app.render.status !== before) clearFlash();      // progress and results always show at once
  paintBar();
  paintFinal();
  if (before === 'running' && app.render.status !== 'running') {
    refresh();                        // model.final now exists
    el.final.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }
}

// ------------------------------------------------------------------ painting

function paintHeader(m) {
  setText(el.name, m.project.name);
  document.title = `${m.project.name} · Motus Studio`;
  setText(el.style, m.style.name);
  setText(el.styleV, m.style.version ? `v${m.style.version}` : '');
  setText(el.source, m.project.source);
  setText(el.length, `${tc(m.duration)} · ${m.total} ${plural(m.total, 'scene')}`);
  setText(el.count, `${m.locked} of ${m.total} ${plural(m.total, 'scene')} locked`);
  el.fill.style.width = m.total ? `${(m.locked / m.total) * 100}%` : '0%';
  setAttr(el.track, 'aria-valuemax', m.total);
  setAttr(el.track, 'aria-valuenow', m.locked);
}

let problemSig = null;
function paintProblems(m) {
  const list = m.problems || [];
  const sig = JSON.stringify(list);
  if (sig === problemSig) return;
  problemSig = sig;
  setHidden(el.problems, !list.length);
  setText(el.problemsTitle, `The plan has ${list.length} ${plural(list.length, 'problem')}`);
  el.problemList.replaceChildren(...list.map((p) => h('li', null,
    h('span', { class: 'mono problem-path' }, p.path || 'edit.json'),
    h('span', { class: 'problem-msg' }, p.message || ''),
    p.fix ? h('span', { class: 'problem-fix' }, p.fix) : null)));
}

const lookViews = new Map();          // look key -> { sig, buttons: Map(choice -> button) }
function paintLook(m) {
  const spec = m.style.look || {};
  const keys = Object.keys(spec).filter((k) => Array.isArray(spec[k]?.choices) && spec[k].choices.length);
  for (const [key, view] of lookViews) if (!keys.includes(key)) { view.el.remove(); lookViews.delete(key); }
  for (const key of keys) {
    const sig = JSON.stringify(spec[key]);
    let view = lookViews.get(key);
    if (!view || view.sig !== sig) {
      view?.el.remove();
      const buttons = new Map();
      const group = h('div', { class: 'seg', role: 'group', 'aria-label': spec[key].label || key });
      for (const choice of spec[key].choices) {
        const b = h('button', { type: 'button', 'aria-pressed': 'false' }, String(choice));
        b.addEventListener('click', () => setLook(key, choice));
        buttons.set(choice, b);
        group.append(b);
      }
      view = { sig, buttons, el: h('div', { class: 'field' }, h('span', { class: 'field-label' }, spec[key].label || key), group) };
      lookViews.set(key, view);
      el.look.append(view.el);
    }
    for (const [choice, b] of view.buttons) setAttr(b, 'aria-pressed', m.look[key] === choice);
  }
  setHidden(el.look, !keys.length);
}

let overallHistorySig = null;
function paintOverall(m) {
  overall.sync(m.note);
  const sig = JSON.stringify(m.history || []);
  if (sig === overallHistorySig) return;
  overallHistorySig = sig;
  overall.history.replaceChildren(...(m.history || []).map((item) => h('li', null,
    h('p', { class: 'h-note' }, item.note || ''),
    item.reply ? h('p', { class: 'h-reply' }, h('span', { class: 'h-who' }, 'The agent: '), item.reply) : null,
    h('p', { class: 'h-meta mono' }, `Addressed ${when(item.addressed)}`.trim()))));
  setHidden(overall.history, !(m.history || []).length);
}

/** The keyboard never acts on a scene the filter is hiding: move on to the next one still shown. */
function keepCurrentVisible() {
  if (!app.model || !scenes) return;
  const ids = scenes.visibleIds();
  if (!ids.length || ids.includes(app.current)) return;
  const order = app.model.scenes.map((s) => s.id);
  const at = order.indexOf(app.current);
  app.current = ids.find((id) => order.indexOf(id) > at) ?? ids[ids.length - 1];
  scenes.setCurrent(app.current);
  monitor.update(app.model, app.current);
}

function paintScenes() {
  const m = app.model;
  if (!m) return;
  scenes.update(m, { filter: app.filter, current: app.current });
  keepCurrentVisible();
  const c = scenes.counts();
  for (const b of el.filters.querySelectorAll('button')) setText(b.querySelector('[data-count]'), c[b.dataset.filter]);
}

function paintSelection() {
  if (!app.model) return;
  scenes.setCurrent(app.current);
  monitor.update(app.model, app.current);
}

function paintBar() {
  if (!scenes) return;                // called before start() has built the page
  const s = primaryState();
  const m = app.model;
  setText(el.primary, s.label);
  el.primary.disabled = !s.enabled;
  el.lockAll.disabled = !m || !app.online || app.render.status === 'running' || m.total === 0 || m.locked === m.total;
  setText(el.barText, app.flash ? app.flash.text : s.text);
  const running = app.render.status === 'running';
  setHidden(el.barTrack, !running);
  if (running) { el.barFill.style.width = `${s.progress}%`; setAttr(el.barTrack, 'aria-valuenow', s.progress); }
  if (m && app.sent && !notesSignature().count) { app.sent = null; prefs.set(`sent:${m.project.dir}`, null); }
  const c = scenes.counts();
  for (const b of el.filters.querySelectorAll('button')) setText(b.querySelector('[data-count]'), c[b.dataset.filter]);
}

let finalKey = null;
function paintFinal() {
  const m = app.model, r = app.render;
  let key = null, build = null;
  if (r.status === 'error') {
    key = `error:${r.error}`;
    build = () => [h('div', { class: 'final-text' },
      h('h2', null, 'The render stopped'),
      h('pre', { class: 'mono final-error' }, r.error || 'Unknown error.'),
      r.fix ? h('p', { class: 'final-fix' }, r.fix) : null,
      h('p', { class: 'final-next' }, 'Nothing was lost. Sort that out (the agent can help), then try the render again.'))];
  } else if (r.status === 'done' && r.url) {
    key = `done:${r.url}:${r.seconds}`;
    build = () => finalVideo(r.url, r.file, r.info, r.seconds, !!r.draft);
  } else if (r.status !== 'running' && m?.final) {
    key = `file:${m.final}`;
    build = () => finalVideo(m.final, `${m.project.dir}/renders/final.mp4`, null, null, false, true);
  }
  if (key === finalKey) return;
  finalKey = key;
  el.final.replaceChildren(...(build ? build() : []));
  setHidden(el.final, !build);
}

function finalVideo(url, file, info, seconds, draft, earlier = false) {
  const video = h('video', { controls: true, playsinline: true, preload: 'metadata', src: `${url}?v=${Date.now()}` });
  const copy = h('button', { class: 'btn sm', type: 'button' }, 'Copy path');
  copy.addEventListener('click', async () => {
    const ok = await copyText(file);
    setText(copy, ok ? 'Copied' : 'Copy failed: select the path instead');
    setTimeout(() => setText(copy, 'Copy path'), 2400);
  });
  const facts = info ? [`${info.width}×${info.height}`, `${Number(info.fps).toFixed(2)} fps`, tc(info.duration), bytes(info.bytes), seconds ? `rendered in ${Math.round(seconds)} s` : ''].filter(Boolean).join(' · ') : '';
  return [
    h('div', { class: 'final-player' }, video),
    h('div', { class: 'final-text' },
      earlier ? h('h2', null, 'Your last render') : h('h2', { class: 'final-done' }, icon('check'), draft ? 'Your draft is ready' : 'Your video is ready'),
      h('p', { class: 'final-next' }, earlier ? 'Rendered in an earlier session. If you changed anything since, render again to include it.' : 'This is the finished file. To change anything, unlock that scene, adjust it and render again.'),
      h('p', { class: 'path mono' }, file),
      h('div', { class: 'final-actions' }, copy, facts ? h('span', { class: 'mono final-facts' }, facts) : null)),
  ];
}

function paint() {
  const m = app.model;
  if (!m) return;
  if (app.sent === null) app.sent = prefs.get(`sent:${m.project.dir}`, null);
  if (app.renderSig === 'pending') app.renderSig = pickSignature(m);
  if (!sceneOf(app.current)) app.current = (m.scenes.find((s) => !s.locked) || m.scenes[0])?.id ?? null;
  paintHeader(m);
  paintProblems(m);
  paintLook(m);
  paintOverall(m);
  paintScenes();
  monitor.update(m, app.current);
  paintBar();
  paintFinal();
}

// ------------------------------------------------------------------ keyboard and help

function step(dir) {
  const ids = scenes.visibleIds();
  if (!ids.length) return;
  const i = Math.max(0, ids.indexOf(app.current));
  select(ids[Math.max(0, Math.min(ids.length - 1, i + dir))], { scroll: true, seek: true });
}

function toggleHelp(force) {
  const show = force === undefined ? el.help.hidden : force;
  setHidden(el.help, !show);
  setAttr(el.helpBtn, 'aria-expanded', show);
}

function onKey(e) {
  if (e.defaultPrevented) return;
  const target = e.target instanceof HTMLElement ? e.target : document.body;
  const typing = target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {     // the one shortcut that also works from inside a note
    e.preventDefault();
    if (typing) target.blur();
    runPrimary();
    return;
  }
  if (e.key === 'Escape') {
    if (!el.help.hidden) toggleHelp(false);
    else if (typing) target.blur();
    return;
  }
  if (typing || e.metaKey || e.ctrlKey || e.altKey || !app.model) return;
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const sc = sceneOf(app.current);
  if (key === 'j') step(1);
  else if (key === 'k') step(-1);
  else if (/^[1-4]$/.test(key)) {
    const o = sc?.options[Number(key) - 1];
    if (o) pick(sc.id, o.id); else if (sc) flash(`Scene ${numberOf(sc)} has ${sc.options.length} ${plural(sc.options.length, 'option')}.`);
  } else if (key === 'l') { if (sc) lock(sc.id, !sc.locked); }
  else if (key === 'n') {
    if (!sc) return;
    e.preventDefault();               // or the "n" lands in the note
    if (!scenes.focusNote(sc.id)) flash(`Scene ${numberOf(sc)} is locked. Press L to unlock it, then write your note.`);
  } else if (key === 's') setZones(!app.zones);
  else if (key === '?') toggleHelp();
  else if (key === ' ') {
    if (target.closest('button, a[href], summary, video, audio, [role="button"]')) return;   // Space presses the focused control
    e.preventDefault();
    monitor.toggle();
  }
}

// ------------------------------------------------------------------ start

async function start() {
  const zones = await api.zones().catch(() => null);
  $('#monitor-zones').replaceWith(buildOverlay(zones));
  setZones(app.zones);

  monitor = createMonitor({ onSelect: (id) => select(id, { scroll: true, seek: true }), onNotice: flash });
  scenes = createScenes({
    root: $('#scenes'), empty: $('#empty'), zones,
    actions: { select: (id) => select(id), pick, lock, play, saveNote: (id, text) => put({ scene: id, note: text }) },
    onNoteInput: () => paintBar(),
    onFiltered: () => keepCurrentVisible(),
  });

  const overallField = createNoteField({
    label: 'Overall note',
    placeholder: 'Anything about the whole video: pacing, tone, captions, music.',
    max: OVERALL_NOTE_MAX,
    save: (text) => put({ note: text }),
    onInput: () => paintBar(),
  });
  overall = Object.assign(overallField, { history: h('ol', { class: 'history', 'aria-label': 'Earlier overall notes the agent has addressed', hidden: true }) });
  el.overall.append(overall.history, overall.el);

  el.filters.addEventListener('click', (e) => { const b = e.target.closest('button[data-filter]'); if (b) setFilter(b.dataset.filter); });
  el.zonesBtn.addEventListener('click', () => setZones(!app.zones));
  el.lockAll.addEventListener('click', lockAll);
  el.primary.addEventListener('click', runPrimary);
  el.helpBtn.addEventListener('click', () => toggleHelp());
  document.addEventListener('pointerdown', (e) => { if (!el.help.hidden && !el.help.contains(e.target) && !el.helpBtn.contains(e.target)) toggleHelp(false); });
  document.addEventListener('keydown', onKey);
  // Anything still unsaved goes out as the page is hidden or closed.
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') retryNotes(); });
  window.addEventListener('pagehide', retryNotes);

  // The monitor (in a narrow window) and the action bar are sticky: tell the browser how much
  // of the viewport they cover, so scrolling to a scene or a focused field never hides it under them.
  const narrow = matchMedia('(max-width: 1099.98px)');
  const measure = () => {
    const root = document.documentElement.style;
    root.setProperty('--sticky-top', narrow.matches ? `${Math.ceil($('#monitor').getBoundingClientRect().height)}px` : '0px');
    root.setProperty('--sticky-bottom', `${Math.ceil($('#bar').getBoundingClientRect().height)}px`);
  };
  const watcher = new ResizeObserver(measure);
  watcher.observe($('#monitor'));
  watcher.observe($('#bar'));
  narrow.addEventListener('change', measure);
  measure();

  connect();
  api.render().then((r) => { if (app.render.status === 'idle') setRender(r); }, () => {});
  await refresh();
}

start();
