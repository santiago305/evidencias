<?php

uses(Tests\TestCase::class, Illuminate\Foundation\Testing\RefreshDatabase::class);

use App\Models\Conversation;
use App\Models\User;
use App\Services\Evidence\EvidenceSeedService;

test('it encodes and decodes the preview snapshot inside the seed', function () {
    $user = User::factory()->create();
    $conversation = Conversation::query()->create([
        'code' => 'conv_seed_001',
        'is_active' => true,
    ]);

    $service = new EvidenceSeedService;
    $previewSeed = $service->generatePreviewSeed();
    $seedCode = $service->generateSeedCode($user, $conversation, 4, $previewSeed);
    $decoded = $service->decodeSeedCode($seedCode);

    expect($decoded)->not->toBeNull();
    expect($decoded['version'])->toBe(3);
    expect($decoded['conversation_id'])->toBe($conversation->id);
    expect($decoded['user_id'])->toBe($user->id);
    expect($decoded['cycle'])->toBe(4);
    expect($decoded['preview_seed'])->toBe($previewSeed);
});
