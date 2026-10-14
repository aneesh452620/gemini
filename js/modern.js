// Modern JavaScript for Gemini Circus Website

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sticky Navbar on Scroll
  const header = document.querySelector('.header-modern');
  const scrollTopBtn = document.querySelector('.scroll-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      if (header) header.classList.add('header-scrolled');
    } else {
      if (header) header.classList.remove('header-scrolled');
    }

    if (scrollTopBtn) {
      if (window.scrollY > 350) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  // Animated Counters
  const counters = document.querySelectorAll('.counter-count');
  let animated = false;

  const countUp = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target') || +counter.innerText;
      counter.innerText = prefersReducedMotion ? target.toLocaleString('en-IN') : '0';
      const speed = 40;

      const updateCount = () => {
        const current = +counter.innerText;
        const inc = Math.max(1, Math.ceil(target / speed));

        if (current < target) {
          counter.innerText = `${Math.min(target, current + inc)}`;
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = target.toLocaleString('en-IN');
        }
      };
      updateCount();
    });
  };

  if (counters.length > 0 && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          countUp();
        }
      });
    }, { threshold: 0.4 });

    const statsSection = document.querySelector('.stats-section') || counters[0].parentElement;
    if (statsSection) observer.observe(statsSection);
  }

  // Smooth scroll for anchor tags
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });
  });

  // Staggered section reveals create depth without delaying content access.
  const revealItems = document.querySelectorAll(
    '.section-head, .act-card, .glass-card, .counter-card, .person-card, .media-doc-card, .timeline-item, ' +
    '.section-heading, .portrait-card, .acts-copy, .acts-mosaic, .story-intro, .story-stack, .editorial-gallery, .visit-content'
  );

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    revealItems.forEach((item, index) => {
      item.classList.add('reveal-ready');
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

    revealItems.forEach(item => revealObserver.observe(item));
  }

  // Improve page speed while preserving the hero's immediate visual impact.
  document.querySelectorAll('img').forEach((image, index) => {
    image.decoding = 'async';
    if (index > 1 && !image.closest('.hero-circus, .page-hero')) image.loading = 'lazy';
  });

  // Keep the mobile menu from covering content after a destination is chosen.
  const navbar = document.querySelector('#circusNavbar');
  const navbarToggler = document.querySelector('[data-bs-target="#circusNavbar"]');
  if (navbar && window.bootstrap) {
    navbar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navbar.classList.contains('show')) {
          window.bootstrap.Collapse.getOrCreateInstance(navbar).hide();
        }
      });
    });
  } else if (navbar && navbarToggler) {
    navbarToggler.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('show');
      navbarToggler.setAttribute('aria-expanded', String(isOpen));
    });

    navbar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('show');
        navbarToggler.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Keep copyright dates current on every page.
  document.querySelectorAll('.footer-bottom p:first-child').forEach(line => {
    line.innerHTML = line.innerHTML.replace(/20\d{2}/, new Date().getFullYear());
  });
});
