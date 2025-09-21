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
        $userId = $this->user()?->id ?? Auth::id();
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'first_name'      => ($isUpdate ? 'sometimes|required' : 'required') . '|string|min:2|max:255',
            'last_name'       => ($isUpdate ? 'sometimes|required' : 'required') . '|string|min:2|max:255',
            'phone'           => ($isUpdate ? 'sometimes|required' : 'required') . '|regex:/^09\d{9}$/|unique:users,phone,' . $userId,
            'email'           => 'nullable|email|max:255|unique:users,email,' . $userId,
            'address'         => 'nullable|string|max:500',   // اختیاری
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'card_number'     => 'nullable|digits:16',        // اختیاری
        ];
    }
}
