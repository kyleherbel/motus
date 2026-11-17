// The grounds of the style (research/colour.md). Everything is drawn here; no pixels of the
// reference are used.
//   light : flat white under a static design grid (colour CR10): thin light-grey lines
//           centred on the frame, a slightly stronger line every third cell; no grain, no motion
//   dark  : a blurred, dimmed echo of the card itself, darker toward every edge
//   white : flat #FFFFFF, no grain
import { W, H, grid } from './tokens.js';

/** The grid as one SVG image: whole-pixel lines, opaque colours, so crossings never darken. */
function gridUrl(C) {
  const { pitch, every, line, major, origin: [ox, oy] } = grid;
  const minor = [], majors = [];
  const at = (o, size) => { const out = []; for (let k = Math.ceil(-o / pitch); o + k * pitch <= size; k++) out.push([o + k * pitch, k % every === 0]); return out; };
  for (const [x, m] of at(ox, W)) (m ? majors : minor).push(`<rect x="${x - (m ? major : line) / 2}" y="0" width="${m ? major : line}" height="${H}" fill="${m ? C.gridMajor : C.gridLine}"/>`);
  for (const [y, m] of at(oy, H)) (m ? majors : minor).push(`<rect x="0" y="${y - (m ? major : line) / 2}" width="${W}" height="${m ? major : line}" fill="${m ? C.gridMajor : C.gridLine}"/>`);
  // majors last, so a major line is never cut by a minor one crossing it
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${minor.join('')}${majors.join('')}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

export function buildGrounds(S) {
  const { kit, C } = S; const { h } = kit;
  const full = { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px` };

  // ---- light canvas: white and a static grid; nothing in it depends on t
  const light = h('div.ep-ground-light', { style: { ...full, background: C.canvas, backgroundImage: gridUrl(C), backgroundSize: `${W}px ${H}px`, backgroundRepeat: 'no-repeat', overflow: 'hidden' } });

  // ---- dark focus backdrop: the card's own light, enlarged and blurred until it is one even field at 0.43
  // gain (a white card gives mid-grey, a dark terminal gives near-black), then darkened toward every edge
  const echo = h('div', { style: { ...full, background: 'rgb(110,110,110)' } });
  // the live echo (colour C19-C20): a copy of the card as it is at this frame, 2x about the frame centre,
  // blurred (sigma 85 px) and multiplied by 0.43, so the backdrop carries the card's own shapes and colours
  const live = h('div.ep-echo', { style: { ...full, filter: 'blur(85px) brightness(0.43)', display: 'none' } });
  const dark = h('div.ep-ground-dark', { style: { ...full, background: '#050506', overflow: 'hidden' } },
    echo, live,
    h('div', { style: { ...full, background: 'linear-gradient(180deg, rgba(0,0,0,0.34) 3%, rgba(0,0,0,0) 34%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.52) 98%)' } }),
    h('div', { style: { ...full, background: 'linear-gradient(90deg, rgba(0,0,0,0.31) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.31) 100%)' } }));

  const white = h('div.ep-ground-white', { style: { ...full, background: C.white } });
  const black = h('div.ep-ground-black', { style: { ...full, background: '#000' } });
  // isolate: the grounds re-order themselves with z-index and must not climb over the layers above
  const el = h('div.ep-grounds', { style: { ...full, isolation: 'isolate', overflow: 'hidden' } }, black, light, dark, white);
  const byMode = { 'light-split': light, 'dark-focus': dark, white, 'presenter-full': black };
  let lastEcho = '';
  let liveFrom = null;

  return {
    el,
    /**
     * runs: mode runs in order; a run with fadeIn > 0 cross-fades over the previous ground.
     * echoOf(t): { x, y, w, h, tone } of the card currently in dark focus (tone 'light' | 'dark' | a css colour), or null.
     */
    seek(t, runs, echoOf) {
      const cur = runs.find((r) => t >= r.start && t < r.end) || (t < runs[0].start ? runs[0] : runs[runs.length - 1]);
      const idx = runs.indexOf(cur);
      const prev = idx > 0 ? runs[idx - 1] : null;
      const p = cur.fadeIn > 0 ? S.E.emph(kit.clamp((t - cur.start) / cur.fadeIn)) : 1;
      for (const [mode, node] of Object.entries(byMode)) {
        const isCur = mode === cur.mode, under = prev && mode === prev.mode && p < 1 && !isCur;
        node.style.display = isCur || under ? '' : 'none';
        node.style.opacity = isCur ? String(p) : '1';
        node.style.zIndex = isCur ? '2' : '1';
      }
      if (cur.mode === 'dark-focus') {
        const e = echoOf(t);
        const tone = e?.tone ?? 'light';
        // tone: 'light' | 'dark' | [r, g, b] average colour of the card's content
        const rgb = tone === 'dark' ? [18, 18, 20] : Array.isArray(tone) ? tone : [255, 255, 255];
        const colour = `rgb(${rgb.map((v) => Math.round(v * 0.43)).join(',')})`;
        if (colour !== lastEcho) { lastEcho = colour; echo.style.background = colour; }
      }
    },
    /** After the elements have been seeked: copy the card in dark focus into the backdrop, as it is now. */
    echoLive(t, inst) {
      if (!inst || !inst.wrap) { live.style.display = 'none'; liveFrom = null; return; }
      live.style.display = '';
      echo.style.background = 'rgb(48,48,50)';   // a floor under the echo so the frame never falls to black between shapes
      lastEcho = '';
      // place the copy so the card's centre lands where the measured backdrop peaks (y 1000-1100, colour C19)
      // at 2.2x: the glow then reaches the caption band and the bottom edge as on the reference
      const r = inst.rect || { x: 0, y: 0, w: W, h: H };
      const ccx = r.x + r.w / 2, ccy = r.y + r.h / 2;
      live.style.transformOrigin = `${ccx}px ${ccy}px`;
      live.style.transform = `translate(${(540 - ccx).toFixed(1)}px, ${(1040 - ccy).toFixed(1)}px) scale(2.2)`;
      const copy = inst.wrap.cloneNode(true);
      copy.style.display = '';
      // canvases (video frames) do not clone their pixels: copy them across
      const src = inst.wrap.querySelectorAll('canvas'), dst = copy.querySelectorAll('canvas');
      src.forEach((c, i) => { try { dst[i].getContext('2d').drawImage(c, 0, 0); } catch { /* tainted or empty */ } });
      copy.querySelectorAll('video').forEach((v) => v.remove());
      live.replaceChildren(copy);
      liveFrom = inst;
    },
  };
}
