<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'phone',
        'password',
        'address',
        'profile_picture',
        'card_number',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

}