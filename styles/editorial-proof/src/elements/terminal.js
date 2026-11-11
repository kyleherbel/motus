// A designed terminal: one fixed dark skin, never a real capture. Measured on the reference's
// terminal mocks (graphics G06/G26; 35 segments in 16 reels), frame by frame on
// clip38@79-200 and @402-537, clip37@356-524, clip19@234-390:
//   title bar     55 px to a 2 px separator, three 15 px lights, a small glyph + centred "tool — ~/dir"
//   splash        a large mark (glyph + name + dir) centred in the body; when the first command is
//                 sent it shrinks to half size at the top (12 frames, exponential approach)
//   input box     an outlined prompt at the bottom of the card; commands are typed there at
//                 1.79 characters per frame behind a block caret (blinks 8 frames on, 8 off)
//   transcript    on enter the command leaves the input box and lands as a filled prompt row;
//                 result lines follow one by one (5 frames apart, or on their words), rising 7 px;
//                 when the card is full the transcript scrolls up
//   lit row       a dark-blue bar with a bright left edge travels from line to line (8 frames,
//                 exponential approach); the lit line turns bold white and gets a check; a line it
//                 leaves keeps the check and turns blue
// The reference draws a product mascot in the splash and title; this skin draws an original
// pixel ">_" tile instead.
import { cardFrame } from '../card.js';
import { fonts, type, F } from '../tokens.js';

// ---- TOKENS (card px; the card is 894 wide). Kept local until tokens.js takes them.
const G = {
  bar: { h: 55, sep: 2, sepColour: '#2A2A2A', lightD: 15, lightX: [32, 55, 78] },   // Dfclm@168: bar 259-309, sep 310-311; lights 15-16 px at x+32/55/78
  title: { size: 20.6, weight: 600, colour: '#CAC9C5', glyphW: 24, gap: 12, capTop: 19.5 },   // ink 275-292 (rel 20-37), glyph 399-422, text 434-680
  body: '#131313',                 // measured on Dfclm and Dfbwm (study: #111111)
  inset: 24,                       // rows x 117-963 on a card at x 93
  row: { hPerSize: 1.97, radius: 8, fill: '#242428', promptX: 41, textX: 69, gapAfter: 21, fitW: 720 },   // 46 px at 23.4 px type (Dfclm), 56 at 28.3 (Dfbwm); text fills <= 700 px
  mono: { size: 28, min: 21, floor: 17 },                     // Dfbwm: 17.0 px advance = 28.3 px JetBrains Mono; Dfclm 23.4-33 px
  line: { pitch: 48, bulletX: 45, bulletD: 19, textX: 72, heading: 1.18, headingPitch: 66, itemX: 99, item: 26 / 28, itemGap: 10 },   // pitch 48 in both reels; bullets 19-21 px; '+' items at +99, 26 px under 28 px lines, 10 px apart from what precedes them
  input: { h: 66, border: 2, colour: '#393939', radius: 12, bottom: 24, inset: 23, promptX: 45, textX: 77, fitW: 770 },   // Dfclm 1188-1253, x 116-964; 28 px type, smaller only when the command is long
  caret: { w: 0.9, h: 1.1, colour: '#EFEFEF', period: 16, on: 8 },   // 13-16 x 27-31 px; on 8 / off 8 frames
  splash: { top: 16, glyph: [108, 72], name: 38, sub: 15, nameBase: 141, subTop: 152, h: 196, large: 2 },   // compact (from the separator): glyph 328-399, name ink 426-453, dir 465-482, next row at 508
  ink: { text: '#EEEEEE', dim: '#9A9A9E', prompt: '#9E9EA3', name: '#F1F1F1' },     // #EEEDF2, #8F8E8C-#9E9FA1, '>' #9E9EA3
  lit: { fill: '#0E2942', edge: 5, radius: 10, text: '#F7FFFF', check: '#71BDFC', doneHead: '#77B9F4', doneText: '#D1D9E5' },   // Dfclm@450-537
};
const M = {
  cps: 1.79 * 30,                   // 50 characters in 28 frames (Dfclm@94-122), 2-2-1 rhythm
  compact: { lead: F(2), tau: F(2.6), cap: F(12) },           // splash moves 2 frames before the last key, done in 12
  clear: F(2),                      // the input empties
  prompt: { after: F(3), rise: 11, dur: F(4) },                // the sent command lands in the transcript
  line: { after: F(5), stagger: F(5), rise: 7, dur: F(4), fade: F(3) },
  scroll: F(8),
  firstType: F(12),                 // typing starts this long after the card arrives when no word is given
  lit: { tau: F(1.85), cap: F(8), edgeIn: F(1), fillIn: F(3), check: F(2) },
};

