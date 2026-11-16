import { geo,type,motion,fonts } from '../tokens.js';
import { box,glass,text,mixed,icon,reveal,atWord,progress,disc,outBack,clamp,ICONS } from '../common.js';
const ICON=`enum?:${ICONS.join('|')}`;
// D09/D11: rear card. Title in sans with one heavy italic word (two lines when long), a grip mark,
// rows that check in on their words, and glass icon tiles that pop on the right along a dotted arc.
export default {
  type:'glass-card',label:'Rear frosted card',slots:['back','stage'],
  params:{title:{type:'string',maxChars:24},accent:{type:'string',maxChars:18,optional:true},treatment:'enum?:rows|funnel|plain',tile:ICON,
    rows:{type:'array',min:1,max:3,optional:true,of:{text:{type:'string',maxChars:23},at:'word?',icon:ICON}}},
  beats:{focus:{index:{type:'number',min:0,max:2}}},
  build(ctx) {
    const {kit,C,spec}=ctx,back=ctx.slot==='back',r=back?geo.back:{x:230,y:560,w:620,h:560};
    const el=box(kit,'rd-cardwrap',{left:'0',top:'0',width:'1080px',height:'1920px',pointerEvents:'none'});
    const card=glass(kit,C,r,{transformOrigin:'40% 60%'});el.append(card);
    const split=spec.title.length>13&&spec.accent&&spec.title.trim().endsWith(spec.accent);
    const head=mixed(kit,spec.title,spec.accent,C,{size:type.title,width:r.w-geo.pad*2-40,ink:C.ink,ratio:type.titleItalic/type.title,split});
    Object.assign(head.el.style,{position:'absolute',left:`${geo.pad}px`,top:`${geo.pad-6}px`,textAlign:'left'});card.append(head.el);
    const grip=box(kit,'rd-grip',{right:'34px',top:`${geo.pad+4}px`,width:'18px',height:'16px',display:'flex',gap:'4px'});
    for(let i=0;i<3;i++)grip.append(box(kit,'g',{position:'relative',width:'2px',height:'16px',background:C.ink+'55',borderRadius:'1px'}));card.append(grip);
    const rowTop=geo.pad+(split?118:72);
    // faint interior structure: a divider under the title and a small ellipsis, as on the reference card
    card.append(box(kit,'rd-divider',{left:`${geo.pad}px`,right:`${geo.pad}px`,top:`${rowTop-14}px`,height:'1px',background:`linear-gradient(90deg,${C.ink}22,${C.ink}08)`}));
    if(!(spec.rows||[]).length)card.append(text(kit,'···',{position:'absolute',left:`${geo.pad}px`,top:`${rowTop+4}px`,fontSize:'34px',color:C.ink+'55',letterSpacing:'2px'}));
    const funnel=spec.treatment==='funnel';
    const rows=(spec.rows||[]).map((row,i)=>{
      const width=r.w-geo.pad*2-(funnel?i*70:0);
      const rowEl=box(kit,'rd-row',{left:`${(r.w-width)/2}px`,top:`${rowTop+i*(geo.rowH+geo.rowGap)}px`,width:`${width}px`,height:`${geo.rowH}px`,borderRadius:funnel?'10px':'18px',display:'flex',alignItems:'center',gap:'14px',padding:'0 18px',justifyContent:funnel?'center':'flex-start',fontSize:`${type.body}px`,fontFamily:fonts.sans,overflow:'hidden',transformOrigin:'left center'});
      if(funnel)rowEl.style.clipPath='polygon(0 0,100% 0,95% 100%,5% 100%)';
      const mark=box(kit,'rd-mark',{position:'relative',width:'34px',height:'34px',flex:'0 0 34px',borderRadius:'50%',display:'grid',placeItems:'center',border:`1.5px solid ${C.ink}40`});
      const ic=icon(kit,row.icon||'check',C,22,C.ink,2.6);mark.append(ic);
      const size=kit.fitSize(row.text,width-100,s=>`500 ${s}px ${fonts.sans}`,type.body,type.min);
      const label=text(kit,row.text,{fontSize:`${size}px`,whiteSpace:'nowrap',fontWeight:'500'});
      rowEl.append(mark,label);card.append(rowEl);
      return {el:rowEl,mark,ic,label,start:atWord(ctx,row.at,ctx.tIn+motion.enter+i*motion.stagger),icon:row.icon};
    });
    // icon tiles: a lead tile, then one per row that names an icon; joined by a dotted arc
    const tiles=[];
    if(back){
      const kinds=[spec.tile,...rows.filter(x=>x.icon).map(x=>x.icon)].filter(Boolean).slice(0,3);
      const starts=[ctx.tIn+0.55,...rows.filter(x=>x.icon).map(x=>x.start)];
      kinds.forEach((k,i)=>{const p=geo.discs[i];const d=disc(kit,C,k,p.r*2);Object.assign(d.style,{left:`${p.x-p.r}px`,top:`${p.y-p.r}px`});el.append(d);tiles.push({el:d,start:starts[i]??ctx.tIn+0.55+i*0.5,p});});
    }
    let arc=null;
    if(tiles.length>1){const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.setAttribute('width','1080');svg.setAttribute('height','1920');svg.style.cssText='position:absolute;inset:0';
      const pts=tiles.map(x=>x.p);let d=`M ${pts[0].x} ${pts[0].y+pts[0].r}`;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];d+=` Q ${Math.max(a.x,b.x)+60} ${(a.y+b.y)/2} ${b.x} ${b.y-b.r}`;}
      arc=document.createElementNS(ns,'path');arc.setAttribute('d',d);arc.setAttribute('fill','none');arc.setAttribute('stroke',C.rim);arc.setAttribute('stroke-width','2');arc.setAttribute('stroke-dasharray','2 9');arc.setAttribute('stroke-linecap','round');arc.setAttribute('opacity','0.55');svg.append(arc);el.insertBefore(svg,el.firstChild);}
    return {el,seek(t){
      reveal(card,t,ctx.tIn,{dur:motion.enter*1.15,blur:20,rise:56,scale:0.9,intensity:ctx.intensity});
      const explicit=ctx.beats.filter(b=>b.do==='focus'&&b.t<=t).at(-1);
      const latest=explicit?.index??rows.reduce((n,r,i)=>t>=r.start?i:n,-1);
      rows.forEach((row,i)=>{
        const p=progress(t,row.start,motion.row);row.el.style.opacity=String(clamp(p*1.3));row.el.style.transform=`translateX(${(1-p)*-24}px) scaleX(${0.92+0.08*p})`;row.el.style.filter=p<0.98?`blur(${(1-p)*8}px)`:'none';
        const on=i===latest&&t>=row.start,done=t>=row.start;
        const flash=on?progress(t,row.start,0.5):0;
        row.el.style.background=on?`linear-gradient(100deg,${C.accent} 0%,${C.accent2} 70%,${C.rim} 130%)`:funnel?`linear-gradient(100deg,${C.accent}70,${C.accent2}70)`:'#ffffff8c';
        row.el.style.boxShadow=on?`inset 0 1px 2px #ffffffc0,0 6px 24px ${C.glow}${Math.round(0x40+0x50*flash).toString(16)}`:`inset 0 1px 1px #fff,0 1px 3px #0000000f`;
        row.el.style.color=on?'#fff':C.ink;row.ic.firstChild.setAttribute('stroke',on?'#fff':done?'#fff':C.ink);
        row.mark.style.background=on?'#ffffff33':done?C.ink:'transparent';row.mark.style.borderColor=on?'#ffffffaa':done?C.ink:C.ink+'40';
      });
      tiles.forEach(x=>{const p=progress(t,x.start,motion.disc,v=>outBack(v,2));x.el.style.opacity=String(clamp(p*1.6));x.el.style.transform=`scale(${0.3+0.7*p}) translateY(${Math.sin(t*1.3+x.p.y)*3}px)`;});
      if(arc){const p=progress(t,tiles[1].start-0.1,0.5);arc.style.opacity=String(0.55*p);}
    }};
  },
};
