<?php

namespace Modules\Role\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Role\Models\Role;

class RoleDatabaseSeeder extends Seeder
{
    public function run()
    {
        Role::create([
            'name' => 'super_admin',
            'label' => 'مدیر کل',
            'description' => 'دسترسی کامل به تمام بخش‌ها'
        ]);

        Role::create([
            'name' => 'admin',
            'label' => 'مدیر',
            'description' => 'دسترسی به بخش مدیریت'
        ]);

        Role::create([
            'name' => 'user',
            'label' => 'کاربر عادی',
            'description' => 'دسترسی محدود'
        ]);
    }
}
