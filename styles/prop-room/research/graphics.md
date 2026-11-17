# Graphics

Measured: All 19 clips (20,891 frames as counted by this study, 697.1 s at 29.97 fps). Every frame was decoded at 270x480 through an explicit BT.709 limited-to-full conversion; cuts were found as one-frame spikes on every frame, separately in the panel band (y 0-839) and the lower band (y 1080-1919); layout came from Apple Vision face boxes on every frame plus a presenter-band check. Every first-pass unit was viewed on review sheets (a tile about every 24 frames, every frame for units under 7 frames), described, and merged by hand where a spike was a flash, stamp, scan wipe, focus pull or footage cut inside one composition. Result: 279 graphic units plus 19 closing-keyword units, and 365 spoken clauses coded by hand into 12 categories and linked to the graphic on screen. Component geometry (cards, windows, traffic lights, shadow) was measured on full-resolution calibrated frames for a sample of instances; pointer size was read by eye. A graphic is on screen 87 % of the runtime, a new unit starts about every 2 s, and interface pieces are 43 % of units.

Not done: Plate colours, gradients and grain (colour study); caption position and type (type and layout studies); easing and timing inside units (motion study); event-by-event act-out timing (explanation pass); any audio. Prop bounding boxes were not measured for 70 of 279 units whose background is a photo, texture or edge-to-edge graphic. Family, build class and clause category are judgements by one reader, recorded per unit and per clause so they can be re-coded. Nothing was listened to or watched as playback.

