<?php

namespace Modules\Auth\Channels;

use Illuminate\Notifications\Notification;
use Modules\Auth\Services\SMS\GhasedakService;

class GhasedakChannel
{
    protected $ghasedak;

    public function __construct(GhasedakService $ghasedak)
    {
        $this->ghasedak = $ghasedak;
    }

    public function send($notifiable, Notification $notification)
    {
        if (!method_exists($notification, 'toGhasedak')) {
            throw new \Exception('Method toGhasedak missing on notification');
        }

        $message = $notification->toGhasedak($notifiable);

        return $this->ghasedak->sendVerificationCode(
            $notifiable->phone,
            $message['params'][0]
        );
    }
}