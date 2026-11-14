# Layout

Measured on all 32 in-style clips (2880.6 s, 70,005 frames at native 23.976/24/25/30 fps). Every frame was decoded with a calibrated BT.709 limited-to-full decode (white glyph interiors read 252-255, p95 255) and classified into full-frame modes by tracking the presenter-panel border (first sustained departure from the field level, per row and column); full vs b-roll was split by thumbnail correlation plus a by-eye review of 9 low-correlation runs. Shares are given by frames and by 2 samples per second (5,777 samples). Captions, title band and graphic boxes were measured at full resolution on the 2-per-second samples; the panel rectangle was fitted sub-pixel on 24 split frames per clip.

The grammar is two modes cut against each other: split (a dark or light graphic field over a 938-px-wide rounded presenter panel at x 70.5-1008.5 from y 1407.5 that bleeds off the bottom, radius 42.5 on the top corners only) holds 68.2% of runtime, and full-bleed presenter cut-ins hold 29.8% (about 5 per minute, 3.1 s each). Every one of 498 mode changes is a single-frame cut. The caption is one centred line whose baseline sits at 1305 in the most common template (per-clip 1256-1323), about 107 px above the panel top and 36 px above the presenter's head, which overflows the panel top by about 74 px; in full mode the caption usually keeps that baseline and grows about 1.22x. Graphics live in x 83-1012, y 151-1205, centred near y 750, with height set by content type. A field-only mode (no panel) and full-bleed b-roll are rare (2 clips each).

Panel rectangles fall into three recurring templates that differ by 1-6 px and appear throughout 2026-10-10..2026-11-11, so there is no geometry generation; what changes over time is the light field (1/12 clips before 2026-10-21, 10/20 after) and a light-field opening (0/12 vs 7/20). Nothing was listened to; playback was not watched; animation curves beyond cut/no-cut were not fitted.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [L01] Use four full-frame modes: split (graphic field over a bottom presenter panel), full (full-bleed presenter), field (field fills the frame, no panel) and broll (full-bleed non-presenter footage); split is the default and full is the only frequent alternative.

- Values: Share of runtime by frames (2880.6 s, every frame): split 68.2% (dark 61.8%, light 6.4%, cross-fade 0.02%), full 29.8%, field 1.6%, broll 0.4%. 2-per-second samples (n=5777) agree within 0.1 pt. Clips using each: split 32/32, full 32/32, field 2/32, broll 2/32.
- Evidence: All 32 in-style clips, every frame classified from panel-border tracking + by-eye review of 9 low-correlation runs.
- Confidence: high

### [L02] In split mode stack the slots top to bottom as: title band, graphic slot, one caption line, presenter panel; all are centred on x=540.

- Values: Centres: panel 539.5 (per-clip 537.5-543.5, n=32), caption 540 (per-clip 539.0-540.75, n=32), title red bar 539.5 (p10 537, p90 543, n=980 samples), largest graphic element 540 (p10 366, p90 666, n=3532). Vertical order: title first-line cap top y 169 median -> graphic centre y 748 -> caption baseline 1303 -> panel top 1407.5.
- Evidence: n=32 clips, 3931 split samples. (clip40@96)
- Confidence: high

### [L03] Draw the presenter panel as a rounded rectangle left 70.5, top 1407.5, right 1008.5 (width 938) that runs off the bottom of the frame; keep it fixed for the whole video.