Evidence is cited as `clipNN@frame` (frames at 29.97 fps, counted from 0; ids are this style's own). File names in Evidence lines name files of the local study; they are not shipped. "Verified" lines give the independent verifier's verdict and final value; item numbers refer to [verification.md](verification.md).

## Rules

### [G01] Keep a graphic on screen for about 87 % of the runtime; the presenter is alone only in short mid-clip breaks and in the closing.

- Values: Pooled share of frames: graphic 86.95 % (panel 36.54 %, full-frame 50.41 %), presenter alone 7.41 %, closing keyword over presenter 5.64 %. Per clip graphic share median 0.88, p10 0.82, p90 0.91, range 0.81-0.92.
- Evidence: n=19 clips, 20,891 frames, every frame; G_final_layout_per_frame.json, G_timeline_families.png, G_inventory.csv
- Confidence: high

### [G02] Split graphic time roughly 4:3 between full-frame inserts and the panel above the presenter.

- Values: Full-frame share of runtime per clip median 0.51 (range 0.42-0.56); panel share median 0.37. Units: 146 full-frame, 133 panel. Full-frame layout runs median 84 frames (p10 41, p90 139), panel runs median 58 frames (p10 33, p90 92).
- Evidence: n=19 clips; G_final_layout_per_frame.json; numbers.json runtime_share_per_clip, layout_runs_frames
- Confidence: high

### [G03] Change the graphic about every 2 seconds: one new unit every 61-62 frames, 24 units per minute.

- Values: 279 graphic units; per clip median 15 (range 11-22); per minute median 24.1 (range 18.0-33.2). Frames between consecutive unit starts median 61.5 (2.05 s), p10 29, p90 114, min 8, max 195 (n=260 gaps).
- Evidence: n=19 clips; G_inventory.csv, G_inventory_build.csv
- Confidence: high
- Verified, confirmed (item 17): layout changes every 62 frames (p10 29, p90 114, n=277); picture changes (layout changes plus 51 scene cuts) every 53.5 frames.

### [G04] Hold each graphic unit for 29-102 frames (median 61, 2.0 s); full-frame units run slightly longer than panel units, photos and text cards shorter.

- Values: All units median 61 frames, p10 29, p90 102, min 8, max 195. Panel median 54 (p10 28, p90 89); full-frame median 65 (p10 34, p90 115). By family median frames: figure 67, illustration 66, interface 62, logo_or_mark 51.5, text_card 50, photo 44.
- Evidence: n=279 units in 19 clips; G_inventory_build.csv (frames, seconds_at_29.97)
- Confidence: high

### [G05] Alternate layout at each graphic change: panel unit, then full-frame unit, then panel, cutting directly from one to the other.

- Values: Of 260 unit-to-unit transitions: 194 (74.6 %) alternate layout with no gap (panel->full-frame 103, full-frame->panel 91); 34 (13.1 %) keep the same layout back to back (full->full 25, panel->panel 9); 32 (12.3 %) have a presenter-only run between them. All layout changes are hard cuts in the every-frame cut pass; no animated reflow between panel and full-frame was seen.
- Evidence: n=19 clips; numbers.json unit_pairs, layout_transitions; G_timeline_families.png (half bars = panel, full bars = full-frame)
- Confidence: high

### [G06] Open every video on a panel unit at frame 0 (no title card) and cut to a full-frame unit after 37-80 frames.

- Values: First unit is a panel unit starting at frame 0 in 19/19 clips; its length median 53 frames (range 37-80). Second unit is full-frame in 18/19 (clip02 keeps the panel through three app cuts). The panel's first visible change is at frame 1-2 in 10/19 clips, frame 4-7 in 4, and after frame 11 in 5 (share of 20x20 px blocks changing >25 levels above 0.02). Opening unit families: interface 8, illustration 6, figure 2, photo 2, logo_or_mark 1.
- Evidence: n=19; numbers.json opening; e.g. clip01@0-50, clip05@0-75, clip19@0-67; G_review_sheets/rv_<clip>_0.png
- Confidence: high

### [G07] End with no graphic: after the last unit, show the presenter alone for 66-138 frames, cut in the comment keyword about 34 frames later and hold it to the last frame.

- Values: Presenter-alone closing run median 92 frames (3.07 s), range 66-138. Last graphic end to keyword onset median 34 frames, range 10-70. Keyword holds median 58 frames (1.94 s), range 46-126, to the final frame. The keyword is complete on its first frame in 19/19 clips (one-frame rise of the white-pixel signal 0.11-0.21; clip19 read by eye: f1137 none, f1138 full word).
- Evidence: n=19, every frame; G_closing_keyword_onsets.json, G_closing_keyword_clip19_onset_strip.png; inventory rows with component_type closing_keyword
- Confidence: high

### [G08] Break the graphics with 0-3 short presenter-only shots mid-clip (median 2, about 1 s each) and draw nothing over the presenter except the caption.

- Values: 32 mid-clip presenter-only runs in 18/19 clips (clip15 has none); per clip median 2, range 0-3; length median 27.5 frames (0.92 s), range 12-51. They often fall on short connective clauses ('For example,' clip04@368, 'Second,' clip07@366, 'Third,' clip07@588, a 'best part' pivot clip16@863). No graphic, sticker, arrow or lower third over the presenter in any of them (by eye on the review sheets).
- Evidence: n=19; numbers.json midclip_presenter_runs (list of all 32 ranges, e.g. clip04@368-387, clip16@863-893); G_review_sheets
- Confidence: high

### [G09] Mix families at about 43 % interface, 19 % figure, 18 % illustration, 9 % photo/footage, 6 % mark, 5 % text card (by unit count).

- Values: Units / share of graphic time: interface 120 / 44.1 %, figure 54 / 22.3 %, illustration 50 / 18.5 %, photo 25 / 7.0 %, logo_or_mark 16 / 4.6 %, text_card 13 / 3.4 %, other 1 / 0.1 %. Clips using each: interface 19, figure 16, illustration 14, logo_or_mark 11, text_card 8, photo 4. Families appear in both layouts (interface 58 panel / 62 full; figure 20/34; illustration 23/27; logo_or_mark 11/5).
- Evidence: n=279 units, 19 clips; G_inventory.csv family column; numbers.json families
- Confidence: medium (family assigned by eye from review sheets; mixed units were filed under their dominant element)

### [G10] Plan for 57 % of graphic time to be drawable from text and numbers, 27 % to be captured screens or footage the user supplies, 16 % bespoke rendered art.

- Values: Units: drawable 158, capture 78, bespoke_art 43. Time share: 0.571 / 0.269 / 0.160. Per clip median drawable 9 (3-15), capture 2 (0-16), bespoke 1 (0-12). Bespoke is concentrated in illustrations (33 of 50); captures in interface (48) and photo (24); figures are drawable in 50 of 54.
- Evidence: n=279; G_inventory_build.csv (build_class, drawable_from_parameters); numbers.json build
- Confidence: medium (classification by eye; 'capture' includes generated AI footage and website screenshots the editor clearly did not draw)

### [G11] Start a new graphic on the clause that carries a name, a number, the hook, a proof, a benefit or a step; features and comparisons may continue the current graphic; the call to action gets none.

- Values: Share of clauses with a unit starting between 6 frames before the clause onset and its end: name 0.96 (n=23), number 0.93 (14), hook 0.90 (30), proof 0.86 (7), benefit 0.84 (31), step 0.83 (41), claim 0.70 (10), problem 0.65 (17), list_item 0.60 (5), feature 0.60 (126), comparison 0.56 (16), cta 0.42 (45; 39 of 45 CTA clauses start over the presenter or the keyword).
- Evidence: n=365 clauses coded by hand; G_clause_graphic_table.csv, G_clauses.json
- Confidence: medium (clause boundaries from an unaligned machine transcript; categories coded by one reader)

### [G12] Choose the family from the clause: name -> mark or wordmark reveal; number -> figure; step -> interface; problem -> metaphor illustration; feature -> interface (else figure or illustration).

- Values: Family of the unit each clause triggers: name 22 -> logo_or_mark 10, text_card 5, interface 4, illustration 2, photo 1; number 13 -> figure 10, illustration 2, photo 1; step 34 -> interface 27, figure 4, illustration 2, photo 1; problem 11 -> illustration 6, interface 3, figure 2; feature 75 -> interface 41, figure 12, illustration 10, photo 7; benefit 26 -> interface 13, figure 6, illustration 4; hook 27 -> interface 12, illustration 9 (21 of 27 in the panel). Features go full-frame 47 of 75.
- Evidence: n=365 clauses, 253 triggered units; G_clause_to_graphic_crosstab.csv
- Confidence: medium (one coder; small n for proof, claim, list_item)

### [G13] Cut each new unit on a word onset: 0 frames median, within 3 frames for 84 % of cuts.

- Values: Unit start minus nearest word onset: median 0.0 frames, p10 -2.5, p90 +2.9, range -6.4 to +5.7 (n=260 unit starts after frame 0). Clause onset to the unit it triggers: median 0 frames, p10 -2, p90 +11.
- Evidence: n=19 clips; numbers.json sync; transcripts are faster-whisper word times (about +-2 frames, unverified)
- Confidence: medium (word times are not forced-aligned)
- Verified, confirmed (item 17): 82.6 % of picture changes fall within +-3 frames of a transcript word onset against 61.6 % of random frames, because words are dense; the firmer anchor is the caption-group onset: 259 of 277 layout changes (93.5 %) start exactly on one, 266 (96 %) within +-1 frame.

### [G14] Give the product or tool name its own unit that reveals the mark or wordmark on the name, starting 1 frame before the clause, in the panel two times out of three.

- Values: 21 name units in 15/19 clips (clips 02, 04, 07, 08 have no product-name unit; clip07's course titles are filed as list-item title cards). Family: logo_or_mark 10, interface 5, text_card 4, illustration 1, photo 1. Layout: panel 14, full-frame 7. Start minus name-clause onset median -1 frame (n=19 measurable; 15 within -2..+2; clip01 +5, clip18 +25 where the name is late in the clause). Devices seen: mark pops in with a ring pulse (clip13@123, @396, @641), wordmark types on (clip03@175, clip11@131, clip14@170), neon or marquee sign (clip05@179, clip12@121), blurred wordmark sharpening under spotlights with a laurel (clip06@227), app-icon tile (clip09@430), prop reveal (clip01@121, cloche lifts to the wordmark). Median length 51.5 frames for logo_or_mark units.
- Evidence: numbers.json name_moments; G_inventory_build.csv product_name_moment=yes
- Confidence: high

### [G15] Build interface units as rebuilt, simplified UI on a pastel plate (white rounded cards, chips, pills, toggles, check badges), acted out by a pointer, not as raw screen recordings.

- Values: Interface units 120: drawable 68, capture 48, bespoke 4. A pointer clicks, drags or holds in 24 of 120 interface units (28 units overall). Device mentions across all 279 unit descriptions: badge 30, chip 26, tick 22, check 19, pill 13, counter 11, sparkle 11, ring pulse 10, wipe 10, flash 10, stamp 9, red X 6, confetti 5. No unit shows operating-system chrome beyond a window's traffic lights (no menus, docks, taskbars).
- Evidence: n=120 interface units; G_inventory.csv descriptions; review sheets e.g. clip01@444-590 (hold-to-delete), clip07@856-884 (quiz), clip15@512-576 (terminal picker)
- Confidence: medium (device counts come from the written descriptions, not from pixel detection)

### [G16] Draw the main card or window about 914 px wide (914-932, inset 74-84 px each side), with a corner radius of about 31 px (25-33) and a tight shadow with a negative spread: 0 31px 41px -27px rgba(0,0,0,0.43).

- Values: Main white card x-extent (cards wider than 800 px): left median 84, right median 997, width median 914 (n=10 cards in 10 clips; left 71-102). Verification (cards found automatically on pale plates): clip06@390 x 84, width 919 (growing 898->924 over 50 frames as the card scales in), radius 30-33; clip12@320 x 74, width 932, radius 29-30; clip02@990 width 549, radius 25. Darkening below at 5/10/20/30 px 0.21/0.17/0.09/0.05 (clip06, clip12) and 0.13/0.08/0.04/0.01 (clip02); beside 0.04-0.085 at 3 px, 0.01-0.04 at 10 px, 0 by 20 px; above none. Fits: 0 31px 41px -27px rgba(0,0,0,0.43) (clip06, rms 0.008), 0 18px 25px -13px rgba(0,0,0,0.25) (clip02). Card fill pure white (255,255,255 calibrated).
- Evidence: G_card_geometry.csv, G_card_crops/*_x3.png, G_shadow_fit.csv, G_shadow_profiles.png
- Confidence: medium (10 cards measured; shadow parameters from 2 clean fits; flat patches carry about 2 levels of codec noise)
- Verified, corrected (item 12): width and inset confirmed approximately (the cards scale in, so any constant is a moment in the push-in); the radius is about 30 rather than 34; the shadow needs a negative spread because its sides are much tighter than its bottom. The study's values: corner radius median 34 px (p10 29.5, p90 43, n=20 corners) and shadow 0 22px 32px rgba(0,0,0,0.22) (clip13@360) or 0 28px 44px rgba(0,0,0,0.22) (clip02@410) from 2 clean fits; the 0 22px 32px fit predicts 0.094/0.058 darkening at 3/10 px beside the card, measured 0.054/0.014.

### [G17] Give desktop windows traffic lights (three coloured title-bar dots): 13 px dots at a pitch of 1.9x the diameter, the first dot centred about 111 px from the frame's left edge.

- Values: 56 detections in 30 units (8 clips): dot diameter median 13.2 px, p10 12, p90 19, range 11-19.5; centre pitch median 26.8 px; pitch/diameter median 1.88 (1.67-2.14); first (red) dot centre x median 111 px (p10 99.5, p90 133.5). Three scales by clip: about 12.5 px (clip02, clip06, clip19), 15 px (clip01, clip03), 17.5-19 px on dark terminal/editor windows (clip08, clip15).
- Evidence: G_traffic_lights.csv (every unit whose description names a window, editor, terminal or browser; probes at 40 % and 70 % of each unit)
- Confidence: high (measured; units without chrome were not counted as misses)

### [G18] Centre graphics on x = 540; in the panel fill about 81 % of the width; in full-frame units keep the graphic in the upper two thirds, above the caption.

- Values: Foreground bounding box on a plate-fitted frame at 70 % through each unit. Panel (n=63 clean-plate units): centre x median 539 (p10 521, p90 560), width median 876 px (p10 682, p90 930), centre y 521 (panel bottom/seam at y about 958). Full-frame (n=108): centre x 539 (516-569), width 899 (745-981), top y median 303 (p10 97), bottom y median 1174 (p10 1120, p90 1783), centre y 777 (691-1011).
- Evidence: G_prop_bbox.csv, G_prop_bbox_check.png (12 random units with boxes drawn)
- Confidence: medium (automatic segmentation; 70 of 279 units excluded because the plate fit failed; boxes on gradient plates can run long, see clip17@904 in the check image)

### [G19] Show captured pages and footage framed: as cards or thumbnails, inside a browser or app window, in a phone frame or a player; only scrolling websites and AI footage go full-bleed.

- Values: 78 capture units. Their descriptions mention: card 34, window 18 (13 units with detected traffic lights), photo 15, thumbnail 14, browser 11, footage 11, grid 10, scroll 7, phone 7, player 5. Full-bleed captures: website scrolls (clip06@586-631, clip11@345-428), one kinetic-type sample (clip14@769-790) and AI-generated video in clip16 and clip18 only. Window-framed pages are shown at about 914 px wide, so a 1440 px desktop layout appears at roughly 0.6x (by eye).
- Evidence: n=78; G_inventory_build.csv build_class=capture; G_traffic_lights.csv
- Confidence: medium (framing counted from descriptions; magnification by eye)

### [G20] Use figures for every spoken quantity: a counter that rolls to the number, a bar or gauge that fills, a clock, a chart, or one huge numeral filled with imagery.

- Values: 54 figure units in 16 clips, 50 drawable. In their descriptions: rolling/odometer/split-flap/slot counters 21, charts 8, grids of dots or tiles 8, big numerals 9 ('26' clip07@53, '48' clip11@247, '400+' clip14@225, '90%' clip08@39, '2x' clip10@344, '$100 MILLION' clip18@663), bars 9, clocks 3, gauges 2. Median 67 frames. Counters land on the spoken value (e.g. '5,000,000+' clip09@464-544, '$0.00' clip10@133-148, '50' clip08@807-835).
- Evidence: n=54; G_inventory.csv family=figure
- Confidence: medium (sub-types counted from descriptions)

### [G21] Act out problems and claims with a metaphor prop or scene (rendered 3D or cartoon), usually bespoke art.

- Values: 50 illustration units in 14 clips: 33 bespoke, 17 drawable. Examples: chains and padlocks on a card (subscriptions, clip02@100), paper shredder (code not copied, clip02@483), basketball through a hoop (one shot, clip02@706), iceberg above and below water (clip04@175, @245), leaking glass tank (wasted tokens, clip13@0), train switching tracks (fallback model, clip13@691), gates with bars stopping bugs (clip08@149, @606), hanging light bulbs lighting up (clip04@774). Drawable ones are built from simple shapes (gates, conveyor, bookshelf of bars, pixel mascots).
- Evidence: n=50; G_inventory.csv family=illustration; review sheets
- Confidence: medium (the explanation analyst should verify the act-out events frame by frame)

### [G22] Do not ship the recurring orange pixel creature: it is a product mascot; if a mascot is wanted, use a neutral pixel sprite of your own, about 1.5:1, in the same role.

- Values: Orange pixel-art creature in 19 units across 9 clips (06, 08, 09, 10, 11, 12, 13, 15, 17), only from 2026-11-03 (clip06) onward and only in clips about one AI assistant and its tools (none in clips 01-05, 07, 14, 16, 18, 19). Measured fill #E28056 (226,128,86) identical in 6 instances; bounding box aspect 1.51-1.53 (n=5); width 104-474 px depending on role.
- Evidence: G_mascot.csv, G_mascot_*_x2.png; numbers.json mascot.units_per_clip
- Confidence: high (colour and presence); medium (identity as a third-party mascot is by eye)
- Verified, confirmed (item 14): #E38056 is the mascot's own colour; orange-hue pixels are 0.1-0.7 % of graphic pixels in most clips.
- Build: no mascot and no third-party marks (README, 'Where the build departs from the reference').

### [G23] Use photos and video footage sparingly (9 % of units) and keep them short; outside AI-video topics, photos live inside interface cards (avatars, thumbnails).

- Values: 25 photo units, median 44 frames (p10 19, p90 91). 19 of 25 are in clip16 and clip18, whose topics are AI video tools; the other 6 are in clip06 (aerial city photo), clip19 (video call tiles, trailer, thumbnail deck). AI-footage units per clip: clip16 9, clip18 10, all others 0.
- Evidence: n=25; numbers.json styles_over_time.ai_footage_units_per_clip; G_inventory.csv family=photo
- Confidence: medium (topic-driven; 2 clips carry most of it)

### [G24] Keep one illustration language per video; flat cartoon scenes appeared in one clip only and are not the house style.

- Values: Cartoon (flat, outlined, comic) illustration units: clip04 7 (2026-11-02), clip07 1 (2026-11-03), all other clips 0. Non-cartoon illustrations (rendered 3D props, photoreal renders, simple shape scenes) appear in 13 clips across the whole period (2026-10-29 to 11-12). Within a clip, 7 of 7 cartoon units in clip04 share one look (same room, palette and outline).
- Evidence: numbers.json styles_over_time.cartoon_units_per_clip; review sheets rv_clip04_*.png
- Confidence: low (seen in one clip)

### [G25] Budget assets per video: about 9 drawable units, 2 captured screens or clips, 1 bespoke prop, 1 product mark, plus third-party marks where the script names other tools.

- Values: Per clip medians (range): drawable 9 (3-15), capture 2 (0-16), bespoke_art 1 (0-12). Product-name units in 15/19 clips (1-3 per clip). Third-party marks shown as app-icon tiles or marks in 11/19 clips (logo_or_mark family) and inside many interface units.
- Evidence: numbers.json build.per_clip; G_inventory_build.csv
- Confidence: medium (build class by eye)

### [G26] Never let a panel graphic cross the seam onto the presenter, never overlay graphics on presenter-only shots, and never use lower thirds, emoji stickers, arrows or subscribe prompts.

- Values: 0 of 133 panel units showed content below the seam (y about 958); 0 of 51 presenter-only runs (32 mid-clip, 19 closing) carried a graphic other than the caption and the closing keyword; 0 lower thirds, stickers, arrows or subscribe buttons over the presenter in 279 units.
- Evidence: by eye on every review sheet (G_review_sheets) and the seam-edge check in layoutfeat_<clip>.npz
- Confidence: medium (by eye at about one tile per 24 frames; a one- or two-frame overlap could be missed)

### [G27] Let the plate change with each unit: consecutive units rarely share a background, and the same plate returns only inside a short scene sequence.

- Values: Back-to-back same-layout units are 34 of 260 transitions and most of those are scene sequences on one plate (e.g. clip02@0-64 three apps in the viewfinder, clip16@109-166 four AI clips). Plate colour per unit was not measured here (colour analyst).
- Evidence: G_timeline_rowmean_<clip>.png (every-frame row-mean timelines: each unit change shows as a vertical colour change), G_timeline_families.png
- Confidence: low (qualitative from timelines; plate recipes belong to the colour study)

## Constant and variable

CONSTANT (19/19 clips): a panel unit at frame 0; alternation of panel and full-frame units cut on word onsets; a presenter-alone closing run with the keyword cutting in complete and holding to the last frame; no graphic over the presenter except caption and keyword; pure white card fill; mascot colour #E28056 where it appears; layout changes are cuts. VARIABLE: units per minute 18-33 (driven by speech rate and clause density); first unit 37-80 frames; graphic share 81-92 %; full-frame share 42-56 %; family mix per clip (photo/footage only in AI-video topics, clip16 and clip18; cartoon illustration only in clip04 and once in clip07; mascot only in clips about one AI assistant from 2026-11-03 on); traffic-light scale 12.5-19 px by clip; bespoke art 0-12 units per clip; capture 0-16 units per clip.

## Open questions

- Unit boundaries inside long single-shot units (e.g. clip01@285-443, clip09@727-871, clip05@692-867) hide animated scene changes with no hard cut; the explanation analyst should split them by event if needed.
- Whether interface units are screen captures of real products or rebuilt mock-ups cannot be proven from pixels; 'capture' vs 'drawable' was judged by eye (photographic content, real page layouts, dense real text = capture).
- Card shadow parameters come from 2 clean fits; more cards on flat plates would tighten alpha, offset and blur.
- The pointer was measured by eye on 2 instances (two different arrow styles); an automatic detector matched text glyphs and was dropped.
- Clause categories were coded by one reader on a machine transcript with lost punctuation in 3 clips (clip01, clip14, clip15); a second coder would give an agreement figure (the keyword-rule first pass agreed on 259 of 365).

Needs an eye or an ear:

- Watch the 21 product-name units in motion (numbers.json name_moments) to confirm the reveal device and that it lands on the name word, not the clause start.
- Watch G_review_sheets/rv_clip16_3.png and rv_clip18_*.png units in motion: AI footage under overlays was merged into single units across footage cuts (cut frames listed in the descriptions).
- Confirm by playback that no panel prop crosses the seam onto the presenter (rule G26); review sheets sample about one frame per 24.
- Check the five units where face detection read a pictured face as the presenter (clip16@633-657, clip18@44-113, clip18@453-484, clip19@107-127, clip19@1001-1012) are full-frame graphics, as filed.
- Look at G_card_crops/ and G_shadow_profiles.png to confirm the hairline grey stroke seen on some cards (clip02@410) and whether it is a style constant.
