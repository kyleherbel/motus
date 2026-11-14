// A designed process list: steps arrive in speech order, light up while they run, and get a
// check (or a thin red strike) as they are said. Built on the reference's designed process
// lists (MOCK_UI, 51 segments in 21 reels; graphics G08/G21/G26), measured frame by frame on
// clip21@1002-1137 (pipeline list: number -> check), with clip30@342-567 and @657-792
// (rows light up / circle checks), clip37@522-747 and clip34@747-807 (thin strikes),
// clip38@402-537 (lit row, then check):
//   heading    an optional dark pill at the top left; a tree line hangs from it to every row
//   rows       rounded grey tiles 105 px tall on a 128 px pitch; a white disc with the step number
//              (or an icon), a bold title and an optional mono sub-line
//   entrance   each row slides in from 40 px left while it fades up (80 % on its first frame),
//              decelerating (e-fold 2.4 frames); rows 4 frames apart unless anchored to their words
//   check      the disc turns into a filled accent circle with a white check at once; the tile
//              takes the accent tint and outline over 6 frames; the tree turns accent down to it
//   activate   (optional, before a check) the tile lights the same way and the disc shows a ring
//   strike     a 3 px #DB5A53 line through the title, drawn left to right
import { cardFrame } from '../card.js';
import { lineThrough } from '../marks.js';
import { fonts, type, F } from '../tokens.js';

// ---- TOKENS (card px, 894 wide), measured on clip21@1130 (card x 97-983 there).
const G = {
  pad: 25,                                   // pill at card + 25, 25 px from the top
  pill: { h: 83, padL: 28, icon: 44, gap: 16, size: 40, weight: 700, tracking: -0.03, fill: '#131313', text: '#FFFFFF', gapBelow: 32, max: 560 },
  tree: { x: 66, w: 4, grey: '#E5E5E5' },    // x 161-165 on the reference; stubs reach the tile at row centre
  tile: { left: 116, leftBare: 28, right: 26, h: 105, pitch: 128, radius: 16, border: 3, fill: '#F3F3F3' },   // x 213-957, y 757-862, pitch 128; lit: C.tint (colour CR07)
  disc: { d: 51, cx: 50, ring: '#E5E5E5', digit: '#86827C', digitSize: 26 },   // check circle 238-288; pending: white disc, grey digit 9x19 px
  title: { x: 98, size: 36, min: 24, weight: 700, tracking: -0.02, capTop: 26, ink: '#131419' },   // cap 783-809 on a tile at 757
  sub: { size: 21, baseline: 81, drop: 7, ink: '#7C7C7C' },            // mono, ink 823-843 (descender bottom 86 px under the tile top)
  chip: { h: 47, right: 25, padX: 20, size: 23, weight: 700, gap: 8 },   // "✓ QA PASS" 772-932 x 786-833: filled accent when done, outlined while running
  bottom: 26,
  minScale: 0.6,
};
const M = {
  stagger: F(4),                              // rows 4 frames apart (study default 5)
  first: F(8),                                // the first row after the card lands
  slide: { dx: -40, tau: F(2.4), cap: F(10), fade: F(1.25) },         // -26, -18, -12, -7, -5, -3, -2, -1 px on frames 1-8; 80 % opaque on frame 1
  tint: F(6),                                 // tile tint after a check (f1083-1089)
  tree: F(4),
  spin: 0.9,                                  // seconds per turn of the activity ring
};

