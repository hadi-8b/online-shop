<?php

namespace Modules\Admin\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\Admin\Models\Admin;

class AdminDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin::create([
        //     'first_name' => 'Admin',
        //     'last_name' => 'User',
        //     'phone' => '09123456789',
        //     'email' => 'admin@example.com',
        //     'password' => Hash::make('Admin@123456'),
        //     'is_super_admin' => true, 
        // ]);
        
        $admins = [
            [
                'first_name' => 'Admin1',
                'last_name' => 'User1',
                'phone' => '09123456789',
                'email' => 'admin1@example.com',
                // 'password' => Hash::make('Admin@123456'),
                'password' => Hash::make('N3w@Pass2023'),
                'is_super_admin' => true,
            ],
            // [
            //     'first_name' => 'Admin2',
            //     'last_name' => 'User2',
            //     'phone' => '09123456788',
            //     'email' => 'admin2@example.com',
            //     'password' => Hash::make('Admin@123456'),
            //     'is_super_admin' => false,
            // ],
        ];
    
        foreach ($admins as $admin) {
            Admin::create($admin);
        }
    }
    
}
