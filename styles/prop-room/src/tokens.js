// Prop Room: every measured constant of the style lives here.
// Geometry is pixels on the 1080x1920 frame. Times are seconds. The reference reels run at 29.97 fps, so
// F(n) = n frames at 29.97 fps keeps the number in this file equal to the number in the study.
// Each block names the research note and rule ids it comes from (research/*.md, ids in brackets; "V" marks a
// value settled by the verification pass, research/verification.md). Change the note first, then the number.

export const W = 1080, H = 1920, CX = 540;
export const FPS = 29.97;
export const F = (n) => n / FPS;

// ------------------------------------------------------------------ fonts (research/type.md)
// Captions: Inter (SIL OFL 1.1, variable, opsz 14-32, wght 100-900) at wght 730, opsz 26, 76 px, -1 px tracking,
// pure white [T01-T04; V]. The closing keyword: an unidentified bold serif; PT Serif Bold (SIL OFL 1.1) is the closest
// openly licensed match (owner's decision 2026-11-16) [T19, T20; V]. Text inside graphics uses Inter too [T25, T26].
export const fonts = {
  sans: '"PR Inter", "Inter", system-ui, sans-serif',
  serif: '"PR Serif", "PT Serif", serif',
  // code and terminal text: the reference uses a system monospace; JetBrains Mono (SIL OFL 1.1) is shipped instead [X65, by eye]
  mono: '"PR Mono", "JetBrains Mono", ui-monospace, monospace',
  files: [
    { family: 'PR Inter', src: 'assets/fonts/Inter.ttf', weight: '100 900', style: 'normal' },
    { family: 'PR Serif', src: 'assets/fonts/PTSerif-Bold.ttf', weight: '700', style: 'normal', local: ['PT Serif Bold', 'PTSerif-Bold'] },
    { family: 'PR Mono', src: 'assets/fonts/JetBrainsMono.ttf', weight: '100 800', style: 'normal' },
  ],
  // Read from the font files (OS/2, hhea): Inter 4.001 cap height 0.7275 em, x-height 0.5459, ascender 0.96875,
  // descender 0.2412, so a line-height-1 box has its baseline 0.8637 em under its top. PT Serif Bold 1.000W (the
  // shipped file): cap 0.700, ascender 1.039, descender 0.286, baseline 0.8765 em under the top of that box.
  M: { cap: 0.7275, xh: 0.5459, base: 0.8637 },
  serifM: { cap: 0.700, base: 0.8765 },
  caption: { weight: 730, opsz: 26, size: 76, trackingPx: -1 },
  weight: { label: 500, body: 600, heavy: 730, display: 800 },
};

// ------------------------------------------------------------------ colour (research/colour.md)
// There is no house accent: the reference's orange is a third-party mascot's colour [C18 corrected by V; G22].
// Colour comes from the subject of each scene. Ink and cards are constant [C17].
export const colour = {
  ink: '#212126',               // text on cards and pale plates [C17]
  inkSoft: '#6B6B72',           // secondary labels (by eye, between ink and the plate)
  card: '#FFFFFF',              // cards and windows [C17, G15]
  line: '#E6E3E6',              // hairlines inside cards (by eye)
  white: '#FFFFFF',
  // plates: chosen per scene, not per layout [C04, C13, G27; V]
  plate: {
    pale: { top: '#FBF8F5', bottom: '#EFE8E3' },            // vertical gradient, top 12 levels lighter [C05, C06; V pale plate]
    white: '#FFFFFF',                                         // 15 % of graphic runtime [C04]
    dark: { neutral: '#0C0C0D', navy: '#101B37', warm: '#28110E', teal: '#11312D' },   // 17 % [C04, C09]
    darkLift: { neutral: 7, navy: 12.6, warm: 27, teal: 22 },  // centre lighter than the corners, levels [C09]
    // pastel tints at the edges of a pale plate: one or two, at opposite corners, static [C07; V]
    tints: ['#FFD9B1', '#E9D8FA', '#CFF1E0', '#CBEBFE', '#FCCEE3'],   // peach, lilac, mint, baby blue, pink [C07, by eye hues]
    tintChroma: 40,              // strongest edge tint, levels of chroma (median) [C07; V]
    tintRadius: [300, 700],      // blob radius px (by eye) [C07]
    tintCorners: [['br', 'tl'], ['tl', 'br'], ['ml', 'tr'], ['tr', 'bl'], ['br', 'ml']],   // by frequency [C07; V]
  },
  // saturated fields last one sentence and take the brand's colour or a colour the sentence names [C11]
  fieldDefault: '#235AC6',
  // the caption plate: #3F3F3F at 0.823 blended in linear light; CSS blends in gamma space, so the build uses the
  // verifier's gamma-space fit (error -4.6..+3.9 levels by background) [T16, C14 corrected by V]
  captionPlate: 'rgba(70,69,70,0.70)',
  // shadows [C19-C22, G16; V]
  shadow: {
    card: '0 31px 41px -27px rgba(0,0,0,0.43)',             // cards and windows; nothing above [C20, G16; V]
    // floating props: warm, pushed down. 0.53 is the measured darkening of the plate's luma; as a CSS alpha over the
    // pale plate it is 0.71 (props builder, clip03@330) [C19, C22]. prop.js draws its own SVG shadow from these numbers.
    prop: '0 68px 102px -36px rgba(94,52,48,0.71)',
    propContact: 'rgba(94,52,48,0.45)',                      // contact darkening under a prop [C19]
  },
  // the light on props: one key from above, bodies 22-28 levels lighter at the top [C23]
  light: { top: 'rgba(255,255,255,0.08)', bottom: 'rgba(0,0,0,0.08)' },
  chrome: { base: '#D6DAE0', dark: '#8F959B', hi: '#F7F8FA' },    // silver parts [C24]
  traffic: ['#FF5F57', '#FEBC2E', '#28C840'],                      // window dots (platform convention) [G17, X74]
};

