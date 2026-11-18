# Layout

Measured on the 30 in-style clips of the reference corpus (neutral ids clip01 to clip30, by publication date, 2026-03 to 2026-11). Evidence ids are `clipNN@frame` at the clip's own rate (23.976 or 24 fps); evidence files stay in the private study folder and are not part of this repository. Confidence is the analyst's.

## Summary

Measured on all 30 in-style clips (2026-03-11 to 2026-11-15), 4,404 samples at 2 per second (every 12th source frame, frame-exact), decoded BT.709 limited to full range (checked on a black letterbox bar = 0,0,0 and a white UI patch = 253,253,253; default decode identical). Every sample got an automatic label (seam edges, presenter histogram and correlation tests) and was then checked by eye on 72 px contact sheets of every sample plus 160-180 px pick sheets for ambiguous runs; 526 of 4,404 labels were changed by eye. Seam rows were measured by code on full-resolution samples (1,915 split samples with a measurable edge) and on 12 lossless single-frame decodes; captions by connected-component text detection (3,512 caption lines); top-panel fit on all 845 top-panel shots by code and on a random 128 by eye; presenter circles by ring fitting on 12 samples.

The format is a split: the upper visual covers rows 0..958 and the presenter fills 959..1919 (60.7% of runtime, all 30 clips, runs of 4.0 s median). It is broken by hard cuts to a full-frame presenter (17.2%, 27 clips, 1.5 s runs) and to a full-frame visual (15.4%, 26 clips, 2.5 s runs); rarer modes are a presenter circle over a visual (3.5%, 5 clips), two stacked visuals (3.2%, 13 clips), letterboxed strips (2 clips) and a presenter card (1 clip). The seam is a hard edge with no line, gap, shadow or feather, but it is not constant to the pixel: per-clip modal last upper row 952-961 (median 958), and the upper visual is laid over a fixed presenter layer. In 6% of split samples the seam moves to a tall-top position (1077-1337, 11 clips) or a short-top position for uncropped 16:9 footage (595-709, 3 clips). Captions sit centred at x=538, y=960 in every clip and almost every mode (baseline 974, letter height 28); they leave y=960 only for letterbox strips (above the strip) and short-top splits (on the new seam).

Upper-panel content is cover-cropped in 77% of sampled shots (video 38/41, app UI 40/51); the rest are cards or portrait pictures on a plain background (18/128), circle-masked graphics (6, one clip), collages (4) and one letterbox; no blurred fill was seen. 96% of layout-family changes coincide with a single-frame cut; no animated reflow of the seam was found. Over time the geometry did not change (seam and caption position the same from March to November, including the two 720p March clips); what changed is the mix: presenter circles were used in 4 of 11 clips in March-May and once afterwards, letterbox strips only in May-July.

## Rules

### L01. Build every video from five layout families in these runtime shares: split (visual over presenter) 61%, full-frame presenter 17%, full-frame visual 15%, presenter circle over a visual 3.5%, stacked visuals 3%.

- Values: Samples (2/s): split 2672 (60.7%), face 759 (17.2%), full 679 (15.4%), pip 154 (3.5%), stack 140 (3.2%) of 4404. Clips using each: 30, 27, 26, 5, 13. Detailed codes: SP 2660, FA 723, FU 655, ST 140, FU+C 80, FU+R 37, FU-LB 24, FA+G 21, ST+C 21, S3P 12, GR 10, FA-LB 9, FA-CARD 6, ST3+C 6. Per-clip split share 19% (clip11) to 88% (clip04).
- Evidence: n=30 clips, 4404 samples; evidence/mode_labels.csv, evidence/mode_summary.json, evidence/sheets_final/clip01.jpg..clip30.jpg (labels on every sample, * = changed by eye), evidence/labels_by_eye_overrides.json
- Confidence: high

### L02. Hold each layout run for: split 4.0 s median (2.0-9.5), full-frame presenter 1.5 s (0.5-4.0), full-frame visual 2.5 s (1.0-6.0), circle PIP 3.0 s, stacked visuals 3.0 s (1.0-5.5).

