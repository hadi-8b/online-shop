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

class AdminAuthController extends Controller
{
    public function __construct(
        protected SecurityService $security
    ) {}
    

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email', 'max:255'],
            'password' => [
                'required',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
            ],
        ]);

        if ($validator->fails()) {
            $this->security->logSecurityEvent('failed_login_attempt', [
                'email' => $request->email,
                'errors' => $validator->errors()->toArray(),
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $this->security->sanitizeInput($request->email);
        
        $admin = Admin::where('email', $email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            $this->security->logSecurityEvent('invalid_credentials', [
                'email' => $email,
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $tokens = [
            'access_token' => $admin->createToken('admin-access', ['admin'])->plainTextToken,
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