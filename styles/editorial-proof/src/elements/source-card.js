// A captured web page (or any screenshot) inside the card with browser chrome: shown
// as a tight crop at reading size, never a whole viewport, with marks on the real text.
// The capture comes from `motus capture`, which also records where each phrase sits.
import { cardFrame } from '../card.js';
import { highlight, outlineBox, numberTile, spotlight } from '../marks.js';
import { motion } from '../tokens.js';

const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();

export default {
  type: 'source-card',
  label: 'Source capture',
  slots: ['card'],
  params: {
    src: 'asset',
    url: 'string?',                                   // shown in the address pill; defaults to the captured URL
    chrome: 'enum?:browser|none',
    counter: { type: 'string', optional: true, maxChars: 7 },   // "2/5" in numbered lists
    focus: 'string?',                                 // a captured phrase to frame at the start
    zoom: { type: 'number', optional: true, min: 1, max: 4 },    // 1 = the capture fills the card width
    height: { type: 'number', optional: true, min: 160, max: 1024 },
  },
  beats: {
    highlight: { find: 'string', tone: 'enum?:accent|red' },
    outline: { find: 'string', tone: 'enum?:accent|orange|red' },
    spotlight: { find: 'string' },
    focus: { find: 'string', zoom: { type: 'number', optional: true, min: 1, max: 4 } },
    number: { value: { type: 'string', maxChars: 9 }, label: { type: 'string', optional: true, maxChars: 22, maxWords: 3 }, skin: 'enum?:dark|white' },
  },

  async prepare(params, S) {
    const img = new Image();
    img.src = S.env.projectUrl(params.src);
    await img.decode().catch(() => { throw new Error(`Could not load ${params.src}`); });
    let meta = null;
    try { const r = await fetch(S.env.projectUrl(`${params.src}.json`)); if (r.ok) meta = await r.json(); } catch { /* a plain screenshot has no sidecar */ }
    // average colour of the capture: the dark-focus backdrop is an echo of what the card shows
    const c = document.createElement('canvas'); c.width = 16; c.height = 16;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, 16, 16);
    const px = g.getImageData(0, 0, 16, 16).data; const avg = [0, 0, 0];
    for (let i = 0; i < px.length; i += 4) { avg[0] += px[i]; avg[1] += px[i + 1]; avg[2] += px[i + 2]; }
    return { img, meta, w: img.naturalWidth, h: img.naturalHeight, avg: avg.map((v) => v / 256) };
  },

  prefer(params, ctx) {
    if (params.height) return { h: params.height };
    const chrome = params.chrome === 'none' ? 0 : 65;
    const zoom = params.zoom || 1;
    const natural = (ctx.data.h / ctx.data.w) * ctx.w * zoom + chrome;
    return { h: Math.round(Math.min(ctx.maxH, Math.max(300, natural))) };
  },

  build(ctx) {
    const { S, params, rect, mode, tIn, beats, data } = ctx; const { kit } = S; const { h } = kit;
    const url = params.url || data.meta?.url || '';
    const card = cardFrame(S, { w: rect.w, h: rect.h, mode, chrome: params.chrome === 'none' ? null : { url }, counter: params.counter, tIn });
    const bw = card.bodyW, bh = card.bodyH;

    // page layer: the capture at card width, then zoomed and panned
    const k0 = bw / data.w;                                     // image px -> card px at zoom 1
    const pageH = data.h * k0;
    const page = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${bw}px`, height: `${pageH}px`, transformOrigin: '0 0', willChange: 'transform' } });
    const img = h('img', { src: data.img.src, style: { position: 'absolute', left: '0', top: '0', width: `${bw}px`, height: `${pageH}px`, display: 'block' } });
    page.append(img);
    card.body.append(page);
    const dimmer = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${bw}px`, height: `${bh}px`, background: '#000', opacity: '0', pointerEvents: 'none' } });
    card.body.append(dimmer);

    const find = (phrase) => {
      const f = (data.meta?.finds || []).find((x) => norm(x.text) === norm(phrase) && x.found);
      return f ? f.rects.map((r) => ({ x: r.x * k0, y: r.y * k0, w: r.w * k0, h: r.h * k0 })) : null;
    };
    const bbox = (rs) => { const x0 = Math.min(...rs.map((r) => r.x)), y0 = Math.min(...rs.map((r) => r.y)); const x1 = Math.max(...rs.map((r) => r.x + r.w)), y1 = Math.max(...rs.map((r) => r.y + r.h)); return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; };

    // camera keyframes: [{t, z, cx, cy}] in page coordinates
    const view = (z, target) => {
      const cx = target ? target.x + target.w / 2 : bw / 2;
      const cy = target ? target.y + target.h / 2 : bh / (2 * z);
      const halfW = bw / (2 * z), halfH = bh / (2 * z);
      return { z, cx: Math.min(Math.max(cx, halfW), Math.max(halfW, bw - halfW)), cy: Math.min(Math.max(cy, halfH), Math.max(halfH, pageH - halfH)) };
    };
    const startRects = params.focus ? find(params.focus) : null;
    const keys = [{ t: tIn, ...view(params.zoom || 1, startRects ? bbox(startRects) : null) }];

    let tile = null;
    const live = [];
    for (const b of beats) {
      const rects = b.find ? find(b.find) : null;
      if (b.find && !rects) S.warn(`source-card: "${b.find}" was not captured in ${params.src}; the ${b.do} is skipped`);
      if (b.do === 'focus' && rects) keys.push({ t: b.t, ...view(b.zoom || Math.max(keys[keys.length - 1].z, 1.6), bbox(rects)) });
      if (b.do === 'highlight' && rects) { const m = highlight(S, { rects, t0: b.t, tone: b.tone || 'accent', surface: data.meta?.dark ? 'dark' : 'light', heightRatio: 1.06 }); page.append(m.el); live.push(m); S.sfx(b.t, 'highlight'); }
      if (b.do === 'outline' && rects) { const m = outlineBox(S, { rect: bbox(rects), t0: b.t, tone: b.tone || 'accent' }); page.append(m.el); live.push(m); S.sfx(b.t, 'highlight'); }
      if (b.do === 'spotlight' && rects) { const m = spotlight(S, { rect: bbox(rects), t0: b.t, w: bw, h: pageH }); page.append(m.el); live.push(m); }
      if (b.do === 'number') { tile = numberTile(S, { value: b.value, label: b.label, cx: rect.w / 2, cy: card.chromeH + bh / 2, t0: b.t, skin: b.skin || 'dark', maxW: rect.w - 120 }); card.overlay.append(tile.el); S.sfx(b.t, 'number'); S.sfx(tile.landed, 'numberLand'); }
    }
    keys.sort((a, b) => a.t - b.t);

    return {
      el: card.el, tone: data.avg,
      seek(t) {
        card.seek(t);
        // camera: ease between keyframes over 14 frames, starting at each key's time
        let cur = keys[0];
        for (let i = 1; i < keys.length; i++) {
          if (t < keys[i].t) break;
          const p = S.E.incard(kit.clamp((t - keys[i].t) / (24 / 30)));        // push-in: 24 frames on the in-card curve
          const a = cur, b = keys[i];
          cur = { z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * p), cx: a.cx + (b.cx - a.cx) * p, cy: a.cy + (b.cy - a.cy) * p };
        }
        const tx = bw / 2 - cur.cx * cur.z, ty = bh / 2 - cur.cy * cur.z;
        page.style.transform = `translate(${tx.toFixed(2)}px, ${Math.min(0, ty).toFixed(2)}px) scale(${cur.z.toFixed(4)})`;
        for (const m of live) m.seek(t);
        if (tile) { tile.seek(t); dimmer.style.opacity = String(0.5 * tile.dim(t)); }
      },
    };
  },
};
