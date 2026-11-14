// Night Class: every measured constant of the style lives here.
// Geometry is pixels on the 1080x1920 frame. Times are seconds: the reference reels run at
// 23.976, 24, 25 or 30 fps, and every duration was measured in frames at the clip's own rate,
// then converted. F(n) = n frames at 24 fps, the rate most reference reels use.
// Each block names the research note and rule ids it comes from (research/*.md, ids in brackets);
// change the note first, then the number here.

export const W = 1080, H = 1920, CX = 540;
export const F = (n) => n / 24;

// ------------------------------------------------------------------ fonts (research/type.md)
// Sans: a heavy neo-grotesque, built with Inter 800 at optical size 14 [T01] (the measured best
// match cannot be shipped). Serif: Instrument Serif Italic 400 [T02]. Both SIL OFL 1.1.
export const fonts = {
  sans: '"NC Inter", "Inter", system-ui, sans-serif',
  serif: '"NC Serif", "Instrument Serif", Georgia, serif',
  sansVariation: "'opsz' 14",
  files: [
    { family: 'NC Inter', src: 'assets/fonts/Inter.ttf', weight: '100 900', style: 'normal' },
    { family: 'NC Serif', src: 'assets/fonts/InstrumentSerif-Italic.ttf', weight: '400', style: 'italic' },
  ],
  // vertical metrics of a line-height-1 box (hhea/OS2 of the shipped files): baseline offset, cap and x-height, per em
  sansM: { base: 0.8638, cap: 0.7275, x: 0.548 },
  serifM: { base: 0.84, cap: 0.72, x: 0.51 },
};

// ------------------------------------------------------------------ colour (research/colour.md)
export const colour = {
  // dark field: neutral, static, one texture per video [C03-C07; verified]. Black is the default (11 of the 15
  // newest reels with a dark field); the texture varies per video, so it is a look choice:
  //   dots    soft round dots on an 18.3 px square lattice, about 4.3 px across, ~16 levels above black
  //   grid    1-px lines on a 16 x 18 px lattice, ~14 levels above #010101, crossings brighter
  //   plain   flat black
  //   lifted  #080808 lit by two soft lights (top-left off-frame, low right beside the panel), with dots
  plates: {
    dots: { base: '#000000', dot: 'rgba(255,255,255,0.064)', pitch: 18.3, d: 4.3 },
    grid: { base: '#010101', line: 'rgba(255,255,255,0.055)', px: 16, py: 18 },
    plain: { base: '#000000' },
    lifted: { base: '#080808', dot: 'rgba(255,255,255,0.05)', pitch: 18.6, d: 4.3,
      lights: [{ x: -200, y: 150, r: 1075, add: 'rgba(255,255,255,0.035)' }, { x: 1100, y: 1620, r: 1200, add: 'rgba(255,255,255,0.027)' }] },
  },
  // light field: #E3E3E3 with faint speckles on an 11.5 x 9.65 px lattice and a 1-px grid at 42.85 px that shows only
  // in a round soft spot centred at (543, 950), sigma 205 px [C08, C09; verified: the spot is at y 950, not 1110]
  light: { base: '#E3E3E3', speckle: { px: 11.5, py: 9.65, jitter: 1.5, size: 4.5, alpha: 0.045 },
    grid: { x0: 559.97, y0: 1124.85, px: 42.851, py: 42.882, cx: 543, cy: 950, sigma: 205, alpha: 0.11, width: 2 } },
  // The accents are the release palette, not the measured ones: every measured red becomes a cobalt and the yellow an
  // ice cyan of the same relative luminance, so every contrast holds (research/colour.md, Release palette [C28]).
  cobalt: '#164CE1',         // title bar and every primary accent (measured as the primary red [C11]) [C28]
  cobaltBright: '#4274FF', cobaltDark: '#1138A6',   // small highlights, gradient ends (the bright and dark reds [C14]) [C28]
  green: '#1A9D11', cyan: '#96F1FF',          // positive/selected states; glowing highlight lines [C23, C24; verified] [C28]
  ink: { dark: '#FEFEFE', light: '#030303' }, // titles and labels [C17, C18]; the light ink's red cast removed [C28]
  caption: { dark: '#FEFEFE', light: '#010101' },   // captions never take colour [C19, T06]; red cast removed [C28]
  onCobalt: '#FEFEFE',
  card: '#161616', chip: '#333334',           // neutral fills: cards #151515-#161616, index rows #2F2F2F-#3E3E3E [C20; verified]
  stroke: { white: '#FEFEFE', grey: '#7A7A7A' },   // [C21]
  // document cards: white heading and labels (dimmed labels #A8A8A8), grey bars #393738-#797979 by video, accent highlight [C22; verified] [C28]
  doc: { bar: '#5E5E5E', label: '#FFFFFF', labelDim: '#A8A8A8', heading: '#FFFFFF', highlight: '#164CDF' },
  cobaltGlow: '0 0 68px rgba(22,76,225,0.6)', // sigma about 34 px; about 4 in 10 accent elements glow [C16; verified] [C28]
  lightCard: { fill: '#F6F6F4', border: '#B3B3B2' },   // [G22]
};

