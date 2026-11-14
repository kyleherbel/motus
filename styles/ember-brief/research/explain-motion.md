# Explaining an idea: how the devices move

Second study of the 51 units the first study filed as still illustrations and diagrams (206.6 s of 11 clips). All 51 were watched on every-third-frame sheets of the graphics zone; 25 were then measured with code on every frame of their event windows through a calibrated decode (yuv444p, BT.709 limited to full in numpy; a white card reads 255.0, 255.1, 254.2). Trackers: arc-length progress along a centreline for paths, template and circle fits for travellers, a generative fit (opacity, scale, blur, shift) and blob footprints for landings, LK feature tracking with a similarity transform for the camera, digit template matching for timers, per-tile energy for grids and mosaics. Curves were fitted with free start and duration against 6 to 10 easings each; RMSE is given for the winner and the runners-up.

Findings. (1) The graphics run on a clock of 1.2 steps per output frame; in the split layout only every second step is shown, so curves there were fitted on uniform state time. (2) Lines draw on expo.inOut over a fixed 12 frames; dashed and dotted patterns are fixed and revealed. (3) A traveller always sits on the tip and takes 22 to 31 frames for the whole path; its arrival triggers an event. (4) Badges land in place from 0.55 scale on expo.inOut in 10 frames with a 12 px blur; tags use the standard chip entrance. (5) Contrary to the first study, overshoot and rotation do occur here: 19 overshooting events in 4 clips (a pin, star nodes, a pixel-art unit, one traveller) and two rotating devices. (6) Timers are linear at 12 units per second with proportional digits; a mosaic fills at random with one-frame tiles; a shape fills with the same progress as its count. (7) The one view travel is a camera move: sine.inOut pan with a cosine zoom dip to 0.80. (8) Sine waves between objects do not move; playheads move linearly. (9) 39 of 51 units are still after their last event.

Not done: nothing was watched as playback and nothing was heard. 26 units were watched but not measured. Most rules rest on one unit, and most instances sit in the split layout, where 5 to 18 states are available per event. Colours of thin strokes are antialiased readings. Corner positions of badges, the icon morph, row strikes and three figure entrances are by eye. The map's 3D camera move, the pipe's full path, the people icons, the flag and the internal staggers of timeline tiles were seen and not fitted. The view-travel pan distance depends on an assumed zoom centre in y (400 to 520 gives 859.4 to 859.5 px).

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [D01] Run every device animation on one clock and state its durations in real output frames at 30 fps; the reference's own graphics clock runs 1.2 steps per output frame and drops or repeats frames, which is not to be copied.

- Values: Full layout: 1.192 animation steps per output frame (59 single steps of 11.3 px and 14 double steps of 22.5 px on a constant-speed traveller; a double step every 5 frames). Timers: +0.3/0.4 s on 33 frames and +0.6/0.7 s on 8 of 41 frames. Split layout: a new state on 6 of 10 frames (frame % 10 in 0,2,3,5,7,8), each worth 2 steps. Authored length = measured frames x 1.2. Exception: the demo playhead (clip30) moves 1.63 px on every frame with no double steps. Split-layout curves were fitted on the uniform state time k x 10/6 frames.
- Evidence: n=4 instances in 4 clips: clip37@173-229, clip35@815-856, clip33@578-620, clip31@522-550.
- Confidence: high

### [D02] Draw a stand-alone connector line on as a stroke with round caps that grows from its start anchor on expo.inOut over a fixed 12 frames, whatever its length; it first shows as a round dot.

- Values: clip35: cream #F2EEE8 line 228.8 px long, 10.9 px thick; length by state 0.07, 0.09, 0.29, 0.87, 0.98, 1.0 (8 frames visible); expo.inOut over 13.25 frames RMSE 0.021 (quart in-out 8.75 f 0.027; bezier(.65,0.35,1) 6.75 f 0.027; cubic in-out 0.029; sine in-out 0.033). clip39: accent vertical line 452 px, top to bottom, per frame 0.07, 0.32, 0.76, 0.93, 0.98, 0.99, 1.0; expo.inOut 11.25 f RMSE 0.012 (bezier 5.75 f 0.013; cubic in-out 0.016; quart out 0.028). Duration is fixed (13.25 f for 229 px, 11.25 f for 452 px), so speed scales with length. clip33: four thin cream sine lines 499 px draw left to right in 5-6 frames (extent 0.02, 0.33, 0.94, 0.99, 1.0 by state), one state apart, top line first.
- Evidence: n=3 instances, 3 clips: clip35@1052-1060 (split), clip39@526-533 (full), clip33@842-848 (split).
- Confidence: medium: three instances, two of them in the split layout with 5-6 samples

