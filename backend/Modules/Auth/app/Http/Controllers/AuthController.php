<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Modules\Auth\Http\Requests\RegisterRequest;
use Modules\Auth\Http\Requests\LoginRequest;
use Modules\Auth\Http\Requests\VerifyCodeRequest;
use Modules\Auth\Services\AuthService;
use Modules\Auth\Transformers\UserResource;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'message' => 'Verification code sent successfully',
            'data' => $result
        ]);
    }

    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->phone);

        return response()->json([
            'message' => 'Verification code sent successfully',
            'data' => $result
        ]);
    }

    public function verify(VerifyCodeRequest $request)
    {
        $result = $this->authService->verify($request->phone, $request->code);

        return response()->json([
            'message' => 'Verified successfully',
            'data' => [
                'user' => new UserResource($result['user']),
            ]
        ]);
    }

    public function resendCode(Request $request)
    {
        $result = $this->authService->resendCode($request->phone);

        return response()->json([
            'message' => 'Code resent successfully',
            'data' => $result
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
