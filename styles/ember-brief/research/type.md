# Type

Type was measured on all 11 in-style clips (clip29-clip39, 12,791 frames, every frame decoded twice through a calibrated BT.709 limited-to-full conversion; the white card at clip29@240 reads 255 calibrated and 253 uncalibrated). Captions were tracked on every frame in both caption positions, segmented into 853 groups (1,655 words), read with Apple Vision OCR on one settled frame per group and aligned to the machine transcripts. The opening title (43 lines), the call to action (11 clips), numbered headings (8), big figures (19 samples) and upper-case labels (2) were located with a 2 fps OCR pass and measured on native-resolution frames.

Main findings. One geometric sans family carries every role, in three weights. It is not installed on this machine: the best installed overlay scores IoU 0.71 on captions where a true match scores 0.92-0.94, so the family name (Outfit is the first candidate) is unverified. Captions are one centred line of 2 words (94 %) or 1 word at a sentence end (6 %), cap height 53.55 px, baseline y=984 over the presenter and y=1504 on full-height graphics, white #F9F8F5 with the spoken word in orange #FE6B1A. Groups and highlights change as hard cuts on single frames; there is no fade, slide, scale or weight change anywhere in 768 measured group changes. Each caption sits on a dark rounded plate. The title is 4 upper-case lines, 2 light then 2 heavy, in a fixed box from y=594 to y=936 with per-video sizes. The call to action is a fixed light 'Comment' line over a 116 px heavy quoted keyword.

Not done: nothing was listened to or watched in playback; speech timing comes from unverified machine transcripts (+-2 frames). No font was downloaded, so no candidate outside the installed set was overlaid and tracking is not given in em. Text inside captured sources, interface replicas, chips and the dialogue lines of the clip30 audio demo were not measured. Easing curves were not fitted (the caption travel is given as a table). OCR text has a few I/l errors; counts are unaffected.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [T01] Set every text role (title, captions, headings, figures, call to action, labels) in one geometric sans family. It is not installed on the study machine: first test Outfit (OFL), then League Spartan and Jost. Do not ship an installed stand-in without a person's approval.

- Values: Overlay score (soft IoU / NCC; a true match scores 0.92-0.94 / 0.98-0.99 in the validation). Captions, 12 crops, 95 installed candidates: Avenir Next Bold 0.706 / 0.789, SF Pro Rounded Bold 0.704, SF Pro Display Bold 0.702, Inter 700 0.695, Futura Bold 0.644 (rank 22). Title light lines (10): Avenir Next Medium 0.717, SF Pro Rounded Medium 0.711, SF Pro Display Medium 0.709. Title heavy lines (10): Avenir Next Bold 0.828, Montserrat 800 0.814, Seravek Bold 0.805. Headings (5, 38 candidates): Inter 900 0.735. Figures (8): Montserrat 700 0.783. CTA label (3): Avenir Next Medium 0.799. CTA keyword (5): Montserrat 800 0.783. Glyph features seen: single-storey a and g; t is a plain cross; y straight tail; j with left hook; R straight leg; G with bar, no spur; 1 with flag, closed 4, flat-base 2; x-height/cap 0.69; ascender 1.027 x cap; descender 0.29 x cap; even uppercase widths; curly quotes.
- Evidence: n=11 clips, 55 crops fitted., (scorer_validation), (for example clip29@279, clip36@136, clip38@415).
- Confidence: medium: 'no installed font matches' and 'one family' are high (all roles, 11 clips); the name Outfit is from glyph features only, not overlaid (font not installed, nothing downloaded)
- Verified, confirmed: Outfit. Soft IoU median by role: caption 0.972 (n=22 crops, 8 clips), light title 0.972 (22, 11 clips), heavy title 0.984 (21, 11), heading 0.984 (8, 3 clips), figure 0.987 (8, 4 clips), CTA label 0.971 (11), CTA keyword 0.986 (11); NCC 0.996-0.999; lowest single crop 0.963 (the two clip33 figures fitted with tabular digits). League Spartan 0.71-0.86, Jost 0.67-0.83. In headless Chrome with rounded tokens 0.956-0.990. Error +-0.01 between crops. Build value: Outfit (variable font, OFL), wght 400 / 600 / 800.

### [T02] Use three weights, chosen by stem thickness over cap height: captions 0.18, light title lines and the CTA label 0.14, heavy title lines, headings, figures and the CTA keyword 0.25.

- Values: Captions: vertical stems mode 10 px (9 px 64,109 runs, 10 px 77,923 runs), about 9.6 px on a 53.55 px cap = 0.18. Light title lines 0.138 (0.130-0.148, n=22 lines). CTA label 9 px stems = 0.14 (n=11). Heavy title lines 0.255 (0.244-0.265, n=21). Headings 0.250 (0.246-0.265, n=8). Figures 0.249 (p10 0.243, p90 0.298, n=19). CTA keyword 0.252 (n=10). Same measure on installed fonts: Montserrat 500/600/700/800 = 0.127/0.182/0.218/0.272, Inter 500/600/800 = 0.144/0.180/0.236, Avenir Next Medium/Demi/Bold = 0.127/0.180/0.236. So roughly 500, 600 and 800 on those scales. Thin strokes (7-11 px) carry +-1 px at this bitrate.
- Evidence: n=768 caption groups (all clips), 43 title lines, 50 role items..
- Confidence: high for the three ratios; medium for the mapping to named weights of the real font (not installed)
- Verified, confirmed: Fitted wght: captions 610 (600-610, n=22), light title lines 410 (400-410, n=22), CTA label 410, heavy title lines 810 (800-810, n=21), headings 810, figures 800 (800-810), CTA keyword 800. At exactly 600 / 400 / 800 the scores are 0.971 / 0.970 and 0.966 / 0.984, 0.983, 0.989, 0.986. Outfit stem/cap at 400 / 600 / 800: 0.130-0.135 / 0.186-0.193 / 0.245-0.252. Error +-10 wght. Build value: wght 600 (captions), 400 (light title lines, the word Comment), 800 (heavy title lines, headings, figures, CTA keyword).

