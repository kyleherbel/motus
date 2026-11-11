// Ingest: everything the agent needs to understand a video, computed on the source timeline.
import path from 'node:path';
import fs from 'node:fs/promises';
import { run, readJson, writeJson, exists, mkdirp, ENGINE, MotusError, fpsOf } from './util.mjs';
import { faceTrack } from './vision.mjs';

const LABEL_FONT = path.join(ENGINE, 'assets', 'fonts', 'Inter.ttf');
/** ffmpeg filter-graph escaping for a path used as an option value. */
const fesc = (p) => p.replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, "\\'").replace(/,/g, '\\,');

export async function extractAudio(project) {
  const out = project.path('analysis', 'audio.wav');
  if (!project.json.source.hasAudio) throw new MotusError('The source has no audio stream.', 'Motus needs speech to plan an edit. Use a file that includes the recorded audio.');
  // aresample first_pts=0 pads the start when the audio stream begins after the video, and async=1
  // fills gaps with silence, so sample n of audio.wav is always source time n/48000 (conform relies on it)
  await run('ffmpeg', ['-v', 'error', '-y', '-i', project.json.source.path, '-vn', '-af', 'aresample=48000:async=1:first_pts=0', '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s16le', out]);
  return out;
}

const NUM = '(-?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?)';          // ffmpeg prints times with %g: 2.08333e-05 is possible
/** Parse silencedetect output into [{start, end, dur}]; a silence still open at the end closes at `duration`. */
export function parseSilences(stderr, duration) {
  const out = [];
  let start = null;
  const push = (s, e) => { if (e > s) out.push({ start: +s.toFixed(3), end: +e.toFixed(3), dur: +(e - s).toFixed(3) }); };
  for (const line of stderr.split('\n')) {
    const s = line.match(new RegExp(`silence_start:\\s*${NUM}`, 'i'));
    if (s) { start = Math.max(0, Number(s[1])); continue; }
    const e = line.match(new RegExp(`silence_end:\\s*${NUM}`, 'i'));
    if (e && start !== null) { push(start, Number(e[1])); start = null; }
  }
  if (start !== null && Number.isFinite(duration)) push(start, duration);     // older ffmpeg never closes a trailing silence
  return out;
}

/** Energy-based silences: [{start, end, dur}] in source seconds. */
export async function detectSilences(audio, { noiseDb = -34, minDur = 0.18, duration } = {}) {
  const { stderr } = await run('ffmpeg', ['-hide_banner', '-nostats', '-i', audio, '-af', `silencedetect=noise=${noiseDb}dB:d=${minDur}`, '-f', 'null', '-']);
  return parseSilences(stderr, duration);
}

/**
 * A transcript the user supplied as JSON: {words:[{w|word|text, start, end, p?}]}. Returns the words in
 * Motus form (ordered, re-indexed), or throws a MotusError naming the first bad word.
 */
export function suppliedWords(t, file = 'the transcript') {
  if (!t || typeof t !== 'object' || !Array.isArray(t.words)) {
    throw new MotusError(`${file} has no "words" list.`, 'Supply {"words": [{"w": "Hello", "start": 0.42, "end": 0.71}, ...]} with times in source seconds, or a plain .txt/.srt file to use only as a spelling hint.');
  }
  const words = [];
  t.words.forEach((w, k) => {
    const text = String(w?.w ?? w?.word ?? w?.text ?? '').trim();
    if (!text) return;
    const start = Number(w.start), end = Number(w.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0) {
      throw new MotusError(`${file}: word ${k} ("${text}") has no usable start/end time.`, 'Every word needs "start" and "end" in seconds (numbers, start >= 0).');
    }
    words.push({ w: text, start, end: Math.max(end, start), p: Number(w.p ?? w.probability ?? 1) });
  });
  words.sort((a, b) => a.start - b.start);
  words.forEach((w, i) => { w.i = i; });
  return words.map(({ i, w, start, end, p }) => ({ i, w, start, end, p }));
}

