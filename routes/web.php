<?php

use App\Http\Controllers\ConversationController;
use App\Http\Controllers\EvidenceController;
use App\Http\Controllers\MobileDesignController;
use App\Models\MobileDesign;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('home')
        : redirect()->route('login');
})->name('root');

Route::middleware(['auth'])->group(function () {
    Route::get('/inicio', function () {
        $user = auth()->user();

        return Inertia::render('evidence-generator', [
            'globalMobileDesigns' => MobileDesign::query()
                ->orderBy('design_key')
                ->pluck('design_key')
                ->values(),
            'registeredMobileDesigns' => $user?->mobileDesigns()
                ->orderBy('design_key')
                ->pluck('design_key')
                ->values() ?? [],
        ]);
    })->name('home');

    Route::get('/api/conversations', [ConversationController::class, 'index'])->name('conversations.index');
    Route::post('/api/conversations', [ConversationController::class, 'store'])->name('conversations.store');
    Route::put('/api/conversations/{conversation}', [ConversationController::class, 'update'])->name('conversations.update');
    Route::post('/api/mobile-designs', [MobileDesignController::class, 'store'])->name('mobile-designs.store');
    Route::post('/api/evidences/generate', [EvidenceController::class, 'generate'])->name('evidences.generate');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
