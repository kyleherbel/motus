# Motus

Motus is a plugin for AI coding agents that edits talking-head 9:16 video (Reels, TikTok, Shorts) in a chosen editing style. You give it a raw take or a picture-locked cut, pick a style, choose between options for each scene on a local review page, and get a 1080x1920 MP4.

Version 0.1.0. One style pack, in beta. Built and tested on macOS only. Claude Code is the first target. OpenAI Codex support is experimental.

## How it works

The agent does the judgement. A local engine does the mechanical work. You decide in a browser page called Studio.

| # | Step | Who | What happens |
|---|---|---|---|
| 1 | Set up | you, agent | The agent runs `motus doctor`, asks for the video, whether it is raw or picture-locked, and which style. `motus init` creates a project folder. |
| 2 | Ingest | engine | Extracts the audio, transcribes it with word timings, finds silences and candidate retakes, tracks the face (macOS), and writes contact sheets with the time burnt into every cell. |
| 3 | Understand | agent | Reads the whole transcript and every contact sheet, writes `analysis/understanding.json`, and tells you in a few lines what the video is about. |
| 4 | Cut and conform | agent, engine | Raw mode: the agent chooses the source ranges to keep (dead air, false starts and retakes go). Locked mode: every frame stays. `motus conform` builds the output timeline, the person matte (macOS) and a preview proxy. |
| 5 | Plan | agent | Reads the style's `STYLE.md`, captures the web pages it wants to show as evidence, and writes `plan/edit.json`: the video divided into scenes, each with 2 to 4 alternative treatments built from the style's layouts and elements. `motus validate` checks it. |
| 6 | Self-review | agent, engine | `motus stills` renders posters and contact sheets of the planned cut. The agent looks at them and fixes the plan before you see it. |
| 7 | Studio | you | A local page shows the plan scene by scene. You pick an option, leave notes, and lock scenes. "Send notes" hands your notes to the agent, which revises and updates the page. |
| 8 | Render | engine | Headless Chrome draws every frame of the final cut. ffmpeg encodes H.264 video and AAC audio, with loudness normalised to -14 LUFS. The result is `renders/final.mp4`. |

The same style code draws the Studio preview and the final render, so what you approve is what you get.

## Requirements

| Need | Notes |
|---|---|
| macOS | The only tested platform. See "Status and known limits" for Linux and Windows. |
| Node.js 22 or newer | Runs the engine. No npm packages are installed. |
| ffmpeg and ffprobe | A build with libx264 and the filters drawtext, loudnorm, silencedetect, tile and hstack. The Homebrew build has them. |
| Google Chrome | Or Chromium, Microsoft Edge or Brave. Used headless for rendering and page capture. |
| Python 3.9 or newer with `faster-whisper` | Transcription. `python3 -m pip install faster-whisper`. The first transcription downloads the speech model (`large-v3-turbo`, about 1.6 GB). |
| Xcode command line tools | Optional, macOS only. Provides `swiftc` for the person matte and face tracking (Apple Vision). `xcode-select --install`. The helper is compiled on first use into `~/.cache/motus`. |
| Claude Code, or Codex CLI | The agent that drives the engine. |

`motus doctor` checks every line of this table and prints a fix for anything missing.

Environment overrides: `MOTUS_CHROME` (browser binary), `MOTUS_PYTHON` (interpreter), `MOTUS_WHISPER_MODEL` (for example `small` on a slow machine), `MOTUS_CACHE` (where the compiled helper is kept), `MOTUS_STYLES` (another styles folder).

## Install: Claude Code

The repository is `kyleherbel/motus` on GitHub. While it is private, installing needs read access to it through your git credentials (`gh auth login` or an SSH key), because Claude Code clones it with git.

In a Claude Code session:

```
/plugin marketplace add kyleherbel/motus
/plugin install motus@motus-market
```

Or from a shell:

```
claude plugin marketplace add kyleherbel/motus
claude plugin install motus@motus-market
```

From a local clone, without installing: `claude --plugin-dir /path/to/motus`.

The plugin adds three commands:

| Command | What it does |
|---|---|
| `/motus:edit` | Edits a video: the eight steps above. |
| `/motus:styles` | Lists the installed styles and what each one suits. |
| `/motus:doctor` | Checks this machine and helps fix what is missing. |

A fourth skill, `/motus:new-style`, is for people who build style packs.

