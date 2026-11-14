# Layout

Layout was measured on all 11 in-style clips (12,791 frames, 426.4 s, 2026-11-02 to 2026-11-07) through a calibrated decode (raw YUV from ffmpeg, BT.709 limited to full in numpy; white cards read 255, the default ffmpeg RGB path reads 253). Every frame was classified by tracking the presenter panel against each clip's own resting plate at 1 px resolution; captions and graphic boxes were measured on every 3rd settled frame at native resolution (4,204 frames); pill, hook, call-to-action and heading geometry on one native frame per distinct state.

There are two full-frame modes. SPLIT (65.6% of runtime, 11 of 11 clips) puts a dark dotted field on the top half and a full-bleed presenter panel on the bottom half; the seam is the midline y=960 and the field fades linearly over the first 80 px of the panel. FULL (32.9%, 11 of 11 clips) removes the presenter and lets the same frame-fixed field fill the frame. The 34 changes between them are all animated reflows of about 7 frames in which the panel slides 960 px and the caption glides 520 px on one shared progress curve. FULL is used whenever the graphic is taller than the 880 px SPLIT slot (16 of 16 non-scene FULL segments).

Geometry is constant to the pixel across clips and dates: one caption line centred on x=540 with baseline 984 (SPLIT) or 1504 (FULL) on a translucent pill 125.5 px tall with 27 px side padding, centred on the seam in SPLIT; a 1,000 px graphic column (x 40 to 1040) with the graphic centred vertically on y=440 (SPLIT) or about y=730 (FULL); a hook title block at y 593-938 with no caption; a call-to-action block whose first line sits at y 274-340 and keyword at 414-539. Section headings (3 clips) sit at cap top 76 / baseline 143, with one clip using a higher, off-centre position.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [L01] Build two full-frame layout modes and nothing else: SPLIT (graphic field on top, presenter panel below) and FULL (the field fills the frame, no presenter). Open and close every video in SPLIT; go to FULL once or twice in between.

- Values: SPLIT 65.6% of runtime (8,393 of 12,791 frames; 11 of 11 clips; 28 segments; segment length median 232.5 frames, p10 112, p90 534, range 87-743). FULL 32.9% (4,204 frames; 11 of 11 clips; 17 segments; median 224, p10 82, p90 471, range 61-497). Reflow between them 1.5% (194 frames; 34 reflows). Per clip FULL share 12-51%. First and last segment are SPLIT in 11 of 11 clips; 5 clips have one FULL segment, 6 have two.
- Evidence: n=12,791 frames, every frame classified by tracking the presenter panel (clip29@0-1199... clip39@0-857).
- Confidence: high

### [L02] Inside SPLIT there are three content states that share the same geometry: hook title (opening), graphic, and call to action (ending). FULL only carries graphics.

- Values: Hook title 7.7% of runtime (988 frames; per clip 51-131 frames, median 87). Call to action 5.9% (750 frames; per clip 41-113, median 60, counted from the frame the block is complete). SPLIT graphic 52.0%. FULL graphic 32.9%. A section heading is on screen for 14.3% of runtime in 3 of 11 clips (7 headings). A full-bleed scene plate replaces the dotted field for 10.4% of runtime (13 events, 4 clips).
- Evidence: n=11 clips., (hook_end_frame), (cta_complete_from_frame)
- Confidence: medium: the hook and call-to-action boundaries are taken from one detector each and are good to about +-10 frames

### [L03] In SPLIT the seam is the horizontal midline. The presenter panel is the rectangle left 0, top 960, right 1080, bottom 1920: full bleed, no border, no corner radius, no shadow. The field is left 0, top 0, right 1080, bottom 960.

- Values: Seam row 960 in 11 of 11 clips (last unblended row 960, first row with presenter light 961). Panel at rest: vertical offset 0 px on 6,594 and 1 px on 332 of 6,928 tracked settled frames (2 outliers). Edge columns 0/1 and 1078/1079 and rows 1918/1919 differ by 0.0 levels (median) in all 11 clip plates.
- Evidence: n=11 clips, 6,928 frames (for example clip29@548-1199, clip33@0-564).
- Confidence: high
- Verified, confirmed: left 0, top 960, right 1080, bottom 1920. Outermost column or row minus the fourth from the edge: left +0.1 to +0.3 codes, right -0.6 to +0.4, bottom -0.1 to +0.1 (11 clips, 55 to 137 frames each). Bottom-left corner pixel has the temporal sd of footage (15 to 40 codes, same as 16 px inside); bottom-right corner reads 29.8 to 44.1, not the field's 32.0. Field rows 950-959 read 32.02 to 32.10: no shadow. Build value: 0,960,1080,1920; no radius, stroke or shadow.

### [L04] The boundary is a soft blend, not a hard edge: the dotted field layer stays fully opaque down to y=960 and fades linearly to nothing over the top 80 px of the presenter panel (gone by y=1040). Draw it as a linear alpha gradient in display code values.

