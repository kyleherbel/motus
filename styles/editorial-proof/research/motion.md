# Motion: measured record (M01-M30)

Part of the Editorial Proof study; read `README.md` first for the corpus, the method and the limits. STYLE.md cites these rules by id, for example [M01]. Frames are at 30 fps (f); positions are pixels on the 1080 x 1920 frame; evidence is given as clip id @ frame (see README.md, "Evidence ids").

**Sample.** About 550 animation instances over 37,430 frames in 33 reels; per-frame tracking of widths, positions, opacity proxies and blur; curves fitted per token and pooled across instances.

**Method notes.** Fits report RMSE on normalised progress. Several in-card moves rest on one to four instances and are marked low confidence.

**Confidence.** high = measured on many instances and consistent; medium = measured but on fewer instances or with a judgement step; low = one to four instances, or inferred.

## Rules

### M01 - Title strip (and interstitial number strip) wipes in by width only: left edge fixed, right edge grows, no opacity/scale change.

- Confidence: high
- Numbers: cubic-bezier(0.2,0,0,1); starts frame 4, first visible f5, 15 frames (500 ms), done f19. Progress f5..f19: 0.055, 0.287, 0.500, 0.635, 0.731, 0.801, 0.855, 0.896, 0.925, 0.952, 0.971, 0.984, 0.993, 0.997, 1.0. Fit RMSE 0.0013 (free fit 0.176,0.064,0.009,1.0; t0 4.26; D 14.9). Spread across reels +-0.004. Right edge is at x=540 at f7 in every reel. Alternatives: spring 0.007, easeOutExpo 0.009, easeOutCubic 0.020, linear 0.054.
- Evidence: n=28 reels frame-identical (e.g. clip39@5-19, clip40@5-19, clip27@5-19); interstitial strip clip31@123-137, clip10@161-175, clip39@150-163 (RMSE 0.0035). Variants: clip38 (starts 29% wide), clip28 (4 f early), clip14 (orange, centre-out, 5 f at f29), clip07 (none).

### M02 - Hook build timeline is fixed and time-based (half-frame staggers), not frame-snapped.

- Confidence: high
- Numbers: Line-1 word i starts at 2.5*i frames (0, 2.5, 5.0, 7.5; first visible f1, f3, f6, f8; stagger 83.3 ms). Strip starts f4. Line-2 word j starts at 8+3j frames (first visible f9, f12, f15...; stagger 100 ms). Shine f23-f29. Title complete between f14 and f26 depending on word count (line 1: 1-5 words, line 2: 1-7).
- Evidence: n=27 reels, 112 words; stagger pattern (0,2.5,5,7.5) in 11 reels and (0,2.5,5) in 9; line-2 pattern (8,11,14...) in 9 reels with separable words. clip39@0-19, clip21@0-20, clip10@0-22

### M03 - Line-1 title word entrance (dark sans; also interstitial heading/name): opacity + translateY + blur, per word, no scale, no letter stagger.

- Confidence: high
- Numbers: Age in frames since last invisible frame. translateY below rest: 16, 8, 4, 2, 1, 1, 0 px at ages 1-7 (22, 11, 6, 3 at ages 0.5-3.5) = +32..33 px * 2^(-age) (easeOutExpo, 10 f). Blur sigma 4.0, 2.0, 1.25, 0.5, 0 px = 8 px * 2^(-age). Opacity proxy 0.24, 0.42, 0.58, 0.72, 0.81, 0.88, 0.94, 0.97, 0.99 at ages 1-9 = easeOutCubic D=12.25 f (RMSE 0.017). Range at age 1: opacity 0.23-0.28, dy 15-17 px, sigma 3.5-4.0.
- Evidence: n=85 words, 27 reels (45 integer-phase, 40 half-phase). clip39@1-10, clip40@1-10, clip27@1-17.

### M04 - Line-2 title word entrance (white italic serif inside the strip) uses the same mechanic with a smaller rise and a faster fade.

- Confidence: high
- Numbers: translateY 11, 6, 3, 2, 1, 0 px at ages 1-6 = +24 px * 2^(-age) (RMSE 0.37 px); blur sigma 3.5, 2.0, 1.0, 0 px; opacity proxy 0.38, 0.67, 0.84, 0.93, 0.975 at ages 1-5 = easeOutExpo D=10.5 f (RMSE 0.008). First word starts 4 f after the strip; 3 f stagger.
- Evidence: n=27 words, 9 reels. clip39@9-20, clip21@9-20, clip12@9-20, clip13@9-20.