- Values: Most common rect (group P1, 8 clips): 70.51 / 1407.48 / 1008.56, radius 42.5. Across clips: left median 70.5 (64.6-76.1), top 1407.5 (1400.2-1454.3), right 1009.5 (1001.1-1013.3), width 938.1 (927.1-947.6). Within a clip p10-p90 spread <= 0.3 px on every edge in 31/32 clips. Groups: P1 8 clips, P2 7 (68.3/1404.1/1010.8 r46.8), P3 7 (71.6/1409.5/1009.5 r42.9), P4 2 (64.6/1416.8/1012.1 r46.1), 8 singletons.
- Evidence: 24 split frames per clip x 32 clips, sub-pixel edge fit (first departure from field + gradient peak). e.g. clip40@all, clip31@3-121.
- Confidence: high
- Verified, corrected: CSS edge coordinates (pixel i spans [i,i+1]). Template B (8 clips: 06,07,09,10,12,17,35,40; 255 fitted frames): left 70.97 (clip medians 70.96-71.00), top 1407.96 (1407.94-1407.99), right 1009.01 (1009.00-1009.03), width 938.0, corner radius 42.3 (constrained circle fit, clip medians 42.0-43.1; free fit 41.7-42.9; residual rms 0.1-0.3 px). Most common in G2 is NOT B: G2 uses 4 rectangles plus one-offs. Template D (clips 31,39 on dark field: left 68.8, top 1404.6, right 1011.2, width 942.4, radius 46.5 [46.4-46.8]; clips 24,25 on light field read 0.5 px wider: 68.3/1404.1/1011.7, radius 46.4-47.5; clip36 same sides, top 1400.7): 4 G2 clips (5 with clip36). Template C (72.0/1410.0/1010.0, radius 43.0, 1-px hairline 2 px outside the left edge): G2 clips 26,27,38 (3); G1 clips 03,05,13 (04 by left/top only). Template E (65.1/1417.3/1012.7, radius 46.3): clips 30,32. Template B in G2: clips 35,40 only. One-offs: clip28 71.4/1409.6/1008.3 r42; clip33 75.3/1407.2/1011.7 r~40; clip34 71.6/1406.4/1013.8 r~41; clip37 66.2/1407.2/1013.8 r~35; clip29 (grid field) ~76.7/~1406/~1011 not fitted; G1 one-offs clip02 66.7/1408.3/1010.8, clip08 74.4/1454.8/1001.6 r35. All-32: B is the most common (8 clips), D 8 clips incl. G1 01,15,19, C 7, E 2. The panel runs off the bottom of the frame (no bottom corners). L03 and P07 describe the same rectangle in two coordinate conventions: L03 uses pixel-centre indices (CSS edge - 0.5): 70.51/1407.48/1008.56 = CSS 71.01/1407.98/1009.06; P07 uses CSS edges. Both match my template B to within 0.05 px, and my B radius 42.3 sits between their 42.5 and 42. The builder drawing with CSS needs P07's convention: left 71px, top 1408px, width 938px, border-radius 42px, extending past the bottom. But the question asked for the most common template in G2, and that is template D (68.8/1404.6/1011.2, width 942.4, r 46.5, CSS); B appears in only 2 of 17 G2 clips. Evidence: and.json (per-clip edges, IQRs, radii).

### [L04] Round only the panel's two top corners (radius 42.5 px default); the panel has no bottom edge or bottom corners inside the frame.

- Values: Radius circle-fit per clip: median 42.6 (left) / 43.0 (right), range 29.9-47.2, fit RMS 0.16-0.91 px. Bottom rows y 1905-1919 are footage, not field, in 32/32 clips (deviation from field level 6.7-26 on dark fields, 203-209 on light fields).
- Evidence: n=32 clips x 24 frames. (radius_left/right, bottom_rows_dev_from_field_median)
- Confidence: high

### [L05] Keep the same panel rectangle in the dark and the light field variant.

- Values: Left and top border medians differ <= 2 px between dark and light split frames in all 7 clips that use both (clip03, 24, 26, 27, 34, 36, 37).
- Evidence: n=7 clips, 6,687 dark and 3,169 light split frames.; output
- Confidence: high

### [L06] Let the presenter cut-out rise above the panel top: head and cap overflow by about 74 px into the caption zone; nothing else crosses the panel top.

