# Structure and pacing: measured record (S01-S27)

Part of the Editorial Proof study; read `README.md` first for the corpus, the method and the limits. STYLE.md cites these rules by id, for example [S01]. Frames are at 30 fps (f); positions are pixels on the 1080 x 1920 frame; evidence is given as clip id @ frame (see README.md, "Evidence ids").

**Sample.** All 33 reels at mode level (302 layout-mode runs, 269 transitions between runs) and 20 reels hand-labelled at shot level (328 shots, 754 visual changes aligned to speech). Speech timing from ASR word stamps for all 33 reels.

**Method notes.** Layout mode read per frame and checked once per run; shots (one layout plus one card) labelled by hand from small thumbnails plus the transcript; a shot boundary was checked to within 2 frames on 12 random cases (11 exact within 1 frame). Sentence and clause boundaries come from ASR punctuation and were not checked by ear. Mode letters: L light split (including the hook), D dark focus, W white (interstitial or white focus), P full-frame presenter, B full-frame b-roll (gameplay reel only).

**Confidence.** high = measured on many instances and consistent; medium = measured but on fewer instances or with a judgement step; low = one to four instances, or inferred.

## Rules

### S01 - Every reel opens in light split and ends on a full-frame presenter CTA.

- Confidence: high
- Numbers: 33/33 start in L (32 with the two-line hook title; the gameplay reel has none); 33/33 end in P. CTA length median 114 f / 3.80 s, p10 101, p90 126, range 80-167 f.
- Evidence: n=33 reels, e.g. clip38@0 and @1262, clip39@0 and @1336, clip07@964

### S02 - The opening light-split hook run is short and starts building on the second frame.

- Confidence: high
- Numbers: Hook run median 112 f / 3.73 s, p10 71, p90 153, range 51-183 f; 1-4 shots; 10-27 words. First visual change at frame 1 in 31 of 33 reels (latest frame 3); second change at median 23 f / 767 ms (p10 17, p90 57).
- Evidence: n=33; clip39@1 (build), @145 (first mode change); clip38@77; clip23@51 (shortest); clip13@183 (longest)

### S03 - What follows the hook run varies between three moves.

- Confidence: high
- Numbers: Dark focus 15, full-frame presenter punch-in 9, white (naming or list interstitial) 8, full-frame b-roll 1 (gameplay), out of 33.
- Evidence: n=33; clip38@77 (D), clip40@103 (P), clip39@145 (W), clip07@69 (B)

### S04 - Mode-run duration bounds per layout mode.

- Confidence: high
- Numbers: LIGHT_SPLIT 135.5 f / 4.52 s (p10 68, p90 206, min 19, max 299); DARK_FOCUS 151 f / 5.03 s (p10 79, p90 237, min 43, max 378 = 12.6 s); WHITE_INTERSTITIAL 47 f / 1.57 s (p10 34, p90 66, 30-113); WHITE_FOCUS 89 f (47-122); mid-roll FULL_PRESENTER 32.5 f / 1.08 s (p10 23.5, p90 57.5, 17-78); FULL_BROLL 55-198 f (n=3).
- Evidence: n=302 runs in 33 reels (L 112, D 91, W 37, P 59, B 3); longest D clip30@577-955; longest L clip08@532-831

### S05 - Light split and dark focus split the runtime evenly; the mode changes about 13 times a minute.

- Confidence: high
- Numbers: Runtime share L 40.2 %, D 39.9 %, P 13.1 %, W 5.9 %, B 0.9 %. Mode changes per minute median 13.0 (p10 10.8, p90 16.8). Mode runs per reel median 9 (6-14). L runs per reel 3-4 in 30 of 33; D runs 3 in 20 of 33.
- Evidence: n=33 reels, 302 runs

### S06 - Allowed transitions between modes (counts of observed mode-run transitions).

