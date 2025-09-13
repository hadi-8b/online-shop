<?php

namespace Modules\Cart\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Product\Models\Product;
use Modules\User\Models\User;

// use Modules\Cart\Database\Factories\CartFactory;

class Cart extends Model
{ use HasFactory;

    /**
     * جدول مرتبط با این مدل.
     *
     * @var string
     */
    protected $table = 'carts';

    /**
     * فیلدهای قابل پر کردن (Mass Assignable).
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'price',
        'total_price',
    ];

    /**
     * رابطه با مدل User (یک کاربر می‌تواند چندین سبد خرید داشته باشد).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * رابطه با مدل Product (هر آیتم سبد خرید به یک محصول مرتبط است).
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * محاسبه قیمت کل آیتم (price * quantity).
     *
     * @return float
     */
    public function getTotalPriceAttribute()
    {
        return $this->price * $this->quantity;
    }
}
