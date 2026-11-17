# Prop Room: the planning guide

Prop Room edits a solo explainer about a tool, a skill or a workflow, where the pictures do the explaining. The video opens on a pale panel over the speaker, with the first caption already up and the picture already moving. About every two seconds it cuts: to a full-frame scene, back to the panel, now and then to the speaker full height. Every picture acts its sentence out. A printer feeds out a page, a tank drains and a train switches tracks onto a free model, a picker lands on its choice, a counter rolls to the number just spoken. Two-word white captions sit on a dark plate across the seam. The video ends on the speaker with “KEYWORD" in a bold serif.

Every number in this guide comes from `research/`, measured on 19 reels by one creator (697.1 s, published 29 October to 12 November 2026), in two studies: nine dimensions of the edit, then every graphic watched at every frame (`research/explain.md`). The numbers the studies disagreed on, and the ones the build depends on, were re-measured independently (`research/verification.md`). Rule ids in brackets (`[S06]`) point to the research notes.

The reference renders its objects as pictures. Prop Room draws them in code instead, so the style needs nothing from outside: the props are SVG drawings with named parts that the plan's beats move (section 6). Photoreal pictures and AI video clips, about a tenth of the reference's graphics, are left out.

This guide decides structure, pacing, copy, which graphic fits which sentence, and the review checklist. `style.json` lists the only layouts, slots, elements and parameters a plan may use.

## 1. What the style suits

Use it for one person explaining one thing to camera in 28 to 47 seconds: a new tool, an agent skill, a workflow, a "here is what this does" walkthrough, a short list of two or three ways to use something [S21]. It needs a script with concrete actions in it ("you drop in your CV", "it switches to the free model when you run out"), because each one becomes a picture.

Do not use it for interviews, two-person shows, long tutorials or product montages.

## 2. Footage

The speaker is plain footage in the real room. There are exactly two framings per video, both fixed for the whole video [P01, P04, P09]:

- **Split**: the box x 0-1080, y 960-1920, under a hard seam. Interocular about 137 px, eye line y 1275, face centred on x 529, the head top about 48 px under the seam [P05-P08; verified]. The engine fits any speaker to these numbers.
- **Full height**: the same footage about 1.92 times larger, eye line y 689, face centre x 542 [P09-P11; verified]. Used for short beats mid-video and, identically, for the close [P12, S13].

The split box is 9:8. Start the project from the **horizontal recording** when one exists: conform keeps the whole camera frame as the wide view and the split is cut from it. With only a 9:16 source the speaker appears larger in the split than in the style, and the engine says so. The full-height shot comes from the 9:16 crop.

Never zoom, pan, shake, key or grade the speaker [M24, P23, C26]. The speaker should face the camera at a desk microphone, chest up [P25].

## 3. Cutting a raw take (raw mode)

- Cut every pause. Leave about 70 ms between sentences and never more than 180 ms anywhere [S17, A09].
- Speech starts on frame 0: cut the take so the first syllable is on the first frame [H02, A08].
- End within 1 to 5 frames of the last word. No end card, no hold [S16, H24].
- Cut the take freely under full-frame scenes: the reference hides almost every take cut there (104 of 121) [P18]. A direct cut from split to full height may also hide one [P19]. Never jump-cut the speaker while the split or the full-height shot is up [S18, P20]: put the take cut where a scene change already happens. The one exception is the close: a jump cut on "comment" is allowed (2 of 19) [S14].
- Remove false starts and repeats (`analysis/retakes.json`).

## 4. The grammar

### 4.1 Three layouts, hard cuts only

| Layout | What is on screen | Share of runtime | Run length (frames at 29.97) |
|---|---|---|---|
| `split` | a graphic in the panel y 0-960 over the speaker | 37 % | median 58 (33-92) |
| `full` | a graphic fills the frame, no speaker | 50 % | median 84 (41-139) |
| `speaker` | the speaker full height | 13 % | mid-video 28 (12-51); the close 92 (66-138) |

[L01, L03, S01, S05; verified]

- Every change of layout and every new graphic is a **hard cut on one frame**. No crossfade, slide, wipe or zoom between layouts [L02, M01, S07].
- Put every cut on the **first word of a caption group**. The engine starts a scene on its first word's onset and starts a new caption group there, so the cut and the caption change share a frame [S08, M02, M03].
- Alternate `split` and `full`. A `speaker` scene may replace a split or sit between two full scenes; after it, either layout may follow (speaker to full 17 times, speaker to split 15 in the reference) [S04]. Two scenes of the same layout touch only when the second continues the first picture (same `key`) [S04, G05].

