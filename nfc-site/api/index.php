<?php
/**
 * PIXEL STUDIOS · NFC platform API — single router
 * ------------------------------------------------
 * The front-end calls clean paths (/api/view, /api/dashboard, …).
 * .htaccess forwards them here as ?route=…
 *
 * PUBLIC   POST /api/view          {slug}                  → count a profile view
 * PUBLIC   POST /api/track         {slug,event}            → count a click
 * PUBLIC   GET  /api/page?slug=x                           → the live business page
 * AUTH     POST /api/page          {…fields}               → update your page
 * AUTH     GET  /api/dashboard                             → everything the dashboard renders
 * AUTH     POST /api/device        {id,status|link|remove} → pause / resume / re-point / delete
 * AUTH     POST /api/devices/pause-all                     → kill switch
 * AUTH     POST /api/menu          {menu[],showPrices,…}   → save the digital menu
 * AUTH     POST /api/team          {name,rank,device|remove}
 * AUTH     POST /api/account       {name,email,phone,state,lga}
 * AUTH     POST /api/password      {password}
 * AUTH     POST /api/sessions/revoke
 * AUTH     POST /api/logout
 */

declare(strict_types=1);
require __DIR__ . '/config.php';

$route = trim((string)($_GET['route'] ?? ''), '/');
$in    = body();

