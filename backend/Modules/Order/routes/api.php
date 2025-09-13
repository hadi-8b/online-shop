<?php

use Illuminate\Support\Facades\Route;
use Modules\Order\Http\Controllers\OrderController;

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

Route::middleware('auth:sanctum')->prefix('orders')->group(function () {
    Route::post('/', [OrderController::class, 'store']); // ایجاد سفارش
    Route::get('/', [OrderController::class, 'index'])->middleware('admin'); // لیست سفارشات (فقط ادمین)
    Route::put('/{id}/status', [OrderController::class, 'updateStatus'])->middleware('admin'); // تغییر وضعیت سفارش (فقط ادمین)
});

// Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
//     Route::apiResource('order', OrderController::class)->names('order');
// });
