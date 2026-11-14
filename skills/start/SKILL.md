---
name: start
description: Start Motus. Boot the Motus app (a local page where the user drops a video, picks a look, reviews the edit and renders it), open it in the browser, then do the editing work the app sends you in the background. Use when the user says "go", "start", "launch", "open Motus" or similar, or hands you the Motus folder with a word like that.
---

# Motus: start the app and work for it

The user does everything in the Motus app in their browser. Your job in the chat is short: start the app, then stay in a loop doing the thinking work it hands you (planning an edit, revising after notes). Say as little as possible in the chat: the user is looking at the app.

## The engine

The CLI is `engine/bin/motus.mjs` inside the Motus folder: the folder the user gave you, or `${CLAUDE_PLUGIN_ROOT}` in Claude Code, or two folders above this skill (`<this skill>/../../engine/bin/motus.mjs`). Below, `motus …` means `node <that path> …`. It needs Node 22 or newer.

## 1. Start the app

`motus app --open --json`

- It starts the app server (or finds the one already running), opens the page in the user's browser and prints `url`, `workspace` (the folder where the app keeps every project), `ready` and `failing`.
- If `failing` is not empty, this computer is missing something Motus needs. Show the user each `fix` line and ask before installing anything. Run `motus app --json` again when it is fixed.
- If the command itself fails (Node missing or too old, or the sandbox blocks starting a server), say what failed and what to do, in one or two sentences.
- If your sandbox asks for approval to start a local server or open a browser, ask for it. Do not replace the app with something else.

Then tell the user, in one or two lines: the app is open at `url`, drop a video there, and keep this chat open while they edit, because the planning happens here.

## 2. Work loop

Run `motus next --agent "<your name: Claude or Codex>"`, then repeat.

- It waits up to five minutes for work from the app and prints one JSON object.
- Run it in the background if your environment can tell you when a background command ends (Claude Code can). Otherwise run it in the foreground and allow it at least 6 minutes.
- `{"idle": true}`: nothing yet. Run `motus next` again straight away. Do not message the user about it.
- `{"job": "plan", ...}` or `{"job": "notes", ...}`: do exactly what its `instructions` say. They point to the steps of `skills/edit/SKILL.md` that apply. The project folder is `project`.
  - Report progress for the app with `motus say <project> "<short plain words>"` at each real step (for example "Reading the transcript", "Choosing what to cut", "Planning scene 6 of 14", "Checking the stills").
  - Finish with `motus done <project> --summary "<one plain sentence>"`, or `--error "<what went wrong, in plain words>"` if you cannot.
  - Then go back to `motus next`.
- Do not ask the user questions in the chat during a job unless you are truly blocked. They are in the app. Make the judgement calls the edit skill describes yourself.

Keep looping until the user tells you to stop. If they ask you something else in the chat, answer it, then go back to `motus next`.

## What the app does without you

Creating the project, transcription and analysis (`ingest`), Studio, and rendering all run in the app's own servers. You are needed only for understanding, cutting, planning and revising. If a job has already been started by an earlier session, `next` gives it to you again with `"resumed": true`. Check what already exists in the project and carry on from there.

## Stopping

`motus app --stop` stops the app server. Each project's Studio server stops by itself after six idle hours.
