# Music beds: provenance and licence

`bed-a.m4a` and `bed-b.m4a` are original. `styles/editorial-proof/dev/make-audio.mjs` synthesises them from code with seeded noise, oscillators and filters, as 100 s seamless loops. The output is deterministic: running the script again gives the same audio.

No reference music was read, sampled or copied. The script only aims at measured targets (level, spectrum, tempo), which are recorded in `styles/editorial-proof/research/audio.md`.

Licence: MIT, the same as the repository. See `/LICENSE`.

To regenerate: `node styles/editorial-proof/dev/make-audio.mjs`
