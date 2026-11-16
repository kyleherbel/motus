import { type,motion,fonts } from '../tokens.js';
import { box,text,reveal,atWord,progress,clamp,regionFor,outBack,disc,ICONS } from '../common.js';
// D13 orbit: a system, a toolkit, an "all-in-one", things that connect to one centre. Satellites land on
// their words and keep circling slowly on a tilted ellipse; far ones shrink and dim.
export default {
  type:'orbit',label:'Hub and satellites',slots:['stage','panel'],
  params:{center:{type:'string',maxChars:16},items:{type:'array',min:2,max:6,of:{text:{type:'string',maxChars:14},icon:`enum?:${ICONS.join('|')}`,at:'word?'}},at:'word?'},
  beats:{},
  build(ctx) {
    const {kit,C,spec}=ctx,R=regionFor(ctx),panel=ctx.slot==='panel';
    const el=box(kit,'rd-orbit',{left:`${R.x}px`,top:`${R.y}px`,width:`${R.w}px`,height:`${R.h}px`});
    const cx=R.w/2,cy=R.h*0.48,rx=R.w*0.40,ry=panel?R.h*0.36:R.h*0.30,hub=panel?190:250;
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('width',R.w);svg.setAttribute('height',R.h);svg.style.cssText='position:absolute;inset:0;overflow:visible';el.append(svg);
    const ring=document.createElementNS(ns,'ellipse');for(const [k,v] of [['cx',cx],['cy',cy],['rx',rx],['ry',ry],['fill','none'],['stroke',C.rim],['stroke-opacity','0.22'],['stroke-width','2'],['stroke-dasharray','3 10']])ring.setAttribute(k,v);svg.append(ring);
    const core=box(kit,'rd-hub',{left:`${cx-hub/2}px`,top:`${cy-hub/2}px`,width:`${hub}px`,height:`${hub}px`,borderRadius:'50%',display:'grid',placeItems:'center',textAlign:'center',padding:'26px',
      background:`radial-gradient(circle at 35% 30%,#fff,${C.glass} 55%,${C.accent2}88)`,boxShadow:`0 0 0 10px ${C.accent}22,0 0 80px ${C.glow}88,0 20px 50px #0007`});
    const size=kit.fitSize(spec.center,hub-50,s=>`600 ${s}px ${fonts.sans}`,panel?38:46,22);core.append(text(kit,spec.center,{fontSize:`${size}px`,fontWeight:'600',color:C.ink,lineHeight:'1.05'}));el.append(core);
    const n=spec.items.length;
    const sats=spec.items.map((it,i)=>{
      const s=box(kit,'rd-sat',{left:'0',top:'0',display:'flex',alignItems:'center',gap:'12px',padding:'10px 22px 10px 10px',borderRadius:'60px',background:`linear-gradient(160deg,#fff,${C.glass})`,boxShadow:'0 10px 26px #0006,inset 0 1px 1px #fff',whiteSpace:'nowrap'});
      const d=disc(kit,C,it.icon||'spark',panel?56:72);d.style.position='relative';s.append(d,text(kit,it.text,{fontSize:`${panel?30:38}px`,color:C.ink,fontWeight:'500'}));
      const line=document.createElementNS(ns,'line');line.setAttribute('stroke',C.accent2);line.setAttribute('stroke-width','2');line.setAttribute('stroke-dasharray','2 8');line.setAttribute('stroke-linecap','round');svg.append(line);
      el.append(s);return {s,line,a0:-Math.PI/2+i*2*Math.PI/n,start:atWord(ctx,it.at,ctx.tIn+0.6+i*0.5)};
    });
    const hubAt=atWord(ctx,spec.at,ctx.tIn+0.1);
    return {el,seek(t){
      const h=progress(t,hubAt,0.5,x=>outBack(x,1.5));core.style.opacity=String(clamp(h*1.4));core.style.transform=`scale(${0.5+0.5*h})`;core.style.filter=h<0.98?`blur(${(1-clamp(h))*12}px)`:'none';
      ring.style.opacity=String(progress(t,hubAt+0.2,0.6));
      const spin=(t-ctx.tIn)*0.05*Math.PI*2;
      sats.forEach(S=>{const a=S.a0+spin,x=cx+Math.cos(a)*rx,y=cy+Math.sin(a)*ry,depth=(Math.sin(a)+1)/2;
        const p=progress(t,S.start,0.45,v=>outBack(v,1.6));const k=0.78+0.22*depth;
        S.s.style.opacity=String(clamp(p*1.5)*(0.55+0.45*depth));S.s.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%) scale(${k*(0.4+0.6*p)})`;S.s.style.zIndex=depth>0.5?'3':'1';S.s.style.filter=depth<0.35?`blur(${(0.35-depth)*6}px)`:'none';
        const lp=progress(t,S.start,0.4);S.line.setAttribute('x1',cx);S.line.setAttribute('y1',cy);S.line.setAttribute('x2',cx+(x-cx)*lp);S.line.setAttribute('y2',cy+(y-cy)*lp);S.line.style.opacity=String(lp*0.8);});
      core.style.zIndex='2';
    }};
  },
};
