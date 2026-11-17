<?php
/**
 * PIXEL STUDIOS · NFC platform API — configuration & helpers
 * ---------------------------------------------------------
 * 1. Create a MySQL database in cPanel (Databases → MySQL Databases).
 * 2. Import api/schema.sql with phpMyAdmin.
 * 3. Fill in the four constants below.
 *
 * Auth reuses the token table from ../backend (register.php / login.php),
 * so a user signed into the mobile app is signed in here too.
 */

declare(strict_types=1);

/* ============================ EDIT THESE ============================ */
define('DB_HOST', 'localhost');
define('DB_NAME', 'pixelst_nfc');
define('DB_USER', 'pixelst_admin');
define('DB_PASS', 'CHANGE_ME');

/** Base URL of the public card pages, used to build device links. */
define('PUBLIC_BASE', 'https://pixelstudios.com');

/** Bearer tokens live this long (seconds). 30 days. */
define('TOKEN_TTL', 2592000);
/* ====================================================================== */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* Some shared hosts strip the Authorization header — recover it. */
if (empty($_SERVER['HTTP_AUTHORIZATION']) && !empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $_SERVER['HTTP_AUTHORIZATION'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]
            );
        } catch (PDOException $e) {
            fail('Database connection failed', 500);
        }
    }
    return $pdo;
}

function body(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return $_POST ?: [];
    }
    $json = json_decode($raw, true);
    return is_array($json) ? $json : [];
}

function ok(array $data = []): void
{
    echo json_encode(array_merge(['ok' => true], $data));
    exit;
}

function fail(string $message, int $code = 400): void
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

/** Current bearer token, or null. */
function token(): ?string
{
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+(\S+)$/i', $h, $m)) {
        return $m[1];
    }
    return null;
}

/**
 * Resolve the signed-in user from the bearer token.
 * Returns ['id'=>int,'name'=>string,'email'=>string,'phone'=>string] or null.
 */
function auth_user(): ?array
{
    $t = token();
    if (!$t) {
        return null;
    }
    $hash = hash('sha256', $t);
    $st = db()->prepare(
        'SELECT u.id, u.name AS name, u.email, u.phone, t.user_id
           FROM auth_tokens t
           JOIN users u ON u.id = t.user_id
          WHERE t.token_hash = ? AND t.expires_at > NOW() AND t.revoked_at IS NULL
          LIMIT 1'
    );
    $st->execute([$hash]);
    $row = $st->fetch();
    return $row ?: null;
}

/** Same as auth_user() but exits 401 when there is no valid session. */
function require_user(): array
{
    $u = auth_user();
    if (!$u) {
        fail('Not signed in', 401);
    }
    return $u;
}

function slugify(string $s): string
{
    $s = strtolower(trim($s));
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    return trim($s, '-') ?: 'page';
}
