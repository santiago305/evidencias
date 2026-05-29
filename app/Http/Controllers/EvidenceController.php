<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenerateEvidenceRequest;
use App\Services\Evidence\EvidenceGeneratorService;
use Illuminate\Http\JsonResponse;

class EvidenceController extends Controller
{
    public function __construct(
        private readonly EvidenceGeneratorService $generatorService,
    ) {
    }

    public function generate(GenerateEvidenceRequest $request): JsonResponse
    {
        $result = $this->generatorService->generate($request->user(), $request->validated());

        return response()->json($result);
    }
}
