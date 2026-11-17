// An AI assistant being asked something, with the answer streaming in: the reference's most used
// designed device, "typed prompt, then result" (research/explain.md X04, X05, X11; part B 23 units in
// 11 reels, part C 18 units in 9 reels). An invented, unbranded app: a prompt field, a send button,
// thinking dots, then answer rows that land one by one. A row can turn into a sponsored result, light
// up, get a check or be struck as the speaker names it.
//
//   typing     the prompt types at 1.6 characters a frame from its word, behind a block caret
//   submit     4 f after the last character the field rings in the accent for 2 f and the send button fills
//   thinking   three pulsing dots for 8 f
//   rows       each row fades up 12 px over 2.5 f, 3 f apart, or on its own word if later
//   next ask   a second prompt clears the field, and the last answer scrolls up and out in 8 f with blur
//   states     sponsored (tinted plate + chip popping in 5 f), lit (plate + traced outline, the last lit
//              row releasing 2 f earlier), check (disc pops), strike (thin red line, row greys to 40 %)
import { cardFrame } from '../card.js';
import { fonts, F } from '../tokens.js';
import { X, arrive, applyArrive, caretOn, lit, mix, dotPulse, roundRectPath, drawOnPath, approach, syncTokens, typedSync, syncEnd, flyEase } from '../anim.js';
import { glyphSvg, GLYPHS, SOLID } from '../glyphs.js';

// ---- TOKENS (card px, 894 wide; sizes from research/explain.md "Materials": mock rows 28-44 px bold,
// secondary 20-26 px, chips 18-24 px, 4-8 rows at 50-130 px pitch, prompts 32-38 px)
// Text is set large for the card, as in the reference: body cap height 1/25-1/30 of the card width.
const G = {
  pad: 36,
  head: { tile: 66, radius: 18, glyph: 38, size: 38, gap: 20, below: 28 },
  field: { h: 124, radius: 32, padL: 36, size: 46, min: 30, fill: '#F4F4F6', edge: '#E3E3E7', send: 76, caretW: 5, caretH: 52 },
  gap: 32,                                         // field to answer
  row: { h: 124, pitch: 140, radius: 26, disc: 72, discGap: 26, title: 46, titleMin: 32, sub: 31, chipH: 52, chipPad: 22, chipSize: 27 },
  dots: { r: 9, gap: 28 },
  dark: { fill: '#111214', field: '#1E1F23', fieldEdge: '#2E2F34', ink: '#F2F2F3', sub: '#8B8B92', disc: '#2A2B30', discInk: '#B9B9C0', plate: '#1A1B1E' },
  light: { ink: '#16171A', sub: '#7C7C84', disc: '#EFEFF2', discInk: '#7E7E86', plate: '#FAFAFB' },
};
const M = { submitAfter: F(4), ring: F(2), clear: F(3), dock: F(12), burst: 3 };   // the field docks to the top as the answer grows (part B: result grows out of the output line, ~8-12 f); synced words type in 3-char/f bursts

