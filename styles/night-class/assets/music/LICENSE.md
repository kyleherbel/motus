# Music beds: provenance and licence

`bed-a.m4a` and `bed-a2.m4a` are original. `styles/night-class/dev/make-audio.mjs` synthesises them from code: sustained bass notes with their octave, a soft swell on every beat, low-passed at 260 Hz. The note progression is an original choice in the measured register; it is not a transcription of any reference.

No reference audio was read, sampled or copied. The measured targets (loop length 7.385 s, 8 beats at 65 BPM, energy in 40-250 Hz, mono, one block of six loops and a late loop of twice the length) are recorded in `styles/night-class/research/audio.md`.

Licence: MIT, the same as the repository. See `/LICENSE`.

To regenerate: `node styles/night-class/dev/make-audio.mjs --only bed-a,bed-a2`
