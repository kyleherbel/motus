# Type study

Independent analysis of the public inset samples. Original data and evidence stay in the ignored corpus.

```json
{
  "dimension": "type",
  "summary": "Independent study of one 20.006-second 1920x1080, 30fps public promo showing two Violet reels, plus six marketing boards. Interior phone viewport estimated x830,y110,w540,h960; normalized scale 2. No paid source files inspected. Eleven frames extracted, four type detail crops; candidate font metrics compared.",
  "rules": [
    {
      "id": "T01",
      "rule": "Use mixed type within short phrases: upright geometric sans plus one larger contrast-rich italic span. Do not replace with uniformly heavy kinetic subtitles.",
      "values": {
        "font_reported_by_listing": [
          "DM Sans",
          "Playfair italic"
        ],
        "candidate_match": [
          "DM Sans variable, upright",
          "Playfair Display variable, italic"
        ],
        "weight_start_points": {
          "sans": 400,
          "headline_italic": 700,
          "card_italic": 500
        }
      },
      "evidence": "clip01@60,165,246,402,555; board02, board04",
      "confidence": "medium",
      "limits": "Named family comes from listing. Variable-file version and precise weights are not recoverable from the raster. Candidate glyph widths compared with official font files."
    },
    {
      "id": "T02",
      "rule": "The main phrase is a centered line below the face. Serif emphasis rises above sans while sharing a baseline.",
      "values": {
        "normalized_sans_css_start": 96,
        "normalized_italic_css_start": 112,
        "normalized_letter_spacing_start": -2,
        "visible_ink_at_clip01_f060": {
          "sans": [
            238,
            1320,
            264,
            92
          ],
          "italic": [
            518,
            1300,
            330,
            106
          ]
        },
        "headline_total_width_at_f060": 610,
        "single_line": true,
        "typical_phrase_words": [
          2,
          5
        ]
      },
      "evidence": "clip01@60; evidence/measured envelopes saved in ../measured-envelopes.json",
      "confidence": "medium",
      "limits": "Ink boxes are threshold measurements; CSS sizes are candidate-fit estimates, not source code values. Font optical size and tracking are coupled."
    },
    {
      "id": "T03",
      "rule": "A small cream capsule sets up the large phrase; it is a separate typographic tier, not the main subtitle container.",
      "values": {
        "capsule_bbox_1080": [
          332,
          1190,
          414,
          84
        ],
        "capsule_text_ink_bbox_1080": [
          374,
          1214,
          332,
          40
        ],
        "text_css_start": 42,
        "horizontal_padding_start": 40,
        "radius_start": 42,
        "fill_sample_srgb": "#f6f2e7",
        "ink_sample_srgb": "#171e37"
      },
      "evidence": "clip01@60; pill region x996,y705,w207,h42 in native promo; clip01@246,555 supports stable y position",
      "confidence": "high for raster bounds; medium for rendering tokens",
      "limits": "Bounds apply to one label. Capsule widens for longer wording; same 84px height approximately."
    },
    {
      "id": "T04",
      "rule": "Card titles repeat the mixed type pairing at roughly half the main phrase size. Upper-left alignment and ample inset let the speaker occlude the lower card.",
      "values": {
        "sans_css_start": 44,
        "italic_css_start": 56,
        "card_title_left_start": 100,
        "card_title_top_start": 220,
        "card_padding_start": 44,
        "row_text_css_start": 36,
        "row_height_start": 80
      },
      "evidence": "clip01@60,246,555; board04",
      "confidence": "medium",
      "limits": "Projected design tokens from one half-resolution promo, no native full-reel download. Position varies with card frame."
    },
    {
      "id": "T05",
      "rule": "Italic emphasis gets a fine lavender underline tied to that span only, with no solid highlight block behind the main words.",
      "values": {
        "stroke_start": 3,
        "stroke_range": [
          2,
          4
        ],
        "underline_span_width_at_f060": 338,
        "underline_y_start": 1402,
        "glow": "none or very soft"
      },
      "evidence": "clip01@60,165,402",
      "confidence": "medium",
      "limits": "Horizontal stroke antialiasing and motion make subpixel thickness uncertain. Timing belongs to motion study."
    },
    {
      "id": "T06",
      "rule": "Abstract scenes keep the main type hierarchy but add a white search capsule below it. Search copy is regular sans, dark ink, with an outline search icon.",
      "values": {
        "search_box_1080_approx": [
          180,
          1428,
          720,
          108
        ],
        "search_text_css_start": 44,
        "search_radius_start": 54,
        "headline_ink_y_range": [
          1280,
          1416
        ],
        "search_icon_size_start": 40
      },
      "evidence": "clip01@165,402",
      "confidence": "medium",
      "limits": "These are rounded geometry estimates from normalized crops. Search text is a short clause, not a scrolling paragraph."
    },
    {
      "id": "T07",
      "rule": "Frosted cards are pale opaque/translucent surfaces with dark navy text; the room remains visible around them. Main captions are near-white against a darkened torso, not over the face.",
      "values": {
        "sampled_card_srgb": "#dbd2e7",
        "sampled_ink_srgb": "#171e37",
        "sampled_white_srgb": "#fdfbfd",
        "card_grain": "subtle, brighter than surrounding room",
        "card_fill": "pale lavender/cream, largely opaque",
        "background_caption_gradient": "darkens lower torso to near-black"
      },
      "evidence": "clip01@60,246,555 and material-samples.json",
      "confidence": "high for contrast hierarchy; medium for sampled colors",
      "limits": "Samples are decoded promo RGB, not source color constants. Compression, grading, glows and the card gradient affect values."
    },
    {
      "id": "T08",
      "rule": "Light Lime is a distinct spatial typography system: oversized italic lime words behind a much smaller full-body speaker, with a foreground white nameplate.",
      "values": {
        "emphasis": "large bright italic serif, behind head",
        "nameplate": "bold sans name + smaller regular role",
        "hierarchy": "photo triptych / oversized word / full-body presenter / nameplate"
      },
      "evidence": "board05, board06",
      "confidence": "high for static structure, low for precise size and timing",
      "limits": "Only marketing boards show Light Lime. No actual Light Lime animation is present in clip01; do not claim measured animation."
    }
  ],
  "constant_vs_variable": "Pairing, capsule/main-phrase hierarchy, dark ink on pale surfaces, and italic underline are consistent in the sampled Violet treatments. Phrase width and card line breaks depend on wording. Light Lime is treated separately.",
  "open_questions": [
    "Exact source font files, weights, optical-size axis and tracking cannot be proven from the promo.",
    "No separate full-resolution reel export is available.",
    "Motion and audio require their own analyses."
  ],
  "needs_human_check": [
    "Review candidate font render against the reference on an actual Motus frame.",
    "Check final text placement against the new speaker face and hands; do not hard-code source-person occlusion."
  ]
}
```
