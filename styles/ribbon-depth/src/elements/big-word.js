import { type,motion,fonts } from '../tokens.js';
import { box,text,atWord,progress,clamp,gradientText } from '../common.js';
// D13 big word: one huge word behind the head (text behind the speaker). Emphasis without a card or ribbon.
export default {
  type:'big-word',label:'Giant word behind the head',slots:['back'],
  params:{text:{type:'string',maxChars:14},italic:'boolean?',at:'word?'},
  beats:{},
  build(ctx) {
    const {kit,C,spec}=ctx,it=spec.italic!==false;
    const font=s=>`${it?'italic 700':'700'} ${s}px ${it?fonts.serif:fonts.sans}`;
    const size=kit.fitSize(spec.text,1000,font,360,120);
    const el=box(kit,'rd-bigword',{left:'0',top:`${520-size*0.72}px`,width:'1080px',textAlign:'center',transformOrigin:'50% 60%'});
    const w=gradientText(text(kit,spec.text,{display:'inline-block',fontFamily:it?fonts.serif:fonts.sans,fontStyle:it?'italic':'normal',fontWeight:'700',fontSize:`${size}px`,lineHeight:'1.15',letterSpacing:it?'-0.02em':'-0.04em',whiteSpace:'nowrap',filter:`drop-shadow(0 0 40px ${C.glow}88)`}),C,{from:'#ffffff',to:C.accent});
    el.append(w);
    const start=atWord(ctx,spec.at,ctx.tIn+0.15);
    return {el,landAt:start,seek(t){
      const p=progress(t,start,0.6);const slow=clamp((t-start)/6);
      el.style.opacity=String(clamp(p*1.3)*0.96);el.style.filter=p<0.98?`blur(${(1-p)*24}px)`:'none';
      el.style.transform=`scale(${1.18-0.18*p+0.04*slow}) translateY(${(1-p)*30}px)`;el.style.letterSpacing=`${(1-p)*0.08}em`;
    }};
  },
};
