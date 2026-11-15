/* The GPU programs that draw each scene. COMMON and MAIN wrap every scene;
   TODGL holds the shared time-of-day lighting used by earth, water and air. */

/* ------------------------------------------------------------- shaders */
const COMMON=`
precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uAlpha;uniform vec3 uClick;uniform float uVel;uniform vec3 uTint;uniform vec2 uDrag;uniform float uForce;
const mat2 m2=mat2(.8,-.6,.6,.8);
float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*noise(p);p=m2*p*2.02;a*=.5;}return s;}
float hash3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(hash3(i),hash3(i+vec3(1.,0.,0.)),f.x),mix(hash3(i+vec3(0.,1.,0.)),hash3(i+vec3(1.,1.,0.)),f.x),f.y),
            mix(mix(hash3(i+vec3(0.,0.,1.)),hash3(i+vec3(1.,0.,1.)),f.x),mix(hash3(i+vec3(0.,1.,1.)),hash3(i+vec3(1.,1.,1.)),f.x),f.y),f.z);}
float fbm3(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*noise3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
float stars(vec2 uv,float sc){vec2 g=uv*sc;vec2 i=floor(g),f=fract(g)-.5;float h=hash(i);
 vec2 o=vec2(hash(i+3.1),hash(i+7.7))-.5;float d=length(f-o*.7);
 float tw=.6+.4*sin(uTime*(1.+h*3.)+h*40.);return step(.8,h)*tw*(1.-smoothstep(0.,.07,d))*(.4+h);}
`;
const TODGL=`
uniform float uHour;
vec3 gL,gLc,gZen,gHor,gGlow,gDisc,gAmb,gCloud;float gNight,gDusk,gDay;
// azm/aze: sun compass direction (x,z) at sunrise and sunset; el: how high it climbs; moon: night light direction
void tod(vec2 azm,vec2 aze,float el,vec3 moon){
 float se=-cos(uHour/24.*6.2831);float k=clamp((uHour-6.)/12.,0.,1.);
 gDay=smoothstep(-.2,.15,se);gNight=1.-smoothstep(-.3,0.,se);gDusk=exp(-se*se*12.)*(1.-gNight*.6);
 float sunI=smoothstep(-.03,.2,se),moonI=1.-smoothstep(-.3,-.12,se);
 vec2 az=mix(azm,aze,k);
 if(se>-.12){gL=normalize(vec3(az.x,max(se,0.)*el+.045,az.y));
  gLc=mix(vec3(1.7,.62,.25),vec3(1.65,1.3,.95),smoothstep(0.,.45,se))*sunI;
  gGlow=mix(vec3(1.,.4,.14),vec3(1.,.68,.38),smoothstep(0.,.4,se))*(sunI*.8+gDusk*.6*smoothstep(-.12,-.02,se));
  gDisc=vec3(1.,.9,.7)*(sunI+.35*smoothstep(-.12,-.02,se));}
 else{gL=normalize(moon);gLc=vec3(.42,.56,.95)*.3*moonI;gGlow=vec3(.4,.5,.85)*.3*moonI;gDisc=vec3(.9,.95,1.)*.7*moonI;}
 gZen=mix(vec3(.006,.012,.04),vec3(.1,.3,.72),gDay);gZen=mix(gZen,vec3(.13,.15,.4),gDusk*.8);
 gHor=mix(vec3(.025,.04,.09),vec3(.6,.74,.92),gDay);gHor=mix(gHor,vec3(1.,.46,.16),gDusk*.95);
 gAmb=mix(vec3(.02,.035,.075),vec3(.26,.32,.44),gDay)+gDusk*vec3(.08,.04,.03);
 gCloud=mix(vec3(.07,.08,.13),vec3(1.,.94,.87),gDay);gCloud=mix(gCloud,vec3(1.,.55,.36),gDusk*.65);}
`;
const MAIN=`
void main(){vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;vec2 p0=p;
 p*=1.-uVel*.13;
 vec2 dc=p-uClick.xy;float dl=length(dc);float w=dl-uClick.z*.85;float fade=exp(-uClick.z*1.5);
 float rip=sin(w*36.)*exp(-w*w*55.)*fade;p+=dc/(dl+1e-4)*rip*.04;
 vec3 col=scene(p);
 col+=uTint*exp(-w*w*500.)*fade*.9+uTint*exp(-dl*dl*30.)*exp(-uClick.z*5.)*.6;p=p0;
 col=aces(col);col=pow(col,vec3(.4545));
 vec2 q=gl_FragCoord.xy/uRes;col*=.3+.7*pow(16.*q.x*q.y*(1.-q.x)*(1.-q.y),.2);
 col+=(hash(gl_FragCoord.xy+fract(uTime)*91.)-.5)/128.;
 float m=fbm(p*3.+11.);gl_FragColor=vec4(col,smoothstep(m*.6,m*.6+.4,uAlpha));}
`;
const SCENES=[
/* 0 — ORIGIN: seven lights */`
vec3 hue(float t){return .55+.45*cos(6.2831*(t*.8+vec3(0.,.33,.67)));}
vec3 scene(vec2 p){float t=uTime;p+=uMouse*.03;float r=length(p);
 vec3 col=vec3(.006,.004,.014);
 vec2 q=p*1.6;float n=fbm(q+vec2(fbm(q*2.+t*.04),fbm(q*2.-t*.03+3.))*1.6);
 col+=vec3(.22,.09,.42)*n*n*n*1.5*(1.-smoothstep(0.,1.1,r));
 col+=vec3(.05,.12,.3)*pow(fbm(q*2.5-n+5.),3.)*1.5;
 col+=vec3(stars(p,26.)+stars(p+7.,55.)*.6);
 for(int i=0;i<7;i++){float fi=float(i);float a=fi/7.*6.2831+t*.22;
  float rad=.36+.025*sin(t*.8+fi*2.);vec2 c=vec2(cos(a)*rad,sin(a)*rad*.38+.02*sin(t+fi));
  float depth=.75+.25*sin(a);float d=length(p-c);vec3 h=hue(fi/7.);
  col+=h*(.0016*depth/(d*d+.00035));col+=h*exp(-d*9.)*.12*depth;}
 float ring=abs(length(p*vec2(1.,2.63))-.36);col+=vec3(.6,.5,1.)*.0012/(ring+.004);
 col+=vec3(1.,.92,.8)*.0022/(r*r+.004)*(1.+.15*sin(t*1.7));
 float a0=atan(p.y,p.x);col+=vec3(.8,.7,1.)*pow(.5+.5*cos(a0*14.+t*.3),10.)*exp(-r*6.)*.12;
 vec2 od=p-uDrag;col+=uTint*.003/(dot(od,od)+.003)*uForce;
 return col;}
`,
/* 1 — PRITHVI: raymarched mountains */`
vec3 noised(vec2 x){vec2 i=floor(x),f=fract(x);vec2 u=f*f*(3.-2.*f),du=6.*f*(1.-f);
 float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
 return vec3(a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y,du*(vec2(b-a,c-a)+(a-b-c+d)*u.yx));}
#define TERR(name,NO) float name(vec2 x){vec2 p=x*.25;float a=0.,b=1.;vec2 d=vec2(0.);for(int i=0;i<NO;i++){vec3 n=noised(p);d+=n.yz;a+=b*n.x/(1.+dot(d,d));b*=.5;p=m2*p*2.;}return a*3.;}
TERR(terrL,3)
TERR(terrM,7)
TERR(terrH,11)
vec3 sunD;
vec3 sky(vec3 rd){float s=max(dot(rd,sunD),0.);float y=max(rd.y,0.);
 vec3 c=mix(gHor,gZen,pow(y,.5));
 vec2 su=rd.xz/(rd.y+.35);c+=vec3(stars(su,42.)+stars(su+3.,85.)*.6)*gNight*smoothstep(0.,.2,rd.y);
 c+=gGlow*pow(s,6.)*.4;c+=gDisc*pow(s,500.)*6.;
 vec2 cu=rd.xz/(rd.y+.2)*1.3;float cl=smoothstep(.48,.9,fbm(cu+uTime*.015));
 c=mix(c,gCloud*(1.+pow(s,4.)),cl*.6*smoothstep(0.,.25,rd.y));return c;}
vec3 scene(vec2 p){float t=uTime*.32;vec3 ro=vec3(t*.7,0.,t);
 tod(vec2(-.6,.75),vec2(.75,.6),.95,vec3(-.4,.5,.7));vec3 sd=gL+vec3(uDrag.x*.9,uDrag.y*.5,0.)*uForce;sd.y=max(sd.y,.04);sunD=normalize(sd);
 vec3 fw=normalize(vec3(.7+uMouse.x*.5,-.17+uMouse.y*.2,1.));
 ro.y=max(3.5,max(terrL(ro.xz),max(terrL(ro.xz+fw.xz*2.5),terrL(ro.xz+fw.xz*5.)))+1.3);
 vec3 rt=normalize(cross(vec3(0.,1.,0.),fw)),up=cross(fw,rt);
 vec3 rd=normalize(p.x*rt+p.y*up+1.25*fw);
 vec3 col=sky(rd);float tt=.2,hit=-1.;
 for(int i=0;i<100;i++){vec3 pos=ro+rd*tt;float h=pos.y-terrM(pos.xz);
  if(h<.0015*tt){hit=tt;break;}if(tt>45.)break;tt+=.42*h;}
 if(hit>0.){vec3 pos=ro+rd*hit;float e=.0015*hit+.001;
  vec3 n=normalize(vec3(terrH(pos.xz-vec2(e,0.))-terrH(pos.xz+vec2(e,0.)),2.*e,terrH(pos.xz-vec2(0.,e))-terrH(pos.xz+vec2(0.,e))));
  float sh=1.,st=.08;for(int i=0;i<22;i++){vec3 sp=pos+sunD*st;float h=sp.y-terrM(sp.xz);sh=min(sh,10.*h/st);if(sh<.01)break;st+=max(.08,h);}
  sh=clamp(sh,0.,1.);
  float gr=noise(pos.xz*14.);float strat=noise(vec2(pos.y*18.+gr,pos.x*.5));
  vec3 mat=mix(vec3(.11,.09,.075),vec3(.24,.19,.14),strat);
  mat=mix(mat,vec3(.06,.11,.035)*(0.7+gr*.6),smoothstep(.72,.9,n.y)*(1.-smoothstep(1.5,2.6,pos.y)));
  float sn=smoothstep(.5,.78,n.y)*smoothstep(2.3,3.1,pos.y+fbm(pos.xz*2.)*.8);
  mat=mix(mat,vec3(.85,.88,.95),sn);
  float dif=max(dot(n,sunD),0.)*sh;float amb=.5+.5*n.y;
  float bac=max(dot(n,normalize(vec3(-sunD.x,0.,-sunD.z))),0.);
  vec3 lin=dif*gLc*2.6+amb*gAmb*.55+bac*gLc*.07;
  vec3 hf=normalize(sunD-rd);lin+=sn*pow(max(dot(n,hf),0.),32.)*sh*1.5*min(gLc.g,1.);
  vec3 c=mat*lin;float s=max(dot(rd,sunD),0.);
  vec3 fogc=mix(mix(gHor,gZen,.35)*.85,gHor+gGlow*.35,pow(s,3.));
  float fa=1.-exp(-.0022*hit*hit);fa=max(fa,(1.-exp(-hit*.05))*(1.-smoothstep(.4,2.2,pos.y))*.55);
  col=mix(c,fogc,fa);}
 col+=gGlow*pow(max(dot(rd,sunD),0.),10.)*.18;
 return col;}
`,
/* 2 — JALA: open ocean */`
vec3 sunW;
vec3 skyW(vec3 rd){float y=max(rd.y,0.);float s=max(dot(rd,sunW),0.);
 vec3 c=mix(gHor,gZen,pow(y,.42));c=mix(c,gZen*.35,smoothstep(.25,1.,y));
 vec2 su=rd.xz/(rd.y+.35);c+=vec3(stars(su,42.)+stars(su+3.,85.)*.6)*gNight*smoothstep(0.,.15,rd.y);
 c+=gGlow*pow(s,10.)*.35;c+=gGlow*pow(s,160.)*.6;c+=gDisc*pow(s,1400.)*14.;float dd=gDay*(1.-gDusk);
 vec2 cu=rd.xz/(rd.y+.1);float cl=smoothstep(.42,.95,fbm(cu*.7+vec2(uTime*.008,0.)));
 c=mix(c,gCloud*(mix(.3,.95,dd)+1.3*pow(s,2.5)*(1.-dd*.6))+gZen*.25,cl*mix(.75,.4,dd)*smoothstep(0.,.18,rd.y));return c;}
#define WAVES(name,NO) float name(vec2 p){float ang=0.,f=1.,w=1.,sum=0.,ws=0.,sp=1.5;for(int i=0;i<NO;i++){vec2 d=vec2(sin(ang),cos(ang));float x=dot(d,p)*f+uTime*sp;float wv=exp(sin(x)-1.);float dx=wv*cos(x);p-=d*dx*w*.3;sum+=wv*w;ws+=w;w*=.81;f*=1.18;sp*=1.07;ang+=1232.4;}return sum/ws;}
WAVES(wavM,10)
WAVES(wavH,26)
const float D=1.1;
vec3 scene(vec2 p){tod(vec2(.25,.97),vec2(0.,.995),.85,vec3(.05,.3,.95));sunW=gL;vec3 ro=vec3(0.,1.35,uTime*.5);
 vec3 rd=normalize(vec3(p.x+uMouse.x*.25,p.y-.06+uMouse.y*.08,1.35));
 if(rd.y>=0.)return skyW(rd);
 float tt=-(ro.y)/rd.y;vec3 pos;float h=0.;
 for(int i=0;i<44;i++){pos=ro+rd*tt;h=wavM(pos.xz*.55)*D-D;float d=pos.y-h;
  if(d<.008*max(1.,tt*.06))break;tt+=d/max(-rd.y,.09)*.55;}
 float e=max(.012,.0025*tt);vec2 x=pos.xz;
 float hc=wavH(x*.55);
 vec3 n=normalize(vec3((wavH((x-vec2(e,0.))*.55)-wavH((x+vec2(e,0.))*.55))*D,2.*e,(wavH((x-vec2(0.,e))*.55)-wavH((x+vec2(0.,e))*.55))*D));
 n=normalize(mix(n,vec3(0.,1.,0.),smoothstep(10.,160.,tt)*.82));
 vec3 rm=normalize(vec3(uDrag.x+uMouse.x*.25,min(uDrag.y-.06+uMouse.y*.08,-.04),1.35));vec2 hp=ro.xz+rm.xz*(ro.y+D*.5)/(-rm.y);
 vec2 dv=pos.xz-hp;float dq=length(dv);n=normalize(n+vec3(dv.x,0.,dv.y)/(dq+.05)*cos(dq*5.-uTime*7.)*exp(-dq*.3)*uForce*.6);
 float F=.03+.97*pow(1.-max(dot(n,-rd),0.),5.);
 vec3 rf=reflect(rd,n);rf.y=abs(rf.y)+.002;rf=normalize(rf);
 vec3 deep=mix(vec3(.002,.01,.022),vec3(.008,.08,.15),gDay);deep=mix(deep,vec3(.006,.045,.075),gDusk);vec3 sss=vec3(.03,.32,.3)*pow(hc,3.)*.55*(.12+.88*gDay);
 sss+=gGlow*pow(hc,4.)*pow(max(dot(rd,sunW),0.),4.)*.5;
 vec3 col=F*skyW(rf)+(1.-F)*(deep+sss);
 vec3 hz=skyW(normalize(vec3(rd.x,.004,rd.z)));
 col=mix(col,hz,1.-exp(-tt*.0022));return col;}
`,
/* 3 — AGNI: living flame */`
vec3 scene(vec2 p){float t=uTime;vec2 q=p;q.x+=uMouse.x*.04;float y=q.y+.5;
 vec3 w=vec3(q.x*2.3,q.y*1.55-t*1.5,t*.33);
 float wr=fbm3(w*.8+vec3(0.,0.,5.));w.x+=(wr-.5)*1.5*(.35+y);
 float n=fbm3(w*1.25);float n2=fbm3(w*3.3+vec3(3.,-t*1.1,0.));
 float lick=.14*sin(q.x*2.6+t*.6)+.1*sin(q.x*5.7-t*.9);
 float fx=q.x-uDrag.x;float shape=.86-y*1.18+lick-.16*q.x*q.x+uForce*.6*exp(-fx*fx*9.);
 float v=shape+(n*.72+n2*.28-.5)*1.75;float c=clamp(v,0.,1.);
 vec3 col=vec3(.07,.012,.0)*max(1.25-y,0.)+vec3(.02,.004,.0);
 col+=vec3(1.,.2,.02)*pow(c,1.5)*2.4;col+=vec3(1.,.62,.14)*pow(c,3.2)*3.2;col+=vec3(1.,.95,.8)*pow(c,10.)*1.2;
 col+=vec3(.12,.3,1.)*pow(clamp(1.-y*5.,0.,1.),2.)*c*.35;
 float smk=fbm3(vec3(q.x*1.6+wr,q.y*1.2-t*.35,t*.1));
 col+=vec3(.07,.045,.035)*smk*smoothstep(.25,1.,y)*(1.-c);
 float em=0.;for(int k=0;k<4;k++){float fk=float(k);float sc=8.+fk*7.;
  vec2 g=vec2(q.x*sc,(q.y-t*(.22+.09*fk))*sc);g.x+=sin(g.y*.45+fk*2.1+t*.7)*.9;
  vec2 id=floor(g),f=fract(g)-.5;float h=hash(id+fk*17.);vec2 o=(vec2(hash(id+1.3),hash(id+5.9))-.5)*.7;
  float d=length(f-o);
  em+=step(.72,h)*(1.-smoothstep(0.,.05+.05*h,d))*(.45+.55*sin(t*5.*h+h*30.))*(1.-smoothstep(.2,1.25,y+h*.3));}
 col+=vec3(1.,.52,.12)*em*3.;
 col+=vec3(1.,.3,.05)*.1*exp(-y*2.2)*(1.+.3*sin(t*9.)*noise(vec2(t*3.,0.)));
 return col;}
`,
/* 4 — VAYU: flight through volumetric cloud */`
vec3 sunA;
float mapC(vec3 p){vec3 q=p*.21;q.x+=uTime*.035;q.y*=1.5;float f=fbm3(q)+.05*noise3(q*11.)-.025;
 float hg=(p.y+.1)/2.6;return clamp(f*4.6-2.45-hg*hg,0.,1.);}
vec3 scene(vec2 p){tod(vec2(.5,.8),vec2(-.45,.85),.8,vec3(.4975,.3482,.7947));sunA=gL;vec3 ro=vec3(sin(uTime*.07)*1.5,.5,uTime*1.3);
 vec3 rd=normalize(vec3(p.x+uMouse.x*.3,p.y+.03+uMouse.y*.15,1.2));
 float s=max(dot(rd,sunA),0.);
 vec3 bg=mix(mix(gHor,gZen,.45),gZen*.75,pow(max(rd.y+.1,0.),.5));
 bg=mix(bg,gHor,(1.-smoothstep(-.35,.02,rd.y))*.3);
 vec2 su=rd.xy/(rd.z+.3)*1.2;bg+=vec3(stars(su,36.)+stars(su+4.,70.)*.6)*gNight;
 bg+=gGlow*pow(s,14.)*.3+gDisc*pow(s,300.)*5.;
 vec3 rm=normalize(vec3(uDrag.x+uMouse.x*.3,uDrag.y+.03+uMouse.y*.15,1.2));
 vec4 sum=vec4(0.);float tt=.25+hash(p*uRes.y+fract(uTime)*37.)*.35;
 for(int i=0;i<64;i++){if(sum.a>.985)break;vec3 pos=ro+rd*tt;float den=mapC(pos);vec3 cr=cross(pos-ro,rm);den*=1.-uForce*exp(-dot(cr,cr)*.8);
  if(den>.008){float od=mapC(pos+.35*sunA)+mapC(pos+.9*sunA)*1.4+mapC(pos+1.8*sunA)*1.8;float shd=exp(-od*1.5);
   vec3 lin=gAmb*1.1*(.75+.25*clamp(pos.y*.4+.5,0.,1.))+gLc*shd*1.3;
   vec3 c=lin*mix(1.,.8,den);
   c+=gGlow*pow(s,5.)*(1.-den)*.6;
   c=mix(c,bg,1.-exp(-.0016*tt*tt));float a=clamp(den*.9,0.,1.);sum.rgb+=c*a*(1.-sum.a);sum.a+=a*(1.-sum.a);}
  tt+=max(.13,.07*tt);}
 vec3 col=bg*(1.-sum.a)+sum.rgb;
 col+=gGlow*pow(s,24.)*.2;return col*.9;}
`,
/* 5 — AKASHA: deep space */`
vec3 scene(vec2 p){float t=uTime;vec2 q=p+uMouse*.04;vec2 ld=q-uDrag;q-=ld*uForce*.03/(dot(ld,ld)+.03);
 float ca=cos(t*.015),sa=sin(t*.015);vec2 u=mat2(ca,-sa,sa,ca)*q;
 vec3 col=vec3(.003,.004,.011);
 vec2 w=u*1.5;float n1=fbm(w+vec2(fbm(w*1.7+t*.02),fbm(w*1.7-t*.015+4.))*1.5);
 float n2=fbm(w*2.2+9.+n1*1.3);
 col+=vec3(.42,.08,.55)*pow(n1,3.)*2.2;col+=vec3(.04,.3,.65)*pow(n2,3.)*1.7;
 col+=vec3(1.,.35,.2)*pow(n1*n2,2.2)*4.;
 float dark=fbm(w*3.+20.);col*=.45+.9*dark;
 vec2 g=u-vec2(.34,.12);g=mat2(.82,.57,-.57,.82)*g;g.y*=2.5;float r=length(g),a=atan(g.y,g.x);
 float arms=.5+.5*cos(a*2.-log(r+.002)*5.5+t*.12);float dust=fbm(g*11.+3.);
 float gal=exp(-r*5.2)*(pow(arms,2.2)*(.35+dust*1.3)*1.5+.12);
 col+=mix(vec3(.45,.6,1.),vec3(1.,.8,.6),exp(-r*8.))*gal*1.9;col+=vec3(1.,.9,.75)*exp(-r*30.)*3.;
 col+=vec3(1.,.5,.6)*pow(arms,6.)*step(.86,noise(g*40.))*exp(-r*5.)*1.5;
 for(int k=0;k<4;k++){float fk=float(k);float st=stars(u*(1.+fk*.01)+fk*13.7,16.+fk*24.);
  col+=st*mix(vec3(.7,.8,1.),vec3(1.,.85,.7),hash(vec2(fk,3.)))*(1.6-fk*.3);}
 vec2 pc=q-vec2(-.62,-.42);float pr=.36;float d=length(pc);vec3 L=normalize(vec3(.75,.55,.3));
 if(d<pr){vec3 nn=vec3(pc/pr,sqrt(max(1.-d*d/(pr*pr),0.)));float dif=max(dot(nn,L),0.);
  float lon=atan(nn.x,nn.z)+t*.03;vec2 sv=vec2(lon*2.,nn.y*3.);
  float land=fbm(sv*1.6+fbm(sv*3.)*.8);float cl=smoothstep(.5,.75,fbm(sv*2.5+vec2(t*.02,7.)));
  vec3 sf=mix(vec3(.02,.09,.25),vec3(.12,.2,.08),smoothstep(.5,.56,land));
  sf=mix(sf,vec3(.3,.24,.16),smoothstep(.62,.75,land));sf=mix(sf,vec3(.9),cl*.85);
  vec3 pcx=sf*dif*1.7;pcx+=vec3(.3,.55,1.)*pow(1.-nn.z,2.5)*(dif+.06)*1.6;
  pcx+=vec3(1.,.7,.3)*step(.6,land)*step(.9,noise(sv*30.))*(1.-smoothstep(0.,.12,dif))*.5;
  col=mix(col,pcx,1.-smoothstep(pr-.004,pr,d));}
 float lit=max(dot(normalize(pc),L.xy),0.);
 col+=vec3(.25,.5,1.)*exp(-max(d-pr,0.)*38.)*(.08+lit*.75)*step(pr-.004,d);
 float sh=fract(t*.11);vec2 sp=vec2(1.1,.6)-vec2(1.9,.7)*sh-floor(t*.11)*0.;vec2 dv=q-sp;
 float along=dot(dv,normalize(vec2(1.9,.7)));float perp=length(dv-along*normalize(vec2(1.9,.7)));
 col+=vec3(.9,.95,1.)*(1.-smoothstep(0.,.0035,perp))*smoothstep(.0,.02,along)*(1.-smoothstep(0.,.3,along))*step(sh,.5)*1.5;
 return col;}
`,
/* 6 — JYOTI: aurora over still water */`
float aur(vec2 p){float t=uTime*.1;p+=vec2(fbm(p*.4+t),fbm(p*.4-t+5.))*2.4;
 float v=sin(p.x*1.25+noise(p*.9+t)*5.);return pow(1.-abs(v),6.)*(.25+.75*noise(p*.55-t));}
vec3 skyL(vec3 rd){vec3 col=mix(vec3(.012,.03,.07),vec3(.0,.004,.02),clamp(rd.y*1.4,0.,1.));
 vec2 uv=rd.xz/(rd.y+.45);col+=vec3(stars(uv,34.)+stars(uv+5.,70.)*.7)*smoothstep(0.,.2,rd.y);
 float mw=fbm(uv*2.+vec2(uv.y*1.5,0.));col+=vec3(.12,.1,.2)*pow(mw,3.)*smoothstep(0.,.4,rd.y);
 vec3 acc=vec3(0.);for(int i=0;i<30;i++){float fi=float(i)/30.;float h=1.1+fi*1.9;float tt=h/max(rd.y,.04);
  vec2 pt=(rd*tt).xz+vec2(0.,uTime*.04);float a=aur(pt*.33);
  vec3 c=mix(vec3(.08,1.,.42),vec3(.25,.45,1.),smoothstep(.15,.7,fi));c=mix(c,vec3(.95,.2,.75),smoothstep(.6,1.,fi)*.8);
  acc+=c*a*exp(-fi*1.7)/(1.+tt*tt*.0035);}
 float ax=rd.x-uDrag.x*.9;col+=acc*.3*(1.+uForce*2.5*exp(-ax*ax*5.))*smoothstep(0.,.12,rd.y);return col;}
vec3 scene(vec2 p){vec3 rd=normalize(vec3(p.x+uMouse.x*.2,p.y+.27+uMouse.y*.06,1.05));
 float refl=0.;if(rd.y<0.){refl=1.;float dp=-rd.y;
  float rp=noise(vec2(p.x*7./(dp+.08),38./(dp+.06)+uTime*.9))-.5;rd.y=dp+abs(rp)*.035*dp*4.;rd.x+=rp*.05*(dp*3.+.1);rd=normalize(rd);}
 vec3 col=skyL(rd);
 float ang=atan(rd.x,rd.z);float mh=.015+.16*pow(fbm(vec2(ang*3.5+2.,1.)),1.6)+.02*noise(vec2(ang*40.,3.));
 float mk=smoothstep(mh,mh+.004,rd.y);
 vec3 mcol=vec3(.004,.008,.014)+vec3(.0,.03,.02)*smoothstep(.0,mh,rd.y)*.4;
 mcol=mix(mcol,vec3(.1,.13,.16),smoothstep(mh*.62,mh,rd.y)*step(.11,mh)*.5);
 col=mix(mcol,col,mk);
 if(refl>.5){col=col*.62+vec3(.0,.008,.014);}
 return col*1.25;}
`,
/* 7 — CHETANA: the thousand-petalled lotus */`
vec3 scene(vec2 p){float t=uTime*.22;vec2 q=(p-uDrag*uForce*.6)*(1.1+.07*sin(t*1.3))+uMouse*.025;
 float r=length(q),a0=atan(q.y,q.x);
 float seg=6.2831/12.;float a=mod(a0+t*.12,seg);a=abs(a-seg*.5);vec2 zz=vec2(cos(a),sin(a))*r*1.35;
 float acc=0.,acc2=0.,acc3=0.;
 for(int i=0;i<8;i++){zz=abs(zz)/clamp(dot(zz,zz),.07,2.2)-vec2(.83+.07*sin(t*.7),.56+.09*cos(t*.53));
  float l=length(zz);acc+=exp(-l*4.2);acc2+=exp(-abs(zz.x)*10.);acc3+=exp(-abs(zz.y-zz.x)*14.);}
 vec3 col=vec3(.012,.004,.03);
 col+=vec3(1.,.62,.2)*acc*.15;col+=vec3(.45,.18,1.)*acc2*.075;col+=vec3(.1,.6,1.)*acc3*.04;
 col*=.25+1.1*(1.-smoothstep(.1,1.25,r));
 for(int k=0;k<5;k++){float fk=float(k);float n=8.+8.*fk;float rr=.13+.105*fk;
  float pet=r-rr*(1.+.2*pow(abs(cos(a0*n*.5+fk*.6+t*(.3-.12*fk))),.7));
  col+=mix(vec3(1.,.85,.5),vec3(.85,.55,1.),fk/4.)*.0016/(abs(pet)+.0025)*(1.-fk*.12);
  col+=vec3(1.,.8,.5)*exp(-abs(pet)*26.)*.07;}
 col+=vec3(1.,.9,.7)*.0045/(r*r+.005)*(1.+.18*sin(t*4.));
 col+=vec3(.95,.75,1.)*pow(.5+.5*cos(a0*24.+t*1.5),9.)*exp(-r*3.2)*.16;
 col+=vec3(1.,.9,.7)*pow(.5+.5*cos(a0*6.-t),30.)*exp(-r*1.6)*.25;
 float wv=sin(r*26.-uTime*1.6);col+=vec3(.6,.5,1.)*pow(.5+.5*wv,12.)*.05*exp(-r*1.5);
 return col;}
`,
/* 8 — EKAM: sunrise from orbit, seven lights over one world */`
vec3 hue(float t){return .55+.45*cos(6.2831*(t*.8+vec3(0.,.33,.67)));}
vec3 scene(vec2 p){float t=uTime;vec2 q=p+uMouse*.02;
 vec3 col=vec3(.002,.003,.009);
 col+=vec3(stars(q,30.)+stars(q+9.,64.)*.6);
 float nb=fbm(q*1.8+vec2(t*.01,3.));col+=vec3(.1,.06,.2)*pow(nb,3.);
 float pr=1.9;vec2 pc=q-vec2(0.,-2.06);float d=length(pc);
 float sx=.1+uDrag.x*uForce*.7;vec2 sp=vec2(sx,-2.06+sqrt(3.61-sx*sx)+.008);float sd=length(q-sp);
 vec3 L=normalize(vec3(.1,.52,-.85));
 float outside=smoothstep(pr-.003,pr+.003,d);
 if(d<pr+.003){vec3 nn=vec3(pc/pr,sqrt(max(1.-d*d/(pr*pr),0.)));
  float dif=smoothstep(-.12,.35,dot(nn,L));
  vec2 sv=vec2(nn.x*5.+t*.012,nn.z*5.);
  float land=fbm(sv*1.3+fbm(sv*2.6)*.8);float cl=smoothstep(.48,.78,fbm(sv*2.2+vec2(t*.02,7.)));
  vec3 sf=mix(vec3(.015,.07,.2),vec3(.1,.17,.07),smoothstep(.5,.56,land));sf=mix(sf,vec3(.28,.22,.15),smoothstep(.62,.75,land));
  sf=mix(sf,vec3(.9),cl*.85);
  vec3 pcx=sf*dif*vec3(1.6,1.35,1.1);
  pcx+=vec3(1.,.42,.12)*sf*smoothstep(0.,.5,dif)*(1.-smoothstep(.5,1.,dif))*1.5;
  pcx+=vec3(1.,.72,.35)*step(.56,land)*step(.86,noise(sv*34.))*(1.-smoothstep(0.,.1,dif))*(1.-cl)*.7;
  float rim=pow(1.-nn.z,5.);pcx+=vec3(.25,.55,1.)*rim*(dif*1.6+.05);
  col=mix(pcx,col,outside);}
 float h=max(d-pr,0.);float sunP=exp(-sd*3.);
 col+=outside*(vec3(.2,.5,1.)*exp(-h*55.)*(.12+sunP*2.)+vec3(1.,.55,.2)*exp(-h*150.)*sunP*2.5);
 float fl=mix(.3,1.,outside);
 col+=vec3(1.,.92,.8)*(.0035/(sd*sd+.0006))*fl;
 col+=vec3(1.,.8,.55)*exp(-abs(q.y-sp.y)*70.)*exp(-abs(q.x-sp.x)*1.6)*.55*fl;
 float sa=atan(q.y-sp.y,q.x-sp.x);col+=vec3(1.,.85,.65)*pow(.5+.5*cos(sa*8.+t*.2),24.)*exp(-sd*3.5)*.5*fl;
 for(int i=0;i<7;i++){float fi=float(i);float a=2.62-fi*.35+.03*sin(t*.5+fi);vec2 c=vec2(cos(a)*.62,sin(a)*.3+.05+.012*sin(t*.8+fi*1.7));
  float dd=length(q-c);vec3 hc=hue(fi/7.);col+=hc*(.0007/(dd*dd+.0002))+hc*exp(-dd*14.)*.06;}
 return col;}
`,
/* 9 — SANGAM: any two elements, combined */`
uniform vec3 uC1;uniform vec3 uC2;uniform vec3 uC3;uniform vec4 uP;uniform vec4 uP2;uniform float uRb;
vec3 hue(float t){return .55+.45*cos(6.2831*(t+vec3(0.,.33,.67)));}
vec3 scene(vec2 p){float t=uTime;vec2 pd=p-uDrag;p-=pd*uForce*.25*exp(-dot(pd,pd)*3.);
 float r=length(p);float sw=uP2.y*(1.4-r)*.9+t*.06*uP2.y;float cs=cos(sw),sn=sin(sw);
 vec2 q=mat2(cs,-sn,sn,cs)*p*uP2.z*1.6;vec2 fl=vec2(0.,-t*uP.x);
 vec2 w=q+vec2(fbm(q*1.3+fl+3.),fbm(q*1.3+fl*1.1+8.))*1.6;
 float n=fbm(w+fl*.6);
 float crack=pow(1.-abs(2.*n-1.),7.);
 float v=mix(smoothstep(.22,.78,n),crack*1.25+n*.12,uP.y);
 vec3 col=mix(uC1,uC2,smoothstep(.1,.6,v));col=mix(col,uC3,smoothstep(.55,1.,v));col*=.3+1.5*v;
 float rn=noise(vec2(p.x*95.+p.y*14.,p.y*4.+t*10.));col+=uC3*pow(rn,10.)*uP.z*1.4;
 float em=0.;for(int k=0;k<3;k++){float fk=float(k);float sc=9.+fk*8.;
  vec2 g=vec2(p.x*sc,(p.y-t*(.04+uP.x*.3)*(1.+.3*fk))*sc)+fk*31.;vec2 id=floor(g),f=fract(g)-.5;float h=hash(id+fk*17.);
  vec2 o=(vec2(hash(id+1.3),hash(id+5.9))-.5)*.7;float d=length(f-o);
  em+=step(.7,h)*(1.-smoothstep(0.,.04+.05*h,d))*(.5+.5*sin(t*4.*h+h*30.));}
 col+=uC3*em*uP.w*1.6;
 float fs=floor(t*1.6);float fa=pow(noise(vec2(t*4.,1.)),5.)*step(.4,hash(vec2(fs,2.)))*4.;
 float bx=(fbm(vec2(p.y*3.5+fs*7.,fs))-.5)*.9+(hash(vec2(fs,9.))-.5)*.8;
 float bolt=.003/(abs(p.x-bx)+.002);
 col+=uC3*(bolt*fa*3.+fa*.6*n)*uP2.x;
 col+=uC3*pow(.5+.5*sin(r*28.-t*2.2),10.)*uP2.w*.3*exp(-r*1.8);
 float r2=length(p-vec2(0.,-.75));float bd=(r2-.95)*9.;col+=hue((r2-.82)*3.2)*exp(-bd*bd)*uRb*.9;
 col+=uC3*.004/(dot(pd,pd)+.004)*uForce*.4;
 return col;}
`];

