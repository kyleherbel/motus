# Presenter

Measured on all 11 in-style clips (clip29 to clip39, 426.6 s, 12,791 frames, every frame decoded; VP9 through a BT.709 limited-to-full conversion that reads a white card as 255,255,255 where the default decode reads 253). Face landmarks and a person matte come from Apple Vision (VNDetectFaceLandmarks and VNGeneratePersonSegmentation, balanced) run on every frame through a small tool fed by ffmpeg; the face was found in 100 % of the 8,130 steady presenter frames. Scale and position were measured by registering the room behind the speaker with the person masked out. OpenCV was used only for filtering and warping.

Findings. There are two modes: a graphic over the presenter (66.8 % of runtime) and a full-height graphic with no presenter (33.2 %). The presenter footage is a plain, unmatted, full-width rectangle that is exactly the bottom half of the frame (0,960 to 1080,1920), with no radius, stroke or shadow; its top fades in with a linear alpha ramp from row 960 to row 1040. The face is 280 px wide with the eye line at y=1245 and the top of the cap at y=1038, and these hold within 4 % and 12 px across all clips. Inside a clip the footage never changes scale or position (spread 0.05 %, push rate 0.000 %/s): no punch-ins, no push-ins. The presenter leaves and returns 17 times by the whole panel sliding 960 px down or up in about 7 frames with blur. There are 41 confirmed jump cuts (8.6 per minute of presenter time) that shift the face by a median of 14 px and at most 35 px. The footage is soft (edges 3 px wide against 1 px for the graphics), dim (skin luma 93, wall 84, panel mean 57) and partly on a 24 fps cadence.

Not done: no playback and no listening; no raw footage, so source resolution, field of view and crop are inferred; camera height and distance are by eye; exits, returns and cuts were not aligned with speech; overlap of graphics on the footage in steady state was checked in the side strips and by eye at 1 fps only; speed changes were not tested; the easing of the slide is not resolved; the matte outline carries about 3 px of error.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [P01] Use two full-frame modes only: "split" (graphic stage in rows 0..959 over a presenter footage panel in rows 960..1919) and "full" (full-height graphic, no presenter).

- Values: split 8,538 of 12,791 frames = 66.8 % of runtime; per clip 48.7..87.4 % (median 65.5 %). full 4,253 frames = 33.2 %. About 238 frames (1.9 %) are the 7-frame slides between them. Never seen: full-height presenter, corner or picture-in-picture presenter, side-by-side.
- Evidence: n=11 clips, every frame (12,791).; examples clip29@30 (split), clip29@180 (full).
- Confidence: high

### [P02] Place the presenter footage in a full-width rectangle that is exactly the bottom half of the frame: left 0, top 960, right 1080, bottom 1920 (1080x960, 9:8). No margin, no corner radius, no stroke, no shadow.

- Values: Luma runs without a step into column 0 (57.2 -> 55.6 over x 0..15), column 1079 (52.7 -> 52.4) and row 1919 (33.3..33.5 over the last 24 rows). The 8x8 px bottom-left corner flickers as much as the 64x64 block around it (temporal sd 19..43 against 22..41 levels in 11 clips), so no corner mask. Field luma above the panel stays at 18.6 up to row 959: no shadow.
- Evidence: n=11 clips, 8,130 steady frames. panel.edges.
- Confidence: high
- Verified, confirmed: left 0, top 960, right 1080, bottom 1920. Outermost column or row minus the fourth from the edge: left +0.1 to +0.3 codes, right -0.6 to +0.4, bottom -0.1 to +0.1 (11 clips, 55 to 137 frames each). Bottom-left corner pixel has the temporal sd of footage (15 to 40 codes, same as 16 px inside); bottom-right corner reads 29.8 to 44.1, not the field's 32.0. Field rows 950-959 read 32.02 to 32.10: no shadow. Build value: 0,960,1080,1920; no radius, stroke or shadow.

