<?php

use App\Models\Conversation;
use App\Models\ConversationMessage;
use App\Models\GeneratedEvidence;
use App\Models\User;
use App\Models\UserConversationProgress;
use App\Services\Conversation\ConversationRenderService;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

afterEach(function () {
    Carbon::setTestNow();
});

function createConversationForTest(string $code, array $messages, string $status = 'production'): Conversation
{
    $conversation = Conversation::query()->create([
        'code' => $code,
        'is_active' => true,
        'status' => $status,
    ]);

    foreach ($messages as $index => $message) {
        ConversationMessage::query()->create([
            'conversation_id' => $conversation->id,
            'position' => $index + 1,
            'side' => $message['side'],
            'delay_minutes' => $message['delay_minutes'],
            'lines' => $message['lines'],
            'reply_to_position' => $message['reply_to_position'] ?? null,
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

function fakePngUpload(string $name): UploadedFile
{
    $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=', true);

    return UploadedFile::fake()->createWithContent($name, $png === false ? '' : $png);
}

function workingMinutesBetween(Carbon $startDate, Carbon $endDate): int
{
    $clock = $startDate->copy();
    $minutes = 0;

    while ($clock->lessThan($endDate)) {
        $minutesSinceMidnight = ((int) $clock->format('H') * 60) + (int) $clock->format('i');

        if ($minutesSinceMidnight >= 420 && $minutesSinceMidnight < 1380) {
            $minutes++;
        }

        $clock->addMinute();
    }

    return $minutes;
}

test('authenticated user can create a conversation manually', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson(route('conversations.store'), [
        'messages' => [
            [
                'side' => 'out',
                'lines' => ['Hola {nombre_cliente}'],
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
    expect($response->json('data.status'))->toBe('development');

    $this->assertDatabaseHas('conversations', ['code' => $code, 'status' => 'development']);
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

test('authenticated user can create a development conversation manually', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson(route('conversations.store'), [
        'status' => 'development',
        'messages' => [
            [
                'side' => 'out',
                'lines' => ['Hola {nombre_cliente}'],
            ],
        ],
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.status', 'development');

    $this->assertDatabaseHas('conversations', [
        'code' => (string) $response->json('data.code'),
        'status' => 'development',
    ]);
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
        'status' => 'development',
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
        'status' => 'development',
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

test('authenticated user can update only a conversation status', function () {
    $user = User::factory()->create();

    $conversation = createConversationForTest('conv_status_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Mensaje original']],
        ['side' => 'in', 'delay_minutes' => 15, 'lines' => ['Respuesta original']],
    ], 'production');

    $response = $this->actingAs($user)->putJson(route('conversations.update', ['conversation' => $conversation->id]), [
        'status' => 'development',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.id', $conversation->id)
        ->assertJsonPath('data.status', 'development');

    $this->assertDatabaseHas('conversations', [
        'id' => $conversation->id,
        'status' => 'development',
    ]);

    $messages = ConversationMessage::query()
        ->where('conversation_id', $conversation->id)
        ->orderBy('position')
        ->get(['position', 'side', 'delay_minutes', 'lines'])
        ->toArray();

    expect($messages)->toHaveCount(2);
    expect($messages[0]['lines'])->toBe(['Mensaje original']);
    expect($messages[1]['delay_minutes'])->toBe(15);
});

test('marking a conversation as fixed clears the previous fixed conversation', function () {
    $user = User::factory()->create();

    $first = createConversationForTest('conv_fixed_previous_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Primera fija']],
    ], 'fixed');
    $second = createConversationForTest('conv_fixed_next_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Nueva fija']],
    ], 'development');

    $response = $this->actingAs($user)->putJson(route('conversations.update', ['conversation' => $second->id]), [
        'status' => 'fixed',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.id', $second->id)
        ->assertJsonPath('data.status', 'fixed');

    expect($first->fresh()->status)->toBe('development')
        ->and($second->fresh()->status)->toBe('fixed');
});

test('authenticated user can create a conversation with reply targets', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson(route('conversations.store'), [
        'messages' => [
            ['side' => 'out', 'lines' => ['Mensaje 1']],
            ['side' => 'in', 'lines' => ['Mensaje 2']],
            ['side' => 'out', 'lines' => ['Mensaje 3'], 'reply_to_position' => 2],
        ],
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.messages.2.reply_to_position', 2);

    $conversationId = (int) $response->json('data.id');
    $messages = ConversationMessage::query()
        ->where('conversation_id', $conversationId)
        ->orderBy('position')
        ->get(['position', 'reply_to_position']);

    expect($messages[0]->reply_to_position)->toBeNull();
    expect($messages[2]->reply_to_position)->toBe(2);
});

test('conversation reply target must be a previous message', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson(route('conversations.store'), [
        'messages' => [
            ['side' => 'out', 'lines' => ['Mensaje 1'], 'reply_to_position' => 1],
            ['side' => 'in', 'lines' => ['Mensaje 2']],
        ],
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('messages.0.reply_to_position');
});

test('generate evidence returns seed and rendered messages', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
    ]);
    createConversationForTest('conv_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Buenos dias {nombre_cliente}']],
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

    expect($response->json('messages.0.id_'))->toBe('ultimo_mensaje');

    $this->assertDatabaseCount('generated_evidences', 1);
});

test('generate evidence stores visual seed metadata for new evidences', function () {
    $user = User::factory()->create([
        'name' => 'Ana Lopez',
        'dni' => '87654321',
    ]);

    createConversationForTest('conv_visual_seed_new_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());

    $response->assertOk()
        ->assertJsonPath('visualSeedVersion', 'legacy-v1');

    $storedEvidence = GeneratedEvidence::query()->firstOrFail();
    $inputData = $storedEvidence->input_data;

    expect($inputData['visualSeed'])->toBeString()
        ->and($inputData['visualSeed'])->toContain('999999999|12345678|87654321|Juan Perez|Ana Lopez|')
        ->and($inputData['visualSeedHash'])->toBe(hash('sha256', $inputData['visualSeed']))
        ->and($inputData['visualSeedVersion'])->toBe('legacy-v1')
        ->and($response->json('visualSeed'))->toBe($inputData['visualSeed']);
});

test('generate evidence uses stored visual seed for preview snapshot when present', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_visual_seed_snapshot_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Telefono {telefono}']],
        ['side' => 'in', 'delay_minutes' => 1, 'lines' => ['Ok']],
    ]);

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'conversationCode' => 'conv_visual_seed_snapshot_001',
        'telefono' => '999999999',
    ])->json();

    $storedEvidence = GeneratedEvidence::query()->firstOrFail();
    $inputData = $storedEvidence->input_data;
    $inputData['visualSeed'] = 'frozen-seed-for-test';
    $inputData['visualSeedHash'] = hash('sha256', 'frozen-seed-for-test');
    $inputData['visualSeedVersion'] = 'legacy-v1';
    $storedEvidence->input_data = $inputData;
    $storedEvidence->save();

    $second = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'seedCode' => $first['seedCode'],
        'telefono' => '988888888',
    ])->json();

    expect($second['visualSeed'])->toBe('frozen-seed-for-test');
});

