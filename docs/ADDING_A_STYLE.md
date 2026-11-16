# Adding a style

This is the method used to build the first style pack, Editorial Proof, written down so the next style can be built the same way. The agent-facing version of the same procedure is the `new-style` skill (`skills/new-style/SKILL.md`).

A style pack is measured, not designed. You collect reference videos, measure how they are edited, write every number into one file, build elements that draw those numbers, and compare the result with the reference frame by frame.

Three rules hold for every style:

1. **No reference media in the repository.** Reference videos, their frames, their audio, their logos and long quotations of their transcripts stay on your machine in `corpus/`, which git ignores. Rights to that material are unknown unless you hold them.
2. **Every number is traceable.** A constant in the style's tokens file points to the research note that measured it. A research note gives the value, how many clips it was measured on, and where to look.
3. **Sound, backgrounds and fonts are original or openly licensed.** They are synthesised from measurements or taken under a licence that allows redistribution. The licence file ships beside them.

## The twelve steps

| # | Step | Output |
|---|---|---|
| 1 | Assemble the corpus | `corpus/<source>/` with media, manifest and a dataset card |
| 2 | Run the nine-dimension study | `corpus/_study/<source>/<dimension>/result.json` and `numbers.json` |
| 3 | Verify disputed and critical numbers | `corpus/_study/<source>/_verify/result.json` |
| 4 | Decide the target generation | a dated decision in the research notes |
| 5 | Write the research notes and the tokens | `styles/<id>/research/*.md`, `styles/<id>/src/tokens.js` |
| 6 | Build elements against the style contract | `styles/<id>/style.js`, `src/` |
| 7 | Run the fidelity loop | side-by-side comparisons, kept outside the repository |
| 8 | Synthesise sound and backgrounds | `styles/<id>/assets/` |
| 9 | Write `STYLE.md` and worked examples | `styles/<id>/STYLE.md`, `examples/` |
| 10 | Generate the manifest | `styles/<id>/style.json` |
| 11 | Test end to end with a real raw clip | a rendered `final.mp4` you have watched |
| 12 | Version and release | version bump, changelog, plugin validation |

Work in a clone of the repository, not in an installed copy of the plugin. An installed copy is replaced on every update.

## 1. Assemble the corpus

A corpus is a set of finished videos in the style you want, from one source and one period.

What it must contain:

- **The original files**, untouched, one per video. Do not re-encode them. Colour and timing are measured on these files.
- **A manifest**, one record per video: a stable id, the source URL, the publication date, duration, pixel size, frame rate, byte size and a SHA-256 hash.
- **A dataset card**: who the source is, the selection rule (for example "the newest 40 videos that are not pinned"), the date range, what was excluded and why, and the rights status. If you do not know the rights, write "unknown". Do not invent a licence.
- **Transcripts with word timings** for every video. The same `faster-whisper` setup the engine uses is enough. They are machine output, not verified text.
- **Roles.** Mark each video as in-style, earlier treatment, or outlier. Only in-style videos count toward the rules.

How many videos: the first study used 33 in-style videos, 1,211.5 seconds in total. With fewer than about 15 it becomes hard to tell a constant of the style from the habit of one video. That figure is guidance, not a measurement.

Selection must not be cherry-picked. Take a continuous run by date. Keep the outliers in the inventory and mark them, so the next person can see where the boundary was drawn. In the first corpus, 40 videos were collected, 33 were in the current style, 6 showed an earlier treatment and 1 was a landscape outlier.

Folder layout:

```
corpus/                          ignored by git, never committed
  <source>/
    media/<clip>.mp4             originals
    manifest.jsonl               one line per clip
    DATASET_CARD.md              selection, dates, exclusions, rights
    transcripts/ frames/ ...     derived data, as needed
  _study/<source>/
    <dimension>/                 one folder per analyst (step 2)
    _verify/                     the verification pass (step 3)
```

Rights: you may study public videos on your own machine. You may not redistribute them. Nothing from `corpus/` is copied into `styles/`, `docs/` or `tests/`. That includes evidence crops and audio snippets made during the study: they contain reference pixels and sound, so they stay in `corpus/_study/`.

## 2. Run the nine-dimension study

Nine analysts each measure one dimension on the whole corpus. They work independently and do not read each other's results. Independence is the point: where two analysts measure the same thing and agree, the number is solid; where they disagree, you have found something to verify.

