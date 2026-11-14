#!/usr/bin/env node
// Placeholder pictures and marks for dev/fixtures/annotate.json, written into <project>/assets/.
// Everything is drawn here with ffmpeg expressions: shaded boxes, a ball, a mound, bars and discs. No logo,
// mascot, person, product or interface from anywhere. Pictures are twice the size the fixture shows them at.
//   node styles/ember-brief/dev/fixture-assets-annotate.mjs <project>
import path from 'node:path';
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const project = process.argv[2];
if (!project) { console.error('Usage: node styles/ember-brief/dev/fixture-assets-annotate.mjs <project>'); process.exit(1); }
const dir = path.resolve(project, 'assets');
await fs.mkdir(dir, { recursive: true });

const ACCENT = [255, 58, 176];   // colour.accent (release palette)
const seq = (...parts) => parts.join('*0+');             // run the parts in order, keep the last value
const edge = (d) => `clip((${d})+0.5,0,1)`;              // a 1 px soft edge from a signed distance (inside > 0)

// A picture = registers: 7 the alpha (0..1), 8 the grey tone (0..1), 9 the accent flag (0 or 1).
const rgba = (w, h, prog) => {
  const ch = (k) => `'${prog}*0+255*(ld(9)*${(ACCENT[k] / 255).toFixed(4)}+(1-ld(9))*ld(8))'`;
  return ['-f', 'lavfi', '-i', `color=c=black@0:s=${w}x${h},format=rgba,geq=r=${ch(0)}:g=${ch(1)}:b=${ch(2)}:a='${prog}*0+255*ld(7)'`, '-frames:v', '1'];
};

// 1. A wide slab: a lid standing on a broader base, shown 924 x 620 inside a 1000 x 671 frame, so its top corners
// are not the frame's. An accent bar on the lid. (Drawn at 2x: 2000 x 1342, the object at 76, 51.)
const slab = seq(
  'st(0,X-76)', 'st(1,Y-51)',
  // lid: x 188..1664, y 0..820
  'st(2,min(min(ld(0)-188,1664-ld(0)),min(ld(1),820-ld(1))))',
  // base: y 828..1240, widening from 194..1680 to 0..1848
  'st(3,(ld(1)-828)/412)',
  'st(4,min(min(ld(0)-194*(1-ld(3)),1680+168*ld(3)-ld(0)),min(ld(1)-828,1240-ld(1))))',
  `st(7,max(${edge('ld(2)')},${edge('ld(4)')}))`,
  // tone: a bright lid that darkens a little downward inside a darker rim; a base with rows and a dark front
  'st(5,gt(ld(2),0))',
  'st(8,ld(5)*if(lt(ld(2),26),0.55,0.93-0.12*ld(1)/820)+(1-ld(5))*clip(0.62-0.45*ld(3)+0.22*lt(mod(ld(1)-828,44),24)*lt(ld(3),0.55),0.06,1))',
  'st(9,ld(5)*between(ld(0),520,1330)*between(ld(1),370,450))',
);

// 2. A ball and a can: smooth shading from light to dark, one accent disc. Shown 1000 x 760 (drawn 2000 x 1520).
const shaded = seq(
  'st(0,(X-660)/500)', 'st(1,(Y-800)/500)', 'st(2,1-ld(0)*ld(0)-ld(1)*ld(1))',
  'st(3,clip(0.10+0.90*(-0.52*ld(0)-0.60*ld(1)+0.61*sqrt(max(ld(2),0))),0.08,1))',
  'st(4,min(min(X-1240,1800-X),min(Y-460,1300-Y)))',
  'st(5,clip(0.20+0.72*(1-pow((X-1480)/300,2)),0.12,1))',
  `st(7,max(${edge('500-hypot(X-660,Y-800)')},${edge('ld(4)')}))`,
  'st(8,if(gt(ld(2),0),ld(3),ld(5)))',
  'st(9,lt(hypot(X-1520,Y-660),92))',
);

// 3. A mound for the figure that fills: shown 611 x 452 (drawn 1222 x 904). Lit from the left, banded, an accent
// disc under the top.
const mound = seq(
  'st(0,abs(X-611)/611)', 'st(1,Y/904)',
  'st(2,ld(1)-pow(ld(0),1.35))',
  `st(7,${edge('min(ld(2)*700,904-Y)')})`,
  'st(8,clip(0.78-0.50*(X/1222)+0.16*lt(mod(Y+0.35*X,90),40)-0.25*pow(ld(1),3),0.07,1))',
  'st(9,lt(hypot(X-611,Y-200),54))',
);

// 4. A tall narrow object, shown 264 x 681 (drawn 528 x 1362): a rod on a rounded body with a ribbed panel.
const tall = seq(
  'st(0,min(min(X-70,150-X),min(Y,300-Y)))',
  'st(1,max(abs(X-264)-204,0))', 'st(2,max(abs(Y-820)-482,0))', 'st(3,60-hypot(ld(1),ld(2)))',
  `st(7,max(${edge('ld(0)')},${edge('ld(3)')}))`,
  'st(8,clip(0.86-0.62*(X/528)+0.20*between(X,150,400)*between(Y,560,1000)*lt(mod(Y,46),22),0.08,1))',
  'st(9,between(X,8,64)*between(Y,620,860))',
);

// a flat mark: an alpha expression on a square canvas, one colour
const flat = (size, hex, alpha) => {
  const [r, g, b] = hex.match(/../g).map((x) => parseInt(x, 16));
  return ['-f', 'lavfi', '-i', `color=c=black@0:s=${size},format=rgba,geq=r=${r}:g=${g}:b=${b}:a='255*(${alpha})'`, '-frames:v', '1'];
};
const pill = (cx, cy, hw, r) => edge(`${r}-hypot(max(abs(X-${cx})-${hw - r},0),Y-${cy})`);

const jobs = [
  ['fx-an-slab.png', rgba(2000, 1342, slab)],
  ['fx-an-shaded.png', rgba(2000, 1520, shaded)],
  ['fx-an-mound.png', rgba(1222, 904, mound)],
  ['fx-an-tall.png', rgba(528, 1362, tall)],
  // a stand-in for a wordmark: three dark strokes and a dot, 330 x 110 (shown 165 x 55)
  ['fx-an-wordmark.png', flat('330x110', '121316', `max(max(${pill(60, 55, 60, 22)},${pill(180, 55, 44, 22)}),max(${pill(270, 55, 26, 22)},${edge('14-hypot(X-314,Y-92)')}))`)],
  // two marks for tiles: a dark ring with a gap, and an accent square standing on its corner
  ['fx-an-mark-a.png', flat('480x480', '121316', `${edge('min(210-hypot(X-240,Y-240),hypot(X-240,Y-240)-120)')}*(1-lt(abs(Y-240),46)*gt(X,240))`)],
  ['fx-an-mark-b.png', flat('480x480', 'FF3AB0', edge('200-abs(X-240)-abs(Y-240)'))],
];
for (const [name, args] of jobs) {
  await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args, path.join(dir, name)]);
  console.log(path.relative(process.cwd(), path.join(dir, name)));
}
