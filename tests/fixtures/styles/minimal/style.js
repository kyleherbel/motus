// Minimal style: exercises footage views, the matte, captions, layouts and beats.
export default {
  id: 'minimal',
  async setup() {},
  compile(doc, env) {
    const { kit, footage, W, H } = env;
    const { h, Group, tween, ease, F, groupWords, bare } = kit;
    const accent = doc.look.accent === 'lime' ? '#b6f000' : '#1f7bff';
    const el = h('div', { style: { position: 'absolute', inset: '0', background: '#eef2f5', fontFamily: 'Inter, system-ui, sans-serif' } });
    const g = new Group();

    // presenter: the plain view clipped to a panel, the cutout view free to rise above it
    const panel = { x: 60, y: 1180, w: 960, h: 740, r: 36 };
    const plain = footage.view(); const cut = footage.view({ matte: true });
    const base = { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px`, transformOrigin: '0 0' };
    Object.assign(plain.style, base); Object.assign(cut.style, base);
    const panelBox = h('div', { style: { position: 'absolute', overflow: 'hidden', background: '#000', border: `6px solid ${accent}`, boxSizing: 'border-box' } }, plain);
    const cutBox = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, overflow: 'hidden' } }, cut);
    el.append(panelBox, cutBox);

    const card = h('div', { style: { position: 'absolute', left: '90px', top: '330px', width: '900px', height: '520px', borderRadius: '28px', background: '#fff', border: `4px solid ${accent}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 72px Inter, system-ui', color: '#111', textAlign: 'center', padding: '40px' } });
    const caption = h('div', { style: { position: 'absolute', left: '0', width: `${W}px`, textAlign: 'center', font: '700 64px Inter, system-ui', color: '#111' } });
    el.append(card, caption);

    const groups = groupWords(doc.words.filter((w) => w.w), { maxWords: 3, maxChars: 18, breaks: doc.captions.breaks, hide: doc.captions.hide });
    const sceneAt = (t) => doc.scenes.find((s) => t >= s.start && t < s.end) || doc.scenes[doc.scenes.length - 1];

    const fr = doc.framing;
    return {
      el, audio: [],
      seek(t) {
        const sc = sceneAt(t);
        const full = sc.option.layout === 'full';
        // framing: scale footage so the face is ~300 px wide in the panel, eyes on a fixed line
        const s = full ? 1 : (fr ? 300 / fr.faceW : 0.6);
        const ex = fr ? fr.eyeX : W / 2, ey = fr ? fr.eyeY : H * 0.35;
        const tx = full ? 0 : W / 2 - ex * s, ty = full ? 0 : 1330 - ey * s;
        const tf = `translate(${tx}px, ${ty}px) scale(${s})`;
        if (full) {
          Object.assign(panelBox.style, { left: '0', top: '0', width: `${W}px`, height: `${H}px`, borderRadius: '0', borderWidth: '0' });
          plain.style.transform = 'none'; cutBox.style.display = 'none';
        } else {
          Object.assign(panelBox.style, { left: `${panel.x}px`, top: `${panel.y}px`, width: `${panel.w}px`, height: `${panel.h}px`, borderRadius: `${panel.r}px`, borderWidth: '6px' });
          plain.style.transform = `translate(${tx - panel.x - 6}px, ${ty - panel.y - 6}px) scale(${s})`;
          cutBox.style.display = ''; cutBox.style.height = `${panel.y + 8}px`;
          cut.style.transform = tf;
        }
        const note = sc.option.slots?.card;
        card.style.display = note ? 'flex' : 'none';
        if (note) {
          card.textContent = note.text;
          const p = tween(t, sc.start, F(9), 0, 1, ease.outCubic);
          card.style.transform = `scale(${0.86 + 0.14 * p})`; card.style.opacity = String(p);
          card.style.top = full ? '260px' : '330px';
        }
        const grp = groups.find((x) => t >= x.start - 0.05 && t < x.end + 0.25);
        caption.style.top = full ? '1500px' : '930px';
        caption.style.color = full ? '#fff' : '#111';
        caption.replaceChildren(...(grp ? grp.words.filter((w) => t >= w.start - 0.05).map((w) => h('span', { text: bare(w.w) + ' ', style: { color: w.emph ? accent : '' } })) : []));
      },
      posterTime: (id) => { const s = doc.scenes.find((x) => x.id === id); return s.start + Math.min(1, (s.end - s.start) * 0.7); },
    };
  },
};
