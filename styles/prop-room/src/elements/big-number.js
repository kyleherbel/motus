// One big figure that lands as a fact (research/explain.md X07, X13 big_numeral, X11 score_card; type.md T25, T26).
// The figure appears on its spoken number (complete -1 to +2 frames from the onset), landing from 1.24x to 1.0 on the
// entrance ease over 6 frames (clip08@42-48: top edge 534 -> 574 px, settled by frame 6), then holds. It is the
// largest text in the style: about 0.84 of the frame wide and up to 560 px tall [T25: up to 576 px], a heavy
// neo-grotesque with tight spacing, near-black on pale plates and white on dark ones [T26].
// Looks [X13 big_numeral: "textured, outlined or image-filled"]:
//   solid     ink, white or the subject's colour (lit from the top when coloured)
//   type      the glyph filled with rows of small code-like text scrolling upward over a warm top-lit fill (clip08@42-81)
//   outline   a thin bright outline with a glow, on dark plates (clip11@270-300)
//   image     the glyph filled with a supplied picture (clip11@273, clip14@241, clip18@746)
// A second state (beat `change`): a numeric figure counts to the new value fast on the ease-out (score totals: 6-10
// frames), turns the new colour as it lands and a ring pulses out (clip06@880-896) [X09, X72].
import { CX, F, colour, fonts, motion, layout } from '../tokens.js';
import { place, setStyle, clamp01, sansFont, measureText, partAt, applyPart, unit, snapper } from '../common.js';
import { plateIsDark } from '../plate.js';

// TOKENS (research/explain.md X07, X09, X17, X72; type.md T25, T26)
const MAX_W = 904;             // widest figure: "90%" 904 px (clip08@50, x 95-999) [T25]
const MAX_CAP = 560;           // tallest figure: "48" about 560 px in the panel (clip11@272, by eye on the frame) [T25]
const TRACK = 0;               // em: as the counters (clip16@295 "0" gap 0.049 of the digit height) [T26]
const WEIGHT = 900;            // the reference numerals are heavier and wider than Inter 800 (clip08@55, clip18@775; by eye) [T26]
const MAX_BLOCK = 0.84;        // figure and label together fill at most 0.84 of the stage height (by eye; clip11@272 fills 0.62 with no label)
const LAND_FROM = motion.prop.landFrom;   // 1.24 -> 1.0 (clip08@42: 1.25 from the top edge) [M14, X18]
const LAND_DUR = motion.badge.dur;        // 6 frames (settled clip08@48) [X18]
const AFTER_CUT = F(3);        // with no spoken number: the plate shows first, the figure lands 3 frames in (clip08@39 -> 42) [X04]
const LABEL_CAP = 0.24;        // label cap height / figure cap ("OVER" 64 px over "$100" 265 px, clip18@775) [T25]
const LABEL_GAP = 0.24;        // figure baseline to label cap top / figure cap (clip18@775: 721 -> 786) [T25]
const LABEL_AFTER = F(4);      // the label follows the figure 2-6 frames later [X17 secondary line]
const SUFFIX_CAP = 0.3;        // "/10" beside a score, by eye (clip06@905)
const CHANGE_DUR = F(9);       // a score counts to its value in 6-10 frames on the ease-out (clip05@541-547, clip06@880-883) [X09]
const RING_FROM = 1.12;        // ring leaves at 1.12x the mark, near linear to 1.5x over 9 frames [X17, X72]
const TYPE = {                 // the code-textured fill (clip08@50-58)
  fill: ['#EC997C', '#D17456'],    // top and bottom of the glyph (rows 580 and 800) [T26 accent #EA936C]
  ink: 'rgba(48,18,10,0.74)',      // the small text (median of dark pixels inside the glyph, #2A1918 at partial cover; by eye)
  size: 28, pitch: 32,             // small text size and line pitch (by eye from the frame)
  speed: 11,                       // upward scroll, px per frame (a line moves about 88 px in 8 frames, by eye)
};
const OUTLINE = { stroke: 6, glow: '#FF7A2F' };   // white outline 6 px and an orange glow (clip11@272, by eye)

const hexOk = (c) => /^#[0-9a-f]{6}$/i.test(c || '');

/** Event starts land on the frame grid, so a fast ease starts from its first value on a whole frame (a 6-frame land
 *  started half a frame late would show 1.09x instead of 1.25x on its first frame); seek adds 0.1 ms so an event
 *  that starts on a frame counts as started there despite float error. A shared helper would do. */