- Values: Overflow above panel top: median 73.5 px, p10 58.5, p90 103.6, max 399.9 (gesture), n=504 frames; 31/32 clips; clip31 has no overflow (head inside the panel).
- Evidence: 16 split frames per clip x 32 clips., (clip31 no overflow)
- Confidence: high
- Verified, confirmed (the other study's value): G2: median 78.0 px (p10 62.7, p90 107.1, min 39), n=544 frames, 17 clips. All-32: 78.0 px (p10 64.1, p90 109.0), n=1024 frames, 32 clips. Pixel method (non-field pixels connected to the panel top, any column): G2 76.0 (61, 107), all-32 76.0 (62, 110). By template: B 73.9 (p10 66.5, p90 81.0, n=256, head top y 1334); D 71.6 (59.1, 82.1, n=256); E 68.8 (n=64); C 102.0 (84.3, 116.0, n=224, head top y 1308). Clip medians range 59.1 (clip25) to 119.8 (clip02). P10's median and p10 match (78.0 vs 78.9; 64 vs 64.3); its p90 of 140 does not (mine 107-109) and probably includes raised hands or matte spill from graphics, which my head-column limit excludes (max outliers 733-1405 px are graphic people joined to the matte). L06's 73.5 equals my template-B value (73.9): the overflow depends on the template, because the head top stays near y 1308-1348 while the panel top moves. A builder should take the overflow from the template used: B about 74 px, D about 72, C about 102. Evidence: (per frame),.

### [L07] Place the split-mode caption baseline at y=1305 (about 103-107 px above the panel top) and keep it there for the whole video.

- Values: Per-clip split baseline: median 1303, p10 1270, p90 1305, range 1256-1323 (n=32 clips); exactly 1305 in 12/32 clips. Within a clip: max-min 0-1 px in 35 of 41 clip x field-variant groups, <= 6 px in all. Panel top minus baseline: median 107.1 px (p10 102.5, p90 141.4, range 80.5-149.6). Light field uses the same baseline as dark within 1 px in 6 of 7 mixed clips (clip36: 1282 dark vs 1272 light).
- Evidence: 3442 dark + 359 light split samples with a caption. e.g. clip40@96 baseline 1305, clip01@0-1368 baseline 1309.
- Confidence: high
- Verified, confirmed: Definition A, last pixel row with >=50% ink coverage of flat-bottom letters (per-clip mode over split caption events): all 32 clips median 1303.5, p10 1270.5, p90 1305, range 1257-1323, modal value 1305, exactly 1305 in 11/32 (clip26 sits at 1304 with edge 1305.0, so it is 12/32 if that clip counts). G2 (17) median 1303, p10 1267.6, p90 1305.4, range 1257-1323, exactly 1305 in 4/17 (clip30,32,35,40); clip26 1304, clip28 1306, clip31 1304, clip37 1303. Definition B, sub-pixel bottom edge of flat stems (CSS boundary coordinate): clips at row 1305 have edge 1305.8-1306.1 (median 1305.86); all-32 median 1304.1, G2 1303.4. Per clip (row; edge): 01 1310;1310.8, 02 1259*;1259.8, 03 1281/82;1282.4, 04 1275/74;1275.5, 05 1289/90;1290.4, 06-10,12,17 1305;1305.8-1305.9, 13 1277/78;1278.4, 15 1299;1299.8, 19 1297;1297.8, 24 1297;1297.8, 25 1323;1323.8, 26 1304;1305.0, 27 1281/82;1282.0, 28 1306;1306.6, 29 1257;1257.6, 30 1305;1305.9, 31 1304;1304.8, 32 1305;1305.9, 33 1270 (7 events only), 34 1264/65;1265.4, 35 1305;1305.9, 36 1283;1283.8, 37 1303;1303.4, 38 1280/81;1281.4, 39 1299;1299.8, 40 1305;1305.9. Fixed within a clip: yes in 30/32 (>=95% of split caption events within +-1 row of the clip mode; edge p10-p90 spread <=0.9 px). The 1-row alternation in clips 03,04,05,13,27,34,38 is a baseline near half a pixel (edge x.4-x.5), not movement. It moves in clip02 (1306 in frames 0-387, then 1257-1262 from frame 437), clip36 (G2: 1283, then 1272 in frames 1674-1793) and clip15 (1302 in frames 0-28, then 1299). L07 holds under the same definition (last >=50% row): median 1303.5 vs 1303, p10 1270.5 vs 1270, range 1257-1323 vs 1256-1323, 11 (or 12) clips at 1305. T05 sits 1-2 px lower. That fits a lower-threshold 'lowest ink' definition: round letters overshoot into row 1306 at alpha 0.6-0.7, and codec blur leaves a tail in row 1307 ). For a CSS builder: the flat-letter bottom edge, which is the CSS baseline coordinate, is y=1306 (the top edge of row 1306) in the 1305 family. So set the baseline at 1306 px from the top, which gives a last ink row of 1305. The value is not a corpus constant: G2 per-clip baselines span 1257-1323.,.

### [L08] Centre every caption on x=540 as a single line no wider than 743 px.

- Values: Caption box centre per clip 539.0-540.75 (all modes, n=32 clips). Width median 196 px (p95 375, max 743) in split; x extent 173..916 over 5,507 caption samples. Caption at the mode baseline present in 96.7% of dark-split, 97.3% light-split and 94.9% full samples.
- Evidence: n=32 clips, 5,507 caption samples.
- Confidence: high

