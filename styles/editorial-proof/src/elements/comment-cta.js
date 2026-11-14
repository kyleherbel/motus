// The closing call to action over the full-frame presenter: an italic serif verb
// ("comment") and under it, overlapping its lower edge, the keyword in quotes with an
// accent glow, plus a pulsing dot (research/hook.md, research/motion.md):
//   the verb lands on its spoken word, settling from 116 % over 16 frames
//   the dot fades in 8 frames ahead of the keyword and swells to 108 %
//   the keyword flickers in over five frames: 100, 45, 88, 60, 100 % opacity
import { layout, type, fonts, motion, ctaTones } from '../tokens.js';

const CX = 540;

export default {
  type: 'comment-cta',
  label: 'Comment CTA',
  slots: ['cta'],
  params: {
    keyword: { type: 'string', maxChars: 12, maxWords: 2 },
    verb: { type: 'string', optional: true, maxChars: 10, maxWords: 1 },   // default "comment"
    verbAt: 'word?',                                                        // default: the word in the scene that matches the verb
    keywordAt: 'word?',                                                     // default: 14 frames after the verb, as the reference does
    tone: 'enum?:emerald|violet|blue|yellow|orange|green|cyan|lime',        // keyword glow; the look's accent unless the keyword is a brand with its own colour
  },
  beats: {},

  build(ctx) {
    const { S, params, tIn, tOut, scene } = ctx; const { kit, C } = S; const { h } = kit;
    const M = motion.cta;
    const verbText = (params.verb || 'comment').toLowerCase();
    const words = S.doc.words.filter((w) => w.i >= scene.words[0] && w.i <= scene.words[1]);
    const same = (w, txt) => kit.bare(w.w).toLowerCase() === txt.toLowerCase();
    const spoken = params.verbAt !== undefined ? S.wordTime(params.verbAt) : (words.find((w) => same(w, verbText))?.start ?? tIn + (tOut - tIn) * 0.38);
    const vAt = Math.max(tIn, spoken - M.verbLead);                       // hard on, two frames before the word
    const kAt = params.keywordAt !== undefined ? S.wordTime(params.keywordAt) : vAt + M.keywordAfter;
    const [toneTop, toneBottom] = ctaTones[params.tone || C.accentName];
    const glow = `${toneBottom}B0`;

    const Fl = layout.full;
    const el = h('div.ep-cta', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '0' } });
    // the verb is sized so "comment" spans the measured 387 px of ink, centred on x 551
    const vfont = (s) => `italic ${type.cta.verbWeight} ${s}px ${fonts.serif}`;
    const vs = Math.round((Fl.cta.verbInkW / kit.measure('comment', vfont(100), -1.5)) * 100);
    const verb = h('div', { text: verbText, style: { position: 'absolute', left: `${Fl.cta.verbCx}px`, top: `${Fl.cta.verbInkTop - vs * 0.235}px`, transform: 'translateX(-50%)', transformOrigin: '50% 70%', whiteSpace: 'nowrap', font: `italic ${type.cta.verbWeight} ${vs}px/1 ${fonts.serif}`, letterSpacing: '-0.015em',
      background: 'linear-gradient(180deg, #F9F9F8 30%, #E6E4E3 48%, #9A979A 78%)', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.42))' } });
    const kfont = (s) => `${type.cta.keywordWeight} ${s}px ${fonts.sans}`;
    const quoted = `“${params.keyword}”`;
    const ks = kit.fitSize(quoted, 780, kfont, type.cta.keywordSize, 64, -0.025);
    const keyword = h('div', { text: quoted, style: { position: 'absolute', left: `${CX}px`, top: `${Fl.cta.keywordBaseline - ks * type.ascent.sans}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap', font: `${type.cta.keywordWeight} ${ks}px/1 ${fonts.sans}`, letterSpacing: '-0.025em',
      background: `linear-gradient(180deg, ${toneTop} 16%, ${toneBottom} 84%)`, webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 9px ${glow}) drop-shadow(0 0 34px ${toneBottom}66) drop-shadow(0 3px 6px rgba(0,0,0,0.3))` } });
    const D = Fl.dot;
    const dot = h('div', { style: { position: 'absolute', left: `${D.x}px`, top: `${D.y}px`, width: '0', height: '0' } });
    const halo = h('div', { style: { position: 'absolute', left: `${-D.halo}px`, top: `${-D.halo}px`, width: `${D.halo * 2}px`, height: `${D.halo * 2}px`, borderRadius: '50%', background: `radial-gradient(circle, ${C.ctaDot}99 0%, ${C.ctaDot}33 45%, rgba(0,0,0,0) 70%)` } });
    const core = h('div', { style: { position: 'absolute', left: `${-D.r}px`, top: `${-D.r}px`, width: `${D.r * 2}px`, height: `${D.r * 2}px`, borderRadius: '50%', background: C.ctaDot, boxShadow: `inset 0 0 0 3px ${C.ctaRim}` } });
    const rings = [0, 1].map(() => { const r = h('div', { style: { position: 'absolute', left: `${-D.r}px`, top: `${-D.r}px`, width: `${D.r * 2}px`, height: `${D.r * 2}px`, borderRadius: '50%', border: `2.5px solid ${C.ctaDot}`, boxSizing: 'border-box' } }); dot.append(r); return r; });
    dot.prepend(halo); dot.append(core);
    el.append(dot, verb, keyword);
    S.sfx(vAt, 'ctaVerb');
    S.sfx(kAt, 'cta');
    const dotAt = vAt + M.dotAfter;

    return {
      el,
      captionsOffFrom: vAt,                       // from the verb on, these words replace the caption line
      seek(t) {
        const pv = S.E.settle(kit.clamp((t - vAt) / M.verbDur));
        verb.style.visibility = t >= vAt ? 'visible' : 'hidden';
        verb.style.transform = `translateX(-50%) scale(${(M.verbFrom + (1 - M.verbFrom) * pv).toFixed(4)})`;
        verb.style.opacity = String(t >= kAt ? M.verbDim : 1);            // it dims a little once the keyword sits on it
        const f = Math.floor((t - kAt) * 30 + 1e-6);
        keyword.style.visibility = t >= kAt ? 'visible' : 'hidden';
        keyword.style.opacity = String(f >= 0 && f < M.flicker.length ? M.flicker[f] : 1);
        dot.style.display = t >= dotAt ? '' : 'none';
        const pin = kit.prog(t, dotAt, M.dotIn, kit.ease.outCubic);
        const swell = 1 + (M.dotPeak - 1) * Math.sin(Math.PI * kit.clamp((t - dotAt) / M.dotSettle));
        dot.style.opacity = String(pin);
        core.style.transform = `scale(${(swell * (0.6 + 0.4 * pin)).toFixed(4)})`;
        rings.forEach((r, k) => {
          const ph = ((((t - dotAt) / M.dotPeriod) + k * 0.5) % 1 + 1) % 1;
          r.style.transform = `scale(${(1 + 0.95 * ph).toFixed(3)})`;
          r.style.opacity = String((1 - ph) * 0.6);
        });
      },
    };
  },
};
