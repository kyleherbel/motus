# Type and captions: measured record (T01-T27)

Part of the Editorial Proof study; read `README.md` first for the corpus, the method and the limits. STYLE.md cites these rules by id, for example [T01]. Frames are at 30 fps (f); positions are pixels on the 1080 x 1920 frame; evidence is given as clip id @ frame (see README.md, "Evidence ids").

**Sample.** 1,924 caption groups (4,301 words) in all 33 reels, re-measured at 30 fps at native resolution; font identification by overlay against installed candidates; emphasis classified on 710 words and checked by eye on 84 crops.

**Method notes.** Font fits use soft intersection-over-union of glyph masks. Word classes for emphasis were assigned with hand-built word lists, not a tagger, so the class shares are approximate. Colours are default ffmpeg decodes (about 2 levels low; see colour C01).

**Confidence.** high = measured on many instances and consistent; medium = measured but on fewer instances or with a judgement step; low = one to four instances, or inferred.

## Rules

### T01 - The bold sans is Inter SemiBold (600) in its Display optical size (font-optical-sizing:auto), tracked about -0.01 em. It is the face for hook line 1, interstitial headings and all captions.

- Confidence: high
- Numbers: Soft IoU vs native crops: Inter 600 = 0.822 mean (min 0.777), fitted tracking -0.010 em (-0.016..-0.007). Next: Inter 700 0.804; Inter 600 forced to text optical size (opsz 14) 0.774; Helvetica Neue 700 0.774; SF Pro Text 600 0.759; SF Pro Display 600 0.756; Arial 700 0.756; Geist 600 0.701; Avenir/Montserrat/Poppins 0.55-0.64. Caption x-height/ascender measured 0.731 (n=223); Display cut predicts 0.724, text cut 0.765. Inter ratios: cap = ascender 0.7275 em, x-height 0.515 em, descender 0.22 em.
- Evidence: 8 hook first lines, 8 reels: clip39@75, clip40@75, clip36@75, clip31@75, clip08@75, clip22@75, clip21@75, clip30@75.

### T02 - A second Inter weight, Bold (700), is used for card name labels, big-number digits and big-number labels.

- Confidence: high
- Numbers: Name label: IoU 0.912 at 700 vs 0.852 at 600 (n=15 frames, 5 reels). Digits: 0.96/0.98/0.98/0.96 at 700 vs 0.88-0.89 at 600 and 0.87-0.89 at 800. Big-number label: 0.845 at 700 vs 0.776 at 600 (n=12, 11 reels). Captions: 600 wins on light (0.797 vs 0.781), 700 wins narrowly on dark (0.809 vs 0.786) because white on dark blooms; treat captions as 600.
- Evidence: digits '232' clip24@541, '17' clip38@690, '66' clip31@565, '94' clip33@333; labels clip39@177, clip31@177, clip10@192, clip24@444, clip20@414.

### T03 - The italic serif (strip line, emphasised caption words, number-block word, closing 'comment') is a bold, narrow-fitting Garamond/Granjon-genre italic that is NOT installed on this machine and could not be identified. Use a stand-in until it is sourced.

- Confidence: low
- Numbers: Best installed: Playfair Display 800/900 italic, soft IoU 0.571 (min 0.340), needs -0.049 em tracking; with lining figures 0.591; with scaleX(0.94) 0.602. Others: Charter 900 0.542, Iowan 900 0.537, Hoefler Text 900 0.531 (0.595 on a 5-target subset), EB Garamond 800 0.478, Instrument Serif 0.389. True face measured: italic shear tan 0.225-0.25 (n=484 words); x-height/ascender 0.70; lining figures with flat-topped 3; Th ligature; h with inward-curled leg (OCR reads 'Tbese', 'Montb'); looped k; curled-entry v; descending f. Likely true fonts (untested): ITC Garamond Bold (Condensed) Italic, ITC Galliard Bold Italic, Adobe Garamond Pro Bold Italic, Adobe Caslon Pro Bold Italic. Free stand-ins: Playfair Display 800 italic + lnum at -0.04 em; EB Garamond 800 italic.
- Evidence: 9 strip lines, 9 reels @75: clip39, clip40, clip37, clip30, clip14, clip09, clip13, clip26, clip10., multi

