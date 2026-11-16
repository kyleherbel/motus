// Render the original examples with synthetic footage. No source media is copied.
// Usage: node styles/ribbon-depth/dev/verify-browser.mjs <conformed-project> <output-dir>
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createStudioServer} from '../../../engine/lib/server.mjs';
import {Browser} from '../../../engine/lib/cdp.mjs';
import {sceneTimes} from '../../../engine/lib/plan.mjs';
const [project,outArg]=process.argv.slice(2);
if(!project||!outArg)throw new Error('Usage: verify-browser.mjs <conformed-project> <output-dir>');
const out=path.resolve(outArg);await fs.mkdir(out,{recursive:true});
const srv=await createStudioServer(path.resolve(project),{port:0});let browser;
const reports=[];
try{
  browser=await Browser.launch();const page=await browser.newPage();
  await page.goto(`${srv.url}runtime/stage.html?mode=render`,{readyExpr:'window.__motusReady === true'});
  for(const name of ['01-process','02-gallery','03-fitness','04-finance','05-cooking'])for(const matte of [true,false]){
    const edit=JSON.parse(await fs.readFile(new URL(`../examples/${name}.edit.json`,import.meta.url),'utf8'));
    const words=JSON.parse(await fs.readFile(new URL(`../examples/${name}.words.json`,import.meta.url),'utf8')).words;
    const duration=words.at(-1).end+0.4,times=sceneTimes(edit.scenes,words,{duration,fps:[30,1]},0);
    const doc={style:'ribbon-depth',styleVersion:'0.1.0',width:1080,height:1920,fps:30,duration,frames:Math.ceil(duration*30),hasMatte:matte,framing:{eyeX:540,eyeY:670,faceW:370},look:edit.look,words,captions:edit.captions,audio:edit.audio,scenes:edit.scenes.map((s,i)=>({...s,...times[i],option:s.options[0]}))};
    await page.eval(`(async()=>{
      const kit=await import('/runtime/kit/index.js');const style=(await import('/styles/ribbon-depth/style.js')).default;
      const doc=${JSON.stringify(doc)};
      const mock={hasMatte:doc.hasMatte,view(opt={}){const c=document.createElement('canvas');c.width=1080;c.height=1920;const g=c.getContext('2d');if(!opt.matte){g.fillStyle='#5d5163';g.fillRect(0,0,1080,1920);g.fillStyle='#292537';g.fillRect(80,120,230,560);}if(!opt.matte||doc.hasMatte){g.fillStyle='#171b28';g.beginPath();g.ellipse(540,1450,470,640,0,0,Math.PI*2);g.fill();g.fillStyle='#bc9985';g.beginPath();g.ellipse(540,670,185,260,0,0,Math.PI*2);g.fill();}return c;}};
      const svg='<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="400" height="500" fill="#303c76"/><circle cx="200" cy="210" r="105" fill="#e1a875"/><path d="M0 460L400 210V500H0Z" fill="#a9abd5"/></svg>';
      const env={W:1080,H:1920,kit,footage:mock,styleUrl:r=>'/styles/ribbon-depth/'+r,projectUrl:r=>'data:image/svg+xml,'+encodeURIComponent(svg)};
      await style.setup(env);const comp=style.compile(doc,env);document.getElementById('stage').replaceChildren(comp.el);await comp.ready;window.__rd={comp,doc};return true;
    })()`);
    for(const [i,sc] of doc.scenes.entries()){
      const t=Math.min(sc.end-0.3,sc.start+(sc.end-sc.start)*0.8);
      // seek purity has two parts. The style's own output must be identical: the DOM it leaves behind and
      // every canvas it draws. The final composited screenshot may differ only by compositor raster noise
      // (anti-aliased edges under blurred shadows re-rastered in different tiles): at most a few hundred
      // pixels, none by more than 48 levels summed over RGB.
      const state=`(async()=>{const root=document.querySelector('.rd-root');const vis=e=>{if(getComputedStyle(e).display==='none')return '';return '<'+e.tagName+' '+(e.getAttribute('style')||'')+' '+[...e.attributes].filter(a=>a.name!=='style').map(a=>a.name+'='+a.value).join(' ')+'>'+[...e.childNodes].map(n=>n.nodeType===3?n.textContent:n.nodeType===1?vis(n):'').join('');};const cs=[...root.querySelectorAll('canvas')].map(c=>{try{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let h=0;for(let i=0;i<d.length;i+=97)h=(h*31+d[i])>>>0;return h;}catch{return 'webgl';}});const html=vis(root);return JSON.stringify({html:html.length+':'+[...html].reduce((h,ch)=>(h*31+ch.charCodeAt(0))>>>0,0),cs});})()`;
      await page.eval(`window.__rd.comp.seek(${t})`);
      const a=await page.screenshot({format:'png'}),sa=await page.eval(state);
      await page.eval(`window.__rd.comp.seek(${Math.max(0,sc.start-0.12)});window.__rd.comp.seek(${doc.duration-0.1});window.__rd.comp.seek(${t})`);
      const b=await page.screenshot({format:'png'}),sb=await page.eval(state);
      assert.equal(sa,sb,`seek purity (style state): ${name} ${sc.id} matte=${matte}`);
      if(crypto.createHash('sha256').update(a).digest('hex')!==crypto.createHash('sha256').update(b).digest('hex')){
        const diff=await page.eval(`(async()=>{const load=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=src;});const [A,B]=await Promise.all([load('data:image/png;base64,${a.toString('base64')}'),load('data:image/png;base64,${b.toString('base64')}')]);const c=document.createElement('canvas');c.width=A.width;c.height=A.height;const g=c.getContext('2d');g.drawImage(A,0,0);const da=g.getImageData(0,0,c.width,c.height).data;g.clearRect(0,0,c.width,c.height);g.drawImage(B,0,0);const db=g.getImageData(0,0,c.width,c.height).data;let n=0,m=0;for(let i=0;i<da.length;i+=4){const d=Math.abs(da[i]-db[i])+Math.abs(da[i+1]-db[i+1])+Math.abs(da[i+2]-db[i+2]);if(d){n++;if(d>m)m=d;}}return {n,m};})()`);
        assert.ok(diff.n<=400&&diff.m<=48,`seek purity (pixels): ${name} ${sc.id} matte=${matte}: ${diff.n} pixels differ, max ${diff.m}`);
      }
      const filename=`${name}-${matte?'matte':'fallback'}-${sc.id}.png`;await fs.writeFile(path.join(out,filename),b);
      const bad=await page.eval(`(()=>{const errors=[];for(const e of document.querySelectorAll('.rd-root *')){if(e.children.length||!e.textContent.trim())continue;const r=e.getBoundingClientRect();if(r.width&&r.height&&(r.left<0||r.right>1081||r.top<0||r.bottom>1921))errors.push({text:e.textContent,rect:[r.x,r.y,r.width,r.height]});}return errors;})()`);
      assert.deepEqual(bad,[],`${name}/${sc.id}: visible text outside frame`);
      reports.push({name,scene:sc.id,matte,file:filename,seekDeterministic:true});
    }
  }
  await fs.writeFile(path.join(out,'report.json'),JSON.stringify(reports,null,2)+'\n');console.log(JSON.stringify({ok:true,scenes:reports.length,out},null,2));
}finally{await browser?.close();await srv.close();}
