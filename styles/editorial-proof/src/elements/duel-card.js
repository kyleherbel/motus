// Two sides of a claim as a motion graphic: "ChatGPT against Meta", "everybody is leaving Google for
// ChatGPT", "AI over googling". Built from the reference's devices (research/explain.md):
//   converge   the two hubs fly in from beyond the card's edges on the measured converge curve (X10:
//              90 % by 8 f, settled by 16 f, blurred while fast) and dip to 96 % as they meet
//   link       a line draws on between them (X03)
//   flow       on its word, a stream of people (or dots, or coins) leaves one hub along an arc and pours
//              into the other, one every 3 f, 16 f a trip (X10, X13); each arrival sends a ripple
//              off the receiving hub, which swells, while the sender greys and shrinks (X08)
//   win        on its word the winner grows to 110 % and takes a glowing accent ring and a check
//              badge (X07); the loser greys to 42 % and shrinks to 90 % (X08). No strike, no list.
//   focus      a ring traces round one hub and it bumps, without changing who leads
// Brand marks are never drawn: a side shows a supplied logo file, a glyph, or its initial in a
// colour the planner gives (a brand's own colour is fine; its logo is not).
import { cardFrame } from '../card.js';
import { fonts, type, F } from '../tokens.js';
import { X, arrive, applyArrive, flyAt, approach, roundRectPath, drawOnPath, mix } from '../anim.js';
import { glyphSvg, GLYPHS, SOLID } from '../glyphs.js';

// ---- TOKENS (card px, 894 wide)
const G = {
  pad: 40,
  title: { size: 25, weight: 600, tracking: 0.143, baseline: 62, colour: '#76767A', band: 100 },
  hub: { size: 284, radius: 70, edge: '#E5E5EA', shadow: '0 26px 50px -20px rgba(0,0,0,0.32)', glyph: 144, initial: 160, logo: 180, x: [0.265, 0.735] },
  label: { size: 54, min: 34, weight: 700, gap: 36, tracking: -0.02 },
  sub: { size: 31, weight: 500, ink: '#7C7C84', gap: 10 },
  link: { w: 5, ink: '#DADAE0' },
  token: { d: 56, glyph: 32, arc: 190, spread: 36 },
  badge: { d: 84 },
  ripple: { from: 0.52, to: 0.86, life: F(14) },
  bottom: 56,
};
const M = {
  enter: F(2), travel: F(16), dip: { at: F(12), down: F(3), up: F(7), depth: 0.04 },
  link: F(14),
  flow: { every: F(3), trip: F(16), gain: 1.08, lose: 0.9, loseTo: 0.5, ramp: F(36) },
  win: { grow: 1.1, dur: F(12), loseScale: 0.9 },
  focus: { bump: 0.05, dur: F(10) },
};

const rand = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

