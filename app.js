
const BASE_PATH='/catrouter-hub';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
function toast(m){const t=$('#toast');if(!t)return;t.textContent=m||'已复制';t.classList.add('on');clearTimeout(window.__t);window.__t=setTimeout(()=>t.classList.remove('on'),1400);}
async function copyText(v,m){try{await navigator.clipboard.writeText(v);}catch(e){const a=document.createElement('textarea');a.value=v;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();}toast(m);}
document.addEventListener('click',e=>{const c=e.target.closest('[data-copy]');if(c){e.preventDefault();copyText(c.getAttribute('data-copy'));}});
/* 搜索与筛选：纯增强，无 JS 时全部内容仍可见 */
const q=$('#q');
function applyFilter(){
  const kw=q?q.value.trim().toLowerCase():'',kind=(document.querySelector('[data-filter="kind"] .chip[aria-pressed="true"]')||{}).dataset;
  let shown=0;
  $$('#index .row').forEach(r=>{const okK=!kind||kind.val==='all'||r.dataset.kind===kind.val;
    const okQ=!kw||r.dataset.k.includes(kw);const on=okK&&okQ;r.style.display=on?'':'none';if(on)shown++;});
  $$('#index .group').forEach(g=>{const n=$$('.row',g).filter(r=>r.style.display!=='none').length;g.style.display=n?'':'none';});
  const c=$('#count');if(c)c.textContent=shown+' / '+$$('#index .row').length+' 个模型';
}
if(q)q.addEventListener('input',applyFilter);
$$('[data-filter="kind"] .chip').forEach(c=>c.addEventListener('click',()=>{
  $$('[data-filter="kind"] .chip').forEach(x=>x.setAttribute('aria-pressed','false'));
  c.setAttribute('aria-pressed','true');applyFilter();}));
/* 选型 */
const PICK={
 'coding|cheap':['glm-5.3-flash','原生多模态加编程能力，单价低，做前端原型和日常改代码够用。'],
 'coding|balanced':['claude-sonnet-5-5','Terminal-Bench 4.0 到 70.6%，速度与成本的平衡点，日常编码 Agent 的主力。'],
 'coding|max':['claude-opus-5-5','百万上下文加长程自主执行，成本比 Opus 5 低约 40%。'],
 'longctx|cheap':['deepseek-v4','百万上下文是官方默认，稀疏注意力把长文档成本压得很低。'],
 'longctx|balanced':['gemini-3.8-flash','DeepSWE v1.1 73.7%，effort 可调，长任务不用上旗舰价。'],
 'longctx|max':['gemini-4','全新基座、百万上下文、百万长解码，多模态与代码执行在一条链路。'],
 'reasoning|cheap':['deepseek-v4-pro-0813','开源阵营的推理上限，0813 权重组，价格远低于闭源旗舰。'],
 'reasoning|balanced':['gpt-6-astra','五档推理强度，按难度付钱，能力上限高。'],
 'reasoning|max':['claude-fable-5-1','Fable 5 同价换更高能力，缓存读取便宜 75%，重 Agent 负载最多省约 45%。'],
 'agent|cheap':['kimi-k3','开源 3T 级加原生视觉，长程任务性价比高。'],
 'agent|balanced':['grok-4.7','按数小时难题重训，强调自我校验，返工率低。'],
 'agent|max':['claude-fable-5-1','长跑场景领先幅度最大，适合一天级任务链。'],
 'image|cheap':['gemini-nano-banana-2.1','Flash 档成本、4K 画质，蒙版编辑与主体一致性够用。'],
 'image|balanced':['gpt-image-2.5','Flare 默认快出，1K 试稿 4K 定稿，商用素材性价比最高。'],
 'image|max':['gpt-image-2.6','标记引导编辑加 SVG / GIF 输出，精度与交付格式最全。'],
 'video|cheap':['sd-2-5-480p','480p 单价最低，30 秒长镜头先验结构再升档。'],
 'video|balanced':['doubao-seedance-2-0-fast-260128','音视频联合生成，四模态输入，批量试稿快。'],
 'video|max':['minimax-h3','15 秒 2K 加原生双声道，角色一致性与运镜控制最强。']
};
const AD={task:null,budget:null};
$$('[data-ad] .chip').forEach(c=>c.addEventListener('click',()=>{
  const g=c.closest('[data-ad]');g.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed','false'));
  c.setAttribute('aria-pressed','true');AD[g.dataset.ad]=c.dataset.val;renderAdv();}));
function renderAdv(){
  const pk=$('#advPick'),why=$('#advWhy'),links=$('#advLinks');if(!pk)return;
  if(!AD.task||!AD.budget){pk.textContent='先选一个任务';why.textContent='选完两个条件，这里给出模型名、理由和对应页面。';links.innerHTML='';return;}
  const rec=PICK[AD.task+'|'+AD.budget]||PICK[AD.task+'|balanced']||PICK[AD.task+'|cheap'];
  if(!rec){pk.textContent='这个组合暂时没有建议';why.textContent='换个任务类型试试。';return;}
  pk.textContent=rec[0];why.textContent=rec[1];
  links.innerHTML=`<a class="linkbtn" href="${BASE_PATH}/models/${rec[0]}/">看 ${rec[0]} 详情</a><button class="linkbtn" data-copy="${rec[0]}">复制模型名</button>`;
}
/* 成本计算器 */
const PRICE=[['gpt-6.1-sol',2,10],['gpt-6-astra',10,50],['gpt-5-5',5,30],['gpt-5.6-sol',5,30],['gpt-5.6-terra',2.5,15],['gpt-5.5',5,30],['gpt-5.4',3.5,21],['claude-fable-5-1',10,50]];
(function(){const sel=$('#cModel');if(!sel)return;
 PRICE.forEach(([n,i,o])=>{const op=document.createElement('option');op.value=`${n}|${i}|${o}`;op.textContent=`${n}（公开价）`;sel.appendChild(op);});
 const g=document.createElement('option');g.value='other';g.textContent='其他（按平台倍率，估算用 $5 / $30）';sel.appendChild(g);
 const out=$('#cRes'),note=$('#cNote');
 function calc(){const req=+($('#cReq').value||0),ti=+($('#cIn').value||0),to=+($('#cOut').value||0);
  let pi=5,po=30;if(sel.value&&sel.value!=='other'){const p=sel.value.split('|');pi=+p[1];po=+p[2];}
  const usd=req*30*((ti*pi+to*po)/1e6),cny=usd*7.1;
  out.textContent=cny>=10000?`约 ¥${(cny/10000).toFixed(2)} 万 / 月`:`约 ¥${Math.round(cny).toLocaleString()} / 月`;
  note.textContent=`按 $${pi}/$${po} 每百万 token 估算，折美元 $${Math.round(usd).toLocaleString()}；不含重试与缓存收益。`;}
 ['cReq','cIn','cOut'].forEach(i=>$('#'+i).addEventListener('input',calc));sel.addEventListener('change',calc);calc();})();