- Values: Line fit per clip: field opacity 1 at y=963.1 median (range 960.7-963.8), 0 at y=1039.4 median (range 1037.5-1041.8), blend height 76.6 px median (range 75.0-80.1), fit RMSE 0.018 median. Pooled opacity by row: 0.86 at 971.5, 0.73 at 984, 0.59 at 995.5, 0.44 at 1008, 0.24 at 1020, 0.09 at 1032, 0.02 at 1038.5. A fixed 960->1040 linear ramp fits the pooled points with RMSE 0.023. Left (dark background) and right (bright wall) columns give the same opacity: difference median 0.001, median absolute 0.028, 90th percentile 0.064 (n=40 rows, 4 clips), so the mix is a plain alpha blend in code values.
- Evidence: n=11 clips, 34-98 frames each (every 10th settled SPLIT frame).
- Confidence: high for a linear blend of 77-80 px starting at the seam; the exact end row is known to +-2 px because dots fainter than about 6 levels do not survive the 0.75 Mbps encode
- Verified, not confirmed (the other claim holds): start 960.0 (per-clip 959.8 to 960.9), end 1040.7 (1039.7 to 1041.5), n=11 clips, 1,723 frames (82 to 205 per clip). Row 959 reads 32.07, row 960 32.24, row 1040 85.50, row 1041 85.78 of a 85.85 plateau. Error +-0.5 px on each end. Build value: start 960, end 1040 (80 px).
- Verified, confirmed: linear. RMSE 0.27 to 0.38 raw codes per clip for a linear ramp, 0.71 to 0.93 for smoothstep (n=11 clips). A free exponent t^g fits g = 0.97 to 1.03. Row-to-row luma step 0.67 codes for 80 rows. Build value: linear alpha, 0 at y=960, 1 at y=1040.
- Verified, confirmed: gamma-encoded (code values). Field opacity read from dot contrast over dark footage (level 57) minus the same over the bright wall (level 86): median +0.008, median absolute 0.019, n=110 row-clip pairs, rows 971-1020. A linear-light blend predicts +0.13 to +0.16 (for example 0.50 against 0.35 at mid ramp). Build value: blend in display code values (no linearisation).

### [L05] Set one caption line with its baseline at y=984 in SPLIT and y=1504 in FULL (exactly 520 px lower). Never wrap to a second line.

- Values: Baseline = lower edge of the last inked row of non-descending letters. SPLIT baseline 984 on 99.0% of 2,445 samples (the rest 985); FULL 1504 on 98.9% of 1,228 samples (range 1503-1505). Identical in 11 of 11 clips. Ascender top 55 px above the baseline (rows 929 / 1449), x-height top 37 px above (947 / 1467). Two-line captions: none found. Of the 201 settled post-hook samples that did not match the one-line pattern, 156 are the clip30 demo scene (its own transcript text) and 45 are descender-heavy words or frames just after a reflow.
- Evidence: n=3,673 native-resolution samples (every 3rd settled frame, 11 clips; for example clip29@600, clip29@180).
- Confidence: high
- Verified, confirmed: 984.04 in SPLIT (983.96 to 984.45), 1503.97 in FULL (1503.68 to 1504.12), travel 519.96 px (519.47 to 520.13), n=21 mode changes with both rest states tracked. Error +-0.3 px. Build value: baseline 984 and 1504, travel 520 px.
- Verified, confirmed: 984.01 (p10 983.97, p90 984.07, n=11,663 stem columns, per clip 984.01-984.02) and 1503.99 (p10 1503.94, p90 1504.03, n=6,261, per clip 1503.98-1504.00). Registration of whole captions: 983.97 (n=8) and 1503.97 (n=22). Ink centroid: 963.2 (p10 961.1, p90 965.1, n=518 groups) and 1483.0 (p10 1480.9, p90 1485.0, n=252). Error +-0.1 px. Build value: baseline y = 984 (split), 1504 (full height); 520 px apart.

### [L06] Centre every caption on x=540. Keep caption ink at most 704 px wide.

- Values: Ink centre x median 540.5 in both modes (p05 539.0, p95 542.0 SPLIT / 542.5 FULL, range 533.5-545.0). Ink width median 329 px SPLIT / 327 FULL (p10 197, p90 483 / 464), maximum 704 SPLIT (clip34) and 655 FULL (clip38). Ink never comes closer than 188 px to the left or right edge.
- Evidence: n=2,445 SPLIT + 1,228 FULL samples, 11 clips.
- Confidence: high
- Verified, confirmed: Text box centre (trailing letter-spacing included) 540.00 (p10 539.94, p90 540.09, sd 0.13, n=459 captions). Ink centre 540.45 (p10 539.2, p90 541.8, sd 0.95). Build value: centre the text box on x=540.

### [L07] Put the caption on a dark rounded pill: ink box plus 27 px on the left and right, fixed height 125.5 px, top 86.8 px above the baseline and bottom 38.7 px below it, corner radius about 23 px. Its vertical centre is y=960 in SPLIT (it straddles the seam, half over the field and half over the presenter) and y=1480 in FULL.