try {
    switch ($route) {

        /* ------------------------------------------------ PUBLIC -------- */
        case 'view': {
            $slug = slugify((string)($in['slug'] ?? ''));
            if ($slug === '') fail('Missing slug', 422);
            $page = page_by_slug($slug);
            if (!$page) fail('Page not found', 404);

            db()->prepare(
                'INSERT INTO page_views (page_id, device_id, referrer, user_agent, ip, created_at)
                 VALUES (?, ?, ?, ?, ?, NOW())'
            )->execute([
                $page['id'],
                device_id_from_referrer((string)($_SERVER['HTTP_REFERER'] ?? '')),
                mb_substr((string)($in['ref'] ?? $_SERVER['HTTP_REFERER'] ?? ''), 0, 255),
                mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255),
                mb_substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45),
            ]);
            ok(['views' => page_view_count((int)$page['id'])]);
        }

        case 'track': {
            $slug  = slugify((string)($in['slug'] ?? ''));
            $event = mb_substr((string)($in['event'] ?? ''), 0, 60);
            if ($slug === '' || $event === '') fail('Missing slug or event', 422);
            $page = page_by_slug($slug);
            if (!$page) fail('Page not found', 404);

            db()->prepare(
                'INSERT INTO click_events (page_id, event, user_agent, ip, created_at)
                 VALUES (?, ?, ?, ?, NOW())'
            )->execute([
                $page['id'],
                $event,
                mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255),
                mb_substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45),
            ]);
            ok();
        }

        case 'page': {
            if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
                $slug = slugify((string)($_GET['slug'] ?? ''));
                $page = page_by_slug($slug);
                if (!$page) fail('Page not found', 404);
                if ((int)$page['is_live'] === 0) fail('This page is temporarily unavailable', 404);
                ok(['data' => public_page($page)]);
            }
            $user = require_user();
            update_page($user, $in);
            ok(['data' => public_page(page_by_user($user['id']))]);
        }

        /* ------------------------------------------------ AUTH ---------- */
        case 'dashboard': {
            $user = require_user();
            ok(['data' => dashboard_payload($user)]);
        }

        case 'device': {
            $user = require_user();
            $id   = (string)($in['id'] ?? '');
            $dev  = device_by_id($id, (int)$user['id']);
            if (!$dev) fail('Device not found', 404);

            if (!empty($in['remove'])) {
                db()->prepare('DELETE FROM devices WHERE id = ?')->execute([$dev['id']]);
                ok(['removed' => $dev['id']]);
            }
            $sets = [];
            $args = [];
            if (isset($in['status'])) {
                $status = in_array($in['status'], ['live', 'paused', 'lost'], true) ? $in['status'] : 'paused';
                $sets[] = 'status = ?';
                $args[] = $status;
            }
            if (isset($in['link'])) {
                $sets[] = 'link_url = ?';
                $args[] = mb_substr((string)$in['link'], 0, 255);
            }
            if (isset($in['name'])) {
                $sets[] = 'name = ?';
                $args[] = mb_substr((string)$in['name'], 0, 120);
            }
            if (!$sets) fail('Nothing to update', 422);
            $args[] = $dev['id'];
            db()->prepare('UPDATE devices SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($args);
            ok(['data' => device_by_id($id, (int)$user['id'])]);
        }

        case 'devices/pause-all': {
            $user = require_user();
            db()->prepare(
                'UPDATE devices SET status = ? WHERE page_id IN (SELECT id FROM pages WHERE user_id = ?)'
            )->execute([isset($in['status']) && $in['status'] === 'live' ? 'live' : 'paused', $user['id']]);
            ok();
        }

        case 'menu': {
            $user = require_user();
            $page = page_by_user($user['id']);
            if (!$page) fail('No page yet', 404);

            db()->prepare('UPDATE pages SET menu_enabled = ?, menu_show_prices = ?, menu_order_via_whatsapp = ? WHERE id = ?')
              ->execute([
                  !empty($in['live']) ? 1 : 0,
                  !isset($in['showPrices']) || $in['showPrices'] ? 1 : 0,
                  !empty($in['orderViaWa']) ? 1 : 0,
                  $page['id'],
              ]);

            if (isset($in['menu']) && is_array($in['menu'])) {
                db()->beginTransaction();
                db()->prepare('DELETE FROM menu_items WHERE page_id = ?')->execute([$page['id']]);
                db()->prepare('DELETE FROM menu_categories WHERE page_id = ?')->execute([$page['id']]);
                $catSt = db()->prepare('INSERT INTO menu_categories (page_id, name, position) VALUES (?, ?, ?)');
                $itSt  = db()->prepare('INSERT INTO menu_items (category_id, name, price, available, position) VALUES (?, ?, ?, ?, ?)');
                foreach (array_values($in['menu']) as $ci => $cat) {
                    $catSt->execute([$page['id'], mb_substr((string)($cat['cat'] ?? 'Category'), 0, 80), $ci]);
                    $catId = (int)db()->lastInsertId();
                    foreach (array_values((array)($cat['items'] ?? [])) as $ii => $item) {
                        $itSt->execute([
                            $catId,
                            mb_substr((string)($item['n'] ?? ''), 0, 120),
                            (int)($item['p'] ?? 0),
                            empty($item['on']) ? 0 : 1,
                            $ii,
                        ]);
                    }
                }
                db()->commit();
            }
            ok();
        }

        case 'team': {
            $user = require_user();
            if (!empty($in['remove'])) {
                db()->prepare('DELETE FROM team_members WHERE user_id = ? AND full_name = ?')
                  ->execute([$user['id'], (string)$in['remove']]);
                ok();
            }
            $name = trim((string)($in['name'] ?? ''));
            if ($name === '') fail('Name is required', 422);
            db()->prepare(
                'INSERT INTO team_members (user_id, full_name, rank_title, device_type, created_at)
                 VALUES (?, ?, ?, ?, NOW())'
            )->execute([$user['id'], mb_substr($name, 0, 90), mb_substr((string)($in['rank'] ?? ''), 0, 60), mb_substr((string)($in['device'] ?? 'PVC card'), 0, 40)]);
            ok(['id' => (int)db()->lastInsertId()]);
        }

        case 'account': {
            $user = require_user();
            db()->prepare('UPDATE users SET name = ?, email = ?, phone = ?, state = ?, lga = ? WHERE id = ?')
              ->execute([
                  mb_substr((string)($in['name'] ?? $user['name']), 0, 90),
                  mb_substr((string)($in['email'] ?? $user['email']), 0, 160),
                  preg_replace('/[^0-9+]/', '', (string)($in['phone'] ?? $user['phone'])),
                  mb_substr((string)($in['state'] ?? ''), 0, 60),
                  mb_substr((string)($in['lga'] ?? ''), 0, 60),
                  $user['id'],
              ]);
            ok();
        }

        case 'password': {
            $user = require_user();
            $pw   = (string)($in['password'] ?? '');
            if (strlen($pw) < 8) fail('Password must be at least 8 characters', 422);
            db()->prepare('UPDATE users SET password_hash = ? WHERE id = ?')
              ->execute([password_hash($pw, PASSWORD_BCRYPT), $user['id']]);
            ok();
        }

        case 'sessions/revoke': {
            $user = require_user();
            db()->prepare(
                'UPDATE auth_tokens SET revoked_at = NOW()
                  WHERE user_id = ? AND token_hash <> ?'
            )->execute([$user['id'], hash('sha256', (string)token())]);
            ok();
        }

        case 'logout': {
            $t = token();
            if ($t) {
                db()->prepare('UPDATE auth_tokens SET revoked_at = NOW() WHERE token_hash = ?')
                  ->execute([hash('sha256', $t)]);
            }
            ok();
        }

        default:
            fail('Unknown endpoint: /api/' . $route, 404);
    }
} catch (Throwable $e) {
    if (db()->inTransaction()) {
        db()->rollBack();
    }
    error_log('[pixel-api] ' . $e->getMessage());
    fail('Server error', 500);
}