### [T03] Caption text: one size everywhere. Cap height 53.55 px, x-height 36.85 px, ascender 55.0 px, descender 15.63 px. Fit the font size so the cap height is 53.55 px (76.5 px if the cap height is 0.70 em).

- Values: Sub-pixel 50 % alpha edges on the left stem of the first glyph. Cap height 53.55 (p10 53.42, p90 53.64, n=40 captions starting with a flat capital). Ascender 55.00 (54.98-55.06, n=46). x-height 36.85 (n=55). Descender of p 15.63 below the baseline (n=20). No caption is scaled down: ink top rows fall on the ascender/cap rows or the x-height row in 851 of 853 captions (2 tracker artefacts).
- Evidence: , (clip29@209), (tops, bottoms).
- Confidence: high
- Verified, confirmed: cap 53.55 px (p10 53.47, p90 53.65, n=403 stem columns, per clip 53.52-53.59, 11 clips); x-height 36.79 px (n=8,398, per clip 36.77-36.81); ascender 54.99 px (n=4,639, per clip 54.98-55.00); descender 15.54 px (n=905). Error +-0.1 px. By registration of whole captions the font size is 75.88 px (75.7-76.0, n=22), which is a 53.34 px cap. Build value: font-size 76 px (cap 53.43 px, x 36.71 px by the font metrics).

### [T04] Caption baseline: y=984 while the presenter panel is on screen, y=1504 when the graphic takes the full height. Nothing else.

- Values: Baseline edge 984.02 (984.00-984.03, n=26 captions) and 1504.00 (n=14). Last ink row 983 or 984 in 340 of 342 flat-bottomed split captions, 1503/1504 in 184 of 187 full-layout captions. 7,483 caption frames at 984, 3,809 at 1504. Cap top 930.46 / 1450.46, ascender top 929.0 / 1449.0.
- Evidence: n=853 captions, 11 clips. (columns zone, top_row, bottom_row).
- Confidence: high
- Verified, confirmed: 984.01 (p10 983.97, p90 984.07, n=11,663 stem columns, per clip 984.01-984.02) and 1503.99 (p10 1503.94, p90 1504.03, n=6,261, per clip 1503.98-1504.00). Registration of whole captions: 983.97 (n=8) and 1503.97 (n=22). Ink centroid: 963.2 (p10 961.1, p90 965.1, n=518 groups) and 1483.0 (p10 1480.9, p90 1485.0, n=252). Error +-0.1 px. Build value: baseline y = 984 (split), 1504 (full height); 520 px apart.

### [T05] Captions are a single line, centred on x=540. Never wrap, never shrink.

- Values: Ink centre x median 540.0 (p10 539.0, p90 541.5, min 533.5, max 544.0, n=787 captions of 6+ frames). Lines per caption: 1 in 853 of 853. Ink width median 296 px (p10 174, p90 437, max 703 px for a 20-character pair).
- Evidence: (centre_x, width_px). Widest: clip34@103, clip38@358.
- Confidence: high
- Verified, confirmed: Text box centre (trailing letter-spacing included) 540.00 (p10 539.94, p90 540.09, sd 0.13, n=459 captions). Ink centre 540.45 (p10 539.2, p90 541.8, sd 0.95). Build value: centre the text box on x=540.

### [T06] Caption group = 2 words. A single word is allowed only as the last group of a sentence. Never 3.

- Values: 802 of 853 groups have 2 words (94.0 %), 51 have 1 (6.0 %), 0 have 3 or more. 1,655 words. Characters per group including the space: median 9, p10 6, p90 12, min 2, max 20.
- Evidence: n=853 groups, all 11 clips. (n_words, n_chars).
- Confidence: high
- Verified, confirmed: 842 groups of 3 or more frames in 11 clips: 793 two words (94.2 %), 49 one word (5.8 %), 0 three or more. One-word groups per clip: 2 to 7. Build value: 2 words per group; 1 word only where a segment has an odd word left.

### [T07] A group ends where the sentence ends, not at a pause and not at a comma. Chunk each sentence into pairs from its first word; an odd sentence leaves one word alone at the end.

