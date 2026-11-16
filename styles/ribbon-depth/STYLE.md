# Ribbon Depth

Read `research/design.md` for the visual construction record. Read `style.json` for exact parameters. This pack studies a public rendered example; it does not contain the seller's private skill or assets. Violet has moving reference evidence. Orange (the default since 0.2.0) uses the same construction in an orange palette. Light Lime has static evidence only and is beta. The 0.2.0 rebuild rules are D09 in `research/design.md`.

## Visual identity

Preserve the layered composition: darkened original room, luminous dimensional ribbon, pale card behind the head, bright natural speaker, cream capsule, regular sans phrase with one larger italic accent. Do not substitute an editorial split, neon outline UI, giant bouncing captions or a uniform thick neon line. Motion is restrained after the entry. Use the vertical defocus transition for changes of scene mode. The phone frame and the surrounding promo interface are not part of the reel.

Orange is the default; Violet is the reference's own palette. Both share the depth composition. `light-lime` is a distinct studio hierarchy: smaller person, photo triptych/filmstrip behind them, a large word behind the head and a ribbon across the lap. Use `studio` and `portrait-search` to access that hierarchy; merely changing `theme` on a Violet plan does not recreate it. A tight bust shot cannot become a full-body shot: preserve the actual crop or use `depth`.

## Structure and cut decisions

There is no fixed duration or scene count. Keep complete thoughts and the user's target duration. In raw footage remove false starts and dead air only when meaning and delivery survive. In locked footage keep all frames. Segment at a new idea, evidence object, contrast or action; do not force every sentence into a new layout. A useful starting scene range is 2–6 seconds, with longer evidence holds when needed; these are editorial choices, not rules measured across a large corpus.

Open with the speaker when trust, personality or a claim matters. A rear card introduces the subject without taking over the frame. Use `abstract` for an ordered sequence, a real query, a comparison or a spoken action. Return to the speaker for nuance or payoff. `clean` is intentional breathing room. Do not alternate mechanically or add a graphic to every noun.

Use `key` to carry the same static element across adjacent scenes with the same layout and slot. Keep static parameters identical; append word-timed beats to change emphasis. A new key creates a new entry. Keys do not persist across different layouts.

## Elements

| Element | Use | Parameters and timing |
|---|---|---|
| `glass-card` | Subject card behind head; checkable points or a funnel | `title`, optional italic `accent` (a long title ending in its accent splits onto two lines), optional `treatment` rows/funnel/plain, optional `tile` icon (a glass tile that pops beside the card), 1–3 `rows` with `text`, optional `at` word and `icon` (a row with an icon also pops a tile); `focus` beat has zero-based `index`. Keep critical copy above the hair occlusion. |
| `phrase` | The reference text stack | `label` capsule (the opening words, at `labelAt`), optional `lead` line (≤30 characters, the words just before the hero), `text` hero up to 36 characters/7 words with exact substring `accent`, `at` word for the hero, optional `steps` timeline of 1–3 `{text, at, icon}` nodes landing on their words; `underline` beat. One italic accent. In `studio`, use `back-title` for the behind-head word. Do not fill both `front` and `back-title` with competing phrases. |
| `glass-stack` | Two to four ordered stages | `cards`: title, optional detail/icon, `at` word. First card is lowest; subsequent cards rise along a light trace. Labels must express actual steps. |
| `glass-compare` | Two stated alternatives or outcomes | `left`, `right`, optional leftLabel/rightLabel/at/rightAt; `rightAt` times the second reveal; `focus` beat with side left/right. The comparison is an original extension, not a measured source element. |
| `search-query` | An actual query or phrase being searched | `query`, optional `at` and `doneAt` words. `doneAt` must follow `at`; keep the typing readable. Put in `detail` below a stack or portrait, or alone in abstract `stage`. |
| `action-button` | A spoken action or call to action | `label`; `click` beat on the spoken action. This is an illustration, never pretend it performs a real click. |
| `media-fan` / `filmstrip` | User photos, captured evidence, portfolio frames | 1–3 `items`, each `src` under project assets, optional label/at. Real supplied assets only. Use the fan for a small set of distinct visuals, filmstrip for a sequence. |

Anchors refer to `conform/words.json`, never the raw transcript. Explicitly time important row/card arrivals, query completion and clicks. Defaults are preview fallbacks. Keep element anchors within the scenes that contain them. Do not add arbitrary statistics, fake interfaces, logos, screenshots or subtitles. Graphic copy comes from spoken words or captured evidence.

## Scene library for any topic (D13)

Pick the device from what the sentence does, not from the niche. Fitness, finance, food, tech, coaching, real estate and beauty all use the same table. Copy, numbers and names come from the speech.

