<?php

use Illuminate\Support\Facades\Route;
use Modules\Payment\Http\Controllers\PaymentController;

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
Route::middleware('auth:sanctum')->prefix('payment')->group(function () {
    Route::get('/pay', [PaymentController::class, 'pay']); // شروع پرداخت
    Route::get('/callback', [PaymentController::class, 'callback']); // بازگشت از درگاه
});

// Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
//     Route::apiResource('payment', PaymentController::class)->names('payment');
// });
