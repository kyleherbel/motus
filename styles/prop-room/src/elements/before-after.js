// A before state replaced by an after state through a wipe with a visible front (research/explain.md X51, X53,
// X70; device before_after_wipe, the most used interface device: 14 units, 33.9 s).
//
// Anatomy [X55, X70]: the before state is the anchor on the cut; a coloured bar crosses the card and leaves the
// after state behind it. Wipes last about 10 frames (5-25); short ones (7 frames or less) ease in, longer ones
// ease in-out [X70]. Measured instance clip15@855-884: a white card 930 x 636 (x 75-1004, y 237-872 in the panel),
// radius 30, an orange bar #FC6B00 18 px wide spanning the card, left to right, easeInOutCubic over about
// 28 frames, centred on frame 871. A second `wipe` beat sends it back the way it came (clip01@365-386).
// The states are two pictures (captures the project made with `motus capture`, or files the user supplies) or,
// without pictures, a rebuilt generic page: a plain grey wireframe that becomes a styled page [X73].
import { F, fonts, colour, motion } from '../tokens.js';
import { place, setStyle, clamp01, sansFont } from '../common.js';
import { UI, hexOr, windowChrome } from './ui-kit.js';

// TOKENS (research/explain.md X70, X73, X74; measured clip15@855-886 unless marked)
const CARDW = 930;                         // x 75-1004 (clip15@886); windows 929 [X74]
const CARDH = { split: 636, full: 900 };   // split: y 237-872 (clip15@886); full by eye
const RADIUS = 30;                         // corner (clip15@886, zoom) [X74 30.1]
const FRONT = { w: 18, colour: '#FC6B00' };   // the bar: 18 px, #FC6B00 calibrated (clip15@870)
const SHORT = F(7);                        // wipes this short ease in (easeInCubic), longer ones in-out [X70]
const DEFAULT_AT = { share: 0.35, min: F(4), max: F(35) };   // without a beat: clip15 starts +4, clip01@984 +35 (by eye)

