<?php

namespace Modules\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = Auth::user();
        $userToUpdate = $this->route('user');
        if (! $user) {
            return false;
        }
        if (Gate::allows('update-user', $userToUpdate)) {
            return true;
        }
        return $user->id === $userToUpdate;
    }

    public function rules(): array
    {
        $id = $this->route('user');
        return [
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'string|unique:users,phone,' . $id,
            'email' => 'nullable|email|unique:users,email,' . $id,
            'address' => 'nullable|string',
            'profile_picture' => 'nullable|image|max:2048',
            'card_number' => 'nullable|string',
            'password' => 'nullable|string|min:8',
            'is_admin' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'phone.unique' => 'این شماره موبایل قبلاً ثبت شده است.',
            'email.unique' => 'این ایمیل قبلاً ثبت شده است.',
            'profile_picture.max' => 'حجم تصویر نباید بیشتر از 2 مگابایت باشد.',
            'password.min' => 'رمز عبور باید حداقل 8 کاراکتر باشد.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->password === '') {
            $this->request->remove('password');
        }
        $nullableFields = ['first_name', 'last_name', 'email', 'address', 'card_number'];
        foreach ($nullableFields as $field) {
            if ($this->$field === '') {
                $this->request->set($field, null);
            }
        }
    }
}
