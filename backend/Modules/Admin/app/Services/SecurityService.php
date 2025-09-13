<?php

namespace Modules\Admin\Services;

use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;

class SecurityService
{
    public function setSecureCookies(array $tokens): void
    {
        $config = config('sanctum');
        
        Cookie::queue(
            'admin_access_token',
            $tokens['access_token'],
            $config['expiration'],
            '/',
            null,
            true,
            true,
            false,
            'strict'
        );
    }

    public function clearSecureCookies(): void
    {
        Cookie::queue(Cookie::forget('admin_access_token'));
    }

    public function sanitizeInput(mixed $input): mixed
    {
        return match (true) {
            is_array($input) => array_map([$this, 'sanitizeInput'], $input),
            is_string($input) => htmlspecialchars(strip_tags($input), ENT_QUOTES, 'UTF-8'),
            default => $input,
        };
    }

    public function logSecurityEvent(string $event, array $data = []): void
    {
        Log::channel('security')->info($event, [
            ...$data,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now()->toDateTimeString(),
        ]);
    }
}