// A table that fills in as it is talked through: a dark card with its title on the cobalt bar, a grid of white
// rules, row headers in the left column, and each cell typed in on the word that says it
// (research/graphics.md G07 'TXT/MTX' units; seen in the newest reels). Cell text is the speaker's own words.
import { CX, colour, fonts, layout } from '../tokens.js';
import { ENTER, CAMERA_BEATS, centred, entrance, riseIn, setStyle } from '../common.js';
import { measureText } from '../text.js';

// TOKENS (measured by eye on the reference table: card ~820 wide, row ~100 px, header column ~280 px, 2 px rules)
const G = {
  w: 820, pad: 26, titleH: 64, rowH: 96, headW: 290, radius: 10, rule: 'rgba(255,255,255,0.82)', ruleW: 2,
  fill: 'linear-gradient(180deg, #161617 0%, #0B0B0C 100%)', frame: 'inset 0 0 0 1.5px rgba(255,255,255,0.18)', outer: '0 16px 40px rgba(0,0,0,0.55)',
  title: { size: 38 }, head: { size: 30 }, cell: { size: 30 }, type: 0.3,
};

export default {
  type: 'data-table',
  label: 'Table',
  slots: ['graphic'],
  hold: 'zoom',
  params: {
    title: { type: 'string', maxChars: 28, maxWords: 5 },
    rows: { type: 'array', min: 1, max: 6, of: {
      head: { type: 'string', maxChars: 18, maxWords: 3 },
      cell: { type: 'string', optional: true, maxChars: 30, maxWords: 6 },
      at: 'word?',
    } },
    blank: { type: 'number', optional: true, min: 0, max: 4 },     // empty rows still to come
    ...ENTER,
  },
  beats: { ...CAMERA_BEATS },

  build(ctx) {
    const { S, params: p, tIn } = ctx; const { kit } = S; const { h } = kit;
    const n = p.rows.length + (p.blank || 0);
    const hh = G.pad * 2 + G.titleH + 16 + n * G.rowH;
    const box = centred(G.w, hh);
    const root = h('div.nc-table', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${G.w}px`, height: `${hh}px`, borderRadius: `${G.radius}px`, background: G.fill, boxShadow: `${G.frame}, ${G.outer}`, willChange: 'transform, opacity' } });
    // the title on the cobalt bar, centred
    const tw = measureText(p.title, `800 ${G.title.size}px ${fonts.sans}`, -0.03);
    root.append(h('div', { style: { position: 'absolute', left: `${(G.w - tw) / 2 - 12}px`, top: `${G.pad}px`, width: `${tw + 24}px`, height: `${G.titleH - 10}px`, background: colour.cobalt } }),
      h('div', { text: p.title, style: { position: 'absolute', left: '0', width: '100%', textAlign: 'center', top: `${G.pad + (G.titleH - 10 - G.title.size) / 2 + 2}px`, font: `800 ${G.title.size}px/1 ${fonts.sans}`, letterSpacing: '-0.03em', color: '#FFFFFF' } }));
    const gx = G.pad, gy = G.pad + G.titleH + 16, gw = G.w - G.pad * 2, gh = n * G.rowH;
    const rule = (x, y, w, hgt) => h('div', { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${hgt}px`, background: G.rule } });
    for (let i = 0; i <= n; i++) root.append(rule(gx, gy + i * G.rowH - G.ruleW / 2, gw, G.ruleW));
    root.append(rule(gx - G.ruleW / 2, gy, G.ruleW, gh), rule(gx + G.headW, gy, G.ruleW, gh), rule(gx + gw - G.ruleW / 2, gy, G.ruleW, gh));
    const times = p.rows.map((r, k) => (r.at !== undefined ? Math.max(tIn, S.wordTime(r.at)) : tIn + 0.3 + k * 0.5));
    const cells = p.rows.map((r, k) => {
      const y = gy + k * G.rowH + (G.rowH - G.head.size) / 2;
      const head = h('div', { text: r.head, style: { position: 'absolute', left: `${gx + 18}px`, top: `${y}px`, font: `800 ${G.head.size}px/1 ${fonts.sans}`, letterSpacing: '-0.015em', color: '#FFFFFF', whiteSpace: 'nowrap', display: 'none' } });
      const cell = h('div', { text: '', style: { position: 'absolute', left: `${gx + G.headW + 22}px`, top: `${y}px`, font: `700 ${G.cell.size}px/1 ${fonts.sans}`, color: '#FFFFFF', whiteSpace: 'pre' } });
      root.append(head, cell);
      return { head, cell, text: r.cell || '', t: times[k] };
    });
    const { t0, settled } = entrance(ctx);
    return {
      el: root, ticks: times.filter((t) => t > tIn + 0.05), box,
      seek(t) {
        const e = riseIn(S, t, t0, settled);
        setStyle(root, 'transform', e.dy > 0.05 ? `translateY(${e.dy.toFixed(2)}px)` : 'none');
        setStyle(root, 'opacity', String(e.o));
        for (const c of cells) {
          const early = settled && c.t <= tIn;
          const on = early || t >= c.t;
          setStyle(c.head, 'display', on ? '' : 'none');
          const k = early ? c.text.length : on ? Math.ceil(c.text.length * kit.clamp((t - c.t) / G.type)) : 0;
          const txt = c.text.slice(0, k);
          if (c.cell.textContent !== txt) c.cell.textContent = txt;
        }
      },
    };
  },
};