- Confidence: high
- Numbers: L>D 54, D>L 54, L>P 33, D>P 26, L>W 22, W>D 22, P>D 15, W>L 15, D>W 11, P>L 7, P>W 4, L>B 3, B>L 3. Never observed: W>P (0 of 37 W runs), P>P, D>B, B>D. After W: D 59 %, L 41 %. CTA entered from D 18, from L 15.
- Evidence: n=269 transitions in 33 reels

### S07 - Shot length (one layout mode + one card asset) is about 2 s regardless of mode.

- Confidence: high
- Numbers: All shots median 58 f / 1.93 s (p10 28, p90 122, min 6, max 233). In light split 59.5 f (p10 27, p90 146, max 226); in dark focus 57 f (p10 28, p90 107, max 233); interstitial 47.5 f (32-67, max 94). Shots per minute median 26.6 (p10 20.8, p90 31.8; 15.5-34.8). One shot per 2.25 s (1.72-3.87 across reels).
- Evidence: n=328 shots in 20 hand-labelled reels; boundaries checked +-2 frames on 12 random cases, 11 exact within 1 frame

### S08 - A mode run holds one to three card shots; dark focus holds more than light split.

- Confidence: medium
- Numbers: Shots per L run mean 1.77 (1 shot in 38 of 70 runs, 2 in 19, 3-6 in 13). Shots per D run mean 2.37 (1 in 16 of 54, 2 in 14, 3 in 17, 4-6 in 7). Words per shot median 8-9 (p10 3, p90 14-20).
- Evidence: 20 reels; clip39 D@657-849 has 5 shots (657, 736, 767, 792, 821); L@410-603 has 4

### S09 - A new visual element (card, highlight, chip, number, title part) appears about every 0.7 s; captions excluded.

- Confidence: medium
- Numbers: Interval median 22 f / 733 ms, p10 6 f, p90 51 f / 1.70 s, max 122 f / 4.07 s. 35.5 % of intervals <= 15 f, 65 % <= 30 f, 5.5 % > 60 f, 0.6 % > 90 f. Changes per minute median 61.6 (p10 52.6, p90 80.4; 40.7-103.3). By mode: L 22 f, D 24.5 f, W 13 f, P 29 f.
- Evidence: n=1,311 intervals in 33 reels; onset detector ignores elements under about 4,200-5,700 px2; small-event spot check 10 of 14 real

### S10 - The graphics area is rarely frozen; even the longest holds contain micro-motion.

- Confidence: medium
- Numbers: Longest stretch with no new element per reel: median 77 f / 2.57 s, p90 101 f, max 122 f (clip08@583). Longest truly still graphics zone per reel: median 37 f / 1.23 s, p90 52 f, max 66 f / 2.20 s. Graphics zone still in only 32 % of L/D/W frames (p10 19 %, p90 42 %).
- Evidence: n=33; shows typing, count-ups and ticks inside the 8 longest holds

### S11 - The presenter is on screen about half the time and never away for long.

- Confidence: high
- Numbers: Presenter-visible share median 51.9 % (p10 45.6 %, p90 65.1 %; 39.0-73.2 %). Longest stretch without presenter: median 237 f / 7.90 s, p10 174, p90 329, max 378 f / 12.60 s. Longest stretch with presenter: median 223 f, max 404 f. First frame without presenter: median 130 f (51-218).
- Evidence: n=33; max absence clip30@577-955; min share clip28 0.39; max share clip08 0.73

### S12 - Mode changes are cut on the first word of a sentence or clause, on the word onset.

- Confidence: high
- Numbers: Change frame minus nearest ASR word onset: median -0.4 f / -13 ms, IQR -1.2 to +0.4 f, p10 -2.2, p90 +1.8; 79 % within +-2 f. 59 % land on a sentence start (base rate of words 4.7 %), 19 % on a clause start (base 11.1 %), 22 % mid-clause. Into W 91 % sentence start; into P 67 %; into L 56 %; into D 43 %.
- Evidence: n=175 mode changes in 20 reels; ASR jitter about +-2.5 f against caption pops (n=2,540)

