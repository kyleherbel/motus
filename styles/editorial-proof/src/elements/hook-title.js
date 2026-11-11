// The opening title: line 1 in dark sans, line 2 in white italic serif on the accent
// strip (research/hook.md, research/motion.md). Build, measured over 28 reels:
//   line 1 words every 2.5 frames from frame 0: fade 12 frames, rise from 32 px below, halving each frame
//   strip wipes in from frame 4 over 15 frames, left edge fixed
//   strip words from frame 8, every 3 frames; a shine crosses the strip at frames 23-29
import { CX, layout, type, fonts, motion, halving, F } from '../tokens.js';

export default {
  type: 'hook-title',
  label: 'Hook title',
  slots: ['title'],
  params: {
    line1: { type: 'string', maxChars: 22, maxWords: 4 },
    strip: { type: 'string', maxChars: 20, maxWords: 4 },
    exit: 'enum?:cut|wipe',            // cut: hold until the layout changes (default). wipe: the strip wipes off just before.
  },
  beats: {},

  build(ctx) {
    const { S, params, tIn, tOut } = ctx; const { kit, C } = S; const { h } = kit;
    const T = layout.title, M = motion.title;
    const el = h('div.ep-title', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });

    // ---- line 1
    const font1 = (s) => `${type.title.weight} ${s}px ${fonts.sans}`;
    const size1 = kit.fitSize(params.line1, layout.safe.right - layout.safe.left - 24, font1, type.title.size, 60, type.title.tracking);
    const words1 = params.line1.trim().split(/\s+/);
    const line1 = h('div', { style: { position: 'absolute', left: `${CX}px`, top: `${T.baseline - size1 * type.ascent.sans}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap', font: `${type.title.weight} ${size1}px/1 ${fonts.sans}`, letterSpacing: `${type.title.tracking}em`, color: type.title.colour } });
    const spans1 = words1.map((w, k) => { const s = h('span', { text: w, style: { display: 'inline-block', marginRight: k < words1.length - 1 ? '0.24em' : '0', willChange: 'transform, opacity, filter' } }); line1.append(s); return s; });

    // ---- strip: hugs the text, centred, never wider than the safe column
    const font2 = (s) => `italic ${type.strip.weight} ${s}px ${fonts.serif}`;
    const maxStripW = layout.safe.right - layout.safe.left;
    const size2 = kit.fitSize(params.strip, maxStripW - T.strip.padX * 2 - 10, font2, type.strip.size, 70, type.strip.tracking);
    const textW = kit.measure(params.strip, font2(size2), type.strip.tracking * size2);
    const stripW = Math.round(textW + T.strip.padX * 2 + size2 * 0.08);
    const stripX = Math.round(CX - stripW / 2);
    const words2 = params.strip.trim().split(/\s+/);
    const onAccent = C.onAccent || '#FCFBFC';
    const strip = h('div', { style: { position: 'absolute', left: `${stripX}px`, top: `${T.strip.y}px`, width: `${stripW}px`, height: `${T.strip.h}px`, borderRadius: `${T.strip.radius}px`, background: C.accent, overflow: 'hidden' } });
    const shadow = h('div', { style: { position: 'absolute', left: `${stripX}px`, top: `${T.strip.y}px`, width: `${stripW}px`, height: `${T.strip.h}px`, borderRadius: `${T.strip.radius}px`, boxShadow: '0 12px 22px rgba(0,60,160,0.20)' } });
    const baselineY = T.strip.h - T.strip.baselineFromBottom;
    const inner = h('div', { style: { position: 'absolute', left: `${T.strip.padX}px`, top: `${baselineY - size2 * type.ascent.serif}px`, whiteSpace: 'nowrap', font: `italic ${type.strip.weight} ${size2}px/1 ${fonts.serif}`, letterSpacing: `${type.strip.tracking}em`, color: onAccent } });
    const spans2 = words2.map((w, k) => { const s = h('span', { text: w, style: { display: 'inline-block', marginRight: k < words2.length - 1 ? '0.22em' : '0', willChange: 'transform, opacity, filter' } }); inner.append(s); return s; });
    const shine = h('div', { style: { position: 'absolute', top: '0', left: '0', width: `${Math.round(stripW * 0.22)}px`, height: `${T.strip.h}px`, background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0) 100%)', mixBlendMode: 'screen', display: 'none' } });
    strip.append(inner, shine);
    el.append(line1, shadow, strip);

    const w1 = (k) => tIn + k * M.stagger1;
    const w2 = (k) => tIn + M.word2At + k * M.stagger2;
    const stripAt = tIn + M.stripAt;
    const wipes = params.exit === 'wipe';
    const outAt = tOut - M.outDur - F(1);

    return {
      el,
      seek(t) {
        const q = wipes ? S.E.emph(kit.clamp((t - outAt) / M.outDur)) : 0;
        spans1.forEach((s, k) => {
          const t0 = w1(k);
          s.style.visibility = t >= t0 ? 'visible' : 'hidden';
          if (t < t0) return;
          const decay = halving(t, t0, M.half);
          let o = kit.prog(t, t0, M.fade1, kit.ease.outCubic), dy = M.rise1 * decay, blur = M.blur1 * decay;
          if (wipes) {                                                   // words lift away just before the strip goes
            const x0 = outAt - F(2) + k * M.wordOutStagger;
            const xo = kit.prog(t, x0, M.wordOut, kit.ease.linear);
            o *= 1 - xo; dy += M.wordOutRise * S.E.emph(kit.clamp((t - x0) / F(10))); blur += 7 * xo;
          }
          s.style.opacity = String(o);
          s.style.transform = Math.abs(dy) > 0.05 ? `translateY(${dy.toFixed(2)}px)` : 'none';
          s.style.filter = blur > 0.25 ? `blur(${blur.toFixed(2)}px)` : 'none';
        });
        // the strip: right edge grows from the left edge; on exit the left edge follows it out
        const p = S.E.emph(kit.clamp((t - stripAt) / M.stripDur));
        const right = stripW * (1 - p), left = stripW * q;
        const vis = t >= stripAt && q < 1;
        strip.style.display = vis ? '' : 'none'; shadow.style.display = vis ? '' : 'none';
        strip.style.clipPath = `inset(0 ${right.toFixed(2)}px 0 ${left.toFixed(2)}px round ${T.strip.radius}px)`;
        shadow.style.clipPath = `inset(-40px ${right.toFixed(2)}px -40px ${left.toFixed(2)}px)`;
        shadow.style.opacity = String(p);
        spans2.forEach((s, k) => {
          const t0 = w2(k);
          s.style.visibility = t >= t0 ? 'visible' : 'hidden';
          if (t < t0) return;
          const decay = halving(t, t0, M.half);
          s.style.opacity = String(kit.prog(t, t0, M.fade2, kit.ease.outExpo));
          const dy = M.rise2 * decay, blur = M.blur2 * decay;
          s.style.transform = dy > 0.05 ? `translateY(${dy.toFixed(2)}px)` : 'none';
          s.style.filter = blur > 0.25 ? `blur(${blur.toFixed(2)}px)` : 'none';
        });
        const sp = (t - tIn - M.shineAt) / M.shineDur;
        shine.style.display = sp >= 0 && sp <= 1 ? '' : 'none';
        if (sp >= 0 && sp <= 1) shine.style.transform = `translateX(${(-stripW * 0.22 + stripW * 1.22 * kit.ease.outCubic(sp)).toFixed(1)}px)`;
      },
    };
  },
};
