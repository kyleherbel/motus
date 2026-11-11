// Editorial Proof: entry point of the style's browser module (see docs/ARCHITECTURE.md, section 5).
import { W, H, fonts } from './src/tokens.js';
import { buildComposition } from './src/compile.js';

export default {
  id: 'editorial-proof',

  async setup(env) {
    await Promise.all(fonts.files.map(async (f) => {
      const face = new FontFace(f.family, `url(${env.styleUrl(f.src)})`, { weight: f.weight, style: f.style });
      document.fonts.add(await face.load());
    }));
  },

  compile(doc, env) {
    const el = env.kit.h('div.ep-root', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, overflow: 'hidden', background: '#000', fontFamily: fonts.sans, WebkitFontSmoothing: 'antialiased', textRendering: 'geometricPrecision' } });
    let comp = null;
    const ready = buildComposition(doc, env, el).then((c) => { comp = c; });
    return {
      el, ready,
      seek(t) { comp?.seek(t); },
      settled() { return comp ? comp.settled() : Promise.resolve(); },
      get audio() { return comp ? comp.audio : []; },
      posterTime(id) { return comp ? comp.posterTime(id) : null; },
    };
  },
};
