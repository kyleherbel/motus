# Motion

Every frame of the 11 in-style clips was decoded through a pipe (12,791 frames at 30 fps, VP9, luma converted from limited to full range) and nothing was measured on sampled frames. Each animated element was measured with a generative fit per frame: frame = field plate + opacity x shift and scale of a Gaussian-blurred copy of the settled element, which returns opacity, blur sigma in px, scale and vertical offset. 121 replacements, additions and removals, 34 layout changes, 11 title builds and 11 call-to-action builds were fitted this way; captions, highlights, count-ups, staggers, the field and all holds were measured with separate per-frame trackers.

Main findings. (1) One primitive does almost everything: an element enters in 10 frames (fade in while a 23 px blur rises, travel up about 60 px on an ease-in-out curve, blur clears last) and exits in 7 frames (blur up, fade, accelerate upward 64 px); replacements overlap both and finish in 13 frames. (2) A layout change is an animated reflow: caption (964 <-> 1482 px) and presenter panel (940 px) share cubic-bezier(0.65,0,0.35,1) over 5.9 frames, wrapped in the same blur. (3) The opening title is frame-identical in all 11 clips and is built by frame 17. (4) Captions are hard cuts. Highlights wipe from the left in 4 frames. Figures count up on ease-in-out exponential. (5) Held graphics are perfectly still; the only idle motion is the wave boundary of the dot field (period 300 frames). (6) In presenter mode the graphics layer updates on only 7 of every 10 frames (holds on frame % 10 in {4, 6, 9}); in full mode it updates on every frame.

Not done: nothing was watched as playback. Count-up digits were read by eye. Scripted interface demos inside graphics (cursors, playheads, typing) were catalogued, not measured. Toggle knob travel was not resolved. Easing shapes for opacity and blur ramps could not be told apart from linear.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [M01] In presenter mode (presenter panel visible) the whole graphics layer updates on 7 of every 10 output frames and repeats the previous frame on the other 3; captions, presenter footage and layout moves change on any frame. In full mode the graphics layer updates on every frame.

- Values: Held frames are frame % 10 in {4, 6, 9} counted from frame 0 (10 of 11 clips; clip30 uses {3, 6, 8}). Share of those frames that are exact repeats while the layer is animating: median 0.76 (0.70 to 0.87 per clip); other frames 0.09. Full mode: no periodic holds (0.40 against 0.19, no fixed residues). Each update advances animation time by one constant step (count-up growth ratio 6.31 to 6.36 per update whether the gap is 1 or 2 output frames), so the layer is a 21 fps stream held on a 30 fps timeline. Durations of the same animation match across modes in output frames (entrance 10 frames in both).
- Evidence: n=11 clips, 12,791 frames. clip29@3-17 (repeats at 4, 6, 9, 14, 16), clip29@560-700.
- Confidence: high for the cadence; medium for the 21 fps reading (rests on 3 count-ups)
- Verified, not confirmed (the other claim holds): the picture advances on 6 of every 10 frames: frames with n%10 = 1, 4, 6, 9 show the state of the frame before. That is an 18 fps stream: state index = floor(0.6*n + 0.3). Test on pixels that change between frame n-1 and n+1: on residues 1, 4, 6, 9 the share still showing the old state is 1.00, on 0, 3, 5, 8 the share already showing the new state is 1.00, on 2 and 7 it is about half (190 to 300 frames per residue, 5 clips, same result for the field and for the graphics slot). Residues 4, 6, 9 are bit-exact repeats (relative changed-pixel count 0.01, 0.01, 0.00 over 623 decades); residue 1 repeats the state but 14 % as many pixels change slightly as on an update. clip30 is shifted by one frame (exact repeats on 3, 6, 8). Build value: render every frame; to imitate the reference hold the graphics layer on frames with n%10 in {1,4,6,9}.
- Verified, confirmed: every frame. Share of frames with almost no change is 0.02 to 0.08 on every residue (135 decades); the field plate repeats exactly on 4 to 19 % of frames with no residue pattern. Build value: every frame.
- Verified, confirmed: any frame, in both modes. Caption changes start on all ten residues: 130 to 229 change frames per residue in SPLIT, 28 to 50 in FULL, including the residues on which the graphics hold. The layout move runs on its own clock of 36 steps per second (one double step every 5 frames, see duration). Build value: captions and layout animate on every frame.
- Verified, corrected: an artefact of rendering or conforming. Reasons: (1) the holds are tied to the output frame number from frame 0, the same in 10 of 11 clips, not to the start of any animation; (2) animation time is real time, sampled: the field loop and the mode change start at arbitrary sub-step phases and keep their real-time speed; (3) the rate changes with the presence of the presenter video (18 fps with it, every frame without it), not with the graphic; (4) in the same frames the layout move runs at 36 steps per second and the graphics at 18, both as floor(rate/30 * (n + 0.5)), which is what nearest-frame sampling of a faster and a slower stream produces; (5) one repeat in ten is not bit-exact, which points to an intermediate encode. Build value: do not build the cadence into the style; render graphics, captions and layout on every frame.

### [M02] Every graphic arrives and leaves through one primitive: Gaussian blur plus opacity plus a short vertical travel. There is no hard cut, wipe or push between two graphics.

- Values: Blur is isotropic (sigma_x 15.7 px, sigma_y 15.5 px on the same frame). Peak blur sigma 23 px in every use: entrances median 23.0 (15 to 37, n=51), exits 18.5 (full) and 21.7 (presenter), layout changes 22.6 to 24.4 (n=34). Model F = plate + a * shift_scale(blur(element)) fits with RMSE 1 to 3 luma levels on settled frames and 3 to 9 mid-transition.
- Evidence: n=96 replacements, 21 additions, 4 removals and 34 layout changes fitted on every frame in 11 clips. clip29@308-331, clip29@632-647.
- Confidence: high

### [M03] Entrance of one element takes 10 frames from first visible to sharp, in three overlapping phases: fade in while the blur rises, then travel to the rest position, then the blur clears last.

