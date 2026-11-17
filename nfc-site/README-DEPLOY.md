# Pixel Studios · NFC platform — cPanel deployment guide

Everything in this folder is **static HTML/CSS/JS** — no build step, no Node,
no framework. Upload it and it runs.

```
nfc-site/
├── index.html                 ← the marketing landing page
├── .htaccess                  ← pretty URLs, gzip, caching, security headers
├── assets/
│   ├── css/style.css          ← landing page design system (dark)
│   ├── css/app.css            ← shared light design system
│   ├── css/card.css           ← public business page
│   ├── css/dashboard.css      ← management dashboard
│   ├── js/qr.js               ← real QR generator (verified scannable)
│   ├── js/main.js             ← landing page animations & interactions
│   ├── js/card.js             ← public page: vCard, share, analytics hooks
│   ├── js/dashboard.js        ← the whole management interface
│   ├── js/login.js            ← sign in / create account
│   └── img/                   ← card + tap photography
├── card/
│   └── amina.html             ← the page a card tap opens  →  /card/amina
├── dashboard/
│   ├── index.html             ← management interface       →  /dashboard
│   └── login.html             ← sign-in screen             →  /dashboard/login
└── api/                       ← optional PHP backend (see api/README.md)
```

---

## 1 · Upload to cPanel

1. cPanel → **File Manager** → open `public_html`.
2. Zip this `nfc-site` folder on your computer, upload the zip, then **Extract**.
3. Move the contents up one level so `public_html/index.html` exists
   (not `public_html/nfc-site/index.html`).
4. Visit `https://yourdomain.com` — the landing page should load.

> Prefer FTP? Same thing: upload the folder contents into `public_html`.

**Alternative:** deploy it as a subdomain, e.g. `cards.yourdomain.com`, by
extracting into that subdomain's document root instead.

---

## 2 · Pretty URLs

`.htaccess` is already set up so these all work:

| URL                          | Serves                              |
| ---------------------------- | ----------------------------------- |
| `/card/amina`                | `card/amina.html`                   |
| `/card/amina.html`           | same file (both work)               |
| `/menu/aurelia`              | `card/aurelia.html?view=menu`       |
| `/dashboard`                 | `dashboard/index.html`              |

For a **new client**, copy `card/amina.html` to `card/<their-slug>.html` and
edit the details — or let the API render it (step 4).

If pretty URLs 404, your host has `AllowOverride` disabled for `.htaccess`.
Ask them to enable `mod_rewrite`, or just link to the `.html` files directly.

Once your SSL is active, uncomment the HTTPS redirect at the top of `.htaccess`.

---

## 3 · What works right now, with zero backend

- **Landing page** — hero phone animation, NFC waves, card flip, QR, marquee,
  reveals, counters, charts, FAQ, WhatsApp links, mobile menu.
- **Public card page** (`/card/amina`) — save contact downloads a **real .vcf**,
  share sheet with a **real QR code**, WhatsApp/call/email/maps links, opening
  hours with today highlighted, click tracking stubs.
- **Dashboard** (`/dashboard`) — overview, device manager (pause / resume /
  re-point / delete / QR download), business page editor with a **live phone
  preview**, digital menu editor, analytics with CSV export, team cards, orders,
  settings. Runs on demo data held in `assets/js/dashboard.js`.

---

## 4 · Connecting your backend

Three switches, all commented in the files:

| File                        | Switch              | What it does                                                            |
| --------------------------- | ------------------- | ----------------------------------------------------------------------- |
| `assets/js/dashboard.js`    | `REQUIRE_LOGIN`     | `true` → redirect to `login.html` when there's no token                 |
| `assets/js/dashboard.js`    | `DASH.api`          | your API root, e.g. `"/api"` — `Dash.load()` then replaces the demo data |
| `assets/js/login.js`        | `DEMO_MODE`         | `false` → real register/login against `../backend/*.php`                 |
| `assets/js/card.js`         | `PixelAPI.base`     | your API root — logs `view` and `track` events                           |
| `api/config.php`            | `DB_*` constants    | your MySQL credentials                                                  |

The `api/` folder is a **ready-made PHP + MySQL backend** whose routes match
exactly what the front-end already calls. Import `api/schema.sql`, fill in
`api/config.php`, and flip the switches. Full details in **`api/README.md`**.

---

## 5 · Going live checklist

- [ ] Contents of `nfc-site/` are directly inside `public_html`
- [ ] Landing page loads at `https://yourdomain.com`
- [ ] `/card/amina` opens the sample business page
- [ ] `/dashboard` opens the management interface
- [ ] WhatsApp links use your real number (search the HTML for `2349031528732`)
- [ ] Delete or replace the demo data in `assets/js/dashboard.js`
- [ ] Delete the demo INSERTs at the bottom of `api/schema.sql`
- [ ] Uncomment the HTTPS redirect in `.htaccess`
- [ ] Add each client's page as `card/<slug>.html`

---

## Notes

- Fonts load from Google Fonts (`Outfit`). Offline the page falls back to the
  system sans-serif — still fine, just less characterful.
- No jQuery, no frameworks, no build step. Every file is hand-written and
  editable in Notepad.
- The QR generator is a from-scratch, spec-correct implementation verified
  bit-for-bit against `python-qrcode` and decoded successfully with OpenCV.
  It handles versions 1–5 (up to ~106 characters) at error-correction level L.
