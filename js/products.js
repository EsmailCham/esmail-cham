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
    title: 'قالب لوک‌می',
    slug: 'lookme',
    category: 'wordpress',
    categoryLabel: 'قالب وردپرس',
    description: 'قالب وردپرس تک‌صفحه‌ای لوک‌می؛ حالت تاریک و روشن، ۱۷ فونت فارسی، نمونه‌کار با فیلتر، گالری درگ‌پذیر و فرم تماس آجاکسی — بدون حتی یک خط کد.',
    price: 1498000,
    thumbnail: 'assets/images/lookme/poster-cover.jpg',
    gallery: [
      'assets/images/lookme/poster-cover.jpg',
      'assets/images/lookme/r1.jpg',
      'assets/images/lookme/r2.jpg',
      'assets/images/lookme/r3.jpg',
      'assets/images/lookme/r4.jpg'
    ],
    demoUrl: 'demos/lookme/index.html', // مستقیم به فایل ایندکس؛ لینک پوشه روی file:// لیست پوشه نشان می‌دهد
    // TODO: لینک مستقیم صفحه محصول در rtl-theme.com را وقتی منتشر شد جایگزین کنید
    rightchinUrl: 'https://www.rtl-theme.com/',
    featured: true,
    date: '2026-09-10',
    version: '1.6.8',
    tags: ['وردپرس', 'تک‌صفحه‌ای', 'المنتور', 'RTL', '۱۷ فونت فارسی'],
    features: [
      'سایت تک‌صفحه‌ای با اسکرول نرم و هایلایت خودکار منو',
      'حالت تاریک و روشن با یک کلیک + تعیین حالت پیش‌فرض از پنل مدیریت',
      '۱۷ فونت آماده فارسی با انتخاب جداگانه فونت متن و عناوین',
      'بخش افتتاحیه سینمایی با افکت‌های ورود خیره‌کننده',
      'هدر شناور (Dock) با منوی کشویی زیبا در موبایل',
      'قابلیت نمایش ویدئو در پس‌زمینه بخش هیرو',
      'مهارت‌ها با نوار پیشرفت متحرک و شمارنده اعداد فارسی',
      'نمونه‌کارها با فیلتر دسته‌بندی و لایت‌باکس حرفه‌ای',
      'گالری کارت‌های درگ‌پذیر با پشتیبانی کامل از لمس',
      'نظرات مشتریان با کارت امضادار و آواتار حلقه‌ای چرخان',
      'تعرفه‌ها با کارت ویژه برجسته و درگاه پرداخت تتر (USDT)',
      'فرم تماس آجاکسی امن + صندوق پیام‌ها در پیشخوان وردپرس',
      'بخش سوالات متداول آکاردئونی، تیم و وبلاگ مجله‌ای',
      'شخصی‌سازی کامل از پیشخوان با بیش از ۱۵۰ گزینه تنظیمات',
      'ابزار بکاپ‌گیری و بازگردانی تنظیمات (خروجی/ورودی JSON)',
      'سازگار با المنتور و المنتور پرو (هدر، فوتر، تک‌مقاله و آرشیو)',
      'حالت به‌زودی با صفحه اختصاصی و کد ۵۰۳ استاندارد',
      'بهینه‌سازی سرعت: CSS/JS فشرده و بدون هیچ CDN خارجی'
    ],
    tech: ['WordPress 6+', 'Elementor', 'PHP 7.4 - 8.x', 'Vazirmatn', 'Estedad', 'RTL']
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
