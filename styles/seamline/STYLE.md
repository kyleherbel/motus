# Seamline: the planning guide

Read this before you plan an edit in this style. `style.json` lists the only layouts, slots, elements, parameters and beats a plan may use. Rule ids in brackets point at `research/` (L layout, T type, H hook, G graphics, M motion, S structure, C colour, A audio, P presenter, X explanation). The study measured 30 finished videos from one source (2,198 s, every frame for motion and cuts); the numbers below are its medians unless a range is given.

## 1. What the style is

Tech news told over the real thing. The top half of the frame shows real footage of what the speaker is talking about: the maker's launch film, its demo, a screen recording of the product doing the job, the output it made, the person named. The bottom half is the speaker at their desk. Between them is a hard seam, and on the seam ride one or two caption words in white pixel capitals. Every change is a hard cut; the footage changes about every 1.4 s and the whole frame changes layout about every 4 s, on the first word of a sentence [S01, S04, S07, S14, M01].

Nothing is drawn by the editor except the opening headline, the caption, the big word over the face and the brand's own logo: 84 % of footage time shows the product the speaker names, and editor-built cards are under 2 % of runtime [G01, G03]. **The footage is the edit.** A plan without enough real footage cannot be this style.

It suits: launch and release news ("X just shipped Y"), a new tool or model with its maker's demo, "this changes Z" takes with real footage, 45 to 90 s. It does not suit: a talk with nothing to show, a tutorial that needs the screen readable for a long time, interviews.

## 2. Numbers to hit

| What | Target | Rule |
|---|---|---|
| Length | about 72 s (52 to 88 s) | S25 |
| Voice | from the first frame; the picture ends about 0.25 s after the last word | S11, H21 |
| Pauses | none over 7 frames (0.29 s) while the speaker is visible | S17 |
| Cuts | 32 a minute (23 to 46), front-loaded: about 45 a minute in the first 5 s | S01, S10, S20 |
| Footage changes | 28 a minute; a footage shot holds 33 frames (1.4 s) median, 14 to 59 frames | S07 |
| Layout changes | 16 a minute; on 55 % of sentence starts, within 2 frames of the first word | S04, S13, S14 |
| `split` | about 60 % of runtime, runs of about 4 s (2 to 9 s) | S03, S04, L01 |
| `face` | about 17 %, inserts of 1.3 s (0.7 to 3.8 s), about 5 a minute, always back to `split` | S05, S06, G18 |
| `full` | about 15 %, runs of 2.5 s (1 to 7 s) | S03, L01 |
| `stack` | at most 5 %, only to set two things side by side | S03, G16 |
| Speaker visible | about 77 % of runtime, never under half | S24 |
| Sources | about 5 per video; the main one covers about half the footage time | G02 |

## 3. Footage: get it before you plan

Follow `skills/edit/SKILL.md` step 6 ("Real footage of real things") for every product, company and person the speaker names, and get more than you think: a 70 s video needs about 30 footage shots, cut from about 5 sources [G02, S07]. In order of use in the reference [G03]:

1. **The maker's launch film or trailer** (57 % of footage time is the maker's own material): cut it into 1 to 6 s pieces.
2. **The maker's demo** of the feature named, or the product's UI doing the task.
3. **The speaker's own screen recording** of the product doing what they describe (instructions and examples need it: 38 % of instruction clauses) [G11]. Ask the user for it if they have it.
4. **The output** the product made (generated video, a site it built, an answer it gave).
5. **The person named**: a clip or photo of them [G13].
6. **The page or post** for a news claim, captured full width (`motus capture`).
7. **The brand's mark** (`motus logo <brand> --mono --colour "#FFFFFF"`), for the seam and for a logo shot.

Cut clips with `ffmpeg` into `assets/launch/` as H.264, 30 fps, no audio, at the source's full width (1920 or more); the style crops them. Leave the maker's own lower thirds and labels in; crop out other creators' watermarks. Never label a clip with its source. Never use another creator's review as footage.

If after searching there are fewer than about 4 sources, say so to the user before planning, and plan more `face` and fewer, longer `split` shots rather than repeating one clip.

## 4. Cutting a raw take (raw mode)

