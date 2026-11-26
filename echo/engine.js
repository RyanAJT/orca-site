// Echo Engine hero: your brand goes in at the top, the engine core turns it into a week of work that drops out below (three.js + bloom).
import * as THREE from 'three';
import {SVGLoader} from 'three/addons/loaders/SVGLoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
const still=matchMedia('(prefers-reduced-motion: reduce)').matches,phone=innerWidth<760;
const cv=document.getElementById('eng');
const r=new THREE.WebGLRenderer({canvas:cv,antialias:!phone});r.setPixelRatio(Math.min(devicePixelRatio,phone?1.5:2));
r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1;
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.1,200);
const ICE=new THREE.Color(0xa9e1ec),V=(x,y,z)=>new THREE.Vector3(x,y,z);
const glow=k=>new THREE.MeshBasicMaterial({color:ICE.clone().multiplyScalar(k),toneMapped:false});
// water: gradient backdrop + fog
{const c=document.createElement('canvas');c.width=8;c.height=512;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,512);
 [[0,'#1b7486'],[.22,'#0d4c5a'],[.5,'#06303c'],[.75,'#031a22'],[1,'#010a0d']].forEach(([o,s])=>g.addColorStop(o,s));x.fillStyle=g;x.fillRect(0,0,8,512);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;sc.background=t;}
sc.fog=new THREE.FogExp2(0x052a33,.035);
{const es=new THREE.Scene();const pnl=(w,h,col,k,pos)=>{const m=new THREE.Mesh(new THREE.CircleGeometry(1,32).scale(w/2,h/2,1),new THREE.MeshBasicMaterial({color:new THREE.Color(col).multiplyScalar(k),side:THREE.DoubleSide}));m.position.set(...pos);m.lookAt(0,0,0);es.add(m);};
 pnl(10,4,0xdff7fb,3,[0,9,-3]);pnl(9,6,0x9fdfea,.5,[0,3,9]);pnl(1,9,0xbfeff7,2,[-7,2,4]);pnl(1,9,0xbfeff7,2,[7,2,4]);pnl(8,1,0x2a8ea0,1.4,[0,-4,5]);
 sc.environment=new THREE.PMREMGenerator(r).fromScene(es,.03).texture;}
sc.add(new THREE.HemisphereLight(0x6fd0e0,0x02121a,.7));
const key=new THREE.SpotLight(0xd6f6fb,60,0,.45,1,1.3);key.position.set(0,9,1);sc.add(key,key.target);

// ---------- the engine
function tex(b){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,b?40:0,64,64,62);
 if(b){g.addColorStop(0,'rgba(200,245,255,.04)');g.addColorStop(.78,'rgba(200,245,255,.28)');g.addColorStop(.93,'rgba(235,252,255,.95)');g.addColorStop(1,'rgba(235,252,255,0)');}else{g.addColorStop(0,'#fff');g.addColorStop(1,'rgba(255,255,255,0)');}
 x.fillStyle=g;x.beginPath();x.arc(64,64,62,0,7);x.fill();if(b){x.fillStyle='rgba(255,255,255,.9)';x.beginPath();x.ellipse(46,42,12,7,-.6,0,7);x.fill();}return new THREE.CanvasTexture(c);}
