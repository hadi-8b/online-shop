<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use Modules\Auth\Http\Middleware\Authenticate as ModuleAuthenticate;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web([
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
        ]);

        $middleware->api([
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \App\Http\Middleware\Cors::class, // اضافه کردن CORS middleware
        ]);
       
        $middleware->redirectGuestsTo(function ($request) {
            // اگر درخواست JSON می‌خواهد یا مسیر API است، ریدایرکت نکن (برگرد null تا 401 بده)
            if ($request->expectsJson() || $request->is('api/*')) {
                return null;
            }
            // برای صفحات وب (در صورت نیاز) می‌تونی مسیر لاگین وب رو بدی
            return '/auth/login';
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
