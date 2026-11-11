# Layout and geometry: measured record (L01-L24)

Part of the Editorial Proof study; read `README.md` first for the corpus, the method and the limits. STYLE.md cites these rules by id, for example [L01]. Frames are at 30 fps (f); positions are pixels on the 1080 x 1920 frame; evidence is given as clip id @ frame (see README.md, "Evidence ids").

**Sample.** All 33 reels classified every 0.5 s (2,423 samples, 1,211.5 s) into nine full-frame layout modes; geometry measured on full-resolution frames (temporal medians per segment, edge detection on cards, panels, strips and caption ink).

**Method notes.** Positions are in pixels on the 1080 x 1920 frame. Five geometry generations (A newest to E oldest) coexist inside the month; the build targets generation A (3-9 Nov). Boundaries in time are known to +-0.25 s only.

**Confidence.** high = measured on many instances and consistent; medium = measured but on fewer instances or with a judgement step; low = one to four instances, or inferred.

## Rules

### L01 - Nine full-frame layout modes; three carry 78% of runtime. Shares of total runtime over all 33 reels.

- Confidence: high
- Numbers: dark_focus 38.3% (32/33 reels, 92 segments, median 5.0 s, p10-p90 2.5-7.5); light_split 30.0% (33/33, 85 seg, 4.0 s, 1.7-7.0); presenter_cta_ending 10.5% (33/33, 4.0 s, 3.5-4.5); light_split_hook 10.0% (32/33, 3.8 s, 2.5-5.0); white_interstitial 3.8% (11/33, 28 seg, 1.5 s, 1.0-2.0); presenter_punch_in 2.7% (24/33, 1.0 s); white_focus 2.1% (9/33, 2.5 s); phone_focus 1.6% (2/33); fullframe_broll 1.0% (1/33). Per-reel spread: dark focus 13-61%, split 13-57%, hook 4-19%.
- Evidence: 2 fps classification of all 33 reels, 2,423 samples = 1,211.5 s;; clip24 checked sample by sample (94/94)

### L02 - Layout mode changes by cut about every 3.9 s; the dominant alternation is dark focus <-> light split.

- Confidence: medium
- Numbers: Mode changes per reel: median 8, range 5-13. Median seconds per mode segment 3.89 (117 frames). Transition counts: dark->split 55, split->dark 41, interstitial->dark 17, dark->ending 17, split->ending 15, hook->dark 14, punch-in->dark 14, interstitial->split 11, hook->punch-in 9, hook->split 2. Longest split segment 10 s, longest dark focus 13 s. Boundaries known to +-0.25 s only.
- Evidence: 33 reels, 2 fps labels

### L03 - Everything sits on one centre axis; cards share one stroke, radius and column.

- Confidence: high
- Numbers: Centre x 539.5-541 (strip 539.5 in all 32 hook reels; cards 539.5; CTA block 536-541). Card stroke 4 px (range 3-5, median 4, n=6,945 side samples, 33 reels). Card outer corner radius 26 px (23.5-28; medians hook 25.8, split 24.5, dark 27.2, interstitial 25.6; n=1,485). Column x 93..987 = 894 px, side margins 93 px (8.6%). Narrow column x 115..964 = 850 px. Generation D/E column x 70..1009 = 940 px.
- Evidence: clip39@60 (card_corner_TL_x6), measures over all 33 reels

### L04 - Light split with hook title, newest generation (A): fixed vertical stack.

- Confidence: high
- Numbers: Line 1 cap top y 236, baseline 302 (cap 66 px); strip y 336..475 (h 140), centred, width = line-2 text + about 2x20 px; gap strip->card 17 px; card 94,493,985,977 (892x485, 1.84:1); caption x-height top 1037, baseline 1087; presenter panel 42,1292,1039 running off the bottom (998 wide). Rhythm: 236 | 66 | 34 | 140 | 17 | 485 | 59 | 50 | 205 | 628.
- Evidence: clip40, clip39@60, clip38 (3 reels identical to +-2 px)

### L05 - Title block proportions across all hook reels; strip has two height classes and hugs the line-2 text.

