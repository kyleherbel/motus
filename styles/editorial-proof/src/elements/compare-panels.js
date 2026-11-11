// Two sides of an idea as a pair of tinted tiles ("Elephant / remembers everything" against
// "Goldfish / remembers nothing"). Measured on the one reference instance, frame by frame:
//   frame 0        the two icons are already on screen, large, at the left and right edges
//   frames 0-16/18 they travel 330 px inward on the emphasised curve (left 16 f, right 18 f),
//                  smeared along the motion like a half-open shutter, and sharpen as they slow
//   frame 14       the title wipes open from its centre over 13 frames (emphasised curve);
//                  the icons dip to 96.4 % and recover while it lands
//   5 f before the panels open the icons start shrinking to 57.6 % over 26 frames, each towards
//                  its own tile, keeping its top edge and its outer edge where they were
//   panels         each tile grows as a circle out of its icon in 5 frames (right 2 f after left);
//                  the label fades up 7.6 f later rising 21 px, the sub-line 5 f after the label
// On the white ground the tiles sit bare (as measured); on the light and dark grounds, where the
// tints would sink into the backdrop, they sit inside the style's card.
import { cardFrame } from '../card.js';
import { fonts, type, F } from '../tokens.js';

// ---- TOKENS WANTED in tokens.js (layout.panels / motion.panels / colour): kept here until the
// shared file can take them. All measured on clip37@264-340 unless noted.
const G = {
  tile: { w: 434, h: 571, gap: 24, radius: 26, stroke: 2, inset: 1 },   // x 94-527 and 552-985, y 420-990
  title: { size: 64.5, weight: 600, tracking: 0, baseline: 61.5, block: 120 },   // ink 179-899 x 313-374; tiles start 120 px under the block top
  icon: { box: 189, cy: 159.5, introScale: 1.736, introDx: 167.5, introCy: 229.5 },   // 174x190 at rest, 302x330 on entry, pair centred on the canvas
  label: { size: 82.5, weight: 700, tracking: -0.025, baseline: 381, min: 50 },
  sub: { size: 44, weight: 600, tracking: 0, baseline: 457, pitch: 53.5, alpha: 0.56, min: 32 },   // #707279 on the cool tile, #78716F on the warm one = ink at 56 %
  centre: 292.75,                    // visual centre of icon + label + two sub-lines inside the 571 px tile
  pad: 28,                           // inside the card on light and dark grounds
};
const M = {
  enter: { travel: 330, durA: F(16), durB: F(18), shutter: 0.55 },      // rmse 0.37 / 0.41 px against cubic-bezier(0.2,0,0,1)
  title: { at: F(14), wipe: F(13), wordDelay: F(2.6) },
  pulse: { at: F(2.9), down: F(2.2), up0: F(5.5), up: F(4.5), depth: 0.036 },   // after the title starts
  open: { at: F(37), lead: F(5), shrink: F(26), wordLead: F(1.4), circle: F(5), sideLag: F(2), textLag: F(3) },
  text: { label: F(7.62), sub: F(12.62), rise: 21.2, riseDur: F(11.5), fadePre: F(0.3), fade: F(2.4) },
};
// side A takes the look's accent family, side B the one warm contrast colour of the reference
const TINTS = {
  blue: { icon: '#0F6BF7', fill: '#E5EEFB', edge: '#D5DFF2' },
  warm: { icon: '#F37100', fill: '#FCEFDF', edge: '#F3DECA' },
};

