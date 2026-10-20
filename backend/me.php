<?php
/**
 * GET /me.php
 * Header: Authorization: Bearer <token>
 * Returns: { ok: true, user }
 */
declare(strict_types=1);
require __DIR__ . '/config.php';

$user = require_auth();

json_out(['ok' => true, 'user' => public_user($user)]);
