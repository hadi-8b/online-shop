<?php

namespace Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

// use Modules\Auth\Database\Factories\AuthFactory;

class auth extends Model
{
    use HasFactory;
    use HasApiTokens;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'phone',
        'password',
        'status'
    ];
    // protected static function newFactory(): AuthFactory
    // {
    //     // return AuthFactory::new();
    // }
}
