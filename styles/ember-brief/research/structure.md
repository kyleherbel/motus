# Structure

Measured on all 11 in-style clips (clip29-clip39, 12,791 frames, 426.4 s, 1,854 transcript words). Every frame was decoded at 1080x1920 (VP9, BT.709 limited to full) and differenced against the previous one in 40 px blocks; bursts of change in the graphic zone became 296 timeline events (120 scene-level, 176 element), each checked on before/after sheets and typed by eye, then timed against transcript word onsets and, where the event does not touch the caption band, against caption changes measured on the video. Presenter cuts came from a head-zone jump detector plus phase correlation; pauses from the audio envelope; beats and sentence starts from reading the transcripts. Timelines are

Findings. There are two layout modes. Every clip starts and ends in split mode, has 1 or 2 full-mode runs (median 226 f) and spends a median 34.5 % of its time in full mode. The top zone is empty for 3 frames, the title builds on frames 3-17 as the voice starts, with no caption, and it is replaced on the first word of the second sentence (8 clips) or mid-hook (3). The graphic is replaced 9-14 times per clip (a scene lasts a median 99 f) and something changes every 32 f. Swaps start on a word onset within 2 frames (85 % within 2.5 f of a transcript onset, chance 65 %); 74 % of sentence starts get a new graphic, a median 4 f after the first word. Speech runs at 266 words per minute with no pause over 0.39 s. Eight clips are single-story (hook, name or source, what, proof or demo, how, benefit, recap, call to action) and three are numbered lists of 2-3 items under on-screen headings. Every clip ends on a call-to-action card that arrives 6 f after the last sentence starts and holds to the final frame, 3 f after the last word.

Corrected before delivery: a first draft gave swaps an 82 % lock to caption frames and gave images and state changes a word lock. A subset check showed that 34 of 73 swaps (and 33 of 176 elements) set off the caption detector themselves. The figures now rest on the 39 clean swaps and the transcript; the element lock survives only for badges, chips and numbers (S13, S14,).

Not done: no playback was watched and nothing was listened to; word times are machine-transcript estimates; event types, graphic kinds and beats are judgements (by eye or by reading), while every frame number is measured; changes smaller than about 2 blocks of 40x40 px may be missing; presenter cuts hidden under full mode cannot be counted.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [S01] Use two full-frame layout modes and start and end every video in split mode (graphic above, presenter panel below); full mode (graphic takes the height, presenter off screen) is for the body only.

- Values: Start mode split 11/11, end mode split 11/11. Split 66.8 % of all frames, full 33.2 % (4,249 of 12,791). Full share per clip: median 34.5 %, range 12.6-51.4 %. No third mode found: a per-frame wall-match feature is bimodal in 11/11 clips (split < 10, full > 20; 25 of 12,791 frames fall between, all in transitions).
- Evidence: n=11 clips, 12,791 frames classified one by one. clip29@0, clip29@1199, clip30@87-566 (longest full share).
- Confidence: high

### [S02] Plan 1 or 2 full-mode runs per video, which gives 3 or 5 mode runs in all.

- Values: 3 runs in 5 clips (clip29, 31, 33, 35, 36), 5 runs in 6 clips. Full run: median 226 f (7.5 s), p10 85, p90 475, range 65-500 (n=17). Split run: median 244 f, p10 112, p90 540, range 87-742 (n=28). First split run median 215 f (87-742); last split run median 312 f (122-661). Scenes per full run: median 2, range 1-4.
- Evidence: n=45 mode runs in 11 clips. Shortest full run clip32@130-194, longest clip36@247-746.
- Confidence: high

### [S03] Change mode at the start of a sentence: begin the transition about 1 frame before a word onset, within 12 frames after the sentence's first word; let it run about 12 frames.

