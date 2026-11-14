# Audio

Audio of all 11 in-style clips (426.6 s, 12,791 picture frames) was decoded to 48 kHz stereo and measured with ffmpeg ebur128 and numpy/scipy. Nothing was listened to; every class name is inferred from envelope and spectrum. The files are HE-AAC at about 60 kbps, so the top octave is a codec replica and stereo detail is coarse.

The mix is identical in every clip: -14.4 LUFS integrated, loudness range 2.2 LU, true peak -0.5 dBTP, crest 16.5 dB. The voice is mono, centre, about 101 Hz fundamental, empty below 75 Hz, speaking 89% of the time at about 265 words a minute with no pause longer than 230 ms. One music bed, the same recording at the same start position and the same gain (+-0.2 dB), runs under all 11 clips: 90 BPM, 20 dB under the voice (-37.4 LUFS in its drumless 16-beat intro, about -33 LUFS after), static with no ducking, hard start at 48 ms, 1.0 s linear fade-out. Because the bed is sample-aligned across clips it was separated by a cross-clip complex median, which also made per-clip gain, fade and ducking measurable.

No sound effect was found on any of 1,495 picture events (layout moves, graphic changes, caption onsets, calls to action); the 11 title builds start on the same frame in every clip, so a sound there could not be separated from the bed, and none is visible. Probe effects injected and re-encoded set the detection limits: stereo effects and low thumps down to about -24 to -30 dB under the mix, caption clicks to -24 dB, mono whooshes to about -12 to -18 dB. Picture changes land on sentence starts, and the picture is not cut to the bed's beat. A person must listen to confirm the absence of effects.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [A01] Master the finished mix to -14.4 LUFS integrated (EBU R128).

- Values: Integrated loudness -14.4 LUFS in 8 clips, -14.3 in 2 (clip35, clip37), -14.2 in 1 (clip32); median -14.4, range -14.4 to -14.2, n=11. Own BS.1770 implementation agrees within 0.07 LU.
- Evidence: n=11 clips, 426.6 s, ffmpeg ebur128 on the mp4 audio.
- Confidence: high

### [A02] Keep the mix dense: loudness range about 2 LU, short-term loudness inside -16 to -12 LUFS.

- Values: LRA median 2.2 LU (1.2 to 3.9). Short-term (3 s) maximum median -12.8 LUFS (-13.5 to -11.8); short-term minimum median -16.0 LUFS (-19.5 in clip30 inside the quoted audio, else -17.4 to -15.6; the -19.5 window is 13.4-16.4 s). Momentary (400 ms) p90 minus p10: median 7.0 LU (5.9 to 8.4). n=11.
- Evidence: n=11 clips.
- Confidence: high

### [A03] Peak ceiling just under full scale, no clipping; crest factor 16.5 dB.

- Values: True peak median -0.5 dBTP (-0.7 to -0.4). Sample peak median -0.54 dBFS (-0.72 to -0.39). 0 samples over 0 dBFS; 2 to 7 samples per clip within 0.1 dB of the maximum; longest run at the maximum 1 to 3 samples. RMS -17.0 dBFS (-17.15 to -16.89). Crest (sample peak over RMS) 16.5 dB (16.3 to 16.6). True peak minus integrated 13.9 LU (13.6 to 14.0). n=11. These are post-transcode values; -1 dBTP before encoding is a suggestion, not a measurement.
- Evidence: n=11 clips.; peaks
- Confidence: high

### [A04] The voice is mono and dead centre. Nothing of the voice goes to the side channel.

- Values: L minus R RMS: 0.00 dB in 10 clips, -0.01 dB in 1. L/R correlation 0.9976 to 0.9983. Whole mix: side is -29.9 dB re mid (-30.6 to -29.2). In speech frames, 300-3400 Hz: side -31.5 dB re mid (-33.4 to -30.6); that residue is the bed's side plus codec leakage (blocks of -15 to -30 dB under consonants). n=11.
- Evidence: n=11 clips... clip39, (clip36@1036, clip35@89, clip31@464, clip33@795)
- Confidence: high