- Values: Family runs (median, p10, p90, max, n runs): split 4.0/2.0/9.5/32.5/259; face 1.5/0.5/4.0/9.5/195; full 2.5/1.0/6.0/16.0/105; pip 3.0/1.4/11.8/13.0/15; stack 3.0/1.0/5.5/8.0/21. Granularity 0.5 s (12 frames).
- Evidence: n=30 clips; evidence/mode_summary.json (family and mode seg_s_*), evidence/sheets_final/*.jpg
- Confidence: high

### L03. In the split, draw the upper visual over rows 0-958 and the presenter over rows 959-1919 (full width both); allow the seam to sit anywhere in 953-962 but keep it fixed within a video.

- Values: Last upper row (0-based): median 958, p10 955, p90 961, min 940, max 970 (n=1915 split samples with a measurable edge, 29 clips). Per-clip modal value 952 (clip23) to 961 (clip03, clip06); the modal value covers 44%-100% of a clip's measured samples (clip27 126/126, clip23 126/128). Not constant to the pixel across clips. 720p clips agree after x1.5 scaling (clip04 955, clip05 959).
- Evidence: evidence/seam_stats.json (per_clip, half_values), evidence/mode_labels.csv (upper_last_row column), e.g. clip27@1044 957, clip23@1512 952, clip30@900 960, clip01@156 960
- Confidence: high

### L04. Make the seam a hard cut between the two pictures: no line, no gap, no shadow, no feather; one antialiased row is allowed.

- Values: Row after the last upper row is a blend toward the lower picture with median 0.89 (p10 0.50, p90 1.00; 46% of samples > 0.9; n=1908). On lossless decodes the transition is complete by the second row in 10 of 11 measurable frames (normalised profile >= 0.99). No row whose colour differs from both sides, no darkening ramp below the seam. Where an upper visual ends above the presenter layer the black canvas shows through (clip01@60: rows 953-958 luma 0-1.5 between the visual ending at 951 and the presenter at about 961), never a drawn line.
- Evidence: evidence/seam_profiles_lossless.json (12 frames: clip01@60,156,300,780; clip06@1236; clip19@1440; clip23@1512; clip27@1044; clip30@60,900,1104), evidence/seam_zoom_x8.png, evidence/seam_stats.json blend_next
- Confidence: high

### L05. Put the presenter on a fixed full-width layer under the upper visual; small changes of the upper visual's height must not move the presenter, while a tall-top or short-top split re-frames it.

- Values: Best vertical shift between split samples of one clip with different upper heights: 0 px in both edge bands for 8 of 10 pairs whose seams differ by 1-6 px, 0/1 px for one more, and 0 px in one band for the last (presenter moved in the other band) (clip01 955/959/960/963 vs 957, clip13 957 vs 956, clip16 959/960/962 vs 958, clip28 960/962 vs 959). Pairs with seams 1083-1337 or 709 vs ~960: no match within +-25 px (errors 8-110 against 0.4-5) = the presenter was re-framed.
- Evidence: evidence/presenter_layer_offset.json (30 tests in clip01, clip03, clip12, clip13, clip16, clip28)
- Confidence: medium (4 clips tested for the fixed-layer case)

### L06. Keep 94% of split time at the half seam; use a tall upper panel (seam about 1200, presenter 720 px tall) for opening titles over footage, two stacked cards or tall UI/maps, and a short upper panel (seam about 608) when 16:9 footage is shown uncropped at full width.

- Values: Split samples by class: HALF 2498 (93.9%, 30 clips), TALL 125 (4.7%, 11 clips: clip01, 03, 12, 13, 16, 17, 19, 22, 24, 29, 30; last upper row 1077-1337, median 1202), SHORT 37 (1.4%, 3 clips: clip07 656, clip08 606 and 595, clip13 709; 1080x608 is exact 16:9).
- Evidence: evidence/seam_stats.json (classes, tall_values, short_values), evidence/picks/seams1.jpg (red ticks = measured seam, checked by eye), evidence/picks/c30_60_crop.jpg (clip30@60 title split at 1193), evidence/picks/pick2.jpg (clip07@876-1080), evidence/picks/pick3.jpg (clip08@564)
- Confidence: medium (classes verified by eye on 50 runs; SHORT seen in 3 clips)

### L07. Fit every picture into the upper panel by cover crop (scale to fill 1080x959, centre crop) by default; put UI screenshots, posts and portrait pictures on a plain background as a card only when cropping would cut them; never use a blurred fill.

- Values: Random 128 of 845 top-panel shots, tagged by eye: cover 99 (77%), card on plain background 14 (11%), portrait picture centred on plain background 4, circle-masked graphic 6 (all clip21), collage 4, letterbox 1, blurred fill 0. By source: camera or generated video 38 cover / 2 pillar / 1 card (n=41); app UI and screen recordings 40 cover / 9 card / 2 pillar (n=51); web pages, articles, posts 5 cover / 3 card (n=8); graphics 16 cover / 1 card / 1 letterbox / 6 circle (n=24); collages 4. Implied crop (derived, not measured): 16:9 source loses 37% of its width, 9:16 source loses 50% of its height.
- Evidence: evidence/top_fit_sample_by_eye.json, evidence/picks/fit1.jpg, evidence/picks/fit2.jpg (crops of rows 0..seam, red box = automatic uniform-margin rectangle)
- Confidence: medium (by eye on a 15% sample; source aspect of cover-cropped footage cannot be recovered)

### L08. When a card sits on a background in the upper panel, keep it centred and either inset on all sides or flush with the seam; the background is the clip's plain colour (beige, mint, black, white or a gradient).

- Values: Measured uniform margins (left, top, right, bottom): clip05 39/39/39/0 on black (n>=5 samples 624-672), clip04@1860-1896 318/89/318/78 on beige (215.5 luma), clip01@36 366/187/348/0 on beige, clip06@2124 47/0/0/0 on near-black. Margins vary per clip; no single card size.
- Evidence: evidence/mode_labels.csv rows, numbers.json top_panel_fit; evidence/picks/fit1.jpg items 26-32, 48, 59-62; evidence/picks/c01_check.jpg (clip01@780 two cards)
- Confidence: low (examples only; margins come from an automatic uniform-margin test that also fires on UI screenshots with plain edges)

### L09. For a full-frame presenter shot use the whole frame (0,0)-(1080,1920) and keep it short: median 1.5 s.

- Values: FA 723 samples (16.4%), 27 clips, 190 runs, median 1.5 s, p10 0.5, p90 4.0, max 9.5. Variant FA+G (cards over the lower half of a full-frame presenter): 21 samples in clip06, 12, 24, 29.
- Evidence: evidence/mode_summary.json, evidence/sheets_final/clip23.jpg (118 FA samples), evidence/picks/pick7.jpg (clip24@888-1068 FA+G), evidence/picks/pick2.jpg (clip06@336-348 FA+G)
- Confidence: high

### L10. For a full-frame visual (footage, page, UI or graphic) fill the whole frame and keep the caption at y=960; hold it 2.5 s median.

- Values: FU 655 samples (14.9%), 25 clips, 103 runs, median 2.5 s (1.0-6.0, max 16.0). Caption lines in FU samples: 442 of 745 detected centred lines at y 940-980.
- Evidence: evidence/mode_summary.json, evidence/sheets_final/clip18.jpg, clip16.jpg, clip30.jpg; evidence/picks/capcrops.jpg (clip30@144 caption on full footage)
- Confidence: high

### L11. If wide footage is letterboxed on black, centre the strip on y=960 and move the caption above it (centre y about 500).

- Values: Strip rows 600-1319 (clip13@504, 540; 720 px) and 636-1283 (clip17@120, 204; 648 px), full width; FA-LB presenter strips 615-1333 and 635-1282; caption centre y 480-540 (31 of 34 detected lines). Presenter card on black (FA-CARD) x 180-899, y 365-1599 (clip13@744-792). Used only in clip13 (2026-05-25) and clip17 (2026-07-06): 39 samples, 0.9%.
- Evidence: evidence/letterbox_card_rects.json, evidence/picks/pick6.jpg (clip13@504, 648, 696, 744, 792, 804), evidence/picks/pick7.jpg (clip17@120, 204)
- Confidence: low (2 clips)

### L12. For a picture-in-picture, cut the presenter into a hard-edged circle about 400 px across (308-540), usually top-right (centre about 928,386), with no stroke or shadow; it may run off the frame edge.

- Values: Circle modes FU+C 80, ST+C 21, ST3+C 6 samples (2.4%) in clip03, 08, 11, 12, 30. Fitted diameters (constant within a clip): clip03 308-416, clip08 356, clip11 396, clip12 484, clip30 540. Centres: top-right in 7 of 12 fits (x 816-952, y 202-466); clip08@1032 on the seam (556,1052); clip08@924 (848,892); clip30@264 left (144,1176, 126 px off-frame); clip03@732 top-left (118,372). Edge, stroke, shadow read by eye.
- Evidence: evidence/pip.jsonl, evidence/pip2.jsonl (12 verified fits), evidence/picks/pip.jpg, evidence/picks/pip2.jpg, evidence/picks/pipedge.jpg (full-res edge crops clip12@660, clip30@264)
- Confidence: medium (5 clips; edge style by eye)

### L13. A presenter rounded card at the bottom over a full-frame screen recording is a one-clip variant: rect 75-1003 x 1485-1920, corner radius about 20, running off the bottom edge.

- Values: FU+R 37 samples, clip11 only (2026-04-11), runs 7.5 and 11.5 s. Measured edges: left 75-76, right 1002-1003, top 1485 (frames 12-180); second size 97-969 x 1492 (frames 540-600). Bottom edge not found (off-frame). Radius, stroke, shadow by eye.
- Evidence: evidence/letterbox_card_rects.json (FU+R_presenter_card_clip11), evidence/picks/c11.jpg, evidence/picks/pick4.jpg
- Confidence: low (1 clip)

### L14. To compare two visuals without the presenter, stack them full width at the same seam as the split; add a third row or a presenter circle only rarely.

- Values: ST 140 samples (3.2%), 13 clips, 21 runs, median 3.0 s (1.0-5.5). Seam of two-row stacks: 49 of 112 measurable samples at 955-964 (the rest are internal edges of the pictures or other row splits). Three-row variants: S3P (two visuals over the presenter, rows about 0-638 / 638-1233 / 1233-1920 in clip20@1728-1788) 12 samples in 2 clips; ST3+C 6 samples clip08. 2x2 grid with the presenter in one cell (GR) 10 samples clip11.
- Evidence: evidence/mode_summary.json, evidence/picks/pick3.jpg (clip08@1140, 1476, 1512), evidence/sheets_final/clip19.jpg, clip20.jpg, clip25.jpg
- Confidence: medium

### L15. Centre caption lines at x=538, y=960 (on the seam), baseline 974, letter height 28, in every mode that has no letterbox strip.

- Values: Per-clip median centre y 958.5-963.5 (28 of 30 clips 959-960; clip16 963.5, clip18 958.5), baseline 972-978 (median 974), letter (component) height 24-32 (median 28), centre x 537.5-540, n=3512 lines in the band 925-1000. Histogram of centred lines by mode: SP 2275/3165 at 940-980, FA 508/586, FU 442/745, ST 109/182, FU+C 75/110.
- Evidence: evidence/caption_stats.json, evidence/picks/capcrops.jpg (clip01@300, 504, 1356; clip30@144, 264), numbers.json captions
- Confidence: high

### L16. When the seam moves to a short-top split, move the caption onto the new seam; in a tall-top split keep it at y=960 unless the video's opening title split puts it on the seam.

- Values: SHORT: on the new seam (centre y = seam -10..+80) 26 samples (clip07 665 at seam 656, clip13 781 at 709), at 960 8 (clip08@1332-1368). TALL: at 960 77 samples (clip01, 03, 12, 13, 17, 19, 24, 29), on the seam 24 (clip12 1222-1230 at 1218-1230; clip30 1199 at 1193).
- Evidence: numbers.json captions.when_seam_moves, evidence/mode_labels.csv, evidence/picks/c30_60_crop.jpg
- Confidence: medium

### L17. Keep caption text at least 199 px from the left and 210 px from the right edge; titles may use the full width and may bleed off the edge.

- Values: Caption extents over 3512 lines: leftmost x 199, rightmost x 870 (widest line 671 px, clip06); median line width 115-353 per clip. Opening titles: x 12-1080 (clip19 12-853, clip03 120-812, clip09 220-1080 cut at the right, clip27 210-1080).
- Evidence: evidence/caption_stats.json (x0_min, x1_max, width_max), evidence/picks/titles.jpg
- Confidence: high for captions, medium for titles (15 clips)

### L18. Place the opening title on the upper visual of a split, centred, with its bottom edge about 55 px above the seam (y about 904), or as one word centred on the seam.

- Values: Bottom edge of the opening title block: median 904, range 742-1155 (n=15 clips). Above the seam in 9 clips (742-933), on or across the seam in 6 (996-1155: clip04, 21, 24, 27, 29, 30). clip30 uses a tall-top split (seam 1193) under its title.
- Evidence: evidence/picks/titles.jpg (16 opening frames with the measured seam ticked), numbers.json opening_titles
- Confidence: medium (title boxes by text detection, accepted by eye; the hook analyst owns timing)

### L19. Change layout with a hard cut on a single frame; never slide or resize the seam between layout classes.

- Values: Of 565 changes of layout family between consecutive samples, 542 (95.9%) contain a single-frame cut (thumbnail difference > 10 and > 3x local median) inside the 12-frame window; 23 do not (label noise or content moving inside one layout; checked every frame for 5 of them). Within split runs without a cut, 1411 of 1523 consecutive sample pairs (92.6%) keep the identical seam row; the 59 that move by >= 2 px are slow scale moves of an upper card (clip07@216-252 959 to 932, clip06@2616-2664 913 to 923).
- Evidence: evidence/mode_changes_vs_cuts.json, evidence/picks/transition_strips_every_frame.png (clip19@1900-1925, clip08@322-339, clip07@274-291, clip18@310-327, clip20@496-515)
- Confidence: high for cuts; the motion analyst should confirm transitions frame by frame

### L20. Let an upper visual that is not a full-bleed cover end a few px short of the presenter; do not stretch it to the seam.

- Values: Runs with the last upper row well above 959 while the presenter panel stays put: clip02@2088-2208 938 (11 samples), clip10@864-912 and @1020-1056 922-935, clip15@684-756 915-918, clip21@1572-1608 909-913, clip22@756-816 903-904.
- Evidence: evidence/mode_labels.csv (upper_last_row), evidence/picks/seams1.jpg (02:2148, 10:888, 10:1032, 15:720, 21:1584, 22:780)
- Confidence: low (what fills the gap was not measured; read by eye as the visual's own background or black)

### L21. Use the same geometry for every video regardless of date: seam, caption and panel rectangles did not change between March and November 2026.

- Values: Per-clip modal seam: 2026-03-11..04-11 (clip01-11) 955-961; 05-11..07-09 (clip12-19) 956-960; 08-07..11-15 (clip20-30) 952-960 (no monotonic trend). Caption centre y 960 in all three periods. Family shares by period (split/face/full/pip/stack): 64.0/16.6/10.4/7.3/1.7% (11 clips, 1677 samples); 52.5/19.0/21.2/2.4/4.9% (8 clips, 1082); 62.7/16.7/16.7/0.4/3.5% (11 clips, 1645).
- Evidence: evidence/time_groups.json, evidence/seam_stats.json per_clip (with dates), evidence/caption_stats.json
- Confidence: high

### L22. Treat the presenter circle, the presenter card, the grid and letterbox strips as dated variants: circles were mostly an early-period device (Mar-May), letterbox strips appeared only May-July.

- Values: Circle PIP: clip03 (03-24), clip08 (04-06), clip11 (04-11), clip12 (05-11), clip30 (11-15, 6 samples only). Rounded card and grid: clip11 only. Letterbox and presenter card on black: clip13 (05-25), clip17 (07-06). PIP family share 7.3% in Mar-Apr, 2.4% May-Jul, 0.4% Aug-Nov.
- Evidence: evidence/time_groups.json, evidence/mode_summary.json (clips lists), evidence/sheets_final/clip03.jpg, clip08.jpg, clip11.jpg, clip12.jpg, clip13.jpg
- Confidence: medium

### L23. Never use: a blurred fill behind a picture, a line or shadow on the seam, a left/right split of the frame (except the one 2x2 grid), the presenter above a visual as panels, or a seam that animates between positions.

- Values: Blurred fill 0 of 128 sampled shots; seam line/shadow 0 of 12 lossless frames and none visible on 1915 measured split samples; left/right split 0 samples outside GR (10 samples, clip11); presenter-over-visual panels 0 samples (the FA+G cases are cards floating over a full-frame presenter, 21 samples); animated seam moves between classes 0 (L19).
- Evidence: evidence/top_fit_sample_by_eye.json, evidence/seam_profiles_lossless.json, evidence/sheets_final/*.jpg, evidence/mode_changes_vs_cuts.json
- Confidence: medium (absence claims rest on the 2/s samples and a 128-shot sample)

### L24. Presenter rectangles per layout: split [0,959)-[1080,1920) (1080x961); tall-top split about [0,1203)-[1080,1920) (1080x717); short-top split about [0,608)-[1080,1920) (1080x1312); full-frame presenter [0,0)-[1080,1920); circle 308-540 px; card 928x435 visible.

- Values: Derived from L03, L06, L12, L13 and the letterbox/card measurements; the presenter analyst measures face size and eye line inside these rectangles.
- Evidence: numbers.json build_spec, evidence/seam_stats.json, evidence/letterbox_card_rects.json, evidence/pip.jsonl
- Confidence: medium

## Constant and variable

CONSTANT: canvas 1080x1920 on black; full-width panels; the split's seam is a hard cut with no line, gap, shadow or feather; the presenter is a fixed full-width layer under the upper visual; captions centred at x 538 and y 960 in every clip and in split, face, full and PIP modes; layout changes are hard cuts; geometry unchanged from 2026-03-11 to 2026-11-15 (including the 720p clips). VARIABLE: the exact seam row per clip (last upper row 952-961, driven by how each video's upper visuals were scaled, not by date); the seam class per shot (half 94% of split time; tall 1077-1337 for titles, stacked cards and tall UIs; short 595-709 for uncropped 16:9 footage); how pictures sit in the upper panel (cover 77%, card or portrait on a plain background 14%, other 9%) driven by the source (video almost always covered, UI and posts sometimes carded); the mix of modes per clip (split 20-100%); circle PIP size per clip (308-540) and position; rare variants (letterbox, presenter card, grid) limited to single periods.

## Open questions

- Why the seam row differs by clip (952 in clip23, 961 in clip06): an editing template at another resolution or per-clip scaling. The project file or a second render of one video would decide.
- Whether the tall-top and short-top splits are templates or one-off fits of a given picture: tall in 11 clips with seams spread 1077-1337, short in 3 clips. More clips, or the editor's template, would decide.
- Source aspect of cover-cropped footage in the upper panel is not recoverable from the output; the builder must decide crop anchoring (centre crop assumed).
- Whether a dark translucent box behind caption words is used only on bright backgrounds (seen in clip01, clip07, clip12, clip24; not in clip13, clip30): the type analyst should decide; the box-side luma test here was inconclusive.
- What fills the few rows between a short upper card and the presenter layer (L20): black canvas or the card's own background; a lossless check of those runs would decide.
- Which spoken content triggers each mode (structure and graphics analysts' tables); this study did not use transcripts.

## For a person to check

- Scan evidence/sheets_final/clip03.jpg, clip08.jpg, clip11.jpg, clip12.jpg, clip13.jpg: the most mixed clips, labelled largely by eye at 72 px (circle PIP, stacks, letterbox).
- Watch a few full-frame presenter to split cuts (e.g. clip23 around frames 264-288 and 2196-2220) to confirm the hard cut and the absence of a seam slide; the analysis saw only 2/s samples and 72x128 per-frame thumbnails.
- Look at evidence/picks/fit1.jpg and fit2.jpg and confirm the by-eye fit tags in evidence/top_fit_sample_by_eye.json (cover vs card vs pillar).
- Look at evidence/picks/pipedge.jpg and confirm the presenter circle has no stroke or shadow, and evidence/picks/c11.jpg for the card's corner radius.
- Look at evidence/seam_zoom_x8.png to confirm no line or shadow at the seam.
- Nothing was listened to or watched in playback; segment lengths are quantised to 0.5 s.
