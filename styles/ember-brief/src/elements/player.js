// "Watch", "listen", "here is what it made": a demo played on its own clock (research/explain.md X23;
// explain-motion.md D21; explain-look.md R27, R28, R29; measured on clip33@118-275, the player card with a
// clip strip, and clip30@87-566, the two-voice waveform player).
//
//   with `src`   a dark player card holding the user's own clip or still, with a control bar under the picture:
//                a play mark and a progress bar whose accent fill ends at the playhead. A clip shorter than the
//                scene loops, and the bar follows it (the reference clip loops every 60 frames). Anything else
//                makes one pass, from the frame the card has settled to 5 frames before the scene ends. The
//                speed is constant and the start and stop are hard [D21].
//                  clip   a small accent chip lands on a strip under the player, at the strip's playhead. The
//                         strip is there only when the plan has clip beats; it follows the card by 6 frames
//   no `src`     an audio demo: one or two waveform tracks, each a dark pill with an avatar disc. A playhead
//                crosses both in one pass. Bars sit on a fixed pitch, 3.9 px every 6.15 px, dim until the
//                playhead has passed them, then cream-white (first track) or accent (second) [R27].
//                THE BARS ARE NOT THE SOUND. The style never reads the audio: bar heights come from a fixed
//                seeded pattern, long bars where a voice has the turn and 3 px dots where it does not.
//                  speak  the named track has the turn from this word on (the first track has it before any beat).
//                         A ring round its avatar follows the height of the bar under the playhead
// Not drawn: the reference's speaker icon (no such glyph in marks.js), its product wordmark and marks, the
// transcript rows under the tracks, the accent bands where two voices overlap, and its demo media.
import { F, layout, motion, colour, explain } from '../tokens.js';
import { place, enterAt, applyState, setStyle, expoInOut } from '../common.js';
import { loadMedia, mediaView } from '../media.js';
import { glyph, GLYPH_NAMES } from '../marks.js';