/* ============================================================
   Helpers
   ============================================================ */

function page_by_slug(string $slug): ?array
{
    $st = db()->prepare('SELECT * FROM pages WHERE slug = ? LIMIT 1');
    $st->execute([$slug]);
    $row = $st->fetch();
    return $row ?: null;
}

function page_by_user(int $userId): ?array
{
    $st = db()->prepare('SELECT * FROM pages WHERE user_id = ? ORDER BY id ASC LIMIT 1');
    $st->execute([$userId]);
    $row = $st->fetch();
    return $row ?: null;
}

function device_by_id(string $id, int $userId): ?array
{
    $st = db()->prepare(
        'SELECT d.* FROM devices d
           JOIN pages p ON p.id = d.page_id
          WHERE d.public_id = ? AND p.user_id = ? LIMIT 1'
    );
    $st->execute([$id, $userId]);
    $row = $st->fetch();
    return $row ?: null;
}

function device_id_from_referrer(string $ref): ?int
{
    if ($ref === '' || strpos($ref, 'dev=') === false) {
        return null;
    }
    if (!preg_match('/[?&]dev=([A-Za-z0-9_\-]+)/', $ref, $m)) {
        return null;
    }
    $st = db()->prepare('SELECT id FROM devices WHERE public_id = ? LIMIT 1');
    $st->execute([$m[1]]);
    $row = $st->fetch();
    return $row ? (int)$row['id'] : null;
}

function page_view_count(int $pageId): int
{
    $st = db()->prepare('SELECT COUNT(*) FROM page_views WHERE page_id = ?');
    $st->execute([$pageId]);
    return (int)$st->fetchColumn();
}

/** Shape consumed by assets/js/card.js */
function public_page(array $p): array
{
    return [
        'slug'      => $p['slug'],
        'firstName' => $p['first_name'],
        'lastName'  => $p['last_name'],
        'rank'      => $p['rank_title'],
        'business'  => $p['business_name'],
        'type'      => $p['business_type'],
        'city'      => $p['city'],
        'bio'       => $p['bio'],
        'phone'     => $p['phone'],
        'whatsapp'  => $p['whatsapp'],
        'email'     => $p['email'],
        'website'   => $p['website'],
        'address'   => $p['address'],
        'instagram' => $p['instagram'],
        'x'         => $p['x_handle'],
        'facebook'  => $p['facebook'],
        'linkedin'  => $p['linkedin'],
        'accent'    => $p['accent_color'],
        'buttons'   => json_decode((string)($p['buttons'] ?? '{}'), true) ?: new stdClass(),
        'services'  => services_of((int)$p['id']),
        'pageUrl'   => PUBLIC_BASE . '/card/' . $p['slug'],
    ];
}

