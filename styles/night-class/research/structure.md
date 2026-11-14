# Structure

Measured on all 32 in-style clips (2026-10-10 to 2026-11-11; 24 dark_teaching_graphics, 7 mixed_light_dark_teaching, 1 light_teaching_graphics): 2880.6 s, 70,005 frames, every frame at the clip's native rate (23.976/24/25/30 fps), area-downscaled to 270x480 after a checked BT.709 limited-to-full decode. Each frame was classified into six full-frame modes by measured edges, not by eye: panel with dark field (PD), panel with light field (PL), full-height presenter (F), full-screen graphic without panel (GD/GL) and full-screen non-presenter footage (B). A 160-frame random audit matched by eye 160/160. Speech structure comes from the faster-whisper word timings (10,841 words, 622 ASR sentences), checked against caption change frames (median offset +0.7 frames, IQR -1.5..+2.4).

The grammar is a two-state alternation: panel mode holds 68.3% of runtime (dark 61.9%, light 6.4%) and full-height cut-ins 29.8% (per clip median 0.29, p10-p90 0.25-0.37). Clips switch between the two 10.25 times per minute (median; 6.0-20.65), always by a hard cut (499/502 single-frame flips), on a word onset (median offset +0.08 frames; 91% within 3 frames). Cut-ins last a median 3.08 s (75.5 frames; p10 1.38 s, p90 6.03 s, 0.54-9.8 s, n=252) and cover one or two sentences; panel runs between them last 6.76 s median. 61% of switches fall on a sentence start, 10% on a clause start; 52% of sentence boundaries carry a switch versus 3% of other word starts. Rehook/contrast sentences go full-height 74% of the time, step headers stay on the panel 89%. Every clip opens on the panel with speech at 0.00 s and cuts to full-height first (32/32, median 4.69 s, usually at sentence 2), and ends 0.21 s after the last word (max 0.42 s) on a 'comment <keyword>' sentence (27/32 last sentence). Pauses are cut to 0.35 s or less.

Over time the pacing is stable (G1 10-10..10-23, 15 clips vs G2 10-24..11-11, 17 clips: full share 0.28 vs 0.30, switches/min 10.26 vs 10.25, cut-in median 2.94 vs 3.16 s). What changed: the light field appears in 8/17 G2 clips (3/15 G1, two of them under 3%), full-screen graphics without a panel appear only in two G2 clips (11-04, 11-05), G2 clips end on the full-height presenter 10/17 times (G1 1/15) with a longer cta, and within-run jump cuts and hard graphic swaps halve (2.42 to 1.07 per minute; 6.17 to 2.55 per panel-minute). Nothing was listened to or watched in playback; jump-cut and graphic-beat counts are detector-based and partly audited by eye. Not done: footage continuity across cut-ins (hidden jump cuts), graphic element identities, caption grouping, title templates (only a red-bar proxy), presenter scale per cut-in, forced alignment of the transcripts, and the 8 out-of-style podcast clips.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [S01] Use two main modes: panel (graphic field over the presenter panel) for about 68% of runtime and full-height presenter for about 30%; full-screen graphics and B-roll are rare options (<2%).

- Values: Runtime share n=32 clips, 2880.6 s: PD 61.85%, PL 6.43%, F 29.79%, GD 0.59%, GL 1.00%, B 0.35%. Clips using: PD 31, PL 11, F 32, GD/GL 2, B 2. Presenter visible (PD+PL+F) 98.06%.
- Evidence: 70,005 frames;, (160/160 correct by eye)
- Confidence: high

### [S02] Target a full-height share of 0.30 of each video's runtime, inside 0.25-0.37.

- Values: Per clip F share median 0.29, p10 0.25, p90 0.37, min 0.16 (clip02), max 0.42 (clip33). G1 median 0.28 (n=15), G2 0.30 (n=17).
- Evidence: n=32; (share_F)
- Confidence: high

### [S03] Switch between panel and full-height about 10 times per minute (7-14).

