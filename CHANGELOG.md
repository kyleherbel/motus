# Changelog

All notable changes to Motus are recorded here. The plugin version is the `version` field in `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`. Each style pack has its own version in `styles/<id>/style.json`.

## Unreleased

Open Canvas 0.1.0 (beta): a new style, `styles/open-canvas/`. The video staged as an open design file: the speaker cut out over their own footage rectangle on a drifting drafting grid, real captures in selection frames, a cursor that drags things into place, pointers on the spoken word, word-by-word captions with a brush-script word, a bare-face comment ask. Voice only.

- 6 layouts (`desk`, `full`, `hero`, `behind`, `graphic`, `face`) and 5 elements (`capture` with `highlight`, `tap`, `view` and `swap` beats on stills and clips; `hook-title`; `comment-cta`; `transfer`; `app-lock`).
- Look: `palette` with `mono` (black sheet, white lines, light-blue selection; the default), `cobalt`, `ember`, `moss`, `ink`. Emphasis kind `script`.
- Measured from one clip read at every frame, not a corpus: every rule is medium or low confidence and the research notes say so. No sounds shipped. Fonts: Outfit, Caveat Brush, JetBrains Mono (SIL OFL 1.1).
- End-to-end test on a Daily Update take: 12 scenes, 54.4 s, 1080x1920 at 29.97 fps, -14 LUFS.

Ember Brief: composite pictures that fill the field, from a third pass over the reference (`styles/ember-brief/research/explain-composites.md`, K01-K12).

- `hub`: a card fed by a row of app tiles, grey lines curving into it, accent dots flowing down them (or out, with `dir: "out"`), and a figure or one-word state that lands counting on its word.
- `task-card`: a task at work. Steps tick off one by one (every 15 frames, or spread up to a word), a Working bar fills, an optional person row goes from Online to Away, and the status reads the done text at the end.
- `ui-card` `click`: a pointer glides to a row and clicks it, flipping its toggle or selecting it.
- `capture-card` `pop`: a dark chip with an accent star pops out beside a captured row and counts up to the page's exact figure.
- Edit skill: "Real footage of real things". When the speaker names a real product, the planner finds its maker's launch or demo video (the repository's media, the site, the maker's X or YouTube posts), downloads it with yt-dlp and cuts short clips and stills into the project. Ember Brief's evidence rules say to prefer that footage to a redrawn card.
- STYLE.md: a "Fill the zone" rule (prefer composites and large cards to a short row of tiles or chips) and four new rows in the idea-to-device table.

## 0.3.1

Windows support. Motus now runs on Windows 10 and 11. Checked on a Windows runner: `motus doctor`, transcription with faster-whisper, the app and Studio servers, the unit tests and an end-to-end render. The person matte and face tracking stay macOS only (Apple Vision); Windows uses the un-matted framing that was already the fallback.

- Python: the engine now looks for Python 3 instead of assuming `python3`. On Windows it tries `py -3`, then `py -3.13` to `py -3.10`, `python` and `python3`, because `python3` there is usually the Microsoft Store placeholder; elsewhere `python3`, `python3.13` to `python3.10`, then `python`. It uses the first one that has faster-whisper, so a machine whose newest Python is too new for faster-whisper's packages can keep it in an older one. `MOTUS_PYTHON` still wins. Fix messages name the command that works on that machine, and `doctor` says what to do when the Python is newer than 3.13.
- Browser: Windows looks for Chrome machine-wide and per user (`%LOCALAPPDATA%`), then Edge (ships with Windows), Chromium and Brave. Headless Chrome is ended with `taskkill /T` on Windows, which has no process groups.
- No console windows: every program the engine starts (ffmpeg, Chrome, Python, the app and Studio servers) is started hidden. The detached app and Studio servers have no console on Windows, so before, each ffmpeg, Python or Node process they started during ingest, loops and renders opened a console window of its own.
- File locks: on Windows a virus scanner or a server reading a file can block a rename for a moment. JSON saves, scene loops, the frame cache and uploads now retry the rename for up to about 4 s instead of failing.
- Contact sheets: ffmpeg now reads the label font by a relative name from its own folder. An absolute Windows path in the filter graph needed escaping for the drive letter's colon, and a quote in a user name broke it on any system.
- Transcription on a fresh install: `pip install faster-whisper` now brings a PyAV release whose `open()` no longer takes the `metadata_errors` argument that faster-whisper 1.2.1 passes, so every transcription failed. `transcribe.py` now decodes the audio with ffmpeg (16 kHz mono float samples) and hands faster-whisper the samples, which never touch PyAV. This affected every system, not only Windows; machines with an older PyAV kept working.
- Transcription: on a machine with an NVIDIA card but no CUDA libraries, faster-whisper's `auto` device failed. It now falls back to the CPU and says so. The "not installed" fix names the interpreter that ran.
- Names: project folders and uploaded files never take a name Windows reserves for devices (`con`, `nul`, `com1`). Upload names lose trailing dots and spaces.
- `motus doctor` gives install commands for each system: `winget` on Windows, Homebrew on macOS, the package manager on Linux.
- The app keeps videos in `Videos\Motus` on Windows. "Show in Finder" reads "Show in File Explorer" there and opens Explorer with the file selected. Commands printed for the agent use forward slashes on Windows, which every Windows shell accepts.
- Tests: `hasBinary` respects `PATHEXT`, so the ffmpeg tests run on Windows. New tests cover the browser and Python search order, reserved names and the install hints. The end-to-end test runs on Windows too: its "browser that cannot start" is `node.exe` there (a shell script cannot run), it checks for left-over Chrome profiles in `TEMP`, and its colour check allows 6 levels there instead of 4 (a GPU-less Windows runner rendered saturated bars up to 5 levels darker, with ffmpeg 7.1 and 9.0 alike). On Windows: 117 unit tests pass (3 POSIX-only skipped) and the end-to-end render passes.

