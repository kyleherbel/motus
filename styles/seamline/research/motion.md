# Motion

Measured on the 30 in-style clips of the reference corpus (neutral ids clip01 to clip30, by publication date, 2026-03 to 2026-11). Evidence ids are `clipNN@frame` at the clip's own rate (23.976 or 24 fps); evidence files stay in the private study folder and are not part of this repository. Confidence is the analyst's.

## Summary

Measured on every frame of all 30 in-style clips (52,701 frames, calibrated BT.709 decode, checked: black panel = 0, caption ink = 255). One sweep stored every frame at 135x240 and per-row change for all clips; change events, layout changes, in-shot motion (frame-to-frame ECC affine per panel) and caption arrivals (native-resolution caption band, every frame) were computed on all 30 clips. Title motion was tracked word by word on every frame in 19 clips (template matching at 540x960), push-in curves were measured at 540x960 on 6 shots, motion blur on 3 words; 49 transition candidates and 15 caption arrivals were inspected frame by frame.

The editor never animates a transition. All 630 full-frame changes and 99.3% of 705 layout-mode changes (split, full-face, full footage, seam moves) complete on one frame; no dissolve, wipe, whip, flash, zoom or glitch transition was found that the editor added (every soft candidate is motion inside the source footage). Caption words are hard-swapped on the spoken word (median +0.5 frames from the ASR onset), at full size and opacity on their first frame, and hold dead still. The seam, captions, titles, cards, the circular inset and the split-screen presenter panel never move while shown.

Three things do move. (1) The opening title: each line slides in horizontally from off-frame, adjacent lines from opposite sides, settling on clip frame 19-21 with an identical strong ease-out in every clip (cubic-bezier 0.085, 0.963, 0.707, 0.977 over 18.6 frames, about 1,730 px, motion blur 0.83 x the per-frame step), holds still about 57 frames, then either slides out with a quadratic ease-in in the same direction (about 15 frames to leave the frame) or is removed by the next hard cut. Small connector words blur in place. (2) Every full-frame shot (presenter full-face, also full-frame stills) carries a push-in from 1.00 to about 1.06 over exactly the shot, sine in-out, centred, whatever the shot length. (3) Rarely, a title word does a hard-stepped scale punch (about 2x for 3-5 frames). Footage in the top panel keeps its own motion and gets nothing added that could be measured.

## Rules

### M01. Change visual units (top-panel footage, full-frame footage, presenter shots) with hard cuts only: the new picture is complete on its first frame.

- Values: Full-frame changes: 630, share completing on first frame (completion >= 0.75) 99.4%, completion p10 0.98, median 1.00. Top-only changes 1585 (86.4%), bottom-only 190 (90.0%), partial 398 (83.7%); every lower-completion case inspected is motion inside the footage, not a transition.
- Evidence: n = 30 clips, 52,701 frames, 3,491 events >= 96 px tall. evidence/M_events_completion.csv, M_cutprofile.json; frame strips clip30@558-577 (M_clip30_opening_*.jpg), M_transition_candidates_multiframe.jpg (clip08@901, clip21@224, clip02@1514, clip12@816, clip18@61, clip29@66, clip02@781, clip23@842, clip01@565).
- Confidence: high

### M02. Never use an animated transition (dissolve, wipe, whip, slide, flash, zoom, blur, glitch) between units or layouts.

- Values: Search on every frame: 120 dissolve-shaped intervals (inner frames fit alpha*A + (1-alpha)*B), 10 flash candidates (luma +35 over both neighbours), 24 blur candidates (Laplacian < 35% of neighbours). 49 inspected frame by frame: 0 added by the editor; all are inside the source footage (launch-film fade from white clip08@689-709, explosion clip03@238, UI blur-outs clip13@1346, screen-recorder zoom clip02@1755, circle reveal clip28@396, carousel slide clip16@387).
- Evidence: n = 30 clips. evidence/M_gradual_candidates.txt, M_transition_candidates_gradual_top10.jpg, M_transition_candidates_flash_blur.jpg, M_transition_candidates_lowcompletion.jpg.
- Confidence: high

