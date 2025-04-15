# VideoTube

VideoTube is a personal project aimed at creating a video-sharing platform where users can upload, view, and interact with video content.

## Features

- User authentication.
- Video upload, playback, and streaming.
- View count, likes, comments.
- Profile management and channels.
- Search videos.
- Responsive design for desktop and mobile devices.

## Yet to be implemented

- Subscriptions

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TwitsTeen/VideoTube.git
   ```
2. Navigate to the project directory:

   ```bash
   cd VideoTube
   ```

3. start the backend :

   ```bash
   composer install
   php artisan key:generate
   php artisan migrate:fresh [--seed] # Optional: use --seed to create demo videos and users
   php artisan storage:link
   php artisan serve
   ```

## Environement variables

The url for the server should be put in a .env file in the `VideoTube-Frontend` folder.

```
EXPO_PUBLIC_BASE_API_URL = "http://127.0.0.1:8000/api"
```

## Technologies Used

- **Frontend**: React Native, NativeWind
- **Backend**: Laravel
- **Database**: Currently tested with SQLite

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
