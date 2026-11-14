// Editorial Proof: every measured constant of the style lives here.
// Geometry is in pixels on the 1080x1920 canvas. Times are seconds; F(n) = n frames at 30 fps,
// the unit the reference was measured in. Each block names the study it came from
// (research/*.md); change numbers there first, then here.

export const W = 1080, H = 1920, CX = 540;
export const F = (n) => n / 30;

// ------------------------------------------------------------------ colour (research/colour.md)
// The release palette is original: every hue below replaces a measured value of the reference, role for
// role, as listed in research/colour.md, "Release palette" (CR01-CR12). Roles, gradient stop positions and
// shadow geometry are as measured; only the colours changed.
// Two accent shades, not one: a bright accent fills strips and colours keywords; a deeper one draws outlines.
const base = {
  ink: '#131416',            // captions and titles on light
  white: '#FFFFFF',
  cardFill: '#FFFFFF',
  captionOnDark: '#F4F4F4', captionOnVideo: '#FDFBFA',   // CR08: the measured cool white, neutralised
  red: '#FE4D2E',            // marker strike
  redText: '#DB5A53',        // typographic strikethrough in designed lists
  redSoft: 'rgba(229,72,77,0.30)',
  tile: 'rgba(51,51,51,0.92)', tileEdge: '#5A5A5A', tileLabel: '#EEEEEE',   // CR08: measured slate, blue edge and label, neutralised
  chip: '#FDFDFD', chipLabel: '#121212',
  counter: '#1F1F1F', counterText: '#F8F7F7',
  termBar: '#1B1B1B', termBg: '#111111', termRow: '#222226', termText: '#EEEEEE', termGreen: '#34A54D', termDim: '#8A8A90', termAccent: '#E07C51',
  chromeTop: '#F4F4F6', chromeBottom: '#EFEFEF', chromeLine: '#E4E4E4',
  lightRed: '#FD6C52', lightYellow: '#FCB723', lightGreen: '#1AAD3A',
  canvas: '#FFFFFF',                               // CR10: flat white under a static grid (replaces the measured canvas, fronds and grain)
  gridLine: '#EFEFEF', gridMajor: '#E3E3E3',       // CR10
  cardShadow: '0 13px 20px -8px rgba(0,0,0,0.11)',
  stripShadow: '0 12px 28px -6px rgba(0,0,0,0.18)',
  captionShadowDark: '0 13px 25px rgba(0,0,0,0.6)',
};

/** The light canvas grid (CR10): lines centred on the frame centre, a stronger line every `every` cells. */
export const grid = { pitch: 90, every: 3, line: 2, major: 2, origin: [540, 960] };

const looks = {
  emerald: {                  // CR01-CR07, CR09: replaces the measured blue set
    accent: '#00845F',        // title strip, number blocks
    onAccent: '#FCFDFC',
    accentText: '#00734E',    // emphasised caption words on light: 4.5:1 even over a major grid line
    accentTextDark: '#7BF5C8', accentSerifDark: '#B5F8DD',
    outline: '#006A4C',       // every card outline
    outlineGlow: 'rgba(0,150,104,0.45)',
    panel: ['#3B8C71', '#1C7457', '#0B6A4C'],     // presenter panel ring: lit outer, inner, shaded side
    glint: '#79D6B4', glintTail: '#1E9B6E', glintHot: '#B3EBD7',
    highlight: 'rgba(16,196,136,0.38)',           // #A4E9D2 on white
    highlightDark: '#186A4F',
    callout: '#00845F',
    digits: ['#F2FCF8', '#E0F8EE', '#C3F0DE', '#8FE3C2', '#5DD4A6', '#2FC489'], digitGlow: 'rgba(47,196,137,0.5)',
    ctaDot: '#0F9D6D', ctaRim: 'rgba(14,150,104,0.9)',
    shade: '0,83,60',         // strip and block shadows: the accent at 63 %
    tint: '#E0F0EC', tintMuted: '#F3F9F7', tintEdge: '#CFE3DD', iconInk: '#4D9782',   // CR07: accent and outline over white
  },
  violet: {                   // CR11: replaces the measured lime set (a product whose own colour is violet)
    accent: '#8846FA', onAccent: '#FCFDFC',
    accentText: '#7836E4', accentTextDark: '#E5D6FF', accentSerifDark: '#F0E8FF',
    outline: '#6430CC', outlineGlow: 'rgba(130,80,240,0.45)',
    panel: ['#9578E4', '#7552D6', '#6237C6'],
    glint: '#CDB8FF', glintTail: '#9363F2', glintHot: '#E6DCFF',
    highlight: 'rgba(136,70,250,0.30)', highlightDark: '#5E40AE', callout: '#8846FA',
    digits: ['#F8F5FF', '#EFE9FF', '#E0D4FF', '#CDB9FF', '#BFA6FF', '#B293FF'], digitGlow: 'rgba(178,147,255,0.5)',
    ctaDot: '#8A4DF5', ctaRim: 'rgba(120,64,230,0.9)',
    shade: '86,44,158',
    tint: '#F1E9FE', tintMuted: '#F9F6FF', tintEdge: '#E2D8F5', iconInk: '#936EDB',
  },
};

