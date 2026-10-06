# Afters-DXB — Event landing page

A fast, mobile-first landing page for Meta (Facebook/Instagram) ads. It shows the event and line-up, plus a ticket/table price table. "Buy" buttons send people to your ticketing platform (District, Platinumlist, etc.). The page also tracks every step with the Meta Pixel and collects leads.

## 1. Edit your event
Everything lives in **`assets/config.js`**: event details, line-up, ticket tiers and prices, ticket links, tables, and FAQs.

- `type: "ticket"`: the button goes straight to `url` (your District/ticketing link).
- `type: "table"`: the button opens a reservation form. The lead is saved, then WhatsApp opens with the booking details pre-filled. To use an external booking link instead, set `url`.
- `soldOut: true` greys out a tier. `badge: "Selling fast"` adds a label.
- Optional hero photo: add `assets/hero.jpg` and set `heroImage: "assets/hero.jpg"`.

## 2. Meta Pixel (ad data)
Put your Pixel ID in `metaPixelId`. The page sends these events:

| Event | When |
|---|---|
| `PageView` | Page loads |
| `ViewContent` | Ticket table scrolls into view |
| `InitiateCheckout` | "Buy now" is clicked (with ticket name, price, AED) |
| `Contact` | "Reserve" table is clicked |
| `Lead` | Table request / guestlist / pre-checkout form submitted |
| `CompleteRegistration` | Guestlist signup |

Form details (email, phone, name) go to Meta as **Advanced Matching**, which improves ad attribution. Meta hashes them in the browser.

**Optimise your campaign for `InitiateCheckout`.** Purchases happen on the ticketing site, so this pixel can't see them. If your ticketing platform lets you add your Pixel ID, add it there too so Meta also gets `Purchase` events.

UTM parameters from your ad (`utm_source`, `utm_campaign`, …) are added to the ticket links automatically and saved with every lead.

## 3. Collect leads into Google Sheets
1. Create a Google Sheet → **Extensions → Apps Script**. Paste in `integrations/google-sheets.gs`.
2. **Deploy → New deployment → Web app** (Execute as: Me, Access: Anyone).
3. Paste the URL into `leadWebhookUrl` in `assets/config.js`.

Each submission becomes a row: name, email, phone, ticket/table, guests, UTMs, and timestamp. A Zapier, Make or Formspree webhook URL works too.

Optional: set `requireLeadBeforeCheckout: true` to ask for name, email and phone before redirecting to the ticket site. You get more data, but fewer people will click through.

## 4. Publish
These are plain static files with no build step. Host them on any of these:
- **GitHub Pages**: repo Settings → Pages → deploy from branch.
- **Netlify / Vercel / Cloudflare Pages**: drag and drop the folder.

Use the published URL (ideally a custom domain you've verified in Meta Business Manager) as the ad's website URL.
