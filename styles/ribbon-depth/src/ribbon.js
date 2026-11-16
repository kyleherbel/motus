import { W, H, material, motion } from './tokens.js';
import { clamp, progress, noise, inOutSine } from './common.js';

// D08: an original 3D glass ribbon. A flat band wound on a tilted cylinder (a spiral), projected with
// perspective, depth-sorted, shaded by its facing angle (bright grazing rims, translucent face), then
// bloomed. It turns slowly the whole time it is on screen: the reference never holds it still.
const rgb = hex => [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
const mix = (a,b,k) => a.map((v,i)=>Math.round(v+(b[i]-v)*k));
const css = (c,a) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

export function makeRibbon(kit,C,opt={}) {
  const el=kit.h('canvas',{width:W,height:H,style:{position:'absolute',inset:'0',width:`${W}px`,height:`${H}px`,pointerEvents:'none',
    // the ribbon lives behind the head and shoulders; it fades out above microphones and hands
    maskImage:'linear-gradient(#000 0%,#000 57%,transparent 67%)'}});
  // CPU-pinned contexts: Chrome otherwise promotes a canvas to the GPU after its first frames, and the
  // first and later draws of the same t then differ by a few levels
  const g=el.getContext('2d',{willReadFrequently:true});
  const buf=document.createElement('canvas');buf.width=W;buf.height=H;const b=buf.getContext('2d',{willReadFrequently:true});
  // bloom by downscale/upscale (bilinear) instead of ctx.filter blur, which is not bit-stable between seeks
  const mk=(d)=>{const c=document.createElement('canvas');c.width=Math.ceil(W/d);c.height=Math.ceil(H/d);const x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingEnabled=true;return {c,x,d};};
  const B1=mk(6),B2=mk(14),B3=mk(32);
  const R0={...material.ribbon,...opt};
  const A=rgb(C.accent),A2=rgb(C.accent2),RIM=rgb(C.rim),DEEP=rgb(C.deep);

  function project(R,t,u,v,phase,radius) {
    const th=phase+u*R.turns*Math.PI*2;
    const X=radius*Math.sin(th), Y0=R.top+u*R.length-R.cy+v*R.bandWidth, Z0=-radius*Math.cos(th);
    const cp=Math.cos(R.pitch),sp=Math.sin(R.pitch),cr=Math.cos(R.roll),sr=Math.sin(R.roll);
    const Y1=Y0*cp-Z0*sp, Z1=Y0*sp+Z0*cp;
    const X2=X*cr-Y1*sr, Y2=X*sr+Y1*cr;
    const s=R.focal/(R.focal+Z1);
    // surface normal is radial; its depth component decides how flat-on we see the band
    const nZ0=-Math.cos(th), nZ=0*sp+nZ0*cp;
    return {x:R.cx+X2*s,y:R.cy+Y2*s,z:Z1,s,face:Math.abs(nZ),th};
  }

  function drawBand(t,R,reveal,strength,t0) {
    b.clearRect(0,0,W,H);
    const N=R.segments,S=8;
    const age=t-t0;
    // full coils turn; partial bands sway, so they never drift out of the frame
    const phase=R.phase+(R.turns>=1?age*(R.spin??motion.ribbonFlow)*Math.PI*2:Math.sin(age*0.35)*0.10);
    const shine=((age*0.22)%1.4)-0.2;              // a glint that travels along the band
    const radius=R.radius*(1+0.018*Math.sin(t*motion.ribbonBreath*Math.PI*2));
    const uMax=reveal;
    const cols=[];
    for(let i=0;i<=N;i++){const u=i/N;const col=[];for(let k=0;k<=S;k++)col.push(project(R,t,u,k/S-0.5,phase,radius));cols.push(col);}
    const segs=[];for(let i=0;i<N;i++){if(i/N>uMax)break;segs.push(i);}
    const M=S/2;
    segs.sort((p,q)=>(cols[q][M].z+cols[q+1][M].z)-(cols[p][M].z+cols[p+1][M].z));
    b.lineJoin='round';
    for(const i of segs){
      const c0=cols[i],c1=cols[i+1],u=i/N;
      const fres=1-c0[M].face;                       // 0 face-on, 1 grazing
      const near=clamp((c0[M].s-0.75)/0.9);           // perspective scale -> nearer is brighter
      const tip=(uMax<1?clamp(1-(uMax-u)/0.06):0)+0.55*Math.exp(-Math.pow((u-shine)/0.045,2)); // reveal edge + travelling glint
      const fadeEnds=Math.min(clamp(u/0.08),clamp((1-u)/0.14));
      const alphaBase=strength*fadeEnds;
      // translucent glass face: dark-ish core, luminous edges, grazing angles light up
      for(let k=0;k<S;k++){
        const vv=Math.abs((k+0.5)/S-0.5)*2;            // 0 centre, 1 edge
        const col=mix(mix(mix(DEEP,A,0.62+0.38*near),A2,clamp(0.55*fres+0.5*vv*vv+0.15)),RIM,clamp(Math.pow(vv,5)*0.8+fres*fres*0.4+tip*0.7));
        const a=alphaBase*clamp(0.16+0.22*near+0.36*fres*fres+0.50*Math.pow(vv,6)+tip*0.5);
        b.fillStyle=css(col,a);
        b.beginPath();b.moveTo(c0[k].x,c0[k].y);b.lineTo(c1[k].x,c1[k].y);b.lineTo(c1[k+1].x,c1[k+1].y);b.lineTo(c0[k+1].x,c0[k+1].y);b.closePath();b.fill();
      }
      // two bright rims, fine streaks, and one specular line a third of the way across
      for(let k=0;k<=S;k++){
        const rim=k===0||k===S,spec=k===2;
        if(!rim&&!spec&&k%2)continue;
        const a=rim?clamp(0.62+0.38*fres+0.15*near):spec?0.28+0.42*fres:0.07+0.10*fres;
        b.strokeStyle=css(rim||spec?RIM:A2,alphaBase*a);
        b.lineWidth=(rim?2.6:spec?1.6:0.9)*c0[k].s;
        b.beginPath();b.moveTo(c0[k].x,c0[k].y);b.lineTo(c1[k].x,c1[k].y);b.stroke();
      }
    }
    return {cols,segs,N};
  }

  return {el,seek(t,{start=0,strength=1,intensity=1,enabled=true,params={},retract=1}={}) {
    g.clearRect(0,0,W,H); if(!enabled||strength<=0)return;
    const R={...R0,...params};strength*=R.strength??1;
    const reveal=Math.min(inOutSine(clamp((t-start-motion.ribbonStart)/motion.ribbonReveal)),inOutSine(clamp(retract)));
    if(reveal<=0)return;
    const {cols,N}=drawBand(t,R,reveal,strength,start);
    // bloom: a wide warm halo, a tighter glow, then the sharp band on top
    for(const L of [B1,B2,B3]){L.x.clearRect(0,0,L.c.width,L.c.height);}
    B1.x.drawImage(buf,0,0,B1.c.width,B1.c.height);B2.x.drawImage(B1.c,0,0,B2.c.width,B2.c.height);B3.x.drawImage(B2.c,0,0,B3.c.width,B3.c.height);
    g.imageSmoothingEnabled=true;g.globalCompositeOperation='lighter';
    g.globalAlpha=0.80;g.drawImage(B3.c,0,0,W,H);   // wide warm halo
    g.globalAlpha=0.85;g.drawImage(B2.c,0,0,W,H);   // glow
    g.globalAlpha=0.55;g.drawImage(B1.c,0,0,W,H);   // soft edge
    g.globalAlpha=1;g.globalCompositeOperation='source-over';g.drawImage(buf,0,0);
    // sparkles ride the rims and twinkle on a fixed hash, never wall-clock noise
    g.globalCompositeOperation='lighter';
    for(let i=0;i<R.sparkles;i++){
      const u=noise(i,1),k=noise(i,2)<0.5?0:8;
      if(u>reveal)continue;
      const idx=Math.min(N,Math.floor(u*N)),p=cols[idx][k];
      const off=(noise(i,3)-0.5)*40*p.s,tw=0.5+0.5*Math.sin(t*(1.4+noise(i,4)*2.2)*Math.PI*2+i);
      const r=(0.8+noise(i,5)*1.8)*p.s,a=strength*tw*(0.35+0.5*(1-p.face));
      g.fillStyle=css(RIM,a);g.beginPath();g.arc(p.x+off*0.3,p.y+off,r,0,Math.PI*2);g.fill();
      if(noise(i,6)>0.86){g.fillStyle=css(RIM,a*0.7);g.fillRect(p.x-r*6,p.y+off-0.6,r*12,1.2);g.fillRect(p.x-0.6,p.y+off-r*6,1.2,r*12);}
    }
    g.globalCompositeOperation='source-over';
  }};
}
