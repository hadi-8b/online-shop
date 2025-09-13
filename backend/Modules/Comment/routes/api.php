<?php

use Illuminate\Support\Facades\Route;
use Modules\Comment\Http\Controllers\CommentController;

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

Route::middleware('auth:sanctum')->prefix('comments')->group(function () {
    Route::post('/', [CommentController::class, 'store']); // ارسال نظر
    Route::get('/product/{productId}', [CommentController::class, 'getCommentsByProduct']); // دریافت نظرات محصول
    Route::put('/{id}/approve', [CommentController::class, 'approve'])->middleware('admin'); // تأیید نظر (فقط ادمین)
    Route::delete('/{id}', [CommentController::class, 'destroy'])->middleware('admin'); // حذف نظر (فقط ادمین)
});

// Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
//     Route::apiResource('comment', CommentController::class)->names('comment');
// });
