/* ==========================================================================
   js/product.js — صفحه اختصاصی محصول
   از data-slug روی <body> استفاده می‌کند و محتوا را از PRODUCTS رندر می‌کند.
   ========================================================================== */

(function () {
  'use strict';

  const { $, $$ } = window.EC;

  const iconCheck =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  function faDate(iso) {
    try {
      return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long' }).format(new Date(iso));
    } catch (e) {
      return iso;
    }
  }

  function init() {
    const slug = document.body.dataset.slug;
    if (!slug) return;
    const p = ProductsAPI.bySlug(slug);

    if (!p) {
      window.location.replace('../404.html');
      return;
    }

    /* --- سربرگ --- */
    document.title = `${p.title} | اسماعیل چام`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', p.description);
    const crumb = $('#crumbCurrent');
    if (crumb) crumb.textContent = p.title;

    /* --- بخش معرفی --- */
    const chip = $('#pCategory');
    if (chip) chip.textContent = p.categoryLabel;

    const title = $('#pTitle');
    if (title) title.textContent = p.title;

    const desc = $('#pShort');
    if (desc) desc.textContent = p.description;

    const price = $('#pPrice');
    if (price) {
      if (p.price === 0) {
        price.textContent = 'رایگان';
        price.classList.add('is-free');
      } else {
        price.innerHTML = `${ProductsAPI.priceLabel(p.price)} <span class="unit">تومان</span>`;
      }
    }

    const date = $('#pDate');
    if (date) date.textContent = faDate(p.date);

    const ver = $('#pVersion');
    if (ver) ver.textContent = p.version;

    const buy = $('#pBuy');
    if (buy) buy.href = p.rightchinUrl;

    const demo = $('#pDemo');
    if (demo) {
      if (p.demoUrl) {
        demo.href = '../' + p.demoUrl;
        demo.target = '_blank';
        demo.rel = 'noopener';
      } else {
        demo.style.display = 'none';
      }
    }

    const buyBottom = $('#pBuyBottom');
    if (buyBottom) buyBottom.href = p.rightchinUrl;

    const demoBottom = $('#pDemoBottom');
    if (demoBottom) {
      if (p.demoUrl) {
        demoBottom.href = '../' + p.demoUrl;
        demoBottom.target = '_blank';
      } else {
        demoBottom.style.display = 'none';
      }
    }

    const tags = $('#pTags');
    if (tags) {
      tags.innerHTML = (p.tags || [])
        .map(t => `<span class="tag">${t}</span>`)
        .join('');
    }

    /* --- گالری --- */
    const mainImg = $('#galleryMain');
    const thumbs = $('#galleryThumbs');
    if (mainImg && thumbs && p.gallery && p.gallery.length) {
      const base = '../';
      mainImg.src = base + p.gallery[0];
      mainImg.alt = `پیش‌نمایش ${p.title}`;
      thumbs.innerHTML = p.gallery
        .map(
          (src, i) =>
            `<button type="button" class="${i === 0 ? 'is-active' : ''}" data-src="${src}" aria-label="تصویر ${i + 1}"><img src="${base}${src}" alt="" loading="lazy" decoding="async"></button>`
        )
        .join('');
      $$('button', thumbs).forEach(btn => {
        btn.addEventListener('click', () => {
          $$('button', thumbs).forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          mainImg.src = base + btn.dataset.src;
        });
      });
    }

    /* --- توضیحات، ویژگی‌ها، تکنولوژی --- */
    const features = $('#pFeatures');
    if (features) {
      features.innerHTML = (p.features || [])
        .map(f => `<li>${iconCheck}<span>${f}</span></li>`)
        .join('');
    }

    const tech = $('#pTech');
    if (tech) {
      tech.innerHTML = (p.tech || []).map(t => `<span class="tag">${t}</span>`).join('');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
