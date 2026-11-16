import { type,motion,fonts } from '../tokens.js';
import { box,glass,text,reveal,atWord,progress,clamp,regionFor,gradientText,pill,disc,ICONS } from '../common.js';
// D13 stat: a spoken number counts up and lands (prices, durations, counts, percentages). Only spoken numbers.
export default {
  type:'stat',label:'Counting number',slots:['back','stage','panel'],
  params:{value:{type:'string',maxChars:10},label:{type:'string',maxChars:30,optional:true},meter:{type:'number',min:0,max:100,optional:true},icon:`enum?:${ICONS.join('|')}`,at:'word?'},
  beats:{},
  build(ctx) {
    const {kit,C,spec}=ctx,R=regionFor(ctx),back=ctx.slot==='back';
    const el=box(kit,'rd-stat',{left:'0',top:'0',width:'1080px',height:'1920px'});
    const m=/^([^\d]*)([\d][\d,]*\.?\d*)(.*)$/.exec(spec.value),target=m?parseFloat(m[2].replace(/,/g,'')):null;
    const decimals=m&&m[2].includes('.')?m[2].split('.')[1].length:0,commas=m&&m[2].includes(',');
    const fmt=v=>{let s=v.toFixed(decimals);if(commas)s=s.replace(/\B(?=(\d{3})+(?!\d))/g,',');return `${m[1]}${s}${m[3]}`;};
    let holder,num,lab=null,ring=null,ringLen=0;
    if(back){
      holder=glass(kit,C,R,{transformOrigin:'40% 60%'});el.append(holder);
      num=text(kit,spec.value,{position:'absolute',left:'40px',top:'34px',fontFamily:fonts.serif,fontStyle:'italic',fontWeight:'700',fontSize:`${kit.fitSize(spec.value,R.w-180,s=>`italic 700 ${s}px ${fonts.serif}`,150,60)}px`,lineHeight:'1',color:C.ink,letterSpacing:'-0.02em'});holder.append(num);
      if(spec.label)holder.append(lab=text(kit,spec.label,{position:'absolute',left:'44px',top:'210px',width:`${R.w-90}px`,fontSize:`${type.title-6}px`,color:C.ink+'cc',lineHeight:'1.15'}));
      if(spec.icon){const d=disc(kit,C,spec.icon,92);Object.assign(d.style,{right:'34px',top:'34px'});holder.append(d);}
    } else {
      const cx=R.x+R.w/2,cy=R.y+R.h*(ctx.slot==='panel'?0.42:0.44);
      holder=box(kit,'rd-stat-hold',{left:`${R.x}px`,top:`${R.y}px`,width:`${R.w}px`,height:`${R.h}px`,transformOrigin:'50% 45%'});el.append(holder);
      const size=kit.fitSize(spec.value,R.w*0.86,s=>`italic 700 ${s}px ${fonts.serif}`,ctx.slot==='panel'?220:300,90);
      num=gradientText(text(kit,spec.value,{position:'absolute',left:'0',width:`${R.w}px`,top:`${cy-R.y-size*0.62}px`,textAlign:'center',fontFamily:fonts.serif,fontStyle:'italic',fontWeight:'700',fontSize:`${size}px`,lineHeight:'1.1',letterSpacing:'-0.02em',filter:`drop-shadow(0 0 30px ${C.glow}66)`}),C);holder.append(num);
      if(spec.label){const p=box(kit,'rd-stat-lab',{left:'0',width:`${R.w}px`,top:`${cy-R.y+size*0.52}px`,display:'flex',justifyContent:'center'});p.append(pill(kit,C,spec.label));holder.append(lab=p);}
      if(spec.meter!==undefined){
        const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),r=Math.min(R.w,R.h)*0.46;svg.setAttribute('width',R.w);svg.setAttribute('height',R.h);svg.style.cssText='position:absolute;inset:0;overflow:visible';
        const mk=(stroke,w,o)=>{const c=document.createElementNS(ns,'circle');c.setAttribute('cx',cx-R.x);c.setAttribute('cy',cy-R.y);c.setAttribute('r',r);c.setAttribute('fill','none');c.setAttribute('stroke',stroke);c.setAttribute('stroke-width',w);c.setAttribute('opacity',o);c.setAttribute('transform',`rotate(-90 ${cx-R.x} ${cy-R.y})`);c.setAttribute('stroke-linecap','round');svg.append(c);return c;};
        mk(C.rim,3,0.18);ring=mk(C.accent2,10,1);ring.style.filter=`drop-shadow(0 0 10px ${C.glow})`;ringLen=2*Math.PI*r;ring.setAttribute('stroke-dasharray',`${ringLen} ${ringLen}`);holder.insertBefore(svg,holder.firstChild);
      }
    }
    const start=atWord(ctx,spec.at,ctx.tIn+0.35);
    return {el,landAt:start+0.85,seek(t){
      reveal(holder,t,back?ctx.tIn:start-0.1,{dur:0.5,blur:18,rise:back?50:30,scale:back?0.9:0.86,intensity:ctx.intensity});
      if(target!==null){const p=progress(t,start,0.95);num.textContent=fmt(target*p);}
      if(lab){const q=progress(t,start+0.55,0.35);lab.style.opacity=String(q);lab.style.transform=`translateY(${(1-q)*12}px)`;}
      if(ring){const q=progress(t,start,1.1);ring.setAttribute('stroke-dashoffset',String(ringLen*(1-q*spec.meter/100)));}
    }};
  },
};
