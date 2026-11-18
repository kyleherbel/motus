# Structure

Measured on the 30 in-style clips of the reference corpus (neutral ids clip01 to clip30, by publication date, 2026-03 to 2026-11). Evidence ids are `clipNN@frame` at the clip's own rate (23.976 or 24 fps); evidence files stay in the private study folder and are not part of this repository. Confidence is the analyst's.

## Summary

Measured on all 30 in-style clips (2,197.6 s, 52,701 frames). Every frame was decoded at its native rate (calibrated BT.709 limited-to-full) and hard cuts were detected with my own region-aware detector: top panel y 0-880 and bottom panel y 1040-1920 separately, with the caption band excluded. It found 1,207 cuts and 1,237 shots. A by-eye check of a 48-cut sample confirmed 46. The estimated recall is 0.94, and the misses are low-contrast changes between similar screen captures. PySceneDetect missed 149 of these cuts, nearly all of them confined to the top panel. I read every shot's layout by eye from mid-frame review sheets (13 shots at full resolution) and used six labels: S (footage over presenter), P (presenter full frame), F (footage full frame), D (two footage panels), C (footage with a presenter inset) and I (presenter over footage). Speech alignment uses the faster-whisper word timings of all 30 clips (602 sentences, not forced-aligned) plus a voice-band energy envelope. I coded narrative beats by hand per sentence.

The format runs on two clocks. The layout clock alternates mainly between S and P: S takes 60% of runtime, P 17%, F 17%, and 57% of all layout changes are S<->P. The layout changes 16 times a minute and lands on sentence onsets: 55% of sentence onsets get a layout change within 6 frames, against 14% by chance, with a median offset of -0.3 frames. The footage clock runs about 1.75x faster, at 28 footage changes a minute with a median hold of 33 frames. Half of the footage changes are top-panel-only cuts while the presenter continues, and they fall on word onsets mid-clause rather than on sentence starts. The overall result is 32 hard cuts a minute (p10-p90 23-46) and a median shot of 32 frames. Cuts are front-loaded, from 49/min in the first tenth of the runtime to 22/min in the last. P is a short insert (median 32 frames, 5.5 per minute) that short punchy sentences fall into: 66% of 1-2-word sentences start in P. Full-frame footage concentrates in demo and how-to beats (35% of HOW).

The edit is tight. Inter-word gaps have a p99 of 7 frames, and only 10 of 8,059 gaps exceed 12 frames. The two longest silences (28-33 frames) happen under full-frame demo footage. Speech starts at frame 0 in every clip. I found 67 visible presenter jump cuts (a lower bound) in 18 clips, and half of them sit on a top-panel cut. Beats run HOOK (4.9 s median, 30/30 clips) > NAME/WHAT > SHOW/HOW/LIST > WHY > CTA (27/30 clips end on one, median 5.1 s). The later clips (2026-06 onward) cut faster (35.6 vs 29.3/min) and use more full-frame footage (F share median 0.27 vs 0.07). Not done: no listening or playback; transitions not examined frame by frame (motion analyst); seam geometry left to the layout analyst; beats coded by one person; jump cuts hidden under layout changes cannot be seen.

## Rules

### S01. Cut hard about every 1.3 s: aim for 32 hard cuts per minute, keeping each clip within 23-46 per minute.

- Values: Per-clip cuts/min median 32.0, p10 23.0, p90 45.6, range 18.1-60.1 (n=30 clips, 1,207 cuts, 2,197.6 s). Shots per clip median 39 (range 18-68). Detector precision 46/48 (by eye), estimated recall 0.94 (6 real misses in 48 sampled of 558 sub-threshold candidates).
- Evidence: n=30. evidence/per_clip_summary.csv, cuts_json/cuts_clipNN.json, cut_validation/prec.jpg + precision_sample_verdicts.csv, cut_validation/rec.jpg + recall_sample_verdicts.csv, cut_validation/vs_pyscenedetect.json; e.g. clip30@21, clip30@355 (top-only cuts PySceneDetect also caught), clip01@55 (a miss).
- Confidence: high

