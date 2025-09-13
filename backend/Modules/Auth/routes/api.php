<?php

use Illuminate\Support\Facades\Route;
use Modules\Auth\Http\Controllers\AuthController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/*
 *--------------------------------------------------------------------------
 * API Routes
 *--------------------------------------------------------------------------
 *
 * Here is where you can register API routes for your application. These
 * routes are loaded by the RouteServiceProvider within a group which
 * is assigned the "api" middleware group. Enjoy building your API!
 *
*/

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('verify', [AuthController::class, 'verify']);
    Route::post('resend-code', [AuthController::class, 'resendCode']);
    Route::post('login', [AuthController::class, 'login']);
});

Route::middleware('auth:web')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
});

// سشن فعلی را برگردان (لاگین لازم ندارد)
Route::get('debug/session', function (Request $r) {
    return response()->json([
        'sid' => $r->session()->getId(),
        'user_id' => optional(Auth::user())->id,
    ]);
});

// لاگین اجباری (برای تست سشن)
Route::post('debug/force-login', function (Request $r) {
    $user = \Modules\User\Models\User::query()->first(); // یا find(1)
    Auth::guard('web')->login($user);
    $r->session()->regenerate();
    return response()->json(['ok' => true, 'user_id' => $user->id]);
});

// فقط اگر سشن معتبر باشد
Route::middleware('auth:web')->get('debug/me', function (Request $r) {
    return response()->json([
        'ok' => true,
        'sid' => $r->session()->getId(),
        'user_id' => Auth::id(),
    ]);
});

// Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
//     Route::apiResource('auth', AuthController::class)->names('role');
// });