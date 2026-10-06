# Afters-DXB — Event landing page

A fast, mobile-first landing page for Meta (Facebook/Instagram) ads. It shows the event and line-up, plus a ticket/table price table. "Buy" buttons send people to your ticketing platform (District, Platinumlist, etc.). The page also tracks every step with the Meta Pixel and collects leads.

## 1. Edit your event
Everything lives in **`assets/config.js`**: event details, line-up, ticket prices, the ticket link, tables, and FAQs.

- **Ticket link:** paste your District link into `ticketUrl`. Every **Buy now** button sends people there. To send one ticket somewhere else, give it its own `url`.
- `type: "table"`: the button opens a reservation form. The lead is saved, then WhatsApp opens with the booking details pre-filled. To use an external booking link instead, set `url`.
- `price: null` shows "On request" / "See on District" instead of a price.
- `soldOut: true` greys out a ticket. `badge: "Selling fast"` adds a label.
- Media: `assets/poster.webp` (hero), `assets/promo.mp4` (show video, muted autoplay with a "Tap for sound" button). Replace the files to swap them.

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
1. Create a Google Sheet (go to sheets.new). Then open **Extensions → Apps Script**.
2. Delete the sample code, paste in all of `integrations/google-sheets.gs`, and click **Save**.
3. Click **Deploy → New deployment**. Click the gear icon and choose **Web app**. Set **Execute as: Me** and **Who has access: Anyone**, click **Deploy**, then allow access when Google asks.
4. Copy the **Web app URL** (it ends in `/exec`) into `leadWebhookUrl` in `assets/config.js`.

Every form submission becomes a row in the **Leads** tab. Each row has the time (Dubai), the form used (guestlist, table or checkout), the ticket or table, name, email, phone, guests, notes, the ad's UTM tags and the fbclid. Phone numbers are stored as text, so `+971…` stays as typed.

To check it's working, open the Web app URL in your browser. It should say "Lead collector is running."

Optional: set `requireLeadBeforeCheckout: true` to ask for name, email and phone before redirecting to the ticket site. You get more data, but fewer people will click through.

## 4. Publish
These are plain static files with no build step. Host them on any of these:
- **GitHub Pages**: repo Settings → Pages → deploy from branch.
- **Netlify / Vercel / Cloudflare Pages**: drag and drop the folder.

Use the published URL (ideally a custom domain you've verified in Meta Business Manager) as the ad's website URL.
