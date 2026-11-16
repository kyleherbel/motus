import { geo,type,motion,fonts } from '../tokens.js';
import { box,text,mixed,progress,atWord,beat,reveal,pill,disc,outBack,clamp,ICONS } from '../common.js';
// D10 text stack: capsule (opening words) -> optional lead line -> hero with one heavy italic accent and
// a self-drawing underline -> optional node timeline whose stops land on their words.
export default {
  type:'phrase',label:'Mixed-type phrase',slots:['front','back-title'],
  params:{text:{type:'string',maxChars:36,maxWords:7},accent:{type:'string',maxChars:22,optional:true},label:{type:'string',maxChars:38,optional:true},lead:{type:'string',maxChars:30,optional:true},at:'word?',labelAt:'word?',
    steps:{type:'array',min:1,max:3,optional:true,of:{text:{type:'string',maxChars:14},at:'word?',icon:`enum?:${ICONS.join('|')}`}}},
  beats:{underline:{}},
  build(ctx) {
    const {kit,C,spec,slot}=ctx,studio=ctx.mode==='studio';
    const heroY=studio?geo.studioHeroY:spec.lead?geo.hero.y+18:geo.hero.y;
    const el=box(kit,'rd-phrase',{left:'0',top:'0',width:'1080px',height:'1920px',pointerEvents:'none'});
    const heroBox=box(kit,'rd-hero',{left:`${geo.hero.x}px`,top:`${heroY}px`,width:`${geo.hero.w}px`,transformOrigin:'50% 60%'});
    const headline=mixed(kit,spec.text,spec.accent,C,{ink:slot==='back-title'?C.accent:C.text});heroBox.append(headline.el);
    headline.el.style.textShadow=C.light?'none':`0 4px 30px #00000080`;
    let line=null;
    if(headline.accent){line=box(kit,'rd-underline',{left:'2%',bottom:'2px',width:'96%',height:'4px',borderRadius:'2px',background:`linear-gradient(90deg,${C.rim},${C.accent2})`,boxShadow:`0 0 12px ${C.glow}`,transformOrigin:'left center'});headline.accent.append(line);}
    el.append(heroBox);
    let pillEl=null,leadEl=null;
    if(spec.label){
      const size=kit.fitSize(spec.label,geo.hero.w-80,s=>`400 ${s}px ${fonts.sans}`,type.pill,type.min);
      const y=studio?geo.studioPillY:spec.lead?geo.hero.pillY-58:geo.hero.pillY;
      pillEl=box(kit,'rd-pillwrap',{left:'0',top:`${y}px`,width:'1080px',display:'flex',justifyContent:'center'});pillEl.append(pill(kit,C,spec.label,{size}));el.append(pillEl);
    }
    if(spec.lead){
      const size=kit.fitSize(spec.lead,geo.hero.w,s=>`400 ${s}px ${fonts.sans}`,type.lead,type.min);
      leadEl=text(kit,spec.lead,{position:'absolute',left:'0',top:`${geo.hero.leadY-20}px`,width:'1080px',textAlign:'center',fontSize:`${size}px`,color:C.text,textShadow:'0 2px 16px #00000090'});el.append(leadEl);
    }
    const start=atWord(ctx,spec.at,ctx.tIn+0.67);
    const labelStart=spec.labelAt!==undefined?atWord(ctx,spec.labelAt):Math.min(start-0.2,ctx.tIn+0.12);
    const leadStart=spec.lead?Math.max(labelStart+0.15,start-0.45):start;
    // node timeline
    const steps=(spec.steps||[]).map((s,i,arr)=>{
      const n=arr.length,x=n===1?geo.steps.x0+60:geo.steps.x0+60+i*((geo.steps.x1-geo.steps.x0-160)/Math.max(1,n-1)*(n===2?0.55:1));
      const node=disc(kit,C,s.icon||['eye','cursor','cart'][i]||'spark',geo.steps.node,{dark:true});Object.assign(node.style,{left:`${x-geo.steps.node/2}px`,top:`${geo.steps.y-geo.steps.node/2}px`});
      const tag=box(kit,'rd-steptag',{left:`${x-120}px`,top:`${geo.steps.y+geo.steps.node/2+12}px`,width:'240px',display:'flex',justifyContent:'center'});tag.append(pill(kit,C,s.text,{size:type.small,pad:'8px 18px'}));
      el.append(node,tag);return {node,tag,x,start:atWord(ctx,s.at,start+0.6+i*0.8)};
    });
    let track=null,fill=null;
    if(steps.length){track=box(kit,'rd-track',{left:`${geo.steps.x0}px`,top:`${geo.steps.y-1}px`,width:`${geo.steps.x1-geo.steps.x0}px`,height:'2px',background:`${C.rim}40`,transformOrigin:'left center'});
      fill=box(kit,'rd-trackfill',{left:`${geo.steps.x0}px`,top:`${geo.steps.y-1.5}px`,width:`${geo.steps.x1-geo.steps.x0}px`,height:'3px',background:`linear-gradient(90deg,${C.accent},${C.rim})`,boxShadow:`0 0 10px ${C.glow}`,transformOrigin:'left center'});el.insertBefore(fill,el.firstChild);el.insertBefore(track,el.firstChild);}
    const under=beat(ctx,'underline')?.t??start+motion.phrase*0.8;
    return {el,labelStart,heroStart:start,seek(t){
      const it=ctx.intensity;
      reveal(heroBox,t,start,{dur:motion.phrase*1.4,blur:18,rise:26,scale:0.95,intensity:it});
      if(pillEl){const p=progress(t,labelStart,motion.label,x=>outBack(x,1.3));pillEl.style.opacity=String(clamp(p*1.4));pillEl.style.transform=`translateY(${(1-p)*14}px) scale(${0.86+0.14*p})`;pillEl.style.filter=p<0.98?`blur(${(1-clamp(p))*8}px)`:'none';}
      if(leadEl)reveal(leadEl,t,leadStart,{dur:motion.phrase,blur:10,rise:14,scale:0.98,intensity:it,drift:false});
      if(line)line.style.transform=`scaleX(${progress(t,under,motion.underline)})`;
      if(track){track.style.transform=`scaleX(${progress(t,start+0.15,0.6)})`;track.style.opacity=String(progress(t,start+0.15,0.3));}
      let reached=-1;steps.forEach((s,i)=>{if(t>=s.start)reached=i;const p=progress(t,s.start,motion.disc,x=>outBack(x,1.8));s.node.style.opacity=String(clamp(p*1.5));s.node.style.transform=`scale(${0.4+0.6*p})`;const q=progress(t,s.start+0.08,motion.label);s.tag.style.opacity=String(q);s.tag.style.transform=`translateY(${(1-q)*10}px)`;});
      if(fill){const span=geo.steps.x1-geo.steps.x0;const target=reached<0?0:(steps[reached].x-geo.steps.x0)/span;const prevX=reached<1?0:(steps[reached-1].x-geo.steps.x0)/span;const k=reached<0?0:progress(t,steps[reached].start-0.25,0.35);fill.style.transform=`scaleX(${prevX+(target-prevX)*k})`;}
    }};
  },
};