### [D03] Build dashed and dotted paths as a fixed pattern that is revealed up to the tip (the dashes do not march): pitch about 30 px on main paths, tighter on small marks.

- Values: Dashed route (clip36): accent #FE6B19, dash 22.3 px, gap 7.6 px (pitch 29.9, p10-p90 27.1-30.4, n=29 dashes), round caps, width 6.3 px on a hard mask (about 8.5 px by eye on a 3x crop); complete dashes mid-draw sit 0.8 to 2.0 px from their final centres (marching would give about 7.5). Undrawn connector (clip31): grey #4C4C4B dots, diameter 10.1 px, pitch 29.95 px (29.82 to 30.08 in 5 frames, 2 connectors); the drawn part is a solid accent stroke 9.5 px that covers them. Dotted arc (clip37): 25 accent dots, diameter 7.9 px, pitch 18.0 px (17.7-18.4), on a circle of radius 237 px, 104 degrees, 442 px long. Marker drops (clip33, n=4): dash 8 px, gap 7.5 px, stroke 2-3 px, 578 px, 39 dashes. No bend radius could be measured: the paths are smooth curves or straight polylines with sharp joints (clip37 route).
- Evidence: n=4 path kinds, 4 clips: clip36@672-710, clip31@528-535 and @628-632, clip37@173-228, clip33@583-632.
- Confidence: medium: each pattern measured in one clip

### [D04] A dotted path that only carries travellers is not drawn on: it appears whole within 2 frames and leaves with the scene.

- Values: Arc alpha 0.03, 0.81, 0.91 on frames 172, 173, 174; exit 0.92, 0.24, 0.08 on 228, 229, 230.
- Evidence: n=1: clip37@172-230 (full layout).
- Confidence: low: seen once

### [D05] Put a traveller at the tip of every drawn path: the line ends under the traveller, never ahead of it. Use a solid accent dot about twice the stroke on a thin connector, and a cream disc carrying a mark on a long route.

- Values: Tip under traveller in 3 of 3 path-drawing travellers (clip36: tip within 70 px of the disc centre, disc radius 61; clip37 route; clip31). Sizes: accent dot 21 px on a 9.5 px line (20.1-21.7, n=4 frames; 2.2 x stroke), no ring; cream disc #F2EEE8 122 px with a mark, no ring (clip36); cream disc #FBF8F2 50 px with a mark and a warm halo to r 36 px on a 9 px glowing route (clip37); loop traveller: accent core 16 px + cream ring 4 px wide, outer 25 px (clip37 arc); capsule about 76 x 48 px inside a pipe (clip34).
- Evidence: n=5 travellers, 4 clips: clip31@525-548 and @622-645, clip36@672-694, clip37@283-305, clip37@173-229, clip34@585-593.
- Confidence: medium

### [D06] Give a one-shot traveller a fixed time of 22 to 31 frames for the whole path, eased, not a constant speed; the path draws on the same progress value.

- Values: clip36 (full layout, 923 px): expo.inOut over 25.75 frames RMSE 0.0134 (bezier(.65,0.35,1) 13.75 f 0.0183; quart in-out 17.75 f 0.0186; cubic in-out 0.0215; sine in-out 0.033; linear 0.049); visible motion 673-690; peak 212 px per frame. clip37 route (split, 770 px on screen, on a perspective map): sine.out over 22.25 frames RMSE 0.009 (quad out 23.5 f 0.011; cubic out 0.023; sine in-out 0.029; linear 0.034); peak about 55 px per frame at the start. clip31 (split, 465-520 px, twice): linear at 23.4 px per frame with a soft stop RMSE 0.008-0.010, or sine.inOut over 28-32 frames 0.009-0.015 (not separable). clip34 capsule: whole pipe in 8 frames, last steps 53, 12.6, 5.8, 3.7 px. Length against time: 923 px in 25.75 f, 770 px in 22.25 f, 465-520 px in 24-31 f.
- Evidence: n=5 travels, 4 clips.
- Confidence: medium: one curve per instance, three different best fits

