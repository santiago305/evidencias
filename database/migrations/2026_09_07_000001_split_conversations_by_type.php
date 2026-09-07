<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table): void {
            $table->string('type')->default('whatsapp')->after('status');
            $table->index(['type', 'is_active', 'status']);
        });

        Schema::table('user_conversation_progress', function (Blueprint $table): void {
            $table->string('conversation_type')->default('whatsapp')->after('user_id');
            $table->dropUnique(['user_id']);
            $table->unique(['user_id', 'conversation_type']);
        });
    }

    public function down(): void
    {
        DB::table('user_conversation_progress')
            ->where('conversation_type', 'sms')
            ->delete();

        Schema::table('user_conversation_progress', function (Blueprint $table): void {
            $table->dropUnique(['user_id', 'conversation_type']);
            $table->unique('user_id');
            $table->dropColumn('conversation_type');
        });

        Schema::table('conversations', function (Blueprint $table): void {
            $table->dropIndex(['type', 'is_active', 'status']);
            $table->dropColumn('type');
        });
    }
};
