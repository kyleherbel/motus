import {W,H,fonts} from './src/tokens.js';
import {box} from './src/common.js';
import {buildComposition} from './src/compile.js';
export default{
  id:'ribbon-depth',
  async setup(env){await Promise.all(fonts.files.map(async f=>{const face=new FontFace(f.family,`url(${env.styleUrl(f.src)})`,{weight:f.weight,style:f.style});document.fonts.add(await face.load());}));},
  compile(doc,env){
    const el=box(env.kit,'rd-root',{left:'0',top:'0',width:`${W}px`,height:`${H}px`,overflow:'hidden',fontFamily:fonts.sans,WebkitFontSmoothing:'antialiased'});
    let comp=null;const ready=buildComposition(doc,env,el).then(c=>{comp=c;});
    return{el,ready,seek(t){comp?.seek(t);},get audio(){return comp?.audio||[];},posterTime(id){return comp?.posterTime(id)??null;}};
  },
};
