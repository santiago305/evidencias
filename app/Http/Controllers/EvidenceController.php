<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenerateEvidenceRequest;
use App\Services\Evidence\EvidenceGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        $validated = $request->validated();

        if ($request->hasFile('img_64')) {
            $image = $request->file('img_64');
            $extension = $image->getClientOriginalExtension() ?: 'png';
            $safeName = Str::slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME));
            $path = $image->storeAs(
                "contact-images/{$user->id}",
                Str::uuid()."-{$safeName}.{$extension}",
                'public',
            );

            $validated['img_64'] = Storage::disk('public')->url($path);
        }

        $result = $this->generatorService->generate($user, [
            ...$validated,
            'nombreAsesor' => $user->name,
            'dni' => $user->dni,
            'sexualidadAsesor' => $user->sexualidad,
        ]);

        return response()->json($result);
    }
}
