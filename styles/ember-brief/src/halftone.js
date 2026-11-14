// The house picture look (research/explain-look.md R01-R13): a cut-out printed in two flat values, cream dots on
// an opaque ground of the field colour, with a hard silhouette and nothing round it, and at most one feature in
// the accent. There is no house screen in the reference (11 pictures carry regular round-dot lattices of 3.2 to
// 11.4 px at several angles), so the build prints every picture with one: round dots on a square 5.5 px lattice
// at 0 degrees, the median pitch and the commonest angle [R02]. The constant is the dot law: ink area = tone x
// pitch squared, separate dots below half coverage and separate holes above it [R03].
//
// The screen belongs to the picture, not to the frame [R09]: it is printed once, at the picture's size on the
// frame, and the layer is then moved. halftoneCutout works on RGBA arrays (what a canvas returns), so it is a
// pure function of its input. The recipe was tested on generated objects passed through a 0.7 Mbit/s encode:
// all 16 screen statistics fell inside the reference's spread [R12].
//
//   pitch 5.5 px     median of the regular dot screens (n=11 pictures) [R02]
//   ink, ground      the cream and the field colour [R05]
//   REF_CDF          median tone histogram of the 18 reference cut-outs: share of the silhouette per coverage
//                    decile, cumulated. The picture's tones are mapped onto it [R04, R11]
//   minDot 0.04      the smallest dots seen are 1 to 2 px squared on a 25 to 30 px squared cell [R03]
//   outline 8 px     a cream sticker outline, on cut-outs of people only (3 of 18 objects) [R07]
//   soften 0.55 px   brings the ink edge from 1.2 px to the reference's 2.2 px [R11]

export const REF_CDF = [0, 0.171, 0.305, 0.416, 0.524, 0.623, 0.718, 0.809, 0.893, 0.956, 1.0];

const DEFAULTS = {
  pitch: 5.5,            // px between dot centres
  angle: 0,              // degrees
  ink: [237, 238, 241],  // colour.cream #EDEEF1 (release palette, research/colour.md C26)
  ground: [18, 19, 22],  // colour.field #121316
  accent: [255, 58, 176],   // colour.accent #FF3AB0
  accentMask: null,      // Uint8Array w*h, >127 where the ink is the accent
  outline: 0,            // px of cream sticker outline round the silhouette (0 = none)
  ss: 3,                 // supersampling per axis for the dot edges
  toneMix: 0.85,         // 1 = full histogram specification to REF_CDF, 0 = plain percentile stretch
  minDot: 0.04,          // coverage below this prints nothing, above 1-minDot prints solid
  matteThreshold: 128,   // alpha at or above this is inside the object
  keyBackground: false,  // true: build the matte from the corner colour (plain background photo)
  keyTolerance: 28,
  soften: 0.55,          // px, Gaussian sigma applied to the finished layer: the reference dots are not razor sharp
};

function luma(r, g, b) { return 0.2126 * r + 0.7152 * g + 0.0722 * b; }

// Quantile table of the spot function s = 0.5 + 0.25 (cos 2 pi u + cos 2 pi v) over one cell.
// thresholdFor(c) returns the level that leaves exactly a share c of the cell above it.
function buildSpotQuantiles(n = 256) {
  const v = new Float32Array(n * n);
  let k = 0;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    v[k++] = 0.5 + 0.25 * (Math.cos(2 * Math.PI * (i + 0.5) / n) + Math.cos(2 * Math.PI * (j + 0.5) / n));
  }
  v.sort();
  const q = new Float32Array(1025);
  for (let t = 0; t <= 1024; t++) q[t] = v[Math.min(v.length - 1, Math.round((t / 1024) * (v.length - 1)))];
  return q;
}
const SPOT_Q = buildSpotQuantiles();
function thresholdFor(c) { return SPOT_Q[Math.round((1 - c) * 1024)]; }

// Exact squared Euclidean distance transform (Felzenszwalb and Huttenlocher), distance to the nearest inside pixel.
function distanceToMask(inside, w, h) {
  const INF = 1e20, f = new Float64Array(Math.max(w, h)), d = new Float64Array(w * h);
  const v = new Int32Array(Math.max(w, h)), z = new Float64Array(Math.max(w, h) + 1);
  function edt1d(n) {
    let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < n; q++) {
      let s;
      do { const p = v[k]; s = ((f[q] + q * q) - (f[p] + p * p)) / (2 * q - 2 * p); } while (s <= z[k] && --k >= 0);
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    k = 0;
    const out = new Float64Array(n);
    for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; const p = v[k]; out[q] = (q - p) * (q - p) + f[p]; }
    return out;
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = inside[y * w + x] ? 0 : INF;
    const o = edt1d(h);
    for (let y = 0; y < h; y++) d[y * w + x] = o[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = d[y * w + x];
    const o = edt1d(w);
    for (let x = 0; x < w; x++) d[y * w + x] = Math.sqrt(o[x]);
  }
  return d;
}