- Values: Frames after first visible: opacity 0.15 at 0.5, 0.36 at 1.5, 0.72 at 2.5, 0.88 at 3.5, 0.96 at 5.5 (linear over 5.0 frames, RMSE 0.13; ease-out cubic 0.12, not distinguishable). Blur / peak: 0.48 at 1.5, 0.79 at 2.5, 0.94 at 3.5, 1.00 at 4.5, 0.95 at 5.5, 0.79 at 6.5, 0.62 at 7.5, 0.47 at 8.5, 0.14 at 9.5, 0.02 at 10.5. Travel progress: 0.02 at 3.5, 0.14 at 4.5, 0.54 at 5.5, 0.91 at 6.5, 0.97 at 7.5, 0.99 at 8.5. First visible to sharp: full-mode additions median 10 (8.4 to 13.2, n=9, 6 clips), presenter-mode additions median 10 (10 to 13, n=12, 7 clips).
- Evidence: Pooled curve: 12 full-mode entrances in 7 clips (164 frame samples) and 39 presenter-mode entrances in 11 clips. clip29@346-357, clip36@462-472, clip36@652-662, clip30@1074-1085.
- Confidence: high for the duration and the order of phases; medium for the curve shapes
- Verified, confirmed: 10 frames (9 or 10 in 13 of 13; n=13 entrances, 5 clips, all in the full-height layout), error +-1 frame Build value: 10 frames (0.34 s).
- Verified, corrected: linear over 3.0 frames (2.8 to 3.1 on 7 light elements in 5 clips; three tiles of clip34 read 1.5, 4.3 and 4.8 because a frame is dropped inside their ramp); per-frame medians after first visible: 0.21, 0.52, 0.80, 0.99, 0.99 (n=13); the ramp starts 0.2 to 0.8 frame before the first visible frame. Error +-0.2 frame. Build value: opacity 0 to 1, linear, over 3 frames (0.10 s).

### [M04] An entering element starts below its rest position and slightly small, and travels up on an ease-in-out curve. Nothing travels sideways.

- Values: Start offset +60 px (call-to-action first lines: 60, 60, 60, 69; clean full-mode additions: 57, 62, 63, 66; all entrances median 43 in full mode and 53 in presenter mode, range 22 to 81). Start scale 0.94 (clean cases 0.885 to 0.988; medians 0.93 full, 0.96 presenter). Travel easing cubic-bezier(0.65,0,0.35,1) over 4.8 frames, RMSE 0.068 (ease-in-out quart over 6.1 frames 0.068; linear 0.072). dx within 0.5 px.
- Evidence: n=12 full-mode and 39 presenter-mode entrances; offsets from 21 additions. clip29@347-354, clip30@1291-1299, clip31@785-798.
- Confidence: medium: the offset varies by element and the scale is weakly determined
- Verified, confirmed: not one value and not proportional to height: 71.2, 62.4, 56.0 px (three large blocks, 439 to 669 px tall), 39.6 (a 54 px label in the same scene as the 71.2 block), 40.0, 39.7, 39.8, 32.5 (four logo tiles), 34.3 and 31.9 (two figures), 21.8 and 21.8 (two chips of one component), 24.6 (outlined chip); n=13, 5 clips. offset/height runs from 0.09 to 0.73 (r=0.73). Error +-1.5 px. dx 0. Build value: 60 px for cards and other large blocks, 40 px for tiles and labels, 32 px for big figures, 22 px for chips.
- Verified, confirmed: 0.94 on large blocks (0.939, 0.940, 0.939, 0.935; n=4, 2 clips); 0.80 on logo tiles and one figure (0.79 to 0.80, n=5, 2 clips); 0.90 on one figure; 0.70 on chips (0.699, 0.710); 0.61 on two round badges (poor fits). Error +-0.005. Build value: 0.94 for cards and large blocks; 0.80 for tiles and figures; 0.70 for chips.
- Verified, confirmed: progress per frame after first visible (median, n=13): 0, 0, 0, 0.04, 0.27, 0.69, 0.92, 0.96, 0.99, 1; 10 / 50 / 90 % at 3.4 / 4.6 / 5.9 frames. cubic-bezier(0.65,0,0.35,1) over 5.5 frames starting 2.5 frames after the opacity start: RMSE 0.037. easeInOutExpo over 10.25 frames starting with the opacity (start offset median +0.2 frame): RMSE 0.036. Not distinguishable. Scale and offset share one curve. Error +-0.5 frame on the duration. Build value: easeInOutExpo over 10 frames, same start as the opacity and the blur (or the claimed bezier over 5.5 frames starting 2.5 frames later).

### [M05] Exit of one element takes 7 frames: the blur rises first, then the element fades and accelerates upward. It leaves at full size.

- Values: Frames after the exit starts: blur / peak 0.22 at 1, 0.53 at 2, 0.81 at 3, 1.00 at 4 (linear over 4.6 frames, RMSE 0.20 of peak); opacity 0.99 at 2, 0.95 at 3, 0.84 at 4, 0.43 at 5, 0.13 at 6, 0.06 at 7 (ease-in-out cubic over 6.9 frames, RMSE 0.074; linear over 3.2 frames 0.084); travel -3 px at 4, -12 px at 5, -32 px at 6 (ease-in cubic to -64 px over 4.4 frames, RMSE 7 px). Peak sigma 18.5 px (10 to 23). Scale 1.000.
- Evidence: n=7 full-mode exits in 5 clips (59 frame samples), 32 presenter-mode exits in 11 clips with the same medians. clip29@311-317, clip36@571-577, clip37@156-162, clip30@1238-1244.
- Confidence: medium: 7 exits measured on every-frame updates; the 32 presenter-mode exits agree
- Verified, confirmed: 5 to 7 frames to gone (7, 7, 6, 5; n=4, 3 clips); sigma/peak 0.22-0.33, 0.46-0.74, 0.80-0.93, 1.0 at frames 1 to 4; peak sigma 19.2 px (18.2, 18.9, 19.5, 20.4, read while opacity > 0.5); opacity 0.99, 0.93-0.98, 0.76-0.94, 0.27-0.51, 0.07-0.17, 0.02 at frames 2 to 7; travel -2 to -3 px at frame 3, -6 to -10 at 4, -19 to -29 at 5, -29 to -42 at 6; last readable -42 px at 1.5 to 13 % opacity; scale 0.997 to 0.999. Error +-1 frame, +-2 px sigma. Build value: 7 frames: blur 0 to 19 px linear over frames 0-4 then held; opacity 1 to 0 between frames 3 and 7 (ease-in); translateY 0 to -64 px ease-in cubic over 7 frames; scale 1.

