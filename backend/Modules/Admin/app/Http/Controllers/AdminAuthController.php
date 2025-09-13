<?php

namespace Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Admin\Models\Admin;
use Modules\Admin\Services\SecurityService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Modules\Admin\Http\Requests\LoginRequest;

class AdminAuthController extends Controller
{
    public function __construct(
        protected SecurityService $security
    ) {}
    
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $email = $this->security->sanitizeInput($validated['email']);
        
        $admin = Admin::where('email', $email)->first();

        if (!$admin || !Hash::check($validated['password'], $admin->password)) {
            $this->security->logSecurityEvent('invalid_credentials', [
                'email' => $email,
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $tokens = [
            'access_token' => $admin->createToken('admin-token', ['admin'])->plainTextToken,
            'refresh_token' => $admin->createToken('admin-refresh', ['admin-refresh'])->plainTextToken,
        ];

        $this->security->setSecureCookies($tokens);

        $this->security->logSecurityEvent('successful_login', [
            'admin_id' => $admin->id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'data' => [
                'admin' => $admin->only(['id', 'name', 'email']),
                'token' => $tokens['access_token'],
                'expires_in' => config('sanctum.expiration') * 60,
            ]
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();
        $this->security->clearSecureCookies();
        
        $this->security->logSecurityEvent('logout', [
            'admin_id' => $request->user()->id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => [
                'admin' => $request->user()->only(['id', 'name', 'email'])
            ]
        ]);
    }
}