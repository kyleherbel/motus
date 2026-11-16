---
name: ribbon-reel
description: Edit a talking-head reel in Motus Ribbon Depth with a glass ribbon behind the speaker, frosted rear cards, mixed sans and italic type, and word-timed abstract scenes. Use for ribbon reels, this premium glass look, or flexible adaptations of it to longer scripts and client briefs.
---

# Direct a Ribbon Depth reel

Use the installed `ribbon-depth` style and Motus engine. Preserve the reference's depth, materials and typographic hierarchy while choosing scenes from this video's meaning. Do not replace the requested look with a generic UI-card theme. This is a flexible editing skill, not a five-scene recipe.

The plugin root is two folders above this skill. In Claude Code it is `${CLAUDE_PLUGIN_ROOT}`. Below, `motus` means `node <plugin root>/engine/bin/motus.mjs`. The pack is `<plugin root>/styles/ribbon-depth/`. No external renderer or npm runtime dependency is needed.

## Start with the actual source

Use `../edit/SKILL.md` for machine checks, ingest, understanding, cuts, conform, Studio and rendering. This request already selects `ribbon-depth`; do not ask the user to choose an installed style again. Preserve an already-stated raw/locked mode. If that is unknown, ask whether cutting is allowed before removing speech; source inspection can proceed meanwhile. A missing video path is required input, but a planning-only request can be answered without one.

If this came from `motus next`, honor the existing job/project. Report through `motus say` and finish through `motus done` as `edit` describes. Do not create a second project or open a second review loop.

Read the entire transcript and contact sheets, not just the hook. Work from output words only after conform. In `analysis/direction.md`, record briefly:

- The video's promise, the idea each scene must explain, and any target length.
- The chosen visual family and why it fits the actual shot. Orange is the default and Violet is the reference's own colour; both use the close presenter/room treatment; use Light Lime's studio hierarchy only when framing/assets support it.
- Which visual objects will persist, which words trigger changes, and which passages need breathing room.
- Available evidence assets and any matte/framing limitations.

Routine choices do not require a design approval round. State the direction and continue. Follow the user's current reference or brand; do not import another project's colors or diagrams.

## Plan content, then choreography

Read the pack's `STYLE.md` and `style.json` in full. Read [references/directing.md](references/directing.md) when selecting among visual mechanisms or adapting duration. The manifest is the executable vocabulary; do not invent parameters, element codes, transitions or effects.

1. Divide at changes of thought, evidence, comparison, sequence or action. Keep meaning intact. There is no ten-second limit and no required speaker/abstract alternation.
2. Choose the simplest supported visual mechanism that explains each clause, from the scene library in `STYLE.md` (stat, swap, chart, orbit, chat, notify, quote, big word, cards, stacks, search, button, media). Vary device and composition (`depth`, `split`, `abstract`, `clean`) and place the ribbon only on the hook and one or two later moments, in different forms. A term can stay on a rear card; an actual sequence can build up in an abstract stack; a query can type; an action can click. Plain presenter scenes count as intentional editing.
3. Anchor important events to words. Save 2–4 materially different options per scene, with the recommendation in `pick`. Keep an element's `key` and static parameters unchanged when carrying it into the next same-layout scene.
4. Keep copy grounded in the transcript or real supplied/captured sources. Never add an impressive number, fabricated screenshot or invented customer result. Do not turn a neutral phrase into a fictitious search or CTA.
5. Use `phrase` selectively. Build it like the reference: a capsule with the opening words (`label`, `labelAt`), an optional `lead`, the hero on its word, and `steps` when the speaker names two or three stages. It replaces supporting captions from its capsule entrance to the scene's end. Captions remain visible before its entrance. For longer clauses needing complete captions, omit it or divide at a real thought boundary. Check that all important spoken content remains understandable.

## Build and review

Run `motus validate <project>`, then:

```bash
node <plugin root>/styles/ribbon-depth/dev/audit-plan.mjs <project>
motus stills <project> --posters --sheet
```

Inspect every option plus entry/beat/transition frames for occlusion, hierarchy and timing. A matte failure is a visible limitation, not an occasion to claim behind-head depth. Use the pack's intact-footage fallback, choose another supported layout, or improve the matte through the engine. Never fabricate missing body or background pixels.

For a planning-only request, deliver the validated plan and the important choices, then stop before making stills, opening Studio or rendering. State that visual checks are still pending.

Use Studio and the review loop from `edit`, or render directly if already requested. Verify the MP4's dimensions, duration and audio; show the final path. Keep revisions within the selected look unless the user asks to change it. For custom brand geometry or an unsupported effect, make a separate style variant through `new-style` rather than silently changing the shared pack for every project.

## Invocation examples

- “Make a ribbon reel from this raw take. Keep it around 25 seconds.”
- “Use the premium Violet look, but stay on me during the personal story.”
- “Use Light Lime with my three portfolio screenshots and keep the full cut.”
- “Keep that card behind my head while the rows light up as I say them.”

The implementation is based on public visual study. Do not claim access to the reference product's private skill or exact renderer. See the pack's `research/README.md` for what was measured and what was reconstructed.
