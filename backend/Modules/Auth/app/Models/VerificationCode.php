<?php

namespace Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;

class VerificationCode extends Model
{
    protected $fillable = ['code', 'type', 'expires_at'];
    
    protected $dates = ['expires_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired()
    {
        return $this->expires_at->isPast();
    }
}