- Values: Switches per minute median 10.25, p10 7.25, p90 13.96, min 6.0, max 20.65; per clip median 15.5 (4-28); 502 switches total: P->F 240, F->P 230, F<->G 20, P<->G 4, B 8.
- Evidence: n=32 clips, 502 switches
- Confidence: high
- Verified, confirmed: All-32 (48.0 min): panel runs n=265, median 6.34 s (156 frames at clip rate; interior runs 6.63 s, mean 7.42); full runs n=254, median 3.08 s (75 frames; mean 3.40); other (full-screen b-roll/graphic, clips 02,33,34,36) n=15, median 3.0 s, 1.8 % of time. 502 switches = 10.46 per minute pooled, clip median 10.25 (range 6.0-20.7); panel<->full only 9.83 per minute. G2 (25.8 min): panel median 6.25 s (150 frames), full 3.25 s (79 frames), 10.69 switches per minute pooled, clip median 10.25 (7.1-20.7). Switches: 96.6 % have frame t-1 = old layout (mix < 0.05) and a one-frame change 58x larger than the previous frame difference. No cross-fade or slide between layouts was found. The lower mix values (F>P) come from field graphics animating in right after the cut. Confirmed. Rates can differ slightly by definition: counting only panel<->full gives 9.8 per minute, and including b-roll switches gives 10.5. Clip33 (20.7 per minute) is inflated by phone-mockup graphics that flip between layout classes.,.

### [S04] Make each full-height cut-in 1.4-6.0 s long (median 3.1 s); never shorter than 0.54 s or longer than 9.8 s.

- Values: n=252 cut-ins: median 3.085 s / 75.5 frames, p10 1.38 s / 33 frames, p90 6.03 s / 147 frames, min 0.54 s / 13 frames (clip04@1401-1413), max 9.80 s / 235 frames. Words per cut-in median 13 (p10 5, p90 24). 11 cut-ins under 1 s, all 2-5 word contrast phrases ('here's the best part', 'here's the hack').
- Evidence: (mode F)
- Confidence: high
- Verified, confirmed: All-32 (48.0 min): panel runs n=265, median 6.34 s (156 frames at clip rate; interior runs 6.63 s, mean 7.42); full runs n=254, median 3.08 s (75 frames; mean 3.40); other (full-screen b-roll/graphic, clips 02,33,34,36) n=15, median 3.0 s, 1.8 % of time. 502 switches = 10.46 per minute pooled, clip median 10.25 (range 6.0-20.7); panel<->full only 9.83 per minute. G2 (25.8 min): panel median 6.25 s (150 frames), full 3.25 s (79 frames), 10.69 switches per minute pooled, clip median 10.25 (7.1-20.7). Switches: 96.6 % have frame t-1 = old layout (mix < 0.05) and a one-frame change 58x larger than the previous frame difference. No cross-fade or slide between layouts was found. The lower mix values (F>P) come from field graphics animating in right after the cut. Confirmed. Rates can differ slightly by definition: counting only panel<->full gives 9.8 per minute, and including b-roll switches gives 10.5. Clip33 (20.7 per minute) is inflated by phone-mockup graphics that flip between layout classes.,.

### [S05] Hold the panel between two cut-ins for about 6.8 s (2.9-14.1 s); start a cut-in about every 10 s.

- Values: Panel runs between two F runs n=207: median 6.76 s, p10 2.88, p90 14.11, min 1.32. All panel runs n=266: median 6.33 s, max 29.46 s. Interval between consecutive cut-in starts n=220: median 9.86 s, p10 5.33, p90 18.4, min 2.5, max 35.45.
- Confidence: high
- Verified, confirmed: All-32 (48.0 min): panel runs n=265, median 6.34 s (156 frames at clip rate; interior runs 6.63 s, mean 7.42); full runs n=254, median 3.08 s (75 frames; mean 3.40); other (full-screen b-roll/graphic, clips 02,33,34,36) n=15, median 3.0 s, 1.8 % of time. 502 switches = 10.46 per minute pooled, clip median 10.25 (range 6.0-20.7); panel<->full only 9.83 per minute. G2 (25.8 min): panel median 6.25 s (150 frames), full 3.25 s (79 frames), 10.69 switches per minute pooled, clip median 10.25 (7.1-20.7). Switches: 96.6 % have frame t-1 = old layout (mix < 0.05) and a one-frame change 58x larger than the previous frame difference. No cross-fade or slide between layouts was found. The lower mix values (F>P) come from field graphics animating in right after the cut. Confirmed. Rates can differ slightly by definition: counting only panel<->full gives 9.8 per minute, and including b-roll switches gives 10.5. Clip33 (20.7 per minute) is inflated by phone-mockup graphics that flip between layout classes.,.

