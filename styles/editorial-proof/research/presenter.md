# Presenter framing: measured record (P01-P30)

Part of the Editorial Proof study; read `README.md` first for the corpus, the method and the limits. STYLE.md cites these rules by id, for example [P01]. Frames are at 30 fps (f); positions are pixels on the 1080 x 1920 frame; evidence is given as clip id @ frame (see README.md, "Evidence ids").

**Sample.** Every frame of all 33 reels: Apple Vision face landmarks, the microphone as a rigid scale reference, panel-edge tracking and frame differencing; plus three sample raw clips from the owner, measured to design the normalisation (P24-P27).

**Method notes.** Generations: A (14 reels, 31 Oct-9 Nov), B (11 reels, 16 Oct-1 Nov, hoodie shoot), C (8 reels, 12-20 Oct, bright room). The build targets generation A and treats B and C as the tolerated range.

**Confidence.** high = measured on many instances and consistent; medium = measured but on fewer instances or with a judgement step; low = one to four instances, or inferred.

## Rules

### P01 - The head pop-out is a duplicate cutout layer, not a mask on the panel. Stack bottom to top: canvas, panel border, footage clipped to the panel's inner rounded rect, then the same footage background-removed (full body) with the same transform and NOT clipped.

- Confidence: high
- Numbers: Shirt covers the blue border and reaches x 1036-1046 at y 1912 against an outer edge of 1039.5 (5 bordered reels). In the hoodie shoots the shoulders spill to x 5-23 (left) and 1075-1079 (right) at y 1900 against a panel of 76-1004, starting at y 1832-1876.
- Evidence: clip40@30 (shirt_over_border_corners_x3, matte_hair_edge_x3); clip24@661 (hoodie_overflows_panel_sides); n=13 Gen A reels x 6-18 frames, 6 Gen B reels x 6 frames

### P02 - Split-mode panel box, current generation, two variants with identical footage transform. Panel runs off the bottom of the frame; no bottom edge is ever visible.

- Confidence: high
- Numbers: Bordered (newest, 3-9 Nov): outer left 41.4, right 1039.5, top 1291.5 (width 998); 18 px two-tone blue border; inner 59.5 / 1021.5 / 1309.5; outer radius 36 px; edge 10-90 % 0.85 px. Borderless (31 Oct-7 Nov): left 51.2, right 1039.3, top 1304.2 (width 988); radius about 60 px squircle-like; edge 1.56 px.
- Evidence: Sub-pixel: clip40@30, clip39@500, clip37@478, clip34@600, clip31@800; integer detector on 13 reels x 6-18 frames (spread 0-1 px). Bordered n=5 reels, borderless n=8

### P03 - Split-mode presenter size is fixed per shoot. Use IPD as the portable scale measure.

- Confidence: high
- Numbers: Gen A: IPD 136.8 px (per-reel medians 135.5-137.5), face width cheek-to-cheek 315.7 px (313.1-317.6) = 29.2 % of canvas width. Ratios: face width = 2.30 x IPD, Vision face-box width = 2.74 x IPD, eye-to-chin = 1.95 x IPD, hair-top-to-eye = 2.15 x IPD. Across all 33 reels split IPD spans 130-162 and face width 296-375.
- Evidence: Every frame of 13 Gen A reels; clip40@30 annotated; n=33 for the range

### P04 - Split-mode presenter position (Gen A): centred, eye line 135 px below the panel top so the edge crosses the forehead near the hairline.

- Confidence: high
- Numbers: Face centre x 530 (504-537; within-reel p5-p95 sway 72 px; envelope 469-589). Eye-line y 1431 (1424-1439; sway 56 px; envelope 1398-1468). Mouth y 1586 (1577-1596). Chin y 1699 (1691-1708), leaving 221 px of neck and chest. Eye line minus panel top 135 px (112-155).
- Evidence: 13 reels, every split frame; clip40@30, clip37@478

### P05 - Hair top is the most constant vertical anchor; the head rises about 8 % of canvas height above the panel's top edge.

- Confidence: high
- Numbers: Hair top y 1137 (per-reel 1131-1141; single frames 1127-1149). Head rise 155 px over the bordered top (151-155) and 166 px over the borderless top (163-172); single frames 143-177. Head is 562 px tall hair-top to chin; the top 28 % is outside the panel.
- Evidence: 13 Gen A reels x 6-18 frames; clip40@30, clip37@478

