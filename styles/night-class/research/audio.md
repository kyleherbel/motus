# Audio

Measured on all 32 in-style clips (2895 s; 24 dark, 7 mixed, 1 light), from the decoded HE-AAC audio at 44.1 kHz. Nothing was listened to; every finding comes from loudness meters, spectrograms, template matching and waveform cross-correlation, plus every-frame picture differences at each clip's native rate for trigger alignment. The mix is constant: -14.3 LUFS (range 0.4 LU), LRA about 3 LU, mono voice cut so tightly that no silence over 0.28 s survives and speech fills 93 % of the runtime. One low, mono music loop (bed A: 7.385 s, 8 beats at 65 BPM, energy 40-250 Hz) is in 29/32 clips. It enters at the top of its loop a median 9.5 s in, sits about 16 dB under the voice, is never ducked, and in most clips plays as one 6-loop block (44.3 s), followed by a music-free stretch and a second loop (A2, 14.77 s) for the last ~23 s up to the last frame. One kit variant instead repeats bed A for the whole clip. Effects were found as re-used samples (the same waveform at the same gain, NCC 0.8-1.0 across clips). They form three kits that rotate across the whole period with no date trend: K1 (whoosh swell, 85 ms swoop, cut thump; 12 clips), K2 (2 s sub swell + stereo sub drop, E5 tone, mid whoosh; 8 clips), K3 (low whoosh with a whole-clip bed; 7 clips). A bright riser that stops dead on the transition frame (~0.44 s after it starts) is shared by 21 clips. Swells lead their picture change by 0.28-0.44 s; the cut thump starts on the cut. The swoop's trigger is unresolved.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [A01] Master the finished video to -14.3 LUFS integrated with a loudness range of about 3 LU; the engine's -14 LUFS / -2 dBTP render target is within measurement error of the reference.

- Values: Integrated -14.3 LUFS median (range -14.5 to -14.1). LRA 3.1 LU median (2.0-4.8). Decoded true peak +0.05 dBTP median (-0.9 to +1.5; 16/32 clips over 0 dBTP after AAC decode, a platform/codec overshoot, not a style choice). Own BS.1770 implementation agrees with ffmpeg ebur128 to 0.05 LU.
- Evidence: n=32 clips, 2895 s.;.
- Confidence: high
- Verified, confirmed: Integrated: G2 median -14.3 LUFS (n=17, range -14.5..-14.1, IQR -14.4..-14.2); all-32 median -14.3 LUFS (range -14.5..-14.1). LRA: G2 median 3.1 LU (2.0-4.3); all-32 median 3.1 LU (2.0-4.8). True peak (not claimed): G2 median +0.1 dBTP (-0.8..+1.2), all-32 +0.05 dBTP (-0.9..+1.5); 16/32 clips exceed 0 dBTP. A01 holds exactly. True peaks above 0 dBTP after the platform's AAC encode mean the master was not true-peak limited below ~-1 dBTP; a builder should normalise to -14.3 LUFS and limit at -1 dBTP.,.

### [A02] Keep the mix dense and flat: short-term loudness stays inside about 3 LU and the opening is not louder than the body.

- Values: Short-term (3 s) loudness p10 -15.8 LUFS, p95 -12.8 LUFS (medians over clips); momentary max -8.3 LUFS median (-9.8 to -6.4). Peak-to-RMS crest 16.7 dB (15.5-18.6). Mean momentary loudness over 0-3 s minus integrated: -0.7 LU median (-2.1 to +3.6).
- Evidence: n=32., (hook_0_3s_shortterm_mean)
- Confidence: high

### [A03] Treat the voice as a mono centre source: put nothing of the voice in the side channel.

- Values: Side minus mid in 150-4000 Hz over ASR words: -30.3 dB median (-38.1 to -20.2). The side channel is digital zero (< -90 dB) in most mono frames, so any stereo content in the mix is music or effects.
- Evidence: n=32. (side_minus_mid_voiceband_db); (lower panel)..
- Confidence: high
- Verified, confirmed: Side minus mid in speech frames (300-4000 Hz): G2 median -30.3 dB (n=17, -38.3..-22.5), all-32 -31.3 dB (-39.5..-21.9). L/R correlation 300-4000 Hz: median 0.998 (0.987-0.9997). Confirmed. The leakage that remains is consistent with AAC joint-stereo coding of a mono voice..

### [A04] Cut the voice tight: no silence longer than 0.28 s survives, the median gap is 75 ms, and speech fills about 93 % of the runtime.

