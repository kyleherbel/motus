// A ranked list where the viewer's row climbs ("yoursite.com" from 4 to 1) and the rows it
// passes are then struck. Measured frame by frame on clip38@1062-1257 (dark focus):
//   cut (1062)      every row is already there; the viewer's row sits muted (pale box, grey name)
//   +13 f (1075)    it switches on in one frame: accent number and disc, ink name, accent box
//   +26 f (1088)    climb: every row moves at once on cubic-bezier(0.2,0,0,1) over 24 f, the
//                   active row 3 rows up (517 px at a 172 px pitch), the others one row down;
//                   each row's number shows the slot it is nearest to. The active row lifts:
//                   scale 1 -> 1.043 in 4 f, back to 1 over 17 f, with a drop shadow below it.
//   strike (1215)   the other rows dim to 72 % over 5 f; 6 f later a red marker crosses each name,
//                   top to bottom, 8 f apart, drawn left to right (exponential, 7 f); as each
//                   stroke lands the name fades to 35 %.
// The reference also shows a row of source icons above the list (third-party logos, not drawn
// here); the layout used is the one the reference settles into once that row has gone (frames
// 1215-1257): title, then rows at a 206 px pitch with 180 px boxes.
import { cardFrame } from '../card.js';
import { fonts, type, F } from '../tokens.js';

// ---- TOKENS WANTED in tokens.js (layout.rank / motion.rank): measured on clip38, card-relative px
const G = {
  inset: 25,                 // row box x 118-961 in a card at x 93: 25 px either side; 25 px under the last row
  gap: 25,                   // between row boxes (147 in 172 at f1120, 181 in 206 at f1236)
  pitch: 206, pitchMin: 172, // final layout 206 (f1236); with the source row 172 (f1120): content unchanged
  boxRef: 147,               // the smallest box the content is drawn full size in
  top: 201,                  // first box top under the title (row 1 box at y 455, card at 254)
  topNoTitle: 25,
  titleMinBand: 40,          // smallest gap kept between the title and the first box when space is short
  radius: 19, stroke: 2.5,   // active box corner (fits 19-20) and outline (2-3 px)
  title: { size: 25, weight: 600, tracking: 0.143, baseline: 66.5, colour: '#76767A' },   // ink 373-702 x 301-318
  number: { cx: 42, size: 52, weight: 600, colour: '#A0A0A5' },      // digits 38 px tall, centred at x 160
  disc: { cx: 121.5, d: 76, fill: '#ECECEE', letter: '#737277', size: 36, weight: 600 }, // x 202-277, 'C' 27 px tall
  name: { x: 185.5, size: 43, weight: 700, tracking: -0.01, min: 28 },   // 'competitor1.com' ink 304-627 x 827-868
  mutedName: '#A0A2A6',                     // f1070; the muted box is C.tintMuted with a C.tintEdge line (colour CR07)
  activeEdgeAlpha: 0.72,                    // f1120: the active box is C.tint, its edge the accent at 72 % over it
  strike: { over: [22, 20], rise: 6.0, mid: 13.5, end: 8, dy: 2 },           // f1236: x 282-647, 8-14 px thick, 6 deg
};
const M = {
  activate: F(13), switch: F(1.5), fill: F(5),
  climb: F(24), climbLead: F(13),                                 // the row switches on 13 f before it climbs
  lift: { peak: 0.043, riseAt: F(1), rise: F(3.2), fallAt: F(5), fall: F(17), pow: 1.8 },
  shadow: { y: 16, blur: 20, alpha: 0.185, fallAt: F(5.5), fall: F(6.5) },   // fitted to the darkening under the lifted row (f1092); gone by f1100
  dim: { to: 0.72, dur: F(5) },
  strike: { lead: F(6.5), stagger: F(8), tau: F(1.62), cap: F(7.5), fade: F(1.5), struck: 0.35 },
};

