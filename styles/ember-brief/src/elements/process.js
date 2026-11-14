// A process: something goes into a tool and comes out changed, for "X goes in and comes out as Y" and
// "it turns X into Y" (research/explain.md X03, X09, X15; explain-motion.md D25).
//
// The reference acts a process out with bespoke drawings (a plate fed into a shredder, a tile that makes a
// new sound and drops it into a strip). This element is the device under them and none of the drawings:
// three parts on the centre axis, top to bottom as in both animated instances.
//   input    a short label on a plate, or the user's picture. It stands on the tool's slot
//   tool     an accent bar holding a cream tile with a line glyph or the user's mark, and a lamp
//   output   a short label on a plate, or the user's picture, optionally with a badge on its corner
// What happens, measured on the one instance that has all three (clip32@195-252):
//   run      on the verb: the input slides down into the slot and is gone, and the lamp blinks while the
//            tool works
//   out      on the result's word: the output slides out from under the tool. With no `out` beat it comes
//            out as the input goes in, 2 frames behind it, as the reference's does
//   badge    a badge lands on the output's corner. Default: when the output has come to rest
// Without an input the tool works alone and the output comes out of it (clip33@843-858 is that case).
// The accent is the tool, the subject of a process sentence [X28]. After the output rests nothing moves.
import { CX, fonts, colour, explain as X, F } from '../tokens.js';
import { place, setStyle, fitCap, sizeForCap, measureText, fontFor } from '../common.js';
import { loadMedia, placeIn } from '../media.js';
import { tileNode, badgeNode, popAt, GLYPH_NAMES, BADGE_KINDS } from '../marks.js';

// TOKENS (research/explain.md X03, X10, X18; explain-look.md R16, R21, R23). Geometry is measured on clip32@212
// (the settled machine with its plate) and timing on clip32@219-252, every frame; clip33@843-877 gives the
// case without an input.
const G = {
  bar: { w: 692, h: 154, radius: 22 },      // the machine's head: x 194..885, y 344..497, flat accent
  slot: { inset: 21, top: 13, h: 11 },      // the dark band the plate stands on: x 215..865, y 357..367
  plate: {
    maxW: 640,                              // x 220..859
    minW: 300,                              // by eye: a one-word label still reads as a plate
    h: 134,                                 // by eye: the measured plate is 167 px with a small icon over its text; text alone keeps the side padding above and below
    padX: 38,                               // text 258..821 in 220..859
    cap: 58,                                // cap top 269, baseline 327, heavy
    stroke: 4,                              // outline rows 189..193, cream; fill (39, 37, 33) = the raised card
    minCap: 40,                             // by eye
  },
  picture: { w: 640, h: 168 },              // a picture takes the plate's measured box
  tile: 104,                                // the round lens in the head is 102 px, centred 88 px under the head's top
  tileY: 88,
  lamp: { d: 34, lit: 28, fromRight: 73.5, y: 87.5 },   // x 795..828, y 415..448; lit: cream inside a dark ring
  gapOut: 47,                               // head to the output's top when the feed ends: its text starts 85 px under the head
  // the feed: plate top y 189, 193, 201, 213, 228, 245, 263, 282, 300, 318, 333, 346, 354 on frames 219-238 and
  // gone by 240. A sine in-out over 22 frames is within 3.6 px of every reading; the travel is the plate's height
  feed: F(22),
  lag: F(2),                                // the output shows under the head on frame 221, the feed starts on 219
  // the lamp is lit on frames 220-222, 227-229, 233-234 and 238-241: on and off every 3.3 frames from the
  // feed's second frame to its last
  blink: { every: F(20 / 3), lag: F(1) },
  badge: { d: 81, inset: 4 },               // by eye: the link's check disc [R21], its centre 4 px inside the output's top-right corner [X18]
};

const lin = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const sineInOut = (x) => 0.5 - 0.5 * Math.cos(Math.PI * lin(x));

const LABEL = { type: 'string', optional: true, maxChars: 14, maxWords: 3 };   // 12 characters fill the plate at the measured size; 14 are set a little smaller

