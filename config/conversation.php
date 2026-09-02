<?php

return [
    'registration_gap_minutes' => [
        'min' => (int) env('CONVERSATION_REGISTRATION_GAP_MINUTES_MIN', 3),
        'max' => (int) env('CONVERSATION_REGISTRATION_GAP_MINUTES_MAX', 10),
    ],
];