### [S06] Change mode with a hard cut on one frame; no dissolve, push, scale or reflow between panel and full-height.

- Values: 499 of 502 switches flip in a single frame with no intermediate frame (3 have 1-2 flicker frames); whole-frame grey difference at the switch median 39.5 (p10 33.9) vs 2.0 on neighbouring frames, ratio > 3 in 99.2%.
- Evidence: n=502; (clip01@124-125 PD->F, clip01@208-209 F->PD)
- Confidence: high

### [S07] Put every mode switch on the first frame of a word onset (offset 0, tolerance +-3 frames).

- Values: Switch frame minus nearest ASR word start: median +0.08 frames, p10 -1.72, p90 +2.32, min -5.4, max +7.0; 91.4% within 3 frames; 6.6% fall more than 3 frames inside a word (ASR error included). ASR itself sits median 0.68 frames before caption changes (IQR -1.5..+2.4, n=10,841 words).
- Evidence: n=502 switches
- Confidence: high

### [S08] Prefer sentence starts for switches: about 60% on a sentence start, 10% on a clause start, the rest on other word starts (often 'And', 'This', 'Now', 'If').

- Values: Switches at a sentence start 60.96%, at a clause start 9.76%, elsewhere 29.3% (n=502). Sentence boundaries with a switch within 3 frames 306/590 (51.9%); with any visual change (switch, jump cut, graphic swap) 429/590 (72.7%); clause boundaries 58/491 (11.8%); other word starts 292/9728 (3.0%). First word into F: and 28, this 24, now 17, the 16, if 15 (n=252); into panel: now 20, the 14, comment 11 (n=234).
- Evidence: ASR sentence splits (run-ons merge some sentences)
- Confidence: medium (ASR punctuation decides sentence boundaries; unverified transcripts)

### [S09] Let a cut-in cover one sentence (60%) or two (35%), starting at a sentence start and ending at a sentence end when possible.

- Values: Of 252 cut-ins: start at a sentence start 59.5%, end at a sentence end 64.3%; sentences touched 1: 152, 2: 87, 3: 13.
- Evidence: (starts_at_sentence, ends_at_sentence, sentences_touched)
- Confidence: medium (ASR sentence boundaries)

### [S10] Choose cut-in sentences by beat: rehook/contrast lines go full-height, step and item headers stay on the panel, explanation goes full-height about one time in three.

- Values: Share of sentences mostly in F, by beat: rehook 0.74 (n=31, 20 clips), name 0.44 (n=18), payoff 0.43 (n=14), pitch 0.39 (n=46), explain 0.32 (n=309), cta 0.23 (n=30), proof 0.21 (n=33), example 0.17 (n=35), item 0.11 (n=74), hook 0.09 (n=32). A switch lands on the beat's first word for rehook 84%, payoff 64%, pitch 63%, item 55%, explain 46%. Sentence length does not predict F (mostly-F 0.25-0.33 across 1-5 to 25+ words).
- Evidence: beats.stats, (bottom band)
- Confidence: medium (beats hand-coded on ASR sentences by one analyst)

### [S11] Order beats as hook, then name or proof, then 2-4 items each with explanation/example and a rehook, then payoff, pitch and the cta.

- Values: Runtime share: explain 49.9%, item 10.2%, pitch 9.6%, proof 6.3%, example 5.9%, hook 5.6%, cta 4.4%, rehook 3.7%, payoff 2.8%, name 1.5%. Median position (fraction of duration): hook 0, name 0.04, proof 0.25, item 0.38, rehook 0.36, explain 0.39, example 0.40, payoff 0.81, pitch 0.86, cta 0.96. Items per clip: 3 (10 clips), 4 (7), 2 (3), 0 (10 non-list videos), 9 (1). Name sentence at 3.2-5.1 s in 13 of 15 clips that name the method. Commonest openings: hook>name>body>item 8, hook>body>rehook>body 4.
- Evidence: beats
- Confidence: medium (hand coding on ASR)