### P06 - Only hair crosses the top edge; shoulders exit through the lower corners and the shirt fills the panel width at the frame bottom.

- Confidence: high
- Numbers: Head silhouette where it crosses the top edge: x 363 to 716 (width 353; left 344-380, right 695-749). Body width at y 1800: 745 px (x 168-914; left 126-205, right 876-938). Body width at y 1912: 958 px (x 58-1016; left 33-80, right 994-1046).
- Evidence: 13 Gen A reels x 6-18 frames; clip40@30

### P07 - The microphone is a rigid marker bolted to the camera frame: a black foam ball centred under the chin, cut by the frame bottom in split mode.

- Confidence: high
- Numbers: Split: top y 1755, width 155 px (152.0 in the tracking band), centre x 542, 165 px visible, top 56 px below the chin. Full-frame: width 338 px, top y 1467, centre x 556, top 138 px below the chin. Gen C shows no mic; Gen B mic is black on a black hoodie (not measured).
- Evidence: Every frame of 14 Gen A reels; clip40@30 and @160

### P08 - The split-mode footage transform is locked: same scale and offset in every run of every reel of a shoot. No punch-ins, no eased moves, no drift.

- Confidence: high
- Numbers: Mic width 152.0 px and centre x 542.0 in all 45 split runs of 13 reels (zero spread, 1-px quantisation). Within-run scale slope: median +0.004 %/s (p5 -0.032, p95 +0.185). Per-run IPD medians agree within 1.5 %.
- Evidence: 13 reels, 45 runs, every frame, e.g. clip39 runs 0-144, 410-602, 883-975, 1179-1335

### P09 - Inside the panel is his real room at the same scale as him: same footage and grade as full-frame mode. Not blurred, darkened, gradient-filled or replaced.

- Confidence: high
- Numbers: Wall at 6 mapped positions, split vs full-frame: #746B6D/#746B6B, #746B6B/#746B6B, #706769/#6F6667, #4C4343/#4C4343, #4D4444/#4C4343, #4B4242/#4B4342 (0.0-1.1 luma levels). Left-wall luma difference within +-2 in 8 of 11 reels (-4 to -7 in 3 CTA frames with his hand in shot). Gen A wall: left-top #746B6B-#7B7171, left-mid #6D6464, right #3B312F; patch luma std 0.7-1.2. Gen B #AFA1A2 / #86817F; lime #969B9E; Gen C #C5CCBD / #C9D0C1.
- Evidence: clip40@30 vs @160 (wall_registration); 11 reel pairs e.g. clip37@850 vs @1200, clip27@397 vs @1061

### P10 - Matte edge is a smooth, strand-free outline about 1.6-1.8x softer than the in-camera edge: reproduce with a small Gaussian feather, no choke.

- Confidence: medium
- Numbers: 10-90 % widths, Gen A (13 reels x 6 frames): panel vector edge 0.85 / 1.56 px (calibration); in-camera head edge inside the panel 3.4 px left (3.2-3.6), 2.3 px right (2.2-2.5); matte hair top 4.2 px (2.6-6.2), hair side 5.5 px left (5.3-5.6), 4.2 px right (3.8-4.6). Added softness 3.5-4.4 px = Gaussian sigma about 1.4-1.7 px at output scale. Gen B 4.1-5.2 px; Gen C 4.6-11.4 px (frizzy hair).
- Evidence: , 33 reels x 6 frames; clip40@30 (matte)

### P11 - No halo, glow or cast shadow around the cutout. On a bright source room the matte leaves a light fringe, which is a fault to avoid.

- Confidence: high
- Numbers: Canvas luma minus baseline (70-100 px away) versus distance from the silhouette. Gen A: 0.0, +0.8, +0.9, +0.7, +0.4 at 1-5 px; -1.0 to +0.3 from 6 to 60 px. Gen B: -0.6 to +1.0 throughout. Gen C: +8.2, +8.8, +8.3, +7.0, +5.4, +3.2 at 1-6 px, zero by 10 px.
- Evidence: , 33 reels x up to 5 frames (A n=14, B n=11, C n=8)

### P12 - Exactly two presenter scales. Full-frame mode is the split footage enlarged by a fixed ratio and switched by a hard cut in one frame.