const num = (s) => { const m = String(s).match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/); return m ? { pre: m[1], v: parseFloat(m[2].replace(/,/g, '')), dec: (m[2].split('.')[1] || '').length, post: m[3], sep: m[2].includes(',') } : null; };
const fmt = (n, v) => { let s = v.toFixed(n.dec); if (n.sep) { const [i, d] = s.split('.'); s = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : ''); } return `${n.pre}${s}${n.post}`; };

// generic code-like rows for the "type" look (no reference text): a seeded walk through a small vocabulary
const WORDS = ['const', 'let', 'await', 'return', 'export', 'function', 'items', 'value', 'result', 'next', 'data', 'list', 'count', 'total', 'map', 'filter', 'send', 'user', 'post', 'reply', 'open', 'save'];
function codeLines(S, seed, n) {
  const r = S.kit.seeded(S.kit.hash(seed) >>> 0);
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = WORDS[Math.floor(r() * WORDS.length)], b = WORDS[Math.floor(r() * WORDS.length)], c = WORDS[Math.floor(r() * WORDS.length)];
    const forms = [`${a} ${b} = ${c}(${a}) {`, `${b}.${c}((${a}) => ${b}),`, `${a}(${b}, ${c}) {`, `${c}: ${b}.${a}(),`, `} ${a} ${b}.${c}("${a}")`, `if (!${b}) ${a} ${c}(${b})`];
    // a row runs past the widest figure: three or four statements with runs of spaces between them
    let row = '';
    for (let k = 0; k < 4; k++) row += forms[Math.floor(r() * forms.length)] + ' '.repeat(1 + Math.floor(r() * 5));
    out.push(row);
  }
  return out;
}

