// Guide background: one WebGL shader for the whole underwater world (water, light rays, caustics,
// motes and the plasma orb from the homepage), moved by scroll and pointer for depth.
// Also: scroll parallax on the mock visuals and the sticky pipeline tracker.
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.querySelector('.sea canvas');
  const gl = cv && cv.getContext('webgl', { antialias: false, alpha: false });
  const mobile = () => innerWidth < 900;
  let px = 0, py = 0, mx = 0, my = 0;
  const hasMap = !!document.querySelector('.map');
  addEventListener('pointermove', e => { px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5; }, { passive: true });

  if (gl) {
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision mediump float;
uniform vec2 R;uniform float T,S,P;uniform vec2 M;uniform vec3 O;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float h3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*n3(p);p=p*2.03+vec3(.31,.17,.73);a*=.5;}return s;}
float caus(vec2 p,float t){vec2 i=p;float c=0.;for(int n=0;n<3;n++){float k=t*(1.-.3/float(n+1));i=p+vec2(cos(k-i.x)+sin(k+i.y),sin(k-i.y)+cos(k+i.x));
 c+=1./length(vec2(p.x/(sin(i.x+k)/.015),p.y/(cos(i.y+k)/.015)));}c/=3.;return pow(clamp(1.17-pow(c,1.4),0.,1.),8.);}
void main(){
 vec2 f=gl_FragCoord.xy,u=f/R;float a=R.x/R.y;vec2 q=vec2((u.x-.5)*a,u.y);
 float depth=clamp(S*.00035,0.,1.);
 vec3 col=mix(vec3(.012,.035,.047),vec3(.06,.2,.24),pow(u.y,1.6))*(1.-depth*.35);
 float ry=0.;for(int k=0;k<5;k++){float fk=float(k);float x=q.x*1.3+fk*.7+sin(T*.11+fk)*.25+M.x*.25-S*.00008;
  ry+=pow(max(0.,sin(x*3.1+fk)),12.)*(.5+.5*sin(T*.3+fk*2.));}
 col+=vec3(.55,.85,.9)*ry*.07*smoothstep(.15,1.,u.y);
 vec2 cp=vec2(q.x*2.2,(u.y+S*.00025)*2.2)+M*.15;
 col+=vec3(.25,.75,.82)*caus(cp*3.,T*.35)*(1.-u.y)*.22;
 vec2 g=f/18.+vec2(0.,S*.04+T*6.);vec2 cell=floor(g);float r=h(cell);
 if(r>.94){vec2 d=fract(g)-.5-vec2(sin(T*.6+r*40.)*.25,0.);col+=vec3(.8,.95,.97)*smoothstep(.12,0.,length(d))*(r-.94)*9.;}
 vec2 c=vec2((O.x-.5)*a,O.y);vec2 d=(q-c)/O.z;float l=length(d);
 if(l<1.06){
  col+=vec3(.25,.8,.9)*smoothstep(1.06,.98,l)*.12*P;
  if(l<1.){vec3 n=vec3(d,sqrt(1.-l*l));float fr=pow(1.-n.z,2.4);
   vec3 p3=n*1.6+vec3(M*.4,0.);float t=T*.16;
   vec3 w=vec3(fbm(p3+t),fbm(p3+vec3(5.2,1.3,2.)-t),fbm(p3+vec3(1.7,9.2,3.)+t*.7));
   float nn=fbm(p3*1.5+w*2.4);float vein=pow(1.-abs(nn*2.-1.),7.);
   vec3 o=mix(vec3(.01,.09,.12),vec3(.06,.42,.52),smoothstep(.25,.8,nn));
   o+=vec3(.72,.95,.98)*vein*1.1+vec3(.75,.96,1.)*fr*1.3;
   o+=pow(max(dot(reflect(vec3(0,0,-1),n),normalize(vec3(-.4,.6,.7))),0.),30.)*.9;
   float al=clamp(.62+fr*.38+vein*.25,0.,1.)*P*smoothstep(1.,.985,l);
   col=mix(col,o,al);}
 }
 col+=vec3(.02,.06,.07)*smoothstep(.0,.6,1.-length(u-vec2(.5,.9)));
 col*=1.-.35*pow(length(u-.5)*1.2,2.);
 gl_FragColor=vec4(col,1.);}`;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
    if (gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      const U = n => gl.getUniformLocation(pr, n), uR = U('R'), uT = U('T'), uS = U('S'), uP = U('P'), uM = U('M'), uO = U('O');
      // Render below native resolution: the scene is soft, and phones stay smooth and cool.
      const size = () => { const k = Math.min(devicePixelRatio, 2) * (mobile() ? .55 : .7); cv.width = innerWidth * k | 0; cv.height = innerHeight * k | 0; gl.viewport(0, 0, cv.width, cv.height); };
      size(); addEventListener('resize', size);
      const t0 = performance.now();
      const draw = now => {
        const s = scrollY, h = innerHeight, sp = Math.min(1, s / h);
        mx += (px - mx) * .05; my += (py - my) * .05;
        // Orb: big and high on phones, right of the hero on desktop; rises, shrinks and fades as you read on.
        const m = mobile();
        const ox = m ? .5 + mx * .04 : (hasMap ? .74 : .8) + mx * .03 - sp * .12;
        const oy = (m ? (hasMap ? .27 : .02) : .56) + sp * (m ? .55 : .5) - my * .03; // phones: behind the map, below the headline
        const orr = (m ? .36 : .34) * (1 - sp * .35);
        gl.uniform2f(uR, cv.width, cv.height);
        gl.uniform1f(uT, (now - t0) / 1000);
        gl.uniform1f(uS, s);
        gl.uniform1f(uP, (m ? .85 : 1) - sp * .45);
        gl.uniform2f(uM, mx, my);
        gl.uniform3f(uO, ox, oy, orr);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        still || requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
      if (still) addEventListener('scroll', () => requestAnimationFrame(draw), { passive: true });
    }
  }

  // Mock visuals drift against the scroll for depth
  const mocks = [...document.querySelectorAll('.agent .mock')];
  if (!still && mocks.length) {
    const tick = () => {
      const h = innerHeight;
      for (const el of mocks) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > h + 100) continue;
        el.style.transform = `translate3d(0,${((r.top + r.height / 2 - h / 2) * -.07).toFixed(1)}px,0)`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Highlight the pipeline stage you're reading
  const tabs = [...document.querySelectorAll('.steps-h .stp')];
  if (tabs.length) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      tabs.forEach(t => t.classList.toggle('on', t.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    tabs.forEach(t => { const el = document.querySelector(t.getAttribute('href')); el && io.observe(el); });
  }
})();
