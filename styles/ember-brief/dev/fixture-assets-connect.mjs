#!/usr/bin/env node
// Placeholder marks and pictures for the link and process fixtures (dev/fixtures/connect.json), written
// into <project>/assets/. Simple shapes on transparency drawn with ffmpeg: no real logos or pictures.
//   node styles/ember-brief/dev/fixture-assets-connect.mjs <project>
import path from 'node:path';
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const project = process.argv[2];
if (!project) { console.error('Usage: node styles/ember-brief/dev/fixture-assets-connect.mjs <project>'); process.exit(1); }
const dir = path.resolve(project, 'assets');
await fs.mkdir(dir, { recursive: true });

// one shape = [width, height, colour, alpha expression]; the colour is flat
const edge = (d) => `clip((${d})*255,0,255)`;                  // 1 px soft edge from a signed distance
const shapes = {
  // a dark ring with a gap: a mark for a cream node tile
  'fx-node-ring.png': [480, 480, '121316', edge('min(220-hypot(X-240,Y-240),hypot(X-240,Y-240)-130)') + '*(1-gt(X,240)*lt(abs(Y-240),46))'],
  // two dark squares set corner to corner: a second mark
  'fx-node-steps.png': [480, 480, '121316', '255*(lt(abs(X-150),110)*lt(abs(Y-330),110)+lt(abs(X-330),110)*lt(abs(Y-150),110))'],
  // an accent diamond: a mark for the tool
  'fx-tool-diamond.png': [480, 480, 'FF3AB0', edge('200-abs(X-240)-abs(Y-240)')],
  // a cream sheet with dark text bars: a picture of something that goes in
  'fx-sheet.png': [640, 420, 'EDEEF1', '255*lt(abs(X-320),300)*lt(abs(Y-210),190)*(1-0.92*lt(abs(X-300),220)*lt(mod(Y-70,80),34)*gt(Y,70)*lt(Y,350))'],
};
for (const [name, [w, hgt, hex, alpha]] of Object.entries(shapes)) {
  const [r, g, b] = hex.match(/../g).map((x) => parseInt(x, 16));
  await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', `color=c=black:s=${w}x${hgt},format=rgba,geq=r=${r}:g=${g}:b=${b}:a='${alpha}'`, '-frames:v', '1', path.join(dir, name)]);
  console.log(path.relative(process.cwd(), path.join(dir, name)));
}
