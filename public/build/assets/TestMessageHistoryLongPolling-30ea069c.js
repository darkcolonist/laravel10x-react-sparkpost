import{y as f,f as o,x as n,j as l,a as u}from"./bootstrap-2c934fa5.js";const g=({messages:e})=>e.length===0?u("p",{children:"no messages to show"}):e.map((t,r)=>l("p",{children:["[",t.id,"] ",t.content]},r));function p(){f();const[e,t]=o.useState("873abc1504f4284604773fc6b9ead56f"),[r,a]=o.useState([]);o.useEffect(()=>{e!==null&&(d("messageHistory",{post:{conversation:e}}),console.debug("TEST","updated current conversation to",e),a([]))},[e]);const i=n(s=>s.addPoller),c=n(s=>s.removePoller),d=n(s=>s.updatePoller);return o.useEffect(()=>{i({id:"messageHistory",url:"/message/history",post:{conversation:e},onNewUpdates:s=>a(s)}),setTimeout(()=>{i({id:"conversationsList",url:"/sparkpost/conversations"})},5e3),setTimeout(()=>{c("conversationsList")},15e3),setTimeout(()=>{t("4d653e42e95f5de7f9e0f1e8c32ae953")},2e4),setTimeout(()=>{c("messageHistory")},41500),setTimeout(()=>{t("873abc1504f4284604773fc6b9ead56f")},5e4)},[]),l(o.Fragment,{children:[e?`long polling test for ${e}`:"waiting for conversation",u(g,{messages:r})]})}export{p as default};
