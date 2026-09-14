/**
 * LookMe demos — shared page chrome
 * از دیتای صفحه (data-* روی <body>) هدر شناور، منوی موبایل، فوتر و نوار دمو را می‌سازد
 * تا هر دمو فقط محتوای خودش را داشته باشد؛ استایل‌ها همان style.css قالب است.
 *
 * body data attributes:
 *   data-home="../index.html"       → لینک بازگشت به صفحه محصول
 *   data-buy="…"                    → لینک خرید (راست‌چین)
 *   data-brand="…"                  → نام برند دمو
 *   data-brand-sub="…"              → زیرعنوان برند
 *   data-nav='{"#hero":"خانه", …}'  → منوی تک‌صفحه‌ای
 *   data-cta="…"                    → متن دکمه هدر
 *   data-fonts='{"وزیرمتن":"Vazirmatn", …}' → انتخابگر فونت نوار دمو
 *   data-footer-about="…"           → متن فوتر
 *   data-footer-copy="…"            → کپی‌رایت
 */
(function () {
	'use strict';

	var doc = document;
	var body = doc.body;
	var I = window.LookIcons;

	var nav = {};
	try { nav = JSON.parse(body.getAttribute('data-nav') || '{}'); } catch (e) { nav = {}; }
	var fonts = {};
	try { fonts = JSON.parse(body.getAttribute('data-fonts') || '{}'); } catch (e) { fonts = {}; }

	var brand = body.getAttribute('data-brand') || 'لوک‌می';
	var brandSub = body.getAttribute('data-brand-sub') || 'LOOKME';
	var cta = body.getAttribute('data-cta') || 'شروع پروژه';
	var home = body.getAttribute('data-home') || '../index.html';
	var buy = body.getAttribute('data-buy') || '#';
	/* لوگوی اختصاصی هر دمو؛ اولویت با فایل تصویر (data-logo-src) و بعد SVG (data-logo) */
	var logoSrc = body.getAttribute('data-logo-src');
	var logoSvg = body.getAttribute('data-logo') || I.icon('star8');
	var logoHtml = logoSrc
		? '<img src="' + logoSrc + '" alt="" width="40" height="40" style="border-radius:12px;object-fit:cover;display:block;">'
		: logoSvg;

	/* ---------- مقصد لینک بازگشت (صفحه محصول) ---------- */
	var demoHome = home;

	/* ---------- Header dock ---------- */
	var navItems = Object.keys(nav).map(function (href, i) {
		return '<li style="--i:' + i + '"><a href="' + href + '">' + nav[href] + '</a></li>';
	}).join('');

	var header = doc.createElement('header');
	header.className = 'site-header';
	header.id = 'siteHeader';
	header.innerHTML =
		'<div class="container">' +
			'<div class="header-dock">' +
				'<a class="brand" href="#hero" rel="home">' +
					'<span class="brand__star">' + logoHtml + '</span>' +
					'<span>' + brand + '<small>' + brandSub + '</small></span>' +
				'</a>' +
				'<nav class="main-nav" id="mainNav" aria-label="منوی اصلی"><ul>' + navItems + '</ul></nav>' +
				'<div class="header-actions">' +
					'<a class="btn btn--primary btn--sm header-btn" href="#contact">' + cta + '</a>' +
					'<button class="theme-toggle" id="themeToggle" aria-label="تغییر حالت تاریک و روشن">' +
						'<span class="lm-icon lm-icon--moon i-moon" aria-hidden="true">' + I.get('moon') + '</span>' +
						'<span class="lm-icon lm-icon--sun i-sun" aria-hidden="true">' + I.get('sun') + '</span>' +
					'</button>' +
					'<button class="nav-toggle" id="navToggle" aria-label="باز کردن منو" aria-expanded="false">' + I.icon('menu') + '</button>' +
				'</div>' +
			'</div>' +
		'</div>';
	doc.body.insertBefore(header, doc.body.firstChild);

	/* ---------- Progress bar + skip link ---------- */
	var progress = doc.createElement('div');
	progress.className = 'progress-bar';
	progress.id = 'progressBar';
	progress.setAttribute('aria-hidden', 'true');
	progress.innerHTML = '<i></i>';
	doc.body.insertBefore(progress, header.nextSibling);

	var skip = doc.createElement('a');
	skip.className = 'skip-link';
	skip.href = '#main';
	skip.textContent = 'پرش به محتوا';
	doc.body.insertBefore(skip, doc.body.firstChild);

	/* ---------- Mobile drawer ---------- */
	var drawer = doc.createElement('div');
	drawer.className = 'drawer';
	drawer.id = 'drawer';
	drawer.setAttribute('aria-hidden', 'true');
	drawer.innerHTML =
		'<div class="drawer__backdrop" data-drawer-close></div>' +
		'<div class="drawer__panel" role="dialog" aria-modal="true" aria-label="منوی موبایل">' +
			'<div class="drawer__head">' +
				'<a class="brand" href="#hero"><span class="brand__star">' + logoHtml + '</span><span>' + brand + '</span></a>' +
				'<button class="drawer__close" data-drawer-close aria-label="بستن منو">' + I.icon('close') + '</button>' +
			'</div>' +
			'<nav aria-label="منوی موبایل"><ul>' + navItems + '</ul></nav>' +
			'<a class="btn btn--primary" href="#contact">' + cta + '</a>' +
		'</div>';
	doc.body.insertBefore(drawer, progress.nextSibling);

	/* ---------- Demo toolbar (فقط در دمو؛ بخشی از قالب نیست) ---------- */
	var fontOptions = Object.keys(fonts).map(function (label) {
		var key = fonts[label];
		return '<button type="button" data-font="' + key + '">' + label + '</button>';
	}).join('');

	var bar = doc.createElement('div');
	bar.className = 'lm-demo-bar';
	bar.setAttribute('role', 'toolbar');
	bar.setAttribute('aria-label', 'نوار دموی قالب');
	bar.innerHTML =
		'<div class="lm-demo-bar__inner">' +
			'<a class="lm-db__btn lm-db__btn--solid" href="' + demoHome + '">' + I.get('arrow-up').replace('<svg ', '<svg class="lm-db__ic" style="transform:rotate(180deg)" ') + '<span>بازگشت به صفحه محصول</span></a>' +
			'<span class="lm-db__sep" aria-hidden="true"></span>' +
			'<span class="lm-db__label lm-db__label--desc">دمو قالب — بدون بک‌اند</span>' +
			'<span class="lm-db__sep" aria-hidden="true"></span>' +
			'<div class="lm-db__group" role="group" aria-label="انتخاب فونت فارسی">' +
				'<span class="lm-db__label lm-db__label--fonts">فونت:</span>' + fontOptions +
			'</div>' +
			'<span class="lm-db__sep" aria-hidden="true"></span>' +
			'<a class="lm-db__btn" href="' + buy + '" target="_blank" rel="noopener">' + I.get('star8').replace('<svg ', '<svg class="lm-db__ic" ') + '<span>خرید قالب</span></a>' +
		'</div>';
	doc.body.appendChild(bar);

	/* ---------- Footer ---------- */
	var footerAbout = body.getAttribute('data-footer-about') || 'این یک دموی استاتیک از قالب وردپرس لوک‌می است.';
	var footerCopy = body.getAttribute('data-footer-copy') || 'دموی قالب لوک‌می';
	var footNav = Object.keys(nav).map(function (href) {
		return '<a href="' + href + '">' + nav[href] + '</a>';
	}).join('');

	var footer = doc.createElement('footer');
	footer.className = 'site-footer';
	footer.innerHTML =
		'<span class="footer__glow" aria-hidden="true"></span>' +
		'<div class="container">' +
			'<div class="footer__grid">' +
				'<div class="footer__brand">' +
					'<a class="brand" href="#hero"><span class="brand__star">' + logoHtml + '</span><span>' + brand + '</span></a>' +
					'<p class="footer__about">' + footerAbout + '</p>' +
					'<div class="contact-socials">' +
						'<a href="#" aria-label="اینستاگرام" title="اینستاگرام">' + I.icon('instagram') + '</a>' +
						'<a href="#" aria-label="تلگرام" title="تلگرام">' + I.icon('telegram') + '</a>' +
						'<a href="#" aria-label="لینکدین" title="لینکدین">' + I.icon('linkedin') + '</a>' +
						'<a href="#" aria-label="آپارات" title="آپارات">' + I.icon('aparat') + '</a>' +
					'</div>' +
				'</div>' +
				'<div><h4>دسترسی سریع</h4><div class="footer__links">' + footNav + '</div></div>' +
				'<div class="footer__news">' +
					'<h4>خبرنامه</h4>' +
					'<p>از پروژه‌های جدید و یادداشت‌های استودیو باخبر شوید.</p>' +
					'<form class="newsletter" id="newsletterForm"><input type="email" required placeholder="ایمیل شما" aria-label="ایمیل شما"><button type="submit">عضویت</button></form>' +
				'</div>' +
			'</div>' +
			'<div class="footer__bottom">' +
				'<span>© ۱۴۰۵ ' + brand + ' — ' + footerCopy + '</span>' +
				'<a href="' + demoHome + '">' + brand + '</a>' +
			'</div>' +
		'</div>';
	doc.body.appendChild(footer);

	/* ---------- To top + Lightbox ---------- */
	var toTop = doc.createElement('button');
	toTop.id = 'toTop';
	toTop.setAttribute('aria-label', 'بازگشت به بالا');
	toTop.innerHTML = I.icon('arrow-up');
	doc.body.appendChild(toTop);

	var lightbox = doc.createElement('div');
	lightbox.className = 'lightbox';
	lightbox.id = 'lightbox';
	lightbox.setAttribute('aria-hidden', 'true');
	lightbox.setAttribute('role', 'dialog');
	lightbox.setAttribute('aria-label', 'نمایش تصویر');
	lightbox.innerHTML =
		'<button class="lightbox__close" id="lightboxClose" aria-label="بستن">' + I.icon('close') + '</button>' +
		'<img alt="">' +
		'<div class="lightbox__cap"></div>';
	doc.body.appendChild(lightbox);

	/* ---------- Font switcher (فونت متن؛ فونت عناوین ثابت می‌ماند) ---------- */
	var savedFont = null;
	try { savedFont = localStorage.getItem('lm-demo-font'); } catch (e) {}
	if (savedFont) {
		doc.documentElement.style.setProperty('--font-body', "'" + savedFont + "', sans-serif");
	}
	bar.addEventListener('click', function (e) {
		var btn = e.target.closest('[data-font]');
		if (!btn) { return; }
		var f = btn.getAttribute('data-font');
		doc.documentElement.style.setProperty('--font-body', "'" + f + "', sans-serif");
		try { localStorage.setItem('lm-demo-font', f); } catch (err) {}
		bar.querySelectorAll('[data-font]').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
	});
	if (savedFont) {
		bar.querySelectorAll('[data-font]').forEach(function (b) {
			b.classList.toggle('is-active', b.getAttribute('data-font') === savedFont);
		});
	} else {
		var first = bar.querySelector('[data-font]');
		if (first) { first.classList.add('is-active'); }
	}
})();
