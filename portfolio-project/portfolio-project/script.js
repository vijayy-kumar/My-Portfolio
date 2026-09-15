          (function () {
            var form = document.getElementById('contactForm');
            var status = document.getElementById('formStatus');
            if (!form) return;
            form.addEventListener('submit', function (e) {
              e.preventDefault();
              var data = new FormData(form);
              var btn = form.querySelector('.form-submit');
              btn.disabled = true;
              status.style.color = '';
              status.textContent = 'Sending...';
              fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
              }).then(function (response) {
                if (response.ok) {
                  status.style.color = 'green';
                  status.textContent = "Thanks! Your message has been sent.";
                  form.reset();
                } else {
                  return response.json().then(function (data) {
                    status.style.color = 'red';
                    if (data && data.errors) {
                      status.textContent = data.errors.map(function (err) { return err.message; }).join(', ');
                    } else {
                      status.textContent = 'Oops! Something went wrong. Please try again.';
                    }
                  });
                }
              }).catch(function () {
                status.style.color = 'red';
                status.textContent = 'Network error. Please try again later.';
              }).finally(function () {
                btn.disabled = false;
              });
            });
          })();

// Typing effect for hero subtitle
const typedEl = document.getElementById('typedText');
const typedRoles = ['BCA Student', 'Aspiring Software Developer', 'Python Developer', 'Problem Solver'];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typedEl) {
  if (prefersReducedMotion) {
    typedEl.textContent = typedRoles[0];
  } else {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentRole = typedRoles[roleIndex];
      let delay = 90;

      if (!isDeleting) {
        charIndex++;
        typedEl.textContent = currentRole.slice(0, charIndex);
        if (charIndex === currentRole.length) {
          isDeleting = true;
          delay = 1400;
        }
      } else {
        charIndex--;
        typedEl.textContent = currentRole.slice(0, charIndex);
        delay = 45;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % typedRoles.length;
          delay = 250;
        }
      }

      setTimeout(tick, delay);
    };

    tick();
  }
}

// Scroll reveal animation
const revealTargets = document.querySelectorAll(
  '.eyebrow, .section-title, .section-sub, .subsection-title, .about-card, .edu-card, .whatido-card, .about-quote, .about-cta, .skill-group, .skills-summary, .timeline-item, .cert-card, .project-card, .resume-inner, .beyond-card, .beyond-footer-quote, .contact-grid, .contact-form, .stat, .projects-more, .footer-brand, .footer-connect, .footer-explore'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

// Stagger siblings that share the same parent for a smoother cascade
const staggerParents = new Set();
revealTargets.forEach((el) => staggerParents.add(el.parentElement));
staggerParents.forEach((parent) => {
  const siblings = Array.from(parent.children).filter((c) => c.classList.contains('reveal'));
  siblings.forEach((sibling, i) => {
    sibling.style.transitionDelay = `${Math.min(i * 0.08, 0.4)}s`;
  });
});

if (prefersReducedMotion) {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('nav-open', isOpen);
});

// Close mobile menu after tapping a link
mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
  });
});

// Highlight active nav link based on scroll position
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-desktop a, .nav-mobile a');

const setActiveLink = () => {
  let current = sections[0]?.id;
  const offset = 100;

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - offset) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

// Certificate slider dots (mobile)
const certGrid = document.getElementById('certGrid');
const certDots = document.querySelectorAll('.cert-dot');

if (certGrid && certDots.length) {
  const getStep = () => {
    const cards = certGrid.querySelectorAll('.cert-card');
    if (cards.length < 2) return cards[0]?.offsetWidth || 1;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  };

  const updateCertDots = () => {
    const step = getStep();
    const index = Math.round(certGrid.scrollLeft / step);
    certDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  certGrid.addEventListener('scroll', updateCertDots, { passive: true });

  certDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const cards = certGrid.querySelectorAll('.cert-card');
      cards[i]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
  });
}

// Beyond Code slider dots (mobile)
const beyondGrid = document.getElementById('beyondGrid');
const beyondDots = document.querySelectorAll('.beyond-dot');

if (beyondGrid && beyondDots.length) {
  const getBeyondStep = () => {
    const cards = beyondGrid.querySelectorAll('.beyond-card');
    if (cards.length < 2) return cards[0]?.offsetWidth || 1;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  };

  const updateBeyondDots = () => {
    const step = getBeyondStep();
    const index = Math.round(beyondGrid.scrollLeft / step);
    beyondDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  beyondGrid.addEventListener('scroll', updateBeyondDots, { passive: true });

  beyondDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const cards = beyondGrid.querySelectorAll('.beyond-card');
      cards[i]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
  });
}