- Values: Silences >= 50 ms (voice band and fricative band both >= 25 dB under their p95): median 75 ms per clip (57-90), p90 121 ms (71-175), longest per clip 183 ms median (75-284); 0 silences >= 300 ms and 24 >= 200 ms in all 32 clips. 24.4 silences per minute median (8-46). Speech share 0.93 (0.88-0.97). ASR rate 3.79 words/s (3.40-4.08). At 24 fps the median gap is 1.8 frames and the longest is 6.8 frames; at 30 fps 2.3 and 8.5 frames.
- Evidence: n=32.;. Longest silence e.g. clip12@2187 (87.51 s at 25 fps).
- Confidence: high
- Verified, confirmed: Pause = mid voice band (300-4000 Hz, excludes the bed) 10 ms RMS below (clip p95 - X dB), runs inside first..last word. X=30 dB: longest per clip G2 median 0.165 s (n=17, 0.110-0.254), all-32 0.168 s (0.085-0.254); no gap >= 0.30 s in any clip; median gap (gaps >= 30 ms) 0.050 s. X=25: G2 0.254 s (0.125-0.389), all 0.244 s (0.125-0.389); 5/32 clips (4 G2) have one or two gaps >= 0.30 s. X=20: G2 0.349 s (0.244-0.454), all 0.342 s; 21/32 clips have a gap >= 0.30 s; median gap 0.070 s. X=35: 0.10 s (0.05-0.17). ASR (faster-whisper, not forced-aligned): 90% of word gaps are 0; longest ASR gap per clip median 0.30 s (G2 0.22-0.36, all 0.22-0.46); sentence-end gap median 0.14 s (G2 and all; per-clip medians 0.09-0.23). Full mix never goes quiet: quietest 10 ms frame inside speech median -56 dBFS (bed and effects fill the gaps). Both claims describe the same edit; they differ by threshold. A04's 183/284 ms sits between my X=30 (168/254 ms) and X=25 (244/389 ms) values; S16's max 0.35 s matches X~20-25 dB or the ASR longest gap; S16's 0.14 s ASR sentence gap is confirmed. A04's 'median gap 75 ms' matches X=20 (70 ms); at X=30 the median gap is 50 ms. For pause-trimming the builder should use A04 with an explicit definition: detect silence as voice band >30 dB under the speech peak, keep normal gaps at 50-80 ms, cap any kept pause at ~0.18 s (never over 0.25 s), and never leave >= 0.30 s., (pause_X*),.

### [A05] Start the voice on frame 0 and end the video on the last syllable: no music or effect pre-roll before the first word and no tail after the last.

- Values: First voiced frame 0.03 s median (0.02-0.16; at most 4 frames at 25 fps). Tail after the last voice frame 0.07 s median (0.02-0.23). A bed is still playing in the last 1.0 s in 26/32 clips, so the music is cut with the picture, not faded.
- Evidence: n=32. (first_voice_s, tail_after_voice_s); (bed_in_last_1s); snippets end_clip12.m4a, end_clip39.m4a.
- Confidence: high
- Verified, confirmed: Voice onset (voice band >= p95-30 dB): G2 median 0.015 s (0.005-0.070 s = 0.12-1.67 frames), all 0.015 s (0-0.070). Acoustic tail = audio end minus last voice-band activity: at -30 dB G2 0.036 s (0.001-0.133), all 0.039 s (0.001-0.174); at -25 dB all 0.076 s; at -20 dB all 0.129 s. File end minus last ASR word end: audio G2 0.228 s (0.03-0.39), all 0.195 s (0.027-0.39); video G2 0.237 s, all 0.213 s. The ASR's last word end is early: acoustic last voice minus ASR end median 0.146 s all (-0.024..0.379), 0.181 s G2. Audio minus video length median -0.017 s (-0.060..+0.048). Bed at the very end (clips where bed A is still on): gain stays 0.8-1.0 into the last 0.1-0.2 s in clip19, 24, 39; clip01 drops to 0 in the last 0.2 s; clip36 falls ~6 dB over the last 1 s. Both tail numbers hold; they differ by reference point. A05's 0.07 s counts from the last voiced sound (my -25 dB value is 0.076 s; -30 dB gives 0.04 s). S14's 0.21 s counts from the ASR word end, which is not forced-aligned and ends the last word ~0.15 s early: 0.21 ~ 0.06 + 0.15. A builder should cut the file 0.05-0.08 s (about 1-2 frames) after the last voiced sound, or about 0.2 s after an ASR word end if only ASR timings are available. 'No fade' holds in 3 of 5 measurable clips; one stops ~0.2 s early and one dips ~6 dB in the last second.,.

### [A06] Use one recurring low-register music loop (bed A) as the default bed; 29 of 32 clips carry it, and only three clips use something else.

- Values: Bed A matched (low-band template, cosine >= 0.5 for >= 1 s) in 29/32 clips. Other beds: bed B in clip15 and clip28; clip33 matches no template. Share of runtime with any template bed: 0.59 median (p10 0.45, p90 0.87; 0 in clip33).
- Evidence: n=32.; (grid of tonal lines 30-130 Hz); 19.
- Confidence: high
- Verified, confirmed: Period 7.3843 s (clip25 waveform ACF of 30-250 Hz at 4 kHz: 7.38427 s; NCC instance spacing in other clips 7.3839-7.3846 s) = 325,646 samples at 44.1 kHz; 8 beats at 65 BPM = 7.3846 s (tempo 65.003 BPM). The half period (3.692 s) is not a repeat (template self-NCC 0.27 at P/2), so the loop is 8 beats. The same sample (NCC up to 0.98, 30-110 Hz, against a template averaged from 94 instances) is present in 29/32 clips: all except clip15, clip28, clip33; G2 15/17 (not clip28, clip33). clip15 and clip28 carry a different low loop with period 11.034 s (ACF r 0.51-0.61); clip33 shows no periodic low band. Bed spectrum (unbiased cross-instance estimate, 96 instances): 88.7% of power below 110 Hz, 72% in 40-250 Hz; octave shares 30-40 Hz -6.8 dB, 40-60 -5.5, 60-110 -4.5, 110-250 -10.9, below 30 -13.9 dB re total; tonal peaks 39.1, 58.6, 78.1 Hz. Side vs mid of the bed -33.4 dB (mono). Holds. The claimed '40-250 Hz' is a loose envelope: a builder EQ-ing a replacement bed should put most energy at 30-110 Hz (peaks ~39/59/78 Hz)., (spectrum block),.

### [A07] Build bed A as a 7.385 s loop of 8 beats (65 BPM, beat 0.923 s) whose energy sits in 40-250 Hz on sustained bass notes around D1-Bb1-Eb2; keep it mono.