test('generate evidence by conversation code can render a development conversation', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_dev_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Prueba {nombre_cliente}']],
    ], 'development');

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'conversationCode' => 'conv_dev_001',
    ]);

    $response->assertOk()
        ->assertJsonPath('conversationId', 'conv_dev_001')
        ->assertJsonPath('messages.0.lines.0', 'Prueba Juan Perez');

    $this->assertDatabaseMissing('user_conversation_progress', [
        'user_id' => $user->id,
    ]);
});

test('random evidence generation skips development conversations', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_dev_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Desarrollo']],
    ], 'development');
    createConversationForTest('conv_prod_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Produccion']],
    ], 'production');

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());

    $response->assertOk()
        ->assertJsonPath('conversationId', 'conv_prod_001')
        ->assertJsonPath('messages.0.lines.0', 'Produccion');
});

test('normal evidence generation uses fixed conversation when one is configured', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_prod_uses_fixed_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Produccion random']],
    ], 'production');
    createConversationForTest('conv_fixed_uses_fixed_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Fija {nombre_cliente}']],
    ], 'fixed');

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());

    $response->assertOk()
        ->assertJsonPath('conversationId', 'conv_fixed_uses_fixed_001')
        ->assertJsonPath('messages.0.lines.0', 'Fija Juan Perez')
        ->assertJsonPath('progress.used', 0);

    $this->assertDatabaseMissing('user_conversation_progress', [
        'user_id' => $user->id,
    ]);

    $this->assertDatabaseHas('generated_evidences', [
        'user_id' => $user->id,
        'conversation_id' => Conversation::query()->where('code', 'conv_fixed_uses_fixed_001')->value('id'),
    ]);
});

