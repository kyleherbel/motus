# Prop library

Code-drawn props for the `prop` element (`"name": "<file name>"`), drawn to [STANDARD.md](STANDARD.md). Each line:
the parts beats can name, then the beats that act a clause out. Distances are viewBox units. Every file's top
comment repeats its parts.

| Prop | Parts | Beats that suit it |
|---|---|---|
| `printer` | `sheet`, `sheet2` (clipped under the slot), `led`, `slot`, `body`, `tray`, `paperIn` | output, "it makes X": `move sheet dy 300 ease inOut`, again with `sheet2`; `pulse led`; `recolor led`; badge at x 760 y 520 |
| `cloche` | `lid`, `prize`, `glow` (hidden), `plate` | a reveal, "it serves you X": `hide lid how away` with `show glow how fade`; `pulse prize`; badge on `prize` |
| `cassette` | `reelL`, `reelR`, `label` (stripe has data-base), `shell`, `window` | playback, "it records / plays": `spin reelL`, `spin reelR rate 1.4`, `spin … stop true`; `recolor label` |
| `tank` | `liquid` (slide fill, level 0.78), `leakL`, `leakR` (undrawn), `plugL`, `plugR` (hidden), `holeL`, `holeR`, `glass`, `rim` | waste and its fix, "you are leaking X": `draw leakL`/`leakR`, `fill liquid to 0.25`, `show plugL how land`, `hide leakL`, `fill liquid to 0.9`; `recolor liquid` |
| `train` | `train` (with `wheel1`..`wheel4`), `lever` (pivot), `branch` (undrawn), `lamp`, `signal`, `track` | a switch of route, "when X runs out it switches to Y": `move train dx 120 ease slow` + `spin wheel1..4`, `move lever rotate 50`, `draw branch`, `recolor lamp #13904C`, `move train dx 440 dy 64 rotate 17.2 ease slow`; or stopped: `move train dx 360 ease slow`, `pulse lamp` |
| `gate` | `bars1`, `bars2`, `bars3` (hidden), `bug1`..`bug3`, `lamp`, `frame` | checks and rounds of review, "only X gets through": `move bug1 dy -800 ease slow` (passes), `show bars2 how pop`, `move bug2 dy -70` + badge cross on `bug2`, `show bars3`, `recolor lamp #13904C` |
| `clock` | `wedge` (undrawn), `minuteHand`, `hourHand` (pivots), `face`, `rim`, `cap`, `ticks`, `glass` | time spent or saved, "hours wasted": `draw wedge ease sweep`, `spin minuteHand`, `spin hourHand rate 0.083`; then `recolor face #CEE6E5` + `hide wedge how pop` + `pulse rim` |
| `envelope` | `flap` (pivot on the top edge), `letter` (clipped to the mouth), `pocket`, `back` | delivery, "you get an offer": `move flap sy -1 ease inOut`, `move letter dy -330 ease slow`, badge on `letter` |
| `iceberg` | `water` (slide fill, level 1), `tip`, `body`, `item1`..`item3` (hidden) | what hides below the surface: `pulse tip`, `fill water to 0.3`, `show item1..3 how grow` one per beat |
| `door` | `leaf` (pivot on the hinge, holds `sign` and `knob`), `light`, `rays` (hidden), `frame` | access, "it opens the door to X": `move leaf sx 0.14 ease inOut` with `show light how fade`, `show rays how fade`; `pulse sign` |
| `bulb` | `glass`, `lit` (hidden), `rays` (hidden), `base` | an idea, "it lights up": `swap glass to lit`, `show rays how fade`, `pulse lit` |
| `battery` | `charge` (slide fill on x, level 0.3), `bolt` (hidden), `cells`, `case` | energy, limits, "it charges you up": `fill charge from 0.12 to 1 axis x`, `show bolt how grow`; drained: `fill charge to 0.1` + `recolor charge #F0574A` |
| `folder` | `file1`..`file3` (hidden), `front`, `back` | collecting, "it saves every X": `show file1 how slide from up dist 380`, one per beat; `pulse front` |
| `funnel` | `in1`..`in3`, `out` (hidden), `cone`, `mouth` | filtering, "only the good ones come out": `move in1 dy 330 ease inOut` per item, `show out how slide from up dist 90`, badge check on `out` |
| `magnet` | `magnet`, `item1`..`item3`, `field` (undrawn) | attraction, "it pulls in X": `draw field`, `move item1 dy -140`, `move item3 dy -140`, `move item2 dy -190`; `pulse magnet` |
| `trophy` | `cup`, `shine` (waits left of the bowl), `plate`, `spark1`..`spark3` (hidden), `base` | winning, "the best X": `show spark1 how grow`, `move shine dx 760 ease inOut`, `pulse cup` |
| `rocket` | `rocket` (holds `flame` hidden, `window`, `nose`), `smoke` (hidden) | launch, growth, "it takes off": `show flame how grow`, `show smoke how grow`, `move rocket dy -900 ease slow` |
| `laptop` | `screenA`, `screenB` (hidden, holds `bar`), `cursor`, `lid`, `deck` | "you build X on your computer": `move cursor dx -150 dy 40 ease inOut`, `pulse cursor`, `swap screenA to screenB`, `fill bar from 0.3 to 1`, big badge check at x 500 y 290 |
| `phone` | `notif1`..`notif3` (hidden, clipped to the screen), `screen`, `body`, `glare` | messages, payments, "people keep paying": `show notif1 how slide from up dist 160`, one per beat; text badge at x 430 y 120 |
| `padlock` | `shackle`, `body`, `keyhole` (data-base) | locked or unlocked, "behind a gate / free": `move shackle dy -150 ease inOut`, `recolor keyhole #13904C`, `pulse body` |
| `shredder` | `page` (clipped above the slot), `strips` (hidden, clipped under the head), `led`, `head`, `bin` | rejecting, "it does not copy X": badge cross on `page`, `move page dy 540 ease slow`, `show strips how slide from up dist 220` |
| `gauge` | `needle` (pivot), `zones` (four arcs), `face`, `hub`, `case` | a level or score, "you get more X": `draw zones ease sweep`, `move needle rotate 150 ease inOut` (low to high), `pulse hub` |

The fixture `styles/prop-room/dev/fixtures/props.json` puts every prop on screen with these beats.