// ------------------------------------------------------------------ layout (research/layout.md, presenter.md)
export const layout = {
  // the presenter panel: top corners rounded, runs off the bottom of the frame, no stroke, shadow or glow, never
  // moves [L03, L04, P05-P08, M20]. Several templates recur all month; the commonest in the newest reels is this
  // one (CSS edges; template B, 71/1408/938/r42, is the commonest over the whole month) [verified]
  panel: { x: 68.8, y: 1404.6, w: 942.4, r: 46.5 },
  // one caption line centred on x 540, baseline fixed for the whole video: the last full ink row is 1305, so the
  // CSS baseline (the top edge of row 1306) is 1306 [L07, T05; verified]
  caption: { baseline: 1306, maxW: 743 },
  // the title band: first line's cap top, 157 for opening titles and ~167 overall; it moves down when the graphic
  // below is short (later titles median 190 in the newest reels) [T14, L11, H05; verified]
  title: { capTop: 160, maxW: 900, headerCapTop: 200 },
  // where graphics live in the split layout, centred on x 540 near y 750 [L12, L13, L14]
  graphic: { left: 83, right: 1012, top: 300, bottom: 1205, cx: 540, cy: 750, minGapToCaption: 55 },
  // graphic height by kind (median of measured boxes) [L13]
  graphicH: { text: 520, chips: 571, capture: 558, doc: 675, diagram: 809, grid: 858, phone: 952 },
  safe: { left: 82, right: 997, top: 115 },   // closest text comes to the edges [L16]
  // two graphics side by side (a phone and a stat card): the main one moves left, the second sits right
  side: { cx: 800, shift: 250, enter: 320 },
};

// ------------------------------------------------------------------ presenter (research/presenter.md)
export const presenter = {
  // inside the panel: eyes 74.5 px apart, eye line 66 px under the panel top (p10 38, p90 92) [P12]; the head
  // rises about 79 px above the panel top [P10, L06]: a speaker with more hair above the eyes is set lower,
  // within the eye-line range, so the head keeps clear of the caption [L10]
  panel: { eyeDist: 74.2, eyeLineBelowTop: 65, eyeLineRange: [38, 91], headAbove: 72, eyeX: 530 },
  // full height: eyes 196 px apart, eye line at y 654 [P13]; never enlarge footage more than this [P27]
  full: { eyeDist: 196, eyeY: 650, eyeX: 530, minEyeDist: 184, maxScale: 1.35 },
  // push-ins on about 1 in 4 full-height runs, about the frame centre, held until the next cut [P16-P19; verified:
  // 23-27 % of runs, levels 1.087 and 1.169, 0.51 and 0.56 s]
  push: {
    origin: [530, 967],
    small: { to: 1.087, dur: 0.51, curve: [0.37, 0.05, 0.08, 0.81] },
    large: { to: 1.169, dur: 0.56, curve: [0.08, 0.32, 0.24, 0.82] },
  },
  matteEdge: [0.42, 0.58],      // the cut-out has a hard edge: no feather, outline or shadow [P11]
};

