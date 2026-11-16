import { fonts, type, geo, motion } from './tokens.js';
export const clamp = (x, a=0, b=1) => Math.max(a, Math.min(b, x));
// D12: entrances settle exponentially (out-expo); overshoot only on small pops (out-back).
export const outExpo = x => { x=clamp(x); return x===1?1:1-Math.pow(2,-10*x); };
export const outCubic = x => 1 - Math.pow(1-clamp(x), 3);
export const outBack = (x,s=1.5) => { x=clamp(x); const c=s+1; return 1+c*Math.pow(x-1,3)+s*Math.pow(x-1,2); };
export const inOutSine = x => -(Math.cos(Math.PI*clamp(x))-1)/2;
export const ease = outExpo;
export const progress = (t, start, duration=motion.enter, fn=outExpo) => fn((t-start)/duration);
export const box = (kit, className, style={}) => kit.h(`div.${className}`, { style: { position:'absolute', boxSizing:'border-box', ...style } });
export const rectStyle = r => ({ left:`${r.x}px`,top:`${r.y}px`,width:`${r.w}px`,height:`${r.h}px` });
// Deterministic hash noise in [0,1): same inputs give the same pixels on every seek.
export const noise = (i, k=0) => { const s=Math.sin(i*127.1+k*311.7)*43758.5453; return s-Math.floor(s); };

