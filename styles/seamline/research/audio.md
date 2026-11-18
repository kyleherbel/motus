# Audio

Measured on the 30 in-style clips of the reference corpus (neutral ids clip01 to clip30, by publication date, 2026-03 to 2026-11). Evidence ids are `clipNN@frame` at the clip's own rate (23.976 or 24 fps); evidence files stay in the private study folder and are not part of this repository. Confidence is the analyst's.

## Summary

Measured the audio of all 30 in-style clips (2,197.6 s, every clip HE-AAC 44.1 kHz stereo, 55-71 kbps) with code only; nothing was listened to. Master loudness and true peak come from ffmpeg ebur128 on each file. Everything else comes from 10 ms frame features of the mid (L+R)/2 and side (L-R)/2 signals. The voice is exactly centred, so the side channel holds no voice and gives a clean view of the stereo music and effects. Speech timing uses the faster-whisper word times, which are unverified. Visual events (1,506 full-frame and top-panel cuts) come from my own every-frame region differences, so they are coarse and not the layout analyst's verified cuts.

The mix is simple and very consistent. Every master sits at -14.2 LUFS (spread 0.2 LU) with a loudness range of about 2 LU. The voice is mono, high-passed near 80 Hz, bright (8 kHz level with 1 kHz), heavily compressed (momentary IQR 2.25 LU), dry and gated, and runs from frame 0 with pauses cut to about 0.2-0.4 s. 27 of 30 clips carry a stereo music bed: full length in 22, partial in 5, none in 3. The bed starts at full level on frame 0 and sits about 10-13 LU under the voice. It is never ducked. It is dark (90% of its side energy below about 1 kHz), tonal, and has a weak or no drum pulse (a steady pulse in 11 of 27, 78-122 BPM). It does not follow cuts or sentence ends. Since July 2026 the bed fades out over about 1.1 s at the end; before that it stopped dead with the clip. A new track is used for nearly every video: one track recurs (clip04 and clip26, seven months apart).

Sound effects are sparse. A low noise swell or hit at frame 0 opens 9-10 of 30 clips. Sub-bass whooshes (energy at 40-90 Hz) appear in 8 clips (17 events, 12 of them in clip16-18). Their peak lands on a cut far more often than chance (8 of 17 within 150 ms against 17% chance, peak about 40 ms after the cut), but only 0.5% of cuts carry one. The same whoosh sample is shared by two clips on unrelated topics, so it comes from an editor's library. No footage audio (launch-film sound, product sound, other voices) was found. Top-panel footage cuts change nothing in any band, and the no-bed clips are silent between words although they cut to footage about 190 times. So footage should be muted. Some things need an audition: the opening swell may be the music track's own intro hit, the bed genre is inferred from spectra only, and low-level mono footage sound under speech cannot be excluded. Those snippets are listed below.

## Rules

### A01. Normalise every finished video to -14 LUFS integrated (EBU R128).

- Values: Integrated loudness median -14.2 LUFS, range -14.3 to -14.1, n=30 (spread 0.2 LU). A constant, either from an export preset or from platform normalisation.
- Evidence: n=30, whole files. numbers.json per_clip.*.master, summary_stats.I_LUFS; scripts/a01_extract_loudness.py.
- Confidence: high

### A02. Keep the loudness range of the master at about 2 LU (at most 3 LU), so the voice reads at one level from start to end.

- Values: LRA median 2.1 LU, p10-p90 1.7-3.0, range 1.4-13.8, n=30. One outlier: clip25 has 13.8 LU because of a 14.8 s music-only outro at -27.0 LUFS.
- Evidence: n=30. numbers.json summary_stats.LRA_LU; clip25@1118-1472 (evidence/overview_clip25.png, evidence/snippets/A_bed_only_outro_clip25_46-61.3s.wav).
- Confidence: high

### A03. Limit the master to a -1 dBTP ceiling. The references peak just under 0 dBTP, with codec overs of up to +2.8 dBTP.

- Values: True peak median -0.4 dBTP, p10-p90 -0.8 to +0.2, range -0.9 to +2.8 (4 of 30 above 0 dBTP: clip03, 08, 13, 19). Crest (sample peak minus whole-mix RMS) median 16.5 dB, range 15.4-18.5. The -1 dBTP ceiling is inferred from post-codec values (the codec adds overs), not seen directly.
- Evidence: n=30. numbers.json summary_stats.TP_dBTP and crest_all_dB; evidence/crest.csv.
- Confidence: medium

