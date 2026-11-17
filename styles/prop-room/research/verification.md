# Verification

An independent verifier re-measured, with methods written from scratch, every quantity that two of the nine dimension studies disagreed on and every number the build hard-codes: 17 seeded items, then the low-confidence rules a builder needs (12 more), 29 items in all. The verifier did not read or run the analysts' scripts, and used clips the analysts had not cited where it could. Methods: a calibrated BT.709 limited-to-full decode proven on 339 white and 37 black patches (Y 235 -> 255, Y 16 -> 0); every-frame passes over all 20,881 frames; its own Apple Vision probe; headless-browser font renders overlaid on native crops; ECC and SIFT registration; ffmpeg ebur128.

Result: 8 items confirmed, 7 settled for one of the competing claims (verdict A or B), 6 settled for neither claim with a new value, 8 left open (not re-measured). Nothing was listened to or watched in playback; prop shading and the audio effects were not re-measured. The explanation pass ([explain.md](explain.md)) ran at the same time and has not been verified.

Verdict key: A or B, the first or second listed claim holds; confirmed, the only claim holds; neither, both claims are replaced by the verified value; open, not re-measured. Each dimension note carries the result under the rule as a "Verified" line and states the rule with the verified value. The open items for the owner are listed in [README.md](README.md).

## 1. Caption plate fill and opacity

- Claims: colour [C14]: rgba(53,51,52,0.63), normal alpha; per clip 0.57-0.69, clip17 0.38, clip19 0.81; type [T16]: #3F3F3F at 82 % blended in linear light; gamma fallback rgba(70,69,70,0.70)
- Verified value: linear light: fill #403F3F (64,63,63) at opacity 0.823, rms 1.5 levels, bias <= 0.3 levels in every background bin; per clip 0.821-0.828 in 19/19 (clip17 0.823, clip19 0.823). Gamma-space fit #484444 at 0.697, rms 4.2, bias -4.5..+4.3 (curved). Claim colour: bias +18.5 levels on dark backgrounds; claim type: |bias| <= 0.6.
- Method: Temporal pairs: the same pixel uncovered on one frame and covered on the next (or the reverse) at the ends of the plate when its width changes, static background on both sides (2 frames each), no picture cut, glyph and shadow pixels masked; 168,971 pairs from 554 caption changes; robust per-channel fits of both blending models.
- Clips: all 19 (pairs per clip 3,993-13,960)
- Verdict: B: the second claim, type [T16], holds; the colour value is corrected
- Note: The colour analyst fitted a gamma-space line on spatial pairs, so its alpha moves with the background mix (0.62-0.72 in gamma space here) and its clip17/clip19 outliers are artefacts. Builder: #3F3F3F at 0.823 in linear light. Evidence: V01_plate_pairs_fit.json, V01_plate_pairs_scatter.png.

## 2. Caption plate geometry

- Claims: layout L14/L15: split plate 908-987 (1003 with descender), other 1209-1287 (1304); pads 13 top, 11 below ink, 15 sides; fixed rows; type T14/T15: ink box + 16.4 left/top, + 14.5 right/bottom; 85 px (102 with descenders); radius 19; plate top follows the ink
- Verified value: Plate hugs the ink: ascender lines top 1206.18 (low slot) / 905.19 (seam slot), x-height-only lines top 1218.6 (12.4 px lower); height 84.86 (p10-p90 84.8-86.0) without descender, 101.8 with; pads to the white-ink box: left 15.65, top 15.8, right 13.3, bottom 14.0; centre x 539.0; corner radius 18.25 (p10 15.25, p90 19.75, n=371 corners).
- Method: Caption crops at each group middle frame; plates on bright flat backgrounds (n=234 in 19 clips); sub-pixel edges from a coverage model on row/column profiles; corner circles fitted to coverage-derived boundaries.
- Clips: all 19 (low slot); seam slot top from 174 crops
- Verdict: B: the second claim, type [T14]/[T15], holds; the plate hugs the ink
- Note: Layout read integer rows of the most frequent case and missed that x-height-only lines get a shorter plate. Type pads are measured to luma >= 226 ink, the verifier's to luma > 200, which explains the ~0.5 px difference; the right/bottom pads are ~2 px smaller than left/top in both (shadow side). Evidence: V02_plate_geometry_summary.json, V02_plate_radius_and_slotA.json.

