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

On Windows the `fix:` lines use `winget` (`winget install Gyan.FFmpeg`, `winget install Python.Python.3.12`) and `py -3 -m pip install faster-whisper`. After a `winget` install the user must open a new terminal, and you must start a new shell, before the program is on PATH. Microsoft Edge ships with Windows and is found when Chrome is not installed. The person matte is macOS only: on Windows it is a `warn`, never a `FAIL`. If `pip install faster-whisper` fails while compiling a package, the default Python is too new for it: install Python 3.12 beside it and install faster-whisper there (`py -3.12 -m pip install faster-whisper`). Motus picks the Python that has faster-whisper.

Environment overrides: `MOTUS_CHROME` (browser binary), `MOTUS_PYTHON` (interpreter: one program path; without it Motus tries `python3`, `python3.13` to `python3.10`, then `python`, or on Windows `py -3`, `py -3.13` to `py -3.10`, `python`, then `python3`, and uses the first that has faster-whisper), `MOTUS_WHISPER_MODEL` (for example `small` or `medium` on slower machines), `MOTUS_CACHE` (where the compiled helper is kept).

For problems after setup, read `../edit/references/troubleshooting.md`.
