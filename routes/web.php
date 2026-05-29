<?php

use App\Http\Controllers\ConversationController;
use App\Http\Controllers\EvidenceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('home')
        : redirect()->route('login');
})->name('root');

Route::middleware(['auth'])->group(function () {
    Route::get('/inicio', function () {
        return Inertia::render('evidence-generator');
    })->name('home');

    Route::get('/api/conversations', [ConversationController::class, 'index'])->name('conversations.index');
    Route::post('/api/conversations', [ConversationController::class, 'store'])->name('conversations.store');
    Route::post('/api/evidences/generate', [EvidenceController::class, 'generate'])->name('evidences.generate');
});

require __DIR__.'/auth.php';
