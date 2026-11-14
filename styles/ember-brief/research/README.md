# The Ember Brief study

Ember Brief reproduces one short-briefing editing style as closely as it could be measured. This folder is the record of that measurement: the rules, their numbers, how many instances each rests on, and where each was seen. `STYLE.md` (the planning guide) and `src/tokens.js` (the engine constants) cite these files by rule id.

## What was measured

| | |
|---|---|
| Material | 40 public short-form reels by one creator, 9:16, 1080 x 1920, published 9 Dec 2025 to 7 Nov 2026 (snapshot 12 Nov 2026): the newest 40 that were not pinned, in order, outliers included |
| In style | 11 reels, 426.6 s in total (7.1 min); 28.5 to 61.8 s per reel, median 39.5 s; all 30 fps. Published 2 to 7 Nov 2026. A twelfth post is a byte-identical repost of one of them and is counted once |
| Left out | 9 reels from October with a cream field, 14 from September with serif headings and rounded presenter insets, one 7-minute tutorial and 4 product showcases from December 2025: other treatments, kept as context, never measured as the style |
| Not available | the creator's project files, raw footage, fonts, music and sound files. Everything was recovered from the finished, compressed videos |

## The target generation

Decided by the owner on 12 November 2026: the style targets the newest treatment, the dark dotted field of 2 to 7 November. The creator changed the look three times in ten weeks (September, October, November), and the three are not averaged. Eleven reels is under the fifteen the method suggests, so a habit of one video can pass for a rule: every rule gives its count, and a thing seen in one or two reels is marked low confidence and not generalised. Inside the six days nothing structural changed: the same layout, palette, type, motion and mix on every day ([L27], [S29], [C25], [A29], [P30]).

The October and September treatments are not built. A light-field variant would be its own decision and its own measurement.

## How

