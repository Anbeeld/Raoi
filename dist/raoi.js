var Raoi;(()=>{"use strict";var e={d:(s,t)=>{for(var r in t)e.o(t,r)&&!e.o(s,r)&&Object.defineProperty(s,r,{enumerable:!0,get:t[r]})},o:(e,s)=>Object.prototype.hasOwnProperty.call(e,s)},s={};(()=>{e.d(s,{default:()=>r});class t{static new(e){return t.checkWeakRefsSupport(),t.weakRefsSupported?void 0!==e?t.weakRefs.push(new WeakRef(e)):t.weakRefs.push(null):void 0!==e?t.strongRefs.push(e):t.strongRefs.push(null),t.id++}static get(e){return e>t.id?null:(t.checkWeakRefsSupport(),t.weakRefsSupported?null===t.weakRefs[e]?null:t.weakRefs[e].deref():null===t.strongRefs[e]?null:void 0!==t.strongRefs[e]?t.strongRefs[e]:void 0)}static unregister(e){e>t.id||(t.weakRefsSupported?t.weakRefs[e]=null:t.strongRefs[e]=null)}static checkWeakRefsSupport(){if(null===t.weakRefsSupported){t.weakRefsSupported=!0;try{new WeakRef(new Object)}catch(e){t.weakRefsSupported=!1}}}}t.id=0,t.weakRefsSupported=null,t.weakRefs=[],t.strongRefs=[];const r=t})(),Raoi=s.default})();