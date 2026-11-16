import { type,motion,fonts } from '../tokens.js';
import { box,text,icon,atWord,progress,clamp,regionFor,outBack,ICONS } from '../common.js';
// D13 notify: results, alerts, sales, sign-ups, reminders. Toasts drop in from the top on their words and
// push older ones down. Text from the speech only.
export default {
  type:'notify',label:'Notification stack',slots:['back','stage','panel'],
  params:{app:{type:'string',maxChars:16,optional:true},items:{type:'array',min:1,max:4,of:{title:{type:'string',maxChars:24},text:{type:'string',maxChars:42,optional:true},icon:`enum?:${ICONS.join('|')}`,at:'word?'}}},
  beats:{},
  build(ctx) {
    const {kit,C,spec}=ctx,R=regionFor(ctx),back=ctx.slot==='back';
    const el=box(kit,'rd-notify',{left:`${R.x}px`,top:`${R.y}px`,width:`${R.w}px`,height:`${R.h}px`});
    const th=back?118:150,gap=18;
    const toasts=spec.items.map((it,i)=>{
      const t=box(kit,'rd-toast',{left:'0',top:'0',width:`${R.w}px`,height:`${th}px`,borderRadius:'36px',display:'flex',alignItems:'center',gap:'22px',padding:'0 28px',
        background:'linear-gradient(160deg,#fffffff2,#f3ede8e8)',boxShadow:'0 16px 40px #0007,inset 0 1px 1px #fff',color:C.ink});
      const tile=box(kit,'rd-apptile',{position:'relative',width:`${th-46}px`,height:`${th-46}px`,flex:`0 0 ${th-46}px`,borderRadius:'20px',display:'grid',placeItems:'center',background:`linear-gradient(135deg,${C.accent2},${C.accent})`,boxShadow:`0 6px 16px ${C.glow}66`});
      tile.append(icon(kit,it.icon||'bolt',C,(th-46)*0.56,'#fff',2.6));
      const body=box(kit,'rd-toastbody',{position:'relative',flex:'1',minWidth:'0'});
      const row=box(kit,'rd-toastrow',{position:'relative',display:'flex',justifyContent:'space-between',alignItems:'baseline'});
      row.append(text(kit,it.title,{fontSize:`${back?30:38}px`,fontWeight:'600',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}),text(kit,spec.app?`${spec.app} · now`:'now',{fontSize:'22px',color:C.ink+'80',whiteSpace:'nowrap',marginLeft:'12px'}));
      body.append(row);if(it.text)body.append(text(kit,it.text,{fontSize:`${back?24:30}px`,color:C.ink+'b0',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginTop:'4px'}));
      t.append(tile,body);el.append(t);return {t,start:atWord(ctx,it.at,ctx.tIn+0.3+i*0.9)};
    });
    return {el,landAt:toasts[0].start,seek(t){
      // newest on top: each toast sits below every toast that arrived after it
      toasts.forEach((T,i)=>{const p=progress(t,T.start,0.5,x=>outBack(x,1.2));
        let y=0;for(let j=i+1;j<toasts.length;j++)y+=(th+gap)*progress(t,toasts[j].start,0.45);
        const depth=toasts.slice(i+1).filter(x=>t>=x.start).length;
        T.t.style.opacity=String(clamp(p*1.4)*(depth>2?0:1-depth*0.12));T.t.style.transform=`translateY(${y+(1-p)*-90}px) scale(${(0.9+0.1*p)*(1-depth*0.03)})`;T.t.style.filter=p<0.98?`blur(${(1-clamp(p))*10}px)`:'none';T.t.style.zIndex=String(10+i);});
    }};
  },
};
