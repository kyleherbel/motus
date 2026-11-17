# Explanation devices: what happens inside designed graphics

**Why this record exists.** The first study measured the card, its marks and the transitions between layouts, but treated designed graphics (mock app screens, terminals, lists, panels, diagrams) as near-static boxes. Watched in motion, almost every one is a small animation that acts out the sentence being spoken: a prompt types, results stream in, a row climbs, greyed items light up on their names, a connector draws and something travels along it, a flaw gets boxed in red. A first render of the style next to the reference looked "lackluster, uninspired" for exactly this reason. This second pass measured that layer.

**Sample.** All 33 in-scope reels (clip07-clip40 except clip17), split into three parts and watched at every frame around each event (pipe decodes, per-frame difference grids to find bursts, then 1-3 frame contact sheets looked at by eye). 255 units, 739 events.

| Part | Reels | Units | Events | Local study folder (git-ignored) |
|---|---|---|---|---|
| A | clip07-clip16, clip18 | 66 | 234 | `corpus/_study/nick_saraev/explain/part-a/` |
| B | clip19-clip29 | 85 | 301 | `corpus/_study/nick_saraev/explain/part-b/` |
| C | clip30-clip40 (newest, the build target) | 104 | 204 | `corpus/_study/nick_saraev/explain/part-c/` |

Each folder holds `units.csv`, `events.csv`, `devices.md` and evidence sheets. Most durations were read by eye from frame sheets (+-1 f); measured curves are named where used. Word onsets are ASR estimates (+-3 f). No reference pixels leave the corpus folder; every device below is rebuilt with original shapes and the style's palette.

## Rules

### X01 - A designed card changes something on every spoken beat.
- Numbers: designed units run 2.2 events/s median (0.8-4.4; mixed units 1.4, plain captures 1.0) [A]; the median gap between changes is 16 f [B] and the longest still stretch inside a designed card is 19 f median, p90 41 f, max 52 f [C]; about half of all frames of a designed shot are mid-change [B, C]; the first change comes about 8 f after the cut [B].
- Confidence: high (three independent parts agree).

### X02 - Each change lands on the word it acts out; one visible change per spoken item.
- Numbers: offset of event start from the word onset: median 0 f [A], +1 f [C]; 82 % within +-6 f [A], 69 % within +-6 f and 84 % within +-10 f [C], 70 % within +-4 f [B]. State flips land on the word (0..+1 f); entrances that must be read land 2-6 f after it; cursors and pointers arrive 3-8 f before [A].

### X03 - Marks and connectors are drawn on, not popped.
- Numbers: an outline box is traced from its top-left corner, clockwise; perimeter progress per frame 40, 62, 75, 85, 91, 94, 97, 98, 100 % (measured, clip15@874-882) [A]; about half on the first frame, 97 % by +5 f [C]. The same exponential curve as the highlight sweep (motion.md M18). Branches and connectors draw on in 2-9 f [A]. Strokes 4-5 px.
- Supersedes the pop-and-shrink outline of graphics.md G12 (the box was right, its entrance was not).

### X04 - Prompts, commands and code type on.
- Numbers: prompts 1.5-1.7 characters per frame, code 3-4, sub-lines about 1.2, headings about 2 [C]; 1.2-3.4 overall [B]. A block caret blinks before and after. In 4 units the typed words land with the spoken words, each word in a burst [C]. Typing is followed by a payoff (rows stream, a result pops) within 0.3-1.0 s [C].

### X05 - Lists and logs assemble in speech order.
- Numbers: each row fades in over 2-3 f and settles 10-15 px [B]; bulk lists 1.5-4 f per row, process steps 4-6 f, one row per word when items are named (about 15 f apart) [B, C].

### X06 - Status chips flip in one frame.
- Numbers: the text or colour swaps in 1 f, the new face fades in over 2 f, no scale [C]; flips stagger 2-5 f [B]; queue cycles every 16-20 f [A]. Colours by role: running orange or blue, done green or the accent, failed red.

### X07 - Label chips pop on their word.
- Numbers: about 5 f, rising 10 px, scale 0.9 -> 1, no overshoot [B]; 10/30/60/95/100 % opacity over 4-5 f [A].

### X08 - Attention visibly moves: idle items wait greyed and light on their names.
- Numbers: idle items at about 40 % (flat light grey, faint glyph) [A]; the named item lights over 6-7 f (ease-out), the previous one releases over about 5 f starting 2 f earlier, so there is always one lit thing and the hand-over is seen [A]; in row lists the active plate takes 2 f, text first [C]. Rows keep their done marks, so the card accumulates evidence [C].

