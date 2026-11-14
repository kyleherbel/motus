// Ember Brief: every measured constant of the style lives here.
// Geometry is pixels on the 1080x1920 frame. Times are seconds. The reference reels all run at
// 30 fps, so F(n) = n frames at 30 fps keeps the number in this file equal to the number in the study.
// Each block names the research note and rule ids it comes from (research/*.md, ids in brackets);
// change the note first, then the number here.

export const W = 1080, H = 1920, CX = 540;
export const F = (n) => n / 30;

// ------------------------------------------------------------------ fonts (research/type.md)
// One geometric sans for every text role: Outfit (SIL OFL 1.1), a variable font, at three weights
// [T01, T02; verified]. Metrics are per em of the shipped file. They change with the weight: the cap height
// is 0.694 em at 400, 0.703 at 600 and 0.709 at 800 (x-height 0.475 / 0.483 / 0.489, ascender 0.714 / 0.723 /
// 0.729, descender 0.199 / 0.2025 / 0.2075), so a size is always worked out for its weight. hhea is 1.0 / -0.26,
// so a line-height-1 box has its baseline 0.87 em under its top at every weight.
export const fonts = {
  sans: '"EB Outfit", "Outfit", system-ui, sans-serif',
  files: [{ family: 'EB Outfit', src: 'assets/fonts/Outfit.ttf', weight: '100 900', style: 'normal' }],
  M: { base: 0.87, cap: 0.709 },                 // cap: the heavy weight's, for code that sets heavy text only
  /** Cap height per em at a weight (the font's own two-segment interpolation). */
  capAt: (w) => (w <= 500 ? 0.670 + 0.00006 * w : 0.685 + 0.00003 * w),
  // stem over cap height 0.18 (captions), 0.14 (light title lines, the call-to-action label),
  // 0.25 (heavy title lines, headings, figures, the keyword) [T02; verified]. Outfit: 0.136 at 400, 0.194 at 600, 0.252 at 800.
  weight: { caption: 600, light: 400, heavy: 800 },
};

// ------------------------------------------------------------------ colour (research/colour.md)
// One accent and one display colour in every reel, never re-coloured per topic [C02, C03, C25, G26].
// RELEASE PALETTE (research/colour.md, "Release palette" [C26]): the values are not the measured ones. The accent
// is a magenta in place of the measured orange #FF6B1B; every warm grey is replaced by a grey of the same BT.709
// luma with a slight cool cast (B - R = +4 levels). Roles, alphas, strengths and luma steps are as measured.
// The key `cream` is a role name kept for the code: its value is now a neutral, slightly cool chalk.
export const colour = {
  accent: '#FF3AB0',            // caption active word, highlights, toggles, outline boxes, send buttons [C02, C26]
  cream: '#EDEEF1',             // chalk: every display text: title, headings, figures, call to action, card text [C03, T22, C26]
  captionWhite: '#F7F8FB',      // captions only, 8 luma codes brighter than the chalk [C04, T11; verified; C26]
  muted: '#9D9EA1',             // idle text, off-state knob [C16, C26]
  field: '#121316',             // flat: no gradient, vignette or grain [C05, C26]
  dot: '#424346',               // the lattice dots: chalk at 0.22 over the field [C06, C26]
  pill: { fill: '#101114', alpha: 0.68 },   // the caption plate [C11, T16, L08; verified; C26]
  // dark house-style cards: a grey ramp one to three steps above the field, thin lighter stroke [C14, G14, C26]
  card: { fill: '#1E1F22', frame: '#191A1D', raised: '#26272A', stroke: '#28292C', off: '#16171A', black: '#090909' },   // stroke 2 px [G14; verified]
  toggle: { onTrack: '#FF3AB0', onKnob: '#EDEEF1', offTrack: '#444548', offKnob: '#9D9EA1' },   // [C16, G15, C26]
  paper: '#FFFFFF',             // a capture keeps its page's own paper; this is the fallback [C19, G05]
  // highlight bars: the accent multiplied over the paper, so the ink stays dark [C12, G08; verified]. Its strength is
  // one value per video between 0.32 and 0.55 in the reference; the build uses the median.
  highlight: { light: 0.40, dark: 0.41 },
  // cards cast one soft black shadow, shifted down: sigma 36 px = CSS blur 72 px, 24 px down [C15; verified]
  shadow: '0 24px 72px rgba(0,0,0,0.52)',
};