## 3. Caption baselines, size and weight

- Claims: layout L14/L15: baseline 975 and 1276, cap top 921 and 1222; type T01/T02/T06: Inter Bold about wght 730, 76 px, baselines 973 and 1274
- Verified value: Inter variable wght 730, opsz 26, 76 px, letter-spacing -1 px is the best of 60 renders (forward-model rmse 45.2 vs 47.3 for wght 700/77 px and 47.8 for 760); fitted alphabetic baseline 1275.5-1275.75 in the low slot (median 1275.62) -> 1276, seam slot 975 (slots 301.0 px apart from plate tops 905.19/1206.18); ink cap top rows 921/1222.
- Method: Headless-browser renders of the OCR text at 4x, quarter-pixel alignment to native crops (36 lines, 19 clips, low slot, bright flat backgrounds), forward model G + (1-G) plate (1 - op S) in linear light, grid over weight/size/opsz/tracking; baseline from an H probe in the same render.
- Clips: all 19 (clip01-clip19, 36 lines)
- Verdict: neither as a whole: type is right on weight, size, optical size and tracking; layout is right on the baselines
- Note: Weight, size, optical size and tracking: type is right. Baselines: layout is right (975/1276); type 973/1274 is 2 px high. The absolute model rmse is high because codec softening of edges is not modelled; only the ranking is used. Evidence: V03_V04_caption_font_and_shadow_fit.json, V03_inter730_render_vs_native_clip01@162.png.

## 4. Caption glyph shadow

- Claims: colour [C15]: hard black, 2-3 px down and right, no visible blur; type [T17]: offset +2.75/+2.5, spread 2, sigma 1.5, opacity 1.0, linear light
- Verified value: Plate-relative brightness beyond glyph edges (median of 10,184 bottom and 13,792 right edges): +2 px 0.04, +3 0.10, +4 0.28, +5 0.50, +6 0.72, +7 0.88, +8 0.97; top/left control 0.88-0.92 at +1..+2 px then 1.0. Half point 4.5 px beyond the edge, 10-90 % width about 4 px -> offset+spread about 4.5 px, sigma about 1.5 px, opacity about 1.
- Method: Direct edge profiles on the 36 native lines (bottom edges of strokes, right edges of stems; top/left edges as control); a forward-model grid fit gave dx = dy = 3.5, spread 2, sigma 1 but with a poor absolute fit and is not used.
- Clips: all 19 (36 lines)
- Verdict: B: the second claim, type [T17], holds
- Note: Type is right: the shadow is near-black for about 3 px and fades out by 8 px, so "hard 2-3 px" undersells its reach. Evidence: V04_caption_shadow_profiles.json, V04_caption_shadow_zoom_clip01@162.png.

## 5. Closing keyword: position, size, shadow, timing, glyphs, size rule, open serif

