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

class AdminController extends Controller
{
    /**
     * Display a listing of admins
     */
    public function index(): JsonResponse
    {
        try {
            $admins = Admin::latest()->paginate(15);
            
            return $this->successResponse(
                'Admins retrieved successfully',
                AdminResource::collection($admins)
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Store a newly created admin
     */
    public function store(StoreAdminRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $adminData = $this->prepareAdminData($request);
            
            if ($request->hasFile('profile_picture')) {
                $adminData['profile_picture'] = $this->uploadProfilePicture($request->file('profile_picture'));
            }

            $admin = Admin::create($adminData);

            DB::commit();

            return $this->successResponse(
                'Admin created successfully',
                new AdminResource($admin),
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Update the specified admin
     */
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
                $adminData['profile_picture'] = $this->uploadProfilePicture($request->file('profile_picture'));
            }

            $admin->update($adminData);

            DB::commit();

            return $this->successResponse(
                'Admin updated successfully',
                new AdminResource($admin)
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Remove the specified admin
     */
    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $admin = Admin::findOrFail($id);
            
            if ($admin->is_super_admin) {
                return $this->errorResponse(
                    'Super admin cannot be deleted',
                    403
                );
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

    /**
     * Prepare admin data from request
     */
    private function prepareAdminData($request, bool $includePassword = true): array
    {
        $data = $request->only([
            'first_name',
            'last_name',
            'mobile',
            'email',
            'address',
            'is_super_admin'
        ]);

        if ($includePassword) {
            $data['password'] = Hash::make($request->password);
        }

        $data['is_super_admin'] = $request->is_super_admin ?? false;

        return $data;
    }

    /**
     * Upload profile picture and return path
     */
    private function uploadProfilePicture($file): string
    {
        return $file->store('admin_profiles', 'public');
    }

    /**
     * Delete old profile picture if exists
     */
    private function deleteOldProfilePicture(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Return success response
     */
    private function successResponse(string $message, $data = null, int $status = 200): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data
        ], $status);
    }

    /**
     * Return error response
     */
    private function errorResponse(string $message, int $status = 500): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message
        ], $status);
    }
}