- Values: Loop period 7.3854 s from phase drift inside long placements (n=15, p10-p90 7.3824-7.3871 s). Low-band autocorrelation peak at 0.91 s = 1/8 loop. Strongest template semitones: 58.3, 36.7, 38.9, 77.8, 55.0, 41.2, 73.4 Hz. Frame-median side/mid in 27.5-73 Hz inside bed A: about -85 dB (side is zero) in clip01 and clip19; above 300 Hz the bed is not distinguishable from the floor (<= -38 dB re speech). At 24 fps the loop is 177.2 frames; at 29.97 fps 221.3 frames.
- Evidence: n=29 clips with bed A.,;,; snippets bedA_entry.m4a, bedA_whole_clip.m4a.
- Confidence: high
- Verified, confirmed: Period 7.3843 s (clip25 waveform ACF of 30-250 Hz at 4 kHz: 7.38427 s; NCC instance spacing in other clips 7.3839-7.3846 s) = 325,646 samples at 44.1 kHz; 8 beats at 65 BPM = 7.3846 s (tempo 65.003 BPM). The half period (3.692 s) is not a repeat (template self-NCC 0.27 at P/2), so the loop is 8 beats. The same sample (NCC up to 0.98, 30-110 Hz, against a template averaged from 94 instances) is present in 29/32 clips: all except clip15, clip28, clip33; G2 15/17 (not clip28, clip33). clip15 and clip28 carry a different low loop with period 11.034 s (ACF r 0.51-0.61); clip33 shows no periodic low band. Bed spectrum (unbiased cross-instance estimate, 96 instances): 88.7% of power below 110 Hz, 72% in 40-250 Hz; octave shares 30-40 Hz -6.8 dB, 40-60 -5.5, 60-110 -4.5, 110-250 -10.9, below 30 -13.9 dB re total; tonal peaks 39.1, 58.6, 78.1 Hz. Side vs mid of the bed -33.4 dB (mono). Holds. The claimed '40-250 Hz' is a loose envelope: a builder EQ-ing a replacement bed should put most energy at 30-110 Hz (peaks ~39/59/78 Hz)., (spectrum block),.

### [A08] Bring bed A in at the top of its loop after the hook, a median 9.5 s into the video.

- Values: First bed-A entry 9.47 s median (p10 4.15, p90 17.32, range 3.29-27.6). Entry loop phase within 0.25 s of the loop boundary in 25/29 clips. Rise from floor to steady level 240 ms median (p10 80, p90 474), which includes the first note's own attack. At 24 fps the median entry is frame 227.
- Evidence: n=29.; e.g. clip30@350 entry floor, clip40@149, clip07@257, clip06@124. snippet bedA_entry.m4a.
- Confidence: high
- Verified, confirmed: Loop point: in 25/29 bed clips the phase-locked bed gain is ~0 (|g|<0.3) in every 0.1 s window before template phase 0 and 0.7-1.0 from phase 0, i.e. every clip starts the file at the same loop point (offset 0.00 s in 23, -0.10 s clip06, +0.15 s clip36; the loop tail that precedes phase 0 inside running loops is absent at entry). Time: all clean entries median 8.67 s (n=25, range 3.00-18.77, IQR 4.84-14.82); G2 median 8.10 s (n=12: clip24 3.625 s = 87 f @24, clip25 3.000 s = 72 f, clip36 5.166 s, clip40 6.492 s = 156 f @23.976, clip39 7.701, clip38 7.845, clip29 8.352, clip35 12.506, clip37 14.728, clip30 14.811 = 355 f, clip32 16.020, clip31 18.709). Not clean: clip13, clip26, clip27, clip34 (cut-up or earlier partial bed). 'At the loop top' holds within +-0.05 s. The median entry is 8.7 s (all) / 8.1 s (G2), not 9.5 s; the difference is within the 4.8-14.8 s IQR and comes from which clips are counted. Entry time is content-driven, so a builder should start the bed at loop sample 0 at a chosen beat (typically 3-19 s, median ~8.5 s) rather than hard-code a time., (bed_entry_s, clean entries only; the bed_entry_s block in also includes the 4 unclean clips and should not be used).

### [A09] Play bed A as one block of 6 loops (44.3 s) and stop it at the end of a loop; in clips under about 60 s it simply runs to the end.

- Values: 11 of 26 first blocks measure 43.96-45.51 s from entry floor to exit floor (6 x 7.385 = 44.31 s); the others are cut earlier or restarted. Exit at a loop boundary (phase <= 0.3 s or >= 7.1 s) in 13/26. Exit fall to -20 dB: 1.24 s median (p10 0.29, p90 1.77). When bed A does not cover the clip it ends at 54.5 s median (42.0-63.1, n=18).
- Evidence: n=26 exits.; e.g. clip30@350-1411, clip40@149-1210, clip10@365-1468, clip29@191-1258 (entry-exit floors). snippet bedA_exit_6loops.m4a.
- Confidence: medium (block length clear in 11 clips; the rest are shortened or restarted)
- Verified, confirmed: Bed A runs 44.3-44.6 s from entry (6 x 7.384 = 44.31 s): clip04 44.6, 07 44.55, 10 44.57, 12 44.57, 13 44.0, 17 44.55, 30 44.59, 38 44.55, 40 44.5 (window-end bias <=0.5 s); clip02 42.5, clip06 40.5, clip09 45.6, clip32 45.4. Inside it, the first ~4.6 loops repeat sample-exactly and the last ~1.5 loop-lengths reuse loop material at a shifted phase, so it is one 44.3 s music file, not six identical copies. Then no coherent bass from entry+44.3 to ~+73.7 s (~29.5 s, 32 beats): cross-clip coherent 30-110 Hz power <= -70 dBFS vs -50..-55 dBFS during bed A (n=13-15 clips aligned at entry). Then section B: its template starts at entry+69.22 s sample-exactly in clip07, 10, 12, 13, 38, 40 (and +70.0..71.8 s in clip02, 05, 32); it becomes audible ~4.5 s later (~entry+73.7 s, 80 beats) and runs to the file end, 10.5-38.7 s, median 20.4 s (n=9). B has a 16-beat phrase (ACF lag 14.770 s = 2.0002 x P) but is not a strict loop (the next match is 15.93 s later in clip07 and clip32). B detected (NCC >= 0.45) in 9/32 (02, 05, 07, 10, 12, 13, 32, 34, 40); G2: 32, 34, 40 (weak in 26, 30, 38). Holds with two refinements a builder needs. (1) Section B is placed at a fixed offset from the bed entry (+69.2 s template start, +73.7 s audible), not at a fixed time before the end; 'last ~23 s' is what that offset leaves in clips of 90-125 s (median 20 s). (2) B is a 16-beat section, not a sample-exact 14.77 s loop. Build it as: bed file from entry (44.3 s), silence until entry+73.8 s, section B to the end., work coherence arrays reproduced by,.