const DT=tex(0),BT=tex(1);let sd=7;const rn=()=>(sd=(sd*16807)%2147483647)/2147483647;
const RIG=new THREE.Group(),ENG=new THREE.Group();sc.add(RIG);RIG.add(ENG);
const metal=new THREE.MeshPhysicalMaterial({color:0x10222a,metalness:.9,roughness:.28,clearcoat:1,clearcoatRoughness:.2,envMapIntensity:1.1});
// core: glowing Orca mark inside a faceted glass shell
const shapes=[];new SVGLoader().parse('<svg xmlns="http://www.w3.org/2000/svg"><path d="M375.8 168.7l.9 11.5 .2 7.4 -.1 6.6 -.8 12.3 -1.6 12.2 -1.1 6.5 -1.2 5.6 -3.2 12 -2 6.2 -2.2 6.2 -2.8 6.9 -2.2 5 -10.7 4.9 -11.4 4.5 -11.6 4.1 -27.8 9 -15.1 5.6 -6.3 2.6 -6.9 3.1 -6.1 3 -5.9 3.3 -5.8 3.5 -5.7 3.7 -6.2 4.3 -6.7 5.1 -5.3 4.3 -7 6 -20.6 18.5 -9.3 8.1 -10.1 8.1 -10.2 7.3 -5.5-.6 -7.3-1.1 -6.5-1.1 -6.5-1.4 -11.1-3 -6.2-2 -6.2-2.2 -11.4-4.8 -6.7-3.2 -5.8-3 -10.6-6.3 -9.7-6.6 10.6-3.6 10-3.7 7.8-3.2 8.2-3.7 7.4-3.8 7.8-4.6 8.3-5.3 6.1-4.4 6.7 2.3 6 1.7 7 1.6 6.7 1.2 7.2 .8 7.8 .4 7.2 0 7.3-.4 7.2-.8 6.6-1.2 7.7-1.7 6.4-1.9 6.3-2.2 6.8-2.8 6.5-3.1 5.9-3.3 6.2-3.8 6.4-4.5 4.8-3.8 5.4-4.8 5.6-5.6 4.5-4.9 4.9-6.1 3.6-5 3.9-6.2 3.5-6.3 3.2-6.5 2.5-5.7 2.3-6.3 2.1-6.9 1.5-6 1.4-7 8.2-3.7 7.4-3.8 7.8-4.6 7-4.5 6.8-4.8 7.2-5.5 8.3-6.9 8.3-7.3zM96.4 24l10.2-5.3 9-4 10.7-4.2 9.4-3 11.1-2.9 9.7-1.9 9.8-1.4 11.5-1 9.8-.3 10.7 .3 11.5 .9 10.6 1.5 10.4 2.1 10.4 2.7 10.9 3.6 10 3.9 9.7 4.4 10.1 5.4 9.2 5.6 8.8 6.1 8.4 6.5 7.5 6.5 7.6 7.4 7.8 8.5 7.2 9 5.8 8 5.8 9 4.8 8.6 5.1 10.3 3.9 9.1 3.9 10.8 3 10.2 -17.4 15.5 -6.5 5.3 -5.4 4.2 -5.5 4.1 -6.9 4.6 -6.4 3.9 -6.2 3.5 -.7-8.1 -1.3-8.3 -1.6-7.7 -2.3-8 -2.8-7.9 -3.1-7.2 -4.1-8 -4-6.7 -4.4-6.5 -5.1-6.6 -5.2-5.9 -6.4-6.3 -5.9-5.1 -5.7-4.4 -6-4.1 -8.2-4.9 -7.5-3.7 -7.7-3.3 -8-2.7 -7-2 -7.6-1.7 -8.3-1.2 -8.3-.7 -8.4-.2 -7.9 .3 -8.8 1 -7.8 1.4 -7.6 1.8 -8 2.5 -8.3 3.2 -7.6 3.5 -6.9 3.7 -7.6 4.8 -5.9 4.3 -6.5 5.3 -5.7 5.3 -5.4 5.7 -5 6 -5.3 7.2 -4.2 6.6 -3.3 5.9 -3.6 7.5 -3.4 8.3 -2.4 7.4 -2 7.6 -1.5 7.7 -1.3 9.4 -.5 8.4 .1 8.4 .6 8.3 1.2 8.3 1.4 7.2 2 7.5 2.6 8 3.2 7.8 3.4 7 4.1 7.3 4.6 7 4.7 6.3 5.4 6.4 5.8 6 5.8 5.3 6.1 4.9 7.1 5 -6 3.6 -6.7 3.6 -6.1 3 -7.6 3.4 -7 2.9 -9.4 3.4 -19.8 6.6 -8-8.4 -6.3-7.5 -6.5-8.5 -6.4-9.6 -5.8-9.9 -4.8-9.6 -4.6-10.5 -3.4-9.3 -3.4-11 -2.5-10.4 -1.8-9.7 -1.4-11.4 -.7-9.8 -.2-12.4 .3-5.7 .4-6.6 1.1-9.8 1.8-10.5 2.4-10.4 3.2-11.1 3.9-10.8 4.6-10.6 4.7-9.6 5.4-9.2 5.3-8.3 5.8-8 7.3-8.9 7.3-7.9 7.6-7.4 8.1-7 7.8-6 9.5-6.5z"/></svg>').paths.forEach(p=>SVGLoader.createShapes(p).forEach(s=>shapes.push(s)));
const mg=new THREE.ExtrudeGeometry(shapes,{depth:40,bevelEnabled:true,bevelThickness:6,bevelSize:4,bevelSegments:2,curveSegments:32});mg.center();mg.rotateX(Math.PI);mg.scale(.9/377,.9/377,.9/377);
const mark=new THREE.Mesh(mg,glow(1.5));ENG.add(mark);
const shell=new THREE.Mesh(new THREE.SphereGeometry(.95,48,32),new THREE.MeshPhysicalMaterial({color:0x9fe3ef,metalness:0,roughness:.05,transmission:1,thickness:.6,ior:1.3,transparent:true,opacity:.22,envMapIntensity:1.4,depthWrite:false}));ENG.add(shell);
// a lit ring around the core so it reads as a machine
const band=new THREE.Mesh(new THREE.TorusGeometry(1.18,.035,12,140),metal);band.rotation.x=1.25;ENG.add(band);
const bandLit=new THREE.Mesh(new THREE.TorusGeometry(1.181,.037,8,60,Math.PI*.5),glow(2));bandLit.rotation.x=1.25;ENG.add(bandLit);