Keep the last good take of each sentence; cut false starts, repeats and fillers. Cut every pause to 7 frames (0.29 s) or less: start each kept range 0.12 s before the next word and end it 0.12 s after the last [S17]. The first kept range starts 1 frame before the first word: the voice runs from frame 0 [S11, H02]. End 0.25 s after the last word [H21]. Jump cuts that remain in the speaker's half are fine (about 2 a minute); put a footage cut on the same word where you can [S16].

## 5. The grammar

### 5.1 Four layouts

| Layout | Use it for | Slots |
|---|---|---|
| `split` | the default: footage on top (y 0 to 960), the speaker below, the caption on the seam | `top` footage, `title` headline, `seam` brand mark |
| `face` | the speaker full frame, pushing in slowly: opinions, asides, one- or two-word sentences, reactions, the sign-off; the big word | `word` big word, `seam` brand mark |
| `full` | footage full frame: a demo, a result, an example, a vertical source (a phone recording, a generated portrait clip) | `picture` footage, `title` headline, `seam` brand mark |
| `stack` | two pieces of footage, one over the other: two models given the same prompt, before and after, two products compared | `top`, `bottom` footage, `seam` brand mark |

### 5.2 Segmenting the transcript into scenes

1. One scene per sentence. Split a sentence of more than about 25 words at a clause start ("because", "which", "so", "and then") when the layout should change there.
2. Give each scene a role: `hook` (the opening, about 5 s), `name` (the sentence that names the product), `what`, `show`, `how`, `list`, `why`, `cta` (the closing ask and sign-off) [S19].
3. Choose the layout (first matching row) [S06, S21, G09-G16]:

| The sentence | Layout |
|---|---|
| one or two words ("Crazy.", "That's right."), a reaction or an aside | `face` (66 % in the reference) |
| an opinion, a "why it matters", a transition, the sign-off | `face` about a third of the time, else `split` |
| a demo, an example, a result, a vertical source | `full` (43 % of example clauses) |
| two things compared side by side | `stack` |
| everything else | `split` |

4. Then check the run lengths: `face` 0.7 to 3.8 s and back to `split`; never two `face` scenes in a row with different words; `split` runs 2 to 9 s. Merge or split scenes until the rhythm fits [S04, S05].

### 5.3 The order of beats

Hook (about 5 s, 2 to 9) → name the product in the first sentence or the next (14 of 30 name it in the first sentence) → what it is → show / how / list (the longest part, 26 % show) → why it matters (21 %) → the ask and sign-off (about 5 s) [S19, S20].

### 5.4 Inside a scene: footage cuts

Inside a `split`, `full` or `stack` scene, the footage changes with `cut` beats. The rule that makes this style read as edited, not slideshowed [X01, X04, X05, S15]:

- **Cut on the first word of the clause the new footage illustrates** (64 % of cuts, against 17 % by chance). Do not hunt for the noun.
- **Then pick the clip's in-point (`start`) so its visible event lands on the key word**: the output appearing, the button press, the rocket landing, the logo writing on. `start = event time in the clip − (key word onset − cut time) − about 1 frame`. Half the reference units do this [X04].
- **When the speaker points ("this", "look at", "you're seeing")**, the thing must already be on screen when the word comes: cut to it at the clause start [X06].
- Two footage shots per `split` scene is the norm, up to seven in a fast list [S08]. A burst of 3 or more shots under half a second each, top half only, is how lists of examples and the opening go [S09].

### 5.5 Which footage for which sentence [G07-G16, X07-X14]

| The clause is | Cut to | Land on the word |
|---|---|---|
| a product, model or tool named | footage where its name, UI or logo is legible from the first frame; or `brand-mark` on the seam | the name |
| a feature, how it works | the maker's demo of that feature working (37 %), or the speaker's own capture (20 %) | the visible change, 0 to 8 frames before the verb |
| an example, a result, "here's what it made" | the output itself, often `full` | from the cut if the clause points; else on the word |
| a step, an instruction | the speaker's own screen recording of that step, zoomed to the region (`zoom`, `fx`, `fy`) | typed text or the cursor on the item, 0 to 4 frames after |
| a number, an amount | footage that shows the amount (a countdown, a chart from the maker) | the number |
| a list of things | a new clip per item, re-cut on each item | each item |
| a comparison | `stack`, or the maker's chart | the second item |
| news, a launch | the maker's launch film or live stream with the name legible | the company name |
| a person named | a clip or photo of that person (55 %) | from the clause start |
| an opinion, context | keep the product footage running, or `face` (30 %) | no sync needed |
| a transition, the ask | `face` (33 to 35 %) or product footage | none |

