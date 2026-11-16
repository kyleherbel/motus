# Construction record

Public-study target: Violet depth composition; the bright studio family is separate. This is an independent implementation from public rendered examples, not the seller's source. No purchased skill, handbook, renderer or sound files were accessed.

Numbers below combine measured visible bounds with explicit construction choices. The source promo contains two short Violet edits inside a 540×960 viewport. It does not support pixel-exact claims for the original 1080×1920 renderer. Multiply viewport coordinates by two; uncertainty is normally 4–12 output pixels and larger for glows or occlusion. Full measurements live in the dimension notes.

## D01 — canvas and layer order

1080×1920. Room → room grade → light/ribbon → rear card → person matte → foreground phrase → supporting captions. Rear decoration never crosses a face when a matte is available. A bottom scrim protects foreground copy. With no matte, use the explicit panel fallback; do not claim behind-head compositing.

## D02 — visible geometry

Primary Violet rear card: x56,y198,w580,h506 (clip01 f75). Construction rounds to x60,y200,w580,h510; radius44, padding42. Its copy sits at the top so hair can occlude the lower card. Phrase pill y1190,h82; hero line y1300, up to 130px high. Abstract search x188,y1430,w702,h104. Abstract cards about 470×250; implementation uses 470×240 cards and alternating ±5° tilts. Two-card top430/pitch400, three-card top180/pitch340, and four-card top160/pitch260 are the final normalized construction values after the D08 verification. Four cards are an original extension.

Safe copy bounds are an implementation choice: x72–936,y160–1630. Cards and ribbons may bleed; important labels may not. Foreground copy moves down in the bright studio composition. Caption y1560 is chosen to leave a clean hierarchy beneath the hero.

## D03 — type

DM Sans and Playfair Display italic are stated by the source and visually consistent with it. Fonts come from the official Google Fonts repository, with OFL files beside them. Initial build: hero sans92 / serif112; card heading44 / serif54; pill40; body34; supporting captions46. Font fitting reduces size for valid longer strings. Weight400 for main sans,600 for accents and card labels. The italic word is larger, not merely a second font at the same size. Do not turn the phrase into bold all-caps karaoke.

## D04 — material and palette

Violet construction colors: ground #090615, deep #20103c, luminous violet #a774ff, near-white rim #f0dcff; glass #f4f0e7 at high opacity, ink #15243b. These are practical approximations from compressed public images, not calibrated original tokens. The glass needs a bright edge, a cool shadow and reflected color, not a white rectangle with a glow. Ribbon uses a varying-width projected helix, anisotropic streaks and an edge highlight. Its full trajectory is reconstructed, not recovered. Visual review replaced disconnected segment fills with 48 continuous longitudinal bands across 240 path samples; a2000px trajectory exits below the frame rather than ending abruptly inside it. These are original rendering choices. Explicit layer stacking prevents transformed cards from escaping their depth plane.

Light Lime uses warm-white ground #f1f0e9, #b6da37 / #e8f5ac ribbon, darker olive ink. Its speaker is smaller, photos sit above/behind, and a ribbon section can pass in front below the waist. This composition follows the static boards. There is no public moving Light Lime sample in this study, so motion is an original extrapolation. Keep it beta.

## D05 — timing and intensity

Visual iteration on a real bright-room take: room brightness0.32 and foreground0.97 retain a readable subject against a darker room. Glass base is now #e5deec, pill #f6f2e7, ink #171e37, following the independent decoded type/material samples. Ribbon near-width170 and a translucent flat center replace the first tubular-looking cross section. These are deliberate reconstruction choices; no calibrated match is claimed.

Opening rear card enters over ~0.40s; ribbon reveals ~0.20–0.53s; phrase appears around0.67–0.90s. Cutaway transition at f122–140 spans ~0.60s, with the cut at f128. Construction uses 0.18s outgoing /0.28s incoming vertical defocus and a4% scale pulse; these are approximations, not a fitted curve. Card movement after settling is tiny (~11px over2.5s). Abstract cards in the first sample arrive roughly0.9s apart; actual builds should use spoken-word anchors, not that fixed stagger. Motion intensity scales distance, blur and drift; it never changes word timing.

