import { geo,type,motion,fonts } from '../tokens.js';
import { box,text,icon,atWord,progress,reveal,clamp } from '../common.js';
// D10: a white pill search bar; the query types on the words with a blinking caret.
export default {
  type:'search-query',label:'Typed search',slots:['detail','stage'],
  params:{query:{type:'string',maxChars:34},at:'word?',doneAt:'word?'},beats:{},
  build(ctx) {
    const {kit,C,spec}=ctx,r=ctx.slot==='stage'?{...geo.search,y:900}:geo.search;
    const el=box(kit,'rd-search',{left:`${r.x}px`,top:`${r.y}px`,width:`${r.w}px`,height:`${r.h}px`,borderRadius:'60px',display:'flex',alignItems:'center',gap:'18px',padding:'0 30px',
      background:'linear-gradient(180deg,#ffffff,#f3efea)',boxShadow:`inset 0 1px 1px #fff,0 10px 30px #00000055,0 0 40px ${C.glow}30`,color:C.ink});
    el.append(icon(kit,'search',C,34,C.ink+'aa',2.4));
    const size=kit.fitSize(spec.query+'|',r.w-120,s=>`400 ${s}px ${fonts.sans}`,type.pill,type.min);
    const tx=text(kit,'',{fontSize:`${size}px`,whiteSpace:'nowrap'}),caret=box(kit,'rd-caret',{position:'relative',width:'3px',height:`${size*1.1}px`,background:C.ink,marginLeft:'-14px',borderRadius:'2px'});
    el.append(tx,caret);
    const start=atWord(ctx,spec.at,ctx.tIn+motion.incoming),end=atWord(ctx,spec.doneAt,start+motion.typing),duration=Math.max(0.1,end-start);
    const chars=[...spec.query];
    return {el,seek(t){reveal(el,t,start-0.25,{dur:0.4,blur:10,rise:22,scale:0.94,intensity:ctx.intensity,drift:false});const q=clamp((t-start)/duration);tx.textContent=chars.slice(0,Math.floor(q*chars.length)).join('');caret.style.opacity=(t<end+0.6?(Math.floor(t*2.4)%2?'1':'0.15'):'0');}};
  },
};