### [M06] When one graphic replaces another, the exit and the entrance start on the same frame and overlap; the new graphic is sharp 13 frames after the old one starts to blur.

- Values: Entrance first visible minus exit start: median 0 frames (p90 5.0, n=64 presenter-mode replacements, 11 clips; median 0, p90 5.2, n=19 full-mode). Exit start to entrance sharp: median 13 frames (p10 9.3, p90 19.7) in presenter mode, 11 in full mode. Exit duration median 7 (presenter) and 6 (full). A sequential variant exists: clip29@311-328 exits in frames 311-317 and enters in 318-328 (17 frames).
- Evidence: n=83 replacements. clip29@635-645, clip29@426-436, clip29@311-328.; swap_landmarks
- Confidence: high for the overlap and total; medium for what selects the sequential variant
- Verified, confirmed: median 0 frames (n=51 swaps with a region where only the new graphic shows, 11 clips): exactly 0 in 35, within +-1 in 41, largest +19. Three light cards in the full layout leave first and the next graphic starts 6 to 7 frames later. Build value: start both on the same frame.
- Verified, corrected: two groups, same in both layouts: 7 to 12 frames, median 10, when the new graphic is one part (24 of 75: 21 presenter, 3 full); 14 to 24 frames when the new graphic builds in parts or follows a sequential exit (50 of 75). Median over everything, last part counted: 15 presenter (n=60), 17 full (n=15). Error +-1 frame. Build value: 10 frames for a one-part swap (= the entrance length); add the graphic's own stagger for later parts.

### [M07] A layout change (graphic over presenter to full-height graphic and back) is an animated reflow, not a cut: the caption and the presenter panel move vertically on one shared ease-in-out curve.

- Values: Caption centre y 964 <-> 1482 px (519 px). Panel top 980 px <-> off the bottom edge (940 px); panel offset / 940 equals caption progress within 0.03. Easing cubic-bezier(0.65,0,0.35,1) over 5.9 frames (5.5 to 6.3 across the four tracks), trimmed RMSE 0.017 to 0.028; ease-in-out quart over 7.2 frames fits equally (0.017 to 0.026); cubic-bezier(0.42,0,0.58,1) over 4.2 frames 0.023 to 0.032; linear 0.028 to 0.044. Measured progress: 0.02 at -2.5 frames from the midpoint, 0.07 at -1.5, 0.13 at -1, 0.25 at -0.5, 0.71 at +0.5, 0.83 at +1, 0.92 at +1.5, 0.95 at +2, 0.99 at +3. No overshoot (median 1.0004 after settling).
- Evidence: n=34 layout changes (17 each way) in 11 clips, 2 to 4 per clip; these frames update on every frame. clip29@114-125, clip29@540-548, clip30@1030-1043.
- Confidence: high
- Verified, not confirmed (the other claim holds): 957 px (95 % interval 955 to 958) for 520 px of caption travel: slope 1.8396, n=52 frames from 24 mode changes with the panel 30 to 880 px from rest. Rest top is 960.0 (seam fit). With 940 px the panel would lead the caption by a median 0.8 % of the travel (rms 1.0 %); with 960 px the difference is -0.14 % (rms 0.30 %). Error +-3 px, with a likely small low bias once most of the panel is off screen. Build value: 960 px (panel top from 960 to 1920).
- Verified, corrected: easeInOutExpo: p = 2^(20x-10)/2 below x=0.5, 1 - 2^(-20x+10)/2 above. RMSE 0.79 px of caption travel (520 px) over 526 frames of 32 mode changes (15 exits, 17 returns, 11 clips). Alternatives at their own best duration: easeInOutQuint 3.10 px, cubic-bezier(0.65,0,0.35,1) 3.81 px, easeInOutQuart 3.81 px, cubic-bezier(0.87,0,0.13,1) 4.16 px, easeInOutCubic 4.93 px, linear 23 px. The panel follows 960 times the same curve with rms 3.4 px (71 frames). Build value: easeInOutExpo (exact formula, not a cubic-bezier).
- Verified, corrected: 12.0 animation steps = 10.0 output frames = 0.333 s from first to last movement (fitted duration 12.00 steps for exits and for returns; +-0.1). 1 % to 99 % takes 6.8 steps = 5.6 frames. A step is 1/36 s: the layout clock advances 6 steps every 5 output frames, with one double step per 5 frames (on n%5 = 2 in 11 and n%5 = 3 in 18 of 63 unambiguous cases; never on 0, 1, 4; clip30 on n%5 = 4). 181 steps were counted over 150 frames (1.207 per frame). Movement of 1 px or more is visible on 8 to 9 frames. Build value: 0.333 s (10 frames at 30 fps), sampled in real time.
- Verified, confirmed: the same symmetric curve both ways, so the return is the exit reversed. Expo fit: exits RMSE 0.66 px, duration 12.0 steps (15 changes, 243 frames); returns RMSE 0.88 px, 12.0 steps (17 changes, 283 frames). Example exit clip30@1032-1038, panel px below rest: 1.4, 5.4, 54.0, 171.5, 536.9, 826.5, 919.0. Example return clip30@568-574, px below rest: 940.3, 809.9, 504.3, 160.9, 50.7, 15.5, 0.5. Build value: one curve for both directions.
- Verified, confirmed: yes. Panel offset/960 minus caption offset/520: median -0.0014, p05 -0.0061, p95 +0.0010, rms 0.0030 (n=52 frames, 24 changes). The double steps of the 36 Hz clock land on the same frames for both. Build value: one progress value drives both.
- Verified, confirmed: 984.01 (p10 983.97, p90 984.07, n=11,663 stem columns, per clip 984.01-984.02) and 1503.99 (p10 1503.94, p90 1504.03, n=6,261, per clip 1503.98-1504.00). Registration of whole captions: 983.97 (n=8) and 1503.97 (n=22). Ink centroid: 963.2 (p10 961.1, p90 965.1, n=518 groups) and 1483.0 (p10 1480.9, p90 1485.0, n=252). Error +-0.1 px. Build value: baseline y = 984 (split), 1504 (full height); 520 px apart.

