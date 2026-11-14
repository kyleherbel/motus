# Colour

The build does not ship the measured colours. It ships the release palette in [C26] at the end of the rules: same roles, alphas, strengths and luma steps, different hues. Everything below C26 is the measurement.

Measured on all 11 in-style clips (clip29 to clip39, 12,791 frames, 426.6 s; all VP9, yuv420p, BT.709, limited range, 0.61-0.90 Mbps). Every value comes from raw YUV planes with an explicit BT.709 limited-to-full matrix; a white card reads exactly #FFFFFF on that path and #FDFDFD on ffmpeg's default PNG path (2 levels low). Three passes: every frame (lattice maps, footage histograms), 5 fps (interior-pixel colour histograms), and targeted scans (tints, flat fills, text interiors, boundary rows). At this bitrate flat fills carry 0-0.5 levels of noise, glyph interiors 0.3-2.2, and 2 px strokes are luma-only.

The style layer uses four colours on one field: accent #FF6B1B (one orange in captions, toggles, chips and tints, 11/11 clips), cream #F2EEE8 for all display text, a brighter caption white #FAF8F6, and the field #131311. The field is flat (no gradient, vignette or grain) and carries a static 12 px dot lattice of #434341 dots. Dots exist only below a silhouette made of three travelling sine waves on a 300-frame loop that starts at phase 0 in every clip; the dot radius is 2.36 px on the rim row, drops to 0.98 px and grows back to 2.36 px over 384 px of depth. A render from this recipe reproduces real frames (dot on/off agreement 99.8-100 %). The presenter footage fades in by a linear alpha ramp from row 960 to row 1040. Captions sit on a pill of #11110F at alpha 0.68.