### S02. Use shots of 16-58 frames (median 32), allow very short shots for montage, and never hold one shot longer than about 270 frames.

- Values: Shot length median 32 frames (1.33 s), p10 5, p25 16, p75 58, p90 91, max 268 (11.2 s), n=1,237. 19% of shots are under 12 frames and 11% under 6 frames. By layout: S median 33, P 32, F 34, D 23, C 28 frames.
- Evidence: n=30 clips. evidence/shot_length_histogram.png, shots_all.csv; longest shot in shots_all.csv (268 frames).
- Confidence: high

### S03. Use the split (footage over presenter) as the base layout for about 60% of runtime. Cut to presenter full frame and footage full frame for about 17% each, and keep footage-over-footage and presenter-inset as optional extras (3% each).

- Values: Runtime share: S 0.602, P 0.171, F 0.168, C 0.029, D 0.029, I 0.002. Clips using each layout: S 30, P 27, F 27, D 10, C 6, I 1. Per-clip S share median 0.60 (p10 0.43, p90 0.81, range 0.19-0.87); P median 0.15 (0-0.38); F median 0.17 (0-0.46).
- Evidence: n=30 clips, 1,237 shots labelled by eye. evidence/layout_examples.jpg, review_sheets/lab_clipNN.jpg (labels in scripts/labels_by_eye.py), layout_runs_all.csv, timelines_all_clips.png.
- Confidence: high

### S04. Change the full-frame layout about 16 times a minute. Hold S runs about 96 frames (48-226), P runs 32 (16-100) and F runs 69 (26-170).

- Values: Layout changes/min per clip median 15.95, p10 8.6, p90 19.7, range 4.9-22.1. Runs per clip median 18 (6-36). Run length in frames: S median 96 (p10 48, p90 226, max 778, n=251); P 32 (16, 100, max 231, n=197); F 69 (26, 170, max 414, n=97); D 88 (n=17); C 83 (n=14); I 52 (n=2).
- Evidence: n=30. evidence/layout_runs_all.csv, structure_video.json aggregate.run_len_frames_by_layout, timelines_all_clips.png.
- Confidence: high

### S05. Alternate S and P: treat P as a short insert that almost always returns to S, and enter and leave F mostly from S.

- Values: Run transitions (n=548): P>S 157, S>P 154 (57% together), S>F 68, F>S 57, F>P 31, P>F 20, S>D 9, D>S 6, every other pair 5 or fewer. 157 of 197 P runs return to S.
- Evidence: n=30. evidence/structure_video.json aggregate.run_transitions; timelines_all_clips.png (orange-green alternation, e.g. clip04, clip21, clip23).
- Confidence: high

### S06. Insert the presenter full frame about 5.5 times a minute for about 32 frames each time, especially on 1-2-word sentences and asides.

- Values: P inserts/min per clip median 5.48, p10 1.17, p90 8.22, max 9.93. 3 clips have no P (clip03, clip25, clip30). P run median 32 frames, min 5, p90 100. Layout at sentence onset by sentence length: 1-2 words P 23/35 (66%); 3-5 words 29/79 (37%); 6-12 words 53/221 (24%); 13+ words 52/267 (19%).
- Evidence: n=30 (sentence table n=602). evidence/speech_alignment.json layout_at_sentence_onset_by_sentence_words, sentences_layout.csv; clip21@127-184 (S>P on sentence onset at 128, back to S at 184), clip04@833.
- Confidence: medium (sentence boundaries come from ASR punctuation)

### S07. Change the footage about 28 times a minute (median hold 33 frames). About half of the changes should be top-panel-only cuts while the presenter continues, and about a third should come with a layout change.

- Values: Footage changes/min per clip median 27.8, p10 19.0, p90 45.1, range 15.2-57.9. Footage hold (footage-visible frames between changes) median 33, p10 4, p25 14, p75 59, p90 90 (n=1,037). Kinds after the opening (n=1,010): top-only cut with presenter continuing 481 (48%), with a layout change 354 (35%), cut inside F/D/C runs 156 (15%), top and bottom together 19 (2%). Hard cuts: 660 within a layout, 547 at a layout change.
- Evidence: n=30. evidence/structure_video.json aggregate.footage_change_kinds, footage_hold_frames; clip30@355 (top-only cut, presenter continues), clip02@714-787.
- Confidence: high (includes changes inside screen recordings that may be source navigation, see open questions)

