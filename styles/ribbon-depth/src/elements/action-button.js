import { geo,type,motion } from '../tokens.js';
import { box,text,icon,beat,progress,clamp,reveal,outBack } from '../common.js';
// D10: a cream pill button in a field of fine concentric rings; a cursor glides in and clicks on the
// spoken action, the button presses and a ripple runs out through the rings.
export default {
  type:'action-button',label:'Glass action and ripple',slots:['stage'],
  params:{label:{type:'string',maxChars:25}},beats:{click:{}},
  build(ctx) {
    const {kit,C,spec}=ctx,el=box(kit,'rd-action',{inset:'0'}),r=geo.action,cx=540,cy=r.y+r.h/2;
    const rings=Array.from({length:7},(_,i)=>{const size=380+i*120;const ring=box(kit,'rd-ring',{left:`${cx-size/2}px`,top:`${cy-size/2}px`,width:`${size}px`,height:`${size}px`,border:`1.5px solid ${C.rim}`,borderRadius:'50%'});el.append(ring);return ring;});
    const ripple=box(kit,'rd-ripple',{left:`${cx-200}px`,top:`${cy-200}px`,width:'400px',height:'400px',borderRadius:'50%',border:`3px solid ${C.rim}`,boxShadow:`0 0 40px ${C.glow}`});el.append(ripple);
    const button=box(kit,'rd-button',{left:`${r.x}px`,top:`${r.y}px`,width:`${r.w}px`,height:`${r.h}px`,borderRadius:'100px',display:'flex',alignItems:'center',justifyContent:'center',gap:'22px',
      background:'linear-gradient(180deg,#fffdf9,#f1e9df)',color:C.ink,boxShadow:`inset 0 2px 2px #fff,inset 0 -6px 14px #00000012,0 18px 50px #00000060,0 0 70px ${C.glow}50`});
    button.append(text(kit,spec.label,{fontSize:`${type.title+6}px`,letterSpacing:'-0.01em'}),icon(kit,'arrow',C,34,C.ink,2.6));el.append(button);
    const cursor=box(kit,'rd-cursor',{left:`${r.x+r.w-120}px`,top:`${r.y+r.h-40}px`,width:'70px',height:'70px'});cursor.append(icon(kit,'cursor',C,70,'#ffffff',2));cursor.firstChild.firstChild.setAttribute('fill','#111');el.append(cursor);
    const click=beat(ctx,'click')?.t;
    return {el,click,seek(t){
      reveal(button,t,ctx.tIn+0.05,{dur:0.5,blur:14,rise:30,scale:0.9,intensity:ctx.intensity,drift:false});
      const press=click===undefined?0:Math.max(0,Math.sin(clamp((t-click)/0.22)*Math.PI));
      button.style.transform+=` scale(${1-press*0.06})`;
      const cin=click===undefined?0:progress(t,click-0.55,0.5);
      cursor.style.opacity=String(clamp(cin*1.5));cursor.style.transform=`translate(${(1-cin)*140}px,${(1-cin)*170}px) scale(${1-press*0.12})`;
      const rp=click===undefined?0:clamp((t-click)/0.9);ripple.style.opacity=String(t>=click?(1-rp)*0.9:0);ripple.style.transform=`scale(${0.9+rp*2.6})`;
      rings.forEach((ring,i)=>{const base=progress(t,ctx.tIn+0.1+i*0.05,0.6);const wave=click===undefined?0:Math.exp(-Math.pow((t-click)*3.2-i*0.45,2));ring.style.opacity=String(base*(0.22-i*0.022)+wave*0.35);ring.style.transform=`scale(${1+Math.sin(t*0.8+i)*0.006+wave*0.04*ctx.intensity})`;});
    }};
  },
};
