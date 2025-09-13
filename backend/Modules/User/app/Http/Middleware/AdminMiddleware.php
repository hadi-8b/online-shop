<?php

namespace Modules\User\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::guard('api')->check()) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Please login first.'
            ], Response::HTTP_UNAUTHORIZED);
        }

        if (!Auth::guard('api')->user()->is_admin) {
            return response()->json([
                'status' => false,
                'message' => 'Forbidden. Admin access required.'
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}