// ---------- 3D cards: a rounded slab with a printed face
const ICONS={
 brand:x=>{x.beginPath();x.moveTo(0,-18);x.lineTo(17,-7);x.lineTo(0,4);x.lineTo(-17,-7);x.closePath();x.moveTo(-17,3);x.lineTo(0,14);x.lineTo(17,3);x.stroke();},
 plan:x=>{x.strokeRect(-17,-13,34,30);x.beginPath();x.moveTo(-17,-3);x.lineTo(17,-3);x.moveTo(-8,-19);x.lineTo(-8,-9);x.moveTo(8,-19);x.lineTo(8,-9);x.stroke();},
 reel:x=>{x.beginPath();x.moveTo(-9,-15);x.lineTo(-9,15);x.lineTo(15,0);x.closePath();x.fill();},
 post:x=>{x.beginPath();[-12,0,12].forEach((y,i)=>{x.moveTo(-17,y);x.lineTo(i==2?5:17,y);});x.stroke();},
 lead:x=>{x.beginPath();x.roundRect(-18,-15,36,25,8);x.stroke();x.beginPath();x.moveTo(-6,10);x.lineTo(-10,19);x.lineTo(3,10);x.fill();}};
function slab(w,h,draw,light){
 const c=document.createElement('canvas');c.width=Math.round(w*360);c.height=Math.round(h*360);const x=c.getContext('2d');
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
 const paint=()=>{x.clearRect(0,0,c.width,c.height);const g=x.createLinearGradient(0,0,0,c.height);
  if(light){g.addColorStop(0,'#eafaff');g.addColorStop(1,'#b6e6ef');}else{g.addColorStop(0,'#123f4b');g.addColorStop(1,'#061c23');}
  x.fillStyle=g;x.fillRect(0,0,c.width,c.height);x.strokeStyle=light?'rgba(255,255,255,.9)':'rgba(169,225,236,.55)';x.lineWidth=6;x.strokeRect(3,3,c.width-6,c.height-6);
  draw(x,c.width,c.height,light);t.needsUpdate=true;};
 paint();document.fonts&&document.fonts.ready.then(paint);
 const s=new THREE.Shape(),r=.12;s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);
 s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 const geo=new THREE.ExtrudeGeometry(s,{depth:.07,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:2,curveSegments:8});geo.translate(0,0,-.035);
 t.repeat.set(1/w,1/h);t.offset.set(.5,.5);
 const face=new THREE.MeshBasicMaterial({map:t,toneMapped:false,transparent:true}),side=new THREE.MeshPhysicalMaterial({color:light?0xbfe9f1:0x0d2f38,metalness:.6,roughness:.3,clearcoat:1,envMapIntensity:1.2,transparent:true});
 const m=new THREE.Mesh(geo,[face,side]);m.userData.mats=[face,side];return m;}
const SANS='Geist,"Inter Tight",system-ui,sans-serif',MONO='"Geist Mono","JetBrains Mono",monospace';
function face(icon,label,title,sub){return (x,W,H,light)=>{const ink=light?'#04161b':'#f2f7f9',k=H/360;
 x.fillStyle=light?'#04161b':'#3fd0e0';x.beginPath();x.arc(70*k,70*k,40*k,0,7);x.fill();
 x.save();x.translate(70*k,70*k);x.scale(k,k);x.fillStyle=x.strokeStyle=light?'#3fd0e0':'#04161b';x.lineWidth=5;x.lineCap=x.lineJoin='round';ICONS[icon](x);x.restore();
 x.fillStyle=light?'#1d6c7c':'#7fd6e3';x.font=`500 ${22*k}px ${MONO}`;x.textAlign='left';x.fillText(label,128*k,62*k);
 x.fillStyle=ink;let fs=48*k;do{x.font=`700 ${fs}px ${SANS}`;}while(x.measureText(title).width>W-60*k&&(fs-=2)>20);x.fillText(title,32*k,170*k);
 x.fillStyle=light?'#24525f':'#b5d6dd';x.font=`400 ${28*k}px ${SANS}`;const w=sub.split(' ');let l='',y=222*k;
 w.forEach(s=>{if(x.measureText(l+s).width>W-64*k){x.fillText(l,32*k,y);l='';y+=36*k;}l+=s+' ';});x.fillText(l,32*k,y);};}