### 4.2 Rhythm

- Change layout about every 62 frames (2.1 s): 12-19 changes in a 35 s video, about 24 a minute [S06].
- A new graphic about every 61 frames (2.0 s) [G03, G04].
- Something new on the picture about every 16 frames: the graphic's own events fill the time between cuts [S20]. A graphic that sits still for its whole scene is a defect.

### 4.3 Where the cuts go

- About half the cuts on a sentence's first word, the rest on a caption-group boundary inside the sentence. The cut word is usually a small word ("and", "so", "it's", "just"), not the key noun [S09].
- Give about four in five sentences a layout change on their first word [S10].
- Give almost every content sentence a `full` scene somewhere in it (88 %). Keep `full` out of the call to action [S11].
- `speaker` mid-video: 0 to 3 times (usually 2), 12 to 51 frames, on lines said straight to camera: a pivot ("here's the best part"), a problem opener ("here's the problem"), a list marker ("second,"), a caveat, or the last 2-5 words of a punchline [S12].

### 4.4 The order of beats

HOOK first, the CTA last, always. Between them: NAME, PROBLEM, WHAT, HOW or ITEM, DEMO or PROOF, usually a PIVOT and a BENEFIT [S21]. Sentence length about 3.5 s. Layout share by beat [S22]:

| Beat | split | full | speaker |
|---|---|---|---|
| HOOK | 51 % | 49 % | 0 |
| WHAT, HOW, DEMO, PROOF, BENEFIT, PROBLEM | 28-45 % | 50-68 % | 2-6 % |
| NAME | 48 % | 48 % | 4 % |
| ITEM (list marker) | 71 % | 25 % | 5 % |
| PIVOT | 23 % | 60 % | 17 % |
| CTA | 0 | 1 % | 99 % |

### 4.5 Segmentation procedure

1. Group the words into caption groups (section 7) and mark sentences and beats. Find the CTA sentence.
2. Scene 1: `split`, from word 0. It runs about 53 frames (38-80) and ends on a caption-group boundary inside sentence 1, on word 4 to 12 [S02, S03, L04].
3. Scene 2: `full` [S03, G06].
4. For each following sentence before the CTA: if it is a pivot, caveat, list marker or problem opener and fewer than 3 `speaker` scenes are used, give it a `speaker` scene of 12-51 frames on its first word. Otherwise cut on its first word to the layout the alternation calls for, and inside a long sentence cut again at a caption-group boundary so no run passes about 140 frames (full) or 92 frames (split) [S05, S25].
5. The CTA sentence: one `speaker` scene from its first word to the end, with the `comment-keyword` element (section 8) [S14].

## 5. The opening

- Frame 0 is already the edited split: a graphic of the first sentence's subject in the panel, moving from frame 1, and the first caption on the seam [H01, H08, H09].
- No title card, no headline overlay, no logo sting. The only words on screen in the first 3 s are the captions and words inside the pictures [H07, H15].
- Hook copy: one claim sentence of about 16 words, finished by about 5 s, opening on a news subject, "this", a warning ("Do not ...") or "you" [H13]. If the take has a naming sentence ("It's called ..."), show the name big inside the picture on the next cut, with `name-reveal` [H14, G14].

## 6. Choosing the graphic

### 6.1 Every picture acts

A graphic is an **anchor** on the cut and then **events** while its clause is spoken [X03, X55]:

- The anchor is complete on the cut frame. The first event follows within 2 frames for an interface, about 12 frames for a picture [X04, X05, X55].
- Interfaces carry about 6 events, 5 frames apart; pictures about 3, 12 frames apart. Keep acting until the cut [X05, X55].
- Interface events land on the onset of the word they act out (median 0 frames, 58 % within 3), in the order the words are spoken. Anchor them to the noun or verb, not the clause's first word [X56-X58]. Picture events follow the clause rather than exact onsets: one per beat while the clause that names them is spoken [X06].
- A spoken number is a figure that is already moving before the word and lands about 7 frames after it [X07].
- The picture accumulates: events add, fill, mark or transform. Removing something is rare [X22].
- Give the video one recurring anchor object and come back to it 2-4 times (same prop, new state) [X23].

### 6.2 Which device explains which idea [X14, X53, G12]

