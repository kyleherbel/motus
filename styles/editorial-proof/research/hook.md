# Hook, interstitials and call to action: measured record (H01-H28)

Part of the Editorial Proof study; read `README.md` first for the corpus, the method and the limits. STYLE.md cites these rules by id, for example [H01]. Frames are at 30 fps (f); positions are pixels on the 1080 x 1920 frame; evidence is given as clip id @ frame (see README.md, "Evidence ids").

**Sample.** The opening 60-190 frames of all 33 reels frame by frame (32 carry a title; the gameplay reel has none), every title exit, all 22 numbered and 6 naming interstitials, and the last 59-167 frames of every reel (the CTA). Title copy read at the settled frame and compared with ASR.

**Method notes.** Per-frame opacity, position and width tracking of title words, strips and CTA text; ASR alignment for speech-anchored events (+-3 frames). Three files start 1-6 frames into the title build (export trim) and were excluded from frame-offset statistics.

**Confidence.** high = measured on many instances and consistent; medium = measured but on fewer instances or with a judgement step; low = one to four instances, or inferred.

## Rules

### H01 - Frame 0 is the empty stage, not a cover: canvas and presenter panel are present, the title and caption are not. Speech starts at t=0; there is no lead-in.

- Confidence: high
- Numbers: canvas+presenter 33/33; proof card visible 13/33 (+1 empty outline); any title text 2/33 (only head-trimmed files); complete title 0/33; first caption word f1-f3 (median f2, n=20)
- Evidence: all 33 reels @f0); cap0 measurement n=20

### H02 - The title is a fixed animation starting at frame 0 and is not synced to speech. Line-1 words (bold dark sans) become visible one at a time with a 2.5-frame stagger.

- Confidence: high
- Numbers: word i first visible at ceil(0.5+2.5i) = f1, f3, f6, f8, f11 (83.3 ms stagger); measured [1,3,6] in 9 three-word reels, [1,3,6,8] in 15 four-word reels, fifth word f11 in clip20
- Evidence: clip39@1-9, clip37@1-8, clip20@1-11; n=29 untrimmed reels, 98 words

### H03 - Each line-1 word arrives blurred, light and low, then rises, sharpens and darkens over 8 frames. The grey-then-dark look is this opacity ramp, not a two-state colour.

- Confidence: high
- Numbers: opacity per frame from first visible: 0.12, 0.33, 0.53, 0.68, 0.79, 0.86, 0.93, 0.97, 1.00 (p10-p90 within +-0.04); y offset below final: 16.5, 8.4, 4.2, 2.1, 1.0, 1.0, 0 px (halves each frame); final ink about #111111; 8 frames = 267 ms
- Evidence: 98 words in 29 reels; clip39@1-14

### H04 - The coloured strip wipes in from its fixed left edge (right edge grows), at full height and opacity from its first frame. There is no separate cursor bar; the bar on f5 is the first 5.6 % of the wipe. The curve is identical regardless of strip width.

- Confidence: high
- Numbers: first visible f5, full f18-19 (f18 in 25 reels, f17 in 3); width fraction f5..f19 = 0.056, 0.288, 0.500, 0.636, 0.732, 0.802, 0.856, 0.897, 0.929, 0.954, 0.972, 0.985, 0.993, 0.999, 1.000; spread +-0.003 over strip widths 394-932 px; INFERRED fit: start f4.0, 14.5 frames, cubic-bezier(0.205,0,0.003,0.977), max error 0.0008
- Evidence: 28 untrimmed reels @f5-19, e.g. clip39@5-19 widths 38,193,336,427,492,539,575,603,624,641,653,662,668,671,672

### H05 - Italic serif strip words appear one at a time on a 3-frame stagger and are masked by the strip: a word beyond the strip's current right edge is clipped.

- Confidence: high
- Numbers: word j first visible at f = 9+3j (9, 12, 15, 18, 21); opacity from first visible 0.22, 0.58, 0.80, 0.92, 0.97, 0.99; y offset 11, 6, 3, 1.9, 0.9, 0 px; first word reads f9 in 27/28 untrimmed reels
- Evidence: clip40@9,12,15,18,21 (5 words); clip10@9,12,15,18; clip15@12 shows 'API' clipped; n=25 for the curve

### H06 - After the title is built a single light sheen sweeps the strip left to right.