### [P03] Fade the top edge of the footage with a linear alpha ramp: alpha 0 at y=960, alpha 1 at y=1040 (80 px), blended in gamma-encoded values over the dark field. The field and its 12-px dot grid show through the ramp.

- Values: Per-clip fit on the wall: ramp start 959.3..960.1 (median 959.6), height 79.3..80.0 px (median 79.7), end 1038.9..1039.7. Fit error 0.17..0.44 luma levels for the linear ramp against 0.72..0.85 for a smoothstep. Dot peaks keep their 12-px period inside the ramp and shrink from 17 to 3 levels by row 1019.
- Evidence: n=11 clips, 2,712 frames.. Example clip29@30.
- Confidence: high
- Verified, not confirmed (the other claim holds): start 960.0 (per-clip 959.8 to 960.9), end 1040.7 (1039.7 to 1041.5), n=11 clips, 1,723 frames (82 to 205 per clip). Row 959 reads 32.07, row 960 32.24, row 1040 85.50, row 1041 85.78 of a 85.85 plateau. Error +-0.5 px on each end. Build value: start 960, end 1040 (80 px).
- Verified, confirmed: linear. RMSE 0.27 to 0.38 raw codes per clip for a linear ramp, 0.71 to 0.93 for smoothstep (n=11 clips). A free exponent t^g fits g = 0.97 to 1.03. Row-to-row luma step 0.67 codes for 80 rows. Build value: linear alpha, 0 at y=960, 1 at y=1040.
- Verified, confirmed: gamma-encoded (code values). Field opacity read from dot contrast over dark footage (level 57) minus the same over the bright wall (level 86): median +0.008, median absolute 0.019, n=110 row-clip pairs, rows 971-1020. A linear-light blend predicts +0.13 to +0.16 (for example 0.50 against 0.35 at mid ramp). Build value: blend in display code values (no linearisation).

### [P04] Never cut the presenter out. Show the footage as a plain rectangle with the real room behind the speaker in every presenter frame.

- Values: A person matte is used nowhere: the room behind the speaker registers to a single reference frame in all 8,130 steady frames (correlation 0.978..0.993 per clip). 0 of 12,791 frames show a presenter without the room.
- Evidence: n=11 clips..
- Confidence: high

### [P05] Stack order, bottom to top: dark field, presenter footage, caption plate, caption text. The caption plate sits on the faded top of the panel and ends above the head.

- Values: A dark translucent caption plate covers the centre of panel rows 960..1022 in 83..92 % of presenter frames per clip (median 88 %). Its bottom edge is at y=1022.5 +-1.5 in all 11 clips. Centre luma at row 1000 is 30.7 under the plate and 62.3 without it. During the 7-frame slides, graphic cards pass over the footage (by eye, clip29@115-118, clip36@247-251). In steady frames nothing reached the side strips just above the panel in 8,123 of 8,130 frames; below row 1040 the room correlation drops under 0.95 in 107 of 8,130 frames, and the stretch inspected (clip29@1058-1063) is a raised hand with a pen, not a graphic. That no graphic overlaps the fade rows 960..1040 outside the plate is by eye on 1 fps sheets.
- Evidence: n=11 clips, 2,712 sampled frames for the plate. panel.caption_plate.
- Confidence: medium (plate geometry high; the overlap statement for other graphics is partly by eye)

### [P06] Scale the footage so the face is 280 px wide on the 1080 px frame (Apple Vision face-contour width), which is an eye distance of 123 px.

- Values: Face-contour width: median 279.7 px = 25.9 % of the frame width; p5..p95 269.6..286.1; clip medians 275.8..283.4 in clips 29-38 and 267.6 in clip39. Eye distance: median 123.4 (p5..p95 119.0..126.3; clip medians 118.8..125.0). Vision face box width: 316.5 (297.5..328.5). Head width at the eye line (matte, cap and ears included): 301 (290..314).
- Evidence: n=8,130 steady frames in 11 clips, 30 samples per second, Apple Vision face landmarks (face found in 100 %)..
- Confidence: high
- Verified, confirmed: contour width 279.3 px (p5 267.7, p95 285.9; clip medians 267.6 to 283.5); eye distance 123.2 px between eye-landmark centroids (118.4 to 126.3), 125.3 between pupils. n=440 frames, 40 per clip, 11 clips, face found in 440. Error +-2 px (landmark jitter). Build value: 280 px face-contour width (eye distance 123 px).