- Values: 34 mode changes (17 to full, 17 to split). 28 of 34 start between -3.0 and +12.0 f from a sentence's first word (30 of 34 within -3..+14; median of those +4.2). Offset to the nearest word onset: median -1.2 f, mean -0.8, sd 1.9 (to full -1.0, to split -1.2). Active for median 12 f (p10 7, p90 19). Four exceptions sit mid-sentence: clip31@215 (-116 f), clip37@681 (-100), clip35@1025 (+56), clip33@564 (+80).
- Evidence: n=34 in 11 clips. clip29@114-125, clip29@539-546.
- Confidence: medium: word times are machine-transcript estimates (+-2 f)
- Verified, corrected: 12.0 animation steps = 10.0 output frames = 0.333 s from first to last movement (fitted duration 12.00 steps for exits and for returns; +-0.1). 1 % to 99 % takes 6.8 steps = 5.6 frames. A step is 1/36 s: the layout clock advances 6 steps every 5 output frames, with one double step per 5 frames (on n%5 = 2 in 11 and n%5 = 3 in 18 of 63 unambiguous cases; never on 0, 1, 4; clip30 on n%5 = 4). 181 steps were counted over 150 frames (1.207 per frame). Movement of 1 px or more is visible on 8 to 9 frames. Build value: 0.333 s (10 frames at 30 fps), sampled in real time.
- Verified, confirmed: the blur dissolve of the graphics, not the move. Laplacian energy of the graphics slot (rows 0-880) dips for a median 15 frames at 10 % of the dip depth (p10 10, p90 21) and 10.5 frames at 50 % (p10 8.5, p90 18.5), n=36 dips. The panel and caption move for 10 frames inside that window. Build value: graphics blur out and in over about 12 to 15 frames around a 10-frame move.

### [S04] Go to full mode when the graphic is a real page capture or a tall UI flow that needs the height; never during the hook, the recap or the call to action.

- Values: Full runs open on a light page capture 8/17, a rebuilt UI 7/17, the audio demo 1/17, an illustration 1/17. 9 of 17 full runs contain a capture. 11 of 16 light-capture scenes play in full mode; 21 of 32 UI scenes and 16 of 19 illustrations play in split. Full-mode share of each beat's time: demo 73 %, source 68 %, proof 64 %, name 55 %, item 47 %, benefit 28 %, how 22 %, what 18 %, limits 5 %, recap 2 %, hook 0 %, cta 0 %.
- Evidence: n=17 full runs, 120 scenes, 11 clips. clip29@114 (post capture), clip37@91 (docs page), clip34@511 (tall UI flow). modes.full_entries
- Confidence: medium: graphic kinds and beats were labelled by eye and by reading

### [S05] Open in split mode with the top zone empty for 3 frames, build the title on frames 3-17 as the voice starts, and show no caption while the title is on screen.

- Values: First change at frame 3 in 11/11 clips. Build lasts 15 f in 10 clips and 13 f in clip39 (three title lines). Speech starts on the audio at frame 3.0 (median; range 2.7-5.1), so title and voice start together; the transcript's frame 0 for the first word is the recogniser's default, not a measurement. 0 caption changes between frame 20 and the frame the title leaves, in 11/11. The first caption comes with the event that removes the title: by eye on two strips (clip39@48, clip29@118). It cannot be timed by the detector, because that event changes the caption band in all 11 clips (first clean caption change 9-90 f after the title leaves).
- Evidence: n=11. clip29@0-21, clip39@0-21., opening.captions and opening.speech_onset_frame_by_audio
- Confidence: high for frames 0-17 and for no caption under the title; the frame of the first caption is by eye on 2 clips

### [S06] Hold the title for the whole hook sentence and replace it on the first word of the second sentence.

- Values: 8 of 11 clips: title leaves a median +1.0 f from the second sentence's first word (range -3.0..+4.8). Title on screen 79-127 f in those 8 (median 89); all 11: median 84 f, range 44-127 (1.5-4.2 s). Hook sentence: median 14 words (8-16), median 98 f (81-127). The title is removed by a change to full mode (4 clips), a swap in split (6) or a clear-out (1).
- Evidence: n=11. clip34@93 (0.0 f), clip30@87 (-3.0), clip29@114 (+4.8).
- Confidence: high for the timing in 8 clips; see S07 for the other 3
- Verified, confirmed: First changed frame: clip29@114, clip30@87, clip31@82, clip32@130, clip33@68, clip34@93, clip35@82, clip36@72, clip37@91, clip38@103, clip39@47 (same frames as both analysts). Against the transcript I reproduce both medians (+2.2 over 11, +1.0 over the 8 sentence cases). Against the audible onset of that word (speech resuming after the pause before it): +0.7, -1.8, +0.4, +1.4, +0.9, +1.9, -0.3, -1.3, +2.0 frames in 9 clips, median +0.7, range -1.8..+2.0; clip31 has no pause to measure; clip39 is ambiguous (the exit is 0.4 frames before "over"). Build value: start the exit on the first word of the next clause, 0 to +2 frames.

### [S07] If the second half of the hook names something that has its own graphic, replace the title on that phrase instead of waiting for the second sentence.

