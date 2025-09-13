<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id(); // شناسه اصلی
            $table->string('name'); // نام دسته‌بندی
            $table->string('slug')->unique(); // اسلاگ (برای لینک‌ها)
            $table->unsignedBigInteger('parent_id')->nullable(); // دسته‌بندی والد (برای دسته‌بندی‌های تو در تو)
            $table->foreign('parent_id')->references('id')->on('categories')->onDelete('cascade');
            $table->timestamps(); // زمان ایجاد و بروزرسانی
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};

