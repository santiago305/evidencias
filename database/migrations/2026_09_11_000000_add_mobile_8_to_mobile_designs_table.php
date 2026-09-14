<?php

use App\Models\MobileDesign;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        MobileDesign::query()->firstOrCreate([
            'design_key' => 'mobile-8',
        ]);
    }

    public function down(): void
    {
        if (MobileDesign::query()->where('design_key', 'mobile-8')->exists()) {
            throw new RuntimeException('Cannot roll back mobile-8 while existing records use it.');
        }
    }
};
