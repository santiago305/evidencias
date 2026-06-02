<?php

use App\Models\Conversation;
use App\Models\ConversationMessage;
use App\Models\User;
use App\Models\UserConversationProgress;
use Carbon\Carbon;

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

/**
 * @return array<string, string>
 */
function evidencePayload(): array
{
    return [
        'telefono' => '999999999',
        'nombre' => 'Juan Perez',
        'monto' => '1500',
        'tasa' => '2.5',
        'cuota' => '250',
        'plazo' => '12',
        'fechaHora' => '2026-05-29T10:30',
        'fechaHoraRegistro' => '2026-05-29T10:25',
        'duracion' => '8',
    ];
}

test('authenticated user can create a conversation manually', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson(route('conversations.store'), [
        'messages' => [
            [
                'side' => 'out',
                'lines' => ['Hola {cliente}'],
            ],
            [
                'side' => 'in',
                'lines' => ['Hola asesor'],
            ],
            [
                'side' => 'out',
                'lines' => ['Perfecto, gracias'],
            ],
            [
                'side' => 'in',
                'lines' => ['De nada'],
            ],
        ],
    ]);

    $response->assertCreated();
    $code = (string) $response->json('data.code');
    expect($code)->toStartWith('conv_');

    $this->assertDatabaseHas('conversations', ['code' => $code]);
    $this->assertDatabaseCount('conversation_messages', 4);

    $delays = ConversationMessage::query()
        ->whereHas('conversation', fn ($query) => $query->where('code', $code))
        ->orderBy('position')
        ->pluck('delay_minutes')
        ->all();

    expect($delays)->toHaveCount(4);
    expect($delays[0])->toBe(0);
    expect($delays[1])->toBeGreaterThanOrEqual(6)->toBeLessThanOrEqual(720);
    expect($delays[2])->toBeGreaterThanOrEqual(6)->toBeLessThanOrEqual(720);
    expect($delays[3])->toBeGreaterThanOrEqual(6)->toBeLessThanOrEqual(720);
});

test('authenticated user can list conversations ordered from newest to oldest', function () {
    $user = User::factory()->create();

    $first = createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Uno']],
    ]);
    $second = createConversationForTest('conv_002', [
        ['side' => 'in', 'delay_minutes' => 0, 'lines' => ['Dos']],
    ]);

    $response = $this->actingAs($user)->getJson(route('conversations.index'));

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                ['id', 'code', 'messages'],
            ],
        ]);

    $data = $response->json('data');

    expect($data)->toHaveCount(2);
    expect($data[0]['id'])->toBe($second->id);
    expect($data[1]['id'])->toBe($first->id);
});

test('authenticated user can update a conversation and replace its messages', function () {
    $user = User::factory()->create();

    $conversation = createConversationForTest('conv_edit_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Mensaje original']],
        ['side' => 'in', 'delay_minutes' => 15, 'lines' => ['Respuesta original']],
    ]);

    $response = $this->actingAs($user)->putJson(route('conversations.update', ['conversation' => $conversation->id]), [
        'messages' => [
            ['side' => 'out', 'lines' => ['Nuevo 1']],
            ['side' => 'in', 'lines' => ['Nuevo 2']],
            ['side' => 'out', 'lines' => ['Nuevo 3']],
        ],
    ]);

    $response->assertOk()
        ->assertJsonPath('data.id', $conversation->id)
        ->assertJsonPath('data.code', $conversation->code);

    $this->assertDatabaseHas('conversations', [
        'id' => $conversation->id,
        'code' => $conversation->code,
    ]);

    $this->assertDatabaseCount('conversation_messages', 3);

    $messages = ConversationMessage::query()
        ->where('conversation_id', $conversation->id)
        ->orderBy('position')
        ->get(['position', 'side', 'lines'])
        ->toArray();

    expect($messages)->toHaveCount(3);
    expect($messages[0]['position'])->toBe(1);
    expect($messages[0]['side'])->toBe('out');
    expect($messages[0]['lines'])->toBe(['Nuevo 1']);
    expect($messages[2]['position'])->toBe(3);
    expect($messages[2]['side'])->toBe('out');
    expect($messages[2]['lines'])->toBe(['Nuevo 3']);
});

