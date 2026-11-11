# Audio: measured record (A01-A28)

Part of the Editorial Proof study; read `README.md` first for the corpus, the method and the limits. STYLE.md cites these rules by id, for example [A01]. Frames are at 30 fps (f); positions are pixels on the 1080 x 1920 frame; evidence is given as clip id @ frame (see README.md, "Evidence ids").

**Sample.** The mixed audio of all 33 reels: EBU R128 loudness, energy-gap pauses, a music-bed fingerprint on the voice-free side channel, and sound effects detected in the 16-21 kHz band the low-passed voice leaves empty (1,082 events, 924 in recurring clusters).

**Method notes.** Nothing was listened to: effect class names (riser, whoosh, swish, hit, pop, click, counter, long) are inferred from envelope and spectrum. Levels inside the voice band are +-4 dB estimates.

**Confidence.** high = measured on many instances and consistent; medium = measured but on fewer instances or with a judgement step; low = one to four instances, or inferred.

## Rules

### A01 - Master loudness is fixed across every reel: integrated loudness, range, peak and crest barely move.

- Confidence: high
- Numbers: Integrated -14.3 LUFS median (range -14.4 to -14.1); LRA 2.2 LU (1.5-3.4); true peak -0.5 dBTP (-0.8 to +0.3); sample peak -0.57 dBFS; whole-file RMS -16.97 dBFS (-17.17 to -16.79); crest 16.3 dB (16.1-17.2); 400 ms crest 14.2 dB; 400 ms RMS p10/p50/p95 = -22.1/-17.5/-13.7 dBFS
- Evidence: n=33 reels, ffmpeg ebur128 on all

### A02 - Voice is mono, dead centre, and present from the first sample; speech is active almost continuously.

- Confidence: high
- Numbers: L/R correlation 0.98 (0.956-0.987); side 20.2 dB under mid overall; active speech level -16.8 dBFS (-16.95 to -16.55); activity 94.4% of frames (91.9-96.9); first word at 0.00 s in 33/33, waveform at -25 dBFS by 20 ms; tail after last word 0.31 s (0.08-0.51); 257 words/min (223-286)
- Evidence: n=33; clip39@0 mid/side spectrogram

### A03 - Voice spectrum: chest-heavy, band-limited at the top, high-passed at the bottom. SFX extend to 22 kHz, so the low-pass is on the voice only.

- Confidence: high
- Numbers: Low-pass at 15.4 kHz (14.4-15.8 kHz; -25 dB re the 11-13 kHz level); low -10 dB point 47 Hz (47-70); centroid 726 Hz (655-791); 85% roll-off 973 Hz; 95% roll-off 2648 Hz; octave energy re total: 90-180 Hz -7.1, 180-355 -6.3, 355-710 -4.6, 710-1400 -9.6, 1.4-2.8k -13.0, 2.8-5.6k -15.3, 5.6-11.2k -17.5, 11.2-16k -34.0 dB
- Evidence: n=33; clip39@0-1456

### A04 - Pauses are cut to a few frames; nothing longer than 8 frames survives.

- Confidence: high
- Numbers: 1255 energy gaps (speech band 30 dB under its p90 for >=30 ms): median 45 ms, p90 75, p95 95, p99 127, max 245 ms; per-reel longest gap 110 ms median (70-245); gaps = 4.5% of runtime (2.5-10.1%); ASR: 89.2% of word gaps are 0 ms, sentence-end gap 120 ms median, p90 180, max 440 (n=216)
- Evidence: n=33 reels, 1255 gaps

### A05 - The mix never goes quiet: bed and effect tails fill every gap, so no clean room tone is exposed.

- Confidence: high
- Numbers: Quietest 50 ms stretch inside a reel: -44.8 dBFS median (-60.5 to -38.4); 10 ms minimum in speech gaps: -43.9 dBFS median (per-reel -46.7 to -40.4), about 27 dB under speech
- Evidence: n=33

### A06 - A music bed exists and is one of two reused tracks, always laid from the same track position at t=0 (a template element, not scored to content). The two alternate through the whole period; lime reels use a third bed.

