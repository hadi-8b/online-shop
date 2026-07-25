<?php

namespace Modules\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Modules\Admin\Models\Admin;
use Illuminate\Support\Facades\Log;

class UpdateAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        try {
            $user = Auth::user();
            $adminToUpdate = Admin::find($this->route('admin') ?? $this->route('id'));
            if (! $user || ! $adminToUpdate) {
                return false;
            }
            if ($adminToUpdate->isSuperAdmin()) {
                return $user->id === $adminToUpdate->id || $user->isSuperAdmin();
            }
            return $user->isSuperAdmin() || $user->id === $adminToUpdate->id;
        } catch (\Exception $e) {
            Log::error('Authorization error in UpdateAdminRequest', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);
            return false;
        }
    }

    public function rules(): array
    {
        $adminId = $this->route('admin') ?? $this->route('id');
        return [
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => ['string', 'unique:admins,phone,' . $adminId],
            'email' => ['nullable', 'email', 'unique:admins,email,' . $adminId],
            'address' => 'nullable|string',
            'profile_picture' => 'nullable|image|max:2048',
            'password' => 'nullable|string|min:8',
            'is_super_admin' => 'boolean',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->password === '') {
            $this->request->remove('password');
        }
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
}
