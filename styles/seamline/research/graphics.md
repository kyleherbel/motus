# Graphics: the footage and what decides it

Measured on the 30 in-style clips of the reference corpus (neutral ids clip01 to clip30, by publication date, 2026-03 to 2026-11). Evidence ids are `clipNN@frame` at the clip's own rate (23.976 or 24 fps); evidence files stay in the private study folder and are not part of this repository. Confidence is the analyst's.

## Summary

Measured on all 30 in-style clips (2,197.6 s). Every frame was decoded (BT.709 limited->full) into thumbnails; machine cut candidates in the top, bottom and full frame split the clips into 2,025 segments, and the mid keyframe (432x768) of every segment was read by eye and grouped into 709 visual units (a run with one layout and one source): clip, first/last frame, layout, kind, source, overlays (evidence/units.csv, evidence/unit_labels.txt). Framing was measured on 1,798 footage segments, in-panel movement on 960 (ORB similarity fit, first vs last keyframe), the presenter circle on 15 native frames, and 1,262 spoken clauses were hand-coded into 14 categories and joined to the unit on screen (evidence/clauses_coded.csv, evidence/decision_table.csv).

The top panel is real footage of the product being talked about: 84% of footage runtime (median clip 94%; 12/30 clips 100%), mostly the maker's own material (maker demo 17.3% of all runtime, maker launch film 8.4%, live event 4.4%, maker pages 4.3%), then the creator's own screen captures and outputs (19% of footage runtime) and third-party generated samples. Editor-built graphics are rare (1.9% of footage runtime, 12 units in 5 clips), and so are overlays on footage (chips 12 units, labels 10, text highlights 9, arrows 4). Footage fills the panel edge to edge (cover crop, seam at y=960, no card, radius, stroke or shadow in split mode). Full-frame footage is 14.5% of runtime, presenter face cut-ins 16.8% (198 units, median 1.34 s), presenter circle over full-frame footage 3.8%, two stacked footage panels 3.2%. Density: median 14.7 footage units per minute, presenter visible 82% of the time. 67% of unit starts fall within 6 frames of a clause onset (chance 30%).

The clause table gives the choice rules: feature clauses get maker demos (37%) or the creator's capture (20%); example/result clauses go full frame 43% of the time (base 17%) with generated outputs, hands-on and captures; instructions get the creator's screen capture (38%); news events open on the maker film (32%) with a new unit at the onset 55% of the time; named persons get footage or photos of that person (55%); opinions, transitions and sign-offs cut to the full-frame face (30-35%, base 19%); numbers rarely get a graphic (chart/stat 11%). Over time the presenter circle mode almost vanished (18 units in clip01-15, 3 in clip16-30) while stacked panels (3 -> 13 units) and full-frame footage (11.3% -> 17.7%) grew.

## Rules

### G01. Fill the top panel with real footage of the product the speaker names; plan about 84% of footage time on the product itself and the rest on context (people, press, posts, stock).

- Values: Product footage = 84.1% of footage runtime (1,827 s); per clip median 94.2%, p10 75.9%, 12/30 clips 100%, 2 news-story clips 0% (clip23, clip27). Origin of footage runtime: maker 56.9%, creator's own capture/output 19.4%, third-party 15.9%, press 2.3%, editor-built 1.9%, stock 1.4%, social 1.3%, film 1.0%.
- Evidence: n=30 clips, 511 footage units; evidence/units.csv, evidence/source_roles.txt (role per source, by eye), evidence/kind_exemplars/kinds_1..4.jpg; numbers.json footage_role_share_of_footage_runtime.
- Confidence: high

### G02. Use these visual-unit kinds, in this order of runtime: maker product demo, full-frame face, generated samples, own screen capture, maker launch film, live event, web page, person video; everything else is under 2% each.