- Confidence: high
- Numbers: Bed A in 16 reels, Bed B in 14 (incl. gameplay), lime bed in 3; pairwise side-channel fingerprint cross-correlation: best lag 0.0 s, robust z 12-26 for all 91 B-B pairs; A-B pairs z 2-7 at random lags
- Evidence: n=33; clip40@0 and clip38@0 comparison sheets, *

### A07 - Bed level is very low and static: no ducking, no section automation, no fade in or out.

- Confidence: medium
- Numbers: Mid level -41.8 dBFS (A, bracket -45.1 to -39.5) and -38.4 dBFS (B, bracket -41.5 to -36.5); side (voice-free, exact) -45.3 / -44.3 dBFS; = about 25 dB (A) and 22 dB (B) under the voice; per-second level flat within -40..-43 (A) and -36..-41 dBFS (B) from 1 to 36 s; within-reel gain IQR 0.4-1.3 dB; per-reel gain sd 1.4 dB (five reels at -2.3 to -5.2 dB); final 300 ms +1.6 dB vs reel median (-4.8 to +5.2)
- Evidence: n=30 blue/gameplay reels, consensus of 16 and 14 reels; clip39@1200-1456 end sheet

### A08 - Bed timbre: warm, low-passed, wide stereo.

- Confidence: medium
- Numbers: Mid octave levels dBFS, A: 60-120 Hz -46, 120-250 -44, 250-500 -45, 500-1k -51, 1-2k -55, 2-4k -54, 4-8k -67; B: -41.5, -41.6, -43.9, -47.3, -48.5, -51.0, -64.1; 13 dB drop from the 2-4k to the 4-8k octave (low-pass about 3.5-4 kHz); side within 1-6 dB of mid
- Evidence: consensus spectrograms, groupB

### A09 - Bed structure and tempo. Bed A is a pulseless pad whose full texture enters after a sparse intro; Bed B has a clear bar; lime has eighth-note hats.

- Confidence: low
- Numbers: A: pad enters at 3.4 s in 16/16, phrase 9.96 s (self-similarity r 0.52), no beat-scale autocorrelation above r 0.26, about 96 BPM if 4 bars of 4/4 (inferred). B: starts at 0.0 s, bar 2.0907 s, phrase 8.3627 s (r 0.56-0.63), 114.8 BPM if 4/4 (inferred). Lime: hats every 0.2293 s (r 0.40) = 130.8 BPM, mono (side -75 dBFS)
- Evidence: n=16/14/3 reels

### A10 - SFX are reused samples at a steady density.

- Confidence: high
- Numbers: 1082 events in the voice-free 16-21 kHz band, 924 in recurring envelope clusters; named effects 19 per reel median (11-40), 5.6 per 10 s (3.2-9.4), median spacing 1.52 s (p10 0.41, p90 4.0)
- Evidence: n=33 reels

### A11 - Opening: the same riser sample at the same gain on frame 0.

- Confidence: high
- Numbers: 31/33 reels; HF onset +25 ms after frame 0 (25-30); HF duration 760-860 ms, HF peak 655-720 ms after onset at -42.0 dB (-45 to -40); side level -31.8 dBFS over the first second; sub layer 22-70 Hz at -26 to -31 dBFS; exceptions clip37 (first sound at 0.43 s) and clip07 (whoosh)
- Evidence: 31 reels @frame 0

### A12 - Numbered interstitials: the riser lands on the cut into the white card and peaks when the item name is on; leaving the interstitial is silent. Treatment varies by reel.

- Confidence: medium
- Numbers: Riser onset 20-28 ms before the cut in clip39 (5/5) and clip31 (5/5); 23-42 ms after in clip10, clip14, clip13; HF peak 0.7 s after onset (cut frame 145, peak frame 165); clip24 uses a soft swish +115..+145 ms instead (4/4), clip20 a whoosh (3/3); cuts into white overall: riser 16/37, any transition effect 25/37; cuts out of white: silent 30/37
- Evidence: clip39@145,371,603,849,1149; clip31@118,430,688,881,1110; n=37 cuts in 18 reels