function services_of(int $pageId): array
{
    $st = db()->prepare('SELECT name AS n, price AS p FROM services WHERE page_id = ? ORDER BY position ASC');
    $st->execute([$pageId]);
    return $st->fetchAll();
}

function update_page(array $user, array $in): void
{
    $page = page_by_user((int)$user['id']);
    if (!$page) fail('No page yet', 404);

    $map = [
        'firstName' => 'first_name', 'lastName' => 'last_name', 'rank' => 'rank_title',
        'business' => 'business_name', 'type' => 'business_type', 'city' => 'city',
        'bio' => 'bio', 'phone' => 'phone', 'whatsapp' => 'whatsapp', 'email' => 'email',
        'website' => 'website', 'address' => 'address', 'instagram' => 'instagram',
        'x' => 'x_handle', 'facebook' => 'facebook', 'linkedin' => 'linkedin',
        'accent' => 'accent_color',
    ];
    $sets = [];
    $args = [];
    foreach ($map as $key => $col) {
        if (!array_key_exists($key, $in)) continue;
        $sets[] = "$col = ?";
        $args[] = mb_substr((string)$in[$key], 0, 500);
    }
    if (isset($in['buttons']) && is_array($in['buttons'])) {
        $sets[] = 'buttons = ?';
        $args[] = json_encode($in['buttons']);
    }
    if (!$sets) fail('Nothing to update', 422);

    $args[] = $page['id'];
    db()->prepare('UPDATE pages SET ' . implode(', ', $sets) . ', updated_at = NOW() WHERE id = ?')->execute($args);
}

/** Shape consumed by assets/js/dashboard.js */
function dashboard_payload(array $user): array
{
    $page = page_by_user((int)$user['id']);
    if (!$page) fail('No page yet — order a card first', 404);
    $pid = (int)$page['id'];

    $devices = db()->prepare(
        'SELECT public_id AS id, type, name, link_url AS link, status, material, issued_on AS issued,
                (SELECT COUNT(*) FROM page_views v WHERE v.device_id = d.id) AS views
           FROM devices d WHERE page_id = ? ORDER BY id ASC'
    );
    $devices->execute([$pid]);

    $stats = db()->prepare(
        "SELECT
           (SELECT COUNT(*) FROM page_views WHERE page_id = ?) AS views,
           (SELECT COUNT(*) FROM page_views WHERE page_id = ? AND created_at > NOW() - INTERVAL 7 DAY) AS views7,
           (SELECT COUNT(*) FROM click_events WHERE page_id = ? AND event = 'save_contact') AS saves,
           (SELECT COUNT(*) FROM click_events WHERE page_id = ? AND event = 'whatsapp') AS chats"
    );
    $stats->execute([$pid, $pid, $pid, $pid]);
    $s = $stats->fetch() ?: [];

    $series = series_14($pid);

    $clicks = db()->prepare(
        'SELECT event k, COUNT(*) v FROM click_events
          WHERE page_id = ? AND created_at > NOW() - INTERVAL 30 DAY
          GROUP BY event ORDER BY v DESC LIMIT 8'
    );
    $clicks->execute([$pid]);

    $team = db()->prepare('SELECT full_name n, rank_title r, device_type c, created_at FROM team_members WHERE user_id = ? ORDER BY id ASC');
    $team->execute([$user['id']]);

    $orders = db()->prepare('SELECT order_no id, item, placed_on date, total, step, status FROM orders WHERE user_id = ? ORDER BY id DESC');
    $orders->execute([$user['id']]);

    $stats7 = week_deltas($pid);

    return [
        'owner'    => ['name' => $user['name'], 'first' => explode(' ', (string)$user['name'])[0], 'plan' => (string)$page['plan'], 'initials' => initials((string)$user['name'])],
        'pageUrl'  => PUBLIC_BASE . '/card/' . $page['slug'],
        'stats'    => [
            'views' => (int)($s['views'] ?? 0),
            'taps'  => (int)($s['views'] ?? 0),
            'saves' => (int)($s['saves'] ?? 0),
            'chats' => (int)($s['chats'] ?? 0),
        ],
        'deltas'   => $stats7['deltas'],
        'devices'  => $devices->fetchAll(),
        'actions'  => $clicks->fetchAll(),
        'series'   => $series,
        'weeks'    => $stats7['weeks'],
        'activity' => activity_feed($pid),
        'menu'     => menu_of($pid),
        'page'     => public_page($page),
        'team'     => $team->fetchAll(),
        'orders'   => $orders->fetchAll(),
    ];
}

