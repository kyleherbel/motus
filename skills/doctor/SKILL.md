---
name: doctor
description: Check that this machine can run Motus (ffmpeg, Node, Chrome, Python with faster-whisper, the optional macOS person matte) and help fix what is missing. Use when Motus fails to start, a render or transcription errors out, or the user asks whether their setup is ready.
---

# Motus doctor

Run `node "${CLAUDE_PLUGIN_ROOT}/engine/bin/motus.mjs" doctor` (outside Claude Code the CLI is two folders above this skill: `<this skill>/../../engine/bin/motus.mjs`).

- `ok`: nothing to do.
- `FAIL`: required. Show the user the `fix:` line. Installing software is the user's decision: give the exact command and ask before running it.
- `warn`: optional. Without the macOS person matte, styles skip effects that need the speaker cut out from the background; everything else works.

Requirements: ffmpeg and ffprobe (with libx264, drawtext, loudnorm), Node 22 or newer, Google Chrome or another Chromium-based browser, Python 3.9 or newer with `faster-whisper`. The first transcription downloads a speech model of about 1.6 GB.

Environment overrides: `MOTUS_CHROME` (browser binary), `MOTUS_PYTHON` (interpreter), `MOTUS_WHISPER_MODEL` (for example `small` or `medium` on slower machines), `MOTUS_CACHE` (where the compiled helper is kept).

For problems after setup, read `../edit/references/troubleshooting.md`.