- Values: 3 of 11 clips: clip39@47, clip33@68, clip36@72, which is 51, 52 and 30 f before the second sentence. clip39 swaps to a counting figure; clip36 swaps to an illustration; clip33 clears the zone for 12 f (68-79) and brings a figure at 80.
- Evidence: n=3 clips (dates 11-04, 11-05, 11-07).
- Confidence: low: three clips, and the trigger is inferred by reading the hooks

### [S08] End in split mode on the call-to-action card: bring it about 6 frames after the first word of the call-to-action sentence, hold it to the last frame, and stop 3 frames after the last word. No outro.

- Values: Card minus the sentence's first word: median +5.6 f (1.2-11.8), n=11. Card on screen: median 75 f, range 51-128 (1.7-4.3 s). Call-to-action sentence: median 14 words (10-27), median 80 f (55-137). Tail after the last word: median 3.2 f (0.2-9.6). The card is always the last scene (11/11). Against the spoken word 'comment' the card sits -64..+6 f: in clip29, 30 and 35 the sentence opens with a condition and the card is up 46-64 f before the word.
- Evidence: n=11. clip31@785, clip30@1725, clip38@1273.
- Confidence: high
- Verified, not confirmed (the other claim holds): T0: clip29@1102, clip30@1725, clip31@785, clip32@962, clip33@978, clip34@1153, clip35@1145, clip36@1125, clip37@865, clip38@1273, clip39@770 (same as both analysts). Both claims reproduce from the transcript; they use two anchors. Against the AUDIBLE onset of the first content word: +2.3, +3.7, +1.7, 0.0, -0.5, -2.6, +2.1, +2.6, +1.7, -0.5, +1.5 frames, median +1.7, range -2.6..+3.7 (n=11). Against the audible start of the sentence including "So": about 10.2, 9, 5.6, 0, -0.5, 2.6, 2.1, 8.1, 11.8, 6.2, 1.5, median +5.6, range -0.5..+11.8: twice the spread. Build value: first changed frame = onset of the first content word of the call-to-action clause (after a leading "So"), +0 to +2 frames.
- Verified, confirmed: Held: the field stays within 1.1 luma levels (mean abs) of the last frame for the final 41-113 frames in 11/11; no fade, no end card. End of the last speech energy (6 dB over the bed) to the end of the video: median 2.7 frames, range 0.2-5.7 (n=11); to the end of the audio: median 118 ms, 22-240 ms. The audio stream is up to 52 ms longer than the video. Build value: end the file 3 frames (0.10 s) after the last word, allowed 0 to 6.

### [S09] Replace the graphic 9 to 14 times per video; a graphic stays about 3.3 seconds.

- Values: Scenes per clip: median 11, range 9-14. Scene length without hero and call to action: median 99 f, p10 64, p90 168, range 25-480 (n=97). Interval between scene-level changes: median 96 f, p10 64, p90 156 (n=109); per-clip medians 73-127 f. Scene-level events: 120 (11 titles, 34 mode changes, 73 swaps, 1 in, 1 out).
- Evidence: n=120 scenes in 11 clips. Longest scene clip30@87-566 (audio demo, 480 f)....
- Confidence: high

### [S10] Make something change in the graphic zone about once a second.

- Values: 296 change events in 426.4 s = 0.69 per second; per clip 0.50-0.95 (median 0.71). Interval between consecutive events: median 32 f, p10 13, p90 79 (n=285); per-clip medians 24-60 f (median 33.5). Minimum spacing 5 f. 120 scene-level + 176 element events; 224 of 296 change at least 20 blocks of 40x40 px in one frame. Captions, presenter motion and continuous motion (scrolls, playheads, count-ups: 8.6 % of frames) are not counted.
- Evidence: n=296 events, every frame differenced at native resolution. Densest clip31 (0.95/s), sparsest clip29 (0.50/s).
- Confidence: high

### [S11] Do not leave the graphic zone unchanged for more than about 110 frames; the title hold is the only place it gets that long.

- Values: Longest gap between two events per clip: median 108 f, range 79-127; the 127 is the title hold of clip32. Longest stretch with no event and no continuous motion: median 85 f, range 64-112 (n=11).
- Evidence: n=11. clip32@3-129 (title hold), clip29@426-538 (113 f between events, filled by a scrolling capture). change_rate.per_clip
- Confidence: high