### A04. Treat everything above about 11 kHz in the references as codec output (HE-AAC with SBR), not as a mix decision. Deliver a full-band 48 kHz mix and let the platform encode it.

- Values: All 30: AAC HE-AAC (SBR) 44.1 kHz stereo, 55-71 kbps. Mid spectrum at 16 kHz is 63-67 dB below the 200-1000 Hz level in 9 clips (clip01-03, clip07-12, up to 2026-05-11: a 16 kHz low-pass) against 31-40 dB below in the other 21 (clip04-06, clip13-30). A delivery-chain change, not style.
- Evidence: n=30. evidence/codec_bandwidth.csv; ffprobe stream profile (scripts/a01_extract_loudness.py decode).
- Confidence: high

### A05. Put the voice in mono, dead centre (identical L and R), and use the stereo field only for the music bed and effects.

- Values: In the 3 no-bed clips the side signal is digital silence (median -120 dBFS, L/R correlation 1.000 in loud frames). In the 27 bed clips the side envelope in the 400-2500 Hz band is uncorrelated with the voice envelope (Pearson r at lag 0 from -0.24 to +0.30, median about 0.04), so no voice leaks into the side channel. There is no stereo reverb or widener on the voice.
- Evidence: n=30. evidence/voice_side_envelope_corr.csv (scripts/a25_checks.py), evidence/overview_clip23.png (side red trace flat at -80 or below), evidence/overview_clip02.png; numbers.json per_clip.*.side_ebur128.
- Confidence: high

### A06. EQ the voice with a high-pass at about 80 Hz (12 dB/oct) and a bright top: 8 kHz should sit level with 1 kHz, with a gentle shelf of about +2.5 dB above 6 kHz.

- Values: Voice long-term spectrum without bed (clip06, 07 bed-off part, 23, 27): the 79 Hz third-octave band is the first band more than 10 dB below the loudest band, and 50 Hz is 36-41 dB below it. The loudest band is 160-500 Hz. 8 kHz re 1 kHz: -1.6 to +3.5 dB. 12.5 kHz: -2.2 to -8.8 dB. 16 kHz: -6.7 to -15.1 dB (codec). 2-5 kHz re 200-1000 Hz: -9.5 to -11.7 dB.
- Evidence: n=4 clips (3 full, 1 partial). evidence/voice_band.csv, evidence/voice_ltas.csv; scripts/a19_voice_room.py. Listen: evidence/snippets/A_voice_dry_clip23_40-48s.wav.
- Confidence: medium (only 4 clips have voice without a bed)

### A07. Compress the voice hard enough that its 400 ms momentary loudness has an interquartile range of about 2 LU (for example 4:1 to 6:1 into a limiter). Short 10 ms peaks should sit only about 6 dB over the median.

- Values: Momentary loudness IQR over speech windows: median 2.25 LU, range 1.68-3.00, n=30. 10 ms mid RMS during speech, p95 minus p50: median 6.0 dB, range 4.75-7.74, n=30.
- Evidence: n=30. evidence/voice_bed_levels.csv (voice_rms_p95_p50, mom_iqr_LU); scripts/a13_voice_bed_levels.py.
- Confidence: high

### A08. Keep the voice dry and gated: no audible room or reverb tail, and a noise floor around -65 dBFS between phrases.

- Values: After phrase ends (gap >= 0.3 s, no bed) the level falls 20 dB in 60 ms (clip23), 70 ms (clip27) and 160 ms (clip06). 10th percentile of the gap floor: -64 to -69 dBFS (clip23 median -62 dBFS).
- Evidence: n=3 clips, 4-6 phrase ends each. evidence/voice_decay.csv; scripts/a19_voice_room.py; snippets A_voice_dry_clip23_40-48s.wav, A_voice_dry_clip27_20-28s.wav.
- Confidence: low (3 clips, few phrase ends, whisper word ends are estimates)

### A09. Start speech on frame 0 and cut pauses tight. Word gaps of 150 ms or more are normally about 200 ms, and no gap should exceed about 0.4-0.6 s.

