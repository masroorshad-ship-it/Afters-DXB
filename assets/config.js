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

  // ---------- Event ----------
  event: {
    brand: "AFTERS DXB",
    title: "AFTERS: Sunrise Sessions",
    tagline: "The after-party Dubai doesn't sleep through.",
    // ISO date-time with Dubai offset — powers the countdown.
    startDateTime: "2026-11-14T23:00:00+04:00",
    dateLabel: "Saturday, 14 November 2026",
    timeLabel: "11:00 PM – 6:00 AM",
    venue: "Secret Warehouse, Al Quoz",
    city: "Dubai, UAE",
    mapUrl: "https://maps.google.com/?q=Al+Quoz+Dubai",
    ageLimit: "21+ · Valid Emirates ID / passport required",
    heroImage: "", // e.g. "assets/hero.jpg" — leave "" for the gradient background
    currency: "AED",
    whatsappNumber: "971500000000", // international format, no + or spaces
    instagram: "https://instagram.com/",
    about:
      "AFTERS is Dubai's late-night ritual — eight hours of deep house, melodic techno and a sunrise finale. Immersive lights, a world-class sound system and a crowd that came to dance.",
  },

  // ---------- The show ----------
  lineup: [
    { name: "Headliner Name", role: "Headliner", time: "02:00 – 04:00" },
    { name: "Special Guest", role: "Special Guest", time: "04:00 – 06:00" },
    { name: "Support DJ", role: "Warm-up", time: "23:00 – 00:30" },
    { name: "Resident DJ", role: "Resident", time: "00:30 – 02:00" },
  ],

  highlights: [
    { title: "Funktion-One Sound", text: "Club-grade system tuned for the room." },
    { title: "Sunrise Finale", text: "Doors open to the morning light at 6 AM." },
    { title: "Immersive Visuals", text: "Laser and LED production all night." },
  ],

  // ---------- Tickets & tables ----------
  // type: "ticket" -> goes straight to `url` (District, Platinumlist, etc.)
  // type: "table"  -> opens a reservation form (or uses `url` if you set one)
  // soldOut: true  -> shows SOLD OUT, button disabled
  tickets: [
    {
      id: "early-bird",
      type: "ticket",
      name: "Early Bird",
      price: 150,
      includes: "General admission · Limited release",
      url: "https://www.district.in/",
      soldOut: true,
    },
    {
      id: "phase-1",
      type: "ticket",
      name: "General Admission – Phase 1",
      price: 200,
      includes: "General admission",
      url: "https://www.district.in/",
      badge: "Selling fast",
    },
    {
      id: "phase-2",
      type: "ticket",
      name: "General Admission – Phase 2",
      price: 250,
      includes: "General admission",
      url: "https://www.district.in/",
    },
    {
      id: "vip",
      type: "ticket",
      name: "VIP",
      price: 450,
      includes: "Fast-track entry · VIP area · 1 welcome drink",
      url: "https://www.district.in/",
    },
    {
      id: "table-silver",
      type: "table",
      name: "Silver Table (up to 6)",
      price: 3000,
      priceNote: "min. spend",
      includes: "6 entries · Bottle service · Dedicated host",
      url: "",
    },
    {
      id: "table-gold",
      type: "table",
      name: "Gold Table (up to 10)",
      price: 6000,
      priceNote: "min. spend",
      includes: "10 entries · Stage-side · Premium bottles",
      url: "",
    },
  ],

  faqs: [
    { q: "Is there a dress code?", a: "Smart casual. No sportswear or flip-flops." },
    { q: "Can I buy tickets at the door?", a: "Only if not sold out, at a higher price. Buy online to guarantee entry." },
    { q: "Are tickets refundable?", a: "Tickets are non-refundable but transferable via the ticketing platform." },
    { q: "How do table bookings work?", a: "Submit the form and our host will confirm on WhatsApp within a few hours." },
  ],
};