- Confidence: high
- Numbers: Gen A ratio 2.184 by mic-template registration (2.180-2.196, 13 reels, correlation 0.976-0.996); 2.170 by IPD (2.144-2.206). The full-frame view equals the split-canvas rectangle x 287.3-781.8, y 1083.5-1962.6. Gen B 1.93 (1.73-1.96); Gen C 1.77 (1.76-1.79). IPD steps 137 to 302 between consecutive frames with no intermediate value.
- Evidence: (13 reel pairs); clip40@99-108 (split_to_full_hardcut_strip); 172 presenter runs

### P13 - Full-frame presenter geometry (Gen A): face about 64 % of canvas width, eyes at 39 % of height, minimal headroom, mic at bottom centre.

- Confidence: high
- Numbers: IPD 296.8 px (293.7-301.7); face width 689.5 px (679.1-692.6); face centre x 523 (464-577; within-reel sway 165 px; envelope 405-684); eye-line y 745 (711-777; sway 106 px); mouth y 1076; chin y 1329 (1280-1359); hair top y 110 = 5.7 % headroom (102-123; single frames 93-133). Gen B: IPD 290, eye y 659, hair top 52. Gen C: IPD 270, eye y 650, hair top 66.
- Evidence: Every full-frame frame of 13 Gen A reels + 3-8 sampled frames each; clip40@160 annotated; all33 sheets

### P14 - Full-frame mode is raw, unmatted footage with no slow push-in and no gradient or dimming behind captions. Position is a preset with an occasional manual nudge.

- Confidence: high
- Numbers: Mic width 338.0 px (337.5-339.0) in 23 runs; scale slope in runs >= 2.5 s: median +0.001 %/s (p5 -0.013, p95 +0.128, n=14). Mic centre x 556.0 in 20 of 23 runs; one reel shifted +25 and +32 px. Shirt p90 luma 228-234 at y 1700-1915 versus 227-230 in split (11 reels). Wall: top-left #746B6B, top-centre #5F5656, right-mid #4C4343.
- Evidence: clip26 runs 441-482 and 1136-1243 (nudge); clip33@186-195 (apparent 9 % jump is a flickering keyword over the mic, not a zoom)

### P15 - Every reel ends on a full-frame presenter CTA; most reels also use one or two very short full-frame beats mid-video.

- Confidence: high
- Numbers: Ending run: 33/33 reels, median 3.80 s (p10 3.37, p90 4.21; 2.63-5.77), entered from a graphic in 18 reels and directly from split in 15. Mid-video runs: 27 in 24 of 33 reels, median 1.07 s (p10 0.65, p90 1.90, max 2.60); 16 go split-full-graphic, 5 graphic-full-split, 4 between graphics, 2 between splits. Full-frame share of runtime 13.2 % (7.8-22.7).
- Evidence: mode_runs, 33 reels, 60 full-frame runs

### P16 - Every reel opens in split mode with the presenter in place from frame 0, and returns to split mode several times.

- Confidence: high
- Numbers: 33/33 open in split. Opening split run 3.73 s (p10 2.38, p90 5.10; 1.70-6.10). All split runs (n=112): median 4.15 s (p10 2.33, p90 6.28, max 9.97). Per reel: 3 split runs (2-5), 2 full-frame runs (1-3), 3 off-screen runs (2-4). Split share of runtime 38.4 % (24.7-59.5).
- Evidence: 33 reels, every frame; all33 sheets

### P17 - The presenter is visible about half the runtime and is never away for more than about 12.6 s.

- Confidence: high
- Numbers: Share on screen: median 51.9 %, mean 53.7 %, range 39.0 % (clip28) to 73.2 % (clip08). By generation: A 48.6 % (39.0-58.5), B 53.1 %, C 63.2 %. Longest off-screen stretch per reel: median 7.90 s, p75 9.33, min 4.40 (clip11), max 12.60 (clip30 frames 577-954). Off-screen runs (n=99): median 5.53 s, p10 2.44, p90 9.07.
- Evidence: 33 reels, every frame; off-screen runs verified by eye on offscreen

### P18 - Speech has every pause removed, and the resulting edit points are mostly hidden by cutting away from the presenter. Visible jump cuts inside a presenter run are rare.

