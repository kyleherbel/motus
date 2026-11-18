// The brand mark on the seam (research/hook.md H19, H20; type.md T23; verification.md).
//
// When the speaker names the brand, usually in the opening seconds, the brand's own logo takes the caption's place
// on the seam for about 12 frames, from one frame before the name; it cuts in and out [H19, H20]. Logos are real
// marks the user supplies or `motus logo` fetches; the style never draws one [T23].
//   show beat   the word that names the brand. Without a beat the mark shows on the scene's first word.
import { motion, layout } from '../tokens.js';
import { setStyle } from '../common.js';
import { loadMedia } from '../media.js';

export default {
  type: 'brand-mark',
  label: 'Brand mark on the seam',
  slots: ['seam'],
  params: { src: 'asset', size: 'enum:small|large?' },
  beats: { show: {} },
  async prepare(params, S) { return { m: await loadMedia(S, params.src) }; },
  build(ctx) {
    const { S, params, beats, tIn, data } = ctx;
    const { h } = S.kit;
    const box = params.size === 'large' ? layout.brand.large : layout.brand.small;
    const m = data.m;
    const s = Math.min(box.w / m.w, box.h / m.h);
    const w = m.w * s, hh = m.h * s;
    const img = m.kind === 'image' ? h('img', { src: m.url, style: { position: 'absolute', left: `${(layout.caption.cx - w / 2).toFixed(2)}px`, top: `${(layout.seam - hh / 2).toFixed(2)}px`, width: `${w.toFixed(2)}px`, height: `${hh.toFixed(2)}px` } }) : h('div');
    const el = h('div.sl-brand', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', pointerEvents: 'none', display: 'none' } }, img);
    const shows = beats.filter((b) => b.do === 'show').map((b) => b.t - motion.brand.lead);
    if (!shows.length) shows.push(Math.max(tIn, (S.doc.scenes.find((sc) => sc.start <= tIn + 1e-6 && sc.end > tIn)?.start ?? tIn)));
    const spans = shows.map((t0) => [t0, t0 + motion.brand.dur]);
    return {
      el,
      seek(t) { setStyle(el, 'display', spans.some(([a, b]) => t >= a && t < b) ? '' : 'none'); },
      hideCaptions: spans,
    };
  },
};
