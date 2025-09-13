<?php

return [
    'name' => 'Admin',

    'token_expiration' => env('ADMIN_TOKEN_EXPIRATION', 60), // minutes
    'refresh_token_expiration' => env('ADMIN_REFRESH_TOKEN_EXPIRATION', 1440), // 24 hours
];

