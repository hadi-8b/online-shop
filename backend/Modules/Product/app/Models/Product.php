<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'price',
        'stock',
        'category_id',
        'is_active',
    ];

    public function category()
    {
        return $this->belongsTo('Modules\Category\Models\Category');
    }
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public static function newFactory()
{
    return \Modules\Product\Database\Factories\ProductFactory::new();
}
}
