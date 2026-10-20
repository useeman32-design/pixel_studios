<?php
/**
 * POST /update_profile.php
 * Header: Authorization: Bearer <token>
 * Body (JSON): any of { name, email, phone, about, instagram, x, facebook, linkedin, website }
 * Returns:     { ok: true, user }
 */
declare(strict_types=1);
require __DIR__ . '/config.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(['ok' => false, 'error' => 'Use POST.'], 405);
}

$current = require_auth();
$in      = read_input();
$pdo     = db();

$fields = [
    'name'      => ['col' => 'name',      'max' => 120],
    'email'     => ['col' => 'email',     'max' => 190],
    'phone'     => ['col' => 'phone',     'max' => 40],
    'about'     => ['col' => 'about',     'max' => 500],
    'instagram' => ['col' => 'instagram', 'max' => 190],
    'x'         => ['col' => 'x_handle',  'max' => 190],
    'facebook'  => ['col' => 'facebook',  'max' => 190],
    'linkedin'  => ['col' => 'linkedin',  'max' => 190],
    'website'   => ['col' => 'website',   'max' => 190],
];

$sets   = [];
$values = [];

foreach ($fields as $key => $meta) {
    if (!array_key_exists($key, $in)) {
        continue;
    }
    $value = clean_str($in[$key], $meta['max']);

    if ($key === 'email') {
        $value = strtolower($value);
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            json_out(['ok' => false, 'error' => 'Please enter a valid email address.'], 422);
        }
        $st = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1');
        $st->execute([$value, $current['id']]);
        if ($st->fetch()) {
            json_out(['ok' => false, 'error' => 'That email is already used by another account.'], 409);
        }
    }
    if ($key === 'name' && mb_strlen($value) < 2) {
        json_out(['ok' => false, 'error' => 'Please enter your full name.'], 422);
    }
    if ($key === 'phone' && strlen(preg_replace('/\D/', '', $value) ?? '') < 7) {
        json_out(['ok' => false, 'error' => 'Please enter a valid phone number.'], 422);
    }

    $sets[]   = $meta['col'] . ' = ?';
    $values[] = $value;
}

if (!$sets) {
    json_out(['ok' => false, 'error' => 'Nothing to update.'], 422);
}

$values[] = (int) $current['id'];
$sql      = 'UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?';
$pdo->prepare($sql)->execute($values);

$st = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
$st->execute([(int) $current['id']]);

json_out(['ok' => true, 'user' => public_user($st->fetch())]);
