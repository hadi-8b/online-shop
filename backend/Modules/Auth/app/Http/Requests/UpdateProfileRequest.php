<?php

namespace Modules\Auth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $userId = $this->user()->id;
        
        return [
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $userId],
            'phone' => ['sometimes', 'string', 'regex:/^09\d{9}$/', 'unique:users,phone,' . $userId],
            'address' => ['sometimes', 'string'],
            'card_number' => ['sometimes', 'string', 'size:16'],
            'profile_picture' => ['sometimes', 'image', 'max:2048'] // 2MB max
        ];
    }
}