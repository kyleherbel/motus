#!/usr/bin/env node
// Build the small style preview the app shows on each "Pick a look" card: three short clips from a real
// render of the style, side by side with rounded corners, as a silent looping VP9 WebM with transparency
// (preview.webm) and a still from three quarters in (preview.webp). Use only renders of your own footage.
//
// Usage: node styles/_tools/make-preview.mjs <style-id> <render.mp4> <t1> <t2> <t3> [--dur 2.5]
// Then add to the style's manifest head: "preview": { "video": "preview.webm", "poster": "preview.webp" }
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const di = args.indexOf('--dur');
const dur = di >= 0 ? Number(args.splice(di, 2)[1]) : 2.5;
const [id, src, ...times] = args;
if (!id || !src || times.length !== 3 || times.some((t) => !Number.isFinite(Number(t)))) {
  console.error('Usage: make-preview.mjs <style-id> <render.mp4> <t1> <t2> <t3> [--dur 2.5]');
  process.exit(1);
}
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', id);
const TW = 176, TH = 312, GAP = 8, R = 18, W = TW * 3 + GAP * 2;
// alpha 0 outside a rounded rectangle; 1 px of anti-aliasing at the corner arcs
const round = `geq=lum='p(X,Y)':cb='p(X,Y)':cr='p(X,Y)':a='255*clip(${R}+0.5-hypot(max(${R}-X,0)+max(X-(W-1-${R}),0),max(${R}-Y,0)+max(Y-(H-1-${R}),0)),0,1)'`;
const tiles = times.map((t, i) => `[0:v]trim=start=${t}:duration=${dur},setpts=PTS-STARTPTS,fps=30,scale=${TW}:${TH}:flags=lanczos,format=yuva420p,${round}[t${i}]`);
const graph = [
  ...tiles,
  `color=c=black@0.0:s=${W}x${TH}:r=30:d=${dur},format=yuva420p[bg]`,
  `[bg][t0]overlay=0:0:format=auto[a]`, `[a][t1]overlay=${TW + GAP}:0:format=auto[b]`, `[b][t2]overlay=${(TW + GAP) * 2}:0:format=auto,format=yuva420p[out]`,
].join(';');
const ff = (...a) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a], { stdio: 'inherit' });
const webm = path.join(dir, 'preview.webm'), webp = path.join(dir, 'preview.webp');
ff('-i', src, '-filter_complex', graph, '-map', '[out]', '-an', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-deadline', 'good', '-auto-alt-ref', '0', webm);
// the still is taken three quarters in, after each clip's element has landed
ff('-c:v', 'libvpx-vp9', '-ss', String(dur * 0.75), '-i', webm, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '82', '-lossless', '0', webp);
console.log(JSON.stringify({ id, video: path.relative(process.cwd(), webm), poster: path.relative(process.cwd(), webp), size: `${W}x${TH}`, seconds: dur }));
