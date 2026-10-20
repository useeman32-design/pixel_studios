<?php
/**
 * POST /register.php
 * Body (JSON): { name, email, phone, password }
 * Returns:     { ok: true, token, user }
 */
declare(strict_types=1);
require __DIR__ . '/config.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(['ok' => false, 'error' => 'Use POST.'], 405);
}

$in       = read_input();
$name     = clean_str($in['name'] ?? '', 120);
$email    = strtolower(clean_str($in['email'] ?? '', 190));
$phone    = clean_str($in['phone'] ?? '', 40);
$password = (string) ($in['password'] ?? '');

/* ------------------------------ validation ------------------------------ */
if (mb_strlen($name) < 2) {
    json_out(['ok' => false, 'error' => 'Please enter your full name.'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(['ok' => false, 'error' => 'Please enter a valid email address.'], 422);
}
if (strlen(preg_replace('/\D/', '', $phone) ?? '') < 7) {
    json_out(['ok' => false, 'error' => 'Please enter a valid phone number.'], 422);
}
if (strlen($password) < 6) {
    json_out(['ok' => false, 'error' => 'Password must be at least 6 characters.'], 422);
}

$pdo = db();

/* ------------------------- uniqueness (email/phone) ---------------------- */
$st = $pdo->prepare('SELECT id, email, phone FROM users WHERE email = ? OR phone = ? LIMIT 1');
$st->execute([$email, $phone]);
if ($existing = $st->fetch()) {
    json_out([
        'ok'    => false,
        'error' => $existing['email'] === $email
            ? 'An account with this email already exists. Try signing in.'
            : 'An account with this phone number already exists. Try signing in.',
    ], 409);
}

/* -------------------------------- create -------------------------------- */
$hash = password_hash($password, PASSWORD_DEFAULT);
$st   = $pdo->prepare(
    'INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)'
);
$st->execute([$name, $email, $phone, $hash]);
$userId = (int) $pdo->lastInsertId();

$st = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
$st->execute([$userId]);
$user = $st->fetch();

json_out([
    'ok'    => true,
    'token' => issue_token($userId),
    'user'  => public_user($user),
], 201);
