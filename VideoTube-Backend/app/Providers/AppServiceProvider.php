<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            // Get the authenticated user OR use the IP address as a fallback for guests
            $key = $request->user()?->id ?: $request->ip();

            // Allow 60 attempts per minute per user/IP address
            // Adjust the limit (60) as needed for your application
            return Limit::perMinute(60)->by($key);
        });

        // You might have other limiters defined here too
        // RateLimiter::for('global', function (Request $request) { ... });
    }
}
