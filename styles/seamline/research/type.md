# Type

Measured on the 30 in-style clips of the reference corpus (neutral ids clip01 to clip30, by publication date, 2026-03 to 2026-11). Evidence ids are `clipNN@frame` at the clip's own rate (23.976 or 24 fps); evidence files stay in the private study folder and are not part of this repository. Confidence is the analyst's.

## Summary

Measured on all 30 in-style clips (2,198 s). Every 12th frame (2 fps, 4,404 frames) of every clip was decoded at native resolution with the calibrated BT.709 limited-to-full conversion and read with Apple Vision OCR; every frame (52,701 frames) of the main caption band (y 900-1004) was decoded and stored as an ink mask for frame-accurate timing. 3,197 caption events were found and 2,868 of them were aligned to the faster-whisper word timings; 3,569 caption samples were measured for size, position, colour, plate and shadow. Fonts were identified by rendering open-licence candidates at the measured cap height and scoring them against binarised native crops (per-glyph IoU for the caption, 94 glyphs from 7 crops in 4 clips; whole-line IoU for titles, 6 lines from 5 clips). Titles, big words, emphasis styles and endings were classified by eye from native-resolution sheets and are marked as read by eye.

The running caption is a white 5x7-grid pixel monospace face (cap 7 units, glyph 5, advance 6), all caps, one line, centred on x=540 with its cap top at y=945 and baseline at y=974, cap height 30 px (26-34 by clip), advance 24.9 px. It shows about 2 words (median 10 characters, 99% <=16), breaks after punctuation (94% of punctuated words end a caption), cuts on with the first word and is replaced by the next caption on the following frame: no fade, no scale, no word-by-word reveal (frame-0 ink / frames 1-3 ink = 1.000, n=2,868). About a third of the clips put each caption on a translucent black rounded plate (pad 29 px, radius about 17 px, opacity 0.64-0.75); the rest use a hard 3 px drop shadow. Six clips from 2026-03-31 to 2026-07-06 used a heavy extended sans for the captions instead; none after. The closest open face for the caption is Monocraft SemiBold (same grid and advance); the original is unidentified.

Opening titles are typeset in 24 of 30 clips. The dominant title (14 clips) is a heavy extended grotesque in white caps, 1-3 lines centred over the lower part of the top footage, each line scaled to the same width (median width ratio 0.99), often with a small italic serif or script connector word (the / of / for / have) tucked into it (7 clips). The closest open face is Archivo at wdth 125 / wght 900. Five openings use a serif title instead, 6 include a brand wordmark, 5 have no title. Emphasis comes as whole-word replacements, not styling inside a caption: big heavy words over the full-frame face (15 seen, 7 clips), light italic or condensed serif words (10 seen, 5 clips), coloured heavy words (7 seen, 5 clips), and stretches of captions on a coloured plate (5 clips). The last caption is the sign-off (PEACE. in 10 clips, (THE) NEXT ONE. in 7).

## Rules

### T01. Set the running caption in a 5x7-grid pixel monospace: caps 7 units tall, glyphs 5 units wide, advance 6 units, 1-unit strokes, chamfered corners on C O G D B, M and W with a centre stroke, I with serifs, parentheses drawn as chevrons. Ship Monocraft SemiBold (OFL-1.1) as the open substitute; Pixelify Sans Regular (OFL) is the runner-up.

- Values: Unit 4.15 px (clip30, 3 crops: 4.145-4.157), 4.01 px (clip16), 4.31-4.51 px (clip01). Per-glyph similarity (shape IoU x (1 - proportion error)), 94 glyphs: Pixelify Sans Regular 0.632 (shape 0.664, proportion error 0.048), Monocraft SemiBold 0.632 (0.664, 0.048), Monocraft Bold 0.616, Chakra Petch SemiBold 0.604 (proportion error 0.103), Pixelify Sans Bold 0.601, Monocraft Regular 0.587, Departure Mono 0.587 (0.133), Jersey 10 0.573, VT323 0.555, Tiny5 0.551, Silkscreen 0.549, Bitcount Grid Single w500 0.533. Monocraft advance/cap = 0.833 vs reference 0.83-0.86; Pixelify has thick/thin stroke contrast the reference lacks. Original font unidentified (commercial or non-Google).
- Evidence: n=7 crops, 4 clips (clip30@1080, @168, @504, @312; clip16@600; clip01@396, @324). evidence/T01_glyph_sheet_reference_vs_top4.png, T01_caption_font_glyph_scores.json, T01_caption_font_word_scores.json, T01_overlay_caption_MonocraftSemiBold_clip30_1080.png, T01_overlay_caption_MonocraftSemiBold_clip07_336.png, T01_overlay_caption_PixelifySans_clip30_1080.png
- Confidence: medium (grid and proportions certain; exact original glyph set unknown, A/D corners differ in Monocraft)