// ------------------------------------------------------------------ the field (research/colour.md, motion.md)
// A square lattice of round dots that exist only below a slow wave line. The lattice never moves;
// the line does, and dots are small just under it and grow back to full size 384 px down
// [C06-C09, M19, L23; verified]. One loop is 300 frames and starts at phase 0 on frame 0.
export const field = {
  pitch: 12,                    // nodes on multiples of 12 px from the frame origin [C06]
  r: 2.36,                      // full dot radius
  rim: 15.4,                    // depth of the band of full dots on the line [C08; verified]
  small: 0.96, growFrom: 15.4, growTo: 384,   // radius just under the rim, growing linearly to full [C08; verified]
  loop: F(300),                 // [C09, M19]
  // y(x, t) = y0 + sum(a * sin(k * x / 1080 + n * w + phase)), w = 2 pi t / loop [C07]
  wave: { y0: 537.6, terms: [[96, 3.006, 1, 0], [34.5, 21.99, 3, 0], [23.0, -35.01, 4, 1.123]] },
};

// ------------------------------------------------------------------ layout (research/layout.md)
// Two full-frame layouts and nothing else [L01, P01, S01]:
//   split  the field in the top half over the presenter panel in the bottom half
//   full   the field fills the frame; the presenter is off screen
export const layout = {
  seam: 960,                                  // [L03]
  fade: { from: 960, to: 1040 },              // the footage fades in over the field, linear alpha [L04, P03, C10; verified]
  panel: { x: 0, y: 960, w: 1080, h: 960 },   // full bleed: no radius, stroke or shadow [L03, P02]
  // one caption line centred on x 540 [L05, L06, T04, T05; verified]
  caption: {
    baseline: { split: 984, full: 1504 }, maxInk: 704,
    // the plate: the text box plus 26 px each side, 86.8 px above the baseline to 38.7 px below (125.5 px), radius 23,
    // no backdrop blur [L07, T16, C11; verified]
    pill: { padX: 26, above: 86.8, below: 38.7, radius: 23 },
  },
  column: { left: 40, right: 1040, w: 1000 }, // every full-width card [L10, G04]
  // where a graphic sits: centred in its slot; the slot ends 80 px above the caption plate's centre [L11, L12, L20]
  slot: {
    split: { top: 0, bottom: 880, cy: 440, headed: { top: 170, cy: 525 } },
    full: { top: 60, bottom: 1400, cy: 730, headed: { top: 170, cy: 785 } },
  },
  // the opening: an illustration over a stacked title [L15, H04-H09, T18-T21; verified]. The title is a fit-to-box:
  // every line sits in a box 1.2377 x its cap height (light) or 1.2120 x (heavy) with the caps centred, the boxes
  // stack with no space between them to 359.4 px, and the stack is centred on y 766.1.
  // Without a picture the block is centred in the field instead (cyAlone): not measured, the reference always has one.
  title: { illustration: { x: 0, y: 0, w: 1080, h: 580, fadeFrom: 500 }, stack: 359.4, cy: 766.1, cyAlone: 440, maxW: 905, lightMaxW: 720 },
  // the call to action [L16, H23, T24, T25; verified]
  // 'Comment' at 92 px on baseline 339, the keyword at 164 px on baseline 536, shrunk to fit 923 px
  cta: { labelBaseline: 339, labelSize: 92, keywordBaseline: 536, keywordSize: 164, keywordMaxW: 923 },
  heading: { baseline: 146, size: 96 },       // numbered section heading: cap 68 px, cap top 78, baseline 146 [L18, H19, T26; verified]
  safe: { card: 16, title: 86, keyword: 76 },         // closest anything comes to the sides [L25]
};

// ------------------------------------------------------------------ presenter (research/presenter.md)
// Plain footage in the bottom half, never cut out, never full height, one scale for the whole video
// [P01-P04, P11, P29]. Fit: scale so the eyes are 123.4 px apart, then move the eye midpoint to (540, 1245)
// [P06-P08, P26; verified].
export const presenter = {
  eyeDist: 123.4, faceBoxW: 316.5, eyeToChin: 244, eyeX: 540, eyeY: 1244,
  headTop: [1035, 1051],        // top of hair or cap: 1035 in the reference; it must stay under the plate's bottom at 1023 [P09, P28; verified]
  maxEnlarge: 3.0, softFrom: 2.0,   // the reference footage is soft: about a third of the graphics' detail [P21, P22]
};