// D09: frosted cream glass. Bright top-left sheen, a hairline rim, a warm reflected tint at the bottom.
export function glass(kit, C, r, extra={}) {
  return box(kit,'rd-glass',{...rectStyle(r),
    background:`linear-gradient(160deg,#ffffff 0%,${C.glass} 46%,${C.glass}f2 78%,${C.accent2}55 130%)`,
    border:`1.5px solid #ffffffd8`,borderRadius:`${geo.radius}px`,
    boxShadow:`inset 0 2px 2px #ffffff,inset 0 -10px 24px ${C.accent}1c,0 22px 50px #0000004d,0 2px 6px #00000024,0 0 60px ${C.glow}1f`,
    color:C.ink,overflow:'hidden',...extra});
}
export function text(kit,value,style={}) { return kit.h('div',{text:value,style:{fontFamily:fonts.sans,fontSize:`${type.body}px`,fontWeight:String(type.weight),lineHeight:'1.15',...style}}); }
// One sans run and one heavier, larger Playfair italic accent. `split` puts the accent on its own line.
export function mixed(kit,value,accent,C,{size=type.hero,width=geo.hero.w,ink=C.text,ratio=type.italic/type.hero,accentWeight=type.accentWeight,split=false}={}) {
  const el = box(kit,'rd-mixed',{position:'relative',width:`${width}px`,color:ink,textAlign:'center',whiteSpace:split?'normal':'nowrap',lineHeight:split?'1.02':'1.10'});
  const pieces = accent && value.includes(accent) ? [value.slice(0,value.indexOf(accent)),accent,value.slice(value.indexOf(accent)+accent.length)] : [value];
  const font=(i,s)=>`${i===1?'italic '+accentWeight:type.weight} ${s*(i===1?ratio:1)}px ${i===1?fonts.serif:fonts.sans}`;
  const fit = s => split?Math.max(...pieces.map((v,i)=>kit.measure(v.trim(),font(i,s)))):pieces.reduce((n,v,i)=>n+kit.measure(v,font(i,s)),0);
  let fs=size; while(fs>type.min && fit(fs)>width) fs--;
  const spans=pieces.map((v,i)=>kit.h('span',{text:split?v.trim():v,style:{fontFamily:i===1?fonts.serif:fonts.sans,fontSize:`${fs*(i===1?ratio:1)}px`,fontStyle:i===1?'italic':'normal',fontWeight:String(i===1?accentWeight:type.weight),position:'relative',display:split&&i===1?'block':'inline-block',whiteSpace:'pre',letterSpacing:i===1?'-0.01em':'-0.015em'}}));
  el.append(...spans.filter(s=>s.textContent));
  return {el,accent:spans.length===3?spans[1]:null,size:fs};
}
export function atWord(ctx,i,fallback=ctx.tIn) { return i === undefined ? fallback : ctx.doc.words[i]?.start ?? fallback; }
export function beat(ctx,name,index) { return ctx.beats.find(b=>b.do===name && (index===undefined || b.index===index)); }
// D12 blur-to-sharp entrance: opacity, blur, rise and scale all settle on one out-expo curve.
export function reveal(el,t,start,{dur=motion.enter,blur=16,rise=40,scale=0.94,tilt=0,intensity=1,drift=true,extra=''}={}) {
  const p=progress(t,start,dur);
  const d=drift?Math.sin(Math.max(0,t-start)*motion.driftHz*Math.PI*2/3+start)*motion.drift*0.6*intensity:0;
  el.style.opacity=String(clamp(p*1.15));
  el.style.filter=p<0.999?`blur(${(1-p)*blur*intensity}px)`:'none';
  el.style.transform=`translateY(${(1-p)*rise*intensity-d}px) scale(${1-(1-p)*(1-scale)}) rotate(${tilt}deg) ${extra}`;
  return p;
}
export function animate(el,t,start,ctx,{tilt=0,travel=motion.travel}={}) { return reveal(el,t,start,{rise:travel,tilt,intensity:ctx.intensity}); }
const PATHS={
  check:'M7 18.5l6.5 6.5L29 9.5',search:'M23.5 23.5l7 7M26 15.5a10.5 10.5 0 1 1-21 0 10.5 10.5 0 0 1 21 0',arrow:'M6 18h24M21 9l9 9-9 9',
  person:'M18 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12M7 31c0-12.5 22-12.5 22 0',spark:'M18 3l3.6 11.4L33 18l-11.4 3.6L18 33l-3.6-11.4L3 18l11.4-3.6z',
  people:'M13 16a5 5 0 1 0 0-10 5 5 0 0 0 0 10M3 29c0-10 20-10 20 0M24 16a4.5 4.5 0 1 0 0-9M26 20c4 .8 7 3.6 7 9',
  eye:'M3 18s5.5-9 15-9 15 9 15 9-5.5 9-15 9-15-9-15-9zM18 22.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9',
  cursor:'M9 5l18 10.5-7.5 2.2 4.6 8.4-3.7 2-4.6-8.4L10 25z',cart:'M4 6h4.5l3.2 16h15.5l3-11H10M14 30a1.8 1.8 0 1 0 0-.1M25 30a1.8 1.8 0 1 0 0-.1',
  lock:'M10 16V12a8 8 0 0 1 16 0v4M8 16h20v15H8zM18 22v4',chat:'M5 8h26v16H15l-7 6v-6H5z',bolt:'M20 3L7 20h10l-2 13 13-17H18z',
};
export const ICONS=Object.keys(PATHS);
export function icon(kit,kind,C,size=36,color=C.ink,width=2.2) {
  const el=document.createElementNS('http://www.w3.org/2000/svg','svg');el.setAttribute('viewBox','0 0 36 36');el.setAttribute('width',size);el.setAttribute('height',size);el.style.display='block';
  const p=document.createElementNS(el.namespaceURI,'path');p.setAttribute('d',PATHS[kind]||PATHS.spark);p.setAttribute('fill','none');p.setAttribute('stroke',color);p.setAttribute('stroke-width',String(width));p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');el.append(p);return el;
}
// D11: the white glass disc that carries an icon (tiles that pop on key words).
export function disc(kit,C,kind,size,{dark=false}={}) {
  const d=box(kit,'rd-disc',{width:`${size}px`,height:`${size}px`,borderRadius:'50%',display:'grid',placeItems:'center',
    background:dark?`radial-gradient(circle at 35% 30%,#3b3f5c,#141629 70%)`:`radial-gradient(circle at 34% 28%,#ffffff,${C.glass} 62%,${C.muted})`,
    boxShadow:dark?`0 0 0 3px ${C.rim}cc,0 0 26px ${C.glow}aa,0 10px 24px #00000066`:`inset 0 2px 2px #fff,0 10px 26px #00000055,0 0 30px ${C.glow}33`});
  d.append(icon(kit,kind,C,Math.round(size*0.5),dark?C.rim:C.ink,2.4));return d;
}
export function pill(kit,C,value,{size=type.pill,pad='14px 28px'}={}) {
  return text(kit,value,{whiteSpace:'nowrap',fontSize:`${size}px`,background:`linear-gradient(180deg,#fffdf8,${C.pill})`,color:C.ink,padding:pad,borderRadius:'80px',boxShadow:`inset 0 1px 1px #fff,0 6px 18px #0000003a,0 0 0 1px #ffffffa0`,letterSpacing:'-0.01em'});
}
// D13 helpers shared by the scene library
export const regionFor = ctx => geo.region[ctx.slot] || geo.region.stage;
export function gradientText(el,C,{from=C.rim,to=C.accent2,angle=180}={}) {
  Object.assign(el.style,{backgroundImage:`linear-gradient(${angle}deg,${from} 10%,${to} 95%)`,WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'});
  return el;
}
// words of one line appear one by one (blur to sharp), `gap` seconds apart from `start`
export function wordSpans(kit,value,style,{accent}={}) {
  const out=[];const parts=value.split(/(\s+)/);
  const el=kit.h('div',{style});
  for(const p of parts){if(!p.trim()){el.append(document.createTextNode(p));continue;}
    const isAcc=accent&&accent.split(/\s+/).includes(p.replace(/[.,!?;:]$/,''));
    const s=kit.h('span',{text:p,style:{display:'inline-block',...(isAcc?{fontFamily:fonts.serif,fontStyle:'italic',fontWeight:'700',fontSize:'1.16em'}:{})}});el.append(s);out.push(s);}
  return {el,spans:out};
}
export function revealWords(spans,t,start,gap=0.07,dur=0.26) {
  spans.forEach((s,i)=>{const p=progress(t,start+i*gap,dur);s.style.opacity=String(clamp(p*1.3));s.style.filter=p<0.98?`blur(${(1-p)*8}px)`:'none';s.style.transform=`translateY(${(1-p)*12}px)`;});
}
