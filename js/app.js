/* Page behaviour: builds the panels, runs the renderer, and handles scrolling,
   pointer input, sound, the mixer, wisdom cards, daily practice and time of day.
   Loads after content.js and shaders.js. */

const N=T.length,SLUG=T.map(t=>t.k.toLowerCase());   // scene names used in shared links, e.g. #agni
/* language: the Hindi wording from content.js replaces the English that sits in index.html */
document.documentElement.lang=LANG;
if(LANG==='hi'){document.title=HI.title;for(const q in HI.html)document.querySelectorAll(q).forEach(e=>e.innerHTML=HI.html[q]);}
const BJ=['ॐ','लं','वं','रं','यं','हं','ॐ','०','ॐ','ॐ'];
T.forEach((t,i)=>{t.b=BJ[i];t.tip=TIP[i];const n=parseInt(t.c.slice(1),16);t.rgb=[(n>>16)/255,(n>>8&255)/255,(n&255)/255];});
const ph=document.getElementById('panels'),nav=document.getElementById('nav');
T.forEach((t,i)=>{
  if(i){const s=document.createElement('section');s.className='panel';s.style.setProperty('--c',t.c);
    s.innerHTML=`<div class="bija">${t.b}</div><div class="count">${t.cnt||S.tattva+' 0'+i+' / 05'}</div><h2 class="deva">${t.d}</h2>
    <div class="name">${t.k} <span>— ${t.e.toUpperCase()}</span></div><p class="line">${t.l}</p>
    <div class="meta">${t.m.map(m=>`<div><small>${m[0]}</small><b>${m[1]}</b></div>`).join('')}</div><div class="tip">✦ ${t.tip}</div>${t.k==='EKAM'?'<div class="btns"><button id="again">${S.again}</button><button id="cap2">${S.cap2}</button><button id="shr2">↗ ${S.share}</button></div>':''}`;
    ph.appendChild(s);}
  const a=document.createElement('a');a.style.setProperty('--c',t.c);a.innerHTML=`<span>${t.k}</span><i></i>`;
  a.onclick=()=>go(i);nav.appendChild(a);
});
const panels=[...document.querySelectorAll('.panel')],dots=[...nav.children];


/* sangam: the mixer (results are in content.js) */
const h2r=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)/255,(n>>8&255)/255,(n&255)/255];};
const mp=panels[N-1];mp.classList.add('mix');
mp.innerHTML=`<div class="count">${S.mixHead}</div>
 <div class="chips">${T.slice(1,8).map((t,i)=>`<button class="chip" data-i="${i+1}" style="--c:${t.c}"><b>${t.d}</b>${t.e}</button>`).join('')}</div>
 <div class="eq" id="mxe"></div><h2 class="deva" id="mxd"></h2><div class="name" id="mxn"></div><p class="line" id="mxl"></p>
 <div class="tip">✦ ${S.mixTip}</div>`;
let mixSel=[3,2],mixT=null,mixCur=null;
function setMix(){const a=Math.min(mixSel[0],mixSel[1]),b=Math.max(mixSel[0],mixSel[1]),m=MIX[''+a+b];
  mixT=[...h2r(m[4]),...h2r(m[5]),...h2r(m[6]),...m[7],...m[8],m[9]];if(!mixCur)mixCur=mixT.slice();
  mp.style.setProperty('--c',m[6]);T[N-1].c=m[6];T[N-1].rgb=h2r(m[6]);T[N-1].d=m[0];T[N-1].k=m[1].toUpperCase();T[N-1].e=m[2];
  document.getElementById('mxe').textContent=(LANG==='hi'?T[a].d+'  +  '+T[b].d:T[a].k+'  +  '+T[b].k)+'  =';
  document.getElementById('mxd').textContent=m[0];
  document.getElementById('mxn').innerHTML=m[1].toUpperCase()+' <span>— '+m[2].toUpperCase()+'</span>';
  document.getElementById('mxl').textContent=m[3];
  mp.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',mixSel.includes(+c.dataset.i)));
  if(typeof active!=='undefined'&&active===N-1)document.body.style.setProperty('--accent',m[6]);}
