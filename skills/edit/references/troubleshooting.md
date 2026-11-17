# Troubleshooting

Every engine error prints what went wrong and a `fix:` line. This page covers the cases that need judgement.

| Symptom | Cause | What to do |
|---|---|---|
| `motus doctor` fails on `chrome` | No Chromium-based browser found | Install Google Chrome, or set `MOTUS_CHROME=/path/to/browser`. On Windows, Microsoft Edge is found when Chrome is missing. |
| `motus doctor` fails on `python` on Windows | Only the Microsoft Store placeholder `python3` exists | `winget install Python.Python.3.12`, then open a new terminal. Motus tries `py -3`, `python`, then `python3`. |
| `pip install faster-whisper` fails while building `av` or `ctranslate2` | The default Python is newer than faster-whisper's packages | Install Python 3.12 beside it (`winget install Python.Python.3.12`, or `brew install python@3.12`) and run `py -3.12 -m pip install faster-whisper` (macOS: `python3.12 -m pip …`). Motus uses whichever Python has faster-whisper. |
| `motus doctor` fails on `faster-whisper` | Python package missing | Run the command on the `fix:` line (`python3 -m pip install faster-whisper`; on Windows `py -3 -m pip install faster-whisper`). The first transcription downloads the speech model (about 1.6 GB); tell the user before it starts. Use `MOTUS_PYTHON` to point at another interpreter and `MOTUS_WHISPER_MODEL` (for example `small`) on slow machines. |
| Ingest is very slow | Speech model on CPU | Normal on the first run (model load). A one-minute clip takes roughly one to two minutes on an Apple Silicon laptop. On a machine with an NVIDIA card but no CUDA libraries, transcription notes "GPU transcription failed; using the CPU" and carries on. |
| Transcript has wrong names | ASR guesses unfamiliar words | Re-run ingest with `--prompt "Exact Name, Other Term"`, or repair single words with `captions.fixes` in the plan. |
| "Matte: no" after conform | Not macOS, no Swift toolchain, or no person found | The style still works; effects that need the cut-out (head rising above a panel) are skipped. On macOS: `xcode-select --install`, then conform again. |
| Source is horizontal or not 9:16 | Shot wide | Conform centre-crops to 9:16 around the speaker. Check the contact sheets: if the speaker leaves the crop, say so to the user before planning. |
| Face framed very tight or very loose | The style expects a certain head size | The style rescales and repositions from `conform/timeline.json` → `framing`. Read the style guide's section on framing; some layouts are unsuitable for very tight shots and the guide says which to prefer. |
| `validate` says a scene "starts at word N but the previous scene ended at word M" | Scenes do not tile | Fix the `words` ranges so each scene starts at the previous scene's last word + 1. |
| `validate` rejects a field | Not declared by the style | Read `style.json`: use only its layouts, slots, element types, parameters and beats. |
| Stills are black where the presenter should be | Footage frames missing or stale | Run `motus conform <project>` again, then `motus stills`. |
| Studio shows "lost its connection" | The server stopped (it exits after six idle hours) | `motus studio <project>` again; decisions are saved in `review/state.json`. |
| `motus wait` never returns | The user has not pressed Send notes or Render | Remind the user; or pass `--timeout 600` and check in. |
| Render stops at "drawing frames" | Chrome was closed, or the machine slept | Run `motus render <project>` again. Use `--workers 2` on machines with little memory. |
| Final audio too quiet or loud | Delivery target is −14 LUFS, true peak below −1.5 dBTP | The renderer normalises automatically and reports the measured loudness; if the report is off by more than 1 LU, tell the user the numbers. |
| The user changed their mind about cuts after planning | Word indexes shift when cuts change | Edit `plan/cuts.json`, run `motus conform`, then re-check every scene's `words` and beats against the new `conform/words.json` before validating. |

## Useful files when debugging

- `project.json` → `stages`: what has run and when.
- `review/server.log`: Studio server output.
- `motus resolve <project>`: prints exactly what the style will draw (scene times, picked options, words with emphasis).
- `motus stills <project> --at 12.4`: one full-resolution frame of the current cut.