### T04 - Hook line 1 is Inter 600, Title Case, near-black, centred, at one standard size that shrinks only when the line would be too wide.

- Confidence: high
- Numbers: font-size 86.4 px median; 17 of 26 reels at 86.1-86.8; the 2 newest at 90.4-90.7; long titles 73.0-84.8 (e.g. 24 characters = 73.0, 22 = 82.7). Ink width p10/p50/p90 = 637/771/889 px, max 906, so fit to about 890 px. Tracking -0.009 em (-0.014..-0.006). Colour #101010. Cap height 62.9 px at 86.4 px.
- Evidence: 26 reels @75, e.g. clip39@75 (90.4), clip22@75 (86.4), clip36@75 (82.7), clip30@75 (73.0).

### T05 - Hook line 2 is the italic serif in white on a saturated blue strip, Title Case, visibly larger than line 1.

- Confidence: medium
- Numbers: Text #fcfbfc on strip #0083fc (lime reels: #d2eb1a strip, dark text). Serif ascender height 83 px in 7 of 9 no-descender titles (range 83-93); 1.32 x line 1's cap height. Small strips flanked by icons: 55-64 px (5 reels). Text ascender top 27 px below strip top (17 of 26). Strip top 31.3 px (26-34) below line 1's baseline. Strip heights cluster at 134, 154 and 169 px. Playfair-equivalent font-size about 102 px.
- Evidence: 26 reels @75: e.g. clip10@75, clip22@75, clip21@75, clip18@75 (83 px); clip36@75, clip33@75 (small strips)

### T06 - Caption text is Inter 600 at one of a few size presets chosen per scene; the size is constant within a scene and changes between scenes of the same reel.

- Confidence: high
- Numbers: Presets by ascender height: 65-69 px = 91-92 px font (light 47%, dark 41%); 70-75 px = 97-103 px (30%, 22%); 76-80 px = 105-110 px (13%, 23%); 81-90 px = 111-123 px (2%, 13%). Direct fits: light median 98.8 px (90.5-102.2, n=14 reels), dark 101.3 px (90.9-111.2, n=16 reels). Tracking -0.006 em on light, -0.013 em on dark. Over full-frame video the median ascender is 83 px = 114 px font (n=72).
- Evidence: n=464 light, 504 dark, 72 video groups, 33 reels. Same reel two sizes: clip39@204 (asc 75) vs clip39@1105 (asc 67).

### T07 - A caption is always a single centred line of 1-4 words, never more than 20 characters.

- Confidence: high
- Numbers: Words per group: 1 = 20.5%, 2 = 42.8%, 3 = 29.5%, 4 = 7.3%, never 5; mean 2.24. Characters: median 11, p95 17, max 20. Ink width: median 464 px, p95 711, max 913. Ink centre x = 541 (p5-p95 532.6-543.5). Two-line caption groups: 0 in 11,065 caption frames.
- Evidence: n=1,924 groups, 33 reels; longest: 'whiteboard explainer' clip28, 'to Wikipedia traffic' clip26; widest 'themselves smashing' clip07 (913 px)

### T08 - Groups are short phrases: always break at spoken punctuation or a pause, otherwise break before conjunctions, prepositions and pronouns so that groups open with a function word and close on a content word.

- Confidence: medium
- Numbers: Boundary after ASR punctuation 96.5% (n=433); after a pause of 100 ms or more 97.1% (n=276); with neither 36.2% (n=3,603). 54.7% of groups start with a function word, 14.7% end with one. Top openers: and 180, you 76, to 66, the 62, your 62. Only 16% of boundaries are forced by the 20-character ceiling. Rule-based chunker (max 4 words, soft 18 chars, break lists in build_spec): precision 0.715, recall 0.711, F1 0.713, exact-group match 49%, size mix 21/41/31/7 % vs observed 21/43/29/7 %.
- Evidence: 4,036 adjacent word pairs, 1,722 boundaries, 33 reels; e.g. clip39@3-141: 'use these 5 | free GitHub repos | to save |...'

