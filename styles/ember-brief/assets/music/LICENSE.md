# Music bed: provenance and licence

`bed-a.m4a` is original. `styles/ember-brief/dev/make-audio.mjs` synthesises it from code: a detuned saw pad through a moving low-pass, a sine sub with a soft kick, noise hats and one held tone. The chords, the bass line and the kick pattern are original choices in the measured register; they are not a transcription of any reference.

No reference audio was read, sampled or copied. The measured targets (90 BPM, a 48 ms lead, a drumless stereo intro of 16 beats, a mono body from beat 16, a 4-beat break at beat 28, eighth-note hats from beat 32, an 8-beat harmonic loop, the level of each section and its stereo width) are recorded in `styles/ember-brief/research/audio.md`.

Licence: MIT, the same as the repository. See `/LICENSE`.

To regenerate: `node styles/ember-brief/dev/make-audio.mjs`
