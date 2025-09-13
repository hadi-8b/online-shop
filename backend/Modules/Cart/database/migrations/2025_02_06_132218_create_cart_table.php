<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id(); // کلید اصلی
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // ارتباط با جدول users
            $table->decimal('total_price', 10, 2)->default(0); // مجموع قیمت آیتم‌های سبد خرید
            $table->timestamps(); // زمان ایجاد و به‌روزرسانی
        });
    }

    /**
     * بازگردانی مهاجرت (حذف جدول carts).
     */
    public function down()
    {
        Schema::dropIfExists('carts');
    }
};