export default {
  type: 'ask-card',
  label: 'AI answer',
  slots: ['card'],
  params: {
    app: { type: 'string', optional: true, maxChars: 18, maxWords: 3 },          // header name of the invented assistant ("AI search")
    skin: 'enum?:light|dark',
    prompts: { type: 'array', min: 1, max: 3, of: {
      text: { type: 'string', maxChars: 48 },                                    // what is typed, in the speaker's words
      at: 'word?',                                                               // typing starts on this word
    } },
    rows: { type: 'array', optional: true, max: 6, of: {
      text: { type: 'string', optional: true, maxChars: 30 },                    // an answer line in the speaker's words; leave it out for a grey placeholder line (never invent results)
      sub: { type: 'string', optional: true, maxChars: 40 },
      glyph: `enum?:${GLYPHS.join('|')}`,                                        // instead of the row number
      prompt: { type: 'number', optional: true, min: 1, max: 3 },                // which prompt it answers (default 1)
      ad: 'boolean?',                                                            // arrives as a sponsored result
      at: 'word?',                                                               // lands on this word (never before the answer starts)
    } },
    adLabel: { type: 'string', optional: true, maxChars: 12, maxWords: 2 },      // the chip on sponsored rows (default "Sponsored")
  },
  beats: {
    ad: { row: { type: 'number', min: 1, max: 6 } },                             // turn a row into a sponsored result
    light: { row: { type: 'number', min: 1, max: 6 } },                         // light a row (the last lit row releases)
    check: { row: { type: 'number', min: 1, max: 6 } },
    strike: { row: { type: 'number', min: 1, max: 6 } },
  },

  prefer(params) {
    const rows = params.rows || [];
    const per = [0, 0, 0];
    for (const r of rows) per[(r.prompt || 1) - 1] += 1;
    const n = Math.max(1, ...per);
    const head = params.app ? G.pad + G.head.tile + G.head.below : G.pad;
    return { h: Math.round(head + G.field.h + G.gap + n * G.row.pitch - (G.row.pitch - G.row.h) + G.pad + 4) };
  },

  build(ctx) {
    const { S, params, rect, mode, tIn, beats } = ctx; const { kit, C } = S; const { h } = kit;
    const dark = params.skin === 'dark';
    const K = dark ? G.dark : G.light;
    const W = rect.w;
    const card = cardFrame(S, { w: W, h: rect.h, mode, tIn, fill: dark ? G.dark.fill : undefined });
    const body = card.body;
    const sfx = new Set();
    const once = (t, key) => { const k = `${key}@${t.toFixed(3)}`; if (!sfx.has(k)) { sfx.add(k); S.sfx(t, key); } };

    // ---- header
    let y = G.pad;
    if (params.app) {
      const tile = h('div', { html: glyphSvg('spark', G.head.glyph, '#FFFFFF', { solid: true, weight: 1.6 }), style: { position: 'absolute', left: `${G.pad}px`, top: `${y}px`, width: `${G.head.tile}px`, height: `${G.head.tile}px`, borderRadius: `${G.head.radius}px`, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' } });
      const name = h('div', { text: params.app, style: { position: 'absolute', left: `${G.pad + G.head.tile + G.head.gap}px`, top: `${y + G.head.tile / 2 - G.head.size * 0.6}px`, font: `600 ${G.head.size}px/1.2 ${fonts.sans}`, color: dark ? '#C9C9CF' : '#3A3A40', whiteSpace: 'nowrap' } });
      body.append(tile, name);
      y += G.head.tile + G.head.below;
    }

    // ---- prompt field
    const fx = G.pad, fw = W - 2 * G.pad, fy = y;
    const field = h('div', { style: { position: 'absolute', left: `${fx}px`, top: `${fy}px`, width: `${fw}px`, height: `${G.field.h}px`, borderRadius: `${G.field.radius}px`, background: dark ? K.field : G.field.fill, boxSizing: 'border-box', border: `1.5px solid ${dark ? K.fieldEdge : G.field.edge}` } });
    const ring = h('div', { style: { position: 'absolute', left: '-1.5px', top: '-1.5px', right: '-1.5px', bottom: '-1.5px', borderRadius: `${G.field.radius}px`, border: `3px solid ${C.accent}`, opacity: '0' } });
    const textMax = fw - G.field.padL - G.field.send - 40;
    const prompts = params.prompts.map((p) => {
      const font = (z) => `600 ${z}px ${fonts.sans}`;
      const size = kit.fitSize(p.text, textMax, font, G.field.size, G.field.min, -0.01);
      return { ...p, size, font: font(size) };
    });
    const line = h('div', { style: { position: 'absolute', left: `${G.field.padL}px`, top: '0', height: `${G.field.h - 3}px`, display: 'flex', alignItems: 'center', whiteSpace: 'pre', color: dark ? K.ink : '#1A1B1F', letterSpacing: '-0.01em' } });
    const typed = h('span');
    const caret = h('span', { style: { display: 'inline-block', width: `${G.field.caretW}px`, height: `${G.field.caretH}px`, marginLeft: '3px', borderRadius: '2px', background: C.accent, verticalAlign: 'middle' } });
    line.append(typed, caret);
    const placeholder = h('div', { text: 'Ask anything', style: { position: 'absolute', left: `${G.field.padL}px`, top: `${G.field.h / 2 - G.field.size * 0.62}px`, font: `500 ${G.field.size}px/1.2 ${fonts.sans}`, color: dark ? '#5E5E66' : '#A7A7AE' } });
    const sendX = fw - 19 - G.field.send;
    const send = h('div', { html: glyphSvg('upload', 30, '#FFFFFF', { weight: 2.6 }), style: { position: 'absolute', left: `${sendX}px`, top: `${(G.field.h - 3 - G.field.send) / 2}px`, width: `${G.field.send}px`, height: `${G.field.send}px`, borderRadius: '50%', background: dark ? '#3A3B40' : '#D6D6DC', display: 'flex', alignItems: 'center', justifyContent: 'center' } });
    field.append(placeholder, line, send, ring);
    const head = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${y + G.field.h}px` } });
    while (body.firstChild) head.append(body.firstChild);
    head.append(field);
    body.append(head);
    const dockFrom = Math.max(0, (card.bodyH - (y + G.field.h)) / 2 - y / 2);   // the header and field sit centred until the answer comes
    y += G.field.h + G.gap;
    const areaY = y, areaH = card.bodyH - areaY;

    // ---- timeline of the prompts
    let cursor = tIn + F(6);
    for (const [k, p] of prompts.entries()) {
      p.t0 = typeof p.at === 'number' ? Math.max(tIn, S.wordTime(p.at)) : (k === 0 ? cursor : cursor + F(20));
      // the typed words land with the spoken words when the speaker says them; otherwise 1.6 characters a frame
      p.sched = syncTokens(p.text, S.doc.words || [], typeof p.at === 'number' ? p.at : 0, p.t0);
      p.t0 = p.sched.length ? p.sched[0].t : p.t0;
      p.done = syncEnd(p.sched, M.burst);
      p.submit = p.done + M.submitAfter;
      p.answer = p.submit + X.dots.dur;
      cursor = p.answer;
      once(p.t0, 'type');
    }
    prompts.forEach((p, k) => { p.next = prompts[k + 1] ? prompts[k + 1].t0 : Infinity; });

    // ---- answer groups: one per prompt, the rows that answer it
    const rowsIn = params.rows || [];
    const groups = prompts.map(() => {
      const g = h('div', { style: { position: 'absolute', left: '0', top: `${areaY}px`, width: `${W}px`, height: `${Math.max(0, areaH)}px` } });
      const dots = h('div', { style: { position: 'absolute', left: `${G.pad + 20}px`, top: '28px', display: 'flex', gap: `${G.dots.gap - 2 * G.dots.r}px` } },
        ...[0, 1, 2].map(() => h('div', { style: { width: `${G.dots.r * 2}px`, height: `${G.dots.r * 2}px`, borderRadius: '50%', background: dark ? '#7D7D85' : '#A9A9B0' } })));
      g.append(dots);
      body.append(g);
      return { g, dots, rows: [] };
    });

    const rows = rowsIn.map((r, i) => {
      const k = Math.min(prompts.length, Math.max(1, r.prompt || 1)) - 1;
      const grp = groups[k];
      const j = grp.rows.length;
      const ry = j * G.row.pitch;
      const rw = W - 2 * G.pad;
      const wrap = h('div.ep-ask-row', { style: { position: 'absolute', left: `${G.pad}px`, top: `${ry}px`, width: `${rw}px`, height: `${G.row.h}px`, transformOrigin: '30% 50%' } });
      const plate = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${rw}px`, height: `${G.row.h}px`, borderRadius: `${G.row.radius}px`, background: K.plate } });
      const tint = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${rw}px`, height: `${G.row.h}px`, borderRadius: `${G.row.radius}px`, background: dark ? mix(K.plate, C.accent, 0.22) : C.tint, opacity: '0' } });
      const { d, len } = roundRectPath(1.5, 1.5, rw - 3, G.row.h - 3, G.row.radius);
      const outline = drawOnPath(S, { d, len, w: rw, h: G.row.h, t0: Infinity, colour: C.accent, width: 3 });
      const discX = 20;
      const disc = h('div', { style: { position: 'absolute', left: `${discX}px`, top: `${(G.row.h - G.row.disc) / 2}px`, width: `${G.row.disc}px`, height: `${G.row.disc}px`, borderRadius: '50%', background: K.disc, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 26px/1 ${fonts.sans}`, color: K.discInk } });
      if (r.glyph) disc.innerHTML = glyphSvg(r.glyph, 30, K.discInk, { solid: SOLID.has(r.glyph), weight: 2.3 });
      else disc.textContent = String(j + 1);
      const tx = discX + G.row.disc + G.row.discGap;
      const chipW = r.ad || beats.some((b) => b.do === 'ad' && b.row === i + 1) ? kit.measure(params.adLabel || 'Sponsored', `700 ${G.row.chipSize}px ${fonts.sans}`) + G.row.chipPad * 2 : 0;
      const titleMax = rw - tx - 24 - (chipW ? chipW + 18 : 60);
      const tFont = (z) => `700 ${z}px ${fonts.sans}`;
      const skel = !r.text;
      const tz = skel ? G.row.title : kit.fitSize(r.text, titleMax, tFont, G.row.title, G.row.titleMin, -0.015);
      const titleW = skel ? titleMax * (0.62 - 0.12 * ((i * 7) % 3) / 2) : kit.measure(r.text, tFont(tz), -0.015 * tz);
      const hasSub = !!r.sub || skel;
      const titleTop = hasSub ? G.row.h / 2 - tz * 0.98 : G.row.h / 2 - tz * 0.6;
      const title = skel
        ? h('div', { style: { position: 'absolute', left: `${tx}px`, top: `${G.row.h / 2 - 30}px`, width: `${titleW}px`, height: '22px', borderRadius: '11px', background: dark ? '#34353A' : '#DCDCE1' } })
        : h('div', { text: r.text, style: { position: 'absolute', left: `${tx}px`, top: `${titleTop}px`, font: `700 ${tz}px/1.2 ${fonts.sans}`, letterSpacing: '-0.015em', color: K.ink, whiteSpace: 'nowrap' } });
      const sub = skel
        ? h('div', { style: { position: 'absolute', left: `${tx}px`, top: `${G.row.h / 2 + 10}px`, width: `${titleW * 0.6}px`, height: '18px', borderRadius: '9px', background: dark ? '#2A2B2F' : '#ECECF0' } })
        : hasSub ? h('div', { text: r.sub, style: { position: 'absolute', left: `${tx}px`, top: `${G.row.h / 2 + 4}px`, font: `500 ${G.row.sub}px/1.2 ${fonts.sans}`, color: K.sub, whiteSpace: 'nowrap', maxWidth: `${titleMax}px`, overflow: 'hidden', textOverflow: 'ellipsis' } }) : null;
      const content = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${rw}px`, height: `${G.row.h}px` } }, disc, title, ...(sub ? [sub] : []));
      const chip = chipW ? h('div', { text: params.adLabel || 'Sponsored', style: { position: 'absolute', left: `${rw - 22 - chipW}px`, top: `${(G.row.h - G.row.chipH) / 2}px`, height: `${G.row.chipH}px`, lineHeight: `${G.row.chipH}px`, padding: `0 ${G.row.chipPad}px`, borderRadius: `${G.row.chipH / 2}px`, background: C.accent, color: '#FFFFFF', font: `700 ${G.row.chipSize}px/${G.row.chipH}px ${fonts.sans}`, letterSpacing: '0.01em', whiteSpace: 'nowrap', opacity: '0', transformOrigin: '50% 50%' } }) : null;
      const check = h('div', { html: glyphSvg('check', 30, '#FFFFFF', { weight: 3.2 }), style: { position: 'absolute', left: `${rw - 22 - 52 - (chipW ? chipW + 14 : 0)}px`, top: `${(G.row.h - 52) / 2}px`, width: '52px', height: '52px', borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: '0', transformOrigin: '50% 50%' } });
      const lineThru = h('div', { style: { position: 'absolute', left: `${tx - 4}px`, top: `${titleTop + tz * 0.62}px`, height: '3px', width: '0px', borderRadius: '2px', background: C.redText } });
      wrap.append(plate, tint, outline.el, content, lineThru, check, ...(chip ? [chip] : []));
      grp.g.append(wrap);
      const row = { i, k, j, r, wrap, plate, tint, outline, title, disc, chip, check, lineThru, titleW, adAt: r.ad ? null : Infinity, litAt: Infinity, offAt: Infinity, checkAt: Infinity, strikeAt: Infinity };
      grp.rows.push(row);
      return row;
    });

    // when each row lands
    for (const grp of groups) grp.rows.forEach((row, j) => {
      const p = prompts[row.k];
      const own = typeof row.r.at === 'number' ? S.wordTime(row.r.at) : -Infinity;
      row.tIn = Math.max(p.answer + j * X.row.stagger, own);
      if (row.r.ad) { row.adAt = row.tIn; once(row.tIn, 'chip'); }
    });
    // beats
    let lastLit = null;
    for (const b of [...beats].sort((a, c) => a.t - c.t)) {
      const row = rows[b.row - 1];
      if (!row) { S.warn(`ask-card: row ${b.row} does not exist`); continue; }
      const t = Math.max(b.t, row.tIn + F(3));
      if (b.do === 'ad') { row.adAt = Math.min(row.adAt ?? Infinity, t); once(t, 'chip'); }
      if (b.do === 'light') {
        if (lastLit && lastLit !== row) lastLit.offAt = Math.min(lastLit.offAt, t);
        row.litAt = t; row.outline.t0 = t; lastLit = row; once(t, 'highlight');
      }
      if (b.do === 'check') { row.checkAt = t; once(t, 'check'); }
      if (b.do === 'strike') { row.strikeAt = t; once(t, 'strike'); }
    }
    // the outline of a lit row is drawn from its light time
    for (const row of rows) if (Number.isFinite(row.litAt)) {
      const { d, len } = roundRectPath(1.5, 1.5, W - 2 * G.pad - 3, G.row.h - 3, G.row.radius);
      const fresh = drawOnPath(S, { d, len, w: W - 2 * G.pad, h: G.row.h, t0: row.litAt, colour: C.accent, width: 3 });
      row.outline.el.replaceWith(fresh.el); row.outline = fresh;
    }

    return {
      el: card.el, tone: dark ? 'dark' : 'light',
      seek(t) {
        card.seek(t);
        // which prompt owns the field
        let cur = prompts[0];
        for (const p of prompts) if (t >= p.t0 - M.clear) cur = p;
        const clearing = cur !== prompts[0] && t < cur.t0;
        const txt = clearing ? '' : typedSync(cur.sched, t, M.burst);
        const dk = (params.rows || []).length ? flyEase(t, prompts[0].submit, M.dock) : 0;
        head.style.transform = dockFrom > 1 && dk < 1 ? `translateY(${(dockFrom * (1 - dk)).toFixed(2)}px)` : 'none';
        if (typed.textContent !== txt) typed.textContent = txt;
        typed.style.font = cur.font;
        placeholder.style.opacity = txt ? '0' : (t < prompts[0].t0 ? '1' : '0');
        const typing = t >= cur.t0 && t <= cur.done;
        caret.style.opacity = (t < cur.submit && caretOn(t, cur.t0, cur.done)) ? '1' : '0';
        const sent = t >= cur.submit;
        send.style.background = txt && !sent ? C.accent : (sent ? C.accent : (dark ? '#3A3B40' : '#D6D6DC'));
        ring.style.opacity = sent ? String(Math.max(0, 1 - (t - cur.submit) / (M.ring + F(4)))) : '0';
        void typing;

        prompts.forEach((p, k) => {
          const grp = groups[k];
          const on = t >= p.submit && t < p.next + X.scroll.dur;
          grp.g.style.display = on ? '' : 'none';
          if (!on) return;
          // leaving: scroll up and out with blur when the next prompt starts
          const out = Number.isFinite(p.next) ? approach(t, p.next - F(1), X.scroll.dur / 3, X.scroll.dur) : 0;
          grp.g.style.transform = out > 0 ? `translateY(${(-areaH * 0.9 * out).toFixed(1)}px)` : 'none';
          grp.g.style.filter = out > 0 && out < 0.98 ? `blur(${(X.scroll.blur * Math.sin(Math.PI * out)).toFixed(2)}px)` : 'none';
          grp.g.style.opacity = out > 0 ? String(1 - out) : '';
          // thinking dots until the first row
          const thinking = t >= p.submit && t < p.answer;
          grp.dots.style.display = thinking ? 'flex' : 'none';
          if (thinking) [...grp.dots.children].forEach((d, i) => { d.style.opacity = dotPulse(t, i).toFixed(3); });
          for (const row of grp.rows) {
            const a = arrive(t, row.tIn, row.r.ad ? 'stamp' : 'rise');
            row.wrap.style.display = t >= row.tIn ? '' : 'none';
            if (t < row.tIn) continue;
            applyArrive(row.wrap, a);
            // sponsored
            const ad = row.adAt !== null && Number.isFinite(row.adAt) ? approach(t, row.adAt, X.flip.fade / 2, X.flip.fade) : 0;
            const glow = lit(t, Number.isFinite(row.litAt) ? row.litAt : null, row.offAt);
            row.tint.style.opacity = Math.max(ad, glow).toFixed(3);
            if (row.chip) {
              const c = row.adAt !== null && Number.isFinite(row.adAt) ? arrive(t, row.adAt, 'pop') : { o: 0, x: 0, y: 0, r: 0, s: 1 };
              applyArrive(row.chip, c);
            }
            row.outline.seek(t);
            row.outline.el.style.opacity = Number.isFinite(row.litAt) ? String(1 - (Number.isFinite(row.offAt) ? approach(t, row.offAt - X.light.lead, X.light.out / 3, X.light.out) : 0)) : '0';
            row.disc.style.background = glow > 0.01 || ad > 0.01 ? mix(K.disc, C.accent, Math.max(glow, ad)) : K.disc;
            row.disc.style.color = glow > 0.5 || ad > 0.5 ? '#FFFFFF' : K.discInk;
            if (row.r.glyph) { const svg = row.disc.querySelector('svg'); if (svg) svg.setAttribute('stroke', glow > 0.5 || ad > 0.5 ? '#FFFFFF' : K.discInk); }
            const ck = Number.isFinite(row.checkAt) ? arrive(t, row.checkAt, 'pop') : { o: 0, x: 0, y: 0, r: 0, s: 1 };
            applyArrive(row.check, ck);
            if (Number.isFinite(row.strikeAt)) {
              const sp = approach(t, row.strikeAt, F(1.13), F(6));
              row.lineThru.style.width = `${((row.titleW + 8) * sp).toFixed(1)}px`;
              const grey = approach(t, row.strikeAt + F(2), F(2), F(6));
              row.wrap.style.opacity = String((a.o >= 1 ? 1 : a.o) * (1 - 0.6 * grey));
            }
          }
        });
      },
    };
  },
};