## 0.3.0 (unreleased)

- Added Prop Room (beta): a pale panel over the speaker, hard cuts about every two seconds between the split, full-frame scenes and short full-height speaker beats, one-to-three-word captions on a dark plate across the seam, and a quoted serif keyword to close. Measured from 19 reels in nine dimensions plus an explanation pass over all 279 graphic units, with an independent verification of 29 numbers (`styles/prop-room/research/`).
- Prop Room draws its pictures in code. The `prop` element renders an SVG with named parts that beats move (show, hide, move, fill, draw, spin, swap, recolor, pulse, badge); `props/` holds 22 library props and `props/STANDARD.md`, the drawing standard the planning agent follows to draw a new prop for a video. 19 more elements cover figures (counter, big number, value bars, item sets, name reveal, stamp, route) and rebuilt interfaces (window with a pointer, prompt, picker, file drop, checklist, item stack, before/after wipe, captured page, code window, key caps, title card).
- Prop Room sound: three original beds (130 BPM, 118 BPM, a pad) and four effect families with action textures, synthesised by `dev/make-audio.mjs` and placed by `src/sound.js` from the measured rules. Not yet auditioned.
- Prop Room fonts: Inter, PT Serif Bold and JetBrains Mono, all SIL OFL 1.1, with their notices in `assets/fonts/OFL.txt`. PT Serif Bold stands in for the reference's unidentified serif.
- Both plugin manifests now use 0.3.0. Local integration only; nothing has been published.

## 0.2.0 (unreleased)

- Added Ribbon Depth (beta): behind-head glass ribbon and cards, mixed DM Sans/Playfair italic type, abstract sequence/search/action scenes, comparison, photo fan, filmstrip and circular portrait layouts. Violet is based on moving public samples; Light Lime has static reference evidence and extrapolated motion.
- Added `/motus:ribbon-reel`: content-led planning with variable duration, word anchors, persistent elements and materially different scene alternatives. No fixed ten-second/five-scene recipe.
- Added original synthesized sound effects, openly licensed fonts, measured research notes, two worked examples, style-specific plan audit and browser checks for repeat seeking and matte fallback.
- Ribbon Depth 0.2.0 rebuild after owner review. A 3D glass spiral ribbon (perspective, depth-sorted, bloom, sparkles) turns for the whole run. Entrances go blur-to-sharp. The phrase is now a text stack (capsule, lead line, heavy italic hero, self-drawing underline, node timeline). Rear cards get two-line titles, check-in rows and icon tiles. Camera shakes are measured from the public shake preview. Transitions use zoom-defocus out and a vertical smear with RGB split in. The abstract world gains a bright core, bokeh and a light trail between cards. New Orange palette (default). `clean` keeps the room grade. Rules: `research/design.md` D09.
- Ribbon Depth scene library (D13): the ribbon is now a placed `fx` effect with four forms (spiral, sweep, halo, arc), used on the hook and a few later moments instead of every speaker scene. New topic-agnostic devices: `stat`, `chat`, `chart`, `orbit`, `quote`, `swap`, `notify` and `big-word`. New `split` layout (speaker window plus panel). The audit gains variety warnings. Fitness, finance and cooking example plans were added. The ribbon bloom no longer uses canvas blur filters, and the browser check now verifies exact style state between seeks.
- App: a style manifest can set `order` (lower first) and the style list sorts by it, then by name. Ribbon Depth uses `order: 0`, so it is the first look on the app's "Pick a look" screen and in `motus styles`.
- App: each style card on "Pick a look" now plays a few seconds of a real edit in that style (three clips side by side, silent, looping; a still when reduced motion is on). Packs declare it with `"preview"` in their manifest; the app serves only those declared files. `styles/_tools/make-preview.mjs` builds the preview from a render. All four styles have one.
- Engine: conform forces square pixels after the 9:16 crop (`setsar=1`). An even-rounded crop of a 4K horizontal source left SAR 9728:9729, AVFoundation read the width as 1079 and the person matte came out sheared. The matte step now refuses a byte count that is not a whole number of frames.
- Both plugin manifests now use 0.2.0. Local integration only; nothing has been published.