/** A rebuilt generic page: plain (a grey wireframe) or styled (accent hero, bold headline, filled button). */
function mockPage(S, { w, h, styled, title, accent }) {
  const { h: hh } = S.kit;
  const pad = Math.round(w * 0.07);
  const el = hh('div', { style: { position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${h}px`, overflow: 'hidden',
    background: styled ? `linear-gradient(160deg, ${accent} 0%, ${accent} 46%, #FFFFFF 46.1%)` : '#FFFFFF' } });
  const grey = '#E4E4E8', greyInk = '#A3A3AA';
  // nav: a mark and three links
  el.append(hh('div', { style: { position: 'absolute', left: `${pad}px`, top: `${pad * 0.7}px`, width: '34px', height: '34px', borderRadius: styled ? '10px' : '6px',
    background: styled ? '#FFFFFF' : grey } }));
  for (let i = 0; i < 3; i++) el.append(hh('div', { style: { position: 'absolute', right: `${pad + i * 92}px`, top: `${pad * 0.7 + 11}px`, width: '70px', height: '12px', borderRadius: '6px',
    background: styled ? 'rgba(255,255,255,0.75)' : grey } }));
  // headline
  const hs = styled ? Math.round(w * 0.082) : Math.round(w * 0.056);
  el.append(hh('div', { text: title || (styled ? 'Made with care' : 'Welcome to our site'), style: { position: 'absolute', left: `${pad}px`, width: `${w - 2 * pad}px`, top: `${Math.round(h * 0.2)}px`,
    font: sansFont(hs, styled ? fonts.weight.display : 600), letterSpacing: styled ? '-0.035em' : '0', lineHeight: '1.04', color: styled ? '#FFFFFF' : greyInk } }));
  // body lines
  const ly = h * 0.2 + hs * 2.35;
  for (let i = 0; i < 2; i++) el.append(hh('div', { style: { position: 'absolute', left: `${pad}px`, top: `${ly + i * 30}px`, width: `${(w - 2 * pad) * (i ? 0.52 : 0.74)}px`, height: '14px',
    borderRadius: '7px', background: styled ? 'rgba(255,255,255,0.7)' : grey } }));
  // button
  el.append(hh('div', { text: styled ? 'Get started' : 'Button', style: { position: 'absolute', left: `${pad}px`, top: `${ly + 86}px`, height: '58px', padding: '0 30px', borderRadius: '29px',
    display: 'flex', alignItems: 'center', font: sansFont(22, 600), color: styled ? '#FFFFFF' : greyInk,
    background: styled ? colour.ink : 'transparent', boxShadow: styled ? 'none' : `inset 0 0 0 2px ${grey}` } }));
  // three tiles at the foot
  const ty = Math.max(ly + 190, h * 0.66), tw = (w - 2 * pad - 2 * 22) / 3, th = Math.max(60, h - ty - pad * 0.8);
  for (let i = 0; i < 3; i++) {
    el.append(hh('div', { style: { position: 'absolute', left: `${pad + i * (tw + 22)}px`, top: `${ty}px`, width: `${tw}px`, height: `${th}px`, borderRadius: styled ? '18px' : '8px',
      background: styled ? '#FFFFFF' : '#F4F4F6', boxShadow: styled ? '0 16px 30px -18px rgba(0,0,0,0.35)' : `inset 0 0 0 2px ${grey}` } },
    hh('div', { style: { position: 'absolute', left: '18px', top: '18px', width: '38px', height: '38px', borderRadius: '50%', background: styled ? accent : grey } }),
    hh('div', { style: { position: 'absolute', left: '18px', top: '74px', width: `${tw * 0.6}px`, height: '11px', borderRadius: '6px', background: styled ? '#D9D9DE' : grey } })));
  }
  return el;
}

export default {
  type: 'before-after',
  label: 'Before / after wipe',
  slots: ['graphic'],
  params: {
    before: 'asset?',                                               // the before picture (a capture or the user's file)
    after: 'asset?',                                                // the after picture
    title: { type: 'string', optional: true, maxChars: 30, maxWords: 6 },   // headline of the rebuilt page when there are no pictures
    frame: 'enum?:card|window',                                     // a plain card (default) or a browser window [X73, X74]
    url: { type: 'string', optional: true, maxChars: 28 },          // the address in the window's pill
    accent: { type: 'string', optional: true, maxChars: 7 },        // the styled page's colour (#RRGGBB) [C18]
    front: { type: 'string', optional: true, maxChars: 7 },         // the wipe bar's colour (default #FC6B00) [X70]
  },
  beats: {
    // the wipe; a second wipe sends it back. frames 5-30 (default 10) [X70]; from: the side the bar starts on
    wipe: { frames: { type: 'number', optional: true, min: 5, max: 30 }, from: 'enum?:left|right|top|bottom' },
  },
  async prepare(params, S) {
    const load = async (src) => {
      if (!src) return null;
      try { const img = new Image(); img.src = S.env.projectUrl(src); await img.decode(); return img; } catch { S.warn(`before-after: could not load ${src}`); return null; }
    };
    const [before, after] = await Promise.all([load(params.before), load(params.after)]);
    if ((params.before && !params.after) || (!params.before && params.after)) S.warn('before-after: give both pictures, or neither for the rebuilt page');
    return { before, after };
  },
  build(ctx) {
    const { S, params, beats, mode, tIn, tOut, data } = ctx;
    const { h } = S.kit;
    const accent = hexOr(params.accent, UI.accent);
    const frontC = hexOr(params.front, FRONT.colour);
    const pics = data?.before && data?.after ? data : null;
    const win = params.frame === 'window';

    let H = CARDH[mode === 'full' ? 'full' : 'split'];
    if (pics) {   // a picture pair sets the height from its aspect, within the stage
      const bar = win ? 4.5 * 13.5 : 0;
      H = Math.min(mode === 'full' ? 1150 : 880, Math.round(bar + (CARDW * pics.before.naturalHeight) / pics.before.naturalWidth));
    }
    const box = place(ctx, CARDW, H);
    const el = h('div.pr-before-after', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${CARDW}px`, height: `${H}px`,
      transform: box.s < 0.999 ? `scale(${box.s})` : '', transformOrigin: '0 0' } });
    let body, bw = CARDW, bh = H;
    if (win) {
      const w = windowChrome(S, { x: 0, y: 0, w: CARDW, h: H, url: params.url || '' , radius: RADIUS });
      el.append(w.el); body = w.body; bh = H - w.barH;
    } else {
      body = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${CARDW}px`, height: `${H}px`, borderRadius: `${RADIUS}px`, overflow: 'hidden',
        background: colour.card, boxShadow: colour.shadow.card } });
      el.append(body);
    }
    const state = (styled) => {
      if (pics) {
        const img = styled ? pics.after : pics.before;
        const s = Math.max(bw / img.naturalWidth, bh / img.naturalHeight);
        return h('img', { src: img.src, style: { position: 'absolute', left: `${(bw - img.naturalWidth * s) / 2}px`, top: '0', width: `${img.naturalWidth * s}px`, height: `${img.naturalHeight * s}px` } });
      }
      return mockPage(S, { w: bw, h: bh, styled, title: params.title, accent });
    };
    const beforeEl = h('div', { style: { position: 'absolute', inset: '0' } }, state(false));
    const afterEl = h('div', { style: { position: 'absolute', inset: '0', clipPath: 'inset(0 100% 0 0)' } }, state(true));
    const bar = h('div', { style: { position: 'absolute', background: frontC, display: 'none' } });
    body.append(beforeEl, afterEl, bar);

    // wipes: from the beats, else one at a default moment; each later wipe reverses the previous one
    let wipes = beats.filter((b) => b.do === 'wipe').map((b) => ({ t: b.t, dur: F(b.frames ?? 10), from: b.from }));
    if (!wipes.length) wipes = [{ t: tIn + Math.max(DEFAULT_AT.min, Math.min(DEFAULT_AT.max, (tOut - tIn) * DEFAULT_AT.share)), dur: motion.wipe.dur }];
    let side = wipes[0].from || 'left';
    wipes = wipes.map((w, i) => { side = w.from || side; return { ...w, side, back: i % 2 === 1 }; });
    const horiz = (sd) => sd === 'left' || sd === 'right';

    return {
      el, box,
      seek(t) {
        // the last wipe that has started decides the picture; earlier ones are complete
        let cur = null, idx = -1;
        wipes.forEach((w, i) => { if (t >= w.t) { cur = w; idx = i; } });
        if (!cur) { setStyle(afterEl, 'clipPath', 'inset(0 100% 0 0)'); setStyle(bar, 'display', 'none'); return; }
        const fn = cur.dur <= SHORT + 1e-6 ? S.kit.ease.inCubic : S.kit.ease.inOutCubic;
        const u = clamp01((t - cur.t) / cur.dur);
        // q: share of the card showing the after state, measured from the side the bar starts on
        const q = cur.back ? 1 - fn(u) : fn(u);
        const L = horiz(cur.side) ? bw : bh;
        const X = -FRONT.w + q * (L + FRONT.w);         // the boundary; the bar covers [X, X + 18] from the start side
        const a = Math.max(0, Math.min(L, X)), pct = (100 * (L - a) / L).toFixed(3);
        const clip = cur.side === 'left' ? `inset(0 ${pct}% 0 0)` : cur.side === 'right' ? `inset(0 0 0 ${pct}%)` : cur.side === 'top' ? `inset(0 0 ${pct}% 0)` : `inset(${pct}% 0 0 0)`;
        setStyle(afterEl, 'clipPath', clip);
        const moving = u > 0 && u < 1;
        setStyle(bar, 'display', moving ? '' : 'none');
        if (!moving) return;
        if (horiz(cur.side)) {
          const x = cur.side === 'left' ? X : bw - X - FRONT.w;
          Object.assign(bar.style, { left: `${x.toFixed(2)}px`, top: '0', width: `${FRONT.w}px`, height: `${bh}px` });
        } else {
          const y = cur.side === 'top' ? X : bh - X - FRONT.w;
          Object.assign(bar.style, { left: '0', top: `${y.toFixed(2)}px`, width: `${bw}px`, height: `${FRONT.w}px` });
        }
        void idx;
      },
    };
  },
};