mp.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{const i=+c.dataset.i;if(mixSel.includes(i))return;mixSel=[mixSel[1],i];setMix();});


/* -------------------------------------------------------------- engine */
const canvas=document.getElementById('gl');
const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'high-performance'});
const VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const progs=new Array(N).fill(null);
function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
function build(i){
  try{const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,VS));
    gl.attachShader(p,sh(gl.FRAGMENT_SHADER,COMMON+TODGL+SCENES[i]+MAIN));gl.bindAttribLocation(p,0,'a');gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
    progs[i]={p,res:gl.getUniformLocation(p,'uRes'),time:gl.getUniformLocation(p,'uTime'),
      mouse:gl.getUniformLocation(p,'uMouse'),alpha:gl.getUniformLocation(p,'uAlpha'),click:gl.getUniformLocation(p,'uClick'),vel:gl.getUniformLocation(p,'uVel'),tint:gl.getUniformLocation(p,'uTint'),hour:gl.getUniformLocation(p,'uHour'),drag:gl.getUniformLocation(p,'uDrag'),force:gl.getUniformLocation(p,'uForce'),c1:gl.getUniformLocation(p,'uC1'),c2:gl.getUniformLocation(p,'uC2'),c3:gl.getUniformLocation(p,'uC3'),P:gl.getUniformLocation(p,'uP'),P2:gl.getUniformLocation(p,'uP2'),rb:gl.getUniformLocation(p,'uRb')};
  }catch(e){console.error('Scene '+i+' ('+T[i].k+') failed:',e.message);progs[i]=false;}
}
if(gl){
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  let bi=0;(function next(){build(bi);if(bi===0){document.getElementById('load').style.opacity=0;
    setTimeout(()=>document.getElementById('load').remove(),1500);}
    if(++bi<N)setTimeout(next,30);})();
  canvas.addEventListener('webglcontextlost',e=>e.preventDefault());
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
}else{document.getElementById('load').innerHTML='<div>'+S.noGl+'</div>';}
document.querySelectorAll('header a,nav a').forEach(a=>{a.tabIndex=0;a.setAttribute('role','button');
  a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();a.click();}});});

const coarse=matchMedia('(pointer:coarse)').matches;
let scale=coarse?.5:.85,W=0,H=0,secH=1;
function resize(){const dpr=Math.min(devicePixelRatio||1,coarse?1.25:1.5);
  W=Math.max(2,Math.round(innerWidth*dpr*scale));H=Math.max(2,Math.round(innerHeight*dpr*scale));
  canvas.width=W;canvas.height=H;gl&&gl.viewport(0,0,W,H);
  secH=Math.max(1,innerHeight*1.7);document.getElementById('track').style.height=(secH*(N-1)+innerHeight*1.9)+'px';}
resize();
// a language switch reloads the page; carry on from the same scene
try{const y=sessionStorage.getItem('pt-y');if(y!==null){sessionStorage.removeItem('pt-y');scrollTo(0,y*secH);}
  else{const i=SLUG.indexOf(location.hash.slice(1));if(i>0)scrollTo(0,i*secH+secH*.12);}}catch(e){}   // or open at a shared scene

let mx=0,my=0,smx=0,smy=0,sy=scrollY,auto=false,ckx=0,cky=0,ckt=-100,vel=0,capReq=false,dhy=false,dhyT=0;
addEventListener('pointerdown',e=>{if(e.target.closest('a,button,#jn,#pr,#prb,#abt'))return;
  ckx=(e.clientX-innerWidth/2)/innerHeight;cky=(innerHeight/2-e.clientY)/innerHeight;ckt=performance.now()*.001;down=true;dtx=ckx;dty=cky;});
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.opacity=0,2600);}
let dtx=0,dty=0,dgx=0,dgy=0,force=0,mv=0,down=false;
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth*2-1;my=1-e.clientY/innerHeight*2;
  const nx=(e.clientX-innerWidth/2)/innerHeight,ny=(innerHeight/2-e.clientY)/innerHeight;
  mv=Math.min(1,mv+Math.hypot(nx-dtx,ny-dty)*4);dtx=nx;dty=ny;});
