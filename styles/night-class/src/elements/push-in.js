// A push-in on the full-height presenter (research/presenter.md P15-P19): about 4 in 10 full-height
// runs end pushed in, to 1.10x (13 frames, slow start) or 1.18x (16 frames, fast start), about the
// frame centre, starting on the cut (44 %) or a beat later, and held until the next cut. Never a
// pull-out, pan or rotation.
import { presenter as P } from '../tokens.js';

export default {
  type: 'push-in',
  label: 'Push-in',
  slots: ['camera'],
  params: {
    level: 'enum?:small|large',     // small 1.10x (default, 37 of 54 pushes), large 1.18x
    at: 'word?',                    // when it starts; default on the cut
  },
  beats: {},

  build(ctx) {
    const { S, params: p, tIn } = ctx;
    const L = P.push[p.level === 'large' ? 'large' : 'small'];
    const E = S.kit.cubicBezier(...L.curve);
    const t0 = Math.max(tIn, p.at !== undefined ? S.wordTime(p.at) : tIn);
    return {
      el: S.kit.h('div', { style: { display: 'none' } }),
      ticks: [],
      zoom: (t) => 1 + (L.to - 1) * E(S.kit.clamp((t - t0) / L.dur)),
      seek() {},
    };
  },
};
