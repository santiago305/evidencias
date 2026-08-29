<?php

use App\Models\MobileDesign;
use App\Support\MobileDesignCatalog;
use Database\Seeders\DatabaseSeeder;

test('database seeding loads every catalog mobile design without duplicates', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DatabaseSeeder::class);

    $seededDesignKeys = MobileDesign::query()
        ->orderBy('design_key')
        ->pluck('design_key')
        ->all();

    $catalogDesignKeys = MobileDesignCatalog::keys();
    sort($catalogDesignKeys);

    expect($seededDesignKeys)->toBe($catalogDesignKeys)
        ->and(MobileDesign::query()->count())->toBe(count($catalogDesignKeys));
});
