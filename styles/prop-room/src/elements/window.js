// A generic app window operated by the one arrow pointer (research/explain.md X51, X53, X66-X68, X74, X77, X78;
// graphics.md G15-G17). Devices: cursor_operates_ui, form_drives_preview.
//
// Anatomy: the window (or card) is on screen on the cut with its rows, buttons or tiles; the pointer enters with
// a strong ease-out over about 8 frames, travels ease-in-out about 11 frames between targets in straight lines,
// rests about 3 frames, and on the click frame the clicked control itself changes: a row takes the selection
// (outline, tint and tick), a button changes fill and label, a tile is picked while the others dim. The pointer
// never changes shape and there is only ever one [X66-X68, X78]. A status line can flip whole on a word, and a
// result pill can grow in from about half size to mark the end state [X72, X77].
//
// This file is also the base of the other interfaces in the group: the pointer and its track, the ring pulse,
// the frame (window or card placed on the stage), neutral glyphs and the tick are exported from here.
import { F, fonts, colour, motion } from '../tokens.js';
import { place, setStyle, clamp01, sansFont, measureText } from '../common.js';
import { card, CARD } from '../card.js';

// TOKENS (research/explain.md X66-X69, X72, X74; graphics.md G16; colour.md C17, C18; type.md T25)
export const UI = {
  w: CARD.mainW,                // the main card or window is 914 px wide [G16; V]
  pad: 28,                      // rows sit 28 px in from the card edge [clip10@712, measured]
  gap: 16,                      // between rows [clip10@712, measured]
  // an option row: 192 px with a sub-label, title 58 px bold on a baseline 89 px down, sub 36 px on 147;
  // selection = 4 px accent outline, accent tint at 9 % over white, a 78 px tick circle 35 px in from the right
  // [clip10@712, measured]; title weight 760 and title-only rows 124 px tall (by eye)
  row: { h: 192, h1: 124, radius: 28, line: 4, tint: 0.09, title: 58, weight: 760, sub: 36, titleBase: 89, subBase: 147,
    textX: 169, textX0: 44, iconX: 89, icon: 80, tick: 78, tickIn: 35 },
  // a window with a heading, a status line and a big button [clip08@872, measured]: heading 100 px display weight,
  // its cap top 65 px under the title bar, 53 px in; the status baseline 92 px under the heading's; controls start
  // 75 px under the status; the button 155 px tall, 47 px in from the sides, 75 px above the bottom, label 72 px.
  // Status size, button radius and gaps between several buttons by eye.
  heading: { size: 100, top: 65, x: 53, statusGap: 92, after: 75 },
  status: { size: 36 },
  button: { h: 155, radius: 28, label: 72, gap: 24, pad: 47, bottom: 75 },
  tile: { radius: 24, gap: 22, label: 34, glyph: 104 },          // tiles for a card pick (by eye) [clip14@375]
  pill: { h: 66, size: 32, from: 0.48, gap: 26 },  // a result pill grows from 0.48 [X72]; size by eye
  accent: '#357CEF',            // no house accent [C18 corrected by V]: the measured blue is the default
  done: '#22A55B',              // success green for ticks and result pills (by eye) [clip07@869, clip02@436]
  dark: { fill: '#17171C', line: '#2A2A31', soft: 'rgba(255,255,255,0.56)', tile: '#232329' },   // [X74 #141418-#1A1A1E]
  tileFill: '#F4F3F0',          // pale control fill on white cards (by eye)
};

// the pointer [X66-X68]: a white arrow, about 3 px black outline, soft grey shadow, tip up-left, about 45 x 48 px
export const POINTER = {
  w: 45, h: 48,                 // template 39 x 42 at scale 1.15 [X66]
  enter: F(8),                  // first move: strong ease-out over about 8 frames [X67]
  enterEase: [0.2, 1, 0.45, 1], // free-fit bezier of entering moves [X67, build_spec.cursor.arrival_move]
  from: { x: 40, y: 300 },      // it enters from below, slightly right of its first target [clip10@700-706: 260 px up, 30 px left]
  lead: F(2),                   // the anchor is alone about 2 frames before the act starts [X55]
  minDur: F(5),                 // shortest move when words crowd (p10 of travel 6 frames) [X67]
  ring: { grow: 60, width: 3, fade: 0.65 },   // ring pulse: +58 to +67 px, contrast falls to about a third [X72, M22]
};