- Values: Runtime share (units, clips): product_demo 17.3% (88, 15), face 16.8% (198, 27), gen_sample 13.3% (88, 11), screen_capture 9.9% (61, 11), launch_film 8.4% (60, 16), live_event 4.4% (19, 3), web_page 4.3% (23, 11), person_video 3.1% (19, 4), report_handson 3.0% (15, 1), device_handson 1.8%, social_post 1.7%, person_photo 1.7%, broll 1.7%, chart 1.3%, screen_filmed 1.2%, render_viz 1.1%, doc_page 1.1%, news_page 1.1%, logo 0.9%, text_card 0.9%, others < 0.9%.
- Evidence: n=709 units, 30 clips; numbers.json kinds; evidence/kind_exemplars/kinds_1.jpg (product_demo clip10@924, launch_film clip21@678, gen_sample clip20@1197, screen_capture clip22@960).
- Confidence: high

### G03. Fetch about five sources per video: one source carries about half of the footage time; the maker's film/demo is the first asset to fetch whenever a product exists.

- Values: Distinct sources per clip median 5 (p10 2, p90 10, range 1-12); largest source share of footage runtime median 56% (p10 30%, p90 90%). 27/28 product clips use the maker's own material of the product (film, demo, page or live stream); the exception is clip05 (creator captures and third-party samples only).
- Evidence: n=30 clips; numbers.json per_clip.distinct_sources/top_source_share; e.g. clip02 one source (stitch demo 100%), clip23 12 sources.
- Confidence: medium (source identity read by eye from keyframes; two cuts of one maker film may have been labelled as one source)

### G04. In the split layout, scale footage to cover the 1080x960 top panel (centre crop) with no border, radius, stroke, shadow or editor letterbox.

- Values: Seam row of 364 split units: median y=960 (5 px bins), 945-975 in 277/364 (76%), p10 876, p90 1003. Content box of 1,270 split-segment mid frames: full-bleed 811 (64%); the rest have uniform bands that belong to the source (median band luma 24-33 for dark UIs and demos, 244 for white web pages), not an added frame. No rounded card or drop shadow seen around split-mode footage.
- Evidence: n=30 clips; evidence/framing.csv, evidence/units.csv seam_y; numbers.json framing_segments; native frames e.g. clip27@432 (article page fills panel), clip09@328 (benchmark page).
- Confidence: high for full-bleed cover; medium for 'bands are from the source' (judged by eye on ~40 frames)

### G05. For a vertical source or a two-clip pair, lower the seam to y~1205-1260 and give the footage the taller panel.

- Values: 7 units in 7 clips (24.3 s) with seam 1205-1260; content: two stacked samples (clip08@1454, clip17@319, clip20@1723), vertical UI (clip03@1374, clip16@279), tall demo (clip01@777, clip13@570).
- Evidence: evidence/unit_labels.txt tag 'tallpanel'; evidence/units.csv seam_y.
- Confidence: low (7 units, the layout analyst owns the exact geometry)

### G06. Cut new footage on the clause onset: start each new visual unit on the first frame of a clause.

- Values: Of 679 unit starts, 66.7% lie within +-6 frames of a clause onset (chance with the same onsets 29.9%); offsets within +-24 f: median 0 f, p10 -6.9 f, p90 +10 f (n=612). Clause onsets are faster-whisper estimates.
- Evidence: n=30 clips, 1,262 clauses; numbers.json unit_start_vs_clause_onset; evidence/clauses_coded.csv nearest_unit_start_offset_f.
- Confidence: medium (ASR timings are not forced-aligned)

### G07. Feature clauses (what it does, how it works) get the maker's demo or the speaker's own screen capture, in the split layout; almost never the face.

- Values: n=201 feature clauses, 25 clips: maker demo 36.8%, own screen capture 20.4%, generated sample 12.9%, maker film 6.5%, face 6.5% (base 19.3%); product footage 89.6%; split 64.7%, full frame 14.4%, stacked 8.5%.
- Evidence: evidence/decision_table.csv row feature; examples clip01@137, clip02@1574, clip07@788.
- Confidence: high

### G08. Example/result clauses ('here is what I got', 'take a look') go full frame much more often: show the output itself (generated sample, hands-on with the thing, the speaker's capture).

