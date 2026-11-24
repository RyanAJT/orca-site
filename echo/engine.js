// Echo Engine hero: a 3D engine with orbiting benefit cards, bubble rings and cursor parallax (three.js + bloom).
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
const shell=new THREE.Mesh(new THREE.IcosahedronGeometry(.95,1),new THREE.MeshPhysicalMaterial({color:0x9fe3ef,metalness:0,roughness:.05,transmission:1,thickness:.6,ior:1.3,transparent:true,opacity:.35,flatShading:true,envMapIntensity:1.6,side:THREE.DoubleSide,depthWrite:false}));ENG.add(shell);
const cage=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(.97,1)),new THREE.LineBasicMaterial({color:ICE.clone().multiplyScalar(1.3),transparent:true,opacity:.55,toneMapped:false}));ENG.add(cage);
// gimbal rings: metal bands with a lit arc and tick marks
const GIM=[1.35,1.62,1.9].map((R,i)=>{const g=new THREE.Group();
 g.add(new THREE.Mesh(new THREE.TorusGeometry(R,.035,12,160),metal));
 const arc=new THREE.Mesh(new THREE.TorusGeometry(R+.001,.037,8,60,Math.PI*(.25+i*.12)),glow(1.15));arc.rotation.z=i*2;g.add(arc);
 for(let k=0;k<36;k++){if(k%3)continue;const tk=new THREE.Mesh(new THREE.BoxGeometry(.012,.09,.012),glow(1.6));const a=k/36*Math.PI*2;tk.position.set(Math.cos(a)*(R+.09),Math.sin(a)*(R+.09),0);tk.rotation.z=a+Math.PI/2;g.add(tk);}
 g.rotation.set(1.1+i*.5,i*.9,0);ENG.add(g);return g;});
// piston pods on the equator: reads as a machine
for(let k=0;k<6;k++){const a=k/6*Math.PI*2,p=new THREE.Group();p.position.set(Math.cos(a)*1.02,0,Math.sin(a)*1.02);p.rotation.y=-a;
 const b=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,.34,16),metal);b.rotation.z=Math.PI/2;p.add(b);
 const l=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.05,16),glow(2.4));l.rotation.z=Math.PI/2;l.position.x=.19;p.add(l);ENG.add(p);}
// content cards: little HUD screens in orbit (reel, post, chat, calendar, leads, schedule)
// benefit cards: what you get from the engine, orbiting it
const BEN=[
 ['Your week, planned','Reels, posts and stories mapped out every Monday',x=>{x.strokeRect(-17,-13,34,30);x.beginPath();x.moveTo(-17,-3);x.lineTo(17,-3);x.moveTo(-8,-19);x.lineTo(-8,-9);x.moveTo(8,-19);x.lineTo(8,-9);x.stroke();}],
 ['Reels, scripted','Hook, beats, shot list and caption for every reel',x=>{x.beginPath();x.moveTo(-9,-15);x.lineTo(-9,15);x.lineTo(15,0);x.closePath();x.fill();}],
 ['Posts in your voice','Captions and carousels that sound like you',x=>{x.beginPath();[-12,0,12].forEach((y,i)=>{x.moveTo(-17,y);x.lineTo(i==2?5:17,y);});x.stroke();}],
 ['Comments become leads','A keyword comment sends your link by DM',x=>{x.beginPath();x.roundRect(-18,-15,36,25,8);x.stroke();x.beginPath();x.moveTo(-6,10);x.lineTo(-10,19);x.lineTo(3,10);x.fill();}],
 ['An always-on front desk','Your WhatsApp or Telegram assistant, scripted',x=>{x.beginPath();x.arc(0,0,17,0,7);x.moveTo(0,-9);x.lineTo(0,1);x.lineTo(8,6);x.stroke();}],
 ['One brand kit','Your voice, offers and audience, written once',x=>{x.beginPath();x.moveTo(0,-18);x.lineTo(17,-7);x.lineTo(0,4);x.lineTo(-17,-7);x.closePath();x.moveTo(-17,3);x.lineTo(0,14);x.lineTo(17,3);x.stroke();}]];