### M03. Switch layout modes (split <-> full-face, split <-> full-frame footage, seam height changes) on a single frame; the seam never slides or reflows.

- Values: 705 layout changes: split->full-face 154, full-face->split 151, split->full footage 58, full footage->split 55, split->split with seam moved >= 48 px 267, others 20. 700/705 (99.3%) complete on the first frame (completion p10 0.98); the 5 exceptions are footage motion. Animated seam reflow: 0. Seam row at y 960 (+-8 px) in 18,292 + 3,184 frames; other rows appear only as hard steps.
- Evidence: n = 30 clips. evidence/M_layout_changes.json, M_seam_track_summary.json, M_layout_change_soft_candidates.jpg, M_seam_move_runs_candidates.jpg; clip30@46 (seam steps 960 -> ~1190 on one frame, M_clip30_opening_f40-79.jpg).
- Confidence: high

### M04. Put each caption word or phrase on screen in one frame at full size, position and opacity; no pop, scale, slide, fade or typewriter.

- Values: 3,014 clean caption changes: 93.9% have identical extent (+-4 px) on frames t..t+3 automatically; all 15 flagged exceptions viewed at native resolution arrive complete on one frame (flags = background noise). Peak-luma gain from first to fourth frame: median 0.0, p5 -4.1, p95 +4.0 grey levels (no fade). Centre offset from x 540: median -2.5 px.
- Evidence: n = 30 clips, every frame of the caption band y 925-1000 at 1080 px. evidence/M_caption_changes.csv, M_caption_anim.json, M_caption_arrivals_board.jpg (clip08@1482, clip25@186, clip05@775, clip13@1034, clip24@59, clip21@593, clip23@174, clip27@132, clip08@446, clip04@625, clip22@1484, clip20@554, clip26@859), M_caption_swap_clip30_crop.jpg (clip30@21-34).
- Confidence: high

### M05. Swap captions directly from one phrase to the next with no empty frame between, and switch on the onset of the spoken word.

- Values: Only 5.9% of changes follow an empty caption frame. Offset change - ASR word onset: median +0.52 frames, p25 -0.92, p75 +1.76, p10 -2.45, p90 +3.02; 66.3% within +-2 frames (ASR timings are estimates, not forced alignment). Hold per caption: p10 5, p25 7, median 11, p75 16, p90 22 frames.
- Evidence: n = 3,010 changes in 30 clips. evidence/M_caption_sync.json, M_caption_changes.csv.
- Confidence: medium (sync limited by unaligned ASR timings)

### M06. Animate the opening title only by horizontal position: each line slides in from off-frame and lands on clip frame 19-21.

- Values: 26 sliding lines in 16 clips; settle frame 19 (11 lines), 20 (5), 21 (1); later only where the title starts later (clip15 24, clip16 39, clip30 61-62 after a logo opening). Words of one line move together (same dx per frame within 4 px, e.g. clip03 THE/FUTURE 342/332 px at frame 8). No vertical motion (dy 0 px), no scale change while sliding (ncc rises to >= 0.9 at settle at scale 1.0).
- Evidence: n = 19 clips tracked on every frame (clip02-04, 07-09, 12-17, 19, 23-27, 30); 8 clips have no slide title (clip01, 05, 06, 10, 11, 18, 20, 21, by eye). evidence/M_title_word_moves.csv, M_title_tracks_fit.json, M_title_entry_clip03_f0-23.jpg, M_clip30_opening_f40-79.jpg, M_openings_board_clips*.jpg.
- Confidence: high

### M07. Ease the title slide-in with cubic-bezier(0.085, 0.963, 0.707, 0.977) over 18.6 frames from about 1,730 px away.

