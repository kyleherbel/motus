// The one card component every proof sits in: fixed width, white fill, thin accent
// outline, small radius, two glints circling the outline, and (for web sources) a
// fixed-size browser chrome with the true URL.
import { layout, motion, fonts } from './tokens.js';

/**
 * Two soft glints running clockwise round a rounded rectangle, half a lap apart.
 * Returns { el, seek(t) }. el is w x h, positioned by the caller.
 */
export function glintRing(S, { w, h, radius, inset = 1.5, thickness = motion.glint.thickness, phase = 0, t0 = 0, colour }) {
  const { kit, C } = S;
  const r = Math.max(0, radius - inset), x = inset, y = inset, rw = w - 2 * inset, rh = h - 2 * inset;
  const per = 2 * (rw + rh) - 8 * r + 2 * Math.PI * r;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', w); svg.setAttribute('height', h); svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  Object.assign(svg.style, { position: 'absolute', left: '0', top: '0', overflow: 'visible', pointerEvents: 'none' });
  const id = `ep-glint-${S.uid()}`;
  svg.innerHTML = `<defs><filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.2"/></filter></defs>`;
  // a rounded-rect path starting at the top-left corner's end, drawn clockwise
  const d = `M${x + r} ${y}H${x + rw - r}A${r} ${r} 0 0 1 ${x + rw} ${y + r}V${y + rh - r}A${r} ${r} 0 0 1 ${x + rw - r} ${y + rh}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + rh - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const tail = per * motion.glint.tailFrac, head = Math.max(40, per * motion.glint.headFrac);
  const layers = [
    { len: tail, o: 0.55, wd: thickness * 0.34, blur: false, c: C.glintTail },
    { len: tail * 0.6, o: 0.5, wd: thickness * 0.8, blur: true, c: C.glintTail },
    { len: head, o: 1, wd: thickness * 0.4, blur: false, c: colour || C.glint },
    { len: head * 0.9, o: 0.6, wd: thickness * 1.2, blur: true, c: colour || C.glint },
  ].map((L) => {
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', L.c);
    p.setAttribute('stroke-width', L.wd); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-opacity', L.o);
    p.setAttribute('stroke-dasharray', `${L.len} ${per / 2 - L.len}`);
    if (L.blur) p.setAttribute('filter', `url(#${id})`);
    svg.append(p);
    return { p, len: L.len };
  });
  return {
    el: svg, perimeter: per,
    seek(t) {
      const local = t - t0 - motion.glint.delay;
      const on = local >= 0;
      svg.style.display = on ? '' : 'none';
      if (!on) return;
      // one lap takes 8 s whatever the size; two glints half a lap apart, on the video's own clock
      const lapPos = (((t * 30 - motion.glint.phaseFrame) / (motion.glint.lap * 30)) % 0.5 + 0.5) % 0.5;
      const pos = (lapPos + phase * 0) * per;
      svg.style.opacity = String(kit.clamp(local / 0.2));
      for (const L of layers) L.p.setAttribute('stroke-dashoffset', String(-(pos - L.len)));
    },
  };
}

// Browser-chrome glyphs, drawn here (generic shapes, no third-party artwork).
const ICON = {
  lock: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M4.5 7V5a3.5 3.5 0 1 1 7 0v2h.5A1.5 1.5 0 0 1 13.5 8.5v5A1.5 1.5 0 0 1 12 15H4a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 4 7h.5Zm2 0h3V5a1.5 1.5 0 0 0-3 0v2Z" fill="currentColor"/></svg>',
  sidebar: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M9 5v14"/></svg>',
  back: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg>',
  share: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5M6 11v7.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V11"/></svg>',
  plus: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  tabs: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="4" y="8" width="12" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2"/></svg>',
};

