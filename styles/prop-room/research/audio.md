# Audio

Measured: The soundtracks of all 19 clips (697.1 s), decoded from their HE-AAC tracks by ffmpeg, with no listening and no playback: EBU R128 loudness, stereo image, voice band limits and gaps, the music bed (presence, recurrence across clips, alignment to a common track, gain against the voice, level, spectrum, tempo) and sound-effect candidates detected in the bands the voice leaves empty (16.3-19 kHz above its 15.9 kHz low-pass, and 25-80 Hz below its high-pass), timed against 361 picture cuts found on every frame. Every master is -14.1 LUFS, dual mono, with a static music bed under every frame and sparse effects that are not tied to cuts.

Not done: No listening and no playback; no forced alignment (word times are faster-whisper estimates, +-2 frames). Cuts were not split by layout type. Effects under the voice band were not separated (no source separation), so effects with no energy above 16.3 kHz or below 80 Hz are missed. Prop events were not inventoried; motion was measured only as the whole top-half frame difference. The older reels were not used, so there is no voice-only control clip for the bed-presence test. Effect class names are inferred from spectrum and envelope.

Evidence is cited as `clipNN@frame` (frames at 29.97 fps, counted from 0; ids are this style's own). File names in Evidence lines name files of the local study; they are not shipped. "Verified" lines give the independent verifier's verdict and final value; item numbers refer to [verification.md](verification.md).

## Rules

### [A01] Master every video to -14.1 LUFS integrated (EBU R128); this is a constant, not a range.

- Values: integrated -14.1 LUFS in 15 clips, -14.2 in 4; median -14.1, range -14.2..-14.1 (n=19).
- Evidence: n=19 of 19, whole clips (clip01@0-1197... clip19@0-1202); A_loudness.csv
- Confidence: high
- Verified, confirmed (item 16): integrated -14.1 LUFS in 15 clips, -14.2 in 4.

### [A02] Keep the mix almost flat in loudness: loudness range about 1.7 LU, short-term loudness inside a 2 LU band.

- Values: LRA median 1.7 LU (1.2-2.1); momentary (400 ms) p10/p50/p90 -17.8/-14.3/-11.9 LUFS pooled; short-term (3 s) p5/p50/p95 -15.1/-14.2/-13.2 LUFS; RMS median -16.65 dBFS (-16.82..-16.14); sample-peak-to-RMS crest 16.1 dB (15.2-17.6).
- Evidence: n=19; A_loudness.csv (per-clip LRA, crest, short-term max/p10)
- Confidence: high
- Verified, confirmed (item 16): LRA 1.7 LU (1.2-2.1).

### [A03] Peak-limit the master to -1.0 dBTP (the corpus sits near -0.6 dBTP; one clip overshoots after the platform encode).

- Values: true peak median -0.6 dBTP (-1.3..+1.3); only clip01 exceeds 0 dBTP (+1.3); sample peak median -0.61 dBFS. The -1.0 dBTP ceiling is a builder safety choice, not a measurement.
- Evidence: n=19; A_loudness.csv
- Confidence: high
- Verified, confirmed (item 16): true peak -0.6 dBTP median (-1.3..+1.3); only clip01 above 0.

### [A04] Deliver dual mono: voice, bed and effects all sit in the centre, L identical to R.

- Values: L/R correlation 1.0000 in 19/19; side-to-mid energy median -88 dB (worst clip -70 dB; worst 100 ms window -44 dB, clip10). No stereo width anywhere, including beds and effects.
- Evidence: n=19 whole clips; A_stereo_spectrum.csv
- Confidence: high
- Verified, confirmed (item 16): side/mid <= -69.9 dB (dual mono).

### [A05] Treat the reference audio format as HE-AAC (SBR) at 51-57 kbps; sample rate changed from 48 kHz to 44.1 kHz in three late clips. This is delivery, not style: render 48 kHz.

- Values: HE-AAC in 19/19; 48 kHz in 16 clips; 44.1 kHz in clip16, clip18, clip19 (published 2026-11-08, 11-09, 11-12); content above ~11-12 kHz is SBR-reconstructed (parametric), so fine spectral detail of effects above it is not reliable.
- Evidence: n=19; ffprobe (native_sr column of A_loudness.csv); numbers.json format
- Confidence: high

### [A06] Low-pass the voice at 15.9 kHz; everything above 16.3 kHz in the master belongs to the bed or to effects.

- Values: median-spectrum edge 15,844-15,914 Hz in 16/19 clips (drop 7.7-14.3 dB per 94 Hz; level 16.5-17.5 kHz = -104..-123 dB vs 14-15 kHz = -82..-91 dB); in clip02/03/07 (bed B cymbals) and clip19 the bed fills above the edge (16.6-20.4 kHz). SBR range reaches 22.2 kHz in 48 kHz clips, ~19-20 kHz in 44.1 kHz clips.
- Evidence: n=19; A_voice_ceiling.png, A_voice_ceiling.csv; zoom example A_zoom_clip01_0.5-10.5_22000.png
- Confidence: high

### [A07] High-pass the voice so it is 6 dB down at about 90 Hz and 15-20 dB down below 80 Hz; reserve 25-80 Hz for the bed bass and booms.

- Values: voice spectrum re its 150-300 Hz level: 80-100 Hz -5.1..-7.7 dB, 60-80 Hz -13.4..-21.2 dB, 40-60 Hz -15.5..-25.6 dB (clip16 -5.8, a boom leaks); 100-150 Hz +0.0..+1.0 dB.
- Evidence: n=6 clips whose sub band is mostly empty (clip04, 05, 06, 08, 10, 16), voice-active frames with booms removed; numbers.json voice_lowend_re_150_300hz_db
- Confidence: medium (6 clips; the other 13 have bed bass under 80 Hz)

### [A08] Start the voice on frame 0-2 and end the file within 1-5 frames (at 29.97 fps) of the last word: no music-only head, no tail, no silence.

- Values: voice band within 12 dB of its speech median at 0.021-0.061 s (frame 1-2) in 19/19; voice stops 0.027-0.171 s (frames 1-5) before the end of the file; transcript first word at 0.00 s in 19/19.
- Evidence: n=19; the check recorded in numbers.json open_close; e.g. clip05@0-2, clip18@1255-1261 (longest tail 171 ms)
- Confidence: high

### [A09] Cut every pause: the deepest gap left between words is 80 ms typical and never more than 180 ms.

- Values: longest gap >= 18 dB below the clip speech median: median 80 ms, range 10-180 ms (n=19); gaps >= 50 ms per clip 0-12; speech rate 3.61 words/s median (3.25-4.07, ASR word count over speech span).
- Evidence: n=19; A_speech.csv; longest gap clip02@1027 (34.28 s, 180 ms)
- Confidence: high (gaps); medium (speech rate uses ASR word counts)

### [A10] Run a music bed under every frame of every video.

- Values: held tones (>= 1 s, >= 8 dB over neighbouring bins, 40-1000 Hz) present in 100 % of 1-s windows in 19/19 clips, including the first and last 3 s; by eye, horizontal note lines in every spectrogram.
- Evidence: n=19; A_bed_presence.csv, A_spectrogram_sheet_1.png.. _4.png, A_bed_estimate_bedA.wav / bedB.wav
- Confidence: medium (no voice-only clip exists to calibrate the held-tone test)

### [A11] Reuse a small set of bed tracks across videos: one track served 5 of 19 videos and another 3 of 19; the other 11 each used their own.

- Values: bed A (clip01, 12, 15, 17, 19): pairwise sub-band (25-80 Hz) similarity 0.75-0.84; bed B (clip02, 03, 07): 0.56-0.62; all other pairs median 0.15, p95 0.23, max 0.38 (clip13 vs bed B, same 118 BPM: maybe a sibling section). Dates: bed B 2026-10-30..11-03; bed A 10-29 and 11-06..11-12.
- Evidence: n=171 clip pairs; A_bed_recurrence.csv; a pitch-class test (A_bed_recurrence_tonal.csv) did not separate even the known pairs and is not used
- Confidence: high

### [A12] Start the bed at the top of the track on frame 0 and play it to the last frame with no fade-in or fade-out.

- Values: bed B: the same track position at frame 0 in clip02, 03, 07 (offsets 0, +33, +33 ms); bed A: positions differ by whole 2-bar loops (offsets -14.53, -14.67, -14.76, -21.90 s re clip01, loop 7.38 s, within 0.23 s); bed gain in the first and last 1 s within -2.1..+1.9 dB of the clip median (a fade would read >= 10 dB).
- Evidence: n=8 clips with a shared bed; A_bed_gain_curves.csv, A_bed_gain_curves.png
- Confidence: medium (8 of 19 clips can be aligned to a known track)

### [A13] Keep the bed static: no ducking under the voice and no gain rides.

- Values: correlation of bed gain (25-80 Hz, voice-free) with voice level -0.085..+0.064 per clip; bed gain when the voice is in its loudest vs quietest 20 % differs by <= 0.3 dB; gain IQR within a clip 0.3-2.4 dB.
- Evidence: n=8 clips (315-557 frames at 50 ms each); A_bed_gain_curves.csv
- Confidence: high (consistent null on all 8 testable clips)

### [A14] Set the bed about 16 LU under the master (about -30 LUFS when the master is -14); the measured range is 13 to 25 LU; per-video trim about +-3.5 dB.

- Values: Verification (per-bin minimum statistics, K-weighted, all 19 clips): bed p10 -25.5 dB re mix (-28.8..-22.4), p5 -29.5; corrected for the p10-to-mean ratio of a noise-like bed (+9.8 dB) to about -16 LU. Study: voice-free reconstruction of the shared beds (per-bin minimum across aligned clips, an upper bound): -13.3 LU re mix median (n=8, -9.2..-16.4); minimum-statistics floor calibrated on those 8 and applied to all 19: median -16.1 LU (-9.2..-18.9), calibration spread 3.9 dB; bed A static trim across its 5 clips -3.6..+3.5 dB.
- Evidence: n=19 (8 direct); A_bed_level_per_clip.csv, A_bed_estimate_bedA.wav, A_bed_estimate_bedA_spectrogram.png
- Confidence: medium (method bias 2-4 dB; needs listening)
- Verified, settled to a range (item 16): 13 LU (the study's rule, 'about 13 LU under the master, about -27 LUFS', an upper bound) to 25 LU (the uncorrected floor); best estimate about 16 LU. Needs listening.

### [A15] Choose bass-heavy beds: 30-42 % of the bed energy sits below 80 Hz, and the bed is quiet above 6 kHz.

- Values: bed A band levels (dB, upper bound): 25-50 Hz -35.4, 50-100 -33.7, 100-200 -39.7, 200-400 -37.4, 400-800 -42.0, 0.8-1.6 kHz -51.5, 1.6-3.2k -53.7, 3.2-6.4k -57.7, 6.4-12.8k -61.2, 12.8-20k -79.0; bed B: -35.5, -37.7, -36.8, -33.3, -40.2, -44.3, -47.2, -49.4, -52.9, -64.7; full minus 25-80 Hz = 3.8 dB (A), 5.3 dB (B).
- Evidence: n=2 shared beds (8 clips); A_bed_spectrum.csv
- Confidence: medium (2 beds measured directly)

### [A16] Pick beds at 110-130 BPM with a steady pulse; the bass changes every 8 beats.

- Values: bed A 130 BPM (hat period 0.462 s; bass changes every 3.69 s = 8 beats; bass notes ~39, 58, 78 Hz); bed B 118 BPM (kick every 0.508 s, 4.07 s cycle, bass ~46 Hz); clip13 118 BPM (boom grid 0.508 s, p < 0.003); clip11 115 BPM (0.522 s, p < 0.003); clip09 111 BPM (onset ACF 0.25). No measurable pulse (onset ACF <= 0.08) in clip04, 05, 06, 08, 10: pad-like beds with occasional bass.
- Evidence: n=19; A_bed_tempo.csv, A_boom_tests.csv, A_zoom_clip01_0-18_250.png (bass blocks), A_zoom_clip04_0-12_2000.png (held pad tones)
- Confidence: medium (2 beds strong, 3 more by grid tests; 5 pulse-free)

### [A17] Use four effect families, told apart by band and envelope: noise swells, sub booms, high pings, short hits. Effects are mono and sit in bands the voice leaves empty (above 16.3 kHz, below 80 Hz) as well as under it.

- Values: candidates 1361; removed 438 bed elements (388 recurring in a shared bed + 50 beat-grid booms in clip11/13) and 74 edit transients; left: swell 84 (60 loud = peak >= -55 dB in 16.3-19 kHz), boom 108, tonal 254 (78 loud), hit 251 (44 loud), click 152 (6 loud; clicks are mostly quiet residue, not a family). Galleries checked by eye: 12/12 loud swells and 12/12 loud tonal tiles show non-voice energy above 16 kHz.
- Evidence: n=19; A_sfx_inventory.csv, A_sfx_class_stats.csv, A_gallery_swell_lin.png, A_gallery_tonal_lin.png, A_strip_clip01.png.. A_strip_clip19.png
- Confidence: medium (class names are inferred from spectrum and envelope; nothing was heard)

### [A18] Noise swell: a flat broadband noise texture of about 0.7 s (0.3-1.5 s), rising over about 0.23 s and decaying over about 0.38 s; about 3 per video in the early clips; one in three is paired with a sub boom 0.33 s after its start.

- Values: loud swells n=60 in 14 clips: duration p10/50/90 289/728/1496 ms; attack 40/228/671 ms; decay 134/378/1102 ms; tilt 17.5-19 vs 16.3-17.5 kHz -2.3/-0.2/+2.1 dB (flat); 8-15.5 kHz band rises 19 dB (median) over the 0.5 s before; per clip 0-10 (median 3); 22/60 overlap a boom, boom start minus swell start p10/50/90 -677/+327/+882 ms. 35 swells last >= 0.7 s.
- Evidence: n=60; e.g. clip04@8-69, clip04@475-515, clip10@276-290; A_sfx_class_stats.csv, A_gallery_swell_lin.png, snippets/swell_*.wav
- Confidence: medium

### [A19] Sub boom: a 47 Hz tone falling toward 35 Hz, about 0.375 s (0.2-0.9 s), attack 0.03-0.35 s, decay 0.07-0.7 s, peaking 5-30 dB above the bed bass; 5-14 per video where the bed has no bass.

- Values: n=108 in 16 clips: duration 207/375/893 ms; attack 30/125/353 ms; decay 70/210/713 ms; start frequency 47 Hz (p90 82), end 35-47 Hz, downward glide in 38 %; 25-70 Hz peak -33.4/-24.4/-19.4 dB vs clip sub medians -27..-55 dB; 11-14 per clip in clip04, 05, 06, 08, 18; not on a beat grid in any of those (grid p 0.25-0.94).
- Evidence: n=108; e.g. clip04@47-99 (47->35 Hz, 1750 ms), clip04@627-655 (59->35 Hz); A_strip_clip04.png, A_boom_tests.csv, snippets/boom_*.wav and *_below80.wav
- Confidence: medium (some may be bass notes of the pad beds: listen)

### [A20] High ping: stable partials between 12 and 18 kHz, about 0.26 s (0.09-0.59 s), attack under 50 ms, decay about 0.18 s; about 4 per video.

- Values: loud tonal n=78 in 18 clips: duration 94/258/590 ms; attack 9/48/237 ms; decay 34/175/425 ms; strongest frequency 12.3/13.8/18.2 kHz; spectral flatness 12-19 kHz <= 0.1; per clip 0-17 (median 4; clip13 17).
- Evidence: n=78; e.g. clip04@316-331, clip13@968-976; A_gallery_tonal_lin.png, snippets/tonal_*.wav
- Confidence: low (could include bell or pluck notes of the beds; listen)
- Verified, open (item 28): not re-measured; needs listening.

### [A21] Do not put an effect on every cut: only about 1 cut in 7 carries one. When a swell does sit on a cut it starts 0-100 ms after the cut frame.

- Values: cuts with an effect onset in [-100, +150] ms: 54/361 = 15 % vs 9.7 % if the cuts were random; swells 4.7 % (chance 2.1 %), booms 6.6 % (3.8 %), pings 3.0 % (2.8 %). Swell starts vs cuts: peak bin 0..+100 ms, 15 vs 4.4 expected (z 5.2); 7 of 35 swells >= 0.7 s start +16..+24 ms after a cut frame.
- Evidence: n=361 picture cuts in 19 clips (A_visual_cuts.csv); A_peth.png, A_peth_swell_start.csv, A_event_locked_cuts.png
- Confidence: high

### [A22] Tie long noise textures to the action the sentence describes and let them last as long as the spoken action (cassette reels spinning, a receipt printing); no frame-level link to panel motion was measurable.

- Values: clip01@397-449 (1750 ms) under the line about the cassette wheels spinning; clip01@657-751 (3170 ms) under the line about a receipt printing when a payment goes through, with regular ticks 13-20 kHz at clip01@625-655 under "checkout receipt"; panel (top-half) motion during the 287 loud effects sits at the 50.7th percentile of random spans (chance).
- Evidence: A_zoom_clip01_11.5-25.5_22000.png, A_strip_clip01.png, snippets/prop_clip01_cassette.wav, snippets/prop_clip01_printer.wav, A_motion_during.csv
- Confidence: low (two clear cases in one clip; needs the graphics inventory and listening)
- Verified, open (item 28): not re-measured; needs listening.

### [A23] The bed is already playing on frame 0; an opening noise swell from frame 0-9 is optional and belongs to the earlier half of the period.

- Values: opening swell in 4/19: clip02@0-29 (980 ms), clip04@8-69 (2040 ms, with a 47->35 Hz boom from clip04@47), clip08@0-29 (955 ms), clip11@0-48 (1605 ms); all published by 2026-11-06; none in the 8 clips after. Held bed tones in the first 3 s in 19/19.
- Evidence: n=19; A_open_close.csv, A_bed_presence.csv, snippets/open_*.wav
- Confidence: medium

### [A24] Give the closing call to action no special sound: the bed simply continues to the last frame.

- Values: no effect starts in the last 3 s in 11/19 clips; effects within 1.5 s of the closing "comment" word vary in kind; a ping lands 34-54 ms before the quoted keyword in only 2/19 (clip01@1122 before "blocks", clip13@968 before "tokens"); bed gain in the last 1 s within -2.1..+1.9 dB of the clip median (n=8).
- Evidence: n=19; numbers.json open_close, A_open_close.csv, snippets/end_*.wav
- Confidence: medium

### [A25] Prefer the late density: about 2 loud effects per 10 s (bed and voice carry the piece); the early clips used about 5.5 per 10 s.

- Values: loud effects (swell/ping/hit >= -55 dB + booms) per 10 s: clip01-13 (2026-10-29..11-07) median 5.5 (1.7-9.4); clip14-19 (11-07..11-12) median 1.8 (0.5-3.8); loud swells per clip 4 (0-10) early vs 0-1 late.
- Evidence: n=19 (13 vs 6); A_effects_per_clip.csv
- Confidence: medium (6 late clips; the trend could be content-driven)

### [A26] Cut audio and picture on the same frame; add a 5-10 ms crossfade at each audio join (the reference leaves clicks at 14 % of joins, which is a flaw, not a style).

- Values: 52/360 cuts (14 %) in 18/19 clips show a waveform jump >= 12x the local median step with a >16.3 kHz burst within 3 ms; offset after the cut frame start p10/50/90 4.8/32/68 ms (21/52 at +25..+35 ms, a constant codec delay); the transient is shorter than 7-13 ms above 16.3 kHz.
- Evidence: n=360 cuts; A_splices.csv, A_hf_events.csv, A_event_locked_cuts.png (16-22 kHz +11.5 dB at +30 ms), snippets/splice_*.wav; e.g. clip01@285 (jump 0.29 at 9.540 s), clip01@764, clip05@367
- Confidence: high (existence); medium (that it is unintended)

### [A27] Never: stereo width, ducking, bed fades, a pause longer than 180 ms, a music-only intro or outro, or an effect on every cut.

- Values: side/mid <= -70 dB (19/19); bed gain vs voice |r| <= 0.085 (8/8); first/last-second bed gain within 2.1 dB (8/8); longest gap 180 ms (19/19); voice by frame 2 and to within 5 frames of the end (19/19); 15 % of cuts carry an effect (361 cuts).
- Evidence: see A04, A08, A09, A12, A13, A21 and their evidence files
- Confidence: high

## Constant and variable

CONSTANT (19/19 unless noted): master -14.1 LUFS integrated (-14.2..-14.1), LRA <= 2.1 LU, dual mono; voice low-passed at 15.84-15.94 kHz (16/19, the rest masked by cymbals), voice from frame 1-2 to the last 1-5 frames, no gap > 180 ms; a music bed under every frame, starting at the track start on frame 0, static (no ducking, no fades; 8/8 testable); effects are mono. VARIABLE: the bed track (bed A in 5 clips, bed B in 3, 11 single-use) and its tempo (111-130 BPM, or no pulse in 5 pad-like beds); bed level -9..-19 LU under the master and a per-video trim of -3.6..+3.5 dB; effect density 0.5-9.4 loud effects per 10 s, driven by date (5.5 per 10 s until 2026-11-07, 1.8 after) and by the bed (pad-like beds carry 11-14 booms); opening swell in 4/19 (all by 2026-11-06); sample rate 48 kHz (16 clips) vs 44.1 kHz (3 clips from 2026-11-08).

## Open questions

- Are the sub booms in the pulse-free clips (clip04, 05, 06, 08, 10, 18) effects or the pad beds' own bass notes? They are off any beat grid and 31-42 % sit on cuts in clip04/06/08 (chance 6-8 %), which points to effects; listening to snippets/boom_*.wav decides.
- Are the tonal events chimes/sparkles added as effects or bell/pluck notes of the beds? Spectrum alone cannot tell; the cut-locking of pings is at chance (3.0 % vs 2.8 %).
- The full-band level of effects under continuous speech cannot be separated from the voice; only their parts above 16.3 kHz and below 80 Hz are measured. A person should judge how loud a swell sounds against the voice.
- The bed level is an upper bound (residual voice survives the cross-clip minimum); the true level may be 2-4 dB lower than -13 LU.
- Effect-to-prop alignment needs the graphics inventory (G_inventory.csv) frame ranges; the coarse panel-motion proxy found no relation, and only clip01 shows clear prop-action sounds.
- Is -14.1 LUFS the creator's master or the platform's normalisation? Either way the delivered loudness is -14.1.
- Taste: the owner's standing note rejects pad/drone beds and prefers breakbeat or upbeat drum tracks. 5/19 corpus beds are pulse-free pads; the beat-driven beds (111-130 BPM) fit both the corpus and that note. The owner should confirm the bed choice for the style.

Needs an eye or an ear:

- Nothing was listened to and no playback was watched. Every class name (swell, boom, ping, hit) is inferred from spectrum and envelope. Listen to snippets/ (index: snippets/index.csv, 61 files) before release.
- Effect identity: snippets/swell_1..8_*.wav (and *_above16k.wav), boom_1..8_*.wav (and *_below80.wav), tonal_1..8_*.wav, hit_1..5_*.wav.
- Prop sounds in clip01: snippets/prop_clip01_cassette.wav (clip01@386-458) and prop_clip01_printer.wav (clip01@617-761).
- Bed character and level: A_bed_estimate_bedA.wav and A_bed_estimate_bedB.wav (voice-reduced reconstructions, residual voice audible); compare with any full clip to judge "about 13 LU under the voice".
- Openings and endings: snippets/open_clip02/04/08/11 (with swell) vs open_clip01/12 (without); end_clip04/09/13/15 (no closing sound expected).
- Edit clicks: snippets/splice_1..4_*.wav: are the joins audible?
- Whether the pad-like beds (clip04, 05, 06, 08, 10) read as drones: A_zoom_clip04_0-12_2000.png and the open_clip04 snippet.

## Sound build measurements (2026-11-16)

Made for the sound build, on the same 19 clips, with new scripts (effect onsets against the explanation study's graphic events, matched inside a window of -100 to +150 ms). `src/sound.js` cites them as "this build". Nothing was listened to.

- Loud-effect spacing: in the later clips the 5th percentile gap between loud effect starts is 0.65 s and the 10th 0.81 s (n=39).
- Bed and booms: in the five pad-bed clips booms run 3.7 per 10 s against 0.6 under a drum bed; the other effects are alike. Booms sit where the bed has no bass [A19].
- Cuts that carry an effect, by bed: pad-bed clips 24 % of 88 cuts (booms 20.5 %, swells 3.4 %, pings 3.4 %); the other fourteen 12 % of 279 (swells 5.0 %, pings 2.9 %, booms 2.2 %). Over all clips 54 of 361 [A21]. A boom starts 5 ms before the cut, a swell 17 ms after, a ping 21 ms after (medians).
- Swell then boom: 22 of 60 swells bring a boom whose start is 0.327 s after the swell's [A18].
- Graphic events that carry an effect (kept when at least twice the chance share and seen 3 or more times): ring pulse ping 9/54, swell 7/54, boom 7/54; grow boom 6/40, swell 3/40, ping 3/40; recolor ping 3/15; fill boom 6/73, ping 6/73; fade boom 5/58, ping 4/58; pop ping 13/197; badge or stamp boom 8/98; typing swell 3/69. Moves, slides, draws and swaps carry nothing measurable.
- Opening: 4 of 19 clips open with a long swell starting in frames 0-9, 0.95-2.0 s long [A23].
- Effect shapes for synthesis: swells about 0.73 s; booms 47 Hz falling toward 35 Hz, about 0.375 s; pings with partials near 13-14 kHz, about 0.26 s; the two action textures (reels 1.75 s, printer 3.17 s) with their plateau levels in the 16.3-19 kHz band (-47.5 and -53.3 dB p90) [A18-A20, A22].
