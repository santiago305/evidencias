<?php

test('password reset and email verification routes are unavailable', function () {
    $this->get('/forgot-password')->assertNotFound();
    $this->get('/reset-password/token')->assertNotFound();
    $this->get('/verify-email')->assertNotFound();
    $this->get('/confirm-password')->assertNotFound();
});