export function halftoneCutout(src, w, h, options = {}) {
  const o = { ...DEFAULTS, ...options };
  const n = w * h;
  // 1. Matte. Either the alpha channel, or a key on the corner colour for a photo on a plain background.
  const alpha = new Float32Array(n);
  if (o.keyBackground) {
    const br = src[0], bg = src[1], bb = src[2];
    for (let i = 0; i < n; i++) {
      const d = Math.max(Math.abs(src[4 * i] - br), Math.abs(src[4 * i + 1] - bg), Math.abs(src[4 * i + 2] - bb));
      alpha[i] = Math.max(0, Math.min(1, (d - o.keyTolerance) / 8));
    }
  } else {
    for (let i = 0; i < n; i++) alpha[i] = src[4 * i + 3] / 255;
  }
  const inside = new Uint8Array(n);
  for (let i = 0; i < n; i++) inside[i] = alpha[i] * 255 >= o.matteThreshold ? 1 : 0;

  // 2. Greyscale inside the matte, 8-bit histogram.
  const grey = new Float32Array(n), hist = new Float64Array(256);
  let count = 0;
  for (let i = 0; i < n; i++) {
    grey[i] = luma(src[4 * i], src[4 * i + 1], src[4 * i + 2]);
    if (inside[i]) { hist[Math.max(0, Math.min(255, Math.round(grey[i])))]++; count++; }
  }
  // 3. Tone curve: histogram specification onto the measured coverage distribution, mixed with a 2-98 % stretch.
  const cdf = new Float64Array(256);
  let acc = 0, p2 = 0, p98 = 255, seen2 = false, seen98 = false;
  for (let g = 0; g < 256; g++) {
    acc += hist[g];
    cdf[g] = (acc - hist[g] / 2) / Math.max(1, count);     // mid-rank
    if (!seen2 && acc >= 0.02 * count) { p2 = g; seen2 = true; }
    if (!seen98 && acc >= 0.98 * count) { p98 = g; seen98 = true; }
  }
  function refInverse(F) {                                   // cumulative share -> coverage
    for (let k = 1; k <= 10; k++) {
      if (F <= REF_CDF[k]) return (k - 1 + (F - REF_CDF[k - 1]) / (REF_CDF[k] - REF_CDF[k - 1])) / 10;
    }
    return 1;
  }
  const tone = new Float32Array(256);
  for (let g = 0; g < 256; g++) {
    const spec = refInverse(cdf[g]);
    const lin = Math.max(0, Math.min(1, (g - p2) / Math.max(1, p98 - p2)));
    let c = o.toneMix * spec + (1 - o.toneMix) * lin;
    if (c < o.minDot) c = 0;
    if (c > 1 - o.minDot) c = 1;
    tone[g] = c;
  }
  // 4. Screen. Symmetric round-dot spot function on a square lattice, linearised so that coverage = tone.
  const th = (o.angle * Math.PI) / 180, cs = Math.cos(th), sn = Math.sin(th), ss = o.ss;
  const inkA = new Float32Array(n);                            // share of the pixel covered by ink
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!inside[i] && alpha[i] === 0) continue;
      const c = tone[Math.max(0, Math.min(255, Math.round(grey[i])))];
      if (c <= 0) continue;
      if (c >= 1) { inkA[i] = 1; continue; }
      const t = thresholdFor(c);
      let hit = 0;
      for (let b = 0; b < ss; b++) for (let a = 0; a < ss; a++) {
        const px = x + (a + 0.5) / ss, py = y + (b + 0.5) / ss;
        const u = (px * cs + py * sn) / o.pitch, v = (-px * sn + py * cs) / o.pitch;
        const s = 0.5 + 0.25 * (Math.cos(2 * Math.PI * u) + Math.cos(2 * Math.PI * v));
        if (s > t) hit++;
      }
      inkA[i] = hit / (ss * ss);
    }
  }
  // 5. Composite: opaque ground inside the matte, ink on top; optional sticker outline outside the matte.
  const out = new Uint8ClampedArray(4 * n);
  const dist = o.outline > 0 ? distanceToMask(inside, w, h) : null;
  for (let i = 0; i < n; i++) {
    const ink = o.accentMask && o.accentMask[i] > 127 ? o.accent : o.ink;
    const a = inkA[i];
    let r = o.ground[0] + a * (ink[0] - o.ground[0]);
    let g = o.ground[1] + a * (ink[1] - o.ground[1]);
    let b = o.ground[2] + a * (ink[2] - o.ground[2]);
    let A = alpha[i];
    if (dist) {
      const ring = Math.max(0, Math.min(1, o.outline + 0.5 - dist[i]));   // 1 inside the outline band
      if (!inside[i]) {
        // outline pixel: cream, fading over one pixel at its outer edge
        r = o.ink[0]; g = o.ink[1]; b = o.ink[2]; A = ring;
      }
    }
    out[4 * i] = r; out[4 * i + 1] = g; out[4 * i + 2] = b; out[4 * i + 3] = Math.round(255 * A);
  }
  return o.soften > 0 ? gaussianBlurRGBA(out, w, h, o.soften) : out;
}

