---
name: new-style
description: Build a new Motus editing style pack from reference videos. Use when the user wants a new style ("make a style from these reels", "add a style like this creator's"), wants to extend or re-measure an existing style, or asks how styles are made. Covers the corpus, the nine-dimension measured study, verification, building elements against the style contract, the fidelity loop against reference frames, original sound, the planning guide and release.
---

# Build a style pack

A style pack is measured, not designed. You collect finished videos in the target style, measure how they are edited, put every number in one tokens file, build elements that draw those numbers, and compare your frames with the reference until they are hard to tell apart. Each video edited later stays its own; the grammar is what repeats.

Read `docs/ADDING_A_STYLE.md` in full first: it is the method, the folder template and the definition of done. `styles/editorial-proof/` is the worked example: open its `research/`, `src/tokens.js`, `src/elements/` and `STYLE.md` whenever a step below is unclear. `docs/ARCHITECTURE.md` section 5 is the contract a style must satisfy.

Work in a clone of the repository, never in an installed copy of the plugin (it is replaced on update). The engine is `node engine/bin/motus.mjs`.

## 0. Agree the brief with the user

Ask, one question at a time, and write the answers into `corpus/<source>/BRIEF.md`:

1. Which source (a creator, a brand, a channel) and which period. One source and one period per style: mixing sources averages away what makes a style recognisable.
2. Where the videos come from, and the rights. The reference media never enters the repository. If the user cannot say they may use it for study, record "unknown" and continue only for private measurement.
3. What the style is for (which kinds of talking-head video), and what it should not be used for.
4. The style's id (kebab-case) and display name. Never use a real person's or brand's name as the style name.
5. Anything the user already knows they want kept or dropped.

## 1. Corpus

Build `corpus/<source>/` as `docs/ADDING_A_STYLE.md` step 1 describes: original files untouched, a manifest with hashes, a dataset card, per-video transcripts with word timings (run `faster-whisper` the way `engine/py/transcribe.py` does), 1 fps frame samples and contact sheets. Look at every contact sheet yourself and split the videos into families and generations (a visible change in the treatment over time). Decide with the user which family is the style and whether to target the newest generation (usually yes).

`corpus/` is git-ignored. Check that before writing anything into it.

## 2. The nine-dimension study

One analyst per dimension: layout, type, hook, graphics, motion, structure, colour, audio, presenter. The briefs, the common rules and the output format are in `references/dimensions.md`. Each analyst writes `corpus/_study/<source>/<dimension>/result.json`, `numbers.json` and `evidence/`.

- If your environment can run sub-agents in parallel, give each dimension its own agent with the common brief plus its dimension brief. Otherwise run them one after another. Either way each analyst works without reading the others.
- Every rule is a number with evidence (`<clip>@<frame>`) and a confidence. "Looks snappy" is not a rule; "settles over 36 frames on cubic-bezier(0.3,0,0,1), fit error 0.5 %" is.
- Analysts measure at native resolution with code, not by eye, and say what they could not determine (a font file, a sound they cannot hear).

## 3. Verify

Read all nine results side by side. List every number that two analysts disagree on, every rule with confidence below high that the style depends on, and every number a later step will hard-code. Re-measure those yourself (or with an independent verifier) on clips the first analyst did not use. Record the verdicts in `corpus/_study/<source>/_verify/result.json`. The first study had disagreements on card radius, caption weight and whether the background moved: expect some.

## 4. Research record and tokens

- `styles/<id>/research/<dimension>.md` and `README.md`: the verified study as a clean record. Numbers, sample sizes, evidence ids (neutral `clipNN` ids, never platform post ids, URLs or the creator's handle). No media, no long transcript quotes.
- `styles/<id>/src/tokens.js`: every constant the style draws with, grouped by dimension, each with a comment naming the rule it comes from. Elements import from here; a number typed into an element is a defect.

## 5. Build

Copy the skeleton of `styles/editorial-proof/` (style.js, build-manifest.mjs, style.head.json, src/compile.js and the shared modules) and replace its look. Then build elements one at a time:

1. Pick the reference instances of the element (the graphics analyst's mapping table lists them).
2. Extract every frame of two or three instances.
3. Write `src/elements/<type>.js`: params and beats the planning agent can use without mistakes, `prepare` for async loading, `build` returning `{ el, seek(t) }`. `seek` must be a pure function of time: no CSS transitions, timers, `Date`, `Math.random` or network.
4. Write a fixture plan in `dev/fixtures/<type>.json` and render stills and a strip through it (`motus stills --at`, `--scene --option --every`) on a conformed test project.
5. Put our frame and the reference frame side by side at native resolution. Measure the differences (positions, sizes, colours, frame of each build step). Fix and repeat until the remaining differences are small and listed.

Never draw a third party's logo, mascot or interface from the reference. Use monograms, original icons, or assets the user supplies per video.

Run `node styles/<id>/build-manifest.mjs` after every change to an element's params or beats.

## 6. Sound and backgrounds

Synthesise them from the measurements with a deterministic script in `styles/<id>/dev/` (see `styles/editorial-proof/dev/make-audio.mjs`). Reference audio may be measured, never sampled. Background plates are generated by code. Fonts must be under a licence that allows redistribution; ship the licence beside them.

You cannot hear. Before release, list every sound for the user to audition and ask for their verdict.

## 7. The planning guide

Write `styles/<id>/STYLE.md`: the document the planning agent reads before every edit in this style. Structure and density as in `styles/editorial-proof/STYLE.md`: the grammar with numbers, how to segment a transcript, how to choose a graphic for a sentence, captions, the ending, options, variation, and a self-review checklist with pass/fail numbers. Every rule names the study rule it comes from. Add two worked examples in `examples/` and validate their plans for real.

## 8. End-to-end test

Edit a real raw clip with the `edit` skill from start to finish in the new style, through Studio, to `renders/final.mp4`. Look at the result frame by frame against the reference at matching moments. Show it to the user and turn every critique into a measured change.

## 9. Release

1. Set `status` and `version` in `styles/<id>/style.head.json`; regenerate `style.json`.
2. Add a row to the styles table in `README.md` and an entry to `CHANGELOG.md`.
3. Bump `version` in `.claude-plugin/plugin.json` (and `.codex-plugin/plugin.json`) so installed copies update.
4. Run `claude plugin validate .` if the Claude CLI is available, and `node --test tests/`.
5. Check that nothing under `corpus/` or `projects/` is staged.

## When to stop and ask the user

- Which family and generation is the target.
- Naming, rights and anything to be published.
- Fonts or assets that need a licence decision.
- Every sound (they must listen), and the first full render.
