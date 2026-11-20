// Parallax depth for the guide background, drifting motes, and the sticky pipeline tracker.
(() => {
  const r = document.documentElement, still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.querySelector('.sea canvas'), cx = cv && cv.getContext('2d');
  let W, H, motes = [];
  const size = () => {
    if (!cv) return;
    W = cv.width = innerWidth * devicePixelRatio; H = cv.height = innerHeight * devicePixelRatio;
    motes = Array.from({ length: innerWidth < 700 ? 45 : 90 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.6 + .4) * devicePixelRatio, z: Math.random() * .8 + .2, v: Math.random() * .25 + .05 }));
  };
  const frame = () => {
    const sy = scrollY;
    r.style.setProperty('--sy', sy.toFixed(0));
    r.style.setProperty('--sp', Math.min(1, sy / innerHeight).toFixed(3));
    if (cx) {
      cx.clearRect(0, 0, W, H);
      for (const m of motes) {
        if (!still) m.y -= m.v * devicePixelRatio;
        const y = ((m.y - sy * m.z * .5 * devicePixelRatio) % H + H) % H;
        cx.globalAlpha = .25 + m.z * .45; cx.fillStyle = '#cfeef2';
        cx.beginPath(); cx.arc(m.x, y, m.r * (0.6 + m.z), 0, 7); cx.fill();
      }
    }
    still || requestAnimationFrame(frame);
  };
  size(); addEventListener('resize', size); frame();
  if (still) addEventListener('scroll', frame, { passive: true });

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
