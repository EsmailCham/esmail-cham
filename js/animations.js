/* ==========================================================================
   js/animations.js — GSAP + ScrollTrigger
   Hero intro · Scroll reveals · Parallax ظریف · Reduced-motion aware
   اسکرول کاملاً Native است (بدون Smooth Scroll) برای تجربه کاربرپسند.
   ========================================================================== */

(function () {
  'use strict';

  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';

  /* عناصر Hero — پیش از اولین paint مخفی می‌شوند تا انیمیشن ورود تمیز باشد.
     اگر GSAP لود نشده باشد، هیچ چیز مخفی نمی‌ماند. */
  const HERO_ITEMS = ['.site-header', '.hero-kicker', '.hero-title', '.hero-headline', '.hero-desc', '.hero-cta', '.hero-scroll'];

  if (hasGSAP && !reduceMotion) {
    window.gsap.set(HERO_ITEMS.join(','), { opacity: 0 });
    window.gsap.set('.site-header', { y: -18 });
    $$('.hero-kicker, .hero-title, .hero-headline, .hero-desc, .hero-cta, .hero-scroll').forEach(el => {
      window.gsap.set(el, { y: 28 });
    });
    $$('.hero-orb').forEach(el => window.gsap.set(el, { opacity: 0 }));
  }

  /* ---------- Hero intro timeline ---------- */
  function heroIntro() {
    if (!hasGSAP || reduceMotion) return;
    const tl = window.gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.9 },
      delay: 0.2
    });

    tl.to(HERO_ITEMS.join(','), {
      y: 0,
      opacity: 1,
      stagger: 0.09,
      clearProps: 'transform'
    });

    // عناصر تزئینی با ظهور بسیار نرم
    const orbs = $$('.hero-orb');
    orbs.forEach((orb, i) => {
      const target = i === 0 ? 0.9 : 0.55;
      tl.to(orb, { opacity: target, duration: 1.5, ease: 'power2.out' }, 0.2 + i * 0.15);
      if (!reduceMotion) {
        window.gsap.to(orb, {
          x: i % 2 === 0 ? 30 : -30,
          y: i % 2 === 0 ? -20 : 24,
          duration: 12 + i * 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.5
        });
      }
    });
  }

  /* ---------- Split text ظریف برای تیترهای اصلی ---------- */
  function splitHeadings() {
    if (!hasST || reduceMotion) return;
    $$('.split-heading').forEach(el => {
      if (el.dataset.splitDone) return;
      const text = el.textContent.trim();
      el.setAttribute('aria-label', text);
      el.innerHTML = text
        .split(' ')
        .map(w => `<span class="split-word" aria-hidden="true">${w}</span>`)
        .join(' ');
      el.dataset.splitDone = '1';
      window.gsap.from(el.querySelectorAll('.split-word'), {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.045
      });
    });
  }

  /* ---------- Reveal on scroll (data-reveal) ---------- */
  function scrollReveals() {
    const targets = $$('[data-reveal]');
    if (!targets.length) return;

    if (!hasST || reduceMotion) return; // عناصر بدون انیمیشن visible می‌مانند

    // گروه‌بندی بر اساس والد برای stagger طبیعی
    $$('[data-reveal-group]').forEach(group => {
      const cards = group.querySelectorAll('[data-reveal]');
      if (!cards.length) return;
      window.gsap.fromTo(
        cards,
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: group, start: 'top 82%', once: true }
        }
      );
    });

    // عناصر منفرد
    targets
      .filter(t => !t.closest('[data-reveal-group]'))
      .forEach(t => {
        window.gsap.fromTo(
          t,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: t, start: 'top 88%', once: true }
          }
        );
      });
  }

  /* ---------- Parallax خیلی ظریف ---------- */
  function parallax() {
    if (!hasST || reduceMotion) return;
    $$('.hero-bg').forEach(bg => {
      window.gsap.to(bg, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
      });
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    if (hasST) window.ScrollTrigger.refresh();
    heroIntro();
    splitHeadings();
    scrollReveals();
    parallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 60));
  } else {
    setTimeout(boot, 60);
  }
})();
