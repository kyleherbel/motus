# Open Canvas: the planning guide

Read this before you plan an edit in this style. `style.json` lists the only layouts, slots, elements, parameters and beats a plan may use. Rule ids in brackets point at `research/`. The study behind this style is one clip read at every frame, so most rules are medium or low confidence; the style is in beta.

## 1. The idea

The video pretends to be an open design file. The speaker is a cut-out popping up out of their own footage rectangle. Every capture is a layer in a selection frame with handles. A cursor drags things into place. The ground is a drafting sheet that drifts upward and never stops.

Nothing is decoration. Every picture is either the real thing being talked about, or a pointer at the exact part being talked about. Words arrive one at a time on the syllable. There is no music and no sound effect: pace comes from speech with the air cut out and a new picture every 2 to 3 seconds [S01, A01].

## 2. Numbers to hit

| What | Target | Rule |
|---|---|---|
| Length | 25 to 60 s | S01 |
| Pace | 250 wpm or more after cuts; no pause over 0.25 s survives | S02 |
| Scenes | one every 2 to 4 s (reference median 2.9 s, range 0.7 to 3.9 s) | S03 |
| Cuts | every scene starts on the first word of a sentence or clause | S04 |
| Inner beat | something acts about every 1 s inside a scene: a box, a tap, a move, a swap | S05 |
| Dead time | no picture sits still for more than 1.5 s | S06 |
| Layout order | never the same layout twice in a row, except desk to desk with a new window | S07 |
| Speaker on screen | about half the scenes (desk, behind, face) | S07 |
| Ending | the last scene is `face` with `comment-cta` | S08 |
| Script words | one caption word in about 12 | T04 |

## 3. Cutting a raw take

Keep the last good take of each sentence. Cut every false start, repeat and filler. Cut pauses down to 0.25 s or less [S02]. Do not cut inside a word. The opening line must be the claim itself: no greeting, no "so today".

## 4. Layouts: which sentence gets which

Go through the transcript sentence by sentence. Pick the first row that fits [X02].

| The sentence is about | Layout | What to put in it |
|---|---|---|
| the opening claim | `desk` with `hook-title` | the product's own demo clip or page in the window |
| a named product, repo or site | `full` or `desk` | its real page; a `highlight` lands on the name as it is said |
| a command, setting or sentence on a page | `desk` | the page cropped to that line; `highlight` on the word "this" or "command" |
| a second option ("or Codex") | same window | a `view` beat whips to where the page says so; `highlight` each name in turn |
| what a tool does to a screen (read, tap, type) | `hero` | the screen; act each verb on its word: `highlight` = read, `tap` = tap |
| a list of uses ("testing, automating") | `behind` | one real clip per item with `swap` beats, about 1 s each |
| a mechanism no capture shows | `graphic` | a built object that performs the sentence (`transfer`) |
| a limit or rule ("block it from Wallet") | `graphic` | an object where the thing visibly happens (`app-lock`) |
| opinion, story, the ask | `face` | nothing, or `comment-cta` on the last scene |

Layout facts:

- `desk`: window 906 x 735 px (850 x 458 under a hook title). Captions sit between the window and the speaker. After a layout without the speaker the footage rectangle is drawn on by the cursor over 18 frames; after another desk scene the speaker stays and the new window is dragged from 70 % to full size [M01, M02].
- `full`: window 910 x 1042 px, no speaker. Lands 14 % large and settles in 15 frames [M03].
- `hero`: one screen 980 px wide from y 170, melting to dark from 56 % of the frame height. Put the part that matters in the top half [L04].
- `behind`: the screen fills the top 1500 px behind the cut-out; dark from 36 % down. Only the top third reads clearly [L05].
- `graphic`: one object centred high on a soft ground, no grid, no speaker [L06].
- `face`: raw footage punched in 1.32x. No furniture. The contrast is the point [P03].

Keeping a picture across scenes: give an element the same `key` in consecutive scenes of the same layout and it stays on screen; only its beats advance. A different key or no key is a hard cut to a new picture.

## 5. Elements

### `capture` (slots `window`, `screen`)

A real page, app screen or clip seen through a crop. Never a mocked interface for a real product [X01].

