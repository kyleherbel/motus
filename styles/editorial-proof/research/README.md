# The Editorial Proof study

Editorial Proof reproduces one editing style as closely as it could be measured. This folder is the record of that measurement: the rules, their numbers, how many instances each rests on, and where each was seen. `STYLE.md` (the planning guide) and `src/tokens.js` (the engine constants) both cite these files by rule id.

## What was measured

| | |
|---|---|
| Material | 33 public short-form reels by one creator, 9:16, 1080 x 1920, 30 fps, published 12 Oct - 9 Nov 2026 (snapshot 11 Nov 2026) |
| Length | 1,248 s in total (20.8 min); 23.6-72.6 s per reel, median 36.0 s |
| Families | **blue editorial** 29 reels (the main style); **lime product variant** 3 reels (one sponsor's products: the whole accent set swaps to lime, geometry unchanged); **gameplay variant** 1 reel (no hook title, full-frame b-roll instead of dark focus) |
| Left out | 6 older reels in an earlier treatment (logo-first hooks, all-caps serif captions) and 1 landscape video: kept as context, never measured as the style |
| Not available | the creator's project files, raw footage, fonts, music and sound files. Everything was recovered from the finished, compressed videos |

## How

- **Frame by frame at 30 fps, native resolution.** Positions are pixels on the 1080 x 1920 frame; durations are frames at 30 fps ("f"), so 30 f = 1 s. Timelines were tracked on every frame where the dimension needed it (title builds, captions, transitions, presenter scale) and sampled at 2-5 fps where it did not (layout classification, graphic catalogue).
- **VP9 decode calibration.** The files are VP9 at 1.1-2.1 Mbps. A default ffmpeg PNG extraction reads about 2 levels low on every channel (white 253); the colour study used an explicit BT.709 limited-to-full decode (white 255) and its hexes are the reference ([C01]). Other studies quote default decodes; where they differ by a couple of levels, colour wins.
- **Speech alignment** from ASR word timestamps (faster-whisper large-v3-turbo, not forced alignment, about +-2-3 frames). Sentence and clause boundaries come from ASR punctuation.
- **Presenter** measured with Apple Vision face landmarks and the microphone as a rigid scale reference.
- **Evidence ids.** Evidence is cited as `clipNN@frame`: `clip01`-`clip40` number the snapshot's reels by publication date, oldest first. The map from clip id to the source video lives only with the local study (`corpus/_study/clip-ids.json`, git-ignored) and is not published.
- **Sound** measured on the mix: EBU R128 loudness, energy gaps, a side-channel fingerprint for the music bed, and effect onsets in the 16-21 kHz band that the low-passed voice leaves empty.
- **Judgement steps** are stated where they exist: shots were labelled by hand in 20 reels (structure), every graphic segment was coded by hand from 2 fps thumbnails (graphics), emphasis word classes came from word lists (type).

## The nine records

| File | Ids | What it covers | Main sample |
|---|---|---|---|
| [structure.md](structure.md) | S01-S27 | layout sequence, shot and run lengths, where cuts land, list and single-subject templates, speech rate and pauses | 302 mode runs (33 reels); 328 hand-labelled shots (20 reels) |
| [layout.md](layout.md) | L01-L24 | the layout modes, slot geometry, caption positions, safe area | 2,423 samples at 2 fps; full-resolution geometry |
| [hook.md](hook.md) | H01-H28 | title build and copy, title exit, interstitials, counter, CTA | 32 titles, 28 interstitials, 33 endings |
| [graphics.md](graphics.md) | G01-G28, R1-R20 | the card, captures, marks, numbers, chips, designed fallbacks; the decision rules for what graphic each kind of sentence gets | 416 hand-coded segments, 3,023 card samples |
| [type.md](type.md) | T01-T27 | fonts, caption grouping, word entrance, emphasis, casing | 1,924 caption groups, 4,301 words |
| [motion.md](motion.md) | M01-M30 | easing curves, transitions, word entrances, in-card moves, what never moves | ~550 instances, 37,430 frames |
| [presenter.md](presenter.md) | P01-P30 | split and full-frame framing, matte, jump cuts, normalising other footage | every frame of 33 reels + 3 sample raw clips |
| [colour.md](colour.md) | C01-C30 | the two blues, neutrals, canvases, backdrops, keyword colours, lime variant | calibrated decode, 33 reels |
| [audio.md](audio.md) | A01-A28 | loudness, voice, pauses, music bed, sound effects and where they sit | 33 mixes, 1,082 effect events |

Each record lists every rule with its numbers, sample size, confidence and evidence (clip id @ frame), then what is constant and what varies, where it disagrees with another study, open questions, and what still needs an eye or an ear.

## Generations: the style targets the newest

The creator's template changed several times inside the month, so the 33 reels hold more than one version of the same style:

- geometry generations A (newest) to E, with different panel boxes, card columns and caption heights ([L12], [P20]);
- card width 940, then 848, then 894 px ([G02]);
- number tile white with flat blue digits, then dark with gradient digits ([G17]);
- strike as a 32-degree slash, then a 7-degree tapered marker ([G14], [G15]);
- slide-push card swaps in older reels only ([M16]);
- CTA keyword 10 frames after "comment" in the 8 oldest reels, 14 in the rest ([H22]);
- the blue presenter-panel ring and CTA dot in the newest 6 reels only ([C25], [H24]).

The build reproduces **generation A (31 Oct - 9 Nov)** and treats the older generations as the tolerated range: a value seen only in older reels is not used, a value that varies across generations is a per-video freedom only if it also varies inside generation A.

## Limits

- **One creator, one month.** Rules describe what this editor did in 33 reels, not a general theory of short-form editing. A rule seen 33 of 33 times is a habit, not a law, and a pattern seen in one reel (the gameplay variant, several one-off designed pieces) is not generalised.
- **No project files.** Fonts, curves, colours and sounds were recovered from compressed video. The italic serif is unidentified ([T03]); the build uses a stand-in. Shadow and glow strings are fits to measured falloff, not values read from a project.
- **Sound classes were inferred, not heard.** Nothing was listened to; effect names come from envelope and spectrum ([A10]-[A25]). The engine's effects are original sounds placed by these rules.
- **No raw footage of the reference.** That jump cuts hide under layout changes ([S13], [P18]) is inferred from timing; the cuts themselves cannot be seen in the finished videos.
- **Judgement steps.** Beat labels (hook, name, proof, how...) and graphic types are one analyst's reading of thumbnails plus transcript; their shares are approximate. Sentence boundaries come from unverified ASR punctuation.
- **Platform overlays** (Instagram's top bar, bottom caption area, right-hand buttons) were assumed from general guidance, not measured ([L21]).
- **Rights.** The reference media are not part of this repository and are never redistributed. This folder holds measurements and short descriptions only: no frames, no audio, no transcripts beyond a few words.
