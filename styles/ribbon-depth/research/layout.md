# Layout study

Independent analysis of the public inset samples. Original data and evidence stay in the ignored corpus.

```json
{
  "dimension": "layout",
  "summary": "Measured one 600-frame, 20-second public promotional video containing two Violet reel examples; inspected six static promotional boards. Ten chosen video frames were extracted, eight frames received detailed element measurements. Native reel viewport is only 540x960, not full 1080x1920. No paid package/source code was accessed. Main quality cue is depth composition with large full-bleed presenter, upper-left rear card, shoulder ribbon, and chest-height type, interrupted by abstract explanatory stages.",
  "rules": [
    {
      "id": "L01",
      "rule": "Normalize the reel viewport, excluding the surrounding promotional phone frame and editor UI.",
      "values": {
        "demoFrame": [
          1920,
          1080
        ],
        "reelViewportXYWH": [
          830,
          110,
          540,
          960
        ],
        "normalizedCanvas": [
          1080,
          1920
        ],
        "scale": 2
      },
      "evidence": "clip01 frames 75,174,195,267,287,345,405,459,510,573; native screenshots in evidence/.",
      "confidence": "high",
      "kind": "observed"
    },
    {
      "id": "L02",
      "rule": "The speaker layout is full-frame source footage with graphics in depth behind the head, not a separate presenter panel or top/bottom split.",
      "values": {
        "layoutFamilies": [
          "speaker-depth",
          "abstract-stage",
          "action-stage"
        ],
        "primaryCardXYWHRange": {
          "x": [
            56,
            78
          ],
          "y": [
            198,
            206
          ],
          "w": [
            578,
            600
          ],
          "h": [
            436,
            506
          ]
        }
      },
      "evidence": "Four settled speaker frames: clip01@75,267,345,573; upper-left card is partially occluded by the natural silhouette. Pixel segmentation and visual inspection.",
      "confidence": "high",
      "kind": "observed"
    },
    {
      "id": "L03",
      "rule": "The speaker primary card has a slight clockwise tilt. Abstract cards alternate tilt instead of sharing a rigid stack orientation.",
      "values": {
        "speakerTiltDegrees": [
          1.444,
          2.013
        ],
        "abstractPairTiltDegrees": [
          3.374,
          -3.903
        ],
        "topThirdCardTiltDegrees": -2.34,
        "edgeFitRMSESourcePx": [
          0.279,
          0.336
        ]
      },
      "evidence": "edge-fits.json; upper card edges fitted after thresholding at native 540x960 viewport. Top-third-card fit is less precise, RMSE1.524 source pixels.",
      "confidence": "medium",
      "kind": "measured"
    },
    {
      "id": "L04",
      "rule": "The small caption pill stays horizontally centered at about 62% height in both speaker and abstract layouts; width follows the phrase.",
      "values": {
        "centerX": 540,
        "topYRange": [
          1180,
          1190
        ],
        "heightRange": [
          78,
          82
        ],
        "widthRange": [
          256,
          560
        ]
      },
      "evidence": "clip01@75,174,267,345,573. Pixel bounds in pixel-measurements.json.",
      "confidence": "high",
      "kind": "measured"
    },
    {
      "id": "L05",
      "rule": "The main mixed-type statement is centered below the pill, in the chest region of the speaker. It is not a bottom-edge subtitle.",
      "values": {
        "typicalInkY": [
          1296,
          1412
        ],
        "twoLineHeroInkY": [
          1378,
          1496
        ],
        "inkWidthRange": [
          610,
          696
        ]
      },
      "evidence": "clip01@75,174,267,345,573. Bounds measure white ink, not CSS boxes/font sizes; f174 mask also touches an underline.",
      "confidence": "high",
      "kind": "measured"
    },
    {
      "id": "L06",
      "rule": "The abstract stage puts 2 or 3 tilted cards above a caption/search cluster, with a continuous curving light path weaving among them.",
      "values": {
        "twoCardBounds": [
          [
            292,
            414,
            498,
            276
          ],
          [
            316,
            826,
            446,
            250
          ]
        ],
        "threeCardBounds": [
          [
            278,
            182,
            530,
            286
          ],
          [
            300,
            578,
            480,
            260
          ],
          [
            316,
            904,
            446,
            252
          ]
        ]
      },
      "evidence": "clip01@405 two cards; clip01@195 three cards. Threshold/opening excludes thin beam attachment; uncertainty roughly 4–8 normalized pixels plus actual motion variation.",
      "confidence": "medium",
      "kind": "measured"
    },
    {
      "id": "L07",
      "rule": "The abstract search field is a centered wide pill immediately under the main statement.",
      "values": {
        "boundsRange": {
          "x": [
            180,
            190
          ],
          "y": [
            1400,
            1430
          ],
          "w": [
            700,
            720
          ],
          "h": [
            104,
            104
          ]
        },
        "centerX": 540
      },
      "evidence": "clip01@174,405. Width differs between versions/content, not enough evidence to infer exact sizing formula.",
      "confidence": "high",
      "kind": "measured"
    },
    {
      "id": "L08",
      "rule": "The action-stage button is an isolated focal object near the middle, surrounded by large concentric elliptical paths and sparse spheres.",
      "values": {
        "buttonXYWH": [
          210,
          832,
          660,
          196
        ],
        "buttonCenter": [
          540,
          930
        ],
        "supportingTextApproxY": 1200
      },
      "evidence": "clip01@287. Cursor extends below button; mask was limited at y515 source viewport to isolate the button surface.",
      "confidence": "medium",
      "kind": "measured"
    },
    {
      "id": "L09",
      "rule": "The ribbon fills the width but stays behind the face/body in the Violet speaker scene. Its bright front-facing sweep sits around the shoulders and side gaps.",
      "values": {
        "ribbonOccupiedApproxY": [
          100,
          1190
        ],
        "brightLowerSweepApproxY": [
          750,
          1180
        ],
        "primaryLayerOrder": [
          "room",
          "room grade",
          "ribbon and glow",
          "rear card and rear icons",
          "speaker matte",
          "caption and front foreground accents"
        ]
      },
      "evidence": "clip01@75,267,345,573. These ranges are visually estimated from translucent regions; no exact path reconstruction claimed. Some side tiles may be foreground independent of primary rear cards.",
      "confidence": "medium",
      "kind": "estimated"
    },
    {
      "id": "L10",
      "rule": "Text clusters have generous side margins and leave the bottom of the reel mostly for footage/atmosphere. Decorative light and spheres may run to the edge.",
      "values": {
        "observedHeroTextEnvelopeX": [
          194,
          898
        ],
        "observedEssentialCopyMaxY": 1630,
        "observedPrimaryCardMinY": 198
      },
      "evidence": "clip01@75,174,267,345,573. This is occupied reference geometry, not a claim about current platform UI safe zones.",
      "confidence": "medium",
      "kind": "observed"
    },
    {
      "id": "L11",
      "rule": "Light Lime is a separate layout family: small full-body presenter on a bright set, photographic triptych or filmstrip behind, ribbon partly in front of lap, and an alternate circle portrait/search layout.",
      "values": {
        "board06Viewport0": [
          104,
          410,
          340,
          604
        ],
        "board06Viewport3": [
          1304,
          410,
          340,
          604
        ],
        "board06Viewport4": [
          1704,
          410,
          340,
          604
        ],
        "normalizedApprox": {
          "fullBodyFigureXYWH": [
            330,
            900,
            410,
            650
          ],
          "photoTriptychXYWH": [
            130,
            680,
            810,
            310
          ],
          "namePlateXYWH": [
            320,
            1150,
            450,
            125
          ],
          "filmstripXYWH": [
            130,
            770,
            805,
            320
          ],
          "circlePortraitXYWH": [
            270,
            400,
            550,
            570
          ],
          "circleSearchXYWH": [
            160,
            1095,
            760,
            120
          ],
          "profileRowsXYWH": [
            190,
            1270,
            700,
            260
          ]
        }
      },
      "evidence": "board06 static cells0,3,4; isolated evidence/light-0.png through light-2.png. Screen bounds extracted by brightness connected components; internal boxes estimated visually on normalized crop. No Light Lime video was available.",
      "confidence": "medium for layout distinctions, low for internal geometry/timing",
      "kind": "estimated"
    }
  ],
  "constant_vs_variable": "Across the two Violet examples, rear card position and chest caption position are stable; card height, phrase width, abstract card count, and detailed tilt vary. Do not infer universality from two examples. Light Lime changes composition, presenter scale and occlusion, rather than merely hue.",
  "open_questions": [
    "Native unframed 1080x1920 source would improve measurement precision.",
    "Primary card lower corner and full dimensions can be occluded by hair; measured bounding box is the visible cream component.",
    "No Light Lime video, hence no layout transition timing for that theme.",
    "Phone corner radius and external AFTER label belong to the promotional wrapper; do not ship them into output."
  ],
  "needs_human_check": [
    "Confirm that the local renderer reproduces full-frame presenter depth rather than a panel adaptation.",
    "Compare reference and local sample with a different room and speaker.",
    "Visually check that graphics never cross eyes/mouth and that matte gaps do not reveal a second copy of the head."
  ]
}
```