Metaphor footage is rare (under 2 %): show the literal thing [X03].

## 6. The opening

- Frame 0 is `split` (26 of 30) with the product's own material on top and the voice already running [H01, S11].
- **`headline`** (in the `title` slot of the first scene; keep its `key` the same across the first scenes while the layout stays `split`, so it holds through the top-half cuts and leaves at the first layout change) [H06-H13]:
  - 1 to 3 main `lines` of 1 to 3 words, about 4 words in all, upper case, each fitted to the same width (814 px), the block's bottom 79 px above the seam [H09, T14, verification].
  - Optional `lead` (a smaller line above: "THE FUTURE"), `connector` (a small italic serif word after it: "of"), `kicker` (an italic condensed line on top: "GOOGLE'S") [T16, T17].
  - It frames the stakes or the category; it is not a line of the transcript. Patterns: "THE FUTURE of X" (6 of 25), a drama noun ("HONEYPOT", "RECKONING"), a superlative ("CRAZIEST TECH DEMO"), a news headline ("GOOGLE LAUNCHES NEW FRONTIER MODEL"). Only about a third of its words are spoken while it is up [H14].
  - It is white with no shadow: **put dark or mid-tone footage under its lower half.** Over white UI footage it disappears.
  - `exit`: `slide` (the lines leave the way they came, over the last 15 frames) or `cut` (gone with the layout change); about half each [H12].
- **The first layout change comes 2.4 to 4.5 s in** (the headline leaves with it; the style removes a headline still up at 4.5 s). The first `split` run has 2 or 3 top cuts [S11, H05, H13].
- When the opening names the brand, put a `brand-mark` on the seam on that word (8 of 30) [H19].

## 7. Elements

### `footage` (slots `top`, `picture`, `bottom`)

| Param | Meaning |
|---|---|
| `src` | a clip (mp4, mov, webm) or a still (png, jpg, svg) under `assets/` |
| `start` | seconds into a clip where it starts; set it so the clip's event lands on the key word (5.4) |
| `fx`, `fy` | 0 to 1: the point that stays in view when the cover crop cuts the picture (default 0.5, 0.5). A 16:9 clip in the 1080 x 960 top half loses about a third of its width: aim at the part that matters |
| `zoom` | 1 to 4 extra magnification, to crop to a UI region. With `fit: "contain"`, 0.25 to 1 leaves margin round a logo |
| `fit` | `cover` (default, 77 % of the reference) or `contain` (the whole picture on black: a logo, a card, a portrait still) [L07, L08] |
| `push` | `none` (default), `ease` or `drift`: see below |
| beat `cut` | `{ "at": word, "do": "cut", "src": ..., "start"?, "fx"?, "fy"?, "zoom"?, "fit"? }`: a hard cut to the next shot in the same slot |