['pointerup','pointercancel','blur'].forEach(ev=>addEventListener(ev,()=>{down=false;}));
function go(i){scrollTo({top:i*secH+(i?secH*.12:0),behavior:'smooth'});}
const stopAuto=()=>{if(auto){auto=false;autoBtn.textContent=S.journey;}};
['wheel','touchstart','keydown'].forEach(ev=>addEventListener(ev,stopAuto,{passive:true}));
addEventListener('keydown',e=>{const cur=Math.round(scrollY/secH-.12);
  if(e.key==='ArrowRight'||e.key==='PageDown'){go(Math.min(N-1,cur+1));e.preventDefault();}
  if(e.key==='ArrowLeft'||e.key==='PageUp'){go(Math.max(0,cur-1));e.preventDefault();}
  const k=e.key.toLowerCase();if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(k==='h')togglePure();if(k==='f')toggleFull();if(k==='c')capReq=true;if(k==='d')toggleDhy();if(k==='k')toggleKn();if(k==='l')cycleTod();if(k==='p')document.body.classList.contains('pr')?closePr():openPr();
  if(e.key==='Escape'){document.body.classList.remove('pure','pr','ab');if(dhy)toggleDhy();}});
function togglePure(){if(document.body.classList.toggle('pure'))toast(S.pure);}
function toggleFull(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen().catch(()=>toast(S.noFs));}
function toggleDhy(){dhy=!dhy;dhyT=performance.now()*.001;if(!dhy&&sess)endSess(false);document.body.classList.toggle('dhyana',dhy);
  document.getElementById('dh').textContent=dhy?S.ret:S.dhyana;if(dhy){stopAuto();toast(S.follow);}}
const jn=document.getElementById('jn');let knI=-1;
function setKn(i){if(i===knI)return;knI=i;jn.classList.add('sw');document.getElementById('gd').textContent=KN[i][2];
  setTimeout(()=>{for(let k=0;k<3;k++)document.getElementById('jn'+k).textContent=KN[knI][k];jn.classList.remove('sw');},300);}
function toggleKn(){const on=document.body.classList.toggle('kn');try{localStorage.setItem('st-kn',on?'1':'0');}catch(e){}}
let knPref=null;try{knPref=localStorage.getItem('st-kn');}catch(e){}
if(knPref===null?innerWidth>=1100:knPref==='1')document.body.classList.add('kn');
document.getElementById('kn').onclick=document.getElementById('jnx').onclick=document.getElementById('jno').onclick=toggleKn;

const lg=document.getElementById('lg');lg.textContent=S.other;lg.lang=LANG==='hi'?'en':'hi';
lg.onclick=()=>{const l=LANG==='hi'?'en':'hi';try{localStorage.setItem('pt-lang',l);sessionStorage.setItem('pt-y',scrollY/secH);}catch(e){}
  location.search='?lang='+l;};
document.getElementById('dh').onclick=toggleDhy;document.getElementById('fs').onclick=toggleFull;
document.getElementById('cap').onclick=document.getElementById('cap2').onclick=()=>{capReq=true;};
document.getElementById('again').onclick=()=>go(0);
const autoBtn=document.getElementById('auto'),resBtn=document.getElementById('res');let journeyStarted=false,resOn=false;
// The header's Journey link is hidden on phones, so a paused journey gets its own button to carry on from where it stopped.
resBtn.onclick=()=>startAuto();
function startAuto(){auto=true;journeyStarted=true;autoBtn.textContent=S.pause;if(scrollY>secH*(N-1))scrollTo(0,0);}
autoBtn.onclick=()=>auto?stopAuto():startAuto();
document.getElementById('begin').onclick=()=>{startAuto();startSound();};

/* ambient drone + per-element soundscape */
let ac=null,out=null,oscs=[],sndOn=false,nf,ng,nl,nlg;
// filter type, frequency, Q, level, sway rate, sway depth
const NZ=[['lowpass',200,.5,0,.1,0],['lowpass',110,1,.9,.05,40],['lowpass',480,.7,.5,.11,330],['bandpass',1700,.5,.22,3.1,700],
 ['bandpass',520,1.4,.5,.17,330],['highpass',6000,.5,.04,.1,0],['bandpass',2600,7,.12,.07,1400],['bandpass',880,12,.1,.05,260],['lowpass',260,.6,.35,.06,120],['bandpass',700,1,.3,.09,300]];
