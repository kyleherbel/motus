# Example 1: a numbered list with sources

A worked plan for the most typical video of the style: a hook, four tools, a comment CTA. The transcript is invented, and so are the products, their pages and their numbers; the URLs are placeholders. The plan validates against the style (`motus validate`) on a copy of a test project, with the pages built as local mock-ups and captured with `motus capture` at the reading size section 6.4 asks for.

Files: `01-numbered-list.words.json` (the conformed words the plan points at) and `01-numbered-list.edit.json` (the plan, also printed at the end).

## The transcript (157 words, 39.2 s, 240 words a minute)

> Stop paying for video editing apps, because these 4 free tools do the exact same job, and most people have never heard of them. The first one is Cutline, an open-source editor with over 18,000 stars on GitHub. It cuts out your silences and your retakes automatically, so a raw take is ready to post in about a minute. Number two is frame wise. You drop in any clip and it writes the captions for you, word by word, in your own style, and it's completely free. Number three is tone box. It cleans up your audio, removes the echo from your room, and it runs right inside your browser, so there's nothing to install. And finally, real grid. It takes one long video, finds the best moments, and turns it into ten short clips, all on its own. So if you want all four, just comment tools down below and I'll send you the links directly.

Transcription suspects: "frame wise" (words 62-63, p 0.52 and 0.48), "tone box" (90-91), "real grid" (117-118). The frames and the pages say Framewise, Tonebox and Reelgrid: each becomes one word through `captions.fixes` (the name on the first word, `""` on the second).

## Reading it

1. **Kind of video.** Four ordinal sentences (words 24 "The first one is", 59 "Number two is", 87 "Number three is", 115 "And finally"): a list video. Each item opens on a white interstitial cut on the ordinal's first word, with "Tool Number" over the spelled-out ordinal, the item's page as the card and its name landing on the spoken name [S17, H16, H17]. The words the interstitial shows are hidden from the captions [T26].
2. **Anchors.** The hook is the whole first sentence (words 0-23, 182 f, inside 51-183 f) because item one starts right after it; the first interstitial replaces the title, as in 4 of 5 reference list videos [S02, H16]. The CTA is the last sentence (139-156): a standard comment CTA, keyword "Tools", already in the hook [H25].
3. **Title.** Two angles from the first sentence: "4 Free Tools That / Do The Same Job" (the count and the promise) and "Stop Paying For / Video Editing Apps" (the instruction). Both are 4 + 4 or 3 + 3 words in Title Case, with every word but "That" spoken in the first sentence [H14, H15].
4. **Hook proof.** No price is spoken, so a price list with prices would be invented. The stake is shown instead: paid apps against free tools (panels), then the four names blurred as a tease while he says most people have never heard of them [G27, G28].
5. **What each sentence gets** (section 6.2): the star count is row 1 (the repo's About box captured, the count outlined, then a tile with the page's own "18.2k" over the spoken "over 18,000") [G24, G18]; the feature claims are row 9 (the page cropped to the sentence, the carrying words highlighted on the spoken words) [G10]; "writes the captions" and "ten short clips" are row 12 (the output, in a media card) [G20]; "completely free" is backed by the page's own "Free forever", outlined [G12].
6. **Layouts.** Each item runs W, then D or L: item one W-D-P (the payoff "ready to post in about a minute" is the first punch-in, 49 f, ending on the sentence end [S16]); item two W-D-L; item three W-L, so the presenter comes back; item four W-D, then the CTA from dark [S17, S06]. Each white card carries into the dark scene after it with the same `key`, so the engine morphs instead of cutting [M15].
7. **Density.** Every card has a mark or a landing element on a spoken word. The longest scene is the first (123 f): the title builds over its first second, then the two panels and the panel title land on their words at 29, 73 and 99 f, so nothing holds longer than about 45 f [S09, S15].

## The scenes as planned

