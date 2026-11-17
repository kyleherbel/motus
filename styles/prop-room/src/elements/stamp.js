// A verdict that lands on the thing it judges (research/explain.md X18, X29, X72; interfaces X77).
// The subject is on screen on the cut (a receipt-like card with a title and rows, or a picture the plan supplies);
// the verdict lands about 2 frames after the judged noun is spoken: from 1.25x to 1.0 in about 6 frames on
// cubic-bezier(0.16, 1, 0.3, 1), 90 % done in 2, shrinking monotonically, never bouncing [X18, X29].
//   stamp   a word (FREE, HIRED, GOOD FIT) in heavy caps inside a thick rounded outline, one colour, a static tilt,
//           no fill: the card shows between the letters (clip10@255-262) [X18]
//   tick / cross   a filled disc with a white mark and a card shadow; a ring pulses out as it lands [X72]
import { F, colour, fonts, motion } from '../tokens.js';
import { place, setStyle, clamp01, sansFont, measureText, snapper } from '../common.js';
import { card } from '../card.js';
import { plateIsDark } from '../plate.js';

// TOKENS (research/explain.md X18, X72; type.md T25)
const STAMP = {      // measured on clip10@262 turned upright: outer box 491 x 231 px, letters "FREE" 373 x 106 [X18]
  cap: 106,          // letter cap height [X18]
  padX: 48,          // letters to the inside of the outline, sides ((61 + 57) / 2 - 11) [X18]
  padY: 52,          // top and bottom ((231 - 22 - 106) / 2) [X18]
  border: 11,        // [X18]
  radius: 20,        // by eye
  tilt: -9,          // degrees, static (top and right edges both -9; clip10@262) [X18]
  track: 0.01,       // em, by eye
};
const RED = '#CF291A';        // the FREE stamp (clip10@262, median of its pixels) [X18]
const CROSS = '#ED3749';      // the X badge (clip14@638) [X18]
const TICK = '#22B455';       // the tick badge (by eye; the pack's prop badge uses the same green)
const DISC = 220;             // badge diameter (clip14@638) [X18]
const EDGE_IN = 24;           // a badge beside its card overlaps the card's edge by 24 px (by eye)
const LAND_AFTER = F(2);      // the verdict starts 2 frames after its noun is spoken (median of 8) [X18]
const AFTER_CUT = motion.eventGap.picture;   // with no noun given: one picture-event interval after the cut [X05]
const RING_FROM = 1.12;       // the ring leaves the disc at 1.12x its radius (clip13@134: 286 / 255 px) [X17]
// the subject card: a receipt (clip10@250, paper 680 px wide, rows about 90 px apart); sizes by eye from it
const SUBJ = { w: 680, pad: 56, title: 52, row: 44, pitch: 90, rule: 3 };

const hexOk = (c) => /^#[0-9a-f]{6}$/i.test(c || '');

/** Event starts land on the frame grid, so a fast ease starts from its first value on a whole frame (a 6-frame land
 *  started half a frame late would show 1.09x instead of 1.25x on its first frame); seek adds 0.1 ms so an event
 *  that starts on a frame counts as started there despite float error. A shared helper would do. */

