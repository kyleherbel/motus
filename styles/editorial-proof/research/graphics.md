# Graphics: what is shown, and how: measured record (G01-G28)

Part of the Editorial Proof study; read `README.md` first for the corpus, the method and the limits. STYLE.md cites these rules by id, for example [G01]. Frames are at 30 fps (f); positions are pixels on the 1080 x 1920 frame; evidence is given as clip id @ frame (see README.md, "Evidence ids").

**Sample.** All 33 reels: a 5 fps scan for card geometry (3,023 card samples), a hand-coded catalogue of 416 segments (357 with a graphic) mapping each spoken clause to the graphic shown, and per-instance measurements of marks (44 highlight rectangles, 15 marker strokes, 23 number tiles, 13 outline boxes and more).

**Method notes.** Graphic types and asset classes were judged from 2 fps thumbnails, so segment boundaries are +-0.25 s and the line between a real capture and a designed mock is a judgement on 30-40 segments. Asset classes: X external capture only, M capture with designed overlays, D designed from text.

**Confidence.** high = measured on many instances and consistent; medium = measured but on fewer instances or with a judgement step; low = one to four instances, or inferred.

## Rules

### G01 - Use one card component for every proof in a video: fixed width and x, white fill, thin blue outline, small radius; only the height changes with content.

- Confidence: high
- Numbers: Newest era: width 894 px, x 93-986. Heights: 722 (light split default, y 255-976); 482-485 (light split with chip row or under hook title: y 255-736 or y 493-977); 684 typical in dark focus (y 254-937), stretching 163-1023 to fit content. Fill #FDFDFD. Outline 3 px median (2-5) on light, 4-5 px with glow on dark; colour #2066BC (range #1152A8-#2C6EBD); lime reels #BAD201. Radius 18 px median (16-21).
- Evidence: 5 fps scan of all 33 reels (915 light + 362 dark samples at 894 width); 44 cards in 29 reels measured for stroke/radius (39 blue cards, 26 reels); clip26@762, clip39@420, clip39@318, clip40@630

### G02 - Card width is constant within a video but changed across eras; build to the newest.

- Confidence: high
- Numbers: 940 px (x 70-1009) in 10 reels (8 oldest blue + lime clip25, clip11; card 940x696 at y 240-935); 848 px (x 116-963) in 4 mid reels (clip24, clip22, clip21, part of clip23; 848x685); 894 px in 19 newest reels. Hook card sometimes 0.95 scale: 848x462. Interstitial card 852x618 at y 528-1146 (6 reels).
- Evidence: scan, 3,023 card samples; clip08@564, clip24@330, clip29@48, clip34@1110

### G03 - Animate two soft light-blue glints running clockwise round the card outline, 180 degrees apart, looping while the card is up.

- Confidence: medium
- Numbers: Speed 11.1 px/frame = 333 px/s; one lap of an 892x481 card = 8.2 s (a glint passes a point every 4.1 s). Head about 60 px long, 12 px thick, #B7D7FF-#CBE2FF, fading tail 150-250 px. First visible 4-6 frames after the card appears.
- Evidence: clip39@405-464 and @1185-1325 tracked frame by frame (n=2 runs, 1 reel); visible in stills of clip40@408, clip38@45, clip14@276, clip18@438

### G04 - Skin source cards with a fixed-size browser chrome (it does not scale with card width).

- Confidence: high
- Numbers: Bar 65-67 px from the card's outer top, fill #F4F4F6 to #EFEFEF, 1 px divider #E4E4E4. Three 16 px lights centred at dx 34/60/86 px, dy 35-36 px; #FD6C52, #FCB723, #1AAD3A. URL pill dx 198-694 (496 wide), dy 16-53 (38 tall), white, radius about 9, lock + bold host + grey path at about 21 px, true source URL. Right side: share/plus/tabs icons.
- Evidence: 33 cards in 27 reels; identical offsets at widths 848, 894, 940; clip39@420, clip08@564, clip26@762

