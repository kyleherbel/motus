// Lifetimes on the timeline. A Layer shows one element over [in, out) and hands a
// render function everything it needs to draw the element at time t. There are no
// CSS transitions or animations anywhere: every style property is set from t.

import { clamp } from './ease.js';

export class Layer {
  /**
   * @param {HTMLElement} el
   * @param {number} tIn   first second the element is on screen
   * @param {number} tOut  first second it is gone again (Infinity = until the end)
   * @param {(el: HTMLElement, s: LayerState) => void} render
   * @param {{enter?: number, exit?: number, display?: string}} [opt] enter/exit durations in seconds
   *
   * LayerState: { t, local, life, p, q }
   *   local = t - tIn, life = tOut - tIn,
   *   p = linear enter progress 0..1 over [tIn, tIn + enter],
   *   q = linear exit progress 0..1 over [tOut - exit, tOut]  (0 until the exit starts)
   */
  constructor(el, tIn, tOut, render, opt = {}) {
    this.el = el; this.in = tIn; this.out = tOut; this.render = render;
    this.enter = opt.enter ?? 0; this.exit = opt.exit ?? 0;
    this.display = opt.display ?? '';
    this._shown = null;
  }
  seek(t) {
    const on = t >= this.in && t < this.out;
    if (on !== this._shown) { this.el.style.display = on ? this.display : 'none'; this._shown = on; }
    if (!on) return;
    const local = t - this.in;
    const p = this.enter > 0 ? clamp(local / this.enter) : 1;
    const q = this.exit > 0 ? clamp((t - (this.out - this.exit)) / this.exit) : 0;
    this.render(this.el, { t, local, life: this.out - this.in, p, q });
  }
}

/** A flat list of things with seek(t); seeks them in insertion order. */
export class Group {
  constructor() { this.items = []; }
  add(item) { this.items.push(item); return item; }
  layer(el, tIn, tOut, render, opt) { return this.add(new Layer(el, tIn, tOut, render, opt)); }
  seek(t) { for (const it of this.items) it.seek(t); }
}

/** Tiny DOM helper: h('div.card.big', {style: {...}, text: 'x'}, child, child) */
export function h(spec, props = {}, ...children) {
  const [tag, ...cls] = spec.split('.');
  const el = document.createElement(tag || 'div');
  if (cls.length) el.className = cls.join(' ');
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null) continue;
    if (k === 'style') Object.assign(el.style, v);
    else if (k === 'text') el.textContent = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'data') Object.assign(el.dataset, v);
    else el.setAttribute(k, v);
  }
  for (const c of children.flat()) if (c != null) el.append(c);
  return el;
}

/** Set several style properties, skipping writes that would not change anything. */
export function css(el, props) {
  const s = el.style;
  for (const k in props) { const v = props[k]; if (s[k] !== v) s[k] = v; }
}
