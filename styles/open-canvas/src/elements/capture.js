// A real capture (a page, an app screen or a clip) seen through a moving crop, with pointers that land on the
// spoken word (research/graphics.md G07-G12; explain.md X01-X06; motion.md M05-M07).
//
// The picture is an `asset`: a page captured with `motus capture <url> --out assets/<name>.png --full` (which
// also writes `<name>.png.json` with the places of phrases asked for with --find), a screen recording, or a file
// the user supplies. It is never redrawn [X01].
//   view        the crop: x, y and width in the asset's own pixels; the height follows the slot. Crop until the
//               words being pointed at are readable on a phone [X03]
//   highlight   a thin accent box grows left to right over a phrase or region in 5 frames = "read this" [G05, M06]
//   tap         a translucent dot slides to a point in 8 frames and presses = "tap" [G06, M07]
//   view beat   the crop moves to a new place in 12 frames; a fast vertical move is motion-blurred, the frame
//               around it stays still = "or over here" [M05]
//   swap        a hard cut to another asset inside the same frame, about one a second in a list of uses [X05]
// Later beats act on the asset on screen when they fire.
import { colour, motion } from '../tokens.js';
import { setStyle, clamp01, tw, px } from '../common.js';
import { highlight, tapDot } from '../parts.js';
import { loadMedia, mediaView } from '../media.js';

const REGION = { find: { type: 'string', optional: true, maxChars: 80 }, x: 'number?', y: 'number?', w: 'number?', h: 'number?' };
const VIEW = { x: { type: 'number', optional: true, min: 0 }, y: { type: 'number', optional: true, min: 0 }, w: { type: 'number', optional: true, min: 40 } };

function findBox(side, text) {
  if (!side || !text) return null;
  const want = String(text).toLowerCase().replace(/\s+/g, ' ').trim();
  const f = (side.finds || []).find((q) => q.found && String(q.text).toLowerCase() === want) || (side.finds || []).find((q) => q.found && String(q.text).toLowerCase().includes(want));
  return f && f.rects.length ? f.rects[0] : null;
}

