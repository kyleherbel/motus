# Colour: measured record (C01-C30)

Part of the Editorial Proof study; read `README.md` first for the corpus, the method and the limits. STYLE.md cites these rules by id, for example [C01]. Frames are at 30 fps (f); positions are pixels on the 1080 x 1920 frame; evidence is given as clip id @ frame (see README.md, "Evidence ids").

**Sample.** All 33 reels sampled with a calibrated BT.709 decode (patch medians, pixel census at 1 fps, profiles across edges), plus a phase-locked reconstruction of the shared light canvas from 31 reels used only for measurement.

**Method notes.** Files are VP9 at 1.1-2.1 Mbps: flat patches carry +-2 levels, lines under 4 px +-8. Hexes here are the calibrated values; other studies quote default decodes about 2 levels lower.

**Confidence.** high = measured on many instances and consistent; medium = measured but on fewer instances or with a judgement step; low = one to four instances, or inferred.

## Rules

### C01 - Decode calibration: sample colours with an explicit BT.709 limited-to-full conversion. The default ffmpeg PNG path reads about 2 levels low on every channel. Source is VP9 at 1.1-2.1 Mbps, so flat patches carry +-2 levels and lines under 4 px carry +-8.

- Confidence: high
- Numbers: accurate: card white 255, strip #0184FE (YUV 114,195,65); default: white 253, strip #0083FC; mean offset +2.2/+1.8/+2.0 R/G/B
- Evidence: clip39@60 (whole frame + 4 patches); ffprobe on 5 reels

### C02 - Bright accent blue fills the hook title strip and the white-interstitial strip as a flat colour with no gradient.

- Confidence: high
- Numbers: #0184FE (range #0184FE-#0284FE, in-patch SD 1.8 levels); interstitial strip #0084FE; top/bottom/left/right medians equal within 1 level; design intent likely #0084FF (inferred)
- Evidence: 28 blue reels @60 (e.g. clip39@60, clip40@60, clip08@60); 11 reels interstitial (clip39@180); n=28 reels + 17 interstitial frames

### C03 - Every card outline uses a deeper blue than the strip, drawn 3-5 px wide with no inner stroke.

- Confidence: medium
- Numbers: light split 4 px lines #0F60CE; dark focus median #196ABF; long top-edge run #1E6AC4; 20 px panel right edge #155BCC; build value #1562C8; width 3 px in the 8 oldest reels, 4-5 px in the rest (FWHM 3-4 px); luma 86 vs 113 for the strip
- Evidence: 29 reels @60 (clip39@60 x94-97); 31 reels / 60 dark frames (clip39@300, clip29@210)

### C04 - Caption keywords on the light canvas use the bright accent, whether bold sans or italic serif.

- Confidence: high
- Numbers: #0484FB median (IQR #0484F9-#3788FC; the upper end is words still fading in); settled core #0381F9
- Evidence: 28 reels, 136 words via OCR-indexed sampling; clip39@73

### C05 - On a dark backdrop the keyword blue is lifted, and the two type styles get different blues. Both are flat, not gradients.

- Confidence: high
- Numbers: bold sans #2A9AFB (top #2E9CFB, mid #2999FA, bottom #309CFA; sat 0.82-0.86); italic serif #84C5FA (top #8AC6F9, mid #80C3FA, bottom #86C6FA; sat 0.41-0.48)
- Evidence: sans: 18 reels, 24 words (clip40@240, clip08@300); italic: 19 reels, 36 words (clip40@210, clip38@1140)

### C06 - Source-text highlight is a light-blue rounded fill behind text that stays dark.

- Confidence: high
- Numbers: #A9D7FD (range #A8D5FC-#AEDAFE). #DDF2FE is GitHub's own chip colour and #E27E53 is the Claude logo, neither is a style colour
- Evidence: 25 reels, pixel census at 1 fps (>3.7k px each); clip39@1320, clip26@690

### C07 - Neutrals: near-black ink, pure white, and a dark counter badge.

