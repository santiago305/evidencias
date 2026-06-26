<?php

use App\Models\Conversation;
use App\Models\GeneratedEvidence;
use App\Models\User;
use App\Services\Evidence\EvidenceSeedService;

/**
 * @param  array<string, mixed>  $inputData
 */
function createStoredEvidenceForAvatarBackfill(array $inputData = []): GeneratedEvidence
{
    $user = User::factory()->create([
        'name' => 'Ana Lopez',
        'dni' => '87654321',
    ]);

    $conversation = Conversation::query()->create([
        'code' => 'conv_avatar_'.strtolower(fake()->bothify('???###')),
        'is_active' => true,
        'status' => 'production',
    ]);

    $seedCode = app(EvidenceSeedService::class)->generateSeedCode($user, $conversation, 1, 'ABC12345');

    return GeneratedEvidence::query()->create([
        'user_id' => $user->id,
        'conversation_id' => $conversation->id,
        'seed_code' => $seedCode,
        'input_data' => [
            'telefono' => '969600585',
            'dniCliente' => '12345678',
            'dni' => '87654321',
            'nombre' => 'Juan Perez',
            'nombreAsesor' => 'Ana Lopez',
            ...$inputData,
        ],
        'generated_at' => now(),
    ]);
}

test('backfill avatar seed supports dry run without saving changes', function () {
    $evidence = createStoredEvidenceForAvatarBackfill();

    $this->artisan('evidences:backfill-avatar-seed --dry-run --limit=1')
        ->expectsOutput('Procesadas: 1')
        ->expectsOutput('Actualizadas: 1')
        ->expectsOutput('Omitidas porque ya tenían avatarSeed: 0')
        ->expectsOutput('Modo dry-run: no se guardó ningún cambio.')
        ->assertSuccessful();

    expect($evidence->fresh()->input_data)->not->toHaveKey('avatarSeed');
});

test('backfill avatar seed stores metadata and respects existing frozen values', function () {
    $evidence = createStoredEvidenceForAvatarBackfill();

    $this->artisan('evidences:backfill-avatar-seed --limit=1')->assertSuccessful();

    $fresh = $evidence->fresh();
    $inputData = $fresh->input_data;

    expect($inputData['telefono'])->toBe('969600585')
        ->and($inputData['dniCliente'])->toBe('12345678')
        ->and($inputData['dni'])->toBe('87654321')
        ->and($inputData['nombre'])->toBe('Juan Perez')
        ->and($inputData['nombreAsesor'])->toBe('Ana Lopez')
        ->and($inputData['avatarSeed'])->toBe('969600585|12345678|Juan Perez|'.$fresh->seed_code.'|'.$fresh->conversation->code.'|Ana Lopez')
        ->and($inputData['avatarSeedHash'])->toBe(hash('sha256', $inputData['avatarSeed']))
        ->and($inputData['avatarSeedVersion'])->toBe('legacy-avatar-v1');

    $inputData['avatarSeed'] = 'already-frozen-avatar';
    $inputData['avatarSeedHash'] = hash('sha256', 'already-frozen-avatar');
    $fresh->input_data = $inputData;
    $fresh->save();

    $this->artisan('evidences:backfill-avatar-seed --limit=1')
        ->expectsOutput('Omitidas porque ya tenían avatarSeed: 1')
        ->assertSuccessful();

    expect($fresh->fresh()->input_data['avatarSeed'])->toBe('already-frozen-avatar');

    $this->artisan('evidences:backfill-avatar-seed --force --limit=1')->assertSuccessful();

    expect($fresh->fresh()->input_data['avatarSeed'])->not->toBe('already-frozen-avatar');
});