### G05 - In numbered-list videos replace the chrome's right icons with a progress counter pill on every card of that item.

- Confidence: high
- Numbers: Pill 124x42 px, fill #1E1E1E, fully rounded, dx -146 to -22 from the card's right edge; text 'n / N' bold white numerator, grey slash and total. Present in 3 of 5 list reels, 34 segments.
- Evidence: clip39@420 (2/5), clip24@525 (2/4), clip10@996 (4/5); absent in clip31@246 and clip20@480

### G06 - Terminal cards are designed mocks with one fixed skin: splash, typed command, then result rows.

- Confidence: high
- Numbers: Title bar #1B1B1B, 54-56 px, 14-16 px lights, centred 'Claude Code - ~/dir' with orange pixel mascot #E07C51. Body #111111, prompt rows #222226, text #EEEEEE mono 26-34 px, 19 px green bullets #34A54D. Dark-mode size up to 894x1023 (y 254-1277). 35 segments in 16 reels, host segment 3.5 s median (2.4-5.0).
- Evidence: clip38@168, clip37@450, clip19@330; one real terminal capture for contrast at clip07@684

### G07 - Show source pages as tight element-level crops at high zoom, never as a full-viewport screenshot.

- Confidence: high
- Numbers: Body line pitch inside cards 48-94 px, median 62 px (n=17 cards, 17 reels) = 2.0-3.9x CSS px for a 24 px line (median 2.6x). A full 1280-1440 px viewport fitted to 894 px would give 15-17 px. Only 230-445 CSS px of page are visible across the card (clip39@420: 291 px = GitHub's About sidebar).
- Applied to designed text cards: a paragraph of up to 3 lines is zoomed in to the top of the measured range (94 px pitch) rather than left at the 69.75 px default, because the short claims the reference shows are tight, high-zoom crops (the 3.9x end). Longer paragraphs stay at 69.75 px and shrink toward the 62 px median and below as needed.
- Evidence: clip39@420, clip40@630, clip31@246, clip26@174, clip21@348; real-DOM evidence: words cut mid-glyph at card edge clip38@375, clip10@996

### G08 - Mix three asset classes: real captures, captures with designed overlays, and graphics designed from text when no source exists.

- Confidence: medium
- Numbers: 357 graphic segments: 150 external only (42%), 111 mixed (31%), 96 designed (27%). Per reel median 10 graphic segments (range 6-19): 4 external, 3 mixed, 2 designed. 7 reels have zero designed-only segments. Fallbacks: terminal mock (35 segs, 16 reels), mock UI (51, 21 reels), phone chat (8), chart (4), logo grid (4), price list (3), rank list (2), tree diagram (2), icon card (2), role panels (1).
- Evidence: , all 33 reels, hand-coded from 2 fps sheets

### G09 - Highlight source text with a flat light-blue rounded box per line, behind the glyphs, no underline or outline.

- Confidence: high
- Numbers: Colour #A9D6FB median on white (rgb 169,214,251; p10-p90 #A6CBEE-#ADD7FC), equal to rgba(33,150,243,0.40) on #FDFDFD. Text under it stays near-black (#05192A-#171E26). Radius about 6 px. Box height median 49 px (p10 34, p90 67) = 0.65-0.78 of line pitch, about 1.12x font size; 6-8 px side padding; one box per line for multi-line phrases; giant headings 138 px.
- Evidence: 44 rectangles, 27 frames, 25 reels: clip39@420, clip40@630, clip36@399, clip13@570, clip30@636, clip22@258

### G10 - Highlight only the few words that carry the claim, wipe them in at the spoken word, and keep them until the card cuts.

- Confidence: medium
- Numbers: Words per phrase median 3 (p10 1, p90 5, max 8; 2 words is the mode, 36 of 110 phrases). Phrases per card: 1 in 59%, 2 in 31%, 3-4 in 10%. Wipe left to right in 6-8 frames (200-270 ms), decelerating: widths 90/183/217/229/234 px at +0/2/4/6/8 frames. Visible 73 frames median (46-108, n=10). HL appears in 120 segments, 31 reels.
- Evidence: clip38@296-304, clip30@598-606 (clean single-phrase wipes); n=11; phrase counts from catalogue

### G11 - Switch highlight colour only for meaning or surface: red for a negative sentence, darker blue on dark pages, lime in lime reels.

- Confidence: medium
- Numbers: On dark page #215F9B box behind white text. Red #EFC6C8 (3 segments, 3 reels). Lime #F0F6B5. Two-colour (orange + blue) once for categories. Solid blue block over image text in the gameplay reel.
- Evidence: clip39@525, clip40@678, clip23@570, clip11@420, clip26@915, clip07@240

### G12 - Call out a UI element or single token (Star button, licence, repo name, a number, a tab) with a bright blue rounded outline box, not a highlight.

- Confidence: high
- Numbers: Stroke 5 px median (4-6), #0885F5 (range #017FF9-#0F89F4), radius 16 px median (12-20), 8-12 px clear of the target. Orange #F59F1F for a second callout in the same card; red #E5484D boxes in critique sets. 51 segments in 26 reels.
- Evidence: 13 boxes in 12 reels: clip08@312, clip12@159, clip14@276, clip34@294, clip10@996, clip38@375, clip21@534; orange clip30@249, clip36@978

### G13 - To isolate one block of a busy page, dim the page and lift the block on a white plate.

- Confidence: medium
- Numbers: Page #FDFDFD dims to #838385-#8D8D90 (black at about 46%); target on rounded plate #FCFCFD with soft shadow. On dark canvas the card dims to #2E3036 and the target stays lit. 6 spotlight + 3 dim-under-number segments in 7 reels.
- Evidence: clip31@246, clip40@420, clip38@375, clip24@1245, clip10@996

### G14 - Cross out prices, competitor logos and competitor names with one tapered red marker stroke, drawn left to right, one per spoken item.

- Confidence: medium
- Numbers: Rises to the right at 7.0 degrees (range 5.95-7.06); mid thickness 10-18 px, ends 0.57x of that (0.53-0.75), pointed tips; length 100-436 px with 10-20 px overshoot each side; colour #F84B2D (#F54A2D-#FA5337).
- Evidence: 15 strokes in 2 reels: clip39@60, @438, @717, @954, @1290; clip38@45, @1236

### G15 - Two other strike styles exist: a thin typographic strikethrough inside designed lists, and an older diagonal slash across a logo tile.

- Confidence: high
- Numbers: Typographic: 0 degrees, 2-4 px, #DB5A53, 6 reels. Old slash: 31.5-33.5 degrees, uniform 15-24 px, #EE564A, 2 reels.
- Evidence: clip19@330 (10 rows), clip37@726, clip15@825; slash clip13@12, clip24@1119

### G16 - Current big-number block: dark rounded tile over the source card with glowing blue-white gradient digits and a short label.

- Confidence: high
- Numbers: Tile fill #343842, 1-2 px edge #3A6077, radius 27. Example 706x278 at (188,596): padding 34 top, 40 between, 37 bottom, 48 sides; width hugs the number (300-720 px). Digits bold, cap height 132-148 px, vertical gradient #F0F7FB to #C1E0FB to #6DBCFB, blue glow about 20 px. Label #EBEEF3 bold 36-44 px tall. 24 segments, 15 reels.
- Evidence: clip39@108, clip38@375, clip33@321, clip31@246, clip19@888, clip30@636, clip36@240

### G17 - Two alternative number skins: an older white tile with flat blue digits, and a bare number above the card when the card must stay visible.

- Confidence: high
- Numbers: White tile #FDFDFD, radius about 34, 1 px #E4E4E6 edge, drop shadow; digits #0083FC, cap 116-156 px; label #76767A about 39 px tall; 8 segments, 8 reels. Bare: gradient digits about 150 px cap centred above the card on dark canvas, 7 segments, 7 reels.
- Evidence: White: clip08@312, clip18@438, clip14@276, clip13@570, clip22@258, clip09@186, clip10@996, clip07@168. Bare: clip40@318, clip18@339, clip20@480

### G18 - A number block is brief, labelled in 1-3 words, uses the page's figure, and comes after the number is marked in the source.

- Confidence: medium
- Numbers: On screen 34 frames median (1.13 s); p10-p90 23-57 frames; min 15, max 63 (n=23, 19 reels); the 3-value counter $100/$200/$500 runs 177 frames. Labels: 'GitHub stars', 'a month', 'AI SEO skills', 'pro hacking tools'. Speech '23K' shows '24.3k'; speech '40,000' shows '42.5k'. Digits roll like an odometer on entry. Order: card, highlight/outline on the number, tile.
- Evidence: roll caught at clip24@738, clip21@78, clip19@555; figures clip38@375, clip34@294

### G19 - Name third-party products with white logo chips in a centred row just under the card, popping in one per spoken name.

- Confidence: high
- Numbers: Tile #FDFDFD, radius 20, soft shadow; 26-29 px below the card bottom; 1 chip 442x186; 3 chips 264x198 gap 28; 4 chips 190x186 gap 26 (x 121/337/553/769). Dark focus: 330-338x267, gap 36, brand fill allowed (#004ADE). Logo 62-90 px + bold label #121212 about 30 px. 18 segments, 12 reels.
- Evidence: clip39@438, @954, @1290, @717; clip08@810; clip13@795; clip27@960

### G20 - Label clips, statuses and models with small pills inside the card; stack 2-3 strips for before/after or multiple outputs.

- Confidence: medium
- Numbers: Pill 44-50 px tall, fully rounded, dark #444444 (about 75% black) or blue #0183FB, white bold text, 14-20 px inset top-left. 27 segments, 15 reels. Stacks: strips about 890x330 with 12-16 px gaps, 10 segments, 9 reels.
- Evidence: clip14@690, clip31@615, clip29@615, clip36@696, clip16@780

### G21 - Sixteen base graphic types cover the corpus; source capture dominates and designed UI, terminal and media share second place.

- Confidence: medium
- Numbers: Segments / reels: BROWSER_SRC 160/33; MOCK_UI 51/21; TERMINAL 35/16; MEDIA 35/14; PRODUCT_UI 29/16; LOGO_CARD 10/10; TABLE 8/7; PHONE 8/4; LOGO_GRID 4/4; CHART 4/2; PRICE_LIST 3/3; MEDIA_FULL 3/1; RANK_LIST 2/2; TREE_DIAGRAM 2/2; ICON_CARD 2/1; ROLE_PANELS 1/1. Median 4 distinct base types per reel (1-7) and 8 distinct mark types (3-13).
- Evidence: , 357 graphic segments, 33 reels

### G22 - Change the card state every few seconds and keep a graphic on screen almost all the time; most cards carry at least one mark.

- Confidence: medium
- Numbers: Segment duration median 2.5 s (p10 1.5, p90 5.0). 2.8 graphic segments per 10 s (range 2.0-4.0). Graphic on screen 87% of runtime (78-92%). 79% of segments have one or more marks; mean 1.25. Host durations by type: source 2.0 s, mock UI 3.4, terminal 3.5, media 3.0, logo card 1.5, rank list 5.7.
- Evidence: catalogue, all 33 reels; boundaries +-0.25 s

### G23 - Designed set pieces have measured layouts that can be reused as templates.

- Confidence: medium
- Numbers: Role panels: 2 tiles 434x570 at x 94-528 and 552-986, y 420-990, gap 24, fills #E5EEFB / #FCEFDF, icons #0F6BF7 / #F37100. Logo grid: card 894x1022, 2x2 cells 410x474, gap 18, pad 28. Rank list: active row 843x181 at (118,454). Price list: card 892x485, 5 rows at 87 px pitch, 62 px icons, price 44 px bold + '/mo' 26 px grey. Phone: 520x1088 at (280,262) on gradient #0F114A to #1F4FB5 to #88A1EF.
- Evidence: clip37@336, clip36@351, clip38@1236, clip39@60, clip35@555 (one instance each)

### G24 - Numbers: a spoken GitHub star count always gets a number tile on the GitHub capture; other counts usually do.

- Confidence: high
- Numbers: Stars: tile in 9 of 9 segments (9 reels), with outline box or highlight on the count in 9 of 9. Any spoken number (53 segments, 28 reels): tile in 36 (68%), some numeric emphasis (tile, highlight, outline or in-UI count) in 43 (81%).
- Evidence: clip38@342, clip34@267, clip30@282, clip24@702, clip22@222, clip21@477, clip19@462, clip18@387, clip08@267

### G25 - Replacement and openness claims: 'alternative to X' gets a highlight plus struck logo chips; 'free and open-source' gets a GitHub capture with the licence or phrase marked.

- Confidence: medium
- Numbers: 'alternative': highlight 5 of 5, logo chip + strike 4 of 5 (3 reels). 'open-source': source card in 14 of 16 segments (14 reels), highlight or outline box in 12 of 16. Price hooks: designed price list with a strike per price and a total tile in 3 of 3.
- Evidence: clip39@177, @402, @651, @882; clip24@1062; clip32@387; clip12@132; clip39@0, clip38@0, clip23@42

### G26 - Process and naming: naming the tool triggers a name-reveal card; 'just install/type/describe' and 'then it'll...' trigger designed terminal or mock UI rows that appear in speech order.

- Confidence: medium
- Numbers: Tool named: interstitial or logo card in 26 of 36 segments (25 reels). Install/type/describe: terminal, mock UI or product UI in 20 of 28 (21 reels), terminal in 11. 'it'll': terminal or mock UI in 21 of 34 (18 reels). Row-by-row builds in 45 segments (20 reels), checks in 14 (12 reels), typing in 20 (14 reels), cursor in 20 (15 reels).
- Evidence: clip38@69, @402, @627; clip37@357; clip33@657; clip30@342; clip27@0

### G27 - The hook's proof graphic shows the result or the stake, not the source page.

- Confidence: medium
- Numbers: First graphic by type (n=33): media 11, source capture 5, mock UI 4, terminal 3, product UI 2, price list 2, other 6. Hook media montage: 3-4 clips of 1.0-1.3 s (0.5 s cuts in clip11).
- Evidence: clip36@0, clip34@0, clip33@0, clip39@0, clip38@0, clip10@0

### G28 - Hide what does not matter with crop first, then dim, then blur; blur is also used to tease list items in hooks.

- Confidence: medium
- Numbers: Crop on all 160 source segments; spotlight/dim on 9; blur on 4 segments in 4 reels: names blurred in 3 list hooks, phone/email cells in 1. Blur strength inferred at sigma 8-10 px (36 px text becomes a bar).
- Evidence: clip39@60, clip31@60, clip10@60, clip24@330

## Constant versus variable

**Constant (core style, hold these fixed):**
  - One card component per video for every proof: same width and x, white #FDFDFD fill, 3 px blue #2066BC outline, 18 px radius, two clockwise glints at 333 px/s.
  - Fixed-size browser chrome: 65 px bar, 16 px lights at 34/60/86 px, URL pill with the true URL.
  - Source text shown at 2-4x CSS pixels as an element-level crop, never a full screenshot.
  - Highlight: #A9D6FB box per line behind 1-5 words, wiped left to right in 6-8 frames, kept until the cut.
  - Outline box: 5 px #0885F5, radius 16, for UI elements and single tokens.
  - Big number: bold digits 116-156 px cap height plus a 1-3 word label, about 1.1 s on screen, after the number is marked in the source.
  - Marks arrive in speech order, one per spoken item, and persist.
  - Pace: a new card state every 2.5 s median; a graphic on screen about 87% of runtime.
  - Hook proof shows the result or the stake.

**Variable (per-video freedom):**
  - Card height (163-1023 px) and which page region is cropped.
  - Which of 16 base types each clause gets; median 4 distinct types per reel, range 1-7.
  - Accent family: blue by default, lime #BAD201 for the three Higgsfield reels, orange #F59F1F as a second callout, red for negatives, brand colours inside chips and role panels.
  - Bespoke designed pieces per topic: role panels, rank list, logo tree, composite viewport-plus-todo card, before/after slider, icon card.
  - Counter pill: only 3 of 5 list reels.
  - Asset mix: 0-12 pure captures and 0-9 designed-only segments per reel.

**Drift over time (build to the newest):**
  - Card width 940, then 848, then 894.
  - Number tile white with #0083FC digits (8 older reels), then dark #343842 with gradient digits (15 reels).
  - Strike: 32-degree uniform slash, then 7-degree tapered marker.

**Observed vs inferred:** all geometry, colour and timing above is measured. Inferred: capture by headless Linux Chromium at high device scale (Noto-Sans-like GitHub text, crisp edges); highlight alpha 0.40 (only the composite is measured); tile shadows and blur sigma.

## Disagreements with other studies

- Outline colour: #2066BC here against #1562C8 in the calibrated colour study (C03); thin lines carry +-8 levels, the build uses #1562C8.
- Card fill: #FDFDFD here (default decode) is #FFFFFF in the calibrated decode (C01). Highlight #A9D6FB here, #A9D7FD in colour (C06).
- Card radius: 18 px here against 26 px in layout (L03); stroke 3 px here against 4 px in layout.
- Card glint: constant speed of 333 px/s here (one reel, two runs) against a constant 8.00 s lap regardless of card size in motion (M27, three reels). The motion reading is built.
- Highlight wipe: 6-8 frames here (G10) against 8-10 frames to 98 % in motion (M18); the difference is where the tail is cut off.
- Marker strike angle: rising 7.0 degrees here (G14); colour reports about -5 degrees (C10), the same direction in another sign convention and sample.

## Open questions

- Are source cards captured by an automated headless browser (my inference from Noto-Sans-like GitHub text and crisp 3x edges) or re-typeset by hand? The font file cannot be identified from H.264 frames.
- Is the highlight a normal layer behind the text or a multiply blend? Both match the measured pixels; only the composite #A9D6FB is known.
- What decides card height in dark focus (163-1023 px)? It tracks content aspect, but I did not derive a formula.
- Why do only 3 of 5 list reels carry the n/N counter pill (absent in clip31 and clip20)?
- When is the bare number chosen over a tile? Seen when the card below must stay readable, but n=7 is small.
- Do the two border glints always start at the same perimeter position, or at a random phase per card?
- Exact shadow values for chips, white tiles and spotlight plates were not measured; the CSS values in build_spec are estimates.

## To check by eye or ear

- Type labels in were coded from 192 px thumbnails at 2 fps; the split between BROWSER_SRC (real capture), PRODUCT_UI and MOCK_UI (designed) is a judgement on roughly 30-40 segments, especially in clip30, clip27, clip22, clip21 and clip23.
- Segment boundaries are +-0.25 s; do not use the CSV as frame-accurate cut data.
- Border glint speed and lap time were tracked in one reel only (clip39, two runs); confirm on a second reel before fixing 333 px/s.
- Marker strike was measured in only 2 reels (15 strokes); the 7-degree taper is the newest style but the sample is thin.
- Big-number on-screen frames use a digit-colour presence threshold; three short readings (clip34@294 and @369 at 15-19 frames, clip31@561 at 25) may undercount by a few frames because the tile moves with a card zoom.
- URL pill and counter pill offsets were measured on one card (clip39@420); traffic lights and bar height were checked on 33.
- Big-number tile padding, label size and dark-tile border were measured on one or two instances each.

## Decision rules (R1-R20)

The analyst's rules for choosing a graphic from what is said, derived from the 357 coded graphic segments. STYLE.md section 6.2 cites them as [R1]-[R20]. Support counts are segments (and reels).

| Rule | When the speech... | The reference shows | Support |
|---|---|---|---|
| R1 | GitHub star count spoken | GitHub sidebar/Star capture; outline box or highlight on the count; big-number tile 'N stars on GitHub' using the page's figure | 9/9 segments, 9 reels |
| R2 | any other count/amount | highlight/outline the number in the source, then big-number tile with 1-3 word label | 36/53 number clauses get a tile; 43/53 get some numeric emphasis (28 reels) |
| R3 | 'alternative to X' / replaces paid X | highlight the phrase with 'alternative' + logo chip(s) of X below card + marker strike per chip | HL 5/5; chips+strike 4/5 (3 reels) |
| R4 | 'free and open-source' | GitHub capture; highlight 'open source' or outline 'MIT license' | 14/16 source card; 12/16 marked (14 reels) |
| R5 | tool is named ('It's called X', 'The first is X') | name reveal: interstitial with site/repo card or logo card | 26/36 (25 reels) |
| R6 | list of third-party names | logo chips popping in per name (max 4); 4+ equal items: logo grid | 18 chip segs (12 reels), 4 grids |
| R7 | prices/paying in the hook | designed price list, strike per price, total tile | 3/3 |
| R8 | 'just install/type/describe/give it' | terminal with typed command, then result lines | 20/28 terminal|mock|product UI (21 reels) |
| R9 | 'then it'll ... and it'll ...' | designed process list: rows appear/light/check one per verb | 21/34 (18 reels) |
| R10 | parallel capabilities ('one..., another..., another...') | row highlight + check per item, or spotlight stepping down a page | 16 segs |
| R11 | quotable claim from docs | source card zoomed to the sentence; highlight the 2-5 carrying words | 120 HL segs, 31 reels |
| R12 | a named control/field/licence | outline box on the element; cursor click if it is an action | 51 outline segs (26 reels) |
| R13 | output of the tool | media card; several: 2-3 stacked strips with label chips | 35 media segs (14 reels), 10 stacks |
| R14 | a negative (bugs, expiry, bad reviews) | red highlight / red outline / red chips | 13 segs, 7 reels |
| R15 | rank over competitors | rank list; your row climbs; competitors struck | 2 segs |
| R16 | two roles contrasted | role panels | 1 seg |
| R17 | phone/texting | phone frame, chat builds per clause | 8 segs, 4 reels |
| R18 | forecast/benchmark | chart with chips or outlined row | 4 segs, 2 reels |
| R19 | numbered list item begins | counter pill n/N on each card of the item | 34 segs, 3 of 5 list reels |
| R20 | filler, opinion, CTA | no graphic; presenter | 59 segs, 33 reels |

Priority when several apply: R1 > R2 > R3 > R7 > R5 > R6 > R14 > R12 > R11 > R8/R9 > R13 > R10 > hold or presenter.

Build order inside a card: card enters with chrome and glints; optional pan/zoom to the target region; highlight wipe or outline box on the spoken phrase, at the word; big-number tile or logo chips / strikes, one per spoken item; everything holds until the cut; number tile leaves after ~1.1 s.

Source captures: zoom 2.0-3.9x CSS px (default 2.6x), 230-445 CSS px visible across the card, target body line pitch 62 px; crop to the element that contains the spoken phrase; never show a full viewport.