### T02. Caption cap height 30 px (Monocraft font-size 37.5 px), advance 24.9 px, no extra letter-spacing; allow 26-34 px per clip but keep one size within a clip.

- Values: Per-clip median cap height over 24 pixel-font clips: 30 px in 14, 32 px in 4, 29 px in 2, 26 px in 2, 28 px in 1, 34 px in 1. Advance median 24.9 px (13 clips exactly 24.9), range 22.1-28.6. Cap height is constant inside a clip: p10-p90 of clean samples within 1 px in 15 of 26 clips; the wider spreads come from footage highlights touching the ink, not from size changes (montages show one size per clip).
- Evidence: n=24 clips, 2,579 caption samples. evidence/T02_T03_caption_metrics_per_clip.csv, T02_caption_montage_clips01-13.png, T02_caption_montage_clips14-23.png, T02_caption_montage_clips24-30_09-11_27-28.png
- Confidence: high

### T03. Place the caption as one centred line with its advance box centred on x=540 (ink centre lands at x=537.5), cap top at y=945 and baseline at y=974; keep it inside x 205-869.

- Values: Ink centre x median 537.5 (p10 533, p90 539); cap top median 945 (p10 944, p90 947); baseline median 974 (p10 972, p90 975). 90.9% of 3,197 caption events sit in this band; 9.1% sit elsewhere (y 450-1350) in 19 clips, where the seam has moved or over a full-frame shot. Ink width p50 246 px, p90 357, p99 434, max 665. Leftmost ink x=205, rightmost 869. Two stacked caption lines: 0 genuine cases in 3,843 samples (17 hits were centred footage text in clip27).
- Evidence: n=30 clips. evidence/T02_T03_caption_metrics_per_clip.csv; caption events table evidence/T06_T07_T08_caption_events.csv
- Confidence: high

### T04. Caption colour is pure white (#FFFFFF), the same for every word; only clip22 tints all captions cream (#F6F5CA) to match its pale yellow title.