### X09 - Arrivals carry weight and settle without bounce.
- Numbers: drops arrive at about 30 % opacity, offset about +20 px x and -25..-30 px y, tilted 8-12 deg, settled by +6 f; stamps arrive at 1.25x and settle 1.06, 1.03, 1.02, 1.0 (widths measured, clip16@406-410) [A]; 0 overshoots in 197 events [C] and in 301 events [B].

### X10 - Things travel to where they belong.
- Numbers: converge travel measured on clip37@264-280, per-frame dx 14, 60, 72, 50, 36, 24, 18, 16, 11, 10, 7, 5, 3, 2, 2, 1 px: 90 % by +8 f, settled by +16 f [C]; peaks 70-140 px/f with motion blur above about 40 px/f [C]; 56 of 301 events carry blur [B]. Paths straight, elbow or arc; marks fly from a header into a row and shrink [C].

### X11 - A reply is preceded by a short "thinking" beat.
- Numbers: typing dots for 6-10 f before the reply; a sent message rises from the input into the thread in 4-6 f [C].

### X12 - A next phase scrolls the last one out with blur.
- Numbers: content scrolls up and out in 6-8 f with heavy vertical blur; pinned rows stay [C]. Extends M21 from pages to mocks.

### X13 - Something keeps running underneath a hold.
- Numbers: a glowing dot loops along a connector, 8-10 f a trip, the whole time a dashboard is up (clip31@318-372) [C]; carets blink, spinners turn, counters step every 6 f, media keeps playing, plus the card glints (M27) [A, B, C].

### X14 - Cascades are tight; named items follow the speech.
- Numbers: rows, badges, strikes and boxes cascade 3-6 f apart, median 5.5 f over 60 staggered events [C]; items said one by one are spaced by the speech, 15-25 f [C].

### X15 - Every process ends in a verdict.
- Numbers: a final row, chip or button with an ok or fail tone ("approved", "0 fail", "do not install", a score), landing 0-3 f after its word [C], 7 units in 5 reels.

### X16 - Counts run alongside what they count.
- Numbers: per-row count-ups about 12 f ease-out; an n/N counter steps 1 f before the item it counts arrives [A, C]; a usage bar fills over 28 f with its % label counting [C].

## Materials (all parts)

- Icons are flat, chunky, single-colour glyphs; inactive ones are flat light grey with a faint glyph. Third-party marks sit on white rounded tiles; the build never draws them (a supplied logo file or the name's initial instead).
- Mock type is large for the card: body cap height about 1/25-1/30 of the 894 px card width; row titles 28-46 px bold, secondary 20-31 px grey; 3-8 rows at 50-170 px pitch [A, B, C].
- One accent everywhere in mocks (the reference's blue; the release palette's accent here); pale tint of it for lit rows; red for flaws; green or the accent for done.
- Two mock skins, light (white or very light grey panels) and dark (near-black body, slightly lighter rows).

## How the build uses this

| Device | Build |
|---|---|
| typed prompt, thinking dots, streamed answer rows, sponsored chip, lit / checked / struck rows | `ask-card` (new) |
| steps waiting greyed, lighting on their words, connectors drawing on, a packet looping along them; chain, merge, split | `flow-card` (new) |
| outline boxes traced on | `marks.js` outlineBox (all elements) |
| face-offs: converge from the edges, win (grow, glow, check; the other greys), a stream of people pouring from one hub to the other | `duel-card` (new) |
| before / after: a divider wipes the new side over the old, which makes room and greys | `wipe-card` (new, part C DV23) |
| a naming card whose mark lands as a hero | `logo-card` `glyph` |
| the dark backdrop as a live blurred copy of the card (colour.md C19-C20, simplified to a flat field in the first build) | `canvas.js` echoLive |
| card swaps inside a run slide-push with horizontal blur (M16; re-seen in mid and newer reels) | `compile.js` |
| arrivals, chips, light hand-over, travel, typing, packets | `src/anim.js` |

## Not built yet

Flaw annotation over a document (red box, x note, inserted line; part C DV04), slot-reel pick (DV12), hero-then-dock (DV08), source marks lighting above a rank list and flying into its row (part C DV09/DV07, clip38), status queue with counters (part A device 7), phone thread (part C DV16).