The repository is both the marketplace and the plugin (`.claude-plugin/marketplace.json` points at `./`). The plugin version is set in `.claude-plugin/plugin.json`. Claude Code keeps the installed copy until that version string changes, and it does not auto-update third-party marketplaces unless you turn that on under `/plugin`, Marketplaces.

Motus needs local files, ffmpeg and a browser, so it runs in Claude Code on your own machine (the CLI, or a local session in the desktop app). It cannot run in claude.ai chat.

## Install: Codex (experimental)

The Codex packaging is in `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json`. It exposes the same `skills/` folder.

```
codex plugin marketplace add kyleherbel/motus
codex plugin add motus@motus-market
```

Then start a new Codex session and ask for the edit in words, or pick the skill from `/skills`.

What has been checked: with codex-cli 0.167.1, `codex plugin marketplace add` on a local copy and `codex plugin list` find `motus@motus-market` at version 0.1.0. What has not been checked: installing the plugin, loading the skills in a session, running an edit end to end, and whether the Codex sandbox lets the engine start headless Chrome and the local Studio server without an approval.

If the plugin route fails, clone the repository and start Codex inside the clone. `AGENTS.md` at the root tells Codex where the skills and the engine are. Ask it to follow `skills/edit/SKILL.md` for your video.

ChatGPT on the web or on a phone cannot run Motus: it has no access to local files, ffmpeg or a headless browser.

## Quick start

```
/motus:doctor
/motus:edit /path/to/take.mp4
```

1. The agent asks whether the video is raw or picture-locked and which style to use.
2. It ingests the video and tells you what it understood. Correct it if it is wrong.
3. It plans the edit, reviews its own stills, and opens Studio in your browser.
4. In Studio, watch the options, pick one per scene, write notes where something should change, and lock the scenes you are happy with.
5. Press "Send notes to the agent" to get revisions. Press "Render final video" once every scene is locked.
6. The file is at `motus-projects/<video name>/renders/final.mp4` in the folder where you started the agent.

If you would rather skip Studio, say "just render it" and the agent renders its own picks.

### The engine by hand

The engine is a plain command line tool. The agent normally runs it, but you can too:

```
node engine/bin/motus.mjs help
node engine/bin/motus.mjs doctor
node engine/bin/motus.mjs init take.mp4 --style editorial-proof --mode raw
node engine/bin/motus.mjs ingest motus-projects/take
node engine/bin/motus.mjs conform motus-projects/take      # needs plan/cuts.json in raw mode
node engine/bin/motus.mjs validate motus-projects/take     # needs plan/edit.json
node engine/bin/motus.mjs stills motus-projects/take --posters --sheet
node engine/bin/motus.mjs studio motus-projects/take --open
node engine/bin/motus.mjs render motus-projects/take
```

`plan/cuts.json` and `plan/edit.json` are written by the agent (or by you). Add `--json` to any command for machine-readable output. Errors come with a `fix:` line.

## Styles

| Style | Id | Version | Status | Best for |
|---|---|---|---|---|
| Editorial Proof | `editorial-proof` | 0.1.0 | beta | Tool and product breakdowns, numbered lists, news and explainer takes, anything with sources, numbers or screens to show. |

Editorial Proof: claim, then proof. The speaker sits in a panel at the bottom with real evidence above (captured pages, numbers, lists), word-by-word captions with accent keywords, dark focus shots for close reading, and a comment call to action at the end. It has two accent colours, blue and lime. Its layouts, elements and their parameters are listed in `styles/editorial-proof/style.json`.

Run `/motus:styles` or `node engine/bin/motus.mjs styles` to see what is installed.

## How styles are made

A style pack is not designed from taste. It is measured from a corpus of reference videos.

Editorial Proof was built from 33 public short videos by one creator, published between 12 October and 9 November 2026. Nine analysts each measured one dimension (layout, type, hook, graphics, motion, structure, colour, audio, presenter). Every rule is a number with evidence: a count, a frame range, a fit error. A second pass re-measured the disputed and critical numbers. The numbers then became one tokens file, the elements were built against it, and each was compared side by side with reference frames.

The reference videos themselves are never part of this repository. Rights to them are unknown, so they stay on the machine of whoever does the study. Sound effects, music beds and background plates in a style pack are synthesised from the measurements, not copied.

The full method, a folder template and a definition-of-done checklist are in [docs/ADDING_A_STYLE.md](docs/ADDING_A_STYLE.md). The agent procedure is the `new-style` skill.

