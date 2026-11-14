# Night Class: the planning guide

Night Class edits a solo teaching video: frameworks, playbooks, how-tos, numbered steps, strategy explainers. A black graphic field with a faint dot grid sits over a small rounded presenter panel at the bottom of the frame. A centred title with a cobalt bar or underline sits at the top. One-word captions sit between them. About every ten seconds the edit cuts hard to the full-height speaker for a sentence or two, then cuts back to a changed graphic. It ends on a "Comment <keyword>" call to action.

Every number in this guide comes from `research/`, measured on 32 teaching reels (48 minutes, published 10 Oct to 11 Nov 2026). The load-bearing and disputed numbers were then re-measured independently (`research/verification.md`). Rule ids in brackets (`[S04]`) point to the research notes. The build targets the newest generation (24 Oct to 11 Nov, 17 reels) where the reels changed over the month (`research/README.md`). The accent colours are the one deliberate departure from the reference: the style ships an original palette, electric cobalt where the reference uses red and ice cyan where it uses yellow, each at the brightness it replaces, so every contrast holds (`research/colour.md`, Release palette [C28]).

This guide decides structure, pacing, copy, which graphic fits which sentence, and the review checklist. `style.json` lists the only layouts, slots, elements and parameters a plan may use.

## 1. What the style suits

Use it for one person teaching to camera: a framework with named parts, three to six steps, a list of mistakes or metrics, a before and after, a strategy breakdown. It suits scripts that name things ("it's called the Desire Frame"), count things ("there are three parts"), and contrast things ("most people do X, here is the catch").

Do not use it for interviews, two-person podcasts, vlogs, or videos with no teachable structure. Those were a different family in the reference and were left out [study brief].

## 2. Footage

The style cuts two framings from one camera frame [P14, P26]:

- **Panel:** a wide shot showing the room. The speaker's eyes are about 74 px apart and 65 px below the panel top; the head rises about 72 px above it [P10, P12].
- **Full height:** a 9:16 crop of the same frame. The eyes are about 196 px apart, with the eye line at y 650 [P13].

For the panel, start the project from the **horizontal recording** when one exists. For example, when OBS writes both a 3840x2160 and a 1080x1920 file of the same take, use the 3840x2160 one. Conform then keeps the whole frame as the wide view and crops the 9:16 picture around the speaker.

With only a 9:16 source the panel shows a much closer crop than the style. The engine warns about this at `motus init` and `motus conform`. If you change a project's style to Night Class after conforming, run conform again.

The full-height shot is never enlarged more than 1.35x [P27]. If the speaker is small in the frame, the shot frames them smaller than the reference, and the engine says so.

## 3. Cutting a raw take (raw mode)

- Start the voice on frame 0, with no lead-in, no intro card and no black frame [H01, H02, A05].
- Cut every pause. Keep normal gaps at 50-80 ms, cap any kept pause at about 0.18 s, and never leave 0.30 s or more; sentence gaps are about 0.14 s [A04, S16]. The engine's suggested cuts are the starting point; tighten them where a pause remains.
- Check the transcript for repeated takes. The recogniser can drop a line said twice and stretch the word next to it over the gap (a single word lasting several seconds is the sign). Re-transcribe that stretch and keep the last take.
- End the file within about 0.2 s of the last word. No end card, no hold, no fade [H22, S14].
- Remove false starts and repeated phrases (`analysis/retakes.json`).

## 4. The grammar

### 4.1 Three layouts

