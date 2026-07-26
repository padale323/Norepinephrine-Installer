// @request-earlyload
(()=>{
const K="shadowbyte_groq_api_key",H="shadowbyte_conv",SP="shadowbyte_sp";
const DSP=`You are ShadowByte, a sharp AI assistant in Norepinephrine Terminal. Be concise. Slightly edgy operator-style personality. Call the user "Operator" sometimes.`;
let key=NoreAPI.getStorage(K)||"",hist=JSON.parse(NoreAPI.getStorage(H)||"[]"),sysp=NoreAPI.getStorage(SP)||DSP;
const save=()=>NoreAPI.setStorage(H,JSON.stringify(hist));
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

function launch(){NoreAPI.launchApp(c=>{
c.innerHTML=`<style>
#sb{display:flex;height:100dvh;background:#17171c;font-family:Inter,sans-serif;color:#e2e8f0;overflow:hidden}
#sb-side{width:260px;background:#1e1e24;border-right:1px solid #374151;display:flex;flex-direction:column;flex-shrink:0}
#sb-side-head{padding:16px;display:flex;align-items:center;justify-content:space-between}
#sb-logo{display:flex;align-items:center;gap:8px;font-weight:600;font-size:1.1rem}
#sb-logo i{color:#3b82f6}
#sb-new{margin:0 12px 12px;background:#374151;border:1px solid #4b5563;color:#e2e8f0;padding:10px;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-size:.875rem;font-family:inherit}
#sb-new:hover{background:#4b5563}
#sb-hist{flex:1;padding:8px 12px;color:#6b7280;font-size:.875rem;text-align:center;margin-top:20px}
#sb-user{padding:12px;border-top:1px solid #374151;display:flex;align-items:center;gap:10px;font-size:.875rem}
#sb-avatar{width:32px;height:32px;border-radius:50%;background:#2563eb;display:flex;align-items:center;justify-content:center;flex-shrink:0}
#sb-main{flex:1;display:flex;flex-direction:column;min-width:0}
#sb-msgs{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:16px;scrollbar-width:thin;scrollbar-color:#4b5563 transparent}
#sb-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;color:#9ca3af}
#sb-empty i{font-size:2.5rem;color:#3b82f6;background:#3b82f620;padding:20px;border-radius:16px}
#sb-empty h2{font-size:1.5rem;font-weight:600;color:#f3f4f6;margin:0}
#sb-wrap{padding:16px 24px;max-width:860px;width:100%;margin:0 auto;box-sizing:border-box}
#sb-box{background:#2d2d35;border:1px solid #374151;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:8px;transition:border-color .2s}
#sb-box:focus-within{border-color:#6b7280}
#sb-ta{background:none;border:none;outline:none;color:#e2e8f0;font-family:inherit;font-size:.9375rem;resize:none;min-height:52px;placeholder-color:#6b7280;width:100%;box-sizing:border-box}
#sb-ta::placeholder{color:#6b7280}
#sb-bar{display:flex;justify-content:flex-end}
#sb-send{width:32px;height:32px;border-radius:50%;background:#374151;border:none;color:#9ca3af;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s}
#sb-send:hover{background:#3b82f6;color:#fff}
#sb-send:disabled{opacity:.4;cursor:not-allowed}
#sb-note{text-align:center;font-size:.72rem;color:#6b7280;margin-top:8px}
.sb-msg{display:flex;flex-direction:column;gap:4px}
.sb-msg.user{align-items:flex-end}
.sb-msg.bot{align-items:flex-start}
.sb-lbl{font-size:.65rem;color:#6b7280;padding:0 4px}
.sb-bubble{max-width:80%;padding:10px 14px;border-radius:12px;line-height:1.6;font-size:.9rem;white-space:pre-wrap;word-break:break-word}
.sb-msg.user .sb-bubble{background:#1e293b;border:1px solid #334155}
.sb-msg.bot .sb-bubble{background:#1a1a22;border:1px solid #2d2d3d}
.sb-sys{text-align:center;font-size:.72rem;color:#6b7280;padding:2px 0}
</style>
<div id="sb">
<aside id="sb-side">
  <div id="sb-side-head">
    <div id="sb-logo"><i class="fa-solid fa-ghost"></i>Shadow Byte</div>
    <button onclick="NoreAPI.exitApp()" style="background:none;border:none;color:#6b7280;cursor:pointer;font-size:.9rem" title="Exit"><i class="fa-solid fa-table-columns"></i></button>
  </div>
  <button id="sb-new"><i class="fa-solid fa-plus"></i>New chat</button>
  <div id="sb-hist">No previous chats</div>
  <div id="sb-user"><div id="sb-avatar"><i class="fa-solid fa-user" style="font-size:.8rem;color:#fff"></i></div><span>User Account</span></div>
</aside>
<main id="sb-main">
  <div id="sb-msgs">
    <div id="sb-empty">
      <i class="fa-solid fa-ghost"></i>
      <h2>Start chatting with Shadow Byte</h2>
    </div>
  </div>
  <div id="sb-wrap">
    <div id="sb-box">
      <textarea id="sb-ta" placeholder="Message Shadow Byte..." rows="2" oninput="this.style.height='';this.style.height=this.scrollHeight+'px'"></textarea>
      <div id="sb-bar"><button id="sb-send"><i class="fa-solid fa-arrow-up" style="font-size:.75rem"></i></button></div>
    </div>
    <div id="sb-note">Shadow Byte can make mistakes. Verify important information.</div>
  </div>
</main>
</div>`;

const msgs=c.querySelector("#sb-msgs"),ta=c.querySelector("#sb-ta"),btn=c.querySelector("#sb-send"),empty=c.querySelector("#sb-empty");

function note(t,col="#6b7280"){const e=document.createElement("div");e.className="sb-sys";e.style.color=col;e.textContent=t;msgs.appendChild(e);msgs.scrollTop=msgs.scrollHeight;}
function msg(role,text,html=false){
  if(empty)empty.remove();
  const w=document.createElement("div");w.className="sb-msg "+(role==="user"?"user":"bot");
  const l=document.createElement("div");l.className="sb-lbl";l.textContent=role==="user"?"OPERATOR":"SHADOWBYTE";
  const b=document.createElement("div");b.className="sb-bubble";
  html?b.innerHTML=text:b.textContent=text;
  w.appendChild(l);w.appendChild(b);msgs.appendChild(w);msgs.scrollTop=msgs.scrollHeight;return b;
}

if(hist.length){note("— conversation resumed —","#818cf840");hist.forEach(m=>msg(m.role,m.content));}
else if(!key){setTimeout(()=>note("No key set. Type /setkey <key>","#fbbf24"),100);}

async function slash(raw){
  const[sub,...rest]=raw.slice(1).trim().split(/\s+/);const r=rest.join(" ");
  if(sub==="setkey"){if(!r){note("Usage: /setkey <key>","#fbbf24");return;}key=r;NoreAPI.setStorage(K,key);note("Key saved.","#34d399");}
  else if(sub==="reset"){hist=[];save();msgs.innerHTML="";note("Cleared.");}
  else if(sub==="sysprompt"){if(!r)note(sysp,"#818cf8");else{sysp=r;NoreAPI.setStorage(SP,sysp);note("System prompt updated.","#34d399");}}
  else if(sub==="help")msg("bot","/setkey <key>\n/reset\n/sysprompt [text]\n/help\n/exit");
  else if(sub==="exit")NoreAPI.exitApp();
  else note(`Unknown: /${sub}. Try /help.`,"#f87171");
}

async function send(){
  const t=ta.value.trim();if(!t)return;ta.value="";ta.style.height="";
  if(t.startsWith("/")){await slash(t);return;}
  if(!key){note("No key set. Type /setkey <key>","#f87171");return;}
  msg("user",t);hist.push({role:"user",content:t});
  btn.disabled=true;
  const bub=msg("bot","▋",true);
  try{
    const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model:"llama-3.3-70b-versatile",max_tokens:1024,temperature:.7,messages:[{role:"system",content:sysp},...hist]})});
    if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(`[${r.status}] ${d.error?.message||r.statusText}`);}
    const d=await r.json(),reply=d.choices[0].message.content;
    bub.textContent=reply;hist.push({role:"assistant",content:reply});save();
  }catch(e){bub.innerHTML=`<span style="color:#f87171">Error: ${esc(e.message)}</span>`;hist.pop();}
  btn.disabled=false;ta.focus();
}

btn.addEventListener("click",send);
ta.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}});
c.querySelector("#sb-new").addEventListener("click",()=>{hist=[];save();msgs.innerHTML="";});
setTimeout(()=>ta.focus(),50);
});}

async function cmd(args){
  const[sub,...rest]=args.trim().split(/\s+/);
  if(sub==="setkey"){const k=rest.join(" ");if(!k){NoreAPI.print('<span class="warning-text">Usage: shadowbyte setkey &lt;key&gt;</span>',true);return;}key=k;NoreAPI.setStorage(K,key);NoreAPI.print('<span class="cmd">Key saved.</span>',true);}
  else if(sub==="reset"){hist=[];save();NoreAPI.print('<span class="dim">History cleared.</span>',true);}
  else if(sub==="help"){NoreAPI.print("<hr>",true);NoreAPI.print("shadowbyte — open chat<br>shadowbyte setkey &lt;key&gt;<br>shadowbyte reset<br>In-app: /setkey /reset /sysprompt /help /exit",true);NoreAPI.print("<hr>",true);}
  else launch();
}
window.registerCommand("shadowbyte","Open ShadowByte AI chat (Groq).",cmd);
})();
