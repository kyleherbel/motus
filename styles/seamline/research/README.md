# Seamline: what was measured

Seamline is measured from one creator's short-form tech news, and only from the posts in one format: real footage of the thing being discussed in the top half of the frame, the creator at a desk in the bottom half, captions on the seam between them. The creator's name is not used in the style or in this repository.

## The corpus

- Snapshot 2026-11-18 of the creator's 90 newest reels. The newest 40 were triaged by format: 30 use the split-screen format and are the corpus; the other 10 (a podcast clip, a vlog, two montages, an interview, a whiteboard explainer, a documentary, a full-frame talk, event footage, an ad) were left out by the owner's instruction. The 50 older reels show the same split with an earlier caption treatment and were not studied.
- 30 clips, `clip01` (2026-03-11) to `clip30` (2026-11-15), 2,197.6 s, median 72.5 s. 25 at 1080 x 1920 23.976 fps, 3 at 24 fps, 2 at 720 x 1280 (used for counts, not for pixel geometry).
- Rights unknown. The media, frames, audio and evidence files stay in a private, git-ignored study folder. Nothing from them is in this pack: the fonts are open (SIL OFL 1.1), the music and the swell are synthesised by `dev/make-audio.mjs`, and the style draws no third-party mark (logos come from the user's project at edit time).

## The study

Nine analysts, one per dimension, each working without reading the others, then an explanation pass over the footage and every editor-built unit, then an independent verification pass that re-measured 19 quantities from scratch on every frame of all 30 clips.

| Note | What it covers | Rules |
|---|---|---|
| [layout.md](layout.md) | layout modes and their shares, the seam, fitting footage into the top half, caption and title positions | L01-L24 |
| [type.md](type.md) | the pixel caption (font match, size, grouping, timing, plate and shadow), the headline face, the big word | T01-T24 |
| [hook.md](hook.md) | frame 0, the headline template and its timing, the brand mark on the seam, endings | H01-H28 |
| [graphics.md](graphics.md) | 709 footage units by kind and origin, 1,262 clauses coded against what was on screen, holds, density | G01-G28 |
| [explain.md](explain.md) | how footage acts the sentence out: cut points, in-points, the idea-to-footage table | X01-X26 |
| [motion.md](motion.md) | hard cuts everywhere, the headline slide curves, the face push-in, what never moves | M01-M23 |
| [structure.md](structure.md) | 1,207 cuts, two clocks (footage and layout), alignment with speech, pauses, beats | S01-S26 |
| [colour.md](colour.md) | caption and title colours, plates, the presenter grade, footage left as found | C01-C25 |
| [audio.md](audio.md) | loudness, the voice, the music bed, the few effects | A01-A27 |
| [presenter.md](presenter.md) | framing in the split and full frame, the push-in, what raw footage a new speaker needs | P01-P26 |
| [verification.md](verification.md) | the 19 re-measured quantities and their verdicts | - |

## Decisions

- **Target**: the split format only (owner, 2026-11-18), and its current treatment (2026-03 to 2026-11): pixel captions on the seam, a heavy extended headline. Within the corpus the later half cuts a little faster and uses more full-frame footage (S26); the pack follows the whole corpus, with the later numbers where they differ.
- **Left out**: the presenter-in-a-circle layout and the moving seam (mostly March to May, rare since June: G28, L19-L22), info cards and comparison cards (2 % of runtime, 1 to 3 clips each: X18-X20), coloured caption plates and coloured emphasis words (early clips), the sub whooshes (17 on 1,207 cuts: A23). Each could be added as its own element later.
- **Substitutions**: the reference caption face is an unidentified pixel monospace; Monocraft SemiBold (OFL) has the same 5 x 7 grid and 6-unit advance (T01; overlay IoU 0.44 against 0.26 for Departure Mono). The headline face is an unidentified heavy extended grotesque; Archivo at width 125, weight 900 (OFL) matches with +0.05 em tracking (verification). The serif is Instrument Serif Italic, a low-confidence stand-in (T16).
- **Presenter framing**: the reference speaker's face is 172 px wide in the split with the room around them (P05). The owner asked for a tighter split (2026-11-18): the pack frames the face about 330 px wide, eyes 330 px under the seam, from the engine's wide view enlarged at most 1.5x (P25).
- **Captions over the face**: the reference keeps the caption on the seam line even over the full-frame face (L15), on the speaker's mouth. The owner moved it to the chest, y 1440 (2026-11-18).
- **No grade**: the reference grades its speaker low key and warm (C15-C19). The pack applies no grade to any layer (owner, 2026-11-18): every video shows the speaker as recorded.

## Where each token comes from

`src/tokens.js` names the rule beside every number. "verified" there means the number in `verification.md`, which wins where it differs from an analyst's.

## What a person still has to check

- Listen to both beds and the swell in a full render on headphones and a phone (audio.md, "For a person to check").
- Watch the headline slide and the face push-in at speed against the reference.
