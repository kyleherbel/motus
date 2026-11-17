# Graphics

| Id | Rule | Values | Evidence | Confidence |
|---|---|---|---|---|
| G01 | Every picture is a layer of a design file: it wears a selection frame. | | clip01 throughout | medium |
| G02 | A selection frame is a thin outline with round corner handles and pill handles at the middle of each side. | shipped: 4 px outline, 26 px dots, 54 x 18 px pills | clip01@20, @160 | medium |
| G03 | Handles have a dark rim. | | clip01@20 | low |
| G04 | A mouse cursor sits at the corner it dragged. | | clip01@18, @360 | medium |
| G05 | A highlight is a small selection box on content: thin stroke, square handles, faint tint. | | clip01@213-217, @266-270 | medium |
| G06 | A tap is a translucent circle; a swipe leaves a streak. | streak not built | clip01@285-303 | low |
| G07 | Captures are real pages and real screens, never redrawn. | | clip01@145-440 | medium |
| G08-G12 | Captures are cropped until the pointed-at words are readable; the frame stays still while content scrolls; clips swap by hard cut inside a frame. | | clip01@372-547 | low |
