<?php

namespace Modules\Auth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function rules()
    {
        return [
            'phone' => ['required', 'string', function ($attribute, $value, $fail) {
                if (!filter_var($value, FILTER_VALIDATE_EMAIL) && !preg_match('/^09\d{9}$/', $value)) {
                    $fail('The '.$attribute.' must be a valid email or phone number.');
                }
            }]
        ];
    }
}