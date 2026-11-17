# Hook and call to action

Measured: The opening and the closing call to action of all 19 clips (1080x1920 VP9, 29.97 fps). Every frame of frames 0-179 (6.0 s) and of the last 300 frames (10.0 s) was decoded at full resolution through a calibrated BT.709 limited-to-full conversion (caption white 255; default decode 253). Captions and the closing keyword were tracked with a white-glyph detector and a template-persistence measure; layout was labelled on every frame of every clip from the seam edge plus Apple Vision face boxes; voice onsets and offsets came from a 120-4000 Hz band envelope; copy patterns from the faster-whisper transcripts (+-2 frames, unverified). There is no title card: frame 0 is the split with a caption on the seam and speech from frame 0; the ending is a hard cut to the presenter close-up on the first word of the call-to-action sentence, with the keyword cut in on the spoken keyword.

Not done: Nothing was listened to and no playback was watched. Caption text was not read by OCR here (words per group are by eye on every-third-frame sheets for frames 0-89 only). The body of the clips was checked for title cards on 10 clips at 1 fps. The caption plate itself (fill, radius, padding, entrance) was left to the type and motion studies. Sound effects at the cuts were not measured. Transcript word times are +-2 frames and some words are misheard. The 43 older reels were not used.

Evidence is cited as `clipNN@frame` (frames at 29.97 fps, counted from 0; ids are this style's own). File names in Evidence lines name files of the local study; they are not shipped. "Verified" lines give the independent verifier's verdict and final value; item numbers refer to [verification.md](verification.md).

## Rules

### [H01] Frame 0 is already the edited split frame with a caption on it: illustration panel above the seam, presenter below, caption text on the seam. No black frame, fade-in, logo, title card or pre-roll before it.

- Values: Layout on frame 0: split in 19/19 (full-width seam edge at y 952-960, 8 px row resolution). Caption on frame 0 in 19/19: text top y 921 (920-924), text bottom 976 without descenders (975-992 with), centre x 540.5 (539.5-550), width 362 px (201-486). Nothing precedes it: fade-in 0 frames.
- Evidence: n=19; clip01@0... clip19@0; H_frame0_sheet.jpg, frame0/clipNN@0.jpg, H_hook_per_clip.csv (frame0_*), H_hook_every_frame.csv
- Confidence: high

### [H02] Speech starts on frame 0: cut the source so the first syllable is on the first frame; no silent lead-in, no music or effect before the voice.

- Values: Voice band (120-4000 Hz) reaches speech median -12 dB at frame 0.3 median (0.0-2.2) and median -20 dB at frame 0.3 (0.0-1.0); first ASR word starts at 0.00 s in 19/19; 3 clips start mid-word (band level in the first 20 ms -12 to -17 dBFS: clip16, clip18, clip19). Audio is mono (side/mid < -69 dB).
- Evidence: n=19; H_audio_edges.csv (onset_med_minus12_frame, band_level_first_20ms_dbfs, first_word_asr_s)
- Confidence: high

### [H03] The first caption shows the first 1-3 words of the first sentence on frame 0 and is replaced after about half a second; it is the only text overlay of the opening.

- Values: First caption group lasts 14 frames median (5-19) = 0.47 s at 29.97 fps. Words in the frame-0 caption (by eye): 1 word in 6 clips, 2 in 7, 3 in 6. First letter capitalised in 18/19 (clip14 starts lower case, as its transcript does).
- Evidence: n=19; clip01@0-14, clip11@0-4, clip14@0-18; H_hook_per_clip.csv (first_group_end), caption_strips_0-89/clipNN_caption_f0-89.jpg, H_byeye_caption_words_0-89.csv
- Confidence: high

### [H04] Hook captions run in groups of 1 to 3 words, never more, changing about every 15 frames.

- Values: Verification (groups starting in frames 0-179, n=220): 1/2/3 words 35.5/51.4/11.8 %, hold median 15 frames. Groups starting in frames 0-89: median 7 (5-8) per clip. Words per group in frames 0-89 (by eye, n=118 groups): 1 word 39 (33 %), 2 words 62 (53 %), 3 words 17 (14 %), 4+ words 0.
- Evidence: n=19 clips; H_caption_groups_0-180.csv, H_byeye_caption_words_0-89.csv, caption_strips_0-89/, H_hook_timeline.png (black ticks)
- Confidence: high
- Verified, corrected (item 15): the study's caption group length in frames 0-179 was median 13 frames (p10 5, p90 25, max 36; n=223 complete groups). The 13 came from false splits when a counter or animation behind the plate changed (checked by eye: clip16@70-94 is one caption, clip15@74-83 one caption).

### [H05] Each caption group switches on the onset of its first word and arrives whole on one frame (no word-by-word build, no typing).

- Values: Group start minus ASR start of its first word: median -0.1 frames (p10 -2.3, p90 +3.4; n=215; ASR +-2 frames). Text-mask column projection between consecutive frames (normalised L1): at a switch median 1.00 (p5 0.68, n=195); inside a group median 0.0006 (p95 0.031, max 0.32, n=3068), so a group is replaced in one frame. Text width constant within 4 px for the life of the group in 91.7 % of 242 groups (the rest are detector merges with nearby panel text, checked on strips).
- Evidence: n=19; clip01@14-15, clip01@25-26; H_caption_groups_0-180.csv (lead_frames, width_growth_px), caption_strips_0-89/
- Confidence: high

### [H06] Caption position follows the layout: on the seam in the split, lower (text top y 1222) on full-frame inserts and in the close-up, always centred on x 540.

- Values: Split: text top y 921 (p5 920, p95 933), bottom 976 (975-992), n=127 groups. Full-frame: text top 1222 (p5 1201, p95 1234), bottom 1292 (1276-1297), n=113 groups. Close-up (ending): text centre y 1250 (1249-1259), n=19. Centre x 540 (p5 529, p95 542).
- Evidence: n=19 clips, 240 hook groups; clip01@0 (split), clip01@52 (full-frame), clip01@1150 (close-up); H_caption_groups_0-180.csv, H_cta_per_clip.csv (caption_cy_in_closeup)
- Confidence: high

### [H07] The hook has no title card and no headline overlay: the only overlay text in the first 3 seconds is the caption. Big words, when they appear, are props inside the illustration (a sign, a stamp, a sticker, a big figure, a counter, a headline typed into the scene).

- Values: Title cards in frames 0-89: 0/19 (570 frames viewed by eye at every 3rd frame). Text-as-prop inside the illustration in frames 0-89: 7/19 (clip05 sign, clip07 typed headline then big figure, clip08 stamp then big figure, clip09 sticker, clip13 ribbons, clip16 counter, clip19 page headline).
- Evidence: n=19; clip07@15-27, clip08@18-36, clip09@3-45; hook_sheets/clipNN_f0-89_every3.jpg
- Confidence: medium: by eye on every 3rd frame; a 1-2 frame flash would be missed

### [H08] Frame 0 shows a topic-specific illustration of the first sentence's subject in the panel (an interface piece, a rendered scene or prop, a figure, a photo set), never a generic plate or the presenter alone.

- Values: Panel content on frame 0 (by eye): interface 8, rendered illustration 5, figure (bars, progress) 2, photos 2, product mark badge 1, empty plate that builds in from frame 2 1 (clip19). Plate under it on frame 0: dark 9, pale 7, saturated orange or blue 2, full-bleed photos 1.
- Evidence: n=19; H_byeye_frame0_panel.csv, H_frame0_sheet.jpg
- Confidence: medium: classification by eye

### [H09] The illustration is never still during the hook: it is moving from frame 1 and keeps changing on nearly every frame until the first cut.

- Values: First panel frame with changed pixels (>= 0.15 % of y 0-880 moved > 12 levels, or a 16x16 block mean >= 20 levels): frame 1 median (1-3), 19/19. Share of frames that change before the first cut: median 100 % (86-100 %). Mean abs difference frames 1-3: median 7.7 levels (0.6-34.2).
- Evidence: n=19, frames 0-89 every frame at full resolution; H_panel_motion_f0-89.csv, H_hook_timeline.png (red curve)
- Confidence: high

### [H10] On frame 0 the illustration is in one of three states: mid-entrance (it is still arriving), acting continuously (scrolling, filling, counting, swirling, playing), or settled with its first event within half a second, landing on the second caption group.

- Values: Mid-entrance on frame 0: 4/19 (blur to sharp, oversize to size, slide up, build-in from an empty plate: clip02, clip03, clip07, clip19). Acting continuously from frame 0: 11/19. Settled then first event: 4/19, event at frame 3-15 (clip14@3, clip06@6, clip01@13, clip04@15). Large events land on caption switches: clip01@13 zoom-out reveal (group 2 starts @15), clip15@14 progress bar stops and turns red (group 2 starts @15).
- Evidence: n=19; clip07@0-9, clip15@14, clip01@13-25; hook_sheets/, H_panel_motion_f0-89.csv, numbers.json extra.frame0_panel_state_by_eye_and_motion
- Confidence: medium: state classes by eye, onsets measured

### [H11] First layout change: a hard cut from the split to a full-frame insert at about 1.8 s; it is never to the close-up first.

- Values: First change at frame 53 median (38-80) = 1.77 s (1.27-2.67 s); to full-frame 19/19. Frame-to-frame difference at the cut 85 (clip01@51). First insert lasts 69 frames median (35-122) = 2.3 s; afterwards back to split 18/19, to the close-up 1/19 (clip06@104).
- Evidence: n=19; H_hook_timeline.png (amber), H_hook_per_clip.csv (first_layout_change_frame), numbers.json aggregate.first_insert_frames
- Confidence: high

### [H12] Every layout cut in the hook lands on a caption change.

- Values: 48 of 49 layout changes in frames 0-179 have a caption group starting within +-2 frames (one exception: clip13@162). Glitch flicker in clip09@48-128 is treated as one full-frame insert (runs under 10 frames absorbed).
- Evidence: n=19 clips, 49 changes; H_hook_timeline.png, numbers.json per_clip.*.layout_change_with_caption_change
- Confidence: high

### [H13] Hook copy: one claim sentence of about 16 words, finished by about 5 s, opening on a news subject, a pointer word, a warning or the viewer.

- Values: First sentence: 16 words median (11-22), ends at frame 146 median (102-199) = 4.9 s (3.4-6.6 s); 3.3 words/s (2.4-4.4). Opener: third-person subject (company, someone, the AI product, everybody, while-clause) 8, pointer ("this", "these", "here's") 4, "Do not..." warning 3, "you/your" 2, "I" 2. Tense: present 11, recent past with "just" 5, imperative 3. Contains a number 9, addresses "you" 10, contrast ("but"/"while") 5, "free" 4, superlative 3.
- Evidence: n=19 (ASR text, openers corrected from the frame-0 caption); H_copy_patterns.csv, numbers.json extra.hook_tense_by_eye
- Confidence: medium: ASR transcripts, coding by rule and by eye

### [H14] After the hook sentence the product or idea is named in a short "It's called <name>" sentence, and the name is shown big inside the illustration (a mark, a wordmark, a headline or a lit sign), not as a title card.

- Values: "It's called" / "this is called" within 8 s in 10/19 clips, at frame 176 median (116-228) = 5.9 s; it directly follows the first sentence (gap 0-13 frames in 8 of the 10). Name shown big in the picture (by eye, 1 fps): clip07@180 headline under a badge, clip09@450 product mark full-frame, clip12@150-180 lit sign, clip13@420 mark plus name, clip15@240-300 wordmark heading.
- Evidence: n=19 (copy), 10 clips viewed whole at 1 fps; H_copy_patterns.csv (name_reveal_frame), H_body_1fps/clip12.jpg, clip15.jpg
- Confidence: medium: ASR text; name graphics by eye at 1 fps

### [H15] No standalone section-title cards in the body: list items and sections are introduced by the illustration itself (a badge or product mark plus a name headline inside the panel or a full-frame insert) while the caption keeps running.

- Values: Text-only title cards: 0 in 10 clips viewed whole at 1 fps (clip01, clip04, clip07, clip09, clip12, clip13, clip15, clip16, clip17, clip18; about 380 frames) and 0 in the first 3 s of 19/19. Item or section introductions by a badge, mark or wordmark plus a name inside the picture: clip07 (3 items), clip09, clip12, clip13, clip15, clip17, clip18.
- Evidence: n=10 whole clips + 19 hooks; clip07@180, clip07@420, clip15@240; H_body_1fps/<clip>.jpg, hook_sheets/
- Confidence: medium: 1 fps by eye on 10 of 19 clips; a card shorter than 1 s could be missed; the structure and graphics analysts cover the body

### [H16] Every clip ends on a tight presenter close-up, reached by a hard cut and held to the last frame.

- Values: Last layout run is the close-up in 19/19: face width 652 px (620-709), eye line y 696 (626-827), eye-midpoint x 531 (489-598), chin y 1179 (1106-1280); 1.9 x the split face (1.72-1.98, n=18). Cut difference 97 levels median (61-164). Comes from a full-frame insert 11/19, from the split 8/19. Close-up lasts 92 frames median (66-138) = 3.1 s (2.2-4.6 s).
- Evidence: n=19; clip01@1114-1196... clip19@1128-1202; H_lastframe_sheet.jpg, H_cta_timeline.png, H_face_closeup_vs_frame0.csv, H_cta_per_clip.csv
- Confidence: high
- Verified, confirmed (item 8): full-height face box 649.2 px, eye line 687.1, eye distance 259.2 between eye centroids; zoom 1.915.

### [H17] The cut into the closing close-up lands on the first word of the call-to-action sentence (the lead-in question, or "Comment" when there is none).

- Values: Cut minus ASR start of the nearest word: median -0.9 frames (p10 -1.2, p90 +2.3; -4.1..+5.7), n=19. Where a pause precedes the sentence, cut minus audio onset: median -0.6 frames (-9.4..0.0), n=10. The anchoring word is "Want"/"want" in 9, another lead-in ("If", "Do", "Now", "Once") 4, "to" (ASR split of want-to) 1, "Comment"/"comment" 5.
- Evidence: n=19; clip04@1011 ("Want" 1011.2), clip02@1126 ("Comment" 1126.9); H_cta_per_clip.csv (cut_minus_audio_onset), numbers.json per_clip.*.cut_minus_that_word_asr
- Confidence: high

### [H18] Call-to-action script: optional lead-in question about the benefit, then "Comment <KEYWORD>", then the promise to send something.

- Values: Lead-in sentence before "comment": 14/19 (10 "Want to <verb>...?"). "Comment <keyword>" 19/19. "down below" 5/19. Promise: send you the link 12, send it over 2, send the prompt/setup/library 4, a discount offer 1. Words after "comment": median 8 (6-13). "comment" is spoken 68 frames (56-138) before the last frame.
- Evidence: n=19 (ASR); H_copy_patterns.csv, numbers.json extra.cta_leadin_by_eye_from_transcript
- Confidence: medium: ASR text

### [H19] The serif keyword cuts in on the spoken keyword (the word right after "comment"): full size and full opacity on its first frame, no fade, scale or slide.

- Values: Template cover of the keyword pixels: <= 0.14 on the frame before and >= 0.986 on the first frame (18/19); keyword white level on the first frame 250.6-253.8 of 255 (18/19). First frame minus ASR keyword start: median +1.1 frames (-6.6..+6.3); minus "comment" start: median 11 frames (6.4-17.7); minus the close-up cut: median 34 (10-70): 12 (10-18) with a direct "Comment" (5 clips), 35.5 (28-70) after a lead-in (14 clips).
- Evidence: n=19; clip01@1125-1126, clip13@969-970; H_keyword_entrance_strips.jpg (8 frames each), H_keyword_cover_per_frame.csv, H_cta_per_clip.csv
- Confidence: high
- Verified, confirmed (item 5): first frame minus spoken keyword +1.1 frames median (-6.6..+6.3, n=19); after 'comment' +11 frames (6.4-17.7); after the close-up cut +34 frames (10-70).

### [H20] The keyword stays still and unchanged until the last frame; nothing replaces it and the video does not hold after the speech ends.

- Values: Hold: 58 frames median (46-126) = 1.9 s; template cover after the first frame never below 0.985 (18/19; clip19 reads 0.62 only because the white background behind it changes); glyph box constant to +-1 px (clip01@1126-1196: x 116-963, y 1311-1442).
- Evidence: n=19; H_keyword_cover_per_frame.csv, H_cta_every_frame.csv, H_lastframe_sheet.jpg
- Confidence: high
- Verified, confirmed (item 5): hold 58 frames (46-126).

### [H21] Keyword geometry: one upper-case serif word in quotation marks, white with a dark drop shadow, centred under the caption on the presenter's upper chest.

- Values: Box of glyphs and quotes: top y 1318 (1306-1331), bottom 1450 (1425-1477), height 133 px (116-156), centre x 537.5 (532.5-539.5), width 754 px (613-856); width = 373 + 73.5 px per letter (r 0.88; verification, 19 clips). 3-6 letters (median 5). Opening mark curly, closing mark straight (by eye, 19/19). Gap below the caption text bottom (y ~1292): about 26 px.
- Evidence: n=18 measured (clip18 overlaps white clothing print; template box only), 19 by eye; H_cta_per_clip.csv (keyword_box_settled), H_lastframe_sheet.jpg, lastframe/
- Confidence: high for position and size; medium for the quote shapes (by eye)
- Verified, confirmed within the measurement error (item 5): this rule's top 1318 includes the quote marks; the letters have cap top 1324, baseline 1448.5, cap height 126.5 (109-140), ink centre x 537 with the quotes; opening mark curly U+201C, closing straight U+0022 (by eye, 4 clips). The study's width fit was about 381 + 72 px per letter (RMSE 37 px, n=18).

### [H22] During the close-up the 1-3 word caption keeps running above the keyword; the keyword arrives either with the caption group that holds the keyword word or while "Comment <keyword>" is already on.

- Values: Caption present on 100 % of close-up frames median (89-100 %), text centre y 1250 (1249-1259). At the keyword's first frame the caption reads "Comment <keyword>" in 10/19; in 9/19 "Comment" is a group of its own and the next group (holding the keyword word) starts within +-2 frames of the keyword in 8 of them (clip04: 4 frames later). The caption shows the keyword in lower or title case; the serif keyword is always upper case.
- Evidence: n=19; clip02@1136, clip13@970; H_keyword_entrance_strips.jpg, H_cta_caption_groups.csv
- Confidence: high (caption wording read by eye on the strips)

### [H23] The keyword is the single word spoken right after "comment", a short noun taken from the topic or the thing being sent.

- Values: 19/19 match the word after "comment" (ASR mishearings: 4/19). Length 3-6 letters, median 5.
- Evidence: n=19; H_copy_patterns.csv (keyword_on_screen, keyword_asr)
- Confidence: high

### [H24] The video ends on the last spoken word: no end card, logo, outro or silent hold.

- Values: Voice (median -20 dB) ends 1.1 frames median before the last frame (0.0-4.1, n=19); band level in the last 100 ms -22 to -38 dBFS, i.e. still speaking. Last frame in 19/19: close-up, caption with the final words (ending on a full stop in 18/19, by eye) and the keyword.
- Evidence: n=19; H_audio_edges.csv (tail_after_med_minus20_frames), H_lastframe_sheet.jpg
- Confidence: high

### [H25] What never happens in the hook and the ending (19/19): fade from black, title card, music-only intro, word-by-word caption build, a still illustration in the first second, keyword animation, keyword before the close-up, a second CTA graphic (arrow, button, handle), an outro after the last word.

- Values: Fade-in frames 0; title cards 0; voice by frame 2.2; caption width growth <= 4 px in 91.7 %; panel changes from frame <= 3; keyword cover before its first frame <= 0.14 (18/19); CTA overlay = caption + keyword only (19 last frames by eye); tail after the voice <= 4.1 frames.
- Evidence: n=19; H_frame0_sheet.jpg, H_lastframe_sheet.jpg, H_keyword_cover_per_frame.csv, H_panel_motion_f0-89.csv
- Confidence: high (the CTA-graphic part is by eye)

### [H26] Over the corpus period the only change in the hook/CTA template is the lead-in question: early and latest clips go straight to "Comment", the middle run asks a "Want to...?" question first.

- Values: Direct "Comment": clip01-clip03 (2026-10-29 to 10-31, n=3) and clip18-clip19 (11-09, 11-12, n=2). Lead-in: clip04-clip17 (11-02 to 11-09, n=14). Unchanged across all dates: split frame 0 with caption (19/19), keyword top y 1306-1331 and quote style, close-up face 620-709 px, end on the last word. Four recording set-ups (clip01-03, 04-05, 06-18, 19) share the same template.
- Evidence: n=19; H_cta_per_clip.csv, numbers.json extra.cta_leadin_by_eye_from_transcript
- Confidence: medium: 5 vs 14 clips; the change could be per-script rather than a dated switch

## Constant and variable

CONSTANT (19/19, to the frame or pixel within measurement error): frame 0 = split with caption on the seam (text top y 920-924, centre x 540); speech on frame 0 (<= 2.2 frames); no title card; caption groups of 1-3 words that arrive whole; panel moving by frame 3; first layout change is a hard cut to a full-frame insert; layout cuts on caption changes; ending = hard cut to a close-up held to the last frame; keyword = one upper-case serif word in quotes, white, centred, top y 1306-1331, cut in at full size and opacity on the spoken keyword and held to the end; caption keeps running at centre y ~1250 above it; video ends within 4.1 frames of the last word; no end card. VARIABLE: words in the frame-0 caption (1-3); first caption length (5-19 frames); first cut frame (38-80, set by the sentence); first insert length (35-122 frames); panel state on frame 0 (entering 4, acting 11, settled 4) and its content (interface, scene, figure, photo, mark); first sentence length (11-22 words, ends 3.4-6.6 s); name reveal present in 10/19; CTA lead-in question present in 14/19 (absent in the earliest 3 and latest 2 clips), which moves the keyword from 10-18 to 28-70 frames after the cut; close-up length 66-138 frames; keyword width 613-856 px with letter count (3-6); promise wording (link 12, other 7).

## Open questions

- Exact font of the keyword and its quote glyphs (the closing mark looks straight, the opening curly): left to the type analyst; decide by rendering serif candidates over lastframe/ crops.
- Whether the frame-0 caption plate has an entrance animation on frame 0 (it is fully drawn on frame 0 in 19/19 here, so a pop would be invisible at the start; check later caption switches with the motion analyst's every-frame plate measurements).
- Whether a sound effect marks the first cut or the keyword cut-in (not measured here; the audio analyst's effect onsets against frames clip01@51 and clip01@1126 would decide).
- Is the lead-in question before "Comment" a dated change or a per-script choice? 5 direct vs 14 lead-in clips cannot separate the two; more clips after 2026-11-12 would.
- clip18 keyword glyph box could not be measured (it overlaps white print on the clothing); its first frame comes from the template measure (1135) and was confirmed on the strip.

Needs an eye or an ear:

- Listen to the first second of each clip (frames 0-30) to confirm the voice starts on frame 0 with no breath, music or effect before it (H_audio_edges.csv).
- Watch the first 2 seconds of clip02, clip03, clip07 and clip19 at full speed to confirm the "mid-entrance on frame 0" reading (hook_sheets/).
- Watch the keyword cut-in on clip01@1120-1135 and clip13@965-975 at full speed to confirm there is no 1-2 frame scale or opacity ramp that the template measure could miss (H_keyword_entrance_strips.jpg).
- Check the quote marks around the keyword on lastframe/clip01@1196.jpg: opening curly, closing straight (by eye).
- Listen to the last 3 seconds of each clip to confirm the video cuts on the last word with no tail effect or music sting (H_audio_edges.csv tail_after_med_minus20_frames).
- Read the caption wording at the keyword frame on H_keyword_entrance_strips.jpg ("Comment <keyword>" vs "Comment" then the keyword group) to confirm the 10/9 split.