- Values: 80 of 80 transcript sentence ends fall on a group boundary (43 after a 2-word group, 37 after a 1-word group). 0 of 802 pairs contain a sentence end; 41 pairs contain a comma. 37 of 51 one-word groups sit at a transcript sentence end; the other 14 sit where the machine transcript has no full stop (9 are followed by a capitalised caption word). Audio pause at the boundary (speech band, longest quiet run): after 1-word groups median 160 ms (n=44), after 2-word groups 60 ms (n=797), between the two words of a pair 50 ms (n=785); a pause of 150 ms or more occurs at 8.5 % of 2-word group ends and 7.0 % of in-pair gaps, so no pause threshold reproduces the grouping.
- Evidence: (ends_sentence, inner_sentence_break, inner_comma). Examples clip29@193, clip33@496, clip30@1611.
- Confidence: high for the pair rule; medium for the cause of the 14 unexplained single words
- Verified, confirmed: 77 of 77 transcript sentence ends inside the captioned speech fall on a group end (44 after a pair, 33 after a single word); 0 inside a pair; 40 pairs have a comma between their words. Of the 49 single words, 43 close a sentence or the clip (33 by the transcript full stop, 10 by reading the context where the transcript has none). 6 do not: 2 open a sentence (clip30@1611 "As", clip35@925 "And"), 4 sit inside one (clip29@523, clip32@845, clip33@496, clip35@1213). Build value: chunk each transcript segment (sentence) into pairs from its first word; a leftover word stands alone.

### [T08] A group appears on the frame its first word starts and stays until the next group replaces it. No gap between groups, also through pauses.

- Values: 829 of 842 consecutive group pairs are contiguous (0 empty frames). 12 gaps of 1-5 frames are tracker losses while the caption travels during a layout change. 1 gap of 453 frames is a third-party audio demo (clip30@112-564). Group start is 2.2 frames after the ASR start of its first word (p10 -0.4, p90 +5.4, n=849; ASR timing is +-2 frames). Group length median 13 frames (p10 6, p90 21, min 1, max 50). After its last word stops being highlighted a group stays 1 frame (median; p90 6, max 15, n=851).
- Evidence: (first, last, gap_before_fr, start_lag_fr, stay_after_last_hl_fr).
- Confidence: high for contiguity and durations; medium for the lag against speech (machine timings)

### [T09] Exactly one word is orange: the word being spoken. It turns orange on the frame the word starts and white when it ends. Between words and after the last word, all words are white.

- Values: 75.7 % of 11,292 caption frames show one orange word; 24 % show none. Orange share of visible word-frames 39.0 %. 1,618 of 1,655 words are highlighted at some point (37 short words never are). Word 1 is orange on the group's first frame in 826 of 845 groups (97.8 %). Last frame: all white 462 (54.7 %), word 2 orange 376 (44.5 %). Highlight length median 4 frames per word (p10 2, p90 10, max 42, n=1,618). Highlight on is 2.0 frames after the ASR word start (n=1,608), off is 1.0 frame after the ASR word end. White gap between word 1 off and word 2 on: median 0, p90 4 frames. Two tokens orange together on 57 of 10,912 frames (18 captions).
- Evidence: (column hl: one character per frame), (clip29@567, clip29@239, clip34@400, clip39@231).
- Confidence: high
- Verified, confirmed: 11,145 settled caption frames (371.5 s, 11 clips, every frame): none 24.4 % (per clip 21.9-26.0), one 75.1 % (71.9-78.1), two 0.52 % (58 frames in 18 captions: 14 hand-overs of 1-2 frames, "Grok Bot" 10 frames and "Real SFX" 24 frames where one spoken token is two words on screen, 2 others of 3-4 frames). 39 of 1,635 words are never orange. Every highlight is one unbroken run. Word 1 is orange on the first frame of 818 of 842 groups. Last frame of a group: all white 462, word 2 orange 369. Build value: one word orange from its start frame to its end frame; all white otherwise.
- Verified, confirmed: Orange on: +2.0 frames after the transcript word start (mean +2.2, p10 -0.4, p90 +5.0, n=1,500 words). First white frame: +1.0 after the word end (p10 -1.2, p90 +3.2). Highlight length median 5 frames (p10 2, p90 10); white gap between the two words of a pair: median 0, p90 4 frames. Error: the transcript is +-2 frames. Build value: highlight on at the word start frame, off at the word end frame; no deliberate offset.

### [T10] The highlight is a colour swap only, on one frame. No tween, no weight change, no size change, no bar, no underline.

- Values: Word-frames with a colour between white and orange: 0 of 21,156. Ink box of a word while orange against the same word while white: identical in 730 and within 1 px in 1,360 of 1,382 words, largest shift 2 px. Ink pixel count orange/white 0.973 (p5 0.947, p95 1.011; the threshold reads orange edges 3 % thinner).
- Evidence: n=1,382 words in 2-word groups, all clips..
- Confidence: high

### [T11] Caption colours: white #F9F8F5, active word #FE6B1A. Same in every clip.

- Values: Calibrated decode (BT.709 limited to full; white card reads 255 calibrated, 253 uncalibrated at clip29@240). White 249.3, 247.9, 245.1 (sd 0.5, 0.3, 0.7; n=12,879 word-frames). Orange 253.5, 106.9, 26.5 (sd 0.8, 0.3, 0.9; n=8,277). Per-clip means differ by at most 0.4 levels. Measured on glyph cores eroded by 2 px.
- Evidence: (per clip).
- Confidence: high
- Verified, confirmed: Y 228.95 (sd 2.2), U 126.66 (sd 0.8), V 128.73 (sd 0.8) = RGB 249.3, 247.9, 245.1; per clip Y 228.92-228.99; same in both layouts. n=4.0 M luma and 0.63 M chroma samples at 3 px or more inside the glyphs. Error +-0.5 level. Build value: #F9F8F5.
- Verified, confirmed: Y 129.99 (sd 2.1), U 78.30 (sd 2.4), V 195.82 (sd 2.7) = RGB 254.3, 107.2, 27.8; modes 130, 78, 196 = 254.6, 107.2, 27.1; per clip Y 129.96-130.03. n=3.0 M luma and 0.41 M chroma samples. Error +-1 level on R and B. Build value: #FF6B1B.