- Confidence: high
- Numbers: caption ink #131416 (IQR #121315-#141518); hook line 1 #131313; interstitial heading #141414; white #FFFFFF (Y=235); strip text reads #FCFDFC; counter badge pill #1F1F1F with text #F8F7F7
- Evidence: ink: 32 reels, 327 caption words; hook 32 reels @60; badge 3 reels / 4 frames (clip39@300, clip24@510, clip10@540)

### C08 - A newly arrived caption word on the light canvas fades from mid-grey to ink over 5 frames; the grey is the ink part-way through the fade, not a second ink.

- Confidence: high
- Numbers: per frame: #929598, #5B5D60, #353639, #202325, #121416, final #0E1012 (167 ms); as opacity 0.39, 0.65, 0.83, 0.92, 0.98, 1.0 (inferred); first-frame grey range #8F9598-#949698; blue keyword: #97A9EA, #5C8DFA, #3481FB, #1C80F9, #127FF8, #0381F9
- Evidence: 4 reels, 9 words: clip39@48-53/@59-64, clip27@54-66, clip13@48-66, clip10@46-55; blue ramp clip39@68-73

### C09 - Caption text on the dark backdrop is a cool white with no gradient, and fades in over 4 frames.

- Confidence: high
- Numbers: #EEF5FC (top #ECF4FB, mid #F0F6FC, bottom #EDF4FC; brightest cores #F2F8FF); ramp #B4B9C1, #DCE1E8, #ECF1F8, #F1F7FE (133 ms)
- Evidence: colour: 33 reels, 270 words; ramp: 1 reel, 2 words (clip39@294-298, @305-308)

### C10 - Strike-throughs are a red-orange tapered stroke with round caps, tilted about -5 degrees; on logo chips over dark it carries a roughly 3 px white edge.

- Confidence: medium
- Numbers: #FE4D2E (range #FC4B1F-#FE593A)
- Evidence: 5 reels: clip39@60 (10.6k px), clip31 (30.9k px), clip38, clip37, clip28; white edge clip39@240

### C11 - The light canvas is one shared pre-rendered loop, identical in every reel including its grain, locked to video frame 0 and running continuously under other modes.

- Confidence: high
- Numbers: loop 150 frames = 5000 ms; cross-reel grain correlation 0.83 (31-reel mean of 104 frames vs single frame; mean keeps grain SD 2.29 vs 2.38); f vs f+150: leaf corr 0.988-0.997, grain 0.83; f vs f+75: grain 0.00; position offset 0,0 px in 31 reels; scaled 1.025 about (540,960) in clip25 and clip11
- Evidence: phase-locked plate from 31 reels; clip08@540-825; clip30@0

### C12 - Canvas base is warm off-white on the right cooling to pale blue at the left edge; the tint depends on x and is gone by about x=500. The lower third is slightly darker.

- Confidence: high
- Numbers: x=1050 #F3F1F0 (luma 241), x=540 #EFF1F1 (240), x=390 #ECEFF0, x=270 #E9EEEF, x=150 #E4EAED, x=30 #DFEAF1 (232); B minus R from -3 (right) to +16..+29 (left); y>900 is 3-5 luma levels lower
- Evidence: low-pass of the 31-reel plate, 9x11 sample grid

### C13 - Two soft palm-frond shadows sit on the canvas as a bluish multiply, one from the top-left corner and a fainter one from the right edge lower down.

- Confidence: high
- Numbers: multiply (0.905, 0.935, 0.950): shadow #CADAE4 over gap #E0E9F0, luma drop 13-17.5 levels; leaflets 30-45 px wide, gaps 20-30 px; edge 10-90% width 12-18 px (sigma about 6 px); frond 1 covers x0-480 y0-740; frond 2 x600-1080 y940-1250 at about 45% strength
- Evidence: 31-reel plate, 4 zones and 3 profiles (y=110, y=500, x=160)

### C14 - Canvas grain is fine, monochrome and near-Gaussian. It exists on the light canvas only, not on cards, white interstitials or footage.