const sndBtn=document.getElementById('snd');
function setScape(i){if(!ac)return;const z=NZ[i],t=ac.currentTime;nf.type=z[0];
  nf.frequency.setTargetAtTime(z[1],t,.7);nf.Q.setTargetAtTime(z[2],t,.7);ng.gain.setTargetAtTime(z[3]*.5,t,.7);
  nl.frequency.setTargetAtTime(z[4],t,.3);nlg.gain.setTargetAtTime(z[5],t,.7);
  oscs.forEach(([o,m])=>o.frequency.setTargetAtTime(T[i].f*m,t,.9));}
function startSound(){if(sndOn)return;sndOn=true;sndBtn.textContent=S.mute;
  if(!ac){ac=new (window.AudioContext||window.webkitAudioContext)();out=ac.createGain();out.gain.value=0;out.connect(ac.destination);
    const master=ac.createGain();master.gain.value=.11;
    const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;master.connect(lp);lp.connect(out);
    [[1,.5],[1.5,.22],[2.005,.18],[.5,.4],[3.01,.06]].forEach(([m,g])=>{const o=ac.createOscillator(),gn=ac.createGain();
      o.type='sine';o.frequency.value=T[0].f*m;gn.gain.value=g;o.connect(gn);gn.connect(master);o.start();oscs.push([o,m]);});
    const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=.13;lg.gain.value=.025;lfo.connect(lg);lg.connect(master.gain);lfo.start();
    const len=ac.sampleRate*3,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    const src=ac.createBufferSource();src.buffer=buf;src.loop=true;nf=ac.createBiquadFilter();ng=ac.createGain();ng.gain.value=0;
    src.connect(nf);nf.connect(ng);ng.connect(out);src.start();
    nl=ac.createOscillator();nlg=ac.createGain();nlg.gain.value=0;nl.connect(nlg);nlg.connect(nf.frequency);nl.start();}
  ac.resume();out.gain.setTargetAtTime(1,ac.currentTime,.8);setScape(Math.max(0,active));}
function stopSound(){sndOn=false;sndBtn.textContent=S.sound;out.gain.setTargetAtTime(0,ac.currentTime,.25);}
sndBtn.onclick=()=>sndOn?stopSound():startSound();

/* time of day: the outdoor scenes follow the visitor's clock, or a chosen hour */
const TOD=[null,6.3,12.5,17.85,23];   // live, dawn, noon, dusk, night
const liveHour=()=>{const d=new Date();return d.getHours()+d.getMinutes()/60;};
let todI=0,hourCur=liveHour();const todBtn=document.getElementById('tod');
function todLabel(){const d=new Date(),m=d.getMinutes();
  todBtn.textContent='◐ '+(todI?S.tod[todI]:S.tod[0]+' · '+d.getHours()+':'+(m<10?'0':'')+m);}
function cycleTod(){todI=(todI+1)%TOD.length;todLabel();toast(todI?S.todIs+S.tod[todI]:S.todLive);}
todBtn.onclick=cycleTod;todLabel();

