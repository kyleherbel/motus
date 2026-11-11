# Sound effects: provenance and licence

Every `.wav` file in this folder is original. `styles/editorial-proof/dev/make-audio.mjs` synthesises them from code with seeded noise, oscillators and filters. The output is deterministic: running the script again gives the same bytes.

No reference audio was read, sampled or copied. The script only aims at measured targets (duration, envelope, spectral centroid, stereo width), which are recorded in `styles/editorial-proof/research/audio.md`.

Licence: MIT, the same as the repository. See `/LICENSE`.

To regenerate: `node styles/editorial-proof/dev/make-audio.mjs`