test('normal evidence generation returns to production bag when no fixed conversation exists', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_dev_not_fixed_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Desarrollo']],
    ], 'development');
    createConversationForTest('conv_prod_after_fixed_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Produccion disponible']],
    ], 'production');

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());

    $response->assertOk()
        ->assertJsonPath('conversationId', 'conv_prod_after_fixed_001')
        ->assertJsonPath('progress.used', 1);

    $this->assertDatabaseHas('user_conversation_progress', [
        'user_id' => $user->id,
        'last_conversation_id' => Conversation::query()->where('code', 'conv_prod_after_fixed_001')->value('id'),
    ]);
});

test('generate evidence returns quote metadata for replied messages', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_quote_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
        ['side' => 'in', 'delay_minutes' => 6, 'lines' => ['Lo reviso'], 'reply_to_position' => 1],
        ['side' => 'out', 'delay_minutes' => 6, 'lines' => ['Gracias'], 'reply_to_position' => 2],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());

    $response->assertOk();

    $messages = $response->json('messages');

    expect($messages[1]['quote'])->toBe([
        'side' => 'out',
        'text' => 'Hola Juan Perez',
    ]);
    expect($messages[2]['quote'])->toBe([
        'side' => 'in',
        'text' => 'Lo reviso',
    ]);
});

test('generate evidence marks only the last rendered message with the final message id', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_last_message_id_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Primer mensaje']],
        ['side' => 'in', 'delay_minutes' => 6, 'lines' => ['Segundo mensaje']],
        ['side' => 'out', 'delay_minutes' => 6, 'lines' => ['Ultimo mensaje']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());

    $response->assertOk();

    $messages = $response->json('messages');

    expect($messages)->toHaveCount(3)
        ->and($messages[0])->not->toHaveKey('id_')
        ->and($messages[1])->not->toHaveKey('id_')
        ->and($messages[2]['id_'])->toBe('ultimo_mensaje');
});

test('generate evidence renders only canonical client and advisor name variables', function () {
    $user = User::factory()->create([
        'name' => 'MARIA ELENA LOPEZ',
    ]);

    createConversationForTest('conv_alias_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
        ['side' => 'out', 'delay_minutes' => 4, 'lines' => ['Primer nombre {primer_nombre_cliente}']],
        ['side' => 'out', 'delay_minutes' => 8, 'lines' => ['Asesor completo {nombre_asesor}']],
        ['side' => 'out', 'delay_minutes' => 12, 'lines' => ['Primer asesor {primer_nombre_asesor}']],
        ['side' => 'out', 'delay_minutes' => 16, 'lines' => ['Alias viejo {cliente} {asesor} {asesor_nombre}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'nombre' => 'GEORGE SANTIAGO YACILA SANDOVAL',
    ]);

    $response->assertOk();

    $messages = $response->json('messages');

    expect($messages[0]['lines'][0])->toBe('Hola George Santiago Yacila Sandoval');
    expect($messages[1]['lines'][0])->toBe('Primer nombre George');
    expect($messages[2]['lines'][0])->toBe('Asesor completo Maria Elena Lopez');
    expect($messages[3]['lines'][0])->toBe('Primer asesor Maria');
    expect($messages[4]['lines'][0])->toBe('Alias viejo {cliente} {asesor} {asesor_nombre}');
});

test('generate evidence renders client dni variable', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_dni_cliente_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['DNI cliente {dni_cliente}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'dniCliente' => '87654321',
    ]);

    $response->assertOk()
        ->assertJsonPath('messages.0.lines.0', 'DNI cliente 87654321');
});

test('generate evidence renders optional TCEA variable', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_tcea_variable_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['TCEA {TCEA}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'conversationCode' => 'conv_tcea_variable_001',
        'TCEA' => '45.20%',
    ]);

    $response->assertOk()
        ->assertJsonPath('messages.0.lines.0', 'TCEA 45.20%');
});

