<?php

use App\Models\Conversation;
use App\Models\ConversationMessage;
use App\Models\User;
use App\Models\UserConversationProgress;

function createConversationForTest(string $code, array $messages): Conversation
{
    $conversation = Conversation::query()->create([
        'code' => $code,
        'is_active' => true,
    ]);

    foreach ($messages as $index => $message) {
        ConversationMessage::query()->create([
            'conversation_id' => $conversation->id,
            'position' => $index + 1,
            'side' => $message['side'],
            'delay_minutes' => $message['delay_minutes'],
            'lines' => $message['lines'],
        ]);
    }

    return $conversation;
}

test('authenticated user can create a conversation manually', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson(route('conversations.store'), [
        'code' => 'conv_001',
        'messages' => [
            [
                'side' => 'out',
                'delay_minutes' => 0,
                'lines' => ['Hola {cliente}'],
            ],
            [
                'side' => 'in',
                'delay_minutes' => 2,
                'lines' => ['Hola asesor'],
            ],
        ],
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('conversations', ['code' => 'conv_001']);
    $this->assertDatabaseCount('conversation_messages', 2);
});

test('generate evidence returns seed and rendered messages', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {cliente}']],
    ]);
    createConversationForTest('conv_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Buenos dias {cliente}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        'nombreAsesor' => 'Ana Lopez',
        'dni' => '12345678',
        'telefono' => '999999999',
        'nombre' => 'Juan Perez',
        'monto' => '1500',
        'tasa' => '2.5',
        'cuota' => '250',
        'plazo' => '12',
        'fechaHora' => '2026-05-29T10:30',
        'duracion' => '8',
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'conversationId',
            'seedCode',
            'messages' => [['side', 'time', 'lines']],
            'progress' => ['cycle', 'used', 'pending', 'total'],
        ]);

    $this->assertDatabaseCount('generated_evidences', 1);
});

test('random generation does not repeat until cycle is completed', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Uno']],
    ]);
    createConversationForTest('conv_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Dos']],
    ]);

    $payload = [
        'nombreAsesor' => 'Ana Lopez',
        'dni' => '12345678',
        'telefono' => '999999999',
        'nombre' => 'Juan Perez',
        'monto' => '1500',
        'tasa' => '2.5',
        'cuota' => '250',
        'plazo' => '12',
        'fechaHora' => '2026-05-29T10:30',
        'duracion' => '8',
    ];

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), $payload)->json();
    $second = $this->actingAs($user)->postJson(route('evidences.generate'), $payload)->json();

    expect($first['conversationId'])->not->toBe($second['conversationId']);
});

test('generating by seed reuses the same conversation without consuming bag', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Uno']],
    ]);
    createConversationForTest('conv_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Dos']],
    ]);

    $payload = [
        'nombreAsesor' => 'Ana Lopez',
        'dni' => '12345678',
        'telefono' => '999999999',
        'nombre' => 'Juan Perez',
        'monto' => '1500',
        'tasa' => '2.5',
        'cuota' => '250',
        'plazo' => '12',
        'fechaHora' => '2026-05-29T10:30',
        'duracion' => '8',
    ];

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), $payload)->json();

    $progressBefore = UserConversationProgress::query()->where('user_id', $user->id)->firstOrFail();

    $seedResponse = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...$payload,
        'seedCode' => $first['seedCode'],
    ])->json();

    $progressAfter = UserConversationProgress::query()->where('user_id', $user->id)->firstOrFail();

    expect($seedResponse['conversationId'])->toBe($first['conversationId']);
    expect($progressAfter->used_ids)->toBe($progressBefore->used_ids);
    expect($progressAfter->pending_ids)->toBe($progressBefore->pending_ids);
});