| Dimension | What it answers |
|---|---|
| layout | Which full-frame layouts exist, what share of runtime each takes, where every slot sits in pixels, the safe area, how layouts change over the corpus period. |
| type | Which fonts (identified by overlaying candidates on crops), sizes, weights, tracking, caption grouping (words and characters per line), emphasis styles, how words enter. |
| hook | What frame 0 shows, the title template and its build timeline frame by frame, interstitial titles, the closing call to action, the copy patterns of hooks. |
| graphics | The proof components (cards, browser chrome, highlights, strikes, numbers, chips), their geometry, and which spoken clause gets which graphic. |
| motion | Every animation measured per frame: easing curves fitted with an error figure, durations, staggers, what never happens (overshoot, rotation). |
| structure | The grammar: how a video opens and ends, scene lengths, how often something changes, how changes align with sentences and word onsets, the narrative beats. |
| colour | The palette as calibrated hex values, the background plates, shadows, gradients, per-video variation. |
| audio | Loudness, pauses, the music bed and its level under the voice, sound-effect classes, what triggers each one and at what offset. |
| presenter | Face size and eye line per layout, the panel, how the matte is stacked, scale changes, jump cuts, what the raw footage must have looked like. |
| explanation | Added after the third study. For every illustration and diagram: the idea it explains, the events that act the sentence out, the word each lands on, and which devices recur. Run it once the graphics inventory exists. |

Each analyst writes into `corpus/_study/<source>/<dimension>/`:

- `result.json`: the rules.
- `numbers.json`: the full data, plus a `build_spec` block with the constants a builder needs.
- `evidence/`: crops, sheets, plots and snippets that back each rule.
- `scripts/` and `work/`: the measurement code and scratch files.

`result.json` has this shape:

```jsonc
{
  "dimension": "motion",
  "summary": "what was measured, on how many clips and frames, and the main findings",
  "rules": [
    {
      "id": "M01",
      "rule": "Title strip wipes in by width only: left edge fixed, right edge grows, no opacity or scale change.",
      "values": "cubic-bezier(0.2,0,0,1); starts frame 4, 15 frames (500 ms); fit RMSE 0.0013; spread across clips +-0.004",
      "evidence": "n=28 clips frame-identical (for example <clip>@5-19); evidence/pooled_hook_strip_wipe_in.csv",
      "confidence": "high"
    }
  ],
  "constant_vs_variable": "what is identical in every clip, and what changes per video and within which range",
  "open_questions": ["what the analyst could not decide"],
  "needs_human_check": ["what a person must look at or listen to"]
}
```

What makes a rule acceptable:

- **It is a number.** "The title animates in quickly" is not a rule. "Line-1 words appear every 2.5 frames, each over 12 frames, rising 32 px" is.
- **It has evidence.** A count (`n=28 of 33`), clip ids with frame numbers (`<clip>@5-19`), and a file in `evidence/`.
- **It has a confidence.** High, medium or low, with the reason when it is not high. A rule seen once is low.
- **It separates constants from variation.** A constant is the same in every clip to the frame or the pixel. Variation is given as a range and, where possible, as the reason for it (the words, the content, the date).
- **It says what was not done.** The first audio study states that nothing was listened to and that the sound-effect class names were inferred from envelope and spectrum. That sentence is what sends a person to listen before release.

The first study produced 252 rules across the nine dimensions: 153 high confidence, 85 medium, 14 low.

Things the first study learned the hard way:

- **Check the codec and calibrate the decode.** The reference files were VP9, not H.264. A default ffmpeg PNG extraction read about 2 levels low on every channel (white came out as 253). Colours must be sampled through an explicit BT.709 limited-to-full conversion. One analyst reported the card fill as `#FDFDFD`, which is what the uncalibrated decode gives for white. The calibrated value is `#FFFFFF`.
- **Measure on every frame for motion.** Sampling at 2 frames per second finds layouts. It cannot find a 15-frame wipe. The motion analyst measured 37,430 frames.
- **Use voice-free bands for sound effects.** The voice ended at about 15.4 kHz and was high-passed near 50 to 70 Hz, so effects could be timed from the bands above and below it.
- **Low bitrate limits precision.** At 1.1 to 2.1 Mbps, flat patches carry about 2 levels of noise and lines under 4 px carry about 8. Say so beside the number.
- **Agents cannot hear and cannot watch playback.** Anything that depends on listening or on continuous motion goes into `needs_human_check`.
- **Illustrations are rarely stills.** The third study inventoried 51 illustration and diagram units (252 of 427 seconds) and the build first treated them as pictures a user would supply. Watched at every frame, they act the sentence out: a line draws between two things, a badge lands, a figure counts while a picture fills. A 1 fps contact sheet hides all of it. The explanation pass exists so this is measured from the start.