test('generate evidence keeps the submitted phone number when rendering phone variable', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_phone_variable_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Telefono cliente {telefono}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'conversationCode' => 'conv_phone_variable_001',
        'telefono' => '987654321',
    ]);

    $response->assertOk()
        ->assertJsonPath('messages.0.lines.0', 'Telefono cliente 987654321');
});

test('generate evidence renders amount variable with a flexible thousands separator', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_monto_variable_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Monto S/{monto}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'conversationCode' => 'conv_monto_variable_001',
        'monto' => '99999',
    ]);

    $response->assertOk();

    expect($response->json('messages.0.lines.0'))->toBeIn([
        'Monto S/99999',
        'Monto S/99,999',
        'Monto S/99 999',
    ]);
});

test('generate evidence can render four digit amount variable with a flexible thousands separator', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_monto_variable_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Monto S/{monto}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'conversationCode' => 'conv_monto_variable_002',
        'monto' => '3250',
    ]);

    $response->assertOk();

    expect($response->json('messages.0.lines.0'))->toBeIn([
        'Monto S/3250',
        'Monto S/3,250',
        'Monto S/3 250',
    ]);
});

test('generate evidence renders gendered advisor variables and capitalizes messages', function () {
    $user = User::factory()->create([
        'name' => 'ANA LOPEZ',
        'sexualidad' => 'F',
    ]);

    createConversationForTest('conv_gender_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['hola {saludo}']],
        ['side' => 'out', 'delay_minutes' => 4, 'lines' => ['{s_asesor(señor)} esto es asi']],
        ['side' => 'out', 'delay_minutes' => 8, 'lines' => ['{s_asesor(asesor)} asignada']],
        ['side' => 'out', 'delay_minutes' => 12, 'lines' => ['{s_asesor(estimado)} cliente']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());

    $response->assertOk();

    $messages = $response->json('messages');

    expect($messages[0]['lines'][0])->toBe('Hola buenos dias');
    expect($messages[1]['lines'][0])->toBe('Señorita esto es asi');
    expect($messages[2]['lines'][0])->toBe('Asesora asignada');
    expect($messages[3]['lines'][0])->toBe('Estimada cliente');
});

test('generate evidence keeps masculine advisor words for masculine users', function () {
    $user = User::factory()->create([
        'sexualidad' => 'M',
    ]);

    createConversationForTest('conv_gender_m_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['{s_asesor(señor)} {s_asesor(asesor)}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload());

    $response->assertOk()
        ->assertJsonPath('messages.0.lines.0', 'Señor asesor');
});

test('generate evidence requires an eight digit client dni', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_dni_cliente_validation_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['DNI cliente {dni_cliente}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'dniCliente' => '1234abcd',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrorFor('dniCliente');
});

test('generate evidence requires a nine digit phone starting with nine', function (string $telefono) {
    $user = User::factory()->create();

    createConversationForTest('conv_phone_validation_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Telefono {telefono}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'telefono' => $telefono,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrorFor('telefono');
})->with([
    'does not start with nine' => '899999999',
    'has eight digits' => '99999999',
    'has ten digits' => '9999999999',
    'contains letters' => '99999a999',
    'contains spaces' => '999 999999',
]);

test('generate evidence requires a positive numeric duration', function (string $duracion) {
    $user = User::factory()->create();

    createConversationForTest('conv_duration_validation_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Duracion {duracion}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'duracion' => $duracion,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrorFor('duracion');

    $this->assertDatabaseCount('generated_evidences', 0);
})->with([
    'letters' => 'abc',
    'zero' => '0',
    'negative' => '-5',
    'decimal' => '2.5',
]);

test('generate evidence requires valid chronological timestamps', function (array $overrides, string $field) {
    $user = User::factory()->create();

    createConversationForTest('conv_timestamp_validation_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        ...$overrides,
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrorFor($field);

    $this->assertDatabaseCount('generated_evidences', 0);
})->with([
    'invalid minimum timestamp' => [['fechaHora' => 'no-es-fecha'], 'fechaHora'],
    'invalid registration timestamp' => [['fechaHoraRegistro' => '2026/05/29 10:55'], 'fechaHoraRegistro'],
    'registration before minimum timestamp' => [['fechaHoraRegistro' => '2026-05-29T10:20'], 'fechaHoraRegistro'],
]);

test('generate evidence accepts the registration timestamp without advisor identity in the payload', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_registration_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
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
    ]);

    $response->assertOk();
    $this->assertDatabaseCount('generated_evidences', 1);
});

test('generate evidence accepts and stores an optional png contact image named with the client dni', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    createConversationForTest('conv_avatar_image_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
    ]);

    $response = $this->actingAs($user)->post(route('evidences.generate'), [
        ...evidencePayload(),
        'img_64' => fakePngUpload('12345678.png'),
    ], ['Accept' => 'application/json']);

    $response->assertOk();

    $storedEvidence = GeneratedEvidence::query()->firstOrFail();
    $storedImage = $storedEvidence->input_data['img_64'] ?? null;

    expect($storedImage)->toBeString()
        ->toContain('/storage/contact-images/'.$user->id.'/')
        ->toEndWith('.png');

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $storedImage));
});

