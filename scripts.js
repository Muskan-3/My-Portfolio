// scripts.js - interactive hero animations, typed hero words, laptop typing overlay, and scroll reveal
document.addEventListener('DOMContentLoaded', () => {
  // ---- Basic / theme ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const saved = localStorage.getItem('site-theme');
  if (saved) body.className = saved;
  themeToggle?.addEventListener('click', () => {
    const next = body.classList.contains('light') ? 'dark' : 'light';
    body.className = next;
    localStorage.setItem('site-theme', next);
  });

  // unified reduced-motion flag
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------------------ Option A: Laptop mock typing ------------------
  (function laptopCodeTyping() {
    const typedEl = document.getElementById('laptopCode');
    if (!typedEl) return;

    const snippets = [
`// Hello 👋
const dev = "Muskan Shrivastava";
const role = "Full Stack Developer";

function greet(){
  return \`Hi, I'm \${dev} — I build beautiful web experiences.\`;
}
`,
`// Tech stack
const stack = ["React","Node","MongoDB","HTML","CSS","JS"];
stack.forEach(s => console.log(s));
`,
`// Availability
if (openForInternships) {
  apply();
}
`
    ];

    function colorize(raw) {
      return raw
        .replace(/(\/\/.*?$)/gm, '<span class="code-comment">$1</span>')
        .replace(/"(.*?)"/g, '<span class="code-key">"$1"</span>')
        .replace(/\b(const|function|return|if|forEach|for|let|var|class|new)\b/g, '<span class="code-fn">$1</span>')
        .replace(/\b(React|Node|MongoDB|HTML|CSS|JS|openForInternships|apply|stack|dev|role|greet)\b/g, '<span class="code-sec">$1</span>');
    }

    if (prefersReduced) {
      typedEl.innerHTML = colorize(snippets[0]) + ' <span class="laptop-caret" aria-hidden="true"></span>';
      return;
    }

    let sIndex = 0;
    let charIndex = 0;
    let current = '';
    const typingSpeed = 30; // ms per char
    const pauseAfter = 1200;

    function typeLoop() {
      const src = snippets[sIndex];
      if (charIndex <= src.length) {
        current = src.slice(0, charIndex);
        typedEl.innerHTML = colorize(current) + '<span class="laptop-caret" aria-hidden="true"></span>';
        charIndex++;
        setTimeout(typeLoop, typingSpeed);
      } else {
        setTimeout(() => {
          charIndex = 0;
          sIndex = (sIndex + 1) % snippets.length;
          typedEl.innerHTML = '';
          setTimeout(typeLoop, 220);
        }, pauseAfter);
      }
    }

    setTimeout(typeLoop, 600);
  })();
  // ------------------ end laptop typing ------------------



  // --- TYPO / WORD-CYCLER (typewriter on desktop, fade-cycle on small/mobile, reduced-motion safe) ---
  (function heroTextWorker() {
    const typedEl = document.getElementById('typedWords') || document.getElementById('typedText');
    if (!typedEl) return;

    const words = [
      "Designs That Flow Like Clouds, Seamless and Light",
      "Creativity That Scales Like the Cloud",
      "Code That Ships Fast & Reliable",
      "Beautiful Interfaces • Scalable Systems"
    ];

    const isMobileLike = window.matchMedia('(max-width:600px)').matches;
    let typingTimer = null;
    let cycleTimer = null;
    let abort = false;

    function typewriterRun() {
      let wIndex = 0;
      let charIndex = 0;
      let deleting = false;
      const typeSpeed = 100;
      const eraseSpeed = 35;
      const pauseBetween = 1400;

      function tick() {
        if (abort) return;
        const currentWord = words[wIndex];
        if (!deleting) {
          typedEl.textContent = currentWord.slice(0, charIndex + 1);
          charIndex++;
          if (charIndex === currentWord.length) {
            deleting = true;
            typingTimer = setTimeout(tick, pauseBetween);
            return;
          }
        } else {
          typedEl.textContent = currentWord.slice(0, charIndex - 1);
          charIndex--;
          if (charIndex === 0) {
            deleting = false;
            wIndex = (wIndex + 1) % words.length;
          }
        }
        typingTimer = setTimeout(tick, deleting ? eraseSpeed : typeSpeed);
      }
      tick();
    }

    function fadeCycleRun() {
      let index = 0;
      const showTime = 2200;
      function showNext() {
        if (abort) return;
        typedEl.innerHTML = '';
        const span = document.createElement('span');
        span.className = 'cycle-word';
        span.textContent = words[index];
        typedEl.appendChild(span);
        index = (index + 1) % words.length;
        cycleTimer = setTimeout(showNext, showTime);
      }
      showNext();
    }

    if (prefersReduced) {
      typedEl.textContent = words[0];
    } else if (isMobileLike) {
      fadeCycleRun();
    } else {
      typewriterRun();
    }

    window.addEventListener('beforeunload', () => {
      abort = true;
      clearTimeout(typingTimer);
      clearTimeout(cycleTimer);
    }, { once: true });
  });

  // --- Parallax orb following mouse (subtle) ---
  (function orbParallax() {
    const orb = document.getElementById('heroOrb');
    if (!orb || prefersReduced) return;
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      orb.style.transform = `translate3d(${x * -12}px, ${y * -8}px, 0) rotate(18deg)`;
    });
  })();

  // --- Particle / soft bubbles background using canvas ---
  (function particleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;
    let rafId;
    const particles = [];
    let NUM = Math.floor(Math.min(width, 600) / 40);

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function makeParticles() {
      particles.length = 0;
      NUM = Math.max(6, Math.floor(Math.min(width, 800) / 40));
      for (let i = 0; i < NUM; i++) {
        particles.push({
          x: rand(0, width),
          y: rand(0, height),
          r: rand(8, 28),
          vx: rand(-0.2, 0.2),
          vy: rand(-0.15, 0.15),
          alpha: rand(0.03, 0.12)
        });
      }
    }

    function resize() {
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
      makeParticles();
    }
    window.addEventListener('resize', () => {
      cancelAnimationFrame(rafId);
      resize();
      animate();
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -60) p.x = width + 60;
        if (p.x > width + 60) p.x = -60;
        if (p.y < -60) p.y = height + 60;
        if (p.y > height + 60) p.y = -60;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(124,58,237,${p.alpha})`);
        g.addColorStop(0.4, `rgba(59,130,246,${p.alpha * 0.6})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function animate() {
      draw();
      rafId = requestAnimationFrame(animate);
    }

    resize();
    animate();
  })();

  // --- Scroll reveal for cards & sections ---
  (function scrollReveal() {
    const revealElems = document.querySelectorAll('.card, .page h2, .hero-center, .page-about, .skill-card');
    const observerOptions = {
      threshold: 0.06,
      rootMargin: '0px 0px -10% 0px'
    };

    const revealObserver = ('IntersectionObserver' in window)
      ? new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              // unobserve if you only want one-time reveal:
              // obs.unobserve(entry.target);
            }
          });
        }, observerOptions)
      : null;

    if (revealObserver) {
      revealElems.forEach((el) => revealObserver.observe(el));
      // fallback: ensure elements become visible after a short delay if the observer misses
      setTimeout(() => {
        revealElems.forEach(el => el.classList.add('revealed'));
      }, 900);
    } else {
      revealElems.forEach(el => el.classList.add('revealed'));
    }
  })();

  // --- small keyboard nav (ArrowUp, ArrowDown) ---
  (function keyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement.tagName)) return;
      const snapContainer = document.getElementById('mainSnap');
      if (!snapContainer) return;
      const sections = Array.from(snapContainer.querySelectorAll('.page'));
      if (!sections.length) return;

      const viewportTop = window.scrollY + 70; // rough header offset
      const currentIndex = sections.findIndex(s => {
        const rect = s.getBoundingClientRect();
        return rect.top >= -20 && rect.top < window.innerHeight / 2;
      });

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (currentIndex >= 0 && currentIndex < sections.length - 1) ? sections[currentIndex + 1] : sections[0];
        // use header-aware scroll
        const header = document.querySelector('header') || document.querySelector('.site-header') || document.querySelector('.topbar');
        const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
        const top = Math.max(0, next.getBoundingClientRect().top + window.pageYOffset - headerH - 8);
        window.scrollTo({ top, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (currentIndex > 0) ? sections[currentIndex - 1] : sections[sections.length - 1];
        const header = document.querySelector('header') || document.querySelector('.site-header') || document.querySelector('.topbar');
        const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
        const top = Math.max(0, prev.getBoundingClientRect().top + window.pageYOffset - headerH - 8);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  })();

  // --- existing project filters and contact form handling (kept simple) ---
  (function filtersAndContact() {
    const chips = document.querySelectorAll('.filters .chip');
    const projectCards = document.querySelectorAll('#projectsGrid .project-card');
    if (chips.length && projectCards.length) {
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          const f = chip.dataset.filter;
          projectCards.forEach(card => {
            if (f === 'all') {
              card.style.display = '';
            } else {
              const type = card.dataset.type;
              card.style.display = (type === f) ? '' : 'none';
            }
          });
        });
        chip.tabIndex = 0;
        chip.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); } });
      });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();
        if (!name || !email || !message) { alert('Please complete all fields.'); return; }
        const submitBtn = contactForm.querySelector('.btn.primary');
        if (submitBtn) {
          submitBtn.disabled = true; submitBtn.textContent = 'Sending...';
        }
        setTimeout(()=> {
          contactForm.reset();
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send'; }
          alert('Message sent! I will get back to you soon.');
        }, 900);
      });
    }
  })();

  // --- optional: highlight nav based on visible section ---
  (function navHighlight() {
    const pageSections = document.querySelectorAll('.page[id]');
    if (!pageSections.length) return;

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll('.nav a').forEach(a => {
            // support data-target or href
            const target = a.dataset.target || (a.getAttribute('href') ? a.getAttribute('href').replace('#','') : '');
            a.classList.toggle('active', target === id);
          });
        }
      });
    }, { root: null, threshold: 0.6 });

    pageSections.forEach(s => navObserver.observe(s));
  })();

}); // end DOMContentLoaded
// skills.js
// Handles filtering and animating progress bars when visible (IntersectionObserver).
// Accessible: updates aria-selected on tabs and supports keyboard navigation.

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const skillsGrid = document.getElementById('skillsGrid');
  const skillItems = Array.from(document.querySelectorAll('.skill-item'));

  // --- Filtering logic ---
  function setFilter(filter) {
    filterButtons.forEach(btn => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) btn.focus(); // mild focus affordance
    });

    skillItems.forEach(item => {
      const cat = item.dataset.category || 'all';
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  // attach click handlers
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
    });

    // keyboard support: Enter and Space activate
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // default filter
  setFilter('all');

  // --- Progress animation when visible ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px', // trigger a little earlier
    threshold: 0.15
  };

  const animateProgress = (progressEl) => {
    const target = Number(progressEl.dataset.value) || 0;
    const fill = progressEl.querySelector('.progress-fill');
    if (!fill) return;
    // If already animated to target, skip
    const currentWidth = parseFloat(fill.style.width) || 0;
    if (currentWidth >= target) return;

    // set width to target% (CSS handles smooth transition)
    requestAnimationFrame(() => {
      fill.style.width = `${target}%`;
    });

    // Add numeric label for screen readers (one-time)
    if (!progressEl.querySelector('.sr-value')) {
      const sr = document.createElement('span');
      sr.className = 'sr-value';
      sr.style.position = 'absolute';
      sr.style.left = '-9999px';
      sr.style.width = '1px';
      sr.style.height = '1px';
      sr.style.overflow = 'hidden';
      sr.textContent = `${target}% proficiency`;
      progressEl.appendChild(sr);
    }
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateProgress(entry.target);
      }
    });
  }, observerOptions);

  // observe every progress element
  document.querySelectorAll('.progress').forEach(p => io.observe(p));

  // --- Optional: animate bars on filter show ---
  // When switching filters, animate visible items' progress bars slightly.
  const filterObserver = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      document.querySelectorAll('.skill-item:not(.hidden) .progress').forEach(p => {
        // re-run animation (if already set, animateProgress will bail out)
        animateProgress(p);
      });
    });
  });

  filterObserver.observe(skillsGrid, { attributes: true, subtree: true, attributeFilter: ['class'] });

  // --- Keyboard shortcuts (optional) ---
  // 1,2,3,4 quick switches
  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return; // ignore modified combos
    switch (e.key) {
      case '1': setFilter('all'); break;
      case '2': setFilter('frontend'); break;
      case '3': setFilter('backend'); break;
      case '4': setFilter('tools'); break;
    }
  });

  // --- Graceful fallback: if IntersectionObserver unsupported, animate all immediately ---
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.progress').forEach(p => {
      const t = Number(p.dataset.value) || 0;
      const fill = p.querySelector('.progress-fill');
      if (fill) fill.style.width = `${t}%`;
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelectorAll(".skill-card");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = entry.target.querySelector(".progress-fill");
        const value = entry.target.dataset.value || 0;
        progress.style.width = value + "%";
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.3 });

  skills.forEach(skill => observer.observe(skill));
});


// experience
// Small animation when items come into view
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => {
    observer.observe(item);
  });
});
