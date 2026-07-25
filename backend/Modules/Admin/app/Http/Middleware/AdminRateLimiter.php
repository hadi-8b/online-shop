<?php

namespace Modules\Admin\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AdminRateLimiter
{
    public function __construct(protected RateLimiter $limiter) {}

    public function handle(Request $request, Closure $next, int $maxAttempts = 60)
    {
        $ip = $request->ip();
        $tenant = $request->user()?->tenant_id ?? $request->header('X-Tenant-Id') ?? 'global';
        $userId = $request->user()?->id ?? 'guest';

        $key = Str::lower("admin:{$tenant}:{$userId}:{$ip}");

        if ($this->limiter->tooManyAttempts($key, $maxAttempts)) {
            return response()->json([
                'status' => false,
                'message' => 'Too many attempts. Please try again later.',
            ], Response::HTTP_TOO_MANY_REQUESTS);
        }
        $this->limiter->hit($key);
        $response = $next($request);

        return $response->withHeaders([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => $this->limiter->remaining($key, $maxAttempts),
        ]);
    }
}
