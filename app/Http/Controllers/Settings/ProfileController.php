<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\MobileDesign;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/profile', [
            'availableMobileDesigns' => MobileDesign::query()
                ->orderBy('design_key')
                ->pluck('design_key')
                ->values()
                ->map(fn (string $designKey): array => [
                    'key' => $designKey,
                    'label' => str($designKey)->replace('-', ' ')->title()->toString(),
                    'status' => 'registered',
                ]),
            'selectedMobileDesignKey' => $user?->mobileDesigns()
                ->orderBy('design_key')
                ->value('design_key'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $mobileDesignKey = $validated['mobile_design_key'] ?? null;
        unset($validated['mobile_design_key']);

        $request->user()->fill($validated);

        $request->user()->save();
        $request->user()->mobileDesigns()->delete();

        if ($mobileDesignKey !== null) {
            $request->user()->mobileDesigns()->create([
                'design_key' => $mobileDesignKey,
            ]);
        }

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
