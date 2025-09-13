<?php

namespace Modules\Admin\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'mobile',
        'email',
        'password',
        'address',
        'profile_picture',
        'is_super_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_super_admin' => 'boolean',
    ];

    /**
     * چک می‌کند که آیا کاربر Super Admin است
     */
    public function isSuperAdmin(): bool
    {
        return $this->is_super_admin === true;
    }

    /**
     * چک می‌کند که آیا کاربر Admin معمولی است
     */
    public function isAdmin(): bool
    {
        return $this->is_super_admin === false;
    }

    /**
     * نام کامل ادمین را برمی‌گرداند
     */
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
}