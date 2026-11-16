import { motion } from './tokens.js';
import { clamp } from './common.js';

// D12. A shake is a motion-blur impulse: sharpness collapses within one or two frames, then the frame
// settles over ~0.35–0.45 s with a damped wobble of a few pixels. Hard hits add a larger jump and a
// colour split. One SVG filter does directional blur plus RGB split for both shakes and transitions.
export function makeCamera(root) {
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.style.cssText='position:absolute;width:0;height:0';
  const f=document.createElementNS(ns,'filter');f.id='rd-cam';for(const [k,v] of [['x','-10%'],['y','-10%'],['width','120%'],['height','120%'],['color-interpolation-filters','sRGB']])f.setAttribute(k,v);
  const node=(tag,attrs)=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);f.append(n);return n;};
  const blur=node('feGaussianBlur',{in:'SourceGraphic',stdDeviation:'0 0',result:'b'});
  node('feColorMatrix',{in:'b',type:'matrix',values:'1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0',result:'r'});
  const offR=node('feOffset',{in:'r',dx:'0',dy:'0',result:'ro'});
  node('feColorMatrix',{in:'b',type:'matrix',values:'0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0',result:'g'});
  node('feColorMatrix',{in:'b',type:'matrix',values:'0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0',result:'bl'});
  const offB=node('feOffset',{in:'bl',dx:'0',dy:'0',result:'bo'});
  node('feBlend',{in:'ro',in2:'g',mode:'screen',result:'rg'});
  node('feBlend',{in:'rg',in2:'bo',mode:'screen'});
  svg.append(f);root.append(svg);
  return {
    apply(el,{tx=0,ty=0,scale=1,bx=0,by=0,split=0,bright=1}) {
      el.style.transform=`translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${scale.toFixed(4)})`;
      const on=bx>0.15||by>0.15||Math.abs(split)>0.2;
      blur.setAttribute('stdDeviation',`${bx.toFixed(2)} ${by.toFixed(2)}`);
      offR.setAttribute('dx',(-split).toFixed(2));offB.setAttribute('dx',split.toFixed(2));offR.setAttribute('dy',(split*0.35).toFixed(2));offB.setAttribute('dy',(-split*0.35).toFixed(2));
      el.style.filter=[on?'url(#rd-cam)':'',bright!==1?`brightness(${bright.toFixed(3)})`:''].filter(Boolean).join(' ')||'none';
    },
  };
}

// Sum of shake impulses at time t. events: {t, dir:'x'|'y', amp (0..), hard}
export function shakeAt(t,events,intensity=1) {
  const S=motion.shake;let x=0,y=0,bx=0,by=0,split=0;
  for(const e of events){
    const tau=t-e.t;if(tau<0||tau>0.7)continue;
    const k=e.amp*intensity*(e.hard?S.hard:1);
    const wob=Math.exp(-tau/S.decay)*Math.cos(Math.PI*2*S.hz*tau)*S.amp*k;
    const smear=Math.exp(-tau/S.blurDecay)*S.blur*k;
    const side=e.sign||1;
    if(e.dir==='x'){x+=wob*side;bx+=smear;}else{y+=wob*side;by+=smear;}
    if(e.hard)split+=Math.exp(-tau/0.08)*9*intensity;
  }
  return {x,y,bx,by,split};
}

// Layout change: outgoing zoom + defocus pulse, then an incoming vertical smear that resolves (M02).
export function transitionAt(t,sc,prev,next,intensity=1) {
  const changedIn=prev&&prev.option.layout!==sc.option.layout, changedOut=next&&next.option.layout!==sc.option.layout;
  const a=changedIn?1-clamp((t-sc.start)/motion.incoming):0;      // 1 at the cut -> 0
  const b=changedOut?clamp((t-(sc.end-motion.out))/motion.out):0; // 0 -> 1 at the cut
  const ai=a*a, bo=b*b;
  return {
    scale:1+bo*0.07*intensity+ai*0.05*intensity,
    ty:(ai*-60+bo*30)*intensity,
    bx:(bo*10+ai*2)*intensity, by:(bo*14+ai*motion.blur*3.2)*intensity,
    split:(ai*14+bo*4)*intensity,
    bright:1+bo*0.18+ai*0.10,
    sameLayoutSwap:!changedIn&&prev&&sc.start,
  };
}
