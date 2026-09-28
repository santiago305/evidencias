<?php

use App\Models\MobileDesign;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        MobileDesign::query()->firstOrCreate([
            'design_key' => 'mobile-13',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::table('user_mobile_designs')->where('design_key', 'mobile-13')->exists()) {
            throw new RuntimeException('Cannot roll back mobile-13 while existing user assignments use it.');
        }

        MobileDesign::query()->where('design_key', 'mobile-13')->delete();
    }
};
