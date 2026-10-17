# Cloud Furniture — Dealer Catalog

A single-page dealer catalog (`index.html`) for Cloud Furniture. No build step: deploy the folder as-is (e.g. drag it into Netlify).

## Editing

Everything editable is at the top of the `<script>` block in `index.html`:

- `PRODUCTS`: name, category, short description, `sizes` (list), an optional `tag` ("New", "Signature") and `wide: true` for a large card. The current entries are samples; replace them with the real catalog.
- `image`: add product photos to an `images/` folder and set `image: "images/nimbus.jpg"`. Without one, a line drawing for the category is shown instead.
- `DEALERS`: authorised dealers (name, city, phone, WhatsApp, map link) shown under "Find your authorised dealer".
- `SITE_URL`, `MARQUEE`: the catalog address shown next to the QR code, and the scrolling strip.

Each product has a shareable link (`#nimbus-sofa`) that opens its details directly; the "Copy product link" button copies it.

Assets in `assets/`: `logo-white.webp` (dark backgrounds), `logo-dark.webp` (light backgrounds), `favicon.png`, and `catalog-qr.png` (QR code for https://cloud-furniture-catalog.netlify.app).
