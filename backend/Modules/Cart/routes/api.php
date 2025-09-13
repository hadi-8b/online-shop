<?php

use Illuminate\Support\Facades\Route;
use Modules\Cart\Http\Controllers\CartController;

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
Route::prefix('v1')->group(function () {
    // Public cart routes
    Route::get('cart', [CartController::class, 'index']);
    Route::post('cart', [CartController::class, 'add']);
    Route::put('cart/{cartItem}', [CartController::class, 'update']);
    Route::delete('cart/{cartItem}', [CartController::class, 'remove']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('cart', [CartController::class, 'index']);
    Route::post('cart', [CartController::class, 'add']);
    Route::delete('cart/{id}', [CartController::class, 'remove']);
    Route::put('cart/{id}', [CartController::class, 'update']);
});

// Route::middleware('auth:sanctum')->group(function () {
//     Route::resource('cart', CartController::class);
// });