| The sentence… | Device | Where |
|---|---|---|
| names a subject with a few attributes | `glass-card` rows, icon tiles | `depth` back |
| says a number, price, duration or percent | `stat` counts up; `meter` 0–100 only when a share was said | back, stage, panel |
| contrasts old vs new, myth vs fact, stop vs start | `swap` (strike and replace) or `glass-compare` (side by side) | stage, panel |
| walks through steps in order | `glass-stack` with its light trail, or phrase `steps` for 2–3 stages | stage / front |
| describes growth, decline or progress over time | `chart` line or bars; heights are illustrative, labels only if spoken | stage, panel |
| describes a system, toolkit or "everything in one place" | `orbit` hub and satellites | stage, panel |
| quotes a conversation, comment, DM or question | `chat` bubbles with typing dots | stage, panel |
| announces a result, alert, sale, sign-up or reminder | `notify` toast stack | back, stage, panel |
| states a rule, principle or line someone said | `quote` slab, words land in time | stage, panel |
| hammers one word | `big-word` behind the head | `depth` back |
| searches or types | `search-query` | detail, stage |
| asks for an action (comment, click, save) | `action-button` | stage |
| shows real evidence (pages, photos, products) | `media-fan`, `filmstrip` | back, stage |

Compositions: `depth` (speaker with something behind the head), `split` (speaker in a glass window at the top, a panel device below: use it when the face matters *and* the idea needs room), `abstract` (no speaker), `clean` (speaker and phrase only, room still graded). Change composition at least every two scenes.

The ribbon is a placed effect (`fx` slot, `ribbon` element), not wallpaper. Forms: `spiral` (coil around the speaker, the hook signature), `sweep` (one diagonal glass beam), `halo` (tilted ring around the head), `arc` (thin arch overhead). Put it on the hook and on one or two later moments, at most 40% of speaker scenes, and vary the form. Consecutive scenes with the same form keep one ribbon; a speaker scene without one un-draws it. A plan with no `ribbon` placement gets a spiral on its first and last speaker runs only. The audit warns about ribbon overuse, one form everywhere, the same device twice in a row, three of one composition in a row and one device carrying more than a quarter of the reel.

## Framing and readability

The measured rear card is roughly x60,y200,w580,h510 on 1080×1920. Hero ink sits around y1300; the cream capsule around y1190. Head occlusion is part of the look, but titles must remain legible. Inspect the hairline and gestures through each scene. If copy is hidden, shorten it, use fewer rows, choose a clean/abstract option, or adjust the pack deliberately. Do not paste text over the eyes.

The engine's matte enables behind-head depth. Inspect hair, glasses, hands and microphone edges. If the matte is unavailable, the renderer uses an intact lower footage panel for `depth`/`studio`; that is a functional fallback with lower visual fidelity. Do not describe it as matching the reference. `portrait-search` uses a circular crop and works without a matte.

Supporting captions are short mixed-case groups whose words land one by one. A `phrase` replaces supporting captions from its capsule (or hero) entrance to the scene's end to avoid duplicate copy; captions remain visible before the phrase enters; reserve phrases for short beats, and use `clean` or no phrase where full captions matter. Use `captions.hide` only intentionally. Do not infer an accurate transcript from graphics.

## Variation without losing the look

Change the explanatory device, scene duration, word anchors and evidence assets before changing color. Motion is part of the look: the ribbon keeps turning, entrances go blur-to-sharp, the camera shakes on landings and pushes in slowly. Do not plan a static scene to save motion. Icons: check, search, person, people, spark, arrow, eye, cursor, cart, lock, chat, bolt. `motion` controls travel/blur/ambient drift, not beat times. `ribbon` can be sculpted, subtle or off. Keep one coherent look per video. A custom client theme requires deliberate token and research changes plus visual checking; unsupported hex colors are not valid plan values.

Give 2–4 meaningfully different options per scene. A card versus presenter-only or an actual comparison versus an ordered stack can be useful choices. Color swaps are not options. `single: true` is honest for a required evidence capture, protected ending or very short connective clause where alternatives add no value.

## Review

- Validate the plan. Generate scene posters and inspect every option.
- Check the first readable frame, each beat, and several frames before/after cuts. The reference moves in depth; no accidental lateral slide-show choreography.
- Check that a bright speaker remains in front of the ribbon/card, the room stays recognizable, and the main phrase remains over the chest.
- Check copy bounds x72–936,y160–1630; decoration may bleed. Test longest labels and minimum scene duration.
- Check no hidden card title, duplicated captions, clipped italic descenders, missing assets or illegible typed query.
- Check seeking backwards produces the same frame. Preview and render use the same style code.
- Sound is optional, original synthesis. No bed ships. Ask the owner to audition a preview before claiming perceptual sound fidelity; do not block ordinary local builds on that judgement.

Use Motus Studio for review unless the user has asked to render directly. Keep this style beta until a person has reviewed continuous motion and sound on real footage.
