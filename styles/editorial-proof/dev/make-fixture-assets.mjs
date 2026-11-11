#!/usr/bin/env node
// Writes the placeholder images and clips that the dev fixtures (dev/fixtures/*.json) point at into
// <project>/assets/, so a fresh clone can validate and render every fixture. Everything is generated
// with ffmpeg test sources and Inter: no real logos, screenshots or footage.
//   node styles/editorial-proof/dev/make-fixture-assets.mjs <project>
import path from 'node:path';
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const here = path.dirname(fileURLToPath(import.meta.url));
const font = path.resolve(here, '../assets/fonts/Inter.ttf').replace(/\\/g, '/').replace(/:/g, '\\:');
const project = process.argv[2];
if (!project) { console.error('Usage: node styles/editorial-proof/dev/make-fixture-assets.mjs <project>'); process.exit(1); }
const dir = path.resolve(project, 'assets');
await fs.mkdir(dir, { recursive: true });

const text = (t, size, colour, extra = '') => `drawtext=fontfile='${font}':text='${t}':fontsize=${size}:fontcolor=${colour}:x=(w-tw)/2:y=(h-th)/2${extra}`;
const still = (name, w, h, label) => ['-f', 'lavfi', '-i', `gradients=s=${w}x${h}:c0=0x1d3b8a:c1=0x8fb3f0:x0=0:y0=0:x1=${w}:y1=${h}:seed=1,format=rgb24,${text(label, Math.round(h / 8), 'white')}`, '-frames:v', '1', path.join(dir, name)];
const counter = (name, fps, seconds) => ['-f', 'lavfi', '-i', `testsrc2=s=1280x720:r=${fps}:d=${seconds},${text(`${fps} fps  frame %{n}`, 64, 'white', ':box=1:boxcolor=black@0.6:boxborderw=18')}`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(dir, name)];

const jobs = [
  still('test-still-wide.png', 1600, 900, 'Wide still 16\\:9'),
  still('test-still-tall.png', 900, 1200, 'Tall still 3\\:4'),
  still('example.png', 1800, 1200, 'Example page'),
  counter('test-counter-24.mp4', 24, 6),
  counter('test-counter-30.mp4', 30, 8),
  // a plain white mark on transparency, and a dark wordmark on transparency (generic shapes, no brand)
  ['-f', 'lavfi', '-i', "color=c=black@0:s=512x512,format=rgba,geq=r=255:g=255:b=255:a='255*lte(hypot(X-256\\,Y-256)\\,200)*gte(hypot(X-256\\,Y-256)\\,110)'", '-frames:v', '1', path.join(dir, 'logo-icon-white.png')],
  ['-f', 'lavfi', '-i', `color=c=black@0:s=1247x260,format=rgba,${text('Northwind', 170, '0x111111')}`, '-frames:v', '1', path.join(dir, 'logo-wide.png')],
];
for (const args of jobs) {
  await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
  console.log(path.relative(process.cwd(), args[args.length - 1]));
}
