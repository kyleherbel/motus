#!/usr/bin/env node
// Style-specific temporal/semantic constraints beyond the engine schema.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadProject} from '../../../engine/lib/project.mjs';
import {loadPlan,validateEdit,sceneTimes} from '../../../engine/lib/plan.mjs';

export function audit(edit,words,timeline,manifest) {
  const issues=[],times=sceneTimes(edit.scenes,words,timeline,manifest.timing?.sceneLead??0);
  const add=(severity,where,message)=>issues.push({severity,path:where,message});
  edit.scenes.forEach((sc,i)=>{
    const span=times[i].end-times[i].start;
    for(const op of sc.options)for(const [slot,spec] of Object.entries(op.slots||{})) {
      const where=`${sc.id}/${op.id}/${slot}`;
      // Earlier anchors are valid only when this exact keyed element is carried in.
      let first=i,last=i;
      const staticSpec=p=>JSON.stringify(Object.fromEntries(Object.entries(p).filter(([k])=>!['beats','key'].includes(k))));
      const shares=j=>spec.key!==undefined&&edit.scenes[j].options.some(o=>o.layout===op.layout&&o.slots?.[slot]?.key===spec.key&&staticSpec(o.slots[slot])===staticSpec(spec));
      while(first>0&&shares(first-1))first--;while(last+1<edit.scenes.length&&shares(last+1))last++;
      const lo=edit.scenes[first].words[0],hi=edit.scenes[last].words[1];
      const check=(value,label)=>{if(value!==undefined&&(!Number.isInteger(value)||value<lo||value>hi))add('error',`${where}/${label}`,`Word anchor must be inside this element's scene range ${lo}–${hi}.`);};
      check(spec.at,'at');check(spec.doneAt,'doneAt');check(spec.rightAt,'rightAt');
      for(const field of ['rows','cards','items'])for(const [j,item] of (spec[field]||[]).entries())check(item.at,`${field}/${j}/at`);
      if(spec.type==='phrase'&&spec.accent&&!spec.text.includes(spec.accent))add('error',where,'accent must be an exact substring of text.');
      if(spec.type==='glass-card'&&spec.accent&&!spec.title.includes(spec.accent))add('error',where,'accent must be an exact substring of title.');
      if(spec.type==='search-query'&&spec.doneAt!==undefined&&words[spec.doneAt]?.start<=(spec.at===undefined?times[i].start:words[spec.at]?.start))add('error',where,'doneAt must follow the typing start.');
      if(spec.type==='glass-card')for(const beat of spec.beats||[])if(beat.do==='focus'&&beat.index>=(spec.rows||[]).length)add('error',where,'focus index has no matching row.');
      if(spec.type==='phrase'&&span>6)add('warning',where,'This phrase replaces captions for more than 6 seconds; check that the whole thought is represented.');
      if(op.slots.front&&op.slots['back-title'])add('warning',where,'Two phrase layers share the same space; use one hero phrase.');
      if(['cards','rows','items'].some(k=>(spec[k]||[]).some(x=>x.at===undefined)))add('warning',where,'Some item arrivals use defaults. Anchor important changes to the spoken words.');
    }
    if(span<0.6)add('warning',sc.id,'Very short scene: the default entry may not settle. Use a clean connective scene or merge it.');
  });
  // D13 variety: judged on the recommended picks, the way the reel will actually play
  const picks=edit.scenes.map(sc=>sc.options.find(o=>o.id===sc.pick)||sc.options[0]);
  const speaker=picks.filter(o=>['depth','clean','studio','split'].includes(o.layout));
  const ribbons=picks.map(o=>o.slots?.fx?.type==='ribbon'?o.slots.fx.form:null);
  const placed=ribbons.filter(Boolean).length;
  if(speaker.length>=3&&placed>Math.ceil(speaker.length*0.4))add('warning','variety',`The ribbon is placed in ${placed} of ${speaker.length} speaker scenes. Keep it to the hook and one or two later moments (at most 40%) so it stays a signature, not wallpaper.`);
  const forms=ribbons.filter(Boolean);if(forms.length>=3&&new Set(forms).size===1)add('warning','variety',`Every ribbon uses the "${forms[0]}" form. Vary it (spiral, sweep, halo, arc).`);
  const main=o=>Object.entries(o.slots||{}).filter(([k,v])=>!['front','fx','detail'].includes(k)).map(([k,v])=>v.type)[0]||null;
  for(let i=1;i<picks.length;i++){const a=main(picks[i-1]),b=main(picks[i]);if(a&&a===b&&picks[i-1].slots[Object.keys(picks[i-1].slots).find(k=>!['front','fx','detail'].includes(k))].key===undefined)add('warning',edit.scenes[i].id,`Same device ("${b}") as the scene before. Use a different explanation or carry it with a key.`);}
  for(let i=2;i<picks.length;i++)if(picks[i].layout===picks[i-1].layout&&picks[i].layout===picks[i-2].layout&&picks[i].layout!=='abstract')add('warning',edit.scenes[i].id,`Third "${picks[i].layout}" scene in a row. Change the composition (depth, split, clean, abstract).`);
  const counts={};for(const o of picks){const m=main(o);if(m)counts[m]=(counts[m]||0)+1;}
  for(const [type,n] of Object.entries(counts))if(n>Math.max(2,Math.ceil(picks.length/4)))add('warning','variety',`"${type}" carries ${n} of ${picks.length} scenes. Spread the explanation across more devices.`);
  return issues;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    if(!process.argv[2])throw new Error('Usage: node styles/ribbon-depth/dev/audit-plan.mjs <project>');
    const project=await loadProject(process.argv[2]),plan=await loadPlan(project);
    if(plan.edit.style!=='ribbon-depth')throw new Error('This audit is for ribbon-depth projects.');
    const v=validateEdit(plan.edit,{words:plan.words,timeline:plan.timeline,manifest:plan.style.manifest,projectDir:project.dir});
    const issues=v.errors.length?v.errors.map(e=>({severity:'error',...e})):audit(plan.edit,plan.words,plan.timeline,plan.style.manifest);
    console.log(JSON.stringify({ok:!issues.some(i=>i.severity==='error'),issues},null,2));
    if(issues.some(i=>i.severity==='error'))process.exitCode=1;
  }catch(e){console.error(e.message);process.exitCode=1;}
}
