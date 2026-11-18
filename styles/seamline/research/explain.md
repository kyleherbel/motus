# Explanation: how the footage acts the sentence out

Measured on the 30 in-style clips of the reference corpus (neutral ids clip01 to clip30, by publication date, 2026-03 to 2026-11). Evidence ids are `clipNN@frame` at the clip's own rate (23.976 or 24 fps); evidence files stay in the private study folder and are not part of this repository. Confidence is the analyst's.

## Summary

Explanation pass on the graphics analyst's unit inventory (709 units, 30 clips). Part 1, footage that acts the sentence out: 241 footage units in all 30 clips (a systematic sample of every 4th footage unit, 128 units, plus every unit on an example/result clause, 57, and every demo/hands-on unit, 111). For each unit a review sheet shows the frame under every spoken word (up to 9 words), the cut, +3 f, detected events and the last frame, over an every-frame motion trace computed from a full decode of all 52,700 frames (BT.709 limited->full, page white 252). Idea, kind, device, relation and the moment on screen at the key word were read by eye; event frames come from the trace and from per-frame box differencing. Part 2: all 117 units filed as built, illustration, diagram, chart, logo, chip, label, highlight, arrow, card or picture-in-picture (27 clips) were coded with anchor, events, device, literal/diagram/metaphor and parametric/bespoke; 49 events in 30 units were timed to the frame with every-frame difference measurement and every-frame strips. Every cut in the inventory (679) was aligned to ASR word onsets.

The footage is chosen literally and timed on the clause. Cuts land on the first word of a clause (64% of word-aligned cuts, chance 16.5%); they do not hunt for the noun. Inside the shot the editor picks the in-point so something visible happens on the key word: in the systematic sample 50% of units have an output appearing, a click, a re-cut or a logo write-on within 12 f of the key word (median 1 f before it), 12.5% put the finished thing on screen from the cut ahead of a pointing word, 29% (mostly opinion, context and CTA clauses) have no sync. 89% of footage shows the literal thing, the action, the result, the person or the logo; metaphors are 1.6% and are maker or stock footage. Device reach in the systematic sample: action in progress 21%, result 12%, generic product context 10%, literal object 9%, logo, on-screen-text echo and person 7% each, document page and montage 6% each.

Editor-built graphics are few (12 units, 6 clips) and work as status tables, two-sided comparisons, typed lists and highlighted quotes; each element pops, types or blinks 0 to +4 f after the word it names (editor events median +1 f, 25/28 within 6 f). Built units carry a median 2 events, the anchor sits alone 5 f, events are 16 f apart and the last one holds 31 f. Stills always move except editor text cards: either an eased push 1.000->1.070 over the whole unit (cubic-bezier .42,0,.58,1, 4 clips) or a linear 1.0-1.5%/s push (3 clips), centred on the panel.

## Rules

### X01. Cut to new footage on the first word of the clause it illustrates (offset 0 f, within +-2 f); do not move the cut to the noun.

- Values: Of 679 unit starts (30 clips), 601 (88.5%) lie within 3 f of a word onset (chance 78.9%: words are dense); of those 386 (64.2%) are on the clause's first word (chance 16.5% from 120 random words). Footage cuts alone 64.1%, face cuts 64.7%. Offset to that onset median 0 f (p10 -2, p90 +2). Mid-clause landings (n=215): noun 34.9% (base 43.3%), function word 28.4% (35.8%), verb 17.7% (11.7%), uncut sub-clause start 16.3% (5.8%), sentence end 2.8%; phrase starts total 70.0% of word-aligned cuts, a noun mid-clause 12.5%.
- Evidence: n=679 cuts, 30 clips; evidence/cut_landing.csv (word at every cut), evidence/inner_cut_tags.txt and evidence/inner_cuts.txt (by-eye role of 215 mid-clause landings), evidence/baseline_word_tags.txt (base rate, 120 random words); scripts/words.py. Clause boundaries are the graphics analyst's; onsets are faster-whisper estimates.
- Confidence: high