### [A05] Voice band: nothing below about 75 Hz, no low-pass at the top. A high-pass at 80 Hz reproduces the low end.

- Values: Voice-only spectrum (bed removed, speech frames, 0-10.5 s) re its strongest bin in 95-260 Hz: -4.2 dB at 100 Hz, -5.2 at 90, -11.6 at 80 (-14.7 to -9.2), -20.8 at 70 (-22.8 to -18.5), -29.0 at 60, -31.5 at 50 Hz; n=11. Fundamental: median 101 Hz (98 to 111), p10 83-88 Hz, p90 131-148 Hz. Top of the mix re the 200-2000 Hz density: -40 dB at 12.8 kHz (10.1 to 12.8), -60 dB at 17.7 kHz (17.1 to 17.7), -80 dB at 19.95 kHz (codec cliff at 20 kHz).
- Evidence: n=11 clips.. A high-pass filter and the speaker's own pitch floor cannot be told apart; the top octave is an SBR replica of the codec.
- Confidence: medium: the codec limits what can be said about both ends

### [A06] Voice tone: energy sits at 200-630 Hz, presence is a flat shelf 12-15 dB lower, with a narrow dip near 2.1 kHz that belongs to the presenter chain. Do not add master EQ.

- Values: Third-octave levels of the mix in speech frames (median of 11 clips, dBFS): 125 Hz -30.9, 200 Hz -27.2, 400 Hz -24.7, 500 Hz -24.8, 630 Hz -26.7, 1 kHz -39.6, 2 kHz -45.1, 2.5 kHz -39.8, 4 kHz -40.1, 6.3 kHz -34.5, 8 kHz -38.0, 10 kHz -46.7, 12.7 kHz -55.0, 16 kHz -66.0; spread between clips 1.0 to 2.9 dB per band. Dip: 2136 Hz median (2121 to 2238), -11.0 dB (-13.0 to -9.7) re the 1.3-1.6 and 2.7-3.2 kHz shoulders, n=11 (presenter speech). The quoted voice in clip30 has no such dip (minimum at 2473 Hz, -6.2 dB), so it is not on the master.
- Evidence: n=11 clips.; audition
- Confidence: medium: cause of the dip unknown (microphone, room, EQ or noise reduction)

### [A07] Speech fills 89% of the runtime at about 265 words per minute.

- Values: Speech activity share median 0.89 (0.865 to 0.900), n=11. Words per minute over the clip: median 265 (241 to 286). Words per minute of speech time: 269 to 323. Speech-frame level -13.99 LUFS median (-14.09 to -13.77).
- Evidence: n=11 clips, 1854 transcript words (machine transcript, not verified). Four-band activity detector referenced to the bed estimate, 10 ms frames.
- Confidence: high for activity; medium for words per minute (machine transcript)

### [A08] Cut every presenter pause to 230 ms or less. Typical surviving pause: 140 ms.

- Values: Presenter pauses of 100 ms or more: n=110 over 11 clips (quoted audio of clip30 excluded). Median 140 ms, p10 100, p90 200, maximum 230 ms. 6 pauses of 200 ms or more, 0 of 250 ms or more. Per clip: median 130 to 170 ms, maximum 190 to 230 ms, 2.2 to 3.9 pauses per 10 s. Level in pauses equals the bed (rule A14).
- Evidence: Longest per clip: clip29@923-930, clip34@633-640, clip35@585-592 (all 220-230 ms), clip31@434-440, clip32@831-838, clip33@619-625, clip36@893-899, clip37@222-228, clip38@902-908, clip39@120-126.. Cross-check with transcript word gaps: 90.8% of 1843 gaps are 0 ms (words are written contiguous), 48 gaps are 200 ms or more and 24 of them overlap an energy pause; transcript maxima 220 to 440 ms overstate the pauses.
- Confidence: high
- Verified, confirmed: Pauses of 100 ms or more, speech = any of 3 bands (150-1000, 1000-4000, 4000-9000 Hz) more than 6 dB over the bed: n=145 in 11 clips, median 132 ms, p90 201 ms, maximum 242 ms (clip34@634-641); longest per clip 188-242 ms; 16 of 200 ms or more, 0 of 250 ms or more; 3.5 per 10 s. At 3 dB: n=88, max 228 ms. At 10 dB: n=252 (the structure count), max 290 ms, 7 of 250 ms or more, still 0 of 300 ms or more. The 0.39 s pause of S17 (clip30 at 40.93 s) is not a pause: a fricative at 4-9 kHz (-33 dBFS, 20 dB over the bed) runs from 40.98 to 41.09 s; it is absent in clip35 and clip38 at the same music time, so it is the presenter, not the bed. The true gap there is 41.10-41.33 s, 230-240 ms. Error: -5 to -10 ms from the 10.7 ms analysis window. Build value: no pause longer than 250 ms; aim for 130-140 ms.

