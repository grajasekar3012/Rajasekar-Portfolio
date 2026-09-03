// ==============================
// PROJECTS.JS — category filtering on projects.html
// ==============================
(function () {
  'use strict';

  const filterButtons = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('[data-category]');

  if (!filterButtons.length || !workItems.length) return;

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      const category = btn.getAttribute('data-filter');

      workItems.forEach(function (item) {
        const categories = (item.getAttribute('data-category') || '').split(' ');
        const show = category === 'all' || categories.indexOf(category) !== -1;
        item.classList.toggle('is-hidden', !show);
      });
    });
  });
})();