### [T12] A caption group enters and leaves as a hard cut: full opacity, final position and final size on its first frame, gone on the frame the next one starts.

- Values: First frame against the settled group: red-channel mean of the glyph cores differs by 0.0 levels (median; p5 -2.4, p95 +2.4; the 4-level gap between white and orange red values explains the tails). Ink mask of the first frame against the middle frame differs by 2.5 % of ink pixels (median; p95 5.8 %, edge pixels changing class with the highlight). Last frame: -1.2 levels, 2.3 %. Largest deviation in any of the 768 groups: 5.4 levels of 250 and 12.2 % of ink pixels, so no group has a partial-opacity, shifted or scaled first or last frame.
- Evidence: n=768 groups of 6+ frames, all clips, every frame., (clip29@567, clip29@173, clip33@349, clip36@281, clip38@415, clip31@752).
- Confidence: high
- Verified, confirmed: 0 frames with a partly visible, offset or scaled group. Entries: first against second frame of 762 groups with the same highlight state: opacity slope median 1.0000 (p5 0.9988, p95 1.0017), shift median 0.000 px, scale median 1.0000, soft IoU median 0.999. 43 exceed the tolerance: 21 are the tail of a layout change (vertical travel 1-15 px), 3 lie under the leaving title, 19 are a 0.3-0.75 px horizontal centroid shift with opacity 0.997-1.009 and scale within 0.2 % (the orange word settling in the codec). Exits: 693 groups, 11 exceed: 6 layout change or title, 5 centroid only. 802 of 831 consecutive groups follow with 0 empty frames; 27 gaps of 4-18 frames are layout changes, 1 is the demo (453 frames), 1 is a 2-frame group. Build value: hard cut; no fade, slide or scale.

### [T13] When the layout changes, the caption on screen travels with it between y=984 and y=1504 (520 px). It is not hidden and not cut.

- Values: Progress by frame around the midpoint (median of 12 clean tracks): -3: 0.006, -2: 0.022, -1: 0.12, 0: 0.44, +1: 0.84, +2: 0.96, +3: 0.99, +4: 1.00. About 6 frames from 1 % to 99 %, 3-4 frames between 5 % and 95 %. Symmetric S-curve, no overshoot above 2 % (2 tracks read 1.018, tracker noise). 21 captions cross between the two positions while visible; 12 of them gave clean tracks.
- Evidence: 12 tracks from 9 clips (for example clip36@746-757, clip31@215-229, clip34@511-524)..
- Confidence: medium: 9 of 21 tracks were rejected (other ink in the window); no curve was fitted

### [T14] Caption casing follows the transcript: a capital only on the first word of a sentence, names and acronyms. No all-caps words for emphasis.

- Values: 1,437 of 1,643 matched words start lower case. 206 start upper case: 74 open a transcript sentence, 132 are names or acronyms inside a sentence. 74 of 80 sentence-opening words are capitalised (the 6 others follow a transcript full stop the captions do not have).
- Evidence: (text, transcript), (case).
- Confidence: high

### [T15] Strip sentence punctuation from captions. Keep apostrophes, hyphens, digit grouping commas, decimal points and %. Write numbers as digits.

- Values: 165 of 166 transcript tokens with a trailing., ! ? lose it in the caption. Kept inside words: apostrophe 30, hyphen 8, comma inside a number 3, full stop inside a number or a domain 6, % 1. 0 captions end in punctuation (2 OCR artefacts excluded). Digits: 25, 300, 40,000, 4.5, 1 %, 2.0, 78, 3,000.
- Evidence: n=853 captions., (punct). Examples clip29@567, clip36@452, clip38@358.
- Confidence: high

### [T16] Put a dark rounded plate behind every caption: 28.5 px beyond the ink left and right, from 87.6 px above the baseline to 39 px below it (about 127 px tall), fill #101010 at 66 % opacity.