- Claims: layout [L18]: centre (540, 1388), baseline about 1451, <= 703 px wide, size 109-140; hook H19-H21: top 1318, height 133, width 381 + 72/letter, cuts in +1.1 f after the spoken keyword; type T19-T23: cap top 1324, baseline 1449, cap 109-140, U+201C + U+0022, shadow +14/+14 sigma 4 spread 4, +0.8 f, hold 58 f, size r = -0.78, Georgia Bold IoU 0.69; colour [C16]: soft black shadow darkest about 9 px below, offset (5,8), sigma 5, 0.85; structure [S15]: +1.4 f
- Verified value: Onset (every-frame keyword-band ink) minus spoken keyword +1.1 f median (-6.6..+6.3, n=19), after "comment" +11 f (6.4-17.7), after the close cut +34 f (10-70), hold 58 f (46-126); first-frame area 0.965 of +3 f (18/19 >= 0.92; clip19 0.56 over a white shirt). Letters: cap top 1324 (1313-1337), baseline 1448.5 (1423-1474), cap height 126.5 (109-140), ink centre x 537 incl. quotes; width incl. quotes = 373 + 73.5 x letters (r 0.88); cap = 158 - 6.1 x letters (r -0.69, sd 5.8, n=14). Shadow (6 light-background clips): offset 12-14 px right and down, spread 4-6, sigma 4, opacity 0.95-1.0 (median 13/13/5/4/0.97). Quotes: curly U+201C opening, straight U+0022 closing (by eye, 4 clips). Serif: Georgia Bold 0.611 (best on 5/14), PT Serif Bold 0.604 (3/14, OFL), Playfair Display Bold 0.597 (OFL), STIX Two Text Bold 0.588 (OFL), Times NR Bold 0.567, Charter Bold 0.564, Fraunces SuperSoft Bold 0.554, Iowan Bold 0.507, DM Serif Display 0.454.
- Method: Keyword onset from an every-frame white-ink-with-shadow detector in y 1285-1505 during the close; geometry from the change between the frame before onset and the onset frame (letters only for cap/baseline); shadow by grid fit of a dilated, shifted, blurred glyph mask to the darkening ratio; serif candidates rendered in a headless browser (2x) at the measured cap height with 3 sizes x 4 trackings, soft IoU after half-pixel alignment (14 clean clips).
- Clips: timing and geometry all 19; font 14 (clip01-06, 08-13, 15, 16); shadow clip01-05, clip19
- Verdict: B: type is confirmed on position, shadow and quotes; layout, hook and structure agree within the measurement error; the colour shadow is rejected; the size rule is corrected
- Note: Type is confirmed on position, shadow and quotes; layout/hook agree within the measurement error (hook top 1318 includes the quote marks; layout baseline 1451 is a line-box bottom). Colour shadow (5,8) is rejected. Timing claims +0.8/+1.1/+1.4 f are all the same within ASR error (+-2 f). Size per word is loose (r -0.69): use the width rule or the clamp. No installed serif fits well; open-licensed choice: PT Serif Bold, within 0.007 of Georgia Bold. Evidence: V05_keyword.json, V05_keyword_font_scores.json, V05_keyword_shadow_fit.json, V05_keyword_quotes_and_alpha_clip01_08_13_16.jpg.

## 6. Seam y

- Claims: layout L05/L06: 959.5 (956.6 in clip01-03); motion [M26]: about 958; presenter [P02]: 960 (957 in clip01-03); 959.66 by 50 % crossing
- Verified value: Panel bottom edge (rows fully covered + coverage of the edge row): clip04-19 median 959.60 (per clip 959.04-959.76), clip01-03 956.68 (all three); stable within clips (p10-p90 spans <= 0.5 px except clip17 958.05-959.65).
- Method: Coverage model on full-resolution row means of the left and right 200-px strips, every SPLIT frame with >= 40 levels contrast across the seam and flat sides (8,700 estimates).
- Clips: all 19
- Verdict: A: the layout value holds; the presenter value agrees; the motion value is a binning artefact
- Note: Layout and presenter agree (definitions differ by < 0.2 px); motion's 958 is a 4-px-bin artefact. Builder: panel rect height 960 (959.6 measured). Evidence: V06_seam.json.

## 7. Layout changes: count, definition, runtime shares

