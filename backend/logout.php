<?php
/**
 * POST /logout.php
 * Header: Authorization: Bearer <token>
 * Returns: { ok: true }
 */
declare(strict_types=1);
require __DIR__ . '/config.php';

$user  = require_auth();
$token = bearer_token();

db()->prepare('DELETE FROM auth_tokens WHERE token_hash = ?')
    ->execute([hash('sha256', $token)]);

json_out(['ok' => true]);
