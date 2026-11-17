# Motion

Frames at 30 fps, measured on every frame of clip01. Curves are fits by eye to the per-frame positions, not least-squares fits.

| Id | Move | Frames | Shape | Evidence | Confidence |
|---|---|---|---|---|---|
| M01 | Footage rectangle draw-on | 3 hold + 15 | starts as a 214 x 208 box at the bottom left; the cursor drags the top-right corner out; fastest at frames 5-6 (about 52 px/frame), then each frame covers about 0.75 of the last | clip01@0-18, @548-562 | medium |
| M02 | Window drag-grow | 7 hold + 9 | lands at about 70 % anchored bottom-left; the cursor pulls the top-right corner to full | clip01@342-360 | low |
| M03 | Window settle after a cut | 15 | 114 % to 100 %, each frame about 0.8 of the last | clip01@145-160 | low |
| M04 | Hero and object settle | 12-14 | 105-112 % to 100 % with a small rise | clip01@251-262, @636-650 | medium |
| M05 | Whip scroll inside a window | 12-14 | content only, vertical motion blur, the frame stays still | clip01@395-410 | low |
| M06 | Highlight box | 4-6 | grows left to right | clip01@213-217, @266-270 | medium |
| M07 | Tap dot | about 8 travel | slides to the target, small press pulse | clip01@285-303 | low |
| M08 | Caption word | 3 | blurred 35 % grey to sharp white, in place | clip01@18-23 | medium |
| M09 | Hook title | words 5 apart from frame 3 | line 2's box opens from its centre in 6 frames from frame 9, then its text appears | clip01@3-20 | low |
| M10 | Keyword box | 8 | draws left to right | clip01@800-812 | low |
| M11 | Ground drift | forever | scrolls up 0.5 px per frame | clip01@20-140 | medium |
| M12 | Everything else | 0 | held still between actions. No overshoot, bounce or rotation anywhere. | clip01 throughout | medium |