function card([title,sub,icon],i){const c=document.createElement('canvas');c.width=640;c.height=340;const x=c.getContext('2d');
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
 const draw=()=>{x.clearRect(0,0,640,340);const g=x.createLinearGradient(0,0,640,340);g.addColorStop(0,'rgba(16,62,74,.92)');g.addColorStop(1,'rgba(4,22,28,.92)');
  x.fillStyle=g;x.beginPath();x.roundRect(5,5,630,330,40);x.fill();x.strokeStyle='rgba(169,225,236,.75)';x.lineWidth=3;x.stroke();
  x.fillStyle='#a9e1ec';x.beginPath();x.arc(78,84,44,0,7);x.fill();
  x.save();x.translate(78,84);x.fillStyle=x.strokeStyle='#04161b';x.lineWidth=5;x.lineCap=x.lineJoin='round';icon(x);x.restore();
  x.fillStyle='rgba(169,225,236,.7)';x.font='500 24px "Geist Mono",monospace';x.textAlign='right';x.fillText('0'+(i+1)+' / 06',600,62);x.textAlign='left';
  x.fillStyle='#f2f7f9';let fs=56;do{x.font='600 '+fs+'px Geist,"Inter Tight",system-ui,sans-serif';}while(x.measureText(title).width>570&&--fs>30);x.fillText(title,36,200);
  x.fillStyle='#c2dde3';x.font='400 31px Geist,"Inter Tight",system-ui,sans-serif';const w=sub.split(' ');let l='',y=250;
  w.forEach(s=>{if(x.measureText(l+s).width>570){x.fillText(l,36,y);l='';y+=40;}l+=s+' ';});x.fillText(l,36,y);t.needsUpdate=true;};
 draw();document.fonts&&document.fonts.ready.then(draw);
 return new THREE.Mesh(new THREE.PlaneGeometry(1.5,.8),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,toneMapped:false}));}
const CY=[[-.95,.95,-.95,.95,-.95,.95],[-2.1,1.35,-.45,2.15,-1.3,.5]];
const CARDS=BEN.map((b,i)=>{const m=card(b,i);m.userData={a:i/6*Math.PI*2};RIG.add(m);return m;});
// data pulses: sparks that fly from each card into the core
const PUL=CARDS.map(()=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.035,10,8),glow(3));RIG.add(m);return m;});
// halo rings above and below, and the dock under the engine
function bubbleRing(R,n){const g=new THREE.Group();for(let i=0;i<n;i++){const a=i/n*Math.PI*2+rn()*.08,rr=R+(rn()-.5)*.3,big=rn()>.8;
  const m=new THREE.Sprite(new THREE.SpriteMaterial({map:BT,transparent:true,opacity:.45+rn()*.5,depthWrite:false}));m.position.set(Math.cos(a)*rr,(rn()-.5)*.22,Math.sin(a)*rr);m.scale.setScalar(big?.13+rn()*.07:.04+rn()*.06);g.add(m);}
 sc.add(g);return g;}
const haloT=bubbleRing(3.3,110);haloT.position.y=3.1;const haloB=bubbleRing(2.25,80);haloB.position.y=-2.05;
const dock=new THREE.Group();dock.position.y=-2.0;sc.add(dock);
{const d1=new THREE.Mesh(new THREE.CylinderGeometry(1.25,.9,.5,6),metal);dock.add(d1);
 const d2=new THREE.Mesh(new THREE.CylinderGeometry(.75,1.15,.22,6),metal);d2.position.y=.36;dock.add(d2);
 const d3=new THREE.Mesh(new THREE.TorusGeometry(.62,.03,8,60),glow(2.6));d3.rotation.x=Math.PI/2;d3.position.y=.48;dock.add(d3);
 const beam=new THREE.Mesh(new THREE.CylinderGeometry(.5,.16,1.1,24,1,true),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
  vertexShader:'varying vec2 u;void main(){u=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 u;void main(){gl_FragColor=vec4(.5,.9,.97,(1.-u.y)*.18);}'}));beam.position.y=1.05;dock.add(beam);}
// light shaft from the surface
const shaft=new THREE.Mesh(new THREE.PlaneGeometry(7,13),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{t:{value:0}},
 vertexShader:'varying vec2 u;void main(){u=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform float t;varying vec2 u;void main(){float x=abs(u.x-.5)*2.;float w=mix(.95,.3,u.y);float a=pow(max(0.,1.-x/w),2.)*smoothstep(0.,.5,u.y)*(.11+.03*sin(t+u.y*5.)+.03*sin(u.x*40.+t*.6));gl_FragColor=vec4(.6,.93,1.,a);}'}));
