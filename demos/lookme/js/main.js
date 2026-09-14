/**
 * LookMe — front-end interactions.
 * Vanilla JS, no dependencies.
 */
(function () {
	'use strict';

	var doc = document;
	var root = doc.documentElement;

	/* ---------------- Preloader ---------------- */
	var preloader = doc.getElementById('preloader');
	if (preloader) {
		var hidePre = function () { preloader.classList.add('is-done'); };
		if (doc.readyState === 'complete') { setTimeout(hidePre, 300); }
		else {
			// محتوا آماده است؛ منتظر منابع کند (مثل iframe نقشه) نمی‌مانیم
			doc.addEventListener('DOMContentLoaded', function () { setTimeout(hidePre, 900); }, { once: true });
			window.addEventListener('load', function () { setTimeout(hidePre, 300); });
		}
		setTimeout(hidePre, 3500); // hard fallback
	}

	/* ---------------- Theme toggle ---------------- */
	var themeToggle = doc.getElementById('themeToggle');
	if (themeToggle) {
		themeToggle.addEventListener('click', function () {
			var dark = root.getAttribute('data-theme') === 'dark';
			if (dark) {
				root.removeAttribute('data-theme');
				try { localStorage.setItem('lookme-theme', 'light'); } catch (e) {}
			} else {
				root.setAttribute('data-theme', 'dark');
				try { localStorage.setItem('lookme-theme', 'dark'); } catch (e) {}
			}
		});
	}

	/* ---------------- Header: scrolled state + smart hide + progress ---------------- */
	var header = doc.getElementById('siteHeader');
	var progressBar = doc.getElementById('progressBar');
	var lastY = window.scrollY;
	var ticking = false;

	var onScroll = function () {
		var y = window.scrollY;
		if (header) {
			header.classList.toggle('is-scrolled', y > 30);
			if (y > 400 && y > lastY + 6) {
				header.classList.add('is-hidden');
			} else if (y < lastY - 4 || y < 200) {
				header.classList.remove('is-hidden');
			}
		}
		if (progressBar) {
			var h = doc.documentElement.scrollHeight - window.innerHeight;
			progressBar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
		}
		lastY = y;
		ticking = false;
	};
	window.addEventListener('scroll', function () {
		if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
	}, { passive: true });
	onScroll();

	/* ---------------- Mobile drawer ---------------- */
	var drawer = doc.getElementById('drawer');
	var navToggle = doc.getElementById('navToggle');
	var openDrawer = function (open) {
		if (!drawer) { return; }
		drawer.classList.toggle('is-open', open);
		drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
		if (navToggle) { navToggle.setAttribute('aria-expanded', open ? 'true' : 'false'); }
		doc.body.style.overflow = open ? 'hidden' : '';
	};
	if (navToggle) {
		navToggle.addEventListener('click', function () { openDrawer(!(drawer && drawer.classList.contains('is-open'))); });
	}
	if (drawer) {
		drawer.querySelectorAll('[data-drawer-close]').forEach(function (el) {
			el.addEventListener('click', function () { openDrawer(false); });
		});
		drawer.querySelectorAll('a').forEach(function (a) {
			a.addEventListener('click', function () { openDrawer(false); });
		});
	}
	doc.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			openDrawer(false);
			closeLightbox();
		}
	});

	/* ---------------- Scroll reveal ---------------- */
	var revealEls = Array.prototype.slice.call(doc.querySelectorAll('[data-reveal]'));
	if ('IntersectionObserver' in window && revealEls.length) {
		var revealIO = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (en.isIntersecting) {
					en.target.classList.add('is-visible');
					revealIO.unobserve(en.target);
				}
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
		revealEls.forEach(function (el) { revealIO.observe(el); });
	} else {
		revealEls.forEach(function (el) { el.classList.add('is-visible'); });
	}

	/* ---------------- Persian-digit helpers ---------------- */
	var FA = '۰۱۲۳۴۵۶۷۸۹';
	var toEn = function (s) { return String(s).replace(/[۰-۹]/g, function (d) { return FA.indexOf(d); }); };
	var toFa = function (s) { return String(s).replace(/[0-9]/g, function (d) { return FA[+d]; }); };
	var groupFa = function (n) { return toFa(String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); };

	/* ---------------- Counters ---------------- */
	var counters = Array.prototype.slice.call(doc.querySelectorAll('[data-count]'));
	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var runCounter = function (el) {
		var raw = toEn(el.getAttribute('data-count') || el.textContent || '').trim();
		var pre = raw.match(/^([^\d]*)([\d.,]+)(.*)$/);
		if (!pre) { return; }
		var prefix = pre[1] || '';
		var suffix = pre[3] || '';
		var target = parseFloat(pre[2].replace(/,/g, ''));
		if (isNaN(target)) { return; }
		var decimals = (pre[2].indexOf('.') > -1) ? (pre[2].split('.')[1] || '').length : 0;
		var finish = function () {
			var out = decimals ? String(target.toFixed(decimals)) : String(Math.round(target));
			el.textContent = prefix + groupFa(out) + suffix;
		};
		if (reduceMotion) { finish(); return; }
		var dur = 1500;
		var t0 = null;
		var step = function (ts) {
			if (!t0) { t0 = ts; }
			var p = Math.min((ts - t0) / dur, 1);
			var eased = 1 - Math.pow(1 - p, 3);
			var val = target * eased;
			var out = decimals ? val.toFixed(decimals) : Math.round(val);
			el.textContent = prefix + groupFa(out) + suffix;
			if (p < 1) { window.requestAnimationFrame(step); }
		};
		window.requestAnimationFrame(step);
	};
	if (counters.length) {
		if ('IntersectionObserver' in window) {
			var cIO = new IntersectionObserver(function (entries) {
				entries.forEach(function (en) {
					if (en.isIntersecting) { runCounter(en.target); cIO.unobserve(en.target); }
				});
			}, { threshold: 0.6 });
			counters.forEach(function (el) { cIO.observe(el); });
		} else {
			counters.forEach(runCounter);
		}
	}

	/* ---------------- Word rotator (hero) ---------------- */
	var bodyMotion = (doc.body && doc.body.classList.contains('lm-anim-none')) ? 'none'
		: (doc.body && doc.body.classList.contains('lm-anim-flat')) ? 'flat'
		: (doc.body && doc.body.classList.contains('lm-anim-lite')) ? 'lite' : 'full';
	var rotator = doc.getElementById('lmRotator');
	if (rotator && 'none' !== bodyMotion && 'flat' !== bodyMotion) {
		var words = [];
		try { words = JSON.parse(rotator.getAttribute('data-words') || '[]'); } catch (e) { words = []; }
		if (words.length > 1) {
			var wi = 0;
			var wordEl = rotator.querySelector('.rotator__word');
			setInterval(function () {
				var cur = rotator.querySelector('.rotator__word');
				if (!cur) { return; }
				cur.classList.add('is-out');
				setTimeout(function () {
					wi = (wi + 1) % words.length;
					var next = doc.createElement('span');
					next.className = 'rotator__word';
					next.textContent = words[wi];
					rotator.innerHTML = '';
					rotator.appendChild(next);
				}, 380);
			}, 2600);
		}
	}

	/* ---------------- Mobile drawer: stagger index ---------------- */
	var drawerNav = doc.querySelector('.drawer nav');
	if (drawerNav) {
		var dLinks = Array.prototype.slice.call(drawerNav.querySelectorAll('ul > li > a'));
		dLinks.forEach(function (a, i) {
			a.parentElement.style.setProperty('--i', i);
		});
	}

	/* ---------------- Scrollspy + smooth anchor offset ---------------- */
	var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.main-nav a[href^="#"], .drawer nav a[href^="#"]'))
		.filter(function (a) { return (a.getAttribute('href') || '').length > 1; });
	var spySections = navLinks
		.map(function (a) { return doc.querySelector(a.getAttribute('href')); })
		.filter(Boolean);
	var spy = function () {
		var pos = window.scrollY + (parseInt(getComputedStyle(doc.documentElement).getPropertyValue('--header-h'), 10) || 80) + 40;
		var currentId = '';
		spySections.forEach(function (sec) {
			if (sec.offsetTop <= pos) { currentId = '#' + sec.id; }
		});
		navLinks.forEach(function (a) {
			a.classList.toggle('is-active', a.getAttribute('href') === currentId);
		});
	};
	window.addEventListener('scroll', function () {
		window.requestAnimationFrame(spy);
	}, { passive: true });
	spy();

	/* ---------------- Portfolio filter ---------------- */
	var pfButtons = Array.prototype.slice.call(doc.querySelectorAll('.pf-btn'));
	var pfItems = Array.prototype.slice.call(doc.querySelectorAll('.pf-item'));
	pfButtons.forEach(function (btn) {
		btn.addEventListener('click', function () {
			pfButtons.forEach(function (b) { b.classList.remove('is-active'); });
			btn.classList.add('is-active');
			var f = btn.getAttribute('data-filter');
			pfItems.forEach(function (item) {
				var show = (f === '*') || (item.getAttribute('data-cat') === f);
				if (show) {
					item.classList.remove('is-hidden');
					window.requestAnimationFrame(function () { item.classList.remove('is-hiding'); });
				} else {
					item.classList.add('is-hiding');
					setTimeout(function () {
						if (item.classList.contains('is-hiding')) { item.classList.add('is-hidden'); }
					}, 380);
				}
			});
		});
	});

	/* ---------------- Lightbox ---------------- */
	var lightbox = doc.getElementById('lightbox');
	var lbImg = lightbox ? lightbox.querySelector('img') : null;
	var lbCap = lightbox ? lightbox.querySelector('.lightbox__cap') : null;
	var lbLastFocus = null;
	var closeLightbox = function () {
		if (lightbox && lightbox.classList.contains('is-open')) {
			lightbox.classList.remove('is-open');
			lightbox.setAttribute('aria-hidden', 'true');
			doc.body.style.overflow = '';
			if (lbLastFocus) { lbLastFocus.focus({ preventScroll: true }); lbLastFocus = null; }
		}
	};
	if (lightbox) {
		pfItems.forEach(function (item) {
			item.addEventListener('click', function () {
				var img = item.querySelector('img');
				var t = item.querySelector('h3');
				if (!img || !lbImg) { return; }
				lbLastFocus = item; // فوکوس به کارت فعال برمی‌گردد
				lbImg.src = img.src;
				lbImg.alt = img.alt;
				if (lbCap) { lbCap.textContent = t ? t.textContent : ''; }
				lightbox.classList.add('is-open');
				lightbox.setAttribute('aria-hidden', 'false');
				doc.body.style.overflow = 'hidden';
				lightbox.querySelector('.lightbox__close').focus();
			});
		});
		lightbox.addEventListener('click', function (e) {
			if (e.target === lightbox || e.target.id === 'lightboxClose' || e.target.closest('#lightboxClose')) { closeLightbox(); }
		});
		/* دام فوکوس — Tab داخل دیالوگ می‌ماند */
		lightbox.addEventListener('keydown', function (e) {
			if ('Tab' !== e.key) { return; }
			var focusables = lightbox.querySelectorAll('button, [href]');
			if (!focusables.length) { return; }
			var first = focusables[0], last = focusables[focusables.length - 1];
			if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
			else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
		});
	}

	/* ---------------- FAQ accordion ---------------- */
	doc.querySelectorAll('.faq-item').forEach(function (item) {
		var q = item.querySelector('.faq-q');
		if (!q) { return; }
		q.addEventListener('click', function () {
			var isOpen = item.classList.contains('is-open');
			doc.querySelectorAll('.faq-item.is-open').forEach(function (other) {
				other.classList.remove('is-open');
				var oq = other.querySelector('.faq-q');
				if (oq) { oq.setAttribute('aria-expanded', 'false'); }
			});
			if (!isOpen) {
				item.classList.add('is-open');
				q.setAttribute('aria-expanded', 'true');
			}
		});
	});

	/* ---------------- Contact form (AJAX) ----------------
	   همه فرم‌های تماس (PHP یا ویجت المنتوری، حتی چندتایی در یک صفحه) بسته می‌شوند. */
	if (window.lookmeData) {
		Array.prototype.slice.call(doc.querySelectorAll('form.contact-form')).forEach(function (form) {
			var status = form.querySelector('.form-status');
			if (!status) { return; }
			form.addEventListener('submit', function (e) {
				e.preventDefault();
				var btn = form.querySelector('button[type="submit"]');
				var name = form.querySelector('[name="c_name"]');
				var email = form.querySelector('[name="c_email"]');
				var msg = form.querySelector('[name="c_msg"]');

				status.className = 'form-status';
				if (!name || !email || !msg || !name.value.trim() || !email.value.trim() || !msg.value.trim()) {
					status.classList.add('is-err');
					status.textContent = 'لطفاً فیلدهای ستاره‌دار را کامل کنید.';
					return;
				}
				btn.disabled = true;
				var oldHtml = btn.innerHTML;
				btn.textContent = lookmeData.i18n.sending;

				var fd = new FormData(form);
				fd.append('action', 'lookme_contact');
				fd.append('nonce', lookmeData.nonce);

				fetch(lookmeData.ajaxUrl, { method: 'POST', body: fd, credentials: 'same-origin' })
					.then(function (r) { return r.json(); })
					.then(function (res) {
						if (res && res.success) {
							status.classList.add('is-ok');
							status.textContent = lookmeData.i18n.ok;
							form.reset();
						} else {
							status.classList.add('is-err');
							status.textContent = (res && res.data && res.data.msg) ? res.data.msg : lookmeData.i18n.err;
						}
					})
					.catch(function () {
						status.classList.add('is-err');
						status.textContent = lookmeData.i18n.err;
					})
					.finally(function () {
						btn.disabled = false;
						btn.innerHTML = oldHtml;
					});
			});
		});
	}

	/* ---------------- Newsletter (AJAX) — عضویت واقعی: ایمیل به مدیر ارسال می‌شود ---------------- */
	var news = doc.getElementById('newsletterForm');
	if (news && window.lookmeData) {
		news.addEventListener('submit', function (e) {
			e.preventDefault();
			var b = news.querySelector('button');
			var input = news.querySelector('input[type="email"]');
			var email = (input && input.value) ? input.value.trim() : '';
			if (!email) { return; }
			var oldLabel = b.textContent;
			b.disabled = true;
			b.textContent = '…';
			var fd = new FormData();
			fd.append('action', 'lookme_newsletter');
			fd.append('nonce', lookmeData.nonce);
			fd.append('n_email', email);
			fetch(lookmeData.ajaxUrl, { method: 'POST', body: fd, credentials: 'same-origin' })
				.then(function (r) { return r.json(); })
				.then(function (res) {
					b.textContent = (res && res.success) ? '✓ ' + ((res.data && res.data.msg) ? res.data.msg : lookmeData.i18n.nl_ok) : '✗ ' + ((res && res.data && res.data.msg) ? res.data.msg : lookmeData.i18n.nl_err);
					if (res && res.success && input) { input.value = ''; }
				})
				.catch(function () { b.textContent = '✗ ' + lookmeData.i18n.nl_err; })
				.finally(function () {
					b.disabled = false;
					setTimeout(function () { b.textContent = oldLabel; }, 2600);
				});
		});
	}

	/* ---------------- Copy wallet ---------------- */
	var copyBtn = doc.getElementById('copyWallet');
	if (copyBtn) {
		copyBtn.addEventListener('click', function () {
			var addr = doc.getElementById('walletAddr');
			if (!addr) { return; }
			var text = addr.textContent.trim();
			var done = function () {
				copyBtn.textContent = '✓ کپی شد';
				addr.classList.add('is-copied');
				setTimeout(function () {
					copyBtn.textContent = 'کپی آدرس';
					addr.classList.remove('is-copied');
				}, 2200);
			};
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(text).then(done).catch(done);
			} else {
				var ta = doc.createElement('textarea');
				ta.value = text;
				doc.body.appendChild(ta);
				ta.select();
				try { doc.execCommand('copy'); } catch (e) {}
				doc.body.removeChild(ta);
				done();
			}
		});
	}

	/* ---------------- Services — تیلت + نورافکن + آیکون مغناطیسی ----------------
	   فقط با موس دقیق؛ روی لمس و prefers-reduced-motion غیرفعال است. */
	(function () {
		var grid = doc.querySelector('.services__grid');
		if (!grid) { return; }
		if (!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches)) { return; }
		var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) { return; }
		var MAX = 3.2;           // حداکثر تیلت (درجه)
		var MAG = 4;             // کشش آیکون (پیکسل)
		var clamp = function (v, m) { return Math.max(-m, Math.min(m, v)); };
		grid.addEventListener('pointermove', function (e) {
			var card = e.target.closest('.service-card');
			if (!card) { return; }
			var r = card.getBoundingClientRect();
			var px = (e.clientX - r.left) / r.width;
			var py = (e.clientY - r.top) / r.height;
			card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
			card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
			card.style.setProperty('--rx', (-clamp(py - 0.5, 0.5) * 2 * MAX).toFixed(2) + 'deg');
			card.style.setProperty('--ry', (clamp(px - 0.5, 0.5) * 2 * MAX).toFixed(2) + 'deg');
			var icon = card.querySelector('.service-card__icon');
			if (icon) {
				// کشش مغناطیسی آیکون به سمت نشانگر
				var ir = icon.getBoundingClientRect();
				var dx = e.clientX - (ir.left + ir.width / 2);
				var dy = e.clientY - (ir.top + ir.height / 2);
				icon.style.setProperty('--gx', clamp(dx / 14, MAG).toFixed(1) + 'px');
				icon.style.setProperty('--gy', clamp(dy / 14, MAG).toFixed(1) + 'px');
			}
		}, { passive: true });
		grid.addEventListener('pointerleave', function () {
			Array.prototype.forEach.call(grid.querySelectorAll('.service-card'), function (card) {
				card.style.setProperty('--rx', '0deg');
				card.style.setProperty('--ry', '0deg');
				var icon = card.querySelector('.service-card__icon');
				if (icon) { icon.style.setProperty('--gx', '0px'); icon.style.setProperty('--gy', '0px'); }
			});
		});
	})();

	/* ---------------- To top ---------------- */
	var toTop = doc.getElementById('toTop');
	if (toTop) {
		window.addEventListener('scroll', function () {
			toTop.classList.toggle('is-show', window.scrollY > 600);
		}, { passive: true });
		toTop.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

	/* ---------------- Gallery deck — درگ با فیزیک فنری ----------------
	   دِک: کارت فعال وسط، همسایه‌ها با مقیاس/گردش کمتر. درگ موس و لمس،
	   پرتاب با اینرسی، اسنپ فنری، پارالاکس داخلی عکس. RTL کاملاً آگاه. */
	(function () {
		var deck = doc.getElementById('lookmeDeck');
		if (!deck) { return; }
		var stage = deck.querySelector('.deck__stage');
		var cards = Array.prototype.slice.call(deck.querySelectorAll('.deck__card'));
		var n = cards.length;
		if (!stage || n < 2) { return; }
		var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		var dir = (doc.documentElement.getAttribute('dir') === 'rtl') ? -1 : 1;
		var idx = 0, off = 0;              // موقعیت پیوسته = idx + off
		var dragging = false, startX = 0, startOff = 0, vel = 0, lastX = 0, lastT = 0;
		var raf = null;

		var faD = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
		var faNum = function (v) { return String(v).replace(/[0-9]/g, function (d) { return faD[+d]; }); };
		var counter = deck.querySelector('.deck__counter b');
		var bar = deck.querySelector('.deck__bar i');
		var setCounter = function (v) {
			if (!counter) { return; }
			var txt = faNum(v + 1);
			var cur = counter.querySelector('span.is-in');
			if (cur && cur.textContent === txt) { return; }
			if (!cur) { counter.textContent = ''; }
			if (cur) { cur.classList.remove('is-in'); cur.classList.add('is-out'); setTimeout(function () { cur.remove(); }, 460); }
			var inn = doc.createElement('span');
			inn.textContent = txt;
			counter.appendChild(inn);
			requestAnimationFrame(function () { requestAnimationFrame(function () { inn.classList.add('is-in'); }); });
		};
		var setProgress = function (v) {
			if (bar) { bar.style.setProperty('--progress', (((v + 1) / n) * 100) + '%'); }
		};

		var stepPx = function () { return cards[0].offsetWidth * 0.62; };
		var wrapRel = function (p) {
			var r = ((p % n) + n) % n;
			if (r > n / 2) { r -= n; }
			return r;
		};
		/* نقاشی دِک: x/گردش/مقیاس هر کارت از موقعیت نسبی wrap‌شده */
		var paint = function () {
			raf = null;
			var w = stepPx();
			for (var i = 0; i < n; i++) {
				var p = wrapRel(i - idx - off);
				var ap = Math.abs(p);
				var sgn = (p < 0 ? -1 : 1);
				var x = p * w * (0.55 + Math.min(ap, 2) * 0.22) * dir;
				var y = Math.min(ap, 3) * 14;
				var s = 1 - Math.min(ap, 3) * 0.085;
				var r = -sgn * Math.min(ap, 2) * 2.6;
				var vis = ap < 2.6;
				cards[i].style.zIndex = String(100 - Math.round(ap * 10));
				cards[i].style.transform = 'translate(calc(-50% + ' + x.toFixed(1) + 'px), calc(-50% + ' + y.toFixed(1) + 'px)) rotate(' + r.toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
				cards[i].dataset.deckState = vis ? '' : 'far';
				var img = cards[i].firstElementChild;
				if (img) {
					var shift = vis ? Math.max(-12, Math.min(12, -x * 0.05)) : 0;
					img.style.transform = 'scale(1.14) translateX(' + shift.toFixed(1) + 'px)';
				}
			}
		};
		var schedule = function () { if (!raf) { raf = requestAnimationFrame(paint); } };
		var render = function (v) { setCounter(typeof v === 'number' ? v : idx); setProgress(typeof v === 'number' ? v : idx); schedule(); };

		var snap = function (target) {
			idx = ((target % n) + n) % n;
			off = 0;
			render(idx);
		};
		/* پرتاب نرم به اسلاید هدف (کلیک دکمه‌ها هم از همین مسیر می‌گذرد) */
		var glide = function (target) {
			var startIdx = idx, startRaw = idx + off;
			target = Math.max(-1, Math.min(n, target));
			var t0 = null, dur = reduce ? 0 : 540;
			var anim = function (ts) {
				if (!t0) { t0 = ts; }
				var p = dur ? Math.min((ts - t0) / dur, 1) : 1;
				var e = 1 - Math.pow(1 - p, 3);
				var cur = startRaw + (target - startRaw) * e;
				off = cur - startIdx;
				var vi = ((Math.round(cur) % n) + n) % n;
				render(vi);
				if (p < 1) { requestAnimationFrame(anim); }
				else { snap(target); }
			};
			requestAnimationFrame(anim);
		};
		var go = function (dirF) { glide(idx + dirF); };

		/* درگ موس و لمس */
		var down = function (x) {
			dragging = true; startX = x; startOff = off; vel = 0; lastX = x; lastT = performance.now();
			deck.classList.add('is-dragging');
		};
		var move = function (x) {
			if (!dragging) { return; }
			var dx = x - startX;
			off = startOff - dx / (stepPx() * dir);
			var now = performance.now();
			if (now > lastT) { vel = (x - lastX) / (now - lastT); lastX = x; lastT = now; }
			schedule();
		};
		var up = function () {
			if (!dragging) { return; }
			dragging = false;
			deck.classList.remove('is-dragging');
			var raw = idx + off;
			var velSlides = vel * 0.18;
			var boost = Math.abs(velSlides) > 0.3 ? (velSlides > 0 ? -dir : dir) : 0;
			var target = Math.max(0, Math.min(n - 1, Math.round(raw + boost * 0.45)));
			glide(target);
		};

		stage.addEventListener('pointerdown', function (e) { down(e.clientX); });
		window.addEventListener('pointermove', function (e) { move(e.clientX); }, { passive: true });
		window.addEventListener('pointerup', up);
		window.addEventListener('pointercancel', up);
		stage.addEventListener('dragstart', function (e) { e.preventDefault(); });
		stage.addEventListener('click', function (e) { if (Math.abs(off) > 0.14) { e.preventDefault(); e.stopPropagation(); } }, true);
		deck.querySelector('[data-deck="prev"]').addEventListener('click', function () { go(-1); });
		deck.querySelector('[data-deck="next"]').addEventListener('click', function () { go(1); });
		doc.addEventListener('keydown', function (e) {
			/* حین تایپ در فیلدها یا ادیتورها، پیکان‌ها اسلاید را عوض نکنند */
			var t = e.target;
			if (t && (t.closest && (t.closest('input, textarea, select, [contenteditable], [contenteditable] *')))) { return; }
			var r = deck.getBoundingClientRect();
			if (r.top < window.innerHeight && r.bottom > 0 && !dragging) {
				if (e.key === 'ArrowRight') { go(dir === -1 ? -1 : 1); }
				if (e.key === 'ArrowLeft') { go(dir === -1 ? 1 : -1); }
			}
		});
		var rto = null;
		window.addEventListener('resize', function () { clearTimeout(rto); rto = setTimeout(schedule, 120); });

		render(idx);
	})();

	/* ---------------- Intro — پارالاکس اسکرول افتتاحیه ----------------
	   لایه عکس با اسکرول کندتر حرکت می‌کند؛ در reduced-motion خاموش. */
	(function () {
		if ('full' !== bodyMotion) { return; }
		var media = doc.querySelector('.cine__media');
		if (!media) { return; }
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
		var raf = null, ticking = false;
		var paint = function () {
			raf = null; ticking = false;
			var y = window.scrollY;
			if (y > window.innerHeight * 1.2) { return; }
			media.style.transform = 'translate3d(0,' + (y * 0.32).toFixed(1) + 'px,0)';
		};
		window.addEventListener('scroll', function () {
			if (!ticking) { ticking = true; if (!raf) { raf = requestAnimationFrame(paint); } }
		}, { passive: true });
		paint();
	})();
})();