### [A10] After the bed-A block, leave a music-free stretch, then run a second loop (bed A2, 14.77 s, the same tempo grid) for the last part of the video up to the last frame.

- Values: Bed A2 (period 14.77 s = 2 x 7.385 s) in 15 clips; starts 23.1 s before the end median (7.5-47.5, n=13 with start > 30 s). Bed A2 level -19.2 dB re speech (K-weighted, n=11). Music share of the whole clip 0.59 median, so roughly 40 % of runtime is voice and effects only.
- Evidence: n=15.; (green bars); snippet bedA2_late.m4a.
- Confidence: medium (A2 template from one clip; whether A2 is a later part of the same track is unknown)
- Verified, confirmed: Bed A runs 44.3-44.6 s from entry (6 x 7.384 = 44.31 s): clip04 44.6, 07 44.55, 10 44.57, 12 44.57, 13 44.0, 17 44.55, 30 44.59, 38 44.55, 40 44.5 (window-end bias <=0.5 s); clip02 42.5, clip06 40.5, clip09 45.6, clip32 45.4. Inside it, the first ~4.6 loops repeat sample-exactly and the last ~1.5 loop-lengths reuse loop material at a shifted phase, so it is one 44.3 s music file, not six identical copies. Then no coherent bass from entry+44.3 to ~+73.7 s (~29.5 s, 32 beats): cross-clip coherent 30-110 Hz power <= -70 dBFS vs -50..-55 dBFS during bed A (n=13-15 clips aligned at entry). Then section B: its template starts at entry+69.22 s sample-exactly in clip07, 10, 12, 13, 38, 40 (and +70.0..71.8 s in clip02, 05, 32); it becomes audible ~4.5 s later (~entry+73.7 s, 80 beats) and runs to the file end, 10.5-38.7 s, median 20.4 s (n=9). B has a 16-beat phrase (ACF lag 14.770 s = 2.0002 x P) but is not a strict loop (the next match is 15.93 s later in clip07 and clip32). B detected (NCC >= 0.45) in 9/32 (02, 05, 07, 10, 12, 13, 32, 34, 40); G2: 32, 34, 40 (weak in 26, 30, 38). Holds with two refinements a builder needs. (1) Section B is placed at a fixed offset from the bed entry (+69.2 s template start, +73.7 s audible), not at a fixed time before the end; 'last ~23 s' is what that offset leaves in clips of 90-125 s (median 20 s). (2) B is a 16-beat section, not a sample-exact 14.77 s loop. Build it as: bed file from entry (44.3 s), silence until entry+73.8 s, section B to the end., work coherence arrays reproduced by,.

### [A11] Variant (kit K3): instead of A then A2, re-place bed A back to back for the whole clip, restarting at the loop top after a short gap.

- Values: 6 of 7 K3 clips have bed A coverage >= 0.75 (clip19 0.89, clip24 0.90, clip25 0.88, clip36 0.86, clip39 0.87, clip01 0.79); 2-6 separate bed-A placements per clip (each a new loop offset), separated by 0.5-1.5 s gaps read from the bass sheets. No K3 clip uses A2.
- Evidence: n=7. (n_A_placements); snippet bedA_restart.m4a (clip24 ~24.4 s).
- Confidence: high
- Verified, confirmed: 5/29 bed clips keep bed A on for 89-95% of the file: clip19, clip24, clip25, clip36, clip39 (G2: 24, 25, 36, 39 = 4/15). The loop is restarted from the loop top every 3-5 loops (clip24 blocks at 3.625, 25.876, 48.667 s; clip39 at 7.7, 41.7, 74.0, 107.9 s), with no section B. Cross-clip coherence of these 5 clips aligned at entry stays only to ~+28 s because the restarts fall at different times. Confirmed. In G2 this variant is common (4 of 15 bed clips), so a builder should support both arrangements.,.

### [A12] Set the bed about 16 dB under the voice and do not duck it under speech.