### S13 - Almost every sentence boundary is covered by a mode change.

- Confidence: high
- Numbers: Of 127 sentence boundaries: 105 (82.7 %) have a mode change within +-4 f, 8 (6.3 %) a same-mode card swap, 5 (3.9 %) fall while the presenter is hidden, 9 (7.1 %) pass with presenter visible and no layout change (5 of those inside the CTA, 1 an ASR false break).
- Evidence: 20 reels; uncovered cases: clip39@431, clip37@950, clip11@86

### S14 - Card swaps inside a mode run fall on clause starts or the first content word of the phrase the new card shows.

- Confidence: medium
- Numbers: Delta to nearest word onset median 0.0 f, IQR -1.8 to +1.6, p10 -3.4, p90 +3.2. 29 % on a clause start (2.6x base), 5 % sentence start, 67 % mid-clause. Next content word starts median 3.8 f after the swap (IQR 0.2-7.0).
- Evidence: n=133 same-mode shot changes in 20 reels; clip39@274 'top coding models', @557 'fully locally', @736/767/792/821 one UI per list noun

### S15 - In-shot elements appear on the word they depict.

- Confidence: medium
- Numbers: Delta to nearest word onset median +0.6 f / +20 ms, IQR -1.8 to +2.4 (n=446); 83 % mid-clause; nearest word is a content word 65 % (base 53 %). 30 hand-checked chips, big numbers and highlights sit -10 to +9 f around their key word, median +1 f. 21 % of graphic changes share the exact frame of a caption word pop (random 9.7 %); chips 89 % within +-1 f.
- Evidence: clip39 chips @313/325/334 vs 'Kimi' 307, 'GLM' 322, 'DeepSeek' 336; clip24 '163k' @723 vs '160' 722; clip38 '17 AI agents' @675 vs '17' 673; clip31 '66 film styles' @521 vs '60' 536 (earliest)

### S16 - A short full-frame presenter punch-in lands on a sentence's closing payoff phrase.

- Confidence: high
- Numbers: Present in 24 of 33 reels (one in 22, two in 2, none in 9). Length median 32.5 f / 1.08 s, p10 23.5, p90 57.5, range 17-78 f. Covers the last 2-13 words (median 5); ends on the sentence end in 21 of 26. 9 of 26 come straight after the hook (9-14 % in), the rest at 25-71 %. Entered from L 18, D 8; exits to D 15, L 7, W 4.
- Evidence: n=26 runs; 'completely free.' clip33@181, clip23@321, clip27@154; 'all on its own.' clip10@402; 'here's how.' clip25@104; 'Here's why that's a big deal.' clip16@252

### S17 - Every list item opens on a white interstitial that starts on the ordinal sentence.

- Confidence: high
- Numbers: 22 of 22 items. Starts on the sentence start in 21 of 22 (delta median -0.2 f). Length median 47 f (30-113), about 6 words ('The first is NAME,'). Followed by dark focus 14 times, light split 8. Patterns: WD 9, WL 6, WDL 4, WLD 1, WLP 1, WDLP 1.
- Evidence: 5 list reels: clip39@145/371/603/849/1149, clip31@118/430/688/881/1110, clip24@149/400/771/1023, clip10@156/419/642/884/1109, clip20@354/552/736

### S18 - List video template: hook, N items, CTA, with about 7.7 s per item.

- Confidence: medium
- Numbers: Items 3, 4, 5, 5, 5. Item length median 230.5 f / 7.68 s (p10 194, p90 296; 184-371 f). Shots per item body median 3 (1-6). Words per item median 30.5 (23-42). Runtime share: hook 10.0 % (8.1-10.9 %), interstitials 14.3 % (12.4-21.7 %), CTA 8.2 % (7.8-10.3 %). One of 5 has a 255-frame problem/solution setup before item 1 (clip20@99-354).
- Evidence: n=22 items in 5 reels

