// Before and after, old way and new way, "X instead of Y" as a motion graphic: the old side fills the
// card, then on its word a divider with a round handle slides in from the right edge and wipes the new
// side over it, stopping at the middle so both are seen (research/explain.md: part C DV23 before/after
// wipe, ~10 f ease-out, stopping at ~55 %; X08 the left-behind side greys; X09 arrivals settle).
//   wipe   the divider travels from the right edge to the middle in 12 f on the measured converge curve,
//          the old side slides left to make room as it goes (part A device 6, "the card makes room")
//   pop    the new side's disc pops (0.9 -> 1, 5 f) as the divider lands
//   dim    on its word the old side greys to 45 % and a small cross badge pops on its disc
//   full   on its word the divider carries on to the left edge: the new side takes the whole card
import { cardFrame } from '../card.js';
import { fonts, type, F } from '../tokens.js';
import { X, arrive, applyArrive, flyEase, approach, mix } from '../anim.js';
import { glyphSvg, GLYPHS, SOLID } from '../glyphs.js';

// ---- TOKENS (card px, 894 wide)
const G = {
  title: { size: 25, weight: 600, tracking: 0.143, baseline: 58, colour: '#76767A', band: 92 },
  pad: 44,
  disc: { d: 128, glyph: 64, gap: 26 },
  label: { size: 50, min: 32, weight: 700, tracking: -0.02 },
  sub: { size: 29, weight: 500, gap: 8 },
  lines: { n: 3, h: 22, gap: 18, w: [0.78, 0.92, 0.6], top: 34, max: 300 },
  before: { fill: '#F2F2F4', disc: '#E2E2E7', ink: '#6E6E76', line: '#DDDDE2' },
  divider: { w: 5, handle: 76 },
  bottom: 48,
};
const M = { wipe: F(12), lead: F(2), dim: F(6), full: F(14) };