### [P07] Put the eye line at y=1245: 285 px below the panel top, 29.7 % of the panel height, 64.9 % of the frame height.

- Values: Eye line: median 1245.5; p5..p95 1228.8..1258.6; clip medians 1239.7..1251.4 (11 clips). Brow line 1182.5 (1164.0..1201.4).
- Evidence: n=8,130 frames, 11 clips..
- Confidence: high
- Verified, confirmed: y=1243.4 for eye-landmark centroids (p5 1226.0, p95 1256.6; clip medians 1235.1 to 1250.2), 1241.2 for pupils. n=440, 11 clips. Build value: 1244.

### [P08] Centre the face on the frame axis x=540. Do not track or stabilise the face: the room stays fixed and the head moves inside it.

- Values: Eye midpoint x: median 537.5; clip medians 524.9..547.0; p5..p95 502.3..565.9 (the speaker sways 64 px). Face-contour centre x: 543.0 (clip medians 534.8..549.5). While the eye midpoint has an inter-quartile range of 28 px, the room offset has a standard deviation of 0.1..0.9 px per clip.
- Evidence: n=8,130 frames, 11 clips..
- Confidence: high
- Verified, confirmed: eye midpoint x=537.7 (p5 503.1, p95 565.2; clip medians 528.6 to 546.6); face-contour centre 543.0. n=440, 11 clips. Build value: 540.

### [P09] Let the top of the head land on the end of the fade: top of cap at y=1038, chin at y=1489. The head must not rise above y=1023, where the caption plate ends.

- Values: Top of cap (person matte): median 1038; p5..p95 1024..1051; clip medians 1024..1040 in clips 29-38, 1051 in clip39. That is 64..91 px below the panel top, all of it inside the 80 px fade, so there is no fully opaque headroom. Chin: 1488.8 (1469.5..1502.8). Cap top to chin: 454 px (431..474). Head top above row 1023 in 144 of 8,130 frames (1.8 %). Cross-check without the matte: un-fading the centre column puts the cap edge at 1029 in clip29@30 (matte 1027) and 1041 in clip30@30 (matte 1040).
- Evidence: n=8,130 frames, 11 clips; matte rows are 2.67 px apart..
- Confidence: high
- Verified, confirmed: about y=1035, but the matte figure is censored. Vision person matte top: median 1034.1 (n=440), and it sits within 4 px of the caption plate's lower edge (y=1023) in 37 % of frames (clip29 70 %, clip33 78 %, clip35 85 % within 1.5 px). On the 275 frames where the cap is clear of the plate the top is 207 px above the eye line (0.747 face widths). Applied to all frames that gives a top at 1034.7 (p5 1017.5, p95 1051.4; clip medians 1024 to 1049) and above row 1023 in 13 % of frames. Build value: 1035 (keep the cap top at or below the caption plate bottom, y=1023).

### [P10] Frame the speaker from mid-chest up: shoulders 775 px wide, torso running off both sides of the frame in the bottom 124 px.

- Values: Silhouette width 100 px below the chin (y about 1589): median 775 px = 72 % of the frame width = 2.77 face widths; p5..p95 737..812; left edge x=169, right edge x=942. Narrowest neck width 222 px (210..236). The matte touches both frame edges from y=1796 down (clip medians 1780..1828). Chin to frame bottom: 431 px.
- Evidence: n=8,130 frames, 11 clips, Apple Vision person matte (balanced), outline +-3 px..
- Confidence: medium (the shoulder row is my definition; gestures widen the matte)

