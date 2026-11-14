// A capture the user supplied: an interface, a page, a profile, a thumbnail or a clip, shown inside a
// frame and never redrawn (research/graphics.md G16, G17, G19, G20). About half of the graphic time
// in the reference is captures [G19].
//   one item   about 840 px wide, centred, rounded, inside a frame [G17]
//   2-4 items  a grid of thumbnails, about 846 px wide [L13]
// Frames: 'card' a 2 px grey stroke; 'cobalt' a thin cobalt stroke; 'blue' a pale stroke with a soft outer
// glow; 'none'. On the light field the card has a 1 px grey border [G22]. It scales in from 0.58 of
// its size [M14] (or slides in as a strip when it replaces another graphic [M13]).
import { colour, layout, motion } from '../tokens.js';
import { ENTER, CAMERA_BEATS, centred, entrance, scaleIn, setStyle, spotlights } from '../common.js';
import { loadMedia, mediaView } from '../media.js';

// TOKENS (research/graphics.md G17, layout.md L13; the cobalt frame: colour.md C28)
const G = {
  width: 840, gridW: 846, maxH: 900, gridMaxH: 858, gap: 24, radius: 16,
  frames: {
    card: { stroke: 2, colour: '#8A8A8A', glow: null },
    cobalt: { stroke: 3, colour: '#1852F3', glow: null },
    blue: { stroke: 2, colour: '#C0F0FB', glow: '0 0 35px rgba(150,220,245,0.45)' },
    none: { stroke: 0, colour: 'transparent', glow: null },
  },
  blur: 14,   // a capture shown only for its existence is blurred [G17]
};

export default {
  type: 'capture',
  label: 'Capture',
  slots: ['graphic', 'side'],
  hold: 'zoom',
  params: {
    items: { type: 'array', min: 1, max: 4, of: {
      src: 'asset',                              // png, jpg, webp, or a clip (mp4, mov, webm)
      fit: 'enum?:cover|contain',                // contain (default) shows all of it
      start: { type: 'number', optional: true, min: 0 },   // clip: seconds into the file when it appears
      loop: 'boolean?',
    } },
    frame: 'enum?:card|cobalt|blue|none',        // default card
    blur: 'boolean?',                            // blur the content (its existence is the point)
    width: { type: 'number', optional: true, min: 400, max: 1000 },
    ...ENTER,
  },
  beats: { spot: { x: 'number', y: 'number', r: 'number?' }, ...CAMERA_BEATS },

  async prepare(params, S) {
    return { items: await Promise.all(params.items.map((it) => loadMedia(S, it.src))) };
  },

  build(ctx) {
    const { S, params: p, mode, tIn, data, beats, cx, slot } = ctx; const { h } = S.kit;
    const n = p.items.length;
    const fr = G.frames[p.frame || 'card'];
    const light = mode === 'light';
    const stroke = light && (p.frame || 'card') === 'card' ? { stroke: 1, colour: colour.lightCard.border, glow: null } : fr;
    let w, hh, cells;
    if (n === 1) {
      const m = data.items[0];
      w = p.width || (slot === 'side' ? 400 : G.width);
      hh = Math.min(slot === 'side' ? 700 : G.maxH, Math.round((w * m.h) / m.w));
      if ((p.items[0].fit || 'contain') === 'contain' && hh === G.maxH) w = Math.round((hh * m.w) / m.h);
      cells = [{ x: 0, y: 0, w, h: hh }];
    } else {
      w = p.width || G.gridW;
      const cols = n === 3 ? 3 : 2, rows = Math.ceil(n / cols);
      const cw = (w - G.gap * (cols - 1)) / cols;
      const ar = data.items[0].h / data.items[0].w;
      const ch = Math.min((G.gridMaxH - G.gap * (rows - 1)) / rows, cw * ar);
      hh = rows * ch + (rows - 1) * G.gap;
      cells = p.items.map((_, i) => ({ x: (i % cols) * (cw + G.gap), y: Math.floor(i / cols) * (ch + G.gap), w: cw, h: ch }));
    }
    const box = centred(w, hh, undefined, cx);
    const root = h('div.nc-capture', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${w}px`, height: `${hh}px`, transformOrigin: '50% 50%', willChange: 'transform, opacity' } });
    const views = cells.map((c, i) => {
      const it = p.items[i];
      const v = mediaView(S, data.items[i], c.w, c.h, { fit: it.fit || 'contain', start: it.start, loop: it.loop, t0: tIn });
      const card = h('div', { style: { position: 'absolute', left: `${c.x}px`, top: `${c.y}px`, width: `${c.w}px`, height: `${c.h}px`, borderRadius: `${G.radius}px`, overflow: 'hidden',
        background: light ? colour.lightCard.fill : '#000', filter: p.blur ? `blur(${G.blur}px)` : 'none' } }, v.el);
      const ring = h('div', { style: { position: 'absolute', left: `${c.x}px`, top: `${c.y}px`, width: `${c.w}px`, height: `${c.h}px`, borderRadius: `${G.radius}px`, pointerEvents: 'none',
        boxShadow: [stroke.stroke ? `inset 0 0 0 ${stroke.stroke}px ${stroke.colour}` : null, stroke.glow].filter(Boolean).join(', ') || 'none' } });
      root.append(card, ring);
      return v;
    });
    const spot = spotlights(S, beats, { w, h: hh }, root);
    const { t0, settled } = entrance(ctx);
    return {
      el: root, ticks: spot.ticks, box,
      seek(t) {
        const e = scaleIn(S, t, t0, settled);
        setStyle(root, 'transform', e.s < 0.9999 ? `scale(${e.s.toFixed(4)})` : 'none');
        setStyle(root, 'opacity', String(e.o));
        for (const v of views) v.seek(t, true);
        spot.seek(t);
      },
      settled: () => Promise.all(views.map((v) => v.settled())),
    };
  },
};
