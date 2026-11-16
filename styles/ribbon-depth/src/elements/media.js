import { geo,type } from '../tokens.js';
import { box,glass,text,animate,atWord } from '../common.js';
const params={items:{type:'array',min:1,max:3,of:{src:'asset',label:{type:'string',maxChars:20,optional:true},at:'word?'}}};
async function prepare(spec,S) {
  return await Promise.all(spec.items.map(item=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error(`Ribbon Depth: image could not load: ${item.src}`));img.src=S.env.projectUrl(item.src);})));
}
function build(ctx,film) {
  const {kit,C,spec}=ctx,el=box(kit,film?'rd-film':'rd-fan',{inset:'0'}),r=geo.photos,n=spec.items.length;
  if(film){
    const f=geo.film,strip=box(kit,'rd-film-housing',{left:`${f.x}px`,top:`${f.y}px`,width:`${f.w}px`,height:`${f.h}px`,background:'#19191d',borderRadius:'16px',boxShadow:'0 18px 34px #00000025',overflow:'hidden'});el.append(strip);
    const width=(f.w-f.pad*2-(n-1)*f.gap)/n;
    const images=spec.items.map((item,i)=>{const img=ctx.data[i];const left=f.pad+i*(width+f.gap);Object.assign(img.style,{position:'absolute',left:`${left}px`,top:`${f.pad}px`,width:`${width}px`,height:`${f.h-f.pad*2}px`,objectFit:'cover'});strip.append(img);let label=null;if(item.label){label=text(kit,item.label,{position:'absolute',left:`${left+12}px`,bottom:`${f.pad+12}px`,maxWidth:`${width-24}px`,fontSize:`${type.small}px`,color:'#fff',textShadow:'0 2px 8px #000'});strip.append(label);}return{el:img,label,start:atWord(ctx,item.at,ctx.tIn)};});
    for(const y of ['7px',`${f.h-18}px`])strip.append(box(kit,'rd-perfs',{left:'8px',right:'8px',top:y,height:'10px',background:'repeating-linear-gradient(to right,#d1d1d1 0 10px,transparent 10px 21px)'}));
    return{el,seek(t){animate(strip,t,ctx.tIn,ctx,{tilt:-3});images.forEach(c=>{c.el.style.opacity=t>=c.start?'1':'0';if(c.label)c.label.style.opacity=c.el.style.opacity;});}};
  }
  const w=(r.w-(n-1)*r.gap)/n;
  const items=spec.items.map((item,i)=>{
    const c=glass(kit,C,{x:r.x+i*(w+r.gap),y:r.y+(film?90:Math.abs(i-(n-1)/2)*28),w,h:r.h},{borderRadius:`${film?12:geo.photos.radius}px`,background:film?'#19191d':C.glass,padding:film?'26px 6px':'0'});
    const img=ctx.data[i];Object.assign(img.style,{width:'100%',height:'100%',objectFit:'cover'});c.append(img);
    if(item.label)c.append(text(kit,item.label,{position:'absolute',left:'14px',right:'14px',bottom:'22px',fontSize:`${type.small}px`,color:'#fff',textShadow:'0 2px 8px #000'}));
    if(film)for(const y of ['7px',`${r.h-18}px`])c.append(box(kit,'rd-perfs',{left:'8px',right:'8px',top:y,height:'10px',background:'repeating-linear-gradient(to right,#d1d1d1 0 10px,transparent 10px 21px)'}));
    el.append(c);return{el:c,start:atWord(ctx,item.at,ctx.tIn+i*0.16),tilt:film?-3:(i-(n-1)/2)*5};
  });
  return{el,seek(t){items.forEach(c=>animate(c.el,t,c.start,ctx,{tilt:c.tilt}));}};
}
export const mediaFan={type:'media-fan',label:'Photo triptych',slots:['back','stage'],params,beats:{},prepare,build:ctx=>build(ctx,false)};
export const filmstrip={type:'filmstrip',label:'Filmstrip',slots:['back','stage'],params,beats:{},prepare,build:ctx=>build(ctx,true)};