- Values: Normalised profile dx(t)/dx(settle-10) is the same in every clip: -13: 1.95, -12: 1.57, -11: 1.26, -10: 1.00, -9: 0.78, -8: 0.61, -7: 0.46, -6: 0.34, -5: 0.25, -4: 0.17, -3: 0.115, -2: 0.068, -1: 0.034, 0: 0 (spread at -8: 0.58-0.70). dx at settle-10 median 214 px (p25 200, p75 232). Fits on the median profile, RMSE in px at dx(-10)=200: cubic-bezier 0.29 (N 18.6 f, D 8.07 x); expo-out 1.6 (N 33.7); circ-out 3.6; power-out n=2.31 6.7; cubic-out 19.1; quart-out 38; quint-out 53. Pooled over all 515 raw samples: bezier 20.6 px, power-out 23.6 (early frames noisy from motion blur and frame edge).
- Evidence: n = 36 word tracks, 15 clips (median profile n 26-36 per frame). evidence/M_title_easing_pooled.json, M_title_entry_profile_fit.json, M_title_easing_plot.png.
- Confidence: high

### M08. Send adjacent title lines in from opposite sides; the first line may come from either side.

- Values: Adjacent sliding lines opposite: 10 of 10 pairs. First-line directions: from right 13, from left 13 over all lines. Example clip30: HISTORY from right (+542 px at frame 46), MADE from left (-470 px at frame 44).
- Evidence: n = 16 clips with tracked slides. evidence/M_title_word_moves.csv, M_title_clip30_words.json, M_title_entry_clip03_f0-23.jpg.
- Confidence: high

### M09. Give sliding title words horizontal motion blur about 0.83 times their per-frame displacement.

- Values: Box-blur length that best matches the moving word / speed: median 0.83, p10 0.68, p90 0.98 (e.g. speed 80 px/f -> 67 px blur, 33 -> 27, 14 -> 11).
- Evidence: n = 25 frames, 3 words in 3 clips (clip14 w0 @6-15, clip26 w3 @6-15, clip30 w0 @52-57). evidence/blur/c14_w0.json, c26_w3.json, c30_w0.json.
- Confidence: medium (3 clips)

### M10. Bring small connector words of a title (of, the, for) in place with a defocus blur that clears on the settle frame, not with a slide.

- Values: clip03 'of...': Gaussian sigma >= 40 px (frames <= 15), 30 (16), 20 (17), 10 (18), 3 (19), 0 (20); position change 0 px. In the tracks, clip13 'of' sits at dx 0 from frame 17, and clip30 'HAS'/'BEEN' move at most 40-62 px (frames 44-47) then sit at dx 0 while their match score ramps from 0.59 to 0.97 over 10 frames (blur clearing), unlike the 500-900 px slides of the main words.
- Evidence: n = 1 measured (clip03@12-24), 3 more seen in tracks (clip13, clip30). evidence/blur/c03_of.json, M_connector_blur_in_clip03.jpg, M_title_tracks_fit.json.
- Confidence: low (one measured instance)

### M11. Hold the settled title completely still until it leaves, about 57 frames.

- Values: During the hold dx = 0 (tracking step 2 px) and match score >= 0.9 on every frame in all tracked titles; no drift, scale breathing or float. Settle -> exit: clip02 50, clip03 53, clip04 74, clip07 68, clip09 57, clip14 80, clip24 19 frames (median 57).
- Evidence: n = 7 clips with measured exit, 19 tracked. evidence/M_title_word_moves.csv.
- Confidence: medium

### M12. Take the title off either by sliding each line out with a quadratic ease-in, continuing its entry direction, or by the hard cut to the next layout.