- Values: Bed level in voice-free frames minus speech-frame level (both K-weighted): -16.3 dB median (p10 -19.4, p90 -11.5, n=25 clips with >= 20 pause frames). Ducking test, sub band normalised by the loop template at the same phase, pause minus speech: -0.06 dB median (p10 -0.34, p90 +0.59, n=25). The bed is not lower under speech.
- Evidence: n=25.;.
- Confidence: high for no ducking; medium for the -16 dB level (pause frames may hold room tone and effect tails)
- Verified, confirmed: Bed RMS (full band) under voice RMS (speech frames): G2 median 16.3 dB (n=15, range 6.3-20.5, IQR 14.7-18.6); all bed clips median 14.9 dB (n=29, 6.3-20.5). K-weighted: G2 19.5 dB (9.0-23.5), all 18.0 dB. Bed alone as loudness: G2 median -33.2 LUFS-equivalent (-37.1..-23.0), all -31.6. Voice RMS in speech frames -16.3 dBFS (G2 and all, range -16.6..-15.9). Outliers with a loud bed: clip25 6.3 dB, clip37 8.8, clip39 9.8, clip13 9.8, clip03 11.0, clip04 11.7. Holds for G2 with unweighted RMS (16.3 dB); all-29 is 14.9 dB, and K-weighting adds ~3 dB because the bed sits below 110 Hz. Use unweighted RMS 16 dB under the voice (about -32 dBFS RMS for a -16 dBFS voice) as the default, and note that 6 of 29 clips run the bed 6-12 dB under.,.
- Verified, confirmed: Bed gain in speech frames minus bed gain in pause frames (inside full loop instances): G2 median +0.02 dB (n=15, -0.99..+0.76), all +0.03 dB (n=29, -0.99..+2.29). 30-70 Hz energy ratio speech minus pause: G2 median +0.4 dB, all +0.46 dB (slightly positive from voice leakage). Loop-to-loop gains are constant within a clip (e.g. clip10 0.027/0.028/0.028/0.027 for loops 1-4). No ducking: a ducker would give several dB negative; all clips with >300 pause frames are within +-0.8 dB. Do not sidechain the bed.,.

### [A13] Do not import bed B or the clip33 bed as defaults; they are one-offs.

- Values: Bed B (stereo, 11.04 s loop, frame-median side 16 dB under mid in 27-73 Hz) only in clip15 (2026-10-21) and clip28 (2026-10-29), level -15.5 and -18.9 dB re speech. clip33 (2026-11-04) has a stereo bed with a 1.07 s beat that matches no template.
- Evidence: n=3 clips.,; snippets bedB.m4a, bedC_unmatched.m4a.
- Confidence: low (seen in 2 and 1 clips)

### [A14] Open with a stereo low-frequency texture under the first seconds of speech that stops before the bed comes in.

- Values: Side-channel level in 27.5-110 Hz over 0-1 s: -43 dB median vs -75 dB clip median; at least 10 dB above the clip median in 28/32 clips. Visual inspection of the bass sheets shows it ending at the first cuts (e.g. clip01 ~7.3 s, clip08 ~4.7 s).
- Evidence: n=32.;,; snippets open_clip01.m4a, open_clip08.m4a.
- Confidence: medium (presence measured; its end time and sound were read by eye from spectrograms)
- Verified, corrected: Stereo low-frequency content in the first seconds: 28/32 clips (absent in clip04, 15, 28, 33). In that segment the 27.5-110 Hz side level is -37..-65 dBFS (median ~-47) and side minus mid -1.5..-14 dB. Excess over the clip's side median ranges from +22 to +112 dB, because AAC codes the side channel as near-zero most of the time (per-clip side medians -43..-141 dBFS); the '~30 dB' figure is not reproducible. The segment ends within +-0.35 s of a picture change in 8/28 clips (clip06, 07, 09, 19, 26, 29, 37, 39); median distance from end to the nearest change 0.87 s. The content is the kit's own effect samples placed in the first 0-5 s (K2 families 1/2 at 0.0-1.1 s, K1 family 16 at 0.8-2.3 s, K3 family 0 at 0.8-4.0 s, family 7 at 2.0-4.7 s); the same samples recur later in the clip. There is stereo low content at the start of most clips, but it is not a separate texture with a fixed level or a cut-locked end: it is the kit's low swells, which recur later. For a builder: open with one of the kit's low stereo swells under the first 1-5 s; measure its level in absolute dBFS (side about -47 dBFS in 27.5-110 Hz), not relative to the side median.,.

### [A15] Use one effect kit per video; three kits rotate across the whole period and pair with the bed structure.

- Values: K1 (whoosh swell + swoop + cut thump + riser): 12 clips, all dark family, 7/12 also use bed A2. K2 (sub swell + stereo sub drop + E5 tone + mid whoosh + riser): 8 clips (5 dark, 3 mixed), 6/8 use A2. K3 (low whoosh + riser): 7 clips (5 dark, 1 light, 1 mixed), 6/7 bed A whole clip. 5 clips (clip15, 29, 33, 34, 37) carry no re-used kit sample. Dates: K1 2026-10-14..11-11, K2 10-11..11-09, K3 10-10..11-10.
- Evidence: n=32. (kits);.
- Confidence: high
- Verified, confirmed: Recurring stereo samples split the clips into disjoint groups: K1 = clip06, 07, 08, 09, 10, 12, 17, 28, 30, 32, 35, 40 (12); K2 = clip01, 15, 19, 24, 25, 31, 36, 39 (8); K3 = clip03, 04, 05, 13, 26, 27, 38 (7); no kit = clip02, 29, 33, 34, 37 (5). G2: K1 5 (28, 30, 32, 35, 40), K2 5 (24, 25, 31, 36, 39), K3 3 (26, 27, 38), none 4 (29, 33, 34, 37). One sample (family 7, a 0.54 s low swell) is shared by 27 clips across all kits; clip02 shares two short K3 samples. Counts and membership match exactly (12/8/7/5), with the caveat that one low swell is common to all kits.,.
- Verified, open: Recurring stereo-sample instances (all families, merged within 0.3 s): G2 median 7.9 per minute (n=17, range 0-21.3, IQR 3.5-14.7); all-32 11.2/min (0-26.6). G2 by kit: K1 14.7/min (n=5), K2 7.9 (n=5), K3 17.6 (n=3), no kit 1.2 (n=4). Share of instances starting within 0.5 s of a picture change: G2 median 0.24 (0-0.50), all 0.26, versus a chance rate of ~0.23 at the measured 13.9 picture changes/min (G2 median). K3 is the only kit above chance (0.42). No single claimed density to test. The builder should take the density from the kit (K1 ~15/min, K2 ~8/min, K3 ~18-21/min) and should not assume the effects are cut-synchronised. Density counts only samples found in the side channel, so it is a lower bound for mono effects..

