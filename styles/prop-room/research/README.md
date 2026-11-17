# The Prop Room study

Prop Room reproduces one talking-head explainer editing style: an illustrated panel above the speaker, full-screen illustrated cutaways, short captions on a grey plate and a quoted serif keyword at the end. This folder is the record of the measurement behind it: every rule, its numbers, how many instances it rests on, its confidence and where it was seen. The planning guide and the tokens file of the style cite these notes by rule id.

## What was measured

| | |
|---|---|
| Material | 19 public short-form reels by one creator, 9:16, 1080 x 1920 at 29.97 fps (2997/100), VP9 video, HE-AAC audio. Published 29 Oct to 12 Nov 2026. |
| Selection | The newest collected reels that were not pinned, a continuous run, each with a visible speaker who anchors the narrative. Selected by recency, not by popularity. 29 Oct is the lower edge of the selected run, not a measured start of the style, and the collection is not certified to hold every reel of the account. |
| In style | 19 reels, 697.1 s in total (11.6 min; 20,881 video frames, 696.7 s); 28.8 to 47.2 s per reel, median 35.7 s. |
| Left out | 43 older reels collected with them (41 earlier talking-head reels from October and September, 2 other exclusions). They share parts of this grammar; they are context only and were never measured as the style. |
| Not available | The creator's project files, raw footage, fonts, music and sound files. Everything was recovered from the finished, compressed videos (VP9 at about 1.2 to 2.4 Mbps). |

## The target generation

Decided by the owner on 16 November 2026: the style targets the newest presenter-graphics treatment, 29 October to 12 November 2026, because the owner asked for the creator's newest style. Older reels share parts of this grammar, but their measurements are not averaged in. Inside the window the template holds: the same four layout modes and mix ([L23]), the same caption type and plate ([T27]), the same structure ([S23]) and, by the motion study's split of early against late reels, the same motion. Five things change by date and are recorded as such: the seam moved by 2.9 px after 31 October ([L06]); pale plates turned from warm cream to cool white on 5 November ([C28]); the lead-in question before the call to action is absent in the earliest 3 and latest 2 reels ([H26]); sound effects thinned from about 5.5 to 1.8 per 10 s ([A25]); and the presenter's room and crops changed with five camera set-ups ([P24], [C27]).

What the style is for: solo talking-head tool, skill and workflow explainers of 30 to 45 s. Not for interviews, long tutorials or montages.

## How

- Nine analysts, one per dimension (layout, type, hook, graphics, motion, structure, colour, audio, presenter), ran in parallel on all 19 reels. Most passes read every frame; positions are pixels on the 1080 x 1920 frame and durations are frames at 29.97 fps or seconds.
- Calibrated decode. Every colour comes from an explicit BT.709 limited-to-full conversion. The white caption fill reads Y 235 -> #FFFFFF; ffmpeg's default extraction reads 253 (#FDFDFD); black Y 16 -> #000000. The verifier proved the decode on 339 white and 37 black patches. Only 3 reels carry BT.709 tags; skin hue across a shared room confirms BT.709 for the untagged ones ([C01], [C02]).
- Speech alignment from machine word timestamps (faster-whisper, not forced alignment: about +-2 frames). Nothing was listened to and no playback was watched; everything audible is inferred from spectra and levels.
- Presenter measured with Apple Vision face landmarks and person mattes on every frame, and registration on the static room. Fonts identified by rendering candidates in a headless browser and overlaying them on native crops ([T01], [T20]).
- Explanation pass. After the nine studies, two analysts watched every graphic unit on every-frame sheets to see how it acts its sentence out: 145 picture and figure units (X01-X29) and 134 interface and text-card units (X51-X78), 1,321 coded events. See [explain.md](explain.md).
- Independent verification. A verifier re-measured, with methods written from scratch, every quantity two studies disagreed on and every number the build hard-codes: 29 items, 8 confirmed, 7 settled for one claim, 6 settled for neither with a new value, 8 left open. Verdicts appear under each rule as "Verified" lines, and in full in [verification.md](verification.md). Where the verifier settled a number, the rule states the verified value and the Verified line keeps the analyst's.
- Evidence ids. Evidence is cited as `clipNN@frame`: clip01 to clip19 number the 19 reels by publication date, oldest first, and frames are counted from 0 at 29.97 fps. The map from clip id to source video stays with the local study and is not published. These ids are this style's own: clip07 here is not another style's clip07. File names in Evidence lines name files of the local study; they are not shipped.
- Judgement steps are stated where they exist: graphic families, clause categories, beats, idea kinds, devices and build classes are one reader's coding, recorded per unit so they can be re-coded.

## The records