- Claims: structure S01/S06: 278 changes (270 with a caption change), every 62 f, shares insert 50.2 / split 36.7 / presenter 13.1 %; layout [L01]: 277 changes; SPLIT 36.5 / FULL 50.4 / PRESENTER 4.4 / CLOSE 8.6 %; motion [M01]: 343 cuts, 276 layout
- Verified value: One table (frames at 29.97 fps, 20,881 frames): FULL 50.4 % (121 runs, median 84 f), SPLIT 36.5 % (124 runs, 58 f), PRESENTER mid-clip 4.4 % (32 runs, 27.5 f), CLOSE 8.6 % (19 runs, 92 f); 277 layout changes, interval median 62 f (p10 29, p90 114). The verifier's run table equals the layout analyst's frame for frame in 19/19 clips. Structure differs in 3 places: an extra S run at clip16@894-934 (frames are FULL), clip11 insert start 344 vs 345 and clip19 close start 1126 vs 1128 (by eye on every-frame strips: 345 and 1128). Picture cuts: 320 strict cuts (mean |dY| >= 20 and >= 3x both neighbours), 51 of them inside a layout run; 8 layout changes have no strict cut (dim-then-card, e.g. clip11@344-345).
- Method: Every-frame 108x192 luma thumbnails; shots between cuts; each shot labelled by correlation with the clip's own split-bottom room reference and its closing presenter frames; runs merged; boundary disagreements checked on full-resolution every-frame strips.
- Clips: all 19
- Verdict: A: the structure shares agree once its P is read as PRESENTER plus CLOSE, and the layout table matches frame for frame; structure has one false run and motion counts a different quantity
- Note: Structure's P 13.1 % = PRESENTER + CLOSE (4.4 + 8.6 = 13.0), so shares agree; its 278 includes one false run. Motion's 343 counts picture cuts including scene cuts inside a layout, a different quantity. Evidence: V07_layout_runs_and_cuts.json, V07_layout_runs_sheet.jpg, V07_disputed_boundaries.jpg, V07_V17_cadence.json.

## 8. Presenter framing

- Claims: presenter P05-P11: split IOD 137, eye line 1277, face box 347, face centre x 528, head top 49 below seam; full IOD 260, eye line 691, face 652, zoom 1.918 (1.887-1.930); hook [H16]: close-up face 652, 1.9x
- Verified value: Split (769 frames): eye-centroid IOD 136.5 (pupil IOD 142.5), eye line 1274.3 (p10 1228.8, p90 1326.1), face box 344.1, face centre x 529.5, chin 1534.5, head top - seam 47.5 (p10 21, p90 70). Full height (528 frames): eye-centroid IOD 259.2, eye line 687.1, face box 649.2, centre x 541.9, head top 155.7, chin 1177.3. Zoom: IOD ratio 1.915, SIFT similarity on the room 1.915 (per clip 1.82-1.96, noisy); window in split px left 241, top 922, right 800, bottom 1937.
- Method: Own Vision probe (face landmarks + person matte) on every 10th SPLIT frame and every 5th full-height frame; SIFT + RANSAC similarity between split box and full-height frames.
- Clips: all 19
- Verdict: confirmed
- Note: All presenter numbers reproduce within 3 px; IOD depends on definition (eye centroid 136.5/259.2 vs pupils 142.5/270.7). Builder: use the presenter analyst's values. Evidence: V08_presenter.json.

## 9. Picture entrance on a cut

- Claims: motion M05/M06/M08/M09: scale from about 0.84 on cubic-bezier(0.16,1,0.3,1) over about 15 f, fit error 0.023, n=19; fades near-linear about 9 f; 13 % of cuts open on the empty plate for 1-2 f; structure [S07]: 15 % of cuts complete 1-3 f after the cut
- Verified value: Scale-ins (7 clean monotone tracks in clip07, 09, 10, 17, 18): scale on the cut frame 0.88 median (0.71-0.95), fitted start 0.85; easeOutExpo / cubic-bezier(0.16,1,0.3,1) best (median rmse 0.039-0.040 in progress units vs easeOutCubic 0.050, linear 0.058); t50 about 1.2 f after the cut; duration poorly constrained (2.5-39 f). Empty plate on the cut frame (picture-region contrast < 0.35 of frame +10): 20 of 316 cuts (6.3 %); content after 1 f in 7, 2 f in 3, 3-9 f in 10. Fades not re-measured.
- Method: ECC affine registration (270x480, caption bands masked) of each of the first 28 frames to frame +27 of 142 shots in 10 uncited clips; constrained fits of 6 named eases with free duration and sub-frame start; plate-first from every-frame thumbnails.
- Clips: clip07, 08, 09, 10, 12, 13, 14, 16, 17, 18
- Verdict: confirmed; the empty-plate share is about half the claimed one
- Note: Start scale and ease confirmed (n=7, small). The empty-plate share is about half the motion figure with the verifier's definition (6 % vs 13-15 %): treat as an occasional device (about 1 cut in 10-15). Evidence: V09_cut_entrances.json, V09_plate_first.json.

