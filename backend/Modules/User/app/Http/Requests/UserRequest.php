<?php

namespace Modules\User\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        
        $userId = $this->user ? $this->user->id : Auth::id();
        
        return [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'nullable|sometimes|email|unique:users,email,' . $userId,
            'phone' => 'sometimes|string|unique:users,phone,' . $userId,
            'address' => 'nullable|sometimes|string',
            'profile_picture' => 'nullable|sometimes|image|max:2048', // 2MB max
            'card_number' => 'nullable|sometimes|string|size:16'
        ];
    }
}