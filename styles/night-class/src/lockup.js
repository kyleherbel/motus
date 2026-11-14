// The title lockup (research/type.md T14-T20, hook.md H04-H14, motion.md M05-M09): one or two
// centred lines at the top of the field, bold sans with 1-3 words in the italic serif, a cobalt bar
// behind one line (white text on it) or a cobalt underline under it. It builds in unit by unit, the bar
// wipes in from the left, and it leaves on a cut.
import { CX, F, type, motion, colour, fonts, layout } from './tokens.js';
import { faces, units as toUnits, richWidth, allSerif, parseRich, measureText } from './text.js';
import { ink, setStyle } from './common.js';

/**
 * spec: {
 *   lines: [string, string?]   rich text ("Words *Serif*")
 *   size: number               target sans size (fitted down to fit the column)
 *   capTop: number             cap top of line 1
 *   deco: 'bar'|'underline'|'none', decoLine: 0|1, bar: {padL, padR, padTop, padBottom}
 *   build: 'word'|'type'|'none', start: seconds (first unit), line2: seconds after start
 * }
 */
export function buildLockup(S, spec, mode) {
  const { kit } = S; const { h } = kit;
  const T = type.title;
  const segsOf = spec.lines.filter((l) => l && String(l).trim()).map((l) => parseRich(l));
  // ---- size: the target, fitted so the widest line (with its bar) stays inside the column [T15, L16]
  const maxW = layout.safe.right - layout.safe.left - 6;
  const scaleOf = (k) => (allSerif(spec.lines[k]) && segsOf.length > 1 ? T.allSerifScale : 1);
  const widthAt = (s) => Math.max(...segsOf.map((g, k) => richWidth(kit, g, s * scaleOf(k), T.weight) + (spec.deco === 'bar' && k === spec.decoLine && spec.bar.w === undefined ? spec.bar.padL + spec.bar.padR : 0)));
  let size = spec.size;
  while (size > T.minSize && widthAt(size) > maxW) size -= 1;
  const sizes = segsOf.map((_, k) => size * scaleOf(k));
  // ---- baselines: line 1's cap top is fixed; line 2 sits one lead below [T18]
  const capOf = (s) => s * fonts.sansM.cap;
  const lead = type.titleLead[spec.deco] ?? type.titleLead.none;
  const baselines = [spec.capTop + capOf(sizes[0])];
  if (sizes[1]) baselines.push(baselines[0] + lead * Math.max(...sizes));
  const textInk = ink(mode);

  const el = h('div.nc-lockup', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
  const lines = segsOf.map((segs, k) => {
    const s = sizes[k];
    const f = faces(s, T.weight);
    const us = spec.build === 'type'
      ? segs.flatMap((g) => [...g.text].map((ch) => ({ text: ch, serif: g.serif })))
      : toUnits(segs);
    const w = (u) => measureText(u.text, u.serif ? f.serif : f.sans, u.serif ? T.serifTracking : T.tracking);
    let x = 0;
    for (const u of us) { u.x = x; u.w = w(u); x += u.w; }
    const lineW = x;
    const left = CX - lineW / 2;
    const onBar = spec.deco === 'bar' && k === spec.decoLine;
    const line = h('div', { style: { position: 'absolute', left: `${left}px`, top: '0', width: `${lineW}px`, height: '0' } });
    for (const u of us) {
      const fs = u.serif ? f.serifSize : s; const base = u.serif ? fonts.serifM.base : fonts.sansM.base;
      u.el = h('span', { text: u.text, style: { position: 'absolute', left: `${u.x}px`, top: `${baselines[k] - fs * base}px`, whiteSpace: 'pre',
        font: u.serif ? f.serif.replace(/px /, 'px/1 ') : `${T.weight} ${s}px/1 ${fonts.sans}`, letterSpacing: `${u.serif ? T.serifTracking : T.tracking}em`,
        color: onBar ? colour.onCobalt : textInk, opacity: '0', willChange: 'transform, opacity',
        // a faint dark halo keeps the title readable when a graphic is pushed in behind it (measured -3 to -4 levels
        // 5-16 px from title text on the dark field) [C17]
        textShadow: mode === 'light' || onBar ? 'none' : '0 0 14px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.6)' } });
      line.append(u.el);
    }
    return { k, s, us, line, lineW, left, baseline: baselines[k], capTop: baselines[k] - capOf(s) };
  });

  // ---- decoration
  let deco = null;
  const dl = lines[Math.min(spec.decoLine, lines.length - 1)];
  if (spec.deco === 'bar' && dl) {
    const B = spec.bar;
    // a title bar hugs its text; the call-to-action bar is a fixed plate centred on the line [T17, T23]
    const fixed = B.w !== undefined;
    const w = fixed ? Math.max(B.w, dl.lineW + 40) : dl.lineW + B.padL + B.padR;
    const x = fixed ? CX - w / 2 : dl.left - B.padL;
    const hh = fixed ? B.h : capOf(dl.s) + B.padTop + B.padBottom;
    const y = fixed ? dl.capTop - (B.h - capOf(dl.s)) / 2 - 1.5 : dl.capTop - B.padTop;
    deco = { kind: 'bar', w, el: h('div.nc-bar', { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${hh}px`, borderRadius: `${B.radius ?? type.bar.radius}px`, background: colour.cobalt } }) };
  } else if (spec.deco === 'underline' && dl) {
    const U = type.underline;
    const w = dl.lineW * U.frac;
    deco = { kind: 'underline', w, el: h('div.nc-underline', { style: { position: 'absolute', left: `${CX - w / 2}px`, top: `${dl.baseline + U.gap}px`, width: `${w}px`, height: `${U.h}px`, background: colour.cobalt } }) };
  }
  if (deco) el.append(deco.el);
  for (const l of lines) el.append(l.line);

  // ---- timing
  const M = motion.title;
  const unitStep = spec.build === 'type' ? 1 / M.typeRate : M.unit;
  // line 2 takes the next slot: 3 frames after line 1's last unit [H10, M05; verified]
  const lineStart = (k) => spec.start + (k === 0 ? 0 : Math.max(0, lines[0].us.length - 1) * unitStep + M.line2Gap);
  for (const l of lines) l.us.forEach((u, j) => { u.t = lineStart(l.k) + j * unitStep; });
  const lastUnit = Math.max(...lines.map((l) => l.us[l.us.length - 1]?.t ?? spec.start));
  // the bar wipes in with the first word of its line; the underline a frame after it [H11, H13; verified]
  const decoStart = deco ? Math.max(spec.start, lineStart(dl.k) + (deco.kind === 'bar' ? -M.barLead : M.underlineLag)) : 0;
  const decoDur = deco?.kind === 'bar' ? M.barDur : M.underlineDur;
  const decoE = deco?.kind === 'bar' ? S.E.bar : S.E.underline;
  const instant = spec.build === 'none';
  const slide = spec.build === 'word';

  return {
    el, sizes, baselines,
    /** When the lockup is complete. */
    doneAt: instant ? spec.start : Math.max(lastUnit + M.unitDur, decoStart + decoDur),
    seek(t, settled = false) {
      const all = settled || instant;
      for (const l of lines) {
        // each unit slides in from the right to its final place with its opacity on the same curve; the line
        // itself never moves [M07; verified]. A typed title only fades its letters in.
        for (const u of l.us) {
          const on = all || t >= u.t;
          const e = all ? 1 : on ? S.E.titleUnit(kit.clamp((t - u.t) / M.unitDur)) : 0;
          setStyle(u.el, 'opacity', on ? String(Math.min(1, e)) : '0');
          const dx = slide && on ? M.unitDx * (1 - e) : 0;
          setStyle(u.el, 'transform', dx > 0.05 ? `translateX(${dx.toFixed(2)}px)` : 'none');
        }
      }
      if (deco) {
        const p = all ? 1 : decoE(kit.clamp((t - decoStart) / decoDur));
        setStyle(deco.el, 'display', p > 0 ? '' : 'none');
        setStyle(deco.el, 'clipPath', p >= 1 ? 'none' : `inset(0 ${(deco.w * (1 - p)).toFixed(2)}px 0 0)`);
      }
    },
  };
}
