// The list, the style's workhorse: 31 % of graphic time, 42 % in the newest generation
// (research/graphics.md G07, G08, G09, G25; motion.md M12; verified). Three looks:
//   rows   glossy dark-grey rounded rows (117 px tall, ~660 wide, 165 px pitch) with a glowing cobalt tab at the
//          rounded left end, a white zero-padded index and a Title Case label [G08]
//   chips  near-black rows with a thin white outline and a wide cobalt tab, label centred [G09]
//   list   no boxes: big white indexes and labels, and one glossy highlight box with a cobalt tab that steps down
//          to the row being said (it grows in from ~0.82 of its width the first time) [G08; verified]
// Reveal: 'stack' rows join one by one as they are said and the block stays centred, so the rows already there
// move up (the commonest move in the style) [M12]; 'blur' the whole list is there from the start and each
// label sharpens as it is said, unspoken labels blurred [G08]. A list is 'blur' by default.
import { CX, F, type, colour, fonts, motion } from '../tokens.js';
import { ENTER, CAMERA_BEATS, centred, entrance, riseIn, setStyle } from '../common.js';
import { measureText } from '../text.js';

// TOKENS (research/graphics.md G08, G09; colour.md C16, C20, C28; verified)
const G = {
  rows: { h: 117, gap: 48, minW: 592, maxW: 760, radius: 8, tab: 12, indexX: 34, labelX: 112, padR: 36,
    fill: 'linear-gradient(180deg, #3D3D3E 0%, #333334 46%, #2C2C2D 100%)', gloss: 'inset 0 1.5px 0 rgba(255,255,255,0.13), inset 0 -1px 0 rgba(0,0,0,0.5)',
    tabGlow: '0 0 16px rgba(22,76,225,0.75), 0 0 4px rgba(76,123,255,0.6)', label: 36, index: 44 },
  chips: { h: 104, gap: 34, minW: 560, maxW: 660, radius: 12, tab: 22, padX: 40, fill: 'linear-gradient(180deg, #1A1A1B 0%, #101011 100%)',
    stroke: 'inset 0 0 0 2px rgba(255,255,255,0.88)', glow: '0 0 14px rgba(255,255,255,0.16)', tabColour: '#1547D2', label: 34 },
  list: { pitch: 112, index: 56, label: 38, gap: 26, box: { h: 96, padL: 22, padR: 34, radius: 6, tab: 12,
    fill: 'linear-gradient(180deg, #4A4A4B 0%, #3A3A3B 50%, #2F2F30 100%)', gloss: 'inset 0 1.5px 0 rgba(255,255,255,0.18)', from: 0.82, move: 0.38 },
    idleIndex: 'rgba(254,254,254,0.92)', activeScale: 1.1 },
  blur: 7,                            // an unspoken row blurs its label only [G08; verified]
  enterDy: 120,                       // a joining row rises into its place (slides ~200 px measured) [M11; verified]
  stagger: F(2),                      // a list's rows arrive 2 frames apart when it enters
};

