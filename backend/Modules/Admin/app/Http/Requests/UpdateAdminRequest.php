<?php

namespace Modules\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Modules\Admin\Models\Admin;
use Illuminate\Support\Facades\Log;

class UpdateAdminRequest extends FormRequest
{
    /**
     * تعیین اینکه آیا کاربر مجاز به انجام این درخواست است
     */
    public function authorize(): bool
    {
        try {
            /** @var Admin|null $user */
            $user = Auth::user();
            /** @var Admin|null $adminToUpdate */
            $adminToUpdate = Admin::find($this->route('admin'));

            if (!$user || !$adminToUpdate) {
                return false;
            }

            // Super Admin نمی‌تواند ویرایش شود مگر توسط خودش
            if ($adminToUpdate->isSuperAdmin()) {
                return $user->id === $adminToUpdate->id;
            }

            // Admin معمولی فقط می‌تواند خودش را ویرایش کند
            if ($user->isAdmin()) {
                return $user->id === $adminToUpdate->id;
            }

            // Super Admin می‌تواند همه را ویرایش کند
            return $user->isSuperAdmin();

        } catch (\Exception $e) {
            Log::error('Authorization error in UpdateAdminRequest', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'admin_id' => $this->route('admin')
            ]);
            return false;
        }
    }

    /**
     * قوانین اعتبارسنجی برای درخواست
     */
    public function rules(): array
    {
        return [
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'mobile' => ['string', 'unique:admins,mobile,' . $this->route('admin')],
            'email' => ['nullable', 'email', 'unique:admins,email,' . $this->route('admin')],
            'address' => 'nullable|string',
            'profile_picture' => 'nullable|image|max:2048',
            'password' => 'nullable|string|min:6',
            'is_super_admin' => 'boolean',
        ];
    }

    /**
     * آماده‌سازی داده‌ها قبل از اعتبارسنجی
     */
    protected function prepareForValidation(): void
    {
        if ($this->password === '') {
            $this->request->remove('password');
        }
    }

    /**
     * پیام‌های خطای سفارشی
     */
    public function messages(): array
    {
        return [
            'mobile.unique' => 'این شماره موبایل قبلاً ثبت شده است.',
            'email.unique' => 'این ایمیل قبلاً ثبت شده است.',
            'profile_picture.max' => 'حجم تصویر نباید بیشتر از 2 مگابایت باشد.',
            'password.min' => 'رمز عبور باید حداقل 6 کاراکتر باشد.',
        ];
    }
}