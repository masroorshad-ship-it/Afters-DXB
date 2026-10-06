(function () {
  "use strict";
  var C = window.EVENT_CONFIG;
  var E = C.event;
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var hasPrice = function (t) { return typeof t.price === "number"; };
  var fmtPrice = function (n) { return E.currency + " " + Number(n).toLocaleString("en-US"); };

  /* ---------- Attribution: keep UTMs / fbclid from the Meta ad ---------- */
  var ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
  var attribution = {};
  try { attribution = JSON.parse(sessionStorage.getItem("attr") || "{}"); } catch (e) {}
  var qs = new URLSearchParams(location.search);
  ATTR_KEYS.forEach(function (k) { if (qs.get(k)) attribution[k] = qs.get(k); });
  try { sessionStorage.setItem("attr", JSON.stringify(attribution)); } catch (e) {}

  // Pass UTMs through to the ticketing site so its own reporting sees the ad.
  function withUtm(url) {
    try {
      var u = new URL(url);
      ATTR_KEYS.forEach(function (k) {
        if (attribution[k] && k !== "fbclid" && !u.searchParams.has(k)) u.searchParams.set(k, attribution[k]);
      });
      return u.toString();
    } catch (e) { return url; }
  }

  /* ---------- Meta Pixel ---------- */
  var pixelOn = !!C.metaPixelId;
  if (pixelOn) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", C.metaPixelId);
    fbq("track", "PageView");
  }
  function track(name, params, custom) {
    if (window.console) console.log("[track]", name, params || {});
    if (!pixelOn) return;
    fbq(custom ? "trackCustom" : "track", name, params || {});
  }
  // Advanced matching: Meta hashes these client-side before sending.
  function identify(d) {
    if (!pixelOn) return;
    var parts = (d.name || "").trim().split(/\s+/);
    fbq("init", C.metaPixelId, {
      em: (d.email || "").trim().toLowerCase() || undefined,
      ph: (d.phone || "").replace(/[^\d]/g, "") || undefined,
      fn: (parts[0] || "").toLowerCase() || undefined,
      ln: (parts.length > 1 ? parts[parts.length - 1] : "").toLowerCase() || undefined,
    });
  }

  /* ---------- Render content ---------- */
  document.title = E.title + " — Tickets";
  document.querySelectorAll("[data-bind]").forEach(function (el) {
    var v = el.getAttribute("data-bind").split(".").reduce(function (o, k) { return o && o[k]; }, C);
    el.textContent = v || "";
  });
  $("#venue-link").href = E.mapUrl;
  $("#wa-link").href = "https://wa.me/" + E.whatsappNumber;
  $("#phones").innerHTML = (E.phones || []).map(function (p) {
    return '<a href="tel:+971' + esc(p.replace(/\D/g, "").replace(/^0/, "")) + '">' + esc(p) + "</a>";
  }).join(" / ");
  $("#partners").innerHTML = (E.partners || []).map(function (p) { return "<span>" + esc(p) + "</span>"; }).join("");

  if (E.posterImage) {
    $("#poster-img").src = E.posterImage;
    $("#poster-img").alt = E.title + " poster";
    $("#hero-poster").hidden = false;
  }

  if (E.video) {
    var vid = $("#promo-video"), sound = $("#sound-btn"), soundTracked = false;
    if (E.videoPoster) vid.poster = E.videoPoster;
    vid.src = E.video;
    $("#video-wrap").hidden = false;
    // Only play while on screen (saves data on mobile).
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
        else vid.pause();
      }, { threshold: 0.4 }).observe(vid);
    } else { vid.autoplay = true; }
    sound.addEventListener("click", function () {
      vid.muted = !vid.muted;
      if (!vid.muted) { vid.play(); }
      sound.textContent = vid.muted ? "Tap for sound" : "Mute";
      sound.setAttribute("aria-pressed", String(!vid.muted));
      if (!soundTracked) { soundTracked = true; track("VideoSoundOn", { content_name: E.title }, true); }
    });
  }

  $("#highlights").innerHTML = C.highlights.map(function (h) {
    return "<article><h4>" + esc(h.title) + "</h4><p>" + esc(h.text) + "</p></article>";
  }).join("");

  $("#lineup").innerHTML = C.lineup.map(function (a) {
    var head = a.role === "Headliner";
    return '<li' + (head ? ' class="headliner"' : "") + '><span class="name">' + esc(a.name) + "</span>" +
      (a.time ? '<span class="time">' + esc(a.time) + "</span>" : "") +
      '<span class="role">' + esc(a.role) + "</span></li>";
  }).join("");

  $("#ticket-rows").innerHTML = C.tickets.map(function (t) {
    var isTable = t.type === "table";
    var badge = t.soldOut ? '<span class="badge out">Sold out</span>'
      : t.badge ? '<span class="badge">' + esc(t.badge) + "</span>"
      : isTable ? '<span class="badge table">Table</span>' : "";
    var price = hasPrice(t)
      ? fmtPrice(t.price) + (t.priceNote ? "<small>" + esc(t.priceNote) + "</small>" : "")
      : '<span class="tbc">' + (isTable ? "On request" : "See on " + esc(E.ticketingPartner || "site")) + "</span>";
    var btn = t.soldOut
      ? '<button class="btn" disabled>Sold out</button>'
      : '<button class="btn" data-ticket="' + esc(t.id) + '">' + (isTable ? "Reserve table" : "Buy now") + "</button>";
    return '<article class="ticket' + (isTable ? " is-table" : "") + (t.soldOut ? " sold-out" : "") + '">' +
      '<div class="ticket-head"><h3>' + esc(t.name) + "</h3>" + badge + "</div>" +
      '<p class="price">' + price + "</p>" +
      '<p class="inc">' + esc(t.includes) + "</p>" + btn + "</article>";
  }).join("");

  var available = C.tickets.filter(function (t) { return !t.soldOut && t.type === "ticket" && hasPrice(t); });
  if (available.length) {
    $("#sticky-from").textContent = "from " + fmtPrice(Math.min.apply(null, available.map(function (t) { return t.price; })));
  }

  $("#faqs").innerHTML = C.faqs.map(function (f) {
    return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>";
  }).join("");

  /* ---------- Countdown ---------- */
  var start = new Date(E.startDateTime).getTime();
  function tick() {
    var d = Math.max(0, start - Date.now());
    if (!d) { $("#countdown").innerHTML = ""; return; }
    var parts = [[Math.floor(d / 864e5), "days"], [Math.floor(d / 36e5) % 24, "hrs"], [Math.floor(d / 6e4) % 60, "min"], [Math.floor(d / 1e3) % 60, "sec"]];
    $("#countdown").innerHTML = parts.map(function (p) { return "<div><b>" + p[0] + "</b><small>" + p[1] + "</small></div>"; }).join("");
  }
  if (!isNaN(start)) { tick(); setInterval(tick, 1000); }

  /* ---------- ViewContent when tickets come into view ---------- */
  var viewed = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting && !viewed) {
        viewed = true; obs.disconnect();
        track("ViewContent", {
          content_name: E.title, content_type: "product",
          content_ids: C.tickets.map(function (t) { return t.id; }), currency: E.currency,
        });
      }
    }, { threshold: 0.3 }).observe($("#tickets"));
  }

  // Sticky CTA appears after the hero, hides on the ticket table.
  var sticky = $("#sticky-cta");
  function updateSticky() {
    var heroBottom = $("#hero").getBoundingClientRect().bottom;
    var t = $("#tickets").getBoundingClientRect();
    var onTickets = t.top < innerHeight && t.bottom > 0;
    sticky.classList.toggle("show", heroBottom < 0 && !onTickets);
  }
  addEventListener("scroll", updateSticky, { passive: true });
  sticky.addEventListener("click", function () { track("StickyCTAClick", {}, true); });

  /* ---------- Lead submission ---------- */
  function sendLead(data) {
    var payload = Object.assign({}, data, attribution, {
      event: E.title, page: location.href.split("?")[0],
      submitted_at: new Date().toISOString(), user_agent: navigator.userAgent,
    });
    if (!C.leadWebhookUrl) { console.log("[lead] no leadWebhookUrl set", payload); return Promise.resolve(); }
    // text/plain avoids a CORS preflight (works with Google Apps Script).
    return fetch(C.leadWebhookUrl, {
      method: "POST", mode: "no-cors", keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload),
    }).catch(function () {});
  }
  function formData(form) {
    var o = {};
    new FormData(form).forEach(function (v, k) { o[k] = typeof v === "string" ? v.trim() : v; });
    return o;
  }
  function validate(form) {
    var bad = Array.prototype.find.call(form.elements, function (el) { return el.willValidate && !el.checkValidity(); });
    if (bad) { bad.reportValidity(); return false; }
    return true;
  }

  /* ---------- Buy / Reserve buttons ---------- */
  function priceParams(t, extra) {
    var p = Object.assign({ content_name: t.name, content_ids: [t.id] }, extra);
    if (hasPrice(t)) { p.value = t.price; p.currency = E.currency; }
    return p;
  }
  var modal = $("#lead-modal"), leadForm = $("#lead-form"), pending = null;

  function goToCheckout(t) {
    var url = withUtm(t.url || C.ticketUrl);
    // Give the pixel a moment to send before leaving the page.
    setTimeout(function () { location.href = url; }, pixelOn ? 350 : 0);
  }

  function openModal(t, mode) {
    pending = { ticket: t, mode: mode };
    leadForm.reset();
    leadForm.option.value = t.name;
    leadForm.form.value = mode;
    $("#lead-title").textContent = mode === "table" ? "Reserve: " + t.name : "Almost there";
    $("#lead-sub").textContent = mode === "table"
      ? (hasPrice(t) ? fmtPrice(t.price) + (t.priceNote ? " " + t.priceNote : "") + " · " : "") + "Our host confirms on WhatsApp."
      : "Enter your details and we'll take you to checkout for " + t.name + ".";
    $("#lead-submit").textContent = mode === "table" ? "Send request" : "Continue to checkout";
    leadForm.querySelectorAll("[data-table-only]").forEach(function (el) { el.hidden = mode !== "table"; });
    leadForm.querySelector(".form-msg").textContent = "";
    modal.showModal();
  }
  modal.addEventListener("click", function (e) { if (e.target === modal || e.target.hasAttribute("data-close")) modal.close(); });

  $("#ticket-rows").addEventListener("click", function (e) {
    var b = e.target.closest("[data-ticket]");
    if (!b) return;
    var t = C.tickets.find(function (x) { return x.id === b.getAttribute("data-ticket"); });
    var params = priceParams(t, { content_type: "product" });

    if (t.type === "table" && !t.url) {  // tables use the form unless given their own url
      track("Contact", params);
      openModal(t, "table");
    } else if (C.requireLeadBeforeCheckout) {
      openModal(t, "checkout");
    } else {
      track("InitiateCheckout", Object.assign({ num_items: 1 }, params));
      goToCheckout(t);
    }
  });

  leadForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate(leadForm)) return;
    var d = formData(leadForm), t = pending.ticket;
    var params = priceParams(t, {});
    identify(d);
    $("#lead-submit").disabled = true;

    if (pending.mode === "table") {
      track("Lead", Object.assign({ lead_type: "table" }, params));
      sendLead(d).then(function () {
        var msg = "Hi! Table request for " + E.title + " (" + E.dateLabel + ")\n" +
          "Table: " + t.name + "\nName: " + d.name + "\nGuests: " + (d.guests || "-") + (d.notes ? "\nNotes: " + d.notes : "");
        leadForm.querySelector(".form-msg").className = "form-msg ok";
        leadForm.querySelector(".form-msg").textContent = "Request received! Opening WhatsApp to confirm…";
        $("#lead-submit").disabled = false;
        setTimeout(function () {
          modal.close();
          window.open("https://wa.me/" + E.whatsappNumber + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
        }, 900);
      });
    } else {
      track("Lead", Object.assign({ lead_type: "checkout" }, params));
      track("InitiateCheckout", Object.assign({ num_items: 1 }, params));
      sendLead(d).then(function () { goToCheckout(t); });
    }
  });

  /* ---------- Guestlist signup ---------- */
  var signup = $("#signup-form");
  signup.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate(signup)) return;
    var d = formData(signup), msg = signup.querySelector(".form-msg");
    d.consent = !!signup.consent.checked;
    identify(d);
    track("CompleteRegistration", { content_name: E.title + " – guestlist", status: true });
    track("Lead", { lead_type: "guestlist", content_name: E.title });
    signup.querySelector("button").disabled = true;
    sendLead(d).then(function () {
      msg.className = "form-msg ok";
      msg.textContent = "You're on the list! We'll be in touch.";
      signup.reset();
      signup.querySelector("button").disabled = false;
    });
  });
})();
