<?php
/**
 * POST /login.php
 * Body (JSON): { identifier, password }   — identifier is email OR phone
 * Returns:     { ok: true, token, user }
 */
declare(strict_types=1);
require __DIR__ . '/config.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(['ok' => false, 'error' => 'Use POST.'], 405);
}

$in         = read_input();
$identifier = strtolower(clean_str($in['identifier'] ?? '', 190));
$password   = (string) ($in['password'] ?? '');

if ($identifier === '' || $password === '') {
    json_out(['ok' => false, 'error' => 'Enter your email (or phone) and password.'], 422);
}

$pdo = db();

/* Match email exactly; match phone even if spacing/dashes differ. */
$digits = preg_replace('/\D/', '', $identifier) ?? '';
$st  = $pdo->prepare(
    "SELECT * FROM users
      WHERE email = ?
         OR phone = ?
         OR REPLACE(REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '(', ''), ')', '') = ?
      LIMIT 1"
);
$st->execute([$identifier, $identifier, $digits !== '' ? $digits : $identifier]);
$user = $st->fetch();

/* Same error for unknown account and wrong password — no user enumeration. */
if (!$user || !password_verify($password, (string) $user['password_hash'])) {
    json_out(['ok' => false, 'error' => 'Incorrect email/phone or password.'], 401);
}

/* Rehash if PHP upgraded its default algorithm since signup. */
if (password_needs_rehash((string) $user['password_hash'], PASSWORD_DEFAULT)) {
    $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')
        ->execute([password_hash($password, PASSWORD_DEFAULT), $user['id']]);
}

/* Drop stale tokens for this user, then issue a fresh one. */
$pdo->prepare('DELETE FROM auth_tokens WHERE user_id = ? AND expires_at < NOW()')
    ->execute([$user['id']]);

json_out([
    'ok'    => true,
    'token' => issue_token((int) $user['id']),
    'user'  => public_user($user),
]);
