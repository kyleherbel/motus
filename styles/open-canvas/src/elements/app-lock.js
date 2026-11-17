// A built object for a limit or rule: "block it from banking and wallet" (research/explain.md X08). A phone
// outline with nine generic app tiles; on each `lock` beat the tap dot visits a tile, the tile turns into a
// padlock and takes a highlight box. The tiles are original glyphs, not any product's icons.
import { fonts, motion } from '../tokens.js';
import { setStyle, tw, full } from '../common.js';
import { highlight, tapDot } from '../parts.js';

const TILES = [
  ['Messages', '#34C759'], ['Maps', '#5AC8FA'], ['Photos', '#FF9F0A'],
  ['Mail', '#2F7BFF'], ['Notes', '#FFD60A'], ['Chat', '#B14FD8'],
  ['Music', '#FF375F'], ['Bank', '#30B0C7'], ['Wallet', '#1C1C1E'],
];
const ICON = {
  Messages: '<path d="M4 5h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-5 4v-4H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="#fff"/>',
  Maps: '<path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="#fff"/>',
  Photos: '<g fill="#fff"><circle cx="12" cy="6" r="3.4"/><circle cx="12" cy="18" r="3.4"/><circle cx="6" cy="12" r="3.4"/><circle cx="18" cy="12" r="3.4"/></g>',
  Mail: '<path d="M2 6h20v12H2z M2 6l10 7 10-7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>',
  Notes: '<path d="M5 6h14M5 12h14M5 18h9" stroke="#222" stroke-width="2.6" stroke-linecap="round"/>',
  Chat: '<path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>',
  Music: '<path d="M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>',
  Bank: '<path d="M2 9l10-6 10 6v2H2zM5 12v7M10 12v7M14 12v7M19 12v7M2 21h20" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>',
  Wallet: '<path d="M3 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3zM3 6V5a1 1 0 0 1 1-1h13M16 13h2" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>',
};
const LOCK = '<svg width="70" height="78" viewBox="0 0 24 27"><rect x="3" y="11" width="18" height="14" rx="3" fill="#fff"/><path d="M7 11V7.5a5 5 0 0 1 10 0V11" fill="none" stroke="#fff" stroke-width="3"/></svg>';
const P = { x: 215, y: 150, w: 650, h: 1010 };       // by eye: the phone body
const cell = (i) => ({ x: P.x + 62 + (i % 3) * 190, y: P.y + 150 + Math.floor(i / 3) * 250 });

export default {
  type: 'app-lock',
  label: 'Apps locked',
  slots: ['object'],
  params: {},
  beats: { lock: { app: `enum:${TILES.map((t) => t[0]).join('|')}` } },
  build(ctx) {
    const { S, beats, tIn } = ctx;
    const { h } = S.kit;
    const T = S.theme, M = motion.tap;
    const locks = beats.filter((b) => b.do === 'lock').map((b) => ({ t: b.t, i: TILES.findIndex((x) => x[0] === b.app) })).filter((l) => l.i >= 0);
    if (!locks.length) S.warn('app-lock: no lock beats; the object would sit dead [S06]');
    const el = h('div.oc-applock', { style: full({}) },
      h('div', { style: { position: 'absolute', left: `${P.x}px`, top: `${P.y}px`, width: `${P.w}px`, height: `${P.h}px`, borderRadius: '86px', border: '6px solid #fff', background: `linear-gradient(#1b1b1e, ${T.dark})`, boxSizing: 'border-box', boxShadow: '0 24px 60px rgba(0,0,0,.4)' } }),
      h('div', { style: { position: 'absolute', left: `${P.x + P.w / 2 - 90}px`, top: `${P.y + 34}px`, width: '180px', height: '44px', borderRadius: '22px', background: '#000', border: '2px solid rgba(255,255,255,.25)', boxSizing: 'border-box' } }));
    const tiles = TILES.map(([name, col], i) => {
      const c = cell(i);
      const open = h('div', { html: `<svg width="84" height="84" viewBox="0 0 24 24">${ICON[name]}</svg>`, style: { position: 'absolute', inset: '0', borderRadius: '34px', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center' } });
      const shut = h('div', { html: LOCK, style: { position: 'absolute', inset: '0', borderRadius: '34px', background: '#15161A', border: '3px solid rgba(255,255,255,.3)', boxSizing: 'border-box', display: 'none', alignItems: 'center', justifyContent: 'center' } });
      const label = h('div', { text: name, style: { position: 'absolute', left: `${c.x - 20}px`, top: `${c.y + 154}px`, width: '186px', textAlign: 'center', fontFamily: fonts.sans, fontWeight: '700', fontSize: '28px', color: '#fff' } });
      el.append(h('div', { style: { position: 'absolute', left: `${c.x}px`, top: `${c.y}px`, width: '146px', height: '146px' } }, open, shut), label);
      const lock = locks.find((l) => l.i === i);
      let hl = null;
      if (lock) { hl = highlight(S); el.append(hl.el); }
      return { c, open, shut, label, lock, hl };
    });
    const dot = tapDot(S);
    el.append(dot.el);
    return {
      el,
      seek(t) {
        for (const tile of tiles) {
          const locked = !!tile.lock && t >= tile.lock.t;
          setStyle(tile.open, 'display', locked ? 'none' : 'flex');
          setStyle(tile.shut, 'display', locked ? 'flex' : 'none');
          setStyle(tile.label, 'opacity', locked ? '0.55' : '0.95');
          if (tile.hl) tile.hl.place(tile.c.x - 14, tile.c.y - 14, 174, 214, locked ? Math.max(0.001, tw(t, tile.lock.t, motion.box, 0, 1, S.E.out)) : 0);
        }
        if (!locks.length) return;
        let x = P.x + P.w - 80, y = P.y + P.h - 60, press = 0;
        for (const l of locks) {
          const c = cell(l.i);
          const p = tw(t, l.t - M.travel, M.travel, 0, 1, S.E.out);
          x += (c.x + 110 - x) * p; y += (c.y + 120 - y) * p;
          if (t >= l.t && t < l.t + M.press) press = 1 - (t - l.t) / M.press;
        }
        dot.place(x, y, press, M.shrink, t >= locks[0].t - M.travel - M.lead);
      },
    };
  },
};