### [M08] Around the layout move, everything except the caption goes through blur: graphics and presenter panel blur up before the move, cross over during it and sharpen after it. The caption stays sharp and readable the whole time.

- Values: Relative to the midpoint of the move: graphics start to blur at -4.3 frames (p10 -4.6, p90 -3.7); outgoing graphic blur sigma 8, 14, 19, 23 px at -4, -3, -2, -1; outgoing opacity 0.82, 0.57, 0.22, 0.06 at -4, -2, 0, +2; incoming first visible at -3.7, opacity 0.23, 0.67, 0.85, 0.95 at -3, -1, +1, +2; incoming blur holds 17 to 23 px until +1, then 20, 18, 9, 2.5 px at +2, +3, +4, +5; incoming offset +80 px until -1, then 48, 22, 4 px. Presenter panel blur about 20 px (coarse) while moving, sharp by +6. Whole change about 10 to 13 frames.
- Evidence: n=34 layout changes; landmark counts 12 to 17 per direction. clip29@108-131, clip29@536-559.
- Confidence: high for the order and the graphics values; medium for the panel blur (estimated against moving footage)
- Verified, corrected: sigma(step) = 15.7 * sin(pi * step / 12) px, rms 1.4 px (n=68 clean frames, 40 exit and 28 return, 28 changes). Medians by step: 0.5: 2.6, 1.5: 4.4, 2.5: 9.3, 3.5: 12.3, 4.5: 13.6, 5.5: 15.6, 6.5: 15.6, 7.5: 14.1, 8.5: 12.5, 10.5: 4.4. Peak (steps 5 to 7.2) median 15.6, range 13.8 to 19.1, n=34. Horizontal over vertical sigma 0.95 (p10 0.78, p90 1.00). Error +-1 px. Build value: 16 px peak, half-sine over the move (0 at both ends).
- Verified, confirmed: sharp, no blur and no motion blur. The lower text edge goes from 90 % to 10 % ink in 2 rows at rest (p90 4, n=433 frames) and in 3 rows while moving 15 to 354 px per frame (p90 5, n=142). Build value: no blur on the caption.

### [M09] The opening title build is one fixed timeline, identical to the frame in every clip: illustration and line 1 together, then lines 2, 3 and 4, complete on frame 17.

- Values: First visible / settled frame: illustration 3 / 8, line 1 3 / 8, line 2 7 / 12, line 3 8 / 15, line 4 12 / 17. Frames 0 and 1 show the empty field; frame 2 has opacity 0.01 to 0.02. Layer updates fall on frames 3, 5, 7, 8, 10, 12, 13, 15, 17 (rule M01). Spread across clips at any frame: opacity under 0.05, blur under 1.3 px, scale under 0.003.
- Evidence: n=11 clips (clip39 has 3 lines). clip29@0-19, clip31@0-19.
- Confidence: high
- Verified, confirmed: Identical in 11/11 clips (line 4: n=10). Illustration: opacity 0.011 on f2, 0.149 on f3-4 (scale 0.9237, sigma 3.2), 1.00 on f5-6 (0.9596, sigma 15.0), f7 scale 0.9960 sigma 2.6, f8-9 scale 0.9997 sigma 0.5, exact from f10. Line 1: 0.015 on f2; f3-4 opacity 0.198, -0.413 flat cap, sigma 2.30; f5-6 0.994, -0.21, 13.5; f7 -1 px, 2.2; settled f8. Line 2: 0.028 on f5-6; f7 0.287, -0.40, 3.4; f8-9 0.992, -0.13, 11.5; f10-11 -1 px, 1.5; settled f12. Line 3: f8-9 0.056, +0.42, 2.2; f10-11 0.497, +0.37, 5.2; f12 1.00, +0.085, 7.7; f13-14 +1 px, 1.1; settled f15 (on f7 opacity is 0.002, at the noise floor). Line 4: f12 0.077, +0.42, 2.2; f13-14 0.786, +0.34, 7.7; f15-16 0.999, +0.05, 5.3; settled f17. Spread across clips: opacity <= 0.02, sigma <= 0.5 px, scale <= 0.0015. Error: opacity +-0.01, offset +-0.5 px (+-1 px at sigma > 10), sigma +-0.3 px. Build value: first readable frames 3, 3, 7, 8, 12; settled 8, 8, 12, 15, 17 (3-line title: 15).
- Verified, confirmed: Confirmed in 11/11: mean abs frame-to-frame change over the field is 2.7-48 luma levels on 3, 5, 7, 8, 10, 12, 13 (15: 0.8-7.3; 17: 0.7-4.2 in the 10 four-line clips; clip39 ends on 15), 0.6-1.1 on frame 2, and 0.01-0.16 on 4, 6, 9, 14, 16. Frame 11 changes by 0.5-0.7 (16x16 block p99.9 1.6-2.1 against 82-97 on frame 10): a codec refresh, not a state. 3 states per 5 frames = 18 per second. Build value: do not reproduce; render the build at the full frame rate.

### [M10] Each title line fades in sharp, blurs while it travels, then clears. The two light lines drop in from above, the two bold lines rise from below. Lines are staggered by about 3 frames.