export default {
  type: 'step-rows',
  label: 'Steps',
  slots: ['graphic'],
  params: {
    rows: { type: 'array', min: 2, max: 6, of: { label: { type: 'string', maxChars: 34, maxWords: 6 }, at: 'word?' } },
    variant: 'enum?:rows|chips|list',     // default rows
    reveal: 'enum?:stack|blur',           // default stack (blur for list)
    numbered: 'boolean?',                 // default true for rows and list
    ...ENTER,
  },
  beats: { ...CAMERA_BEATS },

  build(ctx) {
    const { S, params: p, tIn } = ctx; const { kit } = S; const { h } = kit;
    const variant = p.variant || 'rows';
    const chips = variant === 'chips', list = variant === 'list';
    const Gv = G[variant];
    const numbered = !chips && p.numbered !== false;
    const reveal = p.reveal || (list ? 'blur' : 'stack');
    const n = p.rows.length;
    const font = (s) => `800 ${s}px ${fonts.sans}`;
    const longest = Math.max(...p.rows.map((r) => measureText(r.label, font(Gv.label), -0.01)));
    const indexW = numbered ? measureText('00', font(list ? Gv.index : Gv.index || 44), -0.01) : 0;
    let w, pitch, rowH;
    if (list) { w = Math.round(indexW + Gv.gap + longest); pitch = Gv.pitch; rowH = Gv.box.h; }
    else { w = Math.round(Math.min(Gv.maxW, Math.max(Gv.minW, chips ? longest + Gv.padX * 2 + Gv.tab : Gv.labelX + longest + Gv.padR))); pitch = Gv.h + Gv.gap; rowH = Gv.h; }
    const blockH = (n - 1) * pitch + rowH;
    const box = centred(w, blockH);
    const { settled } = entrance(ctx);

    // when each row is said: its word, or one after another from the start
    const times = p.rows.map((r, k) => (r.at !== undefined ? S.wordTime(r.at) : tIn + (reveal === 'stack' ? k * F(6) : 0.4 + k * 0.6)));
    times.forEach((t, k) => { if (k && t < times[k - 1]) times[k] = times[k - 1]; });

    const root = h('div.nc-rows', { style: { position: 'absolute', left: `${box.x}px`, top: '0', width: `${w}px`, height: '1px' } });

    // the list's highlight box sits under the rows
    let hl = null;
    if (list) {
      const B = Gv.box;
      hl = h('div.nc-hl', { style: { position: 'absolute', left: `${-B.padL}px`, top: '0', width: `${w + B.padL + B.padR}px`, height: `${B.h}px`, borderRadius: `${B.radius}px`, background: B.fill, boxShadow: B.gloss, overflow: 'hidden', transformOrigin: '0 50%', display: 'none' } },
        h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${B.tab}px`, height: '100%', background: colour.cobalt, boxShadow: G.rows.tabGlow } }));
      root.append(hl);
    }

    const rows = p.rows.map((r, k) => {
      let label, index = null, el;
      if (list) {
        index = h('div', { text: String(k + 1).padStart(2, '0'), style: { position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', transformOrigin: '0 50%', font: `800 ${Gv.index}px/1 ${fonts.sans}`, letterSpacing: '-0.02em', color: G.list.idleIndex } });
        label = h('div', { text: r.label, style: { position: 'absolute', left: `${indexW + Gv.gap}px`, top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap', font: `800 ${Gv.label}px/1 ${fonts.sans}`, letterSpacing: '-0.015em', color: colour.ink.dark } });
        el = h('div.nc-row', { style: { position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${rowH}px`, willChange: 'transform, opacity' } }, index, label);
      } else {
        const room = chips ? w - Gv.tab - Gv.padX * 2 : w - Gv.labelX - Gv.padR;
        let fs = Gv.label; while (fs > 24 && measureText(r.label, font(fs), -0.01) > room) fs -= 1;
        label = h('div', { text: r.label, style: { position: 'absolute', top: '50%', transform: chips ? 'translate(-50%, -50%)' : 'translateY(-50%)', left: chips ? `${Gv.tab + (w - Gv.tab) / 2}px` : `${Gv.labelX}px`,
          whiteSpace: 'nowrap', font: `800 ${fs}px/1 ${fonts.sans}`, letterSpacing: '-0.01em', color: colour.ink.dark } });
        const kids = [label];
        if (numbered) { index = h('div', { text: String(k + 1).padStart(2, '0'), style: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: `${Gv.indexX}px`, font: `800 ${Gv.index}px/1 ${fonts.sans}`, letterSpacing: '-0.02em', color: colour.ink.dark } }); kids.unshift(index); }
        const tab = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${Gv.tab}px`, height: '100%', background: chips ? Gv.tabColour : colour.cobalt, boxShadow: chips ? 'none' : Gv.tabGlow } });
        const face = h('div', { style: { position: 'absolute', inset: '0', borderRadius: `${Gv.radius}px`, overflow: 'hidden', background: Gv.fill, boxShadow: chips ? Gv.stroke : Gv.gloss } }, tab, ...kids);
        el = h('div.nc-row', { style: { position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${rowH}px`, borderRadius: `${Gv.radius}px`, boxShadow: chips ? Gv.glow : '0 6px 18px rgba(0,0,0,0.45)', willChange: 'transform, opacity' } }, face);
        if (chips) face.append(h('div', { style: { position: 'absolute', inset: '0', borderRadius: `${Gv.radius}px`, boxShadow: Gv.stroke, pointerEvents: 'none' } }));
      }
      root.append(el);
      return { el, label, index, k };
    });

    const ticks = reveal === 'blur' ? times.filter((t) => t > tIn + 0.05) : times.slice(1);
    const currentAt = (t) => { let c = -1; for (let k = 0; k < n; k++) if (t >= times[k]) c = k; return c; };
    return {
      el: root, ticks, box: { x: box.x, y: box.y, w, h: blockH },
      seek(t) {
        // stack: the visible block stays centred, rows already there move up as a new one joins [M12]
        let shown = 0;
        if (reveal === 'stack') for (let k = 0; k < n; k++) shown += settled && times[k] <= tIn ? 1 : t >= times[k] ? S.E.house(kit.clamp((t - times[k]) / motion.rows.dur)) : 0;
        const visH = reveal === 'stack' ? Math.max(0, shown - 1) * pitch + rowH : blockH;
        const top0 = box.y + (blockH - visH) / 2;
        const cur = currentAt(t);
        rows.forEach((r, k) => {
          const t0 = times[k];
          const on = reveal === 'blur' || t >= t0 || (settled && t0 <= tIn);
          setStyle(r.el, 'display', on ? '' : 'none');
          if (!on) return;
          let y = top0 + k * pitch, o = 1;
          if (reveal === 'stack' && !(settled && t0 <= tIn)) {
            const q = S.E.house(kit.clamp((t - t0) / motion.rows.dur));
            y += G.enterDy * (1 - q); o = Math.min(1, (t - t0) / F(5));
          } else if (reveal === 'blur') {
            // the list enters row by row, 2 frames apart, rising into place
            const e = riseIn(S, t, tIn + k * G.stagger, settled, G.enterDy);
            y += e.dy; o = e.o;
          }
          setStyle(r.el, 'transform', `translateY(${y.toFixed(2)}px)`);
          setStyle(r.el, 'opacity', String(Math.max(0, Math.min(1, o))));
          if (reveal === 'blur') setStyle(r.label, 'filter', t >= t0 ? 'none' : `blur(${G.blur}px)`);
          if (list && r.index) setStyle(r.index, 'transform', `translateY(-50%) scale(${k === cur ? G.list.activeScale : 1})`);
        });
        if (hl) {
          // the highlight box: grows in under the first row said, then steps down row by row
          if (cur < 0) { setStyle(hl, 'display', 'none'); return; }
          setStyle(hl, 'display', '');
          const B = Gv.box;
          const yOf = (k) => top0 + k * pitch + (rowH - B.h) / 2;
          let y = yOf(cur), sx = 1;
          if (cur > 0 && t - times[cur] < B.move) y = yOf(cur - 1) + (yOf(cur) - yOf(cur - 1)) * S.E.house(kit.clamp((t - times[cur]) / B.move));
          if (cur === 0) { sx = B.from + (1 - B.from) * S.E.slide(kit.clamp((t - times[0]) / 0.6)); }
          setStyle(hl, 'transform', `translateY(${y.toFixed(2)}px) scaleX(${sx.toFixed(4)})`);
        }
      },
    };
  },
};
