import {W,H,geo,material} from './tokens.js';
import {box,clamp} from './common.js';

export function framingFor(framing,mode) {
  const f=framing||{eyeX:W/2,eyeY:H*0.35,faceW:420};
  const studio=mode==='studio';
  const s=clamp((studio?geo.presenter.studioFaceW:geo.presenter.faceW)/Math.max(1,f.faceW),geo.presenter.minScale,geo.presenter.maxScale);
  return{s,tx:W/2-f.eyeX*s,ty:(studio?geo.presenter.studioEyeY:geo.presenter.eyeY)-f.eyeY*s};
}
// D06/D09: the speaker's own room, darkened and tinted toward the palette, a vignette, a bright speaker.
export function makePresenter(doc,env,C) {
  const {kit,footage}=env;
  const room=box(kit,'rd-room',{inset:'0',overflow:'hidden'}),person=box(kit,'rd-person',{inset:'0',overflow:'hidden'});
  const raw=footage.view(),cut=footage.view({matte:true,lo:0.22,hi:0.78}),fill=footage.view();
  for(const v of [fill,raw,cut])Object.assign(v.style,{position:'absolute',left:'0',top:'0',width:`${W}px`,height:`${H}px`,transformOrigin:'0 0'});
  // a heavily blurred cover copy fills any edge the framing exposes; the sharp room is feathered over it
  Object.assign(fill.style,{transformOrigin:'50% 50%',transform:'scale(1.25)',filter:`blur(38px) brightness(${material.roomBrightness*0.8}) saturate(0.5)`});
  raw.style.maskImage='linear-gradient(90deg,transparent 0%,#000 7%,#000 93%,transparent 100%),linear-gradient(transparent 0%,#000 7%,#000 92%,transparent 100%)';raw.style.maskComposite='intersect';room.append(fill);
  const tint=box(kit,'rd-tint',{inset:'0',background:C.tint,mixBlendMode:'color',opacity:String(material.roomTint)});
  const warm=box(kit,'rd-warm',{inset:'0',background:`radial-gradient(ellipse 620px 820px at 52% 42%,${C.glow}55,transparent 72%)`,mixBlendMode:'screen'});
  const vignette=box(kit,'rd-vignette',{inset:'0',background:`radial-gradient(ellipse 85% 70% at 50% 42%,transparent 40%,${C.ground}c0 82%,${C.ground} 100%)`});
  room.append(raw,tint,warm,vignette);person.append(cut);
  return{room,person,seek(mode,{cam={x:0,y:0,s:1}}={}) {
    const has=footage.hasMatte,abstract=mode==='abstract',circle=mode==='portrait-search';
    room.style.display=abstract?'none':'';person.style.display=!has||abstract||circle||mode==='split'?'none':'';room.style.transform='none';tint.style.opacity=String(material.roomTint);
    Object.assign(room.style,{left:'0',top:'0',width:`${W}px`,height:`${H}px`,borderRadius:'0',opacity:'1',boxShadow:'none'});
    // the cut-out is trusted near the speaker only: the upper corners often carry lamps or light bars
    // that a person matte mistakes for a person; the lower band keeps full width for the shoulders
    // two soft ellipses in the outer margins beside the head (full frame minus each ellipse)
    Object.assign(person.style,{maskImage:'radial-gradient(closest-side,#000 50%,transparent 100%),radial-gradient(closest-side,#000 50%,transparent 100%),linear-gradient(#000,#000)',
      maskSize:'300px 780px,300px 780px,100% 100%',maskPosition:'-40px 350px,820px 350px,0 0',maskRepeat:'no-repeat',maskComposite:'exclude,exclude,add'});
    for(const o of [tint,warm,vignette])o.style.display='';
    if(mode==='split') {
      // D13: the speaker in a rounded glass window at the top; the panel below carries the idea
      const w=geo.window,f=doc.framing||{eyeX:540,eyeY:670,faceW:420};
      const s=Math.max(w.faceW/Math.max(1,f.faceW),w.w/W,w.h/H);
      const tx=Math.min(0,Math.max(w.w-W*s,w.w/2-f.eyeX*s)),ty=Math.min(0,Math.max(w.h-H*s,w.eyeY-f.eyeY*s));
      Object.assign(room.style,{left:`${w.x}px`,top:`${w.y}px`,width:`${w.w}px`,height:`${w.h}px`,borderRadius:`${w.r}px`,boxShadow:`0 0 0 2px ${C.rim}d0,0 0 70px ${C.glow}50,0 30px 80px #000000b0`,transform:`translate(${cam.x*0.5}px,${cam.y*0.5}px)`});
      raw.style.transform=`translate(${tx}px,${ty}px) scale(${s})`;raw.style.filter='brightness(0.9) saturate(0.92) contrast(1.05)';raw.style.maskImage='none';fill.style.display='none';
      tint.style.opacity='0.10';warm.style.display='none';return;
    }
    if(circle) {
      const r=geo.portrait,f=doc.framing||{eyeX:540,eyeY:670,faceW:420};const s=(r.w*0.5)/Math.max(1,f.faceW);
      Object.assign(room.style,{left:`${r.x}px`,top:`${r.y}px`,width:`${r.w}px`,height:`${r.h}px`,borderRadius:'50%',boxShadow:`0 0 0 5px ${C.rim},0 0 80px ${C.accent}40`});
      raw.style.transform=`translate(${r.w/2-f.eyeX*s}px,${r.h*0.40-f.eyeY*s}px) scale(${s})`;raw.style.filter='none';raw.style.maskImage='none';fill.style.display='none';for(const o of [tint,warm,vignette])o.style.display='none';return;
    }
    if(!has) {
      // Intact footage panel fallback: rear graphics remain above it, never over the face.
      const p=geo.panel,f=doc.framing||{eyeX:540,eyeY:670,faceW:420};
      Object.assign(room.style,{left:`${p.x}px`,top:`${p.y}px`,width:`${p.w}px`,height:`${p.h}px`});
      const s=p.w/W;raw.style.transform=`translate(0px,${Math.min(0,p.h*0.33-f.eyeY*s)}px) scale(${s})`;raw.style.filter='none';raw.style.maskImage='none';fill.style.display='none';for(const o of [tint,warm,vignette])o.style.display='none';return;
    }
    fill.style.display='';
    raw.style.maskImage='linear-gradient(90deg,transparent 0%,#000 7%,#000 93%,transparent 100%),linear-gradient(transparent 0%,#000 7%,#000 92%,transparent 100%)';
    const f=framingFor(doc.framing,mode),tf=`translate(${f.tx}px,${f.ty}px) scale(${f.s})`;
    raw.style.transform=tf;cut.style.transform=tf;
    // the room sits a little deeper than the speaker: it moves less with the camera
    room.style.transform=`translate(${-cam.x*0.25}px,${-cam.y*0.25}px)`;
    raw.style.filter=`brightness(${material.roomBrightness}) saturate(${material.roomSaturation}) contrast(1.08)`;
    cut.style.filter=`brightness(${material.foregroundBrightness}) contrast(${material.foregroundContrast}) drop-shadow(0 0 14px ${C.glow}38)`;
    if(mode==='studio')room.style.opacity='0';
  }};
}
