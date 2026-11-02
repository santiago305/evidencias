<?php

use App\Models\Conversation;
use App\Services\Conversation\ConversationRenderService;

function createConversationRenderTimelineForTest(): Conversation
{
    $conversation = Conversation::query()->create([
        'code' => 'conversation-render-timeline',
        'type' => 'whatsapp',
        'is_active' => true,
        'status' => 'production',
    ]);

    $conversation->messages()->createMany(
        collect(range(1, 20))->map(fn (int $position): array => [
            'position' => $position,
            'side' => $position % 2 === 1 ? 'in' : 'out',
            'delay_minutes' => $position === 1
                ? 0
                : (in_array($position, [5, 9, 13, 17], true) ? 1440 : 5),
            'lines' => ["Mensaje {$position}"],
        ])->all(),
    );

    return $conversation->load('messages');
}

test('the conversation render service renders messages across several calendar days', function () {
    $conversation = createConversationRenderTimelineForTest();

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

test('an explicit duration overrides the configured conversation timeline', function () {
    $conversation = createConversationRenderTimelineForTest();

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