- Values: Per line over 3 to 4 layer updates (5 to 6 frames): opacity 0.06 to 0.29 on the first update, 1.0 one or two updates later; blur sigma 2 to 3 px on the first update, peak 13.4 (line 1), 11.4 (line 2), 7.6 (lines 3 and 4) px, then under 2 px. Offset on the first update = 0.41 x the cap height of that line (0.40 to 0.42 in 10 clips): -22 to -32 px for lines 1 and 2, +29 to +40 px for lines 3 and 4. Scale 1.000. Stagger between the 50% travel points of lines 3 and 4: 2.8 frames; first-visible gaps 4, 1, 4 frames.
- Evidence: n=11 clips x 4 lines, frame-identical. clip29@3-17.
- Confidence: high for the samples; medium for the continuous curve (3 to 4 samples per line because of rule M01)
- Verified, not confirmed (the other claim holds): One tween per part, ease expo.inOut. Lines: duration 0.320 s (0.333 s fits within 5 percent of the cost), line 1 starts at 0.007 s, stagger 0.1000 s (0.099-0.101 for every easing tried), so starts 0.00 / 0.10 / 0.20 / 0.30 s. Illustration: starts at -0.004 s (use 0.00), 0.34 s. Because expo.inOut is flat at both ends, visible change runs from start + 0.05 s (opacity 2 percent) to start + 0.27 s (within 1 px): that visible span is what the hook claim describes. Build visually complete at 0.57 s. Absolute phase uncertain by +-0.03 s (one state = 55.6 ms); stagger and duration do not depend on it. n = 516 line states and 88 illustration states from 11 clips. Build value: expo.inOut, 0.33 s per part; starts: illustration 0.00 s, line 1 0.00 s, line 2 0.10 s, line 3 0.20 s, line 4 0.30 s.
- Verified, confirmed: Direction: lines 1-2 start above (dy < 0), lines 3-4 start below (dy > 0) in 43/43 lines, 11 clips. First visible state: 0.413 x flat cap height through the origin (per line 0.413, 0.397, 0.421, 0.418; n=43; rms 0.7 px; a fixed-pixel distance misses by 7.7 px rms) = 0.40 x the ink height with overshoot. Start of the underlying tween: 0.425 x flat cap height (0.30 em if the cap height is 0.70 em). 22-33 px for light lines, 29-70 px for heavy. Error +-0.5 px. Build value: 0.425 x flat cap height (0.30 em); light lines from above, heavy lines from below.
- Verified, confirmed: sigma = 52.7 x p x (1 - p) px with p the eased progress: peak 13.18 px (fit over 368 visible line states, rms 0.42 px, worst 1.9 px). Sampled peaks: line 1 13.52 px (13.20-13.68, n=11), line 2 11.50, lines 3-4 7.71 and 7.70: the lower values are the same curve sampled at another phase. The blur is in pixels and does not scale with the cap height (53 to 168 px caps give the same sigma). A time-based bump (sin) fits worse. Build value: sigma = 13.2 px x 4 p (1 - p).
- Verified, corrected: expo.inOut over 0.32 s: slide rms 0.25 px, blur rms 0.42 px, worst slide error 1.4 px. power4.inOut over 0.23 s: 0.30 / 0.62 / 1.4. power3.inOut over 0.19 s: 0.34 / 0.69 / 1.6. Ease-out alternatives are 2.5 times worse: power3.out 0.67 / 1.07 / 3.0-3.6, expo.out similar. No overshoot: no state past rest. The same ease fits the call-to-action keyword decisively (1.3 px rms against 4.3 for power4.inOut and 18 for power3.out). Build value: expo.inOut (GSAP naming), 0.33 s.

### [M11] The title illustration scales up from 0.92 to 1.00 about its own centre while it fades and blurs through, with no vertical travel.

- Values: Scale 0.924, 0.960, 0.996, 1.000 on frames 3, 5, 7, 8 (spread 0.002 across clips); opacity 0.15 then 1.00 from frame 5; blur sigma 3.2, 15.5, 2.4, 0.2 px; dy within 3 px.
- Evidence: n=11 clips. clip29@3-8, clip33@3-8.
- Confidence: high
- Verified, confirmed: Scale 0.9237 (0.9229-0.9243) on f3-4, 0.9596 on f5-6, 0.9960 on f7, 0.9997 on f8-9, 1.0000 from f10; opacity 0.149 / 1.00; sigma 3.2 / 15.0 (14.9-15.1) / 2.6 / 0.5 px; shift |dx|, |dy| <= 0.3 px on every frame. 0.924 is the first visible state: the tween starts at 0.919 (expo.inOut, 0.34 s, blur 15.0 px x 4p(1-p), scale rms 0.0005). Held: against frames 22-31 the last held frames (44 to 127) fit scale 1.0000, shift 0.00 px, mean abs difference 0.05-0.19 levels in 11/11: static, no drift or zoom. Build value: scale 0.92 to 1.00 about the slot centre (540, 290), opacity min(1, p/0.4), blur peak 15 px, no translation, static while held.

### [M12] Captions never animate. A new word group replaces the old one on a single frame, and the orange active-word colour switches on a single frame. The caption moves only during a layout change (rule M07).

- Values: 767 group changes and 1,088 colour switches: 1,556 change on one frame, 274 are two separate hard changes on adjacent frames, 25 are three or more adjacent hard changes. Of 475 isolated group changes, 469 are complete on their first frame (median text-mask difference to the next frame 0.0000); the 6 others sit next to a graphic that crosses the caption band. Colour states per group: first word orange, next word orange, none orange after the last word ends. Group change minus nearest transcript word onset: median +0.6 frames (p10 -2.2, p90 +3.0).
- Evidence: n=11 clips, 1,855 caption changes on every frame. clip29@124-130, clip29@604-609, clip29@647-651.; caption_first_frame_check
- Confidence: high
- Verified, confirmed: 0 frames with a partly visible, offset or scaled group. Entries: first against second frame of 762 groups with the same highlight state: opacity slope median 1.0000 (p5 0.9988, p95 1.0017), shift median 0.000 px, scale median 1.0000, soft IoU median 0.999. 43 exceed the tolerance: 21 are the tail of a layout change (vertical travel 1-15 px), 3 lie under the leaving title, 19 are a 0.3-0.75 px horizontal centroid shift with opacity 0.997-1.009 and scale within 0.2 % (the orange word settling in the codec). Exits: 693 groups, 11 exceed: 6 layout change or title, 5 centroid only. 802 of 831 consecutive groups follow with 0 empty frames; 27 gaps of 4-18 frames are layout changes, 1 is the demo (453 frames), 1 is a 2-frame group. Build value: hard cut; no fade, slide or scale.

### [M13] A text highlight is an orange bar that grows from its left edge to full width in about 4 frames, with the fast part in the middle.