### X02. Show the literal thing, the action, the result, the person or the logo the speaker names; a picture that only illustrates by metaphor is almost never used.

- Values: Systematic sample (every 4th footage unit, n=128, 30 clips): literal 25.8%, result 24.2%, action 21.1%, context (product footage unrelated to the clause) 10.9%, person 8.6%, logo 7.8%, metaphor 1.6%. All 241 units: action 30.7, result 24.5, literal 22.8, context 10.0, logo 5.4, person 5.4, metaphor 1.2%. The 3 metaphor shots are maker film (clip21@678 dot tree for 'tracked down the root cause', clip21@923) or stock (clip27@1240 chess for '4D chess').
- Evidence: n=241 units, 30 clips, read by eye from review sheets (one frame per spoken word); evidence/part1_footage_codes.csv column rel; evidence/review_sheets/part1_01..49.jpg.
- Confidence: medium (one coder's reading; codes not double-checked)

### X03. Use this footage device vocabulary, in this order of reach: action in progress, result/output, product context, literal object, logo, on-screen text that echoes the word, person, document page, montage of examples; the rest are rare.

- Values: Systematic sample n=128 (units, % , clips): ACT action in progress 27, 21.1%, 18 clips; RES result 15, 11.7%, 10; CTX context 13, 10.2%, 11; LIT literal object 12, 9.4%, 11; LOGO 9, 7.0%, 8; ECHO footage whose own text says the word 9, 7.0%, 6; PER person 9, 7.0%, 5; DOC document page 8, 6.2%, 6; MONT montage 8, 6.2%, 6; BA before/after 3; NUM chart 3; PLACE stock of the place 3; IO inputs beside output 2; INST one instance for a category 2; CHG change of state in one shot 2; MET metaphor 2; GRID many copies 1. All 241: ACT 73, RES 29, CTX 23, LIT 21, DOC 16, MONT 15, LOGO 12, ECHO 10, PER 10, IO 9.
- Evidence: n=128 (systematic) and 241 units, 30 clips; numbers.json analysis.part1_systematic_A.device_reach; evidence/part1_footage_codes.csv; e.g. ACT clip02@816 (prototype clicked through), RES clip22@543 (the 3D model 'I had this'), ECHO clip07@135 film text 'Apache 2.0 License', IO clip22@426 input photos, CHG clip13@730 flamingo.
- Confidence: medium (by eye)

### X04. Choose the source in-point so a visible event lands on the clause's key word, 0-8 f before it (median 1 f before): in_point = event time in source - (key word onset - cut frame) - 1 f.

- Values: Systematic sample: event within 12 f of the key word in 64/128 (50.0%), offsets median -1.0 f, p10 -8.4, p90 3.0; all 241: 126 (52.3%), median -1, p10 -8.5, p90 +5, range -12..+11. Events after the word by more than 12 f: 2/241. Code check from every frame: a measured motion burst or source cut within 6 f of the key word in 51.3% of 152 units vs 37.6% for a random point in the same units.
- Evidence: n=241 units, 30 clips; evidence/part1_footage_codes.csv (key_word, key_on_f, event_minus_key_f, sync); evidence/review_sheets; work/unit_motion.json from scripts/unit_motion.py; examples clip02@630 (result screens on 'I enter', -2), clip16@279 (countdown hits 00:00 by '60 seconds', -3), clip30@719 (ship reaches the tower arms on 'tower arms', -2), clip24@770 (slider dragged on 'adjust', -3).
- Confidence: medium (events and key words read by eye; onsets are ASR estimates; excess over chance is moderate)

### X05. Make about half of the on-word events cuts: re-cut inside the same source (or to the next source) on the key word when the source has no event there.

- Values: On-word events by type (n=126): re-cut/source cut on the word 56 (44%), output or result appears 24, other in-shot action 20, typing/cursor/click 14, on-screen text arriving 9, logo write-on 3. Systematic sample: 31 cuts vs 33 in-shot of 64.
- Evidence: n=126 on-word units, 30 clips; evidence/part1_footage_codes.csv columns moment_at_key, event_is_cut; e.g. clip02@433 maker demo re-cut on 'typing' (-2 f), clip02@100 source cut to the new UI on 'today's' (0), clip06@1387 cut to the skills page on 'new' (-1), clip22@1137 cut to the parts list on 'instructions' (0).
- Confidence: medium

### X06. When the speaker points ('this', 'look', 'you're seeing', 'check out'), put the finished thing on screen from the cut, before the pointing word.

- Values: Deictic units 12/12 show the referent at the word, never after it: offsets 0 to -39 f, median -13.5 f. FROM_CUT units (thing on screen from the cut, word later) 24/241, lead median 29 f (p10 14, p90 55).
- Evidence: n=12 deictic units in 11 clips (clip01@1369, clip03@0, clip06@67, clip08@960, clip11@432, clip19@993, clip20@184, clip22@543, clip24@686, clip26@187, clip29@18, clip29@190); evidence/part1_footage_codes.csv column deictic.
- Confidence: medium

### X07. Pick footage per idea with this decision table (the planning guide's table): named thing -> legible product/logo from frame 0; feature -> maker demo of it working; demonstration -> the output itself; steps -> own screen recording of the step; process -> a render/demo doing each verb; quantity -> footage that shows the amount or the maker chart; enumeration -> new footage per item; comparison -> labelled pairs; news -> maker film/stream with the name visible; person -> that person; quote -> the speaker or the highlighted text; opinion/context/CTA -> product footage running, no sync.

- Values: On-word share / from-cut share / no-sync share by idea (n units, clips): thing named 79/4/8% (24, 16); feature 42/6/23% (31, 13; ACT 21/31); demonstration 61/36/0% (28, 14; RES 13); steps 83/0/17% (12, 7); process 60/0/10% (10, 6; ACT 8); quantity 60/13/20% (15, 10); enumeration 67/8/17% (12, 10); comparison 55/0/45% (11, 9); news 71/0/14% (7, 7); person 86/0/0% (7, 5); quote 100% (5, 3); claim/opinion/context 34/11/53% (55, 27); transition/CTA 10/5/86% (21, 14).
- Evidence: n=241, 30 clips; evidence/idea_to_footage.csv (devices, relations, offsets and example frames per idea); numbers.json build_spec.idea_to_footage.
- Confidence: medium (n under 15 for most rows)

### X08. For a demonstration or example, always sync: either the result is on screen from the cut or it appears on the word; never leave a demonstration on unrelated footage.

- Values: Demonstration units n=28 (14 clips): on-word 61%, from-cut 36%, no sync 0%. Devices: result 13, action 7, input->output 3, literal 2. Provenance (graphics inventory): the creator's own capture or hands-on 13/28 (15 counting 2 maker-or-creator units), generated samples 5, maker 3, pages 2, other 3 (e.g. clip22@543 3D model, clip24@686 printed enclosure, clip13@1077 map route -> driving video).
- Evidence: evidence/idea_to_footage.csv row demonstration/example; evidence/part1_footage_codes.csv; review sheets part1_36-37 (clip22).
- Confidence: medium

### X09. Opinion, context, transition and CTA clauses do not need synced footage: keep the current product footage running and cut on the clause start.

- Values: No sync: claim/opinion/context 53% of 55 units (27 clips), transition/CTA 86% of 21 (14 clips); generic product context (CTX) is 9/21 of the transition/CTA units and 8/55 of the claim units. Synced shares in these rows are the lowest in the table.
- Evidence: evidence/idea_to_footage.csv; e.g. clip02@1574 'never a better time to be a builder' over a maker phone demo; clip10@522 'details in the caption' over a maker chat demo.
- Confidence: medium

### X10. For steps, use the speaker's own screen recording zoomed to the UI region, with the typed text or cursor reaching the named item on the word (0 to +4 f); move between views with a fast blurred zoom of about 6 f.

- Values: Steps/instruction n=12 (7 clips): on-word 83%, median -1 f. Timed every frame: cursor reaches 'Artifacts' 0 f, 'Motion' tile +4 f (clip29@386); re-crops on 'reference' and 'videos' 0 f (clip29@647); the exact command typed as he says it (clip29@533 'use Higgsfield MCP' 0 f; clip01@1033 typed card +1 f). Zoom transition with motion blur clip29@430-436 (6 f, by eye).
- Evidence: evidence/every_frame_strips/s08_cursor_u684.jpg, s01_typed_card_u018.jpg; evidence/timed_events.csv; evidence/part1_footage_codes.csv rows u091 u685.
- Confidence: medium (2 clips carry most of the timed cursor events)

### X11. For a process, show a render or demo that performs each verb in order, each stage starting 0-3 f before its verb.

- Values: Process n=10 (6 clips): on-word 60%, action 8/10. Every-frame timing clip18@777: scan line sweeps -3 f from 'scan', scroll unrolls -1 f from 'entire', text layer revealed 0 f on 'wrapped'; clip18@894 unroll/map/flatten in step with the verbs; clip14@636 orchestration tree builds +2 f after 'orchestration'.
- Evidence: evidence/every_frame_strips/s11_render_u403.jpg; evidence/timed_events.csv rows u403 u317; review sheets part1_30, part2_16.
- Confidence: low (the timed examples are maker renders in 2 clips)

### X12. Act quantities out with footage where the source allows (a countdown hitting zero on '60 seconds', the car launching on 'zero to 60', a strip unrolling on '1.4 meters', chart bars settling on 'best'); otherwise hold the maker's chart or number page; do not build a stat card.

- Values: Quantity n=15 (10 clips): on-word 60%, median -3 f; devices action 5, result 3, chart/number 3. clip16@279 countdown 00:54 -> 00:00 by '60 seconds' (-3 f); clip25@457 launch on 'zero' (+11 f); clip18@1189 strip unrolls on 'meters' (+5); clip07@206 Elo bars settle 2 f before 'best'. Editor stat cards exist only in clip06 (4 units), with numbers that are not spoken.
- Evidence: evidence/part1_footage_codes.csv rows u357 u599 u407 u171; evidence/part2_built_overlay_codes.csv rows u128 u129 u151 u157.
- Confidence: low (few clean examples)

### X13. For a named person show that person (video or photo) from the clause start; for a quote, the quoted person speaking in the maker's film with the maker's own lower third; add no name chips.

- Values: Person n=7 (5 clips): on-word 86%, person footage 4, document/post 2. Quote n=5 (3 clips): 100% synced. Name chips added by the editor: 0 (clip23@285 shows Elon, Sam and Dario together with no labels as each name is said at +18, +30, +45). Face boxes only once (clip27@0).
- Evidence: evidence/every_frame_strips/s06_persons_u532.jpg; evidence/part1_footage_codes.csv rows u217 u223 u394 u610 u629 u635; evidence/part2_built_overlay_codes.csv u217 u221 u629.
- Confidence: low (n small)

### X14. For a list spoken item by item, re-cut to the next item's page, site or demo on each item (median 1 f before it).

- Values: Enumeration n=12 (10 clips): on-word 67%, median -1 f. clip28@541 skill sites re-cut per named skill (+2 f), clip06@804 report pages turn on each item (-1 f), clip18@1557 'the data' page on 'The data' (-3 f), clip19@187 'three ways' re-cut on 'desktop' (-1).
- Evidence: evidence/idea_to_footage.csv; evidence/part1_footage_codes.csv rows u665 u134 u410 u417.
- Confidence: low

### X15. Put the company or product logo on screen as the name is said: a maker logo sting or wordmark that starts writing on within -1..+6 f of the name, the launch film's first frame showing the name, or (rare) the caption word replaced by the full-colour logo 4 f after the onset.

- Values: Logo units: part 1 LOGO 12 (11 clips); part 2 LOGO 13 units (11 clips) plus 7 combined units (title+logo 4, caption logo 1, logo grid 1, logo wall 1). Timed maker write-ons: Gemma 0 f, '4' 0 f, Meta bloom 0 f, Meta AI -1 f, Framer +6 f (n=5, 4 clips). Caption-word logo swap: clip17@335 'Google' +4 f, hold 8 f; clip13@0 and clip24@0 coloured Google logo on the caption line at frame 0.
- Evidence: evidence/timed_events.csv rows u167 u227 u229 u353; evidence/every_frame_strips/s05_caption_logo_u374.jpg; evidence/part2_built_overlay_codes.csv device LOGO.
- Confidence: medium

### X16. Land every editor-built element 0 to +4 f after the onset of the word it names; a status colour follows its row by 3 f.

- Values: Editor events timed at every frame: n=28 in 15 units, 10 clips; offset median +1 f, p10 -5.6, p90 +4; 0..+4 f in 19/28, within 6 f in 25/28. The 3 outliers are image cards that stagger in at the clause start (-10, -42 f, clip08@898) and a card swap hidden in a glitch burst (-7, clip06@370). Chips after rows: +3 f (3/3). All timed events incl. maker and captured: n=49, median 0, p10 -3, p90 +4.
- Evidence: evidence/timed_events.csv; scripts/box_events.py; evidence/every_frame_strips/s01, s04, s09, s10.
- Confidence: medium (10 clips, onsets are ASR estimates)

### X17. Build a graphic unit as an anchor plus about 2 events: the anchor alone for about 5 f, events about 16 f apart, the last one held about 31 f before the cut.

- Values: Animated built/maker units timed at every frame (n=24): events per unit median 2.0 (1-6); anchor alone median 5.0 f (p10 1.0, p90 33.5); spacing median 16.0 f (p10 3, p90 41); hold after the last event median 31.5 f (p10 8.9, p90 58.6); unit length median 65.0 f.
- Evidence: evidence/anatomy.csv (24 units, 15 clips); evidence/timed_events.csv.
- Confidence: medium

### X18. When no footage shows an argument (who may buy what, who sits where), build a status table: dark card, monospace uppercase heading, one outlined row per item landing every 19-20 f, each row's status chip turning red or amber 3 f later, source line at the bottom.

- Values: clip27@806-891: rows land +6, +26, +45 (4-5 f after a word onset, 19-20 f apart), chips +9, +29, +48 (3 f after rows). Geometry at native res (clip27@870): ground #080912 with 4-px scanlines (~10 levels); rows x 60-1020, 150 px tall, pitch 185 px, first top 250; chips 85 px tall, right edge 969, red #e53d31 224 px wide (BLOCKED), amber #fbba22 359 px wide (LICENSE ONLY). Pops: no eased growth visible at 1/5 scale.
- Evidence: evidence/every_frame_strips/s09_info_cards_u644_u654.jpg; evidence/native_crops/info_card_complete_clip27_870.png; evidence/native_device_measures.json; evidence/timed_events.csv u644.
- Confidence: low (one clip)

### X19. For a two-sided comparison with no footage, build two flat coloured blocks that land on each side's name (+1 f), then the question line on its verb (+3 f).

- Values: clip27@1464-1541: USA block #1b43bb at 63-467 x 273-617 lands +1 f after 'America'; CHINA block #c42626 at 613-1017 x 273-617 +1 f after 'China'; 'WHO BUILDS THE MOST POWERFUL AI?' +3 f after 'builds'; blocks 404x344 px, 146 px apart with 'VS' between.
- Evidence: evidence/every_frame_strips/s09_info_cards_u644_u654.jpg; evidence/native_device_measures.json race_card_*; evidence/timed_events.csv u654.
- Confidence: low (one clip)

### X20. Highlight a quoted line only on a text source: a live browser selection dragged along the sentence starting on the key word, a static coloured box behind the line from the cut, or a 3-blink yellow box on a named row.

- Values: Selection drag (screen recording, browser blue): starts 0 f on 'refused' (clip09@198), -1 f on 'physical' (clip09@275), extends +2 f (clip09@405); about 15 px/f. Static boxes: orange #fd8100 behind the quoted words (clip23@2524, on from the cut, 4 f before 'wins'); white boxes on essay lines that change by re-crop on the clause (clip23@1318 0 f, @1370 +4 f). Blink: #fbdd4b box 305x59 px on the named council member, 3 blinks 3 f apart, +2 f after 'sits' (clip27@1021). Highlights on footage that is not text: 0.
- Evidence: evidence/every_frame_strips/s03_selection_u211_u213.jpg, s07_essay_boxes_u546.jpg; evidence/native_device_measures.json; evidence/timed_events.csv; all 9 'hl' units of the graphics inventory (6 clips) coded here.
- Confidence: low (3 clips, three renderings)

### X21. Label paired outputs with small static labels (ORIGINAL / model or version name) on from the first frame; credit user samples with a small pill.

- Values: LABEL devices 7 units (4 clips: clip08, clip13, clip17, clip20) + 6 CHIP units (3 clips): labels never animate and never land on a word (0 timed events in the label band of clip20@0-87, 88 f). Comparisons stay synced on the second item instead (X07).
- Evidence: evidence/part2_built_overlay_codes.csv devices LABEL, CHIP; review sheets part2_06, 13, 14, 17.
- Confidence: medium

### X22. To name a physical object the speaker holds, draw a white hand-drawn arrow and a serif label 3 f after the word, swap the label to the object's name on the next noun (0 f), and clear it about 8 f before the cut.

- Values: clip07@135-170: arrow + '$500' label in at +1 (3 f after '$500'), label swaps to 'MAC MINI' at +11 on 'Mac' (0 f), exits +27..+35; ink #f5f4ee. Arrow pointing at a finished object from the cut: clip24@686 ('this' +13).
- Evidence: evidence/every_frame_strips/s10_label_u168_cards_u199.jpg; evidence/timed_events.csv u168.
- Confidence: low (2 clips)

### X23. Treat the presenter circle or box as layout only: nothing in it is timed to the words.

- Values: 18 PIP/PIP-box units in 7 clips (part 2): 0 word-synced events in the circle or box; the explanation events in those units belong to the footage underneath (e.g. clip12@722 render lands 12 f before 'dithered').
- Evidence: evidence/part2_built_overlay_codes.csv devices PIP, PIPBOX, TITLE+PIPBOX; evidence/every_frame_strips/s02_pip_u065_chip_u061.jpg.
- Confidence: medium

### X24. Keep every still picture moving except editor text cards: an eased push from 1.000 to 1.070 over the whole unit (cubic-bezier 0.42,0,0.58,1) or a linear push of 1.0-1.5% per second, centred on the panel, advancing on every frame.

- Values: Still-type units (n=93, 19 clips): 78 move, 69 of them change on every frame, 9 stepped (twos/threes/fours, clip06, clip18, clip23, clip28); editor text cards static 5/6. Eased preset (4 units, 4 clips): end scale 1.0695-1.0699 over 35-73 f, fit RMS 0.008-0.016 for cubic-bezier(.42,0,.58,1) vs 0.077-0.086 linear. Linear preset (3 clips): 1.0, 1.0, 1.5 %/s, RMS 0.006-0.014. Zoom fixed point x 534-576 px (centre 540).
- Evidence: evidence/still_cadence.csv (every frame, scripts/still_cadence.py); evidence/still_pushin_native.csv and evidence/pushin_ease_fit.txt (native ORB similarity fits, scripts/pushin_rate.py, pushin_curve.py, pushin_ease_fit.py); clip22@426, clip24@160, clip15@1605, clip13@1077, clip27@408, clip21@1571, clip06@2020.
- Confidence: medium (7 fitted units; graphics G21 reports 1.47 %/s median on 38 zoom-ins by a different method)

### X25. Render the user's footage and captures untreated (cover crop, no grade, no frame); give own screen recordings a recorder look: zoomed crops on the active region, an enlarged cursor, fast motion-blurred zooms between views.

- Values: No grade, frame or other treatment was noted on any of the 241 footage units (by eye; colour not measured here, see the colour analyst). Own captures with auto-zoom crops and a large cursor: clip29@386-532 and @647-720 (blurred zoom ~6 f), clip05, clip19, clip22 captures. The only stylised treatment is clip06's glitch flicker on its report cards and charts (bursts of 2-3 flashes 2 f apart about every 30 f), 1 clip.
- Evidence: evidence/every_frame_strips/s08_cursor_u684.jpg; evidence/part2_built_overlay_codes.csv u129 u148 u151 u153 u157 (glitch); evidence/still_cadence.csv clip06 rows.
- Confidence: low (recorder look read by eye; whether it is a recorder or the editor cannot be told)

### X26. Never draw a metaphor or an explainer diagram in the editor, never count numbers up, never ease or spring an editor element in: editor elements pop, type on or blink.

- Values: Part 2 (117 units, 27 clips): literal 78, logo 15, layout device 11, diagram 8 (all maker assets, captured pages or source samples), metaphor 2 (maker/source). Parametric 57, maker asset 47, captured/source 13. Editor-built units 12 (6 clips): typed card, quote card, CTA card, 4 stat/list cards, image cards, 3 info cards, typed list. Count-ups 0, progress bars 0, name chips 0, eased editor entrances 0 seen at 1/5-scale every-frame strips.
- Evidence: evidence/part2_built_overlay_codes.csv (lit_met_diag, param_bespoke, motion_in_picture); evidence/every_frame_strips/.
- Confidence: medium (motion easing at 1/5 scale only)

## Constant and variable

CONSTANT: cuts on clause starts (64% vs chance 16.5%, every clip); footage is literal/action/result/person/logo in 89% of units; demonstrations always synced; editor elements land 0..+4 f after their word and pop/type/blink; stills move on every frame except editor text cards; no editor metaphors or diagrams. VARIABLE: share of synced units by idea kind (thing named 79% ... transition/CTA 10%), driven by clause kind; device mix by product type (generative tools -> results and montage; agents/software -> action in progress and own capture; launches -> logo and live event; stories -> person, place stock, documents); built cards only in 6 clips (clip01 typed cards, clip06 glitchy stat cards, clip08 image cards, clip27 info cards, clip28 typed list, clip04 CTA card); push preset eased-1.07 (4 clips) vs linear 1-1.5%/s (3 clips); highlight rendering (live selection clip09, static box clip23, blink clip27).

## Open questions

- Whether in-shot events are chosen by trimming or appear by chance in busy footage: the code check is 51% vs 38% chance within 6 f. Matching units to the original maker films would decide.
- Key words and devices are one coder's reading; a second coder on 40 rows of evidence/part1_footage_codes.csv would give agreement.
- Word onsets are ASR estimates, not forced-aligned; a constant ASR lead or lag of 2-4 f would shift every offset here. Forced alignment on 3 clips would decide.
- Only 30 of 117 part-2 units have events timed to the frame; the other 87 were read from per-word frame sheets.
- Whether the eased 1.07 push and the linear push are two editor presets or come from the sources (maker pages recorded with zoom).

## For a person to check

- Watch clip27@806-891 and @1464-1541 in playback: confirm rows, chips and blocks pop with no ease and listen for a sound on each landing (evidence/every_frame_strips/s09_info_cards_u644_u654.jpg).
- Watch clip09@156-315: confirm the blue selection is a live screen recording, not an editor wipe (evidence/every_frame_strips/s03_selection_u211_u213.jpg).
- Listen to 10 cuts in evidence/cut_landing.csv (e.g. clip02@433, clip16@279, clip30@719): is the cut on the first syllable of the clause as the ASR says?
- Spot-check 30 rows of evidence/part1_footage_codes.csv against evidence/review_sheets/part1_*.jpg, especially device ACT vs CTX and the key word.
- Look at clip22@426 and clip24@160 in playback to confirm the eased 1.07 push reads as one smooth move.
- What was not done: no audio was heard; no playback was watched; part-1 units were read from one frame per spoken word plus the every-frame motion trace, not by looking at every frame; colours of the selection highlight and the white essay boxes were not sampled precisely.
