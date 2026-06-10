<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $this->get('/inicio')->assertRedirect('/login');
});

test('authenticated users can visit the evidence generator page', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get('/inicio')->assertOk();
});

test('evidence generator receives available mobile designs in catalog order', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/inicio')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('evidence-generator')
            ->where('availableMobileDesigns', ['mobile-1', 'mobile-2'])
        );
});
