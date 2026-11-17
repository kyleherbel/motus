# Type

Measured: The type of all 19 clips (20,881 frames at 29.97 fps, 697 s) through a calibrated BT.709 limited-range decode checked on caption glyph cores (Y 235, Cb/Cr 128 -> #FFFFFF; a default ffmpeg PNG reads 253). Every frame was scanned for caption lines (white glyphs on a translucent plate); each caption state was read with Apple Vision OCR and aligned to the faster-whisper transcript: 1,284 clean caption groups. Plate geometry, opacity and radius were fitted on 1,164 plates, the glyph shadow on 30 lines, and the typeface by overlaying browser-rendered installed fonts glyph by glyph on 57 lines. The closing keyword was measured on the last 240 frames of every clip; illustration text was read by OCR at 2 frames per second (1,400 frames). Captions are one centred line of Inter at about 76 px, white with a black drop shadow, on a tight grey plate, 1-3 words at a time, cut in and out with no animation; every clip ends on one quoted serif keyword.

Not done: Nothing was listened to and no playback was watched. Fonts that are not installed were not tested. Illustration text was sampled at 2 fps and its fonts were judged by eye. Captions merged with white interface text on the same row (about 1.5 % of frames) were not recovered.

Evidence is cited as `clipNN@frame` (frames at 29.97 fps, counted from 0; ids are this style's own). File names in Evidence lines name files of the local study; they are not shipped. "Verified" lines give the independent verifier's verdict and final value; item numbers refer to [verification.md](verification.md).

## Rules

### [T01] Set captions in Inter at a heavy Bold (variable wght about 730, optical size about 26); use Inter Bold 700 when only static weights exist.

- Values: Mean per-glyph soft IoU over 57 caption lines (19 clips): Inter opsz 26 wght 730 = 0.883 (best on 19 lines), Inter opsz 20 wght 730 = 0.881, Inter Bold opsz 32 = 0.869, Arial Bold 0.856, SF Pro Rounded Bold 0.856, SF Pro Display Bold 0.851, SF Pro Text Bold 0.848, Helvetica Neue Bold 0.846, Poppins 700 0.806, Montserrat 700 0.786, Avenir Next 700 0.767. Noise ceiling (same text in two clips) 0.980 median, 53 pairs.
- Evidence: n=57 lines, e.g. clip01@736, clip02@372, clip04@1081; T_caption_font_scores.csv, T_caption_font_scores_inter_sweep.csv, T_caption_font_overlay.png, T_ceiling.json
- Confidence: medium: best installed match with a clear margin, but 0.10 below the same-text ceiling, so a face that is not installed could fit better
- Verified, confirmed (item 3): Inter variable wght 730, opsz 26, 76 px, letter-spacing -1 px is the best of 60 renders (forward-model rmse 45.2 against 47.3 for wght 700 at 77 px and 47.8 for wght 760). A face that is not installed, such as the editing app's own, could still fit better (open for the owner).
- Owner decision (16 Nov 2026): Inter for the captions.

### [T02] Caption size is fixed: Inter at 76 px (x-height 38 px, cap/ascender top 52 px above the baseline at full-white ink), identical in both caption positions and every clip.

- Values: Fitted font size 76.0 px (p10-p90 74.7-77.2; per clip 74.7-77.1). x-height top 935 vs baseline 973 (seam) and 1236 vs 1274 (low): 38 px, p10 = p90 over 1264 groups. Ascender/cap ink top 921/1222 = 52 px above baseline.
- Evidence: n=1264 groups, 19 clips; clip01@7 'This might be', clip01@299 'this out.'; T_caption_metrics.csv, T_caption_anatomy.png
- Confidence: high
- Verified, confirmed (item 3): 76 px. The ink rows in this rule are the study's; the fitted alphabetic baseline is 2 px lower, 975 and 1276 ([T06]).

### [T03] Tighten caption spacing slightly: letter-spacing -0.013 em (about -1 px per letter pair at 76 px) and word spaces 0.05 em (about 4 px) narrower than Inter's default.

- Values: Per-glyph x offsets against Inter at letter-spacing 0: within-word step median -1.0 px (p25 -2, p75 0; n=480 pairs); extra word gap median -4.0 px (p25 -5, p75 -2; n=77 word gaps). Integer-pixel quantised.
- Evidence: n=59 lines; T_tracking.json, T_caption_font_scores_inter_sweep.csv (track_px_per_glyph)
- Confidence: medium: pixel-quantised offsets, single reference font
- Verified, confirmed (item 3): letter-spacing -1 px at 76 px.

### [T04] Caption text is pure white #FFFFFF, no gradient, no outline.

- Values: Glyph cores Y 235 Cb 128 Cr 128 -> calibrated RGB 255,255,255 (#FFFFFF) in 4 of 5 checked clips, #FEFEFE in clip19; a default ffmpeg PNG extraction reads 253 (2 levels low). 90th-percentile white luma 235-239 (median 237) on the first frame of 1210/1210 groups.
- Evidence: clip01@63, clip05@110, clip10@82, clip13@51, clip19@59; T_calibration_white.csv, T_caption_entry_exit.csv
- Confidence: high

### [T05] Every caption is one centred line on x = 540; never wrap to a second line.

- Values: Ink centre x median 540.0 (p10-p90 538.5-541.0, n=1264). 0 two-line captions in 20,881 frames (12 frames flagged a second centred line: the caption ink box merged with an adjacent white UI element on the same baseline, e.g. clip08@335-338, clip02@265-272). Ink width median 324.5 px (p10 191, p90 451, max 718 = 66 % of frame width); ink width ~ 24 + 33.2 px per character.
- Evidence: n=1264 groups; clip05@960-976 (widest, 4 words), clip16@53-91; T_caption_metrics.csv, T_caption_bands.png
- Confidence: high

### [T06] Use two fixed caption baselines: y = 975 when the caption sits on the panel/presenter seam, y = 1276 for full-frame inserts and full-height presenter shots (including the closing close-up).

- Values: Seam baseline 975 (n=460 groups, 7,225 frames = 36 % of caption frames); low baseline 1276 (n=804 groups, 12,732 frames = 64 %); 301 px apart; same in all 19 clips. Verification: fitted alphabetic baseline 1275.5-1275.75 in the low slot (median 1275.62), seam slot 975, ink cap-top rows 921 and 1222. Band-to-layout mapping read by eye from contact sheets and full frames.
- Evidence: clip01@7 (seam), clip08@779 and clip19@660 (low); T_caption_bands.png, T_caption_metrics.csv
- Confidence: high for the two baselines; medium for which layout uses which band (by eye, the layout analyst owns the mode labels)
- Verified, corrected (item 3): the study read baselines 973 and 1274 (p10 = p90), 2 px high; the layout note's 975 and 1276 hold.

### [T07] Chunk speech into 1-3 word captions, mostly 2 words, about 9 characters.

- Values: Words per group: 1 = 367 (28.6 %), 2 = 684 (53.3 %), 3 = 221 (17.2 %), 4 = 11 (0.9 %), 5 = 1. Characters incl. spaces: median 9, p10 5, p90 13, max 20. 1.82 groups per second per clip (1.54-2.14).
- Evidence: n=1284 clean groups (OCR matched to transcript), 19 clips; T_caption_groups.csv, T_caption_words_per_group.png, T_caption_chars_per_group.png
- Confidence: high
- Verified, confirmed (item 15): 1,301 groups (own OCR): 1/2/3/4+ words 30.0/53.7/15.0/1.3 %; characters median 9 (p10 5, p90 13).

### [T08] Always end a caption group after a word carrying. , ? or ! from the transcription.

- Values: Break after '.' 124/125, ',' 84/88, '?' 8/8 (word boundaries inside clean groups vs between them).
- Evidence: n=2281 word boundaries; T_caption_breaks.csv, T_caption_break_model.csv
- Confidence: high

### [T09] Otherwise fill greedily: add the next word while the group stays at 14 characters or less (never 17+), at most 3 words; pauses in the audio do not decide breaks.

- Values: No-punctuation boundaries (n=2060): break rate by characters if the next word joined: <=8: 7 %, 9-11: 25 %, 12-14: 54 %, 15-17: 97 %, >=18: 99 %. By words so far: 1: 22 %, 2: 70 %, 3: 94 %. Voice-band dip at breaks 20.6 dB vs 19.8 dB inside groups; silences > 50 ms below -30 dB: 0-17 per clip, longest 0.20 s.
- Evidence: T_caption_break_model.csv, T_caption_break_rate_vs_chars.png, T_caption_breaks.csv
- Confidence: medium: statistical threshold (12-14 characters is a coin flip), the tool's exact algorithm is unknown
- Verified, confirmed (item 15): more than 14 characters in 2.1 % of groups, more than 17 in 0.8 %.

### [T10] Show a group from the frame its first word starts until the next group replaces it; captions run back to back from frame 0 to the last frame.

- Values: Onset minus first-word start median +0.5 frames (p10 -1.8, p90 +4.2; transcript +-2 frames); zero-gap transitions 96.6 % of 1335; group end minus last-word end median +1.3 frames. Duration median 15 frames (0.50 s), p10 7 (0.23 s), p90 25 (0.83 s), max 60 frames at 29.97 fps. First caption on frame 0 in 19/19 clips, last caption on the last frame in 19/19; 98.5 % of all frames carry a caption (lower bound).
- Evidence: n=1284 groups; T_caption_onset_vs_word.png, T_caption_group_frames.png, T_caption_groups.csv
- Confidence: high
- Verified, confirmed (item 15): hold median 15 frames (p10 8, p90 25).

### [T11] Captions cut in and out: the whole group appears complete on one frame and is replaced on the next, with no fade, scale, slide or word-by-word build.

- Values: First frame vs middle frame: ink width ratio 1.000 (p1 0.997, p99 1.004), area ratio 1.000 (p1 0.980), white 237, vertical offset 0 px in 99.6 %; last frame identical (width ratio p1 0.997). 96.8 % of groups follow another caption on the very next frame. No frame shows a subset of a group's words.
- Evidence: n=1210 groups >= 6 frames, every frame; clip01@12-29, clip01@589-600, clip13@952-972; T_caption_entry_exit.csv, T_caption_hardcut_every_frame.png
- Confidence: high

### [T12] Keep the transcription's case: sentence case, proper nouns, 'I' and acronyms capitalised; never set a caption in all caps.

- Values: First letter lowercase 1051, uppercase 228, other 5. After a group ending. ? ! the next starts uppercase 127/178 (71 %); mid-sentence uppercase 84/1087 (names, 'I', products). All-caps tokens in clean groups: 12 = API (4), DMS, CV, two model names with version numbers, plus OCR fragments SO (2) and REA (2); one keyword echo outside the clean set (clip14@966-984 'FRAMES I'll').
- Evidence: n=1284 groups; T_caption_groups.csv
- Confidence: high

### [T13] Keep transcription punctuation in captions (. , ? ! apostrophes, %, $, hyphens); use no quotation marks, colons or ellipses in captions.

- Values: Group-final character: none 1015, '.' 181, ',' 72, '?' 11, '-' 3, '!' 1, '%' 1. All punctuation marks counted inside captions: '.' 187, apostrophe 74, ',' 74, '?' 11, '-' 5, '$' 2, '%' 1, '!' 1; 0 quotation marks, colons or ellipses.
- Evidence: n=1284 groups; T_caption_groups.csv
- Confidence: high

### [T14] Draw the caption plate tight around the ink: ink box + 16.4 px left and top, + 14.5 px right and bottom, so plate height is 85 px for lines without descenders and 102 px with them.

- Values: Medians over 1127 plates: pad left 16.4 (p10-p90 15.7-16.9), right 14.5 (13.9-15.5); top = ink top - 16.4 (p10-p90 16.4-17.6 with ascenders); bottom = baseline + 16.5 without descenders, descender bottom + 14.5 with. Plate top 904.6/1205.6 for ascender lines, 916.7/1217.9 for x-height-only lines. Plate centre x 539.0. Pads are measured to luma >= 226 ink (about 0.7 px inside the glyph outline).
- Evidence: clip01@7, clip01@299; T_caption_anatomy.png, T_caption_metrics.csv
- Confidence: high
- Verified, confirmed (item 2; the plate hugs the ink): pads to the white-ink box (luma > 200) left 15.65, top 15.8, right 13.3, bottom 14.0; height 84.86 (p10-p90 84.8-86.0) without a descender, 101.8 with; x-height-only lines 12.4 px lower; centre x 539.0. The 0.5 px difference from this rule comes from the ink threshold (luma >= 226 here). Build values: pads 15.7 left, 15.8 top, 13.3 right, 14.0 bottom.

### [T15] Round the plate corners with a fixed 19 px radius, whatever the plate height.

- Values: Circle fit per corner: median 18.9 px (p10 17.1, p90 20.1), fit rms 0.29 px; 85-px plates 19.1, 102-px plates 18.8.
- Evidence: n=2979 corners on 19 clips; T_plate_corner_radius.png
- Confidence: high
- Verified, confirmed (item 2): radius 18.25 px (p10 15.25, p90 19.75, n=371 corners). Build value: 19.

### [T16] Fill the plate with neutral grey #3F3F3F at 82 % opacity blended in linear light (no blur behind it); in a gamma-space renderer use rgba(70, 69, 70, 0.70) as the nearest match.

- Values: Edge pairs outside/inside the plate: linear-light fit opacity 0.823 (per clip 0.821-0.825), colour 0.0503 linear (8-bit 63), residual 0.76 levels. Gamma-space fit #464546 at 0.700 leaves 3.8 levels residual with a -6.7 to +4.5 level bias across backgrounds. Neutral: R/G/B gamma fits 70.6/68.5/69.4. Background edges stay sharp through the plate (by eye).
- Evidence: 157,383 pairs from 1164 plates, 19 clips; T_plate_opacity_fit.png, T_plate_fit.json
- Confidence: high
- Verified, confirmed (item 1): fill #403F3F (64,63,63) at opacity 0.823 in linear light, rms 1.5 levels, bias <= 0.3 levels in every background bin, per clip 0.821-0.828 in 19 of 19 (168,971 temporal pixel pairs). Gamma-space fit #484444 at 0.697 (rms 4.2, bias -4.5..+4.3). Build value: #3F3F3F at 0.823 in linear light; gamma-space fallback rgba(70,69,70,0.70).

### [T17] Give caption glyphs a hard black drop shadow: offset +2.75 px right, +2.5 px down, 2 px spread, Gaussian sigma 1.5 px, 100 % black, blended in linear light.

- Values: Model out = plate x (1 - s x blur(shift(dilate(glyph)))) fitted per line: dx median 2.75 (p10 2.0, p90 2.75), dy 2.5 (2.0-2.5), spread 2 px (2-3), sigma 1.5 (1.0-1.5), opacity 1.0 (p10 0.91), rms 0.014 linear.
- Evidence: n=30 lines on flat pale backgrounds; T_caption_shadow_fit.csv, T_shadow_fit.json, T_caption_anatomy.png
- Confidence: medium: model fit on 30 lines; the shadow also shifts the measured plate pads by about 2 px
- Verified, confirmed (item 4): beyond the glyphs' bottom and right edges the plate-relative brightness is 0.04 at +2 px, 0.10 at +3, 0.28 at +4, 0.50 at +5, 0.72 at +6, 0.88 at +7, 0.97 at +8 (10,184 bottom and 13,792 right edges on 36 lines); offset plus spread about 4.5 px, sigma about 1.5, opacity about 1. The shadow is near-black for about 3 px and fades out by 8 px.

### [T18] Do not emphasise words inside captions: no colour, weight, size, highlight or underline changes; the only emphasis device is the closing keyword.

- Values: Glyph white luma 235-239 on the first frame of 1210/1210 groups; x-height 38 px (p10-p90 38-39) over 1264 groups; plate pads stay at 14-17 px (p90 16.9), so no non-white word sits outside the white ink inside a plate.
- Evidence: T_caption_metrics.csv, T_caption_entry_exit.csv, T_caption_groups.csv
- Confidence: high

### [T19] End every video with the comment keyword in white all-caps serif, wrapped as “WORD" (curly U+201C opening quote, straight U+0022 closing quote).

- Values: 19/19 clips; keywords BLOCKS, XRAY, DMS, DEEPER, HIRE, AWARD, COURSE, GATES, SOUND, FLINT, MARK, STUDIO, TOKENS, FRAMES, CHEAP, DIRECT, SITES, API, RUN; the mismatched quote pair in 19/19. The keyword is the trigger word spoken after 'comment' (immediately after in 18/19; clip07 'comment, of course'), spelled as the trigger word, not as the transcript heard it (HIRE for 'higher', FRAMES for 'friends', XRAY for 'x-ray').
- Evidence: clip01@1196... clip19@1202; T_keyword_all19_final_frames.png, T_keyword_timing_geometry.csv
- Confidence: high
- Verified, confirmed (item 5): curly U+201C opening and straight U+0022 closing quote (by eye, 4 clips).

### [T20] Use a bold transitional serif for the keyword; the exact face is unresolved (closest installed: Georgia Bold, then Iowan Old Style Bold, Charter Bold).

- Values: Global soft IoU (glyphs touch) over 14 clean keywords: Georgia 700 0.694 (best on 3), Iowan Old Style 700 0.678 (2), Playfair Display 700 0.649 (3), STIX Two Text 700 0.642 (2), Charter 700 0.641 (4), Palatino 700 0.622, New York 700 0.611, Times New Roman 700 0.580, DM Serif Display 0.259. Best letter-spacing for Georgia -0.075 em.
- Evidence: n=14 clips (dark backgrounds); T_keyword_font_scores.csv, T_keyword_font_compare.png
- Confidence: low: no candidate is close (caption font reaches 0.88); the target looks lighter than Georgia Bold
- Verified, open (item 29, with item 5): no installed serif fits well. Soft IoU over 14 clean clips: Georgia Bold 0.611 (best on 5 of 14), PT Serif Bold 0.604 (3 of 14, OFL), Playfair Display Bold 0.597 (OFL), STIX Two Text Bold 0.588 (OFL), Times New Roman Bold 0.567, Charter Bold 0.564, Fraunces SuperSoft Bold 0.554, Iowan Bold 0.507, DM Serif Display 0.454.
- Owner decision (16 Nov 2026): PT Serif Bold (OFL), within 0.007 of Georgia Bold, which is not redistributable.

### [T21] Place the keyword centred on x = 540 with cap top near y = 1324 and letter baseline near y = 1448.5, sized by word length (cap height about 158 - 6.1 x letters, clamped to 109-140 px; width with the quotes about 373 + 73.5 x letters), with tight tracking so serifs touch.

- Values: Ink centre incl. quotes 537.5 (p10-p90 537.0-538.0, n=19). Cap top median 1324 (p10-p90 1314-1334). Verification (19 clips; size rule on 14): baseline 1448.5 (1423-1474), cap height 126.5 (109-140), width including quotes = 373 + 73.5 x letters (r 0.88), cap height = 158 - 6.1 x letters (r -0.69, residual sd 5.8 px). Clip18 'API' reads 164 px here, merged with clothing print. Quote marks 53 px tall, top 6 px above cap top, 13-27 px from the letters. Keyword cap top sits 23-48 px below the bottom of a no-descender caption plate (1290.5).
- Evidence: n=19 clips; T_keyword_timing_geometry.csv, T_keyword_all19_final_frames.png
- Confidence: medium: size varies per word and the size rule is a fit (r = -0.78)
- Verified, confirmed on position, corrected on the size rule (item 5). The study read baseline 1449 (1436-1474), cap height 126 (118-140), width 601-855 px (~381 + 72 x letters) and fitted cap height about 170 - 8.5 x letters (r = -0.78). Size per word is loose (r -0.69): use the width rule or the clamp (open for the owner).

### [T22] Cut the keyword in on the frame its word is spoken and hold it unchanged to the last frame; no entrance animation.

- Values: Onset minus spoken-keyword start median +0.8 frames (p10 -6.7, p90 +2.5; range -8.6 to +6.3; whisper +-2). First frame >= 0.94 of the final white area in 18/19 (clip19 0.83 over a white shirt), previous frame <= 0.06. Area p10 after onset >= 0.95 of final in 18/19 (clip19 0.60 over a white shirt). Hold 46-75 frames (median 58 = 1.94 s; clip18 126) at 29.97 fps.
- Evidence: n=19; e.g. clip13@967-978, clip10@813; T_keyword_onset_clip01.png... T_keyword_onset_clip19.png, T_keyword_timing_geometry.csv
- Confidence: high
- Verified, confirmed (item 5): onset minus spoken keyword +1.1 frames median (-6.6..+6.3, n=19); this note's +0.8 and the structure note's +1.4 are the same within the transcript error of +-2 frames. Hold 58 frames (46-126). First-frame area 0.965 of the area 3 frames later (18 of 19 at 0.92 or more; clip19 0.56 over a white shirt).

### [T23] Give the keyword a large soft black drop shadow: offset about 13 px right and down, 5 px spread, Gaussian sigma 4 px, about 97 % black, linear light.

- Values: Verification (6 light-background clips: clip01-05, clip19; grid fit of a dilated, shifted, blurred glyph mask): offset 12-14 px right and down, spread 4-6, sigma 4, opacity 0.95-1.0; medians 13 / 13 / spread 5 / sigma 4 / 0.97. Study fit against the frame before the keyword appears: clip01 (14,14,s4,sp4,0.976), clip02 (14,14,4,4,0.964), clip03 (14,12,4,4,0.987), clip04 (14,14,4,4,0.982); residual 3-10x lower than with no shadow.
- Evidence: n=4 light-shirt clips; T_kw_shadow.json, T_keyword_onset_clip13.png
- Confidence: medium: 4 clips; over the dark hoodies the shadow is invisible
- Verified, confirmed with a 1 px refinement (item 5): the study's rule was +14 px right and down with 4 px spread. The colour note's (5, 8) px shadow ([C16]) is rejected.

### [T24] Keep normal sans captions running above the keyword in the low band to the end; the CTA reads 'Comment <word>' in caption case, then a promise to send the link.

- Values: Captions on the last frame in 19/19, baseline 1276 (study read 1274; see [T06]). The group with 'comment' is capitalised in 15/19 ('comment' in clip01, 02, 05, 17); in 10/19 it is 'Comment <word>' as one group, in 9/19 'Comment' alone, then a group starting with the word. Keyword onset equals a caption group start in 8/19.
- Evidence: T_keyword_timing_geometry.csv (comment_caption_text, caption_group_starts_at_onset), T_caption_groups.csv
- Confidence: high

### [T25] Treat text inside the illustrations as its own role, sized by the prop, not by the caption scale: UI labels (median 20 px line), headings (42 px), display words (84 px) and big figures (92 px, up to 576 px).

- Values: OCR at 2 per second (1400 frames): text in 1117 frames (79.8 %), 10,835 lines after removing clothing print. UI labels < 34 px: 8150 lines, median 20 (p10 14, p90 31), dark on light 69 %. Headings 34-59 px: 2005 lines, median 42. Display words >= 60 px: 573 lines in 19 clips, median 84 (p90 152, max 400), light on dark 56 %. Display figures (numbers, prices, percents) >= 60 px: 107 lines in 15 clips, median 92 (p90 196, max 576). All caps: 14 % of headings and display words. Line centres mostly y 320-1170 (upper and middle frame).
- Evidence: T_illustration_text.csv, T_illustration_text_roles.csv, T_illustration_display_text.png
- Confidence: medium: OCR line-box heights at 2 fps; product marks and screenshots are mixed in

### [T26] Set big illustration figures (counts, prices, percents) in a heavy neo-grotesque with tight spacing, near-black on pale plates or white on dark, occasionally in the scene's accent colour.

- Values: By eye on the largest 30 display items: '100', '009', '$100', '$97', '$5', '90%'; ink near-black (#0E2x/#101x), white (#FEFx) or accent (#EA936C on 'clip08@45-75'). Line boxes 195-576 px for these examples.
- Evidence: clip06@570-585, clip08@45-75, clip18@750-795, clip11@420; T_illustration_display_text.png
- Confidence: low: read by eye; automatic font fit failed because counters and bars touch the digits

### [T27] Treat all caption and keyword constants as fixed for the whole corpus period (2026-10-29 to 2026-11-12): nothing drifts by date.

- Values: Per clip: seam baseline 975 and low baseline 1276 in 19/19 (study read 973/1274; see [T06]); plate height without descenders 84.9-85.5 px; plate opacity 0.821-0.825; caption font fit 74.7-77.1 px; keyword present 19/19.
- Evidence: T_caption_metrics.csv, T_plate_fit.json, T_keyword_timing_geometry.csv
- Confidence: high

## Constant and variable

CONSTANT (every clip, to the pixel or frame): caption font, 76 px size, white #FFFFFF, one centred line on x=540, baselines 975 and 1276 (corrected by verification, [T06]), plate pads 16.4/14.5 px (15.7/15.8/13.3/14.0 to the verifier's ink box, [T14]), plate heights 85/102 px, radius 19 px, plate #3F3F3F at 82 % linear-light, glyph shadow (+2.75,+2.5, spread 2, sigma 1.5), hard cuts for captions and keyword, captions from frame 0 to the last frame, break after. , ?, closing keyword with “..." quotes in 19/19. VARIABLE: words per group (1-3, by the 14-character soft cap and punctuation), group duration (7-25 frames p10-p90, set by speech rate), which baseline (by layout), caption case (by the transcription), keyword size (cap height 109-140 px, falls with word length) and its onset offset (-8.6 to +6.3 frames from the spoken word), illustration text size, colour and polarity (set by each prop).

## Open questions

- Keyword serif: no installed face fits well (best Georgia Bold, IoU 0.69). Rendering non-installed candidates (for example Source Serif 4 Semibold/Bold, Noto Serif Bold, Merriweather Bold, Lora Bold, Libre Caslon Text Bold, Tinos Bold) or the editing app's serif list against T_keyword_font_compare.png would decide. Owner decision (16 Nov 2026): PT Serif Bold ([T20]).
- Caption face: Inter is the best installed match (0.883) but sits 0.10 below the same-text ceiling (0.98). The editing tool's own caption face (a platform app's own caption face, none installed) could fit better; rendering it the same way would decide.
- Plate blending: the fit says linear-light compositing (residual 0.76 levels vs 3.8 in gamma space). If the Motus renderer blends in gamma space the rgba(70,69,70,0.70) fallback is off by up to 7 levels; a test render compared with T_plate_opacity_fit.png decides whether that matters.
- Keyword size: cap height falls with letter count (r = -0.78) but TOKENS (109 px) and COURSE (113.5 px) are smaller than the fit; it may be fitted to a width box or set by hand. More clips or the project file would decide. Verification: cap height = 158 - 6.1 x letters, r -0.69 ([T21]).
- Caption break algorithm: the soft 14-character cap with a 12-14 character coin-flip zone suggests an auto-caption tool with a pixel-width or duration limit; the exact rule is unknown.
- Which layout uses which caption baseline was read by eye; the layout analyst's per-frame mode labels would confirm the mapping (seam band 36 % of caption frames, low band 64 %).

Needs an eye or an ear:

- Look at T_caption_font_overlay.png and confirm the caption letterforms (t, y, a, g, R, numerals) match Inter.
- Look at T_keyword_font_compare.png and T_keyword_all19_final_frames.png and name the keyword serif.
- Watch the caption changes and the keyword cut-in at normal speed (T_caption_hardcut_every_frame.png, T_keyword_onset_clip13.png and the other onset strips) to confirm there is no one-frame fade or pop.
- Compare a test render of the plate (#3F3F3F at 82 % linear-light, 19 px radius, glyph shadow) over the presenter and over a pale panel with T_caption_anatomy.png.
- Nothing was listened to: keyword and caption timing use faster-whisper word times (about +-2 frames); a person should check by ear that the keyword lands on the spoken word in clip07 (-8.6 frames) and clip19 (-7.3 frames).
- Check by eye that no caption word is ever coloured or highlighted (sample T_caption_groups.csv rows across clips); the detector only sees full-white glyphs.