// ------------------------------------------------------------------ type (research/type.md)
export const type = {
  // captions: Inter 800, one line, cut in and out [T03, T04, T07, T10]. Panel captions come in two sizes per video;
  // the larger (cap 42.8 px) is used in 10 of the 17 newest reels; full height is one size (cap 49.9) [verified]
  caption: { size: 59, sizeFull: 69, tracking: -0.02, weight: 800 },
  // the named concept as one serif caption, 1.33x the caption's ink height [T12]
  concept: { size: 78, sizeFull: 90, tracking: -0.01 },
  // title lockup: about 70 px in the newest reels (cap 50.75), tracking -0.035 em, serif words at the same cap
  // height [T15, T16; verified]
  title: { size: 70, minSize: 49, maxSize: 87, weight: 800, tracking: -0.035, serifTracking: -0.01, allSerifScale: 1.25 },
  // baseline-to-baseline of a two-line lockup scales with the cap height: 1.48 x cap with a bar on line 2, 1.27 x cap
  // otherwise (in em of the larger line) [T18; verified]
  titleLead: { bar: 1.08, underline: 0.93, none: 0.93 },
  // the cobalt bar hugs its text: square corners, about 16 px each side, 11 px above the cap top, 13 px below the
  // baseline, so its height follows the text size [T17, G05; verified]
  bar: { padL: 16, padR: 16, padTop: 11, padBottom: 13.2, radius: 0 },
  // the newest underlines: about 7.5 px thick, the full line width, 7 px under the baseline [T17; verified]
  underline: { h: 7.5, gap: 7, frac: 1.0 },
  header: { size: 61 },                        // one-line section header, no decoration [T22]
  // the call to action: line 2 sits on a fixed 655 x 84 bar with 7 px corners, whatever its text [T23; verified]
  cta: { size: 74, keywordSize: 75, capTop: 219, bar: { w: 655, h: 84, radius: 7.3 } },
  index: { size: 42 },                          // list numbers 01-06 [T24]
  label: { size: 33 },                          // chip labels, Title Case [T24]
  docTitle: { size: 50 }, docLabel: { size: 32 },   // 'Script' in serif, Hook / Body / CTA in sans [T24]
};

// ------------------------------------------------------------------ motion (research/motion.md, hook.md)
// Entrances ease out with a steep start and a long tail (the slide curve; M10's faster house curve was not
// reproduced); things already on screen move with a slow-start S-curve; nothing overshoots, rotates or blurs
// [M11, M13, M21-M23, M27; verified].
export const curves = {
  house: [0.08, 0.38, 0.29, 0.97],      // = slide [M11; verified]
  slide: [0.08, 0.38, 0.29, 0.97],      // whole graphics entering [M11; verified]
  push: [0.33, 0.03, 0.02, 0.95],       // graphic-to-graphic horizontal push [M13; verified]
  scale: [0.08, 0.38, 0.29, 0.97],      // cards scaling in: t90 ~0.6 s [M14; verified]
  fade: [0.24, 0.44, 0.39, 0.93],       // rare pure fades [M15]
  wipe: [0.27, 0.81, 0.65, 0.92],       // highlights growing from the left [M16]
  bar: [0.33, 0, 0.66, 1],              // the title bar wipe: ease-in-out [H11; verified]
  underline: [0.26, 0.11, 0, 1],        // the underline draw [H13; verified]
  line: [0.15, 0.68, 0.5, 0.78],        // connector lines [M17]
  titleUnit: [0.07, 0.66, 0.35, 0.95],  // each title word: slide and opacity on one curve [M07; verified]
};
export const motion = {
  sceneLead: 0,                                           // layout cuts sit on the word onset [S07, L18]
  slide: { dur: 1.1, dist: 200 },                         // [M11; verified: ~200 px, t90 0.64 s, settled 1.06 s]
  push: { dur: 1.14, dist: 878 },                         // the outgoing and incoming graphic move as one strip [M13]
  scale: { dur: 1.0, from: 0.82, fade: 0.82 },            // from ~0.82 of size, nearly opaque at once [M14; verified]
  fade: { dur: 0.77 },
  wipe: { dur: 0.44 },
  line: { dur: 0.39 },
  // title build: one unit (word) every 2 frames from frame 2; each slides in from 74 px right of its place with its
  // opacity on the same curve over 0.75 s (no re-centring of the line); line 2 takes the next slot, 3 frames after
  // line 1's last word; the bar wipes in with its line's first word, the underline a frame after it [H04-H13, M05-M07;
  // verified]. A new title after a cut builds from the cut frame [M09; verified]
  title: { start: F(2), unit: F(2), unitDx: 74, unitDur: 0.75, line2Gap: F(3),
           barLead: F(1), barDur: 0.8, underlineLag: F(1), underlineDur: 1.0, afterCut: F(1), typeRate: 38.4 },
  // a new row joins a list: rows above move up with the house curve [M12]
  rows: { dur: 1.1 },
  // the camera over the graphic field. The reference keeps it moving: a graphic arrives with the view pulling back
  // from ~1.12x into place (tables shrink ~10 % in their first second), then the view keeps creeping in while it
  // holds (0.8-4.2 %/s measured, 2.5 %/s typical, linear); beats can push into a detail (into a phone until its
  // icons fill the field, ~2.4x, an accelerating move) and pull back out [M14, M21, M24; verified]
  camera: {
    settle: { from: 1.12, dur: 1.3 },            // own entrance: the view pulls back into place
    pushSettle: { from: 1.05, dur: 1.1 },        // pushed in as a strip: a smaller settle
    zoomIn: { from: 1.38, dur: 0.95, out: 1.55, outDur: 0.45 },   // zoom transition: the old one blows up and fades
    drift: { rate: 0.022, max: 1.11 },           // the hold: a slow linear push-in
    focus: { dur: 0.8, scale: 1.9, centre: [540, 720] },
  },
  hold: { after: 0.9, rate: 0.022, max: 1.11 },                                     // rows already there move up with the slide curve (t90 0.69 s) [M12; verified]
  captionDelay: F(2),                                     // a caption shows about 2 frames after its word starts [T09; verified]
};

