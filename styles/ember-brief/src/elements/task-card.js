// A task at work (research/explain-composites.md K06-K09). The reference shows an agent working on its own as a
// list that ticks itself off (clip37@165-220: a done disc, a ring with dots on the step in progress, dashed rings
// on the steps to come) and as a status chip with a progress bar that fills while it works (clip37@240-330:
// "Working", then the result). Here both sit on one dark card: a header with the thing's mark and the task's
// name, the status and its bar, the steps, and optionally the person it works for.
//   run    on its word the steps start: one becomes the step in progress, then it is done and the next starts,
//          one step every 15 frames (or spread evenly up to the word `until`), and the bar follows the share
//          done [K07]
//   tick   one step is done on its word (and the next starts)
//   away   the person row dims and its chip turns from Online to Away: "without you being there" [K09]
//   done   the status reads the `done` text and the bar is full; with `done` set this also happens by
//          itself when the last step is ticked
// Steps with no label are grey bars: the words of the steps do not matter, only that they get done.
import { F, layout, motion, fonts, colour } from '../tokens.js';
import { place, setStyle, textAt, fitCap, expoInOut } from '../common.js';
import { card } from '../card.js';
import { loadMedia } from '../media.js';
import { tileNode, glyph, GLYPH_NAMES } from '../marks.js';
import { UI, lift } from './ui-card.js';

// TOKENS (research/explain-composites.md K06-K09; clip37@180, clip37@288, measured on native frames)
export const TASK = {
  head: 124, mark: 72, titleCap: 46.6,              // the header: ui-card's title size [G14]; the mark tile 72 px (by eye)
  status: { h: 118, cap: 44, dot: 18, bar: 16, barGap: 26 },   // "Working" cap 44 over a 16 px bar (clip37@288: text 70 px, bar 16 px) [K08]
  row: 94, circle: 40, textGap: 30, cap: 35.9,      // steps 94 px apart, 40 px state rings, the list's light text [K06]
  dash: [5.5, 6.5], ring: 3,                         // a step to come: a dashed ring; the ring stroke 3 px (clip37@180) [K06]
  doneFill: '#C9CACD',                              // a done step: a light grey disc with a dark check (clip37@180 #CBCBCB) [K06, C26]
  step: F(15),                                      // a step every 15 frames while it works (clip37@165-210) [K07]
  person: { h: 118, side: 72, cap: 38, chipCap: 30 },
  pad: 40,
  dim: 0.42,                                        // an away person (by eye)
};