/** Last 14 days as {labels, views, taps} — exactly the shape dashboard.js renders. */
function series_14(int $pageId): array
{
    $st = db()->prepare(
        'SELECT DATE(created_at) d, COUNT(*) c,
                SUM(CASE WHEN device_id IS NOT NULL THEN 1 ELSE 0 END) t
           FROM page_views
          WHERE page_id = ? AND created_at >= CURDATE() - INTERVAL 13 DAY
          GROUP BY DATE(created_at)'
    );
    $st->execute([$pageId]);
    $byDate = [];
    foreach ($st->fetchAll() as $r) {
        $byDate[$r['d']] = ['c' => (int)$r['c'], 't' => (int)$r['t']];
    }

    $labels = []; $views = []; $taps = [];
    for ($i = 13; $i >= 0; $i--) {
        $ts  = strtotime("-$i days");
        $key = date('Y-m-d', $ts);
        $labels[] = date('N', $ts) === '7' ? 'S' : substr(date('D', $ts), 0, 1);
        $views[]  = $byDate[$key]['c'] ?? 0;
        $taps[]   = $byDate[$key]['t'] ?? 0;
    }
    return ['labels' => $labels, 'views' => $views, 'taps' => $taps];
}

/** Week-over-week change plus the 4-row weekly summary table. */
function week_deltas(int $pageId): array
{
    $st = db()->prepare(
        'SELECT
           YEARWEEK(created_at, 3) w,
           COUNT(*) views,
           SUM(CASE WHEN device_id IS NOT NULL THEN 1 ELSE 0 END) taps
         FROM page_views
        WHERE page_id = ? AND created_at >= CURDATE() - INTERVAL 28 DAY
        GROUP BY YEARWEEK(created_at, 3) ORDER BY w DESC LIMIT 4'
    );
    $st->execute([$pageId]);
    $rows = $st->fetchAll();

    $cv = db()->prepare(
        "SELECT YEARWEEK(created_at, 3) w,
                SUM(event = 'save_contact') saves,
                SUM(event = 'whatsapp') chats
           FROM click_events
          WHERE page_id = ? AND created_at >= CURDATE() - INTERVAL 28 DAY
          GROUP BY YEARWEEK(created_at, 3)"
    );
    $cv->execute([$pageId]);
    $clicks = [];
    foreach ($cv->fetchAll() as $r) {
        $clicks[(int)$r['w']] = ['saves' => (int)$r['saves'], 'chats' => (int)$r['chats']];
    }

    $weeks = [];
    foreach ($rows as $i => $r) {
        $w  = (int)$r['w'];
        $cl = $clicks[$w] ?? ['saves' => 0, 'chats' => 0];
        $weeks[] = [
            'w'     => $i === 0 ? 'This week' : ($i === 1 ? 'Last week' : "$i weeks ago"),
            'views' => (int)$r['views'],
            'taps'  => (int)$r['taps'],
            'saves' => $cl['saves'],
            'chats' => $cl['chats'],
            'chg'   => 0,
        ];
    }
    // percentage change against the previous week
    for ($i = 0; $i < count($weeks); $i++) {
        $prev = $weeks[$i + 1]['views'] ?? 0;
        $weeks[$i]['chg'] = $prev > 0 ? (int)round((($weeks[$i]['views'] - $prev) / $prev) * 100) : 0;
    }

    $d = $weeks[0]['chg'] ?? 0;
    return [
        'weeks'  => $weeks,
        'deltas' => ['views' => $d, 'taps' => $weeks[1]['chg'] ?? $d, 'saves' => $d, 'chats' => $d],
    ];
}

