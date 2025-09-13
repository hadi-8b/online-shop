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
            'mobile' => 'required|string|unique:users,mobile',
            'email' => 'nullable|email|unique:users,email',
            'address' => 'nullable|string',
            'profile_picture' => 'nullable|image|max:2048', // 2MB Max
            'card_number' => 'nullable|string',
            'password' => 'nullable|string|min:6',
            'is_admin' => 'boolean',
        ];
    }
}
