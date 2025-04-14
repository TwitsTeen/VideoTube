// config/cors.php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    | ...
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'videos', 'storage/*', '*'], // IMPORTANT: Ensure your video upload path ('videos' or 'api/videos', etc.) is matched here. 'api/*' usually covers it if your route is in routes/api.php.

    'allowed_methods' => ['*'], // Allow all methods, or be specific: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE']. MUST include POST and OPTIONS for your upload.

    'allowed_origins' => ['*'], // Use '*' for mobile apps/development. For production web apps, list specific origins like ['https://yourdomain.com'].

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Allow all headers, or be specific: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']. MUST include 'Authorization' and 'Content-Type' (even though the client shouldn't set Content-Type manually for FormData, the *server* needs to allow it in the preflight response).

    'exposed_headers' => [],

    'max_age' => 0, // Cache preflight response time in seconds. 0 means no caching (good for development). Increase for production (e.g., 3600).

    'supports_credentials' => true, // Required to allow the Authorization header to be processed.

];
