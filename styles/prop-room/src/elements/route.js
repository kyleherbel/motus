// A path or chain that draws on, with nodes appearing along it (research/explain.md X19, X13 path_draw; devices
// node_chain, path_draw, route_around).
//   route   one thick line with a square head that draws from stop to stop on an ease-out tip (a 280 px stretch in
//           about 12 frames, easeOutCubic), turning at right angles; each stop lands as the head reaches it, and a
//           token can travel the finished route (clip15@182-237: line 20 px, head 48 px square) [X19]
//   chain   the nodes of a flow, alternating left and right, each joined by a thin connector that draws first and
//           reaches the node 4-6 frames before it lands (clip02@551-604: connector 569, node 574-575) [X19]
// The first node is on the cut [X04]; `next` beats put each further node on its word, else they follow about 12
// frames apart [X05]. Nothing overshoots [X29].
import { F, colour, fonts, motion, layout } from '../tokens.js';
import { place, setStyle, clamp01, sansFont, partAt, applyPart, measureText, snapper } from '../common.js';
import { card } from '../card.js';
import { plateIsDark } from '../plate.js';

// TOKENS (research/explain.md X19, X05)
const ROUTE = { line: 20, head: 48, pxPer12: 280, minFrames: 8, maxFrames: 24, stop: 84, ring: 18, label: 48, rise: 420, span: 820 };   // line, head, speed (clip15@200, @218-232) [X19]; stops and layout by eye (the reference route spans the frame, clip15@237)
const CHAIN = { w: 440, h: 116, pitch: 196, shift: 150, line: 4, corner: 22, lead: F(5), label: 38, radius: 28 };   // node size, zig-zag and connector (by eye from clip02@603); connector 5 frames [X19]
const GAP = motion.eventGap.picture;                 // 12 frames between nodes when no beat places them [X05]
const TOKEN = { d: 60, dur: F(30), after: F(6) };    // the travelling token (by eye); it travels on the pointer's ease-in-out [X67]
const ACCENT = '#357CEF';                            // default line colour: the first accent that is not a third-party brand colour [colour.md accents]
const outCubic = (x) => 1 - (1 - x) ** 3;            // the route tip: easeOutCubic, RMSE 0.0076 (clip15@218-232) [X19]
const hexOk = (c) => /^#[0-9a-f]{6}$/i.test(c || '');

/** Event starts land on the frame grid, so a fast ease starts from its first value on a whole frame (a 6-frame land
 *  started half a frame late would show 1.09x instead of 1.25x on its first frame); seek adds 0.1 ms so an event
 *  that starts on a frame counts as started there despite float error. A shared helper would do. */

/** A polyline through orthogonal waypoints with rounded corners (radius r), sampled densely, with cumulative length. */
function polyline(pts, r) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, b, c] = [pts[i - 1], pts[i], pts[i + 1]];
    const d1 = Math.hypot(b[0] - a[0], b[1] - a[1]), d2 = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const rr = Math.min(r, d1 / 2, d2 / 2);
    if (rr < 0.5) { out.push(b); continue; }
    const u1 = [(b[0] - a[0]) / d1, (b[1] - a[1]) / d1], u2 = [(c[0] - b[0]) / d2, (c[1] - b[1]) / d2];
    const p0 = [b[0] - u1[0] * rr, b[1] - u1[1] * rr], p2 = [b[0] + u2[0] * rr, b[1] + u2[1] * rr];
    for (let k = 0; k <= 8; k++) { const t = k / 8; out.push([(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * b[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * b[1] + t * t * p2[1]]); }
  }
  out.push(pts[pts.length - 1]);
  const L = [0];
  for (let i = 1; i < out.length; i++) L.push(L[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
  return { pts: out, L, len: L[L.length - 1] };
}
function at(poly, d) {
  const { pts, L } = poly;
  if (d <= 0) return { x: pts[0][0], y: pts[0][1], a: Math.atan2(pts[1][1] - pts[0][1], pts[1][0] - pts[0][0]) };
  let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const f = clamp01((d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]));
  return { x: pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, y: pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f, a: Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]) };
}
const dOf = (poly) => 'M ' + poly.pts.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' L ');

