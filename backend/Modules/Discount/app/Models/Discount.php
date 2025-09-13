<?php

namespace Modules\Discount\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Discount\Database\Factories\DiscountFactory;

class Discount extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): DiscountFactory
    // {
    //     // return DiscountFactory::new();
    // }
}
