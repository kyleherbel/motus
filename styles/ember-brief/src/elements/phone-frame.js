// An outline phone on the field with the user's picture or clip as its screen
// (research/graphics.md G23, low confidence: 3 units in 2 reels, two different drawings; colour.md C14-C16).
//
// The drawing is generic on purpose: one rounded outline in the muted cream, a dark body, the screen inset
// from the outline, and one pill near the top edge. No status bar, clock, buttons, camera or maker's details.
// Its size is fixed by the layout: 400 x 668 in the split layout and 706 x 1356 in the full layout, smaller
// under a section heading. The picture is cropped to cover the screen (about 1 : 1.72 in split, 1 : 2 in full),
// so supply a portrait screenshot or screen recording. A clip plays once from its first frame and holds its last.
import { CX, layout, colour } from '../tokens.js';
import { place } from '../common.js';
import { loadMedia, mediaView } from '../media.js';
import { roomOf } from './picture.js';

// TOKENS (research/graphics.md G23)
const G = {
  // clip32@400: outline x 150..550, y 196..864, outer radius 64.0, pill 116 x 32 starting 24 px under the top edge.
  // The screen inset is the full-layout inset in proportion (27 x 400 / 706); clip32 draws no separate screen.
  split: { w: 400, h: 668, radius: 64, inset: 15, pill: { w: 116, h: 32, top: 24 } },
  // clip37@740: outline x 187..893, y 51..1407, outer radius 109.25, screen 27 px inside it (radius 82),
  // pill 140 x 40 starting 45 px under the top edge
  full: { w: 706, h: 1356, radius: 109, inset: 27, pill: { w: 140, h: 40, top: 45 } },
  stroke: 6,     // clip32@400: 6.0 px on all four sides, #A29E93 = colour.muted. clip37 draws two 2 px lines 9 px apart instead; by eye the single outline is kept at 6 px in both sizes
  over: 16,      // the full-layout phone passes the slot by 9 px above and 7 px below (clip37@740)
};

export default {
  type: 'phone-frame',
  label: 'Phone',
  slots: ['graphic'],
  params: {
    src: 'asset',                // the screen: a portrait still (png, jpg, webp) or clip (mp4, mov, webm)
  },
  beats: {},

  async prepare(params, S) { return { m: await loadMedia(S, params.src) }; },

  build(ctx) {
    const { S, tIn, data, mode } = ctx; const { h } = S.kit;
    const D = mode === 'full' ? G.full : G.split;
    const sl = layout.slot[mode] || layout.slot.split;
    const room = roomOf(ctx);
    let box;
    if (D.h <= room) box = place(ctx, D.w, D.h);
    else if (!ctx.headed && D.h <= room + G.over) box = { x: CX - D.w / 2, y: sl.cy - D.h / 2, w: D.w, h: D.h };
    else box = place(ctx, D.w * room / D.h, room);
    const s = box.w / D.w;
    const inset = D.inset * s, r = D.radius * s;
    const sw = box.w - 2 * inset, sh = box.h - 2 * inset;

    if ((data.m.kind === 'image' || data.m.kind === 'video') && data.m.w > data.m.h) S.warn(`phone-frame: ${String(ctx.params.src).split('/').pop()} is wider than tall, so most of it is cropped by the portrait screen; use the picture element for it`);
    const view = mediaView(S, data.m, sw, sh, { fit: 'cover', t0: tIn });
    const screen = h('div', { style: { position: 'absolute', left: `${inset.toFixed(2)}px`, top: `${inset.toFixed(2)}px`, width: `${sw.toFixed(2)}px`, height: `${sh.toFixed(2)}px`,
      borderRadius: `${(r - inset).toFixed(2)}px`, overflow: 'hidden', background: colour.card.frame } }, view.el);
    const pill = h('div', { style: { position: 'absolute', left: `${((box.w - D.pill.w * s) / 2).toFixed(2)}px`, top: `${(D.pill.top * s).toFixed(2)}px`, width: `${(D.pill.w * s).toFixed(2)}px`, height: `${(D.pill.h * s).toFixed(2)}px`,
      borderRadius: `${(D.pill.h * s / 2).toFixed(2)}px`, background: colour.muted } });
    const root = h('div.eb-phone', { style: { position: 'absolute', left: `${box.x.toFixed(2)}px`, top: `${box.y.toFixed(2)}px`, width: `${box.w.toFixed(2)}px`, height: `${box.h.toFixed(2)}px`,
      borderRadius: `${r.toFixed(2)}px`, background: colour.card.frame, boxShadow: `inset 0 0 0 ${G.stroke}px ${colour.muted}, ${colour.shadow}` } }, screen, pill);

    return {
      el: root, box: { x: box.x, y: box.y, w: box.w, h: box.h },
      seek(t) { view.seek(t, true); },
      settled: () => view.settled(),
    };
  },
};
