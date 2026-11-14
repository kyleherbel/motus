# Explaining an idea: the devices

Measured: the 51 graphic units that the first study filed as illustrations and diagrams, in all 11 in-style clips (196.7 s of 426.6 s; 45 scenes, because 6 units are parts of another unit's scene). Every frame of the 11 clips was decoded at 1080x1920 and differenced against the previous one (dot lattice masked, 24 px blocks); bursts of change inside each unit were located and each event was timed (first and last changing frame) inside a hand-placed rectangle. 117 events and 51 anchors were then joined to transcript word onsets and, as a second clock, to the caption cut of the same word. Composition and accent were measured on native frames, idle motion with an affine fit over each final hold. Every unit was looked at on every-other-frame sheets of its bursts plus one frame per verified-still hold.

Findings. The brief is right for most units and wrong for some: 35 of 45 scenes are an anchor plus events (median 2, typical 1 to 5), but 7 are still pictures and they are used only for nouns and states. An event starts on the onset of the word that names it (median -0.4 f, 76 % within 5 f, n=80) and is complete 10 f later; the anchor starts 4 f after the first word of its clause and 11 f before its own noun. The naming word is a noun, verb or number in 60 of 80 cases and is the median 4th word of its clause. 48 events change the state of something already on screen, 45 add the next element, 16 draw or travel. The finished picture then holds a median 51 f, still. 26 devices were named; 14 reach 3 or more clips. 26 units (53 % of the seconds) can be drawn from parameters, 15 more need one supplied cut-out picture, 10 are bespoke drawings.

Not done: nothing was watched in playback or listened to. Ideas, kinds, devices, metaphor or diagram, generic or bespoke, the word each event belongs to, action classes and accent roles were judged by eye and by reading, by one coder. Word onsets are faster-whisper estimates (+-2 f), not forced alignment; the demo with two overlapping voices is unreliable. Easing curves of the events were not fitted (the first study's curves are assumed). Internal geometry of the devices (stroke widths, chip sizes, type) was not measured, except badge boxes and content boxes. Whether events carry sound effects was not examined. One event (clip37@273-283) is timed by eye because the map moves under it.

## Rules

Each rule: what to build, the numbers (median, range, n), the evidence (clip@frame), and the confidence.

### [X01] Build every explanatory graphic as an anchor that is drawn first, followed by events that each act out one spoken word; plan 1 to 5 events (median 2).

- Values: 45 scenes (51 units, 11 clips). Events after the anchor per scene: median 2, range 0 to 10; counts 0:10, 1:9, 2:9, 4:7, 5:6, 6:1, 8:2, 10:1. Without the 4 demo players and 2 call-to-action cards (n=39): 0:7, 1:9, 2:9, 4:6, 5:6, 8:1, 10:1. 117 events in all. No scene has exactly 3 events (taken as chance).
- Evidence: ; every unit
- Confidence: high (events timed by code on every frame; what counts as one event is by eye)

### [X02] A still picture with no event is allowed only for a noun or a state; never show a process, a connection, a route, a repetition, a step sequence or an alignment as a still.

- Values: 10 of 45 scenes have no event after the anchor: 7 still pictures (clip32@683-746, clip32@747-837, clip34@370-437, clip36@72-136, clip38@227-311, clip39@47-107, clip39@328-397), 2 call-to-action emblems, 1 recap player. Their ideas: access 1, quantity 2, example 1, comparison 2, a thing named 1. Units of the kinds process, connection, change of state, route, repetition, steps, alignment, enumeration: 0 of 25 are still.
- Evidence: (n_events=0), strips/, strips/
- Confidence: medium (idea kinds labelled by eye; 7 stills in 5 clips)

### [X03] Ship the explanatory devices in this order of reach: cut-out picture slot, count-up figure, badge that lands, pair comparison, item-per-noun build, outline mark, link, interface enactment, process enactment, quantity picture that fills, demo playback.

- Values: cut-out picture: 19 units, 9 clips, 63.2 s; count-up figure: 9 units, 6 clips, 38.5 s; badge lands: 9 units, 6 clips, 40.9 s; pair comparison: 7 units, 6 clips, 28.2 s; item-per-noun build: 6 units, 5 clips, 26.7 s; outline mark: 5 units, 5 clips, 23.3 s; link: 5 units, 5 clips, 22.0 s; interface enactment: 5 units, 4 clips, 22.4 s; process enactment: 5 units, 4 clips, 24.4 s; quantity picture (fills): 4 units, 4 clips, 13.2 s; demo playback: 4 units, 3 clips, 28.7 s; one-among-many grid: 3 units, 3 clips, 10.1 s; name chips: 3 units, 3 clips, 12.4 s; quantity picture (still): 3 units, 3 clips, 7.7 s. 26 devices named in all; 12 of them appear in 1 or 2 clips. A unit carries 1 to 4 devices (median 2).
- Evidence: , (devices column); device_definitions
- Confidence: medium (device names and assignment by eye, one coder)

### [X04] Choose the device from the kind of idea in the clause, using the decision table in build_spec.idea_to_device.

- Values: Primary device per idea kind (units): quantity (7): count-up figure 4, one-among-many grid 1, cut-out picture 1, quantity picture (fills) 1; process (7): process enactment 4, cut-out picture 2, item-per-noun build 1; comparison (5): pair comparison 4, one-among-many grid 1; a thing named (5): call-to-action emblem 2, cut-out picture 2, person card 1; change of state (5): cut-out picture 3, demo playback 1, interface enactment 1; connection (4): link 3, pair comparison 1; access (4): cut-out picture 3, swap in place 1; demonstration (3): demo playback 3; alignment in time (3): alignment lines 2, item-per-noun build 1; enumeration (2): item-per-noun build 1, swap in place 1; route / journey (2): route 2; sequence of steps (1): guided pan 1; time and repetition (1): clock loop 1; example (1): cut-out picture 1; comparison on a scale (1): pinned value chips 1
- Evidence: 
- Confidence: medium for kinds with 4 or more units (quantity, process, comparison, connection, access, change of state, a thing named); low for the rest

### [X05] Start the anchor about 4 frames after the first word of the clause that carries the idea; that clause is the start of the sentence in only 6 of 10 scenes.

- Values: Anchor first visible minus onset of the clause's first word: median +3.6 f, p10 -0.6, p90 +16.3; 82 % between -6 and +12 (n=45 scenes). 28 scenes open a sentence (anchor +4.0 f after its first word, 61 % within -3 to +6); 17 start at a later clause of a running sentence. Against the first word of the sentence over all 45: median +11.6 f, only 38 % within -3 to +6.
- Evidence: (anchor_minus_* columns), (lower panel)
- Confidence: medium (word onsets from a machine transcript, +-2 f; clause boundaries by reading)

### [X06] Let the anchor lead the word that names it: it starts about 11 frames before that word and has finished building about when the word is spoken.

- Values: Anchor start minus named-word onset: median -11.4 f; 67 % lead by more than 6 f; latest +2.0 (n=45). Anchor build (first visible to settled, including a blurring-out predecessor): median 16 f, p10 12, p90 24, range 7 to 31. Anchor settled minus named word: median +5.8 f.
- Evidence: , (kind=anchor)
- Confidence: medium

### [X07] Start each event on the onset of the word that names it: on time or up to 8 frames early, not more than 4 frames late (latest seen +7.8); it is complete about 10 frames after the onset.

- Values: Event start minus named-word onset: median -0.4 f, p10 -7.6, p90 +4.0; within 3 f: 61 %, within 5 f: 76 %, within 8 f: 91 %; latest +7.8 (n=80 events with a word of their own, 11 clips). Against the caption cut for that word (video clock): median -1.0 f, 60 % within 3 f. Complete minus onset: median +10.3 f (p10 +2.0, p90 +17.0). 61 events are within 5 f of their word, 12 come at the start of their clause ahead of the word, 7 are 5.6 to 11.8 f early.
- Evidence: (start_minus_named_word), (upper panel), (white ticks)
- Confidence: high for the central value (80 events, 11 clips); medium for the tails (+-2 f transcript error; which word names an event is by reading)

### [X08] Key an event to the content word, not to the start of the clause: the noun that is shown, the verb that is enacted, the number, the adjective or the negation.

- Values: Role of the named word (n=80): noun 31 (median offset -0.4 f, 71 % within 3), verb 19 (0.0, 53 %), number 10 (-0.7, 70 %), adjective 9 (+1.4, 22 %), name 4 (+1.9), negation 3 (-1.4), other 4 (+0.4; for these the word was taken as the one being spoken). The named word is the median 4th word of its clause (p10 2nd, p90 7th); it is the first word in 1 of 79.
- Evidence: (word_role, named_word_position_in_clause)
- Confidence: medium (roles by reading; adjectives are few and loose)

### [X09] When a transformation must be visible before its word is finished (a swap, a route, a restyle, a new block), start it on the first word of its clause instead.

- Values: 12 of 80 events start within -6 to +12 f of their clause's first word and 5.6 to 43 f before the naming word: swap to an open padlock (clip33@425, 43 f before the noun), second screen of a before/after pair (clip29@347, -15 f), cross badge (clip38@705, -10 f), fix-and-restyle (clip38@1133, -10 f), route starts (clip36@668, clip37@283), peak rises (clip36@448), strip and speaker of the player (clip33@167).
- Evidence: (trigger = on the clause start), sync.trigger_clause_list
- Confidence: low to medium (12 events in 7 clips; the choice between the two triggers is not predictable from the data)

### [X10] Parts with no word of their own follow the previous part by about 6 frames; rows stagger by 4 to 5 frames; a loop repeats every 11 to 12 frames.

- Values: 37 of 117 events have no word: 9 follow-ons (delay to the previous start: median 6 f, range 3 to 19, n=23 gaps with cadence steps, demo players left out), 11 loop steps, 17 inside demo media. List rows: starts 689, 693, 698, 703 (clip37). Calendar flips: starts 318, 330, 342, 352, 363 (period 12, 12, 10, 11); a row is removed 7, 7, 6, 8 f after each flip (clip32). Check on a link: 7 f after the second node (clip35@1070). Chip beside waves: 3 f (clip30@942). Red X on a verdict chip: 2 to 4 f after the chip (clip38, by eye).
- Evidence: (trigger = delay / cadence), extra.calendar_flip_period, list_row_stagger
- Confidence: medium (few instances of each)

### [X11] Space events that have their own word by the speech: the next one starts a median 18 frames after the previous, and not closer than 9 frames unless both show the same thing.

- Values: Gap between consecutive event starts when the next event has its own word: median 18.5 f, p10 9, p90 47, max 116 (n=46). 25 of 82 consecutive pairs overlap in time; in all 25 the two events belong to one idea (count and fill, tile and its mark, pin and its picture; by eye).
- Evidence: (order_of_parts)
- Confidence: medium

### [X12] Leave the anchor alone for a moment: the first event starts a median 26 frames after the anchor first shows, 10 frames after it has settled.

- Values: First event start minus anchor first visible: median 26 f, p10 11, p90 76, range 8 to 114. Minus anchor settled: median 10 f, p10 0, p90 58 (n=35 scenes with events). The gap is set by where the first named word falls, not by a constant.
- Evidence: 
- Confidence: high for the range, low for any single value

### [X13] Give an event about 11 frames from first change to settled: 12 for an element that is added (the standard blur entrance), 9 for a change of state, 1 to 4 for an outline, a dim or a stop.

- Values: Frames from start to complete: all events median 11, p10 4, p90 17 (n=117). Adds an element: median 12, range 6 to 20 (n=45). Changes a state: median 9, range 1 to 23 (n=48). Draws or travels: median 10, range 2 to 32 (n=16; pans 31 and 32 f, routes 21 and 27 f, line draws 9 to 14 f). Winner outline 1 f (clip35@857); dim 4 f (clip35@252-255); cost figures brighten 3 f (clip35@883-885); outline box 7 f (clip29@329-335); icon morphs 16, 18, 21, 16 f (clip35).
- Evidence: (frames, action_class)
- Confidence: high (code, every frame)

### [X14] Finish the events a little after the middle of the scene and hold the finished picture about 51 frames (1.7 s) until the next sentence takes over; plan no hold under 40 frames.

- Values: Last event complete to exit start: median 51.0 f, p10 40, p90 68, range 6 to 91 (n=31 scenes without demo players and call to action); the two values under 30 are a bubble whose bars keep moving (clip30@755, 14 f) and a strip that stays for the recap (clip33@877, 6 f). Still pictures: settled to exit median 53.5 f, range 46 to 82 (n=8). The last event completes at a median 56 % of the scene (p10 35 %, p90 78 %). Scene length: median 111.5 f, p10 68, p90 186; longest 404 f (terrain) and 475 f (demo).
- Evidence: (hold_after_last_event, scene_frames), (red marks)
- Confidence: high

### [X15] Classify every event as a change of state, an added element, or a line or token that moves between elements, and give a scene at least one change of state where the idea has one.

- Values: 117 events: changes the state of something already on screen 48 (badge lands on it, it fills, flips, morphs, is struck, outlined, dimmed, relabelled), adds the next element 45 (next card, row, chip, figure, node), draws or travels between or along elements 16, inside demo media 8. 27 of 45 scenes contain a change of state; in 20 of 35 scenes with events the last event is one.
- Evidence: (action_class), (orange = state)
- Confidence: medium (classes by eye)

### [X16] Run a count-up figure across its number word: start on the onset (or up to 7 frames before), run 13 frames, end about 11 frames after the onset; let the quantity picture fill on the same clock.

- Values: 13 number events in 6 clips (6 count-ups, 3 figures that land, 3 numeric chips, 1 particle field): start minus number-word onset median -0.8 f (range -7.2 to +5.2); complete minus onset median +11.2 f (+5.8 to +15.2); length median 13 f (11 to 16). Star fills 558-568 while the figure counts 555-568 (clip29); mosaics populate 767-778 while the figure counts 766-778 (clip35); a grid populates first (669-692) and its figure lands after (695-707, clip33); particles first, figure 7 f later (clip39@225, 232).
- Evidence: (word_role=number), extra.number_events, strips/, strips/
- Confidence: high for the length and the lock to the number word; medium for the fill rule (4 units)

### [X17] Show the number that is spoken; "over N" becomes "N+"; an exact source value may replace a rounded spoken one; do not put unspoken numbers on screen except as the running values of a comparison.

- Values: 12 spoken numbers on screen: 10 identical to speech ('over N' is written N+), 2 show the exact source value where speech rounds (a 7-digit count for 'over 5 million', 252 for 'over 250'). Unspoken numbers: only the two timers and two costs of the race card (clip35@815-885), where speech says 'in seconds' and 'far faster and cheaper'.
- Evidence: properties.numbers_on_screen
- Confidence: medium (read by eye on native frames, n=13)

### [X18] Land a badge on the object it judges, on the word that states the state: about 10 frames, 150 to 290 px across, at the top-right corner of the object, or over its centre when it cancels or completes it.

- Values: 9 units carry badges (6 clips). Measured on 6: entrance 10, 10, 10, 9, 13, 9 f; changed area 144x144 to 288x216 px; start minus word -2.0 (no-signal on the noun), -11.8 (price tag; +2.0 from the verb of its clause), -1.4 (padlock on the negation), +2.4 (check), +2.0 (check), -10.2 (cross; -0.6 from its clause start). Place (9 badges incl. 3 corner badges on cards): top-right corner or top edge of the object 6, over the centre of the subject 2, bottom-left as a second badge 1. Colours (by eye): accent disc with cream glyph (check, padlock), accent tag (price), dark disc with accent glyph (no-signal), red cross and green check as verdict marks (clip38, clip35).
- Evidence: extra.badges; strips/, strips/
- Confidence: medium (6 measured badges)

### [X19] Draw a link in the order: first node with the anchor, line on the verb, second node on its name, check 7 frames later; use a travelling token for request and reply or for "in sync".

- Values: 5 units in 5 clips. Connector row (clip35): node A 1025-1037, line draws 1052-1060 (+2.6 f from the verb), node B 1063-1076 (-0.8 f from its name), green check 1070-1078. Waves between two portraits 939-952 (0.0 f from the noun; clip30). Dotted arc 172-182 with a dot that keeps travelling until the exit (clip37). Capsule up a pipe 585-600 and back 599-609 (clip34). Line draws take 9 to 14 f. No link has an arrowhead (0 of 5).
- Evidence: ; strips/, clip30-u031, clip37-u173, clip34-u119
- Confidence: medium

### [X20] For a list of nouns, add one card, chip or tile per noun on its noun, or morph one icon per noun in place; start each within 3 frames of the noun.

- Values: 12 item events in 4 units (4 clips): start minus noun onset -2.6, +1.0, +2.0 (three cards, clip34); +2.4, +0.4, -0.2, +1.2 (four verdict chips, clip38); -0.8, +1.0 (track tiles, clip39); -0.4, +1.8, -3.2 (icon morphs, clip35). Median +0.7 f, all within 3.2 f. A morph takes 16 to 21 f in two stages (a small move, then the main change 4 to 5 f later).
- Evidence: (clip34-u111, clip38-u211, clip39-u232, clip35-u139); strips of those units
- Confidence: high (12 of 12 within 3.2 f; 4 clips)

### [X21] Set a comparison as two blocks: stacked with labels, side by side with an arrow, or as a race of two counters; mark the winner with a one-frame outline on the comparative word and dim the rejected block.

- Values: 7 units in 6 clips: stacked before/after with labels and an outline on the offending row (clip29@318-358), side-by-side figures with an arrow (clip36@72-88, still), us-and-them rows with the upper row dimmed in 4 f on 'only' (+3.6 f; clip35@252), mirrored desktop and phone (clip37), race card (clip35): both counters start on the verb (+0.2 f), the winner stops and is outlined at 857 (-2.2 f from 'faster'), the other runs on to 874, costs brighten at 883 (+4.0 f from 'cheaper'). Arrows: 1 of 51 units.
- Evidence: ; strips/, clip29-u005, clip35-u135, clip36-u153
- Confidence: medium

### [X22] Use a route, a clock loop, alignment lines and a guided pan as single-purpose devices: journey, repetition, "on the exact frame", and a chain of steps.

- Values: Route: 2 units; path draws in 21 f (clip37@283-303) and 27 f (clip36@668-694) with a token at its head; destination pin drops as it arrives (300-313); a status chip changes text 2 f after the pin (315-318). Clock loop: 1 unit; 5 flips at an 11.5 f period, a row removed 7 f after each, a check badge on the closing word (+2.4 f). Alignment lines: 3 units in 2 clips; a line drops in 2 to 3 f per hit (clip33@583, 591, 608, 615), guide lines 435-442 (clip39), playhead and outline 524-540 (clip39). Guided pan: 1 unit; the view travels 31 and 32 f down a connector (clip31@522-552, 617-648).
- Evidence: ; strips/, clip32-u072, clip33-u098, clip39-u232, clip31-u061
- Confidence: low (1 to 3 units each)

### [X23] Run a demo as a player on its own clock: a playhead at constant speed, events driven by the media, the presenter silent and hidden for a full-length demo.

- Values: 4 units in 3 clips (28.7 s). Two-track voice demo: 475 f, playhead about 1.8 px per frame over about 800 px, 7 transcript rows appear with the demo lines (offsets -18 to +5 f against an unreliable transcript of two overlapping voices), a ring pulses on the speaking avatar. Logo-animation player: silent pass 124-166, then speaker icon on and strip in at 167 (-0.4 f from the word being spoken), 4 clip chips land at 192, 202, 210, 217 (10, 8, 7 f apart) on the motion beats; it loops (clip33@118-275 and 883-979). 17 of the 117 events are of this kind.
- Evidence: , strips/, strips/
- Confidence: low to medium (3 clips, all about audio)

### [X24] After the last event keep the picture still. Only a small element that carries meaning may loop (a dot on a link, waiting dots, a pulsing empty slot, playing media).

- Values: Final holds of 12 f or more: 45 units. Still: 33 (31 with no change at all: ECC scale 1.0000 +-0.0002, shift under 0.1 px; 2 with only a settling tail or codec blips). Looping or playing: 9 (demo media 4 units; contour lines that breathe clip36@445-745, 2 units; travelling dot clip37@176-228; drifting particles clip39@235-262; halftone shimmer clip29@575-633). Slow push-in: 3 (rule X25). In holds too short to judge: waiting dots clip30@720-750 and an empty-slot pulse at clip33@773, 785, 798, 813.
- Evidence: 
- Confidence: high for stillness (code, every frame); medium for the list of loops

### [X25] Three cut-out pictures grow slowly while they hold (about 1.1 to 1.6 % per second); the other cut-outs do not. Treat the push-in as optional.

- Values: ECC affine fit, first against last frame of the hold: x1.0194 over 52 f (clip34@385-436), x1.0234 over 43 f (clip39@64-106), x1.0225 over 45 f (clip39@352-396) = 0.037, 0.054, 0.049 % per frame. Bounding box of the cabinet grows 680 to 696 px wide over the same frames. 13 other cut-out units read 1.0000 (3 more have holds too short to judge). The first study (M20) reported no slow push; these 3 units are exceptions, in 2 clips (2026-11-04 and 2026-11-07).
- Evidence: 
- Confidence: medium (3 units, 2 clips; fit on half-size copies, checked with a native bounding box)

### [X26] Centre the unit on x=540 and let it take about 77 % of the width and 82 % of the graphic zone in the split layout; go to the full layout when two blocks are stacked or a diagram has three or more rows.

- Values: Content box on native frames at the final hold. Split layout (n=35): centre x median 540, top y median 64 (p10 20, p90 161), bottom y median 812 (p90 873), width share 0.772, height share 0.817, content pixels 17 % of the zone. Full layout (n=16): top 92, bottom 1334, width share 0.894, content 22 %. Centre within 12 px of 540: 39 of 51. Full layout by primary device: alignment lines 2 of 2, pair comparison 3 of 5, item-per-noun 2 of 3, demo playback 2 of 4, cut-out picture 2 of 12 (both stacked over a capture), count-up figure 0 of 4, process enactment 0 of 4.
- Evidence: 
- Confidence: high for the centre and the shares; medium for the layout choice

### [X27] Place a figure above the picture, a logo tile at a top corner, and keep the unit alone in the zone unless a section heading, a capture or a prompt box belongs to the same sentence.

- Values: What shares the frame (51 units, by eye): alone 25, under a section heading 9, with a figure 8, with a logo tile or name chip 8, with a capture card 3, with a prompt box 1, with the call-to-action lines 2. Figure place (9 units): above the picture 5, below 1, right 1, upper left 1, under the middle 1. Text labels inside cut-out pictures: 0 of 19; labels exist only in diagrams (two-word state labels, month names, value chips, a one-word stamp).
- Evidence: (shares_frame_with)
- Confidence: medium (by eye)

### [X28] Spend the accent on the subject of the sentence: one mark or one part per scene, about 7 % of the drawn pixels.

- Values: Accent carried by the subject of the sentence in 38 of 51 units, by a detail or one-of-many mark in 7, absent in 3, replaced by a product colour in 3 (clip35). Accent share of content pixels: median 0.0685 (split), 0.0644 (full); largest 0.46 (terrain peak) and 0.38 (machine head). Events drawn in the accent: 52 of 117; changes of state in the accent: 28 of 48. Red and green appear only as cross and check verdicts (3 units).
- Evidence: (accent_px, accent_blobs), (in_accent)
- Confidence: medium (pixel counts by code; what the accent is on is by eye)

### [X29] Expect about half of the units to be reproducible from parameters alone, and ask the user for one or two pictures per video for the rest.

- Values: Generic (labels, numbers, logos, captures, media): 26 units (51 %), 110.2 s (53 %), in 11 clips. Hybrid (a generic device around one supplied cut-out picture): 15 units (29 %), 55.7 s (27 %). Bespoke (the drawing is the explanation: animated machine, terrain, map, pixel scene, character pair, 5 metaphor stills): 10 units (20 %), 40.7 s (20 %). Units that need a supplied picture per clip: median 2, range 1 to 5. Depiction: diagram 23 units (101.3 s), metaphor 17 (63.1 s), literal 11 (42.3 s).
- Evidence: (generic_or_bespoke, needs, depiction); generic_lists, needs_per_unit
- Confidence: medium (judgement by one coder)

### [X30] In the split layout, step enactments on the frames whose index mod 5 is 0, 2 or 3; in the full layout step them on every frame.

- Values: Frames inside events of 6 f or more. Split layout: no update on 200 of 230 frames with index mod 5 in {1, 4} (87 %) and on 13 of 396 other frames (3 %). Full layout: no update on 14 of 519 frames (3 %). This is the first study's cadence (M01, S28) seen inside the enactments; the residue-1 frames repeat in 67 % of cases, the residue 4, 6 and 9 frames in 90 to 100 %.
- Evidence: extra.frames_without_update_inside_events_by_frame_mod_10
- Confidence: medium

### [X31] Do not use: an event with no spoken word behind it, two unrelated devices at once, a caption inside a picture, an arrowhead on a link, an element that leaves before its scene ends, or a camera cut inside a scene.

- Values: Counts over 45 scenes and 117 events. Events outside speech and outside a media clock, a follow-on or a loop: 0. Overlapping events from different ideas: 0 of 25 overlapping pairs. Text labels inside cut-out pictures: 0 of 19. Arrowheads on links: 0 of 5; arrows at all: 1 unit. Elements removed before the scene exit (swaps aside): 2, both in the 13 s terrain scene (figure at 571, first value chip at 653). Cuts inside a scene: 0; view moves: 1 guided pan, 1 map tilt, 3 slow push-ins. Events later than 8 f after their word: 0 of 80. Processes shown as stills: 0 of 7. Rotation as an entrance: 0; rotation inside an enactment: refresh arrow, gavel, map tilt (3 units).
- Evidence: , strips/
- Confidence: medium (absence over 51 units; partly by eye)

### [X32] Budget explanatory units at about 46 % of the runtime, 4 scenes per video, with no change of practice over the six days.

- Values: 51 units cover 196.73 s of 426.6 s (46 %); per clip 0.29 to 0.66, median 0.46; scenes per clip median 4, range 2 to 6. The sum of unit lengths is 206.6 s because 4 units share frames with another unit of the same scene. By date (2026-11-02 to 11-07) events per scene, the share of stills and the generic share show no trend (table per_clip). The brief's '252 of 427 s' includes the 11 opening pictures and 5 count grids that this study leaves out.
- Evidence: extra.per_clip, counts
- Confidence: high

## Constant and variable

CONSTANT (every clip, every unit that applies): an anchor comes first; events are keyed to words (0 events without a word, a follow-on delay, a loop or a media clock); no event starts more than 8 f after its word (0 of 80); list items land within 3.2 f of their noun (12 of 12); count-ups last 11 to 16 f; badges enter in 9 to 13 f; processes, connections, routes and step sequences are never stills (0 of 25); no label inside a cut-out picture (0 of 19); units are centred on x=540 (39 of 51 within 12 px); a finished picture holds 30 f or more in 31 of 34 scenes; split-layout enactments update on 3 frames in 5.

VARIABLE: events per scene 0 to 10 (set by how many content words the idea has); anchor-to-first-event gap 8 to 114 f and event spacing 9 to 47 f (set by where the words fall); event length 1 to 32 f (set by the action: outline 1 to 7, badge 10, entrance 12, morph 16 to 21, route 21 to 27, pan 31); trigger on the word (61) or on the clause start (12); layout split (35) or full (16), by height needed; device, by the kind of idea; depiction diagram 23, metaphor 17, literal 11; a slow push-in on 3 of 16 judged cut-outs; verdict marks in red and green in 3 units; a product colour in place of the accent in one clip; the share of runtime per clip 30 to 66 %.

## Open questions

- Are events keyed to the word onset or to the caption cut? Both clocks give the same median within 1 frame (-0.4 and -1.0 f); a forced alignment of the 11 transcripts would separate them.
- When does an event go on the clause start instead of its word (12 of 80)? It looks like 'when the picture must change before the word makes sense', but 12 cases do not make a rule.
- Is the slow push-in on 3 cut-outs a rule (which pictures get it) or a per-picture choice? 3 of 16 judged cut-outs, in clip34 and clip39 only.
- Does a count-up start on the number or end on it? Five start within 1 to 5 f of the onset; one (clip29@555) starts 7 f early and ends 6 f after. More count-ups are needed.
- Are the 7 still pictures a rule (nouns and states get a still) or a production shortcut? The data cannot tell; a planner can treat a still as the fallback.
- Split-layout cadence: this study finds updates on 6 of 10 frames inside enactments (index mod 5 in 0, 2, 3), the first study's M01 says 7 of 10. Residue 1 repeats in 67 % of cases here.
- The device vocabulary has 26 names and 12 of them occur in 1 or 2 clips. A second coder would merge or split some (route against link, quantity picture against one-among-many grid).
- Do the events carry sound effects, and on which frame? Not examined here; the audio analyst's onsets could be joined to.

## Needs an eye or an ear

- Play clip36 frames 343-745 ( is the terrain read as 'height = ambition'? The whole metaphor label rests on one reading.
- Play clip39 47-107 and 328-397 and clip34 370-437: is the slow growth visible and wanted?
- Look at around frame 252: the top row dims to roughly 40 % (by eye). Confirm the level.
- Look at and: red cross and green check break the one-accent rule. Confirm they should be allowed as verdict marks.
- Look at frames 270-285: the desk cut-out lands at 273-283 by eye (the map moves under it).
- Check 10 rows of against the strips: the 'named_word' column is a reading, and every sync number depends on it.
- Listen to clip30 87-561 (demo with two voices): do the transcript rows appear on the first word of each demo line? The transcript cannot show it.
