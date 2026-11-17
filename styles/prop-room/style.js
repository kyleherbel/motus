// Prop Room: entry point of the style's browser module (see docs/ARCHITECTURE.md, section 5).
import { W, H, fonts, colour } from './src/tokens.js';
import { buildComposition } from './src/compile.js';

/** Load a face from the pack; a face whose file is missing falls back to the same face installed locally. */
async function loadFace(env, f) {
  const sources = [`url(${env.styleUrl(f.src)})`, ...(f.local || []).map((n) => `local("${n}")`)].join(', ');
  try {
    const face = new FontFace(f.family, sources, { weight: f.weight, style: f.style });
    document.fonts.add(await face.load());
  } catch (e) {
    console.warn(`[prop-room] font ${f.family} could not load: ${e && e.message}`);
  }
}

export default {
  id: 'prop-room',

  async setup(env) {
    await Promise.all(fonts.files.map((f) => loadFace(env, f)));
  },

  compile(doc, env) {
    const el = env.kit.h('div.pr-root', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, overflow: 'hidden', background: colour.plate.white,
      fontFamily: fonts.sans, fontKerning: 'normal', fontVariantLigatures: 'none', WebkitFontSmoothing: 'antialiased', textRendering: 'geometricPrecision' } });
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
