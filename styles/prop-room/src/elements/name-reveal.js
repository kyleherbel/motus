// The name of a product or tool, revealed in three beats (research/explain.md X17, X13 name_reveal; interfaces X72,
// X75; graphics.md G14). The mark turns up, a ring pulses out from it, then the name line follows and a shine
// crosses the mark. Measured on clip13@128-150 (flip), clip06@227-250 (focus pull), clip11@131-159 (type-on):
//   flip    a "?" disc is on screen on the cut; it turns edge-on and back in 5 frames (scaleX 1 -> 0 -> 1, the face
//           swaps at the middle) and comes round as the mark (clip13@130-135) [X17]
//   focus   the mark and its name are on screen out of focus and pull sharp over 8 frames (clip06@228-236) [X17]
//   type    the mark grows in, then the name types on at 2 frames a letter (clip11@137-155) [X17, X62]
// The ring leaves the mark at 1.12x its radius and grows near-linearly to 1.5x over 9 frames, fading (clip13@134-143:
// 288 -> 401 px round a 257 px mark); the name rises in 4 frames after the ring starts, the shine sweeps 7 frames
// after the name (clip13@138, @145) [X17]. The name is legible about 9 frames after it is spoken [X17].
// The mark is drawn here: a monogram on a white disc in the subject's colour, or a picture the plan supplies.
// Never a third party's logo [brief].
import { CX, F, colour, fonts, motion } from '../tokens.js';
import { place, setStyle, clamp01, sansFont, partAt, applyPart, measureText, snapper } from '../common.js';
import { plateIsDark } from '../plate.js';

// TOKENS (research/explain.md X17; interfaces X62, X72, X75)
const R = 257.5;              // mark radius, border included (clip13@141: border rows 180-205 and 669-695) [X17]
const BORDER = 25;            // the mark's coloured rim (clip13@141 x 284-309) [X17]
const RING_FROM = 1.12;       // ring radius / mark radius on its first frame (clip13@134: 288 / 257) [X17]
const RING_W = 7;             // ring stroke (clip13@141 x 152-158) [X17]
const NAME_CAP = 85;          // name cap height (clip13@147: cap top 792, baseline about 877) [X17]
const NAME_BASE = 1.71;       // name baseline below the mark centre, in mark radii (877 - 437.5 = 440 px) [X17]
const SUB_SIZE = 46;          // a secondary line under the name (by eye; T25 headings 34-59 px); it rises 14 px (by eye; X75 8-22)
const FLIP = F(6);            // edge-on flip: full width again 6 frames on (clip13@130-136, held on twos) [X17: 5]
const FLIP_EXP = 0.8;         // turn angle = 180 x^0.8: fast into edge-on, the face swaps at 2.5 frames (clip13@131 0.8, @132 0.05, @134 0.7 wide) [X17]
const FOCUS = F(8);           // focus pull [X17 focus_pull_frames]
const BLUR = 22;              // px of blur before the pull (by eye, clip06@228)
const TYPE_PER_CHAR = F(2);   // type-on, 1.1-2.2 frames a letter (clip11 2.0) [X17]
const RING_AT = F(4);         // after the mark starts to turn up (clip13: flip 130, ring 134) [X17]
const NAME_AT = F(8);         // (clip13: name 138) [X17]
const SHINE_AT = F(15);       // (clip13: shine 145-150) [X17]
const SHINE_DUR = F(10);      // [X17 shine_sweep_frames]
const NAME_RISE = 0.5;        // the name rises from behind its own baseline, half its cap height (clip13@138: lower half still hidden) [X17, X75]
const BEFORE_WORD = F(1);     // the reveal starts a frame before the name is spoken, so it is legible about 9 frames after [X17]
const AFTER_CUT = F(2);       // with no word: the anchor is alone about 2 frames [X04]
const MARK = '#357CEF';       // default rim colour: the first accent that is not a third-party brand colour [colour.md accents]
const PLACEHOLDER = { rim: '#D5D7DF', glyph: '#ADB0BE' };   // the "?" disc (clip13@128) [X17]

const hexOk = (c) => /^#[0-9a-f]{6}$/i.test(c || '');

/** Event starts land on the frame grid, so a fast ease starts from its first value on a whole frame (a 6-frame land
 *  started half a frame late would show 1.09x instead of 1.25x on its first frame); seek adds 0.1 ms so an event
 *  that starts on a frame counts as started there despite float error. A shared helper would do. */
const initials = (name) => { const w = String(name).trim().split(/\s+/); return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 1)).toUpperCase(); };

