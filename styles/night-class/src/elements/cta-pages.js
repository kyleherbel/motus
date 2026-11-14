// What the call to action promises: a grid of white document pages under the comment title
// (research/graphics.md G18): pages about 216 x 282 px, three columns, 5-9 pages, square corners,
// optionally inside a rounded frosted panel. Pages show the user's own page images when supplied;
// otherwise plain placeholder pages (headings and grey lines), never invented content. It rises in.
import { colour } from '../tokens.js';
import { ENTER, CAMERA_BEATS, centred, entrance, riseIn, setStyle } from '../common.js';

// TOKENS (research/graphics.md G18)
const G = { page: { w: 216, h: 282 }, gap: 40, cols: 3, radius: 2, paper: '#FEFEFE', panel: { pad: 34, radius: 28, fill: 'rgba(255,255,255,0.10)', edge: 'rgba(255,255,255,0.22)' }, stagger: 0.06 };

export default {
  type: 'cta-pages',
  label: 'Document pages',
  slots: ['graphic'],
  hold: 'zoom',
  params: {
    count: { type: 'number', optional: true, min: 3, max: 9 },     // default 6
    pages: { type: 'array', optional: true, min: 1, max: 9, of: 'asset' },
    panel: 'boolean?',
    ...ENTER,
  },
  beats: { ...CAMERA_BEATS },

  build(ctx) {
    const { S, params: p, tIn } = ctx; const { kit } = S; const { h } = kit;
    const n = p.pages ? p.pages.length : (p.count || 6);
    const cols = Math.min(G.cols, n), rows = Math.ceil(n / cols);
    const gw = cols * G.page.w + (cols - 1) * G.gap, gh = rows * G.page.h + (rows - 1) * G.gap;
    const pad = p.panel ? G.panel.pad : 0;
    const box = centred(gw + pad * 2, gh + pad * 2);
    const root = h('div.nc-pages', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px`, willChange: 'transform, opacity' } });
    if (p.panel) root.append(h('div', { style: { position: 'absolute', inset: '0', borderRadius: `${G.panel.radius}px`, background: G.panel.fill, boxShadow: `inset 0 0 0 1.5px ${G.panel.edge}`, backdropFilter: 'blur(10px)' } }));
    const rnd = kit.seeded(n * 31 + 7);
    const pages = [];
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / cols), inRow = Math.min(cols, n - row * cols);
      const x = pad + (gw - (inRow * G.page.w + (inRow - 1) * G.gap)) / 2 + (i % cols) * (G.page.w + G.gap);
      const y = pad + row * (G.page.h + G.gap);
      const pg = h('div', { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${G.page.w}px`, height: `${G.page.h}px`, borderRadius: `${G.radius}px`, background: G.paper, overflow: 'hidden' } });
      if (p.pages) pg.append(h('img', { src: S.env.projectUrl(p.pages[i]), style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }));
      else {
        pg.append(h('div', { style: { position: 'absolute', left: '18px', top: '20px', width: '58%', height: '9px', background: '#3A3A3A' } }));
        for (let k = 0; k < 14; k++) pg.append(h('div', { style: { position: 'absolute', left: '18px', top: `${42 + k * 15}px`, width: `${Math.round(120 + rnd() * 60)}px`, height: '5px', background: '#C4C4C4' } }));
      }
      root.append(pg); pages.push(pg);
    }
    const { t0, settled } = entrance(ctx);
    return {
      el: root, ticks: [], box,
      seek(t) {
        const e = riseIn(S, t, t0, settled, 80);
        setStyle(root, 'transform', e.dy > 0.05 ? `translateY(${e.dy.toFixed(2)}px)` : 'none');
        setStyle(root, 'opacity', String(e.o));
      },
    };
  },
};
