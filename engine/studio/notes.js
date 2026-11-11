// One note field: a textarea that saves itself (debounced, and on blur) and says so.
//
// The person's text always wins. While a field has focus or unsaved text, nothing
// arriving from the server may overwrite it; the field is created once and never rebuilt.
import { h, setText } from './lib.js';

const SAVE_AFTER_MS = 700;
let serial = 0;

/**
 * opt: { label, placeholder, max, save(text) -> Promise (rejects when it could not be stored), onInput() }
 */
export function createNoteField({ label, placeholder, max, save, onInput }) {
  const id = `note-${++serial}`;
  const area = h('textarea', { id, rows: 2, maxlength: max, placeholder, autocomplete: 'off' });
  const status = h('span', { class: 'save mono', role: 'status' });
  const el = h('div', { class: 'note-field' }, h('div', { class: 'note-top' }, h('label', { for: id }, label), status), area);

  let stored = '';          // the text the server holds
  let dirty = false;        // the person typed something the server does not have yet
  let timer = null;
  let busy = null;

  const rest = () => setText(status, stored.trim() ? 'Saved' : '');
  const fit = () => { area.style.height = 'auto'; if (area.scrollHeight) area.style.height = `${area.scrollHeight + 2}px`; };

  async function flush() {
    clearTimeout(timer); timer = null;
    if (!dirty) return true;
    if (busy) { await busy; return flush(); }
    const text = area.value;
    if (text === stored) { dirty = false; rest(); return true; }
    setText(status, 'Saving');
    busy = save(text).then(() => { stored = text; return true; }, () => false);
    const ok = await busy;
    busy = null;
    if (!ok) { setText(status, 'Not saved yet'); return false; }
    if (area.value !== stored) { timer = setTimeout(flush, SAVE_AFTER_MS); return true; }   // more was typed meanwhile
    dirty = false;
    rest();
    return true;
  }

  area.addEventListener('input', () => {
    dirty = true;
    setText(status, 'Saving');
    clearTimeout(timer);
    timer = setTimeout(flush, SAVE_AFTER_MS);
    fit();
    onInput?.();
  });
  area.addEventListener('blur', () => {
    if (dirty) { flush(); return; }
    if (area.value !== stored) { area.value = stored; fit(); rest(); onInput?.(); }   // catch up with what arrived while focused
  });

  return {
    el, area, flush, fit,
    /** Text from the server. Ignored while the person has unsaved text; never applied to a focused field. */
    sync(text) {
      text = text || '';
      if (dirty) return;
      stored = text;
      if (document.activeElement === area) return;
      if (area.value !== text) { area.value = text; fit(); }
      rest();
    },
    /** The note as it stands: unsaved typing if there is any, otherwise what the server holds. */
    value: () => (dirty ? area.value : stored),
    dirty: () => dirty,
    focus() { area.focus({ preventScroll: true }); area.setSelectionRange(area.value.length, area.value.length); },
  };
}
