<?php

namespace Modules\Admin\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SuperAdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! method_exists($user, 'isSuperAdmin') || ! $user->isSuperAdmin()) {
            return response()->json([
                'status'  => false,
                'message' => 'Forbidden. SuperAdmin access required.'
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}