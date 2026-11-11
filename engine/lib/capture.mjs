// Evidence capture: screenshot a public web page (or part of it) and record where a
// phrase sits in the picture, so a style can highlight the real text.
import path from 'node:path';
import fs from 'node:fs/promises';
import { Browser } from './cdp.mjs';
import { mkdirp, writeJson, MotusError } from './util.mjs';

const FIND = (phrases) => `(() => {
  const want = ${JSON.stringify(phrases)}.map((p) => p.toLowerCase().replace(/\\s+/g, ' ').trim()).filter(Boolean);
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const el = n.parentElement;
      if (!el || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  // Build one long string of the page's visible text with a map back to nodes.
  const nodes = []; let text = '';
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const s = n.nodeValue.replace(/\\s+/g, ' ');
    nodes.push({ n, start: text.length, raw: n.nodeValue });
    text += s;
    if (!/\\s$/.test(s)) text += ' ';
  }
  const lower = text.toLowerCase();
  const locate = (pos) => {
    let lo = 0, hi = nodes.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (nodes[mid].start <= pos) lo = mid; else hi = mid - 1; }
    const e = nodes[lo];
    // map an index in the collapsed string back to an offset in the raw node text
    let i = 0, j = 0; const target = pos - e.start; let prevSpace = false;
    while (i < e.raw.length && j < target) { const sp = /\\s/.test(e.raw[i]); if (!(sp && prevSpace)) j++; prevSpace = sp; i++; }
    while (i < e.raw.length && /\\s/.test(e.raw[i]) && prevSpace && j === target && i > 0 && /\\s/.test(e.raw[i - 1])) i++;
    return { node: e.n, offset: Math.min(i, e.raw.length) };
  };
  for (const p of want) {
    const at = lower.indexOf(p);
    if (at < 0) { out.push({ text: p, found: false, rects: [] }); continue; }
    const a = locate(at), b = locate(at + p.length);
    const r = document.createRange();
    try { r.setStart(a.node, a.offset); r.setEnd(b.node, b.offset); } catch { out.push({ text: p, found: false, rects: [] }); continue; }
    const rects = [...r.getClientRects()].filter((q) => q.width > 1 && q.height > 1).map((q) => ({ x: q.left + scrollX, y: q.top + scrollY, w: q.width, h: q.height }));
    // merge rects on the same line
    const lines = [];
    for (const q of rects.sort((m, n2) => m.y - n2.y || m.x - n2.x)) {
      const l = lines[lines.length - 1];
      if (l && Math.abs(l.y - q.y) < q.h * 0.5) { const x2 = Math.max(l.x + l.w, q.x + q.w); l.x = Math.min(l.x, q.x); l.w = x2 - l.x; l.h = Math.max(l.h, q.h); }
      else lines.push({ ...q });
    }
    out.push({ text: p, found: lines.length > 0, rects: lines });
  }
  return { finds: out, page: { w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight }, title: document.title };
})()`;

/**
 * opt: { url, out, find (string, or several separated by "|"), width, height, dark, clip "x,y,w,h" (page px),
 *        selector, full, wait (ms), scale, hide (css selectors, comma separated), aspect (w/h of the clip around a find) }
 * Writes the PNG and `<out>.json`: { url, title, width, height, scale, clip, finds:[{text, found, rects:[{x,y,w,h}] in image px}] }
 */
export async function capture(opt) {
  let url;
  try { url = new URL(opt.url); } catch { throw new MotusError(`Not a URL: ${opt.url}`); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new MotusError('Only http and https pages can be captured.');
  const out = path.resolve(opt.out);
  if (!/\.png$/i.test(out)) throw new MotusError('--out must end in .png');
  const width = Math.max(320, Math.min(2400, opt.width || 1200));
  const height = opt.height || Math.round(width * 0.8);
  const scale = Math.max(1, Math.min(3, opt.scale || 2));
  const phrases = opt.find ? String(opt.find).split('|').map((s) => s.trim()).filter(Boolean) : [];

  const browser = await Browser.launch({ width, height });
  try {
    const page = await browser.newPage({ width, height, scale });
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: opt.dark ? 'dark' : 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }] });
    await page.goto(url.href, { timeout: 45000 });
    await new Promise((r) => setTimeout(r, opt.wait ?? 800));
    if (opt.hide) await page.eval(`for (const el of document.querySelectorAll(${JSON.stringify(opt.hide)})) el.style.setProperty('display', 'none', 'important')`);
    // freeze animations and carets so the capture is stable
    await page.eval(`(() => { const s = document.createElement('style'); s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}'; document.head.append(s); })()`);

    const info = await page.eval(FIND(phrases));
    let clip = null;
    if (opt.clip) {
      const [x, y, w, h] = String(opt.clip).split(',').map(Number);
      if (![x, y, w, h].every(Number.isFinite) || w <= 0 || h <= 0) throw new MotusError('--clip must be x,y,w,h in page pixels.');
      clip = { x, y, width: w, height: h };
    } else if (opt.selector) {
      const r = await page.eval(`(() => { const el = document.querySelector(${JSON.stringify(opt.selector)}); if (!el) return null; el.scrollIntoView({block:'center'}); const q = el.getBoundingClientRect(); return { x: q.left + scrollX, y: q.top + scrollY, width: q.width, height: q.height }; })()`);
      if (!r) throw new MotusError(`Nothing on the page matches the selector ${opt.selector}`);
      clip = r;
    } else if (phrases.length && info.finds.some((f) => f.found)) {
      // frame the found text: full page width, a window of the requested aspect centred on the text
      const rects = info.finds.flatMap((f) => f.rects);
      const y0 = Math.min(...rects.map((r) => r.y)), y1 = Math.max(...rects.map((r) => r.y + r.h));
      const h = Math.round(width / (opt.aspect || 1.5));
      const top = Math.max(0, Math.min(info.page.h - h, Math.round((y0 + y1) / 2 - h / 2)));
      clip = { x: 0, y: Math.max(0, top), width, height: Math.min(h, info.page.h) };
    } else if (opt.full) {
      clip = { x: 0, y: 0, width: info.page.w, height: Math.min(info.page.h, 12000) };
    } else {
      clip = { x: 0, y: 0, width, height };
    }
    const shot = await page.send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 }, captureBeyondViewport: true });
    await mkdirp(path.dirname(out));
    await fs.writeFile(out, Buffer.from(shot.data, 'base64'));
    const finds = info.finds.map((f) => ({
      text: f.text, found: f.found,
      rects: f.rects.map((r) => ({ x: Math.round((r.x - clip.x) * scale), y: Math.round((r.y - clip.y) * scale), w: Math.round(r.w * scale), h: Math.round(r.h * scale) }))
        .filter((r) => r.x + r.w > 0 && r.y + r.h > 0 && r.x < clip.width * scale && r.y < clip.height * scale),
    }));
    const meta = { url: url.href, title: info.title, capturedAt: new Date().toISOString(), dark: !!opt.dark, scale, width: Math.round(clip.width * scale), height: Math.round(clip.height * scale), clip, finds };
    await writeJson(`${out}.json`, meta);
    return { file: out, meta: `${out}.json`, ...meta, missing: finds.filter((f) => !f.found).map((f) => f.text) };
  } finally {
    await browser.close();
  }
}