| File | Ids | What it covers |
|---|---|---|
| [layout.md](layout.md) | L01-L26 | the four layout modes and their runs, the seam, the caption slots and plate, the keyword slot, graphic placement, one-off variants |
| [type.md](type.md) | T01-T27 | the caption face, size, spacing, baselines, grouping and breaks, the plate and glyph shadow, the closing keyword, text inside pictures |
| [hook.md](hook.md) | H01-H26 | frame 0, the first caption and the first cut, hook copy, the name reveal, the close-up ending, the keyword cut-in, the call-to-action script |
| [graphics.md](graphics.md) | G01-G27 | the inventory of 279 graphic units, families, cadence, the clause-to-graphic map, cards, window dots, figures, metaphor props, the mascot |
| [motion.md](motion.md) | M01-M29 | hard cuts, caption swaps, pictures arriving on a cut, prop entrances, the one entrance ease, staggers, the hold push-in, what never moves |
| [structure.md](structure.md) | S01-S25 | the layout runs and their order, run lengths, cut placement on caption groups, pauses, beats, the closing run, a layout procedure |
| [colour.md](colour.md) | C01-C29 | decode calibration, the plate families (pale, dark, saturated, busy), the caption plate and shadows, accents, the prop look, presenter colour |
| [audio.md](audio.md) | A01-A27 | loudness, the voice band, pauses, the music beds, the four effect families, the mix, edit clicks |
| [presenter.md](presenter.md) | P01-P27 | the split and full-height crops, face size and eye line, the closing shot, cuts hidden under inserts, 25p footage, fitting a new speaker |
| [explain.md](explain.md) | X01-X29, X51-X78 | how a picture or an interface explains a sentence: devices, the idea-to-device map, anatomy and sync, build classes, the prop look |
| [verification.md](verification.md) | items 1-29 | every verification item: the quantity, the competing claims, the verified value, method, clips and verdict |

Each dimension note gives what was measured and what was not, then every rule with its values, evidence, confidence and verification, then what is constant and what varies, open questions, and what still needs an eye or an ear.

## Rule counts by confidence

Confidence as the analysts wrote it, classed by its first word (a rule marked "high for X; medium for Y" counts as high).

| File | Rules | High | Medium | Low |
|---|---|---|---|---|
| layout.md | 26 | 20 | 4 | 2 |
| type.md | 27 | 18 | 7 | 2 |
| hook.md | 26 | 18 | 8 | 0 |
| graphics.md | 27 | 11 | 14 | 2 |
| motion.md | 29 | 8 | 12 | 9 |
| structure.md | 25 | 15 | 10 | 0 |
| colour.md | 29 | 15 | 10 | 4 |
| audio.md | 27 | 13 | 12 | 2 |
| presenter.md | 27 | 21 | 6 | 0 |
| explain.md | 57 | 9 | 39 | 9 |
| All | 300 | 148 | 122 | 30 |

The verifier's corrections did not change the confidence labels; a rule's Verified line says how far the verification reaches.

## The owner's decisions

Before the study (16 Nov 2026):

- Target: the newest presenter-graphics treatment, 29 Oct to 12 Nov 2026, 19 reels, 697.1 s, all 1080 x 1920 at 29.97 fps (VP9). The 43 older reels are context only.
- Style id and name: `prop-room`, "Prop Room". The creator's name is never used in the style's name or in distributable files.
- Purpose: solo talking-head tool, skill and workflow explainers of 30 to 45 s, with an illustrated panel above the speaker and full-screen illustrated cutaways.
- Rights: unknown. A local, private reference study only. Media and derived evidence stay in the git-ignored corpus; nothing is redistributed.
- Study mode: nine parallel analysts, one per dimension, then the explanation pass on the illustrations, then an independent verification pass; then build the pack, stopping for fonts, sounds and the first render. No look, measurement or decision is imported from the other Motus styles.

After the study (16 Nov 2026):

- Props are drawn in code. The style does its own thing: every picture-plus-events unit (about half of graphic runtime) is rebuilt as a detailed code-drawn prop, vector parts with ids, lit and shadowed by the measured prop look, whose parts the beats animate. The pack ships a library of generic props, and the planning agent writes new props as code for each video to a drawing standard in the planning guide. No image generation and no user-supplied prop pictures.
- Photoreal pictures and AI video clips (about 10 % of units) are left out: code cannot reach them, and the style stays self-contained.
- Keyword serif: PT Serif Bold (OFL), the verifier's closest open-licensed match. The reference face is unidentified; Georgia Bold scores slightly higher but is not redistributable ([T20]).
- No house accent: the reference's orange is a third-party mascot's colour. Colour follows the subject per scene, as in the reference ([C18]).

## Where the build departs from the reference