### [P11] Keep one transform for the footage for the whole clip: same scale and same position in every presenter run. No punch-in, no slow push-in, no reframe when the presenter returns.

- Values: Room registration, every steady frame: scale spread p5..p95 at most 0.05 % inside any clip (sd 0.011..0.025 %); push rate per presenter run median -0.0001 %/s, range -0.003..+0.005 %/s (28 runs); offset sd 0.11..0.93 px. Largest offset between two runs of one clip 2.5 px (clip35). 0 of 17 returns come back at another scale.
- Evidence: n=8,130 frames, 28 runs, 11 clips; masked Gauss-Newton similarity fit on the room (correlation 0.978..0.993)..
- Confidence: high
- Verified, confirmed: constant within my error. First presenter run against last: horizontal scale 0.9984 to 1.0011 (ECC affine, 11 clips), isotropic scale 0.9992 to 1.0048, SIFT+RANSAC scale 0.9990 to 1.0032 (9 clips), offset at the panel centre <=2.2 px. Start against end of the longest run (3 to 22 s): scale 0.9971 to 1.0042. A synthetic 1 % zoom is returned as 1.0094 to 1.0105 by both methods. Error +-0.3 %. Build value: one fixed transform per clip; no punch-in, no push.

### [P12] Use the same camera position and the same placement from video to video.

- Values: Clips 29-38 (2026-11-02 to 11-06) register to clip29@60 with scale 0.990..1.010, x offset -9.1..+4.2 px, y offset -2.9..+3.7 px, rotation -0.02..+0.06 degrees. Same room, cap and jacket in all 11 clips (by eye).
- Evidence: n=10 clips against one reference, 7,660 frames. background_registration.across_clips_29_to_38.
- Confidence: high

### [P13] A new camera position is acceptable if the face is brought back to the same size and eye line; the room may change scale.

- Values: clip39 (2026-11-07): the room no longer registers to clip29 (correlation 0.62; wall pattern about 8 % smaller), face-contour width 267.6 px (4.3 % under the 279.7 median), eye distance 118.8, top of cap 1051, eye line 1251.4. Inside clip39 the footage is as locked as elsewhere (scale spread 0.05 %).
- Evidence: n=1 clip (470 frames) against 10..
- Confidence: low (seen in one clip)

### [P14] Open and close every video with the presenter on screen, and keep the presenter visible for about two thirds of the runtime.

- Values: Presenter visible 66.8 % of all frames; per clip 48.7, 50.5, 57.9, 60.4, 64.7, 65.5, 74.3, 77.6, 82.0, 86.2, 87.4 %. 11 of 11 clips start with the presenter and 11 of 11 end with the presenter. Opening run 3.1..24.9 s (median 7.3; five clips leave at 3.1..4.5 s, six stay 7.3..24.9 s). Closing run 3.9..21.9 s (median 10.2).
- Evidence: n=11 clips, every frame..
- Confidence: high

### [P15] Take the presenter off screen once or twice per video for a full-height graphic, for 2 to 17 seconds each time.

- Values: 17 off-screen segments in 11 clips: one in 5 clips, two in 6 clips. Length median 7.5 s; p25 3.9, p75 12.1; range 2.2..16.6 s. On-screen runs: n=28, median 8.0 s, range 3.1..24.9 s.
- Evidence: n=17 segments, 11 clips, every frame..
- Confidence: high

### [P16] The presenter leaves by the whole footage panel sliding straight down out of the frame (960 px) while it blurs. Never a hard cut.