- Values: First word at 0.00 s in 30/30. Speech covers a median 92% of runtime (0.71-0.95). Gaps of 150 ms or more: median 14 per clip (3-25), median length 200 ms (clip medians 160-240). Longest gap per clip: median 380 ms, p10-p90 280-590 ms, maximum 1,360 ms (clip17).
- Evidence: n=30 transcripts. evidence/pauses.csv, evidence/voice_bed_levels.csv; numbers.json summary_stats.pause_*.
- Confidence: medium (word times are unverified faster-whisper estimates)

### A10. End the video about 0.2 s after the last spoken word. Keep a music-only outro rare.

- Values: Clip end minus end of the last word: median 0.21 s, p10-p90 0.06-0.69 s, n=30. One exception: clip25 runs on for 14.8 s of bed alone.
- Evidence: n=30. numbers.json per_clip.*.tail_after_last_word_s; evidence/overview_clip25.png.
- Confidence: high

### A11. Lay a stereo music bed under the whole video by default. A small minority of videos use it only in stretches or not at all.

- Values: Bed on for 75% of runtime or more in 22/30 clips (median coverage 0.98). Partial in 5 (clip01 0.39, clip15 0.55, clip16 0.28, clip20 0.58, clip21 0.29). None in 3 (clip06 2026-03-31, clip23 2026-09-15, clip27 2026-11-08). The bed is detected as side level >= -62 dBFS (0.5 s median); runs under 1 s are dropped.
- Evidence: n=30. evidence/bed_timeline.png, evidence/bed_segments.csv; scripts/a11_bed_segments.py; snippet A_open_none_clip23_monoVO_0-3s.wav.
- Confidence: high

### A12. Start the bed at full level on frame 0 with no fade-in.

- Values: Bed present from 0.00-0.05 s in 26 of 27 bed clips (clip29 starts at 1.66 s). Fade-in to within 3 dB of its level: median 0 ms, p90 142 ms (clip10 1,270 ms is the exception).
- Evidence: n=27. evidence/bed_segments.csv (fade_in_ms); numbers.json summary_stats.bed_fade_in_ms_first_seg, counts.bed_starts_frame0.
- Confidence: high

### A13. Fade the bed out over about 1.1 s so that it reaches silence 0-0.6 s before the last frame. This is the current treatment; older videos cut the bed dead with the final frame.

- Values: Clips whose bed reaches the end, n=23. Before 2026-07-01: fade-out median 30 ms, 2 of 12 at 500 ms or longer. From 2026-07-01: median 1,100 ms, 9 of 11 at 500 ms or longer (range 0-1,980 ms), ending 0.0-1.3 s before the last frame.
- Evidence: n=23. evidence/bed_end_fade.csv; snippets A_end_fade_clip30_46-50.29s.wav, A_end_hard_clip07_41-45.04s.wav, A_end_fade3s_clip03_68.2-73.23s.wav.
- Confidence: high

### A14. Set the bed about 12 LU under the voice: about -26 LUFS for the bed alone when the voiced mix is -14 LUFS.

- Values: Bed alone in the central part of word gaps of 0.25 s or more: median 10.1 LU below speech loudness (p10-p90 6.1-13.5, n=19 clips with at least 3 such gaps; the estimate is biased loud by voice tails). The one clean bed-only stretch (clip25 46.6-61.4 s) measures -27.0 LUFS against -14.0 LUFS for the voiced part (13.0 LU). Bed side signal alone: median -32.8 LUFS (-37.4 to -26.5, n=22 full-bed clips).
- Evidence: evidence/voice_bed_levels.csv (bed_gap_LUFS_robust, bed_under_voice_LU_robust), numbers.json summary_stats.bed_*; evidence/clip25_bed_reference.csv (scripts/a26_clip25_reference.sh, ffmpeg ebur128 on clip25 0-46 s and 48-58 s). Listen: A_bed_under_voice_clip10_20-28s.wav, A_bed_only_outro_clip25_46-61.3s.wav.
- Confidence: medium (the gap estimate rests on 3-7 short gaps per clip)

### A15. Do not duck the bed under the voice. Its level is static through speech and pauses.

