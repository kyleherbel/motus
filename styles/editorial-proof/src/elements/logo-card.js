// The name reveal: the product's logo, or its name set large, alone on the card as the tool is
// named ("It's called X", hook H19, structure S20). Four reference instances, settled frames:
//   clip30@205  dark card 94..986 x 466..1065 (600 tall), fill #040D1A -> #00030F; square icon
//                    383x364, 50 px under the card top; the name "PentAGI" under it, bold, cap 45 px,
//                    baseline 63 px above the card bottom; it fades up 5 f after its word, over 11 f
//   clip22@150  white card, 387 tall; a wide logo (icon + wordmark) 86 % of the card's width;
//                    the icon pops 4 f after the cut and the wordmark wipes open left to right in 8 f,
//                    starting 6 f before its word
//   clip09@128  cream card 530 tall; wide logo 728x97 centred; it sharpens from a blur in 4 f
//   clip29@158  no logo: the name alone, heavy, 785 px wide (88 %) on a card that fills the dark
//                    slot (256..1275), fill #EDEBE9; it types on one glyph every 2.5 f from 1 f
//                    before its word, each new glyph arriving wide and the line closing up over 4 f
// The card itself arrives with the layout (the dark stage settles from 115 %, research/motion.md).
import { cardFrame } from '../card.js';
import { fonts, type, F } from '../tokens.js';

// Where the baseline sits in a line-height-1 box of Motus Inter (hhea ascender 969, descender 242 per 1000).
const ASC = type.ascent.sans;

// ---- TOKENS WANTED in tokens.js (layout.logoCard / motion.logoCard): kept here until the shared file can take them.
const G = {
  icon: { w: 383, h: 364, top: 50, cardH: 600 },                       // clip30@205
  under: { size: 62, weight: 700, tracking: -0.01, baseline: 63 },     // name under the icon: cap 45 px, baseline 63 above the card bottom
  wide: { cardH: 387, maxW: 0.86, maxH: 0.5 },                          // clip22@150 (clip09: 530 tall on the older 940 card)
  big: { maxW: 0.88, size: 210, min: 90, weight: 800, tracking: -0.025, lift: 20 }, // clip29@158: 785 of 892 px, cap box centred 20 px over the card's centre
  tagline: { size: 40, weight: 500, tracking: -0.01, gap: 66, extra: 70, maxW: 0.84 },
  fill: { white: '#FDFDFD', dark: 'linear-gradient(170deg, #0E0E0F 0%, #09090A 55%, #030303 100%)' },   // dark: measured navy, neutralised (colour CR08)
  ink: { white: '#131416', dark: '#FFFFFF', taglineWhite: '#717171', taglineDark: '#B2B2B2' },
  wideAspect: 1.8,                                                      // wider than this: a wordmark, shown alone
};
const M = {
  fade: { delay: F(5), dur: F(11) },                 // the name under an icon (clip30@184-195)
  wipe: { lead: F(6), dur: F(8) },                   // a wide logo (clip22@137-145)
  type: { lead: F(1), step: F(2.5), settle: F(4), spread: 0.22 },   // the name alone (clip29@125-142)
  sharpen: { blur: 14, dur: F(4) },                  // a logo image as the card cuts in (clip09@87-91)
  tagline: { after: F(8), dur: F(10), rise: 14 },
  defaultAt: { fade: F(18), wipe: F(5), type: F(8) },   // when no word is given: after the cut
};

