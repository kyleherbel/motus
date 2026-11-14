// The graphic field behind the split layout (research/colour.md). Drawn once and never moves:
// no scroll, drift, pulse or grain [C06]. Everything is synthesised from the measured recipe.
//   dark  : neutral; one texture per video, chosen by look.plate [C03-C07]
//           dots (default): soft dots on an 18.3 px lattice | grid: 1-px lines, 16 x 18 px | plain | lifted:
//           #080808 lit by two soft lights (top-left, and low right beside the panel), with dots
//   light : #E3E3E3 with faint speckles on an 11.5 x 9.65 px lattice, and a 1-px grid at 42.85 px that shows
//           only in a round soft spot at (543, 950), sigma 205 px [C08, C09]
// The two swap with a hard cut, usually behind a full-height cut-in [L22, M02, S20].
import { W, H, colour } from './tokens.js';

const cache = {};

function soft(g, x, y, d, fill) {
  const r = d / 2 + 1;
  const grd = g.createRadialGradient(x, y, 0, x, y, r);
  grd.addColorStop(0, fill); grd.addColorStop(Math.max(0, (d / 2 - 0.5) / r), fill); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(x - r, y - r, r * 2, r * 2);
}

function darkPlate(g, kind, rnd) {
  const P = colour.plates[kind] || colour.plates.dots;
  g.fillStyle = P.base; g.fillRect(0, 0, W, H);
  if (P.lights) {
    for (const L of P.lights) {
      const grd = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r);
      grd.addColorStop(0, L.add); grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd; g.fillRect(0, 0, W, H);
    }
  }
  if (P.dot) {
    // columns straddle the centre line, rows from the top [C04]
    const x0 = (W / 2 - P.pitch / 2) % P.pitch;
    for (let y = P.pitch / 2; y < H; y += P.pitch) for (let x = x0; x < W; x += P.pitch) soft(g, x, y, P.d, P.dot);
  }
  if (P.line) {
    g.fillStyle = P.line;
    for (let x = 0; x < W; x += P.px) g.fillRect(Math.round(x), 0, 1, H);
    for (let y = 0; y < H; y += P.py) g.fillRect(0, Math.round(y), W, 1);
  }
}

function lightPlate(g, rnd) {
  const L = colour.light;
  g.fillStyle = L.base; g.fillRect(0, 0, W, H);
  const S = L.speckle;
  for (let y = S.py / 2; y < H; y += S.py) {
    for (let x = S.px / 2; x < W; x += S.px) {
      const sz = S.size * (0.7 + 0.6 * rnd());
      soft(g, x + (rnd() * 2 - 1) * S.jitter, y + (rnd() - 0.5), sz, `rgba(0,0,0,${S.alpha})`);
    }
  }
  // the coarse grid, faded by a round Gaussian spot behind the graphic
  const G = L.grid;
  const m = document.createElement('canvas'); m.width = W; m.height = H;
  const gm = m.getContext('2d');
  gm.fillStyle = `rgba(0,0,0,${G.alpha})`;
  for (let x = G.x0 % G.px; x < W; x += G.px) gm.fillRect(Math.round(x) - G.width / 2, 0, G.width, H);
  for (let y = G.y0 % G.py; y < H; y += G.py) gm.fillRect(0, Math.round(y) - G.width / 2, W, G.width);
  gm.globalCompositeOperation = 'destination-in';
  const grd = gm.createRadialGradient(G.cx, G.cy, 0, G.cx, G.cy, G.sigma * 3);
  for (let k = 0; k <= 12; k++) { const r = k / 12; grd.addColorStop(r, `rgba(0,0,0,${Math.exp(-((r * 3) ** 2) / 2).toFixed(4)})`); }
  gm.fillStyle = grd; gm.fillRect(0, 0, W, H);
  g.drawImage(m, 0, 0);
}

function plate(S, kind) {
  if (cache[kind]) return cache[kind];
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const rnd = S.kit.seeded(1307);
  if (kind === 'light') lightPlate(g, rnd); else darkPlate(g, kind, rnd);
  cache[kind] = c.toDataURL('image/png');
  return cache[kind];
}

export function buildField(S) {
  const { h } = S.kit;
  const darkKind = colour.plates[S.doc.look?.plate] ? S.doc.look.plate : 'dots';
  const layer = (kind) => h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, backgroundImage: `url(${plate(S, kind)})`, backgroundSize: `${W}px ${H}px`, display: 'none' } });
  const dark = layer(darkKind), light = layer('light');
  const el = h('div.nc-field', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px` } }, dark, light);
  let shown = null;
  return {
    el,
    /** mode: 'dark' | 'light' | anything else shows no field (the presenter fills the frame) */
    seek(mode) {
      if (mode === shown) return;
      dark.style.display = mode === 'dark' ? '' : 'none';
      light.style.display = mode === 'light' ? '' : 'none';
      shown = mode;
    },
  };
}
