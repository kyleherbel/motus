# Presenter

Measured the presenter on all 32 in-style clips (2880.6 s, 70,005 frames at native 23.976/24/25/30 fps), dark (24), mixed (7) and light (1) families. Every frame was decoded with a calibrated BT.709 limited-to-full decode (caption white 255.0, dark field 1.0) and passed to Apple Vision for face landmarks; a person matte was taken on every 12th frame. Layout per frame comes from the presenter face (panel face low and small, full-height face large) plus by-eye labels for b-roll, graphic-only and phone-window stretches. Panel geometry, edge profiles and cut-out edges were measured on about 43 full-resolution frames per clip; footage scale and push-ins come from background registration (ECC with the person masked) on every F frame.

The grammar is two layouts cut against each other about 10 times a minute: a rounded footage panel (about 938 x 512 visible, top at y=1408, radius 42, no stroke, shadow or tilt, running off the bottom) under the graphic field for 68 % of runtime, and the full-height presenter for 30 %. The person is a hard-edged cut-out drawn over the panel and the graphics: the cap rises about 79 px above the panel and arms cross its sides in 19 % of frames. Panel and full-height views are fixed crops of one camera frame: the full-height view is 2.8x the panel scale, a 9:16 window centred on the panel and bottom-aligned with it. Every full-height run starts at the base framing (eye line 654, eyes 196 px apart); 39 % push in to 1.10x (0.54 s, slow start) or 1.18x (0.67 s, fast ease-out) about the frame centre and hold. Most layout switches also skip time in the take; further jump cuts run about 6 per minute in the panel and 3 per minute in full height.

Panel position comes in three recurring templates (differences of 1-6 px, radius 42-45.5) with no trend over the 33 days; push-in use falls slightly (47 % to 32 % of F runs) but nothing else drifts. The tilted early panel mentioned in the brief was not found. Nothing was watched in playback; the edit was judged from frames and measurements.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [P01] Use two presenter layouts: P = graphic field above a rounded footage panel at the bottom (about 70 % of runtime) and F = full-height presenter (about 30 %); everything else is rare.

- Values: Pooled runtime: P 68.2 %, F 29.8 %, G (graphic only) 1.2 %, B (other footage full frame) 0.39 %, W (presenter in a phone mock-up) 0.40 % of 2880.6 s / 70,005 frames. Per clip: P median 70.5 % (5.9-80.7 %), F median 29.5 % (16.1-41.8 %). P and F appear in 32/32 clips; G and W only in 2 clips, B in 2 clips.
- Evidence: n=32 clips, every frame classified (Vision face landmarks on every frame + by-eye run labels for B/G/W)., (first/middle/last frame of every non-P run), clip02@1717-1804 and clip36@271-357 (B), clip33@162-321 (G).
- Confidence: high

### [P02] Alternate P and F in runs: P runs about 6.6 s, F runs about 3.1 s, about 10 layout switches per minute.

- Values: Interior runs (not first/last). P: median 6.63 s (p10 2.84, p90 14.10; min 1.32, max 29.46; 162 frames median), n=211. F: median 3.09 s (p10 1.38, p90 6.12; min 0.54, max 9.80; 76 frames median), n=241. Switches per minute: median 10.3 (6.0-19.8 per clip). F runs shorter than 0.54 s never occur.
- Evidence: n=32 clips, 264 P runs, 252 F runs.,.
- Confidence: high
- Verified, confirmed: All-32 (48.0 min): panel runs n=265, median 6.34 s (156 frames at clip rate; interior runs 6.63 s, mean 7.42); full runs n=254, median 3.08 s (75 frames; mean 3.40); other (full-screen b-roll/graphic, clips 02,33,34,36) n=15, median 3.0 s, 1.8 % of time. 502 switches = 10.46 per minute pooled, clip median 10.25 (range 6.0-20.7); panel<->full only 9.83 per minute. G2 (25.8 min): panel median 6.25 s (150 frames), full 3.25 s (79 frames), 10.69 switches per minute pooled, clip median 10.25 (7.1-20.7). Switches: 96.6 % have frame t-1 = old layout (mix < 0.05) and a one-frame change 58x larger than the previous frame difference. No cross-fade or slide between layouts was found. The lower mix values (F>P) come from field graphics animating in right after the cut. Confirmed. Rates can differ slightly by definition: counting only panel<->full gives 9.8 per minute, and including b-roll switches gives 10.5. Clip33 (20.7 per minute) is inflated by phone-mockup graphics that flip between layout classes.,.

### [P03] Open every video in P; end in P (2 of 3) or F (1 of 3).

- Values: Opens in P: 32/32. Opening P run: median 4.69 s (p10 1.94, p90 12.33). Ends in P: 21/32, in F: 11/32. Never opens or ends on B, G or W.
- Evidence: n=32. (opens_with, opens_frames, ends_with).
- Confidence: high

### [P04] Switch layouts with a hard cut on one frame; the panel is complete on the first P frame (no slide, scale, fade or wipe).

- Values: Boundaries: 497/499 are single-frame changes (thumbnail difference at the switch frame >= 3x the two frames before and >= 8 levels); P>F 240/240, F>P 229/230. The 2 exceptions are a 2-frame graphic move (clip33@569-570, W>G) and presenter motion before a cut (clip36@897). Panel edges on the first 9 frames of P runs deviate <= 0.2 px from the clip median in the clean clips (no graphic touching the panel).
- Evidence: n=499 boundaries in 32 clips; panel start check on 3 P-run starts x 9 frames per clip at full resolution., (start_max_dev_px), (frames where a graphic overlapping the panel edge fooled the edge finder, not panel motion).
- Confidence: high