### M05 - One shine band sweeps the strip left to right shortly after the wipe finishes.

- Confidence: high
- Numbers: Band half-max width 11% of strip width (62-108 px), about +42 levels on R and G. Centre at 0.19 (f23), 0.465 (f24), 0.67 (f25), 0.815 (f26), 0.908 (f27) of strip width; gone by f29 (about 7 frames, decelerating).
- Evidence: n=9 reels with clean tracks, identical frames: clip39, clip40, clip21, clip31, clip12, clip35, clip36, clip22 @23-29; edge dip at f27-28 visible in 25 of 28 reels.

### M06 - Title exit is optional and is an anticipation move usually cut off: line-1 words rise and blur out, then the strip wipes away with its LEFT edge travelling right.

- Confidence: high
- Numbers: 13 reels animate the exit, 19 hold the title to a hard cut. Strip-out: cubic-bezier(0.2,0,0,1), 12 f (400 ms), RMSE 0.0021; progress 0.101, 0.408, 0.610, 0.735, 0.818, 0.880, 0.925, 0.955, 0.979, 0.992 at frames 1-10. Starts 3-12 f before the scene cut; unfinished in 9 of 13. Words: first word starts 2 f before the strip, stagger 1.5 f; opacity 0.69, 0.32, 0.19, 0.12, 0.09; translateY -3.1, -11.5, -17.7, -20.6, -21.8 px (to about -24 px, emphasized ~10 f); blur 0.6, 2.5, 4.0, 4.5, 5.5 px at ages 1-5.
- Evidence: strip-out n=13: clip40@90, clip39@134, clip38@66, clip37@139, clip36@123, clip34@115, clip33@101, clip30@160, clip29@112, clip26@95, clip21@106, clip20@93, clip16@75. Word exits n=12 words in 4 reels.

### M07 - Caption word entrance (light split, dark sans): every word fades, rises and de-blurs in 6 frames.

- Confidence: high
- Numbers: Opacity proxy median (p10-p90): 0.395 (0.38-0.41), 0.648 (0.63-0.66), 0.835 (0.82-0.85), 0.920, 0.979, 1.00 at ages 1-6 = easeOutCubic D=6.75 f (RMSE 0.006). translateY 5.2 (3.8-5.9), 2.1, 1.0, 0 px = from +10 px easeOutCubic 5.25 f (RMSE 0.13 px), or 13.4*exp(-age/1.07). Blur sigma 2.5, 1.0, 0 px. Total 200 ms. Blue/italic keywords same y and blur.
- Evidence: n=175 words, 29 reels (opening light-split segment of each). clip39@3,8,20,28,38; clip40@0-102; clip10@0-110.

### M08 - Caption word entrance in dark focus (white text) has the same motion but reads brighter sooner.

- Confidence: medium
- Numbers: translateY 4.9, 2.0, 1.0, 0 px; blur 2.5, 0.75, 0 px; opacity proxy 0.83, 0.93, 0.985, 1.0 at ages 1-4.
- Evidence: n=44 words, 2 reels: clip38@670-880, clip32@215-340

### M09 - Captions are revealed in place and replaced by hard swap; word onsets follow speech.

- Confidence: high
- Numbers: Word x positions constant within a group (no reflow). Old group gone in 1 frame: median 1.4% of old ink left on the swap frame, 93% of swaps below 5%. Gap between word onsets median 5 f (p10 1, p90 11). Caption first-visible frame minus ASR word start: median +3.0 f.
- Evidence: swap n=40 boundaries in 8 reels (clip39@20,47,58,92; clip40@26,67...); gaps n=180; ASR lead n=91 (first 3 words of 31 reels)

### M10 - Transition taxonomy: scenes change by hard cut; the only blends are white-to-dark on a persisting card and a slide-push.

- Confidence: high
- Numbers: 338 transitions: hard cut with incoming scene at rest 185 (54.7%); hard in-place content swap 67 (19.8%); hard cut + stage zoom-out settle 64 (18.9%); white interstitial to dark morph without a cut 13 (3.8%); slide-push 9 (2.7%); white flash 0, dip to black 0, scene crossfade 0, blur-zoom 0. Pairs: D>D swap 56, D>L 44, L>D settle 42, L>P 31, D>P 27, L>W 18, W>L 15, L>D no settle 11, D>W 10, P>D settle 9.
- Evidence: all 33 reels, 37,430 frames (clip34 second pass excluded)

