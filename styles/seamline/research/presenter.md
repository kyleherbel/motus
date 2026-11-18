# Presenter

Measured on the 30 in-style clips of the reference corpus (neutral ids clip01 to clip30, by publication date, 2026-03 to 2026-11). Evidence ids are `clipNN@frame` at the clip's own rate (23.976 or 24 fps); evidence files stay in the private study folder and are not part of this repository. Confidence is the analyst's.

## Summary

Measured the presenter on all 30 in-style clips (2203.7 s): YuNet face boxes and landmarks refined at native resolution, SFace identity, PP-HumanSeg head tops and full-width seam profiles at 2 samples/s (4402 samples, calibrated BT.709 limited->full decode); every-frame 90x160 differences for cuts; SIFT/RANSAC registration across every presenter layout switch (399 switches); background-only ECC scale curves inside full-face, low-seam and the two longest split shots of each clip; circle fits for picture-in-picture; spectral and simulated-enlargement tests for resolution.

One presenter, one locked-off desk camera. The main layout is a full-width bottom panel whose top edge is a hard, unstroked seam at y 953-962 (median 959): face 172 px wide, eyes 255 px below the seam (26.5 % of the panel), head top 96 px below it, eyes near x 519. The full-frame face is the same take enlarged about 1.95x (fixed per clip, 1.80-2.00), entered and left with a hard cut, framed on the same camera rows; about three full-face shots in four push in from 1.00 to about 1.067 with an ease-in-out stretched over the whole shot; the split panel never moves. When the seam moves (1086-1320 lower, 658-708 higher) the presenter is rescaled by (1920-seam)/960 so the same rows stay in view. A hard-edged circle (r 177-269) is used in 6 clips, a head-pop-out card once (clip11). Jump cuts run about 2.9 per presenter-minute with no punch-in; no mirror flips.

The full-face carries detail a 2x enlargement of the split render lacks, so the source is at least about twice the split panel's resolution (consistent with a 4K landscape camera). For another speaker: landscape 16:9, ideally 3840x2160, raw face at least about 245 px wide for full-face; extra enlargement beyond about 1.5x looks like the soft version the creator never ships (proxy measure, needs a human eye).

## Rules

### P01. Use one presenter, filmed at one desk with a locked-off camera; every presenter shot in a video is a crop of that one camera take (no second angle).

- Values: SFace presenter identity across clips: min cross-clip cosine 0.63 (same-person threshold 0.363), n=30 clips. Split framing inside shots (background-only ECC, person and captions masked): last-frame scale vs first median 1.0002, p10 0.9996, p90 1.0015 over 56 split shots (the two longest per clip); across jump cuts the background is identical (P18). Exceptions: b-roll of the presenter in other rooms (clip05@1416, clip24@396) and a wide room camera (clip17@96).
- Evidence: n=30 clips, 4402 samples at 2/s; evidence/presenter_samples.csv (id_cos column), evidence/P_jump_cuts_sheet.jpg (identical backgrounds across cuts)
- Confidence: high

### P02. Split the runtime: presenter in the bottom panel about 56 %, full-frame face about 17 %, no presenter about 17 %, small variants the rest.

- Values: Share of total runtime (2203.7 s, 30 clips): split 55.9 %, full_face 17.2 %, footage 16.9 %, split_low 4.0 %, pip 2.3 %, wide 2.3 %, card 0.7 %, split_noface 0.4 %, presenter_top 0.3 %. Clips using: split 30, full_face 27, footage-only 27, split_low 15, pip 8, wide 13.
- Evidence: n=30 clips at 2 samples/s; evidence/presenter_samples.csv; numbers.json geometry.runtime_share_per_clip
- Confidence: high

### P03. Draw the presenter panel as a full-width rectangle from the seam to the bottom edge: no corner radius, no stroke, no shadow, a hard edge.

