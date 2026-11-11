// The monitor: the current cut in a stage iframe, its transport, and the scene timeline.
//
// The stage owns playback. This module only sends it commands and paints what it reports
// (time, playing, ready). It is reloaded on request, never on its own initiative.
import { $, h, icon, tc, pad2, setText, setAttr, setFlag } from './lib.js';

const STAGE_URL = '/runtime/stage.html?mode=preview';
const HANDLE_IN = 0.4;      // seconds of the previous scene shown before a looped scene
const HANDLE_OUT = 0.25;    // and of the next one after it
const READY_TIMEOUT_MS = 5000;

/**
 * opt: { onSelect(sceneId), onNotice(text) }
 */
export function createMonitor({ onSelect, onNotice }) {
  const frame = $('#monitor-frame');
  const message = $('#player-msg');
  const playBtn = $('#play');
  const muteBtn = $('#mute');
  const loopBtn = $('#loop');
  const timeEl = $('#time');
  const timeline = $('#timeline');
  const playhead = h('div', { class: 'playhead', 'aria-hidden': 'true' });
  timeline.append(playhead);

  const blocks = new Map();   // scene id -> { el, num }
  let scenes = [];
  let duration = 0;
  let loaded = false;         // the iframe has been given its URL
  let ready = false;          // the stage answered
  let broken = false;         // the stage reported an error: the next reload starts it afresh
  let reloadWhenReady = false;
  let playing = false;
  let muted = false;
  let t = 0;
  let loopId = null;
  let loopRange = null;
  let waiters = [];
  let settledPromise = Promise.resolve();

  const send = (cmd, extra) => { if (ready) frame.contentWindow?.postMessage({ motus: true, cmd, ...extra }, location.origin); };
  const byId = (id) => scenes.find((s) => s.id === id) || null;
  const sceneAt = (time) => scenes.find((s) => time >= s.start && time < s.end) || scenes[scenes.length - 1] || null;
  const rangeOf = (s) => [Math.max(0, s.start - HANDLE_IN), Math.min(duration, s.end + HANDLE_OUT)];

  function say(text) { setText(message, text || ''); message.hidden = !text; }

  function paintPlaying(on) {
    if (on === playing && playBtn.firstChild) return;
    playing = !!on;
    playBtn.replaceChildren(icon(playing ? 'pause' : 'play'));
    setAttr(playBtn, 'aria-label', playing ? 'Pause' : 'Play');
  }
  function paintMute() {
    muteBtn.replaceChildren(icon(muted ? 'muted' : 'sound'));
    setAttr(muteBtn, 'aria-pressed', muted);
    setAttr(muteBtn, 'aria-label', muted ? 'Sound is off. Turn it on' : 'Sound is on. Turn it off');
  }
  function paintTime() {
    setText(timeEl, `${tc(Math.min(t, duration), true)} / ${tc(duration)}`);
    playhead.style.left = duration > 0 ? `${Math.max(0, Math.min(1, t / duration)) * 100}%` : '0%';
  }
  function releaseWaiters() { const list = waiters; waiters = []; for (const done of list) done(); }
  function nextReady() {
    return new Promise((resolve) => { waiters.push(resolve); setTimeout(resolve, READY_TIMEOUT_MS); });
  }

  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin || e.source !== frame.contentWindow || !e.data?.motus) return;
    const d = e.data;
    if (d.type === 'ready') {
      ready = true; broken = false;
      if (Number.isFinite(d.duration)) duration = d.duration;
      say('');
      playBtn.disabled = false;
      if (reloadWhenReady) { reloadWhenReady = false; send('reload'); return; }   // the plan moved while the stage was starting
      if (muted) send('mute', { muted: true });
      if (loopRange) send('loop', { range: loopRange });
      paintTime();
      releaseWaiters();
    } else if (d.type === 'time') {
      t = Number(d.t) || 0;
      paintPlaying(d.playing);
      paintTime();
    } else if (d.type === 'state') {
      paintPlaying(d.playing);
    } else if (d.type === 'ended') {
      paintPlaying(false);
    } else if (d.type === 'blocked') {
      if (!muted) {
        muted = true; paintMute();
        send('mute', { muted: true }); send('play');
        onNotice('Your browser would not start sound by itself, so the cut is playing muted. Press the speaker button to turn sound on.');
      } else {
        onNotice('Your browser would not start playback. Click the player to start it.');
      }
    } else if (d.type === 'error') {
      broken = true;
      paintPlaying(false);
      say(`The preview stopped: ${String(d.message || 'unknown error').split('\n')[0]}`);
      releaseWaiters();
    }
  });

  function toggle() { send('toggle'); }
  playBtn.addEventListener('click', toggle);
  $('#player-hit').addEventListener('click', toggle);
  muteBtn.addEventListener('click', () => { muted = !muted; paintMute(); send('mute', { muted }); });
  loopBtn.addEventListener('click', () => setLoop(loopId ? null : sceneAt(t)?.id ?? null));

  function setLoop(id) {
    const s = id ? byId(id) : null;
    loopId = s ? s.id : null;
    loopRange = s ? rangeOf(s) : null;
    setAttr(loopBtn, 'aria-pressed', !!s);
    send('loop', { range: loopRange });
  }

  function makeBlock(id) {
    const num = h('span', { class: 'tl-num mono' });
    const el = h('button', { class: 'tl-block', type: 'button' }, h('i', { class: 'tl-fill' }), num, h('i', { class: 'tl-dot' }));
    el.addEventListener('click', () => onSelect(id));
    return { el, num };
  }

  paintPlaying(false);
  paintMute();

  return {
    /** Start the stage. Called once, after Studio has read the plan the stage is about to load. */
    load() { loaded = true; frame.src = STAGE_URL; },

    /** Repaint the timeline from the model and keep a running loop on its scene. */
    update(model, currentId) {
      scenes = model.scenes;
      duration = model.duration;
      const seen = new Set();
      let prev = playhead;
      for (const s of scenes) {
        let b = blocks.get(s.id);
        if (!b) { b = makeBlock(s.id); blocks.set(s.id, b); }
        seen.add(s.id);
        b.el.style.left = `${(s.start / duration) * 100}%`;
        b.el.style.width = `${((s.end - s.start) / duration) * 100}%`;
        const state = s.locked ? 'locked' : s.decided ? 'picked' : 'open';
        setAttr(b.el, 'data-state', state);
        setFlag(b.el, 'data-note', !!s.note.trim());
        setFlag(b.el, 'data-revised', s.revised);
        setFlag(b.el, 'data-current', s.id === currentId);
        setText(b.num, pad2(s.index + 1));
        const words = [state === 'locked' ? 'locked' : state === 'picked' ? 'option picked' : 'not decided'];
        if (s.note.trim()) words.push('has a note');
        if (s.revised) words.push('updated by the agent');
        const name = `Scene ${s.index + 1}, ${tc(s.start)} to ${tc(s.end)}, ${words.join(', ')}`;
        setAttr(b.el, 'aria-label', name);
        setAttr(b.el, 'title', name);
        if (prev.nextElementSibling !== b.el) prev.after(b.el);
        prev = b.el;
      }
      for (const [id, b] of blocks) if (!seen.has(id)) { b.el.remove(); blocks.delete(id); }
      if (loopId) {
        const s = byId(loopId);
        const range = s ? rangeOf(s) : null;
        if (!range || !loopRange || range[0] !== loopRange[0] || range[1] !== loopRange[1]) setLoop(s ? s.id : null);
      }
      paintTime();
    },

    /** Re-read the plan in the stage. Resolves when the stage is ready again. */
    reload() {
      if (!loaded) return Promise.resolve();
      if (!ready) { reloadWhenReady = true; settledPromise = nextReady(); return settledPromise; }
      if (broken) {                       // the stage keeps its error screen up: start it afresh, at the same time
        ready = false; playBtn.disabled = true;
        frame.src = `${STAGE_URL}&t=${encodeURIComponent(t.toFixed(3))}`;
      } else send('reload');
      settledPromise = nextReady();
      return settledPromise;
    },
    /** Resolves when no reload is in flight. */
    settled: () => settledPromise,

    /** Put the playhead on a scene. loop: true starts looping it; an already running loop follows the scene. */
    showScene(id, { loop = false, play = false } = {}) {
      const s = byId(id);
      if (!s) return;
      if (loop || loopId) setLoop(id);
      send('seek', { t: s.start });
      if (play) send('play');
    },
    toggle,
  };
}