export default {
  type: 'logo-card',
  label: 'Logo card',
  slots: ['card'],
  params: {
    name: { type: 'string', maxChars: 22, maxWords: 4 },                 // the product's name as written: "PentAGI"
    logo: 'asset?',                                                     // its logo; a square icon gets the name under it, a wide wordmark stands alone
    tagline: { type: 'string', optional: true, maxChars: 40, maxWords: 7 },   // one short line under the name
    skin: 'enum?:white|dark',                                           // card fill: white (default) or near-black navy for light logos
    reveal: 'enum?:type|wipe|fade',                                     // how the name lands (default: type when alone, wipe for a wordmark, fade under an icon)
    at: 'word?',                                                        // the word that says the name
  },
  beats: {},

  async prepare(params, S) {
    if (!params.logo) return { logo: null };
    const img = new Image(); img.src = S.env.projectUrl(params.logo);
    try { await img.decode(); } catch { S.warn(`logo-card: could not load ${params.logo}`); return { logo: null }; }
    return { logo: { src: img.src, w: img.naturalWidth || 1, h: img.naturalHeight || 1 } };
  },

  prefer(params, { data, maxH, w }) {
    const k = w / 894;
    const tag = params.tagline ? G.tagline.extra * k : 0;
    const logo = data?.logo;
    if (!logo) return { h: maxH };
    if (logo.w / logo.h > G.wideAspect) return { h: Math.round(G.wide.cardH * k + tag) };
    return { h: Math.round(G.icon.cardH * k + tag) };
  },

  build(ctx) {
    const { S, params, rect, mode, tIn, data } = ctx; const { kit } = S; const { h } = kit;
    const k = rect.w / 894;
    const skin = params.skin === 'dark' ? 'dark' : 'white';
    const card = cardFrame(S, { w: rect.w, h: rect.h, mode, tIn, fill: G.fill[skin] });
    const body = card.body;
    const ink = G.ink[skin];
    const logo = data?.logo || null;
    const form = !logo ? 'name' : logo.w / logo.h > G.wideAspect ? 'wide' : 'icon';
    const reveal = params.reveal || (form === 'name' ? 'type' : form === 'wide' ? 'wipe' : 'fade');
    const word = params.at !== undefined ? S.wordTime(params.at) : null;
    const t0 = Math.max(tIn, reveal === 'fade' ? (word !== null ? word + M.fade.delay : tIn + M.defaultAt.fade)
      : reveal === 'wipe' ? (word !== null ? word - M.wipe.lead : tIn + M.defaultAt.wipe)
        : (word !== null ? word - M.type.lead : tIn + M.defaultAt.type));
    const tagH = params.tagline ? G.tagline.extra * k : 0;
    const H = rect.h - tagH;                       // the part of the card the logo and name centre in

    const parts = [];                              // { el, kind: 'logo'|'name' }
    let nameBox = null;                            // where the name sits: { x, w, baseline, size, font }

    // ---- logo image
    let logoEl = null, logoBottom = H / 2;
    if (logo) {
      let bw, bh, top;
      if (form === 'icon') { bw = G.icon.w * k; bh = G.icon.h * k; top = G.icon.top * k; }
      else { bw = rect.w * G.wide.maxW; bh = H * G.wide.maxH; top = null; }
      const s = Math.min(bw / logo.w, bh / logo.h);
      const lw = logo.w * s, lh = logo.h * s;
      const y = top !== null ? top + (bh - lh) / 2 : (H - lh) / 2;
      logoBottom = y + lh;
      logoEl = h('img', { src: logo.src, style: { position: 'absolute', left: `${(rect.w - lw) / 2}px`, top: `${y}px`, width: `${lw}px`, height: `${lh}px`, display: 'block' } });
      body.append(logoEl);
      parts.push({ el: logoEl, kind: 'logo', x: (rect.w - lw) / 2, w: lw });
    }

    // ---- the name: under an icon, or alone and large
    const font = (z, wgt) => `${wgt} ${z}px ${fonts.sans}`;
    if (form === 'icon' || form === 'name') {
      const under = form === 'icon';
      const wgt = under ? G.under.weight : G.big.weight;
      const tr = under ? G.under.tracking : G.big.tracking;
      const size = under ? kit.fitSize(params.name, rect.w * 0.86, (z) => font(z, wgt), G.under.size * k, 32 * k, tr)
        : kit.fitSize(params.name, rect.w * G.big.maxW, (z) => font(z, wgt), G.big.size * k, G.big.min * k, tr);
      const w = kit.measure(params.name, font(size, wgt), tr * size);
      const cap = size * type.capRatio.sans;
      const baseline = under ? H - G.under.baseline * k : H / 2 + cap / 2 - G.big.lift * k;
      nameBox = { x: (rect.w - w) / 2, w, baseline, size, wgt, tr };
    }
    let glyphs = null, nameEl = null;
    if (nameBox) {
      const { x, baseline, size, wgt, tr } = nameBox;
      const style = { position: 'absolute', top: `${baseline - size * ASC}px`, whiteSpace: 'pre', font: `${wgt} ${size}px/1 ${fonts.sans}`, letterSpacing: `${tr}em`, color: ink };
      if (reveal === 'type') {
        // one span per glyph at its measured place in the finished line
        const chars = [...params.name];
        let acc = '';
        glyphs = chars.map((ch, i) => {
          const left = kit.measure(acc, font(size, wgt), tr * size);
          acc += ch;
          const adv = kit.measure(acc, font(size, wgt), tr * size) - left;
          const el = h('span', { text: ch, style: { ...style, left: `${x + left}px` } });
          body.append(el);
          return { el, left, adv, at: t0 + i * M.type.step, space: ch === ' ' };
        });
      } else {
        nameEl = h('div', { text: params.name, style: { ...style, left: `${x}px` } });
        body.append(nameEl);
        parts.push({ el: nameEl, kind: 'name', x, w: nameBox.w });
      }
    }

    // ---- tagline
    let tagEl = null, tagAt = 0;
    if (params.tagline) {
      const size = kit.fitSize(params.tagline, rect.w * G.tagline.maxW, (z) => font(z, G.tagline.weight), G.tagline.size * k, 26 * k, G.tagline.tracking);
      const gap = G.tagline.gap * k + (nameBox ? 0.3 * (nameBox.size - G.under.size * k) : 0);   // clear of the name's descenders
      const baseline = Math.min(rect.h - 44 * k, (nameBox ? nameBox.baseline : logoBottom) + gap);
      tagEl = h('div', { text: params.tagline, style: { position: 'absolute', left: '0', width: `${rect.w}px`, textAlign: 'center', top: `${baseline - size * ASC}px`, whiteSpace: 'nowrap', font: `${G.tagline.weight} ${size}px/1 ${fonts.sans}`, letterSpacing: `${G.tagline.tracking}em`, color: skin === 'dark' ? G.ink.taglineDark : G.ink.taglineWhite } });
      body.append(tagEl);
      const nameDone = reveal === 'type' ? t0 + ([...params.name].length - 1) * M.type.step + M.type.settle
        : reveal === 'wipe' ? t0 + M.wipe.dur : t0 + M.fade.dur;
      tagAt = nameDone + M.tagline.after - M.tagline.dur / 2;
    }

    // ---- what moves
    const fullW = nameBox ? nameBox.w : 0;
    const seekType = (t) => {
      // visible width so far (each glyph's advance grows in as it settles), line re-centred on it
      let vis = 0;
      for (const g of glyphs) vis += g.adv * S.E.emph(kit.clamp((t - g.at) / M.type.settle));
      const shift = (fullW - vis) / 2;
      for (const g of glyphs) {
        const on = t >= g.at;
        g.el.style.display = on ? '' : 'none';
        if (!on) continue;
        const p = S.E.emph(kit.clamp((t - g.at) / M.type.settle));
        // the newest glyph arrives wide, but never past the card's edge
        const spread = Math.min(M.type.spread * nameBox.size, 0.5 * (rect.w - fullW) / 2) * (1 - p);
        const room = rect.w - 24 * k - (nameBox.x + g.left + g.adv);     // keep every glyph inside the card
        g.el.style.transform = `translateX(${Math.min(shift + spread, room).toFixed(2)}px)`;
      }
    };

    return {
      el: card.el,
      tone: skin === 'dark' ? [10, 10, 10] : 'light',   // the dark fill's echo, neutralised with it (colour CR08)
      seek(t) {
        card.seek(t);
        const age = t - tIn;
        // a logo image sharpens as the card cuts in
        if (logoEl) {
          const p = kit.clamp(age / M.sharpen.dur);
          const b = M.sharpen.blur * (1 - kit.ease.outCubic(p));
          logoEl.style.filter = b > 0.2 ? `blur(${b.toFixed(2)}px)` : 'none';
          logoEl.style.opacity = String(0.35 + 0.65 * kit.ease.outCubic(p));
        }
        if (reveal === 'wipe') {
          // left to right, hard edge, across the logo (and the name if there is one)
          const p = S.E.emph(kit.clamp((t - t0) / M.wipe.dur));
          for (const part of parts) {
            const target = form === 'wide' || part.kind === 'name' ? part : null;
            if (!target) continue;
            const cut = part.w * (1 - p);
            part.el.style.visibility = t >= t0 ? 'visible' : 'hidden';
            part.el.style.clipPath = p >= 1 ? 'none' : `inset(-30px ${cut.toFixed(2)}px -30px -30px)`;
          }
        } else if (reveal === 'fade' && nameEl) {
          const p = kit.ease.outCubic(kit.clamp((t - t0) / M.fade.dur));
          nameEl.style.opacity = String(p);
          nameEl.style.visibility = t >= t0 ? 'visible' : 'hidden';
        } else if (reveal === 'fade' && form === 'wide' && logoEl) {
          const p = kit.ease.outCubic(kit.clamp((t - t0) / M.fade.dur));
          logoEl.style.opacity = String(p);
        }
        if (glyphs) seekType(t);
        if (tagEl) {
          const p = kit.clamp((t - tagAt) / M.tagline.dur);
          tagEl.style.visibility = t >= tagAt ? 'visible' : 'hidden';
          tagEl.style.opacity = String(kit.ease.outCubic(p));
          const dy = M.tagline.rise * k * (1 - S.E.emph(p));
          tagEl.style.transform = dy > 0.05 ? `translateY(${dy.toFixed(2)}px)` : 'none';
        }
      },
    };
  },
};
