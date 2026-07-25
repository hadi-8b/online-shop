<?php

namespace Modules\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'required|string|unique:users,phone',
            'email' => 'nullable|email|unique:users,email',
            'address' => 'nullable|string',
            'profile_picture' => 'nullable|image|max:2048',
            'card_number' => 'nullable|string',
            'password' => 'nullable|string|min:8',
            'is_admin' => 'boolean',
        ];
    }
}