// ------------------------------------------------------------------ layout (research/layout.md)
// Three full-frame layouts, every change a hard cut [L01, L02, S01, S07; V layout changes]:
//   split    a full-bleed panel y 0-960 over the speaker, hard seam, nothing crosses it [L05, L07, L09-L11, G26]
//   full     the graphic fills the frame, no speaker [L12]
//   speaker  the speaker full height (the same crop mid-video and at the close) [L13, P09, P12, S13]
export const layout = {
  seam: 960,                                       // 959.5 measured, 956.6 in the oldest three clips [L05, L06; V]
  panel: { x: 0, y: 0, w: 1080, h: 960 },
  box: { x: 0, y: 960, w: 1080, h: 960 },          // the speaker's box in the split, radius 0 [P02, P03]
  // where graphics sit: centred on one axis, side margins 64-72 px [L20-L22]
  stage: {
    split: { top: 0, bottom: 908, cy: 558, margin: 68 },
    full: { top: 0, bottom: 1209, cy: 774, margin: 68 },
  },
  caption: {
    baseline: { split: 975, low: 1276 },           // [L14-L16, T06 corrected by V]
    plateMaxW: 748,                                // [L17, L19]
  },
  keyword: { baseline: 1448.5, cx: 540, maxW: 703 },   // [L18, T21; V]
};

// ------------------------------------------------------------------ type (research/type.md)
export const type = {
  // the plate hugs the white ink box [T14, T15; V]
  plate: { padL: 15.7, padR: 13.3, padT: 15.8, padB: 14.0, radius: 19 },
  // a hard black glyph shadow: offset 2.75/2.5 px, spread 2 px, sigma 1.5 px [T17, C15; V]
  glyphShadow: { dx: 2.75, dy: 2.5, spread: 2, sigma: 1.5 },
  // groups: 1-3 words (30/54/15 %), median 9 characters, soft cap 14, always ends after . , ? ! [T07-T09; V]
  group: { maxWords: 3, softChars: 14 },   // a group whose plate would pass layout.caption.plateMaxW is split,
  // keyword: cap height clamp(158 - 6 * letters, 109, 140); curly opening quote, straight closing quote;
  // shadow 13/13 px, spread 5, sigma 4 [T19, T21, T23 corrected by V]
  keyword: { capA: 158, capB: 6, capMin: 109, capMax: 140, open: '“', close: '"',
    shadow: { dx: 13, dy: 13, spread: 5, sigma: 4, alpha: 0.97 } },
};

// ------------------------------------------------------------------ presenter (research/presenter.md)
export const presenter = {
  // split: eye midpoint at (529, 1275), interocular 136.5 px, face box 344 px, head top 48 px under the seam
  // (26-68) [P05-P08; V]
  split: { eyeX: 529, eyeY: 1275, eyeDist: 136.5, faceBoxW: 344, eyeToChin: 260, headTop: [26, 68], headTopAim: 48 },
  // full height: the same footage 1.917x (1.887-1.930); eye line 689, face centre 542 [P09-P11; V]
  solo: { zoom: 1.917, eyeX: 542, eyeY: 689, eyeDist: 259.2, faceBoxW: 650 },
};

// ------------------------------------------------------------------ motion (research/motion.md)
export const curves = {
  out: [0.16, 1, 0.3, 1],          // every entrance and settle: easeOutExpo [M06, M16, X60; V]
  inOut: [0.65, 0, 0.35, 1],       // counters, bars and fills [X08, X10, M23]
  move: [0.75, 0, 0.25, 1],        // the pointer travels ease-in-out [X67]
};
export const motion = {
  // a scene starts on its first word's onset: cuts land on the onset, median 0 frames [M02, S08, G13]
  sceneLead: 0,
  // a picture arrives on its cut: content scales from 0.85 and is at 0.88 on the cut frame [M05, M06; V]
  scene: { from: 0.85, dur: F(15), lead: F(1) },
  // after it settles a held picture pushes in at a constant 0.6 % per second on 2 of 3 holds [M19 corrected by V]
  push: { ratePerS: 0.006, share: 2 / 3, after: F(15) },
  // props entering during a hold: pop, slide 23-128 px (56 typical, mostly from below), grow from 0.82,
  // land from 1.24; 12 frames on the entrance curve; siblings about 4-5 frames apart [M10-M14, M17, X59-X61; V]
  prop: { dur: F(12), slide: 56, growFrom: 0.82, landFrom: 1.24, stagger: F(4) },
  // events inside a unit: interfaces about 5 frames apart, pictures about 12 [X55, X05]
  eventGap: { ui: F(5), picture: F(12) },
  count: { dur: F(27) },           // counters and fills [X08, X10]
  ring: { to: 1.5, dur: F(9) },    // a ring pulse marks a landing or a name [X17, X72]
  badge: { from: 1.25, dur: F(6) },   // stamps and badges land from larger [X18]
  wipe: { dur: F(10) },            // before/after wipe with a visible front [X70]
  typing: { charsPerFrame: 1.6 },  // prompts [X62]
  pointer: { dur: F(11), click: F(3) },   // travel, then the control changes 3 frames after arrival [X67, X68]
  spin: { degPerFrame: 14 },       // reels and wheels [M21 corrected by V]
};

// ------------------------------------------------------------------ structure (research/structure.md)
export const structure = {
  openSplit: { median: F(53), min: F(38), max: F(80) },   // [S02, S03, L04]
  closeRun: { median: F(92), min: F(66), max: F(138) },   // [S14, H16, P12]
  changeEvery: F(62),                                     // [S06, G03]
};
