# Structure

Measured: All 19 clips (20,881 frames, 696.7 s, frames at 29.97 fps counted from 0). Every frame was decoded (VP9, BT.709 limited to full) and given a layout label from Apple Vision face rectangles plus a per-region hard-cut detector (mean |d luma| per 48-px band; a cut is >= 20 levels and >= 3.5x the median of the 5 previous frames). OCR on every second frame gave the caption track; every-frame OCR in a +-3-frame window around all 436 cuts timed caption changes against cuts. Every clip's layout sheet (a frame every 0.5 s) and every non-layout cut (frames c-1, c, c+1, c+3) were checked by eye; 4 shots were relabelled (faces inside photographs read as the presenter). Sentences and narrative beats were marked by reading the transcripts (225 units, 191 sentence starts after frame 0). Pauses come from a 250-3800 Hz voice-band envelope. Labels in this note: S = split (SPLIT), I = full-frame insert (FULL), P = presenter full height (PRESENTER and CLOSE together).

Not done: Nothing was listened to or watched in playback; voice-band gaps are inferred from level, not heard. Beats and sentence boundaries are by reading, not measured. The transcript word timing is +-2 frames and unverified. The animation-burst count behind the rate-of-change rule is a heuristic peak count on graphics-area frame differences. Whether speech was edited under inserts (hidden jump cuts) could not be measured here (see [P18]). Scene cut against animation for 158 non-layout cuts was judged by eye on 72x128 thumbnails.

