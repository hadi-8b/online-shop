<?php

use Illuminate\Support\Facades\Route;
use Modules\Product\Http\Controllers\ProductController;

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


Route::prefix('products')->group(function () {
    // ثابت‌ها اول — قبل از {id}
    Route::get('/', [ProductController::class, 'index']);           // کاتالوگ + فیلتر
    Route::get('/home', [ProductController::class, 'home']);       // صفحه اصلی
    Route::get('/search', [ProductController::class, 'search']);   // اگر جدا می‌خواهید

    // پارامتری آخر
    Route::get('/{id}', [ProductController::class, 'show']);
});

Route::middleware('auth:sanctum')->prefix('products')->group(function () {
    Route::post('/', [ProductController::class, 'store']);
    Route::put('/{id}', [ProductController::class, 'update']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);
    Route::post('{product}/primary-image/{image}', [ProductController::class, 'setPrimaryImage']);
});


// Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
//     Route::apiResource('product', ProductController::class)->names('product');
// });