- Values: n=99 example clauses, 20 clips: layout F 38.4% + FP 5.1% = 43.5% (base over all clauses 17.1%); generated sample 23.2%, hands-on 17.2%, own screen capture 16.2%, maker demo 9.1%, face 8.1%.
- Evidence: evidence/decision_table.csv row example_result; clip01@445 (own capture full frame), clip08@848, clip13@693, clip24@414-708 (own hands-on, full frame).
- Confidence: high

### G09. Instruction/step clauses get the speaker's own screen recording of the step (or the face when no capture exists); a built card only for a prompt or file the viewer should copy.

- Values: n=74 instruction clauses but only 6 clips (clip01, 04, 05, 21, 28, 29): own screen capture 37.8%, face 21.6%, generated sample 12.2%, maker demo 10.8%, built card 6.8% (clip01 skill.md card and prompt card), web page 5.4%.
- Evidence: evidence/decision_table.csv row instruction; clip01@938-1450, clip04@1016, clip29@386-720 (cursor through Claude UI, full frame).
- Confidence: medium (6 tutorial clips)

### G10. When a product is first named, cut to a new unit on that clause and show the product working (own capture, maker demo) or the face; a bare logo is rare.

- Values: n=64 product-name clauses, 22 clips: new unit within 6 f of onset 56.2% (all clauses 30-55%); own capture 25.0%, maker demo 20.3%, face 17.2%, generated sample 10.9%, maker film 10.9%, logo 6.2%.
- Evidence: evidence/decision_table.csv row product_name; clip01@0, clip04@132, clip08@439.
- Confidence: medium

### G11. News-event clauses ('X just launched/announced') open on the maker's launch film or demo; use the press page or a person clip as the second choice.

- Values: n=31 news-event clauses, 17 clips: maker film 32.3%, maker demo 19.4%, press page 9.7%, person footage 9.7%, social video 9.7%; split 77.4%; new unit at onset 54.8%. First unit of the video is footage in 27/30 clips (launch film 7, generated sample 5, product demo 4, person 3, live event 2, other 6), face in 3.
- Evidence: evidence/decision_table.csv row news_event; numbers.json first_unit_counts; clip09@0, clip15@0-99, clip21@0, clip30@0.
- Confidence: medium

### G12. Named-person clauses get footage or a photo of that person (interview, keynote, event photo), or their post.

- Values: n=31 person clauses, 7 clips: person video/photo 54.8%, social post 12.9%, maker film 9.7%, face 6.5%, stock 6.5%; context footage 80.6%. Person kinds hold median 2.75 s (video, n=19) and 3.15 s (photo, n=10).
- Evidence: evidence/decision_table.csv row person; clip10@1447 (Zuckerberg clip), clip15@1716 (Apple execs), clip23@1282, clip27@193 (photos).
- Confidence: medium (7 clips)

### G13. Do not build a stat card for every number: keep the product footage under it; use a chart only when the maker published one (benchmarks).

- Values: n=56 number clauses, 25 clips: face 16.1%, generated sample 16.1%, maker film 14.3%, maker demo 10.7%, chart/stat 10.7%, web page 7.1%; new unit at onset only 25.0% (lowest of all codes). Charts: 9 units in 6 clips, all maker benchmark pages/tables, hold median 2.67 s.
- Evidence: evidence/decision_table.csv row number; chart units clip07@293, clip09@314, clip10@403, clip21@1571, clip24@160.
- Confidence: medium

### G14. Opinion, transition and sign-off clauses are where the full-frame face goes; otherwise keep footage running under them.

- Values: Face share: cta/sign-off 34.7% (n=101), transition 33.1% (n=124), opinion 29.7% (n=185), context 23.5% (n=196) vs 6.5-8.6% for feature/example/comparison; base 19.3%. Last unit is the face in 13/30 clips.
- Evidence: evidence/decision_table.csv; numbers.json last_unit_counts; clip27@1720-1774, clip15@1308-1388.
- Confidence: high

