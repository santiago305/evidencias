<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get('/inicio')->assertRedirect('/login');
});

test('authenticated users can visit the evidence generator page', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get('/inicio')->assertOk();
});