### S08. Inside one S run, give the top panel two footages as the norm (one top-only cut), and up to seven in busy passages.

- Values: Shots per S run median 2, p10 1, p90 7 (n=251 runs). 90 runs hold one footage, 63 hold two, 32 three, 18 four, 16 five.
- Evidence: n=30. evidence/montage_bursts_and_cut_density.json shots_per_S_run; review_sheets/lab_clip02.jpg (shots 24-30 are one S run of 7).
- Confidence: high

### S09. Use top-panel montage bursts of 3 or more shots, each under 12 frames, while the presenter panel stays continuous. Put them mostly at the opening and on lists of examples.

- Values: 28 bursts in 18/30 clips. 20/28 are pure S (only the top changes) and 11/28 start in the first 10% of runtime. Burst length 3-14 shots and 7-54 frames in total, e.g. 14 shots in 54 frames at clip21@208.
- Evidence: n=30. evidence/montage_bursts_and_cut_density.json; clip21@208-262, clip23@815-863, clip18@25-67, clip22@19-46, clip02@0-16; review_sheets/lab_clip21.jpg.
- Confidence: medium (seen in 18 clips; exact frame counts depend on cut recall in fast montage)

### S10. Front-load the cutting: about 48 cuts per minute in the first tenth of the video, easing to about 22 per minute in the last tenth.

- Values: Pooled cuts/min by runtime decile: 48.6, 42.3, 35.8, 31.1, 30.9, 29.8, 32.5, 27.0, 29.5, 22.1. First 5 s per clip median 36 cuts/min (p10 12, p90 98) against 31 after.
- Evidence: n=30. evidence/montage_bursts_and_cut_density.json cuts_per_min_by_runtime_decile, first5s_cuts_per_min.
- Confidence: high (pooled), per-clip spread is wide

### S11. Open in S with the voice already running at frame 0. Hold the first split for about 4 s and cut its top panel within about the first second.

- Values: First layout: S 26/30, P 3 (clip06, clip15, clip18), C 1 (clip11). First run median 96.5 frames (p10 55, p90 173); first shot median 27.5 frames (p10 4, p90 114). Voice-band energy reaches speech level at 0 ms in 20/30 clips and at most 130 ms in all 30; the ASR first word is at 0.0 s in 30/30.
- Evidence: n=30. evidence/open_close_frames.jpg, voice_onset_ms.json, per_clip_summary.csv (open_label, open_run_frames).
- Confidence: high

### S12. End on the sign-off in S or P, with a last layout run of about 3.4 s, and cut the picture about 6 frames after the last word.

- Values: Last run: S 14/30, P 13/30, F 3/30. Last run median 81.5 frames (p10 32, p90 302). Closing CTA beat median 5.13 s (p10 1.47, p90 8.88), in 27/30 clips, laid out S 60% / P 34%. Picture ends after the last word: median 6 frames (p10 2, p90 18, max 356 in clip25, where full-frame footage plays out).
- Evidence: n=30. evidence/open_close_frames.jpg, numbers.json tail_after_last_word_frames, beats.json summary.CTA; clip25@1086-1473.
- Confidence: high

### S13. Put layout changes on sentence onsets: about 55% of sentences should start with a layout change and about 70% with some cut. Clause starts inside a sentence get almost no extra layout changes.

