/* =========================================================
   SAMRA FATIMA — PORTFOLIO SCRIPT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PRELOADER ---------- */

const loader = document.getElementById("loader");

if (loader) {

    // Hide loader when page is completely loaded
    window.addEventListener("load", () => {
        requestAnimationFrame(() => {
            loader.classList.add("hide");
        });
    });

}

  /* ---------- CUSTOM CURSOR: bracket + spark trail ---------- */
  const glyph = document.getElementById('cursor-glyph');
  const trailCanvas = document.getElementById('cursor-trail');
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  if (fine && glyph && trailCanvas) {
    glyph.innerHTML = '<span class="br l">&lt;</span><span class="lbl"></span><span class="br r">&gt;</span>';
    const label = glyph.querySelector('.lbl');

    let mx = 0, my = 0, gx = 0, gy = 0;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    window.addEventListener('mousedown', () => glyph.classList.add('click'));
    window.addEventListener('mouseup', () => glyph.classList.remove('click'));

    function raf() {
      gx += (mx - gx) * 0.22;
      gy += (my - gy) * 0.22;
      glyph.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    }
    raf();

    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        glyph.classList.add('grow');
        label.textContent = el.getAttribute('data-cursor') || '';
      });
      el.addEventListener('mouseleave', () => {
        glyph.classList.remove('grow');
        label.textContent = '';
      });
    });

    /* spark trail */
    const tctx = trailCanvas.getContext('2d');
    let points = [];
    function resizeTrail() { trailCanvas.width = window.innerWidth; trailCanvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeTrail);
    resizeTrail();
    window.addEventListener('mousemove', (e) => {
      points.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (points.length > 40) points.shift();
    });
    function drawTrail() {
      tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.life -= 0.045;
        if (p.life <= 0) continue;
        const r = 2.4 * p.life;
        const grad = tctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        grad.addColorStop(0, `rgba(226,163,64,${0.45 * p.life})`);
        grad.addColorStop(1, `rgba(127,214,201,0)`);
        tctx.fillStyle = grad;
        tctx.beginPath();
        tctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        tctx.fill();
      }
      points = points.filter(p => p.life > 0);
      requestAnimationFrame(drawTrail);
    }
    drawTrail();

    /* magnetic buttons */
    document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${relX * 0.22}px, ${relY * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });
  } else {
    if (glyph) glyph.style.display = 'none';
    if (trailCanvas) trailCanvas.style.display = 'none';
  }

  /* ---------- ACTIVE NAV LINK ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- PAGE TRANSITIONS ---------- */
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || a.target === '_blank') return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add("page-exit");

if(loader){
    loader.classList.remove("hide");
}

setTimeout(() => {
    window.location.href = href;
},350);
    });
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- SKILL BAR FILL ---------- */
  const bars = document.querySelectorAll('.bar-fill');
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('filled');
        barIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => barIO.observe(b));

  /* ---------- TYPED TERMINAL LINE (home only) ---------- */
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const phrases = ["training models on real data...", "shipping Flutter interfaces...", "building full-stack systems...", "debugging at 2am, shipping by 9am..."];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let pIndex = 0, cIndex = 0, deleting = false;
    function typeLoop() {
      if (reduceMotion) { typedEl.textContent = phrases[0]; return; }
      const current = phrases[pIndex];
      typedEl.textContent = current.slice(0, cIndex);
      if (!deleting && cIndex < current.length) { cIndex++; setTimeout(typeLoop, 45); }
      else if (!deleting && cIndex === current.length) { deleting = true; setTimeout(typeLoop, 1500); }
      else if (deleting && cIndex > 0) { cIndex--; setTimeout(typeLoop, 25); }
      else { deleting = false; pIndex = (pIndex + 1) % phrases.length; setTimeout(typeLoop, 300); }
    }
    typeLoop();
  }

  /* ---------- NEURAL NODE CANVAS (home only) ---------- */
  const canvas = document.getElementById('node-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [];
    const heroEl = canvas.closest('.hero');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      W = canvas.width = heroEl.offsetWidth;
      H = canvas.height = heroEl.offsetHeight;
    }
    function initNodes() {
      const count = Math.max(18, Math.floor(W / 90));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 1
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(127,214,201,${0.14 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(226,163,64,0.55)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    window.addEventListener('resize', () => { resize(); initNodes(); });
    resize(); initNodes(); draw();
  }

  /* ---------- PROJECT FILTER (projects page only) ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.p-card');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tag = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
          const tags = (card.getAttribute('data-tags') || '').split(',');
          if (tag === 'all' || tags.includes(tag)) card.classList.remove('hide');
          else card.classList.add('hide');
        });
      });
    });
  }

  /* ---------- CONTACT FORM (static demo) ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      const original = btn.textContent;
      btn.textContent = 'Message sent ✓';
      btn.style.filter = 'brightness(1.15)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.filter = '';
        form.reset();
      }, 2200);
    });
  }

  /* ---------- BACK TO TOP ---------- */
  const toTop = document.getElementById('to-top');
  if (toTop) {
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
// Fix browser back/forward cache issue
window.addEventListener("pageshow", function () {

    document.body.classList.remove("page-exit");

    const loader = document.getElementById("loader");

    if(loader){
        loader.classList.add("hide");
    }

});
