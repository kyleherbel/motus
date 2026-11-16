// Measured bounds and explicitly reconstructed choices: research/design.md D01–D12.
export const W = 1080, H = 1920; // D01
export const fonts = { sans: '"RD Sans", sans-serif', serif: '"RD Serif", serif', files: [
  { family: 'RD Sans', src: 'assets/fonts/DMSans.ttf', weight: '100 1000', style: 'normal' },
  { family: 'RD Serif', src: 'assets/fonts/PlayfairDisplay-Italic.ttf', weight: '400 900', style: 'italic' },
] }; // D03
// D03/D10: hero sans 92 with a heavier, larger Playfair italic accent (reference "guides people").
export const type = { hero: 92, italic: 116, title: 44, titleItalic: 52, pill: 36, body: 32, caption: 44, small: 27, min: 24, lead: 46, weight: 400, accentWeight: 700 };
export const geo = { // D02/D06/D10
  safe: { x: 72, y: 160, w: 936, bottom: 1630 },
  back: { x: 56, y: 205, w: 600, h: 470 }, radius: 40, pad: 40, rowH: 64, rowGap: 14,
  hero: { x: 70, y: 1300, w: 940, h: 145, pillY: 1188, pillH: 74, leadY: 1236 },
  steps: { y: 1488, x0: 150, x1: 930, node: 74 },
  search: { x: 170, y: 1468, w: 740, h: 92 },
  stack: { w: 430, h: 178, tops: {2:560,3:300,4:200}, pitches: {2:330,3:300,4:260}, tilt: 6 },
  compare: { x: 92, y: 520, w: 410, h: 400, gap: 76 },
  action: { x: 250, y: 860, w: 580, h: 150 },
  photos: { x: 92, y: 430, w: 896, h: 380, gap: 22, radius: 30 },
  film: { x: 100, y: 550, w: 880, h: 360, pad: 26, gap: 10 },
  portrait: { x: 250, y: 370, w: 580, h: 580 },
  panel: { x: 0, y: 760, w: 1080, h: 1160 },
  presenter: { eyeY: 860, faceW: 420, studioEyeY: 1050, studioFaceW: 260, minScale: 0.45, maxScale: 1.7 },
  captionY: 1330, captionBelowY: 1460, studioHeroY: 690, studioPillY: 615,
  discs: [ { x: 930, y: 268, r: 50 }, { x: 958, y: 520, r: 30 }, { x: 96, y: 778, r: 32 } ], // D11 icon tiles
  // D13 scene library: where a topic-agnostic element sits in each slot. back = behind the head (top-left card zone),
  // stage = abstract scene centre, panel = the band between the split window and the hero line.
  region: { back: { x: 56, y: 205, w: 600, h: 470 }, stage: { x: 90, y: 400, w: 900, h: 800 }, panel: { x: 90, y: 830, w: 900, h: 410 } },
  window: { x: 90, y: 140, w: 900, h: 660, r: 46, faceW: 360, eyeY: 360 }, // D13 split layout presenter window
};
// D05/D12. Seconds. Entrances are blur-to-sharp with an exponential settle (no linear fades).
export const motion = {
  sceneLead: 0, enter: 0.46, phrase: 0.30, label: 0.28, word: 0.22, row: 0.30, disc: 0.32,
  ribbonStart: 0.12, ribbonReveal: 0.70, ribbonFlow: 0.045, ribbonBreath: 0.25,
  out: 0.20, incoming: 0.36, blur: 20, zoom: 0.05, travel: 44, drift: 7, driftHz: 0.33, stagger: 0.30,
  click: 0.55, typing: 0.8, underline: 0.42, push: 0.022,
  shake: { amp: 14, hz: 7.5, decay: 0.11, blur: 16, blurDecay: 0.09, hard: 2.2 },
  intensity: { restrained: 0.35, balanced: 1, punchy: 1.5 },
};
// D13: ribbon forms. Same renderer, different shapes, so one reel never repeats one picture.
export const ribbonForms = {
  spiral: {},
  sweep: { strength: 0.62, turns: 0.32, radius: 900, length: 40, top: 700, bandWidth: 86, pitch: 0.20, roll: -0.42, phase: -1.0, cy: 880, sparkles: 70 },
  halo: { spin: 0.03, turns: 1.0, radius: 420, length: 20, top: 640, bandWidth: 58, pitch: 0.50, roll: -0.15, phase: 0.4, cy: 640, sparkles: 80, bloom: 16, halo: 60 },
  arc: { turns: 0.40, radius: 980, length: 30, top: 640, bandWidth: 84, pitch: 0.36, roll: 0.0, phase: 1.9, cy: 700, sparkles: 70 },
};
export const material = { // D04/D09; procedural geometry is reconstructed, not measured.
  roomBrightness: 0.36, roomSaturation: 0.60, roomTint: 0.30, foregroundBrightness: 1.02, foregroundContrast: 1.04,
  ribbon: { segments: 280, turns: 1.32, radius: 700, length: 330, top: 395, bandWidth: 108, cx: 560, focal: 1700, cy: 880,
    roll: -0.27, pitch: 0.50, phase: 2.20, strands: 7, sparkles: 110, bloom: 20, halo: 78 },
  orbs: [ // x, y, r, depth blur(px), parallax
    [150, 128, 30, 0, 0.6], [520, 70, 24, 6, 0.4], [968, 760, 62, 0, 1.0], [1014, 1132, 26, 3, 0.8],
    [64, 1196, 36, 10, 1.2], [818, 440, 18, 0, 0.7], [260, 1010, 14, 2, 0.9] ],
};
export const sound = { air: { gainDb: -20 }, glass: { gainDb: -23 }, tap: { gainDb: -20 }, minGap: 0.12 }; // D07
// D04/D09. `glow` lights the room behind the head; `accent2` is the bright half of gradients.
export const palettes = {
  orange: { light: false, ground: '#0a0503', deep: '#2e1206', accent: '#ff7d22', accent2: '#ffb25e', glow: '#ff6a10', rim: '#fff0dc', glass: '#f4ece5', pill: '#f9f2e6', ink: '#21170f', text: '#fff9f2', muted: '#efd6c0', tint: '#5a2408', orb: '#5e4234' },
  violet: { light: false, ground: '#090615', deep: '#20103c', accent: '#a774ff', accent2: '#cfb0ff', glow: '#8b5cff', rim: '#f4e8ff', glass: '#ece6f3', pill: '#f6f2e7', ink: '#171e37', text: '#fffaf2', muted: '#c9c0dc', tint: '#2a1250', orb: '#4d4270' },
  'light-lime': { light: true, ground: '#f1f0e9', deep: '#e3e6ce', accent: '#b6da37', accent2: '#e8f5ac', glow: '#d8ee7a', rim: '#fcfff3', glass: '#fffef8', pill: '#fffef8', ink: '#28311d', text: '#29311e', muted: '#68704b', tint: '#e3e6ce', orb: '#c9cfae' },
};
