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
        'evidence_theme_mode' => 'light',
        'evidence_device_mode' => 'desktop',
    ]);

    $response->assertRedirect(route('profile.edit', absolute: false));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Ana Lopez',
        'dni' => '87654321',
        'sexualidad' => 'F',
        'whatsapp_desktop_scale' => 80,
        'evidence_theme_mode' => 'light',
        'evidence_device_mode' => 'desktop',
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
        'evidence_theme_mode' => 'light',
        'evidence_device_mode' => 'desktop',
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
        'evidence_theme_mode' => 'light',
        'evidence_device_mode' => 'desktop',
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
        'evidence_theme_mode' => 'light',
        'evidence_device_mode' => 'desktop',
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
        'evidence_theme_mode' => 'light',
        'evidence_device_mode' => 'mobile',
    ])->assertRedirect(route('profile.edit', absolute: false));

    $this->assertDatabaseMissing('user_mobile_designs', [
        'user_id' => $user->id,
        'design_key' => 'mobile-1',
    ]);

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'evidence_device_mode' => 'desktop',
    ]);
});

test('users can update their evidence appearance preferences from profile settings', function () {
    $user = User::factory()->create([
        'evidence_theme_mode' => 'light',
        'evidence_device_mode' => 'desktop',
    ]);
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
        'mobile_design_key' => 'mobile-1',
        'whatsapp_desktop_scale' => 80,
        'evidence_theme_mode' => 'dark',
        'evidence_device_mode' => 'mobile',
    ])->assertRedirect(route('profile.edit', absolute: false));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'evidence_theme_mode' => 'dark',
        'evidence_device_mode' => 'mobile',
    ]);
});

test('users can update desktop and mobile evidence themes independently from profile settings', function () {
    $user = User::factory()->create([
        'evidence_theme_mode' => 'light',
        'evidence_device_mode' => 'desktop',
    ]);
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
        'mobile_design_key' => 'mobile-1',
        'whatsapp_desktop_scale' => 80,
        'evidence_theme_mode' => 'light',
        'evidence_desktop_theme_mode' => 'dark',
        'evidence_mobile_theme_mode' => 'light',
        'evidence_device_mode' => 'mixed',
    ])->assertRedirect(route('profile.edit', absolute: false));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'evidence_theme_mode' => 'dark',
        'evidence_desktop_theme_mode' => 'dark',
        'evidence_mobile_theme_mode' => 'light',
        'evidence_device_mode' => 'mixed',
    ]);
});

test('users can choose mixed evidence device mode from profile settings', function () {
    $user = User::factory()->create([
        'evidence_device_mode' => 'desktop',
    ]);
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
        'mobile_design_key' => 'mobile-1',
        'whatsapp_desktop_scale' => 80,
        'evidence_theme_mode' => 'light',
        'evidence_device_mode' => 'mixed',
    ])->assertRedirect(route('profile.edit', absolute: false));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'evidence_device_mode' => 'mixed',
    ]);
});

test('users cannot choose unsupported evidence appearance preferences', function () {
    $user = User::factory()->create([
        'evidence_theme_mode' => 'light',
        'evidence_device_mode' => 'desktop',
    ]);

    $this->actingAs($user)->patch('/settings/profile', [
        'name' => $user->name,
        'dni' => $user->dni,
        'sexualidad' => $user->sexualidad,
        'whatsapp_desktop_scale' => 80,
        'evidence_theme_mode' => 'system',
        'evidence_desktop_theme_mode' => 'system',
        'evidence_mobile_theme_mode' => 'sepia',
        'evidence_device_mode' => 'tablet',
    ])->assertSessionHasErrors(['evidence_theme_mode', 'evidence_desktop_theme_mode', 'evidence_mobile_theme_mode', 'evidence_device_mode']);

    expect($user->refresh()->evidence_theme_mode)->toBe('light')
        ->and($user->evidence_device_mode)->toBe('desktop');
});
