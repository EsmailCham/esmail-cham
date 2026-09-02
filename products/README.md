# products/ — Product Detail Pages

One static page per product, named `<slug>.html`.

To add a product:
1. Add one object to `PRODUCTS` in `js/products.js`.
2. Copy `_template.html` → `<slug>.html` and replace the 8 marked slots
   (data-slug, title, meta description, og tags, canonical, breadcrumb, gallery image, long text).
   Full guide: see `AGENTS.md` §8.
3. Add cover/gallery SVGs to `assets/images/` (`<slug>-thumb.svg`, `<slug>-1.svg`, … at 1200×750).
