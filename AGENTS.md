# AGENTS.md — Project Brain & Handoff Guide

> **Read this first.** This file is the single source of truth about *how this project thinks*.
> If you are a new AI model (or a new developer) continuing this work, this document tells you:
> what was built, why every decision was made, where the project stands right now,
> and what must always be kept in sync. Follow it exactly. Do not re-litigate closed decisions.

---

## 1. What this project is

A **personal / product-showcase website** for **اسماعیل چام (Esmail Cham)** — a designer & developer
of WordPress themes, HTML templates, and scripts.

- **Language / direction:** Persian (Farsi), fully RTL — `<html lang="fa" dir="rtl">`.
- **Type:** Premium Digital Product Showcase + Developer Portfolio + Product Catalog.
- **NOT** a shop: there is **no cart, no checkout, no payment**. Every product's "خرید از راست‌چین"
  button links out to the product page on the **Rightchin (راست‌چین)** marketplace.
- **Deployment target:** **GitHub Pages**, 100% static. No backend, no build step, no database.
- **Vibe:** dark, minimal, elegant, motion-rich, fast. "Premium digital creator", not "corporate template".

## 2. Hard technology rules (do not violate)

| Rule | Detail |
|---|---|
| Stack | HTML5 + CSS3 + **Vanilla JS only**. No React/Vue/Angular/Next/Tailwind/Bootstrap. Ever. |
| Motion libs | **GSAP + ScrollTrigger** via jsDelivr CDN, loaded **synchronously before site scripts**. |
| Smooth scroll | ❌ **Lenis was installed and then REMOVED at the user's request.** Native browser scrolling is a permanent requirement. Do **not** re-add Lenis or any smooth-scroll/wheel-hijack library. |
| Icons | Inline SVG (Lucide-style paths) hardcoded in markup / the `ICONS` map in `js/main.js`. No icon runtime/CDN. |
| Font | **Vazir**, local files in `assets/fonts/` via `@font-face` (weights 300/400/500/700). Never Google Fonts, never CDN fonts. |
| Paths | All asset links are **relative** (no leading `/`) so GitHub Pages project sites work. |
| Perf | Animate only `transform` / `opacity`. Lazy-load images (`loading="lazy" decoding="async"`). |
| A11y | Semantic HTML, skip-link, focus-visible rings, aria-current on nav, keyboard-closable mobile menu. |
| Reduced motion | `prefers-reduced-motion: reduce` must keep working: loader/cursor/parallax off, content visible. |

## 3. File map (what lives where)

```
/
├── index.html            ← Home: hero, featured products, categories, CTA band
├── products.html         ← All products: live search + filters + sort (URL-param synced)
├── 404.html              ← Styled not-found page
├── favicon.ico           ← Generated via System.Drawing (32×32 PNG-in-ICO)
├── AGENTS.md             ← This file
│
├── products/             ← One static page per product (currently NONE — clean slate)
│   ├── _template.html    ← ★ TEMPLATE. Copy this to add a new product page.
│   └── README.md         ← Short how-to for this folder.
│
├── css/
│   ├── main.css          ← Design tokens, reset, fonts, header, hero, buttons, footer
│   ├── components.css    ← Cards, categories, filters/search/sort, detail page, mobile menu, cursor, loader, page transition
│   ├── animations.css    ← Keyframes, no-js guards, reduced-motion rules
│   └── responsive.css    ← Breakpoints: 1439 / 1023 / 767 / 400 / min-1600
│
├── js/
│   ├── products.js       ← ★ SINGLE SOURCE OF TRUTH: PRODUCTS[] (empty since sample purge) + CATEGORIES[] + ProductsAPI helpers
│   ├── main.js           ← Theme, header state, mobile menu, loader, page transitions, custom cursor, CardRenderer, Home module (with empty-state), ICONS
│   ├── filters.js        ← products.html state machine (q / cat / price / sort) + URL sync
│   ├── product.js        ← Detail-page renderer (reads <body data-slug>, fills all sections)
│   └── animations.js     ← GSAP hero intro, split-heading word reveal, ScrollTrigger reveals, orb drift, hero parallax
│
├── data/                 ← (pending) products.json mirror for a future API
├── assets/
│   ├── fonts/            ← Vazir woff2 + woff (Light/Regular/Medium/Bold)
│   ├── images/           ← (empty — real product SVGs go here, 1200×750)
│   └── icons/favicon.svg
│
└── demos/                ← (removed with sample purge — recreate per product when real demos exist;
                            must stay STANDALONE: never share CSS/JS with the site, own styles, noindex)
```

## 4. Design system (memorize the tokens)

Defined at the top of `css/main.css`:

- **Dark theme (default):** bg `#0a0a0c`, cards `#121218`, text `#f4f4f6` / `#a1a1ac` / `#6d6d79`,
  accent `#6c8cff` (with `-soft` rgba and `-glow` variants), borders `rgba(255,255,255,.07/.15)`.