- Confidence: high
- Numbers: Strip height standard 132-141 px in 27 reels (132 x12, 134 x11, 140 x3, 141 x1) or small 92-106 px in 5 reels (all with line 1 wider than 850 px). Strip width 392-932 px (median 693); text side padding 16-30 px (median 20); strip radius 4-10.5 px (median 7.5). Line 1 cap height 53-66 px (median 62), width 542-907 px (median 781), cap top y 203-271 (median 236). Line-1 baseline to strip top 33 px (29-34); 28 px (26-29) with small strip. Strip top y 298-366 per reel.
- Evidence: 32 reels, MULTI

### L06 - Gap from title strip to card is 17 px in the current generations; the card does not move up when the strip is small.

- Confidence: high
- Numbers: 17 px (16-17) in 15 reels (generations A, B, C); 29-34 px in 10 reels (D, E, two others); 49-71 px in the 5 small-strip reels; 101 px when a chip row sits between (clip08). Hook card sizes: 850x462 at x 115..964 in 16 reels; 848x484 in 5; 892x485 in 4; 848/849x485-486 in 3 lime reels. Hook card bottom y 975-977 in 11 of 14 generation A/B reels.
- Evidence: 32 reels; clip39@60 strip_card_gap_x6; clip31@60; clip24@60

### L07 - Light split without title: one card slot per generation; the card is steady inside a segment.

- Confidence: high
- Numbers: A/B: 93,255,986,976 = 894x722 (1.238:1), 14 reels (three reels shift it 5-18 px up). C: 894x722 with top 194-231 (5 reels) or 848x686 at 116..963 with top 227-249 (4 reels). D/E: 70,240,1009,935 = 940x696 (1.351:1), 9 reels. Gameplay: 48,276,1031,829 = 984x554 (16:9). clip38@410-605 holds 93,245,986,966 on 40 of 40 sampled frames.
- Evidence: 33 reels; clip27@760, clip24@240, clip12@220, clip07@40 (split)

### L08 - Nothing reflows when the title leaves; the non-title card is bottom-anchored and grows upward into the title space.

- Confidence: high
- Numbers: Title strip wipes off left to right in about 6 frames (200 ms); card stays at 94,493,985,977 on every frame afterwards; cut follows within 6-10 frames (200-333 ms). In later split segments card bottom stays 976, top moves 493 or 515 -> 255 (height 485 or 462 -> 722), x 94..985 or 115..964 -> 93..986. Caption and panel identical in both states.
- Evidence: clip39@128-146, clip34@112-128 (frame-by-frame tracking); 14 A/B reels for the slot comparison

### L09 - Card width is the column; height follows content aspect; short cards are anchored inside the slot, not floated.

- Confidence: medium
- Numbers: Heights seen at w 894: 270, 482, 502, 512, 572, 624, 671, 684, 700, 708, 722, 895, 1024 (aspect 0.87 to 3.3). Split short cards (10 instances, 10 reels): top-anchored 6, bottom-anchored 2 (ornament above), centred 2 (16:9 video). Dark focus: alone = centred on y 766 (e.g. 93,431,986,1101; 93,318,987,1212); number or small card above = bottom-anchored at 1277; chip row below = top-anchored at 254.
- Evidence: MULTI; clip29@790; clip40@300; clip39@217

### L10 - Captions have a fixed y per mode and do not follow the card.

- Confidence: high
- Numbers: Split baseline: A/B 1086 (1079-1096; 13 reels, 183 frames), C 1030 (1012-1047), D/E 1067 (1041-1074), gameplay 942; x-height 46-50 px. Dark focus baseline 1440, x-height top 1394 (alternates 1409-1436 in some segments); D/E 1451-1477. Interstitial spoken caption 1440. White focus 1262-1347. Short card examples: clip19 card bottom 769 -> caption still about 1031; clip36 card bottom 524 -> caption about 1085. Estimator noise +-5 px.
- Evidence: 594 split samples, 818 dark-focus samples; MULTI

### L11 - Captions are centred on 540 and never leave the card column.

