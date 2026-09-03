// ==============================
// ANIMATIONS.JS — contact form validation + small motion helpers
// ==============================
(function () {
  'use strict';

  /* ---------- Contact form validation ---------- */
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const fields = form.querySelectorAll('[data-required]');

    function validateField(field) {
      const errorEl = form.querySelector('[data-error-for="' + field.name + '"]');
      let message = '';

      if (!field.value.trim()) {
        message = 'This field is required.';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        message = 'Enter a valid email address.';
      }

      if (errorEl) errorEl.textContent = message;
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      return !message;
    }

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    form.addEventListener('submit', function (e) {
      let valid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        e.preventDefault();
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // NOTE: This form currently submits nowhere (action="#").
      // Integrate Formspree, Netlify Forms, or a custom backend here.
      // Example (Netlify Forms): add data-netlify="true" and a hidden
      // form-name input to the <form>, then remove this preventDefault.
      e.preventDefault();
      const status = form.querySelector('[data-form-status]');
      if (status) {
        status.textContent = 'Thanks — this is a static demo, connect a form handler to receive submissions.';
      }
      form.reset();
    });
  }

  /* ---------- Cursor-aware project thumbnail tilt (desktop only, subtle) ---------- */
  const isTouch = window.matchMedia('(hover: none)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isTouch && !reducedMotion) {
    document.querySelectorAll('.work-media').forEach(function (media) {
      media.addEventListener('mousemove', function (e) {
        const rect = media.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        media.style.transform = 'translate(' + (x * 6) + 'px,' + (y * 6) + 'px)';
      });
      media.addEventListener('mouseleave', function () {
        media.style.transform = 'translate(0,0)';
      });
    });
  }
})();
