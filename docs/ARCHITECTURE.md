# Motus architecture

Motus edits talking-head 9:16 video in a chosen **editing style**. An AI coding agent (Claude Code, Codex) drives it; the heavy lifting is a local engine with no third-party runtime dependencies.

```
video file ─▶ ingest ─▶ understand ─▶ conform ─▶ plan ─▶ self-review ─▶ Studio (pick, note, lock) ─▶ render ─▶ final.mp4
              engine     agent         engine     agent    agent+engine   user + engine              engine
```

Three parts, three owners:

| Part | Lives in | Owns |
|---|---|---|
| **Engine** | `engine/` | Everything style-independent: probing, transcription, frames, matte, conform, the browser stage, the frame-exact renderer, the Studio server and UI, validation, the CLI. |
| **Style pack** | `styles/<id>/` | Everything that makes an edit look and move like one style: the rules the agent follows (`STYLE.md`), the manifest (`style.json`), and the browser module (`style.js`) that draws it. |
| **Skill** | `skills/<name>/` | The agent's procedures (`edit`, `styles`, `doctor`, `new-style`): which engine command to run when, what to read, what to ask the user. |

Requirements on the user's machine: `ffmpeg`/`ffprobe`, Node ≥ 22, Google Chrome (or Chromium/Edge), Python 3.9+ with `faster-whisper`. macOS adds the person matte and face tracking through Apple Vision (Swift); without them the style degrades gracefully (no head pop-out, centre framing).

## 1. Repository layout

```
.claude-plugin/plugin.json, marketplace.json   plugin + single-repo marketplace
skills/edit/SKILL.md (+ references/)           the editing procedure (/motus:edit)
skills/styles/, skills/doctor/                  list styles, check the machine (/motus:styles, /motus:doctor)
skills/new-style/SKILL.md (+ references/)       how to build a new style pack from a corpus (/motus:new-style)
.codex-plugin/, .agents/plugins/                Codex packaging (experimental)
engine/bin/motus.mjs                            the CLI (Node, ESM, built-ins only)
engine/lib/*.mjs                                node side: project, ingest, conform, validate, cdp, render, server
engine/py/transcribe.py                         transcription (faster-whisper)
engine/swift/*.swift                            Apple Vision matte + face track (compiled on first use)
engine/runtime/                                 browser stage shared by preview and render (stage.html, stage.js, kit/*)
engine/studio/                                  the review interface (static files served by engine/lib/server.mjs)
styles/<id>/                                    one folder per style pack
docs/                                           this file, ADDING_A_STYLE.md
tests/                                          node --test suites and fixtures
corpus/                                         reference media and studies: NEVER committed (rights unknown)
projects/                                       local test projects: never committed
```

## 2. Project workspace

One folder per video, created by `motus init`. Default location `<cwd>/motus-projects/<slug>/`.

```
project.json                 source path, probe, style id, mode (raw|locked), fps, status of each stage
analysis/
  audio.wav                  48 kHz mono, source timeline
  transcript.json            {language, words:[{i,w,start,end,p}], segments:[{start,end,text,words:[i0,i1]}]}  source time
  silences.json              [{start,end,dur}] from the audio
  retakes.json               candidate false starts / repeated takes / fillers (suggestions only)
  framing.json               face track: [{t, face:{x,y,w,h}, eyeY, headTopY}] + medians
  sheets/sheet-NN.jpg        contact sheets with burnt-in timestamps for the agent to look at
  stills/t_SSSS.mmm.jpg      full-resolution stills on request
  understanding.json         written by the agent: topic, claims, entities, environment, framing notes, evidence wishlist
plan/
  cuts.json                  kept source ranges [{in,out}] (locked mode: one range covering everything)
  edit.json                  THE EDIT DOCUMENT (section 4)
conform/                     the output timeline, built by `motus conform` from cuts.json
  timeline.json              {fps:[num,den], frames, duration, map:[{out,in,len}]}
  words.json                 transcript words re-timed to output time, renumbered 0..n-1 (src = index in transcript.json; cut words dropped)
  packed.mp4                 preview proxy: [footage | matte] side by side, H.264, short GOP
  frames/%06d.jpg            the same packed frames as stills, for frame-exact rendering (built lazily by render)
  voice.wav                  conformed voice track
assets/                      evidence gathered for this video (screenshots + text rects, logos, clips)
review/
  state.json                 written by Studio: per-scene {pick, locked, note}, global note, look choices
  submissions/NNN.json       one file per "send notes" / "render" press
  posters/<scene>-<option>-<hash>.jpg   (hash = the scene's options; .stamp = style files + captions + look)
renders/draft-NN.mp4, final.mp4, frames/
```

## 3. Time model

- The **source timeline** is the file as shot. Analysis files use source seconds.
- `plan/cuts.json` lists the kept ranges. Their concatenation is the **output timeline**. Everything in `edit.json`, `conform/` and the stage uses output time.
- Frame rate is carried as a rational (`[30000,1001]` stays 29.97). Frame `n` shows output time `n / fps`. Style timings are written in milliseconds or "frames at 30" and converted through seconds.
- Words are addressed by their stable index `i`. Plans anchor to words, not to seconds, so a change to the cuts does not invalidate the plan.