/* daily practice: one element a day, a timed session, a streak kept on this device */
const tz=new Date().getTimezoneOffset()*6e4,dayN=Math.floor((Date.now()-tz)/864e5),dkey=n=>new Date(n*864e5).toISOString().slice(0,10);
const todayI=1+dayN%7;
let pd={days:{},sessions:0,minutes:0};try{const r=JSON.parse(localStorage.getItem('pt-practice'));if(r&&r.days)pd=r;}catch(e){}
let prMin=5,sess=null;
function streak(){let n=0,d=dayN;if(!pd.days[dkey(d)])d--;while(pd.days[dkey(d)]){n++;d--;}return n;}
function updTdb(){const n=streak();document.getElementById('tdb').textContent=pd.days[dkey(dayN)]?S.tdbDone(n):n?S.tdbStreak(n):S.tdb;}
function renderPr(done){const t=T[todayI],n=streak(),pr=document.getElementById('pr');pr.style.setProperty('--pc',t.c);
  let wk='';for(let d=dayN-6;d<=dayN;d++)wk+=`<span><i class="${pd.days[dkey(d)]?'d':''}${d===dayN?' t':''}"></i>${S.wd[new Date(d*864e5).getUTCDay()]}</span>`;
  const head=done?S.prDone:S.prToday+new Date().toLocaleDateString(S.loc,{weekday:'long',day:'numeric',month:'long'}).toUpperCase();
  const body=done?S.wellDone(T[1+(dayN+1)%7]):KN[todayI][2];
  pr.innerHTML=`<button id="prx" aria-label="Close">×</button><small>${head}</small><h3>${t.d}</h3><div class="nm">${t.k} — ${t.e.toUpperCase()}</div><p>${body}</p>
   ${done?'':`<div class="durs">${[3,5,10].map(m=>`<button class="dur${m===prMin?' on':''}" data-m="${m}">${m} ${S.min}</button>`).join('')}</div>
   <button id="prgo">${pd.days[dkey(dayN)]?S.prAgain:S.prBegin}</button>`}
   <div class="wk">${wk}</div><div class="st">${S.stats(n,pd.sessions,pd.minutes)}</div>
   <small class="nt">${S.saved}</small>`;
  document.getElementById('prx').onclick=closePr;
  if(!done){pr.querySelectorAll('.dur').forEach(b=>b.onclick=()=>{prMin=+b.dataset.m;renderPr();});document.getElementById('prgo').onclick=beginSess;}
  updTdb();}
function openPr(done){stopAuto();closeAb();renderPr(done===true);document.body.classList.add('pr');}
function closePr(){document.body.classList.remove('pr');}
function beginSess(){closePr();document.body.classList.remove('pure');scrollTo(0,todayI*secH+secH*.12);sy=scrollY;if(!dhy)toggleDhy();
  dhyT=performance.now()*.001;sess={end:dhyT+prMin*60,min:prMin};startSound();
  try{navigator.wakeLock&&navigator.wakeLock.request('screen').then(l=>{sess?sess.lock=l:l.release();}).catch(()=>{});}catch(e){}}
function endSess(done){const z=sess;sess=null;if(!z)return;if(z.lock)z.lock.release().catch(()=>{});
  if(done){const k=dkey(dayN);pd.days[k]=(pd.days[k]||0)+z.min;pd.sessions++;pd.minutes+=z.min;
    try{localStorage.setItem('pt-practice',JSON.stringify(pd));}catch(e){}
    bell();if(dhy)toggleDhy();openPr(true);}else toast(S.early);}
function bell(){if(!ac||!sndOn)return;const t=ac.currentTime;[[432,.22],[1192,.07],[2333,.03]].forEach(([f,g])=>{const o=ac.createOscillator(),gn=ac.createGain();
  o.frequency.value=f;gn.gain.setValueAtTime(g,t);gn.gain.exponentialRampToValueAtTime(.0001,t+5);o.connect(gn);gn.connect(ac.destination);o.start(t);o.stop(t+5.2);});}
document.getElementById('td').onclick=document.getElementById('tdb').onclick=()=>openPr();
document.getElementById('prb').onclick=()=>{closePr();closeAb();};updTdb();

