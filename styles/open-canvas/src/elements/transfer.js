// A built object for "one screen put onto another" (research/explain.md X07). A phone and a laptop drawn as
// outlines; on `select` the phone's screen takes a selection frame, on `drop` the cursor drags a copy of it into
// the laptop over 14 frames. The screen picture is the project's own asset; without one the screens stay plain.
import { fonts, motion, F } from '../tokens.js';
import { setStyle, tw, full } from '../common.js';
import { selFrame, cursor } from '../parts.js';

const PH = { x: 86, y: 250, w: 330, h: 716 };        // by eye: a 9:19.5 phone at the left
const LAP = { x: 500, y: 520, w: 490, h: 330 };      // by eye: a laptop screen at the right
const DROP = F(14);                                  // [X07]

export default {
  type: 'transfer',
  label: 'Screen onto screen',
  slots: ['object'],
  params: {
    img: 'asset?',                                                 // what the small screen shows (a real capture)
    from: { type: 'string', optional: true, maxChars: 10 },        // label under the phone, default "Phone"
    to: { type: 'string', optional: true, maxChars: 10 },          // label under the laptop, default "Laptop"
  },
  beats: { select: {}, drop: {} },
  async prepare(params, S) {
    if (!params.img) return null;
    try { const img = new Image(); img.src = S.env.projectUrl(params.img); await img.decode(); return img.src; } catch { S.warn(`transfer: could not load ${params.img}`); return null; }
  },
  build(ctx) {
    const { S, params, beats, tIn, data } = ctx;
    const { h } = S.kit;
    const T = S.theme;
    const tSel = beats.find((b) => b.do === 'select')?.t ?? tIn + F(12);
    const tDrop = beats.find((b) => b.do === 'drop')?.t ?? tSel + F(24);
    const pic = (style) => (data ? h('img', { src: data, style: { objectFit: 'cover', ...style } }) : h('div', { style: { background: `linear-gradient(160deg, ${T.top}, ${T.low})`, ...style } }));
    const label = (text, x, y, w) => h('div', { text, style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${w}px`, textAlign: 'center', fontFamily: fonts.mono, fontSize: '30px', color: '#fff', opacity: '0.8' } });
    const outline = { border: '5px solid #fff', boxSizing: 'border-box' };
    const el = h('div.oc-transfer', { style: full({}) },
      h('div', { style: { position: 'absolute', left: `${LAP.x - 14}px`, top: `${LAP.y - 14}px`, width: `${LAP.w + 28}px`, height: `${LAP.h + 28}px`, borderRadius: '22px', background: T.dark, ...outline } }),
      h('div', { style: { position: 'absolute', left: `${LAP.x - 44}px`, top: `${LAP.y + LAP.h + 14}px`, width: `${LAP.w + 88}px`, height: '26px', borderRadius: '4px 4px 22px 22px', background: T.dark, ...outline } }),
      label(params.to || 'Laptop', LAP.x, LAP.y + LAP.h + 62, LAP.w),
      h('div', { style: { position: 'absolute', left: `${PH.x - 16}px`, top: `${PH.y - 16}px`, width: `${PH.w + 32}px`, height: `${PH.h + 32}px`, borderRadius: '58px', background: '#000', boxShadow: '0 20px 50px rgba(0,0,0,.35)', ...outline } }),
      pic({ position: 'absolute', left: `${PH.x}px`, top: `${PH.y}px`, width: `${PH.w}px`, height: `${PH.h}px`, borderRadius: '42px' }),
      label(params.from || 'Phone', PH.x, PH.y + PH.h + 40, PH.w));
    const frame = selFrame(S, { mids: false });
    frame.body.append(pic({ position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' }));
    const cur = cursor(S);
    const moving = h('div', { style: full({ display: 'none' }) }, frame.el, cur.el);
    el.append(moving);
    const dst = { h: 290, w: (290 * PH.w) / PH.h };
    return {
      el,
      seek(t) {
        setStyle(moving, 'display', t >= tSel ? '' : 'none');
        if (t < tSel) return;
        const p = tw(t, tDrop - DROP, DROP, 0, 1, S.E.move);
        const x = PH.x + (LAP.x + (LAP.w - dst.w) / 2 - PH.x) * p, y = PH.y + (LAP.y + 20 - PH.y) * p;
        const w = PH.w + (dst.w - PH.w) * p, hh = PH.h + (dst.h - PH.h) * p;
        frame.place(x, y, w, hh, false);
        cur.at(x + w - 6, y + hh - 8);
        setStyle(moving, 'opacity', tw(t, tSel, motion.box, 0, 1, S.E.out).toFixed(3));
      },
    };
  },
};
