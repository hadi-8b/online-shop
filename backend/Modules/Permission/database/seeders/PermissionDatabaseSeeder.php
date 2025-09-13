<?php

namespace Modules\Permission\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Permission\Models\Permission;

class PermissionDatabaseSeeder extends Seeder
{
    public function run()
    {
        // User Module Permissions
        $userPermissions = [
            ['name' => 'view-users', 'label' => 'مشاهده کاربران', 'module' => 'user'],
            ['name' => 'create-user', 'label' => 'ایجاد کاربر', 'module' => 'user'],
            ['name' => 'edit-user', 'label' => 'ویرایش کاربر', 'module' => 'user'],
            ['name' => 'delete-user', 'label' => 'حذف کاربر', 'module' => 'user'],
        ];

        foreach ($userPermissions as $permission) {
            Permission::create($permission);
        }

        // Role Module Permissions
        $rolePermissions = [
            ['name' => 'view-roles', 'label' => 'مشاهده نقش‌ها', 'module' => 'role'],
            ['name' => 'create-role', 'label' => 'ایجاد نقش', 'module' => 'role'],
            ['name' => 'edit-role', 'label' => 'ویرایش نقش', 'module' => 'role'],
            ['name' => 'delete-role', 'label' => 'حذف نقش', 'module' => 'role'],
        ];

        foreach ($rolePermissions as $permission) {
            Permission::create($permission);
        }
    }
}
