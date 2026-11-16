import {W,H,fonts,type,geo,motion,sound,palettes,material,ribbonForms} from './tokens.js';
import {box,clamp,atWord,progress,inOutSine} from './common.js';
import {makeRibbon} from './ribbon.js';
import {makePresenter} from './presenter.js';
import {makeAtmosphere} from './atmosphere.js';
import {makeCamera,shakeAt,transitionAt} from './camera.js';
import {byType} from './elements/index.js';

// Persistent instances keep their entry time and append beats across matching keys.
export function collectInstances(scenes,words) {
  const all=[],open=new Map();
  for(const sc of scenes) {
    const active=new Set();
    for(const [slot,spec] of Object.entries(sc.option.slots||{})) {
      active.add(slot);let it=open.get(slot);
      const staticSpec=p=>JSON.stringify(Object.fromEntries(Object.entries(p).filter(([k])=>!['beats','key'].includes(k))));
      const same=it&&spec.key!==undefined&&it.spec.key===spec.key&&it.mode===sc.option.layout&&it.spec.type===spec.type&&it.tOut===sc.start&&staticSpec(it.spec)===staticSpec(spec);
      if(!same){it={slot,spec,mode:sc.option.layout,tIn:sc.start,tOut:sc.end,beats:[],sceneIds:[]};all.push(it);open.set(slot,it);}
      it.tOut=sc.end;it.sceneIds.push(sc.id);
      for(const b of spec.beats||[])it.beats.push({...b,t:typeof b.at==='number'?words[b.at]?.start:typeof b.at?.t==='number'?b.at.t:sc.start+(b.at?.rel||0)});
      it.beats.sort((a,b)=>a.t-b.t);
    }
    for(const slot of open.keys())if(!active.has(slot))open.delete(slot);
  }
  return all;
}
const RIBBON_MODES=['depth','clean','studio','split'];
export async function buildComposition(doc,env,root) {
  const {kit}=env,C=palettes[doc.look.theme]||palettes.orange;
  const intensity=motion.intensity[doc.look.motion]??1;
  root.style.background=C.ground;
  const content=box(kit,'rd-content',{inset:'0',transformOrigin:'50% 45%',overflow:'hidden'});root.append(content);
  const camera=makeCamera(root);
  const ground=box(kit,'rd-ground',{inset:'0',background:`radial-gradient(ellipse at 55% 40%,${C.deep} 0%,${C.ground} 76%)`});
  const atmos=makeAtmosphere(kit,C);
  const presenter=makePresenter(doc,env,C),ribbon=makeRibbon(kit,C);
  const back=box(kit,'rd-back',{inset:'0'}),over=box(kit,'rd-over',{inset:'0'});
  const scrim=box(kit,'rd-scrim',{inset:'0',pointerEvents:'none',background:`linear-gradient(transparent 52%,${C.ground}55 64%,${C.ground}e0 88%,${C.ground} 100%)`});
  const layers=[ground,atmos.world,presenter.room,ribbon.el,atmos.presenter,back,presenter.person,scrim,over];
  content.append(...layers);const Z=[0,1,3,4,5,6,7,8,9];layers.forEach((el,i)=>{el.style.zIndex=String(Z[i]);});
  // supporting captions: words land one by one (blur to sharp) inside short groups
  const caption=box(kit,'rd-caption',{left:`${geo.safe.x}px`,top:`${geo.captionY}px`,width:`${geo.safe.w}px`,textAlign:'center',fontFamily:fonts.sans,fontSize:`${type.caption}px`,lineHeight:'1.22',color:C.text,textShadow:C.light?'none':'0 2px 18px #000000c0',letterSpacing:'-0.01em'});over.append(caption);
  const S={doc,env,kit,C,intensity};
  const instances=collectInstances(doc.scenes,doc.words);
  await Promise.all(instances.map(async it=>{const def=byType[it.spec.type];it.data=def.prepare?await def.prepare(it.spec,S):null;}));
  const audio=[],shakes=[];
  const sceneOf=t=>doc.scenes.find(s=>t>=s.start&&t<s.end);
  for(const it of instances) {
    const ctx={...S,...it},def=byType[it.spec.type];it.view=def.build(ctx);
    it.wrap=box(kit,'rd-inst',{inset:'0',pointerEvents:'none'});it.wrap.append(it.view.el);
    (['back','back-title','stage','panel'].includes(it.slot)?back:it.slot==='fx'?back:over).append(it.wrap);
    const lastScene=doc.scenes.find(s=>s.id===it.sceneIds.at(-1)),nextScene=doc.scenes[doc.scenes.indexOf(lastScene)+1];
    it.exits=!!nextScene&&nextScene.option.layout===it.mode;
    const type=it.spec.type;
    if(['glass-card','glass-stack','media-fan','filmstrip','glass-compare','chart','quote','orbit','chat'].includes(type))audio.push({t:it.tIn,sfx:'glass',gainDb:sound.glass.gainDb});
    if(it.view.landAt!==undefined&&type!=='ribbon'){audio.push({t:it.view.landAt,sfx:'tap',gainDb:sound.tap.gainDb});shakes.push({t:it.view.landAt+0.03,dir:type==='stat'||type==='big-word'?'y':'x',amp:type==='stat'||type==='big-word'?0.6:0.4,sign:1});}
    for(const m of it.spec.messages||[])if(m.at!==undefined)audio.push({t:doc.words[m.at].start,sfx:'tap',gainDb:sound.tap.gainDb-3});
    for(const beat of it.beats)if(beat.do==='click'||beat.do==='focus')audio.push({t:beat.t,sfx:'tap',gainDb:sound.tap.gainDb});
    for(const item of it.spec.cards||[])if(item.at!==undefined)audio.push({t:doc.words[item.at].start,sfx:'glass',gainDb:sound.glass.gainDb});
    // camera shakes on the elements that land (D12): hero words, abstract cards, the click
    if(type==='phrase'&&it.view.heroStart!==undefined)shakes.push({t:it.view.heroStart+0.02,dir:'y',amp:0.55,sign:1});
    if(type==='glass-card'&&it.slot==='back')shakes.push({t:it.tIn+0.10,dir:'x',amp:0.30,sign:-1});
    (it.spec.cards||[]).forEach((c,i)=>{if(i)shakes.push({t:atWord(ctx,c.at,it.tIn+0.36+i*0.9)+0.08,dir:'x',amp:0.5,sign:i%2?1:-1});});
    if(type==='glass-compare'&&it.spec.rightAt!==undefined)shakes.push({t:atWord(ctx,it.spec.rightAt)+0.05,dir:'x',amp:0.45,sign:1});
    if(type==='action-button'&&it.view.click!==undefined)shakes.push({t:it.view.click,dir:'y',amp:0.8,hard:true});
  }
  for(let i=1;i<doc.scenes.length;i++)if(doc.scenes[i].option.layout!==doc.scenes[i-1].option.layout)audio.push({t:Math.max(0,doc.scenes[i].start-motion.out),sfx:'air',gainDb:sound.air.gainDb});
  const events=audio.filter(e=>Number.isFinite(e.t)&&e.t>=0&&e.t<doc.duration).sort((a,b)=>a.t-b.t).filter((e,i,a)=>!i||e.t-a[i-1].t>=sound.minGap);
  const groups=kit.groupWords(doc.words.filter(w=>w.w),{maxWords:5,maxChars:30,breaks:doc.captions?.breaks,hide:doc.captions?.hide});
  const captionGroups=groups.map((g,gi)=>{
    const el=kit.h('div',{style:{position:'absolute',left:'0',top:'0',width:'100%'}});
    const words=g.words.map(w=>{const serif=w.emph?.includes('serif');const s=kit.h('span',{text:w.w,style:{display:'inline-block',marginRight:'0.26em',fontFamily:serif?fonts.serif:fonts.sans,fontStyle:serif?'italic':'normal',fontWeight:serif?'700':'400',fontSize:serif?'1.18em':'1em',color:w.emph?.includes('accent')?C.accent2:C.text}});el.append(s);return {el:s,t:w.start};});
    el.style.display='none';caption.append(el);return{...g,el,words,next:groups[gi+1]?.start??Infinity};
  });
  const phraseFrom=instances.filter(it=>it.spec.type==='phrase').map(it=>({tIn:it.tIn,tOut:it.tOut,from:Math.min(it.view.labelStart??Infinity,it.view.heroStart??Infinity)}));
  // ribbon runs: the ribbon reveals once per run of presenter scenes, then keeps flowing
  // D13 ribbon placement: only where the plan puts a `ribbon` effect, one reveal per contiguous run of one form,
  // un-drawn when the next scene keeps the speaker but drops the ribbon. Plans without any placement get it
  // in their first and last speaker runs only, never in every scene.
  const on=m=>RIBBON_MODES.includes(m);
  const runs=[];
  const placed=instances.filter(it=>it.spec.type==='ribbon').sort((a,b)=>a.tIn-b.tIn);
  for(const it of placed){const last=runs.at(-1);if(last&&Math.abs(last.tOut-it.tIn)<1e-6&&last.form===it.spec.form)last.tOut=it.tOut;else runs.push({form:it.spec.form,tIn:it.tIn,tOut:it.tOut,start:atWord({...S,...it},it.spec.at,it.tIn)});}
  if(!placed.length){const speaker=[];doc.scenes.forEach((sc,i)=>{if(!on(sc.option.layout)||sc.option.layout==='split')return;const prev=speaker.at(-1);if(prev&&prev.last===i-1){prev.tOut=sc.end;prev.last=i;}else speaker.push({tIn:sc.start,tOut:sc.end,last:i,start:sc.start,form:'spiral'});});
    for(const r of new Set([speaker[0],speaker.at(-1)]))if(r)runs.push(r);}
  for(const r of runs){const after=doc.scenes.find(sc=>Math.abs(sc.start-r.tOut)<1e-6),before=doc.scenes.find(sc=>Math.abs(sc.end-r.tOut)<1e-6);r.retract=!!after&&!!before&&after.option.layout===before.option.layout;}
  const sameRun=i=>{let a=i,b=i;const m=doc.scenes[i].option.layout;while(a>0&&doc.scenes[a-1].option.layout===m)a--;while(b<doc.scenes.length-1&&doc.scenes[b+1].option.layout===m)b++;return [doc.scenes[a].start,doc.scenes[b].end];};
  const sceneAt=t=>sceneOf(t)||(t<doc.scenes[0].start?doc.scenes[0]:doc.scenes.at(-1));
  return{
    audio:events,
    seek(t) {
      const sc=sceneAt(t),idx=doc.scenes.indexOf(sc),mode=sc.option.layout;
      // camera: run push-in, layout transition, shakes
      const [r0,r1]=sameRun(idx);
      const push=1+motion.push*intensity*inOutSine(clamp((t-r0)/Math.max(1,r1-r0)));
      const tr=transitionAt(t,sc,doc.scenes[idx-1],doc.scenes[idx+1],intensity);
      const sh=shakeAt(t,shakes,intensity);
      camera.apply(content,{tx:sh.x,ty:tr.ty+sh.y,scale:push*tr.scale,bx:tr.bx+sh.bx,by:tr.by+sh.by,split:tr.split+sh.split,bright:tr.bright});
      presenter.seek(mode,{cam:{x:sh.x,y:sh.y}});
      atmos.seek(t,{mode,intensity,cam:{x:sh.x,y:sh.y}});
      const run=runs.find(r=>t>=r.tIn&&t<r.tOut);
      const enabled=!!run&&doc.look.ribbon!=='off'&&on(mode)&&(mode==='split'||env.footage.hasMatte);
      const strength=(doc.look.ribbon==='subtle'?0.45:1)*(mode==='clean'?0.75:1);
      ribbon.el.style.zIndex=mode==='split'?'2':'4';
      ribbon.seek(t,{start:run?.start??0,strength,intensity,enabled,retract:run?.retract?(run.tOut-t)/0.45:1,
        params:{...(ribbonForms[run?.form]||{}),...(mode==='studio'?{radius:420,top:1080,length:700,turns:1.1,bandWidth:110,cy:1250}:{})}});
      scrim.style.opacity=mode==='abstract'||mode==='portrait-search'?'0':C.light?'0.4':'1';
      for(const it of instances){
        const active=t>=it.tIn&&t<it.tOut;it.wrap.style.display=active?'':'none';if(!active)continue;
        it.view.seek(t);
        const e=it.exits?clamp((t-(it.tOut-0.24))/0.24):0;
        it.wrap.style.opacity=String(1-e);it.wrap.style.filter=e>0?`blur(${e*14}px)`:'none';it.wrap.style.transform=e>0?`translateY(${-e*30}px) scale(${1+e*0.03})`:'none';
      }
      const phrase=phraseFrom.some(p=>t>=p.tIn&&t<p.tOut&&t>=p.from);
      caption.style.display=doc.look.captions==='off'||phrase||mode==='portrait-search'?'none':'';
      for(const g of captionGroups){
        const on=t>=g.start-0.04&&t<Math.min(g.end+0.35,g.next-0.02);g.el.style.display=on?'':'none';if(!on)continue;
        const out=clamp((t-(Math.min(g.end+0.35,g.next-0.02)-0.12))/0.12);
        for(const w of g.words){const p=progress(t,w.t-0.03,motion.word);w.el.style.opacity=String(clamp(p*1.4)*(1-out));w.el.style.filter=p<0.98?`blur(${(1-p)*9}px)`:'none';w.el.style.transform=`translateY(${(1-p)*14}px)`;}
      }
    },
    posterTime(id){const sc=doc.scenes.find(s=>s.id===id);if(!sc)return null;const anchors=instances.filter(it=>it.sceneIds.includes(id)).flatMap(it=>[...it.beats.map(b=>b.t),...(it.spec.cards||it.spec.rows||it.spec.items||it.spec.steps||[]).filter(x=>x.at!==undefined).map(x=>doc.words[x.at].start),...(it.view.heroStart?[it.view.heroStart]:[]),...(it.view.landAt?[it.view.landAt]:[]),...(it.spec.messages||it.spec.points||[]).filter(x=>x.at!==undefined).map(x=>doc.words[x.at].start)]);const target=Math.max(sc.start+1.0,...anchors.map(t=>t+0.45));return Math.min(sc.end-0.30,Math.max(sc.start,target));},
  };
}
