import { type,motion,fonts } from '../tokens.js';
import { box,glass,text,reveal,atWord,progress,clamp,regionFor,wordSpans,revealWords } from '../common.js';
// D13 quote: a rule, a principle, a line someone said, a promise. The slab lands, then the words follow the speech.
export default {
  type:'quote',label:'Statement slab',slots:['stage','panel'],
  params:{text:{type:'string',maxChars:90},accent:{type:'string',maxChars:24,optional:true},by:{type:'string',maxChars:28,optional:true},at:'word?',doneAt:'word?'},
  beats:{},
  build(ctx) {
    const {kit,C,spec}=ctx,R=regionFor(ctx),panel=ctx.slot==='panel';
    const fs=kit.fitSize(spec.text,(R.w-140)*(panel?2.2:3.1),s=>`400 ${s}px ${fonts.sans}`,panel?48:60,30);
    const lines=kit.wrap(spec.text.split(/\s+/),R.w-140,`400 ${fs}px ${fonts.sans}`).length;
    const h=Math.min(R.h,lines*fs*1.22+(spec.by?190:140));
    const card=glass(kit,C,{x:R.x,y:R.y+(R.h-h)/2,w:R.w,h},{transformOrigin:'50% 60%'});
    const mark=text(kit,'“',{position:'absolute',left:'40px',top:'-18px',fontFamily:fonts.serif,fontStyle:'italic',fontWeight:'700',fontSize:'190px',color:C.accent,lineHeight:'1',opacity:'0.9'});card.append(mark);
    const words=wordSpans(kit,spec.text,{position:'absolute',left:'70px',right:'70px',top:'80px',fontSize:`${fs}px`,lineHeight:'1.22',color:C.ink,letterSpacing:'-0.01em'},{accent:spec.accent});card.append(words.el);
    let by=null;if(spec.by){by=text(kit,'— '+spec.by,{position:'absolute',left:'70px',bottom:'44px',fontSize:'28px',color:C.ink+'99'});card.append(by);}
    const start=atWord(ctx,spec.at,ctx.tIn+0.35),end=atWord(ctx,spec.doneAt,start+Math.min(2.4,words.spans.length*0.16)),gap=Math.max(0.03,(end-start)/Math.max(1,words.spans.length));
    return {el:card,seek(t){
      reveal(card,t,start-0.3,{dur:0.5,blur:16,rise:40,scale:0.93,intensity:ctx.intensity});
      revealWords(words.spans,t,start,gap);
      if(by){const q=progress(t,end,0.35);by.style.opacity=String(q);}
    }};
  },
};