### M11 - Entering dark focus: hard cut, whole stage (backdrop, card, caption, chips) drawn at scale 1.15 on the cut frame, then zoom-out settle. No overshoot; still afterwards.

- Confidence: high
- Numbers: Scale 1.150 -> 1.000 about (540, 958+-8). Card width 1023.9 px (1020.7-1030.1) -> 890.9 px (888.7-894.8); older reels 1077 -> 939 px (1.147). cubic-bezier(0.3,0,0,1), 36 f (1.2 s) from the cut frame, RMSE 0.0054. Progress ages 1-10: 0.005, 0.019, 0.043, 0.083, 0.149, 0.242, 0.348, 0.451, 0.539, 0.609; age 15 0.810; age 20 0.910; age 25 0.965; age 30 0.992; age 34 1.000 (p10-p90 +-0.006). Spring fit 0.010, easeOutQuint 0.015. Max overshoot 0.2%. Hold: width 891.0 +-0.5 px over 217 frames.
- Evidence: n=45 pooled (20 reels), 64 detected: clip27@450 and @869, clip35@70, clip40@166,@468,@694, clip37@147,@521,@964, clip36@129,@570,@823...

### M12 - Settle is for first entry only: 42 of 53 light-to-dark cuts use it; changing the screenshot while already in dark focus is a plain 1-frame swap.

- Confidence: high
- Numbers: L>D with settle 42, without 11 (full-bleed media without a card outline). D>D: hard swap 56, settle 3, slide-push 9 (older reels only).
- Evidence: cuts JSON for 33 reels; e.g. clip39@274 swap, clip27@187 and @262 swaps

### M13 - Cutting into the light split: presenter panel is static from the cut frame; the proof card is either at rest (54 of 65) or slides down while fading in (11 of 65).

- Confidence: high
- Numbers: Panel left edge constant to 0.1 px for 10 frames (x=41.0 or 50.6). Card slide: translateY -52.4, -44.5, -38.3, -33.2, -28.8, -25.1 px at frames 1-6; -18.9 (8), -14.1 (10), -10.2 (12), -4.7 (16), -1.7 (20), 0 (24). Frame-1 value -52.4..-52.5 px in all 11. Width constant 890.5 px (translate only). Opacity 0.27, 0.40, 0.51, 0.59, 0.64, 0.70... 0.91 at frame 10. Models: tail of cubic-bezier(0.3,0,0,1) D=36 f, travel 138 px, 9.5 f pre-roll (RMSE 0.34 px); or -61*exp(-age/6.54) px (x0.858 per frame, RMSE 0.88 px).
- Evidence: panel: clip40@367,@591, clip27@345, clip30@351, clip36@366, clip28@400. Slide n=11 in 9 reels: clip40@591, clip36@366, clip35@729, clip32@344,@677, clip34@840, clip28@400, clip26@704, clip18@689, clip39@883.

### M14 - Full-frame presenter shots are hard cut in and completely static: no push-in, settle or drift.

- Confidence: high
- Numbers: Microphone top edge y=1467 and left edge x=387 constant over 120 frames and 60 frames; identical framing in both reels.
- Evidence: clip39@1336-1455, clip40@103-163; L>P 31 and D>P 27 cuts all single-frame

### M15 - White interstitial to dark focus is a morph with no cut: backdrop crossfades while the card persists and resizes.

- Confidence: high
- Numbers: Backdrop white->dark: cubic-bezier(0.2,0,0,1), 14 f (467 ms), RMSE 0.003; progress 0.06, 0.326, 0.532, 0.668, 0.762, 0.828, 0.879, 0.920, 0.946, 0.970, 0.987, 0.994, 1.0. Card screenshot hard-swaps on frame 0; card width 847 -> 890 px (scale 1.051) over 19 f (bezier about 0.15,0,0.2,1; RMSE 0.016); heading/strip/name fade and blur out in 6-8 f.
- Evidence: backdrop n=12 in 6 reels: clip39@180,@656, clip31@179,@487,@926, clip24@446,@806,@1069, clip10@470,@1141, clip20@848, clip38@247; card resize n=3 (clip39@180, clip31@180, clip38@248).

### M16 - Slide-push card swap (older reels only): old card exits left and new card enters from the right as one rigid strip, with strong horizontal motion blur.