// an original pixel tile with ">_" cut out (12 x 8 cells): '#' fill, ' ' hole, '.' nothing
const TILE = ['.##########.', '############', '##  ########', '### ########', '### ########', '##  ##   ###', '############', '.##########.'];
const tileSvg = (w, h, colour) => {
  const cw = w / 12, ch = h / 8;
  const cells = [];
  TILE.forEach((row, y) => [...row].forEach((c, x) => { if (c === '#') cells.push(`<rect x="${(x * cw).toFixed(2)}" y="${(y * ch).toFixed(2)}" width="${(cw + 0.3).toFixed(2)}" height="${(ch + 0.3).toFixed(2)}"/>`); }));
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="${colour}" style="display:block" shape-rendering="crispEdges">${cells.join('')}</svg>`;
};
const CHECK = (w, colour) => `<svg width="${w}" height="${w * 0.75}" viewBox="0 0 32 24" style="display:block"><path d="M3 12.5L11.5 21L29 3" fill="none" stroke="${colour}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const approach = (t, t0, tau, cap) => (t <= t0 ? 0 : Math.min(1, (1 - Math.exp(-(t - t0) / tau)) / (1 - Math.exp(-cap / tau))));

export default {
  type: 'terminal',
  label: 'Terminal',
  slots: ['card'],
  params: {
    title: { type: 'string', maxChars: 34 },                                  // "agent — ~/website": tool, then the folder
    splash: { type: 'string', optional: true, maxChars: 16, maxWords: 3 },   // the welcome mark before the first command ("Agent CLI")
    commands: { type: 'array', min: 1, max: 3, of: {
      text: { type: 'string', maxChars: 64 },                                // typed character by character, then sent
      at: 'word?',                                                           // the word on which typing starts (default: in sequence)
    } },
    lines: { type: 'array', optional: true, max: 12, of: {
      text: { type: 'string', maxChars: 48 },                                // "Read(src/api/routes.ts)": a Tool(args) line sets the tool bold
      kind: 'enum?:plain|ok|dim|heading',                                    // ok = green bullet, dim = indented sub-result, heading = bold
      at: 'word?',                                                           // the word on which it appears (default: one after another)
      after: { type: 'number', optional: true, min: 1, max: 3 },            // which command it answers (default: the last)
    } },
  },
  beats: {
    highlight: { line: { type: 'number', min: 1, max: 12 }, check: 'boolean?' },   // light a result line (the bar travels to it)
  },
  tone: 'dark',

  prefer(params, { mode, maxH }) { return { h: mode === 'dark' ? Math.min(maxH, 1022) : maxH }; },

  build(ctx) {
    const { S, params, rect, mode, tIn, beats } = ctx; const { kit, C } = S; const { h } = kit;
    const W = rect.w, H = rect.h;
    const card = cardFrame(S, { w: W, h: H, mode, tIn, fill: G.body });
    const root = card.body;
    const mono = (size, weight = 400) => `${weight} ${size}px ${fonts.mono}`;

    // ---- title bar
    const [tool, dir] = String(params.title).split(/\s+[-–—]\s+/);
    const titleText = dir ? `${tool} — ${dir}` : tool;
    const tFont = `${G.title.weight} ${G.title.size}px ${fonts.sans}`;
    const tW = kit.measure(titleText, tFont, -0.01 * G.title.size);
    const tX = (W - (G.title.glyphW + G.title.gap + tW)) / 2;
    const bar = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${G.bar.h}px`, background: C.termBar, borderBottom: `${G.bar.sep}px solid ${G.bar.sepColour}` } },
      ...[C.lightRed, C.lightYellow, C.lightGreen].map((c, i) => h('div', { style: { position: 'absolute', left: `${G.bar.lightX[i] - G.bar.lightD / 2}px`, top: `${G.bar.h / 2 + 1 - G.bar.lightD / 2}px`, width: `${G.bar.lightD}px`, height: `${G.bar.lightD}px`, borderRadius: '50%', background: c } })),
      h('div', { html: tileSvg(G.title.glyphW, 16, C.termAccent), style: { position: 'absolute', left: `${tX}px`, top: `${G.title.capTop + 0.5}px`, lineHeight: '0' } }),
      h('div', { text: titleText, style: { position: 'absolute', left: `${tX + G.title.glyphW + G.title.gap}px`, top: `${G.title.capTop + G.title.size * type.capRatio.sans - G.title.size * type.ascent.sans}px`, font: `${tFont}`, lineHeight: '1', letterSpacing: '-0.01em', color: G.title.colour, whiteSpace: 'nowrap' } }));

    // ---- geometry
    const top0 = G.bar.h + G.bar.sep;                       // body content starts under the separator
    const inTop = H - G.input.bottom - G.input.h;           // input box
    const viewBottom = inTop - 16;
    const textW = W - G.line.textX - G.inset - 12;

    // one mono size for the transcript: the measured 28 px unless a line needs less
    const lineList = params.lines || [];
    const plainOf = (L) => (L.kind === 'dim' ? `└  ${L.text}` : L.text);
    let ms = G.mono.size;
    for (const L of lineList) {
      const k = L.kind === 'heading' ? G.line.heading : 1;
      const xw = L.kind === 'dim' ? textW : textW;
      while (ms > G.mono.min && kit.measure(plainOf(L), mono(ms * k, L.kind === 'heading' ? 700 : 400)) > xw) ms -= 0.5;
    }
    const adv = kit.measure('M', mono(ms));
    // commands: one size for the input box and the prompt rows
    const cmds = params.commands.map((c) => ({ ...c, text: String(c.text) }));
    const fit = (maxW) => { let z = G.mono.size; for (const c of cmds) while (z > G.mono.floor && kit.measure(c.text + ' ', mono(z)) > maxW) z -= 0.5; return z; };
    const cs = fit(G.row.fitW), is = fit(G.input.fitW);          // prompt rows / input box
    const rowH = Math.round(cs * G.row.hPerSize);
    const iadv = kit.measure('M', mono(is));

    // ---- timing: typing, sending, lines
    let cursor = tIn + M.firstType;
    const linesOf = cmds.map(() => []);
    lineList.forEach((L, j) => { const k = Math.min(cmds.length, L.after || cmds.length) - 1; linesOf[k].push(j); });
    const lineT = new Array(lineList.length);
    cmds.forEach((c, k) => {
      c.t0 = c.at !== undefined ? Math.max(S.wordTime(c.at), k ? cursor : tIn) : cursor;
      c.dur = c.text.length / M.cps;
      c.sent = c.t0 + c.dur;
      c.rowAt = c.sent + M.prompt.after;
      S.sfx(c.t0, 'type');
      let tl = c.rowAt + M.line.after;
      for (const j of linesOf[k]) {
        const L = lineList[j];
        const want = L.at !== undefined ? S.wordTime(L.at) : tl;
        lineT[j] = Math.max(want, c.rowAt + M.line.after);
        tl = lineT[j] + M.line.stagger;
      }
      cursor = Math.max(tl, c.sent + F(10));
    });

    // ---- transcript content (scrolls inside a clip under the bar)
    const view = h('div', { style: { position: 'absolute', left: '0', top: `${top0}px`, width: `${W}px`, height: `${viewBottom - top0}px`, overflow: 'hidden' } });
    const track = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: '0' } });
    view.append(track);
    root.append(view, bar);

    // splash
    let splash = null;
    let y = 0;
    if (params.splash) {
      const sp = G.splash;
      const box = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${sp.h}px`, transformOrigin: `${W / 2}px 0px` } },
        h('div', { html: tileSvg(sp.glyph[0], sp.glyph[1], C.termAccent), style: { position: 'absolute', left: `${(W - sp.glyph[0]) / 2}px`, top: `${sp.top}px`, lineHeight: '0' } }),
        h('div', { text: params.splash, style: { position: 'absolute', left: '0', width: `${W}px`, top: `${sp.nameBase - sp.name * type.ascent.sans}px`, textAlign: 'center', font: `700 ${sp.name}px/1 ${fonts.sans}`, letterSpacing: '-0.03em', color: G.ink.name, whiteSpace: 'nowrap' } }),
        dir ? h('div', { text: dir, style: { position: 'absolute', left: '0', width: `${W}px`, top: `${sp.subTop}px`, textAlign: 'center', font: `400 ${sp.sub}px/1 ${fonts.mono}`, color: G.ink.dim, whiteSpace: 'nowrap' } }) : null);
      track.append(box);
      // large: twice the size, centred between the bar and the input box
      // large: twice the size (less when the card is short), centred between the bar and the input box
      const large = Math.min(sp.large, (viewBottom - top0 - 24) / sp.h);
      const largeTop = Math.max(0, (viewBottom - top0) / 2 - (sp.h * large) / 2 + 44 * (large - 1));   // Dfclm@116: glyph top 628 on a 1022 px card
      splash = { box, largeTop, large, at: cmds[0].sent - M.compact.lead };
      y = sp.h;
    } else y = 20;

    const items = [];                                       // everything that arrives in the transcript, in order
    const lineEls = [];
    cmds.forEach((c, k) => {
      const ry = y;
      const row = h('div', { style: { position: 'absolute', left: `${G.inset}px`, top: `${ry}px`, width: `${W - 2 * G.inset}px`, height: `${rowH}px`, borderRadius: `${G.row.radius}px`, background: G.row.fill } },
        h('div', { text: '>', style: { position: 'absolute', left: `${G.row.promptX - G.inset}px`, top: '0', height: `${rowH}px`, display: 'flex', alignItems: 'center', font: `${mono(cs)}`, color: G.ink.prompt } }),
        h('div', { text: c.text, style: { position: 'absolute', left: `${G.row.textX - G.inset}px`, top: '0', height: `${rowH}px`, display: 'flex', alignItems: 'center', font: `${mono(cs)}`, color: G.ink.text, whiteSpace: 'pre' } }));
      track.append(row);
      items.push({ el: row, at: c.rowAt, y: ry, bottom: ry + rowH, rise: M.prompt.rise, dur: M.prompt.dur });
      y = ry + rowH + G.row.gapAfter;
      for (const j of linesOf[k]) {
        const L = lineList[j];
        const kind = L.kind || 'plain';
        const pitch = kind === 'heading' ? G.line.headingPitch : G.line.pitch;
        const item = kind === 'plain' && /^\+\s/.test(L.text);
        const size = kind === 'heading' ? ms * G.line.heading : item ? ms * G.line.item : ms;
        if (item && !(lineEls.length && lineEls[lineEls.length - 1] && lineEls[lineEls.length - 1].item)) y += G.line.itemGap;
        const weight = kind === 'heading' ? 700 : 400;
        const ly = y;
        const el = h('div', { style: { position: 'absolute', left: '0', top: `${ly}px`, width: `${W}px`, height: `${pitch}px` } });
        const cy = pitch / 2;
        if (kind === 'ok' || kind === 'heading') el.append(h('div', { style: { position: 'absolute', left: `${G.line.bulletX - G.line.bulletD / 2}px`, top: `${cy - G.line.bulletD / 2}px`, width: `${G.line.bulletD}px`, height: `${G.line.bulletD}px`, borderRadius: '50%', background: C.termGreen } }));
        // text: a "Tool(args)" line sets the tool bold and the arguments dim; a leading "+ " is green
        const txt = h('div', { style: { position: 'absolute', left: `${item ? G.line.itemX : G.line.textX}px`, top: `${cy - size / 2}px`, height: `${size}px`, font: mono(size, weight), lineHeight: '1', whiteSpace: 'pre', color: kind === 'dim' ? G.ink.dim : G.ink.text } });
        const m = kind !== 'dim' ? /^([A-Za-z][\w.:-]*)(\(.*\))\s*$/.exec(L.text) : null;
        let head = null, rest = null;
        if (kind === 'dim') { txt.append(h('span', { text: '└  ', style: { color: G.ink.dim } }), (rest = h('span', { text: L.text }))); }
        else if (m) { head = h('span', { text: m[1], style: { fontWeight: '700' } }); rest = h('span', { text: m[2], style: { color: G.ink.dim } }); txt.append(head, rest); }
        else if (item) { txt.append(h('span', { text: '+ ', style: { color: C.termGreen } }), (rest = h('span', { text: L.text.replace(/^\+\s+/, '') }))); }
        else { const sp = L.text.indexOf(' '); head = h('span', { text: sp > 0 ? L.text.slice(0, sp) : L.text }); rest = h('span', { text: sp > 0 ? L.text.slice(sp) : '' }); txt.append(head, rest); }
        el.append(txt);
        track.append(el);
        const it = { el, at: lineT[j], y: ly, bottom: ly + pitch, rise: M.line.rise, dur: M.line.dur, line: j, txt, head, rest, kind, pitch, weight, restDim: !!m, item };
        items.push(it); lineEls[j] = it;
        y = ly + pitch;
      }
      y += 10;
    });

    // ---- scrolling: each arrival that overflows the view moves the transcript up
    const viewH = viewBottom - top0;
    const scrolls = [];
    let off = 0;
    for (const it of [...items].sort((a, b) => a.at - b.at)) {
      const need = Math.max(0, it.bottom + 12 - viewH);
      if (need > off) { scrolls.push({ t: it.at - F(1), d: need - off }); off = need; }
    }
    const scrollAt = (t) => scrolls.reduce((s, e) => s + e.d * S.E.incard(kit.clamp((t - e.t) / M.scroll)), 0);

    // ---- lit row
    const litBeats = beats.filter((b) => b.do === 'highlight' && lineEls[b.line - 1]);
    // the lit bar is the accent at 20 % over the body (measured #0E2942 for blue); its check a pale accent
    const blue = C.accentName === 'blue';
    const acc = [16, 8, 0].map((sh) => (parseInt(C.accent.slice(1), 16) >> sh) & 255);
    const litRGB = blue ? [14, 41, 66] : acc.map((v) => Math.round(19 + (v - 19) * 0.2));
    const litCheck = blue ? G.lit.check : C.accentSerifDark, doneHead = blue ? G.lit.doneHead : C.accentSerifDark;
    const lit = h('div', { style: { position: 'absolute', left: `${G.inset - 3}px`, top: '0', width: `${W - 2 * G.inset + 5}px`, height: '0', borderRadius: `${G.lit.radius}px`, background: G.lit.fill, overflow: 'hidden', display: 'none' } },
      h('div', { style: { position: 'absolute', left: '0', top: '0', bottom: '0', width: `${G.lit.edge}px`, background: C.accent } }));
    const litEdge = lit.firstChild;
    track.insertBefore(lit, track.firstChild);
    const checks = litBeats.map((b) => {
      const it = lineEls[b.line - 1];
      const cw = Math.round(it.pitch * 0.55);
      const el = h('div', { html: CHECK(cw, litCheck), style: { position: 'absolute', left: `${W - G.inset - 18 - cw}px`, top: `${it.y + it.pitch / 2 - cw * 0.375}px`, lineHeight: '0', display: 'none', transformOrigin: '50% 50%' } });
      track.append(el);
      S.sfx(b.t, 'highlight');
      return { b, it, el, svg: el.querySelector('path'), show: b.check !== false };
    });

    // ---- input box with the caret
    const inp = h('div', { style: { position: 'absolute', left: `${G.input.inset}px`, top: `${inTop}px`, width: `${W - 2 * G.input.inset}px`, height: `${G.input.h}px`, boxSizing: 'border-box', border: `${G.input.border}px solid ${G.input.colour}`, borderRadius: `${G.input.radius}px` } });
    const inPrompt = h('div', { text: '>', style: { position: 'absolute', left: `${G.input.promptX - G.input.inset - G.input.border}px`, top: '0', bottom: '0', display: 'flex', alignItems: 'center', font: mono(is), color: G.ink.prompt } });
    const inText = h('div', { style: { position: 'absolute', left: `${G.input.textX - G.input.inset - G.input.border}px`, top: '0', bottom: '0', display: 'flex', alignItems: 'center', font: mono(is), color: G.ink.text, whiteSpace: 'pre' } });
    const caretH = is * G.caret.h, caretW = iadv * G.caret.w;
    const caret = h('div', { style: { position: 'absolute', left: '0', top: `${(G.input.h - 2 * G.input.border - caretH) / 2}px`, width: `${caretW}px`, height: `${caretH}px`, background: G.caret.colour } });
    inp.append(inPrompt, inText, caret);
    root.append(inp);

    const litTarget = (t) => {
      let cur = null;
      for (const c of checks) if (t >= c.b.t) cur = c;
      return cur;
    };

    return {
      el: card.el,
      tone: 'dark',
      seek(t) {
        card.seek(t);
        // splash: large until the first command is sent, then half size at the top
        if (splash) {
          const p = approach(t, splash.at, M.compact.tau, M.compact.cap);
          const sc = splash.large + (1 - splash.large) * p;
          const ty = splash.largeTop * (1 - p);
          splash.box.style.transform = `translateY(${ty.toFixed(2)}px) scale(${sc.toFixed(4)})`;
        }
        // arrivals
        for (const it of items) {
          const on = t >= it.at;
          it.el.style.display = on ? '' : 'none';
          if (!on) continue;
          const p = approach(t, it.at, it.dur / 2.2, it.dur);
          it.el.style.opacity = String(kit.clamp((t - it.at + F(1)) / (it.dur * 0.75)));
          it.el.style.transform = p >= 1 ? 'none' : `translateY(${(it.rise * (1 - p)).toFixed(2)}px)`;
        }
        track.style.transform = `translateY(${(-scrollAt(t)).toFixed(2)}px)`;
        // typing
        let typed = '', active = null;
        for (const c of cmds) if (t >= c.t0 && t < c.sent + M.clear) active = c;
        if (active) typed = active.text.slice(0, Math.min(active.text.length, Math.floor((t - active.t0) * M.cps + 1e-6)));
        if (inText.textContent !== typed) inText.textContent = typed;
        const busy = cmds.some((c) => t >= c.t0 && t < c.sent + F(G.caret.on));
        const phase = Math.floor(Math.max(0, t - tIn) * 30 + 1e-6) % G.caret.period;
        caret.style.display = busy || phase < G.caret.on ? '' : 'none';
        caret.style.left = `${G.input.textX - G.input.inset - G.input.border + typed.length * iadv}px`;
        // lit row
        const cur = litTarget(t);
        lit.style.display = cur ? '' : 'none';
        if (cur) {
          const k = checks.indexOf(cur);
          const prev = k > 0 ? checks[k - 1] : null;
          const box = (c) => ({ y: c.it.y + 2, h: c.it.pitch - 4 });
          const b = box(cur);
          let yy = b.y, hh = b.h, op = 1;
          if (prev) { const a = box(prev); const p = approach(t, cur.b.t, M.lit.tau, M.lit.cap); yy = a.y + (b.y - a.y) * p; hh = a.h + (b.h - a.h) * p; }
          else { const p = kit.prog(t, cur.b.t + M.lit.edgeIn, M.lit.fillIn, kit.ease.outCubic); hh = b.h * (0.84 + 0.16 * p); yy = b.y + (b.h - hh) / 2; op = p; }
          lit.style.top = `${yy.toFixed(2)}px`; lit.style.height = `${hh.toFixed(2)}px`;
          lit.style.background = `rgba(${litRGB.join(',')},${op.toFixed(3)})`;
          litEdge.style.opacity = String(t >= cur.b.t + M.lit.edgeIn ? 1 : 0);
        }
        for (const c of checks) {
          const k = checks.indexOf(c);
          const isCur = c === cur;
          const done = !isCur && t >= c.b.t && checks.indexOf(cur) > k;
          const it = c.it;
          const lit_ = isCur && t >= c.b.t;
          it.txt.style.fontWeight = lit_ ? '700' : String(it.weight);
          it.txt.style.color = lit_ ? G.lit.text : done ? G.lit.doneText : (it.kind === 'dim' ? G.ink.dim : G.ink.text);
          if (it.head) it.head.style.color = done ? doneHead : '';
          if (it.rest && it.kind !== 'dim') it.rest.style.color = lit_ ? G.lit.text : done ? G.lit.doneText : (it.restDim ? G.ink.dim : '');
          const showC = c.show && t >= c.b.t + M.lit.check;
          c.el.style.display = showC ? '' : 'none';
          if (showC) {
            const p = kit.prog(t, c.b.t + M.lit.check, F(4), S.E.emph);
            c.el.style.opacity = String(kit.clamp(p * 2));
            c.el.style.transform = `scale(${(0.6 + 0.4 * p).toFixed(3)})`;
            c.svg.setAttribute('stroke', done ? (blue ? '#75B8F3' : litCheck) : litCheck);
          }
        }
      },
    };
  },
};