| The clause carries | Use | Element |
|---|---|---|
| a number | it counts up, a bar fills, or one big numeral lands | `counter`, `value-bar`, `big-number` |
| a counted set ("three free models") | exactly that many items, one per beat | `item-set` |
| the name of the tool | the mark flips in, a ring pulses, the name follows | `name-reveal` |
| a verdict on a noun ("free", "hired", "blocked") | a stamp or badge lands from larger | `stamp`, or a `badge` beat on a prop |
| a step the user takes | the interface itself, operated by the pointer | `window`, `prompt`, `picker`, `file-drop` |
| a choice | a picker lands on the option | `picker` |
| a change of state | before and after with a wipe | `before-after` |
| repetition or accumulation | items stack in | `item-stack`, `checklist` |
| giving the tool something | items drop into a composer or slot | `file-drop`, or a prop `move` into a slot |
| the tool working | code or text types in, a prop's part moves | `code-window`, `prompt`, `prop` |
| a problem, an outcome, a claim, a comparison | a metaphor object acted on | `prop` |
| a route, a hand-off, a chain | a path draws, a token travels | `route` |
| a real page or app | the capture in rebuilt chrome, marked up | `capture` |
| a short headline or sign | words come in one at a time | `title-card` |
| a shortcut or key press | keys press on their words | `key-caps` |

Use a metaphor for changes, outcomes, claims and comparisons, a diagram for quantities, and the interface itself for steps [X15, X54].

### 6.3 Props: drawing the object

`prop` draws an object as an SVG with named parts. Take one from the pack (`name`, listed in `props/README.md`) or, when the sentence needs an object the pack does not have, **draw it** as an SVG in the project's `assets/` and point `src` at it. Follow `props/STANDARD.md` exactly: the viewBox, the materials and their colours, the top light, no outlines, and separate groups with ids for every part a beat moves. A prop is one hero object centred on x 540, about 0.68 of the frame wide [X24].

Prop beats (anchor each with `at`, a word index). Part ids for every pack prop are in `props/README.md`:

| Beat | What happens |
|---|---|
| `show` | a hidden part enters: pop, slide (`from`, `dist`), grow, land or fade [M10-M14] |
| `hide` | a part leaves: fade, pop, or slides `away` (rare: the picture accumulates [X22]) |
| `move` | a part travels, turns or scales (`dx`, `dy`, `rotate`, `scale`, `sx`, `sy`; ease `out`, `inOut` or `slow`): a sheet out of a slot, a lid up, a door open [X20, X21] |
| `fill` | a level rises or drains (`to`, optional `from`), ease-in-out over 27 frames [X08, X10] |
| `draw` | a line or path draws on (`to`, ease `out` or `sweep`) [X19] |
| `spin` | reels and wheels spin at 14 degrees a frame (`rate` to change it) until a `spin` with `stop` [M21] |
| `swap` | one state cuts to another on one frame [X69] |
| `recolor` | a part changes colour over 4 frames, keeping its shading (a bar turning red at its limit) [X10] |
| `pulse` | a ring pulses out from a part [X17, X72] |
| `badge` | a check, cross or short word lands from 1.25x in 6 frames (`big` for a hero badge) [X18] |