export default {
  type: 'wipe-card',
  label: 'Before / after',
  slots: ['card'],
  params: {
    title: { type: 'string', optional: true, maxChars: 32, maxWords: 5 },
    before: { label: { type: 'string', maxChars: 20 }, sub: { type: 'string', optional: true, maxChars: 28 }, glyph: `enum?:${GLYPHS.join('|')}`, logo: 'asset?' },
    after: { label: { type: 'string', maxChars: 20 }, sub: { type: 'string', optional: true, maxChars: 28 }, glyph: `enum?:${GLYPHS.join('|')}`, logo: 'asset?' },
    at: 'word?',                                  // the new side wipes in on this word (default 8 f after the card lands)
  },
  beats: {
    dim: {},                                      // the old side greys and takes a cross
    full: {},                                     // the new side takes the whole card
  },

  prefer(params) {
    const top = params.title ? G.title.band : G.pad;
    return { h: Math.round(top + G.disc.d + G.disc.gap + G.label.size * 1.2 + G.sub.gap + G.sub.size * 1.2 + G.lines.top + G.lines.n * (G.lines.h + G.lines.gap) - G.lines.gap + G.bottom) };
  },

  build(ctx) {
    const { S, params, rect, mode, tIn, beats } = ctx; const { kit, C } = S; const { h } = kit;
    const W = rect.w;
    const card = cardFrame(S, { w: W, h: rect.h, mode, tIn });
    const body = card.body;
    const need = this.prefer(params).h;
    const k = Math.min(1, card.bodyH / need);
    const H = card.bodyH / k;
    const stage = h('div', { style: { position: 'absolute', left: `${(W - W * k) / 2}px`, top: '0', width: `${W}px`, height: `${H}px`, transformOrigin: '0 0', transform: k < 1 ? `scale(${k.toFixed(4)})` : 'none', overflow: 'hidden' } });
    body.append(stage);
    const top = (params.title ? G.title.band : G.pad) + Math.max(0, (H - need) / 2);

    const side = (spec, isAfter) => {
      const ink = isAfter ? C.ink : G.before.ink;
      const g = spec.glyph || (isAfter ? 'spark' : 'search');
      const col = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W / 2}px`, height: `${H}px` } });
      const discX = (W / 2 - G.disc.d) / 2;
      const disc = h('div', { html: spec.logo ? `<img src="${S.env.projectUrl(spec.logo)}" style="width:${Math.round(G.disc.d * 0.66)}px;height:${Math.round(G.disc.d * 0.66)}px;object-fit:contain;border-radius:22%;display:block">` : glyphSvg(g, G.disc.glyph, isAfter ? '#FFFFFF' : '#9C9CA4', { solid: SOLID.has(g), weight: 2.2 }), style: { position: 'absolute', left: `${discX}px`, top: `${top}px`, width: `${G.disc.d}px`, height: `${G.disc.d}px`, borderRadius: '50%', background: spec.logo ? '#FFFFFF' : isAfter ? C.accent : G.before.disc, border: spec.logo ? '2px solid #E6E6EA' : 'none', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: '50% 50%', boxShadow: isAfter ? `0 14px 30px -12px ${C.outlineGlow}` : 'none' } });
      const badge = isAfter ? null : h('div', { html: glyphSvg('cross', 26, '#FFFFFF', { weight: 3.4 }), style: { position: 'absolute', left: `${discX + G.disc.d - 34}px`, top: `${top - 6}px`, width: '46px', height: '46px', borderRadius: '50%', background: '#E5484D', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: '0', transformOrigin: '50% 50%' } });
      const lFont = (z) => `${G.label.weight} ${z}px ${fonts.sans}`;
      const lz = kit.fitSize(spec.label, W / 2 - 50, lFont, G.label.size, G.label.min, G.label.tracking);
      const ly = top + G.disc.d + G.disc.gap;
      const label = h('div', { text: spec.label, style: { position: 'absolute', left: '0', top: `${ly}px`, width: `${W / 2}px`, textAlign: 'center', font: `${G.label.weight} ${lz}px/1.2 ${fonts.sans}`, letterSpacing: `${G.label.tracking}em`, color: ink, whiteSpace: 'nowrap' } });
      const sy = ly + lz * 1.2 + G.sub.gap;
      const sub = spec.sub ? h('div', { text: spec.sub, style: { position: 'absolute', left: '20px', top: `${sy}px`, width: `${W / 2 - 40}px`, textAlign: 'center', font: `${G.sub.weight} ${G.sub.size}px/1.2 ${fonts.sans}`, color: isAfter ? '#5F6B67' : '#8E8E96', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }) : null;
      // a few lines of "content": result links on the old side, an answer on the new one
      const lw = Math.min(G.lines.max, W / 2 - 80);
      const lines = Array.from({ length: G.lines.n }, (_, i) => h('div', { style: { position: 'absolute', left: `${(W / 2 - lw) / 2}px`, top: `${sy + G.sub.size * 1.2 + G.lines.top + i * (G.lines.h + G.lines.gap)}px`, width: `${lw * G.lines.w[i]}px`, height: `${G.lines.h}px`, borderRadius: `${G.lines.h / 2}px`, background: isAfter ? (i === 0 ? C.accent : mix(C.tint, C.accent, 0.25)) : G.before.line, opacity: isAfter && i === 0 ? '0.85' : '1' } }));
      col.append(...lines, disc, ...(badge ? [badge] : []), label, ...(sub ? [sub] : []));
      return { col, disc, badge, label };
    };

    // old side: a full-width grey panel whose content starts centred and moves to the left half
    const beforePanel = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, background: G.before.fill } });
    const B = side(params.before, false);
    beforePanel.append(B.col);
    // new side: a tinted panel revealed from the divider rightwards
    const afterPanel = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, background: C.tint } });
    const A = side(params.after, true);
    A.col.style.left = `${W / 2}px`;
    afterPanel.append(A.col);
    const divider = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${G.divider.w}px`, height: `${H}px`, background: '#FFFFFF', boxShadow: '0 0 18px rgba(0,0,0,0.18)' } });
    const handle = h('div', { html: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${C.accent}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg>`, style: { position: 'absolute', left: '0', top: '0', width: `${G.divider.handle}px`, height: `${G.divider.handle}px`, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 10px 24px -8px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' } });
    stage.append(beforePanel, afterPanel, divider, handle);

    if (params.title) {
      const tr = G.title.tracking;
      const text = params.title.toUpperCase();
      const size = kit.fitSize(text, W - 80, (z) => `${G.title.weight} ${z}px ${fonts.sans}`, G.title.size, 16, tr);
      stage.append(h('div', { text, style: { position: 'absolute', left: '0', top: `${G.title.baseline - size * type.ascent.sans}px`, width: `${W}px`, textAlign: 'center', whiteSpace: 'nowrap', font: `${G.title.weight} ${size}px/1 ${fonts.sans}`, letterSpacing: `${tr}em`, textIndent: `${tr}em`, color: G.title.colour, pointerEvents: 'none' } }));
    }

    const wipeAt = (typeof params.at === 'number' ? Math.max(tIn + F(4), S.wordTime(params.at)) : tIn + F(8)) - M.lead;
    const dimAt = beats.filter((b) => b.do === 'dim').map((b) => b.t)[0] ?? Infinity;
    const fullAt = beats.filter((b) => b.do === 'full').map((b) => b.t)[0] ?? Infinity;
    S.sfx(wipeAt, 'cardSlide');
    if (Number.isFinite(dimAt)) S.sfx(dimAt, 'strike');
    if (Number.isFinite(fullAt)) S.sfx(fullAt, 'highlight');

    return {
      el: card.el,
      seek(t) {
        card.seek(t);
        const p = flyEase(t, wipeAt, M.wipe);
        const q = flyEase(t, fullAt, M.full);
        // divider: from beyond the right edge to the middle, then (full) to beyond the left edge
        const dx = (W + 40) + (W / 2 - (W + 40)) * p + (-60 - W / 2) * q;
        divider.style.transform = `translateX(${(dx - G.divider.w / 2).toFixed(1)}px)`;
        handle.style.transform = `translate(${(dx - G.divider.handle / 2).toFixed(1)}px, ${(H / 2 - G.divider.handle / 2).toFixed(1)}px)`;
        const on = p > 0 && dx < W + 30 && dx > -50;
        divider.style.display = on ? '' : 'none';
        handle.style.display = on ? 'flex' : 'none';
        afterPanel.style.clipPath = `inset(0 0 0 ${Math.max(0, Math.min(W, dx)).toFixed(1)}px)`;
        // the old side makes room: its content moves from the centre to the left half
        B.col.style.transform = `translateX(${((W / 4) * (1 - p)).toFixed(1)}px)`;
        // the new side's content follows the reveal in, then rides with the full take-over
        A.col.style.transform = `translateX(${((W / 4) * (1 - p) * 0.4 - (W / 4) * q).toFixed(1)}px)`;
        applyArrive(A.disc, t >= wipeAt + M.wipe * 0.6 ? arrive(t, wipeAt + M.wipe * 0.6, 'pop') : { o: 1, x: 0, y: 0, r: 0, s: 0.9 });
        // dim the old side
        const d = approach(t, dimAt, M.dim / 3, M.dim);
        B.col.style.opacity = d > 0 ? String(1 - 0.55 * d) : '';
        B.col.style.filter = d > 0 ? `grayscale(${d.toFixed(3)})` : 'none';
        applyArrive(B.badge, Number.isFinite(dimAt) && t >= dimAt ? arrive(t, dimAt + F(2), 'pop') : { o: 0, x: 0, y: 0, r: 0, s: 1 });
      },
    };
  },
};
