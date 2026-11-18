# Colour

Measured on the 30 in-style clips of the reference corpus (neutral ids clip01 to clip30, by publication date, 2026-03 to 2026-11). Evidence ids are `clipNN@frame` at the clip's own rate (23.976 or 24 fps); evidence files stay in the private study folder and are not part of this repository. Confidence is the analyst's.

## Summary

Colour was measured on all 30 in-style clips (clip01 2026-03-11 to clip30 2026-11-15) with a calibrated BT.709 limited-to-full decode through ffmpeg's accurate swscale path, checked on a black plate (raw Y 16 -> 0) and on white caption cores (raw Y 240-252 -> 255). The default ffmpeg path reads 1-3 levels low; OpenCV's BT.601 matrix adds up to 7 levels on saturated yellow. Five passes, all code: (1) a sweep of every 12th frame (4,404 frames) with per-panel tone, colour, noise and row profiles; (2) a seam-band caption pass on every 6th frame (8,797 frames, 7,258 caption detections); (3) an opening-title pass (first 5 s); (4) drop-shadow and box-opacity model fits on native crops; (5) tests for seam gradients, plates, vignette, grain and footage neutrality.

Findings. Inserted footage is placed as found: neutral whites (R-G 0.0, B-G -0.1) that reach 255. Letterbox plates are pure #000000. The seam is a hard one-row cut with no line, feather or gradient. Captions are #FFFFFF with a hard black drop shadow (0, +3) px, sigma about 1 px, 100% opacity. About a third of clips put captions in a black box at about 65% opacity (some near-opaque #131313); 6 clips use opaque solid boxes whose colour usually matches a colour in the footage on screen; 4 early clips (Mar-Apr) switch emphasis words to yellow or lime (#F2D117 / #E5FC17); one clip makes all text pale yellow (#FBF2AE). Titles are #FFFFFF with no measurable shadow. Only the presenter footage carries a look: low key (p50 luma 36, black floor about 5), a soft highlight shoulder that never reaches luma 251, moderate saturation (HSV S 0.31), warm mids and highlights over slightly cool shadows. The same look holds in punch-ins. There is no grain and no vignette.

Variation: the caption treatment is chosen per clip, with no trend over the date range. The presenter footage became less saturated (0.37 -> 0.29) and brighter in the highlights (p99 224 -> 242) after a set change around June 2026.

## Rules

### C01. Decode every reference and every builder check with an explicit BT.709 limited-to-full conversion through the accurate swscale path (accurate_rnd+full_chroma_int); never use OpenCV's default reader or the swscale fast path for colour values.

- Values: Black plate clip17@96: raw Y/U/V 16.0/128.0/128.0 over 264,000 px -> calibrated (0,0,0); without range expansion it reads (16,16,16). White caption cores: raw Y 240.5 (clip30@144), 245.6 (clip17@96), 252.0 (clip30@336), above the 235 limit, so they decode to 255. Offsets from the calibrated decode: ffmpeg 7.1 default rgb24 (fast path, which does honour the bt709 tag) -1.0 to -2.9 levels per channel (grey clip30@336: -2.4/-1.8/-2.1; beige clip01@480: -1.0/-2.9/-2.3; yellow clip05@1038: 0/-2.1/-2.0). OpenCV (BT.601 matrix): grey -2.3/-2.3/-1.8, yellow 0/+6.5/+6.8. No range expansion: +3.5 to +4.6 on mid grey. Hand-coded BT.709 maths matches the calibrated decode within 0.2 levels.
- Evidence: n=4 frames in 4 clips, 6 patches. evidence/calibration/decode_calibration.json; scripts/calib.py
- Confidence: high

### C02. Caption text fill is pure white #FFFFFF in every clip unless a clip-wide or emphasis colour applies (C06). Do not tint it toward the background.

- Values: 6,622 white caption detections in 30/30 clips (sampled every 6th frame): median #FEFEFE, p10 #FBFCFA, p90 #FFFEFF; luma median 253.5 (code values above 235 are clipped). Over coloured backgrounds the 4:2:0 chroma of thin strokes bleeds up to 5 levels toward the background (clip30@120 on blue-grey sky reads (250,254,255)). That is an encode artefact; do not copy it.
- Evidence: n=30 clips, 8,797 band frames. evidence/caption_colour_per_clip.csv, caption_detection_summary_per_clip.json, palette_swatches.png
- Confidence: high