export default {
  type: 'capture',
  label: 'Real capture',
  slots: ['window', 'screen'],
  params: {
    src: 'asset',                                                  // png, jpg, or a clip (mp4, mov, webm)
    ...VIEW,                                                       // the crop on the cut: default the whole width from the top
    start: { type: 'number', optional: true, min: 0 },             // a clip starts this many seconds in
  },
  beats: {
    highlight: { ...REGION, until: 'word?' },                      // the box leaves on this word (default: stays)
    tap: { x: 'number', y: 'number' },                             // asset px
    view: { ...VIEW, frames: { type: 'number', optional: true, min: 6, max: 30 } },
    swap: { src: 'asset', ...VIEW, start: { type: 'number', optional: true, min: 0 } },
  },
  async prepare(params, S, rawBeats = []) {
    const srcs = [...new Set([params.src, ...rawBeats.filter((b) => b.do === 'swap').map((b) => b.src)])];
    const media = {}, sides = {};
    await Promise.all(srcs.map(async (src) => {
      media[src] = await loadMedia(S, src);
      try { const r = await fetch(S.env.projectUrl(`${src}.json`)); if (r.ok) sides[src] = await r.json(); } catch { /* no sidecar: regions are given in px */ }
    }));
    return { media, sides };
  },
  build(ctx) {
    const { S, params, beats, tIn, box, data } = ctx;
    const { h } = S.kit;
    const bw = box.w, bh = box.h;
    const el = h('div.oc-capture', { style: { position: 'absolute', left: '0', top: '0', width: `${bw}px`, height: `${bh}px`, overflow: 'hidden', background: colour.windowFill } });
    const id = `oc-whip-${S.uid()}`;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
    const filter = document.createElementNS(NS, 'filter');
    filter.setAttribute('id', id); filter.setAttribute('x', '0'); filter.setAttribute('y', '-20%'); filter.setAttribute('width', '100%'); filter.setAttribute('height', '140%');
    const gb = document.createElementNS(NS, 'feGaussianBlur'); gb.setAttribute('stdDeviation', '0 0');
    filter.append(gb); svg.append(filter); el.append(svg);

    // segments: the opening asset, then one per swap
    const seg = (t, src, v, start) => {
      const m = data.media[src];
      const mv = mediaView(S, m, m.w, m.h, { fit: 'cover', t0: t, start: start || 0 });
      const layer = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${m.w}px`, height: `${m.h}px`, transformOrigin: '0 0' } }, mv.el);
      const wrap = h('div', { style: { position: 'absolute', inset: '0', display: 'none' } }, layer);
      el.append(wrap);
      return { t, m, mv, layer, wrap, side: data.sides[src], base: [v.x ?? 0, v.y ?? 0, v.w ?? m.w], views: [], marks: [], taps: [], dot: null, on: null };
    };
    const segs = [seg(tIn, params.src, params, params.start)];
    for (const b of beats) {
      if (b.do === 'swap') { segs.push(seg(b.t, b.src, b, b.start)); continue; }
      const s = segs[segs.length - 1];
      if (b.do === 'view') s.views.push({ t: b.t, to: [b.x, b.y, b.w], dur: b.frames ? b.frames / 30 : motion.whip });
      else if (b.do === 'tap') s.taps.push({ t: b.t, x: b.x, y: b.y });
      else if (b.do === 'highlight') {
        let r = findBox(s.side, b.find);
        if (b.find && !r) S.warn(`capture: "${b.find}" is not in the capture's .json (capture with --find, or give x, y, w, h)`);
        if (!r && [b.x, b.y, b.w, b.h].every(Number.isFinite)) r = { x: b.x, y: b.y, w: b.w, h: b.h };
        if (!r) { S.warn('capture: a highlight needs find, or x, y, w and h'); continue; }
        const hl = highlight(S);
        s.wrap.append(hl.el);
        s.marks.push({ t: b.t, until: b.untilT, r, hl });
      }
    }
    for (const s of segs) if (s.taps.length) { s.dot = tapDot(S); s.wrap.append(s.dot.el); }
    if (segs.length === 1 && !beats.length && data.media[params.src]?.kind === 'image') S.warn('capture: a still with no beats sits dead; give it a pointer, a move or a swap within 1.5 s [S06]');

    const viewAt = (s, t) => {
      let v = s.base;
      for (const a of s.views) {
        if (t < a.t) break;
        const p = S.E.move(clamp01((t - a.t) / a.dur));
        v = [0, 1, 2].map((i) => v[i] + ((a.to[i] ?? v[i]) - v[i]) * p);
      }
      return v;
    };
    const T = motion.tap;
    return {
      el,
      seek(t) {
        let cur = segs[0];
        for (const s of segs) if (t >= s.t) cur = s;
        for (const s of segs) {
          const on = s === cur;
          if (s.on !== on) { s.wrap.style.display = on ? '' : 'none'; s.on = on; }
          s.mv.seek(t, on);
          if (!on) continue;
          const v = viewAt(s, t), v0 = viewAt(s, t - 1 / 30);
          const sc = bw / v[2];
          const speed = Math.abs(v[1] * sc - v0[1] * (bw / v0[2]));          // px per frame of vertical travel
          const blur = speed > motion.whipBlurAt ? Math.min(motion.whipBlurMax, speed * motion.whipBlurK) : 0;
          setStyle(s.layer, 'transform', `translate(${(-v[0] * sc).toFixed(2)}px, ${(-v[1] * sc).toFixed(2)}px) scale(${sc.toFixed(5)})`);
          if (blur) gb.setAttribute('stdDeviation', `0 ${blur.toFixed(2)}`);
          setStyle(s.layer, 'filter', blur ? `url(#${id})` : '');
          for (const m of s.marks) {
            const p = t < m.t || (m.until !== undefined && t >= m.until) ? 0 : tw(t, m.t, motion.box, 0, 1, S.E.out);
            m.hl.place((m.r.x - v[0]) * sc, (m.r.y - v[1]) * sc, m.r.w * sc, m.r.h * sc, p <= 0 ? 0 : Math.max(p, 0.001));
          }
          if (s.dot) {
            const first = s.taps[0], last = s.taps[s.taps.length - 1];
            const on2 = t >= first.t - T.travel - T.lead && t < last.t + T.linger;
            let x = first.x + T.from[0], y = first.y + T.from[1], press = 0;
            for (const a of s.taps) {
              const p = tw(t, a.t - T.travel, T.travel, 0, 1, S.E.out);
              x += (a.x - x) * p; y += (a.y - y) * p;
              if (t >= a.t && t < a.t + T.press) press = 1 - (t - a.t) / T.press;
            }
            s.dot.place((x - v[0]) * sc, (y - v[1]) * sc, press, T.shrink, on2);
          }
        }
      },
      settled: () => Promise.all(segs.filter((s) => s.on).map((s) => s.mv.settled())),
    };
  },
};
