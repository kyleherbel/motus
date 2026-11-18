// The opening headline (research/hook.md H06-H18; type.md T13-T19; motion.md M06-M13).
//
// One to three lines of heavy extended capitals, white, centred, each line scaled to the same width, the block's
// bottom just above the seam, over the opening footage [H06-H08, T13-T15]. It frames the stakes or the category
// ("THE FUTURE of X", a drama noun, a news headline); it is not a line of the transcript [H14].
//   kicker      a small italic line above the block (GOOGLE'S) [T17]
//   connector   a small italic serif word tucked in front of the second line ("of", "the") [T16]
//   exit        "slide": the lines keep moving the way they came and leave over the last 15 frames of the shot;
//               "cut": the block goes with the hard cut to the next layout [H12, M12]
// Each line slides in from off frame, the first from the left and the next from the right, on one curve over
// 18.6 frames, with horizontal motion blur, no overshoot; then it holds dead still [M06-M11]. The caption keeps
// running on the seam underneath [H08].
import { W, CX, layout, fonts, colour, motion, type } from '../tokens.js';
import { setStyle, bez } from '../common.js';

// Archivo at the reference cap is 2-14 % narrower than the reference face: +0.05 em letter-spacing and wider word
// spaces bring it back; the padding balances the space letter-spacing leaves after the last letter [verified]
const HEAVY = { fontFamily: fonts.heavy, fontWeight: '900', fontStretch: '125%', fontVariationSettings: `'wdth' ${fonts.heavyAxes.wdth}, 'wght' ${fonts.heavyAxes.wght}`,
  letterSpacing: `${type.headline.tracking}em`, wordSpacing: `${type.headline.wordSpacing}em`, paddingLeft: `${type.headline.tracking}em` };

/** Width of `text` at 100 px in the heavy face, measured in the DOM (the canvas cannot set the width axis). */
function widthAt100(h, text, style) {
  const probe = h('span', { text, style: { position: 'absolute', left: '-9999px', top: '0', whiteSpace: 'pre', fontSize: '100px', lineHeight: '1', ...style } });
  document.body.append(probe);
  const w = probe.getBoundingClientRect().width;
  probe.remove();
  return w || text.length * 80;
}

let blurN = 0;
const ARCHIVO_BASE = (1 + 0.878 - 0.21) / 2;