- Confidence: high
- Numbers: Travel 1145 px, constant gap 258 px between cards, cubic-bezier(0.3,0,0,1), 22 f (733 ms), RMSE 0.0013. Progress: 0.009, 0.045, 0.135, 0.303, 0.472, 0.590, 0.676, 0.742, 0.795, 0.837, 0.871, 0.900, 0.923, 0.942, 0.958, 0.970, 0.980, 0.988, 0.994, 0.997, 1.0. Peak 193 px/frame (5,790 px/s). Caption does not move.
- Evidence: 3 tracked, identical to 3 decimals: clip21@322 and @366, clip23@198; 9 detected in 6 reels (also clip18@565,@609, clip22@805, clip08@273, clip15@353). Absent from the 15 newest reels.

### M17 - White interstitial reuses the hook title component; the stage is either static or runs the 1.15 settle.

- Confidence: medium
- Numbers: After the cut: heading words at +1 and +3 f; strip first visible +5 f, 15 f wipe (widths 12, 66, 114, 144, 166, 182, 194, 204, 212, 216, 220, 224, 226, 227, 228 px); strip word +8/9 f; card fade +5..+10 f with opacity 0.10, 0.32, 0.56, 0.79, 0.97 at +6..+10; optional card scale 0.946 -> 1.0 (800 -> 846 px, remaining x0.77 per frame, ~15 f); name at +18 f. Zooming variant: strip top y 292 at +5 -> 366 at +30 (scale 1.125 at +5).
- Evidence: card fade n=18 in 6 reels (clip39@145,@371,@603,@849; clip24@149,@400,@771,@1023; clip10@156,@419,@642,@884...). Static stage: clip31@118, clip10@156; zooming: clip39@145. Word frames read from sheets.

### M18 - Text highlight sweeps left to right as one continuous ease-out, chained across wrapped lines, duration independent of length.

- Confidence: medium
- Numbers: 8-10 frames to 98%. Clean run progress: 0.37, 0.62, 0.77, 0.86, 0.92, 0.95, 0.97, 0.98, 0.99, 1.0 = exponential tau 2.0 f (easeOutExpo ~13.75 f, RMSE 0.004). Run lengths 401-928 px all about 10 f.
- Evidence: n=4 runs, 3 reels: clip39@258-266 (401 px), clip39@1209-1218 (309 px, 2 lines), clip21@335-342 (777 px, 2 lines), clip40@602-613 (928 px, 2 lines).

### M19 - Red strike-through is drawn left to right, rows staggered.

- Confidence: medium
- Numbers: Progress per frame 0.06, 0.60, 0.84, 0.94, 0.98, 0.99, 1.0 (6 f, 200 ms); exponential tau 1.13 f (RMSE 0.004) or cubic-bezier(0.3,0,0.05,1) over 5 f. Row onsets f51, f58, f63, f68, f71 (stagger 4-6 f). Chip strike drawn in 2 f.
- Evidence: n=5 lines, 1 reel: clip39@51-77; chip strike clip39@218-219.

### M20 - Push-in on a screenshot happens inside a static card frame, with soft motion blur at peak speed.

- Confidence: low
- Numbers: Scale 1.00 -> 1.783 over 24 f (f241-f265), cubic-bezier(0.2,0,0.1,1), RMSE 0.008; peak +0.11 scale per frame (about 3.3x per second) at f244; transform origin at canvas (118, 616) = card left edge at the target line.
- Evidence: n=1: clip39@241-265.

### M21 - Scroll inside a card starts 2 frames after the dark-focus cut and carries directional motion blur.

- Confidence: low
- Numbers: 47.4% of card height (about 484 px) in 16 f (cut+2 to cut+17), cubic-bezier(0.2,0,0.1,1), RMSE 0.0046; per-frame 13, 75, 89, 76, 56, 41, 31, 25, 19, 15, 12, 9, 6, 5, 3 thousandths of card height; peak 91 px/frame (2,730 px/s). Browser bar stays fixed.
- Evidence: n=1 with scroll: clip27@452-467; 3 other dark entries had none (clip27@869, clip40@468, clip30@577).

### M22 - List reorder: the highlighted row rises on the emphasized curve while displaced rows move down; no overshoot.

- Confidence: medium
- Numbers: 517 px (three rows) in 24 f (800 ms), cubic-bezier(0.2,0,0,1), RMSE 0.0005 (free fit 0.2, 0.008, 0.0, 0.999). Progress: 0.020, 0.100, 0.257, 0.408, 0.520, 0.607, 0.677, 0.733, 0.779, 0.818, 0.851, 0.878, 0.901... 1.0.
- Evidence: n=1: clip38@1088-1112.

### M23 - Logo grid cells cross-fade in one at a time on speech; logo chips pop slightly oversize then relax when struck.

