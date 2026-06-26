<?php

namespace App\Console\Commands;

use App\Models\GeneratedEvidence;
use App\Services\Evidence\EvidenceVisualSeedService;
use Illuminate\Console\Command;

class BackfillGeneratedEvidenceAvatarSeed extends Command
{
    protected $signature = 'evidences:backfill-avatar-seed
        {--dry-run : Solo muestra lo que haría, no guarda cambios}
        {--force : Recalcula aunque ya exista avatarSeed}
        {--limit= : Limita la cantidad de evidencias a procesar}';

    protected $description = 'Congela la semilla antigua del avatar dentro de input_data para poder corregir teléfonos sin cambiar el color del avatar.';

    public function handle(EvidenceVisualSeedService $visualSeedService): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $force = (bool) $this->option('force');
        $limit = $this->option('limit') !== null ? (int) $this->option('limit') : null;

        $processed = 0;
        $updated = 0;
        $skipped = 0;

        $query = GeneratedEvidence::query()
            ->with('conversation')
            ->orderBy('id');

        if ($limit !== null && $limit > 0) {
            $query->limit($limit);
        }

        $query->chunkById(100, function ($evidences) use (
            $visualSeedService,
            $dryRun,
            $force,
            $limit,
            &$processed,
            &$updated,
            &$skipped,
        ): bool {
            foreach ($evidences as $evidence) {
                if ($limit !== null && $limit > 0 && $processed >= $limit) {
                    return false;
                }

                $processed++;

                $inputData = is_array($evidence->input_data)
                    ? $evidence->input_data
                    : [];

                if (! $force && trim((string) ($inputData['avatarSeed'] ?? '')) !== '') {
                    $skipped++;

                    continue;
                }

                $conversationCode = (string) ($evidence->conversation?->code ?? $evidence->conversation_id);

                $avatarSeed = $visualSeedService->buildLegacyAvatarSeed(
                    $inputData,
                    (string) $evidence->seed_code,
                    $conversationCode,
                );

                $inputData['avatarSeed'] = $avatarSeed;
                $inputData['avatarSeedHash'] = $visualSeedService->hashVisualSeed($avatarSeed);
                $inputData['avatarSeedVersion'] = 'legacy-avatar-v1';

                if (! $dryRun) {
                    $evidence->input_data = $inputData;
                    $evidence->save();
                }

                $updated++;
            }

            return true;
        });

        $this->info("Procesadas: {$processed}");
        $this->info("Actualizadas: {$updated}");
        $this->info("Omitidas porque ya tenían avatarSeed: {$skipped}");

        if ($dryRun) {
            $this->warn('Modo dry-run: no se guardó ningún cambio.');
        }

        return self::SUCCESS;
    }
}
