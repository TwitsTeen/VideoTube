<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Video;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'testUser',
            'email' => 'testUser@mail.com',
            'password' => bcrypt('password1234'),
        ]);

        Comment::factory(250)->create([
             'user_id' => User::factory(),
         ]);
    }
}