### [D07] A looping traveller runs along its path at near-constant speed, fades in over the first part and out over the last, and is relaunched before the previous one has gone.

- Values: clip37 arc (full layout): 11.3 px per animation step = 13.3 px per output frame (400 px per second), mild acceleration 9.5 to 12.5 px per step over one life (0.2-0.3 px per frame squared; linear fit RMSE 4.4-5.9 px, quadratic 2.9-3.4 px); launch period 16, 17, 16 frames (0.55 s); visible from 11 % to 78 % of the 442 px path; ring luma rises over 11 %-28 % and falls over 57 %-79 %; two travellers visible for about 6 of every 16.5 frames; direction from the source card to the device; runs for the whole hold (56 frames, 3.4 cycles).
- Evidence: n=1 unit, 4 tracks: clip37@173-229.
- Confidence: low: one unit

### [D08] Mark a traveller's arrival with an event on the target, not with a plain stop.

- Values: 5 arrivals: (a) clip36: the disc runs 12.7 px past its rest point on frame 691 (1.4 % of the travel), reads 493.1, 483.3 on the next two frames and rests at 492.15 from frame 694; (b) clip37: the disc cross-fades into a destination pin that pops from the point (rule D10) while a ring spreads and fades over 5-6 frames; (c) clip31: the dot merges into an 18 px anchor dot half hidden behind the next card as the view stops; (d) clip34: the target's text is replaced 5 frames after the capsule arrives and a row lights 3 frames later; (e) clip37 loop: fades out. Ring pulses in the demo player (clip33): radius 51, 76, 120 px on consecutive states, fading; 4 rings.
- Evidence: n=5 arrivals, 4 clips.
- Confidence: medium for the list; low for each recipe (one instance each)

### [D09] Land a badge on an anchor in place: scale from 0.55 to 1.0 on expo.inOut over 10 frames, opaque within 3 frames, with a blur of about 12 px that clears last; no vertical travel. Draw the glyph (a check) in the last 2 states.

- Values: Start scale 0.50 (clip32 check disc, 148 px accent), 0.515 (clip38 red ring and cross on a dark fill, 200 px), about 0.55 (clip30 corner badge, by eye). clip32 by state: scale 0.50, 0.51, 0.56, 0.89, 0.99, 1.0; blur sigma 5, 5, 7, 11, 9, 3, 0 px; opacity 0.26, 0.90, 1; dy 0.0-0.4 px; expo.inOut over 10.25 f RMSE 0.0034 (quart in-out 7.25 f 0.011; bezier 5.75 f 0.012; cubic in-out 0.014). clip38: scale 0.515, 0.515, 0.82, 0.89, 1.0; blur 11, 14, 13, 2, 0. First visible to sharp: 10, 7, 10 frames and 6-7 (three corner discs, clip34, by eye). Largest fitted scale 1.005: no overshoot (n=4 fitted: clip32, clip38, clip30, and the status disc of rule D10). Position: on the top-right corner of the anchor in 5 of 6 (laptop, 3 cards, paper stack), centred on it in 1 (cross over a phone); by eye.
- Evidence: n=6 badges, 4 clips: clip32@893-903, clip38@705-712, clip30@1405-1414 (full layout), clip34@312-318 (3).
- Confidence: medium: two fitted, four by eye; five of six in the split layout

### [D10] Two harder pops exist for a connection made: a status disc that snaps on without blur, and a map pin that overshoots.