- Values: Panel x 0..1080, y seam..1920. First panel row per clip (native rows, mean |dy| peak over 6 split frames): median 959, range 953..962 (n=26 clips; clip02 and clip11 excluded: weak edge / card layout); constant inside a clip. The step spans 1-2 rows (clip28@1068 rows 959->960->961: 220,205,140 grey).
- Evidence: n=26 clips; evidence/P_geometry_split.jpg; numbers.json main_seam_per_clip, seam_precise
- Confidence: high

### P04. Scale the split-panel presenter so the face (cheek to cheek) is about 172 px wide and the eye distance about 78 px.

- Values: face_w median 172, p10 163, p90 180, range 158..186 (n=28 clips); iod median 78, p10 74, p90 83, range 71..85 (n=28 clips). Sample-level n=2251.
- Evidence: evidence/P_geometry_split.jpg, P_scatter_facew_eyeline.png, presenter_samples.csv
- Confidence: high

### P05. Place the split-panel eye line about 255 px below the seam (26-27 % of the panel height), the head top about 96 px below the seam, the chin about 1364.

- Values: eye_y median 1213, p10 1202, p90 1233, range 1177..1255 (n=28 clips); eye minus seam median 255, p10 246, p90 274, range 220..293 (n=28 clips); eye fraction of panel 0.265 (p10 0.255, p90 0.285); head top median 1054, p10 1044, p90 1076, range 1024..1106 (n=28 clips); headroom median 96, p10 88, p90 116, range 67..144 (n=28 clips); chin (YuNet box bottom) median 1363, p10 1344, p90 1384, range 1331..1394 (n=28 clips). clip11's bottom presenter is the card layout (P17) and is counted separately.
- Evidence: evidence/P_geometry_split.jpg (median and p10/p90 lines), presenter_samples.csv
- Confidence: high

### P06. Put the eye centre within about 45 px of the frame centre; since May the eyes sit about 30 px left of centre (x 510).

- Values: split eye_x median 519, p10 492, p90 571, range 479..586 (n=28 clips); clip01-10 median 565 (n=8 clips), clip12-30 median 510 (n=19 clips). full_face eye_x median 487, p10 466, p90 552, range 451..577 (n=25 clips).
- Evidence: evidence/P_trend_by_clip.png, presenter_samples.csv
- Confidence: medium (variation driven by where he sits; trend is visible but small)

### P07. Cut to the full-frame face by enlarging the same camera take about 1.95x (1.80-2.00, fixed for the whole video), as a hard cut on one frame.

- Values: Registration of the last split frame to the first full-face frame (SIFT+RANSAC similarity on the panel): scale median 1.9201, p10 1.8002, p90 1.9965 (n=78 of 143 cuts, 27 clips); rotation median 0.01 deg. Median of the 24 per-clip medians 1.956. Per clip constant: e.g. clip02 1.800 (10 cuts), clip21 1.87, clip01/06/12/13/14/23 1.913-1.917, clip15/17/19/28/29 1.998-2.001. Face width ratio median 1.919. Single-frame cut (difference spike on one frame): 136 of 143.
- Evidence: evidence/P_transition_pairs/ (before|after pairs), numbers.json transitions, split_to_full_continuity.scale_per_clip
- Confidence: high

### P08. Frame the full-face window on the same camera rows as the split panel: its bottom at the panel bottom, its top 0-80 px above the panel top, centred on the face.

- Values: Full-face window in split-panel coordinates: bottom 1923.8 (p10 1909.4, p90 1945.5); top minus seam -31.5 (p10 -79.3, p90 2.1); width 540-600 split px; centre x 553.7 (p10 513.5, p90 589.5), n=78 cuts.
- Evidence: evidence/P_split_to_fullface_cuts.csv, P_transition_pairs/; numbers.json split_to_full_continuity.per_cut
- Confidence: high

### P09. Full-face geometry: face about 343 px wide, eye line about 527, head top about 212, chin about 836.