### [A09] Open with a 3-frame pre-roll: the bed enters at 48-51 ms, the voice at about 117 ms, the title's first change is on frame 3.

- Values: Decoded audio is below -47 dBFS for the first 45 ms in 11 of 11 clips (below -52 dBFS in 10). Bed onset 51.1 ms in 10 clips (32.1 ms in clip35), reaching -35 dBFS inside one 5 ms window. Voice onset median 116.6 ms (106.5 to 198.2), n=11. First changed picture frame: frame 3 (100 ms) in 11 of 11.
- Evidence: clip29@0-6... clip39@0-6; (voice_start_ms, bed_start_ms)
- Confidence: high as measured in the files; the 48 ms may be a codec delay baked in by the platform (open question)
- Verified, confirmed: The bed is first. 0-50 ms: near silence, -52 to -72 dBFS rms (not digital zero). Bed onset: crosses -50 dBFS at 49.7-49.8 ms and -40 dBFS at 50.83-50.90 ms in 11/11, sample-identical across clips. clip35 is not earlier: a -47 dBFS blip at 32 ms precedes the same 50.85 ms onset. Voice: the residual against the cross-clip bed passes -40 dBFS at 108 ms median (71-112), sustained at 110 ms (100-145), n=11. The stream carries an edit list for its 5058 priming samples and the decoder applies it (decoded length matches to the sample), so the 50 ms is in the published timeline, not an undeclared codec delay. Build value: bed in at 0.050 s, voice at 0.11 s.

### [A10] End tight: the file stops 60 ms after the last word. The voice is not faded.

- Values: End of file minus end of last speech: median 60 ms (10 to 250 ms), n=11. Voice-band level in the last 250 ms re the clip's mean speech level: -3.9 to -8.2 dB in the 6 clips where speech runs into the last 80 ms and is not a weak syllable (clip29, 34, 35, 36, 37, 38); a 1 s master fade would put it at -12 dB or lower.
- Evidence: clip29@1192-1199, clip34@1220-1227, clip36@1178-1184; (tail_after_last_speech_s, voiceband_last250ms_minus_speech_db)
- Confidence: medium: the no-fade statement rests on 6 clips and an indirect test
- Verified, not confirmed (the other claim holds): Held: the field stays within 1.1 luma levels (mean abs) of the last frame for the final 41-113 frames in 11/11; no fade, no end card. End of the last speech energy (6 dB over the bed) to the end of the video: median 2.7 frames, range 0.2-5.7 (n=11); to the end of the audio: median 118 ms, 22-240 ms. The audio stream is up to 52 ms longer than the video. Build value: end the file 3 frames (0.10 s) after the last word, allowed 0 to 6.

### [A11] Every clip carries the same music bed, the same recording started at the same position, sample-aligned to the start of the file.

- Values: 55 clip pairs: side channel 40-4000 Hz normalised cross-correlation 0.85 (0.81 to 0.88) with the peak at lag 0 samples in 55 of 55; mid 25-70 Hz 0.95 (0.94 to 0.96) at lag 0 +-2 samples. In 5 s windows against clip30 the lag stays 0 +-1 sample to 40 s. Bed present from 0.05 s to the last sample in 11 of 11.
- Evidence: n=11 clips, 55 pairs., (side panel shows the same pattern in every clip)
- Confidence: high