// in: your brand. out: four kinds of finished work.
const IN=slab(1.9,.62,(x,W,H)=>{const k=H/223;x.strokeStyle='rgba(63,208,224,.9)';x.lineWidth=8;x.strokeRect(4,4,W-8,H-8);
 x.fillStyle='#3fd0e0';x.beginPath();x.arc(80*k,H/2,46*k,0,7);x.fill();x.save();x.translate(80*k,H/2);x.scale(1.15*k,1.15*k);x.strokeStyle='#04161b';x.lineWidth=5;x.lineCap=x.lineJoin='round';ICONS.brand(x);x.restore();
 x.fillStyle='#f2f7f9';x.font=`700 ${62*k}px ${SANS}`;x.fillText('Your brand',150*k,104*k);x.fillStyle='#9fd9e4';x.font=`400 ${31*k}px ${SANS}`;x.fillText('Voice · offers · customers',152*k,154*k);});RIG.add(IN);
const OUT=[['plan','EVERY MONDAY','A week planned','Reels, posts and stories mapped'],['reel','EVERY REEL','Reel scripts','Hook, beats and caption'],
 ['post','EVERY POST','Posts in your voice','Captions and carousels'],['lead','EVERY COMMENT','DMs that sell','Comments turned into leads']]
 .map(o=>{const m=slab(1.7,1.0,face(...o));RIG.add(m);return m;});
const LBL=(txt)=>{const c=document.createElement('canvas');c.width=512;c.height=64;const x=c.getContext('2d');x.font=`500 30px ${MONO}`;x.fillStyle='#7fe3f0';x.textAlign='center';x.fillText(txt,256,42);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,toneMapped:false}));s.scale.set(2.4,.3,1);RIG.add(s);return s;};
const LIN=LBL('IN'),LOUT=LBL('OUT · EVERY WEEK');
// stream of light from the brand card into the core, and from the core to each output
const DOTS=[...Array(phone?26:44)].map(()=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:DT,color:0xbff4fb,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));m.userData={k:rn(),lane:-1};RIG.add(m);return m;});
DOTS.forEach((d,i)=>d.userData.lane=i%5-1);   // -1: in, 0..3: outputs

// layout per orientation: where the input, core and outputs sit
let L={};function layout(port){L=port?{inY:1.6,inS:.78,core:.7,coreS:.4,out:[[-.86,-.55],[.86,-.55],[-.86,-1.5],[.86,-1.5]],outS:.94,lIn:9,lOut:.08,lS:.7}
 :{inY:1.8,inS:.85,core:.45,coreS:.55,out:[[-.88,-1.0],[.88,-1.0],[-.88,-2.02],[.88,-2.02]],outS:.95,lIn:2.24,lOut:-.37,lS:.85};LIN.scale.set(2.4*L.lS,.3*L.lS,1);LOUT.scale.set(2.4*L.lS,.3*L.lS,1);
 ENG.position.y=L.core;ENG.scale.setScalar(L.coreS);LIN.position.set(0,L.lIn,0);LOUT.position.set(0,L.lOut,0);}
const qv=new THREE.Vector3(),qa=new THREE.Vector3(),qb=new THREE.Vector3();
// light shaft from the surface
const shaft=new THREE.Mesh(new THREE.PlaneGeometry(7,13),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{t:{value:0}},
 vertexShader:'varying vec2 u;void main(){u=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform float t;varying vec2 u;void main(){float x=abs(u.x-.5)*2.;float w=mix(.95,.3,u.y);float a=pow(max(0.,1.-x/w),2.)*smoothstep(0.,.5,u.y)*(.11+.03*sin(t+u.y*5.)+.03*sin(u.x*40.+t*.6));gl_FragColor=vec4(.6,.93,1.,a);}'}));