export default {
  type: 'task-card',
  label: 'Task card',
  slots: ['graphic'],
  params: {
    title: { type: 'string', maxChars: 24 },                     // the task, in the speaker's words
    image: 'asset?',                                            // the agent's mark, beside the title
    rows: { type: 'array', min: 2, max: 5, of: { label: { type: 'string', optional: true, maxChars: 22 } } },
    status: { type: 'string', optional: true, maxChars: 14 },   // while it works. Default "Working"
    done: { type: 'string', optional: true, maxChars: 14 },     // when it is done
    person: { type: 'string', optional: true, maxChars: 12 },   // who it works for ("You"): a row under the steps
  },
  beats: { run: { until: 'word?' }, tick: { row: { type: 'number', min: 1, max: 5 } }, away: {}, done: {} },

  async prepare(params, S) { return { mark: params.image ? await loadMedia(S, params.image) : null }; },

  build(ctx) {
    const { S, params: p, beats, data } = ctx; const { kit } = S; const { h } = kit;
    const rows = (p.rows || []).slice(0, 5);
    const W = layout.column.w;
    const yStatus = TASK.head, yRows = TASK.head + TASK.status.h + 10;
    const yPerson = yRows + rows.length * TASK.row + 20;
    const H = (p.person ? yPerson + TASK.person.h : yRows + rows.length * TASK.row) + TASK.pad;
    const box = place(ctx, W, H);
    const root = h('div.eb-task', { style: { position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${W}px`, height: `${H}px`, transformOrigin: '0 0', transform: box.s === 1 ? 'none' : `scale(${box.s})` } });
    const el = card(S, { x: 0, y: 0, w: W, h: H, kind: 'dark' });
    root.append(el);

    // ---- header: the mark and the task
    const img = data.mark && data.mark.kind === 'image' ? data.mark : null;
    let tx = UI.textX;
    if (img) {
      const m = tileNode(S, { side: TASK.mark, fill: 'cream', image: img });
      Object.assign(m.style, { left: `${UI.textX - 6}px`, top: `${(TASK.head - TASK.mark) / 2 + 6}px` });
      el.append(m); tx = UI.textX - 6 + TASK.mark + 28;
    }
    const tCap = fitCap(p.title || '', TASK.titleCap, UI.title.weight, W - tx - UI.textX, UI.track.title);
    el.append(textAt(S, { text: p.title || '', x: tx, y: (TASK.head + 12) / 2 + tCap / 2 + 3, cap: tCap, weight: UI.title.weight, align: 'left', tracking: UI.track.title }));
    el.append(h('div', { style: { position: 'absolute', left: '0', top: `${TASK.head}px`, width: `${W}px`, height: '2px', background: colour.card.stroke } }));

    // ---- status and its bar [K08]
    const St = TASK.status;
    const sy = yStatus + 22 + St.cap;
    const dot = h('div', { style: { position: 'absolute', left: `${UI.textX}px`, top: `${(sy - St.cap / 2 - St.dot / 2).toFixed(1)}px`, width: `${St.dot}px`, height: `${St.dot}px`, borderRadius: '50%', background: colour.accent } });
    const label = textAt(S, { text: p.status || 'Working', x: UI.textX + St.dot + 20, y: sy, cap: St.cap, weight: fonts.weight.caption, colour: colour.cream, align: 'left', tracking: UI.track.label });
    const barY = sy + St.barGap, barW = W - UI.textX * 2;
    const track = h('div', { style: { position: 'absolute', left: `${UI.textX}px`, top: `${barY}px`, width: `${barW}px`, height: `${St.bar}px`, borderRadius: `${St.bar / 2}px`, background: lift(colour.card.fill, UI.bar.a) } });
    const fill = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${barW}px`, height: `${St.bar}px`, borderRadius: `${St.bar / 2}px`, background: colour.accent, transformOrigin: '0 50%', transform: 'scaleX(0)' } });
    track.append(fill);
    el.append(dot, label, track);

    // ---- the steps [K06]
    const R = TASK.circle, NS = 'http://www.w3.org/2000/svg';
    let nBar = 0;
    const steps = rows.map((r, i) => {
      const cy = yRows + i * TASK.row + TASK.row / 2;
      const cx = UI.textX + R / 2;
      const ring = document.createElementNS(NS, 'svg');
      ring.setAttribute('width', String(R)); ring.setAttribute('height', String(R)); ring.setAttribute('viewBox', `0 0 ${R} ${R}`);
      Object.assign(ring.style, { position: 'absolute', left: `${cx - R / 2}px`, top: `${cy - R / 2}px`, overflow: 'visible' });
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', String(R / 2)); c.setAttribute('cy', String(R / 2)); c.setAttribute('r', String(R / 2 - TASK.ring / 2)); c.setAttribute('fill', 'none'); c.setAttribute('stroke-width', String(TASK.ring));
      ring.append(c);
      const dots = [-1, 0, 1].map((k) => { const d = document.createElementNS(NS, 'circle'); d.setAttribute('cx', String(R / 2 + k * 8.5)); d.setAttribute('cy', String(R / 2)); d.setAttribute('r', '2.6'); d.setAttribute('fill', colour.cream); ring.append(d); return d; });
      const disc = h('div', { style: { position: 'absolute', left: `${cx - R / 2}px`, top: `${cy - R / 2}px`, width: `${R}px`, height: `${R}px`, borderRadius: '50%', background: TASK.doneFill, display: 'none', alignItems: 'center', justifyContent: 'center', transformOrigin: '50% 50%' } }, glyph('check', R * 0.7, 3.4, colour.card.fill));
      const x = UI.textX + R + TASK.textGap;
      let text;
      if (r.label) {
        const cap = fitCap(r.label, TASK.cap, fonts.weight.light, W - x - UI.textX, UI.track.light);
        text = textAt(S, { text: r.label, x, y: cy + cap / 2, cap, weight: fonts.weight.light, align: 'left', tracking: UI.track.light });
      } else {
        const w = (W - x - UI.textX) * UI.list.bars.w[nBar++ % UI.list.bars.w.length];
        text = h('div', { style: { position: 'absolute', left: `${x}px`, top: `${cy - 13}px`, width: `${w.toFixed(1)}px`, height: '26px', borderRadius: '13px', background: lift(colour.card.fill, UI.bar.a) } });
      }
      el.append(ring, disc, text);
      return { ring, c, dots, disc, text, tWork: Infinity, tDone: Infinity };
    });

    // ---- the person it works for [K09]
    let person = null;
    if (p.person) {
      const P = TASK.person;
      el.append(h('div', { style: { position: 'absolute', left: '0', top: `${yPerson}px`, width: `${W}px`, height: '2px', background: colour.card.stroke } }));
      const pcy = yPerson + P.h / 2 + 4;
      const tile = tileNode(S, { side: P.side, fill: 'dark', glyph: 'person' });
      Object.assign(tile.style, { left: `${UI.textX - 6}px`, top: `${pcy - P.side / 2}px` });
      const name = textAt(S, { text: p.person, x: UI.textX - 6 + P.side + 28, y: pcy + P.cap / 2, cap: P.cap, weight: fonts.weight.caption, align: 'left', tracking: UI.track.label });
      const who = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px` } }, tile, name);
      const chip = (txt, on) => {
        const c = h('div', { style: { position: 'absolute', right: `${UI.endX}px`, top: `${pcy - 30}px`, height: '60px', padding: '0 26px 0 22px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '14px',
          background: lift(colour.card.fill, [10, 10, 10]), font: `${fonts.weight.caption} ${(P.chipCap / fonts.capAt(fonts.weight.caption)).toFixed(1)}px/1 ${fonts.sans}`, color: on ? colour.cream : colour.muted, letterSpacing: '-0.02em' } },
          h('div', { style: { width: '16px', height: '16px', borderRadius: '50%', background: on ? colour.accent : colour.toggle.offTrack } }), h('span', { text: txt }));
        return c;
      };
      const online = chip('Online', true), away = chip('Away', false);
      away.style.display = 'none';
      el.append(who, online, away);
      person = { who, online, away, t: Infinity };
    }

    // ---- beats
    const runs = beats.filter((b) => b.do === 'run');
    if (runs.length) {
      const t0 = runs[0].t;
      // with `until` the steps share the time to that word; otherwise one every 15 frames [K07]
      const step = runs[0].until !== undefined ? Math.max(F(6), (S.wordTime(runs[0].until) - t0) / Math.max(1, steps.length)) : TASK.step;
      steps.forEach((st, i) => { st.tWork = Math.min(st.tWork, t0 + i * step); st.tDone = Math.min(st.tDone, t0 + (i + 1) * step); });
    }
    for (const b of beats.filter((x) => x.do === 'tick')) {
      const i = b.row - 1;
      if (!steps[i]) { S.warn(`task-card: tick names step ${b.row}, but the card has ${steps.length}`); continue; }
      for (let k = 0; k <= i; k++) { steps[k].tDone = Math.min(steps[k].tDone, b.t); steps[k].tWork = Math.min(steps[k].tWork, b.t); }
      if (steps[i + 1]) steps[i + 1].tWork = Math.min(steps[i + 1].tWork, b.t);
    }
    const bAway = beats.find((b) => b.do === 'away');
    if (bAway && person) person.t = bAway.t;
    if (bAway && !person) S.warn('task-card: an away beat needs a person');
    const bDone = beats.find((b) => b.do === 'done');
    const lastDone = steps.length ? steps[steps.length - 1].tDone : Infinity;
    const tFinished = bDone ? bDone.t : p.done ? lastDone : Infinity;
    if (bDone) steps.forEach((st) => { st.tDone = Math.min(st.tDone, bDone.t); });
    const doneText = p.done || p.status || 'Working';
    const statusText = p.status || 'Working';
    const n = steps.length;

    return {
      el: root, box: { x: box.x, y: box.y, w: box.w, h: box.h },
      seek(t) {
        let doneN = 0;
        for (const st of steps) {
          const working = t >= st.tWork && t < st.tDone, done = t >= st.tDone;
          if (done) doneN += expoInOut(kit.clamp((t - st.tDone) / F(6)));
          setStyle(st.c, 'stroke', working ? colour.cream : colour.muted);
          setStyle(st.c, 'strokeDasharray', working ? 'none' : TASK.dash.join(' '));
          for (const d of st.dots) setStyle(d, 'display', working ? '' : 'none');
          setStyle(st.ring, 'display', done ? 'none' : '');
          setStyle(st.disc, 'display', done ? 'flex' : 'none');
          if (done) {
            const u = kit.clamp((t - st.tDone) / F(6));
            setStyle(st.disc, 'transform', `scale(${(0.6 + 0.4 * expoInOut(u)).toFixed(3)})`);
            setStyle(st.text, 'opacity', '0.55');
          } else setStyle(st.text, 'opacity', working ? '1' : '0.8');
        }
        const finished = t >= tFinished;
        const share = finished ? 1 : n ? doneN / n : 0;
        setStyle(fill, 'transform', `scaleX(${share.toFixed(4)})`);
        const txt = finished ? doneText : statusText;
        if (label.textContent !== txt) label.textContent = txt;
        if (person) {
          const away = t >= person.t;
          const u = kit.clamp((t - person.t) / F(6));
          setStyle(person.who, 'opacity', away ? (1 - (1 - TASK.dim) * u).toFixed(3) : '1');
          setStyle(person.online, 'display', away ? 'none' : 'flex');
          setStyle(person.away, 'display', away ? 'flex' : 'none');
        }
      },
    };
  },
};
