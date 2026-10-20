/* Espousal × Sobha — Sobha Central landing page */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     CONFIG — every enquiry is emailed to LEAD_EMAIL through FormSubmit
     (https://formsubmit.co). The very first submission triggers a one-time
     activation email to that inbox; click "Activate" and every later lead
     arrives automatically.
  ------------------------------------------------------------------ */
  var CONFIG = {
    LEAD_EMAIL: 'masroorshad@gmail.com',
    ENDPOINT: 'https://formsubmit.co/ajax/masroorshad@gmail.com',
    BROCHURE_URL: 'assets/docs/Sobha-Central-Factbook.pdf',
    BROCHURE_NAME: 'Sobha-Central-Factbook.pdf',
    WHATSAPP: '917980702399'
  };

  var PLANS = {
    '1': { unit: '1 BHK', type: '1 Bedroom Residence', price: 'AED 1.78 Million' },
    '2': { unit: '2 BHK', type: '2 Bedroom Residence', price: 'AED 2.47 Million' },
    '3': { unit: '3 BHK', type: '3 Bedroom Residence', price: 'AED 4.78 Million' }
  };

  var CONTEXTS = {
    'brochure':     { eyebrow: 'Brochure',     title: 'Download the Factbook', sub: 'Fill in your details — your download begins as soon as you submit.', cta: 'Submit & Download', subject: 'Brochure Download' },
    'floor-plan':   { eyebrow: 'Floor Plan',   title: 'View Floor Plan',       sub: 'Share your details and we will send the detailed floor plan to you right away.', cta: 'Get Floor Plan', subject: 'Floor Plan Request' },
    'payment-plan': { eyebrow: 'Payment Plan', title: 'View Payment Plan',     sub: 'Receive the complete payment schedule and current availability.', cta: 'Get Payment Plan', subject: 'Payment Plan Request' },
    'site-visit':   { eyebrow: 'Site Visit',   title: 'Request a Site Visit',  sub: 'Choose a time that suits you — our advisor will confirm your private viewing.', cta: 'Request Visit', subject: 'Site Visit Request' },
    'general':      { eyebrow: 'Enquire',      title: 'Request Details',       sub: 'Share your details and our advisor will be in touch shortly.', cta: 'Submit', subject: 'General Enquiry' }
  };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  document.documentElement.classList.remove('no-js');
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- nav ---------------- */
  var nav = $('#nav'), burger = $('#burger'), links = $('#navLinks');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('a', links).forEach(function (a) {
    a.addEventListener('click', function () { links.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); });
  });

  /* ---------------- reveal + active nav ---------------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });

    var navMap = {};
    $$('a', links).forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && navMap[e.target.id]) {
          $$('a', links).forEach(function (a) { a.classList.remove('is-current'); });
          navMap[e.target.id].classList.add('is-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('section[id]').forEach(function (s) { so.observe(s); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- floor plan drawings ---------------- */
  function planSVG(beds) {
    var g = '#c9a35f', l = 'rgba(244,239,230,.55)', t = 'rgba(244,239,230,.5)';
    var W = 600, H = 400, rooms = [];
    if (beds === 1) {
      rooms = [[20, 20, 300, 220, 'LIVING / DINING'], [320, 20, 260, 220, 'BEDROOM'], [20, 240, 180, 140, 'KITCHEN'], [200, 240, 120, 140, 'BATH'], [320, 240, 260, 140, 'BALCONY']];
    } else if (beds === 2) {
      rooms = [[20, 20, 280, 230, 'LIVING / DINING'], [300, 20, 280, 170, 'MASTER BEDROOM'], [300, 190, 160, 190, 'BEDROOM 2'], [460, 190, 120, 95, 'BATH'], [460, 285, 120, 95, 'BATH'], [20, 250, 170, 130, 'KITCHEN'], [190, 250, 110, 130, 'BALCONY']];
    } else {
      rooms = [[20, 20, 250, 210, 'LIVING'], [270, 20, 160, 210, 'DINING'], [430, 20, 150, 150, 'MASTER'], [430, 170, 150, 100, 'BATH'], [20, 230, 150, 150, 'BEDROOM 2'], [170, 230, 140, 150, 'BEDROOM 3'], [310, 230, 120, 75, 'BATH'], [310, 305, 120, 75, 'KITCHEN'], [430, 270, 150, 110, 'BALCONY']];
    }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" fill="none">';
    s += '<rect x="10" y="10" width="580" height="380" stroke="' + g + '" stroke-width="5"/>';
    rooms.forEach(function (r) {
      s += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" stroke="' + l + '" stroke-width="2"/>';
      s += '<text x="' + (r[0] + r[2] / 2) + '" y="' + (r[1] + r[3] / 2) + '" fill="' + t + '" font-family="Jost, sans-serif" font-size="12" letter-spacing="3" text-anchor="middle">' + r[4] + '</text>';
      s += '<path d="M' + (r[0] + 14) + ' ' + (r[1] + r[3]) + ' a26 26 0 0 1 26 -26" stroke="' + l + '" stroke-width="1"/>';
    });
    for (var i = 0; i < 6; i++) s += '<line x1="' + (40 + i * 90) + '" y1="10" x2="' + (90 + i * 90) + '" y2="10" stroke="#f1dcaa" stroke-width="7"/>';
    s += '</svg>';
    return s;
  }
  var drawing = $('#planDrawing'), planType = $('#planType'), planPrice = $('#planPrice'), planBtn = $('#planBtn');
  function setPlan(k) {
    var p = PLANS[k];
    drawing.classList.add('is-swapping');
    setTimeout(function () {
      drawing.innerHTML = planSVG(+k);
      drawing.classList.remove('is-swapping');
    }, 220);
    planType.textContent = p.type;
    planPrice.textContent = p.price;
    planBtn.setAttribute('data-unit', p.unit);
  }
  drawing.innerHTML = planSVG(1);
  $$('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('.tab').forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true');
      setPlan(tab.getAttribute('data-plan'));
    });
  });

  /* ---------------- modal ---------------- */
  var modal = $('#modal'), modalForm = $('#modalForm'), lastFocus = null;
  function openModal(ctx, unit) {
    var c = CONTEXTS[ctx] || CONTEXTS.general;
    modalForm.setAttribute('data-context', ctx);
    modalForm.setAttribute('data-unit', unit || '');
    $('#modalEyebrow').textContent = c.eyebrow + (unit ? ' · ' + unit : '');
    $('#modalTitle').textContent = c.title;
    $('#modalSub').textContent = c.sub;
    $('#modalSubmit').textContent = c.cta;
    var msg = $('.form-msg', modalForm); msg.textContent = ''; msg.className = 'form-msg';
    lastFocus = document.activeElement;
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    setTimeout(function () { $('input', modalForm).focus(); }, 120);
  }
  function closeModal() {
    modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-enquire]');
    if (t) { e.preventDefault(); openModal(t.getAttribute('data-enquire'), t.getAttribute('data-unit')); }
  });
  $$('[data-close]', modal).forEach(function (b) { b.addEventListener('click', closeModal); });

  /* ---------------- form submission ---------------- */
  function validate(form) {
    var ok = true;
    $$('input[required]', form).forEach(function (inp) {
      var v = inp.value.trim(), bad = !v;
      if (inp.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      if (inp.type === 'tel') bad = v.replace(/\D/g, '').length < 7;
      inp.closest('.field').classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    return ok;
  }
  function downloadBrochure() {
    var a = document.createElement('a');
    a.href = CONFIG.BROCHURE_URL; a.download = CONFIG.BROCHURE_NAME;
    document.body.appendChild(a); a.click(); a.remove();
  }
  function send(data) {
    return fetch(CONFIG.ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; }); });
  }

  $$('.js-enquiry').forEach(function (form) {
    $$('input', form).forEach(function (inp) {
      inp.addEventListener('input', function () { inp.closest('.field').classList.remove('is-invalid'); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('.form-msg', form), btn = $('button[type="submit"]', form);
      msg.className = 'form-msg'; msg.textContent = '';
      if (!validate(form)) { msg.classList.add('is-err'); msg.textContent = 'Please complete all fields with valid details.'; return; }

      var ctx = form.getAttribute('data-context') || 'general';
      var unit = form.getAttribute('data-unit') || '';
      var c = CONTEXTS[ctx] || CONTEXTS.general;
      var f = new FormData(form);
      var data = {
        name: f.get('name').trim(),
        email: f.get('email').trim(),
        phone: f.get('phone').trim(),
        city: f.get('city').trim(),
        enquiry_type: c.subject,
        unit_type: unit || '—',
        project: 'Sobha Central by Sobha Realty',
        page: location.href,
        submitted_at: new Date().toString(),
        _subject: 'New Lead: ' + c.subject + (unit ? ' (' + unit + ')' : '') + ' — Sobha Central',
        _replyto: f.get('email').trim(),
        _template: 'table',
        _captcha: 'false'
      };

      var original = btn.textContent;
      btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Sending…';

      // The brochure is delivered whatever the network does — never block the visitor.
      if (ctx === 'brochure') downloadBrochure();

      send(data).then(function (res) {
        var success = res.ok && String(res.body.success) !== 'false';
        if (!success) throw new Error(res.body.message || 'send failed');
        msg.classList.add('is-ok');
        msg.textContent = ctx === 'brochure'
          ? 'Thank you, ' + data.name.split(' ')[0] + '. Your brochure is downloading — an advisor will follow up shortly.'
          : 'Thank you, ' + data.name.split(' ')[0] + '. Our advisor will contact you shortly.';
        form.reset();
        if (form === modalForm) setTimeout(closeModal, 3200);
      }).catch(function () {
        msg.classList.add('is-err');
        msg.innerHTML = 'We couldn’t send that just now. Please <a href="https://wa.me/' + CONFIG.WHATSAPP +
          '?text=' + encodeURIComponent('Hi, I am ' + data.name + ' from ' + data.city + '. ' + data._subject) +
          '" target="_blank" rel="noopener" style="color:#f1dcaa;text-decoration:underline">message us on WhatsApp</a> instead.';
      }).then(function () {
        btn.removeAttribute('aria-busy'); btn.textContent = original;
      });
    });
  });

  /* ---------------- lightbox ---------------- */
  var lb = $('#lightbox'), lbImg = $('img', lb), lbList = [], lbIdx = 0;
  function showLb(i) { lbIdx = (i + lbList.length) % lbList.length; lbImg.src = lbList[lbIdx]; }
  function openLb(list, i) { lbList = list; showLb(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); }
  function closeLb() { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock'); }
  var galleryBtns = $$('#gallery-grid .g');
  var gallerySrcs = galleryBtns.map(function (b) { return b.getAttribute('data-src'); });
  galleryBtns.forEach(function (b, i) { b.addEventListener('click', function () { openLb(gallerySrcs, i); }); });
  $$('.loc__map, .loc__plan').forEach(function (b) { b.addEventListener('click', function () { openLb([b.getAttribute('data-src')], 0); }); });
  $('.lightbox__close', lb).addEventListener('click', closeLb);
  $('.lightbox__nav--prev', lb).addEventListener('click', function () { showLb(lbIdx - 1); });
  $('.lightbox__nav--next', lb).addEventListener('click', function () { showLb(lbIdx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (lb.classList.contains('is-open')) closeLb(); else if (modal.classList.contains('is-open')) closeModal(); }
    if (lb.classList.contains('is-open') && lbList.length > 1) {
      if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
      if (e.key === 'ArrowRight') showLb(lbIdx + 1);
    }
  });

  /* ---------------- video ---------------- */
  var yt = $('#yt');
  yt.addEventListener('click', function () {
    if ($('iframe', yt)) return;
    var id = yt.getAttribute('data-id');
    yt.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1" title="Sobha Central virtual tour" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  });
  var reel = $('#reel'), reelBtn = $('#reelBtn'), reelWrap = reel.parentNode;
  function toggleReel() {
    if (reel.paused) {
      reel.muted = false; reel.volume = 1; reel.controls = true; reel.play();
      reelWrap.classList.add('is-playing');
    } else { reel.pause(); }
  }
  reelBtn.addEventListener('click', toggleReel);
  reel.addEventListener('click', function () { if (!reel.controls) toggleReel(); });
  reel.addEventListener('pause', function () { reelWrap.classList.remove('is-playing'); });
  reel.addEventListener('play', function () { reelWrap.classList.add('is-playing'); });
})();
