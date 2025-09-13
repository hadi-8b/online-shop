<?php

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;
use Modules\Product\Http\Controllers\ProductController;

// routes/api.php
Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('api/admin')  // یا هر پیشوند دلخواه دیگر
    ->group(function () {

        // مدیریت محصولات
        Route::apiResource('products', controller: ProductController::class);
});