### S19 - Single-subject arc: hook, name, what/proof, how, demo, benefit, CTA, with the middle free to interleave.

- Confidence: low
- Numbers: Runtime share median (range): HOOK 11.9 % (5.6-18.6), NAME 4.3 % (0-9.0; in 11 of 15), WHAT 5.3 % (0-25), PROOF mean 4.9 % (in 7 of 15), HOW 20.4 % (4.5-36), DEMO 27.1 % (0-48), BENEFIT 7.5 % (0-31), CTA 11.7 % (7.4-17.2). NAME first starts at 4.7 s (3.1-9.8); CTA at 88 % of runtime. No two reels share a beat order.
- Evidence: 15 single-subject reels (11 blue, 3 lime, 1 gameplay); beat labels are the analyst's reading

### S20 - The naming beat takes one of four forms or is skipped.

- Confidence: medium
- Numbers: White interstitial 'It's Called' + card + name: 7 (5 labelled plus clip14@196, clip13@183). Logo card on dark: 4. Repo page on dark with name boxed: 1. Full-frame presenter: 1. None: 4 of 15 labelled single reels. Length 35-103 f, median 52.
- Evidence: clip38@213 (W), clip30@166, clip22@132, clip09@94, clip29@116 (logo on dark), clip15@293 (repo), clip34@173 (presenter)

### S21 - CTA internal timing is formulaic.

- Confidence: medium
- Numbers: Starts on the sentence start in 20 of 21 (delta median -0.6 f). 'comment' is spoken median 43 f after the CTA starts (p10 36, p90 55); the keyword 50 f after (p10 43, p90 62); the reel ends 66 f / 2.2 s after the keyword onset (p10 58, p90 71). On two strips the 'comment' text appears within 1 f of the word and the keyword graphic -2 to +5 f from its word.
- Evidence: n=33 (ASR); strips clip40@888-914 and clip08@862-888

### S22 - Speech is fast and starts on frame 0.

- Confidence: high
- Numbers: 251 words per minute median (p10 236, p90 273; 223-284). First word at 0 ms in 33 of 33. Tail after the last word median 312 ms (83-511 ms).
- Evidence: n=33, corpus ASR

### S23 - Pauses are cut to about 0.12 s between sentences; nothing over 0.44 s survives.

- Confidence: medium
- Numbers: ASR gap after sentence end: median 120 ms, p90 180, max 440 (n=209). After comma: median 140 ms, p90 220, max 360 (n=376). Longest speech-band audio dip per reel: median 265 ms, p90 302, max 410 ms. Dips >= 200 ms per reel: 0-5.
- Evidence: n=33; max audio dip clip14; max ASR gap clip07 after '$31.'; audio dips include stop closures so counts are upper bounds

### S24 - Mode changes read as one-frame global changes; card swaps inside light split never do.

- Confidence: medium
- Numbers: Share of boundaries where over 50 % of pixels change in one frame: L>L card swaps 0 of 54; D>D 14 of 74 (19 %); D>L 29 of 29; L>P 21 of 21; L>D 25 of 28; W>D 16 of 19; L>W 16 of 18; D>P 14 of 15.
- Evidence: 20 reels, 308 boundaries; clip39@145 hard cut to white, @181 white-to-dark fade over about 7 f with the card kept (evidence strip f138-189)

### S25 - About one bound element per shot, plus word-by-word captions.

- Confidence: medium
- Numbers: In-shot elements per shot: median 1; mean 1.86 in L, 1.27 in D; a third of L and D shots have none; interstitials 2. Caption word pops 2.72 per second median (p10 2.21, p90 2.95) in L and D.
- Evidence: 20 reels for elements; 33 reels, 2,540 caption onsets

### S26 - White-canvas focus sections exist without the interstitial heading.

- Confidence: medium
- Numbers: 8 runs in 7 of 33 reels; median 89 f / 2.97 s (47-122 f); no presenter; followed by D 6, L 2.
- Evidence: clip15@218 (logos pop @248/261/274 on 'LinkedIn', 'Instagram', 'Reddit'), clip26@854, clip25@399, clip16@656, clip35@419, clip32@480, clip23@51

