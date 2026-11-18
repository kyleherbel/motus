# Hook and ending

Measured on the 30 in-style clips of the reference corpus (neutral ids clip01 to clip30, by publication date, 2026-03 to 2026-11). Evidence ids are `clipNN@frame` at the clip's own rate (23.976 or 24 fps); evidence files stay in the private study folder and are not part of this repository. Confidence is the analyst's.

## Summary

Measured on all 30 in-style clips (2026-03-11 to 2026-11-15). Codec checked with ffprobe (25 VP9 1080x1920 at 2997/125, 3 VP9 at 24 fps, 2 H.264 720x1280 at 24 fps); every decode used an explicit BT.709 limited-to-full conversion, checked on clip28@0 (darkest 8x8 block 4.9, brightest 248.0, identical to the default decode; frame-0 blocks of all 30 clips span 0..254). Every frame of the first 300 frames of every clip was scanned (half-res region differences, seam edge, title presence), the opening headline was tracked at native resolution on every frame (per-line horizontal offset by row-wise correlation of the hold-frame text mask, 24 clips, 24 entry and 16 exit curves fitted), and every frame of the last 240 frames of every clip was scanned for cuts, layout and fades. Speech timing comes from the faster-whisper word timings (30/30 transcripts, unverified) plus a voice-band energy envelope of all 30 clips. Titles, frame-0 sources, CTAs and the peace gesture were read by eye from native frames and every-frame strips and are marked as such.

The hook is a cold open: speech starts on frame 0 in 30/30 and the first frame is already the split layout in 26/30, with the subject's own material (its UI, demo output, launch film or a news page about it) in the top slot and a caption word, or the brand's logo when the first word is the brand, on the seam. 25/30 clips carry an opening headline: a centred stack of 1-3 short uppercase display lines (2 lines, 2 words per line, 4 words in total, median), white #FCFCFC with no box, its last line ending at y=875, about 85 px above the seam, while the caption keeps running on the seam beneath it. In the dominant template (18 clips) each line slides in horizontally from off-frame on its own side, lines alternating, starting on frame 0-11 and at rest on frame 19 (18-24) with an exponential ease-out (remaining distance x0.812 per frame, 16 frames). It holds dead still across any top-slot cuts and leaves at the first layout change of the video: gone on that exact frame in 12/25 and within 5 frames in 17/25, either cut away with the shot (12) or by each line sliding on out in its direction with an ease-in (11), at a median of 3.21 s. The headline frames the story ("the future of X", a drama noun, a superlative), while the spoken first sentence carries the news; only a third of its content words are spoken while it is up.

The ending has no end card in 28/30: the last shot runs out 0.25 s after the last word. The closing block is a CTA sentence (comment-keyword before July 2026, "let me know what you think" after August 2026, follow, or none), then "I'll catch you in the next one" (23/30, 1.49 s before the end) and "Peace." (18/30, 0.67 s before the end) with a peace-sign hand (18/30). 13/30 cut to a full-frame face for the closing sentence. Not done: no listening, no watching at speed, no frame-by-frame sweep of the middle of the videos, vertical title motion not tracked, fonts not identified.

## Rules

### H01. Open on the split layout at frame 0: footage in the top slot, presenter in the bottom slot, seam at y=960; there is no intro card, no black frame and no full-frame face before it.

- Values: split at frame 0 in 26/30; seam row at frame 0 median 960 px (p10 953, p90 962; n=23 frames with a detectable seam). Exceptions: full-frame face 2/30 (clip15, clip18), full-frame presenter holding a prop with a serif title 1/30 (clip06), full-frame footage with a presenter inset 1/30 (clip11).
- Evidence: n=30. evidence/frame0_sheet.jpg (frame 0 of every clip), evidence/open_scan_{a,b,c}.json (seam_edge, seam_edge_score per frame), numbers.json frame0 / frame0_counts. Layout labels read by eye.
- Confidence: high

### H02. Start speaking on frame 0: the cut must begin inside the first sentence's first word, with no silent lead-in.

- Values: first transcribed word starts at 0.00 s in 30/30; voice-band (200-4000 Hz) energy above the clip's p90-20 dB threshold on frame 0 in 24/30 and by frame 3 at the latest (30/30).
- Evidence: n=30. evidence/audio_env.json (first_voiced_frame, env_first4s_db), evidence/speech.json (first_word_s). ASR timings are not forced-aligned.
- Confidence: high

