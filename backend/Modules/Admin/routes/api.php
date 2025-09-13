<?php

use Illuminate\Support\Facades\Route;
use Modules\Admin\Http\Controllers\AdminAuthController;
use Modules\Admin\Http\Controllers\AdminController;
use Modules\Admin\Http\Controllers\AdminProductController;
use Modules\Admin\Http\Controllers\AdminUserController;
use Modules\Category\Http\Controllers\CategoryController;
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

// Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
//     // مدیریت کاربران
//     Route::get('/users', [UserController::class, 'index']); // لیست کاربران
//     Route::post('/users', [UserController::class, 'store']); // ایجاد کاربر جدید
//     Route::put('/users/{id}', [UserController::class, 'update']); // ویرایش کاربر
//     Route::delete('/users/{id}', [UserController::class, 'destroy']); // حذف کاربر

//     // مدیریت محصولات
//     Route::get('/products', [ProductController::class, 'index']); // لیست محصولات
//     Route::post('/products', [ProductController::class, 'store']); // ایجاد محصول جدید
//     Route::put('/products/{id}', [ProductController::class, 'update']); // ویرایش محصول
//     Route::delete('/products/{id}', [ProductController::class, 'destroy']); // حذف محصول
// });

// Route::prefix('v1/admin')
//     // ->middleware(['force.https'])  // اضافه کردن middleware برای HTTPS
//     ->group(function () {
//         // Public routes
//         Route::post('login', [AdminAuthController::class, 'login']);

//         // Protected routes
//         Route::middleware(['auth:sanctum', 'abilities:admin'])->group(function () {
//             Route::post('logout', [AdminAuthController::class, 'logout']);
//             Route::post('refresh', [AdminAuthController::class, 'refresh']);
//             Route::get('me', [AdminAuthController::class, 'me']);

//             Route::apiResource('users', AdminUserController::class);
//             Route::apiResource('admins', AdminController::class);
//             Route::apiResource('products', ProductController::class);
//         });
//     });

// Route::prefix('v1/admin')
//     ->middleware('api')
//     ->group(function () {
//         // Public routes
//         Route::post('login', [AdminAuthController::class, 'login']);

//         // Protected routes
//         Route::middleware(['auth:sanctum'])->group(function () {
//             Route::post('logout', [AdminAuthController::class, 'logout']);
//             Route::post('refresh', [AdminAuthController::class, 'refresh']);
//             Route::get('me', [AdminAuthController::class, 'me']);

//             Route::apiResource('users', AdminUserController::class);
//             Route::apiResource('admins', AdminController::class);
//             Route::apiResource('products', ProductController::class);
//         });
//     });

Route::prefix('v1/admin')->group(function () {
    // Public routes
    Route::post('login', [AdminAuthController::class, 'login'])
        ->name('admin.login');

    // Protected routes
    // Route::middleware(['auth:sanctum', 'abilities:admin'])->group(function () {
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('logout', [AdminAuthController::class, 'logout'])
            ->name('admin.logout');
        Route::get('me', [AdminAuthController::class, 'me'])
            ->name('admin.me');

        Route::apiResource('admins', AdminController::class)->names('admin.admins');
        Route::apiResource('users', AdminUserController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('products', AdminProductController::class);

        // مدیریت خاص محصولات
        Route::patch('products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus'])
            ->name('admin.products.toggle-status');
        Route::patch('products/{product}/set-primary-image/{image}', [AdminProductController::class, 'setPrimaryImage'])
            ->name('admin.products.set-primary-image');
    });
});

