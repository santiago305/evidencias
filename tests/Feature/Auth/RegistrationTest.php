<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register with dni', function () {
    $dni = '12345678';

    $response = $this->post('/register', [
        'dni' => $dni,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home', absolute: false));
    $this->assertDatabaseHas('users', [
        'dni' => $dni,
        'email' => "dni{$dni}@example.local",
    ]);
});

test('users can not register with duplicated dni', function () {
    $user = User::factory()->create();

    $response = $this->from('/register')->post('/register', [
        'dni' => $user->dni,
    ]);

    $response->assertRedirect('/register');
    $response->assertSessionHasErrors('dni');
    $this->assertGuest();
});
