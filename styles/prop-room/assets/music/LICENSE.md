# Music beds: provenance and licence

`bed-a.m4a`, `bed-b.m4a` and `bed-c.m4a` are original. `styles/prop-room/dev/make-audio.mjs` synthesises them from code: band-limited saw and sine oscillators, seeded noise and filters, with no samples.

- `bed-a`: 130 BPM, a kick on every beat, a held bass that dips on each beat and changes note every 8 beats, off-beat and sixteenth-note hats, held chords.
- `bed-b`: 118 BPM, a long low kick on every beat whose pitch follows the bass (one note per 8 beats), held electric-piano chords, an eighth-note pluck line, hats and a ride.
- `bed-c`: a pad with no beat: held five-voice chords changing at irregular times, a gliding low root, an occasional low note and a few high held tones.

The chords, bass lines and patterns are original choices in the measured register; they are not a transcription. No reference audio was read, sampled or copied. The measured targets (tempo, the 8-beat bass change, the share of energy under 80 Hz, the octave-band shape, dual mono, a start on the downbeat with no fades, the level under the voice) are recorded in `styles/prop-room/research/audio.md` (A10-A16).

Licence: MIT, the same as the repository. See `/LICENSE`.

To regenerate: `node styles/prop-room/dev/make-audio.mjs`
