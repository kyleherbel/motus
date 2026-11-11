# Changelog

All notable changes to Motus are recorded here. The plugin version is the `version` field in `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`. Each style pack has its own version in `styles/<id>/style.json`.

## 0.1.0 (unreleased)

First version. Not yet published.

### Engine

- Command line tool `engine/bin/motus.mjs` with the commands `doctor`, `styles`, `init`, `ingest`, `sheet`, `conform`, `capture`, `validate`, `stills`, `studio`, `wait`, `ack` and `render`. Every command takes `--json`. Errors carry a `fix` line.
- Node 22 or newer, built-in modules only. No npm dependencies.
- Ingest: 48 kHz audio extraction, transcription with word timings through `faster-whisper` (`large-v3-turbo` by default), silence detection, retake, filler and stutter candidates, suggested cuts, contact sheets with burnt-in timestamps.
- Conform: output timeline from `plan/cuts.json` at 1080x1920 and the source frame rate, 9:16 crop around the speaker, voice track with 8 ms fades at each join, words re-timed to the output timeline, preview proxy.
- Person matte and face tracking through Apple Vision on macOS, compiled from `engine/swift/motus-vision.swift` on first use. Other systems skip both.
- Page capture: `motus capture <url>` screenshots a page in headless Chrome and records where given phrases sit, so a style can mark the real text.
- Edit plan (`plan/edit.json`): scenes that tile the transcript by word index, 2 to 4 options per scene, layouts, slots, elements and beats declared by the style. `motus validate` rejects unknown fields and reports a fix for each error.
- Renderer: headless Chrome over the DevTools Protocol draws each frame, in parallel pages. ffmpeg encodes H.264 high profile with AAC 192 kb/s at 48 kHz. The mix (voice, sound effects, optional music) is normalised to -14 LUFS with a -2 dBTP ceiling.
- Stills: option posters, contact sheets of the planned cut, strips through one option, and single frames. Posters are redrawn when the style's files, the captions or the look change (`review/posters/.stamp`), or with `--force`.

### Studio

- Local review page served by `motus studio` on `localhost`: a player for the current cut, one section per scene with its options playing over the footage, pick, note and lock per scene, global look choices, a safe-zone overlay for Instagram Reels, keyboard shortcuts.
- "Send notes to the agent" and "Render final video" write a submission that `motus wait` returns to the agent. `motus ack` files notes as addressed.
- Rendering from Studio runs on the local server with live progress.

### Style packs

- Editorial Proof 0.1.0 (`styles/editorial-proof/`), beta. Measured from 33 public short videos by one creator, published 12 October to 9 November 2026. Layouts: light split, dark focus, white, full-frame presenter. Accent colours: blue and lime.
- The style manifest is generated from the element modules by `styles/editorial-proof/build-manifest.mjs`.
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
