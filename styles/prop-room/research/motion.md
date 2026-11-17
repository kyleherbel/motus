# Motion

Measured: Every frame of all 19 clips (20,881 frames at 29.97 fps, 697 s), with a calibrated BT.709 limited-to-full decode piped from ffmpeg. Passes on every frame: band frame differences and row profiles (cuts, seam, activity), Vision face boxes (layout labels, presenter zoom), a caption-glyph detector in the caption bands (caption and keyword timing), and template tracking with scale search (scale, position, NCC, contrast and sharpness per frame) from every cut to its settled picture and through every split and graphic segment in 16-frame windows (1,987 tracked regions, 860 prop entrances). Easing was fitted to normalised progress with named curves (free duration and sub-frame start), a free cubic-bezier, an exponential approach and a damped spring, each with an RMSE; durations are given with t50 and t90 so the curve shape does not depend on the chosen end frame. All durations and offsets in this note are frames at 29.97 fps (1 frame = 33.4 ms). Layout changes, captions and the keyword are hard cuts; the motion lives inside the pictures, on one strong ease-out with no overshoot.

Not done: Nothing was watched in playback and nothing was listened to. Rotation, 3D tilt, particles, typing speed and counters were not measured (one fill, one spin, one ring and one whip were measured as single cases). Which word triggers which prop was left to the explanation pass, because word onsets are too dense (about every 5 frames) to separate prop timing from chance (41 % against 42 % within +-2 frames). Automatic classes (pop, slide, grow, fade, land) rest on stated thresholds; only monotone tracks were used for curve fits (19 of 44 scale cut entrances, 104 of 279 prop entrances).