If your environment has sub-agents, run the nine dimensions in parallel, one sub-agent per dimension, each with its own folder. Otherwise run them one after another. The brief for each dimension is in `skills/new-style/references/dimensions.md`.

## 3. Verify disputed and critical numbers

A second, independent pass re-measures two kinds of number.

**Disputed numbers**: where two analysts measured the same thing and got different values. Real examples from the first study:

| Quantity | One analyst | Another analyst | In `tokens.js` |
|---|---|---|---|
| Card corner radius | 18 px median, range 16 to 21 (graphics) | 26 px (layout) | 18 |
| Card outline width | 3 px median (graphics) | 4 px (layout) | 4 |
| Card outline colour | `#2066BC` (graphics) | `#1562C8` (colour, calibrated decode) | `#1562C8` |
| Card fill | `#FDFDFD` (graphics) | `#FFFFFF` (colour, calibrated decode) | `#FFFFFF` |
| Caption word rise | about 5.4 px (type) | about 10 px (motion) | 10 |

**Critical numbers**: values that every frame depends on, even when nobody disputes them. The caption size and baseline, the card column, the two easing curves, the presenter face size and eye line, the mix levels.

The verifier does not read the analysts' scripts. It goes back to the reference frames, measures again with its own method, and records for each number: the two claims, its own value, the method, the clips used, and the verdict. Write the result to `corpus/_study/<source>/_verify/result.json`. A number that cannot be settled stays open and goes to a person.

Then collect every `open_questions` and `needs_human_check` entry from the nine results into one list. Some can be settled by the verifier. The rest are questions for a person (see "When to involve a person" below).

## 4. Decide the target generation

Creators change their templates. A corpus that covers a month will contain more than one version of the style. You must choose which one to reproduce, on purpose.

In the first corpus:

- The blue-outlined presenter panel that reads as the current look appears in only 6 of 33 videos, all from the last week. The other 27 use a plain panel in five different geometries.
- The call-to-action keyword lands 10 frames after the verb in the 8 oldest videos and 14 frames after it in the 25 newer ones.
- Six still older videos used a different treatment altogether and were kept out of the study.

Editorial Proof targets the newest generation: the outlined panel, the 14-frame offset, the face size and eye line of the last 14 videos.

How to decide:

1. List every quantity that changed over time, with the dates and the count of videos on each side.
2. Default to the newest generation that has enough evidence to be measured. A generation seen in two videos is a guess.
3. Do not average across generations. A panel halfway between two real panels matches neither.
4. Ask the owner when the newest generation is thin or when older and newer forms alternate.
5. Write the decision into the research notes with the date and the reason. Keep the older generation's numbers there too, marked as not built.

## 5. Write the research notes and the tokens

**Research notes** (`styles/<id>/research/<dimension>.md`) are the public, text-only distillation of the study. One note per dimension. Each rule keeps its id, its values, its count and its confidence. Evidence is described in words and by clip id and frame, not by image. Use neutral clip ids (`clip01`, `clip02`, ... by publication date) and keep the map to the source posts in `corpus/_study/<source>/clip-ids.json`. The ids are scoped to one style: `clip07` in one style's notes and `clip07` in another's are different videos; never publish a platform's post ids, URLs or the creator's handle, because they identify whose work was measured. No reference pixels, no audio, no transcript passages beyond the few words needed to describe a pattern. Include the verification verdicts and the generation decision.

**Tokens** (`styles/<id>/src/tokens.js`) hold every number of the style in one file. Nothing else in the style contains a measured constant.

Rules for the tokens file:

- Group the numbers by study, and name the research note at the top of each group.
- Geometry is in pixels on the 1080x1920 canvas. Times are in seconds. If the reference was measured in frames at 30 fps, write `F(15)` instead of `0.5`, so the number in the file is the number in the study.
- Colours are the calibrated values.
- Give each look (accent colour, theme) its own block. Do not derive one look from another by formula unless the study shows the reference does.
- A comment beside a non-obvious number says what it is and where it was measured.
- A number with no research behind it is a bug. If you had to guess, write the guess into the research note as a guess.

In Editorial Proof, `src/tokens.js` has six groups after the canvas constants: colour, type, layout, presenter, motion and sound. Its motion group has three measured easing curves and a comment that nothing overshoots, rotates or bounces, because the motion study recorded what never happens as well as what does.

## 6. Build elements against the style contract

The engine's contract with a style pack is in [ARCHITECTURE.md, section 5](ARCHITECTURE.md#5-style-pack-contract). In short, the engine needs three things from a pack:

- `style.json`: the manifest. It declares the layouts, their slots, the elements each slot accepts, and each element's parameters and beats. The engine validates every edit plan against it and Studio labels things from it.
- `STYLE.md`: the rules the planning agent follows.
- `style.js`: a browser ES module whose default export is `{ id, setup(env), compile(doc, env) }`.

`compile` receives the resolved document (scenes with their picked options, words with times, the look, framing) and returns:

```js
{
  el,                    // one HTMLElement; the stage appends it
  seek(t) {},            // draw output time t, in seconds
  audio: [{ t, sfx, gainDb }],   // sound events on the output timeline
  posterTime(sceneId) {},        // optional: the most representative instant of a scene
  ready,                 // optional promise: resolves when images are decoded and seek may be called
}
```

### Purity of seek

`seek(t)` must be pure: the same `t` gives the same pixels, whatever was drawn before.

The reason is how the engine uses it. The preview calls `seek` once per video frame in order. The renderer runs several browser pages in parallel, each starting at a different frame. Stills and posters jump to arbitrary times. Studio seeks when you scrub. If the picture depends on what was drawn before, these four disagree and the final file does not match what was approved.

So, inside a style:

- No clocks: no `Date.now()`, no `performance.now()`, no `requestAnimationFrame`.
- No randomness except the seeded generator (`kit.seeded(n)`) or a hash of a stable string (`kit.hash(str)`).
- No CSS transitions or animations, and no media that runs on its own clock. Every style property is computed from `t`.
- No state that accumulates across calls. Compute from `t` every time.
- Fonts load in `setup`. Images load before `ready` resolves.

### Parameters and beats

An element's **parameters** are what the plan supplies: text, an asset path, a list of rows. Each has a spec:

| Spec | Meaning |
|---|---|
| `"string"`, `"number"`, `"boolean"` | a value of that type |
| `"asset"` | a path under the project's `assets/` folder that must exist |
| `"word"` | a word index in the transcript |
| `"enum:a\|b\|c"` | one of the listed values |
| a `?` in the string (`"string?"`, `"enum?:a\|b"`) | optional |
| `{ "type": "string", "maxChars": 22, "maxWords": 4 }` | text with layout limits |
| `{ "type": "number", "min": 1, "max": 4 }` | a bounded number |
| `{ "type": "array", "min": 2, "max": 6, "of": { ... } }` | a list of records |

Add `"optional": true` to the object form to make it optional. Limits such as `maxChars` are layout facts measured on the style: the longest text that fits the slot at the reference size. The validator enforces them, so a plan cannot overflow a card.

**Beats** are things that happen inside an element while it is on screen: a highlight sweeps, a price is struck, a total lands. A beat has a name, its own parameters, and an anchor in the plan (`at`: a word index, or a time). Anchoring to words is what keeps graphics in step with speech when the cut changes.

Keep parameters few. Every parameter is a decision the planning agent can get wrong. If the reference never varies something, make it a token, not a parameter.

### Element modules: prepare, prefer, build

Editorial Proof keeps one module per element in `src/elements/`, all with the same shape. The engine does not require this shape. It is the convention that lets the manifest be generated from the code, and the next style should use it.

```js
export default {
  type: 'price-list',            // the id plans use
  label: 'Price list',           // what Studio shows
  slots: ['card'],               // which slot kinds it can fill
  params: { /* specs, as above */ },
  beats: { strike: { /* specs */ }, total: { /* specs */ } },

  async prepare(params, S) {},   // optional: load what the element needs (an image, a capture's sidecar) and return it
  prefer(params, ctx) {},        // optional: the size it would like, for example { h: 485 }, given the space on offer
  build(ctx) {                   // required: create the DOM once, return { el, seek(t) }
    return { el, seek(t) {} };
  },
};
```