### [S12] Inside a scene add 0 to 4 follow-up elements; bring the first at least 18 frames after the scene starts and keep later ones at least 10 frames apart.

- Values: Elements per scene: median 1, mean 1.8, p90 4, max 9 (n=97): none 21, one 30, two 21, three 13, four or more 12. First element after the scene start: median 29 f, p10 18, p90 59 (n=77). Element after the previous event: median 24 f, p10 10, p90 59 (n=176). Mean per scene by kind: UI 2.25, illustration 1.95, light capture 1.19, big number 1.22. Element kinds: state change 30, highlight 21, image 21, number 21, text 19, badge 14, row 12, outline 11, chip 8, toggle 6, hover 5, icon 5, heading-out 3. An element is active for median 9 f (p10 1, p90 14).
- Evidence: n=176 element events. clip29@188 (highlight), clip29@557 (count-up figure), clip38@1067-1138 (four badges).
- Confidence: high for counts and spacing; the kind names are by eye

### [S13] Start a graphic swap on a word onset, within 2 frames: the picture neither leads nor trails the word.

- Values: Two references, both against chance. Transcript word onsets (n=73 swaps): median +0.4 f, sd 1.9; 56 % within +-1.5 f and 85 % within +-2.5 f, against 43 % and 65 % for 4,400 random frames. Caption changes measured on the video, using only the 39 swaps whose changed area stays clear of the caption band: 67 % (26 of 39) start 0 or +1 f from a caption change and 92 % within +-2 f, against 31 % and 62 % for random frames. The other 34 swaps reach the caption band and set off the caption detector themselves (34 of 34 at 0/+1 f by construction); the pooled 82 % is therefore not evidence and is not used. Sign: change minus word, negative = picture first. A swap is then active for median 14 f (p10 9, p90 21).
- Evidence: n=73 swaps in 11 clips, 39 usable for the caption test., alignment.caption_band_check
- Confidence: medium: above chance on both references, but one is a +-2 f machine transcript and the other rests on 39 events, so 'within 2 frames' is the most that can be said

### [S14] Cue badges, chips and counting numbers on the word they illustrate; the other follow-up elements show no measurable lock to a word and can be spaced by the stagger in S12.

- Values: Elements whose changed area is clear of the caption band (n=143): 34 % at 0/+1 f of a caption change and 66 % within +-2 f, against 31 % and 62 % by chance; by transcript 46 % within +-1.5 f and 64 % within +-2.5 f, against 43 % and 65 %. As a group they sit at chance. Above chance on both references: badge (86 % within +-2 f of a caption change, 79 % within +-2.5 f of a word; n=14), chip (83 %, 83 %; n=6), number (82 %, 71 %; n=17). At chance or below on at least one: state (77 %, 65 %; n=26), image (86 %, 57 %; n=14), row (62 %, 50 %; n=8), text (42 %, 58 %; n=12), highlight (37 %, 58 %; n=19), outline (38 %, 50 %; n=8).
- Evidence: n=176 element events in 11 clips, 143 usable for the caption test. clip32@372 (badge), clip38@1067-1121 (badges), clip29@557 (number)., alignment.caption_band_check.elem_kind_clear_of_band
- Confidence: low: 6-26 events per kind and the kinds were named by eye

### [S15] Give three of every four sentence starts a new graphic, landing 0 to 10 frames after the sentence's first word; the other sentences keep the graphic and get an element.

- Values: 97 sentence starts (first sentence excluded). Scene-level change within -6..+12 f of the first word: 74.2 % (chance 17.4 %); within +-6 f: 53.6 % (chance 12.3 %). Any event within -6..+12 f: 82.5 % (chance 40.5 %). Scene change minus first word (n=72): median +4.1 f, p10 +0.3, p90 +9.6, so the picture follows the first word. The offsets spread from 0 to +12 f with the peak at +2 f, which fits a cue on the first, second or third word. A caption-based version of this figure is not given: it is distorted by events that reach the caption band (on the 17 clean cases, 5 sit at 0/+1 f). By beat: name 6/6, recap 7/7, cta 11/11, item 15/17, what 10/15, proof 6/9, benefit 5/9, demo 4/7, how 5/11. Of the 25 starts without a new graphic, 8 get an element.
- Evidence: n=97 sentence starts in 11 clips., alignment.sentence_starts
- Confidence: medium: sentence starts were placed by reading and timed by the machine transcript

### [S16] Keep a graphic above the presenter at all times in split mode; never show the presenter full-frame and never cut to footage.