### S27 - Per-video variation is large enough that sequences rarely repeat.

- Confidence: high
- Numbers: 28 distinct mode sequences in 33 reels (most common LPDLDLDP x3, LDLPDLDP x3). Shots per minute 15.5-34.8; presenter share 39-73 %; hook run 51-183 f; shots per reel 9-24. Gameplay reel LBLBLBLP: b-roll 41-198 f replaces dark focus, CTA 81 f. Lime CTAs 152, 167 and 80 f.
- Evidence: n=33; clip07; clip25, clip16, clip11

## Constant versus variable

**Constant (the grammar):** starts in light split (33/33) and ends on a full-frame presenter CTA of 80-167 frames (33/33); speech starts on frame 0 and no pause exceeds 0.44 s; mode changes sit on sentence or clause starts (78 %) within +-2 frames of a word onset (79 %), and 83 % of sentence boundaries get one; light split and dark focus alternate and each take about 40 % of runtime; a new visual element roughly every 22 frames with a per-reel rate of 41-103 per minute (30 of 33 reels between 48 and 90); no mode run and no presenter absence over 378 frames; a white interstitial is never followed by the full-frame presenter (0 of 37); every list item opens on a white interstitial (22/22); CTA wording and timing ('comment' at about 43 frames, keyword at about 50, hold about 66).

**Variable (per-video freedom):** the mode sequence (28 distinct in 33); the move after the hook (dark focus 45 %, punch-in 27 %, white 24 %); whether and where the punch-in sits (none in 9 reels, two in 2); the form of the naming beat (four forms or none); shots per run (1-6) and shot length (0.2-7.8 s); presenter share (39-73 %); hook run length (1.7-6.1 s); optional white-focus sections (7 reels); beat order after the first 30 % (no two reels match); whether output-clip montages cutting every 5-45 frames replace static cards (clip36, clip11, clip29); gameplay variant swaps dark focus for full-frame b-roll and drops the hook title; two of three lime reels run longer CTAs (152, 167 f).

## Disagreements with other studies

- Mode-change rate: this study counts mode runs per frame (median 9 runs per reel, 13.0 changes per minute); the layout study, sampling at 2 fps, counts a median of 8 changes per reel (one every 3.9 s). Both find the L<->D alternation dominant; the per-frame count is used.
- Runtime shares agree within sampling: layout L01 gives dark focus 38.3 %, split 30.0 % plus hook 10.0 %, presenter 10.5 % (CTA) plus 2.7 % (punch-in); this study gives D 39.9 %, L 40.2 %, P 13.1 %.
- CTA keyword timing: this study's coarse glow detector puts the keyword graphic a median +7.5 frames after the spoken keyword (S21); the hook study measured it frame by frame as a fixed +14 frames after 'comment' (H22). The hook figure is used.
- Pauses: ASR gaps here (sentence end median 120 ms, max 440 ms) and the audio study's energy gaps (median 45 ms, max 245 ms, A04) measure the same tightening differently; ASR stamps exaggerate gaps.
- Speech rate: 251 words per minute here, 257 in the audio study (A02); different word-count windows.
- Mid-video full-frame runs: 26 runs in 24 reels here (S16), 27 in 24 in the presenter study (P15), which also counts a full-frame beat between two graphics.

## Open questions

- Are raw-footage jump cuts really hidden under mode changes? The timing fits (83 % of sentence boundaries covered) but the cuts themselves cannot be seen in finished video.
- Is W>P truly forbidden or just unobserved (0 of 37 white runs)?
- How much of the gameplay variant is a rule? There is one reel, so its b-roll lengths and missing hook title cannot be generalised.
- The 'no new element' maximum of 122 frames is an upper bound: elements under about 4,200-5,700 px2 and continuous animations are not counted. The true ceiling is lower.
- Do card swaps follow the editor's own caption timings? 29 % share the exact frame of a caption pop, which suggests word-snapping with a few frames of hand adjustment, but this is not proven.