- Values: Left pad 28.7 / 29.3, right pad 28.5 / 28.5 (split / full layout medians, n=95, 100, 50, 43; p10-p90 about 22-34: the edge is a 1.4-level step). Top edge 32.6 px above the cap-top row (n=152). Bottom edge 39.5 px (split, n=120, sharp against the presenter picture) and 40.5 px (full, n=54) below the last ink row. Texture dots read 67.0 outside and 33.3 inside, the base level 18.0 outside and 16.65 inside: solves to alpha 0.66, plate level 16. Corner radius about 20 px (fit median 21.5, p10 11.6, p90 27.5, n=147 corner fits; about 17 px by eye). No shadow or outline on the text: plate level within 1 level at 3-5 px from the ink (n=55).
- Evidence: 176 long caption groups, all clips, temporal means., (clip29@570-599), (clip29@174-191).
- Confidence: medium: vertical edges +-1.5 px, horizontal +-3 px; radius low
- Verified, confirmed: Beyond the ink: left 28.1 px (p10 25.9, p90 30.8, n=85), right 27.0 px (p10 25.3, p90 29.4, n=151). Beyond the text box (pen origin to advance end, trailing letter-spacing included): right 25.67 px (p10 24.8, p90 26.5, sd 0.68, n=151), left 25.84 px (sd 2.0, n=85). Plate centre x 539.9 (n=32). Error +-0.4 px. Build value: plate = text box + 26 px on each side.
- Verified, not confirmed (the other claim holds): Top 86.8 px above the baseline (full layout 86.71 on 2,960 frames, split 86.85 on 6,291 frames), error +-0.15 px. Bottom 38.7 px below (split layout: 39.0-39.15 before correction, 38.84 by regression to a flat backdrop, 38.5 with linear backdrop extrapolation, n=459 captions), error +-0.2 px. Build value: top = baseline - 86.8 px, bottom = baseline + 38.7 px (y 897.2 to 1022.7 split, 1417.2 to 1542.7 full; centre y 960 / 1480).
- Verified, not confirmed (the other claim holds): 125.5 px (86.8 + 38.7), error +-0.3 px. Build value: 125.5 px.
- Verified, not confirmed (the other claim holds): 23.2 px (left bottom corner 23.25, right 23.15; rmse 0.17-0.18 px; 20 px gives rmse 1.1-1.2 px, 22 px 0.4-0.5 px; n=84 and 151 captions per row), error +-0.6 px (it moves 22.8-23.7 with the bottom edge at 1022.5-1022.9). Build value: 23 px.
- Verified, not confirmed (the other claim holds): Colour: luma code 30.78 in both layouts, U 127.0, V 128.0 = RGB 17.2, 17.4, 15.1 = #11110F (+-0.4 level). Opacity 0.68 +-0.015: dot integrals 0.683 (split) and 0.679 (full); same pixels with and without the plate on adjacent frames 0.700 (679 patches, 622,693 px, p10 0.690, p90 0.702), an estimator that reads 0.709-0.715 on a synthetic 0.69 plate. Blend is linear in code values within 0.65 codes over luma 38-101. Build value: #11110F at 0.68.

### [T17] Show no captions under the opening title or over third-party audio. Captions start with the first sentence after the title and run to the last frame.

- Values: First caption frame per clip: 122, 89, 83, 132, 70, 93, 83, 73, 98, 103, 48 (median 89). Last caption frame is the last or second-to-last frame in 11 of 11 clips. Captions cover 11,292 of 12,791 frames (88.3 %). Demo without captions: clip30@112-564.
- Evidence: (per_clip).
- Confidence: high for the title (11 of 11); low for the demo case (1 clip)

### [T18] Opening title: 4 centred upper-case lines, the first 2 in the light weight, the last 2 in the heavy weight. 1 or 2 words per line.

- Values: 10 of 11 clips have 2 light + 2 heavy lines; clip39 has 2 light + 1 heavy line at double size (cap 168 px). Words per line: 2 in 33 lines, 1 in 10, never 3. Characters per line median 9 (min 2, max 17). Ink centre x median 541.5 (538.5-548, n=43). The block is static from frame 18 (16 in clip39) to frame 46-129 (median 86).
- Evidence: n=11 clips, 43 lines., (static middle frame, for example clip29@65, clip39@31).
- Confidence: high

### [T19] Title sizes are set per video, not by a formula from the text: light cap height 53-77 px, heavy cap height 69-94 px. Keep the heavy pair larger unless the heavy lines are long.

- Values: Light cap height median 63 (p10 58, p90 69, n=22 lines). Heavy median 82 (p10 76, p90 94, n=21; 168 in the 3-line title). Heavy/light ratio median 1.31 (0.90-1.77; 2.67 in clip39); heavy is smaller than light in 1 of 11 clips (clip32, 10-character heavy lines). The same title copy appears in clip31, clip34 and clip37 at light 67 / 65 / 58 and heavy 80 / 82 / 83 px. Font size if cap height is 0.70 em: light 76-110 px, heavy 99-134 px. Cap heights +-1 px.
- Evidence: , (title.blocks).
- Confidence: medium: the range is solid, the choice inside it is the editor's
- Verified, confirmed: Flat cap height: light 52.96-77.56 px (median 63.0), heavy 68.92-94.18 (median 81.0; 167.8 in the 3-line title); both lines of a pair equal within 0.1 px. Ink height with overshoot: light 54-80, heavy 71-98. Flat light + heavy = 146.9 (146.5-147.1) in 8 titles, 141.5-143.2 in clip29, clip35, clip37. Heavy / light ratio 0.889-1.778 (median 1.31). Build value: flat cap heights (type T19); sizes follow from the layout rule entry.
- Verified, corrected: Rule: (1) choose ratio r = heavy cap / light cap (default 4/3; a single heavy line uses 2r). (2) capL = 359.4 / (2 x 1.2377 + nH x 1.2120 x r), capH = r x capL, with nH the number of heavy lines: the line-box stack is 359.4 px high (359.1-359.7 in 8 titles). (3) if the widest ink line exceeds 905 px, scale both sizes by 905 / width. (4) stack the boxes, caps centred in each, stack centred on y = 766.1, lines centred on x = 540. Test with the measured ratio of each title: cap heights within 0.17 px and every baseline within 2.0 px in 10 of 11 titles (clip35 and clip37 are the width-limited ones and come out exact); clip29 is 3.7 percent smaller than the rule (3.1 px in cap height, 7.0 px in a baseline). Worst error over all 11: 7.0 px. Test from the strings alone (r = 4/3, plus: if the wider light line exceeds 720 px shrink the light pair and give the height to the heavy pair): 4 of 11 titles within 2 px, median cap error 1.9 px, worst 15.0 px in cap height and 34 px in a baseline (clip32, whose heavy lines are smaller than its light lines). Build value: the rule above with r as a per-title parameter, default 1.333, allowed 0.89-1.78.

