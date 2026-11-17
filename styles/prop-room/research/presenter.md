# Presenter

Measured: Every frame of all 19 clips (20,881 frames at 29.97 fps, 697 s) on a calibrated BT.709 limited-to-full decode (the caption-glyph white decodes to 255,255,255). Apple Vision face landmarks and a person matte ran on every frame; each presenter run (124 SPLIT, 51 SOLO) was registered to its clip's reference split crop on the static room background (SIFT and masked ECC); run starts and ends were registered to their middles (336 pairs); the seam was profiled at native resolution (248 run-sides); the frame-repeat cadence of the 25p footage was used to find hidden cuts; and SOLO sharpness was compared with enlarged split crops (331 face-crop pairs). Labels in this note: SPLIT, SOLO (presenter alone at full height: PRESENTER and CLOSE in [layout.md](layout.md)) and NONE (presenter off screen). There are exactly two framings per video, both fixed crops of the same footage, and all changes are hard cuts.

Not done: No audio analysis; nothing was listened to. No playback was watched; motion judgements come from every-frame measurements and still strips. The older reels were not measured. The caption plate was probed on 2 frames only (owned by the type study). Which words get a SOLO punch-in was not coded. No colour or grade comparison between SPLIT and SOLO footage. Face metrics use Apple Vision landmarks (illustration faces were excluded by a seam rule and background registration); the matte head top is low resolution (3.75 px rows); yaw is only available in 45-degree buckets.

