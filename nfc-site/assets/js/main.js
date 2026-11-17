/* ============================================================
   PIXEL STUDIOS · NFC landing — interactions
   ============================================================ */
(function () {
  "use strict";

  var mq = function (q) { return typeof window.matchMedia === "function" ? window.matchMedia(q) : { matches: false }; };
  var reduce = mq("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- year ---------- */
  var y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  var nav = $("#nav");
  var burger = $("#burger");
  var menu = $("#mobileMenu");

  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 18);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        burger.classList.remove("open");
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = $$(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var d = parseInt(el.getAttribute("data-delay") || "0", 10);
        el.style.setProperty("--d", d + "ms");
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- seamless marquee ---------- */
  var mq = $("#marquee");
  if (mq) {
    mq.innerHTML += mq.innerHTML; // duplicate for a -50% loop
  }

  /* ---------- QR on the card back ---------- */
  var qrCanvas = $("#cardQR");
  if (qrCanvas && window.PixelQR) {
    var ok = window.PixelQR.render(qrCanvas, "https://pixelstudios.com/card/amina", {
      size: 320,
      fg: "#0e1315",
      bg: "#f6f6f2",
      radius: 0.24,
      quiet: 2
    });
    if (!ok) qrCanvas.style.display = "none";
  }

  /* ---------- card flip ---------- */
  var card = $("#nfccard");
  if (card) {
    card.addEventListener("click", function () {
      card.classList.toggle("flipped");
      if (navigator.vibrate) navigator.vibrate(8);
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.classList.toggle("flipped"); }
    });
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Flip the NFC card to see the QR code");
  }

  /* ---------- parallax tilt (real device feel) ---------- */
  var stage = $("#stage");
  var phone = $("#phone");
  var cardInner = card ? $(".nfccard-inner", card) : null;
  var tilt = { ry: -15, rx: 4, cry: -22, crx: 8, on: false };
  var raf = null;

  function applyTilt() {
    raf = null;
    if (!phone) return;
    phone.style.transform =
      "rotateY(" + tilt.ry.toFixed(2) + "deg) rotateX(" + tilt.rx.toFixed(2) + "deg) rotateZ(1.5deg)";
    if (!cardInner) return;
    var flipped = card.classList.contains("flipped");
    var y = flipped ? 180 + (tilt.cry + 22) : tilt.cry;
    cardInner.style.transform =
      "rotateY(" + y.toFixed(2) + "deg) rotateX(" + tilt.crx.toFixed(2) + "deg) rotateZ(" +
      (flipped ? -2 : -4) + "deg)";
  }
  function scheduleTilt() { if (!raf) raf = requestAnimationFrame(applyTilt); }

  if (card && cardInner) {
    card.addEventListener("click", function () { if (tilt.on) scheduleTilt(); });
  }

  if (stage && phone && !reduce && (typeof window.matchMedia !== "function" || window.matchMedia("(pointer: fine)").matches)) {
    tilt.on = true;
    var screen = $(".screen", phone);

    stage.addEventListener("mousemove", function (e) {
      var r = stage.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width;   // 0 … 1
      var ny = (e.clientY - r.top) / r.height;
      var px = nx - 0.5, py = ny - 0.5;

      tilt.ry = -15 + px * 22;
      tilt.rx = 4 - py * 14;
      tilt.cry = -22 + px * 26;
      tilt.crx = 8 - py * 16;

      if (screen) {
        screen.style.setProperty("--gx", (nx * 100).toFixed(1) + "%");
        screen.style.setProperty("--gy", (ny * 100).toFixed(1) + "%");
      }
      scheduleTilt();
    });

    stage.addEventListener("mouseleave", function () {
      tilt.ry = -15; tilt.rx = 4; tilt.cry = -22; tilt.crx = 8;
      if (screen) { screen.style.setProperty("--gx", "50%"); screen.style.setProperty("--gy", "16%"); }
      scheduleTilt();
    });

    applyTilt();
  }

  /* ---------- tap choreography inside the phone ---------- */
  var finger = $("#tapFinger");
  var toast = $("#scrToast");
  var toastText = $("#scrToastText");
  var scrPage = $(".scr-page");
  var timers = [];

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function after(ms, fn) { timers.push(setTimeout(fn, ms)); }

  function showToast(msg) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.add("show");
    after(2600, function () { toast.classList.remove("show"); });
  }

  function moveTo(el) {
    if (!finger || !el) return;
    var scr = $(".scr");
    if (!scr) return;
    // layout-space offsets: the finger and the buttons live in the same
    // (3D-transformed) container, so offsetLeft/Top is exactly right.
    var x = 0, yy = 0, node = el;
    while (node && node !== scr) {
      x += node.offsetLeft;
      yy += node.offsetTop;
      node = node.offsetParent;
    }
    finger.style.left = (x + el.offsetWidth / 2 - 13) + "px";
    finger.style.top = (yy + el.offsetHeight / 2 - 13) + "px";
  }

  function press(el, cls) {
    if (!el) return;
    moveTo(el);
    finger.classList.remove("tapping");
    void finger.offsetWidth; // restart animation
    finger.classList.add("tapping");
    el.classList.add(cls || "lit");
    after(560, function () { el.classList.remove(cls || "lit"); });
  }

  function runSequence() {
    if (reduce) return;
    clearTimers();

    // 1 · the page "arrives" from the tap
    if (scrPage) {
      scrPage.style.animation = "none";
      void scrPage.offsetWidth;
      scrPage.style.animation = "pageIn .7s cubic-bezier(.16,1,.3,1)";
    }
    showToast("Profile opened · +1 view");

    // 2 · finger taps the primary button
    after(1400, function () { press($("#scrTapBtn")); });
    after(2000, function () { showToast("Contact saved to phone ✓"); });

    // 3 · socials light up one by one
    after(3200, function () {
      $$(".scr-socials span").forEach(function (s, i) {
        after(i * 220, function () {
          s.classList.add("on");
          after(1500, function () { s.classList.remove("on"); });
        });
      });
    });

    // 4 · second tap on WhatsApp
    after(5200, function () { press($("#scrWaBtn")); });
    after(5700, function () { showToast("WhatsApp chat started"); });

    // loop
    after(9000, runSequence);
  }

  if (!reduce) {
    // start once the phone is on screen
    if ("IntersectionObserver" in window && phone) {
      var started = false;
      var pio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !started) { started = true; runSequence(); pio.disconnect(); }
        });
      }, { threshold: 0.35 });
      pio.observe(phone);
    } else {
      after(1200, runSequence);
    }
    // clicking the phone re-triggers a tap
    if (phone) {
      phone.addEventListener("click", function () {
        clearTimers();
        press($("#scrTapBtn"));
        showToast("Contact saved to phone ✓");
        after(4000, runSequence);
      });
    }
  }

  /* ---------- dashboard: counters + chart ---------- */
  var dash = $("#dashboard");
  if (dash) {
    var counted = false;
    function animateDash() {
      if (counted) return;
      counted = true;

      $$("[data-count]", dash).forEach(function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        if (reduce) { el.textContent = target.toLocaleString(); return; }
        var t0 = null, dur = 1500;
        function tick(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });

      $$("#dashChart .bar", dash).forEach(function (bar, i) {
        var h = bar.getAttribute("data-h") || "40";
        setTimeout(function () { bar.style.setProperty("--h", h + "%"); }, reduce ? 0 : 120 + i * 55);
      });
    }

    $$("#dashChart .bar").forEach(function (b) { b.style.setProperty("--h", "4%"); });

    if ("IntersectionObserver" in window) {
      var dio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { animateDash(); dio.disconnect(); } });
      }, { threshold: 0.25 });
      dio.observe(dash);
    } else {
      animateDash();
    }
  }

  /* ---------- inject the keyframes JS relies on ---------- */
  var style = document.createElement("style");
  style.textContent =
    "@keyframes pageIn{0%{opacity:0;transform:translateY(14px) scale(.985)}100%{opacity:1;transform:none}}" +
    ".screen::after{content:'';position:absolute;inset:0;z-index:21;pointer-events:none;mix-blend-mode:screen;" +
    "background:radial-gradient(230px 230px at var(--gx,50%) var(--gy,16%),rgba(255,255,255,.13),transparent 62%);}" +
    ".nfccard-inner,.phone{transition:transform .45s cubic-bezier(.22,.61,.36,1)}" +
    ".nfccard.flipped .nfccard-inner{transition:transform 1s cubic-bezier(.16,1,.3,1)}";
  document.head.appendChild(style);
})();