- Values: clip35 check disc on the midpoint of a line (green #317C52, 90.4 px, centre 603.4 against line midpoint 603): scale 0.57, 0.885, 1.0 on three states (5 frames), blur under 2 px, opaque from the first state, no overshoot; the line recolours from cream to the product colour within 2 frames. clip37 pin: inner disc 59.5, 65, 63, 60.5 px on states 307, 308, 310, 312 = scale 0.98, 1.074, 1.041, 1.0; back.out(1.7) over 6.75 frames RMSE 0.013 (back.out(1.2) 0.022; expo.out 0.038; cubic out 0.040), first sample 0.45 read by eye.
- Evidence: n=2, 2 clips: clip35@1072-1075, clip37@305-312 (both split layout).
- Confidence: low: one instance each, 3-5 samples

### [D11] Price tags and short labels inside a picture use the standard chip entrance, not the badge pop: blur, fade, a rise of 15 to 30 px and a start scale of 0.6 to 0.7, sharp after 10 frames.

- Values: clip30 accent '$0' tag (full layout): scale 0.585-0.63 for 4 frames then 0.675, 0.855, 1.0; dy +15 to 0; blur 11-17 px; opacity 0.06, 0.75, 1.0; sharp on frame 10. clip36 accent '1s' tag (full layout): opacity 0.23, 0.57, 0.89, 1.0; scale 0.705 for 5 frames then 0.735, 0.93, 0.96, 0.975, 0.99, 1.0; dy 30, 30, 30, 27, 27, 6, 3, 0; blur 4, 5, 7, 9, 11, 14, 14, 11, 9, 1, 0; 10 frames. clip32 check disc inside a phone: scale 0.945, dy +30, blur peak 22 px, 8-9 frames.
- Evidence: n=3, 3 clips: clip30@1438-1448, clip36@653-662, clip32@372-380.
- Confidence: medium

### [D12] Overshoot exists in these units, in four places only; everything else settles without it.

- Values: Pin pop 7.4 % (clip37, n=1); star node on a ruler 0.895, 1.097, 0.983, 1.0 by step, the 1.097 held 2-3 frames (clip33, n=4, areas 386, 580, 466, 482 px, identical in all four); pixel-art pops 8 to 12.5 % (clip38, n=13, rule D13); traveller disc 12.7 px past rest (clip36, n=1). Without overshoot: 7 fitted landings (largest scale 1.005; an eighth fit, a flag, failed and is not counted), 3 line draws, 2 camera moves (scale returns to 1.0004), 5 calendar flips with their turns.
- Evidence: n=19 overshooting events in 4 clips against 17 measured events without.
- Confidence: medium: 17 of the 19 are in two units

### [D13] In a pixel-art picture, land things in hard steps with no blur: 0.6 scale, then 1.1, then 1.0; and time each landing to a strike of a tool that winds up first.

- Values: Chips (240 x 140 px): 0.60 for 2-3 frames, 1.083 wide / 1.114 high for 2 frames, then 1.0 (n=4). Red cross (80 px): 0.66 for 2 frames, 1.125 for 1-2, then 1.0; starts 2-3 frames after its chip (n=4). Green checks replacing the crosses: 0.6 for 1 frame, 1.125 for 2, then 1.0 (n=4). 'Fixed.' stamp (330 x 140, accent outline): 0.60 for 3 frames, 1.11 for 1, then 1.0 (n=1). Hammer: rest 24 degrees; wind-up +19.5 degrees over 4 frames at a constant 5.2 degrees per frame; strike -50 degrees in 2 frames; holds 3 frames; returns in 2-3 frames; 5 swings starting on frames 1065, 1083, 1105, 1116, 1133; each chip appears 0-1 frame before the head reaches the strike angle.
- Evidence: n=13 pops and 5 swings, one unit: clip38@1058-1150 (full layout).
- Confidence: low: one unit

### [D14] When a shape fills with a figure, drive the fill level and the count from the same progress value: the fill rises from the bottom as the digits run.

- Values: clip29 star: fill fraction 0.012, 0.013, 0.031, 0.173, 0.935, 0.983, 0.986, 0.992 against count progress 0.001, 0.004, 0.026, 0.165, 0.761, 0.962, 0.994, 1.0 on the same states (difference under 0.03 on 7 of 8, +0.17 on the steepest one); at 17 % the accent pixels span y 460-521 of a star spanning 211-502, so it fills bottom to top; fill alone fits expo.inOut over 8.25 frames RMSE 0.045 (quart in-out 0.048, cubic in-out 0.048). Count values are the first study's readings by eye.
- Evidence: n=1: clip29@555-568 (split layout).
- Confidence: low: seen once

### [D15] In a race between two cards, run both timers linearly from the same frame at the same rate, stop the winner hard, then fast-forward the loser on an ease-in curve.

- Values: Both timers advance on every frame from frame 815: 0.4001 s per frame = 12.00 timer seconds per real second (linear RMSE 0.096 s over 42 frames; 10 per authored second). Winner stops at 17.0 on frame 857 with no easing. Loser is identical to frame 856, then runs 16.4 to 104.6 in 18 frames: power2.in over 17.25 frames RMSE 0.018 (quart in 21.75 f 0.017; quad in 0.029; expo.in 0.039; cubic in-out 0.048) and stops on frame 874. Digits are proportional, not tabular: the text is anchored at its left edge (x=572), a '1' is 41 px wide and other digits 65-82 px (cap height 93-96 px), so the unit suffix moves.
- Evidence: n=2 timers, one unit: clip35@815-874 (full layout); digits read by template matching on every frame.
- Confidence: low: one unit (the readings themselves are exact)

### [D16] Fill a mosaic that stands for the counted items in random order, each tile switching on in one frame, so that the last tile lands on the frame its timer stops; a cost figure beside it steps only when a tile lands.

- Values: 10 x 10 tiles, pitch 41.6 px. Winner: 0 to 100 tiles on frames 821-857 (timer stops 857), mean 3.0 tiles per frame, at most 8; against time: quad in-out over 45.5 frames from 815.5 RMSE 0.022 (sine in-out 0.026, linear from 822 over 32 f 0.040); against its timer it lags then tracks (timer 0.22, 0.36, 0.49, 0.65, 0.85 -> tiles 0.10, 0.17, 0.42, 0.68, 0.88). Loser: 2.0 tiles per frame while racing (0.67 x), 54 lit when the winner stops, 100 on its timer's last frame (874). Order: rank correlation with reading order 0.06 and 0.31, with distance from the centre 0.03; mean grid distance between consecutive tiles 5.05 against 5.23 +- 0.21 for random; the two cards' orders correlate -0.06. Tile rise 25 % to 90 %: 0 frames on 200 of 200. Cost text changes on the frames where the lit count changes and on no others.
- Evidence: n=2 mosaics, one unit: clip35@815-874 (full layout).
- Confidence: low: one unit

### [D17] Populate a grid of look-alike tiles as a diagonal sweep from the top-left, each tile fading in over 6 to 7 frames; a figure that names the count enters after the grid, by the standard entrance, without counting.

- Values: clip33: first-visible frame rises about 6 frames along a row of 10 (0.67 frame per column) and 6 frames down 8 rows (0.86 frame per row); visible sub-tiles per frame from 676: 24, 27, 31, 39, 48, 60, 71, 111, 124, 138, 145, 156, 169 (all by 688); tile rise 10 %-90 %: median 7 frames; rank correlation of order with row + column 0.45 (grid clustering was rough: 169 sub-cells for about 80 tiles). 5 accent tiles of 88 px. The figure '78' appears on frames 697-706, after the grid; no intermediate value was seen (by eye). The grid of device icons in clip29@814-826 arrives whole.
- Evidence: n=1 populated grid (clip33@676-695, full layout), 1 grid arriving whole (clip29).
- Confidence: low: one instance, rough tile map

### [D18] Flip a calendar tile by squashing the label toward the top edge and growing the next one from it, about 7 frames per month and one month every 11.5 frames; turn the refresh mark beside it exactly once per flip.

- Values: Label height by state 89, 75, 27 | 32, 77, 87 px (out in 2 states = 3.3 frames, in over 2-3 states); label centre y 437 -> 342 while it squashes. Flip starts on frames 318, 330, 342, 352, 363 (intervals 12, 12, 10, 11). Refresh mark (accent ring radius 44.6 px, below the tile): 4.988 clockwise turns over the 5 flips; each turn expo.inOut over 11 to 12.5 frames RMSE 0.015-0.025 (quart in-out 7.5-8.5 f 0.017-0.027; bezier 6 f 0.018-0.027); peak about 230 degrees between two states (about 139 degrees per frame); the middle of the turn falls on the label change. Rows of the list beside it are struck and removed one per flip (by eye).
- Evidence: n=5 flips and 5 turns, one unit: clip32@317-372 (split layout).
- Confidence: low: one unit

### [D19] Swap an icon inside a card by morphing its outline into the next icon over 8 to 10 frames while the colours and the card tint cross-fade; no blur, no slide, no cut.

- Values: 4 swaps at about frames 470, 498, 525, 570 (intervals 27, 27, 44 frames, set by the spoken list). Main change lasts 4 to 6 states (7 to 10 frames); change energy peaks in the middle (16.7, 28.8, 19.4, 8.1, 5.5). Sharpness (Laplacian variance) moves straight from one icon's level to the next (105 -> 238; 261 -> 101) with no dip, so there is no blur-through. The outline is a hybrid shape mid-swap (by eye, frame 502).
- Evidence: n=4 swaps, one unit: clip35@445-583 (split layout).
- Confidence: low: one unit; the morph is read by eye

### [D20] Draw sine waves between two objects as a still picture: they do not travel.

- Values: clip30: fitted phase is constant on all 74 frames from 955 to 1028 (cream wave 0.112 rad on every frame; accent -2.455 to -2.366, the spread being fit jitter), and there is no new graphics state between 952 and the exit at 1031. Accent wave: wavelength 282-284 px, amplitude 33.1 px, stroke 4 px; cream wave: 276 px, 35.6 px, stroke 5 px; shared axis y=455, x 379 to 693 (1.1 wavelengths), phase offset 142 degrees; sine fit RMSE 2.8-3.4 px. The laptop waveform in clip30@1316-1400 is also still (5 of 84 frames change, all from a badge landing). A waveform burst in clip33@855-857 grows from its centre line to full height in 2 states (0.38 then 1.0), holds 8 frames and shrinks into a slot in 3 states.
- Evidence: n=3 wave pictures, 2 clips: clip30@940-1030, clip30@1316-1400, clip33@855-868.
- Confidence: medium for stillness (2 units), low for the geometry

### [D21] Move playheads and plotter pens at constant speed with hard starts and stops; light or draw the waveform only behind them.

- Values: Demo player (clip30, full layout): playhead 3 px wide, 533 px tall across two tracks, x 247.6 -> 987.35 on frames 107-562 at 1.6293 px per frame (48.9 px per second), linear RMSE 0.12 px over 445 frames, first step 1.6 px and last step 0.3 px (no easing); bars behind it read luma 248, ahead 86, with a hard edge at the playhead. Plotter card (clip33, full layout): carriage 11.0 px per animation step = 13.07 px per frame (549 px in 42 frames), waveform edge 18.5 px per frame (778 px; edge = 1.417 x carriage - 223), both linear. A timeline playhead in clip39 draws down and then stays at x=447 for 90 frames.
- Evidence: n=2 moving playheads, 2 clips: clip30@107-562, clip33@578-620; 1 static: clip39@533-622.
- Confidence: medium

### [D22] When the pen passes a marked point, fire a marker: a dashed drop falls to the ruler in under 3 frames, a node pulses, and the connector and the target outline switch on in the frame the drop lands.

- Values: 4 markers at x=192, 343, 644, 795, each about 3 frames after the pen passes. Drop extent on consecutive frames 51, 258, 578 px (twice) and 156, 578 / 32, 578 (a dropped frame); power1.in over 2.6 frames RMSE 0.003-0.004 (cubic in 3.1 f 0.004; expo.inOut 0.037). Node area 386, 580 (2-3 frames), 466, 482 px. Connector 0 -> 253 px and film-frame outline +1,600 px within one frame.
- Evidence: n=4, one unit: clip33@583-632 (full layout).
- Confidence: low: one unit

### [D23] Let particles drift slowly while a figure counts, then gather them into the shape in about 16 frames on an exponential curve.

- Values: clip39: about 8 px squares (median area 61 px), 2.5 per 100 x 100 px, about 9 % accent; drift 0.45 px per state = 0.27 px per output frame with no common direction (median dx, dy under 0.07 px) on frames 232-257. Gather: median step per state 0.55, 0.68, 1.0, 3.1, 18.3, 12.3, 3.9, 1.9, 0.83, 0.56, 0.41, 0.25 px (258-277; p90 33 px at the peak); progress 0.05 at 262, 0.54 at 265, 0.91 at 268; expo.out over 15.75 frames RMSE 0.022, expo.inOut over 21.25 frames 0.023 (quart in-out 0.030, bezier 0.030). Piles of cards and files (clip32@751-759, clip33@351-363) arrive whole by the blur entrance: no multiplying was seen.
- Evidence: n=1 gather: clip39@258-277 (split layout); 2 piles checked on sheets.
- Confidence: low: one instance

### [D24] Travel the view along a chain of cards as one camera move: pan on sine.inOut over 31 frames, and dip the zoom to 0.80 at the middle on one cosine period; nothing blurs, and the connector's traveller uses the same progress.

- Values: Travel 1 (frames 522-550, 18 states): pan 859.5 px; sine.inOut over 31.0 frames RMSE 0.0027-0.0042 (quad in-out 33.5 f 0.0105; linear 0.017; cubic in-out 0.024); scale by state 0.993, 0.976, 0.949, 0.916, 0.881, 0.848, 0.821, 0.804, 0.798, 0.804, 0.821, 0.848, 0.882, 0.917, 0.950, 0.976, 0.994, 1.000; scale = 1 - 0.2025 x (1 - cos(2 pi t)) / 2 over 30.0 frames RMSE 0.0004 (1 - A sin(pi x sineInOut) 0.0020; linear tent 0.0080). Travel 2 (617-647): same form over 31.25 frames, minimum 0.803, RMSE 0.0004. Zoom centre x=540; rotation under 0.14 degrees per step. Text stays sharp while moving (by eye, 3 frames); the next card fades up as it approaches. In the frame the traveller runs a straight diagonal from (348, 708) to (772, 147), which is what one shared progress gives. Starts 1.2 and 3.2 frames after a word onset.
- Evidence: n=2 travels, one clip: clip31@522-550 and @617-647 (split layout).
- Confidence: medium for the curves (two matching travels, RMSE 0.0004 on zoom); low for generality (one clip)

### [D25] After its last event an explanatory picture is still, unless it is a playback, a loop or a moving-media illustration.

- Values: Of 51 units, 12 keep moving to the end of their hold: 5 demo playbacks (clip30-u022 for 15.2 s; clip33-u088 and u106; clip39-u233 and u234), 1 looping traveller (clip37-u173), 2 on a contour backdrop that morphs at 0.02 px per frame (0.22 px per 10 frames, 0.77 px per 40; changes on 78 of 80 frames), 1 particle drift (clip39-u228), 3 illustrations that are themselves moving footage (clip34-u114, clip39-u220, clip39-u230). The other 39 show only the dot-field wave (median change 0.02-0.12 luma levels, under 6 % of pixels). Still after the last event, examples: clip35 versus card 51 frames, clip30 waves 79 frames, clip39 timeline 90 frames, clip38 pixel scene 34 frames with 0 changes.
- Evidence: n=51 units; window = frames last-44 to last-10 of each.
- Confidence: medium: classed by change energy against the field-wave baseline, three checked by eye

### [D26] Start each device event on the word that names it.

- Values: Event start minus nearest transcript word onset, frames: +1.2, +3.2, -1.4, -2.0, +2.6, +1.0, -3.2, -0.6, -4.0, +2.4, -4.8; arrivals -3.0, -1.6. Median -0.6, median absolute 2.4, 9 of 13 within 3 frames. Words: 'tell' (view travel), 'connect' (line), 'hierarchy' and 'spacing' (chips), 'fixes' (stamp).
- Evidence: n=13 events, 7 clips; machine transcript, about +-2 frames. speech_sync_frames
- Confidence: medium-low: transcript not forced-aligned

### [D27] Rotation is used as a device, not as decoration: a refresh mark and a tool swing, each tied to a repeated event.

- Values: Refresh mark: 5 full turns (rule D18). Hammer: 5 swings (rule D13). No other part of the 51 units rotates outside embedded playback footage and the three moving-media illustrations. One 3D camera move: the map tilts and pushes in on clip37@232-283 before its route draws (not fitted).
- Evidence: n=2 rotating devices, 2 clips.
- Confidence: medium for the count (all units watched), low for the 3D move

### [D28] Counters inside pictures update on every frame; what differs is the curve: linear for running time, expo.inOut for a total, a step for a price per item.

- Values: Linear: 2 timers (rule D15). Expo.inOut total: the first study's count-ups (13 frames), confirmed here only as fill progress (rule D14). Step: 2 cost figures (rule D16). Entering without counting (by eye): '78' (clip33@697-706), '3' (clip38@851-860), '1%' (clip36@463-472).
- Evidence: n=7 figures, 5 clips.
- Confidence: low: three kinds, one or two instances each

## Constant and variable

CONSTANT (same wherever it occurs): the 1.2 step clock (4 clips); a traveller on the tip of every drawn path (3 of 3); dash and dot patterns fixed in space; zero vertical travel in badge pops (dy under 0.5 px, n=2 fitted); the camera zoom form (two travels, RMSE 0.0004 each, minimum 0.798 and 0.803); one refresh turn per calendar flip (5 of 5); the pixel-art pop states 0.6 / 1.1 / 1.0 (13 of 13); the node pulse areas (4 of 4); the timer rate 12.00 per second (both timers); connector dot pitch 30.0 px (5 frames).

VARIABLE: traveller easing (expo.inOut, sine.out, sine.inOut or linear: one per unit) and duration 22 to 31 frames; traveller size 21 to 122 px (by what it carries); stroke 9.5 to 10.9 px on connectors, 2 to 3 px on marker drops, 4 to 5 px on waves; dash pitch 15.5 to 30 px; badge start scale 0.50 to 0.585 and time to sharp 7 to 10 frames; tag start scale 0.585 to 0.705 and rise 15 to 30 px; landing position (corner in 5, centre in 1); calendar interval 10 to 12 frames; icon swap interval 27 to 44 frames (speech); loop launch period 16 to 17 frames; whether a grid populates (1) or arrives whole (1); whether a finished picture keeps moving (12 of 51).

## Open questions

- Is the traveller's wobble at clip36@691-694 (+12.7, -1.0, +8.8, 0 px) an authored elastic settle or an artefact of the dropped frames? A second instance or the 36 steps-per-second source would decide. Until then build a single 1.4 percent overshoot or none.
- One-shot traveller easing: three units give three best fits (expo.inOut 25.75 f; sine.out 22.25 f on a perspective map, where foreshortening alone slows the far end; linear or sine.inOut 31 f under a moving camera). Which is the house curve? A traveller on a flat, static path in the full layout would decide; none exists besides clip36.
- Badge pop: is the blur part of the recipe (2 of 3 fitted have 11-14 px, the green check has none) or does the unblurred check belong to a separate 'status' device?
- Does a mosaic's fill follow its own curve (quad in-out against time, RMSE 0.022) or the timer through a lag? One unit cannot separate them.
- Should durations be built as measured (10, 12, 31 frames) or as authored (12, 14.4, 37 steps at 36 per second)? Same question as the first study's open item; the 1.2 ratio is now confirmed on 4 more instances.
- Grid population: the per-column and per-row staggers (0.67 and 0.86 frame) come from a rough tile map; a clean 10 x 8 map on clip33@676-695 would settle them.
- The view travel's pan distance (860 px) against card spacing was not measured; whether the camera centres each card or follows the connector is undecided.

## Needs an eye or an ear

- Play clip36 frames 670-700: does the disc visibly bounce at the summit, or only stop?
- Play clip37 frames 300-316: confirm the pin overshoots and the ring spreads on the ground plane.
- Play clip31 frames 518-650: confirm the view pulls back and returns during each travel and that text stays sharp.
- Look at the badge strips and confirm 'small and dim, grows blurred, sharp last':
- Play clip35 frames 445-585 and confirm the icon changes by morphing its outline.
- Play clip32 frames 310-375: confirm the month label flips upward and the refresh mark turns once per month, and count the list rows removed.
- Play clip38 frames 1060-1150: confirm the stepped pops and the hammer timing read as intended pixel-art motion.
- Decide whether the three moving-media illustrations (clip34@370-437, clip39@47-107, clip39@328-397) are in scope for the style at all: they are footage, not primitives.
- Play clip30 frames 940-1030 and confirm the sine waves are still.
- Nothing was listened to: whether landings, the hammer strikes and the marker drops carry sound effects is for the audio study.