- Values: Eroded-ink median per clip 246-255 on every channel (corpus median #FCFBFC); clip22 #F6F5CA. Non-white ink samples (max-min > 40): 40 of 3,569, mostly clip22. Calibration: caption white decodes to 250-252 (p99 255) with the tv-to-pc conversion vs 232-234 without range expansion (offset 18 levels).
- Evidence: n=30 clips, 3,569 samples. evidence/T02_T03_caption_metrics_per_clip.csv (ink_rgb_median); calibration numbers in numbers.json corpus.calibration_check
- Confidence: high

### T05. In clips without a plate, give the caption a hard black drop shadow straight down: offset (0, +3) px, about 1-2 px soft, darkest row near black.

- Values: Best shift of the ink mask explaining the dark pixels (dx, dy): (0,3) clip20, (0,4) clip20, (-1,3) clip26 x2, (-1,3) clip30 x2, (0,3) clip13 x2, (3,3) clip06; IoU 0.52-0.72. Profile under the glyph on bright sky (clip30@576, background L 180): rows +1..+4 below the baseline = 188, 69, 4, 130. Side darkening 20-30 levels left, 70 right. clip08 fits (5,5)/(5,4) with lower IoU (0.29-0.54).
- Evidence: n=11 fits in 6 clips plus 1 profile. evidence/T05_shadow_fits.json, T05_shadow_zoom_clip30_576.png
- Confidence: medium (offset consistent; blur and opacity read from few samples)

### T06. Decide the plate once per clip: in about a third of clips every caption sits on its own translucent black rounded plate; otherwise use no plate and the drop shadow.

- Values: Plate visible on >=70% of determinable samples (footage around the plate L>=50): clip01, 07, 09, 12, 16, 18, 19, 28, 29 (+ clip04 by eye) = 10 clips; mixed (17-44%): clip03, 21, 22 = 3; none (<15%): 17 clips including the 6 heavy-caption clips. No trend over time: plate clips run from 2026-03-11 to 2026-11-10. In plate clips the 'none' samples cluster on mid-dark footage, where the detector is weak.
- Evidence: n=30 clips, 3,569 samples. evidence/T02_T03_caption_metrics_per_clip.csv (plate columns, plate_mode)
- Confidence: medium (detector ratio rule; clip04 and the mixed clips need a look)

### T07. Plate geometry: black at 70% opacity (0.64-0.75), padding 29 px on all four sides of the ink, corner radius about 17 px; the plate hugs each caption and cuts with it.

- Values: Edge regression inside = (1-a)*outside + b: clip09@1260 1-a = 0.245/0.253/0.271 (R/G/B), b ~0, r>=0.92; clip07@336 1-a = 0.372/0.364/0.348, b ~-2, r 0.97-0.98; clip01@396 0.15-0.22 (r 0.59-0.74, unreliable). Padding: clip07 29/29/29/29, clip09 28/29/29/28, clip01 19/19/19/19 (early clip). Corner radius estimate 17.1 px (clip07, clip09; 4 corners), 10.2 px (clip01). Plate width changes with each caption (clip07 RUN ON A vs GEMMA 3 TO 4).
- Evidence: n=3 clean plates (10 attempted; 7 failed on busy footage). evidence/T04_plate_geometry.json, T_plate_clip07_336.png, T_plate_clip09_1260.png, T_plate_clip01_396.png, T09_every_frame_caption_cut_clip07_30-40.png
- Confidence: medium (3 clips; padding/radius differ in the oldest clip)

### T08. Break the transcript into caption groups of 1-3 words (median 2), ending a group after any word that carries . , ? ! or :, and keeping groups to 16 characters or fewer (never more than 25).

- Values: OCR events (n=2,868): words per caption 1: 1,015, 2: 1,362, 3: 437, 4: 53, 5: 1 (median 2); characters median 10, p10 5, p90 14, 99% <=16, max 25. Including the short captions the 2 fps OCR misses: 1.96 words per caption. Punctuated words at a caption end 661, inside a caption 43 (94%). Characters by group size: 1 word median 7 (p90 11), 2 words 10 (13), 3 words 12 (15), 4 words 15. Pause-based breaking could not be measured: the ASR word timings abut (median pause 0.0 s).
- Evidence: n=30 clips. evidence/T06_T07_T08_caption_events.csv, T07_ocr_gaps_short_captions.csv; numbers.json caption_grouping_summary
- Confidence: high for counts; medium for the break rule (char limit is soft, not strict)

### T09. Each caption cuts on, complete and at full size, on the frame of its first word and stays until the frame before the next caption: no fade, slide, scale, typewriter or per-word reveal, and no blank frames between captions.

- Values: Ink in frame 0 / median of frames 1-3: median 1.000, p10 0.996 (n=2,868). Next caption in - this caption out = 1 frame in 1,831 of 1,897 adjacent pairs with no missed caption between (96.5%); 2 frames 31, 3 frames 35. Ink count stays constant across the hold (clip30 frames 116-126: 2,576 -> 2,414 only as the background changes).
- Evidence: n=30 clips (every frame of the caption band). evidence/T09_every_frame_caption_cut_clip30_113-130.png, T09_every_frame_caption_cut_clip13_50-58.png, T09_every_frame_caption_cut_clip07_30-40.png, T06_T07_T08_caption_events.csv (ink_first4, next_in_minus_out)
- Confidence: high

### T10. Time the caption to speech: in on the first word's onset (median 1 frame after the ASR word start), out with the last word (median 1 frame after its end); a caption holds about 12 frames (0.5 s).

- Values: Onset vs ASR word start: median +1.2 frames, p10 -1.5, p90 +4.6. Out vs last word end: median +1.0, p10 -1.0, p90 +4.7. Hold of OCR-sampled captions: median 12 frames, p10 6, p90 20, max 60 (biased long because the 2 fps OCR misses short ones); captions found only in the every-frame masks between OCR events: median 5 frames, p10 2, p90 11 (n=1,171).
- Evidence: n=2,868 aligned events, 30 clips. evidence/T06_T07_T08_caption_events.csv, T07_ocr_gaps_short_captions.csv
- Confidence: medium (ASR word timings are unverified, not forced-aligned; offsets are within ASR error)

### T11. Captions are all capitals, keep the transcript's punctuation and apostrophes, and write numbers as digits.

- Values: Upper case 99.97% of 23,855 caption letters. Final punctuation transcript -> caption: . -> . 280, , -> . 183, , -> , 57, , -> none 63, ? -> ? 10; 51 of the OCR periods carry a descender (commas misread) so commas and periods both appear. Apostrophes kept in 165 of 175 events whose words have one. 45 captions contain digits (ALMOST 14, 33 DAYS OF, GEMMA 3 TO 4).
- Evidence: n=2,868 events, 30 clips. evidence/T06_T07_T08_caption_events.csv; numbers.json caption_grouping_summary
- Confidence: high for case; medium for punctuation (the editor's own ASR punctuates differently from faster-whisper)

### T12. Variant (retired): from 2026-03-31 to 2026-07-06, six clips set the running caption in the heavy extended title face instead of the pixel font: white caps, cap height 28 px, about 33.6 px per character, same position, same drop shadow, same cut timing. Do not use it as the default.

- Values: Heavy-caption clips: clip06 (03-31), clip10 (04-08), clip11 (04-11), clip13 (05-25), clip15 (06-08), clip17 (07-06); pixel-font share in them 2.5-33% (short words misclassify). OCR advance median 34.6 px vs 24.9 for the pixel font. All 13 clips after 2026-07-06 use the pixel font; the pixel font is used across the whole period (24 clips, 2026-03-11 to 2026-11-15). Shadow fit (0,3) clip13, (3,3) clip06.
- Evidence: n=30 clips. evidence/T02_T03_caption_metrics_per_clip.csv (font_class_mono_share, heavy columns), T02_caption_montage_clips01-13.png (clip06, clip13 rows), T02_caption_montage_clips14-23.png (clip15, clip17 rows)
- Confidence: high

### T13. Set the main title in a heavy extended grotesque, white, all caps. Ship Archivo (OFL-1.1) at wdth 125 / wght 900 with tracking 0 to +0.06 em; Anybody at wdth 130 / wght 900 needs no tracking.

- Values: Similarity (width-fit IoU x (1 - |width ratio - 1|)), 6 lines: Archivo wdth125 wght900 0.702 (width-fit IoU 0.728, natural width ratio 0.964), Anybody wdth130 wght900 0.689 (0.701, 1.017), Archivo wdth125 wght800 0.659, Unbounded 900 0.629 (0.744, 0.846), Archivo Black 0.589 (0.804), Dela Gothic One 0.588, Anybody wdth150 0.586 (1.175), Mona Sans wdth125 wght900 0.553, Rubik Mono One 0.551, Montserrat 900 0.537 (0.735), Inter 900 0.501, Syne 800 0.488, Lexend Giga 0.474, Krona One 0.465, Lexend Zetta 0.413. Archivo tracking needed: +0.059 em (THE NEW SIRI), +0.035 (FRONTIER MODEL), 0.000 (CYBERSECURITY), -0.034 (GOOGLE LAUNCHES NEW). Original unidentified.
- Evidence: n=6 lines, 5 clips (clip15@24, clip24@24 x2, clip09@24, clip27@24, clip19@24). evidence/T13_title_font_scores.json, T13_title_font_sheet.png, T13_overlay_title_ArchivoExpandedBlack_clip15_48.png, T13_overlay_title_ArchivoExpandedBlack_clip24_24.png
- Confidence: medium (good proportional match, glyph details differ)

### T14. Open with a typeset title in most clips: 1-3 lines (usually 2), centred on x=540, over the lower part of the top footage, ending at or just above the caption band. Use the heavy extended face in about half of all clips.

- Values: READ BY EYE: typeset title in 24 of 30 clips (incl. 4 with a brand wordmark beside it), wordmark only 1 (clip21), none 5 (clip01, 05, 10, 18, 20). Heavy extended title lines in 14 clips (02, 03, 04, 09, 13, 14, 15, 16, 17, 19, 24, 26, 27, 28). Main-line centres x 530-544 (OCR, 21 clips; clip07's small lines and clip29's distressed title are off-centre). Title lines lie between y 616 and 1000; the caption runs under or inside it at y 945. Heavy titles by main-line count: 1 (clip15), 2 (11 clips), 3 (clip13, clip28).
- Evidence: n=30 clips. evidence/T12_opening_title_table.csv, T12_title_line_boxes.json, T12_title_crops_clips01-10.jpg, T12_title_crops_clips11-20.jpg, T12_title_crops_clips21-30.jpg, T12_opening_frames_clips01-10.jpg, T12_opening_frames_clips11-20.jpg, T12_opening_frames_clips21-30.jpg
- Confidence: high for presence and placement (read by eye, 30 clips); medium for the class labels

### T15. Scale each heavy title line separately so that all main lines have the same width (fit-to-width), 730-950 px wide; the shorter phrase gets the smaller cap height. Keep line gaps tight: 0-23 px.

- Values: Width ratio of the two main lines (OCR): 0.979 (clip02), 0.992 (03), 0.996 (04), 0.984 (09), 0.979 (13, VIDEO/EDITING), 1.000 (14), 0.962 (16), 0.990 (17, MARKETING/CHANGED), 0.997 (19), 0.990 (24), 0.996 (26), 0.904 (27), 0.996 (28); median 0.99. Cap heights differ to achieve it: clip24 35 vs 50 px, clip14 OCR 87 vs 47, clip19 118 vs 66. Line ink heights 35-118 px. Ink gaps between lines: clip09 0, clip03 8, clip27 8, clip19 13, clip22 18, clip24 23.
- Evidence: n=13 heavy titles (widths), 7 clips (ink). evidence/T12_title_line_boxes.json; numbers.json opening_titles.two_line_width_match and line_ink_measures
- Confidence: high

### T16. Tuck a small connector word (the, of, for, have, the future of) into the heavy title in a thin italic serif or script, lower case, overlapping or beside a heavy line; use Instrument Serif Italic as the open stand-in.

- Values: READ BY EYE: connector in 7 of the 16 heavy/italic-heavy titles: clip02 The, clip03 of..., clip08 for (script), clip12 the future of (script, over a condensed line), clip13 OF, clip16 of, clip17 have (+ THE RULES OF). Same device inside later big words: clip17@300 has FOREVER, clip19@1200 FUTURE of VIBE CODING. Connector size about 0.4-0.7x the heavy cap height. Font not scored (too few clean pixels).
- Evidence: n=30 clips. evidence/T12_title_crops_clips01-10.jpg, T12_title_crops_clips11-20.jpg, T20_big_words_montage.jpg, T12_opening_title_table.csv
- Confidence: medium (read by eye)

### T17. Optional extra title lines: a small kicker above (GOOGLE'S, THE RULES OF) or a subtitle below (THE FUTURE OF WORK, (SAY HI TO YOUR 24/7 DIGITAL EMPLOYEE)) in italic condensed sans caps or light sans caps, about 0.3-0.5x the main cap height.

- Values: READ BY EYE: 6 clips: clip04 subtitle OCR h 39 / w 750 under lines of h 66-69; clip07 THE MOST POWERFUL / IN THE WORLD letter-spaced small caps (h 67 / 37); clip17 THE RULES OF h 50 over 88; clip19 THE FUTURE OF WORK h 39 under 87-126; clip25 CRAZIEST TECH DEMO OF ALL TIME? italic serif h 47; clip26 GOOGLE'S h 47 over 73-76.
- Evidence: n=6 clips. evidence/T12_title_line_boxes.json, T12_title_crops_clips01-10.jpg, T12_title_crops_clips11-20.jpg, T12_title_crops_clips21-30.jpg
- Confidence: medium

### T18. Title colour is white (#FCFCFC measured, use #FFFFFF); a clip may switch its title and captions to one pale yellow (#FAF6B7) as its colour theme.

- Values: Eroded title ink: clip15 (252,252,252), clip24 (250,252,251), clip09 (253,252,253), clip03 (253,252,253), clip27 (252,252,252), clip19 (253,253,253); clip22 (250,246,183) with captions #F6F5CA. No stroke or plate on titles; a soft shadow is not measurable on these crops.
- Evidence: n=7 clips. numbers.json opening_titles.line_ink_measures; evidence/T12_title_crops_clips21-30.jpg (clip22)
- Confidence: high for colour; low for absence of title shadow

### T19. A minority of openings (5 of 30) use a serif title instead: condensed serif caps (AN URGENT WARNING:, HISTORY), a sentence-case serif (How to implement AI), or a large italic serif (Open-Source Model). Use Instrument Serif Regular/Italic as the stand-in.

- Values: Serif titles: clip06, clip07, clip23, clip25 (subtitle), clip30. Candidate scores are weak: best width-fit IoU per line clip07 DM Serif Display 0.394, clip30 Playfair Display 0.552 (width ratio 1.197), clip23 Playfair Display 0.483 (1.20), clip06 Instrument Serif 0.391 (0.82); Instrument Serif is the only candidate as condensed as the reference (width ratio 0.88-0.90). The serif faces differ between clips.
- Evidence: n=4 lines, 4 clips. evidence/T16_serif_font_scores.json, T16_serif_font_sheet.png, T12_title_crops_clips01-10.jpg, T12_title_crops_clips21-30.jpg
- Confidence: low (faces unidentified, several faces)

### T20. Emphasise by replacing the caption with a big word, never by styling a word inside a caption: (a) the heavy title face in white, 600-940 px wide, 1-2 lines, over the full-frame face; (b) a light italic or condensed serif word in white, 2-4x the caption cap height; (c) a heavy word in lime, yellow or pale yellow.

- Values: READ BY EYE on 45 candidate frames: (a) 15 seen in 7 clips (clip13 WHATEVER, FLAWLESS.; clip14 DYNAMIC WORKFLOWS; clip16 START BUILDING; clip17 FOREVER; clip19 MERGING CHATGPT, POWERFUL, CODEX, YOU AN, FUTURE of VIBE CODING, APP; clip26 GENIE; clip28 IN THE, PEACE); (b) 10 seen in 5 clips (clip01 USING, SKILL.MD, ASK; clip07 $500, DOES, OPEN; clip18 without, INCREDIBLE; clip24 FRONTIER; clip30 STARSHIP), OCR box height 73-153 px vs 40 for captions; (c) 7 seen in 5 clips (clip03 CINEMA, clip05 SYSTEM, clip08 AI, clip22 NEWEST/GPT-6/ASTRA, clip12 SKILLS on a blue plate). Counts are lower bounds. Inside captions: no per-word colour, underline, highlight or size change seen (non-white caption ink 40 of 3,569 samples, clip22 cream).
- Evidence: n=30 clips scanned, 45 frames inspected. evidence/T20_big_words_montage.jpg, T20_big_word_ocr_events.json
- Confidence: medium (read by eye; detection by OCR is noisy)

### T21. For a stretch of several captions, swap the black plate for a solid coloured plate whose colour comes from the footage on screen (coral, amber, mint, navy).

- Values: READ BY EYE + plate-ring colour: clip02 frames 444-588 #EE4646 (13 samples, about 6 s); clip09 516-684 and 1032-1176, #8D6B2E then #8A5313 (about 7 s and 6 s); clip14 720-780 #5C987F; clip17 984-1200 #CC6C54 (18 samples, about 9 s, heavy captions); clip29 264-348 #2E536E. 5 of 30 clips.
- Evidence: n=5 clips. evidence/T12_coloured_plates_montage.jpg; numbers.json caption_per_clip.*.coloured_plate_samples
- Confidence: low (trigger and colour choice inferred by eye)

### T22. End on the sign-off as the last caption (PEACE. or CATCH YOU IN THE NEXT ONE.); add a typeset call to action only occasionally (COMMENT "BUILD" in the heavy face over the full-frame face).

- Values: Last OCR caption: PEACE (incl. PEACE., PEACE!, ONE. PEACE., PIECE.) in 10 clips; (THE) NEXT ONE. in 5; other phrase endings in 15. Typeset CTA: clip16 COMMENT "BUILD" (2 heavy lines over the face), clip29 FOLLOW the source (hand-drawn red, special). Brand end cards: clip19 ChatGPT logo, clip21 ANTHROPIC wordmark, clip24 product card.
- Evidence: n=30 clips. evidence/T22_endings_montage.jpg; numbers.json endings
- Confidence: medium (last-caption text from OCR; CTA read by eye)

### T23. Treat brand marks as pictures, not type: show the real wordmark (ANTHROPIC, SPACEX, ROADSTER, NETFLIX, ChatGPT, Claude, Google) at or near the title position instead of setting the name in a font.

- Values: READ BY EYE: brand wordmarks at the opening in 6 clips (clip04 Claude, clip19 ChatGPT, clip21 ANTHROPIC, clip23 NETFLIX, clip25 ROADSTER, clip30 SPACEX); product names in serif (Fable 5.1 clip21, Fable 5.2 clip29) follow the product's own brand type.
- Evidence: n=30 clips. evidence/T12_opening_frames_clips01-10.jpg, T12_opening_frames_clips11-20.jpg, T12_opening_frames_clips21-30.jpg, T12_opening_title_table.csv
- Confidence: medium (read by eye)

### T24. Labels are rare: only use them for side-by-side comparisons, as black bold sans on a white translucent pill at the top of each half.

- Values: READ BY EYE: 1 clip (clip20, SEEDANCE 2.0 / SEEDANCE 2.5 at y 61, OCR h 48-51, w 349 each). No source labels, lower thirds or name tags found in the 2 fps OCR of the other 29 clips outside footage.
- Evidence: n=30 clips (OCR scan), 1 example. evidence/T12_opening_frames_clips11-20.jpg (clip20 row)
- Confidence: low (seen once; may belong to the source comparison video)

## Constant and variable

CONSTANT: caption face class within a clip (pixel monospace 5x7 grid, advance 6 units) in 24 of 30 clips; all caps (99.97%); one line; centred on x=540 (ink centre 537.5); main band cap top 945 / baseline 974 (91% of events); white ink; hard cut on and off with no blank frames between captions (96.5% abut) and no per-word reveal; 1-4 words; punctuation ends a group (94%); title text white caps, centred, lines fit to equal width (median ratio 0.99); emphasis is a whole-word replacement, never styling inside a caption. VARIABLE: caption cap height per clip 26-34 px (30 in 14 of 24); plate on (10 clips) / off (17) / mixed (3), chosen per clip with no time trend; plate padding 19 px (clip01) vs 29 px (clip07, clip09), radius 10 vs 17 px; caption face pixel vs heavy extended (6 clips, 2026-03-31 to 2026-07-06 only - a change over time: none of the 13 clips after 2026-07-06 uses it); caption position moves off the main band in 19 clips (9% of events); colour theme (clip22 cream/pale yellow); coloured plate stretches (5 clips); title family (heavy extended 14, serif 5, italic heavy 1, condensed 2, distressed 1, none 5) and line count 1-3; title cap height 35-118 px depending on phrase length; connector word present in 7 titles.

## Open questions

- Original caption and title fonts are unidentified (both look commercial). A designer or a font-identification service on evidence/T01_glyph_sheet_reference_vs_top4.png and the title crops would settle it; the open substitutes are chosen on grid and proportion.
- What triggers a coloured caption plate stretch (rule T21): footage colour, a sponsor/brand section, or a topic change? Needs watching clips 02, 09, 14, 17, 29 with sound.
- Why some clips use the plate and others the shadow (T06): no date trend and only a weak link to bright footage in mixed clips (03, 21, 22). Possibly the editor's template per recording session; would need the editor's project files or more clips.
- Pause-based group breaks could not be measured: faster-whisper word timings abut (median pause 0.0 s). Forced alignment (or listening) would show whether a long pause also forces a new caption.
- Exact hold of short captions: the 2 fps OCR misses about 1,171 captions (median 5 frames) found only as ink changes; their text is unknown, so words per caption is estimated (1.96) rather than counted for them.
- Commas vs periods: in 183 events the transcript has a comma where the caption OCR reads a period (51 confirmed commas by descender); whether the editor writes periods for commas needs a look at native crops.

## For a person to check

- Look at evidence/T01_glyph_sheet_reference_vs_top4.png and T01_overlay_caption_MonocraftSemiBold_clip30_1080.png: is Monocraft SemiBold close enough, or should the pack draw the reference A and D (chamfered tops) itself?
- Look at evidence/T13_overlay_title_ArchivoExpandedBlack_clip15_48.png and T13_title_font_sheet.png: Archivo Expanded Black vs Anybody 130 for the title face.
- Look at clip04 (720p) and clips 03, 21, 22 in evidence/T02_caption_montage_clips01-13.png and T02_caption_montage_clips14-23.png to confirm their plate mode (T06).
- Watch clips 02, 09, 14, 17, 29 around the frames in evidence/T12_coloured_plates_montage.jpg to see what starts and ends a coloured plate stretch (T21).
- Watch a heavy-caption clip (clip13) and a pixel-caption clip (clip30) at full speed to confirm the caption cut feels hard with no hidden 1-frame flash or glitch (T09); the every-frame strips show none.
- Check the italic-serif emphasis words (clip01@12, clip30@36, clip18@72) in evidence/T20_big_words_montage.jpg: are they a separate emphasis caption style or part of the title system?
- Nothing was listened to: whether a big word lands on a stressed word in the voice needs listening.
