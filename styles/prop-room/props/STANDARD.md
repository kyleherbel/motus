# Drawing a prop

The standard the planning agent follows when it draws an SVG prop for a video (`prop` element, param `src`), and
the one every library prop in this folder is drawn to. Rule ids point to the studies (explain-pictures X, colour C,
motion M, verification V); "by eye" marks a value judged from reference frames, not measured.

## What a prop is

About half of the reference's picture time is one object whose parts act the clause out: a sheet slides out of a
printer, a lid lifts, reels spin, a tank drains, a badge lands [X01, X02]. A prop is that object: one hero, drawn as
an SVG with named parts that beats move. It is on screen on the cut and its parts act while the clause is spoken,
about 12 frames apart, until the next cut [X03-X05]. It accumulates; removing a part is rare and is then the point
[X22].

Draw a prop when the sentence names a change of state, an outcome, a claim or a comparison that an object can act
out [X14, X15]. Do not draw characters, rooms or crowds: those are the 6 % of bespoke animation Prop Room does not
attempt [X01, build class C].

## Canvas

- `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 W H">`. The viewBox starts at `0 0`: pivots are given in
  these units.
- Wide props: `W = 1000`. Tall props: `W` as drawn, `H` up to about 1300. At the default size a 1000-wide prop is
  734 px on screen, so 1 unit = 0.734 px [X24]; lines thinner than 6 units disappear (by eye).
- The viewBox hugs the prop at rest: the silhouette reaches the left and right edges within 2 %, the top and the
  bottom within 2 % (by eye). The element sizes and places the box, so empty margins make the prop small.
- Parts may travel outside the viewBox (a lid lifting off, a letter rising): that is fine; overflow is visible.
- The element places it [X24]: centred on x 540, 0.68 of the frame wide (size `s` 0.44, `l` 0.85: the measured
  range), but no taller than 637 px in the split panel and 880 px full frame (the median height of the reference's
  tall heroes; size `l` allows 1.25 times that), centred near y 600 in the panel and y 750 full frame.

## Light

One key light from above, a little to the left [C19, C23].

| Element | How | Rule |
|---|---|---|
| Body | a vertical `linearGradient`, the top 22-28 levels of luma lighter than the bottom (light plastic `#E8EAED` to `#C9CED4`) | [C23] |
| Top edge | a 4-6 unit white line inside the silhouette along the top, opacity 0.6-0.9 | by eye (clip05@700 printer lid) |
| Base | an overlay over the bottom 10-15 %, black 0 to 0.10-0.16 | by eye |
| Recess (slot, well, screen, mouth) | darker at its top edge (black 0.15-0.35 over the top 6-12 % of it), a 2-4 unit light lip below | by eye (clip02@520 shredder, clip05@700 printer) |
| Chrome | cool silver across: `#8F959B` darkest, `#D6DAE0` base, one soft band to `#F7F8FA` on under 3 % of the surface | [C24] |
| Glass | a translucent fill, a soft white wall up to 9 units, one vertical highlight bar | [X25 glass], clip13@20 tank |
| Lit part (LED, bulb, flame, signal) | a halo in its own hue: a radial gradient from opacity 0.5 at the lit edge to 0 about 40 units (30 px) out | [C25] |
| Parts touching | a soft contact shadow: a radial-gradient ellipse, black 0.20-0.25 at its centre | by eye |
| Round bodies | add a horizontal overlay, lighter left, darker right (black 0.10-0.14) | by eye (clip01 cloche) |

Bodies are one flat base colour with the light and shade as separate white and black overlays on top whenever a
beat may recolour them (see Parts).

## Edges and shadow

- A hard anti-aliased silhouette: no outline stroke around a body, no feather, no blur on edges [X25].
- Strokes only for things that are lines in the world: rails, wires, hands, needles, routes, field lines, the grey
  bars that stand for text.
- Never draw the prop's shadow on the plate. The element adds it from the root attribute `data-shadow`:
  - `rest` (default): an object resting on the plate. 0.8 of the plate at the contact, half recovered by about
    22 px, gone by 60-100 px, warm [X25, C22].
  - `float`: a device that hovers: `0 68px 102px -36px` at 0.53 of the plate's luma, warm [C19, C22].
  - `none`: things that lie flat on the plate (a track) and flat icons [C21].
  On a saturated `field` plate the shadow drops to about 0.18 [colour prop_look].
- Inside the prop, draw the contact shadows between parts yourself (above).

## Materials

| Material | Values | Source |
|---|---|---|
| Light plastic | body `#E8EAED` to `#C9CED4`; lid or top face `#FAFAFB` to `#E1E4E8`; seam `#B9BEC5` | clip05@700 printer (lid luma 245 to 222, face 228 to 205); [colour materials, light_grey_plastic] |
| Dark plastic | `#3A3E44` to `#1A1C20`; slot inside `#121316` to `#2E3237` | [colour materials, matte_black_plastic luma 47 to 25]; clip05@700 slot `#2D3237` |
| Graphite / navy metal | `#3A4354` to `#1F2533` (rails, hands, signal posts) | clip13@760 track, by eye |
| Chrome | `#8F959B`, `#D6DAE0`, `#F7F8FA` | [C24] |
| Paper | `#FFFFFF` to `#F0F1F4`; text bars `#D8DADF` and `#E3E5E9`, 12-14 units high, round ends | [colour materials, paper_receipt `#FAFBFB`]; bars by eye |
| Gold, brass | `#FFF1C2`, `#F2C24E`, `#C08A22` | by eye (clip01 bell, clip02 coins) |
| Liquid | one base colour, e.g. `#F0916B`, light overlay at the surface, shade at the bottom | clip13@20 tank (top `#F5A177`, bottom `#DF704A`) |
| LED green | `#4BDD7F` | clip05@700 printer |
| Accents | orange `#E38056`, blue `#357CEF`, amber `#ECAB44`, red `#F0574A`, green `#13904C` | [colour materials] |

