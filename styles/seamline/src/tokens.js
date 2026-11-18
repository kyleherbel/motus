// Seamline: every measured constant of the style lives here.
// Geometry is pixels on the 1080x1920 frame. Times are seconds. The reference runs at 23.976 fps, so F(n) = n
// reference frames keeps the number in this file equal to the number in the study.
// Each block names the research note and the rule ids it comes from (research/*.md, ids in brackets). "verified"
// means the number was re-measured from scratch in the verification pass (research/verification.md); "by eye"
// marks a value that was judged, not measured. Change the note first, then the number.

export const W = 1080, H = 1920, CX = 540;
export const FPS = 24000 / 1001;
export const F = (n) => n / FPS;

// ------------------------------------------------------------------ fonts (research/type.md)
// The reference faces are not identified [T01, T13]. Shipped, all SIL OFL 1.1, unmodified:
//   Monocraft SemiBold   the running caption: same 5x7 grid and 6-unit advance as the reference pixel face [T01]
//   Archivo wdth 125 wght 900   the heavy extended headline and the big word [T13, T20]
//   Instrument Serif Italic      the small connector word inside a headline and the serif big word [T16, T20]
export const fonts = {
  pixel: '"SL Pixel", "Monocraft", ui-monospace, monospace',
  heavy: '"SL Heavy", "Archivo", system-ui, sans-serif',
  serif: '"SL Serif", "Instrument Serif", Georgia, serif',
  files: [
    { family: 'SL Pixel', src: 'assets/fonts/Monocraft-SemiBold.ttf', weight: '400' },
    { family: 'SL Heavy', src: 'assets/fonts/Archivo.ttf', weight: '100 900', stretch: '62% 125%' },
    { family: 'SL Serif', src: 'assets/fonts/InstrumentSerif-Italic.ttf', weight: '400', style: 'italic' },
  ],
  heavyAxes: { wdth: 125, wght: 900 },   // [T13]
  heavyCapPerEm: 0.686,                  // Archivo's cap height, from the font file
  serifCapPerEm: 0.72,                   // Instrument Serif's cap height, from the font file
};

// ------------------------------------------------------------------ colour (research/colour.md)
export const colour = {
  black: '#000000',                      // letterbox and empty panels are pure black [C11, C12]
  white: '#FFFFFF',                      // caption and headline fill [C02, C09]
  lime: '#E5FC17', yellow: '#F2D117',    // the coloured big word [C05, T20]
  captionShadow: '0px 3px 1px rgba(0,0,0,0.95)',   // hard drop shadow, straight down 3 px, sigma about 1 [C02, T05]
  plate: 'rgba(0,0,0,0.71)',             // the caption plate: black at 0.70-0.71 on the clips that set the pattern; later clips run 0.86 [T06, C03, verified]
  bigWordShadow: 'none',                 // titles and big words carry no measurable shadow [C09, C10]
};
// No colour grade on any layer: the speaker and the inserted footage are shown as recorded (owner, 2026-11-18).
// The reference grades its speaker low key and warm [C15-C19]; the measurement stays in research/colour.md.

// ------------------------------------------------------------------ layout (research/layout.md)
export const layout = {
  seam: 960,                             // first presenter row; the top visual covers rows 0..959 [L03, P03, verified]
  caption: { cx: 540, cy: 960, baseline: 974, capTop: 945,     // centred on the seam [L15, T02]
    // over the full-frame face the reference keeps the seam line too [L15], which puts the words on the speaker's
    // mouth; the owner moved them down to the chest (2026-11-18)
    faceCy: 1440 },
  captionMinSide: 199,                   // no caption ink closer to a side [L17]
  headline: { bottom: 880, width: 814 },                      // block bottom 880, 79 px above the seam; lines 505-932 px wide, median 814 [H15, T15, verified]
  brand: { small: { w: 460, h: 100 }, large: { w: 660, h: 124 } },  // marks centred on the seam, 360-660 px wide, 49-124 px tall [H19, verified]
};