- **`prepare`** runs once, before anything is drawn, and may be asynchronous. It is the only place an element waits for something. `seek` never waits.
- **`prefer`** lets content size the element inside the limits of its slot. A price list with 3 rows asks for a shorter card than one with 6.
- **`build`** receives the parameters, the rectangle it was given, the layout it sits in, its lifetime (`tIn`, `tOut`), its beats with their times already resolved from word indexes, and whatever `prepare` returned. It builds its DOM once and returns a pure `seek(t)`.

`src/compile.js` turns the resolved document into one composition: it groups scenes into layout runs, creates one element instance per slot and key, calls `prepare`, `prefer` and `build`, decides how each instance arrives, emits the sound events, and returns the single `seek` the engine calls. An element that keeps the same `key` in the same slot across consecutive scenes is one instance: it stays on screen and only its beats advance.

### The kit

The engine hands every style a small kit as `env.kit` (`engine/runtime/kit/`). All of it is pure.

| Part | What it gives |
|---|---|
| Easing | `ease` (named curves), `cubicBezier(x1, y1, x2, y2)` with the CSS definition, `spring(zeta, cycles)`, `tween(t, t0, dur, from, to, fn)`, `prog(t, t0, dur, fn)`, `clamp`, `lerp`, `invLerp`, `remap` |
| Time | `F(n)`: seconds for n frames at 30 fps |
| Determinism | `seeded(n)`: a repeatable pseudo-random generator, `hash(str)`: a stable hash for per-item variation |
| Lifetimes | `Layer` (one element over a time range, with enter and exit progress) and `Group` |
| DOM | `h('div.class', props, ...children)` and `css(el, props)` |
| Text | `measure(str, font)`, `fitSize`, `wrap`, `groupWords(words, opts)` for caption lines, `bare(word)` to strip punctuation |

Footage comes from `env.footage`, not from the kit: `env.footage.view()` returns a canvas the engine keeps on the current frame, and `env.footage.view({ matte: true })` returns the speaker cut out on transparency. The style positions, scales and clips these canvases with CSS. When the project has no matte the cut-out is empty, so every layout must still read correctly without it.

A style may ignore the kit and draw however it likes, as long as `seek` is pure.

### Build order that worked

1. Tokens, grounds (backgrounds), presenter framing and captions. These are on screen in almost every frame.
2. The shared card or frame component, then the marks that sit on it.
3. The elements, most frequent first. The graphics study's mapping of spoken clause to graphic tells you the frequency.
4. Transitions between layouts.
5. Sound events.

## 7. The fidelity loop

Each element is compared with the reference side by side, at the same frame numbers, until the difference is inside the measurement error.

1. **Write a fixture.** A fixture is an edit plan that puts one element or one transition on screen with content shaped like a reference instance. It lives in `styles/<id>/dev/fixtures/`. Write your own copy for it. Do not paste reference transcripts.
2. **Render the fixture.** `MOTUS_EDIT=<fixture.json>` makes the engine read that plan in place of the project's `plan/edit.json`. It is for fixtures and tests only. Run it against a local conformed project:
   ```
   MOTUS_EDIT=styles/<id>/dev/fixtures/<name>.json node engine/bin/motus.mjs validate <project>
   MOTUS_EDIT=styles/<id>/dev/fixtures/<name>.json node engine/bin/motus.mjs stills <project> --at 0.1,0.3,0.5
   MOTUS_EDIT=styles/<id>/dev/fixtures/<name>.json node engine/bin/motus.mjs stills <project> --scene s01 --option a
   ```
   Word indexes in a fixture refer to that project's `conform/words.json`. Fixtures that show images or clips point at files in the project's `assets/`; for Editorial Proof, `node styles/editorial-proof/dev/make-fixture-assets.mjs <project>` generates them (test patterns and generic marks, no real logos or footage).