- Values: Slide-out distance after k frames (median px): 1:4, 2:14, 3:28, 4:48, 5:74, 6:106, 7:142, 8:186, 9:240, 10:302; past 850 px after 14-16 frames (median 14.5). Fits: power-in n = 2.02 RMSE 3.7 px; cubic-bezier(0.248, 0.016, 0.654, 0.124) over 16.8 f RMSE 2.9 px; sine-in 3.9; expo-in 31.3; linear 31. Direction continues entry in 15 of 18 word tracks. Slide-out in 8 clips (02, 03, 04, 07, 08, 09, 14, 24); removed by a hard cut in 6 (13, 15, 17, 19, 23, 27); unclear 3.
- Evidence: n = 17 exit tracks in 8 clips. evidence/M_title_easing_pooled.json, M_title_exit_clip03_f70-89.jpg.
- Confidence: high for the curve, medium for the choice between slide-out and cut

### M13. Do not overshoot or bounce any title move.

- Values: 0 of 42 entry tracks reverse sign by more than 3 px before settling; approach is monotone (e.g. 10, 4, 0 px on the last three frames).
- Evidence: n = 42 word tracks, 16 clips. evidence/M_title_tracks_fit.json.
- Confidence: high

### M14. Reuse the same slide-in for big word titles placed later over full-face shots, one line after the other.

- Values: clip19 'MERGING' dx per frame 50:-754, 52:-578, 54:-396, 56:-260, 58:-162, 60:-96, 62:-52, 64:-24, 66:-8, 68:0, i.e. 0.59, 0.32, 0.15, 0.05 of dx(settle-10) at -8, -6, -4, -2 (opening profile 0.61, 0.34, 0.17, 0.07). Second line enters about 8 frames later from the other side (clip19 'CHATGPT', clip22@134-143 'NEWEST'/'MODEL', read by eye). clip19@84-88 shows a defocus blur-out exit (by eye).
- Evidence: n = 1 measured, 2 more by eye. evidence/M_midtitle_clip19_track.json, M_midvideo_title_clip19_f50-99.jpg, M_midvideo_titles_board.jpg.
- Confidence: low (one measured clip)

### M15. If a beat needs emphasis, punch a title word by stepping its scale without interpolation: about 2x for 3-5 frames, optionally about 0.5-0.7x for 2 frames, then back to 1x.

- Values: clip22@30-34 oversized (>= 1.9x, clipped by the frame) 5 frames; clip22@175-177 ~2.0x (pixel-area estimate 1.97), @178-179 0.54x (left edge x 379 vs 241), @180 1.0x; clip30@7-8 smaller (~0.7x by eye), @9-10 oversized, @11 1.0x. Every step lands on one frame.
- Evidence: n = 3 events in 2 clips. evidence/M_scale_punch_clip22_f26-38.jpg, M_scale_punch_clip22_f172-182.jpg, M_scale_punch_clip30_f5-12.jpg, M_aba_inserts.json.
- Confidence: low (2 clips)

### M16. Give every full-frame shot (presenter full-face, also a full-frame still) a push-in from scale 1.00 to about 1.06 that spans exactly the shot, eased sine in-out, centred on the frame.

- Values: 190 full-face shots: cumulative scale p10 1.000, p25 1.031, median 1.059, p75 1.078, p90 1.101; 75.3% >= 1.03, 13.7% < 1.01. Amount does not grow with length (medians 1.064 / 1.068 / 1.062 / 1.065 for <20 / 20-30 / 30-45 / 45-80 frames; corr 0.26). Six 540x960 curves: amplitude 0.042-0.075 (median 0.060); start 0-5 frames after the cut, end within 2 frames of the next cut (bezier fit). Fit RMSE (per mille of scale): cubic-bezier(0.436, -0.146, 0.683, 1.0) 1.55, sine in-out 1.59, quad in-out 1.62, cubic in-out 1.80, linear 1.89. Velocity peak at 0.48 of the move (q25 0.32, q75 0.60). Fixed point: (539, 959) on the clean still clip27@87-115, (549, 1009) clip14@1255-1303; presenter motion makes others noisy.
- Evidence: n = 190 shots in 27 clips (ECC every frame), 6 high-res curves (clip02@2213, clip12@171, clip14@1255, clip15@177, clip23@590, clip27@87). evidence/M_fullframe_segments_labeled.json, M_fullface_push_fit.json, M_fullface_push_curves.png, ff_*.json, M_fullface_push_clip15_f176-193.jpg, M_fullframe_segments_grid.jpg.
- Confidence: high