### [A12] Bed gain is one fixed value for every video.

- Values: Bed gain of each clip relative to the others (projection in voice-free bands, median over 0-28 s): -0.15 to +0.18 dB, n=11.
- Evidence: n=11 clips, 112 windows of 250 ms each.
- Confidence: high

### [A13] No ducking and no side-chain: the bed gain does not move with the voice.

- Values: Bed gain in 250 ms windows: speech share 95% or more, n=847 windows, median -0.01 dB (p10 -0.41, p90 +0.35); speech share 60% or less, n=125 windows, median +0.12 dB (p10 -0.14, p90 +0.41). Difference +0.12 dB. In 179 pauses of 80 ms or more (13.6 s) the clip level over the bed estimate is -0.39 dB median (p5 -4.2, p95 +1.6, max +3.7).
- Evidence: n=11 clips., ducking
- Confidence: high
- Verified, confirmed: In the 35-70 Hz band, under the voice fundamental: level in pause frames minus level in speech frames, each against the cross-clip median at the same music time, -0.11 dB (303 pause frames, 5247 speech frames of 50 ms). In four stretches where clip30 has no voice for 0.2-0.48 s, its 35-70 Hz level equals the other 10 clips under speech at the same music time within 0.1-0.2 dB (-36.5 against -36.6, -35.7 against -35.9, -34.7 against -34.5, -47.8 against -47.9 dBFS). Build value: constant bed gain.

### [A14] Set the bed 20 dB under the voice overall: about -37.5 LUFS in the 16-beat intro, -33 LUFS once the drums are

- Values: K-weighted bed loudness from pairwise cross-power between clips: beats 0-16 (0.05-10.7 s) -37.4 LUFS; beats 16-28 (10.7-18.7 s) -33.2; beats 28-32 (18.7-21.4 s) -36.3; from beat 32: -32.5 (21.3-28.4 s, 55 pairs), -32.9 (21.3-34.5 s, 28 pairs), -33.3 (28.4-39.5 s, 15 pairs). 0-28.4 s: -34.35 LUFS = -20.0 dB re the mix. Under the voice by section: -22.8, -18.9, -21.9, -18.1 dB. Independent check, level measured directly in pauses: median -33.9 LUFS (p25 -35.9, p75 -31.6), n=179 pauses; per clip -34.6 to -32.4 LUFS. Bed RMS: mid -36.4/-31.8/-34.2/-31.0 dBFS, side -45.4/-58.4/-43.7/-45.1 dBFS for the four sections.
- Evidence: n=11 clips, 55 pairs to 28.4 s., (clip30@320-348, bed alone)
- Confidence: high
- Verified, confirmed: Mix: -14.4 LUFS integrated (ebur128, whole file; -14.4 to -14.2, n=11). Bed alone, ebur128 on WAVs made only of speech pauses (3 dB criterion, 100 pauses, 6.4 s): beats 0-16 (0.05-10.7 s) -36.5 LUFS (21 pauses, 9 clips); 10.7-18.7 s -34.8; 21.35 s on -33.1 (45 pauses, 11 clips); all -34.3 LUFS = 19.9 dB under the mix. The same samples with a BS.1770 filter in numpy: -36.35 / -34.6 / -32.9 / -34.0. With the looser 6 dB criterion: -35.9 / -33.5 / -30.9 (voice tails leak in). Bed before the first word (56-100 ms): -35.6 LUFS (n=11). Bed alone in clip30 (13.41-13.83 s): -35.1 LUFS. Side channel 7-22 dB under the mid. Error +-1 dB. Build value: bed 20 dB under the mix: -36.5 to -37.5 LUFS for the first 16 beats (to 10.7 s), -33 LUFS after, with the mix at -14.4 LUFS.

### [A15] Start the bed hard, with no fade-

