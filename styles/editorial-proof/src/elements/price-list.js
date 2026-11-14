// A designed price list: what the viewer is paying now. Rows land one by one, each price
// can be struck with the red marker as it is said, and a total tile can land on top.
import { cardFrame } from '../card.js';
import { strike, numberTile } from '../marks.js';
import { fonts, motion, F } from '../tokens.js';

export default {
  type: 'price-list',
  label: 'Price list',
  slots: ['card'],
  params: {
    rows: { type: 'array', min: 2, max: 6, of: {
      name: { type: 'string', maxChars: 18 },
      plan: { type: 'string', optional: true, maxChars: 14 },
      price: { type: 'string', maxChars: 8 },
      per: { type: 'string', optional: true, maxChars: 6 },
      logo: 'asset?',
      blur: 'boolean?',                 // tease: keep the name unreadable until later
      at: 'word?',                      // the word on which this row lands (default: one after another from the start)
    } },
  },
  beats: {
    strike: { row: { type: 'number', optional: true, min: 1, max: 6 } },          // omit row to strike every price in order
    total: { value: { type: 'string', maxChars: 9 }, label: { type: 'string', optional: true, maxChars: 18, maxWords: 3 } },
    reveal: { row: { type: 'number', min: 1, max: 6 } },                          // un-blur a teased name
  },

  prefer(params) { return { h: Math.round(50 + params.rows.length * 87) }; },

  build(ctx) {
    const { S, params, rect, mode, tIn, beats } = ctx; const { kit, C } = S; const { h } = kit;
    const card = cardFrame(S, { w: rect.w, h: rect.h, mode, tIn });
    const n = params.rows.length;
    const pitch = Math.min(96, (rect.h - 44) / n);
    const top = (rect.h - pitch * n) / 2;
    const rows = params.rows.map((r, k) => {
      const y = top + k * pitch;
      const icon = h('div', { style: { position: 'absolute', left: '34px', top: `${y + (pitch - 62) / 2}px`, width: '62px', height: '62px', borderRadius: '15px', overflow: 'hidden', background: r.logo ? '#fff' : S.tint(r.name), display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 30px/1 ${fonts.sans}`, color: '#fff' } },
        r.logo ? h('img', { src: S.env.projectUrl(r.logo), style: { width: '100%', height: '100%', objectFit: 'contain' } }) : h('span', { text: (r.name.trim()[0] || '?').toUpperCase() }));
      const name = h('div', { style: { position: 'absolute', left: '120px', top: `${y}px`, height: `${pitch}px`, display: 'flex', alignItems: 'center', gap: '14px', whiteSpace: 'nowrap', color: C.ink } },
        h('span', { text: r.name, style: { font: `700 36px/1 ${fonts.sans}`, letterSpacing: '-0.02em' } }),
        r.plan ? h('span', { text: r.plan, style: { font: `500 26px/1 ${fonts.sans}`, color: '#8E8E8E' } }) : null);
      const priceText = h('span', { text: r.price, style: { font: `700 44px/1 ${fonts.sans}`, letterSpacing: '-0.02em', color: C.ink } });
      const price = h('div', { style: { position: 'absolute', right: '30px', top: `${y}px`, height: `${pitch}px`, display: 'flex', alignItems: 'baseline', gap: '4px', paddingTop: `${(pitch - 44) / 2}px`, boxSizing: 'border-box', whiteSpace: 'nowrap' } },
        priceText, r.per ? h('span', { text: r.per, style: { font: `500 26px/1 ${fonts.sans}`, color: '#8E8E8E' } }) : null);
      const line = k < n - 1 ? h('div', { style: { position: 'absolute', left: '34px', right: '30px', top: `${y + pitch}px`, height: '1px', background: '#E9ECEF' } }) : null;
      const group = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${rect.w}px`, height: `${rect.h}px` } }, icon, name, price, line);
      card.body.append(group);
      const at = r.at !== undefined ? S.wordTime(r.at) : tIn + motion.rows.start + k * motion.rows.stagger;
      return { r, group, name, icon, price, priceText, at, y, blurUntil: r.blur ? Infinity : -1 };
    });

    const strikes = [];
    let tile = null;
    const sBeats = beats.filter((b) => b.do === 'strike');
    for (const b of beats) {
      if (b.do === 'reveal' && rows[b.row - 1]) rows[b.row - 1].blurUntil = b.t;
      if (b.do === 'total') { tile = numberTile(S, { value: b.value, label: b.label, cx: rect.w / 2, cy: rect.h / 2, t0: b.t, hold: Infinity, maxW: rect.w - 160 }); card.overlay.append(tile.el); S.sfx(b.t, 'number'); S.sfx(tile.landed, 'numberLand'); }
    }
    const addStrike = (row, t0) => {
      // geometry from measured text, so it does not depend on what is currently displayed
      const priceW = kit.measure(row.r.price, `700 44px ${fonts.sans}`, -0.02 * 44);
      const perW = row.r.per ? kit.measure(row.r.per, `500 26px ${fonts.sans}`) + 4 : 0;
      const mark = strike(S, { rect: { x: rect.w - 30 - perW - priceW, y: row.y + (pitch - 44) / 2 + 2, w: priceW, h: 40 }, t0 });
      card.body.append(mark.el);
      strikes.push({ row, t0, mark });
      S.sfx(t0, 'strike');
    };
    sBeats.forEach((b) => {
      if (b.row) { if (rows[b.row - 1]) addStrike(rows[b.row - 1], b.t); }
      else rows.forEach((row, k) => addStrike(row, b.t + k * motion.strike.rowStagger));
    });

    return {
      el: card.el,
      seek(t) {
        card.seek(t);
        for (const row of rows) {
          const p = kit.prog(t, row.at, motion.rows.fade, kit.ease.outCubic);
          row.group.style.display = t >= row.at ? '' : 'none';
          row.group.style.opacity = String(p);
          row.group.style.transform = `translateY(${(1 - p) * 10}px)`;
          const blurred = t < row.blurUntil;
          const bp = Number.isFinite(row.blurUntil) ? 1 - kit.prog(t, row.blurUntil, F(6), kit.ease.outCubic) : 1;
          row.name.style.filter = blurred || bp > 0 ? `blur(${(9 * (blurred ? 1 : bp)).toFixed(1)}px)` : 'none';
          row.icon.style.filter = row.name.style.filter === 'none' ? 'none' : `blur(${(3 * (blurred ? 1 : bp)).toFixed(1)}px)`;
        }
        for (const s of strikes) s.mark.seek(t);
        if (tile) tile.seek(t);
      },
    };
  },
};
