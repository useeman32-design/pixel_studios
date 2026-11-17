/* ============================================================
   PIXEL STUDIOS · Card & NFC device management dashboard
   ------------------------------------------------------------
   BACKEND HOOK — everything below renders from the DASH object.
   When your API is ready:
     Dash.api = "https://yourdomain.com/api"     (set it below)
     Dash.load()  → GET  /dashboard   (expects the same shape as DASH)
     Dash.save()  → POST /page        (sends the edited business page)
     Dash.act()   → POST /device      (pause, resume, re-point, delete)
   Until then it runs fully offline with the demo data.
   ============================================================ */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  var money = function (n) { return "₦" + Number(n).toLocaleString("en-NG"); };
  var num = function (n) { return Number(n).toLocaleString("en-NG"); };

  /* ---------------- icons ---------------- */
  var I = {
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    tap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6.5 4.2a10.8 10.8 0 010 15.6"/><path d="M10 7.5a6.2 6.2 0 010 9"/><path d="M13.5 10.6a1.9 1.9 0 010 2.8"/><circle cx="17.6" cy="12" r=".9" fill="currentColor" stroke="none"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    call: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 6 10-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20z"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    fb: '<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    li: '<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    qr: '<svg viewBox="0 0 24 24"><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h3v3h-3zM18 18h3v3h-3zM13 18h2v2h-2zM18 13h2v2h-2z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5v14M15 5v14"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
    grip: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
    downChev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'
  };

  /* ============================================================
     SESSION GUARD
     Flip REQUIRE_LOGIN to true the day your API issues real tokens.
     While false the dashboard runs on the demo data below, so you can
     show it to clients straight after uploading to cPanel.
     ============================================================ */
  var REQUIRE_LOGIN = false;
  var LOGIN_URL = "login.html";
  if (REQUIRE_LOGIN) {
    var saved = null;
    try { saved = localStorage.getItem("ps_auth_token"); } catch (e) {}
    if (!saved) {
      window.location.replace(LOGIN_URL + "?next=" + encodeURIComponent("index.html"));
    }
  }

  /* ============================================================
     DATA  ← replace with your API response
     ============================================================ */
  var DASH = {
    api: "",                                  // ← your API root
    owner: { name: "Amina Bello", first: "Amina", plan: "Premium Portfolio", initials: "AB" },
    pageUrl: "https://pixelstudios.com/card/amina",
    stats: { views: 1284, taps: 342, saves: 96, chats: 71 },
    deltas: { views: 12, taps: 8, saves: 21, chats: -4 },
    series: {                                  // last 14 days: [views, taps]
      labels: ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "S"],
      views: [42, 55, 48, 71, 88, 63, 40, 52, 69, 74, 96, 120, 85, 61],
      taps: [12, 18, 14, 22, 27, 19, 11, 15, 21, 24, 31, 38, 26, 18]
    },
    devices: [
      { id: "d1", type: "card", name: "Premium PVC card", link: "pixelstudios.com/card/amina", status: "live", views: 842, issued: "12 Mar 2026", material: "Matte black PVC" },
      { id: "d2", type: "keychain", name: "Keychain tag", link: "pixelstudios.com/card/amina", status: "live", views: 210, issued: "12 Mar 2026", material: "Black acrylic" },
      { id: "d3", type: "qr", name: "Menu QR — table cards", link: "pixelstudios.com/menu/aurelia", status: "paused", views: 180, issued: "02 Feb 2026", material: "12 × A6 stands" },
      { id: "d4", type: "sticker", name: "Phone sticker", link: "pixelstudios.com/card/amina", status: "live", views: 38, issued: "28 Apr 2026", material: "Slim NFC vinyl" },
      { id: "d5", type: "band", name: "Event wristband", link: "pixelstudios.com/card/amina", status: "live", views: 14, issued: "09 Jun 2026", material: "Silicone, lime" }
    ],
    actions: [
      { k: "WhatsApp", v: 412, icon: "wa" },
      { k: "Save contact", v: 296, icon: "user" },
      { k: "Call", v: 148, icon: "call" },
      { k: "Instagram", v: 121, icon: "ig" },
      { k: "Directions", v: 74, icon: "pin" },
      { k: "Email", v: 33, icon: "mail" }
    ],
    activity: [
      { t: "<b>WhatsApp</b> button clicked", w: "2 minutes ago · PVC card", i: "wa", lime: true },
      { t: "Profile viewed from <b>Lagos</b>", w: "18 minutes ago · Keychain tag", i: "eye" },
      { t: "<b>Contact saved</b> to a phone", w: "1 hour ago · PVC card", i: "user", lime: true },
      { t: "Menu QR paused by you", w: "Yesterday, 4:12pm", i: "pause" },
      { t: "<b>3 taps</b> at the Abuja property expo", w: "Yesterday, 11:40am · Event wristband", i: "tap" },
      { t: "New order <b>PS-2863</b> is in production", w: "2 days ago", i: "box" }
    ],
    page: {
      firstName: "Amina", lastName: "Bello", rank: "Managing Director", business: "Aurelia Homes",
      type: "Real Estate", city: "Abuja",
      bio: "Helping families and investors find homes that actually fit — verified listings, honest advice and paperwork handled end to end.",
      phone: "+234 903 152 8732", whatsapp: "+234 903 152 8732", email: "amina@aureliahomes.ng",
      website: "https://aureliahomes.ng", address: "14B Adeola Hopewell Crescent, Wuse 2, Abuja",
      instagram: "https://instagram.com/aureliahomes", x: "https://x.com/aureliahomes",
      facebook: "https://facebook.com/aureliahomes", linkedin: "https://linkedin.com/company/aureliahomes",
      accent: "#00bfb8",
      buttons: { save: true, whatsapp: true, call: true, email: true, directions: true, website: false }
    },
    services: [
      { n: "Property sales", p: "From ₦45M" },
      { n: "Rentals & short lets", p: "From ₦250k" },
      { n: "Title verification", p: "₦75,000" },
      { n: "Investment advisory", p: "Free consult" }
    ],
    menu: [
      { cat: "Starters", items: [
        { n: "Suya skewers", p: 3500, on: true },
        { n: "Peppered gizzard", p: 4200, on: true },
        { n: "Spring rolls (6)", p: 2800, on: true }
      ] },
      { cat: "Mains", items: [
        { n: "Jollof rice & grilled chicken", p: 6500, on: true },
        { n: "Pounded yam & egusi", p: 7200, on: true },
        { n: "Ofada rice & ayamase", p: 6800, on: true },
        { n: "Grilled tilapia & fried plantain", p: 8500, on: false }
      ] },
      { cat: "Drinks", items: [
        { n: "Chapman", p: 2500, on: true },
        { n: "Zobo", p: 1500, on: true },
        { n: "Fresh pineapple juice", p: 1800, on: true }
      ] }
    ],
    team: [
      { n: "Amina Bello", r: "Managing Director", c: "PVC card", live: true, views: 842 },
      { n: "Musa Ibrahim", r: "Sales Manager", c: "PVC card", live: true, views: 318 },
      { n: "Grace Okoro", r: "Client Relations", c: "Keychain tag", live: true, views: 126 }
    ],
    orders: [
      { id: "PS-2863", item: "5 × team PVC cards", date: "14 Sep 2026", total: 175000, step: 2, status: "In production" },
      { id: "PS-2847", item: "12 × menu QR table stands", date: "28 Aug 2026", total: 96000, step: 1, status: "Design review" },
      { id: "PS-2791", item: "1 × premium PVC card + keychain", date: "12 Mar 2026", total: 55000, step: 4, status: "Delivered" },
      { id: "PS-2764", item: "Event wristbands × 40", date: "02 Feb 2026", total: 420000, step: 4, status: "Delivered" },
      { id: "PS-2712", item: "Phone stickers × 3", date: "11 Jan 2026", total: 24000, step: 4, status: "Delivered" }
    ],
    weeks: [
      { w: "This week", views: 486, taps: 152, saves: 41, chats: 33, chg: 12 },
      { w: "Last week", views: 434, taps: 128, saves: 34, chats: 26, chg: 8 },
      { w: "2 weeks ago", views: 402, taps: 111, saves: 27, chats: 19, chg: -3 },
      { w: "3 weeks ago", views: 414, taps: 119, saves: 31, chats: 22, chg: 5 }
    ]
  };
  window.PIXEL_DASH = DASH;

  /* ---------------- API plumbing (fill in DASH.api later) ---------------- */
  var Dash = {
    load: function () {
      if (!DASH.api) return Promise.resolve(DASH);
      return fetch(DASH.api.replace(/\/$/, "") + "/dashboard", { headers: { Authorization: "Bearer " + (localStorage.getItem("ps_auth_token") || "") } })
        .then(function (r) { return r.json(); })
        .then(function (d) { if (d && d.ok !== false) { Object.assign(DASH, d.data || d); renderAll(); } return DASH; })
        .catch(function () { return DASH; });
    },
    save: function (what, body) {
      if (!DASH.api) return Promise.resolve({ ok: true, offline: true });
      return fetch(DASH.api.replace(/\/$/, "") + "/" + what, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + (localStorage.getItem("ps_auth_token") || "") },
        body: JSON.stringify(body)
      }).then(function (r) { return r.json(); }).catch(function () { return { ok: false, error: "Network error" }; });
    }
  };
  window.Dash = Dash;

  /* ---------------- toast ---------------- */
  var toast = $("#toast"), toastText = $("#toastText"), tt = null;
  function say(msg) {
    if (!toast) return;
    toastText.textContent = msg;
    toast.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () { toast.classList.remove("show"); }, 2700);
  }

  /* ============================================================
     RENDERERS
     ============================================================ */
  function statCard(label, value, delta, icon, lime) {
    var up = delta >= 0;
    return '<div class="stat reveal">' +
      '<div class="top"><span class="lbl">' + label + '</span>' +
      '<span class="ic' + (lime ? ' lime' : '') + '">' + (I[icon] || I.eye) + '</span></div>' +
      '<div class="val" data-count="' + value + '">0</div>' +
      '<div class="chg ' + (up ? "up" : "down") + '">' + (up ? I.up : I.downChev) + Math.abs(delta) + '% <span>vs last week</span></div>' +
      '</div>';
  }

  function renderStats(target, big) {
    var t = $(target);
    if (!t) return;
    t.innerHTML =
      statCard("Profile views", DASH.stats.views, DASH.deltas.views, "eye", true) +
      statCard("Card taps", DASH.stats.taps, DASH.deltas.taps, "tap") +
      statCard("Contacts saved", DASH.stats.saves, DASH.deltas.saves, "user") +
      statCard("WhatsApp chats", DASH.stats.chats, DASH.deltas.chats, "wa");
    countUp(t);
    revealIn(t);
  }

  function countUp(root) {
    $$("[data-count]", root).forEach(function (n) {
      var target = parseInt(n.getAttribute("data-count"), 10) || 0;
      var t0 = null, dur = 1200;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        n.textContent = num(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  var revealIO = ("IntersectionObserver" in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } });
  }, { threshold: .08 }) : null;
  function revealIn(root) {
    $$(".reveal", root || document).forEach(function (n) {
      if (revealIO) revealIO.observe(n); else n.classList.add("in");
    });
  }

  function renderChart(target, labels, views, taps, animate) {
    var t = $(target);
    if (!t) return;
    var max = Math.max.apply(null, views.concat(taps)) || 1;
    t.innerHTML = "";
    labels.forEach(function (lb, i) {
      var col = el("div", "col");
      var bw = el("div", "bar-wrap");
      var b1 = el("div", "bar");
      var b2 = el("div", "bar b2");
      bw.appendChild(b1); bw.appendChild(b2);
      col.appendChild(bw);
      col.appendChild(el("div", "x", lb));
      col.title = labels[i] + " · " + views[i] + " views, " + taps[i] + " taps";
      t.appendChild(col);
      var h1 = (views[i] / max * 100).toFixed(1) + "%";
      var h2 = (taps[i] / max * 100).toFixed(1) + "%";
      if (animate) {
        setTimeout(function () { b1.style.height = h1; b2.style.height = h2; }, 60 + i * 34);
      } else { b1.style.height = h1; b2.style.height = h2; }
    });
  }

  function artClass(type) {
    return type === "keychain" ? "art key" : type === "band" ? "art band" : type === "sticker" ? "art stick"
      : type === "qr" ? "art qr" : "art";
  }
  function artInner(type) {
    return type === "qr" ? I.qr : "";
  }
  function statusPill(s) {
    if (s === "live") return '<span class="pill pill-live"><span class="dot"></span>Live</span>';
    if (s === "paused") return '<span class="pill pill-paused"><span class="dot"></span>Paused</span>';
    return '<span class="pill pill-off"><span class="dot"></span>Lost</span>';
  }

  function deviceRow(d, compact) {
    var row = el("div", "dev");
    row.setAttribute("data-id", d.id);
    row.innerHTML =
      '<span class="' + artClass(d.type) + '">' + artInner(d.type) + '</span>' +
      '<span class="info"><span class="n">' + d.name + '</span>' +
      '<span class="s">' + d.link + (compact ? "" : " · " + d.material) + '</span></span>' +
      (compact
        ? '<span class="meta">' + statusPill(d.status) + '</span>'
        : '<span class="meta"><span class="v">' + num(d.views) + '</span><br /><span class="vl">views</span></span>' +
          '<span class="meta" style="min-width:86px;">' + statusPill(d.status) + '</span>') +
      '<span class="tools">' +
        '<button class="mini" data-act="qr" title="Download QR">' + I.down + '</button>' +
        '<button class="mini" data-act="link" title="Edit destination">' + I.edit + '</button>' +
        '<button class="mini" data-act="toggle" title="' + (d.status === "live" ? "Pause device" : "Resume device") + '">' +
          (d.status === "live" ? I.pause : I.play) + '</button>' +
        '<button class="mini danger" data-act="del" title="Remove device">' + I.trash + '</button>' +
      '</span>';
    return row;
  }

  function renderDevices() {
    var host = $("#devList"), home = $("#devListHome");
    var filter = ($("#deviceFilter") || {}).value || "all";
    var q = ($("#globalSearch") || {}).value ? $("#globalSearch").value.toLowerCase() : "";

    var list = DASH.devices.filter(function (d) {
      if (filter !== "all" && d.type !== filter) return false;
      if (q && (d.name + " " + d.link + " " + d.type).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });

    if (host) {
      host.innerHTML = "";
      if (!list.length) {
        host.appendChild(el("div", "dev", '<span class="info"><span class="n">No devices match</span><span class="s">Try a different filter or search.</span></span>'));
      } else list.forEach(function (d) { host.appendChild(deviceRow(d, false)); });
    }
    if (home) {
      home.innerHTML = "";
      DASH.devices.slice(0, 4).forEach(function (d) { home.appendChild(deviceRow(d, true)); });
    }

    var live = DASH.devices.filter(function (d) { return d.status === "live"; }).length;
    var line = $("#deviceCountLine");
    if (line) line.textContent = DASH.devices.length + " devices · " + live + " live";
    var dc = $("#devCount");
    if (dc) dc.textContent = DASH.devices.length;

    // summary cards on the devices view
    var sum = $("#deviceSummary");
    if (sum) {
      var byType = {};
      DASH.devices.forEach(function (d) { byType[d.type] = (byType[d.type] || 0) + 1; });
      sum.innerHTML =
        '<div class="panel card-pad reveal"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;"><div><div style="font-size:12.5px;color:var(--ink-3)">Total views</div><div style="font-size:28px;font-weight:800;letter-spacing:-.04em;margin-top:4px;">' +
          num(DASH.devices.reduce(function (a, d) { return a + d.views; }, 0)) + '</div></div><span class="ic lime" style="width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:var(--lime-soft);color:#00726c">' + I.eye + '</span></div></div>' +
        '<div class="panel card-pad reveal"><div style="font-size:12.5px;color:var(--ink-3)">Devices by type</div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;">' +
          Object.keys(byType).map(function (k) { return '<span class="pill">' + k + ' × ' + byType[k] + '</span>'; }).join("") +
          '</div></div>' +
        '<div class="panel card-pad reveal"><div style="font-size:12.5px;color:var(--ink-3)">Top performer</div>' +
          (function () { var t = DASH.devices.slice().sort(function (a, b) { return b.views - a.views; })[0];
            return '<div style="font-size:17px;font-weight:700;margin-top:5px;letter-spacing:-.02em;">' + t.name + '</div><div style="font-size:12.5px;color:var(--ink-3);margin-top:2px;">' + num(t.views) + ' views · ' + t.issued + '</div>'; })() +
          '</div>';
      revealIn(sum);
    }
  }

  function renderActivity() {
    var t = $("#activity");
    if (!t) return;
    t.innerHTML = "";
    DASH.activity.forEach(function (a) {
      t.appendChild(el("div", "act-item",
        '<span class="d' + (a.lime ? " lime" : "") + '">' + (I[a.i] || I.eye) + '</span>' +
        '<span><span class="t">' + a.t + '</span><span class="w">' + a.w + '</span></span>'));
    });
  }

  function renderRanking(target, rows, grey) {
    var t = $(target);
    if (!t) return;
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; })) || 1;
    t.innerHTML = "";
    rows.forEach(function (r) {
      var row = el("div", "rank-row");
      row.innerHTML = '<span class="nm">' + (r.icon ? '<span style="display:inline-block;width:14px;vertical-align:-2px;margin-right:6px;color:var(--ink-2)">' + I[r.icon] + '</span>' : "") + r.k + '</span>' +
        '<span class="track"><span class="fill' + (grey ? " grey" : "") + '"></span></span>' +
        '<span class="vv">' + num(r.v) + '</span>';
      t.appendChild(row);
      var f = $(".fill", row);
      setTimeout(function () { f.style.width = (r.v / max * 100).toFixed(1) + "%"; }, 120);
    });
  }

  function renderActions() {
    renderRanking("#topActions", DASH.actions.slice(0, 5));
    renderRanking("#actionBreakdown", DASH.actions);
    var byDev = DASH.devices.map(function (d) { return { k: d.name, v: d.views }; })
      .sort(function (a, b) { return b.v - a.v; });
    renderRanking("#deviceBreakdown", byDev, true);
  }

  /* ---------------- menu editor ---------------- */
  function renderMenu() {
    var host = $("#menuList");
    if (!host) return;
    host.innerHTML = "";
    DASH.menu.forEach(function (cat, ci) {
      var box = el("div", "menu-cat");
      var head = el("div", "menu-cat-head");
      head.innerHTML = '<span style="color:#00837d;font-weight:800;font-size:12px;">' + String(ci + 1).padStart(2, "0") + '</span>' +
        '<input value="' + cat.cat.replace(/"/g, "&quot;") + '" data-cat="' + ci + '" aria-label="Category name" />' +
        '<button class="mini" data-additem="' + ci + '" title="Add item">+</button>' +
        '<button class="mini danger" data-delcat="' + ci + '" title="Delete category">' + I.trash + '</button>';
      box.appendChild(head);

      cat.items.forEach(function (it, ii) {
        var row = el("div", "menu-item");
        row.innerHTML =
          '<span class="grip">' + I.grip + '</span>' +
          '<input class="nm" value="' + it.n.replace(/"/g, "&quot;") + '" data-item="' + ci + ':' + ii + ':n" aria-label="Item name" />' +
          '<input class="pr" value="' + num(it.p) + '" data-item="' + ci + ':' + ii + ':p" aria-label="Price" />' +
          '<span class="avail"><label class="switch" style="width:34px;height:20px;"><input type="checkbox" ' + (it.on ? "checked" : "") + ' data-item="' + ci + ':' + ii + ':on" /><span class="track"></span><span class="knob" style="width:14px;height:14px;"></span></label></span>' +
          '<button class="mini danger" data-delitem="' + ci + ':' + ii + '" title="Remove">' + I.trash + '</button>';
        box.appendChild(row);
      });
      host.appendChild(box);
    });

    $$(".switch input", host).forEach(function (inp) {
      var knob = inp.parentNode.querySelector(".knob");
      if (knob) knob.style.transform = inp.checked ? "translateX(14px)" : "none";
      inp.addEventListener("change", function () { knob.style.transform = inp.checked ? "translateX(14px)" : "none"; markMenuDirty(); });
    });
  }
  var menuDirty = false;
  function markMenuDirty() { menuDirty = true; }

  /* ---------------- team ---------------- */
  function renderTeam() {
    var t = $("#teamList");
    if (!t) return;
    t.innerHTML = "";
    DASH.team.forEach(function (m, i) {
      var initials = m.n.split(" ").map(function (s) { return s[0]; }).join("").slice(0, 2);
      t.appendChild(el("div", "member",
        '<span class="av' + (i === 0 ? " lime" : "") + '">' + initials + '</span>' +
        '<span style="flex:1;min-width:0;"><span class="n">' + m.n + '</span><br /><span class="r">' + m.r + '</span></span>' +
        '<span class="pill">' + m.c + '</span>' +
        '<span style="min-width:70px;text-align:right;"><span style="font-size:13.5px;font-weight:700;">' + num(m.views) + '</span><br /><span style="font-size:10.5px;color:var(--ink-3)">views</span></span>' +
        '<span class="tools" style="display:flex;gap:6px;">' +
          '<button class="mini" data-member-qr="' + i + '" title="Download their QR">' + I.down + '</button>' +
          (i === 0 ? "" : '<button class="mini danger" data-member-del="' + i + '" title="Remove">' + I.trash + '</button>') +
        '</span>'));
    });
    var c = $("#teamCount");
    if (c) c.textContent = DASH.team.length + " people · " + DASH.team.length + " cards issued";
  }

  /* ---------------- orders ---------------- */
  function renderOrders() {
    var t = $("#orderTable");
    if (!t) return;
    t.innerHTML = "";
    DASH.orders.forEach(function (o) {
      var steps = "";
      for (var i = 1; i <= 4; i++) steps += '<i class="' + (i <= o.step ? "on" : "") + '"></i>';
      t.appendChild(el("tr", "",
        '<td><b style="font-weight:700;">' + o.id + '</b></td>' +
        '<td>' + o.item + '</td>' +
        '<td class="muted" style="font-size:13px;">' + o.date + '</td>' +
        '<td style="font-weight:700;">' + money(o.total) + '</td>' +
        '<td><span class="order-status">' + o.status + '</span><span class="steps-mini">' + steps + '</span></td>' +
        '<td style="text-align:right;"><button class="btn btn-ghost btn-sm" data-order="' + o.id + '">Details</button></td>'));
    });
  }

  function renderWeeks() {
    var t = $("#weekTable");
    if (!t) return;
    t.innerHTML = "";
    DASH.weeks.forEach(function (w) {
      t.appendChild(el("tr", "",
        '<td style="font-weight:600;">' + w.w + '</td><td>' + num(w.views) + '</td><td>' + num(w.taps) + '</td>' +
        '<td>' + num(w.saves) + '</td><td>' + num(w.chats) + '</td>' +
        '<td><span class="chg ' + (w.chg >= 0 ? "up" : "down") + '" style="display:inline-flex;align-items:center;gap:4px;font-weight:600;color:' + (w.chg >= 0 ? "#00726c" : "#a03a3a") + '">' +
        (w.chg >= 0 ? I.up : I.downChev) + Math.abs(w.chg) + '%</span></td>'));
    });
  }

  /* ============================================================
     BUSINESS PAGE EDITOR + LIVE PREVIEW
     ============================================================ */
  var dirty = false;
  var snapshot = JSON.stringify(DASH.page);

  function setDirty(v) {
    dirty = v;
    var st = $("#saveState");
    if (st) st.innerHTML = v ? "<b>Unsaved changes</b>" : "All changes saved";
    if (st) st.style.color = v ? "#8a6314" : "";
  }

  function readForm() {
    $$("[data-pv]").forEach(function (inp) {
      DASH.page[inp.getAttribute("data-pv")] = inp.value;
    });
    $$("[data-btn]").forEach(function (cb) {
      DASH.page.buttons[cb.getAttribute("data-btn")] = cb.checked;
    });
  }

  function writeForm() {
    $$("[data-pv]").forEach(function (inp) {
      var k = inp.getAttribute("data-pv");
      if (DASH.page[k] !== undefined) inp.value = DASH.page[k];
    });
    $$("[data-btn]").forEach(function (cb) {
      cb.checked = !!DASH.page.buttons[cb.getAttribute("data-btn")];
    });
    $$("#swatches .swatch").forEach(function (s) {
      s.classList.toggle("sel", s.getAttribute("data-c") === DASH.page.accent);
    });
    var bc = $("#bioCount");
    if (bc) bc.textContent = (DASH.page.bio || "").length;
  }

  function renderPreview() {
    var p = DASH.page;
    var name = ((p.firstName || "") + " " + (p.lastName || "")).trim() || "Your name";
    $("#pvName").textContent = name;
    $("#pvRank").textContent = p.rank || "";
    $("#pvRank").style.color = p.accent;
    $("#pvBiz").textContent = [p.business, p.type, p.city].filter(Boolean).join(" · ");
    $("#pvBio").textContent = p.bio || "";
    var ini = ((p.firstName || "?")[0] + (p.lastName || "")[0]).toUpperCase();
    $("#pvAv").textContent = ini;
    $("#pvAvatar").textContent = ini;

    // accent drives the preview
    $("#pvAv").style.background = "linear-gradient(150deg," + p.accent + "," + shade(p.accent, -.35) + ")";
    $("#pvCover").style.background =
      "radial-gradient(90% 90% at 20% 0%," + hexa(p.accent, .55) + ",transparent 60%), linear-gradient(150deg,#1a1a1f,#0e1315)";

    // socials
    var soc = $("#pvSocials");
    soc.innerHTML = "";
    [["instagram", "ig"], ["x", "x"], ["facebook", "fb"], ["linkedin", "li"]].forEach(function (pair) {
      if (p[pair[0]]) soc.appendChild(el("span", "", I[pair[1]]));
    });
    if (p.website) soc.appendChild(el("span", "", I.globe));

    // buttons
    var b = $("#pvBtns");
    b.innerHTML = "";
    if (p.buttons.save) {
      b.appendChild(el("div", "pv-btn primary", I.user + "Save my contact"));
    }
    var pair = [];
    if (p.buttons.whatsapp) pair.push(["pv-btn lime", I.wa + "WhatsApp"]);
    if (p.buttons.call) pair.push(["pv-btn", I.call + "Call"]);
    if (p.buttons.email) pair.push(["pv-btn", I.mail + "Email"]);
    if (p.buttons.directions) pair.push(["pv-btn", I.pin + "Directions"]);
    if (p.buttons.website) pair.push(["pv-btn", I.globe + "Website"]);
    for (var i = 0; i < pair.length; i += 2) {
      if (pair[i + 1]) {
        var g = el("div", "pv-2");
        g.appendChild(el("div", pair[i][0], pair[i][1]));
        g.appendChild(el("div", pair[i + 1][0], pair[i + 1][1]));
        b.appendChild(g);
      } else {
        b.appendChild(el("div", pair[i][0], pair[i][1]));
      }
    }

    // services
    var sv = $("#pvServices");
    sv.innerHTML = "";
    DASH.services.forEach(function (s) {
      sv.appendChild(el("div", "pv-svc", '<span class="n">' + s.n + '</span><span class="p">' + s.p + '</span>'));
    });
  }

  function hexa(hex, a) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
  function shade(hex, amt) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    r = Math.max(0, Math.min(255, Math.round(r * (1 + amt))));
    g = Math.max(0, Math.min(255, Math.round(g * (1 + amt))));
    b = Math.max(0, Math.min(255, Math.round(b * (1 + amt))));
    return "#" + [r, g, b].map(function (v) { return ("0" + v.toString(16)).slice(-2); }).join("");
  }

  /* ============================================================
     MODALS
     ============================================================ */
  var modal = $("#modal"), modalBox = $("#modalBox"), modalTitle = $("#modalTitle"), modalBody = $("#modalBody");

  function openModal(kind, ctx) {
    if (!modal) return;
    modalBox.classList.remove("wide");
    if (kind === "qr") {
      var d = ctx && ctx.device ? ctx.device : null;
      var url = d ? "https://" + d.link : DASH.pageUrl;
      var label = d ? d.name : "Business page";
      modalTitle.textContent = "QR code — " + label;
      modalBody.innerHTML =
        '<div class="qr-preview"><canvas id="modalQR"></canvas></div>' +
        '<p style="font-size:12.5px;color:var(--ink-3);text-align:center;margin:10px 0 16px;">' + url + '</p>' +
        '<div class="grid-2"><button class="btn btn-dark btn-sm" id="qrPng">Download PNG</button>' +
        '<button class="btn btn-outline btn-sm" id="qrPrint">Print sheet</button></div>' +
        '<p style="font-size:11.5px;color:var(--ink-3);margin-top:14px;text-align:center;">Print it on flyers, stands or stickers — same page, no NFC needed.</p>';
      if (window.PixelQR) window.PixelQR.render($("#modalQR"), url, { size: 220, fg: "#101418", bg: "#ffffff", radius: .22, quiet: 2 });
      $("#qrPng").addEventListener("click", function () {
        var c = $("#modalQR");
        var a = document.createElement("a");
        a.download = (d ? d.name : "pixel-card") .replace(/\s+/g, "-").toLowerCase() + "-qr.png";
        a.href = c.toDataURL("image/png");
        a.click();
        say("QR downloaded");
      });
      $("#qrPrint").addEventListener("click", function () { window.print(); });
    }

    else if (kind === "add-device") {
      modalTitle.textContent = "Add a device";
      modalBox.classList.add("wide");
      modalBody.innerHTML =
        '<p style="font-size:13px;color:var(--ink-2);margin-bottom:16px;">Ordering a new card, keychain, wristband or sticker? Tell us what you need and we programme it to your page before delivery.</p>' +
        '<div class="field"><label>Device type</label><select class="select" id="nd-type">' +
          '<option value="card">PVC smart card</option><option value="keychain">Keychain tag</option>' +
          '<option value="band">NFC wristband</option><option value="sticker">Phone sticker</option>' +
          '<option value="qr">QR print (no NFC)</option></select></div>' +
        '<div class="field"><label>Material / finish</label><select class="select" id="nd-mat">' +
          '<option>Matte black PVC</option><option>Gloss white PVC</option><option>Card stock paper</option>' +
          '<option>Brushed metal PVC</option><option>Silicone band</option><option>Vinyl sticker</option></select></div>' +
        '<div class="field"><label>Quantity</label><input class="input" id="nd-qty" type="number" min="1" value="1" /></div>' +
        '<div class="field"><label>Opens which page?</label><select class="select" id="nd-link">' +
          '<option>My business page — pixelstudios.com/card/amina</option>' +
          '<option>My digital menu — pixelstudios.com/menu/aurelia</option>' +
          '<option>A team member page</option>' +
          '<option>Direct to WhatsApp</option></select></div>' +
        '<div class="row-2" style="margin-top:20px;">' +
          '<button class="btn btn-outline" data-close>Cancel</button>' +
          '<a class="btn btn-primary" id="nd-order" href="#" target="_blank" rel="noopener">Order on WhatsApp</a>' +
        '</div>' +
        '<p style="font-size:11.5px;color:var(--ink-3);margin-top:12px;">Once your order ships, the device appears here automatically.</p>';
      var upd = function () {
        var t = $("#nd-type").value, m = $("#nd-mat").value, q = $("#nd-qty").value, l = $("#nd-link").value;
        $("#nd-order").href = "https://wa.me/2349031528732?text=" + encodeURIComponent(
          "Hello Pixel Studios! I want to order:\n• " + q + " × " + $("#nd-type").selectedOptions[0].text +
          "\n• Finish: " + m + "\n• Page: " + l + "\n\nName: " + DASH.owner.name);
      };
      ["nd-type", "nd-mat", "nd-qty", "nd-link"].forEach(function (id) { $("#" + id).addEventListener("input", upd); });
      upd();
      $("#nd-order").addEventListener("click", function () {
        // optimistically add a pending device so the UI feels real
        var typeName = $("#nd-type").selectedOptions[0].text;
        DASH.devices.push({
          id: "d" + (DASH.devices.length + 1) + Date.now(),
          type: $("#nd-type").value,
          name: typeName + " (on order)",
          link: "pixelstudios.com/card/amina",
          status: "paused",
          views: 0,
          issued: "Pending",
          material: $("#nd-mat").value
        });
        renderDevices();
        closeModal();
        say("Order started — device added as pending");
      });
    }

    else if (kind === "link") {
      var dev = ctx.device;
      modalTitle.textContent = "Where this device points";
      modalBody.innerHTML =
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">' +
          '<span class="' + artClass(dev.type) + '">' + artInner(dev.type) + '</span>' +
          '<span><span style="font-size:14px;font-weight:600;display:block;">' + dev.name + '</span>' +
          '<span style="font-size:12px;color:var(--ink-3);">' + dev.material + ' · issued ' + dev.issued + '</span></span></div>' +
        '<div class="field"><label for="lk-url">Destination URL</label>' +
          '<input class="input" id="lk-url" value="https://' + dev.link + '" />' +
          '<div class="hint">Change this and the device opens a different page — no reprogramming needed for NFC cards already in use.</div></div>' +
        '<div class="row-2" style="margin-top:18px;"><button class="btn btn-outline" data-close>Cancel</button>' +
          '<button class="btn btn-primary" id="lk-save">Save destination</button></div>';
      $("#lk-save").addEventListener("click", function () {
        var v = $("#lk-url").value.replace(/^https?:\/\//, "").replace(/\/$/, "");
        dev.link = v;
        Dash.save("device", { id: dev.id, link: v });
        renderDevices();
        closeModal();
        say("Destination updated");
      });
    }

    else if (kind === "add-member") {
      modalTitle.textContent = "Add a team member";
      modalBody.innerHTML =
        '<div class="field"><label>Full name</label><input class="input" id="tm-name" placeholder="e.g. Musa Ibrahim" /></div>' +
        '<div class="field"><label>Rank</label><select class="select" id="tm-rank">' +
          '<option>Sales Manager</option><option>Client Relations</option><option>Operations Manager</option>' +
          '<option>Consultant</option><option>Team Lead</option><option>Account Manager</option></select></div>' +
        '<div class="field"><label>Device</label><select class="select" id="tm-dev">' +
          '<option>PVC card</option><option>Keychain tag</option><option>Phone sticker</option></select></div>' +
        '<div class="row-2" style="margin-top:18px;"><button class="btn btn-outline" data-close>Cancel</button>' +
          '<button class="btn btn-primary" id="tm-add">Add member</button></div>' +
        '<p style="font-size:11.5px;color:var(--ink-3);margin-top:12px;">Their card opens your business page with their own name and rank.</p>';
      $("#tm-add").addEventListener("click", function () {
        var n = $("#tm-name").value.trim();
        if (!n) { say("Enter a name first"); return; }
        DASH.team.push({ n: n, r: $("#tm-rank").value, c: $("#tm-dev").value, live: true, views: 0 });
        Dash.save("team", { name: n, rank: $("#tm-rank").value, device: $("#tm-dev").value });
        renderTeam();
        closeModal();
        say(n + " added to your team");
      });
    }

    else if (kind === "order") {
      var o = ctx.order;
      var steps = ["Order placed", "Design review", "In production", "Delivered"];
      modalTitle.textContent = o.id;
      modalBody.innerHTML =
        '<div style="font-size:15px;font-weight:700;">' + o.item + '</div>' +
        '<div style="font-size:13px;color:var(--ink-3);margin-top:3px;">Placed ' + o.date + ' · ' + money(o.total) + '</div>' +
        '<div style="margin:20px 0;">' + steps.map(function (s, i) {
          var done = i < o.step;
          return '<div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;">' +
            '<span style="width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700;flex:0 0 auto;' +
            (done ? "background:var(--lime);color:var(--lime-ink);" : "background:var(--surface-2);border:1px solid var(--hairline-2);color:var(--ink-3);") + '">' +
            (done ? "✓" : i + 1) + '</span>' +
            '<span style="font-size:13.5px;' + (done ? "font-weight:600;" : "color:var(--ink-3);") + '">' + s + '</span></div>';
        }).join("") + '</div>' +
        '<div class="row-2"><a class="btn btn-outline" href="https://wa.me/2349031528732?text=' +
          encodeURIComponent("Hello Pixel Studios! I want to check on order " + o.id) + '" target="_blank" rel="noopener">Ask about this order</a>' +
          '<button class="btn btn-primary" data-close>Done</button></div>';
    }

    else if (kind === "add-on") {
      modalTitle.textContent = "Talk to the studio";
      modalBody.innerHTML =
        '<p style="font-size:13.5px;color:var(--ink-2);margin-bottom:18px;">Add-ons like a digital menu, a custom domain or extra team cards are set up by our team — usually the same day.</p>' +
        '<a class="btn btn-primary btn-block" href="https://wa.me/2349031528732?text=' +
          encodeURIComponent("Hello Pixel Studios! I want to add an extra feature to my account.") + '" target="_blank" rel="noopener">Chat on WhatsApp</a>' +
        '<a class="btn btn-outline btn-block" style="margin-top:9px;" href="tel:+2349031528732">Call +234 903 152 8732</a>';
    }

    else if (kind === "logout") {
      modalTitle.textContent = "Log out?";
      modalBody.innerHTML =
        '<p style="font-size:13.5px;color:var(--ink-2);margin-bottom:18px;">Your pages and devices stay live — logging out only ends this session.</p>' +
        '<div class="row-2"><button class="btn btn-outline" data-close>Stay</button>' +
        '<button class="btn btn-danger" id="doLogout">Log out</button></div>';
      $("#doLogout").addEventListener("click", function () {
        try { localStorage.removeItem("ps_auth_token"); localStorage.removeItem("ps_auth_user"); } catch (e) {}
        Dash.save("logout", {});
        window.location.href = LOGIN_URL;
      });
    }

    else if (kind === "pause-all") {
      modalTitle.textContent = "Pause all devices?";
      modalBody.innerHTML =
        '<p style="font-size:13.5px;color:var(--ink-2);margin-bottom:18px;">Every card, keychain, wristband and sticker stops opening your page. Visitors see a "temporarily unavailable" note. You can switch it back on here anytime.</p>' +
        '<div class="row-2"><button class="btn btn-outline" data-close>Cancel</button>' +
        '<button class="btn btn-danger" id="doPause">Pause everything</button></div>';
      $("#doPause").addEventListener("click", function () {
        DASH.devices.forEach(function (d) { d.status = "paused"; });
        Dash.save("devices/pause-all", {});
        renderDevices();
        closeModal();
        say("All devices paused");
      });
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    $$("[data-close]", modalBody).forEach(function (b) { b.addEventListener("click", closeModal); });
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (modal) {
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    $$("[data-close]", modal).forEach(function (b) { b.addEventListener("click", closeModal); });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeModal(); closeDrawer(); } });

  /* ============================================================
     NAVIGATION
     ============================================================ */
  var side = $("#side"), scrim = $("#scrim");
  function openDrawer() { side.classList.add("open"); scrim.classList.add("open"); }
  function closeDrawer() { side.classList.remove("open"); scrim.classList.remove("open"); }
  if ($("#hamb")) $("#hamb").addEventListener("click", openDrawer);
  if (scrim) scrim.addEventListener("click", closeDrawer);

  function go(view) {
    $$(".view").forEach(function (v) { v.classList.remove("active"); });
    var target = $("#view-" + view);
    if (target) target.classList.add("active");
    $$(".side-item").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-view") === view); });
    closeDrawer();
    window.scrollTo({ top: 0, behavior: "smooth" });
    revealIn(target);
    if (view === "overview") { renderChart("#chart14", DASH.series.labels, DASH.series.views, DASH.series.taps, true); countUp(document); }
    if (view === "analytics") {
      var days = parseInt($("#rangeSel").value, 10);
      renderRange(days, true);
      renderActions();
      countUp(document);
    }
    if (view === "devices") renderDevices();
    if (view === "menu") renderMenu();
    if (view === "team") renderTeam();
    if (view === "orders") renderOrders();
  }
  $$(".side-item").forEach(function (b) {
    b.addEventListener("click", function () { go(b.getAttribute("data-view")); });
  });
  $$("[data-goto]").forEach(function (b) {
    b.addEventListener("click", function () { go(b.getAttribute("data-goto")); });
  });
  $$("[data-modal]").forEach(function (b) {
    b.addEventListener("click", function () { openModal(b.getAttribute("data-modal")); });
  });

  /* ---------------- device actions (delegated) ---------------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-act]") : null;
    if (!btn) return;
    var row = btn.closest(".dev");
    if (!row) return;
    var id = row.getAttribute("data-id");
    var d = DASH.devices.filter(function (x) { return x.id === id; })[0];
    if (!d) return;
    var act = btn.getAttribute("data-act");

    if (act === "qr") openModal("qr", { device: d });
    else if (act === "link") openModal("link", { device: d });
    else if (act === "toggle") {
      d.status = d.status === "live" ? "paused" : "live";
      Dash.save("device", { id: d.id, status: d.status });
      renderDevices();
      say(d.status === "live" ? d.name + " is live" : d.name + " paused");
    } else if (act === "del") {
      DASH.devices = DASH.devices.filter(function (x) { return x.id !== id; });
      Dash.save("device", { id: id, remove: true });
      renderDevices();
      say(d.name + " removed");
    }

    var mqr = e.target.closest ? e.target.closest("[data-member-qr]") : null;
    if (mqr) {
      var m = DASH.team[parseInt(mqr.getAttribute("data-member-qr"), 10)];
      openModal("qr", { device: { type: "card", name: m.n, link: "pixelstudios.com/card/" + m.n.split(" ")[0].toLowerCase(), material: m.c, issued: "—" } });
    }
    var mdel = e.target.closest ? e.target.closest("[data-member-del]") : null;
    if (mdel) {
      var i = parseInt(mdel.getAttribute("data-member-del"), 10);
      var nm = DASH.team[i].n;
      DASH.team.splice(i, 1);
      Dash.save("team", { remove: nm });
      renderTeam();
      say(nm + " removed");
    }
    var ord = e.target.closest ? e.target.closest("[data-order]") : null;
    if (ord) {
      var o = DASH.orders.filter(function (x) { return x.id === ord.getAttribute("data-order"); })[0];
      if (o) openModal("order", { order: o });
    }
  });

  /* ---------------- menu editing ---------------- */
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.cat !== undefined) {
      DASH.menu[parseInt(t.dataset.cat, 10)].cat = t.value; markMenuDirty();
    }
    if (t.dataset && t.dataset.item) {
      var parts = t.dataset.item.split(":");
      var ci = +parts[0], ii = +parts[1], k = parts[2];
      var it = DASH.menu[ci].items[ii];
      if (k === "n") it.n = t.value;
      if (k === "p") it.p = parseInt(t.value.replace(/[^\d]/g, ""), 10) || 0;
      markMenuDirty();
    }
  });
  document.addEventListener("click", function (e) {
    var ai = e.target.closest ? e.target.closest("[data-additem]") : null;
    if (ai) {
      var ci = +ai.getAttribute("data-additem");
      DASH.menu[ci].items.push({ n: "New item", p: 0, on: true });
      renderMenu(); markMenuDirty(); say("Item added");
      return;
    }
    var dc = e.target.closest ? e.target.closest("[data-delcat]") : null;
    if (dc) {
      var c = +dc.getAttribute("data-delcat");
      var nm = DASH.menu[c].cat;
      DASH.menu.splice(c, 1); renderMenu(); markMenuDirty(); say(nm + " removed");
      return;
    }
    var di = e.target.closest ? e.target.closest("[data-delitem]") : null;
    if (di) {
      var p = di.getAttribute("data-delitem").split(":");
      var itn = DASH.menu[+p[0]].items[+p[1]].n;
      DASH.menu[+p[0]].items.splice(+p[1], 1); renderMenu(); markMenuDirty(); say(itn + " removed");
    }
  });
  if ($("#addCatBtn")) $("#addCatBtn").addEventListener("click", function () {
    DASH.menu.push({ cat: "New category", items: [{ n: "New item", p: 0, on: true }] });
    renderMenu(); markMenuDirty(); say("Category added");
  });
  if ($("#addItemBtn")) $("#addItemBtn").addEventListener("click", function () {
    var last = DASH.menu.length - 1;
    if (last < 0) { DASH.menu.push({ cat: "Menu", items: [] }); last = 0; }
    DASH.menu[last].items.push({ n: "New item", p: 0, on: true });
    renderMenu(); markMenuDirty(); say("Item added");
  });
  if ($("#saveMenuBtn")) $("#saveMenuBtn").addEventListener("click", function () {
    readForm();
    Dash.save("menu", { menu: DASH.menu, showPrices: $("#m-prices").checked, orderViaWa: $("#m-order").checked, live: $("#m-live").checked });
    menuDirty = false;
    say("Menu saved — live now");
  });

  /* ---------------- editor wiring ---------------- */
  $$("[data-pv]").forEach(function (inp) {
    inp.addEventListener("input", function () {
      readForm(); renderPreview(); setDirty(true);
      var bc = $("#bioCount");
      if (bc && inp.id === "f-bio") bc.textContent = inp.value.length;
    });
  });
  $$("[data-btn]").forEach(function (cb) {
    cb.addEventListener("change", function () { readForm(); renderPreview(); setDirty(true); });
  });
  $$("#swatches .swatch").forEach(function (s) {
    s.addEventListener("click", function () {
      $$("#swatches .swatch").forEach(function (o) { o.classList.remove("sel"); });
      s.classList.add("sel");
      DASH.page.accent = s.getAttribute("data-c");
      renderPreview(); setDirty(true);
    });
  });
  function savePage() {
    readForm();
    Dash.save("page", DASH.page);
    setDirty(false);
    snapshot = JSON.stringify(DASH.page);
    say("Page updated — changes are live");
    if (navigator.vibrate) navigator.vibrate(8);
  }
  ["#savePageBtn", "#savePageBtn2"].forEach(function (s) { if ($(s)) $(s).addEventListener("click", savePage); });
  if ($("#resetPageBtn")) $("#resetPageBtn").addEventListener("click", function () {
    DASH.page = JSON.parse(snapshot);
    writeForm(); renderPreview(); setDirty(false); say("Changes discarded");
  });
  if ($("#photoBtn")) $("#photoBtn").addEventListener("click", function () {
    var inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*";
    inp.addEventListener("change", function () {
      var f = inp.files && inp.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        $("#pvAv").innerHTML = '<img src="' + fr.result + '" alt="" />';
        $("#pvAvatar").innerHTML = '<img src="' + fr.result + '" alt="" />';
        setDirty(true);
        say("Photo ready — save to publish");
      };
      fr.readAsDataURL(f);
    });
    inp.click();
  });

  /* ---------------- analytics range ---------------- */
  function seriesFor(days) {
    var base = DASH.series;
    var labels = [], views = [], taps = [];
    var today = new Date();
    for (var i = days - 1; i >= 0; i--) {
      var d = new Date(today.getTime() - i * 86400000);
      labels.push(days > 30 ? d.getDate() + "/" + (d.getMonth() + 1) : ["S", "M", "T", "W", "T", "F", "S"][d.getDay()]);
      var seed = (d.getDate() * 7 + d.getMonth() * 13) % 9;
      var wknd = (d.getDay() === 0 || d.getDay() === 6) ? .72 : 1;
      var v = Math.round((38 + seed * 9) * wknd * (days > 60 ? 1.15 : 1));
      views.push(v);
      taps.push(Math.round(v * (.28 + (seed % 4) * .02)));
    }
    return { labels: labels, views: views, taps: taps };
  }
  function renderRange(days, animate) {
    var s = days === 14 ? DASH.series : seriesFor(days);
    renderChart("#chartBig", s.labels, s.views, s.taps, animate);
    var lbl = $("#rangeLabel");
    if (lbl) lbl.textContent = "Last " + days + " days";
  }
  if ($("#rangeSel")) $("#rangeSel").addEventListener("change", function () {
    renderRange(parseInt(this.value, 10), true);
    say("Showing last " + this.value + " days");
  });

  /* ---------------- CSV export ---------------- */
  if ($("#exportBtn")) $("#exportBtn").addEventListener("click", function () {
    var s = seriesFor(parseInt(($("#rangeSel") || { value: 14 }).value, 10));
    var rows = [["date", "views", "taps"]];
    var today = new Date();
    for (var i = s.labels.length - 1; i >= 0; i--) {
      var d = new Date(today.getTime() - i * 86400000);
      rows.push([d.toISOString().slice(0, 10), s.views[s.labels.length - 1 - i], s.taps[s.labels.length - 1 - i]]);
    }
    var csv = rows.map(function (r) { return r.join(","); }).join("\n");
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pixel-studios-analytics.csv";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1200);
    say("CSV downloaded");
  });

  /* ---------------- misc buttons ---------------- */
  if ($("#deviceFilter")) $("#deviceFilter").addEventListener("change", renderDevices);
  if ($("#globalSearch")) $("#globalSearch").addEventListener("input", function () {
    if (!$("#view-devices").classList.contains("active")) go("devices");
    renderDevices();
  });
  if ($("#qrBtn")) $("#qrBtn").addEventListener("click", function () { openModal("qr"); });
  if ($("#bellBtn")) $("#bellBtn").addEventListener("click", function () {
    say("Order PS-2863 moved to production");
  });
  if ($("#logoutBtn")) $("#logoutBtn").addEventListener("click", function () { openModal("logout"); });
  if ($("#pauseAllBtn")) $("#pauseAllBtn").addEventListener("click", function () { openModal("pause-all"); });
  if ($("#saveAccountBtn")) $("#saveAccountBtn").addEventListener("click", function () {
    Dash.save("account", { name: $("#s-name").value, email: $("#s-email").value, phone: $("#s-phone").value, state: $("#s-state").value, lga: $("#s-lga").value });
    say("Account saved");
  });
  if ($("#changePassBtn")) $("#changePassBtn").addEventListener("click", function () {
    var a = $("#s-pass").value, b = $("#s-pass2").value;
    if (a.length < 8) { say("Use at least 8 characters"); return; }
    if (a !== b) { say("Passwords don't match"); return; }
    Dash.save("password", { password: a });
    $("#s-pass").value = ""; $("#s-pass2").value = "";
    say("Password updated");
  });
  if ($("#revokeBtn")) $("#revokeBtn").addEventListener("click", function () {
    Dash.save("sessions/revoke", {});
    say("Other sessions signed out");
  });
  if ($("#addMemberBtn")) $("#addMemberBtn").addEventListener("click", function () { openModal("add-member"); });

  /* ---------------- greeting ---------------- */
  var g = $("#greeting");
  if (g) {
    var h = new Date().getHours();
    var part = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    g.textContent = part + ", " + DASH.owner.first;
  }

  /* ---------------- boot ---------------- */
  function renderAll() {
    renderStats("#statGrid");
    renderStats("#statGrid2");
    renderDevices();
    renderActivity();
    renderActions();
    renderMenu();
    renderTeam();
    renderOrders();
    renderWeeks();
    writeForm();
    renderPreview();
    renderChart("#chart14", DASH.series.labels, DASH.series.views, DASH.series.taps, true);
    renderRange(14, false);
    revealIn(document);
    countUp(document);
  }
  renderAll();
  Dash.load();
})();