export default {
  type: 'process',
  label: 'Process',
  slots: ['graphic'],
  layouts: ['split'],                       // every process enactment in the reference is in the split layout [X26]
  params: {
    input: LABEL,                           // what goes in, as said. Leave input and inputImage out when the tool makes something from nothing
    inputImage: 'asset?',                   // or the user's picture of it
    glyph: `enum?:${GLYPH_NAMES.join('|')}`,   // the tool: a line icon (default refresh)
    mark: 'asset?',                         // or the tool's own mark, supplied per video
    output: LABEL,                          // what comes out
    outputImage: 'asset?',
    badge: `enum?:${BADGE_KINDS.join('|')}`,   // lands on the output
  },
  beats: {
    run: {},                                // on the verb
    out: {},                                // on the result's word
    badge: {},                              // on the word that judges the result
  },

  async prepare(params, S) {
    const load = (src) => (src ? loadMedia(S, src) : null);
    const [input, mark, output] = await Promise.all([load(params.inputImage), load(params.mark), load(params.outputImage)]);
    return { input, mark, output };
  },

  build(ctx) {
    const { S, params: p, tIn, beats, data } = ctx; const { h } = S.kit;
    const P = G.plate;
    const pic = (m) => (m && m.kind === 'image' ? m : null);

    // ---- a part: a plate with a label, or a picture. Returns { el, w, h } with el at 0,0
    const part = (label, image) => {
      const img = pic(image);
      if (img) {
        const b = placeIn(G.picture.w, G.picture.h, img.w, img.h, 'contain');
        return { el: h('img', { src: img.url, style: { position: 'absolute', left: '0', top: '0', width: `${b.w.toFixed(2)}px`, height: `${b.h.toFixed(2)}px`, display: 'block' } }), w: b.w, h: b.h };
      }
      const text = String(label || '').trim();
      if (!text) return null;
      const cap = fitCap(text, P.cap, fonts.weight.heavy, P.maxW - 2 * P.padX, 0, P.minCap);
      const size = sizeForCap(cap, fonts.weight.heavy);
      const w = Math.min(P.maxW, Math.max(P.minW, measureText(text, fontFor(cap, fonts.weight.heavy)) + 2 * P.padX));
      const el = h('div', { text, style: { position: 'absolute', left: '0', top: '0', width: `${w.toFixed(2)}px`, height: `${P.h}px`, whiteSpace: 'nowrap', overflow: 'hidden', textAlign: 'center',
        font: `${fonts.weight.heavy} ${size.toFixed(2)}px/${P.h}px ${fonts.sans}`, color: colour.cream, background: colour.card.raised, boxShadow: `inset 0 0 0 ${P.stroke}px ${colour.cream}` } });
      return { el, w, h: P.h };
    };
    const input = part(p.input, data.input);
    const output = part(p.output, data.output);
    if (!output) S.warn('process: there is no output or outputImage, so nothing comes out of the tool');

    // ---- layout, top to bottom on the axis
    const inH = input ? input.h - G.slot.top : 0;                       // the input stands on the slot, in front of the bar's rim
    const outH = output ? G.gapOut + output.h : 0;
    const total = inH + G.bar.h + outH;
    const box = place(ctx, G.bar.w, total);
    const barX = CX - G.bar.w / 2, barY = box.y + inH, slotY = barY + G.slot.top, barBottom = barY + G.bar.h;

    const root = h('div.eb-process', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
    const centre = (pt) => { pt.el.style.left = `${((G.bar.w - pt.w) / 2).toFixed(2)}px`; };

    // the output comes out from behind the bar: its window starts at the bar's bottom edge
    let outMove = null;
    if (output) {
      centre(output);
      outMove = h('div', { style: { position: 'absolute', left: '0', top: `${G.gapOut}px`, width: '100%', height: `${output.h}px` } }, output.el);
      root.append(h('div', { style: { position: 'absolute', left: `${barX}px`, top: `${barBottom.toFixed(2)}px`, width: `${G.bar.w}px`, height: `${(outH + 4).toFixed(2)}px`, overflow: 'hidden' } }, outMove));
    }

    // the tool
    const bar = h('div', { style: { position: 'absolute', left: `${barX}px`, top: `${barY.toFixed(2)}px`, width: `${G.bar.w}px`, height: `${G.bar.h}px`, borderRadius: `${G.bar.radius}px`, background: colour.accent } });
    if (input) bar.append(h('div', { style: { position: 'absolute', left: `${G.slot.inset}px`, top: `${G.slot.top}px`, width: `${G.bar.w - 2 * G.slot.inset}px`, height: `${G.slot.h}px`, borderRadius: `${G.slot.h / 2}px`, background: colour.field } }));
    const mark = pic(data.mark);
    const tile = tileNode(S, { side: G.tile, fill: 'cream', image: mark, glyph: mark ? null : (p.glyph || 'refresh') });
    Object.assign(tile.style, { left: `${(G.bar.w - G.tile) / 2}px`, top: `${G.tileY - G.tile / 2}px` });
    const lampAt = (d) => ({ position: 'absolute', left: `${(G.bar.w - G.lamp.fromRight - d / 2).toFixed(2)}px`, top: `${(G.lamp.y - d / 2).toFixed(2)}px`, width: `${d}px`, height: `${d}px`, borderRadius: '50%' });
    const lamp = h('div', { style: { ...lampAt(G.lamp.lit), background: colour.cream, display: 'none' } });
    bar.append(tile, h('div', { style: { ...lampAt(G.lamp.d), background: colour.field } }), lamp);
    root.append(bar);

    // the input goes into the slot: its window ends in the middle of the dark band
    let inMove = null;
    if (input) {
      centre(input);
      inMove = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '100%', height: `${input.h}px` } }, input.el);
      root.append(h('div', { style: { position: 'absolute', left: `${barX}px`, top: `${box.y.toFixed(2)}px`, width: `${G.bar.w}px`, height: `${(input.h + G.slot.h / 2).toFixed(2)}px`, overflow: 'hidden' } }, inMove));
    }

    // the badge sits outside the output's window: it lands once the output is out
    let badge = null;
    if (output && p.badge) {
      // (in a holder: popAt hides by display, which would undo the badge's own centring)
      badge = h('div', { style: { position: 'absolute', left: `${(CX + output.w / 2 - G.badge.inset - G.badge.d / 2).toFixed(2)}px`, top: `${(barBottom + G.gapOut + G.badge.inset - G.badge.d / 2).toFixed(2)}px`, width: `${G.badge.d}px`, height: `${G.badge.d}px`, display: 'none' } },
        badgeNode(S, p.badge, G.badge.d));
      root.append(badge);
    }

    // ---- beats
    const first = (name) => { const b = beats.find((x_) => x_.do === name); return b ? b.t : undefined; };
    const tRun = first('run') ?? tIn + X.event.afterAnchor;
    const tOut = Math.max(first('out') ?? tRun + G.lag, tRun);
    const tDone = Math.max(tRun + (input ? G.feed : 0), output ? tOut + G.feed : 0);
    const tBadge = first('badge') ?? tOut + G.feed;

    return {
      el: root, box: { x: barX, y: box.y, w: G.bar.w, h: total },
      seek(t) {
        if (inMove) {
          const q = sineInOut((t - tRun) / G.feed);
          setStyle(inMove, 'transform', q <= 0 ? '' : `translateY(${((input.h + 2) * q).toFixed(2)}px)`);
          setStyle(inMove, 'display', q >= 1 ? 'none' : '');
        }
        if (outMove) {
          const a = t - tOut;
          const q = sineInOut(a / G.feed);
          setStyle(outMove, 'display', a <= 0 ? 'none' : '');
          setStyle(outMove, 'transform', q >= 1 ? '' : `translateY(${(-outH * (1 - q)).toFixed(2)}px)`);
        }
        const a = t - tRun - G.blink.lag;
        const lit = a >= 0 && t <= tDone && (a % G.blink.every) < G.blink.every / 2;
        setStyle(lamp, 'display', lit ? '' : 'none');
        if (badge) popAt(badge, t - tBadge);
      },
    };
  },
};
