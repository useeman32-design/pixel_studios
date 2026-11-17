# `api/` — PHP + MySQL backend for the NFC platform

Optional. The site works without it; this is what you switch on when you want
real accounts, real analytics and pages stored in a database.

```
api/
├── index.php     router — every endpoint lives here
├── config.php    DB credentials, CORS, auth + JSON helpers   ← EDIT THIS
├── schema.sql    tables + demo data                          ← IMPORT THIS
├── .htaccess     sends /api/<route> to index.php?route=<route>
└── README.md     this file
```

Requirements: PHP 7.4+ with `pdo_mysql`, MySQL 5.7+ or MariaDB 10.2+.
Any standard cPanel host has both.

---

## 1 · Install

1. **Create the database** — cPanel → *MySQL Databases* → create `pixelst_nfc`,
   create a DB user, add the user to the database with **All Privileges**.
2. **Import the schema** — phpMyAdmin → select the database → *Import* →
   choose `schema.sql`. This creates the NFC tables and (if they don't exist
   yet) `users` + `auth_tokens`, which are shared with the mobile app's
   `backend/` folder so one sign-in works for both.
3. **Edit `api/config.php`** — the four constants at the top:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'pixelst_nfc');
   define('DB_USER', 'pixelst_admin');
   define('DB_PASS', 'your-real-password');
   define('PUBLIC_BASE', 'https://pixelstudios.com');
   ```
4. **Upload `api/` to `public_html/api/`.**
5. **Test it** — open `https://yourdomain.com/api/page?slug=amina`.
   You should get JSON back. If you see the PHP source instead, PHP isn't
   enabled for that folder; if you get a 500, check *Errors* in cPanel —
   it's almost always the DB credentials.
6. **Flip the front-end switches**
   - `assets/js/card.js` → `PixelAPI.base = "/api"`
   - `assets/js/dashboard.js` → `DASH.api = "/api"` and `REQUIRE_LOGIN = true`
   - `assets/js/login.js` → `DEMO_MODE = false`
7. **Delete the demo rows** at the bottom of `schema.sql` (or truncate
   `users`, `pages`, `devices`, `orders`, `team_members` in phpMyAdmin).

---

## 2 · Endpoints

| Method | Route                    | Auth | Body / query                                    | Returns |
| ------ | ------------------------ | ---- | ----------------------------------------------- | ------- |
| POST   | `/api/view`              | –    | `{slug, ref?}`                                  | `{ok, views}` |
| POST   | `/api/track`             | –    | `{slug, event}`                                 | `{ok}` |
| GET    | `/api/page?slug=amina`   | –    | –                                               | `{ok, data:{…page}}` |
| POST   | `/api/page`              | ✅   | any page field (see shape below)                | `{ok, data:{…page}}` |
| GET    | `/api/dashboard`         | ✅   | –                                               | `{ok, data:{…everything}}` |
| POST   | `/api/device`            | ✅   | `{id, status?\|link?\|name?\|remove?}`          | `{ok, data:{…device}}` |
| POST   | `/api/devices/pause-all` | ✅   | `{status?:"live"}`                              | `{ok}` |
| POST   | `/api/menu`              | ✅   | `{menu:[{cat,items:[{n,p,on}]}], showPrices, orderViaWa, live}` | `{ok}` |
| POST   | `/api/team`              | ✅   | `{name, rank, device}` or `{remove:"Full Name"}`| `{ok, id}` |
| POST   | `/api/account`           | ✅   | `{name,email,phone,state,lga}`                  | `{ok}` |
| POST   | `/api/password`          | ✅   | `{password}` (min 8 chars)                      | `{ok}` |
| POST   | `/api/sessions/revoke`   | ✅   | –                                               | `{ok}` |
| POST   | `/api/logout`            | ✅   | –                                               | `{ok}` |

**Auth** is a bearer token: `Authorization: Bearer <token>`, where the token is
the 64-character hex string issued by `backend/login.php` / `backend/register.php`.
Tokens are stored SHA-256-hashed in `auth_tokens`, expire after 30 days and can
be revoked. If your host strips the `Authorization` header, the `.htaccess` in
`backend/` already forwards it as `REDIRECT_HTTP_AUTHORIZATION`.

