<?php

use App\Models\Conversation;
use App\Models\User;
use App\Models\UserConversationProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function createTypedConversationForIsolationTest(string $code, string $type = 'whatsapp', string $status = 'production'): Conversation
{
    $conversation = Conversation::query()->create([
        'code' => $code,
        'type' => $type,
        'is_active' => true,
        'status' => $status,
    ]);

    $conversation->messages()->create([
        'position' => 1,
        'side' => 'out',
        'delay_minutes' => 0,
        'lines' => ["Mensaje {$code}"],
    ]);

    return $conversation;
}

function conversationIsolationEvidencePayload(array $overrides = []): array
{
    return [
        'telefono' => '999999999',
        'nombre' => 'Juan Perez',
        'dniCliente' => '12345678',
        'monto' => '1500',
        'tasa' => '2.5',
        'cuota' => '250',
        'plazo' => '12',
        'fechaHora' => '2026-05-29T10:30',
        'fechaHoraRegistro' => '2026-05-29T10:55',
        'duracion' => '8',
        ...$overrides,
    ];
}

test('conversation listing and creation are isolated by type', function () {
    $user = User::factory()->create();

    createTypedConversationForIsolationTest('WA-PROD', 'whatsapp');
    createTypedConversationForIsolationTest('WA-DEV', 'whatsapp', 'development');
    createTypedConversationForIsolationTest('SMS-PROD', 'sms');
    createTypedConversationForIsolationTest('SMS-DEV', 'sms', 'development');

    $this->actingAs($user)
        ->getJson(route('conversations.index', ['type' => 'whatsapp']))
        ->assertSuccessful()
        ->assertJsonCount(2, 'data')
        ->assertJsonMissing(['code' => 'SMS-PROD'])
        ->assertJsonMissing(['code' => 'SMS-DEV']);

    $this->actingAs($user)
        ->getJson(route('conversations.index', ['type' => 'sms']))
        ->assertSuccessful()
        ->assertJsonCount(2, 'data')
        ->assertJsonMissing(['code' => 'WA-PROD'])
        ->assertJsonMissing(['code' => 'WA-DEV']);

    $response = $this->actingAs($user)->postJson(route('conversations.store'), [
        'type' => 'sms',
        'status' => 'development',
        'messages' => [
            ['side' => 'out', 'lines' => ['Mensaje SMS']],
        ],
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('conversations', [
        'code' => $response->json('data.code'),
        'type' => 'sms',
        'status' => 'development',
    ]);

    $legacyConversation = Conversation::query()->create([
        'code' => 'LEGACY-WA',
        'is_active' => true,
        'status' => 'development',
    ]);
    expect($legacyConversation->fresh()->type)->toBe('whatsapp');
});

test('fixed conversations are isolated by type', function () {
    $user = User::factory()->create();

    $whatsappFixed = createTypedConversationForIsolationTest('WA-FIXED-1', 'whatsapp', 'fixed');
    $whatsappNext = createTypedConversationForIsolationTest('WA-FIXED-2', 'whatsapp', 'development');
    $smsFixed = createTypedConversationForIsolationTest('SMS-FIXED', 'sms', 'fixed');

    $this->actingAs($user)
        ->putJson(route('conversations.update', ['conversation' => $whatsappNext->id]), ['status' => 'fixed'])
        ->assertSuccessful();

    expect($whatsappFixed->fresh()->status)->toBe('development')
        ->and($whatsappNext->fresh()->status)->toBe('fixed')
        ->and($smsFixed->fresh()->status)->toBe('fixed');

    $smsNext = createTypedConversationForIsolationTest('SMS-FIXED-2', 'sms', 'development');

    $this->actingAs($user)
        ->putJson(route('conversations.update', ['conversation' => $smsNext->id]), ['status' => 'fixed'])
        ->assertSuccessful();

    expect($whatsappNext->fresh()->status)->toBe('fixed')
        ->and($smsFixed->fresh()->status)->toBe('development')
        ->and($smsNext->fresh()->status)->toBe('fixed');
});

test('production, development, and progress remain independent by type', function () {
    $user = User::factory()->create();

    createTypedConversationForIsolationTest('WA-PROD', 'whatsapp');
    createTypedConversationForIsolationTest('SMS-PROD', 'sms');
    createTypedConversationForIsolationTest('WA-DEV', 'whatsapp', 'development');
    createTypedConversationForIsolationTest('SMS-DEV', 'sms', 'development');

    $whatsapp = $this->actingAs($user)->postJson(route('evidences.generate'), conversationIsolationEvidencePayload([
        'conversationType' => 'whatsapp',
    ]));
    $whatsapp->assertSuccessful()->assertJsonPath('conversationId', 'WA-PROD');

    $sms = $this->actingAs($user)->postJson(route('evidences.generate'), conversationIsolationEvidencePayload([
        'conversationType' => 'sms',
    ]));
    $sms->assertSuccessful()->assertJsonPath('conversationId', 'SMS-PROD');

    expect(UserConversationProgress::query()->where('user_id', $user->id)->pluck('conversation_type')->sort()->values()->all())
        ->toBe(['sms', 'whatsapp']);

    $smsDevelopment = $this->actingAs($user)->postJson(route('evidences.generate'), conversationIsolationEvidencePayload([
        'conversationType' => 'sms',
        'conversationCode' => 'SMS-DEV',
    ]));
    $smsDevelopment->assertSuccessful()->assertJsonPath('conversationId', 'SMS-DEV');

    $wrongChannel = $this->actingAs($user)->postJson(route('evidences.generate'), conversationIsolationEvidencePayload([
        'conversationType' => 'sms',
        'conversationCode' => 'WA-DEV',
    ]));
    $wrongChannel->assertUnprocessable();
});