## D06 — presenter adaptation

Target eye y860, face width420 for Violet. Scale/translate the room and matte identically so there is no duplicate face. Feather exposed top/bottom edges into the dark ground. For a very tight crop retain its native face size; do not invent missing torso. Bright studio targets a smaller figure. Without a good matte, use an intact lower footage panel and rear graphics above it; circle layouts use an actual circular footage crop. Hair, glasses, hands and microphones need visual review on each take.

## D07 — sound

Three original deterministic synthesized effects: airy transition, short glass accent and tap. These are functional replacements, not copies of the seller's effects. No bundled music. Gains and spacing are implementation choices; the engine handles the final voice mix and loudness. Effects remain optional. A person must audition the sample before any claim that the sound matches the reference.

## D08 — adaptable editing

Independent visual verification corrected three reconstruction errors: the abstract stage has only a thin connecting beam and distant point floor, not the presenter's broad helix; two-card pitch is400px (three-card340, four-card260); the near Violet ribbon rises from lower-left toward upper-right. A-0.70 projection tilt produces that slope. The bright family uses its own slender vertical twist and a separate low lap wrap, not a recolored Violet helix. Its filmstrip is a shared wide housing. These changes preserve observed composition; the exact paths and extra four-card layout remain authored approximations.

No ten-second cap and no forced speaker/abstract alternation. Preserve complete clauses. A rear card can remain through several sentences; use `key` continuity. Prefer an abstract scene only when a relationship, sequence, query or action benefits from it. A source-backed comparison and gallery are original extensions of the observed materials. Extra effects do not substitute for a clearer explanation.

Final pacing review: the first abstract object enters on the opening clause instead of waiting through an empty stage for a later keyword. Subsequent objects and focus changes stay word anchored. Supporting captions remain visible until a hero phrase actually enters. This is an original adaptation for variable-length scripts, not a claim about the source caption implementation.

## D09 — 0.2.0 rebuild after owner review (2026-11-15)

Owner review of the 0.1.0 render on a real 48 s take: "looks really trashy; the animation, the fluidity and the overall vibe come nowhere close". A frame-by-frame pass over the public promo (clip01, 600 frames, every 3rd frame) and a native-resolution still from the public shake preview (shake-preview f12, 608×1080 inset at x656) located the gaps. The 0.1.0 ribbon was a flat 2D sweep; the reference band is a glass spiral that keeps turning. 0.1.0 had no icon tiles, timeline, lead line, glossy spheres, halftone stripes or camera shakes, and the `clean` layout cut to the ungraded room.

Rules written from that review (construction values, measured where stated):

