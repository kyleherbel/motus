// The white interstitial's heading: a dark sans line with an italic serif word in an
// accent block under it ("Repo Number" + "One"), or the block alone as a strip
// ("It's Called"). Timeline after the cut (research/motion.md): heading words at
// frames 1 and 3, block wipes in from frame 5 over 15 frames, its word at frame 8.
import { CX, layout, type, fonts, motion, halving } from '../tokens.js';

export default {
  type: 'section-heading',
  label: 'Section heading',
  slots: ['heading'],
  params: {
    line: { type: 'string', optional: true, maxChars: 16, maxWords: 3 },     // "Repo Number"; omit for the strip-only form
    block: { type: 'string', maxChars: 14, maxWords: 3 },                    // "One", "It's Called"
  },
  beats: {},

  build(ctx) {
    const { S, params, tIn } = ctx; const { kit, C } = S; const { h } = kit;
    const Wt = layout.white, M = motion.heading, Mt = motion.title;
    const el = h('div.ep-heading', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
    let spans = [];
    if (params.line) {
      const size = type.heading.size;
      const line = h('div', { style: { position: 'absolute', left: `${CX}px`, top: `${Wt.heading.baseline - size * type.ascent.sans}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap', font: `${type.heading.weight} ${size}px/1 ${fonts.sans}`, letterSpacing: `${type.heading.tracking}em`, color: C.ink } });
      const ws = params.line.trim().split(/\s+/);
      spans = ws.map((w, k) => { const s = h('span', { text: w, style: { display: 'inline-block', marginRight: k < ws.length - 1 ? '0.24em' : '0' } }); line.append(s); return s; });
      el.append(line);
    }
    const stripOnly = !params.line;
    const y = stripOnly ? Wt.strip.y : Wt.block.y, hh = stripOnly ? Wt.strip.h : Wt.block.h;
    const font2 = (s) => `italic ${type.block.weight} ${s}px ${fonts.serif}`;
    const size2 = kit.fitSize(params.block, 760, font2, type.block.size, 70, type.block.tracking);
    const tw = kit.measure(params.block, font2(size2), type.block.tracking * size2);
    const bw = Math.round(tw + Wt.block.padX * 2 + size2 * 0.08);
    const bx = Math.round(CX - bw / 2);
    const text = h('div', { text: params.block, style: { position: 'absolute', left: '0', width: `${bw}px`, textAlign: 'center', top: `${hh - 28 - size2 * type.ascent.serif}px`, font: `italic ${type.block.weight} ${size2}px/1 ${fonts.serif}`, letterSpacing: `${type.block.tracking}em`, color: C.onAccent || '#FCFBFC', whiteSpace: 'nowrap' } });
    const block = h('div', { style: { position: 'absolute', left: `${bx}px`, top: `${y}px`, width: `${bw}px`, height: `${hh}px`, borderRadius: `${Wt.block.radius}px`, background: C.accent, overflow: 'hidden' } }, text);
    const shadow = h('div', { style: { position: 'absolute', left: `${bx}px`, top: `${y}px`, width: `${bw}px`, height: `${hh}px`, borderRadius: `${Wt.block.radius}px`, boxShadow: '0 14px 24px rgba(0,70,190,0.24)' } });
    el.append(shadow, block);
    const w1 = (k) => tIn + M.word1 + k * M.stagger;
    const blockAt = tIn + M.stripAt, wordAt = tIn + M.stripWord;
    return {
      el,
      seek(t) {
        spans.forEach((s, k) => {
          const t0 = w1(k);
          s.style.visibility = t >= t0 ? 'visible' : 'hidden';
          if (t < t0) return;
          const decay = halving(t, t0, Mt.half);
          s.style.opacity = String(kit.prog(t, t0, Mt.fade1, kit.ease.outCubic));
          s.style.transform = `translateY(${(Mt.rise1 * decay).toFixed(2)}px)`;
          s.style.filter = Mt.blur1 * decay > 0.25 ? `blur(${(Mt.blur1 * decay).toFixed(2)}px)` : 'none';
        });
        const p = S.E.emph(kit.clamp((t - blockAt) / M.stripDur));
        const vis = t >= blockAt;
        block.style.display = vis ? '' : 'none'; shadow.style.display = vis ? '' : 'none';
        block.style.clipPath = `inset(0 ${(bw * (1 - p)).toFixed(2)}px 0 0 round ${Wt.block.radius}px)`;
        shadow.style.clipPath = `inset(-40px ${(bw * (1 - p)).toFixed(2)}px -40px 0)`;
        shadow.style.opacity = String(p);
        const decay = halving(t, wordAt, Mt.half);
        text.style.visibility = t >= wordAt ? 'visible' : 'hidden';
        text.style.opacity = String(kit.prog(t, wordAt, Mt.fade2, kit.ease.outExpo));
        text.style.transform = `translateY(${(Mt.rise2 * decay).toFixed(2)}px)`;
        text.style.filter = Mt.blur2 * decay > 0.25 ? `blur(${(Mt.blur2 * decay).toFixed(2)}px)` : 'none';
      },
    };
  },
};
