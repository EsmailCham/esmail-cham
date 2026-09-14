/**
 * LookMe demos — icon library (پرتاب از PHP به JS)
 * Same «تراش» icon set as the WordPress theme; no external icon font.
 * Usage: LookIcons.icon('star8') → '<span class="lm-icon ..." ...>...</span>'
 *        LookIcons.get('star8')  → inner SVG only
 */
(function () {
	'use strict';

	var A = 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';

	var icons = {
		star8: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.8" y="5.8" width="12.4" height="12.4" rx="1.5"/><rect x="5.8" y="5.8" width="12.4" height="12.4" rx="1.5" transform="rotate(45 12 12)"/></svg>',
		sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6c.9 4.7 2.9 6.7 7.6 7.6-4.7.9-6.7 2.9-7.6 7.6-.9-4.7-2.9-6.7-7.6-7.6 4.7-.9 6.7-2.9 7.6-7.6z"/><path d="M18.8 14.9c.5 2.5 1.6 3.6 4.1 4.1-2.5.5-3.6 1.6-4.1 4.1-.5-2.5-1.6-3.6-4.1-4.1 2.5-.5 3.6-1.6 4.1-4.1z"/></svg>',
		quote: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10.2 7C7.1 8 5.4 10.2 5.4 13.4v4.1h4.9v-4.9H7.9c.1-2 1-3.3 2.9-4.1z"/><path d="M18.8 7c-3.1 1-4.8 3.2-4.8 6.4v4.1h4.9v-4.9h-2.4c.1-2 1-3.3 2.9-4.1z"/></svg>',
		sun: '<svg viewBox="0 0 24 24" ' + A + '><circle cx="12" cy="12" r="3.9"/><path d="M12 2.8v2.3M12 18.9v2.3M2.8 12h2.3M18.9 12h2.3M5.5 5.5l1.6 1.6M16.9 16.9l1.6 1.6M18.5 5.5l-1.6 1.6M7.1 16.9l-1.6 1.6"/></svg>',
		moon: '<svg viewBox="0 0 24 24" ' + A + '><path d="M20.3 14.6A8.7 8.7 0 0 1 9.4 3.7a8.7 8.7 0 1 0 10.9 10.9z"/></svg>',
		menu: '<svg viewBox="0 0 24 24" ' + A + '><path d="M4 6.8h16M4 12h10.6M4 17.2h16"/><circle cx="17.9" cy="12" r="1.15" fill="currentColor" stroke="none"/></svg>',
		close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6"/></svg>',
		check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.6 12.7l4.7 4.8L19.4 7"/></svg>',
		x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6.6 6.6l10.8 10.8M17.4 6.6L6.6 17.4"/></svg>',
		chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.6 9.3l6.4 6.2 6.4-6.2"/></svg>',
		'arrow-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5.2M5.9 11.1L12 5l6.1 6.1"/></svg>',
		zoom: '<svg viewBox="0 0 24 24" ' + A + '><circle cx="10.8" cy="10.8" r="6.7"/><path d="M20.4 20.4l-4.7-4.7M8.4 10.8h4.8M10.8 8.4v4.8"/></svg>',
		send: '<svg viewBox="0 0 24 24" ' + A + '><path d="M21 3.2L11 13.2M21 3.2l-6.8 17.4-3.2-7.4-7.4-3.2z"/></svg>',
		phone: '<svg viewBox="0 0 24 24" ' + A + '><path d="M5.2 3.8h3.6l1.7 4.3-2.2 1.7a12.6 12.6 0 0 0 5.9 5.9l1.7-2.2 4.3 1.7v3.6a1.9 1.9 0 0 1-2.1 1.9A16.8 16.8 0 0 1 3.3 5.9a1.9 1.9 0 0 1 1.9-2.1z"/></svg>',
		mail: '<svg viewBox="0 0 24 24" ' + A + '><rect x="3.2" y="5.6" width="17.6" height="12.8" rx="2.6"/><path d="M4.4 7.8l7.6 5.4 7.6-5.4"/></svg>',
		pin: '<svg viewBox="0 0 24 24" ' + A + '><path d="M12 21.2s-7-5.6-7-10.4a7 7 0 1 1 14 0c0 4.8-7 10.4-7 10.4z"/><circle cx="12" cy="10.5" r="2.4"/></svg>',
		clock: '<svg viewBox="0 0 24 24" ' + A + '><circle cx="12" cy="12" r="8.6"/><path d="M12 7.1V12l3.3 2.1"/></svg>',
		calendar: '<svg viewBox="0 0 24 24" ' + A + '><rect x="3.6" y="5" width="16.8" height="15.4" rx="2.6"/><path d="M8.2 3.2v3.6M15.8 3.2v3.6M3.6 10.2h16.8"/><circle cx="15.6" cy="14.6" r="1.2" fill="currentColor" stroke="none"/></svg>',
		user: '<svg viewBox="0 0 24 24" ' + A + '><circle cx="12" cy="8.1" r="3.7"/><path d="M4.8 20.1a7.2 7.2 0 0 1 14.4 0"/></svg>',
		star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.9l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9z"/></svg>',
		code: '<svg viewBox="0 0 24 24" ' + A + '><path d="M8.2 6.9L3.3 12l4.9 5.1M15.8 6.9L20.7 12l-4.9 5.1M13.7 4.3l-3.4 15.4"/></svg>',
		palette: '<svg viewBox="0 0 24 24" ' + A + '><path d="M12 3.2a8.8 8.8 0 0 0 0 17.6c1.5 0 2.2-.9 2.2-1.9 0-1.3-1-1.8-1-2.9 0-1.1 1-1.9 2.3-1.9h2.2a3.6 3.6 0 0 0 3.6-3.6c0-4.3-4.1-7.3-9.3-7.3z"/><circle cx="7.4" cy="10.8" r="1.05" fill="currentColor" stroke="none"/><circle cx="10.3" cy="7.2" r="1.05" fill="currentColor" stroke="none"/><circle cx="14.8" cy="7.2" r="1.05" fill="currentColor" stroke="none"/></svg>',
		chart: '<svg viewBox="0 0 24 24" ' + A + '><path d="M4.2 19.8V9.8M10.1 19.8V4.8M16 19.8v-7.2M20.8 19.8H3.2"/></svg>',
		camera: '<svg viewBox="0 0 24 24" ' + A + '><path d="M4.2 7.9h2.9l1.9-2.8h6l1.9 2.8h2.9a1.6 1.6 0 0 1 1.6 1.6v8a1.6 1.6 0 0 1-1.6 1.6H4.2a1.6 1.6 0 0 1-1.6-1.6v-8a1.6 1.6 0 0 1 1.6-1.6z"/><circle cx="12" cy="13.2" r="3.5"/></svg>',
		megaphone: '<svg viewBox="0 0 24 24" ' + A + '><path d="M3.2 10.8v3a1.5 1.5 0 0 0 1.5 1.5h1.4l4.4 3.9V5.4l-4.4 3.9H4.7a1.5 1.5 0 0 0-1.5 1.5z"/><path d="M14.6 9.2a4 4 0 0 1 0 6M17.6 6.6a8 8 0 0 1 0 11.4"/></svg>',
		globe: '<svg viewBox="0 0 24 24" ' + A + '><circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.7 2.4 4.2 5.3 4.2 8.6s-1.5 6.2-4.2 8.6c-2.7-2.4-4.2-5.3-4.2-8.6s1.5-6.2 4.2-8.6z"/></svg>',
		cube: '<svg viewBox="0 0 24 24" ' + A + '><path d="M12 2.9l7.9 4.3v9.6L12 21.1l-7.9-4.3V7.2z"/><path d="M4.1 7.2L12 11.5l7.9-4.3M12 11.5v9.6"/></svg>',
		pen: '<svg viewBox="0 0 24 24" ' + A + '><path d="M14.6 4.3l5.1 5.1L8.5 20.6H3.4v-5.1z"/><path d="M12.4 6.5l5.1 5.1"/></svg>',
		shield: '<svg viewBox="0 0 24 24" ' + A + '><path d="M12 2.9l7.4 2.9v5.9c0 4.7-3.1 7.8-7.4 9.4-4.3-1.6-7.4-4.7-7.4-9.4V5.8z"/><path d="M9.1 11.9l2.1 2.1 3.9-4.2"/></svg>',
		heart: '<svg viewBox="0 0 24 24" ' + A + '><path d="M12 20.3S3.8 15.4 3.8 9.5a4.6 4.6 0 0 1 8.2-2.9 4.6 4.6 0 0 1 8.2 2.9c0 5.9-8.2 10.8-8.2 10.8z"/></svg>',
		cart: '<svg viewBox="0 0 24 24" ' + A + '><circle cx="9.6" cy="19.4" r="1.5"/><circle cx="17.2" cy="19.4" r="1.5"/><path d="M3.2 4.2h2.5l2.5 10.8h9.8l2.8-7.6H6.2"/></svg>',
		video: '<svg viewBox="0 0 24 24" ' + A + '><rect x="3.2" y="6.6" width="12.6" height="10.8" rx="2.2"/><path d="M15.8 10.6l5-2.6v8l-5-2.6"/></svg>',
		instagram: '<svg viewBox="0 0 24 24" ' + A + '><rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4.6"/><circle cx="12" cy="12" r="3.9"/><circle cx="16.9" cy="7.1" r="1.05" fill="currentColor" stroke="none"/></svg>',
		telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.7 4.4L2.9 11.6c-1 .4-1 1.8.1 2.1l4.6 1.4 1.8 5.5c.3.9 1.4 1.1 2 .4l2.6-2.7 4.7 3.5c.8.6 1.9.2 2.1-.8l2.6-15.2c.2-1.1-.8-1.9-1.7-1.4zM8.5 14.3l9.5-6.6c.3-.2.6.2.4.4l-7.7 7.2-.3 3.1z"/></svg>',
		whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.4 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0 .1 0 .7-.3 1.2z"/></svg>',
		linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.4 8.6H3.2V21h3.2zM4.8 3.2a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.8 13.4c0-3.4-1.8-5-4.2-5-1.9 0-2.8 1.1-3.3 1.8V8.6H10V21h3.2v-6.2c0-1.6.3-3.1 2.3-3.1s2 1.8 2 3.2V21h3.3z"/></svg>',
		aparat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="8.2" r="1.6"/><circle cx="8.2" cy="12" r="1.6"/><circle cx="15.8" cy="12" r="1.6"/><circle cx="12" cy="15.8" r="1.6"/><circle cx="12" cy="12" r="1.2"/></svg>',
		quill: '<svg viewBox="0 0 24 24" ' + A + '><path d="M19.8 4.2c-7.6 1-12.4 4.8-13.9 13.2 5.3.5 11.9-3.5 13.9-13.2z"/><path d="M4.2 19.8c3-5.8 6.9-9.2 10.8-11.2"/></svg>'
	};

	window.LookIcons = {
		get: function (name) {
			return icons[name] || icons.star8;
		},
		icon: function (name) {
			return '<span class="lm-icon lm-icon--' + name + '" aria-hidden="true">' + this.get(name) + '</span>';
		}
	};
})();