- Values: Top zone empty only on frames 0-2 of each clip and on clip33@68-79 (12 f, between title and first figure): 45 of 12,791 frames. 0 scenes of full-frame presenter and 0 scenes of video b-roll in 120 scenes. Presenter visible 66.8 % of frames, always in the lower panel.
- Evidence: n=120 scenes, 11 clips. (kind 'empty' once)...
- Confidence: high for the counts; 'no b-roll' was judged by eye on the sheets

### [S17] Tighten the speech until no pause is longer than 0.4 s; a typical pause is 0.13 s.

- Values: Pauses of 100 ms or more in the presenter's speech: n=232 in 410 s (34 per minute), median 0.13 s, p90 0.23 s, max 0.39 s (clip30 at 40.93 s); 37 are >= 0.2 s and 7 are >= 0.3 s. Longest per clip: 0.25-0.39 s, median 0.27 s (8 f). Transcript gap before a sentence start: median 4.8 f, p90 9.0, max 13.2 (n=97).
- Evidence: n=11 clips, audio envelope 300-3400 Hz in 10 ms hops; the audio sample in clip30@112-557 (other voices, pauses to 0.49 s) is excluded.
- Confidence: medium: nothing was listened to; a quiet consonant can read as a short gap
- Verified, not confirmed (the other claim holds): Pauses of 100 ms or more, speech = any of 3 bands (150-1000, 1000-4000, 4000-9000 Hz) more than 6 dB over the bed: n=145 in 11 clips, median 132 ms, p90 201 ms, maximum 242 ms (clip34@634-641); longest per clip 188-242 ms; 16 of 200 ms or more, 0 of 250 ms or more; 3.5 per 10 s. At 3 dB: n=88, max 228 ms. At 10 dB: n=252 (the structure count), max 290 ms, 7 of 250 ms or more, still 0 of 300 ms or more. The 0.39 s pause of S17 (clip30 at 40.93 s) is not a pause: a fricative at 4-9 kHz (-33 dBFS, 20 dB over the bed) runs from 40.98 to 41.09 s; it is absent in clip35 and clip38 at the same music time, so it is the presenter, not the bed. The true gap there is 41.10-41.33 s, 230-240 ms. Error: -5 to -10 ms from the 10.7 ms analysis window. Build value: no pause longer than 250 ms; aim for 130-140 ms.

### [S18] Aim for about 266 words per minute in the finished cut.

- Values: Presenter words per minute: median 266.0, range 250.3-285.5 (n=11). List clips 250-257, single-story clips 264-286.
- Evidence: n=11 clips, 1,814 presenter words., clip_length
- Confidence: medium: word counts come from an unverified machine transcript

### [S19] Make the video 28 to 45 seconds long with 125 to 190 words in 7 to 13 sentences.

