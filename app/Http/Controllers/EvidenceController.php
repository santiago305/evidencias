<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenerateEvidenceRequest;
use App\Services\Evidence\EvidenceGeneratorService;
use Illuminate\Http\JsonResponse;

class EvidenceController extends Controller
{
    public function __construct(
        private readonly EvidenceGeneratorService $generatorService,
    ) {}

    public function generate(GenerateEvidenceRequest $request): JsonResponse
    {
        $user = $request->user();
        if ($user === null) {
            abort(403);
        }

        $result = $this->generatorService->generate($user, [
            ...$request->validated(),
            'nombreAsesor' => $user->name,
            'dni' => $user->dni,
        ]);

        return response()->json($result);
    }
}
