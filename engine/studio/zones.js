// Safe-zone overlay: where a platform's own interface covers a 9:16 frame.
//
// Drawn from safe-zones.json as neutral labelled blocks plus a dashed outline of the
// area that stays clear. Everything is positioned as a fraction of the frame (an SVG
// with a 0..1 view box stretched over it, and labels placed in percent), so the same
// overlay is correct on the monitor, on an option card and at any other size.
import { h, svg } from './lib.js';

const pct = (n) => `${(Number(n) * 100).toFixed(3)}%`;
const okBox = (b) => Array.isArray(b) && b.length === 4 && b.every((n) => Number.isFinite(Number(n)));

function label(text, box, frame, kind) {
  const [x, y, w, hgt] = box.map(Number);
  const el = h('span', { class: `z-label z-label-${kind}` }, text);
  const tall = hgt * frame.height > w * frame.width * 1.5;      // a column: write the label down it
  const thin = hgt * frame.height < 12;                          // a hairline: sit the label on top of it
  if (thin) {                                                    // a chip sitting on the line's right end
    el.style.right = pct(1 - x - w);
    el.style.bottom = pct(1 - y);
    el.classList.add('z-chip');
  } else {                                                       // centred inside its block
    el.style.left = pct(x); el.style.top = pct(y);
    el.style.width = pct(w); el.style.height = pct(hgt);
  }
  if (tall) el.classList.add('z-tall');
  return el;
}

/** A fresh overlay element for one frame. `data` is the parsed safe-zones.json (or null: an empty overlay). */
export function buildOverlay(data) {
  const root = h('div', { class: 'zones', 'aria-hidden': 'true' });
  if (!data) return root;
  const frame = { width: Number(data.frame?.width) || 1080, height: Number(data.frame?.height) || 1920 };
  const art = svg('svg', { viewBox: '0 0 1 1', preserveAspectRatio: 'none' });
  const labels = [];
  const block = (zone, kind) => {
    if (!okBox(zone?.box)) return;
    const [x, y, w, hgt] = zone.box.map(Number);
    art.append(svg('rect', { class: `z-${kind}`, x, y, width: w, height: Math.max(hgt, 0.002) }));
    if (zone.label) labels.push(label(zone.label, zone.box, frame, kind));
  };
  for (const z of data.cropped || []) block(z, 'crop');
  for (const z of data.covered || []) block(z, 'cover');

  const poly = (data.safe?.polygon || []).filter((p) => Array.isArray(p) && p.length === 2 && p.every((n) => Number.isFinite(Number(n))));
  if (poly.length >= 3) {
    const points = poly.map(([x, y]) => `${Number(x)},${Number(y)}`).join(' ');
    art.append(svg('polygon', { class: 'z-safe-under', points }), svg('polygon', { class: 'z-safe', points }));
    if (data.safe.label) {
      const tag = h('span', { class: 'z-label z-chip z-label-safe' }, data.safe.label);
      tag.style.left = pct(poly[0][0]);
      tag.style.top = pct(poly[0][1]);
      labels.push(tag);
    }
  }
  root.append(art, ...labels);
  return root;
}