- Confidence: high
- Numbers: luma SD 2.6 levels (2.4-2.8), about 1.0% of full scale; RGB correlation 0.84-0.87; autocorrelation 0.81/0.40/0.07 at 1/2/3 px; spectrum peak 0.07 cycles/px; skew -0.36; interstitial SD 0.0; footage wall high-pass SD 0.2-0.7
- Evidence: 31-reel plate x600-1056 y10-266 plus single frames in 5 reels (clip08@0, clip30@0); clip39@180

### C15 - The grain is a static texture displaced vertically by a travelling sine wave (wave-warp signature), moving right.

- Confidence: high
- Numbers: dy(x,t) = 15.6*sin(2*pi*x/795 - 2*pi*t/150 + 2.53) px, t = absolute frame; H 15.38-15.63, lambda 794.6-795.9, period 150 frames, 5.3 px/frame (159 px/s); fit RMS 0.28 px; per-frame luma change 0.44-0.64 levels, 2.95-4.39 over 60 frames
- Evidence: 29 reels, 1,200-2,484 column-shift observations each (frames 30-105); phase continuity clip39@21/441/921/1221

### C16 - Leaf shadows also move vertically only, on the same 5 s period; the top-left frond has its own shorter wave while the lower band moves with the grain.

- Confidence: medium
- Numbers: top-left: amplitude 7-10.6 px, phase 0.70 deg/px (wavelength about 515 px), dx <= 2.6 px, fit RMS 0.7-1.3 px; lower band: amplitude 10-15.5 px, phase difference 0 +-10 deg from the grain wave
- Evidence: plates at 7 loop phases from 30-31 reels; 8 + 6 columns fitted

### C17 - Synthesis recipe for an original equivalent canvas, verified against the plate: horizontal gradient base, two multiply fronds, seeded mono grain, per-column sine displacement.

