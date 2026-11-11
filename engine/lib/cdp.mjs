// A minimal Chrome DevTools Protocol client: launch headless Chrome, open pages,
// evaluate, screenshot. Uses Node's built-in WebSocket; no dependencies.
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { findChrome, onExit, MotusError } from './util.mjs';

const POSIX = process.platform !== 'win32';
/**
 * Kill Chrome and every helper it started. Chrome runs in its own process group (spawned detached), so one
 * signal to the group reaches the GPU, network and renderer helpers too: killing only the main process let
 * the network helper keep writing into the profile after it was removed.
 */
function killTree(proc) {
  if (!proc?.pid) return;
  try { process.kill(POSIX ? -proc.pid : proc.pid, 'SIGKILL'); } catch { try { proc.kill('SIGKILL'); } catch { /* gone */ } }
}
const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const rmProfileSync = (dir) => { try { fss.rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 }); } catch { /* best effort */ } };

export class Browser {
  static async launch({ width = 1080, height = 1920, extraArgs = [] } = {}) {
    const bin = findChrome();
    if (!bin) throw new MotusError('No Chromium-based browser found.', 'Install Google Chrome, or set MOTUS_CHROME to the browser binary.');
    const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'motus-chrome-'));
    // If this process exits or is interrupted (Ctrl-C, an agent killing a render) while Chrome runs,
    // kill Chrome and remove its profile: no headless Chrome is ever left behind.
    const handle = { proc: null, profile };
    handle.off = onExit(() => {
      killTree(handle.proc);
      if (handle.proc) sleepSync(150);           // SIGKILL lands asynchronously: let the helpers die before removing
      rmProfileSync(profile);
    });
    try {
      return await Browser._start(bin, profile, handle, { width, height, extraArgs });
    } catch (e) {
      // a Chrome that started but never answered must not be left running
      killTree(handle.proc);
      handle.off();
      await new Promise((r) => setTimeout(r, handle.proc ? 150 : 0));
      await fs.rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
      throw e;
    }
  }

  static async _start(bin, profile, handle, { width, height, extraArgs }) {
    const args = [
      '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
      '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-component-update',
      '--hide-scrollbars', '--mute-audio', '--force-color-profile=srgb', '--force-device-scale-factor=1',
      '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
      '--disable-features=PaintHolding,CalculateNativeWinOcclusion,TranslateUI', '--autoplay-policy=no-user-gesture-required',
      '--font-render-hinting=none', '--enable-gpu-rasterization', '--ignore-gpu-blocklist',
      // finish every raster task before a frame is drawn, so a screenshot never catches low-res or missing tiles
      '--run-all-compositor-stages-before-draw',
      `--window-size=${width},${height}`, ...extraArgs, 'about:blank',
    ];
    const proc = spawn(bin, args, { stdio: ['ignore', 'ignore', 'pipe'], detached: POSIX });   // own process group: see killTree
    handle.proc = proc;
    const wsUrl = await new Promise((resolve, reject) => {
      let buf = '', found = false;
      const timer = setTimeout(() => reject(new MotusError('Chrome did not start within 20 s.', 'Close other Chrome debugging sessions and try again; set MOTUS_CHROME to use another Chromium-based browser.')), 20000);
      proc.stderr.on('data', (d) => {
        if (found) return;                         // keep draining the pipe, stop collecting Chrome's log
        buf = (buf + d.toString()).slice(-8000);
        const m = buf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (m) { found = true; clearTimeout(timer); resolve(m[1]); }
      });
      proc.on('error', (e) => { clearTimeout(timer); reject(new MotusError(`Could not start Chrome (${bin}): ${e.message}`, 'Install Google Chrome, or set MOTUS_CHROME to a Chromium-based browser binary.')); });
      proc.on('exit', (code) => { clearTimeout(timer); reject(new MotusError(`Chrome exited during start (code ${code}).\n${buf.slice(-400)}`, 'Run: motus doctor; set MOTUS_CHROME to another Chromium-based browser if this one cannot run headless.')); });
    });
    const b = new Browser(proc, profile, wsUrl, width, height);
    b.handle = handle;
    await b._connect();
    return b;
  }

  constructor(proc, profile, wsUrl, width, height) {
    this.proc = proc; this.profile = profile; this.wsUrl = wsUrl; this.width = width; this.height = height;
    this.id = 0; this.pending = new Map(); this.listeners = new Set(); this.closed = false;
  }

  _connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.addEventListener('open', () => resolve());
      this.ws.addEventListener('error', () => reject(new MotusError('Could not connect to Chrome over the DevTools protocol.')));
      this.ws.addEventListener('close', () => { this.closed = true; for (const { reject: rej } of this.pending.values()) rej(new MotusError('Chrome closed the connection.')); this.pending.clear(); });
      this.ws.addEventListener('message', (ev) => {
        const msg = JSON.parse(typeof ev.data === 'string' ? ev.data : Buffer.from(ev.data).toString());
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve: res, reject: rej, method } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) rej(new MotusError(`Chrome: ${method} failed: ${msg.error.message}`)); else res(msg.result);
        } else if (msg.method) for (const l of this.listeners) l(msg);
      });
    });
  }

  send(method, params = {}, sessionId) {
    if (this.closed) return Promise.reject(new MotusError('Chrome is not running.'));
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }

  async newPage({ width = this.width, height = this.height, scale = 1 } = {}) {
    // Each page gets its own window: background tabs of one window stop painting, which stalls parallel rendering.
    const { targetId } = await this.send('Target.createTarget', { url: 'about:blank', newWindow: true, width, height });
    const { sessionId } = await this.send('Target.attachToTarget', { targetId, flatten: true });
    const page = new Page(this, targetId, sessionId);
    await page.send('Page.enable');
    await page.send('Runtime.enable');
    await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile: false });
    return page;
  }

  async close() {
    if (!this.proc) return;
    const proc = this.proc;
    try { await this.send('Browser.close'); } catch { /* already gone */ }
    await new Promise((r) => {
      if (proc.exitCode !== null || proc.signalCode !== null) return r();
      const timer = setTimeout(() => { killTree(proc); r(); }, 3000);
      proc.once('exit', () => { clearTimeout(timer); r(); });
    });
    killTree(proc);                               // any helper still running (ESRCH when all are gone)
    try { this.ws?.close(); } catch { /* closed */ }
    this.proc = null;
    this.handle?.off();
    await fs.rm(this.profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
  }
}