- Confidence: high
- Numbers: frames 23-29 (fading out by f30); band centre at 0.17, 0.46, 0.67, 0.82, 0.90, 0.91 of strip width on f23-28; band FWHM 13-15 % of strip width; lifts the strip's red channel by 48-67 levels (blue channel on lime)
- Evidence: 32/32 titled reels, e.g. clip39@23-29, clip27@22-27

### H07 - Title geometry: everything centred on x=540; fixed strip height and fixed distance from line 1 to the strip; strip width follows the text; long line-1 text is set smaller instead of wrapping.

- Confidence: high
- Numbers: strip centre x 539.5-540.0 (32/32); strip height 134 px (26 reels), 140 px (4 newest), 93-107 px (5 reels with flanking mascots); strip top y 298-365 (median 331); strip width 394-932 px; ink padding left 14-30 (median 19), right 20-33 (median 30); line-1 cap top = strip top - 95 px (82-101), baseline = strip top - 31 px, cap height 64 px; line-1 ink width 544-907 px, shrunk above about 890 px; fill #0b89f7 (29 reels) or #d4fc25 (3 lime)
- Evidence: 32 reels @settled frame); clip39@50 strip [204,336,875,475]

### H08 - The title is complete within two thirds of a second.

- Confidence: high
- Numbers: complete at f19 (2 strip words), f20 (3 words, 22/32 reels), f23 (4 words), f26 (5 words); sheen done by f30 (1.0 s)
- Evidence: clip39@20, clip10@23, clip40@26; n=29

### H09 - Optional flanking decorations (pixel mascots, white icon chips, cash emoji, a brand logo) appear left then right of the strip, never before f6. They are per-video freedom and only occur in the newest reels.

- Confidence: medium
- Numbers: 8/32 reels, all among the 14 newest (31 Oct - 9 Nov); left first visible f6-12, right 3-5 frames later; clip27 four bills at f12, 15, 18, 21 with overshoot pop; clip39 bills late at f69-79 on the spoken '$1,000'; chips about 113x113 px, about 35 px from the strip; strip height drops to 93-107 px with mascots
- Evidence: clip33@9-16, clip27@12-24, clip36@7-9, clip32@6/11, clip39@69-79

### H10 - Other opening elements: the presenter panel is present from frame 0; a card that is not on frame 0 fades in during the first five frames; captions follow speech from the first word while the title does not.

- Confidence: medium
- Numbers: presenter on f0 33/33; card absent on f0 in 19/33, then at >=90 % on f5 in 10 clean cases (9 at f5, 1 at f4), later in clip24 (f6-10); first caption word f1-f3 (median 2, n=20); clip39 price rows at about f2, 5, 8, 11, 14
- Evidence: clip15@5, clip14@5, clip27@5, clip39@0-15

### H11 - The title stays for the hook claim, then the layout cuts. Where the cut lands depends on what follows.

- Confidence: medium
- Numbers: cut frame 60-183, median 114 (3.8 s), mean 117, n=32; 14/32 cut 0.03-0.28 s after a sentence end (all 7 white-interstitial followers + 7 dark-focus); 9/32 cut to dark focus at a comma/clause boundary inside a 4.9-9.2 s first sentence; 9/32 (every cut to full-frame presenter) cut 0.4-2.0 s before the sentence ends so the closing phrase is said to camera
- Evidence: clip39@145 (+0.03 s), clip31@118 (+0.05 s), clip28@121 ('completely | free'), clip18@107 ('| just like a human'); ASR alignment, n=32

### H12 - The title leaves either by hard cut with the title intact, or by a reverse animation that the scene cut usually truncates: line-1 words fade left to right, then the strip collapses toward its right edge.

- Confidence: high
- Numbers: hard cut 18/32; animated 14/32; animated exit from E0: line darkness 0.89, 0.73, 0.50, 0.30, 0.15, 0.07 on E0..E0+5; strip left-edge progress from E0+2: 0.10, 0.408, 0.608, 0.735, 0.82, 0.88, 0.924, 0.955, 0.977; full exit 13 frames; frames shown before the cut: 2, 5, 5, 5, 7, 7, 7, 7, 7, 9, 12, 12, 14, 16
- Evidence: clip40@89-103, clip39@133-145, clip35@70 hard cut

### H13 - What replaces the title: evidence in dark focus by default, otherwise a full-frame presenter beat or a white interstitial. The title never returns.

- Confidence: high
- Numbers: dark focus 16/32, full-frame presenter 9/32, white interstitial 7/32 (numbered 4, 'It's Called' 2, plain white card 1); in clip23 the stage cuts to white at f51 while the title stays until f112
- Evidence: 32 reels @cut-1/cut+2/cut+12)