- Values: face_w median 343, p10 320, p90 358, range 313..371 (n=25 clips); iod median 154, p10 146, p90 165, range 141..167 (n=25 clips); eye_y median 527, p10 493, p90 590, range 434..620 (n=25 clips); head_top median 212, p10 162, p90 286, range 136..327 (n=25 clips); chin median 836, p10 787, p90 870, range 711..884 (n=25 clips). Sample n=699.
- Evidence: evidence/P_geometry_full_face.jpg, presenter_samples.csv
- Confidence: high

### P10. Inside each full-face shot, push in from 1.00 to about 1.07 stretched over the whole shot (keyframes at the shot's first and last frame) with an ease-in-out curve; the split panel never moves.

- Values: Background-only ECC (person masked, caption band masked) every 2nd frame: 157 of 203 full-face shots end above 1.02; end scale of those median 1.067, p10 1.0328, p90 1.0852; shot length 1.33 s (p10 0.73, p90 3.62). Normalised progress per tenth of the shot: [0.004, 0.039, 0.118, 0.246, 0.421, 0.591, 0.764, 0.899, 0.977, 1.0]. Time to 50 % of the gain: 0.525 of the shot (p10 0.428, p90 0.588). Easing fit over 142 shots (2205 points, shot position -> progress): CSS ease-in-out(.42,0,.58,1) RMS 0.1294, sine in-out 0.1295, quad in-out 0.1295 (indistinguishable), linear over the whole shot 0.1596, CSS ease 0.2336; best window starts at -0.02 and ends at 0.98 of the shot. Zoom centre x 500.9 (p10 312.4, p90 668.7), y 960.2 (p10 902.6, p90 986.0): the frame centre. Example clip26@1259-1293: 1.000,1.000,1.003,1.021,1.042,1.059,1.066 at frames 0,4,8,15,21,27,33. Split shots: end scale p10 0.9996, p90 1.0015 (n=56 shots).
- Evidence: evidence/P_shot_scale_curves.csv, P_pushin_curves.png; numbers.json shot_curves
- Confidence: high

### P11. Apply the push-in to about three full-face shots in four, at every shot length; the end scale stays about 1.067 whether the shot lasts 0.75 s or 4 s.

- Values: Pushed 157 of 203 full-face shots in 27 of 27 clips; clip01-11 54 of 77, clip12-30 103 of 126 (no trend). End scale by shot length: <0.75 s 1.057 (n=16), 0.75-1.25 s 1.067 (54), 1.25-2 s 1.069 (42), 2-3.5 s 1.068 (25), >3.5 s 1.070 (20). Static shots (end <1.02, n=46) are shorter: median 1.0 s.
- Evidence: evidence/P_shot_scale_curves.csv, P_pushin_curves.png; numbers.json shot_curves.full_face_push_in_per_clip
- Confidence: medium (static shots may include ECC failures on busy backgrounds)

### P12. Return from full-face to split with a hard cut; about one switch in three also skips time (a jump cut hidden by the layout change).

- Values: full_face->split: n=142 cuts, 26 clips, registered scale median 0.4951 (about 1/(full-face scale x push-in)), single-frame 133. split->full_face continuity: predicted vs found eye position error median 0.087 IOD; same moment (<0.15 IOD) in 65 % of 78 cuts.
- Evidence: evidence/P_split_to_fullface_cuts.csv, P_transition_pairs/; numbers.json transitions
- Confidence: medium (continuity read from face position only; audio not checked)

### P13. When the seam moves, rescale the presenter by panel height: scale = (1920 - seam) / 960 of the split scale, keeping the same camera rows and widening or narrowing the view.

- Values: split->split_low registrations: scale vs predicted (1920-seam_new)/(1920-seam_old): clip12 0.734/0.730, 0.644/0.602, clip13 0.845/0.857, clip20 0.673/0.674, clip24 0.693/0.704, clip30 0.759/0.756; back: clip13 1.338/1.345, clip20 1.483/1.485, clip03 1.132/1.149. Per-clip face ratio split_low/split median 0.69 (n=14 clips). Eye fraction of the shorter panel 0.270 vs 0.265 in split. Higher seams (658-708) scale up the same way: clip07@876 1.28, clip13@444 1.25, clip14@672 1.30 (n=3 clips).
- Evidence: numbers.json transitions['split->split_low'], geometry.per_layout.split_low; evidence/P_geometry_split_low.jpg
- Confidence: high

