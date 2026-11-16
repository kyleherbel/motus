import { ribbonForms } from '../tokens.js';
// D13 ribbon as a placed effect: the compositor draws it; this element only says where and in which form.
export default {
  type:'ribbon',label:'Glass ribbon effect',slots:['fx'],
  params:{form:`enum:${Object.keys(ribbonForms).join('|')}`,at:'word?'},
  beats:{},
  build(ctx){ const el=document.createElement('div');el.style.display='none';return {el,seek(){}}; },
};