/* share: the phone's own share sheet where there is one, otherwise the link is copied */
function share(){const i=Math.max(0,Math.min(N-1,Math.round(scrollY/secH-.2)))||0,url=location.href.split(/[?#]/)[0]+'?lang='+LANG+(i?'#'+SLUG[i]:'');
  const d={title:'Pancha Tattva',text:(i?T[i].d+' · ':'')+S.shareText,url};
  if(navigator.share)navigator.share(d).catch(()=>{});
  else if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>toast(S.copied),()=>toast(S.noCopy));else toast(S.noCopy);}
document.getElementById('shr').innerHTML='↗<span> '+S.share+'</span>';
document.getElementById('shr').onclick=document.getElementById('shr2').onclick=share;

/* about */
const abt=document.getElementById('abt');
abt.innerHTML=`<button id="abx" aria-label="Close">×</button><small>${S.abHead}</small><h3>पञ्च तत्त्व</h3><div class="nm">PANCHA TATTVA</div>
 ${S.abP.map(p=>`<p>${p}</p>`).join('')}<button id="abs">↗ ${S.share}</button>
 <a href="https://github.com/chauhannaveen/pancha-tattva" target="_blank" rel="noopener">${S.abSrc}</a><small class="nt">${S.abBy}</small>`;
function openAb(){stopAuto();closePr();document.body.classList.add('ab');}
function closeAb(){document.body.classList.remove('ab');}
document.getElementById('ab').onclick=openAb;document.getElementById('abx').onclick=closeAb;document.getElementById('abs').onclick=share;

const ss=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x);};
const bar=document.getElementById('bar'),hint=document.getElementById('hint');
function draw(i,alpha,time){const s=progs[i];if(!s)return;gl.useProgram(s.p);
  gl.uniform2f(s.res,W,H);gl.uniform1f(s.time,time);gl.uniform2f(s.mouse,smx,smy);gl.uniform1f(s.alpha,alpha);gl.uniform3f(s.click,ckx,cky,time-ckt);gl.uniform1f(s.vel,vel);gl.uniform3fv(s.tint,T[i].rgb);gl.uniform2f(s.drag,dgx,dgy);gl.uniform1f(s.hour,hourCur);gl.uniform1f(s.force,force);if(s.c1){const m=mixCur;gl.uniform3f(s.c1,m[0],m[1],m[2]);gl.uniform3f(s.c2,m[3],m[4],m[5]);gl.uniform3f(s.c3,m[6],m[7],m[8]);gl.uniform4f(s.P,m[9],m[10],m[11],m[12]);gl.uniform4f(s.P2,m[13],m[14],m[15],m[16]);gl.uniform1f(s.rb,m[17]);}
  gl.drawArrays(gl.TRIANGLES,0,3);}
function render(idx,blend,time){gl.disable(gl.BLEND);
  if(progs[idx])draw(idx,1,time);else{gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);}
  if(blend>.001&&progs[idx+1]){gl.enable(gl.BLEND);draw(idx+1,blend,time);}}
function doCapture(idx,blend,time){const cw=Math.min(2560,Math.round(innerWidth*2)),ch=Math.round(cw*innerHeight/innerWidth);
  canvas.width=W=cw;canvas.height=H=ch;gl.viewport(0,0,W,H);render(idx,blend,time);
  const c2=document.createElement('canvas');c2.width=cw;c2.height=ch;const x=c2.getContext('2d');x.drawImage(canvas,0,0);
  const t=T[Math.max(0,active)],u=ch/100;x.shadowColor='rgba(0,0,0,.7)';x.shadowBlur=3*u;x.fillStyle='#fff';
  x.font=`${17*u}px 'Tiro Devanagari Sanskrit','Nirmala UI',serif`;x.fillText(t.d,7*u,78*u);
  x.font=`${2.6*u}px Cinzel,Mukta,'Nirmala UI',serif`;try{x.letterSpacing=`${(LANG==='hi'?.3:1.1)*u}px`;}catch(e){}
  x.fillText(t.k+(t.e?'  —  '+t.e.toUpperCase():''),7.4*u,85.5*u);
  x.font=`${1.3*u}px Cinzel,serif`;x.globalAlpha=.75;x.fillText('PANCHA TATTVA  ·  THE FIVE ELEMENTS AND BEYOND',7.4*u,7*u);
  c2.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='pancha-tattva-'+t.k.toLowerCase()+'.png';
    document.body.appendChild(a);a.click();a.remove();toast(S.imgSaved+cw+' × '+ch);},'image/png');
  resize();last=performance.now();}