### M17. Do not move, zoom or punch the presenter inside the split-screen panel; change the presenter only by cutting.

- Values: Split bottom panels: cumulative in-shot scale p5 0.934, p25 0.992, median 1.002, p75 1.013, p95 1.116 (tails are panels holding footage or seam misreads). Per-frame translation median 1.0 px (presenter movement), no consistent direction.
- Evidence: n = 844 panel shots, 30 clips. evidence/M_inshot_motion.csv, M_inshot_summary.json.
- Confidence: high

### M18. Leave footage in the top panel with its own camera motion and add no Ken Burns move to it; hold static screenshots static.

- Values: Top-panel shots: cumulative scale p10 0.901, median 1.004, p90 1.328; classes complex 295, zoom-in 209, zoom-out 116, static 155, pan 72 (camera moves, screen-recorder zooms and scrolls inside the sources). Still-like shots (ECC cc >= 0.998, n 402): static 141, push-in like M16 (1.02-1.15, whole shot) 19 (4.7%), the rest scrolls and recorder zooms. No common preset is visible in the top panel.
- Evidence: n = 847 top-panel shots, 30 clips. evidence/M_inshot_motion.csv, M_top_still_pushins.json, M_top_zoom_samples.jpg, M_still_zoom_samples.jpg.
- Confidence: medium (editor moves and source moves cannot be fully separated)

### M19. Pop overlays (circular presenter inset, product cards on a dark or white canvas) in and out on one frame at full size and keep them still while shown.

- Values: clip30@236: circle inset full size on its first frame, background continues; clip08@901 and @907: cards appear complete on one frame, positions identical through @914; no scale, fade or slide observed.
- Evidence: n = 3 events in 2 clips viewed every frame, plus every panel change in M01. evidence/M_pip_hard_entry_clip30_f232-240.jpg, M_card_pop_clip08_f899-908.jpg.
- Confidence: medium (by eye on every frame, few events)

### M20. Add no idle motion: no camera shake, no rotation, no drift, no breathing on captions, titles, seam or overlays; the only continuous editor motion is the full-frame push (M16).

- Values: Still-like top shots: per-frame translation median 0.26 px (p90 1.8). Full-face shots: second difference of x translation median 0.94 px (p90 2.1), no oscillation. Captions: extent unchanged within +-4 px across holds (M04). Titles: dx 0 during hold (M11). Seam: only one-frame steps (M03). Rotation was not estimated numerically; none seen in any board (read by eye).
- Evidence: n = 30 clips. evidence/M_inshot_summary.json, M_caption_changes.csv, M_seam_track_summary.json.
- Confidence: high for shake and drift, medium for rotation

### M21. Do not insert black or white dip frames between shots.

- Values: Flat (std <= 3) panel runs: 31 in 15 clips, lengths 1 f (11), 2 f (9), 3 f (5), 4-11 f (6); 23 start on a cut and are the head or tail of a source clip (e.g. clip05@1328 top black 2 f before a cut to full-face, clip04@1899 grey 2 f).
- Evidence: n = 30 clips. evidence/M_blank_runs.json, M_transition_candidates_flash_blur.jpg (clip04@1789, @1899, clip05@1328).
- Confidence: medium (attribution to source tails is by eye)

### M22. Keep these motion rules for every date: nothing in the motion changed from March to November 2026.