### G15. Comparison clauses stay in the split layout with the two things shown as footage (samples, demos), occasionally a maker chart or stacked panels.

- Values: n=58 comparison clauses, 21 clips: split 79.3%; generated sample 22.4%, maker demo 20.7%, maker film 15.5%, face 8.6%, chart/stat 8.6%, film clip 5.2%.
- Evidence: evidence/decision_table.csv row comparison; clip03@457 (same prompt across models), clip08@1099-1167 (three models stacked with labels).
- Confidence: medium

### G16. Quoted statements play over the quoted speaker in the maker film (with its own lower third) or over the document being quoted.

- Values: n=17 source/quote clauses, 5 clips: maker film 52.9%, document 23.5%, press page 11.8%; full frame 35.3%.
- Evidence: evidence/decision_table.csv row source_quote; clip09@516-626 and clip09@1031-1128 (maker film, lower third, full frame).
- Confidence: low (5 clips)

### G17. Hold each visual unit for about 3 s in split mode; face cut-ins are short.

- Values: Unit hold (s) median/p10/p90: split 3.05/1.17/6.89 (n=364); face 1.34/0.67/3.78 (n=198); full-frame footage 2.25/0.78/6.18 (n=108); circle-PIP 3.46/2.10/5.61 (n=22); stacked 4.07/1.98/7.38 (n=16). By kind: product_demo 3.42/1.40/7.76, gen_sample 2.96/1.00/6.27, screen_capture 2.79/1.29/7.17, launch_film 2.38/0.95/6.14, web_page 2.63/1.67/9.76, news_page 2.09/1.61/4.03, logo 1.79/1.01/3.09. Inside units the source keeps its own cuts (machine candidates median 0.63 s, noisy).
- Evidence: n=709 units; numbers.json layout_unit_seconds, kinds.*.hold_seconds; build_spec.hold_seconds_by_kind_median_p10_p90.
- Confidence: high for unit holds; low for intra-unit cut lengths

### G18. Aim for about 15 footage units per minute and keep the presenter on screen about 80% of the time.

- Values: Footage units per minute per clip: median 14.7, p10 8.6, p90 19.4, range 6.8 (clip25) - 25.4 (clip24). Presenter visible (split, face, PIP): median 82.1%, p10 60.4%, range 49.6-100%. Full-frame face: median 13.8% per clip (0-36.6%; 3 clips never). Layout runtime: split 61.7%, face 16.8%, full-frame footage 14.5%, circle-PIP 3.8%, stacked 3.2%.
- Evidence: n=30 clips; numbers.json density, per_clip, layout_runtime_share.
- Confidence: high

### G19. Over full-frame footage, the presenter can sit in a circle about 416 px wide in the upper right, partly off the right edge.

- Values: 22 units, 9 clips, 3.8% of runtime. Diameter median 416 px (344-445, n=16 frames, 6 clips; clip03 411-421, clip08 344-355, clip11 392, clip12 421-445, clip22 445, clip30 441). Positions: top right 9 (centres x 794-936, y 327-495), right middle 3 (y 891-1031), bottom right 1, left side 3; right overflow up to 66 px (cx + r - 1080). No stroke seen. Variant: presenter in a rounded rectangle at the bottom (clip11, clip12; 4 units).
- Evidence: evidence/pip_circle_detections.jpg (Hough fits; 16 of 20 judged correct by eye); scripts/pipcircle.py; clip03@171, clip08@1229, clip11@901, clip12@546.
- Confidence: medium (Hough on 15 frames; the presenter analyst should confirm the edge)

### G20. Two footage clips stacked (top and bottom halves, presenter hidden) for paired material: before/after, chat plus output, two angles of one event.

- Values: 16 units, 11 clips, 3.2% runtime, hold median 4.07 s (1.98-7.38); 3 units in clip01-15, 13 in clip16-30.
- Evidence: evidence/units.csv layout D; clip25@174-307 (two angles of the Roadster event), clip19@518-689 (chat over output), clip29@930-1017 (prompt over motion output).
- Confidence: medium