export default {
  type: 'big-number',
  label: 'Big number',
  slots: ['graphic'],
  params: {
    text: { type: 'string', maxChars: 6, maxWords: 1 },                       // "90%", "2x", "$5", "48", "400+"
    suffix: { type: 'string', optional: true, maxChars: 4 },                   // "/10", set small after the figure
    label: { type: 'string', optional: true, maxChars: 22, maxWords: 4 },
    word: { type: 'word', optional: true },                                    // the spoken number: the figure lands on it [X07]
    look: 'enum?:solid|type|outline|image',
    asset: 'asset?',                                                           // the picture inside the glyph (look image)
    color: { type: 'string', optional: true, maxChars: 7 },
  },
  beats: {
    change: { text: { type: 'string', maxChars: 6, maxWords: 1 }, color: { type: 'string', optional: true, maxChars: 7 } },   // a second state [X11 score_card]
  },
  async prepare(params, S) {
    if (!params.asset) return null;
    const url = S.env.projectUrl(params.asset);
    try { const img = new Image(); img.src = url; await img.decode(); return { url }; }
    catch { S.warn(`big-number: could not load ${params.asset}`); return null; }
  },
  build(ctx) {
    const { S, params, data, seed } = ctx;
    const { h } = S.kit;
    const snap = snapper(S), tIn = snap(ctx.tIn);
    const beats = ctx.beats.map((b) => ({ ...b, t: snap(b.t) }));
    const dark = plateIsDark(params.plate, params.field);
    const look = params.look === 'image' && !data ? 'solid' : params.look || 'solid';
    if (params.look === 'image' && !data) S.warn('big-number: look "image" needs an `asset`; drawn solid');
    const changes = beats.filter((b) => b.do === 'change');
    const texts = [params.text, ...changes.map((b) => b.text)];
    const cap = fonts.M.cap;

    // ---- size: as large as the widest state allows, within 904 px wide and 560 px of cap height
    const probe = sansFont(100, WEIGHT);
    const sufW = () => (params.suffix ? measureText(params.suffix, probe, TRACK * 100) * SUFFIX_CAP * 1.0 + 6 : 0);   // per 100 px of figure size
    const widest = Math.max(...texts.map((tx) => measureText(tx, probe, TRACK * 100))) + sufW();
    const st = layout.stage[ctx.mode === 'full' ? 'full' : 'split'], stageH = st.bottom - st.top;
    const perCap = 1 + (params.label ? LABEL_GAP + LABEL_CAP * 1.25 : 0);
    let size = Math.min((MAX_W / widest) * 100, MAX_CAP / cap, (MAX_BLOCK * stageH) / perCap / cap);
    const figCap = size * cap;
    // the label is a quarter of the figure's height, set smaller if it is wider than the stage
    const room = 1080 - 2 * st.margin;
    let lSize = (figCap * LABEL_CAP) / cap;
    const lw = params.label ? measureText(params.label, sansFont(lSize, fonts.weight.display), -0.01 * lSize) : 0;
    if (lw > room) lSize *= room / lw;
    const lCap = lSize * cap;
    const hgt = figCap + (params.label ? figCap * LABEL_GAP + lCap + lSize * 0.25 : 0);
    const wid = (widest * size) / 100;
    const box = place(ctx, Math.max(wid, Math.min(lw, room)), hgt);
    const s = box.s;
    size *= s;
    const fc = figCap * s;
    const base = box.y + fc;           // the figure's baseline
    const ink = hexOk(params.color) ? params.color : dark ? colour.white : colour.ink;

    // ---- the figure: one line box, the suffix inline
    const fig = h('div', { style: { position: 'absolute', left: `${CX}px`, top: `${(base - size * fonts.M.base).toFixed(2)}px`, whiteSpace: 'nowrap',
      font: sansFont(size, WEIGHT), letterSpacing: `${TRACK}em`, lineHeight: '1', transform: 'translateX(-50%)', transformOrigin: `50% ${(size * fonts.M.base - fc / 2).toFixed(1)}px` } });
    const glyphs = h('span', { style: { display: 'inline-block', paddingBottom: `${(size * 0.14).toFixed(1)}px`, marginBottom: `${(-size * 0.14).toFixed(1)}px` } });
    fig.append(glyphs);
    let suf = null;
    if (params.suffix) {
      suf = h('span', { text: params.suffix, style: { font: sansFont(size * SUFFIX_CAP, fonts.weight.heavy), letterSpacing: '0', marginLeft: `${(size * 0.03).toFixed(1)}px`,
        color: dark ? 'rgba(255,255,255,0.6)' : colour.inkSoft } });
      fig.append(suf);
    }
    const paint = (col) => {
      if (look === 'type') {
        const lines = codeLines(S, seed, 40);
        const H = lines.length * TYPE.pitch;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(wid * s)}" height="${H}"><g font-family="Menlo, Consolas, monospace" font-weight="700" font-size="${TYPE.size}" fill="${TYPE.ink}">${lines.map((ln, i) => `<text x="${(-40 * unit(S, seed + i)).toFixed(0)}" y="${(i + 0.8) * TYPE.pitch}" xml:space="preserve">${ln.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')}</text>`).join('')}</g></svg>`;
        const url = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
        const g = hexOk(params.color) ? [params.color, params.color] : TYPE.fill;
        Object.assign(glyphs.style, { backgroundImage: `${url}, linear-gradient(to bottom, ${g[0]}, ${g[1]})`, backgroundRepeat: 'repeat-y, no-repeat', backgroundSize: `auto ${H}px, 100% 100%`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' });
        glyphs._scrollH = H;
      } else if (look === 'outline') {
        // the outline is cut from the filled glyph (the glyph minus itself eroded), so the variable font's overlapping
        // contours do not show as a text stroke would; the glow is the outline blurred in the glow colour
        Object.assign(glyphs.style, { color: colour.white, filter: `url(#${outlineId})` });
      } else if (look === 'image') {
        Object.assign(glyphs.style, { backgroundImage: `url("${data.url}")`, backgroundSize: 'cover', backgroundPosition: 'center', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          WebkitTextStroke: `${Math.max(2, size * 0.008).toFixed(1)}px ${dark ? colour.white : colour.ink}` });
      } else if (hexOk(col) && col !== colour.ink && col !== colour.white) {
        // a coloured figure is lit from the top: +8 % white at the top to -8 % black at the bottom [C23]
        Object.assign(glyphs.style, { backgroundImage: `linear-gradient(to bottom, ${colour.light.top}, transparent 50%, ${colour.light.bottom}), linear-gradient(${col}, ${col})`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' });
      } else { Object.assign(glyphs.style, { backgroundImage: '', color: col }); }
    };
    const outlineId = `pr-bn-outline-${S.uid()}`;
    let defs = null;
    if (look === 'outline') {
      const glow = hexOk(params.color) ? params.color : OUTLINE.glow;
      defs = h('div', { style: { position: 'absolute', width: '0', height: '0', overflow: 'hidden' } });
      defs.innerHTML = `<svg width="0" height="0" style="position:absolute"><filter id="${outlineId}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
        <feMorphology in="SourceAlpha" operator="erode" radius="${OUTLINE.stroke}" result="er"/>
        <feComposite in="SourceGraphic" in2="er" operator="out" result="ring"/>
        <feGaussianBlur in="ring" stdDeviation="9" result="blur"/>
        <feFlood flood-color="${glow}" result="gc"/>
        <feComposite in="gc" in2="blur" operator="in" result="glow"/>
        <feMerge><feMergeNode in="glow"/><feMergeNode in="glow"/><feMergeNode in="ring"/></feMerge></filter></svg>`;
    }
    paint(ink);
    const el = h('div.pr-big-number', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, fig);
    if (defs) el.append(defs);

    let label = null;
    if (params.label) {
      const ls = lSize * s;
      label = h('div', { text: params.label, style: { position: 'absolute', left: `${CX}px`, top: `${(base + fc * LABEL_GAP + ls * cap - ls * fonts.M.base).toFixed(2)}px`, transform: 'translateX(-50%)',
        whiteSpace: 'nowrap', font: sansFont(ls, fonts.weight.display), letterSpacing: `${(-0.01 * ls).toFixed(2)}px`, color: dark ? colour.white : colour.ink } });
      const lw = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } }, label);
      el.append(lw); label._wrap = lw;
    }
    const ring = h('div', { style: { position: 'absolute', borderRadius: '50%', boxSizing: 'border-box', border: `6px solid ${ink}`, visibility: 'hidden' } });
    el.append(ring);

    // ---- timeline
    const tShow = params.word != null ? Math.max(tIn, snap(S.wordTime(params.word))) : snap(tIn + AFTER_CUT);
    const states = [{ t: -Infinity, text: params.text, color: ink }];
    changes.forEach((b) => states.push({ t: b.t, text: b.text, color: hexOk(b.color) ? b.color : states[states.length - 1].color }));
    return {
      el, box,
      seek(t) {
        t += 1e-4;
        const a = t - tShow;
        setStyle(fig, 'visibility', a < 0 ? 'hidden' : 'visible');
        if (a >= 0) {
          const p = S.E.out(clamp01(a / LAND_DUR));
          const sc = LAND_FROM + (1 - LAND_FROM) * p;
          setStyle(fig, 'transform', `translateX(-50%) scale(${sc.toFixed(4)})`);
        }
        if (label) applyPart(label._wrap, partAt(S, t - tShow - LABEL_AFTER, 'slide', { dist: 22 }), '50% 50%');
        // the current state, and a count between two numeric states
        let k = 0; while (k + 1 < states.length && t >= states[k + 1].t) k++;
        const cur = states[k];
        let str = cur.text, col = cur.color;
        if (k > 0) {
          const prev = states[k - 1], u = t - cur.t;
          const n0 = num(prev.text), n1 = num(cur.text);
          if (n0 && n1 && u < CHANGE_DUR) { str = fmt(n1, n0.v + (n1.v - n0.v) * S.E.out(clamp01(u / CHANGE_DUR))); col = prev.color; }
          // the ring marks the landing of the new state [X72]
          const q = (u - CHANGE_DUR) / motion.ring.dur;
          if (q >= 0 && q < 1) {
            // centred on the figure itself, not on the figure and its suffix
            const gw = measureText(cur.text, sansFont(size, WEIGHT), TRACK * size);
            const sw = params.suffix ? measureText(params.suffix, sansFont(size * SUFFIX_CAP, fonts.weight.heavy)) + size * 0.03 : 0;
            const cx = CX - (gw + sw) / 2 + gw / 2;
            const R = 0.5 * Math.max(gw, fc) * (RING_FROM + (motion.ring.to - RING_FROM) * q);
            const cy = base - fc / 2;
            setStyle(ring, 'visibility', 'visible'); Object.assign(ring.style, { left: `${(cx - R).toFixed(1)}px`, top: `${(cy - R).toFixed(1)}px`, width: `${(2 * R).toFixed(1)}px`, height: `${(2 * R).toFixed(1)}px`, opacity: (1 - q).toFixed(3), borderColor: col });
          } else setStyle(ring, 'visibility', 'hidden');
        } else setStyle(ring, 'visibility', 'hidden');
        if (glyphs._t !== str) { glyphs.textContent = str; glyphs._t = str; }
        if (glyphs._c !== col) { paint(col); glyphs._c = col; }
        if (look === 'type') setStyle(glyphs, 'backgroundPosition', `0 ${(-((Math.max(0, t - tIn) * 29.97 * TYPE.speed) % glyphs._scrollH)).toFixed(1)}px, 0 0`);
      },
    };
  },
};