| Scene | Words | Time (s) | Frames | Pick: layout | Pick: element | Says |
|---|---|---|---|---|---|---|
| s01 | 0-15 | 0.00-4.12 | 123 | `light-split` | hook-title, compare-panels | Stop paying for video ... exact same job, |
| s02 | 16-23 | 4.12-6.07 | 58 | `light-split` | hook-title, price-list | and most people have never heard of them. |
| s03 | 24-28 | 6.07-7.34 | 38 | `white` | section-heading, source-card, name-label | The first one is Cutline, |
| s04 | 29-37 | 7.34-9.71 | 71 | `dark-focus` | source-card | an open-source editor with over 18,000 stars on GitHub. |
| s05 | 38-51 | 9.71-13.12 | 102 | `dark-focus` | source-card | It cuts out your ... raw take is |
| s06 | 52-58 | 13.12-14.74 | 49 | `presenter-full` | (presenter only) | ready to post in about a minute. |
| s07 | 59-63 | 14.74-15.99 | 37 | `white` | section-heading, source-card, name-label | Number two is frame wise. |
| s08 | 64-75 | 15.99-18.74 | 82 | `dark-focus` | source-card | You drop in any ... captions for you, |
| s09 | 76-82 | 18.74-20.50 | 53 | `light-split` | media-card | word by word, in your own style, |
| s10 | 83-86 | 20.50-21.65 | 34 | `light-split` | source-card | and it's completely free. |
| s11 | 87-91 | 21.65-22.90 | 37 | `white` | section-heading, source-card, name-label | Number three is tone box. |
| s12 | 92-102 | 22.90-25.68 | 84 | `light-split` | source-card | It cleans up your ... from your room, |
| s13 | 103-114 | 25.68-28.85 | 95 | `light-split` | source-card | and it runs right ... nothing to install. |
| s14 | 115-118 | 28.85-30.07 | 36 | `white` | section-heading, source-card, name-label | And finally, real grid. |
| s15 | 119-127 | 30.07-32.43 | 71 | `dark-focus` | source-card | It takes one long video, finds the best moments, |
| s16 | 128-138 | 32.43-35.02 | 78 | `dark-focus` | media-card | and turns it into ... on its own. |
| s17 | 139-156 | 35.02-39.67 | 139 | `presenter-full` | comment-cta | So if you want ... the links directly. |

## Checks

| Check (section 12) | This plan | Target |
|---|---|---|
| Scenes per minute | 25.7 | 20-32 |
| Scene length | median 71 f, 34-139 f, 17 of 17 within 25-145 f | median 45-75 f, none under 15 or over 233 |
| Layout sequence | LWDPWDLWLWDP (12 runs) | starts L, ends P |
| Layout changes per minute | 16.6 | 10-17 |
| Runtime shares | L 38 %, W 13 %, D 34 %, P 16 % | L 30-50, D 30-50, P 8-23, W 0-22 % |
| Presenter visible | 53 % | 39-73 % |
| Longest stretch without the presenter | 7.0 s | at most 11 s |
| Card types (picks) | compare-panels 1, price-list 1, source-card 11, media-card 2 | 2-6 types |
| Emphasised words | 24 of 157 (15 %), about 34 % of caption lines | about 1 line in 3 |

## The options

- Every scene but the CTA has two options that are different ideas: the page against a designed restatement (s05, s08, s15: a `steps-card` of what he lists), the page against its logo card (every interstitial), the close reading against the presenter (s04, s12, s16), a punch-in against staying on the page (s02, s06, s10).
- The CTA is `single` with its reason in `note` (section 9).
- No option makes an illegal sequence with its neighbours: nothing goes from white to the full-frame presenter, and the presenter is never away for more than about 7 s whatever is picked. Picking both extra punch-ins (s02 b and s10 b) raises the layout changes to about 20 a minute: the `why` lines keep them as alternatives, not recommendations.

## What to tell the user

- The four pages were captured at reading size; the 18.2k on screen is the page's figure for "over 18,000".
- Fixed names: Framewise, Tonebox, Reelgrid.
- Music bed `a` (the next video should use `b`).

## The plan

`01-numbered-list.edit.json`, word indexes from `01-numbered-list.words.json`:

