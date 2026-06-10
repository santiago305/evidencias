<?php

use App\Models\MobileDesign;
use App\Models\User;

test('profile settings screen can be rendered', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/settings/profile')->assertOk();
});

test('users can update their profile name and dni', function () {
    $user = User::factory()->create([
        'name' => 'Usuario Original',
        'dni' => '12345678',
        'sexualidad' => 'M',
    ]);

    $response = $this->actingAs($user)->patch('/settings/profile', [
        'name' => 'Ana Lopez',
        'dni' => '87654321',
        'sexualidad' => 'F',
        'whatsapp_desktop_scale' => 80,
    ]);

    $response->assertRedirect(route('profile.edit', absolute: false));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Ana Lopez',
        'dni' => '87654321',
        'sexualidad' => 'F',
        'whatsapp_desktop_scale' => 80,
    ]);
});

test('new users default to eighty percent WhatsApp desktop scale', function () {
    $user = User::factory()->create();

    expect($user->refresh()->whatsapp_desktop_scale)->toBe(80);
});

test('users can update their WhatsApp desktop scale from profile settings', function () {
    $user = User::factory()->create([
        'whatsapp_desktop_scale' => 80,
    ]);

    $this->actingAs($user)->patch('/settings/profile', [
        'name' => $user->name,
        'dni' => $user->dni,
        'sexualidad' => $user->sexualidad,
        'whatsapp_desktop_scale' => 90,
    ])->assertRedirect(route('profile.edit', absolute: false));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'whatsapp_desktop_scale' => 90,
    ]);
});

test('users cannot choose an unsupported WhatsApp desktop scale', function () {
    $user = User::factory()->create([
        'whatsapp_desktop_scale' => 80,
    ]);

    $this->actingAs($user)->patch('/settings/profile', [
        'name' => $user->name,
        'dni' => $user->dni,
        'sexualidad' => $user->sexualidad,
        'whatsapp_desktop_scale' => 75,
    ])->assertSessionHasErrors('whatsapp_desktop_scale');

    expect($user->refresh()->whatsapp_desktop_scale)->toBe(80);
});

test('users can choose their mobile design from profile settings', function () {
    $user = User::factory()->create();
    MobileDesign::create([
        'design_key' => 'mobile-1',
    ]);

    $this->actingAs($user)->patch('/settings/profile', [
        'name' => $user->name,
        'dni' => $user->dni,
        'sexualidad' => $user->sexualidad,
        'mobile_design_key' => 'mobile-1',
        'whatsapp_desktop_scale' => 80,
    ])->assertRedirect(route('profile.edit', absolute: false));

    $this->assertDatabaseHas('user_mobile_designs', [
        'user_id' => $user->id,
        'design_key' => 'mobile-1',
    ]);
});

test('users can remove their selected mobile design from profile settings', function () {
    $user = User::factory()->create();
    MobileDesign::create([
        'design_key' => 'mobile-1',
    ]);
    $user->mobileDesigns()->create([
        'design_key' => 'mobile-1',
    ]);

    $this->actingAs($user)->patch('/settings/profile', [
        'name' => $user->name,
        'dni' => $user->dni,
        'sexualidad' => $user->sexualidad,
        'mobile_design_key' => null,
        'whatsapp_desktop_scale' => 80,
    ])->assertRedirect(route('profile.edit', absolute: false));

    $this->assertDatabaseMissing('user_mobile_designs', [
        'user_id' => $user->id,
        'design_key' => 'mobile-1',
    ]);
});
