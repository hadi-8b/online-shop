<?php
namespace Modules\Admin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminRefreshToken extends Model
{
    protected $table = 'admin_refresh_tokens';

    protected $fillable = [
        'admin_id',
        'jti',
        'token_hash',
        'ip',
        'user_agent',
        'expires_at',
        'revoked_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    public static function generateForAdmin($adminId, ?string $ip = null, ?string $userAgent = null, int $minutes = 1440): array
    {
        $jti = (string) Str::uuid();
        $plain = bin2hex(random_bytes(48)); // 96 hex chars
        $hash = Hash::make($plain);

        $token = self::create([
            'admin_id' => $adminId,
            'jti' => $jti,
            'token_hash' => $hash,
            'ip' => $ip,
            'user_agent' => $userAgent,
            'expires_at' => now()->addMinutes($minutes),
        ]);

        return [
            'jti' => $jti,
            'plain' => $plain,
            'model' => $token,
        ];
    }

    public function isValidPlain(string $plain, ?string $ip = null, ?string $userAgent = null): bool
    {
        if ($this->revoked_at !== null) {
            return false;
        }
        if ($this->expires_at && now()->greaterThanOrEqualTo($this->expires_at)) {
            return false;
        }
        if (! Hash::check($plain, $this->token_hash)) {
            return false;
        }
        // Optional binding
        if ($this->ip && $ip && $this->ip !== $ip) {
            return false;
        }
        if ($this->user_agent && $userAgent && $this->user_agent !== $userAgent) {
            return false;
        }
        return true;
    }

    public function revoke(): void
    {
        $this->update(['revoked_at' => now()]);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }
}