export async function transcribe(project, { transcript, language, model, prompt, onProgress } = {}) {
  const out = project.path('analysis', 'transcript.json');
  if (transcript) {
    const ext = path.extname(transcript).toLowerCase();
    if (ext === '.json') {
      // A JSON transcript is taken as word timings, never as a spelling hint: a malformed one is an error,
      // not a silent fallback to the speech model. Zero words is valid (a video without speech).
      const t = await readJson(transcript);
      const words = suppliedWords(t, path.basename(transcript));
      await writeJson(out, { language: t.language || null, duration: project.json.source.duration, model: 'supplied', words, segments: Array.isArray(t.segments) ? t.segments : [] });
      return { words: words.length, supplied: true };
    }
    // A transcript without word timings still helps: it biases spelling of names and terms.
    const text = (await fs.readFile(transcript, 'utf8')).replace(/\d+\n\d\d:\d\d:\d\d[.,]\d+ --> .*\n/g, ' ').replace(/\s+/g, ' ').trim();
    prompt = [prompt, text.slice(0, 600)].filter(Boolean).join(' ');
  }
  const args = [path.join(ENGINE, 'py', 'transcribe.py'), project.path('analysis', 'audio.wav'), '--out', out];
  if (language) args.push('--language', language);
  if (model) args.push('--model', model);
  if (prompt) args.push('--prompt', prompt);
  const py = process.env.MOTUS_PYTHON || 'python3';
  const { stdout } = await run(py, args, {
    onLine: (line, stream) => { if (stream === 'stderr' && line.startsWith('{')) { try { const j = JSON.parse(line); if (j.progress !== undefined) onProgress?.(j.progress); } catch { /* not ours */ } } },
    ok: [0, 2],
    fix: 'Transcription failed. Run: motus doctor (python, faster-whisper; the first run downloads the model), or pass --transcript <words.json> with word timings.',
  });
  const last = stdout.trim().split('\n').pop() || '{}';
  let res = {};
  try { res = JSON.parse(last); } catch { /* fallthrough */ }
  if (res.error) throw new MotusError(res.error, res.fix || '');
  if (!(await exists(out))) throw new MotusError('Transcription produced no output.', 'Run: motus doctor');
  return res;
}

/**
 * Contact sheets with the time burnt into every cell, so a vision model can read the video.
 * Returns [{file, from, to, fps, cols, rows, times:[...]}].
 */
export async function contactSheets(project, { from = 0, to, fps, cols = 6, rows = 5, cellW = 300, outDir, prefix = 'sheet' } = {}) {
  const src = project.json.source;
  to = Math.min(to ?? src.duration, src.duration);
  const span = Math.max(0.01, to - from);
  fps = fps ?? (span <= 100 ? 2 : span <= 240 ? 1 : 0.5);
  const cellH = Math.round((cellW * 16) / 9 / 2) * 2;
  outDir = outDir || project.path('analysis', 'sheets');
  await mkdirp(outDir);
  for (const f of await fs.readdir(outDir)) if (f.startsWith(`${prefix}-`)) await fs.rm(path.join(outDir, f));
  const crop = project.json.crop;
  const chain = [
    `fps=${fps}`,
    crop ? `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}` : null,
    `scale=${cellW}:${cellH}:force_original_aspect_ratio=increase`, `crop=${cellW}:${cellH}`,
    `drawtext=fontfile='${fesc(LABEL_FONT)}':text='%{eif\\:floor(t+${from})\\:d}.%{eif\\:mod(floor((t+${from})*10)\\,10)\\:d}s':x=8:y=8:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.72:boxborderw=6`,
    `tile=${cols}x${rows}:padding=4:margin=4:color=0x101010`,
  ].filter(Boolean).join(',');
  await run('ffmpeg', ['-v', 'error', '-y', '-ss', String(from), '-t', String(span), '-i', src.path, '-vf', chain, '-q:v', '3', '-fps_mode', 'passthrough', path.join(outDir, `${prefix}-%02d.jpg`)]);
  const files = (await fs.readdir(outDir)).filter((f) => f.startsWith(`${prefix}-`)).sort();
  const per = cols * rows;
  return files.map((f, k) => {
    const n0 = k * per;
    const times = Array.from({ length: per }, (_, j) => +(from + (n0 + j) / fps).toFixed(3)).filter((t) => t <= to + 1e-6);
    return { file: path.join(outDir, f), from: times[0], to: times[times.length - 1], fps, cols, rows, times };
  });
}

/** Full-resolution stills at given source times. */
export async function stillsAt(project, times, outDir) {
  outDir = outDir || project.path('analysis', 'stills');
  const bad = times.filter((t) => !Number.isFinite(t) || t < 0);
  if (bad.length || !times.length) throw new MotusError(`Not a list of times in seconds: ${times.join(',')}`, 'Pass --at with comma-separated seconds, e.g. --at 1.5,4,7.25');
  await mkdirp(outDir);
  const crop = project.json.crop;
  const out = [];
  for (const t of times) {
    const file = path.join(outDir, `t_${t.toFixed(3).padStart(8, '0')}.jpg`);
    const vf = [crop ? `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}` : null, 'scale=1080:1920:force_original_aspect_ratio=increase', 'crop=1080:1920'].filter(Boolean).join(',');
    await run('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', project.json.source.path, '-frames:v', '1', '-vf', vf, '-q:v', '2', file]);
    out.push({ t, file });
  }
  return out;
}