### T09 - The line is laid out complete and centred, then words are revealed one at a time at their final positions; earlier words never move.

- Confidence: high
- Numbers: First-frame horizontal offset of an arriving word: median -0.1 px (p10-p90 -3.5..+2.5), n=3,390. Example: 'free' sits at x=161 while 'GitHub' and 'repos' are still absent.
- Evidence: clip39@20-46 (strip), n=3,390 arrivals over 33 reels.

### T10 - Word entrance in light mode: fade plus a small rise and a trace of blur over 5-6 frames, no scale. This is the 'grey then dark' effect.

- Confidence: high
- Numbers: Opacity per frame from first visible frame: 0.31 (0.30-0.33), 0.60 (0.57-0.63), 0.83 (0.80-0.86), 0.92 (0.89-0.94), 0.98, 1.00. translateY: +5.4 px (4.8-6.3), +2.2, +1.0, 0. Blur sigma 2.0, 1.0, 0 px. Scale 1.00. Word colour per frame: #9d9fa1, #5f6062, #3a3c3d, #242628, #141618, then #101113. Visibly grey for 2 frames (67 ms); settled at frame 5 (167 ms). Blue words: 0.38/0.70/0.91/0.95/0.99/1.00, colours #a4b4e6, #6892ef, #3485f6 to #0a81f3. Equivalent tween: opacity 0 to 1 over 6 frames with ease 1-(1-t)^2.3, y from about 11 px over 4 frames, starting one frame before first visibility.
- Evidence: n=1,055 base + 221 accent arrivals, 33 reels (moment method); 28 direct fits on 17 reels agree within 0.02. clip39@20-25, @38-43, @48-53

### T11 - Word entrance on dark and video backdrops uses the same rise but reads brighter sooner; treat it as a 3-4 frame fade.

- Confidence: medium
- Numbers: Dark: apparent opacity 0.62 (0.43-0.82), 0.88 (0.63-0.95), 0.98, 1.00; y +5.0, +2.0, +1.0, 0; blur 1.5, 1.0, 0; colours #aeb6c0, #d6dde4, #e7eef4, #edf4fb (n=916). First-frame opacity depends on backdrop: 0.78 where backdrop grey is under 25 (n=303), 0.50 at 50-100 (n=452). Video: 0.36, 0.71, 0.97, 0.99; y +5.9, +2.4, +1.1, 0 (n=194).
- Evidence: 33 reels; clip39@258-262, @1337-1347.

### T12 - There is no exit animation and no minimum hold: the whole group is cut on one frame when its last word has been spoken, and the next group starts 0-1 frames later.

- Confidence: high
- Numbers: Gap from clear to next group's first word: 1 frame 52.3%, 0 frames 28.7%, 2-6 frames 12.4% (n=1,811). On-screen duration: median 14 frames (IQR 10-19, p95 27). Hold after the last word's onset: median 8 frames (IQR 5-11). Clear minus last word's ASR end: +2.6 frames (p10-p90 -2.8..+7.6); +2.9 when a pause follows (n=272).
- Evidence: n=1,883 groups, 33 reels; clip39@46 full, @47 empty, @48 next group

### T13 - Each word appears when it is spoken, about 2 frames after the whisper word start; spacing between words follows the speech, not a fixed interval.

- Confidence: medium
- Numbers: Onset minus ASR start: median +2.2 frames (+73 ms), IQR -0.2..+4.6, p5-p95 -5.4..+9.2 (n=4,144). First word of a group +2.6, later words +2.0. Per-reel medians -0.6..+5.4. Word-to-word interval: caption median 5.0 frames vs ASR 5.4; median absolute difference 1.6 frames; r=0.55; 19% of consecutive words arrive 2 frames or less apart.
- Evidence: 33 reels; ASR is faster-whisper large-v3-turbo word timing, not forced alignment