### [P05] Draw the panel as a rounded rectangle about 938 px wide, centred, top edge at y=1408, running off the bottom of the frame.

- Values: Per-clip medians (full-res, 24-43 frames per clip): left 71.0 (65.1-76.8), right 1010.4 (1001.8-1013.9), top 1408.0 (1400.8-1454.9), width 938.3 (927.4-947.8), centre x 540.0 (538.1-544.1). Left/right edges traced down to y=1915: no bottom corners visible, so the panel bottom is at or below 1920. Within a clip the geometry is constant to SD <= 0.03 px when no graphic overlaps the edge. Visible panel height 512 px (1920-1408).
- Evidence: n=32 clips, 1,350 full-res frames., e.g. clip40@300, clip10@570.
- Confidence: high

### [P06] Round only the two top corners (radius about 42 px); there are no bottom corners on screen.

- Values: Corner radius, circle fit to the top-left and top-right corner edge points: median of clip medians 42.0 px (range 28.5-46.0; fit MAD < 0.35 px). By template: 45.5 (A), 42.0 (B, C), 45.5 (D), 34.5 (clip08), 28.5 (clip37), ~35 (clip02).
- Evidence: n=32 clips, 2 corners x up to 43 frames each. (radius_med, radius_min, radius_max),.
- Confidence: high

### [P07] Treat the panel position as one of three recurring templates, not as a trend over time; template B (x 71, y 1408, w 938, r 42) is the most common.

- Values: A: left 68.9 / top 1404.7 / right 1011.1, r 45.5, w 942.2 - clip01, 15, 19, 24, 25, 36, 39 (2026-10-10..11-10, 7 clips). B: 71.0 / 1408.0 / 1009.0, r 42, w 938.1 - clip06, 07, 09, 10, 12, 17, 35, 40 (10-14..11-11, 8 clips). C: 71.5-72.1 / 1410.0 / 1010.0, r 42-42.5, w 938.2 - clip03, 04, 05, 13, 26, 27, 38 (10-12..11-09, 7 clips). D: 65.1 / 1417.2 / 1012.4, r 45.5, w 947.4 - clip30, 32 (11-01..11-03). One-offs: clip02 (two geometries inside one clip: 69.0/1406.0/1008.2 for the first P run, 66.8/1408.4/1010.8 after), clip08 (74.4/1454.9/1001.8, r 34.5, the lowest and narrowest), clip28, clip29, clip33, clip34, clip37.
- Evidence: n=32 clips., panel.geometry_groups,.
- Confidence: medium (values high; that these are reused project templates is an interpretation)
- Verified, corrected: CSS edge coordinates (pixel i spans [i,i+1]). Template B (8 clips: 06,07,09,10,12,17,35,40; 255 fitted frames): left 70.97 (clip medians 70.96-71.00), top 1407.96 (1407.94-1407.99), right 1009.01 (1009.00-1009.03), width 938.0, corner radius 42.3 (constrained circle fit, clip medians 42.0-43.1; free fit 41.7-42.9; residual rms 0.1-0.3 px). Most common in G2 is NOT B: G2 uses 4 rectangles plus one-offs. Template D (clips 31,39 on dark field: left 68.8, top 1404.6, right 1011.2, width 942.4, radius 46.5 [46.4-46.8]; clips 24,25 on light field read 0.5 px wider: 68.3/1404.1/1011.7, radius 46.4-47.5; clip36 same sides, top 1400.7): 4 G2 clips (5 with clip36). Template C (72.0/1410.0/1010.0, radius 43.0, 1-px hairline 2 px outside the left edge): G2 clips 26,27,38 (3); G1 clips 03,05,13 (04 by left/top only). Template E (65.1/1417.3/1012.7, radius 46.3): clips 30,32. Template B in G2: clips 35,40 only. One-offs: clip28 71.4/1409.6/1008.3 r42; clip33 75.3/1407.2/1011.7 r~40; clip34 71.6/1406.4/1013.8 r~41; clip37 66.2/1407.2/1013.8 r~35; clip29 (grid field) ~76.7/~1406/~1011 not fitted; G1 one-offs clip02 66.7/1408.3/1010.8, clip08 74.4/1454.8/1001.6 r35. All-32: B is the most common (8 clips), D 8 clips incl. G1 01,15,19, C 7, E 2. The panel runs off the bottom of the frame (no bottom corners). L03 and P07 describe the same rectangle in two coordinate conventions: L03 uses pixel-centre indices (CSS edge - 0.5): 70.51/1407.48/1008.56 = CSS 71.01/1407.98/1009.06; P07 uses CSS edges. Both match my template B to within 0.05 px, and my B radius 42.3 sits between their 42.5 and 42. The builder drawing with CSS needs P07's convention: left 71px, top 1408px, width 938px, border-radius 42px, extending past the bottom. But the question asked for the most common template in G2, and that is template D (68.8/1404.6/1011.2, width 942.4, r 46.5, CSS); B appears in only 2 of 17 G2 clips. Evidence: and.json (per-clip edges, IQRs, radii).

### [P08] Give the panel no stroke, no drop shadow and no glow; the footage meets the field directly.

