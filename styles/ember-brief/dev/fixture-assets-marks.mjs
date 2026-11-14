#!/usr/bin/env node
// Placeholder marks for the chips, logo-tiles and icon-grid fixtures (dev/fixtures/marks.json), written
// into <project>/assets/. Simple shapes on transparency drawn with ffmpeg: no real logos.
//   node styles/ember-brief/dev/fixture-assets-marks.mjs <project>
import path from 'node:path';
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const project = process.argv[2];
if (!project) { console.error('Usage: node styles/ember-brief/dev/fixture-assets-marks.mjs <project>'); process.exit(1); }
const dir = path.resolve(project, 'assets');
await fs.mkdir(dir, { recursive: true });

// one shape = an alpha expression on a 480 px canvas; the colour is flat
const S = 480, C = S / 2;
const edge = (d) => `clip((${d})*255,0,255)`;                  // 1 px soft edge from a signed distance
const shapes = {
  // a dark disc with a small notch of light: a chip picture for a cream tile
  'fx-mark-dot.png': ['121316', edge(`${C - 20}-hypot(X-${C},Y-${C})`) + `*(1-0.9*lt(hypot(X-${C + 70},Y-${C - 70}),34))`],
  // a cream ring: a chip picture for a dark pill
  'fx-mark-ring.png': ['EDEEF1', edge(`min(${C - 20}-hypot(X-${C},Y-${C}),hypot(X-${C},Y-${C})-${C - 90})`)],
  // three dark bars of rising height: a logo for a cream tile
  'fx-mark-bars.png': ['121316', `255*(lt(abs(X-100),50)*gt(Y,280)+lt(abs(X-240),50)*gt(Y,160)+lt(abs(X-380),50)*gt(Y,40))*lt(Y,440)`],
  // an accent triangle
  'fx-mark-tri.png': ['FF3AB0', `255*gt(Y,60)*lt(Y,420)*lt(abs(X-${C}),(Y-60)*0.58)`],
  // four dark discs, two by two
  'fx-mark-four.png': ['121316', edge(`92-min(min(hypot(X-130,Y-130),hypot(X-350,Y-130)),min(hypot(X-130,Y-350),hypot(X-350,Y-350)))`)],
};
for (const [name, [hex, alpha]] of Object.entries(shapes)) {
  const [r, g, b] = hex.match(/../g).map((x) => parseInt(x, 16));
  await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', `color=c=black:s=${S}x${S},format=rgba,geq=r=${r}:g=${g}:b=${b}:a='${alpha}'`, '-frames:v', '1', path.join(dir, name)]);
  console.log(path.relative(process.cwd(), path.join(dir, name)));
}
