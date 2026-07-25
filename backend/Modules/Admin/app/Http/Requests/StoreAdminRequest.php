<?php

namespace Modules\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Modules\Admin\Models\Admin;

class StoreAdminRequest extends FormRequest
{
    public function authorize()
    {
        // Only logged-in admins with permission or super-admin may create
        $user = auth()->user();
        if (! $user) {
            return false;
        }
        if ($user->isSuperAdmin()) {
            return true;
        }
        return Gate::allows('create-admin');
    }

    public function rules()
    {
        return [
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'required|string|unique:admins,phone',
            'email' => 'nullable|email|unique:admins,email',
            'address' => 'nullable|string',
            'profile_picture' => 'nullable|image|max:2048',
            'password' => ['required', 'string', 'min:8'],
            'is_super_admin' => 'boolean',
        ];
    }
}