- Values: Edge 10-90 % width 1.95 px on the dark field (n=1,182 frames) and 2.15 px on the light field (n=142): a plain antialiased step blurred by the codec. Averaged profile across the left edge rises monotonically from outside (1.0 dark / 225.7 light) to inside (25-26) with no bright or dark line. Background next to the panel: light field 225.33 at 30-60 px vs 225.37 within 8 px; above the panel 225.86 at 150-199 px vs 225.86 within 20 px (no shadow). Dark field +1.0 level within 8 px of the edge (codec bleed, not a glow).
- Evidence: n=32 clips, 1,324 full-res frames., panel_profiles. Calibrated decode checked: caption white 255.0, dark field 1.0 ). Codec: VP9 ~0.7 Mbps, so a stroke thinner than ~1 px or a shadow weaker than ~1 level would not be measurable.
- Confidence: high

### [P09] Do not rotate the panel: every panel edge is axis-aligned.

- Values: Per-clip median edge angles: |left| <= 0.245 deg, |top| <= 0.006 deg (n=32 clips, 1,350 full-res frames); 1 fps navigation scan of 2,061 P frames: no rotated panel (all large angles found were graphics or hands crossing the edge, checked by eye). The tilted early panel mentioned in the brief was not found in the 32 in-style clips.
- Evidence: (clip02@833-840: a graphic behind the panel top made the edge finder report up to 3 deg).
- Confidence: high

### [P10] Draw the presenter cut-out (person matte) on top of the panel and the graphics, unclipped: the head rises above the panel top and arms may pass the panel sides.