const hex = (h) => { const s = String(h).replace('#', ''); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); };
/** The plan's accent (#RRGGBB) or the default. */
export const accentOf = (params) => (/^#[0-9a-f]{6}$/i.test(params?.accent || '') ? params.accent : UI.accent);
/** A colour mixed toward a base colour: a = share of the colour. */
export const mix = (c, a, base = '#FFFFFF') => { const p = hex(c), b = hex(base); return `rgb(${p.map((v, i) => Math.round(b[i] + (v - b[i]) * a)).join(',')})`; };

// ------------------------------------------------------------------ the frame
/**
 * A window or card of w x h placed on the stage, at natural size inside a wrapper scaled by place()'s factor.
 * Children are positioned in the frame's own pixels; overlays (pointer, rings) go in `over`, which is not clipped.
 */
export function uiFrame(ctx, { w = UI.w, h, kind = 'window', title = '', dark = false }) {
  const { S } = ctx;
  const box = place(ctx, w, h);
  const wrap = S.kit.h('div.pr-ui', { style: { position: 'absolute', left: `${box.x.toFixed(2)}px`, top: `${box.y.toFixed(2)}px`, width: `${w}px`, height: `${h}px`,
    transformOrigin: '0 0', transform: box.s < 0.999 ? `scale(${box.s.toFixed(4)})` : '' } });
  const c = card(S, { x: 0, y: 0, w, h, kind: kind === 'card' ? 'card' : 'window', title, fill: dark ? UI.dark.fill : colour.card });
  if (dark && kind !== 'card') {
    const bar = c.el.firstChild;
    bar.style.borderBottom = `1px solid ${UI.dark.line}`;
    if (title) bar.lastChild.style.color = UI.dark.soft;
  }
  const over = S.kit.h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${h}px` } });
  wrap.append(c.el, over);
  return { wrap, card: c.el, body: c.body, bodyTop: c.bodyTop, over, box };
}

/**
 * An absolutely placed text line with its baseline at y (frame pixels). With `fit` (px), a line wider than that is
 * set smaller to fit and a warning is recorded: the text limits are measured, so this only guards odd glyph runs.
 */
export function line(S, { text = '', x, y, size, weight = fonts.weight.body, color = colour.ink, align = 'left', w, tracking = 0, style = {}, fit }) {
  if (fit && text) {
    const tw = measureText(text, sansFont(size, weight), tracking);
    if (tw > fit) { S.warn(`"${text}" is ${Math.round(tw)} px wide where ${Math.round(fit)} px fit; set smaller`); tracking *= fit / tw; size *= fit / tw; }
  }
  const tf = align === 'center' ? 'translateX(-50%)' : align === 'right' ? 'translateX(-100%)' : '';
  return S.kit.h('div', { text, style: { position: 'absolute', left: `${x}px`, top: `${(y - size * fonts.M.base).toFixed(2)}px`, transform: tf, whiteSpace: 'nowrap',
    font: sansFont(size, weight), letterSpacing: `${tracking}px`, color, ...(w ? { width: `${w}px`, overflow: 'hidden', textOverflow: 'clip' } : {}), ...style } });
}

// ------------------------------------------------------------------ neutral glyphs (never a product's mark)
const GLYPHS = {
  bolt: (c) => `<polygon points="27,3 8,28 22,28 18,45 40,18 26,18" fill="${c}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`,
  leaf: (c) => `<path d="M9 39 C9 19 21 8 41 7 C41 28 30 39 11 39 Z" fill="${c}"/><path d="M10 38 L28 20" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>`,
  cube: (c) => `<path d="M24 4 L42 14 L42 34 L24 44 L6 34 L6 14 Z" fill="${c}"/><path d="M6 14 L24 24 L42 14 M24 24 L24 44" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linejoin="round"/>`,
  globe: (c) => `<circle cx="24" cy="24" r="19" fill="none" stroke="${c}" stroke-width="4"/><ellipse cx="24" cy="24" rx="8" ry="19" fill="none" stroke="${c}" stroke-width="3.5"/><path d="M6 24 H42" stroke="${c}" stroke-width="3.5"/>`,
  star: (c) => `<polygon points="24,4 29.6,17.3 44,18.5 33,28 36.4,42 24,34.5 11.6,42 15,28 4,18.5 18.4,17.3" fill="${c}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`,
  file: (c) => `<path d="M11 4 H29 L39 14 V44 H11 Z" fill="${c}"/><path d="M29 4 V14 H39" fill="#FFFFFF" fill-opacity="0.55"/><path d="M17 24 H33 M17 31 H33 M17 38 H27" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/>`,
  image: (c) => `<rect x="4" y="8" width="40" height="32" rx="6" fill="${c}"/><circle cx="16" cy="18" r="4" fill="#FFFFFF"/><path d="M4 34 L17 24 L26 31 L33 25 L44 33 V34 Q44 40 38 40 H10 Q4 40 4 34 Z" fill="#FFFFFF" fill-opacity="0.85"/>`,
  doc: (c) => `<rect x="9" y="4" width="30" height="40" rx="5" fill="${c}"/><path d="M15 14 H33 M15 21 H33 M15 28 H33 M15 35 H26" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/>`,
  folder: (c) => `<path d="M4 12 Q4 8 8 8 H19 L23 12 H40 Q44 12 44 16 V38 Q44 42 40 42 H8 Q4 42 4 38 Z" fill="${c}"/><path d="M4 18 H44" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="2"/>`,
  link: (c) => `<path d="M21 27 L27 21" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path d="M19 17 L23 13 Q29 7 35 13 Q41 19 35 25 L31 29 M29 31 L25 35 Q19 41 13 35 Q7 29 13 23 L17 19" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`,
};
// one colour per glyph, from the measured accent families [C18] (orange is left out: it is a third party's colour [V])
const GLYPH_COLOUR = { bolt: '#ECAB44', leaf: '#0D8F5D', cube: '#357CEF', globe: '#2F85B5', star: '#F0574A',
  file: '#357CEF', image: '#2F85B5', doc: '#6B6B72', folder: '#ECAB44', link: '#6B6B72' };
export const GLYPH_NAMES = Object.keys(GLYPHS);
export const ICONS = 'bolt|leaf|cube|globe|star|letter';

/** A neutral icon of `size` px: a drawn glyph, or a monogram tile for 'letter'. */
export function glyph(S, name, size, { letter = '?', color } = {}) {
  if (name === 'letter') {
    return S.kit.h('div', { text: String(letter).trim().charAt(0).toUpperCase(), style: { width: `${size}px`, height: `${size}px`, borderRadius: `${(size * 0.26).toFixed(1)}px`,
      background: color || colour.ink, color: '#FFFFFF', font: sansFont(size * 0.52, fonts.weight.heavy), display: 'flex', alignItems: 'center', justifyContent: 'center' } });
  }
  const g = GLYPHS[name] || GLYPHS.file;
  return S.kit.h('div', { html: `<svg viewBox="0 0 48 48" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${g(color || GLYPH_COLOUR[name] || colour.inkSoft)}</svg>`,
    style: { width: `${size}px`, height: `${size}px`, lineHeight: '0' } });
}

/** A filled circle with a white check (the tick on a selection or a done row). */
export function tickMark(S, size, fill) {
  return S.kit.h('div', { html: `<svg viewBox="0 0 48 48" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="${fill}"/>`
    + '<path d="M13.5 24.5 L21 32 L35 17" fill="none" stroke="#FFFFFF" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/></svg>', style: { width: `${size}px`, height: `${size}px`, lineHeight: '0' } });
}

// ------------------------------------------------------------------ the pointer
const ARROW = '<svg viewBox="0 0 48 51" width="48" height="51" xmlns="http://www.w3.org/2000/svg">'
  + '<path d="M1.5 1.5 L43.5 25.3 L25.6 29.6 L16.2 46.5 Z" fill="#FFFFFF" stroke="#111114" stroke-width="3" stroke-linejoin="round"/></svg>';

/** The one arrow pointer [X66]. seek(x, y, show) puts its tip at (x, y). */
export function makePointer(S) {
  const el = S.kit.h('div.pr-pointer', { html: ARROW, style: { position: 'absolute', left: '0', top: '0', width: '48px', height: '51px', lineHeight: '0', display: 'none',
    filter: 'drop-shadow(0px 2px 2.5px rgba(0,0,0,0.32))', zIndex: '5', transformOrigin: '1.5px 1.5px' } });
  return {
    el,
    seek(x, y, show) {
      setStyle(el, 'display', show ? '' : 'none');
      if (show) setStyle(el, 'transform', `translate(${(x - 1.5).toFixed(2)}px, ${(y - 1.5).toFixed(2)}px)`);
    },
  };
}

/**
 * The pointer's path through a list of stops [X67, X68]. Each stop { t, x, y, click }: for a click, t is the click
 * frame (the control changes then) and the pointer arrives about 3 frames earlier; for a hover, t is the arrival.
 * The first move enters with a strong ease-out over about 8 frames from below (or from st.from); later moves travel
 * ease-in-out over about 11 frames. Crowded words compress a move to no less than 5 frames, and only then push
 * the click later. Returns { at(t) -> {x, y, show}, times } where times[i] is stop i's actual click/arrival time.
 */
export function pointerTrack(S, tIn, stops) {
  const enterE = S.kit.cubicBezier(...POINTER.enterEase);
  const moves = [], times = [];
  let prev = null;
  for (const st of stops) {
    const enter = !prev;
    const dur = enter ? POINTER.enter : motion.pointer.dur;
    const rest = st.click ? motion.pointer.click : 0;
    let arrive = st.t - rest;
    const earliest = enter ? tIn + POINTER.lead : prev.done + F(1);
    let t0 = arrive - dur;
    if (t0 < earliest) { t0 = earliest; if (arrive - t0 < POINTER.minDur) arrive = t0 + POINTER.minDur; }
    const off = st.from || POINTER.from;
    const from = enter ? { x: st.x + off.x, y: st.y + off.y } : { x: prev.x, y: prev.y };
    moves.push({ t0, t1: arrive, from, to: { x: st.x, y: st.y }, ease: enter ? enterE : S.E.move });
    const done = arrive + rest;
    times.push(done);
    prev = { x: st.x, y: st.y, done };
  }
  return {
    times, moves,
    at(t) {
      if (!moves.length || t < moves[0].t0) return { x: 0, y: 0, show: false };
      let m = moves[0];
      for (const mv of moves) if (t >= mv.t0) m = mv;
      const p = t >= m.t1 ? 1 : m.ease(clamp01((t - m.t0) / (m.t1 - m.t0)));
      return { x: m.from.x + (m.to.x - m.from.x) * p, y: m.from.y + (m.to.y - m.from.y) * p, show: true };
    },
  };
}

// ------------------------------------------------------------------ the ring pulse
/**
 * A ring pulse that marks a landing [X72, M22]: a thin ring starts at the element's edge, grows about 60 px
 * outward decelerating over about 9 frames while it fades, then is gone. seek(t, t0, box{x,y,w,h,r}).
 */
export function makeRing(S, parent, color) {
  const el = S.kit.h('div.pr-ring', { style: { position: 'absolute', display: 'none', boxSizing: 'border-box', border: `${POINTER.ring.width}px solid ${color}`, pointerEvents: 'none', zIndex: '4' } });
  parent.append(el);
  return {
    el,
    seek(t, t0, b) {
      const u = t - t0;
      const on = t0 != null && b && u >= 0 && u < motion.ring.dur;
      setStyle(el, 'display', on ? '' : 'none');
      if (!on) return;
      const p = clamp01(u / motion.ring.dur), d = POINTER.ring.grow * S.E.out(p);
      setStyle(el, 'left', `${(b.x - d).toFixed(2)}px`); setStyle(el, 'top', `${(b.y - d).toFixed(2)}px`);
      setStyle(el, 'width', `${(b.w + 2 * d).toFixed(2)}px`); setStyle(el, 'height', `${(b.h + 2 * d).toFixed(2)}px`);
      setStyle(el, 'borderRadius', `${((b.r ?? 0) + d).toFixed(2)}px`);
      setStyle(el, 'opacity', (1 - POINTER.ring.fade * p).toFixed(3));
    },
  };
}

/** Beats of one kind with their resolved times, in time order. */
export const beatsOf = (beats, kind) => beats.filter((b) => b.do === kind).sort((a, b) => a.t - b.t);

// ------------------------------------------------------------------ the element
const ITEM = { label: { type: 'string', maxChars: 16, maxWords: 3 }, sub: { type: 'string', optional: true, maxChars: 28 },
  after: { type: 'string', optional: true, maxChars: 14 }, icon: `enum?:${ICONS}` };

export default {
  type: 'window',
  label: 'Window',
  slots: ['graphic'],
  params: {
    kind: 'enum?:window|card',                                    // a window with traffic lights, or a plain card [X74, G16]
    title: { type: 'string', optional: true, maxChars: 30 },      // title-bar text (window only)
    heading: { type: 'string', optional: true, maxChars: 13 },    // a big heading at the top [T25 display words]
    status: { type: 'string', optional: true, maxChars: 38 },     // a status line under the heading [clip08@836]
    look: 'enum?:rows|buttons|tiles',                             // option rows, big buttons, or tiles to pick
    items: { type: 'array', min: 1, max: 4, of: ITEM },
    selected: { type: 'number', optional: true, min: 0, max: 3 }, // the row selected on the cut
    theme: 'enum?:light|dark',                                    // light or near-black window [X74]
    accent: { type: 'string', optional: true, maxChars: 7 },      // #RRGGBB for selection and buttons
  },
  beats: {
    click: { item: { type: 'number', min: 0, max: 3 }, status: { type: 'string', optional: true, maxChars: 38 } },   // the control changes on this word [X68]
    hover: { item: { type: 'number', min: 0, max: 3 } },                                                              // the pointer moves there, no click
    status: { text: { type: 'string', maxChars: 38 } },                                                               // the status line flips whole
    result: { text: { type: 'string', maxChars: 14 } },                                                               // a result pill grows in [X72, X77]
  },
  build(ctx) {
    const { S, params, beats, tIn } = ctx;
    const { h } = S.kit;
    const dark = params.theme === 'dark';
    const ink = dark ? '#FFFFFF' : colour.ink, soft = dark ? UI.dark.soft : colour.inkSoft;
    const acc = accentOf(params);
    const look = params.look || 'rows';
    const items = (params.items || []).slice(0, 4);
    const kind = params.kind || 'window';
    const W = UI.w, R = UI.row;
    const results = beatsOf(beats, 'result');

    // ---- vertical layout (frame pixels)
    const barH = kind === 'card' ? 0 : CARD.bar * CARD.dot;
    let y = barH;
    const parts = [];
    // a status beat (or a click that carries one) needs a status line even when the plan sets no starting text
    const hasStatus = params.status != null || beats.some((b) => b.do === 'status' || (b.do === 'click' && b.status));
    if (params.heading || hasStatus) {
      y += UI.heading.top;
      if (params.heading) { y += UI.heading.size * fonts.M.cap; parts.push({ k: 'heading', base: y }); }
      if (hasStatus) { y += params.heading ? UI.heading.statusGap : UI.status.size * 0.75; parts.push({ k: 'status', base: y }); }
      y += UI.heading.after;
    } else y += UI.pad;
    const sub = items.some((it) => it.sub);
    const rects = [];
    if (look === 'buttons') {
      for (const it of items) { rects.push({ x: UI.button.pad, y, w: W - 2 * UI.button.pad, h: UI.button.h, r: UI.button.radius }); y += UI.button.h + UI.button.gap; }
      y += UI.button.bottom - UI.button.gap;
    } else if (look === 'tiles') {
      const cols = items.length === 4 ? 2 : items.length;
      const tw = (W - 2 * UI.pad - (cols - 1) * UI.tile.gap) / cols, th = Math.min(300, tw * 0.92);
      items.forEach((it, i) => rects.push({ x: UI.pad + (i % cols) * (tw + UI.tile.gap), y: y + Math.floor(i / cols) * (th + UI.tile.gap), w: tw, h: th, r: UI.tile.radius }));
      y += Math.ceil(items.length / cols) * (th + UI.tile.gap) - UI.tile.gap + UI.pad;
    } else {
      const rh = sub ? R.h : R.h1;
      for (const it of items) { rects.push({ x: UI.pad, y, w: W - 2 * UI.pad, h: rh, r: R.radius }); y += rh + UI.gap; }
      y += UI.pad - UI.gap;
    }
    let pillY = null;
    if (results.length) { pillY = y - UI.pad + UI.pill.gap; y = pillY + UI.pill.h + UI.pad + 6; }
    const H = Math.round(y);

    const fr = uiFrame(ctx, { w: W, h: H, kind, title: params.title || '', dark });
    const body = fr.card;   // children positioned in frame pixels (the card has no padding)
    for (const p of parts) {
      if (p.k === 'heading') body.append(line(S, { text: params.heading, x: UI.heading.x, y: p.base, size: UI.heading.size, weight: fonts.weight.display, color: ink, tracking: -0.02 * UI.heading.size, fit: W - 2 * UI.heading.x }));
      if (p.k === 'status') { p.el = line(S, { text: params.status || '', x: UI.heading.x, y: p.base, size: UI.status.size, weight: fonts.weight.label, color: soft }); body.append(p.el); }
    }
    const statusEl = parts.find((p) => p.k === 'status')?.el;

    // ---- controls
    const ctl = items.map((it, i) => {
      const r = rects[i];
      const el = h('div', { style: { position: 'absolute', left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px`, borderRadius: `${r.r}px`, boxSizing: 'border-box' } });
      const c = { el, r, it };
      if (look === 'buttons') {
        c.label = line(S, { text: it.label, x: r.w / 2, y: r.h / 2 + (UI.button.label * fonts.M.cap) / 2, size: UI.button.label, weight: fonts.weight.heavy, color: '#FFFFFF', align: 'center', fit: r.w - 48 });
        c.after = it.after ? line(S, { text: `✓ ${it.after}`, x: r.w / 2, y: r.h / 2 + (UI.button.label * fonts.M.cap) / 2, size: UI.button.label, weight: fonts.weight.heavy, color: '#FFFFFF', align: 'center', fit: r.w - 48, style: { display: 'none' } }) : null;
        el.append(c.label); if (c.after) el.append(c.after);
      } else if (look === 'tiles') {
        const gsz = Math.min(UI.tile.glyph, r.h * 0.4);
        const g = glyph(S, it.icon || 'letter', gsz, { letter: it.label });
        Object.assign(g.style, { position: 'absolute', left: `${(r.w - gsz) / 2}px`, top: `${r.h * 0.42 - gsz / 2}px` });
        el.append(g, line(S, { text: it.label, x: r.w / 2, y: r.h * 0.8, size: UI.tile.label, weight: fonts.weight.body, color: ink, align: 'center', fit: r.w - 28 }));
        el.style.background = dark ? UI.dark.tile : UI.tileFill;
      } else {
        const tx = it.icon ? R.textX : R.textX0;
        if (it.icon) { const g = glyph(S, it.icon, R.icon, { letter: it.label }); Object.assign(g.style, { position: 'absolute', left: `${R.iconX - R.icon / 2}px`, top: `${(r.h - R.icon) / 2}px` }); el.append(g); }
        const tBase = sub ? R.titleBase : (r.h + R.title * fonts.M.cap) / 2;
        const room = r.w - tx - R.tickIn - R.tick - 20;
        el.append(line(S, { text: it.label, x: tx, y: tBase, size: R.title, weight: R.weight, color: ink, tracking: -0.01 * R.title, fit: room }));
        if (it.sub) el.append(line(S, { text: it.sub, x: tx, y: R.subBase, size: R.sub, weight: fonts.weight.label, color: soft, fit: room }));
        c.tick = tickMark(S, R.tick, acc);
        Object.assign(c.tick.style, { position: 'absolute', left: `${r.w - R.tickIn - R.tick}px`, top: `${(r.h - R.tick) / 2}px`, display: 'none' });
        el.append(c.tick);
      }
      body.append(el);
      return c;
    });

    // ---- pointer stops
    const target = (i) => {
      const r = rects[Math.max(0, Math.min(rects.length - 1, i))];
      if (look === 'buttons') return { x: r.x + r.w / 2 + 0.13 * r.w, y: r.y + r.h / 2 - 0.1 * r.h };   // [clip08@872]
      if (look === 'tiles') return { x: r.x + r.w * 0.65, y: r.y + r.h * 0.7 };                           // by eye
      return { x: r.x + 0.8 * r.w, y: r.y + 0.62 * r.h };                                                  // [clip10@712]
    };
    const acts = beats.filter((b) => b.do === 'click' || b.do === 'hover').sort((a, b) => a.t - b.t);
    const track = pointerTrack(S, tIn, acts.map((b) => ({ t: b.t, ...target(b.item ?? 0), click: b.do === 'click' })));
    const clicks = acts.map((b, k) => ({ ...b, tc: track.times[k] })).filter((b) => b.do === 'click');
    const pointer = makePointer(S);
    const ring = makeRing(S, fr.over, dark ? '#FFFFFF' : acc);
    fr.over.append(pointer.el);

    // the status line: the plan's text, then every status change in time order (a click may carry one)
    const statusFlips = [...beatsOf(beats, 'status').map((b) => ({ t: b.t, text: b.text })), ...clicks.filter((b) => b.status).map((b) => ({ t: b.tc, text: b.status }))].sort((a, b) => a.t - b.t);

    // the result pill
    let pill = null;
    if (pillY != null) {
      const txt = `✓ ${results[0].text}`;
      const pw = measureText(txt, sansFont(UI.pill.size, fonts.weight.heavy)) + 64;
      pill = h('div', { text: txt, style: { position: 'absolute', left: `${(W - pw) / 2}px`, top: `${pillY}px`, width: `${pw}px`, height: `${UI.pill.h}px`, borderRadius: `${UI.pill.h / 2}px`,
        background: UI.done, color: '#FFFFFF', font: sansFont(UI.pill.size, fonts.weight.heavy), display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(0)' } });
      body.append(pill);
    }

    const el = h('div.pr-window', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, fr.wrap);
    const sel0 = look === 'rows' && params.selected != null ? params.selected : null;
    const tint = mix(acc, R.tint, dark ? UI.dark.fill : '#FFFFFF');
    return {
      el, box: fr.box,
      seek(t) {
        const pt = track.at(t);
        pointer.seek(pt.x, pt.y, pt.show);
        // which control is selected / pressed now: the last click at or before t
        let last = null;
        for (const c of clicks) if (t >= c.tc) last = c;
        const picked = last ? last.item : sel0;
        ctl.forEach((c, i) => {
          const on = picked === i;
          if (look === 'buttons') {
            const pressed = clicks.some((k) => k.item === i && t >= k.tc);
            setStyle(c.el, 'background', pressed ? (dark ? '#34353C' : '#2A2A30') : acc);
            setStyle(c.el, 'boxShadow', pressed ? 'none' : `0 10px 24px -12px ${mix(acc, 1)}`);
            if (c.after) { setStyle(c.label, 'display', pressed ? 'none' : ''); setStyle(c.after, 'display', pressed ? '' : 'none'); }
            // a 2-frame press dip on the click [X68: 1-frame dips in 3 of 23]
            const k = clicks.filter((q) => q.item === i && t >= q.tc).pop();
            const u = k ? t - k.tc : -1;
            setStyle(c.el, 'transform', u >= 0 && u < F(2) ? `scale(${u < F(1) ? 0.96 : 0.98})` : '');
          } else if (look === 'tiles') {
            const any = picked != null;
            setStyle(c.el, 'boxShadow', on ? `inset 0 0 0 ${R.line}px ${acc}` : 'none');
            setStyle(c.el, 'background', on ? tint : dark ? UI.dark.tile : UI.tileFill);
            setStyle(c.el, 'opacity', any && !on ? '0.42' : '');
            setStyle(c.el, 'filter', any && !on ? 'grayscale(1)' : '');
          } else {
            setStyle(c.el, 'boxShadow', on ? `inset 0 0 0 ${R.line}px ${acc}` : 'none');
            setStyle(c.el, 'background', on ? tint : 'transparent');
            // the tick pops a frame after the outline jumps [clip10@707-708]; the row selected on the cut has none [clip10@694]
            const tickOn = on && last && last.item === i && t >= last.tc + F(1);
            setStyle(c.tick, 'display', tickOn ? '' : 'none');
          }
        });
        // a ring pulse marks a picked tile [X72, clip06@536]
        const lastTile = look === 'tiles' && last ? last : null;
        ring.seek(t, lastTile ? lastTile.tc : null, lastTile ? rects[lastTile.item] : null);
        if (statusEl) {
          let txt = params.status || '';
          for (const f of statusFlips) if (t >= f.t) txt = f.text;
          if (statusEl._txt !== txt) { statusEl.textContent = txt; statusEl._txt = txt; }
        }
        if (pill) {
          const u = t - results[0].t;
          const s = u < 0 ? 0 : UI.pill.from + (1 - UI.pill.from) * S.E.out(clamp01(u / motion.prop.dur));
          setStyle(pill, 'transform', u < 0 ? 'scale(0)' : s > 0.9998 ? '' : `scale(${s.toFixed(4)})`);
        }
      },
    };
  },
};
