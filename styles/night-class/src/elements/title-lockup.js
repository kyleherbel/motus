// The title at the top of the graphic field (research/type.md T14-T22, hook.md H04-H17).
// One or two centred lines in the heavy sans with the concept word(s) in the italic serif; a cobalt bar
// behind one line (36 %), a cobalt underline under it (28 %) or nothing (36 %) [T17]. Opening titles and
// section titles use the same lockup and the same build: a unit every 2 frames from frame 2, line 2
// about 9 frames in, the bar wiping in from the left, all settled by about 0.9 s [H04-H14]. A title
// kept across a full-height cut-in comes back complete; a new one builds about 4 frames after the
// cut [M09]. It leaves on a cut [H15]. kind 'header' is the one-line section header: a little smaller,
// lower, no decoration [T22].
import { F, type, layout, motion } from '../tokens.js';
import { buildLockup } from '../lockup.js';

export default {
  type: 'title-lockup',
  label: 'Title',
  slots: ['title'],
  params: {
    line1: { type: 'string', maxChars: 34, maxWords: 7 },          // "How To Write *Hooks*": asterisks mark serif words
    line2: { type: 'string', optional: true, maxChars: 34, maxWords: 7 },
    deco: 'enum?:bar|underline|none',                                 // default bar
    decoLine: 'enum?:1|2',                                            // default the last line
    build: 'enum?:word|type|none',                                    // default word (21/32); type = letters (5/32)
    kind: 'enum?:title|header',
  },
  beats: {},

  build(ctx) {
    const { S, params: p, mode, tIn, modeCut, returning } = ctx;
    const header = p.kind === 'header';
    const lines = header ? [p.line1] : [p.line1, p.line2].filter(Boolean);
    const deco = header ? 'none' : p.deco || 'bar';
    const decoLine = p.decoLine ? Number(p.decoLine) - 1 : lines.length - 1;
    // the first title builds from frame 2; a new title after a cut starts about 4 frames in [H04, M09]
    const start = tIn + (tIn > 0.01 && modeCut ? motion.title.afterCut : motion.title.start);
    const lk = buildLockup(S, {
      lines, size: header ? type.header.size : type.title.size,
      capTop: header ? layout.title.headerCapTop : layout.title.capTop,
      deco, decoLine, bar: type.bar, build: p.build || 'word', start,
    }, mode);
    const settled = returning;
    return {
      el: lk.el,
      ticks: [],
      seek(t) { lk.seek(t, settled); },
    };
  },
};