### [T20] Title line pitch: 1.246 x cap height between the light lines, 1.213 x cap height between the heavy lines, 17 px from the second light baseline to the cap top of the first heavy line.

- Values: Light pitch/cap 1.246 (1.238-1.259, n=11). Heavy 1.213 (1.203-1.225, n=10). Gap 17 px (16-18, n=10; 28 px in clip39). That is a line height of about 0.87 em (light) and 0.85 em (heavy) if the cap height is 0.70 em.
- Evidence: (cap_top, baseline per line).
- Confidence: high
- Verified, confirmed: Pitch light 1.241 x flat cap (residual max 0.8 px, n=11), heavy 1.212 x (0.8 px, n=10); baselines land on whole pixels. Gap from the 2nd light baseline to the heavy cap top 14.8-17.2 px (27.2 in clip39) = 0.086 x light cap + 0.129 x heavy cap (residual max 1.0 px): it scales with the sizes, it is not a constant. Simplest exact description: every line sits in a box 1.2377 x cap (light) or 1.2120 x cap (heavy) high with the caps centred, boxes stacked with no extra space: rms 0.72 px, worst 2.0 px over 86 edges. Build value: line box 1.2377 x cap (light), 1.2120 x cap (heavy), caps centred in the box (line-height 0.87 em and 0.85 em if the cap height is 0.70 em).

### [T21] The title block fills a fixed box: cap top of line 1 at y=594, last baseline at y=936, no line wider than 905 px.

- Values: First cap top median 594 (592-601, n=11). Last baseline median 936 (929-937). Block height median 341 px (328-344). Widest line per clip 610-905 px; 4 clips reach 868-905.
- Evidence: , (title.blocks).
- Confidence: high for top and bottom; medium for 905 px as the limit (largest seen, n=43 lines)
- Verified, confirmed: Flat edges at 50 percent ink, y in pixel-edge units: cap top of line 1 592.0-595.4 and last baseline 935.9-937.9 in the 7 four-line titles that fill the height (flat height 341.6-344.9); 599.4-600.8 and 930.0-933.0 in clip29, clip35, clip37 (329-334); clip39 (3 lines, fills the height) 594.0 to 930.0. Centre of that span 765.4 (762.0-766.2). Widest line 904.7 px (clip35) and 903.2 (clip37); widest light line 720.1 (clip30). Ink centre x 542.0 (539.0-548.4, n=43). 4 upper-case lines, 2 light then 2 heavy, in 10/11; clip39 has one heavy line. Error +-0.3 px. Build value: see the layout rule entry: line-box stack 359.4 px high centred on y = 766.1; max ink width 905 px.

### [T22] Display text (title, headings, figures, call to action, labels) uses a warmer off-white than the captions: #F2EEE9. Captions use #F9F8F5.

- Values: Heavy title lines 241.5, 238.4, 233.4 (n=21). Light title lines 240.7, 238.6, 234.7 (n=22; thin strokes read 1 level lower in red). Headings 241.4, 238.5, 233.7 (n=8). Figures 241.8, 238.1, 232.7 (n=19). CTA keyword 241.6, 238.2, 233.1 (n=11). CTA label 240.9, 238.6, 234.5 (n=11). Caption white 249.3, 247.9, 245.1.
- Evidence: . Calibrated decode.
- Confidence: high

### [T23] Track the heavy display lines tight and the captions at normal spacing. Fit the letter-spacing on the real font against the measured line widths; do not copy a value from a stand-in font.

- Values: Heavy title lines: smallest gap between letters 2-4 px at cap 69-94 px. Ink centre of heavy lines sits 1.5-3.5 px right of x=540 (median 541.5), which a trailing negative letter-spacing of about 3-7 px (-0.03 to -0.06 em) would produce; captions sit at 540.0. Stand-in fits: Avenir Next Bold -0.055 em on heavy title lines, -0.029 em (Avenir Next Medium) on light lines, -0.038 em on captions; these depend on the stand-in. Reference widths to fit against: every title line (characters, ink width, cap height) and 853 captions.
- Evidence: (letter_gaps, width, chars via title.per_clip).
- Confidence: low: no em value can be fixed without the font
- Verified, confirmed: Fitted at the named weights, in em: caption -0.0124 (free size 75.88 px) or -0.0134 (76 px); light title lines -0.0253 (p10 -0.0258, p90 -0.0241, n=22); heavy title lines -0.0357 (-0.0363 to -0.0350, n=21); headings -0.0304 (n=8); figures -0.0401 (n=8); CTA label -0.0196 at 92 px; CTA keyword -0.0357 (n=11). Error +-0.001 em (+-0.002 for the light title lines, whose size is free). Build value: caption -0.013 em, light title -0.025, heavy title -0.036, heading -0.030, figure -0.040, CTA label -0.020, CTA keyword -0.036.

