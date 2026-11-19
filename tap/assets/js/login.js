/* ============================================================
   PIXEL STUDIOS · Dashboard sign-in / create account
   ------------------------------------------------------------
   BACKEND HOOK — two switches at the top:

     DEMO_MODE = true   → any email + password opens the dashboard
                          (flip to false the day your API goes live)
     ENDPOINTS          → where register / login / me live.
                          Defaults point at the ../backend PHP files
                          that ship with this repo.

   Tokens are stored under the same keys the mobile app uses
   (ps_auth_token / ps_auth_user), so one sign-in works everywhere.
   ============================================================ */
(function () {
  "use strict";

  var DEMO_MODE = true;                       // ← set to false when the API is live

  var ENDPOINTS = {
    register: "../backend/register.php",      // POST {name,email,phone,password,state,lga}
    login: "../backend/login.php",            // POST {identifier,password}
    me: "../backend/me.php",                  // GET  (Bearer)
    dashboard: "../api/index.php?route=dashboard"
  };

  var KEYS = { token: "ps_auth_token", user: "ps_auth_user" };

  var $ = function (s) { return document.querySelector(s); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  var y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------------- already signed in? ---------------- */
  var next = new URLSearchParams(location.search).get("next") || "index.html";
  if (!DEMO_MODE && store.get(KEYS.token)) location.replace(next);

  var note = $("#demoNote");
  if (note) note.style.display = DEMO_MODE ? "" : "none";

  /* ---------------- tabs ---------------- */
  var mode = "in";
  var tabIn = $("#tabIn"), tabUp = $("#tabUp");

  function setMode(m) {
    mode = m;
    tabIn.classList.toggle("on", m === "in");
    tabUp.classList.toggle("on", m === "up");
    var up = m === "up";
    $("#nameField").style.display = up ? "" : "none";
    $("#phoneField").style.display = up ? "" : "none";
    $("#stateField").style.display = up ? "" : "none";
    $("#passHint").style.display = up ? "" : "none";
    $("#a-pass").setAttribute("autocomplete", up ? "new-password" : "current-password");
    $("#authTitle").textContent = up ? "Create your account" : "Welcome back";
    $("#authSub").textContent = up
      ? "One account for every card, device and page you own."
      : "Sign in to manage your cards, devices and live business page.";
    $("#submitLabel").textContent = up ? "Create account" : "Sign in";
    hideErr();
  }
  tabIn.addEventListener("click", function () { setMode("in"); });
  tabUp.addEventListener("click", function () { setMode("up"); });

  /* ---------------- show / hide password ---------------- */
  $("#eyeBtn").addEventListener("click", function () {
    var p = $("#a-pass");
    p.type = p.type === "password" ? "text" : "password";
    this.setAttribute("aria-label", p.type === "password" ? "Show password" : "Hide password");
  });

  /* ---------------- errors ---------------- */
  function showErr(msg) {
    $("#errText").textContent = msg;
    $("#err").classList.add("show");
  }
  function hideErr() { $("#err").classList.remove("show"); }

  /* ---------------- submit ---------------- */
  function busy(on) {
    var btn = $("#submitBtn");
    btn.disabled = on;
    btn.style.opacity = on ? ".75" : "";
    $("#submitLabel").innerHTML = on ? '<span class="spin" style="display:inline-block;vertical-align:-3px;"></span>' : (mode === "up" ? "Create account" : "Sign in");
  }

  function digits(s) { return String(s || "").replace(/[^\d]/g, ""); }

  function finish(token, user) {
    store.set(KEYS.token, token);
    store.set(KEYS.user, JSON.stringify(user || {}));
    location.href = next;
  }

  $("#authForm").addEventListener("submit", function (e) {
    e.preventDefault();
    hideErr();

    var id = $("#a-id").value.trim();
    var pass = $("#a-pass").value;

    if (!id) { showErr("Enter your email or phone number."); return; }
    if (!pass) { showErr("Enter your password."); return; }

    /* -------- demo mode -------- */
    if (DEMO_MODE) {
      if (pass.length < 4) { showErr("Password must be at least 4 characters."); return; }
      var name = mode === "up" ? ($("#a-name").value.trim() || "Amina Bello") : "Amina Bello";
      busy(true);
      setTimeout(function () {
        finish("demo-" + Math.random().toString(36).slice(2) + Date.now().toString(36), {
          name: name,
          email: id.indexOf("@") > -1 ? id : "",
          phone: id.indexOf("@") > -1 ? "" : id,
          demo: true
        });
      }, 550);
      return;
    }

    /* -------- real API -------- */
    if (mode === "up") {
      var fullName = $("#a-name").value.trim();
      var phone = $("#a-phone").value.trim();
      if (!fullName) { showErr("Enter your full name."); return; }
      if (digits(phone).length < 10) { showErr("Enter a valid phone number."); return; }
      if (pass.length < 8) { showErr("Use at least 8 characters for your password."); return; }
      if (id.indexOf("@") === -1) { showErr("Enter a valid email address."); return; }

      busy(true);
      post(ENDPOINTS.register, {
        name: fullName, email: id, phone: phone, password: pass,
        state: $("#a-state").value, lga: ""
      }).then(done).catch(netErr);
    } else {
      busy(true);
      post(ENDPOINTS.login, { identifier: id, password: pass }).then(done).catch(netErr);
    }

    function done(res) {
      busy(false);
      if (!res || res.ok === false) {
        showErr((res && res.error) || "We couldn't sign you in. Check your details and try again.");
        return;
      }
      finish(res.token, res.user);
    }
    function netErr() {
      busy(false);
      showErr("Can't reach the server. Check your connection and try again.");
    }
  });

  function post(url, data) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); });
  }

  /* clear the error banner as soon as the visitor starts typing again */
  Array.prototype.forEach.call(document.querySelectorAll("#authForm .input"), function (inp) {
    inp.addEventListener("input", hideErr);
  });
})();