export default {
  type: 'stamp',
  label: 'Stamp',
  slots: ['graphic'],
  params: {
    kind: 'enum?:stamp|tick|cross',
    text: { type: 'string', optional: true, maxChars: 9, maxWords: 2 },          // the verdict word (kind stamp)
    word: { type: 'word', optional: true },                                        // the judged noun: the verdict lands on it [X18]
    title: { type: 'string', optional: true, maxChars: 18, maxWords: 3 },         // the subject card's title
    lines: { type: 'array', optional: true, min: 1, max: 4, of: {
      label: { type: 'string', maxChars: 14, maxWords: 3 },
      value: { type: 'string', maxChars: 8 },
    } },
    asset: 'asset?',                                                               // or a picture of the thing judged
    color: { type: 'string', optional: true, maxChars: 7 },
  },
  beats: {},
  async prepare(params, S) {
    if (!params.asset) return null;
    const url = S.env.projectUrl(params.asset);
    try { const img = new Image(); img.src = url; await img.decode(); return { url, ratio: img.naturalHeight / img.naturalWidth || 0.75 }; }
    catch { S.warn(`stamp: could not load ${params.asset}`); return null; }
  },
  build(ctx) {
    const { S, params, data } = ctx;
    const { h } = S.kit;
    const snap = snapper(S), tIn = snap(ctx.tIn);
    const kind = params.kind || 'stamp';
    const dark = plateIsDark(params.plate, params.field);

    // ---- the subject: a picture, a receipt card, or nothing (the verdict lands on the plate)
    const lines = params.lines || [];
    const hasCard = !data && (params.title || lines.length);
    let subjH = 0, subjW = SUBJ.w, landY = 0;
    const cap = fonts.M.cap;
    if (data) { subjW = SUBJ.w; subjH = subjW * data.ratio; landY = subjH * 0.62; }
    else if (hasCard) {
      let y = SUBJ.pad;
      if (params.title) y += SUBJ.title * cap + SUBJ.pitch * 0.75;
      const rowsTop = y;
      subjH = rowsTop + Math.max(0, lines.length - 1) * SUBJ.pitch + SUBJ.row * cap + (lines.length > 1 ? SUBJ.pitch * 0.35 : 0) + SUBJ.pad;
      landY = lines.length ? rowsTop + (lines.length - 1) * SUBJ.pitch + (lines.length > 1 ? SUBJ.pitch * 0.35 : 0) + SUBJ.row * cap / 2 : subjH / 2;
    }
    // the stamp lands inside the paper: the card runs on below the judged row (clip10@262: paper continues under the stamp)
    const vhEst = kind === 'stamp' ? STAMP.cap + 2 * STAMP.padY + 2 * STAMP.border : DISC;
    if (hasCard && lines.length) subjH = Math.max(subjH, landY + vhEst / 2 + SUBJ.pad * 0.6);

    // ---- the verdict's size
    const text = (params.text || (kind === 'stamp' ? 'OK' : '')).toUpperCase();
    const size = STAMP.cap / cap;
    const font = sansFont(size, fonts.weight.display);
    const tw = kind === 'stamp' ? measureText(text, font, STAMP.track * size) : 0;
    const vw = kind === 'stamp' ? tw + 2 * STAMP.padX + 2 * STAMP.border : DISC;
    const vh = kind === 'stamp' ? STAMP.cap + 2 * STAMP.padY + 2 * STAMP.border : DISC;
    // the rotated stamp needs a little more room than its box
    const rad = Math.abs(STAMP.tilt) * Math.PI / 180;
    const rw = kind === 'stamp' ? vw * Math.cos(rad) + vh * Math.sin(rad) : vw;
    // a tick or cross sits beside the subject, over its right edge, on the judged row, so the row stays readable
    // (clip08@315 badges beside the part they judge); a stamp lands across the row
    const onEdge = kind !== 'stamp' && subjH > 0;
    const W0 = onEdge ? subjW + DISC - EDGE_IN : Math.max(subjW, rw), H0 = subjH ? Math.max(subjH, landY + vh / 2 + 10) : vh * 1.6;
    const box = place(ctx, W0, H0);
    const s = box.s;
    const ox = box.x + (box.w - W0 * s) / 2, oy = box.y;
    const root = h('div', { style: { position: 'absolute', left: `${ox}px`, top: `${oy}px`, width: `${W0}px`, height: `${H0}px`, transform: s < 0.999 ? `scale(${s})` : '', transformOrigin: '0 0' } });
    const el = h('div.pr-stamp', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, root);
    const sx = onEdge ? 0 : (W0 - subjW) / 2;   // with a badge beside it, the card and the badge are centred together

    if (data) {
      root.append(h('div', { style: { position: 'absolute', left: `${sx}px`, top: '0', width: `${subjW}px`, height: `${subjH}px`, borderRadius: '28px',
        background: `url("${data.url}") center / cover no-repeat`, boxShadow: colour.shadow.card } }));
    } else if (hasCard) {
      const c = card(S, { x: sx, y: 0, w: subjW, h: subjH });
      root.append(c.el);
      const t = (str, x, base, sz, wt, col, align) => h('div', { text: str, style: { position: 'absolute', left: `${x}px`, top: `${(base - sz * fonts.M.base).toFixed(2)}px`,
        transform: align === 'right' ? 'translateX(-100%)' : '', whiteSpace: 'nowrap', font: sansFont(sz, wt), color: col, fontVariantNumeric: 'tabular-nums', letterSpacing: `${(-0.01 * sz).toFixed(2)}px` } });
      let y = SUBJ.pad;
      if (params.title) { y += SUBJ.title * cap; c.el.append(t(params.title, SUBJ.pad, y, SUBJ.title, fonts.weight.display, colour.ink)); y += SUBJ.pitch * 0.75; }
      lines.forEach((ln, k) => {
        const total = lines.length > 1 && k === lines.length - 1;
        if (total) {
          c.el.append(h('div', { style: { position: 'absolute', left: `${SUBJ.pad}px`, right: `${SUBJ.pad}px`, top: `${(y + k * SUBJ.pitch - SUBJ.pitch * 0.15).toFixed(1)}px`, height: '0', borderTop: `${SUBJ.rule}px dashed ${colour.ink}`, opacity: '0.55' } }));
        }
        const base = y + k * SUBJ.pitch + (total ? SUBJ.pitch * 0.35 : 0) + SUBJ.row * cap;
        c.el.append(t(ln.label, SUBJ.pad, base, SUBJ.row, total ? fonts.weight.display : fonts.weight.body, total ? colour.ink : colour.inkSoft));
        c.el.append(t(ln.value, subjW - SUBJ.pad, base, SUBJ.row, total ? fonts.weight.display : fonts.weight.body, colour.ink, 'right'));
      });
    }

    // ---- the verdict
    const cx = onEdge ? subjW - EDGE_IN + DISC / 2 : W0 / 2, cy = subjH ? landY : H0 / 2;
    let v, ring = null;
    if (kind === 'stamp') {
      const col = hexOk(params.color) ? params.color : RED;
      v = h('div', { style: { position: 'absolute', left: `${cx - vw / 2}px`, top: `${cy - vh / 2}px`, width: `${vw}px`, height: `${vh}px`, boxSizing: 'border-box',
        border: `${STAMP.border}px solid ${col}`, borderRadius: `${STAMP.radius}px`, transformOrigin: '50% 50%', visibility: 'hidden' } },
      h('div', { text, style: { position: 'absolute', left: '50%', top: `${(vh / 2 - STAMP.border - STAMP.cap / 2 - size * (fonts.M.base - cap)).toFixed(2)}px`, transform: 'translateX(-50%)',
        whiteSpace: 'nowrap', font, letterSpacing: `${STAMP.track}em`, color: col } }));
    } else {
      const col = hexOk(params.color) ? params.color : kind === 'tick' ? TICK : CROSS;
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', kind === 'tick' ? 'M29 51 L44 66 L72 36' : 'M34 34 L66 66 M66 34 L34 66');
      Object.assign(path.style, { fill: 'none', stroke: '#FFFFFF', strokeWidth: '10', strokeLinecap: 'round', strokeLinejoin: 'round' });
      svg.append(path);
      v = h('div', { style: { position: 'absolute', left: `${cx - DISC / 2}px`, top: `${cy - DISC / 2}px`, width: `${DISC}px`, height: `${DISC}px`, borderRadius: '50%',
        background: col, boxShadow: colour.shadow.card, transformOrigin: '50% 50%', visibility: 'hidden' } }, svg);
      ring = h('div', { style: { position: 'absolute', left: `${cx - DISC / 2}px`, top: `${cy - DISC / 2}px`, width: `${DISC}px`, height: `${DISC}px`, borderRadius: '50%',
        boxSizing: 'border-box', border: `6px solid ${dark && !subjH ? colour.white : col}`, visibility: 'hidden' } });
      root.append(ring);
    }
    root.append(v);

    const tLand = params.word != null ? Math.max(tIn, snap(S.wordTime(params.word) + LAND_AFTER)) : snap(tIn + AFTER_CUT);
    const tilt = kind === 'stamp' ? STAMP.tilt : 0;
    return {
      el, box,
      seek(t) {
        t += 1e-4;
        const a = t - tLand;
        if (a < 0) { setStyle(v, 'visibility', 'hidden'); if (ring) setStyle(ring, 'visibility', 'hidden'); return; }
        const p = S.E.out(clamp01(a / motion.badge.dur));
        const sc = motion.badge.from + (1 - motion.badge.from) * p;
        setStyle(v, 'visibility', 'visible');
        setStyle(v, 'transform', `rotate(${tilt}deg) scale(${sc.toFixed(4)})`);
        if (ring) {
          const q = clamp01(a / motion.ring.dur);
          setStyle(ring, 'visibility', q < 1 ? 'visible' : 'hidden');
          setStyle(ring, 'transform', `scale(${(RING_FROM + (motion.ring.to - RING_FROM) * q).toFixed(4)})`);
          setStyle(ring, 'opacity', (1 - q).toFixed(3));
        }
      },
    };
  },
};