### A13 - Hard layout cuts carry a sub-bass riser that builds for about 550 ms and stops on the cut, heard as a short tick. It is placed on cuts that fall on sentence boundaries.

- Confidence: high
- Numbers: Side-channel 22-70 Hz rises -46 to -24 dBFS over 500 ms; peak -23.4 dBFS (identical to +-0.3 dB), 58 ms before the cut; 12 dB drop 7 ms after the cut; tick in 16-21 kHz: 65-80 ms, peak -64 dB (-75 to -58); present on 50% of 225 hard cuts; 67% (97/145) of hard cuts within 0.25 s of a sentence end vs 20% (16/80) mid-sentence; sub is anti-phase (side about 20 dB above mid in that band)
- Evidence: n=225 hard cuts in 33 reels

### A14 - Tick timing against the cut frame is bimodal: on the cut, or exactly 3 frames early.

- Confidence: high
- Numbers: Main: HF onset 46 ms before the cut (IQR 40-52, n=76) so the HF peak (45 ms after onset) lands on the cut; alternate: 143 ms before (IQR 138-147, n=37), concentrated in clip30, clip22, clip21, clip10, clip20, clip13, clip07
- Evidence: n=113 ticks; clip13@395, clip21@483

### A15 - Coverage of hard cuts by type (an SFX onset within +-134 ms, or the sub riser).

- Confidence: medium
- Numbers: dark->light 81% (n=47), light->dark 64% (42), light->presenter 64% (33), dark->presenter 86% (22), light->white 95% (21), other->dark 86% (14), other->light 56% (18), white->light 9% (11); soft fades 6-41% (n=88); chance level 19.4%
- Evidence: n=313 mode changes in 33 reels

### A16 - Every file ends with a sub riser running into the last sample; the bed is cut, not faded.

- Confidence: high
- Numbers: 33/33 reels, side 22-70 Hz peak -19 to -26 dBFS at end of file; 18/33 files end with a 20-40 ms drop to -62..-80 dBFS, the other 15 end at -31..-45 dBFS; 9 reels add a bright burst 0.70 s before the end (0.59-0.87)
- Evidence: n=33 end list); clip23@1128, clip29@1008

### A17 - Card content sliding, scrolling or swapping with motion blur gets a medium whoosh with a sub boom.

- Confidence: medium
- Numbers: 69 events in 24 reels, 1-7 per reel; HF duration 540-715 ms, HF peak 180 ms after onset at -53 dB (-64 to -47); centroid falling 1670 -> 1050 -> 400 Hz; sub 22-70 Hz at -30 dBFS from +100 to +400 ms; onset -30..+13 ms around the first moving frame (n=8); 10 of 12 viewed instances were card slides/swaps
- Evidence: 12 strips from 12 reels: clip39@1040

### A18 - A card scaling or fading in after a mode change gets a soft low-mid swish a few frames after the cut.

- Confidence: medium
- Numbers: 46 events in 10 reels, 1-10 per reel; HF 300-415 ms at -60.2 dB; 76% of energy in 250-1000 Hz, centroid 600-700 Hz, strongly stereo; onset 115-160 ms after the hard cut (n=20); 10 of 12 viewed instances were card entrances
- Evidence: 12 strips from 10 reels:

### A19 - Blue highlight sweeps and red strike-throughs get an airy 300 ms swish, used as an optional accent.

- Confidence: medium
- Numbers: 85 events in 18/33 reels, 1-12 per reel; HF duration 280-335 ms, HF peak 265 ms after onset at -51.3 dB (-54 to -47); flatness 0.68, centroid about 2.8 kHz; onset 7-23 ms after the first strike frame; 12/12 viewed instances were highlight sweeps, plus 4 strike-throughs in clip39; about 30% of 128 detected sweeps had it (lower bound)
- Evidence: clip39@218,926,940,954; 12 strips from 12 reels:

### A20 - CTA is a fixed two-sound figure: a falling hit when italic "comment" appears, then the loudest pop when the glowing keyword appears.

