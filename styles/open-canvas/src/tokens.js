// Open Canvas: every measured constant of the style lives here.
// Geometry is pixels on the 1080x1920 frame. Times are seconds; the reference runs at 30 fps, so F(n) = n frames
// at 30 fps keeps the number in this file equal to the number in the study.
// Each block names the research note and rule ids it comes from (research/*.md, ids in brackets). The study is one
// clip (clip01, 866 frames, read at every frame); "owner" marks a value the owner chose, "by eye" a value that was
// fitted to the owner's footage and not measured. Change the note first, then the number.

export const W = 1080, H = 1920, CX = 540;
export const F = (n) => n / 30;

// ------------------------------------------------------------------ fonts (research/type.md)
// The reference faces were not identified [T07]. Shipped: Outfit (SIL OFL 1.1) at wght 800 for captions and
// titles, Caveat Brush (SIL OFL 1.1) for the script word, JetBrains Mono (SIL OFL 1.1) for ground and object labels.
export const fonts = {
  sans: '"OC Outfit", "Outfit", system-ui, sans-serif',
  script: '"OC Brush", "Caveat Brush", cursive',
  mono: '"OC Mono", "JetBrains Mono", ui-monospace, monospace',
  files: [
    { family: 'OC Outfit', src: 'assets/fonts/Outfit.ttf', weight: '100 900' },
    { family: 'OC Brush', src: 'assets/fonts/CaveatBrush-Regular.ttf', weight: '400' },
    { family: 'OC Mono', src: 'assets/fonts/JetBrainsMono.ttf', weight: '100 800' },
  ],
};

// ------------------------------------------------------------------ colour (research/colour.md)
// The reference ground is a saturated drafting sheet with a red/blue pointer [C01]. The pack does not copy it:
// "mono" (black sheet, white lines, light-blue selection) is the owner's look, chosen 2026-11-17 [C02, owner].
// top/mid/low: the ground's radial gradient; dark: melts and shadows; accent: highlight boxes and the keyword box;
// accentInk: text on the accent; sel: selection frames and handles.
export const palettes = {
  mono: { top: '#161616', mid: '#070707', low: '#000000', dark: '#000000', accent: '#7CCBFF', accentInk: '#06131F', sel: '#7CCBFF' },
  cobalt: { top: '#3E6BFF', mid: '#1E44DE', low: '#0C2290', dark: '#050A24', accent: '#FF6A2B', accentInk: '#FFFFFF', sel: '#FFFFFF' },
  ember: { top: '#D2502A', mid: '#B83A1E', low: '#7E2012', dark: '#140604', accent: '#3FA7FF', accentInk: '#FFFFFF', sel: '#FFFFFF' },
  moss: { top: '#2F9E6B', mid: '#1C7A50', low: '#0C4A30', dark: '#03140C', accent: '#FFD23F', accentInk: '#141414', sel: '#FFFFFF' },
  ink: { top: '#3A3D46', mid: '#22242B', low: '#101116', dark: '#050506', accent: '#C6FF3D', accentInk: '#141414', sel: '#FFFFFF' },
};
export const colour = {
  white: '#FFFFFF',
  handleEdge: '#111111',                 // the dark rim of a handle [G03]
  windowFill: '#0B0B0D',                 // behind a capture that does not fill its window (by eye)
  textShadow: '0 5px 22px rgba(0,0,0,.6), 0 2px 5px rgba(0,0,0,.55)',   // caption shadow (by eye) [T06]
};

// ------------------------------------------------------------------ ground (research/layout.md L08, motion.md M11)
export const ground = {
  cell: 27, major: 5,                    // grid pitch px and every fifth line heavier (by eye) [L08]
  minor: { w: 1, o: 0.13 }, heavy: { w: 1.5, o: 0.32 },   // owner asked for visible white lines on black, 2026-11-17
  period: 1350,                          // the pattern repeats every 50 cells
  driftPerS: 15,                         // scrolls up 0.5 px per frame, forever [M11]
};