- **Light theme:** enabled via `[data-theme='light']` on `<html>`; accent `#4e6ef2`; all tokens overridden.
- Radii: `8 / 14 / 22 / 999`. Transitions: `160ms / 320ms / 560ms`, easing `cubic-bezier(.22,1,.36,1)`.
- Font: `'Vazir'` with Persian-safe line-height (1.8 body). **Never apply `letter-spacing` to Persian text** — it breaks joining.
- Hover language: cards lift `translateY(-6px) scale(1.01)`, images zoom `1.05`, borders brighten, soft shadows. Nothing aggressive.
- Noise overlay: tiny SVG `feTurbulence` data-URI on `body::after` at 5% opacity. One hero orb per side, blurred, animated ±30px — that's the entire decoration budget. **Minimal > decorative.**

## 5. The decisions I made, and WHY (the reasoning you must respect)

1. **Product data lives in `js/products.js`, not `data/products.json`.**
   `fetch()` of a local JSON fails on the `file://` protocol and the owner tests by double-clicking
   HTML files. A plain `<script>` data file works on `file://`, GitHub Pages, and any static host.
   A JSON mirror (`data/products.json`) is planned purely for a future API — it must mirror the array.

2. **Product detail pages are thin static HTML + JS render.**
   GitHub Pages has no routing, so each product needs a real `products/<slug>.html` URL (SEO + shareable).
   To avoid 6× duplicated content, each page is a copy of `products/voroodino.html` with:
   a `data-slug` on `<body>`, its own `<title>`/meta/OG/canonical, breadcrumb text, gallery main image,
   and the long description paragraph. `js/product.js` fills everything else from the data.
   **Adding a product = 1 new object + 1 page copy + 8 small string replacements.** Documented in §8.

3. **CDN scripts load synchronously, before site scripts, with no `defer`.**
   `js/animations.js` pre-sets hero elements to `opacity:0` via `gsap.set()` at parse time, so the
   intro animation never flashes. If the CDN is blocked/offline, `animations.js` detects the missing
   globals and **does nothing** — the site remains fully visible and usable. Same for all guards.

4. **Loader shows once per session** (`sessionStorage['ec-loaded']`), max ~900 ms, then dispatches.
   Internal navigation uses a separate 240 ms fade overlay (`.page-transition`) on same-origin `.html`
   links only (skips `http*`, `#`, `mailto:`, `target="_blank"`).

5. **Native scrolling, always.** The user explicitly rejected Lenis smooth scroll mid-project
   ("اسکرول کاربرپسند نیست… یک اسکرول عادی بزار"). ScrollTrigger works fine with native scroll.
   Only `scroll-behavior: smooth` for anchor jumps remains, which is standard browser behavior.

6. **Custom cursor** exists only on `(pointer: fine)` devices with no reduced-motion preference —
   a 7 px accent dot + lerped 36 px ring that grows on interactive hover. Mobile never gets it.

7. **Theme:** dark is the default; `localStorage['ec-theme']`; the toggle swaps an SVG sun/moon via CSS
   (`[data-theme]`), no icon re-render needed. `html.no-js` → `js` class swap guards loader/no-js fallbacks.

8. **RTL-specific choices:** word-level (never letter-level) text splitting for GSAP headings (Persian
   shaping breaks with letter splitting); logical CSS properties (`inset-inline`, `margin-inline`) everywhere;
   forward arrows point **left**; Latin strings (`WordPress • HTML • Scripts`, copyright) get `dir="ltr"`.

9. **Sample content:** PURGED at the owner's request ("تمامی اون محصول الکی ها را حذف کن").
   `PRODUCTS` is an empty array; all sample product pages, sample SVGs, and the sample demo folder
   were deleted. Home shows a styled "به‌زودی" empty-state and categories show "به‌زودی" counts when
   there are no products. Add real products via §8 — everything renders automatically again.

## 6. Current status (handoff snapshot)

**DONE & working:**
- Home page: hero (kicker/name/headline/desc/2 CTAs/scroll hint), featured grid (auto-rendered,
  with "به‌زودی" empty-state when no products), categories grid (auto-rendered with live counts),
  CTA band, footer with category links.
- Products page: debounced live search, category pills, price pills (همه/رایگان/ارزان‌ترین/گران‌ترین —
  cheap/expensive = lower/upper half of paid prices), sort select (جدیدترین/قدیمی‌ترین/ارزان‌ترین/گران‌ترین),
  results counter, empty state, full URL sync (`?cat=&price=&sort=&q=`) so filtered views are shareable.
- Product page machinery: `products/_template.html` + `js/product.js` renderer (data-slug driven,
  gallery thumbs, meta, tags, features, tech, demo + Rightchin CTAs, unknown slug → `404.html`).
- Theme toggle, mobile menu (staggered, ESC/backdrop close, body scroll-lock), custom cursor,
  loader, page transitions, ScrollTrigger reveals, reduced-motion + no-JS fallbacks, favicon (ico+svg).

**Sample purge (owner request):** all 6 sample products, their detail pages, all sample SVG images,
and the `demos/voroodino/` demo were DELETED. The site currently has zero products and shows
empty-states gracefully.