- Values: Full-frame cuts one-frame: 99.5% (clip01-11, n 206) vs 99.3% (clip12-30, n 424). Caption arrivals stable: 94.9% (n 1211) vs 93.3% (n 1803), hold median 11 vs 11. Full-face push share >= 1.03: 69.4% (n 72, median 1.048) vs 78.8% (n 118, median 1.064). Title slide profile identical from clip02 (2026-03-18) to clip30 (2026-11-15); clip01 (2026-03-11) has no slide title.
- Evidence: n = 30 clips split at 2026-04-11 / 2026-05-11. evidence/M_events_completion.csv, M_caption_changes.csv, M_fullframe_segments_labeled.json, M_title_easing_pooled.json.
- Confidence: high

### M23. Use these motion tokens (frames at 23.976 fps).

- Values: cut 0 f; caption enter 0 f, sync +0.5 f, hold 11 f; title slide-in 18.6 f, settle frame 19-21, ~1,730 px, cubic-bezier(0.085,0.963,0.707,0.977), blur 0.83x; connector blur-in sigma 40->0 over 5 f; title hold 57 f; title slide-out quadratic ease-in ~3.0 px/f^2, off frame after ~15 f; scale punch 2.0x x3-5 f / 0.54x x2 f, no interpolation; full-frame push 1.00->1.06 over the shot, sine in-out, centre; split presenter panel 0 motion; top footage +0 added motion; overlays 0 f pop; shake 0.
- Evidence: numbers.json motion_tokens and build_spec; sources as in M01-M22.
- Confidence: high (per-token confidence as in the source rule)

## Constant and variable

CONSTANT: hard cuts for every unit and layout change (0 frames, 99.3-99.4%); caption words hard-on at full size, swapped on the spoken word, never animated; seam, captions, titles, overlays and the split presenter panel never move while shown; title slide-in curve (same normalised profile in 15 clips: 0.61 at settle-8, 0.34 at -6, 0.17 at -4, 0.07 at -2), settle on frame 19-21 when the title opens the clip, adjacent lines from opposite sides, no overshoot; title slide-out curve (quadratic ease-in, same px profile in 8 clips); full-frame push-in amount (about 6%) independent of shot length; no shake, no dips, no editor transitions. VARIABLE: whether a clip has a slide title (22 of 30 by eye); which side the first title line enters from (13/13); title hold (19-80 frames, set by the speech); whether the title slides out (8 clips) or is cut away (6); push amount 4.2-7.5% per shot and about 25% of full-face shots without a measurable push; scale punches (2 clips); all motion inside the footage (camera moves, screen-recorder zooms, UI animations) which is the source's, not the editor's.

## Open questions

- Whether the 19 push-ins on top-panel stills (4.7%) are the editor's M16 preset or screen-recorder zooms: decide by finding the original screenshots and checking whether the pixels are scaled copies.
- Exact anchor of the full-face push: the one clean still (clip27@87-115) is centred at (539, 959); presenter shots give noisy anchors (113-549 px in x). Re-measure on background-only regions at full resolution.
- Whether scale punches and title cuts are timed to sound hits: needs the audio analyst's onsets (clip22@30, @175, clip30@7, @9).
- The connector-word blur-in and the mid-video blur-out exit are measured once each; more instances would settle their curves.
- Line stagger in mid-video titles (about 8 frames, by eye on clip19 and clip22) was not measured numerically.
- Rotation was never estimated numerically (ECC affine scale and translation only).

## For a person to check

- Watch the title openings in motion to confirm the slide reads as one smooth move with blur (evidence/M_title_entry_clip03_f0-23.jpg, M_clip30_opening_f40-79.jpg; clips 03, 14, 26, 30 frames 0-24).
- Watch 5 full-face shots to confirm the push-in is visible and centred (evidence/M_fullface_push_clip15_f176-193.jpg; clip14@1255-1303, clip27@87-115).
- Listen for whether scale punches and caption swaps land on sound effects or beats (clip22@28-36, @172-182, clip30@5-12); nothing was listened to.
- Confirm that the soft transitions in evidence/M_transition_candidates_*.jpg are inside the source videos (open the original launch films if available).
- Look at clip12@476-483 (a picture over the presenter darkens over 5 frames): single case, unclear whether editor fade or source.
