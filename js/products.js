/* ==========================================================================
   js/products.js — منبع واحد اطلاعات محصولات
   افزودن محصول جدید = اضافه کردن یک Object جدید به آرایه PRODUCTS
   سپس یک صفحه از روی products/_template.html بسازید (راهنما: AGENTS.md §8).
   قیمت‌ها به تومان هستند. price: 0 یعنی رایگان.
   دکمه‌های خرید به مارکت rtl-theme.com (راست‌چین) لینک می‌شوند.
   مسیرها نسبت به ریشه سایت (GitHub Pages compatible).
   ========================================================================== */

const PRODUCTS = [
  {
    id: 1,
    title: 'ورودشو',
    slug: 'vorodsho',
    category: 'html',
    categoryLabel: 'قالب HTML',
    description: 'قالب HTML احراز هویت با ۵ تم حرفه‌ای فارسی؛ ورود، ثبت‌نام، بازیابی رمز و پنل مدیریت در یک پکیج.',
    price: 997000,
    thumbnail: 'assets/images/vorodsho/poster-cover.jpg',
    gallery: [
      'assets/images/vorodsho/vorodsho-01.png',
      'assets/images/vorodsho/vorodsho-02.png',
      'assets/images/vorodsho/vorodsho-03.png',
      'assets/images/vorodsho/vorodsho-04.png',
      'assets/images/vorodsho/vorodsho-05.png',
      'assets/images/vorodsho/vorodsho-06.png',
      'assets/images/vorodsho/vorodsho-07.png',
      'assets/images/vorodsho/vorodsho-08.png',
      'assets/images/vorodsho/vorodsho-09.png',
      'assets/images/vorodsho/vorodsho-10.png',
      'assets/images/vorodsho/vorodsho-11.png',
      'assets/images/vorodsho/vorodsho-12.png',
      'assets/images/vorodsho/vorodsho-13.png',
      'assets/images/vorodsho/vorodsho-14.png',
      'assets/images/vorodsho/vorodsho-15.png'
    ],
    demoUrl: 'demos/vorodsho/index.html', // مستقیم به فایل ایندکس؛ لینک پوشه روی file:// لیست پوشه نشان می‌دهد
    // TODO: لینک مستقیم صفحه محصول در rtl-theme.com را وقتی منتشر شد جایگزین کنید
    rightchinUrl: 'https://www.rtl-theme.com/',
    featured: true,
    date: '2026-09-02',
    version: '2.0.0', // TODO: شماره نسخه واقعی را تنظیم کنید
    tags: ['HTML', 'احراز هویت', '۵ تم', 'RTL'],
    features: [
      '۵ تم کامل و متفاوت در یک پکیج',
      'صفحات ورود، ثبت‌نام، فراموشی رمز با جریان OTP',
      'پنل مدیریت یکپارچه مشترک بین همه تم‌ها',
      'حالت روشن و تاریک در هر تم',
      'ساختار ماژولار و تفکیک‌شده برای شخصی‌سازی آسان',
      'فونت‌های لوکال (وزیرمتن، Geist) بدون وابستگی به سرویس خارجی',
      'کاملاً راست‌چین و واکنش‌گرا',
      'بدون هیچ کد سمت سرور؛ اتصال آسان به هر API'
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind', 'Vazirmatn', 'Geist']
  }
];

/* دسته‌بندی‌های اصلی سایت */
const CATEGORIES = [
  {
    key: 'wordpress',
    title: 'قالب وردپرس',
    description: 'قالب‌های اختصاصی و بهینه برای وردپرس با طراحی مدرن و فارسی.',
    icon: 'wp',
    page: 'products.html?cat=wordpress'
  },
  {
    key: 'html',
    title: 'قالب HTML',
    description: 'قالب‌های HTML/CSS/JS خالص، سریع و بدون وابستگی.',
    icon: 'html',
    page: 'products.html?cat=html'
  },
  {
    key: 'plugin',
    title: 'افزونه وردپرس',
    description: 'افزونه‌های کاربردی برای توسعه امکانات سایت‌های وردپرسی.',
    icon: 'plugin',
    page: 'products.html?cat=plugin'
  },
  {
    key: 'script',
    title: 'اسکریپت',
    description: 'اسکریپت‌های آماده و قابل استفاده برای پروژه‌های واقعی.',
    icon: 'script',
    page: 'products.html?cat=script'
  }
];

/* توابع کمکی مشترک مربوط به داده محصولات */
const ProductsAPI = {
  all() {
    return PRODUCTS;
  },
  featured() {
    return PRODUCTS.filter(p => p.featured);
  },
  bySlug(slug) {
    return PRODUCTS.find(p => p.slug === slug) || null;
  },
  countByCategory(key) {
    return PRODUCTS.filter(p => p.category === key).length;
  },
  latest() {
    return [...PRODUCTS].sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
  },
  priceLabel(price) {
    if (price === 0) return 'رایگان';
    return new Intl.NumberFormat('fa-IR').format(price);
  }
};