test('generate evidence accepts a png file name without the client dni leading zero', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    createConversationForTest('conv_avatar_leading_zero_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
    ]);

    $response = $this->actingAs($user)->post(route('evidences.generate'), [
        ...evidencePayload(),
        'dniCliente' => '01234567',
        'img_64' => fakePngUpload('1234567.png'),
    ], ['Accept' => 'application/json']);

    $response->assertOk();
    $this->assertDatabaseCount('generated_evidences', 1);
});

test('generate evidence requires the png file name to match the client dni outside testing mode', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    createConversationForTest('conv_avatar_image_name_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
    ]);

    $response = $this->actingAs($user)->post(route('evidences.generate'), [
        ...evidencePayload(),
        'img_64' => fakePngUpload('87654321.png'),
    ], ['Accept' => 'application/json']);

    $response->assertUnprocessable()
        ->assertInvalid(['img_64']);

    Storage::disk('public')->assertMissing('contact-images/'.$user->id.'/87654321.png');
});

test('generate evidence allows a png file name mismatch in conversation testing mode', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    createConversationForTest('conv_avatar_testing_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
    ], 'development');

    $response = $this->actingAs($user)->post(route('evidences.generate'), [
        ...evidencePayload(),
        'conversationCode' => 'conv_avatar_testing_001',
        'img_64' => fakePngUpload('87654321.png'),
    ], ['Accept' => 'application/json']);

    $response->assertOk();

    $storedEvidence = GeneratedEvidence::query()->firstOrFail();

    expect($storedEvidence->input_data['img_64'] ?? null)->toContain('/storage/contact-images/'.$user->id.'/');
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

test('generating by seed reuses the same conversation and original seed without consuming bag or creating a new row', function () {
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
        'nombre' => 'Nombre Ignorado',
        'seedCode' => $first['seedCode'],
    ])->json();

    $progressAfter = UserConversationProgress::query()->where('user_id', $user->id)->firstOrFail();

    expect($seedResponse['conversationId'])->toBe($first['conversationId']);
    expect($seedResponse['seedCode'])->toBe($first['seedCode']);
    expect($seedResponse['messages'])->toBe($first['messages']);
    expect($progressAfter->used_ids)->toBe($progressBefore->used_ids);
    expect($progressAfter->pending_ids)->toBe($progressBefore->pending_ids);
    expect(GeneratedEvidence::query()->count())->toBe(1);
});

test('generate evidence by seed accepts only the seed code', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_seed_only_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Telefono {telefono}']],
    ]);

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->json();

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        'seedCode' => $first['seedCode'],
    ]);

    $response->assertOk()
        ->assertJsonPath('seedCode', $first['seedCode']);
});

test('generate evidence by seed returns right info visibility for older stored evidence', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_old_snapshot_right_info_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
    ]);

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->assertOk()->json();

    $evidence = GeneratedEvidence::query()
        ->where('seed_code', $first['seedCode'])
        ->firstOrFail();

    $inputData = $evidence->input_data;
    unset($inputData['showRightInfoPanel']);
    $evidence->input_data = $inputData;
    $evidence->save();

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        'seedCode' => $first['seedCode'],
    ])->assertOk();

    expect($response->json('previewSnapshot.showRightInfoPanel'))->toBeBool();
    expect(GeneratedEvidence::query()->count())->toBe(1);
});

