// A captured page or app set inside rebuilt browser chrome and acted on with rebuilt events (research/explain.md
// X51, X71, X73; graphics.md G19; devices site_capture_shown and markup_on_capture).
//
// The picture is an `asset`: a page the project captured with `motus capture <url> --out assets/<name>.png`
// (which also writes `<name>.png.json`, the places of the phrases asked for with --find), or a file the user
// supplies. It is never redrawn; the chrome and the events are the style's [X73].
// Measured instance clip01@764-871 (panel): a browser window 918 x 610 px (x 70-988, y 229-839) with a 64 px light
// bar, the traffic lights and a centred white URL pill 324 x 34 px; the page scrolls 503 px over 17 frames
// with an ease-in-out (786-802) [X71: page scrolls 11-42 frames, 250-4400 px, easeInOutQuad]; a 3 px blue
// outline #3D7EDE draws clockwise round a panel over 14 frames (820-834); rows highlight in light blue
// (828-866). Marks follow their word by about 7 frames [X56]; red ellipses mark flaws (clip06@784-796).
import { F, colour, motion } from '../tokens.js';
import { place, setStyle, clamp01 } from '../common.js';
import { hexOr, rgbaOf, windowChrome } from './ui-kit.js';

// TOKENS (research/explain.md X56, X71-X73; measured clip01@764-871 unless marked)
const WIN = { w: 918, maxH: { split: 610, full: 1000 } };   // window x 70-988, y 229-839 in the panel (clip01@840); full-frame height by eye
const MARK = {
  colour: '#3D7EDE',           // outline blue, calibrated (clip01@840)
  stroke: 3,                   // outline width px (clip01@840)
  pad: 10,                     // space between a found phrase and its outline (by eye)
  radius: 14,                  // outline corner radius (by eye)
  draw: F(14),                 // an outline draws clockwise in 14 frames (clip01@820-834)
  sweep: F(6),                 // a highlight sweeps in left to right (by eye; clip01@828-866 covers many rows)
  hiAlpha: 0.2,                // highlight band opacity (by eye on clip01@840)
};
const ARROW = { len: 150, width: 8, head: 30, slide: motion.prop.slide, dur: motion.prop.dur };   // by eye; slides like a part [M12]
const SCROLL = { min: 11, max: 42, perPx: 1 / 120 };   // frames = 11 + px/120, clamped 11-42 (fit by eye to X71's six scrolls)

/** The box of a found phrase in image px (the union of its first line's rects), or null. */
function findBox(side, text) {
  if (!side || !text) return null;
  const want = String(text).toLowerCase().replace(/\s+/g, ' ').trim();
  const f = (side.finds || []).find((q) => q.found && String(q.text).toLowerCase() === want) || (side.finds || []).find((q) => q.found && String(q.text).toLowerCase().includes(want));
  if (!f || !f.rects.length) return null;
  const r = f.rects[0];
  return { x: r.x, y: r.y, w: r.w, h: r.h };
}

const REGION = { find: { type: 'string', optional: true, maxChars: 60 }, x: 'number?', y: 'number?', w: 'number?', h: 'number?' };