- Values: Sentence onsets with a layout change within 6 frames: 328/602 = 54.5% (chance 13.8%). With any hard cut: 418/602 = 69.4% (chance 27.0%). With a footage change: 52.5% (chance 22.3%). Non-sentence clause onsets: layout 18.5% (chance 13.3%), any cut 33.4% (chance 26.9%), n=509. Of 548 layout changes in speech, 296 fall within 6 frames of a sentence onset, 59 of a clause onset, 181 mid-clause and 12 away from any onset.
- Evidence: n=30 clips, 602 sentences. evidence/speech_alignment.json sentence_starts_with_event_pm6f, event_word_position; timelines_all_clips.png (blue ticks are sentence onsets); clip04@132, @337, @833, clip15@99, @262.
- Confidence: high (effect far above chance; timings from ASR)

### S14. Make the layout change on the frame where the sentence's first word starts, or one frame before it.

- Values: Layout changes within 6 frames of a sentence onset (n=328): offset median -0.28 frames, p10 -1.91, p90 +1.46, 83% within 2 frames, 58% at or before. Histogram -2..+2 frames: 27, 89, 107, 49, 16. P entries (n=105): median -0.38 frames, 88% within 2 frames.
- Evidence: n=30. evidence/speech_alignment.json offset_to_sentence_onset_when_within_6f, offset_to_sentence_onset_hist_-6_6; offset_histograms.png.
- Confidence: medium (faster-whisper timings are not forced-aligned; +-2 frames is within ASR error)

### S15. Change footage on word onsets in the middle of clauses, at the word being said, not only at sentence starts.

- Values: Footage changes in speech (n=1,007): within 6 frames of a mid-clause word onset 602 (60%), a sentence onset 278 (28%), a clause onset 98 (10%), no onset 29 (3%). Offset to the nearest word onset within 2 frames: 63% for footage changes, 82% for P exits, 56% by chance.
- Evidence: n=30. evidence/speech_alignment.json event_word_position, offset_to_nearest_onset; offset_histograms.png.
- Confidence: medium (word locking only modestly above chance at ASR precision; which word triggers the change belongs to the graphics mapping)

### S16. Let presenter jump cuts show in the split's presenter panel about 1.8 times a minute, and put about half of them on the same frame as a top-panel footage cut.

- Values: 67 visible jump cuts (one-frame presenter pose discontinuity, 84 candidates, 17 rejected by eye) in 18/30 clips: per clip median 1.5, p90 5, max 9 (clip27); 1.83 per minute. 66/67 in S and 1 in P. 33/67 coincide with a top-panel hard cut. 73% fall within 2 frames of a word onset. This is a lower bound, because jumps under the 547 layout-change cuts cannot be seen.
- Evidence: n=30. evidence/jump_cuts/jump_candidates_all.jpg, verdicts_by_eye.csv, jump_clipNN.json; clip04@587, @1441, clip27@9, @173, clip09@110, clip13@889 (outfit change between takes).
- Confidence: medium (detector needs an isolated 3x spike; subtle jumps are missed)

### S17. Cut every pause to 7 frames or less while the presenter is visible. Only a full-frame footage demo may hold a silent gap, and only up to about 33 frames.

- Values: ASR inter-word gaps (n=8,059): median 0, p90 1.9, p99 7.2 frames; 10 gaps exceed 12 frames (6 of them on F, which is 17% of runtime). Longest gap with the presenter visible: 13.4 frames (clip20@1306, clip23@868). The only gaps over 16 frames, 32.6 and 28.3 frames, sit under full-frame generated-video demos (clip17@182, @237). Voice-band energy 20 dB below speech level lasts 0.11-0.74 s at most per clip.
- Evidence: n=30. evidence/pauses_by_layout.json, speech_alignment.json (asr_gap_frames, clips.*.asr_gaps_top5).
- Confidence: medium (ASR word ends are estimates; not listened to)

### S18. Expect dense delivery of about 224 words a minute, and plan about 4.4 cuts per 10 words.

- Values: Words/min median 224 (p10 210, p90 244, range 197-252), n=30. Cuts per word = 32.0/224 = 0.14.
- Evidence: n=30. numbers.json speech_words_per_min, per_clip.*.words_per_min.
- Confidence: medium (ASR word counts)

### S19. Order the beats HOOK > NAME/WHAT > SHOW/HOW/LIST > WHY > CTA, with SHOW and WHY taking the most time.