- Confidence: high
- Numbers: base linear-gradient(90deg,#DDEAF1 0%,#E4EAED 14%,#E9EEEF 25%,#ECEFF0 36%,#EFF1F1 50%,#F2F1F0 100%); fronds fill rgb(231,238,242) multiply blur 6 px (second at 45%, blur 8 px); grain blur sigma 1.25 px, SD 2.7; slices <= 12 px; result grain SD 2.52 vs 2.58, autocorr 0.83/0.46 vs 0.81/0.40, colours within 1 level
- Evidence: 

### C18 - White interstitials are pure flat white with no grain, texture or shadow, using the same accent strip.

- Confidence: high
- Numbers: background #FFFFFF, patch SD 0.0; strip #0084FE (lime reels #D5ED1D); heading ink #141414
- Evidence: 17 reels at 1 fps sampling (clip39@180, clip38@240, clip11@270)

### C19 - Dark focus backdrop is a blurred, darkened copy of the card's own content, darker toward every edge; for a white card it is a neutral grey field with a fixed luminance shape.

- Confidence: high
- Numbers: x=540 luma: y60 73, y150 80, y220 87, y1000-1100 109-110, y1330 100, y1500 86, y1600 78, y1700 69, y1800 60, y1880 53; x=10: 47 (y60), 75 (y1000), 50 (y1600), 40 (y1880); at y=1000: 76, 85, 91, 102, 109 at x=10, 80, 130, 200, 300, flat to x=780; peak 0.43 of white; colour #444444-#494949; dark cards give luma 3-10
- Evidence: 6 reels within about 5 levels: clip39@300, clip08@330, clip27@600, clip15@690, clip30@270, clip12@390; 62 dark frames in 33 reels profiled

### C20 - Backdrop construction (inferred from fitting): card content scaled about 2x around the frame centre, heavy Gaussian blur, 0.43 gain, then separable edge darkening. One outlier uses a blue gradient instead.

- Confidence: medium
- Numbers: scale 1.8-2.4; blur sigma 70-100 px; fit correlation 0.64-0.89 on 3 frames, 0.3-0.4 on 2; vertical overlay alpha 0.34 at 3% to 0 at 34%, 0 at 60% to 0.52 at 98%; horizontal 0.31 at edges to 0 at 28%; outlier clip35@600 luma 20 to 170 top to bottom
- Evidence: clip29@630 (0.89), clip34@750, clip28@570; poor fits clip36@270, clip18@600

### C21 - There is no separate dark band behind the dark-mode caption; the darkening is the text's own downward soft shadow.

- Confidence: medium
- Numbers: backdrop ratio below glyphs 0.74 at 8 px, 0.82 at 14, 0.88 at 20, 0.94 at 26, 1.00 at 38 px; above 0.94 at 4 px; between letters 0.50; CSS estimate text-shadow 0 13px 25px rgba(0,0,0,0.6)
- Evidence: clip39@300 'models' (cap height 72 px), n=1 word measured; visible on all dark captions

### C22 - Cards cast a small soft shadow straight down and none sideways.

- Confidence: high
- Numbers: canvas ratio below card 0.937 at 3 px, 0.952 at 5, 0.964 at 8, 0.973 at 11, 0.980 at 14, 0.988 at 18, 0.993 at 22, 0.999 at 27 px; sides >= 0.99 from 6 px; CSS estimate box-shadow 0 13px 20px -8px rgba(0,0,0,0.11)
- Evidence: 16 reels @60, ratio against the phase-60 plate (clip40, clip39, clip15, clip09 and 12 more)

### C23 - The title strip casts a stronger downward shadow and nothing sideways.

- Confidence: medium
- Numbers: ratio below strip 0.897 at 3 px, 0.92 at 6, 0.93 at 9, 0.93 at 12 px (only 12-17 px visible before the card); sides >= 0.99; CSS estimate box-shadow 0 12px 28px -6px rgba(0,0,0,0.18)
- Evidence: 16 reels @60

### C24 - A light-blue glint travels along the card outline, one on the top edge and one on the bottom edge at once, with a short fading tail and a few pixels of spill.

- Confidence: medium
- Numbers: head #94C6FE, 60-80 px long; tail #3C88E4, about 120 px; spill 6-8 px either side; outline base under it #1E6AC4
- Evidence: clip39@60 top edge x620-800 (n=1 reel measured; visible in all overview sheets)

### C25 - Only the 6 newest reels put a blue ring on the presenter panel; it is a three-tone bevel lit from the top-left with a near-white travelling glint. The other 27 reels have a plain unoutlined panel.

- Confidence: high
- Numbers: total 18-20 px; top edge outer 12 px #5578D8 + inner 6 px #325FC5; left edge outer 9 px #5478DA + inner 9 px #2A5FCB; right edge 20 px #155BCC; glint head #B9DBFF with about 20 px outer glow
- Evidence: clip40, clip39, clip36, clip32 profiled at 14 perimeter points each (median of frames 30-145); also clip38, clip35; 27 reels none @60

### C26 - Big-number overlays use a white-to-azure vertical text gradient on a dark slate panel.

- Confidence: medium
- Numbers: stops 0% #F4F9FE, 20% #E5F1FE, 40% #CCE5FD, 60% #9BD0FD, 80% #6BBCFD, 100% #3EA8FE (bottom range #3EA8FF-#4CA8F8); panel #303238-#373C44
- Evidence: 4 clean instances: clip38@360, clip40@270, clip20@480, clip24@870; panel also clip39@130

### C27 - The closing keyword is the one place hue is free. It is always a vertical gradient from a pale tint to a saturated colour with a same-hue glow, default blue, brand hue for a brand word.

- Confidence: high
- Numbers: top hsv(h, 0.19-0.31, 1.0), bottom hsv(h, 0.64-0.77, 0.99); blue new #CFFDFE to #5BCCFB (9 reels), blue old #BFEBFE to #59AAFE (8), yellow #FFFDB7 to #FDFE53 (7), orange #FEDEB6 to #FD9D52 (2), green #BAFDC2 to #56FD69 (2), cyan #BAFDFD to #58FDFB (2), lime #EEFEAF to #B7FD39 (3); glow 27% of bottom colour at 8 px, 20% at 40, 10% at 70, 3% at 110 px
- Evidence: 31 reels measured 12 frames before the end, 2 by eye (clip24, clip21)

### C28 - The CTA word 'comment' is a white-to-grey vertical gradient; the 6 newest reels add a solid blue ripple disc with a halo beside the presenter.

- Confidence: medium
- Numbers: comment: #E6E4E3 at top of x-height (ascenders #F9F9F8) to #9A979A at baseline; disc core #217FF6, rim #277CF1, radius about 45 px, centre (979,1212), halo to 130 px
- Evidence: comment: 8 reels (clip08@924, clip29@1022, clip13@914); disc: 4 reels within 2 levels (clip39@1444, clip40@955, clip38@1351, clip32@1067)

### C29 - Lime variant: the whole accent set swaps together for one sponsor's product reels, with dark text on the strip; canvas, ink, white and backdrop logic are unchanged. No other brand changed the accent.

- Confidence: high
- Numbers: strip #D5ED1D (#D5ED1D-#D6EE1E); strip text #131314; outline #BDD70C light / #BCD605 dark (about 0.89 of strip); keyword on light #D6EC2B, on dark #DAEE3A; CTA #EEFEAF to #B7FD39; 3 of 33 reels; 0 of 30 other reels swap despite Google, Claude and Blender topics
- Evidence: clip25@60, clip16@60, clip11@60; 6 dark frames; 18 keyword words

### C30 - Footage has no house grade: four shoots give four looks. Common traits are bright skin, near-neutral backgrounds and no added grain or radial vignette.

- Confidence: medium
- Numbers: A white tee/dark wall (14 reels): forehead #E1AEA4, wall #706767 left to #3E3735 right, shirt #D7C8D6, luma p1/p50/p99 0/106/229; B black hoodie (9): forehead #EAC5BF, wall #B8ABAB, 0/93/217; C dark tee/sage room (8): forehead #B87655, wall #C8CEBF, 11/85/215; D lime reels (2): forehead #E0AC9A, wall #9FA3A6; forehead value 0.88-0.92
- Evidence: 33 reels, panel @60 and full-frame 12 frames before end

## Constant versus variable

**Constant in all in-scope reels:** bright blue #0184FE for strip and light-canvas keywords; deep outline blue about #1562C8 at 3-5 px; highlight tint #A9D7FD; ink #131416; white #FFFFFF; cool caption white #EEF5FC and lifted keyword blues #2A9AFB / #84C5FA on dark; strike red #FE4D2E; the light canvas asset itself (same plate, same grain, same 150-frame loop, same wave phase at frame 0); flat ungrained white interstitials; dark backdrop derived from the card at 0.43 gain with edge darkening; shadows that fall straight down (card 6%, strip 10% at the edge); flat fills on strip and card; gradients reserved for big numbers and the closing keyword; the caption fade ramp.

**Varies per video:** the closing keyword's hue (blue 17, yellow 7, lime 3, orange 2, green 2, cyan 2), with the oldest 9 reels all blue, the black-hoodie batch using yellow/green/cyan freely, and the newest 15 switching only for brand words; brand colours on a brand name inside hook line 1 (Google letters in 2 reels) and everything inside source cards; the whole accent set, only in the 3 lime product reels; the blue presenter-panel ring and CTA ripple disc (6 newest reels only); outline width (3 px oldest, 4-5 px later); footage look (four shoots); canvas scale (1.025 in 2 reels); dark backdrop tint, which follows card content (one blue-gradient outlier, clip35@600).

## Disagreements with other studies

- Most hex differences with other studies are the decode offset (+2 levels): strip #0184FE here vs #0083FC (type) and #0b89f7 (hook); outline #1562C8 vs #2066BC (graphics); light keyword #0484FB vs #1086ef (type); dark keywords #2A9AFB / #84C5FA vs #54a8f0 / #92c8f3 (type). Calibrated values are built.
- Strike tilt about -5 degrees here (C10) against a rising 7.0 degrees in graphics (G14); same direction, different convention and sample.
- The 'grey then dark' caption entrance is read here as one ink fading in (C08), matching type T10 and motion M07.

## Open questions

- Is the accent's design value #0084FF? Measured R of 1-2 rules out #0A84FF unless a colour-management shift occurred.
- What was the grain before Instagram's encoder softened it? Guess: sigma about 0.8 px, SD about 4 levels (untested).
- Is the dark backdrop blurring the visible card crop or the whole underlying screenshot? Poor fits on clip36@270 and clip18@600 suggest the latter at times.
- What is the frond layer's own wave phase, and are the two fronds one layer or two?
- Is #F3574B (flat fills in 5 reels) a deliberate second red or source content?
- Lime variant: highlight tint, badge colour and number gradient were not measured.
- Glint and ripple timing, and caption fade timing, belong to the motion and type analysts; only their colours are measured here.
- Does the footage carry any saturation boost, sharpening or LUT? The 1-2 Mbps encode hides it.

## To check by eye or ear

- Other analysts using the plain ffmpeg PNG extraction will report hexes about 2 levels darker (strip #0083FC, white 253); reconcile to the accurate-decode values before building tokens.
- True outline blue is uncertain to +-8 because lines are 3-5 px under 4:2:0 chroma; #1562C8 is a recommended value between #0F60CE and #1E6AC4.
- Dark backdrop scale (about 2x) and blur (sigma 70-100 px) are fitted, with two poor fits; the white-card luminance table is the reliable target.
- CSS shadow strings (card, strip, dark caption, CTA glow) are fitted to measured falloff, not read from a project; check by eye against the evidence crops.
- Card-outline glint colours come from one reel (clip39@60); dark caption shadow from one word.
- The reconstructed plate is their asset reconstructed for measurement only; ship the procedural recipe, not the plate.
- Whether the newest presenter-panel ring should be the default (6 of 33 reels, all in the latest 9) is an editorial choice the evidence cannot settle.

## Release palette (CR01-CR12)

**Why.** The measured hues above are the reference creator's own colours. For release the owner chose an original palette: an emerald accent set in place of the blue one, a violet set in place of the lime one, neutrals without the blue cast, and a white canvas with a static grid in place of the creator's palm-frond canvas. Only colour changed. Geometry, sizes, type, timing, motion, sound, structure, element behaviour, alphas of shadows, gradient stop positions and every rule C01-C30 about where a colour goes stay as measured. The values below are design choices, not measurements; each one keeps the role, and roughly the lightness, of the measured value it replaces. `src/tokens.js` cites these ids.

**Contrast rule.** Where a colour carries words it meets WCAG 4.5:1 against the surface it sits on, which is at least as good as the measured palette (the measured blue strip text was 3.6:1, the light keyword 3.3:1, the dark sans keyword 2.1:1). The dark backdrop is taken at its lightest behind a caption: luma 97 (#616161; median 86), measured on rendered frames with a white card in focus. Ratios are in the table at the end of this section.

### CR01 - Accent fill: emerald replaces the bright blue.

- Measured: strip #0184FE [C02], callout #0885F5, white-tile digits #0083FC (graphics G17)
- Release: #00845F for all three (strip, interstitial block, number block, filled chips, check discs, terminal lit edge, steps tree, callout outline, white-tile digits)
- Why: the most saturated emerald (hue about 162) that still carries #FCFDFC text at 4.6:1

### CR02 - Outline: a deeper emerald replaces the outline blue.

- Measured: #1562C8 [C03]; dark-mode glow rgba(30,110,230,0.45)
- Release: #006A4C; glow rgba(0,150,104,0.45)
- Why: about 0.8 of the accent's lightness, as measured (luma 86 vs 113)

### CR03 - Keyword captions.

- Measured: light #0484FB [C04]; dark sans #2A9AFB, dark serif #84C5FA [C05]
- Release: light #00734E; dark sans #7BF5C8; dark serif #B5F8DD
- Why: the light keyword is deeper than the accent so it keeps 4.5:1 even where a glyph crosses a major grid line (#E3E3E3); on dark the sans keyword is the lifted accent and the serif a paler tint, the same order as measured, both at 4.5:1 or better on the lightest backdrop

### CR04 - Highlight.

- Measured: rgba(1,132,254,0.337) multiplied over white = #A9D7FD [C06]; on dark pages #215F9B screened
- Release: rgba(16,196,136,0.38) = #A4E9D2 on white; #186A4F on dark
- Why: a mint about as light as the measured tint, so dark text over it keeps 13:1

### CR05 - Presenter panel ring and glints.

- Measured: ring #5578D8 / #325FC5 / #155BCC (lit outer, inner, shaded side) [C25]; glint head #94C6FE, tail #3C88E4 [C24], hot glint #B9DBFF
- Release: ring #3B8C71 / #1C7457 / #0B6A4C; glint #79D6B4, tail #1E9B6E, hot #B3EBD7
- Why: same three-tone bevel and the same lightness order

### CR06 - Number digit ramp.

- Measured: #F4F9FE, #E5F1FE, #CCE5FD, #9BD0FD, #6BBCFD, #3EA8FE, glow rgba(62,168,254,0.5) [C26]
- Release: #F2FCF8, #E0F8EE, #C3F0DE, #8FE3C2, #5DD4A6, #2FC489, glow rgba(47,196,137,0.5)
- Why: white to emerald over the same six stops; the bottom stop keeps 5.2:1 on the tile

### CR07 - Colours derived from the accent.

- Strip and block shadows: rgba(0,60,160,0.20) and rgba(0,70,190,0.24) become the accent at 63 %, rgba(0,83,60,0.20) and rgba(0,83,60,0.24)
- Lit tile (steps) and active row (rank list): #E1F0FC / #E1F0FB become 12 % of the accent over white, #E0F0EC
- Muted row (rank list): fill #F3F9FB and edge #D4E0EC become 4.8 % of the accent (#F3F9F7) and 19 % of the outline (#CFE3DD) over white, the proportions of the measured values
- Compare tile, side A: the measured #0F6BF7 / #E5EEFB / #D5DFF2 set becomes tintOf(outline): #006A4C / #E2EEEA / #D3DEDB (11.5 % over white, edge 6.5 % darker, as measured on the warm tile)
- Steps pill icon: lavender #E9E6F4 with #7F8FC8 squares becomes the lit tint #E0F0EC with #4D9782 (the outline mixed 30 % toward white)
- Terminal lit row: #0E2942 (the blue at 20 % over the body) becomes the same 20 % of the accent, #0F2A22; its checks #71BDFC / #77B9F4 / #75B8F3 become the dark serif keyword colour #B5F8DD

### CR08 - Neutrals without the blue cast.

Each becomes the grey of the same Rec. 709 luma.

- Caption white on dark #EEF5FC -> #F4F4F4
- Dark number tile #343842 -> #383838, rgba(48,51,58,0.92) -> rgba(51,51,51,0.92); its edge #3A6077 -> #5A5A5A; label #EBEEF3 -> #EEEEEE; the backdrop echo it casts (110,115,125) -> (115,115,115)
- Dark logo card gradient #050F1D / #030A17 / #00030F -> #0E0E0F / #09090A / #030303; its echo (4,10,22) -> (10,10,10); taglines #A9B3C2 -> #B2B2B2 and #6E7179 -> #717171
- Logo-grid tile shadow rgba(10,50,110,0.25) -> rgba(46,46,46,0.25); logo-chip shadow rgba(20,40,70,a) -> rgba(38,38,38,a)
- Terminal lit text #F7FFFF -> #FDFDFD, done text #D1D9E5 -> #D8D8D8
- Steps sub-line #747D88 -> #7C7C7C; text-card eyebrow #8A8F98 -> #8F8F8F; media and price greys #8A8E96 -> #8E8E8E
- Unchanged: ink, card white, terminal greys, chrome greys and every neutral whose blue exceeds its red by less than 8 levels

### CR09 - CTA dot.

- Measured: core #217FF6, rim #277CF1 [C28]
- Release: core #0F9D6D, rim rgba(14,150,104,0.9)

### CR10 - Light canvas: white with a static grid.

- Measured: a horizontal pale-blue to off-white gradient, two palm-frond shadows, monochrome grain and a 5 s travelling wave [C11-C17], plus a slightly darker lower third [C12]
- Release: flat #FFFFFF under a grid of 2 px lines every 90 px (#EFEFEF), every third line #E3E3E3 (so every 270 px), centred on the frame centre (540, 960): 12 columns, with a major line through the centre both ways. No fronds, no grain, no wave, no darkening: the canvas is the same at every t
- Why: the owner asked for a clean white ground with a quiet design grid. 90 px cells read as a layout grid behind the 894 px card rather than graph paper; at phone size (about 0.36x) the lines sit near the threshold of notice
- The white interstitial ground stays flat #FFFFFF with no grid [C18]; card shadows [C22, C23] are unchanged and fall on white

### CR11 - The violet look replaces the lime look.

The second look keeps the lime look's role [C29]: one product's own colour, the whole set swapping together. Violet is dark where lime is light, so its strip text is light (#FCFDFC) where lime's was dark.

| Role | Lime (measured) | Violet (release) |
|---|---|---|
| accent / callout | #D5ED1D / #BDD70C | #8846FA / #8846FA |
| text on accent | #131314 | #FCFDFC |
| keyword on light | #D6EC2B | #7836E4 |
| keyword on dark, sans / serif | #DAEE3A / #E6F58A | #E5D6FF / #F0E8FF |
| outline / glow | #BDD70C / rgba(190,220,30,0.4) | #6430CC / rgba(130,80,240,0.45) |
| panel ring | #D5ED1D, #BDD70C, #A8C008 | #9578E4, #7552D6, #6237C6 |
| glint / tail / hot | #F3FFB0 / #C8E030 / #FBFFD8 | #CDB8FF / #9363F2 / #E6DCFF |
| highlight / on dark | rgba(213,237,29,0.42) / #5C6B12 | rgba(136,70,250,0.30) = #DBC8FE / #5E40AE |
| digits | #FDFFF0 ... #B7FD39 | #F8F5FF, #EFE9FF, #E0D4FF, #CDB9FF, #BFA6FF, #B293FF |
| CTA dot | #BDD70C | #8A4DF5, rim rgba(120,64,230,0.9) |
| derived (CR07) | from the accent | tint #F1E9FE, muted #F9F6FF, edge #E2D8F5, icon #936EDB, shadow rgba(86,44,158,a) |

A violet light enough for 4.5:1 on the dark backdrop is a pale lavender, so on dark the violet keyword stands out from the white caption less than the emerald one does; the italic serif and the weight carry the rest.

### CR12 - CTA keyword tones.

- The default tone follows the look: `emerald` #BFFFE8 to #4CFCBC (hsv 158, s 0.25 to 0.70), `violet` #DBC7FF to #AD7EFC (hsv 262, s 0.22 to 0.50; the bottom saturation is below the measured 0.64-0.77 because a violet that saturated falls under 4.5:1 on dark clothing)
- The brand tones `blue`, `yellow`, `orange`, `green`, `cyan`, `lime` stay as measured [C27]; `blue` is now only for a brand whose colour is blue

### Contrast, measured palette against release palette

| Text and surface | blue (measured) | lime (measured) | emerald | violet |
|---|---|---|---|---|
| strip, block, chip and pill text on the accent | 3.59 | 14.11 | 4.61 | 4.79 |
| keyword on the light ground (measured canvas #EFF1F1; release white) | 3.25 | 1.17 | 5.90 | 6.09 |
| the same over a major grid line #E3E3E3 | - | - | 4.59 | 4.75 |
| sans keyword on dark, lightest backdrop (#616161) | 2.10 | 4.80 | 4.64 | 4.54 |
| serif keyword on dark, lightest backdrop | 3.35 | 5.25 | 5.14 | 5.22 |
| caption white on dark, lightest backdrop | 5.63 | 5.63 | 5.63 | 5.63 |
| ink #131416 on the highlight | 12.07 | 16.16 | 13.31 | 12.03 |
| accent digits or chip text on white | 3.65 | 1.29 | 4.62 | 4.80 |
| digit ramp bottom stop on the dark tile | 4.60 | 9.56 | 5.24 | 4.75 |
| rank number (accent, 52 px) on the active row tint | 3.15 | 1.13 | 4.00 | 4.14 |
| CTA keyword bottom stop on dark footage (#1A1A1A) | 9.51 | 14.19 | 13.23 | 5.94 |

The rank number is a single large numeral, not words; it stays the accent as measured and is better than the measured 3.15:1.