/**
 * Suggest what to keep from a raw take: speech with short handles, long pauses tightened.
 * Purely energy-based so cut points sit in real silence, never inside a word.
 * maxPause: the longest pause left in the edit; handle: silence kept on each side of a cut.
 */
export function suggestCuts(silences, duration, { maxPause = 0.32, handle = 0.07, minKeep = 0.25 } = {}) {
  const keep = [];
  let cursor = 0;
  for (const s of silences) {
    const isHead = s.start <= 0.02, isTail = s.end >= duration - 0.02;
    if (!isHead && !isTail && s.dur <= maxPause) continue;       // short pause: leave it alone
    const cutFrom = isHead ? 0 : s.start + handle;
    const cutTo = isTail ? duration : s.end - handle;
    if (cutTo - cutFrom <= 0.04) continue;
    if (cutFrom - cursor >= minKeep) keep.push({ in: +cursor.toFixed(3), out: +cutFrom.toFixed(3) });
    cursor = cutTo;
  }
  if (duration - cursor >= minKeep) keep.push({ in: +cursor.toFixed(3), out: +duration.toFixed(3) });
  // no speech found (one silence over the whole file): suggest keeping everything rather than an empty
  // list that conform would reject
  if (!keep.length && duration > 0) keep.push({ in: 0, out: +duration.toFixed(3) });
  return keep;
}

/**
 * Speech recognisers often stretch a word across the silence next to it (the first word of a
 * take starts "during" the dead air before it). Pull word edges out of measured silence so
 * captions and cuts sit on the sound itself.
 */
export function snapWordsToSpeech(words, silences, minDur = 0.06) {
  for (const w of words) {
    for (const s of silences) {
      if (s.dur < 0.15) continue;
      const inStart = w.start >= s.start - 1e-6 && w.start < s.end, inEnd = w.end > s.start && w.end <= s.end + 1e-6;
      if (inStart && inEnd) {                                   // wholly inside: move to the nearer edge
        const d = Math.max(minDur, Math.min(0.3, w.end - w.start));
        if (w.start - s.start < s.end - w.end) { w.end = s.start; w.start = s.start - d; } else { w.start = s.end; w.end = s.end + d; }
      } else if (inStart) w.start = Math.min(s.end, w.end - minDur);
      else if (inEnd) w.end = Math.max(s.start, w.start + minDur);
    }
    w.start = +Math.max(0, w.start).toFixed(3); w.end = +Math.max(w.start + minDur, w.end).toFixed(3);
  }
  for (let k = 1; k < words.length; k++) {                      // keep them ordered and non-overlapping
    const a = words[k - 1], b = words[k];
    if (b.start < a.start) b.start = a.start;
    if (a.end > b.start) a.end = +Math.max(a.start + 0.02, b.start).toFixed(3);
    if (b.start < a.end) b.start = a.end;                       // two words that started together: b follows a
    if (b.end <= b.start) b.end = +(b.start + minDur).toFixed(3);
  }
  return words;
}

/** Candidate retakes and fillers from the transcript. Suggestions only: the agent decides. */
export function findRetakes(words, { window = 12, minRepeat = 3 } = {}) {
  const norm = (w) => w.w.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '');
  const toks = words.map(norm);
  const out = [];
  // A phrase said, then said again right after: the first attempt is usually the false start.
  for (let i = 0; i < toks.length; i++) {
    for (let j = i + minRepeat; j <= Math.min(toks.length - minRepeat, i + window); j++) {
      let n = 0;
      while (j + n < toks.length && i + n < j && toks[i + n] && toks[i + n] === toks[j + n]) n++;
      if (n >= minRepeat) {
        out.push({ kind: 'retake', drop: [i, j - 1], keepFrom: j, start: words[i].start, end: words[j].start,
          text: words.slice(i, j).map((w) => w.w).join(' '), repeats: words.slice(j, j + n).map((w) => w.w).join(' ') });
        i = j - 1;
        break;
      }
    }
  }
  const fillers = new Set(['um', 'uh', 'umm', 'uhh', 'erm', 'hmm', 'uhm']);
  toks.forEach((t, i) => { if (fillers.has(t)) out.push({ kind: 'filler', drop: [i, i], start: words[i].start, end: words[i].end, text: words[i].w }); });
  // Immediate stutters: "the the", "I I"
  for (let i = 1; i < toks.length; i++) if (toks[i] && toks[i] === toks[i - 1] && toks[i].length <= 4) out.push({ kind: 'stutter', drop: [i - 1, i - 1], start: words[i - 1].start, end: words[i].start, text: words[i - 1].w });
  return out.sort((a, b) => a.start - b.start);
}