/** "github.com/owner/repo" -> { host, path } for the URL pill. */
export function splitUrl(url) {
  if (!url) return { host: '', path: '' };
  const clean = String(url).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[?#].*$/, '').replace(/\/$/, '');
  const i = clean.indexOf('/');
  return i < 0 ? { host: clean, path: '' } : { host: clean.slice(0, i), path: clean.slice(i) };
}

/**
 * Build a card. opt: { w, h, mode: 'light'|'dark'|'white', chrome: { url } | null, counter: '2/5' | null,
 *                      fill, tIn (for the glints), shadow }
 * Returns { el, body, bodyH, seek(t) }: put content in `body` (position: relative, overflow hidden).
 */
export function cardFrame(S, opt) {
  const { kit, C } = S; const { h } = kit;
  const { w, mode = 'light' } = opt; const H = opt.h;
  const R = layout.card.radius;
  const stroke = mode === 'dark' ? layout.card.strokeDark : layout.card.stroke;
  const chromeH = opt.chrome ? 65 : 0;

  const el = h('div.ep-card', { style: { position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${H}px`, borderRadius: `${R}px`, background: opt.fill || C.cardFill, overflow: 'hidden',
    boxShadow: mode === 'dark' ? `0 0 20px ${C.outlineGlow}` : C.cardShadow } });

  let bar = null;
  if (opt.chrome) {
    const { host, path } = splitUrl(opt.chrome.url);
    const lights = [[34, C.lightRed], [60, C.lightYellow], [86, C.lightGreen]].map(([cx, c]) => h('div', { style: { position: 'absolute', left: `${cx - 8}px`, top: '27px', width: '16px', height: '16px', borderRadius: '50%', background: c, boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' } }));
    const icon = (name, x, col = '#6C6C72', size = 24) => h('div', { html: ICON[name], style: { position: 'absolute', left: `${x}px`, top: `${35 - size / 2}px`, width: `${size}px`, height: `${size}px`, color: col, lineHeight: '0' } });
    const pill = h('div', { style: { position: 'absolute', left: '198px', top: '16px', width: `${Math.min(496, w - 198 - 170)}px`, height: '38px', borderRadius: '9px', background: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', font: `600 21px/1 ${fonts.sans}`, letterSpacing: '-0.01em', color: '#1B1B1F', whiteSpace: 'nowrap', overflow: 'hidden' } },
      h('span', { html: ICON.lock, style: { color: '#55555B', lineHeight: '0', flex: 'none' } }),
      h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, h('span', { text: host }), h('span', { text: path, style: { color: '#77777E', fontWeight: '500' } })));
    const right = opt.counter
      ? [counterPill(S, opt.counter, { right: layout.counter.right, top: layout.counter.top })]
      : [icon('share', w - 134), icon('plus', w - 92), icon('tabs', w - 50)];
    bar = h('div.ep-chrome', { style: { position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${chromeH}px`, background: `linear-gradient(${C.chromeTop}, ${C.chromeBottom})`, borderBottom: `1px solid ${C.chromeLine}`, boxSizing: 'border-box' } },
      ...lights, icon('sidebar', 118), icon('back', 158), pill, ...right);
  }
  const bodyH = H - chromeH;
  const body = h('div.ep-card-body', { style: { position: 'absolute', left: '0', top: `${chromeH}px`, width: `${w}px`, height: `${bodyH}px`, overflow: 'hidden' } });
  const edge = h('div.ep-card-edge', { style: { position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${H}px`, borderRadius: `${R}px`, boxSizing: 'border-box', border: `${stroke}px solid ${C.outline}`, pointerEvents: 'none' } });
  const ring = glintRing(S, { w, h: H, radius: R, inset: stroke / 2, t0: opt.tIn ?? 0, phase: opt.phase ?? (S.uid() * 0.173) % 1 });
  el.append(body);
  if (bar) el.append(bar);
  if (!opt.chrome && opt.counter) el.append(counterPill(S, opt.counter, { right: layout.counter.right, top: layout.counter.top }));
  const overlay = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${H}px`, pointerEvents: 'none' } });
  el.append(overlay, edge, ring.el);
  return { el, body, bodyH, bodyW: w, chromeH, overlay, ring, seek(t) { ring.seek(t); } };
}

/** The "2 / 5" progress pill of numbered-list videos. */
export function counterPill(S, text, pos) {
  const { kit, C } = S; const { h } = kit;
  const [n, total] = String(text).split('/').map((s) => s.trim());
  return h('div.ep-counter', { style: { position: 'absolute', right: `${pos.right}px`, top: `${pos.top}px`, width: `${layout.counter.w}px`, height: `${layout.counter.h}px`, borderRadius: `${layout.counter.h / 2}px`, background: C.counter, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', font: `700 25px/1 ${fonts.sans}`, color: C.counterText, letterSpacing: '0' } },
    h('span', { text: n }), h('span', { text: '/', style: { color: '#8D8D94', fontWeight: '600' } }), h('span', { text: total ?? '', style: { color: '#8D8D94', fontWeight: '600' } }));
}