### H03. Put the named product's own material in the top slot from frame 0: its screen recording or UI, its demo output, its launch film, or a news page or interview about it; never generic stock.

- Values: frame-0 top slot (read by eye): screen recording/UI 8, demo output samples 7, maker's launch film 6, news page or news footage 3, interview footage 2, product demo footage 1 (clip11), presenter full frame 3. In 30/30 the frame-0 material is about the subject the first sentence names.
- Evidence: n=30. evidence/frame0_sheet.jpg, evidence/sheets/clipNN_open.jpg (frames 0-102 every 6th), numbers.json frame0.top_source_by_eye.
- Confidence: medium (categories read by eye)

### H04. Have something on the seam from frame 0: the first caption word, or the brand's logo when the first spoken word is that brand.

- Values: seam object at frame 0 (by eye): caption 18/30, brand logo 4/30 (clip13, clip21, clip24, clip30: first spoken word is that brand, at 0.00 s), title 1/30, nothing 7/30; white caption text appears in the seam band by frame 3 in 28/30 (code: cap_density > 0.01).
- Evidence: n=30. evidence/frame0_sheet.jpg, evidence/open_scan_*.json cap_density, evidence/logo_timing.json.
- Confidence: medium (caption presence partly by eye; the code detector counts any white pixels in the band)

### H05. Cut the top slot quickly while the presenter stays put: about two top-only cuts in the first 3 s, with the first layout change (both halves change, usually to a full-frame shot) at about 3.4 s.