- Values: Bed-only bands (mid 30-70 Hz + side 40-8000 Hz), 5 ms windows, median of 11 clips, dB re the 0.3-1.3 s mean: -45 at 0 ms, -34 at 15-25 ms, -21 at 40 ms, -11 at 50 ms, -4 at 60 ms. Full-band level steps from -53..-64 dBFS in the 45-50 ms window to -34..-35 dBFS in the 50-55 ms window in 11 of 11. The start carries a 50 ms broadband transient in the side channel: 500-2000 Hz at -68 to -71 dBFS from 50 to 90 ms, against -103 dBFS afterwards (same in all clips, part of the bed estimate).
- Evidence: clip29@0-3... clip39@0-3.
- Confidence: high

### [A16] Fade the bed out with a 1.0 s linear-amplitude ramp that reaches zero on the last sample. Only the bed fades.

- Values: Bed gain over the last 1.6 s, 40 ms windows, 10 clips (clip30 has no reference clip at its end): best linear ramp length median 1.05 s (0.95 to 1.12), RMSE 0.10 to 0.18; exponential fit RMSE 0.13 to 0.26; linear is better in 9 of 10. Measured gain: about -5 dB at 600 ms before the end (-3.2 to -9.7, one outlier), -7.3 to -16 dB at 400 ms, -12.6 to -21.9 dB at 200 ms in 7 clips (3 clips read lower where the bed itself has a gap); a 1.0 s linear ramp gives -4.4, -8.0, -14.0 dB.
- Evidence: clip29@1170-1199, clip31@824-853, clip32@1006-1035, clip33@1038-1067, clip34@1198-1227, clip35@1232-1261, clip36@1155-1184, clip37@893-922, clip38@1294-1323, clip39@828-857.
- Confidence: high for a fade of about 1 s (n=10); medium for the linear shape

### [A17] Bed tempo is 90 BPM; its beat grid starts with the bed at 0.045 s.

- Values: Beat 0.6667 s: comb fit on high-band onsets 0.6666 s, on low-band onsets 0.6667 s; autocorrelation peaks at 2.665, 5.335 and 10.665 s. Grid phase: 51 hat onsets between 21.4 and 39.4 s fall 32 to 45 ms after an eighth-note line counted from 0 (42 of them; the other 9 sit a sixteenth later, at 207-210 ms), so beat k is at 0.045 + k x 0.6667 s.
- Evidence: 1 track seen in 11 clips, cross-clip bed estimate 0-39.4 s.
- Confidence: high

### [A18] Bed arrangement: 16 beats without drums, drums and sub from beat 16, a 4-beat break at beat 28, the full beat with eighth-note hats from beat 32.

- Values: Section changes at beats 16 (10.71 s, frame 321), 28 (18.71 s, frame 561), 32 (21.38 s, frame 641). Bed estimate band levels: sub 30-70 Hz -51.5 dB before beat 16, -42 dB after, -49 dB in the break; air 6-14 kHz -70 dB before beat 32, -55 dB after. Harmonic loop 8 beats (5.333 s): side self-correlation 0.61 at 8 beats, 0.00 at 4 beats, 0.58 at 16; low band 0.68 at 8 beats. After beat 60 (40 s) the arrangement changes again (3 clips or fewer); from 44.2 s only clip30 shows it, with side level steady at -45.4 to -46.3 dBFS per 8 beats to 61 s.
- Evidence: clip29@321, clip29@561, clip29@641 and the same frames in the other 10 clips., bed.clip30_after_40s
- Confidence: high for beats 0-32 (11 clips); low after 40 s (1 to 3 clips)

### [A19] Bed spectrum: a low-heavy track. Sub fundamentals at 54 and 72 Hz; almost nothing above 2 kHz until the hats arrive.

- Values: Third-octave levels of the bed (mid, pairwise cross-spectra, dBFS) for intro / drums / full: 50 Hz -52.5 / -40.9 / -39.0; 100 Hz -47.3 / -39.8 / -39.3; 250 Hz -44.8 / -44.4 / -50.0; 500 Hz -47.1 / -45.1 / -43.6; 1 kHz -57.5 / -56.7 / -55.2; 4 kHz -61.6 / -61.5 / -58.5; 12.7 kHz -71.1 / -71.2 / -60.4. Strongest low peaks: 54.2 and 71.8 Hz with drums, 109.9 and 73.2 Hz in the intro. Above 2 kHz the estimate (-56 to -62 dB per band) is at the noise floor of the method.
- Evidence: n=55 pairs per section. (bed_* rows), bed.third_octave and build_spec.bed.low_peaks_hz
- Confidence: medium: levels above 2 kHz are an upper bound

