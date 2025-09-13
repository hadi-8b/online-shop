<?php

namespace Modules\Category\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
    ];

    // رابطه با دسته‌بندی والد
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // رابطه با زیرمجموعه‌های دسته‌بندی
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public static function newFactory()
    {
        return \Modules\Category\Database\Factories\CategoryFactory::new();
    }
}