## 10. Prop entrances during a hold

- Claims: motion M10-M17: pop 45 %, slide about 56 px (49 % from below), grow from 0.78, fade, land from 1.16-1.27; 11-14 f, same ease; stagger about 4 f
- Verified value: Sample of 25 events located from the motion event table in clip08, clip10, clip17, re-tracked with an own scale+translation template tracker: about 12 usable. Pops complete on the first visible frame (3/3 usable, scale 1.00, offset <= 2 px); slides 23-128 px (from below 86 px, from right 128 px, from above 23 px), settle 1-11 f; grow from 0.82 (settle 8 f); land from 1.24 (settle 4 f). The rest were false early matches on smooth plates.
- Method: matchTemplate with scale search 0.5-1.3 against the settled prop (first visible + 14 f), every frame from -2 to +14.
- Clips: clip08, clip10, clip17
- Verdict: confirmed at low n
- Note: Consistent with the claims at low n; the class shares (45/20/10/7/2 %) and the 4-f stagger were not re-measured. Evidence: V10_prop_entrances_sample.json.

## 11. Push-in on held pictures

- Claims: motion [M19]: about 0.8 % per second (p10 -0.3, p90 1.7), 63 % of holds; separate move or tail of the ease?
- Verified value: 12 clean holds (registration rmse < 0.1 %) in clip07, 08, 09, 10, 12, 14: 8 push in, 4 static (|rate| < 0.2 %/s); rate among pushing holds 0.27-1.86 %/s (median 0.59), all clean holds median 0.34 %/s. First-half vs second-half rate equal (median 0.54 vs 0.62 %/s): a constant-velocity linear move, not the decaying tail of the entrance ease (which is done by about 15 f).
- Method: ECC affine registration of every frame of 60 holds (31 FULL, 29 SPLIT panels, none in the motion analyst's hold table) to the hold's last frame; linear fits from cut+20 to the end, split-half slopes.
- Clips: clip07, 08, 09, 10, 12, 13, 14, 16, 17 tracked; clean: clip07, 08, 09, 10, 12, 14
- Verdict: neither: a separate linear push-in at about 0.6 %/s on about 2 of 3 holds
- Note: It is a separate linear push-in, present on about 2 of 3 holds, at about 0.6 %/s (0.3-1.9) where present; the 0.8 %/s figure is within the spread but high. Evidence: V11_hold_push.json.

## 12. Card and prop shadows, card geometry

- Claims: graphics [G16]: cards 914 wide, 84 px insets, radius 34, shadow 0 22-28px blur 32-44px black 22 % (2 fits); colour C19/C20: floating props 0 68px 102px -36px at 0.53, warm; UI cards a tighter shadow
- Verified value: Cards found automatically on pale plates: clip06@390 x 84, width 919 (growing 898->924 over 50 f), radius 30-33; clip12@320 x 74, width 932, radius 29-30; clip02@990 width 549, radius 25. Shadow below at 5/10/20/30 px: 0.21/0.17/0.09/0.05 (clip06, clip12), 0.13/0.08/0.04/0.01 (clip02); sides 0.04-0.085 at 3 px, 0.01-0.04 at 10 px, 0 by 20 px; above none. Fits: 0 31px 41px -27px rgba(0,0,0,0.43) (clip06, rms 0.008), 0 18px 25px -13px rgba(0,0,0,0.25) (clip02). The claimed 0 22px 32px 0.22 predicts 0.094/0.058 at 3/10 px beside the card (measured 0.054/0.014).
- Method: Every 10th frame of FULL/SPLIT runs: connected pure-white regions >= 500x120 px on flat pale plates; darkening profiles below/beside/above; CSS box-shadow model fitted jointly to the three profiles.
- Clips: clip02, clip06, clip12 (cards); props not re-measured
- Verdict: neither: card radius about 30 and a negative-spread shadow; the floating-prop shadow stays open
- Note: Card width/inset confirmed approximately (they scale in, so any constant is a moment in the push-in); radius about 30 rather than 34; the shadow needs a negative spread (sides much tighter than below). Floating-prop shadow (colour) not re-measured: open. Evidence: V12_card_shadow_fits.json, V12_cards_detected.json.

## 13. Pale plate

- Claims: colour C05-C07: #F8F5F8, top #FCF9F8, bottom #F3EBF4, corners TL #F9F7F6 TR #FAF7F8 BL #F1E7F4 BR #EFECF0; blobs drift in 64/167 holds at 1-35 px/s (unreliable)
- Verified value: 68 pale FULL holds in 16 clips: 10 flat #FFFFFF, 58 tinted. Tinted medians: top row #FBF8F5, bottom row #EFE8E3, TL #F8F5F3, TR #F9F5F3, BL #EAE4DF, BR #EAE4DD, left mid #F6EFEA, right mid #EFEDEC; top 12 levels lighter than bottom (lighter at top in 66 %); strongest edge tint (chroma median 40 levels) sits bottom-right 17, top-left 12, middle-left 11, top-right 8, bottom-left 5 of 58. Drift: corner colour changes >= 4 levels smoothly in 21/58 holds (median 6 levels/s), but optical flow of the tint field in 9 such holds gives 0.0-1.6 px/s (max 9.4, clip09): the colour changes are mostly content and fades, not travelling blobs.
- Method: Every-frame calibrated 27x48 thumbnails (40-px cells), outer 3-cell ring excluding the caption rows; Farneback flow on low-passed saturation images 1 s apart at 270x480.
- Clips: clip01-03, 05-09, 11-17, 19
- Verdict: neither: the pale plate recipe is restated and the tints are near-static
- Note: Recipe: vertical gradient from about #FBF8F5 at the top to about #EFE8E3 at the bottom (warm in the early clips, cooler later), one or two large pastel tints at opposite corners (bottom-right and top-left most often), static or drifting at <= 2 px/s. The colour analyst's lilac bottom is one family, not the median. Evidence: V13_pale_plate.json, V13_drift_flow.json, V13_drift_holds_strips.jpg.

## 14. The orange

- Claims: colour [C18]: main accent #E38056 (29.9 % of accent pixels, 19/19 clips); graphics [G22]: #E28056 is a third-party product mascot in 9 clips
- Verified value: No. Orange-hue pixels (15-30 deg) are 0.1-0.7 % of graphic pixels in most clips; the large shares are clip04 17 % (brick-wall cartoon scene), clip10 17 % and clip11 7.6 % (fields keyed to a product brand), clip18 5 %, clip16 3.7 % (skin in footage). By eye the largest regions are the mascot, a sunburst product mark, brand fields, skin, bricks, fire, an orange suit, a basketball rim, a cork board; the only drawn uses not tied to a mark are clip07 clock faces, a clip01 music-card gradient and a clip15 gauge outline (a clip on an AI-assistant topic).
- Method: Every 15th frame of FULL/SPLIT runs, HSV mask, connected components >= 3000 px saved and classified by eye on a sheet.
- Clips: all 19
- Verdict: neither: there is no orange house accent
- Note: #E38056 is the mascot's own colour, so the hue histogram ranks a third-party mark first. Do not ship an orange default accent; key the accent to the topic (the corpus does) or pick one per video. Evidence: V14_orange_summary.json, V14_orange_regions_sheet.jpg.

## 15. Caption grouping and hold

- Claims: type T07/T09/T10: 1-3 words, usually 2, median 9 chars, soft cap 14, hold median 15 f; hook [H04]: 33/53/14 % for 1/2/3 words (by eye), change every 13 f
- Verified value: 1,301 groups (OCR by own Vision probe, merged when text unchanged): 1/2/3/4+ words 30.0/53.7/15.0/1.3 %; chars median 9 (p10 5, p90 13), > 14 chars 2.1 %, > 17 0.8 %; hold median 15 f (p10 8, p90 25). Hook (groups starting in frames 0-179, n=220): 35.5/51.4/11.8 % and hold median 15 f.
- Method: Every-frame caption-core detector (white glyphs within 4 px of a near-black shadow pixel, rows of each slot only), slot chosen from the layout label, change points on the column signature; OCR of each group's middle frame.
- Clips: all 19
- Verdict: A: the first claim, type, holds; the hook's 13 frames is over-splitting
- Note: Hook's 13 f comes from false splits when a counter or animation behind the plate changes (checked by eye: clip16@70-94 one caption, clip15@74-83 one caption, clip12 matches). Evidence: V15_caption_group_stats.json, V15_caption_groups.json, V15_hook_false_splits_clip16@70-107_clip15@74-130.jpg.

## 16. Mix levels

- Claims: audio A01/A02/A14: master -14.1 LUFS, LRA 1.7, bed about 13 LU under (9-19, likely an upper bound), effects measurable only in voice-free bands
- Verified value: Integrated -14.1 LUFS (15 clips) / -14.2 (4), LRA 1.7 LU (1.2-2.1), true peak -0.6 dBTP median (-1.3..+1.3, only clip01 above 0), side/mid <= -69.9 dB (dual mono). Bed by per-bin minimum statistics (K-weighted): p10 -25.5 dB re mix (-28.8..-22.4), p5 -29.5; corrected for the p10-to-mean ratio of a noise-like bed (+9.8 dB) about -16 LU.
- Method: ffmpeg ebur128 (true peak) per clip; own STFT minimum-statistics bed estimate.
- Clips: all 19
- Verdict: confirmed for the master; the bed level stays a range
- Note: Master confirmed. Bed level stays a range: 13 LU (analyst, upper bound) to 25 LU (uncorrected floor); the verifier's best estimate about 16 LU under (about -30 LUFS at a -14 master). Effects not re-measured. Needs listening. Evidence: V16_loudness.json, V16_bed_minstat.json.

## 17. Graphic cadence

- Claims: graphics G03/G13: a new unit every 61.5 f, 84 % within +-3 f of a word; structure S06/S08: layout change every 62 f, 250 of 270 on a new caption group
- Verified value: Layout changes every 62 f (p10 29, p90 114, n=277); 259/277 (93.5 %) exactly on a caption-group onset, 266 (96 %) within +-1 f. Picture changes (layout changes + 51 scene cuts) every 53.5 f. Within +-3 f of a transcript word onset: 82.6 % of picture changes vs 61.6 % of random frames (words are dense).
- Method: Own layout runs and strict cuts (item 7) against own caption groups (item 15) and transcript word starts; random-frame control.
- Clips: all 19
- Verdict: confirmed: both claims hold and describe the same rhythm
- Note: Both claims hold; they describe the same rhythm. The word-sync figure is weak evidence (chance 62 %); the real anchor is the caption-group onset. Evidence: V07_V17_cadence.json.

## 18. Seam hairline (L08, low)

- Claims: layout [L08]: edge row about +10 levels lighter than the mix (16/19 clips)
- Verified value: Edge row minus coverage mix: median +2.0 levels (p10 -5.7, p90 +16.2), > 2 levels in 8/19 clips.
- Method: Row-mean profiles of every SPLIT frame, flat sides only, coverage from the item-6 seam.
- Clips: all 19
- Verdict: neither: no consistent hairline
- Note: Not reproduced as a consistent feature: do not draw a hairline. Evidence: V_lowconf_L08_M27.json.

## 19. Cassette reel spin (M21, low)

- Claims: motion [M21]: 13.3 deg/frame, spin-up 6 f (magnified reel)
- Verified value: Right reel inside the cassette card: 14.0 deg/frame steady (420 deg/s) from frame 414, ramping linearly from 2.5 deg/frame at 396 (about 18 f); left reel unreadable (pointer overlap).
- Method: Circular cross-correlation of the angular luma profile (radii 18-48 px) every frame, clip01@395-443.
- Clips: clip01 (same scene, other reel)
- Verdict: confirmed
- Note: Rate confirmed (13-14 deg/frame); spin-up length differs by reel (6 vs 18 f). Evidence: V_lowconf_M21_reel.json.

## 20. Repeated-frame cadence (M27, low)

- Claims: motion [M27]: 391 of 8,990 (4.3 %), spacing 5 and 10, mostly clip12, 18, 13, 09, 03
- Verified value: 468 repeats in 10,222 moving graphic frames (4.6 %); spacing 5 (68) and 10 (76); clip18 58, clip12 53, clip13 45, clip16 40, clip03 38, clip09 32.
- Method: Full-resolution mean |dY| of the picture region < 0.15 while both neighbours move > 1.0.
- Clips: all 19
- Verdict: confirmed
- Note: Inserted 24-fps-like material; do not imitate. Evidence: V_lowconf_L08_M27.json.

## 21. Land from larger, grow, pop (M07/M13/M14, low-medium)

- Claims: motion M07/M14: scene land 1.04 over 6 f; prop land 1.16-1.27 over 4-8 f
- Verified value: Sample: prop landing from 1.24 settles in 4 f (clip08@42); grow from 0.82 in 8 f (clip10@357).
- Method: Template tracker (item 10).
- Clips: clip08, clip10
- Verdict: confirmed at n=1 each
- Note: n=1 each; consistent. Evidence: V10_prop_entrances_sample.json.

## 22. Prop fades (M15, low)

- Claims: motion [M15]: see the analyst result
- Verified value: not re-measured.
- Method: none.
- Clips: none.
- Verdict: open
- Note: not re-measured (time); the sample had no clean fade

## 23. Stagger between props (M17, low)

- Claims: motion [M17]: see the analyst result
- Verified value: not re-measured.
- Method: none.
- Clips: none.
- Verdict: open
- Note: not re-measured: needs per-prop tracking of multi-prop beats

## 24. Motion blur on fast entrances (M18, low)

- Claims: motion [M18]: see the analyst result
- Verified value: not re-measured.
- Method: none.
- Clips: none.
- Verdict: open
- Note: not re-measured (one case)

## 25. Selection ring (M22, low)

- Claims: motion [M22]: see the analyst result
- Verified value: not re-measured.
- Method: none.
- Clips: none.
- Verdict: open
- Note: not re-measured (one case)

## 26. Fill/counter ease (M23, low)

- Claims: motion [M23]: see the analyst result
- Verified value: not re-measured.
- Method: none.
- Clips: none.
- Verdict: open
- Note: not re-measured (one case; easeInOutCubic over 28 f)

## 27. Prop shading, warm shadow, chrome, glow (C22-C25, low)

- Claims: colour C22-C25: see the analyst result
- Verified value: not re-measured.
- Method: none.
- Clips: none.
- Verdict: open
- Note: not re-measured (bespoke art, few instances)

## 28. High pings and prop sound textures (A20/A22, low)

- Claims: audio A20/A22: see the analyst result
- Verified value: not re-measured.
- Method: none.
- Clips: none.
- Verdict: open
- Note: not re-measured: needs listening

## 29. Keyword serif face (T20, low)

- Claims: type [T20]: see the analyst result
- Verified value: not re-measured.
- Method: none.
- Clips: none.
- Verdict: open
- Note: see the keyword item: no installed face fits; open-licensed best PT Serif Bold