- Values: Bottom edge SPLIT 1022.7 (range 1022.6-1022.8, n=522 captions); FULL top 1417.23 (1417.19-1417.33), bottom 1542.70 (1542.62-1542.76), height 125.45 (125.31-125.52), n=10 captions. Right padding 27.0 px median (p10 26.0, p90 29.0, n=522); left padding 28.5 median with a false tail from dark trunks behind (histogram mode 27-29). Pill centre x 539.99 median. Corner: circle fit radius 22.75 px, RMSE 0.17 px on 1,030 corner profiles.
- Evidence: n=522 SPLIT captions (one frame per distinct caption, 11 clips) and 10 FULL captions on the checker scene clip38@1053-1197.
- Confidence: high for bottom edge, height, right padding and radius; the SPLIT top edge (897.3) is derived from the bottom edge and the FULL height, not measured directly
- Verified, confirmed: Beyond the ink: left 28.1 px (p10 25.9, p90 30.8, n=85), right 27.0 px (p10 25.3, p90 29.4, n=151). Beyond the text box (pen origin to advance end, trailing letter-spacing included): right 25.67 px (p10 24.8, p90 26.5, sd 0.68, n=151), left 25.84 px (sd 2.0, n=85). Plate centre x 539.9 (n=32). Error +-0.4 px. Build value: plate = text box + 26 px on each side.
- Verified, confirmed: Top 86.8 px above the baseline (full layout 86.71 on 2,960 frames, split 86.85 on 6,291 frames), error +-0.15 px. Bottom 38.7 px below (split layout: 39.0-39.15 before correction, 38.84 by regression to a flat backdrop, 38.5 with linear backdrop extrapolation, n=459 captions), error +-0.2 px. Build value: top = baseline - 86.8 px, bottom = baseline + 38.7 px (y 897.2 to 1022.7 split, 1417.2 to 1542.7 full; centre y 960 / 1480).
- Verified, confirmed: 125.5 px (86.8 + 38.7), error +-0.3 px. Build value: 125.5 px.
- Verified, confirmed: 23.2 px (left bottom corner 23.25, right 23.15; rmse 0.17-0.18 px; 20 px gives rmse 1.1-1.2 px, 22 px 0.4-0.5 px; n=84 and 151 captions per row), error +-0.6 px (it moves 22.8-23.7 with the bottom edge at 1022.5-1022.9). Build value: 23 px.

### [L08] The pill is translucent, not solid: the field dots stay faintly visible through it.

- Values: Dot contrast inside the pill 14.7 levels (SPLIT) and 15.6 (FULL) against 47.0 outside, n=660 captions: 31-33% of the backdrop shows through. One clean frame (clip29@180): dots 66->35, base 19->17, which is a fill of about luma 16 at alpha 0.62. Working value: near-black fill at 62-69% opacity.
- Evidence: n=660 captions, 11 clips; clip29@180, clip38@1100. (amp_inside, amp_outside)
- Confidence: medium: opacity is inferred from dot contrast and weak dots are also dimmed by the codec; the colour analyst should set the fill
- Verified, not confirmed (the other claim holds): Colour: luma code 30.78 in both layouts, U 127.0, V 128.0 = RGB 17.2, 17.4, 15.1 = #11110F (+-0.4 level). Opacity 0.68 +-0.015: dot integrals 0.683 (split) and 0.679 (full); same pixels with and without the plate on adjacent frames 0.700 (679 patches, 622,693 px, p10 0.690, p90 0.702), an estimator that reads 0.709-0.715 on a synthetic 0.69 plate. Blend is linear in code values within 0.65 codes over luma 38-101. Build value: #11110F at 0.68.

### [L09] Show no caption during the hook. The first caption appears on the frame the hook ends.

- Values: No caption before the hook ends in 11 of 11 clips. Hook ends at frames 51-131 (median 87); the first caption appears on that frame in 8 clips and 7-9 frames later in 3 clips where the hook ends with a reflow into FULL (clip30, clip32, clip37). After the hook a caption is present on 94.8% of settled samples (3,673 of 3,874); the only long gap is clip30@~150-560, a FULL demo scene that shows its own transcript lines (162 of 315 samples carry a caption).
- Evidence: n=11 clips....
- Confidence: high

### [L10] Use one graphic column: left 40, right 1040 (1,000 px wide, 40 px side margins), centred on x=540. Cards, panels and captures take the full column; narrower graphics stay centred on the axis.