## 0.1.0 (unreleased)

First version. Not yet published.

### Engine

- Command line tool `engine/bin/motus.mjs` with the commands `doctor`, `styles`, `init`, `ingest`, `sheet`, `conform`, `capture`, `validate`, `stills`, `studio`, `wait`, `ack` and `render`. Every command takes `--json`. Errors carry a `fix` line.
- Node 22 or newer, built-in modules only. No npm dependencies.
- Ingest: 48 kHz audio extraction, transcription with word timings through `faster-whisper` (`large-v3-turbo` by default), silence detection, retake, filler and stutter candidates, suggested cuts, contact sheets with burnt-in timestamps.
- Conform: output timeline from `plan/cuts.json` at 1080x1920 and the source frame rate, 9:16 crop around the speaker, voice track with 8 ms fades at each join, words re-timed to the output timeline, preview proxy.
- Wide view: a style can ask for it in its manifest (`"footage": {"wide": true}`). Conform then also keeps the whole source frame, at 960 px high and at most 1706 wide, with its own person matte. It is packed beside the footage, so preview and renders stay in sync. The resolved document says where the 9:16 window and the speaker sit inside it, and `env.footage.view({ wide: true })` shows it. Styles that do not ask are unchanged.
- Person matte and face tracking through Apple Vision on macOS, compiled from `engine/swift/motus-vision.swift` on first use. Other systems skip both.
- Page capture: `motus capture <url>` screenshots a page in headless Chrome and records where given phrases sit, so a style can mark the real text.
- Edit plan (`plan/edit.json`): scenes that tile the transcript by word index, 2 to 4 options per scene, layouts, slots, elements and beats declared by the style. `motus validate` rejects unknown fields and reports a fix for each error.
- Renderer: headless Chrome over the DevTools Protocol draws each frame, in parallel pages. ffmpeg encodes H.264 high profile with AAC 192 kb/s at 48 kHz. The mix (voice, sound effects, optional music) is normalised to -14 LUFS with a -2 dBTP ceiling.
- Music beds: a style's bed can ask for an end fade (`"fadeOut": seconds` in its `beds` entry). Only the music fades, linearly, over the end of the video, in the render mix and in the preview.
- Stills: option posters, contact sheets of the planned cut, strips through one option, and single frames. Posters are redrawn when the style's files, the captions or the look change (`review/posters/.stamp`), or with `--force`.

### App

- `motus app` starts the Motus app: a local home page where a person drops or chooses a video, picks how to cut it, a style and names to spell, and follows every project from listening to the finished file. Projects live in one workspace (`~/Movies/Motus` by default, `MOTUS_HOME` to change it).
- The AI session that starts the app works for it in the background: `motus next` hands it one job at a time (plan a new video, revise after notes), `motus say` shows its progress in the app, `motus done` finishes the job. The app and Studio show whether a session is connected and what it is doing.
- New skill `start`: what an agent does when the user hands it the Motus folder and says "go". `CLAUDE.md` and `AGENTS.md` point to it.

### Style packs: release palettes

- Each style keeps its measured layout, type, timing and motion, with its own palette for release. Editorial Proof: emerald (default) and violet looks over a white grid; the palm-frond canvas is gone. Night Class: cobalt where it had red, ice cyan where it had yellow. Ember Brief: magenta where it had orange, on neutral greys. Every measured value sits next to its replacement in the style's `research/colour.md`.
- Renamed ids: Editorial Proof `look.accent` `blue` -> `emerald` and `lime` -> `violet` (and `comment-cta` tones `emerald`, `violet`); Night Class `capture.frame` and `tier-bars` tone `red` -> `cobalt`. Plans that use the old ids fail validation with the new choices listed.

