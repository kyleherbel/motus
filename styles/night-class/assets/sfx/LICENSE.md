# Sound effects: provenance and licence

Every `.wav` file in this folder is original. `styles/night-class/dev/make-audio.mjs` synthesises them from code with seeded noise, oscillators and filters. The output is deterministic: running the script again gives the same bytes.

No reference audio was read, sampled or copied. The script only aims at measured targets (duration, attack and decay, frequency band, stereo width, and where the picture change falls), which are recorded in `styles/night-class/research/audio.md`.

Licence: MIT, the same as the repository. See `/LICENSE`.

To regenerate: `node styles/night-class/dev/make-audio.mjs`