test('generate evidence returns seed and rendered messages', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {cliente}']],
    ]);
    createConversationForTest('conv_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Buenos dias {cliente}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());

    $response->assertOk()
        ->assertJsonStructure([
            'conversationId',
            'seedCode',
            'messages' => [['side', 'time', 'lines']],
            'progress' => ['cycle', 'used', 'pending', 'total'],
            'trayProfile' => [
                'taskbarColor',
                'icons',
                'language' => ['top', 'bottom'],
                'languagePosition',
            ],
        ]);

    $this->assertDatabaseCount('generated_evidences', 1);
});

test('generate evidence renders client and advisor name aliases', function () {
    $user = User::factory()->create([
        'name' => 'MARIA ELENA LOPEZ',
    ]);

    createConversationForTest('conv_alias_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
        ['side' => 'out', 'delay_minutes' => 4, 'lines' => ['Primer nombre {primer_nombre_cliente}']],
        ['side' => 'out', 'delay_minutes' => 8, 'lines' => ['Soy {primer_nombre_asesor}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'nombre' => 'GEORGE SANTIAGO YACILA SANDOVAL',
    ]);

    $response->assertOk();

    $messages = $response->json('messages');

    expect($messages[0]['lines'][0])->toBe('Hola George Santiago Yacila Sandoval');
    expect($messages[1]['lines'][0])->toBe('Primer nombre George');
    expect($messages[2]['lines'][0])->toBe('Soy Maria');
});

test('generate evidence accepts the registration timestamp without advisor identity in the payload', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_registration_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {cliente}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        'telefono' => '999999999',
        'nombre' => 'Juan Perez',
        'monto' => '1500',
        'tasa' => '2.5',
        'cuota' => '250',
        'plazo' => '12',
        'fechaHora' => '2026-05-29T10:30',
        'fechaHoraRegistro' => '2026-05-29T10:25',
        'duracion' => '8',
    ]);

    $response->assertOk();
    $this->assertDatabaseCount('generated_evidences', 1);
});

test('windows tray profile is persisted and reused for the same user', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Uno']],
    ]);
    createConversationForTest('conv_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Dos']],
    ]);

    $firstResponse = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());
    $firstResponse->assertOk();

    $firstTrayProfile = $firstResponse->json('trayProfile');
    $firstIconKeys = array_values(array_map(fn (array $icon): string => (string) $icon['key'], $firstTrayProfile['icons']));
    expect($firstIconKeys)->toContain('wifi');
    expect($firstIconKeys)->not->toContain('internet');

    $user->refresh();
    expect($user->windows_tray_color)->not->toBeNull();
    expect($user->windows_tray_config)->toBeArray();

    $secondResponse = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());
    $secondResponse->assertOk();

    $secondTrayProfile = $secondResponse->json('trayProfile');

    expect($secondTrayProfile)->toBe($firstTrayProfile);
});

test('stored tray profile with internet icon is regenerated with wifi icon', function () {
    $user = User::factory()->create([
        'windows_tray_color' => '#223344',
        'windows_tray_config' => [
            'icons' => [
                ['key' => 'internet', 'glyph' => "\u{E774}", 'title' => 'Internet', 'className' => null, 'iconClassName' => 'text-[14px]'],
                ['key' => 'volume', 'glyph' => "\u{E995}", 'title' => 'Volumen', 'className' => 'min-w-5.5', 'iconClassName' => 'text-[13px]'],
            ],
            'language' => ['top' => 'ESP', 'bottom' => 'LAA'],
            'languagePosition' => 'next-to-hidden',
        ],
    ]);

    createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Uno']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());
    $response->assertOk();

    $trayProfile = $response->json('trayProfile');
    $iconKeys = array_values(array_map(fn (array $icon): string => (string) $icon['key'], $trayProfile['icons']));

    expect($iconKeys)->toContain('wifi');
    expect($iconKeys)->not->toContain('internet');
});

