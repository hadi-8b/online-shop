<?php

namespace Modules\Auth\Services;

use Modules\User\Models\User;
use Modules\Auth\Notifications\VerificationCodeNotification;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthService
{
    public function register(array $data)
    {
        $user = User::create([
            'phone'      => $data['phone'],
            'email'      => $data['email'] ?? null,
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'password'   => Hash::make(Str::random(16))
        ]);

        $code = $user->generateVerificationCode();
        $user->notify(new VerificationCodeNotification($code, 'phone'));

        return [
            'user_id'         => $user->id,
            'next_resend_time'=> Carbon::now()->addMinutes(config('auth.verification.resend_delay'))
        ];
    }

    public function login($phone)
    {
        $type = filter_var($phone, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        $user = User::where($type, $phone)->firstOrFail();

        $code = $user->generateVerificationCode();
        $user->notify(new VerificationCodeNotification($code, $type));

        return [
            'user_id'         => $user->id,
            'type'            => $type,
            'next_resend_time'=> Carbon::now()->addMinutes(config('auth.verification.resend_delay')),
        ];
    }

    public function verify($phone, $code)
    {
        $type = filter_var($phone, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::where($type, $phone)->firstOrFail();

        if (!$user->verifyCode($code)) {
            throw new \Exception('Invalid verification code');
        }

        if ($type === 'phone') {
            $user->markPhoneAsVerified();
        } else {
            $user->markEmailAsVerified();
        }

        $user->activeCode()->delete();

        // 🔑 اینجا سشن ساخته میشه
        Auth::guard('web')->login($user);
        request()->session()->regenerate(); // جلوگیری از Session Fixation

        return [
            'user' => $user
        ];
    }

    public function resendCode($phone)
    {
        $type = filter_var($phone, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::where($type, $phone)->firstOrFail();

        if ($user->activeCode && $user->activeCode->created_at->diffInMinutes(now()) < config('auth.verification.resend_delay')) {
            throw new \Exception('Please wait before requesting new code');
        }

        $user->activeCode()->delete();
        $code = $user->generateVerificationCode();
        $user->notify(new VerificationCodeNotification($code, $type));

        return [
            'next_resend_time'=> Carbon::now()->addMinutes(config('auth.verification.resend_delay'))
        ];
    }
}
