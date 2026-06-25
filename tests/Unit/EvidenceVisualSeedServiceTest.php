<?php

use App\Services\Evidence\EvidenceVisualSeedService;

test('it builds the legacy visual seed with the original field order', function () {
    $service = new EvidenceVisualSeedService;

    $seed = $service->buildLegacyVisualSeed([
        'telefono' => ' 969600585 ',
        'dniCliente' => '12345678',
        'dni' => '87654321',
        'nombre' => ' Juan Perez ',
        'nombreAsesor' => ' Ana Lopez ',
    ], 'ABC12345');

    expect($seed)->toBe('969600585|12345678|87654321|Juan Perez|Ana Lopez|ABC12345');
});

test('it skips empty legacy seed values', function () {
    $service = new EvidenceVisualSeedService;

    $seed = $service->buildLegacyVisualSeed([
        'telefono' => '',
        'dniCliente' => '12345678',
        'nombre' => null,
    ], 'ABC12345');

    expect($seed)->toBe('12345678|ABC12345');
});

test('it falls back when all seed values are empty', function () {
    $service = new EvidenceVisualSeedService;

    expect($service->buildLegacyVisualSeed([], ''))->toBe('preview-default');
});

test('it hashes the visual seed for verification', function () {
    $service = new EvidenceVisualSeedService;

    expect($service->hashVisualSeed('abc|123'))->toBe(hash('sha256', 'abc|123'));
});
