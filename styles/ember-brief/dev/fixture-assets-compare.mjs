#!/usr/bin/env node
// Writes the placeholder pictures and the clip that dev/fixtures/compare.json points at into <project>/assets/.
// Everything is drawn here with ffmpeg expressions: plain shaded shapes on transparency and a box that moves.
// No logo, mascot, person, screenshot, interface or footage from anywhere.
//   node styles/ember-brief/dev/fixture-assets-compare.mjs <project>
import path from 'node:path';
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const project = process.argv[2];
if (!project) { console.error('Usage: node styles/ember-brief/dev/fixture-assets-compare.mjs <project>'); process.exit(1); }
const dir = path.resolve(project, 'assets');
await fs.mkdir(dir, { recursive: true });
const ff = (args) => run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);

const ACCENT = [255, 58, 176];   // colour.accent (release palette)
// 1 inside a rounded rectangle centred on (cx, cy)
const rrect = (cx, cy, w, h, r) => `lte(hypot(max(abs(X-${cx})-${w / 2 - r},0),max(abs(Y-${cy})-${h / 2 - r},0)),${r})`;
// an rgba picture from a grey expression, an accent mask and an alpha expression
const cut = (w, h, grey, accent, alpha) => ['-f', 'lavfi', '-i',
  `color=c=black@0:s=${w}x${h},format=rgba,geq=${[0, 1, 2].map((k) => `${'rgb'[k]}='if(${accent},${ACCENT[k]},${grey})'`).join(':')}:a='255*(${alpha})'`, '-frames:v', '1'];

const jobs = [
  // a sheet: a shaded page with dark bars and an accent tab (556 x 792, twice the size it is shown at)
  ['fx-cut-sheet.png', cut(556, 792,
    `if(between(mod(Y-250,96),0,36)*between(X,80,476-140*lt(mod(Y-250,192),96))*between(Y,250,700),52,236-120*(0.35*X/556+0.65*Y/792))`,
    `between(X,80,190)*lt(Y,150)`, rrect(278, 396, 556, 792, 44))],
  // a ball: smooth shading from a light at the upper left, with an accent band (556 x 556)
  ['fx-cut-ball.png', cut(556, 556,
    `clip(250-230*hypot(X-190,Y-170)/420,24,250)`,
    `between(Y,330,392)`, `lte(hypot(X-278,Y-278),276)`)],
  // a stack: three overlapping cards, back to front darker to lighter, an accent disc on the front one (556 x 346)
  ['fx-cut-stack.png', cut(556, 346,
    `if(${rrect(376, 226, 360, 240, 26)},228-60*Y/346,if(${rrect(278, 173, 360, 240, 26)},150,84))`,
    `lte(hypot(X-470,Y-270),40)`,
    `max(${rrect(180, 120, 360, 240, 26)},max(${rrect(278, 173, 360, 240, 26)},${rrect(376, 226, 360, 240, 26)}))`)],
  // a mark on transparency: a dark ring round a dot (256 x 256)
  ['fx-mark-cut.png', ['-f', 'lavfi', '-i', `color=c=black@0:s=256x256,format=rgba,geq=r=25:g=26:b=29:a='255*max(between(hypot(X-128,Y-128),66,104),lte(hypot(X-128,Y-128),30))'`, '-frames:v', '1']],
  // a 2 second clip on a dark ground: a cream box that crosses the frame once and an accent bar that grows with it.
  // 60 frames at 30 fps, so a still shows which frame of the loop it holds
  ['fx-loop.mp4', ['-f', 'lavfi', '-i', 'color=c=0x1B1C1F:s=1280x720:r=30:d=2', '-f', 'lavfi', '-i', 'color=c=0xEDEEF1:s=150x150:r=30:d=2', '-f', 'lavfi', '-i', 'color=c=0xFF3AB0:s=1280x20:r=30:d=2',
    '-filter_complex', "[0][1]overlay=x='80+n*16':y=285[a];[a][2]overlay=x='-1280+n*21.3':y=640,format=yuv420p", '-c:v', 'libx264', '-g', '10', '-crf', '14', '-movflags', '+faststart', '-an']],
];
for (const [name, args] of jobs) { await ff([...args, path.join(dir, name)]); console.log(path.relative(process.cwd(), path.join(dir, name))); }
