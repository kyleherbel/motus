// motus doctor: is this machine able to run the pipeline?
import { run, findChrome, findPython, STYLES } from './util.mjs';
import { listStyles } from './styles.mjs';

const first = (s) => (s || '').split('\n')[0].trim();
const tryRun = (cmd, args, opt) => run(cmd, args, opt).then((r) => ({ ok: true, ...r }), (e) => ({ ok: false, error: e.message }));

/** How to install each requirement on this system. A new terminal is needed on Windows for PATH changes. */
export function installHints(platform = process.platform) {
  if (platform === 'win32') {
    return {
      node: 'Install Node.js 22 or newer: winget install OpenJS.NodeJS.LTS (or https://nodejs.org), then open a new terminal.',
      ffmpeg: 'Install ffmpeg: winget install Gyan.FFmpeg, then open a new terminal so it is on PATH.',
      ffmpegFull: 'Install a full ffmpeg build: winget install Gyan.FFmpeg (the gyan.dev builds include these).',
      chrome: 'Install Google Chrome or Microsoft Edge (Edge ships with Windows), or set MOTUS_CHROME to the browser .exe.',
      python: 'Install Python 3.9 or newer: winget install Python.Python.3.12 (or https://python.org), then open a new terminal.',
    };
  }
  if (platform === 'darwin') {
    return {
      node: 'Install Node.js 22 or newer (https://nodejs.org).',
      ffmpeg: 'Install ffmpeg (macOS: brew install ffmpeg) and make sure it is on PATH.',
      ffmpegFull: 'Install a full ffmpeg build (the Homebrew bottle includes these).',
      chrome: 'Install Google Chrome, or set MOTUS_CHROME to a Chromium-based browser binary.',
      python: 'Install Python 3.9 or newer (brew install python, or https://python.org).',
    };
  }
  return {
    node: 'Install Node.js 22 or newer (https://nodejs.org).',
    ffmpeg: 'Install ffmpeg with your package manager (for example: sudo apt install ffmpeg) and make sure it is on PATH.',
    ffmpegFull: 'Install a full ffmpeg build with libx264 and libfreetype (the Debian and Ubuntu packages include these).',
    chrome: 'Install Google Chrome or Chromium, or set MOTUS_CHROME to a Chromium-based browser binary.',
    python: 'Install Python 3.9 or newer with your package manager.',
  };
}

export async function doctor() {
  const checks = [];
  const hint = installHints();
  const add = (name, required, ok, detail, fix = '') => checks.push({ name, required, ok, detail, fix });

  const major = Number(process.versions.node.split('.')[0]);
  add('node', true, major >= 22 && typeof WebSocket === 'function', `v${process.versions.node}`, hint.node);

  const ff = await tryRun('ffmpeg', ['-hide_banner', '-version']);
  add('ffmpeg', true, ff.ok, ff.ok ? first(ff.stdout) : 'not found', hint.ffmpeg);
  const fp = await tryRun('ffprobe', ['-hide_banner', '-version']);
  add('ffprobe', true, fp.ok, fp.ok ? first(fp.stdout) : 'not found', 'ffprobe ships with ffmpeg.');
  if (ff.ok) {
    const filters = await tryRun('ffmpeg', ['-hide_banner', '-filters']);
    const have = (f) => new RegExp(`\\s${f}\\s`).test(filters.stdout || '');
    const missing = ['drawtext', 'loudnorm', 'silencedetect', 'tile', 'hstack'].filter((f) => !have(f));
    add('ffmpeg filters', true, missing.length === 0, missing.length ? `missing: ${missing.join(', ')}` : 'drawtext, loudnorm, silencedetect, tile, hstack', hint.ffmpegFull);
    const enc = await tryRun('ffmpeg', ['-hide_banner', '-encoders']);
    add('h264 encoder', true, /libx264/.test(enc.stdout || ''), /libx264/.test(enc.stdout || '') ? 'libx264' : 'libx264 missing', hint.ffmpegFull);
  }

  const chrome = findChrome();
  add('chrome', true, !!chrome, chrome || 'not found', hint.chrome);

  const py = await findPython();
  add('python', true, !!py.version, py.version ? `${py.version} (${py.label})` : 'not found', hint.python);
  if (py.version) {
    const fw = await tryRun(py.cmd, [...py.args, '-c', 'import faster_whisper; print(faster_whisper.__version__)']);
    // a brand-new Python often has no faster-whisper packages yet: pip then tries to compile and fails
    const minor = Number(py.version.split('.')[1]);
    const tooNew = minor > 13 ? `   If pip fails building a package, Python ${py.version} is newer than faster-whisper supports: install Python 3.12 (${process.platform === 'win32' ? 'winget install Python.Python.3.12' : process.platform === 'darwin' ? 'brew install python@3.12' : 'your package manager'}) and run ${process.platform === 'win32' ? 'py -3.12' : 'python3.12'} -m pip install faster-whisper; Motus uses the Python that has it.` : '';
    add('faster-whisper', true, fw.ok, fw.ok ? first(fw.stdout) : 'not installed', `${py.label} -m pip install faster-whisper   (the first transcription downloads the speech model, about 1.6 GB)${tooNew}`);
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