| Layout | What is on screen | Share of runtime |
|---|---|---|
| `dark` | Black dotted field, title at the top, graphic in the middle, caption, presenter panel at the bottom | about 62 % [L01] |
| `light` | The same on a pale grey field (#E3E3E3) with a soft grid behind the graphic; captions and titles turn near-black | about 6 %, in about half the videos [L21, C10] |
| `full` | The speaker fills the frame; only the caption, plus an optional push-in, and the closing keyword at the end | about 30 % [S01, S02] |

Two other modes exist in the reference but rarely and are not built: the field without the panel (2 reels) and full-frame b-roll (2 reels) [L23, L24].

### 4.2 Alternation and rhythm

- Open on `dark` (or `light`) with speech on frame 0 [S12, H01].
- The first cut to `full` comes at the start of sentence 2 (or 3), never before 1.7 s; median 4.7 s [S12, L20].
- After that, cut to `full` about every 10 s (5 to 18 s). Each full run is 1.4 to 6 s, median 3.1 s, and covers one sentence (60 %) or two (35 %) [S04, S05, S09].
- A panel run between two cut-ins lasts about 6.8 s (2.9 to 14.1 s) [S05].
- Totals per video: the full-height share is 0.25 to 0.37 of the runtime (target 0.30); 7 to 14 layout switches per minute (median 10) [S02, S03].
- Every switch is a hard cut on the first frame of a word, preferably a sentence start (61 %) or clause start (10 %) [S06, S07, S08]. Never animate a layout change [L18, M01].

### 4.3 What goes full height

Choose cut-ins by what the sentence does [S10]:

| Beat | Share of its sentences on `full` |
|---|---|
| Rehook or contrast ("here's the catch", "most people get this wrong") | 74 % |
| Naming the concept, payoff, pitch | about 40 % |
| Explanation | about 1 in 3 |
| A step or list item header | 11 %: steps stay on the graphic |
| The hook sentence | 9 %: the hook stays on the graphic |

Short contrast phrases (2 to 5 words, 0.5 to 1 s) may be their own cut-in [S04].

### 4.4 Returning from a cut-in

When the edit cuts back to the panel, the graphic has moved on: a new graphic, the next row, a highlight. Never resume the exact frame that was left [S28].

A title that stays the same comes back complete on the first frame. To get that, use the same `key` in the scene before and after the cut-in. A new title builds in about 4 frames after the cut [M09].

### 4.5 Dark and light

The dark field is the default. Switch to `light` only across a full-height cut-in: make the panel scene after a `full` scene `light` [L22, S20]. A light passage lasts about 5 s (up to 12 s) [S20]. It is most often the closing call to action, or an opening when the subject is a light interface [C10]. Use it in about half the videos, not all [L27].

### 4.6 Push-ins

About 1 in 4 full-height runs end pushed in [P16]. Add a `push-in` to the `camera` slot of a `full` scene:

- `small` (1.09x, 0.51 s, slow start) is the default.
- `large` (1.17x, 0.56 s) is rarer.

It starts on the cut (44 %) or on a later word (`at`). It holds until the next cut and is never reversed [P17-P19]. Do not push two consecutive full runs the same way.

### 4.7 Segmentation procedure

1. Split the transcript into sentences. Split any sentence longer than 4.5 s at a clause start [S26].
2. Label each sentence: hook (the first), name, proof, item, example, explain, rehook, payoff, pitch, cta.
3. Scene 1 is `dark` from word 0. It holds the opening title and the first graphic.
4. The first `full` scene starts at sentence 2 (if sentence 1 lasts at least 1.7 s), otherwise sentence 3.
5. Walk the rest in order. Start a cut-in where the beat favours it (4.3), the current panel run has lasted about 6.6 s or more, and the panel run would not be shorter than 2.8 s. Never start one on a step header.
6. Hold each cut-in for 1 or 2 sentences (1.4 to 6 s). End it at a sentence end.
7. Check the totals in 4.2. Drop the weakest cut-ins if over, add explain or pitch sentences if under.
8. Inside panel runs, change something in the graphic about every 1.9 s, on a word onset [S18, G03]. A new graphic starts on the first word of a clause.
9. The call-to-action sentence is the last one (section 8).

## 5. The title

### 5.1 Opening title (`title-lockup`)

Write two lines of about 7 words in all (4 + 3), in Title Case [H25]. Make it a promise or a how-to addressed to the viewer or the topic, never in the first person. Usually start with How, The, This, or a number.

Put the concept word or phrase (1 to 3 words) in the italic serif by wrapping it in asterisks: `"How To Write *Viral* Hooks"` [T16, H25]. Paraphrase the spoken hook: about two thirds of its content words should be words the speaker says in the first 40 words [H25].

Decoration [T17, H05]:

- `bar` (default): line 2 in white on a cobalt bar.
- `underline`: a cobalt underline under line 2.
- `none`: occasionally.

A line written entirely in the serif may be up to 1.25x larger than the other line.

The title builds from frame 2. Each word starts 2 frames after the last and slides in from the right as it fades up; the line itself never moves. Line 2 starts 3 frames after line 1's last word, and the bar wipes in from the left with it. Everything is settled by about 1.1 s [H04-H14, M07]. `build: "type"` reveals it letter by letter instead (5 of 32 reels). It holds through the first spoken sentence and leaves on the cut to the first full-height shot [H15].

### 5.2 Section titles

Reuse the title slot for each section: the step name, the next idea. Use the same lockup and the same build, about 4 per minute, each held about 4 s [H17]. A new title after a cut builds from the cut frame. `kind: "header"` is a single smaller line with no bar [T22]. A title over the full-height presenter never happens [H27, S13].

## 6. Choosing the graphic

### 6.1 Density: the field is never still

The reference changes something in the field about every 2 s while the panel is up, and a moving element is on screen in 62 % of panel frames [S18, G02, M25]. A graphic that enters and then sits still for four seconds looks wrong in this style. Plan for that density:

- A graphic is on screen for about 70 % of the runtime: all panel time [G01].
- A new graphic arrives every 2 to 4 s; inside it, something lands on the spoken words about every 1-2 s: a row joins, the list highlight steps down, a line is typed, a number rolls, a table cell fills, a section lights up, a spotlight lands [G02, G03].
- Give every graphic its beats. Set `at` on every row, cell, tier and card side; set `say` on script lines the speaker reads out; add `highlight` and `spot` beats where the speaker points at something.
- Within a panel run, change the graphic on a clause's first word [G03]. Split a long panel run into several scenes with the same title `key` so the title stays and the graphics change.
- Use two graphics together where the speaker pairs two things: a phone or capture in `graphic` with a `metric-card` (or a single capture) in `side` [G07].
- Prefer the live elements (`step-rows`, `doc-card`, `data-table`, `tier-bars`, `metric-card`, `compare`, `quote-card`, captures with spotlights) over `statement`. Use `statement` at most once or twice a video, for a short claim between richer graphics.

### 6.1b The camera

The reference moves a virtual camera over the graphic field almost all the time; the engine does the same, and the plan steers it [M13, M14, M21, M24]:

- **Arriving.** A graphic that arrives with a cut, or at the start, is seen with the view pulling back from about 1.12x into place. One pushed in as a strip settles from 1.05x.
- **Changing.** When a new graphic replaces another in the same panel run, the two slide left together as one strip (`enter: "push"`, the default, 1.14 s). `enter: "zoom"` instead blows the old one up and fades it while the new one pulls back from 1.38x: use it to go from a detail to its context (chips that turn out to be part of a document) or for a change of subject. `"cut"` swaps on one frame.
- **Holding.** While a graphic holds, the view keeps creeping in, about 2 % a second (up to 11 %, never wider than the frame). Set `"hold": "still"` on a graphic to stop it.
- **Pointing.** A `focus` beat `{ "at": word, "do": "focus", "x": 0-1, "y": 0-1, "scale": 1.2-2.4 }` pushes the view into that point of the graphic as it is said (the CTA lines of a script, a row of a table); `unfocus` pulls back. On a phone, `zoom` pushes through the frame into the screen (about 2.3x), as the reference does before a spotlight. The pushed-in graphic passes under the presenter panel and behind the title, which keeps a faint halo.
- **Spotlight.** A `spot` beat on a capture or phone grows a cobalt disc with a white ring over the detail in a quarter second, then fades it out.

Plan one camera move or beat about every 1-2 s in panel runs. A graphic that only enters and holds is the commonest way to make this style look flat.

### 6.2 What each kind of sentence gets [G04, G25]

| The sentence | The graphic |
|---|---|
| Steps, ordinals, "there are N things", list items | `step-rows`, one row per item, each on its word. This is the workhorse: 42 % of graphic time in the newest generation. `list` (the highlight steps down a numbered list; unspoken items blurred) for a list announced up front; `rows` (rows join and the stack moves up) for one built as it is said; `chips` for short claims |
| A named concept or framework | The concept caption (section 7) plus `step-rows` or `icon-nodes` for its parts |
| A script, hook, template or document being described | `doc-card`: the line the speaker reads out typed in with `say`, the part being discussed lit cobalt with `highlight`; `frame: "glow"` in the newest look. A single line they read out: `quote-card` |
| Several named things with a value each (words and examples, inputs and outputs) | `data-table`, a row filling on each word |
| Benchmarks or thresholds ("great is above 1.5 %, bad is below 0.5 %") | `tier-bars`, a tier on each word |
| Two sides (before and after, old and new, paid and free) | `compare`, the second side on its word |
| A number the speaker states (revenue, followers, a rate) | `metric-card`: the label and the figure rolling up to the spoken value; `trend` only when they describe growth or a drop. Beside a capture or phone, put it in `side` |
| A tool, app, page, profile or post being named | `capture` (the user's screenshot or clip) or `phone` (a screen in a phone), with a `spot` beat on the detail they point at |
| A trend with the speaker's own data points | `line-chart` |
| A short claim to land | `statement`: a phrase with a cobalt underline (sparingly) |
| Contrast and opinion | Stay on the presenter (`full`) |
| The call to action | `cta-lockup` with `cta-pages` (section 8) |

### 6.3 Captures

About half of the reference's graphic time is real captures: interfaces, thumbnails, clips, profiles [G19]. Plan for them. Capture pages with `motus capture`, or ask the user for screenshots and clips. Third-party logos, interfaces and profiles are never redrawn, only framed [G20]. When no capture exists, choose a designed element from 6.2 instead of faking one.

### 6.4 Truth

Text and numbers on screen come from the speaker's words or a captured source. Never invent a statistic, a quote, a chart, a document's contents or a screenshot. `doc-card` shows placeholder lines unless the speaker says the line. `cta-pages` shows placeholder pages unless the user supplies page images.

## 7. Captions

The engine draws them [T03-T11, T28, M03]:

- One word at a time; two or three when short function words run together.
- One centred line, never wrapped, its baseline at y 1306.
- Inter 800 at 59 px on the panel and 69 px over full height.
- Each caption appears 2 frames after its word starts and stays until the next one replaces it.
- White, or near-black on the light field.
- No shadow, colour or animation; each caption replaces the last on the same frame.

What you supply in `captions`:

- `fixes`: correct ASR errors and names (`"97": "Claude"`), spell quantities as digits with thousands commas (`44,000`, `100K`, `1%`) [T11, T25].
- `emphasis: "concept"` on the word(s) of the concept the video teaches. That name shows as one caption in the italic serif, Title Case with a final period, about 1.33x larger [T12]. Use it 1 to 3 times per video, on the naming sentence ("it's called **the Desire Frame**").
- `emphasis: "cta"` on the call-to-action keyword. The caption reads `Comment “Keyword”` [T13].
- Captions never take colour, and there is no other emphasis kind [C19].

## 8. The call to action

Spoken: one sentence, last in the video: "Comment <one-word keyword> and I'll send you <the doc / the link / the video>", optionally led in by "If you want <outcome>," [H23, S15].

On screen: cut to a panel scene at the word "Comment" with:

- **`cta-lockup`:** `keyword`, `reward` ("To Get The Doc"), `at` set to the word "Comment". Line 1 is "Comment" plus the keyword in serif in curly quotes; line 2 is the reward on the cobalt bar. It builds 2 frames after "Comment" and holds to the last frame [H18-H20].
- **`cta-pages`:** a grid of document pages under it (the user's page images, or placeholders) [G18].

When the pitch continues for several seconds after "Comment", you may cut back to `full` for the rest of it (6 of 31 reels) [H20]. A variant then shows the keyword large over the full-height speaker (`keyword-caption` in the `keyword` slot, 6 of 31 reels) [H21].

If the speaker gives a different call to action (join, subscribe, download), do not invent a keyword. Use a `title-lockup` with their words.

## 9. Options

Give 2 to 4 options per scene where a real choice exists:

- a list as `rows` versus `chips`;
- `push` versus own entrance;
- dark versus light for the closing scene;
- a cut-in versus staying on the panel for an explanation sentence.

Use `"single": true` where the grammar fixes the choice: the opening scene, the CTA.

## 10. Sound

The engine places the sound; you choose the look:

- **`kit`:** `k1` (default), `k2` or `k3`. This is one effect family per video [A15]. Every kit has a low swell that stops dead, placed on the first cut-in and on the call to action [A20].
  - k1: a low sub swell under the opening and on graphic changes, and a short downward swoop on list beats.
  - k2: sub drops on cuts into the full-height shot, mid whooshes on graphic changes, a soft tone on beats.
  - k3: low whooshes on graphic changes, with the bed running the whole video.
- **`bed`:** `on` (default) or `off`. The bed is a low loop (mostly 30-110 Hz), 8 beats at 65 BPM. It enters at the top of its loop at the first scene after the hook (typically 3-19 s, median about 8 s). It runs one 44 s block, then leaves a music-free stretch; a second section starts 73.8 s after the entry and runs to the last frame. It sits about 16 dB under the voice and is never ducked [A06-A12]. A user's own music (`audio.music`) replaces it.

In the reference the effects are not locked to cuts. The engine places them on graphic changes and beats so they land with the picture.

The mix is mastered to about -14 LUFS [A01].

## 11. Variation between videos

These vary per video in the reference; vary them:

- the sound kit;
- the dark field's texture (`plate`: dots, grid, plain or lifted);
- dark or light opening (light in 7 of 20 recent reels);
- bar or underline titles;
- rows or chips;
- push-in levels;
- the caption size (two sizes in the reference; the engine uses the more common larger one).

About a third of held graphics in the reference creep larger at 1-4 % a second while the title stays still. The engine does not do this: held graphics stay still, as in the other two thirds.

These never vary [S27, L18, T28, M21, M22]:

- hard cuts between layouts;
- the panel's position;
- one-word white captions;
- no idle motion, no overshoot, no rotation.

## 12. Self-review checklist

Before you show the plan, check:

1. Speech starts at frame 0 and the first scene is `dark` or `light`.
2. The first cut to `full` is at sentence 2 or 3, after at least 1.7 s.
3. The full-height share is 0.25 to 0.37; there are 7 to 14 switches per minute; no full run exceeds 9.8 s or is under 0.54 s.
4. Every layout switch starts on a word; most start on a sentence.
5. No title over a `full` scene. The opening title is 2 lines, about 7 words, Title Case, not first person, with a serif phrase.
6. Every graphic's text comes from the speaker's words or a capture. No invented numbers.
7. A graphic changes about every 2 to 4 s in panel runs; panel runs after a cut-in show a changed graphic.
8. Light scenes come only right after a `full` scene.
9. The concept is marked as `emphasis: "concept"` where it is named; ASR errors are fixed; numbers are digits.
10. The CTA is the last sentence, with `cta-lockup` at "Comment" (or the speaker's own words if they give no keyword).
11. No pause of 0.30 s or more remains in the cuts.

## 13. Element guide

| Element | Slot | Use |
|---|---|---|
| `title-lockup` | title | Opening and section titles. `line1`, `line2`, `deco` bar/underline/none, `decoLine`, `build` word/type/none, `kind` title/header |
| `cta-lockup` | title | Comment call to action. `keyword`, `reward`, `at` (the word "Comment") |
| `step-rows` | graphic | Lists of 2 to 6. `rows: [{label, at}]`, `variant` rows/chips/list, `reveal` stack (rows join and the stack moves up) / blur (all shown, unspoken labels blurred; the default for `list`) |
| `doc-card` | graphic, side | A script or document. `title`, `sections: [{label, lines, say?: [first, last word]}]`, `frame` plain/glow, beats `highlight {section}` / `clear` |
| `data-table` | graphic | `title`, `rows: [{head, cell, at}]`, `blank` rows still to come |
| `tier-bars` | graphic | `tiers: [{label, value, tone, at}]` (2-4), `tone` white/grey/cobalt/green (default white, grey, cobalt, cobalt) |
| `metric-card` | graphic, side | `label`, `value` (as said), `from`, `trend` up/down/none, `at` (the roll lands on it) |
| `compare` | graphic | `left` and `right`: `{label, text, at}` |
| `quote-card` | graphic | `say: [first, last word]`, `typed`, `place` middle/top |
| `capture` | graphic, side | 1 to 4 user images or clips in a frame. `items: [{src, fit, start, loop}]`, `frame` card/cobalt/blue/none, `blur`, beat `spot {x, y, r}` |
| `phone` | graphic, side | A screen in a phone. `src`, beats `zoom`, `spot {x, y, r}` |
| `line-chart` | graphic | The speaker's numbers. `points`, `xLabel`, `yLabel`, beats `highlight {from, to}` |
| `icon-nodes` | graphic | Named parts of a system. `nodes: [{label, icon?, at}]`, `hub` |
| `statement` | graphic | A short claim with a cobalt underline. `text` |
| `cta-pages` | graphic | The promised document's pages. `count` or `pages` |
| `push-in` | camera (full) | `level` small/large, `at` |
| `keyword-caption` | keyword (full) | The closing keyword over the speaker. `keyword`, `at` |

Every graphic element also takes `enter` (`push`, the default when it replaces another graphic in the same panel run; `zoom`; `own`; `cut`), `hold` (`drift`, the default, or `still`), and the camera beats `focus` / `unfocus` (section 6.1b).
