-- ============================================================
--  PIXEL STUDIOS · NFC platform — MySQL / MariaDB schema
-- ------------------------------------------------------------
--  Import order:
--    1) backend/schema.sql   (users + auth_tokens, shared with the mobile app)
--    2) api/schema.sql       (this file — adds the NFC tables)
--
--  Or just import this file alone: it creates users/auth_tokens too
--  if they don't exist yet.
--
--  In cPanel: phpMyAdmin → your database → Import → choose this file.
-- ============================================================

SET NAMES utf8mb4;

-- ---------- shared auth (created by backend/schema.sql; safe to re-run) -----
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  about VARCHAR(500) NOT NULL DEFAULT '',
  instagram VARCHAR(190) NOT NULL DEFAULT '',
  x_handle VARCHAR(190) NOT NULL DEFAULT '',
  facebook VARCHAR(190) NOT NULL DEFAULT '',
  linkedin VARCHAR(190) NOT NULL DEFAULT '',
  website VARCHAR(190) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auth_tokens (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_tokens_hash (token_hash),
  KEY idx_tokens_user (user_id),
  CONSTRAINT fk_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nigeria location fields used by Settings (MariaDB supports IF NOT EXISTS here;
-- on MySQL 5.7 run the two ALTERs manually and ignore the duplicate-column error.)
ALTER TABLE users ADD COLUMN IF NOT EXISTS state VARCHAR(60) NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS lga   VARCHAR(60) NOT NULL DEFAULT '';
ALTER TABLE auth_tokens ADD COLUMN IF NOT EXISTS revoked_at DATETIME NULL DEFAULT NULL;

-- ---------- the live business page a card opens ----------------------------
CREATE TABLE IF NOT EXISTS pages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  slug VARCHAR(80) NOT NULL,
  first_name VARCHAR(80) NOT NULL DEFAULT '',
  last_name VARCHAR(80) NOT NULL DEFAULT '',
  rank_title VARCHAR(80) NOT NULL DEFAULT '',
  business_name VARCHAR(140) NOT NULL DEFAULT '',
  business_type VARCHAR(80) NOT NULL DEFAULT '',
  city VARCHAR(80) NOT NULL DEFAULT '',
  bio VARCHAR(500) NOT NULL DEFAULT '',
  phone VARCHAR(40) NOT NULL DEFAULT '',
  whatsapp VARCHAR(40) NOT NULL DEFAULT '',
  email VARCHAR(190) NOT NULL DEFAULT '',
  website VARCHAR(190) NOT NULL DEFAULT '',
  address VARCHAR(255) NOT NULL DEFAULT '',
  instagram VARCHAR(190) NOT NULL DEFAULT '',
  x_handle VARCHAR(190) NOT NULL DEFAULT '',
  facebook VARCHAR(190) NOT NULL DEFAULT '',
  linkedin VARCHAR(190) NOT NULL DEFAULT '',
  accent_color CHAR(7) NOT NULL DEFAULT '#a5e22c',
  buttons TEXT NULL,                       -- JSON: {save,whatsapp,call,email,directions,website}
  plan VARCHAR(40) NOT NULL DEFAULT 'Premium Portfolio',
  is_live TINYINT(1) NOT NULL DEFAULT 1,
  menu_enabled TINYINT(1) NOT NULL DEFAULT 0,
  menu_show_prices TINYINT(1) NOT NULL DEFAULT 1,
  menu_order_via_whatsapp TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_pages_slug (slug),
  KEY idx_pages_user (user_id),
  CONSTRAINT fk_pages_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- NFC hardware: cards, keychains, wristbands, stickers, QR prints -
CREATE TABLE IF NOT EXISTS devices (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(40) NOT NULL,          -- the id the dashboard uses (e.g. "d1")
  page_id INT UNSIGNED NOT NULL,
  type ENUM('card','keychain','band','sticker','qr') NOT NULL DEFAULT 'card',
  name VARCHAR(120) NOT NULL,
  material VARCHAR(80) NOT NULL DEFAULT '',
  status ENUM('live','paused','lost') NOT NULL DEFAULT 'live',
  link_url VARCHAR(255) NOT NULL,          -- where the tap goes
  issued_on VARCHAR(40) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_devices_public (public_id),
  KEY idx_devices_page (page_id),
  CONSTRAINT fk_devices_page FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- analytics ------------------------------------------------------
CREATE TABLE IF NOT EXISTS page_views (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_id INT UNSIGNED NOT NULL,
  device_id INT UNSIGNED NULL DEFAULT NULL,   -- NULL = QR scan or direct link
  referrer VARCHAR(255) NOT NULL DEFAULT '',
  user_agent VARCHAR(255) NOT NULL DEFAULT '',
  ip VARCHAR(45) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_views_page_date (page_id, created_at),
  KEY idx_views_device (device_id),
  CONSTRAINT fk_views_page FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE,
  CONSTRAINT fk_views_device FOREIGN KEY (device_id) REFERENCES devices (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS click_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_id INT UNSIGNED NOT NULL,
  event VARCHAR(60) NOT NULL,              -- whatsapp, save_contact, call, email, directions, instagram…
  user_agent VARCHAR(255) NOT NULL DEFAULT '',
  ip VARCHAR(45) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_clicks_page_event (page_id, event, created_at),
  CONSTRAINT fk_clicks_page FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- page content ---------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_id INT UNSIGNED NOT NULL,
  name VARCHAR(140) NOT NULL,
  price VARCHAR(60) NOT NULL DEFAULT '',
  position INT NOT NULL DEFAULT 0,
  KEY idx_services_page (page_id),
  CONSTRAINT fk_services_page FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_id INT UNSIGNED NOT NULL,
  name VARCHAR(80) NOT NULL,
  position INT NOT NULL DEFAULT 0,
  KEY idx_menucat_page (page_id),
  CONSTRAINT fk_menucat_page FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(140) NOT NULL,
  price INT UNSIGNED NOT NULL DEFAULT 0,
  available TINYINT(1) NOT NULL DEFAULT 1,
  position INT NOT NULL DEFAULT 0,
  KEY idx_menuitem_cat (category_id),
  CONSTRAINT fk_menuitem_cat FOREIGN KEY (category_id) REFERENCES menu_categories (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS team_members (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  full_name VARCHAR(90) NOT NULL,
  rank_title VARCHAR(60) NOT NULL DEFAULT '',
  device_type VARCHAR(40) NOT NULL DEFAULT 'PVC card',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_team_user (user_id),
  CONSTRAINT fk_team_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  order_no VARCHAR(20) NOT NULL,
  item VARCHAR(160) NOT NULL,
  placed_on VARCHAR(40) NOT NULL DEFAULT '',
  total INT UNSIGNED NOT NULL DEFAULT 0,
  step TINYINT UNSIGNED NOT NULL DEFAULT 1,   -- 1 placed · 2 design · 3 production · 4 delivered
  status VARCHAR(40) NOT NULL DEFAULT 'Order placed',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_orders_no (order_no),
  KEY idx_orders_user (user_id),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  DEMO DATA — delete these INSERTs before going live.
--  Password for the demo user: Demo1234!
-- ============================================================
INSERT INTO users (name, email, phone, password_hash, state, lga) VALUES
('Amina Bello', 'amina@aureliahomes.ng', '+2349031528732',
 '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1HlCS4bZJ18JuywdBLmT8QEkC0y0kO2',
 'FCT — Abuja', 'Abuja Municipal');

SET @uid = LAST_INSERT_ID();

INSERT INTO pages
(user_id, slug, first_name, last_name, rank_title, business_name, business_type, city, bio,
 phone, whatsapp, email, website, address, instagram, x_handle, facebook, linkedin,
 accent_color, buttons, plan)
VALUES
(@uid, 'amina', 'Amina', 'Bello', 'Managing Director', 'Aurelia Homes', 'Real Estate', 'Abuja',
 'Helping families and investors find homes that actually fit — verified listings, honest advice and paperwork handled end to end.',
 '+234 903 152 8732', '+234 903 152 8732', 'amina@aureliahomes.ng', 'https://aureliahomes.ng',
 '14B Adeola Hopewell Crescent, Wuse 2, Abuja',
 'https://instagram.com/aureliahomes', 'https://x.com/aureliahomes',
 'https://facebook.com/aureliahomes', 'https://linkedin.com/company/aureliahomes',
 '#a5e22c',
 '{"save":true,"whatsapp":true,"call":true,"email":true,"directions":true,"website":false}',
 'Premium Portfolio');

SET @pid = LAST_INSERT_ID();

INSERT INTO devices (public_id, page_id, type, name, material, status, link_url, issued_on) VALUES
('d1', @pid, 'card',    'Premium PVC card',        'Matte black PVC',  'live',   'pixelstudios.com/card/amina',  '12 Mar 2026'),
('d2', @pid, 'keychain','Keychain tag',            'Black acrylic',    'live',   'pixelstudios.com/card/amina',  '12 Mar 2026'),
('d3', @pid, 'qr',      'Menu QR — table cards',   '12 × A6 stands',   'paused', 'pixelstudios.com/menu/aurelia','02 Feb 2026'),
('d4', @pid, 'sticker', 'Phone sticker',           'Slim NFC vinyl',   'live',   'pixelstudios.com/card/amina',  '28 Apr 2026'),
('d5', @pid, 'band',    'Event wristband',         'Silicone, lime',   'live',   'pixelstudios.com/card/amina',  '09 Jun 2026');

INSERT INTO services (page_id, name, price, position) VALUES
(@pid, 'Property sales',       'From ₦45M',   0),
(@pid, 'Rentals & short lets', 'From ₦250k',  1),
(@pid, 'Title verification',   '₦75,000',     2),
(@pid, 'Investment advisory',  'Free consult',3);

INSERT INTO team_members (user_id, full_name, rank_title, device_type) VALUES
(@uid, 'Amina Bello',  'Managing Director', 'PVC card'),
(@uid, 'Musa Ibrahim', 'Sales Manager',     'PVC card'),
(@uid, 'Grace Okoro',  'Client Relations',  'Keychain tag');

INSERT INTO orders (user_id, order_no, item, placed_on, total, step, status) VALUES
(@uid, 'PS-2863', '5 × team PVC cards',                 '14 Sep 2026', 175000, 3, 'In production'),
(@uid, 'PS-2847', '12 × menu QR table stands',          '28 Aug 2026',  96000, 2, 'Design review'),
(@uid, 'PS-2791', '1 × premium PVC card + keychain',    '12 Mar 2026',  55000, 4, 'Delivered'),
(@uid, 'PS-2764', 'Event wristbands × 40',              '02 Feb 2026', 420000, 4, 'Delivered'),
(@uid, 'PS-2712', 'Phone stickers × 3',                 '11 Jan 2026',  24000, 4, 'Delivered');