Clips play at their own speed with nothing added; their sound is never used [M19, A21]. Most stills hold dead still (69 % in `full`, 60 % in the top half); give about one still in three `push`: `ease` (1.00 to 1.066 across the shot, the face's own curve) or `drift` (1.5 % a second) [G21, X24, verification].

A logo as a shot: `{ "src": "assets/logos/x-mark.svg", "fit": "contain", "zoom": 0.45 }`. An SVG from `motus logo --mono` has no size: add `width="512" height="512"` to its `<svg>` tag.

### `headline` (slot `title`, first scenes only)

`lines` (1 to 3, 18 characters each), `lead`, `connector`, `kicker`, `exit` (`slide` | `cut`). See section 6.

### `big-word` (slot `word`, `face` only)

`lines` (1 or 2, 14 characters each), `look` (`heavy` default, `serif`, `lime`, `yellow`), beat `show` on the word it shows. The style never styles a word inside the caption: to stress a word it cuts to the face and shows the word itself over the chest (centre y 1118, about 500 px wide) for 18 frames from that word; the caption is off meanwhile [T20, T21, verification]. Use it on the one word that carries a sentence ("FLAWLESS.", "THAT'S RIGHT", an amount: "$50"), on a reaction, or on the ask (`["COMMENT", "\"ADS\""]`). Videos that use it use it in bursts (1 to 9 a minute) and most videos never do: pick it for the whole video or not at all. `serif` reads as wry or quiet; `lime` and `yellow` as loud.

### `brand-mark` (slot `seam`)

`src` (the brand's mark, white, transparent background), `size` (`small` default, `large`), beat `show` on the word that names the brand. The logo takes the caption's place on the seam for 8 frames from a frame before the word (3 to 13 in the reference) [H19, H20, verification]. Mostly in the first 5 s; at most a few per video.

## 8. Captions

The engine groups and times them; you only fix words.

- One line of pixel capitals on the seam (over the full-frame face it drops to the chest, y 1440, so it never sits on the mouth), about 2 words and 10 characters (never over 16), cut in complete on the first word and replaced by the next group; no word-by-word reveal [T02, T08-T10, M04].
- Fix every ASR error in `captions.fixes`, including names ("JGBT" → "ChatGPT"). Write numbers as digits ("$50", "10x") [T11]. Punctuation stays.
- `captions.breaks` to start a group on a word; `captions.hide` for words a `big-word` or a logo already shows (the style also hides the caption under them by itself).
- No emphasis kinds: the big word is the emphasis.

## 9. Framing

The speaker's half is framed from the whole camera frame (the style asks conform for the wide view): start the project from the **horizontal recording**, ideally 3840 x 2160 [P22-P25]. The split frames the face about 330 px wide with the eyes a third of the way down the panel (tighter than the reference's 172 px, by the owner's choice), enlarging the wide view up to 1.5x; the full-frame face is the 9:16 crop, face about 343 px or larger. With a 9:16 source there is no wide view: the split then shows a tighter crop (Studio warns).

## 10. Look

- `caption`: `shadow` (a hard 3 px drop shadow; 20 of 30 videos) or `plate` (a black plate at 0.7 behind each caption; 10 of 30). **Choose `plate` when much of the footage is white or light UI**, where a white caption with only a shadow is hard to read [T05-T07].
- No colour grade: the speaker and the footage are shown as recorded. The reference grades its speaker low key and warm; this pack does not (owner, 2026-11-18).
- `opening`: `swell` (a low noise swell under the first second; about a third of the reference videos) or `none` [A22].

## 11. Sound

The voice, mono, heavily levelled; a dark music bed 12 dB under it from the first frame to the end, never ducked, fading out over the last 1.1 s [A11-A16]. `audio.bed`: `a` (dark, with a soft 105 BPM pulse) or `b` (a dark pad, no beat); vary it between videos (the reference uses a new track nearly every time) [A18]. Almost no effects: the reference has 17 low whooshes on 1,207 cuts and nothing else, and the pack ships none; the one sound is the optional opening swell (look `opening`) [A22-A27]. Footage sound is never used.

## 12. Options

Give 2 to 4 options per scene that are different ideas:
- a different source or moment of footage (the maker's film vs. the speaker's capture vs. the output),
- a different layout (`split` vs `face` vs `full`),
- the plain version (`face`, captions only) where the sentence carries itself.

`single` is honest for: a one-word reaction that can only be `face`, and the sign-off.

## 13. Self-review checklist

Render stills (`motus stills --posters`) and check each line; fix and re-check before showing the user.

1. The voice starts on frame 0 or 1, and no pause over 7 frames survives with the speaker on screen.
2. 23 to 46 cuts a minute (count scene starts plus `cut` beats); more than 40 in the first 5 s; the first layout change 2.4 to 4.5 s in.
3. `split` 50 to 70 % of runtime; `face` 10 to 25 %, every `face` run 0.7 to 3.8 s; `full` at most 30 %.
4. Every layout change sits on the first word of a sentence or clause.
5. No footage shot holds over 270 frames (11 s); no clip is used for more than about half the footage time.
6. Every clause that names a product, a person or a company has footage or a mark of it within a second.
7. Every pointing clause ("this", "look") has its thing on screen from the cut.
8. The headline is 1 to 3 main lines, 6 words at most, over footage dark enough that it reads in the stills; it is gone by the first layout change.
9. No caption over 16 characters; every name spelled right.
10. White-UI-heavy video: `caption` is `plate`.
11. No invented footage, screenshot, number or quote; every clip is the maker's own, the speaker's, or the user's.
