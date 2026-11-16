import { type,motion,fonts } from '../tokens.js';
import { box,glass,text,mixed,reveal,atWord,progress,clamp,regionFor,outBack } from '../common.js';
// D13 chart: growth, decline or a trend over time. Points land on their words; heights are relative and
// illustrative, so no numbers are drawn unless the speaker gave them as labels.
export default {
  type:'chart',label:'Line or bars',slots:['stage','panel'],
  params:{kind:'enum?:line|bars',title:{type:'string',maxChars:26,optional:true},accent:{type:'string',maxChars:16,optional:true},
    points:{type:'array',min:2,max:6,of:{label:{type:'string',maxChars:10,optional:true},value:{type:'number',min:0,max:100},at:'word?'}}},
  beats:{},
  build(ctx) {
    const {kit,C,spec}=ctx,R=regionFor(ctx),bars=spec.kind==='bars',panel=ctx.slot==='panel';
    const card=glass(kit,C,{x:R.x,y:R.y,w:R.w,h:panel?R.h:Math.min(R.h,640)},{transformOrigin:'50% 60%'});
    const W=R.w,Hh=panel?R.h:Math.min(R.h,640),padL=56,padR=56,top=spec.title?(panel?92:120):50,bot=86,pw=W-padL-padR,ph=Hh-top-bot;
    if(spec.title){const h=mixed(kit,spec.title,spec.accent,C,{size:panel?40:48,width:W-120,ink:C.ink,ratio:1.15});Object.assign(h.el.style,{position:'absolute',left:'48px',top:panel?'28px':'40px',textAlign:'left'});card.append(h.el);}
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('width',W);svg.setAttribute('height',Hh);svg.style.cssText='position:absolute;inset:0;overflow:visible';card.append(svg);
    for(let g=0;g<=3;g++){const l=document.createElementNS(ns,'line');const y=top+ph*g/3;l.setAttribute('x1',padL);l.setAttribute('x2',W-padR);l.setAttribute('y1',y);l.setAttribute('y2',y);l.setAttribute('stroke',C.ink);l.setAttribute('stroke-opacity','0.08');l.setAttribute('stroke-dasharray','4 8');svg.append(l);}
    const n=spec.points.length,X=i=>padL+(n===1?pw/2:pw*i/(n-1)),Y=v=>top+ph*(1-v/100);
    const pts=spec.points.map((p,i)=>({...p,x:bars?padL+pw*(i+0.5)/n:X(i),y:Y(p.value),start:atWord(ctx,p.at,ctx.tIn+0.5+i*0.6)}));
    const labels=pts.map(p=>{const l=text(kit,p.label||'',{position:'absolute',left:`${p.x-90}px`,width:'180px',top:`${top+ph+22}px`,textAlign:'center',fontSize:`${panel?24:28}px`,color:C.ink+'aa'});card.append(l);return l;});
    let area=null,line=null,clip=null,bwrap=[];
    if(bars){const bw=Math.min(110,pw/n*0.56);bwrap=pts.map((p,i)=>{const b=box(kit,'rd-bar',{left:`${p.x-bw/2}px`,top:`${p.y}px`,width:`${bw}px`,height:`${top+ph-p.y}px`,borderRadius:'18px 18px 6px 6px',transformOrigin:'50% 100%',
      background:i===n-1?`linear-gradient(180deg,${C.accent2},${C.accent})`:`linear-gradient(180deg,${C.ink}30,${C.ink}14)`,boxShadow:i===n-1?`0 0 30px ${C.glow}66`:'none'});card.append(b);return b;});}
    else{
      const d=pts.map((p,i)=>{if(!i)return `M ${p.x} ${p.y}`;const a=pts[i-1],mx=(a.x+p.x)/2;return `C ${mx} ${a.y}, ${mx} ${p.y}, ${p.x} ${p.y}`;}).join(' ');
      const defs=document.createElementNS(ns,'defs');const lg=document.createElementNS(ns,'linearGradient');lg.id=`rd-area-${ctx.tIn.toFixed(2).replace('.','_')}`;lg.setAttribute('x1','0');lg.setAttribute('y1','0');lg.setAttribute('x2','0');lg.setAttribute('y2','1');
      for(const [o,c,a] of [[0,C.accent,0.45],[1,C.accent,0]]){const s=document.createElementNS(ns,'stop');s.setAttribute('offset',o);s.setAttribute('stop-color',c);s.setAttribute('stop-opacity',a);lg.append(s);}
      const cp=document.createElementNS(ns,'clipPath');cp.id=lg.id+'c';clip=document.createElementNS(ns,'rect');clip.setAttribute('x',0);clip.setAttribute('y',0);clip.setAttribute('height',Hh);clip.setAttribute('width',0);cp.append(clip);defs.append(lg,cp);svg.append(defs);
      area=document.createElementNS(ns,'path');area.setAttribute('d',`${d} L ${pts.at(-1).x} ${top+ph} L ${pts[0].x} ${top+ph} Z`);area.setAttribute('fill',C.accent);area.setAttribute('fill-opacity','0.16');area.setAttribute('clip-path',`url(#${cp.id})`);
      line=document.createElementNS(ns,'path');line.setAttribute('d',d);line.setAttribute('fill','none');line.setAttribute('stroke',C.accent);line.setAttribute('stroke-width','6');line.setAttribute('stroke-linecap','round');line.setAttribute('clip-path',`url(#${cp.id})`);
      // glow as a wide translucent stroke (a CSS filter on an SVG path is not bit-stable between seeks)
      const glowLine=line.cloneNode();glowLine.setAttribute('stroke',C.glow);glowLine.setAttribute('stroke-width','18');glowLine.setAttribute('stroke-opacity','0.22');
      svg.append(area,glowLine,line);
    }
    const dots=pts.map((p,i)=>{const d=box(kit,'rd-pt',{left:`${p.x-15}px`,top:`${p.y-15}px`,width:'30px',height:'30px',borderRadius:'50%',background:i===n-1?C.accent:'#fff',border:`5px solid ${i===n-1?'#fff':C.accent}`,boxShadow:i===n-1?`0 0 0 10px ${C.accent}33,0 0 30px ${C.glow}`:`0 4px 10px #0003`});if(!bars)card.append(d);return d;});
    return {el:card,landAt:pts.at(-1).start+0.2,seek(t){
      reveal(card,t,ctx.tIn,{dur:0.5,blur:16,rise:40,scale:0.92,intensity:ctx.intensity});
      let reach=0;pts.forEach((p,i)=>{const q=progress(t,p.start-0.25,0.45);if(i===0)reach=pts[0].x*q;else if(t>=p.start-0.25)reach=pts[i-1].x+(p.x-pts[i-1].x)*q;});
      if(clip)clip.setAttribute('width',String(Math.max(0,reach)));
      pts.forEach((p,i)=>{const q=progress(t,p.start,0.35,x=>outBack(x,1.8));if(!bars){dots[i].style.opacity=String(clamp(q*1.5));dots[i].style.transform=`scale(${0.2+0.8*q})`;}
        else{bwrap[i].style.transform=`scaleY(${progress(t,p.start-0.1,0.55)})`;bwrap[i].style.opacity=String(clamp(progress(t,p.start-0.1,0.2)));}
        const l=progress(t,p.start,0.3);labels[i].style.opacity=String(l);labels[i].style.transform=`translateY(${(1-l)*8}px)`;});
    }};
  },
};