export default {
  type: 'capture',
  label: 'Captured page',
  slots: ['graphic'],
  params: {
    src: 'asset',                                                  // the captured page or app (png, jpg)
    url: { type: 'string', optional: true, maxChars: 28 },         // the address in the pill (a domain, from the plan)
    top: { type: 'number', optional: true, min: 0 },               // image px at the top of the view on the cut
    dark: 'boolean?',                                              // a dark bar for dark pages and apps [X74]
    accent: { type: 'string', optional: true, maxChars: 7 },       // the colour of the marks (#RRGGBB, default blue)
  },
  beats: {
    scroll: { to: { type: 'number', min: 0 }, frames: { type: 'number', optional: true, min: 11, max: 42 } },   // image px at the top of the view after the scroll [X71]
    outline: { ...REGION, shape: 'enum?:box|ellipse' },          // a box or ellipse draws round a phrase (find) or a region [X73]
    highlight: { ...REGION },                                      // a translucent band sweeps over a phrase or region
    arrow: { ...REGION },                                          // an arrow slides in and points at it
  },
  async prepare(params, S) {
    const out = { img: null, side: null };
    try { const img = new Image(); img.src = S.env.projectUrl(params.src); await img.decode(); out.img = img; } catch { S.warn(`capture: could not load ${params.src}`); }
    try { const r = await fetch(S.env.projectUrl(`${params.src}.json`)); if (r.ok) out.side = await r.json(); } catch { /* no sidecar: regions must be given in px */ }
    return out;
  },
  build(ctx) {
    const { S, params, beats, mode, tIn, data } = ctx;
    const { h } = S.kit;
    const accent = hexOr(params.accent, MARK.colour);
    const img = data?.img;
    const iw = img ? img.naturalWidth : 1440, ih = img ? img.naturalHeight : 900;
    const k = WIN.w / iw;                                          // screen px per image px
    const barH = 4.5 * 13.5;
    const H = Math.min(WIN.maxH[mode === 'full' ? 'full' : 'split'], Math.round(barH + ih * k));
    const box = place(ctx, WIN.w, H);
    const el = h('div.pr-capture', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${WIN.w}px`, height: `${H}px`,
      transform: box.s < 0.999 ? `scale(${box.s})` : '', transformOrigin: '0 0' } });
    const win = windowChrome(S, { x: 0, y: 0, w: WIN.w, h: H, dark: !!params.dark, url: params.url || '', title: params.url ? '' : (data?.side?.title || '').slice(0, 40) });
    el.append(win.el);
    const viewH = H - win.barH;
    const page = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${WIN.w}px`, height: `${ih * k}px` } });
    if (img) page.append(h('img', { src: img.src, style: { position: 'absolute', left: '0', top: '0', width: `${WIN.w}px`, height: `${ih * k}px` } }));
    win.body.append(page);
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', WIN.w); svg.setAttribute('height', ih * k);
    Object.assign(svg.style, { position: 'absolute', left: '0', top: '0', overflow: 'visible', pointerEvents: 'none' });
    page.append(svg);

    const maxTop = Math.max(0, ih - viewH / k);
    const clampTop = (y) => Math.max(0, Math.min(maxTop, y));
    // the region a beat names, in screen px on the page
    const region = (b) => {
      let r = findBox(data?.side, b.find);
      if (b.find && !r) S.warn(`capture: "${b.find}" is not in ${params.src}.json (capture with --find)`);
      if (!r && [b.x, b.y].every(Number.isFinite)) r = { x: b.x, y: b.y, w: b.w ?? 0, h: b.h ?? 0 };
      if (!r) { S.warn(`capture: a ${b.do} beat needs find or x, y`); return null; }
      return { x: r.x * k, y: r.y * k, w: r.w * k, h: r.h * k };
    };

    // scrolls
    let cur = clampTop(params.top ?? 0);
    let scrolls = beats.filter((b) => b.do === 'scroll').map((b) => {
      const from = cur, to = clampTop(b.to); cur = to;
      const px = Math.abs(to - from) * k;
      return { t: b.t, from, to, dur: F(b.frames ?? Math.max(SCROLL.min, Math.min(SCROLL.max, Math.round(SCROLL.min + px * SCROLL.perPx)))) };
    });
    const marksGiven = beats.some((b) => b.do !== 'scroll');
    if (!scrolls.length && !marksGiven) {
      if (maxTop > 0) {   // never hold an interface without an event [X78]: scroll by up to one view, 10 frames after the cut (by eye)
        const to = clampTop(cur + viewH / k * 0.8), px = (to - cur) * k;
        scrolls = [{ t: tIn + F(10), from: cur, to, dur: F(Math.max(SCROLL.min, Math.min(SCROLL.max, Math.round(SCROLL.min + px * SCROLL.perPx)))) }];
      } else S.warn('capture: no beats and nothing to scroll; an interface is never held without an event [X78]');
    }
    const top0 = clampTop(params.top ?? 0);

    // marks
    const marks = [];
    for (const b of beats.filter((q) => q.do !== 'scroll')) {
      const r = region(b);
      if (!r) continue;
      if (b.do === 'outline') {
        const p = MARK.pad, x = r.x - p, y = r.y - p, w = r.w + 2 * p, hh = r.h + 2 * p;
        let d, len;
        if (b.shape === 'ellipse') {
          const cx = x + w / 2, cy = y + hh / 2, rx = w / 2 + 8, ry = hh / 2 + 8;
          d = `M ${cx} ${cy - ry} A ${rx} ${ry} 0 1 1 ${cx - 0.01} ${cy - ry}`;
          len = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
        } else {
          const rr = Math.min(MARK.radius, w / 2, hh / 2);
          d = `M ${x + rr} ${y} H ${x + w - rr} A ${rr} ${rr} 0 0 1 ${x + w} ${y + rr} V ${y + hh - rr} A ${rr} ${rr} 0 0 1 ${x + w - rr} ${y + hh} H ${x + rr} A ${rr} ${rr} 0 0 1 ${x} ${y + hh - rr} V ${y + rr} A ${rr} ${rr} 0 0 1 ${x + rr} ${y} Z`;
          len = 2 * (w + hh - 4 * rr) + 2 * Math.PI * rr;
        }
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', d);
        Object.assign(path.style, { fill: 'none', stroke: b.shape === 'ellipse' && !params.accent ? '#E5484D' : accent, strokeWidth: `${MARK.stroke}px`, strokeLinecap: 'round',
          strokeDasharray: `${len.toFixed(1)}`, strokeDashoffset: `${len.toFixed(1)}`, visibility: 'hidden' });
        svg.append(path);
        marks.push({ t: b.t, kind: 'outline', path, len });
      } else if (b.do === 'highlight') {
        const band = h('div', { style: { position: 'absolute', left: `${r.x - 4}px`, top: `${r.y - 2}px`, width: `${r.w + 8}px`, height: `${r.h + 4}px`, borderRadius: '4px',
          background: rgbaOf(accent, MARK.hiAlpha), clipPath: 'inset(0 100% 0 0)' } });
        page.insertBefore(band, svg);
        marks.push({ t: b.t, kind: 'highlight', band });
      } else if (b.do === 'arrow') {
        // points at the region's centre from the upper right, at 45 degrees
        const tx = r.x + r.w / 2 + (r.w ? r.w / 2 + 12 : 0) * 0.7, ty = r.y + r.h / 2 - (r.h ? r.h / 2 + 12 : 0) * 0.7;
        const g = document.createElementNS(NS, 'g');
        const A = ARROW, ux = Math.SQRT1_2, uy = -Math.SQRT1_2;   // direction from the tip back along the shaft
        const shaft = document.createElementNS(NS, 'path');
        shaft.setAttribute('d', `M ${tx + ux * 6} ${ty + uy * 6} L ${tx + ux * A.len} ${ty + uy * A.len}`);
        Object.assign(shaft.style, { stroke: accent, strokeWidth: `${A.width}px`, strokeLinecap: 'round', fill: 'none' });
        const head = document.createElementNS(NS, 'path');
        const hx = tx + ux * A.head, hy = ty + uy * A.head;
        head.setAttribute('d', `M ${tx} ${ty} L ${hx + uy * A.head * 0.62} ${hy - ux * A.head * 0.62} L ${hx - uy * A.head * 0.62} ${hy + ux * A.head * 0.62} Z`);
        Object.assign(head.style, { fill: accent, stroke: accent, strokeWidth: '4px', strokeLinejoin: 'round' });
        g.append(shaft, head);
        g.style.visibility = 'hidden';
        svg.append(g);
        marks.push({ t: b.t, kind: 'arrow', g, ux, uy });
      }
    }

    return {
      el, box,
      seek(t) {
        // the page position: the last scroll that has started decides it
        let y = top0;
        for (const s of scrolls) if (t >= s.t) y = s.from + (s.to - s.from) * S.kit.ease.inOutQuad(clamp01((t - s.t) / s.dur));
        setStyle(page, 'transform', `translateY(${(-y * k).toFixed(2)}px)`);
        for (const m of marks) {
          const a = t - m.t;
          if (m.kind === 'outline') {
            setStyle(m.path, 'visibility', a >= 0 ? 'visible' : 'hidden');
            setStyle(m.path, 'strokeDashoffset', (m.len * (1 - S.E.out(clamp01(a / MARK.draw)))).toFixed(1));
          } else if (m.kind === 'highlight') {
            const p = a < 0 ? 0 : S.E.out(clamp01(a / MARK.sweep));
            setStyle(m.band, 'clipPath', `inset(0 ${(100 * (1 - p)).toFixed(2)}% 0 0)`);
          } else if (m.kind === 'arrow') {
            setStyle(m.g, 'visibility', a >= 0 ? 'visible' : 'hidden');
            const d = ARROW.slide * (1 - S.E.out(clamp01(a / ARROW.dur)));
            setStyle(m.g, 'transform', d > 0.05 ? `translate(${(m.ux * d).toFixed(2)}px, ${(m.uy * d).toFixed(2)}px)` : '');
          }
        }
      },
    };
  },
};
