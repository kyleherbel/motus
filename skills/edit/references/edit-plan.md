# The edit plan (`plan/edit.json`)

The plan says, for every stretch of the video, what could be on screen. It refers to words by their index in `conform/words.json` (output timeline, numbered from 0). `motus validate <project>` checks it against the engine and the chosen style and tells you how to fix each problem.

```jsonc
{
  "motus": 1,
  "style": "<style id>",
  "look": { "<look option>": "<choice>" },        // global choices declared in the style's style.json; omit to use defaults

  "captions": {
    "fixes":    { "87": "Claude" },                 // word index -> the text to show (repair ASR, casing, numerals); "" hides a word
    "emphasis": { "14": "<kind>" },                 // word index -> one of the style's emphasis kinds
    "breaks":   [8, 13],                            // force a new caption group to start at these words
    "hide":     [[40, 44]]                          // word ranges with no caption (for example while a graphic says the same thing)
  },

  "scenes": [
    {
      "id": "s01",
      "words": [0, 11],                             // first and last word of the scene, inclusive
      "role": "hook",                               // one of the style's roles
      "options": [
        {
          "id": "a",
          "label": "Price list",                    // 2-4 words: what the user reads on the card
          "why": "Shows the five prices he is about to replace",   // one line: why this fits what is said
          "layout": "<layout id>",
          "slots": {
            "<slot>": {
              "type": "<element type>",
              "key": "prices",                      // optional identity: same key in the same slot of the next scene = stays on screen
              "…params": "as declared for the element in style.json",
              "beats": [ { "at": 7, "do": "<beat>" } ]   // things that happen inside the element, anchored to a word
            }
          }
        },
        { "id": "b", "label": "…", "why": "…", "layout": "…", "slots": {} }
      ],
      "pick": "a"                                   // your recommendation
    }
  ],

  "audio": { "sfx": true, "music": null, "musicGainDb": -24 }   // music: a file under assets/, only if the user supplied one
}
```

## Rules the validator enforces

- **Scenes tile the transcript.** The first scene starts at word 0, each scene starts at the word after the previous scene's last word, the last scene ends at the last word. Silence before the first word and after the last belongs to the first and last scene.
- **Only declared things.** `layout`, slot names, element `type`, every parameter and every beat must exist in the style's `style.json`. An unknown field is an error, so a typo cannot silently render nothing.
- **Beats stay inside their scene.** `at` is a word index within the scene's `words`; or `{ "t": seconds }` on the output timeline; or `{ "rel": seconds }` from the scene start.
- **2 to 4 options per scene.** Use `"single": true` on a scene only when there is honestly one sensible treatment (the style guide says when).
- **Assets exist.** A parameter of type `asset` is a path under the project's `assets/` folder that is already there.
- **Text limits.** Parameters with `maxChars` or `maxWords` are layout limits measured on the style, not suggestions.

## How scene times are derived

A scene starts a couple of frames before its first word (the style sets the exact lead) and runs until the next scene starts. You do not write times. To move a boundary, change the word it starts on.

## Keys and continuity

Within one layout, an element that keeps the same `key` in the same slot across consecutive scenes stays on screen without leaving and re-entering: use that when the next sentence keeps talking about the same thing and only a beat (a highlight, a strike, a number) changes. A different key, or no key, is a swap. Changing `layout` between scenes is the style's bigger transition.

## Options that are worth offering

Each option should be a different idea about what the sentence needs: evidence, a number, a list building up, the presenter alone. If two options differ only in a colour or a word, merge them. Always make `why` specific to the words spoken in that scene.

## After the user reviews

`review/state.json` (written by Studio) overrides `pick` and holds notes and locks; you do not edit it. When you revise a scene's options in response to a note, Studio notices the change, shows the scene as updated and clears its lock. Run `motus ack <project> <scene ids> --reply "…"` so the note is filed as addressed.