- Values: Offset by frame from the last frame at rest, median of 12 cleanly tracked exits: 0, 4, 16, 64, 204, 598, 861, 960 px (p10: 0, 2, 8, 24, 94, 409, 793, 908). 7 frames from first motion to gone (range 6..8). Blur rises 1, 4, 8, 10, 12 px Gaussian sigma. All 17 exits show a blur peak of at least 8.9 px.
- Evidence: n=17 exits (12 tracked without a graphic crossing the tracking strip), every frame..
- Confidence: medium (edge tracked through 12 px of blur; the easing is not resolved: quart, quint and expo ease-in-out fit equally, error 0.009..0.013)
- Verified, confirmed: 957 px (95 % interval 955 to 958) for 520 px of caption travel: slope 1.8396, n=52 frames from 24 mode changes with the panel 30 to 880 px from rest. Rest top is 960.0 (seam fit). With 940 px the panel would lead the caption by a median 0.8 % of the travel (rms 1.0 %); with 960 px the difference is -0.14 % (rms 0.30 %). Error +-3 px, with a likely small low bias once most of the panel is off screen. Build value: 960 px (panel top from 960 to 1920).
- Verified, corrected: easeInOutExpo: p = 2^(20x-10)/2 below x=0.5, 1 - 2^(-20x+10)/2 above. RMSE 0.79 px of caption travel (520 px) over 526 frames of 32 mode changes (15 exits, 17 returns, 11 clips). Alternatives at their own best duration: easeInOutQuint 3.10 px, cubic-bezier(0.65,0,0.35,1) 3.81 px, easeInOutQuart 3.81 px, cubic-bezier(0.87,0,0.13,1) 4.16 px, easeInOutCubic 4.93 px, linear 23 px. The panel follows 960 times the same curve with rms 3.4 px (71 frames). Build value: easeInOutExpo (exact formula, not a cubic-bezier).
- Verified, corrected: 12.0 animation steps = 10.0 output frames = 0.333 s from first to last movement (fitted duration 12.00 steps for exits and for returns; +-0.1). 1 % to 99 % takes 6.8 steps = 5.6 frames. A step is 1/36 s: the layout clock advances 6 steps every 5 output frames, with one double step per 5 frames (on n%5 = 2 in 11 and n%5 = 3 in 18 of 63 unambiguous cases; never on 0, 1, 4; clip30 on n%5 = 4). 181 steps were counted over 150 frames (1.207 per frame). Movement of 1 px or more is visible on 8 to 9 frames. Build value: 0.333 s (10 frames at 30 fps), sampled in real time.
- Verified, not confirmed (the other claim holds): the same symmetric curve both ways, so the return is the exit reversed. Expo fit: exits RMSE 0.66 px, duration 12.0 steps (15 changes, 243 frames); returns RMSE 0.88 px, 12.0 steps (17 changes, 283 frames). Example exit clip30@1032-1038, panel px below rest: 1.4, 5.4, 54.0, 171.5, 536.9, 826.5, 919.0. Example return clip30@568-574, px below rest: 940.3, 809.9, 504.3, 160.9, 50.7, 15.5, 0.5. Build value: one curve for both directions.
- Verified, corrected: sigma(step) = 15.7 * sin(pi * step / 12) px, rms 1.4 px (n=68 clean frames, 40 exit and 28 return, 28 changes). Medians by step: 0.5: 2.6, 1.5: 4.4, 2.5: 9.3, 3.5: 12.3, 4.5: 13.6, 5.5: 15.6, 6.5: 15.6, 7.5: 14.1, 8.5: 12.5, 10.5: 4.4. Peak (steps 5 to 7.2) median 15.6, range 13.8 to 19.1, n=34. Horizontal over vertical sigma 0.95 (p10 0.78, p90 1.00). Error +-1 px. Build value: 16 px peak, half-sine over the move (0 at both ends).

### [P17] The presenter returns by the same panel sliding up from below the frame to its fixed position, blurred until it settles. It returns at the same scale and position as before.

- Values: Offset over the last frames before rest, median of 12 cleanly tracked returns: 960, 883, 678, 272, 74, 19, 4, 1, then 0 px (p10 824, 309, 102, 26, 7, 2). 7 frames from first visible to rest (range 6..8). Blur 12.9, 12.7, 11.8, 10.5, 7.9, 4.5 px Gaussian sigma in the six frames before rest, 0.5 on the rest frame, 0 after. All 17 returns show a blur peak of at least 11.1 px.
- Evidence: n=17 returns (12 tracked cleanly), every frame..
- Confidence: medium (same limits as P16)