- Confidence: medium
- Numbers: 5,238 inter-word gaps: median 0 ms, p90 40 ms, p99 220 ms, max 440 ms; 4.0 % over 150 ms. 74 discontinuity candidates in 645.7 s of presenter screen time (1,211.4 s runtime): 9 within 3 frames of a layout change, 65 interior, 15 interior high-confidence. Rate per 10 s on screen: 0.23 (high-confidence) to 1.01 (all); Gen A 0.15-0.52, Gen B 0.09-0.37, Gen C 0.56-2.70. 22 of 33 reels have none at high confidence.
- Evidence: clip37@480, clip30@470 and @503

### P19 - Visible jump cuts are straight cuts at clause boundaries with no zoom or dissolve to disguise them; footage cuts meant to sit on a layout change are sometimes one frame early.

- Confidence: medium
- Numbers: 71 % of high-confidence detections (15 of 21) and 60 % of interior ones (9 of 15) fall on an ASR clause boundary against a 16.9 % base rate. Only 18 of 65 interior candidates (5 of 15 high-confidence) coincide with a proof-card change within +-2 frames. Head shift at the cut 8-34 px at split scale. One-frame-early cuts: clip36@128, clip25@397, clip35@418.
- Evidence: clip37@476-484 strip ('project, | and'); clip30@467-474; clip36@125-132; clip25@394-401; clip36@771-778 is a repeated-frame stutter (defect)

### P20 - Two older footage generations inside the 33 reels define the tolerated range: a lower panel top, a bigger face and a head that rises much further.

- Confidence: high
- Numbers: Gen B (11 reels, 16 Oct-1 Nov, hoodie): panel 76/1338/1004 borderless (lime 53/1404/1023); split IPD 151.2, face 349 (lime 373-375); eye y 1393; head rise 252-263 (lime 283-284); eye line only 50 px (45-64) below the top. Gen C (8 reels, 12-20 Oct, bright room): panel 65/1406/1016 with soft shadow (gameplay 58/1244/1024); IPD 152.0, face 344; eye y 1458 (gameplay 1301); head rise 278-299; eye line 44 px (36-57) below the top.
- Evidence: clip24@661, clip13@443, clip11@357, clip07@700 annotated; n=33

### P21 - The whole presenter block can be shrunk as a unit when the layout needs room; the full-frame size does not change.

- Confidence: low
- Numbers: clip35: panel 96/1357/984 (888 px wide, bordered), mic 136 px wide (0.895x), IPD 130, hair top y 1186, head rise 171; full-frame mic still 338 px, so mode ratio 2.49.
- Evidence: clip35@324 annotated; mic track all frames; n=1 reel

### P22 - The panel and presenter appear in place by hard cut; they do not animate in. Rare whole-composition settles carry the presenter along (owned by motion).

- Confidence: medium
- Numbers: 100 of 111 split runs are static from their first frame. 4 runs in 2 Gen C reels enter 6-8 % large after a white interstitial and settle over more than 12 frames (panel top offset 64 px falling to 14 px by frame 12). 5 Gen A reel openings show a settle of 8 px or less (0.8 %) over 6-7 frames.
- Evidence: clip13@218-231 strip; clip10@199, @572, @938

### P23 - Footage cadence: the current generation is native 30 fps. The oldest generation carries a repeated frame every 6 frames, which is an artefact, not style.

- Confidence: high
- Numbers: Autocorrelation of normalised frame difference at lag 6: +0.72 to +0.86 in all 8 Gen C reels and +0.38 in clip35; -0.2 to +0.1 in the other 24. Pattern per 6 frames: one duplicate (difference 0.1) next to one double step.
- Evidence: clip15 frames 450-485, clip12 frames 10-45

### P24 - The owner's sample raw clips are framed tighter, higher and off-centre relative to either reference mode, with far more headroom and a large boom mic that overlaps the jaw.

- Confidence: high
- Numbers: Clips 1/2/3: IPD 163.9 / 173.1 / 163.2; face width 400.8 / 385.7 / 381.0 (35-37 % of width; 1.21-1.27x reference split, 0.55-0.58x reference full-frame); face x 477 / 455 / 479 (61-85 px left of centre); eye y 682 / 706 / 659; chin y 1022 / 1048 / 977; hair top y 322 / 370 / 295 (15-19 % headroom versus 5.7 %). Mic capsule raw boxes: x 0-395, y 843-1300; x 0-230, y 1010-1300; x 0-420, y 880-1290; overlaps the left jaw by about 120 px in clips 1 and 3. Headphones in clip 1 widen the head from 401 to 536 px at eye level. IPD varies +-10 % within a clip versus +-3 % in the reference.
- Evidence: 10 frames per clip; target, target

