// Original, deterministic synthesis; no samples or reference audio.
import fs from 'node:fs/promises';
import {writeWav} from '../../../engine/lib/audio.mjs';
const dir=new URL('../assets/sfx/',import.meta.url);await fs.mkdir(dir,{recursive:true});
const rate=48000;
for(const [name,duration] of [['air',0.38],['glass',0.22],['tap',0.07]]) {
  const count=Math.round(duration*rate),samples=new Float32Array(count*2);let seed=6271,filtered=0;
  for(let i=0;i<count;i++){
    const t=i/rate,q=i/count;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1;
    filtered=filtered*0.92+noise*0.08;
    const value=name==='air'?filtered*Math.pow(Math.sin(Math.PI*q),2)*0.65:name==='glass'?(Math.sin(2*Math.PI*1220*t)+0.32*Math.sin(2*Math.PI*1890*t))*Math.exp(-t*23)*Math.min(1,t/0.006)*0.10:(Math.sin(2*Math.PI*290*t)+noise*0.12)*Math.exp(-t*75)*Math.min(1,t/0.002)*0.18;
    samples[i*2]=value;samples[i*2+1]=value;
  }
  await writeWav(new URL(`${name}.wav`,dir).pathname,samples);
}
console.log('Wrote 3 original sound effects');
