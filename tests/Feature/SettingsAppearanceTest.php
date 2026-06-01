<?php

use App\Models\User;

test('the appearance settings route is not available', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/settings/appearance')
        ->assertNotFound();
});
