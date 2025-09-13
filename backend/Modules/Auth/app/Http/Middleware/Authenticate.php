<?php

namespace Modules\Auth\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
     protected function redirectTo(Request $request): ?string
    {
        // برای API، به جای ریدایرکت، null بده تا 401 برگرده
        return null;
    }
    /**
     * Handle an incoming request.
     */
    // public function handle(Request $request, Closure $next)
    // {
    //     return $next($request);
    // }
}
