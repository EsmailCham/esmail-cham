/**
 * LookMe demos — demo-mode handlers (بدون بک‌اند)
 * در نسخه وردپرس، ارسال فرم با AJAX واقعی انجام می‌شود؛
 * در دموی استاتیک، همین رفتار با اعتبارسنجی سمت مرورگر شبیه‌سازی شده است.
 */
(function () {
	'use strict';

	var doc = document;

	/* فرم تماس — اعتبارسنجی + پیام موفقیت (شبیه‌سازی) */
	doc.querySelectorAll('form.contact-form').forEach(function (form) {
		var status = form.querySelector('.form-status');
		if (!status) { return; }
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			var name = form.querySelector('[name="c_name"]');
			var email = form.querySelector('[name="c_email"]');
			var msg = form.querySelector('[name="c_msg"]');
			var btn = form.querySelector('button[type="submit"]');

			status.className = 'form-status';
			if (!name || !email || !msg || !name.value.trim() || !email.value.trim() || !msg.value.trim()) {
				status.classList.add('is-err');
				status.textContent = 'لطفاً فیلدهای ستاره‌دار را کامل کنید.';
				return;
			}
			if (btn) { btn.disabled = true; }
			var oldHtml = btn ? btn.innerHTML : '';
			if (btn) { btn.textContent = 'در حال ارسال…'; }

			setTimeout(function () {
				status.classList.add('is-ok');
				status.textContent = 'پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.';
				form.reset();
				if (btn) { btn.disabled = false; btn.innerHTML = oldHtml; }
			}, 700);
		});
	});

	/* خبرنامه — شبیه‌سازی عضویت */
	var news = doc.getElementById('newsletterForm');
	if (news) {
		news.addEventListener('submit', function (e) {
			e.preventDefault();
			var b = news.querySelector('button');
			var input = news.querySelector('input[type="email"]');
			var email = (input && input.value) ? input.value.trim() : '';
			if (!email) { return; }
			var oldLabel = b.textContent;
			b.disabled = true;
			b.textContent = '…';
			setTimeout(function () {
				b.textContent = '✓ عضویت شما ثبت شد.';
				if (input) { input.value = ''; }
				b.disabled = false;
				setTimeout(function () { b.textContent = oldLabel; }, 2600);
			}, 600);
		});
	}

	/* گالری لایت‌باکس دموها — صفحه معرفی محصول */
	var lb = doc.getElementById('lmLb');
	if (lb) {
		var lbImg = lb.querySelector('img');
		var lbCap = lb.querySelector('.lm-cap');
		doc.querySelectorAll('[data-lightbox]').forEach(function (item) {
			item.addEventListener('click', function (e) {
				if (e.target.closest('a, button')) { return; }
				var img = item.querySelector('img');
				if (!img || !lbImg) { return; }
				var t = item.getAttribute('data-title') || '';
				var d = item.getAttribute('data-desc') || '';
				var link = item.getAttribute('data-link') || '';
				lbImg.src = img.currentSrc || img.src;
				lbImg.alt = img.alt;
				if (lbCap) {
					lbCap.innerHTML = '<b>' + t + '</b>' + (d ? '<span>' + d + '</span>' : '') +
						(link ? '<a href="' + link + '" target="_blank" rel="noopener">مشاهده دمو</a>' : '');
				}
				lb.classList.add('is-open');
				lb.setAttribute('aria-hidden', 'false');
				doc.body.style.overflow = 'hidden';
			});
		});
		var closeLb = function () {
			lb.classList.remove('is-open');
			lb.setAttribute('aria-hidden', 'true');
			doc.body.style.overflow = '';
		};
		lb.addEventListener('click', function (e) {
			if (e.target === lb || e.target.closest('[data-lm-close]')) { closeLb(); }
		});
		doc.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') { closeLb(); }
		});
	}
})();