// TOKENS (frame px; clip@frame per line)
const P = {
  card: {
    w: 880,                               // the fill, x 100..980; the reference's picture area is 880 x 495 (clip33@226). A user's clip keeps its own shape
    minW: 480, minH: 300,                 // by eye: the narrowest and the flattest card that still reads as a player
    bar: 64,                              // the control bar under the picture, y 670..734
    radius: 6,                            // by eye: the corners are all but square
    fill: '#1B1C1F', barFill: '#202124',  // clip33@226: #1F1C19, #23211E (release palette [C26])
    stroke: { w: 2, c: '#2D2E31' },       // outside the fill: #312F2C at the sides, #333330 on top, #2E2C2A below: #302E2B; release palette [C26]
    play: { x: 35, w: 15.5, h: 18.5 },    // a solid cream triangle, x 135..149, y 693..710
    // the track: 8 px tall with round ends, x 178..888, centred in the bar. The reference
    // ends it 92 px inside for a speaker icon; without one it runs on to the play mark's own margin (by eye)
    track: { x: 78, right: 35, h: 8, off: '#4E4F52' },   // #514F4B measured; release palette [C26]
  },
  strip: {
    gap: 16,                              // card fill to strip, y 734 to 750
    h: 104, bleed: 2,                     // x 98..982: 2 px wider than the card's fill on each side
    radius: 22, fill: '#1B1C1F',
    tick: { n: 24, w: 2, top: 2, h: 12, c: '#555659' },   // every 36.67 px, the left edge on the division (clip33@226: #585652; release palette [C26])
    // the playhead: a 4 px cream line, y 754..845, under a cap of 18 x 12 px
    head: { w: 4, top: 4, h: 92, capW: 18, capH: 12, capR: 3, c: '#EBECEF' },   // #EEECE8 measured; release palette [C26]
    // a clip chip: 84 x 60, corner fit 11.5, accent with a soft accent glow under it, centred 57.5 px under the
    // strip's top. Inside, a small waveform in cream at 0.65: a seeded pattern, by eye
    chip: { w: 84, h: 60, radius: 11.5, cy: 57.5, glow: '0 4px 12px rgba(255,58,176,0.30)', wave: 'rgba(237,238,241,0.65)' },   // the accent and the chalk [C26]
    // it starts as a blur at the playhead's cap, 45 px up, and is sharp in its place 6 frames later (clip33@192-198):
    // expo.inOut over 8 frames. Its centre is where the playhead is a frame after the beat. Scale and blur: by eye
    land: { dur: F(8), rise: 45, from: 0.7, blur: 12, fade: F(2), lead: F(1) },
    lag: explain.event.follow,            // the strip follows the card by 6 frames [X10]; the reference brings it on a later clause
  },
  // one pass: the playhead starts when the entrance has settled and stops 5 frames before the exit (clip30@107, @562 against 97 and 567)
  pass: { start: motion.enter.dur, end: F(5) },
  wave: {
    w: 964, h: 234, gap: 94,              // two pills x 58..1022, y 554..788 and 882..1116 (clip30@442); the ends are half circles
    fill: '#1B1C1F',                      // #1F1C19 measured; release palette [C26]
    edge: 'inset 2px 0 0 rgba(255,255,255,0.12), inset -2px 0 0 rgba(255,255,255,0.14)',   // a light edge at the two ends only: 2 px, luma 41 to 72 on 28 (clip30@442); the alpha is by eye
    disc: { d: 140, cx: 111.5, fill: '#454649', glyph: 0.5, stroke: 0.05 },   // the avatar: 140 px, centre 111.5 px in [R24]; #49463D measured, release palette [C26]
    // the ring round the speaking avatar: 6 px wide, radius 76.5 to 92, dim to bright with the voice (clip30@108-130).
    // Driven here by the bar under the playhead: by eye
    ring: { w: 6, r: [76.5, 92], a: [0.2, 1] },
    x0: 189.6, n: 120, pitch: 6.15, bar: 3.9,           // 120 slots from x 247.6 [R27]
    travel: 739.75,                       // the playhead runs x 247.6 to 987.35 [D21]
    high: [34, 164], dot: 3,              // a voiced bar is 34 to 164 px tall; silence is a 3 px dot
    lit: [colour.captionWhite, colour.accent], off: '#555659',   // #585652 measured; release palette [C26]
    head: { w: 3, dot: 17, above: 6.5, below: 3, c: colour.captionWhite },   // line x 792..795, y 547..1113, a 17 px dot on top
  },
};

const lin = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** A box on whole pixels, so that strokes and edges stay sharp (an odd height centres on a half pixel). */
const snap = (b) => (b.s === 1 ? { ...b, x: Math.round(b.x), y: Math.round(b.y) } : b);

/**
 * The fixed pattern of one track: n bar heights (px), long where the track has the turn and P.wave.dot where it
 * does not. Voiced stretches are phrases of 8 to 24 bars that swell and taper, 3 to 9 dots apart. Nothing here
 * is read from the audio.
 */
function pattern(kit, seed, n, hasTurn) {
  const rnd = kit.seeded(seed);
  const W = P.wave, out = new Array(n).fill(W.dot);
  let i = Math.floor(rnd() * 3);
  while (i < n) {
    const len = 8 + Math.floor(rnd() * 17), gap = 3 + Math.floor(rnd() * 7);
    const loud = 0.6 + 0.4 * rnd();
    for (let j = 0; j < len && i + j < n; j++) {
      const taper = Math.min(1, (j + 1) / 3, (len - j) / 4);
      const v = taper * loud * (0.45 + 0.55 * rnd());
      if (hasTurn(i + j)) out[i + j] = Math.round(W.high[0] + (W.high[1] - W.high[0]) * v);
    }
    i += len + gap;
  }
  return out;
}

