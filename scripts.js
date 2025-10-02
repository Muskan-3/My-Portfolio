// script.js
// - theme toggle
// - snap navigation handling (nav clicks + keyboard arrows)
// - project filtering
// - contact form simple handling
// - sets current year

document.addEventListener('DOMContentLoaded', () => {
  // set year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const saved = localStorage.getItem('site-theme');
  if (saved) body.className = saved;
  themeToggle?.addEventListener('click', () => {
    const next = body.classList.contains('light') ? 'dark' : 'light';
    body.className = next;
    localStorage.setItem('site-theme', next);
  });

  // nav links - smooth snap to section
  const navLinks = document.querySelectorAll('.nav a[data-target]');
  const snapContainer = document.getElementById('mainSnap');

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('data-target');
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });

  // keyboard navigation: ArrowUp / ArrowDown to move between pages
  document.addEventListener('keydown', (e) => {
    if (document.activeElement && ['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement.tagName)) return;
    if (!snapContainer) return;
    const sections = Array.from(snapContainer.querySelectorAll('.page'));
    const viewportTop = window.scrollY + 70; // topbar offset
    const currentIndex = sections.findIndex(s => {
      const rect = s.getBoundingClientRect();
      // section whose top is closest to top of viewport (accounting topbar)
      return rect.top >= -20 && rect.top < window.innerHeight/2;
    });
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (currentIndex >= 0 && currentIndex < sections.length - 1) ? sections[currentIndex + 1] : sections[0];
      next.scrollIntoView({behavior:'smooth', block:'start'});
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (currentIndex > 0) ? sections[currentIndex - 1] : sections[sections.length - 1];
      prev.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });

  // project filters
  const chips = document.querySelectorAll('.filters .chip');
  const cards = document.querySelectorAll('#projectsGrid .project-card');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const f = chip.dataset.filter;
      cards.forEach(card => {
        if (f === 'all') {
          card.style.display = '';
        } else {
          const type = card.dataset.type;
          card.style.display = (type === f) ? '' : 'none';
        }
      });
    });
    // keyboard activation
    chip.tabIndex = 0;
    chip.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') chip.click(); });
  });

  // contact form handling (simulate)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      if (!name || !email || !message) { alert('Please complete all fields.'); return; }
      const submitBtn = contactForm.querySelector('.btn.primary');
      submitBtn.disabled = true; submitBtn.textContent = 'Sending...';
      setTimeout(()=> {
        contactForm.reset();
        submitBtn.disabled = false; submitBtn.textContent = 'Send';
        alert('Message sent! I will get back to you soon.');
      }, 900);
    });
  }

  // optional: small observer to highlight current nav link based on visible section
  const sections = document.querySelectorAll('.page');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('data-target') === id));
      }
    });
  }, { root: null, threshold: 0.6 });
  sections.forEach(s => observer.observe(s));
});
