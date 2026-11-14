# Example 1: a tool briefing explained without outside assets

A worked plan for the style's end-to-end test. The take is one of the repository owner's own recordings (84.7 s of 3840x2160, raw mode), cut to 48.1 s and 179 words. The plan was written from `STYLE.md` and `style.json` alone, by an editor who had not seen the style's code.

Files: `01-tool-briefing.words.json` (the conformed words the plan points at) and `01-tool-briefing.edit.json` (the plan).

Read it for how an idea becomes a device with events on its words (`STYLE.md` section 6). It is not a finished edit: the test was run with no captures, no pictures and no logos, so every graphic is built from the speaker's own words and names. The last section lists what a real edit of this take would add.

## The take

A new free repository (OpenReply) that replaces a paid comment-to-DM tool; how it works (a keyword stands for a resource); the speaker's own use of it; that it does the same job; what it saves (no per-contact fee, cheaper than a subscription); its requirement settings; a verdict; "comment the word reply".

Transcript repairs came first (`STYLE.md` section 3): three repeated takes the recogniser had hidden were re-transcribed and the last take of each kept, one abandoned sentence is cut, the product name is fixed with `captions.fixes`, two missed sentence ends are restored so the caption pairs restart where the speaker does, and "comment" is in `captions.breaks` so no caption straddles the call to action.

## From sentence to device

| Scene | The idea | Kind | Device | Events and their words |
|---|---|---|---|---|
| s01 | the hook | | `hook-title`: THIS FREE / GITHUB REPO / KILLS / MANYCHAT | fixed build |
| s02 | it is called OpenReply | where to find it | `chips`, path pills: GitHub, OpenReply | `highlight` wipes across the second pill on the name |
| s03 | one keyword stands for one giveaway | a connection | `link`: Keyword to Resource | `connect` on "represent"; the second node on "asset" |
| s04, s05 | a comment with the word goes in, the resource comes out | a process | `process`, one element across two scenes (same `key`) | `run` on "comment"; `out` on "get" |
| s06 | it does the same job as the paid tool | sameness | `item-cards`, one card each | `badge` check on "same" |
| s07 | no charge per contact | a negation | `ui-card`, one row | `toggle` goes off on "pay" |
| s08 | cheaper than the subscription | a comparison | `versus`, plain: "Free" against "Pay" | `win` on "alternative" |
| s09 to s11 | you can set requirements: follow first, a DM flow | steps on a screen | `ui-card`, 6 rows, `full`, one element across three scenes | a `toggle` on each requirement as it is named |
| s12 | the verdict | a recap | `chips`: Free, Cheaper, Open source | one chip per word |
| s13 | you can start using it yourself | a connection | `link`: You to OpenReply | `connect` on "started" |
| s14 | the offer | | `comment-cta`: REPLY | builds with the scene, holds to the last frame |

Fourteen scenes, eleven graphics, thirteen events. Every body scene carries at least one event on its own word, and ten of the twelve explain an idea with it.

## What to notice

1. **The device follows the kind of idea, not the noun.** "A keyword represents a resource" is a connection, so it is a `link` and the line draws on the verb. A card listing "Keyword" and "Resource" would name both and explain neither.
2. **Events sit on content words.** `connect` is on "represent", `run` on "comment", the check on "same", the switch on "pay". None is on the first word of its clause.
3. **One idea, one picture.** The process runs over a 5.8 s sentence, so it is two scenes with the same `key`: the input goes in during the first, the output comes out during the second. The settings card is three scenes with one `key`.
4. **Room.** Where the event's word came in the first 0.7 s (the switch on "don't") the planner moved it to the verb ("pay"), so it lands on a settled card. Where the word was the last of its sentence, the scene runs on over the next lead-in so the picture still holds.
5. **Layouts.** Split, full, split: one full run of 10 s, 21 % of the runtime, opened and closed on a sentence start, clear of the hook, the recap and the call to action.
6. **The offer.** It runs 5.3 s, so "if you want to get started" has its own short scene and `comment-cta` starts on "comment".
7. **Options.** Scenes with a real choice offer 2 or 3; the opening, the keyed scenes and the call to action are `single`.

## What the test left out

A real edit of this take would:

- capture the repository's page, its section on follow-gating and DM flows, and the paid tool's pricing page with `motus capture --find`, and show them as `capture-card` scenes with highlights. They would give the full run a graphic that needs the height, in place of the 6-row card;
- ask the owner for the opening picture, both products' marks (for the tiles in s06, s08 and s13) and one cut-out, a padlock or a price tag, for the "you don't have to pay" beat;
- ask for a recording of a comment triggering the reply, for a `player`.

Without them the pictures are thin in places: pills and a two-tile link take little of the field, and the opening title stands alone.

## Checklist (section 12)

| | |
|---|---|
| 1 Runs | pass: split first and last, 1 full run |
| 2 Opening | pass: 6 words, 4 lines, hook sentence only |
| 3 Rate | part: one graphic per 4.4 s against 3.3 s; the comparison card holds 3.8 s after its one event |
| 4 Scene starts | pass |
| 5 Full needs height | pass by the letter: a 6-row card, the only graphic tall enough without a capture |
| 6 Captures | none in this test |
| 7 Nothing invented | pass: every label is a word the speaker says |
| 8 Explains with events | pass: 10 of 12 body scenes explain an idea with events; no process or connection is a still |
| 9 Room | part: three holds are 0.7 to 1.2 s, under the 1.3 s floor |
| 10 List headings | not a list video |
| 11 Ending | pass |
| 12 Caption fixes | pass |
| 13 Pauses | fail on the given cuts: 0.34 s and 0.26 s remain |
