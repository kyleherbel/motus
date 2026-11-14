# Graphics

Graphics were inventoried on all 11 in-style clips (12,791 frames, 426.4 s). Every frame was decoded twice with a calibrated BT.709 limited-to-full conversion (a white card reads 255,255,255; the default ffmpeg path reads 253): once for block statistics, layout mode and change bursts, once for accent and white pixel counts. The bursts give 118 scenes and 236 graphic units; each unit was labelled by eye with one of 42 component types and with the category of the spoken clause it accompanies. Geometry and colour were then measured with code on native-resolution frames.

Main findings. A graphic is on screen 99.5 percent of the time and the graphic state changes every 3.4 s (16.6 scenes per minute). Cards sit on one column, x=40 to 1040. Web sources are real captures, cropped to one block, enlarged about 3x and shown on a plain rounded card (radius 28, no stroke, no browser chrome); the words being spoken get an accent highlight bar that wipes in from the left in 3 frames, multiply-blended on light paper. App screens are never screenshots: 39 units are redrawn as dark house-style cards (toggle rows, prompt boxes, chat bubbles, sidebars) with 2 px strokes and accent outline boxes. Numbers become big cream figures 109 to 227 px tall. One accent (#FF6B1B) and one cream (#F2EEE8) serve every component.

Not done: nothing was watched in playback or listened to. Unit types, clause categories, word counts, asset origin (real or rebuilt) and the count-up of figures were judged by eye. Fonts inside components were not identified. Illustrations, audio and timeline diagrams, the waveform player, the hook illustration and the CTA card were counted but not measured in pixels. Entry and exit animation of components was not measured (only the highlight wipe). Positions of rows inside UI cards, text sizes inside cards and icon stroke weights were not measured.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [G01] Build the components in this order of reach: light capture card with highlight bars, big figure, rebuilt dark UI card family (card, toggle row, prompt box, chat bubble), chip or pill, logo tile, outline box, icon-tile count grid, section heading, and an illustration slot. Everything else occurs in 1 or 2 clips.

- Values: 236 units, 42 types (named by eye), 118 scenes, 11 clips, 12,791 frames. Clips using each type / units / total seconds: hook illustration 11/11/31.2; CTA card 11/11/30.1; big figure 9/20/58.4; light capture card 9/16/47.0; highlight bar 8/19/47.1; halftone illustration 8/19/64.3; chip 8/19/70.0; logo tile 8/19/52.0; outline box 7/13/30.4; dark UI card 6/17/60.9; icon-tile grid 5/5/14.0; prompt box 4/6/23.3; section heading 3/8/53.2; toggle card 3/6/19.7; chat card 3/4/17.8. 21 of 42 types occur in one clip only.
- Evidence: n=236 units over 11 clips. Boundaries from every-frame change bursts; type labels by eye.
- Confidence: high

### [G02] Keep a graphic on screen for the whole video and change the graphic state about every 3.4 s.

- Values: Share of runtime with at least one graphic unit: 0.995 pooled (per clip 0.985 to 0.998); 0.879 when the hook illustration and the CTA card are not counted (0.839 to 0.935). 33.2 units per minute (per clip 25.8 to 43.5), 27.2 without overlays, 16.6 scenes per minute (11.7 to 20.4).
- Evidence: n=11 clips, 236 units, 118 scenes; the only empty frames are 0-2 of each clip and short gaps in clip30@562-586 and clip33@68-79.
- Confidence: high

### [G03] A scene (one graphic state with its add-ons) stays a median 102 frames; a single unit a median 89 frames. Nothing stays under 19 frames; only a demo playback stays longer than 13.5 s.

- Values: Scene length: median 102.5 f (3.4 s), p10 65, p90 183, min 38, max 475 (n=118). Unit length: median 89 f, p10 54, p90 159, min 19, max 475 (n=236). Per type medians: capture card 78 f, highlight bar 53 f, big figure 82 f, dark UI card 109 f, prompt box 121 f, chat card 143 f, toggle card 98 f, outline box 65 f, section heading 229 f (it spans 2 to 4 scenes), halftone illustration 91 f. Scene changes take a median 15 frames of activity (p10 10, p90 30, n=117 bursts).
- Evidence: n=118 scenes / 236 units, 11 clips.
- Confidence: high

### [G04] Set every full-width card on one column: x=40 to x=1040 (1000 px wide), centred on x=540. Use 20 to 1060 for a card that must be larger and 60 to 1020 for inner panels, prompt bars and tile grids.

- Values: Light capture cards: 10 of 15 measured are exactly 40..1040 (edges +-0.1 px), 3 are 20..1060, 1 is 16..1064, 1 is 65..1015. Dark cards: 6 of 10 measured have their fill at 40..1040 with a 2 px stroke outside (38..1042); prompt bar 60..1020; count grid 60..1020; dark text card 40..1040.
- Evidence: n=15 light + 10 dark cards in 10 clips, (for example clip29@250, clip37@130, clip39@122).
- Confidence: high

### [G05] Draw a captured page as a plain rounded card: the page's own background as fill, corner radius 28 px, no stroke, no browser chrome, and a soft shadow below.

- Values: Radius median 28.5 px (range 20.8 to 43.6, n=15; it is constant within a clip and differs between clips). Fill is the page background: #FFFFFF in 9 of 15, #FCFCFC, #FAFAFA, #FAF8F6 (x2), #FDFDF6, #DEDBCE once each. Stroke: none on 15 of 15. Shadow: field luma is 7.8 levels darker 2 px under the card than 58 px under it (median, n=16 frames; 15 values between -8.7 and -3.6, one outlier where content sits under the card); it fades out by about 50 px. Height 383 to 1292 px (median 770, n=13). Browser window chrome: 0 of 16; one card has a separate URL pill above it (clip38@312-408).
- Evidence: n=15 cards, 9 clips.
- Confidence: high
- Verified, confirmed: median 28.5 px over 12 cards in 9 clips (range 20.5 to 43.7): clip29 28.5, clip36 29.6 (full) and 25.0 (presenter), clip33 29, clip35 24.6 top / 30.2 bottom, clip30 24.9, clip38 20.5 and 24, clip37 35 (37.5 top, 32.5 bottom), clip39 35.4, clip32 43.7 and 43.7. Four corners of one card agree within 2 px on 5 cards. Error +-1 px. Build value: 28 px.
- Verified, not confirmed (the other claim holds): clip29: alpha 0.49, sigma 34 px, offset +29 px (RMSE 0.28 luma levels, bottom and side profiles); clip38: alpha 0.59, sigma 34 px, offset +23 px (RMSE 0.27). Darkening of the 24.5-level field 8 / 24 / 48 / 72 / 96 px under the bottom edge: clip29 9.2 / 6.6 / 3.2 / 1.4 / 0.7; clip38 10.5 / 6.8 / 3.0 / 0.9 / 0.6 and 10.3 / 7.0 / 2.9 / 1.4 / 0.6; clip36 11.7 / 8.1 / 4.3 / 2.2 / 1.2; clip37 13.7 / 10.5 / 6.0 / 3.2 / 1.9; reach (0.5 level) 96 to 147 px. n=5 cards, 4 clips; a sixth (clip38@560-580, a card that later tilts) reads 16.5 at 8 px. Error +-0.05 alpha, +-3 px sigma, +-5 px offset. Build value: black, alpha 0.52, blur sigma 36 px (CSS blur 72 px), offset y +24 px.

### [G06] Crop a capture to one block of the page and enlarge it until body text has an x-height of about 26 px and a line pitch of about 73 px: 2 to 8 lines of about 37 to 47 characters fill the 1000 px card.

- Values: Body-text x-height median 25.5 px (range 21 to 28.5, n=12 text blocks in 7 clips); line pitch median 73.5 px (61.5 to 86). If the page body is 16 CSS px, that is a magnification of 3.1x (2.5x to 3.4x), so a card shows about 325 CSS px of page width. Characters per line 37 and 47 (counted by eye on 2 cards). What is shown (by eye, n=16): post text 2, repository page or README 4, product or docs page 6, template card 2, search result 1, sign-in page 1.
- Evidence: n=12 blocks, capture_text; (clip29@250, clip30@650, clip37@130).
- Confidence: medium: the magnification rests on an assumed 16 px page font

### [G07] Keep a capture static inside its card. A slow scroll or a short push-in is the exception.

- Values: Static: 13 of 16 light cards and 4 of 4 dark text cards. The card frame itself never drifts: edges identical within 0.2 px over 41 to 165 frames on 6 of 6 cards checked. Scroll: 1 (clip29@445-530, content moves up 200 px in about 85 frames, eased: 6 px by f448, 48 by f470, 108 by f490, 165 by f510, 196 by f528). Zoom: 1 (clip39@128-137, line pitch 72 to 86 px = x1.19, card frame unchanged). One card tilts and drops into a prompt bar (clip38@563-591, not measured).
- Evidence: n=20 captures; (scroll_clip29, zoom_clip39), capture_motion.
- Confidence: medium: scroll and zoom seen once each

### [G08] On light paper paint the highlight bar with a multiply blend of the accent at 33 to 55 percent, so text stays dark; on dark paper paint it as the accent at 42 percent under normal blend.

- Values: Bar colour on white: #FEAE80 (clip29, clip36; accent alpha 0.55) or #FFCEB4 / #FFCFB6 (clip30, clip39; 0.33); #FABB9A on #FAF8F6 (clip32; 0.43); #FDC7A8 (clip37; 0.37); #FDC6A8 (clip38; 0.39). On the dark card #080A09: #6F3210 in 8 of 8 segments (alpha 0.41). Overlap of two bars at clip29@808 reads #FF7743; multiply predicts #FF7740, normal alpha predicts #FF8850. Ink under the bar stays #000000 to #221A18 in 6 clips (clip29, 32, 36, 37, 38, 39); in clip30 the bar is laid over the text (ink turns #602E16 on light, #C98A6B on dark).
- Evidence: n=20 segments in 7 clips (clip29, 30, 32, 36, 37, 38, 39).
- Confidence: high
- Verified, confirmed: multiply. Two bars overlapping read (256, 119, 68) = #FF7744; multiply of the single bar (254, 174, 128) with itself predicts (253, 119, 65), stacking two normal-blend bars predicts (255, 137, 73): G is 18 levels apart and lands on multiply (n=7 rows of 56 px). On grey paper #ABB9B8 the bar reads #A98E75: R is unchanged (169.2 against 170.9; a normal-blend bar would give 217) and G and B give the same multiply strength (0.399, 0.405). Error +-2 levels. Build value: mix-blend-mode multiply, colour = accent #FF6B1B at the strength below.
- Verified, confirmed: clip29 0.55 (#FEAE80), clip36 0.55 (#FEAE80), clip32 0.42 (#FABB9A on #FAF8F6), clip35 0.40 (#A98E75 on #ABB9B8), clip38 0.38 (#FFC6A9), clip37 0.36 (#FDC7A9 on #FDFDF6), clip30 0.33 (#FFCDB4, normal blend), clip39 0.32 (#FFCFB6). Median 0.39 (n=8 clips, 12 bars). G and B agree within 0.016; flat-interior sd 0.9 to 1.5 levels in G. Error +-0.01. Build value: 0.40 as the default.

### [G09] Size a highlight bar to the text line box: about as tall as the line pitch, from 30 to 35 px above the x-height line to 16 px below the baseline, corners rounded 9 px, ends tight to the words.

- Values: Single-line segments: height median 72 px (range 59 to 94, n=17). Light paper: median 80 px, height / line pitch 1.02 to 1.23 (n=6 bars on multi-line text) (bars on adjacent lines overlap by up to 14 px), 35 px above the x-height line, 16 px below the baseline (n=9). Dark paper: 72 px, height / pitch 0.95 to 0.99, 30 px above, 16 px below (n=8). Corner radius: light median 9.1 px (6.8 to 13.3, n=36 corners), dark 8.6 px (5.3 to 10.4, n=26). Widths 62 to 731 px.
- Evidence: n=20 segments, 7 clips, (clip29@300, clip30@900).
- Confidence: high
- Verified, confirmed: light paper: height median 80 px (57 to 94, n=10 bars in 6 clips; one more bar is 46 px and covers only the lower half of a heading); top 35 px above the x-height line (28 to 42, n=8), bottom 15 px below the baseline (13 to 20, n=10). Dark paper: 68 to 70 px (n=9, clip30). Bars on adjacent lines overlap by 14 px in clip29 (rows 800 to 813). Error +-1 px on the edges, +-3 px on the text lines. Build value: bar from 35 px above the x-height line to 15 px below the baseline (about 80 px on 26-30 px x-height text).
- Verified, corrected: 0.15 of the bar height (0.142 to 0.162 per clip): 11.4 px on a 76 px bar (clip29), 11.9 on 79 (clip30), 12.3 on 82 (clip32), 14.3 on 88 (clip39), 6.5 on 46 (clip38); n=13 corners, 5 clips. Error +-0.8 px (method checked on synthetic rounded rectangles with blur and noise: 9 reads 8.9 to 9.8, 11.5 reads 11.2 to 11.8). Build value: radius = 0.15 * bar height (12 px on an 80 px bar).

### [G10] Highlight only the words the speaker is saying or paraphrasing: one bar per capture as a rule, three at most, two words typical.

- Values: 19 bars in 8 clips. Captures carrying a bar: 9 of 16 light cards, 4 of 4 dark text cards, 1 URL pill. Bars per capture: median 1, range 1 to 3 (n=14). Words per bar (counted by eye): median 2, range 1 to 10 (n=19); long bars (7 to 10 words) only in clip30. What is marked: a tool or feature name 7, a phrase quoted from the source 8, a number 2, a licence fact 2.
- Evidence: n=19 bars; (rows highlight_bar).
- Confidence: high for the counts, medium for the word categories (by eye)

### [G11] Wipe each highlight bar in from its left edge, starting about 4 frames after the spoken word begins; a phrase that wraps runs line by line.

- Values: 5 percent to 95 percent of the bar area: median 3 frames (range 3 to 6, n=15 single-line bars); the first sliver appears 2 frames earlier, full width about 6 frames after the sliver, decelerating (clip29@186-192: 0, 2, 80, 265, 330, 343, 348 px). Wrapped phrases: 8 to 10 frames in total (n=3); second line starts 7 frames after the first (n=2). Onset (5 percent frame) minus spoken-word onset: median +5.6 frames, 11 of 16 between +4.4 and +8.0 (transcript timing +-2 frames).
- Evidence: n=18 wipe events in 7 clips; every frame decoded.
- Confidence: high for the wipe, medium for the speech offset
- Verified, confirmed: hard-edged wipe from the left (coverage left of the edge 0.95 to 1.0). Width in px per frame from the frame before the first sliver: 346 px bar: 6, 82, 266, 328, 341, 345; 62: 0, 6, 48, 62; 603: 4, 13, 45, 163, 557, 587, 594, 597; 597: 4, 10, 129, 412, 545, 581, 591, 593; 268: 2, 8, 21, 67, 181, 257, 263, 265; 594: 2, 19, 53, 148, 380, 515, 563, 586, 589; 274: 0, 5, 9, 25, 77, 249, 266, 271, 273; 342: 3, 9, 29, 92, 238, 323, 329, 341. 5 % to 95 %: median 3.35 frames (2.3 to 4.6); first visible to 97 %: median 4.5 (2 to 6); n=8 bars, 5 clips, full layout. Fraction against frames from the 50 % point: 0.013, 0.027, 0.16, 0.66, 0.93, 0.98, 0.99 at -3... +3. easeInOutExpo over 9.0 frames RMSE 0.026; cubic-bezier(0.65,0,0.35,1) over 4.75 frames 0.028; linear over 2 frames 0.033. Error +-0.3 frame. Build value: left-to-right wipe, easeInOutExpo over 9 frames (5 % to 95 % in 3.3 frames).
- Verified, confirmed: 5 % point +4.2 frames after the transcript onset of the first highlighted word (median; 2.6 to 6.5; n=10 bars, 7 clips); first sliver about +3.5; 50 % point +6.2 (4.8 to 8.8). Error: +-2 frames from the transcript, +-0.2 from the wipe. Build value: start the 9-frame wipe 1 frame after the word onset (so its 5 % point lands 4 frames after the onset).

### [G12] For a source with a dark theme, show the text block on a near-black card that is darker than the field, with grey body text, and use the dark-paper highlight.

- Values: Card 40..1040, fill #080A09 (field beside it #10110E), 2 px stroke of luma about 30, body ink #9EA0A2, x-height 25 to 26 px, line pitch 73 to 75 px, 3 to 7 lines; 1 to 3 highlighted phrases each. On screen 100 to 266 frames (median 157).
- Evidence: n=4 cards, all in clip30 (clip30@769-921, 1076-1237, 1238-1503, 1625-1724); rect measured on 1 (clip30@1480), the others by eye.
- Confidence: low: one clip

### [G13] Point at a row, a card or a region with an accent outline box, not with an arrow: stroke about 5 px, no fill, corners 21 to 27 px on rows or following the card.

- Values: Colour #FF6B1B. Stroke median 4.8 px (range 2.9 to 7.9, n=17 boxes): 5.8 to 7.9 px in clip29, 36, 37, 38, 39; 2.9 to 4.8 px in clip31, 32, 34. Corner radius on rows and items median 25.1 px (20.5 to 37.4, n=11). 13 units in 7 clips, on screen a median 65 frames (20 to 118). Arrows: 1 in 11 clips (inside a before/after illustration, clip36@72-136).
- Evidence: n=17 boxes in 8 clips, (clip37@540, clip39@200, clip36@300).
- Confidence: high
- Verified, confirmed: stroke median 5.1 px (n=12 boxes, 7 clips) in two groups: 4.35 to 5.2 px (clip31, clip32, clip34; 8 boxes) and 7.0 to 7.4 px (clip29, clip37, clip39; 3 boxes), one at about 8 (clip36). Outer radius on rows and items 20, 20, 22.8, 24.2, 27.2, 31 (median 23.5, n=6); 6 to 7 px on four tight boxes, 16.5 and 35 where the box follows a screenshot region or an image. No fill (centre equals the surface under it). Colour #FF6B1C at the peak of the thick strokes. Error +-0.3 px stroke, +-1.5 px radius. Build value: stroke 5 px accent, radius 24 px on a row, no fill.

### [G14] Redraw app screens as dark house-style cards instead of showing screenshots: 2 px stroke, radius about 30 px, cream text in the house sans, placeholder bars for unimportant rows.

- Values: 39 rebuilt UI units in 9 clips; real app screenshots: 0. Card fill is warm in clip29, 35, 36, 38, 39 (#211F1B, #1B1A15, #1D1A19, #262724) and neutral in clip31, 34, 37 (#181818, #1F1F1F, #2A2A2A). Stroke 2 px, #2B2827 to #404040 (n=8). Radius median 30.6 px (26 to 32.8, n=6). clip29 nests the panel in a frame: 14 or 20 px of #1B1A15 around a #211F1B / #1F2125 panel with its own 2 px stroke; later clips use one flat card. Shadow: field 5 to 7 levels darker in the first 4 px under the card (n=12).
- Evidence: n=15 measured cards in 8 clips, (clip29@670, clip31@150, clip34@900, clip37@640); font identity by eye.
- Confidence: high for the geometry, medium for the fills (two families, cause unknown)
- Verified, confirmed: 12 cards in 9 clips. Fill, warm (R-B = 6): #1B1A15 (clip29 outer frame, clip35, clip39), #211F1B (clip32). Neutral (R-B = 0): #181818 (clip34 settings window, clip37 checklist), #18181A (clip34 app window), #1F1F1F (clip31). A fourth clip34 card reads #13120F just inside its top edge (a darker header band, not counted). Between: #1C1A19 (clip37 settings), #252523 (clip36). Stroke width 2.1 px (per-card medians 1.65 to 2.7; n=37 edges). Stroke colour: warm cards #2B2827 (clip29), #2C2A26 (clip32), #262522 (clip35); neutral cards read #353535 (#343432 to #363634 on 5 cards in clip34 and clip37). Radius median 30 px (25 to 35.5, n=18 corners on 9 cards). Error +-1 level on fills, +-3 levels on strokes, +-1.5 px on radius. Build value: default: fill #1B1A15 (frame) with #211F1B panels, stroke 2 px #2B2827, radius 30 px.

### [G15] Draw a setting as a toggle row and flip it on while the step is spoken: pill track 1.8 times as wide as tall, cream knob 0.78 of the track height, accent fill when on.

- Values: Tracks: 150x82 (clip29@670), 132x74 x3 (clip34@900), 112x62 x6 (clip29@1060); aspect 1.78 to 1.83. Knob 64 px on the 82 px track, 58 px on the 74 px track. On fill #FF6B1B, knob #F2EEE8 / #FEFDF8. Row behind the toggle 929x148, fill #2F3135, radius 23 (clip29). In clip37 the track is blue #4E79D3 (110x62, 104x56). 6 toggle cards in 3 clips, median 98 frames; the flip comes 20 to 32 frames after the toggle row appears (n=4: 20, 25, 32, 22; from burst times).
- Evidence: n=12 toggles in 3 clips (clip29, clip34, clip37).
- Confidence: medium: three clips, one of them with a different colour
- Verified, confirmed: track width / height 1.82 (1.80 to 1.87; n=12 toggles, 3 clips): 149.5 x 82.2, 111 x 61 (six), 130.7 x 72.6 (two), 127.7 x 69.5, blue 105 x 56 and 113 x 61. Knob diameter 0.82 of the track height (0.78 to 0.87): 66.5 on 82.2, 50.1 on 61, 60 on 72.6; inset 6 to 8.5 px. On #FF6B1B, knob #F2EEE8 (clip29) or #FEFDF8 (clip34); off track #5E6268, #4B4A4B. Switch (n=5, all presenter layout): knob at 0.70 to 0.88 of its travel on the first changed frame, 0.96 to 1.0 two frames later, done in 3 frames (1 to 4); two toggles of the six-tile grid flip inside one layer update. Track colour changes in step with the knob. Error +-1 px on sizes. Build value: track 1.82: 1, knob 0.80 of the track height, inset 0.10; switch in 3 frames, ease-out, colour with the knob.

### [G16] Show a prompt the viewer should copy as a prompt box: dark card on the column, cream text, an accent send button in the lower right corner, and where it applies an outlined 'screenshot this' chip.

- Values: 6 prompt boxes in 4 clips (clip29, 34, 35, 38), median 121 frames (84 to 147). Send button 88x88 r 25 (clip29) or 80x80 r 21 to 23 (clip34), #FF6B1B, 26 px from the right edge and 15 to 18 px from the bottom edge of the panel. Box heights 262 to 1071 px (3 to about 20 text lines). Screenshot chip: 599x102, radius 24, 3 px cream stroke, fill #211F1B (clip35@1000); it appears in 3 clips (clip34, 35, 36).
- Evidence: n=6 boxes.
- Confidence: medium: chip measured once

### [G17] Set a spoken number as a big cream figure centred on x=540, digits 109 to 227 px tall by character count, with a small illustration or logo tile beside it.

- Values: Ink #F2EEE8 +-3 levels on 18 of 18. Digit height median 166 px (n=18): 1 or 2 characters 149 to 227 (median 205), 3 or 4 characters 153 to 172, 6 to 9 characters 121 to 168, an 'x of y' figure 109; widest 878 px. Centre x within 6 px of 540 on 10 of 17; the others sit beside a list, a diagram or an illustration. 20 units in 9 clips, median 82 frames (38 to 160). 14 of 20 accompany a figure clause, 5 a series count, 1 the CTA. Count-up on entry: 7 of 20 (by eye), 13 to 30 frames.
- Evidence: n=18 measured in 9 clips, (clip29@610, clip33@400, clip38@470).
- Confidence: high for size and colour, medium for the count-up
- Verified, not confirmed (the other claim holds): cap height 109 to 227 px, median 168 (n=14 figures, 9 clips). By character count: 1 char 216, 183; 2 chars 227, 227, 205, 173, 163, 150; 3 chars 153; 4 chars 166, 160; 6 chars 136; 7 chars 169; 'x of y' 109. Ink width = 0.75 * cap * characters (0.72 to 0.80, n=7; '11' is 0.47). Centre x 539 to 544.5 on 9 of 14; the other 5 sit beside a logo, icon, list or grid. Ink #F2EEE8 within 1 level on the 12 figures whose core colour was read. Error +-2 px. Build value: cap = min(room, 1170 / characters) px, with room = 168 px by default and 205 to 227 px for a 1 or 2 character figure that stands alone; centre x 540; #F2EEE8.

### [G18] For 'one of N in a series', show the count as a big figure over a grid of N icon tiles with the current one in the accent colour.

- Values: 4 clips use it before the CTA (clip31@705-784, clip34@1085-1152, clip37@781-864, clip38@1202-1272), a fifth inside the CTA (clip35). 11 tiles in rows of 6 and 5: tile 140x140, 2 px stroke #31312F, fill #211F1B, gap 24 px, span 60..1020 (clip34); 139 px tiles with 39 px gaps and the active tile enlarged to 168 (clip37); 5x5 grid of 84 px tiles, 12 px gaps (clip38). Active tile: filled #FF6B1B in 3, outlined in 1. Figure digits 205 to 227 px.
- Evidence: n=5 grids in 5 clips.
- Confidence: medium: geometry differs between the clips

### [G19] In a list video put a persistent section heading 'number. name' at the top and keep it across the scenes of that item.

- Values: 8 headings in 3 clips (clip32 x2, clip33 x3, clip38 x3). Cap height 68 to 70 px, x-height 47 to 49 px, ink #F0EFEA. Baseline y=144 (clip32), 147 (clip33), 91 (clip38). Centre x 540 to 542 in clip32 and clip33, 502 in clip38. clip33 puts an icon tile between number and name. Each heading stays a median 229 frames (69 to 356) over 2 to 4 scenes and both layout modes.
- Evidence: n=8 headings.
- Confidence: medium: three clips, two baselines

### [G20] Use two chip families: cream tiles for third-party names, dark pills for paths, URLs and makers. Radius about 31 px on tiles, half the height on pills.

- Values: Cream (#F2EEE8): wordmark tile 232x116 r 34; maker pill 300x96 r 30 and 390x116 r 35; platform tiles 470x164 r 31, 30 px apart. Dark (#211F1B): URL pill 856x116, 2 px stroke #323230; maker pill 446x124; command pill 642x128 with a 3 px #93918D stroke and a 96 px accent number disc. Accent: price chip 270x180 r 40. 19 chip units in 8 clips, median 101 frames.
- Evidence: n=10 chips measured in 6 clips; chips.
- Confidence: medium: one or two instances per chip kind

### [G21] Show a third-party product as its logo on a cream rounded square, 128 to 136 px, radius 0.29 of the side, placed beside or on the corner of the element it belongs to.

- Values: Tiles 128, 130, 136 px with radius 39, 38, 38 (n=3 kinds, 5 instances); fill #F2EEE8. 19 logo-tile units in 8 clips, median 77 frames. The style ships no logos: the builder needs the tile and a slot.
- Evidence: n=5 instances measured; (clip33@100, clip38@1030, clip39@80).
- Confidence: medium

### [G22] Give every abstract clause (benefit, caveat, example, contrast) a bespoke illustration in the top zone: a 3D mascot scene for the hook, halftone cut-outs in cream with accent details for the body.

- Values: Hook illustration in 11 of 11 clips (44 to 127 frames, median 84). Halftone illustrations: 19 units in 8 clips, median 91 frames (55 to 218). Other illustration styles once or twice each: flat vector 4, pixel art 1, isometric map 1, contour diagram 1, pipe diagram 1, glyph art 1, particles 1. Illustrations per video including the hook: median 4, range 2 to 6.
- Evidence: n=40 illustration units, 11 clips; styles named by eye.
- Confidence: high for the counts, low for how to reproduce the artwork

### [G23] When the claim is about a phone, mirror the content in an outline phone frame on the dark field.

- Values: 3 frames in 2 clips: 400x668 with a 6 px #A29E93 outline and #1B1A15 fill (clip32@303-441); 706x1356 and 626 wide with two 2 px #2A2A2A lines 9 px apart and a #181818 screen (clip37@681-780, clip37@156-228). Height / width 1.67 and 1.92.
- Evidence: n=3.
- Confidence: low: two clips, two different drawings

### [G24] Choose the graphic from the clause: source or origin -> capture card with highlight; name of a tool -> capture card, or a name card; figure -> big figure; step -> toggle card, prompt box or UI card with outline; mechanism -> UI card or illustration; list item -> one card or chip per item; before and after -> stacked pair; series -> count grid; closing -> CTA card.

- Values: Scenes per clause category (n=118): mechanism 20, step 17, tool name 17, figure 16, benefit 13, hook 11, CTA 11, example 10, source 7, list item 6, series count 5, caveat 3, problem 3, before/after 2, recap 2, other 3. Scenes that contain the component: tool name -> capture card 10 of 17, section heading 7, name card 2. Source -> capture card (light or dark) 6 of 7. Figure -> big figure 13 of 16. Step -> toggle card 5, prompt box 5, UI card 4, chat card 2 of 17. Mechanism -> illustration 6, UI card 4, dark capture 2, phone frame 2 of 20. Benefit -> UI card 5, illustration 4 of 13. Example -> illustration 4 of 10. Series count -> big figure 5 of 5, tile grid 4.
- Evidence: n=236 units coded; clause categories assigned by eye from the transcript.
- Confidence: medium: categories are a judgement

### [G25] Treat web pages, posts and repositories as the only real captures. Redraw everything else. Never invent the captured text or the number.

- Values: Real captures: 25 units in 9 clips (16 light cards, 4 dark text cards, 2 page thumbnails, 2 before/after screenshots pairs, 1 portrait). Rebuilt in the house style: 39 UI units, all figures, chips, grids and headings. Per video the builder needs: 1 hook illustration, 1 to 5 other illustrations (median 3), 0 to 5 captures (median 2), 0 to 4 logo tiles (median 2), 0 to 4 figures taken from speech (median 2), 0 to 8 UI rebuilds (median 4).
- Evidence: n=236 units; column asset_origin (by eye); assets_per_video.
- Confidence: medium: origin judged by eye

### [G26] Use one accent and one off-white for every component: accent #FF6B1B, cream #F2EEE8, on the field #131311.

- Values: Accent #FF6B1B +-2 levels on 24 of 24 filled accent shapes (toggles, send buttons, tiles, discs, chips). Cream #F2EEE8 +-3 levels on 25 samples (figure ink 17, tiles and pills 8); UI text reads #F0EFEA to #F1EFE9; toggle knobs in clip34 are #FEFDF8. Field mode #131311 in 11 of 11 clips (frame 1). Exceptions: clip35 uses the product colour #E351BC for the product tile and the winner outline; clip37 uses #4E79D3 for toggles.
- Evidence: n=24 + 25 samples in 9 clips, field in 11, constants; calibrated decode (white card = 255,255,255).
- Confidence: high

### [G27] Place graphics in the field above the presenter panel, or let them take the frame down to y=1390 when the content needs height.

- Values: Split scenes 87, full-height scenes 29, mixed 2 (n=118). Full-height share of runtime 0.339 pooled (per clip 0.142 to 0.516). In split mode the footage begins at y=966 to 968 (9 of 9 valid samples) and cards end by y=872. Light capture cards: 10 of 16 in full height, 6 in split. Full-height cards reach y=1388 (clip29@440), 1360 (clip39@122), 1390 (clip34@1000).
- Evidence: n=118 scenes, 12,791 frames classified, panel_top.
- Confidence: high for the shares, medium for the y values (layout analyst owns them)

### [G28] Build audio and timeline diagrams (waveform player, clip strip, timeline card, waveform grid) only if the style must cover audio topics.

- Values: 10 units in 3 clips whose subject is audio (clip30, clip33, clip39): waveform player 475 frames (the only unit over 13.5 s; the speaker is silent), media player card x3, timeline diagram x2, diagram card, waveform grid, clip strip, small waveform.
- Evidence: n=10 units; not measured in px.
- Confidence: low: topic-specific, geometry not measured

### [G29] Do not use browser frames, device mock-ups around web captures, strike-through, underline marks, hand-drawn circles or arrows as proof devices.

- Values: Browser window chrome 0 of 20 captures. Underline marks 0. Hand-drawn marks 0. Strike-through 1 (a struck value chip inside a diagram, clip36@653). Arrows 1 (clip36@72). Emphasis on captures is always the highlight bar (19) or the outline box (13).
- Evidence: n=236 units, 11 clips; by eye on 2 fps sheets and burst sheets.
- Confidence: medium: absence checked by eye

## Constant and variable

CONSTANT (same in every clip that uses it): accent #FF6B1B; cream #F2EEE8; field #131311; card column 40..1040; 2 px card strokes; highlight bar radius about 9 px and 3-frame left-to-right wipe; no browser chrome on captures; app UI always redrawn; a graphic on screen all the time; hook illustration and CTA card in 11 of 11.

VARIABLE: capture card radius 21 to 44 px (per clip) and fill (the page background); highlight strength 33 to 55 percent of the accent and blend (multiply in 6 clips, normal in clip30); bar height 59 to 94 px (follows the line pitch); outline stroke 2.9 to 7.9 px (thin in clip31, 32, 34); dark card fill warm or neutral (per clip); figure size 109 to 227 px (by character count); section heading baseline 91 or 144 to 147; count grid tile 84 to 140 px; full-height share 14 to 52 percent of a clip (driven by how many captures and tall diagrams it has); scenes per minute 11.7 to 20.4; product colour replacing the accent on product items (clip35), blue toggles (clip37).

## Open questions

- Why two dark-card fill families (warm #211F1B in 5 clips, neutral #181818 / #1F1F1F / #2A2A2A in clip31, 34, 37)? All three neutral clips redraw the same desktop app, so it may be a per-product skin. More clips of each kind would decide it.
- Highlight strength: 0.55 of the accent in clip29 and clip36, 0.33 to 0.43 elsewhere, and a normal blend over the text in clip30 only. Not tied to date. Is this intended or hand-set per capture?
- Is the clip29 'post' card a real capture or a re-typeset quote? It shows only text, no avatar, handle or platform chrome. The source post would decide it.
- Magnification of captures assumes a 16 px page font. Capturing one of the pages at a known zoom would give the true factor.
- Section heading centre x is 502 in clip38 but 540 to 542 in clip32 and clip33; cause unknown (the layout analyst may see a shifted column).
- Radius of capture cards varies per clip (21, 25, 29, 33, 35, 44). It may scale with the capture's own zoom or be set by hand.

## Needs an eye or an ear

- Type labels and clause categories of all 236 units: open beside the clips.
- Real capture or rebuilt: and (the rebuilt cards use the house font; clip37@365-577 looks like a screenshot at first glance).
- Highlight wipe feel and its timing on the spoken word: play clip29@180-200 and clip30@1085-1175.
- Count-up of figures (7 of 20 by eye): play clip29@539-570, clip33@345-366, clip38@409-430, clip39@223-243.
- Whether the capture scroll in clip29@445-530 and the push-in in clip39@128-137 read as intended moves.
- Third-party logos, mascots and a portrait photo appear in the reference. The style must ship slots, not these assets.
- Illustration styles (3D mascot hook, halftone cut-outs): a person must decide what the style pack offers in their place;