shaft.position.set(0,2.2,-1.2);sc.add(shaft);
// drifting bits: bubbles and motes instead of rocks
const BITS=[];for(let i=0;i<(phone?70:150);i++){const b=i%4==0;const m=new THREE.Sprite(new THREE.SpriteMaterial({map:b?BT:DT,color:0xcff6fb,transparent:true,opacity:b?.5:.1+rn()*.3,depthWrite:false,blending:b?THREE.NormalBlending:THREE.AdditiveBlending}));
 m.userData={x:(rn()-.5)*16,z:-8+rn()*12,y0:rn()*12,sp:(b?.3:.06)+rn()*.2,ph:rn()*6};m.scale.setScalar(b?.06+rn()*.1:.03+rn()*.06);sc.add(m);BITS.push(m);}

// ---------- render
const comp=new EffectComposer(r);comp.addPass(new RenderPass(sc,cam));const bloom=new UnrealBloomPass(new THREE.Vector2(256,256),.38,.5,.92);comp.addPass(bloom);comp.addPass(new OutputPass());
let CZ=11,PORT=false;const BOX=cv.parentElement;function size(){const w=BOX.clientWidth,h=BOX.clientHeight;r.setSize(w,h,false);comp.setSize(w,h);cam.aspect=w/h;PORT=w/h<.8;CZ=PORT?18.5:10.5;
 haloT.scale.setScalar(PORT?.5:1);haloT.position.y=PORT?2.3:3.1;haloB.scale.setScalar(PORT?.7:1);cam.updateProjectionMatrix();}
size();addEventListener('resize',size);
let px=0,py=0,mx=0,my=0;addEventListener('pointermove',e=>{px=e.clientX/innerWidth*2-1;py=e.clientY/innerHeight*2-1;},{passive:true});
const QT=+new URLSearchParams(location.search).get('t');let T0=0;
function frame(now){if(BOX.getBoundingClientRect().bottom<0)return requestAnimationFrame(frame);if(!T0)T0=now;const t=QT||(now-T0)/1000;mx+=(px-mx)*.05;my+=(py-my)*.05;
 const rise=1-Math.pow(1-Math.min(1,t/2.2),3);                       // the engine rises off its dock on load
 RIG.position.y=-1.6+rise*1.75+Math.sin(t*.8)*.08;RIG.scale.setScalar(.6+.4*rise);
 RIG.rotation.y=mx*.6;RIG.rotation.x=my*.3;                           // the whole engine turns to the cursor
 mark.lookAt(cam.position);shell.rotation.set(t*.11,t*.17,0);cage.rotation.copy(shell.rotation);
 GIM.forEach((g,i)=>{g.rotation.x+=.004*(i+1)*(i%2?-1:1);g.rotation.y+=.003*(3-i);});
 CARDS.forEach((m,i)=>{const a=m.userData.a+t*.16,f=(Math.sin(a)+1)/2;   // f: 1 in front of the engine, 0 behind it
  m.position.set(Math.cos(a)*(PORT?1.05:2.7),CY[+PORT][i]+Math.sin(t*.9+i)*.07,Math.sin(a)*(PORT?1.5:1.7));m.quaternion.copy(cam.quaternion);
  m.material.opacity=.06+.94*f*f*f;m.scale.setScalar((PORT?1.12:1.12)*(.72+.28*f));
  const k=(t*.45+i/6)%1,p=PUL[i];p.position.copy(m.position).multiplyScalar(1-k);p.scale.setScalar(Math.sin(k*Math.PI)*1.4+.01);});
 haloT.rotation.set(-.21+my*.06,t*.07,0);haloB.rotation.set(-.15,-t*.1,0);haloT.position.x=-mx*.4;haloB.position.x=mx*.25;
 dock.rotation.y=t*.1+mx*.3;shaft.material.uniforms.t.value=t;
 BITS.forEach(b=>{const d=b.userData,y=(d.y0+t*d.sp)%12;b.position.set(d.x+Math.sin(y+d.ph)*.15,y-6,d.z);});
 cam.position.set(mx*.9,.35-my*.5,CZ);cam.lookAt(0,PORT?.15:-.15,0);
 comp.render();(still&&t>3)||requestAnimationFrame(frame);}
requestAnimationFrame(frame);
