// Guide background: "echo" sonar. Pulses ripple out from the map hub (or the Orca mark),
// a radar sweep turns, motes light up as each ring passes, over moving water and light.
// Everything is one WebGL shader; scroll and pointer move it for depth.
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sea = document.querySelector('.sea'), cv = sea && sea.querySelector('canvas');
  const hub = document.querySelector('.map .hub');
  let mark = null;
  if (sea && !hub) {   // pages without a map get the Orca mark as the echo source
    mark = document.createElement('div'); mark.className = 'mark';
    mark.innerHTML = '<svg viewBox="0 0 377 377"><path d="M375.8 168.7l.9 11.5 .2 7.4 -.1 6.6 -.8 12.3 -1.6 12.2 -1.1 6.5 -1.2 5.6 -3.2 12 -2 6.2 -2.2 6.2 -2.8 6.9 -2.2 5 -10.7 4.9 -11.4 4.5 -11.6 4.1 -27.8 9 -15.1 5.6 -6.3 2.6 -6.9 3.1 -6.1 3 -5.9 3.3 -5.8 3.5 -5.7 3.7 -6.2 4.3 -6.7 5.1 -5.3 4.3 -7 6 -20.6 18.5 -9.3 8.1 -10.1 8.1 -10.2 7.3 -5.5-.6 -7.3-1.1 -6.5-1.1 -6.5-1.4 -11.1-3 -6.2-2 -6.2-2.2 -11.4-4.8 -6.7-3.2 -5.8-3 -10.6-6.3 -9.7-6.6 10.6-3.6 10-3.7 7.8-3.2 8.2-3.7 7.4-3.8 7.8-4.6 8.3-5.3 6.1-4.4 6.7 2.3 6 1.7 7 1.6 6.7 1.2 7.2 .8 7.8 .4 7.2 0 7.3-.4 7.2-.8 6.6-1.2 7.7-1.7 6.4-1.9 6.3-2.2 6.8-2.8 6.5-3.1 5.9-3.3 6.2-3.8 6.4-4.5 4.8-3.8 5.4-4.8 5.6-5.6 4.5-4.9 4.9-6.1 3.6-5 3.9-6.2 3.5-6.3 3.2-6.5 2.5-5.7 2.3-6.3 2.1-6.9 1.5-6 1.4-7 8.2-3.7 7.4-3.8 7.8-4.6 7-4.5 6.8-4.8 7.2-5.5 8.3-6.9 8.3-7.3zM96.4 24l10.2-5.3 9-4 10.7-4.2 9.4-3 11.1-2.9 9.7-1.9 9.8-1.4 11.5-1 9.8-.3 10.7 .3 11.5 .9 10.6 1.5 10.4 2.1 10.4 2.7 10.9 3.6 10 3.9 9.7 4.4 10.1 5.4 9.2 5.6 8.8 6.1 8.4 6.5 7.5 6.5 7.6 7.4 7.8 8.5 7.2 9 5.8 8 5.8 9 4.8 8.6 5.1 10.3 3.9 9.1 3.9 10.8 3 10.2 -17.4 15.5 -6.5 5.3 -5.4 4.2 -5.5 4.1 -6.9 4.6 -6.4 3.9 -6.2 3.5 -.7-8.1 -1.3-8.3 -1.6-7.7 -2.3-8 -2.8-7.9 -3.1-7.2 -4.1-8 -4-6.7 -4.4-6.5 -5.1-6.6 -5.2-5.9 -6.4-6.3 -5.9-5.1 -5.7-4.4 -6-4.1 -8.2-4.9 -7.5-3.7 -7.7-3.3 -8-2.7 -7-2 -7.6-1.7 -8.3-1.2 -8.3-.7 -8.4-.2 -7.9 .3 -8.8 1 -7.8 1.4 -7.6 1.8 -8 2.5 -8.3 3.2 -7.6 3.5 -6.9 3.7 -7.6 4.8 -5.9 4.3 -6.5 5.3 -5.7 5.3 -5.4 5.7 -5 6 -5.3 7.2 -4.2 6.6 -3.3 5.9 -3.6 7.5 -3.4 8.3 -2.4 7.4 -2 7.6 -1.5 7.7 -1.3 9.4 -.5 8.4 .1 8.4 .6 8.3 1.2 8.3 1.4 7.2 2 7.5 2.6 8 3.2 7.8 3.4 7 4.1 7.3 4.6 7 4.7 6.3 5.4 6.4 5.8 6 5.8 5.3 6.1 4.9 7.1 5 -6 3.6 -6.7 3.6 -6.1 3 -7.6 3.4 -7 2.9 -9.4 3.4 -19.8 6.6 -8-8.4 -6.3-7.5 -6.5-8.5 -6.4-9.6 -5.8-9.9 -4.8-9.6 -4.6-10.5 -3.4-9.3 -3.4-11 -2.5-10.4 -1.8-9.7 -1.4-11.4 -.7-9.8 -.2-12.4 .3-5.7 .4-6.6 1.1-9.8 1.8-10.5 2.4-10.4 3.2-11.1 3.9-10.8 4.6-10.6 4.7-9.6 5.4-9.2 5.3-8.3 5.8-8 7.3-8.9 7.3-7.9 7.6-7.4 8.1-7 7.8-6 9.5-6.5z"/></svg>';
    sea.appendChild(mark);
  }
  const src = hub || mark;
  const gl = cv && cv.getContext('webgl', { antialias: false, alpha: false });
  let px = 0, py = 0, mx = 0, my = 0;
  addEventListener('pointermove', e => { px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5; }, { passive: true });
  const r = document.documentElement;

  if (gl) {
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision mediump float;
uniform vec2 R;uniform float T,S,K,A;uniform vec2 M,C;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float caus(vec2 p,float t){vec2 i=p;float c=0.;for(int n=0;n<3;n++){float k=t*(1.-.3/float(n+1));i=p+vec2(cos(k-i.x)+sin(k+i.y),sin(k-i.y)+cos(k+i.x));
 c+=1./length(vec2(p.x/(sin(i.x+k)/.015),p.y/(cos(i.y+k)/.015)));}c/=3.;return pow(clamp(1.17-pow(c,1.4),0.,1.),8.);}
void main(){
 vec2 f=gl_FragCoord.xy,u=f/R;float a=R.x/R.y;vec2 q=vec2((u.x-.5)*a,u.y);
 vec3 col=mix(vec3(.012,.035,.047),vec3(.06,.2,.24),pow(u.y,1.6))*(1.-clamp(S*.0003,0.,.35));
 float ry=0.;for(int k=0;k<5;k++){float fk=float(k);float x=q.x*1.3+fk*.7+sin(T*.11+fk)*.25+M.x*.25-S*.00008;
  ry+=pow(max(0.,sin(x*3.1+fk)),12.)*(.5+.5*sin(T*.3+fk*2.));}
 col+=vec3(.55,.85,.9)*ry*.07*smoothstep(.15,1.,u.y);
 col+=vec3(.25,.75,.82)*caus(vec2(q.x*2.2,(u.y+S*.00025)*2.2)*3.+M*.4,T*.35)*(1.-u.y)*.2;
 // sonar from C (pixels), K = ring scale in pixels
 vec2 d=(f-C)/K;float L=length(d);float ring=0.;
 for(int i=0;i<4;i++){float ph=fract(T*.18+float(i)*.25);float rad=ph*7.;
  ring+=exp(-pow((L-rad)*3.2,2.))*(1.-ph)*(1.-ph);}
 float ang=atan(d.y,d.x)/6.2832+.5;float sw=pow(fract(ang+T*.07),10.)*exp(-L*.35)*smoothstep(.9,1.4,L);
 float grid=(1.-smoothstep(.0,.03,abs(fract(L*1.2)-.5)-.47))*exp(-L*.45)*.25;
 col+=vec3(.55,.9,.95)*(ring*.55+sw*.5+grid*.4)*A;
 vec2 g=f/18.+vec2(0.,S*.04+T*6.);vec2 cell=floor(g);float r=h(cell);
 if(r>.93){vec2 m=fract(g)-.5-vec2(sin(T*.6+r*40.)*.25,0.);float glow=1.+ring*6.*A;
  col+=vec3(.8,.95,.97)*smoothstep(.12,0.,length(m))*(r-.93)*8.*glow;}
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
      const U = n => gl.getUniformLocation(pr, n), uR = U('R'), uT = U('T'), uS = U('S'), uK = U('K'), uA = U('A'), uM = U('M'), uC = U('C');
      // Below native resolution: the scene is soft, and phones stay smooth and cool.
      let k = 1;
      const size = () => { k = Math.min(devicePixelRatio, 2) * (innerWidth < 900 ? .55 : .7); cv.width = innerWidth * k | 0; cv.height = innerHeight * k | 0; gl.viewport(0, 0, cv.width, cv.height); };
      size(); addEventListener('resize', size);
      const t0 = performance.now();
      const draw = now => {
        const s = scrollY, sp = Math.min(1, s / innerHeight);
        mx += (px - mx) * .05; my += (py - my) * .05;
        r.style.setProperty('--sy', s.toFixed(0)); r.style.setProperty('--sp', sp.toFixed(3));
        let cx = innerWidth * .8, cy = innerHeight * .45, rad = 90, alive = 1;
        if (src) { const b = src.getBoundingClientRect(); cx = b.left + b.width / 2; cy = b.top + b.height / 2; rad = b.width / 2;
          alive = b.bottom < -innerHeight * .6 || b.top > innerHeight * 1.6 ? .35 : 1; }
        gl.uniform2f(uR, cv.width, cv.height);
        gl.uniform1f(uT, (now - t0) / 1000);
        gl.uniform1f(uS, s);
        gl.uniform1f(uK, rad * k * 1.15);
        gl.uniform1f(uA, alive);
        gl.uniform2f(uM, mx, my);
        gl.uniform2f(uC, cx * k, (innerHeight - cy) * k);
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
        const b = el.getBoundingClientRect();
        if (b.bottom < -100 || b.top > h + 100) continue;
        el.style.transform = `translate3d(0,${((b.top + b.height / 2 - h / 2) * -.07).toFixed(1)}px,0)`;
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