## Studio

Studio is a web page served from your own machine by `motus studio <project>`. The server listens on `localhost` only, on a free port, and stops by itself after six hours with no page open and no requests.

- A player on the left shows the current cut with a scene timeline under it.
- Each scene has its own section: the time range, what is said, and the option cards playing over your real footage.
- Per scene you can pick an option, write a note, and lock it.
- "Whole video" holds the style's global choices (for Editorial Proof, the accent colour) and an overall note.
- A safe-zone overlay shows where the Instagram Reels interface covers the frame. Its numbers come from one phone screenshot, so treat them as a guide.
- "Send notes to the agent" is the main button while any scene has a note. "Render final video" is enabled when every scene is locked. Rendering shows live progress and ends with the finished file.
- Keyboard: `J`/`K` next and previous scene, `1` to `4` pick an option, `L` lock, `N` note, `Space` play, `S` safe zones, `Cmd`/`Ctrl`+`Enter` send or render, `?` shows the list.

Your decisions are saved in `review/state.json` inside the project, so nothing is lost if the page or the server closes.

## Repository layout

```
.claude-plugin/        plugin.json and marketplace.json for Claude Code
.codex-plugin/         plugin.json for Codex (experimental)
.agents/plugins/       marketplace.json for Codex (experimental)
skills/                edit, styles, doctor, new-style: the agent procedures
engine/bin/motus.mjs   the command line tool
engine/lib/            Node side: project, ingest, conform, plan, capture, render, Studio server
engine/py/             transcription (faster-whisper)
engine/swift/          Apple Vision matte and face tracking, compiled on first use
engine/runtime/        the browser stage shared by preview and render, and the kit styles draw with
engine/studio/         the Studio page
styles/<id>/           one folder per style pack
docs/                  ARCHITECTURE.md, ADDING_A_STYLE.md (troubleshooting: skills/edit/references/)
tests/                 node:test suites and fixtures (node --test tests/; MOTUS_E2E=1 adds a full render)
AGENTS.md              entry point for Codex and other agents
CHANGELOG.md
```

Two more folders exist on a developer's machine and are ignored by git: `corpus/` (reference videos and the studies made from them) and `projects/` (local test projects).

How the parts fit together is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Privacy

The engine runs on your machine. It has no telemetry and no upload code. Its own network use is limited to two things:

1. Page capture. `motus capture <url>` opens the page the agent chose in headless Chrome and screenshots it.
2. The speech model. The first transcription downloads the model through `faster-whisper`, once.

Chrome is started with a temporary empty profile. Motus does not control any background requests the browser itself makes.

The agent is a separate matter. Claude Code and Codex are cloud models. What the agent reads to do its job (the transcript, contact sheets, stills, captured pages) is sent to the agent's provider under your agreement with them. The video file itself is not uploaded by Motus.

Your source video is treated as read-only. Everything Motus writes goes into the project folder, plus a compiled helper in `~/.cache/motus`.

## Licence

Code: MIT, see [LICENSE](LICENSE).

Bundled fonts (Inter, EB Garamond, JetBrains Mono) are under the SIL Open Font License 1.1: see `OFL.txt` beside them. The style's sound effects and music beds are original, synthesised by `styles/editorial-proof/dev/make-audio.mjs`, and MIT like the code: see `LICENSE.md` beside them.

Reference corpora are never included. A style pack contains measurements and original assets only.

## Status and known limits

- macOS first. The person matte and face tracking use Apple Vision through a small Swift helper. Without them (no Swift toolchain, or Linux or Windows) the engine falls back to un-matted framing: no head rising above the presenter panel, and a centre crop for sources that are not 9:16. Linux and Windows have code paths for finding Chrome and opening the browser, but nothing has been run there.
- One style pack, in beta. Expect its elements and rules to change before 1.0.
- Output is always 1080x1920 at the source frame rate. Draft renders are 540x960.
- The source must contain the speech. A file with no audio stream cannot be planned.
- Transcription is automatic and makes mistakes, mostly on names. The agent repairs captions from context. Pass names up front to help it.
- The style was measured on English-language videos. Other languages transcribe, but the caption rules have not been tested on them.
- Text and numbers on screen come from what the speaker says or from a captured page. The agent is told never to invent evidence, but you should still check facts in Studio.
- Codex support is experimental (see above).
