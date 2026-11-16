import { type,motion,fonts } from '../tokens.js';
import { box,text,reveal,atWord,progress,clamp,regionFor,outBack } from '../common.js';
// D13 chat: a conversation, DM, comment or question. Bubbles arrive on their words after a typing indicator;
// older bubbles slide up as new ones land. Text comes from the speech.
export default {
  type:'chat',label:'Message bubbles',slots:['stage','panel'],
  params:{name:{type:'string',maxChars:18,optional:true},messages:{type:'array',min:1,max:4,of:{text:{type:'string',maxChars:44},side:'enum?:left|right',at:'word?'}}},
  beats:{},
  build(ctx) {
    const {kit,C,spec}=ctx,R=regionFor(ctx),panel=ctx.slot==='panel';
    const el=box(kit,'rd-chat',{left:`${R.x}px`,top:`${R.y}px`,width:`${R.w}px`,height:`${R.h}px`});
    const fs=panel?40:46,lh=fs*1.25,padX=34,padY=22,maxW=R.w*0.82;
    let headH=0,head=null;
    if(spec.name&&!panel){headH=110;head=box(kit,'rd-chat-head',{left:'0',top:'0',width:`${R.w}px`,height:'90px',display:'flex',alignItems:'center',gap:'18px'});
      const av=box(kit,'rd-av',{position:'relative',width:'74px',height:'74px',borderRadius:'50%',background:`linear-gradient(135deg,${C.accent2},${C.accent})`,display:'grid',placeItems:'center',boxShadow:`0 0 24px ${C.glow}66`});
      av.append(text(kit,spec.name.trim()[0].toUpperCase(),{fontSize:'36px',color:'#fff',fontWeight:'600'}));
      const nm=box(kit,'rd-nm',{position:'relative'});nm.append(text(kit,spec.name,{fontSize:'34px',color:C.text,fontWeight:'500'}),text(kit,'online',{fontSize:'24px',color:C.muted}));
      head.append(av,nm);el.append(head);}
    const bubbles=spec.messages.map((msg,i)=>{
      const right=(msg.side||(i%2?'left':'right'))==='right';
      const lines=kit.wrap(msg.text.split(/\s+/),maxW-padX*2,`400 ${fs}px ${fonts.sans}`);
      const w=Math.min(maxW,Math.max(...lines.map(l=>kit.measure(l.join(' '),`400 ${fs}px ${fonts.sans}`)))+padX*2+4),h=lines.length*lh+padY*2;
      const b=text(kit,msg.text,{position:'absolute',[right?'right':'left']:'0',width:`${w}px`,padding:`${padY}px ${padX}px`,fontSize:`${fs}px`,lineHeight:`${lh}px`,borderRadius:right?'36px 36px 10px 36px':'36px 36px 36px 10px',
        background:right?`linear-gradient(135deg,${C.accent2},${C.accent})`:`linear-gradient(160deg,#ffffff,${C.glass})`,color:right?'#fff':C.ink,boxShadow:right?`0 10px 30px ${C.glow}55,inset 0 1px 1px #ffffff90`:'0 10px 30px #00000055,inset 0 1px 1px #fff',transformOrigin:right?'100% 100%':'0% 100%'});
      const dots=box(kit,'rd-typing',{[right?'right':'left']:'0',width:'120px',height:'64px',borderRadius:'32px',background:right?C.accent+'cc':'#ffffffe0',display:'flex',alignItems:'center',justifyContent:'center',gap:'9px'});
      const ds=[0,1,2].map(()=>{const d=box(kit,'d',{position:'relative',width:'12px',height:'12px',borderRadius:'50%',background:right?'#fff':C.ink+'99'});dots.append(d);return d;});
      el.append(dots,b);
      return {b,dots,ds,h,start:atWord(ctx,msg.at,ctx.tIn+0.4+i*1.1),right};
    });
    const gap=18,bottom=R.h-10;
    return {el,seek(t){
      if(head)reveal(head,t,ctx.tIn,{dur:0.45,blur:12,rise:20,intensity:ctx.intensity,drift:false});
      // stack from the bottom: each arrived bubble pushes the ones above it up by its (progressed) height
      let y=bottom;
      for(let i=bubbles.length-1;i>=0;i--){const B=bubbles[i];const p=progress(t,B.start,0.38,x=>outBack(x,1.4));const grow=clamp(progress(t,B.start,0.3));
        if(t<B.start-0.5){B.b.style.opacity='0';B.dots.style.opacity='0';continue;}
        const typing=t>=B.start-0.5&&t<B.start;
        B.dots.style.top=`${bottom-64}px`;B.dots.style.opacity=typing?String(progress(t,B.start-0.5,0.15)):'0';
        B.ds.forEach((d,k)=>{d.style.transform=`translateY(${-6*Math.max(0,Math.sin((t*7)-k*0.9))}px)`;});
        if(t<B.start){B.b.style.opacity='0';continue;}
        y-=B.h*grow;B.b.style.top=`${y}px`;y-=gap*grow;
        B.b.style.opacity=String(clamp(p*1.5));B.b.style.transform=`scale(${0.6+0.4*p})`;B.b.style.filter=p<0.98?`blur(${(1-clamp(p))*6}px)`:'none';
        if(y<headH){B.b.style.opacity=String(clamp(p*1.5)*clamp((y+B.h-headH)/B.h));}
      }
    }};
  },
};
