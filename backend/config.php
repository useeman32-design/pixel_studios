<?php
/**
 * Pixel Studios API — shared configuration & helpers.
 *
 * ▸ EDIT THE DATABASE CREDENTIALS BELOW before deploying.
 * ▸ This file is blocked from direct web access by .htaccess.
 */
declare(strict_types=1);

/* ------------------------- database credentials ------------------------- */
define('DB_HOST', 'localhost');      // usually 'localhost' on shared hosting
define('DB_NAME', 'pixel_studios');  // your MySQL database name
define('DB_USER', 'root');           // your MySQL user
define('DB_PASS', '');               // your MySQL password

/* Session tokens stay valid for this many days. */
define('TOKEN_TTL_DAYS', 30);

/* ------------------------------ CORS / JSON ------------------------------ */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* -------------------------------- helpers -------------------------------- */

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
            json_out(['ok' => false, 'error' => 'Database connection failed — check backend/config.php credentials.'], 500);
        }
    }
    return $pdo;
}

function json_out(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Accepts a JSON body (preferred) or a classic form POST. */
function read_input(): array
{
    $raw  = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $_POST;
}

function bearer_token(): string
{
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    if (preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
        return $m[1];
    }
    return '';
}

/** Validates the Bearer token and returns the full user row. */
function require_auth(): array
{
    $token = bearer_token();
    if ($token === '') {
        json_out(['ok' => false, 'error' => 'Missing authentication token.'], 401);
    }
    $hash = hash('sha256', $token);
    $st   = db()->prepare(
        'SELECT u.*, t.expires_at AS token_expires
           FROM auth_tokens t
           JOIN users u ON u.id = t.user_id
          WHERE t.token_hash = ?
          LIMIT 1'
    );
    $st->execute([$hash]);
    $row = $st->fetch();

    if (!$row) {
        json_out(['ok' => false, 'error' => 'Invalid session. Please sign in again.'], 401);
    }
    if (strtotime((string) $row['token_expires']) < time()) {
        db()->prepare('DELETE FROM auth_tokens WHERE token_hash = ?')->execute([$hash]);
        json_out(['ok' => false, 'error' => 'Session expired. Please sign in again.'], 401);
    }
    return $row;
}

/** Strips private fields before a user row is sent to the app. */
function public_user(array $u): array
{
    return [
        'id'        => (int) $u['id'],
        'name'      => (string) $u['name'],
        'email'     => (string) $u['email'],
        'phone'     => (string) $u['phone'],
        'about'     => (string) ($u['about'] ?? ''),
        'instagram' => (string) ($u['instagram'] ?? ''),
        'x'         => (string) ($u['x_handle'] ?? ''),
        'facebook'  => (string) ($u['facebook'] ?? ''),
        'linkedin'  => (string) ($u['linkedin'] ?? ''),
        'website'   => (string) ($u['website'] ?? ''),
        'createdAt' => $u['created_at'] ?? null,
    ];
}

/** Creates a fresh random token, stores its hash, returns the raw token. */
function issue_token(int $userId): string
{
    $token   = bin2hex(random_bytes(32));
    $hash    = hash('sha256', $token);
    $expires = date('Y-m-d H:i:s', time() + TOKEN_TTL_DAYS * 86400);

    $st = db()->prepare('INSERT INTO auth_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)');
    $st->execute([$userId, $hash, $expires]);

    return $token;
}

/** Basic field sanitation. */
function clean_str($v, int $max = 190): string
{
    $s = trim((string) ($v ?? ''));
    if (function_exists('mb_substr')) {
        $s = mb_substr($s, 0, $max);
    } else {
        $s = substr($s, 0, $max);
    }
    return $s;
}
