/* لوک‌می — اسکریپت صفحه معرفی محصول (مستقل، بدون وابستگی — سبک ورودشو) */
(function () {
  'use strict';

  /* --- هدر چسبان --- */
  var head = document.getElementById('siteHead');
  var onScroll = function () {
    head.classList.toggle('is-stuck', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- تب نسخه‌های دمو --- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.ttab'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('.shot-group'));

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.dataset.demo;
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      groups.forEach(function (g) {
        g.classList.toggle('is-active', g.dataset.group === key);
      });
    });
  });

  /* --- کلیک روی کارت دمو = باز کردن آن نسخه --- */
  document.querySelectorAll('.shot--demo').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) { return; }
      var a = card.querySelector('.demo-actions a');
      if (a) { window.location.href = a.href; }
    });
  });

  /* --- Reveal on scroll --- */
  var targets = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  if ('IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var siblings = Array.prototype.filter.call(
            el.parentElement.children,
            function (c) { return c.hasAttribute('data-reveal'); }
          );
          var idx = siblings.indexOf(el);
          el.style.transitionDelay = Math.min(idx, 5) * 80 + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }
})();
