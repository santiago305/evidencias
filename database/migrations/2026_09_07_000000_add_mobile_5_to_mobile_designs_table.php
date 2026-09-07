<?php

use App\Models\MobileDesign;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        MobileDesign::query()->firstOrCreate([
            'design_key' => 'mobile-5',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        MobileDesign::query()->where('design_key', 'mobile-5')->delete();
    }
};
