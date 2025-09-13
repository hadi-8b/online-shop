<?php


namespace Modules\Admin\Http\Middleware;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function __invoke(Request $request): Response|null
    {
        if (!$request->user() || !$request->user()->hasRole('admin')) {
            return response()->json([
                'status' => false,
                'message' => 'Access denied.',
            ], Response::HTTP_FORBIDDEN);
        }

        return null;
    }
}

// namespace Modules\Admin\Http\Middleware;

// use Closure;
// use Illuminate\Http\Request;

// class AdminMiddleware
// {
//     public function handle(Request $request, Closure $next)
//     {
//         // بررسی نقش ادمین
//         if (auth()->check() && auth()->user()->is_admin) {
//             return $next($request);
//         }

//         return response()->json(['message' => 'Access denied.'], 403);
//     }
// }