Cards are warm dark greys (#211F1B, #1B1A15, #292723) with one black drop shadow (alpha 0.52, sigma 36 px, 22 px down). Highlight bars on light captures are the accent at 0.32-0.55 opacity (median 0.39, n=7 clips) placed under the ink. Nothing glows except the opening illustration. The footage is low-key (median luma 37 of 255, black at 10.5), almost desaturated (chroma RMS 5 codes) and neutrally balanced. Palette and field do not change between clips or over the six days.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [C01] Read every colour through raw yuv420p planes and an explicit BT.709 limited-to-full matrix; never through ffmpeg's default PNG path.

- Values: White card interior: Y=235 U=128 V=128 -> #FFFFFF, sd 0.0 (n=31,900 px and 33,600 px). Default PNG path: #FDFDFD, offset -2.0 on R,G,B at white; -1.6/-1.8/-1.5 on the field (#11110F instead of #131311); -2.3/-1.8/-2.2 on a highlight bar. ffmpeg with explicit in_color_matrix=bt709:in_range=tv:out_range=pc and accurate_rnd agrees with the study path within 0.5 level. A BT.601 matrix would shift the orange by -7.3/-5.3/+2.7. No pure-black patch exists: the darkest flat fill is code 23-24 (#080806 to #090909) and footage p0.1 is code 25, so the black end rests on the matrix alone. 8-bit YUV quantisation leaves +-1 level on R and B of every hex (candidate sets listed).
- Evidence: n=6 patches, clip29@240; all 11 clips ffprobe: vp9, yuv420p, bt709, tv range.
- Confidence: high

### [C02] Use one accent orange everywhere: caption emphasis words, toggle tracks, chips, fills and highlight tints all start from the same colour.

- Values: #FF6B1B (YUV 130,78,196; RGB 254.7,107.2,27.1; hex candidates #FE6B1A #FE6B1B #FF6B1A #FF6B1B #FF6B1C). Per-clip pooled mean code Y 129.60-129.95, U 77.99-78.20, V 195.80-195.98 (n=11 clips, 105k-634k interior chroma px each), sd 0.5-1.4 codes. Caption accent words: Y mode 130 in 22 of 22 clip-by-layout cells, U mode 78-79, V mode 196 (glyph-interior sd 1.6-1.9 levels). Toggle ON track 130,78,196 (sd <=0.34, 2 patches). Flat accent fills found in 8 clips. The CTA graphic zone holds no accent vector element in 9 of 11 clips; where it holds an orange it is an imported icon of another orange (#ED7918 clip29, #DA6E1C clip31).
- Evidence: n=11 clips. clip29@1085 (toggle), clip30@1500 (chip), captions every 10th frame of all clips.
- Confidence: high
- Verified, confirmed: Y 129.99 (sd 2.1), U 78.30 (sd 2.4), V 195.82 (sd 2.7) = RGB 254.3, 107.2, 27.8; modes 130, 78, 196 = 254.6, 107.2, 27.1; per clip Y 129.96-130.03. n=3.0 M luma and 0.41 M chroma samples. Error +-1 level on R and B. Build value: #FF6B1B.

### [C03] Set every display text of the style layer (both title weights, section headings, big figures, CTA lines, card body text, toggle knob) in one warm cream, never in pure white.

- Values: #F2EEE8 (YUV 221,125,130; RGB 242.3,238.3,232.4; candidates R 241-243, G 238-239, B 231-233). Title bold lines: Y mode 221 in 11/11 clips, mode share 0.91-0.96 in 10 clips (0.31 in clip39, a bright graphic sits in the box), sd 0.25-0.46 levels, n=16k-125k px per clip. CTA lines (last 45 frames): Y mode 221 in 11/11, share 0.94-0.996. Thin title lines: Y mode 221, chroma washed to 126,129 by 4:2:0. Section headings clip32@400, clip33@500: Y 221 (share 0.91, 0.67). Body text on a dark card clip29@780: Y 221. Pure white (235,128,128) appears only inside captured pages.
- Evidence: n=11 clips, frames 60-90 (titles) and the last 45 frames (CTA)., text_on_cards_and_headings
- Confidence: high

### [C04] Captions use their own white, 8 luma codes brighter than the cream, plus the accent for emphasis words.

- Values: Caption white #FAF8F6 (YUV 229,127,129; RGB 250.4,248.3,245.9; candidates R 249-251, G 247-248, B 245-247). Y mode 229 in 11/11 clips in full-frame layout (n=12k-112k interior px per clip, sd 1.8-2.2, one clip 4.5) and in 9/11 in the split layout (clip38 and clip39 read a white capture behind the band). Histogram is symmetric about 229 (clip34: 228:9902, 229:15420, 230:9268), so it is not a softened cream (221) or a softened white (235). Caption accent word: #FF6B1B (rule C02).
- Evidence: n=11 clips, every 10th frame, glyph interiors >=3 px from the edge.
- Confidence: high
- Verified, confirmed: Y 228.95 (sd 2.2), U 126.66 (sd 0.8), V 128.73 (sd 0.8) = RGB 249.3, 247.9, 245.1; per clip Y 228.92-228.99; same in both layouts. n=4.0 M luma and 0.63 M chroma samples at 3 px or more inside the glyphs. Error +-0.5 level. Build value: #F9F8F5.

### [C05] Fill the field with one flat near-black: no gradient, no vignette, no grain.

- Values: #131311 (YUV 32,127,128; RGB 18.6,18.8,16.5; candidates #121310 to #141312). Mode code 32 in 11/11 clips (3.5M-8.2M cell samples per clip). Pooled over all frames, 13,403 of 14,151 lattice cells have mode exactly 32; the rest are the caption pill (31) and footage. Mean by 240-px row band 31.76-31.98, by 132-px column band 31.57-31.88; corners 31.85 and 31.88 against top centre 31.86. A 211,200-px patch has sd 0.00 on Y, U and V, so no grain survives the encode.
- Evidence: n=11 clips, 12,791 frames. clip29@240 patch x100-980 y40-280.
- Confidence: high
- Verified, confirmed: base raw Y 32.0 (U 127, V 128) = RGB 18.6, 18.8, 16.5. Pitch 11.999 px in x (90 columns) and 11.993 px in y (29 rows), first node centres at x=0.04 and y=0.12 modulo 12 (2,609 dot centroids, residual sd 0.10 and 0.17 px). Full dot area 17.9 px2, radius 2.37 to 2.39 px; core level raw Y 72.9 = RGB 67, 67, 65. Build value: #131311 base, 12 px lattice from the frame origin, dot radius 2.36 px, dot colour #434341.

### [C06] Lay a static square dot lattice over the field: 12 px pitch, nodes on multiples of 12 px from the frame origin, round dots of one grey.

- Values: Pitch 11.9985 px (x) and 12.003 px (y) by FFT; node centres at x,y = 12k (the dot straddles pixels 12k-1 and 12k). Full dot: area 17.5 px^2 (p10-p90 16.6-18.1) = radius 2.36 px. Dot level code 73-74 against base 32 (+41.5 codes): #434341, the same as cream at alpha 0.22 or white at 0.21 over the field. The lattice never moves; only which nodes carry a dot and how large the dot is changes (C07, C08). A render from the recipe matches real frames: dot on/off agreement 99.8-100 % at 636 margin nodes per frame, luma RMSE 3.4-3.9 levels on 138,240 margin px (n=4 frames, 3 clips; a fifth frame, clip39@500, reads 8.3 because a graphic reaches the margin).
- Evidence: clip29@240 x0-1080 y1150-1400 (pitch), 941k margin dots in 10 clips (size).
- Confidence: high
- Verified, confirmed: base raw Y 32.0 (U 127, V 128) = RGB 18.6, 18.8, 16.5. Pitch 11.999 px in x (90 columns) and 11.993 px in y (29 rows), first node centres at x=0.04 and y=0.12 modulo 12 (2,609 dot centroids, residual sd 0.10 and 0.17 px). Full dot area 17.9 px2, radius 2.37 to 2.39 px; core level raw Y 72.9 = RGB 67, 67, 65. Build value: #131311 base, 12 px lattice from the frame origin, dot radius 2.36 px, dot colour #434341.

### [C07] Dots exist only below a moving silhouette that is the sum of three travelling sine waves; a lattice node carries a dot when it lies on or below the curve.

- Values: y(x,t) = 538.6 + 96 sin(3.006u + w) + 34.5 sin(21.99u + 3w) + 23.0 sin(-35.01u + 4w + 1.123), u = x/1080, w = 2 pi t/300, t in frames, y in px downward. In fractions of the 1920 height: 0.2805 + 0.05, 0.018 and 0.012. Wavelengths 2260, 309 and 194 px; 1, 3 and 4 temporal cycles per 300 frames; the third wave travels the other way. Each component leaves <=0.1 % of its power unexplained; curve range y 385-692 by the formula. Reconstruction RMSE 4.3 px against heights quantised to 12 px (quantisation alone gives 3.5). Vertical offset fitted on 73,526 nodes: best 538.6 to 539.6 (lit/unlit accuracy 98.2 %), per-clip best shift 0.5-1.0 px (n=10 clips).
- Evidence: 300 loop phases x 89 columns, pooled by mode from 11,018 frames of 11 clips (clip30 only frames 0-79); 95.7 % of cells have >=3 agreeing observations.
- Confidence: high
- Verified, confirmed: confirmed, with the constant 1 px high. On 22 frames (5 each in clip29, clip32, clip33, clip35 and 2 in clip38; 381 lattice columns) the first lit row is the predicted row in 381 of 381 columns once the right clock is used (97.4 % with t = frame number in SPLIT). RMSE against the middle of the lit row 2.6 px, which is at the 12 px quantisation floor (3.5 for a perfect formula). Finer test on 36,255 margin dots near the boundary: a node is lit with 50 % probability at 1.05 px above the formula curve, with a spread of only 0.38 px. So the curve is right to about 0.4 px rms after shifting it up by 1.05 px. Lit or not lit within 30 px of the curve is predicted right for 99.5 % of 66,295 node readings in SPLIT with y0 = 537.6, 98.5 % with 538.6 and 97.0 % with 539.6 (FULL, 6,120 readings: 99.2, 98.1, 96.6 %). Build value: y0 = 537.6 px (0.28 x 1920) instead of 538.6; amplitudes, frequencies and phases as claimed.

### [C08] Size each dot by its depth below the silhouette: a rim row of full dots on the curve, then small dots that grow back to full size about 384 px down. Dot colour stays constant; only the radius changes.

- Values: Depth d = node y - curve y. d 0-12 px: radius 2.36 (the rim, one lattice row). d 16-28: 0.98. Then 1.03 at 38, 1.17 at 66, 1.19 at 84, 1.29 at 108, 1.40 at 132, 1.45 at 156, 1.57 at 180, 1.66 at 204, 1.69 at 228, 1.88 at 252, 1.92 at 276, 1.96 at 300, 2.12 at 324, 2.18 at 348, 2.23 at 372, 2.36 from 384 px on (constant to the bottom of the frame, 17.5-17.6 px^2 down to d=1500). A straight line from 0.98 at d=16 to 2.36 at d=384 stays within 0.1 px of the table. Rim rule accuracy 98.7 %. p10-p90 spread of area per bin about +-12 %.
- Evidence: n=941,466 margin dots (x=12, 24, 1056, 1068) from every 3rd frame of 11 clips (clip30: 27 frames), unshadowed cells only.
- Confidence: high
- Verified, confirmed: linear growth confirmed: radius 0.96 px at depth 17 to 25, 1.19 at 85, 1.45 at 157, 1.70 at 229, 1.98 at 301, 2.25 at 373, then 2.37 from 379 on (slope 0.0038 px per px; 239,794 dots). The line carries small steps of about 0.1 px at depths 109, 174, 240, 311 and 373. The rim is a band of 15.3 px of vertical depth, not one lattice row: classifying the 2nd and 3rd lit node as full-size by depth < 15.3 px is right in 98.2 % of 14,502 nodes, by depth < 12 px in 87.6 %, by having an unlit neighbour in 88.9 %. Build value: full dots for depth 0 to 15.4 px (0.008 x 1920) below the curve, then radius 0.96 px rising linearly to 2.36 px at 384 px.

### [C09] Run the field on a 300-frame loop that starts at phase 0 on frame 0 of the video and never resets at cuts or layout changes.

- Values: Period 300 frames = 10.0 s: the silhouette series at x=12 repeats best at lags 300 and 600 in all 11 clips (agreement 0.94-0.99 where the margin is free). Frames 0-79 match the fitted curve in 11/11 clips (100 %). Share of all frames whose margin silhouette matches the curve at clock t mod 300: 1.00 in clips 29, 32, 34, 35, 39; 0.99 clip33; 0.64-0.87 in clips 31, 36, 37, 38 where full-bleed graphics cover both margins. One exception: clip30@100-600 runs the field at 0.84x (it loses 80.5 frames and keeps that offset to the end).
- Evidence: n=11 clips, 12,791 frames.
- Confidence: high (the clip30 slow-down is seen once: low)
- Verified, confirmed: 300 frames. Margin rim rows at frame n and n+L agree in 98.5 % of 3,975 pairs for L=300, 84.3 % for 299, 85.3 % for 301 (10 clips). Best constant time offset of the formula against 14,483 rim-row readings: 0.0 frames (match 92.4 %, against 78.9 % and 82.7 % at -1 and +1 frame). Build value: 300-frame loop (10 s), phase 0 at frame 0.

### [C10] Fade the presenter footage in over the field with a linear alpha ramp from row 960 to row 1040; above 960 the field is opaque, below 1040 the footage is untouched.

- Values: video_alpha(y) = clamp((y-960)/80, 0, 1). Mean luma is 32.0-32.8 at y=960 in 10/10 clips (31.9-32.5 at y=944); first row above 32.6 is y=961-962 in 7 clips; 98.5 % of the plateau is reached at y=1036-1039; plateau luma 73.3-77.0 codes, so the ramp is 0.53 levels per row. Spatial-contrast estimate of the alpha: best line 960.5 to 1040.5, RMSE 0.012. The mean-luma curve is slightly convex (0.586 at mid-ramp, range 0.569-0.610; t^0.8 fits with RMSE 0.015) because the top footage rows differ in brightness. The lattice dots stay visible through the ramp: centre-minus-base 37, 31, 25, 20, 13.5, 8, 0 codes at y=960, 972... 1032. The footage top edge itself is not visible; it sits at or above y=960. Measured over all presenter frames pooled (title, split and CTA layouts together), not per layout.
- Evidence: n=10 clips (clip38 left out: a graphic covers the sampled columns), 87-164 presenter frames each, dot-free columns x<240 and x>840, rows 900-1100.
- Confidence: high
- Verified, confirmed: start 960.0 (per-clip 959.8 to 960.9), end 1040.7 (1039.7 to 1041.5), n=11 clips, 1,723 frames (82 to 205 per clip). Row 959 reads 32.07, row 960 32.24, row 1040 85.50, row 1041 85.78 of a 85.85 plateau. Error +-0.5 px on each end. Build value: start 960, end 1040 (80 px).
- Verified, confirmed: linear. RMSE 0.27 to 0.38 raw codes per clip for a linear ramp, 0.71 to 0.93 for smoothstep (n=11 clips). A free exponent t^g fits g = 0.97 to 1.03. Row-to-row luma step 0.67 codes for 80 rows. Build value: linear alpha, 0 at y=960, 1 at y=1040.

### [C11] Put every caption on a translucent pill of nearly the field colour; no caption shadow deeper than 1 luma code was found.

- Values: Pill colour about #11110F (luma code 30.5 +-0.8) at alpha 0.68. Dots inside the pill read 12-13 codes against 40-41 outside in the split layout (alpha 0.675-0.70, 11/11 clips, n=4.2k-8.1k cell samples each) and 13-15 against 40-42 in the full-frame layout (alpha 0.63-0.69, 11/11 clips); cell base inside is 31 against 32 in 11/11 clips. The pill is the same in both layouts and over the footage ramp. One measured extent: clip29@240 pill x 354-726, y 1422-1542 around text x 385-695, y 1447-1508 (padding about 31 px sides, 25 px above, 34 px below; +-6 px, read on the 12 px lattice), rounded corners. Lattice cells beside the glyphs read base 31 like the rest of the pill (clip29@240), so the glyphs cast no shadow above 1 code.
- Evidence: n=11 clips, all frames.
- Confidence: high for colour and alpha; medium for the extents (one frame)
- Verified, confirmed: Colour: luma code 30.78 in both layouts, U 127.0, V 128.0 = RGB 17.2, 17.4, 15.1 = #11110F (+-0.4 level). Opacity 0.68 +-0.015: dot integrals 0.683 (split) and 0.679 (full); same pixels with and without the plate on adjacent frames 0.700 (679 patches, 622,693 px, p10 0.690, p90 0.702), an estimator that reads 0.709-0.715 on a synthetic 0.69 plate. Blend is linear in code values within 0.65 codes over luma 38-101. Build value: #11110F at 0.68.

### [C12] Highlight bars on light captures are the accent at partial opacity, drawn so the ink keeps its darkness (bar under the text, or multiply); the bar holds one flat value for its whole life.

- Values: Opacity per video: 0.55 (clip29), 0.55 (clip36), 0.43 (clip32), 0.39 (clip38), 0.36 (clip37), 0.33 (clip30), 0.32 (clip39): median 0.39, range 0.32-0.55, n=7 clips; alpha from G and from B agree within 0.015. On white this gives #FEAE80 at 0.55, #FFC6A8 at 0.39, #FFCFB6 at 0.32 (flat-interior sd 1.3-4.1 levels). Ink under the bar: luma slope after-versus-before 0.741, 0.734, 0.801, 0.826 against 0.735, 0.735, 0.798, 0.825 predicted for a bar behind the ink and 0.447-0.637 for a normal overlay (4 of 5 measurable instances, fit RMSE 2.0-4.8); clip30 is the exception, a normal overlay (0.667 measured, 0.669 predicted). Within one hold the per-frame alpha varies by <=0.01 (holds of 20-121 frames). The 1.3-4.1 sd and the slope test apply to the 5 instances whose capture stays still.
- Evidence: n=7 instances in 7 clips: clip29@189-309, clip36@284-342, clip30@654-688, clip32@160-194, clip37@122-155, clip38@1028-1047, clip39@121-222.
- Confidence: medium (colour and blend are consistent; what sets the opacity per video is not known)
- Verified, not confirmed (the other claim holds): multiply. Two bars overlapping read (256, 119, 68) = #FF7744; multiply of the single bar (254, 174, 128) with itself predicts (253, 119, 65), stacking two normal-blend bars predicts (255, 137, 73): G is 18 levels apart and lands on multiply (n=7 rows of 56 px). On grey paper #ABB9B8 the bar reads #A98E75: R is unchanged (169.2 against 170.9; a normal-blend bar would give 217) and G and B give the same multiply strength (0.399, 0.405). Error +-2 levels. Build value: mix-blend-mode multiply, colour = accent #FF6B1B at the strength below.
- Verified, confirmed: clip29 0.55 (#FEAE80), clip36 0.55 (#FEAE80), clip32 0.42 (#FABB9A on #FAF8F6), clip35 0.40 (#A98E75 on #ABB9B8), clip38 0.38 (#FFC6A9), clip37 0.36 (#FDC7A9 on #FDFDF6), clip30 0.33 (#FFCDB4, normal blend), clip39 0.32 (#FFCFB6). Median 0.39 (n=8 clips, 12 bars). G and B agree within 0.016; flat-interior sd 0.9 to 1.5 levels in G. Error +-0.01. Build value: 0.40 as the default.

### [C13] On dark panels the accent is used as a flat tint at 0.34 to 0.62 opacity for text highlights, selection bands and progress fills.

- Values: Text highlight on a #080A09 panel: #6F3210 = accent at alpha 0.41-0.42 (R, G), 26,969 chroma px, clip30@798-1722. Band over a waveform on #211F1B: #6D3A1A = 0.34-0.35 (clip30@189-564). Fills on dark cards: #7F401C = 0.42-0.43 (clip38@366-408), #893D16 = 0.45-0.49 (clip31@288-330), #A84A1A = 0.60-0.62 (clip39@537-624).
- Evidence: n=5 elements in 4 clips, one frame each.
- Confidence: low (each use seen in one clip)

### [C14] Build dark cards from a warm grey ramp one to three steps above the field, with thin lighter strokes.

- Values: Panel fill #211F1B (YUV 43,126,129) in 10/11 clips; frame or deeper fill #1B1A15 (38,126,129) in 7/11; raised fill #292723 (50,126,129) in clips 32, 33, 39 (#2B2723 in clip35). Anatomy of one card (clip29@775-785, edge profiles averaged along 200-300 px): outer stroke 2 px at luma code 58-62 (about #33312D if it carries the same warm chroma; chroma not readable on 2 px), a 20 px band of #1B1A15, inner stroke 2 px at code 57-58, panel #211F1B. Captured app mock-ups keep their own neutral greys: #181818, #1F1F1F, #2A2A2A, #404040 (clips 31, 34, 37). Flat fills carry sd 0.0-0.3 levels.
- Evidence: n=11 clips scanned every 15th frame for flat fills; anatomy n=1 card.
- Confidence: medium (fills recur in 7-10 clips; stroke and band widths from one card)
- Verified, confirmed: 12 cards in 9 clips. Fill, warm (R-B = 6): #1B1A15 (clip29 outer frame, clip35, clip39), #211F1B (clip32). Neutral (R-B = 0): #181818 (clip34 settings window, clip37 checklist), #18181A (clip34 app window), #1F1F1F (clip31). A fourth clip34 card reads #13120F just inside its top edge (a darker header band, not counted). Between: #1C1A19 (clip37 settings), #252523 (clip36). Stroke width 2.1 px (per-card medians 1.65 to 2.7; n=37 edges). Stroke colour: warm cards #2B2827 (clip29), #2C2A26 (clip32), #262522 (clip35); neutral cards read #353535 (#343432 to #363634 on 5 cards in clip34 and clip37). Radius median 30 px (25 to 35.5, n=18 corners on 9 cards). Error +-1 level on fills, +-3 levels on strokes, +-1.5 px on radius. Build value: default: fill #1B1A15 (frame) with #211F1B panels, stroke 2 px #2B2827, radius 30 px.

### [C15] Cards cast one soft black drop shadow, shifted down.

- Values: Fit to the field darkening round the white card of clip29@200-300 (rect x 40-1040, y 352-1096; 339 profile points; 11 frames averaged): black at alpha 0.52, Gaussian sigma 36 px (CSS blur about 72 px), offset y +22 px, x 0; RMSE 0.41 luma levels. Measured darkening: 6.5 codes just below the bottom edge, 2.0 above the top edge, 3.4-3.9 beside the sides; it reaches 48 px above and 106 px below. A dark card (clip29@780) shows the same pattern: 7.5 below, 2 above, 4.2 beside. Light-card corner radius 28 px (clip29@240).
- Evidence: n=2 cards in 1 clip.
- Confidence: medium (two cards, one clip; one code step is 6 % of the shadow range)
- Verified, confirmed: median 28.5 px over 12 cards in 9 clips (range 20.5 to 43.7): clip29 28.5, clip36 29.6 (full) and 25.0 (presenter), clip33 29, clip35 24.6 top / 30.2 bottom, clip30 24.9, clip38 20.5 and 24, clip37 35 (37.5 top, 32.5 bottom), clip39 35.4, clip32 43.7 and 43.7. Four corners of one card agree within 2 px on 5 cards. Error +-1 px. Build value: 28 px.
- Verified, confirmed: clip29: alpha 0.49, sigma 34 px, offset +29 px (RMSE 0.28 luma levels, bottom and side profiles); clip38: alpha 0.59, sigma 34 px, offset +23 px (RMSE 0.27). Darkening of the 24.5-level field 8 / 24 / 48 / 72 / 96 px under the bottom edge: clip29 9.2 / 6.6 / 3.2 / 1.4 / 0.7; clip38 10.5 / 6.8 / 3.0 / 0.9 / 0.6 and 10.3 / 7.0 / 2.9 / 1.4 / 0.6; clip36 11.7 / 8.1 / 4.3 / 2.2 / 1.2; clip37 13.7 / 10.5 / 6.0 / 3.2 / 1.9; reach (0.5 level) 96 to 147 px. n=5 cards, 4 clips; a sixth (clip38@560-580, a card that later tilts) reads 16.5 at 8 px. Error +-0.05 alpha, +-3 px sigma, +-5 px offset. Build value: black, alpha 0.52, blur sigma 36 px (CSS blur 72 px), offset y +24 px.

### [C16] Show the off or idle state with a muted cream and brown-grey track, the on state with accent and cream.

- Values: Toggle ON: track #FF6B1B (130,78,196), knob #F2EEE8 (221,125,130), tile fill #211F1B. Toggle OFF: track #494540 (76,125,130), knob #A49E90 (152,121,131), tile fill #191715 (36,127,129). Patch sd <=0.34 codes, 700-4,800 px each (clip29@1005 and @1085). The same muted cream marks idle figures and labels on dark cards: 152,122,131 = #A49E92 and 153,122,130 (clip35@765). It equals cream at about 0.61 over the panel fill.
- Evidence: n=6 patches in clip29, 2 in clip35., text_on_cards_and_headings
- Confidence: medium (toggles in one clip; the muted cream in two)

### [C17] Draw text and vector graphics flat: no glow, no gradient, no text shadow. The only glow in a video is painted inside the opening illustration.

- Values: Surround of accent elements versus distance (3 elements, 2 clips): beside the dot-matrix star (clip29@600) the field reads Y 32.0-32.1 and chroma -1.0/0.0 from 4 px to 128 px out (n=2,050-12,329 px per ring); beside ON toggles (clip29@1085) the tile reads 43.0 and -1.9/+1.0 from 4 to 32 px; beside the accent chip (clip30@1500) no trend beyond +-1.5 codes. Titles: cell base exactly 32 and dot amplitude 38-42 between and beside the glyphs (clip29@80), so no scrim or shadow. Inside the opening illustration (clip37@70) the surround is tinted toward orange by 12 chroma codes at 2-4 px, 6.5 at 8-16 px and 3 at 32-64 px: that glow belongs to the picture.
- Evidence: n=5 probes in 3 clips (clip29, clip30, clip37).
- Confidence: medium (five probes; not every element type)

### [C18] There is no second style accent. Any other saturated colour on screen comes with the content (a brand mark, a captured page, an illustration).

- Values: Largest saturated non-accent interiors per clip: magenta #E351BC and pink #F8C3CF (clip35, a product's brand; 14.6 % and 7.4 % of that clip's saturated pixels), yellow-green #E3F221 (clip38, 13.6 %), red #FF3E52 and blue #2892FE (clip32, brand tiles), yellow #FCE035 (clip33, a capture), clay #DA7757 (clips 31 and 33, a product logo). None recurs in more than 2 clips; the accent recurs in 11.
- Evidence: n=11 clips, 5 fps survey.
- Confidence: medium (attribution to content is by eye on thumbnails)

### [C19] Light captures keep the paper and ink of their source; do not normalise them.

- Values: Paper: #FFFFFF in 6 clips (29, 30, 33, 36, 38, 39), #FAF8F6 in clip32, #FDFDF6 in clip37, #FAFAFA in clip35, pale blue-greys #F2F7F8 to #EDF2F5 in clip39. Ink: darkest 0.5 % of luma inside the paper is code 29-30 (about #0F0F0F) in clips 29, 30, 37, code 13 in clip36 (a photo) and 45 in clip39; thin strokes and 4:2:0 lighten ink, so these are upper bounds.
- Evidence: n=9 clips with light captures; ink n=5 frames.
- Confidence: medium

### [C20] The presenter footage is low-key with lifted blacks and unclipped highlights; match these levels rather than a full-range grade.

- Values: Full-range luma percentiles over rows 1100-1919 of all presenter frames, median over 11 clips [range]: p0.1 10.5 [10.5-11.6], p1 11.6 [11.6-15.1], p5 15.1 [14.0-17.5], p50 37.3 [32.6-41.9], p95 114.1 [111.8-115.3], p99 152.5 [146.7-188.6], p99.9 199.1 [193.3-248.0]. Mean luma code 62.9 [60.9-64.9], sd 31.5 [30.0-32.6]. No pixel below code 16; 0.002 % above 235. Against a neutral full-range picture: black sits 10 levels above 0, the median is at 15 % of the range, the top 0.1 % stays 56 levels under white.
- Evidence: n=11 clips, 518-980 presenter frames each (8,690 frames, every frame).
- Confidence: high

### [C21] The footage is nearly desaturated and neutrally balanced; skin is the only clearly coloured area.

- Values: Chroma RMS about the neutral point 5.0 codes [3.9-5.3]; mean U 127.7 [127.2-127.9], mean V 128.9 [128.5-129.4]; mean RGB 56.8, 54.0, 53.2 (R-B +3.6). Time-mean regions, median of 11 clips: wall #585856 with chroma 0.45 codes and R-B +0.2 [-1.1 to +3.6] (white balance neutral within 4 levels); skin #67524D, chroma 11.0 codes [7.8-12.4], R-B +27 [19.5-31.2]; cap #7C787F; dark backdrop #24221C; jacket #1F1E21. For scale, the accent orange sits 84 chroma codes from neutral.
- Evidence: n=11 clips.
- Confidence: high for the statistics; whether this is a grade or the camera's own picture is not known

### [C22] Add no grain and no noise layer to the footage or the field.

- Values: Static wall patch (x 840-1040, y 1130-1290, 40 consecutive frames): frame-to-frame RMS difference 0.22 levels [0.15-0.28], 96 % of pixel pairs identical [94-98 %], 3x3 high-pass sd 0.26 levels [0.25-0.27], n=6 clips with a cut-free window. Field: sd 0.00 (rule C05). At 0.6-0.9 Mbps the encoder would also erase fine grain, so 'none visible in the delivered file' is the claim. A vignette on the footage cannot be separated from the scene: time-mean luma codes by corner, median of 11 clips: top-left 42 [40-48], top-right 81 [75-82], bottom-left 51 [46-59], bottom-right 34 [33-37], centre 75 [70-77]; the pattern follows the scene (bright wall right, dark jacket below).
- Evidence: n=6 clips (noise), 11 clips (corner means)., presenter.per_clip
- Confidence: medium (the encode hides grain below about 1 level)

### [C23] The opening illustration is a picture on its own near-black ground that is faded into the field along its bottom edge; its ground is not the field colour.

- Values: Ground luma code by clip 24-36 (full range 9-23): 24 in clips 29 and 32 (#090909), 28-29 in clips 31 and 36, 35-36 in clips 34 and 38; chroma often warm (126,130). The last lattice row that still differs from the field is y=564 in 6 of 6 readable clips (29, 30, 31, 32, 34, 38), i.e. the picture is gone by y 576. At the left margin of clip29@80 the excess over the field falls 8, 4, 1, 0 codes at y=516, 540, 564, 588: about a 90 px linear fade (by eye from 4 samples). Lattice dots are hidden where the picture is opaque.
- Evidence: n=6 clips for the end row (frame 75), 1 clip for the fade shape.
- Confidence: medium for the end row; low for the fade shape

### [C24] Pick text colour by background: on the field or footage use cream or caption white; on dark cards cream, muted cream when idle; on light captures leave the source ink; emphasis is always the accent, never a second hue.

- Values: On field: title, heading, figure, CTA #F2EEE8 (11/11 clips); caption #FAF8F6 on the pill (11/11); emphasis #FF6B1B (11/11). On dark cards #211F1B: body #F2EEE8 (Y 221, clip29@780; clip31@200 Y 221 neutral chroma in an app mock-up), idle #A49E90-#A49E92 (clip29, clip35). On light paper: source ink about #0F0F0F and darker; highlighted ink unchanged in 4 of 5 cases (C12). Contrast in luma codes: cream on field 189, caption white on pill 198, accent on field 98, muted cream on panel 109.
- Evidence: n=11 clips for field roles, 3 clips for dark-card roles.
- Confidence: medium (dark-card roles rest on 3 clips)

### [C25] Keep the palette and the field identical from video to video; nothing in the style layer is re-coloured per topic.

- Values: Across the 11 clips (2026-11-02 to 2026-11-07): accent mean code spread 0.35 (Y), 0.21 (U), 0.18 (V); cream Y mode 221 in 11/11; caption white Y mode 229 in 11/11; field mode 32 in 11/11; lattice, silhouette phase at frame 0 and 300-frame loop in 11/11; caption pill alpha 0.675-0.70 in 11/11; footage ramp 960-1040 in 10/10. No change over the six days. What varies: highlight opacity 0.32-0.55 (C12), capture paper (C19), content brand colours (C18), illustration ground (C23), footage median luma 32.6-41.9 (C20).
- Evidence: n=11 clips.
- Confidence: high

## Release palette

### [C26] Ship an original palette: a magenta accent in place of the orange, and neutral, slightly cool greys in place of the warm ones, each at the measured lightness. Change hue only; keep every role, alpha, strength and luma step of C02-C25.

- Why: decided by the owner on 13 November 2026 for the release of Motus. The measured palette is the reference creator's own look, so the style ships colours that are not theirs. Geometry, timing, type, motion, sound, structure, the field's lattice and wave, the halftone and every element's behaviour stay as measured. The style keeps its name.
- Method. Accent: a magenta (hue 324) chosen so that every place where it carries words passes WCAG 4.5:1 (table below). Greys: each warm grey is replaced by the grey with the same BT.709 luma on code values (the quantity this note measures: Y = 0.2126 R + 0.7152 G + 0.0722 B) and a fixed cool cast, R = G - 1, B = G + 3 (B - R = +4 levels, luma unchanged within 0.5 level). The measured greys carried a warm cast of R - B = +2 (field, pill) to +20 (muted). Derived values are derived again from the new colours: the dot is the chalk at 0.22 over the field [C06]; highlight bars are the accent multiplied at the same strengths 0.40 and 0.41 [C12]; the chips' highlight is the accent at 0.41 over the pill fill; the icon-grid glow is the accent at 0.36 [G18]. Lifts that were warm offsets (ui-card bar +29, +28, +24) become neutral (+28, +28, +28) so the lifted grey keeps the same cast as its card.
- Kept: paper #FFFFFF [C19], card black #090909, every black shadow and its alpha [C15], the white edge of the player's waveform pills, the caption pill alpha 0.68 [C11], highlight strengths [C12]. The cross badge stays red #E4494C [R22]: it is a semantic "no", 35 degrees of hue from the magenta and drawn as a ring with a cross, and in the test renders it reads as red beside the magenta stamp and check. Captured pages, user pictures, logos and clips keep their own colours [C18, C19]; a strongly coloured part of a halftoned cut-out prints in the accent, so it prints magenta now.
- Values, measured -> release (luma Y of both; tokens.js `colour` unless named):

| Role | Measured | Release | Y measured / release |
|---|---|---|---|
| accent: caption active word, highlights, toggles on, outlines, send, check, lines, tags | #FF6B1B | #FF3AB0 | 132.7 / 108.4 (WCAG L 0.319 / 0.274) |
| cream (now chalk): all display text, knob on, chalk tiles, halftone ink | #F2EEE8 | #EDEEF1 | 238.4 / 238.0 |
| caption white | #F9F8F5 | #F7F8FB | 248.0 / 248.0 |
| muted: idle text, knob off, phone outline | #A49E90 | #9D9EA1 | 158.3 / 158.0 |
| field (and halftone ground) | #131311 | #121316 | 18.9 / 19.0 |
| dot (chalk at 0.22 over the field) | #434341 | #424346 | 66.9 / 67.2 |
| caption pill (alpha 0.68) | #11110F | #101114 | 16.9 / 17.0 |
| card.fill | #211F1B | #1E1F22 | 31.1 / 31.0 |
| card.frame (also the stamp fill) | #1B1A15 | #191A1D | 25.9 / 26.0 |
| card.raised | #292723 | #26272A | 39.1 / 39.0 |
| card.stroke | #2B2827 | #28292C | 40.6 / 41.0 |
| card.off | #191715 | #16171A | 23.3 / 23.0 |
| toggle offTrack | #494540 | #444548 | 69.5 / 69.0 |
| dark ink on the accent (tag text, lock glyph, player avatar glyph), marks.js and player.js | #201914 | #191A1D | 26.1 / 26.0 |
| dark ink on a chalk tile, marks.js | #1E1A15 | #191A1D | 26.5 / 26.0 |
| cross badge plate, marks.js | rgba(19,19,17,0.55) | rgba(18,19,22,0.55) | the field |
| item-cards row fill / stroke | #191713 / #2A2825 | #16171A / #27282B | 23.1 / 23.0, 40.2 / 40.0 |
| item-cards swap fill / stroke | #1F1C19 / #34312E | #1B1C1F / #303134 | 28.4 / 28.0, 49.4 / 49.0 |
| versus fill / stroke | #191713 / #21201D | #16171A / #1F2023 | 23.1 / 23.0, 32.0 / 32.0 |
| versus muted / mosaic off / done ring | #A5A197 / #737270 / #4C4C4A | #A0A1A4 / #717275 / #4B4C4F | 161.1 / 161.0, 114.1 / 114.0, 75.9 / 76.0 |
| picture dark-capture stroke | #201F1C | #1E1F22 | 31.0 / 31.0 |
| picture bubble outline / idle dots | #DCDBD9 / #696863 | #DADBDE / #67686B | 219.1 / 219.0, 103.9 / 104.0 |
| player card fill, strip, waveform pills / control bar | #1F1C19 / #23211E | #1B1C1F / #202124 | 28.4 / 28.0, 33.2 / 33.0 |
| player stroke / track off / ticks and silent bars / playhead | #302E2B / #514F4B / #585652 / #EEECE8 | #2D2E31 / #4E4F52 / #555659 / #EBECEF | 46.2 / 46.0, 79.1 / 79.0, 86.1 / 86.0, 236.1 / 236.0 |
| player avatar disc | #49463D | #454649 | 70.0 / 70.0 |
| player clip-chip glow / chip waveform | accent at 0.30 / cream at 0.65 | rgba(255,58,176,0.30) / rgba(237,238,241,0.65) | |
| highlight bar on white paper (accent multiplied at 0.40) | #FFC4A4 | #FFB0DF | |

- Contrast (WCAG 2 ratio, measured palette -> release palette). Where the accent carries words: caption active word on the pill over the field 6.60 -> 5.80; accent text on the field 6.53 -> 5.74; the stamp's accent text on card.fill 5.77 -> 5.09; dark ink on an accent tag 6.09 -> 5.37; display text on the chips' highlight (accent 0.41 over the pill fill) 7.08 -> 7.81; ink #0F0F0F on a highlight bar on white 12.47 -> 11.45; light page ink #B9B7B0 on a highlight bar on a dark page #080A09 4.95 -> 5.38. All pass 4.5:1. Where it carries no words: display colour on the accent (toggle knob, check glyph, send arrow) 2.47 -> 2.79. Unchanged within 0.05: display text on the field 16.10 -> 16.01, on card.fill 14.23 -> 14.20, caption white on the pill 17.71 -> 17.69, muted on card.fill 6.17 -> 6.15, red cross on the field 4.74 -> 4.74. The accent's own ratios are lower than the orange's because a vivid magenta is darker than an orange of the same saturation; a lighter, paler #FF55C4 would match the orange's ratios (6.50 on the field) at the cost of saturation 0.67 against 0.77.
- Luma steps kept: caption white over chalk +10.0 levels (measured +9.6; 8 limited-range codes [C04]); dot over field +48.2 (measured +48.0); every card step within 1 level of C14.
- Confidence: a design decision, not a measurement. Checked by eye on renders of the eb-e2e2 test project and the dev fixtures (before and after stills, 13 November 2026).

## Constant and variable

CONSTANT (identical in every clip, to the code value or the pixel): accent #FF6B1B; cream #F2EEE8; caption white #FAF8F6; field base #131311 with no gradient, vignette or grain; lattice pitch 12 px with nodes on multiples of 12; dot radius 2.36 px and level #434341; the three-sine silhouette, its phase 0 at frame 0 and its 300-frame loop; dot size by depth; footage ramp rows 960-1040, linear; caption pill colour and alpha 0.68 (0.675-0.70); card fills #211F1B and #1B1A15 where cards occur.

VARIABLE: highlight bar opacity per video 0.32-0.55 (driver unknown); highlight drawn under the ink in 4 cases and over it in 1; accent tint opacity on dark panels 0.35-0.62 by use; capture paper #FFFFFF, #FAF8F6, #FDFDF6, #FAFAFA by source; saturated brand colours by content; opening-illustration ground luma code 24-36 by picture; footage median luma 32.6-41.9 and p99 147-189 by take; field clock in clip30@100-600 at 0.84x (once). OVER TIME: no change between 2026-11-02 and 2026-11-07 (11 clips).

## Open questions

- What sets the highlight opacity per video (0.55, 0.55, 0.43, 0.39, 0.36, 0.33, 0.32)? It does not follow date, paper colour or bar count. More clips, or the creator's template, would decide it; until then a builder should pick one value in the range.
- Is the caption pill a flat tint only, or a tint over a backdrop blur? Dots under it are dimmed, not visibly smeared, but footage under it could not be compared with an unblurred copy. A frame pair with and without the pill over detailed footage would decide it (the pill is never absent in these clips).
- Is the footage ramp composited in gamma space? The contrast-based alpha is linear in code values (RMSE 0.012), the mean-luma curve is convex (0.586 at mid-ramp). A ramp over a flat grey test clip would decide it.
- Why does the field run at 0.84x in clip30@100-600? A retimed segment is the likely cause; it is one clip, so it is not a rule.
- Is the dot radius a smooth ramp or stepped (the table shows jumps near depths 240, 312 and 384 px)? Sub-pixel radii at 0.7 Mbps cannot separate the two.
- Dark-card stroke colour: luma code 57-62 is measured, chroma is not (2 px lines). Accent ring strokes round captures were not measured for width or exact colour.
- Is the low-key, low-saturation footage a grade or the camera's own picture? No raw footage exists to compare.
- Exact hex values are known to +-1 level on R and B (8-bit limited-range YUV): for example the accent is one of #FE6B1A, #FE6B1B, #FF6B1A, #FF6B1B, #FF6B1C.

## Needs an eye or an ear

- Nothing was watched in playback. Open (real left, recipe right) and confirm the synthetic field reads the same; then watch a 10 s loop of the built field for the feel of the wave.
- Open and and choose one highlight opacity (measured 0.32-0.55).
- Open: check whether the pill blurs the footage behind it and how soft its edge is.
- Open beside: confirm that captions (#FAF8F6) should stay brighter than titles (#F2EEE8).
- Open: judge whether new footage needs a grade to reach the measured levels (black 10.5, median 37, chroma RMS 5 codes), and whether a vignette is present (not separable from the scene by measurement).
- Open: the bottom fade of the illustration was read from four samples at one margin.