### P14. Lower seams sit at 1086-1320 (median 1204) and appear mid-video, not only in the opening.

- Values: split_low seam p10 1086.0, median 1204.0, p90 1287.0 (n=164 samples, 14 px-exact clips); 7 % of these samples fall in the first 5 s. Runtime share 4.0 %.
- Evidence: evidence/presenter_samples.csv (label split_low)
- Confidence: medium (seam row found on the strongest full-width edge; a dark seam can be missed)

### P15. When the top footage only overlaps the panel by up to about 85 px, leave the presenter at the split scale (no rescale).

- Values: Registrations with seam 996-1043 and scale 1.000: clip17@1086 (1004, 0.9996), clip21@111 and @1500 (996, 1.003/1.000), clip27@9 (1043, 0.998).
- Evidence: evidence/P_transition_pairs/clip17_01086_split_to_split_low.jpg; numbers.json transitions
- Confidence: medium (n=3 clips)

### P16. Use the circular picture-in-picture rarely: a hard-edged circle of radius 177-269 px holding the presenter at 0.6-0.8x split scale, top-right or bottom-left, allowed to run off the frame edge.

- Values: Circle fits (rays from the face, RANSAC, residual <0.7 px): clips with >=4 samples ['clip03', 'clip08', 'clip11', 'clip12', 'clip22', 'clip30']; clip03: centre (937,331) r 208, face 100 px, bbox [729, 123, 1145, 539]; clip08: centre (816,891) r 177, face 108 px, bbox [639, 714, 993, 1069]; clip11: centre (918,462) r 197, face 116 px, bbox [721, 266, 1115, 659]; clip12: centre (944,382) r 241, face 126 px, bbox [703, 141, 1184, 622]; clip22: centre (158,1343) r 227, face 130 px, bbox [-70, 1115, 385, 1570]; clip30: centre (145,1176) r 268, face 134 px, bbox [-123, 907, 414, 1444]. Face width / radius median 0.547; eye 26-57 px above the circle centre. pip->split scale median 1.256 (n=7). Runtime share 2.3 %. Boundary profile: luma jumps within 1-2 px, no ring of a separate colour (no stroke) except clip08 (8 px soft edge).
- Evidence: evidence/P_pip_sheet.jpg; numbers.json pip
- Confidence: medium (6 clips)

### P17. One video (clip11) used a rounded presenter card with the head popping out above it; treat it as a one-off.

- Values: clip11: card left 77.0, right 1003.0, top 1486.0 (to the bottom edge), corner radius 16.0 px (fit), head above the card top by 84.0 px (person mask), face 132.8 px; n=25 samples. No other clip has it.
- Evidence: evidence/P_card_clip11.jpg; numbers.json card
- Confidence: low (seen in one clip)

### P18. Cut within the presenter take about three times per presenter-minute, without changing the framing (no punch-in on a jump cut).

- Values: 91 jump cuts (presenter in both frames, same layout, panel difference spike) in 29 of 30 clips; per presenter-minute 2.93 (p10 1.16, p90 5.51, max 8.74); interval 7.88 s (p10 1.14, p90 40.73). Face width ratio across the cut 0.995 (p10 0.916, p90 1.046); eye shift 0.347 IOD. By layout {'split': 67, 'full_face': 20, 'split_low': 4}.
- Evidence: evidence/P_jump_cuts.csv, P_jump_cuts_sheet.jpg
- Confidence: medium (a jump with little motion can fall under the detector threshold; counts are a lower bound)

### P19. Never mirror the presenter.