3. **Extract the reference frames** at the matching frame numbers, with the calibrated decode from step 2.
4. **Compare** in this order: geometry (edges and baselines, in pixels), colour (calibrated levels), then timing (the frame on which each thing starts and ends, and the value on every frame in between for a curve).
5. **Fix the token or the code**, not the fixture. If the fix changes a number, change the research note first.
6. **Repeat** until geometry is within 1 to 2 px, colour within the codec noise, and timing within one frame.

Comparison images contain reference pixels. Keep them in a scratch folder or in `corpus/_study/`, never in the repository.

For still frames the CLI output (JPEG) is enough for geometry. For colour work and for exact frame numbers, drive the stage directly and save PNG: open the stage in render mode, call `window.__motus.seekFrame(n)`, then take a PNG screenshot over the DevTools Protocol. `renderStills` in `engine/lib/render.mjs` shows the calls (`withStage`, `page.eval`, `page.screenshot`); pass `format: 'png'`.

Stop conditions: an element is done when a person shown the reference crop and yours side by side, without labels, cannot say which is which at normal size. Motion is done when the per-frame values match the fitted curve within the fit error the study reported.

## 8. Synthesise sound and backgrounds

Never ship a sound, a music bed, a texture or a logo taken from the reference.

**Sound effects.** The audio study gives, for each class: duration, envelope (attack and decay), spectrum (where the energy sits), stereo width, level relative to the voice, what triggers it and at what offset. Write a generator script that synthesises each one from those numbers and keep the script in the pack's `dev/` folder, so every asset can be regenerated. Normalise the files to one reference level and put the per-event gain in the tokens. In Editorial Proof each effect is normalised so its loudest 50 ms sits at -20 dBFS, and the tokens place each event 16 to 31 dB under a voice at -14.5 LUFS.

**Music beds.** Measure the level under the voice, whether it ducks, its spectrum and its tempo. Then write or generate an original bed with the same role, or ship none and let the user supply music. Do not recreate a recognisable melody.

**Backgrounds.** Describe the plate as a recipe (gradient stops, texture, grain, movement) and draw it in code or generate it. In Editorial Proof the light background is drawn by `src/canvas.js` from a measured recipe: a horizontal gradient, two soft shadows multiplied over it, seeded monochrome grain and a slow wave.

**Logos and screenshots.** The style ships none. Elements take them from the project's `assets/` folder at edit time (a page captured by `motus capture`, a logo the user supplies), and fall back to something neutral when none is given.

**Fonts.** Identify the reference fonts, then check the licence. If a font is not openly licensed, pick the closest open one, record the substitution and its measured difference in the research note, and tell the owner. Ship the font file and its licence text together.

**Listening.** An agent cannot hear. Before release, a person listens to every effect in context and to a full render on headphones and on a phone. The audio study's `needs_human_check` list is the agenda.

## 9. Write STYLE.md and worked examples

`STYLE.md` is what the planning agent reads before it writes an edit plan. The `edit` skill tells the agent that this file is the authority on structure, pacing, copy and its own checklist. The engine cannot enforce taste, so everything the plan depends on must be written here, with numbers.

It must contain:

- **The grammar.** How a video opens and ends, the scene roles, which layouts follow which, how often something must change. Numbers from the structure study.
- **Cut rules** for raw footage, including the longest pause that may survive.
- **Decision rules.** For each kind of sentence (a price, a source, a list item, a name, a step), which element fits and which does not. From the graphics study's mapping.
- **An element guide.** For each element: when to use it, every parameter, every beat, the text limits and one short example.
- **Copy rules.** How titles are worded, how many words, which caption words get emphasis and how often.
- **Evidence rules.** What may be shown, how to capture it, and that nothing is invented.
- **Framing.** What the style expects from the footage, and which layouts to prefer when the shot is very tight or very loose, or when there is no matte.
- **When a single option is honest**, since the engine otherwise expects 2 to 4 options per scene.
- **A review checklist** the agent runs against its own stills before the user sees the plan.

Write it as instructions, in the second person, with the number in the sentence. "Change the layout at a sentence start, within 2 frames of the word onset" is usable. "Keep it dynamic" is not.

**Examples** (`styles/<id>/examples/`): complete edit plans for invented videos, each with a note explaining the choices. Use your own scripts as the spoken text. One example per common video type the style suits is enough.

## 10. Generate the manifest

`style.json` must agree exactly with what the elements accept. Editorial Proof generates it:

```
node styles/editorial-proof/build-manifest.mjs
```

