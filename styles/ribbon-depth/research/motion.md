# Motion study

Independent analysis of the public inset samples. Original data and evidence stay in the ignored corpus.

```json
{
  "dimension": "motion",
  "summary": "Independent inspection of one public 20.0-second, 30fps promotional video containing two ten-second Violet reels. Native phone viewport 540x960 inside a 1920x1080 ad. Consecutive-frame strips and optical-flow/threshold measurements were used. Light Lime motion is not demonstrated in this video.",
  "method": {
    "source_alias": "clip01",
    "crop": {
      "x": 830,
      "y": 110,
      "w": 540,
      "h": 960
    },
    "native_fps": 30,
    "sample_frames": 600,
    "normalization": "Multiply phone-pixel measurements by 2 for 1080x1920. All frame indices are zero-based. Small advertising AFTER badge overlaps the very top and was ignored.",
    "code": "scripts/measure.py",
    "easing": "No easing curve was fitted. Do not describe approximations as measured cubic-bezier values."
  },
  "rules": [
    {
      "id": "M01",
      "rule": "Build the presenter composition in layers; the speaker is already visible while the rear card and ribbon arrive, then foreground type follows.",
      "values": {
        "card_first_visible_frame": 2,
        "card_mostly_opaque_frame": 14,
        "ribbon_reveal_frames": [
          6,
          16
        ],
        "foreground_phrase_reveal_frames": [
          20,
          27
        ],
        "fps": 30,
        "opening_card_top_y_phone_px_at_frames": {
          "5": 125,
          "8": 110,
          "11": 104,
          "15": 100
        }
      },
      "evidence": "clip01@0-27; evidence/opening.jpg; card threshold bounds metrics.json. One opening measured, second opening visually corroborates the same hierarchy.",
      "confidence": "medium",
      "limits": "The card opacity and underlying person overlap make the first two pixels subjective; +/-2 frames. Native phone 540x960; multiply pixel distances by 2 for 1080x1920. No easing curve fitted."
    },
    {
      "id": "M02",
      "rule": "Presenter-to-abstract scene changes use a brief outgoing defocus/scale pulse, then an incoming vertical smear that resolves into the new scene.",
      "values": {
        "outgoing_start": 122,
        "cut_frame": 128,
        "incoming_readable_frames": [
          136,
          140
        ],
        "total_visible_interval_frames": [
          122,
          140
        ],
        "strongest_smear_frames": [
          128,
          135
        ],
        "seconds": [
          4.0667,
          4.6667
        ],
        "second_instance": {
          "outgoing_start": 457,
          "cut_frame": 463,
          "incoming_readable_frame": 471
        }
      },
      "evidence": "clip01@120-140 and @454-474; evidence/to-abstract.jpg and content-cut.jpg; Laplacian variance falls 1133.9 at f121 to 108.0 at f122 and 38.9 at f128.",
      "confidence": "high",
      "limits": "Blur type is visually directional (vertical streaks), with slight colored edge separation visible on the arriving card. Exact filter kernel, strength and scale are not recoverable. The approximately 0.6s interval includes content fades as well as the camera pulse."
    },
    {
      "id": "M03",
      "rule": "Abstract-to-presenter transitions are related but shorter on the outgoing side; the subject arrives through a vertical stretch/blur and snaps back to normal.",
      "values": {
        "example_a": {
          "outgoing_visible_defocus": 213,
          "cut": 216,
          "subject_readable": 222,
          "mostly_settled": 225
        },
        "example_b": {
          "outgoing_visible_defocus": 413,
          "cut": 415,
          "subject_readable": 422,
          "mostly_settled": 424
        },
        "example_c": {
          "outgoing_visible_defocus": 510,
          "cut": 512,
          "incoming_media_readable": 520
        }
      },
      "evidence": "clip01@209-230, @409-430, @507-528; evidence/to-presenter.jpg, return-cut.jpg, evidence-cut.jpg.",
      "confidence": "high",
      "limits": "Do not convert every cut into one stock transition. A separate presenter-to-CTA cut at f278 is direct, without the same incoming smear."
    },
    {
      "id": "M04",
      "rule": "Abstract card sequences build sequentially along an upward light path; later cards arrive from different directions, rather than all dropping together.",
      "values": {
        "three_card_first_visible_frames": [
          132,
          159,
          187
        ],
        "stagger_frames": [
          27,
          28
        ],
        "stagger_seconds": [
          0.9,
          0.9333
        ],
        "first_card_phone_y_top": {
          "132": 522,
          "136": 474,
          "146": 459
        },
        "second_card_phone_x_left": {
          "159": 270,
          "162": 214,
          "165": 181,
          "168": 163,
          "170": 156
        },
        "second_card_reveal_duration_frames_estimate": [
          14,
          18
        ],
        "third_card_arrival": "from above, fade + small settle"
      },
      "evidence": "clip01@132-199; metrics.json threshold components plus evidence/tenfps-01.jpg and tenfps-02.jpg. Cards observed in three abstract sequences, detailed bounds measured in the first.",
      "confidence": "medium",
      "limits": "Threshold bounding boxes include occasional connected beam pixels and are unsuitable for exact widths. Entry displacement is robust; exact timing onset +/-2 frames. Stagger is content timing, not a requirement for arbitrary words."
    },
    {
      "id": "M05",
      "rule": "The beam advances through the space between cards; it is a leading trace that explains sequence. Cards remain visible after they arrive.",
      "values": {
        "beam_between_card_1_and_2_frames_estimate": [
          151,
          165
        ],
        "beam_between_card_2_and_3_frames_estimate": [
          178,
          190
        ],
        "scene_complete_frame_approx": 199,
        "card_lifetime": "until scene end; no alternating hide/show"
      },
      "evidence": "clip01@150-210; evidence/tenfps-02.jpg. Second abstract sequence clip01@372-409 confirms the advancing beam and retained earlier card.",
      "confidence": "medium",
      "limits": "Beam endpoints partly occluded by cards. Bounds are visually estimated rather than a fitted luminance threshold. For adaptation anchor the trace to the phrase transition, then reveal the next card as it reaches the destination."
    },
    {
      "id": "M06",
      "rule": "Persistent geometry has a slow small float; the room remains stable. The ribbon is not continuously spinning around the speaker.",
      "values": {
        "phone_to_render_scale": 2,
        "tracked_card_features": 77,
        "from_frame": 30,
        "to_frame": 105,
        "card_median_displacement_phone_px": [
          0.0059,
          -5.3126
        ],
        "card_displacement_render_px": [
          0.0119,
          -10.6251
        ],
        "elapsed_seconds": 2.5,
        "room_median_displacement_phone_px": [
          -0.1106,
          -0.4748
        ],
        "ribbon_median_dy_phone_px": -5.1332
      },
      "evidence": "flow.json; optical flow of 77 good card features and 21 room features, f30→f45,60,75,90,105. Script: scripts/measure.py.",
      "confidence": "high",
      "limits": "Card tracking is precise in this interval; ribbon samples have lower reliability because highlights vary and the layer curves. Does not establish a full oscillation period. A suggested periodic float is an approximation, not a measured sine period."
    },
    {
      "id": "M07",
      "rule": "Foreground text enters as a compact phrase with opacity/rise/blur; the italic emphasis is part of the phrase, not huge bouncing karaoke text. Search fields type characters progressively.",
      "values": {
        "opening_phrase_reveal_frames_estimate": [
          20,
          27
        ],
        "opening_reveal_seconds_estimate": 0.2333,
        "first_search_typing_seconds_estimate": [
          5.1,
          5.8
        ],
        "second_search_typing_seconds_estimate": [
          12.7,
          13.5
        ]
      },
      "evidence": "clip01@20-27, @153-174, @381-405; evidence/tenfps-01.jpg, tenfps-02.jpg, tenfps-03.jpg.",
      "confidence": "medium",
      "limits": "Two typing windows visually sampled at 10fps, so onset/finish +/-0.1s. Character rate should follow the phrase duration; do not use these as universal syllable timing. No font metrics or exact easing measured by this motion pass."
    },
    {
      "id": "M08",
      "rule": "The CTA is a match in concept: a small foreground pill appears on the presenter, then the same idea becomes the centered abstract object with concentric thin rings and a cursor. A single click pulse distorts the composition.",
      "values": {
        "small_foreground_pill_visible_frame": 273,
        "abstract_cut_frame": 278,
        "click_pulse_start_frame": 290,
        "strong_pulse_frames": [
          290,
          292
        ],
        "recovery_frames": [
          293,
          299
        ],
        "delay_cut_to_pulse_seconds": 0.4,
        "button_width_phone_px": {
          "278": 326,
          "289": 330,
          "299": 334
        },
        "cut_to_pulse_width_growth_percent": 1.23
      },
      "evidence": "clip01@273-299; evidence/cta-pulse.jpg; button-bounds.json.",
      "confidence": "medium",
      "limits": "Cursor merges with the button threshold and pollutes height, but horizontal bounds are stable. Pulse ends at the ad segment boundary f300, so full recovery is not observed. Rings are already present on the abstract cut: do not claim they all originate from the click."
    },
    {
      "id": "M09",
      "rule": "Most visual activity is clause-level buildup or a scene transition, separated by readable holds. Motion variety comes from distinct object roles, not incessant camera shaking.",
      "values": {
        "first_example_cut_frames": [
          0,
          128,
          216,
          278,
          300
        ],
        "first_example_scene_seconds": [
          4.2667,
          2.9333,
          2.0667,
          0.7333
        ],
        "second_example_cut_frames": [
          300,
          357,
          415,
          463,
          512,
          600
        ],
        "second_example_scene_seconds": [
          1.9,
          1.9333,
          1.6,
          1.6333,
          2.9333
        ]
      },
      "evidence": "clip01 full 600-frame crop. Scene changes verified against consecutive-frame strips and large frame-difference peaks.",
      "confidence": "high",
      "limits": "The first sample has four scenes in its visible ten seconds, despite broader listing language. The second has five plus a brief evidence overlay near 17.1-17.7s. The two examples do not justify universal scene count, cadence or ending type."
    }
  ],
  "constant_vs_variable": "Repeated: layered reveal, subtle drift, traced abstract connections, readable text holds, brief vertical-smear camera pulses. Variable: number of scenes, number of cards, scene duration, transition strength, type of CTA and content timing.",
  "open_questions": [
    "Exact blur kernel, chromatic fringe, camera transform and easing curves cannot be identified from this downscaled H.264 promo.",
    "Ribbon shader/highlight and glass refraction implementation are unknown.",
    "Motion for the Light Lime family has not been observed; only boards are public in this inventory.",
    "Neither example demonstrates a long-form edit or a different frame rate."
  ],
  "needs_human_check": [
    "Watch a new full-size render beside the reference at normal speed; verify the pulse is not too aggressive.",
    "Inspect glass edge quality at native 1080x1920 because reference phone pixels are downscaled.",
    "Audition any synthesized sound in context separately; no listening performed by this motion pass."
  ]
}
```
