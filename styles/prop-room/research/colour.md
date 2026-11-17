# Colour

Measured: All 19 clips (697.1 s; 20,881 decoded frames at 29.97 fps). Every frame was decoded at 270x480 through a calibrated BT.709 limited-to-full conversion for layout masks (with an Apple Vision person matte) and plate movement; every 5th frame (4,185 frames) was decoded at full 1080x1920 for plate fits, presenter statistics and caption-plate samples; props were measured on 13 hand-picked instances. Calibration: flat white reads Y 235 -> #FFFFFF (ffmpeg default #FDFDFD), black Y 16 -> #000000; BT.709 for the untagged clips is confirmed indirectly through skin hue. The graphics sit on a plate chosen per scene: mostly pale, then dark fields, saturated fields keyed to the subject, and photos or full scenes.

Not done: Nothing was listened to or watched in playback; motion statements come from every-frame low-resolution corner traces and strips. Prop rendering was measured on 13 hand-picked instances (boxes by eye), of which 5-6 gave clean shadow profiles; there is no automatic inventory of every prop. No depth-of-field measurement, and no colour measurement inside photo inserts beyond classifying them. Mid-clip full-height presenter shots were not used for presenter colour. Caption plate radius, padding and size were left to the type study (only the top padding, 14 px, was recorded).