// ------------------------------------------------------------------ type (research/type.md, hook.md)
export const type = {
  // captions: one size everywhere, 76 px (cap height 53.4 px); never wrapped, never shrunk [T03, T05; verified]
  caption: { size: 76, tracking: -0.013 },
  // the opening title: 4 upper-case lines, 2 light then 2 heavy [T18-T21, H08, H09; verified]. The heavy cap height is
  // `ratio` x the light one: hand-set per title in the reference (0.89 to 1.78); the build uses 4/3, and twice that
  // for a single heavy line.
  title: { ratio: 4 / 3, lightBox: 1.2377, heavyBox: 1.2120, trackingLight: -0.025, trackingHeavy: -0.036 },
  heading: { tracking: -0.030 },                         // 'N. Name', heavy, title case [T26, H19; verified]
  cta: { labelTracking: -0.020, keywordTracking: -0.036 },   // [T24, T25; verified]
  // heavy, cream, centred; proportional digits, tabular only for a long counter [T27, G17; verified]. The cap height is
  // the room it has, 168 px (216 px for 1 or 2 characters standing alone), or 1170 px / characters when that is smaller.
  figure: { room: 168, roomShort: 216, perChar: 1170, capRange: [100, 227], tracking: -0.040, tabularFrom: 7 },
  label: { cap: 51, tracking: 0.07 },                    // small upper-case labels over a graphic [T28; low]
  card: { size: 40, lead: 1.35 },                        // text inside dark cards (body x-height about 26 px on captures [G06])
};

// ------------------------------------------------------------------ motion (research/motion.md, hook.md)
// One primitive does nearly everything: an element arrives and leaves through a Gaussian blur with a fade
// and a short rise. A whole graphic never overshoots, rotates, bounces or slides sideways, and once settled it
// is still [M02-M06, M20, M25; verified]. The second study found the exceptions, all inside explanatory
// pictures: the call-to-action keyword's tilt, a refresh mark turning once per calendar flip, and overshoot in
// four bespoke places (19 events in 4 clips) [D12, D27]. Blur values are Gaussian sigma in px (CSS blur(Npx)
// uses the same sigma).
export const curves = {
  move: [0.65, 0, 0.35, 1],     // small state changes inside a held graphic (a toggle's knob) [M17]
};
export const motion = {
  sceneLead: 0,                 // a graphic swap starts on the word onset [S13]
  // entrance: one tween of 10 frames on expo.inOut (travel and scale), opacity up in the first 3 frames, and a blur
  // pulse of 23 px x sin(pi t / 10.5 frames) [M03, M04; verified]. How far it travels and from what size depends on
  // the kind of thing: large blocks, tiles and labels, big figures, chips (each preset rests on 2 to 5 elements).
  enter: {
    dur: F(10), fade: F(3), blur: { peak: 23, span: F(10.5) }, from: 60, scaleFrom: 0.94,
    presets: { card: { from: 60, scaleFrom: 0.94 }, tile: { from: 40, scaleFrom: 0.80 }, figure: { from: 32, scaleFrom: 0.80 }, chip: { from: 22, scaleFrom: 0.70, blur: 15 } },
  },
  // exit: 7 frames at full size: blur up to 19 px over 4 frames and held, opacity out between frames 3 and 7,
  // a rise of 64 px on an ease-in cubic [M05; verified]. A replacement starts on the same frame [M06; verified].
  exit: { dur: F(7), blur: { peak: 19, rise: F(4) }, fade: { t0: F(3), dur: F(4) }, rise: { to: -64 } },
  // the layout change: the presenter panel slides 960 px and the caption glides 520 px on one expo.inOut tween of
  // 10 frames, the same both ways, starting with the graphics swap. The panel's footage blurs by 16 px x sin(pi u)
  // while it travels; the caption stays sharp [M07, M08, L21, P16, P17; verified]
  reflow: { dur: F(10), panelBlur: 16 },
  // the opening build, one fixed timeline [H10-H14, M09-M11; verified]: one tween per part on expo.inOut, 0.33 s,
  // a line every 0.10 s. A line slides 0.425 x its cap height (light lines from above, heavy from below) with
  // blur 13.2 px x 4p(1-p) and opacity min(1, p / 0.25). The illustration scales 0.92 to 1 about its centre.
  title: {
    start: [0, 0.1, 0.2, 0.3], dur: 0.33, slide: 0.425, blurPeak: 13.2, fadeBy: 0.25,
    illustration: { start: 0, dur: 0.34, scale: 0.92, blurPeak: 15, fadeBy: 0.4 },
  },
  // bars grow from their left edge: expo.inOut over 9 frames, starting 1 frame after the word [M13, G11; verified]
  highlight: { wipe: F(9), lag: F(1), lineGap: F(7) },
  countUp: { dur: F(13), inCard: F(10) },   // expo.inOut; a big figure, a value inside a card [M14; verified]
  stagger: F(2),                // rows, tiles and chips of one graphic, in reading order [M16; verified]
  // the call to action [H26, M15; verified]: both lines are one expo.inOut tween of 0.34 s with blur = peak x sin(pi u).
  // 'Comment' rises 60 px from scale 0.94. The keyword starts 0.21 s later and swings in from 139 px to the right,
  // tilted 6 degrees clockwise, about the line's centre: the one rotation in the style.
  cta: { dur: 0.34, keywordLag: 0.21, labelRise: 60, labelScale: 0.94, labelBlur: 22, keywordDx: 139, keywordTilt: 6, keywordBlur: 23.5, fadeBy: 0.25 },
  heading: { from: -40, lag: F(3) },   // slides down 40 px through the standard blur, 3 frames after its first word [H20, H21; verified]
  toggle: F(2),                 // a state change inside a held graphic: 1-2 frames, no blur [M17; low]
};