The script merges `style.head.json` (id, name, version, status, summary, best-for list, look choices, emphasis kinds, roles, sound files) with the layouts and the `params` and `beats` of every element module. Parameters are declared once, in the element's own file. Run the script after any change to an element or a layout, and do not edit `style.json` by hand.

Check the result with `node engine/bin/motus.mjs styles --json` and by validating every fixture and example.

## 11. Test end to end with a real raw clip

Fixtures prove the elements. Only a real edit proves the style.

1. Take a raw talking-head clip you own that the reference creator did not shoot. Different person, different room.
2. Run the whole `edit` skill on it with the new style, as a user would: ingest, understanding, cuts, plan, self-review, Studio, render.
3. Check the plan step. Did `STYLE.md` give the agent enough to plan without guessing? Every question the agent had is a gap in the guide.
4. Check `motus validate`: zero errors. Read the warnings.
5. Check the stills against the style's own checklist.
6. Open Studio. Play every option. Pick, note, lock, send notes, render.
7. Check the final file: 1080x1920, the source frame rate, the expected duration, audio present, loudness as reported by the renderer.
8. Watch it once at full size and once on a phone. Listen on headphones and on the phone speaker.
9. Repeat with a clip that stresses the framing (very tight, very loose, or not 9:16) and once with `motus conform <project> --no-matte` to see the fallback.
10. Render each look once.

Then put the reference and your result next to each other and ask someone who knows the reference what gives yours away. Those answers are the next round of step 7.

## 12. Version and release

- The style's version is in its manifest head (`style.head.json` for Editorial Proof). Regenerate `style.json` after changing it.
- Suggested convention: a patch version for fidelity fixes that leave the manifest unchanged; a minor version for new elements, parameters or beats that keep existing plans valid; a major version when a plan written for the old version would fail validation.
- Set `"status": "beta"` until a full end-to-end test has passed and a person has listened to the sound.
- Add the style to the table in `README.md` and write a `CHANGELOG.md` entry.
- Bump the plugin version in `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` together. Installed copies only update when that string changes.
- Run `claude plugin validate .` if the `claude` CLI is installed, and `node engine/bin/motus.mjs doctor`.
- Before committing, check that nothing from `corpus/` or from a comparison folder is staged.

## When to involve a person

An agent can do most of this method. These points need the owner:

| Point | Why |
|---|---|
| Rights and the source | Whether the reference may be studied, and whether the source may be named in public files. |
| The style's name and id | A descriptive name, not the creator's name. |
| The target generation | When the newest form is thin or alternates with an older one. |
| Fonts and licences | Any substitution, and any font that is not openly licensed. |
| Anything that needs listening | Effect character, bed character, perceived balance, a full render on a phone. |
| Anything that needs continuous playback | Whether motion feels right at speed, not only frame by frame. |
| Low-confidence rules | Whether a thing seen once is a rule or an accident. |
| Release | Version, status, and the changelog entry. |

## Folder template for a style pack

```
styles/<id>/
  style.json             the manifest (generated)
  style.head.json        hand-written head of the manifest
  build-manifest.mjs     head + element modules -> style.json
  STYLE.md               the rules the planning agent follows
  style.js               entry: default export { id, setup, compile }
  src/
    tokens.js            every measured number, grouped by study
    compile.js           resolved document -> one composition with one seek
    <part>.js            shared parts: grounds, presenter, captions, card, marks
    elements/index.js    the element registry and the layouts
    elements/<type>.js   one module per element: type, label, slots, params, beats, prepare, prefer, build
  assets/
    fonts/               font files and their licence texts
    sfx/                 synthesised sound effects
    music/               original music beds, if any
    bg/                  generated plates, if not drawn in code
  examples/              complete example plans with notes
  research/              one text note per dimension, plus verification and generation decisions
  dev/
    fixtures/            edit plans that exercise each element and transition
    ...                  generator scripts for sound and plates
```

The folder name, the `id` in the manifest and the `id` exported by `style.js` must be the same. The engine refuses a pack whose folder name and manifest id differ. Folders whose names start with `.` or `_` are left out of the style list.

## Definition of done

Corpus and study