### Studio

- Local review page served by `motus studio` on `localhost`: a player for the current cut, one section per scene with its options playing over the footage, pick, note and lock per scene, global look choices, a safe-zone overlay for Instagram Reels, keyboard shortcuts.
- "Send notes to the agent" and "Render final video" write a submission that `motus wait` returns to the agent. `motus ack` files notes as addressed.
- Rendering from Studio runs on the local server with live progress.
- Scene grid: every scene as a tile looping its picked option (drawn in the background by `motus stills --loops`, into `review/loops/`), with option pills, lock and a scene dialog. The list view is one click away.
- Studio grows with the window: the player up to 760 px wide, option cards up to 360 px, the scene list up to 1680 px. It links back to the app, names the AI session ("Send notes to Claude"), says when no session is connected, and has Show in Finder on the finished video.

### Style packs

- Editorial Proof 0.1.0 (`styles/editorial-proof/`), beta. Measured from 33 public short videos by one creator, published 12 October to 9 November 2026. Layouts: light split, dark focus, white, full-frame presenter. Accent colours: blue and lime.
- The style manifest is generated from the element modules by `styles/editorial-proof/build-manifest.mjs`.
- Night Class 0.1.0 (`styles/night-class/`), beta. Measured from 32 teaching reels by one creator, published 10 October to 11 November 2026, with an independent verification pass over 74 quantities. Layouts: panel on a dark field, panel on a light field, full-height presenter. 17 elements: title lockup, comment call to action, steps (rows, chips, or a numbered list with a moving highlight), document card (typed lines, glowing highlights), capture and phone (with spotlights), stat card (rolling figure), benchmark tiers, table, before and after, script line, line chart, icon nodes, statement, closing pages, push-in, closing keyword. A second graphic can sit beside the first (side slot), and held graphics creep larger as in the reference. Look choices: sound kit, music bed, dark-field texture. Fonts Inter (optical size 14) and Instrument Serif Italic; original synthesised sounds and bed.
- Ember Brief 0.1.0 (`styles/ember-brief/`), beta. Measured from 11 reels by one creator, published 2 to 7 November 2026, with an independent verification pass over 107 quantities (11 corrected). Layouts: split (a dotted field over the speaker in the bottom half) and full graphic, with an animated change between them. 19 elements. Evidence and structure: opening title with an illustration slot, comment call to action, numbered section heading, page capture with highlight and outline marks, redrawn app card (rows, toggles, placeholder bars), prompt box, chat card, chips, logo tiles, series grid, before and after, phone. Explanation, from a second study of the reference's 51 illustration and diagram units (92 more rules): a picture with word-timed badges, tags, chips and a speech bubble, with still cut-outs printed in a measured halftone look; a counting figure whose picture fills as it counts; a link between two things (a line that draws, a token that travels, a check that lands); a process (something goes into a tool and comes out changed); a two-way comparison that can race; one card per listed noun, or one card that swaps; a demo player. Two-word captions with the spoken word in the accent colour. No sound effects; one original synthesised music bed. Font Outfit, which is the reference typeface (overlay score 0.97 to 0.99). No look choices.
- `text-card`: a paragraph of 3 lines or fewer is set at the 94 px line pitch, the top of the measured range (research/graphics.md G07), so short claims fill the card instead of sitting small in it.

### Skills

- `edit`: the editing procedure, with references for the edit plan and troubleshooting.
- `styles`: lists installed styles.
- `doctor`: checks the machine.
- `new-style`: builds a new style pack from reference videos.

### Packaging and documentation

- Claude Code: `.claude-plugin/plugin.json` and a single-repository marketplace in `.claude-plugin/marketplace.json` (marketplace name `motus-market`).
- Codex, experimental: `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json`.
- `README.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/ADDING_A_STYLE.md`, `skills/edit/references/troubleshooting.md`.
- Tests: `node --test tests/` (node:test, no dependencies); `MOTUS_E2E=1` adds an end-to-end ingest, conform and render.
- Licences: `OFL.txt` beside the bundled fonts; a provenance and licence note beside the sound effects and music beds.

### Security

- Studio answers only requests whose `Host` is its own loopback address (stops DNS rebinding) and accepts writes only as JSON from its own origin (stops cross-site form posts).

### Known gaps

- Tested on macOS only. Linux and Windows are untested.
- Codex: marketplace listing checked, install and end-to-end use not checked.