- Values: Side level (bed only, the voice cancels) during speech minus during pauses: median +0.5 dB, p10-p90 -2.1 to +3.7, n=18 full-bed clips with pauses. clip25: bed side -34.8 LUFS under the voice against -34.0 LUFS after the voice ends.
- Evidence: n=18. evidence/voice_bed_levels.csv (duck_dB); evidence/overview_clip02.png (smooth side trace across speech gaps).
- Confidence: high

### A16. Choose dark beds, or low-pass the bed at about 2.5 kHz, so that about 90% of its energy sits below about 1 kHz and the 2-5 kHz presence band is left to the voice.

- Values: Side spectrum over bed frames: half the power below 250 Hz (median f50; p10-p90 99-490 Hz), 90% below 1.0 kHz (median f90; p10-p90 460-2,470 Hz), share above 2 kHz median 4% (p90 13%), n=27.
- Evidence: n=27. evidence/bed_side_ltas.csv; numbers.json per_clip.*.bed_spectrum_side; scripts/a21_bed_spectrum_crest.py.
- Confidence: high

### A17. Use understated tonal underscore (sustained or plucked synths or keys, harmonic) with a light pulse or none. If it has a beat, keep it around 105 BPM (78-122).

- Values: Side octave-local spectral flatness: median 0.18-0.29 in 5 bed windows under speech, against 0.32-0.47 for opening swells and sub whooshes (6 windows). The voice-free clip25 outro measures 0.42, so flatness alone separates the classes only loosely. Horizontal harmonic lines are visible in the side spectrograms (read by eye). A steady pulse (window tempo IQR at most 7 BPM) was found in 11 of 27 bed clips: 78.4, 78.9, 80.0, 86.2, 96.8, 105.1, 106.8, 113.2, 118.3, 120.0, 122.4 BPM (median 105). The other 16 have no stable pulse (ACF peak under 0.15 or window tempo IQR over 20 BPM). The genre is inferred from spectra, not heard.
- Evidence: n=27. evidence/flatness_windows.csv, evidence/bed_pulse_summary.csv, evidence/bed_tempo.csv, evidence/bed_tempo_kickband.csv, evidence/bed_tempo_acf.png, evidence/spec_clip02_0-12.png, evidence/spec_clip30_8-16.png; snippets A_bed_side_clip02_+12dB_20-30s.wav, A_bed_side_clip30_pulse105_+12dB_5-15s.wav.
- Confidence: medium (genre class needs an audition)

### A18. Keep the bed wide in stereo: its side signal only about 7-10 dB under its mid.

- Values: Bed side minus mid in word gaps: median -9.5 dB (p10-p90 -13.9 to -3.9, n=19; the voice tails make this an underestimate of the width). Clean clip25 outro: side -34.0 LUFS against a total of -27.0 LUFS.
- Evidence: evidence/voice_bed_levels.csv (bed_gap_width_dB_robust); numbers.json summary_stats.bed_width_dB_ngaps_ge3.
- Confidence: medium

### A19. Pick a different bed track for each video from a library. Reusing one is acceptable but rare. Within a video the bed is a looping section of one track.

- Values: Side-waveform matching (2 kHz, 4 s chunks): one shared track among 27 bed clips, clip04 (2026-03-24) and clip26 (2026-10-28), with r 0.64-0.88 in 11 of clip04's 19 chunks and 11 of clip26's 17 at one constant offset (clip04 t = clip26 t - 24.5 s). Both clips also show the same kick-band pulse (78.4 and 78.9 BPM). Best cross-clip r for every other clip is 0.39 or less. Self-match at lags of 4 s or more reaches r 0.53-0.96 in 21 of 27 bed clips (repeating loops).
- Evidence: n=27. evidence/bed_recurrence.csv, evidence/bed_recurrence_matrix.png; scripts/a12_recurrence.py; snippets A_bed_side_clip04_shared_+12dB_0-8s.wav and A_bed_side_clip26_shared_+12dB_24.47-32.47s.wav.
- Confidence: high

### A20. Do not tie bed changes to cuts or sentence boundaries. When the bed stops or restarts mid-video it does so abruptly, at a point unrelated to the picture or the script.

