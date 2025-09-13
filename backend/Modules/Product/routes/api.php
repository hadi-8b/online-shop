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
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::get('/search', [ProductController::class, 'search']);
});


Route::middleware('auth:sanctum')->prefix('products')->group(function () {
    Route::post('/', [ProductController::class, 'store']); // ایجاد محصول جدید
    Route::put('/{id}', [ProductController::class, 'update']); // ویرایش محصول
    Route::delete('/{id}', [ProductController::class, 'destroy']); // حذف محصول
    Route::post('products/{product}/primary-image/{image}', [ProductController::class,'setPrimaryImage']);
});


// Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
//     Route::apiResource('product', ProductController::class)->names('product');
// });
