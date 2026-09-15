<?php

use App\Models\MobileDesign;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        MobileDesign::query()->firstOrCreate([
            'design_key' => 'mobile-10',
        ]);
    }

    public function down(): void
    {
        if (MobileDesign::query()->where('design_key', 'mobile-10')->exists()) {
            throw new RuntimeException('Cannot roll back mobile-10 while existing records use it.');
        }
    }
};
