<?php

use App\Models\User;

test('profile settings screen can be rendered', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/settings/profile')->assertOk();
});

test('users can update their profile name and dni', function () {
    $user = User::factory()->create([
        'name' => 'Usuario Original',
        'dni' => '12345678',
    ]);

    $response = $this->actingAs($user)->patch('/settings/profile', [
        'name' => 'Ana Lopez',
        'dni' => '87654321',
    ]);

    $response->assertRedirect(route('profile.edit', absolute: false));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Ana Lopez',
        'dni' => '87654321',
    ]);
});
