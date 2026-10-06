/*
 * ============================================================
 *  EDIT THIS FILE ONLY — everything on the page comes from here.
 * ============================================================
 */
window.EVENT_CONFIG = {
  // ---------- Tracking ----------
  // Your Meta (Facebook) Pixel ID from Events Manager. Leave "" to disable.
  metaPixelId: "",

  // Where lead forms (guestlist / table enquiries) are sent.
  // Paste your Google Apps Script web-app URL (see integrations/google-sheets.gs),
  // or any webhook (Zapier, Make, Formspree...). Leave "" to skip sending.
  leadWebhookUrl: "",

  // If true, "Buy" asks for name/email/phone before redirecting to the
  // ticketing site (more data, slightly fewer clicks through). Default off.
  requireLeadBeforeCheckout: false,

  // ---------- Ticket link ----------
  // Paste your District (or any ticketing) link here. Every "Buy now" button
  // uses it, unless a ticket below has its own `url`.
  ticketUrl: "https://www.district.ae/events/kikkat-live-at-opal-room-buy-tickets",

  // ---------- Event ----------
  event: {
    brand: "AFTERS DXB",
    presenter: "Autoplay × Sound Society present",
    title: "KIKKAT Live at Opal Room",
    series: "AFTERS",
    headliner: "KIKKAT",
    tagline: "KIKKAT live at Opal Room, with Jose, Tushar & Vishal.",
    // ISO date-time with Dubai offset — powers the countdown.
    startDateTime: "2026-10-09T22:00:00+04:00",
    dateLabel: "Friday, 9 October 2026",
    timeLabel: "Fri 10:00 PM – Sat 4:00 AM",
    venue: "Opal Room",
    address: "16th Floor, Emirates Financial Tower, DIFC",
    city: "Dubai",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Opal+Room+Emirates+Financial+Towers+DIFC+Dubai",
    ageLimit: "21+ · Valid ID required",
    posterImage: "assets/poster.webp",
    video: "assets/promo.mp4",
    videoPoster: "assets/promo-poster.jpg",
    currency: "AED",
    ticketingPartner: "District",
    phones: ["056 341 4140", "054 215 7865"],
    whatsappNumber: "971563414140", // international format, no + or spaces
    instagram: "https://instagram.com/",
    about:
      "AFTERS lands at Opal Room in DIFC with KIKKAT at the helm, backed by Jose, Tushar and Vishal. Presented by Autoplay × Sound Society with Technotakeoverindia and Dubai After Dark.",
    partners: ["Autoplay", "Sound Society", "Technotakeoverindia", "Dubai After Dark", "Opal Room"],
  },

  // ---------- The show ----------
  // `time` is optional — add set times when you have them, e.g. "00:00 – 02:00".
  lineup: [
    { name: "KIKKAT", role: "Headliner" },
    { name: "Jose", role: "Support" },
    { name: "Tushar", role: "Support" },
    { name: "Vishal", role: "Support" },
  ],

  highlights: [
    { title: "KIKKAT live", text: "The headliner takes over the Opal Room decks." },
    { title: "DIFC skyline", text: "16th floor, Emirates Financial Tower." },
    { title: "10 PM – 4 AM", text: "Six hours. Arrive early to beat the queue." },
  ],

  // ---------- Tickets & tables ----------
  // type: "ticket" -> "Buy now" goes to `ticketUrl` above (or this ticket's own `url`)
  // type: "table"  -> opens a reservation form (or uses `url` if you set one)
  // price: a number, e.g. 150. Leave null to show "See on District" instead.
  // soldOut: true  -> shows SOLD OUT, button disabled
  tickets: [
    {
      id: "male",
      type: "ticket",
      name: "Male",
      price: 150,
      includes: "Entry for 1 · Includes 1 beverage",
    },
    {
      id: "female",
      type: "ticket",
      name: "Female",
      price: 100,
      includes: "Entry for 1 · Includes 1 beverage",
    },
    {
      id: "couple",
      type: "ticket",
      name: "Couple",
      price: 200,
      includes: "Entry for 2 · Includes 1 beverage",
    },
    {
      id: "table",
      type: "table",
      name: "VIP Table",
      price: null, // set the minimum spend (e.g. 3000) to show it; null shows "On request"
      priceNote: "min. spend",
      includes: "Reserved table · Bottle service · Host confirms on WhatsApp",
    },
  ],

  faqs: [
    { q: "Where is the event?", a: "Opal Room, 16th Floor, Emirates Financial Tower, DIFC, Dubai." },
    { q: "What time does it start?", a: "Friday 9 October, 10:00 PM until 4:00 AM." },
    { q: "How do I buy tickets?", a: "Tap \"Buy now\". You'll go to District, our official ticketing partner, to complete payment." },
    { q: "How do table bookings work?", a: "Submit the table form and our host will confirm with you on WhatsApp. You can also call 056 341 4140 or 054 215 7865." },
  ],
};
