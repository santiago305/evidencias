<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register with name and dni', function () {
    $name = 'Ana Lopez';
    $dni = '12345678';

    $response = $this->post('/register', [
        'name' => $name,
        'dni' => $dni,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home', absolute: false));
    $this->assertDatabaseHas('users', [
        'name' => $name,
        'dni' => $dni,
    ]);
});

test('users can not register without a name', function () {
    $response = $this->from('/register')->post('/register', [
        'dni' => '12345678',
    ]);

    $response->assertRedirect('/register');
    $response->assertSessionHasErrors('name');
    $this->assertGuest();
});

test('users can not register with duplicated dni', function () {
    $user = User::factory()->create();

    $response = $this->from('/register')->post('/register', [
        'name' => 'Ana Lopez',
        'dni' => $user->dni,
    ]);

    $response->assertRedirect('/register');
    $response->assertSessionHasErrors('dni');
    $this->assertGuest();
});
