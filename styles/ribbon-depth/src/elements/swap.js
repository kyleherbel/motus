import { type,motion,fonts } from '../tokens.js';
import { box,text,icon,reveal,atWord,progress,clamp,regionFor,outBack } from '../common.js';
// D13 swap: stop doing X, start doing Y; myth -> fact; old way -> new way. X is struck through and falls
// back, Y rises in its place with the accent.
export default {
  type:'swap',label:'Replace one thing with another',slots:['stage','panel'],
  params:{from:{type:'string',maxChars:28},to:{type:'string',maxChars:28},fromLabel:{type:'string',maxChars:14,optional:true},toLabel:{type:'string',maxChars:14,optional:true},at:'word?',toAt:'word?'},
  beats:{},
  build(ctx) {
    const {kit,C,spec}=ctx,R=regionFor(ctx),panel=ctx.slot==='panel';
    const el=box(kit,'rd-swap',{left:`${R.x}px`,top:`${R.y}px`,width:`${R.w}px`,height:`${R.h}px`});
    const ph=panel?120:150,fs=panel?40:50,y1=panel?40:R.h*0.18,y2=panel?R.h-ph-30:R.h*0.56;
    const mk=(value,label,on)=>{const wrap=box(kit,'rd-swapwrap',{left:'40px',width:`${R.w-80}px`,height:`${ph}px`,transformOrigin:'50% 50%'});
      const p=box(kit,'rd-swappill',{inset:'0',borderRadius:`${ph/2}px`,display:'flex',alignItems:'center',gap:'24px',padding:'0 40px',
        background:on?`linear-gradient(100deg,${C.accent},${C.accent2})`:`linear-gradient(160deg,#fff,${C.glass})`,color:on?'#fff':C.ink,boxShadow:on?`0 16px 50px ${C.glow}77,inset 0 2px 2px #ffffffaa`:'0 14px 40px #0007,inset 0 2px 2px #fff'});
      const mark=box(kit,'rd-swapmark',{position:'relative',width:`${ph*0.52}px`,height:`${ph*0.52}px`,flex:`0 0 ${ph*0.52}px`,borderRadius:'50%',display:'grid',placeItems:'center',background:on?'#ffffff33':`${C.ink}12`});
      mark.append(icon(kit,on?'check':'arrow',C,ph*0.3,on?'#fff':C.ink+'99',2.8));
      const size=kit.fitSize(value,R.w-80-ph*0.52-110,s=>`500 ${s}px ${fonts.sans}`,fs,24);
      const tx=text(kit,value,{position:'relative',fontSize:`${size}px`,fontWeight:'500',whiteSpace:'nowrap'});p.append(mark,tx);wrap.append(p);
      let lab=null;if(label){lab=text(kit,label.toUpperCase(),{position:'absolute',left:'44px',top:'-44px',fontSize:'24px',letterSpacing:'0.14em',color:on?C.accent2:C.muted,fontWeight:'600'});wrap.append(lab);}
      const strike=box(kit,'rd-strike',{left:`${ph*0.52+70}px`,width:`${Math.min(R.w-280,kit.measure(value,`500 ${size}px ${fonts.sans}`)+16)}px`,top:`${ph/2-2}px`,height:'4px',background:C.accent,borderRadius:'2px',transformOrigin:'left center'});
      if(!on)p.append(strike);el.append(wrap);return {wrap,p,strike};};
    const A=mk(spec.from,spec.fromLabel,false),B=mk(spec.to,spec.toLabel,true);A.wrap.style.top=`${y1}px`;B.wrap.style.top=`${y2}px`;
    const arrow=box(kit,'rd-swaparrow',{left:`${R.w/2-26}px`,top:`${(y1+ph+y2)/2-26}px`,width:'52px',height:'52px'});arrow.append(icon(kit,'arrow',C,52,C.accent2,2.6));arrow.firstChild.style.transform='rotate(90deg)';el.append(arrow);
    const s1=atWord(ctx,spec.at,ctx.tIn+0.2),s2=atWord(ctx,spec.toAt,s1+1.2);
    return {el,landAt:s2,seek(t){
      reveal(A.wrap,t,s1,{dur:0.45,blur:14,rise:30,scale:0.92,intensity:ctx.intensity});
      const k=progress(t,s2-0.35,0.35);A.strike.style.transform=`scaleX(${k})`;
      const d=progress(t,s2,0.5);A.p.style.opacity=String(1-0.55*d);A.p.style.filter=d>0.01?`blur(${d*1.5}px) saturate(${1-0.6*d})`:'none';A.wrap.style.transform+=` perspective(800px) rotateX(${d*18}deg) scale(${1-0.06*d})`;
      const q=progress(t,s2,0.5,x=>outBack(x,1.3));B.wrap.style.opacity=String(clamp(q*1.4));B.wrap.style.transform=`translateY(${(1-q)*60}px) scale(${0.85+0.15*q})`;B.wrap.style.filter=q<0.98?`blur(${(1-clamp(q))*12}px)`:'none';
      const a=progress(t,s2-0.2,0.35);arrow.style.opacity=String(a);arrow.style.transform=`translateY(${(1-a)*-14}px)`;
    }};
  },
};
