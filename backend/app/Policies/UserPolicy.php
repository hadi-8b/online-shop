<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any users.
     */
    public function viewAny(User $user)
    {
        return $user->is_admin; // فقط ادمین‌ها می‌توانند لیست کاربران را مشاهده کنند
    }

    /**
     * Determine whether the user can update the user.
     */
    public function update(User $user, User $model)
    {
        return $user->id === $model->id || $user->is_admin; // کاربر خودش یا ادمین
    }

    /**
     * Determine whether the user can delete the user.
     */
    public function delete(User $user, User $model)
    {
        return $user->is_admin; // فقط ادمین‌ها می‌توانند کاربران را حذف کنند
    }
}