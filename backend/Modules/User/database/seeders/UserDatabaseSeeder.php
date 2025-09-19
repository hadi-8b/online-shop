<?php

namespace Modules\User\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\User\Models\User;

class UserDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'first_name' => 'Test',
                'last_name' => 'User',
                'phone' => '09111111111',
                'email' => 'user1@example.com',
                'password' => Hash::make('User@123456'),
                'is_admin' => false,
            ],
            [
                'first_name' => 'Admin',
                'last_name' => 'User',
                'phone' => '09222222222',
                'email' => 'admin@example.com',
                'password' => Hash::make('Admin@123456'),
                'is_admin' => true,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
