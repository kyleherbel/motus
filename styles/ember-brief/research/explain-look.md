# Explaining an idea: how the pictures look

What the explanatory pictures look like, measured on the 51 units of the second study (11 clips, 206.6 s of unit time) with a calibrated decode: raw yuv420p planes and an own BT.709 limited-to-full matrix (a white card reads 255,255,255, the field #131311; frame seek checked). Holds of 8 frames or more were found for every unit and the temporal median of a hold was measured at native resolution. For the cut-outs: window FFTs (3,400 windows) for pitch and angle, connected dots for size against coverage, distance transforms for outline and shadow, colour medians for ink, ground and accent. For the diagram parts: coverage integrals, radial profiles and line profiles on 60 shapes.

The house picture until 5 November is a two-tone cut-out: cream ink #F2EEE8 on an opaque ground of the field colour, shaded only by a dot screen, with a hard silhouette, no outline, no shadow and one small accent feature. The screen is not a constant: 11 pictures carry regular round-dot lattices of 3.2 to 11.4 px (median 5.45) at 0, 5, 21, 45 degrees or hexagonal, and 7 of 18 objects are stipple, line or dither textures. What is constant is the dot law (round dots, ink area proportional to tone, dots below half coverage and holes above), the two flat values, and the full tonal range. The two latest clips replace the cut-out with 3D-shaded beige objects. A recipe in plain JavaScript reproduces the measured statistics on generated test objects after a 0.7 Mbit/s VP9 encode: every one of 16 summary statistics falls inside the reference spread.

The diagram parts are flat vector shapes in the same three colours: connectors 9 to 10 px, check discs with a stroke of a tenth of the diameter, tiles with a radius of 0.31 of the side, line glyphs with a stroke of 4 to 5 % of the tile, waveform bars on a fixed pitch. Not done: nothing was watched in playback; source photographs are unknown, so the tone curve is a histogram match; fonts inside chips were not identified; card geometry of the versus, item and person cards was left to the other analysts; the recipe ran in Node, not in a browser.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [R01] Treat the explanatory picture as one of three kinds: a two-tone screened cut-out (the house look until 5 November), a 3D-shaded beige object (6 and 7 November), or a flat vector picture. Everything else is a one-off.

- Values: Of the 51 units: screened cut-out 14 units plus 1 unit of three screened pictures inside cards (6 clips: 29, 30, 32, 33, 34, 35); accent dot-matrix shape 1; 3D-shaded beige 4 (clips 38, 39); flat vector 4 (clips 29, 31, 32, 38) plus 1 card whose icon is swapped (3 flat icons, clip35); pixel-art scene 1; isometric map 1; contour terrain 1; particle field 1; glyph art 1; cartoon figure pair 1; portrait card 1; device screenshots 1; the other 18 units are diagrams drawn by the editor. The first study's 19 'halftone' units split into 14 screened, 1 dot matrix and 4 3D-shaded.
- Evidence: n=51 units, 11 clips; work sheets from clip@frame of every unit ( lists the holds)
- Confidence: high for the counts; kinds named by eye

### [R02] Print each cut-out with a dot screen that belongs to that picture. There is no house pitch and no house angle: use a regular round-dot lattice of about 5.5 px, and expect 3.8 to 8.6 px to stay in family.

- Values: 18 objects in 15 units. Regular lattice: 12 objects = 11 pictures; pitch 3.24, 3.81, 4.04, 4.95, 5.09, 5.45, 6.26, 7.74, 7.97, 8.57, 11.4 px: median 5.45, quartiles 4.5 to 7.9, range 3.2 to 11.4 (error +-0.05 px on strong lattices, +-0.2 px on weak). Angle: 0 deg in 4 pictures, 2 to 5.5 deg in 2 (tilted with the drawn sheet), 20 to 22 deg in 3, 45 deg in 1, hexagonal in 1. Not square in 3: 4.85 x 5.05, 7.78 x 8.15, 7.03 x 8.44 px. Other textures: pixel dither of 2.3 px at 45 deg (1), stipple of equal dots with a ring at 5.9 px (1), engraved lines or fine irregular dots (4).
- Evidence: n=18 objects, 9,094 FFT windows of 64 px; clip30@953-1031, clip30@1449-1500, clip33@451-479, clip33@814-822, clip34@323-369, clip34@425, clip32@696-746
- Confidence: high that the screen varies per picture (11 pictures, 5 clips); medium for 5.5 px as the default

### [R03] Use round dots whose area is proportional to tone: separate cream dots below half coverage, a checkerboard near half, separate dark holes above it.

- Values: Median isolated-dot diameter over pitch at 15, 25, 35, 45 % coverage: 0.42, 0.54, 0.63, 0.67 (n=6 regular screens of 4.9 px and more, 8,771 dots); a round dot of area = coverage x pitch^2 gives 0.44, 0.56, 0.67, 0.76. Share of ink that sits in separate dots: 0.99, 0.93, 0.73, 0.31, 0.18, 0.00 at 15 to 65 %; share of dark that sits in separate holes: 0.01, 0.13, 0.59, 0.92, 0.99 at 45 to 85 %. Mean dot shape: radius on the diagonal over radius on the axis 0.84 to 1.05, median 0.95 (round; 10 objects, 184 to 2,304 dots each). Smallest dots 1 to 2 px^2 (coverage 0.04 to 0.08 of a cell). Coverage against local brightness: slope 1.03 to 1.12, offset -0.01 to -0.04, r 0.990 to 0.9995 (7 objects).
- Evidence: clip30@953-1031, clip33@451-479, clip34@425, clip30@1449-1500, clip32@696-746, clip33@814-822
- Confidence: high

### [R04] Spread the tones of a picture over the whole range, a little dark-heavy: both ends are reached, most of the silhouette carries dots.

- Values: Share of the silhouette per coverage decile (0-10 % to 90-100 %), median of 18 objects: 0.14, 0.11, 0.09, 0.09, 0.08, 0.08, 0.07, 0.07, 0.05, 0.04. Mean coverage median 0.40 (p10-p90 0.19 to 0.65). Solid dark (coverage under 5 %) median 9 % of the silhouette (0 to 63 %); solid ink (over 95 %) median 1.5 % (0 to 52 %); screened area median 86 % (36 to 99 %).
- Evidence: n=18 objects, 6 clips
- Confidence: medium: this is the printed distribution; the source tones are unknown

### [R05] Print with two flat values: cream ink #F2EEE8 on an opaque ground of the field colour #131311. On a card the ground takes the card fill. Greys exist only as dots.

- Values: Solid ink: within 5 levels of #F2EEE8 on 7 of 13 objects that have 400 px or more of solid ink; 6 read darker (#ECE8E4, #EBE7E0, #E2DED9 twice, #DEDAD3, #D4D3CE). Ground inside the silhouette on the field: #12100E to #141410 on 15 of 15 objects (field #131311); on a card #1B1A15 on 3 of 3. The ground is opaque: field-lattice nodes are -1.8 to +0.2 luma levels against the gaps inside solid-dark areas of 4 objects (n=30 to 1,321 node px), and +17 to +43 on the field beside them in the same rows.
- Evidence: clip30@1449-1500, clip32@696-746, clip32@758-837, clip34@425 for opacity; all 18 objects for colour
- Confidence: high for ground colour and opacity; medium for the ink (6 pictures are greyer and the cause is not known)

### [R06] Cut the object out with a hard silhouette and add nothing round it: no contour line, no drop shadow, no glow.

- Values: No outline on 15 of 18 objects (ink share in the first 4 px inside the edge 0.14 to 0.81, i.e. the screen runs to the edge). Field luma outside the silhouette: 18.6 at 4, 8, 16 and 32 px on 15 of 15 objects on the field (18.6 to 22.1 at 2 px, edge blur). Silhouette edge width 10-90 %: median 2.3 px (1.6 to 3.8, n=18); ink edge width inside the picture: median 2.3 px (1.5 to 3.3).
- Evidence: n=18 objects
- Confidence: high

### [R07] Only a cut-out of people gets a sticker outline: a solid cream band about 8 px wide round the whole silhouette.

- Values: 3 objects in 2 units of one clip (two portrait cut-outs, one group): ink share 0.83 to 0.97 at 2 to 4 px inside the edge, 0.80 to 0.82 at 8 px, 0.36 to 0.63 at 12 px, so the band is 8 px (+-1). Colour #F0EEE8 to #F2EEE8. The field within 8 px outside these three reads 16.3 to 17.5 (2 levels under the field), not seen on the 15 objects without outline.
- Evidence: clip30@953-1031, clip30@1201-1237
- Confidence: low: one clip

### [R08] Give a cut-out one accent feature, printed with the same screen in accent ink #FF6B1B; keep it to a few percent of the picture. Pictures of people carry none.

- Values: Accent present on 15 of 18 objects (absent on the 3 people cut-outs). Share of the silhouette: median 2.9 %, range 0.2 to 13.6 % (n=15). Flat accent parts read #FF6B1B (dot-matrix dots sd 4.9/2.8/5.6; overlaid check disc sd 2.1/1.1/2.5). Screened accent parts read #E35912 to #FD6B1B with 25 to 87 % of the region in accent ink (5 objects: a button, a shackle, a lock body, a rope, a lens rim). The synthetic test shows the same loss from 4:2:0 chroma: #FE6B1B before the encode, #E85F20 to #ED601E after.
- Evidence: clip30@700-712, clip33@451-479, clip32@696-746, clip30@1535-1624, clip33@814-822, clip29@614-628, clip32@904-961
- Confidence: high for the colour, medium for the share

### [R09] Bake the screen into the picture at its final size and move the layer; never lock the screen to the frame. Let the entrance blur hide the dots while the picture travels.

- Values: Per-picture lattices (R02); three pictures in one frame carry 5.09, 7.7 and 3.24 px lattices, two of them tilted 2 to 5.5 deg with their sheet (clip34@323-369). Between holds the picture does not move: shift 0,0 px, correlation 0.997 to 0.999 at full resolution (3 pictures; 0.935 on one whose overlay changed). During an entrance the dot content correlates 0.00 to 0.21 with the settled frame and is at 2 to 23 % of its contrast until the first settled frame, where it is 1.0 (3 entrances); on exit it drops from 1.0 to 0.02 within 2 frames (1 exit).
- Evidence: clip34@224-369, clip30@1052-1237, clip32@686-752, clip30@1290-1314, clip33@428-484, ( halftone.lock holds the between-hold table)
- Confidence: medium: no cut-out was found moving while sharp, so the lock is inferred from the lattices

### [R10] Size a cut-out to fill the graphic zone: in the split layout up to 967 x 776 px, centred near x=543, bottom edge no lower than y=856.

- Values: Split layout, 18 picture boxes (14 screened, 4 3D-shaded): width median 718 px (275 to 967), height median 486 (256 to 776), centre x median 543 (521 to 701), centre y median 440 (224 to 630), top median 161 (27 to 404), bottom median 780 (421 to 856). Full layout, 2 boxes: 925 x 508 above a capture card (top 236) and 880 x 690 below one (top 500). Boxes from code on the screened objects (+-2 px), by eye on the 4 3D-shaded ones (+-10 px).
- Evidence: 
- Confidence: medium for split; low for full (n=2)

### [R11] Synthesis recipe for a user's photo or icon: (1) scale it to its size on the frame; (2) matte from alpha, or key the plain background; (3) Rec.709 luma inside the matte; (4) tone curve by histogram specification onto the measured coverage distribution, mixed 0.85 with a 2-98 % stretch, coverage under 0.04 to 0 and over 0.96 to 1; (5) threshold against the spot function s = 0.5 + 0.25(cos 2 pi u + cos 2 pi v), with the threshold taken from the quantiles of s so that ink area equals tone, at 3 x 3 samples per pixel; (6) ink #F2EEE8, or #FF6B1B inside the accent mask, over opaque #131311; (7) optional 8 px cream outline for people; (8) Gaussian soften of 0.55 px.

- Values: Defaults: pitch 5.5 px, angle 0 deg, tone table (cumulative share of the silhouette at coverage 0.1 to 1.0) 0.171, 0.305, 0.416, 0.524, 0.623, 0.718, 0.809, 0.893, 0.956, 1.0; minimum dot 0.04; supersample 3; soften sigma 0.55 px (0 gives an edge of 1.2 px, 0.5 gives 1.9, 0.6 gives 2.5, reference 2.3). The code is a pure function on an RGBA array as returned by canvas getImageData; a 420 x 420 px object takes 44 to 60 ms in Node 24.
- Evidence: scripts/halftone_recipe.mjs; build_spec.cutout_look and recipe_test.soften_scan_px
- Confidence: medium: it reproduces the measured statistics (R12); it is one screen where the reference has many

### [R12] The recipe, applied to a generated sphere, cube, cylinder and grey ramp and passed through a 0.7 Mbit/s VP9 encode, lands inside the reference spread on every screen statistic measured.

- Values: 9 test objects (3 objects x 3 screens: 5.5 px at 0 deg, 5.45 px at 21.8 deg, 8.6 px at 0 deg) against 18 reference objects, median [p10-p90]: pitch asked 5.5 / 5.45 / 8.6, measured 5.50 / 5.41 / 8.58; ink edge 2.46 px against 2.28 [1.75-3.02]; silhouette edge 2.33 against 2.35 [1.73-3.29]; mean coverage 0.44 against 0.40 [0.19-0.65]; solid dark 0.05 against 0.09 [0.00-0.33]; solid ink 0.03 against 0.015 [0.00-0.15]; screened share 0.92 against 0.86 [0.60-0.95]; all 10 tone deciles inside the reference p10-p90. Dot diameter over pitch at 15, 25, 35, 45 %: 0.42, 0.58, 0.68, 0.74 against 0.42, 0.54, 0.63, 0.67. Ramp: coverage = 1.03 x tone - 0.02, rmse 0.008 to 0.012 (reference objects 1.03 to 1.12, -0.01 to -0.04). Still different: the recipe switches from dots to holes exactly at 50 % (isolated-hole share at 55 %: 0.68 against 0.13); its lattice is perfect where the reference drifts; flat ink reads 4 levels low after this test encode.
- Evidence: 
- Confidence: medium: a statistical match on synthetic objects; nobody has looked at it beside the reference in motion

### [R13] A held dot screen survives this bitrate untouched; it is the travel blur, not the codec, that removes it. Keep the pitch at 4 px or more for the chroma of accent dots, not for the luma.

- Values: Reference: a mid-tone patch differs from the hold median by 0.0 to 0.3 luma levels rms on every frame after the first settled one (4 holds of 43 to 98 frames; one refresh step of 4.7 levels in 2 of them). Synthetic: patch contrast after/before a 674 to 733 kbit/s libvpx-vp9 encode 0.993 to 1.006 at pitches 3.0, 4.0, 5.45, 5.5 and 8.6 px; lattice peak kept at all five. Small accent dots never read as the full accent: core colour before -> after the encode #FE6B1B -> #E96020 at 5.5 px, #F5671B -> #DA5D1F at 4 px, #E7621A -> #CE581D at 3 px. Measurement error at this bitrate: pitch +-0.05 px, flat fills +-1 to 2 levels, single dots +-4 to 8 levels, dot diameter +-0.5 px, strokes of 4 px and more +-0.3 px.
- Evidence: clip30@922-1031, clip33@425-479, clip30@689-768, clip32@677-746
- Confidence: medium: the test encoder is not the reference's encoder

### [R14] A quantity shape (a star that fills) is a dot matrix drawn in code, not a picture: accent dots on a 10 px grid locked to the frame, large on the rim and small inside.

- Values: Pitch 10.00 px in x and y (fit coherence 0.98 and 0.99, 844 dots), nodes on multiples of 10 px (centres at 10k - 0.5). Dot diameter 3.6 to 8.2 px (p10 3.9, median 5.1, p90 8.2). Colour #FF6B1B flat. Shape box 468 x 447 px. Same construction as the field's 12 px lattice.
- Evidence: clip29@614-628 (1 unit)
- Confidence: low: one unit

### [R15] In the two latest clips the cut-out is a 3D-shaded beige object instead: smooth shading, soft dark contour lines, no dot screen, still one accent part and still no shadow on the field.

- Values: 4 units in clips 38 and 39 (6 and 7 November). Palette (k-means, 7 clusters per picture): lights #EDE7DC to #E5DDCD, mids #D8CCBA to #B6AB96, shades #AA9B86 to #7C7568, darks #5D5953 to #403D35; accent part #E66224 to #F47A32 (shaded, not flat). Contour lines 3 to 6 px, #746A5A to #595349 (one profile across one object). Boxes 700 to 950 px wide, 370 to 740 high.
- Evidence: clip38@713-750, clip38@861-900, clip39@98, clip39@388
- Confidence: medium: two clips; 'no screen' is by eye at 2x

### [R16] A flat vector picture uses flat accent, cream and dark shapes with no contour lines; shapes are separated by 5 to 7 px of ground and details are round-ended bars.

- Values: 4 units in 4 clips plus 3 icons shown one at a time in a large card (clip35). Fills: #FF6B1B flat (sd 5/2/4), #F2EEE8, #292723, #0F0E0B; look-alike tiles in beige #E1D9CD (105 x 70 px, radius 20) with one accent tile. Icon in a card: 421 x 585 px accent sheet with 6 text bars 23 px high, round ends, 50 px pitch, #1A1814. Machine: 17 px slats with 7 px gaps.
- Evidence: clip32@253-300, clip29@1122-1199, clip38@242-300, clip31@822-853, clip35@558
- Confidence: medium: recurs in 5 clips, each drawing is different

### [R17] Treat the pixel-art scene, the isometric map and the contour terrain as one-off pictures: same palette, their own line weights.

- Values: Pixel art (clip38): pixel unit 9 px (runs of 18, 36, 54 px), #211F1B, #F2EEE8, #F8F8F8, #A39E90, #FE6B1B, tick #3FBF74; chips with an 8 px stepped outline. Isometric map (clip37): blocks #1D1A15, #23201B, #332F2A, route 10.6 px accent, small screened objects on dark rounded tiles. Contour terrain (clip36): accent contours 3.0 px (16 crossings, 15 px apart), grey contours equal to a 2.5 to 3 px line of #2E2E2C to #4C4C4A, people markers #A49E90.
- Evidence: clip38@1149-1200, clip37@319-361, clip36@644, clip36@727
- Confidence: low: one unit each

### [R18] Draw a connector as a solid accent line 9 to 10 px wide with round ends; when it joins two tiles, cut it for a 75 px check disc in the middle.

- Values: Stroke 9.0 px (curve between cards, clip31), 10.0 px (row between two tiles, clip35, drawn in that video's product colour #E451BC), 10.6 px (route on the map, clip37): n=3 in 3 clips. Ends rounded (by eye at 2x). End disc at least 26 px wide in accent (half hidden by a card). Row: two 69 px segments either side of a 75.6 px disc (#2F7C4F) with a 6.0 px cream check.
- Evidence: clip31@672-704, clip35@1102-1144, clip37@319-361
- Confidence: medium: three instances in three clips

### [R19] Draw a path that is travelled as dashes or dots in the accent: dashes 22 px long, 7 px wide, 8 px apart; dots 7 px on an 18 px pitch; a pair of signal waves as 6.4 px dots on a 9.6 px pitch.

- Values: Dashed climb: 16 dashes, length 21.9 px (21.7 to 22.9), width 6.9 to 7.1, gap 8.0, pitch 29.9 (clip36). Dotted arc between a card and a phone: 24 dots, diameter 7.2 px (7.0 to 7.4), pitch 17.9; end disc with accent core 18 to 22 px and cream ring to 29 to 32 px (clip37). Dotted waves: 31 cream and 54 accent dots, diameter 6.4 px (4.1 to 7.2), pitch 9.5 to 9.7 (clip30). Dashed drop lines inside a card: 8 px on, 7 px off, 2 to 3 px wide (clip33).
- Evidence: clip36@727, clip37@210, clip30@953-1031, clip33@652-660
- Confidence: low: each pattern seen once

### [R20] A pipe is a dark banded tube 66 px wide with a 4 px cream outline, bends of 103 px centre radius and accent collars.

- Values: Outline to outline 66.1 px; outline 4.0 and 4.1 px, #F2EEE8; five bands 10, 12, 10, 12, 10 px at luma 24, 34, 55, 34, 26; bend outer radius 133.2 px (fit rmse 0.2), inner 72.1; collars 85 x 27 and 83 x 21 px, radius 12, #FF6B1B.
- Evidence: clip34@609-687 (1 unit)
- Confidence: low: one unit

### [R21] A check disc is a flat accent disc with a cream check whose stroke is a tenth of the diameter, round caps and joins.

- Values: Diameters: 58.3 px (5 in a row, 125 px apart, clip39), 140 px (inside a phone outline, clip32), 146 to 148 px (on a cut-out, clip32), 75.6 px in green #2F7C4F on a connector (clip35). Check stroke 5.7, 14.9 and 6.0 px = 0.098, 0.102 and 0.079 of the diameter; check box 27 x 21 px on the 58 px disc. Fill #FF6B1B (sd under 3), check #F2EEE6 to #F6ECE1.
- Evidence: clip39@452-491, clip32@381-441, clip32@904-961, clip35@1102-1144
- Confidence: medium: 8 discs in 3 clips

### [R22] State badges are discs of 100 to 200 px laid on the corner of a picture: accent with a dark line glyph, dark with a thin light ring, or a red ring with a cross.

- Values: Lock badge: 103 px accent disc, dark padlock outline of 5.5 px. No-network badge: 192 px, fill #211F1B, 4 px light ring, cream arcs 9 to 12 px, accent slash 12 to 14 px. Cross badge: 197 px, ring 17 px of #E4494C, inside tinted red at about 0.3, cross of the same red.
- Evidence: clip30@1535-1624, clip30@1449-1500, clip38@713-750
- Confidence: low: each once

### [R23] Icon tiles and logo tiles are rounded squares with a radius of 0.31 of the side, in cream, dark or accent.

- Values: Sides and radii: 105 / 33.4 (3 tiles, clip33), 113 / 35.8 (cream x2 kinds, accent, clip39), 116 / 37.5 dark #211F1B (clip39), 117 / 34.5 (clip36), 151 / 46.5 (clip35): radius over side 0.295 to 0.326, median 0.317 (n=6 measurements, 4 clips). Smaller accent tiles: 89 px, radius 23 (0.26, 4 tiles, clip33); clip chips 85 x 61, radius 17 (7 chips, clip33). Fills #F2EEE8, #211F1B, #FF6B1B.
- Evidence: clip33@235, clip39@452-491, clip36@199-246, clip35@1102-1144, clip33@712-749
- Confidence: medium

### [R24] Draw glyph icons as single-weight line icons with round caps and joins and no fill: stroke 4 to 5 % of the tile side, glyph box 41 to 51 % of the tile.

- Values: Stroke 5.0 px on a 113 px cream tile (2 glyphs), 4.5 px on the accent and dark tiles, 5.5 px on a 103 px badge, 9 to 12 px on a 192 px badge: 0.040 to 0.064 of the container (n=6 glyphs, 2 clips). Glyph box 58 x 48 and 34 x 46 px on 113 px. Check marks and the refresh arc are heavier: 0.08 to 0.10 of the diameter (R21; refresh arc 10 px on 98 px). Colours: #1E1A15 on cream, #F0EFEA to #F5EDE5 on dark and on accent. One solid glyph: the person silhouette in a 140 px avatar disc (#49463D).
- Evidence: clip39@452-491, clip30@1535-1624, clip30@1449-1500, clip32@381-441, clip30@442
- Confidence: medium: weights measured, cap and join style by eye at 3x on 11 glyphs

### [R25] Chips are dark or accent rounded boxes without shadow: a speech bubble with a 3 px light outline, accent value and price chips, a thin accent status bar.

- Values: Speech bubble 254 x 143 px, radius 65, fill #211F1B, outline 2.7 to 3.3 px #CCCCC9 to #DDDCD7 (clip30). Value chip with pointer 253 x 148, radius 27, #FF6B1B; dark value chip 130 x 97, #211F1B (clip36). Price chip 271 x 184 to 200, radius 49, #FF6B1B (clip30). Status bar 426 x 17 px accent (clip37); progress bar 622 x 9 (clip33). Pixel-style check chips 241 x 141 with an 8.0 px cream outline, stamp chip 331 x 141 with an 8.0 px accent outline (clip38).
- Evidence: clip30@748, clip36@727, clip30@1449-1500, clip37@319-361, clip33@235, clip38@1149-1200
- Confidence: low: one instance per chip kind; radii +-3 px

### [R26] Time is shown with a calendar tile, a refresh mark and an outline phone: dark tile 301 x 345 with a 64 px header band, accent arc of 10 px, phone outline of 6 px.

- Values: Calendar tile: 301 x 345 px, radius 38, 4.0 px stroke #484642, header band 64 px #48453F, body #211F1B, month text #F2EEE8. Refresh mark: 98 px across, stroke 10.0 px, #FF6B1B. Phone outline: 400 x 668 px, stroke 6.0 px #A29E93, fill #1B1A15, with a 140 px check disc inside.
- Evidence: clip32@381-441 (1 unit)
- Confidence: low: one unit

### [R27] Draw a waveform as vertical bars on a fixed pitch: 3.9 px bars every 6.15 px in a player, 6 px bars every 10 px on a timeline; played bars cream-white or accent, unplayed bars dim grey.

- Values: Player (clip30): width 3.9 px (3.7 to 4.1, n=38 cream; 3.9, n=45 accent), pitch 6.15 px, colours #FAF8F4 and #FF6B1B, unplayed #595753, on a 962 x 235 px pill of #211F1B (radius 102) with a 3 px centre line. Timeline (clip39): width 6.0, gap 4.0, pitch 10.0 px, 60 bars, #FF6B1B on #1B1A15. Diagram card (clip33): bars 2 to 4.7 px on a 6.2 px pitch, #F2EEE8 on #292723.
- Evidence: clip30@442, clip39@590, clip33@652-660
- Confidence: medium: three clips, three sets of numbers

### [R28] A playhead is a vertical line across the tracks: light and 4 px wide with a 17 px dot on top in a player, accent and 6 px wide on a timeline. Selections are accent tint bands.

- Values: Player: line about 4 px, #9B9995 (cream at about 0.6), y 564 to 1114 across both tracks, dot 17 px #F9F8F5 on top. Timeline: accent line 6.0 px, 469 px tall. Tint bands 40 and 52 px wide with round ends, #6D3A1A on the pill and #643214 on the field (accent at about 0.34). Slider knob 79 x 13 px accent on a 43 px track of #49453F.
- Evidence: clip30@442, clip39@590, clip33@652-660
- Confidence: low: one instance each

### [R29] A film strip is a near-black band with two rows of light sprocket holes and frames outlined in the accent; clips are small accent chips, frames small light thumbnails.

- Values: Strip 872 x 150 px, #100E0B; holes 14 x 10 px every 26 px, 33 per row, #D6D4D0; frames 137 x 82 px, outline 4.4 px #FF6B1B, 3 px apart. Clip chips 85.1 x 61.1 px, radius 17, #FF6B1B (7 chips in 2 scenes of one clip). Frame thumbnails 185 x 105 px, radius 19, 200 px pitch; the active one sits in an accent outline of 200 x 120 px.
- Evidence: clip33@652-660, clip33@235, clip33@776-823, clip39@590
- Confidence: low: strip once, chips in one clip

### [R30] Stack a big figure and its picture on the centre axis with 30 to 80 px between them; the figure may sit above or below.

- Values: 5 figure-and-picture pairs in 3 clips: gap 30, 30, 41, 71 and 80 px (figure ink box to picture box, +-6 px; the two 30 px gaps are measured from comma tails, 55 px from the baseline), median 41. Figure above the picture in 4, below in 1. A row of two wordmark tiles sits 102 px under a picture (1). Centre x of figure 540 to 542, of picture 534 to 622 (the picture shifts aside when a logo tile stands beside it). Figure box heights 147 to 201 px.
- Evidence: clip29@614-628, clip29@901-949, clip33@366-424, clip33@451-479, clip39@98
- Confidence: medium

### [R31] Lay product chips and badges over the edge of the picture, never beside it at a distance: a wordmark tile on the top-left corner or between two cut-outs, a badge on the top edge, a price chip on the bottom-left corner.

- Values: Wordmark tile 233 x 117 px in 4 units of one clip: centred between two cut-outs (overlapping the picture box), 19 px above the top-left corner, on the left edge at 21 % of the height. Badge centres at 45 to 63 % of the width and 7 to 10 % of the height of the picture box (2 badges, 103 and 146 px). Price chip centre at 6 % of the width and 87 % of the height (overlaps the bottom-left corner). Logo tiles of 105 to 131 px stand right of the picture top in clips 33, 34 and 39 (by eye).
- Evidence: clip30@953-1031, clip30@1201-1237, clip30@1535-1624, clip30@1449-1500, clip32@904-961
- Confidence: medium for overlap; low for exact positions

### [R32] Do not add to an explanatory picture: gradients on diagram parts, shadows or glows round cut-outs, a second accent hue, contour lines round screened objects, or a frame-locked screen.

- Values: Checked: field luma round 15 cut-outs flat at 18.6 from 4 px out (R06); accent fill median #FF6B1B to #FF6C1D on 19 of 19 measured accent parts (no gradient step over 2 levels); saturated colours other than the accent only as product colours (#E451BC line and tile in clip35, #2F7C4F and #3FBF74 for a done state in clips 35 and 38, #E4494C for a failed state in clip38); 0 of 18 screened objects with a drawn contour except the 3 people cut-outs (R07).
- Evidence: 
- Confidence: medium: absence checked on the measured parts only

## Constant and variable

CONSTANT (every screened cut-out, 18 objects, 6 clips): two flat values with an opaque ground equal to the field (#131311) or the card fill; round dots with ink area proportional to tone; hard silhouette, no shadow, no glow; accent ink #FF6B1B when an accent is present; screen fixed to the picture. CONSTANT (diagram parts): accent #FF6B1B, cream #F2EEE8, dark fills #211F1B / #1B1A15 / #292723, no gradients; tile radius 0.31 of the side; check stroke 0.08 to 0.10 of the disc.

VARIABLE: screen pitch 3.2 to 11.4 px and angle per picture (cause: each picture is made separately); screen type (12 regular, 1 dither, 5 stipple or line); ink brightness #F2EEE8 to #D4D3CE (6 pictures greyer); tone balance, mean coverage 0.19 to 0.65; accent share 0.2 to 13.6 % of the picture; sticker outline only on people (one clip); picture box 275 to 967 px wide by content; connector stroke 9.0 to 10.6 px; disc and tile sizes by role (58 to 197 px). OVER TIME: screened cut-outs 2 to 5 November (clips 29 to 35, 16 units), 3D-shaded beige objects 6 and 7 November (clips 38, 39, 4 units); clip37 (6 November) keeps two small screened objects on map tiles.

## Open questions

- Where do the cut-out pictures come from? Irregular lattices, lattices up to 17 % off square and stipple textures suggest each picture was generated or bought separately, not filtered by one tool. The creator's asset files would decide it.
- Which screen should the style ship: one regular screen (5.5 px, 0 degrees, as in the recipe) or a small set (regular, hexagonal, stipple) chosen per picture? The reference supports both readings.
- Is the change to 3D-shaded beige objects on 6 November a new look or a choice for those two topics? Clips published after 7 November would decide it.
- Six pictures print 6 to 30 levels darker than #F2EEE8. Dot gain in the source picture or a different paper tone? A solid highlight of 20 px or more in those pictures would decide it; none exists.
- The field within 8 px of the three people cut-outs reads 2 levels under the field. A soft dark rim, or ringing beside the cream outline? An outlined cut-out on a flat field at a higher bitrate would decide it.
- The dots-to-holes switch is spread over 45 to 70 % coverage in the reference and sharp at 50 % in the recipe. A spot function with some round-dot growth (touching at 60 to 65 %) may fit better; not tested.

## Needs an eye or an ear

- Open and: does the recipe read as the same family as the reference crops at phone size?
- Open: decide whether a strictly regular screen is acceptable, given that the reference mixes regular screens, stipple and engraving.
- Watch a rendered entrance of a recipe cut-out: the reference hides the dots with a blur until the settle frame; check that no shimmer shows at 5.5 px.
- Open: confirm the 8 px cream outline belongs to people cut-outs only, and decide whether the style wants it.
- Open: confirm round caps and joins on the glyphs before an icon set is drawn.
- Open: confirm that the 3D-shaded objects carry no dot screen (judged by eye at 2x).