- Values: Right edge / final width per frame: 0, 0.22, 0.77, 0.95, 0.99 (342 px bar); 0, 0.07, 0.77, 1.00 (60 px); 0.02, 0.06, 0.24, 0.68, 0.97 (266 px); 0, 0.20, 0.93, 0.98 (558 px); 0.01, 0.21, 0.69, 0.92, 0.98 (594 px). Frames from first visible to 97%: median 4 (3 to 7), no clear dependence on width. Pooled median per frame around the 50% point: 0.14, 0.73, 0.95, 0.98, 0.99. Ease-in-out cubic over 3.4 frames RMSE 0.054; linear over 1.6 frames 0.055 (not distinguishable). Left edge fixed.
- Evidence: n=8 wipes in 6 clips, full mode (updates on every frame). clip29@187-192, clip29@280-283, clip36@283-288, clip32@161-166.
- Confidence: medium: 8 clean wipes; the easing is under-sampled
- Verified, confirmed: hard-edged wipe from the left (coverage left of the edge 0.95 to 1.0). Width in px per frame from the frame before the first sliver: 346 px bar: 6, 82, 266, 328, 341, 345; 62: 0, 6, 48, 62; 603: 4, 13, 45, 163, 557, 587, 594, 597; 597: 4, 10, 129, 412, 545, 581, 591, 593; 268: 2, 8, 21, 67, 181, 257, 263, 265; 594: 2, 19, 53, 148, 380, 515, 563, 586, 589; 274: 0, 5, 9, 25, 77, 249, 266, 271, 273; 342: 3, 9, 29, 92, 238, 323, 329, 341. 5 % to 95 %: median 3.35 frames (2.3 to 4.6); first visible to 97 %: median 4.5 (2 to 6); n=8 bars, 5 clips, full layout. Fraction against frames from the 50 % point: 0.013, 0.027, 0.16, 0.66, 0.93, 0.98, 0.99 at -3... +3. easeInOutExpo over 9.0 frames RMSE 0.026; cubic-bezier(0.65,0,0.35,1) over 4.75 frames 0.028; linear over 2 frames 0.033. Error +-0.3 frame. Build value: left-to-right wipe, easeInOutExpo over 9 frames (5 % to 95 % in 3.3 frames).

### [M14] Big figures count up: the digits are replaced on every layer update with the formatted intermediate value (thousands separators and suffix kept), on an ease-in-out exponential curve, while the figure blurs

- Values: easeInOutExpo over 7.50 layer updates (7.50, 7.52, 7.50) = 10.7 output frames in presenter mode; RMSE 0.0002 to 0.0006 of the final value (ease-in-out quart 0.008 to 0.010; indexed by output frame instead of update 0.008 to 0.013). Values read by eye: 26, 164, 1,039, 6,598, 30,452, 38,496, 39,763, 39,963, 40,000; 0, 1, 8, 51, 230, 289, 298, 300; 6,916, 43,812, 278,822, 1,770,410, 4,614,111, 5,124,682, 5,205,092, 5,220,123. The first 5 updates are blurred.
- Evidence: n=3 figures in 2 clips, all in presenter mode; values read by eye. clip29@555-568, clip29@835-847, clip33@350-362.
- Confidence: medium: 3 figures, digits read by eye, but the fit is exact
- Verified, corrected: easeInOutExpo, confirmed by a constant ratio between consecutive readings on both tails: log2 step of the remaining distance per frame 1.67, 1.67, 1.68, 1.68 (clip34, = 20/12), 1.38, 1.28, 1.34, 1.34, 1.31, 1.32 (clip38, = 20/15), 1.30, 1.28, 1.22 (clip35), 2.66 to 2.68 per layer update (clip29, = 20/7.5). A quart or cubic gives steps that shrink toward the middle. Length in output frames: big figures 12.8 (clip38@417-429), 12.9 (clip35@769-778), 13.3 (clip29@555-568, presenter layout, 8 layer updates in 13 frames); an in-card value 10.2 (clip34@761-771). Error +-0.7 frame. Fitted on the output-frame axis the curves are not separable (RMSE 0.020 to 0.034 for expo, 0.020 to 0.040 for quart) because dropped and repeated frames distort that axis. Build value: easeInOutExpo over 13 frames (0.43 s) for a big figure; 10 frames for a value inside a card; digits replaced each frame with thousands separators and suffix kept.

### [M15] The call to action builds as two standard entrances: the 'Comment' line first, the quoted keyword line 7 frames later; an icon, when present, comes with or after the keyword. The previous graphic exits at the same time as the first line enters.

- Values: Keyword first visible minus first line first visible: 7, 7, 7, 7, 7, 6, 5, 5, 2, 0 frames (median 6.5, n=10). Each line first visible to sharp: median 10 frames (8 to 10 first line, 8 to 15 keyword). First line start offset +60 px (60, 60, 60, 69 in the clean fits). First line appears a median 6 frames before the transcript onset of the spoken word (range -64 to +6, n=10). It then holds to the end of the clip: median 75 frames (51 to 128).
- Evidence: n=11 clips fitted on every frame (10 with both lines separated). clip31@785-803, clip32@962-983, clip36@1125-1141, clip39@770-787.
- Confidence: medium: layer separation is rough in 3 clips with an icon above the text
- Verified, not confirmed (the other claim holds): Hook is right in 11/11. First full state: offset x +138.5 px (137.7-139.5; clip38 143.2), offset y 0.0 (max |dy| 0.35 px), rotation +5.99 degrees clockwise (5.95-6.04; clip38 6.40), scale 1.000 (0.999-1.002), blur peak sigma 23.3 px (22.9-23.5; clip38 24.3). Offset and rotation shrink together (rotation/6 = 1.008 x offset/139, rms 0.023). First visible T0+7 (6-8) in 10 clips, sharp T0+15..18 (median 17), 8-10 frames; clip38: starts with line 1 at T0, sharp T0+10. Model-free check: strip-centroid tilt 5.26 degrees (4.0-5.9) and ink centroid +131 px where the fit says more than 4 degrees (n=26 frames); r = 0.999 with the fit over 203 frames. Error: offset +-1 px, rotation +-0.05 degrees. Build value: x +139 px to 0 and rotation +6 degrees clockwise to 0 together, about the line centre; no scale, no vertical offset; blur peak 23.5 px.
- Verified, confirmed: First state: scale 0.939 (0.930-0.940), 60.0 px low (59.4-61.8), opacity 0.10-0.54 depending on phase, n=8 clips with a clean first state; blur peak sigma 22.4 px (21.3-23.4); sharp at T0+10 in 10/11, T0+11 in clip29. Build value: scale 0.94 to 1, rise 60 px, blur peak 22 px.
- Verified, confirmed: Both lines: one tween, expo.inOut, 0.34 s (keyword 0.336 s, position rms 1.3 px; line 1 0.339 s, 1.4 px); blur = peak x sin(pi x u) in linear time (23.7 px keyword, 22.1 px line 1; rms 0.45 and 1.1 px), not 4p(1-p). The line 1 tween starts 0.02 s before the first changed frame T0. Keyword start minus line 1 start: 0.208 s (3.61-3.80 states in 8 clips); clip38: 0.00 s. Whole block sharp 0.55 s after T0. Build value: line 1: start T0, 0.34 s; keyword: start T0 + 0.21 s, 0.34 s; ease expo.inOut; blur = peak x sin(pi x u).