### P25 - Split normalisation: one transform per shot from shot medians, anchored on the hair top, cover-limited by panel width. s_ref = 0.5*(137/ipd + 316/fw); s_cover = panel inner width / source width; s = max of the two; tx = clamp(540 - s*ex, innerRight - s*srcW, innerLeft); ty = 1137 - s*hairTopSrc; if face x is outside 500-580 raise s until inside or s*ipd = 162.

- Confidence: medium
- Numbers: For a 1080-px source s_cover = 962/1080 = 0.891 (0.915 borderless), above s_ref 0.81-0.83 for all three clips. Results clips 1/2/3: tx 59.5; ty 850.6 / 807.9 / 874.7; IPD 146 / 154 / 145; face width 357 / 344 / 339; face x 484 / 465 / 486; eye y 1458 / 1436 / 1462; hair top over the shot 1111-1155. Clip 2 at x 465 triggers the raise to s 0.936 (IPD 162, face x 485). Mic lands at x 60-411, y 1601-1920 (about 19 % of the panel).
- Evidence: target; target_clip1/2/3

### P26 - Full-frame normalisation: s = 0.5*(297/ipd + 689/fw); tx = clamp(540 - s*ex, 1080 - s*srcW, 0); ty = clamp(745 - s*ey, 1920 - s*srcH, 0). Accept IPD 268-308, eye y 711-777, hair top y 93-133.

- Confidence: medium
- Numbers: Clips 1/2/3: s 1.764 / 1.750 / 1.813; tx -301.8 / -256.7 / -327.6; ty -460.8 / -491.8 / -451.9; IPD 289 / 303 / 296; hair top y 102 / 108 / 83. The visible window is only 596-617 source pixels wide, so a 1080-px source is upscaled 1.75-1.81x and will be soft. Ratio to the split scale becomes 1.96-2.03 instead of 2.184.
- Evidence: target

### P27 - When the source is too tight to show shoulders or to cover the panel at an acceptable face size: use the smaller presenter block, else accept the corpus-maximum face, else skip split mode for that shot. Do not pad with a blurred room; the reference never does.

- Confidence: low
- Numbers: Step 1: block scaled 0.89 (panel 96-984, top 1357) lowers the cover scale to about 0.79 for a 1080-px source. Step 2: accept IPD up to 162 (face 375) provided the chin lands at y <= 1790, leaving >= 130 px below it (reference leaves 221 px). Step 3: cut to a graphic or to full-frame mode.
- Evidence: clip35@324 (small block); clip11 and clip25 (IPD 160-162 maximum)

### P28 - Matte scope for split mode: it only has to be clean above the panel's top edge and outside the panel's sides, because the unmatted footage lies directly under everything else. Full-frame mode needs no matte.

- Confidence: medium
- Numbers: Must include: hair (flyaways down to about 2 px), ears, headphones (clip 1 cups rise 14-26 px above the top edge), glasses, hats, shoulders that pass the panel sides (55-75 px in Gen B), hands only when above the edge. May ignore: everything inside the panel below the top edge, including the mic-shaped hole a person segmenter leaves, the desk and the room. Clip region: above inner top + 12 px, or outside the panel sides. Finish: feather sigma 1.5 px, no shadow, decontaminate or erode 1 px on bright walls.
- Evidence: sample raw clips (Apple Vision person segmentation keeps headphones, drops the mic, 3 clips); P01, P10, P11 evidence

### P29 - Target background and wardrobe need no correction to stay in style: bright rooms and dark or light clothing are all inside the corpus range.

- Confidence: medium
- Numbers: Target wall #9E928A-#B3ADA6, luma 156-168; face luma 194-201; wardrobe sage tee #9BBABD and black shirt #121C26. Reference wall luma spans 51-110 (Gen A grey), about 165 (Gen B #AFA1A2) and about 200 (Gen C #C5CCBD); wardrobe white tee, black hoodie, dark tee. The blue-bordered panel has only been seen with the dark grey wall (6 reels).
- Evidence: 10 frames per target clip; all33 sheets

### P30 - The transform stays fixed while the presenter moves freely inside it; compute it from shot medians and never track the face frame by frame.