- Confidence: low
- Numbers: Cell opacity 0.08, 0.28, 0.50, 0.57, 0.68, 0.78, 0.85, 0.91, 0.95, 0.98, 1.0 (easeOutCubic ~13 f); cells 27, 12, 27 f apart. Chip: appears opaque at scale 0.957 (427 px), 1.031 (460 px) by +9 f, holds 4 f, relaxes to 1.000 (446 px) over 7 f.
- Evidence: cells n=2: clip36@324 and @350; chip n=1: clip39@210-232.

### M24 - Big number is a decelerating rolling-digit count-up; its plate and colour change are sequenced.

- Confidence: low
- Numbers: Count f63-f79 (16 f, 533 ms); dark plate fades in f71-f75 (4-5 f); number turns white -> glowing blue f79-f85 (6 f) after the count lands; card rows behind blur out.
- Evidence: n=1: clip39@63-85.

### M25 - Glowing keyword (CTA and mid-video) flickers on over its first five frames.

- Confidence: high
- Numbers: Brightness per frame: 1.0, ~0.45, ~0.88, ~0.6, 1.0, then steady. Examples: 1.19/0.33/0.89/0.48/1.03; 1.08/0.53/0.89/0.66/1.02; 1.00/0.50/0.85/0.65/1.00; 1.04/0.44/0.88/0.64/1.01; 1.00/0.54/0.91/0.70/1.00. One dim blurred frame precedes it.
- Evidence: pattern in 13 reels; clean-baseline values from clip40@907, clip38@1318, clip35@1078, clip10@1362, clip29@968; mid-video clip27@162-167.

### M26 - CTA dot fades in before the keyword and pulses once; the italic 'comment' tightens its tracking.

- Confidence: medium
- Numbers: Dot intensity from onset: 0.12, 0.38, 0.60, 0.78, 0.89, 0.97, 1.03, 1.06, 1.07, 1.07, 1.08, 1.07, 1.07, 1.04, 1.03, 1.02 (7 f fade, pulse 1.07-1.09 at +9..+11 f, 1.0 by +16 f); 7-9 f before the keyword. 'comment': width 412 -> 354 px (116% -> 100%) over ~18 f at constant height 66 px, remaining x0.84 per frame.
- Evidence: dot n=5 reels: clip40@898, clip39@1387, clip38@1311, clip36@1056, clip32@1005; comment n=1: clip39@1381-1398.

### M27 - Idle: two highlights circle every card outline clockwise at constant speed, clocked to the reel timeline, in both light and dark modes.

- Confidence: high
- Numbers: One loop per 240 frames (8.00 s) regardless of card size: 11.41 px/frame on a 2740 px perimeter, 13.43 on 3220 px, 15.9 on 3818 px; linear (fit RMS 3-6 px); two heads 180 degrees apart; tail 15-21% of perimeter; head at top-left corner when frame mod 120 is about 118 (+-2).
- Evidence: n=3: clip39@1185-1334, clip40@380-460, clip27@470-690.

### M28 - Everything else is still during holds: no drift, breathing or slow push on cards, background or presenter.

- Confidence: high
- Numbers: Dark card width 891.0 +-0.5 px over 217 frames; light canvas phase shift dx 0.00-0.06 px, dy -0.5..0.0 px over 80-180 frames; residual difference 3-4 levels per 10 frames is codec/grain noise.
- Evidence: clip27@480-697 (card), clip27@30-150, clip40@380-460, clip30@380-560 (background)

### M29 - Never observed, so do not add: bounce/overshoot/elastic, rotation, 3D or skew, white flash, dip to black, glitch cuts, crossfades between unrelated scenes, whip-pan or blur-zoom scene transitions, caption exit animation, per-letter text animation, presenter-panel entrance, idle float, linear motion other than the border beam.

- Confidence: high
- Numbers: 0 flash frames and 0 black dips in 37,430 frames; largest overshoot 0.2% of travel; motion blur only on slide-push, in-card scroll and in-card push-in.
- Evidence: all 33 reels (full-frame luminance scan, cut classifier, settle pooling)

### M30 - Easing families to implement: emphasized for wipes and reorders, a slightly later-peaking sibling for stage and card travel, exponential ease-out for word offsets/blur and draws, cubic ease-out for opacity.

