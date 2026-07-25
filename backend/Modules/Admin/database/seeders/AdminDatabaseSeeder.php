<?php

namespace Modules\Admin\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\Admin\Models\Admin;
use Modules\Role\Models\Role;

class AdminDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // اطمینان از وجود نقش‌ها در جدول roles (RBAC سفارشی)
        foreach (['super_admin','admin','product_manager'] as $name) {
            Role::firstOrCreate(['name' => $name], [
                'label' => ucfirst(str_replace('_',' ', $name)),
                'description' => null,
                'is_active' => true,
            ]);
        }

        $admin = Admin::firstOrCreate(
            ['email' => 'admin1@example.com'],
            [
                'first_name' => 'Admin1',
                'last_name'  => 'User1',
                'phone'      => '09123456789',
                'password'   => Hash::make(env('DEFAULT_ADMIN_PASSWORD', 'ChangeM3!Now')),
                'is_super_admin' => true,
            ]
        );

        // اتصال نقش (اختیاری چون is_super_admin=true)
        $superRole = Role::where('name', 'super_admin')->first();
        if ($superRole && ! $admin->roles()->where('roles.id',$superRole->id)->exists()) {
            $admin->roles()->attach($superRole->id);
        }
    }
}
