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