### [M16] Rows, tiles and chips that belong to one graphic appear one after another with a stagger of 2 to 3 frames, in reading order.

- Values: 50% times of consecutive items: list rows 157.1, 161.4, 162.5, 164.7 and 258.0, 260.5, 262.8, 265.4 (clip31); tiles 934.4, 936.4, 937.4 and outlines 997.5, 999.5, 1002.5 (clip36); toggles 1034.3, 1036.5, 1037.5, 1039.6 (clip29). Gaps 1.0 to 4.2 frames, median 2.2.
- Evidence: n=6 windows in 3 clips, about 20 items. clip31@155-170, clip31@244-270, clip36@932-942, clip36@994-1006, clip29@1025-1048.
- Confidence: medium-low: few windows, presenter-mode quantisation (rule M01)
- Verified, confirmed: median gap 2.1 frames (n=24 gaps in 7 graphics, 6 clips): four logo tiles 2.35, 2.05, 1.7 (clip34, full layout); six toggles 2.12, 1.05, 2.1, 2.19, 2.57 (clip29); three sidebar rows 2.40, 2.27 (clip31); three logo tiles 2.11, 4.62 (clip36); three icon tiles 1.09, 1.71 (clip33); eight tiles 0.55, 1.22, 1.96, 2.06, 0.1, 0.8, about 1 per tile (clip35); thumbnails in three stacked cards 4.25, 5.41, 5.0, 5.0 (clip31, full layout). Reading order in 7 of 7. Error +-0.5 frame in the full layout, +-1 in the presenter layout (repeated layer frames). Build value: 2 frames (0.07 s) between consecutive parts, reading order.

### [M17] Small state changes inside a graphic that stays on screen do not use blur: a toggle or a tile outline changes within 1 to 2 frames, and a panel state can cross-fade in 3 to 4 frames.

- Values: Toggle 10% to 90% within 1 to 2 frames (9 toggles, clip29@1033-1042); tile outline on within 1 frame (3 tiles, clip36@998-1003); plain cross-fade opacities 0.98, 0.66, 0.20, 0.04 with blur 0 (clip31@283-286). 59 change bursts of this kind were detected and left unfitted.
- Evidence: n=3 windows in 3 clips measured; 59 bursts counted in 11 clips.
- Confidence: low: few cases measured, knob travel not resolved

### [M18] Progress bars inside mock interfaces fill at constant speed, unlike everything else.

- Values: Three bars of 146, 232 and 282 px fill linearly at 20 to 23 px per frame in 5, 10 and 14 frames (clip31@238-252); a 78 px bar fills linearly in 5 frames (clip33@617-622).
- Evidence: n=4 bars in 2 clips.
- Confidence: low: 2 clips

### [M19] The field has one idle motion: the upper boundary of the dot lattice is a wave line that rises and falls slowly, in whole lattice rows, and repeats every 300 frames. The dots themselves do not move, flicker or carry grain.

- Values: Lattice pitch 12 px, identical phase in 11 clips. Boundary y at the frame edges: 432 to 648 px (5th to 95th percentile), 204 px peak to peak, in 12 px steps; mean speed 2.2 to 4.0 px per frame (one row every 3 to 5 frames); autocorrelation peak at 292 to 308 frames in 8 clips (no clear peak in clips 31, 36, 37). Frame 0 has the same boundary in every clip (564 px at the left edge, 540 px at the right). Dots are binary on or off; the boundary row is about 8 levels brighter. In presenter mode the wave follows rule M01.
- Evidence: n=11 clips, every frame, tracked at the left and right frame edges only (the middle is covered by graphics). clip29@16-111.
- Confidence: high for existence, range and step; medium for the 300 frame period and unknown for the full-width shape

### [M20] A graphic that has finished entering holds perfectly still: no slow push, no drift, no breathing scale.

- Values: First against last frame of every hold of 24 frames or more: scale median 1.00000 (5th to 95th percentile 0.99985 to 1.00030), dy median 0.00 px (-0.05 to +0.05).
- Evidence: n=138 holds, 6,532 frames, 11 clips.
- Confidence: high
- Verified, confirmed: 8 static graphics held 68 to 328 frames (median 118): scale 0.9999 to 1.0002, shift <= 0.01 px. 8 more whose content changes during the hold (rows light up, a video plays, an illustration animates): apparent scale 0.996 to 1.002, apparent shift <= 0.7 px, none a rigid move. n=16 graphics, 10 full layout and 6 presenter layout, 10 clips. A synthetic 0.2 % zoom with 0.5 px shift is recovered as 0.2 % and 0.499 px. Build value: no motion during a hold: scale 1, offset 0.

### [M21] Two exceptions to stillness were seen once each: a captured page that scrolls slowly inside its card, and a contour-line backdrop that morphs continuously.

- Values: clip29@440-537: page content moves up 180 px in 97 frames on an ease-in-out curve, peak 2.3 px per frame, with a double step 3 times in every 15 frames. clip36@353-742: contour lines change on every frame (mean absolute luma change 0.10 per frame; fitted scale 0.995 to 1.003 between hold ends).
- Evidence: n=1 clip each.; scroll steps in idle.held_graphics.exceptions
- Confidence: low: seen once each

### [M22] Transitions are cued by speech: a graphic change or a layout change starts on or just after a word onset.

- Values: Graphic transition start minus nearest transcript word onset: median +0.4 frames, p10 -2.7, p90 +2.9, 66% within 2 frames (n=108). Layout change blur start: median -1.0, 65% within 2 frames (n=34). Caption group change: median +0.6, 68% within 2 frames (n=767). A nearest-word offset is bounded by half the word spacing (about 4.5 frames), so these shares show alignment only weakly.
- Evidence: n=11 clips. triggers
- Confidence: medium-low: machine transcript, not forced-aligned

