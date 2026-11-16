import { W, H, material, motion } from './tokens.js';
import { box, clamp, noise } from './common.js';

// D09: matte glass spheres lit from the upper left, at several depths (sharp near, defocused far).
function sphere(kit,C,[x,y,r,blur]) {
  // defocus is drawn into the gradient (a soft, slightly larger disc), not a CSS blur filter: filters are
  // not bit-stable between seeks in the renderer, and seek(t) must give the same pixels every time
  if(blur){const R=r+blur*1.6;return box(kit,'rd-orb',{left:`${x-R}px`,top:`${y-R}px`,width:`${R*2}px`,height:`${R*2}px`,borderRadius:'50%',
    background:`radial-gradient(circle at 42% 38%,${C.muted}70 0%,${C.orb}c0 ${Math.round(r/R*45)}%,${C.orb}60 ${Math.round(r/R*85)}%,transparent 100%)`});}
  return box(kit,'rd-orb',{left:`${x-r}px`,top:`${y-r}px`,width:`${r*2}px`,height:`${r*2}px`,borderRadius:'50%',
    background:`radial-gradient(circle at 33% 27%,${C.muted}e8 0%,${C.muted}70 14%,${C.orb} 46%,${C.ground} 96%)`,
    boxShadow:`inset -${r*0.2}px -${r*0.24}px ${r*0.55}px #000000a0,inset ${r*0.06}px ${r*0.05}px ${r*0.2}px ${C.accent2}30`});
}

export function makeAtmosphere(kit,C) {
  // presenter world: halftone stripes behind the head, spheres around it
  const presenter=box(kit,'rd-atmos',{inset:'0',pointerEvents:'none'});
  const dots=(x,y,w,h,o)=>box(kit,'rd-dotgrid',{left:`${x}px`,top:`${y}px`,width:`${w}px`,height:`${h}px`,opacity:String(o),
    backgroundImage:`radial-gradient(${C.rim} 1.3px,transparent 1.9px)`,backgroundSize:'11px 15px',
    maskImage:'radial-gradient(ellipse 50% 50% at 50% 45%,#000 35%,transparent 100%)'});
  const stripes=[dots(48,60,170,330,0.20),dots(866,150,170,520,0.18),dots(30,820,120,300,0.12)];
  presenter.append(...stripes);
  const orbs=material.orbs.map(o=>{const el=sphere(kit,C,o);presenter.append(el);return {el,o};});
  // abstract world (D10): bright core, a thin distant horizon arc, bokeh, glints and a perspective dot floor
  const world=box(kit,'rd-world',{inset:'0',pointerEvents:'none'});
  const core=box(kit,'rd-core',{inset:'0',background:`radial-gradient(ellipse 420px 600px at 50% 44%,${C.accent}70,${C.glow}38 38%,${C.deep}a0 62%,transparent 88%)`});
  const svgNS='http://www.w3.org/2000/svg',svg=document.createElementNS(svgNS,'svg');svg.setAttribute('width',W);svg.setAttribute('height',H);svg.style.cssText='position:absolute;inset:0';
  const arc=document.createElementNS(svgNS,'path');arc.setAttribute('d',`M -200 470 Q 540 180 1280 470`);arc.setAttribute('fill','none');arc.setAttribute('stroke',C.rim);arc.setAttribute('stroke-width','2.2');arc.setAttribute('opacity','0.55');
  const arcGlow=arc.cloneNode();arcGlow.setAttribute('stroke',C.accent);arcGlow.setAttribute('stroke-width','16');arcGlow.setAttribute('opacity','0.30');arcGlow.style.filter='blur(10px)';
  svg.append(arcGlow,arc);
  const floor=box(kit,'rd-floor',{left:'-120px',top:'1300px',width:'1320px',height:'560px',backgroundImage:`radial-gradient(${C.rim}aa 1.5px,transparent 2px)`,backgroundSize:'30px 30px',transform:'perspective(520px) rotateX(70deg)',transformOrigin:'50% 0%',maskImage:'radial-gradient(ellipse 60% 70% at 50% 20%,#000,transparent 80%)',opacity:'0.32'});
  const bokeh=[[150,300,120],[880,260,96],[960,1060,130],[120,1290,104],[620,1640,90]].map(([x,y,r],i)=>{
    const el=box(kit,'rd-bokeh',{left:`${x-r}px`,top:`${y-r}px`,width:`${r*2}px`,height:`${r*2}px`,borderRadius:'50%',background:`radial-gradient(circle at 42% 38%,${C.accent2}70,${C.accent}38 50%,transparent 70%)`,filter:`blur(${16+(i%3)*8}px)`,opacity:'0.6'});
    return {el,x,y,r,i};});
  const glints=[[870,300],[160,830],[930,1110],[470,560],[220,420]].map(([x,y],i)=>{
    const el=box(kit,'rd-glint',{left:`${x-9}px`,top:`${y-9}px`,width:'18px',height:'18px'});
    el.append(box(kit,'g1',{left:'8px',top:'0',width:'2px',height:'18px',background:C.rim,boxShadow:`0 0 10px ${C.glow}`}),box(kit,'g2',{left:'0',top:'8px',width:'18px',height:'2px',background:C.rim}));
    return {el,i};});
  world.append(core,floor,svg,...bokeh.map(b=>b.el),...glints.map(g=>g.el));
  return {presenter,world,seek(t,{mode,intensity=1,cam={x:0,y:0}}){
    const abstract=mode==='abstract'||mode==='split';
    presenter.style.display=abstract||mode==='portrait-search'?'none':'';world.style.display=abstract?'':'none';
    // every element is updated every frame, visible or not, so state never depends on seek history
    orbs.forEach(({el,o},i)=>{const [x,y,r,blur,par]=o;const dy=Math.sin(t*motion.driftHz*Math.PI*2/(1.6+i*0.23)+i*1.7)*motion.drift*1.3*intensity;const dx=Math.cos(t*motion.driftHz*Math.PI*2/(2.1+i*0.31)+i)*motion.drift*0.6*intensity;
      el.style.transform=`translate(${dx+cam.x*par*0.6}px,${dy+cam.y*par*0.6}px)`;});
    stripes.forEach(s=>{s.style.transform=`translate(${cam.x*0.3}px,${cam.y*0.3}px)`;});
    bokeh.forEach(({el,i})=>{el.style.transform=`translate(${Math.sin(t*0.21+i)*10*intensity+cam.x*0.5}px,${Math.cos(t*0.17+i*1.3)*14*intensity+cam.y*0.5}px)`;el.style.opacity=String(0.55+0.2*Math.sin(t*0.5+i));});
    glints.forEach(({el,i})=>{const tw=0.35+0.65*Math.pow(0.5+0.5*Math.sin(t*(1.1+noise(i)*1.4)*Math.PI*2+i*2),2);el.style.opacity=String(tw);el.style.transform=`scale(${0.7+tw*0.5}) rotate(${t*12+i*20}deg)`;});
    floor.style.backgroundPosition=`0px ${((t*18)%30).toFixed(2)}px`;
  }};
}