### [L09] In full mode keep the caption on the split baseline by default and scale it up about 1.22x from the baseline.

- Values: Full-mode baseline equals the split baseline within 2 px in 19/32 clips (1304/1305 typical); in the other 13 it moves by -78..+50 px (range of full baselines 1184-1359). Ink height above baseline (p90 per clip): split 38-43 px, full 47-58 px; full/split ratio median 1.22 (1.14-1.49), n=30 clips; larger in all 30.
- Evidence: n=32 clips (1639 full and 3442 split caption samples). e.g. clip40@144 vs clip40@96 (same 1305 baseline), clip01 split 1309 / full 1359. (split_vs_full_pairs)
- Confidence: high
- Verified, confirmed: x-height ratio full/split per clip: median 1.21 (range 1.13-1.29) over 28 clips with clean full-height talking-head frames. Cap ratio: median 1.20 (range 1.14-1.35). G2 (14 clean): x ratio 1.21 (1.13-1.29), cap ratio 1.20. The ratio follows the split family: small-split clips 1.24-1.29, large-split clips 1.13-1.20. This is because the full-height caption is nearly one size: x-height median 36.45 px (35.7-38.4), cap 49.9 (48.6-51.2). Baseline: the sub-pixel edge is the same (|delta| <= 0.3 px) in 19/32 clips (19/28 clean). It differs in 9 clips: 01 +49.8, 15 -64.2, 19 +2.8, 24 -6.2, 25 -47.2, 31 +41.8, 36 -9.2, 37 -78.4, 39 +9.8. Clips 02, 29, 33 and 34 have mixed non-split layouts (B-roll, full-screen graphics, an emphasis size). G2: same baseline in 8/17 (26,27,28,30,32,35,38,40). L09 holds: ratio 1.21 vs 1.22, and the same baseline in 19/32 clips. Its upper bound of 1.49 matches only clip34, whose non-split set is contaminated by a larger emphasis size. T04/T05: the 1.19 ratio is the large-family value, inside my range. But an x-height of 38 px is the top of the range (median 36.5), and 'same baseline in both modes' fails in 13/32 clips (9 of the 17 G2). Builder: draw full-height captions at a fixed size (about cap 49.9 px, which is Inter 68.5 px by cap) rather than as a fixed ratio. Keep the split baseline only when the clip does.,.

### [L10] Keep the caption clear of the presenter overflow: the caption baseline sits about 36 px above the top of the head.

- Values: Gap from caption baseline to the overflow top: median 36 px, p10 24, min -145; overlap in 2/473 frames (0.4%).
- Evidence: n=473 frames with both a caption and an overflow measurement, 32 clips.
- Confidence: medium (overflow detector is a luma threshold on 16 frames per clip; z-order on overlap not seen)

### [L11] Put the title band at the top: first title line cap top at y about 169 (never above 115), centred; a red title bar, when used, starts near y 226 and is about 80 px tall.

