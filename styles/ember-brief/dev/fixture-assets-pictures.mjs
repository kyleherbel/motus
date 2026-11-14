#!/usr/bin/env node
// Writes the placeholder pictures that dev/fixtures/pictures.json points at into <project>/assets/.
// Everything is drawn here with ffmpeg expressions: dots, discs, bars and boxes. No logo, mascot, person,
// screenshot or interface from anywhere. Sizes are twice the size the fixture shows them at.
//   node styles/ember-brief/dev/fixture-assets-pictures.mjs <project>
import path from 'node:path';
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const project = process.argv[2];
if (!project) { console.error('Usage: node styles/ember-brief/dev/fixture-assets-pictures.mjs <project>'); process.exit(1); }
const dir = path.resolve(project, 'assets');
await fs.mkdir(dir, { recursive: true });
const ff = (args) => run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);

const CREAM = [237, 238, 241], ACCENT = [255, 58, 176], FIELD = [18, 19, 22];   // colour.cream, .accent, .field (release palette)

/**
 * A ball of dots: a staggered 16 px lattice whose dots grow with the light, cream with one accent band.
 * (cx, cy, rx, ry) is the ellipse it fills. Returns the geq prefix that leaves the dot coverage (0..1) in
 * register 8 and the band flag in register 9.
 */
const ball = (cx, cy, rx, ry) => [
  'st(0,mod(floor(Y/16),2)*8)',
  'st(1,floor((X+ld(0))/16)*16+8-ld(0))',
  'st(2,floor(Y/16)*16+8)',
  `st(3,(ld(1)-${cx})/${rx})`, `st(4,(ld(2)-${cy})/${ry})`,
  'st(5,1-ld(3)*ld(3)-ld(4)*ld(4))',
  'st(6,clip(0.15+0.85*(-0.5*ld(3)-0.5*ld(4)+0.7*sqrt(max(ld(5),0))),0.08,1))',
  'st(8,gt(ld(5),0)*clip(8.6*sqrt(ld(6))-hypot(X-ld(1),Y-ld(2))+0.5,0,1))',
  'st(9,lt(abs(ld(4)+0.25*ld(3)-0.1),0.11))',
].join('*0+');
const ink = (k) => `(${CREAM[k]}+(${ACCENT[k]}-${CREAM[k]})*ld(9))`;

// a flat mark: an accent plate with rounded corners, three bars cut out of it and a cream disc
const plate = (w, h, r) => [
  `st(0,max(abs(X-${w / 2})-${w / 2 - r},0))`, `st(1,max(abs(Y-${h / 2})-${h / 2 - r},0))`,
  `st(2,clip(${r}-hypot(ld(0),ld(1))+0.5,0,1))`,
  `st(3,between(X,150,${w * 0.56})*(between(Y,${h * 0.22},${h * 0.22 + 70})+between(Y,${h * 0.46},${h * 0.46 + 70})*lt(X,${w * 0.44})+between(Y,${h * 0.70},${h * 0.70 + 70})*lt(X,${w * 0.50})))`,
  `st(4,lt(hypot(X-${w * 0.78},Y-${h / 2}),${h * 0.17}))`,
].join('*0+');

const box = (x, y, w, h, c) => `drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=0x${c}:t=fill`;