### [S12] Open on the panel with speech on frame 0, then cut to full-height at the start of sentence 2 (else sentence 3), not earlier than 1.7 s.

- Values: Frame 0 mode: PD 25, PL 7, F 0 (n=32). First word at 0.00 s in 32/32. First switch goes to F in 32/32, at median 4.69 s / 112.5 frames (p10 1.94 s, p90 12.33 s, min 1.71 s, max 23.36 s). First sentence ends median 3.86 s. First switch at sentence index 1 in 17 clips, 2 in 7, inside sentence 0 in 4, later in 4.
- Evidence: (frame 0, switch-1, switch, last frame of every clip), opening
- Confidence: high

### [S13] Show the title lockup only in panel mode: never over full-height shots and never on frame 0; it arrives within the first second.

- Values: Red title bar (>= 200 saturated-red px in y 40-319): 0 of 20,851 full-height frames; 0 of 32 frame-0s; first appearance median 0.84 s (n=30; p10 0.08 s; 2 clips never). Share of panel frames with the bar: median 0.28, p10 0.04, p90 0.94 (0-0.98).
- Evidence: title
- Confidence: medium (red-pixel proxy; titles without a red bar are missed and late red graphics inflate first-appearance p90 = 38 s)

### [S14] End on the last word: cut the file 0.21 s (about 5 frames) after the last word ends, with no end card or hold.

- Values: Tail after last ASR word end: median 0.21 s / 5.1 frames, p10 0.10 s, p90 0.32 s, max 0.42 s / 10 frames (n=32). Last mode PD 19, F 11, PL 2. Last run median 4.04 s (1.0-17.5).
- Evidence: (tail_after_last_word_s)
- Confidence: high
- Verified, confirmed: Voice onset (voice band >= p95-30 dB): G2 median 0.015 s (0.005-0.070 s = 0.12-1.67 frames), all 0.015 s (0-0.070). Acoustic tail = audio end minus last voice-band activity: at -30 dB G2 0.036 s (0.001-0.133), all 0.039 s (0.001-0.174); at -25 dB all 0.076 s; at -20 dB all 0.129 s. File end minus last ASR word end: audio G2 0.228 s (0.03-0.39), all 0.195 s (0.027-0.39); video G2 0.237 s, all 0.213 s. The ASR's last word end is early: acoustic last voice minus ASR end median 0.146 s all (-0.024..0.379), 0.181 s G2. Audio minus video length median -0.017 s (-0.060..+0.048). Bed at the very end (clips where bed A is still on): gain stays 0.8-1.0 into the last 0.1-0.2 s in clip19, 24, 39; clip01 drops to 0 in the last 0.2 s; clip36 falls ~6 dB over the last 1 s. Both tail numbers hold; they differ by reference point. A05's 0.07 s counts from the last voiced sound (my -25 dB value is 0.076 s; -30 dB gives 0.04 s). S14's 0.21 s counts from the ASR word end, which is not forced-aligned and ends the last word ~0.15 s early: 0.21 ~ 0.06 + 0.15. A builder should cut the file 0.05-0.08 s (about 1-2 frames) after the last voiced sound, or about 0.2 s after an ASR word end if only ASR timings are available. 'No fade' holds in 3 of 5 measurable clips; one stops ~0.2 s early and one dips ~6 dB in the last second.,.

### [S15] Make the 'comment <keyword>' sentence the last sentence; in the current generation speak it on a full-height shot or a panel with the comment card.

- Values: cta sentence found in 29/32 and last in 27/32; starts median 2.1 s before the end (p10 1.73, p90 9.6, 1.61-12.22). G1 (n=15): 14 with cta, 13 fully on panel, cta-to-end median 1.90 s, ends on F 1/15. G2 (n=17): 15 with cta, 2 fully on panel, cta-to-end median 7.94 s, ends on F 10/17. No cta: clip15, clip30, clip35.
- Evidence: ending; (white beat band at the end)
- Confidence: medium (placement holds in 27/32; the G2 full-height cta rests on 17 clips)

### [S16] Cut every pause in the speech to 0.35 s or less; sentence gaps are about 0.14 s.