/** The live feed on the overview screen. */
function activity_feed(int $pageId): array
{
    $st = db()->prepare(
        "SELECT 'click' kind, event AS label, NULL AS place, created_at
           FROM click_events WHERE page_id = ?
          UNION ALL
         SELECT 'view' kind, 'Profile viewed' AS label,
                (SELECT name FROM devices d WHERE d.id = v.device_id) AS place, v.created_at
           FROM page_views v WHERE v.page_id = ?
          ORDER BY created_at DESC LIMIT 8"
    );
    $st->execute([$pageId, $pageId]);

    $icons = ['whatsapp' => 'wa', 'save_contact' => 'user', 'vcard_download' => 'user',
              'call' => 'call', 'email' => 'mail', 'directions' => 'pin',
              'instagram' => 'ig', 'x' => 'x', 'facebook' => 'fb', 'linkedin' => 'li'];
    $out = [];
    foreach ($st->fetchAll() as $r) {
        $isClick = $r['kind'] === 'click';
        $out[] = [
            't'    => $isClick ? '<b>' . ucwords(str_replace('_', ' ', (string)$r['label'])) . '</b> clicked' : (string)$r['label'],
            'w'    => when_ago((string)$r['created_at']) . ($r['place'] ? ' · ' . $r['place'] : ''),
            'i'    => $isClick ? ($icons[$r['label']] ?? 'tap') : 'eye',
            'lime' => $isClick && in_array($r['label'], ['whatsapp', 'save_contact', 'vcard_download'], true),
        ];
    }
    return $out;
}

function when_ago(string $dt): string
{
    $diff = time() - strtotime($dt);
    if ($diff < 60)      return 'just now';
    if ($diff < 3600)    return intdiv($diff, 60) . ' min ago';
    if ($diff < 86400)   return intdiv($diff, 3600) . ' hour' . (intdiv($diff, 3600) > 1 ? 's' : '') . ' ago';
    if ($diff < 604800)  return intdiv($diff, 86400) . ' day' . (intdiv($diff, 86400) > 1 ? 's' : '') . ' ago';
    return date('j M Y', strtotime($dt));
}

/** Menu categories + items, shaped for the menu editor. */
function menu_of(int $pageId): array
{
    $st = db()->prepare('SELECT id, name FROM menu_categories WHERE page_id = ? ORDER BY position ASC');
    $st->execute([$pageId]);
    $cats = $st->fetchAll();
    if (!$cats) {
        return [];
    }
    $ids = array_column($cats, 'id');
    $ph  = implode(',', array_fill(0, count($ids), '?'));
    $it  = db()->prepare("SELECT category_id, name n, price p, available o FROM menu_items WHERE category_id IN ($ph) ORDER BY position ASC");
    $it->execute($ids);
    $grouped = [];
    foreach ($it->fetchAll() as $r) {
        $grouped[(int)$r['category_id']][] = ['n' => $r['n'], 'p' => (int)$r['p'], 'on' => (int)$r['o'] === 1];
    }
    $out = [];
    foreach ($cats as $c) {
        $out[] = ['cat' => $c['name'], 'items' => $grouped[(int)$c['id']] ?? []];
    }
    return $out;
}

function initials(string $name): string
{
    $parts = preg_split('/\s+/', trim($name)) ?: [];
    $out = '';
    foreach (array_slice($parts, 0, 2) as $p) {
        $out .= strtoupper(substr($p, 0, 1));
    }
    return $out ?: '?';
}
