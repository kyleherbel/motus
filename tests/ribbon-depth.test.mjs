import {tmpDir} from './helpers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {validateEdit,sceneTimes} from '../engine/lib/plan.mjs';
import {collectInstances} from '../styles/ribbon-depth/src/compile.js';
import {audit} from '../styles/ribbon-depth/dev/audit-plan.mjs';
const style=new URL('../styles/ribbon-depth/',import.meta.url);
const read=p=>JSON.parse(fs.readFileSync(new URL(p,style),'utf8'));
const manifest=()=>read('style.json');
const load=name=>{const edit=read(`examples/${name}.edit.json`),words=read(`examples/${name}.words.json`).words,timeline={fps:[30,1],duration:read(`examples/${name}.words.json`).words.at(-1).end+0.4};return{edit,words,timeline};};

test('Ribbon Depth examples validate with actual asset paths and no hidden timing errors',()=>{
  const dir=tmpDir('motus-ribbon-');try{
    fs.mkdirSync(path.join(dir,'assets'));for(let i=1;i<=3;i++)fs.writeFileSync(path.join(dir,`assets/rd-sample-${i}.svg`),'<svg xmlns="http://www.w3.org/2000/svg"/>');
    for(const name of ['01-process','02-gallery','03-fitness','04-finance','05-cooking']){const x=load(name);const result=validateEdit(x.edit,{...x,manifest:manifest(),projectDir:dir});assert.deepEqual(result.errors,[]);assert.deepEqual(result.warnings,[]);assert.deepEqual(audit(x.edit,x.words,x.timeline,manifest()).filter(i=>i.severity==='error'),[]);}
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('Ribbon Depth carries keyed cards without restarting entry or dropping later beats',()=>{
  const words=[{start:0.1},{start:1.1},{start:2.1}],spec={type:'glass-card',key:'subject',title:'Subject',rows:[{text:'One'}]};
  const scenes=[{id:'a',start:0,end:1,option:{layout:'depth',slots:{back:{...spec,beats:[{at:0,do:'focus',index:0}]}}}},{id:'b',start:1,end:2,option:{layout:'depth',slots:{back:{...spec,beats:[{at:1,do:'focus',index:0}]}}}},{id:'c',start:2,end:3,option:{layout:'abstract',slots:{stage:{...spec}}}}];
  const before=JSON.stringify(scenes),items=collectInstances(scenes,words);assert.equal(items.length,2);assert.deepEqual(items[0].sceneIds,['a','b']);assert.equal(items[0].tIn,0);assert.equal(items[0].tOut,2);assert.deepEqual(items[0].beats.map(b=>b.t),[0.1,1.1]);assert.equal(JSON.stringify(scenes),before);
});

test('Ribbon Depth audit catches legal-schema anchors that would make a reveal invisible',()=>{
  const x=load('01-process');x.edit.scenes[0].options[0].slots.back.rows[0].at=25;
  x.edit.scenes[1].options[0].slots.detail.doneAt=x.edit.scenes[1].options[0].slots.detail.at;
  const issues=audit(x.edit,x.words,x.timeline,manifest());assert.ok(issues.some(i=>i.path.endsWith('rows/0/at')&&i.severity==='error'));assert.ok(issues.some(i=>i.message.includes('doneAt')));
});

test('Ribbon Depth supports fractional fps and different durations without a fixed scene recipe',()=>{
  const x=load('01-process');const short=sceneTimes(x.edit.scenes,x.words,{...x.timeline,fps:[30000,1001]},0);assert.equal(short.length,x.edit.scenes.length);assert.equal(short.at(-1).end,x.timeline.duration);
  const words=x.words.map(w=>({...w,start:w.start*3,end:w.end*3})),timeline={fps:[30000,1001],duration:x.timeline.duration*3};const v=validateEdit(x.edit,{words,timeline,manifest:manifest()});assert.deepEqual(v.errors,[]);assert.ok(timeline.duration>35);
});

test('Ribbon Depth audit flags a ribbon used as wallpaper and a device repeated back to back',()=>{
  const x=load('03-fitness');
  for(const sc of x.edit.scenes){const o=sc.options.find(o=>o.id===sc.pick);if(['depth','clean','split'].includes(o.layout))o.slots.fx={type:'ribbon',form:'spiral'};}
  const s04=x.edit.scenes[3].options.find(o=>o.id==='a');x.edit.scenes[2].options[0]={...x.edit.scenes[2].options[0],layout:'split',slots:{panel:{...s04.slots.panel}}};
  const issues=audit(x.edit,x.words,x.timeline,manifest()).map(i=>i.message).join('\n');
  assert.match(issues,/ribbon is placed in \d+ of \d+ speaker scenes/);
  assert.match(issues,/Every ribbon uses the "spiral" form/);
  assert.match(issues,/Same device \("chart"\)/);
});
