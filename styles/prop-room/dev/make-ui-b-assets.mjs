#!/usr/bin/env node
// Writes the test pictures the ui-b fixture (dev/fixtures/ui-b.json) points at into <project>/assets/:
//   ui-b-page.png (+ .json)    a tall invented landing page, captured the way a plan captures a real one
//   ui-b-before.png, -after.png the same invented page plain and styled, for the before/after wipe
// The pages are written here (shapes and invented text only, set in the pack's Inter), served for the
// length of the run on a local port, and captured with the engine's own `motus capture` code, so the
// sidecar (.json with the places of the --find phrases) is real.
//   node styles/prop-room/dev/make-ui-b-assets.mjs <project>
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { capture } from '../../../engine/lib/capture.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const project = process.argv[2];
if (!project) { console.error('Usage: node styles/prop-room/dev/make-ui-b-assets.mjs <project>'); process.exit(1); }
const dir = path.resolve(project, 'assets');
await fs.mkdir(dir, { recursive: true });

const base = `
@font-face { font-family: Inter; src: url(/Inter.ttf); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
body { font-family: Inter, sans-serif; color: #1d1d22; background: #fff; }
.nav { display: flex; align-items: center; justify-content: space-between; padding: 26px 64px; }
.logo { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 22px; }
.logo i { width: 34px; height: 34px; border-radius: 10px; background: var(--a); display: block; }
.links { display: flex; gap: 34px; font-size: 17px; color: #55565c; }
.btn { display: inline-block; padding: 16px 28px; border-radius: 999px; font-weight: 600; font-size: 18px; }
`;

const page = `<!doctype html><html><head><meta charset="utf-8"><title>Example Studio</title><style>${base}
:root { --a: #3E6BE0; }
.hero { padding: 80px 64px 70px; background: linear-gradient(180deg, #F1F4FD, #FFFFFF); }
.hero h1 { font-size: 76px; line-height: 1.02; letter-spacing: -0.035em; font-weight: 800; max-width: 820px; }
.hero p { font-size: 22px; line-height: 1.5; color: #5d5f66; max-width: 640px; margin: 26px 0 34px; }
.btn.p { background: #1d1d22; color: #fff; } .btn.s { box-shadow: inset 0 0 0 2px #d7d9de; margin-left: 12px; }
.shot { margin: 56px 64px 0; height: 420px; border-radius: 20px; background: linear-gradient(135deg, #3E6BE0, #8DA9F2); position: relative; overflow: hidden; }
.shot b { position: absolute; left: 48px; top: 48px; right: 48px; bottom: -40px; background: #fff; border-radius: 14px; opacity: .92; }
.shot u { position: absolute; left: 80px; height: 18px; border-radius: 9px; background: #E3E7F2; }
h2 { font-size: 44px; letter-spacing: -0.03em; font-weight: 800; padding: 90px 64px 34px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 0 64px; }
.card { border-radius: 18px; padding: 30px; background: #F6F7F9; min-height: 220px; }
.card i { display: block; width: 52px; height: 52px; border-radius: 14px; background: var(--a); margin-bottom: 22px; }
.card h3 { font-size: 24px; margin-bottom: 10px; } .card p { font-size: 17px; line-height: 1.5; color: #62646b; }
.price { display: flex; gap: 24px; padding: 0 64px 120px; }
.plan { flex: 1; border-radius: 20px; padding: 36px; box-shadow: inset 0 0 0 2px #E4E6EA; }
.plan h3 { font-size: 26px; } .plan .n { font-size: 56px; font-weight: 800; letter-spacing: -0.03em; margin: 16px 0; }
.plan li { font-size: 18px; color: #55565c; margin: 10px 0 0 20px; }
</style></head><body>
<div class="nav"><div class="logo"><i></i>Example Studio</div><div class="links"><span>Product</span><span>Pricing</span><span>Docs</span><span>Sign in</span></div></div>
<div class="hero"><h1>Reply to every comment in one place.</h1><p>Pick a keyword, write the answer once, and let the inbox do the rest while you film the next one.</p>
<span class="btn p">Start free</span><span class="btn s">See how it works</span>
<div class="shot"><b></b><u style="top:100px;width:420px"></u><u style="top:140px;width:620px"></u><u style="top:180px;width:520px"></u><u style="top:240px;width:300px;background:#3E6BE0"></u></div></div>
<h2>Everything in the box</h2>
<div class="grid">
<div class="card"><i></i><h3>Keyword rules</h3><p>Match one word or a list of them, in any comment.</p></div>
<div class="card"><i></i><h3>Auto replies</h3><p>Send the link the moment someone asks for it.</p></div>
<div class="card"><i></i><h3>Follow gate</h3><p>Ask for a follow before the resource goes out.</p></div>
<div class="card"><i></i><h3>Message flows</h3><p>Branch a reply into a short conversation.</p></div>
<div class="card"><i></i><h3>Open source</h3><p>Run it yourself and read every line.</p></div>
<div class="card"><i></i><h3>Simple export</h3><p>Take your contacts with you as a plain file.</p></div>
</div>
<h2>Pricing</h2>
<div class="price"><div class="plan"><h3>Free plan</h3><div class="n">$0</div><ul><li>One keyword</li><li>Unlimited replies</li></ul></div>
<div class="plan"><h3>Team plan</h3><div class="n">$9</div><ul><li>Every keyword</li><li>Shared inbox</li></ul></div></div>
</body></html>`;

