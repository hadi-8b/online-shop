<?php

return [
    'admin-public' => [
        'attempts' => 20,
        'decay_minutes' => 1,
    ],
    'admin-api' => [
        'attempts' => 60,
        'decay_minutes' => 1,
    ],
];