- Values: Of 103 graphic events (hook, call to action and scene plates excluded): left edge at 38-40 px on 35, right edge at 1040-1042 on 31, width 1000-1004 on 30. Next most common widths: 1040 (20->1060, 5 events), 1020 (3), 960 (60->1020, 3), 884-885 (98->982, 2). Box centre within +-2 px of 540 on 75 of 103 and within +-6 px on 79; the rest are builds caught part-way or deliberately off-centre illustrations.
- Evidence: n=103 events from 258 stable states, 11 clips (for example clip34@102-207 box 40,30,1040,850; clip29@126-309 box 40,352,1041,1096).
- Confidence: high
- Verified, confirmed: the most common box is 40 to 1040 (14 of 118 settled states, both modes, hook and CTA excluded); centre x median 540.0 in both modes, within 3 px of 540 in 70 of 118. 97 of 118 states stay inside 36..1044. The other 21 are wider: 0 to 1080 full bleed (3), one frame edge touched (4), 20 to 1060 (2), 30 to 1050 (3), and single cases between x=8 and x=1064. Build value: column x 40 to 1040, centre 540.

### [L11] In SPLIT, centre the graphic vertically on y=440 inside the slot top 0, bottom 880 (80 px above the seam). Keep its box at most about 860 px tall.

- Values: Box centre y median 440.0 (p10 400, p90 456; n=58 events without a heading); 33 of 58 within +-10 px of 440, 18 within +-1 px and 10 at 440.0 exactly. Tallest boxes 874, 862, 862, 852, 840 px (tops 0-22, bottoms 860-874). No SPLIT box is taller than 874 px (n=69) and none ends lower than y=874, which leaves 23 px to the pill top at 897.
- Evidence: n=58 (69 with headings) events, 10 clips (for example clip34@468-510 box 40,20,1040,860; clip36@771-1035 box 40,24,1041,856; clip30@777-918 box 38,270,1042,610).
- Confidence: high
- Verified, confirmed: centre y median 440.0 (p25 424, p75 447; 43 of 92 states within 10 px of 440, 66 within 25). Lowest top 0, lowest bottom 872, tallest box 863 px; no state taller than 880. n=92 settled states, 11 clips. Build value: centre y=440, slot 0 to 880, box at most 863 px tall.

### [L12] In FULL, centre the graphic vertically on y=730 inside the slot top 60, bottom 1400 (80 px above the caption pill centre). Boxes may be up to about 1,340 px tall.

- Values: Box centre y median 723.5 (p10 613, p90 743; n=20 events without a heading); 9 of 20 within +-15 px of 730, the others are top-anchored builds. Tallest boxes 1366, 1356, 1356, 1341, 1334 px (tops 28-60, bottoms 1390-1407). With the pill top at 1417 the gap under the tallest boxes is 10-27 px.
- Evidence: n=20 events, 8 clips (for example clip34@957-1062 box 40,59,1041,1400; clip29@438-537 box 38,94,1042,1389; clip29@126-309 box 40,352,1041,1096).
- Confidence: medium: n=20 and 11 of them sit off the centre line by more than 15 px
- Verified, confirmed: centre y median 710.5 (p25 643, p75 751); 14 of 26 states within 40 px of 730. Tops 19 to 352 (median 113), bottoms up to 1380 unclipped; tallest unclipped box 1292 px. n=26 settled states of about 15 distinct graphics, 8 clips. Two states of clip34@520-685 run past my lower limit at 1412 (a scene that continues under the caption). Build value: centre y=730, slot 60 to 1400 (top 20 when a heading sits above).

### [L13] Choose the mode by the height of the graphic: if its box is taller than the SPLIT slot (about 880 px), use FULL; otherwise stay in SPLIT.

- Values: Every FULL segment that is not a scene plate contains a box taller than 880 px: 16 of 16 (tallest box per segment 940-1366 px, median 1271). FULL event heights median 1102 px (n=34), 27 of 34 above 880. SPLIT event heights median 688 px, maximum 874, 0 of 69 above 880.
- Evidence: n=17 FULL segments, 103 events, 11 clips.; mode_choice_by_height
- Confidence: high
- Verified, confirmed: no SPLIT state is taller than 863 px (n=92). All 10 FULL segments in which I could measure a box contain one of 1056 px or more (1056 to 1332). 22 of 26 FULL states are taller than 880. Build value: graphic taller than 880 px: FULL; otherwise SPLIT.

### [L14] Content type sets the height of the box, not its position: every type is centred in the same slot. Size the box to the content inside the 1,000 px column.

- Values: SPLIT: dark panel width 1000 median, height 811 median (340-874; n=22 events, 10 clips); light source capture width 1020 (952-1040), height 630 (497-852; n=4); big number with art width 960 (570-1052), height 718 (263-831; n=13, 8 clips); free illustration width 785 (171-1022), height 653 (178-788; n=19, 7 clips). FULL: light capture width 1012, height 1173 (744-1295; n=6, 4 clips); dark panel width 1001, height 1322 (1082-1366; n=11, 6 clips). A short text card is 340-344 px tall (clip29@648-687, clip30@777-918) and sits at y 258-610.
- Evidence: n=103 events. Boxes by code; the class of each event was assigned by eye from....
- Confidence: medium: classes are by eye and several classes have fewer than 10 events