const hexRgb = (hex) => { const v = parseInt(String(hex).replace('#', ''), 16); return [v >> 16, (v >> 8) & 255, v & 255]; };
const mix = (a, b, p) => { const A = hexRgb(a), B = hexRgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(',')})`; };
const smooth = (p) => p * p * (3 - 2 * p);
// Where the baseline sits in a line-height-1 box of Motus Inter (tokens type.ascent.sans).
const ASC = type.ascent.sans;

/** Row geometry for n rows in a card body of height H. */
function solve(n, H, hasTitle) {
  let top = hasTitle ? G.top : G.topNoTitle;
  const fit = (tp) => (H - tp - G.inset + G.gap) / n;
  let pitch = Math.min(G.pitch, fit(top));
  if (hasTitle && pitch < G.pitchMin) {
    top = Math.max(G.title.baseline + G.titleMinBand, H - G.inset + G.gap - n * G.pitchMin);
    pitch = Math.min(G.pitch, fit(top));
  }
  const box = pitch - G.gap;
  return { top, pitch, box, k: Math.min(1, box / G.boxRef) };
}

export default {
  type: 'rank-list',
  label: 'Rank list',
  slots: ['card'],
  params: {
    rows: { type: 'array', min: 2, max: 5, of: {
      name: { type: 'string', maxChars: 24 },        // "competitor1.com"
      mine: 'boolean?',                               // the viewer's row: starts muted, switches on, can climb
    } },
    title: { type: 'string', optional: true, maxChars: 32, maxWords: 5 },   // small tracked caps above the list
  },
  beats: {
    climb: { to: { type: 'number', optional: true, min: 1, max: 5 } },      // the viewer's row rises to this rank (default 1)
    strike: { row: { type: 'number', min: 1, max: 5 } },                     // cross out one row (its place in `rows`)
    'strike-others': {},                                                     // dim every other row, cross them out top to bottom
  },

  prefer(params) {
    const n = params.rows.length;
    return { h: Math.round((params.title ? G.top : G.topNoTitle) + n * G.pitch - G.gap + G.inset) };
  },

  build(ctx) {
    const { S, params, rect, mode, tIn, beats } = ctx; const { kit, C } = S; const { h } = kit;
    const card = cardFrame(S, { w: rect.w, h: rect.h, mode, tIn });
    const body = card.body;
    const n = params.rows.length;
    const L = solve(n, card.bodyH, !!params.title);
    const k = L.k;
    const boxW = rect.w - 2 * G.inset;

    // ---- title
    if (params.title) {
      const tr = G.title.tracking;
      const font = (z) => `${G.title.weight} ${z}px ${fonts.sans}`;
      const text = params.title.toUpperCase();
      const size = kit.fitSize(text, rect.w - 80, font, G.title.size, 16, tr);
      body.append(h('div', { text, style: { position: 'absolute', left: '0', top: `${G.title.baseline - size * ASC}px`, width: `${rect.w}px`, textAlign: 'center', whiteSpace: 'nowrap', font: `${G.title.weight} ${size}px/1 ${fonts.sans}`, letterSpacing: `${tr}em`, textIndent: `${tr}em`, color: G.title.colour } }));
    }

    // ---- rows
    let mineIdx = params.rows.findIndex((r) => r.mine);
    if (params.rows.filter((r) => r.mine).length > 1) S.warn('rank-list: only the first row marked "mine" is highlighted');
    const nameFont = (z) => `${G.name.weight} ${z}px ${fonts.sans}`;
    const nameMax = boxW - G.name.x * k - 30;
    const yOf = (pos) => L.top + pos * L.pitch;
    const rows = params.rows.map((r, i) => {
      const mine = i === mineIdx;
      const size = kit.fitSize(r.name, nameMax, nameFont, G.name.size * k, G.name.min * k, G.name.tracking);
      const nameW = kit.measure(r.name, nameFont(size), G.name.tracking * size);
      const cy = L.box / 2;
      const cap = (z) => z * 0.7275;
      const top = (z) => cy + cap(z) / 2 - z * ASC;              // a line-height-1 box whose caps centre on the row
      const wrap = h('div.ep-rank-row', { style: { position: 'absolute', left: `${G.inset}px`, top: '0', width: `${boxW}px`, height: `${L.box}px`, transformOrigin: '50% 50%', zIndex: mine ? '2' : '1' } });
      const content = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${boxW}px`, height: `${L.box}px` } });
      let boxMuted = null, boxActive = null;
      if (mine) {
        boxMuted = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${boxW}px`, height: `${L.box}px`, boxSizing: 'border-box', borderRadius: `${G.radius}px`, background: C.tintMuted, border: `1.5px solid ${C.tintEdge}` } });
        boxActive = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${boxW}px`, height: `${L.box}px`, boxSizing: 'border-box', borderRadius: `${G.radius}px`, background: C.tint, border: `${G.stroke}px solid ${mix(C.tint, C.accent, G.activeEdgeAlpha)}`, opacity: '0' } });
        wrap.append(boxMuted, boxActive);
      }
      const nz = G.number.size * k;
      const num = h('div', { text: String(i + 1), style: { position: 'absolute', left: `${G.number.cx * k - 40}px`, top: `${top(nz)}px`, width: '80px', textAlign: 'center', font: `${G.number.weight} ${nz}px/1 ${fonts.sans}`, fontVariantNumeric: 'tabular-nums', color: G.number.colour, whiteSpace: 'nowrap' } });
      const d = G.disc.d * k, lz = G.disc.size * k;
      const letter = h('div', { text: (r.name.trim().replace(/^(https?:\/\/)?(www\.)?/i, '')[0] || '?').toUpperCase(), style: { position: 'absolute', left: '0', top: `${d / 2 + cap(lz) / 2 - lz * ASC}px`, width: `${d}px`, textAlign: 'center', font: `${G.disc.weight} ${lz}px/1 ${fonts.sans}`, color: G.disc.letter } });
      const disc = h('div', { style: { position: 'absolute', left: `${G.disc.cx * k - d / 2}px`, top: `${cy - d / 2}px`, width: `${d}px`, height: `${d}px`, borderRadius: '50%', background: G.disc.fill, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.035)' } }, letter);
      const name = h('div', { text: r.name, style: { position: 'absolute', left: `${G.name.x * k}px`, top: `${top(size)}px`, whiteSpace: 'nowrap', font: `${G.name.weight} ${size}px/1 ${fonts.sans}`, letterSpacing: `${G.name.tracking}em`, color: mine ? G.mutedName : C.ink } });
      content.append(num, disc, name);
      wrap.append(content);
      body.append(wrap);
      return { i, r, mine, wrap, content, num, disc, letter, name, boxMuted, boxActive, nameX: G.name.x * k, nameW, cy, shown: i + 1, strikes: [], dimAt: Infinity, struckAt: Infinity };
    });
    if (mineIdx < 0) mineIdx = -1;

    // ---- the order over time: a list of moves, each re-ranking every row on the emphasised curve
    const sorted = [...beats].sort((a, b) => a.t - b.t);
    const moves = [];
    let order = rows.map((r) => r.i);
    const climbs = sorted.filter((b) => b.do === 'climb');
    if (climbs.length && mineIdx < 0) S.warn('rank-list: a climb beat needs one row marked "mine"');
    for (const b of climbs) {
      if (mineIdx < 0) break;
      const to = Math.max(0, Math.min(n - 1, (b.to ?? 1) - 1));
      const next = order.filter((x) => x !== mineIdx); next.splice(to, 0, mineIdx);
      if (next.join() === order.join()) continue;
      moves.push({ t: b.t, from: order, to: next });
      order = next;
      S.sfx(b.t, 'highlight');           // SOUND KEY WANTED: 'reorder' (not measured; the swish is a placeholder)
    }
    const posOf = (i, t) => {
      let p = moves.length ? moves[0].from.indexOf(i) : i;
      for (const mv of moves) {
        if (t < mv.t) break;
        const a = mv.from.indexOf(i), b = mv.to.indexOf(i);
        p = a + (b - a) * S.E.emph(kit.clamp((t - mv.t) / M.climb));
      }
      return p;
    };
    const orderAt = (t) => [...rows].sort((a, b) => posOf(a.i, t) - posOf(b.i, t)).map((r) => r.i);

    // when the viewer's row switches on: 13 f after the card arrives, or 13 f before its first climb
    const activateAt = mineIdx < 0 ? Infinity : Math.max(tIn + F(4), Math.min(tIn + M.activate, moves.length ? moves[0].t - M.climbLead : Infinity));

    // ---- strikes
    const strikeRow = (row, t0) => {
      const len = row.nameW + G.strike.over[0] + G.strike.over[1];
      const ns = 'http://www.w3.org/2000/svg';
      const hgt = G.strike.mid + 4;
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('width', len); svg.setAttribute('height', hgt); svg.setAttribute('viewBox', `0 0 ${len} ${hgt}`);
      Object.assign(svg.style, { position: 'absolute', left: `${row.nameX - G.strike.over[0]}px`, top: `${row.cy + G.strike.dy - hgt / 2}px`, overflow: 'visible', transform: `rotate(${-G.strike.rise}deg)`, transformOrigin: '50% 50%', pointerEvents: 'none' });
      const c = hgt / 2, m = G.strike.mid / 2, e = G.strike.end / 2;
      const d = `M${e} ${c - e} C${len * 0.3} ${c - m} ${len * 0.7} ${c - m} ${len - e} ${c - e} A${e} ${e} 0 0 1 ${len - e} ${c + e} C${len * 0.7} ${c + m} ${len * 0.3} ${c + m} ${e} ${c + e} A${e} ${e} 0 0 1 ${e} ${c - e}Z`;
      const id = `ep-rk-${S.uid()}`;
      svg.innerHTML = `<defs><clipPath id="${id}"><rect x="-2" y="-20" width="0" height="${hgt + 40}"/></clipPath></defs><path d="${d}" fill="${C.red}" clip-path="url(#${id})"/>`;
      row.wrap.append(svg);
      row.strikes.push({ t0, svg, clip: svg.querySelector('rect'), len });
      row.struckAt = Math.min(row.struckAt, t0 + M.strike.cap + F(0.5));
      row.dimAt = Math.min(row.dimAt, t0 - M.dim.dur);
      S.sfx(t0, 'strike');
    };
    for (const b of sorted) {
      if (b.do === 'strike') {
        const row = rows[b.row - 1];
        if (!row) { S.warn(`rank-list: strike row ${b.row} does not exist`); continue; }
        strikeRow(row, b.t);
      } else if (b.do === 'strike-others') {
        const ord = orderAt(b.t);
        const others = mineIdx >= 0 ? ord.filter((i) => i !== mineIdx) : ord.slice(1);
        others.forEach((i, j) => { rows[i].dimAt = Math.min(rows[i].dimAt, b.t); strikeRow(rows[i], b.t + M.strike.lead + j * M.strike.stagger); });
      }
    }
    const approach = (t, t0) => (t <= t0 ? 0 : Math.min(1, (1 - Math.exp(-(t - t0) / M.strike.tau)) / (1 - Math.exp(-M.strike.cap / M.strike.tau))));

    return {
      el: card.el, tone: 'light',
      seek(t) {
        card.seek(t);
        for (const row of rows) {
          const pos = posOf(row.i, t);
          // lift of the climbing row: up in 4 f, down over 17 f, a shadow under it while it is up
          let lift = 0, shade = 0;
          if (row.mine) for (const mv of moves) {
            if (t < mv.t) continue;
            const up = smooth(kit.clamp((t - mv.t - M.lift.riseAt) / M.lift.rise));
            const down = 1 - kit.clamp((t - mv.t - M.lift.fallAt) / M.lift.fall);
            lift = Math.max(lift, up * Math.pow(down, M.lift.pow));
            shade = Math.max(shade, up * (1 - kit.clamp((t - mv.t - M.shadow.fallAt) / M.shadow.fall)));
          }
          const sc = 1 + M.lift.peak * lift;
          row.wrap.style.transform = `translateY(${yOf(pos).toFixed(2)}px)${lift > 0.0005 ? ` scale(${sc.toFixed(5)})` : ''}`;
          if (row.boxActive) row.boxActive.style.boxShadow = shade > 0.002 ? `0 ${M.shadow.y}px ${M.shadow.blur}px rgba(0,0,0,${(M.shadow.alpha * shade).toFixed(3)})` : 'none';
          // the number follows the slot the row is nearest to
          const shown = String(Math.round(pos) + 1);
          if (row.num.textContent !== shown) row.num.textContent = shown;
          // the viewer's row switching on
          if (row.mine) {
            const sw = kit.clamp((t - activateAt) / M.switch);
            const fl = kit.prog(t, activateAt - F(1), M.fill, kit.ease.outCubic);
            row.boxActive.style.opacity = String(fl);
            row.boxMuted.style.opacity = String(1 - fl);
            row.name.style.color = sw <= 0 ? G.mutedName : sw >= 1 ? C.ink : mix(G.mutedName, C.ink, sw);
            row.num.style.color = sw <= 0 ? G.number.colour : sw >= 1 ? C.accent : mix(G.number.colour, C.accent, sw);
            row.disc.style.background = sw <= 0 ? G.disc.fill : sw >= 1 ? C.accent : mix(G.disc.fill, C.accent, sw);
            row.letter.style.color = sw <= 0 ? G.disc.letter : sw >= 1 ? '#FFFFFF' : mix(G.disc.letter, '#FFFFFF', sw);
          }
          // dim, strike, fade the struck name
          const dim = 1 - (1 - M.dim.to) * smooth(kit.clamp((t - row.dimAt) / M.dim.dur));
          row.content.style.opacity = dim >= 0.999 ? '' : dim.toFixed(4);
          const fade = kit.clamp((t - row.struckAt) / M.strike.fade);
          row.name.style.opacity = fade > 0 ? String(1 - (1 - M.strike.struck / M.dim.to) * fade) : '';
          for (const s of row.strikes) {
            const p = approach(t, s.t0);
            s.svg.style.display = p > 0 ? '' : 'none';
            if (p > 0) s.clip.setAttribute('width', ((s.len + 4) * p).toFixed(2));
          }
        }
      },
    };
  },
};