export default {
  type: 'route',
  label: 'Route',
  slots: ['graphic'],
  params: {
    kind: 'enum?:route|chain',
    nodes: { type: 'array', min: 2, max: 5, of: { label: { type: 'string', maxChars: 16, maxWords: 3 } } },
    token: 'boolean?',                                            // route: a token travels the finished route
    color: { type: 'string', optional: true, maxChars: 7 },
  },
  beats: {
    next: {},                                                     // the next node lands on this word
  },
  build(ctx) {
    const { S, params } = ctx;
    const { h } = S.kit;
    const snap = snapper(S), tIn = snap(ctx.tIn);
    const beats = ctx.beats.map((b) => ({ ...b, t: snap(b.t) }));
    const kind = params.kind || 'route';
    const nodes = (params.nodes || []).slice(0, 5);
    const n = nodes.length;
    const dark = plateIsDark(params.plate, params.field);
    const ink = dark ? colour.white : colour.ink;
    const col = hexOk(params.color) ? params.color : dark && kind === 'chain' ? colour.white : ACCENT;
    const el = h('div.pr-route', { style: { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' } });
    if (n < 2) { S.warn('route: give 2-5 `nodes`'); return { el, seek() {} }; }
    const cap = fonts.M.cap;
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); return e; };

    // ---- node positions (element-local) and the waypoints between consecutive nodes
    let P, W0, H0, legs;
    const stg = layout.stage[ctx.mode === 'full' ? 'full' : 'split'];
    const room = 1080 - 2 * stg.margin;
    let rLabel = ROUTE.label;
    if (kind === 'chain') {
      // a long chain closes up so it stays inside 0.92 of the stage (by eye)
      const pitch = Math.min(CHAIN.pitch, ((stg.bottom - stg.top) * 0.92 - CHAIN.h) / (n - 1));
      W0 = CHAIN.w + 2 * CHAIN.shift; H0 = (n - 1) * pitch + CHAIN.h;
      P = nodes.map((_, k) => [W0 / 2 + (k % 2 ? CHAIN.shift : -CHAIN.shift), k * pitch + CHAIN.h / 2]);
      legs = P.slice(1).map((q, k) => {
        const p = P[k], y0 = p[1] + CHAIN.h / 2, y1 = q[1] - CHAIN.h / 2, my = (y0 + y1) / 2;
        const xo = p[0] + (q[0] > p[0] ? 1 : -1) * CHAIN.w * 0.18;     // leave from beside the centre, toward the next node
        const xi = q[0] - (q[0] > p[0] ? 1 : -1) * CHAIN.w * 0.18;
        return polyline([[xo, y0], [xo, my], [xi, my], [xi, y1]], CHAIN.corner);
      });
    } else {
      // labels on one level must clear each other (two stops apart) and the end labels must stay on the stage: the
      // route narrows first, then the labels get smaller (to 0.55 of their size)
      const widest = Math.max(...nodes.map((nd) => measureText(nd.label, sansFont(ROUTE.label, fonts.weight.display))));
      let span = ROUTE.span, wl = widest;
      for (let i = 0; i < 12; i++) {
        wl = (widest * rLabel) / ROUTE.label;
        span = Math.min(ROUTE.span, room - Math.max(120, wl));
        if ((n < 3 || wl <= (2 * span) / (n - 1) - 36) && span >= room * 0.6) break;
        rLabel = Math.max(ROUTE.label * 0.55, rLabel * 0.92);
      }
      const lab = rLabel * 1.6;
      const side = Math.max(60, wl / 2);
      W0 = span + 2 * side; H0 = ROUTE.rise + ROUTE.stop + 2 * lab;
      const x0 = side, y0 = lab + ROUTE.stop / 2;
      P = nodes.map((_, k) => [x0 + (k * span) / (n - 1), y0 + (k % 2 ? ROUTE.rise : 0)]);
      legs = P.slice(1).map((q, k) => { const p = P[k], mx = (p[0] + q[0]) / 2; return polyline([p, [mx, p[1]], [mx, q[1]], q], 0); });
    }
    const box = place(ctx, W0, H0);
    const s = box.s;
    const root = h('div', { style: { position: 'absolute', left: `${box.x + (box.w - W0 * s) / 2}px`, top: `${box.y}px`, width: `${W0}px`, height: `${H0}px`, transform: s < 0.999 ? `scale(${s})` : '', transformOrigin: '0 0' } });
    el.append(root);
    const svg = mk('svg', { width: W0, height: H0, viewBox: `0 0 ${W0} ${H0}` });
    Object.assign(svg.style, { position: 'absolute', left: '0', top: '0', overflow: 'visible' });
    root.append(svg);

    // ---- timing: node k lands at T[k]; the leg into it draws over D[k] and ends as it lands
    const nexts = beats.filter((b) => b.do === 'next').map((b) => b.t);
    const D = [0, ...legs.map((lg) => (kind === 'chain' ? CHAIN.lead : F(Math.round(Math.max(ROUTE.minFrames, Math.min(ROUTE.maxFrames, (12 * lg.len) / ROUTE.pxPer12))))))];   // whole frames
    const T = [tIn];
    for (let k = 1; k < n; k++) T.push(snap(Math.max(T[k - 1] + D[k], nexts[k - 1] != null ? nexts[k - 1] : T[k - 1] + GAP + D[k])));

    // ---- legs
    const paths = legs.map((lg) => {
      const p = mk('path', { d: dOf(lg), fill: 'none', stroke: col, 'stroke-width': kind === 'chain' ? CHAIN.line : ROUTE.line, 'stroke-linecap': 'butt', 'stroke-linejoin': 'miter' });
      p.style.strokeDasharray = `${lg.len} ${lg.len + 10}`;
      svg.append(p);
      return p;
    });
    let head = null;
    if (kind === 'route') { head = mk('rect', { x: -ROUTE.head / 2, y: -ROUTE.head / 2, width: ROUTE.head, height: ROUTE.head, fill: col, visibility: 'hidden' }); svg.append(head); }

    // ---- nodes
    const parts = nodes.map((nd, k) => {
      let e;
      if (kind === 'chain') {
        if (dark) {
          // on a dark field the nodes are outlined glass cards (clip02@603)
          e = h('div', { style: { position: 'absolute', left: `${P[k][0] - CHAIN.w / 2}px`, top: `${P[k][1] - CHAIN.h / 2}px`, width: `${CHAIN.w}px`, height: `${CHAIN.h}px`, boxSizing: 'border-box',
            borderRadius: `${CHAIN.radius}px`, border: '3px solid rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.12)' } });
        } else e = card(S, { x: P[k][0] - CHAIN.w / 2, y: P[k][1] - CHAIN.h / 2, w: CHAIN.w, h: CHAIN.h, radius: CHAIN.radius }).el;
        const d = 56;
        e.append(h('div', { text: String(k + 1), style: { position: 'absolute', left: '30px', top: `${CHAIN.h / 2 - d / 2}px`, width: `${d}px`, height: `${d}px`, borderRadius: '50%',
          background: dark ? colour.white : col, color: dark ? colour.ink : colour.white, font: sansFont(30, fonts.weight.display), lineHeight: `${d}px`, textAlign: 'center' } }));
        const sz = Math.min(CHAIN.label, (CHAIN.w - 130) / Math.max(1, measureText(nd.label, sansFont(100, fonts.weight.heavy)) / 100));
        e.append(h('div', { text: nd.label, style: { position: 'absolute', left: `${30 + d + 22}px`, top: `${(CHAIN.h / 2 + (sz * cap) / 2 - sz * fonts.M.base).toFixed(1)}px`, whiteSpace: 'nowrap',
          font: sansFont(sz, fonts.weight.heavy), letterSpacing: '-0.3px', color: ink } }));
      } else {
        e = h('div', { style: { position: 'absolute', left: `${P[k][0] - ROUTE.stop / 2}px`, top: `${P[k][1] - ROUTE.stop / 2}px`, width: `${ROUTE.stop}px`, height: `${ROUTE.stop}px`, borderRadius: '50%',
          boxSizing: 'border-box', border: `${ROUTE.ring}px solid ${col}`, background: colour.white, boxShadow: colour.shadow.card } });
        const above = k % 2 === 0;
        const ly = above ? -rLabel * 0.7 : ROUTE.stop + rLabel * 0.7 + rLabel * cap;
        e.append(h('div', { text: nd.label, style: { position: 'absolute', left: `${ROUTE.stop / 2}px`, top: `${(ly - rLabel * fonts.M.base).toFixed(1)}px`, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
          font: sansFont(rLabel, fonts.weight.display), letterSpacing: '-0.4px', color: ink } }));
      }
      root.append(e);
      return e;
    });
    let token = null;
    const whole = kind === 'route' && params.token ? polyline(legs.flatMap((lg, k) => (k ? lg.pts.slice(1) : lg.pts)), 0) : null;
    if (whole) {
      token = h('div', { style: { position: 'absolute', left: `${-TOKEN.d / 2}px`, top: `${-TOKEN.d / 2}px`, width: `${TOKEN.d}px`, height: `${TOKEN.d}px`, borderRadius: '50%',
        background: col, border: `8px solid ${colour.white}`, boxSizing: 'border-box', boxShadow: colour.shadow.card, visibility: 'hidden' } });
      root.append(token);
    }
    const tTok = snap(T[n - 1] + TOKEN.after);

    return {
      el, box,
      seek(t) {
        t += 1e-4;
        let tip = null;
        legs.forEach((lg, i) => {
          const k = i + 1, t0 = T[k] - D[k];
          const p = t <= t0 ? 0 : t >= T[k] ? 1 : outCubic((t - t0) / D[k]);
          const len = lg.len * p;
          setStyle(paths[i], 'strokeDashoffset', `${(lg.len - len).toFixed(2)}`);
          setStyle(paths[i], 'visibility', p > 0 ? 'visible' : 'hidden');
          if (p > 0 && p < 1) tip = at(lg, len);
        });
        if (head) {
          if (tip) { head.setAttribute('visibility', 'visible'); head.setAttribute('transform', `translate(${tip.x.toFixed(2)} ${tip.y.toFixed(2)}) rotate(${(tip.a * 180 / Math.PI).toFixed(1)})`); }
          else head.setAttribute('visibility', 'hidden');
        }
        parts.forEach((e, k) => applyPart(e, partAt(S, t - T[k], k === 0 ? 'pop' : 'grow'), '50% 50%'));
        if (token) {
          const u = (t - tTok) / TOKEN.dur;
          if (u < 0) setStyle(token, 'visibility', 'hidden');
          else { const q = at(whole, whole.len * S.E.move(clamp01(u))); setStyle(token, 'visibility', 'visible'); setStyle(token, 'transform', `translate(${q.x.toFixed(2)}px, ${q.y.toFixed(2)}px)`); }
        }
      },
    };
  },
};