- Values: Head (cap) top above the panel top: median 78.9 px (p10 64.3, p90 140.2), n=3,985 matte frames; clip medians 58.7-122.4. Matte beyond the panel left/right edges (rows below panel top + 40): 18.8 % of P matte frames, 31/32 clips. Matte above the panel top outside the head columns (raised hands): 11.6 % of frames, 32/32 clips. The cut-out also covers graphics behind it (clip02@48, clip07@0).
- Evidence: Vision person matte every 12th frame of every clip., (matte outline drawn on 8 clips), (clip01@12, clip15@12, clip31@12, clip03@12).
- Confidence: high
- Verified, confirmed (the other study's value): G2: median 78.0 px (p10 62.7, p90 107.1, min 39), n=544 frames, 17 clips. All-32: 78.0 px (p10 64.1, p90 109.0), n=1024 frames, 32 clips. Pixel method (non-field pixels connected to the panel top, any column): G2 76.0 (61, 107), all-32 76.0 (62, 110). By template: B 73.9 (p10 66.5, p90 81.0, n=256, head top y 1334); D 71.6 (59.1, 82.1, n=256); E 68.8 (n=64); C 102.0 (84.3, 116.0, n=224, head top y 1308). Clip medians range 59.1 (clip25) to 119.8 (clip02). P10's median and p10 match (78.0 vs 78.9; 64 vs 64.3); its p90 of 140 does not (mine 107-109) and probably includes raised hands or matte spill from graphics, which my head-column limit excludes (max outliers 733-1405 px are graphic people joined to the matte). L06's 73.5 equals my template-B value (73.9): the overflow depends on the template, because the head top stays near y 1308-1348 while the panel top moves. A builder should take the overflow from the template used: B about 74 px, D about 72, C about 102. Evidence: (per frame),.

### [P11] Use a hard matte edge for the cut-out: no feather, no outline, no shadow.

- Values: Cap silhouette against the light field: 10-90 % edge width 1.6 px median (p10 1.0, p90 2.75), n=1,159 columns in 120 light-field frames from 11 clips; same as the panel edge (2.15 px). No halo or dark rim measured above the cap.
- Evidence: (clip25@984, clip24@936), cutout.cap_edge_10_90_px_light_field. Dark-field cap edges have too little contrast to measure.
- Confidence: medium (light-field frames only, 11 clips)

### [P12] Inside the panel, scale the footage so the eyes are 74.5 px apart and place the eye line 66 px below the panel top, centred.

- Values: P mode, all frames with a face (n=47,781 frames, 32 clips): eye distance 74.5 (clip medians 66.0-77.2); face contour width 163.4 (144.6-169.0); Vision face box 201.6 (181.2-212.9); eye line y 1477 (1443-1497); eye midpoint x 534.6 (474-559); chin y 1619 (1587-1650); cap top 1329 (1287-1357). Relative to the panel top: eye line +66 (p10 38, p90 92), chin +211 (p10 181, p90 241). Eye-line roll -1.6 deg median (speaker posture, not corrected).
- Evidence: .
- Confidence: high
- Verified, confirmed: Panel, G2 (n=544 frames, 17 clips): eye-centre distance (centroids of the Vision eye contours) 74.2 px; pupil distance 76.5 (p10 70.2, p90 80.7); eye line y 1474.0 (p10 1446, p90 1500); eye line 64.6 px below the fitted panel top (p10 38, p90 91); eye x 528.8 (p10 492, p90 560). All-32 (n=1024, 32 clips): pupil 75.8, eye y 1474.5, 64.1 below the top, eye x 534.0. Full, G2 frames at base scale (|s-1|<0.02, n=339): pupil distance 203.3 (p10 193, p90 219), so about 196 as eye-centre distance (contour/pupil ratio 0.965); eye line y 650.2 (589-709); cap top (highest matte pixel) 254 (185-301); chin (lowest face-contour point) 1050.6 (986-1109). Including pushed frames (n=544): pupil 207.3, eye y 643, cap top 231, chin 1055. Ratio: eye distance panel/full-base 0.376 in G2 (full = 2.66x), 0.373 all-32; per clip 0.31-0.39. Footage scale from background registration (panel vs following full frame, 3-9 RANSAC inliers, weak): template B clip40 0.346/0.347, clip35 0.356, template E clip32 0.345, template C clip26 0.378, template D clip39 0.390-0.394 (5 pairs). P12 holds with the eye-centre definition (74.2 vs 74.5; pupils give 76.5). P13 holds for unpushed full frames: about 196 eye-centre, eye y 650 vs 654, chin 1051 vs 1057, cap 254 vs 245 (cap top is lower than 245 unless pushed frames are included). Builders should use eye centres and unpushed frames. P14 holds only as the footage scale for template B (0.346-0.356). The eye-distance ratio is 0.37-0.38, and the ratio changes with the template (C 0.378, D 0.39), so in G2 'full = 2.8x panel' applies to B clips only. With template D the factor is about 2.55x.,.

### [P13] In F, fill the frame with the footage at the base framing: eyes 196 px apart, eye line at y=654 (34 % of height), cap top about y=245, chin about y=1057.

- Values: F frames at base scale (within 2 % of the clip reference; 43 % of F frames, n=9,019): eye distance 196 (clip medians 184-229), face box 524 (499-621), face contour width 433 (414-508), eye line 654 (589-703), eye midpoint x 526 (427-624), chin 1057 (1009-1100), cap top 245 (p10 155, p90 296; n=771 matte frames), cap top = eye line - 2.11 x eye distance. No panel, border, rounded corner or vignette in F.
- Evidence: n=32 clips., (clip01@798, clip10@2240, clip19@2164, clip26@2253, clip32@1200, clip40@1243),.
- Confidence: high
- Verified, confirmed: Panel, G2 (n=544 frames, 17 clips): eye-centre distance (centroids of the Vision eye contours) 74.2 px; pupil distance 76.5 (p10 70.2, p90 80.7); eye line y 1474.0 (p10 1446, p90 1500); eye line 64.6 px below the fitted panel top (p10 38, p90 91); eye x 528.8 (p10 492, p90 560). All-32 (n=1024, 32 clips): pupil 75.8, eye y 1474.5, 64.1 below the top, eye x 534.0. Full, G2 frames at base scale (|s-1|<0.02, n=339): pupil distance 203.3 (p10 193, p90 219), so about 196 as eye-centre distance (contour/pupil ratio 0.965); eye line y 650.2 (589-709); cap top (highest matte pixel) 254 (185-301); chin (lowest face-contour point) 1050.6 (986-1109). Including pushed frames (n=544): pupil 207.3, eye y 643, cap top 231, chin 1055. Ratio: eye distance panel/full-base 0.376 in G2 (full = 2.66x), 0.373 all-32; per clip 0.31-0.39. Footage scale from background registration (panel vs following full frame, 3-9 RANSAC inliers, weak): template B clip40 0.346/0.347, clip35 0.356, template E clip32 0.345, template C clip26 0.378, template D clip39 0.390-0.394 (5 pairs). P12 holds with the eye-centre definition (74.2 vs 74.5; pupils give 76.5). P13 holds for unpushed full frames: about 196 eye-centre, eye y 650 vs 654, chin 1051 vs 1057, cap 254 vs 245 (cap top is lower than 245 unless pushed frames are included). Builders should use eye centres and unpushed frames. P14 holds only as the footage scale for template B (0.346-0.356). The eye-distance ratio is 0.37-0.38, and the ratio changes with the template (C 0.378, D 0.39), so in G2 'full = 2.8x panel' applies to B clips only. With template D the factor is about 2.55x.,.

### [P14] Cut P and F from the same camera frame: F is a fixed 9:16 window 2.8x larger than the panel footage, centred on the panel and bottom-aligned with it.

- Values: Background registration (ECC, person masked) of the last P frame to the first F frame: panel scale / F scale = 0.356 (p10 0.326, p90 0.391), n=23 accepted pairs (cc >= 0.995) in 18 clips; within-clip spread <= 0.012 (one pair 0.04). Rotation between the two views |0.53| deg median with changing sign = 0 within error. The F window in panel coordinates: x 353-735, y 1224-1920 (centre x 544, bottom at the panel bottom). The panel window in F pixels: 2678 x 1400 (p10-p90 2460-2988 x 1275-1552).
- Evidence: (panel region scaled 2.8x beside the F frame: same background, clip10@172/173, clip01@124/125).
- Confidence: medium (scale and window: high; whether one or two cameras was inferred from the background match)
- Verified, confirmed: Panel, G2 (n=544 frames, 17 clips): eye-centre distance (centroids of the Vision eye contours) 74.2 px; pupil distance 76.5 (p10 70.2, p90 80.7); eye line y 1474.0 (p10 1446, p90 1500); eye line 64.6 px below the fitted panel top (p10 38, p90 91); eye x 528.8 (p10 492, p90 560). All-32 (n=1024, 32 clips): pupil 75.8, eye y 1474.5, 64.1 below the top, eye x 534.0. Full, G2 frames at base scale (|s-1|<0.02, n=339): pupil distance 203.3 (p10 193, p90 219), so about 196 as eye-centre distance (contour/pupil ratio 0.965); eye line y 650.2 (589-709); cap top (highest matte pixel) 254 (185-301); chin (lowest face-contour point) 1050.6 (986-1109). Including pushed frames (n=544): pupil 207.3, eye y 643, cap top 231, chin 1055. Ratio: eye distance panel/full-base 0.376 in G2 (full = 2.66x), 0.373 all-32; per clip 0.31-0.39. Footage scale from background registration (panel vs following full frame, 3-9 RANSAC inliers, weak): template B clip40 0.346/0.347, clip35 0.356, template E clip32 0.345, template C clip26 0.378, template D clip39 0.390-0.394 (5 pairs). P12 holds with the eye-centre definition (74.2 vs 74.5; pupils give 76.5). P13 holds for unpushed full frames: about 196 eye-centre, eye y 650 vs 654, chin 1051 vs 1057, cap 254 vs 245 (cap top is lower than 245 unless pushed frames are included). Builders should use eye centres and unpushed frames. P14 holds only as the footage scale for template B (0.346-0.356). The eye-distance ratio is 0.37-0.38, and the ratio changes with the template (C 0.378, D 0.39), so in G2 'full = 2.8x panel' applies to B clips only. With template D the factor is about 2.55x.,.

### [P15] Start every F run at the base framing; any push-in resets on the next cut.

- Values: Scale of the first frame of each F run relative to the clip reference: median 1.000 (p5 0.989, p95 1.011), 96 % within 2 %, n=174 runs in 32 clips. The 7 outside 2 %: clip33@393 and clip33@1522 start at 1.12 and 1.11 (the only clip that starts F runs pushed), and 5 starts at 0.93-1.03 (clip03@389, clip06@1669, clip24@1338, clip27@414, clip36@871) where hands cover the background.
- Evidence: (thumbnail ECC, checked against 270x480 ECC on clip01, 02, 03, 10:
- Confidence: high

### [P16] Push in on about 40 % of F runs, to 1.10x or 1.18x, about the frame centre, and hold.

- Values: F runs ending pushed in: 67/170 reliable ends (39.4 %), in 22/32 clips; 10 clips never end a run pushed in (clip03, 06, 07, 13, 25, 26, 27, 28, 34, 40). Levels: 1.099 (p10 1.084, p90 1.110; n=47 between 1.06 and 1.13) and 1.181 (p10 1.166, p90 1.202; n=18 between 1.15 and 1.21); one-offs 1.046 and 1.302. Zoom fixed point: x 533 (p10 487, p90 564), y 953 (p10 936, p90 1096), n=54. No rotation during a push (|rot| < 0.07 deg, clip01@370-514). 18.7 % of F frames are pushed > 6 %.
- Evidence: (every frame of clip19@1003-1024, clip10@748-765, clip01@391-412).
- Confidence: high
- Verified, open: G2 (17 clips, 141 full runs): 33 animated pushes in 33 runs = 23 % of runs (32 runs = 23 % end pushed). Counting any run whose last-frame scale is >= 1.04 gives 38 %, but this includes registration failures: 7 of 7 one-frame scale jumps I checked by eye were not real. All-32 (254 runs): 69 runs = 27 %. Two level clusters. Low: median 1.087x (range 1.05-1.11, n=19 G2 / 51 all), 12.2 frames = 0.51 s from 1 % to 99 % (range 7.7-17.3), median fitted cubic-bezier(0.23,0.21,0.04,0.75). P17's curve at 13 frames fits with rms 0.035 (normalised progress). High: median 1.169x (1.14-1.21, n=14 G2 / 20 all), 13.5 frames = 0.56 s (8-19), median fitted cubic-bezier(0.08,0.32,0.24,0.82). P18's curve at 16 frames fits with rms 0.054, no better than P17's curve on the same pushes (0.058). Zoom centre median (530, 967) in G2 (p10-p90 x 499-561, y 938-1168); 67 % within 60 px of the frame centre (540, 960). Exceptions are low: clip25 y 1316-1362, clip36 y 1134-1169. 48 % of pushes start on the first frame of the full run; median start 0.32 s after the cut (G2). Holds: two levels near 1.09x and 1.17x (both about 1 % below the claimed 1.10/1.18), centred on the frame for most pushes, a low-level duration of 12 frames / 0.51 s matching P17's 13 / 0.54 s, and P17's curve shape (rms 0.035). Does not hold: the share is 23-27 % of full runs, not 39 % (39 % is reproduced only when artefactual one-frame jumps are counted), and the high-level push lasts about 13.5 frames / 0.56 s, not 16. P18's strongly front-loaded curve is not distinguishable from P17's on my data, and the median high-level fit is a milder ease-out. Duration depends on the 1 %/99 % definition; with 10 %/90 % the medians are about 6.7 frames., (by eye: the footage grows and the caption does not), (by eye: no real scale change),.

### [P17] Animate the 1.10x push over about 13 frames (0.54 s) with a slow start: cubic-bezier(0.37, 0.05, 0.08, 0.81).

- Values: Slow-start family: n=37 pushes in 12 clips (2026-10-10..11-10). Ratio 1.096 (p10 1.068, p90 1.112). Duration 13 frames (p10 10.6, p90 19.2) = 0.54 s (0.43-0.75). Progress after 1 frame 0.03. Median progress at t=0.1..0.9: 0.07, 0.21, 0.46, 0.63, 0.75, 0.84, 0.90, 0.94, 0.975. Free cubic-bezier fit median (0.37, 0.05, 0.08, 0.81), RMS 0.007 progress units; named curves: easeOutQuad 0.069, linear 0.163, easeInOutCubic 0.196, easeOutCubic 0.143. 17/37 start on the first F frame.
- Evidence: Every frame registered (ECC on 135x240, background only)., row 2 (clip10@748-765).
- Confidence: medium (curve fitted per event on 9-19 frames; codec and person motion add noise)
- Verified, open: G2 (17 clips, 141 full runs): 33 animated pushes in 33 runs = 23 % of runs (32 runs = 23 % end pushed). Counting any run whose last-frame scale is >= 1.04 gives 38 %, but this includes registration failures: 7 of 7 one-frame scale jumps I checked by eye were not real. All-32 (254 runs): 69 runs = 27 %. Two level clusters. Low: median 1.087x (range 1.05-1.11, n=19 G2 / 51 all), 12.2 frames = 0.51 s from 1 % to 99 % (range 7.7-17.3), median fitted cubic-bezier(0.23,0.21,0.04,0.75). P17's curve at 13 frames fits with rms 0.035 (normalised progress). High: median 1.169x (1.14-1.21, n=14 G2 / 20 all), 13.5 frames = 0.56 s (8-19), median fitted cubic-bezier(0.08,0.32,0.24,0.82). P18's curve at 16 frames fits with rms 0.054, no better than P17's curve on the same pushes (0.058). Zoom centre median (530, 967) in G2 (p10-p90 x 499-561, y 938-1168); 67 % within 60 px of the frame centre (540, 960). Exceptions are low: clip25 y 1316-1362, clip36 y 1134-1169. 48 % of pushes start on the first frame of the full run; median start 0.32 s after the cut (G2). Holds: two levels near 1.09x and 1.17x (both about 1 % below the claimed 1.10/1.18), centred on the frame for most pushes, a low-level duration of 12 frames / 0.51 s matching P17's 13 / 0.54 s, and P17's curve shape (rms 0.035). Does not hold: the share is 23-27 % of full runs, not 39 % (39 % is reproduced only when artefactual one-frame jumps are counted), and the high-level push lasts about 13.5 frames / 0.56 s, not 16. P18's strongly front-loaded curve is not distinguishable from P17's on my data, and the median high-level fit is a milder ease-out. Duration depends on the 1 %/99 % definition; with 10 %/90 % the medians are about 6.7 frames., (by eye: the footage grows and the caption does not), (by eye: no real scale change),.

### [P18] Animate the 1.18x push over about 16 frames (0.67 s) with a fast start: cubic-bezier(0.0, 0.81, 0.58, 0.93), about easeOutExpo.

- Values: Fast-start family: n=9 pushes in 5 clips (clip01, 19, 24, 31, 39; 2026-10-10..11-10). Ratio 1.174 (1.168-1.183). 16 frames (13-18) = 0.67 s (0.54-0.75). 42 % of the change lands on the first frame. Bezier median (0.0, 0.81, 0.58, 0.93), RMS 0.003; easeOutExpo RMS 0.069, easeOutQuart 0.070, easeOutCubic 0.101. A third, mid-start group (n=8, clip12, 17, 32, 36, 40): 1.097x over 10 frames (0.41 s), bezier (0.28, 0.54, 0.28, 0.84), easeOutQuad RMS 0.056. One ease-in-out push (clip01@393-411, 1.20x, 18 frames, bezier 0.71, 0.10, 0.28, 0.94).
- Evidence: row 1 (clip19@1003-1024) and row 3 (clip01@391-412).
- Confidence: medium (n=9 in 5 clips)
- Verified, open: G2 (17 clips, 141 full runs): 33 animated pushes in 33 runs = 23 % of runs (32 runs = 23 % end pushed). Counting any run whose last-frame scale is >= 1.04 gives 38 %, but this includes registration failures: 7 of 7 one-frame scale jumps I checked by eye were not real. All-32 (254 runs): 69 runs = 27 %. Two level clusters. Low: median 1.087x (range 1.05-1.11, n=19 G2 / 51 all), 12.2 frames = 0.51 s from 1 % to 99 % (range 7.7-17.3), median fitted cubic-bezier(0.23,0.21,0.04,0.75). P17's curve at 13 frames fits with rms 0.035 (normalised progress). High: median 1.169x (1.14-1.21, n=14 G2 / 20 all), 13.5 frames = 0.56 s (8-19), median fitted cubic-bezier(0.08,0.32,0.24,0.82). P18's curve at 16 frames fits with rms 0.054, no better than P17's curve on the same pushes (0.058). Zoom centre median (530, 967) in G2 (p10-p90 x 499-561, y 938-1168); 67 % within 60 px of the frame centre (540, 960). Exceptions are low: clip25 y 1316-1362, clip36 y 1134-1169. 48 % of pushes start on the first frame of the full run; median start 0.32 s after the cut (G2). Holds: two levels near 1.09x and 1.17x (both about 1 % below the claimed 1.10/1.18), centred on the frame for most pushes, a low-level duration of 12 frames / 0.51 s matching P17's 13 / 0.54 s, and P17's curve shape (rms 0.035). Does not hold: the share is 23-27 % of full runs, not 39 % (39 % is reproduced only when artefactual one-frame jumps are counted), and the high-level push lasts about 13.5 frames / 0.56 s, not 16. P18's strongly front-loaded curve is not distinguishable from P17's on my data, and the median high-level fit is a milder ease-out. Duration depends on the 1 %/99 % definition; with 10 %/90 % the medians are about 6.7 frames., (by eye: the footage grows and the caption does not), (by eye: no real scale change),.

### [P19] Start a push either on the cut into F or a short beat later; never animate a pull-out.

- Values: Push start: on the first or second F frame in 44 % of pushes (24/54); otherwise 1.46 s after the cut (p10 0.22, p90 4.96). Animated pull-outs: 1 possible (clip37@594-598, 0.91x, 4 frames) vs 54 push-ins. Level changes inside one F run otherwise happen as hard cuts: 7 snaps (in 1.17-1.19 x3, out 0.83-0.91 x4) in 6 clips.
- Evidence: (kind = push / snap_in / snap_out / pull).
- Confidence: medium

### [P20] Never zoom or move the footage inside the panel.

- Values: P runs registered every 6th frame (panel interior background): scale spread p10-p90 1.4 % median, 4.6 % p90 (method noise; no monotonic push found), n=188 runs. Panel footage scale relative to F stays within 1.2 % across a clip (rule P14).
- Evidence: p_runs;.
- Confidence: medium (method resolves about 2 %)

### [P21] Remove pauses with jump cuts that stay in the same layout: about 6 per minute in P and 3 per minute in F.

- Values: Single-frame jumps of the presenter (difference spike >= 3x the two frames before and an eye jump > 4x the run median motion or a > 6 % face size change): P 187 (5.71 per minute of P time; clip range 0-9.2), F 37 (2.59 per minute of F time). 286 candidates, 224 kept. No dissolve or morph on these cuts.
- Evidence: n=32 clips, every frame., (42 sampled pairs, frame k-1 | k).
- Confidence: medium (thresholds tuned by eye on the sample sheet; small jumps under ~6 px are missed)
- Verified, open: Calibrated estimate, G2 (17.05 panel-min, 7.97 full-min): panel about 6.7 per minute, full about 2.8 per minute, overall about 5.5 per minute. All-32 (32.8 + 14.4 min): panel about 6.5, full about 2.4, overall about 5.3. Each is the loose detector rate times the precision judged by eye. Loose detector: G2 panel 14.5, full 4.0 per minute. Precision by eye: 0.46 in panel (n=23), 0.71 in full (n=7). Raw detector rates by threshold: default G2 panel 8.9 / full 2.5 / overall 6.8 per minute; strict G2 1.9 / 1.25 / 1.7 per minute (all-32 1.9). Sentence starts: 73 % of cuts confirmed by eye (8 of 11), against 10 % for rejected candidates and 10 % for random times. Detector shares: 36 % loose, 44 % default, 69 % strict. My best estimate agrees with P21's per-mode rates (6.7 vs 5.7 panel, 2.8 vs 2.6 full) and with S17's sentence-start share (73 % vs 75 %). It disagrees with S17's 3.1 per minute overall: my overall rate is 5.3-5.5. S17's 'strong ones' 1.07 per minute corresponds to a strict threshold, and my strict detector gives 1.7. The verdict stays open because precision comes from only 30 by-eye judgements, about a third of them unsure, and recall was not measured. A cut with almost no pose change is invisible to the detector, and to a viewer too. For a builder the useful rule is that jump cuts land on sentence starts. Evidence: (rows = candidates, tiles t-2, t-1, t, t+1),.

### [P22] Put layout switches on footage cuts: most P<->F switches also skip time in the talking-head take.

- Values: Using each clip's P->F background mapping, the eye midpoint on the first F frame lands 75 F-px (p10 17, p90 140) from where the last P frame predicts; ordinary frame-to-frame eye motion is 7.6 px (p90 19.7, p99 36.7). 73 % of 141 P->F switches (18 clips) exceed the p99.
- Evidence: (pose differs across the switch while the background matches).
- Confidence: medium

### [P23] Keep the presenter on screen: replace them with other footage or a graphic-only field only for short stretches (under 7 s) and rarely.

- Values: Presenter off screen 1.6 % of runtime: G 9 runs, 1.29-6.67 s (median 4.09), only clip33 and clip34; B 3 runs, 3.62-3.92 s, clip02 (film-style b-roll, 2 runs) and clip36 (screen footage). 29/32 clips never lose the presenter. The presenter never leaves during a P run.
- Evidence: (clip02 r8, r9, r11), (clip36 r3), (clip33, clip34),.
- Confidence: high

### [P24] Optional window mode (W): show the presenter footage inside a phone mock-up on the light field instead of the panel; only in the light/mixed variant.

- Values: W: 3 runs, 2.04-5.38 s (median 4.0), clip33 and clip34 only (2026-11-04/05, both mixed_light_dark_teaching). Face box 368.8 (p10 339.8, p90 419.0; n=146 frames), eye distance 137.8, eye line 673; the phone also slides partly off the left edge (clip33@518-569). No bottom panel while W is shown.
- Evidence: (clip33@518-575, 1190-1244; clip34@1590),.
- Confidence: low (2 clips)

### [P25] Expect 23.976/24 fps camera footage; on a 25 or 30 fps timeline repeat frames instead of interpolating.

- Values: Repeated presenter frames in F runs (difference < 0.15 level): 25 fps clips repeat one frame every 24-25 frames (6/6 clips, 2.7 % of F frames); the 30 fps clip repeats every 5th frame (14.7 %); 23.976 and 24 fps clips show none (25 clips).
- Evidence: (n=32 clips, every F frame).
- Confidence: high

### [P26] Shoot one horizontal camera frame that holds both crops: in F pixels at least 3413 x 1920 (a 3840x2160 UHD frame gives F at 1:1 or smaller), subject centred, cap top about 245 px below the top of the F window.

- Values: In F pixels the panel window is 2678 x 1400 (p10-p90 2460-2988 x 1275-1552), centred on and bottom-aligned with the 1080x1920 F window; a 16:9 frame containing both is >= 3413 x 1920 (height set by F). The F window shows 517 F-px (184 panel px) above the panel top, which is where the overflowing head lives. Headroom above the cap in F: 245 px (p10 155, p90 296). Bottom of F = bottom of panel.
- Evidence: Derived from and. Source resolution itself is not observable.
- Confidence: medium (derived; assumes the panel shows the frame without extra cropping)

### [P27] Do not enlarge footage beyond the reference: F base is already soft; with a new speaker scale the footage so the panel eye distance is 74.5 px and F eye distance 196 px, and use the 1.10 push (not 1.18) when F would need more than 1.0x enlargement of the camera frame.

- Values: F face edges (strong edges in the face box, 10-90 %): 5.45 px median (p10 4.2, p90 6.2), n=23 F frames in 18 clips, vs 1.6-2.2 px for rendered edges (cut-out, panel). The F view magnifies the panel footage 2.81x (1/0.356); a 1.18 push makes it 3.3x. Limits for another framing: eye distance in F between 184 and 229 px (corpus clip range); panel eye distance 66-77 px; eye line 589-703 in F and 1443-1497 in P; head must clear the panel top by 59-122 px (clip medians).
- Evidence: (F_face_edge_10_90_p50),.
- Confidence: medium (sharpness limited by the 0.7 Mbps VP9 encode; a person must judge softness)

### [P28] Treat the corpus as one generation: presenter numbers do not drift over the 33 days.

- Values: First 16 clips (2026-10-10..10-24) vs last 16 (10-26..11-11): P share 71.7 vs 70.0 %, switches 10.4 vs 9.8 /min, F run 2.88 vs 3.35 s, P run 6.34 vs 7.07 s, F runs pushed 47 vs 32 %, panel width 938.2 vs 940.3, panel top 1408.0 vs 1407.6, P eye distance 73.7 vs 74.5, F base eye distance 195.7 vs 195.8, head above panel 75.8 vs 76.9 px. One-offs: clip02 (2026-10-11) two panel geometries; clip08 (10-15) the lowest, narrowest panel; W and G modes only 11-04/05; B footage only 10-11 and 11-07. Light and dark fields use the same panel and cut-out.
- Evidence: .
- Confidence: high

## Constant and variable

CONSTANT: two layouts (panel P, full-height F) in 32/32 clips; every clip opens in P; layout switches are 1-frame hard cuts (497/499); the panel is static, axis-aligned, centred (x 538-544), without stroke, shadow or glow, and runs off the bottom of the frame; the person cut-out is drawn unclipped over the panel and graphics with a hard edge; within a clip the panel geometry is fixed to 0.03 px and the F crop to about 1 %; every F run starts at the base framing; push-ins are about the frame centre, never rotate, and are almost never reversed by an animated pull; footage is 23.976/24 fps. VARIABLE: panel template per clip (left 65-77, top 1401-1455, width 927-948, radius 28.5-46; three recurring templates, no time trend); P/F scale 0.326-0.391 per clip; presenter position inside the crop (eye line P 1443-1497, F 589-703; eye x 427-624) driven by the speaker's posture, not corrected; push-in use per clip (0-100 % of F runs; 10 clips none) and its curve family (slow-start 1.10x vs fast-start 1.18x), chosen per video, not by date; run lengths (P 2.8-14.1 s, F 1.4-6.1 s p10-p90); rare modes (G, W, B) only in 3 clips.

## Open questions

- The brief mentions an early clip with visibly tilted panels. No presenter-panel rotation was found in the 32 in-style clips (max per-clip median 0.245 deg; 2,061 navigation frames screened). If it is a clip outside the in-style set or a graphic panel, say which clip@frame and it can be measured.
- One camera or two? The background of the panel and the full-height view match after a scale of 0.356 (cc >= 0.995), which points to one horizontal camera with two crops, but the rotation estimate wanders +-1.5 deg between pairs. A raw camera file or the project file would settle it.
- Source resolution is not observable; the 3413 x 1920 F-pixel minimum assumes the panel shows the camera frame without extra cropping. A 1920x1080 source would mean F is a 1.8x enlargement, which the soft F edges (5.45 px 10-90 %) do not rule out.
- The push-in curve families (slow-start 1.10x, fast-start 1.18x, mid-start) do not follow dates; which one the new style should use is a taste decision. The slow-start fit's x2 < x1 control point may partly reflect the one-frame start convention.
- Jump-cut counts depend on thresholds tuned by eye; jumps smaller than about 6 px (P) are missed. Matching cuts to transcript pauses (not done) would confirm them.
- The three panel templates differ by 1-6 px. Whether the builder should expose them as a look option or pick one (B is the most common, A the oldest) is a decision for the style author.
- Dark-field cut-out edge softness could not be measured (cap against near-black field); assumed equal to the light-field value.

## What a person must look at or listen to

- Watch a few P<->F switches in playback to confirm they read as hard cuts and that most hide a jump cut:, e.g. clip10@173, clip01@125, clip40@192.
- Watch the two push-in families and judge which feels right for the new style: (clip19@1003-1024 fast start, clip10@748-765 slow start, clip01@391-412 ease-in-out).
- Look at the cut-out overflow above and beside the panel and confirm there is no halo or shadow on a calibrated display:,.
- Confirm by eye that no panel is tilted in the early clips the brief refers to:,.
- Judge the sharpness of the full-height view and decide the largest acceptable enlargement for a new speaker:,.
- Check the by-eye labels of b-roll, graphic-only and phone-window stretches: against and.
- Audio was not used: whether layout switches and jump cuts sit on breaths or pauses needs listening (clip02@393, clip10@173).
