<?php

namespace Modules\Auth\Contracts;

interface NotificationChannel
{
    public function send(string $recipient, string $message): bool;
}