- Confidence: high
- Numbers: Split: ink x never below 92 or above 987 (594 frames); width median 371 px, p95 706, max 894; bbox centre median 539. Dark focus: width median 394, max 890, right edge p99 944. While words are still appearing the bbox centre sits left (p5 = 320): the phrase is laid out centred once and filled from the left.
- Evidence: 1,725 caption samples across 33 reels

### L12 - Presenter panel box has five generations; the blue-stroked panel is only the newest and is in 6 of 33 reels.

- Confidence: high
- Numbers: A (5 reels, 3-9 Nov): x 42..1039 (998), top 1292, 18 px blue stroke, outer radius 39.5 (inner 21.5). A2 (1): x 96..983 (888), top 1357, 16 px stroke, r 34. B (8, 31 Oct-7 Nov): x 51..1039 (989), top 1304, r 63, no stroke, 11 px off-centre. C (9, 22 Oct-1 Nov): x 76..1002 (927), top 1340, r 87. D (7, 13-20 Oct): x 59..1021 (963), top 1407, r 152, soft shadow. E lime (2): x 53..1022 (970), top 1404, r 87. Gameplay (1): as D with top 1247. Every panel runs off the bottom of the frame (no bottom corners). Presenter cut-out is not clipped by the panel.
- Evidence: temporal median of up to 11 split frames per reel, all 33 reels; MULTI; clip39@60, clip27@760, clip24@240, clip12@220 corner zooms

### L13 - Clear band between split caption and panel top is reserved for the presenter's head.

- Confidence: medium
- Numbers: Caption baseline to panel top: 206 px (A), 218 (B), 310 (C), 340 (D), 305 (gameplay). Panel top as % of height: 67.3% (A), 67.9% (B), 69.8% (C), 73.3% (D), 65.0% (gameplay).
- Evidence: 33 reels (panel) x split caption baselines per generation

### L14 - Dark focus: one content slot and one caption slot, constant across generations A, B and C.

- Confidence: high
- Numbers: Slot 93,254,987,1277 = 894x1024 (0.873:1), centre (540, 765.5), in 22 of 22 A/B/C reels; margins left 93, right 92, top 254, bottom 643. Caption baseline 1440 = slot bottom + 163. D/E: slot 70,240,1009,1299 = 940x1060, caption 1451-1477 (10 reels). Same left, right and top as the split card: split -> dark focus only moves the card bottom 976 -> 1277 and the caption 1086 -> 1440.
- Evidence: clip38@307 (18 samples at 93,255,986,1276), clip37 (11), clip11 (16), clip12@340

### L15 - Dark-focus slot can be shared: number above, chips below, or stacked cards.

- Confidence: medium
- Numbers: Big number + card: number top y 304-377, glyph block 135-221 px tall, label ending y 566-627, card bottom-anchored 894x624 to 894x684 (top 594-654), label->card gap 27-32 (3 reels). Chip row: card 93,254,987,937 (894x684), chips y 967-1241, one chip 460x275 or two 372x266 overlapping 41 px, gap card->chips 30 (1 reel). Two cards: 254..592 + 598..1277 (gap 6) or 254..776 + 755..1277 (overlap 21). Three cards: 254..601 / 578..947 / 930..1277.
- Evidence: clip40@300, clip18@315-360, clip20@450-480, clip39@217, clip21@1057, clip31@570-615, clip23@627

### L16 - Counter badge is a child of the card at its top-right and scales with it.

- Confidence: medium
- Numbers: Pill 124x42 px, radius 21, fill #1C1C20; 23 px in from the card's right outer edge, 14 px down from its top outer edge (clip39: 840,269,963,310 on card 94,254,987,937). On the 848-wide card it is 117x39 (scale 0.944).
- Evidence: clip39 (40 detections), clip24 (35), clip10 (53)

### L17 - Numbered white interstitial has a fixed stack, identical across reels.