**Envelope** — every response is JSON: `{"ok":true, …}` or
`{"ok":false,"error":"message"}` with a proper HTTP status (401 / 404 / 422 / 500).

---

## 3 · Data shapes

`GET /api/page?slug=amina` returns exactly what `assets/js/card.js` expects:

```json
{ "ok": true, "data": {
    "slug": "amina", "firstName": "Amina", "lastName": "Bello",
    "rank": "Managing Director", "business": "Aurelia Homes",
    "type": "Real Estate", "city": "Abuja", "bio": "…",
    "phone": "+234 903 152 8732", "whatsapp": "+234 903 152 8732",
    "email": "amina@aureliahomes.ng", "website": "https://aureliahomes.ng",
    "address": "14B Adeola Hopewell Crescent, Wuse 2, Abuja",
    "instagram": "…", "x": "…", "facebook": "…", "linkedin": "…",
    "accent": "#a5e22c",
    "buttons": {"save":true,"whatsapp":true,"call":true,"email":true,"directions":true,"website":false},
    "services": [{"n":"Property sales","p":"From ₦45M"}],
    "pageUrl": "https://pixelstudios.com/card/amina"
} }
```

`GET /api/dashboard` returns the keys `assets/js/dashboard.js` merges into its
`DASH` object: `owner, pageUrl, stats, deltas, devices, actions, series,
weeks, activity, menu, page, team, orders` — same names, same nesting, so the
dashboard re-renders itself with no code changes.

---

## 4 · Tables

| Table             | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `users`           | accounts (shared with the mobile app)                        |
| `auth_tokens`     | hashed bearer tokens, expiry, revocation                     |
| `pages`           | one row per live business page — every field the editor saves |
| `devices`         | cards, keychains, wristbands, stickers, QR prints + status   |
| `page_views`      | one row per view; `device_id` NULL means QR/direct, not a tap |
| `click_events`    | every button click (`whatsapp`, `save_contact`, `call`, …)   |
| `services`        | the "What I do" list on a page                               |
| `menu_categories`, `menu_items` | the digital menu                              |
| `team_members`    | staff cards                                                  |
| `orders`          | card/device order history with a 4-step progress tracker     |

"Taps" in the UI = `page_views` rows **with** a `device_id` (i.e. an actual NFC
tap or a scanned device QR). "Views" = all `page_views` rows.

To attribute a view to a specific device, programme the NFC tag with
`https://pixelstudios.com/card/amina?dev=d2` — `device_id_from_referrer()`
picks the `dev` parameter up and records it.

---

## 5 · Testing without a browser

```bash
# public page
curl https://yourdomain.com/api/page?slug=amina

# log a view
curl -X POST https://yourdomain.com/api/view \
     -H 'Content-Type: application/json' -d '{"slug":"amina"}'

# sign in (uses the app's auth endpoints), keep the token
TOKEN=$(curl -s -X POST https://yourdomain.com/backend/login.php \
  -H 'Content-Type: application/json' \
  -d '{"identifier":"amina@aureliahomes.ng","password":"Demo1234!"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# dashboard
curl https://yourdomain.com/api/dashboard -H "Authorization: Bearer $TOKEN"
```

The demo user seeded by `schema.sql` is `amina@aureliahomes.ng` / `Demo1234!`.
**Change or delete it before going live.**

---

## 6 · Security notes

- All queries are prepared statements; no string interpolation of user input.
- Passwords are bcrypt-hashed via `password_hash()`.
- Errors are logged server-side (`error_log`) and returned as a generic
  `"Server error"` — no stack traces leak to the client.
- `api/.htaccess` denies direct web access to `.sql`, `.md`, `.log`, `.ini`.
- Add rate limiting on `/api/view` and `/api/track` if you expect abuse —
  a simple `INSERT … SELECT` guard on `(ip, page_id, minute)` is enough.
