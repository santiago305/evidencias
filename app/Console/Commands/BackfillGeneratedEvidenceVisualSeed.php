<?php

namespace App\Console\Commands;

use App\Models\GeneratedEvidence;
use App\Services\Evidence\EvidenceSeedService;
use App\Services\Evidence\EvidenceVisualSeedService;
use Illuminate\Console\Command;

class BackfillGeneratedEvidenceVisualSeed extends Command
{
    protected $signature = 'evidences:backfill-visual-seed
        {--dry-run : Solo muestra lo que haría, no guarda cambios}
        {--force : Recalcula aunque ya exista visualSeed}
        {--limit= : Limita la cantidad de evidencias a procesar}';

    protected $description = 'Congela la semilla visual antigua dentro de input_data para poder corregir datos sin cambiar apariencia.';

    public function handle(
        EvidenceSeedService $seedService,
        EvidenceVisualSeedService $visualSeedService,
    ): int {
        $dryRun = (bool) $this->option('dry-run');
        $force = (bool) $this->option('force');
        $limit = $this->option('limit') !== null ? (int) $this->option('limit') : null;

        $processed = 0;
        $updated = 0;
        $skipped = 0;
        $invalid = 0;

        $query = GeneratedEvidence::query()->orderBy('id');

        if ($limit !== null && $limit > 0) {
            $query->limit($limit);
        }

        $query->chunkById(100, function ($evidences) use (
            $seedService,
            $visualSeedService,
            $dryRun,
            $force,
            &$processed,
            &$updated,
            &$skipped,
            &$invalid,
            $limit,
        ): bool {
            foreach ($evidences as $evidence) {
                if ($limit !== null && $limit > 0 && $processed >= $limit) {
                    return false;
                }

                $processed++;
                $inputData = is_array($evidence->input_data) ? $evidence->input_data : [];

                if (! $force && trim((string) ($inputData['visualSeed'] ?? '')) !== '') {
                    $skipped++;

                    continue;
                }

                $decoded = $seedService->decodeSeedCode((string) $evidence->seed_code);

                if ($decoded === null) {
                    $invalid++;
                    $this->warn("ID {$evidence->id}: sal inválida, omitida.");

                    continue;
                }

                $previewSeed = $decoded['preview_seed'] !== null
                    ? (string) $decoded['preview_seed']
                    : strtoupper(substr(hash('sha256', (string) $evidence->seed_code), 0, 8));

                $visualSeed = $visualSeedService->buildLegacyVisualSeed($inputData, $previewSeed);

                $inputData['visualSeed'] = $visualSeed;
                $inputData['visualSeedHash'] = $visualSeedService->hashVisualSeed($visualSeed);
                $inputData['visualSeedVersion'] = 'legacy-v1';

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
        $this->info("Omitidas porque ya tenían visualSeed: {$skipped}");
        $this->info("Inválidas: {$invalid}");

        if ($dryRun) {
            $this->warn('Modo dry-run: no se guardó ningún cambio.');
        }

        return self::SUCCESS;
    }
}
