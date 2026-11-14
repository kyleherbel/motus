// Two pictures stacked, each under a small upper-case label: BEFORE over AFTER
// (research/graphics.md G24, G25; type.md T28; motion.md M03, M04). Full layout only: the pair is 1176 px tall.
//
// The first half (label and picture as one block) arrives with the scene. The second half arrives later
// through the same blur entrance while the first stays still: on the word a `reveal` beat names, or
// 29 frames after the first when the plan has no beat.
// Both pictures are the user's stills, one captured before the change and one after. They share one
// height; neither is cropped. A cut-out is shown as it is; an opaque picture becomes a plain capture card
// (the capture radius and the card shadow).
import { F, CX, layout, colour } from '../tokens.js';
import { place, enterAt, applyState } from '../common.js';
import { card } from '../card.js';
import { loadMedia } from '../media.js';
import { groundOf, labelNode, roomOf, P, LABEL_H } from './picture.js';

// TOKENS (research/type.md T28; graphics.md G24; measured on clip29@405, the one stacked pair)
// The reference pair is two cut-out device pictures with square corners. An opaque picture here takes the
// style's capture card instead [G05]: that choice is by eye.
const G = {
  pic: { maxW: 1000, h: 441 },   // the two pictures are 811 x 441 and 855 x 442: one height, inside the column [G04]
  pairGap: 76,                   // bottom of the first picture to the cap top of the second label: y 665 to 740. With the mean label gap (58) the picture ends on 664, so 76 puts the second label on 740
  up: 28,                        // the pair sits 28 px above the slot centre: cap top y 114, bottom y 1290
  lag: F(29),                    // second half first visible 29 frames after the first (clip29@318 and @347)
  labelMaxW: 700,                // by eye: a label stays well inside the column (the reference labels are 299 and 249 px wide)
};
const WORD = { type: 'string', optional: true, maxChars: 10, maxWords: 1 };

export default {
  type: 'before-after',
  label: 'Before / after',
  slots: ['graphic'],
  layouts: ['full'],
  ownEntrance: true,
  params: {
    before: 'asset',             // the upper picture: a still (png, jpg, webp)
    after: 'asset',              // the lower picture
    beforeLabel: WORD,           // default BEFORE
    afterLabel: WORD,            // default AFTER
  },
  beats: { reveal: {} },         // the second half arrives on this word

  async prepare(params, S) {
    const [a, b] = await Promise.all([loadMedia(S, params.before), loadMedia(S, params.after)]);
    return { pics: [a, b].map((m) => ({ m, ground: groundOf(m) })) };
  },

  build(ctx) {
    const { S, params: p, tIn, tOut, beats, data } = ctx; const { h } = S.kit;
    const labels = [p.beforeLabel || 'Before', p.afterLabel || 'After'];
    // one height for both pictures: the reference height, less when a wide picture or a section heading leaves less
    const fixed = 2 * LABEL_H + G.pairGap;
    let ph = Math.min(G.pic.h, (roomOf(ctx) - fixed) / 2);
    for (const { m } of data.pics) ph = Math.min(ph, G.pic.maxW * m.h / m.w);
    const total = fixed + 2 * ph;
    const sl = layout.slot[ctx.mode] || layout.slot.full;
    const at = place(ctx, G.pic.maxW, total);
    const top = Math.max(ctx.headed ? sl.headed.top : sl.top, at.y - G.up);

    const root = h('div.eb-before-after', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
    const halves = data.pics.map(({ m, ground }, k) => {
      const y0 = top + k * (LABEL_H + ph + G.pairGap);
      const w = ph * m.w / m.h;
      const part = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } }, labelNode(S, labels[k], y0, G.labelMaxW));
      const name = String(k ? p.after : p.before).split('/').pop();
      const x = CX - w / 2, y = y0 + LABEL_H;
      const size = { width: `${w.toFixed(2)}px`, height: `${ph.toFixed(2)}px`, display: 'block' };
      if (m.kind === 'image' && ground === 'cutout') part.append(h('img', { src: m.url, style: { position: 'absolute', left: `${x.toFixed(2)}px`, top: `${y.toFixed(2)}px`, ...size } }));
      else {
        // a clip or a missing file leaves an empty card and a warning
        const plate = card(S, { x, y, w, h: ph, kind: 'paper', fill: colour.card.fill });
        if (m.kind === 'image') plate.append(h('img', { src: m.url, style: { position: 'absolute', left: '0', top: '0', ...size } }));
        else if (m.kind === 'video') S.warn(`before-after: ${name} is a clip; the pair takes two stills`);
        part.append(plate);
      }
      if (m.kind === 'image' && w / m.w > P.softAbove) S.warn(`before-after: ${name} is enlarged ${(w / m.w).toFixed(1)} times and will look soft; supply a larger file`);
      root.append(part);
      return { part, origin: `${CX}px ${(y0 + (LABEL_H + ph) / 2).toFixed(1)}px` };
    });

    const beat = beats.find((b) => b.do === 'reveal');
    const t2 = Math.max(tIn, beat ? beat.t : tIn + G.lag);
    if (t2 > tOut - F(15)) S.warn('before-after: the second half arrives less than half a second before the scene ends; move the reveal beat earlier');
    return {
      el: root, box: { x: at.x, y: top, w: at.w, h: total },
      seek(t) {
        applyState(halves[0].part, enterAt(S, t - tIn), halves[0].origin);
        applyState(halves[1].part, enterAt(S, t - t2), halves[1].origin);
      },
    };
  },
};
