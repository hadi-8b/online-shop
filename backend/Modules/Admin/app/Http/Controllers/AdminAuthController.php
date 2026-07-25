<?php

namespace Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Modules\Admin\Http\Requests\LoginRequest;
use Modules\Admin\Models\Admin;
use Modules\Admin\Models\AdminRefreshToken;
use Modules\Admin\Services\SecurityService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    public function __construct(protected SecurityService $security) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $email = $this->security->sanitizeInput($request->validated()['email']);
        $password = $request->validated()['password'];

        /** @var Admin|null $admin */
        $admin = Admin::where('email', $email)->first();

        if (! $admin || ! Hash::check($password, $admin->password)) {
            $this->security->logSecurityEvent('invalid_credentials', ['email' => $email]);
            return response()->json(['status' => false, 'message' => 'Invalid credentials'], 401);
        }

        // Sanctum access token
        $accessTokenResult = $admin->createToken('admin-access', ['admin']);
        $plainAccessToken = $accessTokenResult->plainTextToken;

        if ($accessTokenResult->accessToken) {
            $accessTokenResult->accessToken->expires_at = now()->addMinutes(config('admin.token_expiration', 15));
            $accessTokenResult->accessToken->save();
        }

        // Refresh token
        $refreshCfgMinutes = (int) config('admin.refresh_token_expiration', 1440);
        $ip = $request->ip();
        $ua = $request->userAgent();
        $refresh = AdminRefreshToken::generateForAdmin($admin->id, $ip, $ua, $refreshCfgMinutes);

        // Secure cookies
        $this->security->setSecureCookies([
            'access_token'  => ['value' => $plainAccessToken, 'minutes' => (int) config('admin.token_expiration', 15)],
            'refresh_token' => ['value' => $refresh['jti'] . '|' . $refresh['plain'], 'minutes' => $refreshCfgMinutes],
        ]);

        $this->security->logSecurityEvent('successful_login', ['admin_id' => $admin->id]);

        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'data' => [
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->full_name,
                    'email' => $admin->email,
                    'phone' => $admin->phone,
                    'profile_picture' => $admin->profile_picture_url,
                    'roles' => $admin->roles->pluck('name'), // ← fix
                ],
                'expires_in' => config('admin.token_expiration', 15) * 60,
            ],
        ]);
    }

    public function refresh(Request $request): JsonResponse
    {
        $raw = $request->cookie('admin_refresh_token');
        if (! $raw) {
            return response()->json(['status' => false, 'message' => 'No refresh token'], 401);
        }

        [$jti, $plain] = array_pad(explode('|', $raw, 2), 2, null);
        if (! $jti || ! $plain) {
            return response()->json(['status' => false, 'message' => 'Invalid refresh token'], 401);
        }

        $tokenRow = \Modules\Admin\Models\AdminRefreshToken::where('jti', $jti)->first();
        if (! $tokenRow || ! $tokenRow->isValidPlain($plain, $request->ip(), $request->userAgent())) {
            if ($tokenRow) $tokenRow->revoke();
            $this->security->logSecurityEvent('invalid_refresh_attempt', ['jti' => $jti, 'admin_id' => $tokenRow->admin_id ?? null]);
            return response()->json(['status' => false, 'message' => 'Invalid or expired refresh token'], 401);
        }

        $tokenRow->revoke();

        $admin = $tokenRow->admin;
        if (! $admin) {
            return response()->json(['status' => false, 'message' => 'Account not found'], 401);
        }

        $accessTokenResult = $admin->createToken('admin-access', ['admin']);
        $plainAccessToken = $accessTokenResult->plainTextToken;
        if ($accessTokenResult->accessToken) {
            $accessTokenResult->accessToken->expires_at = now()->addMinutes(config('admin.token_expiration', 15));
            $accessTokenResult->accessToken->save();
        }

        $refreshCfgMinutes = (int) config('admin.refresh_token_expiration', 1440);
        $newRefresh = AdminRefreshToken::generateForAdmin($admin->id, $request->ip(), $request->userAgent(), $refreshCfgMinutes);

        $this->security->setSecureCookies([
            'access_token'  => ['value' => $plainAccessToken, 'minutes' => (int) config('admin.token_expiration', 15)],
            'refresh_token' => ['value' => $newRefresh['jti'] . '|' . $newRefresh['plain'], 'minutes' => $refreshCfgMinutes],
        ]);

        $this->security->logSecurityEvent('refresh_success', ['admin_id' => $admin->id]);

        return response()->json([
            'status' => true,
            'message' => 'Token refreshed',
            'data' => [
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->full_name,
                    'roles' => $admin->roles->pluck('name'),
                ],
                'expires_in' => config('admin.token_expiration', 15) * 60,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var Admin|null $admin */
        $admin = $request->user();
        if ($admin) {
            $admin->tokens()->delete();
            AdminRefreshToken::where('admin_id', $admin->id)->update(['revoked_at' => now()]);
            $this->security->logSecurityEvent('logout', ['admin_id' => $admin->id]);
        }
        $this->security->clearSecureCookies();

        return response()->json(['status' => true, 'message' => 'Logged out successfully']);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var Admin|null $admin */
        $admin = $request->user();
        if (! $admin) {
            return response()->json(['status' => false, 'message' => 'Unauthenticated'], 401);
        }
        return response()->json([
            'status' => true,
            'data' => [
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->full_name,
                    'email' => $admin->email,
                    'phone' => $admin->phone,
                    'profile_picture' => $admin->profile_picture_url,
                    'roles' => $admin->roles->pluck('name'),
                ],
            ]
        ]);
    }
}
