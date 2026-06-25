<?php

use App\Models\Conversation;
use App\Models\GeneratedEvidence;
use App\Models\User;
use App\Services\Evidence\EvidenceSeedService;

/**
 * @param  array<string, mixed>  $inputData
 */
function createStoredEvidenceForBackfill(array $inputData = [], ?string $seedCode = null): GeneratedEvidence
{
    $user = User::factory()->create([
        'name' => 'Ana Lopez',
        'dni' => '87654321',
    ]);

    $conversation = Conversation::query()->create([
        'code' => 'conv_backfill_'.strtolower(fake()->bothify('???###')),
        'is_active' => true,
        'status' => 'production',
    ]);

    $seedCode ??= app(EvidenceSeedService::class)->generateSeedCode($user, $conversation, 1, 'ABC12345');

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

test('backfill visual seed supports dry run without saving changes', function () {
    $evidence = createStoredEvidenceForBackfill();

    $this->artisan('evidences:backfill-visual-seed --dry-run --limit=1')
        ->expectsOutput('Procesadas: 1')
        ->expectsOutput('Actualizadas: 1')
        ->expectsOutput('Omitidas porque ya tenían visualSeed: 0')
        ->expectsOutput('Inválidas: 0')
        ->assertSuccessful();

    expect($evidence->fresh()->input_data)->not->toHaveKey('visualSeed');
});

test('backfill visual seed stores legacy visual seed metadata', function () {
    $evidence = createStoredEvidenceForBackfill();

    $this->artisan('evidences:backfill-visual-seed --limit=1')->assertSuccessful();

    $inputData = $evidence->fresh()->input_data;

    expect($inputData['visualSeed'])->toBe('969600585|12345678|87654321|Juan Perez|Ana Lopez|ABC12345')
        ->and($inputData['visualSeedHash'])->toBe(hash('sha256', $inputData['visualSeed']))
        ->and($inputData['visualSeedVersion'])->toBe('legacy-v1');
});

test('backfill visual seed skips existing metadata unless forced', function () {
    $evidence = createStoredEvidenceForBackfill([
        'visualSeed' => 'already-frozen',
        'visualSeedHash' => hash('sha256', 'already-frozen'),
        'visualSeedVersion' => 'legacy-v1',
    ]);

    $this->artisan('evidences:backfill-visual-seed --limit=1')
        ->expectsOutput('Omitidas porque ya tenían visualSeed: 1')
        ->assertSuccessful();

    expect($evidence->fresh()->input_data['visualSeed'])->toBe('already-frozen');

    $this->artisan('evidences:backfill-visual-seed --force --limit=1')->assertSuccessful();

    expect($evidence->fresh()->input_data['visualSeed'])->not->toBe('already-frozen');
});

test('backfill visual seed reports invalid seed codes without changing them', function () {
    $evidence = createStoredEvidenceForBackfill(seedCode: 'INVALID-SEED');

    $this->artisan('evidences:backfill-visual-seed --limit=1')
        ->expectsOutput('Inválidas: 1')
        ->assertSuccessful();

    expect($evidence->fresh()->input_data)->not->toHaveKey('visualSeed');
});