## 4. The edit document (`plan/edit.json`)

```jsonc
{
  "motus": 1,
  "style": "editorial-proof",
  "look": { "accent": "blue" },              // global choices declared by the style manifest
  "captions": {
    "fixes": { "12": "Claude" },              // word index -> corrected text (ASR repair, casing, numerals)
    "emphasis": { "14": "accent", "22": "serif", "23": "accent+serif" },   // kinds come from the style manifest
    "breaks": [8, 13],                        // optional forced caption-group starts
    "hide": [[40, 44]]                        // optional word ranges that show no caption
  },
  "scenes": [
    {
      "id": "s01",
      "words": [0, 11],                       // inclusive word range; start/end are derived from it
      "role": "hook",                         // free label from the style's grammar
      "options": [
        {
          "id": "a",
          "label": "Price list",              // 2-4 words, shown on the card
          "why": "Shows the five prices he is about to replace",   // one line, shown on the card
          "layout": "light-split",            // a layout declared by the style
          "slots": {                          // slot -> element; slots and element types are declared by the style
            "title": { "type": "hook-title", "key": "title", "line1": "Stop Paying For", "strip": "These AI Tools" },
            "card":  { "type": "price-list", "key": "prices",
                       "rows": [{ "name": "Claude Code", "price": "$200", "per": "/mo" }],
                       "beats": [{ "at": 7, "do": "strike-all" }, { "at": 9, "do": "total", "value": "$1,000+" }] }
          }
        }
      ],
      "pick": "a",                            // the agent's recommendation; Studio state overrides it
      "note": ""                              // agent-facing only; user notes live in review/state.json
    }
  ],
  "audio": { "music": null, "musicGainDb": -24, "sfx": true }
}
```

Rules the engine enforces (`motus validate`):
- Scenes tile the timeline in order: `scenes[k].words[0] == scenes[k-1].words[1] + 1`, the first starts at word 0, the last ends at the last word. Speech-free head and tail belong to the first and last scene.
- Every option names a declared layout, fills only declared slots, and every element satisfies its type's parameter spec. Unknown fields are errors, not warnings: a typo must not silently render nothing.
- `key` gives an element identity across scenes. The same key in the same slot of consecutive scenes means "this element stays on screen" (no exit and re-entry); a different key means a swap.
- `beats[].at` is a word index (number), or `{ "t": seconds }` on the output timeline, or `{ "rel": seconds }` from the scene start. Beats must fall inside their scene.
- Every scene should have 2-4 options; fewer is a warning unless `"single": true` is set, more than 4 is an error.
- Asset references (`"src": "assets/…"`) must exist.

`motus resolve` (used by the stage and renderer) merges `edit.json` with `review/state.json` and `conform/` into the **resolved document** the style compiles:

```jsonc
{ "fps": 29.97, "frames": 1794, "duration": 59.86, "width": 1080, "height": 1920,
  "look": {...}, "words": [{i,w,start,end,emph}], "captions": {...},
  "scenes": [{ "id":"s01", "start":0, "end":3.41, "role":"hook", "option": { "id":"a", "layout":…, "slots":… } }],
  "audio": {...} }
```

## 5. Style pack contract

```
styles/<id>/
  style.json        manifest (node side reads it; Studio shows it)
  STYLE.md          the rules the agent follows: grammar, decision rules, copy rules, checklists, with numbers
  style.js          browser ES module: draws the style (default export below)
  style.css         optional
  assets/           fonts (with licences), background plates, sfx (all original or openly licensed)
  examples/         example edit.json files + notes
  research/         the measured study the style was built from (text only, no source media)
```

`style.json`:

```jsonc
{
  "id": "editorial-proof", "name": "Editorial Proof", "version": "0.1.0",
  "summary": "One line the user sees when choosing a style.",
  "bestFor": ["tool breakdowns", "list videos"], "aspect": "9:16",
  "look": { "accent": { "label": "Accent", "choices": ["blue", "lime"], "default": "blue" } },
  "emphasis": ["accent", "serif", "accent+serif"],
  "roles": ["hook", "proof", "item", "payoff", "cta"],
  "layouts": {
    "light-split": { "label": "Split", "presenter": "panel", "slots": { "title": ["hook-title"], "card": ["price-list", "source-card"] } }
  },
  "elements": {
    "price-list": {
      "label": "Price list",
      "params": { "rows": { "type": "array", "min": 2, "max": 6, "of": { "name": "string", "price": "string", "per": "string?" } } },
      "beats": { "strike-all": {}, "total": { "value": "string" } }
    }
  },
  "sfx": { "pop": "assets/sfx/pop.wav" }
}
```

