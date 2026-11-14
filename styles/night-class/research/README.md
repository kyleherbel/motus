# The Night Class study

Night Class reproduces one teaching-reel editing style as closely as it could be measured. This folder is the record of that measurement: the rules, their numbers, how many instances each rests on, and where each was seen. `STYLE.md` (the planning guide) and `src/tokens.js` (the engine constants) cite these files by rule id.

## What was measured

| | |
|---|---|
| Material | 40 public short-form reels by one creator, 9:16, 1080 x 1920, published 10 Oct - 11 Nov 2026 (snapshot 11 Nov 2026) |
| In style | 32 teaching reels, 2,880.6 s in total (48 min); 33-134 s per reel, median 88 s. Families: dark graphic field 24 reels, mixed dark and light 7, light 1 |
| Left out | 8 studio podcast collaborations (a different set, framing and caption treatment): kept as context, never measured as the style |
| Not available | the creator's project files, raw footage, fonts, music and sound files. Everything was recovered from the finished, compressed videos |

## How

- **Every frame at the clip's own rate.** The reels run at 23.976, 24, 25 or 30 fps. Durations were measured in frames at each clip's rate and are given in seconds (and in frames where the rate matters). Positions are pixels on the 1080 x 1920 frame.
- **Calibrated decode.** The files are VP9 at 0.6-0.95 Mbps. Every colour and brightness value comes from an explicit BT.709 limited-to-full conversion checked on a white patch (Y 234 reads #FEFEFE). The default ffmpeg path reads about 2 levels dark; a BT.601 matrix reads the accent red 17 levels darker ([C01]).
- **Speech alignment** from ASR word timestamps (faster-whisper, not forced alignment: about +-2 frames).
- **Presenter** measured with Apple Vision face landmarks and person mattes, and background registration (with the person masked) for scale and push-ins.
- **Fonts** identified by rendering candidates from installed fonts in headless Chrome at a fitted size and scoring their overlap with native-resolution crops ([T01], [T02]).
- **Sound** measured on the mix: EBU R128 loudness, energy gaps, low-band loop autocorrelation for the bed, and recurring effect samples found by waveform cross-correlation. Their onsets were then aligned with every-frame picture changes ([A06]-[A24]).
- **Evidence ids.** Evidence is cited as `clipNN@frame`: `clip01`-`clip40` number the snapshot's reels by publication date, oldest first. The map from clip id to the source video lives only with the local study (`corpus/_study/<source>/clip-ids.json`, git-ignored) and is not published. These ids are this style's own: `clip07` here is not Editorial Proof's `clip07`.
- **Independent verification.** After the nine studies, separate checkers re-measured every quantity that two studies disagreed on, plus the load-bearing numbers (caption size and baseline, panel, title geometry and timing, easing curves, presenter scale, mix levels), with methods written from scratch. Their verdicts appear under each rule as "Verified".
- **Judgement steps** are stated where they exist. Graphic units were labelled by eye from thumbnails (graphics), and beat labels came from keyword rules plus reading (structure). Some colours' roles (green, yellow) were read by eye.

## The nine records

| File | Ids | What it covers |
|---|---|---|
| [structure.md](structure.md) | S01-S28 | modes and their shares, cut-ins, switch rate, where cuts land, beats, pauses, ending, layout pseudo-code |
| [layout.md](layout.md) | L01-L28 | the four modes, panel geometry, caption baseline, title band, graphic slot, safe area |
| [hook.md](hook.md) | H01-H28 | frame 0, the title lockup and its build, section titles, the comment call to action, the ending |
| [graphics.md](graphics.md) | G01-G26 | density, the clause-to-graphic map, rows, chips, documents, captures, phones, charts, nodes, the closing pages, fields |
| [type.md](type.md) | T01-T28 | fonts, caption size, grouping and timing, the serif concept caption, title sizes, bar and underline |
| [motion.md](motion.md) | M01-M27 | cuts, caption swaps, title build, the house ease-out, the graphic push, scale-ins, what never moves |
| [presenter.md](presenter.md) | P01-P28 | the panel, the cut-out, panel and full-height framing, push-ins, jump cuts, footage requirements |
| [colour.md](colour.md) | C01-C28 | decode calibration, dark and light plates, the reds, inks, neutral fills, glows, footage; the release palette (C28) |
| [audio.md](audio.md) | A01-A27 | loudness, voice, pauses, the bed loop, the three effect kits, triggers, codec limits |

Each record lists every rule with its numbers, sample size, confidence and evidence. It then gives what is constant and what varies, open questions, and what still needs an eye or an ear.

## Generations: the style targets the newest

The reels changed inside the month. The build follows the newest stretch (24 Oct - 11 Nov, 17 reels) where the studies saw a change:

- the light field appears from 21-23 Oct, in 10 of 20 reels from then on ([L27], [C10]);
- lists grow to 42 % of graphic time and logo, node and metaphor diagrams shrink ([G25]);
- the call to action becomes a lead-magnet doc ("To Get The Doc") after a waitlist launch window ([H24]);
- fewer jump cuts and fewer hard graphic swaps; the closing call to action is more often said full height ([S25]).

Some things did not change over the month:

- Panel geometry. Three recurring templates are used throughout ([L26], [P07]); the build uses the commonest.
- The mix ([A25]).
- The pacing ([S25]).

## Limits

- **One creator, one month.** Rules describe what this editor did in 32 reels, not a general theory. A pattern seen in one or two reels is marked low confidence and is not generalised. Not built: field-only mode, full-frame b-roll, section brackets. Some elements were built from frames of the newest reels read by eye rather than from a measured study (table, before/after, quote card, stat card, spotlight); their numbers are marked as by eye in the element files.
- **No project files.** Fonts, curves, colours and sounds were recovered from compressed video. The sans is a measured stand-in (Inter 800 at optical size 14 for an Apple face that cannot be shipped). Glows and gradients are fits to measured falloff.
- **Sound classes were inferred, not heard.** Nothing was listened to; effect names come from envelope and spectrum. The engine's effects and bed are original sounds placed by these rules (`assets/sfx/LICENSE.md`, `assets/music/LICENSE.md`).
- **One camera, two crops.** The panel and the full-height shot are cut from one wide frame ([P14], [P26]); a 9:16-only source cannot reproduce the panel's framing.
- **Platform overlays** were not measured.
- **Rights.** The reference media are not part of this repository and are never redistributed. This folder holds measurements and short descriptions only: no frames, no audio, no transcripts beyond a few words.
