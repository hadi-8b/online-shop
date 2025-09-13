<?php

namespace Modules\Auth\Services\SMS;

use Ghasedak\GhasedakApi;
use Illuminate\Support\Facades\Log;
use Modules\Auth\Contracts\NotificationChannel;

class GhasedakService implements NotificationChannel
{
    protected $client;
    protected $template;

    public function __construct()
    {
        // اگر API Key وجود نداشت، از یک مقدار موقت استفاده کن
        $apiKey = config('services.ghasedak.key') ?: 'temp-key-for-development';
        
        // در حالت توسعه، از ساخت کلاینت واقعی جلوگیری کن
        if (app()->environment('production')) {
            $this->client = new GhasedakApi($apiKey);
        }
        
        $this->template = config('services.ghasedak.template') ?: 'verification';
    }

    public function send(string $recipient, string $code): bool
    {
        // در محیط توسعه، فقط کد را لاگ کن و نیازی به ارسال واقعی نیست
        if (!app()->environment('production')) {
            Log::info("Development mode: SMS code for {$recipient} is {$code}");
            return true;
        }
        
        try {
            $this->client->verify(
                $this->template,
                $recipient,
                ['param1' => $code]
            );
            return true;
        } catch (\Exception $e) {
            Log::error('Ghasedak SMS Error: ' . $e->getMessage());
            return false;
        }
    }

    public function sendVerificationCode($phone, $code)
    {
        return $this->send($phone, $code);
    }
}