<?php

namespace Modules\Admin\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Modules\Admin\Models\Admin;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user || ! $user instanceof Admin) {
            return response()->json(['status' => false, 'message' => 'Unauthenticated.'], Response::HTTP_UNAUTHORIZED);
        }

        // دسترسی حداقلی: یا سوپرادمین یا یکی از نقش‌های مدیریتی
        if (! $user->isSuperAdmin() && ! $user->hasRole(['admin','super_admin'])) {
            return response()->json(['status' => false, 'message' => 'Access denied.'], Response::HTTP_FORBIDDEN);
        }

        // چک اجاره‌داری (tenant) اختیاری
        if ($user->tenant_id && $request->header('X-Tenant-Id')) {
            if ((string) $user->tenant_id !== (string) $request->header('X-Tenant-Id')) {
                return response()->json(['status' => false, 'message' => 'Tenant mismatch.'], Response::HTTP_FORBIDDEN);
            }
        }

        return $next($request);
    }
}
