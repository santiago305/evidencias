<?php

namespace Database\Seeders;

use App\Models\MobileDesign;
use App\Support\MobileDesignCatalog;
use Illuminate\Database\Seeder;

class MobileDesignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (MobileDesignCatalog::keys() as $designKey) {
            MobileDesign::query()->firstOrCreate([
                'design_key' => $designKey,
            ]);
        }
    }
}