- Confidence: high
- Numbers: Heading cap top 270, baseline 333; number block y 366..497 (h 132), centred, width by word One 228, Two 217, Three 296, Four 252, Five 228; gap block->card 29; card 115,527,964,1148 = 850x622 (1.367:1); gap card->name cap top 62; name cap top 1210, baseline 1286; spoken caption baseline 1440. Older clip10: heading and block 16 px higher (gap 46). Segment 1.0-2.0 s.
- Evidence: clip39@172, clip31@487, clip24, clip20, clip10 (5 reels, 20 segments, +-1 px)

### L18 - 'It's Called' interstitial reuses the card slot; the name is the one text element that follows the card.

- Confidence: high
- Numbers: New (2 reels): strip 302,256,777,390 (476x135), card 115,527,964,1148, name baseline 1286. Old (3 reels): strip 302,240,777,373, gap 46, card 115,420,964,1099 (850x680), name cap top 1162, baseline 1238. Name cap top = card bottom + 62 in all variants (clip38 short card bottom 1005 -> name cap top 1067).
- Evidence: clip26@142, clip38@210-240, clip13@217, clip14, clip25

### L19 - CTA ending: two centred lines over the full-frame presenter, keyword overlapping the bottom of 'comment'.

- Confidence: medium
- Numbers: A/B (14 reels): 'comment' x-height top 1370 (ascender 1357), x 362..718 (w 357); keyword top 1410, baseline 1493, descender to 1516. C (8): 'comment' top 1307-1345, keyword baseline 1485-1493, descender to 1523-1533. D (7): 'comment' top 1334, x 307..774 (w 468); keyword top 1395, baseline 1504, descender 1533. Block y 69.5%-79.8% of height, centre x 536-541.
- Evidence: persistent-edge measurement on the last 36 frames of all 33 reels; clip40@955, clip27@1109, clip24@1391, clip10@1417, clip11@842

### L20 - Mid-video presenter punch-in and full-frame b-roll carry a white caption in the same band.

- Confidence: low
- Numbers: Punch-in: ink top median 1331 (p10 1296, p90 1378), ink bottom median 1422 (p10 1378, p90 1471); n=48 frames, 23 reels; segments about 1 s. B-roll (gameplay): ink top 1317, baseline 1383. Rough measurement, +-20 px.
- Evidence: clip40@125, clip22@112, clip07@307 and @820

### L21 - Safe area: text keeps clear of all four edges and of the bottom fifth.

- Confidence: high
- Numbers: Closest text: left x 74 (widest strip), right x 1005, top y 203 (lime; blue 215), lowest caption baseline 1495 (blue family 1477), lowest ink 1534 (CTA descender). So at least 74 px (6.9%) sides, 203 px (10.6%) top, 386 px (20.1%) bottom. Newest generation working values 93 / 236 / 404. Cards: x 93..987 standard, 41-48 margin for 16:9 media, top 194-254, bottom 1277-1299.
- Evidence: 1,725 caption samples, 241 title samples, 33 endings

### L22 - Lime variant changes colour, not geometry; it uses the geometry generation of its week.

- Confidence: high
- Numbers: Hook card 848/849x485 at x 116..964; split card 70,240,1010,935; dark-focus slot 69,239,1010,1300; panel 53..1022 top 1404 r 87 (2 reels) or 76..1002 top 1340 (1 reel); strip->card gap 32-33; title cap top 203-223. Extra: 16:9 media cards 999x563 with 41 px side margin; white focus 10.5% of runtime vs 1.4% in blue.
- Evidence: clip25, clip16, clip11@60 and @842

### L23 - Gameplay variant: no hook title, 16:9 card, taller panel, b-roll instead of dark focus.

- Confidence: medium
- Numbers: Split card 48,276,1031,829 = 984x554, bottom fixed at 829 (heights 540-606); caption baseline 942 (113 below card); panel x 59..1021, top 1247 (673 px visible vs 513 in D), r 152, soft shadow; mode mix split 57.1%, b-roll 34.3%, ending 8.6%; ending block 307,1354,774,1504.
- Evidence: clip07@40, @307, @820 (1 reel)

### L24 - Phone focus centres a phone mock-up in the dark-focus slot.

