<?php

namespace Modules\Admin\Services;

use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;

class SecurityService
{
    /**
     * Set secure cookies for access and refresh tokens.
     * $cookies is an associative array:
     * [
     *   'access_token' => ['value' => '...', 'minutes' => 15],
     *   'refresh_token' => ['value' => '...', 'minutes' => 1440],
     * ]
     */
    public function setSecureCookies(array $cookies): void
    {
        $domain = config('session.domain', null);
        $sameSite = config('session.same_site', 'Strict');

        if (isset($cookies['access_token'])) {
            $cfg = $cookies['access_token'];
            Cookie::queue(
                'admin_access_token',
                $cfg['value'],
                $cfg['minutes'],
                '/',
                $domain,
                true,   // secure
                true,   // httpOnly
                false,
                $sameSite
            );
        }

        if (isset($cookies['refresh_token'])) {
            $cfg = $cookies['refresh_token'];
            Cookie::queue(
                'admin_refresh_token',
                $cfg['value'],
                $cfg['minutes'],
                '/',
                $domain,
                true,
                true,
                false,
                $sameSite
            );
        }
    }

    public function clearSecureCookies(): void
    {
        Cookie::queue(Cookie::forget('admin_access_token'));
        Cookie::queue(Cookie::forget('admin_refresh_token'));
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
