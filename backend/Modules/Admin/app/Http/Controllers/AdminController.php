<?php

namespace Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Admin\Http\Requests\StoreAdminRequest;
use Modules\Admin\Http\Requests\UpdateAdminRequest;
use Modules\Admin\Models\Admin;
use Illuminate\Http\JsonResponse;
use Modules\Admin\Transformers\AdminResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Modules\Role\Models\Role;

class AdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Admin::query();
            // tenant scope if available
            if ($request->user()) {
                $tenantId = $request->user()->tenant_id;
                if ($tenantId) {
                    $query->where('tenant_id', $tenantId);
                }
            }
            $admins = $query->latest()->paginate(15);
            return $this->successResponse('Admins retrieved successfully', AdminResource::collection($admins));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function store(StoreAdminRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $adminData = $this->prepareAdminData($request);
            // tenant_id from operator
            if ($request->user()) {
                $adminData['tenant_id'] = $request->user()->tenant_id;
            }
            if ($request->hasFile('profile_picture')) {
                $adminData['profile_picture'] = $this->uploadProfilePicture($request->file('profile_picture'), $adminData['tenant_id'] ?? null);
            }
            $admin = Admin::create($adminData);
            DB::commit();
            return $this->successResponse('Admin created successfully', new AdminResource($admin), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    public function update(UpdateAdminRequest $request, $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $admin = Admin::findOrFail($id);

            $adminData = $this->prepareAdminData($request, false);
            if ($request->filled('password')) {
                $adminData['password'] = Hash::make($request->password);
            }
            if ($request->hasFile('profile_picture')) {
                $this->deleteOldProfilePicture($admin->profile_picture);
                $adminData['profile_picture'] = $this->uploadProfilePicture($request->file('profile_picture'), $admin->tenant_id ?? null);
            }
            $admin->update($adminData);
            DB::commit();
            return $this->successResponse('Admin updated successfully', new AdminResource($admin));
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $admin = Admin::findOrFail($id);
            if ($admin->is_super_admin) {
                return $this->errorResponse('Super admin cannot be deleted', 403);
            }
            $this->deleteOldProfilePicture($admin->profile_picture);
            $admin->delete();
            DB::commit();
            return $this->successResponse('Admin deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    private function prepareAdminData($request, bool $includePassword = true): array
    {
        $data = $request->only([
            'first_name',
            'last_name',
            'phone',
            'email',
            'address',
            'is_super_admin'
        ]);
        if ($includePassword && $request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
        $data['is_super_admin'] = $request->is_super_admin ?? false;
        return $data;
    }

    private function uploadProfilePicture($file, ?int $tenantId = null): string
    {
        $disk = config('filesystems.admin_disk', 's3');
        $pathPrefix = $tenantId ? "tenants/{$tenantId}/admin_profiles" : "admin_profiles";
        return $file->store($pathPrefix, $disk);
    }

    private function deleteOldProfilePicture(?string $path): void
    {
        if ($path) {
            $disk = config('filesystems.admin_disk', 's3');
            Storage::disk($disk)->delete($path);
        }
    }

    private function successResponse(string $message, $data = null, int $status = 200): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data
        ], $status);
    }

    private function errorResponse(string $message, int $status = 500): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message
        ], $status);
    }

    public function attachRole(Request $request, Admin $admin): JsonResponse
    {
        $request->validate(['role' => 'required|string|exists:roles,name']);
        $role = Role::where('name', $request->role)->firstOrFail();
        $admin->roles()->syncWithoutDetaching([$role->id]);

        return $this->successResponse('Role attached successfully', new AdminResource($admin->load('roles')));
    }

    public function detachRole(Request $request, Admin $admin): JsonResponse
    {
        $request->validate(['role' => 'required|string|exists:roles,name']);
        $role = Role::where('name', $request->role)->firstOrFail();
        $admin->roles()->detach($role->id);

        return $this->successResponse('Role detached successfully', new AdminResource($admin->load('roles')));
    }
}