// ------------------------------------------------------------------ sound (research/audio.md)
// One kit per video [A15]; each sample at a fixed gain [A24]. gainDb is relative to the file's own
// level (files are normalised to -20 dBFS peak-50ms); offset shifts the file against its event.
export const kits = {
  // the cut thump was not confirmed as a recurring sample [A19; verified], so no kit places one on cuts
  k1: { label: 'Swell', graphic: 'swell', cut: null, transition: 'riser', tick: 'swoop' },           // [A17, A18, A20]
  k2: { label: 'Sub', graphic: 'midwhoosh', cut: 'subdrop', transition: 'riser', tick: 'tone' },     // [A21, A22]
  k3: { label: 'Low', graphic: 'lowwhoosh', cut: null, transition: 'riser', tick: null },            // [A23]
};
export const sound = {
  swell: { gainDb: -14, lead: 0.1 },        // a free-standing low swell; near a change, the change lands 0-0.3 s in [A17; verified]
  swoop: { gainDb: -18, lead: 0 },          // [A18]
  thump: { gainDb: -15, lead: 0 },          // starts on the cut frame [A19]
  riser: { gainDb: -14, lead: 0.48 },       // a low swell that stops dead, often on a cut, 1-4 per video [A20; verified]
  subdrop: { gainDb: -14, lead: 0 },        // [A21]
  tone: { gainDb: -24, lead: 0 },           // [A22]
  midwhoosh: { gainDb: -16, lead: 0.41 },   // [A22]
  lowwhoosh: { gainDb: -16, lead: 0.09 },   // [A23]
};
export const soundSpacing = { same: 0.35, any: 0.1 };
// The bed: one low loop, entering at the top of its loop after the hook, about 16 dB under the
// voice, never ducked; one 6-loop block, a music-free stretch, then the second loop to the end [A06-A12]
// [verified: entry median 8.1 s at the loop top; 16 dB under the voice by RMS; the second section starts 73.8 s after
// the entry; one kit keeps bed A on for the whole video, restarting it from the loop top]
export const bed = { loop: 7.3843, block: 6, entry: 8.1, minEntry: 3.0, lateAfterEntry: 73.8, gainDb: -12 };