- Values: HOOK first in 30/30. Beat after the hook: NAME 14, WHAT 8, SHOW 3, HOW 3, LIST 1, WHY 1. Beats per clip median 5 (3-8). Runtime share: SHOW 26.0%, WHY 20.8%, WHAT 13.6%, HOW 11.8%, HOOK 8.0%, LIST 7.7%, CTA 6.0%, NAME 4.4%, CTA_MID 1.8%. Median start position: HOOK 0, NAME 0.05, WHAT 0.10, LIST 0.24, SHOW 0.29, HOW 0.41, CTA_MID 0.53, WHY 0.69, CTA 0.94. Closing CTA in 27/30 clips and a mid-video CTA in 5/30.
- Evidence: n=30. evidence/beats.json, beats_segments.csv, beats_orders.txt; codes in scripts/labels_beats.py.
- Confidence: medium (hand-coded by one analyst from ASR text)

### S20. Keep the hook to about 5 s (2-9 s) and cut it faster than the rest (about 45 cuts a minute). Name the product in the first sentence or in the sentence right after the hook.

- Values: Hook median 4.88 s (p10 2.25, p90 9.2, range 1.25-16.3), n=30. Hook layout share S 68%, P 15%, F 11%, C 5%; hook cuts 45.3/min and layout changes 15.0/min. Product or maker named in the first sentence in 14/30; NAME is the beat after the hook in 14/30.
- Evidence: n=30. evidence/beats.json (hook_len_s, summary.HOOK, name_in_first_sentence), sentences_layout.csv.
- Confidence: medium

### S21. Choose the layout by beat: full-frame footage for HOW and SHOW, presenter full frame for WHY and the CTA, and the split as the default everywhere.

- Values: F share by beat: HOW 34.8%, SHOW 24.5%, WHAT 13.3%, HOOK 11.3%, WHY 10.1%, NAME 7.0%, CTA 3.4%. P share: CTA 33.6%, WHY 26.7%, LIST 23.0%, NAME 18.0%, HOOK 15.2%, SHOW 12.2%, WHAT 11.7%, HOW 7.4%. S at least 52% in every beat. D and C appear mainly in SHOW (4.8% and 5.9%) and CTA_MID.
- Evidence: n=30. evidence/beats.json summary.*.layout_share, beats_segments.csv.
- Confidence: medium

### S22. Cut fastest in HOOK, NAME and LIST (about 41-45 a minute), at about 29-34 a minute in WHAT, HOW, SHOW and WHY, and slowest in the closing CTA (21 a minute).

- Values: Cuts/min by beat: HOOK 45.3, NAME 43.6, LIST 40.7, SHOW 34.2, WHY 30.7, WHAT 28.8, HOW 28.7, CTA_MID 24.9, CTA 21.0. Layout changes/min: NAME 20.6, LIST 17.3, SHOW 16.5, WHAT 15.1, HOOK 15.0, HOW 14.4, WHY 13.5, CTA 7.8.
- Evidence: n=30. evidence/beats.json summary.*.cuts_per_min.
- Confidence: medium

### S23. Make every layout change a one-frame hard cut, with no dissolves or fades between layouts.

- Values: 547/548 layout changes coincide with a detected hard cut. The one exception is a presenter circle appearing over full-frame footage with no cut (clip30@236). 57/1,207 cuts spread over two frames. The structure check (NCC >= 0.9) rejected brightness ramps such as clip01@567, @569 and clip30@945; no other gradual transition was detected.
- Evidence: n=30. evidence/cuts_json/cuts_clipNN.json (two_frame, rejected), review_sheets/lab_clip30.jpg.
- Confidence: medium (animated reflows or pushes were not examined frame by frame; motion analyst)

### S24. Keep the presenter on screen for about three quarters of the runtime (S, P, I or C) and never below about half.

- Values: Presenter-visible share per clip median 0.77, p10 0.58, p90 0.99, min 0.50 (clip30), 6 clips at 0.97 or more (clip04, clip10, clip14, clip21, clip23, clip27).
- Evidence: n=30. evidence/per_clip_summary.csv presenter_on_screen_share.
- Confidence: high