### [P18] Jump cuts on the presenter are allowed and frequent: plain one-frame cuts at the same scale and position, with no zoom or dissolve to hide them.

- Values: 41 confirmed jump cuts in 11 clips: 3, 5, 3, 6, 6, 3, 7, 3, 1, 3, 1 per clip (median 3). Rate 8.6 per minute of presenter time (per clip 2.6..12.9). Uncut stretch median 3.7 s (0.4..12.8). Eye-distance ratio across a cut 0.992 median (0.970..1.025): no scale change. 9 more candidates are unconfirmed. Independent check: the 4:5 frame cadence shifts phase at 6 of 7 testable confirmed cuts and at 6 of 394 random frames.
- Evidence: n=41 cuts, 8,538 presenter frames, every frame.. Examples clip30@688, clip32@721, clip38@303.
- Confidence: medium (cuts that move the face under 3 px or sit inside off-screen segments are not counted; the true count is 41 or more)

### [P19] Do not re-centre the speaker after a jump cut. The face may jump by up to an eighth of its width.

- Values: Face-centre displacement across the 41 confirmed cuts: median 13.9 px (5.0 % of the face width); p25 9.5, p75 20.2, p90 26.4, max 35.0 px (12.5 %). Horizontal part median 9.1 px (max 29.1), vertical part median 7.8 px (max 23.1).
- Evidence: n=41 cuts, 11 clips; Apple Vision landmarks, frame before against frame after..
- Confidence: high

### [P20] Conform slower footage to the 30 fps timeline by repeating frames, not by blending. Footage that drops to 24 fps is acceptable.

- Values: In 951 of 1,586 five-frame windows with motion (60 %) one frame is an exact repeat of the one before, on a strict 5-frame period (24 fps material on a 30 fps timeline). Per clip 38..82 %; per presenter run 4..100 %. Other stretches have no repeats (clip30@570-1035: 7 %). Repeats are exact (frame difference 0.00..0.05 levels), so there is no frame blending.
- Evidence: n=11 clips, 28 runs, every frame..
- Confidence: medium (a repeat is only visible while something moves, so the share is a lower bound; the cause is not known)

### [P21] Expect soft footage: the presenter picture carries about one third of the detail of the graphics beside it.

- Values: Width of clean edges (contrast divided by steepest step): footage p05 3.04 px, p10 3.31, median 4.79; graphics in the same frames p05 1.00, p10 1.02, median 1.48. Ratio 3.0 at p05, 3.2 at the median. Footage edges of 2 px or less: 0.05..0.09 % per clip; graphics: 67..86 %. Horizontal spectrum of the footage reaches its floor (-46 dB) at 0.25 cycles/px; the graphics still hold -30 dB at 0.5 cycles/px. Shoulder outline 3.3..3.9 px wide in every clip.
- Evidence: n=11 clips, 818 frames, 3.0 million footage edges and 7.3 million graphic edges..
- Confidence: high (the measurement; the cause, enlargement or a soft camera, is not decided)

### [P22] Enlarge a new source by at most 3.0x to match the reference, and by at most 2.0x to stay clearly sharper than it. Enlargement is 280 divided by the face-contour width in source pixels.

- Values: At 3.0x a sharp source reaches the 3.0 px edge width measured in the corpus; beyond that it is softer than anything in the 11 clips. So the source face must be at least 93 px wide (eye distance 41 px); 140 px (eye distance 62 px) keeps it at 2.0x; 280 px needs no enlargement.
- Evidence: Derived from P21 (n=11 clips) and P06. fit_rules.enlargement.
- Confidence: low (derived; assumes the source is sharp at its own pixel grid)

