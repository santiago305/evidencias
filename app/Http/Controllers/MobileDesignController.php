<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMobileDesignRequest;
use App\Models\MobileDesign;
use Illuminate\Http\JsonResponse;

class MobileDesignController extends Controller
{
    public function store(StoreMobileDesignRequest $request): JsonResponse
    {
        $mobileDesign = MobileDesign::firstOrCreate([
            'design_key' => $request->validated('design_key'),
        ]);

        return response()->json([
            'message' => 'Diseño móvil registrado correctamente.',
            'data' => [
                'id' => $mobileDesign->id,
                'design_key' => $mobileDesign->design_key,
            ],
        ]);
    }
}
