<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
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
        ];
    }
}