```json
{
  "motus": 1, "style": "editorial-proof", "look": {"accent": "blue"},
  "captions": {
    "fixes": {"62": "Framewise", "63": "", "90": "Tonebox", "91": "", "117": "Reelgrid", "118": ""},
    "emphasis": {"5": "accent+serif", "8": "accent", "10": "accent+serif", "13": "serif", "20": "accent", "30": "accent+serif", "34": "accent", "37": "accent+serif", "42": "accent+serif", "45": "accent+serif", "46": "serif", "58": "accent+serif", "73": "accent+serif", "82": "serif", "86": "accent", "96": "accent+serif", "99": "accent+serif", "109": "accent+serif", "112": "accent", "122": "serif", "127": "accent+serif", "132": "accent", "138": "serif", "144": "accent"},
    "hide": [[24, 28], [59, 63], [87, 91], [115, 118]]
  },
  "scenes": [
    { "id": "s01", "words": [0, 15], "role": "hook", "pick": "a",
      "options": [
        {"id": "a", "label": "Paid vs free", "why": "Puts the stake of the first sentence side by side: the apps you pay for against 4 free tools", "layout": "light-split", "slots": {"title": {"type": "hook-title", "key": "title", "line1": "4 Free Tools That", "strip": "Do The Same Job", "exit": "cut"}, "card": {"type": "compare-panels", "key": "stake", "title": "The exact same job", "titleAt": 13, "left": {"title": "Paid apps", "sub": "video editing apps", "icon": "cross", "at": 4}, "right": {"title": "Free tools", "sub": "these 4 free tools", "icon": "check", "at": 9}}}},
        {"id": "b", "label": "Stop paying", "why": "Leads with the instruction itself and lets the four free tools land as a count", "layout": "light-split", "slots": {"title": {"type": "hook-title", "key": "title", "line1": "Stop Paying For", "strip": "Video Editing Apps", "exit": "cut"}, "card": {"type": "big-number", "key": "stake", "value": "4", "label": "free tools", "skin": "white", "at": 8}}}
      ] },
    { "id": "s02", "words": [16, 23], "role": "hook", "pick": "a",
      "options": [
        {"id": "a", "label": "Blurred teaser", "why": "Most people have never heard of them: the four names stay blurred until each item opens", "layout": "light-split", "slots": {"title": {"type": "hook-title", "key": "title", "line1": "4 Free Tools That", "strip": "Do The Same Job", "exit": "cut"}, "card": {"type": "price-list", "key": "teaser", "rows": [{"name": "Cutline", "price": "Free", "blur": true}, {"name": "Framewise", "price": "Free", "blur": true}, {"name": "Tonebox", "price": "Free", "blur": true}, {"name": "Reelgrid", "price": "Free", "blur": true}]}}},
        {"id": "b", "label": "Punch-in", "why": "Says the curiosity line to camera, then cuts straight to tool one", "layout": "presenter-full", "slots": {}}
      ] },
    { "id": "s03", "words": [24, 28], "role": "item", "pick": "a",
      "options": [
        {"id": "a", "label": "Repo page", "why": "Opens item one on its repo, the page that carries the star count he is about to say", "layout": "white", "slots": {"heading": {"type": "section-heading", "line": "Tool Number", "block": "One"}, "card": {"type": "source-card", "key": "cutline", "src": "assets/cutline-about.png", "url": "github.com/example/cutline", "counter": "1/4"}, "name": {"type": "name-label", "text": "Cutline", "at": 28}}},
        {"id": "b", "label": "Name card", "why": "A clean logo card with the line he says about it, when the repo page is too busy", "layout": "white", "slots": {"heading": {"type": "section-heading", "line": "Tool Number", "block": "One"}, "card": {"type": "logo-card", "key": "cutline-name", "name": "Cutline", "tagline": "An open-source editor", "skin": "white"}, "name": {"type": "name-label", "text": "Cutline", "at": 28}}}
      ] },
    { "id": "s04", "words": [29, 37], "role": "proof", "pick": "a",
      "options": [
        {"id": "a", "label": "Stars on the page", "why": "The repo card carries into dark focus; open-source is highlighted and the 18,000 stars land as the page's 18.2k", "layout": "dark-focus", "slots": {"card": {"type": "source-card", "key": "cutline", "src": "assets/cutline-about.png", "url": "github.com/example/cutline", "counter": "1/4", "beats": [{"at": 30, "do": "highlight", "find": "open-source video editor"}, {"at": 34, "do": "outline", "find": "18.2k stars"}, {"at": 35, "do": "number", "value": "18.2k", "label": "GitHub stars"}]}}},
        {"id": "b", "label": "Star count alone", "why": "Keeps the presenter in view and gives the star count the whole card", "layout": "light-split", "slots": {"card": {"type": "big-number", "key": "cutline-stars", "value": "18.2k", "label": "stars on GitHub", "source": "github.com/example", "at": 34}}}
      ] },
    { "id": "s05", "words": [38, 51], "role": "how", "pick": "a",
      "options": [
        {"id": "a", "label": "Feature list", "why": "Reads the README line that says exactly what he says: silences and retakes, removed automatically", "layout": "dark-focus", "slots": {"card": {"type": "source-card", "key": "cutline-readme", "src": "assets/cutline-readme.png", "url": "github.com/example/cutline", "counter": "1/4", "beats": [{"at": 42, "do": "highlight", "find": "removes silences and retakes automatically"}]}}},
        {"id": "b", "label": "Struck rows", "why": "Shows the two things it cuts out, each struck through as he names it", "layout": "dark-focus", "slots": {"card": {"type": "steps-card", "key": "cutline-steps", "title": "Cut out automatically", "rows": [{"text": "Silences", "marker": "none", "at": 42}, {"text": "Retakes", "marker": "none", "at": 45}], "beats": [{"at": 43, "do": "strike", "row": 1}, {"at": 46, "do": "strike", "row": 2}]}}}
      ] },
    { "id": "s06", "words": [52, 58], "role": "payoff", "pick": "a",
      "options": [
        {"id": "a", "label": "Punch-in", "why": "The payoff of item one, ready to post in about a minute, said straight to camera", "layout": "presenter-full", "slots": {}},
        {"id": "b", "label": "Stay on README", "why": "Keeps reading the same page and marks its line about a ready-to-post cut", "layout": "dark-focus", "slots": {"card": {"type": "source-card", "key": "cutline-readme", "src": "assets/cutline-readme.png", "url": "github.com/example/cutline", "counter": "1/4", "beats": [{"at": 52, "do": "highlight", "find": "ready to post cut in about a minute"}]}}}
      ] },
    { "id": "s07", "words": [59, 63], "role": "item", "pick": "a",
      "options": [
        {"id": "a", "label": "Home page", "why": "Opens item two on its own home page, which carries over into the close reading", "layout": "white", "slots": {"heading": {"type": "section-heading", "line": "Tool Number", "block": "Two"}, "card": {"type": "source-card", "key": "framewise", "src": "assets/framewise-home.png", "url": "framewise.example.com", "counter": "2/4"}, "name": {"type": "name-label", "text": "Framewise", "at": 62}}},
        {"id": "b", "label": "Name card", "why": "Introduces item two by name only; the page comes in the next sentence", "layout": "white", "slots": {"heading": {"type": "section-heading", "line": "Tool Number", "block": "Two"}, "card": {"type": "logo-card", "key": "framewise-name", "name": "Framewise", "skin": "white"}, "name": {"type": "name-label", "text": "Framewise", "at": 62}}}
      ] },
    { "id": "s08", "words": [64, 75], "role": "what", "pick": "a",
      "options": [
        {"id": "a", "label": "Its own words", "why": "The page says it writes your captions word by word; highlighted as he says writes the captions", "layout": "dark-focus", "slots": {"card": {"type": "source-card", "key": "framewise", "src": "assets/framewise-home.png", "url": "framewise.example.com", "counter": "2/4", "beats": [{"at": 71, "do": "highlight", "find": "writes your captions word by word"}]}}},
        {"id": "b", "label": "Clip in, captions out", "why": "Two steps he names, drop in a clip and it writes the captions, landing on their words", "layout": "dark-focus", "slots": {"card": {"type": "steps-card", "key": "framewise-steps", "rows": [{"text": "Drop in any clip", "marker": "upload", "at": 65}, {"text": "It writes the captions", "marker": "doc", "at": 71}], "beats": [{"at": 73, "do": "check", "row": 2}]}}}
      ] },
    { "id": "s09", "words": [76, 82], "role": "demo", "pick": "a",
      "options": [
        {"id": "a", "label": "Captioned frame", "why": "Shows the output he describes: a frame captioned word by word in its own style", "layout": "light-split", "slots": {"card": {"type": "media-card", "key": "framewise-out", "items": [{"src": "assets/captions.png", "label": "Word by word", "at": 76}]}}},
        {"id": "b", "label": "Page line", "why": "Stays on the source and lets the presenter back in while the same line reads word by word", "layout": "light-split", "slots": {"card": {"type": "source-card", "key": "framewise-l", "src": "assets/framewise-home.png", "url": "framewise.example.com", "counter": "2/4", "beats": [{"at": 76, "do": "highlight", "find": "writes your captions word by word"}]}}}
      ] },
    { "id": "s10", "words": [83, 86], "role": "payoff", "pick": "a",
      "options": [
        {"id": "a", "label": "Free forever", "why": "Completely free is backed by the page's own line, outlined on the word free", "layout": "light-split", "slots": {"card": {"type": "source-card", "key": "framewise-free", "src": "assets/framewise-home.png", "url": "framewise.example.com", "counter": "2/4", "beats": [{"at": 86, "do": "outline", "find": "free forever"}]}}},
        {"id": "b", "label": "Punch-in", "why": "Completely free is the payoff of item two; said to camera before item three", "layout": "presenter-full", "slots": {}}
      ] },
    { "id": "s11", "words": [87, 91], "role": "item", "pick": "a",
      "options": [
        {"id": "a", "label": "Home page", "why": "Opens item three on its page; the presenter comes back with it in the next sentence", "layout": "white", "slots": {"heading": {"type": "section-heading", "line": "Tool Number", "block": "Three"}, "card": {"type": "source-card", "key": "tonebox", "src": "assets/tonebox-home.png", "url": "tonebox.example.com", "counter": "3/4"}, "name": {"type": "name-label", "text": "Tonebox", "at": 90}}},
        {"id": "b", "label": "Name card", "why": "Introduces item three by name only, a quieter beat after the free payoff", "layout": "white", "slots": {"heading": {"type": "section-heading", "line": "Tool Number", "block": "Three"}, "card": {"type": "logo-card", "key": "tonebox-name", "name": "Tonebox", "skin": "white"}, "name": {"type": "name-label", "text": "Tonebox", "at": 90}}}
      ] },
    { "id": "s12", "words": [92, 102], "role": "what", "pick": "a",
      "options": [
        {"id": "a", "label": "Echo line", "why": "Back to the presenter with the page; removes room echo is highlighted as he says removes the echo", "layout": "light-split", "slots": {"card": {"type": "source-card", "key": "tonebox-l", "src": "assets/tonebox-home.png", "url": "tonebox.example.com", "counter": "3/4", "beats": [{"at": 97, "do": "highlight", "find": "removes room echo"}]}}},
        {"id": "b", "label": "Close reading", "why": "Carries the page into dark focus for a closer read of the echo line", "layout": "dark-focus", "slots": {"card": {"type": "source-card", "key": "tonebox", "src": "assets/tonebox-home.png", "url": "tonebox.example.com", "counter": "3/4", "beats": [{"at": 97, "do": "highlight", "find": "removes room echo"}]}}}
      ] },
    { "id": "s13", "words": [103, 114], "role": "benefit", "pick": "a",
      "options": [
        {"id": "a", "label": "Browser, no install", "why": "The same page keeps going: runs in your browser outlined, nothing to install highlighted on their words", "layout": "light-split", "slots": {"card": {"type": "source-card", "key": "tonebox-l", "src": "assets/tonebox-home.png", "url": "tonebox.example.com", "counter": "3/4", "beats": [{"at": 105, "do": "outline", "find": "runs in your browser"}, {"at": 112, "do": "highlight", "find": "nothing to install"}]}}},
        {"id": "b", "label": "Browser vs install", "why": "Contrasts the two halves of the sentence: runs in your browser, nothing to install", "layout": "dark-focus", "slots": {"card": {"type": "compare-panels", "key": "tonebox-compare", "left": {"title": "Browser", "sub": "runs right inside", "icon": "check", "at": 105}, "right": {"title": "Install", "sub": "nothing to install", "icon": "cross", "at": 112}}}}
      ] },
    { "id": "s14", "words": [115, 118], "role": "item", "pick": "a",
      "options": [
        {"id": "a", "label": "Home page", "why": "Opens the last item on its page, carried into the close reading", "layout": "white", "slots": {"heading": {"type": "section-heading", "line": "Tool Number", "block": "Four"}, "card": {"type": "source-card", "key": "reelgrid", "src": "assets/reelgrid-home.png", "url": "reelgrid.example.com", "counter": "4/4"}, "name": {"type": "name-label", "text": "Reelgrid", "at": 117}}},
        {"id": "b", "label": "Name card", "why": "Names the last tool on its own before its page appears", "layout": "white", "slots": {"heading": {"type": "section-heading", "line": "Tool Number", "block": "Four"}, "card": {"type": "logo-card", "key": "reelgrid-name", "name": "Reelgrid", "skin": "white"}, "name": {"type": "name-label", "text": "Reelgrid", "at": 117}}}
      ] },
    { "id": "s15", "words": [119, 127], "role": "what", "pick": "a",
      "options": [
        {"id": "a", "label": "Best moments", "why": "Its page says it finds the best moments; highlighted as he says it", "layout": "dark-focus", "slots": {"card": {"type": "source-card", "key": "reelgrid", "src": "assets/reelgrid-home.png", "url": "reelgrid.example.com", "counter": "4/4", "beats": [{"at": 124, "do": "highlight", "find": "finds the best moments"}]}}},
        {"id": "b", "label": "Three steps", "why": "His sentence is a process: one long video, best moments found, short clips out", "layout": "dark-focus", "slots": {"card": {"type": "steps-card", "key": "reelgrid-steps", "rows": [{"text": "One long video", "marker": "upload", "at": 121}, {"text": "Finds the best moments", "marker": "search", "at": 124}, {"text": "Ten short clips", "marker": "bolt", "at": 132}]}}}
      ] },
    { "id": "s16", "words": [128, 138], "role": "demo", "pick": "a",
      "options": [
        {"id": "a", "label": "Clip stack", "why": "Ten short clips, shown as three of them stacking in on ten, clips and all", "layout": "dark-focus", "slots": {"card": {"type": "media-card", "key": "reelgrid-out", "items": [{"src": "assets/clip1.png", "label": "Clip 1", "at": 132}, {"src": "assets/clip2.png", "label": "Clip 2", "at": 134}, {"src": "assets/clip3.png", "label": "Clip 3", "at": 135}]}}},
        {"id": "b", "label": "One clip, presenter", "why": "Brings the presenter back for the payoff with one finished clip above", "layout": "light-split", "slots": {"card": {"type": "media-card", "key": "reelgrid-one", "items": [{"src": "assets/clip1.png", "label": "Short clip", "at": 132}]}}}
      ] },
    { "id": "s17", "words": [139, 156], "role": "cta", "single": true, "note": "The style's ending is fixed: he asks for a comment with the keyword tools, already spoken in the hook.", "pick": "a",
      "options": [
        {"id": "a", "label": "Comment Tools", "why": "Comment tools, as he says it, with the keyword he used in the first sentence", "layout": "presenter-full", "slots": {"cta": {"type": "comment-cta", "keyword": "Tools", "tone": "blue"}}}
      ] }
  ],
  "audio": {"sfx": true, "bed": "a"}
}
```