// 6. Soften. Separable Gaussian on premultiplied RGBA (in a browser: draw the layer with ctx.filter = 'blur(0.55px)').
function gaussianBlurRGBA(px, w, h, sigma) {
  const rad = Math.max(1, Math.ceil(3 * sigma)), k = new Float32Array(2 * rad + 1);
  let sum = 0;
  for (let i = -rad; i <= rad; i++) { k[i + rad] = Math.exp(-(i * i) / (2 * sigma * sigma)); sum += k[i + rad]; }
  for (let i = 0; i < k.length; i++) k[i] /= sum;
  const n = w * h, a = new Float32Array(4 * n), b = new Float32Array(4 * n);
  for (let i = 0; i < n; i++) {
    const A = px[4 * i + 3] / 255;
    a[4 * i] = px[4 * i] * A; a[4 * i + 1] = px[4 * i + 1] * A; a[4 * i + 2] = px[4 * i + 2] * A; a[4 * i + 3] = A;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let r = 0, g = 0, bl = 0, A = 0;
    for (let j = -rad; j <= rad; j++) {
      const xx = Math.min(w - 1, Math.max(0, x + j)), q = 4 * (y * w + xx), wt = k[j + rad];
      r += a[q] * wt; g += a[q + 1] * wt; bl += a[q + 2] * wt; A += a[q + 3] * wt;
    }
    const q = 4 * (y * w + x); b[q] = r; b[q + 1] = g; b[q + 2] = bl; b[q + 3] = A;
  }
  const out = new Uint8ClampedArray(4 * n);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let r = 0, g = 0, bl = 0, A = 0;
    for (let j = -rad; j <= rad; j++) {
      const yy = Math.min(h - 1, Math.max(0, y + j)), q = 4 * (yy * w + x), wt = k[j + rad];
      r += b[q] * wt; g += b[q + 1] * wt; bl += b[q + 2] * wt; A += b[q + 3] * wt;
    }
    const q = 4 * (y * w + x);
    if (A > 1e-4) { out[q] = r / A; out[q + 1] = g / A; out[q + 2] = bl / A; } 
    out[q + 3] = Math.round(255 * A);
  }
  return out;
}

/**
 * Which pixels of a picture print in the accent [R08]: the strongly coloured part of an otherwise neutral
 * object (a button, a shackle, a rope). The reference keeps the accent to a few percent of the picture
 * (median 2.9 %, 1 to 14 %), so a picture that is coloured all over gets none. Not measured: the reference's
 * accent parts were chosen by its illustrator; this rule only finds a part the user has already coloured.
 */
export function accentMaskOf(src, w, h, { minSaturation = 0.55, minValue = 0.35, maxShare = 0.2 } = {}) {
  const n = w * h, mask = new Uint8Array(n);
  let inside = 0, hit = 0;
  for (let i = 0; i < n; i++) {
    if (src[4 * i + 3] < 128) continue;
    inside++;
    const r = src[4 * i] / 255, g = src[4 * i + 1] / 255, b = src[4 * i + 2] / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx >= minValue && mx > 0 && (mx - mn) / mx >= minSaturation) { mask[i] = 255; hit++; }
  }
  return inside > 0 && hit / inside <= maxShare && hit > 0 ? mask : null;
}

/**
 * Print an image (or a canvas) as a house cut-out at w x h frame px. Returns a canvas.
 * One change to the recipe: it takes the tone of every pixel from its luma, so a part in a strong colour (luma
 * about half) printed with only 19 to 25 % of its area in accent ink, where the reference's accent parts carry 25
 * to 87 % [R08]. An accent part therefore takes its tone from its brightness (the largest of its three channels),
 * so a bright accent prints dense.
 */
export function printCutout(image, w, h, options = {}) {
  const W = Math.max(1, Math.round(w)), H = Math.max(1, Math.round(h));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(image, 0, 0, W, H);
  const id = g.getImageData(0, 0, W, H);
  const d = id.data;
  const accentMask = options.accent === false ? null : accentMaskOf(d, W, H);
  if (accentMask) for (let i = 0; i < W * H; i++) if (accentMask[i] > 127) { const v = Math.max(d[4 * i], d[4 * i + 1], d[4 * i + 2]); d[4 * i] = v; d[4 * i + 1] = v; d[4 * i + 2] = v; }
  const out = halftoneCutout(d, W, H, { ...options, accentMask });
  g.putImageData(new ImageData(out, W, H), 0, 0);
  return c;
}
