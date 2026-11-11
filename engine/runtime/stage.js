// The stage: loads the resolved document and the style module, then either plays it
// live over the preview proxy (mode=preview) or exposes frame-exact seeking for the
// renderer (mode=render). The style code is identical in both modes.
import * as kit from './kit/index.js';

const Q = new URLSearchParams(location.search);
const MODE = Q.get('mode') === 'render' ? 'render' : 'preview';
const stage = document.getElementById('stage');
const fit = document.getElementById('fit');
const errBox = document.getElementById('err');
const post = (msg) => { if (window.parent !== window) window.parent.postMessage({ motus: true, ...msg }, location.origin); };

function fail(e) {
  const message = e?.message || String(e);
  errBox.style.display = 'block';
  errBox.textContent = `Stage error\n\n${message}`;
  post({ type: 'error', message });
  console.error(e);
}

function fitToWindow() {
  if (MODE === 'render') return;
  const s = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
  fit.style.transform = `translate(-50%, -50%) scale(${s})`;
}

async function loadDoc(force) {
  const q = new URLSearchParams();
  for (const k of ['scene', 'option']) { const v = force ? force[k] : Q.get(k); if (v) q.set(k, v); }
  const res = await fetch(`/api/resolved?${q}`, { cache: 'no-store' });
  const doc = await res.json();
  if (doc.error) throw new Error(`${doc.error}${doc.fix ? `\n${doc.fix}` : ''}`);
  return doc;
}

/** force: { scene, option } previews one option of one scene; omit to use the URL / the current picks. */
async function build(force) {
  const doc = await loadDoc(force);
  const mod = (await import(`/styles/${doc.style}/style.js?v=${encodeURIComponent(doc.styleVersion)}`)).default;
  const footage = new kit.Footage({ width: doc.width, height: doc.height, hasMatte: doc.hasMatte });
  const env = {
    W: doc.width, H: doc.height, fps: doc.fps, mode: MODE, kit, footage,
    styleUrl: (rel) => `/styles/${doc.style}/${rel}`,
    projectUrl: (rel) => `/project/${rel}`,
  };
  await mod.setup?.(env);
  const comp = mod.compile(doc, env);
  stage.replaceChildren(comp.el);
  await comp.ready;
  await document.fonts.ready;
  return { doc, comp, footage, env };
}

// --------------------------------------------------------------------- render mode