### [L15] Hook title: stack 3 or 4 centred title lines in the block top 593, bottom 938 (it ends 22 px above the seam), no line wider than 904 px, with the illustration above it in the top 560 px of the field. The hook is always SPLIT.

- Values: Block top median 593 (range 591-600), bottom median 938 (range 930-939), n=11. 4 lines in 10 clips, 3 in 1 (clip39). Line ink heights 53-98 px (clip39 third line 173). Widest lines 904, 902, 884, 868 px (left 90-108, right 976-994). Line centre x median 542.0 (range 539.0-548.5, n=43 lines; capitals with open right sides shift the ink centre 1-4 px). Illustration ink: top 2-102, bottom median 540 (range 500-554), left 0-190, right 898-1080. Hook lasts 51-131 frames (median 87); title complete from frame 13-17.
- Evidence: n=11 clips, one settled frame each (clip29@100, clip30@73... clip39@37)....
- Confidence: high
- Verified, not confirmed (the other claim holds): Columns 0-1079 in 11/11. Rows from 0 (7/11 clips; in the other 4 the picture is at field level at the top). The 98th-percentile excess over the field is back under 2.5 levels at row 579-580 in 8/11 and at 567-571 in 3/11 with dark floors. Pictures are darker than the field in their black areas (-6 to -10 levels) right up to the top and side edges, with the same level in the first 4 rows or columns as 20-40 px inside: hard edges, no fade. The entrance scales the whole 1080 x 580 rectangle about (539.5, 289.5): fitted shift at scale 0.924 is under 0.07 px, so the centre is within 1 px. Build value: x 0-1080, y 0-580.
- Verified, confirmed: Flat edges at 50 percent ink, y in pixel-edge units: cap top of line 1 592.0-595.4 and last baseline 935.9-937.9 in the 7 four-line titles that fill the height (flat height 341.6-344.9); 599.4-600.8 and 930.0-933.0 in clip29, clip35, clip37 (329-334); clip39 (3 lines, fills the height) 594.0 to 930.0. Centre of that span 765.4 (762.0-766.2). Widest line 904.7 px (clip35) and 903.2 (clip37); widest light line 720.1 (clip30). Ink centre x 542.0 (539.0-548.4, n=43). 4 upper-case lines, 2 light then 2 heavy, in 10/11; clip39 has one heavy line. Error +-0.3 px. Build value: see the layout rule entry: line-box stack 359.4 px high centred on y = 766.1; max ink width 905 px.

### [L16] Call to action (always SPLIT, caption still running): a light first line in the box left 348, top 274, right 736, bottom 340, and the quoted keyword line below it from y=414 to y=539, both centred. Shrink the keyword to fit 924 px.

- Values: First line box identical to the pixel in 9 of 11 clips (top 273-274, bottom 340-341, left 348, right 736, centre x 542). Keyword line top 414, bottom 536-539 in 8 of 11 clips, width 442-805 px; in clip34 the long keyword is 924 px wide and 101 px tall (top 407, bottom 508, left 80, right 1004). Complete block on screen for 41-113 frames (median 60).
- Evidence: n=11 clips, one frame each at last frame minus 8 (clip30@1844, clip33@1059...)....
- Confidence: high for the two standard lines
- Verified, confirmed: Identical in 11/11: ink x 348.6-735.7 (width 387.0-387.1, centre 542.2), ink rows 274-339, C height 65.8 px (round letter, 274.2 to 340.0), stem baseline at y = 339.0 in pixel-edge units (last full ink row 338). Position: that box in 9/11; +198 px in clip29 (picture above), -140 px in clip35 (picture below). Light weight, sentence case. Error +-0.2 px. Build value: ink x 348.6-735.7, C top 274.2, baseline 339.0 (C height 65.8 px).
- Verified, not confirmed (the other claim holds): Flat cap height 116.2 px (116.15-116.27) in 10/11; cap top 419.8, baseline 536.0, cap top 80.6-80.8 px under the line 1 baseline. Quote marks span 415.0-476.6. Ink rows 415-537. Width 439.9-803.7 px at full size, ink centre x 542.8-542.9. clip34 (9 letters): cap height 93.8 (0.807 x), ink 923.2 px wide (x 80.8-1004.0), cap top 411.2, baseline 505.0. Error +-0.2 px. Build value: cap height 116.2 px, cap top y = 419.8, baseline y = 536.0 (pixel-edge units).
- Verified, confirmed: 923.2 px ink width on the one shrunk keyword (clip34). One heading is 923.35 px wide as well (clip38, second heading). Build value: 923 px.

### [L17] Call-to-action variants: a graphic above the two lines pushes them down 198 px; a large graphic below pulls them up 140 px; a small chip or icon can sit below the keyword without moving it.

- Values: Graphic above: clip29 (graphic y 22-412, lines at 472-538 and 613-735). Large graphic below: clip35 (lines at 134-200 and 274-399, graphic y 554-856). Small element below with lines unmoved: clip31 (icon y 602-880, centre x 582) and clip32 (chip y 672-788).
- Evidence: n=1, 1 and 2 clips: clip29@1191, clip35@1253, clip31@845, clip32@1027.
- Confidence: low: each variant seen once or twice