// ------------------------------------------------------------------ layout (research/layout.md)
export const layout = {
  // desk: window x 87-992, y 250-985; with the hook title x 115-965, y 517-975 [L02]
  deskWindow: { x: 87, y: 250, w: 906, h: 735 },
  deskWindowTitled: { x: 115, y: 517, w: 850, h: 458 },
  sourceBox: { x: 100, y: 1334, w: 892, h: 640 },          // the footage rectangle, runs off the bottom [L02]
  sourceBoxStart: { w: 214, top: 1679 },                    // the small box the draw-on starts from (214 x 208) [M01]
  fullWindow: { x: 85, y: 246, w: 910, h: 1042 },           // [L03]
  hero: { x: 50, y: 170, w: 980, h: 1750, radius: 60, ring: 5, melt: [56, 74] },     // melt: % of the frame height [L04]
  behind: { x: 40, y: 70, w: 1000, h: 1500, radius: 60, ring: 5, melt: [36, 58] },   // [L05]
  caption: { high: 1031, low: 1405 },                       // caption centre: desk and behind / every other layout [L09]
  title: { line1Y: 240, line2Y: 346 },                      // [H02]
  cta: { y: 1345 },                                         // top of the script "comment" (by eye on the owner's framing) [H05]
  graphicOrigin: [540, 653],                                // an object settles about a point 34 % down [L06]
};

// ------------------------------------------------------------------ presenter (research/presenter.md)
export const presenter = {
  desk: { headTopY: 1110, eyeX: 540, faceW: 400 },          // head top [P01]; face width fitted to the owner's footage (by eye)
  face: { eyeX: 540, eyeY: 800, punch: 1.32 },              // the bare-face ask, punched in about 1.3x [P03]
};

// ------------------------------------------------------------------ type (research/type.md)
export const type = {
  caption: { size: 92, weight: 800, tracking: -1.5, gap: 22, scriptSize: 112, scriptTilt: -4 },   // [T01, T04]
  group: { softChars: 17, maxWords: 3, tinyChars: 15, tinyWords: 4, maxGap: 0.28, hold: F(18) },   // [T02]
  word: { from: 0.35, blur: 7 },                            // a word arrives blurred at 35 % and sharpens [T03, M08]
  title: { size1: 86, size2: 80, tracking: -2 },            // [H02]
  cta: { script: 112, word: 104 },                          // [H05]
};

// ------------------------------------------------------------------ motion (research/motion.md)
// Nothing overshoots, bounces or rotates; every move starts fast and decays [M12].
export const curves = {
  settle: [0.16, 1, 0.3, 1],     // a window or object landing: each frame covers about 0.8 of the last [M03, M04]
  drag: [0.45, 0, 0.1, 1],       // the cursor dragging a corner: peak speed at frames 5-6, long tail [M01]
  move: [0.6, 0, 0.1, 1],        // a whip scroll inside a window [M05]
  out: [0.25, 1, 0.5, 1],        // boxes, dots and words [M06-M08]
};
export const motion = {
  sceneLead: F(2),                                          // a cut lands within 2 frames before its first word [S04]
  boxDraw: { hold: F(3), dur: F(15) },                      // footage box draw-on [M01]
  windowGrow: { hold: F(7), dur: F(9), from: 0.7 },         // a window dragged to full size, anchored bottom-left [M02]
  fullSettle: { dur: F(15), from: 1.14 },                   // [M03]
  heroSettle: { dur: F(12), from: 1.05, rise: 46 },         // [M04]
  objectSettle: { dur: F(14), from: 1.12 },                 // [M04]
  whip: F(12), whipBlurAt: 14, whipBlurK: 0.35, whipBlurMax: 26,   // blur in px per px/frame of travel (by eye) [M05]
  box: F(5),                                                // a highlight box grows left to right [M06]
  tap: { travel: F(8), press: F(5), lead: F(2), linger: F(22), from: [90, 150], shrink: 0.22 },   // [M07]
  word: F(3),                                               // [M08]
  title: { first: F(3), step: F(5), word: F(3), open: [F(9), F(6)], text: [F(13), F(5)] },   // [M09]
  cta: { box: F(8) },                                       // [M10]
  cursorLinger: 2,                                          // seconds the cursor stays at the corner it dragged (by eye)
};

// ------------------------------------------------------------------ parts (research/graphics.md)
export const parts = {
  frame: { stroke: 4, dot: 26, pill: [54, 18], rim: 3, minForPills: 260, shadow: '0 14px 40px rgba(0,0,0,.35)' },   // [G02, G03]
  highlight: { stroke: 4, tint: 0.15, handle: 14 },         // [G05]
  tapDot: { r: 30, fill: 'rgba(255,255,255,0.38)', stroke: 4 },   // [G06]
  cursor: { w: 44, h: 58 },                                 // [G04]
};
