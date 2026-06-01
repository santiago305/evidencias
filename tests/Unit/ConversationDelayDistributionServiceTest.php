<?php

use App\Services\Conversation\ConversationDelayDistributionService;

test('it distributes realistic delays based on speaker turns', function () {
    $service = new ConversationDelayDistributionService;

    for ($i = 0; $i < 20; $i += 1) {
        $delays = $service->distribute([
            ['side' => 'out', 'lines' => ['a']],
            ['side' => 'out', 'lines' => ['b']],
            ['side' => 'in', 'lines' => ['c']],
            ['side' => 'in', 'lines' => ['d']],
            ['side' => 'out', 'lines' => ['e']],
        ]);

        expect($delays)->toHaveCount(5);
        expect($delays[0])->toBe(0);
        expect($delays[1])->toBeIn([0, 2, 3, 4, 5]);
        expect($delays[2])->toBeGreaterThanOrEqual(6)->toBeLessThanOrEqual(720);
        expect($delays[3])->toBeIn([0, 2, 3, 4, 5]);
        expect($delays[4])->toBeGreaterThanOrEqual(6)->toBeLessThanOrEqual(720);
    }
});

test('it matches exact target duration when duration is provided', function () {
    $service = new ConversationDelayDistributionService;

    $messages = [
        ['side' => 'out', 'lines' => ['a']],
        ['side' => 'in', 'lines' => ['b']],
        ['side' => 'out', 'lines' => ['c']],
        ['side' => 'out', 'lines' => ['d']],
    ];

    $thirtyMinutes = $service->distribute($messages, 30);
    $twoHours = $service->distribute($messages, 120);

    expect(array_sum($thirtyMinutes))->toBe(30);
    expect(array_sum($twoHours))->toBe(120);
    expect($thirtyMinutes)->not->toBe($twoHours);
});

test('it keeps a single message at zero delay', function () {
    $service = new ConversationDelayDistributionService;

    expect($service->distribute([
        ['side' => 'out', 'lines' => ['Hola']],
    ]))->toBe([0]);
});
