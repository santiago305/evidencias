<?php

namespace App\Services\Evidence;

class EvidenceVisualSeedService
{
    /**
     * Reproduce exactamente el calculo antiguo de EvidenceGeneratorService::buildStateSeed().
     *
     * @param  array<string, mixed>  $input
     */
    public function buildLegacyVisualSeed(array $input, string $previewSeed): string
    {
        $values = [
            trim((string) ($input['telefono'] ?? '')),
            trim((string) ($input['dniCliente'] ?? '')),
            trim((string) ($input['dni'] ?? '')),
            trim((string) ($input['nombre'] ?? '')),
            trim((string) ($input['nombreAsesor'] ?? '')),
            $previewSeed,
        ];

        $normalized = array_values(array_filter(
            $values,
            static fn (string $value): bool => $value !== '',
        ));

        return $normalized === [] ? 'preview-default' : implode('|', $normalized);
    }

    /**
     * Reproduce exactamente el seed antiguo que React usaba para el color del avatar.
     *
     * @param  array<string, mixed>  $input
     */
    public function buildLegacyAvatarSeed(array $input, string $seedCode, string $conversationCode): string
    {
        $values = [
            trim((string) ($input['telefono'] ?? '')),
            trim((string) ($input['dniCliente'] ?? '')),
            trim((string) ($input['nombre'] ?? '')),
            trim($seedCode),
            trim($conversationCode),
            trim((string) ($input['nombreAsesor'] ?? '')),
        ];

        $normalized = array_values(array_filter(
            $values,
            static fn (string $value): bool => $value !== '',
        ));

        return $normalized === [] ? 'contact' : implode('|', $normalized);
    }

    public function hashVisualSeed(string $visualSeed): string
    {
        return hash('sha256', $visualSeed);
    }
}
