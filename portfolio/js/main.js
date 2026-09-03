// ==============================
// MAIN.JS — global site behaviour
// ==============================
(function () {
  'use strict';

  /* ---------- Header scroll state (hide on scroll down, show on scroll up) ---------- */
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const currentY = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', currentY > 24);
      if (currentY > lastScrollY && currentY > 160) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }
    }
    updateScrollProgress(currentY);
    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ---------- Scroll progress indicator (case study pages) ---------- */
  const progressBar = document.querySelector('.scroll-progress');
  function updateScrollProgress(currentY) {
    if (!progressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (currentY / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  function openMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- IntersectionObserver reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el, i) {
      el.style.setProperty('--i', i % 6);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Subtle project image movement while scrolling ---------- */
  const motionImages = document.querySelectorAll('.portfolio-home .project-visual img');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let motionTicking = false;

  function updateScrollMotion() {
    const viewportCenter = window.innerHeight / 2;
    motionImages.forEach(function (img) {
      const rect = img.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const elementCenter = rect.top + rect.height / 2;
        const shift = Math.max(-10, Math.min(10, (viewportCenter - elementCenter) * 0.025));
        img.style.setProperty('--scroll-shift', shift.toFixed(2));
      }
    });
    motionTicking = false;
  }

  if (motionImages.length && !reduceMotion) {
    updateScrollMotion();
    window.addEventListener('scroll', function () {
      if (!motionTicking) {
        window.requestAnimationFrame(updateScrollMotion);
        motionTicking = true;
      }
    }, { passive: true });
  }

  /* ---------- Image fallback handling ---------- */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      const wrapper = img.closest('[data-img-wrapper]');
      if (wrapper) {
        wrapper.innerHTML =
          '<div class="img-placeholder">' +
          '<span class="ph-label">' + (img.dataset.label || 'Project Image') + '</span>' +
          '<span class="ph-path">Replace: ' + img.getAttribute('src') + '</span>' +
          '</div>';
      }
    }, { once: true });
  });

  /* ---------- Back to top ---------- */
  document.querySelectorAll('[data-back-to-top]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ---------- Copy email to clipboard ---------- */
  document.querySelectorAll('[data-copy-email]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const email = btn.getAttribute('data-copy-email');
      const feedback = btn.parentElement.querySelector('.copy-feedback');
      navigator.clipboard && navigator.clipboard.writeText(email).then(function () {
        if (feedback) {
          feedback.textContent = 'Copied!';
          feedback.classList.add('is-visible');
          setTimeout(function () { feedback.classList.remove('is-visible'); }, 1800);
        }
      }).catch(function () {
        /* clipboard unavailable — fail silently, mailto link still works */
      });
    });
  });

  /* ---------- Current year ---------- */
  document.querySelectorAll('[data-current-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Contextual interface icons ---------- */
  function addIcon(element, name, position) {
    if (!element || element.querySelector('[data-lucide]')) return;
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', name);
    icon.setAttribute('aria-hidden', 'true');
    icon.className = 'ui-icon';
    if (position === 'start') element.prepend(icon);
    else element.append(icon);
  }

  document.querySelectorAll('.project-copy > a').forEach(function (link) {
    link.textContent = link.textContent.replace(/[→↗]\s*$/, '').trim();
    addIcon(link, 'arrow-up-right');
  });
  document.querySelectorAll('.footer-social a').forEach(function (link) {
    addIcon(link, link.href.indexOf('tel:') === 0 ? 'phone' : 'mail', 'start');
  });
  document.querySelectorAll('.btn').forEach(function (button) {
    const href = button.getAttribute('href') || '';
    if (button.matches('[data-live]') || href.indexOf('mailto:') === 0) addIcon(button, 'arrow-up-right');
    else if (href.charAt(0) === '#') addIcon(button, 'arrow-down');
  });
  const locationLabel = document.querySelector('.portfolio-home .hero-eyebrow');
  if (locationLabel) {
    const dot = locationLabel.querySelector('.dot');
    if (dot) dot.remove();
    addIcon(locationLabel, 'map-pin', 'start');
  }
  const caseBack = document.querySelector('.case-back');
  if (caseBack) {
    const oldArrow = caseBack.querySelector('[aria-hidden="true"]');
    if (oldArrow) oldArrow.remove();
    addIcon(caseBack, 'arrow-left', 'start');
  }
  addIcon(document.querySelector('.back-to-top'), 'arrow-up');

  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.7 } });

  /* ---------- Active nav link (belt-and-braces if aria-current not set inline) ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu a').forEach(function (link) {
    const href = link.getAttribute('href') || '';
    if (href.endsWith(path) && path !== '') {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Smooth anchor scrolling for in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();