// ------------------------------------------------------------------ presenter (research/presenter.md)
export const presenter = {
  // the owner's framing (2026-11-18): tighter than the reference's (face 172 px, eyes 1213, x 519 [P03-P06]), so less of
  // the room shows; the enlargement of the wide view stays inside the softness limit [P25]
  split: { faceW: 330, eyeY: 1290, eyeX: 540, maxScale: 1.5 },
  face: { faceW: 343, eyeY: 527, eyeX: 487, maxScale: 1.5 },      // the same take enlarged about 1.95x [P07-P10]
  push: { to: 1.066, ease: [0.42, 0, 0.58, 1], origin: [501, 960] },   // 75 % of full-face shots: 1.00 to 1.066 over the whole shot, in-out; the end scale is constant, not the rate [P11, M16, verified]
};

// ------------------------------------------------------------------ type (research/type.md)
export const type = {
  caption: { size: 37.5, tracking: 0 },                       // cap 29.6, advance 25.0 [T01-T03]
  plate: { padX: 28, padY: 28, radius: 13 },                   // 28 px all round, 84-86 px tall, radius about 13 [T06, verified]
  group: { softChars: 16, maxWords: 4, hold: F(10), maxHold: F(18) },   // 2 words, 9 characters median, 98 % <= 16; hold 10 frames (p90 18) [T08, T09, verified]
  // cap 48-107 px, so a short line stops at 107 [T14]; the lead line, kicker and connector
  // against the main line's cap, read on clip13@36, clip16@48, clip17@36, clip26@48 (by eye) [T16, T17]
  headline: { gapRatio: 0.24, maxCap: 107, leadRatio: 0.44, leadCap: [36, 48], kickerRatio: 0.42, connectorRatio: 0.6, tracking: 0.05, wordSpacing: 0.15 },   // gap 0.24 x the smaller cap (6-24 px); +0.05 em tracking, +0.15 em word spaces [verified]
  // over the chest, not on the seam: centre y 1118, cap 67 (40-136), 496 px wide (242-793), on for 18 frames (6-43) [T20, verified]
  bigWord: { width: 500, cy: 1118, minCap: 44, maxCap: 110, serifCap: 93, gap: 16, hold: F(18) },
};

// ------------------------------------------------------------------ motion (research/motion.md)
export const motion = {
  sceneLead: F(1),                       // layout changes land on the first word or one frame before [S14]
  // the line rests on frame 20; the curve fits every line to 1-2 px with 19.5 frames and about 2,000 px of travel [M06-M09, verified]
  titleIn: { bezier: [0.085, 0.963, 0.707, 0.977], dur: F(19.5), start: F(0.5), travel: 2000 },
  titleMax: 4.5,                         // the headline is gone 2.35-4.53 s in (median 3.21) [H13]
  titleOut: { bezier: [0.248, 0.016, 0.654, 0.124], dur: F(16.8) },   // continue in the entry direction; steeper than quadratic (power 2.6), ending on the layout cut [M12, verified]
  blurShutter: 0.85,                     // a box blur about 0.85x the per-frame movement (0.83 to 0.88) [M10, verified]
  // most stills hold still (69 % in full frame, 60 % in the top half); the rest push in one of two ways [G21, X24, verified]
  stillPush: { ease: 1.066, driftPerS: 0.015, driftMax: 1.06 },
  brand: { dur: F(8), lead: F(1) },      // the logo takes the caption's place for 7.5 frames median (3-13), a frame before the word [H19, H20, verified]
};

// ------------------------------------------------------------------ audio (research/audio.md)
export const audio = {
  bedGainDb: -12,                        // 10-13 LU under the voice, never ducked [A12-A14]
  bedFadeOut: 1.1,                       // [A16]
  swellDb: -2,                           // the swell file's loudest 50 ms is at -20 dBFS; this puts it about 6 dB under the voice (by ear: audition) [A22]
};