- [ ] The corpus has originals, a manifest with hashes, and a dataset card with the selection rule, dates, exclusions and rights status.
- [ ] All nine dimensions have a `result.json` in which every rule has values, evidence with a count, and a confidence.
- [ ] Constants and variation are stated separately in every dimension.
- [ ] Disputed and critical numbers have a verification verdict.
- [ ] The target generation is decided, dated and written down.
- [ ] Every `needs_human_check` item is either resolved by a person or listed as open in the research notes.

Style pack

- [ ] `research/` has one note per dimension. It contains no reference pixels, audio or long transcript quotations.
- [ ] Every constant in `src/tokens.js` names its research note. No measured number lives outside the tokens file.
- [ ] `seek(t)` is pure. Rendering the same range twice, and with a different `--workers` count, gives the same frames.
- [ ] Every layout reads correctly with no matte.
- [ ] Every element has a fixture and has been compared side by side with the reference: geometry within 2 px, timing within 1 frame.
- [ ] Sound effects, beds and plates are synthesised or openly licensed. Their generator scripts are in `dev/`. Licence texts sit beside fonts and any third-party asset.
- [ ] `STYLE.md` covers grammar, cut rules, decision rules, every element, copy, evidence, framing, the single-option rule and a review checklist, with numbers.
- [ ] `examples/` has at least one complete plan that validates.
- [ ] `style.json` is regenerated and `motus styles --json` lists the style.

Proof

- [ ] A real raw clip from a different speaker went through the whole `edit` skill to a rendered final.
- [ ] The final is 1080x1920 at the source frame rate, with audio, at the loudness the renderer reports.
- [ ] A person has watched it at full size and on a phone, and listened on headphones and on a phone.
- [ ] The no-matte fallback and every look have been rendered once.

Release

- [ ] The style version is set and its status is honest (`beta` until the proof list is complete).
- [ ] `README.md` lists the style. `CHANGELOG.md` has an entry. The plugin version is bumped in both plugin manifests.
- [ ] `claude plugin validate .` passes.
- [ ] Nothing from `corpus/` is in the commit.

## A preview for the style picker

The app's "Pick a look" screen shows each style with a few seconds of a real edit. Render a take of your own in the new style, pick three moments where its signature elements land, and run:

```
node styles/_tools/make-preview.mjs <style-id> <render.mp4> <t1> <t2> <t3>
```

It writes `preview.webm` (three 2.5 s clips side by side, silent, looping, transparent corners) and `preview.webp` (a still from three quarters in) into the pack. Add `"preview": { "video": "preview.webm", "poster": "preview.webp" }` to the manifest head and regenerate `style.json`. Use only footage you have the rights to show; never reference media.

## The worked example: Editorial Proof

| What | Where |
|---|---|
| Manifest head, written by hand | `styles/editorial-proof/style.head.json` |
| Manifest generator | `styles/editorial-proof/build-manifest.mjs` |
| Generated manifest | `styles/editorial-proof/style.json` |
| Entry module: fonts in `setup`, composition in `compile` | `styles/editorial-proof/style.js` |
| Every measured number | `styles/editorial-proof/src/tokens.js` |
| Scenes to composition: layout runs, element instances, transitions, sound events | `styles/editorial-proof/src/compile.js` |
| Backgrounds drawn from a recipe | `styles/editorial-proof/src/canvas.js` |
| Presenter framing and the head rising above the panel | `styles/editorial-proof/src/presenter.js` |
| Word-by-word captions | `styles/editorial-proof/src/captions.js` |
| The shared card with its outline, glints and browser chrome | `styles/editorial-proof/src/card.js` |
| Highlight, outline box, strike, number tile, spotlight | `styles/editorial-proof/src/marks.js` |
| Element registry and layouts | `styles/editorial-proof/src/elements/index.js` |
| An element with `prepare`, `prefer`, `build` and five beats | `styles/editorial-proof/src/elements/source-card.js` |
| An element with rows, per-row word anchors and three beats | `styles/editorial-proof/src/elements/price-list.js` |
| An element that finds its own anchor word in the scene | `styles/editorial-proof/src/elements/comment-cta.js` |
| A fixture that walks through the layouts | `styles/editorial-proof/dev/fixtures/modes.json` |
| Fonts | `styles/editorial-proof/assets/fonts/` |
| The smallest possible style, used for engine tests | `tests/fixtures/styles/minimal/` |

The study itself is on the machine that ran it, under `corpus/_study/`, and is not part of the repository.
