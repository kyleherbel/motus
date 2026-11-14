// A phone holding a capture: a realistic frame about 457 px wide (height 2.05x, corner radius 12 % of
// the width, a bright metal rim then black bezel) with the user's screen inside; it rises into place
// and can zoom until it nearly fills the frame when the screen itself is the point
// (research/graphics.md G16, layout.md L13; motion.md M11, M24). The screen is always a capture.
import { CX, colour, layout } from '../tokens.js';
import { ENTER, CAMERA_BEATS, centred, entrance, riseIn, setStyle, spotlights } from '../common.js';
import { loadMedia, mediaView } from '../media.js';

// TOKENS (research/graphics.md G16)
// The reference zooms a phone to fill the frame only with the panel hidden (field mode, not built) [G24];
// with the panel on screen the zoom stops where the phone meets the title band and the caption.
const G = { w: 457, aspect: 2.05, radiusFrac: 0.12, bezel: 14, rim: 3, rimColour: '#9A9CA0', island: { w: 0.27, h: 30, top: 18 }, zoomTop: 130, zoomBottom: 1225, zoomDur: 0.76 };

export default {
  type: 'phone',
  label: 'Phone',
  slots: ['graphic', 'side'],
  hold: 'zoom',
  params: {
    src: 'asset',                                 // the screen: a screenshot or a screen recording
    fit: 'enum?:cover|contain',
    start: { type: 'number', optional: true, min: 0 },
    loop: 'boolean?',
    ...ENTER,
  },
  beats: { zoom: { x: 'number?', y: 'number?', scale: 'number?' }, spot: { x: 'number', y: 'number', r: 'number?' }, ...CAMERA_BEATS },

  async prepare(params, S) { return { m: await loadMedia(S, params.src) }; },

  build(ctx) {
    const { S, params: p, tIn, beats, data, cx } = ctx; const { kit } = S; const { h } = kit;
    const w = G.w, hh = Math.round(G.w * G.aspect);
    const box = centred(w, hh, Math.max(layout.graphic.cy, 760), cx);
    const r = Math.round(w * G.radiusFrac);
    const iw = w - 2 * (G.bezel + G.rim), ih = hh - 2 * (G.bezel + G.rim);
    const v = mediaView(S, data.m, iw, ih, { fit: p.fit || 'cover', start: p.start, loop: p.loop, t0: tIn });
    const screen = h('div', { style: { position: 'absolute', left: `${G.bezel + G.rim}px`, top: `${G.bezel + G.rim}px`, width: `${iw}px`, height: `${ih}px`, borderRadius: `${r - G.bezel - G.rim}px`, overflow: 'hidden', background: '#000' } }, v.el);
    const island = h('div', { style: { position: 'absolute', left: `${(w - w * G.island.w) / 2}px`, top: `${G.bezel + G.rim + G.island.top}px`, width: `${w * G.island.w}px`, height: `${G.island.h}px`, borderRadius: `${G.island.h / 2}px`, background: '#000' } });
    const root = h('div.nc-phone', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${w}px`, height: `${hh}px`, borderRadius: `${r}px`, background: '#050505',
      boxShadow: `inset 0 0 0 ${G.rim}px ${G.rimColour}, inset 0 0 0 ${G.rim + 1}px #2A2A2C`, transformOrigin: '50% 50%' } }, screen, island);
    const { t0, settled } = entrance(ctx);
    const spot = spotlights(S, beats, { w, h: hh }, root);
    const zoomAt = beats.find((b) => b.do === 'zoom')?.t;
    return {
      el: root, ticks: [...(zoomAt !== undefined ? [zoomAt] : []), ...spot.ticks], box,
      seek(t) {
        const e = riseIn(S, t, t0, settled, 160);
        // a 'zoom' beat pushes the camera through the phone into its screen (the composition handles it) [M24]
        setStyle(root, 'transform', e.dy > 0.05 ? `translateY(${e.dy.toFixed(2)}px)` : 'none');
        setStyle(root, 'opacity', String(e.o));
        v.seek(t, true);
        spot.seek(t);
      },
      settled: () => v.settled(),
    };
  },
};