### T14 - About one caption group in three carries emphasis, and it is nearly always a single word, most often the last one.

- Confidence: high
- Numbers: Groups with emphasis: 31.9% overall (613 of 1,924); per reel median 32.6%, range 18.9%-53.8%. Words emphasised: 18.2% (710 of 3,891). Emphasised words per emphasised group: one 77.3% (442), two 21.3% (122), three 1.4% (8). Position: last 53.8%, first 18.3%, middle 16.1%, single-word group 11.8%.
- Evidence: 33 reels, light and dark modes., multi

### T15 - There are exactly three emphasis styles inside a caption line: italic serif in the accent colour, sans in the accent colour, and italic serif in the base text colour.

- Confidence: high
- Numbers: Italic serif + accent 59.6% (423); sans + accent 27.5% (195); italic serif + base 13.0% (92). Classifier checked by eye on 84 word crops: 82 correct, both errors were serif words labelled sans. Drift over time: the 15 newest reels use sans + accent about as often as serif + accent (clip37 14 vs 6, clip26 13 vs 6); older blue reels are serif-dominant (clip23 1 vs 27, clip18 1 vs 19). Gameplay reel: italic serif in base colour only (19 of 20).
- Evidence: 710 words, 33 reels; clip39@30 'GitHub' serif+accent, @19 '5' sans+accent, @344 'DeepSeek' serif+base.

### T16 - What gets emphasised: key nouns first, then brand or product names, adjectives and numbers. Numbers and prices take sans + accent; brands take italic serif + accent.

- Confidence: medium
- Numbers: 710 emphasised words: key noun 311 (43.8%), brand/product/proper name 135 (19.0%), adjective 93 (13.1%), number 69 (9.7%), verb 41 (5.8%), absolute/quantifier 28 (3.9%), adverb 15 (2.1%), function/other 11 (1.5%), price 7 (1.0%). Numbers + prices in sans + accent: 61 of 76 (80%). Brands in italic serif + accent: 103 of 135 (76%). Key nouns in italic serif: 257 of 311. Most emphasised words: Claude 20, free 19, every 15, Code 11.
- Evidence: 33 reels, light and dark modes; digits, $ and capitalised words classified automatically, lower-case words by hand-built word lists

### T17 - Emphasis never changes size or baseline: the serif word is sized so its ascender matches the Inter cap height of the same line.

- Confidence: high
- Numbers: Serif ascender / sans ascender in the same group: 1.012 (IQR 0.99-1.015, n=61). Serif x-height / sans x-height: 0.936 (n=8). Baseline difference serif minus sans: +1 px (IQR 0-1, n=140). For stand-ins: Playfair Display at 0.90 em of the Inter size, EB Garamond at 1.01 em.
- Evidence: 61 mixed groups over light and dark modes, e.g. clip39@30 'free GitHub', @320 'from Kimi'

### T18 - Caption colours are fixed per mode; the accent is one blue on light and two lighter blues on dark, with no gradient inside caption words.

- Confidence: high
- Numbers: Light: text #101113, accent #1086ef for both sans and serif (p10-p90 #0d83ed-#1786f3; ffmpeg-decoded #0a81f3), n=279. Dark: text #eff5fc (n=1,447), sans accent #54a8f0 (#4ba5ec-#62acf3, n=98), serif accent #92c8f3 (p10 #60abed, n=195). Video: text #fdfbfa. Top and bottom halves of words differ by 3 levels or less. Lime family on dark: #ddfb4f. Uncertainty +-3 levels codec, up to +-6 between decoders.
- Evidence: 29 blue reels, cv2 decode medians of ink-core pixels; clip39@42, @266, @320

