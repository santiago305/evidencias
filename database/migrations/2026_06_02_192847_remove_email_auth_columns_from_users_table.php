<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->rebuildUsersTable(
            users: $this->usersWithoutEmailColumns(),
            definition: function (Blueprint $table): void {
                $table->id();
                $table->string('dni', 8)->unique();
                $table->string('name');
                $table->string('windows_tray_color', 7)->nullable();
                $table->json('windows_tray_config')->nullable();
                $table->string('password');
                $table->rememberToken();
                $table->timestamps();
            },
            newTable: 'users_rebuilt',
        );

        Schema::dropIfExists('password_reset_tokens');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $this->rebuildUsersTable(
            users: $this->usersWithRestoredEmailColumns(),
            definition: function (Blueprint $table): void {
                $table->id();
                $table->string('name');
                $table->string('dni', 8)->unique();
                $table->string('windows_tray_color', 7)->nullable();
                $table->json('windows_tray_config')->nullable();
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->rememberToken();
                $table->timestamps();
            },
            newTable: 'users_rebuilt',
        );

        Schema::create('password_reset_tokens', function (Blueprint $table): void {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function usersWithoutEmailColumns(): Collection
    {
        return DB::table('users')
            ->orderBy('id')
            ->get()
            ->map(function (object $user): array {
                return [
                    'id' => $user->id,
                    'dni' => $user->dni,
                    'name' => $user->name,
                    'windows_tray_color' => $user->windows_tray_color,
                    'windows_tray_config' => $user->windows_tray_config,
                    'password' => $user->password,
                    'remember_token' => $user->remember_token,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ];
            });
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function usersWithRestoredEmailColumns(): Collection
    {
        return DB::table('users')
            ->orderBy('id')
            ->get()
            ->map(function (object $user): array {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'dni' => $user->dni,
                    'windows_tray_color' => $user->windows_tray_color,
                    'windows_tray_config' => $user->windows_tray_config,
                    'email' => "dni{$user->dni}@example.local",
                    'email_verified_at' => null,
                    'password' => $user->password,
                    'remember_token' => $user->remember_token,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ];
            });
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $users
     * @param  Closure(Blueprint): void  $definition
     */
    private function rebuildUsersTable(Collection $users, Closure $definition, string $newTable): void
    {
        Schema::disableForeignKeyConstraints();

        try {
            Schema::dropIfExists($newTable);
            Schema::create($newTable, $definition);

            if ($users->isNotEmpty()) {
                DB::table($newTable)->insert($users->all());
            }

            Schema::dropIfExists('users');
            Schema::rename($newTable, 'users');
        } finally {
            Schema::enableForeignKeyConstraints();
        }
    }
};
