## LIVE PREVIEW (GitHub Pages)
The static site is auto-published by scripts/deploy-web.sh on every app deploy:
- Landing: https://useeman32-design.github.io/pixel_studios/tap/
- Client card page: https://useeman32-design.github.io/pixel_studios/tap/card/amina.html
- Dashboard: https://useeman32-design.github.io/pixel_studios/tap/dashboard/index.html (login: .../dashboard/login.html)
Note: Pages serves no PHP, so /tap/ runs on built-in demo data; deploy this folder to cPanel for the real API.

# Pixel Studios · Design, Print, Smart Cards & Digital — cPanel deployment guide

Everything in this folder is **static HTML/CSS/JS** — no build step, no Node,
no framework. Upload it and it runs.

```
nfc-site/
├── index.html                 ← the marketing landing page
├── .htaccess                  ← pretty URLs, gzip, caching, security headers
├── assets/
│   ├── css/style.css          ← landing page design system (light/dark)
│   ├── css/app.css            ← shared light design system
│   ├── css/card.css           ← public business page
│   ├── css/dashboard.css      ← management dashboard
│   ├── js/qr.js               ← real QR generator (verified scannable)
│   ├── js/main.js             ← landing page animations & interactions
│   ├── js/card.js             ← public page: vCard, share, analytics hooks
│   ├── js/dashboard.js        ← the whole management interface
│   ├── js/login.js            ← sign in / create account
│   └── img/                   ← vector logos + card/tap imagery; animated service mockups are built in HTML/CSS
├── card/
│   └── amina.html             ← the page a card tap opens  →  /card/amina
├── dashboard/
│   ├── index.html             ← management interface       →  /dashboard
│   └── login.html             ← sign-in screen             →  /dashboard/login
└── api/                       ← optional PHP backend (see api/README.md)
```

---

### THEMES
Light/dark theme on every page: toggle in the nav / topbar / card cover / login corner.
Preference persists in `localStorage.ps_theme`; first visit follows the OS `prefers-color-scheme`.
Logo variants swap via pure CSS (`[data-theme]` + paired `<img>`), so there is no flash on load.

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

- **Landing page** — rotating four-studio hero with an explicit accessible play/pause control. The original animated phone + NFC card demo is preserved; Design, Print, and Mobile & Web have matching HTML/CSS mockups (no generated hero images). Also includes the app-backed service catalogue and prices, product sample rooms, a local project shortlist, Smart Card detail, workflow, dashboard sample, FAQ, WhatsApp links and mobile menu.
- **Product sample rooms** — each of the 27 catalogue Add buttons opens that product's sample screen with three product-specific CSS/vector concept directions, offer options, listed app price, and a clear fictional-concept disclaimer. Visitors can shortlist products and send one WhatsApp brief. The standalone shortlist stores only selected product IDs in `localStorage.ps_project_items_v1`; it does not submit personal data to a server.
- **Profile template library** (`/profiles/`) — exactly 200 original, fictional profile concepts across ten industry groups (20 per group), with 51 niche-specific layout families and 143 local vector sample illustrations. Search and filter the gallery, then preview each page in mobile or desktop mode. Page compositions vary by visitor task: listings, portfolios, menus, service desks, appointment paths, dashboards, itineraries, learning guides and more. Images are local SVGs; image alternatives, reduced-motion support and a motion toggle are included. Every name, person, business, menu, price, project and detail is invented sample content—not a client, testimonial, completed project or real contactable business.
### Profile-library design research and implementation

The 200 concepts are organised as ten groups with twenty distinct niches in each. Each profile is assigned a composition family and visitor-task note rather than receiving only a different accent colour. The preview renderer gives those niches different page structures—for example, comparison-first property listings, editorial architecture/portfolio spreads, a task-first patient information page, a restaurant menu with ordering and visit details, a product storefront with product/fulfilment prompts, a school admissions path, a delivery route board, and an energy-assessment flow. Sample-only actions do not submit real bookings or enquiries.

The patterns follow established user-needs and accessibility guidance:
- [ONS Service Manual: writing for users](https://service-manual.ons.gov.uk/content/writing-for-users) and [structuring content](https://service-manual.ons.gov.uk/content/writing-for-users/structuring-content) informed concise, task-led sections and descriptive headings.
- [NHS England GP website guidance](https://www.england.nhs.uk/long-read/creating-a-highly-usable-and-accessible-gp-website-for-patients/) informed patient-first routes to appointments, contact, opening information and visit preparation.
- [Shopify product-page guidance](https://www.shopify.com/blog/product-page) informed product imagery/details plus visible shipping, returns and purchase questions; [Toast restaurant website guidance](https://pos.toasttab.com/blog/on-the-line/examples-restaurant-websites) informed menus, hours, location and ordering/reservation paths.
- [University of the Arts London portfolio guidance](https://www.arts.ac.uk/students/student-careers/career-resources/how-to-build-a-portfolio) informed curated, image-led creative work and clear contact routes.
- [W3C WAI image guidance](https://www.w3.org/WAI/tutorials/images/) informed informative image alternatives and empty alternatives for decorative card thumbnails. [WCAG reflow guidance](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html) informed narrow-screen layout checks. [web.dev motion guidance](https://web.dev/learn/accessibility/motion) informed short, non-looping animation, reduced-motion support and a visible motion toggle.

All 143 sample illustrations are generated locally as original SVG artwork by `scripts/generate-profile-art.js`; there are no external image dependencies in the preview. To regenerate them after changing a profile's art key, run `node scripts/generate-profile-art.js`. Offline content checks are available in `scripts/test-profile-library.js`.

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
| `assets/js/product-samples.js` | `PixelStudiosAPI.onProjectBriefChange(items)` | optional shortlist callback; no server request by default |
| `api/config.php`            | `DB_*` constants    | your MySQL credentials                                                  |

The product shortlist also dispatches `pixelstudios:projectchange` on `window`
with `event.detail.items`, an array of `{id, title, studio, listedPrice}` objects.
If you connect a backend, define `window.PixelStudiosAPI.onProjectBriefChange`
before `assets/js/product-samples.js` loads and send that explicit selection to
your own endpoint. No name, phone number, profile data or other visitor detail
is part of this hook. Without your callback, local shortlist + WhatsApp works
as a standalone flow.

The `api/` folder is a **ready-made PHP + MySQL backend** whose routes match
exactly what the front-end already calls. Import `api/schema.sql`, fill in
`api/config.php`, and flip the switches. Full details in **`api/README.md`**.

---

## 5 · Going live checklist

- [ ] Contents of `nfc-site/` are directly inside `public_html`
- [ ] Landing page loads at `https://yourdomain.com` and the hero rotates with a visible play/pause control
- [ ] Each of the 27 catalogue Add buttons opens the matching product samples; project shortlist can be cleared and sent
- [ ] `/profiles/` opens exactly 200 fictional concepts (20 in each industry group), with search, industry filters and 51 distinct niche-layout families
- [ ] Verify preview pages at mobile and desktop widths, sample-image alt text, fictional labels, animation toggle and reduced-motion behavior
- [ ] `/card/amina` opens the sample business page
- [ ] `/dashboard` opens the management interface
- [ ] Confirm all app-backed offer prices and replace/check WhatsApp links for your real business number (search `2349031528732`)
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
