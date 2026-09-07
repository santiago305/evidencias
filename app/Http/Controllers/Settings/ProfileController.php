<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\MobileDesign;
use App\Support\MobileDesignCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        $globalDesignKeys = MobileDesignCatalog::filterSupported(
            MobileDesign::query()->orderBy('design_key')->pluck('design_key')->all(),
        );
        $selectedDesignKey = MobileDesignCatalog::filterSupported(
            [$user?->mobileDesigns()->orderBy('design_key')->value('design_key')],
        )[0] ?? null;

        return Inertia::render('settings/profile', [
            'availableMobileDesigns' => MobileDesignCatalog::registeredDefinitions($globalDesignKeys),
            'selectedMobileDesignKey' => in_array($selectedDesignKey, $globalDesignKeys, true) ? $selectedDesignKey : null,
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

        if ($mobileDesignKey === null) {
            $validated['evidence_device_mode'] = 'desktop';
        }

        $validated['evidence_theme_mode'] = $validated['evidence_desktop_theme_mode'];

        DB::transaction(function () use ($request, $validated, $mobileDesignKey): void {
            $request->user()->fill($validated)->save();
            $request->user()->mobileDesigns()->delete();

            if ($mobileDesignKey !== null) {
                $request->user()->mobileDesigns()->create([
                    'design_key' => $mobileDesignKey,
                ]);
            }
        });

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
