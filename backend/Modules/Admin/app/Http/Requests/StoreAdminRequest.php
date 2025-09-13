<?php

namespace Modules\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Modules\Admin\Models\Admin;

class StoreAdminRequest extends FormRequest
{
    public function authorize()
    {
            // بررسی اینکه کاربر لاگین است
            if (!auth()->guard('admin')->check()) {
                return false;
            }
    
            $user = auth()->guard('admin')->user();
    
            // بررسی super admin بودن
            if ($user->is_super_admin) {
                return true;
            }
    
            // بررسی مجوز از طریق Gate
            if (Gate::allows(ability: 'create-admin')) {
                return true;
            }
    
            // بررسی سایر شرایط خاص
            // مثلاً محدودیت تعداد ادمین‌ها
            $adminsCount = Admin::count();
        if ($adminsCount >= config('admin.max_admins')) {
            return false;
        }
    
            return false;
    }

    public function rules()
    {
        return [
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'mobile' => 'required|string|unique:admins,mobile',
            'email' => 'nullable|email|unique:admins,email',
            'address' => 'nullable|string',
            'profile_picture' => 'nullable|image|max:2048', // 2MB Max
            'password' => 'required|string|min:6',
            'is_super_admin' => 'boolean',
        ];
    }
}
