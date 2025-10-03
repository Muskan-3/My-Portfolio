// scripts.js - hero animations, laptop typing, particles, scroll reveal
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

  // Reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------------------ Laptop Typing ------------------
  (function laptopCodeTyping() {
    const typedEl = document.getElementById('laptopCode');
    if (!typedEl) return;

    const snippets = [
`// Hello 👋
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
        setTimeout(typeLoop, 90);
      } else {
        setTimeout(() => {
          charIndex = 0;
          sIndex = (sIndex + 1) % snippets.length;
          typedEl.textContent = "";
          typeLoop();
        }, 1200);
      }
    }
    typeLoop();
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

  const typingSpeed = 120;   // ms per character when typing
  const deletingSpeed = 120; // ms per character when deleting
  const pauseAfterWord = 1000; // pause when a word is complete

  function type() {
    const word = words[wordIndex];
    typedEl.textContent = word.substring(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex++;
      setTimeout(type, typingSpeed);
    } else if (!deleting && charIndex === word.length) {
      deleting = true;
      setTimeout(type, pauseAfterWord); // pause before deleting
    } else if (deleting && charIndex > 0) {
      charIndex--;
      setTimeout(type, deletingSpeed);
    } else {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, typingSpeed);
    }
  }

  type();
})();


  // ------------------ Orb Parallax ------------------
  (function orbParallax() {
    const orb = document.getElementById('heroOrb');
    if (!orb || prefersReduced) return;
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      orb.style.transform = `translate(${x * -20}px, ${y * -12}px)`;
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
      particles = Array.from({length: 40}, () => ({
        x: Math.random()*width,
        y: Math.random()*height,
        r: Math.random()*20+5,
        vx: (Math.random()-.5)*0.5,
        vy:(Math.random()-.5)*0.5,
        a:Math.random()*0.2
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

  // ------------------ Keyboard Navigation ------------------
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
          const value = entry.target.dataset.value || 0;
          progress.style.width = value + "%";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skills.forEach(skill => observer.observe(skill));
  })();

  // ------------------ Experience Timeline ------------------
  (function experienceTimeline() {
    const items = document.querySelectorAll(".timeline-item");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.2 });
    items.forEach(item => observer.observe(item));
  })();

}); // end DOMContentLoaded
let last = performance.now();
new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 40) console.warn('Long frame:', entry.duration, entry);
  }
}).observe({type: 'frame', buffered: true});
