# The Open Canvas study

Open Canvas reproduces the grammar of one short-form editing treatment: the video staged as an open design file. This folder records what was measured. The tokens file and the planning guide cite these notes by rule id.

## What was measured

| | |
|---|---|
| Material | 1 public short-form reel, 9:16, 1080 x 1920 at 30 fps, 866 frames (28.9 s), 138 spoken words. Read on 16 November 2026. |
| Method | Every frame extracted and read on contact sheets; cut frames found by frame difference; positions read in pixels on native frames; speech aligned with machine word timestamps (faster-whisper, about +-2 frames); loudness measured with ffmpeg ebur128. |
| Not done | No nine-analyst split, no independent verification pass, no calibrated colour decode, no font identification. Nothing was listened to. |
| Rights | Unknown. The clip stays in `corpus/` on the local machine. Nothing from it is in this pack. |

## What this means

One clip cannot separate a constant of the style from the habit of one video. Every rule here is **medium** confidence at best (seen several times inside the one clip) or **low** (seen once). The pack is `beta` and stays there until a corpus of 15 or more clips is studied the way `docs/ADDING_A_STYLE.md` describes. Evidence is cited as `clip01@frame`.

## Owner's decisions

- 17 November 2026: the look is not the reference's. The owner chose a black sheet with white lines and light-blue selection frames (`mono`). The reference's own colours are not shipped.
- 16 November 2026: the fonts are open substitutes chosen by eye (Outfit, Caveat Brush, JetBrains Mono), not matches.
- Values marked "by eye" in `src/tokens.js` were fitted to the owner's footage, not measured.

## The records

| File | Ids | Covers |
|---|---|---|
| [layout.md](layout.md) | L01-L09 | the six layouts, slot geometry, the ground, caption positions |
| [type.md](type.md) | T01-T07 | captions, grouping, the script word |
| [hook.md](hook.md) | H01-H07 | the title, the closing ask |
| [graphics.md](graphics.md) | G01-G12 | selection frames, handles, cursor, highlight, tap dot, captures |
| [explain.md](explain.md) | X01-X08 | which sentence gets which picture, and what each pointer means |
| [motion.md](motion.md) | M01-M12 | every move with its frames |
| [structure.md](structure.md) | S01-S08 | length, pace, scenes, cuts, order |
| [colour.md](colour.md) | C01-C02 | the reference ground and the shipped palettes |
| [audio.md](audio.md) | A01 | voice only |
| [presenter.md](presenter.md) | P01-P03 | the cut-out, the rectangle, the face shot |

## Still needs a person

- Watch a full render at speed: do the drag, the settle and the whip feel right in motion?
- Listen to a render: the mix is the engine's, not measured against the reference by ear.
- Decide whether to study a proper corpus before this leaves beta.
