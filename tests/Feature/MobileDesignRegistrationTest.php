<?php

use App\Models\MobileDesign;
use App\Models\User;
use Database\Seeders\MobileDesignSeeder;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

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

test('authenticated users can register mobile three globally', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('mobile-designs.store'), [
            'design_key' => 'mobile-3',
        ])
        ->assertSuccessful()
        ->assertJsonPath('data.design_key', 'mobile-3');

    $this->assertDatabaseHas('mobile_designs', [
        'design_key' => 'mobile-3',
    ]);

    $this->actingAs($user)
        ->postJson(route('mobile-designs.store'), [
            'design_key' => 'mobile-6',
        ])
        ->assertSuccessful()
        ->assertJsonPath('data.design_key', 'mobile-6');

    $this->assertDatabaseHas('mobile_designs', [
        'design_key' => 'mobile-6',
    ]);

    $this->actingAs($user)
        ->postJson(route('mobile-designs.store'), [
            'design_key' => 'mobile-7',
        ])
        ->assertSuccessful()
        ->assertJsonPath('data.design_key', 'mobile-7');

    $this->assertDatabaseHas('mobile_designs', [
        'design_key' => 'mobile-7',
    ]);
});

test('authenticated users can register mobile thirteen globally', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('mobile-designs.store'), [
            'design_key' => 'mobile-13',
        ])
        ->assertSuccessful()
        ->assertJsonPath('data.design_key', 'mobile-13');

    $this->assertDatabaseHas('mobile_designs', [
        'design_key' => 'mobile-13',
    ]);
});

test('authenticated users can register mobile fourteen globally', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('mobile-designs.store'), [
            'design_key' => 'mobile-14',
        ])
        ->assertSuccessful()
        ->assertJsonPath('data.design_key', 'mobile-14');

    $this->assertDatabaseHas('mobile_designs', [
        'design_key' => 'mobile-14',
    ]);
});

test('authenticated users can register mobile fifteen globally', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('mobile-designs.store'), [
            'design_key' => 'mobile-15',
        ])
        ->assertSuccessful()
        ->assertJsonPath('data.design_key', 'mobile-15');

    $this->assertDatabaseHas('mobile_designs', [
        'design_key' => 'mobile-15',
    ]);
});

test('mobile fifteen migration refuses rollback while user assignments exist', function () {
    $user = User::factory()->create();

    MobileDesign::query()->firstOrCreate(['design_key' => 'mobile-15']);
    DB::table('user_mobile_designs')->insert([
        'user_id' => $user->id,
        'design_key' => 'mobile-15',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    $migration = require database_path('migrations/2026_10_02_200916_add_mobile_15_to_mobile_designs_table.php');

    expect(fn () => $migration->down())
        ->toThrow(RuntimeException::class, 'Cannot roll back mobile-15 while existing user assignments use it.');

    $this->assertDatabaseHas('mobile_designs', ['design_key' => 'mobile-15']);
});

test('mobile fifteen migration removes its catalog row on rollback without assignments', function () {
    MobileDesign::query()->firstOrCreate(['design_key' => 'mobile-15']);
    $migration = require database_path('migrations/2026_10_02_200916_add_mobile_15_to_mobile_designs_table.php');

    $migration->down();

    $this->assertDatabaseMissing('mobile_designs', ['design_key' => 'mobile-15']);
});

test('registering the same mobile design twice is idempotent', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->postJson(route('mobile-designs.store'), [
        'design_key' => 'mobile-1',
    ])->assertSuccessful();
    $registeredDesignCount = MobileDesign::query()->count();

    $this->actingAs($user)->postJson(route('mobile-designs.store'), [
        'design_key' => 'mobile-1',
    ])->assertSuccessful();

    $this->assertDatabaseCount('mobile_designs', $registeredDesignCount);
});

test('unsupported catalog rows are not exposed as selectable designs', function () {
    $user = User::factory()->create();

    $this->seed(MobileDesignSeeder::class);
    MobileDesign::query()->create(['design_key' => 'mobile-legacy']);

    $this->actingAs($user)
        ->get('/inicio')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('evidence-generator')
            ->where('globalMobileDesigns', ['mobile-1', 'mobile-10', 'mobile-11', 'mobile-12', 'mobile-13', 'mobile-14', 'mobile-15', 'mobile-2', 'mobile-3', 'mobile-4', 'mobile-5', 'mobile-6', 'mobile-7', 'mobile-8', 'mobile-9'])
        );
});

test('unknown mobile designs cannot be registered globally', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('mobile-designs.store'), [
            'design_key' => 'mobile-x',
        ])
        ->assertUnprocessable();
});