- Values: Panel/face correlation with the clip median, straight vs mirrored: 19 of 3248 samples favoured the mirror, all of them composition changes on inspection (grid cell clip11@1008, taller panel clip08@552, different seat clip12@1008), none a flip. Mirrored registration beat the straight one in 2 of 399 layout switches (2 full_face->split cuts, both low-inlier).
- Evidence: evidence/P_mirror_flip_test.csv, P_transition_pairs/; numbers.json mirror_flip_test, transitions
- Confidence: high

### P20. Never cut the presenter out of his background in the main layouts: the presenter is always a rectangular (or circular) crop of the camera frame; only clip11 composites a head over the footage.

- Values: No person-mask edges against the footage were found in split, full_face or pip samples; the seam row is a straight full-width edge (P03); the only overflow is clip11 (P17).
- Evidence: evidence/P_geometry_split.jpg, P_card_clip11.jpg
- Confidence: medium (checked by the seam/card detectors and by eye on mosaics, not by a dedicated matte detector)

### P21. Take the presenter off screen for about 17 % of the runtime, in stretches of up to 6-8 s typically and never more than about 18 s.

- Values: Share of runtime with no presenter per clip: median 16.4 %, p10 0.6 %, p90 40.6 %, max 50.5 % (clip30); longest absence per clip median 5.8 s, p90 12.9 s, max 18.5 s (n=30, 0.5 s resolution).
- Evidence: evidence/P_presence_per_clip.csv; numbers.json geometry.absence
- Confidence: high

### P22. Treat the full-face as cut from a higher-resolution source, not an enlargement of the split render: it has detail a 2x enlargement of the split panel lacks.