- Values: 96 internal bed off/on edges in 15 clips (end fades excluded): 17% within 150 ms of a cut (chance about 20%), 8% within 300 ms of a sentence end, median distance to a cut 492 ms. Edge fade median 135 ms (p90 650 ms). 47 off-gaps are shorter than 1.5 s (possibly breaks in the track itself). 49 are longer, up to 53.8 s (clip21's bed stops at 22.1 s and never returns).
- Evidence: n=96 edges in 15 clips. evidence/bed_edges.csv (all edges incl. end fades), stats from scripts/a25_checks.py, evidence/bed_timeline.png; snippets A_bed_hard_stop_clip20_8.5-13s.wav, A_bed_restart_clip20_61-65s.wav, A_bed_gap_clip14_12-15.5s.wav.
- Confidence: medium

### A21. Mute the audio of the inserted footage (launch films, demos, news clips, posts). Only the voice, the bed and the editor's effects are heard.

- Values: Cut-triggered average at 700 top-panel footage cuts: no step in any band (side broadband, side above 4 kHz, side below 160 Hz, mid below 63 Hz, mid 8-16 kHz all within +-1.3 dB of baseline, the same as random times). The 3 no-bed clips contain 96 full and 95 top-panel cuts yet have a digitally silent side and a -62 to -69 dBFS floor between phrases. The only non-music stereo sounds found (sub whooshes, A23) recur across unrelated topics, so they are library effects.
- Evidence: n=30 (1,506 cuts). evidence/cut_triggered_average.png and .csv (scripts/a07_cut_triggered.py), evidence/voice_decay.csv; check snippets A_footage_check_clip30_crowd_8-16s.wav and A_footage_check_clip16_launch_23-31s.wav.
- Confidence: medium (low-level mono footage sound under continuous speech cannot be excluded without listening)

### A22. Use sound effects sparingly: on average fewer than one effect every two minutes beyond the opening, and most videos have none.

- Values: Stereo sub-whooshes: 17 events in 8 of 30 clips (clip16 7, clip17 3, clip18 2; clip01, 10, 11, 12 and 24 one each), 0.46 per minute overall. No click, pop, typing, UI or riser class was found. Mono sub-band candidates (<56 Hz) could not be told apart from bed bass: 24% on a cut against 19% chance, p=0.05, so they are not a rule.
- Evidence: n=30. evidence/sfx_events.csv, evidence/sfx_sync.csv, evidence/side_events.csv; scripts/a10_side_events.py, a18_sfx_catalog.py.
- Confidence: medium (the detector sees stereo effects reliably; mono effects buried under speech may be missed)

### A23. When using a whoosh, use a sub-bass whoosh: a noise swell centred at 40-90 Hz, attack about 130 ms, decay of 20 dB in about 310 ms, peaking about 10 dB over the voice RMS in the side channel. It is felt on headphones and nearly inaudible on phone speakers.

- Values: Measured instances (clip16@46-77, clip16@350-377, clip16@662-705, clip16@1222-1251, clip18@379-408, clip18@1548-1577): side peak -3.0 to -15.6 dBFS (mid -10 to -18 dBFS at the same moment), attack (-20 dB to peak) 100-130 ms (370 ms for the long variant), decay (peak to -20 dB) 280-390 ms, centroid 42-92 Hz, 90% of energy below 60-170 Hz. L/R correlation is 0.07-0.17 for the shared sample (L about equal to -R, very wide) and 0.79-0.84 for the others. The same sample appears 3 times in clip18 (one use mono) and in clip16 (template r 0.99).
- Evidence: n=8 measured events in 2 clips (template hits in 2 clips). evidence/template_whooshA_hits.csv (scripts/a17_template_match.py), evidence/spec_clip16_0-6.png, evidence/spec_clip18_13-19.png, evidence/spec_clip16_13.5-18.5.png; snippets A_subwhoosh_clip16_cut_1.6-3.4s.wav, A_subwhoosh_clip16_cut_side_1.6-3.4s.wav, A_subwhoosh_clip18_same_sample_15.6-17.2s.wav, A_subwhoosh_clip18_mono_use_55.2-56.6s.wav.
- Confidence: low (the effect is concentrated in 3 clips)

### A24. If a whoosh accompanies a cut, land its energy peak about 40 ms after the cut frame (1 frame at 23.976 fps). Do not put a whoosh on every cut.

- Values: 8 of 17 sub-whoosh peaks lie within 150 ms of a full or top-panel cut, against 16.8% expected by chance (binomial p of about 0.001). Offsets of those peaks after the cut: +27, +30, +31, +42, +44, +71, +88 and -137 ms (median +43 ms). The other 9 lie 0.2-1.8 s from any detected cut, inside footage runs. Only 8 of the 1,506 detected cuts carry one (0.5%).
- Evidence: n=17 events, 1,506 cuts. evidence/sfx_events.csv (peak_offset_ms, on_cut_150ms), evidence/sfx_sync.csv (chance per clip), evidence/visual_events.csv; e.g. clip16@55 (peak 2.28 s, top cut 2.252 s), clip12@1629, clip10@53.
- Confidence: low (17 events, mostly 3 clips; cut list is my own coarse detection)

### A25. Optionally open on a low, wide noise swell that starts on frame 0, peaks at about 0.37 s, and decays 20 dB over about 0.6 s, under the opening title. The rarer variant is a hit at 20-30 ms with a 0.6-2 s tail.

- Values: In 9 of 30 clips (clip01, 03, 07, 08, 13, 15, 17, 21, 24; clip16 borderline at flatness 0.33) the side level over 0-0.5 s is 10-29 dB above the clip's bed median and noise-like (octave flatness 0.35-0.43). Swell shape (clip03, 08, 13, 15, 16, 24): side peak -13.0 to -18.7 dBFS at +360 to +490 ms, decay of 20 dB in 490-860 ms, side median frequency 30-140 Hz, 90% of energy below 80-510 Hz. Hit shape (clip07, 17): peak at +20/+30 ms, decay 600-1,980 ms. Change over time: 6 of the first 15 clips against 3-4 of the last 15.
- Evidence: n=30. evidence/opening_hit.csv, evidence/montage_open_0-3s.png (read by eye for shape), evidence/spec_clip13_0-3_open.png, evidence/spec_clip15_0-3_open.png; snippets A_open_swell_clip13_0-3s.wav, A_open_swell_clip13_side+12dB_0-3s.wav, A_open_swell_clip15_0-3s.wav, A_open_swell_clip24_0-3s.wav, A_open_hit_clip17_0-3s.wav, A_open_hit_clip07_0-3s.wav.
- Confidence: medium (it may be the music track's own intro hit, not a separate effect; the title's own timing is the hook analyst's)

### A26. Do not add high-frequency swishes on cuts as a system. At most there is a faint high-band lift into some full-frame cuts.

- Values: Cut-triggered average of side >4 kHz: +5.4 dB peaking 20 ms before full-frame cuts, then -1.3 dB after (n=754), against +0.2 dB at top-panel cuts (n=699) and +0.9 dB at random times (n=4,453). Per cut, the share with a lift over +12 dB is 59% at full cuts against 51% at random times, a small difference.
- Evidence: n=754 full cuts. evidence/cut_triggered_average.png and .csv; scripts/a07_cut_triggered.py.
- Confidence: low

### A27. Ignore the 1-3 frame stereo blips in the mono clips. They are HE-AAC stereo-coding artifacts, not effects.

- Values: In the no-bed clips: 32 side blips in clip06 and 65 in clip23, each 30-170 ms long (1-3 AAC frames of 46 ms) at -39 to -75 dBFS, with no relation to cuts (offsets spread from -3.2 to +4.3 s).
- Evidence: n=2 clips. evidence/overview_clip23.png (red spikes), inline listing (scripts/a10_side_events.py output, evidence/side_events.csv rows for clip06, clip23); snippet A_codec_side_blip_clip23_side+30dB_33.8-34.8s.wav.
- Confidence: medium

## Constant and variable

CONSTANT (all 30 clips, or all bed clips): integrated loudness -14.2 +-0.1 LUFS; LRA about 2 LU (one music-outro outlier); HE-AAC 44.1 kHz stereo delivery; voice mono and dead centre with no stereo processing; speech from frame 0; tight pauses (median gap 200 ms); clip ends about 0.2 s after the last word; bed (when present) at full level from frame 0, never ducked, dark spectrum (median 90% of side energy below 1 kHz); footage audio not used. VARIABLE: whether there is a bed (22 full, 5 partial, 3 none, with no topic or date pattern measured); the bed track itself (a new one almost every video; one repeat in 27); bed level under the voice (6-14 LU by the gap estimate); pulse or none (11 of 27 pulsed, 78-122 BPM); the end treatment (driven by date: hard stop before 2026-07, about 1.1 s fade after); the opening swell (9-10 of 30); sub-whooshes (8 of 30, clustered June-July 2026 in clip16-18); codec bandwidth (16 kHz low-pass up to 2026-05-11, about 18 kHz later, a platform or delivery change). NEVER OBSERVED: ducking or sidechain pumping, reverb or stereo width on the voice, footage audio, a bed fade-in at the start (except clip10), effect classes other than low swells and sub-whooshes (no clicks, pops, typing, risers or UI sounds as a system), bed changes aligned to section boundaries.

## Open questions

- Is the frame-0 swell (A25) a separate effect or the first beat of the music track? A listen to the six A_open_* snippets, or finding the same swell at the start of a known stock track, would decide it.
- What genre are the beds? Class and instrumentation are inferred from tonal side spectra and weak pulses. A listen to A_bed_side_* and A_bed_only_outro_clip25 decides it.
- Is any low-level mono footage sound mixed under speech during full-frame footage? The side channel and cut-triggered averages show nothing, but mono sound under continuous speech is not separable by code. Listening to A_footage_check_clip30_crowd and A_footage_check_clip16_launch decides it.
- Why do partial-bed clips (01, 15, 16, 20, 21) drop the bed for long stretches? Edges do not align with cuts or sentence ends (A20). A per-section layout and topic map from the structure and layout analysts might explain it.
- Bed level (A14) rests on 3-7 short gaps per clip, and only one clean bed-only stretch exists (clip25). A stem-separation pass, which was not run (no separation model installed and the CPU is shared), would firm up the 10-13 LU figure.
- Whoosh counts are lower bounds: the side detector merged one clip18 whoosh into a longer event (the template found 3 uses, the detector 2). Template matching was run for one sample only.

## For a person to check

- Nothing was listened to and no playback was watched. All snippets are in evidence/snippets/ (16-bit WAV with 10 ms edge fades). Side-only files have the voice cancelled and the gain shown in the file name.
- Bed genre, instrumentation and how loud it sounds under the voice: A_bed_under_voice_clip10_20-28s.wav, A_bed_only_outro_clip25_46-61.3s.wav, A_bed_side_clip02_+12dB_20-30s.wav, A_bed_side_clip30_pulse105_+12dB_5-15s.wav.
- Same track in two videos (confirm it is one track): A_bed_side_clip04_shared_+12dB_0-8s.wav and A_bed_side_clip26_shared_+12dB_24.47-32.47s.wav.
- Opening swell or hit and whether it belongs to the music: A_open_swell_clip13_0-3s.wav (and its side+12dB version), A_open_swell_clip15_0-3s.wav, A_open_swell_clip24_0-3s.wav, A_open_hit_clip17_0-3s.wav, A_open_hit_clip07_0-3s.wav; a no-bed opening for contrast: A_open_none_clip23_monoVO_0-3s.wav.
- Sub-whoosh character on headphones and on a phone speaker: A_subwhoosh_clip16_cut_1.6-3.4s.wav, A_subwhoosh_clip16_footage_run_14-18s.wav, A_subwhoosh_clip18_same_sample_15.6-17.2s.wav, A_subwhoosh_clip18_mono_use_55.2-56.6s.wav.
- Bed stops and restarts mid-video (deliberate edit or a break in the track?): A_bed_hard_stop_clip20_8.5-13s.wav, A_bed_restart_clip20_61-65s.wav, A_bed_gap_clip14_12-15.5s.wav.
- End treatments: A_end_fade_clip30_46-50.29s.wav (about 1.2 s fade, current), A_end_hard_clip07_41-45.04s.wav (hard stop, early), A_end_fade3s_clip03_68.2-73.23s.wav.
- Voice character (dry, bright, compressed, gated): A_voice_dry_clip23_40-48s.wav, A_voice_dry_clip27_20-28s.wav.
- Footage audio truly absent: A_footage_check_clip30_crowd_8-16s.wav (crowd and launch footage on screen), A_footage_check_clip16_launch_23-31s.wav (full-frame launch-film footage).
- Codec blip sanity check (should be inaudible): A_codec_side_blip_clip23_side+30dB_33.8-34.8s.wav.
