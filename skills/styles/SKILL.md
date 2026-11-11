---
name: styles
description: List the Motus editing styles installed with this plugin and explain what each one looks like and suits. Use when the user asks which editing styles exist, what a style does, or which style fits their video.
---

# Motus styles

Run `node "${CLAUDE_PLUGIN_ROOT}/engine/bin/motus.mjs" styles --json` (outside Claude Code the CLI is two folders above this skill: `<this skill>/../../engine/bin/motus.mjs`).

For each style report its name, version, one-line summary and what it is best for. When the user wants more detail about one, read that style's `STYLE.md` (the `guide` path in the output): describe its look, pacing and the kinds of video it suits in a few plain sentences, and mention anything it needs from the footage (framing, evidence, assets).

If the user is choosing for a specific video, ask what the video is (or look at it with the `edit` skill's ingest step) and recommend one style with the reason.

New styles arrive with plugin updates. To build one from reference videos, use the `new-style` skill.