- Values: First full-face frame vs the last split frame warped 2x into it (same moment): mean log10 power in 0.25-0.40 cyc/px is higher by 0.404 (p10 0.222, p90 0.536; n=50 cuts), positive in 94 %. By eye on enlarged crops: stubble, eyelid and hair detail present in the full-face, absent in the 2x split.
- Evidence: evidence/*_split2x_vs_fullface.png, numbers.json sharpness
- Confidence: medium (spectral comparison includes codec noise; camera model unknown)

### P23. Do not enlarge a speaker's source by more than about 1.5x; beyond 1.75x it is as soft as the enlarged split render the creator never uses.

- Values: Extra enlargement simulated on 25 real full-face frames (area down, cubic up): high-band loss (log10, 0.25-0.40 cyc/px) 1.1x 0.155, 1.15x 0.170, 1.25x 0.189, 1.5x 0.238, 1.75x 0.404, 2.0x 0.458; the gap between the real full-face and a 2x-enlarged split is 0.404. Knee between 1.5x and 1.75x.
- Evidence: evidence/P_enlargement_sim.csv, *_split2x_vs_fullface.png; numbers.json enlarge_sim, sharpness
- Confidence: low (proxy measure; softness must be judged by eye)

### P24. Ask for landscape 16:9, locked off, ideally 3840x2160, with the speaker centred, face about 18 % of the frame height, and at least a face height of room above the head and ~30 % of the width free on each side.

- Values: Split window = 1080x960; the camera frame extends >=327 px left and >=271 px right of it at split scale (clip12@1402 split_low window x -327..1351) and above it (clip12 wide shot shows y 804..2343 in split coordinates). Full-face uses about 1080/1.95=554 x 985 split px of it. Face 172 of 960 window rows = 18 %; headroom 96/960 = 10 %; eye at 26.5 %. Framed like the corpus (face 18 % of frame height): a 2160-row source gives a raw face of ~389 px, so the full-face (343-367 px) is 0.88-0.94x of source pixels; a 1080-row source gives ~194 px and a 1.77-1.89x enlargement (over the P23 limit).
- Evidence: evidence/P_transition_pairs/clip12_00057_split_to_split_low.jpg, P_geometry_split.jpg; numbers.json transitions, split_to_full_continuity
- Confidence: medium (source resolution inferred, not observed)

### P25. To fit a different speaker: scale the raw so his face is 172 px wide in the split and the eye line lands 255 px below the seam at x 500-540; full-face = the same take x1.95 cropped 1080x1920 with its bottom on the panel bottom, then push in to 1.07; if his raw face is narrower than ~245 px (full-face would exceed 1.5x), use the split, split_low or pip instead of full-face.

- Values: Derived from P04-P10, P13, P23: full-face target face width 343-367 px; 1.5x limit -> raw face >= 245 px for full-face and >= 114 px for split. Headroom: raw head top must be >= 96/172 = 0.56 face widths below the top of the window used; chin to panel bottom 556 px = 3.2 face widths of body/desk below.
- Evidence: evidence/P_geometry_split.jpg, P_geometry_full_face.jpg, P_enlargement_sim.csv; numbers.json build_spec.raw_footage_requirements
- Confidence: medium (derived rule)

### P26. Rare full-frame presenter variants: a medium full-frame shot at about 1.25x split scale (clip12) and a 16:9 letterbox of the whole camera frame at about 0.64x (clip13); do not use them by default.

- Values: clip12@600 registered to split: scale 1.247, 86 inliers; clip12 'wide' samples face 210-219 px (n=12). clip13@636/@804 face 81-111 px in a full-width 16:9 strip. Runtime share of all 'wide' presenter samples 2.3 % in 13 clips, which also include presenter b-roll and missed circles.
- Evidence: numbers.json transitions['split->wide'], presenter_samples.csv (label wide)
- Confidence: low (1-2 clips each)

## Constant and variable

CONSTANT: one presenter and desk camera per clip; panel x 0..1080 to the bottom edge, no radius/stroke/shadow, hard seam; split framing locked within a clip (scale 1.000 +-0.001); full-face scale constant within a clip; push-in end scale ~1.067 whatever the shot length; layout switches are hard cuts; no mirroring; presenter never matted out of his background (except clip11). VARIABLE: seam row by clip (953-962) and by moment (1086-1320 lower, 658-708 higher, with the rescale rule); full-face scale by clip (1.80-2.00); push-in on ~77 % of full-face shots (no date trend); eye x by clip (479-586, drifting left over the year); face size by clip (158-186 px, driven by where he sits); presence of PiP circles (6 clips), card (1 clip), wide variants (13 clips, small shares); share of runtime without the presenter (0-50 %).

## Open questions

- Camera resolution: the spectral test shows the full-face is not an enlargement of the split render, but the exact source (4K vs 2.7K) cannot be read from the platform encode. A raw file from the creator would decide.
- Whether a full-face switch lands on emphasised words or sentence starts was not measured (transcripts were not used); the structure analyst's speech alignment should decide when to cut to full-face.
- Push-in timing on very short full-face shots (<0.7 s) is noisy in ECC; an every-frame landmark-free registration on more shots would firm up the ease curve.
- The PiP circle and clip11 card are rare; whether they are a retired style or occasional tools cannot be decided from 6 and 1 clips.
- Jump-cut counts are a lower bound: cuts with very little motion fall under the difference threshold; audio would reveal them.

## For a person to check

- Watch 3-4 full-face shots to confirm the slow push-in reads as a deliberate move (clip26@1259-1293, clip21@991-1096): evidence/P_shot_scale_curves.csv.
- Look at evidence/*_split2x_vs_fullface.png to confirm the full-face is visibly sharper than a 2x enlargement of the split, and judge at what enlargement a speaker's footage starts to look soft (P23 is a proxy).
- Listen across split->full_face cuts flagged as non-continuous (eye error > 0.15 IOD in numbers.json split_to_full_continuity.per_cut) to confirm they are time jumps.
- Check the clip11 card (evidence/P_card_clip11.jpg): corner radius and head pop-out were fitted, not watched in motion.
- Check the circle PiP edges for a thin stroke or shadow at full resolution (evidence/P_pip_sheet.jpg).