const jobs = [
  // a cut-out on transparency whose ink touches all four sides: 794 x 771 at the size it is shown
  ['fx-cutout.png', ['-f', 'lavfi', '-i', `color=c=black@0:s=1588x1542,format=rgba,geq=r='${ball(794, 771, 794, 771)}*0+${ink(0)}':g='${ball(794, 771, 794, 771)}*0+${ink(1)}':b='${ball(794, 771, 794, 771)}*0+${ink(2)}':a='${ball(794, 771, 794, 771)}*0+255*ld(8)'`, '-frames:v', '1']],
  // the same kind of picture on an opaque ground of the field colour, with room round the ink
  ['fx-ground.png', ['-f', 'lavfi', '-i', `color=c=black:s=1772x1328,format=rgb24,geq=${[0, 1, 2].map((k) => `${'rgb'[k]}='${ball(886, 664, 800, 590)}*0+${FIELD[k]}+(${ink(k)}-${FIELD[k]})*ld(8)'`).join(':')}`, '-frames:v', '1']],
  // a flat mark on transparency: 634 x 432 at the size it is shown
  ['fx-icon.png', ['-f', 'lavfi', '-i', `color=c=black@0:s=1268x864,format=rgba,geq=r='${plate(1268, 864, 73)}*0+${ACCENT[0]}+(${CREAM[0]}-${ACCENT[0]})*ld(4)':g='${plate(1268, 864, 73)}*0+${ACCENT[1]}+(${CREAM[1]}-${ACCENT[1]})*ld(4)':b='${plate(1268, 864, 73)}*0+${ACCENT[2]}+(${CREAM[2]}-${ACCENT[2]})*ld(4)':a='${plate(1268, 864, 73)}*0+255*ld(2)*(1-ld(3))'`, '-frames:v', '1']],
  // two opaque wide pictures for the stacked pair: a crowded one and a calm one (811 x 441 at the size shown)
  ['fx-before.png', ['-f', 'lavfi', '-i', 'color=c=0x1D2430:s=1622x882', '-vf', [
    box(60, 60, 900, 150, 'D9A441'), box(1000, 60, 562, 150, '8C3B3B'), box(60, 250, 440, 240, '3D6FB8'), box(530, 250, 300, 240, 'B8B23D'),
    box(860, 250, 330, 110, '6A4FB0'), box(860, 380, 330, 110, '2F8F6B'), box(1220, 250, 342, 240, 'C4572E'),
    ...[0, 1, 2, 3, 4, 5, 6].map((k) => box(60 + k * 218, 540, 190, 120, ['E4E0D8', '54789E', 'AD4B7A', 'E0A030', '4A9A8A', '7B5FC0', 'C8C4BC'][k])),
    box(60, 700, 1502, 50, '3A4352'), box(60, 780, 1100, 50, '3A4352'),
  ].join(','), '-frames:v', '1']],
  ['fx-after.png', ['-f', 'lavfi', '-i', 'color=c=0x16121C:s=1622x882', '-vf', [
    box(60, 60, 520, 60, '3A3340'), box(60, 180, 1502, 330, '5A2A3A'),
    ...[0, 1, 2, 3].map((k) => box(60 + k * 383, 570, 353, 252, ['E4E0D8', '3D6FB8', 'C4572E', '4A9A8A'][k])),
  ].join(','), '-frames:v', '1']],
  // a portrait screen for the phone: a header block and a grid of tiles (1:2)
  ['fx-screen.png', ['-f', 'lavfi', '-i', 'color=c=0x191A1D:s=780x1560', '-vf', [
    box(60, 150, 660, 300, 'FF3AB0'), box(100, 210, 300, 44, '191A1D'), box(100, 290, 440, 44, '191A1D'),
    ...[0, 1, 2, 3, 4, 5].map((k) => box(60 + (k % 2) * 345, 510 + Math.floor(k / 2) * 320, 315, 290, k === 3 ? 'EDEEF1' : '28292C')),
  ].join(','), '-frames:v', '1']],
  // a clip: a box that travels 5 px per frame on a pale ground, and a bar that grows 6 px per frame
  // (so a still shows which frame of the clip it holds). 16:9, 30 fps, 6 s.
  ['fx-clip.mp4', ['-f', 'lavfi', '-i', 'color=c=0xE9EEF0:s=1280x720:r=30:d=6', '-f', 'lavfi', '-i', 'color=c=0x3355DD:s=140x140:r=30:d=6', '-f', 'lavfi', '-i', 'color=c=0x191A1D:s=1280x24:r=30:d=6',
    '-filter_complex', "[0][1]overlay=x='60+n*5':y=260[a];[a][2]overlay=x='-1280+n*6':y=696,format=yuv420p", '-c:v', 'libx264', '-g', '15', '-crf', '16', '-movflags', '+faststart', '-an']],
];
for (const [name, args] of jobs) { await ff([...args, path.join(dir, name)]); console.log(path.relative(process.cwd(), path.join(dir, name))); }
