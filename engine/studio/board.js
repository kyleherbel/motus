// The scene grid: every scene as a 9:16 tile playing a short loop of the option in the cut.
// Tiles are created once per scene id and patched, so a refresh never restarts a playing loop
// whose clip did not change. Only tiles on screen play; the rest are paused.
//
// opt: { root, empty, actions: { open(id), pick(sceneId, optionId), lock(sceneId, locked), select(id) } }
import { h, icon, tc, pad2, setText, setAttr, setHidden } from './lib.js';

const LETTERS = 'ABCDEFGH';

export function createBoard({ root, empty, actions }) {
  const tiles = new Map();
  let filter = 'all', current = null;

  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const t = e.target.__tile;
      if (!t) continue;
      t.visible = e.isIntersecting;
      play(t);
    }
  }, { threshold: 0.15 });

  function play(t) {
    const v = t.video;
    if (t.visible && v.getAttribute('src') && !root.hidden) { const p = v.play(); if (p) p.catch(() => {}); }
    else if (!v.paused) v.pause();
  }

  function show(t, url, poster) {
    // a tile shows the loop when there is one, the still otherwise, and says when a loop is on its way
    if (poster && t.poster.getAttribute('src') !== poster) t.poster.src = poster;
    setHidden(t.poster, !poster);
    if ((t.video.getAttribute('src') || null) !== (url || null)) {
      if (url) { t.video.src = url; t.video.load(); } else { t.video.removeAttribute('src'); t.video.load(); }
    }
    setHidden(t.video, !url);
    play(t);
  }

  function build(id) {
    const t = { id, visible: false, previewing: null, sc: null };
    t.video = h('video', { class: 'tile-video', muted: true, loop: true, playsinline: true, preload: 'auto', 'aria-hidden': 'true', hidden: true });
    t.video.muted = true;
    t.poster = h('img', { class: 'tile-poster', alt: '', draggable: 'false', decoding: 'async', hidden: true });
    t.poster.addEventListener('error', () => setHidden(t.poster, true));
    t.wait = h('span', { class: 'tile-wait mono', hidden: true }, 'Preparing preview');
    t.num = h('span', { class: 'tile-num mono' });
    t.tc = h('span', { class: 'tile-tc mono' });
    t.role = h('span', { class: 'tile-role' });
    t.flagLock = h('span', { class: 'tile-flag lock', title: 'Locked' }, icon('lock'));
    t.flagNote = h('span', { class: 'tile-flag note', title: 'Has a note' }, 'Note');
    t.flagNew = h('span', { class: 'tile-flag new', title: 'Updated by the agent' }, 'Updated');
    t.label = h('p', { class: 'tile-label' });
    t.say = h('p', { class: 'tile-say' });
    t.pills = h('div', { class: 'tile-pills', role: 'group', 'aria-label': 'Options' });
    t.lockBtn = h('button', { class: 'tile-btn', type: 'button' });
    t.lockBtn.addEventListener('click', (e) => { e.stopPropagation(); if (t.sc) actions.lock(id, !t.sc.locked); });
    t.hit = h('button', { class: 'tile-hit', type: 'button' });
    t.hit.addEventListener('click', () => actions.open(id));
    t.el = h('article', { class: 'tile' },
      h('div', { class: 'tile-media' }, t.poster, t.video, t.wait),
      t.hit,
      h('div', { class: 'tile-top' }, h('span', { class: 'tile-id' }, t.num, t.tc), h('span', { class: 'tile-flags' }, t.flagNew, t.flagNote, t.flagLock)),
      h('div', { class: 'tile-bottom' }, h('div', { class: 'tile-meta' }, t.role, t.label), t.say, h('div', { class: 'tile-actions' }, t.pills, t.lockBtn)));
    t.el.__tile = t;
    t.el.addEventListener('pointerenter', () => actions.select(id));
    seen.observe(t.el);
    return t;
  }

  function optionMedia(sc, optionId) {
    const o = sc.options.find((x) => x.id === optionId) || sc.options[0];
    return { url: o?.loop || null, poster: o?.poster || null };
  }

  function patch(t, sc, loopsBusy) {
    t.sc = sc;
    const n = sc.index + 1;
    setText(t.num, pad2(n));
    setText(t.tc, `${tc(sc.start)}–${tc(sc.end)}`);
    setText(t.role, sc.role || '');
    setHidden(t.role, !sc.role);
    setAttr(t.el, 'data-state', sc.locked ? 'locked' : sc.decided ? 'picked' : 'open');
    setAttr(t.el, 'aria-label', `Scene ${n}`);
    setAttr(t.hit, 'aria-label', `Open scene ${n}: change the option, write a note or lock it`);
    setHidden(t.flagLock, !sc.locked);
    setHidden(t.flagNote, !(sc.note || '').trim());
    setHidden(t.flagNew, !sc.revised);
    const k = Math.max(0, sc.options.findIndex((o) => o.id === sc.pick));
    const chosen = sc.options[k];
    setText(t.label, `${LETTERS[k] || ''} · ${chosen?.label || ''}`);
    setText(t.say, sc.say ? `“${sc.say}”` : '');

    // option pills: hover previews that option on the tile, click puts it in the cut
    const sig = JSON.stringify([sc.options.map((o) => o.id), sc.pick, sc.locked]);
    if (t.pillSig !== sig) {
      t.pillSig = sig;
      t.pills.replaceChildren(...sc.options.map((o, i) => {
        const b = h('button', { class: 'tile-pill mono', type: 'button', 'aria-pressed': String(o.id === sc.pick), title: o.label }, LETTERS[i] || String(i + 1));
        b.addEventListener('click', (e) => { e.stopPropagation(); actions.pick(sc.id, o.id); });
        b.addEventListener('pointerenter', () => { t.previewing = o.id; const m = optionMedia(t.sc, o.id); show(t, m.url, m.poster); });
        b.addEventListener('pointerleave', () => { t.previewing = null; const m = optionMedia(t.sc, t.sc.pick); show(t, m.url, m.poster); });
        return b;
      }));
      setHidden(t.pills, sc.options.length < 2);
    }
    t.lockBtn.replaceChildren(icon(sc.locked ? 'unlock' : 'lock'), sc.locked ? 'Unlock' : 'Lock');
    setAttr(t.lockBtn, 'aria-label', `${sc.locked ? 'Unlock' : 'Lock'} scene ${n}`);

    const m = optionMedia(sc, t.previewing || sc.pick);
    show(t, m.url, m.poster);
    setHidden(t.wait, !!m.url || !loopsBusy);
  }

  function applyFilter() {
    let shown = 0;
    for (const t of tiles.values()) {
      const sc = t.sc;
      const ok = filter === 'all' || (filter === 'open' && !sc.locked) || (filter === 'notes' && (sc.note || '').trim());
      setHidden(t.el, !ok);
      if (ok) shown++;
      setAttr(t.el, 'aria-current', String(t.id === current));
    }
    const text = shown ? '' : !tiles.size ? 'The plan has no scenes yet.'
      : filter === 'open' ? 'Every scene is locked. Nothing is left to decide.'
        : filter === 'notes' ? 'No scene has a note. Open a scene to write one.' : '';
    if (empty) { setText(empty, text); setHidden(empty, !text); }
  }

  return {
    update(model, view) {
      filter = view.filter; current = view.current;
      const ids = new Set();
      let prev = null;
      for (const sc of model.scenes) {
        ids.add(sc.id);
        let t = tiles.get(sc.id);
        if (!t) { t = build(sc.id); tiles.set(sc.id, t); }
        patch(t, sc, !!model.loopsBusy);
        const want = prev ? prev.nextElementSibling : root.firstElementChild;
        if (want !== t.el) root.insertBefore(t.el, want);
        prev = t.el;
      }
      for (const [id, t] of tiles) if (!ids.has(id)) { seen.unobserve(t.el); t.el.remove(); tiles.delete(id); }
      applyFilter();
    },
    setCurrent(id) { current = id; for (const t of tiles.values()) setAttr(t.el, 'aria-current', String(t.id === id)); },
    reveal(id) { tiles.get(id)?.el.scrollIntoView({ block: 'nearest', behavior: 'auto' }); },
    visibleIds: () => [...tiles.values()].filter((t) => !t.el.hidden).map((t) => t.id),
    /** Pause or resume every loop when the grid is hidden or shown. */
    refreshPlayback() { for (const t of tiles.values()) play(t); },
  };
}