/** The 9:16 window of the source that conform will use, centred on the speaker when a face track exists. */
export function chooseCrop(src, framing) {
  const target = 9 / 16;
  if (Math.abs(src.aspect - target) < 0.005) return null;
  let w, h;
  if (src.aspect > target) { h = src.height; w = Math.round((h * target) / 2) * 2; }
  else { w = src.width; h = Math.round(w / target / 2) * 2; }
  const cx = framing?.median ? framing.median.cx * src.width : src.width / 2;
  const cy = framing?.median ? framing.median.eyeY * src.height + h * 0.12 : src.height / 2;   // eyes sit above centre
  const x = Math.round(Math.min(Math.max(0, cx - w / 2), src.width - w) / 2) * 2;
  const y = Math.round(Math.min(Math.max(0, cy - h / 2), src.height - h) / 2) * 2;
  return { x, y, w, h };
}

export async function ingest(project, opt = {}) {
  const log = opt.log || (() => {});
  const src = project.json.source;
  log('audio');
  const audio = await extractAudio(project);
  log('silences');
  const silences = await detectSilences(audio, { duration: src.duration, ...opt.silence });
  await writeJson(project.path('analysis', 'silences.json'), silences);
  log('framing');
  const framing = await faceTrack(src.path, { duration: src.duration, log }).catch((e) => ({ available: false, reason: e.message }));
  await writeJson(project.path('analysis', 'framing.json'), framing);
  project.json.crop = chooseCrop(src, framing.available ? framing : null);
  await project.save();
  log('transcript');
  const tr = await transcribe(project, { transcript: opt.transcript, language: opt.language, model: opt.model, prompt: opt.prompt, onProgress: (p) => log(`transcript ${(p * 100).toFixed(0)}%`) });
  const transcript = await readJson(project.path('analysis', 'transcript.json'));
  if (!tr.supplied) { snapWordsToSpeech(transcript.words, silences); await writeJson(project.path('analysis', 'transcript.json'), transcript); }
  log('sheets');
  const sheets = await contactSheets(project, {});
  const retakes = findRetakes(transcript.words);
  await writeJson(project.path('analysis', 'retakes.json'), retakes);
  const suggested = project.json.mode === 'locked'
    ? [{ in: 0, out: +src.duration.toFixed(3) }]
    : suggestCuts(silences, src.duration, opt.cuts);
  await writeJson(project.path('analysis', 'cuts.suggested.json'), suggested);
  const kept = suggested.reduce((n, c) => n + (c.out - c.in), 0);
  await writeJson(project.path('analysis', 'sheets.json'), sheets.map((s) => ({ ...s, file: path.relative(project.dir, s.file) })));
  await project.mark('ingest', { words: transcript.words.length, language: transcript.language, sheets: sheets.length, silences: silences.length, retakes: retakes.length });
  return {
    project: project.dir, duration: src.duration, fps: fpsOf(src.fps), size: `${src.width}x${src.height}`,
    language: transcript.language, words: transcript.words.length, suppliedTranscript: !!tr.supplied,
    wordsPerMinute: Math.round(transcript.words.length / (src.duration / 60)),
    framing: framing.available ? framing.median : null, crop: project.json.crop,
    silences: silences.length, longestSilence: Math.max(0, ...silences.map((s) => s.dur)),
    retakeCandidates: retakes.filter((r) => r.kind === 'retake').length, fillerCandidates: retakes.filter((r) => r.kind !== 'retake').length,
    suggestedCuts: { ranges: suggested.length, keptSeconds: +kept.toFixed(2), removedSeconds: +(src.duration - kept).toFixed(2) },
    read: {
      transcript: project.path('analysis', 'transcript.json'),
      sheets: sheets.map((s) => s.file),
      retakes: project.path('analysis', 'retakes.json'),
      suggestedCuts: project.path('analysis', 'cuts.suggested.json'),
      framing: project.path('analysis', 'framing.json'),
    },
  };
}
