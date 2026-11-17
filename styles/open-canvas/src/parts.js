// The furniture of the design file (research/graphics.md G02-G06): selection frames with handles, the cursor,
// the highlight box and the tap dot. All of it is drawn in code; nothing here is taken from the reference.
import { colour, parts as P } from './tokens.js';
import { setStyle, px, rgba } from './common.js';

/**
 * A selection frame: a 4 px outline, round corner handles and pill handles at the middle of each side [G02, G03].
 * Returns { el, body, place(x, y, w, h, mids) }. Children of `body` are clipped to the frame.
 */
export function selFrame(S, { color = S.theme.sel, clip = true, mids = true } = {}) {
  const { h } = S.kit;
  const F = P.frame;
  const body = h('div', { style: { position: 'absolute', inset: '0', overflow: clip ? 'hidden' : 'visible', background: clip ? '#000' : '' } });
  const line = h('div', { style: { position: 'absolute', inset: '-2px', border: `${F.stroke}px solid ${color}`, boxShadow: F.shadow, pointerEvents: 'none' } });
  const dot = () => h('div', { style: { position: 'absolute', width: `${F.dot}px`, height: `${F.dot}px`, borderRadius: '50%', background: color, border: `${F.rim}px solid ${colour.handleEdge}`, boxSizing: 'border-box' } });
  const pill = (vert) => h('div', { style: { position: 'absolute', width: `${vert ? F.pill[1] : F.pill[0]}px`, height: `${vert ? F.pill[0] : F.pill[1]}px`, borderRadius: `${F.pill[1] / 2}px`,
    background: color, border: `${F.rim}px solid ${colour.handleEdge}`, boxSizing: 'border-box' } });
  const dots = [dot(), dot(), dot(), dot()];
  const pills = [pill(false), pill(false), pill(true), pill(true)];
  const el = h('div.oc-frame', { style: { position: 'absolute', left: '0', top: '0' } }, body, line, ...pills, ...dots);
  const at = (n, x, y, w, hh) => { setStyle(n, 'left', px(x - w / 2)); setStyle(n, 'top', px(y - hh / 2)); };
  return {
    el, body,
    place(x, y, w, hh, showMids = mids) {
      setStyle(el, 'left', px(x)); setStyle(el, 'top', px(y)); setStyle(el, 'width', px(w)); setStyle(el, 'height', px(hh));
      [[0, 0], [w, 0], [0, hh], [w, hh]].forEach(([cx, cy], k) => at(dots[k], cx, cy, F.dot, F.dot));
      const horiz = showMids && w > F.minForPills, vert = showMids && hh > F.minForPills;
      at(pills[0], w / 2, 0, F.pill[0], F.pill[1]); at(pills[1], w / 2, hh, F.pill[0], F.pill[1]);
      at(pills[2], 0, hh / 2, F.pill[1], F.pill[0]); at(pills[3], w, hh / 2, F.pill[1], F.pill[0]);
      setStyle(pills[0], 'display', horiz ? '' : 'none'); setStyle(pills[1], 'display', horiz ? '' : 'none');
      setStyle(pills[2], 'display', vert ? '' : 'none'); setStyle(pills[3], 'display', vert ? '' : 'none');
    },
  };
}

/** The mouse cursor: a white arrow with a dark rim [G04]. Returns { el, at(x, y) }; (x, y) is the tip. */
export function cursor(S) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', P.cursor.w); svg.setAttribute('height', P.cursor.h); svg.setAttribute('viewBox', '0 0 22 29');
  Object.assign(svg.style, { position: 'absolute', left: '0', top: '0', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.45))' });
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', 'M2 1.5 L2 22 L7.2 17.3 L10.6 26 L14.2 24.5 L10.8 16.2 L18 16 Z');
  path.setAttribute('fill', '#fff'); path.setAttribute('stroke', '#111'); path.setAttribute('stroke-width', '1.6'); path.setAttribute('stroke-linejoin', 'round');
  svg.append(path);
  return { el: svg, at(x, y) { setStyle(svg, 'transform', `translate(${(x - 3).toFixed(2)}px, ${(y - 2).toFixed(2)}px)`); } };
}

/** A highlight box on content: a thin accent outline with a faint tint and square handles; grows left to right [G05, M06]. */
export function highlight(S) {
  const { h } = S.kit;
  const c = S.theme.accent, K = P.highlight;
  const box = h('div', { style: { position: 'absolute', inset: '0', border: `${K.stroke}px solid ${c}`, background: rgba(c, K.tint), boxSizing: 'border-box' } });
  const sq = () => h('div', { style: { position: 'absolute', width: `${K.handle}px`, height: `${K.handle}px`, background: '#fff', border: `3px solid ${c}`, boxSizing: 'border-box' } });
  const hs = [sq(), sq(), sq(), sq()];
  const el = h('div.oc-highlight', { style: { position: 'absolute', left: '0', top: '0', display: 'none' } }, box, ...hs);
  return {
    el,
    /** p: 0..1 growth; p <= 0 hides it. */
    place(x, y, w, hh, p) {
      setStyle(el, 'display', p > 0 ? '' : 'none');
      if (p <= 0) return;
      const ww = Math.max(6, w * p);
      setStyle(el, 'left', px(x)); setStyle(el, 'top', px(y)); setStyle(el, 'width', px(ww)); setStyle(el, 'height', px(hh));
      [[0, 0], [ww, 0], [0, hh], [ww, hh]].forEach(([cx, cy], k) => { setStyle(hs[k], 'left', px(cx - K.handle / 2)); setStyle(hs[k], 'top', px(cy - K.handle / 2)); });
    },
  };
}

/** The tap dot: a translucent circle that slides to its target and presses [G06, M07]. */
export function tapDot(S) {
  const K = P.tapDot;
  const el = S.kit.h('div.oc-tap', { style: { position: 'absolute', left: `${-K.r}px`, top: `${-K.r}px`, width: `${2 * K.r}px`, height: `${2 * K.r}px`, borderRadius: '50%', background: K.fill,
    border: `${K.stroke}px solid #fff`, boxSizing: 'border-box', boxShadow: '0 4px 14px rgba(0,0,0,.35)', display: 'none' } });
  return {
    el,
    place(x, y, press, shrink, on) {
      setStyle(el, 'display', on ? '' : 'none');
      if (on) setStyle(el, 'transform', `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${(1 - shrink * press).toFixed(4)})`);
    },
  };
}
