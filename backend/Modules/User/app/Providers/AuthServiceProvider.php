<?php

namespace Modules\User\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Notification;
use Modules\Auth\Channels\GhasedakChannel;
use Modules\User\Models\User;
use Modules\User\Policies\UserPolicy; // Policy مربوطه

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class, // اتصال مدل User به UserPolicy
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot()
    {
        $this->registerPolicies();
        
        Notification::extend('ghasedak', function ($app) {
            return new GhasedakChannel($app->make('Modules\Auth\Services\SMS\GhasedakService'));
        });
        
       
    }
}