// ---- a small original icon set: chunky single-colour glyphs, drawn here, tight viewBoxes
const stroke = (w, extra = '') => `fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}`;
const ICONS = {
  spark: [92, 100, '<path d="M46 0C50 30 62 44 92 50C62 56 50 70 46 100C42 70 30 56 0 50C30 44 42 30 46 0Z"/>'],
  agent: [92, 100, `<circle cx="46" cy="8" r="8"/><path d="M46 12V30" ${stroke(8)}/><path fill-rule="evenodd" d="M22 26H70a22 22 0 0 1 22 22V78a22 22 0 0 1-22 22H22A22 22 0 0 1 0 78V48A22 22 0 0 1 22 26ZM21 60a9 9 0 1 0 18 0a9 9 0 1 0-18 0ZM53 60a9 9 0 1 0 18 0a9 9 0 1 0-18 0Z"/>`],
  bolt: [76, 100, '<path d="M46 4L6 58H32L26 96L70 40H44Z" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/>'],
  check: [100, 86, `<path d="M12 47L38 73L88 14" ${stroke(22)}/>`],
  cross: [88, 88, `<path d="M14 14L74 74M74 14L14 74" ${stroke(24)}/>`],
  clock: [100, 100, `<circle cx="50" cy="50" r="42" ${stroke(16)}/><path d="M50 28V52L66 62" ${stroke(12)}/>`],
  eye: [100, 68, '<path fill-rule="evenodd" d="M0 34C20 2 80 2 100 34C80 66 20 66 0 34ZM34 34a16 16 0 1 0 32 0a16 16 0 1 0-32 0Z"/>'],
  person: [84, 100, '<circle cx="42" cy="24" r="24"/><path d="M0 100C0 70 18 54 42 54C66 54 84 70 84 100Z"/>'],
  doc: [78, 100, '<path fill-rule="evenodd" d="M14 0H50L78 28V86a14 14 0 0 1-14 14H14A14 14 0 0 1 0 86V14A14 14 0 0 1 14 0ZM18 44h42v10H18ZM18 66h42v10H18Z"/>'],
  chat: [100, 92, '<path d="M22 0H78a22 22 0 0 1 22 22V46a22 22 0 0 1-22 22H52L26 92V68H22A22 22 0 0 1 0 46V22A22 22 0 0 1 22 0Z"/>'],
  shield: [84, 100, '<path d="M42 0L84 14V46C84 72 66 90 42 100C18 90 0 72 0 46V14Z"/>'],
  list: [100, 84, '<rect width="100" height="20" rx="10"/><rect y="32" width="100" height="20" rx="10"/><rect y="64" width="68" height="20" rx="10"/>'],
  search: [96, 96, `<circle cx="40" cy="40" r="30" ${stroke(18)}/><path d="M64 64L85 85" ${stroke(20)}/>`],
  lock: [80, 100, `<rect y="42" width="80" height="58" rx="16"/><path d="M18 46V30a22 22 0 0 1 44 0V46" ${stroke(14)}/>`],
  code: [108, 84, `<path d="M34 12L10 42L34 72M74 12L98 42L74 72" ${stroke(18)}/>`],
  heart: [100, 90, '<path d="M50 90C20 68 0 50 0 28A27 27 0 0 1 50 16A27 27 0 0 1 100 28C100 50 80 68 50 90Z"/>'],
  star: [100, 96, '<path d="M50 6L62.9 35.6L94.7 38.5L70.6 59.6L77.6 90.9L50 74.4L22.4 90.9L29.4 59.6L5.3 38.5L37.1 35.6Z" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/>'],
  up: [88, 100, `<path d="M12 44L44 12L76 44M44 14V88" ${stroke(22)}/>`],
  down: [88, 100, `<path d="M12 56L44 88L76 56M44 86V12" ${stroke(22)}/>`],
  empty: [100, 100, `<circle cx="50" cy="50" r="42" ${stroke(16, 'stroke-dasharray="21 16.7"')}/>`],
  disc: [100, 100, '<circle cx="50" cy="50" r="50"/>'],
};