/** The closing keyword is the one place hue is free: pale top, saturated bottom, same-hue glow.
 *  emerald and violet follow the look (CR12); the others are brand colours, as measured [C27]. */
export const ctaTones = {
  emerald: ['#BFFFE8', '#4CFCBC'], violet: ['#DBC7FF', '#AD7EFC'],
  blue: ['#CFFDFE', '#5BCCFB'], yellow: ['#FFFDB7', '#FDFE53'], orange: ['#FEDEB6', '#FD9D52'],
  green: ['#BAFDC2', '#56FD69'], cyan: ['#BAFDFD', '#58FDFB'], lime: ['#EEFEAF', '#B7FD39'],
};

export const colours = (look = {}) => ({ ...base, ...(looks[look.accent] || looks.emerald), accentName: looks[look.accent] ? look.accent : 'emerald' });

// ------------------------------------------------------------------ type (research/type.md)
// Sans: Inter (display optical size), 600 for titles and captions, 700 for names, numbers and the CTA keyword.
// Serif: EB Garamond italic, heavy, for strip lines, emphasised words, number blocks and the CTA verb.
export const fonts = {
  sans: '"Motus Inter", "Inter", system-ui, sans-serif',
  serif: '"Motus Garamond", "EB Garamond", Georgia, serif',
  mono: '"Motus Mono", "JetBrains Mono", ui-monospace, Menlo, monospace',
  files: [
    { family: 'Motus Inter', src: 'assets/fonts/Inter.ttf', weight: '100 900', style: 'normal' },
    { family: 'Motus Garamond', src: 'assets/fonts/EBGaramond-Italic.woff2', weight: '400 800', style: 'italic' },
    { family: 'Motus Mono', src: 'assets/fonts/JetBrainsMono.ttf', weight: '100 800', style: 'normal' },
  ],
};

export const type = {
  capRatio: { sans: 0.7275, serif: 0.6575 },                 // cap height / font size
  ascent: { sans: 0.8633, serif: 0.85 },                     // baseline offset from the top of a line-height-1 box (measured in Chrome: Inter 86, EB Garamond 85 at 100 px)
  title: { size: 86, weight: 600, tracking: -0.009, colour: '#101010' },    // hook line 1
  strip: { size: 107, weight: 800, tracking: -0.028 },       // italic serif on the accent strip: 'These AI Tools' sets 632 px of ink in a 672 px strip [L05]
  caption: { size: 96, weight: 600, tracking: -0.008, serifScale: 1.13, serifWeight: 700, serifTracking: -0.02 },
  heading: { size: 87, weight: 600, tracking: -0.0147 },     // interstitial heading
  name: { size: 104, weight: 700, tracking: -0.0228 },       // interstitial name under the card
  block: { size: 110, weight: 800, tracking: -0.028 },       // italic serif word in the accent block
  number: { size: 210, weight: 700, tracking: -0.002, label: 60, labelTracking: -0.026 },
  cta: { verbWeight: 600, keywordSize: 105, keywordWeight: 700 },
};