Evidence is cited as `clipNN@frame` (frames at 29.97 fps, counted from 0; ids are this style's own). File names in Evidence lines name files of the local study; they are not shipped. "Verified" lines give the independent verifier's verdict and final value; item numbers refer to [verification.md](verification.md).

## Rules

### [S01] Use exactly three full-frame layouts: S split (illustration panel above the seam at y 960, 957 in the first three clips; presenter below), I full-frame insert (illustration only, no presenter) and P presenter full height; target I 50 %, S 37 %, P 13 % of runtime.

- Values: Runtime share over 20,881 frames (verification): I 0.504, S 0.365, P 0.130 (mid-video presenter 0.044 plus the closing 0.086). Per clip: I median 0.510 (0.417-0.565), S 0.358 (0.285-0.433), P 0.125 (0.083-0.186). I is the largest share in 17 of 19 clips (clip08 and clip18 have S 0.424/0.433 vs I 0.421/0.417). No other layout (picture-in-picture, side-by-side, title card) was found in any frame.
- Evidence: n=19 clips, all frames. S01_layout_ribbons_all_clips.png, S_sheets/clipNN_layout_sheet.png (19 files), S_layout_runs.csv; e.g. clip01@0-50 S, clip01@51-120 I, clip01@591-624 P.
- Confidence: high
- Verified, corrected in detail (item 7): the study read I 0.502, S 0.367, P 0.131 because of one false S run at clip16@894-934 (those frames are FULL); two run starts also move by eye (clip11 insert starts at 345, clip19 close at 1128). The shares agree with the layout note's four modes ([L01]).

### [S02] Open every video on the split at frame 0, with the first caption group already on screen and the voice starting at frame 0; hold this first split for about 53 frames (1.77 s).

- Values: Frame 0 layout S in 19/19; first caption on frame 0 in 19/19 (OCR); first voiced frame (voice band above p95-20 dB) 0.0-2.1 frames, ASR first word onset 0.0 in 19/19. First S run: median 53 frames (1.77 s), p10 40, p90 74, min 38 (clip13), max 80 (clip14); it carries 7 words median (6-9). No title card, no presenter-only opening, no insert at frame 0.
- Evidence: n=19. S_strips/S_frame0_all_clips.png, S_layout_runs.csv (position=open), numbers.json per_clip.*.opening; e.g. clip01@0-50, clip14@0-79.
- Confidence: high

### [S03] Make the first layout change a cut from S to a full-frame insert inside the first sentence, on the onset of a caption group 4-12 words in (median word 7), never at the end of the sentence; the run order then starts S-I-S.

- Values: First layout cut goes to I in 19/19; word index of the cut word 4-12 (median 7, p10 5.8, p90 8.2); position mid-sentence 18/19, clause start 1/19; cut frame 38-80 (median 53). Sequence starts S-I-S in 18/19 (clip06 S-I-P).
- Evidence: n=19. numbers.json summary.opening (per_clip lists the word the cut lands on: clip01 'ui', clip02 'with', clip08 '90'...), S_cuts.csv first row per clip; e.g. clip01@51, clip02@65, clip04@53.
- Confidence: high

### [S04] Alternate split and insert as the main rhythm; a P run may take the place of a split or sit between two inserts; two runs of the same layout never touch, and every video ends...I-P or...S-P.

- Values: Run transitions (n=278): S>I 104, I>S 91, I>P 30, S>P 21, P>I 17, P>S 15; S>S, I>I, P>P 0 (by construction a same-layout cut is a scene cut, see S19). Insert flanks (121 I runs): S-I-S 76, S-I-P 28, P-I-S 15, P-I-P 2. Mid P flanks (32): I-P-I 13, S-P-S 9, I-P-S 6, S-P-I 4. Ending: I-P 11, S-P 8. Example sequence clip01 SISISISPISISIP.
- Evidence: n=19 clips, 297 runs. numbers.json summary.transitions, summary.flanks, summary.sequences; S01_layout_ribbons_all_clips.png.
- Confidence: high
- Verified, noted (item 7): one of the 278 changes is the false run at clip16@894-934; the verified count is 277.

### [S05] Size runs by layout: split runs about 58 frames (1.9 s), insert runs about 84 frames (2.8 s), mid-video presenter runs about 28 frames (0.9 s), the closing presenter run about 92 frames (3.1 s).

- Values: Frames at 29.97 fps. S (n=125): median 58, p10 33, p90 92, min 16, max 147. I (n=121): median 84, p10 41, p90 139, min 22, max 237. P mid (n=32): median 27.5, p10 18, p90 40, min 12, max 51. P close (n=19): median 92, p10 77, p90 122, min 66, max 138. Words per run: S 7 (4-11), I 9 (4-17), P mid 3 (2-7), P close 13 (9-18).
- Evidence: S05_run_length_histograms.png, S_layout_runs.csv, numbers.json extra.words_per_run.
- Confidence: high
- Verified, confirmed (item 7): SPLIT 124 runs, median 58 frames; FULL 121, 84; mid-video presenter 32, 27.5; closing 19, 92.

### [S06] Change layout about every 62 frames (2.1 s): 12-19 layout changes per clip, about 24 per minute, with about 6 insert runs per clip.

- Values: Interval between layout changes (n=277 after removing one false run; verification): median 62 frames, p10 29, p90 114, min 12, max 237. Layout changes per clip median 15 (12-19); per minute median 23.6 (19.0-31.3). Runs per clip 16 (13-20). Insert runs per clip 6 (4-9). Shots (hard layout, scene and jump cuts + 1) per clip 18 (14-31).
- Evidence: n=19. numbers.json summary.layout_change_interval_frames, layout_changes_per_min, insert_runs_per_clip; S_rate_of_change.csv.
- Confidence: high
- Verified, confirmed (items 7, 17): 277 layout changes, interval median 62 frames (p10 29, p90 114).

### [S07] Change layout only by a hard cut (no crossfade, wipe or slide); in about one cut in 10 to 15 let the new picture complete 1-3 frames after the cut (empty plate or dimmed frame first, content pops in).

- Values: 278/278 layout changes contain a single-frame change >= 20 levels and >= 3.5x the preceding median in at least one region (top or bottom). Verification (316 cuts in 10 clips): an empty plate on the cut frame in 20 of 316 (6.3 %); content after 1 frame in 7, 2 in 3, 3-9 in 10. No layout change without a cut was found (the one candidate, clip18@510, is inside an insert).
- Evidence: S_strips/S_popin_after_cut_clip01@982-987.png (empty marble plate on 984, panel on 985), S_strips/S_flash_after_cut_clip04@51-58.png (cut 53, dim 55-57), S_strips/S_cut_on_caption_change_clip01@48-54.png; S_cuts.csv column merged_followup_cuts.
- Confidence: high
- Verified, corrected (item 9): the study counted further hard changes 1-3 frames after 42 of 278 cuts (15 %; gaps [1,2] 17, [1] 10, [2] 10, other 5; 22 into S and 19 into I). With the verifier's empty-plate definition the share is about 6 %: an occasional device, about one cut in 10 to 15.

### [S08] Place every layout cut on the exact frame where a new caption group appears; the caption group starts on its first word's onset.

- Values: Cut frame minus caption-change frame (every-frame OCR, n=270 with a caption change within +-3): 0 in 250 (92.6 %), -1 in 10, +1 in 1, -2 in 6, +2 in 1, -3 in 2; 8 cuts had no caption change within +-3. Cut frame minus ASR word onset (n=278): median 0.0, p10 -2.5, p90 +2.9, min -5.0, max +6.0 (ASR is +-2 frames).
- Evidence: S08_layout_cut_offsets.png, S_cuts.csv (offset_from_caption_change_frames, offset_from_word_onset_frames), S_strips/S_cut_on_caption_change_clip02@62-68.png (cut and 'with' caption on 65).
- Confidence: high
- Verified, confirmed (item 17): 259 of 277 layout changes (93.5 %) exactly on a caption-group onset, 266 (96 %) within +-1 frame.

### [S09] Put about half of the layout cuts on sentence starts and the rest on caption-group boundaries inside the sentence; the cut word is the first word of the caption group, usually a function word ('and', 'so', 'it's', 'just'), not the key noun.

- Values: Layout cuts n=278: first word of a sentence 145 (52 %), mid-sentence caption boundary 106 (38 %), first word after a caption comma 19 (7 %), first word of a clause unit 8 (3 %). Word index within the sentence: median 0, p90 10, max 27. Cut word is a function word in 69.8 %; for cuts into I: 'and' 21, 'so' 11, 'it's' 8, 'just' 6, 'it' 6. Cuts into P land on sentence starts 35/51 (69 %), most often 'want' (9) and 'comment' (5).
- Evidence: S_cuts.csv (word_position, nearest_word, word_is_function_word), numbers.json summary.layout_cut_word_position and cut_S>I / cut_I>S / cut_S>P etc. Sentence boundaries by reading: S_beat_units_by_reading.json.
- Confidence: medium (sentence boundaries are by reading; cut timing itself is measured)

### [S10] Give most sentence starts a layout change; when a sentence starts without one, it is because an insert (or the closing presenter shot) continues across the boundary.

- Values: Sentence starts after frame 0: n=191; layout change within +-4 frames of the first word: 150 (78.5 %) - to I 61, to S 59, to P 30. Without a change: inside a continuing I 23, inside P 15 (mostly the second CTA sentence inside the closing), inside S 3. Clause units (n=15 by reading): 66.7 % with a change.
- Evidence: S_sentences.csv (layout_change_at_start, label_at_start), numbers.json extra.sentence_starts_label_and_change.
- Confidence: medium (sentence starts by reading)

### [S11] Give almost every content sentence a full-frame insert somewhere in it; keep inserts out of the call to action.

- Values: Non-CTA sentences with insert frames: 156/177 (88 %). CTA sentences with insert frames: 3/33 (only the first 2-19 % of a CTA question that starts while an insert is still up: clip01, clip09, clip16). Units with any insert by beat: DEMO 1.00, HOOK 0.96, BENEFIT 0.95, HOW 0.93, PROOF 0.92, WHAT 0.875, PROBLEM 0.86, CAVEAT 0.75, NAME 0.69, PIVOT 0.64, ITEM 0.44, CTA 0.09. The 21 sentences without an insert are short (median 1.6 s): ITEM 5, PIVOT 5, WHAT 5, HOW 2, others 1 each.
- Evidence: S_beats_by_layout.csv, S_sentences.csv, numbers.json extra.sentences_with_insert.
- Confidence: medium (beats by reading)

### [S12] Use mid-video presenter-full-height shots sparingly (0-3 per video, median 2) and short (12-51 frames), on lines spoken straight to camera: pivots, problem openers, list markers, caveats, or the last 2-5 words of a punchline.

- Values: 32 mid P runs in 18/19 clips (clip15 has none); per clip median 2 (0-3); length median 27.5 frames (0.92 s), min 12, max 51; 3 words median. Starts on a sentence start 17, mid-sentence 13, after a comma 2; ends at a sentence start 13, mid-sentence 19. Examples: clip03@269 a problem opener, clip07@366 'Second,', clip07@588 'Third,', clip10@293 a short rebuttal, clip16@863 a 'best part' pivot, clip13@800 the tail of a comparison with another product, clip05@367 a two-word punchline tail. P share of PIVOT time 17 %, CAVEAT 18 %, all other non-CTA beats <= 6 %.
- Evidence: S_layout_runs.csv (label=P, position=mid, text), S_strips/S_mid_presenter_run_clip03@266-290.png, S_beats_by_layout.csv.
- Confidence: high (placement by beat: medium)

### [S13] Frame mid-video presenter shots and the closing shot identically (about 1.9x the split face width); there is no separate tighter close-up for the ending.

- Values: Vision face width (full-res px, median per shot): S 342 (p10 320, p90 368, 183 shots); P mid 652 (622-687, 32 shots); P close 652 (626-678, 28 shots); P/S = 1.91.
- Evidence: numbers.json extra.presenter_face_width_px_by_layout; S_sheets/clip01_layout_sheet.png (591-624 vs 1114-1196). Details belong to the presenter analyst.
- Confidence: high
- Verified, confirmed (item 8): split face box 344.1 px, full-height 649.2; zoom 1.915.

### [S14] End every video on one presenter-full-height run that starts on the first word of the CTA sentence and lasts to the last frame; when the CTA opens with a question ('Want...?'), the cut comes on the question, 20-57 frames before 'Comment'.

- Values: Last run P in 19/19. Start minus CTA first-word ASR onset: median -0.3 frames (-1.4..+5.7). Length median 92 frames (3.07 s), min 66, max 138. 14/19 start on a question, 19.5-57.4 frames (median 25.9) before the 'comment' onset; 5/19 (clip01, 02, 03, 18, 19) have no question and start on 'Comment' (-1.2..+5.7 frames).
- Evidence: numbers.json summary.closing, extra.closing_start_minus_cta_unit_onset_frames, per_clip.*.closing; S_strips/S_closing_start_on_cta_clip07@940-946.png (cut on 'Want' at 943).
- Confidence: high

### [S15] Bring in the closing serif keyword on the caption group of the spoken keyword (the word after 'comment'), 7-18 frames after 'comment' starts, and keep it to the end.

- Values: Keyword first frame minus ASR onset of the spoken keyword: median +1.4 frames (-5.6..+7.3; OCR every 2nd frame, so +-1). Minus 'comment' onset: 7.4-18.3 frames (median 11.1). In 8 clips the OCR caption event for the keyword word starts on the same frame as the keyword.
- Evidence: n=19. S_closing_keyword_timing.json, S_strips/S_keyword_after_comment_clip07@966-981.png (caption 'Comment' 966-974, 'Course' caption and keyword both on 975). Entrance animation: motion/type analysts.
- Confidence: high
- Verified, confirmed (item 5): onset +1.1 frames median against the spoken keyword (-6.6..+6.3, n=19); this note's +1.4 is the same within the transcript error.

### [S16] Cut the video off with the voice: no end card and no hold after the last word.

- Values: Last frame minus last voiced frame (voice band): median +0.3 frames (-1.4..+4.9). Last frame minus ASR end of last word: median 3.4 frames (-0.1..10.3).
- Evidence: n=19. numbers.json extra.closing_tail_after_last_voice_frames, per_clip.*.closing.frames_after_last_word_end; S_strips/S_last_frames_clip12@1066-1068.png.
- Confidence: high

### [S17] Remove pauses almost completely: keep about 70 ms of silence between sentences and nothing longer than about 0.3 s anywhere; speech runs at about 216 words per minute.

- Values: Voice-band gap at sentence starts (n=191): median 70 ms, p10 20, p90 140, max 240; 68.6 % under 100 ms. Longest voice gap per clip: median 220 ms, min 120, max 320 (clip03@34.17 s). Gaps >= 200 ms per clip: median 1 (0-5), only 9 of 34 at sentence boundaries. Longest ASR inter-word gap per clip: median 0.26 s (0.00-0.40). Speech rate 216 wpm (195-244).
- Evidence: S17_voice_gap_histogram.png, S_voice_gaps.csv, S_sentence_boundary_pauses.json, numbers.json summary.words_per_min.
- Confidence: medium (level-based gap detection with a -20 dB threshold under a music/room floor; nothing was listened to)

### [S18] Never jump-cut the presenter while visible in a split; presenter jump cuts occur only inside the closing shot, rarely.

- Values: Bottom-region cuts inside S runs that are not layout changes: 0 of 125 S runs (the one candidate, clip14@6, is hand motion: face step 0.072 face widths vs 0.051 around). Face-continuity test on all 8 same-layout bottom cuts: jump cuts 2, both in the closing P (clip08@971 on 'Comment', step 0.43 face widths; clip11@962 on 'down', step 0.145); the other 6 are gestures (step <= 0.064).
- Evidence: S_presenter_jump_test.json, S_strips/S_closing_jumpcut_on_comment_clip08@968-974.png, S_by_eye_cut_review.json.
- Confidence: high (whether speech is cut under inserts is unknown, see open questions)

### [S19] Inside a layout run, change the picture by a hard scene cut only occasionally (median 2 per video), mostly inside inserts; with photographic or video footage, cut more often (up to 13).

- Values: Non-layout hard cuts n=158, classified by eye: scene cut in I 38, in S panel 24, background montage in I 5, animation inside the same picture 85, presenter jump 2, no real cut 4. Runs with a scene cut: I 34/121, S 12/125, P 0/51. Per clip median 2 (0-13): clip16 13 and clip19 10 (video/photo footage), clip01 0. Scene cuts land mid-sentence 53/62; caption change within +-1 frame 23/39 (looser than layout cuts), 23 with no caption change within +-3.
- Evidence: S_by_eye_cut_review.json, S_nonlayout_cuts_review_sheet_part1-3.png, S_strips/S_scene_cut_inside_insert_clip04@119-123.png, S_cuts.csv.
- Confidence: medium (scene vs animation judged by eye on small thumbnails)

### [S20] Keep something new on the picture about every 16 frames (0.5 s), and something new including caption changes about every 12 frames.

- Values: Picture events (layout cuts + scene cuts + graphics animation bursts, merged within 3 frames): median interval per clip 16 frames (11-29), 76.7 per minute (53.9-108.4). Including caption-group changes: median interval 12 frames (9-13). Animation bursts per clip 30 (15-62). Caption groups per clip 71 (55-105).
- Evidence: S_rate_of_change.csv, numbers.json summary.rate; burst detector: peaks of the graphics-area mean |d luma| (height 3, prominence 2, distance 6).
- Confidence: medium (burst count is a heuristic; layout and scene cut counts are exact)

### [S21] Write the script as HOOK, then naming and explanation beats (NAME, PROBLEM, WHAT, HOW/ITEM, DEMO/PROOF), usually a PIVOT ('doesn't just...' / 'best part'), a BENEFIT ('so you...'), and the CTA last; give each sentence about 3.5 s.

- Values: HOOK first and CTA last in 19/19. Runtime share: WHAT 25.8 %, HOOK 13.5 %, HOW 13.1 %, BENEFIT 9.4 %, CTA 8.7 %, PROOF 8.0 %, DEMO 6.6 %, PIVOT 4.9 %, NAME 3.1 %, PROBLEM 2.9 %, ITEM 2.2 %, CAVEAT 1.9 %. Clips using: NAME 12, PIVOT 12, BENEFIT 14, HOW 15, PROOF 7, PROBLEM 4, ITEM 3 (list videos), CAVEAT 3, DEMO 4. Sentence length (non-CTA) median 3.54 s (p10 1.67, p90 5.69). HOOK 3.9 s median (1.7-6.7). CTA units 1.9 s.
- Evidence: S_beats_by_layout.csv, S_beat_units_by_reading.json, S01_layout_ribbons_all_clips.png (beat strip), numbers.json summary.beat_sequences.
- Confidence: medium (beats are by reading)

### [S22] Assign layouts by beat: the hook is split then insert, explanation beats are mostly insert, list markers mostly split, pivots and caveats take most of the mid-video presenter time, the CTA is presenter only.

- Values: Layout share of each beat's time: HOOK S 0.51 / I 0.49 / P 0.00; WHAT S 0.33 / I 0.62 / P 0.05; HOW 0.45 / 0.53 / 0.02; DEMO 0.28 / 0.68 / 0.04; PROOF 0.38 / 0.56 / 0.06; BENEFIT 0.44 / 0.50 / 0.06; NAME 0.48 / 0.48 / 0.04; PROBLEM 0.40 / 0.54 / 0.06; ITEM 0.71 / 0.25 / 0.05; PIVOT 0.23 / 0.60 / 0.17; CAVEAT 0.50 / 0.33 / 0.18; CTA 0.00 / 0.01 / 0.99. NAME units get a layout change on their first word 12/13; PIVOT 13/14; ITEM 9/9; PROBLEM 7/7.
- Evidence: S_beats_by_layout.csv, numbers.json summary.beats.
- Confidence: medium (beats are by reading)

### [S23] Keep the structure constant across the corpus period; the only drift is more same-layout scene cuts in the later, footage-heavy videos.

- Values: Oct 29-Nov 5 (clip01-09, n=9) vs Nov 5-12 (clip10-19, n=10): I share median 0.510 vs 0.504; P share 0.124 vs 0.136; layout changes per minute 24.3 vs 23.0; mid P runs 2 vs 2; closing length 92 vs 95.5 frames; scene cuts per clip 1 vs 3.5 (driven by clip16 13 and clip19 10, both with photographic/video footage).
- Evidence: numbers.json summary.over_time; S01_layout_ribbons_all_clips.png (rows in date order).
- Confidence: medium (two groups of 9 and 10 clips)

### [S24] Things that never happen: no title card or intro sting, no insert or presenter shot at frame 0, no layout change without a hard cut, no two adjacent runs of the same layout, no split or insert after the CTA starts, no end card, no pause over 0.32 s.

- Values: Counts over 19 clips / 278 layout cuts / 297 runs: title cards 0; frame-0 layout other than S 0; layout changes without a single-frame cut 0; same-layout adjacent runs 0; S or I runs after the closing P start 0; frames after the last voiced frame max 4.9; longest voice gap 320 ms.
- Evidence: S_sheets/*, S_strips/S_frame0_all_clips.png, S_layout_runs.csv, S_voice_gaps.csv.
- Confidence: high

### [S25] Lay out a new video from its transcript with this procedure (all cuts hard, on caption-group onset frames).

- Values: 1) Group words into 1-3-word caption groups; mark sentences and beats; find the CTA sentence. 2) Frame 0: S. 3) First cut to I on the caption-group onset nearest 53 frames (38-80) inside sentence 1 (word 4-12). 4) For each following sentence before the CTA: if it is a PIVOT, CAVEAT, list marker or problem opener and fewer than 3 P runs are used, cut to P on its first word for 12-51 frames (median 28), then cut on to I or S at the next caption-group onset; otherwise cut to the other of S/I on its first word, unless the current run is still shorter than ~30 frames (S) / ~40 frames (I), in which case continue and cut at the next caption-group onset inside the sentence. 5) Split any S run longer than 147 frames or I run longer than 237 frames at a caption-group onset. 6) Give every content sentence some insert time; aim for I 50 %, S 37 %, P 13 % and a layout change every ~62 frames. 7) Cut to P on the first word of the CTA sentence and hold to the last frame; show the keyword with the caption group of the spoken keyword. 8) End the video within 0-5 frames of the last voiced frame. 9) In about one cut in 10 to 15 (verified share about 6 %, [S07]), let the new picture's content pop in 1-3 frames after the cut.
- Evidence: Derived from S02-S17; numbers.json build_spec.pseudo_code. Checked against the 19 sequences in numbers.json summary.sequences (the procedure reproduces their run counts within the measured ranges by construction, not by simulation).
- Confidence: medium (synthesis of measured rules; not validated by rendering)

## Constant and variable

CONSTANT (19/19 clips, to the frame where stated): split at frame 0 with a caption and speech from frame 0; first layout change goes to an insert inside the first sentence; layouts limited to S, I, P; every layout change is a hard cut, 92.6 % exactly on the caption-group onset frame and 96.7 % within +-1; no presenter jump cut while the split is up; closing = one P run from the first word of the CTA sentence to the last frame; the serif keyword arrives with the spoken keyword's caption group; video ends within 5 frames of the last voiced frame; P mid and P close share one framing (face ~1.9x the split face); pauses under 0.32 s. VARIABLE: clip length 28.8-47.2 s; layout changes 12-19 per clip (19-31 per minute); run lengths S 16-147, I 22-237, P mid 12-51, P close 66-138 frames; mid P runs 0-3 per clip (placed on pivots, caveats, list markers, problem openers, punchline tails); closing starts on a question (14) or directly on 'Comment' (5), driven by the script; 1-3-frame pop-in after 6-15 % of cuts, by definition ([S07]); same-layout scene cuts 0-13 per clip, driven by photographic/video footage; layout share per clip I 0.42-0.57, S 0.29-0.43, P 0.08-0.19.

## Open questions

- Are speech edits (removed pauses, retakes) hidden under inserts? The presenter is never jump-cut while visible, yet pauses are ~70 ms; an audio edit-point detector or the raw recording would decide it.
- Is the alternation rule driven by sentences or by caption groups? 52 % of layout cuts are on sentence starts and 38 % mid-sentence on caption boundaries; a larger set or the editor's project file would show whether mid-sentence cuts follow a maximum run length (147 S / 237 I frames observed).
- What decides split versus insert for a given sentence? Layout shares by beat differ only moderately (WHAT 62 % I, ITEM 71 % S); the explanation analyst's per-unit inventory (what the picture shows) may explain it better than the beat label.
- The 15 % pop-in after cuts (empty plate or dim flash for 1-3 frames) may be part of the prop entrance animation; the motion analyst's every-frame curves would say whether it is deliberate. Verification: about 6 % by the empty-plate definition ([S07]).
- Beat labels and sentence boundaries are this analyst's, by reading; a second reader would give an agreement figure.

Needs an eye or an ear:

- Watch the closing of 3 clips in playback (S_strips/S_closing_start_on_cta_clip07@940-946.png, S_keyword_after_comment_clip07@966-981.png, S_closing_jumpcut_on_comment_clip08@968-974.png) to confirm the cut on the CTA question and the keyword timing feel right.
- Listen to the sentence boundaries of one clip (S_sentence_boundary_pauses.json lists the gaps; e.g. clip03 around 34.17 s, the longest gap, 320 ms) to confirm pauses are really removed and that nothing audible (breaths, room tone jumps) marks the cuts.
- Look at the 1-3-frame pop-ins in playback (S_strips/S_popin_after_cut_clip01@982-987.png, S_flash_after_cut_clip04@51-58.png) and decide whether they read as intended snaps or as glitches to avoid.
- Check the by-eye cut classes on S_nonlayout_cuts_review_sheet_part1-3.png against S_by_eye_cut_review.json (scene vs animation was judged on 72x128 thumbnails).
- Confirm the 4 relabelled shots in clip16@167-209 and clip18@485-547 are full-frame inserts (photo faces were detected as the presenter): S_sheets/clip16_layout_sheet.png, clip18_layout_sheet.png.
