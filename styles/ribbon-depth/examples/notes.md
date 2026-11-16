# Worked examples

Both transcripts are original illustrative scripts. Word times are synthetic, for planning and renderer tests. They are not transcriptions of the reference or recordings of a real speaker.

- `01-process`: a subject behind the speaker, a word-timed stack and typed query, a comparison, then a click. Each scene also has a presenter-only alternative. It demonstrates the declared parameters, not a mandatory sequence.
- `02-gallery`: a small presenter with three supplied images and a word behind the head; a circular portrait/query; a filmstrip. It uses Light Lime's distinct composition. The named image files are placeholders that must be replaced with real project assets before use. `dev/verify-browser.mjs` provides original abstract SVG test images in memory for this example.

Use the matching `.words.json` with each plan. Never copy these word indexes to an unrelated recording. `dev/verify-browser.mjs <project> <output-dir>` exercises both examples with synthetic footage, with and without a matte, and checks repeat seeking. It does not replace the project's plan.
