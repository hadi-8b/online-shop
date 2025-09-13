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
        $this->client = new GhasedakApi(config('services.ghasedak.key'));
        $this->template = config('services.ghasedak.template');
    }

    public function send(string $recipient, string $code): bool
    {
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