- Values: Longest audio pause per clip (10 ms RMS below clip p90 - 20 dB, 4 kHz low-pass): median 0.18 s, p10 0.12, p90 0.29, max 0.35 s; pauses >= 0.2 s per clip median 0, max 6. Longest ASR gap per clip median 0.30 s (0.22-0.46). Median ASR sentence gap 0.14 s (0.09-0.23).
- Evidence: n=32
- Confidence: medium (audio envelope without listening; HE-AAC; music bed may raise the floor)
- Verified, confirmed: Pause = mid voice band (300-4000 Hz, excludes the bed) 10 ms RMS below (clip p95 - X dB), runs inside first..last word. X=30 dB: longest per clip G2 median 0.165 s (n=17, 0.110-0.254), all-32 0.168 s (0.085-0.254); no gap >= 0.30 s in any clip; median gap (gaps >= 30 ms) 0.050 s. X=25: G2 0.254 s (0.125-0.389), all 0.244 s (0.125-0.389); 5/32 clips (4 G2) have one or two gaps >= 0.30 s. X=20: G2 0.349 s (0.244-0.454), all 0.342 s; 21/32 clips have a gap >= 0.30 s; median gap 0.070 s. X=35: 0.10 s (0.05-0.17). ASR (faster-whisper, not forced-aligned): 90% of word gaps are 0; longest ASR gap per clip median 0.30 s (G2 0.22-0.36, all 0.22-0.46); sentence-end gap median 0.14 s (G2 and all; per-clip medians 0.09-0.23). Full mix never goes quiet: quietest 10 ms frame inside speech median -56 dBFS (bed and effects fill the gaps). Both claims describe the same edit; they differ by threshold. A04's 183/284 ms sits between my X=30 (168/254 ms) and X=25 (244/389 ms) values; S16's max 0.35 s matches X~20-25 dB or the ASR longest gap; S16's 0.14 s ASR sentence gap is confirmed. A04's 'median gap 75 ms' matches X=20 (70 ms); at X=30 the median gap is 50 ms. For pause-trimming the builder should use A04 with an explicit definition: detect silence as voice band >30 dB under the speech peak, keep normal gaps at 50-80 ms, cap any kept pause at ~0.18 s (never over 0.25 s), and never leave >= 0.30 s., (pause_X*),.

### [S17] Allow jump cuts inside a run only at sentence starts, about 1-2.4 per minute; other footage cuts sit under mode switches.

- Values: Within-run head-area diff ratio >= 4: 105 events (P 84, F 21), 75% at a sentence start, 94% within 3 frames of a word start (median offset 0.0 frames); audit 26/30 cut-like. Ratio 3-4: 131 events, ~45% cut-like. Estimate ~150 within-run jump cuts (105-236), ~3.1 per minute. 8 of 21 full-height cuts also reframe (background moves). Per minute (strong): G1 median 2.42, G2 1.07.
- Evidence: verified clip25@137-138, clip08@269-270, clip37@1113-1114, clip17@608-609, clip19@1893-1894, clip12@338-339, clip06@868-869
- Confidence: medium (detector plus partial eye audit; same-framing cuts with little motion are missed)
- Verified, open: Calibrated estimate, G2 (17.05 panel-min, 7.97 full-min): panel about 6.7 per minute, full about 2.8 per minute, overall about 5.5 per minute. All-32 (32.8 + 14.4 min): panel about 6.5, full about 2.4, overall about 5.3. Each is the loose detector rate times the precision judged by eye. Loose detector: G2 panel 14.5, full 4.0 per minute. Precision by eye: 0.46 in panel (n=23), 0.71 in full (n=7). Raw detector rates by threshold: default G2 panel 8.9 / full 2.5 / overall 6.8 per minute; strict G2 1.9 / 1.25 / 1.7 per minute (all-32 1.9). Sentence starts: 73 % of cuts confirmed by eye (8 of 11), against 10 % for rejected candidates and 10 % for random times. Detector shares: 36 % loose, 44 % default, 69 % strict. My best estimate agrees with P21's per-mode rates (6.7 vs 5.7 panel, 2.8 vs 2.6 full) and with S17's sentence-start share (73 % vs 75 %). It disagrees with S17's 3.1 per minute overall: my overall rate is 5.3-5.5. S17's 'strong ones' 1.07 per minute corresponds to a strict threshold, and my strict detector gives 1.7. The verdict stays open because precision comes from only 30 by-eye judgements, about a third of them unsure, and recall was not measured. A cut with almost no pose change is invisible to the detector, and to a viewer too. For a builder the useful rule is that jump cuts land on sentence starts. Evidence: (rows = candidates, tiles t-2, t-1, t, t+1),.