### H14 - Hook copy length: two short lines, Title Case on every word including articles and prepositions, no end punctuation, digits and symbols for numbers.

- Confidence: high
- Numbers: line 1: 4 words median (2-5; 3w x12, 4w x18), 19 chars median (14-26); strip: 3 words median (2-5; 2w x7, 3w x22), 15 chars (7-18); whole title 7 words (4-8), 34 chars (23-41); 'five'->'5', '500 bucks'->'$500', '90 milliseconds'->'90ms'
- Evidence: 32 titles read at settled frames, e.g. clip40@58 'Free API Credits / Up To $500 A Month', clip10@58 '5 Plugins To Code / Like A Senior Dev'

### H15 - The title is a compressed re-ordering of the opening claim, not a quote. Line 1 holds subject and verb and usually reads unfinished; the strip holds the payoff.

- Confidence: medium
- Numbers: title words found in the first two spoken sentences: median 86 %, mean 80 %, min 33 %; strip is a noun phrase 16/32, prepositional qualifier 9/32, verb phrase 3/32, short clause 4/32; line 1 ends on a verb/preposition/possessive/connector 18/32; line 1 opens with an imperative verb 12/32, a product name 10/32, a digit 3/32
- Evidence: ASR vs titles, n=32; clip23: an opening sentence about cloning any app becomes 'Clone Any App With / Claude Code'

### H16 - Every list video gets one numbered interstitial per item, and only list videos get them. The cut to it lands on the first word of the sentence that introduces the item.

- Confidence: high
- Numbers: 22 instances in 5 reels (5+5+4+3+5), none skipped; heading '<Noun> Number' with noun = Repo/Plugin/Tool, block word One..Five; T0 minus ASR start of 'The'/'And' = -2..+4 frames (median 0), 22/22; first one directly replaces the hook title in 4/5 reels
- Evidence: clip39@145,371,603,849,1149; clip31@118,430,688,881,1110; clip24@149,400,771,1023; clip20@354,552,736; clip10@156,419,642,884,1109

### H17 - An interstitial restarts the hook-title template at a hard cut to a flat white stage; the item name follows about two thirds of a second later.

- Confidence: high
- Numbers: from T0 (first white frame): heading word 1 at +1, word 2 at +3; block wipe +5 to +15..18 (same width curve); first block word first visible +9, further words every 3 frames; card fades +6 to +10..12 (or is already present at +0); item name first visible +19..+28 (median +20), 4-12 frames after it is spoken; block wipe start +5 in 27/28
- Evidence: clip39@145-180, clip10@156-195, clip26@101-128, clip11@257-283; n=28 instances

### H18 - Interstitial geometry is rigid and reuses the title component.

- Confidence: high
- Numbers: stage #fdfdfd; heading cap top y=271 (cap height 63); block y 365-498 (h 134), centred, width One 228, Two 217, Three 297, Four 252, Five 228; card outline x 115-965, y 527-1148 (851x622); item name cap top y=1210 (cap height about 76); 'It's Called' block x 302-777 (w 476), y 240-374 or 256-390; clip10 stack 16 px higher; clip39 and clip24 stack eases down 34 px over 30 frames
- Evidence: clip31@160, clip39@176, clip20@400, clip10@190, clip26@130, clip14@225

### H19 - An interstitial lasts as long as the naming sentence and ends by hard cut at the first word of the next clause. The naming version ('It's Called') is optional.

- Confidence: high
- Numbers: numbered duration 30-100 frames, median 47 (1.57 s), 20/22 within 30-65; naming duration 35, 37, 40, 53, 70, 77 frames; naming interstitial used in 6 of 21 reels that say 'called' in the first 16 s (4 blue 'It's Called', 2 lime 'A (New) Higgsfield Tool')
- Evidence: clip39@145-180 ('The first is OpenCode,' then 'a free...'), clip10@642-672, clip26@101-153, clip13@183-219

### H20 - The progress counter is not on the interstitial. It is a dark pill in the top-right chrome of every proof card of the section, re-entering with each new card and changing value only at the next interstitial.

- Confidence: high
- Numbers: present in 3/5 list reels (clip39, clip24, clip10); capsule 124x42 px (117x39 in clip24), fill (30,29,30), white bold current number, grey ' / N'; pill top = card top + 14, right = card right - 22 (clip39@1194: x 840-964, y 269-311); slides in from about 100 px right
- Evidence: clip39@204-1335 (1/5..5/5), clip10@196-1317, clip24@275-1281)