const hexRgb = (hex) => { const v = parseInt(String(hex).replace('#', ''), 16); return [v >> 16, (v >> 8) & 255, v & 255]; };
const rgbHex = (c) => `#${c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;
/** A tile tint from an icon colour, in the proportions measured on the two reference tiles (11.5 % over white, edge 6.5 % darker). */
const tintOf = (hex) => { const fill = hexRgb(hex).map((v) => 255 + (v - 255) * 0.115); return { icon: hex, fill: rgbHex(fill), edge: rgbHex(fill.map((v) => v * 0.935)) }; };

const side = {
  title: { type: 'string', maxChars: 14, maxWords: 2 },             // "Elephant"
  sub: { type: 'string', optional: true, maxChars: 28, maxWords: 5 }, // "Remembers everything": wraps to two lines at most
  icon: `enum?:${Object.keys(ICONS).join('|')}`,                    // a built-in glyph, tinted with the side's colour
  src: 'asset?',                                                    // or your own image (shown as is); wins over icon
  at: 'word?',                                                      // the word on which this side's panel opens
};

export default {
  type: 'compare-panels',
  label: 'Compare panels',
  slots: ['card'],
  params: {
    left: { ...side },
    right: { ...side },
    title: { type: 'string', optional: true, maxChars: 28, maxWords: 5 },   // one line above both panels: "Elephant-Goldfish Model"
    titleAt: 'word?',                                                       // the word on which the title wipes open (default 14 frames in)
  },
  beats: {},

  async prepare(params, S) {
    const load = async (src) => { if (!src) return null; const img = new Image(); img.src = S.env.projectUrl(src); await img.decode().catch(() => { throw new Error(`Could not load ${src}`); }); return { src: img.src, w: img.naturalWidth || 1, h: img.naturalHeight || 1 }; };
    return { imgs: [await load(params.left.src), await load(params.right.src)] };
  },

  prefer(params, { mode, w }) {
    const bare = mode === 'white';
    const tw = (w - 2 * (bare ? G.tile.inset : G.pad) - G.tile.gap) / 2, k = tw / G.tile.w;
    const head = params.title ? (bare ? G.title.block : G.title.block - 20) * k : 0;
    return { h: Math.round((bare ? 0 : 2 * G.pad) + head + G.tile.h * k) };
  },

  build(ctx) {
    const { S, params, rect, mode, tIn, data } = ctx; const { kit, C } = S; const { h } = kit;
    const bare = mode === 'white';
    const card = bare ? null : cardFrame(S, { w: rect.w, h: rect.h, mode, tIn });
    const root = bare ? h('div.ep-panels', { style: { position: 'absolute', left: '0', top: '0', width: `${rect.w}px`, height: `${rect.h}px` } }) : card.body;

    // ---- geometry: two tiles across the width, content scaled with them
    const inset = bare ? G.tile.inset : G.pad;
    const tw = (rect.w - 2 * inset - G.tile.gap) / 2, k = tw / G.tile.w;
    const head = params.title ? (bare ? G.title.block : G.title.block - 20) * k : 0;
    const top = (bare ? 0 : G.pad) + head;
    const th = Math.max(120, Math.min(G.tile.h * k, rect.h - top - (bare ? 0 : G.pad)));
    const s = Math.min(k, th / G.tile.h);                       // content scale
    const cx0 = rect.w / 2;
    const sides = [params.left, params.right].map((p, i) => ({ p, i, x: inset + i * (tw + G.tile.gap), img: data?.imgs?.[i] || null }));

    const tintA = C.accentName === 'blue' ? TINTS.blue : tintOf(C.outline);
    const tints = [tintA, TINTS.warm];

    // ---- title: one centred line, opened from its centre
    let title = null;
    if (params.title) {
      const font = (z) => `${G.title.weight} ${z}px ${fonts.sans}`;
      const size = kit.fitSize(params.title, rect.w - 2 * inset - 8, font, G.title.size * k, 40 * k, G.title.tracking);
      const textW = kit.measure(params.title, font(size), G.title.tracking * size);
      const el = h('div', { text: params.title, style: { position: 'absolute', left: '0', top: `${(bare ? 0 : G.pad - 14 * k) + G.title.baseline * k - size * type.ascent.sans}px`, width: `${rect.w}px`, textAlign: 'center', whiteSpace: 'nowrap', font: `${G.title.weight} ${size}px/1 ${fonts.sans}`, letterSpacing: `${G.title.tracking}em`, color: C.ink } });
      root.append(el);
      title = { el, half: textW / 2 + 3, t0: params.titleAt !== undefined ? S.wordTime(params.titleAt) + M.title.wordDelay : tIn + M.title.at };
    }

    // ---- when each panel opens (the circle's first frame sits 1.4 f ahead of the word onset)
    const earliest = tIn + F(12);                                // the entrance must read before anything opens
    const wordT = (w) => S.wordTime(w) - M.open.wordLead;
    let oL = params.left.at !== undefined ? wordT(params.left.at) : null;
    let oR = params.right.at !== undefined ? wordT(params.right.at) : null;
    if (oL === null && oR === null) oL = tIn + M.open.at;
    if (oR === null) oR = oL + M.open.sideLag;
    if (oL === null) oL = oR - M.open.sideLag;
    const open = [Math.max(earliest, oL), Math.max(earliest, oR)];
    const together = Math.abs(open[1] - open[0]) <= F(4);        // one choreography: the later side's text trails by 3 frames, its tile by 2
    const later = open[1] >= open[0] ? 1 : 0;
    const shrinkAt = Math.min(open[0], open[1]) - M.open.lead;
    S.sfx(Math.min(open[0], open[1]), 'highlight');              // SOUND KEY WANTED: 'panels' (the airy swish measured at the open, frames 301-313)
    if (!together) S.sfx(Math.max(open[0], open[1]), 'highlight');

    // ---- tiles, icons, text
    const fid = `ep-mb-${S.uid()}`;
    const ns = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(ns, 'svg');
    defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
    Object.assign(defs.style, { position: 'absolute', left: '0', top: '0' });
    defs.innerHTML = [0, 1].map((i) => `<filter id="${fid}-${i}" filterUnits="userSpaceOnUse" x="-700" y="-500" width="1400" height="1000" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0 0"/></filter>`).join('');
    root.append(defs);

    const tileCy = top + th / 2;
    const yOf = (v, shift) => tileCy + (v - G.tile.h / 2 + shift) * s;      // a measured offset inside the 571 px tile -> our px
    const parts = sides.map(({ p, i, x, img }) => {
      const tint = tints[i];
      const tcx = x + tw / 2;
      const glyph = p.src ? null : ICONS[p.icon] || null;
      const hasIcon = !!(img || glyph);

      // sub-line: at most two lines, shrunk to fit
      let sub = null;
      if (p.sub) {
        const font = (z) => `${G.sub.weight} ${z}px ${fonts.sans}`;
        let size = G.sub.size * s; let lines = kit.wrap(p.sub.trim().split(/\s+/), tw - 56 * s, font(size));
        while (lines.length > 2 && size > G.sub.min * s) { size -= 1; lines = kit.wrap(p.sub.trim().split(/\s+/), tw - 56 * s, font(size)); }
        if (lines.length > 2) { S.warn(`compare-panels: "${p.sub}" does not fit two lines; it is cut`); lines = lines.slice(0, 2); }
        sub = { size, lines: lines.map((l) => l.join(' ')) };
      }
      // re-centre the block when it has fewer parts than the measured one (icon + label + two lines)
      const labelSize = kit.fitSize(p.title, tw - 44 * s, (z) => `${G.label.weight} ${z}px ${fonts.sans}`, G.label.size * s, G.label.min * s, G.label.tracking);
      const blockTop = hasIcon ? G.icon.cy - G.icon.box / 2 : G.label.baseline - 62;
      const blockBottom = sub ? G.sub.baseline + (sub.lines.length - 1) * G.sub.pitch + 9 : G.label.baseline + 17;
      const shift = G.centre - (blockTop + blockBottom) / 2;

      const tile = h('div.ep-panel', { style: { position: 'absolute', left: `${x}px`, top: `${top}px`, width: `${tw}px`, height: `${th}px`, boxSizing: 'border-box', borderRadius: `${G.tile.radius * k}px`, background: tint.fill, border: `${G.tile.stroke}px solid ${tint.edge}`, display: 'none' } });
      root.append(tile);

      const label = h('div', { text: p.title, style: { position: 'absolute', left: `${x}px`, top: `${yOf(G.label.baseline, shift) - labelSize * type.ascent.sans}px`, width: `${tw}px`, textAlign: 'center', whiteSpace: 'nowrap', font: `${G.label.weight} ${labelSize}px/1 ${fonts.sans}`, letterSpacing: `${G.label.tracking}em`, color: C.ink, display: 'none', willChange: 'transform, opacity' } });
      root.append(label);
      let subEl = null;
      if (sub) {
        subEl = h('div', { style: { position: 'absolute', left: `${x}px`, top: '0', width: `${tw}px`, height: '0', display: 'none', willChange: 'transform, opacity' } },
          ...sub.lines.map((line, n) => h('div', { text: line, style: { position: 'absolute', left: '0', top: `${yOf(G.sub.baseline + n * G.sub.pitch, shift) - sub.size * type.ascent.sans}px`, width: `${tw}px`, textAlign: 'center', whiteSpace: 'nowrap', font: `${G.sub.weight} ${sub.size}px/1 ${fonts.sans}`, letterSpacing: `${G.sub.tracking}em`, color: `rgba(19,20,22,${G.sub.alpha})` } })));
        root.append(subEl);
      }

      // icon: at rest centred in the tile; on entry 1.736x, the pair centred on the canvas
      let icon = null;
      if (hasIcon) {
        const box = G.icon.box * s;
        const [vw, vh] = glyph ? glyph : [img.w, img.h];
        const iw = vw >= vh ? box : box * (vw / vh), ih = vw >= vh ? box * (vh / vw) : box;
        const inner = h('div', { style: { position: 'absolute', left: `${-iw / 2}px`, top: `${-ih / 2}px`, width: `${iw}px`, height: `${ih}px`, color: tint.icon, lineHeight: '0', transformOrigin: '50% 50%' },
          html: glyph ? `<svg viewBox="0 0 ${vw} ${vh}" width="${iw}" height="${ih}" fill="currentColor" style="display:block;overflow:visible">${glyph[2]}</svg>` : '' });
        if (img) inner.append(h('img', { src: img.src, style: { width: `${iw}px`, height: `${ih}px`, display: 'block', objectFit: 'contain' } }));
        const outer = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0', willChange: 'transform, filter' } }, inner);
        root.append(outer);
        const restY = yOf(G.icon.cy, shift);
        // entry pose: same top edge as at rest, scaled about it; the outer edges of the pair stay put through the shrink
        const introY = restY + (G.icon.introCy - G.icon.cy) * s;
        const halfIntro = (iw * G.icon.introScale) / 2;
        const outerEdge = i === 0 ? tcx - iw / 2 : tcx + iw / 2;                 // where the outer edge rests
        const introX = i === 0 ? Math.min(outerEdge + halfIntro, cx0 - 16.5 * s - halfIntro) : Math.max(outerEdge - halfIntro, cx0 + 16.5 * s + halfIntro);
        icon = { outer, inner, blur: defs.querySelectorAll('feGaussianBlur')[i], restX: tcx, restY, introX, introY, dur: i === 0 ? M.enter.durA : M.enter.durB, dir: i === 0 ? -1 : 1 };
      }
      const lag = together && i === later ? M.open.textLag - M.open.sideLag : 0;
      return { i, tile, label, subEl, icon, tcx, open: open[i], labelAt: open[i] + M.text.label + lag, subAt: open[i] + M.text.sub + lag, rcy: (icon ? icon.restY : tileCy) - top, R: Math.hypot(tw, th) };
    });

    const textIn = (el, t, a) => {
      const on = t >= a;
      el.style.display = on ? '' : 'none';
      if (!on) return;
      const dy = M.text.rise * s * (1 - S.E.emph(kit.clamp((t - a) / M.text.riseDur)));
      el.style.opacity = String(kit.clamp((t - a + M.text.fadePre) / M.text.fade));
      el.style.transform = dy > 0.05 ? `translateY(${dy.toFixed(2)}px)` : 'none';
    };
    const pulseAt = title ? title.t0 + M.pulse.at : Infinity;
    const iconX = (ic, t) => ic.introX + ic.dir * M.enter.travel * k * (1 - S.E.emph(kit.clamp((t - tIn) / ic.dur)));

    return {
      el: bare ? root : card.el,
      seek(t) {
        if (card) card.seek(t);
        if (title) {
          const p = S.E.emph(kit.clamp((t - title.t0) / M.title.wipe));
          title.el.style.visibility = t > title.t0 ? 'visible' : 'hidden';
          const cut = Math.max(0, rect.w / 2 - title.half * p);
          title.el.style.clipPath = p >= 1 ? 'none' : `inset(-20px ${cut.toFixed(2)}px -30px ${cut.toFixed(2)}px)`;
        }
        const ps = S.E.emph(kit.clamp((t - shrinkAt) / M.open.shrink));
        const dip = t < pulseAt ? 0 : kit.prog(t, pulseAt, M.pulse.down, kit.ease.outCubic) * (1 - kit.prog(t, pulseAt - M.pulse.at + M.pulse.up0, M.pulse.up, kit.ease.inOutCubic));
        for (const P of parts) {
          // tile: a circle growing out of the icon's resting centre
          const pc = kit.clamp((t - P.open) / M.open.circle);
          P.tile.style.display = pc > 0 ? '' : 'none';
          if (pc > 0) P.tile.style.clipPath = pc >= 1 ? 'none' : `circle(${(P.R * (1 - Math.pow(1 - pc, 1.5))).toFixed(1)}px at ${(tw / 2).toFixed(1)}px ${P.rcy.toFixed(1)}px)`;
          textIn(P.label, t, P.labelAt);
          if (P.subEl) textIn(P.subEl, t, P.subAt);
          const ic = P.icon;
          if (!ic) continue;
          const xi = iconX(ic, t);
          const x = xi + (ic.restX - xi) * ps, y = ic.introY + (ic.restY - ic.introY) * ps;
          const sc = (G.icon.introScale + (1 - G.icon.introScale) * ps) * (1 - M.pulse.depth * dip * (1 - ps));
          // shutter smear: a box of 0.55 x the frame's travel, drawn as a horizontal Gaussian of the same variance
          const v = Math.abs(iconX(ic, t + F(0.5)) - iconX(ic, t - F(0.5))) * (1 - ps);
          const sigma = (M.enter.shutter * v) / Math.sqrt(12);
          ic.blur.setAttribute('stdDeviation', `${sigma.toFixed(2)} 0`);
          ic.outer.style.filter = sigma > 0.3 ? `url(#${fid}-${P.i})` : 'none';
          ic.outer.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
          ic.inner.style.transform = `scale(${sc.toFixed(5)})`;
        }
      },
    };
  },
};
