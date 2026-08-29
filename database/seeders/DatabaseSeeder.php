<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(MobileDesignSeeder::class);

        User::query()->delete();

        for ($i = 1; $i <= 50; $i++) {
            User::factory()->create([
                'name' => "Usuario {$i}",
                'dni' => (string) (10000000 + $i),
            ]);
        }

        $this->call(ConversationSeeder::class);
    }
}
