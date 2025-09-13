<?php

namespace Modules\User\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Modules\Auth\Models\VerificationCode;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public function routeNotificationForGhasedak()
    {
        return $this->phone;
    }

    protected $fillable = [
        'first_name',
        'last_name',
        'phone',
        'email',
        'password',
        'address',
        'profile_picture',
        'card_number',
        'is_admin',
        'phone_verified_at',
        'email_verified_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_admin' => 'boolean',
        'phone_verified_at' => 'datetime',
        'email_verified_at' => 'datetime'
    ];

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function verificationCodes()
    {
        return $this->hasMany(VerificationCode::class);
    }

    public function activeCode()
    {
        return $this->hasOne(VerificationCode::class)
            ->where('expires_at', '>', now())
            ->latest();
    }

    public function generateVerificationCode()
    {
        $code = random_int(100000, 999999);
        
        $this->verificationCodes()->create([
            'code' => $code,
            'expires_at' => now()->addMinutes(config('auth.verification.expire_time', 2))
        ]);
        return $code;
    }

    public function verifyCode($code)
    {
        $verificationCode = $this->activeCode;

        if (!$verificationCode) {
            return false;
        }

        return $verificationCode->code == $code;
    }

    public function markphoneAsVerified()
    {
        return $this->forceFill([
            'phone_verified_at' => $this->freshTimestamp(),
        ])->save();
    }

    public function markEmailAsVerified()
    {
        return $this->forceFill([
            'email_verified_at' => $this->freshTimestamp(),
        ])->save();
    }

    public function routeNotificationForGhasedakSms()
    {
        return $this->phone;
    }
}