### G21. Push in slowly on still sources (photos, article pages, posts, charts, cards): about +1.5% scale per second, about 1.03x over the unit; never on live footage as an editor move you can separate from the source.

- Values: Still-type segments with a fit: 86; zoom-in 38 (44%), static 31, zoom-out 6, pan 11. Zoom-in rate median 1.47 %/s (p10 0.93, p90 6.03), total scale median 1.027 (p10 1.013, p90 1.071). clip27 news pages: 1.41-1.50 %/s on all 9 (constant). Screen captures: static in 64% of fitted segments.
- Evidence: evidence/inpanel_motion.csv; numbers.json still_pushin; clip27@408-457, clip27@1105-1150, clip06@2056-2095, clip10@316-370.
- Confidence: medium (first vs last frame only; easing not measured, hand to the motion analyst)

### G22. Show press pages and posts as a full-width crop of the page: the headline or post body fills the panel width, white or dark page ground to the panel edges, with a slow push-in.

- Values: news_page 9 units (3 clips), all split, hold median 2.09 s; social_post 13 units (4 clips), split 69%, full frame 23%. Example: clip27@432 white article page fills 1080x974 (page white decodes RGB 252.1); headline about 0.9 of panel width (read by eye).
- Evidence: evidence/framing.csv; native frames clip27@432, clip23@405 (X post cropped to the body), evidence/kind_exemplars/kinds_3.jpg.
- Confidence: medium

### G23. Highlight the quoted phrase in a captured article, essay or post with a solid highlight box on the words; use it only on text sources.

- Values: 9 units in 6 clips (29.3 s): clip01@1033 (blue selection), clip07@0 (headline highlight), clip09@156-451 (NYT and Anthropic page, blue selection boxes), clip23@1122-1460 (white boxes on essay lines), clip23@2524 (orange box on a post line), clip28@469 (X profile). Colours and geometry not measured.
- Evidence: evidence/unit_labels.txt tag 'hl'; evidence/units.csv.
- Confidence: low (geometry and timing not measured; by eye)

### G24. Keep overlays on footage rare: small credit chips, model-name labels and arrows only where the source needs naming; no progress bars, no device mockups, no source captions.

- Values: Units carrying each overlay (of 709): title 91 (30 clips, owned by the hook/type analysts), logo/wordmark 13 (11), chip 12 (8), label 10 (4), text highlight 9 (6), card over presenter 8 (7: card 4, newscard 2, pipcard 1, statcard 1), arrow 4 (4), typed text 2 (1), added cursor 2 (1), face boxes 1, circle mask 1, glitch 1. Never seen: progress bars, phone/device frames drawn around split footage, URL/source captions.
- Evidence: numbers.json overlay_tags with examples; evidence/unit_labels.txt; chips clip13@146-390 (credit pills), labels clip08@1099-1167 (KLING 3.0 / VEO 3.1), arrow clip24@686-708.
- Confidence: medium (overlays read on one keyframe per segment; short overlays could be missed)

### G25. A news card can sit over the presenter's half: white rounded card with outlet logo and headline, presenter blurred behind it.

- Values: 2 newscard units (clip08@261-364, clip17@853-918) + 1 post card over the face (clip23@707-814) + 4 footage cards over a full-frame face (clip12@466, clip13@730, clip24@998, clip29@1018). clip08@262 card: x 461-1046, y 1283-1564 (585x281 px), right margin 34 px.
- Evidence: scripts/cardbox.py on native clip08@262; evidence/unit_labels.txt tags newscard/card/pipcard.
- Confidence: low (7 units, one card measured)

### G26. Build an editor card only for an argument no footage shows (what a country may buy, who sits on a council) or a file the viewer should copy: dark ground, monospace uppercase heading, red status chips, source line at the bottom.

