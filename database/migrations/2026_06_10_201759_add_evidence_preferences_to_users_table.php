<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('evidence_theme_mode', 10)->default('light')->after('whatsapp_desktop_scale');
            $table->string('evidence_device_mode', 10)->default('desktop')->after('evidence_theme_mode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['evidence_theme_mode', 'evidence_device_mode']);
        });
    }
};