const pair = (styled) => `<!doctype html><html><head><meta charset="utf-8"><title>Example</title><style>${base}
:root { --a: ${styled ? '#E8643A' : '#d9dade'}; }
body { background: ${styled ? '#FFF6EF' : '#fff'}; height: 684px; overflow: hidden; }
.hero { padding: 60px 64px; }
h1 { font-size: ${styled ? 78 : 50}px; font-weight: ${styled ? 800 : 600}; letter-spacing: ${styled ? '-0.04em' : '0'}; line-height: 1.02; color: ${styled ? '#1d1d22' : '#9a9ba1'}; max-width: 760px; }
${styled ? 'h1 em { font-style: normal; color: #E8643A; }' : 'h1 em { font-style: normal; }'}
p { font-size: 20px; color: ${styled ? '#5d5f66' : '#b3b4b9'}; margin: 22px 0 30px; max-width: 560px; line-height: 1.5; }
.btn { ${styled ? 'background:#1d1d22;color:#fff' : 'box-shadow: inset 0 0 0 2px #dcdde1; color:#a3a4aa'}; }
.row { display: flex; gap: 22px; padding: 0 64px; }
.row div { flex: 1; height: 150px; border-radius: ${styled ? 22 : 6}px; background: ${styled ? '#fff' : '#f3f3f5'}; ${styled ? 'box-shadow: 0 18px 34px -20px rgba(120,60,30,.45)' : 'box-shadow: inset 0 0 0 2px #e6e6e9'}; position: relative; }
.row div::before { content: ''; position: absolute; left: 22px; top: 22px; width: 44px; height: 44px; border-radius: 50%; background: var(--a); }
.links span { color: ${styled ? '#55565c' : '#b3b4b9'}; }
</style></head><body>
<div class="nav"><div class="logo"><i></i><span style="color:${styled ? '#1d1d22' : '#a3a4aa'}">Example</span></div><div class="links"><span>Work</span><span>About</span><span>Contact</span></div></div>
<div class="hero"><h1>${styled ? 'Websites with a <em>point of view.</em>' : 'Welcome to our website'}</h1><p>${styled ? 'Small studio, big ideas. We design pages people remember.' : 'We are a company that does things. Learn more about us below.'}</p><span class="btn">${styled ? 'See the work' : 'Learn more'}</span></div>
<div class="row"><div></div><div></div><div></div></div>
</body></html>`;

const font = await fs.readFile(path.resolve(here, '../assets/fonts/Inter.ttf'));
const routes = { '/page.html': page, '/before.html': pair(false), '/after.html': pair(true) };
const server = http.createServer((req, res) => {
  if (req.url === '/Inter.ttf') { res.writeHead(200, { 'content-type': 'font/ttf' }); res.end(font); return; }
  const body = routes[req.url];
  if (!body) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(body);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  // a full-page capture frames the found text when --find is given, so measure the page first, then clip to all of it
  const full = await capture({ url: `${origin}/page.html`, out: path.join(dir, 'ui-b-page.png'), width: 1100, full: true, scale: 2, wait: 300 });
  const a = await capture({ url: `${origin}/page.html`, out: path.join(dir, 'ui-b-page.png'), width: 1100, clip: `0,0,1100,${full.clip.height}`, scale: 2,
    find: 'Auto replies|Start free|Free plan|Everything in the box', wait: 300 });
  console.log(`ui-b-page.png ${a.width}x${a.height}${a.missing.length ? ` (missing: ${a.missing.join(', ')})` : ''}`);
  for (const k of ['before', 'after']) {
    const r = await capture({ url: `${origin}/${k}.html`, out: path.join(dir, `ui-b-${k}.png`), width: 1000, height: 684, scale: 2, wait: 300 });
    console.log(`ui-b-${k}.png ${r.width}x${r.height}`);
  }
} finally {
  server.close();
}