## To check by eye or ear

- Beat labels (HOOK/NAME/ITEM/WHAT/PROOF/HOW/DEMO/BENEFIT/WHY/CTA) in the shot timelines are one analyst's reading from 144x256 px thumbnails plus transcript; the narrative shares depend on them.
- Graphic descriptions in the timelines were read from small thumbnails; card text was not OCR-verified.
- clip25@61: a montage cut inside the hook card could not be confirmed on the 5-frame strip (the real cut may be at 69).
- The 13 reels without hand labels were verified only on one mid-frame per mode run; a misclassified span under 8 frames would have been smoothed away unseen. Two such errors were found and fixed in labelled reels (clip36@843-864, clip29@731-748 and @781-790).
- CTA keyword-graphic timing rests on two frame strips plus a coarse glow detector (median +7.5 f, likely late); the hook analyst's measurement should take precedence.
- Sentence and clause boundaries come from ASR punctuation, which was not listening-verified.

## The analyst's segment table and decision rules

Derived from the 302 mode runs and 328 labelled shots; STYLE.md section 4.9 condenses them. Frames are given as min / typical / max.

| Segment | Trigger | Starts on | Frames |
|---|---|---|---|
| LIGHT_SPLIT_HOOK | first sentence (10-27 words) | frame 0 | 51 / 112 / 183 |
| FULL_PRESENTER | last 2-13 words of a sentence carrying the payoff (completely free / all on its own / here's how) | clause start or key word | 17 / 33 / 78 |
| WHITE_INTERSTITIAL_list | ordinal opener: The first is X / Second is X / And finally X | sentence start (21 of 22) | 30 / 47 / 113 |
| WHITE_INTERSTITIAL_name | It's called X / This is called X | sentence start | 35 / 52 / 103 |
| DARK_FOCUS | source, proof, terminal, output, numbers | sentence start 43 % / clause start 24 % / mid-clause 33 % | 43 / 151 / 378 |
| LIGHT_SPLIT | how-to, feature lists, UI walk-through | sentence start 56 % / clause start 24 % / mid-clause 20 % | 19 / 135 / 299 |
| WHITE_FOCUS | a diagram, or logos popping one per spoken name | sentence or clause start | 47 / 89 / 122 |
| FULL_PRESENTER_CTA | So if you want... / Want to try... comment X | sentence start (20 of 21) | 80 / 114 / 167 |

Decision rules:

1. Tighten the raw take first: speech on frame 0, sentence gaps ~120 ms, comma gaps ~140 ms, nothing over 440 ms, end ~0.3 s after the last word.
2. Every sentence start is a mode change unless the sentence is under ~0.6 s or inside the CTA; place it on the onset frame of the first word (0-1 frame early).
3. A mode run holds 1-2 sentences; split at the next clause start if it would pass ~6 s in light split or ~8 s in dark focus.
4. Never leave the presenter off screen more than 378 frames; aim to return by 240.
5. Inside a run, swap the card at each clause start or at the first content word of the phrase the next card shows; keep shots 25-145 frames.
6. Bind each in-shot element to its word within +-3 frames: highlight on the phrase read, one chip per named brand, big-number block on the number word, row light-up per list noun.
7. If no card or element change falls in a 51-frame window add one; never exceed 122 frames; do not leave the graphics area frozen beyond 66 frames.
8. An ordinal opener always gets a white interstitial at the sentence start; carry its card into the next mode.
9. A naming sentence gets one of: white interstitial, logo card on dark, repo page with name boxed, or nothing.
10. At most two full-frame punch-ins per video, never straight after a white interstitial, each ending on the sentence end.
11. The closing sentence is the full-frame CTA: show comment and the keyword on their spoken words, hold ~66 frames after the keyword.
