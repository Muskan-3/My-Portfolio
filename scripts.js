// scripts.js — responsive-ready, maintains your original features + mobile nav
document.addEventListener('DOMContentLoaded', () => {
  // ---- Footer Year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Theme Toggle ----
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const saved = localStorage.getItem('site-theme');
  if (saved) body.className = saved;
  themeToggle?.addEventListener('click', () => {
    const next = body.classList.contains('light') ? 'dark' : 'light';
    body.className = next;
    localStorage.setItem('site-theme', next);
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  function openNav() {
    body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    primaryNav.hidden = false;
  }
  function closeNav() {
    body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.hidden = true;
  }

  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeNav(); else openNav();
  });

  // Close mobile nav when clicking a nav link
  primaryNav?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeNav();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  // Smooth scrolling for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      // allow normal behavior for same page hash if it's a top-level anchor without target
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // after scroll close the nav (mobile)
        closeNav();
      }
    });
  });
//  cursor // 
// Spark cursor (self-contained). Paste into scripts.js or load after DOM content.
(function () {
  if (typeof window === 'undefined') return;

  // Respect reduced-motion
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // don't create particles or custom cursor

  const canvas = document.getElementById('spark-canvas');
  const cursorWrap = document.getElementById('spark-cursor-wrap');
  const dot = document.getElementById('spark-cursor-dot');
  const ring = document.getElementById('spark-cursor-ring');
  if (!canvas || !cursorWrap || !dot || !ring) return;

  // Setup canvas
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Particle pool
  const MAX_PARTICLES = 90;
  const particles = [];
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push({
      alive: false,
      x: 0, y: 0,
      vx: 0, vy: 0,
      life: 0, ttl: 0,
      size: 0,
      hue: 0,
      alpha: 0
    });
  }

  let px = window.innerWidth / 2, py = window.innerHeight / 2; // actual mouse
  let smx = px, smy = py; // smoothed coordinates
  const SMOOTH = 0.18; // smoothing factor

  let lastMove = performance.now();
  let spawnCooldown = 0;

  function spawnParticle(x, y, speedScale = 1, palette = null) {
    // find dead particle
    for (let p of particles) {
      if (!p.alive) {
        p.alive = true;
        p.x = x + (Math.random() - 0.5) * 6;
        p.y = y + (Math.random() - 0.5) * 6;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 1.6 + 0.6) * speedScale;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed - (Math.random() * 0.8);
        p.ttl = 420 + Math.random() * 480; // lifespan (ms)
        p.life = 0;
        p.size = 1 + Math.random() * 3.6;
      p.hue = 170 + Math.random() * 10;
     
       // tight turquoise range
// tight turquoise range
 // varied Hue
        p.alpha = 0.95;
        return;
      }
    }
    // if pool exhausted, recycle the oldest
    let oldest = particles.reduce((a,b) => (a.life/a.ttl > b.life/b.ttl ? a : b));
    oldest.x = x; oldest.y = y; oldest.vx = (Math.random()-0.5)*2; oldest.vy = -Math.random()*1.2;
    oldest.life = 0; oldest.ttl = 400 + Math.random()*300; oldest.alive = true; oldest.size = 2; oldest.hue = 200;
  }

  // spawn a cluster for movement
  function spawnTrail(x, y, vxFactor=1) {
    const count = 1 + Math.floor(Math.random() * 3);
    for (let i=0;i<count;i++) spawnParticle(x, y, 0.6 * vxFactor);
  }

  // spawn burst for click
  function spawnBurst(x, y) {
    const count = 10 + Math.floor(Math.random() * 10);
    for (let i=0;i<count;i++) spawnParticle(x, y, 1.6);
  }

  // pointer handling
  let usingPointer = false;
  function onPointerMove(e) {
    usingPointer = true;
    px = e.clientX;
    py = e.clientY;
    const now = performance.now();
    const dt = now - lastMove;
    lastMove = now;

    // spawn trail with cooldown to limit density
    spawnCooldown = Math.max(0, spawnCooldown - dt);
    if (spawnCooldown <= 0) {
      spawnTrail(px, py, Math.min(2, Math.max(0.5, dt / 12)));
      spawnCooldown = 10; // ms
    }
  }

  function onPointerDown(e) {
    px = e.clientX; py = e.clientY;
    cursorWrap.classList.add('clicking');
    spawnBurst(px, py);
    // remove clicking state after short delay
    setTimeout(() => cursorWrap.classList.remove('clicking'), 140);
  }

  // support both mouse and touch pointer events gracefully
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true }); // extra safety
  window.addEventListener('mousedown', onPointerDown, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });

  // touch: translate last touch to pointer (but we hide the custom cursor on touch due to CSS)
  window.addEventListener('touchstart', (ev) => {
    if (!ev.touches || !ev.touches[0]) return;
    const t = ev.touches[0];
    px = t.clientX; py = t.clientY;
    spawnBurst(px, py);
  }, { passive: true });

  // animation loop
  let lastTS = performance.now();
  function tick(ts) {
    const dt = ts - lastTS;
    lastTS = ts;

    // smooth cursor position
    smx += (px - smx) * SMOOTH;
    smy += (py - smy) * SMOOTH;

    // position DOM cursor elements
    cursorWrap.style.transform = `translate3d(${Math.round(smx)}px, ${Math.round(smy)}px, 0)`;

    // tiny ring wobble based on velocity
    const vx = px - smx, vy = py - smy;
    const speed = Math.min(50, Math.sqrt(vx*vx + vy*vy));
    const ringScale = 1 + Math.min(0.32, speed / 160);
    ring.style.transform = `translate(-50%,-50%) scale(${ringScale})`;

    // clear and draw particles
    ctx.clearRect(0,0,W,H);
    for (let p of particles) {
      if (!p.alive) continue;
      // physics
      p.vx *= 0.995;
      p.vy += 0.02; // gravity-like
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);

      p.life += dt;
      const lifeRatio = p.life / p.ttl;

      // fade out
      p.alpha = Math.max(0, 0.95 * (1 - lifeRatio));

      // size easing
      const size = p.size * (1 - lifeRatio * 0.8);

      // draw (glowing spark)
      ctx.beginPath();
      // radial gradient for soft spark
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, size*6));
      const hue = Math.floor(p.hue);
      g.addColorStop(0, `hsla(${hue}, 100%, 65%, ${Math.min(1, p.alpha)})`);
      g.addColorStop(0.3, `hsla(${hue}, 95%, 55%, ${Math.min(0.6, p.alpha*0.75)})`);
      g.addColorStop(1, `hsla(${hue}, 70%, 45%, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(p.x - size*6, p.y - size*6, size*12, size*12);

      // small bright core
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(255,255,255, ${p.alpha * 0.5})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, size/1.7), 0, Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // kill if expired or off-screen
      if (p.life >= p.ttl || p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) {
        p.alive = false;
      }
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // hide cursor if mouse leaves window (keeps things tidy)
  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && !e.toElement) {
      // hide offscreen
      cursorWrap.style.opacity = '0';
      canvas.style.opacity = '0';
    }
  });
  window.addEventListener('mouseover', () => {
    cursorWrap.style.opacity = '1';
    canvas.style.opacity = '1';
  });

  // Accessibility: when keyboard-focus used, we may want to hide the custom cursor to avoid distraction
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      cursorWrap.style.opacity = '0';
      canvas.style.opacity = '0';
    }
  });
  window.addEventListener('mousedown', () => {
    // ensure visible on mouse interactions
    cursorWrap.style.opacity = '1';
    canvas.style.opacity = '1';
  });

})();

  // Reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------------------ Laptop Typing ------------------
  (function laptopCodeTyping() {
    const typedEl = document.getElementById('laptopCode');
    if (!typedEl) return;

    const snippets = [
`// Hello 👋 Welcome To My Portfolio 😊
const dev = "Muskan Shrivastava";
const role = "Full Stack Developer";`,
`// Skills
const stack = ["React","Node","MongoDB","HTML","CSS","JS"];`
    ];

    let sIndex = 0;
    let charIndex = 0;

    function typeLoop() {
      const src = snippets[sIndex];
      if (charIndex <= src.length) {
        typedEl.textContent = src.slice(0, charIndex++);
        setTimeout(typeLoop, 80);
      } else {
        setTimeout(() => {
          charIndex = 0;
          sIndex = (sIndex + 1) % snippets.length;
          typedEl.textContent = "";
          typeLoop();
        }, 1400);
      }
    }
    if (!prefersReduced) typeLoop();
    else typedEl.textContent = snippets[0];
  })();

  // ------------------ Hero Typing Text ------------------
  (function heroTextTyping() {
    const typedEl = document.getElementById('typedText');
    if (!typedEl) return;

    const words = [
      "Beautiful Interfaces",
      "Scalable Systems",
      "Creative Web Apps"
    ];

    let wordIndex = 0, charIndex = 0, deleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 70;
    const pauseAfterWord = 900;

    function type() {
      const word = words[wordIndex];
      typedEl.textContent = word.substring(0, charIndex);

      if (!deleting && charIndex < word.length) {
        charIndex++;
        setTimeout(type, typingSpeed);
      } else if (!deleting && charIndex === word.length) {
        deleting = true;
        setTimeout(type, pauseAfterWord);
      } else if (deleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, deletingSpeed);
      } else {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, typingSpeed);
      }
    }

    if (!prefersReduced) type();
    else typedEl.textContent = words[0];
  })();

  // ------------------ Orb Parallax ------------------
  (function orbParallax() {
    const orb = document.getElementById('heroOrb');
    if (!orb || prefersReduced) return;
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      orb.style.transform = `translate(${x * -18}px, ${y * -10}px)`;
    });
  })();

  // ------------------ Particle Background ------------------
  (function particleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = Array.from({length: Math.max(24, Math.floor(window.innerWidth / 60))}, () => ({
        x: Math.random()*width,
        y: Math.random()*height,
        r: Math.random()*20+5,
        vx: (Math.random()-.5)*0.5,
        vy:(Math.random()-.5)*0.5,
        a:Math.random()*0.18
      }));
    }

    function draw() {
      ctx.clearRect(0,0,width,height);
      for(const p of particles){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=width; if(p.x>width)p.x=0;
        if(p.y<0)p.y=height; if(p.y>height)p.y=0;

        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
        g.addColorStop(0,`rgba(124,58,237,${p.a})`);
        g.addColorStop(0.5,`rgba(59,130,246,${p.a*0.6})`);
        g.addColorStop(1,"transparent");
        ctx.fillStyle=g;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize(); draw();
    window.addEventListener("resize", resize);
  })();

  // ------------------ Scroll Reveal ------------------
  (function scrollReveal() {
    const revealElems = document.querySelectorAll('.card, .page h2, .hero-center, .page-about, .skill-card');
    const revealObserver = ('IntersectionObserver' in window)
      ? new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
            }
          });
        }, { threshold: 0.06 })
      : null;

    if (revealObserver) {
      revealElems.forEach((el) => revealObserver.observe(el));
    } else {
      revealElems.forEach(el => el.classList.add('revealed'));
    }
  })();

  // ------------------ Keyboard Navigation (small enhancement) ------------------
  (function keyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement.tagName)) return;
      const snapContainer = document.getElementById('mainSnap');
      if (!snapContainer) return;
      const sections = Array.from(snapContainer.querySelectorAll('.page'));
      if (!sections.length) return;

      const currentIndex = sections.findIndex(s => {
        const rect = s.getBoundingClientRect();
        return rect.top >= -20 && rect.top < window.innerHeight / 2;
      });

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (currentIndex >= 0 && currentIndex < sections.length - 1) ? sections[currentIndex + 1] : sections[0];
        next.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (currentIndex > 0) ? sections[currentIndex - 1] : sections[sections.length - 1];
        prev.scrollIntoView({ behavior: 'smooth' });
      }
    });
  })();

  // ------------------ Skills Progress ------------------
  (function skillsProgress() {
    const skills = document.querySelectorAll(".skill-card");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progress = entry.target.querySelector(".progress-fill");
          const value = entry.target.dataset.value || entry.target.getAttribute('data-value') || 0;
          progress.style.width = value + "%";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skills.forEach(skill => observer.observe(skill));
  })();

  // ------------------ Timeline reveal (same logic) ------------------
// Timeline: draw line + reveal connectors/cards one-by-one
(function timelineConnectorReveal() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const items = Array.from(timeline.querySelectorAll('.timeline-item'));
  if (!items.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // IntersectionObserver to reveal each item with stagger
  const io = new IntersectionObserver((entries, obs) => {
    entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => items.indexOf(a.target) - items.indexOf(b.target))
      .forEach(entry => {
        const el = entry.target;
        const idx = items.indexOf(el);
        const baseDelay = 140;
        const delay = prefersReduced ? 0 : Math.min(180 + idx * baseDelay, 900);

        // set CSS var for connector transition delay
        el.style.setProperty('--delay', `${delay}ms`);

        if (prefersReduced) {
          el.classList.add('visible');
          obs.unobserve(el);
        } else {
          setTimeout(() => {
            el.classList.add('visible');
            obs.unobserve(el);
          }, delay);
        }
      });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  items.forEach(i => io.observe(i));

  // draw the main line once the first item is visible
  const firstObserver = new IntersectionObserver((entries, fo) => {
    if (entries.some(e => e.isIntersecting)) {
      if (prefersReduced) {
        timeline.classList.add('drawn');
      } else {
        setTimeout(() => timeline.classList.add('drawn'), 100);
      }
      fo.disconnect();
    }
  }, { threshold: 0.01 });

  firstObserver.observe(items[0]);
})();

  // ------------------ Contact micro-interactions ------------------
  (function contactEnhancements(){
    const form = document.getElementById('contactForm');
    const sendBtn = form?.querySelector('.send-btn');
    const sendEmoji = sendBtn?.querySelector('.btn-emoji');
    const successBox = document.getElementById('contactSuccess');

    if (sendBtn && sendEmoji) {
      sendBtn.addEventListener('mouseenter', () => { sendEmoji.style.transform = 'translateY(-3px) rotate(-6deg)'; });
      sendBtn.addEventListener('mouseleave', () => { sendEmoji.style.transform = ''; });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (sendBtn) {
          sendBtn.disabled = true;
          sendBtn.classList.add('sending');
          sendBtn.querySelector('.btn-text').textContent = 'Sending...';
        }

        setTimeout(() => {
          if (successBox) {
            successBox.hidden = false;
            successBox.classList.add('success-pulse');
            successBox.setAttribute('aria-hidden', 'false');
          }
          if (sendEmoji) {
            sendEmoji.animate([{ transform: 'translateY(0) rotate(0) scale(1)' }, { transform: 'translateY(-18px) rotate(-16deg) scale(1.18)' }, { transform: 'translateY(0) rotate(0) scale(1)' }], { duration: 750, easing: 'cubic-bezier(.2,.9,.2,1)' });
          }
          form.reset();
          if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.classList.remove('sending');
            sendBtn.querySelector('.btn-text').textContent = 'Send';
          }
          setTimeout(() => { successBox?.classList.remove('success-pulse'); }, 900);
        }, 900);
      });
    }

    const aside = document.querySelector('.contact-aside');
    if (aside && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(ent => {
          if (ent.isIntersecting) aside.classList.add('revealed');
        });
      }, { threshold: 0.2 });
      obs.observe(aside);
    }
  })();

}); // end DOMContentLoaded

// small performance observer for dev
if (window.PerformanceObserver) {
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 40) console.warn('Long frame:', entry.duration, entry);
    }
  }).observe({type: 'frame', buffered: true});
}
  
// Animate underline when heading enters viewport
const heading = document.querySelector('.Heading-By-Me');
if (heading) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heading.classList.add('animate');
        observer.unobserve(heading); // only trigger once
      }
    });
  }, { threshold: 0.4 });

  observer.observe(heading);
}