shaft.position.set(0,2.2,-1.2);sc.add(shaft);
// drifting bits: bubbles and motes instead of rocks
const BITS=[];for(let i=0;i<(phone?70:150);i++){const b=i%4==0;const m=new THREE.Sprite(new THREE.SpriteMaterial({map:b?BT:DT,color:0xcff6fb,transparent:true,opacity:b?.5:.1+rn()*.3,depthWrite:false,blending:b?THREE.NormalBlending:THREE.AdditiveBlending}));
 m.userData={x:(rn()-.5)*16,z:-8+rn()*12,y0:rn()*12,sp:(b?.3:.06)+rn()*.2,ph:rn()*6};m.scale.setScalar(b?.06+rn()*.1:.03+rn()*.06);sc.add(m);BITS.push(m);}

// ---------- render
const comp=new EffectComposer(r);comp.addPass(new RenderPass(sc,cam));const bloom=new UnrealBloomPass(new THREE.Vector2(256,256),.34,.5,.92);comp.addPass(bloom);comp.addPass(new OutputPass());
let CZ=11,PORT=false;const BOX=cv.parentElement;function size(){const w=BOX.clientWidth,h=BOX.clientHeight;r.setSize(w,h,false);comp.setSize(w,h);cam.aspect=w/h;PORT=w/h<.8;CZ=PORT?13.2:9.6;layout(PORT);cam.updateProjectionMatrix();}
size();addEventListener('resize',size);
let px=0,py=0,mx=0,my=0;addEventListener('pointermove',e=>{px=e.clientX/innerWidth*2-1;py=e.clientY/innerHeight*2-1;},{passive:true});
const QT=+new URLSearchParams(location.search).get('t');let T0=0;
const ease=x=>1-Math.pow(1-Math.min(1,Math.max(0,x)),3),CYC=7.5;
function frame(now){if(BOX.getBoundingClientRect().bottom<0)return requestAnimationFrame(frame);if(!T0)T0=now;const t=QT||(now-T0)/1000;mx+=(px-mx)*.05;my+=(py-my)*.05;
 RIG.rotation.y=mx*.35;RIG.rotation.x=my*.15;                       // the whole flow tilts toward the cursor
 mark.lookAt(cam.position);shell.rotation.y=t*.2;bandLit.rotation.z=-t*1.6;
 // the cycle: brand card drops in, the core works, the four outputs pop out one by one, hold, then fade and repeat
 const c=t%CYC,run=t>=.4;
 const inK=ease((c-.0)/.7);IN.position.set(Math.sin(t*.8)*.03,L.inY+(1-inK)*.6,0);IN.scale.setScalar(L.inS);IN.userData.mats.forEach(m=>m.opacity=inK);
 const work=c>.9&&c<5.2;ENG.rotation.y=Math.sin(t*.5)*.25;mark.material.color.copy(ICE).multiplyScalar(work?1.5+.5*Math.sin(t*9):1.3);
 const fade=1-ease((c-6.4)/.8);
 OUT.forEach((m,i)=>{const k=run?ease((c-1.2-i*.7)/.7):1,[ox,oy]=L.out[i];
  m.position.set(ox*k,L.core+(oy-L.core)*k+Math.sin(t*1.1+i)*.03*k,(1-k)*.4);m.rotation.set(0,(1-k)*.6*(ox<0?-1:1),(1-k)*.4*(ox<0?1:-1));
  m.scale.setScalar(L.outS*(.35+.65*k));m.userData.mats.forEach(q=>q.opacity=Math.min(k*1.4,1)*fade);});
 IN.userData.mats.forEach(m=>m.opacity*=fade);LIN.material.opacity=fade;LOUT.material.opacity=ease((c-1.4)/.6)*fade;
 // streams: dots run down from the brand card into the core, then out along each lane
 DOTS.forEach(d=>{const u=d.userData,k=(u.k+t*(u.lane<0?.55:.45))%1;
  if(u.lane<0){qa.set(0,L.inY-.45*L.inS,0);qb.set(0,L.core+.6*L.coreS,0);}else{qa.set(0,L.core,0);qb.set(L.out[u.lane][0],L.out[u.lane][1]+.5*L.outS,0);}
  d.position.lerpVectors(qa,qb,k);d.scale.setScalar((.05+.07*Math.sin(k*Math.PI))*(u.lane<0?1:.9));d.material.opacity=Math.sin(k*Math.PI)*(work||u.lane<0?.9:.25)*fade;});
 BITS.forEach(b=>{const d=b.userData,y=(d.y0+t*d.sp)%12;b.position.set(d.x+Math.sin(y+d.ph)*.15,y-6,d.z);});
 shaft.material.uniforms.t.value=t;
 cam.position.set(mx*.6,.2-my*.3,CZ);cam.lookAt(0,PORT?.2:.1,0);
 comp.render();(still&&t>3)||requestAnimationFrame(frame);}
requestAnimationFrame(frame);