test('random generation does not repeat until cycle is completed', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Uno']],
    ]);
    createConversationForTest('conv_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Dos']],
    ]);

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->json();
    $second = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->json();

    expect($first['conversationId'])->not->toBe($second['conversationId']);
});

test('generating by seed reuses the same conversation without consuming bag and returns a new unique seed', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Uno']],
    ]);
    createConversationForTest('conv_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Dos']],
    ]);

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->json();

    $progressBefore = UserConversationProgress::query()->where('user_id', $user->id)->firstOrFail();

    $seedResponse = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'seedCode' => $first['seedCode'],
    ])->json();

    $progressAfter = UserConversationProgress::query()->where('user_id', $user->id)->firstOrFail();

    expect($seedResponse['conversationId'])->toBe($first['conversationId']);
    expect($seedResponse['seedCode'])->not->toBe($first['seedCode']);
    expect($progressAfter->used_ids)->toBe($progressBefore->used_ids);
    expect($progressAfter->pending_ids)->toBe($progressBefore->pending_ids);
});

test('different users start with different conversations when available', function () {
    createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Uno']],
    ]);
    createConversationForTest('conv_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Dos']],
    ]);
    createConversationForTest('conv_003', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Tres']],
    ]);

    $users = User::factory()->count(3)->create();
    $firstConversationByUser = [];

    foreach ($users as $user) {
        $response = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->json();
        $firstConversationByUser[$user->id] = $response['conversationId'];
    }

    expect(array_unique(array_values($firstConversationByUser)))->toHaveCount(3);

    $conversationCodeById = Conversation::query()->pluck('code', 'id');

    foreach (array_keys($firstConversationByUser) as $userId) {
        $progress = UserConversationProgress::query()->where('user_id', $userId)->firstOrFail();
        $startConversationId = $progress->getAttribute('start_conversation_id');

        expect($startConversationId)->not->toBeNull();
        expect($conversationCodeById->get($startConversationId))->toBe($firstConversationByUser[$userId]);
    }
});

test('user keeps same start conversation when a new cycle begins', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Uno']],
    ]);
    createConversationForTest('conv_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Dos']],
    ]);
    createConversationForTest('conv_003', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Tres']],
    ]);

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->json();
    $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->json();
    $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->json();
    $fourth = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->json();

    expect($fourth['conversationId'])->toBe($first['conversationId']);
});

test('generated conversation starts with a small delay and keeps duration from first message', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_time_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Inicio']],
        ['side' => 'in', 'delay_minutes' => 1, 'lines' => ['Fin']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'fechaHora' => '2026-05-29T10:30',
        'duracion' => '120',
    ]);

    $response->assertOk();

    $messages = $response->json('messages');

    expect($messages)->toBeArray();
    expect($messages)->toHaveCount(2);

    $baseDate = Carbon::parse('2026-05-29T10:30');
    $firstMessageAt = Carbon::parse($baseDate->format('Y-m-d').' '.$messages[0]['time']);
    $lastMessageAt = Carbon::parse($baseDate->format('Y-m-d').' '.$messages[1]['time']);

    if ($firstMessageAt->lessThan($baseDate)) {
        $firstMessageAt->addDay();
    }

    if ($lastMessageAt->lessThan($firstMessageAt)) {
        $lastMessageAt->addDay();
    }

    $firstDelayMinutes = $baseDate->diffInMinutes($firstMessageAt);
    $conversationDurationMinutes = $firstMessageAt->diffInMinutes($lastMessageAt);

    expect($firstDelayMinutes)->toBeGreaterThanOrEqual(3)->toBeLessThanOrEqual(10);
    expect((int) $conversationDurationMinutes)->toBe(120);
});