### [A20] Bed stereo: wide in the drumless parts, mono when the drums play, hats and a 300 Hz element slightly wide.

- Values: Side minus mid (pairwise cross-spectra): intro -7.1 dB (L/R correlation 0.67), with 30-70 Hz at -0.5 dB and 70-150 Hz at -2.4 dB; beats 16-28 -26.2 dB (correlation 0.995); break -6.8 dB (0.66); full beat -13.5 dB (0.91), with 150-500 Hz at -4.1 dB and 6-16 kHz at -11.2 dB.
- Evidence: n=55 pairs per section.
- Confidence: medium: at 60 kbps the codec codes stereo coarsely

### [A21] Do not cut the picture to the music. The bed starts at 0 and runs free under the edit.

- Values: Picture events against the eighth-note grid (Rayleigh test): layout moves n=34, R=0.14, p=0.53; big graphic changes n=78, R=0.07, p=0.66; small graphic changes n=54, R=0.10, p=0.56; caption onsets n=1318, R=0.012, p=0.83. Share within +-33 ms of a grid line: layout 11.8%, big graphic 21.8%, call to action 18.2%; chance is 20%. Call to action n=11, R=0.58, p=0.02 uncorrected among 15 tests: not accepted. Nearest layout or graphic event to the bed's section changes at 10.71 and 21.38 s: -7.75 to +3.62 s across clips.
- Evidence: n=11 clips, 1495 picture events from every-frame differences at 270x480.
- Confidence: high

### [A22] No sound effects. Title build, layout moves, graphic changes, captions and the call to action are silent apart from voice and bed.

- Values: Events carrying a detectable effect: 0 of 34 layout moves, 0 of 78 big graphic changes, 0 of 54 small graphic changes, 0 of 1318 caption onsets, 0 of 11 call-to-action arrivals. Title builds (11, all starting on frame 3): nothing distinct; a sound placed at the same sample in all 11 clips would be counted as bed, and the only such thing is the 50 ms start transient of rule A15. Side channel: 146 candidates above -48 dBFS, all with side below mid (-5 to -40 dB, centre of the distribution -22 dB) and shaped like the codec's band blocks under consonants. Pauses: no pause exceeds the bed by more than 3.7 dB K-weighted (n=179). Band above the voice (17.5-19.8 kHz): the loudest bursts are the bed's hats, at the same times in every clip. Sub band 20-70 Hz, bed removed: -54.4 dBFS at layout moves, -55.8 at big graphic changes, -54.2 at captions, -54.3 at random times. 10th-percentile spectra across caption onsets stay within -1.7 to +2.3 dB of random times (n=1275).
- Evidence: n=11 clips, 426.6 s., (clip29@115, clip29@540, clip31@218, clip31@337, clip32@133, clip32@195, clip32@443, clip32@510, clip37@92, clip37@233, clip37@681), (clip31@785, clip36@1125...)
- Confidence: medium: nothing was listened to; a quiet mono sound exactly under a sentence start is not excluded (rule A23)

### [A23] If any effect exists it is quieter than these limits; treat anything louder as absent.

- Values: Probe effects mixed in at picture events and passed through HE-AAC 60 kbps: a stereo whoosh is found at 100% of 106 events at -24 dB re the clip loudness and at 72% at -30 dB (without probe: 11% after re-encoding, 24% in the original files, both codec leakage of the voice); a 55 Hz thump is found at -24 dB (median +5.9 dB over random times; without probe +2.7); a 12 ms click on every caption is found at -24 dB (10th-percentile lift +5.2 dB; without probe +1.8); a mono 300 ms whoosh is found in 42% of 64 pre-event pauses at -12 dB and 16% at -18 dB (0% without probe). The reused-sample cross-correlation test is blind: median 0.153 for real events, 0.150 for control onsets, 0.180 with a -6 dB probe.
- Evidence: n=11 clips re-encoded per probe and level (ffmpeg aac_at, profile HE-AAC).
- Confidence: medium: the probes are my guesses at typical effects, and the re-encoder is not the platform's

