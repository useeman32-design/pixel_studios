/* ============================================================
   PIXEL STUDIOS · Public business page logic
   ------------------------------------------------------------
   BACKEND HOOK — when you connect your API:
     1. set  PixelAPI.base = "https://yourdomain.com/api"
     2. the two calls below then POST for you automatically:
          PixelAPI.view(slug)          → log a profile view
          PixelAPI.track(slug, event)  → log a button click
     Everything else on this page works with zero backend.
   ============================================================ */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- the profile (later: fetched from your DB) ---------------- */
  var PROFILE = {
    slug: "amina",
    fullName: "Amina Bello",
    firstName: "Amina",
    lastName: "Bello",
    rank: "Managing Director",
    business: "Aurelia Homes",
    bio: "Real estate advisor in Abuja.",
    phone: "+2349031528732",
    whatsapp: "2349031528732",
    email: "amina@aureliahomes.ng",
    website: "https://aureliahomes.ng",
    address: "14B Adeola Hopewell Crescent, Wuse 2, Abuja, FCT, Nigeria",
    socials: {
      instagram: "https://instagram.com/aureliahomes",
      x: "https://x.com/aureliahomes",
      facebook: "https://facebook.com/aureliahomes",
      linkedin: "https://linkedin.com/company/aureliahomes"
    },
    pageUrl: "https://pixelstudios.com/card/amina"
  };
  window.PIXEL_PROFILE = PROFILE;

  /* ---------------- backend hooks ---------------- */
  var PixelAPI = {
    base: "", // ← put your API root here, e.g. "https://pixelstudios.com/api"

    _send: function (path, body) {
      if (!this.base) return Promise.resolve(null);
      return fetch(this.base.replace(/\/$/, "") + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }).then(function (r) { return r.json(); }).catch(function () { return null; });
    },

    /** Called once on load — counts a profile view. */
    view: function (slug) {
      var key = "ps_viewed_" + slug;
      try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch (e) {}
      return this._send("/view", { slug: slug, ref: document.referrer, ua: navigator.userAgent, at: Date.now() });
    },

    /** Called on every button / social click — counts engagement. */
    track: function (slug, event) {
      return this._send("/track", { slug: slug, event: event, at: Date.now() });
    }
  };
  window.PixelAPI = PixelAPI;

  PixelAPI.view(PROFILE.slug);

  /* ---------------- toast ---------------- */
  var toast = $("#toast"), toastText = $("#toastText"), toastTimer = null;
  function say(msg) {
    if (!toast) return;
    toastText.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }

  /* ---------------- tracking on every actionable element ---------------- */
  $$("[data-track]").forEach(function (el) {
    el.addEventListener("click", function () {
      PixelAPI.track(PROFILE.slug, el.getAttribute("data-track"));
      if (navigator.vibrate) navigator.vibrate(6);
    });
  });

  /* ---------------- vCard ---------------- */
  function vcard() {
    var lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:" + PROFILE.lastName + ";" + PROFILE.firstName + ";;;",
      "FN:" + PROFILE.fullName,
      "TITLE:" + PROFILE.rank,
      "ORG:" + PROFILE.business
    ];
    if (PROFILE.phone) lines.push("TEL;TYPE=CELL,VOICE:" + PROFILE.phone);
    if (PROFILE.whatsapp) lines.push("X-WHATSAPP:" + PROFILE.whatsapp);
    if (PROFILE.email) lines.push("EMAIL;TYPE=INTERNET:" + PROFILE.email);
    if (PROFILE.website) lines.push("URL:" + PROFILE.website);
    if (PROFILE.address) lines.push("ADR;TYPE=WORK:;;" + PROFILE.address.replace(/,/g, "\\,"));
    if (PROFILE.bio) lines.push("NOTE:" + PROFILE.bio.replace(/\n/g, "\\n"));
    Object.keys(PROFILE.socials || {}).forEach(function (k) {
      if (PROFILE.socials[k]) lines.push("X-SOCIALPROFILE;TYPE=" + k.toUpperCase() + ":" + PROFILE.socials[k]);
    });
    lines.push("NOTE:Powered by Pixel Studios — " + PROFILE.pageUrl);
    lines.push("END:VCARD");
    return lines.join("\r\n");
  }

  function saveContact() {
    var blob = new Blob([vcard()], { type: "text/vcard;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = PROFILE.fullName.replace(/\s+/g, "-") + ".vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    say("Contact saved to your phone");
    PixelAPI.track(PROFILE.slug, "vcard_download");
  }
  ["#saveBtn", "#saveBtn2"].forEach(function (sel) {
    var el = $(sel);
    if (el) el.addEventListener("click", saveContact);
  });

  /* ---------------- share sheet ---------------- */
  var sheet = $("#shareSheet");
  var shareBtn = $("#shareBtn");

  function openSheet() {
    if (!sheet) return;
    sheet.classList.add("open");
    document.body.style.overflow = "hidden";
    if (window.PixelQR) {
      window.PixelQR.render($("#shareQR"), PROFILE.pageUrl, {
        size: 190, fg: "#131316", bg: "#ffffff", radius: 0.22, quiet: 2
      });
    }
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (shareBtn) shareBtn.addEventListener("click", openSheet);
  if (sheet) {
    sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });
    $$("[data-close]", sheet).forEach(function (b) { b.addEventListener("click", closeSheet); });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });

  var copyBtn = $("#copyLink");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var url = PROFILE.pageUrl;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { say("Link copied"); }, fallback);
      } else fallback();
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); say("Link copied"); } catch (e) { say(url); }
        document.body.removeChild(ta);
      }
      PixelAPI.track(PROFILE.slug, "copy_link");
    });
  }

  var waShare = $("#waShare");
  if (waShare) {
    waShare.href = "https://wa.me/?text=" + encodeURIComponent(
      PROFILE.fullName + " · " + PROFILE.business + " — " + PROFILE.pageUrl
    );
    waShare.addEventListener("click", function () { PixelAPI.track(PROFILE.slug, "share_whatsapp"); });
  }

  var nativeShare = $("#nativeShare");
  if (nativeShare) {
    nativeShare.addEventListener("click", function () {
      PixelAPI.track(PROFILE.slug, "share_native");
      if (navigator.share) {
        navigator.share({ title: PROFILE.fullName + " · " + PROFILE.business, text: PROFILE.rank + " at " + PROFILE.business, url: PROFILE.pageUrl })
          .catch(function () {});
      } else {
        closeSheet();
        say("Copy the link to share");
      }
    });
  }

  /* ---------------- highlight today in the opening hours ---------------- */
  var today = new Date().getDay();
  $$("#hours .row").forEach(function (r) {
    if (parseInt(r.getAttribute("data-day"), 10) === today) r.classList.add("today");
  });

  /* ---------------- keep the displayed contact in sync with PROFILE ----------------
     (so a backend-driven page can inject data and the buttons still work) */
  document.title = PROFILE.fullName + " · " + PROFILE.business + " — Pixel Studios Card";
})();
