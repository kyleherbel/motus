import { geo,type } from '../tokens.js';
import { box,glass,text,reveal,atWord,clamp,progress } from '../common.js';
// Two stated alternatives on tilted glass; the focused side lifts and glows, the other recedes.
export default {
  type:'glass-compare',label:'Two contrasting outcomes',slots:['stage'],
  params:{left:{type:'string',maxChars:26},right:{type:'string',maxChars:26},leftLabel:{type:'string',maxChars:16,optional:true},rightLabel:{type:'string',maxChars:16,optional:true},at:'word?',rightAt:'word?'},beats:{focus:{side:'enum:left|right'}},
  build(ctx) {
    const {kit,C,spec}=ctx,el=box(kit,'rd-compare',{inset:'0'}),r=geo.compare;
    const items=['left','right'].map((side,i)=>{const cr={x:r.x+i*(r.w+r.gap),y:r.y+i*70,w:r.w,h:r.h};
      const wrap=box(kit,'rd-cmpwrap',{left:`${cr.x}px`,top:`${cr.y}px`,width:`${cr.w}px`,height:`${cr.h}px`,perspective:'1000px'});
      const c=glass(kit,C,{x:0,y:0,w:cr.w,h:cr.h},{padding:'40px',transform:`rotateY(${i?-10:10}deg) rotateZ(${i?3:-3}deg)`});
      if(spec[side+'Label'])c.append(text(kit,spec[side+'Label'],{fontSize:`${type.small}px`,color:C.ink+'99',marginBottom:'26px',letterSpacing:'0.02em'}));
      c.append(text(kit,spec[side],{fontSize:`${type.title+4}px`,lineHeight:'1.12',overflowWrap:'anywhere',letterSpacing:'-0.01em'}));
      const bar=box(kit,'rd-cmpbar',{left:'40px',bottom:'40px',width:'60%',height:'10px',borderRadius:'6px',background:i?`linear-gradient(90deg,${C.accent},${C.accent2})`:`${C.ink}22`});c.append(bar);
      wrap.append(c);el.append(wrap);return {wrap,c};});
    return{el,seek(t){const start=atWord(ctx,spec.at,ctx.tIn);const focus=ctx.beats.filter(b=>b.do==='focus'&&b.t<=t).at(-1);
      items.forEach((e,i)=>{const s=i?atWord(ctx,spec.rightAt,start+0.18):start;const p=reveal(e.wrap,t,s,{dur:0.5,blur:16,rise:50,scale:0.9,intensity:ctx.intensity});e.wrap.style.transform+=` translateX(${(1-p)*(i?160:-160)}px)`;
        const k=focus?progress(t,focus.t,0.4):0,mine=focus&&focus.side===['left','right'][i];
        e.c.style.filter=focus&&!mine?`brightness(${1-0.4*k}) blur(${2*k}px)`:'none';e.wrap.style.zIndex=mine?'2':'1';
        e.c.style.boxShadow=mine?`inset 0 2px 2px #fff,0 22px 60px #00000066,0 0 ${80*k}px ${C.glow}90`:'';});}};
  },
};