// ------------------------------------------------------------------ layout (research/layout.md)
export const layout = {
  safe: { left: 74, right: 1005, top: 194, bottom: 1533 },
  card: { x: 93, w: 894, radius: 18, stroke: 4, strokeDark: 4 },
  light: {
    card: { y: 255, h: 722 },                 // no title
    cardUnderTitle: { y: 493, h: 485 },       // hook
    cardWithChips: { y: 255, h: 484 },
    chipsGap: 28,
    captionBaseline: 1086,
    panel: { x: 41.5, y: 1291.5, w: 998, stroke: 18, outerRadius: 36, innerRadius: 18 },
  },
  title: { capTop: 236, baseline: 302, strip: { y: 336, h: 140, radius: 8, padX: 20, baselineFromBottom: 28 }, gapToCard: 17 },
  dark: {
    slot: { y: 254, h: 1024 },                // a card may use all of it
    card: { y: 254, h: 684 },                 // default, and with a chip row
    chipsGap: 30, chipRow: { y: 967, h: 274 },
    centreY: 766,
    captionBaseline: 1440,
  },
  white: {
    heading: { capTop: 270, baseline: 333 },
    block: { y: 366, h: 132, radius: 10, padX: 30 },
    strip: { y: 256, h: 135 },                // "It's Called" form: strip only, no heading line
    card: { x: 115, y: 527, w: 850, h: 622 },
    nameBaseline: 1286,
    focusCard: { y: 300, h: 722 },            // white focus: card without heading
    focusCaptionBaseline: 1330,
    captionBaseline: 1440,
  },
  full: {
    captionBaseline: 1408,                    // punch-in caption (ink 1331-1422)
    cta: { verbInkTop: 1357, verbInkW: 387, verbCx: 551, keywordBaseline: 1493 },
    dot: { x: 978, y: 1211, r: 48.5, halo: 115 },
  },
  counter: { w: 124, h: 42, right: 23, top: 14 },
};

// ------------------------------------------------------------------ presenter (research/presenter.md)
export const presenter = {
  split: { faceW: 316, eyeX: 530, eyeY: 1431, hairTop: 1137, rise: 163 },   // head rises 163 px above the panel top
  full: { faceW: 690, eyeX: 540, eyeY: 745, hairTop: 110 },
  maxScale: 1.9,               // never enlarge source footage beyond this
  matteEdge: [0.30, 0.70],
};

// ------------------------------------------------------------------ motion (research/motion.md)
// Curves measured on the reference (fit error under 1 %). Nothing overshoots, rotates or bounces.
export const curves = {
  emphasized: [0.2, 0, 0, 1],     // strip wipes, white-to-dark morph, list reorders
  settle: [0.3, 0, 0, 1],         // the stage zoom-out after a cut
  incard: [0.2, 0, 0.1, 1],       // push-ins and scrolls inside a card
};
/** Exponential approach: 0 -> 1 with e-fold time tau (seconds). */
export const expo = (t, t0, tau) => (t <= t0 ? 0 : 1 - Math.exp(-(t - t0) / tau));
/** Halving decay: 1 at age 0, 0.5 after `half` seconds. */
export const halving = (t, t0, half) => (t <= t0 ? 1 : Math.pow(2, -(t - t0) / half));