### [T24] Call to action, line 1: the word Comment in the light weight, sentence case, ink from x=349 to x=735 (387 px wide), baseline y=338.

- Values: Identical in 11 of 11 clips: x0 349, x1 734-735, C height 66 px with overshoot, x-height 44 px, stems 9 px. Baseline y=338 in 9 clips, 536 in clip29, 198 in clip35 (block moved as a whole). Font size about 91 px if the cap height is 0.70 em.
- Evidence: (role cta_label), (for example clip30@1830, clip33@1050).
- Confidence: high
- Verified, confirmed: Identical in 11/11: ink x 348.6-735.7 (width 387.0-387.1, centre 542.2), ink rows 274-339, C height 65.8 px (round letter, 274.2 to 340.0), stem baseline at y = 339.0 in pixel-edge units (last full ink row 338). Position: that box in 9/11; +198 px in clip29 (picture above), -140 px in clip35 (picture below). Light weight, sentence case. Error +-0.2 px. Build value: ink x 348.6-735.7, C top 274.2, baseline 339.0 (C height 65.8 px).

### [T25] Call to action, line 2: the keyword in upper case inside curly double quotes, heavy weight, cap height 116 px, cap top 80 px under the baseline of line 1. Shrink it to fit 923 px.

- Values: Cap height 116 px in 9 of 10 measured keywords (stem/cap 0.25-0.26); one 9-letter keyword is set at 94 px and is 923 px wide. Widths 440-923 px (median 713). Cap top y=418-420, baseline y=535 in 8 clips; shifted with line 1 in clip29 (+198) and clip35 (-140). Line 1 baseline to keyword top: 80 px (72-82, n=11). Font size about 166 px if the cap height is 0.70 em.
- Evidence: n=11 clips. (role cta_keyword), (for example clip29@1170, clip34@1200).
- Confidence: high for size and case; medium for the 923 px limit (1 shrunk keyword)
- Verified, confirmed: Flat cap height 116.2 px (116.15-116.27) in 10/11; cap top 419.8, baseline 536.0, cap top 80.6-80.8 px under the line 1 baseline. Quote marks span 415.0-476.6. Ink rows 415-537. Width 439.9-803.7 px at full size, ink centre x 542.8-542.9. clip34 (9 letters): cap height 93.8 (0.807 x), ink 923.2 px wide (x 80.8-1004.0), cap top 411.2, baseline 505.0. Error +-0.2 px. Build value: cap height 116.2 px, cap top y = 419.8, baseline y = 536.0 (pixel-edge units).
- Verified, confirmed: 923.2 px ink width on the one shrunk keyword (clip34). One heading is 923.35 px wide as well (clip38, second heading). Build value: 923 px.

### [T26] Numbered section heading: 'N. Name' in the heavy weight, title case, cap height 67 px, x-height 47-49 px, one line at the top of the frame.

- Values: 8 headings in 3 of 11 clips (clip32, clip33, clip38). Flat cap height 67 (65-68), x-height 49 (47-49), stems 17 px (16-18), stem/cap 0.25. Baseline y=142-146 with ink centre x=541 in clip32 and clip33; baseline y=89-90 with centre x=501 in clip38. Widths 503-923 px. Stays 2.0-11.5 s. clip33 puts a 70 px icon between the number and the name. Font size about 96 px if the cap height is 0.70 em.
- Evidence: (role heading), (clip38@960, clip33@450, clip32@420).
- Confidence: medium: 3 clips, two placements
- Verified, corrected: Two sizes, not one: clip32 flat cap 65.2-65.4 px (cap top 77.6-77.8, baseline 143.0; n=2); clip33 67.9-68.0 px (cap top 77.9-78.1, baseline 145.9-146.0; n=3); clip38 68.0 px (cap top 22.0, baseline 90.0; n=3). The cap top is constant per position and the baseline follows the size. Flat digit "1" 65.25 / 67.96 / 68.05 px; round digits 2 and 3 are 1.1-1.3 px taller. Ink centre x 542.0-542.2 (clip32), 539.2-541.7 (clip33), 501.4-502.4 (clip38). Widths 503-923 px. Error +-0.3 px. Build value: cap height 68 px, cap top y = 78, baseline y = 146, centred on x = 540.

### [T27] Big figures use the heavy weight, tight spacing and the display off-white. Cap height 100-227 px by available room (median 169). Units and suffixes (+, x, %, K) are set in the same face; a word unit is smaller.