async function bootRender() {
  document.body.classList.add('render');
  let { doc, comp, footage } = await build();
  const cache = new Map();
  const tag = Object.assign(document.createElement('div'), { hidden: true });
  tag.style.cssText = 'position:absolute;left:18px;top:18px;z-index:1000;padding:10px 18px;border-radius:10px;background:rgba(0,0,0,.78);color:#fff;font:600 44px/1.2 ui-monospace,Menlo,monospace';
  fit.append(tag);
  const frameUrl = (n) => `/project/conform/frames/${String(n + 1).padStart(6, '0')}.jpg`;
  async function bitmap(n) {
    n = Math.max(0, Math.min(doc.frames - 1, n));
    if (cache.has(n)) return cache.get(n);
    const res = await fetch(frameUrl(n));
    if (!res.ok) throw new Error(`Missing footage frame ${n} (${frameUrl(n)})`);
    const bmp = await createImageBitmap(await res.blob());
    cache.set(n, bmp);
    if (cache.size > 6) { const k = cache.keys().next().value; cache.get(k).close?.(); cache.delete(k); }
    return bmp;
  }
  // Yield once without requestAnimationFrame: rAF never fires in an unpainted window and the screenshot forces its own frame.
  const settle = () => new Promise((r) => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
  window.__motus = {
    mode: 'render',
    get frames() { return doc.frames; }, get fps() { return doc.fps; }, get duration() { return doc.duration; },
    get audio() { return comp.audio || []; },
    get scenes() { return doc.scenes.map((s) => ({ id: s.id, start: s.start, end: s.end, pick: s.pick })); },
    posterTime: (id) => comp.posterTime?.(id) ?? null,
    /** Recompile with one option forced ({scene, option}) or with the current picks ({}). */
    async rebuild(force) { ({ doc, comp, footage } = await build(force && force.scene ? force : {})); return true; },
    /** A burnt-in label for review stills; pass '' to hide it. Never used for real renders. */
    label(text) { tag.hidden = !text; tag.textContent = text || ''; },
    /** Draw output frame n completely; resolves when it is safe to screenshot. */
    async seekFrame(n) {
      footage.present(await bitmap(n));
      comp.seek(n / doc.fps);
      await comp.settled?.();
      await settle();
      return n;
    },
  };
  window.__motusReady = true;
}

// -------------------------------------------------------------------- preview mode

async function bootPreview() {
  fitToWindow();
  window.addEventListener('resize', fitToWindow);
  let { doc, comp, footage } = await build();

  const video = Object.assign(document.createElement('video'), { id: 'src', playsInline: true, preload: 'auto', src: '/project/conform/packed.mp4', muted: Q.get('muted') === '1' });
  document.body.append(video);
  await new Promise((res, rej) => { video.addEventListener('loadeddata', res, { once: true }); video.addEventListener('error', () => rej(new Error('Could not load conform/packed.mp4. Run: motus conform')), { once: true }); });

  let loop = null;                              // [a, b] seconds or null
  const draw = (t) => { footage.present(video); comp.seek(Math.max(0, Math.min(doc.duration, t))); };
  const sceneLoop = () => { const s = doc.scenes.find((x) => x.id === Q.get('scene')); return s ? [Math.max(0, s.start - 0.4), Math.min(doc.duration, s.end + 0.25)] : null; };
  if (Q.get('loop') === 'scene') loop = sceneLoop();
  else if (Q.get('loop')) { const [a, b] = Q.get('loop').split(',').map(Number); if (b > a) loop = [a, b]; }

  // ---- sound effects and music follow the video clock
  let actx = null, buffers = new Map(), live = [], music = null;
  async function sfxBuffer(name) {
    if (buffers.has(name)) return buffers.get(name);
    const rel = doc.sfx?.[name];
    if (!rel) { buffers.set(name, null); return null; }
    const p = fetch(`/styles/${doc.style}/${rel}`).then((r) => r.arrayBuffer()).then((b) => actx.decodeAudioData(b)).catch(() => null);
    buffers.set(name, p);
    return p;
  }
  function stopSfx() { for (const s of live) { try { s.stop(); } catch { /* not started */ } } live = []; }
  async function scheduleSfx() {
    stopSfx();
    if (video.muted || !doc.audio?.sfx || !(comp.audio || []).length) return;
    actx ||= new AudioContext();
    if (actx.state === 'suspended') await actx.resume().catch(() => {});
    const t0 = video.currentTime, base = actx.currentTime;
    const end = loop ? loop[1] : doc.duration;
    for (const ev of comp.audio) {
      if (ev.t < t0 - 0.01 || ev.t > end) continue;
      const buf = await sfxBuffer(ev.sfx);
      if (!buf || video.paused) continue;
      const src = actx.createBufferSource(); src.buffer = buf;
      const g = actx.createGain(); g.gain.value = 10 ** ((ev.gainDb ?? -12) / 20);
      src.connect(g).connect(actx.destination);
      src.start(base + Math.max(0, ev.t - video.currentTime));
      live.push(src);
    }
  }
  function syncMusic() {
    if (!doc.audio?.music?.url) return;
    if (!music) { music = new Audio(doc.audio.music.url); music.loop = true; music.volume = Math.min(1, 10 ** ((doc.audio.music.gainDb + 2.5) / 20)); }
    music.muted = video.muted;
    if (Math.abs(music.currentTime - video.currentTime) > 0.12) music.currentTime = video.currentTime;
    if (video.paused) music.pause(); else music.play().catch(() => {});
  }

  const tick = (_now, meta) => {
    let t = meta.mediaTime;
    if (loop && t >= loop[1]) { video.currentTime = loop[0]; t = loop[0]; if (!video.paused) scheduleSfx(); }
    draw(t);
    post({ type: 'time', t, playing: !video.paused });
    video.requestVideoFrameCallback(tick);
  };
  video.requestVideoFrameCallback(tick);
  video.addEventListener('seeked', () => { draw(video.currentTime); post({ type: 'time', t: video.currentTime, playing: !video.paused }); if (!video.paused) scheduleSfx(); syncMusic(); });
  video.addEventListener('play', () => { scheduleSfx(); syncMusic(); post({ type: 'state', playing: true }); });
  video.addEventListener('pause', () => { stopSfx(); syncMusic(); post({ type: 'state', playing: false }); });
  video.addEventListener('ended', () => { if (loop) { video.currentTime = loop[0]; video.play().catch(() => {}); } else post({ type: 'ended' }); });

  const start = loop ? loop[0] : Number(Q.get('t') || 0);
  video.currentTime = start;
  draw(start);

  const api = {
    play: () => video.play().catch((e) => post({ type: 'blocked', message: e.message })),
    pause: () => video.pause(),
    toggle: () => (video.paused ? api.play() : api.pause()),
    seek: ({ t }) => { video.currentTime = Math.max(0, Math.min(doc.duration - 0.001, t)); },
    loop: ({ range }) => { loop = Array.isArray(range) && range[1] > range[0] ? range : null; if (loop && (video.currentTime < loop[0] || video.currentTime >= loop[1])) video.currentTime = loop[0]; },
    mute: ({ muted }) => { video.muted = !!muted; if (muted) stopSfx(); else if (!video.paused) scheduleSfx(); syncMusic(); },
    /** Re-read the plan (the user picked another option, or the agent revised it) and keep the playhead. */
    reload: async () => {
      const t = video.currentTime, playing = !video.paused;
      try {
        const next = await build();
        doc = next.doc; comp = next.comp; footage = next.footage;
        draw(t);
        post({ type: 'ready', ...summary() });
        if (playing) scheduleSfx();
      } catch (e) { fail(e); }
    },
  };
  const summary = () => ({ duration: doc.duration, fps: doc.fps, scenes: doc.scenes.map((s) => ({ id: s.id, start: s.start, end: s.end, pick: s.pick })) });
  window.addEventListener('message', (e) => { if (e.origin !== location.origin || !e.data?.motus) return; api[e.data.cmd]?.(e.data); });
  window.__motusPreview = api;
  post({ type: 'ready', ...summary() });
  if (Q.get('autoplay') === '1') api.play();
}

(MODE === 'render' ? bootRender() : bootPreview()).catch((e) => { fail(e); window.__motusError = e?.message || String(e); });