- `src`: a file under `assets/`. Pages: `motus capture <url> --out assets/<name>.png --full --scale 2 --find "phrase|phrase"`. Clips: the product's own demo video, cut short.
- `x`, `y`, `w`: the crop in the asset's own pixels. The height follows the slot. Crop until the words you point at are readable on a phone: text should be at least 28 px tall on the 1080 frame [X03].
- `start`: for a clip, seconds into it.
- Beat `highlight`: `find` (a phrase captured with `--find`) or `x, y, w, h` in asset pixels. Optional `until` (a word index) removes it. One box per idea, on the word that names it [X04].
- Beat `tap`: `x, y` in asset pixels. The dot arrives over the 8 frames before the word and presses on it.
- Beat `view`: a new `x, y, w`. Takes 12 frames (`frames` 6 to 30). Use it for "or", "also", "down here".
- Beat `swap`: a new `src` with its own crop and `start`. A hard cut inside the same frame. Later beats act on the new asset.

A still with no beat is an error in spirit: the build warns. Give every capture its first beat within 1.5 s [S06].

### `hook-title` (slot `title`, desk only, first scene only)

`line1` up to 18 characters, `line2` up to 22, 2 to 4 words each, Title Case. Together they state the claim in the viewer's terms: what now does what. Not a question, not first person [H03].

### `comment-cta` (slot `cta`, face only, last scene only)

`word`: the index of the spoken keyword. `text`: only to fix its spelling. `verb`: the index of the spoken "comment" (found automatically when omitted). Captions stop when the script "comment" appears; the keyword box draws on the keyword's own onset [H05, M10]. The keyword is one word of 3 to 9 letters that the speaker actually says [H06].

### `transfer` (slot `object`)

A phone and a laptop as outlines. Beat `select` frames the phone's screen; beat `drop` drags a copy into the laptop. `img`: a real capture of the phone screen. `from`, `to`: labels of at most 10 characters. Put `select` on the noun ("one screen") and `drop` on the verb ("put").

### `app-lock` (slot `object`)

A phone with nine generic app tiles. Beat `lock` with `app` (Messages, Maps, Photos, Mail, Notes, Chat, Music, Bank, Wallet) turns that tile into a padlock. Put each `lock` on the word that names the app.

A sentence that needs another mechanism drawn needs a new element in `src/elements/`. Do not bend these two to a sentence they do not perform.

## 6. Captions

- The engine groups 1 to 3 words per line and breaks after punctuation and pauses. You do not place captions. Use `captions.breaks` only to stop a bad split.
- Fix names and misheard words in `captions.fixes`. Captions are lower case except names; a name that opens a sentence and appears nowhere else is lowered, so fix it to a form with an inner capital or reword the fix.
- `captions.emphasis`: kind `script` sets a word in brush script. At most one per sentence, about one word in 12: the word a viewer would repeat back (the verb or noun the sentence is about). Never two in one line [T04].
- Captions never repeat inside graphics. Labels inside a graphic are 1 or 2 words.

## 7. Evidence

Everything shown is real: the product's own page, repo, docs, demo clips, or a screen you captured. Numbers and names on screen come from the capture or from the speaker's words. Never invent a screenshot, a statistic or a quote. If no capture exists for a sentence, use `graphic` or `face`.

## 8. Framing

The style expects a 9:16 view with the speaker roughly centred and a person matte. The desk shows the head at about 400 px wide with its top at y 1110. Without a matte the speaker stays inside the rectangle and `behind` falls back to the rectangle: prefer `desk` and `full` then. A microphone in front of the speaker is cut out of the matte and reads as a dark shape in `behind`; if that looks wrong, use `desk`.

## 9. Options

Give 2 to 4 options where the treatments really differ (a page or a clip; `hero` or `desk`). Set `"single": true` for the hook, for a scene whose only honest picture is one capture, and for the closing ask.

## 10. Look

`look.palette`: `mono` (default: black sheet, white lines, light-blue selection), `cobalt`, `ember`, `moss`, `ink`. Use one palette per video. A series can colour-code its topics.

## 11. Audio

Voice only. Set `"audio": {"sfx": false}`. Do not add music unless the user asks [A01].

## 12. Review checklist

Render `motus stills <project> --sheet` and check every row:

1. Every highlight box sits on the words it names, and lands within 2 frames of the spoken word.
2. Every caption line clears the face and the window.
3. Text you point at is at least 28 px tall.
4. No scene is longer than 4 s without a beat every 1.5 s.
5. No layout repeats back to back (desk to desk with a new window is fine).
6. Script words: no more than one per line, about one in 12 overall.
7. The first frame shows the title's first word within 3 frames and a real picture in the window.
8. The last scene is `face` with the keyword the speaker says.
9. `motus validate` reports no errors and the stage logs no `[open-canvas]` warnings.
