<?php

use App\Models\Conversation;
use App\Models\ConversationMessage;
use App\Models\User;
use Carbon\Carbon;

afterEach(function () {
    Carbon::setTestNow();
});

function createSnapshotConversation(string $code, array $messages): Conversation
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

function snapshotEvidencePayload(): array
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
    ];
}

test('generate evidence includes a preview snapshot and reproduces it from the seed', function () {
    Carbon::setTestNow(Carbon::parse('2026-06-09T12:34:00', 'America/Lima'));

    $user = User::factory()->create();

    createSnapshotConversation('conv_snapshot_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
        ['side' => 'in', 'delay_minutes' => 6, 'lines' => ['Hola asesor']],
    ]);
    createSnapshotConversation('conv_snapshot_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Buenos dias {nombre_cliente}']],
        ['side' => 'in', 'delay_minutes' => 12, 'lines' => ['Gracias']],
    ]);

    $firstResponse = $this->actingAs($user)->postJson(route('evidences.generate'), snapshotEvidencePayload());

    $firstResponse->assertOk()
        ->assertJsonStructure([
            'conversationId',
            'seedCode',
            'messages' => [['side', 'time', 'lines']],
            'previewSnapshot' => [
                'messageStatus',
                'temporalBehavior' => [
                    'showTemporaryIcon',
                    'showDefaultTemporalMessage',
                    'temporalStatusLabel',
                    'inlineTemporalMode',
                ],
                'inlineTemporalInsertIndex',
                'trayTime',
                'trayDate',
                'trayProfile' => [
                    'taskbarColor',
                    'icons',
                    'language' => ['top', 'bottom'],
                    'languagePosition',
                ],
            ],
        ]);

    $seedCode = (string) $firstResponse->json('seedCode');

    $seedReplayResponse = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...snapshotEvidencePayload(),
        'seedCode' => $seedCode,
    ]);

    $seedReplayResponse->assertOk();

    expect($seedReplayResponse->json('conversationId'))->toBe($firstResponse->json('conversationId'));
    expect($seedReplayResponse->json('messages'))->toBe($firstResponse->json('messages'));
    expect($seedReplayResponse->json('previewSnapshot'))->toBe($firstResponse->json('previewSnapshot'));
});
