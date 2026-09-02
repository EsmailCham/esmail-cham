/* ==========================================================================
   js/filters.js — صفحه محصولات
   جستجوی زنده · فیلتر نوع و قیمت · مرتب‌سازی · همگام‌سازی با URL
   ========================================================================== */

(function () {
  'use strict';

  const { $, $$, CardRenderer } = window.EC;

  function init() {
    const grid = $('#productsGrid');
    if (!grid) return;

    const searchInput = $('#searchInput');
    const catGroup = $('#catFilters');
    const priceGroup = $('#priceFilters');
    const sortSelect = $('#sortSelect');
    const countEl = $('#resultsCount');
    const emptyEl = $('#emptyState');

    const state = {
      q: '',
      cat: 'all',
      price: 'all',
      sort: 'newest'
    };

    /* --- URL params (شروع از state ذخیره‌شده) --- */
    const params = new URLSearchParams(location.search);
    if (params.get('cat')) state.cat = params.get('cat');
    if (params.get('q')) state.q = params.get('q');
    if (params.get('sort')) state.sort = params.get('sort');
    if (params.get('price')) state.price = params.get('price');

    /* --- منطق فیلتر --- */
    function apply() {
      let list = [...ProductsAPI.all()];

      if (state.cat !== 'all') {
        list = list.filter(p => p.category === state.cat);
      }

      if (state.price === 'free') {
        list = list.filter(p => p.price === 0);
      } else if (state.price === 'cheap') {
        // ارزان‌ترین: نیمه پایینی قیمت‌ها (به جز رایگان‌ها)
        const paid = list.filter(p => p.price > 0).sort((a, b) => a.price - b.price);
        const half = paid.slice(0, Math.max(1, Math.ceil(paid.length / 2))).map(p => p.id);
        list = list.filter(p => p.price === 0 || half.includes(p.id));
      } else if (state.price === 'expensive') {
        // گران‌ترین: نیمه بالایی قیمت‌ها
        const paid = list.filter(p => p.price > 0).sort((a, b) => b.price - a.price);
        const half = paid.slice(0, Math.max(1, Math.ceil(paid.length / 2))).map(p => p.id);
        list = list.filter(p => half.includes(p.id));
      }

      if (state.q) {
        const q = state.q.trim().toLowerCase();
        list = list.filter(p =>
          [p.title, p.description, p.categoryLabel, ...(p.tags || [])]
            .join(' ')
            .toLowerCase()
            .includes(q)
        );
      }

      const sorters = {
        newest: (a, b) => new Date(b.date) - new Date(a.date),
        oldest: (a, b) => new Date(a.date) - new Date(b.date),
        cheap: (a, b) => a.price - b.price,
        expensive: (a, b) => b.price - a.price
      };
      list.sort(sorters[state.sort] || sorters.newest);

      CardRenderer.render(grid, list);

      if (countEl) {
        countEl.innerHTML = `<strong>${new Intl.NumberFormat('fa-IR').format(list.length)}</strong> محصول`;
      }

      if (emptyEl) emptyEl.classList.toggle('is-visible', list.length === 0);

      // همگام‌سازی URL
      const sp = new URLSearchParams();
      if (state.cat !== 'all') sp.set('cat', state.cat);
      if (state.price !== 'all') sp.set('price', state.price);
      if (state.sort !== 'newest') sp.set('sort', state.sort);
      if (state.q) sp.set('q', state.q);
      const qs = sp.toString();
      history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
    }

    /* --- فعال‌سازی دکمه فیلتر --- */
    function bindGroup(groupEl, key) {
      if (!groupEl) return;
      groupEl.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        $$('.filter-btn', groupEl).forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state[key] = btn.dataset.value;
        apply();
      });
      // مقدار اولیه از URL
      $$('.filter-btn', groupEl).forEach(b => {
        b.classList.toggle('is-active', b.dataset.value === state[key]);
      });
    }

    bindGroup(catGroup, 'cat');
    bindGroup(priceGroup, 'price');

    if (sortSelect) {
      sortSelect.value = state.sort;
      sortSelect.addEventListener('change', () => {
        state.sort = sortSelect.value;
        apply();
      });
    }

    if (searchInput) {
      searchInput.value = state.q;
      let timer;
      searchInput.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          state.q = searchInput.value;
          apply();
        }, 180);
      });
    }

    apply();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