export default {
  type: 'name-reveal',
  label: 'Name reveal',
  slots: ['graphic'],
  params: {
    name: { type: 'string', maxChars: 12, maxWords: 2 },
    how: 'enum?:flip|focus|type',
    word: { type: 'word', optional: true },                                     // the spoken name [X17]
    mark: { type: 'string', optional: true, maxChars: 2 },                      // monogram letters (default: initials)
    asset: 'asset?',                                                            // or a picture for the mark
    sub: { type: 'string', optional: true, maxChars: 26, maxWords: 5 },        // a secondary line [X17 secondary_line]
    color: { type: 'string', optional: true, maxChars: 7 },
  },
  beats: {},
  async prepare(params, S) {
    if (!params.asset) return null;
    const url = S.env.projectUrl(params.asset);
    try { const img = new Image(); img.src = url; await img.decode(); return { url }; }
    catch { S.warn(`name-reveal: could not load ${params.asset}`); return null; }
  },
  build(ctx) {
    const { S, params, data } = ctx;
    const { h } = S.kit;
    const snap = snapper(S), tIn = snap(ctx.tIn);
    const how = params.how || 'flip';
    const dark = plateIsDark(params.plate, params.field);
    const ink = dark ? colour.white : colour.ink;
    const rim = hexOk(params.color) ? params.color : MARK;
    const cap = fonts.M.cap;
    const nSize = NAME_CAP / cap;
    const nFont = sansFont(nSize, fonts.weight.display);

    // ---- layout: the mark, the name under it, the sub line; the ring's reach sets the width
    const nameW = measureText(params.name, nFont, -0.02 * nSize);
    const W0 = Math.max(2 * R * motion.ring.to, nameW);
    let H0 = R + R * NAME_BASE + nSize * 0.24;
    if (params.sub) H0 += SUB_SIZE * 1.5;
    const box = place(ctx, W0, H0);   // the block starts at the mark's top edge
    const s = box.s;
    const top = box.y;
    const root = h('div', { style: { position: 'absolute', left: `${CX}px`, top: `${top}px`, width: '0', height: '0', transform: s < 0.999 ? `scale(${s})` : '', transformOrigin: '0 0' } });
    const el = h('div.pr-name-reveal', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, root);
    const cy = R;   // mark centre, root-local (x 0)

    // ---- the mark: a white disc with a coloured rim and a monogram or a picture
    const disc = (rimCol, child) => h('div', { style: { position: 'absolute', left: `${-R}px`, top: `${cy - R}px`, width: `${2 * R}px`, height: `${2 * R}px`, borderRadius: '50%',
      boxSizing: 'border-box', border: `${BORDER}px solid ${rimCol}`, background: colour.white, overflow: 'hidden', boxShadow: colour.shadow.card } }, child);
    const glyph = (text, col, capPx) => h('div', { text, style: { position: 'absolute', left: '50%', top: `${(R - BORDER - capPx / 2 - (capPx / cap) * (fonts.M.base - cap)).toFixed(1)}px`, transform: 'translateX(-50%)',
      font: sansFont(capPx / cap, fonts.weight.display), letterSpacing: `${(-0.03 * capPx / cap).toFixed(2)}px`, color: col, whiteSpace: 'nowrap' } });
    const face = data
      ? h('div', { style: { position: 'absolute', inset: '0', background: `url("${data.url}") center / cover no-repeat` } })
      : glyph(params.mark || initials(params.name), rim, (params.mark || initials(params.name)).length > 1 ? 150 : 190);
    const mark = disc(rim, face);
    const shine = h('div', { style: { position: 'absolute', inset: '0', background: 'linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 60%)',
      backgroundSize: '300% 100%', backgroundRepeat: 'no-repeat', visibility: 'hidden' } });
    mark.append(shine);
    const holder = how === 'flip' ? disc(PLACEHOLDER.rim, glyph('?', PLACEHOLDER.glyph, 170)) : null;
    const ring = h('div', { style: { position: 'absolute', borderRadius: '50%', boxSizing: 'border-box', border: `${RING_W}px solid ${rim}`, visibility: 'hidden' } });
    const turn = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0', transformOrigin: `0px ${cy}px` } }, ...(holder ? [holder] : []), mark);
    root.append(ring, turn);

    // ---- the name and the sub line
    const nameBase = cy + R * NAME_BASE;
    const name = h('div', { style: { position: 'absolute', left: '0', top: `${(nameBase - nSize * fonts.M.base).toFixed(1)}px`, transform: 'translateX(-50%)', whiteSpace: 'pre',
      font: nFont, letterSpacing: `${(-0.02 * nSize).toFixed(2)}px`, color: ink } });
    // the name rises from behind a line just under its descenders (a mask), not over the plate
    const clipTop = nameBase - nSize * 1.05, clipH = nSize * 1.3;
    name.style.top = `${(nameBase - nSize * fonts.M.base - clipTop).toFixed(1)}px`;
    const nameIn = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0' } }, name);
    const nameWrap = h('div', { style: { position: 'absolute', left: `${-W0 / 2}px`, top: `${clipTop.toFixed(1)}px`, width: `${W0}px`, height: `${clipH.toFixed(1)}px`, overflow: how === 'flip' ? 'hidden' : 'visible' } }, nameIn);
    nameIn.style.left = `${W0 / 2}px`;
    root.append(nameWrap);
    // a typed name grows from the left edge of the full name, so the letters do not slide as the line grows
    if (how === 'type') Object.assign(name.style, { left: `${(-nameW / 2).toFixed(1)}px`, transform: 'none' });
    let sub = null;
    if (params.sub) {
      sub = h('div', { text: params.sub, style: { position: 'absolute', left: '0', top: `${(nameBase + SUB_SIZE * 1.45 - SUB_SIZE * fonts.M.base).toFixed(1)}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
        font: sansFont(SUB_SIZE, fonts.weight.body), color: dark ? 'rgba(255,255,255,0.72)' : colour.inkSoft } });
      const sw = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0' } }, sub);
      root.append(sw); sub = sw;
    }

    // ---- timeline
    const t0 = params.word != null ? Math.max(tIn, snap(S.wordTime(params.word) - BEFORE_WORD)) : snap(tIn + AFTER_CUT);
    // flip and focus: the placeholder or the blurred mark is the anchor on the cut and resolves on the name; type: the
    // mark itself is the anchor (it grows in on the cut, clip11@132-134) and the name types on from the word [X04, X17]
    const mStart = how === 'type' ? tIn : t0;                      // the mark turns up
    const mDone = how === 'flip' ? t0 + FLIP : how === 'focus' ? t0 + FOCUS : mStart + F(4);
    const tRing = how === 'flip' ? t0 + RING_AT : mDone;
    const tName = how === 'flip' ? t0 + NAME_AT : how === 'focus' ? t0 : Math.max(mStart + F(5), t0);   // typing 5 frames after the mark at the earliest (clip11@132 -> 137)
    const typeEnd = tName + params.name.length * TYPE_PER_CHAR;
    const tShine = (how === 'type' ? typeEnd : tName) + SHINE_AT - NAME_AT;
    const tSub = (how === 'type' ? typeEnd : how === 'focus' ? mDone : tName) + F(4);   // 2-6 frames after [X17]

    return {
      el, box,
      seek(t) {
        t += 1e-4;
        // mark
        if (how === 'flip') {
          const x = clamp01((t - mStart) / FLIP);
          const ang = Math.PI * x ** FLIP_EXP;
          const sx = Math.abs(Math.cos(ang));
          setStyle(turn, 'transform', x > 0 && x < 1 ? `scaleX(${Math.max(0.02, sx).toFixed(4)})` : '');
          setStyle(holder, 'visibility', ang < Math.PI / 2 ? 'visible' : 'hidden');
          setStyle(mark, 'visibility', ang >= Math.PI / 2 ? 'visible' : 'hidden');
        } else if (how === 'focus') {
          const p = S.E.out(clamp01((t - mStart) / FOCUS));
          const b = BLUR * (1 - p);
          setStyle(turn, 'filter', b > 0.05 ? `blur(${b.toFixed(2)}px)` : '');
          setStyle(nameWrap, 'filter', b > 0.05 ? `blur(${b.toFixed(2)}px)` : '');
        } else {
          const st = partAt(S, t - mStart, 'grow');
          setStyle(turn, 'visibility', st.o > 0 ? 'visible' : 'hidden');
          setStyle(turn, 'transform', st.s < 0.9998 ? `scale(${st.s.toFixed(4)})` : '');
        }
        // ring
        const q = (t - tRing) / motion.ring.dur;
        if (q >= 0 && q < 1) {
          const rr = R * (RING_FROM + (motion.ring.to - RING_FROM) * q);
          setStyle(ring, 'visibility', 'visible'); Object.assign(ring.style, { left: `${(-rr).toFixed(1)}px`, top: `${(cy - rr).toFixed(1)}px`, width: `${(2 * rr).toFixed(1)}px`, height: `${(2 * rr).toFixed(1)}px`, opacity: (1 - q).toFixed(3) });
        } else setStyle(ring, 'visibility', 'hidden');
        // shine
        const u = (t - tShine) / SHINE_DUR;
        if (u >= 0 && u < 1) { setStyle(shine, 'visibility', 'visible'); setStyle(shine, 'backgroundPosition', `${(100 - 100 * S.E.inOut(u)).toFixed(2)}% 0`); }
        else setStyle(shine, 'visibility', 'hidden');
        // name
        if (how === 'type') {
          const n = t < tName ? 0 : Math.min(params.name.length, 1 + Math.floor((t - tName) / TYPE_PER_CHAR));
          const str = params.name.slice(0, n);
          if (name._t !== str) { name.textContent = str; name._t = str; }
        } else {
          if (name._t !== params.name) { name.textContent = params.name; name._t = params.name; }
          if (how === 'flip') applyPart(nameIn, partAt(S, t - tName, 'slide', { dist: NAME_RISE * NAME_CAP }));
        }
        if (sub) applyPart(sub, partAt(S, t - tSub, 'slide', { dist: 14 }));
      },
    };
  },
};