### [A24] What lands on a picture change is the next sentence, not a sound: start layout moves on the first word after a short pause.

- Values: 27 of 34 layout moves and 37 of 78 big graphic changes have a bed-only gap of 50 ms or more in the 300 ms before the first changed frame. Voice onset relative to the first changed frame (positive = after the picture): median -54 ms, p10 -142, p90 +30, n=64. The high-frequency burst that follows starts with the voice (median -1 ms from the voice onset, same as -4 ms at 130 control onsets) and is not locked to the picture (standard deviation 108 ms; one frame is 33 ms). Picture event minus nearest transcript word start: layout +7 ms median, 82% within 2 frames; big graphic 63%; caption 64%. Speech onsets with a picture event are 9.8 dB brighter at 5-10 kHz than onsets without (n=39 against 140; 90% interval +3.5 to +15.4): sentence-initial consonants.
- Evidence: 
- Confidence: medium: word times come from the machine transcript (+-2 frames)

### [A25] Quoted source audio is level-matched to the presenter, left band-limited as it came, and the bed keeps playing under it at the same gain.

- Values: clip30 only: quoted audio from 3.7 to 18.7 s (+-0.3 s). Speech-frame level -13.75 LUFS against the presenter's -14.14 LUFS (0.4 dB). Spectrum re 200-2000 Hz: -25 dB at 6 kHz and -64 dB at 8 kHz (presenter -14 and -21 dB). Bed gain inside 0.02 dB, same as outside. Its own pauses are kept: 950, 680 and 400 ms.
- Evidence: clip30@111-561 (pauses at clip30@320-348, clip30@401-422, clip30@482-494).
- Confidence: low: seen in 1 clip

### [A26] Mix tokens: voice mono centre at -14 LUFS, bed static at -34 LUFS, no effects bus.

- Values: Mix -14.4 LUFS; voice in speech frames -13.99 LUFS (-14.09 to -13.77); bed -34.35 LUFS over the first 28 s (-37.4 intro, -32.5 to -33.3 body), that is 20 dB under; bed gain spread between videos 0.33 dB; ducking 0 dB; bed fade-in 0 ms, fade-out 1000 ms linear; effect level per class: none, there are no classes; peak -0.5 dBTP.
- Evidence: Rules A01, A07, A12-A16, A22. build_spec
- Confidence: high for voice and bed; medium for 'no effects'

### [A27] Bed of the same role (a new track, not a copy): 90 BPM, drumless 16-beat intro, mono sub-and-kick body, eighth-note hats from beat 32, 8-beat harmonic loop.

