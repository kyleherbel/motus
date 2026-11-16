import fs from 'node:fs/promises';
import {elements,layouts} from './src/elements/index.js';
import {motion} from './src/tokens.js';
const head=JSON.parse(await fs.readFile(new URL('./style.head.json',import.meta.url),'utf8'));
const manifest={...head,timing:{sceneLead:motion.sceneLead},layouts:Object.fromEntries(Object.entries(layouts).map(([id,l])=>[id,{label:l.label,presenter:l.presenter,slots:Object.fromEntries(l.slots.map(s=>[s,elements.filter(e=>e.slots.includes(s)).map(e=>e.type)]))}])),elements:Object.fromEntries(elements.map(e=>[e.type,{label:e.label,slots:e.slots,params:e.params,beats:e.beats}]))};
await fs.writeFile(new URL('./style.json',import.meta.url),JSON.stringify(manifest,null,2)+'\n');
console.log(`Ribbon Depth: ${elements.length} elements, ${Object.keys(layouts).length} layouts`);