test('generate evidence by seed allows correcting phone while preserving visual seed and snapshot', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_seed_phone_edit_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Telefono {telefono}']],
        ['side' => 'in', 'delay_minutes' => 1, 'lines' => ['Ok']],
    ]);

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'telefono' => '969600585',
    ])->json();

    $second = $this->actingAs($user)->postJson(route('evidences.generate'), [
        'seedCode' => $first['seedCode'],
        'telefono' => '988888888',
    ])->json();

    expect($second['messages'][0]['lines'][0])->toBe('Telefono 988888888')
        ->and($second['visualSeed'])->toBe($first['visualSeed'])
        ->and($second['previewSnapshot']['messageStatus'])->toBe($first['previewSnapshot']['messageStatus'])
        ->and($second['previewSnapshot']['temporalBehavior'])->toBe($first['previewSnapshot']['temporalBehavior'])
        ->and($second['previewSnapshot']['inlineTemporalInsertIndex'])->toBe($first['previewSnapshot']['inlineTemporalInsertIndex']);

    expect(GeneratedEvidence::query()->count())->toBe(1);
});

test('generate evidence by seed can add TCEA to an older stored evidence', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_seed_tcea_edit_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['TCEA {TCEA}']],
    ]);

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->assertOk()->json();

    $storedEvidence = GeneratedEvidence::query()
        ->where('seed_code', $first['seedCode'])
        ->firstOrFail();

    expect($storedEvidence->input_data)->not->toHaveKey('TCEA');

    $second = $this->actingAs($user)->postJson(route('evidences.generate'), [
        'seedCode' => $first['seedCode'],
        'TCEA' => '45.20%',
    ])->assertOk()->json();

    expect($second['messages'][0]['lines'][0])->toBe('TCEA 45.20%');
    expect($storedEvidence->fresh()->input_data['TCEA'])->toBe('45.20%');
    expect(GeneratedEvidence::query()->count())->toBe(1);
});

test('generate evidence by seed ignores attempted visual seed override', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_seed_visual_override_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola']],
    ]);

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), evidencePayload())->json();

    $second = $this->actingAs($user)->postJson(route('evidences.generate'), [
        'seedCode' => $first['seedCode'],
        'visualSeed' => 'malicious-change',
        'visualSeedHash' => hash('sha256', 'malicious-change'),
        'visualSeedVersion' => 'legacy-v1',
    ])->json();

    expect($second['visualSeed'])->toBe($first['visualSeed']);
});

test('replay preserves stored avatar seed when editable phone changes', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_seed_avatar_phone_edit_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Telefono {telefono}']],
    ]);

    $first = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'telefono' => '969600585',
        'dniCliente' => '12345678',
        'dni' => '87654321',
        'nombre' => 'Juan Perez',
        'nombreAsesor' => 'Ana Lopez',
    ])->assertOk()->json();

    $evidence = GeneratedEvidence::query()
        ->where('seed_code', $first['seedCode'])
        ->firstOrFail();

    $inputData = $evidence->input_data;
    $inputData['avatarSeed'] = '969600585|12345678|Juan Perez|'.$first['seedCode'].'|'.$first['conversationId'].'|Ana Lopez';
    $inputData['avatarSeedHash'] = hash('sha256', $inputData['avatarSeed']);
    $inputData['avatarSeedVersion'] = 'legacy-avatar-v1';
    $evidence->input_data = $inputData;
    $evidence->save();

    $second = $this->actingAs($user)->postJson(route('evidences.generate'), [
        'seedCode' => $first['seedCode'],
        'telefono' => '999999999',
    ])->assertOk()->json();

    expect($second['messages'][0]['lines'][0])->toBe('Telefono 999999999')
        ->and($second['avatarSeed'])->toBe($inputData['avatarSeed'])
        ->and($second['avatarSeedHash'])->toBe(hash('sha256', $inputData['avatarSeed']))
        ->and($second['avatarSeedVersion'])->toBe('legacy-avatar-v1');
});

