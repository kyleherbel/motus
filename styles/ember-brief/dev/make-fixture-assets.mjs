#!/usr/bin/env node
// Writes the placeholder pictures that the dev fixtures (dev/fixtures/*.json) point at into
// <project>/assets/, so a fresh clone can validate and render every fixture. Everything here is
// invented: pages with made-up text served from a local port and captured with the engine's own
// capture, and pictures drawn with ffmpeg test sources. No real logos, screenshots, posts or footage.
//   node styles/ember-brief/dev/make-fixture-assets.mjs <project>
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { capture } from '../../../engine/lib/capture.mjs';

const run = promisify(execFile);
const project = process.argv[2];
if (!project) { console.error('Usage: node styles/ember-brief/dev/make-fixture-assets.mjs <project>'); process.exit(1); }
const dir = path.resolve(project, 'assets');
await fs.mkdir(dir, { recursive: true });

// ---- invented pages, at the width that gives the reference's reading size on the 1000 px column
const page = (dark, body) => `<!doctype html><meta charset="utf-8"><title>Fixture page</title>
<style>
  html, body { margin: 0; background: ${dark ? '#080A09' : '#FFFFFF'}; }
  #post { width: 330px; box-sizing: border-box; padding: 16px 14px; font: 400 16px/1.48 -apple-system, "Helvetica Neue", Arial, sans-serif; color: ${dark ? '#B9B7B0' : '#0F1419'}; }
  p { margin: 0 0 12px; } p:last-child { margin: 0; }
  h1 { font-size: 19px; line-height: 1.3; margin: 0 0 10px; }
  .row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-top: 1px solid ${dark ? '#24221E' : '#E6E6E6'}; }
  .dot { width: 14px; height: 14px; border-radius: 4px; background: ${dark ? '#3A3833' : '#D0D0D0'}; }
</style><div id="post">${body}</div>`;
const pages = {
  '/post': page(false, `<p>Set this up on a Sunday afternoon and it has run every week since.</p>
    <p>It reads the whole folder, finds the model number on its own and removes 25 files nobody opened.</p>
    <p>Took about fifteen minutes from start to finish.</p>`),
  '/repo': page(false, `<h1>fieldnotes / tidy-folder</h1><p>A small tool that sorts a folder by what is inside each file.</p>
    <div class="row"><span class="dot"></span>Works on 300+ file types</div>
    <div class="row"><span class="dot"></span>Nothing is deleted, only moved</div>
    <div class="row"><span class="dot"></span>One command to undo</div>`),
  '/dark': page(true, `<p>We trained it on real conversations between two people who had never met.</p>
    <p>The result is a voice that pauses, laughs and changes its mind half way through a sentence.</p>`),
};
const server = http.createServer((req, res) => {
  const body = pages[req.url];
  res.writeHead(body ? 200 : 404, { 'content-type': 'text/html; charset=utf-8' });
  res.end(body || 'not found');
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const shots = [
  ['/post', 'fx-post.png', 'finds the model number|25 files', false],
  ['/repo', 'fx-repo.png', 'Works on 300+ file types|One command to undo', false],
  ['/dark', 'fx-dark.png', 'pauses, laughs and changes its mind', true],
];
try {
  for (const [url, name, find, dark] of shots) {
    const r = await capture({ url: origin + url, out: path.join(dir, name), find, width: 330, height: 400, scale: 3, selector: '#post', dark, wait: 200 });
    console.log(path.relative(process.cwd(), r.file), r.missing.length ? `(missing: ${r.missing.join(', ')})` : '');
  }
} finally { server.close(); }

// ---- pictures: an abstract dark scene for the opening slot, a small picture, a square mark
const ff = (args) => run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
const jobs = [
  // 1.86:1 like the opening slot: a near-black ground with a soft magenta disc and a pale bar (shapes, nothing else)
  ['fx-illustration.png', ['-f', 'lavfi', '-i', "color=c=0x0B0C0E:s=2160x1160,format=rgb24,geq=r='clip(11+216*exp(-(pow(X-1080,2)+pow(Y-560,2))/90000)+54*lt(abs(Y-860),14)*lt(abs(X-1080),700),0,255)':g='clip(12+40*exp(-(pow(X-1080,2)+pow(Y-560,2))/90000)+56*lt(abs(Y-860),14)*lt(abs(X-1080),700),0,255)':b='clip(14+147*exp(-(pow(X-1080,2)+pow(Y-560,2))/90000)+59*lt(abs(Y-860),14)*lt(abs(X-1080),700),0,255)'", '-frames:v', '1']],
  ['fx-picture.png', ['-f', 'lavfi', '-i', "color=c=0x191A1D:s=900x600,format=rgb24,geq=r='clip(25+202*lt(hypot(X-450,Y-300),150),0,255)':g='clip(26+26*lt(hypot(X-450,Y-300),150),0,255)':b='clip(29+132*lt(hypot(X-450,Y-300),150),0,255)'", '-frames:v', '1']],
  ['fx-mark.png', ['-f', 'lavfi', '-i', "color=c=0xEDEEF1:s=256x256,format=rgb24,geq=r='237-212*lt(abs(X-128)+abs(Y-128),70)':g='238-212*lt(abs(X-128)+abs(Y-128),70)':b='241-212*lt(abs(X-128)+abs(Y-128),70)'", '-frames:v', '1']],
];
for (const [name, args] of jobs) { await ff([...args, path.join(dir, name)]); console.log(path.relative(process.cwd(), path.join(dir, name))); }