- Props drawn in code instead of rendered pictures. In the reference about half of the picture and figure units are one rendered or generated picture with events on it (class B: 73 of 145 units, 52 % of their time, [X01]); a further 9 are bespoke character animation (class C). The build draws such props as vector parts and applies the measured prop look: top light, a shadow below only, hard edges, warm shadow tint, same-hue glow ([C19]-[C25], [X24], [X25]). That look rests on 10 to 13 measured props, and the floating-prop shadow was not re-measured. Nobody has compared a code-drawn prop with a reference prop by eye.
- Photoreal pictures and AI clips left out. In the reference, photos and footage are 25 of 279 units, 19 of them in the two reels about AI video tools ([G09], [G23], [X27]); framed user photos and full-bleed footage are not built.
- PT Serif Bold substituted for an unidentified serif. No installed serif fits well: soft IoU 0.611 for Georgia Bold, 0.604 for PT Serif Bold, 0.597 for Playfair Display Bold ([T20]; verification item 5). Position, size rule, quotes (curly opening, straight closing) and shadow are the measured ones ([T19]-[T23]).
- Inter for the captions: variable weight 730, optical size 26, 76 px, -1 px letter-spacing, the best of 60 renders ([T01]-[T03]; verification item 3). It sits 0.10 below the same-text ceiling, so the editing app's own caption face could fit better; that face was not available.
- No third-party marks or mascot. Product marks, wordmarks, app interfaces and the orange pixel mascot appear throughout the reference ([G14], [G22], [X73]). The build redraws interfaces as neutral categories (a chat app, a code editor, a browser window), shows no real marks, and has no mascot. The house accent the colour study proposed was that mascot's colour and is dropped ([C18]).
- Smaller departures, each from a measured rule: graphics render on every frame, so the repeated frames of inserted material ([M27], [X28]) and the 25p presenter cadence ([P21]) are not copied; the seam is drawn at 960, not 959.6 ([L05]), with no hairline ([L08]); audio joins get a short crossfade, because the reference leaves clicks at 14 % of joins ([A26]).

## Open for the owner

From the verifier's list, de-duplicated. Three items were settled by the owner's decisions of 16 Nov 2026: the keyword serif (PT Serif Bold), the orange accent (dropped, no house accent) and the mascot (none).

- Caption face: Inter 730 at 76 px is the best installed match; the editing app's own face, not installed, could fit better ([T01]).
- Gamma-space rendering: if the renderer cannot blend in linear light, the fallback rgba(70,69,70,0.70) is off by up to about 5 levels; check a test render ([C14], [T16]).
- Keyword size per word: cap height falls with letter count only loosely (r -0.69). Choose clamp(158 - 6.1 x letters, 109, 140) or the width rule 373 + 73.5 x letters ([T21]).
- Floating-prop shadow (0 68px 102px -36px at 0.53, warm tint) was not re-measured; look at it against the measured profiles ([C19]).
- Card shadow: confirm by eye that the tight negative-spread shadow (0 31px 41px -27px at 0.43) reads right ([G16]).
- Pastel tints on pale plates: static or a slow drift? Flow says 2 px/s or less ([C07]).
- Music bed level: 13 to 25 LU under the master by method, best estimate 16; listen against a full reel. The owner's standing note asks for beat-driven beds, not drone or pad beds ([A14], [A16]).
- Sound effects: every class name (swell, boom, ping, hit) is inferred from spectra; listen to the snippets and the edit clicks ([A17]-[A20], [A26]).
- Voice on frame 0 and the cut on the last word: listen to the first and last second of a few reels ([H02], [H24]).
- Keyword timing by ear: two reels land the keyword before the spoken word by the transcript ([H19], [T22]).
- Hidden jump cuts: 12 direct reframes with mixed evidence and 4 cadence-only breaks inside runs need playback with audio ([P19], [P20]).
- The jump cut inside the closing shot of one reel (clip08@971): deliberate or a slip ([S18], [P20])?
- One-off layouts: a frosted full plate over blurred presenter footage, viewfinder corner marks, a caption on the split row over a full-bleed photo ([L26]).
- Pop-ins 1-3 frames after a cut (about 6-15 % of cuts): a snap or a glitch ([S07], [M09])?
- Fade against blur on cut entrances, and rotation or 3D tilt of entering props, were not measured by anyone ([M08], [M28]).
- A whip-in with motion blur and a push into a card: deliberate one-offs ([M18], [M28])?
- Act-out timing: which word triggers which prop is in the explanation pass; the 4-frame stagger and the prop class shares were not re-measured ([M10], [M17]).
- Saturated-field triggers (brand colour, literal colour or scene) are interpretation; check against the videos ([C11]).
- Frosted-glass cards (clip07@125-150): a look or a transition state (colour note, open questions)?
- Camera source resolution (1080p or 4K) behind the 1.92x full-height enlargement: judge the softness ([P22]).
- Clause and beat labels are one reader's coding; a second coder would give agreement ([G11], [G12], [S21], [S22]).
- The lead-in question before the call to action (14 of 19, absent in the earliest 3 and latest 2): a dated change or per script ([H26])?
- Product-name reveals (21 units): watch them in motion to confirm they land on the name word ([G14], [X17]).
- Is -14.1 LUFS the creator's master or the platform's normalisation? The delivered loudness is -14.1 either way ([A01]).

## Limits

- One creator, 15 days, 19 reels. The rules describe what one editor did; they are not a general theory of short video. Most explanation devices occur once or a few times, so many of their rules are low or medium confidence.
- No project files. Curves, colours and timings were recovered from compressed video at about 1.2 to 2.4 Mbps; flat patches carry about 2 levels of codec noise ([G16]) and plate fits near props 1-2 levels ([C22]).
- Nothing was heard. Every sound rule comes from spectra and levels and needs a listen.
- Rights. The reference videos are not in this repository and their rights are unknown. They were studied on one machine. This folder holds numbers and descriptions only: no frames, no audio, no transcript passages, no platform ids.