- Confidence: high
- Numbers: Hit: 305-365 ms, HF peak 50 ms after onset at -42.3 dB, centroid falling 4580 -> 2060 -> 410 Hz; onset 23-47 ms after the first frame of "comment" (n=3, frame-accurate). Keyword appears 13-14 frames after "comment". Pop: 40-105 ms, mono, HF peak -34.6 dB (-41 to -29); onset 3-7 ms after the keyword's first frame (n=3). Hit-to-pop 415 ms median (IQR 410-420, range 385-465, n=23). Pop 2.16 s before the end (1.54-2.67)
- Evidence: pop in 31/33 reels, hit+pop in 23/25 reels ending on the full-frame presenter; clip18@930-944, clip32@1000-1013, clip36@1051-1064

### A21 - The seven oldest blue reels end in the light split and use the pop alone, with no hit and no full-frame presenter.

- Confidence: high
- Numbers: clip15, clip14, clip13, clip12, clip10, clip09, clip08: pop 2.36-2.67 s before the end, HF peak -33 to -41 dB
- Evidence: n=7 reels

### A22 - Caption words have no sound; small in-card changes are not sound-designed as a rule.

- Confidence: high
- Numbers: Caption word changes: 27% within +-134 ms of any SFX onset vs 19.4% chance (n=222, no dominant class); small graphic bursts 22-25% (n=316); medium 25-29% (n=176); large in light split 43% (n=37)
- Evidence: n=751 events in 33 reels

### A23 - Big-number blocks: a bright swell when the block lands and a tonal shimmer while digits roll.

- Confidence: medium
- Numbers: Stat swell: 17 events in 9 reels, 305-360 ms, HF peak 225 ms after onset at -42.5 dB, mono. Counter: 13 events in 10 reels, 555-1005 ms, HF peak -35.3 dB, flatness 0.24 with steady partials 2-10 kHz; 4 of 5 viewed were digit roll-ups
- Evidence: clip21@521, clip34@268, clip36@206, clip31@542, clip30@587

### A24 - Small UI accents: a tonal click for chips, cursor clicks and outlines; a long texture for typing or scrolling inside a card.

- Confidence: low
- Numbers: Click: 14 events in 9 reels, 155-190 ms, HF -45.6 dB, mono, flatness 0.09. Long: 20 events in 15 reels, 1.3-1.9 s, HF peak 700-890 ms after onset at -45.5 to -47.5 dB; 4 of 6 viewed were typing/scroll
- Evidence: clip39@316 (chip), clip27@540, clip37@764, clip22@505

### A25 - SFX sit well under the voice and never move programme loudness.

- Confidence: low
- Numbers: Estimated SFX-only 50 ms peak above 150 Hz: -33 to -48 dBFS = 16-31 dB under the voice (+-4 dB): riser -34, soft swish -37, counter -37, click -38, whoosh -40, long -40, pop about -41, stat swell -42.5, hit -44, tick -44, swish -48. Exact 16-21 kHz peaks: pop -34.6, counter -35.3, hit -42.3, riser -42.5, swish -51.3, whoosh -53.0, soft swish -60.2, tick -64.0 dB. LRA stays 1.5-3.4 LU
- Evidence: percentile templates over 9-85 instances per class

### A26 - Build targets for the voice/master chain.

- Confidence: high
- Numbers: Voice centre mono, high-pass 60 Hz, active level -16.8 dBFS, 400 ms RMS spread 8.4 dB, 400 ms crest 14 dB; master -14.3 LUFS (accept -14.4 to -14.1), LRA 1.5-3.4 LU, limiter ceiling -1.0 dBTP; pauses 45 ms typical, 100-140 ms at sentence ends, cap 245 ms; speech at 0.00 s; 0.30 s tail; 20-40 ms end fade
- Evidence: derived from A01-A05, n=33

### A27 - Build targets for the bed.

- Confidence: medium
- Numbers: One track per video from a rotation of 2 (plus a 131 BPM hat-driven mono bed for product-colour variants); start frame 0 at a fixed track offset, no fade-in; run to last sample, no fade-out; static gain 22-25 dB under the voice (-42 to -38 dBFS mid); no ducking; wide stereo; energy 60-500 Hz, low-pass about 3.5 kHz; 96-115 BPM, 8-10 s phrases
- Evidence: derived from A06-A09, n=33