- Values: First centred text line top in split samples: median 169, p10 135, p1 115, min 40 (n=3405). Red bar present in 980/3931 split samples (25%): top y median 226 (p10 148, p90 333), height median 80 (p10 58, p90 90), width median 614 (p10 458, p90 728), centre x 539.5. Text above the bar: bar top minus text top median 64 px (p10 40, p90 101, n=584).
- Evidence: n=32 clips, 3931 split samples. e.g. clip01@72 text 123-173 / bar 178-236; clip40@96.
- Confidence: medium (title detected as centred white/black text in y<760 and red-bar blobs; graphic headings are not separated from the title)
- Verified, confirmed: Cap top = sub-pixel top edge of flat-topped sans caps (Inter caps and l/h/k share one height); ink top = first row with >=50% ink of any glyph (i-dots, quotes, italic-serif ascenders), bar and underline excluded. ALL-32, one value per unique settled lockup (n=174 lockups, 32 clips): cap top median 173.1 px (p1 114.3, p10 136.6, p90 263.0, range 100.2-488.1); ink top 171.5 (p10 134.0, p90 257.8). Duration-weighted over 275 settled occurrences: cap top 167.1 (p1 119.0, p10 137.0, p90 262.6). OPENING titles (first lockup, starts <=2.5 s; n=27 clips): cap top 157.2 (p10 122.8, p90 189.8, range 116.6-195.7), ink top 156 (116-194). LATER titles (n=147): cap top 176.3 (p10 137.5, p90 268.2). G2 (17 clips): per lockup n=81 cap top 184.3 (p1 106.6, p10 128.8, p90 276.8), ink top 183; duration-weighted (129 occurrences) 166.3 (p10 135.0); opening n=13 cap top 153.8 (116.6-195.7), ink top 154 (116-194); later n=68 cap top 190.0 (p10 136.4, p90 283.1). Ink top minus cap top: median 1.0 px (p90 7.7; up to 9-14 px when line 1 starts with italic-serif ascenders). 18 % of lockups (G2 28 %) have line-1 cap top > 216 px; 3 % (G2 6 %) > 300 px (mid-field single-title cards). All three hold under their own definitions; they differ by sample, not by measurement. L11 (169, p10 135, p1 115) matches the duration-weighted cap top (167, p10 137, p1 119) and the per-lockup value (173, p10 137, p1 114). T14's median 164.5 is within 3-9 px but its p90 216 only holds if mid-field lockups are dropped (mine p90 263). H05 matches the opening-title ink top (156, 116-194; G2 154). The position is not a constant: it depends on the layout below the title. For a CSS builder, place by cap top (ink top is 1 px higher for sans-led lines). Use about 154-157 for the opening title and a layout-dependent value (median 176, G2 190) for later titles.
- Verified, confirmed: One-line bars on settled title lockups. Edges are the 50 % crossings of redness rho=(R-(G+B)/2)/188; a luma-coverage cross-check agrees within 0.3-1.5 px. Boxed/stroked G1 variants (clip10, clip12) are excluded. ALL-32: n=55 bars, 24 clips, median 76.1 px (p10 59.0, p90 92.4, range 54.0-116.2); luma 76.4. Flat bars only (no glow): n=36, 81.8 (p10 61.9, p90 95.1). G2: n=30 bars, 13 clips, 79.7 (p10 58.9, p90 97.6); flat only n=25, 11 clips, 81.9 (p10 69.0, p90 103.0). The height follows the text size: h - cap = 25.8 all-32 / 24.2 G2 flat (p10 19.0, p90 35.8); h/cap 1.58 all-32, 1.47 G2 (p10 1.27, p90 1.72); G2 flat fit h = 30.5 + 0.92*cap, residual sd 8.6 px. Separate element: the fixed CTA / 4-Week bar is 83.8 px tall (83.6-84.0, n=10, 8 clips) and 655.2 px wide at x 212.3-867.5. The claims differ by sample, not by measurement. All-32 matches T17 (76.1 vs 76) and G2 matches L11 (79.7 vs 80); G05's 78 falls between them; H05's 70 is low; its sample probably leaned on the smaller bars of clip09 (G1) and clip35 (G2), which are 54-66 px. There is no single bar height: it scales with the text. A builder should not fix the height. Draw the bar as the text's line box plus about 11 px above the cap top and 13-15 px below the baseline (item 3); for a 47-50 px cap that gives about 72-76 px.

### [L12] Draw graphics inside a slot x 83..1012, y 151..1205, centred on x 540 and vertically centred near y 750; size each graphic to its content.

- Values: Content envelope below the title and above the caption zone (dark split, n=3532): left p10 82, right p90 1012, top p10 151, bottom p90 1210 (median box 182..890 x 381..1100). Largest element centre y median 748 (p10 502, p90 944). Light split (n=361): box median 140..925 x 360..1069, centre y 726.
- Evidence: n=3532 dark + 361 light split samples, 32 clips.
- Confidence: high

### [L13] Let graphic height follow content type, keep its centre near y 750: text cards and chip lists about 520-570 px tall, screenshots about 560, documents about 675, diagrams about 810, media grids about 860, phone frames about 950.

- Values: By-eye type labels on 80 random split samples, measured boxes: text_card n=8 h 520 (78-846); chip_list n=18 h 571 (186-784); screenshot_card n=9 h 558 (450-740); document n=8 h 675 (561-852); diagram_chart_metaphor n=17 h 809 (418-1266); media_card_or_grid n=12 h 858 (537-1029); phone n=8 h 952 (680-1094). Box centre y 701-767 for every type.
- Evidence: n=80 samples (types read by eye).
- Confidence: medium (types read by eye on 135x240 thumbnails; 8-18 samples per type)

