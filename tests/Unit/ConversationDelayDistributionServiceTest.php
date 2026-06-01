<?php

use App\Services\Conversation\ConversationDelayDistributionService;

test('it distributes total minutes into randomized gaps with a minimum of six minutes', function () {
    $service = new ConversationDelayDistributionService;

    for ($i = 0; $i < 20; $i += 1) {
        $delays = $service->distribute(30, 4);

        expect($delays)->toHaveCount(4);
        expect($delays[0])->toBe(0);
        expect(array_sum($delays))->toBe(30);
        expect($delays[1])->toBeGreaterThanOrEqual(6);
        expect($delays[2])->toBeGreaterThanOrEqual(6);
        expect($delays[3])->toBeGreaterThanOrEqual(6);
    }
});

test('it keeps a single message at zero delay', function () {
    $service = new ConversationDelayDistributionService;

    expect($service->distribute(12, 1))->toBe([0]);
});