const ring=document.getElementById('ring'),btxt=document.getElementById('btxt'),bj=document.getElementById('bj');
let last=performance.now(),ema=16,fc=0,active=-1;let lastIH=innerHeight,lastIW=innerWidth;
function frame(now){requestAnimationFrame(frame);
  if(innerWidth!==lastIW||Math.abs(innerHeight-lastIH)>130){lastIH=innerHeight;lastIW=innerWidth;resize();sy=scrollY;}
  const dt=Math.min(100,now-last);last=now;ema+=(dt-ema)*.08;
  if(++fc%40===0){let ns=scale;if(ema>24)ns=Math.max(.3,scale*.85);else if(ema<13.5)ns=Math.min(1,scale*1.08);
    if(ns!==scale){scale=ns;resize();}}
  if(auto){scrollBy(0,secH*dt/11000);if(scrollY>=document.documentElement.scrollHeight-innerHeight-2)stopAuto();}
  sy+=(scrollY-sy)*Math.min(1,dt*.006);smx+=(mx-smx)*.04;smy+=(my-smy)*.04;
  {const ht=todI?TOD[todI]:liveHour(),dh=((ht-hourCur+36)%24)-12;hourCur=(hourCur+dh*Math.min(1,dt*.0025)+24)%24;if(!todI&&fc%240===0)todLabel();}
  mv*=.95;force+=((down?1:Math.min(.75,mv))-force)*.07;dgx+=(dtx-dgx)*.12;dgy+=(dty-dgy)*.12;
  for(let i=0;i<18;i++)mixCur[i]+=(mixT[i]-mixCur[i])*.06;
  const pos=Math.max(0,Math.min(N-1+.6,sy/secH)),idx=Math.min(N-1,Math.floor(pos)),f=pos-idx;
  const blend=idx<N-1?ss(.7,1,f):0,time=now*.001;
  vel+=(Math.max(-1,Math.min(1,(scrollY-sy)/secH*2.2))-vel)*.1;if(!isFinite(vel))vel=0;if(!isFinite(sy))sy=scrollY;
  if(gl){if(capReq){capReq=false;doCapture(idx,blend,time);}render(idx,blend,time);}
  if(dhy){const c=(time-dhyT)%14;let b,tx;if(c<4){b=c/4;tx=S.breath[0];}else if(c<8){b=1;tx=S.breath[1];}else{b=1-(c-8)/6;tx=S.breath[2];}
    if(sess){const r=sess.end-time;if(r<=0)endSess(true);else{const m=Math.floor(r/60),sc=Math.floor(r%60);tx+='  ·  '+m+':'+(sc<10?'0':'')+sc;}}
    b=b*b*(3-2*b);ring.style.transform=`scale(${.45+.55*b})`;if(btxt.textContent!==tx)btxt.textContent=tx;}
  panels.forEach((el,i)=>{const d=pos-i;const o=ss(-.22,-.03,d)*(1-ss(.46,.68,d))*(i===N-1&&d>0?1:1);
    const op=i===N-1?ss(-.22,-.03,d):o;
    if(op<.002){if(el.style.visibility!=='hidden')el.style.visibility='hidden';return;}
    el.style.visibility='visible';el.style.opacity=op;
    el.style.transform=`translateY(${(.2-d)*70}px)`;el.style.filter=op<.98?`blur(${(1-op)*14}px)`:'none';});
  const cur=Math.max(0,Math.min(N-1,Math.round(pos-.2)))||0;
  if(cur!==active){active=cur;dots.forEach((d,i)=>d.classList.toggle('on',i===cur));
    document.body.style.setProperty('--accent',T[cur].c);bj.textContent=T[cur].b;setKn(cur);if(sndOn)setScape(cur);}
  {const show=!auto&&pos>.25&&pos<N-1.05&&(journeyStarted||innerWidth<=700);
    if(show!==resOn){resOn=show;resBtn.textContent=journeyStarted?S.resume:S.play;resBtn.classList.toggle('on',show);}}
  bar.style.transform=`scaleX(${Math.min(1,pos/(N-1))})`;hint.style.opacity=pos<.25?.7:0;
}
setMix();
requestAnimationFrame(frame);

/* offline support and install-to-home-screen; needs a real web address, so it is skipped for files opened from disk */
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
