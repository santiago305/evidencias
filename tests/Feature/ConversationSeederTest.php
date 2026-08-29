<?php

use App\Models\Conversation;
use App\Services\Conversation\ConversationRenderService;
use Database\Seeders\ConversationSeeder;

test('the demo conversation seeder renders messages across several calendar days', function () {
    $this->seed(ConversationSeeder::class);

    $conversation = Conversation::query()
        ->with('messages')
        ->where('code', 'CONVERSACION-DEMO-001')
        ->firstOrFail();

    expect($conversation->messages)->toHaveCount(20)
        ->and($conversation->messages->where('side', 'in'))->toHaveCount(10)
        ->and($conversation->messages->where('side', 'out'))->toHaveCount(10)
        ->and($conversation->messages->where('delay_minutes', '>', 720)->count())->toBeGreaterThanOrEqual(3);

    $messages = app(ConversationRenderService::class)->render($conversation, [
        'fechaHora' => '2026-08-25T09:00',
        'fechaHoraRegistro' => '2026-08-29T18:00',
        'previewSeed' => 'conversation-seeder-multiple-days',
        'nombre' => 'Sheyla',
        'nombreAsesor' => 'Santiago',
    ]);

    expect(collect($messages)->pluck('dateKey')->unique())->toHaveCount(5);
});

test('an explicit duration overrides the demo conversation timeline', function () {
    $this->seed(ConversationSeeder::class);

    $conversation = Conversation::query()
        ->with('messages')
        ->where('code', 'CONVERSACION-DEMO-001')
        ->firstOrFail();

    $messages = app(ConversationRenderService::class)->render($conversation, [
        'fechaHora' => '2026-08-29T08:00',
        'fechaHoraRegistro' => '2026-08-29T18:00',
        'duracion' => '120',
        'previewSeed' => 'conversation-seeder-explicit-duration',
        'nombre' => 'Sheyla',
        'nombreAsesor' => 'Santiago',
    ]);

    expect(collect($messages)->pluck('dateKey')->unique())->toHaveCount(1);
});