### C03. Unboxed captions carry a hard black drop shadow straight down: offset (0, +3) px, blur sigma about 1 px, opacity 100%, no spread, no stroke.

- Values: Model fit (shadow = alpha x shifted, blurred glyph mask, against an inpainted background) on 26 native seam-band crops from 10 clips. 10 crops in 4 clips (clip13, clip20, clip26, clip30) give exactly dx 0, dy +3, sigma 1, alpha 0.98 to 1.14 (clamped at 1.2), with RMSE falling from 0.17-0.20 to 0.07-0.08. Edge profile clip30 (n=107 detections): luma relative to the background at 1 to 5 px below a glyph edge is 1.08, 0.42, 0.03, 0.73, 0.97; above the glyph 1.00; at the sides 0.86 to 0.92 at 1-2 px, which the sigma-1 blur explains. Variants: clip06 (+2,+2), clip08 (+4,+4, sigma 2), clip05 (0,+5, alpha 0.54).
- Evidence: n=17 crops with a shadow, 7 clips. evidence/caption_shadow_fit.json, caption_band_crops/*.png, caption_pixelfont_shadow_clip30@144_x4.png
- Confidence: medium (exact on 4 clips; 3 clips vary)

### C04. Captions inside a box have no drop shadow; boxed caption text stays #FFFFFF.

- Values: Shadow fits on boxed captions give alpha <= 0.04 (clip02@210/222/228 orange box; clip09@516/612/1050 ochre box). Box text fill: clip02 #FFFCF8, clip09 #FFFDFB, clip21 #F7FEFF, clip29 #F9FEFF.
- Evidence: n=6 crops, 2 clips with fits plus 4 clips of detections. evidence/caption_shadow_fit.json, caption_treatments_clip01-15.png
- Confidence: medium

### C05. The neutral caption box is black at about 65% opacity (translucent, footage visible through it); some clips use a near-opaque #131313 box instead.

- Values: Edge-pair fit inside = (1-a)*outside + a*c: clip07 a 0.69/0.69/0.68 with c of about 0 (RMSE 1.5 to 2.7, 150 rows); clip01 a 0.51 to 0.52 (RMSE 4.5 to 5.9, 128 rows). Ring-to-outside luma ratio: clip01 0.365 (a 0.64), clip24 0.355 (0.65), clip19 0.318 (0.68), clip28 0.292 (0.71). Near-opaque: clip16 a 0.98, c #131313 (RMSE 2.6 to 3.2, 308 rows); clip18 has 125 uniform #121212 rings. Fits failed on clip04, clip24 and clip28 (RMSE above 30).
- Evidence: n=6 clips fitted, 4 ratio-tested. evidence/caption_box_fit.jsonl, caption_colour_per_clip.csv, caption_translucent_box_clip01@480_x4.png
- Confidence: medium (opacity spread 0.5 to 0.98)

### C06. Accent colour is per clip, not per word class. In 4 of 30 clips (all from 2026-03-24 to 2026-04-06) emphasis words switch the fill to yellow or lime. In 1 of 30 clips (clip22) every caption and the title use a pale yellow. Never use gradients or several accents in one clip.

- Values: Yellow emphasis fills: clip05 #F2D117 (#F0D11D to #F8EA14, 10 detections), clip08 #F7E909 and lime #E5FC17 (11 detections), clip03 lime #D3FC18 ('CINEMA', 3 detections), clip06 lime #C1FF02 ('PLAYBOOK', 3 detections). Pooled: 27 detections, median #F0EA14, p10 #CCCF03, p90 #F9FD1B. Yellow fills are 1.5 to 5% of caption frames in those clips. Pale yellow in clip22: 200 detections, median #FBF2AE (p10 #F9F0AC, p90 #FCF3B0), 79% of its caption frames; its title is #F9F8B0 (clip22@36, 99,675 px).
- Evidence: n=30 clips. evidence/caption_colour_per_clip.csv, caption_coloured_fill_and_box_crops.png, caption_lime_emphasis_clip06@2982_clip03@1686.png, title_pale_yellow_clip22@36.png
- Confidence: medium (few clips)

### C07. Solid coloured caption boxes are opaque, with white text and no shadow. They appear in 6 of 30 clips, and their colour is taken from a colour on screen in the footage at that moment.

- Values: Uniform rings (luma std <= 3): clip02 orange #EB5914 (8 frames) and coral #FF5848 (8); clip09 ochre #946D2F (26); clip17 terracotta #D87854 (32); clip21 light blue #7EA3CB (17) and dark teal #31505B (6); clip29 dark blue #2D5373 (13), mauve grey #766370 (3) and terracotta #DD805F (3); clip12 grey #3F3F3F (6). Colour-pick test: in 9 of 11 colour groups the nearest top-panel thumbnail cell in the same frame is 1.0 to 18.4 RGB units from the box colour, against a cross-clip baseline of 27 to 93 (clip02 #EB5914: 1.0 vs 86; clip21 #7EA3CB: 1.0 vs 40, with 13.5% of cells within 30). Exceptions: clip02 #FF5848 (92 vs 93) and clip21 #31505B (25 vs 16).
- Evidence: n=6 clips, 120 box frames. evidence/caption_box_vs_footage_colour.json, palette_swatches.png, caption_treatments_clip16-30.png
- Confidence: low-medium (colour-pick is an inference from 11 groups)

### C08. Caption colour does not depend on background brightness. A box is a per-clip choice, not a readability fallback: white text with the 3 px shadow sits directly on bright footage.

- Values: Unboxed captions on bright, smooth backgrounds: clip20@804 (background luma 234), clip30@258 (201), clip06@1374 (180), clip26@1068 (146). Boxes also appear on dark footage: clip16 has 54 and clip18 134 uniform dark rings. Share of bright-background caption frames with a translucent black box: clip28 1.00, clip01 0.82, clip19 0.78, clip16 0.63; most clips 0 to 0.24.
- Evidence: n=30 clips. evidence/caption_colour_per_clip.csv, caption_band_crops/
- Confidence: medium

### C09. Opening-title fill is #FFFFFF. Only brand marks carried in from footage or logos keep their own colours, plus the clip-wide pale yellow of C06.

- Values: Large white title glyphs (cap height >= 34 px) in 27 of 30 clips, 653 frames: median #FEFDFE, p90 #FFFFFF, p10 #E9E6E4 (motion-blurred edges); luma median 253.5. Colour exceptions read by eye: clip22 pale yellow #F9F8B0; clip23 red 'NETFLIX' wordmark; Higgsfield lime #D0FB17 to #D3FC18 (clip03, clip11) is part of the brand graphics.
- Evidence: n=30 clips. evidence/titles_clip01-18.png, titles_clip19-30.png, titles_json/
- Confidence: high for white; low for the exceptions (read by eye)

### C10. Titles have no measurable drop shadow, glow or backing gradient. Do not add one; legibility comes from size and the seam position.

- Values: Soft-shadow fit (offset -4 to +16 px, sigma 0 to 24) on 22 title crops: alpha <= 0.03 in 13; the other 9 have textured backgrounds and RMSE 0.13 to 2.4, so they are not interpretable. Close-ups by eye (clip13@9, clip17@15) show motion blur and no shadow. Top-panel row-luma profile at -240 to -40 px from the seam is within 3% of the full-frame footage baseline (see C12).
- Evidence: n=22 crops. evidence/title_shadow_fit_attempt.json, titles_clip01-18.png
- Confidence: low (fit mostly inconclusive; by eye)

### C11. The seam between footage and presenter is a hard cut: no line, no feather, no shadow, no gradient.

- Values: 1,856 split frames in 28 clips at 1080p (clip04 and clip05 at 720p skipped): the normalised row-luma profile goes from -0.02 (row above) to 1.00 (first row below), and rows +2 to +13 sit at 1.07 to 1.10, so at least 88% of the step happens within one row. No row stands out from both panels. Rowdiff at the seam row is 0.52 (0.32 to 0.83 per clip) of the total over +/-4 rows. First row of the bottom panel per clip: 953 to 962, mode 958 to 960.
- Evidence: n=28 clips. evidence/seam_sharpness.json, split_frame_hard_seam_clip30@24_half.png (frame about 24)
- Confidence: high

### C12. Add no darkening gradient on either side of the seam.

- Values: Median of per-frame row luma relative to the panel 200-240 px from the seam: split frames (n=1,470, 1080p) vs full-frame footage baseline (n=970) at offsets -160/-120/-80/-40/-20 px: 0.997/1.000/1.000/0.974/0.892 vs 0.992/0.996/0.996/0.969/0.938. The difference is at most 0.05, and only in the caption/shadow rows.
- Evidence: n=28 clips. evidence/seam_gradient_profile.json
- Confidence: medium (content-averaged test)

### C13. Where footage does not fill the frame (16:9 footage letterboxed in a full-frame layout), the plate is pure black #000000. Use no blurred copy and no colour fill.

- Values: Plate pixels clip17@96: raw Y 16.0, U/V 128.0 over 616,000 px, which decodes to exactly (0,0,0). Uniform bands in footage areas: 1,247 found in 30 clips; 31% are black (luma <= 3), 22% white (>= 245, UI pages), the rest UI backgrounds (e.g. #E5D8CD, clip04). The black plate is confirmed by eye in clip13@492, clip17@96 and clip20@624. No blurred-fill plates were seen.
- Evidence: n=30 clips (band test), 3 by eye. evidence/black_plate_letterbox_clip17@96_clip20@624_clip13@492.png, uniform_bands_plates.json
- Confidence: high for colour; medium for 'no blur fill'

### C14. Insert footage exactly as found: no grade, no tint, no lifted blacks, no highlight compression.

- Values: 890 footage frames in 28 clips where luma >= 200 covers at least 30% of the area (UI pages, documents): white-band mean (245.7, 245.6, 244.8); R-G median 0.0 (p10 -2.8, p90 7.4); B-G -0.1 (p10 -8.5, p90 2.8). 80% of these frames have at least 1% of pixels at luma >= 251, and p99.5 has a median of 255. The presenter panel never reaches 251 (C16).
- Evidence: n=28 clips. evidence/footage_as_found_white_test.json, presenter_grade_per_clip.csv (f_* columns)
- Confidence: high

### C15. Presenter levels and contrast (low key): grade the speaker footage to these 8-bit full-range luma percentiles: p0.5 4.8, p5 6.7, p25 14.2, p50 35.8, p75 89.5, p95 185.4, p99 236.0, p99.5 242.1.

- Values: Bottom panel (rows 1020-1919) of 2,264 split frames in 29 clips (clip11 has 1 split frame and is excluded). Values are the median of per-clip medians, with p10 to p90 over clips: p0.5 4.8 (1.9 to 7.0), p50 35.8 (22.3 to 62.7), p95 185.4 (139.3 to 224.6), p99 236.0 (199.7 to 245.9). Crushed share (luma <= 4) is 0.1% (p90 4.7%): the black floor is held at about 5, not 0.
- Evidence: n=29 clips. evidence/presenter_grade_per_clip.csv, presenter_grade_summary.json, presenter_luma_percentiles_by_clip.png, presenter_panel_look_per_clip.png
- Confidence: high for the measured target; medium as a recipe (the set's lighting is part of it)

### C16. Presenter highlight roll-off: a soft shoulder keeps luma at or below 250. Warm practicals may clip in the red channel only; neutral 255 whites never appear in the presenter footage.

- Values: Share of luma >= 251 in the bottom panel is 0.000 in 30/30 clips. Native checks of the bottom panel: clip30@24 max 249.6 (p99.9 244.4), clip28@400 249.4, clip01@300 253.7 (p99.9 249.3), clip06@600 240.5; R reaches 255 on practicals (clip30@24 R max 255, G 253, B 254). p99 rises over the date range (Spearman +0.56: 224 before June vs 242 from June).
- Evidence: n=30 clips (sweep) + 4 native frames. evidence/presenter_grade_per_clip.csv (p_clip, p_y99)
- Confidence: high

### C17. Presenter colour: warm mid-tones and highlights, slightly cool shadows (a mild teal-shadow, warm-skin split). Target mean Cb -0.4 and Cr +3.2, and these mean (R-G, B-G) per luma band: shadows 0-47 (+0.8, +3.9); mids 48-127 (+16.1, -0.5); upper 128-199 (+18.8, -7.4); highlights 200-255 (+7.7, -12.5).

- Values: 29 clips; p10 to p90 over clips: shadows B-G +1.1 to +9.9; mids R-G +1.8 to +25.6; highlights B-G -21.3 to -4.0. Cr 0.5 to 7.4 and Cb -2.3 to +2.6 (BT.709, 8-bit units).
- Evidence: n=29 clips, 2,264 frames. evidence/presenter_grade_per_clip.csv, presenter_panel_look_per_clip.png
- Confidence: medium (scene light and grade cannot be separated without the camera originals)

### C18. Presenter saturation is moderate: mean HSV saturation 0.31 (0.27 to 0.39), colourfulness about 35. The footage panel is far less saturated on average (0.18), so do not push the speaker footage to compete.

- Values: Presenter mean S median 0.314 (p10 0.269, p90 0.389, range 0.231 to 0.457); Hasler-Suesstrunk colourfulness 35.0 (24.3 to 43.6). Footage top panel S median 0.176 (0.056 to 0.382).
- Evidence: n=29 clips. evidence/presenter_grade_per_clip.csv
- Confidence: high

### C19. Punch-ins (full-frame presenter) use the same grade as the split-screen panel; do not regrade them.

- Values: Paired per-clip difference, punch-in minus panel (26 clips with at least 5 punch-in frames): saturation -0.01 (p10 -0.05, p90 +0.02); Cr +1.3 (-0.1 to +3.4); Cb -1.1 (-3.3 to -0.2); p1 +0.95; p50 +2.9. Differences are in the direction of more skin in frame, i.e. framing, not grade.
- Evidence: n=26 clips. evidence/presenter_grade_summary.json, frame_classes_stride12.json
- Confidence: medium (punch-in frames classified by colour histogram; some misclassification seen in clip03 and clip09)

### C20. Do not add a vignette.

- Values: 87 bright, flat footage frames (white UI, thumbnail p10 luma >= 225): corner minus centre luma median 0.0 (p10 -8.1, p90 +13.3). Presenter column profile averaged over 29 clips: left edge 0.39 and right edge 0.66 of the peak. The asymmetry comes from room lighting, not a centred vignette.
- Evidence: n=30 clips. evidence/vignette_test.json
- Confidence: medium

### C21. Do not add grain. No grain survives the delivery encode on any surface.

- Values: Laplacian (Immerkaer) noise sigma on low-gradient pixels: presenter panel 0.151 levels (0.128 to 0.189), footage panel 0.096 (0.028 to 0.168), flat UI frames as low as 0.017. A grain layer of 2+ levels would show.
- Evidence: n=30 clips, 4,404 frames. evidence/presenter_grade_per_clip.csv (p_noise, f_noise)
- Confidence: medium (the encode, about 1 Mbit/s VP9, could have removed fine grain from the master)

### C22. Caption treatment varies by clip with no trend over time. Default: white plus the 3 px shadow (about 18 clips). Black box: about 10 clips. Solid colour box: 6 clips. Yellow or lime emphasis: 4 clips (Mar-Apr only). Pale-yellow text: 1 clip.

- Values: By eye from 4 to 6 crops per clip (30 clips), cross-checked with code. Black box: clip01, 04, 07, 16, 18, 19, 22 (some), 24 (some), 28, 29, from 2026-03-11 to 2026-11-10. Coloured box: clip02 (03-18), 09 (04-07), 12 (05-11), 17 (07-06), 21 (09-01), 29 (11-10). Yellow or lime: clip03, 05, 06, 08 (03-24 to 04-06). Pale yellow: clip22 (09-10).
- Evidence: n=30 clips. evidence/caption_treatments_clip01-15.png, caption_treatments_clip16-30.png, caption_colour_per_clip.csv
- Confidence: medium (classification partly by eye)

### C23. The presenter grade drifted over the date range: less saturated and brighter in the highlights after the set change around late May / June 2026. Use the late values for a current-looking edit.

- Values: Before 2026-06-01 (n=13 clips, excluding clip11) vs from 2026-06-01 (n=16): saturation 0.373 vs 0.292 (Spearman vs date -0.56); p99 224 vs 242 (+0.56); shadow B-G Spearman -0.47; p50 31.9 vs 37.2. Set change by eye from clip14/15: white round light, red accents and a grey room replace the blue-monitor wall.
- Evidence: n=29 clips. evidence/presenter_grade_summary.json, presenter_panel_look_per_clip.png
- Confidence: medium

### C24. Presenter brightness varies widely by clip (p50 15 to 86). Wardrobe and framing drive it, not a changing grade, so match the speaker's percentiles to the target band rather than to a single number.

- Values: p50 per clip: min 15.2 (clip04), max 85.8 (clip28); white tops in clip21 and clip28 lift p50 to 81.5 and 85.8 (read by eye from presenter_panel_look_per_clip.png); p10 to p90 22.3 to 62.7.
- Evidence: n=29 clips. evidence/presenter_grade_per_clip.csv, presenter_panel_look_per_clip.png
- Confidence: medium

### C25. Never observed: gradient or multi-colour text, outline strokes on captions, coloured glows, a seam line, a graded or tinted inserted clip, a vignette, a blurred background plate, or a caption box with a drop shadow.

- Values: Caption side darkening is only 8 to 14% at 1-2 px (explained by the sigma-1 shadow, C03). Seam profile (C11), white test (C14), vignette test (C20) and plate test (C13) all come back negative. The caption colour table shows at most one accent hue per clip.
- Evidence: n=30 clips. evidence/caption_detection_summary_per_clip.json, seam_sharpness.json, footage_as_found_white_test.json, vignette_test.json
- Confidence: medium

## Constant and variable

CONSTANT (every clip measured): calibrated white caption fill #FFFFFF; black #000000 plates; hard seam with no line or gradient; footage inserted ungraded (neutral whites reaching 255); presenter luma never >= 251; no vignette; no grain; titles #FFFFFF except the one pale-yellow clip. VARIABLE: caption shadow offset ((0,+3) in 4 fitted clips; (+2,+2), (+4,+4), (0,+5) elsewhere; none in boxed captions and in clip15); caption box per clip (none / black at opacity 0.5-0.98 / solid colour taken from the footage); accent fill per clip (yellow or lime emphasis in 4 clips, pale yellow in 1); presenter grade per clip (p50 15-86 with wardrobe and framing; saturation 0.23-0.46, falling after June 2026; highlights p99 200-250).

## Open questions

- Is the caption box colour really picked from the footage? 9 of 11 colour groups match an on-screen colour; a frame-by-frame check of box frames against the top panel would decide it.
- What sets the caption shadow offset ((0,+3) vs (+2,+2) vs (+4,+4))? Possibly the caption font or template version. The type analyst's font IDs per clip, joined with caption_shadow_fit.json, would decide it.
- Do titles have a soft shadow on bright footage? The fit could not separate one from textured footage. A title frame over a flat bright plate, or the editor's project file, would decide it.
- How much of the presenter look is grade and how much is set lighting? Without camera originals the recipe is a target distribution. A raw clip from the same camera would separate them.
- Opacity of the black box varies (0.51 clip01, 0.69 clip07, 0.98 clip16). It is unclear whether this is one template at different settings or edge-fit error on rounded corners.
- Was sharpening applied? Not measured.

## For a person to check

- Watch the caption treatments in motion: does the box or the colour change within a clip, or animate in? Open evidence/caption_treatments_clip01-15.png and caption_treatments_clip16-30.png, then play clip02, clip09, clip17, clip21 and clip29 around the frames in caption_box_vs_footage_colour.json.
- Confirm by eye that yellow/lime caption words are emphasis words (numbers, product names): clip05@54-66 and @312 ('HUNDREDS OF MILLIONS'), clip08@42 ('BROKE') and @450 ('SEEDANCE 2.0'). Crops are in caption_coloured_fill_and_box_crops.png.
- Check whether opening titles carry a soft shadow when played: titles_clip01-18.png, titles_clip19-30.png.
- Judge the presenter look against the recipe: presenter_panel_look_per_clip.png shows the set change around clip14/15. Compare a builder render of a different speaker graded to build_spec.presenter_grade.
- Frame classes (split / punch-in / footage) come from a colour-histogram classifier with visible errors in clip03 and clip09 (dark UI over a dark room). Presenter numbers use only confirmed split frames, but the punch-in comparison may include some footage frames.