### [P23] The room is dim and flat: the face is only a little brighter than the wall, and nothing in the footage comes near white.

- Values: Calibrated luma 0..255, pooled medians: skin 93.2 (clip medians 89.1..103.2), wall right of the speaker 84.2 (77.0..85.9), dark picture upper left 37.2 (36.0..40.2), wall lower left 87.6, cap 145.3 (131.4..157.8; p95 169), jacket 22.3 (20.3..25.0). Skin over wall 1.11 (per clip 1.06..1.34), a difference of 5..26 levels. Mean of the whole panel 56.9 (54.8..59.0) against 18.6 for the field. Colours: skin #735851, wall #545452, cap #8C8F9A, jacket #14161A, picture #282521.
- Evidence: n=2,712 frames, 11 clips, BT.709 limited to full (white patch reads 255,255,255; default decode 253)..
- Confidence: high

### [P24] The dark jacket and the dark field are nearly the same luma, so the body melts into the field at the top fade and at the frame bottom; the face, cap and wall carry the panel.

- Values: Jacket 22.3 against field 18.6 (3.7 levels apart). Brightest large area: cap 145. Wall 84, skin 93. The top 80 px of the panel fade linearly into the field (P03).
- Evidence: n=2,712 frames, 11 clips..
- Confidence: medium (the speaker always wears the same jacket; n=1 wardrobe)

### [P25] The raw footage must be a locked-off, frontal, chest-up talking head: camera on a stand at about eye height, speaker centred, hands free to enter from below.

- Values: Locked off: room scale sd 0.011..0.025 % and offset sd under 1 px in every clip (P11). Frontal: Apple Vision yaw bin 0 and roll bin 0 in 8,129 of 8,130 frames. Camera height about eye to chin level and distance about arm length to 1 m: by eye. Effective detail of the visible 1080x960 crop: about 360..540 by 320..480 source pixels (from P21).
- Evidence: n=8,130 frames, 11 clips. source_estimate.
- Confidence: low (height and distance are by eye; the source size is inferred from softness)

### [P26] To fit another speaker: scale = 280 / face-contour width (or 123.4 / eye distance) in source pixels, then move the eye midpoint to (540, 1245).

- Values: Accept a face width of 268..286 px and an eye distance of 119..126 px (p5..p95 of the corpus, and the clip39 median at the low end). Eye line: clip median inside 1240..1251, any frame inside 1229..1259. Eye midpoint x: clip median inside 525..547, any frame inside 502..566.
- Evidence: Ranges from n=8,130 frames, 11 clips (P06 to P08). build_spec.presenter_target and presenter_tolerance.
- Confidence: medium (one speaker in the corpus; the transfer to other faces is untested)

### [P27] Check that the source covers the panel before fitting: it needs 4.38 eye distances on each side of the eye midpoint, 2.31 above the eye line and 5.47 below.

- Values: Panel 1080x960 = 8.75 by 7.78 eye distances (3.86 by 3.43 face widths); 1.02 face widths above the eye line, 2.41 below. If the source lacks headroom, lower the eye line to at most 1259 or shrink the face to no less than 268 px; if it lacks width, the source cannot be used at this size.
- Evidence: Derived from eye distance 123.4, eye line 1245.5 and the panel rectangle (n=8,130 frames). fit_rules.coverage_in_eye_distances.
- Confidence: medium (derived)

### [P28] After fitting, check the head top: it must fall between y=1024 and y=1051. A speaker with tall hair gets the eye line lowered, not the caption moved.

- Values: Corpus head top p5..p95 1024..1051; caption plate bottom 1022.5 in 11 of 11 clips; head height from top of cap to chin 454 px = 1.62 face widths, with the eye line 46 % of the way down.
- Evidence: n=8,130 frames, 11 clips. face_geometry.pooled.head_top_y and panel.caption_plate.
- Confidence: medium (the corpus speaker always wears a cap; hair is untested)

