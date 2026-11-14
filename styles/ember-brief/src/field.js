// The field (research/colour.md C05-C09, motion.md M19, layout.md L23): a flat near-black ground with a
// 12 px lattice of round dots. Dots exist only below a wave line that is the sum of three travelling sines;
// just under the line they are small and they grow back to full size 384 px down. The lattice never moves:
// only which nodes carry a dot, and how large it is, changes. One loop is 300 frames and starts at phase 0
// on frame 0 of the video; it never resets at a cut or a layout change. No gradient, vignette or grain.
//
// The base colour and the dots are separate layers: the opening illustration sits between them, so the dots
// run over the picture [H05].
import { W, H, colour, field as FLD } from './tokens.js';

const TAU = Math.PI * 2;

/** The wave line at x (px) and phase w (radians): y in px, downward. */
export function waveY(x, w) {
  const u = x / W;
  let y = FLD.wave.y0;
  for (const [a, k, n, ph] of FLD.wave.terms) y += a * Math.sin(k * u + n * w + ph);
  return y;
}

/** Dot radius at depth d below the line (d >= 0). */
export function dotRadius(d) {
  if (d <= FLD.rim) return FLD.r;
  if (d >= FLD.growTo) return FLD.r;
  return FLD.small + (FLD.r - FLD.small) * Math.max(0, (d - FLD.growFrom) / (FLD.growTo - FLD.growFrom));
}

export function buildField(S) {
  const { h } = S.kit;
  const P = FLD.pitch;
  const base = h('div.eb-field', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, background: colour.field } });
  const canvas = h('canvas.eb-dots', { width: String(W), height: String(H), style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, pointerEvents: 'none' } });
  const g = canvas.getContext('2d');

  // rows that are always full dots: deeper than growTo under the lowest the line can reach
  const amp = FLD.wave.terms.reduce((n, t) => n + Math.abs(t[0]), 0);
  const staticFrom = Math.ceil((FLD.wave.y0 + amp + FLD.growTo) / P) * P;
  const firstRow = Math.floor((FLD.wave.y0 - amp) / P) * P;
  const still = document.createElement('canvas'); still.width = W; still.height = H - staticFrom;
  {
    const s = still.getContext('2d');
    s.fillStyle = colour.dot; s.beginPath();
    for (let y = staticFrom; y <= H; y += P) for (let x = 0; x <= W; x += P) { s.moveTo(x + FLD.r, y - staticFrom); s.arc(x, y - staticFrom, FLD.r, 0, TAU); }
    s.fill();
  }

  let drawn = null;
  return {
    base, dots: canvas,
    seek(t) {
      // the line moves in real time; one drawing per output frame is enough
      const key = Math.round(t * S.doc.fps);
      if (key === drawn) return;
      drawn = key;
      const w = TAU * ((t % FLD.loop) / FLD.loop);
      g.clearRect(0, 0, W, staticFrom);
      g.fillStyle = colour.dot; g.beginPath();
      for (let x = 0; x <= W; x += P) {
        const yc = waveY(x, w);
        for (let y = Math.max(firstRow, Math.ceil(yc / P) * P); y < staticFrom; y += P) {
          const r = dotRadius(y - yc);
          g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU);
        }
      }
      g.fill();
      if (!canvas._still) { g.drawImage(still, 0, staticFrom); canvas._still = true; }
    },
  };
}