### [L18] Section heading (numbered list videos): one bold line at the top of the field, cap top y=76, baseline y=143, centred on x=540. It stays in place while graphics and modes change underneath.

- Values: clip32 (2 headings) and clip33 (2 headings): cap top 76-77, baseline 143 (clip32) and 146-147 (clip33, heading contains an icon), ink width 561-797 px, centre x 539.5-542. 4 of 7 headings stay on screen across a SPLIT/FULL reflow (modes F and S in the table). Heading on screen 192-342 frames each.
- Evidence: n=4 headings, 2 clips (clip32@144-438, clip32@456-678, clip33@282-474, clip33@498-744).
- Confidence: medium: 2 clips

### [L19] A second heading position exists: cap top y=19-20, baseline y=90, centred on x=502 (38 px left of the axis). Treat it as an outlier, not a generation.

- Values: clip38, 3 headings: left/right 185/818, 41/964, 213/789 (centre x 501.0-502.5), cap top 19-20, baseline 90, width 576-923 px.
- Evidence: n=3 headings, 1 clip (clip38@324-666, clip38@690-972, clip38@996-1200).
- Confidence: low: one clip; a person should decide whether the off-centre heading is intended

### [L20] With a heading, start the graphic no higher than y=170 and centre it in what is left: slot 170-880 in SPLIT (centre 525), 170-1400 in FULL (centre 785).

- Values: First graphic row below the heading: minimum 167 (clip32), 170 (clip33), 172 (clip38), over 27 frames; the same floor in clip38 although its heading sits 53 px higher. Box centre y median 530 in SPLIT (n=11 events, range 464-736) and 776 in FULL (n=14, range 304-827), against 440 and 723.5 without a heading.
- Evidence: n=25 events, 27 frames, 3 clips. (heading_present=1), heading_to_graphic_gap
- Confidence: medium: 3 clips and the centre values scatter

### [L21] A mode change is an animated reflow, never a cut: the presenter panel slides vertically by 960 px (down and out for SPLIT to FULL, up and in for the return) while the caption glides 520 px between its two baselines on the same progress curve.

- Values: 34 of 34 mode changes are animated. Frames between the last settled frame before and the first after: median 6 (range 4-9). Progress per frame, pooled on the FULL to SPLIT direction (n=11-17 per step): 0.008, 0.073, 0.277, 0.735, 0.925, 0.971, 0.992, so about 7 frames from 1% to 99% and 5 frames between 2% and 98%. Caption progress minus panel progress: median -0.004, p05 -0.020, p95 +0.003 (n=59 frame pairs). No curve fitted here.
- Evidence: n=34 reflows, every frame, 11 clips (for example clip30@568-574, clip38@312-317, clip37@782-788).
- Confidence: high
- Verified, not confirmed (the other claim holds): 957 px (95 % interval 955 to 958) for 520 px of caption travel: slope 1.8396, n=52 frames from 24 mode changes with the panel 30 to 880 px from rest. Rest top is 960.0 (seam fit). With 940 px the panel would lead the caption by a median 0.8 % of the travel (rms 1.0 %); with 960 px the difference is -0.14 % (rms 0.30 %). Error +-3 px, with a likely small low bias once most of the panel is off screen. Build value: 960 px (panel top from 960 to 1920).
- Verified, corrected: 12.0 animation steps = 10.0 output frames = 0.333 s from first to last movement (fitted duration 12.00 steps for exits and for returns; +-0.1). 1 % to 99 % takes 6.8 steps = 5.6 frames. A step is 1/36 s: the layout clock advances 6 steps every 5 output frames, with one double step per 5 frames (on n%5 = 2 in 11 and n%5 = 3 in 18 of 63 unambiguous cases; never on 0, 1, 4; clip30 on n%5 = 4). 181 steps were counted over 150 frames (1.207 per frame). Movement of 1 px or more is visible on 8 to 9 frames. Build value: 0.333 s (10 frames at 30 fps), sampled in real time.
- Verified, confirmed: yes. Panel offset/960 minus caption offset/520: median -0.0014, p05 -0.0061, p95 +0.0010, rms 0.0030 (n=52 frames, 24 changes). The double steps of the 36 Hz clock land on the same frames for both. Build value: one progress value drives both.
- Verified, confirmed: 984.04 in SPLIT (983.96 to 984.45), 1503.97 in FULL (1503.68 to 1504.12), travel 519.96 px (519.47 to 520.13), n=21 mode changes with both rest states tracked. Error +-0.3 px. Build value: baseline 984 and 1504, travel 520 px.

### [L22] During a reflow the caption stays sharp while the outgoing and incoming graphics swap with a blur dissolve and the moving presenter panel is blurred; the new graphic finishes sharpening a few frames after the panel has settled.