export default {
  type: 'duel-card',
  label: 'Duel',
  slots: ['card'],
  params: {
    title: { type: 'string', optional: true, maxChars: 32, maxWords: 5 },
    sides: { type: 'array', min: 2, max: 2, of: {
      name: { type: 'string', maxChars: 18 },
      sub: { type: 'string', optional: true, maxChars: 28 },
      glyph: `enum?:${GLYPHS.join('|')}`,            // drawn in the side's colour
      initial: { type: 'string', optional: true, maxChars: 2 },   // instead of a glyph: "G", "M"
      colour: { type: 'string', optional: true, maxChars: 9 },    // "#0866FF"; default the accent
      logo: 'asset?',                                 // a logo file the user supplied
    } },
    token: 'enum?:user|dot|dollar|chat',              // what flows between the hubs (default people)
    skin: 'enum?:light|dark',
  },
  beats: {
    flow: { from: { type: 'number', min: 1, max: 2 } },    // a stream leaves this side for the other
    win: { side: { type: 'number', min: 1, max: 2 } },
    focus: { side: { type: 'number', min: 1, max: 2 } },
  },

  prefer(params) {
    const top = params.title ? G.title.band : G.pad;
    const hasSub = params.sides.some((s) => s.sub);
    return { h: Math.round(top + 20 + G.hub.size + G.label.gap + G.label.size * 1.2 + (hasSub ? G.sub.gap + G.sub.size * 1.2 : 0) + G.bottom) };
  },

  build(ctx) {
    const { S, params, rect, mode, tIn, beats } = ctx; const { kit, C } = S; const { h } = kit;
    const dark = params.skin === 'dark';
    const W = rect.w;
    const card = cardFrame(S, { w: W, h: rect.h, mode, tIn, fill: dark ? '#111214' : undefined });
    const body = card.body;
    const need = this.prefer(params).h;
    const k = Math.min(1, card.bodyH / need);
    const stage = h('div', { style: { position: 'absolute', left: `${(W - W * k) / 2}px`, top: `${(card.bodyH - need * k) / 2}px`, width: `${W}px`, height: `${need}px`, transformOrigin: '0 0', transform: k < 1 ? `scale(${k.toFixed(4)})` : 'none' } });
    body.append(stage);
    const ink = dark ? '#F2F2F3' : C.ink;

    if (params.title) {
      const tr = G.title.tracking;
      const text = params.title.toUpperCase();
      const size = kit.fitSize(text, W - 80, (z) => `${G.title.weight} ${z}px ${fonts.sans}`, G.title.size, 16, tr);
      stage.append(h('div', { text, style: { position: 'absolute', left: '0', top: `${G.title.baseline - size * type.ascent.sans}px`, width: `${W}px`, textAlign: 'center', whiteSpace: 'nowrap', font: `${G.title.weight} ${size}px/1 ${fonts.sans}`, letterSpacing: `${tr}em`, textIndent: `${tr}em`, color: dark ? '#8E8E95' : G.title.colour } }));
    }
    const hubY = (params.title ? G.title.band : G.pad) + 20;
    const cy = hubY + G.hub.size / 2;
    const cx = G.hub.x.map((f) => W * f);

    // ---- the link between the hubs (behind them)
    const lx1 = cx[0] + G.hub.size / 2 + 14, lx2 = cx[1] - G.hub.size / 2 - 14;
    const link = drawOnPath(S, { d: `M${lx1} ${cy} L${lx2} ${cy}`, len: lx2 - lx1, w: W, h: need, t0: tIn + M.link, colour: dark ? '#2E2F34' : G.link.ink, width: G.link.w });
    stage.append(link.el);

    // ---- beats, in order
    const sorted = [...beats].sort((a, b) => a.t - b.t);
    const flows = sorted.filter((b) => b.do === 'flow').map((b) => ({ t: b.t, from: b.from - 1, to: 2 - b.from }));
    const wins = sorted.filter((b) => b.do === 'win');
    const focuses = sorted.filter((b) => b.do === 'focus');
    const winAt = wins.length ? wins[wins.length - 1].t : Infinity;
    const winner = wins.length ? wins[wins.length - 1].side - 1 : -1;
    for (const f of flows) S.sfx(f.t, 'type');
    for (const w of wins) S.sfx(w.t, 'numberLand');
    for (const f of focuses) S.sfx(f.t, 'highlight');

    // ---- hubs
    const hubs = params.sides.map((sd, i) => {
      const colour = sd.colour && /^#[0-9a-f]{6}$/i.test(sd.colour) ? sd.colour : C.accent;
      const wrap = h('div.ep-duel-hub', { style: { position: 'absolute', left: `${cx[i] - G.hub.size / 2}px`, top: `${hubY}px`, width: `${G.hub.size}px`, height: `${G.hub.size}px`, transformOrigin: '50% 50%' } });
      const halo = h('div', { style: { position: 'absolute', inset: '-14px', borderRadius: `${G.hub.radius + 14}px`, boxShadow: `0 0 0 5px ${C.accent}, 0 0 46px 10px ${C.outlineGlow}`, opacity: '0' } });
      const tile = h('div', { style: { position: 'absolute', inset: '0', borderRadius: `${G.hub.radius}px`, background: dark ? '#1C1D21' : '#FFFFFF', border: `2px solid ${dark ? '#2E2F34' : G.hub.edge}`, boxSizing: 'border-box', boxShadow: G.hub.shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } });
      const mark = h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' } });
      if (sd.logo) mark.append(h('img', { src: S.env.projectUrl(sd.logo), style: { width: `${G.hub.logo}px`, height: `${G.hub.logo}px`, objectFit: 'contain', borderRadius: '22%' } }));
      else if (sd.glyph) mark.innerHTML = glyphSvg(sd.glyph, G.hub.glyph, colour, { solid: SOLID.has(sd.glyph), weight: 2.1 });
      else mark.append(h('div', { text: (sd.initial || sd.name.trim()[0] || '?').toUpperCase(), style: { font: `800 ${G.hub.initial}px/1 ${fonts.sans}`, color: colour, letterSpacing: '-0.04em' } }));
      tile.append(mark);
      const badge = h('div', { html: glyphSvg('check', 40, '#FFFFFF', { weight: 3.4 }), style: { position: 'absolute', right: '-22px', top: '-22px', width: `${G.badge.d}px`, height: `${G.badge.d}px`, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.35)', opacity: '0', transformOrigin: '50% 50%' } });
      const { d, len } = roundRectPath(-12, -12, G.hub.size + 24, G.hub.size + 24, G.hub.radius + 12);
      const ring = drawOnPath(S, { d, len, w: G.hub.size, h: G.hub.size, t0: Infinity, colour: C.accent, width: 5 });
      wrap.append(halo, tile, ring.el, badge);
      // label under
      const lFont = (z) => `${G.label.weight} ${z}px ${fonts.sans}`;
      const colW = W / 2 - 30;
      const lz = kit.fitSize(sd.name, colW, lFont, G.label.size, G.label.min, G.label.tracking);
      const ly = hubY + G.hub.size + G.label.gap;
      const label = h('div', { text: sd.name, style: { position: 'absolute', left: `${cx[i] - colW / 2}px`, top: `${ly}px`, width: `${colW}px`, textAlign: 'center', font: `${G.label.weight} ${lz}px/1.2 ${fonts.sans}`, letterSpacing: `${G.label.tracking}em`, color: ink, whiteSpace: 'nowrap' } });
      const sub = sd.sub ? h('div', { text: sd.sub, style: { position: 'absolute', left: `${cx[i] - colW / 2}px`, top: `${ly + lz * 1.2 + G.sub.gap}px`, width: `${colW}px`, textAlign: 'center', font: `${G.sub.weight} ${G.sub.size}px/1.2 ${fonts.sans}`, color: dark ? '#8B8B92' : G.sub.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }) : null;
      const caption = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${need}px`, transformOrigin: `${cx[i]}px ${ly}px` } }, label, ...(sub ? [sub] : []));
      const ripples = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${need}px`, pointerEvents: 'none' } });
      stage.append(ripples, caption, wrap);
      // focus rings drawn per focus beat
      const myFocus = focuses.filter((f) => f.side - 1 === i);
      if (myFocus.length) { const f = myFocus[0]; const fresh = drawOnPath(S, { d, len, w: G.hub.size, h: G.hub.size, t0: f.t, colour: C.accent, width: 5 }); ring.el.replaceWith(fresh.el); wrap._ring = fresh; }
      return { i, wrap, halo, tile, mark, badge, ring: wrap._ring || ring, label, caption, ripples, colour, focus: myFocus };
    });

    // ---- tokens for each flow: one every 3 f from its word to the card's end, each a 16 f trip
    const tokens = [];
    const pool = 14;   // at most this many in flight at once (16 f trip / 3 f spacing = 6)
    const tokenEls = Array.from({ length: pool }, () => {
      const el = h('div', { html: params.token === 'dot' ? '' : glyphSvg(params.token === 'dollar' ? 'dollar' : params.token === 'chat' ? 'chat' : 'user', G.token.glyph, '#FFFFFF', { weight: 2.6 }), style: { position: 'absolute', left: '0', top: '0', width: `${params.token === 'dot' ? 16 : G.token.d}px`, height: `${params.token === 'dot' ? 16 : G.token.d}px`, borderRadius: '50%', background: C.accent, boxShadow: `0 0 14px 2px ${C.outlineGlow}`, display: 'none', alignItems: 'center', justifyContent: 'center' } });
      stage.append(el);
      return el;
    });
    const rippleEls = hubs.map((hb) => Array.from({ length: 5 }, () => { const r = h('div', { style: { position: 'absolute', left: '0', top: '0', borderRadius: '50%', border: `4px solid ${C.accent}`, display: 'none', boxSizing: 'border-box' } }); hb.ripples.append(r); return r; }));
    void tokens;

    // the hubs' own entrance: from beyond the card's edges
    const enterAt = tIn + M.enter;
    const fromX = [-(cx[0] + G.hub.size), W - cx[1] + G.hub.size];

    return {
      el: card.el, tone: dark ? 'dark' : 'light',
      seek(t) {
        card.seek(t);
        link.seek(t);
        // flow state: how much each hub has gained or lost so far
        const gain = [0, 0], loss = [0, 0];
        for (const f of flows) {
          const p = approach(t, f.t, M.flow.ramp / 3, M.flow.ramp);
          gain[f.to] = Math.max(gain[f.to], p); loss[f.from] = Math.max(loss[f.from], p);
        }
        const won = approach(t, winAt, M.win.dur / 3, M.win.dur);
        for (const hb of hubs) {
          const i = hb.i;
          // entrance travel with blur, then the dip as they meet
          const fl = flyAt(t, enterAt, { x: fromX[i], y: 0, s: 1 }, { x: 0, y: 0, s: 1 }, { dur: M.travel, path: 'straight' });
          const dipT = t - enterAt - M.dip.at;
          const dip = dipT < 0 ? 0 : dipT < M.dip.down ? dipT / M.dip.down : Math.max(0, 1 - (dipT - M.dip.down) / M.dip.up);
          let sc = 1 - M.dip.depth * dip;
          // flow and win
          sc *= 1 + (M.flow.gain - 1) * gain[i];
          sc *= 1 - (1 - M.flow.lose) * loss[i];
          let o = 1 - (1 - M.flow.loseTo) * loss[i];
          if (winner >= 0) {
            if (i === winner) sc *= 1 + (M.win.grow - 1) * won;
            else { sc *= 1 - (1 - M.win.loseScale) * won; o = Math.min(o, 1 - (1 - X.light.idle) * won); }
          }
          // focus bump
          for (const f of hb.focus) { const u = (t - f.t) / M.focus.dur; if (u > 0 && u < 1) sc *= 1 + M.focus.bump * Math.sin(Math.PI * u); }
          // arrival pulses on the receiving hub
          let pulse = 0;
          for (const f of flows) if (f.to === i && t >= f.t + M.flow.trip) { const ph = ((t - f.t - M.flow.trip) % M.flow.every) / M.flow.every; pulse = Math.max(pulse, 0.012 * (1 - ph)); }
          sc *= 1 + pulse;
          hb.wrap.style.transform = `translateX(${fl.x.toFixed(1)}px) scale(${sc.toFixed(4)})`;
          hb.wrap.style.filter = fl.blur > 0.2 ? `blur(${fl.blur.toFixed(2)}px)` : (o < 0.9 && winner >= 0 && i !== winner ? `grayscale(${won.toFixed(3)})` : 'none');
          hb.wrap.style.opacity = o >= 0.999 ? '' : o.toFixed(3);
          hb.caption.style.transform = `translateX(${fl.x.toFixed(1)}px) scale(${Math.max(0.9, Math.min(1.06, sc)).toFixed(4)})`;
          hb.caption.style.opacity = hb.wrap.style.opacity;
          hb.label.style.color = winner === i && won > 0.02 ? mix(dark ? '#F2F2F3' : C.ink, C.accentText || C.accent, won) : ink;
          const isWin = winner === i;
          hb.halo.style.opacity = isWin ? won.toFixed(3) : '0';
          applyArrive(hb.badge, isWin && t >= winAt ? arrive(t, winAt + F(3), 'pop') : { o: 0, x: 0, y: 0, r: 0, s: 1 });
          hb.ring.seek(t);
          hb.ring.el.style.opacity = hb.focus.length ? String(1 - approach(t, hb.focus[0].t + F(22), F(3), F(8))) : '0';
          // ripples: one per recent arrival
          const rs = rippleEls[i];
          let n = 0;
          for (const f of flows) {
            if (f.to !== i) continue;
            const first = f.t + M.flow.trip;
            if (t < first) continue;
            const kNow = Math.floor((t - first) / M.flow.every);
            for (let kk = kNow; kk >= Math.max(0, kNow - 4) && n < rs.length; kk--) {
              const age = t - (first + kk * M.flow.every);
              if (age > G.ripple.life) continue;
              const u = age / G.ripple.life;
              const r = G.hub.size * (G.ripple.from + (G.ripple.to - G.ripple.from) * u);
              const el = rs[n++];
              Object.assign(el.style, { display: '', width: `${2 * r}px`, height: `${2 * r}px`, transform: `translate(${(cx[i] - r).toFixed(1)}px, ${(cy - r).toFixed(1)}px)`, opacity: (0.45 * (1 - u)).toFixed(3) });
            }
          }
          for (; n < rs.length; n++) rs[n].style.display = 'none';
        }
        // tokens in flight
        let used = 0;
        for (const f of flows) {
          if (t < f.t) continue;
          const kNow = Math.floor((t - f.t) / M.flow.every);
          for (let kk = Math.max(0, kNow - 6); kk <= kNow && used < pool; kk++) {
            const t0 = f.t + kk * M.flow.every;
            const u = (t - t0) / M.flow.trip;
            if (u < 0 || u > 1) continue;
            const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;   // in-out along the arc
            const jx = (rand(kk, 1) - 0.5) * 2 * G.token.spread, jy = (rand(kk, 2) - 0.5) * 2 * G.token.spread;
            const x0 = cx[f.from] + jx * 0.5, y0 = cy + jy, x1 = cx[f.to] + jx * 0.3, y1 = cy + jy * 0.4;
            const arc = G.token.arc * (0.75 + 0.5 * rand(kk, 3));
            const x = x0 + (x1 - x0) * e;
            const y = y0 + (y1 - y0) * e - Math.sin(Math.PI * e) * arc;
            const el = tokenEls[used++];
            const d = params.token === 'dot' ? 16 : G.token.d;
            const sc = u < 0.15 ? 0.6 + 0.4 * (u / 0.15) : u > 0.85 ? 1 - 0.5 * ((u - 0.85) / 0.15) : 1;
            el.style.display = 'flex';
            el.style.transform = `translate(${(x - d / 2).toFixed(1)}px, ${(y - d / 2).toFixed(1)}px) scale(${sc.toFixed(3)})`;
            el.style.opacity = (u < 0.12 ? u / 0.12 : u > 0.88 ? (1 - u) / 0.12 : 1).toFixed(3);
          }
        }
        for (; used < pool; used++) tokenEls[used].style.display = 'none';
      },
    };
  },
};