const TRACK = {
  image: 'asset?',                                               // the voice's own picture or mark, in the avatar disc
  glyph: `enum?:${GLYPH_NAMES.join('|')}`,                       // or a line glyph (default person)
};

export default {
  type: 'player',
  label: 'Demo player',
  slots: ['graphic'],
  params: {
    src: 'asset?',                                               // the user's clip (mp4, mov, webm) or still. Left out: an audio demo, drawn as waveform tracks
    tracks: { type: 'array', optional: true, min: 1, max: 2, of: TRACK },   // audio demo: one track per voice (default one)
  },
  beats: {
    clip: {},                                                    // with src: a clip chip lands on the strip, at the playhead
    speak: { track: { type: 'number', min: 1, max: 2 } },        // audio demo: this track has the turn from here
  },

  async prepare(params, S) {
    const m = params.src ? await loadMedia(S, params.src) : null;
    const avatars = await Promise.all((params.tracks || []).map((tr) => (tr && tr.image ? loadMedia(S, tr.image) : null)));
    return { m, avatars };
  },

  build(ctx) {
    const { S, params: p, tIn, tOut, beats, data, mode } = ctx; const { kit } = S; const { h } = kit;
    const clips = beats.filter((b) => b.do === 'clip'), speaks = beats.filter((b) => b.do === 'speak');
    // one pass over the scene; the last graphic of a video holds, so its pass ends with the video
    const t0 = tIn + P.pass.start, t1 = Math.max(t0 + F(10), tOut - P.pass.end);
    const pass = (t) => lin((t - t0) / (t1 - t0));

    // ------------------------------------------------------------------ the player card
    if (data.m) {
      const m = data.m, C = P.card, Sx = P.strip;
      if (speaks.length) S.warn('player: speak beats belong to an audio demo (no src); they were ignored');
      const strip = clips.length > 0;
      const sl = layout.slot[mode] || layout.slot.split;
      const room = sl.bottom - (ctx.headed ? sl.headed.top : sl.top);
      const below = C.bar + (strip ? Sx.gap + Sx.h : 0);
      // the picture area keeps the clip's own shape: 880 px wide, or as tall as the slot allows
      let aw = C.w, ah = (C.w * m.h) / m.w;
      const maxH = room - below - 2 * C.stroke.w;
      if (ah > maxH) { ah = maxH; aw = Math.max(C.minW, (maxH * m.w) / m.h); }
      if (ah < C.minH) ah = C.minH;
      const total = ah + below;
      const box = snap(place(ctx, aw, total));
      const root = h('div.eb-player', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${aw}px`, height: `${total}px`, transformOrigin: '0 0', transform: box.s === 1 ? '' : `scale(${box.s})` } });
      const plate = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${aw}px`, height: `${ah + C.bar}px`, borderRadius: `${C.radius}px`, background: C.fill, overflow: 'hidden' } });
      const frame = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${aw}px`, height: `${ah + C.bar}px`, borderRadius: `${C.radius}px`, boxShadow: `0 0 0 ${C.stroke.w}px ${C.stroke.c}, ${colour.shadow}` } });
      const view = mediaView(S, m, aw, ah, { fit: 'cover', t0: tIn, loop: true });
      const screen = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${aw}px`, height: `${ah}px`, overflow: 'hidden' } }, view.el);
      const bar = h('div', { style: { position: 'absolute', left: '0', top: `${ah}px`, width: `${aw}px`, height: `${C.bar}px`, background: C.barFill } });
      // the play mark: a solid triangle [clip33@226]
      const tri = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      tri.setAttribute('width', String(C.play.w)); tri.setAttribute('height', String(C.play.h)); tri.setAttribute('viewBox', `0 0 ${C.play.w} ${C.play.h}`);
      Object.assign(tri.style, { position: 'absolute', left: `${C.play.x}px`, top: `${(C.bar - C.play.h) / 2}px`, display: 'block' });
      const triPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      triPath.setAttribute('d', `M0 0L${C.play.w} ${C.play.h / 2}L0 ${C.play.h}z`); triPath.setAttribute('fill', colour.cream);
      tri.append(triPath);
      const trackW = aw - C.track.x - C.track.right;
      const track = h('div', { style: { position: 'absolute', left: `${C.track.x}px`, top: `${(C.bar - C.track.h) / 2}px`, width: `${trackW}px`, height: `${C.track.h}px`, borderRadius: `${C.track.h / 2}px`, background: C.track.off, overflow: 'hidden' } });
      const fill = h('div', { style: { position: 'absolute', left: `${-trackW}px`, top: '0', width: `${trackW}px`, height: `${C.track.h}px`, borderRadius: `${C.track.h / 2}px`, background: colour.accent } });
      track.append(fill); bar.append(tri, track); plate.append(screen, bar); root.append(frame, plate);

      // where the playhead is: a clip shorter than the scene loops and the bar follows it; otherwise one pass
      const loops = m.kind === 'video' && m.duration > 0.2 && m.duration < tOut - tIn - F(10);
      const at = (t) => (loops ? ((Math.max(0, t - tIn)) % m.duration) / m.duration : pass(t));

      // the strip with its ruler, its playhead and the chips the beats leave on it
      let stripEl = null, head = null, chips = [];
      const sw = aw + 2 * Sx.bleed;
      if (strip) {
        const sy = ah + C.bar + Sx.gap;
        stripEl = h('div', { style: { position: 'absolute', left: `${-Sx.bleed}px`, top: `${sy}px`, width: `${sw}px`, height: `${Sx.h}px`, borderRadius: `${Sx.radius}px`, background: Sx.fill, boxShadow: colour.shadow, transformOrigin: '50% 50%' } });
        for (let i = 1; i < Sx.tick.n; i++) stripEl.append(h('div', { style: { position: 'absolute', left: `${(Sx.bleed + (aw * i) / Sx.tick.n).toFixed(2)}px`, top: `${Sx.tick.top}px`, width: `${Sx.tick.w}px`, height: `${Sx.tick.h}px`, background: Sx.tick.c } }));
        const K = Sx.chip, rnd = kit.seeded(4099);
        chips = clips.map((b) => {
          const cx = Math.min(sw - K.w / 2 - 8, Math.max(K.w / 2 + 8, Sx.bleed + aw * at(b.t + Sx.land.lead)));
          const el = h('div', { style: { position: 'absolute', left: `${(cx - K.w / 2).toFixed(2)}px`, top: `${K.cy - K.h / 2}px`, width: `${K.w}px`, height: `${K.h}px`, borderRadius: `${K.radius}px`, background: colour.accent, boxShadow: K.glow, overflow: 'hidden', display: 'none' } });
          // a burst that decays: 13 bars of 2.5 px on a 4.6 px pitch
          const peak = 2 + Math.floor(rnd() * 4);
          for (let i = 0; i < 13; i++) {
            const bh = Math.max(2, Math.round(36 * Math.exp(-Math.abs(i - peak) / (2.2 + rnd() * 1.6)) * (0.6 + 0.4 * rnd())));
            el.append(h('div', { style: { position: 'absolute', left: `${(12.5 + i * 4.6).toFixed(1)}px`, top: `${(K.h - bh) / 2}px`, width: '2.5px', height: `${bh}px`, borderRadius: '1.25px', background: K.wave } }));
          }
          stripEl.append(el);
          return { el, t: b.t };
        });
        head = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0' } },
          h('div', { style: { position: 'absolute', left: `${-Sx.head.w / 2}px`, top: `${Sx.head.top}px`, width: `${Sx.head.w}px`, height: `${Sx.head.h}px`, borderRadius: `${Sx.head.w / 2}px`, background: Sx.head.c } }),
          h('div', { style: { position: 'absolute', left: `${-Sx.head.capW / 2}px`, top: `${Sx.head.top}px`, width: `${Sx.head.capW}px`, height: `${Sx.head.capH}px`, borderRadius: `${Sx.head.capR}px`, background: Sx.head.c } }));
        stripEl.append(head);
        root.append(stripEl);
      }

      return {
        el: root, box: { x: box.x, y: box.y, w: box.w, h: box.h },
        seek(t) {
          view.seek(t, true);
          const q = at(t);
          setStyle(fill, 'transform', `translateX(${(trackW * q).toFixed(2)}px)`);
          if (!stripEl) return;
          const a = t - tIn - Sx.lag;
          setStyle(stripEl, 'display', a < 0 ? 'none' : '');
          if (a < 0) return;
          applyState(stripEl, enterAt(S, a, motion.enter.presets.chip));
          setStyle(head, 'transform', `translateX(${(Sx.bleed + aw * q).toFixed(2)}px)`);
          for (const c of chips) {
            const b = t - c.t, Ld = Sx.land;
            setStyle(c.el, 'display', b < 0 ? 'none' : '');
            if (b < 0) continue;
            const u = lin(b / Ld.dur), e = expoInOut(u);
            setStyle(c.el, 'opacity', b >= Ld.fade ? '' : (b / Ld.fade).toFixed(3));
            setStyle(c.el, 'transform', u >= 1 ? '' : `translateY(${(-Ld.rise * (1 - e)).toFixed(2)}px) scale(${(Ld.from + (1 - Ld.from) * e).toFixed(4)})`);
            const blur = u < 1 ? Ld.blur * (1 - e) : 0;
            setStyle(c.el, 'filter', blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : '');
          }
        },
        settled: () => view.settled(),
      };
    }

    // ------------------------------------------------------------------ the audio demo: waveform tracks
    const W = P.wave;
    if (clips.length) S.warn('player: clip beats need a src; the audio demo has no strip');
    const tracks = (p.tracks && p.tracks.length ? p.tracks : [{}]).slice(0, 2);
    const nT = tracks.length;
    const total = nT * W.h + (nT - 1) * W.gap;
    const box = snap(place(ctx, W.w, total));
    const root = h('div.eb-player-wave', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${W.w}px`, height: `${total}px`, transformOrigin: '0 0', transform: box.s === 1 ? '' : `scale(${box.s})` } });
    // who has the turn at a time: the track of the latest speak beat; the first track before any
    const turns = speaks.filter((b) => Number.isInteger(b.track) && b.track >= 1 && b.track <= nT).map((b) => ({ t: b.t, k: b.track - 1 }));
    if (speaks.length !== turns.length) S.warn(`player: a speak beat names a track the demo does not have (${nT})`);
    if (nT > 1 && !turns.length) S.warn('player: two tracks and no speak beats: both are drawn as speaking all the way. Give a speak beat for each turn');
    const turnAt = (t) => { let k = 0; for (const b of turns) if (b.t <= t) k = b.k; return k; };
    const slotTime = (i) => t0 + ((i + 0.5) / W.n) * (t1 - t0);
    const rows = tracks.map((tr, k) => {
      const y = k * (W.h + W.gap);
      const pill = h('div', { style: { position: 'absolute', left: '0', top: `${y}px`, width: `${W.w}px`, height: `${W.h}px`, borderRadius: `${W.h / 2}px`, background: W.fill, boxShadow: `${W.edge}, ${colour.shadow}` } });
      // the avatar: the user's picture, or a line glyph on a disc
      const D = W.disc, av = data.avatars[k];
      const disc = h('div', { style: { position: 'absolute', left: `${D.cx - D.d / 2}px`, top: `${(W.h - D.d) / 2}px`, width: `${D.d}px`, height: `${D.d}px`, borderRadius: '50%', overflow: 'hidden', background: k === 0 ? D.fill : colour.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' } });
      if (av && av.kind === 'image') disc.append(h('img', { src: av.url, style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }));
      else disc.append(glyph(tr.glyph || 'person', D.d * D.glyph, D.d * D.stroke, k === 0 ? colour.cream : '#191A1D'));
      const ring = h('div', { style: { position: 'absolute', left: `${D.cx}px`, top: `${W.h / 2}px`, width: '0', height: '0', display: 'none' } },
        h('div', { style: { position: 'absolute', left: `${-W.ring.r[1]}px`, top: `${-W.ring.r[1]}px`, width: `${2 * W.ring.r[1]}px`, height: `${2 * W.ring.r[1]}px`, borderRadius: '50%', boxShadow: `inset 0 0 0 ${W.ring.w}px ${W.lit[k]}` } }));
      pill.append(ring, disc);
      // the bars: dim ones under lit copies that a clip reveals up to the playhead
      const heights = pattern(kit, 7001 + k * 613, W.n, (i) => nT === 1 || !turns.length || turnAt(slotTime(i)) === k);
      const mk = (c) => {
        const layer = h('div', { style: { position: 'absolute', left: `${W.x0}px`, top: '0', width: `${W.n * W.pitch}px`, height: `${W.h}px` } });
        heights.forEach((bh, i) => {
          const dot = bh <= W.dot, bw = dot ? W.dot : W.bar;
          layer.append(h('div', { style: { position: 'absolute', left: `${((i + 0.5) * W.pitch - bw / 2).toFixed(2)}px`, top: `${((W.h - bh) / 2).toFixed(2)}px`, width: `${bw}px`, height: `${bh}px`, borderRadius: `${bw / 2}px`, background: c } }));
        });
        return layer;
      };
      const lit = mk(W.lit[k]);
      pill.append(mk(W.off), lit);
      root.append(pill);
      return { ring, lit, heights, k };
    });
    // the playhead: one line across every track with a dot on top
    const Hd = W.head;
    const head = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0' } },
      h('div', { style: { position: 'absolute', left: `${-Hd.w / 2}px`, top: `${-Hd.above}px`, width: `${Hd.w}px`, height: `${total + Hd.above - Hd.below}px`, background: Hd.c } }),
      h('div', { style: { position: 'absolute', left: `${-Hd.dot / 2}px`, top: `${2 - Hd.dot / 2}px`, width: `${Hd.dot}px`, height: `${Hd.dot}px`, borderRadius: '50%', background: Hd.c } }));
    root.append(head);
    const zone = W.n * W.pitch;

    return {
      el: root, box: { x: box.x, y: box.y, w: box.w, h: box.h },
      seek(t) {
        const q = pass(t), x = W.travel * q;
        setStyle(head, 'transform', `translateX(${(W.x0 + x).toFixed(2)}px)`);
        const slot = Math.min(W.n - 1, Math.floor(q * W.n));
        const who = nT === 1 || !turns.length ? -1 : turnAt(t);
        for (const r of rows) {
          setStyle(r.lit, 'clipPath', `inset(0 ${(zone - x).toFixed(2)}px 0 0)`);
          // the ring of whoever speaks follows the bar under the playhead
          const bh = r.heights[slot];
          const on = t >= t0 && t < t1 && bh > W.dot && (who === -1 || who === r.k);
          setStyle(r.ring, 'display', on ? '' : 'none');
          if (on) {
            const v = lin((bh - W.high[0]) / (W.high[1] - W.high[0]));
            setStyle(r.ring, 'opacity', (W.ring.a[0] + (W.ring.a[1] - W.ring.a[0]) * v).toFixed(3));
            setStyle(r.ring, 'transform', `scale(${((W.ring.r[0] + (W.ring.r[1] - W.ring.r[0]) * v) / W.ring.r[1]).toFixed(4)})`);
          }
        }
      },
    };
  },
};