### H21 - The CTA is one full-frame presenter shot. The italic serif 'comment' replaces the caption in a single frame, anchored to the spoken word, and settles from an enlarged size.

- Confidence: high
- Numbers: C0 (first frame with 'comment') minus ASR start of 'comment' = -8..+2 frames, median -2; C0 before end of file 59-120 frames, median 76 (2.5 s), 32/33 within 59-87; scale 1.15-1.2x to 1.0x over 10-16 frames; no fade-in (1 frame)
- Evidence: 33/33 reels; clip39@1381, clip24@1328, clip40@893

### H22 - The quoted keyword follows 'comment' by a fixed offset, not by its own spoken timing, and flickers in over five frames while 'comment' dims behind it.

- Confidence: high
- Numbers: keyword start = C0+14 in 25 reels, C0+10 in the 8 oldest (12-20 Oct), +15 in clip18; steady 4 frames later (31/33; 5 in 2); fraction of keyword pixels matched per frame 0.3, 0.03, 0.7, 0.15, 0.93, 0.98, 1.0; 'comment' peak white 254 -> median 232; keyword top sits 29-39 px below the top of 'comment', covering about its lower 55 %
- Evidence: 33/33; clip39@1395-1399, clip24@1342-1346, clip15@944-948

### H23 - The final cut to the full-frame presenter lands on the first word of the CTA sentence; there is no cut after 'comment'; the reel ends hard on the held CTA.

- Confidence: high
- Numbers: final cut 79-167 frames before end, median 114 (3.8 s); on the CTA sentence start within 1 frame in 21/33, on the ASR-split lead-in (29-41 frames earlier) in 10/33; 'comment' 0-71 frames after the cut (median 40); hold after keyword steady 41-102 frames, median 59; last word ends 2-15 frames before the last frame (median 9); no fade, no freeze; 1/33 has one trailing black frame
- Evidence: 33/33; clip39@1336 cut/@1455 end, clip40@840, clip35@1140 black frame

### H24 - A blue ripple dot appears beside the CTA in some of the newest reels, always at the same place, shortly before the keyword.

- Confidence: high
- Numbers: 6/33 reels (clip40, clip39, clip38, clip36, clip35, clip32), all with blue/cyan keywords; starts C0+8 or +9, fades in over 6 frames; disc diameter 97 px, centre (978,1211), fill (41,127,240); ring emitted about every 43 frames; halo about 230 px
- Evidence: clip39@1387-1455, clip40@901, clip36@1059

### H25 - Spoken CTA follows one skeleton and the on-screen keyword is always a single capitalised word that the video has already used.

- Confidence: high
- Numbers: 'just comment' 32/33; 'down below' 30/33; 'send' 26/33 vs 'DM' 7/33; 'directly' 28/33; 'if you want...' lead-in 22/33; sentence 12-34 words (median 20); keyword 1 word 33/33, 2-7 letters (median 6); product/brand name 10/33, topic noun 23/33; keyword in hook title 15/33, in first two sentences 26/33, spoken before the CTA 31/33
- Evidence: 33 ASR CTA sentences vs on-screen keyword, e.g. clip39: the spoken CTA asks for a repo comment; the on-screen keyword is "Repo"

### H26 - CTA overlay comes in three sizes with the same proportions; keyword colour is blue by default and takes the brand colour for brand words.

- Confidence: medium
- Numbers: 'comment' ink box 358,1357,745,1423 (387x66; 14 reels), 332,1331,771,1406 (439x75; 10 reels, top y 1264-1343), 297,1318,806,1405 (509x87; 9 reels); ink centre x=551 in all; keyword top y 1386 / comment top+33 / 1357; glow family blue-cyan 19, yellow 7, green 2, orange 2 (Blender, Claude), lime 3 (Higgsfield); blue glow about (91,198,250), fill white -> (117,223,250)
- Evidence: 33 final-frame crops ; clip39@1453, clip24@1400, clip15@1003

### H27 - Lime product variant: identical template and geometry, colour swap only.

- Confidence: high
- Numbers: strip first f5, full f17-18, words 9/12/15, strip h 134; fill #d4fc25 (measured #d3fc22, #d7fd26, #d4fc25) with near-black italic text; lime naming block 758 px ('A Higgsfield Tool') and 940 px ('A New Higgsfield Tool') wide; CTA keyword glow hue about 80 deg (196,255,83); CTA offset +14; no dot
- Evidence: clip25@5-18 and @121-190, clip16@5-17, clip11@5-18 and @257-333; n=3

