# Cloud Furniture — Catalogue

A single-page catalogue (`index.html`) for Cloud Furniture, Dubai. No build step: open the file or deploy the folder as-is (e.g. drag it into Netlify).

## Editing

Everything editable is at the top of the `<script>` block in `index.html`:

- `CONFIG`: WhatsApp number (digits only, international format), email, Instagram, city.
- `PRODUCTS`: name, category, description, material, dimensions, lead time, price, an optional `tag` ("New", "Limited") and `wide: true` for a large card.
- `image`: add product photos to an `images/` folder and set `image: "images/nimbus.jpg"`. Without one, a line drawing for the category is shown instead.
- `MATERIALS`, `MARQUEE`: swatches and the scrolling strip.

Logos are in `assets/`: `logo-white.webp` for dark backgrounds and `logo-dark.webp` for light ones.