- Values: Editor-built units: text_card 6 (3 clips, hold median 3.38 s), stat_card 3 (1 clip), list_card 1, cta_card 1, image_cards 1; 1.9% of footage runtime. Example clip27@806-891: heading 'WHAT CHINA CAN BUY', two rows with red BLOCKED chips, source line (read by eye).
- Evidence: evidence/kind_exemplars/kinds_3.jpg, kinds_4.jpg; native frame clip27@848 (inside clip27@806-891).
- Confidence: low (12 units in 5 clips)

### G27. For story videos with no product (news, policy, a person), build the top panel from photos and clips of the people, their posts, news pages, stock b-roll and one or two built info cards.

- Values: clip23 (154.9 s): 26 footage units from 12 sources: person video 48%, person photo 10%, posts 21%, documents 16% of its footage time; clip27 (74.0 s): 22 footage units, person photos 21 s, news pages 17 s, built info card 10 s, stock 18 s. Product footage 0% in both.
- Evidence: numbers.json per_clip clip23, clip27; evidence/units.csv.
- Confidence: low (2 clips)

### G28. Change over time: prefer stacked panels and full-frame footage over the presenter circle for recent-style edits.

- Values: clip01-15 (2026-03-11 to 06-08, 1,097 s) vs clip16-30 (2026-06-24 to 11-15, 1,100 s): circle/box PIP units 18 -> 3, FP runtime 6.6% -> 1.0%; stacked units 3 -> 13, D runtime 0.7% -> 5.6%; full-frame footage 11.3% -> 17.7%; split 64.6% -> 58.8%; face unchanged 16.8%; product footage share 91.3% -> 76.9% (two story clips in the second half).
- Evidence: numbers.json over_time.
- Confidence: medium

## Constant and variable

CONSTANT: real footage in the top panel in every clip (30/30) and every split unit; cover-crop to the panel with no frame, radius, stroke or shadow in split mode; seam near y=960 (76% of split units 945-975); face cut-ins in 27/30 clips; product footage from the maker or the creator for every product clip; overlays on footage are rare. VARIABLE: which kinds dominate depends on the product type (generative video tools -> samples and maker promos; software/agents -> maker demo and own capture; hardware/launch events -> live stream and launch film; story/news -> person media, posts, press pages); density 6.8-25.4 units/min; presenter visible 50-100%; full-frame face 0-37%; optional modes (circle PIP 9 clips, stacked panels 11 clips, tall panel 7 clips, editor cards 5 clips); push-in on stills present in some clips (clip06, clip10, clip27) and absent in others; generation change mid-2026 (PIP out, stacked panels and full-frame footage up).

## Open questions

- Whether in-panel zooms and pans on screen captures and demos are added by the editor or are already in the source (screen-recorder auto-zoom, maker film camera moves): comparing with the original maker videos would decide it.
- Exact unit boundaries inside long single-source runs: units merge machine segments; cut candidates inside units (median 0.63 s) include animation and scrolling, so the true source-cut cadence is not measured.
- How much of each maker film is used and from where (first seconds vs hero shots): requires matching each unit to the original film timeline.
- Highlight-box colour, padding and animation (G23) and the chip/label geometry (G24) were not measured at native resolution.
- Clause codes are one person's reading of ASR text; a second coder on a sample would give an agreement figure.

## For a person to check

- Watch three clips in playback (clip08, clip19, clip27) against evidence/units.csv to confirm that unit boundaries and layouts (S/F/FP/D/P) match what a viewer sees.
- Check evidence/pip_circle_detections.jpg: the 4 wrong fits (clip03_567, clip06_2265, clip12_526, clip19_1010) and whether the circle has a stroke or soft edge.
- Listen: whether the news-event clause onsets really coincide with the cut to the maker film (G06, G11), since timings are ASR estimates.
- Spot-check 50 rows of evidence/clauses_coded.csv (column code) for coding errors, especially context vs opinion vs feature.
- Confirm by eye that the uniform bands in split-mode footage are part of the source and not an added frame (evidence/framing.csv rows with content_t > 10 or content_b < panel_bottom - 15).
