<?php

namespace Modules\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class UpdateUserRequest extends FormRequest
{
    /**
     * تعیین اینکه آیا کاربر مجاز به انجام این درخواست است
     */
    public function authorize(): bool
    {
        $user = Auth::user();
        $userToUpdate = $this->route('user');

        // اگر کاربر لاگین نکرده باشد
        if (!$user) {
            return false;
        }

        // استفاده از Gate
        if (Gate::allows('update-user', $userToUpdate)) {
            return true;
        }

        // کاربر عادی فقط می‌تواند پروفایل خودش را ویرایش کند
        return $user->id === $userToUpdate;
    }

    /**
     * قوانین اعتبارسنجی
     */
    public function rules(): array
    {
        return [
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'mobile' => 'string|unique:users,mobile,' . $this->user,
            'email' => 'nullable|email|unique:users,email,' . $this->user,
            'address' => 'nullable|string',
            'profile_picture' => 'nullable|image|max:2048',
            'card_number' => 'nullable|string',
            'password' => 'nullable|string|min:6',
            'is_admin' => 'boolean',
        ];
    }

    /**
     * پیام‌های خطای سفارشی
     */
    public function messages(): array
    {
        return [
            'first_name.string' => 'نام باید متن باشد.',
            'first_name.max' => 'نام نباید بیشتر از 255 کاراکتر باشد.',

            'last_name.string' => 'نام خانوادگی باید متن باشد.',
            'last_name.max' => 'نام خانوادگی نباید بیشتر از 255 کاراکتر باشد.',

            'mobile.string' => 'شماره موبایل باید متن باشد.',
            'mobile.unique' => 'این شماره موبایل قبلاً ثبت شده است.',

            'email.email' => 'فرمت ایمیل صحیح نیست.',
            'email.unique' => 'این ایمیل قبلاً ثبت شده است.',

            'profile_picture.image' => 'فایل انتخاب شده باید تصویر باشد.',
            'profile_picture.max' => 'حجم تصویر نباید بیشتر از 2 مگابایت باشد.',

            'password.min' => 'رمز عبور باید حداقل 6 کاراکتر باشد.',
            'password.string' => 'رمز عبور باید متن باشد.',

            'is_admin.boolean' => 'وضعیت ادمین باید true یا false باشد.',
        ];
    }

    /**
     * آماده‌سازی داده‌ها قبل از اعتبارسنجی
     */
    protected function prepareForValidation(): void
    {
        // اگر پسورد خالی باشد، آن را از درخواست حذف می‌کنیم
        if ($this->password === '') {
            $this->request->remove('password');
        }

        // تبدیل رشته‌های خالی به null
        $nullableFields = ['first_name', 'last_name', 'email', 'address', 'card_number'];
        foreach ($nullableFields as $field) {
            if ($this->$field === '') {
                $this->request->set($field, null);
            }
        }
    }

    /**
     * دریافت داده‌های اعتبارسنجی شده
     */
    public function validated($key = null, $default = null): array
    {
        $validated = parent::validated();

        // حذف فیلدهای null از آرایه
        return array_filter($validated, function ($value) {
            return $value !== null;
        });
    }
}
