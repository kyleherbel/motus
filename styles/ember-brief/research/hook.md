# Hook, headings and call to action

Measured the hook dimension on all 11 in-style clips (clip29-clip39; 12,791 frames, 426.6 s) with a calibrated VP9 decode (BT.709 limited to full; a white card reads 255). Every frame of the first 300 frames and of the last 330 frames of every clip was scanned; the opening build (frames 0-26), the title exit (18 frames), the call-to-action build (28-43 frames) and the 8 section headings (31 frames each) were fitted frame by frame for opacity, Gaussian blur, scale, offset and, for the call to action and headings, rotation. Transcript word times (machine, unverified) were used only to relate frames to speech.

Every clip opens the same way. Frame 0 is the empty field (#131311) over the presenter. From frame 2 a full-width illustration (slot 0,0-1080,580, bottom faded into the field) and a 4-line upper-case title (2 light lines, 2 heavy lines, block centred on 540,765, height 344 px) build on a fixed, frame-identical template that is settled on frame 17: the illustration scales 0.924 to 1, each line slides 0.40 x its cap height (light lines down, heavy lines up), each with opacity 0 to 1 and a blur that peaks mid-way. Graphics states change on 3 of every 5 frames. The opening is then static, shows no captions, and leaves 2 frames after the first word of the next clause (median frame 87) in a 6-8 frame blur dissolve; the first caption pops on that same frame.

Every clip ends on a call to action that starts at the first word of the spoken call-to-action clause and holds to the last frame (median 75 frames): the word "Comment" (x 349-735, y 274-339) sharp at T0+10 and a quoted upper-case keyword (cap 118 px, baseline 537) that slides in from 140 px to the right with a 6 degree rotation from T0+7 and is sharp at T0+17, with an optional picture in 4/11. Numbered section headings (digit height 68 px) occur in 3/11 clips, 8 headings, each tied to the first sentence of its section. Not done: nothing was listened to and nothing was watched in playback; fonts were not identified; easing curves were not fitted (per-frame tables are provided); the full title-exit curve could be measured on 4 clips only; title-line roles and the kind of illustration were judged by eye.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [H01] Frame 0 shows the empty dark field over the presenter panel: no illustration, no title, no caption. The presenter is already in the panel and moving. The opening graphics start to arrive on frame 2.

- Values: Field rows 0-500 are RGB 19,19,17 (#131311) on every pixel in 11/11 clips (min = max). Pixels brighter than luma 140 in rows 0-940 at frame 0: 0 in 11/11. Rows 0-940 differ between clips only on the dot texture (mean abs 0.40-0.42 levels against clip29). First graphics change: trace on frame 2 (opacity 0.006-0.015), readable on frame 3, in 11/11.
- Evidence: n=11, clip29@0... clip39@0
- Confidence: high

### [H02] Sound with speech-band energy starts about 0.11 s into the file, at the same moment the title becomes readable (frame 3). Keep the lead-in at 3 frames. Do not wait for a word before starting the title build.

- Values: Onset of the 1-4 kHz or 6-12 kHz band (30 ms above -45 / -50 dBFS): median 110 ms = frame 3.3, range 100-140 ms, n=11. The first 50 ms are near digital silence (-49 to -97 dB in the three bands). A constant low-band element starts at 50 ms at -34 dB in 11/11. The machine transcript puts the first word at 0.00 s in 11/11.
- Evidence: n=11, clip29@0-12... clip39@0-12
- Confidence: medium: measured on envelopes, nothing was listened to; the onset at 0.10-0.14 s may be an entrance sound effect and not the first word
- Verified, confirmed: The bed is first. 0-50 ms: near silence, -52 to -72 dBFS rms (not digital zero). Bed onset: crosses -50 dBFS at 49.7-49.8 ms and -40 dBFS at 50.83-50.90 ms in 11/11, sample-identical across clips. clip35 is not earlier: a -47 dBFS blip at 32 ms precedes the same 50.85 ms onset. Voice: the residual against the cross-clip bed passes -40 dBFS at 108 ms median (71-112), sustained at 110 ms (100-145), n=11. The stream carries an edit list for its 5058 priming samples and the decoder applies it (decoded length matches to the sample), so the 50 ms is in the published timeline, not an undeclared codec delay. Build value: bed in at 0.050 s, voice at 0.11 s.

### [H03] Show no caption while the opening title is on screen. The first caption appears on the first frame of the title exit, at full opacity with no fade. Captions keep their own speech timing under the title; they are only hidden.

- Values: First caption frame minus title exit start frame = 0 in 11/11 (10 by pixel count in rows 925-990, clip30 read by eye on a native crop). First caption frame: median 87, range 47-130 (2.9 s, 1.57-4.33 s). The caption track keeps its speech timing underneath the title: in 3/11 the tail of the hook sentence shows for 1-2 frames before the next group (clip30@87-88, clip36@72, clip37@91-92).
- Evidence: n=11
- Confidence: high

### [H04] The opening scene has exactly two graphic parts in the field above the presenter panel: a full-width illustration on top and a stacked title block under it. No plate behind the text, no logo, no badge, no underline, no accent-coloured word. The presenter panel stays as on frame 0.

- Values: 11/11 clips. Illustration rows 0-580, title block rows 593-937 (medians). Orange pixels inside the settled title block: 0 in 11/11. Title ink is one colour on all lines.
- Evidence: n=11, clip29@30... clip39@30
- Confidence: high

### [H05] Illustration slot: x 0-1080, y 0-580 (1.86:1), picture fitted to cover and centred. No border, corner radius, shadow or added glow. The top and the sides are the hard frame edges. The bottom fades linearly into the field over about the lowest 80 px, and the field dot texture is drawn over the picture.

- Values: Lowest row whose content is more than 3 levels above the field: median 572, range 565-577, n=11. The 98th-percentile luma (dots removed) equals the field level 19 at row 580 in 11/11. The fall is linear at 1.3-1.6 levels per row from row 500-510 down on the two brightest floors (clip38@30, clip30@30). No fade at the top or sides: luma 209 inside the top 8 rows (clip36@30), luma 116 inside the left 8 columns (clip37@30); changed columns run 0-1079 in 10/11. Title top minus 580: median 13 px (10-20).
- Evidence: n=11, clip29@30... clip39@30
- Confidence: medium: the rectangle is firm (n=11); the fade start row and its linear shape are inferred from pictures whose own floor also darkens; dots-over-picture is read by eye on a brightened crop
- Verified, confirmed: Columns 0-1079 in 11/11. Rows from 0 (7/11 clips; in the other 4 the picture is at field level at the top). The 98th-percentile excess over the field is back under 2.5 levels at row 579-580 in 8/11 and at 567-571 in 3/11 with dark floors. Pictures are darker than the field in their black areas (-6 to -10 levels) right up to the top and side edges, with the same level in the first 4 rows or columns as 20-40 px inside: hard edges, no fade. The entrance scales the whole 1080 x 580 rectangle about (539.5, 289.5): fitted shift at scale 0.924 is under 0.07 px, so the centre is within 1 px. Build value: x 0-1080, y 0-580.
- Verified, open: A fade exists and ends at row 580 (see slot). Its start and shape cannot be separated from the picture content: on the two clips with enough bright, vertically flat columns the normalised profile falls roughly linearly and reaches the field at 565-580 (clip38: 0.51 at row 500, 0.23 at 540, 0.04 at 570, 0 at 580; clip32 ends near 569), but the profile already falls between rows 460 and 500, which may be the floor of the picture. Linear, smoothstep and quadratic ramps fit within 0.03-0.06 rms of each other. Build value: linear alpha ramp over rows 500-580 (the claim), start row uncertain by +-20 px.

### [H06] The slot takes one still picture per video: a 3D-rendered scene on a near-black background with a glossy floor, built around one or two cartoon characters that act out the topic with props (screens, cards, charts, devices). The picture must be near-black along its top edge and its lowest 100 px so that it merges with the field.

- Values: A character scene in 11/11 (one recurring orange mascot in 9/11, other characters in 2/11). Maximum luma inside the top 8 rows is 9-32 in 10/11 (209 in clip36). Subject spans about 60-90% of the slot width (by eye).
- Evidence: n=11, by eye on; edge numbers
- Confidence: medium: description by eye; do not reproduce the reference mascot or any third-party logo shown in these pictures

### [H07] Centre the title block on x=540, y=765, between the illustration and the presenter panel. Target block height 344 px. No line wider than 905 px.

- Values: Block centre y: median 765, range 762.5-766, n=11. Block top: median 593 (590-600). Block bottom: median 937 (929-938). Block height: median 344 (330-349). Line centre x: median 541.5 (538.5-548), n=43 lines. Widest line per clip: median 666 px (610-905). Left-most ink x=90, right-most x=994.
- Evidence: n=11 clips, 43 lines, clip29@30... clip39@30
- Confidence: high
- Verified, confirmed: Flat edges at 50 percent ink, y in pixel-edge units: cap top of line 1 592.0-595.4 and last baseline 935.9-937.9 in the 7 four-line titles that fill the height (flat height 341.6-344.9); 599.4-600.8 and 930.0-933.0 in clip29, clip35, clip37 (329-334); clip39 (3 lines, fills the height) 594.0 to 930.0. Centre of that span 765.4 (762.0-766.2). Widest line 904.7 px (clip35) and 903.2 (clip37); widest light line 720.1 (clip30). Ink centre x 542.0 (539.0-548.4, n=43). 4 upper-case lines, 2 light then 2 heavy, in 10/11; clip39 has one heavy line. Error +-0.3 px. Build value: see the layout rule entry: line-box stack 359.4 px high centred on y = 766.1; max ink width 905 px.

### [H08] Set the title in 4 centred upper-case lines (3 when the claim is a single word): the first two lines in the light weight, the last two (or the last one) in the heavy weight, all in the same off-white ink.

- Values: 4 lines in 10/11, 3 lines in 1/11 (clip39). Lines 1-2 light in 11/11: stroke/cap-height 0.136 (0.125-0.143), n=22. Lines 3-4 heavy in 11/11: stroke/cap-height 0.25 (0.241-0.274), n=21. Ink RGB 241-242, 238-239, 232-235 (#F2EEEA), n=43, on a decode where a white card reads 255,255,255 (default decode reads 253).
- Evidence: n=11, clip29@30... clip39@30
- Confidence: high

### [H09] Both light lines share one size and both heavy lines share one size, chosen per title: light cap height about 66 px, heavy about 84 px, light + heavy = 151 px, with 14 px of clear space between lines.

- Values: Light cap height: median 65.5 px (54-80), n=22. Heavy: median 84 px (71-98), n=20; 173 px when there is one heavy line (clip39). Lines of a pair differ by 0-3 px. Light + heavy cap: median 151.2 (144.5-153), n=10. Heavy/light ratio: median 1.29 (0.89-1.78). Ink gap between lines: median 14 px (11-17), n=30; 24 px next to the 173 px line. The same copy appears at three sizes (clip31/clip34/clip37: light 68.5/66.5/59.5, heavy 83.5/85/86.5), so the sizes are set by hand and are not a function of the text. Cap heights include 1-2 px of round-letter overshoot.
- Evidence: n=11 clips, 43 lines, title_geometry
- Confidence: medium: the numbers are firm; which size a new title gets is a per-title choice inside these ranges, no rule was found
- Verified, confirmed: Flat cap height: light 52.96-77.56 px (median 63.0), heavy 68.92-94.18 (median 81.0; 167.8 in the 3-line title); both lines of a pair equal within 0.1 px. Ink height with overshoot: light 54-80, heavy 71-98. Flat light + heavy = 146.9 (146.5-147.1) in 8 titles, 141.5-143.2 in clip29, clip35, clip37. Heavy / light ratio 0.889-1.778 (median 1.31). Build value: flat cap heights (type T19); sizes follow from the layout rule entry.
- Verified, not confirmed (the other claim holds): Pitch light 1.241 x flat cap (residual max 0.8 px, n=11), heavy 1.212 x (0.8 px, n=10); baselines land on whole pixels. Gap from the 2nd light baseline to the heavy cap top 14.8-17.2 px (27.2 in clip39) = 0.086 x light cap + 0.129 x heavy cap (residual max 1.0 px): it scales with the sizes, it is not a constant. Simplest exact description: every line sits in a box 1.2377 x cap (light) or 1.2120 x cap (heavy) high with the caps centred, boxes stacked with no extra space: rms 0.72 px, worst 2.0 px over 86 edges. Build value: line box 1.2377 x cap (light), 1.2120 x cap (heavy), caps centred in the box (line-height 0.87 em and 0.85 em if the cap height is 0.70 em).
- Verified, corrected: Rule: (1) choose ratio r = heavy cap / light cap (default 4/3; a single heavy line uses 2r). (2) capL = 359.4 / (2 x 1.2377 + nH x 1.2120 x r), capH = r x capL, with nH the number of heavy lines: the line-box stack is 359.4 px high (359.1-359.7 in 8 titles). (3) if the widest ink line exceeds 905 px, scale both sizes by 905 / width. (4) stack the boxes, caps centred in each, stack centred on y = 766.1, lines centred on x = 540. Test with the measured ratio of each title: cap heights within 0.17 px and every baseline within 2.0 px in 10 of 11 titles (clip35 and clip37 are the width-limited ones and come out exact); clip29 is 3.7 percent smaller than the rule (3.1 px in cap height, 7.0 px in a baseline). Worst error over all 11: 7.0 px. Test from the strings alone (r = 4/3, plus: if the wider light line exceeds 720 px shrink the light pair and give the height to the heavy pair): 4 of 11 titles within 2 px, median cap error 1.9 px, worst 15.0 px in cap height and 34 px in a baseline (clip32, whose heavy lines are smaller than its light lines). Build value: the rule above with r as a per-title parameter, default 1.333, allowed 0.89-1.78.

### [H10] The opening build is one fixed template. Play it identically in every video: everything is settled on frame 17 (0.57 s) with 4 lines, on frame 15 with 3 lines.

- Values: Per-frame opacity and blur agree across 11 clips to the measurement error (line 3 at frame 12: blur sigma 7.65-7.77 px, opacity 0.998-1.002; illustration at frame 5: sigma 14.7-15.0 px). New graphics states on frames 2, 3, 5, 7, 8, 10, 12, 13, 15, 17 and repeats of the previous state on 4, 6, 9, 14, 16 in 11/11 (frame 11 carries a small residual change in 10/11): 3 new states per 5 frames, 18 per second.
- Evidence: n=11, clip29@0-26... clip39@0-26 (297 frames fitted, 3300 scanned)
- Confidence: high
- Verified, confirmed: Confirmed in 11/11: mean abs frame-to-frame change over the field is 2.7-48 luma levels on 3, 5, 7, 8, 10, 12, 13 (15: 0.8-7.3; 17: 0.7-4.2 in the 10 four-line clips; clip39 ends on 15), 0.6-1.1 on frame 2, and 0.01-0.16 on 4, 6, 9, 14, 16. Frame 11 changes by 0.5-0.7 (16x16 block p99.9 1.6-2.1 against 82-97 on frame 10): a codec refresh, not a state. 3 states per 5 frames = 18 per second. Build value: do not reproduce; render the build at the full frame rate.

### [H11] Start the illustration and title line 1 together on frame 2, then start each following line about 3 frames after the one before. Each part takes about 6 frames from first trace to settled.

- Values: First trace / first readable / settled frame: illustration 2 / 3 / 8; line 1 2 / 3 / 8; line 2 5 / 7 / 12; line 3 7 / 8 / 15; line 4 12 / 12 / 17. Identical in 11/11 (line 4: n=10). In graphics time (states at 18 per second, frame f shows state floor(0.6 f + 0.3)) the parts start at about 0.05, 0.15, 0.25, 0.35 s and each lasts about 0.20 s.
- Evidence: n=11, clip29@2-17... clip39@2-17
- Confidence: high for the frame numbers; medium for the 0.10 s stagger and 0.20 s duration, which are read through 18-per-second sampling
- Verified, confirmed: Identical in 11/11 clips (line 4: n=10). Illustration: opacity 0.011 on f2, 0.149 on f3-4 (scale 0.9237, sigma 3.2), 1.00 on f5-6 (0.9596, sigma 15.0), f7 scale 0.9960 sigma 2.6, f8-9 scale 0.9997 sigma 0.5, exact from f10. Line 1: 0.015 on f2; f3-4 opacity 0.198, -0.413 flat cap, sigma 2.30; f5-6 0.994, -0.21, 13.5; f7 -1 px, 2.2; settled f8. Line 2: 0.028 on f5-6; f7 0.287, -0.40, 3.4; f8-9 0.992, -0.13, 11.5; f10-11 -1 px, 1.5; settled f12. Line 3: f8-9 0.056, +0.42, 2.2; f10-11 0.497, +0.37, 5.2; f12 1.00, +0.085, 7.7; f13-14 +1 px, 1.1; settled f15 (on f7 opacity is 0.002, at the noise floor). Line 4: f12 0.077, +0.42, 2.2; f13-14 0.786, +0.34, 7.7; f15-16 0.999, +0.05, 5.3; settled f17. Spread across clips: opacity <= 0.02, sigma <= 0.5 px, scale <= 0.0015. Error: opacity +-0.01, offset +-0.5 px (+-1 px at sigma > 10), sigma +-0.3 px. Build value: first readable frames 3, 3, 7, 8, 12; settled 8, 8, 12, 15, 17 (3-line title: 15).
- Verified, confirmed: One tween per part, ease expo.inOut. Lines: duration 0.320 s (0.333 s fits within 5 percent of the cost), line 1 starts at 0.007 s, stagger 0.1000 s (0.099-0.101 for every easing tried), so starts 0.00 / 0.10 / 0.20 / 0.30 s. Illustration: starts at -0.004 s (use 0.00), 0.34 s. Because expo.inOut is flat at both ends, visible change runs from start + 0.05 s (opacity 2 percent) to start + 0.27 s (within 1 px): that visible span is what the hook claim describes. Build visually complete at 0.57 s. Absolute phase uncertain by +-0.03 s (one state = 55.6 ms); stagger and duration do not depend on it. n = 516 line states and 88 illustration states from 11 clips. Build value: expo.inOut, 0.33 s per part; starts: illustration 0.00 s, line 1 0.00 s, line 2 0.10 s, line 3 0.20 s, line 4 0.30 s.

### [H12] Each title line arrives whole, not word by word: opacity 0 to 1, an isotropic blur that rises and falls, and a vertical slide of 0.40 x its cap height. Light lines slide down from above, heavy lines slide up from below. No scale change and no overshoot.

- Values: Start offset / cap height: line 1 -0.398 (-0.404..-0.389), line 2 -0.385 (-0.395..-0.375), line 3 +0.404 (0.394-0.414), line 4 +0.406 (0.398-0.417), n=43; in pixels -22..-32 and +29..+70. States, median of 11 clips: line 1 frame 3 opacity 0.20, sigma 2.3 px, offset -0.40 cap; frame 5 opacity 0.99, sigma 13.5 px, -0.20 cap; frame 7 sigma 2.2 px, -1 px; frame 8 settled. Line 3 frame 8 opacity 0.06, sigma 2.2, +0.40 cap; frame 10 0.50, 5.2, +0.36 cap; frame 12 1.00, 7.7, +0.08 cap; frame 13 sigma 1.1, +1 px; frame 15 settled. Scale 1.000 (0.995-1.001). Blur is isotropic: sigma x / sigma y 7.73/7.71, 5.30/5.32, 13.7/14.1 px (n=6 checks). Word-to-word ink difference inside a line: at most 0.099 over 116 line-frames. States past the end position: 0.
- Evidence: n=11 clips, 43 lines
- Confidence: high
- Verified, confirmed: Direction: lines 1-2 start above (dy < 0), lines 3-4 start below (dy > 0) in 43/43 lines, 11 clips. First visible state: 0.413 x flat cap height through the origin (per line 0.413, 0.397, 0.421, 0.418; n=43; rms 0.7 px; a fixed-pixel distance misses by 7.7 px rms) = 0.40 x the ink height with overshoot. Start of the underlying tween: 0.425 x flat cap height (0.30 em if the cap height is 0.70 em). 22-33 px for light lines, 29-70 px for heavy. Error +-0.5 px. Build value: 0.425 x flat cap height (0.30 em); light lines from above, heavy lines from below.

### [H13] The illustration arrives with opacity 0 to 1, scale 0.924 to 1.000 about the slot centre (540, 290) and the same rise-and-fall blur. It does not translate.

- Values: Frames 3-4: opacity 0.147 (0.145-0.149), blur sigma 3.0 px, scale 0.924 (0.923-0.924). Frames 5-6: opacity 1.00, sigma 14.9 px (14.7-15.0), scale 0.959 (0.957-0.960). Frame 7: sigma 2.45 px, scale 0.996. Frame 8: settled. Vertical shift at most 0.8 px. n=11, fit r2 0.88-0.999 from frame 3.
- Evidence: n=11, clip29@2-8... clip39@2-8
- Confidence: high
- Verified, confirmed: Scale 0.9237 (0.9229-0.9243) on f3-4, 0.9596 on f5-6, 0.9960 on f7, 0.9997 on f8-9, 1.0000 from f10; opacity 0.149 / 1.00; sigma 3.2 / 15.0 (14.9-15.1) / 2.6 / 0.5 px; shift |dx|, |dy| <= 0.3 px on every frame. 0.924 is the first visible state: the tween starts at 0.919 (expo.inOut, 0.34 s, blur 15.0 px x 4p(1-p), scale rms 0.0005). Held: against frames 22-31 the last held frames (44 to 127) fit scale 1.0000, shift 0.00 px, mean abs difference 0.05-0.19 levels in 11/11: static, no drift or zoom. Build value: scale 0.92 to 1.00 about the slot centre (540, 290), opacity min(1, p/0.4), blur peak 15 px, no translation, static while held.

### [H14] Tie the blur to the slide: sigma = 52.7 px x r x (1 - r), where r is the share of the slide still to go (peak about 13 px half-way). Let opacity reach 1 by the time half the slide is left, so that the first visible state is faint and almost sharp, not a blurred blob.

- Values: Fit on 160 line states from 11 clips: RMSE 1.13 px, largest error 2.6 px. Opacity against r: 0.06-0.28 at r >= 0.95, 0.50 at r = 0.89, 0.79 at r = 0.81, 0.99 at r = 0.52. Known misfit: at r near 1 the measured sigma is 1.9-3.3 px against 0.3 px predicted. The same engine drives the illustration (sigma 14.9 px at 54% of the scale travel left, 2.45 px at 5%).
- Evidence: n=11 clips, 160 states
- Confidence: medium: a relation derived from the frame table; the easing curve itself was not fitted here and belongs to the motion analyst
- Verified, confirmed: sigma = 52.7 x p x (1 - p) px with p the eased progress: peak 13.18 px (fit over 368 visible line states, rms 0.42 px, worst 1.9 px). Sampled peaks: line 1 13.52 px (13.20-13.68, n=11), line 2 11.50, lines 3-4 7.71 and 7.70: the lower values are the same curve sampled at another phase. The blur is in pixels and does not scale with the cap height (53 to 168 px caps give the same sigma). A time-based bump (sin) fits worse. Build value: sigma = 13.2 px x 4 p (1 - p).
- Verified, corrected: expo.inOut over 0.32 s: slide rms 0.25 px, blur rms 0.42 px, worst slide error 1.4 px. power4.inOut over 0.23 s: 0.30 / 0.62 / 1.4. power3.inOut over 0.19 s: 0.34 / 0.69 / 1.6. Ease-out alternatives are 2.5 times worse: power3.out 0.67 / 1.07 / 3.0-3.6, expo.out similar. No overshoot: no state past rest. The same ease fits the call-to-action keyword decisively (1.3 px rms against 4.3 for power4.inOut and 18 for power3.out). Build value: expo.inOut (GSAP naming), 0.33 s.
- Verified, confirmed: opacity = min(1, p / 0.24) with p the eased slide progress: rms 0.005, worst 0.023 over 516 states. Opacity is 0.5 at 12 percent of the travel and 1.0 from 24 percent on (0.26 with the duration fixed at 0.333 s). Illustration: slower, about min(1, p / 0.4) (0.149 at scale 0.9237, 1.00 at 0.9596). Build value: opacity = min(1, p / 0.25).

### [H15] After the build nothing in the opening moves. Hold the illustration and the title perfectly still until the exit. Only the dot texture of the field keeps moving.

- Values: Frame 20 against the last full frame (26-109 frames later): illustration affine fit scale 1.00000-1.00002, largest corner shift 0.003-0.012 px; title ink differs on 64-191 px of 48,000-87,000 (at most 0.22%), n=11. Hold from settled to last full frame: median 70 frames (32-113). Title scene from frame 0 to exit start: median 87 frames (47-130), 2.9 s (1.57-4.33 s).
- Evidence: n=11, clip29@20-113, clip30@20-86, clip31@20-81, clip32@20-129, clip33@20-67, clip34@20-92, clip35@20-81, clip36@20-71, clip37@20-90, clip38@20-102, clip39@20-46
- Confidence: high

### [H16] End the title when the speaker starts the next clause: start the exit 2 frames after the onset of that clause's first word. The title covers the spoken hook and nothing after it.

- Values: Exit start minus word onset: median +2.2 frames, range -3.0..+7.4, n=11; 8/11 within 3.6 frames. The boundary is the start of the second sentence in 8/11 and a clause boundary inside the first sentence in 3/11 (clip33@68, clip36@72, clip39@47). In the 8 sentence cases the exit starts 4.2-13.6 frames (median 6.5) after the hook sentence ends.
- Evidence: n=11, transcripts (word times +-2 frames, unverified)
- Confidence: medium: depends on machine word times
- Verified, confirmed: First changed frame: clip29@114, clip30@87, clip31@82, clip32@130, clip33@68, clip34@93, clip35@82, clip36@72, clip37@91, clip38@103, clip39@47 (same frames as both analysts). Against the transcript I reproduce both medians (+2.2 over 11, +1.0 over the 8 sentence cases). Against the audible onset of that word (speech resuming after the pause before it): +0.7, -1.8, +0.4, +1.4, +0.9, +1.9, -0.3, -1.3, +2.0 frames in 9 clips, median +0.7, range -1.8..+2.0; clip31 has no pause to measure; clip39 is ambiguous (the exit is 0.4 frames before "over"). Build value: start the exit on the first word of the next clause, 0 to +2 frames.

### [H17] The title and the illustration leave together as one block in 6-8 frames, with no stagger between lines: they blur up in place to about sigma 22 px over 4 frames with opacity held, then fade out while rising about 40 px. The first body graphic builds in the same field during the same frames; when that graphic is full-height the presenter panel blurs out in the same move.

- Values: Reliable title states pooled by frame after exit start (r2 >= 0.9): +1 sigma 1.0-4.7 px (n=5 clips); +2 sigma 4.6-18.5 (n=4); +3 sigma 14.3-19.8, opacity 0.91-1.03 (n=5); +4 sigma 16.3-23.3, opacity 0.73-1.00 (n=4); +5 sigma 20.9-24.2, opacity 0.52-0.90, rise 5-23 px (n=4); +6 opacity 0.50 (n=1). Title ink under 8% at +6, +6, +7 (clip33, clip38, clip30). Next layout: split kept in 7/11 (clip31, 33, 34, 35, 36, 38, 39), full-height field in 4/11 (clip29, 30, 32, 37), where presenter-panel sharpness drops 9-21% during the move.
- Evidence: clip30@87-93, clip33@68-75, clip35@82-87, clip38@103-108 for the full curve; first exit frame only on clip29@114, clip32@130, clip36@72, clip37@91
- Confidence: medium: the full exit curve is measurable on 4 clips; on the others a bright graphic covers the title zone
- Verified, confirmed: Per frame after the start, median (range) over 8-9 clips: +0 opacity 0.99, sigma 6.7 (0.1-11.4); +1 0.99, 9.7 (4.7-18.4); +2 0.97, 16.2 (12.9-20.1), rise 0.7 px; +3 0.86 (0.67-0.98), 20.3, rise 2.7; +4 0.71 (0.40-0.93), 22.4 (20.4-24.8), rise 10 (3-23); +5 0.30 (0.08-0.53), 23.0, rise 30 (11-43); +6 0.12, 20.6, rise 42; +7 0.05, 18.4, rise 45; gone on +8. Title block and illustration carry the same blur on the same frame (median difference 0.6 px, clip33, clip35, clip38, clip39). No stagger between lines (one template for the whole block fits with r2 0.95-0.99). Build value: 8 frames (0.27 s): blur 0 to 22 px over the first 4 frames with opacity held, then opacity to 0 and a rise of 45 px over the last 4 frames.

### [H18] List videos carry a numbered section heading at the top of the field: "<n>. <Name>" on one line, heavy weight, title case, off-white, kept on screen for the whole section. Videos without a spoken list have none.

- Values: 3/11 clips (clip32, clip33, clip38), 8 headings (2, 3, 3), numbered 1..n in order. Frames on screen: median 243 (110-348), 8.1 s. A heading stays through layout changes inside its section (clip32@140-440 spans a full-height and a split layout). 8/11 clips have no heading.
- Evidence: n=3 clips, 8 headings
- Confidence: medium: three clips

### [H19] Heading size and place: digit height 68 px, stroke 18 px, centred on x=540 with the top of the digits at y=77 and the baseline at y=143. An app icon (rounded square, about 90 px) may sit between the number and the name.

- Values: Digit height: median 68.5 px (66-69), n=8. Stroke 17-19 px. Width 504-922 px (median 704). Ink 241-242, 238-239, 234. clip32 and clip33 (5 headings): digit top 76-78, baseline 142-146, centre x 538.5-541.5. clip38 (3 headings): digit top 21-22, baseline 89-90, centre x 500.5-501.5. Icon in 3/3 headings of clip33 only (box rows 63-158 on clip33@800).
- Evidence: clip32@300, clip32@560, clip33@400, clip33@650, clip33@800, clip38@400, clip38@700, clip38@1100
- Confidence: medium for the size (n=8, 3 clips); low for the second position (y=21, x=501), seen in one clip
- Verified, corrected: Two sizes, not one: clip32 flat cap 65.2-65.4 px (cap top 77.6-77.8, baseline 143.0; n=2); clip33 67.9-68.0 px (cap top 77.9-78.1, baseline 145.9-146.0; n=3); clip38 68.0 px (cap top 22.0, baseline 90.0; n=3). The cap top is constant per position and the baseline follows the size. Flat digit "1" 65.25 / 67.96 / 68.05 px; round digits 2 and 3 are 1.1-1.3 px taller. Ink centre x 542.0-542.2 (clip32), 539.2-541.7 (clip33), 501.4-502.4 (clip38). Widths 503-923 px. Error +-0.3 px. Build value: cap height 68 px, cap top y = 78, baseline y = 146, centred on x = 540.

### [H20] Bring the heading in with the first sentence of its section: it is sharp 13 frames after the first word of that sentence. The previous heading starts to leave 4 frames before that word.

- Values: Sharp frame minus sentence onset: median +13.3 frames (11.2-17.0), n=8. First thresholded ink: +11.7 (9.2-13.0). Last full frame of the previous heading minus the next sentence onset: median -3.8 (-5.8..-1.0), n=5. No readable heading for 10-14 frames between sections, n=5. The sentence opens with a spoken ordinal in 7/8.
- Evidence: n=8 headings, transcripts
- Confidence: medium: three clips, machine word times

### [H21] Heading in: scale 0.94 to 1, slide down 40 px, opacity 0 to 1, blur peaking at sigma 22.6 px, 9 frames from first visible to sharp. Heading out: blur to about sigma 18 px in 3 frames with opacity held, then fade while rising 40 px, gone on frame 6.

- Values: In (n=5 clean fits of 8, r2 >= 0.9): start scale 0.940 (0.940-0.940), start offset -40.9 px (-41.4..-39.9), peak sigma 22.6 px (22.0-22.9), 9 frames (9-11). Out (n=6): +1 sigma 1.5-8.5; +2 sigma 8.5-16.7; +3 sigma 15.9-18.3, opacity 0.87-0.96, rise 1-5 px; +4 opacity 0.32-0.51, rise 19-28 px (n=2); +5 opacity 0.08, rise 40 px (n=1); no ink left at +6.
- Evidence: clip32@446-455, clip33@757-767, clip38@312-321, clip38@674-685, clip38@985-994 (in); clip32@441-445, clip33@749-752, clip38@668-669, clip38@978-983 (out)
- Confidence: medium: 5 entrances and 6 exits in 3 clips
- Verified, confirmed: Start scale 0.940 (0.9399-0.9418; 0.960 on one icon heading with a poor first state), start offset -40.5 px (-38.7..-41.4: enters from above and slides down), blur peak sigma 22.8 px (22.1-23.8; 25.9 and 26.6 on the two icon headings, where the fit is disturbed), first visible to sharp 10 frames (9-11), n=8. Per frame on clip32@130-140: opacity 0.12, 0.43, 0.75, 0.93 then 1; offset -41, -41, -41, -38, -32, -12, -4, 0; sigma 3, 8, 13, 21, 23, 24, 22, 15, 10, 3.5, 0. 4 of 8 entrances change on every frame (clip32 both, clip33 third, clip38 third); the other 4 step. Exit of the previous heading (n=4): sigma 8-15 at +1, 16-18 at +2 with opacity 0.87-0.96, opacity 0.17-0.65 and a rise of 13-32 px at +3, gone by +6. Build value: scale 0.94 to 1, 40 px slide down, blur peak 22.8 px, 10 frames (0.33 s) first visible to sharp.
- Verified, confirmed: Against the transcript: sharp minus first word 13.3 frames (11.2-17.0), first visible minus first word +3.3 (1.2-6.0), n=8. Against the audible onset of that word: first visible +1.5 frames (-0.8..+5.0), sharp +11.3 (9.2-16.0). Build value: heading first visible 3 frames after the transcript start of the section first word (1-2 frames after it is heard); sharp 10 frames later.

### [H22] Start the call to action on the first content word of the spoken call-to-action clause ("if..." or "comment...", skipping a leading "So") and keep it on screen to the last frame. Do not wait for the keyword to be spoken.

- Values: First changed frame T0 minus that word's onset: median +0.4 frames, range -5.6..+8.0, 7/11 within 2.2 frames, n=11. T0 minus the onset of the spoken word "comment": -64..+6 frames (median -5.6). The keyword is spoken 5-73 frames after T0. Length T0 to the end of the file: median 75 frames (51-128), 2.5 s (1.7-4.3 s), 3.9-10.3% of the runtime (median 7.1%).
- Evidence: n=11, T0 = clip29@1102, clip30@1725, clip31@785, clip32@962, clip33@978, clip34@1153, clip35@1145, clip36@1125, clip37@865, clip38@1273, clip39@770
- Confidence: medium: depends on machine word times
- Verified, confirmed: T0: clip29@1102, clip30@1725, clip31@785, clip32@962, clip33@978, clip34@1153, clip35@1145, clip36@1125, clip37@865, clip38@1273, clip39@770 (same as both analysts). Both claims reproduce from the transcript; they use two anchors. Against the AUDIBLE onset of the first content word: +2.3, +3.7, +1.7, 0.0, -0.5, -2.6, +2.1, +2.6, +1.7, -0.5, +1.5 frames, median +1.7, range -2.6..+3.7 (n=11). Against the audible start of the sentence including "So": about 10.2, 9, 5.6, 0, -0.5, 2.6, 2.1, 8.1, 11.8, 6.2, 1.5, median +5.6, range -0.5..+11.8: twice the spread. Build value: first changed frame = onset of the first content word of the call-to-action clause (after a leading "So"), +0 to +2 frames.

### [H23] Call-to-action text, centred on x=542: line 1 is the word "Comment" in the light weight, box x 349-735, y 274-339 (cap height 66 px). Line 2 is the keyword in the heavy weight inside curly double quotes, cap top y=418, baseline y=537 (cap height 118 px), 78 px under the baseline of line 1.

- Values: "Comment" box 387-388 x 66 px in 11/11 and at x 348-349, y 274 in 9/11. Keyword quote top 416 and baseline 537 (535 without round letters) in 8 of those 9; keyword width 440-804 px; cap height 116-119 px. Stroke 10 px (line 1) and 30-31 px (line 2; 40 px measured on one 3-letter word). Quote marks span y 416-475. Ink 241-242, 238-239, 232-234.
- Evidence: n=11, last frames clip29@1199, clip30@1852, clip31@853, clip32@1035, clip33@1067, clip34@1227, clip35@1261, clip36@1184, clip37@922, clip38@1323, clip39@857
- Confidence: high
- Verified, confirmed: Identical in 11/11: ink x 348.6-735.7 (width 387.0-387.1, centre 542.2), ink rows 274-339, C height 65.8 px (round letter, 274.2 to 340.0), stem baseline at y = 339.0 in pixel-edge units (last full ink row 338). Position: that box in 9/11; +198 px in clip29 (picture above), -140 px in clip35 (picture below). Light weight, sentence case. Error +-0.2 px. Build value: ink x 348.6-735.7, C top 274.2, baseline 339.0 (C height 65.8 px).
- Verified, not confirmed (the other claim holds): Flat cap height 116.2 px (116.15-116.27) in 10/11; cap top 419.8, baseline 536.0, cap top 80.6-80.8 px under the line 1 baseline. Quote marks span 415.0-476.6. Ink rows 415-537. Width 439.9-803.7 px at full size, ink centre x 542.8-542.9. clip34 (9 letters): cap height 93.8 (0.807 x), ink 923.2 px wide (x 80.8-1004.0), cap top 411.2, baseline 505.0. Error +-0.2 px. Build value: cap height 116.2 px, cap top y = 419.8, baseline y = 536.0 (pixel-edge units).

### [H24] If the quoted keyword would be wider than 923 px, scale that line down until it is 923 px wide and keep it centred.

- Values: clip34@1227: 9 letters, cap height 94 px (0.80 x), box x 81-1003, y 409-506, 70 px under line 1. The other 10 keywords (3-6 letters) are 440-804 px wide at full size.
- Evidence: n=1, clip34@1227
- Confidence: low: seen once
- Verified, confirmed: 923.2 px ink width on the one shrunk keyword (clip34). One heading is 923.35 px wide as well (clip38, second heading). Build value: 923 px.

### [H25] The call to action takes an optional picture. None: text only (7/11). Small picture under the text: text stays in place (2/11). Large picture under the text: text moves up 140 px (1/11). Picture above the text: text moves down 198 px (1/11). A picture above enters before the text; a picture below enters after the keyword has started.

- Values: Below, small: clip31 x 435-740, y 605-877 (icon with a badge), sharp at T0+20; clip32 x 345-735, y 672-791 (label chip), first fitted T0+13 from scale 0.941 and 39.7 px low, sharp T0+21. Below, large: clip35 x 151-936, y 554-859 (figure 130 x 184 px plus 2 x 4 tiles of 144 px on a 158 px pitch), text at y 134-397, figure from T0+15, tiles one after another, all sharp T0+32. Above: clip29 x 262-851, y 22-422 (object picture with a badge), text at y 472-733, picture from T0+1 at scale 0.96 and 51 px low, sharp T0+8.
- Evidence: n=4 clips with a picture (7/11 without), clip29@1102-1199, clip31@785-853, clip32@962-1035, clip35@1145-1261
- Confidence: low: four clips, each variant seen once or twice

### [H26] From T0 the call to action runs on fixed frame offsets, not on later words: "Comment" enters first from scale 0.94 and 60 px low and is sharp at T0+10; the keyword starts at T0+7 from 140 px to the right, rotated 6 degrees clockwise, with no scale change, and is sharp at T0+17; the outgoing graphic blurs out between T0+2 and T0+7.

- Values: "Comment" sharp at T0+10 in 10/11 and T0+11 in 1/11; first state scale 0.940 (0.929-0.951), offset +60.4 px (56.2-61.9), n=7. Keyword first fitted at T0+7 (6-8); start offset 139.5 px (138.2-140.0), rotation 5.99 degrees (5.95-6.07), scale 1.001 (1.000-1.004), vertical offset 0.3-0.7 px; blur peak sigma 23.3 px (22.8-23.9); sharp at T0+15..T0+18 (median 17), 10 frames (8-10) from first fitted to sharp; n=10. Rotation and offset shrink together (23.3 px per degree). clip38: the keyword starts with "Comment" at T0 and both are sharp at T0+10.
- Evidence: n=11, clip29@1102-1120, clip30@1725-1740, clip31@785-802, clip32@962-977, clip33@978-993, clip34@1153-1170, clip35@1145-1162, clip36@1125-1140, clip37@865-882, clip38@1273-1283, clip39@770-787
- Confidence: high for the keyword and the sharp frames (n=10-11); medium for the "Comment" start state, fitted on a difference image with r2 <= 0.23
- Verified, confirmed: Hook is right in 11/11. First full state: offset x +138.5 px (137.7-139.5; clip38 143.2), offset y 0.0 (max |dy| 0.35 px), rotation +5.99 degrees clockwise (5.95-6.04; clip38 6.40), scale 1.000 (0.999-1.002), blur peak sigma 23.3 px (22.9-23.5; clip38 24.3). Offset and rotation shrink together (rotation/6 = 1.008 x offset/139, rms 0.023). First visible T0+7 (6-8) in 10 clips, sharp T0+15..18 (median 17), 8-10 frames; clip38: starts with line 1 at T0, sharp T0+10. Model-free check: strip-centroid tilt 5.26 degrees (4.0-5.9) and ink centroid +131 px where the fit says more than 4 degrees (n=26 frames); r = 0.999 with the fit over 203 frames. Error: offset +-1 px, rotation +-0.05 degrees. Build value: x +139 px to 0 and rotation +6 degrees clockwise to 0 together, about the line centre; no scale, no vertical offset; blur peak 23.5 px.
- Verified, confirmed: First state: scale 0.939 (0.930-0.940), 60.0 px low (59.4-61.8), opacity 0.10-0.54 depending on phase, n=8 clips with a clean first state; blur peak sigma 22.4 px (21.3-23.4); sharp at T0+10 in 10/11, T0+11 in clip29. Build value: scale 0.94 to 1, rise 60 px, blur peak 22 px.
- Verified, confirmed: Both lines: one tween, expo.inOut, 0.34 s (keyword 0.336 s, position rms 1.3 px; line 1 0.339 s, 1.4 px); blur = peak x sin(pi x u) in linear time (23.7 px keyword, 22.1 px line 1; rms 0.45 and 1.1 px), not 4p(1-p). The line 1 tween starts 0.02 s before the first changed frame T0. Keyword start minus line 1 start: 0.208 s (3.61-3.80 states in 8 clips); clip38: 0.00 s. Whole block sharp 0.55 s after T0. Build value: line 1: start T0, 0.34 s; keyword: start T0 + 0.21 s, 0.34 s; ease expo.inOut; blur = peak x sin(pi x u).

### [H27] End the file on the held call to action: no fade-out, no end card, no logo. Cut 3-17 frames after the last word. The call to action does not move once built.

- Values: The field (rows 0-940) stays within 1.2 luma levels (mean abs) of the last frame for the final 40-108 frames (median 57) in 11/11. The last caption is still on screen in 10/11 (clip39: speech ended 17 frames earlier). Frames between the end of speech and the end of the file: median 4.6 (2.5-17.4), n=11.
- Evidence: n=11, last frames as in H23
- Confidence: high
- Verified, not confirmed (the other claim holds): Held: the field stays within 1.1 luma levels (mean abs) of the last frame for the final 41-113 frames in 11/11; no fade, no end card. End of the last speech energy (6 dB over the bed) to the end of the video: median 2.7 frames, range 0.2-5.7 (n=11); to the end of the audio: median 118 ms, 22-240 ms. The audio stream is up to 52 ms longer than the video. Build value: end the file 3 frames (0.10 s) after the last word, allowed 0 to 6.

### [H28] Title copy: one declarative statement of 5-8 words, compressed from the first spoken sentence, 1 or 2 words per line. The light lines name the subject (a product, a person or a thing) and start the statement; the heavy lines carry the claim or payoff, 1-4 words. Present or past simple, third person. Upper case, no end punctuation.

- Values: Total words: median 7 (5-8), n=11; spoken hook sentence: median 14 words (8-16). Words per line: 2 in 33 lines, 1 in 10 lines, never 3 (n=43). Characters per line: light median 10 (6-17), heavy median 8 (2-14). Words on heavy lines: median 3 (1-4). Verb form: present 7/11 (3 third-person singular, 3 contracted "is" + -ing, 1 plural), modal "can" 1/11, past simple 3/11. Second-person "your" in 3/11; first person 0/11; questions 0/11; digits 0/11. Punctuation: apostrophes only. 9 distinct titles in 11 clips: one series title is reused 3 times.
- Evidence: n=11, counts read by eye on
- Confidence: medium: counts are exact, line roles were judged by eye

### [H29] Call-to-action copy: line 1 is always the word "Comment"; line 2 is one upper-case word of 3-9 letters in curly double quotes, the word the speaker says after "comment". Heading copy: number, full stop, then a name of 1-4 words in title case.

- Values: Line 1 identical in 11/11. Keyword letters: median 6 (3-9), one word in 11/11; it directly follows the word "comment" in 7/11 transcripts; in the other 4 the recogniser garbled the keyword or the word "comment" (clip29, clip30, clip32, clip35), and the captions on screen show the keyword after "comment" (by eye: clip29@1148-1181, clip35@1204-1225). Spoken clause: optional "So", "So" in 7/11, "if you (want X)" in 7/11, "comment <keyword>", "down below" in 7/11, then "I'll / I will send...". Heading names: median 2 words (1-4), n=8; 7/8 are product or tool names, 1/8 is an imperative phrase.
- Evidence: n=11 and n=8, by eye on and, transcripts
- Confidence: high for the call to action; medium for headings (3 clips)

### [H30] Never observed in the opening, the headings or the call to action: word-by-word or letter-by-letter reveal, typewriter, overshoot or bounce, scale change on a title line, an accent colour or underline in a title, any movement while held, a zoom or pan on the illustration, a fade to black, an end card.

- Values: Opening: 0 fitted states past the end position or above scale 1.003 (n=11); lines arrive whole (116 line-frames); 0 orange pixels in 11 title blocks; hold drift at most 0.012 px (n=11). Call to action: keyword scale 1.000-1.004 throughout (n=10); last 40-108 frames static (n=11). Rotation occurs in one place only: the call-to-action keyword (6 degrees). Rotation and sideways motion were not fitted on title lines; their fits reach r2 0.947-0.999 without them once opacity is above 0.5 (n=369 states).
- Evidence: n=11
- Confidence: high

## Constant and variable

CONSTANT (identical in all 11 clips to the frame or within 1-2 px): frame 0 content and field colour #131311; opening build frames (new states on 2,3,5,7,8,10,12,13,15,17; illustration settled 8; lines settled 8/12/15/17) and its per-frame opacity and blur; illustration slot 0,0-1080,580 and its start scale 0.924; title structure (2 light lines then heavy lines, upper case, ink #F2EEEA, centre 540,765), slide of 0.40 x cap height, light lines from above and heavy lines from below; no captions under the title; first caption on the exit start frame; static hold; call-to-action line 1 ("Comment", 387 x 66 px), keyword cap height 118 px and its 78 px gap, keyword entrance (140 px, 6 degrees, 10 frames), "Comment" sharp at T0+10; the file ends on the held call to action.

VARIABLE: title sizes (light cap 54-80 px, heavy 71-98 px, chosen per title; 173 px for a single heavy line) and line count (4 in 10/11, 3 in 1/11); title scene length 47-130 frames, set by where the next spoken clause starts; exit start -3..+7 frames around that word; what replaces the title (split layout 7/11, full-height 4/11); section headings (3/11 clips; two positions: y=77/x=540 in 2 clips, y=21/x=501 in 1 clip; optional icon in 1 clip); call-to-action length 51-128 frames; call-to-action picture (none 7/11, below 3/11, above 1/11) and the text shift that goes with it (0, -140, +198 px); keyword width 440-923 px with a shrink at 923 px (1/11); keyword delay (7 frames in 10/11, 0 in clip38). OVER TIME: the 11 clips span 6 days (2026-11-02 to 2026-11-07) and the opening template does not change. Two things differ only in clip38 (2026-11-06): heading position and the keyword starting with "Comment"; clip39 (2026-11-07) has no headings and uses the 7-frame keyword delay again, so no dated change can be claimed.

## Open questions

- Is the sound that starts at 0.10-0.14 s the first word or an entrance sound effect under which the word starts later? Listening to the first half second of two clips, or the audio analyst's voice-band result, decides it.
- Native rate of the graphics layer: the opening and call-to-action builds advance on 3 of every 5 frames (18 states per second), yet clip32@130-140 (a layout change) changes on every frame. Should the pack reproduce the stepping or render the same curves at a smooth 30 fps? The motion analyst's cadence result plus a decision by the user.
- Title sizing: three clips with identical copy use three sizes, so no deterministic rule was found. A sizing rule has to be chosen (suggested in build_spec, not measured).
- Illustration bottom fade: start row (about 500) and linear shape are inferred from artwork that darkens by itself. One reference picture with a flat bright lower edge would decide; none exists in the 11 clips.
- Heading position: digits at y=77 centred on x=540 (clip32, clip33) against y=21 centred on x=501 (clip38). Content-driven or a later change? More list videos after 2026-11-06 would decide.
- Keyword delay in the call to action: 7 frames after "Comment" in 10 clips, 0 in clip38. One-off or option?
- Do light lines come from above because they are light or because they are the top half of the block? All light lines are lines 1-2, so the two cannot be separated.
- The start state of the call-to-action word "Comment" (scale 0.94, 60 px low) comes from fits on a frame difference with r2 0.04-0.23; the numbers agree across 7 clips but the first 5 frames are hidden behind the outgoing graphic.
- Fonts and exact font sizes are not identified here; cap heights and stroke widths are given for the type analyst's fonts to be matched against.

## Needs an eye or an ear

- Watch the first second of clip29 and clip33 at full speed, then open: does the 18-per-second stepping of the build read as intended or as stutter?
- Listen to the first 0.5 s of clip29 and clip32: is there an entrance sound at 0.10 s, and when does the first word start? ( shows the envelopes only.)
- Open and: confirm that the title blurs in place first and only then rises and fades.
- Open and: confirm the keyword comes from the right, tilted clockwise, and that "Comment" rises from below.
- Open: the tail word of the hook flashes for 2 frames before the next caption group. Keep or suppress in the pack?
- Compare with: two heading positions; pick one for the pack.
- Open: check that the dot texture sits on top of the picture and that the fade looks linear.
- Read the title line roles in against: subject on light lines, claim on heavy lines was judged by eye.