### [L14] Leave at least 55 px between the bottom of a graphic and the caption top (157 px typical).

- Values: Graphic bottom to caption top: median 157 px, p10 55, p90 346 (n=3304 dark split samples); graphics reach below the caption top in 3.2% of samples (merged with the presenter overflow in 59).
- Evidence: (gap_graphic_bottom_to_caption_top)
- Confidence: high

### [L15] Let a graphic bleed off the left or right frame edge only occasionally (about 1 sample in 20).

- Values: Graphic content touches x=0 in 4.8% and x=1080 in 5.3% of dark split samples, y=0 in 1.2% (n=3532); light split 3.0% / 1.7% / 0.6% (n=361).
- Evidence: e.g. clip12 pyramid, clip24@204-252 thumbnail grid, clip19@456-512 zoomed document.
- Confidence: high

### [L16] Keep text inside x 82..997 and below y 115; the lowest caption ink sits at y 1334 (split), 1373 (full), 1414 (field).

- Values: Closest text: title-band text x0 min 82 (p1 97), x1 p99.9 997 (max 1033, single outlier), top y0 p1 115 (min 40). Caption extents x 173..916; caption ink bottom max 1334 split, 1373 full, 1414 field. Graphic boxes can bleed (L15).
- Evidence: n=3405 title-band samples, 5,507 caption samples.
- Confidence: high

### [L17] Show the presenter full-bleed (0,0)-(1080,1920) in full mode with no field, no panel and no title; only the caption stays.

- Values: Full-mode frames: side strips carry footage texture (std > 12 in x 2..40 and 1040..1078 over y 100..1380) and no panel border in 20,851 frames; full mode has a centred caption in 94.9% of samples; title red bar or field never visible.
- Evidence: n=32 clips, 1727 full samples. e.g. clip31@348-352, clip40@144.
- Confidence: high

### [L18] Cut between modes on a single frame; never animate a reflow, dissolve or slide from split to full or back.

- Values: 498 mode changes: 0 intermediate frames in all; luma difference on the change frame is median 7.85x (p10 4.16x) the largest of its 8 neighbours, >= 2x in 96.9%; the rest coincide with graphics animating across the cut.
- Evidence: n=498 changes, 32 clips. e.g. clip31@347/348 split->full, clip31@449/450 full->split.
- Confidence: high

### [L19] Hold split runs about 6.3 s and full-height cut-ins about 3.1 s; use about 5 full cut-ins per minute.

- Values: Split segments: median 6.34 s (156 frames), p10 2.61, p90 14.0, max 29.5 (n=264; interior only 6.63 s / 162 frames). Full segments: median 3.08 s (75.5 frames), p10 1.38, p90 6.03, max 9.8 (n=252; interior 76 frames). Full cut-ins per minute per clip: median 5.1, range 3.0-9.9.
- Evidence: n=32 clips, every frame.
- Confidence: high
- Verified, confirmed: All-32 (48.0 min): panel runs n=265, median 6.34 s (156 frames at clip rate; interior runs 6.63 s, mean 7.42); full runs n=254, median 3.08 s (75 frames; mean 3.40); other (full-screen b-roll/graphic, clips 02,33,34,36) n=15, median 3.0 s, 1.8 % of time. 502 switches = 10.46 per minute pooled, clip median 10.25 (range 6.0-20.7); panel<->full only 9.83 per minute. G2 (25.8 min): panel median 6.25 s (150 frames), full 3.25 s (79 frames), 10.69 switches per minute pooled, clip median 10.25 (7.1-20.7). Switches: 96.6 % have frame t-1 = old layout (mix < 0.05) and a one-frame change 58x larger than the previous frame difference. No cross-fade or slide between layouts was found. The lower mix values (F>P) come from field graphics animating in right after the cut. Confirmed. Rates can differ slightly by definition: counting only panel<->full gives 9.8 per minute, and including b-roll switches gives 10.5. Clip33 (20.7 per minute) is inflated by phone-mockup graphics that flip between layout classes.,.

### [L20] Open every video in split mode; the first split run lasts about 4.7 s before the first full cut-in.

- Values: Frame 0 is split in 32/32 clips (dark 25, light 7). First split run: median 4.69 s, p10 1.94, p90 12.33, range 1.71-23.36. Last frame: split 21, full 11.
- Evidence: n=32 clips.
- Confidence: high

