// The review list: one section per scene, its option cards, its note, its locked row.
//
// Sections and cards are created once and then PATCHED by scene id and option id, so an
// update from the agent never rebuilds a note field, moves focus or restarts a preview
// that did not change.
import { h, icon, tc, pad2, when, setText, setAttr, setHidden, api } from './lib.js';
import { createNoteField } from './notes.js';
import { buildOverlay } from './zones.js';

const LETTERS = 'ABCDEFGH';
const HOVER_INTENT_MS = 140;
const SCENE_NOTE_MAX = 4000;          // the server keeps this many characters of a scene note

/**
 * opt: {
 *   root, empty,                     the list element and the "nothing matches" line
 *   zones,                           parsed safe-zones.json or null
 *   actions: { select(id), pick(sceneId, optionId), lock(sceneId, locked), play(sceneId), saveNote(sceneId, text) -> Promise },
 *   onNoteInput(),                   a note was typed in
 *   onFiltered(),                    the set of scenes shown was just re-evaluated
 * }
 */
export function createScenes({ root, empty, zones, actions, onNoteInput, onFiltered }) {
  const views = new Map();            // scene id -> view
  const ghosts = new Set();           // sections of scenes that left the plan while their note was still being written
  let filter = 'all';
  let current = null;

  // Scenes are never hidden while a pointer is down: the page must not move under a click.
  let pointerDown = false, filterWaiting = false;
  document.addEventListener('pointerdown', () => { pointerDown = true; }, true);
  for (const type of ['pointerup', 'pointercancel']) {
    document.addEventListener(type, () => { pointerDown = false; if (filterWaiting) setTimeout(() => { if (filterWaiting && !pointerDown) applyFilter(); }, 0); }, true);
  }

  // ---------------------------------------------------------------- live option preview
  // At most one exists at any time. It is a stage iframe forced to one option, looping
  // its scene, muted. The card's poster stays underneath until the stage draws a frame.
  let live = null;                    // { card, view, frame, sig }
  let hover = null, focused = null, tapped = null;
  let liveTimer = null;
  let lastPointer = 'mouse';
  document.addEventListener('pointerdown', (e) => { lastPointer = e.pointerType || 'mouse'; }, true);

  function stopLive() {
    if (!live) return;
    live.frame.remove();
    live.card.el.removeAttribute('data-live');
    setHidden(live.card.tag, true);
    live = null;
  }

  function startLive(card) {
    stopLive();
    const view = card.view;
    const q = new URLSearchParams({ mode: 'preview', scene: view.id, option: card.id, loop: 'scene', muted: '1', autoplay: '1' });
    const frame = h('iframe', {
      class: 'stage-frame', allow: 'autoplay', tabindex: -1, 'aria-hidden': 'true',
      title: `Option ${card.letter} playing`, src: `/runtime/stage.html?${q}`,
    });
    card.slot.append(frame);
    setAttr(card.el, 'data-live', 'loading');
    setText(card.tag, 'Loading');
    setHidden(card.tag, false);
    const mine = { card, view, frame, sig: null };
    live = mine;
    api.resolvedText({ scene: view.id, option: card.id }).then((text) => { if (live === mine) mine.sig = text; }, () => {});
  }

  window.addEventListener('message', (e) => {
    if (!live || e.origin !== location.origin || e.source !== live.frame.contentWindow || !e.data?.motus) return;
    const { card } = live;
    if (e.data.type === 'time' && card.el.dataset.live !== 'on') { setAttr(card.el, 'data-live', 'on'); setText(card.tag, 'Live'); }
    else if (e.data.type === 'error') { setAttr(card.el, 'data-live', 'error'); setText(card.tag, 'Preview failed'); }
  });

  const usable = (card) => card && card.el.isConnected && !card.view.el.hidden && !card.view.body.hidden;
  function wantLive(now = false) {
    clearTimeout(liveTimer);
    const go = () => {
      const card = [hover, tapped, focused].find(usable) || null;
      if (card === (live ? live.card : null)) return;
      if (card) startLive(card); else stopLive();
    };
    if (now) go(); else liveTimer = setTimeout(go, HOVER_INTENT_MS);
  }
  function forget(card) {
    if (hover === card) hover = null;
    if (focused === card) focused = null;
    if (tapped === card) tapped = null;
    if (live && live.card === card) stopLive();
  }

  // A preview that was tapped or focused and then scrolled out of view stops by itself.
  let scrollTick = false;
  window.addEventListener('scroll', () => {
    if (!live || scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => {
      scrollTick = false;
      if (!live) return;
      const r = live.card.thumb.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) { if (tapped === live.card) tapped = null; if (focused === live.card) focused = null; if (hover === live.card) hover = null; stopLive(); }
    });
  }, { passive: true });

  // ---------------------------------------------------------------- cards

  function buildCard(view, optionId) {
    const c = { id: optionId, view, letter: '', posterUrl: undefined, useState: null, tagSig: null };
    c.phLetter = h('span', { class: 'ph-letter mono' });
    c.ph = h('div', { class: 'ph' }, c.phLetter, h('span', { class: 'ph-text' }, 'No still yet.'), h('span', { class: 'ph-text' }, 'Hover or tap to play it.'));
    c.img = h('img', { class: 'poster', alt: '', draggable: 'false', decoding: 'async', hidden: true });
    c.img.addEventListener('error', () => { setHidden(c.img, true); setHidden(c.ph, false); });
    c.slot = h('div', { class: 'live-slot' });
    c.tag = h('span', { class: 'live-tag mono', hidden: true });
    c.hit = h('button', { class: 'thumb-hit', type: 'button' });
    c.thumb = h('div', { class: 'thumb' }, c.ph, c.img, c.slot, buildOverlay(zones), c.tag, c.hit);

    c.badge = h('span', { class: 'badge mono' });
    c.rec = h('span', { class: 'rec', hidden: true }, 'Recommended');
    c.label = h('h3', { class: 'label' });
    c.why = h('p', { class: 'why' });
    c.tags = h('ul', { class: 'tags', 'aria-label': 'Layout and elements' });
    c.incut = h('p', { class: 'incut', hidden: true }, 'In the cut now');
    c.use = h('button', { class: 'btn use', type: 'button', 'aria-pressed': 'false' });
    c.el = h('article', { class: 'card' }, c.thumb,
      h('div', { class: 'card-body' }, h('div', { class: 'card-top' }, c.badge, c.rec), c.label, c.why, c.tags, c.incut, c.use));

    c.el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = c; wantLive(); } });
    c.el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { if (hover === c) hover = null; wantLive(); } });
    c.el.addEventListener('focusin', (e) => { if (e.target.matches(':focus-visible')) { focused = c; wantLive(); } });
    c.el.addEventListener('focusout', (e) => { if (focused === c && !c.el.contains(e.relatedTarget)) { focused = null; wantLive(); } });
    c.hit.addEventListener('click', (e) => {
      if (lastPointer === 'mouse' && e.detail > 0) hover = c;        // a mouse is already hovering: clicking keeps it playing
      else tapped = tapped === c && live && live.card === c ? null : c;   // a tap (or Enter) switches it on and off
      wantLive(true);
    });
    c.use.addEventListener('click', () => actions.pick(view.id, c.id));
    return c;
  }

  function patchCard(c, sc, o, i) {
    c.letter = LETTERS[i] || String(i + 1);
    setText(c.badge, c.letter);
    setText(c.phLetter, c.letter);
    setText(c.label, o.label || 'Untitled option');
    setText(c.why, o.why || '');
    setHidden(c.why, !o.why);

    const tagList = [o.layoutLabel, ...(o.elements || [])].filter(Boolean);
    const tagSig = JSON.stringify(tagList);
    if (c.tagSig !== tagSig) { c.tagSig = tagSig; c.tags.replaceChildren(...tagList.map((text) => h('li', null, text))); }

    setHidden(c.rec, sc.recommended !== o.id);
    const inCut = sc.pick === o.id;
    const picked = inCut && sc.decided;
    setAttr(c.el, 'data-pick', picked ? 'picked' : inCut ? 'incut' : 'no');
    setHidden(c.incut, !(inCut && !picked));
    if (c.useState !== picked) {
      c.useState = picked;
      c.use.replaceChildren(...(picked ? [icon('check'), 'Picked'] : ['Use this']));
      setAttr(c.use, 'aria-pressed', picked);
    }
    setAttr(c.use, 'aria-label', picked ? `Option ${c.letter}, ${o.label}, is picked` : `Use option ${c.letter}, ${o.label}`);
    setAttr(c.hit, 'aria-label', `Play option ${c.letter}, ${o.label}, over this scene`);

    const poster = o.poster || null;
    if (c.posterUrl !== poster) {
      c.posterUrl = poster;
      if (poster) { c.img.src = poster; setHidden(c.img, false); setHidden(c.ph, true); }
      else { c.img.removeAttribute('src'); setHidden(c.img, true); setHidden(c.ph, false); }
    }
  }

  // ---------------------------------------------------------------- scenes

  function buildScene(id) {
    const v = { id, sc: null, cards: new Map(), historySig: null, wasLocked: null };
    const select = () => actions.select(id);

    v.num = h('span', { class: 'scene-num mono' });
    v.tc = h('span', { class: 'tc mono' });
    v.role = h('span', { class: 'tag' });
    v.revised = h('span', { class: 'flag', hidden: true }, 'Updated by the agent: review again');
    v.playBtn = h('button', { class: 'btn sm ghost play-scene', type: 'button' }, icon('play'), h('span', null, 'Play scene'));
    v.lockBtn = h('button', { class: 'btn sm', type: 'button' }, icon('lock'), 'Lock');
    v.say = h('p', { class: 'say' });
    v.options = h('div', { class: 'options' });
    v.history = h('ol', { class: 'history', 'aria-label': 'Earlier notes the agent has addressed', hidden: true });
    v.note = createNoteField({
      label: 'What should change?',
      placeholder: 'Leave this empty if the scene is right. Otherwise say what to change, in your own words.',
      max: SCENE_NOTE_MAX,
      save: (text) => actions.saveNote(id, text),
      onInput: onNoteInput,
    });
    v.body = h('div', { class: 'scene-body' },
      h('header', { class: 'scene-head' }, v.num, v.tc, v.role, v.revised, h('span', { class: 'grow' }), v.playBtn, v.lockBtn),
      v.say, h('div', { class: 'work' }, v.options, h('div', { class: 'notes' }, v.history, v.note.el)));

    // The compact row a locked scene collapses to.
    v.rowImg = h('img', { class: 'row-thumb', alt: '', draggable: 'false', hidden: true });
    v.rowImg.addEventListener('error', () => { setHidden(v.rowImg, true); setHidden(v.rowPh, false); });
    v.rowPh = h('span', { class: 'row-thumb row-thumb-ph mono' });
    v.rowNum = h('span', { class: 'scene-num mono' });
    v.rowBadge = h('span', { class: 'badge mono' });
    v.rowLabel = h('span', { class: 'row-label' });
    v.rowSay = h('span', { class: 'row-say' });
    v.rowNote = h('span', { class: 'tag', hidden: true }, 'Note');
    v.rowTc = h('span', { class: 'tc mono' });
    v.unlockBtn = h('button', { class: 'btn sm', type: 'button' }, 'Unlock');
    v.row = h('div', { class: 'scene-row', hidden: true },
      v.rowNum, h('span', { class: 'row-pic' }, v.rowPh, v.rowImg),
      h('span', { class: 'row-main' }, h('span', { class: 'row-title' }, v.rowBadge, v.rowLabel, v.rowNote), v.rowSay),
      v.rowTc, h('span', { class: 'locked-mark' }, icon('lock'), h('span', null, 'Locked')), v.unlockBtn);

    v.el = h('section', { class: 'scene' }, v.body, v.row);
    v.el.addEventListener('pointerdown', select);
    v.el.addEventListener('focusin', select);
    v.playBtn.addEventListener('click', () => actions.play(id));
    v.lockBtn.addEventListener('click', () => actions.lock(id, true));
    v.unlockBtn.addEventListener('click', () => actions.lock(id, false));
    return v;
  }

  function patchHistory(v, history) {
    const sig = JSON.stringify(history || []);
    if (v.historySig === sig) return;
    v.historySig = sig;
    v.history.replaceChildren(...(history || []).map((item) => h('li', null,
      h('p', { class: 'h-note' }, item.note || ''),
      item.reply ? h('p', { class: 'h-reply' }, h('span', { class: 'h-who' }, 'The agent: '), item.reply) : null,
      h('p', { class: 'h-meta mono' }, `Addressed ${when(item.addressed)}`.trim()))));
    setHidden(v.history, !(history || []).length);
  }

  function patchScene(v, sc) {
    v.sc = sc;
    const number = pad2(sc.index + 1);
    const range = `${tc(sc.start)} – ${tc(sc.end)}`;
    setAttr(v.el, 'aria-label', `Scene ${sc.index + 1}`);
    setAttr(v.el, 'data-state', sc.locked ? 'locked' : 'open');
    setText(v.num, number); setText(v.rowNum, number);
    setText(v.tc, range); setText(v.rowTc, range);
    setText(v.role, sc.role || ''); setHidden(v.role, !sc.role);
    setHidden(v.revised, !sc.revised);
    setText(v.say, sc.say || 'Nothing is said in this scene.');
    setAttr(v.lockBtn, 'aria-label', `Lock scene ${sc.index + 1}`);
    setAttr(v.unlockBtn, 'aria-label', `Unlock scene ${sc.index + 1}`);
    setAttr(v.playBtn, 'aria-label', `Play scene ${sc.index + 1} in the monitor`);

    // options, keyed by id
    const seen = new Set();
    let prev = null;
    sc.options.forEach((o, i) => {
      let c = v.cards.get(o.id);
      if (!c) { c = buildCard(v, o.id); v.cards.set(o.id, c); }
      seen.add(o.id);
      patchCard(c, sc, o, i);
      const want = prev ? prev.nextElementSibling : v.options.firstElementChild;
      if (want !== c.el) v.options.insertBefore(c.el, want);
      prev = c.el;
    });
    for (const [oid, c] of v.cards) if (!seen.has(oid)) { forget(c); c.el.remove(); v.cards.delete(oid); }

    patchHistory(v, sc.history);
    v.note.sync(sc.note);

    // the locked row
    const chosen = sc.options.find((o) => o.id === sc.pick) || sc.options[0];
    const chosenLetter = LETTERS[sc.options.indexOf(chosen)] || '';
    setText(v.rowBadge, chosenLetter);
    setText(v.rowPh, chosenLetter);
    setText(v.rowLabel, chosen?.label || '');
    setText(v.rowSay, sc.say || '');
    setHidden(v.rowNote, !v.note.value().trim());
    const poster = chosen?.poster || null;
    if (v.rowPoster !== poster) {
      v.rowPoster = poster;
      if (poster) { v.rowImg.src = poster; setHidden(v.rowImg, false); setHidden(v.rowPh, true); }
      else { v.rowImg.removeAttribute('src'); setHidden(v.rowImg, true); setHidden(v.rowPh, false); }
    }

    // collapse or expand, keeping the keyboard where it was
    if (v.wasLocked !== sc.locked) {
      const hadFocus = v.el.contains(document.activeElement);
      setHidden(v.body, sc.locked);
      setHidden(v.row, !sc.locked);
      if (sc.locked) for (const c of v.cards.values()) forget(c);
      else v.note.fit();
      if (hadFocus && v.wasLocked !== null) (sc.locked ? v.unlockBtn : v.lockBtn).focus({ preventScroll: true });
      v.wasLocked = sc.locked;
    }
  }

  const hasNote = (v) => !!v.note.value().trim();
  const matches = (v) => filter === 'all' || (filter === 'open' && !v.sc.locked) || (filter === 'notes' && hasNote(v));

  function paintCurrent() { for (const v of views.values()) setAttr(v.el, 'aria-current', v.id === current ? 'true' : 'false'); }

  function applyFilter() {
    if (pointerDown) { filterWaiting = true; paintCurrent(); return; }
    filterWaiting = false;
    let shown = 0, orphan = null;
    const list = [...views.values()];
    for (const v of list) {
      // A scene whose note is being written stays put even if it stops matching.
      const show = matches(v) || v.note.dirty() || document.activeElement === v.note.area;
      if (!show && !v.el.hidden && v.el.contains(document.activeElement)) orphan = v;   // about to hide the focused control
      setHidden(v.el, !show);
      if (show) shown++;
      setAttr(v.el, 'aria-current', v.id === current ? 'true' : 'false');
    }
    if (orphan) {                     // keep the keyboard in the list: move on to the next scene still shown
      const at = list.indexOf(orphan);
      const next = list.slice(at + 1).find((v) => !v.el.hidden) || list.slice(0, at).reverse().find((v) => !v.el.hidden);
      if (next) (next.sc.locked ? next.unlockBtn : next.lockBtn).focus({ preventScroll: true });
    }
    const text = shown ? '' : !views.size ? 'The plan has no scenes yet.'
      : filter === 'open' ? 'Every scene is locked. Nothing is left to decide.'
        : filter === 'notes' ? 'No scene has a note. Write one under a scene to ask the agent for a change.' : '';
    setText(empty, text);
    setHidden(empty, !text);
    wantLive(true);
    onFiltered?.();
  }

  return {
    update(model, view) {
      filter = view.filter; current = view.current;
      const seen = new Set();
      let prev = null;
      for (const sc of model.scenes) {
        let v = views.get(sc.id);
        if (!v) { v = buildScene(sc.id); views.set(sc.id, v); }
        seen.add(sc.id);
        patchScene(v, sc);
        const want = prev ? prev.nextElementSibling : root.firstElementChild;
        if (want !== v.el) root.insertBefore(v.el, want);
        prev = v.el;
      }
      for (const [id, v] of views) {
        if (seen.has(id)) continue;
        for (const c of v.cards.values()) forget(c);
        views.delete(id);
        if (v.note.dirty() || document.activeElement === v.note.area) {    // unsaved words: the section stays until they are dealt with
          ghosts.add(v);
          setAttr(v.el, 'data-gone', '');
          setAttr(v.el, 'aria-current', 'false');
          setText(v.revised, 'This scene is no longer in the plan. Copy your note if you still need it, then clear it.');
          setHidden(v.revised, false);
        } else v.el.remove();
      }
      for (const v of ghosts) if (!v.note.dirty() && document.activeElement !== v.note.area) { v.el.remove(); ghosts.delete(v); }
      applyFilter();
    },

    /** The stage's document changed: restart the live preview only if ITS picture changed. */
    async planChanged() {
      const mine = live;
      if (!mine) return;
      let text;
      try { text = await api.resolvedText({ scene: mine.view.id, option: mine.card.id }); } catch { return; }
      if (live !== mine) return;
      if (mine.sig !== null && mine.sig !== text) startLive(mine.card);
      else mine.sig = text;
    },

    counts() {
      let open = 0, notes = 0;
      for (const v of views.values()) { if (!v.sc.locked) open++; if (hasNote(v)) notes++; }
      return { all: views.size, open, notes };
    },
    /** [sceneId, text] for every scene with a note, in order: unsaved typing included. */
    notes: () => [...views.values()].filter(hasNote).map((v) => [v.id, v.note.value().trim()]),
    visibleIds: () => [...views.values()].filter((v) => !v.el.hidden).map((v) => v.id),
    flushNotes: () => Promise.all([...views.values()].map((v) => v.note.flush())).then((r) => r.every(Boolean)),
    reveal(id) { views.get(id)?.el.scrollIntoView({ block: 'start', behavior: 'auto' }); },
    focusNote(id) {
      const v = views.get(id);
      if (!v || v.sc.locked) return false;
      v.note.area.scrollIntoView({ block: 'center', behavior: 'auto' });
      v.note.focus();
      return true;
    },
    /** Change which scenes are shown, or which one is current, without touching their content. */
    show(view) { filter = view.filter; current = view.current; applyFilter(); },
    setCurrent(id) { current = id; paintCurrent(); },
    liveCount: () => root.querySelectorAll('.live-slot iframe').length,
  };
}
