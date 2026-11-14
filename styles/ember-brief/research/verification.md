# Verification

After the nine studies, four independent checkers re-measured every quantity two studies disagreed on, plus the numbers the build depends on, with methods written from scratch. They read the claims, not the studies' code.

Verdicts: **confirmed** the first (or only) claim holds within measurement error; **confirmed (other claim)** a later claim holds; **corrected** no claim holds and the checker's value is used; **open** undecided (listed for a person).

107 quantities: 86 confirmed, 11 corrected, 9 confirmed (other claim), 1 open.

## frame-reflow

Re-measured the two full-frame layouts and the change between them on all 11 clips from the mp4 files, decoded as raw yuv420p and converted from BT.709 limited range in numpy (white card reads raw 235 = 255). Seam: temporal means, dot-contrast and luma-ramp fits. Framing: own Apple Vision tool on 440 frames. Room registration: SIFT and ECC on temporal medians. Mode change: a forward model of the blurred, faded, shifted panel fitted to every frame of 32 changes, plus a sub-pixel caption track; easing families compared in px. Graphics boxes: 118 settled states. Cadence: per-pixel state tests and changed-pixel counts on every frame. Field: rim rows and dot areas against the formula. Main corrections: the mode change is easeInOutExpo over 0.333 s (12 steps of a 36 Hz clock), panel travel is 960 px, peak blur is about 16 px on a half-sine, SPLIT graphics are an 18 fps stream, the field curve sits 1 px higher and its rim is 15 px deep.

### 1. SPLIT seam: start and end row of the footage fade

- Verdict: confirmed (other claim)
- Claims: P03 (presenter): 959.6 to 1039.3 (79.7 px); L04 (layout): field opacity 1 at 963.1, 0 at 1039.4 (76.6 px); fixed 960->1040 fits at RMSE 0.023; C10 (colour): rows 960 to 1040
- Measured: start 960.0 (per-clip 959.8 to 960.9), end 1040.7 (1039.7 to 1041.5), n=11 clips, 1,723 frames (82 to 205 per clip). Row 959 reads 32.07, row 960 32.24, row 1040 85.50, row 1041 85.78 of a 85.85 plateau. Error +-0.5 px on each end.
- Build value: start 960, end 1040 (80 px)
- Method: Temporal mean of raw Y on settled SPLIT frames (every 4th). Luma of dot-free columns on the right wall (x 850-1070) by row, least-squares fit of base + (footage - base) * ramp with free start, end and footage level. Second method: contrast of the 2x2 dot cores against their row neighbours, which does not depend on the footage level.
- Where: clip29@14-1185 (149 frames), clip30@14-1836, clip32@14-1021, clip36@14-1171, all 11 clips
- Note: P03 is the same result within 0.4 px. L04's start of 963.1 is an artefact of its method: the faint dots of the last lattice row (y=1032) are smoothed away over the bright wall (opacity reads 0.044 against 0.106 expected; over the dark left side 0.083). A line through all my dot rows reproduces it (962.7 to 1038.6); the same line through rows 971-1020 only gives 960.5 to 1043.1. Dot opacity at rows 984-1020 reads 0.02 to 0.03 above the linear ramp on both sides; not explained. The ramp travels with the panel during a mode change.

### 2. SPLIT seam: shape of the fade

- Verdict: confirmed
- Claims: P03 (presenter): linear (fit error 0.17-0.44 levels against 0.72-0.85 for smoothstep); L04 (layout): linear; C10 (colour): linear, mean luma slightly convex (t^0.8 fits)
- Measured: linear. RMSE 0.27 to 0.38 raw codes per clip for a linear ramp, 0.71 to 0.93 for smoothstep (n=11 clips). A free exponent t^g fits g = 0.97 to 1.03. Row-to-row luma step 0.67 codes for 80 rows.
- Build value: linear alpha, 0 at y=960, 1 at y=1040
- Method: Same base-luma profile as above, three model shapes fitted per clip on rows 940-1060.
- Where: all 11 clips
- Note: C10's convexity (t^0.8) does not appear on the right wall once dots are excluded; exponent is 1.00 +-0.03.

### 3. SPLIT seam: blend space

- Verdict: confirmed
- Claims: P03 (presenter): gamma-encoded values; L04 (layout): plain alpha blend in code values
- Measured: gamma-encoded (code values). Field opacity read from dot contrast over dark footage (level 57) minus the same over the bright wall (level 86): median +0.008, median absolute 0.019, n=110 row-clip pairs, rows 971-1020. A linear-light blend predicts +0.13 to +0.16 (for example 0.50 against 0.35 at mid ramp).
- Build value: blend in display code values (no linearisation)
- Method: Dot-core contrast per lattice row, left columns x 24-216 against right columns x 852-1056, compared with a forward calculation of an sRGB linear-light blend.
- Where: all 11 clips

### 4. Presenter panel rectangle in SPLIT

- Verdict: confirmed
- Claims: P02 (presenter): 0,960 to 1080,1920, no radius, stroke or shadow; L03 (layout): 0,960 to 1080,1920, full bleed
- Measured: left 0, top 960, right 1080, bottom 1920. Outermost column or row minus the fourth from the edge: left +0.1 to +0.3 codes, right -0.6 to +0.4, bottom -0.1 to +0.1 (11 clips, 55 to 137 frames each). Bottom-left corner pixel has the temporal sd of footage (15 to 40 codes, same as 16 px inside); bottom-right corner reads 29.8 to 44.1, not the field's 32.0. Field rows 950-959 read 32.02 to 32.10: no shadow.
- Build value: 0,960,1080,1920; no radius, stroke or shadow
- Method: Temporal mean and sd of raw Y on settled SPLIT frames (every 6th), rows 1040-1919; edge columns, edge rows and 1, 2, 4, 8 px corner blocks against inner blocks.
- Where: all 11 clips
- Note: The top corners lie in the fade, so a radius there could not be seen. During a mode change the blurred panel fades into the field at the left and right frame edges (the layer is blurred with nothing outside it).

### 5. Face size: face-contour width and eye distance

- Verdict: confirmed
- Claims: P06 (presenter): 280 px contour width, eye distance 123.4
- Measured: contour width 279.3 px (p5 267.7, p95 285.9; clip medians 267.6 to 283.5); eye distance 123.2 px between eye-landmark centroids (118.4 to 126.3), 125.3 between pupils. n=440 frames, 40 per clip, 11 clips, face found in 440. Error +-2 px (landmark jitter).
- Build value: 280 px face-contour width (eye distance 123 px)
- Method: Own Swift tool (, VNDetectFaceLandmarksRequest) on PNG crops of rows 880-1919 of evenly spaced settled SPLIT frames.
- Where: all 11 clips, 40 frames each
- Note: clip39 is 4 % smaller (267.6) as P06 says.

### 6. Eye line

- Verdict: confirmed
- Claims: P07 (presenter): y=1245.5
- Measured: y=1243.4 for eye-landmark centroids (p5 1226.0, p95 1256.6; clip medians 1235.1 to 1250.2), 1241.2 for pupils. n=440, 11 clips.
- Build value: 1244
- Method: Same Vision run.
- Where: all 11 clips
- Note: 2 px above the claim, inside the 15 px spread between clips.

### 7. Horizontal centre of the eyes

- Verdict: confirmed
- Claims: P08 (presenter): x=538 to 540
- Measured: eye midpoint x=537.7 (p5 503.1, p95 565.2; clip medians 528.6 to 546.6); face-contour centre 543.0. n=440, 11 clips.
- Build value: 540
- Method: Same Vision run.
- Where: all 11 clips

### 8. Top of head

- Verdict: confirmed
- Claims: P09 (presenter): y=1038; head above row 1023 in 1.8 % of frames
- Measured: about y=1035, but the matte figure is censored. Vision person matte top: median 1034.1 (n=440), and it sits within 4 px of the caption plate's lower edge (y=1023) in 37 % of frames (clip29 70 %, clip33 78 %, clip35 85 % within 1.5 px). On the 275 frames where the cap is clear of the plate the top is 207 px above the eye line (0.747 face widths). Applied to all frames that gives a top at 1034.7 (p5 1017.5, p95 1051.4; clip medians 1024 to 1049) and above row 1023 in 13 % of frames.
- Build value: 1035 (keep the cap top at or below the caption plate bottom, y=1023)
- Method: Vision person segmentation (accurate) on the same 440 crops, first matte row; cross-check from eye line and face width on uncensored frames.
- Where: all 11 clips
- Note: The 1038 median is right to 4 px, but the claim that the head almost never rises above 1023 is not: when it does the opaque caption plate hides it, so neither a matte nor a luma edge can see it.

### 9. Footage scale and position inside a clip

- Verdict: confirmed
- Claims: P11 (presenter): one transform per clip; scale spread <=0.05 %, offsets <=2.5 px, 0 of 17 returns at another scale
- Measured: constant within my error. First presenter run against last: horizontal scale 0.9984 to 1.0011 (ECC affine, 11 clips), isotropic scale 0.9992 to 1.0048, SIFT+RANSAC scale 0.9990 to 1.0032 (9 clips), offset at the panel centre <=2.2 px. Start against end of the longest run (3 to 22 s): scale 0.9971 to 1.0042. A synthetic 1 % zoom is returned as 1.0094 to 1.0105 by both methods. Error +-0.3 %.
- Build value: one fixed transform per clip; no punch-in, no push
- Method: Temporal medians of 21 frames from the first and the last presenter run, room-only masks (left picture and wall, right wall); SIFT matches with RANSAC similarity and ECC affine.
- Where: clip29@14-55 vs 1143-1184, clip32@14-55 vs 979-1020, clip36@14-55 vs 1128-1169, all 11 clips
- Note: I can exclude a punch-in or push larger than about 0.3 %. I cannot confirm the 0.05 % figure: the room has little texture and the vertical scale estimate moves by +-0.5 % with lighting.

### 10. Mode change: travel of the presenter panel

- Verdict: confirmed
- Claims: P16 (presenter): 960 px (top 960 to 1920); L21 (layout): 960 px; M07 (motion): panel top rests at 980, travels 940 px
- Measured: 957 px (95 % interval 955 to 958) for 520 px of caption travel: slope 1.8396, n=52 frames from 24 mode changes with the panel 30 to 880 px from rest. Rest top is 960.0 (seam fit). With 940 px the panel would lead the caption by a median 0.8 % of the travel (rms 1.0 %); with 960 px the difference is -0.14 % (rms 0.30 %). Error +-3 px, with a likely small low bias once most of the panel is off screen.
- Build value: 960 px (panel top from 960 to 1920)
- Method: Forward model of the panel layer (reference footage, Gaussian blur, 80 px fade, field underneath) fitted to every frame for offset and blur in the frame margins; offset regressed on the caption baseline of the same frame.
- Where: clip30@1031-1039, clip35@742-749, clip39@398-404, clip34@818-821, 24 changes in 11 clips
- Note: M07's 980 and 940 are what a tracker gives that follows a point 20 px inside the fade (it leaves the frame 20 px early); I did not look at their method. The layer itself starts at 960.

### 11. Mode change: easing curve

- Verdict: corrected
- Claims: M07 (motion): cubic-bezier(0.65,0,0.35,1) over 5.9 frames (ease-in-out quart over 7.2 fits equally); P16 (presenter): offsets 0, 4, 16, 64, 204, 598, 861, 960 px (reads as an accelerating exit)
- Measured: easeInOutExpo: p = 2^(20x-10)/2 below x=0.5, 1 - 2^(-20x+10)/2 above. RMSE 0.79 px of caption travel (520 px) over 526 frames of 32 mode changes (15 exits, 17 returns, 11 clips). Alternatives at their own best duration: easeInOutQuint 3.10 px, cubic-bezier(0.65,0,0.35,1) 3.81 px, easeInOutQuart 3.81 px, cubic-bezier(0.87,0,0.13,1) 4.16 px, easeInOutCubic 4.93 px, linear 23 px. The panel follows 960 times the same curve with rms 3.4 px (71 frames).
- Build value: easeInOutExpo (exact formula, not a cubic-bezier)
- Method: Caption baseline (50 % ink crossing, +-0.3 px) on every frame of each change; per family one common duration and one start time per change, least squares in px. Time base is the 36 Hz step clock described under duration.
- Where: clip30@89-96, clip31@215-223, clip33@564-573, clip38@675-684, 32 changes in 11 clips
- Note: P16's numbers are the first half of this curve at one sampling phase (model at 1/36 s steps: 1.5, 4.7, 15, 48, 151, 480, 809, 912, 945, 955, 958.5, 960). The exit only looks accelerating because the panel leaves the frame before the slow second half. The CSS bezier that is usually given for expo, (0.87,0,0.13,1), is 5 times worse than the formula.

### 12. Mode change: duration

- Verdict: corrected
- Claims: L21 (layout): about 7 frames from 1 % to 99 % (median 6 between settled frames); M07 (motion): 5.9 frames; P16 (presenter): 7 frames (range 6 to 8); S03 (structure): active for median 12 frames (p10 7, p90 19)
- Measured: 12.0 animation steps = 10.0 output frames = 0.333 s from first to last movement (fitted duration 12.00 steps for exits and for returns; +-0.1). 1 % to 99 % takes 6.8 steps = 5.6 frames. A step is 1/36 s: the layout clock advances 6 steps every 5 output frames, with one double step per 5 frames (on n%5 = 2 in 11 and n%5 = 3 in 18 of 63 unambiguous cases; never on 0, 1, 4; clip30 on n%5 = 4). 181 steps were counted over 150 frames (1.207 per frame). Movement of 1 px or more is visible on 8 to 9 frames.
- Build value: 0.333 s (10 frames at 30 fps), sampled in real time
- Method: Integer step sequence decoded per change from the caption baseline with the expo curve (residual rms 0.54 px, p95 1.14 px, 170 frame steps); duration fitted on a 0.1-step grid.
- Where: clip32@442-449 (double steps at 443 and 448), clip30@1031-1039 (1034, 1039), clip31@215-222 (218)
- Note: Each claim measures a part: L21 and P16 count frames between small thresholds, M07's 5.9 frames is the duration its too-gentle bezier needs to match the steep middle, S03's 12 frames is the blur dissolve of the graphics (see the next entry). If the 36 Hz stepping is to be imitated, evaluate the animation at step = floor(1.2*frame + 0.6). I would not imitate it.

### 13. Mode change: what S03's 12 frames are

- Verdict: confirmed
- Claims: S03 (structure): a change is active for median 12 frames
- Measured: the blur dissolve of the graphics, not the move. Laplacian energy of the graphics slot (rows 0-880) dips for a median 15 frames at 10 % of the dip depth (p10 10, p90 21) and 10.5 frames at 50 % (p10 8.5, p90 18.5), n=36 dips. The panel and caption move for 10 frames inside that window.
- Build value: graphics blur out and in over about 12 to 15 frames around a 10-frame move
- Method: Mean absolute Laplacian of rows 0-880, x 40-1040 on every frame from 22 before to 22 after each change.
- Where: clip29@114-124, clip32@130-142, clip38@1202-1212, 36 dips in 11 clips
- Note: I found 36 such dips against the 34 mode changes the analysts count; 4 of mine had no trackable caption (clip36@348, clip38@441, clip38@613, clip39@114) and may be scene plates.

### 14. Mode change: exit and return, mirror images?

- Verdict: confirmed (other claim)
- Claims: P16 (presenter): exit accelerates out of frame; M07 (motion): one shared ease-in-out curve both ways
- Measured: the same symmetric curve both ways, so the return is the exit reversed. Expo fit: exits RMSE 0.66 px, duration 12.0 steps (15 changes, 243 frames); returns RMSE 0.88 px, 12.0 steps (17 changes, 283 frames). Example exit clip30@1032-1038, panel px below rest: 1.4, 5.4, 54.0, 171.5, 536.9, 826.5, 919.0. Example return clip30@568-574, px below rest: 940.3, 809.9, 504.3, 160.9, 50.7, 15.5, 0.5.
- Build value: one curve for both directions
- Method: Same fit, split by direction.
- Where: clip30@1032-1038, clip30@568-574, (offsets_by_step)

### 15. Mode change: caption and panel on one progress value

- Verdict: confirmed
- Claims: L21 (layout): caption minus panel progress: median -0.004, p05 -0.020, p95 +0.003; M07 (motion): equal within 0.03
- Measured: yes. Panel offset/960 minus caption offset/520: median -0.0014, p05 -0.0061, p95 +0.0010, rms 0.0030 (n=52 frames, 24 changes). The double steps of the 36 Hz clock land on the same frames for both.
- Build value: one progress value drives both
- Method: Panel offset from the layer fit and caption baseline of the same frame.
- Where: 24 changes in 11 clips
- Note: The caption lands on whole pixels while it moves (within 0.2 px of an integer in 77 % of 142 moving frames).

### 16. Mode change: blur of the presenter panel

