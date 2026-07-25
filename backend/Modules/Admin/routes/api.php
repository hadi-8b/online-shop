<?php

use Illuminate\Support\Facades\Route;
use Modules\Admin\Http\Controllers\AdminAuthController;
use Modules\Admin\Http\Controllers\AdminController;
use Modules\Admin\Http\Controllers\AdminProductController;
use Modules\Admin\Http\Controllers\AdminUserController;
use Modules\Admin\Http\Middleware\AdminMiddleware;
use Modules\Category\Http\Controllers\CategoryController;

Route::prefix('v1/admin')->group(function () {
    // Public
    Route::post('login',   [AdminAuthController::class, 'login'])->name('admin.login');
    Route::post('refresh', [AdminAuthController::class, 'refresh'])->name('admin.refresh');

    // Protected
    Route::middleware(['auth:admin', 'admin.rate_limiter', AdminMiddleware::class])->group(function () {

        Route::post('logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
        Route::get('me',     [AdminAuthController::class, 'me'])->name('admin.me');

        // Admins
        Route::apiResource('admins', AdminController::class)->names('admin.admins');

         // Role attach/detach (فقط سوپرادمین)
        Route::post('admins/{admin}/roles/attach', [AdminController::class, 'attachRole'])
              ->middleware('can:manage-roles');
        Route::post('admins/{admin}/roles/detach', [AdminController::class, 'detachRole'])
              ->middleware('can:manage-roles');

        // Users
        Route::apiResource('users', AdminUserController::class)->except(['edit'])->names('admin.users');

        // Categories & Products
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('products', AdminProductController::class);
        Route::patch('products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus'])->name('admin.products.toggle-status');
        Route::patch('products/{product}/set-primary-image/{image}', [AdminProductController::class, 'setPrimaryImage'])->name('admin.products.set-primary-image');
    });
});
