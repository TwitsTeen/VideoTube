<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Video>
 */
class VideoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'thumbnail_url' => fake()->imageUrl(),
            'video_url' => "videos/demo.mp4", // You can put a demo.mp4 file in the public folder
            'view_count' => fake()->numberBetween(0, 10000),
            'user_id' => \App\Models\User::factory(),
        ];
    }
}