### A28 - Placement rules for an automated editor.

- Confidence: medium
- Numbers: Opening riser at +25 ms; cut riser on hard cuts within 0.25 s of a sentence end with tick onset -46 ms and silence 7 ms after; interstitial riser -25 ms, exit silent; whoosh -20 ms on card slides or soft swish +130 ms (4 frames) on card scale-ins, not both; 2-4 accent types per video from swish/stat swell/counter/click/long; CTA hit +1 frame after "comment", pop 415 ms later on the keyword's first frame, about 2.2 s before the end; sub riser into the last sample; budget 5.6 effects per 10 s, minimum spacing 0.4 s; no caption sounds
- Evidence: derived from A11-A24; full map in build_spec.sfx_map

## Constant versus variable

**Constant across reels (core style):** master at -14.3 LUFS (+-0.15), about -0.5 dBTP, crest 16.3 dB; mono-centre voice from the first sample, band-limited at 15.4 kHz, 94% speech activity, pauses 45-130 ms; a warm, low-passed, wide-stereo bed 22-25 dB under the voice at static gain from frame 0 to the last sample, with no ducking and no section changes, always laid from the same track position; the same opening riser at +25 ms (31/33); a sub-bass riser ending on sentence-boundary hard cuts (67%) and on the end of every file (33/33); the CTA figure hit then pop 415 ms apart with the pop about 2.2 s before the end (23/25 reels ending on the presenter; pop in 31/33); no caption sounds; SFX 16-31 dB under the voice.

**Varies per video:** which bed (A in 16 reels, B in 14, a hat-driven ~131 BPM mono bed in the 3 lime reels) and its gain within about 3 dB (one reel -5.2 dB); effect count (11-40 named per reel, 3.2-9.4 per 10 s); which accents are used at all (swish in 18 reels, soft swish in 10, counter in 10, stat swell in 9, click in 9, long typing/scroll in 15); interstitial treatment (riser, soft swish or whoosh); tick placement (on the cut in most reels, 3 frames early in about 7); the end burst 0.7 s before the end (9 reels only); the seven oldest reels end in the light split with the pop alone.

## Disagreements with other studies

- Speech rate 257 words per minute here against 251 in structure (S22).
- Pauses: energy gaps median 45 ms, max 245 ms here (A04) against ASR gaps of 120 ms at sentence ends, max 440 ms, in structure (S23).
- CTA: the pop lands 13-14 frames after 'comment' here (A20), matching the hook study's fixed +14-frame keyword (H22).

## Open questions

- Why the cut tick sits exactly 3 frames early in about 7 reels (and mixed within 4 more) is unexplained.
- Only 50% of hard cuts carry the sub riser; the sentence-boundary rule explains most but not all of the split (67% vs 20%).
- Highlight-sweep coverage (about 30%) is a lower bound from a colour detector with roughly 60% precision; re-run against exact sweep frames from the motion/graphics analysts using
- 179 SFX events sit in small unnamed clusters and were not typed.
- Whether beds A and B are two tracks or two sections of one track.
- Lime bed level and character could not be separated from the voice (n=3).
- Whether -14.3 LUFS is the editor's master or platform normalisation.

## To check by eye or ear

- Class names (riser, whoosh, swish, hit, pop, click, shimmer) are inferred from envelope and spectrum: and the versions; lists them.
- Cut riser: -23.4 dBFS at 22-70 Hz in anti-phase between L and R, probably inaudible on a phone. Listen on headphones and a phone, and decide whether the product needs the sub layer or only the audible tick, and whether to build it in phase.
- Whether the sub riser is a deliberate sound or a by-product of a transition sample or plug-in.
- Bed genre, instrumentation and key,.
- Bed tempo: 114.8 BPM (B) and about 96 BPM (A) are inferred from bar and phrase lengths.
- Lime bed:
- Voice processing that cannot be measured here: de-essing, saturation, AI-enhancement artefacts, reverb.
- The long class: typing versus page scroll versus something else.
- Perceived balance: SFX body levels inside the voice band are +-4 dB estimates; confirm the effects read as subtle (16-31 dB under the voice) rather than prominent.