export default {
  type: 'headline',
  label: 'Opening headline',
  slots: ['title'],
  params: {
    lines: { type: 'array', min: 1, max: 3, of: { type: 'string', maxChars: 18 } },   // the main lines, all one width
    lead: { type: 'string', optional: true, maxChars: 20 },        // a smaller heavy line above them ("THE FUTURE")
    connector: { type: 'string', optional: true, maxChars: 8 },    // a small italic serif word after the lead, or after the first line ("of")
    kicker: { type: 'string', optional: true, maxChars: 24 },      // an italic condensed line on top ("GOOGLE'S")
    exit: 'enum:slide|cut?',
  },
  beats: {},
  build(ctx) {
    const { S, params, tIn, tOut } = ctx;
    const { h } = S.kit;
    const L = layout.headline, T = type.headline;
    const lines = params.lines.map((s) => String(s).toUpperCase());
    // every main line fits the block width; a short line would grow past the measured cap range, so it stops at
    // the largest cap measured [T14]
    const maxSize = T.maxCap / fonts.heavyCapPerEm;
    const sizes = lines.map((s) => Math.min(maxSize, (L.width * 100) / widthAt100(h, s, HEAVY)));
    const caps = sizes.map((z) => z * fonts.heavyCapPerEm);
    // stack bottom-up from the block's bottom edge: baselines, cap tops
    const rows = [];
    let base = L.bottom;
    // the gap between lines is about 0.24 of the smaller cap (6-24 px) [verified]
    const gapAbove = (k, capAbove) => T.gapRatio * Math.min(caps[k], capAbove);
    for (let k = lines.length - 1; k >= 0; k--) {
      rows[k] = { base, cap: caps[k], size: sizes[k], w: (sizes[k] * widthAt100(h, lines[k], HEAVY)) / 100 };
      base -= caps[k] + gapAbove(k, k > 0 ? caps[k - 1] : caps[k]);
    }
    const lead = params.lead ? String(params.lead).toUpperCase() : null;
    const leadCap = Math.min(T.leadCap[1], Math.max(T.leadCap[0], caps[0] * T.leadRatio));
    const leadRow = lead ? { base, cap: leadCap, size: leadCap / fonts.heavyCapPerEm } : null;
    if (leadRow) { leadRow.w = (leadRow.size * widthAt100(h, lead, HEAVY)) / 100; base -= leadRow.cap + T.gapRatio * leadRow.cap; }
    const kick = params.kicker ? String(params.kicker).toUpperCase() : null;
    const kickSize = kick ? Math.max(30, (caps[0] * T.kickerRatio) / fonts.heavyCapPerEm) : 0;
    const el = h('div.sl-headline', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: '1920px', pointerEvents: 'none' } });
    const NS = 'http://www.w3.org/2000/svg';
    const ease = bez(S.kit, motion.titleIn.bezier);
    const M = motion.titleIn;

    const items = [];
    const line = (text, style, size, baseY, k) => {
      const id = `sl-hblur-${++blurN}`;
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
      const f = document.createElementNS(NS, 'filter');
      f.setAttribute('id', id); f.setAttribute('x', '-50%'); f.setAttribute('width', '200%');
      const gb = document.createElementNS(NS, 'feGaussianBlur'); gb.setAttribute('stdDeviation', '0 0');
      f.append(gb); svg.append(f); el.append(svg);
      // in a one-em line box the baseline sits at half the leading plus the ascent: (1 + 0.878 - 0.21) / 2 em for Archivo
      const node = h('div', { text, style: { position: 'absolute', left: '0', width: `${W}px`, top: `${(baseY - size * ARCHIVO_BASE).toFixed(2)}px`, height: `${size}px`,
        fontSize: `${size.toFixed(2)}px`, lineHeight: `${size.toFixed(2)}px`, textAlign: 'center', whiteSpace: 'pre', color: colour.white, ...style } });
      el.append(node);
      const dir = k % 2 === 0 ? -1 : 1;     // the first line from the left, the next from the right [M08]
      items.push({ node, gb, id, dir, blurOn: false });
    };
    // the lines in reading order alternate sides: the first from the left [M08]
    let n = 0;
    if (kick) line(kick, { ...HEAVY, fontStretch: '62%', fontVariationSettings: "'wdth' 62, 'wght' 800", fontStyle: 'oblique 10deg' }, kickSize, base, n++);
    if (lead) line(lead, HEAVY, leadRow.size, leadRow.base, n++);
    lines.forEach((s, k) => line(s, HEAVY, rows[k].size, rows[k].base, n++));
    if (params.connector) {
      // the connector hangs off the right end of the lead (or the first line), its x-height near the line's cap top,
      // at about 0.6 of that line's cap height [T16, read on clip13@36, clip16@48]
      const r = leadRow || rows[0];
      const cs = Math.max(30, (r.cap * T.connectorRatio) / fonts.serifCapPerEm);
      const node = h('div', { text: String(params.connector), style: { position: 'absolute', left: `${(CX + r.w / 2 + cs * 0.12).toFixed(2)}px`, top: `${(r.base - r.cap - cs * 0.18).toFixed(2)}px`,
        font: `italic 400 ${cs.toFixed(1)}px/1 ${fonts.serif}`, color: colour.white, whiteSpace: 'pre' } });
      el.append(node);
      items.push({ node, gb: null, dir: 1, blurOn: false, connector: true });
    }
    const exit = params.exit || 'slide';
    const O = motion.titleOut;
    const easeOut = bez(S.kit, O.bezier);
    // it leaves at the first layout change, which the reference makes 2.4 to 4.5 s in; a longer first shot still loses it by then [H12, H13]
    const end = Math.min(tOut, tIn + motion.titleMax);
    const outStart = end - O.dur;
    const pos = (t, it) => {
      const a = t - tIn - M.start;
      let x = it.dir * M.travel * (1 - ease(Math.min(1, Math.max(0, a / M.dur))));
      if (exit === 'slide' && t > outStart) { const q = Math.min(1, (t - outStart) / O.dur); x += -it.dir * M.travel * easeOut(q); }
      return x;
    };
    const FR = 1 / S.doc.fps;
    return {
      el,
      seek(t) {
        setStyle(el, 'display', t < end ? '' : 'none');
        for (const it of items) {
          if (it.connector) {
            // the connector word blurs in where it sits as the lines settle and leaves with them (by eye) [M13]
            const settle = tIn + M.start + M.dur;
            const b = Math.max(0, 1 - (t - (settle - motion.titleIn.dur * 0.27)) / (motion.titleIn.dur * 0.27));
            const gone = exit === 'slide' && t > outStart;
            setStyle(it.node, 'opacity', gone ? '0' : t < settle - motion.titleIn.dur * 0.27 ? '0' : '1');
            setStyle(it.node, 'filter', b > 0.02 && !gone ? `blur(${(b * 12).toFixed(2)}px)` : '');
            continue;
          }
          const x = pos(t, it), v = Math.abs(x - pos(t - FR, it));
          setStyle(it.node, 'transform', Math.abs(x) > 0.05 ? `translateX(${x.toFixed(2)}px)` : '');
          const sd = (v * motion.blurShutter) / 3.46;
          if (sd > 0.3) { it.gb.setAttribute('stdDeviation', `${sd.toFixed(2)} 0`); if (!it.blurOn) { setStyle(it.node, 'filter', `url(#${it.id})`); it.blurOn = true; } }
          else if (it.blurOn) { setStyle(it.node, 'filter', ''); it.blurOn = false; }
        }
      },
    };
  },
};