- **Every frame.** All 12,791 frames of the 11 reels, at 30 fps. Positions are pixels on the 1080 x 1920 frame; durations are frames at 30 fps, or seconds.
- **Calibrated decode.** The files are VP9 at 0.6 to 0.9 Mbps. Every colour comes from an explicit BT.709 limited-to-full conversion checked on a white card (it reads #FFFFFF; ffmpeg's default path reads #FDFDFD) ([C01]).
- **Speech alignment** from machine word timestamps (faster-whisper, not forced alignment: about 2 frames, and about 2 frames early after a pause).
- **Presenter** measured with Apple Vision face landmarks and person mattes on every frame, and background registration for scale.
- **Fonts** identified by rendering candidates at a fitted size, weight and letter-spacing and scoring their overlap with native-resolution crops ([T01]).
- **Sound** measured on the mix: EBU R128 loudness, energy gaps, band levels, and cross-correlation between reels to isolate the music bed. Nothing was listened to.
- **Evidence ids.** Evidence is cited as `clipNN@frame`: `clip01` to `clip40` number the snapshot's reels by publication date, oldest first; the in-style reels are `clip29` to `clip39`. The map from clip id to the source video lives only with the local study and is not published. These ids are this style's own: `clip31` here is not another style's `clip31`.
- **Independent verification.** After the nine studies, four checkers re-measured every quantity two studies disagreed on, plus the numbers the build depends on, with methods written from scratch. Their verdicts appear under each rule as "Verified" and in full in [verification.md](verification.md): 107 quantities, 86 confirmed, 9 settled for the other claim, 11 corrected, 1 open.
- **Judgement steps** are stated where they exist. Graphic types and clause categories were labelled by eye (graphics); beat labels came from reading the transcripts (structure).

## The twelve records

| File | Ids | What it covers |
|---|---|---|
| [structure.md](structure.md) | S01-S30 | the two layouts and their runs, scene length, rate of change, alignment with speech, pauses, beats, list videos, layout pseudo-code |
| [layout.md](layout.md) | L01-L28 | the seam, the caption line and its plate, the graphic column and slots, the title block, the call to action, headings, the layout change, safe area |
| [hook.md](hook.md) | H01-H30 | frame 0, the illustration slot, the title build, the exit, section headings, the call to action and its trigger, copy patterns |
| [graphics.md](graphics.md) | G01-G29 | the inventory of 236 graphic units, capture cards, highlight bars, redrawn app cards, toggles, prompt boxes, figures, chips, tiles, the clause-to-graphic map |
| [type.md](type.md) | T01-T29 | the typeface and its three weights, caption size, grouping and highlight, the plate, title sizes, the call to action, headings, figures |
| [motion.md](motion.md) | M01-M26 | the blur entrance and exit, replacement, the layout change, the title build, highlights, count-ups, staggers, what never moves |
| [presenter.md](presenter.md) | P01-P30 | the panel, the face size and eye line, the locked framing, the slide out and back, jump cuts, footage softness, fitting another speaker |
| [colour.md](colour.md) | C01-C26 | decode calibration, the accent and the cream, the field and its dot lattice and wave, the caption plate, highlights, cards, shadows, footage levels; C26: the release palette the build ships in place of the measured colours |
| [audio.md](audio.md) | A01-A29 | loudness, the voice, pauses, the one music bed and its sections, the absence of sound effects, the mix |
| [explain.md](explain.md) | X01-X32 | the second study: how a picture explains a sentence. Anchor and events, which device serves which idea, where events land against speech, what is generic and what is bespoke |
| [explain-motion.md](explain-motion.md) | D01-D28 | how the devices move: lines that draw, travellers, badges landing, fills tied to a count, timers, flips, swaps, the travelling view |
| [explain-look.md](explain-look.md) | R01-R32 | how the pictures look: the screened cut-out and its recipe, the 3D-shaded and flat pictures, lines, discs, tiles, glyph icons, chips |

Each record lists every rule with its numbers, sample size, confidence and evidence. It then gives what is constant and what varies, open questions, and what still needs an eye or an ear.

## The second study: pictures that explain

The first study inventoried 236 graphic units and filed 51 of them, 252 of the 427 seconds, as illustrations and diagrams. The first build then treated them as still pictures a user would supply. That was wrong, and the owner said so on 12 November 2026: these pictures act the sentence out. A second study watched all 51 at every frame, with three analysts (devices, motion, look).

What it found, in short:

- The 51 units make 45 scenes. A scene is an anchor that arrives first and then events (median 2, 0 to 10) that each land on the word that names them: median offset -0.4 frames, 76 % within 5 frames, n=80 ([X01], [X07]). Seven scenes are stills, and a still is only ever used for a noun or a state ([X02]).
- Eleven devices recur: a cut-out picture (19 units), a figure that counts across its number word (9), a badge that lands on an object (9), a pair comparison (7), one card per listed noun (6), an outline mark (5), a link between two things (5), a screen acted out (5), a process (5), a quantity that fills (4), a demo player (4) ([X03]).
- 26 of the 51 units can be drawn from labels and numbers alone, 15 more need one supplied cut-out, 10 are bespoke drawings ([X29]).
- The house picture is a two-tone cut-out: cream dots on the field colour, a hard edge, nothing round it, one accent part. There is no single dot screen in the reference; the build uses the median, round dots on a 5.5 px lattice ([R01]-[R09]).

It also corrects the first study in two places. Overshoot and rotation do occur, but only inside explanatory pictures and in a few bespoke places: 19 overshoot events in 4 reels, and a refresh mark that turns once per calendar flip ([D12], [D27]); [M25] holds for whole graphics. And a claim that some held cut-outs push in slowly ([X25]) was checked against [M20] on every frame of 17 held cut-outs: 14 do not move at all and the 3 that grow are moving clips, so [M20] stands.

The second study has not had an independent verification pass. Its motion record is thin by nature: most device motions occur once or twice in 11 reels, so 13 of its 28 rules are low confidence.

## Where the build departs from the reference

- **Typeface.** Outfit (SIL OFL 1.1) is the reference face: overlay score 0.97 to 0.99 in all seven text roles, against 0.71 to 0.86 for the runner-up ([T01]; verified). No substitution was needed.
- **Stepped graphics.** In the reference the graphics layer over the presenter shows a new state on only 6 of every 10 frames (18 per second), with the phase set per scene; the full layout, the captions, the layout change and some headings run on every frame ([M01], [S28]; verified). All four checkers read it as an artefact of how the videos were rendered or conformed, not a choice. The build renders every frame. A person who has watched the reference at speed should confirm.
- **Fitting another speaker.** The reference gives its own speaker's size in several measures (eye distance 123.4 px, face-contour width 280 px, Vision face box 316.5 px, eye line to chin 244 px) and [P26] sizes a new speaker by the eye distance. On a different face the measures disagree by up to 18 %, so the build takes the geometric mean of the three the engine has (eye distance, face box, eye to chin). This is a fitting choice, not a measured rule.
- **Title sizes.** The four title lines always fill a 359.4 px block; the ratio of the heavy lines to the light ones is set by hand per title in the reference, from 0.89 to 1.78 ([T19]; verified). The build fixes it at 4/3. With the measured ratio the rule reproduces 10 of 11 titles within 2 px; with 4/3 the median error is 1.9 px in cap height and the worst is 15 px.
- **Entrance by kind.** Cards, tiles, figures and chips arrive from different distances and scales. The four presets rest on 2 to 5 measured elements each ([M04]; verified with that caveat).
- **Highlight strength.** One value per reel between 0.32 and 0.55, with no trend. The build uses 0.40 ([C12]; verified).
- **Captions wider than the frame.** The reference never has a caption wider than 704 px. A pair wider than 760 px is shown one word at a time; that limit is a guess, since the reference never needed it.
- **Illustrations, marks and interfaces.** The style ships no art and never draws a third party's mascot, logo or interface. It builds the devices: `picture` with events, `big-figure` with a filling picture, `link`, `process`, `versus`, `item-cards`, `player`, and the first build's cards. A picture is the user's own file; a still cut-out is printed in the house look by `src/halftone.js`. The recipe matched the reference's screen statistics on generated objects ([R12]); nobody has compared a printed photograph with a reference cut-out by eye.
- **Devices built from one instance.** `process` rests on the one reference unit where input, tool and output all animate; the `versus` race on one race card; `item-cards` on one row and one swap; `player` on one player and one waveform demo. Their geometry was matched to those units; whether they generalise is untested.
- **A swap is a cross-fade.** The reference morphs one icon's outline into the next over about 9 frames ([D19]). A morph between arbitrary pictures is not generic, so `item-cards` cross-fades over the same 9 frames.
- **Waveform bars are a pattern.** The reference's audio demo lights real waveforms. The style never reads the audio: `player` draws bars from a fixed seeded pattern.
- **Sound.** The bed is an original track of the same role, synthesised by `dev/make-audio.mjs` from the measured tempo, sections, levels and stereo width ([A14]-[A20], [A27]). It is not a copy of the reference's music, and nobody has listened to it yet.
- **Not built** (each seen once or twice): a route drawn across a map or a terrain, a calendar tile flipping through months, the view travelling down a chain of cards, value chips pinned to a picture, alignment lines between two tracks and the timeline diagram, particles gathering into a shape ([X22], [D18], [D23], [D24]); the bespoke drawings themselves (a shredder, a pipe, a pixel scene); a nested panel inside a frame, sidebars and cursors in app cards, a person card, page-thumbnail pairs, the second heading position of one reel ([L19]), a slow scroll inside a capture ([M21]), the picture variants of the call to action above the text ([H25]).

## Open for a person

- Listen to the bed, alone and under a voice, on headphones and on a phone.
- Look at a printed cut-out of a real photograph beside a reference cut-out: is the house look right at speed, and does the screen shimmer as it arrives?
- Watch each explanatory element once in motion: the link's check, the race, the process.
- Watch a full render at speed: the blur entrance, the layout change, the keyword's swing in the call to action.
- Decide whether the 18-per-second stepping should be reproduced.
- Decide whether the title's size ratio should be a parameter.
- The start row and shape of the opening illustration's bottom fade could not be separated from the pictures (taken as linear, rows 500 to 580).
- Six single-word captions in the reference do not end a sentence; three sit beside a multi-word product name. They were read as breaks in the creator's own transcript, not as a rule.
- Tabular digits appear in one count-up. The build uses them for figures of 7 characters or more.

## Limits

- **One creator, six days.** The rules describe what one editor did in 11 reels. They are not a general theory of short video.
- **No project files.** Curves, colours and timings were recovered from compressed video at under 1 Mbps. Thin strokes carry about 1 px of uncertainty and flat fills 2 to 3 levels.
- **Rights.** The reference videos are not in this repository and their rights are unknown. They were studied on one machine. This folder holds numbers and descriptions only: no frames, no audio, no transcript passages, no platform ids.