### [A16] Effect density: about one re-used effect every 2 s in K1 and K2, one every 7 s in K3.

- Values: Recurring-effect onsets per minute: K1 28.8 median (10.1-38.6), K2 24.3 (3.4-31.6), K3 9.0 (5.4-23.2), no-kit clips 2.5 (0.8-6.5). Counts include only samples that recur >= 3 times in >= 2 clips.
- Evidence: n=32. (effects_per_min);.
- Confidence: medium (effects that are unique or mono-only are not counted)

### [A17] K1 whoosh swell: a 0.64 s low-mid noise swell (rise 0.43 s, fall 0.19 s) placed so the picture change lands about 0.28 s after it starts.

- Values: 176 instances, 12 clips, 14.5 per clip median. Duration 644 ms (p10 80, p90 748), attack 432 ms, decay 185 ms; side band 108-560 Hz, centroid 289 Hz; L/R corr 0.9. Same sample every time: NCC 0.9, placement gain 0.0 dB median (p10 -1.0, p90 +3.8). Visual activity peaks +285 ms after onset (2.0-2.1x control), i.e. at the swell's peak; only 7 % within +-125 ms of a hard cut. 0.43 s = 10.4 frames at 24 fps, 12.9 at 29.97.
- Evidence: n=176.; e.g. clip09@1171, clip12@2489, clip10@2148; snippets X01_whoosh_swell_1/2.m4a.
- Confidence: high for the sound; medium for the +0.28 s trigger offset
- Verified, corrected: K1's main sample (family 16; all 12 K1 clips, 134 instances; G2 clip28, 30, 32, 35, 40): -20 dB duration 0.60 s, rise 0.35 s, fall 0.25 s (-10 dB 0.31 s). Energy: -10 dB span 13-37 Hz, 16-31 Hz octave dominant; 125-250 and 250-500 Hz octaves -16/-15 dB; 500-1000 Hz -20 dB; side spectrum identical across instances. Sync: 34% of instances have a picture change within +-1 s; among those the change falls 0.0-0.3 s after onset (mode 0.0-0.1 s); within +-0.5 s 25% overall, about chance (0.23 at 14 changes/min). Examples: clip30@373, clip40@205, clip35@21, clip32@631 (onset frames). Shape and length agree (0.60 vs 0.64 s, rise-then-shorter-fall). The band does not: by energy this sample is a sub-bass swell below 40 Hz, and 108-560 Hz is 15-16 dB down. That is probably a definition difference (audible band vs energy band, or a mid-channel measurement), which a listener should settle. Sync does not hold as a rule: most instances are not near a cut. Recommend the builder treat it as a free-standing low swell of ~0.6 s, reaching full level ~0.35 s after start, and only optionally lead a cut by 0-0.3 s. Evidence: (fam 16),.

### [A18] K1 swoop: an 85 ms downward blip (about 530 to 210 Hz in 50 ms) used many times per video at constant level.

- Values: 140 instances, 8 clips (2026-10-15..11-06), 18 per clip median. Duration 85 ms (p10 75, p90 316), attack 25 ms, decay 55 ms, side centroid 323 Hz, L/R corr 0.9, NCC 0.97, gain spread p10-p90 -1.6..+1.7 dB. Not locked to detected cuts (1.4 % within +-125 ms) nor to word onsets (48 % within 60 ms vs 39 % at random times). 85 ms = 2 frames at 24 fps.
- Evidence: n=140.; e.g. clip08@876, clip30@2073, clip30@433; snippets X02_swoop_1/2.m4a.
- Confidence: high for the sound; low for its trigger (unresolved)
- Verified, confirmed: Family 30/43 (the same sample; 99% of hits coincide): -20 dB length 0.07-0.12 s, -10 dB 0.04-0.05 s, rise 0.01 s; pitch falls (spectral centroid 570 -> 120 Hz, spectral peak 560 -> 129 Hz within 50 ms); 250-500 Hz octave dominant. Not locked: 3-5% of instances have a picture change within +-0.5 s (chance ~23%); median change-minus-onset +1.0 s; often in bursts of 2-4 within 0.4-0.9 s. Kit K1 only: 8/12 K1 clips (08, 09, 10, 12, 17, 30, 32, 35), 79 instances; G2 clip30, 32, 35. Examples: clip30@2192, clip30@412, clip32@838. Confirmed: ~85 ms, downward, free of cuts. It belongs to kit K1, not to every video. Evidence: (fam 30, 43),.

### [A19] K1 cut thump: a mono low thump (45-190 Hz) starting on the cut frame.

- Values: 66 instances, 12 clips, 5 per clip. Duration 564 ms, attack 180 ms, decay 222 ms (46 ms analysis frames), centroid 105 Hz, mono (side 43 dB under mid). 36 % within +-125 ms of a hard cut, median offset +4 ms (0.1 frame); event-locked full-frame change 4.8x control at +30 ms. 33 % start within 300 ms of an ASR sentence start (15 % at random times).
- Evidence: n=66.; e.g. clip28@290, clip40@1340; snippets X03_cut_thump_low_1/2.m4a.
- Confidence: medium (low-band features share the band with the voice fundamental)
- Verified, open: Not confirmed as a recurring sample. Pooled cut-locked coherence (mid 30-200 Hz, 0..+0.2 s after 296 G2 / 561 all hard changes) <= 0.03. Per clip, partial coherence only in clip40 (0.09-0.19, n=20 cuts) and clip08 (0.15-0.20, n=10), consistent with a low element after a subset of cuts. By eye in spectrograms: a downward low sweep (~300 to ~50 Hz) starts on the cut at clip40@397 and clip40@457. No cross-clip match in 40-250 Hz snippet matching except the K3 low swell. If a thump exists it is not one sample placed on most cuts. It may be a mono element on some cuts (clip40, clip08), masked by voice and bed. Needs listening at clip40@397/457.,.

