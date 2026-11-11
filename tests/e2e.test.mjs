// End-to-end: a generated clip through every engine stage to a draft render. Needs ffmpeg and Chrome
// (no speech model: the transcript is supplied). Skipped unless MOTUS_E2E=1.
//   MOTUS_E2E=1 node --test tests/e2e.test.mjs        (MOTUS_E2E_KEEP=1 keeps the work folder)
import { MOTUS, FIXTURE_STYLES, tmpDir } from './helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const E2E = process.env.MOTUS_E2E === '1';

test('end to end: init, ingest, cuts, conform, plan, validate, stills, draft render (deterministic)', { skip: !E2E && 'set MOTUS_E2E=1 to run (needs ffmpeg and Chrome, about a minute)', timeout: 15 * 60 * 1000 }, async (t) => {
  const t0 = Date.now();
  // a path with a space and non-ASCII letters, as users have
  const root = path.join(tmpDir('motus-e2e-'), 'work dir ü');
  const tmp = path.join(root, 'tmp');                       // Chrome profiles go here: we check none are left
  fs.mkdirSync(tmp, { recursive: true });
  const env = { ...process.env, MOTUS_STYLES: FIXTURE_STYLES, TMPDIR: tmp };
  const timings = {};
  const sh = (cmd, args) => {
    const r = spawnSync(cmd, args, { encoding: 'utf8', env, timeout: 10 * 60 * 1000, maxBuffer: 64 << 20 });
    if (r.status !== 0) throw new Error(`${path.basename(cmd)} ${args.join(' ')} failed (${r.status}):\n${r.stdout}\n${r.stderr}`);
    return r.stdout;
  };
  const motus = (...args) => {
    const s = Date.now();
    const out = JSON.parse(sh(process.execPath, [MOTUS, ...args, '--json', '--quiet']));
    timings[args[0]] = (timings[args[0]] || 0) + (Date.now() - s) / 1000;
    return out;
  };
  const probe = (file) => JSON.parse(sh('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', '-count_frames', file]));
  const frameHashes = (file) => sh('ffmpeg', ['-v', 'error', '-i', file, '-map', '0:v', '-f', 'framemd5', '-']).split('\n').filter((l) => l && !l.startsWith('#'));

  try {
    // ---- a 4 s 1080x1920 clip at 30000/1001 with two bursts of tone ("speech") and silence around them
    const video = path.join(root, 'clip ü test.mp4');
    sh('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'testsrc2=size=1080x1920:rate=30000/1001:duration=4',
      '-f', 'lavfi', '-i', 'aevalsrc=0.3*sin(2*PI*440*t)*(between(t\\,0.3\\,1.6)+between(t\\,2.3\\,3.6)):s=48000:d=4',
      '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', video]);
    const transcript = path.join(root, 'words.json');
    const said = [['Motus', 0.35, 0.62], ['edits', 0.66, 0.95], ['talking', 1.0, 1.28], ['heads.', 1.3, 1.55], ['Pick', 2.35, 2.6], ['a', 2.62, 2.7], ['style', 2.75, 3.1], ['today.', 3.15, 3.55]];
    fs.writeFileSync(transcript, JSON.stringify({ language: 'en', words: said.map(([w, start, end]) => ({ w, start, end })) }));

    // ---- init
    const proj = path.join(root, 'my project');
    const init = motus('init', video, '--style', 'minimal', '--project', proj);
    assert.equal(init.project, proj);
    assert.deepEqual([init.source.width, init.source.height, init.source.fps], [1080, 1920, [30000, 1001]]);
    assert.equal(init.source.hasAudio, true);

    // ---- ingest with the supplied transcript
    const ing = motus('ingest', proj, '--transcript', transcript);
    assert.equal(ing.words, 8);
    assert.equal(ing.suppliedTranscript, true);
    assert.equal(ing.crop, null);
    assert.ok(ing.silences >= 3, `silences: ${ing.silences}`);
    for (const f of ing.read.sheets) assert.ok(fs.existsSync(f), f);

    // ---- cuts: take the suggestion (head, middle pause and tail removed)
    const suggested = JSON.parse(fs.readFileSync(path.join(proj, 'analysis', 'cuts.suggested.json'), 'utf8'));
    assert.equal(suggested.length, 2, JSON.stringify(suggested));
    assert.ok(suggested[0].in > 0.15 && suggested[0].in < 0.3 && suggested[1].out > 3.6 && suggested[1].out < 3.75, JSON.stringify(suggested));
    fs.writeFileSync(path.join(proj, 'plan', 'cuts.json'), JSON.stringify(suggested));

    // ---- conform without the person matte
    const con = motus('conform', proj, '--no-matte');
    assert.equal(con.hasMatte, false);
    assert.equal(con.ranges, 2);
    assert.equal(con.words, 8);
    const timeline = JSON.parse(fs.readFileSync(path.join(proj, 'conform', 'timeline.json'), 'utf8'));
    const keptFrames = suggested.reduce((n, c) => n + Math.round(c.out * 30000 / 1001) - Math.round(c.in * 30000 / 1001), 0);
    assert.equal(timeline.frames, keptFrames);
    assert.deepEqual(timeline.fps, [30000, 1001]);
    const packed = probe(path.join(proj, 'conform', 'packed.mp4'));
    const pv = packed.streams.find((s) => s.codec_type === 'video');
    assert.equal(Number(pv.nb_read_frames), timeline.frames);
    assert.deepEqual([pv.width, pv.height, pv.r_frame_rate], [1080, 1920, '30000/1001']);
    const voice = probe(path.join(proj, 'conform', 'voice.wav')).streams[0];
    assert.ok(Math.abs(Number(voice.duration) - timeline.duration) < 0.005, `voice ${voice.duration} vs ${timeline.duration}`);
    const words = JSON.parse(fs.readFileSync(path.join(proj, 'conform', 'words.json'), 'utf8')).words;
    assert.deepEqual(words.map((w) => w.w), said.map((s) => s[0]));
    assert.ok(words.every((w, k) => w.end <= timeline.duration + 1e-6 && (!k || w.start >= words[k - 1].start)));

    // ---- plan for the minimal style: two scenes tiling the conformed words
    const note = (text, beats) => ({ type: 'note', key: 'n', text, ...(beats ? { beats } : {}) });
    const edit = {
      motus: 1, style: 'minimal', look: { accent: 'lime' },
      captions: { emphasis: { 2: 'accent' } },
      scenes: [
        { id: 's01', words: [0, 3], role: 'hook', pick: 'a', options: [
          { id: 'a', label: 'Split card', why: 'Names the idea', layout: 'split', slots: { card: note('Motus', [{ at: 1, do: 'flash' }]) } },
          { id: 'b', label: 'Full frame', why: 'Face first', layout: 'full', slots: {} }] },
        { id: 's02', words: [4, 7], role: 'cta', options: [
          { id: 'a', label: 'Full frame', why: 'Close on the face', layout: 'full', slots: { card: note('Pick a style', [{ at: { rel: 0.1 }, do: 'flash' }]) } },
          { id: 'b', label: 'Split card', why: 'Keep the card', layout: 'split', slots: { card: note('Pick a style') } }] },
      ],
      audio: { sfx: true },
    };
    fs.writeFileSync(path.join(proj, 'plan', 'edit.json'), JSON.stringify(edit, null, 2));

    // ---- validate
    const val = motus('validate', proj);
    assert.equal(val.ok, true, JSON.stringify(val.errors));
    assert.deepEqual(val.errors, []);

    // ---- stills: two frames and the option posters
    const st = motus('stills', proj, '--at', '0.5,1.5', '--posters');
    assert.equal(st.stills.length, 2 + 4);
    for (const f of st.stills) assert.ok(fs.statSync(f).size > 1000, f);

    // ---- draft render of a range, twice: identical frames
    const range = '0.2,1.8';
    const r1 = motus('render', proj, '--draft', '--range', range);
    const r2 = motus('render', proj, '--draft', '--range', range);
    assert.equal(path.basename(r1.file), 'draft-01.mp4');
    assert.equal(path.basename(r2.file), 'draft-02.mp4');
    const fps = 30000 / 1001;
    const frames = Math.round(1.8 * fps) - Math.round(0.2 * fps);
    assert.equal(r1.frames, frames);
    const p = probe(r1.file);
    const v = p.streams.find((s) => s.codec_type === 'video'), a = p.streams.find((s) => s.codec_type === 'audio');
    assert.deepEqual([v.codec_name, v.profile, v.width, v.height, v.pix_fmt, v.r_frame_rate], ['h264', 'High', 540, 960, 'yuv420p', '30000/1001']);
    assert.equal(v.color_primaries, 'bt709');
    assert.equal(Number(v.nb_read_frames), frames);
    assert.deepEqual([a.codec_name, Number(a.sample_rate), a.channels], ['aac', 48000, 2]);
    assert.ok(Math.abs(Number(p.format.duration) - frames / fps) < 0.06, `duration ${p.format.duration}`);
    const h1 = frameHashes(r1.file), h2 = frameHashes(r2.file);
    assert.equal(h1.length, frames);
    assert.deepEqual(h2, h1, 'two renders of the same range have identical frames');
    // the picture actually changes over time (the footage is moving)
    assert.ok(new Set(h1.map((l) => l.split(',').pop().trim())).size > frames / 2);

    // colour: in s02 (full-frame footage) the rendered bars match the conformed footage, as the preview shows it
    const s02 = Math.round(words[4].start * fps) + 4;          // a few frames into s02 (output frame)
    const f0 = Math.round(0.2 * fps);
    const median = (file, n, crop) => {
      const r = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', `select=eq(n\\,${n}),crop=${crop},scale=in_color_matrix=bt709:in_range=tv:out_range=pc,format=rgb24`, '-frames:v', '1', '-f', 'rawvideo', '-'], { env, maxBuffer: 64 << 20 });
      const ch = [[], [], []];
      for (let i = 0; i + 2 < r.stdout.length; i += 3) for (let c = 0; c < 3; c++) ch[c].push(r.stdout[i + c]);
      return ch.map((a) => a.sort((x, y) => x - y)[a.length >> 1]);
    };
    for (const [name, x, w] of [['red', 30, 120], ['green', 210, 120], ['magenta', 740, 120], ['cyan', 920, 120]]) {
      const want = median(path.join(proj, 'conform', 'footage.mp4'), s02, `${w}:200:${x}:950`);
      const got = median(r1.file, s02 - f0, `${w / 2}:100:${x / 2}:475`);
      assert.ok(want.every((v, c) => Math.abs(v - got[c]) <= 4), `${name} bar: footage ${want} vs render ${got}`);
    }

    // ---- nothing left behind: no work folders, no Chrome profiles
    assert.deepEqual(fs.readdirSync(path.join(proj, 'renders')).filter((f) => f.startsWith('.work') || f === 'mix.wav' || f === 'frames'), []);
    assert.deepEqual(fs.readdirSync(tmp).filter((f) => f.startsWith('motus-chrome-')), []);

    // ---- a bad range is refused with a fix and leaves nothing behind
    const bad = spawnSync(process.execPath, [MOTUS, 'render', proj, '--range', '3', '--json'], { encoding: 'utf8', env });
    assert.equal(bad.status, 1);
    assert.match(JSON.parse(bad.stdout).fix, /--range start,end/);

    // ---- a browser that cannot start: the CLI reports it and exits (it used to hang on the open server)
    const fake = path.join(root, 'fake chrome');
    fs.writeFileSync(fake, '#!/bin/sh\nexit 5\n', { mode: 0o755 });
    const noChrome = spawnSync(process.execPath, [MOTUS, 'render', proj, '--draft', '--json'], { encoding: 'utf8', env: { ...env, MOTUS_CHROME: fake }, timeout: 60000 });
    assert.equal(noChrome.signal, null, 'motus render hung after Chrome failed to start');
    assert.equal(noChrome.status, 1);
    assert.match(JSON.parse(noChrome.stdout).error, /Chrome exited during start/);

    // ---- interrupted mid-render (an agent killing it): Chrome, its profile and the work folder all go
    if (process.platform !== 'win32') {
      const { spawn } = await import('node:child_process');
      const child = spawn(process.execPath, [MOTUS, 'render', proj, '--quiet'], { env, stdio: 'ignore' });
      const exited = new Promise((r) => child.once('exit', (code, signal) => r({ code, signal })));
      const deadline = Date.now() + 60000;
      let profile = null;
      while (!profile && Date.now() < deadline) {
        profile = fs.readdirSync(tmp).find((f) => f.startsWith('motus-chrome-'));
        await new Promise((r) => setTimeout(r, 50));
      }
      assert.ok(profile, 'render started Chrome');
      await new Promise((r) => setTimeout(r, 700));                       // let it draw a few frames
      child.kill('SIGTERM');
      const end = await exited;
      assert.equal(end.code, 143, JSON.stringify(end));
      await new Promise((r) => setTimeout(r, 300));
      const alive = spawnSync('pgrep', ['-f', path.join(tmp, profile)], { encoding: 'utf8' });
      assert.equal(alive.stdout.trim(), '', 'no Chrome process left running');
      assert.deepEqual(fs.readdirSync(tmp).filter((f) => f.startsWith('motus-')), []);
      assert.deepEqual(fs.readdirSync(path.join(proj, 'renders')).filter((f) => f.startsWith('.work')), []);
    }

    timings.total = (Date.now() - t0) / 1000;
    t.diagnostic(`timings (s): ${JSON.stringify(Object.fromEntries(Object.entries(timings).map(([k, x]) => [k, +x.toFixed(1)])))}`);
    t.diagnostic(`frame md5 (first): ${crypto.createHash('md5').update(h1.join('\n')).digest('hex')}`);
  } finally {
    if (process.env.MOTUS_E2E_KEEP !== '1') fs.rmSync(path.dirname(root), { recursive: true, force: true });
    else t.diagnostic(`kept: ${root}`);
  }
});