export const motion = {
  sceneLead: 0,                                       // layout changes sit on the word onset (median -0.4 frame)
  stage: { from: 1.15, dur: F(36), origin: [540, 958] },   // cut into dark focus: the stage starts 15 % large and settles
  lightCard: { dy: -61, tau: F(6.54), fade: F(12) },  // cut into the light split: the card eases down into place
  whiteCard: { delay: F(5), fade: F(5), fromScale: 0.946 },
  morph: { dur: F(14) },                              // white interstitial -> dark focus: ground cross-fades, card travels
  glint: { lap: 8.0, tailFrac: 0.18, headFrac: 0.022, thickness: 12, delay: F(5), phaseFrame: 118 },
  highlight: { tau: F(2.0), cap: F(14) },
  outline: { dur: F(8) },
  strike: { tau: F(1.13), cap: F(6), rowStagger: F(5) },
  number: { count: F(16), plateAt: F(8), plateFade: F(4), tint: F(6), hold: F(34), out: F(6) },
  chip: { from: 0.957, peak: 1.031, grow: F(9), hold: F(4), relax: F(7) },
  captionWord: { fade: F(6.75), rise: 10, riseDur: F(5.25), blur: 5, blurHalf: F(0.74), delay: F(2) },
  title: { stagger1: F(2.5), fade1: F(12.25), rise1: 32, blur1: 8, half: F(1.0),
           stripAt: F(4), stripDur: F(15), word2At: F(8), stagger2: F(3), fade2: F(10.5), rise2: 24, blur2: 7,
           shineAt: F(23), shineDur: F(6), outDur: F(12), wordOut: F(6), wordOutRise: -24, wordOutStagger: F(1.5) },
  heading: { word1: F(1), stagger: F(2), stripAt: F(5), stripDur: F(15), stripWord: F(8), nameAt: F(18) },
  cta: { verbLead: F(2), verbFrom: 1.16, verbDur: F(16), keywordAfter: F(14), flicker: [1.0, 0.45, 0.88, 0.6, 1.0], verbDim: 0.91, dotAfter: F(8), dotIn: F(6), dotPeak: 1.08, dotSettle: F(16), dotPeriod: F(43) },
  rows: { start: F(2), stagger: F(3), fade: F(6) },                 // price rows at frames 2, 5, 8, 11, 14 [H10]
};

// ------------------------------------------------------------------ sound (research/audio.md)
// Every effect file is normalised so its loudest 50 ms sits at -20 dBFS; gainDb then places it
// 16-31 dB under a voice normalised to -14.5 LUFS. offset shifts the file against its event.
export const sound = {
  open: { sfx: 'riser', gainDb: -12, offset: 0 },             // the same riser 25 ms into every video
  interstitial: { sfx: 'riser', gainDb: -12, offset: -0.025 },
  cut: { sfx: 'cut', gainDb: -15, offset: -0.55 },             // sub riser ending in a tick exactly on the cut
  end: { sfx: 'cut', gainDb: -15, offset: 0 },                 // and into the last sample of the video
  cardIn: { sfx: 'softswish', gainDb: -17, offset: 0.13 },     // a card settling in after a cut
  cardSlide: { sfx: 'whoosh', gainDb: -17, offset: -0.02 },    // a card sliding in (69 slides in 24 reels) [A17]
  check: { sfx: 'click', gainDb: -22, offset: 0 },             // a row checked or lit
  highlight: { sfx: 'swish', gainDb: -28, offset: 0.015 },     // highlight sweeps and strike-throughs
  strike: { sfx: 'swish', gainDb: -28, offset: 0.015 },
  number: { sfx: 'counter', gainDb: -17, offset: 0 },          // shimmer while the digits roll
  numberLand: { sfx: 'swell', gainDb: -22.5, offset: -0.22 },  // bright swell peaking as the number lands
  chip: { sfx: 'click', gainDb: -18, offset: 0 },
  type: { sfx: 'long', gainDb: -20, offset: 0 },               // typing or scrolling inside a card
  ctaVerb: { sfx: 'hit', gainDb: -24, offset: 0.033 },
  cta: { sfx: 'pop', gainDb: -21, offset: 0.005 },
};
/** Spacing the reference keeps between effects: the same effect at least 0.35 s apart, different ones 0.1 s (the CTA pair excepted). */
export const soundSpacing = { same: 0.35, any: 0.1 };

export const px = (n) => `${Math.round(n * 100) / 100}px`;