Evidence is cited as `clipNN@frame` (frames at 29.97 fps, counted from 0; ids are this style's own). File names in Evidence lines name files of the local study; they are not shipped. "Verified" lines give the independent verifier's verdict and final value; item numbers refer to [verification.md](verification.md).

## Rules

### [P01] Put every frame in one of three presenter states and keep the runtime shares near 37 % SPLIT (presenter in the lower box under the panel), 13 % SOLO (presenter alone at full height) and 50 % NONE (presenter off screen, full-frame insert).

- Values: Pooled over 20,881 frames: SPLIT 36.75 %, SOLO 13.11 %, NONE 50.14 %. Per clip (n=19): SPLIT median 35.8 % (28.5-43.8), SOLO 12.5 % (8.2-18.6), NONE 51.0 % (40.4-56.5). No fourth state (picture-in-picture, presenter on top, presenter in a card) occurs.
- Evidence: n=19 clips, every frame classified from Vision face landmarks + seam edge + background registration (identity check). P_layout_share_per_clip.csv, P_layout_timeline.png, P_layout_runs.csv; e.g. clip02@0-64 SPLIT, clip02@343-362 SOLO, clip02@363-417 NONE.
- Confidence: high
- Verified, consistent (item 7): in the verifier's one table SPLIT is 36.5 %, FULL 50.4 %, mid-video presenter 4.4 % and the closing 8.6 %; this note's SOLO is the last two together.

### [P02] Draw the SPLIT presenter box as a full-bleed rectangle x 0-1080, y 960-1920 (one row higher, y 957, for the Oct 29-31 generation), radius 0, touching the left, right and bottom frame edges, with the panel directly above.

- Values: Sub-pixel seam (50 % luma crossing at native resolution, side strips x 0-199 / 880-1079): clips 04-19 median y 959.66 (958.93-959.94, n=186 run-sides); clips 01-03 median 956.73 (955.51-956.86, n=39). Every SPLIT frame: strongest full-width edge at row 959/960 (clips 04-19) or 956/957 (clips 01-03), e.g. clip13 332 of 333 frames, clip01 451 of 452. Seam already at its row on the first frame of 124 of 124 SPLIT runs.
- Evidence: n=19 clips, 7,673 SPLIT frames, 248 native-resolution profiles. P_seam_rows.csv, P_seam_crop_10x.png (clip02@121, clip12@25, clip05@203), numbers.json split_box.
- Confidence: high
- Verified, confirmed (item 6): panel bottom edge median 959.60 in clip04-19 and 956.68 in clip01-03; this note's 50 % crossing and the layout note's coverage edge differ by under 0.2 px. Build value: 960.

### [P03] Give the seam no stroke, shadow, glow or feather: the panel ends and the footage starts across a single mixed pixel row.

- Values: Luma steps from panel to footage within one mixed row (row 956 in clips 01-03, row 959 in clips 04-19; e.g. clip01@25 left strip rows 955/956/957 = 234.6 / 169.1 / 38.4). Band means next to the seam vs 30 px further away: panel rows 945-957 minus 900-930 median -0.2 levels (p10 -15.8, p90 8.2); presenter rows 961-978 minus 990-1020 median +2.2 (p10 -8.1, p90 11.2), i.e. content variation, no darkening band. Chroma bleeds about 2 rows (4:2:0 subsampling), not a design element.
- Evidence: n=248 run-sides over 19 clips. P_seam_rows.csv, P_seam_crop_10x.png.
- Confidence: high

### [P04] Crop the footage once for SPLIT and keep that crop for the whole video: no punch-in between SPLIT runs, no slow push-in, no reposition inside a run.

- Values: Every SPLIT run registered to the clip's reference SPLIT run (background SIFT + masked ECC): zoom 1.0002 (0.9975-1.0029), SIFT residual median 0.49 px (p90 0.83, max 1.05; 103 runs with SIFT matches), n=124 of 124 runs registered. Inside runs (frame first+2 and last-2 against the middle frame): scale 0.9997 (0.9961-1.0033), shift median 1.0 px, p90 3.2 px, max 7.9 px (registration noise level), n=336 pairs over 175 runs.
- Evidence: n=19 clips. P_registration_runs.csv, P_within_run_drift.csv, P_crop_windows_by_setup.jpg.
- Confidence: high

### [P05] Size the speaker in SPLIT so the interocular distance is about 137 px (Vision face box about 347 px, a third of the frame width).

- Values: Interocular (eye-centroid distance) median 136.7 px, p10 129.0, p90 145.8; Vision face box width 347 (p10 323, p90 372); jaw-contour width 305 (290-324). Per-clip medians: interocular 131-146, face box 329-369. Set-up medians: A 145, B 139, C 133, D 141 interocular.
- Evidence: n=7,673 SPLIT frames with a presenter face, 19 clips. P_face_metrics_per_clip.csv, P_face_geometry_split.jpg (clip12@455).
- Confidence: high
- Verified, confirmed (item 8; own Vision probe on 769 split frames): eye distance 136.5 between eye centroids (142.5 between pupils), face box 344.1. Build: use this note's values.

### [P06] Place the eye line in SPLIT at y 1277 (317 px below the seam, a third of the way into the box); brow at about 1222, chin at about 1535, top of head (cap or hair) at about 1009.

- Values: Eye line median 1277 (p10 1230, p90 1330, min 974, max 1613); brow 1222 (1172-1278); chin 1535 (1481-1599); head top from the person matte 1009 (986-1028, n=6,850, 3.75 px matte rows). Per-clip eye-line medians 1224-1327, driven by set-up (A 1315, B 1287, C 1268, C2 1276, D 1224).
- Evidence: n=7,673 frames, 19 clips. P_face_geometry_split.jpg, P_face_metrics_per_clip.csv.
- Confidence: high
- Verified, confirmed (item 8): eye line 1274.3 (p10 1228.8, p90 1326.1), chin 1534.5.

### [P07] Centre the face horizontally at x 528 (12 px left of frame centre) in SPLIT; the desk microphone on its boom arm comes in from the right and fills the lower right quarter of the box.

- Values: Face-box centre x median 528 (p10 477, p90 579; per-clip medians 506-546); eye midpoint x 524 (470-576). Microphone position by eye in all 19 clips (right side, x about 750-1080, lower half of the box).
- Evidence: n=7,673 frames. P_face_geometry_split.jpg, P_presenter_runs_sheet.jpg (mic by eye).
- Confidence: high
- Verified, confirmed (item 8): face centre x 529.5.

### [P08] Leave about 49 px between the seam and the top of the head in SPLIT; the seam may graze the cap in about 1 % of frames but never crosses the face.

- Values: Head top minus seam median 48.8 px (p10 26.3, p90 67.5, min -56); head top at or above y 965 (clipped by the seam) in 1.1 % of SPLIT frames, at or above 975 in 4.5 %; brow above the seam in 7 of 7,673 frames (0.09 %); chin below 1920 in 0 frames. Probe (2 frames, low confidence on its own): the dark caption plate on the seam reaches down to about y 1007 (clip01@10, clip01@480), so the 49 px headroom sits under the caption plate.
- Evidence: n=6,850 frames with a matte head top, 19 clips. numbers.json face.split_head_top_rel_seam, P_face_geometry_split.jpg; clip01@10 shows a grazed cap.
- Confidence: high
- Verified, confirmed (item 8): head top minus seam 47.5 px (p10 21, p90 70).

### [P09] Make SOLO a second fixed crop of the same footage, 1.92 times the SPLIT scale, used identically for every SOLO run of the video.

- Values: SOLO zoom relative to the SPLIT crop: median 1.918 (p10 1.890, p90 1.925, range 1.887-1.930), n=47 runs with ECC correlation >= 0.99 (4 more register with shear, cc 0.963-0.984). Spread inside a clip <= 0.012 (e.g. clip06 1.922/1.927/1.922). Per set-up: A (clips 01-03) 1.889; B (04-07) 1.919; C (08-13, 15-18) 1.918; clip14 1.925; clip19 1.923.
- Evidence: n=51 presenter SOLO runs, 19 clips. P_registration_runs.csv, P_crop_windows_by_setup.jpg.
- Confidence: high
- Verified, confirmed (item 8): zoom 1.915 by eye-distance ratio and by room registration (per clip 1.82-1.96, noisy).

### [P10] Take the SOLO window from the split source area 563 x 1001 split-px, top at y 918 (42 px above the seam), bottom on the split box bottom, horizontally on the speaker (window centre about 16 px left of the median split face centre).

- Values: Window in split px: left 243 (206-258), top 918.6 (913.0-928.1), right 804 (777-831), bottom 1923.8 (1916.5-1939.9), n=47. Window centre x minus median split face-centre x per set-up: A -16, B -16, C -6, clip14 -19, clip19 +3. Centre y 1417-1430. In SOLO frames the face centre then measures x 542 (p10 472, p90 614), i.e. the face is centred in the SOLO.
- Evidence: n=47 runs, 19 clips, 5 set-ups. P_registration_runs.csv, P_crop_windows_by_setup.jpg, numbers.json registration.setups.
- Confidence: high
- Verified, confirmed (item 8): window in split px left 241, top 922, right 800, bottom 1937.

### [P11] In SOLO the face is about 652 px wide (interocular 260) with the eye line at y 691 (36 % of the height), head top at about 158 and chin at about 1178, centred at x 542.

- Values: Interocular median 259.6 (p10 245.8, p90 275.0); face box 652 (612-695); jaw 579 (551-615); eye line 691 (p10 616, p90 779); brow 586; chin 1178 (1096-1260); head top 158 (101-195); face centre x 542 (472-614). Head top clipped by the frame top in 0.07 % of frames. Per-clip eye-line medians 622-807 (set-up A highest at 782).
- Evidence: n=2,726 SOLO frames, 19 clips. P_face_geometry_solo.jpg (clip12@1020), P_face_metrics_per_clip.csv.
- Confidence: high
- Verified, confirmed (item 8; 528 full-height frames): eye distance 259.2, eye line 687.1, face box 649.2, centre x 541.9, head top 155.7, chin 1177.3. Build: use this note's values.

### [P12] End every video on SOLO, using exactly the video's SOLO crop (no tighter "close-up"), held for about 92 frames at 29.97 fps (3.07 s).

- Values: Closing run is SOLO in 19 of 19 clips. Its zoom minus the mean of the clip's other SOLO runs: median -0.0005 (-0.0052 to +0.0107), n=18 clips that have another SOLO. Length median 92 frames (p10 76, p90 122, range 66-138) = 3.07 s (2.20-4.60 s). Entered from NONE in 11 clips, straight from SPLIT in 8. Closing face: interocular 261 (247-279), eye line 692 (622-823).
- Evidence: n=19 clips. P_closing_opening.csv, P_closing_first_last_frames.jpg; e.g. clip01@1114-1196, clip12@969-1068.
- Confidence: high

### [P13] Open on SPLIT at frame 0 and hold the first SPLIT run for about 53 frames (1.77 s) before the first change.

- Values: Frame 0 is SPLIT in 19 of 19 clips. First run length median 53 frames (p10 40, p90 74, range 38-80) = 1.77 s (1.27-2.67 s).
- Evidence: n=19 clips. P_closing_opening.csv, P_layout_timeline.png.
- Confidence: high

### [P14] Use short SOLO punch-ins mid-video: one to three per video (usually two), about 28 frames (0.95 s) each.

- Values: 32 mid-video SOLO runs in 18 of 19 clips (clip15 has only the closing SOLO); mid-video SOLO runs per clip: 0 in 1 clip, 1 in 7, 2 in 8, 3 in 3; SOLO runs per clip including the closing 1-4 (median 3). Mid-video SOLO length median 28.5 frames (p10 18, p90 40, range 12-51) = 0.95 s (0.40-1.70 s). Entered from SPLIT 13, from NONE 19; left to NONE 18, to SPLIT 14. First SOLO starts at median 33 % of the clip (earliest 10 %).
- Evidence: n=32 runs. P_layout_runs.csv, P_layout_timeline.png.
- Confidence: high

### [P15] Show the presenter in SPLIT runs of about 60 frames (2 s), 7 to 11 presenter appearances per video.

- Values: SPLIT runs: n=124, median 59.5 frames (p10 33, p90 92, range 16-147) = 1.99 s (0.53-4.90 s). Presenter runs (SPLIT + SOLO) per clip median 9 (7-11).
- Evidence: n=19 clips. P_layout_runs.csv.
- Confidence: high

### [P16] Take the presenter fully off screen for each full-frame insert: about 6 times per video, about 84 frames (2.8 s) each, never longer than about 8 s.

- Values: NONE runs n=121, 4-9 per clip (median 6), length median 84 frames (p10 41, p90 139, range 21-237) = 2.80 s (0.70-7.91 s); longest per clip median 138 frames (98-237). Faces inside inserts are never the presenter: every candidate (clip16@424-479 film footage, clip16@902-913, clip09@64-66, clip18@44-48) fails background registration to the room.
- Evidence: n=19 clips. P_offscreen_runs.csv, P_presenter_runs_sheet.jpg.
- Confidence: high

### [P17] Change between SPLIT, SOLO and NONE by hard cut: the presenter box and crop are complete on the first frame; never slide, wipe, scale or animate the presenter into place.

- Values: Seam at its generation row on the first frame of 124/124 SPLIT runs; face-width change over the first 3 frames of a presenter run median 2.0 % (p90 5.1 %), the same as ordinary head motion; whole-frame difference on the first frame of a presenter run median 90 grey levels (p10 59, n=156), i.e. a cut; no transitional frames between runs after merging glitches of <= 2 frames (12 frames in the corpus re-labelled).
- Evidence: n=19 clips, every frame. P_layout_timeline.png, P_within_run_drift.csv
- Confidence: high

### [P18] Cut the talking-head take under every full-frame insert: the presenter that comes back after an insert is a different moment, not continuous footage.

- Values: The footage repeats one frame in six (P21); the repeated frames keep one phase (frame mod 6) while a take runs uncut. Across 121 inserts the phase changes 104 times (86 %); a random cut keeps the phase 1 time in 6, so if every insert hides a cut about 101 changes are expected. Audio continuity was not checked.
- Evidence: n=121 insert gaps, 19 clips. P_cadence_pairs.csv
- Confidence: medium: inferred from cadence phase; no listening

### [P19] Use a direct SPLIT<->SOLO reframe (no insert between) as the cover for a jump cut in the take about half the time; otherwise it is a punch-in on continuous footage.

- Values: 35 direct reframes (21 SPLIT->SOLO, 14 SOLO->SPLIT) in 17 clips (none in clips 05 and 09). Jump cut (phase change and face-region difference >= 2x ordinary frame-to-frame difference after warping both frames into the split frame): 18. Continuous (same phase, face difference 0.33-1.06x): 5 (clip08@253, clip11@758, clip13@826, clip18@378, clip18@922). Mixed evidence: 12 (5 phase change with similar pose, 7 same phase with a pose change).
- Evidence: n=35. P_direct_reframes.csv, P_reframe_cuts_<clip>.jpg (before | after | difference, warped).
- Confidence: medium: two indirect signals disagree on 12 of 35

### [P20] Do not jump-cut inside a visible presenter run: hide cuts under inserts or reframes instead.

- Values: One confirmed same-framing jump cut in 175 presenter runs (10,415 frames): clip08@971 inside the closing SOLO (head drops 158 px in one frame, frame difference 32.9 vs about 6 around it, cadence phase change at 969-977). Four possible micro-cuts with a phase change but no visible jump: clip04@18-23, clip09@153-158, clip10@205-210, clip17@27-32 (difference spike at 28). All other difference spikes are fast hand or head motion with unchanged phase.
- Evidence: n=175 runs. P_inrun_cut_candidates.csv, numbers.json cadence.inrun_breaks.
- Confidence: medium: the 4 possible cases need a human look

### [P21] Expect 25p camera footage: the reference presenter footage is 24.975 fps placed on the 29.97 timeline by repeating one frame in six.

- Values: Gaps between detected repeated frames inside presenter runs: 647 of 651 gaps under 9 frames are exactly 6; 3 are 5, 1 is 8, none is 7 (79 gaps of 12 and 8 of 18 are missed detections). Exactly 5 source frames per 6 output frames = 24.975 fps. A builder should not copy the repeat pattern; it shows the camera ran at 25p.
- Evidence: n=651 gaps over 175 runs, every frame. P_repeat_frames_per_run.csv, P_cadence_pairs.csv, numbers.json cadence.
- Confidence: high

### [P22] Require source footage that covers the split window plus about 47 split-px above it and about 20 below, with roughly 1080 px of detail across the split window; the SOLO is then a 1.92x enlargement, which is part of the look.

- Values: Union of SPLIT and SOLO windows in split px: x 0-1080, y 913-1940 (1080 x 1027). Face crops (0.8 x face width) of SOLO frames vs SPLIT frames of the same clip enlarged to the same size (Lanczos): power in 0.15-0.25 cycles/px median 1.29x the enlarged split (p10 0.75, p90 2.23); above 0.30 cycles/px the SOLO spectrum flattens to about the noise floor of the split's own spectrum, and per own pixel the SOLO holds about half the split's high-band detail (0.30-0.45 vs 0.03-0.08 cycles/px power ratio: SOLO 7.9e-5, split 1.4e-4, medians), i.e. little detail beyond an enlargement. Largest enlargement seen 1.935x. Consistent with a 1080p-class source cropped about 1:1 for SPLIT.
- Evidence: n=331 SOLO/SPLIT face-crop pairs, 19 clips. P_spectra_solo_vs_split.png, P_spectral_pairs.csv, P_crop_windows_by_setup.jpg.
- Confidence: medium: VP9 at 1.2-2.4 Mbps limits detail in both layouts; camera resolution not observable directly

### [P23] Keep the presenter on the real room background (never key or replace it), with a locked-off camera and the desk microphone in front.

- Values: Reference frames of clips in one set-up register to each other at scale 0.998-1.003 and shift <= 4.5 px (53 pairs), across clips published on different days; room light colour (median hue of background pixels in the split box) follows the set-up: 54-76 deg (green-teal) in clips 01-03, 240-246 deg (violet-blue) in 04-07, 238-240 in 08-18, 204 (pale blue-grey) in clip19. Hair and cap edges against the room show depth-of-field blur with no halo or matte line at 4-10x (by eye). The person matte is used only for measuring, never visible in the edit.
- Evidence: n=19 clips, 171 pairs tested. numbers.json sessions, P_sessions_reference_frames.jpg, P_hair_edge_room_enlarged.png.
- Confidence: medium: absence of a key is judged by eye

### [P24] Treat crop values as per-set-up: the editor refits the SPLIT and SOLO crops whenever the camera set-up changes; the layout rules stay the same.

- Values: Set-up A (clip01-03, Oct 29-31): seam 957, SOLO 1.889 window left/top 207/914, split eye line 1315, interocular 145. B (clip04-07, Nov 2-3): seam 960, SOLO 1.919 at 233/927, eye 1287, interocular 139. C (clip08-13, 15-18, Nov 4-9): SOLO 1.918 at 244/918, eye 1268, interocular 133. clip14 (Nov 7, image scale about 5 % larger than C, weak match of 8-14 inliers): SOLO 1.925 at 232/927. D (clip19, Nov 12): SOLO 1.923 at 258/918, eye 1224, interocular 141. Wardrobe (shirt, cap or no cap) changes with set-up (by eye).
- Evidence: n=19 clips, 5 set-ups. numbers.json registration.setups and sessions, P_sessions_reference_frames.jpg, P_crop_windows_by_setup.jpg.
- Confidence: high

### [P25] The presenter faces the camera: use frontal footage; turned or profile shots are not part of the style.

- Values: Vision yaw bucket 0 (frontal, |yaw| under about 22 deg) in 7,545 of 7,673 SPLIT frames (98.3 %) and 2,670 of 2,726 SOLO frames (97.9 %); the rest are +-45 deg buckets during gestures. Vision reports yaw and roll only in coarse buckets on this OS.
- Evidence: n=10,399 frames, 19 clips. P_yaw_buckets.csv, numbers.json face.yaw_buckets_vision.
- Confidence: high

### [P26] Fit a new speaker with two numbers: scale the source so the interocular distance is 137 px in SPLIT and 260 px in SOLO (1.918x), put the eye midpoint at (528, 1277) in SPLIT, then clamp so the head top lands 26-68 px below the seam.

- Values: Derived from P05, P06, P08, P09, P10, P11: SOLO eye line = (1277 - 918) x 1.918 = 689 (measured 691); SOLO interocular = 137 x 1.918 = 263 (measured 260); centre the SOLO window on the face (measured SOLO face centre 542). Limits: the source must reach about 47 split-px above the split window and about 20 below; SOLO enlargement up to 1.935x is within the reference.
- Evidence: Derivation from the measured rules; checked against n=7,673 SPLIT and 2,726 SOLO frames. P_face_metrics_per_clip.csv, P_crop_windows_by_setup.jpg, numbers.json build_spec.fit_new_speaker.
- Confidence: medium: derived, not observed with a second speaker

### [P27] Never: round or frame the presenter window, show the presenter as picture-in-picture or over a full-frame insert, cut the presenter out over the panel, put the presenter in the upper half, mirror the footage, animate a zoom, or use a third crop scale.

- Values: Across 20,881 frames: presenter states are only SPLIT box and SOLO full frame; 124 SPLIT + 51 SOLO runs show exactly two crop scales per clip (1.000 and 1.887-1.930); no presenter face registers inside any insert; seam always horizontal, full width, at one row per generation; within-run scale change <= 0.4 %.
- Evidence: n=19 clips, every frame. P_layout_timeline.png, P_registration_runs.csv, P_within_run_drift.csv.
- Confidence: high

## Constant and variable

CONSTANT (all 19 clips): three states only (SPLIT, SOLO, NONE); SPLIT box full bleed, radius 0, no stroke/shadow/feather, hard 1-row seam; the SPLIT crop is fixed for the whole video (zoom 1.000 +- 0.003); exactly one SOLO crop per video at 1.89-1.93x of the split; the closing shot uses the SOLO crop; frame 0 is SPLIT; the last run is SOLO; layout changes are cuts; no in-run zoom or pan; real room background; frontal presenter; 25p source footage. VARIABLE: seam row 957 (clips 01-03, Oct 29-31) vs 960 (clips 04-19, from Nov 2); SOLO zoom and window per camera set-up (1.889 at 207/914 in A; 1.918-1.925 at 232-258/914-928 later); eye line in SPLIT 1224-1327 per clip and interocular 131-146 per clip (set-up and posture); per-clip shares SPLIT 28-44 %, SOLO 8-19 %, NONE 40-57 %; number of presenter runs 7-11, off-screen runs 4-9, SOLO runs 1-4; closing length 66-138 frames; room light colour per set-up (green-teal, violet-blue, pale blue-grey) and wardrobe.

## Open questions

- Whether the camera recorded 1080p or 4K: the SOLO shows little detail beyond an enlarged split (P22), but VP9 at 1.2-2.4 Mbps hides fine detail in both layouts; a camera original would decide it.
- The 12 direct reframes with mixed evidence (P19): does the take run on or jump? Listening for an audio splice at those frames, or the project file, would decide.
- The 4 cadence-only in-run breaks (clip04@18-23, clip09@153-158, clip10@205-210, clip17@27-32): micro-cuts of a few frames or cadence-detection artefacts? Frame-by-frame viewing with audio would decide.
- Which words or sentence types trigger a mid-video SOLO punch-in was not coded here (structure/explanation analysts); the presenter data only fixes its length and position.
- Head top comes from a 384x512 matte (3.75 px rows) and can merge with the cap brim or a hand; a full-resolution matte on sampled frames would tighten P06/P08 by a few px.
- Whether the presenter footage got any colour grade that differs between SPLIT and SOLO was not measured (colour analyst).

Needs an eye or an ear:

- Look at P_reframe_cuts_clip04.jpg, _clip06.jpg, _clip07.jpg, _clip11.jpg, _clip13.jpg (before | after | difference) and listen at those frames: jump cut or continuous punch-in?
- Watch clip04@15-26, clip09@150-160, clip10@202-212, clip17@24-33 at full frame rate with sound: hidden micro jump cuts or not (P20).
- Watch clip08@965-975: confirm the in-closing jump cut at frame 971 (head drops, eyes close) and whether audio is spliced there.
- Open P_hair_edge_room_enlarged.png and P_sessions_reference_frames.jpg: confirm the room is never keyed or replaced (P23 is by eye).
- Open P_spectra_solo_vs_split.png next to a SOLO frame (e.g. clip12@1020) and judge whether the 1.92x enlargement looks acceptably soft for the target quality (P22).
- The microphone placement in P07 is by eye from P_presenter_runs_sheet.jpg.
- Nothing was listened to: audio continuity across inserts (P18) is inferred from the video cadence only.