// a small original icon set (24-unit stroke glyphs) for the discs
const ICON = {
  search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
  code: '<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M9 12h6M9 16h6"/>',
  chat: '<path d="M4 5h16v11H10l-4 3.5V16H4z"/>',
  bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>',
  mail: '<path d="M3.5 6h17v12h-17z"/><path d="M4 6.5l8 6 8-6"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1-4.2 4-6 7.5-6s6.5 1.8 7.5 6"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  chart: '<path d="M4 20V4M4 20h16M8.5 16v-5M13 16V8M17.5 16v-8"/>',
  upload: '<path d="M12 16V4M6.5 9.5L12 4l5.5 5.5M4 20h16"/>',
};
const svgIcon = (name, size, colour, w = 2.2) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${colour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" style="display:block">${ICON[name]}</svg>`;
const GRID = (size, tile, ink) => `<svg width="${size}" height="${size}" viewBox="0 0 44 44" style="display:block"><rect width="44" height="44" rx="9" fill="${tile}"/><g fill="${ink}"><rect x="8" y="8" width="11" height="11" rx="3"/><rect x="25" y="8" width="11" height="11" rx="3"/><rect x="8" y="25" width="11" height="11" rx="3"/><rect x="25" y="25" width="11" height="11" rx="3"/></g></svg>`;

const approach = (t, t0, tau, cap) => (t <= t0 ? 0 : Math.min(1, (1 - Math.exp(-(t - t0) / tau)) / (1 - Math.exp(-cap / tau))));

function geometry(params, h) {
  const n = params.rows.length;
  const head = params.title ? G.pad + G.pill.h + G.pill.gapBelow : G.pad;
  const natural = head + n * G.tile.pitch - (G.tile.pitch - G.tile.h) + G.bottom;
  const pitch = Math.min(G.tile.pitch, (h - head - G.bottom + (G.tile.pitch - G.tile.h)) / n);
  return { n, head, natural, pitch, s: Math.max(G.minScale, pitch / G.tile.pitch) };
}

export default {
  type: 'steps-card',
  label: 'Steps',
  slots: ['card'],
  params: {
    title: { type: 'string', optional: true, maxChars: 26, maxWords: 4 },      // the dark pill above the steps ("Agents Orchestrator")
    rows: { type: 'array', min: 2, max: 7, of: {
      text: { type: 'string', maxChars: 30 },                                // the step, set bold
      sub: { type: 'string', optional: true, maxChars: 36 },                 // a mono detail line under it
      marker: `enum?:number|none|${Object.keys(ICON).join('|')}`,            // the disc: the step number (default), an icon, or nothing
      at: 'word?',                                                           // the word on which this row arrives (default: one after another)
    } },
  },
  beats: {
    check: { row: { type: 'number', min: 1, max: 7 }, label: { type: 'string', optional: true, maxChars: 10, maxWords: 2 } },      // done: filled check, the tile lights; label adds a status chip ("QA PASS")
    activate: { row: { type: 'number', min: 1, max: 7 }, label: { type: 'string', optional: true, maxChars: 10, maxWords: 2 } },   // running: the tile lights, the disc shows a ring; label: "checking"
    strike: { row: { type: 'number', min: 1, max: 7 } },     // dropped: a thin red line through the step
  },

  prefer(params, { maxH }) { return { h: Math.min(maxH, Math.round(geometry(params, 9999).natural)) }; },

  build(ctx) {
    const { S, params, rect, mode, tIn, beats } = ctx; const { kit, C } = S; const { h } = kit;
    const W = rect.w, H = rect.h;
    const card = cardFrame(S, { w: W, h: H, mode, tIn });
    const root = card.body;
    const g = geometry(params, H);
    const s = g.s;
    const tileH = Math.min(G.tile.h, g.pitch - (G.tile.pitch - G.tile.h) * s);
    const tree = !!params.title;
    const subs = tileH >= 62;                       // a tile under 62 px has no room for the mono line
    if (!subs && params.rows.some((r) => r.sub)) S.warn('steps-card: too many rows for this card; the sub-lines are left out');
    const tl = tree ? G.tile.left : G.tile.leftBare;
    const tw = W - tl - G.tile.right;
    // centre the list when the card is taller than it needs
    const used = g.head + g.n * g.pitch - (g.pitch - tileH) + G.bottom;
    const y0 = g.head + Math.max(0, (H - used) / 2);

    // ---- heading pill
    let pill = null;
    if (params.title) {
      const font = (z) => `${G.pill.weight} ${z}px ${fonts.sans}`;
      const size = kit.fitSize(params.title, G.pill.max - G.pill.padL - G.pill.icon - G.pill.gap - 30, font, G.pill.size, 26, G.pill.tracking);
      const textW = kit.measure(params.title, font(size), G.pill.tracking * size);
      const pw = G.pill.padL + G.pill.icon + G.pill.gap + textW + 30;
      pill = h('div', { style: { position: 'absolute', left: `${G.pad}px`, top: `${G.pad}px`, width: `${pw}px`, height: `${G.pill.h}px`, borderRadius: `${G.pill.h / 2}px`, background: G.pill.fill } },
        h('div', { html: GRID(G.pill.icon, C.tint, C.iconInk), style: { position: 'absolute', left: `${G.pill.padL}px`, top: `${(G.pill.h - G.pill.icon) / 2}px`, lineHeight: '0' } }),
        h('div', { text: params.title, style: { position: 'absolute', left: `${G.pill.padL + G.pill.icon + G.pill.gap}px`, top: `${G.pill.h / 2 + (size * type.capRatio.sans) / 2 - size * type.ascent.sans}px`, font: `${font(size)}`, lineHeight: '1', letterSpacing: `${G.pill.tracking}em`, color: G.pill.text, whiteSpace: 'nowrap' } }));
    }

    // ---- tree
    const treeX = G.tree.x - G.tree.w / 2;
    const treeTop = G.pad + G.pill.h;
    const greyLine = tree ? h('div', { style: { position: 'absolute', left: `${treeX}px`, top: `${treeTop}px`, width: `${G.tree.w}px`, height: '0', background: G.tree.grey } }) : null;
    const accentLine = tree ? h('div', { style: { position: 'absolute', left: `${treeX}px`, top: '0', width: `${G.tree.w}px`, height: '0', background: C.accent, display: 'none' } }) : null;
    if (tree) root.append(greyLine, accentLine);
    if (pill) root.append(pill);

    // ---- rows
    const D = G.disc.d * s;
    let prevAt = tIn;
    const rows = params.rows.map((r, k) => {
      const y = y0 + k * g.pitch;
      const cy = y + tileH / 2;
      // in order: a row never arrives before the one above it (4 frames after it at the earliest)
      const want = r.at !== undefined ? S.wordTime(r.at) : (k ? prevAt + M.stagger : tIn + M.first);
      const at = k ? Math.max(want, prevAt + M.stagger) : want;
      prevAt = at;
      const tile = h('div', { style: { position: 'absolute', left: `${tl}px`, top: `${y}px`, width: `${tw}px`, height: `${tileH}px`, boxSizing: 'border-box', borderRadius: `${G.tile.radius * s}px`, background: G.tile.fill, border: `${G.tile.border}px solid ${G.tile.fill}` } });
      const stub = tree ? h('div', { style: { position: 'absolute', left: `${treeX}px`, top: `${cy - G.tree.w / 2}px`, width: `${tl - treeX}px`, height: `${G.tree.w}px`, background: G.tree.grey } }) : null;
      // disc: white with the number / icon; on check a filled accent circle with a white check
      const marker = r.marker || 'number';
      const disc = h('div', { style: { position: 'absolute', left: `${tl + G.disc.cx * s - D / 2}px`, top: `${cy - D / 2}px`, width: `${D}px`, height: `${D}px`, borderRadius: '50%', boxSizing: 'border-box', background: '#FFFFFF', border: `1.5px solid ${G.disc.ring}`, display: marker === 'none' ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: G.disc.digit, font: `600 ${G.disc.digitSize * s}px/1 ${fonts.sans}` } });
      if (marker === 'number') disc.textContent = String(k + 1);
      else if (ICON[marker]) disc.innerHTML = svgIcon(marker, D * 0.5, G.disc.digit);
      const doneX = marker === 'none' ? tl + tw - 24 * s - D : tl + G.disc.cx * s - D / 2;   // no marker: the check lands at the right end
      const done = h('div', { html: `<svg width="${D}" height="${D}" viewBox="0 0 52 52" style="display:block"><circle cx="26" cy="26" r="26" fill="${C.accent}"/><path d="M15.5 26.5l7 7 14-14.5" fill="none" stroke="#FFFFFF" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`, style: { position: 'absolute', left: `${doneX}px`, top: `${cy - D / 2}px`, lineHeight: '0', display: 'none' } });
      const ring = h('div', { html: `<svg width="${D}" height="${D}" viewBox="0 0 52 52" style="display:block"><circle cx="26" cy="26" r="23" fill="#FFFFFF" stroke="${C.accent}" stroke-opacity="0.25" stroke-width="4"/><path d="M26 3a23 23 0 0 1 23 23" fill="none" stroke="${C.accent}" stroke-width="4" stroke-linecap="round"/></svg>`, style: { position: 'absolute', left: `${tl + G.disc.cx * s - D / 2}px`, top: `${cy - D / 2}px`, lineHeight: '0', display: 'none', transformOrigin: '50% 50%' } });
      const crossD = D;
      const cross = h('div', { html: `<svg width="${crossD}" height="${crossD}" viewBox="0 0 52 52" style="display:block"><circle cx="26" cy="26" r="24.5" fill="#FFFFFF" stroke="#F1C9C6" stroke-width="1.5"/><path d="M18 18l16 16M34 18L18 34" fill="none" stroke="${C.redText}" stroke-width="4.2" stroke-linecap="round"/></svg>`, style: { position: 'absolute', left: `${tl + G.disc.cx * s - D / 2}px`, top: `${cy - D / 2}px`, lineHeight: '0', display: 'none' } });
      // text
      const tx = tl + (marker === 'none' ? 30 : G.title.x * s);
      const font = (z) => `${G.title.weight} ${z}px ${fonts.sans}`;
      const size = kit.fitSize(r.text, tw - (tx - tl) - 24, font, G.title.size * s, G.title.min * s, G.title.tracking);
      const capH = size * type.capRatio.sans;
      const subSize = G.sub.size * s;
      const sub_ = subs ? r.sub : null;
      const block = sub_ ? (G.sub.baseline - G.title.capTop) * s + 4 : capH;           // cap top -> sub baseline
      const capTop = sub_ ? y + (tileH - block) / 2 - 1 : cy - capH / 2;
      const title = h('div', { text: r.text, style: { position: 'absolute', left: `${tx}px`, top: `${capTop + capH - size * type.ascent.sans}px`, font: font(size), lineHeight: '1', letterSpacing: `${G.title.tracking}em`, color: G.title.ink, whiteSpace: 'nowrap' } });
      const sub = sub_ ? h('div', { text: sub_, style: { position: 'absolute', left: `${tx}px`, top: `${capTop + (G.sub.baseline + G.sub.drop - G.title.capTop) * s - subSize * 0.86}px`, font: `400 ${subSize}px/1 ${fonts.mono}`, color: G.sub.ink, whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: `${tw - (tx - tl) - 20}px` } }) : null;
      const group = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px` } }, tile, disc, ring, done, cross, title, sub);
      if (stub) root.append(stub);
      root.append(group);
      const textW = kit.measure(r.text, font(size), G.title.tracking * size);
      return { r, k, y, cy, at, tile, stub, disc, ring, done, cross, title, group, textRect: { x: tx, y: capTop - capH * 0.02, w: textW, h: capH }, check: null, act: null, strike: null, checkLabel: null, actLabel: null };
    });

    // ---- beats
    for (const b of beats) {
      const row = rows[b.row - 1];
      if (!row) continue;
      const t0 = Math.max(b.t, row.at + F(3));
      if (b.do === 'check') { row.check = t0; row.checkLabel = b.label || null; S.sfx(t0, 'check'); }
      if (b.do === 'activate') { row.act = t0; row.actLabel = b.label || null; }
      if (b.do === 'strike') {
        row.strike = t0;
        // the 0-degree typographic strike, 3 px, through the middle of the x-height
        row.line = lineThrough(S, { rect: { x: row.textRect.x, y: row.textRect.y + row.textRect.h * 0.08, w: row.textRect.w, h: row.textRect.h }, t0 });
        row.line.el.style.height = '3px';
        row.group.append(row.line.el);
        S.sfx(t0, 'strike');
      }
    }
    // status chips at the right end of the tile
    const chipFont = (z) => `${G.chip.weight} ${z}px ${fonts.sans}`;
    const makeChip = (row, label, filled) => {
      const z = G.chip.size * s, ch = G.chip.h * s;
      const tw2 = kit.measure(label, chipFont(z), -0.02 * z);
      const iw = filled ? z * 0.8 + G.chip.gap * s : z * 0.42 + G.chip.gap * s;
      const w = tw2 + iw + 2 * G.chip.padX * s;
      const el = h('div', { style: { position: 'absolute', left: `${tl + tw - G.chip.right * s - w}px`, top: `${row.cy - ch / 2}px`, width: `${w}px`, height: `${ch}px`, boxSizing: 'border-box', borderRadius: `${ch / 2}px`, background: filled ? C.accent : '#FFFFFF', border: filled ? 'none' : `2px solid ${C.accent}`, display: 'none', alignItems: 'center', justifyContent: 'center', gap: `${G.chip.gap * s}px`, font: chipFont(z), letterSpacing: '-0.02em', color: filled ? C.onAccent : C.accent, whiteSpace: 'nowrap' } },
        h('span', { html: filled ? `<svg width="${z * 0.8}" height="${z * 0.8}" viewBox="0 0 20 20" style="display:block"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>` : `<svg width="${z * 0.42}" height="${z * 0.42}" viewBox="0 0 10 10" style="display:block"><circle cx="5" cy="5" r="5" fill="currentColor"/></svg>`, style: { lineHeight: '0' } }),
        h('span', { text: label }));
      row.group.append(el);
      return el;
    };
    for (const row of rows) {
      if (row.checkLabel && row.check !== null) row.doneChip = makeChip(row, row.checkLabel, true);
      if (row.actLabel && row.act !== null) row.actChip = makeChip(row, row.actLabel, false);
    }
    const checkedAt = rows.map((r) => r.check).filter((x) => x !== null);
    // the lit tile: 12 % of the accent over white (colour CR07)
    const litFill = C.tint;

    return {
      el: card.el,
      seek(t) {
        card.seek(t);
        let lastArrived = -1, lastChecked = -1;
        for (const row of rows) {
          const on = t >= row.at;
          row.group.style.display = on ? '' : 'none';
          if (row.stub) row.stub.style.display = on ? '' : 'none';
          if (!on) continue;
          lastArrived = row.k;
          const p = approach(t, row.at, M.slide.tau, M.slide.cap);
          const dx = M.slide.dx * (1 - p);
          row.group.style.opacity = String(kit.clamp((t - row.at) / M.slide.fade));
          row.group.style.transform = Math.abs(dx) < 0.05 ? 'none' : `translateX(${dx.toFixed(2)}px)`;
          if (row.stub) { row.stub.style.opacity = row.group.style.opacity; row.stub.style.transform = row.group.style.transform; }
          // states
          const checked = row.check !== null && t >= row.check;
          const active = !checked && row.act !== null && t >= row.act;
          const struck = row.strike !== null && t >= row.strike;
          if (checked) lastChecked = row.k;
          const litFrom = row.act !== null && row.act <= (row.check ?? Infinity) ? row.act : row.check;
          const lp = litFrom !== null && (checked || active) && !struck ? kit.prog(t, litFrom, M.tint, kit.ease.outCubic) : 0;
          const mix = (a, b2, q) => { const A = parseInt(a.slice(1), 16), B = parseInt(b2.slice(1), 16); const c = [16, 8, 0].map((sh) => Math.round(((A >> sh) & 255) * (1 - q) + ((B >> sh) & 255) * q)); return `rgb(${c.join(',')})`; };
          row.tile.style.background = mix(G.tile.fill, litFill, lp);
          row.tile.style.borderColor = lp > 0 ? mix(G.tile.fill, C.accent, lp) : G.tile.fill;
          const marker = row.r.marker || 'number';
          row.done.style.display = checked && !struck ? '' : 'none';
          row.cross.style.display = struck && marker !== 'none' ? '' : 'none';
          row.ring.style.display = active && !struck && marker !== 'none' ? '' : 'none';
          if (active) row.ring.style.transform = `rotate(${(((t - row.act) / M.spin) * 360 % 360).toFixed(1)}deg)`;
          row.disc.style.visibility = checked || struck || active ? 'hidden' : 'visible';
          if (row.doneChip) row.doneChip.style.display = checked && !struck ? 'flex' : 'none';
          if (row.actChip) row.actChip.style.display = active && !struck ? 'flex' : 'none';
          if (row.line) row.line.seek(t);
        }
        if (tree) {
          const last = rows[Math.max(0, lastArrived)];
          greyLine.style.height = `${Math.max(0, (lastArrived >= 0 ? last.cy : treeTop) - treeTop + G.tree.w / 2)}px`;
          // the accent part runs from the first row down to the latest check
          const firstC = rows[0].cy;
          let target = null;
          for (const row of rows) if (row.check !== null && t >= row.check) target = target === null ? row : (row.k > target.k ? row : target);
          if (target && checkedAt.length) {
            accentLine.style.display = '';
            // grow towards each newly checked row
            const prevRows = rows.filter((r) => r.check !== null && r.check < target.check && r.k < target.k);
            const from = prevRows.length ? Math.max(...prevRows.map((r) => r.cy)) : firstC;
            const q = kit.prog(t, target.check, M.tree, S.E.emph);
            const end = from + (target.cy - from) * q;
            accentLine.style.top = `${firstC - G.tree.w / 2}px`;
            accentLine.style.height = `${Math.max(G.tree.w, end - firstC + G.tree.w)}px`;
          } else accentLine.style.display = 'none';
          for (const row of rows) if (row.stub) row.stub.style.background = row.check !== null && t >= row.check ? C.accent : G.tree.grey;
        }
        void lastChecked;
      },
    };
  },
};