- R1 ribbon: a flat band wound on a tilted cylinder, perspective-projected (focal 1700), depth-sorted, 280 segments × 8 strips. Face alpha 0.16–0.40, rims 0.62–1.0, specular line at one third of the width, halo blur 78 px at 0.75 and bloom 20 px at 0.85, 110 rim sparkles. Radius 700, pitch 0.50 rad, roll −0.27 rad, 1.32 turns, band 108 px (near ≈200 px, far ≈90 px, matching the f12 still's ≈195/≈95 px after ×1.776 scaling). It turns at 0.045 rev/s for its whole run and reveals over 0.70 s with a glowing leading edge. It fades out between y1094 and y1286 so it never crosses microphones or hands.
- R2 room: brightness 0.36, saturation 0.60, contrast 1.08, palette tint at 30% (colour blend), a warm screen glow behind the head and a vignette. `clean` keeps the grade. A blurred cover copy fills edges the framing exposes.
- R3 entrances: blur-to-sharp on one out-expo curve (cards 0.53 s, blur 20 px, rise 56 px, scale 0.90→1; hero 0.42 s, blur 18 px; rows 0.30 s; tiles and nodes 0.32 s out-back). No linear fades.
- R4 text stack (clip01 f20–27, f240–276): cream capsule with the opening words, an optional small lead line, then the hero with a heavier, larger Playfair italic (accent weight 700, italic/sans ratio 116/92) and an underline that draws in 0.42 s. Supporting captions land word by word with an 0.22 s blur-in.
- R5 camera (shake preview, 25 fps, phase correlation and Laplacian sharpness): sharpness falls from ≈10 to ≈0.5 within 1–2 frames and recovers in 9–12 frames (0.36–0.48 s); the residual wobble is ±1.5–3 px per frame. Construction: wobble amplitude 14 px decaying with τ = 0.11 s at 7.5 Hz, directional blur 16 px decaying with τ = 0.09 s; hard hits ×2.2 with an RGB split. Shakes land 1–2 frames after hero words, abstract cards, the compare reveal and the click. A slow push-in of 2.2% runs through each layout run.
- R6 transitions (M02): outgoing zoom to +7% with defocus and +18% brightness over 0.20 s; incoming vertical smear (σy up to 64 px), RGB split 14 px, −60 px settle over 0.36 s.
- R7 atmosphere: matte spheres lit from the upper left at several depths with parallax, halftone stripes (11×15 px pitch) behind the head, and white icon tiles that pop on row words along a dotted arc. In abstract scenes: a bright core, a thin horizon arc, five large bokeh, glints, a drifting dot floor and a light trail that threads the cards with a travelling pulse.
- R8 Orange palette (owner request, 2026-11-15): ground #0a0503, deep #2e1206, accent #ff7d22, accent2 #ffb25e, glow #ff6a10, rim #fff0dc, sphere body #5e4234. It is now the default. Violet and Light Lime remain.

Limits: the person matte can include lamps beside the head; two soft ellipses in the outer upper margins remove them, and a wide raised hand at the frame edge may fade there. These values are an original reconstruction. No calibrated or pixel-exact match is claimed.

## D13 — scene library and ribbon placement (2026-11-16)

Owner request: stop overusing the ribbon and add scenes that work for any topic, niche or subject. Construction:

- Ribbon becomes a placed `fx` effect with four forms rendered by the same 3D band: spiral (1.32 turns, radius 700), sweep (0.32 turn, radius 900, roll −0.42), halo (closed ring, radius 420, pitch 0.50) and arc (0.40 turn, radius 980, pitch 0.36). Full coils turn at 0.045 rev/s (halo 0.03), measured from the run start. Partial bands sway ±0.10 rad so they never drift out of frame. A glint travels along every form at 0.22 band lengths/s. A run un-draws over 0.45 s when the next scene keeps the speaker without a ribbon. Legacy plans: spiral on the first and last speaker runs only.
- Bloom is now downscale/upscale (1/6, 1/14, 1/32) on CPU-pinned canvases instead of `ctx.filter` blur. Browser verification showed the old bloom, CSS blur on spheres and a composited mask on the halftone stripes were not bit-stable between seeks.
- New layout `split`: the speaker in a 900×660 glass window at y140 (fill-constrained framing, faceW 360), a panel y830–1240, the abstract world around it.
- New elements, all word-anchored with copy from the speech: `stat` (count-up over 0.95 s, optional meter ring), `chat` (typing dots 0.5 s, bubbles push the stack up), `chart` (line or bars, clip reveal to each point), `orbit` (hub plus up to 6 satellites at 0.05 rev/s, depth-scaled), `quote` (slab with words timed between `at` and `doneAt`), `swap` (strike 0.35 s, the old item tips back, the new one rises with out-back), `notify` (toasts drop from above and push older ones down) and `big-word` (Playfair italic up to 360 px behind the head, settles from 1.18× and 24 px blur).
- Variety rules in the audit, judged on picks: ribbon in more than 40% of speaker scenes; one form for 3+ ribbons; the same device in consecutive scenes without a key; three of one non-abstract composition in a row; one device in more than a quarter of the scenes.
- Three original example scripts (fitness, personal finance, cooking) with synthetic timing exercise the library in `dev/verify-browser.mjs`. It now checks exact style state (visible DOM and canvases) and allows compositor raster noise in the screenshot (≤400 pixels, ≤48 levels).