- Values: Intro, beats 0-16: pad of 3 detuned saw or triangle voices through a 12 dB/oct low-pass opening from 400 Hz to 3 kHz (the side channel's upper edge climbs from 0.5 to about 8 kHz over 10 s), L/R correlation about 0.65, lows as wide as the mid; -37.5 LUFS. Body, beats 16-28: sine sub 50-75 Hz with a soft kick (sine sweep 110 to 50 Hz in 60 ms, 150 ms decay) on a syncopated 2-beat pattern, pad low-passed near 500 Hz, mono (correlation above 0.99); -33 LUFS. Break, beats 28-32: drums and sub out; -36 LUFS. Full, from beat 32: add closed hats on eighth notes (noise band-passed 6-16 kHz, 5 ms attack, 40-60 ms decay, 20 dB under the low band, side 11 dB under mid) and a held stereo tone near 300 Hz; -32.5 to -33 LUFS. Hard start at 48 ms; 1.0 s linear fade to the last sample; static gain.
- Evidence: Derived from rules A14-A20.
- Confidence: medium: instrument names are inferred from envelope and spectrum, not heard

### [A28] Ship no effect samples and no effect recipes for this style.

- Values: Effect classes found: 0. Recipes: none. The style pack's sound folder needs one bed and nothing else.
- Evidence: Rule A22 (0 of 1495 separable picture events, plus 11 title builds that cannot be separated from the bed) and rule A23 (limits).
- Confidence: medium: depends on rule A22 surviving a listening check

### [A29] Nothing in the audio changed over the corpus period.

- Values: 2026-11-02 to 2026-11-07, 2 clips a day (1 on the last day): integrated loudness -14.4 to -14.2 LUFS on every date; the same bed at the same gain (-0.15 to +0.18 dB) on every date; the same 1.0 s end fade (0.95 to 1.12 s) on every date; 0 effects on every date.
- Evidence: n=11 clips over 6 days.
- Confidence: high

## Constant and variable

CONSTANT (11 of 11 clips): integrated loudness -14.4 LUFS (+0.2/-0.0); true peak -0.7 to -0.4 dBTP; crest 16.3 to 16.6 dB; voice mono centre; the bed recording, its start position, its start at 48-51 ms, its gain (+-0.2 dB), no ducking, 90 BPM grid from 0.045 s, section changes at beats 16, 28, 32; 1.0 s linear bed fade at the end (10 of 10 measurable); title's first change on frame 3; zero sound effects; zero pauses of 250 ms or more in presenter speech.

VARIABLE: loudness range 1.2 to 3.9 LU (driven by content; 3.9 is the clip with quoted audio); voice start 106 to 198 ms; tail after the last word 10 to 250 ms; pauses per 10 s 2.2 to 3.9; words per minute 241 to 286; how much of the bed's arrangement is heard (clip length 28.5 to 61.8 s); quoted source audio in 1 of 11 clips, which brings its own band limit (below 8 kHz) and pauses up to 950 ms. NEVER OBSERVED: ducking, bed fade-in, master fade, stereo voice, clipping, any sound effect, picture events placed on the bed's beat, a second music track.

## Open questions

- Is -14.4 LUFS set by the creator's export or by the platform's normalisation? An original export file would decide it.
- Are the first 48-51 ms of silence a codec delay baked in by the platform? If yes, every audio time here is 48 ms late against the picture. Checking lip sync on playback, or an original file, would decide it.
- Is there a quiet mono effect (below about -12 dB under the mix) hidden under the first consonant of sentences that start layout moves? Only listening decides; see needs_human_check.
- What is the bed: a library track, a generated track or the creator's own? Not identified; do not ship it. How it continues after 44 s is seen in one clip only.
- Is the voice high-passed at about 80 Hz, or is that the speaker's natural floor (f0 p10 is 83-88 Hz)? The numbers fit both.
- Was the voice sped up? 265 words a minute with a 101 Hz fundamental fits either a fast speaker with tight cuts or mild time compression; not measurable here.
- Is the 2.1 kHz dip of the presenter's voice (-11 dB) an EQ cut, a noise-reduction artefact or the microphone and room? It is absent from the quoted voice in clip30.

## Needs an eye or an ear

- Layout moves and graphic changes: confirm there is no whoosh, click or pop.
- Call to action: confirm there is no chime or hit.
- Clip start: is anything heard in the first 300 ms besides the bed starting hard (a click from the hard start, an intro hit)?
- Clip end: confirm the 1 s bed fade, that the voice is not faded and that there is no end sting.
- The bed: say what it is (genre, instruments) and whether 'pad, sub, kick, hats' is right. and its three section files (a cross-clip estimate: a faint garble of 11 voices is left in it), (the real bed alone for 0.95 s), (side channel only, voice-free)
- Side-channel candidates read as codec artefacts: confirm they are not effects. and,
- Two clips talk about sound effects (clip33, clip39): are any demonstration sounds played?
- Quoted audio in clip30: how it is treated and how it enters and leaves.
- Voice character: natural or synthetic, how compressed, whether noise reduction or the 2.1 kHz dip is audible.
- Audio-to-picture sync on playback, to settle the 48 ms question: any clip start, for example clip31@0-30.