- Confidence: high
- Numbers: Within-reel p5-p95 sway of the eye midpoint in Gen A: split 72 px horizontal (54-98) and 56 px vertical (50-67); full-frame 165 px horizontal (108-245) and 106 px vertical (77-137), while mic position stays constant to 1 px.
- Evidence: Every presenter frame of 13 Gen A reels

## Constant versus variable

**Constant (33/33 reels unless stated):** presenter opens the reel in split mode from frame 0 and closes it full-frame; split panel anchored to the frame bottom with no bottom edge; head matted and popping out over the top edge; real, untreated room inside the panel; cutout layer above the panel and border and unclipped; exactly two presenter scales per reel switched by a one-frame hard cut; locked transform with no zoom, push-in or punch-in (mic 152.0 px in 45 split runs, 338.0 px in 23 full-frame runs); no shadow, glow, outline, gradient or dimming on the footage in either mode; presenter centred (shot-median face x 504-562 in split); full-frame face 56-65 % of canvas width; pauses removed from speech; jump cuts hidden under layout changes, visible ones rare (0.23-1.0 per 10 s of screen time) and undisguised.

**Variable per shoot or per video:** wardrobe (white tee, black hoodie, dark tee), room and wall brightness (luma 51 to about 200), mic visible or not; panel box and border (five boxes seen; blue 18 px border in 6 of 33, all in the newest 9 days); split face size (IPD 130-162, face width 296-375); head rise above the panel top (143-299 px) and eye line below it (36-155 px); full-frame/split ratio 1.73-2.49; full-frame horizontal nudge up to 32 px; share of runtime on screen (39-73 %, falling from 63 % in the oldest generation to 49 % in the newest); 2-5 split runs and 0-2 mid-video full-frame beats per reel; longest off-screen stretch 4.4-12.6 s.

For the build, treat the newest generation (14 reels, 31 Oct-9 Nov: panel 41.4/1291.5/1039.5 bordered or 51.2/1304.2/1039.3 borderless, IPD 137, hair top y 1137, full-frame IPD 297 at eye y 745) as the spec and the older generations as the allowed tolerance.

## Disagreements with other studies

- Panel outer radius 36 px here against 39.5 px in layout (L12).
- Panel ring colours: single-row samples here (#5175D8 outer, #265CC8 inner) against colour's three-tone bevel (#5578D8 / #325FC5 / #155BCC, C25); colour's values are built.
- Mid-video full-frame runs: 27 in 24 reels here (P15) against 26 in structure (S16).
- Presenter on-screen share agrees with structure exactly (51.9 %, S11).

## Open questions

- What is the reference raw format? The 2.184x ratio and a 962-px panel showing more room than the full-frame view imply a source at least 2,100 px wide at full-frame scale (4K landscape is the likely candidate) but this cannot be recovered from the finished files.
- Is any blur applied to the room inside the panel? It cannot be decided on a plain wall; Gen C's soft background looks optical.
- Which matting tool is used? The smooth, strand-free outline with a 4-5.5 px edge is consistent with an automatic person matte.
- Why does Gen C repeat a frame every 6 frames (25 fps project or camera conformed to 30)? Inferred from cadence only.
- Where does the Gen B microphone sit in split mode? It is black on a black hoodie and was not measurable.
- Is the 0.89x presenter block in clip35 a deliberate layout option or a one-off? Only one reel shows it.
- The travelling glint on the blue border, the one-frame blend at some mode changes and the zoom-settle after interstitials were seen in passing; they belong to motion and were not measured here.

## To check by eye or ear

- Jump-cut counts are detector output; only about 30 of 74 candidates were confirmed by eye, and the Gen C figures are inflated by its repeated-frame cadence. A watch-and-listen pass would settle the true rate.
- The hair-top anchor (y 1137, highest sample >= 1110) and the 500-580 face-x tolerance in the split recipe are my reading of corpus ranges applied to footage the reference never handled; check them on a rendered test with real captions above the head.
- Split mode on the target clips puts the boom mic over about 19 % of the panel and the face 54-75 px left of centre; someone should judge whether that reads as on-style or whether the shoot framing should change.
- Full-frame mode needs a 1.75-1.81x upscale of the 1080-px target footage; check sharpness on a phone before committing, or record wider or at higher resolution.
- Matte softness (sigma about 1.5 px) was measured through VP9 at 1-2 Mbps; the true feather in the original edit may be slightly tighter.
- Border colours (#5175D8 outer, #265CC8 inner) are single-row samples from 3 reels; take the colour analyst's values.