- Values: Read by eye on 5 every-frame strips: blur visible on the panel for 4-6 frames, new graphic still soft 2-4 frames after the panel is at rest (clip38@317-320). Caption template correlation stays at 0.94-1.00 through the move, which confirms the caption is not blurred.
- Evidence: n=5 strips by eye (clip29@112-123, clip30@566-577, clip36@245-256, clip37@780-791, clip38@310-321); caption correlation
- Confidence: low: by eye, blur not measured
- Verified, confirmed: sharp, no blur and no motion blur. The lower text edge goes from 90 % to 10 % ink in 2 rows at rest (p90 4, n=433 frames) and in 3 rows while moving 15 to 354 px per frame (p90 5, n=142). Build value: no blur on the caption.

### [L23] The field plate is fixed to the frame and identical in both modes; the presenter panel slides over it. Base level luma 18.6, a 12 px dot lattice with dot centres on multiples of 12 px in x and y, dots present from about y=467 downwards.

- Values: Field base raw Y=32 (luma 18.6) in 11 of 11 clips. Lattice pitch 12 px, dot core 4 px with 1 px soft edge, dot contrast 47-48 levels. Dot contrast at the left and right edges (median of 11 clips): 0-1 above y=456, 32-36 at y=492, 40-43 at y=540, 45-47 from y=684 down; the same profile in SPLIT and FULL (difference 4 levels or less above the seam).
- Evidence: n=11 clips, all settled frames (lattice maps of every frame).
- Confidence: high for base level and lattice; medium for the row where dots begin (measured at the edges only, the upper outline of the dot area is not flat)
- Verified, confirmed: base raw Y 32.0 (U 127, V 128) = RGB 18.6, 18.8, 16.5. Pitch 11.999 px in x (90 columns) and 11.993 px in y (29 rows), first node centres at x=0.04 and y=0.12 modulo 12 (2,609 dot centroids, residual sd 0.10 and 0.17 px). Full dot area 17.9 px2, radius 2.37 to 2.39 px; core level raw Y 72.9 = RGB 67, 67, 65. Build value: #131311 base, 12 px lattice from the frame origin, dot radius 2.36 px, dot colour #434341.

### [L24] In FULL keep the band below the caption empty: nothing is drawn between the pill bottom (y=1543) and the frame bottom, 377 px or 19.6% of the height.

- Values: Nothing below y=1550 in 14 of 17 FULL segments. Exceptions: a diagram running to y=1856 (clip34@522-687) and two full-frame scene plates (clip36@348-744, clip38@1050-1206). The clip30 demo scene leaves a 6 px sliver at y=1544-1550. FULL caption baseline is 416 px above the bottom edge on 1,228 of 1,228 samples.
- Evidence: n=17 FULL segments, 1,401 sampled frames. (below_caption_* columns)
- Confidence: high

### [L25] Safe area. Text: captions stay 188 px or more from the sides (pill 161 px), hook titles 86 px, the call-to-action keyword 76 px, headings 41 px. Cards: 16 px minimum, 40 px normally. Top: cards 10 px (SPLIT) and 28 px (FULL), heading 19 px, hook illustration may touch the top edge.

- Values: Caption ink left minimum 188, right maximum 892 (n=3,673). Hook title left minimum 90, right maximum 994 (n=11 clips). Keyword left 80, right 1004 (n=11). Heading left 41, right 964 (n=7). Resting cards and panels: left minimum 16, right maximum 1064, top minimum 10 in SPLIT and 28 in FULL (n=58 events; two events excluded: a zoomed interface that bleeds off three sides, clip31@453-705, and a card caught mid-move, clip38@567-579). Big numbers and illustrations: top minimum 8 (clip34@1107-1152).
- Evidence: n=3,673 caption samples, 11 hook frames, 11 call-to-action frames, 7 headings, 58 card events and 41 number or illustration events, 11 clips.
- Confidence: high

### [L26] A scene plate may replace the dotted field for a whole beat: in SPLIT it fills the field down to the seam blend, in FULL it fills the entire frame including the band under the caption. Caption pill and heading keep their positions on top of it.

- Values: 13 events in 4 of 11 clips, 10.4% of runtime. SPLIT: box 0-1080 wide, bottom 827-877 (7 events, clip30 and clip37). FULL: 0-1080 wide to the bottom edge (clip36 contour scene 4 events, clip38 checker scene 1 event) or a contained demo panel (clip30@105-561, box 57,243,1023,1336). Caption baseline unchanged at 984 / 1504 on these frames.
- Evidence: n=13 events, 4 clips (clip30@588-630, clip37@243-576, clip36@348-744, clip38@1050-1206). (class full_bleed_scene)
- Confidence: medium: 4 clips, class by eye

### [L27] Layout geometry did not change between 2026-11-02 and 2026-11-07: use one generation.

