/* ==========================================================================
   js/main.js — رفتارهای عمومی سایت
   Theme · Header · Mobile menu · Loader · Page transition · Cursor · Card renderer
   ========================================================================== */

(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Theme (Dark پیش‌فرض، ذخیره در localStorage) ---------- */
  const Theme = {
    KEY: 'ec-theme',
    init() {
      const saved = localStorage.getItem(this.KEY);
      if (saved === 'light') this.apply('light');
      $$('[data-theme-toggle]').forEach(btn =>
        btn.addEventListener('click', () => this.toggle())
      );
    },
    apply(mode) {
      document.documentElement.setAttribute('data-theme', mode);
    },
    toggle() {
      const next =
        document.documentElement.getAttribute('data-theme') === 'light'
          ? 'dark'
          : 'light';
      this.apply(next);
      localStorage.setItem(this.KEY, next);
    }
  };

  /* ---------- Header scroll state ---------- */
  const Header = {
    init() {
      const header = $('.site-header');
      if (!header) return;
      const onScroll = () =>
        header.classList.toggle('is-scrolled', window.scrollY > 12);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  };

  /* ---------- Mobile menu ---------- */
  const MobileMenu = {
    init() {
      const menu = $('#mobileMenu');
      const burger = $('#burgerBtn');
      if (!menu || !burger) return;

      const closeBtn = $('#menuClose');

      const open = () => {
        menu.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
      };
      const close = () => {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      };

      burger.addEventListener('click', open);
      closeBtn && closeBtn.addEventListener('click', close);
      menu.addEventListener('click', e => {
        if (e.target === menu) close();
      });
      $$('.m-link', menu).forEach(l => l.addEventListener('click', close));
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
      });
    }
  };

  /* ---------- Loader (کوتاه و فقط بار اول) ---------- */
  const Loader = {
    init() {
      const loader = $('#loader');
      if (!loader || sessionStorage.getItem('ec-loaded')) {
        loader && loader.remove();
        document.dispatchEvent(new CustomEvent('site:ready'));
        return;
      }
      const hide = () => {
        loader.classList.add('is-hidden');
        sessionStorage.setItem('ec-loaded', '1');
        setTimeout(() => loader.remove(), 500);
        document.dispatchEvent(new CustomEvent('site:ready'));
      };
      // حداکثر ۹۰۰ms؛ اگر صفحه سریع لود شد زودتر
      const t = setTimeout(hide, 900);
      window.addEventListener('load', () => {
        clearTimeout(t);
        setTimeout(hide, 350);
      });
    }
  };

  /* ---------- Page transition ظریف بین صفحات داخلی ---------- */
  const PageTransition = {
    init() {
      const overlay = $('#pageTransition');
      if (!overlay) return;
      $$('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (
          !href ||
          href.startsWith('#') ||
          href.startsWith('http') ||
          href.startsWith('mailto') ||
          a.target === '_blank'
        )
          return;
        a.addEventListener('click', e => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault();
          overlay.classList.add('is-active');
          setTimeout(() => (window.location.href = href), 240);
        });
      });
    }
  };

  /* ---------- Custom cursor (فقط Desktop با pointer دقیق) ---------- */
  const Cursor = {
    init() {
      if (!window.matchMedia('(pointer: fine)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const dot = document.createElement('div');
      const ring = document.createElement('div');
      dot.className = 'cursor-dot';
      ring.className = 'cursor-ring';
      document.body.append(dot, ring);

      let x = -100, y = -100, rx = -100, ry = -100, shown = false;

      window.addEventListener('mousemove', e => {
        x = e.clientX;
        y = e.clientY;
        if (!shown) {
          dot.style.opacity = '1';
          ring.style.opacity = '1';
          shown = true;
        }
        dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      });

      (function loop() {
        rx += (x - rx) * 0.16;
        ry += (y - ry) * 0.16;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      })();

      const hoverSel =
        'a, button, input, select, [role="button"], .product-card, .category-card';
      document.addEventListener('mouseover', e => {
        if (e.target.closest(hoverSel)) ring.classList.add('is-hover');
      });
      document.addEventListener('mouseout', e => {
        if (e.target.closest(hoverSel)) ring.classList.remove('is-hover');
      });
      window.addEventListener('mousedown', () => ring.classList.add('is-down'));
      window.addEventListener('mouseup', () => ring.classList.remove('is-down'));
      document.documentElement.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        shown = false;
      });
    }
  };

  /* ---------- رندر کارت محصول (مشترک بین صفحه اصلی و محصولات) ---------- */
  const CardRenderer = {
    card(p) {
      const priceHtml =
        p.price === 0
          ? '<span class="card-price is-free">رایگان</span>'
          : `<span class="card-price">${ProductsAPI.priceLabel(p.price)} <span class="unit">تومان</span></span>`;
      const demoBtn = p.demoUrl
        ? `<a class="btn btn-ghost btn-sm" href="${p.demoUrl}" target="_blank" rel="noopener">مشاهده دمو</a>`
        : `<a class="btn btn-ghost btn-sm" href="products/${p.slug}.html">جزئیات محصول</a>`;
      const pageUrl = `products/${p.slug}.html`;
      return `
        <article class="product-card" data-reveal>
          <div class="card-media">
            <a href="${pageUrl}" aria-label="${p.title}">
              <img src="${p.thumbnail}" alt="پیش‌نمایش ${p.title}" loading="lazy" decoding="async" width="600" height="375">
            </a>
            <span class="card-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </span>
          </div>
          <div class="card-body">
            <div class="card-meta">
              <span class="chip">${p.categoryLabel}</span>
              ${priceHtml}
            </div>
            <h3 class="card-title"><a href="${pageUrl}">${p.title}</a></h3>
            <p class="card-desc">${p.description}</p>
            <div class="card-actions">
              ${demoBtn}
              <a class="btn btn-primary btn-sm" href="${p.rightchinUrl}" target="_blank" rel="noopener">خرید</a>
            </div>
          </div>
        </article>`;
    },
    render(container, list) {
      if (!container) return;
      container.innerHTML = list.map(this.card).join('');
    }
  };

  /* ---------- صفحه اصلی: محصولات منتخب، دسته‌ها و لینک جدیدترین ---------- */
  const Home = {
    init() {
      const featuredGrid = $('#featuredGrid');
      if (!featuredGrid) return;

      const featured = ProductsAPI.featured();
      CardRenderer.render(featuredGrid, featured);

      // حالت خالی وقتی هنوز محصولی منتشر نشده
      if (!featured.length) {
        featuredGrid.innerHTML =
          '<div class="empty-state is-visible" style="grid-column: 1 / -1;">' +
          '<span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span>' +
          '<h3>به‌زودی</h3>' +
          '<p>محصولات جدید در حال آماده‌سازی هستند؛ به‌زودی در همین بخش منتشر می‌شوند.</p>' +
          '</div>';
      }

      const latest = ProductsAPI.latest();
      const newestLink = $$('.hero-cta .btn-ghost')[0];
      if (latest && newestLink) newestLink.setAttribute('href', `products/${latest.slug}.html`);

      const catsGrid = $('#categoriesGrid');
      if (catsGrid) {
        catsGrid.innerHTML = CATEGORIES.map(c => {
          const count = ProductsAPI.countByCategory(c.key);
          const countLabel =
            count === 0
              ? 'به‌زودی'
              : `${new Intl.NumberFormat('fa-IR').format(count)} محصول`;
          const icon = ICONS[c.icon] || ICONS.html;
          return `
            <a class="category-card" href="${c.page}" data-reveal>
              <span class="category-icon">${icon}</span>
              <h3 class="category-name">${c.title}</h3>
              <p class="category-desc">${c.description}</p>
              <span class="category-foot">
                ${countLabel}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </span>
            </a>`;
        }).join('');
      }

      const footerCats = $('#footerCats');
      if (footerCats) {
        footerCats.innerHTML = CATEGORIES.map(
          c => `<li><a href="${c.page}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            ${c.title}</a></li>`
        ).join('');
      }
    }
  };

  /* آیکون‌های Lucide به صورت inline (بدون وابستگی خارجی) */
  const ICONS = {
    wp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M3.6 9h16.8M6.2 5.3C8 8 9.4 12 10.2 17M17.8 5.3C16 8 14.6 12 13.8 17M2.5 13h19"/></svg>',
    html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>',
    plugin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>',
    script: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 17 6-6-6-6M12 19h8"/></svg>'
  };

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    Header.init();
    MobileMenu.init();
    Loader.init();
    PageTransition.init();
    Cursor.init();
    Home.init();
  });

  /* Export برای فایل‌های دیگر */
  window.EC = { $, $$, CardRenderer, Theme };
})();
