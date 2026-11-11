// motus doctor: is this machine able to run the pipeline?
import { run, findChrome, STYLES } from './util.mjs';
import { listStyles } from './styles.mjs';

const first = (s) => (s || '').split('\n')[0].trim();
const tryRun = (cmd, args, opt) => run(cmd, args, opt).then((r) => ({ ok: true, ...r }), (e) => ({ ok: false, error: e.message }));

export async function doctor() {
  const checks = [];
  const add = (name, required, ok, detail, fix = '') => checks.push({ name, required, ok, detail, fix });

  const major = Number(process.versions.node.split('.')[0]);
  add('node', true, major >= 22 && typeof WebSocket === 'function', `v${process.versions.node}`, 'Install Node.js 22 or newer (https://nodejs.org).');

  const ff = await tryRun('ffmpeg', ['-hide_banner', '-version']);
  add('ffmpeg', true, ff.ok, ff.ok ? first(ff.stdout) : 'not found', 'Install ffmpeg (macOS: brew install ffmpeg) and make sure it is on PATH.');
  const fp = await tryRun('ffprobe', ['-hide_banner', '-version']);
  add('ffprobe', true, fp.ok, fp.ok ? first(fp.stdout) : 'not found', 'ffprobe ships with ffmpeg.');
  if (ff.ok) {
    const filters = await tryRun('ffmpeg', ['-hide_banner', '-filters']);
    const have = (f) => new RegExp(`\\s${f}\\s`).test(filters.stdout || '');
    const missing = ['drawtext', 'loudnorm', 'silencedetect', 'tile', 'hstack'].filter((f) => !have(f));
    add('ffmpeg filters', true, missing.length === 0, missing.length ? `missing: ${missing.join(', ')}` : 'drawtext, loudnorm, silencedetect, tile, hstack', 'Install a full ffmpeg build (the Homebrew bottle includes these).');
    const enc = await tryRun('ffmpeg', ['-hide_banner', '-encoders']);
    add('h264 encoder', true, /libx264/.test(enc.stdout || ''), /libx264/.test(enc.stdout || '') ? 'libx264' : 'libx264 missing', 'Install an ffmpeg build with libx264.');
  }

  const chrome = findChrome();
  add('chrome', true, !!chrome, chrome || 'not found', 'Install Google Chrome, or set MOTUS_CHROME to a Chromium-based browser binary.');

  const py = process.env.MOTUS_PYTHON || 'python3';
  const pv = await tryRun(py, ['-c', 'import sys; print(".".join(map(str, sys.version_info[:3])))']);
  add('python', true, pv.ok, pv.ok ? first(pv.stdout) : 'not found', 'Install Python 3.9 or newer.');
  if (pv.ok) {
    const fw = await tryRun(py, ['-c', 'import faster_whisper; print(faster_whisper.__version__)']);
    add('faster-whisper', true, fw.ok, fw.ok ? first(fw.stdout) : 'not installed', `${py} -m pip install faster-whisper   (the first transcription downloads the speech model, about 1.6 GB)`);
  }

  if (process.platform === 'darwin') {
    const sw = await tryRun('swiftc', ['--version']);
    add('swift (matte)', false, sw.ok, sw.ok ? first(sw.stdout || sw.stderr) : 'not found: no person matte or face tracking', 'Install the Xcode command line tools: xcode-select --install');
  } else {
    add('person matte', false, false, 'Apple Vision is macOS only: styles fall back to un-matted presenter framing', '');
  }

  const styles = await listStyles();
  add('style packs', true, styles.length > 0, styles.length ? styles.map((s) => `${s.id}@${s.version}`).join(', ') : `none in ${STYLES}`, 'Reinstall the plugin: the styles/ folder is missing.');

  return { ready: checks.every((c) => c.ok || !c.required), platform: process.platform, checks };
}