### [M23] When a numbered section heading stays on screen, only the body under it is replaced; the heading does not blur or move.

- Values: Read by eye from every-frame strips: clip38@1044-1055 (heading sharp while the card below blurs out and an illustration blurs in), clip33@479-497 and clip33@749-768 (heading replaced together with the body when the section number changes).
- Evidence: n=2 clips, by eye from every-frame strips. clip38@1044-1055, clip33@479-497, clip33@749-768.
- Confidence: low: by eye, 2 clips

### [M24] Durations are set in time, not in output frames: the same entrance takes 10 frames whether the layer updates on every frame or on 7 of 10.

- Values: First visible to sharp: full mode median 10 frames with 9.5 layer updates (n=12); presenter mode median 10 frames (mean 11.4) with 7.0 layer updates (n=37). Ratio of updates per frame 0.99 and 0.62.
- Evidence: n=49 entrances in 11 clips. swap_landmarks, frame_cadence
- Confidence: medium

### [M25] Nothing overshoots, bounces or rotates, and nothing scales past its rest size.

- Values: Travel past rest: median 0.00 px, 5th percentile -1.2 px (n=45 entrances). Largest scale while opaque: median 1.0000 (n=58; 95th percentile 1.04 is fit noise on 3 events). Layout move progress after settling: median 1.0004 (n=380 samples). Title layers: scale at most 1.000 in 10 clips. Rotation: none in any every-frame strip (by eye) and no residual pattern in the fits.
- Evidence: n=11 clips.
- Confidence: high
- Verified, not confirmed (the other claim holds): Hook is right in 11/11. First full state: offset x +138.5 px (137.7-139.5; clip38 143.2), offset y 0.0 (max |dy| 0.35 px), rotation +5.99 degrees clockwise (5.95-6.04; clip38 6.40), scale 1.000 (0.999-1.002), blur peak sigma 23.3 px (22.9-23.5; clip38 24.3). Offset and rotation shrink together (rotation/6 = 1.008 x offset/139, rms 0.023). First visible T0+7 (6-8) in 10 clips, sharp T0+15..18 (median 17), 8-10 frames; clip38: starts with line 1 at T0, sharp T0+10. Model-free check: strip-centroid tilt 5.26 degrees (4.0-5.9) and ink centroid +131 px where the fit says more than 4 degrees (n=26 frames); r = 0.999 with the fit over 203 frames. Error: offset +-1 px, rotation +-0.05 degrees. Build value: x +139 px to 0 and rotation +6 degrees clockwise to 0 together, about the line centre; no scale, no vertical offset; blur peak 23.5 px.

### [M26] One blur size and one family of curves serve the whole style: peak blur sigma 23 px, ease-in-out cubic for anything that travels, ease-in-out exponential for counting figures, straight ramps for opacity and blur.

- Values: Peak sigma medians: 23.0 entrance, 22.6 to 24.4 layout change, 18.5 to 21.7 exit; title lines 7.6 to 15.5 (smaller, shorter). Travel: ease-in-out cubic 4.8 frames (entrance), 5.9 frames (layout move), about 3.4 frames (highlight). Count-up: ease-in-out exponential, 10.7 frames.
- Evidence: Summary of M03, M05, M07, M13, M14. build_spec
- Confidence: medium: a reading across rules, each with its own n

## Constant and variable

CONSTANT (to the frame or within measurement noise in every clip): the title build timeline and all its values (11 clips); the dot lattice (12 px, same phase) and the frame-0 wave; caption changes as single-frame cuts; the 7-of-10 update cadence in presenter mode (same residues in 10 of 11 clips); caption y 964 and 1482 px and panel travel 940 px; the layout-move curve (5.5 to 6.3 frames); peak blur about 23 px; no overshoot, no rotation, no drift.

VARIABLE: entrance start offset 22 to 81 px (mode 60) and start scale 0.885 to 1.0, apparently by component; title line offset = 0.41 x cap height, so 22 to 40 px with the font size of the line; exit and entrance either overlap fully (median lag 0) or run one after the other (lag up to 7 frames); replacement total 9 to 20 frames; highlight wipe 3 to 7 frames; number of layout changes 2 to 4 per clip; keyword delay in the call to action 5 to 7 frames (two outliers 0 and 2); which three frames in ten are held (clip30 differs).

## Open questions

- Should a builder reproduce the 7-of-10 update cadence in presenter mode or render graphics on every frame? The cadence is measured in all 11 clips but looks like a production artefact (a 21 fps layer on a 30 fps timeline). A person must compare clip29@560-700 (presenter mode) with clip29@300-430 (full mode) in playback.
- Opacity and blur ramps: linear and eased shapes fit equally (RMSE 0.12 to 0.20 on pooled samples). An entrance rendered at 60 fps or a source project would decide.
- Entrance start offset: fixed 60 px or proportional to element size? Values cluster at 57 to 69 px but range 22 to 81. Measuring element heights against offsets (graphics analyst geometry) would decide.
- Title lines: the first sample shows 0.41 x cap height. If line 1 shares the illustration's progress (0.24 on that sample) the true start offset is about 0.53 x cap height. Only 3 to 4 samples per line exist.
- Layout move: ease-in-out cubic over 5.9 frames and ease-in-out quart over 7.2 frames fit equally well.
- The scrolling capture at clip29@440-537 advances 18 steps per 15 frames, a third cadence not seen elsewhere; cause unknown.
- Full-width shape and travel of the field wave: only the frame edges and frames 0 to 2 are uncovered. The colour analyst's plate recipe should be checked against.

## Needs an eye or an ear

- Play clip29 frames 560-700 and 300-430: does the stepped update of graphics over the presenter read as intended or as stutter?
- Play a layout change at speed and confirm blur, slide and sharp caption: and show every frame.
- Check the count-up digits read by eye against.
- Play the title build (clip29@0-20) and confirm lines 1-2 drop from above and lines 3-4 rise from below.
- Decide whether the contour-line backdrop in clip36@353-742 is a graphic or a second field treatment.
- Look at toggles, tile outlines and scripted interface demos (clip29@1025-1048, clip36@994-1006, clip30@100-560, clip33@118-282): shows three of them frame by frame.
- Confirm by eye that nothing rotates anywhere; the fits model only blur, opacity, scale and vertical shift.
