# Sound effects: provenance and licence

Every `.wav` file in this folder is original. `styles/prop-room/dev/make-audio.mjs` synthesises them from code with seeded noise, oscillators and filters. The output is deterministic: running the script again gives the same bytes.

- `swell-1` to `swell-4`: noise swells, 0.35 to 1.1 s.
- `boom-1` to `boom-4`: sub booms, a sine falling from 47 (or 59) Hz.
- `ping-1` to `ping-4`: high pings, small inharmonic bells with partials up to 18 kHz.
- `reel-10`, `reel-18`, `reel-32`: a spinning-reel texture at three lengths (1.0, 1.8, 3.2 s plus a short tail).
- `printer-10`, `printer-18`, `printer-32`: a printing-mechanism texture at the same lengths.

No reference audio was read, sampled or copied. The script only aims at measured targets (duration, attack, decay, band levels, level in the mix), which are recorded in `styles/prop-room/research/audio.md` (A17-A22).

Licence: MIT, the same as the repository. See `/LICENSE`.

To regenerate: `node styles/prop-room/dev/make-audio.mjs`