test('authenticated user can fetch stored evidence payload by seed', function () {
    $user = User::factory()->create();

    $conversation = createConversationForTest('conv_lookup_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
    ]);

    $generatedAt = Carbon::parse('2026-06-25 09:15:00', 'America/Lima');

    $evidence = GeneratedEvidence::query()->create([
        'user_id' => $user->id,
        'conversation_id' => $conversation->id,
        'seed_code' => 'SEED-LOOKUP-001',
        'input_data' => [
            ...evidencePayload(),
            'previewSeed' => 'abc12345',
        ],
        'generated_at' => $generatedAt,
    ]);

    $response = $this->actingAs($user)->getJson(route('evidences.show-by-seed', ['seedCode' => $evidence->seed_code]));

    $response->assertOk()
        ->assertJson([
            'seedCode' => 'SEED-LOOKUP-001',
            'conversationId' => $conversation->id,
            'generatedAt' => $evidence->fresh()->generated_at?->toJSON(),
            'inputData' => [
                ...evidencePayload(),
                'previewSeed' => 'abc12345',
            ],
        ]);
});

test('authenticated user cannot fetch another users stored evidence payload by seed', function () {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();

    $conversation = createConversationForTest('conv_lookup_002', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Hola {nombre_cliente}']],
    ]);

    $evidence = GeneratedEvidence::query()->create([
        'user_id' => $owner->id,
        'conversation_id' => $conversation->id,
        'seed_code' => 'SEED-LOOKUP-002',
        'input_data' => evidencePayload(),
        'generated_at' => Carbon::parse('2026-06-25 10:00:00', 'America/Lima'),
    ]);

    $response = $this->actingAs($viewer)->getJson(route('evidences.show-by-seed', ['seedCode' => $evidence->seed_code]));

    $response->assertNotFound();
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

test('generated conversation finishes before registration time and keeps duration backwards', function () {
    Carbon::setTestNow(Carbon::parse('2026-06-09T12:34:00', 'America/Lima'));

    $user = User::factory()->create();

    createConversationForTest('conv_time_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Inicio']],
        ['side' => 'in', 'delay_minutes' => 1, 'lines' => ['Fin']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'fechaHora' => '2026-06-02T15:00',
        'fechaHoraRegistro' => '2026-06-02T17:00',
        'duracion' => '100',
    ]);

    $response->assertOk();
    $response->assertJsonPath('previewSnapshot.trayTime', '12:34');
    $response->assertJsonPath('previewSnapshot.trayDate', '09/06/2026');

    $messages = $response->json('messages');

    expect($messages)->toBeArray();
    expect($messages)->toHaveCount(2);

    $minimumDate = Carbon::parse('2026-06-02T15:00');
    $registrationDate = Carbon::parse('2026-06-02T17:00');
    $firstMessageAt = Carbon::parse($minimumDate->format('Y-m-d').' '.$messages[0]['time']);
    $lastMessageAt = Carbon::parse($minimumDate->format('Y-m-d').' '.$messages[1]['time']);

    if ($firstMessageAt->greaterThan($registrationDate)) {
        $firstMessageAt->subDay();
    }

    if ($lastMessageAt->greaterThan($registrationDate)) {
        $lastMessageAt->subDay();
    }

    if ($lastMessageAt->lessThan($firstMessageAt)) {
        $lastMessageAt->addDay();
    }

    $conversationDurationMinutes = $firstMessageAt->diffInMinutes($lastMessageAt);
    $lastMessageRegistrationGap = $lastMessageAt->diffInMinutes($registrationDate);

    expect($firstMessageAt->greaterThanOrEqualTo($minimumDate))->toBeTrue();
    expect($lastMessageAt->lessThan($registrationDate))->toBeTrue();
    expect((int) $lastMessageRegistrationGap)->toBeGreaterThanOrEqual(3)->toBeLessThanOrEqual(10);
    expect((int) $conversationDurationMinutes)->toBe(100);
});