### H28 - Gameplay variant: no title; the first proof card takes the title zone and the footage itself is the hook.

- Confidence: low
- Numbers: browser card x 48-1031, chrome top y about 255, bottom 829, present on f0; full-frame gameplay from f69 (2.3 s) to f123; CTA standard with keyword at C0+10, C0 = n-81, cut to presenter on C0
- Evidence: clip07@0-138, @964-1044; n=1

## Constant versus variable

**Constant (core style):** the stage is already on frame 0 and the title starts on frame 1 regardless of speech; one title component (bold dark sans line over a 134 px rounded block with italic serif text, centred x=540, line cap top 95 px above the block); every offset of its build (line words f1/3/6/8/11, block wipe f5-18 on a fixed curve from the left, block words f9+3j clipped by the block, sheen f23-29, complete by f20); the same component and offsets restarted at a hard cut to #fdfdfd for every interstitial (heading +1, block +5, ordinal +9, name about +20); one numbered interstitial per list item, cut on the first word of "The first is"; CTA as a single full-frame presenter shot with italic "comment" hard-on 2 frames before the spoken word, quoted one-word keyword flickering in exactly 14 frames later (10 in the oldest batch), about 2 s hold, hard end; copy of 4-8 Title Case words and a one-word keyword.

**Variable (per video):** title text, strip width 394-932 px, strip top y 298-365, shrunk line 1 for long text, strip height 93-107 px when mascots flank it; flanking decorations (8/32) and their entrance; whether the card is on frame 0 (13/33); title hold 2.0-6.1 s; hard cut (18) vs animated exit (14); what follows (dark focus 16, presenter 9, white 7); whether a naming interstitial is used (6/21) and its wording; heading noun; stack ease-down; counter pill (3/5 list reels); CTA keyword, glow colour family (blue 19, yellow 7, green 2, orange 2, lime 3), overlay size (three sizes), ripple dot (6/33), spoken CTA length; accent colour blue vs lime for a product.

## Disagreements with other studies

- Strip colour: #0b89f7 here (default decode) against #0184FE in the calibrated colour study (C02). The calibrated value is used.
- Strip height: 134 px (26 reels) and 140 px (4 newest) here; layout reads 132-141 px (L05); type reports clusters at 134, 154 and 169 px (T05). The 154/169 readings are not confirmed elsewhere.
- Title exits: 18 hard cuts and 14 animated exits here; motion counts 19 and 13 (M06). One reel was judged differently.
- Line 1 to strip: line-1 baseline 31 px above the strip top here (H07); layout measures 33 px (L05).
- CTA keyword timing: a fixed +14 frames after 'comment' here (H22) against a coarse +7.5 frames after the spoken keyword in structure (S21). This study's frame-by-frame figure is used.

## Open questions

- Why the keyword offset is +10 in the 8 oldest reels (12-20 Oct) and +14 in the 25 newer ones: probably a template revision, not provable from the files. Which should the rebuild use? (+14 is current.)
- Is the blue ripple dot meant to mark Instagram's comment button? Its fixed position (978,1211) suggests so; it is absent in 3 of the 9 newest reels and in every non-blue keyword reel.
- Is the animated title exit meant to be seen in full? The cut truncates it in 12 of 14 reels.
- Three files start 1-6 frames into the title build (clip38, clip28, clip18). Export trim or intentional? The rebuild should probably start at template frame 0.
- The Instagram cover image is not in the files; frame 0 is never a finished title frame, so a cover needs to be rendered separately (for example template frame 30).

## To check by eye or ear

- Strip corner radius (about 8 px) and drop shadow were read by eye only; confirm with the type and colour analysts.
- Flanking chip and mascot sizes (about 113 px chips, about 150 px mascots) were read from a 0.6x montage, +-5 px.
- Card fade timing inside interstitials was verified cleanly in 9 of 28 instances; the detector misreads mostly-white web-page cards.
- Start scale of the CTA 'comment' pop was measured in 5 % steps (1.15-1.2x); exact value and easing need the motion analyst.
- Glow hue for clip12, clip07 and clip16 was mis-sampled automatically (skin picked up); their colour family in the report is from the frames and the keyword gradient.
- Speech alignment uses ASR word starts (+-3 frames), so the 'cut on the first word' and 'comment 2 frames early' rules should be spot-checked by ear.
- Presenter panel having no entrance animation at f0 was judged from sheets, not measured.
