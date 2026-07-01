<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $desktopThemeMode = $this->input(
            'evidence_desktop_theme_mode',
            $this->input('evidence_theme_mode', 'light'),
        );

        $this->merge([
            'evidence_theme_mode' => $desktopThemeMode,
            'evidence_desktop_theme_mode' => $desktopThemeMode,
            'evidence_mobile_theme_mode' => $this->input('evidence_mobile_theme_mode', $desktopThemeMode),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'dni' => [
                'required',
                'string',
                'digits:8',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'sexualidad' => ['required', Rule::in(['M', 'F'])],
            'mobile_design_key' => ['nullable', 'string', Rule::exists('mobile_designs', 'design_key')],
            'whatsapp_desktop_scale' => ['required', 'integer', Rule::in([80, 85, 90, 95, 100])],
            'evidence_theme_mode' => ['required', 'string', Rule::in(['light', 'dark'])],
            'evidence_desktop_theme_mode' => ['required', 'string', Rule::in(['light', 'dark'])],
            'evidence_mobile_theme_mode' => ['required', 'string', Rule::in(['light', 'dark'])],
            'evidence_device_mode' => ['required', 'string', Rule::in(['desktop', 'mobile', 'mixed'])],
        ];
    }
}