**PENDING — next model should do, in this order:**
1. Wait for real products from the owner; when they arrive, follow §8 per product (data object +
   `_template.html` copy + SVGs). Demos: build `demos/<slug>/` per product, standalone, noindex.
2. `data/products.json` — JSON mirror of the `PRODUCTS` array (keep in sync from now on).
3. `robots.txt` — allow all + `Sitemap:` line.
4. `sitemap.xml` — home, products.html + one URL per real product page.
5. `README.md` — structure, "how to add a product" (§8 of this file), GitHub Pages deploy steps.
6. Replace placeholder Rightchin URLs with real ones as products are added (mark with `// TODO:`).
7. **Verify everything** (§9 checklist), then tick off items here.

## 7. Maintenance rules — what must ALWAYS stay in sync

- `js/products.js` is the **only** place product data may live. Never hard-code product info into HTML.
- If you create `data/products.json`, it must **exactly mirror** `PRODUCTS` (same fields, same order).
- Every page must keep: `<html … class="no-js">`, skip-link, loader div, header (with correct
  `aria-current="page"`), mobile-menu div, footer, `#pageTransition` div, and the exact script order:
  `gsap → ScrollTrigger → products.js → main.js → [filters.js OR product.js] → animations.js`
  (all CDN+local scripts **synchronous**, before `</body>`).
- Product page copies must keep `data-slug` on `<body>` and the 8 template slots updated (§8).
- New images follow the pattern: `assets/images/<slug>-thumb.svg` (cover) + `<slug>-1.svg`, `<slug>-2.svg`
  (gallery screens), all 1200×750, matching the existing SVG visual language.
- New CSS goes into the correct file by topic (tokens/layout → main, components → components,
  keyframes/motion-guard → animations, breakpoints → responsive). Keep the section-header comments.
- New JS stays namespaced & dependency-free (`ProductsAPI`, `EC.*`, `ICONS`, module IIFEs).
- Both themes must always look right — after any component change, check dark **and** light.
- Visible UI text: professional Persian, zero Lorem Ipsum / TODO / Coming Soon in the UI
  (code comments marking replaceable URLs are fine and expected).

## 8. How to add a product (the owner's main workflow — keep it this simple)

1. **Add one object** to `PRODUCTS` in `js/products.js` with all fields
   (`id, title, slug, category, categoryLabel, description, price, thumbnail, gallery[], demoUrl,
   rightchinUrl, featured, date, version, tags[], features[], tech[]`). `price: 0` = رایگان.
2. **Copy** `products/_template.html` → `products/<slug>.html` and replace these 8 slots:
   1. `data-slug="…"` on `<body>`
   2. `<title>… | اسماعیل چام</title>`
   3. `<meta name="description">`
   4. `og:title` / `og:description` / `og:image`
   5. `<link rel="canonical" href="./<slug>.html">`
   6. breadcrumb `<span id="crumbCurrent">…</span>`
   7. gallery main `<img id="galleryMain" src="…" alt="…">`
   8. the `<p class="product-long" id="pLong">…</p>` paragraph
3. Add cover/gallery SVGs to `assets/images/`.
4. If the product has a demo, create `demos/<slug>/` — fully standalone (own CSS, `noindex`).
   Set `demoUrl` to the **full file path** `demos/<slug>/index.html`, never a bare folder —
   folder links break into a directory listing when the site is opened via `file://`.
5. Done. Home featured grid, categories counts, search/filter/sort pick it up automatically.

## 9. Verification checklist (run after ANY change)

Serve locally (e.g. `python -m http.server 8000` or VS Code Live Server), then:

- [ ] Home: hero intro plays, no flash of hidden content; featured grid + categories render.
- [ ] Products page: search filters live; every pill + sort option works; URL params update and
      survive a refresh; empty state appears for nonsense queries; counter is correct.
- [ ] Every product page: gallery thumbs switch, price/version/date render, both CTAs point to the
      right URLs, demo opens in a new tab; a bogus slug redirects to `404.html`.
- [ ] Theme toggle persists across pages/reload; light theme has no broken contrast.
- [ ] Mobile (≤767px): burger menu opens/closes (ESC + backdrop), grids collapse to 1 column.
- [ ] Keyboard: skip-link, tab order, focus rings visible, ESC closes menu.
- [ ] No console errors on any page; animations degrade silently if CDNs are blocked (offline test).
- [ ] Scroll is **native** — if anything feels like smooth-scroll again, a Lenis-style lib snuck back in. Remove it.

## 10. Deploying (GitHub Pages)

1. `git init`, commit, push to a GitHub repo.
2. Repo **Settings → Pages → Deploy from branch → `main` / root**.
3. Site is live at `https://<user>.github.io/<repo>/` — relative paths make this work as-is.
4. Update the `Sitemap:` URL in `robots.txt` and URLs in `sitemap.xml` with the final domain.

---

*Last updated by the previous model: after the sample-product purge (empty PRODUCTS, no product
pages/images/demos — see §6) and while preparing GitHub Pages deployment. See §6 for the pending list.*