### [P29] Never do any of these to the presenter footage: zoom, push, pan, rotate, mirror between runs, round the corners, add a border or shadow, cut the person out, or show the presenter full height.

- Values: 0 scale changes in 28 runs and across 41 jump cuts; 0 rotations (room rotation -0.02..+0.06 degrees in every clip); 0 frames with a matte; 0 frames with a presenter above row 960; 0 of 34 exits and returns are hard cuts; panel rectangle identical in 11 of 11 clips.
- Evidence: n=11 clips, 12,791 frames..
- Confidence: high

### [P30] Treat the presenter layout as fixed over the corpus period: nothing in the panel, the face size target or the transitions changed between 2026-11-02 and 2026-11-07.

- Values: Constant on all 6 publishing days: panel 0,960,1080,1920 and 80 px fade (11 of 11 clips), eye line clip medians 1239.7..1251.4, slide exits and returns (34 of 34), locked footage (11 of 11). Changed: only the camera position in clip39 on 11-07 (P13). Jump cuts per minute by clip in date order: 7.0, 10.0, 7.3, 11.9, 12.3, 6.7, 12.9, 7.9, 2.6, 8.1, 3.5.
- Evidence: n=11 clips over 6 days. over_time.
- Confidence: medium (six days is a short period; the 11-07 change has n=1)

## Constant and variable

CONSTANT (11 of 11 clips, to the pixel or the frame): panel rectangle 0,960,1080,1920; linear top fade 960..1040; no radius, stroke, shadow or matte; one footage transform per clip (scale spread 0.05 %, offset sd under 1 px); caption plate bottom at y=1022.5; exits and returns are 960 px vertical slides with blur (34 of 34); presenter on screen at frame 0 and at the last frame; same room, cap and jacket.

VARIABLE: share of runtime with the presenter 48.7..87.4 % (driven by how much full-height graphic the script needs); off-screen segments 1 or 2 per clip, 2.2..16.6 s; face width by clip 267.6..283.4 px and eye line 1239.7..1251.4 (camera set-up); eye midpoint inside a clip 502..566 (the speaker sways); jump cuts 1..7 per clip, face shift 2..35 px; share of footage on a 24 fps cadence 38..82 % per clip; placement between clips 29-38 within 1 % scale and 10 px; camera position changed once (clip39, 2026-11-07).

## Open questions

- Why the footage is soft: enlargement of a small source, or a soft camera or denoiser at native size. A raw file, or its pixel dimensions, would decide it and fix the enlargement limit in P22.
- Whether the 4:5 repeated-frame cadence comes from a variable-frame-rate camera that drops to 24 fps in dim light or from mixed sources. The raw file metadata would decide it. A builder does not need to reproduce it.
- Whether the new camera position of clip39 (2026-11-07) is the new standard or a one-off: later clips would decide it.
- The exact easing and blur curve of the panel slide: the edge tracker cannot separate quart, quint and expo ease-in-out (error 0.009..0.013). The motion dimension should settle it with a full-frame tracker.
- How far the source extends beyond the visible 1080x960 crop: no frame ever reveals more, so headroom and side room in the raw frame are unknown.
- How to place a speaker without a cap, with tall hair or with a wider body: the corpus has one speaker and one outfit, so P26 to P28 are extrapolated.
- Whether any graphic overlaps the footage in steady state outside the caption plate: measured only in the side strips; the layout dimension should confirm.

## Needs an eye or an ear

- Watch one exit and one return in playback for the feel of the slide and blur: and show the frames (clip30@86-97, clip30@566-577).
- Confirm that the jump cuts read as plain hard cuts and that none is a morph or smooth cut: and (41 pairs with difference images).
- Decide whether the 9 unconfirmed candidates are cuts.
- Judge whether the softness of the footage is wanted or only tolerated:
- Check the camera height and distance read by eye in P25:
- Look for judder from the 24 fps cadence in playback (clip39@780-857).
- Confirm by eye that the fade at the panel top looks linear and that the dot grid shows through it.