- Verdict: corrected
- Claims: P16 (presenter): Gaussian sigma rising 1, 4, 8, 10, 12 px; peak at least 8.9 px in all 17 exits; M08 (motion): about 20 px (coarse) while moving
- Measured: sigma(step) = 15.7 * sin(pi * step / 12) px, rms 1.4 px (n=68 clean frames, 40 exit and 28 return, 28 changes). Medians by step: 0.5: 2.6, 1.5: 4.4, 2.5: 9.3, 3.5: 12.3, 4.5: 13.6, 5.5: 15.6, 6.5: 15.6, 7.5: 14.1, 8.5: 12.5, 10.5: 4.4. Peak (steps 5 to 7.2) median 15.6, range 13.8 to 19.1, n=34. Horizontal over vertical sigma 0.95 (p10 0.78, p90 1.00). Error +-1 px.
- Build value: 16 px peak, half-sine over the move (0 at both ends)
- Method: Same forward-model fit. Sigma is fixed mainly by two hard edges of the layer itself, the left and right frame edges, where the blurred panel fades into the field, and by the footage texture in the strips x<120 and x>=960.
- Where: clip30@86-92 (3.4, 8.4, 11.0, 13.9, 14.6, 15.0, 15.5), clip30@569-574 (16.0, 15.4, 15.1, 14.1, 12.5, 4.4), clip35@743-747
- Note: The blur is tied to time, not to eased progress: it is already 8 px at step 2 when the panel has moved 5 px. It is applied before the 80 px fade: a model with the fade applied after the blur fits the fade zone worse in 15 of 16 clean frames. The blurred layer has transparent surroundings, so the footage darkens toward the left and right frame edges while blurred. Graphics blur (M08's 23 px) was not measured.

### 17. Caption baselines and travel

- Verdict: confirmed
- Claims: L05 (layout): baseline 984 in SPLIT, 1504 in FULL; L21 (layout): 520 px travel
- Measured: 984.04 in SPLIT (983.96 to 984.45), 1503.97 in FULL (1503.68 to 1504.12), travel 519.96 px (519.47 to 520.13), n=21 mode changes with both rest states tracked. Error +-0.3 px.
- Build value: baseline 984 and 1504, travel 520 px
- Method: 50 % crossing of the ink row profile at the lower edge of the text, frames at rest before and after each change.
- Where: clip31@210-228, clip33@559-578, clip34@939-958, 21 changes in 10 clips

### 18. Caption sharpness during the move

- Verdict: confirmed
- Claims: L22 (layout): caption stays sharp (template correlation 0.94-1.00); M08 (motion): caption sharp and readable the whole time
- Measured: sharp, no blur and no motion blur. The lower text edge goes from 90 % to 10 % ink in 2 rows at rest (p90 4, n=433 frames) and in 3 rows while moving 15 to 354 px per frame (p90 5, n=142).
- Build value: no blur on the caption
- Method: Width of the baseline edge of the ink row profile on every tracked frame.
- Where: 32 changes in 11 clips

### 19. Graphic column

- Verdict: confirmed
- Claims: L10 (layout): x 40 to 1040, centred on 540
- Measured: the most common box is 40 to 1040 (14 of 118 settled states, both modes, hook and CTA excluded); centre x median 540.0 in both modes, within 3 px of 540 in 70 of 118. 97 of 118 states stay inside 36..1044. The other 21 are wider: 0 to 1080 full bleed (3), one frame edge touched (4), 20 to 1060 (2), 30 to 1050 (3), and single cases between x=8 and x=1064.
- Build value: column x 40 to 1040, centre 540
- Method: Box of every settled graphic = extent of pixels brighter than the field plate or coloured, on every 3rd settled frame, grouped into states of constant box.
- Where: clip29@127-310 (40,352,1040,1096), clip36@802-850 (39,24,1041,856), clip37@259-364 (0,32,1080,862)
- Note: Not a hard limit: about 1 state in 6 is wider than the column. Cards carry a soft drop shadow that is darker than the plate (24 to 27 against 32) and reaches about 25 px below the card; it is not part of these boxes.

### 20. SPLIT graphic slot

- Verdict: confirmed
- Claims: L11 (layout): centred on y=440 in a slot 0 to 880; tallest box 874 px; no box ends below 874
- Measured: centre y median 440.0 (p25 424, p75 447; 43 of 92 states within 10 px of 440, 66 within 25). Lowest top 0, lowest bottom 872, tallest box 863 px; no state taller than 880. n=92 settled states, 11 clips.
- Build value: centre y=440, slot 0 to 880, box at most 863 px tall
- Method: Same boxes, SPLIT states, rows 0-891 (caption plate excluded).
- Where: clip29@583-634 (102,126,981,804), clip31@370-442 (38,10,1046,872), clip36@802-850

### 21. FULL graphic slot

- Verdict: confirmed
- Claims: L12 (layout): centred near y=730 (median 723.5) in a slot 60 to 1400; boxes up to about 1,340 px tall
- Measured: centre y median 710.5 (p25 643, p75 751); 14 of 26 states within 40 px of 730. Tops 19 to 352 (median 113), bottoms up to 1380 unclipped; tallest unclipped box 1292 px. n=26 settled states of about 15 distinct graphics, 8 clips. Two states of clip34@520-685 run past my lower limit at 1412 (a scene that continues under the caption).
- Build value: centre y=730, slot 60 to 1400 (top 20 when a heading sits above)
- Method: Same boxes, FULL states, rows 0-1411.
- Where: clip31@235-277 (82,88,1042,1380), clip39@442-490 (23,140,1042,1366), clip38@628-667 (77,19,1007,1310)
- Note: Only 26 settled FULL states exist in the corpus, so the 25 asked for are states, not 25 different graphics. Centres scatter more than in SPLIT because several graphics are built from the top down.

### 22. Which mode a graphic gets

- Verdict: confirmed
- Claims: L13 (layout): taller than about 880 px goes to FULL; 16 of 16 FULL segments contain such a box; no SPLIT box above 874
- Measured: no SPLIT state is taller than 863 px (n=92). All 10 FULL segments in which I could measure a box contain one of 1056 px or more (1056 to 1332). 22 of 26 FULL states are taller than 880.
- Build value: graphic taller than 880 px: FULL; otherwise SPLIT
- Method: Same boxes; FULL segments taken from exit to return.
- Where: clip29@120-543 (tallest 1169), clip31@219-338 (1292), clip38@613-680 (1291)
- Note: The rule works per segment, not per graphic: a FULL segment also shows shorter graphics while it lasts (clip29@127-310 is a 744 px card in FULL, followed by an 1169 px one).

### 23. Graphics layer cadence in SPLIT (field plate included)

- Verdict: confirmed (other claim)
- Claims: M01 (motion): updates on 7 of 10 frames, repeats on frame%10 = 4, 6, 9; a 21 fps stream; S28 (structure): 3 updates in every 5 frames, repeats on index mod 5 = 1 or 4
- Measured: the picture advances on 6 of every 10 frames: frames with n%10 = 1, 4, 6, 9 show the state of the frame before. That is an 18 fps stream: state index = floor(0.6*n + 0.3). Test on pixels that change between frame n-1 and n+1: on residues 1, 4, 6, 9 the share still showing the old state is 1.00, on 0, 3, 5, 8 the share already showing the new state is 1.00, on 2 and 7 it is about half (190 to 300 frames per residue, 5 clips, same result for the field and for the graphics slot). Residues 4, 6, 9 are bit-exact repeats (relative changed-pixel count 0.01, 0.01, 0.00 over 623 decades); residue 1 repeats the state but 14 % as many pixels change slightly as on an update. clip30 is shifted by one frame (exact repeats on 3, 6, 8).
- Build value: render every frame; to imitate the reference hold the graphics layer on frames with n%10 in {1,4,6,9}
- Method: (a) per-pixel state test described above on decoded frames; (b) changed-pixel counts per 60x60 block on every frame; (c) which loop time the field's dot boundary shows on each frame, by residue.
- Where: clip32@600-660, clip29@3-39, clip29, clip32, clip33, clip35, clip38 (all SPLIT frames)
- Note: Both analysts saw real things. M01's 4, 6, 9 are the exact repeats, but frame 1 is also a repeat of the state, so the stream is 18 fps, not 21. Each update shows the state for its own real time (steps of 1.67 frames; the field loop stays on the 300-frame clock, best offset 0.0 frames), so nothing slows down in SPLIT.

### 24. Graphics layer cadence in FULL

- Verdict: confirmed
- Claims: M01 (motion): updates on every frame; S28 (structure): updates on every frame (1.6 % repeats)
- Measured: every frame. Share of frames with almost no change is 0.02 to 0.08 on every residue (135 decades); the field plate repeats exactly on 4 to 19 % of frames with no residue pattern.
- Build value: every frame
- Method: Changed-pixel counts per block and exact-repeat share of the margin dots by n%10.
- Where: clip30@93-568, clip37@688-783

### 25. Caption layer and layout move cadence

- Verdict: confirmed
- Claims: M01 (motion): captions and layout moves change on any frame
- Measured: any frame, in both modes. Caption changes start on all ten residues: 130 to 229 change frames per residue in SPLIT, 28 to 50 in FULL, including the residues on which the graphics hold. The layout move runs on its own clock of 36 steps per second (one double step every 5 frames, see duration).
- Build value: captions and layout animate on every frame
- Method: Frames with 400 or more strongly changed pixels in the caption band, by n%10; step decoding of 32 mode changes.
- Where: clip29@586 (caption change on a graphics hold frame)

### 26. Footage cadence

- Verdict: confirmed
- Claims: S28 (structure): presenter layer repeats a frame every 5 frames in 517 of 916 distances, every 10 in 157, every 15 in 66; (summary) (presenter): footage drops to a 24 fps cadence
- Measured: a repeated footage frame every 5 frames where repeats occur: 52 % of 748 repeat-to-repeat distances are 5, 21 % are 10, 8 % are 15. Detected repeats are 10 % of SPLIT frames (6 to 14 % per clip). The phase (n%5) changes from take to take. Motion after a repeat is not doubled (1.14 times the local median against 1.17 before), so it is a hold of slower material, not a dropped frame.
- Build value: no rule needed; play the user's footage at its own rate
- Method: Frames on which fewer than 2 % of the usual number of pixels change in rows 1140-1919 while both neighbours move.
- Where: clip29@644-679 (every 5th), clip29@7-37 (5 and 10 alternating)
- Note: This is a property of the source footage (about 24 fps on a 30 fps timeline in most takes). It is independent of the graphics cadence. Not measured in FULL, where no footage is visible.

### 27. Is the cadence a style choice or an artefact

- Verdict: corrected
- Claims: M01 (motion): a 21 fps stream held on a 30 fps timeline; S28 (structure): changes cued in split mode land on phases 0, 2, 3 of 5
- Measured: an artefact of rendering or conforming. Reasons: (1) the holds are tied to the output frame number from frame 0, the same in 10 of 11 clips, not to the start of any animation; (2) animation time is real time, sampled: the field loop and the mode change start at arbitrary sub-step phases and keep their real-time speed; (3) the rate changes with the presence of the presenter video (18 fps with it, every frame without it), not with the graphic; (4) in the same frames the layout move runs at 36 steps per second and the graphics at 18, both as floor(rate/30 * (n + 0.5)), which is what nearest-frame sampling of a faster and a slower stream produces; (5) one repeat in ten is not bit-exact, which points to an intermediate encode.
- Build value: do not build the cadence into the style; render graphics, captions and layout on every frame
- Method: Synthesis of the measurements above.
- Where: 
- Note: I cannot name the tool that produced it. A person should judge on playback whether the 18 fps look of SPLIT graphics is wanted.

### 28. Field plate: base colour, lattice pitch and origin, full dot

- Verdict: confirmed
- Claims: C05 (colour): #131311 (Y 32); C06 (colour): pitch 12 px, nodes on multiples of 12; full dot radius 2.36 px, colour #434341; L23 (layout): base luma 18.6, 12 px lattice on multiples of 12
- Measured: base raw Y 32.0 (U 127, V 128) = RGB 18.6, 18.8, 16.5. Pitch 11.999 px in x (90 columns) and 11.993 px in y (29 rows), first node centres at x=0.04 and y=0.12 modulo 12 (2,609 dot centroids, residual sd 0.10 and 0.17 px). Full dot area 17.9 px2, radius 2.37 to 2.39 px; core level raw Y 72.9 = RGB 67, 67, 65.
- Build value: #131311 base, 12 px lattice from the frame origin, dot radius 2.36 px, dot colour #434341
- Method: Luma-weighted centroids of dots on a clean FULL patch, line fit of centroid against column and row index; areas from summed coverage per lattice cell.
- Where: clip29@240 rows 1560-1899, seam files for the base level, all 11 clips

### 29. Field plate: moving boundary formula

- Verdict: confirmed
- Claims: C07 (colour): y = 538.6 + 96 sin(3.006u + w) + 34.5 sin(21.99u + 3w) + 23.0 sin(-35.01u + 4w + 1.123); reconstruction RMSE 4.3 px against 12 px rows
- Measured: confirmed, with the constant 1 px high. On 22 frames (5 each in clip29, clip32, clip33, clip35 and 2 in clip38; 381 lattice columns) the first lit row is the predicted row in 381 of 381 columns once the right clock is used (97.4 % with t = frame number in SPLIT). RMSE against the middle of the lit row 2.6 px, which is at the 12 px quantisation floor (3.5 for a perfect formula). Finer test on 36,255 margin dots near the boundary: a node is lit with 50 % probability at 1.05 px above the formula curve, with a spread of only 0.38 px. So the curve is right to about 0.4 px rms after shifting it up by 1.05 px. Lit or not lit within 30 px of the curve is predicted right for 99.5 % of 66,295 node readings in SPLIT with y0 = 537.6, 98.5 % with 538.6 and 97.0 % with 539.6 (FULL, 6,120 readings: 99.2, 98.1, 96.6 %).
- Build value: y0 = 537.6 px (0.28 x 1920) instead of 538.6; amplitudes, frequencies and phases as claimed
- Method: First lit lattice row per column against the formula; then lit / not lit against the vertical distance to the formula curve, fitted with an error function. Display time in SPLIT is the 18 fps clock, (5/3)*floor(0.6n+0.3).
- Where: clip29@353,401,554,1148,1193, clip32@203,293,893,983,1031, clip33@83,440,677,878,1019, clip35@113,212,257,641,1166, clip38@428,1319
- Note: A column counts only if no graphic touches it near the boundary, so most columns come from the outer thirds of the frame. clip38 gave only 2 usable frames, so I added clip33. clip30 was left out of all field tests: its field runs on another phase (10 % match), as C09 notes.

### 30. Field plate: dot size below the boundary

- Verdict: confirmed
- Claims: C08 (colour): rim row of full dots (depth 0-12, one lattice row), then radius 0.98 px at depth 16-28 growing linearly to 2.36 px at 384 px
- Measured: linear growth confirmed: radius 0.96 px at depth 17 to 25, 1.19 at 85, 1.45 at 157, 1.70 at 229, 1.98 at 301, 2.25 at 373, then 2.37 from 379 on (slope 0.0038 px per px; 239,794 dots). The line carries small steps of about 0.1 px at depths 109, 174, 240, 311 and 373. The rim is a band of 15.3 px of vertical depth, not one lattice row: classifying the 2nd and 3rd lit node as full-size by depth < 15.3 px is right in 98.2 % of 14,502 nodes, by depth < 12 px in 87.6 %, by having an unlit neighbour in 88.9 %.
- Build value: full dots for depth 0 to 15.4 px (0.008 x 1920) below the curve, then radius 0.96 px rising linearly to 2.36 px at 384 px
- Method: Dot area (summed coverage per 12 px cell) of the margin columns x=12, 24, 1056, 1068 on all settled frames of 10 clips against depth below the formula curve, 2 px bins.
- Where: all settled frames of 10 clips (clip30 left out)
- Note: The radius figures use depth below the claimed curve; add 1 px for the corrected one (y0 = 537.6). The rim band is given from the corrected curve. With a 15 px rim, two lattice rows are full-size in about 1 column in 4.

### 31. Field plate: loop period and phase

- Verdict: confirmed
- Claims: C09 (colour): 300 frames, phase 0 on frame 0, never resets
- Measured: 300 frames. Margin rim rows at frame n and n+L agree in 98.5 % of 3,975 pairs for L=300, 84.3 % for 299, 85.3 % for 301 (10 clips). Best constant time offset of the formula against 14,483 rim-row readings: 0.0 frames (match 92.4 %, against 78.9 % and 82.7 % at -1 and +1 frame).
- Build value: 300-frame loop (10 s), phase 0 at frame 0
- Method: Rim row of the four margin columns on every settled frame; agreement against lag, and against the formula at shifted times.
- Where: all settled frames of 10 clips
- Note: clip30 is the exception C09 describes; not re-measured in detail.

Open for a person:

- Watch a SPLIT passage with moving graphics: is the 18 fps stepping (holds on frames 1, 4, 6, 9 of every 10) part of the look, or should the pack render every frame? I recommend every frame.
- Mode change length: 0.333 s as it appears on screen, or 0.4 s if the 12 animation steps were meant as 12 frames at 30 fps. The files only show 0.333 s.
- Peak panel blur: measured 15.7 px (+-1). 16 is my rounding; 15 is equally defensible.
- Head top: the cap goes under the caption plate in about 13 % of frames (most in clip29, clip33, clip35). Decide whether the pack should warn when the head rises above y=1023.
- Blur of the graphics during the mode change (M08: up to 23 px) was not measured by this group.
- The 36 candidate mode changes I found against the analysts' 34: clip36@348, clip38@441, clip38@613 and clip39@114 had no caption I could track. Someone should look at whether they are mode changes or scene plates.
- Dot opacity inside the seam fade reads 2 to 3 % above a linear ramp at rows 984 to 1020 on both sides. Too small to see; cause unknown.

## graphic-motion

Re-measured 25 quantities from media/, decoded to yuv444p and converted BT.709 limited to full in numpy (white card reads 255, frame seek checked against a select filter). Motion: per-frame least-squares fit of opacity, Gaussian sigma, vertical offset and scale for 13 entrances (5 clips) and 4 exits (3 clips), all on 12x12 box-filtered luma because one period of the dot field is 12 px; 75 same-layout scene boundaries timed for replacements; ECC registration over 16 holds. Static: bar, card, toggle and outline geometry from coverage integrals and a corner-area radius method checked on synthetic shapes; shadow from field profiles with and without the card; count-up values read from every-frame crops. Every instance is tagged with its layout in the evidence CSVs; durations are output frames at 30 fps.

### 32. entrance: frames from first visible to sharp

- Verdict: confirmed
- Claims: M03 (motion): 10 frames
- Measured: 10 frames (9 or 10 in 13 of 13; n=13 entrances, 5 clips, all in the full-height layout), error +-1 frame
- Build value: 10 frames (0.34 s)
- Method: Per-frame least-squares fit of frame = plate + a * shift_scale(blur(settled - plate)) on 12x12 box-filtered luma (removes the dot field); sharp = first frame from which sigma < 1.5 px.
- Where: clip29@347-357, clip30@1075-1084, clip30@1290-1300, clip33@695-705, clip34@698-713, clip34@963-973, clip36@463-472, clip36@579-589, clip36@653-662
- Note: All 13 are elements ADDED to a standing scene. Light capture cards never arrive that way in the full layout (they come with a layout change or replace something), so none of the 13 is a light capture card: 1 screenshot, 1 label, 1 dark card, 1 illustration, 4 logo tiles, 2 figures, 3 chips.

### 33. entrance: opacity ramp

- Verdict: corrected
- Claims: M03 (motion): roughly linear over the first 5.0 frames (0.15, 0.36, 0.72, 0.88... 0.96 at 5.5)
- Measured: linear over 3.0 frames (2.8 to 3.1 on 7 light elements in 5 clips; three tiles of clip34 read 1.5, 4.3 and 4.8 because a frame is dropped inside their ramp); per-frame medians after first visible: 0.21, 0.52, 0.80, 0.99, 0.99 (n=13); the ramp starts 0.2 to 0.8 frame before the first visible frame. Error +-0.2 frame.
- Build value: opacity 0 to 1, linear, over 3 frames (0.10 s)
- Method: Closed-form a from the fit; straight line through the samples between 0.03 and 0.97.
- Where: clip29@347-349, clip36@579-582, clip36@653-656, clip30@1290-1293, clip33@695-698, clip34@698-700
- Note: On dark-on-dark elements the fitted opacity sits at 0.85-0.9 while the element is blurred (clip30@1077-1083); that bias is the likely source of the claimed slow tail.

### 34. entrance: blur pulse

- Verdict: confirmed
- Claims: M02/M03 (motion): Gaussian, peak sigma 23 px at frame 4.5, 0.02 at frame 10.5
- Measured: peak sigma 23.0 px (22.2 to 25.3, n=9 cards / tiles / figures, 4 clips); 15.0 and 15.4 px on two small chips, 18.9 on one figure, 11.6 on one outlined chip. Per-frame medians of sigma/peak after first visible: 0.25, 0.45, 0.68, 0.88, 0.98, 1.00, 0.93, 0.76, 0.55, 0.21, 0.02 (n=13). Shape: half sine over 10.5 frames from the start of the opacity ramp (RMSE 0.07 of peak; triangle 0.13). Error +-1.5 px on the peak.
- Build value: sigma(t) = 23 px * sin(pi * t / 10.5), t in frames from the start; 15 px for chips
- Method: Same fit; blur shapes compared on 95 samples of 7 entrances aligned on the opacity start.
- Where: clip29@347-357, clip30@1290-1300, clip33@695-705, clip34@698-713, clip36@653-662
- Note: Blur starts at 0, it does not start at the peak.

### 35. entrance: start offset and whether it follows element height

- Verdict: confirmed
- Claims: M04 (motion): +60 px (22 to 81 seen)
- Measured: not one value and not proportional to height: 71.2, 62.4, 56.0 px (three large blocks, 439 to 669 px tall), 39.6 (a 54 px label in the same scene as the 71.2 block), 40.0, 39.7, 39.8, 32.5 (four logo tiles), 34.3 and 31.9 (two figures), 21.8 and 21.8 (two chips of one component), 24.6 (outlined chip); n=13, 5 clips. offset/height runs from 0.09 to 0.73 (r=0.73). Error +-1.5 px. dx 0.
- Build value: 60 px for cards and other large blocks, 40 px for tiles and labels, 32 px for big figures, 22 px for chips
- Method: Median fitted dy over the first three visible frames.
- Where: clip29@347-349, clip30@1075-1077, clip30@1290-1292, clip34@700-705, clip33@695-697, clip36@463-465, clip36@579-581, clip36@653-655, clip34@963-966
- Note: Offsets look like per-component presets (several land near multiples of 8: 72, 64, 56, 40, 32, 24). Identical components give identical offsets (21.8 / 21.8; 39.7 / 39.8 / 40.0).

### 36. entrance: start scale

- Verdict: confirmed
- Claims: M04 (motion): 0.94 (medians 0.93 full, 0.96 presenter)
- Measured: 0.94 on large blocks (0.939, 0.940, 0.939, 0.935; n=4, 2 clips); 0.80 on logo tiles and one figure (0.79 to 0.80, n=5, 2 clips); 0.90 on one figure; 0.70 on chips (0.699, 0.710); 0.61 on two round badges (poor fits). Error +-0.005.
- Build value: 0.94 for cards and large blocks; 0.80 for tiles and figures; 0.70 for chips
- Method: Median fitted scale over the first three visible frames, scale about the element's own centre.
- Where: clip29@347-349, clip30@1075-1077, clip34@700-705, clip33@695-697, clip36@579-581, clip36@653-655, clip30@1405-1408, clip38@533-537
- Note: Each element scales about its own centre: a label and a screenshot that enter together keep 0.94 each and do not move toward each other.

### 37. entrance: travel and scale curve

- Verdict: confirmed
- Claims: M04 (motion): cubic-bezier(0.65,0,0.35,1) over 4.8 frames between frames 3.5 and 8.5
- Measured: progress per frame after first visible (median, n=13): 0, 0, 0, 0.04, 0.27, 0.69, 0.92, 0.96, 0.99, 1; 10 / 50 / 90 % at 3.4 / 4.6 / 5.9 frames. cubic-bezier(0.65,0,0.35,1) over 5.5 frames starting 2.5 frames after the opacity start: RMSE 0.037. easeInOutExpo over 10.25 frames starting with the opacity (start offset median +0.2 frame): RMSE 0.036. Not distinguishable. Scale and offset share one curve. Error +-0.5 frame on the duration.
- Build value: easeInOutExpo over 10 frames, same start as the opacity and the blur (or the claimed bezier over 5.5 frames starting 2.5 frames later)
- Method: Progress = mean of (1 - dy/dy0) and (s - s0)/(1 - s0); one shared duration and a free start per entrance for 11 candidate curves.
- Where: clip29@350-354, clip30@1078-1082, clip34@703-709, clip33@698-702, clip36@656-660
- Note: The travel midpoint coincides with the blur peak. On clip29@349-352 log2 of the progress grows 1.7 per frame (= 20/12): an exponential lead-in, which a cubic does not have.

### 38. exit of one element

- Verdict: confirmed
- Claims: M05 (motion): 7 frames; blur to sigma 18.5 px (10 to 23) over 4.6 frames; opacity 0.99, 0.95, 0.84, 0.43, 0.13, 0.06 at frames 2 to 7; travel -3, -12, -32 px (ease-in cubic to -64); scale 1.000
- Measured: 5 to 7 frames to gone (7, 7, 6, 5; n=4, 3 clips); sigma/peak 0.22-0.33, 0.46-0.74, 0.80-0.93, 1.0 at frames 1 to 4; peak sigma 19.2 px (18.2, 18.9, 19.5, 20.4, read while opacity > 0.5); opacity 0.99, 0.93-0.98, 0.76-0.94, 0.27-0.51, 0.07-0.17, 0.02 at frames 2 to 7; travel -2 to -3 px at frame 3, -6 to -10 at 4, -19 to -29 at 5, -29 to -42 at 6; last readable -42 px at 1.5 to 13 % opacity; scale 0.997 to 0.999. Error +-1 frame, +-2 px sigma.
- Build value: 7 frames: blur 0 to 19 px linear over frames 0-4 then held; opacity 1 to 0 between frames 3 and 7 (ease-in); translateY 0 to -64 px ease-in cubic over 7 frames; scale 1
- Method: Three light cards that leave before the next graphic shows, fitted with a card-matte model (field constant under the card), and one plain removal fitted with the plate model.
- Where: clip29@311-317, clip36@343-348, clip38@409-415, clip36@571-578
- Note: The -64 px end value cannot be seen: the element is below 5 % opacity past -42 px. -64 * (t/7)^3 reproduces every readable sample.

### 39. replacement: do exit and entrance start on the same frame

- Verdict: confirmed
- Claims: M06 (motion): median 0 frames (p90 5.0 presenter, 5.2 full)
- Measured: median 0 frames (n=51 swaps with a region where only the new graphic shows, 11 clips): exactly 0 in 35, within +-1 in 41, largest +19. Three light cards in the full layout leave first and the next graphic starts 6 to 7 frames later.
- Build value: start both on the same frame
- Method: At every same-layout scene boundary of the inventory (n=75): exit start = first frame on which the old-only region differs from the old settled frame; entrance = first frame on which a region 70 px clear of anything old differs from it.
- Where: clip30@1238, clip37@156, clip33@669, clip34@688, clip29@690, clip29@950, clip36@137, clip29@311-318, clip36@343-349, clip38@409-417
- Note: Sequential variant (exit, then entrance) only seen when a light capture card leaves in the full layout (3 of 3 such cases).

### 40. replacement: frames from the old graphic starting to blur to the new one sharp

- Verdict: corrected
- Claims: M06 (motion): 13 frames in presenter layout (p10 9.3, p90 19.7), 11 in full layout
- Measured: two groups, same in both layouts: 7 to 12 frames, median 10, when the new graphic is one part (24 of 75: 21 presenter, 3 full); 14 to 24 frames when the new graphic builds in parts or follows a sequential exit (50 of 75). Median over everything, last part counted: 15 presenter (n=60), 17 full (n=15). Error +-1 frame.
- Build value: 10 frames for a one-part swap (= the entrance length); add the graphic's own stagger for later parts
- Method: Sharp = first frame from which the whole graphics zone equals the new settled frame (12x12 box means, 4x decimated).
- Where: clip30@1238-1248, clip38@511-520, clip29@812-822, clip30@689-699, clip33@425-435, clip34@208-218, clip31@785-805, clip34@688-708
- Note: 13 and 11 are averages over single-part and multi-part swaps, not a constant of the transition. My number counts the last part; the claim tracks the new element, so the two medians are not the same quantity.

### 41. graphics layer update rate by layout

- Verdict: confirmed
- Claims: - (task note): presenter layout: layer updates on about 7 of 10 frames
- Measured: presenter layout: 649 changed / 926 frames inside 60 transitions = 0.70; full layout: 235 / 240 = 0.98. In the presenter layout a count-up advances exactly 2 animation steps per layer update (clip29@555-568: log2 step 2.66 to 2.68 on all 8 updates = 2 * 20/15). In the full layout single frames are dropped: clip34@763 and @767 each advance 2 steps (log2 step 3.25 and 3.33 against 1.67 to 1.68 on the 5 neighbouring frames); 11.7 to 12 steps pass in 10 output frames (clip34@761-771, clip38@418-428).
- Build value: report and build durations in output frames at 30 fps; do not copy the repeats
- Method: Mean absolute step of the 12x12-box graphics zone between consecutive frames inside each transition (repeat if < 0.06 luma levels); exact step sizes from the sharp digits of count-ups.
- Where: clip34@760-771, clip38@417-429, clip29@555-568, clip34@702-703
- Note: Every duration in this file is in real output frames. In animation steps the reference runs about 1.17 to 1.2 steps per output frame, so a 12-step ease reads as 10 frames and a 15-step ease as 13.

### 42. hold: a settled graphic does not move or scale

- Verdict: confirmed
- Claims: M20 (motion): scale 1.00000 (0.99985 to 1.00030), dy 0.00 px (-0.05 to +0.05), n=138 holds of 24 frames or more
- Measured: 8 static graphics held 68 to 328 frames (median 118): scale 0.9999 to 1.0002, shift <= 0.01 px. 8 more whose content changes during the hold (rows light up, a video plays, an illustration animates): apparent scale 0.996 to 1.002, apparent shift <= 0.7 px, none a rigid move. n=16 graphics, 10 full layout and 6 presenter layout, 10 clips. A synthetic 0.2 % zoom with 0.5 px shift is recovered as 0.2 % and 0.499 px.
- Build value: no motion during a hold: scale 1, offset 0
- Method: Affine ECC registration (OpenCV) of the first settled frame against the middle and the last frame of the hold, each a 3-frame mean.
- Where: clip29@132-304, clip36@264-338, clip38@332-660, clip38@1000-1194, clip30@1094-1230, clip30@1642-1718, clip30@1746-1846, clip29@1126-1194

### 43. highlight bar on light paper: blend

- Verdict: confirmed
- Claims: G08 (graphics): multiply blend of the accent; C12 (colour): accent at partial opacity drawn under the ink
- Measured: multiply. Two bars overlapping read (256, 119, 68) = #FF7744; multiply of the single bar (254, 174, 128) with itself predicts (253, 119, 65), stacking two normal-blend bars predicts (255, 137, 73): G is 18 levels apart and lands on multiply (n=7 rows of 56 px). On grey paper #ABB9B8 the bar reads #A98E75: R is unchanged (169.2 against 170.9; a normal-blend bar would give 217) and G and B give the same multiply strength (0.399, 0.405). Error +-2 levels.
- Build value: mix-blend-mode multiply, colour = accent #FF6B1B at the strength below
- Method: Row medians through the overlap of two bars; bar and paper medians on a grey text strip.
- Where: clip29@296-306, clip35@430-440
- Note: On white paper with black ink the two claims give the same pixels and cannot be told apart there; they differ where bars overlap and on paper that is not white, and both such cases follow multiply. clip30 is the exception: normal blend over the text (ink turns brown). On dark paper: normal blend, bar #6F3210 on #080A09, alpha 0.415 (8 of 9 segments, clip30).

### 44. highlight bar on light paper: strength per clip

- Verdict: confirmed
- Claims: C12 (colour): 0.55, 0.55, 0.43, 0.39, 0.36, 0.33, 0.32 (clip29, 36, 32, 38, 37, 30, 39); G08 (graphics): 33 to 55 percent; #FEAE80 to #FFCFB6 on white
- Measured: clip29 0.55 (#FEAE80), clip36 0.55 (#FEAE80), clip32 0.42 (#FABB9A on #FAF8F6), clip35 0.40 (#A98E75 on #ABB9B8), clip38 0.38 (#FFC6A9), clip37 0.36 (#FDC7A9 on #FDFDF6), clip30 0.33 (#FFCDB4, normal blend), clip39 0.32 (#FFCFB6). Median 0.39 (n=8 clips, 12 bars). G and B agree within 0.016; flat-interior sd 0.9 to 1.5 levels in G. Error +-0.01.
- Build value: 0.40 as the default
- Method: Median colour of the non-ink bar pixels and of the paper beside the bar; strength = (1 - bar/paper) / (1 - accent/255) per channel. Accent re-read on three solid fills: #FF6B1B.
- Where: clip29@296-306, clip36@334-340, clip32@186-192, clip32@498-504, clip35@430-440, clip38@1040-1044, clip37@148-153, clip30@680-686, clip39@212-220
- Note: No trend by date (0.55, 0.33, 0.42, 0.40, 0.55, 0.36, 0.38, 0.32 in publication order). One value per clip.

### 45. highlight bar: height and vertical placement

- Verdict: confirmed
- Claims: G09 (graphics): about the line pitch (72 to 80 px), from 30-35 px above the x-height line to 16 px below the baseline
- Measured: light paper: height median 80 px (57 to 94, n=10 bars in 6 clips; one more bar is 46 px and covers only the lower half of a heading); top 35 px above the x-height line (28 to 42, n=8), bottom 15 px below the baseline (13 to 20, n=10). Dark paper: 68 to 70 px (n=9, clip30). Bars on adjacent lines overlap by 14 px in clip29 (rows 800 to 813). Error +-1 px on the edges, +-3 px on the text lines.
- Build value: bar from 35 px above the x-height line to 15 px below the baseline (about 80 px on 26-30 px x-height text)
- Method: Bar edges at 50 % coverage in the blue channel; x-height line and baseline from the rows whose ink count exceeds 45 % of the densest row.
- Where: clip29@255-270, clip30@680-686, clip32@186-192, clip36@334-340, clip37@148-153, clip39@212-220, clip38@1040-1044, clip30@1215-1230
- Note: Height follows the text size loosely (2.0 to 3.0 times the x-height), it is not one pixel value.

### 46. highlight bar: corner radius

- Verdict: corrected
- Claims: G09 (graphics): 9 px (light median 9.1, 6.8 to 13.3)
- Measured: 0.15 of the bar height (0.142 to 0.162 per clip): 11.4 px on a 76 px bar (clip29), 11.9 on 79 (clip30), 12.3 on 82 (clip32), 14.3 on 88 (clip39), 6.5 on 46 (clip38); n=13 corners, 5 clips. Error +-0.8 px (method checked on synthetic rounded rectangles with blur and noise: 9 reads 8.9 to 9.8, 11.5 reads 11.2 to 11.8).
- Build value: radius = 0.15 * bar height (12 px on an 80 px bar)
- Method: Corner-area method: the coverage missing from a square corner equals r^2 * (1 - pi/4); blue-channel coverage, not clipped, corners with ink inside the box dropped.
- Where: clip29@255-270, clip30@680-686, clip32@186-192, clip32@498-504, clip38@1040-1044, clip39@212-220
- Note: 9 px is about 2.5 px low for the common 76 to 82 px bars.

### 47. highlight bar: wipe

- Verdict: confirmed
- Claims: G11 (graphics): 5 % to 95 % in 3 frames; first sliver 2 frames earlier; full about 6 frames after the sliver; M13 (motion): about 4 frames from first visible to 97 %; ease-in-out cubic over 3.4 frames
- Measured: hard-edged wipe from the left (coverage left of the edge 0.95 to 1.0). Width in px per frame from the frame before the first sliver: 346 px bar: 6, 82, 266, 328, 341, 345; 62: 0, 6, 48, 62; 603: 4, 13, 45, 163, 557, 587, 594, 597; 597: 4, 10, 129, 412, 545, 581, 591, 593; 268: 2, 8, 21, 67, 181, 257, 263, 265; 594: 2, 19, 53, 148, 380, 515, 563, 586, 589; 274: 0, 5, 9, 25, 77, 249, 266, 271, 273; 342: 3, 9, 29, 92, 238, 323, 329, 341. 5 % to 95 %: median 3.35 frames (2.3 to 4.6); first visible to 97 %: median 4.5 (2 to 6); n=8 bars, 5 clips, full layout. Fraction against frames from the 50 % point: 0.013, 0.027, 0.16, 0.66, 0.93, 0.98, 0.99 at -3... +3. easeInOutExpo over 9.0 frames RMSE 0.026; cubic-bezier(0.65,0,0.35,1) over 4.75 frames 0.028; linear over 2 frames 0.033. Error +-0.3 frame.
- Build value: left-to-right wipe, easeInOutExpo over 9 frames (5 % to 95 % in 3.3 frames)
- Method: coverage = (paper - frame)/(paper - bar) in the blue channel on the pixels that are bar-coloured in the settled frame; width = sum of the column coverages.
- Where: clip29@187-192, clip29@280-283, clip32@160-167, clip32@481-488, clip36@283-290, clip37@122-130, clip39@133-141, clip39@144-151
- Note: G11's three numbers and M13's 4 frames all hold. M13's cubic over 3.4 frames is too short as a full duration: the same curve needs 4.75 frames. One slow variant: clip38@1027-1037, about 10 frames, near linear. Presenter layout: same durations with repeated layer frames (99 px bar: 5, 77, 77, 98).

### 48. highlight bar: start against the spoken word

- Verdict: confirmed
- Claims: G11 (graphics): 5 % frame is +5.6 frames after the word onset (11 of 16 between +4.4 and +8.0)
- Measured: 5 % point +4.2 frames after the transcript onset of the first highlighted word (median; 2.6 to 6.5; n=10 bars, 7 clips); first sliver about +3.5; 50 % point +6.2 (4.8 to 8.8). Error: +-2 frames from the transcript, +-0.2 from the wipe.
- Build value: start the 9-frame wipe 1 frame after the word onset (so its 5 % point lands 4 frames after the onset)
- Method: Sub-frame 5 % and 50 % times from the per-frame widths against the word start in tran.
- Where: clip29@187, clip29@281, clip32@160, clip32@481, clip36@283, clip37@122, clip38@1027, clip39@134, clip39@144, clip35@425
- Note: The 1.4-frame gap to the claim is the difference between a sub-frame 5 % time and a whole-frame one, inside the transcript error. In clip39 the bar on the licence name starts on the word 'free', not on the name.

### 49. light capture card: corner radius

- Verdict: confirmed
- Claims: G05 (graphics): 28 px (median 28.5, range 20.8 to 43.6, n=15); C15 (colour): 28 px (clip29@240)
- Measured: median 28.5 px over 12 cards in 9 clips (range 20.5 to 43.7): clip29 28.5, clip36 29.6 (full) and 25.0 (presenter), clip33 29, clip35 24.6 top / 30.2 bottom, clip30 24.9, clip38 20.5 and 24, clip37 35 (37.5 top, 32.5 bottom), clip39 35.4, clip32 43.7 and 43.7. Four corners of one card agree within 2 px on 5 cards. Error +-1 px.
- Build value: 28 px
- Method: Corner-area method on luma coverage, ink inside the card (not connected to the outside) filled to paper.
- Where: clip29@230-260, clip32@180-192, clip32@498-504, clip36@300-320, clip37@140-153, clip38@385-405, clip38@1000-1024, clip39@190-215, clip30@670-686, clip33@300-340, clip36@1070-1120, clip35@1100-1140
- Note: Constant within a card, different between cards, also inside one clip (clip38 20.5 and 24; clip36 29.6 and 25.0). No stroke: the luma steps from field to paper in 1 to 2 pixels on 11 of 12 cards (the twelfth shows the 2 px light border of the captured page itself). Fill = page background: #FFFFFF (clip29, clip30, clip36, clip38), #FEFDF7 (clip37), #F7F9FC (clip38), #FAFAFA (clip35), image fills (clip32).

### 50. light capture card: shadow

- Verdict: confirmed
- Claims: C15 (colour): black, alpha 0.52, Gaussian sigma 36 px, offset y +22 px (clip29, 1 card); G05 (graphics): field 7.8 levels darker 2 px under the card than 58 px under it; gone by about 50 px
- Measured: clip29: alpha 0.49, sigma 34 px, offset +29 px (RMSE 0.28 luma levels, bottom and side profiles); clip38: alpha 0.59, sigma 34 px, offset +23 px (RMSE 0.27). Darkening of the 24.5-level field 8 / 24 / 48 / 72 / 96 px under the bottom edge: clip29 9.2 / 6.6 / 3.2 / 1.4 / 0.7; clip38 10.5 / 6.8 / 3.0 / 0.9 / 0.6 and 10.3 / 7.0 / 2.9 / 1.4 / 0.6; clip36 11.7 / 8.1 / 4.3 / 2.2 / 1.2; clip37 13.7 / 10.5 / 6.0 / 3.2 / 1.9; reach (0.5 level) 96 to 147 px. n=5 cards, 4 clips; a sixth (clip38@560-580, a card that later tilts) reads 16.5 at 8 px. Error +-0.05 alpha, +-3 px sigma, +-5 px offset.
- Build value: black, alpha 0.52, blur sigma 36 px (CSS blur 72 px), offset y +24 px
- Method: 12x12 box means remove the dot field exactly (the bare field then reads 24.4 to 24.6 everywhere). Profiles of the field against distance from the card edge, with and without the card; fit of 1 - alpha * Phi((offset - d)/sigma) below and beside the card.
- Where: clip29@200-300, clip38@380-405, clip38@1000-1024, clip36@300-340, clip37@130-153
- Note: C15 is confirmed on its own card and on one more. G05's 'gone by 50 px' is too short: 3 levels remain at 48 px and the shadow reaches about 100 px. Two taller cards (clip36, clip37) carry a stronger and longer shadow (x1.25 and x1.5 at 8 px), so the shadow is not one constant across clips. Offset needs a top-edge profile to pin it better than 22 to 29; no clean one exists in the clips I could use.

### 51. redrawn dark app card: fill, stroke, radius

- Verdict: confirmed
- Claims: G14 (graphics): warm fills #211F1B / #1B1A15 / #1D1A19 / #262724 in clip29, 35, 36, 38, 39; neutral #181818 / #1F1F1F / #2A2A2A in clip31, 34, 37; stroke 2 px #2B2827 to #404040; radius 30.6 px (26 to 32.8); C14 (colour): panel #211F1B in 10/11 clips, frame #1B1A15, strokes 2 px at luma code 57-62; app mock-ups keep neutral #181818, #1F1F1F, #2A2A2A, #404040
- Measured: 12 cards in 9 clips. Fill, warm (R-B = 6): #1B1A15 (clip29 outer frame, clip35, clip39), #211F1B (clip32). Neutral (R-B = 0): #181818 (clip34 settings window, clip37 checklist), #18181A (clip34 app window), #1F1F1F (clip31). A fourth clip34 card reads #13120F just inside its top edge (a darker header band, not counted). Between: #1C1A19 (clip37 settings), #252523 (clip36). Stroke width 2.1 px (per-card medians 1.65 to 2.7; n=37 edges). Stroke colour: warm cards #2B2827 (clip29), #2C2A26 (clip32), #262522 (clip35); neutral cards read #353535 (#343432 to #363634 on 5 cards in clip34 and clip37). Radius median 30 px (25 to 35.5, n=18 corners on 9 cards). Error +-1 level on fills, +-3 levels on strokes, +-1.5 px on radius.
- Build value: default: fill #1B1A15 (frame) with #211F1B panels, stroke 2 px #2B2827, radius 30 px
- Method: Median RGB profile across each straight edge: field level, stroke peak and integrated width, fill 5 to 16 px inside; radius = the quarter arc that lies best on the stroke.
- Where: clip29@665-685, clip31@140-200, clip34@140-200, clip34@880-935, clip34@535-590, clip37@630-675, clip37@185-225, clip36@770-800, clip32@590-610, clip35@300-365, clip39@690-765, clip38@632-660
- Note: Pattern: by what is redrawn, not by date. The neutral greys appear where a real app's dark interface is redrawn (clip31 sidebar, clip34 app and settings windows, clip37 settings and checklist); house cards (toggle row, prompt box, profile, decision, chat) are warm. In publication order: warm, neutral, warm, neutral, warm, warm-ish, neutral, warm. The neutral stroke does not read #404040 at 2 px: the profile carries 61 luma-px of excess, which is #363636 at 2 px or #404040 at 1.5 px; the two cannot be separated at this bitrate.

### 52. big figure: size, position, colour

- Verdict: confirmed (other claim)
- Claims: G17 (graphics): digits 109 to 227 px by character count (median 166), centred on x=540, #F2EEE8; T27 (type): cap height 100 to 227 px by available room (median 169)
- Measured: cap height 109 to 227 px, median 168 (n=14 figures, 9 clips). By character count: 1 char 216, 183; 2 chars 227, 227, 205, 173, 163, 150; 3 chars 153; 4 chars 166, 160; 6 chars 136; 7 chars 169; 'x of y' 109. Ink width = 0.75 * cap * characters (0.72 to 0.80, n=7; '11' is 0.47). Centre x 539 to 544.5 on 9 of 14; the other 5 sit beside a logo, icon, list or grid. Ink #F2EEE8 within 1 level on the 12 figures whose core colour was read. Error +-2 px.
- Build value: cap = min(room, 1170 / characters) px, with room = 168 px by default and 205 to 227 px for a 1 or 2 character figure that stands alone; centre x 540; #F2EEE8
- Method: Connected components within 30 levels of #F2EEE8, cap height = median height of the tall glyphs.
- Where: clip29@626, clip29@941, clip33@109, clip33@741, clip34@1144, clip35@917, clip37@856, clip38@500, clip39@99, clip31@776, clip36@563, clip38@1264
- Note: Character count alone does not set the size: 7 characters are larger (169) than 6 (136) and 3 (153). The only width-limited figure measured is the 7-character one (878 px of ink at cap 169, the full column), which fixes the 1170 / n ceiling; every other figure is sized by the room its scene leaves.

### 53. big figure: count-up curve and length

- Verdict: corrected
- Claims: M14 (motion): easeInOutExpo over 7.50 layer updates = 10.7 output frames in presenter layout; ease-in-out quart RMSE 20 times worse
- Measured: easeInOutExpo, confirmed by a constant ratio between consecutive readings on both tails: log2 step of the remaining distance per frame 1.67, 1.67, 1.68, 1.68 (clip34, = 20/12), 1.38, 1.28, 1.34, 1.34, 1.31, 1.32 (clip38, = 20/15), 1.30, 1.28, 1.22 (clip35), 2.66 to 2.68 per layer update (clip29, = 20/7.5). A quart or cubic gives steps that shrink toward the middle. Length in output frames: big figures 12.8 (clip38@417-429), 12.9 (clip35@769-778), 13.3 (clip29@555-568, presenter layout, 8 layer updates in 13 frames); an in-card value 10.2 (clip34@761-771). Error +-0.7 frame. Fitted on the output-frame axis the curves are not separable (RMSE 0.020 to 0.034 for expo, 0.020 to 0.040 for quart) because dropped and repeated frames distort that axis.
- Build value: easeInOutExpo over 13 frames (0.43 s) for a big figure; 10 frames for a value inside a card; digits replaced each frame with thousands separators and suffix kept
- Method: Values read from native every-frame crops. clip34 (two values) is sharp on every frame; in clip38, clip35 and clip29 the first 5 to 8 readings are blurred digits, read by eye.
- Where: clip34@760-771, clip34@757-766, clip38@417-429, clip35@768-778, clip29@555-568
- Note: Curve: confirmed. 7.5 layer updates: confirmed. 10.7 output frames: not what the frames show; the same count spans 13 output frames in the claim's own example (clip29@555-568). Readings: 48,200 48,202 48,206 48,257 48,381 48,775 50,002 51,306 51,405 51,436 51,446 51,450 (clip34@760-771); 2 10 26 63 187 1,000 1,603 1,843 1,938 1,975 1,990 1,998 2,000 (clip38@417-429); 0 1 1 4 9 58 83 93 97 99 100 (clip35@768-778); 26 26 164 1,039 1,039 6,598 6,598 30,452 38,496 38,496 39,763 39,763 39,963 40,000 (clip29@555-568).

### 54. outline box: stroke and radius

- Verdict: confirmed
- Claims: G13 (graphics): accent stroke about 5 px (median 4.8, 2.9 to 7.9), radius 21 to 27 px on rows (median 25.1), no fill
- Measured: stroke median 5.1 px (n=12 boxes, 7 clips) in two groups: 4.35 to 5.2 px (clip31, clip32, clip34; 8 boxes) and 7.0 to 7.4 px (clip29, clip37, clip39; 3 boxes), one at about 8 (clip36). Outer radius on rows and items 20, 20, 22.8, 24.2, 27.2, 31 (median 23.5, n=6); 6 to 7 px on four tight boxes, 16.5 and 35 where the box follows a screenshot region or an image. No fill (centre equals the surface under it). Colour #FF6B1C at the peak of the thick strokes. Error +-0.3 px stroke, +-1.5 px radius.
- Build value: stroke 5 px accent, radius 24 px on a row, no fill
- Method: Stroke = integral of accent coverage across each straight edge (does not depend on blur); radius = the quarter arc that collects most accent.
- Where: clip29@380, clip31@137, clip31@427, clip32@562, clip34@504, clip34@636, clip34@771, clip36@303, clip37@667, clip39@204
- Note: The claim's groups by clip are the same as mine; my widths are 0.5 to 1.5 px larger because the integral counts the anti-aliased edge pixels.

### 55. toggle: proportions and switch

- Verdict: confirmed
- Claims: G15 (graphics): track 1.8 times as wide as tall (1.78 to 1.83); knob 0.78 of the track height
- Measured: track width / height 1.82 (1.80 to 1.87; n=12 toggles, 3 clips): 149.5 x 82.2, 111 x 61 (six), 130.7 x 72.6 (two), 127.7 x 69.5, blue 105 x 56 and 113 x 61. Knob diameter 0.82 of the track height (0.78 to 0.87): 66.5 on 82.2, 50.1 on 61, 60 on 72.6; inset 6 to 8.5 px. On #FF6B1B, knob #F2EEE8 (clip29) or #FEFDF8 (clip34); off track #5E6268, #4B4A4B. Switch (n=5, all presenter layout): knob at 0.70 to 0.88 of its travel on the first changed frame, 0.96 to 1.0 two frames later, done in 3 frames (1 to 4); two toggles of the six-tile grid flip inside one layer update. Track colour changes in step with the knob. Error +-1 px on sizes.
- Build value: track 1.82: 1, knob 0.80 of the track height, inset 0.10; switch in 3 frames, ease-out, colour with the knob
- Method: Track size from coverage integrals through the middle rows and columns; knob diameter = 2 * sqrt(soft cream area / pi); knob centroid and track colour per frame.
- Where: clip29@680, clip29@1085, clip34@930, clip37@560, clip37@668, clip29@654-657, clip34@889-893, clip37@516-520, clip29@1034-1045
- Note: Knob ratio: 0.82 by area against 0.78 by box, a 2 px difference; 0.80 covers both. The switch curve cannot be resolved: each flip gives one or two intermediate samples and the layer repeats frames; 'most of the travel on the first frame' is all the data shows.

### 56. staggers inside one graphic

- Verdict: confirmed
- Claims: M16 (motion): 2 to 3 frames apart in reading order; gaps 1.0 to 4.2, median 2.2
- Measured: median gap 2.1 frames (n=24 gaps in 7 graphics, 6 clips): four logo tiles 2.35, 2.05, 1.7 (clip34, full layout); six toggles 2.12, 1.05, 2.1, 2.19, 2.57 (clip29); three sidebar rows 2.40, 2.27 (clip31); three logo tiles 2.11, 4.62 (clip36); three icon tiles 1.09, 1.71 (clip33); eight tiles 0.55, 1.22, 1.96, 2.06, 0.1, 0.8, about 1 per tile (clip35); thumbnails in three stacked cards 4.25, 5.41, 5.0, 5.0 (clip31, full layout). Reading order in 7 of 7. Error +-0.5 frame in the full layout, +-1 in the presenter layout (repeated layer frames).
- Build value: 2 frames (0.07 s) between consecutive parts, reading order
- Method: Presence of each part = projection of (frame - plate) on (settled - plate) inside the part's box; gap = difference of the 50 % times. Toggles: frame at which each track turns accent. Tiles in clip34: half-opacity times from the per-frame fit.
- Where: clip34@696-712, clip29@1034-1045, clip31@157-165, clip36@929-937, clip33@96-100, clip35@1166-1173, clip31@245-257
- Note: Two other spacings exist: about 1 frame in an 8-tile grid and about 5 frames between three stacked cards.

Open for a person:

- The published clips drop or repeat graphics frames (about 1.17 to 1.2 animation steps per output frame in the full layout; in the presenter layout the graphics layer advances 2 steps per update and repeats on 30 % of frames). Decide whether the style should render at the published durations (10-frame entrance, 13-frame count-up, as given in 'use') or at the longer authored ones (12 and 15 steps). A person watching playback can tell whether the repeats in the presenter layout read as intended stutter.
- Entrance offset and start scale differ by component (60 / 0.94 for cards, 40 / 0.80 for tiles, 32 / 0.80-0.90 for figures, 22 / 0.70 for chips). I measured 13 elements; a person should confirm the grouping by eye before it becomes four presets.
- Highlight strength: one value per clip between 0.32 and 0.55 with no trend. 0.40 is the median; a person should pick between the two strong clips (0.55) and the five weaker ones (0.32 to 0.42).
- Neutral dark cards: stroke reads #353535 at 2 px, which is the same pixels as #404040 at 1.5 px. Needs a higher-bitrate source to settle.
- Card shadow: 0.52 / 36 px / +22 to +29 px fits clip29 and clip38; clip36 and clip37 cards are 1.25 and 1.5 times darker under the bottom edge. No frame shows their field without the card, so I could not fit them.
- Count-up readings on blurred frames (first 5 to 8 values of clip38@417-423, clip35@768-774, clip29@555-562) were read by eye from enlarged crops; the sharp clip34 values carry the curve verdict.
- Light capture cards entering in the full layout always come with a layout change or replace another graphic. Their own entrance offset could not be isolated; the 60 px default comes from other large blocks.
- Toggle switch curve: 3 frames with one or two intermediate samples. A clip with a toggle in the full layout would settle it; none exists in the 11 clips.

## title-cta-audio

Re-measured the opening title build, title geometry and exit, the call-to-action geometry, build and trigger, the 8 section headings and four audio quantities on all 11 clips with code written from scratch. Video: Y plane straight from the decoder mapped limited to full range (a synthetic VP9 white card reads 255; the ffmpeg RGB path reads 253). Motion: per-frame least-squares fits of opacity, offset, scale, rotation and Gaussian blur of settled templates, with model-free checks (ink centroid, strip tilt, frame differences). Geometry: 50 percent ink edges on 10-frame medians. Audio: 48 kHz WAV, numpy/scipy, a cross-clip estimate of the shared music bed, ffmpeg ebur128. Timing against words uses the audible onset where a pause allows it. Nothing was listened to or watched in playback.

### 57. opening build: first trace / first readable / settled frame of each part

- Verdict: confirmed
- Claims: H11 (hook): illustration 2/3/8, line 1 2/3/8, line 2 5/7/12, line 3 7/8/15, line 4 12/12/17; M09 (motion): first visible 3, 3, 7, 8, 12; complete on 17
- Measured: Identical in 11/11 clips (line 4: n=10). Illustration: opacity 0.011 on f2, 0.149 on f3-4 (scale 0.9237, sigma 3.2), 1.00 on f5-6 (0.9596, sigma 15.0), f7 scale 0.9960 sigma 2.6, f8-9 scale 0.9997 sigma 0.5, exact from f10. Line 1: 0.015 on f2; f3-4 opacity 0.198, -0.413 flat cap, sigma 2.30; f5-6 0.994, -0.21, 13.5; f7 -1 px, 2.2; settled f8. Line 2: 0.028 on f5-6; f7 0.287, -0.40, 3.4; f8-9 0.992, -0.13, 11.5; f10-11 -1 px, 1.5; settled f12. Line 3: f8-9 0.056, +0.42, 2.2; f10-11 0.497, +0.37, 5.2; f12 1.00, +0.085, 7.7; f13-14 +1 px, 1.1; settled f15 (on f7 opacity is 0.002, at the noise floor). Line 4: f12 0.077, +0.42, 2.2; f13-14 0.786, +0.34, 7.7; f15-16 0.999, +0.05, 5.3; settled f17. Spread across clips: opacity <= 0.02, sigma <= 0.5 px, scale <= 0.0015. Error: opacity +-0.01, offset +-0.5 px (+-1 px at sigma > 10), sigma +-0.3 px.
- Build value: first readable frames 3, 3, 7, 8, 12; settled 8, 8, 12, 15, 17 (3-line title: 15)
- Method: Own least-squares fit per frame: frame minus empty field (frames 0-1) = sum over parts of opacity x Gaussian blur x shifted (lines) or scaled (illustration) settled template (frames 22-31); sub-pixel shift with cubic weights; every frame 0-20 of all 11 clips. Per-frame tables in
- Where: clip29@0-20, clip30@0-20, clip31@0-20, clip32@0-20, clip33@0-20, clip34@0-20, clip35@0-20, clip36@0-20, clip37@0-20, clip38@0-20, clip39@0-20
- Note: Both claims describe the same samples. Line 3 has no measurable trace on frame 7.

### 58. stepping of the graphic layer during the opening (new states only on some frames)

- Verdict: confirmed
- Claims: H10 (hook): new states on frames 2, 3, 5, 7, 8, 10, 12, 13, 15, 17; repeats on 4, 6, 9, 14, 16; 18 states per second; M09 (motion): layer updates on 3, 5, 7, 8, 10, 12, 13, 15, 17
- Measured: Confirmed in 11/11: mean abs frame-to-frame change over the field is 2.7-48 luma levels on 3, 5, 7, 8, 10, 12, 13 (15: 0.8-7.3; 17: 0.7-4.2 in the 10 four-line clips; clip39 ends on 15), 0.6-1.1 on frame 2, and 0.01-0.16 on 4, 6, 9, 14, 16. Frame 11 changes by 0.5-0.7 (16x16 block p99.9 1.6-2.1 against 82-97 on frame 10): a codec refresh, not a state. 3 states per 5 frames = 18 per second.
- Build value: do not reproduce; render the build at the full frame rate
- Method: Frame-to-frame mean abs luma difference and 16x16 block p99.9 over rows 0-950, all 11 clips, frames 1-24; no model.
- Where: clip29@1-24, clip30@1-24, clip31@1-24, clip32@1-24, clip33@1-24, clip34@1-24, clip35@1-24, clip36@1-24, clip37@1-24, clip38@1-24, clip39@1-24
- Note: New finding: the phase of the 3-in-5 cadence is per scene, not global (clip30 call to action: new states on T0+0, 2, 4, 5, 7, 9, 10; the other clips 0, 1, 3, 5, 6, 8, 10). Some elements do not step at all: 4 of 8 heading entrances and the title exit of clip29 and clip32 change on every frame. This supports reading the stepping as an artefact of pre-rendered 18-state-per-second graphic clips.

### 59. opening build timeline in seconds of real time (start and duration of each part)

- Verdict: confirmed
- Claims: H11 (hook): parts start at about 0.05, 0.15, 0.25, 0.35 s; each lasts about 0.20 s; M10 (motion): lines staggered by about 3 frames
- Measured: One tween per part, ease expo.inOut. Lines: duration 0.320 s (0.333 s fits within 5 percent of the cost), line 1 starts at 0.007 s, stagger 0.1000 s (0.099-0.101 for every easing tried), so starts 0.00 / 0.10 / 0.20 / 0.30 s. Illustration: starts at -0.004 s (use 0.00), 0.34 s. Because expo.inOut is flat at both ends, visible change runs from start + 0.05 s (opacity 2 percent) to start + 0.27 s (within 1 px): that visible span is what the hook claim describes. Build visually complete at 0.57 s. Absolute phase uncertain by +-0.03 s (one state = 55.6 ms); stagger and duration do not depend on it. n = 516 line states and 88 illustration states from 11 clips.
- Build value: expo.inOut, 0.33 s per part; starts: illustration 0.00 s, line 1 0.00 s, line 2 0.10 s, line 3 0.20 s, line 4 0.30 s
- Method: State k (first frame of each state) placed at t = k/18 s; joint fit of slide, opacity and blur of all four lines on one clock with a constant stagger, for 8 easing families.
- Where: clip29@0-20, clip30@0-20, clip31@0-20, clip32@0-20, clip33@0-20, clip34@0-20, clip35@0-20, clip36@0-20, clip37@0-20, clip38@0-20, clip39@0-20
- Note: Equivalent within error: power4.inOut, 0.23 s, starts 0.05 / 0.15 / 0.25 / 0.35 s (fit score 0.027 against 0.019). The bed enters at 0.050 s and the voice at about 0.11 s (see audio entries).

### 60. title line slide: direction and distance

- Verdict: confirmed
- Claims: H12 (hook): 0.40 x cap height; light lines from above, heavy lines from below; no scale; M10 (motion): first-update offset 0.41 x cap height
- Measured: Direction: lines 1-2 start above (dy < 0), lines 3-4 start below (dy > 0) in 43/43 lines, 11 clips. First visible state: 0.413 x flat cap height through the origin (per line 0.413, 0.397, 0.421, 0.418; n=43; rms 0.7 px; a fixed-pixel distance misses by 7.7 px rms) = 0.40 x the ink height with overshoot. Start of the underlying tween: 0.425 x flat cap height (0.30 em if the cap height is 0.70 em). 22-33 px for light lines, 29-70 px for heavy. Error +-0.5 px.
- Build value: 0.425 x flat cap height (0.30 em); light lines from above, heavy lines from below
- Method: Offsets from the per-frame fit, regressed on the flat cap height measured separately on the settled frames.
- Where: clip29@0-20, clip30@0-20, clip31@0-20, clip32@0-20, clip33@0-20, clip34@0-20, clip35@0-20, clip36@0-20, clip37@0-20, clip38@0-20, clip39@0-20
- Note: The two claims differ only in which cap height they divide by (ink height with overshoot against flat cap height).

### 61. title line blur against slide progress

- Verdict: confirmed
- Claims: H14 (hook): sigma = 52.7 px x r x (1 - r), peak about 13 px; M10 (motion): peak 13.4 (line 1), 11.4 (line 2), 7.6 px (lines 3-4)
- Measured: sigma = 52.7 x p x (1 - p) px with p the eased progress: peak 13.18 px (fit over 368 visible line states, rms 0.42 px, worst 1.9 px). Sampled peaks: line 1 13.52 px (13.20-13.68, n=11), line 2 11.50, lines 3-4 7.71 and 7.70: the lower values are the same curve sampled at another phase. The blur is in pixels and does not scale with the cap height (53 to 168 px caps give the same sigma). A time-based bump (sin) fits worse.
- Build value: sigma = 13.2 px x 4 p (1 - p)
- Method: Same joint fit; blur shapes 4p(1-p), sin(pi u) and sin^2 compared.
- Where: clip29@0-20, clip30@0-20, clip31@0-20, clip32@0-20, clip33@0-20, clip34@0-20, clip35@0-20, clip36@0-20, clip37@0-20, clip38@0-20, clip39@0-20
- Note: First states read 2.2-3.4 px where the formula gives 0.2-2 px (low opacity, low signal).

### 62. title line slide curve (fitted against alternatives)

- Verdict: corrected
- Claims: H14 (hook): easing not fitted; M10 (motion): continuous curve medium confidence, not named
- Measured: expo.inOut over 0.32 s: slide rms 0.25 px, blur rms 0.42 px, worst slide error 1.4 px. power4.inOut over 0.23 s: 0.30 / 0.62 / 1.4. power3.inOut over 0.19 s: 0.34 / 0.69 / 1.6. Ease-out alternatives are 2.5 times worse: power3.out 0.67 / 1.07 / 3.0-3.6, expo.out similar. No overshoot: no state past rest. The same ease fits the call-to-action keyword decisively (1.3 px rms against 4.3 for power4.inOut and 18 for power3.out).
- Build value: expo.inOut (GSAP naming), 0.33 s
- Method: Joint fit as above, 8 easing families, free start and duration each.
- Where: clip29@0-20, clip30@0-20, clip31@0-20, clip32@0-20, clip33@0-20, clip34@0-20, clip35@0-20, clip36@0-20, clip37@0-20, clip38@0-20, clip39@0-20
- Note: No curve was claimed, so neither claim is graded wrong. Samples are 55.6 ms apart, so in-out families cannot be separated by the slide alone; expo.inOut is preferred because it also wins on the keyword.

### 63. title line opacity against slide progress

- Verdict: confirmed
- Claims: H14 (hook): opacity reaches 1 by the time half the slide is left
- Measured: opacity = min(1, p / 0.24) with p the eased slide progress: rms 0.005, worst 0.023 over 516 states. Opacity is 0.5 at 12 percent of the travel and 1.0 from 24 percent on (0.26 with the duration fixed at 0.333 s). Illustration: slower, about min(1, p / 0.4) (0.149 at scale 0.9237, 1.00 at 0.9596).
- Build value: opacity = min(1, p / 0.25)
- Method: One-parameter test added to the joint fit.
- Where: clip29@0-20, clip30@0-20, clip31@0-20, clip32@0-20, clip33@0-20, clip34@0-20, clip35@0-20, clip36@0-20, clip37@0-20, clip38@0-20, clip39@0-20
- Note: Slide, blur and opacity all follow one eased progress value.

### 64. illustration slot

- Verdict: confirmed
- Claims: H05 (hook): x 0-1080, y 0-580, cover fit, hard top and sides; L15 (layout): illustration in the top 560 px of the field
- Measured: Columns 0-1079 in 11/11. Rows from 0 (7/11 clips; in the other 4 the picture is at field level at the top). The 98th-percentile excess over the field is back under 2.5 levels at row 579-580 in 8/11 and at 567-571 in 3/11 with dark floors. Pictures are darker than the field in their black areas (-6 to -10 levels) right up to the top and side edges, with the same level in the first 4 rows or columns as 20-40 px inside: hard edges, no fade. The entrance scales the whole 1080 x 580 rectangle about (539.5, 289.5): fitted shift at scale 0.924 is under 0.07 px, so the centre is within 1 px.
- Build value: x 0-1080, y 0-580
- Method: Settled frames 34-43 minus empty field; row and column extents; edge levels; the scale centre from the entrance fit.
- Where: clip29@34-43, clip30@34-43, clip31@34-43, clip32@34-43, clip33@34-43, clip34@34-43, clip35@34-43, clip36@34-43, clip37@34-43, clip38@34-43, clip39@34-43
- Note: Cover fit itself cannot be verified without the source pictures: only that no letterbox is visible in 11/11.

### 65. illustration bottom fade

- Verdict: open
- Claims: H05 (hook): linear fade into the field over about 80 px, rows 500 to 580
- Measured: A fade exists and ends at row 580 (see slot). Its start and shape cannot be separated from the picture content: on the two clips with enough bright, vertically flat columns the normalised profile falls roughly linearly and reaches the field at 565-580 (clip38: 0.51 at row 500, 0.23 at 540, 0.04 at 570, 0 at 580; clip32 ends near 569), but the profile already falls between rows 460 and 500, which may be the floor of the picture. Linear, smoothstep and quadratic ramps fit within 0.03-0.06 rms of each other.
- Build value: linear alpha ramp over rows 500-580 (the claim), start row uncertain by +-20 px
- Method: Mask profile on columns that are flat in rows 380-460; only 2-3 clips qualify.
- Where: clip38@34-43, clip32@34-43, clip30@34-43
- Note: To settle: one source illustration file, or a title whose picture has a flat bright band across rows 400-580.

### 66. illustration entrance and hold

- Verdict: confirmed
- Claims: H13 (hook): scale 0.924 to 1.000 about (540, 290), opacity 0 to 1, rise-and-fall blur, no translation; M11 (motion): scale 0.92 to 1.00, blur 3.2 / 15.5 / 2.4 / 0.2, dy within 3 px
- Measured: Scale 0.9237 (0.9229-0.9243) on f3-4, 0.9596 on f5-6, 0.9960 on f7, 0.9997 on f8-9, 1.0000 from f10; opacity 0.149 / 1.00; sigma 3.2 / 15.0 (14.9-15.1) / 2.6 / 0.5 px; shift |dx|, |dy| <= 0.3 px on every frame. 0.924 is the first visible state: the tween starts at 0.919 (expo.inOut, 0.34 s, blur 15.0 px x 4p(1-p), scale rms 0.0005). Held: against frames 22-31 the last held frames (44 to 127) fit scale 1.0000, shift 0.00 px, mean abs difference 0.05-0.19 levels in 11/11: static, no drift or zoom.
- Build value: scale 0.92 to 1.00 about the slot centre (540, 290), opacity min(1, p/0.4), blur peak 15 px, no translation, static while held
- Method: Five-parameter fit (opacity, scale, blur, dx, dy) on rows 0-520 at half resolution; hold tested by fitting the last held frames against the first settled ones.
- Where: clip29@0-20, clip30@0-20, clip31@0-20, clip32@0-20, clip33@0-20, clip34@0-20, clip35@0-20, clip36@0-20, clip37@0-20, clip38@0-20, clip39@0-20, clip29@exit-3, clip33@exit-3, clip39@exit-3
- Note: M11 blur 15.5 against 15.0 here: within error.

### 67. title block geometry

- Verdict: confirmed
- Claims: H07 (hook): centre y 765, top 593, bottom 937, height 344, no line wider than 905; T21 (type): cap top of line 1 at 594, last baseline 936, max 905; L15 (layout): top 593, bottom 938, max 904
- Measured: Flat edges at 50 percent ink, y in pixel-edge units: cap top of line 1 592.0-595.4 and last baseline 935.9-937.9 in the 7 four-line titles that fill the height (flat height 341.6-344.9); 599.4-600.8 and 930.0-933.0 in clip29, clip35, clip37 (329-334); clip39 (3 lines, fills the height) 594.0 to 930.0. Centre of that span 765.4 (762.0-766.2). Widest line 904.7 px (clip35) and 903.2 (clip37); widest light line 720.1 (clip30). Ink centre x 542.0 (539.0-548.4, n=43). 4 upper-case lines, 2 light then 2 heavy, in 10/11; clip39 has one heavy line. Error +-0.3 px.
- Build value: see the layout rule entry: line-box stack 359.4 px high centred on y = 766.1; max ink width 905 px
- Method: Median of frames 22-31 minus empty field; per column the 50 percent crossing of top and bottom, mode over columns = flat cap top and baseline.
- Where: clip29@22-31, clip30@22-31, clip31@22-31, clip32@22-31, clip33@22-31, clip34@22-31, clip35@22-31, clip36@22-31, clip37@22-31, clip38@22-31, clip39@22-31
- Note: The three claims agree; differences of 1-2 px are ink box against flat edge.

### 68. title cap heights (light and heavy)

- Verdict: confirmed
- Claims: T19 (type): light 53-77 px, heavy 69-94 px, set per video; H09 (hook): light 54-80 px, heavy 71-98 px, light + heavy = 151 px, 14 px clear ink between lines
- Measured: Flat cap height: light 52.96-77.56 px (median 63.0), heavy 68.92-94.18 (median 81.0; 167.8 in the 3-line title); both lines of a pair equal within 0.1 px. Ink height with overshoot: light 54-80, heavy 71-98. Flat light + heavy = 146.9 (146.5-147.1) in 8 titles, 141.5-143.2 in clip29, clip35, clip37. Heavy / light ratio 0.889-1.778 (median 1.31).
- Build value: flat cap heights (type T19); sizes follow from the layout rule entry
- Method: As above.
- Where: clip29@22-31, clip30@22-31, clip31@22-31, clip32@22-31, clip33@22-31, clip34@22-31, clip35@22-31, clip36@22-31, clip37@22-31, clip38@22-31, clip39@22-31
- Note: Both right: type measured flat caps, hook measured ink boxes (2-4 px larger from round-letter overshoot). clip31, clip34 and clip37 carry the same copy at three different ratios (1.200, 1.255, 1.436), so the ratio is an editorial choice.

### 69. title line pitch and the gap between the light and heavy pairs

- Verdict: confirmed
- Claims: T20 (type): pitch 1.246 x cap (light), 1.213 x cap (heavy), 17 px from 2nd light baseline to heavy cap top; H09 (hook): 14 px clear ink between lines
- Measured: Pitch light 1.241 x flat cap (residual max 0.8 px, n=11), heavy 1.212 x (0.8 px, n=10); baselines land on whole pixels. Gap from the 2nd light baseline to the heavy cap top 14.8-17.2 px (27.2 in clip39) = 0.086 x light cap + 0.129 x heavy cap (residual max 1.0 px): it scales with the sizes, it is not a constant. Simplest exact description: every line sits in a box 1.2377 x cap (light) or 1.2120 x cap (heavy) high with the caps centred, boxes stacked with no extra space: rms 0.72 px, worst 2.0 px over 86 edges.
- Build value: line box 1.2377 x cap (light), 1.2120 x cap (heavy), caps centred in the box (line-height 0.87 em and 0.85 em if the cap height is 0.70 em)
- Method: Regression on the 43 measured lines.
- Where: clip29@22-31, clip30@22-31, clip31@22-31, clip32@22-31, clip33@22-31, clip34@22-31, clip35@22-31, clip36@22-31, clip37@22-31, clip38@22-31, clip39@22-31
- Note: T20 is right; its fixed 17 px is the value at typical sizes. The hook 14 px is the ink gap with overshoot.

### 70. title layout rule (4 strings to sizes and baselines)

- Verdict: corrected
- Claims: H09 (hook): sizes set by hand, no rule found; T19 (type): set per video, not by a formula
- Measured: Rule: (1) choose ratio r = heavy cap / light cap (default 4/3; a single heavy line uses 2r). (2) capL = 359.4 / (2 x 1.2377 + nH x 1.2120 x r), capH = r x capL, with nH the number of heavy lines: the line-box stack is 359.4 px high (359.1-359.7 in 8 titles). (3) if the widest ink line exceeds 905 px, scale both sizes by 905 / width. (4) stack the boxes, caps centred in each, stack centred on y = 766.1, lines centred on x = 540. Test with the measured ratio of each title: cap heights within 0.17 px and every baseline within 2.0 px in 10 of 11 titles (clip35 and clip37 are the width-limited ones and come out exact); clip29 is 3.7 percent smaller than the rule (3.1 px in cap height, 7.0 px in a baseline). Worst error over all 11: 7.0 px. Test from the strings alone (r = 4/3, plus: if the wider light line exceeds 720 px shrink the light pair and give the height to the heavy pair): 4 of 11 titles within 2 px, median cap error 1.9 px, worst 15.0 px in cap height and 34 px in a baseline (clip32, whose heavy lines are smaller than its light lines).
- Build value: the rule above with r as a per-title parameter, default 1.333, allowed 0.89-1.78
- Method: Box model and fill-height constant fitted on the 11 titles, then each rule run on the natural width / cap of every line.
- Where: clip29@22-31, clip30@22-31, clip31@22-31, clip32@22-31, clip33@22-31, clip34@22-31, clip35@22-31, clip36@22-31, clip37@22-31, clip38@22-31, clip39@22-31
- Note: Both analysts are right that the ratio is hand-set, but everything else is a fit-to-box: with r given the layout is determined to 2 px. The 720 px light limit rests on one title (clip30, 720.1 px).

### 71. title exit: start against the spoken words

- Verdict: confirmed
- Claims: H16 (hook): starts 2 frames after the onset of the next clause first word (median +2.2, range -3.0..+7.4); S06 (structure): +1.0 frame after the second sentence first word (8 clips, -3.0..+4.8)
- Measured: First changed frame: clip29@114, clip30@87, clip31@82, clip32@130, clip33@68, clip34@93, clip35@82, clip36@72, clip37@91, clip38@103, clip39@47 (same frames as both analysts). Against the transcript I reproduce both medians (+2.2 over 11, +1.0 over the 8 sentence cases). Against the audible onset of that word (speech resuming after the pause before it): +0.7, -1.8, +0.4, +1.4, +0.9, +1.9, -0.3, -1.3, +2.0 frames in 9 clips, median +0.7, range -1.8..+2.0; clip31 has no pause to measure; clip39 is ambiguous (the exit is 0.4 frames before "over").
- Build value: start the exit on the first word of the next clause, 0 to +2 frames
- Method: Exit start from a per-frame difference to the settled title; word onset from the 2.5 ms speech-presence track (3 bands against the cross-clip bed estimate).
- Where: clip29@exit, clip30@exit, clip31@exit, clip32@exit, clip33@exit, clip34@exit, clip35@exit, clip36@exit, clip37@exit, clip38@exit, clip39@exit
- Note: The two claims differ by less than the +-2 frame error of the transcript. Machine word times run about 2 frames early after a pause.

### 72. title exit motion

- Verdict: confirmed
- Claims: H17 (hook): title and illustration leave together in 6-8 frames: blur to about sigma 22 px over 4 frames with opacity held, then fade while rising about 40 px
- Measured: Per frame after the start, median (range) over 8-9 clips: +0 opacity 0.99, sigma 6.7 (0.1-11.4); +1 0.99, 9.7 (4.7-18.4); +2 0.97, 16.2 (12.9-20.1), rise 0.7 px; +3 0.86 (0.67-0.98), 20.3, rise 2.7; +4 0.71 (0.40-0.93), 22.4 (20.4-24.8), rise 10 (3-23); +5 0.30 (0.08-0.53), 23.0, rise 30 (11-43); +6 0.12, 20.6, rise 42; +7 0.05, 18.4, rise 45; gone on +8. Title block and illustration carry the same blur on the same frame (median difference 0.6 px, clip33, clip35, clip38, clip39). No stagger between lines (one template for the whole block fits with r2 0.95-0.99).
- Build value: 8 frames (0.27 s): blur 0 to 22 px over the first 4 frames with opacity held, then opacity to 0 and a rise of 45 px over the last 4 frames
- Method: Three-layer fit per frame (title block, illustration, next graphic as a nuisance layer), pixels under the next graphic down-weighted. Illustration layer usable on clip29, 30, 32, 33, 35, 36, 38, 39; title block on clip33, 35, 38, 39..
- Where: clip29@113-122, clip30@86-95, clip32@129-138, clip33@67-76, clip35@81-90, clip36@71-80, clip38@102-111, clip39@46-55
- Note: On clip29 and clip32 (next graphic full height) the exit changes on every frame; on the others it steps. clip31, clip34, clip37 are covered by the next graphic and were not measured.

### 73. call to action line 1 ("Comment") geometry

- Verdict: confirmed
- Claims: H23 (hook): box x 349-735, y 274-339, cap height 66 px; T24 (type): ink x 349 to 735 (387 px), baseline y=338; L16 (layout): box left 348, top 274, right 736, bottom 340
- Measured: Identical in 11/11: ink x 348.6-735.7 (width 387.0-387.1, centre 542.2), ink rows 274-339, C height 65.8 px (round letter, 274.2 to 340.0), stem baseline at y = 339.0 in pixel-edge units (last full ink row 338). Position: that box in 9/11; +198 px in clip29 (picture above), -140 px in clip35 (picture below). Light weight, sentence case. Error +-0.2 px.
- Build value: ink x 348.6-735.7, C top 274.2, baseline 339.0 (C height 65.8 px)
- Method: Median of the last 10 frames minus empty field, 50 percent ink edges.
- Where: clip29@last-10..last, clip30@last-10..last, clip31@last-10..last, clip32@last-10..last, clip33@last-10..last, clip34@last-10..last, clip35@last-10..last, clip36@last-10..last, clip37@last-10..last, clip38@last-10..last, clip39@last-10..last
- Note: The three boxes are the same box in three conventions.

### 74. call to action line 2 (quoted keyword) geometry

- Verdict: confirmed
- Claims: T25 (type): cap height 116 px, cap top 80 px under the baseline of line 1, upper case in curly quotes, heavy; H23 (hook): cap height 118 px, cap top 418, baseline 537, 78 px under line 1; L16 (layout): y 414 to 539
- Measured: Flat cap height 116.2 px (116.15-116.27) in 10/11; cap top 419.8, baseline 536.0, cap top 80.6-80.8 px under the line 1 baseline. Quote marks span 415.0-476.6. Ink rows 415-537. Width 439.9-803.7 px at full size, ink centre x 542.8-542.9. clip34 (9 letters): cap height 93.8 (0.807 x), ink 923.2 px wide (x 80.8-1004.0), cap top 411.2, baseline 505.0. Error +-0.2 px.
- Build value: cap height 116.2 px, cap top y = 419.8, baseline y = 536.0 (pixel-edge units)
- Method: As above; quote marks separated from the capitals by their bottom edge.
- Where: clip29@last-10..last, clip30@last-10..last, clip31@last-10..last, clip32@last-10..last, clip33@last-10..last, clip34@last-10..last, clip35@last-10..last, clip36@last-10..last, clip37@last-10..last, clip38@last-10..last, clip39@last-10..last
- Note: Hook and layout numbers are the ink box with quote marks and overshoot. From the one shrunk keyword: cap top = 375.1 + 0.385 x cap height (n=2 sizes, so not tested).

### 75. call to action keyword shrink-to-fit width

- Verdict: confirmed
- Claims: T25 (type): 923 px; H24 (hook): 923 px; L16 (layout): 924 px
- Measured: 923.2 px ink width on the one shrunk keyword (clip34). One heading is 923.35 px wide as well (clip38, second heading).
- Build value: 923 px
- Method: As above.
- Where: clip34@1218-1227, clip38@698-702
- Note: n=1 for the keyword.

### 76. call to action keyword entrance (direction, rotation)

- Verdict: confirmed
- Claims: H26 (hook): from 140 px to the right, rotated 6 degrees clockwise, no scale, starts T0+7, sharp T0+17; M15 (motion): standard entrance: rise from below through a blur, no rotation, 7 frames after line 1; M25 (motion): nothing in the style rotates
- Measured: Hook is right in 11/11. First full state: offset x +138.5 px (137.7-139.5; clip38 143.2), offset y 0.0 (max |dy| 0.35 px), rotation +5.99 degrees clockwise (5.95-6.04; clip38 6.40), scale 1.000 (0.999-1.002), blur peak sigma 23.3 px (22.9-23.5; clip38 24.3). Offset and rotation shrink together (rotation/6 = 1.008 x offset/139, rms 0.023). First visible T0+7 (6-8) in 10 clips, sharp T0+15..18 (median 17), 8-10 frames; clip38: starts with line 1 at T0, sharp T0+10. Model-free check: strip-centroid tilt 5.26 degrees (4.0-5.9) and ink centroid +131 px where the fit says more than 4 degrees (n=26 frames); r = 0.999 with the fit over 203 frames. Error: offset +-1 px, rotation +-0.05 degrees.
- Build value: x +139 px to 0 and rotation +6 degrees clockwise to 0 together, about the line centre; no scale, no vertical offset; blur peak 23.5 px
- Method: Six free parameters per frame (opacity, scale, rotation, dx, dy, blur) with BOTH claimed motions among the starting candidates; frames T0-1..T0+26 of all 11 clips. Independent check without a model: vertical ink centroid in 14 strips, line fit. Strips
- Where: clip29@T0-1..T0+26, clip30@T0-1..T0+26, clip31@T0-1..T0+26, clip32@T0-1..T0+26, clip33@T0-1..T0+26, clip34@T0-1..T0+26, clip35@T0-1..T0+26, clip36@T0-1..T0+26, clip37@T0-1..T0+26, clip38@T0-1..T0+26, clip39@T0-1..T0+26
- Note: M25 needs this exception: the call-to-action keyword rotates. Nothing else measured here does.

### 77. call to action line 1 entrance

- Verdict: confirmed
- Claims: H26 (hook): from scale 0.94 and 60 px low, sharp at T0+10; M15 (motion): standard entrance, start offset +60 px
- Measured: First state: scale 0.939 (0.930-0.940), 60.0 px low (59.4-61.8), opacity 0.10-0.54 depending on phase, n=8 clips with a clean first state; blur peak sigma 22.4 px (21.3-23.4); sharp at T0+10 in 10/11, T0+11 in clip29.
- Build value: scale 0.94 to 1, rise 60 px, blur peak 22 px
- Method: Same fit (opacity, scale, dy, blur), outgoing graphic as a third layer.
- Where: clip29@T0..T0+11, clip30@T0..T0+11, clip31@T0..T0+11, clip32@T0..T0+11, clip33@T0..T0+11, clip34@T0..T0+11, clip35@T0..T0+11, clip36@T0..T0+11, clip37@T0..T0+11, clip38@T0..T0+11, clip39@T0..T0+11
- Note: clip29 and clip35 first states are disturbed by the picture entering in the same zone.

### 78. call to action build in seconds

- Verdict: confirmed
- Claims: H26 (hook): line 1 sharp at T0+10, keyword T0+7 to T0+17; M15 (motion): keyword 7 frames after line 1 (median 6.5); each line 10 frames
- Measured: Both lines: one tween, expo.inOut, 0.34 s (keyword 0.336 s, position rms 1.3 px; line 1 0.339 s, 1.4 px); blur = peak x sin(pi x u) in linear time (23.7 px keyword, 22.1 px line 1; rms 0.45 and 1.1 px), not 4p(1-p). The line 1 tween starts 0.02 s before the first changed frame T0. Keyword start minus line 1 start: 0.208 s (3.61-3.80 states in 8 clips); clip38: 0.00 s. Whole block sharp 0.55 s after T0.
- Build value: line 1: start T0, 0.34 s; keyword: start T0 + 0.21 s, 0.34 s; ease expo.inOut; blur = peak x sin(pi x u)
- Method: Per-state samples with the stepping phase chosen per clip, 6 easing families, start free per clip.
- Where: clip29@T0..T0+18, clip30@T0..T0+18, clip31@T0..T0+18, clip32@T0..T0+18, clip33@T0..T0+18, clip34@T0..T0+18, clip35@T0..T0+18, clip36@T0..T0+18, clip37@T0..T0+18, clip38@T0..T0+18, clip39@T0..T0+18
- Note: Other eases: power4.inOut 4.3 px rms, power3.inOut 7.0, power3.out 18.1, expo.out 17.7 (keyword).

### 79. call to action trigger

- Verdict: confirmed
- Claims: H22 (hook): on the first content word of the call-to-action clause, skipping a leading "So": median +0.4 frames, range -5.6..+8.0; S08 (structure): about 6 frames after the first word of the last sentence: median +5.6, range 1.2..11.8
- Measured: T0: clip29@1102, clip30@1725, clip31@785, clip32@962, clip33@978, clip34@1153, clip35@1145, clip36@1125, clip37@865, clip38@1273, clip39@770 (same as both analysts). Both claims reproduce from the transcript; they use two anchors. Against the AUDIBLE onset of the first content word: +2.3, +3.7, +1.7, 0.0, -0.5, -2.6, +2.1, +2.6, +1.7, -0.5, +1.5 frames, median +1.7, range -2.6..+3.7 (n=11). Against the audible start of the sentence including "So": about 10.2, 9, 5.6, 0, -0.5, 2.6, 2.1, 8.1, 11.8, 6.2, 1.5, median +5.6, range -0.5..+11.8: twice the spread.
- Build value: first changed frame = onset of the first content word of the call-to-action clause (after a leading "So"), +0 to +2 frames
- Method: First changed frame from the per-frame scan; word onsets from the speech-presence track (end of the pause before the word).
- Where: clip29@T0, clip30@T0, clip31@T0, clip32@T0, clip33@T0, clip34@T0, clip35@T0, clip36@T0, clip37@T0, clip38@T0, clip39@T0
- Note: S08 is the same event measured from "So"; it is correct but looser. The keyword is not waited for.

### 80. call to action hold and the end of the file

- Verdict: confirmed (other claim)
- Claims: H27 (hook): held to the last frame; file ends 3-17 frames after the last word (median 4.6); S08 (structure): stops 3 frames after the last word (median 3.2, 0.2-9.6); A10 (audio): file stops 60 ms after the last word (10-250 ms)
- Measured: Held: the field stays within 1.1 luma levels (mean abs) of the last frame for the final 41-113 frames in 11/11; no fade, no end card. End of the last speech energy (6 dB over the bed) to the end of the video: median 2.7 frames, range 0.2-5.7 (n=11); to the end of the audio: median 118 ms, 22-240 ms. The audio stream is up to 52 ms longer than the video.
- Build value: end the file 3 frames (0.10 s) after the last word, allowed 0 to 6
- Method: Speech-presence track for the last speech frame; scan of the field against the last frame.
- Where: clip29@last-110..last, clip30@last-110..last, clip31@last-110..last, clip32@last-110..last, clip33@last-110..last, clip34@last-110..last, clip35@last-110..last, clip36@last-110..last, clip37@last-110..last, clip38@last-110..last, clip39@last-110..last
- Note: H27 upper value 17 frames (clip39) misses the final fricative of the last word: speech energy there runs to 5.7 frames before the end. A10 60 ms is the same tail at a stricter threshold.

### 81. section heading geometry

- Verdict: corrected
- Claims: H19 (hook): digit height 68 px (66-69), top 77, baseline 143, centre x 540; clip38: top 21-22, baseline 89-90, centre x 501; T26 (type): cap height 67 px (65-68), baseline 142-146; clip38 89-90, centre 501; L18/L19 (layout): cap top 76, baseline 143 (146-147 in clip33); clip38: cap top 19-20, baseline 90, centre x 502
- Measured: Two sizes, not one: clip32 flat cap 65.2-65.4 px (cap top 77.6-77.8, baseline 143.0; n=2); clip33 67.9-68.0 px (cap top 77.9-78.1, baseline 145.9-146.0; n=3); clip38 68.0 px (cap top 22.0, baseline 90.0; n=3). The cap top is constant per position and the baseline follows the size. Flat digit "1" 65.25 / 67.96 / 68.05 px; round digits 2 and 3 are 1.1-1.3 px taller. Ink centre x 542.0-542.2 (clip32), 539.2-541.7 (clip33), 501.4-502.4 (clip38). Widths 503-923 px. Error +-0.3 px.
- Build value: cap height 68 px, cap top y = 78, baseline y = 146, centred on x = 540
- Method: Settled frames after each entrance, 50 percent ink edges, leading numeral separated (,).
- Where: clip32@158-162, clip32@468-472, clip33@298-302, clip33@508-512, clip33@778-782, clip38@338-342, clip38@698-702, clip38@1008-1012
- Note: No claim is far off, but each pooled the two sizes into 67-68.5 px and two of them pair a 68 px height with the 143 baseline of the smaller size. The clip38 position (56 px higher, 39 px left) is one clip: a person should say whether it is intended. Icon headings (clip33) put a rounded square between number and name.

### 82. section heading entrance

- Verdict: confirmed
- Claims: H21 (hook): scale 0.94 to 1, slide DOWN 40 px, opacity 0 to 1, blur peak sigma 22.6 px, 9 frames first visible to sharp
- Measured: Start scale 0.940 (0.9399-0.9418; 0.960 on one icon heading with a poor first state), start offset -40.5 px (-38.7..-41.4: enters from above and slides down), blur peak sigma 22.8 px (22.1-23.8; 25.9 and 26.6 on the two icon headings, where the fit is disturbed), first visible to sharp 10 frames (9-11), n=8. Per frame on clip32@130-140: opacity 0.12, 0.43, 0.75, 0.93 then 1; offset -41, -41, -41, -38, -32, -12, -4, 0; sigma 3, 8, 13, 21, 23, 24, 22, 15, 10, 3.5, 0. 4 of 8 entrances change on every frame (clip32 both, clip33 third, clip38 third); the other 4 step. Exit of the previous heading (n=4): sigma 8-15 at +1, 16-18 at +2 with opacity 0.87-0.96, opacity 0.17-0.65 and a rise of 13-32 px at +3, gone by +6.
- Build value: scale 0.94 to 1, 40 px slide down, blur peak 22.8 px, 10 frames (0.33 s) first visible to sharp
- Method: Two-layer fit per frame (outgoing content, settled heading with opacity, scale, dy, blur); candidates for a rise from below were included and never chosen.
- Where: clip32@129-141, clip32@441-456, clip33@271-283, clip33@484-496, clip33@749-768, clip38@311-322, clip38@668-686, clip38@978-995
- Note: This is the same tween as the call-to-action line 1 with the direction reversed.

### 83. section heading trigger

- Verdict: confirmed
- Claims: H21 (hook): sharp 13 frames after the first word of its section
- Measured: Against the transcript: sharp minus first word 13.3 frames (11.2-17.0), first visible minus first word +3.3 (1.2-6.0), n=8. Against the audible onset of that word: first visible +1.5 frames (-0.8..+5.0), sharp +11.3 (9.2-16.0).
- Build value: heading first visible 3 frames after the transcript start of the section first word (1-2 frames after it is heard); sharp 10 frames later
- Method: Word onsets from the speech-presence track; machine word times are about 2 frames early after a pause.
- Where: clip32@130, clip32@445, clip33@272, clip33@485, clip33@756, clip38@312, clip38@674, clip38@984
- Note: n=8 in 3 clips.

### 84. longest pause in the presenter speech

- Verdict: confirmed
- Claims: A08 (audio): maximum 230 ms, median 140 ms, n=110; S17 (structure): maximum 0.39 s, 7 pauses of 0.3 s or more, median 0.13 s, n=232
- Measured: Pauses of 100 ms or more, speech = any of 3 bands (150-1000, 1000-4000, 4000-9000 Hz) more than 6 dB over the bed: n=145 in 11 clips, median 132 ms, p90 201 ms, maximum 242 ms (clip34@634-641); longest per clip 188-242 ms; 16 of 200 ms or more, 0 of 250 ms or more; 3.5 per 10 s. At 3 dB: n=88, max 228 ms. At 10 dB: n=252 (the structure count), max 290 ms, 7 of 250 ms or more, still 0 of 300 ms or more. The 0.39 s pause of S17 (clip30 at 40.93 s) is not a pause: a fricative at 4-9 kHz (-33 dBFS, 20 dB over the bed) runs from 40.98 to 41.09 s; it is absent in clip35 and clip38 at the same music time, so it is the presenter, not the bed. The true gap there is 41.10-41.33 s, 230-240 ms. Error: -5 to -10 ms from the 10.7 ms analysis window.
- Build value: no pause longer than 250 ms; aim for 130-140 ms
- Method: Bed estimated per time and band as the 2nd smallest power over the clips still running (the bed is sample-aligned across clips: lag 0, r up to 0.999 at the start); 10.7 ms windows, 2.5 ms hop; quoted voices of clip30 (3.6-18.7 s) excluded..
- Where: clip29, clip30, clip31, clip32, clip33, clip34, clip35, clip36, clip37, clip38, clip39
- Note: S17 measured a voice-band envelope (300-3400 Hz), which reads weak fricatives as silence. After 40 s fewer than 5 clips are left and the bed estimate is a fixed level: those pauses (clip30 only) are flagged in the CSV. Not listened to.

### 85. music bed level under the voice

- Verdict: confirmed
- Claims: A14 (audio): about 20 dB under the mix: -37.4 LUFS for beats 0-16, about -33 LUFS after; -34.35 LUFS overall
- Measured: Mix: -14.4 LUFS integrated (ebur128, whole file; -14.4 to -14.2, n=11). Bed alone, ebur128 on WAVs made only of speech pauses (3 dB criterion, 100 pauses, 6.4 s): beats 0-16 (0.05-10.7 s) -36.5 LUFS (21 pauses, 9 clips); 10.7-18.7 s -34.8; 21.35 s on -33.1 (45 pauses, 11 clips); all -34.3 LUFS = 19.9 dB under the mix. The same samples with a BS.1770 filter in numpy: -36.35 / -34.6 / -32.9 / -34.0. With the looser 6 dB criterion: -35.9 / -33.5 / -30.9 (voice tails leak in). Bed before the first word (56-100 ms): -35.6 LUFS (n=11). Bed alone in clip30 (13.41-13.83 s): -35.1 LUFS. Side channel 7-22 dB under the mid. Error +-1 dB.
- Build value: bed 20 dB under the mix: -36.5 to -37.5 LUFS for the first 16 beats (to 10.7 s), -33 LUFS after, with the mix at -14.4 LUFS
- Method: ffmpeg ebur128 on the whole files and on concatenated pauses (3 ms raised-cosine joins), cross-checked without joins in numpy.
- Where: clip29, clip30, clip31, clip32, clip33, clip34, clip35, clip36, clip37, clip38, clip39
- Note: My intro value is 0.9 dB above the claim; pause-based values can only be biased upward, so -37.4 stands.

### 86. ducking of the bed

- Verdict: confirmed
- Claims: A13 (audio): no ducking, no side-chain
- Measured: In the 35-70 Hz band, under the voice fundamental: level in pause frames minus level in speech frames, each against the cross-clip median at the same music time, -0.11 dB (303 pause frames, 5247 speech frames of 50 ms). In four stretches where clip30 has no voice for 0.2-0.48 s, its 35-70 Hz level equals the other 10 clips under speech at the same music time within 0.1-0.2 dB (-36.5 against -36.6, -35.7 against -35.9, -34.7 against -34.5, -47.8 against -47.9 dBFS).
- Build value: constant bed gain
- Method: Sub-voice band comparison; no model of the voice needed.
- Where: clip29, clip30, clip31, clip32, clip33, clip34, clip35, clip36, clip37, clip38, clip39
- Note: A duck of 1 dB or more would show.

### 87. first sound in the file

- Verdict: confirmed
- Claims: H02 (hook): speech-band energy from 0.11 s (100-140 ms); a low element from 50 ms; A09 (audio): bed from 48-51 ms (32.1 ms in clip35), voice from about 117 ms (106-198)
- Measured: The bed is first. 0-50 ms: near silence, -52 to -72 dBFS rms (not digital zero). Bed onset: crosses -50 dBFS at 49.7-49.8 ms and -40 dBFS at 50.83-50.90 ms in 11/11, sample-identical across clips. clip35 is not earlier: a -47 dBFS blip at 32 ms precedes the same 50.85 ms onset. Voice: the residual against the cross-clip bed passes -40 dBFS at 108 ms median (71-112), sustained at 110 ms (100-145), n=11. The stream carries an edit list for its 5058 priming samples and the decoder applies it (decoded length matches to the sample), so the 50 ms is in the published timeline, not an undeclared codec delay.
- Build value: bed in at 0.050 s, voice at 0.11 s
- Method: 1 ms rms on the mid channel; voice from the difference to the sample-wise median of the 11 clips.
- Where: clip29@0-6, clip30@0-6, clip31@0-6, clip32@0-6, clip33@0-6, clip34@0-6, clip35@0-6, clip36@0-6, clip37@0-6, clip38@0-6, clip39@0-6
- Note: Whether the platform added the 50 ms on upload cannot be told from the files. The title tween starts at 0.00 s and first shows at 0.06 s.

Open for a person:

- Listen to clip30 at 40.9-41.4 s (frames 1227-1242): is the sound at 40.98-41.09 s the end of a word, as measured, with a 0.23 s pause after it?
- Listen to the first 0.2 s of any clip: is the 50 ms of near silence before the bed audible or wanted? The files cannot say whether the platform added it.
- Title ratio heavy/light: it is a per-title choice (0.89-1.78, same copy set at 1.20, 1.26 and 1.44). Decide whether the planner picks it or the style fixes 4/3.
- Illustration bottom fade: start row and shape are not separable from the pictures (claim: linear, rows 500-580). A source illustration would settle it.
- Section heading in clip38 sits 56 px higher and 39 px left of the other two clips: intended variant or a one-off?
- Heading size: 65.3 px caps in clip32, 68.0 px in clip33 and clip38. Pick one.
- Watch one call to action (clip37 frames 872-882): the keyword swings in from the right with a 6 degree tilt. Confirm this reads as intended before it is built as a rule.
- Stepping: the graphics update 18 times per second with a phase per scene, while some headings and two title exits run at 30 per second. Confirm that it should not be reproduced.

## type-captions

Font: the three candidates were rendered with FreeType from fontTools instances (own layout with GPOS kerning and tracking) and fitted on 103 native temporal-mean crops in 7 roles from all 11 clips; the winner was re-drawn in headless Chrome with rounded tokens and the scorer was validated on a VP9 round trip with known fonts. Captions: every frame of all 11 clips was tracked by chroma-classified letter runs, grouped, and aligned to the transcripts; baselines and vertical metrics come from sub-pixel stem ends, the plate from edges over footage, the dot lattice and pixels seen with and without the plate, colours from raw YUV planes. Decode: raw yuv420p from ffmpeg, own BT.709 limited-to-full matrix, white card reads 255.

### 88. typeface, all text roles

- Verdict: confirmed
- Claims: T01 (type): one geometric sans, not installed; test Outfit, then League Spartan and Jost; best installed fonts 0.71 (captions) to 0.83 (heavy title)
- Measured: Outfit. Soft IoU median by role: caption 0.972 (n=22 crops, 8 clips), light title 0.972 (22, 11 clips), heavy title 0.984 (21, 11), heading 0.984 (8, 3 clips), figure 0.987 (8, 4 clips), CTA label 0.971 (11), CTA keyword 0.986 (11); NCC 0.996-0.999; lowest single crop 0.963 (the two clip33 figures fitted with tabular digits). League Spartan 0.71-0.86, Jost 0.67-0.83. In headless Chrome with rounded tokens 0.956-0.990. Error +-0.01 between crops.
- Build value: Outfit (variable font, OFL), wght 400 / 600 / 800
- Method: Temporal-mean native crops; FreeType render of fontTools instances with own layout (hmtx advances, GPOS kerning, tracking); wght searched in steps of 50 then 10; size, tracking, x, y, blur optimised per wght on soft IoU. Scorer validated on a VP9 round trip with known fonts (true family 0.964-0.993, wrong 0.55-0.83).
- Where: clip30@1079-1154, clip33@631-694, clip34@558-718, clip35@750-890, clip36@510-721, clip38@329-1138, clip39@143-423, clip31@247-291, all 11 clips@34-43 (title), all 11 clips@last 40 frames (CTA), clip32@298-602, clip33@448-817, clip38@478-1112, clip29@613-907, clip39@60-322
- Note: True match, above 0.90 in all seven roles. See the top-level font object.

### 89. weights by role

- Verdict: confirmed
- Claims: T02 (type): three weights by stem/cap: 0.18 captions, 0.14 light title lines and CTA label, 0.25 heavy lines, headings, figures, CTA keyword (roughly 500, 600, 800 on other fonts)
- Measured: Fitted wght: captions 610 (600-610, n=22), light title lines 410 (400-410, n=22), CTA label 410, heavy title lines 810 (800-810, n=21), headings 810, figures 800 (800-810), CTA keyword 800. At exactly 600 / 400 / 800 the scores are 0.971 / 0.970 and 0.966 / 0.984, 0.983, 0.989, 0.986. Outfit stem/cap at 400 / 600 / 800: 0.130-0.135 / 0.186-0.193 / 0.245-0.252. Error +-10 wght.
- Build value: wght 600 (captions), 400 (light title lines, the word Comment), 800 (heavy title lines, headings, figures, CTA keyword)
- Method: wght axis search (step 10 near the optimum) in the font fit; stem widths from the outlines of l and I.
- Where: same crops as the typeface item
- Note: Three weights confirmed. On Outfit they are 400 / 600 / 800, not 500 / 600 / 800.

### 90. caption cap height, x-height, ascender, descender

- Verdict: confirmed
- Claims: T03 (type): cap 53.55 px, x 36.85 px, ascender 55.0 px, descender 15.63 px
- Measured: cap 53.55 px (p10 53.47, p90 53.65, n=403 stem columns, per clip 53.52-53.59, 11 clips); x-height 36.79 px (n=8,398, per clip 36.77-36.81); ascender 54.99 px (n=4,639, per clip 54.98-55.00); descender 15.54 px (n=905). Error +-0.1 px. By registration of whole captions the font size is 75.88 px (75.7-76.0, n=22), which is a 53.34 px cap.
- Build value: font-size 76 px (cap 53.43 px, x 36.71 px by the font metrics)
- Method: Area method on vertical stems of temporal-mean captions (ink length beyond a row inside the stem = sum of alpha, independent of blur), glyphs labelled through the transcript alignment; cap from H L F T P R E B D K, x from n m r, ascender from h k l, descender from p q.
- Where: all 11 clips, 842 caption groups
- Note: 53.55 px needs 76.17 px. 76 px is 0.12 px short of the measured cap and 0.12 px above the registration fit; both inside the error.

### 91. caption baseline y, split and full-height layout

- Verdict: confirmed
- Claims: T04 (type): 984 / 1504; L05 (layout): 984 / 1504; M07 (motion): caption centre y 964 / 1482
- Measured: 984.01 (p10 983.97, p90 984.07, n=11,663 stem columns, per clip 984.01-984.02) and 1503.99 (p10 1503.94, p90 1504.03, n=6,261, per clip 1503.98-1504.00). Registration of whole captions: 983.97 (n=8) and 1503.97 (n=22). Ink centroid: 963.2 (p10 961.1, p90 965.1, n=518 groups) and 1483.0 (p10 1480.9, p90 1485.0, n=252). Error +-0.1 px.
- Build value: baseline y = 984 (split), 1504 (full height); 520 px apart
- Method: Sub-pixel bottom ends of stems standing on the baseline (area method); second method: baseline of the fitted Outfit line; centroid = mean row of ink pixels.
- Where: all 11 clips
- Note: M07 is a different measure of the same thing: the centre of the ink, about 21 px above the baseline, which moves +-2 px with the letters. Its 518 px travel is 520 px.

### 92. caption plate: side padding

- Verdict: confirmed
- Claims: T16 (type): 28.5 px beyond the ink; L07 (layout): 27 px beyond the ink (right 27.0, left 28.5)
- Measured: Beyond the ink: left 28.1 px (p10 25.9, p90 30.8, n=85), right 27.0 px (p10 25.3, p90 29.4, n=151). Beyond the text box (pen origin to advance end, trailing letter-spacing included): right 25.67 px (p10 24.8, p90 26.5, sd 0.68, n=151), left 25.84 px (sd 2.0, n=85). Plate centre x 539.9 (n=32). Error +-0.4 px.
- Build value: plate = text box + 26 px on each side
- Method: Split layout, rows 986-999 where the plate lies over presenter footage (contrast 30-60 levels): area method across each side edge on temporal-mean crops, flat backdrops only; text box from registering the Outfit line (600, 76 px, -0.013 em) on the column profile.
- Where: all 11 clips, 459 split-layout captions registered
- Note: Both claims are right and measure different things: the distance to the ink depends on the side bearings of the first and last glyph (sd 1.5-2.5 px), T16 is the left side, L07 the right side. The constant is the distance to the text box (sd 0.68 px).

### 93. caption plate: top and bottom relative to the baseline

- Verdict: confirmed (other claim)
- Claims: T16 (type): 87.6 px above, 39 px below; L07 (layout): 86.8 px above, 38.7 px below
- Measured: Top 86.8 px above the baseline (full layout 86.71 on 2,960 frames, split 86.85 on 6,291 frames), error +-0.15 px. Bottom 38.7 px below (split layout: 39.0-39.15 before correction, 38.84 by regression to a flat backdrop, 38.5 with linear backdrop extrapolation, n=459 captions), error +-0.2 px.
- Build value: top = baseline - 86.8 px, bottom = baseline + 38.7 px (y 897.2 to 1022.7 split, 1417.2 to 1542.7 full; centre y 960 / 1480)
- Method: Top: the dot row cut by the edge. Row means inside the plate against the same rows 14-38 px beside it give the covered share of each row (rows -90 to -86). Bottom: area method across the edge over footage, corrected for the footage getting brighter downward (1.2 % of the contrast per px).
- Where: all 11 clips
- Note: T16 puts the top 0.8 px too high. Uncorrected, the footage gradient pushes the bottom edge reading 0.3 px down, which explains 39.

### 94. caption plate: height

- Verdict: confirmed (other claim)
- Claims: T16 (type): about 127 px (126.6); L07 (layout): 125.45 px
- Measured: 125.5 px (86.8 + 38.7), error +-0.3 px.
- Build value: 125.5 px
- Method: Sum of the two edge measurements above.
- Where: all 11 clips
- Note: The plate is centred on y=960.0 (split) and 1480.0 (full).

### 95. caption plate: corner radius

- Verdict: confirmed (other claim)
- Claims: T16 (type): about 20 px (fit median 21.5); L07 (layout): 22.75 px
- Measured: 23.2 px (left bottom corner 23.25, right 23.15; rmse 0.17-0.18 px; 20 px gives rmse 1.1-1.2 px, 22 px 0.4-0.5 px; n=84 and 151 captions per row), error +-0.6 px (it moves 22.8-23.7 with the bottom edge at 1022.5-1022.9).
- Build value: 23 px
- Method: Per row 992-1022, sub-pixel position of the plate side edge over footage (area method), median over captions, circle fit with free offset.
- Where: all 11 clips, split-layout captions
- Note: Only the two bottom corners were measured (the top ones lie over the dark field). A circle fits; no test for a superellipse.

### 96. caption plate: fill colour and opacity

- Verdict: confirmed (other claim)
- Claims: T16 (type): #101010 at 66 %; C11 (colour): #11110F at 0.68; L08 (layout): near-black at 62-69 %
- Measured: Colour: luma code 30.78 in both layouts, U 127.0, V 128.0 = RGB 17.2, 17.4, 15.1 = #11110F (+-0.4 level). Opacity 0.68 +-0.015: dot integrals 0.683 (split) and 0.679 (full); same pixels with and without the plate on adjacent frames 0.700 (679 patches, 622,693 px, p10 0.690, p90 0.702), an estimator that reads 0.709-0.715 on a synthetic 0.69 plate. Blend is linear in code values within 0.65 codes over luma 38-101.
- Build value: #11110F at 0.68
- Method: Raw YUV planes. Row profiles inside the plate against the same rows beside it; dot lattice folded modulo 12 px inside and outside; caption changes where the plate gets narrower or wider give pixels covered on one frame and bare on the next. Biases read from a synthetic plate (0.69, no blur) passed through libvpx-vp9.
- Where: all 11 clips: 6,291 split and 2,960 full-layout frames; 679 caption changes
- Note: The field beside the plate reads 18.2-18.3 (same hue), so the plate is the field colour, 1 level darker. 0.66 is 0.02 low; 0.70 would also be inside my raw readings.

### 97. caption plate: backdrop blur

- Verdict: confirmed
- Claims: C11 and open question (colour): dots are dimmed, not visibly smeared; flat tint or tint over a blur: undecided
- Measured: No backdrop blur. Dots inside keep 0.320 / 0.334 of their peak and 0.317 / 0.321 of their integral (split / full); the best-fitting Gaussian is sigma 0.48 / 0.56 px, and a synthetic plate with no blur reads sigma 0.54 px after VP9. Footage detail (5x5 high-pass) under the plate: slope 0.15 of the bare pixels on the adjacent frame, against 0.10 for the blur-free synthetic plate. Upper bound for a real blur: about sigma 0.3 px.
- Build value: no backdrop-filter; flat fill #11110F at 0.68
- Method: Dot lattice folded modulo 12 px inside the plate and beside it (9,251 frames); footage pixels covered on one frame and bare on the next (679 caption changes); control: synthetic plate without blur through libvpx-vp9.
- Where: all 11 clips
- Note: Settles the colour analyst's open question. The half-pixel softening of the dimmed dots is the codec.

### 98. caption grouping: words per group

- Verdict: confirmed
- Claims: T06 (type): 94.0 % two words, 6.0 % one word, never three (853 groups)
- Measured: 842 groups of 3 or more frames in 11 clips: 793 two words (94.2 %), 49 one word (5.8 %), 0 three or more. One-word groups per clip: 2 to 7.
- Build value: 2 words per group; 1 word only where a segment has an odd word left
- Method: Ink-box counting: letter runs split at gaps of 13 px or more; pairs joined by an overhanging f or j (gap under 13 px) split by the highlight, which colours one word at a time. The 68 single boxes of the first pass were also read on an enlarged sheet: 19 were two words, the same 49 remain.
- Where: all 11 clips, every frame
- Note: One more group lasts 2 frames (clip29@1112-1113) and is not counted.

### 99. caption grouping: what ends a group

- Verdict: confirmed
- Claims: T07 (type): the sentence end; pairs counted from the first word of the sentence; an odd sentence leaves one word alone at the end
- Measured: 77 of 77 transcript sentence ends inside the captioned speech fall on a group end (44 after a pair, 33 after a single word); 0 inside a pair; 40 pairs have a comma between their words. Of the 49 single words, 43 close a sentence or the clip (33 by the transcript full stop, 10 by reading the context where the transcript has none). 6 do not: 2 open a sentence (clip30@1611 "As", clip35@925 "And"), 4 sit inside one (clip29@523, clip32@845, clip33@496, clip35@1213).
- Build value: chunk each transcript segment (sentence) into pairs from its first word; a leftover word stands alone
- Method: Monotonic alignment of on-screen word boxes to transcript words by time and predicted ink width (94 % of 1,635 words within 4 px); sentence ends from the machine transcript punctuation; the 16 single words without a full stop read in context.
- Where: all 11 clips
- Note: Of the 6 exceptions (0.7 % of groups), 3 sit beside a product name that is one spoken token but two or three words on screen ("Grok Bot", "Real SFX", "Clean Your TV"): the name keeps its own group and both of its words are orange together. 1 sits before the CTA keyword, 2 are unexplained. Rule for a builder: count words on screen, never split a multi-word name across groups.

### 100. caption white

- Verdict: confirmed
- Claims: T11 (type): #F9F8F5 (249.3, 247.9, 245.1); C04 (colour): #FAF8F6 (250.4, 248.3, 245.9)
- Measured: Y 228.95 (sd 2.2), U 126.66 (sd 0.8), V 128.73 (sd 0.8) = RGB 249.3, 247.9, 245.1; per clip Y 228.92-228.99; same in both layouts. n=4.0 M luma and 0.63 M chroma samples at 3 px or more inside the glyphs. Error +-0.5 level.
- Build value: #F9F8F5
- Method: Raw YUV planes, glyph interiors by distance transform (luma 3 px inside; chroma samples whose 2x2 luma block is 3 px inside), every 3rd settled caption frame of all clips, own BT.709 limited-to-full matrix (white card reads 255).
- Where: all 11 clips
- Note: One colour within noise. #F9F8F5 encodes to Y 228.99, U 126.58; #FAF8F6 to Y 229.23, U 126.92 (it is the inversion of the integer code modes 229, 127, 129).

### 101. active-word orange

- Verdict: confirmed
- Claims: T11 (type): #FE6B1A (253.5, 106.9, 26.5); C02 (colour): #FF6B1B (254.7, 107.2, 27.1)
- Measured: Y 129.99 (sd 2.1), U 78.30 (sd 2.4), V 195.82 (sd 2.7) = RGB 254.3, 107.2, 27.8; modes 130, 78, 196 = 254.6, 107.2, 27.1; per clip Y 129.96-130.03. n=3.0 M luma and 0.41 M chroma samples. Error +-1 level on R and B.
- Build value: #FF6B1B
- Method: Same as the caption white.
- Where: all 11 clips
- Note: One colour within noise. Luma has no chroma bleed: #FF6B1B encodes to Y 129.96, #FE6B1A to 129.71; measured 129.99.

### 102. active word: number of orange words per caption frame

- Verdict: confirmed
- Claims: T09 (type): exactly one word orange while it is spoken, all white between words: 75.7 % one, 24 % none, two on 57 frames
- Measured: 11,145 settled caption frames (371.5 s, 11 clips, every frame): none 24.4 % (per clip 21.9-26.0), one 75.1 % (71.9-78.1), two 0.52 % (58 frames in 18 captions: 14 hand-overs of 1-2 frames, "Grok Bot" 10 frames and "Real SFX" 24 frames where one spoken token is two words on screen, 2 others of 3-4 frames). 39 of 1,635 words are never orange. Every highlight is one unbroken run. Word 1 is orange on the first frame of 818 of 842 groups. Last frame of a group: all white 462, word 2 orange 369.
- Build value: one word orange from its start frame to its end frame; all white otherwise
- Method: Per frame, letter runs classified white or orange by chroma (V near 129 or above 175); a word is orange when more than half of its ink is.
- Where: all 11 clips
- Note: No frame shows a half-coloured word (0 of 11,145).

### 103. active word: lag against the transcript

- Verdict: confirmed
- Claims: T09 (type): on 2.0 frames after the ASR word start, off 1.0 frame after the ASR word end
- Measured: Orange on: +2.0 frames after the transcript word start (mean +2.2, p10 -0.4, p90 +5.0, n=1,500 words). First white frame: +1.0 after the word end (p10 -1.2, p90 +3.2). Highlight length median 5 frames (p10 2, p90 10); white gap between the two words of a pair: median 0, p90 4 frames. Error: the transcript is +-2 frames.
- Build value: highlight on at the word start frame, off at the word end frame; no deliberate offset
- Method: Words matched to the transcript by the alignment (width residual 3 px or less).
- Where: all 11 clips
- Note: The +2 and +1 frames are inside the transcript error and are probably this transcript starting words early, not a style choice.

### 104. captions never animate

- Verdict: confirmed
- Claims: T12 (type): hard cut in and out; M12 (motion): a new group replaces the old one on a single frame
- Measured: 0 frames with a partly visible, offset or scaled group. Entries: first against second frame of 762 groups with the same highlight state: opacity slope median 1.0000 (p5 0.9988, p95 1.0017), shift median 0.000 px, scale median 1.0000, soft IoU median 0.999. 43 exceed the tolerance: 21 are the tail of a layout change (vertical travel 1-15 px), 3 lie under the leaving title, 19 are a 0.3-0.75 px horizontal centroid shift with opacity 0.997-1.009 and scale within 0.2 % (the orange word settling in the codec). Exits: 693 groups, 11 exceed: 6 layout change or title, 5 centroid only. 802 of 831 consecutive groups follow with 0 empty frames; 27 gaps of 4-18 frames are layout changes, 1 is the demo (453 frames), 1 is a 2-frame group.
- Build value: hard cut; no fade, slide or scale
- Method: Regression slope (opacity), ink centroid (shift), second moments (scale) and soft IoU between the first two and the last two frames of every group; only pairs with the same highlight state.
- Where: all 11 clips, every group change
- Note: The only caption motion is the 520 px travel during a layout change.

### 105. letter-spacing by role

- Verdict: confirmed
- Claims: T23 (type): heavy display lines tight, captions at normal spacing; fit on the real font
- Measured: Fitted at the named weights, in em: caption -0.0124 (free size 75.88 px) or -0.0134 (76 px); light title lines -0.0253 (p10 -0.0258, p90 -0.0241, n=22); heavy title lines -0.0357 (-0.0363 to -0.0350, n=21); headings -0.0304 (n=8); figures -0.0401 (n=8); CTA label -0.0196 at 92 px; CTA keyword -0.0357 (n=11). Error +-0.001 em (+-0.002 for the light title lines, whose size is free).
- Build value: caption -0.013 em, light title -0.025, heavy title -0.036, heading -0.030, figure -0.040, CTA label -0.020, CTA keyword -0.036
- Method: Font fit with tracking as a free parameter; cross-check: with these values the text box including the trailing spacing is centred on x=540.0 in every role (539.94-540.04).
- Where: same crops as the typeface item
- Note: Captions are not at normal spacing: about -1 px per glyph (at letter-spacing 0 the same captions drop to 0.64-0.80 in Chrome). Centre the box that includes the trailing spacing, as CSS does.

### 106. digits in figures and count-ups: tabular or proportional

- Verdict: confirmed
- Claims: T27 (type): proportional in clip39 (width 357 to 350 px between two values), constant width in clip33
- Measured: Proportional: 40,000+ and 300+ (clip29), 2,000+ (clip38), 200+ (clip39): 0.976-0.989 against 0.81-0.92 with tabular digits. clip39 249 to 252: both edges move at the value change (x 655-1012 to 659-1007), and 252 needs -0.057 em as tabular against the -0.040 em of every other figure. Tabular: clip33 5,220,123 (0.987 against 0.692) and 78 (0.989 against 0.972); its outer edges stay at 179 and 905 while the digits change (frames 360-362).
- Build value: proportional digits by default; font-variant-numeric: tabular-nums for a long counter
- Method: Font fit with the default digits and with the tnum substitutes; every-frame ink runs of each figure through its entrance.
- Where: clip29@505-629, clip29@795-919, clip33@340-464, clip33@697-739, clip38@418-494, clip38@1155-1279, clip39@5-124, clip39@210-334
- Note: Count-ups here last 2-5 frames inside the entrance; only clip33 (7 digits) uses tabular digits. One clip is thin evidence for a rule.

### 107. caption horizontal position

- Verdict: confirmed
- Claims: T05 (type): ink centre x 540.0; L06 (layout): ink centre x 540.5
- Measured: Text box centre (trailing letter-spacing included) 540.00 (p10 539.94, p90 540.09, sd 0.13, n=459 captions). Ink centre 540.45 (p10 539.2, p90 541.8, sd 0.95).
- Build value: centre the text box on x=540
- Method: Registration of the Outfit line on the column profile of each caption.
- Where: all 11 clips
- Note: Not on my list; measured because the plate padding needs it. The ink centre wanders with the side bearings.

Open for a person:

- Nothing was watched in playback and nothing was heard. Open and to see the match.
- Caption font size: 76 px is a choice between 75.9 px (registration) and 76.17 px (cap height on stems). A 0.2 px question; decide only if pixel-exact size matters.
- Tabular digits appear in one clip (clip33). Decide whether every count-up should use tabular-nums.
- Plate opacity: 0.68 +-0.015 after bias correction; raw readings span 0.68-0.70.
- Six single-word captions do not close a sentence (clip30@1611, clip35@925, clip29@523, clip32@845, clip33@496, clip35@1213). Three sit beside a multi-word product name; the other three I read as breaks in the creator's own transcript, not a rule.
- Display baselines in T24-T26 are the last ink row. By registration the baseline edge is 1 px lower: CTA label 339.0, CTA keyword 536.1, headings 143.0 (clip32), 146.0 (clip33), 90.0 (clip38). Not on my list; another verifier may own it.
- Title line sizes are per video and not whole numbers (76.1-133.1 px); I did not verify T19-T21.
