<?php

return [
    'name' => 'Admin',
    // token expiration in minutes
    'token_expiration' => env('ADMIN_TOKEN_EXPIRATION', 15), // minutes for access token
    'refresh_token_expiration' => env('ADMIN_REFRESH_TOKEN_EXPIRATION', 1440), // minutes for refresh token (default 24h)
];