### [L21] Use the dark field by default and the light field as an occasional variant inside the same grammar; caption ink is white on dark and black on light.

- Values: Dark split 61.8% of runtime in 31/32 clips; light split 6.4% in 11/32 clips (clip25 is light throughout). Caption glyph colour at the mode baseline: white in 3442/3442 dark-split samples, black in 358/359 light-split samples.
- Evidence: n=32 clips., (kind)
- Confidence: high

### [L22] Swap the field between dark and light while a full-height cut-in is on screen; otherwise hard-cut, and only rarely cross-fade over 0.36-0.52 s.

- Values: 39 field switches: 33 happen behind a full cut-in, 4 are hard cuts inside split/field mode (clip03@986/987, clip27@2123/2124, clip33@222/223, clip34@1586/1587), 3 are cross-fades: clip26@496-509 dark->light 13 frames (0.52 s, linear), clip26@604-613 light->dark 9 frames (0.36 s, linear), clip34@20-32 light->dark 12 frames (0.50 s, eased).
- Evidence: n=39 switches in 11 clips, every frame.
- Confidence: medium (only 3 cross-fades)
- Verified, confirmed: Counting the field wherever it is visible (panel frames plus full-screen flat graphics): 39 switches in all 32 clips (34 in G2), across 10 clips (03,15,19,24,26,27,33,34,36,37). 32 behind a full cut-in (26 panel-to-panel, 5 graphic-to-graphic in clip33, 1 behind full plus b-roll). 4 hard 1-frame cuts: clip03@987, clip27@2124, clip33@223, clip34 panel->graphic. 3 cross-fades: clip26@495-509, D->L, 14 frames at 25 fps = 0.56 s, linear; clip26@604-613, L->D, 9 frames = 0.36 s; clip34@20-31, L->D, 10-11 frames at 23.976 = 0.42-0.46 s, eased. Panel-only definition: 32 switches (G2 27): 26 behind full, 2 hard cuts, 3 cross-fades, 1 behind b-roll. Dark field = 16-21 tv (about 0-6 full range); light = 209-210 tv (about 225 full range). Confirmed within one event: 32 vs 33 of 39 behind a full cut-in, a few (4) hard cuts, and 3 cross-fades of 0.36, about 0.46 and 0.56 s. The total of 39 only appears when full-screen graphics in clip33 count as field; counting panel frames only gives 32. Evidence: (panel-only definition).

### [L23] Use the field mode (no panel) only as a rare variant: the field covers the frame, the presenter is absent or shown inside a phone graphic, and the caption drops to about y 1386-1400.

- Values: Field mode 1.6% of runtime in 2 clips (clip33 50% of its runtime, clip34 11%); 12 segments, median 4.02 s (p10 2.07, p90 5.53). Entered and left by cuts from/to full (20 of 22 changes). Caption baseline 1400 on dark (clip33, 19 samples), 1384-1389 on light (clips 33, 34).
- Evidence: n=2 clips. e.g. clip33@167, clip33@515, clip34@1642.
- Confidence: low (2 clips, both 2026-11-04/05)

### [L24] Use full-bleed b-roll only as a rare insert of about 3.6-3.9 s, cut in and out, with the caption at the full-mode baseline.

- Values: 3 runs in 2 clips: clip02@1717-1804 (3.67 s), clip02@1880-1973 (3.92 s), clip36@271-357 (3.63 s); 0.4% of runtime. Caption baseline 1184 in clip02 and 1273 in clip36 = each clip's full-mode baseline.
- Evidence: n=3 runs, 2 clips.
- Confidence: low (3 runs)

### [L25] Treat panel scale moves as rare: the panel keeps its rectangle in about 98% of split frames; slow composition push-ins appear in one early clip only.

- Values: Panel width differs > 3 px from the clip's own rectangle in 890/42,188 split frames (2.1%); real scale moves: clip02 (width 938->983 over 4.2 s at frames 882-982, ~895-908 at 1314-1385), +3 px steps in clip15@0-40 and clip36@1674-1807; the rest are the presenter's hand crossing the right border.
- Evidence: n=32 clips, every frame.
- Confidence: medium (scale curves not fitted; for the motion analyst)

### [L26] Do not treat the panel rectangle variants as generations: the same three rectangles recur across the whole month, so one default rectangle can be used for every video.

