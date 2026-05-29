<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DniRegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'dni' => ['required', 'string', 'digits:8', Rule::unique(User::class, 'dni')],
        ]);

        $dni = $validated['dni'];

        $user = User::query()->create([
            'name' => "Usuario {$dni}",
            'dni' => $dni,
            'email' => "dni{$dni}@example.local",
            'password' => Str::random(40),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('home');
    }
}