### [A20] Riser into a transition (all kits): a 0.38 s rising bright riser that stops dead (50 ms) on the frame where the picture changes, about twice per video.

- Values: 43 instances in 21 clips (2026-10-10..11-11), 2 per clip median. Attack 379 ms (p10 212, p90 414), stop 50 ms, band 172 Hz-6.9 kHz, centroid 3.2 kHz, wide (L/R corr 0.7). Event-locked full-frame change 6.2x control at +440 ms; spot checks: change at +365, +382, +448, +582 ms. 0.44 s = 10.6 frames at 24 fps, 13.2 at 29.97.
- Evidence: n=43.; e.g. clip05@2031, clip36@862 (cut clip36@871), clip13@579; snippets X08_riser_cut_1/2.m4a.
- Confidence: high
- Verified, open: No recurring sample with a 172 Hz-6.9 kHz band ending on picture changes was found. Closest: family 7 (27 clips across all kits, 74 instances, 1-4 per clip, median ~2.3): rise 0.48 s then an abrupt stop (fall 0.06 s), -20 dB length 0.54 s; energy 31-63 Hz octave dominant (higher octaves -13..-31 dB); its end lies within +-0.05 s of a picture change in 34% and within +-0.1 s in 39% of instances (e.g. clip39@99, clip13@1405, clip38@2228, end frames on the change). Pooled cut-locked coherent average over 296 G2 hard changes: coherent/total <= 0.04 in every band from -0.8 to +0.8 s. I can confirm a 'swell that stops dead', often on a cut, but not its claimed band or length. A riser mixed mostly mono under the voice, or with its energy above 4 kHz, would escape my side-channel and 8 kHz searches. A person should listen at the family-7 instances listed and at (broadband burst ending on the cut at clip40@106, by eye). Evidence: (fam 7),.
- Verified, open: Recurring stereo-sample instances (all families, merged within 0.3 s): G2 median 7.9 per minute (n=17, range 0-21.3, IQR 3.5-14.7); all-32 11.2/min (0-26.6). G2 by kit: K1 14.7/min (n=5), K2 7.9 (n=5), K3 17.6 (n=3), no kit 1.2 (n=4). Share of instances starting within 0.5 s of a picture change: G2 median 0.24 (0-0.50), all 0.26, versus a chance rate of ~0.23 at the measured 13.9 picture changes/min (G2 median). K3 is the only kit above chance (0.42). No single claimed density to test. The builder should take the density from the kit (K1 ~15/min, K2 ~8/min, K3 ~18-21/min) and should not assume the effects are cut-synchronised. Density counts only samples found in the side channel, so it is a lower bound for mono effects..

### [A21] K2 impact pair: a 2 s sub swell gliding 39 -> 55 -> 37 Hz together with a stereo sub drop 55 -> 33 Hz over 1.4 s.

- Values: Sub swell: 42 instances, 7 clips; duration 2.03 s (1.53-2.53), attack 0.78 s, decay 1.14 s, centroid 72 Hz, side 11 dB under mid; in-band peak 3.6 dB above the median speech-frame level (low confidence). Stereo sub drop: 42 instances, 7 clips; side only 4.6 dB under mid (L/R corr 0.6); low-band level falls from -11.8 to -30 dB over 1.4 s. The two co-occur in the same 7 clips (03, 04, 05, 13, 26, 27, 38). Neither locks to cuts (2-10 % within +-125 ms).
- Evidence: n=42 each.,; (Lambda shapes 53-57 s),; e.g. clip13@1392, clip05@1475, clip13@31, clip26@1104; snippets X10_sub_swell_*, X09_stereo_sub_drop_*.
- Confidence: high for the sounds; low for level and trigger

### [A22] K2 accents: an E5 tone (658 Hz, 68 ms attack, 0.7 s decay) and a 0.68 s mid whoosh (130-740 Hz) that leads its picture change by about 0.41 s.

- Values: Tone: 40 instances, 8 clips, frequency steady at 652-663 Hz, duration 818 ms, attack 68 ms, decay 696 ms. Mid whoosh: 58 instances, 7 clips, attack 282 ms, decay 329 ms, centroid 509 Hz, full-frame change 3.2x control at +410 ms.
- Evidence: n=40 and 58.,; e.g. clip13@1256, clip05@30, clip26@1240; snippets X11_tone_E5_*, X04_mid_whoosh_*.
- Confidence: medium

### [A23] K3 low whoosh: a 0.36 s low swell (108-215 Hz, rise 0.24 s) near sentence starts, under a bed that never stops.

- Values: 57 instances, 7 clips, 8 per clip; duration 364 ms, attack 239 ms, decay 115 ms, centroid 141 Hz; 86 % inside bed A; full-frame change 3.4x control at +90 ms; 42 % within 300 ms of an ASR sentence start (18 % at random).
- Evidence: n=57.; e.g. clip19@692, clip25@646, clip01@1086; snippets X05_low_whoosh_*.
- Confidence: medium

### [A24] Place every effect sample at one fixed gain; do not ride or automate effect levels per instance.

