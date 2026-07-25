<?php

namespace Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Admin\Http\Requests\StoreUserRequest;
use Modules\Admin\Http\Requests\UpdateUserRequest;
use Modules\User\Models\User;
use Illuminate\Http\JsonResponse;
use Modules\Admin\Transformers\AdminUserResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminUserController extends Controller
{
    protected function disk(): string
    {
        return config('filesystems.admin_disk', 's3');
    }

    public function index(): JsonResponse
    {
        try {
            $users = User::paginate(15);
            return response()->json([
                'status' => true,
                'message' => 'Users retrieved successfully',
                'data' => AdminUserResource::collection($users)
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $userData = [
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address,
                'card_number' => $request->card_number,
                'is_admin' => $request->is_admin ?? false,
                'password' => $request->password ? Hash::make($request->password) : null,
            ];

            if ($request->hasFile('profile_picture')) {
                $path = $request->file('profile_picture')->store('tenants/' . ($request->user()->tenant_id ?? 'global') . '/profile_pictures', $this->disk());
                $userData['profile_picture'] = $path;
            }

            $user = User::create($userData);
            return response()->json(['status' => true, 'message' => 'User created successfully', 'data' => new AdminUserResource($user)], 201);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateUserRequest $request, $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            $userData = $request->only(['first_name', 'last_name', 'phone', 'email', 'address', 'card_number', 'is_admin']);

            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            if ($request->hasFile('profile_picture')) {
                if ($user->profile_picture) {
                    Storage::disk($this->disk())->delete($user->profile_picture);
                }
                $path = $request->file('profile_picture')->store('tenants/' . ($request->user()->tenant_id ?? 'global') . '/profile_pictures', $this->disk());
                $userData['profile_picture'] = $path;
            }

            $user->update($userData);
            return response()->json(['status' => true, 'message' => 'User updated successfully', 'data' => new AdminUserResource($user)]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            if ($user->profile_picture) {
                Storage::disk($this->disk())->delete($user->profile_picture);
            }
            $user->delete();
            return response()->json(['status' => true, 'message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