export class Page {
  constructor(browser, targetId, sessionId) {
    this.browser = browser; this.targetId = targetId; this.sessionId = sessionId; this.console = [];
    browser.listeners.add((msg) => {
      if (msg.sessionId !== sessionId) return;
      if (msg.method === 'Runtime.exceptionThrown') this.console.push(`exception: ${msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text}`);
      if (msg.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(msg.params.type)) this.console.push(`${msg.params.type}: ${msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ')}`);
    });
  }
  send(method, params) { return this.browser.send(method, params, this.sessionId); }

  /** Evaluate an expression; promises are awaited. Throws with the page's own error message. */
  async eval(expression, { timeout = 60000 } = {}) {
    const r = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, timeout });
    if (r.exceptionDetails) throw new MotusError(`Page error: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
    return r.result?.value;
  }

  async goto(url, { readyExpr = 'document.readyState === "complete"', timeout = 60000 } = {}) {
    await this.send('Page.navigate', { url });
    const t0 = Date.now();
    for (;;) {
      const state = await this.eval(`(() => { try { if (window.__motusError) return {err: String(window.__motusError)}; return {ok: !!(${readyExpr})}; } catch (e) { return {ok: false}; } })()`).catch(() => ({ ok: false }));
      if (state?.err) throw new MotusError(`The stage failed to load: ${state.err}`, 'Run: motus validate <project>, and check the style module for errors.');
      if (state?.ok) return;
      if (Date.now() - t0 > timeout) throw new MotusError(`Page did not become ready within ${timeout / 1000} s: ${url}\n${this.console.slice(-5).join('\n')}`);
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  /** Screenshot the viewport. Returns a Buffer. opt: { format: 'jpeg'|'png', quality, clip:{x,y,width,height,scale}, transparent } */
  async screenshot({ format = 'jpeg', quality = 95, clip, transparent = false } = {}) {
    if (transparent) await this.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    const r = await this.send('Page.captureScreenshot', { format, ...(format === 'jpeg' ? { quality } : {}), ...(clip ? { clip } : {}), captureBeyondViewport: false, optimizeForSpeed: format === 'jpeg' });
    return Buffer.from(r.data, 'base64');
  }

  async close() { try { await this.browser.send('Target.closeTarget', { targetId: this.targetId }); } catch { /* gone */ } }
}