- Values: Gain of each instance relative to its class seed (window RMS ratio at the NCC peak, band-passed): p10..p90 -1.0..+3.8 dB (whoosh), -1.6..+1.7 dB (swoop); riser p10 -2.9, median -0.1, p90 +11.7 dB (the upper tail is windows where loud voice or bed overlaps the riser). Waveform identity NCC >= 0.8 in all 664 kept instances.
- Evidence: n=664 instances in 9 classes. (gain_db, ncc, vncc).
- Confidence: medium (the gain estimate includes overlapping voice and bed, so it bounds rather than measures the spread)

### [A25] Nothing in the mix changes over the period: loudness, bed use and kit rotation are the same in the first and second half of the corpus.

- Values: 2026-10-10..10-24 (n=16) vs 2026-10-26..11-11 (n=16): integrated -14.3 vs -14.25 LUFS; music share 0.58 vs 0.61; kits K1/K2/K3/none 7/5/3/1 vs 5/3/4/4; bed A whole-clip 3 vs 4. Exceptions limited in time: bed B only 10-21 and 10-29; low swell X13 only 10-12..10-28 (5 clips).
- Evidence: n=32. (time_split); (rows by date).
- Confidence: high

### [A26] Never observed: ducking, a pause >= 0.3 s, music or effects before the first word, a fade-out at the end, a level lift at the hook, or stereo voice.

- Values: Duck -0.06 dB (n=25); 0 silences >= 300 ms (n=32); first voice 0.02-0.16 s (n=32); bed still on in the last 1 s in 26/32 and tail after voice 0.02-0.23 s; hook minus integrated -0.7 LU median; voice side 20-38 dB under mid.
- Evidence: n=32.,.
- Confidence: high

### [A27] Do not copy detail above about 9.6 kHz from these files: the delivery codec rebuilds that band.

- Values: HE-AAC (SBR) stereo 44.1 kHz at 59.7-67.7 kb/s in all 32 clips; spectrum ends at 17.9 kHz in all 32. Waveform coherence between 43 copies of the same riser sample is 0.06-0.37 up to 9.5 kHz and <= 0.004 above 9.7 kHz, so the SBR crossover is about 9.6 kHz. Voice -20 dB point 11.7 kHz median (8.7-15.3).
- Evidence: n=32 (codec), n=43 instances (crossover).; (codec_top_hz);.
- Confidence: low for the crossover (one sample class, low absolute coherence); high for the codec facts

## Constant and variable

CONSTANT (every clip, within measurement error): integrated loudness -14.3 +-0.2 LUFS; mono voice; first word at 0.02-0.16 s and tail 0.02-0.23 s; no silence >= 0.3 s; no ducking; HE-AAC delivery. CONSTANT where present: bed A loop 7.385 s and its notes (29 clips), entry at the loop top (25/29), each effect sample's waveform and gain. VARIABLE: kit (K1/K2/K3/none) per video, not by date; bed structure follows the kit (A 6-loop block then A2 for K1/K2, A whole clip for K3); bed entry time 3.3-27.6 s (follows the hook length); A2 start 7.5-47.5 s before the end; effect density 0.8-38.6 per minute; LRA 2.0-4.8 LU; one-off beds in clip15, clip28 (bed B) and clip33.

## Open questions

- What triggers the K1 swoop (140 instances)? It locks neither to detected cuts nor to word onsets. A frame-by-frame look at the graphic field around e.g. clip30@2073 and clip08@876 (small element pops, caption emphasis) would decide.
- Class X00 (369 instances in 28 clips) is a reproducible stereo residue 25 dB under the mid channel (NCC 0.8-0.9) whose sound and purpose are unknown; it may be a quiet layer of the beds or a soft UI sound. Listening to snippets X00_faint_residue_1/2.m4a would decide whether it is an effect.
- Is bed A2 the later part of the same music file as bed A (same tempo grid, period exactly 2x)? Listening to bedA_exit_6loops.m4a and bedA2_late.m4a would decide; the builder needs one original track either way (house rule 5).
- Effect and bed levels relative to the voice are estimates from pause frames and side/L-R-correlation algebra; the true effect loudness under the voice needs a listening check or a stem.
- Effects that occur once, or only in the mid channel above 95 Hz, were not discovered (seeds came from side-channel onsets and the sub band). The five clips with no kit (clip15, clip29, clip33, clip34, clip37) may use such effects.
- Several low-band classes (X06, X07, X14-X17, X19, X22: 10-48 instances each) passed the waveform test but share the band with the voice fundamental; their sound is not characterised and they are left out of the rules.
- The SBR crossover estimate (9.6 kHz) rests on one effect class with low absolute coherence; a second broadband repeated sample would confirm it.

## What a person must look at or listen to

- Listen to bedA_exit_6loops.m4a, bedA_restart.m4a, bedA_whole_clip.m4a and bedA2_late.m4a: confirm the bed is one loop, its feel (65/130 BPM), hard entry at the loop top, and whether the exit is a stop or a short fade (measured fall 1.24 s).
- Listen to X02_swoop_*, X03_cut_thump_low_*, X08_riser_cut_*, X10_sub_swell_*, X09_stereo_sub_drop_*, X11_tone_E5_*, X04_mid_whoosh_*, X05_low_whoosh_*, X13_low_swell_K2_*: name each sound and judge its loudness against the voice (index in ).
- Listen to and open_clip08.m4a: what is the stereo low texture under the opening, and where does it stop?
- Listen to and bedC_unmatched.m4a to confirm they are different tracks from bed A.
- Watch clip30@2060-2090 and clip08@860-890 at full rate to see what the swoop accompanies.
- Look at against the layout study: do the kits K1/K2/K3 coincide with any visual template difference beyond family?
