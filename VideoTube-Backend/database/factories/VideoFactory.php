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
            'video_url' => fake()->url(),
            'view_count' => fake()->numberBetween(0, 10000),
            'user_id' => \App\Models\User::factory(),
        ];
    }
}