- Values: P1 dates 2026-10-14..2026-11-11 (8 clips), P2 2026-10-10..2026-11-10 (7), P3 2026-10-12..2026-11-09 (7), P4 2026-11-01/03 (2). Outlier clip08 (30 fps, 2026-10-15): top 1454.3, width 927.1, radius 35.3.
- Evidence: n=32 clips. (groups)
- Confidence: high

### [L27] For the later look, allow a light-field opening and occasional light-field passages: both start on 2026-10-21; the split/full balance does not change over time.

- Values: Before 2026-10-21: 1/12 clips use a light field, 0/12 open on light. From 2026-10-21: 10/20 use a light field, 7/20 open on light. Field mode only on 2026-11-04/05. Split share median 0.726 (n=12) vs 0.695 (n=20); full cut-ins per minute 5.1 vs 5.2.
- Evidence: n=32 clips by publication date., generations
- Confidence: medium (one month of data; light usage is clip-by-clip)

### [L28] Never place the presenter anywhere but the bottom panel or full-bleed: no top panel, no side-by-side split, no floating picture-in-picture, no letterbox, no presenter shrink between modes.

- Values: Across 70,005 frames: presenter footage was seen only in the bottom panel (split), full-bleed (full) or inside a phone graphic (field mode, 2 clips). No panel position other than the bottom rectangle was found by the border tracker (0 frames with a panel border elsewhere outside the 2.1% scale moves).
- Evidence: n=32 clips, every frame.
- Confidence: high

## Constant and variable

CONSTANT (every clip): mode set split/full (+ rare field, broll); hard cuts between modes (0 intermediate frames, 498/498); panel centred (539.5 +-4), bottom-anchored, bleeding off the bottom, top corners rounded only; panel rectangle fixed within a clip (p10-p90 <= 0.3 px) and identical on dark and light fields; caption a single centred line (centre 539-540.75) whose baseline is fixed within a clip (+-1 px in 35/41 groups); frame 0 in split mode; full mode is full-bleed with caption only; graphics centred on x 540 near y 750. VARIABLE: panel rectangle per clip (left 64.6-76.1, top 1400.2-1454.3, right 1001.1-1013.3, radius 29.9-47.2; three recurring templates, driven by which project template was copied, not by date); caption baseline per clip (split 1256-1323; full 1184-1359, equal to split in 19/32); full-mode caption scale 1.14-1.49x; title band position (first line 135-328 p10-p90) and red-bar use (25% of split samples), driven by the graphic; graphic height by content type (about 520 for text cards to about 950 for phones); field variant (dark 61.8% / light 6.4%, light rising after 2026-10-21); split and full run lengths (split 2.6-14.0 s, full 1.4-6.0 s p10-p90); presenter overflow 58-104 px (clip31: none).

## Open questions

- Which panel template to adopt: P1 (70.5/1407.5/1008.5, r42.5, caption 1305) is the most common and pairs with caption baseline 1305 in 8/8 of its clips; P2 (68.3/1404.1/1010.8, r46.8) is the earliest and latest. A person should choose; the difference is <= 3.4 px.
- clip08 (30 fps) has a lower, narrower panel (top 1454.3, width 927.1, r35.3) - a different export or template. Checking the source project would decide whether it should be excluded.
- Z-order where the caption meets the presenter overflow and where graphics reach the panel top was not observed (overlap in 0.4% of frames). A person should look at frames where a raised hand reaches the caption.
- The full-mode caption grows 1.22x; whether this is a font-size change or a scale transform anchored at the baseline is for the type analyst to confirm.
- Field mode (clips 33, 34 only, 2026-11-04/05) may be a new direction or a one-off; later videos would decide whether it belongs in the style.
- Title band detection merges the title with centred graphic headings; the hook analyst's title template should take precedence for exact title line positions.

## What a person must look at or listen to

- Look at and confirm the by-eye labels: clip02@1717-1804 and @1880-1973 and clip36@271-357 are b-roll; clip33 and clip34@1247-1358 runs are field mode.
- Look at and : the content-type labels behind L13 were read by eye from 135x240 thumbnails.
- Step through and in the source at full speed to confirm there is no flash, whip or sound-led transition at the cut.
- Look at : the field cross-fade is accompanied by a graphic sliding in; decide whether the cross-fade is a style move or a one-off.
- Look at and : confirm the slow push-in is a deliberate move (clip02 only).
- Look at to confirm the drawn panel, caption baseline, title lines and graphic envelope sit on the reference frame.
