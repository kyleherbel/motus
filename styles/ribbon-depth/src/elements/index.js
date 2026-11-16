import phrase from './phrase.js';
import card from './glass-card.js';
import stack from './glass-stack.js';
import search from './search-query.js';
import action from './action-button.js';
import compare from './glass-compare.js';
import {mediaFan,filmstrip} from './media.js';
import stat from './stat.js';
import chat from './chat.js';
import chart from './chart.js';
import orbit from './orbit.js';
import quote from './quote.js';
import swap from './swap.js';
import notify from './notify.js';
import bigWord from './big-word.js';
import ribbon from './ribbon-fx.js';
export const elements=[phrase,card,stack,search,action,compare,mediaFan,filmstrip,stat,chat,chart,orbit,quote,swap,notify,bigWord,ribbon];
export const byType=Object.fromEntries(elements.map(e=>[e.type,e]));
export const layouts={
  depth:{label:'Speaker with rear depth',presenter:'full',slots:['back','front','fx']},
  abstract:{label:'Abstract glass stage',presenter:'none',slots:['stage','front','detail']},
  split:{label:'Speaker window and panel',presenter:'window',slots:['panel','front','detail','fx']},
  studio:{label:'Small presenter and gallery',presenter:'cutout',slots:['back','back-title','front','fx']},
  'portrait-search':{label:'Circular portrait and query',presenter:'circle',slots:['detail']},
  clean:{label:'Presenter breathing room',presenter:'full',slots:['front','fx']},
};