- Values: Seconds: median 39.5, range 28.5-61.8; 10 of 11 clips are 28.5-44.1 s and clip30 is 61.8 s because it plays a 16 s audio sample. Words: median 173, range 125-248 (presenter's own 125-208). Sentences: median 10 (7-13). A sentence: median 15 words, median 107 f (p10 64, p90 175).
- Evidence: n=11., clip_length and sentences
- Confidence: high

### [S20] Order the beats of a single-story video: hook, then name or source, then what it is with proof or a demo, then how to use it, then benefit or limits, an optional recap line, and the call to action.

- Values: 8 story clips. Clips with each beat (of 11) and its length where present: hook 11 (median 3.3 s, 9.1 % of runtime), name 6 (4.0 s), what 7 (7.5 s), source 2 (7.6 s), proof 5 (6.7 s), demo 4 (7.9 s), how 6 (7.9 s, mean position 0.69 of the runtime), benefit 7 (4.5 s), limits 1 (7.4 s), recap 7 (2.9 s), cta 11 (2.7 s, 7.7 %). 'How' sits in the second half and follows 'what' in 3 of 3 story clips that have both.
- Evidence: n=11 clips, 106 sentences labelled. Sequences in beats.sequences.
- Confidence: medium: beats were labelled by reading the transcripts

### [S21] Pick the graphic kind and the mode from the beat.

- Values: Share of each beat's time by graphic kind: hook: hero and title 85 %. name: UI 53 %, light capture 35 %. what: illustration 41 %, UI 34 %. source: light capture 43 %, before/after pair 25 %, person or logo card 23 %. proof: big number 31 %, dark text capture 20 %, illustration 17 %, light capture 15 %. demo: demo player 43 %, illustration 25 %, UI 18 %. how: UI 73 %, prompt card 17 % (78 % split). benefit: UI 68 %, illustration 29 %. item: light capture 30 %, illustration 30 %, UI 23 %, big number 12 %. recap: icon grid 38 %, illustration 21 %. cta: call-to-action card 93 %. Over all frames: UI 29.2 % (32 scenes), illustration 19.3 % (19), light capture 11.1 % (16), hero 7.3 %, call to action 7.1 %, big number 6.7 % (9), icon tiles 4.9 % (9).
- Evidence: n=120 scenes and 12,791 frames in 11 clips., scenes.by_kind
- Confidence: medium: both labels are judgements (kinds by eye, beats by reading)

### [S22] Before the call to action say one wrap-up line of 2.4 to 4.0 seconds, in split mode, over a count or summary graphic.

- Values: 7 of 11 clips have it: 72-120 f (median 87). 4 use a 'k of N' line with an icon grid or a figure (clip31, 34, 37: N=11; clip38: N=25). Split mode 98 % of its time. A new graphic lands on its first word in 7 of 7.
- Evidence: n=7 clips. clip31@705, clip34@1063, clip37@780, clip38@1202.
- Confidence: medium

### [S23] A list video has 2 or 3 numbered items that take 52 to 67 % of the runtime; the frame around them is hook, optional set-up, optional benefit, recap, call to action.

- Values: 3 of 11 clips are lists (clip32: 2 items, clip33: 3, clip38: 3); 8 are single-story. Item section by speech: median 245 f (8.2 s), range 132-363 (n=8). Item share of runtime: 51.8 %, 57.4 %, 66.7 %.
- Evidence: n=3 list clips, 8 items., clip33, clip38
- Confidence: medium: three clips

### [S24] Show the numbered section heading on the first word of the item's head sentence and keep it for the whole item, across mode changes.

- Values: Heading in minus head-sentence first word: median +1.9 f, range -3.6..+6.0 (n=8). Heading on screen: median 255 f, range 117-356. It survives a mode change in 4 of 8 items. It is replaced in the same event by the next heading in 3 cases, leaves 6-7 f before the next heading in 2 (clip33@749 then 756, clip38@978 then 984), and leaves with the recap or benefit scene in 3. Story clips have no headings (0 of 8).
- Evidence: n=8 items in 3 clips. clip32@130, clip33@272, clip38@312.
- Confidence: medium: three clips

### [S25] Open each list item on a capture card of the thing it names.

- Values: 6 of 8 items open on a light capture card, 2 on an illustration. The opening event is a change to full mode in 3, a change to split in 2 and a swap in 3.
- Evidence: n=8 items in 3 clips. clip32@130, clip32@442, clip33@272, clip33@480, clip38@312, clip38@984.
- Confidence: low: 8 items in 3 clips

### [S26] Treat list and single-story videos as the same edit with a different middle.

- Values: List (n=3) against story (n=8), medians with ranges: seconds 35.6 (34.5-44.1) / 39.8 (28.5-61.8); words per minute 255.5 (250-257) / 269.4 (264-286); scenes 12 (10-14) / 10 (9-14); events per second 0.75 (0.52-0.90) / 0.69 (0.50-0.95); full share 0.18 (0.13-0.49) / 0.35 (0.14-0.51); title hold 100 f (65-127) / 81.5 f (44-111). Only lists have headings and 'item' beats; only story clips have name, source, proof, demo and how beats.
- Evidence: n=11., groups
- Confidence: medium: three list clips; the ranges overlap on every timing metric

### [S27] Jump-cut the presenter at sentence or clause boundaries, about 5 frames before the next graphic change; a visible take lasts about 4 seconds.

- Values: 39 strong visible jump cuts in 8,205 presenter-visible frames: one per 210 f (7.0 s); per clip median 3, range 1-6. 22 of 39 lie within +-6 f of a sentence start. 21 of 39 fall 3-9 f before the nearest graphic event (median -4 f). Visible take: median 113 f, p10 12, p90 239 (n=67, mode changes also end a take). Of 63 sentence starts with the presenter on screen, 17 carry a strong cut within -8..+3 f. 25 more candidates with a small jump are listed but not counted.
- Evidence: n=39 in 11 clips; head-zone jump >= 9 levels and >= 3x its neighbours, each checked on a difference image. clip30@688, clip32@721, clip39@393.
- Confidence: medium: small jump cuts cannot be told from fast movement, and cuts hidden under full mode cannot be seen

### [S28] Expect split-mode graphics to update on 3 frames in every 5; full-mode graphics update on every frame. A change cued in split mode therefore lands on a frame whose index mod 5 is 0, 2 or 3.

- Values: Inside split-mode events of 8 frames or more (1,813 frames), 34.4 % of frames repeat the previous graphic frame, 605 of 624 repeats at index mod 5 = 1 or 4. In full mode 1.6 % repeat (383 frames). 167 of 176 split-mode event onsets (95 %) sit on phases 0, 2, 3. The presenter layer repeats on its own rhythm: a repeated frame every 5 frames in 517 of 916 repeat-to-repeat distances, every 10 in 157, every 15 in 66.
- Evidence: n=11 clips, every frame. clip29@3-17 (title build repeats at 4, 6, 9, 14, 16)., frame_repeats and presenter_cuts.presenter_repeat_distance_hist
- Confidence: medium: measured in the delivered files, cause unknown (render or platform encode); a builder can render every frame
- Verified, confirmed: the picture advances on 6 of every 10 frames: frames with n%10 = 1, 4, 6, 9 show the state of the frame before. That is an 18 fps stream: state index = floor(0.6*n + 0.3). Test on pixels that change between frame n-1 and n+1: on residues 1, 4, 6, 9 the share still showing the old state is 1.00, on 0, 3, 5, 8 the share already showing the new state is 1.00, on 2 and 7 it is about half (190 to 300 frames per residue, 5 clips, same result for the field and for the graphics slot). Residues 4, 6, 9 are bit-exact repeats (relative changed-pixel count 0.01, 0.01, 0.00 over 623 decades); residue 1 repeats the state but 14 % as many pixels change slightly as on an update. clip30 is shifted by one frame (exact repeats on 3, 6, 8). Build value: render every frame; to imitate the reference hold the graphics layer on frames with n%10 in {1,4,6,9}.
- Verified, confirmed: every frame. Share of frames with almost no change is 0.02 to 0.08 on every residue (135 decades); the field plate repeats exactly on 4 to 19 % of frames with no residue pattern. Build value: every frame.
- Verified, confirmed: a repeated footage frame every 5 frames where repeats occur: 52 % of 748 repeat-to-repeat distances are 5, 21 % are 10, 8 % are 15. Detected repeats are 10 % of SPLIT frames (6 to 14 % per clip). The phase (n%5) changes from take to take. Motion after a repeat is not doubled (1.14 times the local median against 1.17 before), so it is a hold of slower material, not a dropped frame. Build value: no rule needed; play the user's footage at its own rate.
- Verified, corrected: an artefact of rendering or conforming. Reasons: (1) the holds are tied to the output frame number from frame 0, the same in 10 of 11 clips, not to the start of any animation; (2) animation time is real time, sampled: the field loop and the mode change start at arbitrary sub-step phases and keep their real-time speed; (3) the rate changes with the presence of the presenter video (18 fps with it, every frame without it), not with the graphic; (4) in the same frames the layout move runs at 36 steps per second and the graphics at 18, both as floor(rate/30 * (n + 0.5)), which is what nearest-frame sampling of a faster and a slower stream produces; (5) one repeat in ten is not bit-exact, which points to an intermediate encode. Build value: do not build the cadence into the style; render graphics, captions and layout on every frame.

### [S29] Use one structure for the whole period: nothing structural changed between 2026-11-02 and 2026-11-07.

- Values: Early (6 clips, 11-02 to 11-04) against late (5 clips, 11-05 to 11-07), medians: seconds 37.8 / 39.5; words per minute 266.6 / 265.2; scenes 10.5 / 11; events per second 0.73 / 0.66; mode runs 4 / 5; full share 0.26 / 0.40 (ranges 0.13-0.51 and 0.22-0.49 overlap); call-to-action card 82.5 / 60 f (ranges overlap). Singular points: clip39 (11-07) has the only 13-frame title build and the earliest title replacement (frame 47); the three mid-hook replacements are dated 11-04, 11-05, 11-07; lists are dated 11-03, 11-04, 11-06.
- Evidence: n=11.
- Confidence: medium: six days and 11 clips cannot show a slow drift

### [S30] Lay out a new video from its transcript with the procedure in build_spec.pseudo_code: tighten, segment into beats, title on frames 3-17, one new graphic per sentence start on a word onset, elements between, 1-2 full runs on sentence starts, call-to-action card on the last sentence.

- Values: Constants used: title build 3-17; title out = second sentence first word +1 f; scene on a word onset (within 2 f); new graphic on 74 % of sentence starts, median +4 f after the first word; scene 64-168 f (median 99); first element >= 18 f into a scene; any change every 32 f (13-79); no still stretch over about 110 f; full runs 65-500 f starting 1 f before a word; call-to-action card = sentence start + 6 f, held 51-128 f; end = last word + 3 f.
- Evidence: Built from S01-S27 (n=11 clips, 296 events, 97 sentence starts). build_spec
- Confidence: medium: a synthesis; not yet tested on a new transcript

## Constant and variable

CONSTANT (11 of 11 clips): starts in split mode and ends in split mode; top zone empty on frames 0-2; first change on frame 3; no caption while the title is up; speech starts on frame 3 (2.7-5.1 by audio) with the title build; at least one full-mode run; a graphic above the presenter at all times; the call-to-action card is the last scene, arrives 1-12 f after its sentence starts and holds to the last frame; the clip ends within 10 f of the last word; no outro, no full-frame presenter. Title build is 15 f in 10 clips (13 f in clip39).

VARIABLE: clip length 28.5-61.8 s and 125-248 words (content); 1 or 2 full runs and 13-51 % full share (how many page captures and tall UI flows the story has); title hold 44-127 f (hook length; mid-hook replacement in 3 clips); call-to-action card 51-128 f (length of the last sentence); scenes 9-14 and 0.50-0.95 events per second (highest in UI walk-throughs, clip31 and clip33); elements per scene 0-9 (UI scenes carry most); beats present and their order in the middle; numbered headings only in the 3 list clips; visible presenter cuts 1-6 per clip. No change over the six days.

## Open questions

- Are graphic cues set from the same word timestamps as the captions? Swaps sit on a word onset more often than chance (67 % of 39 clean swaps at 0/+1 f of a caption change; 85 % of 73 within 2.5 f of a transcript onset), but neither reference can show an exact lock. A forced alignment of the audio, or the editor's project file, would settle it and give the true lead or lag.
- Why do split-mode graphics update on only 3 frames in 5 while full-mode graphics update on every frame, and why does the presenter repeat a frame every 5? Render pipeline or platform encode. The motion and presenter analysts' data, or an original export, would decide; until then onset frames in split mode carry +-1 frame.
- What decides 1 or 2 full runs and the moment to return to the presenter? 17 runs are too few to separate 'this capture needs the height' from 'time to vary the layout'.
- What triggers the mid-hook title replacement (clip33, clip36, clip39)? Three cases; the reading 'the hook's second half names a thing with its own graphic' needs more clips.
- How many presenter cuts are hidden under full mode, and are the 25 small-jump candidates real cuts? The raw footage or an audio splice analysis would tell.
- Is the speech time-compressed (266 words per minute) or only tightly cut? That is for the audio analyst; structure only measured the result.
- Are highlights and outlines cued to a word at all? Here they sit at or below chance (37 % and 38 % within 2 f of a caption change, n=19 and n=8), which may only mean a wipe-on is detected late. The per-frame highlight geometry from the graphics or motion study would tell.

## Needs an eye or an ear

- Skim...: each event shows the frame before and after with its type and kind. The types (swap or element) and graphic kinds were assigned by eye.
- Watch the 39 strong presenter cuts in and (frame t-1, frame t, difference) and in playback; confirm they are jump cuts, and judge the 25 'soft' candidates listed
- Listen at the longest pauses in (clip30 at 40.93 s, 0.39 s; clip32 at 3.94 s, 0.38 s; clip34 at 8.98 s, 0.36 s) and confirm they are silences; listen for whether the voice is sped up.
- Read and against the videos: sentence starts in unpunctuated transcript stretches (clip30, 32, 33, 34, 35) and all beat labels are judgements.
- Play a split-mode section (for example clip29 frames 539-1199) and a full-mode section (clip29 frames 114-538) and say whether the split-mode graphics look stepped; decide whether a builder should copy the 3-in-5 cadence.
- Check clip30 frames 87-566: an audio sample with other voices, no presenter captions, transcript lines in the graphic. Confirm this is a one-off 'demo' treatment before building it.
- Check the four mid-sentence mode changes (clip31@215, clip33@564, clip35@1025, clip37@681) in playback: deliberate, or tied to a word the transcript mis-timed.
