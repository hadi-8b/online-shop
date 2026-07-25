<?php

namespace Modules\Admin\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Modules\Role\Models\Role;
use Modules\Permission\Models\Permission;

class Admin extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'first_name','last_name','phone','email','password',
        'address','profile_picture','is_super_admin','tenant_id',
    ];

    protected $guard = 'admin';

    protected $hidden = ['password','remember_token'];
    protected $casts  = ['is_super_admin' => 'boolean'];

    // roles
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'admin_role', 'admin_id', 'role_id')->withTimestamps();
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'admin_permission', 'admin_id', 'permission_id')->withTimestamps();
    }

    // profile
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function getProfilePictureUrlAttribute(): ?string
    {
        return $this->profile_picture
            ? (config('filesystems.disks.minio.url') . '/' . ltrim($this->profile_picture, '/'))
            : null;
    }

    public function isSuperAdmin(): bool
    {
        return $this->is_super_admin === true;
    }

    // RBAC
    public function hasRole(string|array $roles): bool
    {
        $roles = (array) $roles;
        return $this->roles->pluck('name')->intersect($roles)->isNotEmpty();
    }

    public function hasPermission(string|array $permissions): bool
    {
        if ($this->isSuperAdmin()) return true;
        $permissions = (array) $permissions;

        $own = $this->permissions->pluck('name');
        $viaRoles = $this->roles->loadMissing('permissions')
            ->flatMap(fn($r) => $r->permissions->pluck('name'));

        return $own->merge($viaRoles)->unique()->intersect($permissions)->isNotEmpty();
    }
}
