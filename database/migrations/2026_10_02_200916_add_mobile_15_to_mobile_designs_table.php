<?php

use App\Models\MobileDesign;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        MobileDesign::query()->firstOrCreate([
            'design_key' => 'mobile-15',
        ]);
    }

    public function down(): void
    {
        if (DB::table('user_mobile_designs')->where('design_key', 'mobile-15')->exists()) {
            throw new RuntimeException('Cannot roll back mobile-15 while existing user assignments use it.');
        }

        MobileDesign::query()->where('design_key', 'mobile-15')->delete();
    }
};