Evidence is cited as `clipNN@frame` (frames at 29.97 fps, counted from 0; ids are this style's own). File names in Evidence lines name files of the local study; they are not shipped. "Verified" lines give the independent verifier's verdict and final value; item numbers refer to [verification.md](verification.md).

## Rules

### [C01] Decode every reference colour as BT.709, limited range expanded to full (Y 16-235, CbCr 16-240); a default ffmpeg rgb24 extraction reads 2 levels low on white.

- Values: Flat white patches (16x16, Y std<0.8): raw Y median 235, U 128, V 128 -> #FFFFFF calibrated, #FDFDFD (253,253,253) with ffmpeg default; n=410 patches with Y>=233 in 19/19 clips (671 with Y>=228). Flat black: Y 16, U/V 128 -> #000000 in both decodes, n=29 (466 with Y<24). Pixels above Y 235 per clip 0.17-1.33 % (highlight overshoot), Y p99.99 239.5-244.3. Offset default-vs-calibrated: -2 levels at white, 0 at black.
- Evidence: n=152 frames (8 per clip x 19); clip01@532 white UI card x354 y690, clip03@488 black field x274 y370; C01_calibration_patches.png, C01_calibration.csv
- Confidence: high
- Verified, confirmed (verification pass): the calibrated decode reads Y 235 -> 255 and Y 16 -> 0 on 339 white and 37 black patches.

### [C02] Use the BT.709 matrix for all clips, tagged or not: only clip16, clip18 and clip19 carry bt709 tags, and the untagged clips only agree with them under BT.709.

- Values: Same room and lighting (blue-violet set): presenter skin hue under BT.709 = 13.1-14.4 deg in the 8 untagged clips (clip08-13, 15, 17) vs 14.0-14.3 deg in tagged clip16 and clip18; decoding the untagged ones as BT.601 would put them at 8.9-10.4 deg (4 deg off). Greys are matrix-independent, so C01 is unaffected.
- Evidence: n=10 clips sharing one room; ffprobe tags in numbers.json meta; C_presenter_per_clip.csv
- Confidence: medium (indirect proof through skin hue; no patch of known chroma exists)

### [C03] Add no grain and no noise to plates: they are clean to the codec floor, the same floor as the presenter room.

- Values: Spatial noise (Y minus 5x5 mean) on plate inlier blocks: median 0.55 levels (range 0.11-3.56; the high values are dot grids / mesh blobs, not grain). Presenter room: 0.36-0.41. Temporal (consecutive frames) on plates: median 0.38 (0.02-4.97; high values are drifting mesh plates, clip15, clip19), room 0.02-0.28. At 1.2-2.4 Mbps VP9 holds flat areas static; any grain below ~2 levels would not survive.
- Evidence: n=38 frame pairs (longest full-frame and longest split hold in each of 19 clips), e.g. clip09@825-826 plate 0.04/0.11, clip01@536-537; C_grain.csv
- Confidence: high (for 'no visible grain'); the codec limit means fine grain could not be proven absent at source

### [C04] Choose the plate behind every graphic from this mix (share of graphic runtime): pale 66 % (soft pale gradient 44.6 %, flat white 15.3 %, solid pale tint 6.5 %), dark field 17.0 %, saturated field 7.2 %, busy (photo or full illustrated scene, no plate) 7.5 %, mid-tone 2.0 %.

- Values: 16,494 graphic frames (split panel + full-frame inserts) in 348 segments; split panels: pale 62.9 %, dark 18.7 %, saturated 9.4 %, busy 7.0 %; full-frame: pale 68.9 %, dark 15.7 %, saturated 5.5 %, busy 7.9 %. Pale is used in 19/19 clips, dark in 13, saturated in 9. Dark excluding clip16 (film stills): 16.2 %.
- Evidence: n=3,317 plate fits on every 5th frame of 19 clips; C_plates_segments.csv, C_plate_swatches.png (every segment's corners, time order), C_plates_per_clip.csv
- Confidence: high

### [C05] Draw the default pale plate as an off-white #F8F5F8 (luma 245) with a faint tint, never a saturated pastel: plate chroma median 7 levels.

- Values: Pale samples: luma median 244.9 (p10 229.4, p90 254.7); chroma (max-min channel) median 7.2 (p10 0.3, p90 31.5); warmth R-B median +0.6 (p10 -13.1, p90 +16.9); median colour #F8F5F8, soft-gradient subset #F6F3F3. Flat-white subset: #FFFFFF (55 % of flat-white samples read exactly 255 on all channels, luma p10 250.3).
- Evidence: n=2,160 pale samples, 19/19 clips; C_pale_plates.csv, C_plates_per_clip.csv
- Confidence: high
- Verified, restated (item 13): of 68 pale FULL holds in 16 clips, 10 are flat #FFFFFF and 58 are tinted; the tinted plate's gradient and corners are in [C06].

### [C06] On a full-frame pale plate put the light at the top: a vertical gradient from about #FBF8F5 at the top row to about #EFE8E3 at the bottom row (top about 12 levels lighter), corners TL #F8F5F3, TR #F9F5F3, BL #EAE4DF, BR #EAE4DD; keep the split panel almost flat.

- Values: Verification (58 tinted pale FULL holds in 16 clips, every frame): top row #FBF8F5, bottom row #EFE8E3, TL #F8F5F3, TR #F9F5F3, BL #EAE4DF, BR #EAE4DD, left middle #F6EFEA, right middle #EFEDEC; top 12 levels lighter than bottom, lighter at the top in 66 %; warm in the early clips, cooler later. Study (1,282 full-frame and 889 split-panel pale samples): top-to-bottom luma drop median 6.6 levels (p10 25.4); lighter at top in 63.3 %, flat (|grad| <= 2 levels) 22.5 %, lighter at bottom 9.8 %; left-right median -0.1 (p10 -3.9, p90 4.4). Centre minus mean of corners +6.0 levels on soft gradients (p10 -1.8, p90 13.4), +0.4 on flat white. Split panel (y 0-887): top-bottom median -0.3 (p10 -12.4, p90 +10.9), corners all about #FBF8F9.
- Evidence: n=1,282 full-frame and 889 split-panel pale samples; C_pale_plates.csv (grad columns), C_plate_swatches.png
- Confidence: high
- Verified, corrected (item 13): the study's stops were top #FCF9F8 fading to a lilac-grey bottom #F3EBF4, corners TL #F9F7F6, TR #FAF7F8, BL #F1E7F4, BR #EFECF0. The lilac bottom is one family, not the median.

### [C07] Tint the pale plate with one or two large soft pastel tints at opposite corners (bottom-right and top-left most often), and keep them static or drifting at 2 px/s or less.

- Values: Verification (58 tinted holds): the strongest edge tint (chroma median 40 levels) sits bottom-right in 17, top-left 12, middle-left 11, top-right 8, bottom-left 5; corner colour changes by 4 levels or more, smoothly, in 21 of 58 holds (median 6 levels/s), but optical flow of the tint field in 9 such holds gives 0.0-1.6 px/s (max 9.4, clip09): the colour changes are mostly content and fades, not travelling blobs. Study: strongest tint on a plate median 19.9 levels (p10 3.9, p90 67.0); hues peach/orange, lilac, mint, baby blue, pink, centre left whitest; of 167 holds of 45+ frames, 81 static (corner luma change <= 3 levels), 64 drifting smoothly (3-50 levels over 1.5-6 s, e.g. clip17@441-611 46 levels, clip15@413-511 35, clip13@691-799 35), 22 changing in steps (content). Blob size 300-700 px by eye.
- Evidence: n=167 holds, 19 clips; C_plate_motion.csv, C_mesh_plate_drift_clip17_450-610.jpg, C_mesh_plate_strips_4holds.png, C_blob_flow.csv
- Confidence: medium (drift measured on corner colour; speed and blob size are not reliable)
- Verified, corrected (item 13): the study read the blobs as drifting slowly during a hold, at 1-35 px/s by optical flow (median per hold 2.5-35; low confidence, smooth fields defeat flow). Build: treat the tints as static (about 0-2 px/s, max 9).

### [C08] Optionally texture a pale plate with one faint pattern: a dot grid (30-40 px pitch, ~4 px dots 12-40 levels darker), grid paper (60 px cells, lines 8 levels darker), marble veins (~12 levels) or diagonal stripes (60-73 px period).

- Values: Only 12.4 % of pale samples have block texture std >1 level; concentrated in clip01 (37 %, dot grid + marble), clip03 (32 %, grid paper), clip14 (63 %, cream stripes #FFECCB), clip18 (64 %). Dot grid clip12@330: dots #C0D9F9-grey on white, pitch 40 px; clip01@180: #E0EAEF on #F5F5F6, pitch 30 px; grid paper clip03@330 base #FBF6F3; marble clip01@90 base #E8E0D7, veins #D9D6B8. Pitches counted by eye on the crops (the FFT returned harmonics 10/20/30 px).
- Evidence: n=5 measured patches in 4 clips + texture share in 19 clips; C_plate_texture_dot_grid.png, _dot_grid_2.png, _grid_paper.png, _marble.png, _stripes.png
- Confidence: medium

### [C09] Make dark fields one of four near-blacks: neutral #0C0C0D, navy #101B37, warm black-brown #28110E, dark teal #11312D, with the centre 7-27 levels lighter than the corners (a soft spotlight).

- Values: Dark plates (luma<70): 17.0 % of graphic frames in 13 clips. Groups by sample: neutral black n=233 (10 clips, luma 11.9, centre +7.1), navy n=218 (8 clips, luma 26.2, centre +12.6), warm n=71 (6 clips, luma 22.0, centre +27.2), teal n=20 (clip06 only, luma 41.9, centre +22.0).
- Evidence: n=542 dark samples; e.g. clip06@0-64 #121838, clip02@0-36 #080F17, clip19@0-67 #28110E; C_plate_swatches.png, C_plates_segments.csv
- Confidence: high (palette); medium (spotlight amount)

### [C10] Open on a dark panel about half the time: the first panel behind the frame-0 split is dark in 9 of 19 clips, pale in 6, saturated in 2, a photo in 2.

- Values: First graphic segment of each clip starts at frame 0 in 17 clips (frame 2-3 in clip03, clip14). Dark openings: clip02 #080F17, clip03 #110C11, clip04 #333A50, clip05 #10141B, clip06 #121838, clip07 #1E1C1A, clip08 #161317, clip11 #1F1611, clip19 #28110E; pale: clip01, 09, 13, 15, 17, 18; saturated clip10 #FF9F71, clip14 #35A0E2. Over the rest of the clip pale dominates (C04).
- Evidence: n=19 openings; C_opening_plates.csv, C_plate_swatches.png (first swatch per row)
- Confidence: high

### [C11] Use a saturated full field for one sentence only (median 36 frames at 29.97 fps = 1.2 s, p10 8, p90 74), in about half the clips, and key its colour to the product or brand on screen or to a colour named by the sentence.

- Values: 31 saturated segments, 1,189 frames (7.2 %), clips 02, 04, 08, 09, 10, 11, 14, 18, 19. Brand-keyed (by eye + accent hue): clip18 lime #D3ED1F/#CCE60E (clip18 top prop accent #D8EF40, same 60-75 deg bin, 92 % of its accent pixels); clip10 orange-peach gradient #FF9F71-#FFB686 (top accent #FF9A6C); clip11 orange #DF560E/#F26516; clip19 cyan #03B1FF and red #D52F19 while naming a video platform. Literal: clip08 fire #D54C29 on 'burn your tokens', clip09 coral #FF665E on 'sounds bad'. Scene fields: clip14 sky #35A0E2, clip04 chalk green #2F6852 and sunburst blue #2C4CA0, clip08 teal #006482, clip11 blue #1A4DB4 (on a list of device types), clip02 blue #235AC6.
- Evidence: n=31 segments, 9 clips; C_saturated_fields.csv (with machine-transcript words), C_palette_hues.csv
- Confidence: medium (trigger categories are interpretation; colours and lengths are measured)

### [C12] Allow solid pale tints as a softer alternative to white: peach #FFE4BC/#FFD9B1, blush #FCD4BC/#F6E2D6, cream #FFEAC3/#EBDFCA, sky #CBEBFE, pink #FCCEE3, aqua #BBDBE7.

- Values: pale_tint family (luma>=180, chroma>=30): 6.5 % of graphic frames, 9 clips (02, 04, 06, 07, 09, 11, 12, 14, 19); centre lighter than corners by median 12.6 levels (p10 1.2, p90 22.6) on full-frame tints.
- Evidence: n=171 full-frame tint samples; e.g. clip07@240-365 #F6E2D6, clip19@450-543 #CAECFE, clip12@302-323 #FFD9B1; C_plates_segments.csv
- Confidence: high

### [C13] Treat the plate as a scene choice, not a layout choice: a change between split and full-frame keeps the same plate only about half the time.

- Values: 170 adjacent split<->full-frame changes: top-edge plate colour within 8 levels in 42.9 %, same plate family in 49.4 %; top-colour difference median 16.5 levels (p10 1.1, p90 236). Family mix is the same in both layouts (C04).
- Evidence: n=170 changes, 19 clips; numbers.json plates.families_refined.layout_change_plate
- Confidence: high

### [C14] Draw the caption backplate as #3F3F3F at 0.823 opacity blended in linear light (normal alpha), with no backdrop blur, the same over panel, full-frame and presenter; a gamma-space renderer's nearest match is rgba(70,69,70,0.70).

- Values: Verification (168,971 temporal pixel pairs from 554 caption changes, all 19 clips: the same pixel uncovered on one frame and covered on the next): fill #403F3F (64,63,63) at opacity 0.823 in linear light, rms 1.5 levels, bias <= 0.3 levels in every background bin; per clip 0.821-0.828 in 19 of 19 (clip17 0.823, clip19 0.823). Gamma-space fit #484444 at 0.697, rms 4.2, bias -4.5..+4.3. Study: blur check on textured backgrounds, plate std 0.81 against 0.85 expected with no blur; top padding 14 px (p10 14, p90 16).
- Evidence: n=9,504 samples from 19 clips (every 5th frame); clip01@60 crop; C_caption_plate_scatter.png, C_caption_plate_pairs.csv, C_caption_crop_clip01_60.png
- Confidence: high (colour and alpha); medium (per-clip spread in 4 clips)
- Verified, corrected (item 1): the study fitted rgba(53,51,52,0.63) (#353334 at 63 %) with normal gamma-space blending on spatial pairs (k 0.368/0.374/0.370, c 33.5/32.0/33.0; by layout alpha 0.649 split, 0.630 full-frame, 0.687 presenter; per clip 0.57-0.69 in 15 clips, clip17 0.38, clip19 0.81). That fit leaves a +18.5-level bias on dark backgrounds, and its per-clip outliers are fitting artefacts. The type note's value ([T16]) holds.

### [C15] Set caption words in #FFFFFF with a near-black drop shadow below and to the right that is solid for about 3 px and gone by 8 px (offset +2.75/+2.5 px, spread 2 px, sigma 1.5 px, opacity 1, as [T17]).

- Values: Glyph-core fill #FFFFFF in 74 of 114 sampled captions, the rest #F1F6FE-#FEFFFF (anti-aliasing / compression); minimum channel 234.9. Verification (36 native lines, 19 clips; 10,184 bottom and 13,792 right glyph edges): plate-relative brightness beyond the edge 0.04 at +2 px, 0.10 at +3, 0.28 at +4, 0.50 at +5, 0.72 at +6, 0.88 at +7, 0.97 at +8; half point 4.5 px beyond the edge, 10-90 % width about 4 px.
- Evidence: n=114 captions (6 per clip, 19 clips); C_text_colour.csv, C_caption_crop_clip01_60.png
- Confidence: high
- Verified, corrected (item 4): the study read a hard shadow with no visible blur: best shift (2,3) or (3,2) in 47 of 107, all within 0-3 px; shadow colour median (7,7,8) on a plate of (111,116,125), ratio 0.067 (p10 0.041, p90 0.151), black at ~93 % opacity. 'Hard 2-3 px' undersells its reach.

### [C16] Set the closing serif keyword in #FFFFFF with a soft black drop shadow below and to the right: offset about 13 px right and down, spread 5 px, sigma 4 px, opacity 0.97, linear light (as [T23]).

- Values: Fill #FFFFFF in 17 of 19 clips, clip19 #FEFDFC, clip13 read #F3F6FA (detection on a lit area). Verification (6 light-background clips): offset 12-14 px right and down, spread 4-6, sigma 4, opacity 0.95-1.0 (medians 13/13/5/4/0.97). Study profile (light shirt behind, n=6), luma below glyph bottoms over the background: 1 px 1.73 (anti-alias), 5 px 0.24, 9 px 0.155, 15 px 0.50, 21 px 0.82, 29 px 0.96; over the dark hoodie (n=13) 0.29-0.4 at 7-9 px; shadow pixels #000000-#020202.
- Evidence: n=19 closing frames (last frame -3 of each clip), e.g. clip01@1195; C_keyword_shadow.csv, C_keyword_shadow_zoom_clip01_1150.png, C_keyword_crop_clip01_1150.png
- Confidence: medium (offset and blur estimated from profiles, not fitted)
- Verified, corrected (item 5): the study estimated offset (5, 8) px, gaussian sigma ~5 px, opacity ~0.85 from profiles (best horizontal shift 5 px); the verifier's grid fit rejects it.

### [C17] Fill interface cards with #FFFFFF and set their text in ink #212126; on a pale frame keep about 55 % plate, 6 % white cards, 5 % ink, 8-9 % accent colour.

- Values: Card fill median #FFFFFF (p10 #FAF9F6); ink (luma<70, chroma<25) median #212126 (p10 #0F1010, p90 #323236). Area shares on pale-plate frames: plate 55.2 %, white card 5.8 %, ink 5.3 %, accent 8.5 %, other greys/mid tones ~25 %.
- Evidence: n=228 frames (12 per clip on pale plates, 19 clips, 4x downsampled); C_palette_hues.csv, C_palette_swatches.png
- Confidence: high

### [C18] Key the prop accent to the subject of each scene and ship no default house accent: the orange #E38056 that ranks first by hue is a third-party mascot's colour.

- Values: Study (accent pixels, HSV s>=0.45, v>=0.35, not plate, by 15-deg hue bin, 228 frames): 15-30 deg #E38056 29.9 % (19/19 clips), 210-225 #357CEF 9.3 % (17), 30-45 #ECAB44 8.7 % (19), 195-210 #2F85B5 8.7 % (18), 0-15 #F0574A 7.2 % (19), 60-75 #D6EE39 4.8 % (9), 345-360 #F94B4F 4.4 % (17), 45-60 #FDD731 4.0 % (16), 315-330 #FC49C3 3.5 % (7), 150-165 #0D8F5D 3.2 % (15); top accent per clip orange in 10 of 19. Verification (every 15th frame of FULL and SPLIT runs, orange regions of 3000 px or more classified by eye): orange-hue pixels (15-30 deg) are 0.1-0.7 % of graphic pixels in most clips; the large shares are clip04 17 % (a brick-wall cartoon scene), clip10 17 % and clip11 7.6 % (fields keyed to a product brand), clip18 5 %, clip16 3.7 % (skin in footage). The largest regions are the mascot, a product mark, brand fields, skin, bricks, fire, an orange suit, a basketball rim and a cork board; the only drawn uses not tied to a mark are clip07 clock faces, a clip01 music-card gradient and a clip15 gauge outline.
- Evidence: n=228 frames, 19 clips; C_palette_hues.csv, C_palette_swatches.png
- Confidence: high
- Verified, corrected (item 14): the study's rule was 'make warm orange/terracotta (#E38056) the default prop accent, then blue #357CEF, amber #ECAB44, steel blue #2F85B5 and red #F0574A; use lime #D6EE39 or magenta #FC49C3 only when the subject owns them'. The hue histogram ranks a third-party mark first.
- Owner decision (16 Nov 2026): no house accent; colour follows the subject per scene, as in the reference.

### [C19] Light floating props from above with one big soft drop shadow pushed down, never above: fitted box-shadow 0 68px 102px -36px at 0.53 of plate luma.

- Values: clip03@330 fare device on #FAF3EE: joint erf fit over below/left/right profiles: opacity 0.533, sigma 51.0 px (CSS blur ~102), spread -36.4 px, y offset 68.2 px, rms 0.006. Raw: below darkening 0.45 at 3 px, half by 42 px; sides 0.115-0.119 at 3 px, half by 26-28 px, <1 % by 63-70 px. Paper receipt (clip01@690) below: 0.31 at 3 px, half by 22 px. Browser window (clip01@180): below 0.28 at 3 px, half by 48 px; left 0.10, half 20 px, gone 57 px; above none (-0.01).
- Evidence: n=4 instances with verified edges in 3 clips (P01, P05, P07, P02); C_props_ratio_P01.png, C_props_shadow_P01.png, C_props_ratio_P05.png, C_props_ratio_P07.png, C_props_shadow_profiles.csv, C_props_ratio_overview.jpg
- Confidence: medium (few instances; boxes by eye, edges refined automatically)
- Verified, open (items 12, 27): the floating-prop shadow was not re-measured. Open for the owner.

### [C20] Give UI cards and paper a tighter, lighter shadow than objects: 3.5-12 % darkening at the sides falling to half within 8-28 px, 28-31 % right under the bottom edge, nothing above.

- Values: Sides: printer clip05@720 0.035/0.055 at 3 px, half 8-10 px, gone 11-19 px (fit opacity 0.10, sigma 9.9); cork board clip12@330 0.03-0.09, half 7-18 px; browser clip01@180 0.10, half 20 px. Below: 0.28-0.31 at 3 px. Above: <=0 in every instance measured (P05, P11 0.05 unresolved).
- Evidence: n=5 instances in 4 clips (P02, P05, P07, P11, P01 sides); C_props_shadow_P02.png, _P05.png, _P11.png, C_props_shadow_profiles.csv
- Confidence: medium
- Verified, consistent (item 12): card fits on pale plates have sides much tighter than the bottom: 0 31px 41px -27px rgba(0,0,0,0.43) (clip06) and 0 18px 25px -13px rgba(0,0,0,0.25) (clip02); see [G16].

### [C21] Give flat icons, flat illustrations and phone mock-ups on saturated fields no drop shadow.

- Values: Icon tile clip09@749 on #F9FAFC: -0.011/-0.003 at 3 px both sides (none); app tile clip15@150: 0.007 at 3 px; phone mock clip11@659 on #1B54C7: no darkening beyond its own 10 px dark bezel (<1 % at 11 px). Flat cartoon scenes (clip04, clip05 clocks, clip07 clock) carry outlines instead of shadows (by eye).
- Evidence: n=3 measured instances in 3 clips + by-eye scenes; C_props_ratio_P09.png, _P08.png, _P12.png
- Confidence: medium

### [C22] Tint object shadows slightly warm (red channel kept more than green and blue), not grey: equivalent shadow colour a dark brown around #5E3430-#76514C under objects; paper shadows stay neutral.

- Values: Shadow/plate channel ratios 6-20 px from the edge: device below 0.72/0.65/0.64 (R/G/B), device sides 0.92/0.90/0.91, browser left 0.96/0.93/0.90 (on bluish #ECF3FD), receipt below 0.78/0.78/0.80 (neutral), printer 0.98/0.99/1.00. Solving normal blending for the device at opacity 0.45-0.53 gives #5E3430-#76514C.
- Evidence: n=4 instances, 3 clips; C_props_shadow_profiles.csv, numbers.json props.shadow_per_side.channel_ratio_6_20px
- Confidence: low (two clear cases; plate-fit error near props is 1-2 levels)
- Verified, open (item 27): not re-measured (bespoke art, few instances).

### [C23] Shade prop bodies with a top light: the top of a body is 22-28 levels lighter than its bottom.

- Values: Row-median luma of body pixels, top 15 % vs bottom 15 %: dark plastic device clip03@330 46.6 -> 24.5 (+22.1); light plastic printer face clip05@720 228.2 -> 199.7 (+28.5). One exception: cassette body clip01@90 strip read 38 -> 75 (strip crosses lighter parts; not trusted).
- Evidence: n=2 accepted instances (3 measured), 2 clips; numbers.json props.shading_glow_chrome_rays.body_gradient
- Confidence: low (two instances)
- Verified, open (item 27): not re-measured (bespoke art, few instances).

### [C24] Render metal as cool silver with one soft highlight: median #D6DAE0, darkest #8F959B, highlights reaching 247-255 on under 3 % of the surface.

- Values: Chrome cloche clip01@90 (metal pixels, chroma<25): luma p5 155, p50 218, p95 247, share >=250 2.5 %.
- Evidence: n=1 instance (the cloche recurs over clip01@60-120); C_props_chrome_clip01_90.png
- Confidence: low (seen in one clip)
- Verified, open (item 27): not re-measured (bespoke art, few instances).

### [C25] Make lit elements glow in their own hue: halo excess 37 levels at 2 px, 1/e by ~13 px, back to the background by 30 px (blur sigma ~10 px, screen blend).

- Values: LED digits clip03@330: lit #F9843F on screen #0E0605 (luma 9.3 far away); halo luma 46.6 at 2 px, 27.9 at 10 px, 15.1 at 20 px, 10.5 at 28-30 px; halo colour stays orange (88,38,12 at 2 px). Ray burst behind the reveal clip01@60-120: 15-16 rays per full circle, ray contrast 19-24 levels on #F7E9D2 at radius 650-850 px from (540,820).
- Evidence: n=1 glow instance + 1 ray burst (by eye also in clip04 orange and blue bursts); C_props_glow_led_clip03_330.png
- Confidence: low (single instances)
- Verified, open (item 27): not re-measured (bespoke art, few instances).

### [C26] Do not regrade the presenter between layouts: skin colour in the closing close-up matches the split within a few levels.

- Values: Skin median, split vs closing close-up, max channel difference: median 4.8 levels, max 14.2 (n=19). Footage black point (luma p1) 3.5-5.8 in the split, highlights p99 185-217 (split) and 230-255 (close-up).
- Evidence: n=19 clips, every 5th frame; C_presenter_per_clip.csv
- Confidence: high

### [C27] Expect the presenter room colour to change by shoot, not by edit: three room looks over the corpus period.

- Values: Split room (non-person) median and skin: clip01-03 (Oct 29-31) teal-green #232C26-#252B24, skin #CD986F-#D69E73 hue 25-26 deg; clip04-07 and clip14 (Nov 2-3, Nov 7) purple #302C3E-#353348, skin #AE8278-#BA897A hue 10-14 deg; clip08-13, 15-18 (Nov 4-9) blue-violet #4F52A9-#5257AD, skin #C59486-#CB9989 hue 13-14 deg; clip19 (Nov 12) bright grey-blue #707D88, skin #ECB08A, p99 253.
- Evidence: n=19 clips; C_presenter_per_clip.csv
- Confidence: high

### [C28] Shift pale plates from warm cream to cool white for the newer look: before 2026-11-05 pale plates were warm (R-B +10.1, luma 240), from 2026-11-05 neutral-cool (R-B -0.25, luma 250.6).

- Values: Per-clip frame-weighted pale plate: early n=8 clips (clip01-08) e.g. clip01 #F7F4EE, clip03 #F7F1EB, clip04 #EFEBE1, clip05 #F4EFE7; late n=10 clips (clip09, 11-19 with pale plates; clip10 has none) e.g. clip13 #FCFCFE, clip15 #FAFCFE, clip17 #FCFCFE; exceptions: clip14 (Nov 7) warm #F7F2EC, clip08 (Nov 4) cool #F2F3FC.
- Evidence: n=18 clips with pale plates; C_plates_per_clip.csv; numbers.json plates.families_refined.over_time
- Confidence: medium (dated trend with exceptions on both sides)

### [C29] Never observed (measured): grain on plates, backdrop blur behind captions, a coloured caption plate, a shadow above a prop, a saturated field held longer than 91 frames (3.0 s; longest of 31 segments), a vignette on flat white plates.

- Values: Grain: C03; caption blur: plate std 0.81 vs 0.85; caption plate chroma: neutral (pooled fit #353334, max-min 2 levels; per-clip fits #282E2E-#493833; verified fill #3F3F3F, [C14]); prop shadow above: <=0 in all measured; white plate centre minus corners +0.4 (p10 -0.6, p90 1.9).
- Evidence: see C03, C14, C19, C11, C06 evidence files
- Confidence: medium (absence within the samples taken)

## Constant and variable

CONSTANT (all 19 clips): decode BT.709 limited range; caption plate #3F3F3F at 0.823 in linear light ([C14], corrected) with #FFFFFF text and a black shadow that reaches 8 px ([C15], corrected); closing keyword #FFFFFF with a soft black drop shadow; card fills #FFFFFF and ink ~#212126; no grain on plates; orange/terracotta pixels occur in every clip (mostly a third-party mascot, marks, brand fields and skin; [C18]); pale plates appear in every clip; no regrade of the presenter between split and close-up. VARIABLE: the plate per scene (pale gradient / white / tint / dark / saturated / photo, mix in C04), its tint hue and blob layout, whether its tint changes (64 of 167 holds; near-static by flow, [C07]), texture (dot grid, grid paper, marble, stripes in 4 clips), saturated field colour (driven by the product's brand colour or a literal colour in the sentence; 9 clips), opening panel dark (9) or pale (6), pale-plate warmth (warm before 2026-11-05, cool after), presenter room colour (three shoots), per-clip accent (orange in 10, blue in 4, yellow, lime, steel blue in others).

## Open questions

- BT.709 vs BT.601 for the 16 untagged clips is settled only indirectly (skin hue in a shared room). A patch of known chroma (an exported brand swatch) would settle it; the saturated hexes would shift by up to ~15 levels per channel under BT.601.
- The drift speed and size of the pastel blobs are not reliable (optical flow on smooth fields gives 1-35 px/s); a person should watch C_mesh_plate_drift_clip17_450-610.jpg-style holds in playback, or the motion analyst's numbers should be used. Verification: about 0-2 px/s, treat as static ([C07]).
- Prop shadow parameters rest on 4-5 verified instances; more instances on clean pale plates (especially clean full-frame objects) would tighten C19-C22.
- Depth of field and bloom on 3D props were not measured beyond one LED glow and one ray burst; the frosted-glass cards (clip07@125-150) may be a transition state rather than a look.
- Whether the presenter background is the real room or a replacement was not decided here (presenter analyst).
- Settled by verification: the per-clip caption plate fits for clip17 (alpha 0.38) and clip19 (0.81) were fitting artefacts; both read 0.823 in linear light ([C14]).

Needs an eye or an ear:

- Look at C_plate_swatches.png next to the 1 fps contact sheets: do the family labels (dark/saturated in yellow) match what a viewer calls the plate? clip16 dark segments are film stills.
- Watch two pastel-mesh holds (clip17@441-611, clip15@413-511) in playback to confirm the blobs drift continuously and judge their speed.
- Look at C_props_ratio_P01.png, _P05.png and _P07.png: confirm the shadow footprint (strong below, faint at sides, none above).
- Check C_keyword_shadow_zoom_clip01_1150.png for the keyword shadow offset direction (estimated 5 px right, 8 px down; settled by verification: 13 px right and down, [C16]).
- Confirm by eye the frosted-glass card look in C_frosted_cards_clip07_125.jpg and decide whether the style should include it.
- Confirm the saturated-field trigger reading in C_saturated_fields.csv (brand colour vs literal colour vs scene) against the full videos.
