# Music beds and sound effect: provenance and licence

`bed-a.m4a`, `bed-b.m4a` and `../sfx/swell.wav` are original. `styles/seamline/dev/make-audio.mjs` synthesises them from code: detuned band-limited saws through low-pass filters, a soft keys tone, a sine sub pulse, a sine drone and seeded noise. The chords and patterns are original choices in the measured register; they are not a transcription of any reference.

No reference audio was read, sampled or copied. The measured targets (a dark tonal underscore with most of its energy under 1 kHz, wide stereo, full level from the first frame, never ducked, 10 to 13 LU under the voice; a steady pulse near 105 BPM in some videos and none in others; a low swell from frame 0 peaking about 370 ms in) are recorded in `styles/seamline/research/audio.md`.

Licence: MIT, the same as the repository. See `/LICENSE`.

To regenerate: `node styles/seamline/dev/make-audio.mjs`