- Values: 19 samples of 18 figures in 9 clips: cap height median 169 px (p10 133, p90 218, min 100, max 227). Stem/cap 0.249 (0.221-0.301). Ink width 122-878 px. A counter read at two values changes width by 7 px (clip39@240 and @315: 357 and 350 px), so digits are proportional there; another counter kept 728 px on two values (clip33@360 and @465).
- Evidence: (role figure), (for example clip29@615, clip33@465, clip31@765).
- Confidence: medium: sizes vary with layout; digit set (proportional or tabular) not decided
- Verified, confirmed: cap height 109 to 227 px, median 168 (n=14 figures, 9 clips). By character count: 1 char 216, 183; 2 chars 227, 227, 205, 173, 163, 150; 3 chars 153; 4 chars 166, 160; 6 chars 136; 7 chars 169; 'x of y' 109. Ink width = 0.75 * cap * characters (0.72 to 0.80, n=7; '11' is 0.47). Centre x 539 to 544.5 on 9 of 14; the other 5 sit beside a logo, icon, list or grid. Ink #F2EEE8 within 1 level on the 12 figures whose core colour was read. Error +-2 px. Build value: cap = min(room, 1170 / characters) px, with room = 168 px by default and 205 to 227 px for a 1 or 2 character figure that stands alone; centre x 540; #F2EEE8.
- Verified, confirmed: Proportional: 40,000+ and 300+ (clip29), 2,000+ (clip38), 200+ (clip39): 0.976-0.989 against 0.81-0.92 with tabular digits. clip39 249 to 252: both edges move at the value change (x 655-1012 to 659-1007), and 252 needs -0.057 em as tabular against the -0.040 em of every other figure. Tabular: clip33 5,220,123 (0.987 against 0.692) and 78 (0.989 against 0.972); its outer edges stay at 179 and 905 while the digits change (frames 360-362). Build value: proportional digits by default; font-variant-numeric: tabular-nums for a long counter.

### [T28] Small upper-case labels over a graphic: heavy weight, cap height 51 px, letter-spaced wide.

- Values: 2 labels in 1 clip: cap 51 px, stems 13 px (0.255), widths 299 and 249 px for 6 and 5 letters, centre x 537-538. Stand-in fits give +0.06 to +0.09 em tracking on 8 different fonts (IoU 0.83-0.88).
- Evidence: clip29@405. (role label_caps).
- Confidence: low: one clip

### [T29] Never observed in captions: a second line, a third word, a fade or slide, a scale pop, italics, underline, a highlight bar, an outline or shadow on the glyphs, two caption sizes, left or right alignment.

- Values: 0 of 853 captions and 0 of 768 group changes (see T05, T06, T10, T12, T16).
- Evidence: .
- Confidence: high

## Constant and variable

CONSTANT (every clip, to the pixel or the frame): one font family; caption size (cap 53.55 px), baselines 984 and 1504, centre x=540, one line, 2-word groups with single words only at sentence ends, hard cuts for groups and highlights, caption colours #F9F8F5 and #FE6B1A, the plate geometry; title structure (2 light + 2 heavy upper-case lines), weights (stem/cap 0.14, 0.18, 0.25), title line pitch ratios (1.246 and 1.213 x cap), title box (y=594 to 936) and title static start (frame 18); display colour #F2EEE9; the CTA label (x 349-735, 387 px) and keyword size (cap 116 px), 80 px between them.

VARIABLE: title sizes per video (light cap 53-77 px, heavy 69-94 px, ratio 0.90-1.77) and title hold (ends frame 46-129); number of title lines (3 in clip39); CTA block height on the frame (3 positions) and keyword width (440-923 px, one keyword shrunk to cap 94 px); heading placement (2 variants in 3 clips); figure size (cap 90-242 px); caption width (42-703 px), group length (2-50 frames, driven by speech) and which position is active (driven by the layout); first caption frame (48-132, driven by title length).

## Open questions

- Font identity. Outfit (OFL) is the first candidate from glyph features; League Spartan and Jost are the alternatives. Decide by loading each and running on the same crops: a true match should exceed IoU 0.90 (best installed: 0.71 captions, 0.83 heavy title).
- Named weights. Stem/cap ratios 0.14, 0.18 and 0.25 map to about 500, 600 and 800 on Montserrat, Inter and Avenir Next. The real font's weight names for these ratios need the font file.
- Tracking in em for the title, headings, figures and CTA. Needs the font; fit against the widths in and. The 1.5-3.5 px right shift of heavy lines suggests -0.03 to -0.06 em.
- Why 14 single-word groups sit where the machine transcript has no sentence end (for example clip30@1611, clip33@496, clip35@925). Likely the editor's own transcript segments differ; the editor's transcript would decide it.
- How the two title sizes are chosen. The same copy gets three size pairs in clip31, clip34 and clip37, so it is not a function of the text. The illustration height may drive it (layout or hook dimension).
- Figures in counters: proportional or tabular digits. One count-up kept the same ink box on two values (clip33@360 and @465), another changed width by 7 px (clip39@240 and @315). An every-frame check of both counters would decide.
- Plate construction: measured as a box 28.5 px beyond the ink, 87.6 px above and 39 px below the baseline, radius about 20 px. Whether the editor defined it as padding around a line box cannot be told without the font metrics.
- Two captions highlight a two-word product name as one unit (clip32@851, clip33@504). Whether that is a rule for names or a transcript token artefact is undecided (n=2).

## Needs an eye or an ear

- Font: open and beside the candidate font and confirm a, g, t, y, j, R, G and the digits 1, 2, 4, 7.
- Highlight timing against the voice: play clip29 from frame 560 to 640 and judge whether the orange word leads or lags the speech (the measured +2 frames is against machine timings). Table.
- Caption travel during a layout change: watch clip36@746-757 and clip31@215-229 in playback; strips in and. Check that the move reads as one motion with the layout.
- Plate: open and (gamma-boosted) and confirm the corner radius (about 20 px measured, about 17 px by eye) and that there is no blur under the plate.
- Light weight: open and and choose the font weight that matches 9 px stems on a 64-66 px capital.
- Hard cuts: step through and and confirm there is no intermediate frame.