- Confidence: low
- Numbers: clip18: 317,288,763,1243 (447x956, centre y 766), caption baseline 1423. clip35: 299,262,780,1349 (482x1088) on a blue gradient backdrop. Aspect about 0.45.
- Evidence: clip35@540, clip18 (2 reels, 4 segments)

## Constant versus variable

**Constant (core style):** one centre axis at x 540 for every element; the slot stack and its order (optional title / card / caption / presenter panel in split; card / caption in dark focus; heading / block / card / name in the interstitial); card treatment (4 px accent stroke, 26 px radius, 894 px column, 850 px under a heading); dark-focus slot 93,254,987,1277 with caption baseline 1440 (22 of 22 A/B/C reels); split slot 93,255,986,976 with the bottom fixed at 976 (generations A/B); numbered interstitial stack 270 / 333 / 366-497 / 527-1148 / 1210-1286; title proportions (strip 132-141 high, line-1 baseline 33 above the strip, strip 17 above the card); captions fixed per mode and inside the card column; text at least 74 px from the sides, 203 px from the top, 386 px from the bottom; presenter panel runs off the bottom and does not clip the presenter; mode changes are cuts, never animated reflow.

**Variable (per-video freedom):** strip width 392-932 px and line-1 width 542-907 px (set by the words); strip size class (standard in 27 reels, small 92-106 px in 5); vertical placement of the hook block (strip top 298-366); card height and anchor from content aspect (heights 270-1024); what shares the dark-focus slot (big number, chip row, second and third cards); presenter panel generation (width 888-998, top 1247-1407, radius 34-152, stroke 0 or 16-18 px, shadow or none); column width by generation (894 vs 940) and 16:9 media cards that break the column (41-48 px margin); caption baseline wobble (+-10 px in split, 1409-1441 in dark focus); mode mix per reel (dark focus 13-61%, split 13-57%, 5-13 mode changes).

## Disagreements with other studies

- Card corner radius: 26 px here (outer edge, n=1,485 corner fits) against 18 px in the graphics study (G01, 44 cards). Unresolved; the build uses 18 px.
- Card stroke: 4 px here (n=6,945 side samples) against a 3 px median in graphics (G01) and 3-5 px in colour (C03). The build uses 4 px.
- Presenter panel outer radius: 39.5 px here against 36 px in the presenter study (P02).
- Dark-focus caption baseline: 1440 here, 1442 in type (T20).
- Mode-change count: 8 per reel at 2 fps here against 9 runs per reel per frame in structure (S05).

## Open questions

- Which presenter panel generation should the rebuild target: A (blue 18 px stroke, 5 of the last 9 reels) as the single default, or A and B alternating as the last two weeks actually do?
- Is the small title strip (92-106 px, 5 reels) a deliberate rule for long line-1 titles, or a per-video choice? Five other reels with line 1 wider than 850 px keep the standard strip.
- Why does the dark-focus caption sit at 1409-1436 instead of 1440 in some segments (clip33, clip28, clip30, clip23, clip22)? Possibly two-line captions; the type analyst may know.
- Chip-row geometry comes from one reel (clip39); the graphics analyst should confirm sizes on other chip instances.
- The second pass of clip34 (36-72 s) was not measured, as instructed.

## To check by eye or ear

- Mode labels are heuristic at 2 fps: only one reel (clip24) was compared sample by sample; spot-check two or three more reels against before relying on shares to the percent.
- Counter badge: detected in 3 list reels (clip39, clip24, clip10) but not in clip31 or clip20; my detector cannot see a dark pill on dark card content, so look at those two by eye.
- Presenter panel generation B is 11 px off-centre (x 51..1039) on all 8 reels; decide whether to reproduce or centre it.
- Generation A panel stroke is two-tone on the left and top (about 10 px #5177D7 + 6 px #265DC9) but solid #1259C9 on the right; likely an animated or lit gradient stroke, to be confirmed by the colour and motion analysts.
- Punch-in caption band (ink 1296-1471) and generation C ending split between 'comment' and keyword are rough (+-20 px).
- Instagram Reels UI zone sizes (top about 220 px, bottom about 420 px, right button column) are assumed from general guidance, not measured; verify against a current device screenshot.