### [S18] In panel mode, change something in the graphic field about every 1.9 s, on a word onset.

- Values: Field motion beats + hard swaps: median 0.53 per panel-second (p10 0.44, p90 0.69; 0.28-0.76), n=1,065 events in 32 clips. Hard graphic swaps median 4.83 per panel-minute (p10 1.32, p90 15.43; 0-19.7); 83% within 3 frames of a word start (median +0.15 frames, n=221); 37% at a sentence start. The field is moving in 61.7% of panel frames (frame diff > 1 grey, n=47,583 panel frames).
- Confidence: medium (motion peaks are a detector, not a count of new elements; the graphics/motion analysts own the element list)
- Verified, confirmed (the other study's value): Offsets in frames at each clip's own rate, from the onset frame to the nearest transcript word start (ASR word timing). Hard graphic-to-graphic swaps (single-frame change inside the graphic layout): G2 n=42 in 14 clips, median -0.5 frame, |offset| median 1.28, 40 % within 1 frame, 71 % within 2, 88 % within 3. All 32 clips: n=114 in 27 clips, median 0.0, 53 % within 1, 88 % within 3. Cuts from presenter to graphic layout: G2 n=125 in 17 clips, median -0.13 frame, 57 % within 1, 93 % within 3; all n=235, median -0.16, 92 % within 3. Motion onsets (first changed frame of animated runs): G2 n=366 in 17 clips, median +0.30 frame, 40 % within 1, 82 % within 3; all n=724, median +0.28, 82 % within 3. Chance (random graphic-layout frames): 30 % within 1, 74 % within 3, |offset| median 1.76 frames. Nearest clause-initial word (first word, after punctuation, or after a >=0.25 s gap): swaps 50 % within 3 frames (G2), 53 % (all); motion onsets 40 %; cuts to graphic 75 %. S18 holds (88 % vs 83 %). Changes do sit on word starts (median offset -0.5 to +0.3 frame), but the 3-frame window is weak evidence because words are dense: 74 % of random frames also fall within 3 frames of a word start. The 1-frame rate (40-57 % vs 30 % chance) is the real signal. G03's median offset is reproduced (-0.13 to +0.3 frame), but 'first word of a clause' is not: only 50-53 % of swaps are within 3 frames of a clause-initial word. Word timings are ASR estimates, not forced alignment, so the 1-frame figures carry about +/-2 frames of timing error. Builder: start the change on the onset frame of the word it illustrates, with no lead or lag; a clause boundary is not required..

### [S19] Keep the overall visual change rate (switch, jump cut or graphic beat) near one event every 35 frames, with captions changing about 3 times per second on top.

- Values: Median interval between events per clip 35 frames (p10 26.6, p90 43.8; 25-56.5); 0.58 events/s (0.39-0.73). Caption changes 3.02/s (2.33-3.65); speech 3.78 words/s (3.39-4.07). With captions 3.63 events/s.
- Evidence: visual_change
- Confidence: medium (sum of detector counts)

### [S20] Change the field tone (dark to light or back) only across a full-height cut-in; a light panel run lasts about 5.3 s.

- Values: Light runs n=36: median 5.29 s, p10 1.62, p90 8.17, max 11.96. Light runs entered from F 23, from PD 3, from GL 2, from B 1; PL->PD direct 2. Direct dark<->light cuts 5 in 4 clips (clip03, clip26, clip27, clip34). Light used in 11 clips (8 of them G2).
- Evidence: runs.PL_entered_from; (white segments)
- Confidence: high (n=36 runs, 11 clips)
- Verified, confirmed: Counting the field wherever it is visible (panel frames plus full-screen flat graphics): 39 switches in all 32 clips (34 in G2), across 10 clips (03,15,19,24,26,27,33,34,36,37). 32 behind a full cut-in (26 panel-to-panel, 5 graphic-to-graphic in clip33, 1 behind full plus b-roll). 4 hard 1-frame cuts: clip03@987, clip27@2124, clip33@223, clip34 panel->graphic. 3 cross-fades: clip26@495-509, D->L, 14 frames at 25 fps = 0.56 s, linear; clip26@604-613, L->D, 9 frames = 0.36 s; clip34@20-31, L->D, 10-11 frames at 23.976 = 0.42-0.46 s, eased. Panel-only definition: 32 switches (G2 27): 26 behind full, 2 hard cuts, 3 cross-fades, 1 behind b-roll. Dark field = 16-21 tv (about 0-6 full range); light = 209-210 tv (about 225 full range). Confirmed within one event: 32 vs 33 of 39 behind a full cut-in, a few (4) hard cuts, and 3 cross-fades of 0.36, about 0.46 and 0.56 s. The total of 39 only appears when full-screen graphics in clip33 count as field; counting panel frames only gives 32. Evidence: (panel-only definition).

### [S21] Use full-screen graphics without the panel only as an optional variant, entered from and left to a full-height shot, up to 8 s per run.

- Values: Only clip33 (2026-11-04: 52.1% of its runtime) and clip34 (11-05: 11.2%); 13 runs, median 3.04 s, max 8.09 s; 20 of 24 transitions are F<->G. Corpus share 1.59%.
- Evidence: (clip34@1226-1358), rows clip33/clip34
- Confidence: low (2 clips, 2 consecutive days)

### [S22] Do not plan full-screen B-roll by default; it appears in 2 of 32 clips for 3.6-3.9 s runs.

- Values: clip02 frames 1717-1804 (3.67 s) and 1880-1973 (3.92 s), clip36 frames 271-357 (3.63 s); 0.35% of runtime. In clip02 the field also carries B-roll under a hidden panel edge (frames 935-982).
- Confidence: low (2 clips)

### [S23] Write videos of 55-125 s (median 88 s) at about 3.8 spoken words per second.

- Values: Duration median 88.34 s, p10 55.91, p90 123.97, min 33.21, max 134.16 (n=32). Words per second median 3.78 (3.39-4.07). G1 median 87.6 s, G2 97.5 s.
- Confidence: high

### [S24] Do not let any scene go without the presenter for more than about 8 s; the presenter is on screen (panel or full-height) 98% of the time.

- Values: Presenter visible 98.06% of runtime; longest presenter-free run 8.09 s (full-screen graphic, clip33); B-roll runs <= 3.92 s.
- Evidence: modes.presenter_visible_share
- Confidence: high

### [S25] Target generation: build to G2 (2026-10-24..11-11): same pacing as G1, light field available, cta on full-height allowed, fewer within-run jump cuts and fewer hard graphic swaps.

- Values: G1 (n=15) vs G2 (n=17): F share 0.28 vs 0.30; switches/min 10.26 vs 10.25; cut-in median of medians 2.94 vs 3.16 s; clips with light field 3 vs 8; full-screen graphic clips 0 vs 2; end on F 1/15 vs 10/17; strong jump cuts/min 2.42 vs 1.07; hard graphic swaps per panel-min 6.17 vs 2.55; title-bar share of panel frames 0.27 vs 0.30.
- Evidence: generations
- Confidence: medium (two halves of 15 and 17 clips; light/dark choice may follow topic, not date)

### [S26] Lay out a new video with the pseudo-code in build_spec.pseudoCode (12 steps: trim, split sentences longer than 4.5 s at clause starts, label beats, open on panel, first cut-in at sentence 2, score cut-ins by beat, hold 1-2 sentences, check full share and switch rate, hard cuts on word onsets, graphic beats every ~1.9 s, tone changes behind cut-ins, jump cuts at sentence starts, cta last).

- Values: Constants from S02-S20; the step-5 scoring weights are a synthesis. Run on all 32 corpus transcripts it gives full share median 0.283 (measured 0.29), 10.73 switches/min (measured 10.25), cut-in median 3.04 s (measured 3.08 s); per-unit agreement with the real choice of cut-in units 0.647 vs 0.759 for always-panel, so the rhythm is reproduced but not the exact sentence choice.
- Evidence: build_spec.pseudoCode, (n=32)
- Confidence: medium (synthesis checked against the corpus distributions only)

### [S27] Never: title over full-height, animated mode change, opening on full-height or on silence, a cut-in over 9.8 s, a hold after the last word over 0.42 s, a pause over 0.35 s.

- Values: 0/20,851 F frames with the title bar; 0/502 animated switches; 0/32 F openings; 0/32 speech-free openings; max cut-in 9.80 s (n=252); max tail 0.42 s (n=32); max audio pause 0.35 s (n=32).
- Evidence: never_observed
- Confidence: high

### [S28] Return from a cut-in to a changed panel: advance or replace the graphic (and often the title) while the presenter is full-height, never resume the frame that was left.

- Values: Field thumbnail difference between the last panel frame before a cut-in and the 12th frame after the return: median 27.4 grey (n=227 P-F-P returns) vs 19.2 for an equal span inside a panel run (n=176); differs by > 10 grey in 97.8% of returns vs 83.0% in-run, > 20 grey in 75.8% vs 44.3%. Example: clip01@209-214 a new title builds word by word on the first panel frames after the cut-in.
- Evidence: runs.return_from_cut_in
- Confidence: medium (thumbnail difference; the field moves inside runs too)

## Constant and variable

CONSTANT (32/32 clips): frame 0 is panel mode; speech starts at 0.00 s; the first mode switch goes to full-height; all panel/full switches are single-frame hard cuts on word onsets; the title bar never appears over full-height; the file ends 0.06-0.42 s after the last word; no pause longer than 0.35 s; panel and full-height alternate (every clip uses both, 2-14 cut-ins each). VARIABLE: full-height share 0.16-0.42 (driven by how many rehook/explain sentences the script has); switches/min 6.0-20.65 (highest in clip33 with full-screen graphics); cut-in length 0.54-9.8 s (short contrast phrases vs two-sentence explanations); first cut-in 1.71-23.36 s (long run-on first sentences push it later); light field 0-68% of a clip (topic-driven: light UI captures in clip25, clip37); cta length and mode (G1 short panel cta, G2 longer cta, often full-height); within-run jump cuts 0-9 per clip; hard graphic swaps 0-19.7 per panel-minute; full-screen graphics and B-roll in 2 clips each.

## Open questions

- Are footage jump cuts hidden under mode switches? Continuity across a cut-in was not measured (the panel and full-height framings differ). Deciding it needs a pose-matching pass on the panel frame before and after each F run.
- Graphic 'events' are motion peaks of the field difference, not a count of new elements; the graphics and motion analysts' element timelines decide the true new-element rate.
- Sentence-boundary shares depend on ASR punctuation (several run-on sentences of 30-60 words, e.g. clip17 s4, clip19 s10, clip28 s0). A forced-alignment transcript with checked punctuation would firm up S08-S11.
- Does the light field follow the date or the topic (light UI captures such as Claude screens in clip25/clip37)? A larger G2 sample or a topic-coded comparison would decide.
- Is the full-screen graphic mode (clip33, clip34) a new generation or a one-off? Clips after 2026-11-11 would decide.
- Title presence uses a red-pixel proxy; the hook/layout analysts' title templates should replace S13's share numbers.
- Beat labels are one analyst's hand coding; a second coder on would give agreement numbers.

## What a person must look at or listen to

- Watch clip01@120-215 with sound and confirm the panel->full and full->panel cuts land on the first frame of 'Most' and of the next sentence, ).
- Look at and and mark which pairs are real jump cuts (my count: 26/30 and ~11/24).
- Listen to the longest pauses listed in (longest_pause_at_s) to confirm they are trimmed silences and not breaths under a music bed.
- Check beat labels on 3-4 clips against the audio, especially rehook vs explain.
- Confirm the overrides: clip02 frames 935-982 are panel mode with B-roll in the field; clip02 1717-1804, 1880-1973 and clip36 271-357 are non-presenter footage ).
- Confirm the G2 endings: watch the last 10 s of clip24, clip26, clip29, clip33 and clip34 (cta spoken full-height) and of clip39, clip40 (cta on panel).
- Nothing was listened to and no playback was watched; every audio statement comes from a 10 ms RMS envelope of HE-AAC audio.