// ------------------------------------------------------------------ explaining (research/explain.md, explain-motion.md, explain-look.md)
// An explanatory graphic is an anchor that arrives first and then 1 to 5 events, each on the word that names it
// [X01, X07]. Events change something already on screen, add a part, or draw a line and send a token along it
// [X15]. After the last event the picture is still [X24, D25].
export const explain = {
  // timing [X10, X12-X14, D26]: an event takes about 11 frames; a part with no word of its own follows 6 frames
  // later; rows stagger 5 frames; the anchor is alone about 26 frames; the finished picture holds 40 frames or more
  event: { dur: F(11), follow: F(6), rowStagger: F(5), afterAnchor: F(26), minHold: F(40) },
  // lines [D02, D03, R18, R19]: a solid accent stroke of 10 px with round caps that grows on expo.inOut over a
  // fixed 12 frames whatever its length; dashes 22 px on an 8 px gap, 8 px wide; dots 8 px on an 18 px pitch.
  // A dashed or dotted pattern is fixed in space and revealed up to the tip: it does not march.
  line: { stroke: 10, draw: F(12), dash: [22, 8], dashStroke: 8, dot: [8, 18] },
  // travellers [D05, D06, D08]: at the tip of every drawn path; a solid accent dot about twice the stroke, or a
  // cream disc carrying a mark on a long route; 22 to 31 frames for the whole path, eased; an event marks the arrival
  traveller: { dot: 21, disc: 50, dur: F(26) },
  // badges [D09, R21, R22, X18]: land in place, scale 0.55 to 1 on expo.inOut over 10 frames, opaque within 3,
  // a blur of 12 px that clears last, no travel. 100 to 200 px across, on the top-right corner of the object, or
  // over its centre when it cancels or completes it. The check's stroke is a tenth of its disc.
  badge: { from: 0.55, dur: F(10), blur: 12, fade: F(3), size: 150, sizeRange: [100, 200], check: 0.10, cross: '#E4494C' },
  // tags and short labels inside a picture use the chip entrance: scale 0.65, a 22 px rise, 15 px blur, 10 frames [D11]
  tag: { from: 0.65, rise: 22, blur: 15, dur: F(10) },
  // tiles and glyph icons [R23, R24]: rounded squares, radius 0.31 of the side; single-weight line icons with
  // round caps, stroke 4.4 % of the tile side, the glyph about 46 % of it
  tile: { side: 113, radius: 0.31, glyph: 0.46, stroke: 0.044 },
  timer: { rate: 12 },            // a running timer advances 12 units a second, linearly, proportional digits [D15, D28]
  flip: { dur: F(7), every: F(11.5) },   // a calendar tile [D18]
  morph: F(9),                    // an icon swapping in place [D19]
  wave: { wavelength: 280, amplitude: 34, stroke: 4.5 },   // sine waves between two objects are still [D20]
  figureGap: 41,                  // a figure and its picture: 30 to 80 px apart on the axis [R30]
};

// ------------------------------------------------------------------ sound (research/audio.md)
// No sound effects anywhere [A22, A28]. One music bed under the whole video, played from its start: static,
// never ducked, about 20 dB under the mix, a hard start 48 ms in, a 1.0 s linear fade to the last sample
// [A11-A16, A26]. The bed is the engine's music track, so its numbers live in style.head.json "beds":
//   gainDb -16.7   puts every section of bed-a at its measured loudness under a voice at -14.5 LUFS [A14]
//   fadeOut 1      [A16]
// The 48 ms lead is inside the file (dev/make-audio.mjs).
export const sound = { bedGainDb: -16.7, bedFadeOut: 1.0, bedLead: 0.048 };
