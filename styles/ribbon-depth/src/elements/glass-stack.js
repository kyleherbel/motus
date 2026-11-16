import { geo,type,motion } from '../tokens.js';
import { box,glass,text,icon,reveal,atWord,progress,clamp,ICONS } from '../common.js';
// D10: abstract sequence. Small tilted glass cards rise on their words; a fine glowing trail enters from
// the lower left, threads each card, snakes upward and leaves the top. A light pulse travels along it.
export default {
  type:'glass-stack',label:'Linked glass sequence',slots:['stage'],
  params:{cards:{type:'array',min:2,max:4,of:{title:{type:'string',maxChars:23},detail:{type:'string',maxChars:32,optional:true},at:'word?',icon:`enum?:${ICONS.join('|')}`}}},
  beats:{},
  build(ctx) {
    const {kit,C,spec}=ctx,el=box(kit,'rd-stack',{inset:'0'}),n=spec.cards.length;
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('width','1080');svg.setAttribute('height','1920');svg.style.cssText='position:absolute;inset:0;overflow:visible';el.append(svg);
    const top=geo.stack.tops[n],pitch=geo.stack.pitches[n],S=geo.stack;
    const cards=spec.cards.map((card,i)=>{
      const x=540-S.w/2+(i%2?36:-36),y=top+(n-1-i)*pitch;
      const r={x,y,w:S.w,h:S.h};
      const wrap=box(kit,'rd-stackcard',{left:`${x}px`,top:`${y}px`,width:`${S.w}px`,height:`${S.h}px`,perspective:'900px'});
      const c=glass(kit,C,{x:0,y:0,w:S.w,h:S.h},{borderRadius:'26px',transform:`rotateX(${8}deg) rotateY(${i%2?-14:14}deg) rotateZ(${i%2?S.tilt:-S.tilt}deg)`});
      c.append(text(kit,card.title,{position:'absolute',left:'30px',top:'28px',fontSize:`${type.title-6}px`,maxWidth:`${S.w-130}px`,letterSpacing:'-0.01em'}));
      if(card.detail)c.append(text(kit,card.detail,{position:'absolute',left:'30px',bottom:'30px',fontSize:`${type.small-2}px`,maxWidth:`${S.w-70}px`,color:C.ink+'aa'}));
      else c.append(text(kit,'···',{position:'absolute',left:'32px',bottom:'22px',fontSize:'34px',color:C.ink+'90',letterSpacing:'2px'}));
      const badge=box(kit,'rd-stack-icon',{right:'24px',top:'22px',width:'54px',height:'54px',borderRadius:'50%',background:`radial-gradient(circle at 35% 30%,#fff,${C.glass})`,boxShadow:`0 4px 12px #0000002e,inset 0 1px 1px #fff`,display:'grid',placeItems:'center'});
      badge.append(icon(kit,card.icon||['spark','cursor','cart','check'][i]||'spark',C,28));c.append(badge);
      wrap.append(c);el.append(wrap);
      return {el:wrap,r,start:atWord(ctx,card.at,ctx.tIn+motion.incoming+i*0.9),side:i%2?1:-1};
    });
    // one trail, threaded through every card; each leg draws as its card arrives
    const legs=[];const P=cards.map(c=>({l:[c.r.x+30,c.r.y+c.r.h*0.62],rt:[c.r.x+c.r.w-24,c.r.y+c.r.h*0.40]}));
    const add=(d,start,dur)=>{const halo=document.createElementNS(ns,'path'),core=document.createElementNS(ns,'path'),pulse=document.createElementNS(ns,'path');
      for(const p of [halo,core,pulse]){p.setAttribute('d',d);p.setAttribute('fill','none');p.setAttribute('pathLength','1');p.setAttribute('stroke-linecap','round');}
      halo.setAttribute('stroke',C.accent);halo.setAttribute('stroke-width','16');halo.style.filter='blur(9px)';halo.setAttribute('opacity','0.75');
      core.setAttribute('stroke',C.rim);core.setAttribute('stroke-width','3');core.style.filter=`drop-shadow(0 0 6px ${C.glow})`;
      pulse.setAttribute('stroke','#ffffff');pulse.setAttribute('stroke-width','6');pulse.style.filter='blur(2px)';
      for(const p of [halo,core]){p.setAttribute('stroke-dasharray','1 1');}
      pulse.setAttribute('stroke-dasharray','0.06 1');
      svg.append(halo,core,pulse);legs.push({halo,core,pulse,start,dur});};
    add(`M -80 ${P[0].l[1]+150} C 120 ${P[0].l[1]+140}, ${P[0].l[0]-60} ${P[0].l[1]+40}, ${P[0].l[0]} ${P[0].l[1]}`,cards[0].start-0.25,0.45);
    for(let i=0;i<n;i++){
      const a=P[i].rt,b=i<n-1?P[i+1].rt:[860,-60];
      const bulge=i<n-1?(i%2?120:1000):1040;
      const d=`M ${a[0]} ${a[1]} C ${bulge} ${a[1]-30}, ${bulge} ${b[1]+(i<n-1?160:500)}, ${b[0]} ${b[1]}`;
      add(d,(i<n-1?cards[i+1].start:cards[i].start+0.2)-0.30,0.5);
    }
    return {el,seek(t){
      cards.forEach((c,i)=>{const p=reveal(c.el,t,c.start,{dur:0.55,blur:16,rise:40,scale:0.9,intensity:ctx.intensity,extra:''});const slide=(1-p)*(i?180:0)*ctx.intensity;c.el.style.transform+=` translateX(${slide}px)`;});
      legs.forEach(L=>{const p=progress(t,L.start,L.dur,x=>1-Math.pow(1-clamp(x),2.2));for(const s of [L.halo,L.core]){s.style.strokeDashoffset=String(1-p);s.style.opacity=p>0?'':'0';}
        const flow=((t-L.start)*0.45)%1.2;L.pulse.style.strokeDashoffset=String(-flow);L.pulse.style.opacity=String(p>=1?0.9:0);});
    }};
  },
};
