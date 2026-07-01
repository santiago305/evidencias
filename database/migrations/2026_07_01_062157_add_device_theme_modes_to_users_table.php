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
        Schema::table('users', function (Blueprint $table) {
            $table->string('evidence_desktop_theme_mode', 10)->default('light')->after('evidence_theme_mode');
            $table->string('evidence_mobile_theme_mode', 10)->default('light')->after('evidence_desktop_theme_mode');
        });

        DB::table('users')->update([
            'evidence_desktop_theme_mode' => DB::raw('evidence_theme_mode'),
            'evidence_mobile_theme_mode' => DB::raw('evidence_theme_mode'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['evidence_desktop_theme_mode', 'evidence_mobile_theme_mode']);
        });
    }
};
