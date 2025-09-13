<?php

namespace Modules\Auth\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Modules\Auth\Services\SMS\GhasedakService;

class VerificationCodeNotification extends Notification
{
    use Queueable;

    protected $code;
    protected $type;

    public function __construct($code, $type = 'phone')
    {
        $this->code = $code;
        $this->type = $type;
    }

    public function via($notifiable)
    {
        return $this->type === 'phone' ? ['ghasedak'] : ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('کد تایید')
            ->line('کد تایید شما: ' . $this->code)
            ->line('این کد تا 2 دقیقه معتبر است.');
    }

    public function toGhasedak($notifiable)
    {
        return [
            'message' => "کد تایید شما: {$this->code}",
            'template' => "verification",
            'params' => [$this->code]
        ];
    }
}