Evidence is cited as `clipNN@frame` (frames at 29.97 fps, counted from 0; ids are this style's own). File names in Evidence lines name files of the local study; they are not shipped. "Verified" lines give the independent verifier's verdict and final value; item numbers refer to [verification.md](verification.md).

## Rules

### [M01] Every layout change (split panel, full-frame graphic, full-height presenter, closing close-up) is a hard cut: the arrangement (panel, presenter, caption band) switches on a single frame; nothing dissolves, wipes, slides or zooms between layouts (the new picture inside may still be arriving, see M05).

- Values: 343 single-frame cuts detected (mean |dY| >= 20 and >= 2.5x both neighbours), 276 of them change layout; 2 more cuts found by eye (clip06@632, clip11@345). 18 layout-label changes without a detected cut were inspected frame by frame: 0 animated transitions (face-label artefacts, the 2 missed cuts, filmstrip footage). Pairs: split>graphic 100, graphic>split 87, graphic>graphic 46, graphic>presenter 31, split>presenter 23, split>split 20 (14 with the presenter continuous), presenter>graphic 18, presenter>split 17.
- Evidence: n=343 cuts, 19 clips; clip01@51, clip01@121, clip01@1114; M_cuts.csv, M_split_to_full_cut_clip01_48-63.jpg, M_noncut_layout_changes.jpg
- Confidence: high
- Verified, confirmed in kind (item 7): the 343 cuts here count picture cuts, including scene cuts inside a layout. In the verifier's one table there are 277 layout changes and 320 strict picture cuts, 51 of them inside a layout run; 8 layout changes have no strict cut (the frame dims, then the card arrives, e.g. clip11@344-345).

### [M02] Put layout cuts on a word onset (start of the spoken word), not between words.

- Values: offset of each layout cut from the nearest faster-whisper word start: median 0 frames, p10 -2.5, p90 +2.9 frames at 29.97 fps; 86 % within +-3 frames (transcript timing itself is +-2 frames).
- Evidence: n=276 layout cuts, 19 clips; M_cuts.csv (nearest_word_onset_offset_frames)
- Confidence: medium (word timings are machine estimates, not forced alignment)
- Verified, confirmed with a caveat (item 17): 82.6 % of picture changes are within +-3 frames of a word onset against 61.6 % of random frames; the firmer anchor is the caption-group onset (259 of 277 layout changes exactly on one).

### [M03] On a layout cut the caption changes on the same frame: it jumps to the new layout's caption band (split ~y 947, full-frame/presenter ~y 1250) with no travel, and in almost every case it is also the next caption phrase.

- Values: caption already in its new band and final on the cut frame in 232 of 276 layout cuts (84 %); the rest are detector interference or a further phrase swap within 3 frames; by eye the old caption lingers 1 frame in its old band in 2 cases (clip01@51 shows 'most premium' over the new plate, new caption at @52; clip14@592). Caption text differs before/after the cut in 267 of 276 (97 %).
- Evidence: n=276, 19 clips; clip01@51-52; M_cuts.csv, M_split_to_full_cut_clip01_48-63.jpg
- Confidence: high

### [M04] Captions never animate: each phrase replaces the previous one whole on a single frame (no pop, scale, fade, slide or word-by-word build), and appears/disappears the same way.

- Values: 1222 clean caption events (old state stable 3 frames before, new state stable 3 frames after): 1146 swaps, 44 appearances, 32 disappearances. 1013 read as complete on the first frame automatically; the 209 flagged ones are detector interference from props behind the semi-transparent plate: 14 of 14 randomly sampled flagged swaps were instant by eye. Plate width changes in the same frame as the text.
- Evidence: n=1222 events, 19 clips; clip01@15, clip04@533; M_caption_changes.csv, M_caption_swap_clip01_12-19.jpg, M_caption_swap_flagged_sample.jpg
- Confidence: high

### [M05] A new picture is almost never complete on its cut frame: build it so it is still arriving (growing, fading, or with content still to drop in) for the first ~0.5 s after the cut.

- Values: NCC between the cut frame and the frame 15 later (54x96 thumbnails): median 0.49 for split panels (n=111) and 0.63 for full-frame graphics (n=144); contrast below 0.8 of the settled picture on the cut frame in 45 % / 35 %; complete on the cut frame (NCC >= 0.97) in 1 of 111 / 11 of 144. Tracked cut entrances (214 valid of 268, 19 clips): main content arrives later or builds 79 (37 %), already complete 49 (23 %), fade or blur-in 42 (20 %), grows into place 30 (14 %), lands from larger 14 (7 %).
- Evidence: n=255 (thumbs) and 214 (tracks), 19 clips; M_cut_settle_thumbs.csv, M_cut_entrances.csv, M_cut_sheet_byeye_01.jpg, M_cut_sheet_byeye_10.jpg
- Confidence: high
- Verified, confirmed (item 9): scale on the cut frame 0.88 median (0.71-0.95) on 7 clean tracks in 5 clips; t50 about 1.2 frames after the cut.

### [M06] Scene scale-in on a cut: the new panel or full-frame picture starts at about 0.84 of its size on the cut frame and grows to 1.0 on cubic-bezier(0.16, 1, 0.3, 1) (easeOutExpo) over ~15 frames (0.5 s); half the move is done in 1.6 frames. No overshoot.

- Values: clean tracks n=19 (13 clips): best named curve easeOutExpo in 12/19, median RMSE 0.024 at T = 14.7 frames (p10 3.7, p90 28.4); cubic-bezier(0.16,1,0.3,1) RMSE 0.023 at T 14.9; easeOutQuint 0.029 (T 11.8); easeOutCubic 0.034 (T 7.6); linear 0.049; exponential approach tau 2.1 frames RMSE 0.034; damped spring 0.040. t50 1.55 frames (p10 0.68, p90 3.9), t90 4.7 (1.8-10.3). Start scale for growing entrances 0.843 (p10 0.33, p90 0.94, n=14). Overshoot median 0.3 % of the move (p90 1 %).
- Evidence: clip01@238-248 (0.752 -> 1.0), clip01@285-305 (0.840 -> 1.0), clip19@256, clip11@894; M_cut_scale_settle.csv, M_cut_scale_settle.png, M_scale_settle_clip01_236-255.jpg
- Confidence: medium (19 clean curves; the other tracks were rejected as non-monotone)
- Verified, confirmed (item 9): 7 clean monotone scale-ins (clip07, 09, 10, 17, 18): scale on the cut frame 0.88 median (0.71-0.95), fitted start 0.85; easeOutExpo / cubic-bezier(0.16,1,0.3,1) best (median rmse 0.039-0.040 in progress units; easeOutCubic 0.050, linear 0.058); duration poorly constrained (2.5-39 frames). Build values: start 0.85, 15 frames, cubic-bezier(0.16,1,0.3,1).

### [M07] A smaller share of cut entrances land from slightly larger: start at ~1.04x and settle to 1.0 in ~6 frames on the same ease.

- Values: clean n=5 (5 clips): start scale median 1.041 (1.035-1.158); easeOutExpo RMSE 0.006 at T 6.4 frames; t50 0.86, t90 2.5 frames.
- Evidence: clip04@774 (1.166 -> 1.0 in 3 frames), clip06@586 (1.147), clip02@801, clip04@511, clip05@435; M_cut_scale_settle.csv
- Confidence: low (n=5)
- Verified, consistent (item 21): the verifier tracked one prop landing (1.24 -> 1.0 in 4 frames, clip08@42), not a scene landing.

### [M08] Fade-in entrances on a cut are near-linear opacity ramps from a washed-out picture (contrast ~0.75 of final) lasting ~9 frames; one full-frame scene washes in from a flat cream over 8 frames.

- Values: fade/blur-in cut entrances, clean n=18 (11 clips): contrast on the cut frame 0.75 median; t50 4.0 frames (p10 1.1, p90 9.6), t90 8.9 (2.6-14.1); t90/t50 = 1.93 (linear 1.80, easeOutCubic 2.60); best curves css ease / linear, median RMSE 0.07 (noisy). clip01@51: plate std ratio 0.03, 0.22, 0.35, 0.49, 0.58, 0.70, 0.82, 0.93, 1.01 on frames 51-59 = linear over 7.8 frames (RMSE 0.024) from flat cream RGB ~ (253, 242, 219).
- Evidence: n=18 + clip01@51-59; M_cut_fade.png, M_cut_scale_settle.csv, M_fade_wash_clip01.csv, M_fade_wash_clip01_50-57.jpg
- Confidence: medium (contrast and blur are confounded; fade vs blur not separated)
- Verified, not re-measured (item 9).

### [M09] About one cut in 10 to 15 opens on the empty plate (background only), and the content pops in 1 or 2 frames later.

- Values: Verification (316 cuts, every-frame thumbnails, 10 clips): empty plate on the cut frame (picture-region contrast < 0.35 of frame +10) in 20 of 316 cuts (6.3 %); content after 1 frame in 7, 2 frames in 3, 3-9 frames in 10.
- Evidence: clip01@764-766, clip03@537-539, clip01@984-985; M_plate_first.csv, M_plate_first_clip01_762-769.jpg, M_plate_first_clip03_535-542.jpg
- Confidence: medium
- Verified, corrected (item 9): the study counted 33 of 255 cuts (13 %, 17 clips) with contrast ratio < 0.35 on the cut frame; content after 1 frame in 16, 2 frames in 8, 4-12 frames in 9; arrival a 1-frame pop in 21, a ramp in 12. With the verifier's definition the share is about half: an occasional device. Build value: about 6 % of cuts, plate held 1-2 frames.

### [M10] Props that enter during a hold use this mix: 45 % pop (complete on their first frame), 20 % short slide-in, 10 % grow, 7 % fade, 2 % land from larger, 15 % other (partial reveals, mixed).

- Values: 860 entrances among 1987 tracked changed regions (16-frame windows over every split/graphic frame, 19 clips): pop 390, slide_in 176, other 131, grow 84, fade 60, shrink 19. The other tracked regions were already present and changed inside (781: text, fills, colour), moved (303) or zoomed (43). Every clip has pops and slides; grows in 18 clips, fades in 17, shrinks in 14. The labels describe how a changed region arrives, not what it depicts: by eye, clip03@45 'pop' is a comment row inserted complete into a feed, clip06@696 'slide' is a card carousel panning ~66 px, clip01@64 'grow' is a card emerging over the cloche plate, clip01@901 'fade' is ambiguous (a code panel shifting).
- Evidence: n=860 entrances, 19 clips; M_prop_events.csv, M_prop_entrance_curves.png
- Confidence: medium (automatic classes on 16-frame windows; class boundaries are thresholds stated in the study's prop-event script)
- Verified, consistent at low n (item 10): 25 events re-tracked in clip08, clip10 and clip17, about 12 usable; the class shares (45/20/10/7/2 %) were not re-measured.

### [M11] A popped prop is drawn complete, at rest scale and full opacity, on its first visible frame.

- Values: pop n=390 (19 clips): first-visible scale 1.000 (p10 0.988, p90 1.004), contrast 1.00 (0.95-1.08), offset 0 px (p90 7 px); settle 0 frames (p90 3).
- Evidence: automatic pops e.g. clip03@45, clip05@1005, clip07@810, clip09@747; M_prop_events.csv
- Confidence: medium
- Verified, confirmed (item 10): pops complete on the first visible frame (3 of 3 usable; scale 1.00, offset <= 2 px).

### [M12] Slide-ins are short: the prop appears ~56 px from its rest position, mostly below it, and travels up on easeOutExpo over ~14 frames (90 % done by frame 5).

- Values: slide_in n=176 (19 clips): first-visible offset 56 px (p10 28, p90 153); direction from below 86 (49 %), right 38 (22 %), above 27 (15 %), left 25 (14 %); settle 5 frames (2-10). Clean fits n=64: easeOutExpo best in 34, RMSE 0.039 at T 13.6 frames (p10 7.3, p90 30.3); cubic-bezier(0.16,1,0.3,1) 0.041 at T 13.8; easeOutCubic 0.049 (T 8.1); linear 0.065; t50 1.5, t90 4.7 frames.
- Evidence: clip06@696, clip15@819, clip19@304 (automatic), clip04@531-534 chat card rising from the seam (by eye); M_prop_slide_directions.csv, M_prop_entrance_curves.png
- Confidence: medium
- Verified, confirmed at low n (item 10): slides of 23-128 px (from below 86 px, from the right 128 px, from above 23 px), settling in 1-11 frames.

### [M13] Growing props start at ~0.78 of rest size and reach it on easeOutExpo over ~11 frames (90 % by frame 4); they do not overshoot.

- Values: grow n=84 (18 clips): first-visible scale 0.783 (p10 0.54, p90 0.88), settle 6 frames (3-12). Clean fits n=35: easeOutExpo best in 17, RMSE 0.020 at T 11.3 frames (p10 4.0, p90 25.2); cubic-bezier(0.16,1,0.3,1) 0.020 at T 11.6; easeOutQuint 0.022; easeOutCubic 0.030; linear 0.050; exponential tau 1.75 frames. t50 1.3, t90 4.0 frames. Overshoot median 0, p90 1.4 % of the move, 2 of 35 above 5 %.
- Evidence: clip01@64, clip12@597, clip18@1056 (automatic); M_prop_events.csv, M_prop_entrance_curves.png
- Confidence: medium
- Verified, confirmed at low n (items 10, 21): grow from 0.82, settled in 8 frames (clip10@357).

### [M14] Props that land from larger start at ~1.16-1.27x and settle in 4-8 frames on a strong ease-out (Quart/Expo); used for selected tiles and emphasised items.

- Values: shrink n=19 (14 clips): first-visible scale 1.159 (p10 1.10, p90 1.27), settle 4.5 frames; clean n=5: easeOutExpo RMSE 0.016 at T 9.6, easeOutQuint 0.017 at T 9.1; t50 1.2, t90 3.3. clip19@15 selected model tile: 1.265, 1.152, 1.078, 1.034, 1.009 on frames 15-19, easeOutQuart T 7.4 frames RMSE 0.010 (easeOutCubic 0.011 at T 6.0).
- Evidence: clip19@15-21, clip02@159; M_tile_pop_ring_clip19.csv, M_tile_pop_clip19.png, M_tile_pop_ring_clip19_13-28.jpg
- Confidence: low (5 clean curves + 1 hand-checked)
- Verified, confirmed at low n (items 10, 21): land from 1.24, settled in 4 frames (clip08@42).

### [M15] Prop fades are short: a fading prop is visible at ~0.8 contrast on its first frame and reaches full contrast in ~3 frames, without moving or scaling.

- Values: fade n=60 (17 clips): first-visible contrast 0.79 (p10 0.57, p90 0.84), scale 0.997, offset 0 px; settle 3 frames (p10 2, p90 9).
- Evidence: clip01@901, clip11@362 (automatic); M_prop_events.csv
- Confidence: low (automatic class; the one sample checked by eye was ambiguous)
- Verified, open (item 22): not re-measured; the verifier's sample had no clean fade.

### [M16] Use one entrance ease everywhere: cubic-bezier(0.16, 1, 0.3, 1). Never use back/elastic/bounce; overshoot is absent.

- Values: across 19 scene + 35 grow + 5 shrink + 64 slide clean curves easeOutExpo is the best of 8 named curves in 64 of 123; cubic-bezier(0.16,1,0.3,1) fits as well as easeOutExpo (median RMSE 0.023 / 0.020 / 0.016 / 0.041 vs 0.024 / 0.020 / 0.016 / 0.039 on scene / grow / shrink / slide); scale overshoot median 0 (p90 1.4 % of the move for grow, 4.5 % for shrink; 2 of 40 above 5 %).
- Evidence: M_cut_scale_settle.csv, M_prop_events.csv, work numbers in numbers.json (bezier_check)
- Confidence: medium
- Verified, confirmed (item 9): cubic-bezier(0.16,1,0.3,1) or easeOutExpo is the best curve for scene scale-ins.

### [M17] When several props enter in one beat, stagger them by ~4 frames (0.13 s); about one pair in four lands on the same frame.

- Values: pairs of entrances in the same 16-frame window: 159 at different frames, gap median 4 frames (p10 1, p90 11); 47 on the same frame.
- Evidence: n=206 pairs, 19 clips; M_prop_events.csv (rows sharing window_first)
- Confidence: low (only 2 regions tracked per window; true stagger series not reconstructed)
- Verified, open (item 23): not re-measured; it needs per-prop tracking of multi-prop beats.

### [M18] Fast entrances carry directional motion blur proportional to speed; a whip-in covers ~270 px with easeOutCubic in ~6 frames.

- Values: clip12@121-126: start offset 271 px, speed 117, 74, 48, 25, 8.5, 2 px/frame; band-pass sharpness ratio 0.20, 0.27, 0.37, 0.62, 0.96, 1.00; easeOutCubic T 6.1 frames RMSE 0.004 (easeOutQuart 0.005, easeOutExpo 0.014). Blur also seen by eye on the cut entrance clip13@691.
- Evidence: clip12@120-131, clip13@691-693; M_whip_clip12.csv, M_whip_clip12_120-131.jpg, M_fullframe_blur_settle_clip13_690-737.jpg
- Confidence: low (one measured case)
- Verified, open (item 24): not re-measured (one case).

### [M19] Holds are not frozen: on about 2 holds in 3 a settled picture keeps a slow centred push-in at a constant rate of about 0.6 % per second until the next cut. It is a separate linear move, not the tail of the entrance ease. There is no floating or bobbing.

- Values: Verification (registration of every frame of 60 holds in 9 clips; 12 clean holds in clip07, 08, 09, 10, 12, 14): 8 push in, 4 are static (|rate| < 0.2 %/s); rate among pushing holds 0.27-1.86 %/s (median 0.59), all clean holds median 0.34 %/s; first-half and second-half rates equal (median 0.54 against 0.62 %/s), so the move is linear; the entrance ease is done by about frame 15. Study (35 holds, 16 clips): centre slope median 0 px/s (x p10/p90 -1.5/+0.3, y -3.7/+3.1); detrended vertical residual median 1.1 px (no periodic float); clip03@297-364 scale 1.000 -> 1.020 (0.87 %/s), centre fixed.
- Evidence: M_hold_drift.csv
- Confidence: medium
- Verified, corrected (item 11): the study's rate was +0.81 %/s median (p10 -0.30, p90 +1.71), with 63 % of holds faster than 0.5 %/s and 9 % shrinking, and it left open whether the move was the tail of the entrance ease. Build value: linear, 0.6 %/s, on about 2 of 3 holds.

### [M20] Keep something moving on nearly every frame of a graphic: panels and full-frame scenes change on 80-86 % of frames (internal UI changes, fills, cursors, props moving at ~7 px/frame).

- Values: frames whose graphic region changes (max 40-px band mean |dY| > 2, 0-255): split panels 6109 of 7597 (80.4 %), full-frame graphics 8718 of 10130 (86.1 %). Tracked moving objects: median 6.9 px/frame (p10 2.0, p90 20.6), n=303.
- Evidence: 19 clips; M_prop_events.csv; numbers.json misc.activity
- Confidence: medium (threshold includes VP9 noise on textured plates)

### [M21] Cassette/reel props spin at ~13 degrees per frame (~400 deg/s) once playback starts, spinning up over 6 frames.

- Values: clip01@409-443 magnified reel: 8.1, 11.9, 12.2, 13.3, 14.0, 14.9 deg/frame on frames 409-414, steady median 13.3 deg/frame (397 deg/s; 66 rpm), clockwise; polar-profile correlation 0.88-0.94.
- Evidence: clip01@395-443; M_spin_clip01_reel.csv, M_spin_clip01_reel.png
- Confidence: low (one prop)
- Verified, confirmed (item 19): the other reel of the same cassette turns 14.0 degrees per frame steady (420 deg/s) from frame 414, ramping linearly from 2.5 degrees per frame at 396 (about 18 frames). The rate is 13-14 degrees per frame; the spin-up differs by reel (6 or 18 frames). Build value: 14 degrees per frame.

### [M22] Selection emphasis: the chosen tile lands from 1.26x (M14) and a thin ring expands from the tile edge outward and fades over ~10 frames, decelerating.

- Values: clip19@16-25: ring radius ~185 px at @17 (by eye, inside detector blind zone), 210 @18, 222 @19-20, 233 @21, 241 @22, 246 @23, 250 @24, 252 @25, gone @26; ring contrast 54 -> 19 levels; repeated at clip19@34 for the second tile (by eye).
- Evidence: clip19@15-30, clip19@34; M_tile_pop_ring_clip19.csv, M_tile_pop_ring_clip19_13-28.jpg
- Confidence: low (one measured ring)
- Verified, open (item 25): not re-measured (one case).

### [M23] Fills and counters (usage bars) use an ease-in-out, not the entrance ease: ~28 frames, slow start and slow end.

- Values: clip13@697-724 usage bar right edge 571 -> 844 px: easeInOutCubic T 28.2 frames RMSE 0.010; css ease-in-out 0.022; linear 0.088; easeOutCubic 0.137; free bezier (0.61, 0.06, 0.35, 0.97) RMSE 0.0013. Counter digits roll every frame (clip16@186-195, by eye).
- Evidence: clip13@690-729; M_bar_fill_clip13.csv, M_bar_fill_clip13.png
- Confidence: low (one measured fill)
- Verified, open (item 26): not re-measured (one case; easeInOutCubic over 28 frames).

### [M24] The presenter footage is never zoomed, panned or shaken by the edit, in the split and in the closing close-up; the close-up is a hard cut to a ~1.9x tighter framing with no push-in.

- Values: split: room-background patch tracked on 35 segments: scale std median 0.0019 (max 0.0084), centre range <= 3 px. Closing close-up (19 clips): face-box width 623-710 px vs 315-385 px in split; face-width slope median -0.6 %/s (p10 -2.3, p90 +1.2; head motion), first 3 frames 0.99x frames 5-9 (no settle).
- Evidence: n=35 split segments, 19 close-ups; clip01@1114; M_presenter_bg.csv, M_closeup_face_per_frame.csv
- Confidence: high

### [M25] The closing serif keyword pops in complete on one frame (no scale, fade or slide), on the spoken keyword (median +1 frame), ~1 s after the close-up cut; the caption usually swaps to the same word on that frame.

- Values: 19/19 complete on the first frame: width constant within 2 px over the first 6 frames in 17/19, vertical centroid stable within 1 px; centroid y 1364-1395 (median 1381). First frame minus spoken keyword onset: +3, 0, -3, -4, -4, -7, -4, +2, +1, +2, +2, 0, +1, -1, +1, +3, +2, +6, +3 (median +1). First frame after the close-up cut: median 32 frames (range 10-70). Caption swaps on the same frame in 9/19 (in the others the caption already showed 'Comment <word>').
- Evidence: clip01@1126, clip06@983, clip07@975, clip13@970, clip18@1135, clip19@1138; M_keyword_entrance.csv, M_keyword_pop_6clips.jpg
- Confidence: high
- Verified, confirmed (item 5): keyword onset +1.1 frames median after the spoken keyword (-6.6..+6.3, n=19); +34 frames after the close-up cut (10-70).

### [M26] The seam between panel and presenter never moves: it is a fixed horizontal edge at y 960 (959.6 measured) for the whole split layout.

- Values: Strongest row edge between y 900 and 1008 is at y 956-960 (4-px bins) in 7133 of 7561 split frames that have a strong edge (94 %); the rest are caption-plate or prop edges. Verification (coverage model, 8,700 estimates): panel bottom edge median 959.60 in clip04-19 and 956.68 in clip01-03, stable within clips.
- Evidence: n=7740 split frames, 19 clips; M_seam_row_histogram.csv
- Confidence: high
- Verified, corrected (item 6): the study's 'about 958' is an artefact of the 4-px bins. Build value: panel height 960.

### [M27] Render all motion at 29.97 fps with a new position on every frame; some inserted material carries a 24-fps-like cadence (one repeated frame every 5) which should not be imitated.

- Values: isolated repeated frames inside moving graphic passages: 391 of 8990 (4.3 %); spacing 5 frames (64 cases) and 10 frames (61) dominate; most in clip12 (50; also 41 exact whole-frame repeats), clip18 (47), clip13 (40), clip09 (33), clip03 (32); 0-10 in the other clips.
- Evidence: M_repeated_frames.csv
- Confidence: low (source of the cadence not established)
- Verified, confirmed (item 20): 468 repeated frames in 10,222 moving graphic frames (4.6 %); spacing 5 (68 cases) and 10 (76); clip18 58, clip12 53, clip13 45, clip16 40, clip03 38, clip09 32. Inserted 24-fps-like material; do not imitate.

### [M28] Never observed (do not build): caption animation of any kind; animated layout transitions (dissolve, wipe, slide, zoom-through) except one push into a card right after a cut (clip11@345-348); seam movement; presenter zoom/pan/shake; keyword animation; bounce/back/elastic overshoot; periodic floating of settled props.

- Values: captions 0 of 1222 events animated; layout cuts 0 of 343 animated; seam fixed in 94 % of edge frames (rest other edges); presenter background std <= 0.0084 scale; keyword 0 of 19 animated; scale overshoot > 5 % in 2 of 40 clean curves; hold residual 1.1 px median.
- Evidence: M_caption_changes.csv, M_cuts.csv, M_presenter_bg.csv, M_keyword_entrance.csv, M_hold_drift.csv, M_noncut_layout_changes.jpg
- Confidence: high (for the measured items; rotation and 3D tilt were not measured, see open questions)

### [M29] Motion token table for the builder (frames at 29.97 fps): cut 0; caption swap 0; keyword pop 0 (+1 vs word); enter ease cubic-bezier(0.16,1,0.3,1); scene scale-in 0.85->1 over 15; scene land 1.04->1 over 6; scene fade linear 9; plate-first hold 1-2 on about 6 % of cuts; prop pop 0; slide-in 56 px (23-128) over 14; grow 0.82->1 over 11; land 1.24->1 over 4-10; prop fade 3; stagger 4; hold push-in +0.6 %/s linear on about 2 of 3 holds; fill easeInOutCubic 28; whip 6 with blur; reel 14 deg/frame; ring ~10.

- Values: Full table with n per token in M_motion_tokens.csv and numbers.json build_spec; the verifier's token block holds the verified values.
- Evidence: M_motion_tokens.csv
- Confidence: medium (inherits each token's confidence)
- Verified, corrected in part (items 9, 10, 11, 19, 21): the study's table read scene scale-in 0.84->1, plate-first hold 1-2 (13 % of cuts), grow 0.78->1, land 1.16->1 over 8-10, hold push-in +0.8 %/s and reel 13.3 deg/frame. Prop fade, stagger, whip, ring and fill were not re-measured (items 22-26).

## Constant and variable

CONSTANT: hard cuts between layouts (343/343); caption swap in 0 frames (1222 events); caption band jump on the cut frame; keyword pop in 0 frames (19/19); seam fixed at y 960 (959.6 measured; [M26]); presenter footage never zoomed or panned; entrance ease shape (easeOutExpo / cubic-bezier(0.16,1,0.3,1), t90/t50 ~2.7-3.0) and no overshoot. VARIABLE: which entrance a picture or prop gets (scene: builds 37 %, complete 23 %, fade 20 %, scale-up 14 %, land 7 %; props: pop 45 %, slide 20 %, grow 10 %, fade 7 %, land 2 %), driven by the content of the illustration, not by date; entrance duration (scene 3.7-28 frames p10-p90, median 15; prop grow 4-25, median 11; slide 7-30, median 14); start scale (0.33-0.94 for scale-ins); hold push-in rate (verified 0.27-1.86 %/s where present, about 1 hold in 3 static; [M19]); keyword delay after the close-up cut (10-70 frames). OVER TIME (clip01-07, 2026-10-29 to 11-03, vs clip13-19, 2026-11-07 to 11-12): prop entrance mix pop 43 % vs 44 %, slide 19 % vs 24 %, grow 7 % vs 12 %, fade 11 % vs 5 % (n=282 / 370); clean caption swaps auto-instant 86 % vs 85 %; layout cuts within +-3 frames of a word onset 88 % vs 84 %: no date trend beyond a small shift from fades to grows; the repeated-frame cadence follows the inserted material (clip03, clip09, clip12, clip13, clip18), not the date.

## Open questions

- Fade versus blur at cut entrances: contrast and sharpness drop together on the cut frame (clip02@100, clip13@691); a per-frame Gaussian-blur fit against the settled frame would separate defocus from opacity.
- Rotation and 3D tilt of entering props (cards fanning in clip11@894, tilted cassette clip01@57) were not measured; the tracker models scale and translation only. A similarity/homography tracker on those events would decide.
- Whether the slow hold push-in (+0.8 %/s) is a deliberate camera move on every insert or the tail of the entrance ease rendered over the whole insert; tracking each hold from cut to next cut on a 2-segment model (ease + linear) would decide. Settled by verification: a separate linear move at about 0.6 %/s on about 2 of 3 holds ([M19]).
- Prop timing against the spoken word: word onsets are ~5 frames apart, so nearest-onset offsets cannot distinguish sync from chance; the explanation pass (word-level, by clause) must decide which word each entrance lands on.
- Source of the repeated-frame cadence (spacing 5 and 10 frames) in clip12, clip13, clip18: 24-fps generated video inside the panel, or an editor frame-rate setting.
- Typing speed, counter roll rate, cursor paths and particle bursts (coins in clip13@0-37) were not measured.

Needs an eye or an ear:

- Watch clip01@51-60 (M_fade_wash_clip01_50-57.jpg): is the cream wash a light-bloom 'reveal' (with the cloche lifting) or a plain fade from colour?
- Watch clip12@120-131 (M_whip_clip12_120-131.jpg) and clip11@343-352 (M_noncut_layout_changes.jpg): confirm the whip-in with motion blur and the 4-frame push into a card are deliberate one-offs.
- Watch a hold such as clip03@297-364 and judge whether the measured +2 % push-in is perceptible (M_hold_drift.csv).
- Play clip12@140-240 and clip13@130-160 at speed and judge whether the repeated-frame cadence reads as stutter (M_repeated_frames.csv).
- Check the class mix on a few automatic entrance labels against playback (M_prop_events.csv: kind, first_visible_frame), e.g. clip03@45 (pop), clip06@696 (slide), clip01@64 (grow), clip01@901 (fade), clip19@15 (land from larger).
- Nothing was listened to: whether entrances carry sound effects is for the audio analyst.
