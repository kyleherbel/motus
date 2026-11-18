// The big word over the face (research/type.md T20, T21; colour.md C05; verification.md).
//
// The style never styles a word inside a caption. To stress a word it cuts to the full-frame face and replaces
// the caption with the word itself, big: heavy white capitals (the headline face), a light italic serif, or the
// heavy face in lime or yellow [T20]. One or two lines, centred over the chest (y 1118), about 500 px wide, for 18
// frames from the word it shows (`show` beat; default the shot's first word); the running caption is off meanwhile
// [verified]. Use it on the one word of a sentence that carries it ("FLAWLESS.",
// "THAT'S RIGHT"), on a short reaction, or on the ask ("COMMENT" / "BUILD") [T20, T22].
import { W, F, fonts, colour, type } from '../tokens.js';
import { setStyle } from '../common.js';

const HEAVY = { fontFamily: fonts.heavy, fontWeight: '900', fontStretch: '125%', fontVariationSettings: `'wdth' ${fonts.heavyAxes.wdth}, 'wght' ${fonts.heavyAxes.wght}`,
  letterSpacing: `${type.headline.tracking}em`, wordSpacing: `${type.headline.wordSpacing}em`, paddingLeft: `${type.headline.tracking}em` };

function widthAt100(h, text, style) {
  const probe = h('span', { text, style: { position: 'absolute', left: '-9999px', top: '0', whiteSpace: 'pre', fontSize: '100px', lineHeight: '1', ...style } });
  document.body.append(probe);
  const w = probe.getBoundingClientRect().width;
  probe.remove();
  return w || text.length * 80;
}

export default {
  type: 'big-word',
  label: 'Big word',
  slots: ['word'],
  params: {
    lines: { type: 'array', min: 1, max: 2, of: { type: 'string', maxChars: 14 } },
    look: 'enum:heavy|serif|lime|yellow?',
  },
  beats: { show: {} },
  build(ctx) {
    const { S, params, beats, tIn, tOut } = ctx;
    const { h } = S.kit;
    const B = type.bigWord;
    const look = params.look || 'heavy';
    const serif = look === 'serif';
    const fill = look === 'lime' ? colour.lime : look === 'yellow' ? colour.yellow : colour.white;
    const lines = params.lines.map((s) => (serif ? String(s) : String(s).toUpperCase()));
    const style = serif ? { fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: '400' } : HEAVY;
    const capPerEm = serif ? fonts.serifCapPerEm : fonts.heavyCapPerEm;
    const asc = serif ? (1 + 0.99 - 0.31) / 2 : (1 + 0.878 - 0.21) / 2;   // the baseline in a one-em line box
    // heavy: every line fills the measured width; serif: a fixed cap height [T20]
    const sizes = lines.map((s) => (serif ? B.serifCap / capPerEm : Math.min(B.maxCap, Math.max(B.minCap, (B.width * 100 * capPerEm) / widthAt100(h, s, style))) / capPerEm));
    const caps = sizes.map((z) => z * capPerEm);
    const total = caps.reduce((a, b) => a + b, 0) + B.gap * (lines.length - 1);
    let base = B.cy + total / 2;
    const rows = [];
    for (let k = lines.length - 1; k >= 0; k--) { rows[k] = base; base -= caps[k] + B.gap; }
    const el = h('div.sl-bigword', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: '1920px', pointerEvents: 'none' } });
    lines.forEach((s, k) => {
      el.append(h('div', { text: s, style: { position: 'absolute', left: '0', width: `${W}px`, top: `${(rows[k] - sizes[k] * asc).toFixed(2)}px`, height: `${sizes[k].toFixed(2)}px`,
        fontSize: `${sizes[k].toFixed(2)}px`, lineHeight: `${sizes[k].toFixed(2)}px`, textAlign: 'center', whiteSpace: 'pre', color: fill, textShadow: colour.bigWordShadow, ...style } }));
    });
    const t0 = (beats.find((b) => b.do === 'show') || { t: tIn }).t;
    const span = [Math.max(tIn, t0 - F(1)), Math.min(tOut, Math.max(t0, tIn) + B.hold)];
    return {
      el,
      seek(t) { setStyle(el, 'display', t >= span[0] && t < span[1] ? '' : 'none'); },
      hideCaptions: [span],
    };
  },
};