- Confidence: high
- Numbers: cubic-bezier(0.2,0,0,1): 12 f, 14 f, 15 f, 24 f uses. cubic-bezier(0.3,0,0,1): 22 f and 36 f uses. cubic-bezier(0.2,0,0.1,1): in-card 16 f and 24 f. Expo out: half-life 1.0 f (title words), 0.74 f (caption words), tau 2.0 f (highlight), 1.13 f (strike). easeOutCubic: 6.75 f (caption opacity), 12.25 f (title opacity), ~13 f (grid cell).
- Evidence: fits pooled over the instance sets of M01-M24; easing_tokens

## Constant versus variable

**Constant across reels (identical to the frame or to two decimals):** the two bezier curves and their durations (strip in 15 f, strip out 12 f, white-to-dark 14 f, stage settle 36 f from scale 1.15 about canvas centre); the hook build timeline (28 of 33 reels frame-identical: line-1 words every 2.5 f, strip from f4, line-2 words from f8 every 3 f, shine f23-f29); word-in tokens (title +32 px / 8 px blur halving per frame; caption about +10 px / 6 px blur in 6 f); captions revealed in place and hard-swapped; light-split card slide-down starting at exactly -52.4 px; presenter panel and full-frame presenter never animate; border beam 8.00 s loop with two heads; 5-frame keyword flicker; transitions are hard cuts 94% of the time with no flashes, dips or scene crossfades.

**Variable per video:** whether the title exits (13 reels) or is simply cut (19), and how much of the exit is seen (3-12 f); number of title words (line 1: 1-5, line 2: 1-7) and so the build end (f14-f26); which in-card move is used and how far (scroll 0-47% of card height, push-in up to 1.78x, highlight length 300-930 px, strike rows, count-up, reorder, grid fill); interstitial stage static (4 reels) or zooming (3 reels) and card with or without the 0.946 scale-in; card swap by hard cut (all reels) or slide-push (6 older reels only); light-split card at rest (54) or sliding down (11); card size generation (891 px in newer reels, 939 px in older); strip colour (blue, lime, orange) with unchanged motion, except clip14's orange centre-out wipe; all post-hook timing is driven by speech.

## Disagreements with other studies

- Title exits: 13 animated, 19 cut here; hook counts 14 and 18 (H12).
- Card glint: one lap per 8.00 s regardless of card size here (M27) against a constant speed in graphics (G03). Built as here.
- Highlight sweep: 8-10 frames to 98 % here against 6-8 frames in graphics (G10).
- Transitions: 338 counted here including in-place content swaps inside a mode, against 269 mode-run transitions in structure (S06).
- Caption entrance: see type T10 for the opacity-table differences.

## Open questions

- Opacity versus colour: the slower ink ramp on dark sans words (title 12 f, caption 6.75 f) versus white words (about 4 f) could be a grey-to-dark colour ramp on top of a fast fade, or linear-light compositing. The per-frame tables reproduce the pixels either way; which mechanism to build is undecided.
- Stage settle control points: cubic-bezier(0.3,0,0,1) over 36 f (RMSE 0.0054) versus the free fit (0.3,0.1,0,0.94) over 32 f from cut+1 (0.003). Both are within noise visually; I recommend the round one.
- What decides whether the light-split proof card slides down (11 of 65 cuts) or is already at rest? No content rule was found; it may simply be whether the card is new to that scene.
- Whether the in-card curve (0.2,0,0.1,1) is really distinct from the emphasized curve: only one scroll and one push-in were measured.
- What triggers a static versus a zooming white interstitial (4 versus 3 reels) is unknown; it does not split cleanly by date.
- Border beam phase was matched to the reel clock in three reels only (frame mod 120 about 118); not checked on the presenter panel outline.
- Unmeasured one-off builds: elephant/goldfish comparison (clip37 264-366), chart draw-on (clip26), network graphics (clip22), hook side money chips, the expanding ring around the CTA dot, gameplay-variant specifics (clip07).

## To check by eye or ear

- The media are VP9 at about 1.1 Mbps, not H.264 as the brief assumed; block-hold artefacts limit sub-pixel and low-contrast measurements.
- Low-n tokens should be eyeballed before being treated as style law: in-card push-in, in-card scroll, logo chip pop, big-number count-up, 'comment' tracking tighten (n=1 each); highlight sweep and strike-through (n=4 runs / 5 lines).
- Interstitial word onset frames (+1, +3, +8, +18) and the 3-frame row stagger in the hook card were read from every-frame sheets, not tracked by code.
- The 'hard cut, at rest' count for white interstitials is inflated: stage zoom was detected from the card outline, which fades in late there, so zooming interstitials are counted as at rest.
