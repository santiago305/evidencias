<?php

use App\Models\User;

test('authenticated users can register a mobile design globally', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('mobile-designs.store'), [
            'design_key' => 'mobile-1',
        ])
        ->assertSuccessful()
        ->assertJsonPath('data.design_key', 'mobile-1');

    $this->assertDatabaseHas('mobile_designs', [
        'design_key' => 'mobile-1',
    ]);

    $this->assertDatabaseMissing('user_mobile_designs', [
        'user_id' => $user->id,
        'design_key' => 'mobile-1',
    ]);
});

test('authenticated users can register mobile two globally', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('mobile-designs.store'), [
            'design_key' => 'mobile-2',
        ])
        ->assertSuccessful()
        ->assertJsonPath('data.design_key', 'mobile-2');

    $this->assertDatabaseHas('mobile_designs', [
        'design_key' => 'mobile-2',
    ]);
});

test('registering the same mobile design twice is idempotent', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson(route('mobile-designs.store'), [
        'design_key' => 'mobile-1',
    ])->assertSuccessful();

    $this->actingAs($user)->postJson(route('mobile-designs.store'), [
        'design_key' => 'mobile-1',
    ])->assertSuccessful();

    $this->assertDatabaseCount('mobile_designs', 1);
});

test('unknown mobile designs cannot be registered globally', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('mobile-designs.store'), [
            'design_key' => 'mobile-x',
        ])
        ->assertUnprocessable();
});
