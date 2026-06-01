<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $duplicateSeedCodes = DB::table('generated_evidences')
            ->select('seed_code')
            ->groupBy('seed_code')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('seed_code');

        foreach ($duplicateSeedCodes as $seedCode) {
            $ids = DB::table('generated_evidences')
                ->where('seed_code', $seedCode)
                ->orderBy('id')
                ->pluck('id')
                ->all();

            $duplicateIds = array_slice($ids, 1);

            if ($duplicateIds !== []) {
                DB::table('generated_evidences')
                    ->whereIn('id', $duplicateIds)
                    ->delete();
            }
        }

        Schema::table('generated_evidences', function (Blueprint $table) {
            $table->unique('seed_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('generated_evidences', function (Blueprint $table) {
            $table->dropUnique('generated_evidences_seed_code_unique');
        });
    }
};