- Values: cuts in frames 0-72: median 2 (p10 1, p90 6; 0 in 3/30; clip21 23, a 2-5-frame montage from the maker's film). First cut: median frame 18.5 (p10 2, p90 69). First layout change: median frame 81.5 = 3.4 s (p10 44, p90 131). Of the cuts in frames 0-72 (clip21 montage excluded), 59/84 change the top slot only, 22 change both halves, 3 the bottom only.
- Evidence: n=30. evidence/open_cuts.json and .csv (every frame 0-299, threshold d>=12 and >=3x local median), evidence/sheets/clip21_clip29_every_frame_top.jpg (clip29 frames 41-65 are 2-frame animation, excluded).
- Confidence: medium (cut detector not verified frame by frame on every clip; animation on twos can read as cuts)

### H06. Give the video an opening headline over the bottom of the top slot; skip it only for a straight talking-head news read.

- Values: headline in 25/30; none in 4/30 (clip01, clip10, clip18, clip20: checked frames 0-299); brand wordmark plus product name only in 1/30 (clip21, sliding on the seam).
- Evidence: n=30. evidence/title_holds_sheet.jpg, evidence/sheets/no_title_clips01_10_18_20_f0-299.jpg, evidence/title_copy_by_eye.json.
- Confidence: high

### H07. Animate the headline in from the very first frames and have it at rest on frame 19 (0.79 s at 23.976 fps); it is not already on screen at frame 0.

- Values: slide template (n=18): first visible frame median 3 (min 0, max 11), at rest frame median 19 (min 18, max 24; 18-21 in 17/18). All 25 headlines: first visible median 4 (p10 1, p90 21), at rest median 19 (p10 18, p90 28). On screen at frame 0 only in clip06 (title over a full-frame shot). Later entries: clip16 f26 (after its first top cut), clip29 f31, clip30 f44 (after a brand wordmark and product word).
- Evidence: n=25. evidence/title_summary.json/.csv, evidence/title_timing.json, evidence/strips/clipNN_entry.jpg (every frame, native band crops).
- Confidence: high

### H08. Bring each headline line in with a horizontal slide from fully off-frame and an exponential ease-out: remaining distance x0.812 per frame, 16 frames; no overshoot.

- Values: n=24 lines from 15 clips: entry 16 frames (min 12, max 18). Fits of normalised offset: exponential ratio 0.812/frame (p10 0.778, p90 0.831), rmse 0.027; power ease-out (1-t/T)^2.5 (p10 2.1, p90 2.9), rmse 0.021; best cubic-bezier rmse 0.012 (typical (0.2, 0.5, 0.4, 1.0)); linear rejected, rmse 0.224. First tracked offset |dx| median 710 px (line just entering the frame). No visible overshoot on the strips; after rest no line goes past zero by more than 9 px, which is the tracker's peak ambiguity (constant 7-9 px offsets also appear during holds).
- Evidence: evidence/title_curves.png, evidence/title_timing.json (entry_offsets, entry_fit per line), numbers.json entry_curves / curve_stats, evidence/strips/clip02_entry.jpg, clip03_entry.jpg, clip09_entry.jpg.
- Confidence: high

### H09. Send alternate lines in from opposite sides; the top line comes from the left by default.

- Values: multi-line titles with two or more tracked lines: alternating sides in 9/11, top line from the left in 9/11 (from the right in clip03, clip04, clip14). All lines move only horizontally in the tracked clips; clip13 also shows a vertical convergence (not tracked).
- Evidence: n=11 clips. numbers.json entry_sides, evidence/title_timing.csv, evidence/strips/clip13_entry.jpg.
- Confidence: medium (11 clips; vertical motion not measured)

### H10. Blur each line horizontally while it moves; the blur fades as it decelerates and is gone at rest.

- Values: read by eye on every-frame strips: strong horizontal smear on frames 1-10 of the entry and on the last frames of slide exits, none during the hold. Amplitude not measured (hand to the motion analyst).
- Evidence: evidence/strips/clip02_entry.jpg, clip08_entry.jpg, clip13_entry.jpg, clip09_exit.jpg.
- Confidence: medium (read by eye on 4+ clips, not measured)

### H11. Hold the headline dead still and keep it on through any top-slot cuts beneath it.

- Values: 33/47 tracked lines vary <= 2 px (p5-p95) over the hold; the rest show 7-9 px tracker jumps between equal correlation peaks or mask failures (clip16, 22, 24), no steady drift; no scale change seen on the strips; hold length median 57 frames (p10 27, p90 75; n=25); cuts under the title median 2 (max 12, clip29). Rare exception: clip22 re-sets the headline at giant scale for 5 frames over a cut (f30-34).
- Evidence: n=25. evidence/track_title*.json (offset per frame), evidence/title_summary.json cuts_during_title, evidence/sheets/clip22_f26-47_title_punch.jpg.
- Confidence: high

### H12. Remove the headline at the video's first layout change after it lands (the first cut where the bottom slot also changes, usually to full-frame footage or face).

- Values: title gone exactly on that cut frame (0-1 frame) in 12/25, within 5 frames in 17/25 (median difference 0 frames). Title gone at median frame 77 = 3.21 s (p10 2.35 s, p90 4.53 s). Outliers leave before a much later layout change (clip05, 07, 08, 09, 28).
- Evidence: n=25. numbers.json title_exit_vs_first_layout_change, evidence/open_cuts.json, evidence/title_summary.json.
- Confidence: high

### H13. Exit either by cutting the title away with that shot change, or by sliding each line on out in the direction it came in with an ease-in so it clears the frame at the cut.

- Values: exit kinds: cut 12/25, slide 11/25, fade 1/25 (clip26, 9 frames, near-linear), blur-out 1/25 (clip11). Slide exits: whole exit median 15 frames (p10 9, p90 18); tracked line curves ease-in power 2.1 (p10 1.75, p90 2.38; rmse 0.015 vs linear 0.183; n=16 lines). Lines keep their entry direction in 20 lines (clips 02, 03, 08, 09, 13, 14, 17, 19, 24, 25, 26, 27) and reverse in 6 (clips 04, 07, 28).
- Evidence: n=25. evidence/title_summary.json, numbers.json exit_curves / exit_continues, evidence/title_curves.png, evidence/strips/clip02_exit.jpg, clip09_exit.jpg, clip26_exit.jpg.
- Confidence: high

### H14. Sync the headline to the opening speech: it starts with the first word, is at rest by about the fourth spoken word, and stays for about twelve words; do not wait for a sentence end to remove it.

- Values: words started before the title is at rest: median 4 (p10 3, p90 6.2); words spoken while on screen: median 12 (p10 6.8, p90 16). Title gone minus end of the first sentence: median -0.16 s, p10 -2.5 s, p90 +3.0 s; within 0.5 s in only 7/25, so the exit follows the layout change (H12), not punctuation.
- Evidence: n=25. evidence/speech.json, numbers.json title_speech_sync / title_speech_stats.
- Confidence: medium (ASR word timings, not forced-aligned)

### H15. Place the headline centred on x=540 with its last line ending about 85 px above the seam (bottom at y=875), block about 807 px wide, main line cap height about 75 px; the caption keeps running on the seam underneath (20/24).

- Values: block centre x median 540 (p10 533, p90 597; n=22); last-line bottom y median 875 (p10 813, p90 898; n=18 non-crossing); gap to y=960 median 85 px (p10 62, p90 147); block top median 754; block width median 807 px (p10 505, p90 901); tallest line mask height median 75 px (p10 48, p90 106). 4 clips set a bigger title across the seam (clip16, 27, 29, 30). A caption is visible on the seam under the title in the hold frame in 20/24 (by eye; not in clip06, 16, 24, 30).
- Evidence: 1080p clips only. numbers.json title_geometry / title_geometry_stats, evidence/title_masks/clipNN_headline_native.png, evidence/title_holds_sheet.jpg.
- Confidence: high (code on native frames; line heights are mask heights, i.e. cap height for uppercase)

### H16. Set the headline in plain white, no box, no stroke.

- Values: median text colour #FCFCFC (RGB 252,252,252) over 20 measured clips (interior mask pixels, p10 luma >= 224 in 19 of them). Exceptions: cream-yellow #FAF6B7 (clip22), orange (clip29, by eye), beige product wordmark (clip25), story-sticker white box with dark text (clip05).
- Evidence: n=24 measured. evidence/title_colour.json, evidence/title_holds_sheet.jpg. Calibrated decode (evidence/decode_calibration.json).
- Confidence: high

### H17. Use one heavy display face per headline, usually an extended heavy sans in caps, and optionally a small script or italic connector word tucked between or over the lines.

- Values: by eye: extended heavy sans caps 15/25, serif 4/25 (clip06, 07, 23, 30), condensed sans 3/25, brush italic 1, story sticker 1, thin condensed 1; script/italic connector word (of, for, The, have) in 6/25; small kicker line above 4/25; smaller subtitle line below 3/25; brand logo in the block 3/25. The face changes from video to video.
- Evidence: n=25. evidence/title_holds_sheet.jpg, evidence/title_copy_by_eye.json.
- Confidence: medium (read by eye; fonts not identified, see the type analyst)

### H18. Write the headline as 2 main lines of 1-3 words (about 4 words in all), uppercase.

- Values: main lines: 2 in 17/25, 1 in 4, 3 in 3, 0 in 1 (wordmark + subtitle); words per main line: 1 x19, 2 x14, 3 x10, 4 x3, 5 x1 (median 2, n=47 lines); title words including kicker/connectors median 4 (p10 2.4, p90 7.6); content words median 3; uppercase main lines 22/25 (sentence case only in clip05, clip06 how-to titles and clip07's serif line).
- Evidence: n=25. evidence/title_copy_stats.json (counts), evidence/title_copy_by_eye.json.
- Confidence: high (counts of text read by eye)

### H19. Make the headline a framing line about stakes or category, not a transcript of the first sentence; the first sentence delivers the news (who did what), the title says why it matters.

- Values: frames: 'THE FUTURE of X' 6/25; drama noun ('X RECKONING', 'URGENT WARNING', 'HONEYPOT') 3/25; how-to 2/25 (March 2026 only); one each: superlative category, a new era for X, the new X, the rules of X have changed, biggest update yet, welcome to the X era, news headline, number + noun, brand x brand, history has been made, product + question. Question mark 3/25. Share of title content words spoken while it is on screen: median 0.33 (p10 0, p90 0.67); none in 10/24, all in 2/24 (near-verbatim: clip16, clip24).
- Evidence: n=25 titles, 24 with transcripts. evidence/title_copy_stats.json, evidence/speech.json.
- Confidence: medium (copy classes are judgement; ASR text unverified)

### H20. When a brand is spoken in the opening seconds, swap that caption word for the brand's logo on the seam for about 12 frames, cut in on the word.

- Values: 8 clips (clip04, 09, 13, 21, 23, 24, 26, 30), 9 logo events: duration median 12 frames (p10 5.6, p90 23.4); onset vs the word's start median -0.75 frames (p10 -6.9, p90 +1.6); logo box centred on the seam (y 912-1005 in clip04, 09, 23). Hard cut in and out in 5/8; slide-in, fade or a 2-frame full-width punch once each. Opening logo captions: 3/18 clips before 2026-07-07, 5/12 after.
- Evidence: evidence/logo_timing.json, evidence/strips/clip13_entry.jpg, clip24_entry.jpg, clip26_exit.jpg.
- Confidence: medium (8 clips; word onsets from ASR)

### H21. End the video on the last word: no end card, no hold, no fade; the last frame comes about 0.25 s after the last word.

- Values: end after last transcribed word median 0.25 s (p10 0.08, p90 0.48; n=29); end after the last voice-band energy median 0.085 s (p10 0.01, p90 0.34; n=30). No end card in 28/30. Exceptions: clip19 white full-frame card with the brand logo for the last 25 frames (1.09 s after the voice); clip25 footage fades to black over the last 60 frames (3.35 s after the voice). clip24 has 3 black frames and clip23 1 half-black frame at the very end.
- Evidence: n=30. evidence/ending.json/.csv, evidence/audio_env.json, evidence/end_scan_all.json (lum per frame), evidence/last_frames/.
- Confidence: high

### H22. Close with "I'll catch you in the next one." starting about 1.5 s before the end, then "Peace." as the last word about 0.7 s before the end.

- Values: 'catch/see you in the next one / soon' in 23/30, starting median 1.49 s before the end (p10 0.79, p90 1.82); 'Peace' as the last word in 18/30, starting median 0.67 s before the end (p10 0.58, p90 0.88). Clips without a sign-off end on a closing claim or advice (clip02, 09, 11, 19, 24) or footage (clip25).
- Evidence: n=30 transcripts. evidence/speech.json (ending_hits, last12s_text), numbers.json ending_stats.
- Confidence: high

### H23. Have the presenter throw a peace sign on the word "Peace" in the final second.

- Values: peace/V hand visible in the last 16 frames in 18/30; 17 of those 18 also say 'Peace' (clip07 gestures without it; clip08 says it without the gesture).
- Evidence: n=30. evidence/endings_by_eye.json, evidence/sheets/clipNN_end.jpg (last 144 frames, every 8th).
- Confidence: medium (read by eye at 8-frame steps)

### H24. Put one CTA sentence just before the sign-off: currently "let me know what you think" (about 3.1 s before the end); the older form was "comment KEYWORD and I'll send you the link" (about 4.6 s before the end) with the keyword as an accent caption.

- Values: comment-keyword in the last 8 s: 7/30, start median 4.59 s before end (p10 3.59, p90 5.93), keyword shown as an accent-coloured caption, a coloured pill or a large two-line card (clip03, 05, 08, 12, 16, 17); 'let me know / I'd love to hear what you think': 6/30, 3.09 s before end (p10 2.20, p90 3.50); follow: 3/30 spoken (2.49 s before end) + 1 hand-written red 'FOLLOW @handle' write-on (clip29); no CTA 11/30.
- Evidence: n=30. evidence/speech.json, evidence/endings_by_eye.json, evidence/sheets/clip03_end.jpg, clip12_end.jpg, clip16_end.jpg, clip29_end.jpg.
- Confidence: medium (CTA classes from ASR text and by-eye captions)

### H25. If the ending cuts to a full-frame face, make that cut at the start of the closing sentence (CTA or sign-off), so the face carries the last 1.5-2.5 s; otherwise stay in the split to the end.

- Values: final shot: full-frame face 13/30, split 15/30, end card 1, footage fade 1. Full-face endings: last layout change median 49 frames before the end (p10 34, p90 161); in 8/13 it falls 0.0-0.5 s before the first word of the CTA/sign-off block (clip01, 05, 06, 12, 17, 26, 27, 28); clip04 cuts to the face on 'Peace'.
- Evidence: n=30. evidence/ending.json (final_layout_shot_frames, cuts_last240), numbers.json ending.cut_to_face_minus_signoff_s, evidence/sheets/clipNN_end.jpg.
- Confidence: medium (sentence starts from ASR; 13 clips)

### H26. Follow the newest generation: no comment-keyword CTA, 'let me know what you think' instead, and more brand-logo captions in the opening.

- Values: split at 2026-07-07: comment-keyword CTA 7/18 clips before, 0/12 after; 'let me know' 0/18 before, 6/12 after (first 2026-08-07); opening logo captions 3/18 before, 5/12 after; headline present 15/18 before, 10/12 after; slide entries 12/18 before, 8/12 after. Sentence-case how-to titles only in March 2026 (clip05, clip06).
- Evidence: n=30. numbers.json over_time, ending_stats.comment_keyword_dates / let_me_know_dates.
- Confidence: medium (date split chosen after looking)

### H27. Do not add recurring section-title cards; large type later in the video is emphasis on single spoken words, not titles.

- Values: no section-title card seen in frames 0-299 of any clip or in the last 144 frames; mid-video large words seen on sheets (clip01 f105-120, clip09 f138-148, clip18 f75, clip19 last 3.5 s) act as word emphasis. Middle of the videos not swept frame by frame.
- Evidence: evidence/sheets/no_title_clips01_10_18_20_f0-299.jpg, evidence/strips/clip09_exit.jpg, evidence/sheets/clip19_end.jpg.
- Confidence: low (middle of the videos not measured)

### H28. Treat title punches as rare: a giant re-set of the headline or a full-width logo for 2-5 frames happens in 2/25 openings only.

- Values: clip22 f30-34 headline at giant scale over a new top shot; clip24 f6-7 the brand logo scaled to full width between the seam logo and the title.
- Evidence: evidence/sheets/clip22_f26-47_title_punch.jpg, evidence/strips/clip24_entry.jpg.
- Confidence: low (seen in 2 clips)

## Constant and variable

CONSTANT: speech starts on frame 0 (30/30); the opening frame is the subject's own material, never an intro card (30/30); headline never on screen at frame 0 in the slide template and at rest on frame 18-21 (17/18); headline centred near x=540, white, static during the hold, kept through top-slot cuts; headline gone by the first layout change (17/25 within 5 frames, none survives it by more than 16 frames); the video ends within 0.5 s of the last word with no end card (28/30). VARIABLE: whether there is a headline (25/30); entry kind (slide 20, cut-in 2, present at frame 0 1, blur-in 1, word-by-word build 1); exit kind (cut 12 vs slide 11; what decides it is open); hold length 27-75 frames, driven by when the first layout change comes; face and colour of the headline per video; 1-3 lines, 2-9 words; whether a brand logo replaces a caption (8/30); CTA type (driven by date: comment keyword before July 2026, 'let me know' after); final shot full-frame face (13) or split (15).

## Open questions

- What decides a slide exit (11) versus a cut exit (12)? Neither date nor title length separates them; a person scrubbing the 25 openings with sound could tell whether slide exits land on a pause or a beat.
- Does the entry start off-frame on frame 0 for every line (first visible frames 0-11 depend on line length), or is it delayed to a word? Forced alignment of the first two words would decide.
- Vertical components of the entry (clip13 lines converge vertically) and the blur amplitude were not measured; the motion analyst's every-frame tracks would settle them.
- The 4 clips without a headline (clip01, 10, 18, 20) and the late-entry titles (clip16, 29, 30): editorial choice or a different sub-template? More reels beyond the 30 would decide.
- Is the first cut in the top slot aligned to word onsets? Needs forced alignment.

## For a person to check

- Listen to the first second of every clip to confirm the cold open (no music intro, no sound effect before the first word): evidence/audio_env.json env_first4s_db.
- Watch clip02, clip03, clip09 openings at speed to confirm the alternating slide, the motion blur and the pass-through exit: evidence/strips/clip02_entry.jpg, clip02_exit.jpg, clip09_exit.jpg.
- Listen for a whoosh or hit on the title entry and exit (audio analyst) at frames 0-20 and at the gone frames in evidence/title_summary.csv.
- Check the logo-caption sync by watching clip04 f10-28, clip09 f20-36, clip23 f26-40 with sound: evidence/logo_timing.json.
- Confirm the sign-off wording and the peace gesture list by watching the last 3 s of each clip: evidence/endings_by_eye.json, evidence/sheets/clipNN_end.jpg.
- Check that clip29 frames 41-65 are animation on twos, not cuts, and that clip21's opening is a 2-5-frame montage: evidence/sheets/clip21_clip29_every_frame_top.jpg.
- Read the title copy in evidence/title_copy_by_eye.json against the frames; it was read by eye.