Size: `s`, `m` (the reference's hero size, 0.68 of the frame width) or `l` [X24]. A prop casts a soft shadow that suits the plate; `flat` turns it off for flat icons [C19, C21].

### 6.4 Plates

Every graphic sits on its own plate, chosen for it (`plate`) [C04, C13, G27]:

| `plate` | Share | Use |
|---|---|---|
| `pale` (default) | about 66 % | light gradient with pastel corner tints |
| `white` | 15 % | interfaces and paper |
| `dark`, `navy`, `warm`, `teal` | 17 % | night, risk, depth; about half the videos open on a dark panel [C09, C10] |
| `field` with `field: "#RRGGBB"` | 7 % | one sentence only (about 36 frames), in the colour of the brand on screen or a colour the sentence names [C11] |

Consecutive graphics rarely share a plate. There is no house accent colour: colour comes from the subject [C18 corrected].

### 6.5 Evidence rules

- Text and numbers on screen come from the speaker's words or from a captured source. Never invent a statistic, a quote or a screenshot.
- Rebuild interfaces as simplified generic UI with the plan's own text [G15, X73]. Never draw a third party's logo, mascot or wordmark: use `name-reveal`'s monogram or a mark the user supplies.
- A real page or app goes in `capture`, captured with `motus capture` or supplied by the user [G19].

## 7. Captions

- One centred line of 1 to 3 words, mostly 2, about 9 characters. A group ends after a word with . , ? or !; otherwise it fills while it stays at 14 characters or less [T05, T07-T09]. The engine groups them; force a break with `captions.breaks` only to start a group where a cut must go.
- White Inter Bold on a dark plate, no emphasis of any kind: no colour, weight or highlight on a word [T01-T04, T16, T18].
- Keep the transcript's case and punctuation. Fix misheard product names with `captions.fixes` [T12, T13].
- Position follows the layout: across the seam in `split`, low (baseline 1276) everywhere else [L14-L16].
- Captions run from frame 0 to the last frame, also over the closing keyword [T10, T24].

## 8. The ending (`comment-keyword`)

- The CTA sentence is one `speaker` scene from its first word to the end: an optional lead-in question about the benefit ("Want to ...?"), then "Comment <keyword>", then the promise to send something [H17, H18, S14].
- Put `comment-keyword` in that scene's `keyword` slot with `word` = the index of the keyword: the noun spoken right after "comment", or after "comment the word" when the speaker says it that way. It cuts in complete on that word and holds to the last frame, under the running captions [H19-H23, T22, T24]. Use `text` only to correct the transcript's spelling.
- The keyword is a short noun from the topic or the thing being sent (3-6 letters in the reference) [H23]. If the transcript's keyword looks misheard, ask the user before fixing it with `text`.
- The close runs 66-138 frames in the reference. A longer lead-in question that cannot be cut is fine: do not cut words to fit the range.

## 9. Sound

The style places its own sound; the plan chooses only the bed and whether effects play (`audio.bed`, `audio.sfx`).

- A bed plays under every frame from frame 0 to the last, from the top of the track, static: no ducking, no fade in or out, about 16 LU under the voice [A10-A14]. Three original beds ship: `a` a 130 BPM bass groove (the default), `b` a 118 BPM kick-and-keys bed, `c` a pad with no beat. The reference uses drum-led beds in 14 of 19 videos and a pad in 5; pick `c` for a calm or serious take.
- Effects are sparse and placed by the style: about two loud ones per 10 s, at least 0.65 s apart; a soft noise swell on some full-frame cuts (about one cut in eight), a low boom after some swells, a high ping on about four ring pulses in ten, and textures that last as long as a prop's action (reels spinning, a printer printing). Nothing marks the call to action [A17-A25].
- Every sound is original synthesis (`dev/make-audio.mjs`). A person must audition them before release: nothing has been listened to.

## 10. Options

Give each scene 2 to 4 options when the sentence honestly allows different pictures: a prop and an interface for the same step, or two props for the same claim. One option is honest (`"single": true`) for the opening split when only one picture fits the hook, a `speaker` scene, and the close.

## 11. What varies and what does not

Constant in every video: the layouts and their geometry, hard cuts on caption groups, the caption type and plate, the keyword, the presenter's two framings, the entrance and push-in, the event rhythm. Varying per video: the plates, the objects, the colours of the subject, the number of mid-video speaker beats (0-3), the length.

## 12. Self-review checklist

Run it on the stills (`motus stills --scene <id> --option <id>`) before showing the plan:

- [ ] Frame 0 is `split` with a moving graphic and a caption; the first cut, to `full`, is at 38-80 frames on word 4-12 of sentence 1.
- [ ] Every scene starts on a caption-group word; no run longer than 237 frames; layout changes every 29-114 frames, median near 62.
- [ ] `full` holds 42-57 % of the runtime, `split` 29-43 %, `speaker` 8-19 %.
- [ ] Every graphic has an anchor and events before its cut: at least one for a picture (median 3), at least two for an interface (median 6); nothing is still for its whole scene [X03, X55, X77].
- [ ] Every spoken number has a figure that lands within about 7 frames after the word.
- [ ] Interface events are anchored to the nouns and verbs they act out, in spoken order.
- [ ] No two consecutive graphics share a plate; a `field` plate lasts one sentence.
- [ ] No third-party logo, mascot or interface; every on-screen number and name comes from the speech or a capture.
- [ ] 0-3 mid-video `speaker` scenes of 12-51 frames, on lines said to camera.
- [ ] The close: one `speaker` scene from the CTA's first word, `comment-keyword` on the word after "comment", 66-138 frames long.
- [ ] The video ends within 5 frames of the last word.

## 13. Element guide

Every graphic element also takes `plate` and `field` (section 6.4). Beats are anchored with `at`: a word index (preferred), `{ "t": seconds }` or `{ "rel": seconds }`. Text limits are layout facts; the validator enforces them. All parameters and their exact specs are in `style.json`.

### Figures

- **`counter`**: a number rolls to `to` (from `from`, default 0), already moving 5 frames before the spoken number (`word`) and landing 7 frames after it, on an ease-in-out of 27 frames [X07, X08]. `prefix` (2), `suffix` (8, arrives on landing), `label` (22). Use for every spoken quantity that changes ("from 21 to 331 lines").
- **`big-number`**: one figure that lands as a fact, from 1.24x in 6 frames: `text` (6), `suffix` (4), `label` (22), `look` solid | type | outline | image, `color`. Beat `change` swaps it to a new value [X18, T26].
- **`value-bar`**: `kind` usage (a limit bar that fills over about 30 frames and turns red at its limit) or score (rows that fill fast, 3-5 frames apart). `rows` 1-5 (`label` 22, `to`, `from`), `max`, `suffix`, `total`. Beats `fill` and `flag` (a warning line) [X10, X11].
- **`item-set`**: a counted set, exactly as many items as spoken: `kind` drop (items drop in one per `add` beat, about 11 frames apart), segments, or grid (`count` up to 56 cells fill while a count runs) [X09, X12, X16].
- **`name-reveal`**: the tool's name on the naming sentence: the mark (`mark`, 2 letters, or a user-supplied `asset`) turns up by `how` flip | focus | type, a ring pulses to 1.5x, the `name` (12) follows 8 frames later, `sub` (26) under it [X17, H14].
- **`stamp`**: a verdict on a noun (`word`): `kind` stamp (`text` 9, e.g. FREE), tick or cross, landing from 1.25x in 6 frames, never bouncing; optional `title` and `lines` for a scored card [X18].
- **`route`**: a path or chain drawing on: `kind` route | chain, `nodes` 2-5 (16), a travelling `token`. Beat `next` advances one node [X19].

### Pictures

- **`prop`**: section 6.3. `name` from `props/README.md` or `src` an SVG you drew to `props/STANDARD.md`; `size` s | m | l (m is the reference's hero size); `flat` for flat icons (no shadow).

### Interfaces

- **`window`**: a generic app window or card (`kind`), `look` rows | buttons | tiles, `items` 1-4 (`label` 16, `sub` 28, `after` 14, `icon`), `heading` (13), `status` (38), `theme` light | dark. The one pointer operates it: beats `hover`, `click` (the control changes on the click frame, 3 frames after the pointer arrives), `status`, `result` [X66-X68].
- **`prompt`**: a request (`text` 48) types at 1.6 characters a frame, `send` fires, the `answer` (140) streams at 5-8 characters a frame. Beats `type`, `send`, `answer` [X62-X65]. Type a short plausible request, not the spoken sentence [X63].
- **`picker`**: `options` 2-5 (`label` 16, `sub` 26, `icon`); `open`, then `pick` jumps the highlight option to option every 4 frames and lands on the choice with a ring [X69, X72].
- **`file-drop`**: `items` 1-4 (`label` 14, `kind`, `meta` 12) drop into a `target` composer or slot, 4 frames apart, on `drop` beats [X20, X61].
- **`checklist`**: `items` 2-6 (26) that land 5 frames apart and tick off on `tick` beats [X61].
- **`item-stack`**: `items` 2-6 (`title` 26, `meta` 40, `tag` 10) stack in on `add` beats, about 5 frames apart; `mark` highlights one [X59-X61].
- **`before-after`**: a `before` state wiped to an `after` state in about 10 frames with a visible front (`front` colour); pictures (`asset`) or a rebuilt page (`title`) [X70].
- **`capture`**: a captured page (`src`, from `motus capture`) in rebuilt browser chrome with `url`; beats `scroll`, `outline`, `highlight`, `arrow` (by `find` text or a box) [X71, X73, G19].
- **`code-window`**: `lines` 1-40 (50 characters) type or stream in an editor or terminal (`kind`, `pace`); beats `run`, `mark` a line [X65].
- **`key-caps`**: `keys` 1-3 (6) press on their words with a one-frame sink; `text`, `result`; beats `press`, `result`.
- **`title-card`**: a short headline (`text` 40, 7 words) whose words come in 4 frames apart (`word` beats), or `kind` sign, a lit sign board [X75].

### The close

- **`comment-keyword`**: in the `speaker` scene's `keyword` slot; `word` = the word after "comment"; `text` only to fix spelling (section 8).
