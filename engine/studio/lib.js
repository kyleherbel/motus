// Shared helpers for Studio: text-safe DOM building, formatting, and the HTTP API.
//
// Nothing here (or anywhere in Studio) puts model text through innerHTML. Text reaches
// the page as text nodes and attribute values only, so a transcript, label, note or
// file name can never be parsed as markup.

const SVG_NS = 'http://www.w3.org/2000/svg';

export const $ = (sel, root = document) => root.querySelector(sel);

function appendAll(el, kids) {
  for (const k of kids) {
    if (k === null || k === undefined || k === false) continue;
    if (Array.isArray(k)) appendAll(el, k);
    else el.append(k);                 // strings become text nodes
  }
}

/** h('p', { class: 'x', hidden: true }, 'text', node, [more]) */
export function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === false || v === null || v === undefined) continue;
      if (k === 'class') el.className = v;
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, String(v));
    }
  }
  appendAll(el, kids);
  return el;
}

export function svg(tag, attrs, ...kids) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, String(v));
  appendAll(el, kids);
  return el;
}

/** Write only when the value changed, so patching an unchanged page touches nothing. */
export function setText(el, text) { text = String(text ?? ''); if (el.textContent !== text) el.textContent = text; }
export function setAttr(el, name, value) { value = String(value); if (el.getAttribute(name) !== value) el.setAttribute(name, value); }
export function setFlag(el, name, on) { if (on) setAttr(el, name, ''); else if (el.hasAttribute(name)) el.removeAttribute(name); }
export function setHidden(el, hidden) { if (el.hidden !== !!hidden) el.hidden = !!hidden; }

// Static icon artwork (16 x 16). These strings are ours, never model text.
const ICONS = {
  play: '<path d="M4.5 2.8v10.4L13 8z" fill="currentColor"/>',
  pause: '<path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor"/>',
  sound: '<path d="M2 6.2h2.4L8 3.2v9.6L4.4 9.8H2z" fill="currentColor"/><path d="M10.4 5.6a3.4 3.4 0 0 1 0 4.8M12.3 3.8a6 6 0 0 1 0 8.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  muted: '<path d="M2 6.2h2.4L8 3.2v9.6L4.4 9.8H2z" fill="currentColor"/><path d="M10.6 6l3.4 4M14 6l-3.4 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  lock: '<path d="M3.5 7h9v6.5h-9z" fill="currentColor"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  unlock: '<path d="M3.5 7h9v6.5h-9z" fill="currentColor"/><path d="M5.5 7V5a2.5 2.5 0 0 1 4.9-.7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  check: '<path d="M3 8.4l3.2 3.2L13 4.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
};

export function icon(name) {
  const el = svg('svg', { viewBox: '0 0 16 16', width: 14, height: 14, class: 'ic', 'aria-hidden': 'true', focusable: 'false' });
  el.innerHTML = ICONS[name] || '';
  return el;
}

/** Seconds as m:ss.s. `floor` keeps a running clock from showing a tenth it has not reached. */
export function tc(seconds, floor = false) {
  const t = Math.max(0, Number(seconds) || 0);
  const tenths = floor ? Math.floor(t * 10 + 1e-6) : Math.round(t * 10);
  const m = Math.floor(tenths / 600);
  const s = (tenths - m * 600) / 10;
  return `${m}:${s.toFixed(1).padStart(4, '0')}`;
}

export const pad2 = (n) => String(n).padStart(2, '0');
export const plural = (n, one, many = `${one}s`) => (n === 1 ? one : many);

export function when(iso) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function bytes(n) {
  if (!Number.isFinite(n)) return '';
  return n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} kB`;
}

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fall through to the old way */ }
  const ta = h('textarea', { readonly: true, 'aria-hidden': 'true', style: 'position:fixed;left:-999px;top:0;opacity:0' });
  ta.value = text;
  document.body.append(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  ta.remove();
  return ok;
}

/** Small per-viewer conveniences only (a toggle, what was last sent). Never the review itself. */
export const prefs = {
  get(key, fallback = null) { try { const v = localStorage.getItem(`motus.studio.${key}`); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
  set(key, value) { try { if (value === null || value === undefined) localStorage.removeItem(`motus.studio.${key}`); else localStorage.setItem(`motus.studio.${key}`, JSON.stringify(value)); } catch { /* private window */ } },
};

// ------------------------------------------------------------------ the server

export class ApiError extends Error {
  constructor(message, { fix = '', status = 0, offline = false } = {}) {
    super(message);
    this.fix = fix; this.status = status; this.offline = offline;
  }
}

async function call(method, url, body) {
  let res;
  try {
    res = await fetch(url, {
      method, cache: 'no-store',
      keepalive: method !== 'GET',     // a save started as the page closes still reaches the server
      headers: body === undefined ? undefined : { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('The Studio server did not answer.', { offline: true });
  }
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : {}; } catch { data = null; }
  if (!res.ok || data === null) {
    throw new ApiError(data?.error || text || `The server answered ${res.status}.`, { fix: data?.fix || '', status: res.status });
  }
  return data;
}

export const api = {
  project: () => call('GET', '/api/project'),
  state: (patch) => call('PUT', '/api/state', patch),
  submit: (action) => call('POST', '/api/submit', { action }),
  render: () => call('GET', '/api/render'),
  zones: () => call('GET', '/studio/safe-zones.json'),
  /**
   * The exact document a stage would draw, as text. Two equal texts mean an identical
   * picture, which is how Studio knows whether a preview really needs reloading.
   */
  async resolvedText(force = {}) {
    const q = new URLSearchParams();
    if (force.scene) q.set('scene', force.scene);
    if (force.option) q.set('option', force.option);
    let res;
    try { res = await fetch(`/api/resolved?${q}`, { cache: 'no-store' }); } catch { throw new ApiError('The Studio server did not answer.', { offline: true }); }
    return `${res.status}\n${await res.text()}`;
  },
};
