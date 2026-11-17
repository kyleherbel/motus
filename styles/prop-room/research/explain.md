# Explanation

Measured: a second pass watched every graphic unit to see how it explains its sentence, in two halves. Pictures and figures (X01-X29): every unit the graphics inventory filed as an illustration, photo, figure or mark, 145 units, 317.7 s, 9,520 frames in 19 clips. All frames were decoded (BT.709 limited to full, 270x480) and differenced; every frame inside a change burst, the first 4 and last 2 frames of each unit and every third frame elsewhere were viewed on per-unit sheets with the spoken words, and 483 events were coded with start and completion frames. Counters were read on every frame with Apple Vision OCR at full resolution (24 crops; 8 more by eye), 25 fills were measured as per-pixel colour progress on every frame, and 20 device instances (drops, stamps, an insert, a route, a curve, a push-in, a ring, typing) were tracked on every frame and fitted with 12 named easings and a free cubic-bezier. Interfaces and text cards (X51-X78): every frame of all 134 interface, text-card and other units (8,635 frames, 288.1 s, 19 clips; the closing keyword excluded), coded event by event (838 events: what, start and complete frame, the word it acts out and the offset) by the analyst and three forks working to one protocol. Programs then measured on every frame 313 entrances, 17 clean cursor paths, 34 wipes, 21 scrolls, 48 typed spans, 2 ring pulses and the window chrome of 36 units (100 traffic-light detections). Together: 279 units, 605.8 s, 1,321 events.

Not done: nothing was listened to (typing or click sounds are unknown) and playback was not watched (sheets only). In the pictures half only every third frame was viewed outside change bursts. Idea kind, device, mode and build class are coder judgements recorded per unit. Event landing words are transcript words (faster-whisper, +-2 frames, not forced-aligned). Prop shadows were measured on 10 hand-boxed props only; only 2 ring pulses and 17 cursor moves tracked cleanly; the window corner radius rests on 3 clips; window shadows were not re-measured. Third-party products are described as categories. This pass has not had an independent verification; where its numbers repeat a verified one (entrance ease, card radius and shadow, window dots) the verified value is noted.