Param spec mini-language: `"string"`, `"string?"`, `"number"`, `"boolean"`, `"asset"` (a path under the project's `assets/`), `"enum:a|b|c"`, or an object `{type, min, max, maxChars, of}`.

`style.js` default export:

```js
export default {
  id: 'editorial-proof',
  async setup(env) {},            // once per page: fonts, plates. env = { W, H, fps, mode, kit, footage, styleUrl(rel), projectUrl(rel) }
  compile(doc, env) {             // doc = the resolved document
    return {
      el,                         // one HTMLElement, already populated; the stage appends it
      seek(t) {},                 // draw output time t (seconds). PURE: same t, same pixels. No clocks, no randomness, no CSS transitions.
      audio: [{ t, sfx: 'pop', gainDb: -12 }],   // sound events on the output timeline
      posterTime(sceneId) {},     // optional: the most representative instant of a scene
    };
  },
};
```

`env.kit` (engine-provided, `engine/runtime/kit/`, all pure): `ease` (named easings), `cubicBezier`, `spring`, `tween`, `prog`, `clamp`, `lerp`, `invLerp`, `remap`, `F` (frames to seconds), `seeded` and `hash` (deterministic randomness), `Layer`, `Group`, `h`, `css` (DOM helpers), `measure`, `fitSize`, `wrap`, `groupWords`, `bare` (text). Footage is not in the kit: `env.footage.view({ matte: false|true })` returns a canvas the engine keeps on the current frame; the style positions and clips it with CSS. Details in [ADDING_A_STYLE.md](ADDING_A_STYLE.md#the-kit). A style may ignore the kit and draw however it likes as long as `seek` is pure.

## 6. The stage (`engine/runtime/stage.html`)

One page, two modes, the same style code:

- `?mode=preview` plays `conform/packed.mp4` in real time and calls `seek(video time)` every video frame; audio comes from the video element plus scheduled SFX.
- `?mode=render` exposes `window.__motus.seekFrame(n) -> Promise` which loads packed frame `n`, updates the footage views, calls `seek(n / fps)`, waits for fonts and image decodes, then resolves. The renderer screenshots after that.
- `&scene=<id>&option=<id>` forces one option of one scene (option previews, posters); `&loop=a,b` loops a range.
- The stage is always 1080×1920 CSS px; preview scales it with a CSS transform.

## 7. Renderer (`engine/lib/render.mjs`)

Launches the installed Chrome headless, speaks the DevTools Protocol over Node's built-in WebSocket, runs N pages in parallel over frame ranges, writes `renders/frames/%06d.jpg`, then one ffmpeg pass encodes H.264 (high, yuv420p, bt709, source frame rate, faststart) and mixes voice + SFX (+ music), loudness-normalised to −14 LUFS with a −2 dBTP ceiling (the PCM is normalised to −3 dBTP so AAC overshoot stays under −2), AAC 192 k 48 kHz. `motus stills` uses the same path for single frames.

## 8. Studio

`motus studio <project>` starts `engine/lib/server.mjs` (node:http) detached and prints the URL. `motus wait <project>` blocks until the user presses a submit button, prints the submission as JSON and exits, so an agent can run it in the background and be woken by it.

HTTP: `GET /api/project` (manifest + resolved document + state), `GET /api/resolved` (the resolved document, optionally forcing `?scene=&option=`), `PUT /api/state` (pick, lock, note, look), `POST /api/submit {action:"notes"|"render", draft?}` (render starts the server-side render), `POST /api/ack` (notes addressed), `GET /api/render` (render status), `GET /api/events` (server-sent events: plan reloaded, submissions, render progress), `GET /api/ping`, static `/`, `/studio/*`, `/runtime/*`, `/assets/*`, `/styles/*`, `/project/*` (range requests for video).

The server binds 127.0.0.1 only. It answers only requests whose `Host` header is its own loopback address and port (this stops DNS rebinding), and accepts `PUT`/`POST` only with `Content-Type: application/json` and, when an `Origin` is sent, its own origin (this stops cross-site form and no-cors posts).

Interface: a sticky phone-frame player showing the current cut with a scene filmstrip under it; one section per scene (time range, what is said, the option cards A/B/C playing in context over the real footage, pick, note, lock); global look choices; safe-zone overlay; "Send notes" while anything is unlocked or annotated, "Render final" when every scene is locked. Rendering runs server-side with live progress and ends with the finished file.

## 9. CLI

The same list as `node engine/bin/motus.mjs help`:

```
motus doctor                                   check this machine
motus styles                                   list installed style packs
motus init <video> [--style id] [--mode raw|locked] [--project dir] [--force]
motus ingest <project> [--transcript file] [--language en] [--prompt "names, terms"]
motus sheet <project> [--from s --to s --fps n] | [--at t1,t2,...]
motus conform <project> [--no-matte]
motus capture <url> --out <project>/assets/name.png [--find "text"] [--width 1200] [--dark] [--clip x,y,w,h] [--full]
motus validate <project>
motus stills <project> [--posters [--force]] [--scene id --option id] [--at t1,t2] [--sheet] [--every s]
motus studio <project> [--port n] [--open] [--stop]
motus wait <project> [--timeout seconds]
motus ack <project> [scene ...] [--reply "what changed"]
motus render <project> [--draft] [--range a,b] [--out file] [--workers n]
```

Every command prints one JSON object on stdout when given `--json`, and human text otherwise. Exit code 0 on success; errors are `{ "error": "...", "fix": "..." }`.