There is no house accent: the colour of a prop comes from the subject of the sentence or the brand it names
[tokens: colour; C18 corrected by V]. Keep text-free UI generic: white cards, grey bars, the three window dots.

## Parts

- Every part a beat touches is a `<g id="…">` with a short lowerCamel name from the sentence's nouns: `lid`,
  `sheet`, `reelL`, `needle`, `notif2`. Ids are unique in the file; the element prefixes every id per instance, so
  gradient ids can be short (`face`, `chrome`).
- A part and its ancestors carry no `transform` attribute: draw in absolute viewBox coordinates. To rotate or scale
  a shape at rest, wrap it in a child `<g transform>` inside the part. (CSS moves the part; a transform on an
  ancestor would break its pivot.)
- Parts that move on their own are siblings, not nested, unless one carries the other (wheels inside the train,
  the flame inside the rocket).
- Draw order is stacking order: what passes in front comes later in the file.
- Draw a part at its final place. A part that only appears on a `show` or a `swap` gets `visibility="hidden"`.

What the element reads from a part:

| Attribute | Meaning |
|---|---|
| `data-pivot="x y"` | rotate and scale about this point, in viewBox units (default: the part's own centre). Needles, hands, levers, flaps, doors. |
| `data-fill="slide"` | a `fill` moves the part inside its parent's clip instead of scaling it, so a wavy surface and bubbles stay intact. Put the part in a `<g clip-path>` of the container's inside. |
| `data-level="0..1"` | the level shown before any fill beat (a tank drawn full but shown at 0.78). |
| `data-axis="x"` | the level runs left to right (a battery). |
| `data-drawn="0..1"` | the share of its strokes drawn before any draw beat; `0` keeps a route or a leak invisible until it is drawn. |
| `data-base` | on a shape inside the part: the flat fill a `recolor` beat changes. |
| `data-ring="#hex"` | the colour of a pulse ring around this part (else its `data-base` colour, else white on dark plates, ink on light). |

Patterns:

- **Something emerges from a slot or a mouth** (a sheet, a page, a letter): put the part in a `<g clip-path>` whose
  clip covers only where it may be seen (below the printer slot, above the shredder slot, the envelope's mouth and
  the space above it). The clip stays still while the part moves. A badge on that part is clipped with it.
- **A level** (liquid, charge, water): a tall shape inside the container's clip with `data-fill="slide"`.
- **A route, a wedge, a field line**: a stroke with `fill="none"` and `data-drawn="0"`. Several strokes in one part
  draw one after another, in document order. A pie wedge is a circle with `r = R/2` and `stroke-width = R`, rotated
  -90 degrees in a child group so it starts at 12 o'clock.
- **Two states**: two sibling groups, the second hidden; a `swap` cuts from one to the other [X69].
- **A lid, a flap, a door**: one part with a pivot on its hinge. A front-view door opens with `move sx 0.14`, an
  envelope flap with `move sy -1`; a lid lifts off with `hide how away`.

## Beats, for drawing the right parts

| Beat | What it does | Timing | Rule |
|---|---|---|---|
| `show` | a hidden part enters: pop, slide (56 px, or `dist` units), grow from 0.82, land from 1.24, fade from 0.8 | 12 frames, entrance curve | [M10-M15] |
| `hide` | fade (6 frames), pop, or `away`: lifts off by its own height, shrinks to 0.45 and fades, accelerating | 12 frames for away | clip01@136-148 |
| `move` | dx, dy, rotate, scale, sx, sy in viewBox units | 14 frames `out` or `inOut`; 32 frames `slow` | [X03, X20] |
| `fill` | a level to `to` (from `from`, else the level before) | 27 frames ease-in-out | [X08, X10] |
| `draw` | strokes draw on | 13 frames ease-out tip; 27 frames `sweep` | [X19, X11] |
| `spin` | turns until a `spin stop`; `rate` scales the speed | 14 degrees a frame after a 6-frame spin-up | [M21] |
| `swap` | one part cuts to another | 1 frame | [X69] |
| `recolor` | the `data-base` fills change colour | 4 frames | [X10] |
| `pulse` | a ring from the part's edge out to 1.40x, 6 px thinning to 3 px, fading | 11 frames | [X17], clip05@608-617 |
| `badge` | check, cross or a short label, 72 px on a part's top-right corner or 220 px over it (`big`) | 6 frames from 1.25 | [X18], clip02@505, clip14@640 |

Space events about 12 frames apart inside the clause that names them; keep acting until the cut [X05, X06].
Nothing overshoots or bounces [X29].

## Never draw

- A third party's logo, wordmark, app icon, mascot, product name or interface. Marks are monograms or neutral
  shapes; interfaces are generic cards and grey bars.
- Characters, real people, faces on objects.
- Text longer than a short label. Library props carry no words; a prop drawn for one video may carry one label of
  one or two words that repeats the caption [X29].
- Outlines around bodies, drop shadows on the plate, photographs or textures, grain.
- `<image>`, `<style>`, `<script>`, `<foreignObject>`, `<a>` and animation elements (the element strips them),
  external `href`s.

## Before you use a prop

1. Every part a beat names exists, is a `<g>`, and has no `transform` on it or above it.
2. Hidden parts carry `visibility="hidden"`; strokes drawn later carry `data-drawn="0"`.
3. The silhouette fills the viewBox; the comment at the top lists every part and the beats that suit it.
4. Render it in a fixture on a pale and a dark plate, at rest and after every beat, and look at the frames.