- Values: 2026-11-02 (2 clips) against 2026-11-03 to 11-07 (9 clips): seam blend start 960.7-963.3 against 961.6-963.8; caption baselines 984 / 1504 in 2 of 2 and 9 of 9; pill right padding 27.0 in 2 of 2 and 27.0-27.4 in 9 of 9; hook block top 591-600 against 593-599, bottom 930-939 against 932-939; standard call-to-action first line at y=274 in 1 of 2 and 8 of 9; SPLIT graphic centre y 440.0-441.5 against 417.5-459.0. The two differences found (heading position in clip38, call-to-action variants in clip29 and clip35) do not follow the date.
- Evidence: n=11 clips.
- Confidence: high for the constants; only 2 clips on the early side

### [L28] Never observed, so do not build: a full-frame presenter, a presenter inset or picture-in-picture, a side-by-side split, a seam at any other row, a rounded or bordered presenter panel, a caption off the centre axis or on two lines, or a hard cut between SPLIT and FULL.

- Values: Presenter full frame: 0 of 12,791 frames. Seam at rest other than 960: 0 of 28 SPLIT segments. Caption centre outside 533.5-545.0: 0 of 3,673. Two-line captions: none found. Of the 201 settled post-hook samples that did not match the one-line pattern, 156 are the clip30 demo scene (its own transcript text) and 45 are descender-heavy words or frames just after a reflow. Hard cuts between modes: 0 of 34. Presenter footage rescaled between modes: not seen, panel edge strips match the rest position at 0-1 px on 6,926 of 6,928 frames.
- Evidence: n=12,791 frames, 11 clips.
- Confidence: high

## Constant and variable

CONSTANT (identical in 11 of 11 clips, to the pixel or within 1-3 px): frame 1080x1920; seam row 960; presenter panel rectangle 0,960,1080,1920 with no border or radius; linear seam blend 960 to 1040; field base level and 12 px dot lattice fixed to the frame; caption baseline 984 (SPLIT) and 1504 (FULL), one line, centred on 540; pill height 125.5, padding 27, bottom edge 1022.7 / 1542.7, radius about 23; graphic column 40 to 1040; SPLIT graphic centre line y=440; hook title block top 591-600 and bottom 930-939; call-to-action first line box 348,274,736,340 (9 of 11); reflow travel 960 px (panel) and 520 px (caption); opening and closing in SPLIT.

VARIABLE: share of FULL per clip 8-51% and 1 or 2 FULL segments, driven by how many graphics are taller than 880 px; segment lengths 61-743 frames; graphic box height 167-1366 px and width 171-1076 px, driven by content; vertical position of off-pattern builds (top-anchored cards, stacked builds); caption ink width 45-704 px, driven by the words; hook length 51-131 frames and 3 or 4 title lines; call-to-action keyword width 442-924 px and the three stack variants (graphic above, large graphic below, chip below); presence of a section heading (3 clips) and its position (y 76 in 2 clips, y 19 and 38 px left in 1 clip); scene plates instead of the dotted field (4 clips); reflow length 4-9 frames between settled frames.

## Open questions

- Seam blend end row: the line fit gives 1037.5-1041.8 and a fixed 960 to 1040 ramp fits with RMSE 0.023. Whether the source gradient is 80 px or 4% of the height (76.8 px) cannot be decided at this bitrate; a render compared against would decide it.
- Is the clip38 heading position (cap top 19, centre x 502) a deliberate variant or a mistake in that edit? Only 3 clips have headings; more list-format clips from the same period would decide it.
- FULL graphic slot: the model slot 60-1400 (centre 730) fits the tallest boxes, but only 9 of 20 FULL events sit within 15 px of that centre. Whether shorter FULL graphics are centred or top-anchored needs the graphics analyst's per-component view.
- Pill fill: the dot-contrast method gives 62-69% opacity of a near-black fill. The exact colour and alpha need the colour analyst's measurement on a frame where the pill lies over a flat bright area.
- The call-to-action variants (plus 198 px with a graphic above, minus 140 px with a large graphic below) are each seen once. Whether the stack is laid out by a centring rule or by fixed offsets cannot be told from n=1.
- The field's dotted area has an uneven upper outline (a skyline). Only its height at the left and right edges (y=467) was measured here; the outline and any slow movement belong to the colour and motion analysts.

## Needs an eye or an ear

- Reflow: watch 3 mode changes in playback and confirm the panel slide, caption glide and blur dissolve read as one move. Stills.
- Seam blend: open and and confirm a straight fade with no extra shadow line at y=960.
- Caption pill: open and confirm the pill is translucent (dots visible through it) and that its top corners are rounded like the bottom ones (only bottom corners were measured).
- Clip38 headings: open and decide whether the high, left-shifted heading is intended.
- Graphic classes were assigned by eye: check to against the class column of if the per-class sizes of rule L14 will drive the planner.
- Annotated slots: open and confirm the drawn seam, blend end, column lines, centre lines and pill match what the eye sees.
- What was not done: nothing was watched in playback, no audio was used, no easing curve was fitted, blur was not measured, and hook, call-to-action and heading boxes come from one settled frame per clip or state.