Evidence is cited as `clipNN@frame` (frames at 29.97 fps, counted from 0; ids are this style's own). File names in Evidence lines name files of the local study; they are not shipped. "Verified" lines give the independent verifier's verdict and final value; item numbers refer to [verification.md](verification.md).

## What the pass found

- A unit is an anchor and events. The anchor is on screen on the cut frame (91 % of picture units, 81 % of interface units; otherwise after 1-2 frames of empty plate) and is alone for about 2 frames. Events then act the clause out: pictures median 3 events about 12 frames apart, interfaces median 6 about 5 frames apart. The next cut comes about 4 frames after the last event settles ([X03]-[X05], [X55]).
- Pictures act by device families: quantities count up or fill, names reveal with a ring pulse, lists arrive one per beat, changes of state happen to an object ([X13], [X14]). Interfaces enact the step itself: 70 % of their time is the tool doing what the sentence says ([X54]); ten devices cover 60 % of interface units ([X51]).
- Sync differs by half. In pictures, event starts are no closer to word onsets than random frames (23 % against 23 % within +-1 frame): they couple to the clause and its beat ([X06]); a spoken number lands about 7 frames after the word ([X07]). In interfaces, half the events act out a specific word and land on its onset (median 0 frames, 58 % within 3), mostly nouns and verbs in the middle of the clause, always in spoken order ([X56]-[X58]).
- Counters and value bars share one curve, cubic-bezier(0.65, 0, 0.35, 1), over about 27 frames ([X08]). Entrances share cubic-bezier(0.16, 1, 0.3, 1) and settle visibly in about 4 frames ([X59], [X60]). Nothing overshoots or bounces ([X29], [X78]).
- Build classes: about half of all units can be drawn from parameters (A), about half need one picture with parametric events on it (B), and 10 units are bespoke character animation (C) ([X01], [X76]).

## Devices

### Pictures and figures: 15 families, 92 devices

| Family | What happens | Units (primary) / clips / s |
|---|---|---|
| count_up | a number on screen counts or rolls to a value (counter, odometer, split-flap digits, percentage, price) | 18 (17) / 9 / 41.5 |
| big_numeral | one huge numeral appears and holds, often filled with imagery or texture | 5 (4) / 5 / 11.9 |
| fill_or_sweep | a bar, wedge, ring segment, gauge needle, chart bar or grid of cells fills or drains to show an amount | 20 (17) / 11 / 42.4 |
| one_by_one | items of a set arrive one at a time on successive beats (cards, chips, badges, icons, bulbs, notifications) | 19 (18) / 12 / 47.3 |
| path_draw | a line, route, connector chain, curve or graph path is drawn between things | 13 (13) / 7 / 35.5 |
| name_reveal | the name or mark is revealed (focus pull, flip, type-on, split-flap, lid lift) with a ring pulse | 16 (15) / 10 / 23.8 |
| verdict_mark | a stamp, X or tick badge lands on the thing to judge it | 8 (5) / 7 / 18.4 |
| gate_check | a gate or filter layer stops or lets through items | 4 (4) / 1 / 9.0 |
| machine_output | a machine feeds out or shreds the thing (printer, receipt, shredder) | 3 (3) / 3 / 9.1 |
| open_or_enter | a container opens or the camera enters it (cloche lifts, door opens, push into a screen, sink below the waterline) | 8 (8) / 5 / 18.3 |
| object_action | an object is acted on: inserted and powered up, locked, burned, switched off, leaking, hit | 15 (10) / 11 / 32.1 |
| before_after | the same picture before and after, swapped by a wipe or a restyle | 5 (5) / 3 / 17.0 |
| interface_demo | a rebuilt interface performs the step (resize, rewrite) | 2 (1) / 2 / 11.3 |
| character_acts | a character or mascot acts the sentence out | 9 (9) / 7 / 17.5 |
| footage | footage plays (AI clips, stock footage) with cuts or chips on top | 16 (16) / 3 / 23.9 |

| Device | Family | What happens | Units / clips |
|---|---|---|---|
| counter_holds | count_up | a counter is shown holding its value (zero) while items arrive | 1 / 1 |
| counter_roll | count_up | digits count or roll from a start value to the end value | 13 / 8 |
| counter_to_limit | count_up | a counter ticks up to a limit and a limit modal pops | 1 / 1 |
| filmstrip | count_up | clips are added to a filmstrip while a duration counter climbs | 1 / 1 |
| round_counter | count_up | a token travels back and forth and round lights turn on, one per round | 1 / 1 |
| stat_rows | count_up | benchmark pills pop and count up row by row, ticks land | 1 / 1 |
| waffle_count | count_up | a grid of tiles fills one per item while a counter counts the items | 1 / 1 |
| big_numeral | big_numeral | one huge numeral (textured, outlined or image-filled) appears for the spoken number and holds | 4 / 4 |
| count_grid | big_numeral | a grid of N cards fills, then the numeral N appears over it | 1 / 1 |
| bar_chart_rise | fill_or_sweep | bars of a chart rise from zero with their values counting up, staggered 3-4 frames | 1 / 1 |
| bar_drain | fill_or_sweep | usage bars empty back toward 0 % (the reverse of a fill) | 1 / 1 |
| bar_fill | fill_or_sweep | one or more progress or usage bars fill toward a value or a limit | 4 / 3 |
| clock_sweep | fill_or_sweep | a coloured wedge sweeps a clock face (time spent) | 2 / 2 |
| gauge_sweep | fill_or_sweep | a semicircular gauge needle sweeps and its arc fills | 2 / 2 |
| grid_fill | fill_or_sweep | cells or stickers of a grid fill one after another | 3 / 3 |
| race_bars | fill_or_sweep | two bars fill at different speeds to compare rates | 1 / 1 |
| race_compare | fill_or_sweep | two cards: a long route with a growing cost bar vs a short path | 1 / 1 |
| ring_segments | fill_or_sweep | segments of a ring fill in turn; one stays empty | 1 / 1 |
| score_card | fill_or_sweep | a score card with labelled bars filling and a total counting up | 3 / 3 |
| segment_fill | fill_or_sweep | segments of a donut fill one per unit | 1 / 1 |
| card_deck_deal | one_by_one | cards are dealt onto a deck one after another | 1 / 1 |
| chip_ring | one_by_one | word chips pop around a central card one per beat | 1 / 1 |
| clone_grid | one_by_one | a page duplicates into a wall of identical copies | 1 / 1 |
| conveyor_stamp | one_by_one | items pass on a conveyor and each gets stamped | 1 / 1 |
| enumerate_pop | one_by_one | the N items of a set pop or drop in one per beat | 4 / 4 |
| feature_tour | one_by_one | one literal mini-demo per listed noun, swapped in turn | 1 / 1 |
| grid_grow | one_by_one | a grid of icons reflows to twice as many on each beat | 1 / 1 |
| growing_list | one_by_one | a list or bill grows longer row by row | 2 / 1 |
| icon_wall_scroll | one_by_one | a tilted wall of icons slides past with a highlight column | 1 / 1 |
| light_up_sequence | one_by_one | unlit objects (bulbs) light up one by one | 1 / 1 |
| multiply | one_by_one | one avatar multiplies into a dense grid | 1 / 1 |
| notification_stack | one_by_one | notifications (payment received) pop onto a card one after another | 2 / 1 |
| sort_and_drop | one_by_one | strips re-sort by score and the weaker ones fall away | 1 / 1 |
| stack_repeat | one_by_one | identical cards drop onto a stack again and again | 1 / 1 |
| chart_callout | path_draw | a time tag and a callout pin to a chart line, then the line redraws | 1 / 1 |
| data_to_chart | path_draw | a data file drops into an empty chart and its points spill out into the line | 1 / 1 |
| explode_to_graph | path_draw | a folder bursts into file cards that link up into a graph | 1 / 1 |
| flow_line | path_draw | a line draws from one card to another to show where something goes | 1 / 1 |
| hub_orbit_absorb | path_draw | marks orbit a central tile on rings, then fly inside it | 1 / 1 |
| line_draw | path_draw | a chart curve draws from left to right | 1 / 1 |
| node_chain | path_draw | nodes of a flow pop one by one, joined by connectors that draw first | 2 / 1 |
| rising_line | path_draw | a zig-zag arrow line climbs to the upper right | 1 / 1 |
| route_around | path_draw | a route line draws up to a barrier, bends around it and continues | 1 / 1 |
| step_path | path_draw | a zig-zag path of numbered nodes; a card attaches to each node and it ticks | 1 / 1 |
| track_switch | path_draw | a train reaches a red signal, the points switch, a handcar rolls onto a branch | 2 / 1 |
| flip_reveal | name_reveal | a "?" disc flips edge-on about the vertical axis and comes back as the mark, with a ring pulse | 3 / 1 |
| mark_reveal | name_reveal | the mark or wordmark is revealed (focus pull, wipe, type-on) with a ring pulse or laurel | 6 / 6 |
| name_over_footage | name_reveal | the name in huge white caps sits over playing footage | 3 / 1 |
| name_type_on | name_reveal | the name types into a search field letter by letter | 1 / 1 |
| pin_drop | name_reveal | a map pin and label drop onto a photo | 1 / 1 |
| pulse_on_word | name_reveal | an object pulses once per word of the name | 1 / 1 |
| split_flap | name_reveal | split-flap letters flip from random characters to the word | 1 / 1 |
| glitch_fail | verdict_mark | the scene glitches and turns red to show failure | 1 / 1 |
| magnifier_check | verdict_mark | a magnifier passes lines of an answer and ticks or X marks land | 1 / 1 |
| pile_reject | verdict_mark | items tumble into a messy pile and a red X badge lands on it | 1 / 1 |
| reject_bin | verdict_mark | cards tagged "not a match" drop into a bin one by one | 1 / 1 |
| stamp | verdict_mark | a verdict stamp (HIRED, EXCLUSIVE, FREE, GOOD FIT) lands on the thing | 3 / 3 |
| x_badges | verdict_mark | red X badges pop beside broken parts one by one | 1 / 1 |
| filter_layers | gate_check | stacked filter layers catch a bug that slipped through one | 1 / 1 |
| gate | gate_check | a hazard-striped gate with a light closes bars; items are stopped or pass | 3 / 1 |
| machine_output | machine_output | a machine (printer) feeds out copies | 1 / 1 |
| receipt_print | machine_output | a receipt prints down line by line | 1 / 1 |
| shred | machine_output | a document is fed into a shredder and comes out as strips | 1 / 1 |
| door_open | open_or_enter | a door (or elevator doors) opens onto light | 2 / 2 |
| iceberg | open_or_enter | an iceberg tip carries the surface task; the view sinks to show the hidden body | 2 / 1 |
| lid_reveal | open_or_enter | a lid (cloche) lifts to reveal what is under it | 2 / 1 |
| push_in_screen | open_or_enter | the view pushes into a screen in a rendered room until it fills the frame | 3 / 3 |
| book_to_components | object_action | a book is read (page highlights) and its contents fly out as tiles that build a page | 1 / 1 |
| burn_away | object_action | flames rise from the bottom and burn the card away | 2 / 2 |
| delivery | object_action | a mascot flies in and delivers an envelope that opens | 1 / 1 |
| goal_hit | object_action | a ball arcs through a hoop and the target turns into a success state | 1 / 1 |
| insert_and_power | object_action | a cartridge or card lowers into a machine slot, which lights up | 3 / 3 |
| leaking_tank | object_action | a glass tank leaks coins (tokens) or refills | 2 / 1 |
| lock_down | object_action | chains and padlocks lock an object; a lock pulses on a screen | 2 / 2 |
| morph_metaphor | object_action | one shape morphs into the metaphor object (meter bars into book spines) | 1 / 1 |
| toggle_off | object_action | a toggle switches off and the symbol fades | 1 / 1 |
| versus | object_action | two characters face each other with an arc between them | 1 / 1 |
| before_after | before_after | the same scene shown first wrong then right (typed prompt rewritten, prop swapped) | 1 / 1 |
| before_after_wipe | before_after | a vertical wipe line sweeps across footage, swapping original and transformed versions | 3 / 1 |
| restyle_demo | before_after | a page or chart restyles itself to different themes | 1 / 1 |
| rewrite | interface_demo | lines of a document are rewritten behind a caret | 1 / 1 |
| step_resize | interface_demo | a page frame narrows step by step through widths while step dots turn green | 1 / 1 |
| character_reaction | character_acts | a rendered character reacts while small items pop around it | 1 / 1 |
| character_scene | character_acts | a cartoon or rendered character performs the sentence in a scene | 5 / 4 |
| mascot_actor | character_acts | pixel mascots act a role (judge, team) in the scene | 2 / 2 |
| speech_bubble | character_acts | a character raises a finger and a speech bubble pops | 1 / 1 |
| carousel | footage | a 3D carousel of vertical video cards rotates | 1 / 1 |
| chip_overlay | footage | small chips (avatars, voice pill) drop onto playing footage and stay | 2 / 1 |
| filmstrip_scroll | footage | vertical film strips scroll with many clips | 1 / 1 |
| footage_clip | footage | a single footage clip plays (no inner events) | 5 / 2 |
| footage_montage | footage | one footage shot per caption word, cut on the words | 4 / 1 |
| footage_strips | footage | two or three footage strips or tiles play side by side | 3 / 3 |

A unit may join two devices; the first is its primary device. The most used single device is counter_roll (13 units, 8 clips). Counts that do not appear in the vocabulary table are marked -.

### Interfaces and text cards: 10 families, 40 devices

| Family | What happens | Units / s |
|---|---|---|
| entry | the user gives the tool something (types, drops, pastes, presses keys) | 25 / 48.6 |
| operate | a pointer works a control | 7 / 21.2 |
| choose | one option out of several is selected | 8 / 14.1 |
| progress | the tool does work step by step (lists, ticks, code, prints) | 23 / 59.1 |
| transform | a before becomes an after | 19 / 48.7 |
| judge | a verdict is drawn on a thing | 11 / 22.2 |
| show | a thing is presented (page, footage, name, specimen) | 27 / 44.6 |
| many_and_few | many items vs one or few | 9 / 17.6 |
| connect | things linked or moved from one to another | 4 / 8.7 |
| compare | two things side by side | 1 / 3.2 |

| Device | Family | What happens | Units / clips / s |
|---|---|---|---|
| prompt_typed_send | entry | a request types into a chat/prompt composer (often after a slash-command chip), usually followed by a click on send | 10 / 7 / 17.0 |
| drop_into_composer | entry | a thing (screenshot, card, file, folder, link, prompt) travels into a composer/input and settles as an attachment chip, often with a ring pulse | 8 / 8 / 19.6 |
| key_caps_press | entry | keyboard key caps press (copy, paste, enter) and the result appears | 3 / 3 / 4.8 |
| screenshot_flash | entry | a capture flash or dim, then the shot shrinks to a thumbnail or pins to a board | 2 / 2 / 3.1 |
| form_field_typed | entry | a value types into a settings field and turns into a chip | 1 / 1 / 2.9 |
| card_fills_from_sources | entry | icons or files fly into a card while its fields and a completion counter fill | 1 / 1 / 1.3 |
| cursor_operates_ui | operate | an arrow pointer travels to a control and clicks, holds or drags; the control answers with a state change on the click frame | 7 / 6 / 21.2 |
| picker_lands | choose | a highlight steps through options (picker, dropdown, quiz, chips, cards) and lands on one; the landing swaps highlight, tick and label on one frame | 7 / 5 / 12.7 |
| slot_reel_cycle | choose | a list of options scrolls at constant speed through a fixed selection box and never lands | 1 / 1 / 1.4 |
| items_stack_in | progress | cards, rows, files or messages arrive one after another into a list, stack or pile, about 5 frames apart | 10 / 6 / 25.9 |
| code_types_in_window | progress | code, a command or an agent session types or scrolls at constant speed in a dark editor or terminal window | 6 / 4 / 12.5 |
| ticks_down_list | progress | the items or steps of a list get ticks (or status flips) one after another | 3 / 3 / 6.5 |
| print_out | progress | a sheet prints out of a slot, its lines revealed as it feeds | 2 / 2 / 6.0 |
| stage_handoff | progress | each spoken step's artefact replaces the previous one in place (placeholder, script, cast, storyboard) | 1 / 1 / 6.1 |
| progress_halts | progress | a progress bar runs, then stops and turns red with a refusal line | 1 / 1 / 2.1 |
| before_after_wipe | transform | one state/page is replaced by another through a wipe, scan bar, circle reveal or in-place swap; the old state is the anchor | 14 / 8 / 33.9 |
| form_drives_preview | transform | fields fill or a choice switches and a linked preview (phone page, CV, video card) updates to match | 3 / 3 / 8.9 |
| exploded_parts | transform | a whole (an app window) breaks into labelled part cards floating apart | 1 / 1 / 3.3 |
| glitch_breakdown | transform | the picture glitches, breaks into tiles and falls away to reveal what is missing | 1 / 1 / 2.7 |
| markup_on_capture | judge | circles, outlines, guides or arcs are drawn on a page or app, often turned into ticks or listed as issues | 5 / 4 / 10.6 |
| verdict_badge | judge | a badge or stamp (tick, X, no-entry, PASSED, Free) lands on a thing to give a verdict | 5 / 4 / 10.3 |
| symbol_judges_ui | judge | a drawn symbol (a heart-monitor trace) sits on a UI card and acts out a judgement of it | 1 / 1 / 1.3 |
| site_capture_shown | show | a captured page shown in a rebuilt browser window or full-bleed, then scrolled, clicked or pushed into | 9 / 5 / 18.4 |
| video_in_player | show | footage or a playable app runs inside a player, card or window | 5 / 3 / 7.7 |
| name_sign | show | a product or feature name shown as a physical sign (neon, marquee, clapperboard, pixel letters) whose words light or drop one at a time | 4 / 4 / 8.0 |
| medallion_title | show | list-item title card: a medallion flips in with a line-art icon and the title fades in word by word in serif | 3 / 1 / 3.8 |
| device_set | show | the same page appears on phone, tablet and desktop one after another, each ticked | 2 / 1 / 3.4 |
| design_specimen | show | a design property shown as a specimen ('Aa' type sample, colour swatch columns with hex codes) | 2 / 1 / 1.5 |
| component_showcase | show | one UI component lifted onto a plate as an object, with related pieces popping in around it | 1 / 1 / 1.6 |
| callback_hold | show | an earlier prop comes back briefly with no new event | 1 / 1 / 0.3 |
| wall_of_sameness | many_and_few | a wall or grid of near-identical items (templates, files, thumbnails), struck out, badged, or with outliers lifted | 3 / 3 / 8.4 |
| many_collapse_to_few | many_and_few | many separate items (tabs, windows) collapse into one container or resolve into the few chosen | 2 / 2 / 2.6 |
| mystery_cards_tease | many_and_few | blurred cards with '?' badges switch and fan out to tease items not yet named | 1 / 1 / 2.8 |
| pull_out_reveal | many_and_few | the view pulls back from one item to show it is one of many | 1 / 1 / 1.7 |
| pile_sorts_to_grid | many_and_few | a messy pile of cards flies into an ordered grid grouped by kind | 1 / 1 / 1.6 |
| result_grid_reveal | many_and_few | the result of an action appears as a grid of finished pieces | 1 / 1 / 0.4 |
| hub_and_spokes | connect | one central card linked by drawn lines or flying cards to satellites (accounts, clients, replies) | 2 / 2 / 5.2 |
| fly_into_slot | connect | a thing (badge, chip) shrinks and flies into an empty slot of a card, which then fills | 1 / 1 / 1.9 |
| tokens_travel | connect | style tokens (swatches, a font chip) lift off one thing and travel to another, which then changes | 1 / 1 / 1.6 |
| side_by_side_race | compare | cards do the same task in parallel at visibly different speeds | 1 / 1 / 3.2 |

## Idea-to-device map

Idea kinds, as coded (pictures half; the interfaces half adds "attribute" and has no outcome, claim, check, cause and effect or exclusion):

- quantity: an amount, price, count, percentage or duration
- demonstration: showing the thing working or what it looks like
- a thing named: a product, tool, show or place is named
- change of state: something becomes something else (locked, burned, powered up, levelled up)
- enumeration: a set of items is listed or implied
- comparison: two things or two ways are contrasted
- outcome (own label): the result of an action (hired, worked in one shot, kept building)
- claim (own label): an assertion about the product or the world (powerful, nobody uses it)
- process: a mechanism with stages acting on something
- repetition: the same action recurs
- check (own label): a test or review stops bad items
- steps: ordered user steps
- cause and effect (own label): one quantity drives another
- exclusion (own label): what it does not do / is not
- route: a path around or onto something
- connection: where things link or flow
- choice: picking the best among options
- attribute (own label, interfaces): a property of a named thing (for example free, or open source)

### Pictures and figures

| Idea kind | Units | s | Primary family (units) | Mode | Build |
|---|---|---|---|---|---|
| quantity | 32 | 66.5 | count_up 16, fill_or_sweep 6, big_numeral 4, path_draw 2, one_by_one 2, machine_output 1, object_action 1 | diagram 21, literal picture 6, metaphor 3, interface enactment 2 | A 19, B 13 |
| demonstration | 25 | 52.3 | footage 13, open_or_enter 4, before_after 4, character_acts 2, fill_or_sweep 1, path_draw 1 | literal picture 17, metaphor 4, interface enactment 3, diagram 1 | B 21, C 2, A 2 |
| a thing named | 20 | 30.4 | name_reveal 14, footage 2, open_or_enter 1, character_acts 1, object_action 1, one_by_one 1 | literal picture 15, metaphor 4, interface enactment 1 | A 12, B 7, C 1 |
| change of state | 11 | 23.8 | object_action 5, fill_or_sweep 3, verdict_mark 1, gate_check 1, path_draw 1 | metaphor 10, diagram 1 | B 7, A 3, C 1 |
| enumeration | 10 | 24.3 | one_by_one 9, character_acts 1 | diagram 5, metaphor 3, literal picture 2 | A 6, B 4 |
| comparison | 9 | 26.9 | fill_or_sweep 3, open_or_enter 2, before_after 1, machine_output 1, one_by_one 1, object_action 1 | metaphor 6, diagram 3 | B 6, A 3 |
| outcome | 6 | 13.9 | character_acts 2, object_action 1, fill_or_sweep 1, verdict_mark 1, path_draw 1 | metaphor 6 | B 4, C 2 |
| claim | 6 | 12.9 | character_acts 2, verdict_mark 1, open_or_enter 1, name_reveal 1, footage 1 | metaphor 5, literal picture 1 | C 3, B 3 |
| process | 5 | 10.7 | path_draw 2, character_acts 1, fill_or_sweep 1, object_action 1 | diagram 3, metaphor 2 | A 3, B 2 |
| repetition | 4 | 9.0 | one_by_one 2, fill_or_sweep 1, count_up 1 | diagram 3, literal picture 1 | A 4 |
| check | 4 | 11.7 | gate_check 3, interface_demo 1 | metaphor 3, interface enactment 1 | A 3, B 1 |
| steps | 3 | 9.1 | path_draw 2, verdict_mark 1 | diagram 2, interface enactment 1 | A 3 |
| cause and effect | 3 | 7.8 | one_by_one 2, fill_or_sweep 1 | diagram 2, literal picture 1 | A 2, B 1 |
| exclusion | 2 | 4.2 | machine_output 1, verdict_mark 1 | metaphor 2 | B 2 |
| route | 2 | 5.5 | path_draw 2 | metaphor 2 | B 1, A 1 |
| connection | 2 | 5.2 | path_draw 2 | diagram 2 | B 1, A 1 |
| choice | 1 | 3.4 | one_by_one 1 | diagram 1 | A 1 |

### Interfaces and text cards

| Idea kind | Units | Devices (units) |
|---|---|---|
| demonstration | 26 | prompt_typed_send 6, cursor_operates_ui 4, video_in_player 4, site_capture_shown 3, key_caps_press 2, markup_on_capture 2, component_showcase 1, before_after_wipe 1, picker_lands 1, code_types_in_window 1, drop_into_composer 1 |
| change of state | 22 | before_after_wipe 10, ticks_down_list 2, form_drives_preview 2, result_grid_reveal 1, markup_on_capture 1, glitch_breakdown 1, device_set 1, pile_sorts_to_grid 1, progress_halts 1, exploded_parts 1, many_collapse_to_few 1 |
| enumeration | 18 | items_stack_in 3, medallion_title 3, design_specimen 2, markup_on_capture 2, before_after_wipe 1, verdict_badge 1, device_set 1, mystery_cards_tease 1, cursor_operates_ui 1, video_in_player 1, many_collapse_to_few 1, picker_lands 1 |
| a thing named | 14 | name_sign 4, site_capture_shown 4, code_types_in_window 3, pull_out_reveal 1, callback_hold 1, prompt_typed_send 1 |
| steps | 14 | drop_into_composer 5, prompt_typed_send 3, screenshot_flash 1, form_field_typed 1, key_caps_press 1, card_fills_from_sources 1, items_stack_in 1, stage_handoff 1 |
| process | 9 | print_out 2, drop_into_composer 2, site_capture_shown 2, ticks_down_list 1, before_after_wipe 1, code_types_in_window 1 |
| choice | 8 | picker_lands 5, form_drives_preview 1, cursor_operates_ui 1, slot_reel_cycle 1 |
| comparison | 7 | wall_of_sameness 3, before_after_wipe 1, items_stack_in 1, side_by_side_race 1, verdict_badge 1 |
| repetition | 7 | items_stack_in 5, screenshot_flash 1, cursor_operates_ui 1 |
| connection | 5 | hub_and_spokes 2, fly_into_slot 1, code_types_in_window 1, tokens_travel 1 |
| attribute | 3 | verdict_badge 2, symbol_judges_ui 1 |
| quantity | 1 | verdict_badge 1 |

What to reach for, by idea kind (leading choices from both halves; counts in the tables above):

- quantity: a counter that rolls to the number, else a bar or wedge that fills, else one big numeral ([X14]); a counted set shows exactly that many items ([X12]).
- a thing named: a mark or name reveal with a ring pulse ([X17]); in an interface, a name sign or the captured site ([X53]).
- enumeration and repetition: items arrive one per beat ([X16]); in an interface, items stack in about 5 frames apart ([X61]).
- change of state: an object acted on (inserted, locked, burned, switched off) ([X14], [X20]); in an interface, a before/after wipe ([X70]).
- demonstration: the tool itself doing the step (a typed prompt, the pointer operating a control, a player) ([X53]); footage only for sentences that show what a tool makes ([X27]).
- choice: a picker that steps and lands ([X69]). check: a gate or filter ([X14]). attribute: a verdict badge ([X72]). route, connection, steps, process: a path draws ([X19]), or hub and spokes in an interface.
- comparison, outcome, claim: a metaphor ([X15]); in an interface, a wall of near-identical items ([X53]).

## Anatomy and sync

| Measure (frames at 29.97 fps) | Pictures and figures | Interfaces and text cards |
|---|---|---|
| Units / events | 145 / 483 | 134 / 838 |
| Anchor complete on the cut frame | 132 of 145 (91 %); else 1-2 frames of empty plate | 80.6 %; p90 1 frame after, max 10 |
| Anchor alone before the first event | median 2 (p10 0, p90 15) | median 2 (p10 0, p90 10, max 49) |
| Events per unit | median 3 (p10 1, p90 5.6, max 10); about 1.3 + 0.032 x unit frames | median 6 (p10 2, p90 11); panel 4, full frame 7 |
| Event start spacing | median 12 (p10 4, p90 32) | median 5 (p10 1, p90 19) |
| Hold after the last event | median 4 (p10 0, p90 18); 45 of 138 still moving on their last frame | median 4 (p10 0, p90 23) |
| Events that remove something | 10 of 483 (2 %) | exits 23 of 838 |
| Sync | clause-level: 23.1 % of starts within +-1 frame of an onset, 22.8 % for random frames | 52 % of events tied to a word; offset median 0 (p10 -6, p90 +7); 58 % within +-3 |

Event durations by type, median frames. Pictures: pop 4, slide 6, grow 7, stamp 4.5, recolor 4, pulse 8, draw 13, move 14, type 18, fill 23, count 22.5, camera 20.5.
Interfaces: pop 2.0, other 8.0, slide_in 4.0, swap 2.0, type 10.0, line_in 3.0, cursor_move 8.0, ring_pulse 9.0, fade_in 3.0, click 3.0, scroll 12.5, grow 4.0, wipe 10.0, badge 2.0, drop_in 4.0, exit 4.0, land_from_larger 3.0, highlight_sweep 7.0, select_land 1.5, connector_draw 9.0, play 31.0, select_step 1.0, fill 11.0, count 14.5, scan 17.5, flash 2.0, push_in 4.0, pull_out 9.5, drag 11.5, flip 6.0, paste 2.0, strike 4.0, shatter 16.0, restyle 6.5, hold_press 2.0, stamp 4.0, glitch 6.0, toggle 2.0.

Sync rules:

- Pictures: place events inside the clause that names them, one per beat; do not lock event starts to word onsets ([X06]).
- A figure starts moving about 5 frames before its spoken number (p10 -21.5, p90 +3) and lands on its value about 7 frames after it (p10 +1, p90 +30); it never lands more than 12 frames before the word ([X07]).
- A name is legible a median 9 frames after the name is spoken (p10 +2, p90 +26, n=32) ([X17]). A verdict stamp lands about 2 frames after the noun it judges ([X18]).
- Interfaces: tie an event to the onset of the content word it acts out (noun 53 %, verb 31 %, adjective 10 %, number 2 %, function word 4 %); the cut takes the clause's first word, the events take its middle (82 %) ([X56], [X57]).
- The first tied event comes a median 7 frames after the cut (p10 1, p90 31); untied events fill the gaps about 5 frames apart; events follow the spoken order (159 of 159 pairs) ([X57], [X58]).
- Typing starts on a word onset (median +0.7 frames) but types a short plausible request, not the spoken words ([X63]).

## Build classes

| Class | Pictures and figures: units / time | Interfaces and text cards: units / time |
|---|---|---|
| A: drawable from parameters | 63 units (43.4 %) / 135.2 s (42.6 %) | 65 units (48.5 %) / 46.5 % |
| B: one supplied or generated picture plus parametric events | 73 (50.3 %) / 164.4 s (51.8 %) | 68 (50.7 %) / 52.6 % |
| C: bespoke animation | 9 (6.2 %) / 18.0 s (5.7 %) | 1 (0.7 %) / 0.9 % |

What B and C units need (categories overlap). Pictures: a rendered object picture 39, generated or stock footage 27, a mascot or character sprite 23, a screenshot or site capture 14, a product or app mark 12, a photo 6. Interfaces: a screenshot or capture of a real page or app 46, photos (avatars, thumbnails, portraits) 18, footage 18, product interface renders 7, marks or icons 4. The 10 C units are characters or rendered scenes that deform (cartoon figures, a helmeted figure, a clay caricature, a silhouette raising its arms, one glitch breakdown) ([X02], [X76]).

Interface sources by time: rebuilt 52.7 %, a real capture inside rebuilt chrome or a card 24.3 %, a bare capture 19.8 %, footage in a rebuilt frame 3.2 %. Events on captures are always rebuilt ([X73]).

The owner's decisions (16 Nov 2026) for the build: every picture-plus-events unit is rebuilt as a detailed code-drawn prop (vector parts with ids, lit and shadowed by the prop look below) whose parts the beats animate; the pack ships generic props and the planning agent writes new ones as code per video. Photoreal pictures and AI video clips (about 10 % of units) are left out. Third-party marks, interfaces and mascots are redrawn as neutral categories or not used. No owner decision covers class C; it is bespoke and has no generic device in this study.

## The prop look

Measured on 13 hand-picked props in the colour study ([C19]-[C25]) and 10 hand-boxed props here ([X24], [X25]). Low and medium confidence: few instances, boxes by eye. The verification pass re-measured the card shadow ([G16]) but not the floating-prop shadow, the shading, the chrome or the glow (verification items 12 and 27). The build draws its props in code; nobody has compared a code-drawn prop with a reference prop by eye.

- Placement: one hero prop centred on x 540, 0.68 of the frame wide (0.44-0.85); centre y 600 in the panel (p10 490, p90 815; panel 0-958) or 750 full frame (625-860); 0-2 smaller secondary props at 0.15-0.35 of the hero width; keep the caption band y 1195-1315 clear ([X24]).
- Edge: a hard anti-aliased silhouette, no outline stroke, no feather; 10-90 % luma transition 4 px (1.8-5.6), glass 9 px ([X25]). No grain, no blur, no chromatic aberration ([C03]).
- Top light: the top of a body is lighter than its bottom: 22-28 levels on two props ([C23]; dark plastic 46.6 -> 24.5, light plastic 228.2 -> 199.7), 9-22 levels (median 13) on six props ([X25]). The colour study's recipe overlays a vertical gradient from +8 % white at the top to -8 % black at the bottom; the explanation pass's from +4 % to -4 %.
- Shadow, never above the object ([C29]). A floating object: one fitted instance, box-shadow 0 68px 102px -36px in a warm dark brown (#5E3430) at 0.53 of plate luma (clip03@330, rms 0.006); contact darkening 0.45 below, half by 42 px; sides 0.115-0.119 at 3 px, half by 26-28 px, gone by 63-70 px ([C19]; not re-measured). An object resting on the plate: about 0.8 of the plate at the contact (0.69-0.88), half recovered by 20-30 px, gone by 60-100 px, which suits 0.35-0.45 opacity ([X25]).
- A UI card, window or sheet of paper: a tighter, lighter shadow: 0.28-0.31 darkening right under the bottom edge, sides 0.035-0.10 falling to half within 8-20 px ([C20]). Verified card fits: 0 31px 41px -27px rgba(0,0,0,0.43) and 0 18px 25px -13px rgba(0,0,0,0.25) ([G16]).
- Flat icons, flat illustrations and phone mock-ups on saturated fields: no shadow ([C21]). On a saturated field the study suggests dropping shadow opacity to 0.15-0.2 (fields carry flat props).
- Shadow tint: warm under floating objects (channel ratios below 0.72/0.65/0.64, sides 0.92/0.90/0.91; equivalent colour #5E3430 to #76514C), neutral under paper (0.78/0.78/0.80) ([C22]).
- Metal: cool silver, median #D6DAE0, darkest #8F959B, one soft highlight band reaching 247-255 on under 3 % of the surface ([C24]).
- Lit parts glow in their own hue: excess luma 37 at 2 px, 1/e by about 13 px, gone by 30 px; blur sigma about 10 px, added in screen mode at about 0.6 ([C25]). A ray burst behind a reveal: 15-16 rays per full circle, contrast 19-24 levels on #F7E9D2 ([C25]).
- Materials: white UI card #FFFFFF; ink #212126 ([C17]); matte black plastic luma 25 (bottom) to 47 (top); light grey plastic luma 228 (top) to 200 (bottom); chrome #D6DAE0; paper receipt #FAFBFB. Accents in the study's material list (orange #E38056, blue #357CEF, amber #ECAB44, red #F0574A, green #13904C) are not a palette: the orange is a third-party mascot's colour and there is no house accent ([C18]).
- Arrival and hold: the prop is still arriving on the cut (scale 0.85 -> 1 over about 15 frames, [M06]), then on about 2 holds in 3 it keeps a linear push-in of about 0.6 % per second ([M19]); the parametric events act on it in between.
- Frosted-glass cards (clip07@125-150, by eye, one clip): blurred content, a sharp white rim with a soft white outer glow; may be a transition state rather than a look.

## Rules: pictures and figures

### [X01] Plan the pictures-and-figures share as 43 % drawable from parameters (A), 50 % one supplied or generated picture plus events a program draws on or around it (B), 6 % bespoke animation (C).

- Values: Units A 63 / B 73 / C 9 of 145 (0.434 / 0.503 / 0.062); runtime 135.2 s / 164.4 s / 18.0 s of 317.7 s (0.426 / 0.518 / 0.057). By family: figure A 39 B 15; illustration A 12 B 29 C 9; logo_or_mark A 12 B 4; photo B 25. Per clip: C appears in 5 clips (clip04 7.2 s, clip05 3.9 s, clip14 2.7 s, clip17 2.2 s, clip07 1.9 s).
- Evidence: n=145 units, 19 clips, every unit coded on every-frame sheets; X_units.csv (build_class), numbers.json build_classes, sheets/
- Confidence: medium (one coder; class boundaries are judgements recorded per unit)

### [X02] Treat the inventory's "bespoke art" as a picture plus parametric events: only character performances need hand animation.

- Values: Inventory class -> this pass: bespoke_art -> B 28, -> C 9; capture -> B 29; drawable -> A 63, -> B 16 (drawable units that still need one picture: app screenshots, mascot sprites, a fire overlay). The 9 C units are all characters or rendered scenes that deform: cartoon figures (clip04 x5, clip05@138, clip07@676), a helmeted figure (clip05@0), a clay caricature (clip14@0), a silhouette raising its arms (clip17@40).
- Evidence: n=145; X_units.csv vs graphics study G_inventory_build.csv; numbers.json build_classes.vs_graphics_inventory
- Confidence: medium (C/B boundary judged on how the object moves, by eye)

### [X03] Make every picture act: draw an anchor, then add events while the clause is spoken; give a unit about 1.3 + 0.032 x its length in frames events (median 3).

- Values: Events per unit median 3 (p10 1, p90 5.6, mean 3.33, max 10); 138 of 145 units have at least one event; the 7 without are single footage shots of 8-62 frames in clip16 (montage and stock clips). Events vs unit length r = 0.63; one event per ~19 unit frames. 483 events in all.
- Evidence: n=145 units, 483 events; X_events.csv, X_anatomy.csv, X_bursts.json (every-frame change bursts)
- Confidence: high

### [X04] Show the anchor on the cut frame (or the empty plate for 1-2 frames, about one unit in eleven) and start acting almost at once: the anchor is alone for about 2 frames.

- Values: Anchor object complete on the cut frame in 132 of 145; 13 open on the plate alone for 1-2 frames before the anchor pops (clip02@202, @952; clip03@108, @175, @365, @801; clip05@486; clip08@39; clip10@505; clip13@162, @332; clip19@203, @359), as in motion rule M09. Anchor alone before the first event: median 2 frames (p10 0, p90 15); <= 3 frames in 88 of 138, <= 10 in 113 of 138; first event within 10 frames of the cut in 113 of 138.
- Evidence: n=145; X_anatomy.csv; e.g. clip09@464-468 (counter starts rolling on the cut), clip12@212 (first badge drops on the cut)
- Confidence: high
- Note: the verifier put the empty-plate share at about 6 % of cuts ([M09]); 13 of 145 units here is consistent.

### [X05] Space events about 12 frames apart (one per 1.4 spoken words) and keep acting until the cut: hold the finished picture only about 4 frames.

- Values: Interval between event starts median 12 frames (p10 4, p90 32, n=345); speech runs ~8.3 frames per word. Event duration median 8 frames (p10 2, p90 31). Hold after the last event completes: median 4 frames (p10 0, p90 18); 45 of 138 units are still moving on their last frame; last event completes within 15 frames of the cut in 117 of 145.
- Evidence: n=345 intervals, 138 units; X_anatomy.csv, X_events.csv
- Confidence: high

### [X06] Couple events to the clause, not to word onsets: place each event while the clause that names it is spoken; frame-accurate onset locking is not part of the style.

- Values: Event starts more than 1 frame after the cut (n=416): within +-1 frame of the nearest word onset 23.1 % vs 22.8 % for random frames in the same units; within +-2 frames 45.7 % vs 44.2 %; median |offset| 2.18 vs 2.30 frames. Completions (n=482): 25.1 % vs 22.9 %. The word at the event is a content word 60.3 % vs 57.2 % at random. Hand-assigned landing words give offsets of -0.1 frames median (p10 -4.7, p90 +4.6) but are small by construction (nearest word).
- Evidence: n=416 / 482 events; sync_test.json, X_sync_offsets.png
- Confidence: medium (faster-whisper word times +-2 frames; a word onset every ~8 frames limits the test)

### [X07] Show every spoken number as a figure that is already moving before the word and lands on its value about 7 frames after it.

- Values: 38 figures show a number; the number is spoken in 21. Motion start minus spoken-number onset: median -5 frames (p10 -21.5, p90 +3). Landing minus onset: median +6.9 frames (p10 +1.0, p90 +30.0); 12 land 0-10 frames after, 8 more than 10 after (odometers and multi-step counts: clip09 +26, clip11 +27, clip16 +43), 1 lands before (clip03 price, -12). Examples: "twice" -> 2x at +0 (clip10@357), "48" -> numeral at +1 (clip11@272), "8" -> score at +4 (clip06@883), "$100 million" -> lands +2 after "million" (clip18@768).
- Evidence: n=38 figures (21 spoken) in 14 clips; X_numbers_on_screen.csv
- Confidence: medium (landing frames by OCR in 9, by eye on every-frame sheets in 12)

### [X08] Count numbers up with cubic-bezier(0.65, 0, 0.35, 1) over about 27 frames (12-35); digits change every frame and nothing overshoots.

- Values: Ease-in-out counters and value bars, OCR every frame (23 tracks, 8 clips): fixed cubic-bezier(0.65,0,0.35,1) with free start/duration RMSE median 0.0062, duration median 26.7 frames (p10 12.4, p90 35.3); free-bezier median (0.662, 0.025, 0.358, 0.936) for counters, (0.638, 0.009, 0.383, 0.921) for bars; best named curve easeInOutQuart in 17 of 23; linear RMSE median 0.028, easeOutExpo 0.045. Cleanest: clip09@464-510 0 -> 5,000,000, RMSE 0.0001 at T 46; clip10@508-520 0 -> 54.9 %, 0.0002 at T 12. No track exceeds its final value (by eye on the sheets).
- Evidence: n=23 tracks (clip03, 08, 09, 10, 13, 14, 16, 18); X_counters.csv, X_counter_curves.png, X_strip_counter_odometer_clip09.png, numbers.json counters
- Confidence: high

### [X09] Count linearly when each unit of the number is a visible item (a tile per application, a step of a progress bar), and fast with an ease-out for a score total.

- Values: Linear: clip05@233-268 0 -> 69 (36 frames, linear RMSE 0.0069 vs ease-in-out 0.034) while one tile fills per application; clip05@298-321 0 -> 20 (26 frames, 0.0113); clip11@2-55 7 -> 73 % (54 frames, 0.0043) with a mascot walking the bar. Score totals: clip05@541-547 0 -> 73 cubic-bezier(0.16,1,0.3,1) T 9.9 RMSE 0.0016; clip17@888-894 0 -> 1,260 easeOutExpo T 6.2 RMSE 0.006. Social counts climb geometrically: clip16@59-107 12.6k -> 1.2M, ease-in-out on log(value) RMSE 0.0042.
- Evidence: n=3 linear, 2 ease-out, 1 log tracks (clip05, 11, 16, 17); X_counters.csv, counters_summary.json
- Confidence: low (few instances per variant)

### [X10] Fill a usage or limit bar to the limit with the same ease-in-out over 26-35 frames, turn it red at the limit, and make the consequence happen on the next beat.

- Values: Value bars (8 tracks in 4 units): duration 26.0-35.4 frames, fixed-curve RMSE 0.0034-0.0175. At the limit: clip03@139-142 bar turns red, then the limit modal pops @150; clip08@905-908 red, flames from @911; clip10@1-33 bars to 100 %, burn from @36; clip13@693-723 session 62 -> 100 % on "runs out" (0 frames), train stops at the signal. The reverse (drain to 0 %) uses the same curve: clip10@741-768, 35 frames.
- Evidence: n=5 units in 4 clips; X_counters.csv (c08_usage, c10_usage, c13_session, c10_drain), X_strip_usage_bars_clip13.png
- Confidence: medium

### [X11] Fill score bars fast with an ease-out (to 97 % in 6-10 frames), staggered 3-5 frames, and clock wedges either fast (14 frames, ease-out) or steadily (~27 frames, near linear).

- Values: Score-card bars clip05@529-546: starts 529, 532, 537, 541; each bar 97 % in 6-8 frames; easeOutExpo / cubic-bezier(0.16,1,0.3,1) RMSE 0.005-0.036. clip06@848-853 four bars to 82 % in 6 frames, then +13 % at 861-866 (two-stage). clip07@208-222 hour wedge easeOutExpo RMSE 0.010 (97 % in 14 frames). clip05@580-608 wedge near linear (linear RMSE 0.030, easeInOutSine 0.027, 28 frames). clip10@271-292 serpentine track cubic-bezier(0.42,0,0.58,1) RMSE 0.026.
- Evidence: n=11 fill tracks in 5 clips; X_fills.csv, X_fill_curves.png, X_strip_clock_wedge_clip07.png
- Confidence: medium (pixel-share method; two bars excluded for ROI contamination, see fills_fit.json)

### [X12] Show a counted set as exactly that many items, each popping in 1-2 frames: one segment per unit about 6 frames apart, grid cells about 1 frame apart.

- Values: Spoken count = items shown in 7 of 7 checked: "three apps" 3 framed apps (clip02@203-217), "three ideas" 3 cards (clip06@491-524), "three that matter" 3 cards (clip07@97-104), "eight sizes" 8 width steps (clip11@536-578), "four hours" 4 segments (clip07@636-654), "three rounds" 3 lights (clip08@718-740), "an hour" one full wedge (clip07@208-222). Donut segments pop at 636, 642, 648, 654 (each 1-2 frames); week-grid cells fill ~1 per frame (clip18@535-547).
- Evidence: n=7 counted sets in 6 clips; X_fills.csv (f07_donut, f18_week_grid), X_strip_donut_segments_clip07.png
- Confidence: medium (counts by eye on full-resolution frames)

### [X13] Choose from fifteen device families; seven of them carry three quarters of the share: fill or sweep, one by one, count up, name reveal, footage, object action, path draw.

- Values: Primary family (units / clips / seconds): one_by_one 18 / 12 / 47.3; fill_or_sweep 17 / 11 / 42.4; count_up 17 / 9 / 41.5; footage 16 / 3 / 23.9; name_reveal 15 / 10 / 23.8; path_draw 13 / 7 / 35.5; object_action 10 / 11 / 32.1 (= 106 of 145 units); then character_acts 9, open_or_enter 8, verdict_mark 5, big_numeral 4, before_after 5, gate_check 4, machine_output 3, interface_demo 1. 92 fine devices; the most used single device is counter_roll (13 units, 8 clips).
- Evidence: n=145 units; X_family_reach.csv, X_device_reach.csv, numbers.json device_definitions
- Confidence: medium (family grouping is this analyst's)

### [X14] Pick the device family from the idea: quantity -> count up (else fill, big numeral); a thing named -> name reveal; enumeration -> one by one; change of state -> object action; demonstration -> footage, open/enter or before/after; check -> gate; route and connection -> path draw.

- Values: Primary family per idea kind: quantity 32 -> count_up 16, fill_or_sweep 6, big_numeral 4, path_draw 2, one_by_one 2; demonstration 25 -> footage 13, open_or_enter 4, before_after 4, character_acts 2; a thing named 20 -> name_reveal 14, footage 2; change of state 11 -> object_action 5, fill_or_sweep 3; enumeration 10 -> one_by_one 9; comparison 9 -> fill_or_sweep 3 (race bars, bar chart), open_or_enter 2 (iceberg), 4 others; outcome 6 and claim 6 -> character_acts 2 each; check 4 -> gate_check 3; process 5 -> path_draw 2; steps 3 -> path_draw 2; repetition 4 -> one_by_one 2; route 2 and connection 2 -> path_draw 2 each; cause and effect 3 -> one_by_one 2 (a bill growing).
- Evidence: n=145; X_decision_table.csv, numbers.json idea_to_device_map
- Confidence: medium (idea kind and family coded by one reader; small n for most kinds)

### [X15] Use a metaphor for changes, outcomes, claims and comparisons, a diagram for quantities, and the literal thing for names and demonstrations.

- Values: Mode by idea kind: change of state metaphor 10/11; outcome metaphor 6/6; claim metaphor 5/6; comparison metaphor 6/9; quantity diagram 21/32; a thing named literal 15/20; demonstration literal 17/25. Overall: metaphor 50 units (36.2 % of time), diagram 44 (33.7 %), literal picture 43 (21.2 %), interface enactment 8 (8.9 %).
- Evidence: n=145; X_decision_table.csv (modes column), X_units.csv
- Confidence: medium

### [X16] Bring the items of a set in one per beat, about 11 frames apart, each dropping in on an ease-out that is 90 % done in about 7 frames, with no overshoot.

- Values: Same-type event sequences: 20 sequences, 75 items, interval median 10 frames (p10 5.4, p90 16); 22 % <= 6 frames. Tracked lanyard badges (clip12@212-272): starts 212, 224, 235, 245, 257 (intervals 12, 11, 10, 12); drop 306-594 px from above; easeOutExpo RMSE 0.030-0.039 (T 13.7-18.1), t50 2.1-3.1 frames, t90 5.6-6.6 frames; final position reached without passing it (bottom edge 528-529, 994).
- Evidence: n=75 items (sequences) + 5 tracked items; X_motion_tracks.csv (badge_*), X_strip_badge_drop_clip12.png, numbers.json anatomy.same_type_sequences
- Confidence: medium (one tracked instance; stagger from hand-coded events)

### [X17] Reveal a name in three beats: the mark turns up (a 5-frame edge-on flip, a focus pull or a type-on), a ring pulses out to 1.5x the mark over 8 frames, then the name line and a shine follow; the name is legible about 9 frames after it is spoken.

- Values: Flip: clip13@130-135 scaleX 1 -> 0 -> 1 in 5 frames, content swaps edge-on at @132-133; the same flip at @408-410 and @671-672 (3 per clip). Ring: radius 286 -> 386 px (mark ~255 px) over @134-142, near linear (RMSE 0.058), gone by @143. Type-on 1.1-2.2 frames per character (clip11 wordmark 2.0, clip14 title 1.4, clip03 name 2.2, clip17 prompt 1.1). Name legible (event completion) after the name onset: median +9 frames (p10 +2, p90 +26, n=32 name-landing events). Name family in 10 clips.
- Evidence: n=16 name-reveal units; X_motion_tracks.csv (ring_pulse_clip13_avatar, type_*), X_strip_flip_ring_reveal_clip13.png, device_motion.json
- Confidence: medium (ring and flip measured on one clip; type-on on 6)

### [X18] Land a verdict stamp or badge from about 1.25x to 1.0 in about 6 frames (90 % in 2) on cubic-bezier(0.16, 1, 0.3, 1), on the noun it judges; never bounce.

- Values: FREE stamp clip10@255-260: width 642 -> 553 -> 525 -> 516 -> 513 px (1.25x), cubic-bezier(0.16,1,0.3,1) RMSE 0.0022 at T 5.8, t90 2.0 frames. X badge clip14@634-635: 1.53x -> 1.0 in one frame. GOOD FIT clip05@549 pops at size with a ring pulse over 6 frames. 8 stamp events: start minus landing word median +2.0 frames (p10 -1.3, p90 +3.7), on a noun in 5 of 8 (HIRED on "hunter", EXCLUSIVE on "prompt", GOOD FIT on "fit", FREE on "fees", skill chip on "task").
- Evidence: n=3 tracked + 8 stamp events in 5 clips; X_motion_tracks.csv (free_stamp_land, x_badge_land, goodfit_stamp_land), X_strip_stamp_land_clip10.png, X_strip_xbadge_land_clip14.png
- Confidence: low (two scale tracks)

### [X19] Draw paths with an ease-out tip (a route segment of 280 px in about 12 frames) and chart curves with an ease-in-out (about 16 frames); in a chain, draw the connector 4-6 frames before the node it reaches.

- Values: Route clip15@218-232 last segment tip x 729 -> 1009 px: easeOutCubic RMSE 0.0076 (T 12.3, t90 10.6 frames); the route bends round the barrier (@208-223) before it. Growth curve clip18@866-882 drawn length: cubic-bezier(0.42,0,0.58,1) RMSE 0.014 (T 15.9). Node chains: clip02@569-600 connector then node, 4-6 frames apart; clip07@240-254 path draws first, cards attach after. Path family 13 units in 7 clips.
- Evidence: n=2 tracked + 13 units; X_motion_tracks.csv (route_draw, growth_curve_draw), X_strip_route_draw_clip15.png, X_strip_growth_curve_clip18.png
- Confidence: low (two tracked draws)

### [X20] Act out "add / plug in / give it" by lowering the item into a slot with an ease-in-out (300 px in about 32 frames) and lighting the machine on the next beat.

- Values: clip15@372-404 repo card top edge 120 -> 420 px: easeInOutCubic RMSE 0.0086 (free bezier (0.53, 0.13, 0.31, 1.0) RMSE 0.0064, t50 19 frames); module lights and its bar fills @405-412 on "it" (0 frames). Same device: clip04@566-604 cartridge into a console, lights from @611; clip06@87-90 skill card drops into the mascot, LEVEL UP bar fills @90-101.
- Evidence: n=3 units in 3 clips (1 tracked); X_motion_tracks.csv (repo_card_insert), X_strip_insert_card_clip15.png
- Confidence: low

### [X21] Enter a scene by pushing into its screen with an ease-in-out (2.2x in about 34 frames), or by sinking, opening a lid or doors; this family opens 8 units.

- Values: clip06@0-34 monitor width 409 -> 895 px (2.19x): on log scale easeInOutQuart RMSE 0.0046, free bezier (0.57, 0.21, 0.31, 1.0) RMSE 0.0017, t50 14.7, t90 22.7 frames. Camera events (8): duration median 20.5 frames (p10 9, p90 40), e.g. clip04@246-300 sink below the waterline (54 frames), clip14@82-108 push into one screen, clip12@62-76 through elevator doors. Lid/door opens: 5 events, 8-18 frames (clip01@140-147 cloche lifts on the name).
- Evidence: n=8 units in 5 clips (1 tracked); X_motion_tracks.csv (push_in_monitor_clip06), X_strip_push_in_clip06.png, X_strip_lid_reveal_clip01.png
- Confidence: low (one scale track)

### [X22] Make the picture accumulate: events add, fill, mark or transform; removing something is rare (2 %) and is itself the point (burn away, shred, reject).

- Values: Event types (n=483): pop 105, move 77, slide 42, swap 34, draw 32, fill 28, fade 27, count 24, pulse 21, recolor 15, type 15, grow 14, morph 12, exit 10, camera 8, stamp 8, open 5, resolve 3, multiply 3. The 10 exits: cards drawn back under the cloche, papers blown away, a swatter dropped, a burned card, rejected strips falling away, a badge leaving.
- Evidence: n=483 events; X_events.csv (type column), numbers.json anatomy.event_types
- Confidence: high

### [X23] Give a video one recurring anchor object and come back to it: the same prop returns in 2-4 units of a clip, changed each time.

- Values: clip13 glass tank in 4 units (@0 leaking, @396 and @641 badge holes for each tool, @891 refilling); clip07 course medallion / corner badge in 4 (@0, @53, @204, @629); clip08 gate in 3 (@149, @285, @606); clip05 bird mascot in 3 (@138, @578, @960); clip10 crystal mark in 3 (@74, @149, @640) and usage card in 2 (@0 burns, @720 drains). The same device repeats 3 times in clip13 (flip reveal) and clip08 (gate).
- Evidence: n=6 clips; X_units.csv, sheets/clip13_*.jpg, clip08_*.jpg
- Confidence: medium (recurrence counted by eye)

### [X24] Place a supplied object picture as one hero prop centred on x = 540, about 0.68 of the frame wide, centred near y 600 in the panel or y 750 full frame, with 0-2 small secondary props.

- Values: Hand-boxed rendered props (n=10, 7 clips): width share 0.44-0.84 (median 0.66), centre x 487-565 (median 539). Vision foreground on rendered-prop units (n=21): largest width share median 0.71 (p10 0.38, p90 0.85); centre y panel median 616 (p10 491, p90 816, panel 0-957), full frame median 748 (p10 624, p90 857). Instances per frame 1 in 13, 2 in 7, 3 in 1 of 22.
- Evidence: n=10 hand + 22 automatic; X_props_measured.csv, X_prop_look.csv, numbers.json build_spec.prop_look_extension
- Confidence: medium (automatic foreground boxes are noisy on gradient plates)

### [X25] Cut the prop out with a hard anti-aliased edge (no outline, no feather), light it from the top, and shadow it only below: about 0.8 of the plate at the contact, half recovered by 20-30 px, gone by 60-100 px.

- Values: Edge 10-90 % luma transition median 4 px (1.8-5.6, n=7 props; glass tank 9.2). Below / beside ratio at 3 px: glass tank 0.73, credit card 0.69, price device 0.83, card pile 0.88; at 30 px 0.81-0.95; at 100 px 0.94-0.99. Above: 0.96-1.00 in every clean case (n=8). Body top minus bottom luma +9 to +22 (median +13, n=6). Cartoon scenes (9 units) are the exception: dark outlines, no plate.
- Evidence: n=10 props in 7 clips; X_props_measured.csv (profiles by px), colour study numbers.json build_spec.prop_look for the fitted CSS shadow
- Confidence: low (hand boxes; plate-beside reference is disturbed by nearby props in 3 of 10)
- Note: the colour study's floating-prop shadow was not re-measured by the verifier (items 12, 27); see [C19].

### [X26] Frame a user photo or screenshot as a rounded card, phone or player (0.43-0.72 of the frame wide) with chips on its edge; go full bleed only with generated footage.

- Values: Photo/footage units: 30; framed 10 (cards, phone, player, tiles, filmstrip, deck), full bleed 20, all of them AI-generated or stock footage in clip16 (12) and clip18 (7) plus one aerial photo with a pin (clip06@466). Measured by eye on gridded frames: clip16@90 card 520 px wide, radius ~28 px; clip18@640 776 px, radius ~37 px, 6 px dark rim; clip19@120 two tiles 459 px, radius ~28 px, 4 px white rim. Overlays on the edge: like counter, payment notifications, name tags and audio meters, avatar chips, voice pill.
- Evidence: n=30 units in 4 clips; framing by eye on sheets/clip16_*.jpg, clip18_*.jpg, clip19_*.jpg
- Confidence: medium (framing by eye; radius by eye on 3 cards)

### [X27] Let plain footage be the picture only for sentences that show what a tool makes, cut on caption words, without inner events.

- Values: Footage family 16 units in 3 clips (clip16, clip18, clip19); the 7 units with no event are footage shots of 8-62 frames (clip16@109-166 four shots, one per caption word: 20, 8, 12, 18 frames; clip16@362, @1161, @1184 stock clips). Footage idea kinds: demonstration 13, a thing named 2, claim 1.
- Evidence: n=16 units; X_units.csv, sheets/clip16_*.jpg
- Confidence: medium (topic-driven: two clips about AI video carry most of it)

### [X28] Render every animation on ones; the reference holds about 5 % of animated frames as duplicates (on twos), up to 21 % in one clip, which is not a style to copy.

- Values: Inside active stretches (both neighbours change by mean |dY| > 1.0), frames identical to the previous one (mean |dY| < 0.25): 271 of 5,513 (4.9 %); clip12 51 of 244 (20.9 %), clip18 9.5 %, clip03 7.8 %, clip13 7.7 %; 0 in clip01, clip06, clip15. Tracked: clip12 badges 8-12 repeated frames per 20-frame drop; clip04 typing advances every 2 frames.
- Evidence: n=19 clips, 5,513 active frames; twos.json, X_motion_tracks.csv
- Confidence: low (source of the cadence not established; motion study M27 found the same)

### [X29] Never observed in 145 units: overshoot or bounce on counters, fills, drops or stamps; annotation arrows or leader lines pointing at the picture; a unit carrying two ideas; a counter reversing mid-count; text in the picture longer than a short label repeating the caption.

- Values: Counters 23 tracks and fills 25 tracks: no value beyond its end; badge drops settle at 528-529 / 994 px without passing; stamps shrink monotonically to 1.0 (513 px). Arrows: 0 annotation arrows (connectors exist only as parts of flow diagrams and routes; an arrow cursor clicks in 3 units: clip01@130, clip03@240, clip16@718). Removal events 10 of 483. Picture text is labels (1-4 words: "FREE", "GOOD FIT", "1 hr", "LEVEL UP", "Usage limit") or the interface itself.
- Evidence: n=145 units, 483 events; X_counters.csv, X_fills.csv, X_motion_tracks.csv, sheets/
- Confidence: medium (absences by eye on the sheets; every 3rd frame shown outside change bursts)

## Rules: interfaces and text cards

### [X51] Build interface and text-card units from a small device vocabulary: ten devices cover 60 % of units and 63 % of their time; give each unit one main device.

- Values: Ranked by units / clips / seconds: before_after_wipe 14/8/33.9; prompt_typed_send 10/7/17.0; items_stack_in 10/6/25.9; site_capture_shown 9/5/18.4; drop_into_composer 8/8/19.6; cursor_operates_ui 7/6/21.2; picker_lands 7/5/12.7; code_types_in_window 6/4/12.5; markup_on_capture 5/4/10.6; verdict_badge 5/4/10.3. Top ten: 81 of 134 units, 182.1 of 288.1 s. 40 devices in all; 17 are used once. Every device is defined in numbers.json device_definitions.
- Evidence: n=134 units (8,635 frames, 19 clips); X_device_vocabulary.csv, X_units.csv; e.g. before_after_wipe clip15@855-899, prompt_typed_send clip16@480-534, picker_lands clip15@512-576 (strips/S_*.jpg).
- Confidence: medium (device names assigned by four coders under one protocol; reach counts are exact for the coding)

### [X52] Plan by device family: entry (the user gives the tool something), progress (the tool works through it), transform (before becomes after) and show carry most of the time; judge, choose, operate, many-and-few, connect fill in.

- Values: Units / seconds / clips: progress 23 / 59.1 / 12; transform 19 / 48.7 / 12; entry 25 / 48.6 / 15; show 27 / 44.6 / 13; judge 11 / 22.2 / 7; operate 7 / 21.2 / 6; many_and_few 9 / 17.6 / 7; choose 8 / 14.1 / 5; connect 4 / 8.7 / 4; compare 1 / 3.2 / 1.
- Evidence: n=134 units, 19 clips; numbers.json device_family_reach and device_definitions (family per device).
- Confidence: medium (families are the analyst's grouping of coded devices)

### [X53] Choose the device from the kind of idea the clause carries: change of state -> before_after_wipe; choice -> picker_lands; repetition -> items_stack_in; steps -> drop_into_composer or prompt_typed_send; demonstration -> prompt_typed_send, cursor_operates_ui or a played capture; a thing named -> name_sign or the captured site; comparison -> wall_of_sameness; connection -> hub_and_spokes; attribute -> verdict_badge.

- Values: Idea kind (units): leading devices with counts. change of state (22): before_after_wipe 10, form_drives_preview 2, ticks_down_list 2. choice (8): picker_lands 5. repetition (7): items_stack_in 5. steps (14): drop_into_composer 5, prompt_typed_send 3. demonstration (26): prompt_typed_send 6, cursor_operates_ui 4, video_in_player 4, site_capture_shown 3. a thing named (14): name_sign 4, site_capture_shown 4, code_types_in_window 3. enumeration (18): items_stack_in 3, medallion_title 3, design_specimen 2, markup_on_capture 2. comparison (7): wall_of_sameness 3. process (9): print_out 2, drop_into_composer 2, site_capture_shown 2. connection (5): hub_and_spokes 2. attribute (3): verdict_badge 2. quantity (1): verdict_badge 1.
- Evidence: n=134 units; X_idea_to_device.csv; numbers.json idea_to_device and build_spec.planner_decision_table.
- Confidence: medium (idea kind and device are one coder judgement per unit; several kinds have n under 10)

### [X54] Most interface units are enactments of the interface itself, not metaphors: show the actual tool doing the step.

- Values: Mode by units / share of time: interface enactment 88 / 70.0 %; literal picture 23 / 13.2 %; diagram 12 / 9.8 %; metaphor 11 / 7.0 %. Idea kinds: demonstration 26, change of state 22, enumeration 18, a thing named 14, steps 14, process 9, choice 8, comparison 7, repetition 7, connection 5, attribute 3 (own label), quantity 1, route 0.
- Evidence: n=134 units, 19 clips; X_units.csv (mode, idea_kind); numbers.json mode, idea_kind_counts.
- Confidence: medium (mode is a judgement; name_sign and medallion_title normalised to literal picture)

### [X55] Anatomy of a unit: the anchor is on screen on the cut frame, the act starts within 2 frames, events arrive about every 5 frames, and the next cut comes about 4 frames after the last event settles.

- Values: Anchor first frame minus cut: median 0 (on the cut frame in 80.6 %; p90 1; max 10). Anchor alone before the first event: median 2 frames (p10 0, p90 10, max 49). Events per unit: median 6 (p10 2, p90 11); panel 4, full-frame 7. Event start spacing: median 5 frames (p10 1, p90 19). Hold after the last event completes: median 4 frames (p10 0, p90 23). Events per second: median 2.9 (p10 1.5, p90 5.1). Frames at 29.97 fps.
- Evidence: n=134 units, 838 events, 19 clips; X_units.csv, X_events.csv; numbers.json anatomy.
- Confidence: high (start and complete frames read from every-frame sheets; counts are exact for the coding)

### [X56] Land an event on the onset of the word it acts out: median 0 frames, about 6 frames early to 7 late; fill the rest of the unit with untied events.

- Values: 439 of 838 events (52 %) act out a specific spoken word. Offset from that word's onset: median 0 frames (p10 -6, p90 +7, range -14..+14); within +-2 frames 46 %, +-3 58 %, +-5 73 %, +-8 89 %. All 838 events vs the nearest onset: 62.8 % within +-2 frames against 47.2 % for random frames of the same units (null, 2,680 samples). By device: picker_lands 84 % of tied events within +-3, drop_into_composer 76 %, markup_on_capture 24 % (marks trail their word by a median 7 frames).
- Evidence: n=439 tied events in 19 clips; X_events.csv (word, offset, tie, nearest_offset), X_sync_semantic_events.csv; numbers.json sync, top10_devices.
- Confidence: medium (faster-whisper onsets are about +-2 frames; which word an event acts out is a coder judgement)

### [X57] Tie events to the content words of the clause, not its first word: the cut takes the clause's first word, the events take its nouns and verbs.

- Values: Role of the tied word: noun or name 53 % (233), verb 31 % (136), adjective 10 % (44), function word 4 % (19), number 1.6 % (7). Position in the clause (graphics study clauses): middle 82 % (358), last word 15 % (64), first word 4 % (17); median relative position 0.57. First tied event after the cut: median 7 frames (p10 1, p90 31). In 51 of 133 units the first event acts out a word later than the cut word. Offsets by role: noun median +1, verb 0, adjective 0 frames.
- Evidence: n=439 tied events; clause boundaries from graphics study G_clauses.json; X_sync_semantic_events.csv; numbers.json sync.position_in_clause.
- Confidence: medium (roles assigned by the coders; clause boundaries from an unaligned transcript)

### [X58] Play events in the order the words are spoken, and make at least one event hit its word within 3 frames in most units.

- Values: Consecutive tied events in spoken order: 159 of 159 pairs. Units with at least one tied event within +-3 frames of its word: 103 of 134 (77 %). Units with 2+ events: 130 of 134.
- Evidence: n=134 units, 159 pairs; numbers.json explanation_properties, sync.semantic_pairs_in_spoken_order.
- Confidence: medium (order agreement may be inflated because coders tied words while reading in order)

### [X59] Bring the parts of an interface in fast: slides and grows dominate, each settles in about 4 frames; pops and fades are the minority.

- Values: Measured on every frame for 313 of 332 entrance-type events (NCC with scale search): slide 142 (45 %), grow 88 (28 %), pop 52 (17 %), fade 17 (5 %), land from larger 14 (4 %). Slides: first visible 20 px from rest (p10 6, p90 111): a small rise of median 13 px (87 slides, 61 %) or a travel of median 68 px (p10 32, p90 214; 55 slides); from below 44 %, above 29 %, right 18 %, left 9 %. Grows: first visible at scale 0.58 (p10 <=0.40, the search floor; p90 0.89), often travelling from their source. Lands: from 1.165 (p10 1.09, p90 1.27). Fades: from contrast 0.75. Frames from first visible to settled (3 px, 2 % scale, 6 % contrast): slide 4 (p10 2, p90 6), grow 4 (2-7), land 4.5 (3-5.7), fade 3 (1.6-4.8), pop 2 (0-5.9).
- Evidence: n=313 tracked events, 19 clips; X_entrance_tracks.csv; numbers.json entrances; e.g. clip07@431-449 cards grow 0.73->1 in 4 frames, clip07@178-180 title word rises 22->0 px.
- Confidence: high (automatic every-frame tracking on all clips; half-resolution tracking, 1-frame granularity)

### [X60] Ease every entrance out with cubic-bezier(0.16, 1, 0.3, 1) over about 12 frames (visibly settled by frame 4); never overshoot.

- Values: Clean fits (RMSE < 0.08): slides n=91, median RMSE cubic-bezier(0.16,1,0.3,1) 0.03, easeOutExpo 0.03, easeInOutCubic 0.06, linear 0.07; grows n=66: 0.03 / 0.03 / 0.05 / 0.09; lands n=9: 0.03 / 0.03 / 0.06 / 0.05; fades n=14: 0.03 / 0.03 / 0.04 / 0.06. Best named curve among slides: easeOutQuart 18, easeOutQuad 15, linear 14, easeOutExpo 13, easeOutCubic 11 (ease-out family 65 of 91). Overshoot: scale above 2 % in 3 of 102 grows/lands (above 4 % in 1); slides passing rest by more than 6 px in 7 of 142.
- Evidence: n=180 clean curve fits, 19 clips; X_entrance_tracks.csv (best, *_rmse); agrees with motion M12-M16.
- Confidence: medium (4-frame settles leave few points per curve; ease-out variants are not separable)
- Note: the verifier confirmed this ease for scene scale-ins ([M06], item 9).

### [X61] Stagger items that arrive one after another by about 5 frames (list rows and cards), 4 frames for items dropping into a composer, 3-5 frames for picker steps, 3-4 frames for title words.

- Values: Same-kind consecutive events: items_stack_in median 5 frames (p10 2, p90 13, n=29); drop_into_composer 4 (3-12, n=11); picker select steps 3 (clip19@526-538) to 5 (clip15@518-529); medallion title words 3-4 (clip07@178-184, @385-397). All events in a unit: start spacing median 5 frames (p10 1, p90 19).
- Evidence: n=29+11+13 staggers in 14 clips; numbers.json top10_devices.*.same_kind_stagger_frames, selections.step_interval_examples; strips/S_stack_clip09_545.jpg.
- Confidence: medium

### [X62] Type user prompts at about 1.6 characters per frame (about 48 per second): 1-2 characters every frame inside a word, with 0-3 idle frames between words on slower prompts.

- Values: User-typed spans (prompts, fields, chat requests): n=31 spans in 20 units, 13 clips: median 1.59 chars/frame (p10 0.86, p90 2.36, range 0.55-2.56); median 21 characters over 11 frames. Per-frame cadence (14 clean ink-growth tracks): even 1-2 chars every frame on fast spans (clip11@220-244, 43 chars in 25 frames, no idle frame, linear R2 0.99; clip19@306-325, 49 chars in 20 frames); slower prompts add 1 char per frame and pause 2-3 frames after each word (clip06@352-378: 23 chars in 27 frames, 10 idle frames).
- Evidence: n=31 spans; X_typing_spans.csv; typing/X_typing_clip06_342.png, X_typing_clip11_209.png, X_typing_clip19_303_fast.png, X_typing_clip08_411_slow.png; numbers.json typing.
- Confidence: high for the rate (13 clips); medium for the per-frame cadence (14 clean tracks)

### [X63] Start typing on a word onset but type a short plausible request, not the spoken words; show a thin accent-coloured caret, and type a slash-command chip first when a skill is named.

- Values: Typing start minus nearest word onset: median +0.7 frames (p10 -1.8, p90 +2.5; 23 of 31 within +-2). Typed words also spoken within +-3 s: 28 of 169 (17 %); 17 of 48 spans share any word with the speech. Caret: thin vertical bar in the accent colour (orange on light composers) in 5 units, blinking off in pauses. Slash-command token in the accent colour typed before the request in 3 units (clip11@213-216, clip11@775-781, clip12@299).
- Evidence: n=31 user spans in 13 clips; X_typing_spans.csv; numbers.json typing.typed_words_spoken_within_3s, typing.caret.
- Confidence: medium (caret and slash-chip counts by eye from the coders' notes)

### [X64] Optionally dictate: when the prompt is the sentence being spoken, start each typed word -3 to +1 frames from its spoken onset.

- Values: clip06@403-462: six dictated words start +1, -2, -1, +1, -1 and -3 frames from their spoken onsets; letters inside a word 1-2 per frame; the only such unit of 31 with user typing.
- Evidence: n=1 unit; typing/X_typing_clip06_403_wordpaced.png.
- Confidence: low (seen once)

### [X65] Let the machine write faster than the user: generated scripts and answers stream 5-8 characters per frame, code arrives as whole lines every 1.4-4 frames, and code panes scroll at a constant speed.

- Values: Machine-written spans n=17 in 5 clips: generated script clip16@578-614 5.2-8.0 chars/frame per line (linear R2 0.99+); code lines clip03@947-966 14 lines in 20 frames, each fading in over 1-2 frames; clip10@209-231 lines every 2-4 frames. Code scrolls linear: clip15@689-715 15.5 px/frame (RMSE 0.001), clip08@1-38 68 px/frame (0.013), clip15@256-272 2 px/frame. Speed race clip10@408-504: product card about 6 chars/frame vs about 2 for the others.
- Evidence: n=17 spans + 4 scrolls in 5 clips; X_typing_spans.csv, X_wipes_scrolls.csv; strips/S_code_clip15_689.jpg.
- Confidence: medium (5 clips)

### [X66] Use one arrow pointer, only when a control is operated: a white arrow with a black outline and soft shadow, about 45 x 48 px, moving in straight lines; a hand only for grabbing.

- Values: Cursor in 31 of 134 units (12 clips; 35 units with cursor events): arrow 29, hand 1 (line-art grabbing hand, clip07@481-492), arrow then paw 1 (clip01@540-577). Never two pointers. Size: template 39 x 42 px at clip19@640, best scale 1.15 in 12 of 17 clean tracks (about 45 x 48 px), 1.0-1.3 overall (by eye and by template scale). Path straightness (chord / path) median 1.00 (min 0.89, n=17).
- Evidence: n=31 units; X_interface_detail.csv (cursor), X_cursor_moves.csv; cursor_template.npy.
- Confidence: medium (look read by eye on a few crops; size from template scale)

### [X67] Move the pointer with ease-in-out between targets (about 11 frames, cubic-bezier(0.75, 0, 0.25, 1)) and with a strong ease-out when it first enters (about 8 frames).

- Values: Clean tracks n=17 in 6 clips: duration median 10 frames (p10 6, p90 17), distance 290 px (121-663), peak speed 92 px/frame (45-132). Travel moves (peak in the middle) n=9: best easeInOutQuart 4, easeInOutQuad 2, easeInOutCubic 2, css ease-in-out 1; median RMSE easeInOutCubic 0.02 vs easeOutExpo 0.12; free bezier about (0.75, 0, 0.25, 1); 11 frames (9-21). Entering moves (peak in the first third) n=7: easeOutQuart 3, easeOutExpo 3, enter curve 1; RMSE easeOutExpo 0.01; free bezier about (0.15-0.25, 1, 0.3-0.5, 1); 8 frames. One drag that throws an item out eases in (easeInCubic, clip14@450-458).
- Evidence: n=17 clean of 20 attempted moves; X_cursor_moves.csv; strips/S_cursor_clip14_362.jpg (clip14@364-374 easeInOutCubic RMSE 0.012).
- Confidence: medium (6 clips; the other 26 coded moves were not tracked cleanly)

### [X68] On a click, change the clicked control itself on the click frame, about 3 frames after the pointer arrives; never change the pointer.

- Values: Arrival-to-click rest: median 3 frames (p10 1, p90 15; n=29). Of 23 described clicks: the control changes state on the click frame (fill, colour, label, tick) in 17 (18 counting a card that starts to expand); a ring, ripple or halo of 3-12 frames in 5; a 1-frame press dip in 3; nothing visible in 2 (overlapping); the pointer changes shape 0 times. Examples: clip07@869 option turns green with a tick, clip02@897 Copy link -> Copied, clip19@727 Publish -> green Live pill with a ring 728-737.
- Evidence: n=23 clicks in 9 clips; X_interface_detail.csv cursor_spans; numbers.json cursor.click_feedback.
- Confidence: medium (feedback categories read from every-frame strips by the coders)

### [X69] Make selections jump: the highlight moves to the next option on one frame, steps every 3-5 frames, and the landing swaps highlight, tick and label on the same frame, marked by a ring pulse or a land from 1.26x.

- Values: select_step events last 1 frame in 9 of 13 and 2 in 2 (two long slot rolls 13 and 19); select_land 1 frame in 9 of 18, 2 in 7, 3 in 2. Step intervals: 3 frames (clip19@526-538), 5 frames (clip15@518-529), card stack 4 frames (clip05@458-471). Landings: tick, highlight and composer label on one frame (clip19@491, clip10@707-708); others dim on the same frame for card picks (clip14@375, clip06@535); ring pulse in 4 of 7 picker_lands units. Slot variants: a pill rolls about one label per frame for 13 frames, then lands (clip19@1-14); a list scrolls at a constant 60 px/frame through a fixed box and never lands (clip15@324-366, linear RMSE 0.002). Selections appear in 25 of 134 units (15 clips).
- Evidence: n=31 selection events, 25 units; X_events.csv (select_*), X_interface_detail.csv selection_spans; strips/S_picker_clip15_512.jpg; checked by the analyst on clip19@488-541.
- Confidence: medium

### [X70] Show a before/after with a wipe of about 10 frames (5-25) that carries a visible front (a coloured line, scan bar or divider); ease short reveals in and long reveals in-out.

- Values: Wipes, scans and restyles n=34 in 12 clips: duration median 10.5 frames (p10 5, p90 25); direction top-to-bottom 12, left-to-right 8, right-to-left 8, bottom-to-top 6. A visible front (orange, cyan, lime, yellow, pink or iridescent line, scan bar, divider or light streak) in 24 of 34; circle or iris reveals 4 of 34. Clean progress fits n=21: reveals of 7 frames or less best easeInCubic 4 of 9; longer ones easeInOutCubic 3, easeInOutQuart 2, easeOutQuad 2, linear 2 of 12 (e.g. clip15@859-884 easeInOutCubic RMSE 0.011, clip01@336-358 css ease-in-out 0.016).
- Evidence: n=34 wipes; X_wipes_scrolls.csv; strips/S_wipe_clip15_855.jpg
- Confidence: medium (curve choice spread; front colour read from coders' descriptions)

### [X71] Scroll a captured page with an ease-in-out move (11-42 frames, 250-4400 px), but run machine streams (code, slot lists) at a constant speed.

- Values: Page scrolls: clip09@625-637 1004 px easeInOutQuart RMSE 0.004 (peak 186 px/frame); clip11@383-428 4399 px easeInOutQuad 0.017 (peak 275); clip19@686-718 2963 px easeInOutQuad 0.008 (peak 204); clip19@96-106 631 px easeInOutSine 0.009; clip19@903-918 252 px easeInOutQuad 0.006; clip01@786-802 504 px easeInOutSine 0.020. Constant streams: 2-68 px/frame, linear (clip08@1-38, clip15@324-366, clip15@689-715). Stepped list: rows pushed 163 px then ease out (163, 51, 16, 6, 1 px) every 8 frames (clip03@57-107).
- Evidence: n=18 scrolls over 50 px in 10 clips; X_wipes_scrolls.csv (phase correlation per frame); strips/S_site_clip19_666.jpg.
- Confidence: medium

### [X72] Mark a landing (attachment, selection, badge, Live state) with a ring pulse of about 9 frames that grows outward from the element and fades; land verdict badges by growing them from about half size in 4 frames.

- Values: Ring pulses: 33 events in 26 units (12 clips), 9 frames (p10 3, p90 13). Clean radius tracks: clip14@484-490 105 -> 163 px (increments 16 -> 4.5 px/frame, contrast 73 -> 28 levels); clip19@351-358 191 -> 374 px (43 -> 12 px/frame). Verdict badges (tick, X, no-entry, Free, PASSED): grow from 0.48 (p10 <=0.40, p90 0.63) in 4 frames (n=8 measured); tied to their word at median 0 frames.
- Evidence: n=33 rings, 8 measured badges; X_ring_pulses.csv, X_entrance_tracks.csv; strips/S_verdict_clip06_260.jpg, S_drop_clip14_460.jpg; motion M22 measured one ring (185 -> 252 px over 10 frames).
- Confidence: low for the ring curve (2 clean tracks); medium for ring use and badge entry

### [X73] Rebuild most interfaces; when a real page, app or clip is needed, set it inside rebuilt chrome or a card and act on it with rebuilt events.

- Values: Units / share of time: rebuilt 73 / 52.7 % (17 clips); real capture inside rebuilt window or card 29 / 24.3 % (9 clips); bare capture (full-bleed page, captured site in its own frame) 27 / 19.8 % (9 clips); footage in a rebuilt frame 5 / 3.2 % (3 clips). Events on captures are rebuilt: cursor, badges, circles, wipes, scrolls (e.g. clip06@778-839 red ellipses turn to ticks on a site screenshot, clip15@577-688 brackets and arcs on a game window).
- Evidence: n=134 units; X_interface_detail.csv (source); numbers.json capture_vs_rebuilt.
- Confidence: medium (capture vs rebuilt judged by eye: real copy, photos, page layout)

### [X74] Draw rebuilt windows with about 30 px corners, a title bar 4.5 dot-diameters tall with a hairline divider, and traffic lights of one size per video (13.5 px median) at a 1.88-diameter pitch, the red centre 2.1 diameters in from the left and top edges.

- Values: Traffic lights in 36 units, 11 clips (100 detections): diameter median 13.5 px (p10 12.0, p90 18.8; constant within a clip, e.g. clip19 12.3-13.7, clip08 18.6-19.1, clip02 11.4-13.1); pitch / diameter 1.88 (1.79-1.96); red centre from window left 2.07 d (1.99-2.31), from top 2.15 d (1.86-2.91; n=32); title bar 68 px (49-90), 4.46 d (3.68-6.26). Corner radius from sub-pixel corner fits (RMSE <= 4 px): per-unit median 30.1 px (p10 23.7, p90 32.2; 10 units, 3 clips). Window width 929 px (864-952). Title bar fill light #F4F4F2-#FDFDFD (21 units) or near-black #141418-#1A1A1E (15), one navy #0B1926 (clip02). By eye: grey sans title after the dots, browser variant with a URL pill, 2 px blue outline on a selected window (clip02); no menu bar, dock, scroll bar or resize handle.
- Evidence: n=36 units; X_chrome_traffic_lights.csv, X_chrome_window_corners.csv, X_chrome_corner_crops_x2.jpg; graphics G16-G17 agree on dot size (13.2 px) and card radius (34 px).
- Confidence: high for traffic-light proportions; low for the window radius (3 clips)
- Note: the verifier corrected the graphics card radius from 34 to about 31 px (25-33) ([G16], item 12); the window radius here, 30.1 px, agrees with the corrected value.

### [X75] Bring a text card's words in one at a time: serif titles fade in word by word 3-4 frames apart rising 8-22 px; name signs light each word on its spoken word; never type a title letter by letter.

- Values: 13 text-card units in 8 clips. Medallion titles (3, clip07): words fade over 1-2 frames, rise 22 -> 10 -> 4 -> 0 px (clip07@178-181), 3-4 frames apart (178, 181, 184; 385, 389, 393, 397); the medallion flips edge-on in 4 frames before. Name signs (4): marquee words light on their spoken words at -2, +2, 0 frames (clip12@130-164); neon words light 9-11 frames early with a 5-7 frame flicker (clip05@192-207); pixel letters drop one at a time 20-23 frames apart (clip15@67-110); a clapperboard is whole on the cut and claps on the last word of the name (+1 frame, clip16@467). Other cards are whole on the cut (clip04@882, @1003) or flip to a new card (clip04@935).
- Evidence: n=13 units; numbers.json text_cards; strips/S_textcard_clip07_378.jpg, S_neon_clip05_179.jpg; X_entrance_tracks.csv (clip07 rows).
- Confidence: medium (small n per variant)

### [X76] Expect half of interface and text-card units to be drawable from parameters and half to need one supplied picture with parametric events on it; almost none need hand animation.

- Values: Build class by units / share of time: A 65 / 46.5 %; B 68 / 52.6 %; C 1 / 0.9 % (glitch breakdown, clip09@48-127). Interfaces A 54, B 65, C 1; text cards A 10, B 3; other A 1. B/C needs (69 units, categories overlap): screenshot or capture of a real page or app 46, photos (avatars, thumbnails, portraits) 18, footage or video clip 18, product UI renders 7, marks or icons 4. A units 17 clips, B units 15 clips.
- Evidence: n=134 units; X_units.csv (build_class, needs); numbers.json build_class.
- Confidence: medium (class assigned by coders from every-frame sheets)

### [X77] Test that a unit reads as an explanation: it has an anchor on the cut, at least two events, one event within 3 frames of the word it acts out, events in spoken order, and an end state that differs from the anchor (often marked by a tick, badge or ring).

- Values: Anchor on the cut frame 108 of 134 (80.6 %); first event within 10 frames of the anchor 122 of 133; 2+ events 130 of 134; a tied event within +-3 frames 103 of 134; tied events in spoken order 159 of 159 pairs; every unit but one changes state (133 of 134); a result marker (tick, badge, landed selection, ring, Live or Copied state) in 56 of 134, among the last two events in 38; the next cut follows the last event by median 4 frames.
- Evidence: n=134 units, 19 clips; numbers.json explanation_properties, anatomy.
- Confidence: medium (properties computed from the coding)

### [X78] Never: change the pointer on a click, show two pointers, type with mistakes or backspacing, overshoot or bounce an entrance, add operating-system chrome beyond traffic lights, or hold an interface without an event.

- Values: Pointer shape change 0 of 23 clicks; two pointers 0 of 31 cursor units; typing errors or backspacing 0 of 48 typed spans (text changes only by whole-line replacement, 4 units); scale overshoot above 4 % 1 of 102, slide overshoot above 6 px 7 of 142 (tracking noise level); bounce, elastic or back easing 0 of 313 entrances, 0 of 17 cursor moves, 0 of 21 wipes; menu bar, dock, scroll bar or resize handle 0 of 134 units; units with no event 1 of 134 (clip04@1003-1010, 8 frames).
- Evidence: n=134 units, 838 events; numbers.json never_observed; X_entrance_tracks.csv, X_cursor_moves.csv, X_interface_detail.csv.
- Confidence: medium (absence within the coded and tracked samples)

## Constant and variable

Pictures and figures: CONSTANT (every clip): the anchor is on screen from the cut (or after 1-2 frames of empty plate); pictures keep changing until about 4 frames before the cut; counters and value bars ease in and out on cubic-bezier(0.65,0,0.35,1); no overshoot anywhere; names reveal with a ring pulse; props are centred on x 540 with a shadow only below. VARIABLE: number of events (1-10, with unit length), the device family (with the idea kind), counter duration (12-84 frames, longer for bigger climbs), the look (rendered prop, flat diagram, UI card, cartoon, footage: cartoon only in clip04 plus 2 units; footage mostly in clip16 and clip18), landing of a spoken number (+1 to +30 frames), and frame doubling (0-21 % by clip).

Interfaces and text cards: CONSTANT (all clips with the element): anchor on the cut frame; one main device per unit; events in spoken order; entrance ease-out with no overshoot, visible settle about 4 frames; selections jump on one frame; the pointer is one white outlined arrow that never changes on a click; the clicked control changes on the click frame; traffic-light proportions (pitch 1.88 d, red centre about 2.1 d from left and top); typed text never has mistakes. VARIABLE: device per unit (driven by the idea kind of the clause, X53); events per unit 2-11 (panel 4, full-frame 7); typing 0.9-2.4 characters per frame for user prompts (slower prompts pause between words) and 5-8 for machine output; cursor move 6-17 frames and 120-660 px with ease-in-out for travel or ease-out for an entrance; wipe 5-25 frames, direction and front colour per clip palette; scroll ease-in-out for pages vs linear for streams; traffic-light size per video 10.9-19.2 px; window fill light or dark per clip; capture vs rebuilt per subject (B units need a screenshot of the subject's page or app). Over time: nothing dated. Dark title bars sit on code, terminal and generated-site windows (clips 02, 03, 05, 08, 11, 15, 19); 17-19 px traffic lights only in clip08 and clip15 (terminal and editor windows), as graphics G17 found.

## Open questions

- Are events locked to word onsets at a finer level than the transcript can show? A forced-aligned transcript (+-0.5 frame) on 3 clips would decide it.
- The ease-in-out counter curve could be the editor tool's default; if Motus already has an ease-in-out preset, check it against cubic-bezier(0.65,0,0.35,1) on clip09@464-510.
- Why some clips are animated on twos (clip12 21 %): an export setting or a different tool for those pictures.
- Shadow contact strength differs from the colour study (0.69-0.88 here vs 0.45 at clip03@330 there): boxes differ; a joint fit on 5 more props would settle the recipe.
- How the builder should source B pictures (generated vs supplied) is a product decision: 39 B/C units need a rendered object picture, 27 footage, 23 a mascot or character sprite, 14 a screenshot, 12 a mark, 6 a photo. Owner decision (16 Nov 2026): props are drawn in code; photoreal pictures and AI clips are left out.
- Ring-pulse growth is fitted on 2 clean tracks only; a ring detector that subtracts the co-occurring landing would settle its curve and radius on the other 31.
- Window corner radius rests on 10 units in 3 clips (clip19 dominates); a fit on the light-on-light windows needs a better edge model.
- Whether the typed prompts are recorded from a real composer or re-typed by the editor cannot be told from pixels; the even 1-2 characters per frame suggests generated typing.
- Event-to-word ties are coder judgements on an unaligned transcript; a forced alignment would tighten X56-X58, and a second coder would give an agreement figure.
- The planner table (X53) has fewer than 10 units for most idea kinds; the pictures share of the explanation pass should be merged before treating it as complete.
- The inventory frame total for this share is 288.1 s (8,635 frames), not the 327 s first estimated.

Needs an eye or an ear:

- Watch clip13@691-799 and clip13@826-923 (train switch, tank refill) at speed to confirm the event list in X_units.csv reads as one continuous act.
- Watch clip09@464-512 and compare with X_strip_counter_odometer_clip09.png: the odometer curve is the reference for every counter.
- Check whether the 1-frame X badge land (clip14@634-635) reads as a stamp or a pop at speed.
- Look at sheets/clip16_*.jpg and clip18_*.jpg: decide whether full-bleed AI footage belongs in the style or only in these two topics (owner decision, 16 Nov 2026: left out).
- Confirm by eye that no unit in sheets shows an annotation arrow (rule X29) - absences were checked on sheets that show every 3rd frame outside bursts.
- Watch the exemplar units in playback to confirm the device names read as intended: strips/S_*.jpg list them (clip15@855-899 wipe, clip16@480-534 prompt, clip09@545-640 stack, clip14@460-494 drop, clip15@512-576 picker).
- Listen for typing, click and whoosh sounds on typed spans and clicks (X_typing_spans.csv, X_interface_detail.csv cursor_spans); nothing was heard.
- Check the build class and capture-vs-rebuilt calls on the B units that need a real screenshot (X_units.csv needs column, X_interface_detail.csv source).
- Check the speech-paced typing in clip06@403-462 (typing/X_typing_clip06_403_wordpaced.png) against the audio.
- Third-party interfaces, product marks and the orange pixel mascot appear in many units; a builder must redraw them as neutral categories, not copy them.