### T19 - Caption text is normalised: all lower case except proper nouns and acronyms, commas and full stops removed, question marks, apostrophes, hyphens, digits and currency or percent signs kept.

- Confidence: high
- Numbers: Lower-case initial: 94.3% of 4,301 words. Sentence-initial words lower-cased: 170 of 188 (the rest are proper nouns). ASR commas kept 0 of 329; full stops 0 of 172; question marks 11 of 11. Contractions kept (it's 38, it'll 30, you're 9; 118 words). Hyphenated compounds kept (21 words: open-source, step-by-step, vibe-coded). Digit words 57 ('5', '$500', '100%', '23k', '2.5'); thousands commas kept in 40,000 / 32,000 / 160,000 / 13,000 / 10,000, dropped once in '$1000'. The word 'one' stays a word 27 of 27. Capitals: Claude 43, AI 35, Code 20, GitHub 11.
- Evidence: 33 reels; clip39@18 'use these 5' (ASR 'Use these five'), @87 'over $1000' (ASR '$1,000')

### T20 - Caption vertical position is fixed per layout mode: a constant baseline in dark mode, a card-dependent one in light mode, a looser one over video.

- Confidence: high
- Numbers: Dark: baseline y = 1442 in 17 of 33 reels (13 of the 15 newest); others 1422-1436; older reels 1454-1496. Light: 1086-1100 in the 15 newest reels (1088 in 5, 1094-1096 in 5), older reels 1016-1080; moves 4-10 px between scenes in one reel (clip39 1088, 1094, 1092, 1097). Video: 1360-1492, mostly 1376-1444. Gameplay variant: 944 light, 1386 dark. Always centred on x=540.
- Evidence: 33 reels, modal baseline per reel and mode; clip39@40, @1110, @1345.

### T21 - Legibility devices: none on light; a soft dark shadow without stroke on dark; a stronger soft halo over video. No box, bar or outline anywhere.

- Confidence: medium
- Numbers: Dark mode, backdrop darkening relative to far backdrop (median grey 66) by distance from glyph edge: -16 at 2 px, -11 at 4 px, -6.5 at 6 px, -4.8 at 8 px, -3 at 10 px, -1.5 at 12 px, 0 at 16 px (n=16 groups, 16 reels). Suggested CSS: text-shadow 0 0 10px rgba(0,0,0,.35). Video halo not measurable over moving footage; estimate 0 2px 14px rgba(0,0,0,.55). Light mode shows only anti-aliasing (-13 at 2 px, 0 by 18 px).
- Evidence: 16 dark groups from 16 reels, 8 light groups; clip39@255-270, @1336-1351

### T22 - Numbered interstitial type: an Inter 600 heading, the number as a white italic serif word in a blue block, and an Inter 700 name label under the card.

- Confidence: medium
- Numbers: Heading ('Repo Number', 'Plugin Number', 'Tool Number'): Inter 600, 87.2 px (86.5-87.2), tracking -0.015 em. Number block: #0083fc, 132 px high, about 26 px side padding, serif ascender 78-83 px in #fcfbfc (same size as the hook strip). Name label: Inter 700, 104-106 px, tracking -0.023 em (-0.030..-0.019), baseline about y=1300; 84 px for the 19-character 'Google Maps Scraper'.
- Evidence: 15 frames, 5 listicle reels: clip39@177/405/645, clip31@177/483/735, clip24@189/444/804, clip20@414/594/843, clip10@192/468/669.

### T23 - Progress counter: a small dark pill at the card's top-right reading 'N / M', numerator white and the rest grey.

- Confidence: medium
- Numbers: Digit height 16 px = about 22 px Inter Bold (weight inferred). Pill 124 x 42 px, colour #1e1e1e, fully rounded. Example position x 840-964, y 269-311. Lime variant: lime pill #d6eb1b with dark text, digits 19-24 px high.
- Evidence: 8 frames, 4 reels: clip39@234/675, clip24@225/678, clip10@228/777, clip11@585/597.

### T24 - Big-number blocks: Inter 700 digits at about 200 px with a white-to-blue vertical gradient and blue glow, over an Inter 700 label at about 60 px.

- Confidence: medium
- Numbers: Digits: 200-210 px typical, range 188-300 ('17' on a full card = 299), tracking -0.002 em (clean fits -0.02..+0.01). Label: 60.6 px median (47.9-78.4), tracking -0.026 em (-0.030..-0.022), white on a dark slate panel or grey on a white panel. Some blocks have no panel ('$100', '99%').
- Evidence: 10 digit fits on 9 reels, 12 label fits on 11 reels: clip24@541 '232 agents available', clip39@114 '$1,000+ a month', clip38@382 '24.3k GitHub stars', clip30@624 '20+ pro hacking tools'.

### T25 - Every reel ends with a stacked 'punch' block: an italic serif lead-in ('comment') partly hidden behind a large Inter keyword in Title Case inside curly quotes, with a white-to-colour gradient and coloured glow. The same block is used mid-video.

- Confidence: medium
- Numbers: 12 newest reels: lead-in x-height 51 px, word 'comment' 361 px wide, baseline y=1422; keyword Inter 700 (weight inferred) 104-108 px, baseline y=1491, so the lead-in baseline sits about 7 px below the keyword's cap top. Earlier scales: lead-in x-height 57 px (9 reels) or 67 px (7 reels); keyword 131-138 px (7 reels) or 144-147 px (8 reels). Keyword lower-part colours: blue #5dcffa-#6dd9fa, yellow #fbfb5e, green #65fb75, orange #fba45a, cyan #5ffbf7, lime #c3fb50. Acronyms are Title Cased: 'Api', 'Seo', 'Chatgpt'. Mid-video uses: 'completely / free', 'it's called / Hallmark'.
- Evidence: 33 of 33 reels end with it; lead-in measured alone on 32 reels (e.g. clip39@1392, clip40@906), keyword on 31 (e.g. clip34@2169 'Design', clip27@1111 'Client'); mid-video clip27@183, clip34@201.

### T26 - No caption is shown while a numbered interstitial is on screen; the heading, number block and name label carry those words, and captions resume with the next phrase.

- Confidence: medium
- Numbers: 'The first is OpenCode,...' appears as heading 'Repo Number' + 'One' + label 'OpenCode' (frames 147-183), then the caption 'a free' starts at frame 180. Same pattern at each of the numbered items in the 5 listicle reels.
- Evidence: clip39@147-183, @372-410; clip31@123-180; clip24@153-192; clip20@357-417; clip10@162-195

### T27 - Captions follow the intended script rather than the raw ASR, so product names must be corrected before captioning.

- Confidence: medium
- Numbers: 'Claude Code' is shown where ASR heard 'cloud code'; 'DeepSeek' for 'DeepSeq'; 'open source' for 'open-source'; 'top-coding' kept hyphenated. Brand casing is preserved (ChatGPT, GitHub, OpenAI, SEMrush, ElevenLabs).
- Evidence: clip39@218, @344, @201, @280, @420

## Constant versus variable

**Constant across reels (core style):** two families only, Inter (600 for titles and running text, 700 for labels, numbers and the closing keyword) plus one bold italic serif for emphasis. Captions are always one centred line, lower case, without commas or full stops, 1-4 words, 20 characters at most, with words revealed in place one at a time. The word entrance (about 5.4 px rise, six-frame fade 0.31/0.60/0.83/0.92/0.98/1.0, no scale) and the hard-cut exit do not vary. Exactly three emphasis styles, never a size or baseline change. Colours: text #101113 on light and #eff5fc on dark; accent #1086ef on light, #54a8f0 (sans) and #92c8f3 (serif) on dark; strip and number block #0083fc. Dark-mode caption baseline y=1442 in the current reels. Hook line 1 at 86.4 px, interstitial heading 87 px, name label 104-106 px, big-number digits about 200 px. Every reel ends with the stacked 'comment' + keyword block.

**Variable per video or per scene:** caption size preset (92, about 100, about 106, 111-123 px) changes between scenes; light-mode caption baseline follows the card (1086-1100 now, 1016-1080 in older reels) and the video-mode baseline floats (1376-1444). Which words are emphasised (19%-54% of groups per reel) and the serif-to-sans mix (newer reels use far more sans + accent). Hook line 1 shrinks to fit (73-91 px); strip height (134/154/169 px) and small icon-flanked strips. Accent family (blue by default, lime for the sponsor reels) and the closing keyword colour (blue, yellow, green, orange, cyan, lime, brand-driven). Punch-block scale by era (keyword 105, 137 or 145 px). Interstitials, counters and name labels appear only in the 5 listicle reels; big-number blocks only where there is a statistic.

## Disagreements with other studies

- Caption word entrance: first visible frame at opacity 0.31 here, 0.395 in motion (M07) and 0.39 in colour (C08); visible rise 5.4 px here against motion's model of a +10 px start that includes an invisible pre-roll. The tables reproduce the same pixels.
- Caption onset after the ASR word start: +2.2 frames here (n=4,144), +3.0 frames in motion (first words of 31 reels only).
- Accent hexes differ from the calibrated colour study by decode: light #1086ef here vs #0484FB (C04); dark sans #54a8f0 vs #2A9AFB and dark serif #92c8f3 vs #84C5FA (C05). Calibrated values are built.
- Strip height clusters 134/154/169 px here (T05) against 132-141 px in layout (L05) and hook (H07).
- The italic serif is unidentified: Playfair Display 800 italic scores best among installed faces here; the build ships EB Garamond italic as a stand-in.

## Open questions

- What is the true italic serif? Nothing installed scores above 0.60 soft IoU.
- Why does the same word entrance read brighter sooner on dark backdrops (first frame 0.78 on near-black, 0.50 on mid-grey, 0.31 on light)? Probably how the fade is composited, but not established.
- Are the caption size presets (92/100/106/112+ px) a deliberate per-scene choice or inherited from a scaled scene container? The layout analyst's scene scale would settle it.
- The starting y offset of the entrance before the first visible frame is inferred at 10-12 px; only the visible frames (5.4, 2.2, 1.0, 0) are measured.
- Is the light-mode caption baseline a fixed offset from the card's bottom edge or the midpoint between card and presenter panel? Depends on the layout dimension.
- Beyond 'numbers go sans, brands go serif', is there a rule for choosing sans + accent versus serif + accent on ordinary nouns and adjectives, or is it editor's taste that shifted over the month?
- The lime variant's accent on the light canvas could not be sampled reliably (low luminance contrast); only the dark-mode lime #ddfb4f is measured.

## To check by eye or ear

- Identify the italic serif by eye. Compare and multi against ITC Garamond Bold (Condensed) Italic, ITC Galliard Bold Italic, Adobe Garamond Pro Bold Italic and Adobe Caslon Pro Bold Italic, then source it under a licence. Until then the build ships EB Garamond italic (OFL) as the stand-in. It scores below Playfair Display 800 italic on soft IoU (0.478 against 0.571, [T03]) but is closer by eye: Playfair has visibly more stroke contrast and a ball-terminal T. It is set at 1.01 em of the Inter size ([T17]).
- Closing-keyword and counter-badge weights are assumed to be Inter 700 by analogy; neither was fitted because glow and overlap break the mask.
- Dark-mode shadow CSS (0 0 10px rgba(0,0,0,.35)) and the video halo are estimates from a darkening profile; check against a side-by-side render.
- The +2-frame caption lead is relative to whisper word starts, which are noisy by a few frames. If the build uses a forced aligner, check by ear whether 0-1 frames is the right lead.
- Lower-case emphasised words were sorted into noun/adjective/verb classes with hand-built word lists, not a tagger; the category shares for those classes are approximate.
- Interstitial, counter and name-label numbers rest on 5 reels (3-4 for the counter).