### S25. Target a total length of about 72 s (52-88 s) and let the cut count scale with it.

- Values: Duration median 72.5 s, p10 51.8, p90 88.0, range 45.1-154.9 (n=30). Shot count and duration correlate through a fairly stable cut rate (S01).
- Evidence: n=30. evidence/per_clip_summary.csv.
- Confidence: high

### S26. Follow the newer generation (2026-06 onward): about 36 cuts a minute and more full-frame footage, with no presenter-inset layout.

- Values: clip01-15 (2026-03-11 to 06-08) against clip16-30 (06-24 to 11-15): cuts/min median 29.3 vs 35.6; F share median 0.07 vs 0.27; S share 0.63 vs 0.56; P share 0.17 vs 0.13; layout changes/min 16.1 vs 15.9 (unchanged); duration 73.1 vs 72.0 s. Presenter inset (C) in clip03, 06, 08, 11 and 12 (all before 2026-05-12) and once later (clip30, 75 frames).
- Evidence: n=15 per side. evidence/structure_video.json aggregate.over_time, per_clip_summary.csv.
- Confidence: medium (15 clips per side; topic mix also changes)

## Constant and variable

CONSTANT (30/30 clips): S is the base layout and is present in every clip; voice is at frame 0; layouts change only by hard cuts (547/548); no pause longer than 13.4 frames while the presenter is visible; HOOK is the first beat; layout changes cluster on sentence onsets (every clip above its chance level). VARIABLE: cut rate 18-60/min (montage-heavy topics such as clip21 and clip29 against talk-heavy clip04 and clip10); P share 0-0.38 and F share 0-0.46 (F grows in later clips and in demo/how-to beats); D in 10 clips and C in 6 (mostly early); ending layout S or P (14/13); beat order varies in the middle (SHOW, HOW, LIST, WHY can repeat); length 45-155 s.

## Open questions

- Some top-panel cuts inside screen recordings may be page navigation inside one capture rather than an editor cut (precision sample: 1 false and 1 uncertain of 48). A per-source re-labelling of F and top-panel shots, or the editor's project file, would settle it.
- Jump cuts hidden under layout changes cannot be counted from the video. Raw presenter recordings, or audio-continuity analysis at every S<->P cut, would show how many layout changes hide a removed pause.
- Offsets of -0.3 frames are within ASR error. Forced alignment (e.g. a phoneme aligner) of the 30 transcripts would show whether layout cuts lead the word by exactly 1 frame.
- The beat coding is single-coder. A second coder on the same sentence tables (evidence/sentences_layout.csv) would give agreement.
- Whether P inserts are punch-ins of the same camera or a second angle (and how S geometry varies, seam ~960 or ~1200) belongs to the presenter and layout analysts.
- Cut recall in very fast montage (shots of 1-3 frames, clip21, clip23) is not separately validated.

## For a person to check

- Listen: pauses at clip17@182-260 (silent demo gaps of 28-33 frames), clip20@1306 and clip23@868 (longest gaps with the presenter visible); confirm nothing longer survives (evidence/pauses_by_layout.json).
- Watch at real speed whether layout cuts land on the first syllable of a sentence: clip04@132, @337, @833, clip21@127, @184, clip15@99, @262 (evidence/timelines_all_clips.png).
- Watch the jump cuts and the 17 rejected candidates: evidence/jump_cuts/jump_candidates_all.jpg and verdicts_by_eye.csv (clip04@587, clip27@9, clip13@889).
- Watch montage bursts for missed or extra cuts: clip21@208-262, clip23@815-863, clip18@25-67.
- Check the by-eye layout labels where S, F and C are hard to tell apart at thumbnail size: review_sheets/lab_clip12.jpg (shots 30-32), lab_clip03.jpg (6-8), lab_clip11.jpg, and uncertain_shots_fullres.jpg (stacked footage over presenter counted as S).
- Check that the 57 two-frame cuts (cuts_json two_frame flag) are plain cuts and not one-frame transitions.
