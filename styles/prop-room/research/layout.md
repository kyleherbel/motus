# Layout

Measured: All 19 in-style clips (clip01-clip19, 29 Oct to 12 Nov 2026): 20,881 frames, 696.7 s at 29.97 fps (2997/100). Every frame was decoded (VP9 to yuv420p through a pipe, explicit BT.709 limited-to-full matrix; the white caption fill reads Y 235 -> 255,255,255 in 38 frames, ffmpeg's default rgb24 reads 253). Layout modes were classified at 2 samples per second (1,402 samples, every 15th frame) from Apple Vision face rectangles plus a per-frame seam signature; every sample was checked by eye on labelled sheets (6 corrections, all faces inside pictures), one sample was added for the only shot that held none (a 12-frame presenter insert), and each of the 277 mode changes was placed on its exact frame from the frame-to-frame luma change. Seam geometry was measured on every SPLIT frame (7,630) from full-resolution row means; caption, keyword and graphic-content slots on full-resolution decodes of the 1,402 samples. Four modes cover the runtime: SPLIT (panel over the presenter, 36.5 %), FULL (illustration plate or full-bleed picture, no presenter, 50.4 %), PRESENTER (presenter full frame at about 1.9x, 4.4 %) and CLOSE (closing presenter run with caption and quoted keyword, 8.6 %). Every change between them is a one-frame cut.

Not done: No listening and no motion curves. Glyph baselines were taken from line boxes (the lowest ink row of lines without descenders); the verifier fitted the alphabetic baseline separately. Graphic content boxes come from a plate-fit heuristic and are approximate. Text inside illustrations was not measured as its own safe area.

Evidence is cited as `clipNN@frame` (frames at 29.97 fps, counted from 0; ids are this style's own). File names in Evidence lines name files of the local study; they are not shipped. "Verified" lines give the independent verifier's verdict and final value; item numbers refer to [verification.md](verification.md).

## Rules

### [L01] Build every video from exactly four full-frame layout modes: SPLIT (panel over presenter), FULL (illustration plate, no presenter), PRESENTER (presenter full frame) and CLOSE (closing presenter with caption + quoted keyword); allocate runtime about 36.5 / 50.4 / 4.4 / 8.6 %.

- Values: SPLIT 7,630 frames (254.6 s, 36.5 %), FULL 10,525 frames (351.2 s, 50.4 %), PRESENTER 921 frames (30.7 s, 4.4 %), CLOSE 1,805 frames (60.2 s, 8.6 %) of 20,881 frames at 29.97 fps. Clips using: SPLIT 19, FULL 19, CLOSE 19, PRESENTER 18 (none in clip15). Per clip: SPLIT 0.29..0.43, FULL 0.42..0.57, PRESENTER 0..0.09, CLOSE 0.06..0.12.
- Evidence: n=19 clips, 1,403 labelled samples checked by eye; L_mode_timeline.png, L_mode_runs.csv, L_mode_samples.csv, L_mode_sheets/clip01..clip19.jpg; examples clip01@0 SPLIT, clip01@180 FULL, clip01@600 PRESENTER, clip01@1170 CLOSE (L_layout_modes_annotated.png).
- Confidence: high
- Verified, confirmed (verification item 7): one run table over 20,881 frames at 29.97 fps: FULL 50.4 % (121 runs, median 84 frames), SPLIT 36.5 % (124 runs, 58), PRESENTER 4.4 % (32 runs, 27.5), CLOSE 8.6 % (19 runs, 92); 277 layout changes, interval median 62 frames (p10 29, p90 114). The verifier's run table equals this note's frame for frame in 19 of 19 clips.

### [L02] Change modes only with a hard cut on a single frame: the new layout is complete on its first frame. Never animate the seam, slide the panel, wipe or crossfade between modes.

- Values: 277 of 277 mode changes are one-frame cuts: 251 pass the ratio test (frame-to-frame luma change at the cut >= 3x every other frame within +-8 frames), the other 26 were checked on every-frame strips and are cuts followed by props animating in. Animated reflows found: 0.
- Evidence: n=277 changes in 19 clips; L_transitions.csv, L_transition_strips_check_00..02.jpg (e.g. clip09@48 SPLIT->FULL, clip10@149, clip16@1212, clip18@1086).
- Confidence: high
- Verified, confirmed in kind (item 7): 320 strict picture cuts (mean |dY| >= 20 and >= 3x both neighbours), 51 of them inside a layout run; 8 of the 277 layout changes have no strict cut because the frame dims first and the card follows (e.g. clip11@344-345).

### [L03] Hold each SPLIT run about 58 frames (1.9 s), each FULL run about 84 frames (2.8 s), each PRESENTER insert about 28 frames (0.9 s) and the CLOSE run about 92 frames (3.1 s).

- Values: Frames at 29.97 fps, median (p10..p90, min..max): SPLIT 58 (33..92, 16..147), n=124 runs; FULL 84 (41..139, 22..237), n=121; PRESENTER 27.5 (18..40, 12..51), n=32; CLOSE 92 (76..122, 66..138), n=19. Seconds: SPLIT 1.94 (1.11..3.06), FULL 2.80 (1.37..4.64), PRESENTER 0.92 (0.61..1.33), CLOSE 3.07 (2.53..4.06). Runs per clip 13..20 (median 16); 0.39 mode changes per second (0.32..0.52).
- Evidence: n=19 clips; L_mode_runs.csv, numbers.json modes.
- Confidence: high

### [L04] Open on SPLIT at frame 0 for about 53 frames, cut to FULL as the second run, then alternate SPLIT and FULL with a FULL run starting about every 141 frames (4.7 s); end on CLOSE, entered by a cut from FULL or SPLIT.

- Values: Frame 0 = SPLIT in 19/19; opening SPLIT run 38..80 frames (median 53 = 1.77 s); second run FULL in 19/19 (first FULL frame median 53). Changes by pair: SPLIT>FULL 103, FULL>SPLIT 91, FULL>PRESENTER 19, PRESENTER>FULL 18, PRESENTER>SPLIT 14, SPLIT>PRESENTER 13, FULL>CLOSE 11, SPLIT>CLOSE 8. FULL start-to-start interval median 141 frames (p10 92, p90 208) = 4.7 s (3.1..6.9 s), n=102. CLOSE is always the last run (19/19).
- Evidence: n=19 clips; L_mode_timeline.png, L_mode_runs.csv.
- Confidence: high

### [L05] In SPLIT draw the panel as a full-width rectangle from y 0 to the seam at y 960 and the presenter footage from 960 to 1920 (current generation).

- Values: Sub-pixel seam (coverage model on every SPLIT frame): generation B median 959.52 px (959.00..959.68 across 16 clips; clip19 959.00); panel rows 0..958 fully covered, row 959 about half covered (0.45..0.68). Panel rect [0,0,1080,960], presenter rect [0,960,1080,1920].
- Evidence: n=16 clips (clip04..clip19), 6,251 SPLIT frames; L_seam_profile.csv, numbers.json seam.by_clip; e.g. clip15@30, clip09@682.
- Confidence: high
- Verified, confirmed (item 6): panel bottom edge median 959.60 in clip04-19 (per clip 959.04-959.76), stable within clips (p10-p90 span <= 0.5 px except clip17, 958.05-959.65). Build value: panel height 960.

### [L06] Treat the seam position as the only layout geometry that changed over the corpus period: 956.6 px in the first three clips (2026-10-29..31), 959.5 px from 2026-11-02 on; use 960 for new work.

- Values: Generation A: clip01 956.68, clip02 956.62, clip03 956.60 (edge row 956, rows 0..955 full). Generation B: 16 clips 959.00..959.68 (median 959.52). Shift 2.9 px. Caption rows (L14, L15), mode shares (L23) and caption centre did not change between generations.
- Evidence: n=3 clips (1,379 SPLIT frames) vs 16 clips (6,251 SPLIT frames); L_seam_profile.csv, numbers.json seam.generation_A / generation_B.
- Confidence: high
- Verified, confirmed (item 6): clip01-03 956.68 (all three), clip04-19 959.60. The motion note's 'about 958' ([M26]) is a 4-px-bin artefact.

### [L07] Make the seam a hard edge: one anti-aliased row, no feather, no stroke, no drop shadow, straight across the full width with square ends (no corner radius).

- Values: Panel coverage falls from 1 to 0 within one row: edge row 0.45..0.68 and the next row 0.00..0.01 in 18 clips; in clip19 the seam (959.05) lands on a row boundary (row 958 0.94, row 959 0.12). Sub-pixel seam per 20-px column block constant across the width (first block x0..19 and last block x1060..1079 equal the middle within 0.3 px) in 57 frames. Footage row profile below the seam changes by at most 1.8 levels over the first 20 rows, with no darkening toward the seam, in the 5 clips checked (no cast shadow).
- Evidence: n=19 clips, 57 full-resolution frames (3 per clip); L_seam_corners_8x.png (clip01@517, clip09@682, clip15@30, both ends enlarged 8x), L_seam_straightness.csv, L_seam_profile.csv.
- Confidence: high

### [L08] Do not draw a hairline on the seam row: the edge row is not consistently lighter than the plain mix of panel and footage.

- Values: Edge row minus the coverage mix of panel and footage (verification, every SPLIT frame with flat sides): median +2.0 levels (p10 -5.7, p90 +16.2), more than 2 levels in 8 of 19 clips. A lighter edge row shows only where panel and footage are both dark (e.g. clip15@525: rows 958/959/960 = 101/115/103).
- Evidence: n=19 clips, all SPLIT frames with flat sides; L_seam_profile.csv (column extra_line_levels), L_seam_corners_8x.png.
- Confidence: low: small (under 2 % of full scale), could be a compression or compositing artefact rather than a designed line
- Verified, corrected (item 18): not reproduced as a consistent feature. The study's rule was 'optionally leave a faint light hairline on the seam row, about 10 luma code values lighter than the plain mix', from a fitted extra level of median +10.2 Y (range -6.5..+16.6), positive in 16 of 19 clips.

### [L09] Clip the presenter footage at the seam: the head never overlaps the panel; when the cap or hair reaches the seam it is cut by the straight edge and the caption plate sits over the cut.

- Values: Vision face-box top in SPLIT: median 1181, p5 1126, min 1068 (clip19@270); at the 4 highest heads the cap/hair is cut by the straight seam with panel pixels directly above. Seam signature present at the clip's seam row in 7,588 of 7,630 SPLIT frames.
- Evidence: by eye on 4 frames from 3 clips (clip19@270, clip19@15, clip11@45, clip06@30): L_seam_head_cut_clip19-270_clip19-15_clip11-45_clip06-30.png; numeric straightness in L_seam_straightness.csv.
- Confidence: medium: the overlap test is by eye on the 4 most exposed frames; the caption plate covers the head in most other frames

### [L10] Let the panel bleed to the frame edges: no margin, frame, border or rounded corners on the left, right or top; the illustration plate starts at x 0, x 1079 and y 0.

- Values: Mean luma of the outermost 4 columns / top 4 rows minus the next 8: left median -0.02, right 0.00, top 0.00 levels; |offset| p90 1.1 levels over 57 frames (a stroke or frame would give a constant offset of tens of levels).
- Evidence: n=57 frames, 3 per clip, 19 clips; numbers.json seam.panel_edge_offsets_levels, seam.straightness.per_frame; L_seam_corners_8x.png.
- Confidence: high

### [L11] Keep the panel height fixed for the whole clip whatever the content: the seam never moves within a clip and never animates.

- Values: Seam signature at the clip's row on 7,588 of 7,630 SPLIT frames (99.4 %); of 5,997 SPLIT frames with a measurable sub-pixel step, 5,816 (97.0 %) are within +-1 px of the clip value; the rest were stronger content edges nearby (e.g. clip06@31, clip09@369) with the seam still present at its row.
- Evidence: n=19 clips, every SPLIT frame; seam_frames.csv summarised in numbers.json seam.seam_frames_within_1px, classification.seam_evidence_per_frame.
- Confidence: high

### [L12] In FULL cover the whole 1080x1920 frame with the illustration plate (or a full-bleed picture) and show no presenter; about 93 % of FULL time is props or interface on a plate, about 7 % a full-bleed picture.

- Values: FULL samples with no presenter face: 695 of 695 after the by-eye pass (faces seen in FULL belong to pictures). Content coverage >= 0.75 of the frame (full-bleed picture or scene): 50 of 695 samples (7.2 %); SPLIT panels filled edge to edge: 25 of 520 (4.8 %).
- Evidence: n=19 clips; L_content_boxes.csv, L_content_boxes_sample.jpg, L_mode_sheets/*.jpg (e.g. clip16@240-315 full-bleed video frames, clip04@60-165 full illustrated scene, clip13@45-120 props on a pale plate).
- Confidence: medium: the full-bleed share depends on the plate-fit content detector

### [L13] In PRESENTER and CLOSE fill the frame with the presenter footage at about 1.9x the SPLIT scale; PRESENTER and CLOSE share the same framing.

- Values: Vision face-box width median: SPLIT 345 px (p10 320, p90 373, n=520), PRESENTER 656 (620..693, n=67), CLOSE 653 (614..692, n=121); per-clip ratio full/split 1.81..2.03 (median 1.91 CLOSE, 1.93 PRESENTER). Face-box centre x: SPLIT 529, PRESENTER 540, CLOSE 544.
- Evidence: n=19 clips; L_mode_samples.csv (faces column); examples clip01@600, clip01@1170. Detailed face metrics belong to the presenter analyst.
- Confidence: high
- Verified, confirmed (item 8): every presenter number reproduces within 3 px; full-height zoom 1.915 by eye-distance ratio and by registration on the room (per clip 1.82-1.96, noisy).

### [L14] In SPLIT place the caption line on the seam, centred on x 540: cap top y 921, baseline y 975. The plate hugs the ink: its top is at y 905.2 for lines with ascenders and 12.4 px lower for x-height-only lines; it is 84.9 px tall (101.8 with a descender).

- Values: Cap-top row mode 921 (302 of 516 detected samples; 920..925 for 398), lowest-ink row mode 975/976 (no descender) and 992 (descender); same rows in generation A (n=95) and B (n=421). Plate (verification, 174 seam-slot crops and 234 low-slot plates): top 905.19 on ascender lines; x-height-only lines 12.4 px lower; height 84.86 (p10-p90 84.8-86.0) without a descender, 101.8 with; pads to the white-ink box left 15.65, top 15.8, right 13.3, bottom 14.0; corner radius 18.25.
- Evidence: n=516 SPLIT samples in 19 clips; L_caption_slots.csv, L_caption_captop_hist.png, L_layout_modes_annotated.png (clip01@0, clip15@30).
- Confidence: high
- Verified, confirmed for the baseline (item 3: fitted alphabetic baseline 975; the type note's 973 is 2 px high); corrected for the plate (item 2). The study read the plate as fixed rows from y 908 to 987 (1003/1004 with a descender), top = cap top - 13 and bottom = lowest ink + 11 (modes, n=327), and missed that x-height-only lines get a shorter plate.

### [L15] In FULL, PRESENTER and CLOSE place the caption line at cap top y 1222, baseline y 1276, centred on x 540; the plate hugs the ink (top 1206.2 on ascender lines, 1218.6 on x-height-only lines; bottom about 1291, 1308 with a descender). The caption jumps 301 px at every cut into or out of SPLIT.

- Values: Cap-top mode 1222 in FULL (389 of 688), PRESENTER (33 of 66) and CLOSE (49 of 121), 1221..1226 for most of the rest; lowest-ink modes 1276/1277 and 1293. Verification (36 lines, 19 clips): fitted alphabetic baseline 1275.5-1275.75 (median 1275.62), build 1276; plate top 1206.18 on ascender lines, 1218.6 on x-height-only lines; slots 301.0 px apart.
- Evidence: n=875 samples in 19 clips; L_caption_slots.csv, L_caption_captop_hist.png.
- Confidence: high
- Verified, confirmed for the baseline (item 3); corrected for the plate (item 2). The study read plate y 1209..1288 (1304 with a descender), plate top mode 1209 in FULL, padding 13 px top and 11 px below the ink, as fixed rows.

### [L16] Choose the caption slot from the mode alone (SPLIT -> seam row, anything else -> row 1222), never from the illustration's content or size.

- Values: Of 1,391 samples with a detected caption, 1,385 sit in their mode's slot (+-14 px) and 3 more do by eye (clip16@1200, clip17@660, @675: detector picked panel text); exception: clip16@424-479, a FULL run over a full-bleed photo with a clapperboard, keeps the SPLIT row (cap top 921), 3 samples. 11 samples had no detected caption; the 4 inspected (clip09@915, clip11@405, clip12@660, clip17@630) show one in the usual slot.
- Evidence: n=1,402 samples; recheck_captions.json summarised in numbers.json captions.recheck; L_mode_sheets/clip16.jpg (frames 435-465); check_nocap.jpg.
- Confidence: high

### [L17] Centre the caption plate on x 540 with about 15 px side padding and keep it at least 166 px from each side edge (plate width up to about 750 px).

- Values: Plate centre x median 539 (p5..p95 529..548); padding left 16, right 14..15 px (median); plate width median 375 (p95 521, max 748: clip05@960 plate x 166..914, text 182..900; clip16@60-90 plate 170..908; one misread of 756 at clip16@75 where a heart graphic sits beside the plate). n=1,197 captions with both plate edges measurable.
- Evidence: n=19 clips; L_caption_slots.csv, L_caption_widest6.png (row 1 clip17@615 is a false merge with panel text and is excluded).
- Confidence: high
- Verified, confirmed (item 2): plate centre x 539.0; pads to the white-ink box left 15.65, right 13.3 (the right pad is about 2 px smaller, on the shadow side).

### [L18] In CLOSE stack a single quoted keyword under the caption line, centred on x 540 (ink centre 537 with the quotes), cap top near y 1324 and letter baseline near y 1448.5, no wider than about 700 px.

- Values: Per clip (17 clips where found; last sample of each run): centre x median 540; centre y median 1388 (1368..1404); top (with the opening quote) median 1322; width 288..703 by word length; x 191..894 at the extremes. Verification (all 19 clips): cap top 1324 (1313-1337), letter baseline 1448.5 (1423-1474), cap height 126.5 px (109-140), ink centre x 537 including the quotes; width including the quotes = 373 + 73.5 x letters (r 0.88). Gap from caption baseline 1276 to keyword top about 46 px.
- Evidence: n=17 clips (not found in clip02, clip18), 67 samples; L_keyword_slots.csv, numbers.json keyword.by_clip; e.g. clip01@1170, clip07@990, clip19@1185.
- Confidence: high
- Verified, confirmed within the measurement error (item 5). The study's baseline, median 1451 (1425..1477), is a line-box bottom; its glyph height was median 124.5 px (109..140).

### [L19] Keep caption and keyword text inside x 166..914 and inside the bands y 908..1004 (SPLIT) and y 1209..1482 (other modes); no caption-type text appears above y 908 or below y 1482.

- Values: Caption plate x 166..914 (n=1,197); caption plates y 908..1004 (SPLIT) and 1209..1304 (FULL/PRESENTER/CLOSE); keyword x 191..894, y 1295..1482 (n=67; 1482 in two samples where a mark below merged, baselines otherwise 1425..1477). Nearest approach to the edges: left 166, right 166, top 908, bottom 1920-1482 = 438 px. Text inside illustrations is not covered by this rule (not measured separately).
- Evidence: n=19 clips; L_caption_slots.csv, L_keyword_slots.csv.
- Confidence: high

### [L20] In SPLIT centre the graphic in the panel around (544, 558) and let its size grow symmetrically about that centre; wide graphics keep 64..72 px side margins.

- Values: Largest content component of 248 SPLIT samples not touching an edge: centre x median 544 (p25..p75 532..546), centre y median 558 (IQR 462..598); centre y vs height slope 0.11 (r 0.16) = centre-anchored; width median 846 (p90 944), height median 518 (p90 684); left margin p10/p25 72/76, right 64/72; median box over all 494 on-plate samples x 80..1008, y 232..922.
- Evidence: n=520 SPLIT samples, 19 clips; L_content_boxes.csv, L_content_centre_vs_height.png, L_content_boxes_sample.jpg (24 boxes checked by eye).
- Confidence: medium: content boxes come from a plate-fit heuristic (pale cards on pale plates are partly missed, shadows are included)

### [L21] In FULL centre the graphic around (544, 774), about 186 px above the frame centre, growing symmetrically with its height; it usually ends above the caption plate (y 1209) and may touch it.

- Values: 304 interior FULL boxes: centre y median 774 (IQR 692..852), slope vs height 0.03 (r 0.06); top median 434, bottom median 1180 (p75 1244, p90 1299); width median 896 (p90 952); left margin p10/p25 65/72, right 52/64; median box over 645 on-plate samples x 72..1020, y 308..1256.
- Evidence: n=695 FULL samples, 19 clips; L_content_boxes.csv, L_content_centre_vs_height.png, L_layout_modes_annotated.png.
- Confidence: medium: same heuristic as L20

### [L22] Use one centre axis at x 540 for every slot (caption, keyword, graphics); graphics may span up to about 952 px (64 px margins) and may bleed to the edges when they are pictures.

- Values: Caption text centre x median 540 (n=1,388), keyword 540 (n=17 clips), graphic centre x 544 (SPLIT) and 544 (FULL); widest centred graphics 944..952 px; full-bleed content 4.8 % of SPLIT and 7.2 % of FULL samples.
- Evidence: n=19 clips; L_caption_slots.csv, L_keyword_slots.csv, L_content_boxes.csv.
- Confidence: high

### [L23] Apply the same mode mix to every video; it did not drift over the corpus period.

- Values: Generation A (3 clips, 10-29..31) vs B (16 clips, 11-02..12) medians: SPLIT 0.40 / 0.36, FULL 0.50 / 0.51, PRESENTER 0.03 / 0.04, CLOSE 0.07 / 0.09. No monotonic trend by date in any share (per-clip values in numbers.json per_clip).
- Evidence: n=19 clips; L_mode_timeline.png, numbers.json per_clip.
- Confidence: high

### [L24] Insert PRESENTER runs sparingly and briefly between SPLIT and FULL runs (0..3 per clip), never as the first or last run.

- Values: 32 PRESENTER runs in 18 clips (clip15 has none; max 3 in clip07, clip12, clip13); 12..51 frames; entered from FULL 19 times and from SPLIT 13 times, left to FULL 18 and SPLIT 14; first run is never PRESENTER (19/19 SPLIT) and the last is always CLOSE.
- Evidence: n=19 clips; L_mode_runs.csv; shortest run clip07@588-599 (12 frames, found by the shot pass, s2x/clip07/f0593.jpg).
- Confidence: high

### [L25] Do not use any other layout: no picture-in-picture presenter, no panel below the presenter, no side-by-side split, no letterbox, no second seam position within a clip, no two caption lines at once.

- Values: 0 occurrences in 1,403 labelled samples viewed by eye and 7,630 SPLIT frames measured; the only seam rows found are 956.6 and 959.0..959.7.
- Evidence: n=19 clips; L_mode_sheets/*.jpg, L_seam_profile.csv.
- Confidence: high

### [L26] Treat these as one-off variants, not part of the template: a frosted translucent FULL plate over blurred presenter footage, camera-viewfinder corner marks over a PRESENTER run, and a FULL run that keeps the SPLIT caption row.

- Values: clip15@413-511 (99 frames) frosted FULL plate (the shirt print shows through near y 1500..1600; not seen in 12 other FULL frames high-passed); clip12@507-557 (51 frames) viewfinder corner marks on PRESENTER; clip16@424-479 (56 frames) caption at the SPLIT row on a full-bleed photo.
- Evidence: each seen once (by eye): L_mode_sheets/clip15.jpg, clip12.jpg, clip16.jpg; clip15_0450.jpg, ghost_check.jpg.
- Confidence: low: each seen once

## Constant and variable

CONSTANT (every clip, to the frame or pixel): the four modes; mode changes are one-frame cuts (277/277); frame 0 is SPLIT and the second run is FULL (19/19); CLOSE is the last run (19/19); the SPLIT panel is a full-width, full-bleed rectangle from y 0 to the seam with a hard one-row edge, no radius, stroke, margin or shadow; the seam row is fixed within a clip (959.5 in generation B, 956.6 in generation A); the presenter is clipped at the seam; the caption rows (SPLIT cap top 921 / baseline 975, other modes 1222 / 1276) and the caption centre x 540 in both generations; PRESENTER and CLOSE share the same full-frame framing (about 1.9x SPLIT). VARIABLE: run lengths (SPLIT 33..92 frames p10..p90, FULL 41..139, PRESENTER 18..40, CLOSE 76..122), driven by the script; the order of runs after the second (SPLIT<->FULL alternation with 0..3 PRESENTER inserts); which mode precedes CLOSE (FULL 11, SPLIT 8); caption plate width (median 375, up to 748 px) from the words; keyword width (288..703 px) from the word and its glyph height (109..140 px) per clip; the graphic's size (centre-anchored, x 544, y 558 in SPLIT / 774 in FULL); full-bleed pictures in about 5..7 % of samples. OVER TIME: the seam moved from 956.6 (clip01..clip03, 2026-10-29..31, n=3) to 959.5 (clip04..clip19, 2026-11-02..12, n=16); nothing else in the layout changed.

Verification changed two of these: the caption plate hugs the ink instead of sitting on fixed rows ([L14], [L15]), and there is no seam hairline ([L08]).

## Open questions

- Why the seam sits at 959.5 rather than 960 and moved by 2.9 px after 2026-10-31 (probably a template re-scale). Decide from the editor's project file or an export at another resolution; the builder should use 960. Verification: 959.60 and 956.68 ([L05], [L06]).
- Settled by verification: there is no consistent hairline on the seam row (median +2.0 levels; [L08]).
- The closing keyword's size varies by clip (glyph height 109..140 px, not fitted to a fixed width). Whether the editor scales it per word could not be decided from 17 keywords; the type analyst's font fit may settle it. Verification: cap height = 158 - 6.1 x letters, loose (r -0.69); open for the owner ([T21]).
- Settled by verification: the plate hugs the ink, and x-height-only lines get a 12.4 px shorter plate ([L14], [L15]).
- Content boxes (L20, L21) are approximate (pale-on-pale cards, shadows). A per-element mask from the graphics analyst's inventory would give exact margins.
- Text inside illustrations (headlines, UI labels) was not measured as its own safe area; only captions and the keyword were.
- The keyword was not detected in clip02 and clip18 (thin glyph shadows or partial white); its position there is assumed to follow the other 17 clips.

Needs an eye or an ear:

- Confirm the 6 by-eye classification corrections (faces inside pictures read as the presenter): clip16@180, @825, @900, @1215, @1245 and clip19@180, @255 in L_mode_sheets/clip16.jpg and clip19.jpg.
- Watch the cuts at speed in a few places (clip09@48, clip10@149, clip18@1086, L_transition_strips_check_00..02.jpg): they are one-frame cuts on the stills, but a person should confirm there is no motion smear or flash on the cut frame.
- Watch clip15@413-511: the FULL plate looks frosted over blurred presenter footage (clip15_0450.jpg); decide whether it is a deliberate variant or an editing slip.
- Look at clip12@507-557 (viewfinder corner marks over the presenter) and clip16@424-479 (caption at the SPLIT row over a full-bleed photo).
- Look at L_seam_corners_8x.png and decide whether the light hairline on the seam is worth reproducing (settled by verification: no hairline, [L08]).
- Look at L_content_boxes_sample.jpg to judge how far the content-box numbers (L20, L21) can be trusted.
