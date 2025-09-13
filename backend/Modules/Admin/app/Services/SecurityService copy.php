<?php

namespace Modules\Admin\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SecurityService
{
    public function setSecureCookies(array $tokens, int $minutes = 60): void
    {
        Cookie::queue('admin_access_token', $tokens['access_token'], $minutes, null, null, true, true);
        Cookie::queue('admin_refresh_token', $tokens['refresh_token'], $minutes * 24, null, null, true, true);
    }

    public function clearSecureCookies(): void
    {
        Cookie::queue(Cookie::forget('admin_access_token'));
        Cookie::queue(Cookie::forget('admin_refresh_token'));
    }

    public function logSecurityEvent(string $event, array $data = []): void
    {
        Log::channel('security')->info($event, array_merge($data, [
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now()->toDateTimeString(),
        ]));
    }

    public function sanitizeInput(mixed $input): mixed
    {
        return match (true) {
            is_array($input) => array_map([$this, 'sanitizeInput'], $input),
            is_string($input) => htmlspecialchars(strip_tags($input), ENT_QUOTES, 'UTF-8'),
            default => $input,
        };
    }
}