test('generated conversation consumes long duration backwards without using advisor quiet hours', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_long_duration_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Inicio']],
        ['side' => 'in', 'delay_minutes' => 1, 'lines' => ['Cliente responde']],
        ['side' => 'out', 'delay_minutes' => 1, 'lines' => ['Asesor responde']],
        ['side' => 'in', 'delay_minutes' => 1, 'lines' => ['Fin']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'fechaHora' => '2026-06-09T08:21',
        'fechaHoraRegistro' => '2026-06-10T09:35',
        'duracion' => '530',
    ]);

    $response->assertOk();

    $messages = $response->json('messages');
    expect($messages)->toBeArray()->toHaveCount(4);

    $firstMessageAt = Carbon::parse($messages[0]['dateKey'].' '.$messages[0]['time']);
    $lastMessageAt = Carbon::parse($messages[3]['dateKey'].' '.$messages[3]['time']);
    $registrationDate = Carbon::parse('2026-06-10T09:35');

    expect($lastMessageAt->lessThan($registrationDate))->toBeTrue();
    expect((int) $lastMessageAt->diffInMinutes($registrationDate))->toBeGreaterThanOrEqual(3)->toBeLessThanOrEqual(10);
    expect($firstMessageAt->format('Y-m-d'))->toBe('2026-06-09');
    expect(((int) $firstMessageAt->format('H') * 60) + (int) $firstMessageAt->format('i'))->toBeBetween(995, 1002);
    expect(workingMinutesBetween($firstMessageAt, $lastMessageAt))->toBe(530);

    foreach ($messages as $message) {
        $messageAt = Carbon::parse($message['dateKey'].' '.$message['time']);
        $minutesSinceMidnight = ((int) $messageAt->format('H') * 60) + (int) $messageAt->format('i');

        expect($minutesSinceMidnight)->toBeGreaterThanOrEqual(420)->toBeLessThan(1380);
    }
});

test('generated conversation uses the minimum registration gap when duration barely fits', function () {
    $conversation = createConversationForTest('conv_tight_registration_gap_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Inicio']],
        ['side' => 'in', 'delay_minutes' => 1, 'lines' => ['Fin']],
    ]);

    $messages = app(ConversationRenderService::class)->render($conversation, [
        ...evidencePayload(),
        'fechaHora' => '2026-06-10T08:52',
        'fechaHoraRegistro' => '2026-06-10T09:43',
        'duracion' => '48',
        'previewSeed' => 'tight',
    ]);

    expect($messages)->toHaveCount(2);
    expect($messages[0]['dateKey'])->toBe('2026-06-10');
    expect($messages[0]['time'])->toBe('08:52');
    expect($messages[1]['dateKey'])->toBe('2026-06-10');
    expect($messages[1]['time'])->toBe('09:40');
});

test('generated conversation includes a date key for each rendered message', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_date_key_001', [
        ['side' => 'in', 'delay_minutes' => 0, 'lines' => ['Inicio']],
        ['side' => 'out', 'delay_minutes' => 2, 'lines' => ['Cambio de dia']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'fechaHora' => '2026-06-02T22:45',
        'fechaHoraRegistro' => '2026-06-03T07:15',
        'duracion' => '20',
    ]);

    $response->assertOk()
        ->assertJsonPath('messages.0.dateKey', '2026-06-02')
        ->assertJsonPath('messages.1.dateKey', '2026-06-03');
});

test('rendered advisor replies wait until working hours after overnight client messages', function () {
    $conversation = createConversationForTest('conv_night_hours_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Inicio']],
        ['side' => 'in', 'delay_minutes' => 132, 'lines' => ['Cliente responde de madrugada']],
        ['side' => 'out', 'delay_minutes' => 14, 'lines' => ['Respuesta asesor']],
    ]);

    $messages = app(ConversationRenderService::class)->render($conversation, [
        ...evidencePayload(),
        'fechaHora' => '2026-06-02T23:15',
        'fechaHoraRegistro' => '2026-06-03T08:00',
        'duracion' => '',
        'previewSeed' => 'night5',
    ]);

    expect($messages[0]['side'])->toBe('out');
    expect($messages[0]['time'])->toBe('07:00');
    expect($messages[0]['dateKey'])->toBe('2026-06-03');
    expect($messages[1]['side'])->toBe('in');
    expect($messages[1]['time'])->toBe('09:12');
    expect($messages[1]['dateKey'])->toBe('2026-06-03');
    expect($messages[2]['side'])->toBe('out');
    expect($messages[2]['time'])->toBe('09:26');
    expect($messages[2]['dateKey'])->toBe('2026-06-03');
});

test('generated conversation rejects durations that start before the minimum timestamp', function () {
    $user = User::factory()->create();

    createConversationForTest('conv_time_invalid_001', [
        ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Inicio']],
        ['side' => 'in', 'delay_minutes' => 1, 'lines' => ['Fin']],
    ]);

    $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
        ...evidencePayload(),
        'fechaHora' => '2026-06-02T15:00',
        'fechaHoraRegistro' => '2026-06-02T17:00',
        'duracion' => '180',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrorFor('duracion');
});
