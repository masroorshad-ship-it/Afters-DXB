# Cloud Furniture — Dealer Catalog

A single-page dealer catalog (`index.html`) for Cloud Furniture. No build step: deploy the folder as-is (e.g. drag it into Netlify).

## Products

Products load from `/api/products`, the same endpoint the current site uses:

```json
{ "products": [{ "id": "a1", "name": "Oslo Sofa", "category": "Sofa", "image": "https://…", "price": 42999, "sizes": "3 Seater, L Shape", "visible": true }] }
```

Prices show as "From ₹…" (INR); a product with no price shows "Ask your dealer", and `visible: false` hides it. Shared links use the existing `#product=<id>` format, so old links and QR codes keep working. Products without an image get a line drawing matched to their category.

When `index.html` is opened as a local file, a few preview products are shown so the layout can be checked without the API.

## Deploying

Replace `index.html` in the Netlify project that serves `/api/products`, and add the `assets/` folder. `style.css` and `catalog.js` are no longer used.

## Editing

At the top of the `<script>` block in `index.html`:

- `DEALERS`: authorised dealers (name, city, phone, WhatsApp, map link) shown under "Find your authorised dealer".
- `SITE_URL`, `MARQUEE`: the catalog address shown next to the QR code, and the scrolling strip.

Assets in `assets/`: `logo-white.webp` (dark backgrounds), `logo-dark.webp` (light backgrounds), `favicon.png`, and `catalog-qr.png` (QR code for https://cloud-furniture-catalog.netlify.app).
