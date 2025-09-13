<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Modules\User\Models\User;
use Modules\Order\Models\Order;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            // $table->unsignedBigInteger('user_id'); // شناسه کاربر
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Order::class);
            // $table->unsignedBigInteger('order_id'); // شناسه سفارش
            $table->string('transaction_id')->nullable(); // شماره تراکنش
            $table->decimal('amount', 10, 2); // مبلغ پرداخت‌شده
            $table->string('status')->default('pending'); // وضعیت پرداخت (pending, paid, failed)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
