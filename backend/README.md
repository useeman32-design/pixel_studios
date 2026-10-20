# Pixel Studios API — PHP + MySQL

User registration & login backend for the Pixel Studios app. Plain PHP (no
framework, no Composer) so it runs on any shared host (cPanel, Namecheap,
Hostinger…) or locally on XAMPP/Laragon.

## Files

| File                | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `schema.sql`        | MySQL schema (`users`, `auth_tokens`)              |
| `config.php`        | DB credentials + shared helpers (**edit this**)    |
| `register.php`      | `POST` create account → `{ token, user }`          |
| `login.php`         | `POST` sign in (email **or** phone) → `{ token, user }` |
| `logout.php`        | `POST` invalidate the current token                |
| `me.php`            | `GET` current user from Bearer token               |
| `update_profile.php`| `POST` update name/contact/social fields           |
| `.htaccess`         | Blocks `config.php`, passes the Authorization header |

## Setup (5 minutes)

### 1. Create the database

```sql
CREATE DATABASE pixel_studios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then import the schema:

```bash
mysql -u root -p pixel_studios < schema.sql
```

(or phpMyAdmin → **Import** → choose `schema.sql`).

### 2. Set credentials

Edit the four constants at the top of `config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'pixel_studios');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
```

### 3. Upload

Upload this whole `backend/` folder to your web server, e.g.:

```
https://yourdomain.com/api/   →  register.php, login.php, …
```

Make sure `.htaccess` is uploaded too (enable "show hidden files" in your FTP
client / cPanel file manager).

### 4. Point the app at it

In the app repo, open `src/lib/api.ts` and set:

```ts
export const API_BASE = 'https://yourdomain.com/api'; // no trailing slash
```

Rebuild/redeploy the app. Done.

### Local development (XAMPP)

1. Copy `backend/` to `htdocs/pixel-api/`.
2. Start Apache + MySQL, import `schema.sql`, set credentials in `config.php`.
3. In `src/lib/api.ts` use:
   - Android emulator: `http://10.0.2.2/pixel-api`
   - iOS simulator / web: `http://localhost/pixel-api`

## Endpoints

All request/response bodies are JSON. Authenticated calls send
`Authorization: Bearer <token>`.

### POST /register.php

```json
{ "name": "Amina Bello", "email": "amina@example.com", "phone": "08030000000", "password": "secret123" }
```

→ `201` `{ "ok": true, "token": "…64 hex…", "user": { … } }`

Errors: `422` validation, `409` email/phone already registered.

### POST /login.php

```json
{ "identifier": "amina@example.com", "password": "secret123" }
```

`identifier` accepts the email **or** the phone number.
→ `200` `{ "ok": true, "token": "…", "user": { … } }` · `401` wrong credentials.

### GET /me.php · POST /logout.php

Bearer token required. `me` returns `{ ok, user }`; `logout` kills the token.

### POST /update_profile.php

Bearer token required. Send any subset of:
`name, email, phone, about, instagram, x, facebook, linkedin, website`.
→ `{ "ok": true, "user": { …updated } }`

## Security notes

- Passwords: `password_hash()` / `password_verify()` (bcrypt, auto-rehash on login).
- Tokens: 64-hex random, stored **hashed** (SHA-256) in `auth_tokens`, 30-day TTL,
  rotated on every login, revocable on logout.
- All queries are PDO prepared statements.
- Login gives one generic error for "unknown account" and "wrong password"
  (no user enumeration).
- `config.php` is denied by `.htaccess`.

## Smoke test

```bash
curl -s -X POST https://yourdomain.com/api/register.php \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"test@example.com","phone":"08000000000","password":"secret123"}'

TOKEN=$(…token from the response…)

curl -s https://yourdomain.com/api/me.php -H "Authorization: Bearer $TOKEN"
```
